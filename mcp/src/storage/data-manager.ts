import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { BestPractice, Collection, SearchQuery, BestPracticeSchema, CollectionSchema } from '../types/schema.js';
import Fuse from 'fuse.js';

export class DataManager {
  private practicesPath: string;
  private collectionsPath: string;
  private indexPath: string;
  private practices: Map<string, BestPractice> = new Map();
  private collections: Map<string, Collection> = new Map();
  private searchIndex: Fuse<BestPractice> | null = null;

  constructor(dataDir: string = './data') {
    this.practicesPath = join(dataDir, 'practices');
    this.collectionsPath = join(dataDir, 'collections');
    this.indexPath = join(dataDir, 'index.json');
  }

  /**
   * Initialize the data manager and load existing data
   */
  async initialize(): Promise<void> {
    await this.ensureDirectories();
    await this.loadPractices();
    await this.loadCollections();
    this.buildSearchIndex();
  }

  /**
   * Ensure required directories exist
   */
  private async ensureDirectories(): Promise<void> {
    const dirs = [
      this.practicesPath,
      this.collectionsPath,
      dirname(this.indexPath)
    ];

    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }
  }

  /**
   * Load all practices from disk
   */
  private async loadPractices(): Promise<void> {
    try {
      const files = await fs.readdir(this.practicesPath);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      for (const file of jsonFiles) {
        try {
          const content = await fs.readFile(join(this.practicesPath, file), 'utf-8');
          const data = JSON.parse(content);
          const practice = BestPracticeSchema.parse(data);
          this.practices.set(practice.id, practice);
        } catch (error) {
          console.warn(`Failed to load practice from ${file}:`, error);
        }
      }
    } catch (error) {
      console.warn('Failed to load practices directory:', error);
    }
  }

  /**
   * Load all collections from disk
   */
  private async loadCollections(): Promise<void> {
    try {
      const files = await fs.readdir(this.collectionsPath);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      for (const file of jsonFiles) {
        try {
          const content = await fs.readFile(join(this.collectionsPath, file), 'utf-8');
          const data = JSON.parse(content);
          const collection = CollectionSchema.parse(data);
          this.collections.set(collection.id, collection);
        } catch (error) {
          console.warn(`Failed to load collection from ${file}:`, error);
        }
      }
    } catch (error) {
      console.warn('Failed to load collections directory:', error);
    }
  }

  /**
   * Build search index for full-text search
   */
  private buildSearchIndex(): void {
    const practices = Array.from(this.practices.values());
    
    this.searchIndex = new Fuse(practices, {
      keys: [
        { name: 'title', weight: 0.3 },
        { name: 'description', weight: 0.2 },
        { name: 'problem', weight: 0.2 },
        { name: 'solution', weight: 0.2 },
        { name: 'tags', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    });
  }

  /**
   * Save a best practice
   */
  async savePractice(practice: BestPractice): Promise<void> {
    // Validate the practice
    const validatedPractice = BestPracticeSchema.parse(practice);
    
    // Update in-memory store
    this.practices.set(validatedPractice.id, validatedPractice);
    
    // Save to disk
    const filename = `${validatedPractice.id}.json`;
    const filepath = join(this.practicesPath, filename);
    await fs.writeFile(filepath, JSON.stringify(validatedPractice, null, 2));
    
    // Rebuild search index
    this.buildSearchIndex();
  }

  /**
   * Save a collection
   */
  async saveCollection(collection: Collection): Promise<void> {
    // Validate the collection
    const validatedCollection = CollectionSchema.parse(collection);
    
    // Update in-memory store
    this.collections.set(validatedCollection.id, validatedCollection);
    
    // Save to disk
    const filename = `${validatedCollection.id}.json`;
    const filepath = join(this.collectionsPath, filename);
    await fs.writeFile(filepath, JSON.stringify(validatedCollection, null, 2));
  }

  /**
   * Get a practice by ID
   */
  getPractice(id: string): BestPractice | undefined {
    return this.practices.get(id);
  }

  /**
   * Get a collection by ID
   */
  getCollection(id: string): Collection | undefined {
    return this.collections.get(id);
  }

  /**
   * Get all practices
   */
  getAllPractices(): BestPractice[] {
    return Array.from(this.practices.values());
  }

  /**
   * Get all collections
   */
  getAllCollections(): Collection[] {
    return Array.from(this.collections.values());
  }

  /**
   * Search practices based on query
   */
  searchPractices(query: SearchQuery): BestPractice[] {
    let results = Array.from(this.practices.values());

    // Apply filters
    if (query.technology && query.technology.length > 0) {
      results = results.filter(p => query.technology!.includes(p.technology));
    }

    if (query.category && query.category.length > 0) {
      results = results.filter(p => query.category!.includes(p.category));
    }

    if (query.priority && query.priority.length > 0) {
      results = results.filter(p => query.priority!.includes(p.priority));
    }

    if (query.status && query.status.length > 0) {
      results = results.filter(p => query.status!.includes(p.status));
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter(p => 
        query.tags!.some(tag => p.tags.includes(tag))
      );
    }

    if (query.author) {
      results = results.filter(p => 
        p.author.toLowerCase().includes(query.author!.toLowerCase())
      );
    }

    if (query.implementation_complexity && query.implementation_complexity.length > 0) {
      results = results.filter(p => 
        query.implementation_complexity!.includes(p.implementation_complexity)
      );
    }

    if (query.created_after) {
      results = results.filter(p => p.created_at >= query.created_after!);
    }

    if (query.created_before) {
      results = results.filter(p => p.created_at <= query.created_before!);
    }

    // Apply full-text search if query provided
    if (query.query && this.searchIndex) {
      const searchResults = this.searchIndex.search(query.query);
      const searchIds = new Set(searchResults.map(r => r.item.id));
      results = results.filter(p => searchIds.has(p.id));
    }

    // Sort by relevance (priority, then updated date)
    results.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    // Apply pagination
    const start = query.offset || 0;
    const end = start + (query.limit || 20);
    
    return results.slice(start, end);
  }

  /**
   * Get practices by technology
   */
  getPracticesByTechnology(technology: string): BestPractice[] {
    return Array.from(this.practices.values())
      .filter(p => p.technology === technology);
  }

  /**
   * Get practices by category
   */
  getPracticesByCategory(category: string): BestPractice[] {
    return Array.from(this.practices.values())
      .filter(p => p.category === category);
  }

  /**
   * Get related practices
   */
  getRelatedPractices(practiceId: string): BestPractice[] {
    const practice = this.practices.get(practiceId);
    if (!practice || !practice.related_practices) {
      return [];
    }

    return practice.related_practices
      .map(id => this.practices.get(id))
      .filter((p): p is BestPractice => p !== undefined);
  }

  /**
   * Delete a practice
   */
  async deletePractice(id: string): Promise<boolean> {
    const practice = this.practices.get(id);
    if (!practice) {
      return false;
    }

    // Remove from memory
    this.practices.delete(id);
    
    // Remove from disk
    try {
      const filename = `${id}.json`;
      const filepath = join(this.practicesPath, filename);
      await fs.unlink(filepath);
    } catch (error) {
      console.warn(`Failed to delete practice file for ${id}:`, error);
    }

    // Rebuild search index
    this.buildSearchIndex();
    
    return true;
  }

  /**
   * Delete a collection
   */
  async deleteCollection(id: string): Promise<boolean> {
    const collection = this.collections.get(id);
    if (!collection) {
      return false;
    }

    // Remove from memory
    this.collections.delete(id);
    
    // Remove from disk
    try {
      const filename = `${id}.json`;
      const filepath = join(this.collectionsPath, filename);
      await fs.unlink(filepath);
    } catch (error) {
      console.warn(`Failed to delete collection file for ${id}:`, error);
    }
    
    return true;
  }

  /**
   * Get statistics about the knowledge base
   */
  getStats(): {
    totalPractices: number;
    totalCollections: number;
    practicesByTechnology: Record<string, number>;
    practicesByCategory: Record<string, number>;
    practicesByPriority: Record<string, number>;
    practicesByStatus: Record<string, number>;
  } {
    const practices = Array.from(this.practices.values());
    
    const practicesByTechnology: Record<string, number> = {};
    const practicesByCategory: Record<string, number> = {};
    const practicesByPriority: Record<string, number> = {};
    const practicesByStatus: Record<string, number> = {};

    for (const practice of practices) {
      practicesByTechnology[practice.technology] = (practicesByTechnology[practice.technology] || 0) + 1;
      practicesByCategory[practice.category] = (practicesByCategory[practice.category] || 0) + 1;
      practicesByPriority[practice.priority] = (practicesByPriority[practice.priority] || 0) + 1;
      practicesByStatus[practice.status] = (practicesByStatus[practice.status] || 0) + 1;
    }

    return {
      totalPractices: practices.length,
      totalCollections: this.collections.size,
      practicesByTechnology,
      practicesByCategory,
      practicesByPriority,
      practicesByStatus
    };
  }
}