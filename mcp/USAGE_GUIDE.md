# Best Practices MCP - Usage Guide

This guide provides practical examples of how to use the Best Practices MCP server for various common scenarios in your development workflow.

## 🎯 Common Use Cases

### 1. Pre-Development Research

When starting a new feature, use the MCP to research relevant best practices:

```typescript
// Find all performance practices for the technologies you're using
search_practices({
  technology: ["nextjs", "react"],
  category: ["performance"],
  priority: ["critical", "high"],
  status: ["implemented"]
})

// Get implementation complexity to plan your work
search_practices({
  query: "caching strategies",
  implementation_complexity: ["low", "medium"]
})
```

### 2. Code Review Preparation

Before code reviews, check relevant practices:

```typescript
// Find security practices for your technology
search_practices({
  technology: ["nextjs"],
  category: ["security"],
  limit: 10
})

// Get testing patterns for the feature type
search_practices({
  category: ["testing"],
  tags: ["integration", "e2e"]
})
```

### 3. Architecture Decisions

When making architectural choices:

```typescript
// Get architecture practices for the tech stack
get_practices_by_category({ category: "architecture" })

// Find scalability considerations
search_practices({
  category: ["scalability", "performance"],
  priority: ["critical"]
})
```

### 4. Onboarding New Team Members

Create learning paths for new developers:

```typescript
// Get production readiness practices
get_collection({ id: "production-readiness-checklist" })

// Find beginner-friendly practices
search_practices({
  implementation_complexity: ["low"],
  status: ["implemented"],
  limit: 20
})
```

### 5. Production Deployment Checklist

Before deploying to production:

```typescript
// Get critical practices that must be implemented
search_practices({
  priority: ["critical"],
  status: ["implemented"],
  category: ["security", "performance", "monitoring"]
})

// Check deployment-specific practices
get_practices_by_category({ category: "deployment" })
```

## 🔍 Advanced Search Patterns

### Finding Related Practices
```typescript
// Start with a core practice
const practice = await get_practice({ 
  id: "nextjs-app-router-optimization" 
});

// Find related practices
const related = await get_related_practices({ 
  practice_id: "nextjs-app-router-optimization" 
});

// Find practices with similar tags
search_practices({
  tags: ["app-router", "server-components"],
  technology: ["nextjs"]
})
```

### Technology Migration Research
```typescript
// Research practices for new technology adoption
search_practices({
  technology: ["react"],
  tags: ["migration", "upgrade"],
  status: ["implemented", "planned"]
})

// Find breaking changes and compatibility info
search_practices({
  query: "breaking changes",
  technology: ["nextjs", "react"]
})
```

### Problem-Specific Solutions
```typescript
// Find solutions for specific problems
search_practices({
  query: "slow page load",
  category: ["performance"]
})

// Research error handling patterns
search_practices({
  category: ["error-handling"],
  technology: ["typescript", "nextjs"]
})
```

## 📚 Building Learning Collections

### Creating Focused Learning Paths

```typescript
// Create a collection for new React 19 features
add_collection({
  collection: {
    id: "react-19-migration-guide",
    name: "React 19 Migration Guide",
    description: "Essential practices for migrating to React 19",
    practice_ids: [
      "react-19-concurrent-patterns",
      "typescript-strict-mode-patterns"
    ],
    tags: ["react", "migration", "upgrade"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: "Development Team",
    is_public: true
  }
})
```

### Team-Specific Collections

```typescript
// Backend team practices
add_collection({
  collection: {
    id: "backend-team-essentials",
    name: "Backend Team Essentials",
    description: "Core practices for backend development",
    practice_ids: ["medusa-optimization", "postgresql-performance"],
    tags: ["backend", "api", "database"],
    // ... metadata
  }
})

// Frontend team practices  
add_collection({
  collection: {
    id: "frontend-team-essentials", 
    name: "Frontend Team Essentials",
    description: "Core practices for frontend development",
    practice_ids: [
      "nextjs-app-router-optimization",
      "react-19-concurrent-patterns",
      "typescript-strict-mode-patterns"
    ],
    tags: ["frontend", "ui", "performance"],
    // ... metadata
  }
})
```

## 📊 Monitoring and Maintenance

### Regular Knowledge Base Health Checks

```typescript
// Get overall statistics
const stats = await get_stats();

// Check for outdated practices
search_practices({
  created_before: "2024-01-01T00:00:00Z",
  status: ["implemented"]
})

// Find practices needing review
search_practices({
  status: ["researching", "experimental"],
  created_before: "2024-06-01T00:00:00Z"
})
```

### Identifying Knowledge Gaps

```typescript
// Find technologies with few practices
const allTechs = await list_technologies();
for (const tech of allTechs.technologies) {
  const practices = await get_practices_by_technology({ 
    technology: tech 
  });
  if (practices.length < 3) {
    console.log(`Low coverage for ${tech}: ${practices.length} practices`);
  }
}

// Find categories needing attention
const allCategories = await list_categories();
for (const category of allCategories.categories) {
  const practices = await get_practices_by_category({ 
    category 
  });
  if (practices.length < 2) {
    console.log(`Low coverage for ${category}: ${practices.length} practices`);
  }
}
```

## 🛠️ Integration with Development Workflow

### Pre-commit Hooks

Create scripts that check for relevant practices:

```typescript
// pre-commit-check.ts
async function checkRelevantPractices(changedFiles: string[]) {
  const technologies = detectTechnologies(changedFiles);
  
  for (const tech of technologies) {
    const practices = await search_practices({
      technology: [tech],
      priority: ["critical"],
      status: ["implemented"]
    });
    
    console.log(`${tech} critical practices:`, practices.length);
  }
}
```

### Code Review Templates

Generate review checklists:

```typescript
// Generate checklist for React components
const reactPractices = await search_practices({
  technology: ["react"],
  category: ["performance", "accessibility"],
  priority: ["critical", "high"]
});

const checklist = reactPractices.map(p => 
  `- [ ] ${p.title}: ${p.description}`
).join('\n');
```

### Documentation Generation

Auto-generate team documentation:

```typescript
// Generate team playbook
const collections = await list_collections();
for (const collection of collections.collections) {
  const practices = await Promise.all(
    collection.practice_ids.map(id => get_practice({ id }))
  );
  
  generateMarkdownPlaybook(collection, practices);
}
```

## 🎓 Best Practices for Best Practices

### Writing High-Quality Practices

1. **Clear Problem Statement**: Start with the specific problem
2. **Actionable Solution**: Provide concrete, implementable steps  
3. **Working Examples**: Include complete, tested code examples
4. **Validation Criteria**: Define how to measure success
5. **External Resources**: Link to authoritative sources

### Organizing Practices

1. **Consistent Tagging**: Use standardized tag vocabulary
2. **Proper Categorization**: Choose the most specific category
3. **Accurate Priority**: Align priority with business impact
4. **Status Tracking**: Keep implementation status current
5. **Regular Review**: Update practices as technologies evolve

### Team Adoption

1. **Start Small**: Begin with critical practices
2. **Show Value**: Demonstrate time savings and error reduction
3. **Make it Searchable**: Use consistent terminology
4. **Encourage Contribution**: Make it easy to add practices
5. **Regular Training**: Include in onboarding and team meetings

---

This usage guide provides the foundation for effective use of the Best Practices MCP server. Adapt these patterns to your team's specific needs and workflows.