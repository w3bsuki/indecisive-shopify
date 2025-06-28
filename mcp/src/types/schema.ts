import { z } from 'zod';

/**
 * Technology categories in our tech stack
 */
export const TechnologySchema = z.enum([
  'nextjs',
  'react',
  'typescript',
  'tailwind',
  'shadcn-ui',
  'medusa',
  'postgresql',
  'redis',
  'stripe',
  'supabase',
  'jest',
  'playwright',
  'react-testing-library',
  'railway',
  'vercel', 
  'github-actions',
  'sentry',
  'docker',
  'pnpm',
  'yarn',
  'eslint',
  'prettier',
  'zod'
]);

/**
 * Practice categories for organization
 */
export const CategorySchema = z.enum([
  'performance',
  'security',
  'testing',
  'devops',
  'architecture',
  'ui-ux',
  'accessibility',
  'seo',
  'error-handling',
  'data-management',
  'authentication',
  'payments',
  'monitoring',
  'deployment',
  'development-workflow',
  'code-quality',
  'documentation',
  'scalability',
  'maintainability',
  'developer-experience'
]);

/**
 * Priority levels for practices
 */
export const PrioritySchema = z.enum([
  'critical',    // Must-have for production
  'high',        // Important for quality
  'medium',      // Nice to have
  'low'          // Optional optimization
]);

/**
 * Implementation status
 */
export const StatusSchema = z.enum([
  'implemented',     // Already in use
  'planned',         // Scheduled for implementation
  'researching',     // Under investigation
  'deprecated',      // No longer recommended
  'experimental'     // Testing phase
]);

/**
 * Code example schema
 */
export const CodeExampleSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  language: z.string().min(1),
  code: z.string().min(1),
  filename: z.string().optional(),
  highlight_lines: z.array(z.number()).optional()
});

/**
 * External resource schema
 */
export const ResourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  type: z.enum(['documentation', 'article', 'video', 'repository', 'tool', 'guide']),
  description: z.string().optional(),
  is_official: z.boolean().default(false)
});

/**
 * Version information schema
 */
export const VersionInfoSchema = z.object({
  technology_version: z.string().min(1),
  compatibility_notes: z.string().optional(),
  breaking_changes: z.array(z.string()).optional(),
  migration_guide: z.string().optional()
});

/**
 * Best practice entry schema
 */
export const BestPracticeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(10),
  technology: TechnologySchema,
  category: CategorySchema,
  priority: PrioritySchema,
  status: StatusSchema,
  
  // Content
  problem: z.string().min(10),
  solution: z.string().min(10),
  rationale: z.string().min(10),
  
  // Code examples
  code_examples: z.array(CodeExampleSchema).optional(),
  
  // External resources
  resources: z.array(ResourceSchema).optional(),
  
  // Version and compatibility
  version_info: VersionInfoSchema.optional(),
  
  // Tags for better searchability
  tags: z.array(z.string()).default([]),
  
  // Related practices
  related_practices: z.array(z.string()).optional(),
  
  // Metadata
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  author: z.string().min(1),
  reviewed_by: z.array(z.string()).optional(),
  
  // Implementation details
  implementation_complexity: z.enum(['low', 'medium', 'high']),
  estimated_time: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  
  // Validation and testing
  validation_criteria: z.array(z.string()).optional(),
  test_examples: z.array(CodeExampleSchema).optional()
});

/**
 * Search query schema
 */
export const SearchQuerySchema = z.object({
  query: z.string().optional(),
  technology: z.array(TechnologySchema).optional(),
  category: z.array(CategorySchema).optional(),
  priority: z.array(PrioritySchema).optional(),
  status: z.array(StatusSchema).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  created_after: z.string().datetime().optional(),
  created_before: z.string().datetime().optional(),
  implementation_complexity: z.array(z.enum(['low', 'medium', 'high'])).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
});

/**
 * Collection schema for organizing practices
 */
export const CollectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(10),
  practice_ids: z.array(z.string()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  author: z.string().min(1),
  is_public: z.boolean().default(true),
  tags: z.array(z.string()).default([])
});

// Type exports
export type Technology = z.infer<typeof TechnologySchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Priority = z.infer<typeof PrioritySchema>;
export type Status = z.infer<typeof StatusSchema>;
export type CodeExample = z.infer<typeof CodeExampleSchema>;
export type Resource = z.infer<typeof ResourceSchema>;
export type VersionInfo = z.infer<typeof VersionInfoSchema>;
export type BestPractice = z.infer<typeof BestPracticeSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type Collection = z.infer<typeof CollectionSchema>;

// Constants for easy reference
export const TECHNOLOGIES = TechnologySchema.options;
export const CATEGORIES = CategorySchema.options;
export const PRIORITIES = PrioritySchema.options;
export const STATUSES = StatusSchema.options;