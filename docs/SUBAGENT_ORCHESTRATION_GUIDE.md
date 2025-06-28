# Subagent Orchestration Guide

## Overview

This guide explains how to effectively use the multi-agent system for the Indecisive Wear project. The system follows Anthropic's orchestrator-worker pattern for optimal performance.

## Architecture

```
┌─────────────────┐
│   Orchestrator  │ (Main Claude Instance)
│   (You/Claude)  │
└────────┬────────┘
         │
    ┌────┴────┬────────┬──────────┐
    ▼         ▼        ▼          ▼
┌────────┐┌────────┐┌────────┐┌────────┐
│Research││Auditor ││Testing ││DevOps  │
│ Agent  ││ Agent  ││ Agent  ││ Agent  │
└────────┘└────────┘└────────┘└────────┘
```

## When to Use Subagents

### Parallel Processing Opportunities
Use multiple agents when tasks can be done simultaneously:
- Research best practices WHILE implementing features
- Audit code WHILE writing tests
- Monitor deployment WHILE preparing next feature

### Context Preservation
Delegate to subagents to preserve main context:
- Long research tasks
- Detailed code reviews
- Comprehensive testing
- Infrastructure setup

## Orchestration Patterns

### 1. Research-First Pattern
```
1. Research Agent investigates best practices
2. Orchestrator reviews findings
3. Implementation begins with guidance
4. Auditor reviews implementation
5. Testing Agent validates
```

### 2. Continuous Audit Pattern
```
1. Orchestrator implements feature
2. Auditor reviews in parallel
3. Issues fixed immediately
4. Testing Agent validates
5. DevOps deploys
```

### 3. Full Pipeline Pattern
```
1. Research Agent explores options
2. Orchestrator plans implementation
3. Multiple features developed in parallel
4. Auditor + Testing run simultaneously
5. DevOps handles deployment
```

## Practical Examples

### Example 1: Adding New Feature
```
Orchestrator: "I need to add a wishlist feature"
→ Research Agent: Investigate wishlist patterns in e-commerce
→ Orchestrator: Plan implementation based on research
→ Testing Agent: Create test scenarios
→ Orchestrator: Implement feature
→ Auditor: Review code quality
→ DevOps: Deploy to staging
```

### Example 2: Performance Optimization
```
Orchestrator: "The product page is slow"
→ Auditor: Profile current performance
→ Research Agent: Find optimization techniques
→ Orchestrator: Implement optimizations
→ Testing Agent: Benchmark improvements
→ DevOps: Monitor production metrics
```

### Example 3: Security Hardening
```
Orchestrator: "We need to improve security"
→ Auditor: Security audit current code
→ Research Agent: Latest security practices
→ Orchestrator: Implement fixes
→ Testing Agent: Security test suite
→ DevOps: Deploy with monitoring
```

## Communication Protocol

### Invoking Agents
```
"@Research Agent: Find the best way to implement server-side pagination with Medusa v2"
"@Auditor: Review the cart component for performance issues"
"@Testing Agent: Create E2E tests for the checkout flow"
"@DevOps: Prepare production deployment checklist"
```

### Agent Responses
Agents provide:
- Concise summary (3-5 points)
- Detailed findings in markdown
- Code examples following project patterns
- Specific recommendations
- Risk assessments

## Performance Considerations

### Token Usage
- Single agent: 4x more than chat
- Multi-agent: 15x more than chat
- Optimize by using agents strategically

### Best Practices
1. Batch related tasks to single agent
2. Use clear, specific prompts
3. Leverage agent specialization
4. Review agent outputs before proceeding
5. Maintain agent CLAUDE.md files

## Monitoring Agent Performance

### Metrics to Track
- Task completion time
- Output quality
- Token efficiency
- Error rates
- Implementation success

### Continuous Improvement
1. Update agent CLAUDE.md based on learnings
2. Refine orchestration patterns
3. Document successful workflows
4. Share knowledge between agents

## Advanced Techniques

### Agent Chaining
```
Research → Auditor → Orchestrator → Testing → DevOps
```

### Agent Collaboration
Multiple agents working on related tasks:
- Research: Frontend patterns
- Research: Backend patterns
- Orchestrator: Integrate findings

### Async Operations
While waiting for deployments:
- Research next features
- Audit existing code
- Prepare test scenarios
- Document learnings

## Troubleshooting

### Common Issues
1. **Agent gives generic advice**: Make prompts more specific
2. **Token limit reached**: Break into smaller tasks
3. **Conflicting recommendations**: Orchestrator makes final decision
4. **Slow response**: Use fewer agents in parallel

### Resolution Strategies
- Clear task boundaries
- Specific success criteria
- Regular checkpoint reviews
- Incremental implementation

## Future Enhancements

### Planned Improvements
1. Async agent execution
2. Agent memory persistence
3. Cross-agent knowledge sharing
4. Automated agent invocation
5. Performance optimization

### Experimental Patterns
- Self-organizing agents
- Predictive task delegation
- Automated quality gates
- Continuous learning system

---

*Remember: The orchestrator (you) maintains control while agents provide specialized expertise. Use them wisely to build a perfect, zero-bloat production system.*