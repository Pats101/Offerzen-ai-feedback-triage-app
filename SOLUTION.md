# OfferZen AI Feedback Triage - Technical Solution

> **AI-powered feedback analysis and prioritization system**

---

## Architecture Overview

The application follows a **clean layered architecture**:

```
UI (Next.js Pages)
  ↓
API Routes (HTTP handling, validation)
  ↓
Controllers (Business logic)
  ↓
Services (AI integration) + Repositories (Database)
  ↓
PostgreSQL (Data persistence)
```

**Key benefits:**
- Each layer has a single responsibility
- Layers can be tested independently
- Easy to swap implementations (e.g., change AI provider or database)

---

## Technology Stack & Rationale

### Next.js 14
- **Why:** Full-stack TypeScript in one codebase, built-in API routes, production-ready optimizations
- **Alternative considered:** Express.js + React (more setup, separate deployments)

### PostgreSQL + Prisma
- **Why:** Relational data model fits feedback structure perfectly, native array support for tags, ACID guarantees
- **Alternative considered:** MongoDB (overkill for single entity, no referential integrity)

### OpenAI (gpt-4o-mini)
- **Why:** Optimized for structured JSON output, faster response times (<1s), lower cost than Claude
- **Alternative considered:** Anthropic Claude (better for nuanced analysis, but slower and more expensive for this use case)

### Tailwind CSS
- **Why:** Utility-first CSS for rapid development, no component library bloat, mobile-first responsive

---

## Data Model Design

```prisma
model Feedback {
  id          String   @id @default(cuid())  // Sortable, URL-safe
  text        String
  email       String?                         // Optional for anonymous feedback
  createdAt   DateTime @default(now())       // Server-generated timestamp

  // AI Analysis
  summary     String
  sentiment   String   // positive|neutral|negative
  tags        String[] // PostgreSQL native arrays
  priority    String   // P0|P1|P2|P3
  nextAction  String

  @@index([priority])  // Fast filtering
  @@index([sentiment])
}
```

**Key decisions:**
- **CUID over UUID:** Sortable and 25 chars vs 36
- **Array for tags:** Simpler than junction table, sufficient for AI-generated 1-5 tags
- **Strings for enums:** Application-layer validation (Zod), easier to extend
- **Indexes:** Priority and sentiment are frequently filtered

---

## AI Integration

### Current Implementation: Synchronous

Feedback analysis runs **synchronously** within the POST request:

```typescript
// 1. Analyze with OpenAI (1-3s)
const analysis = await analyzeFeedback(data.text)

// 2. Save to database
const feedback = await feedbackRepository.create({ ...data, analysis })
```

**Pros:** Simple, immediate results
**Cons:** Slower API response, blocking request

### Production Evolution: Async Background Processing

For scale, I would evolve to **async with job queue**:

1. Save feedback with `status: 'pending'`
2. Enqueue job to Redis (BullMQ)
3. Background worker processes AI analysis
4. Update feedback with results
5. Frontend polls or uses WebSocket for updates

**Benefits:** <100ms API response, resilient retry logic, scales to thousands of requests

---

## AI Prompt Engineering & Safety

**Prompt strategy:**
- Strict JSON format enforcement
- Clear field definitions (summary, sentiment, tags, priority, nextAction)
- Low temperature (0.3) for consistency

**Safety measures:**
- **Graceful fallback:** Returns neutral defaults when AI fails
- **Retry with exponential backoff:** 3 attempts with 1s, 2s, 4s delays
- **No PII logging:** Only log metadata (request ID, duration, model), never raw content

---

## Free-Text Search Implementation

**Approach:** Prisma `contains` with case-insensitive mode

```typescript
where.OR = [
  { text: { contains: search, mode: 'insensitive' } },
  { summary: { contains: search, mode: 'insensitive' } }
]
```

**Trade-offs:**
- ✅ Simple, works out-of-box, cross-database compatible
- ❌ No relevance ranking, slower for >10k items

**Upgrade path:** PostgreSQL FTS (10k-50k items) → Elasticsearch (50k+ items)

---

## User Experience Design

I used a **centered, single-column layout** to reduce cognitive load and make the submission process feel lightweight. The page uses a **soft gray background** with a **card-based form** to create visual focus. Inputs are clearly labeled, and the CTA is high-contrast for accessibility.

**List page:** Card-based layout with color-coded priority badges (red=P0, orange=P1, yellow=P2, green=P3), sentiment indicators, and search/filter controls.

**Accessibility:** WCAG 4.5:1 contrast, semantic HTML, keyboard navigation, ARIA labels, reduced-motion support.

---

## Testing Strategy

**25 tests, 100% critical path coverage**

- **Backend (19 tests):** Controller + repository logic, pagination, filtering, search, AI fallback
- **Frontend (6 tests):** Form rendering, submission flow, loading states, error handling

**Approach:**
- Mock external dependencies (OpenAI, database) for determinism
- Focus on user-visible behavior, not implementation details
- Fast (<1s runtime) for CI/CD

**Example:**
```typescript
it('should return fallback values when AI fails', async () => {
  mockOpenAI.mockRejectedValue(new Error('API Error'))
  const result = await analyzeFeedback('test')
  expect(result.sentiment).toBe('neutral')  // Graceful degradation
})
```

---

## Diagnostics

**Structured logging:**
- Request ID for correlation
- Duration tracking
- Success/failure indicators
- No PII in logs

**Debugging:**
- AI rate limits: Check OpenAI dashboard, increase retry config, upgrade plan
- Database issues: Monitor connection pool, add PgBouncer if needed

---

## Summary

This solution demonstrates:

✅ **Clean Architecture** - Separation of concerns across layers
✅ **Type Safety** - End-to-end TypeScript coverage
✅ **AI Integration** - OpenAI with retry logic and fallback
✅ **Production-Ready** - Structured logging, error handling, testing
✅ **Scalability** - Clear path to async processing with job queues

**Total:** 25/25 tests passing, Docker + GitHub Actions CI/CD, comprehensive documentation.

---

**Built by Patrick Ganhiwa**
