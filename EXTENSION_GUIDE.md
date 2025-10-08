# Extension Guide - LevelUp Azure

## Adding New Certifications

### 1. Add the Exam ID
```typescript
// types/index.ts
export type ExamId = "AI-900" | "DP-900" | "AZ-104"; // Add new ID here
```

### 2. Add Questions
```typescript
// lib/seed-data.ts or via admin import
{
  examId: "DP-900",
  objectiveId: "Data-Concepts",
  difficulty: "medium",
  // ... rest of question
}
```

### 3. Create About Page
```bash
mkdir app/about/dp-900
# Create page.tsx with exam details
```

## Database Integration

Replace `lib/data-store.ts` with Prisma:

```typescript
// prisma/schema.prisma
model Question {
  id            String   @id @default(uuid())
  examId        String
  objectiveId   String
  difficulty    String
  stem          String
  options       Json
  correctOptions Json
  explanation   String
  references    Json
  tags          String[]
  status        String
  lastUpdated   DateTime @default(now())
}
```

Update data-store methods to use Prisma client.

## Real Authentication

### Option 1: Microsoft Entra ID
```typescript
// Use @azure/msal-node
import { PublicClientApplication } from "@azure/msal-node";
```

### Option 2: NextAuth.js
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
```

## Adding Exam Mode Timer

The Timer component is already built! Just integrate it:

```typescript
// app/exam/page.tsx
import Timer from '@/components/Timer';

<Timer 
  timeLimitSec={3600} 
  onTimeUp={handleTimeUp} 
/>
```

## Implementing Full Exam Mode

Follow the same pattern as Practice Mode:

1. Config stage → Select exam settings
2. Question stage → Show questions with Timer
3. Review stage → Allow flagged question review
4. Submit → Show summary

## Adding Analytics

```typescript
// lib/analytics.ts
export function trackEvent(event: string, properties: Record<string, any>) {
  // Integrate with Azure Application Insights
  // or Google Analytics
}
```

## Localization

```typescript
// lib/i18n.ts
export const translations = {
  en: { /* ... */ },
  pt: { /* ... */ },
  es: { /* ... */ },
};
```

## PWA/Offline Support

```javascript
// next.config.js
const withPWA = require('next-pwa');

module.exports = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});
```

## Performance Optimizations

1. **Image Optimization:** Use next/image for logos
2. **Code Splitting:** Dynamic imports for heavy components
3. **Caching:** Add Redis for session storage
4. **CDN:** Deploy static assets to Azure CDN

## Security Enhancements

1. **Rate Limiting:** Add express-rate-limit to API routes
2. **CSRF Protection:** Implement CSRF tokens
3. **Input Validation:** Use Zod for schema validation
4. **API Keys:** For admin endpoints

## Testing

```typescript
// __tests__/scoring.test.ts
import { isAnswerCorrect } from '@/lib/scoring';

describe('Scoring', () => {
  it('should mark correct single-select as correct', () => {
    // Test cases
  });
});
```

Use Jest + React Testing Library.

## Deployment

### Azure Static Web Apps
```bash
az staticwebapp create \
  --name levelup-azure \
  --resource-group myResourceGroup
```

### Vercel (Easiest)
```bash
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Monitoring

Add Azure Application Insights:

```typescript
// app/layout.tsx
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env.APPINSIGHTS_KEY
  }
});
```

## API Rate Limiting

```typescript
// lib/rate-limit.ts
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

---

The architecture is designed to be extensible. Start with these foundations and build incrementally!
