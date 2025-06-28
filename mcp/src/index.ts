#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { DataManager } from './storage/data-manager.js';
import { 
  SearchQuery, 
  SearchQuerySchema, 
  BestPracticeSchema,
  CollectionSchema,
  TECHNOLOGIES,
  CATEGORIES,
  PRIORITIES,
  STATUSES
} from './types/schema.js';
import chalk from 'chalk';

class BestPracticesMCPServer {
  private server: Server;
  private dataManager: DataManager;

  constructor() {
    this.server = new Server(
      {
        name: 'best-practices-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.dataManager = new DataManager();
    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error(chalk.red('[MCP Error]'), error);
    };

    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\\n[MCP Server] Shutting down gracefully...'));
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_practices',
            description: 'Search best practices using flexible criteria including text search, technology, category, priority, status, and more',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Full-text search query for titles, descriptions, problems, solutions, and tags'
                },
                technology: {
                  type: 'array',
                  items: { type: 'string', enum: TECHNOLOGIES },
                  description: 'Filter by technologies (nextjs, react, typescript, etc.)'
                },
                category: {
                  type: 'array',
                  items: { type: 'string', enum: CATEGORIES },
                  description: 'Filter by categories (performance, security, testing, etc.)'
                },
                priority: {
                  type: 'array',
                  items: { type: 'string', enum: PRIORITIES },
                  description: 'Filter by priority level (critical, high, medium, low)'
                },
                status: {
                  type: 'array',
                  items: { type: 'string', enum: STATUSES },
                  description: 'Filter by implementation status'
                },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Filter by tags'
                },
                author: {
                  type: 'string',
                  description: 'Filter by author name'
                },
                implementation_complexity: {
                  type: 'array',
                  items: { type: 'string', enum: ['low', 'medium', 'high'] },
                  description: 'Filter by implementation complexity'
                },
                limit: {
                  type: 'number',
                  minimum: 1,
                  maximum: 100,
                  default: 20,
                  description: 'Maximum number of results to return'
                },
                offset: {
                  type: 'number',
                  minimum: 0,
                  default: 0,
                  description: 'Number of results to skip for pagination'
                }
              }
            }
          },
          {
            name: 'get_practice',
            description: 'Get a specific best practice by its ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'The unique identifier of the practice'
                }
              },
              required: ['id']
            }
          },
          {
            name: 'get_practices_by_technology',
            description: 'Get all practices for a specific technology',
            inputSchema: {
              type: 'object',
              properties: {
                technology: {
                  type: 'string',
                  enum: TECHNOLOGIES,
                  description: 'The technology to filter by'
                }
              },
              required: ['technology']
            }
          },
          {
            name: 'get_practices_by_category',
            description: 'Get all practices for a specific category',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  enum: CATEGORIES,
                  description: 'The category to filter by'
                }
              },
              required: ['category']
            }
          },
          {
            name: 'get_related_practices',
            description: 'Get practices related to a specific practice',
            inputSchema: {
              type: 'object',
              properties: {
                practice_id: {
                  type: 'string',
                  description: 'The ID of the practice to find related practices for'
                }
              },
              required: ['practice_id']
            }
          },
          {
            name: 'add_practice',
            description: 'Add a new best practice to the knowledge base',
            inputSchema: {
              type: 'object',
              properties: {
                practice: {
                  type: 'object',
                  description: 'The best practice object following the BestPractice schema'
                }
              },
              required: ['practice']
            }
          },
          {
            name: 'update_practice',
            description: 'Update an existing best practice',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'The ID of the practice to update'
                },
                updates: {
                  type: 'object',
                  description: 'The fields to update in the practice'
                }
              },
              required: ['id', 'updates']
            }
          },
          {
            name: 'delete_practice',
            description: 'Delete a best practice from the knowledge base',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'The ID of the practice to delete'
                }
              },
              required: ['id']
            }
          },
          {
            name: 'get_collection',
            description: 'Get a specific collection by its ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'The unique identifier of the collection'
                }
              },
              required: ['id']
            }
          },
          {
            name: 'list_collections',
            description: 'List all available collections',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'add_collection',
            description: 'Add a new collection to organize practices',
            inputSchema: {
              type: 'object',
              properties: {
                collection: {
                  type: 'object',
                  description: 'The collection object following the Collection schema'
                }
              },
              required: ['collection']
            }
          },
          {
            name: 'get_stats',
            description: 'Get statistics about the best practices knowledge base',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'list_technologies',
            description: 'List all available technologies in the system',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'list_categories',
            description: 'List all available categories in the system',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_practices':
            return await this.handleSearchPractices(args);
          
          case 'get_practice':
            return await this.handleGetPractice(args);
          
          case 'get_practices_by_technology':
            return await this.handleGetPracticesByTechnology(args);
          
          case 'get_practices_by_category':
            return await this.handleGetPracticesByCategory(args);
          
          case 'get_related_practices':
            return await this.handleGetRelatedPractices(args);
          
          case 'add_practice':
            return await this.handleAddPractice(args);
          
          case 'update_practice':
            return await this.handleUpdatePractice(args);
          
          case 'delete_practice':
            return await this.handleDeletePractice(args);
          
          case 'get_collection':
            return await this.handleGetCollection(args);
          
          case 'list_collections':
            return await this.handleListCollections(args);
          
          case 'add_collection':
            return await this.handleAddCollection(args);
          
          case 'get_stats':
            return await this.handleGetStats(args);
          
          case 'list_technologies':
            return await this.handleListTechnologies(args);
          
          case 'list_categories':
            return await this.handleListCategories(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async handleSearchPractices(args: any) {
    const query = SearchQuerySchema.parse(args);
    const practices = this.dataManager.searchPractices(query);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            query: args,
            results: practices,
            total: practices.length
          }, null, 2)
        }
      ]
    };
  }

  private async handleGetPractice(args: any) {
    const { id } = args;
    const practice = this.dataManager.getPractice(id);
    
    if (!practice) {
      throw new McpError(ErrorCode.InvalidRequest, `Practice with ID ${id} not found`);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(practice, null, 2)
        }
      ]
    };
  }

  private async handleGetPracticesByTechnology(args: any) {
    const { technology } = args;
    const practices = this.dataManager.getPracticesByTechnology(technology);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            technology,
            practices,
            total: practices.length
          }, null, 2)
        }
      ]
    };
  }

  private async handleGetPracticesByCategory(args: any) {
    const { category } = args;
    const practices = this.dataManager.getPracticesByCategory(category);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            category,
            practices,
            total: practices.length
          }, null, 2)
        }
      ]
    };
  }

  private async handleGetRelatedPractices(args: any) {
    const { practice_id } = args;
    const practices = this.dataManager.getRelatedPractices(practice_id);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            practice_id,
            related_practices: practices,
            total: practices.length
          }, null, 2)
        }
      ]
    };
  }

  private async handleAddPractice(args: any) {
    const { practice } = args;
    const validatedPractice = BestPracticeSchema.parse(practice);
    
    await this.dataManager.savePractice(validatedPractice);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `Practice '${validatedPractice.title}' added successfully`,
            id: validatedPractice.id
          }, null, 2)
        }
      ]
    };
  }

  private async handleUpdatePractice(args: any) {
    const { id, updates } = args;
    const existingPractice = this.dataManager.getPractice(id);
    
    if (!existingPractice) {
      throw new McpError(ErrorCode.InvalidRequest, `Practice with ID ${id} not found`);
    }
    
    const updatedPractice = {
      ...existingPractice,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const validatedPractice = BestPracticeSchema.parse(updatedPractice);
    await this.dataManager.savePractice(validatedPractice);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `Practice '${validatedPractice.title}' updated successfully`,
            practice: validatedPractice
          }, null, 2)
        }
      ]
    };
  }

  private async handleDeletePractice(args: any) {
    const { id } = args;
    const success = await this.dataManager.deletePractice(id);
    
    if (!success) {
      throw new McpError(ErrorCode.InvalidRequest, `Practice with ID ${id} not found`);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `Practice with ID ${id} deleted successfully`
          }, null, 2)
        }
      ]
    };
  }

  private async handleGetCollection(args: any) {
    const { id } = args;
    const collection = this.dataManager.getCollection(id);
    
    if (!collection) {
      throw new McpError(ErrorCode.InvalidRequest, `Collection with ID ${id} not found`);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(collection, null, 2)
        }
      ]
    };
  }

  private async handleListCollections(args: any) {
    const collections = this.dataManager.getAllCollections();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            collections,
            total: collections.length
          }, null, 2)
        }
      ]
    };
  }

  private async handleAddCollection(args: any) {
    const { collection } = args;
    const validatedCollection = CollectionSchema.parse(collection);
    
    await this.dataManager.saveCollection(validatedCollection);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `Collection '${validatedCollection.name}' added successfully`,
            id: validatedCollection.id
          }, null, 2)
        }
      ]
    };
  }

  private async handleGetStats(args: any) {
    const stats = this.dataManager.getStats();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(stats, null, 2)
        }
      ]
    };
  }

  private async handleListTechnologies(args: any) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            technologies: TECHNOLOGIES,
            total: TECHNOLOGIES.length
          }, null, 2)
        }
      ]
    };
  }

  private async handleListCategories(args: any) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            categories: CATEGORIES,
            total: CATEGORIES.length
          }, null, 2)
        }
      ]
    };
  }

  async run(): Promise<void> {
    console.log(chalk.blue('[MCP Server] Starting Best Practices MCP Server...'));
    
    try {
      await this.dataManager.initialize();
      console.log(chalk.green('[MCP Server] Data manager initialized successfully'));
      
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      console.log(chalk.green('[MCP Server] Best Practices MCP Server running on stdio'));
    } catch (error) {
      console.error(chalk.red('[MCP Server] Failed to start server:'), error);
      process.exit(1);
    }
  }
}

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new BestPracticesMCPServer();
  server.run().catch((error) => {
    console.error(chalk.red('[MCP Server] Fatal error:'), error);
    process.exit(1);
  });
}