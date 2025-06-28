# Best Practices MCP Server

A comprehensive Model Context Protocol (MCP) server for organizing, storing, and querying best practices for our tech stack. This system provides a structured approach to knowledge management for production-ready e-commerce applications.

## 🎯 Overview

This MCP server enables you to:
- **Store and organize** best practices by technology and category
- **Search and filter** practices using multiple criteria
- **Maintain collections** of related practices
- **Track implementation status** and priority levels
- **Include code examples** and external resources
- **Validate data integrity** with strict TypeScript schemas

## 🏗️ Architecture

### Tech Stack
- **TypeScript 5.0+** with strict mode for type safety
- **Zod** for runtime schema validation
- **Fuse.js** for fuzzy search capabilities
- **MCP SDK** for protocol implementation
- **Node.js 18+** for runtime environment

### Data Structure
```
mcp/
├── src/
│   ├── types/
│   │   └── schema.ts          # Zod schemas and TypeScript types
│   ├── storage/
│   │   └── data-manager.ts    # Data persistence and querying
│   └── index.ts               # MCP server implementation
├── data/
│   ├── practices/             # Individual practice JSON files
│   └── collections/           # Practice collections
└── README.md                  # This documentation
```

## 🚀 Getting Started

### Installation

1. **Install dependencies:**
```bash
cd mcp
npm install
```

2. **Build the server:**
```bash
npm run build
```

3. **Start in development mode:**
```bash
npm run dev
```

### Adding to Claude Desktop

Add the MCP server to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "best-practices": {
      "command": "node",
      "args": ["/path/to/mcp/dist/index.js"],
      "cwd": "/path/to/mcp"
    }
  }
}
```

## 📊 Data Schema

### Best Practice Structure
Each practice includes:
- **Metadata**: ID, title, description, technology, category
- **Content**: Problem, solution, rationale
- **Implementation**: Code examples, complexity, prerequisites
- **Resources**: External links, documentation
- **Organization**: Tags, related practices, collections
- **Validation**: Test examples, success criteria

### Technology Categories
- `nextjs`, `react`, `typescript`, `tailwind`, `shadcn-ui`
- `medusa`, `postgresql`, `redis`, `stripe`, `supabase`
- `jest`, `playwright`, `react-testing-library`
- `railway`, `vercel`, `github-actions`, `sentry`
- `docker`, `pnpm`, `yarn`, `eslint`, `prettier`, `zod`

### Practice Categories
- `performance`, `security`, `testing`, `devops`
- `architecture`, `ui-ux`, `accessibility`, `seo`
- `error-handling`, `data-management`, `authentication`
- `payments`, `monitoring`, `deployment`
- `development-workflow`, `code-quality`, `documentation`
- `scalability`, `maintainability`, `developer-experience`

## 🔧 Available Tools

### Search and Query Tools

#### `search_practices`
Search practices with flexible criteria:
```typescript
{
  query: "performance optimization",           // Full-text search
  technology: ["nextjs", "react"],            // Filter by tech
  category: ["performance"],                  // Filter by category
  priority: ["critical", "high"],             // Filter by priority
  status: ["implemented"],                    // Filter by status
  tags: ["core-web-vitals"],                 // Filter by tags
  implementation_complexity: ["medium"],       // Filter by complexity
  limit: 20,                                  // Results limit
  offset: 0                                   // Pagination offset
}
```

#### `get_practice`
Get a specific practice by ID:
```typescript
{ id: "nextjs-app-router-optimization" }
```

#### `get_practices_by_technology`
Get all practices for a technology:
```typescript
{ technology: "nextjs" }
```

#### `get_practices_by_category`
Get all practices for a category:
```typescript
{ category: "performance" }
```

#### `get_related_practices`
Get practices related to a specific practice:
```typescript
{ practice_id: "nextjs-app-router-optimization" }
```

### Management Tools

#### `add_practice`
Add a new practice:
```typescript
{
  practice: {
    id: "unique-practice-id",
    title: "Practice Title",
    description: "Brief description",
    technology: "nextjs",
    category: "performance",
    priority: "high",
    status: "implemented",
    problem: "Description of the problem",
    solution: "Description of the solution",
    rationale: "Why this practice is important",
    // ... additional fields
  }
}
```

#### `update_practice`
Update an existing practice:
```typescript
{
  id: "practice-id",
  updates: {
    status: "implemented",
    updated_at: "2025-06-28T12:00:00Z"
  }
}
```

#### `delete_practice`
Delete a practice:
```typescript
{ id: "practice-id" }
```

### Collection Tools

#### `list_collections`
Get all available collections.

#### `get_collection`
Get a specific collection:
```typescript
{ id: "frontend-performance-essentials" }
```

#### `add_collection`
Create a new collection:
```typescript
{
  collection: {
    id: "new-collection-id",
    name: "Collection Name",
    description: "Collection description",
    practice_ids: ["practice-1", "practice-2"],
    // ... metadata
  }
}
```

### Utility Tools

#### `get_stats`
Get knowledge base statistics including practice counts by technology, category, priority, and status.

#### `list_technologies`
Get all available technology options.

#### `list_categories`
Get all available category options.

## 📝 Example Usage

### Finding Performance Practices
```typescript
// Search for Next.js performance practices
search_practices({
  technology: ["nextjs"],
  category: ["performance"],
  priority: ["critical", "high"]
})
```

### Getting Implementation Guide
```typescript
// Get specific practice with code examples
get_practice({ id: "nextjs-app-router-optimization" })
```

### Building Learning Path
```typescript
// Get production readiness checklist
get_collection({ id: "production-readiness-checklist" })
```

## 📋 Pre-loaded Examples

The system includes comprehensive examples:

### Next.js App Router Optimization
- Server Components best practices
- Streaming and Suspense patterns  
- Caching strategies
- Performance monitoring

### React 19 Concurrent Features
- startTransition for non-urgent updates
- use() hook for data fetching
- Optimistic updates pattern
- Concurrent rendering optimization

### TypeScript Strict Mode
- Strict configuration setup
- Runtime validation with Zod
- Type-safe API patterns
- Error handling best practices

## 🏷️ Collections

### Frontend Performance Essentials
Critical practices for fast, responsive UIs covering Next.js optimization and React concurrent features.

### Production Readiness Checklist
Must-have practices before production deployment including performance, type safety, and quality standards.

## 📈 Best Practices for Usage

### For Contributors
1. **Follow the schema** - Use the defined TypeScript interfaces
2. **Include examples** - Always provide code examples
3. **Add validation** - Include test cases and success criteria
4. **Link resources** - Reference official documentation
5. **Update regularly** - Keep practices current with framework versions

### For Consumers
1. **Search by context** - Use multiple filters for relevant results
2. **Check implementation status** - Verify what's already implemented
3. **Follow prerequisites** - Ensure requirements are met
4. **Validate results** - Use provided test examples
5. **Build collections** - Group related practices for learning paths

## 🔍 Troubleshooting

### Common Issues

**Server won't start:**
- Check Node.js version (18+ required)
- Verify all dependencies are installed
- Ensure data directory permissions

**Search returns no results:**
- Check filter criteria aren't too restrictive
- Verify practice data is loaded correctly
- Try broader search terms

**Type validation errors:**
- Ensure practice data matches schema
- Check required fields are present
- Validate date formats (ISO 8601)

## 🛠️ Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Type Checking
```bash
npm run type-check
```

### Building
```bash
npm run build
```

## 📚 Additional Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [Next.js Best Practices](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)

---

**Maintained by**: Development Team  
**Last Updated**: 2025-06-28  
**Version**: 1.0.0