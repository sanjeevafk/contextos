import fs from 'fs';
import path from 'path';
import { CompanyMemory, ProposedMemory } from '../types';

const MEMORY_FILE_PATH = path.join(process.cwd(), 'data', 'memories.json');

// Default initial company memories (baseline institutional memory)
const INITIAL_MEMORIES: CompanyMemory[] = [
  {
    id: 'MEM-AUTH-019',
    title: 'SAML SSO Session Expiry Threshold for Healthcare Tenants',
    rootCause: 'Short session refresh intervals (< 15 mins) triggered auth loops on Epic EMR embedded iframes.',
    affectedService: 'auth-service',
    affectedCustomer: 'St. Jude Health & Enterprise Med',
    relatedIncidents: ['INC-1402', 'INC-1550'],
    resolution: 'Enforced 60-minute minimal token lease with sliding renewal for iframe embedded clients.',
    safeguards: [
      'Do not reduce token expiry below 3600s for tenants with tag enterprise-healthcare.',
      'Always test iframe parent-window postMessage ping before releasing auth changes.'
    ],
    sourceReferences: [
      {
        id: 'doc-auth-09',
        sourceType: 'docs',
        title: 'DOC-AUTH-09: Healthcare SAML & Embedded Browser Constraints',
        url: 'https://wiki.freshcorp.internal/display/AUTH/DOC-AUTH-09'
      }
    ],
    tags: ['auth', 'saml', 'healthcare', 'session-timeout'],
    createdAt: '2024-03-10T11:00:00Z',
    version: 1,
    createdBy: 'ContextOS Institutional Extractor',
    status: 'active',
    reuseCount: 14
  }
];

class CompanyMemoryStore {
  private memories: CompanyMemory[] = [];
  private isLoaded = false;

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(MEMORY_FILE_PATH)) {
        const raw = fs.readFileSync(MEMORY_FILE_PATH, 'utf-8');
        this.memories = JSON.parse(raw);
        this.isLoaded = true;
      } else {
        this.memories = [...INITIAL_MEMORIES];
        this.saveToDisk();
      }
    } catch (e) {
      console.warn('Could not read memory file, initializing default memories:', e);
      this.memories = [...INITIAL_MEMORIES];
    }
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(MEMORY_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(MEMORY_FILE_PATH, JSON.stringify(this.memories, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save memories to disk:', e);
    }
  }

  public getAll(): CompanyMemory[] {
    this.loadFromDisk();
    return this.memories;
  }

  public getById(id: string): CompanyMemory | undefined {
    this.loadFromDisk();
    return this.memories.find((m) => m.id === id);
  }

  public create(proposed: ProposedMemory, author = 'ContextOS Agent'): CompanyMemory {
    this.loadFromDisk();
    
    // Check if duplicate already exists
    const existing = this.memories.find(
      (m) => m.title.toLowerCase() === proposed.title.toLowerCase() ||
             (m.affectedCustomer === proposed.affectedCustomer && m.affectedService === proposed.affectedService && m.tags.some(t => proposed.tags.includes(t)))
    );

    if (existing) {
      existing.version += 1;
      existing.updatedAt = new Date().toISOString();
      existing.rootCause = proposed.rootCause;
      existing.resolution = proposed.resolution;
      existing.safeguards = Array.from(new Set([...existing.safeguards, ...proposed.safeguards]));
      this.saveToDisk();
      return existing;
    }

    const nextNumber = this.memories.length + 1;
    const pad = String(nextNumber).padStart(3, '0');
    const category = proposed.affectedService.split('-')[0].toUpperCase() || 'SYS';
    const id = `MEM-${category}-${pad}`;

    const newMemory: CompanyMemory = {
      ...proposed,
      id,
      createdAt: new Date().toISOString(),
      version: 1,
      createdBy: author,
      status: 'active',
      reuseCount: 0
    };

    this.memories.unshift(newMemory);
    this.saveToDisk();
    return newMemory;
  }

  public search(query: string, filterService?: string): { memory: CompanyMemory; matchScore: number }[] {
    this.loadFromDisk();
    const queryTokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);

    const matches = this.memories
      .map((mem) => {
        const text = `${mem.title} ${mem.rootCause} ${mem.affectedCustomer} ${mem.affectedService} ${mem.safeguards.join(' ')} ${mem.tags.join(' ')} ${mem.relatedIncidents.join(' ')}`.toLowerCase();
        
        let score = 0;
        for (const token of queryTokens) {
          if (text.includes(token)) {
            score += 2.0;
          }
        }

        // Entity bonuses
        if (query.toLowerCase().includes('acme') && text.includes('acme')) score += 5.0;
        if (query.toLowerCase().includes('payment') && text.includes('payment')) score += 3.0;
        if (query.toLowerCase().includes('config') || query.toLowerCase().includes('changing')) {
          if (text.includes('safeguard') || text.includes('override') || text.includes('timeout')) score += 3.0;
        }

        if (filterService && mem.affectedService.toLowerCase() !== filterService.toLowerCase()) {
          score *= 0.5;
        }

        return { memory: mem, matchScore: score };
      })
      .filter((m) => m.matchScore > 2.0)
      .sort((a, b) => b.matchScore - a.matchScore);

    return matches;
  }

  public recordReuse(id: string) {
    const memory = this.getById(id);
    if (memory) {
      memory.reuseCount = (memory.reuseCount || 0) + 1;
      this.saveToDisk();
    }
  }

  public reset() {
    this.memories = [...INITIAL_MEMORIES];
    this.saveToDisk();
  }
}

export const memoryStore = new CompanyMemoryStore();
