# Stack Technique Détaillé - Narcymorph

## Frontend

### Core
- **Next.js 14.2+**
  - App Router (React Server Components)
  - API Routes pour BFF pattern
  - Image optimization
  - SEO built-in

- **React 18+**
  - Concurrent features
  - Suspense boundaries
  - Error boundaries

- **TypeScript 5+**
  - Strict mode
  - Path aliases
  - Type safety

### UI & Styling
- **TailwindCSS 3.4+**
  - JIT compiler
  - Custom design tokens
  - Dark mode support

- **Shadcn/ui**
  - Composants accessibles
  - Radix UI primitives
  - Customizable

- **Framer Motion**
  - Page transitions
  - Micro-interactions
  - Reveal animations

### State Management
- **Zustand**
  - Lightweight
  - Simple API
  - TypeScript-first
  - Pour: auth, user, UI state

- **React Query (TanStack Query)**
  - Server state caching
  - Automatic refetching
  - Optimistic updates
  - Pour: API data

### Forms & Validation
- **React Hook Form**
  - Performance (uncontrolled)
  - Minimal re-renders

- **Zod**
  - Schema validation
  - TypeScript inference
  - Shared with backend

### Real-time
- **Socket.io-client**
  - WebSocket communication
  - Auto-reconnection
  - Room management

### Upload
- **React Dropzone**
  - Drag & drop
  - File validation
  - Preview

### Utils
- **date-fns** - Date manipulation
- **clsx** / **cn** - Conditional classes
- **axios** - HTTP client

---

## Backend

### Framework
- **NestJS 10+**
  - Modular architecture
  - Dependency injection
  - Decorators
  - Built-in testing

### Database
- **PostgreSQL 15+**
  - JSONB for flexible data
  - Full-text search
  - Indexes for performance

- **Prisma 5+**
  - Type-safe ORM
  - Migrations
  - Prisma Client
  - Prisma Studio (GUI)

### Caching
- **Redis 7+**
  - Session storage
  - Query caching
  - Rate limiting
  - Bull queue

### Authentication
- **Passport.js**
  - JWT strategy
  - Local strategy
  - OAuth2 (future)

- **bcrypt**
  - Password hashing
  - Salt rounds: 10

### File Storage
- **AWS S3** ou **Cloudinary**
  - Image upload
  - CDN delivery
  - Transformations

### Real-time
- **Socket.io**
  - Chat implementation
  - Live updates
  - Room management

### API
- **Swagger/OpenAPI**
  - Auto-generated docs
  - Type definitions
  - Testing UI

### Validation
- **class-validator**
  - DTO validation
  - Decorators

- **class-transformer**
  - Data transformation

---

## AI & Machine Learning

### LLM
- **OpenAI API**
  - GPT-4 Turbo pour analyse principale
  - GPT-3.5 Turbo pour associations simples
  - Function calling
  - Streaming responses

### Face Analysis
Options (choisir une):

1. **Azure Face API** (Recommandé)
   - Précision: ⭐⭐⭐⭐⭐
   - Prix: $$
   - Features: Emotion, age, facial features
   - GDPR compliant

2. **AWS Rekognition**
   - Précision: ⭐⭐⭐⭐
   - Prix: $$$
   - Features: Face comparison, emotions

3. **Face-api.js** (Alternative gratuite)
   - Précision: ⭐⭐⭐
   - Prix: Free (client-side)
   - Features: Basic detection
   - Limitations: Client-side, moins précis

### Vector Database (Phase 2+)
- **Pinecone**
  - Similarity search
  - User matching
  - Recommendation system

---

## Infrastructure & DevOps

### Containerisation
- **Docker**
  - Multi-stage builds
  - Docker Compose pour dev

### CI/CD
- **GitHub Actions**
  - Tests automatiques
  - Linting
  - Deploy on merge

### Hosting

**Frontend:**
- **Vercel** (Recommandé pour Next.js)
  - Zero config
  - Edge functions
  - Analytics
  - Free tier généreux

**Backend:**
Options:
1. **Railway** (Recommandé pour MVP)
   - Simple setup
   - Auto-scaling
   - Prix: ~$20-50/mois

2. **AWS ECS/Fargate**
   - Plus complexe
   - Plus de contrôle
   - Scalable

3. **Render**
   - Alternative à Railway
   - Free tier disponible

**Database:**
- **Railway PostgreSQL** ou
- **Supabase** ou
- **AWS RDS**

**Redis:**
- **Upstash** (Serverless Redis)
- **Railway Redis**

**Storage:**
- **Cloudinary** (Recommandé pour MVP)
  - Free tier: 25GB
  - Transformations incluses

- **AWS S3 + CloudFront**
  - Plus scalable
  - Plus de configuration

### Monitoring & Logging

- **Sentry**
  - Error tracking
  - Performance monitoring
  - Free tier: 5k errors/mois

- **LogRocket** (Phase 2+)
  - Session replay
  - User analytics

- **Vercel Analytics**
  - Web vitals
  - Audience insights

---

## Development Tools

### Code Quality
- **ESLint**
  - Next.js config
  - TypeScript rules

- **Prettier**
  - Code formatting
  - Import sorting

- **Husky**
  - Git hooks
  - Pre-commit linting

### Testing
- **Jest**
  - Unit tests
  - Integration tests

- **React Testing Library**
  - Component tests

- **Playwright**
  - E2E tests

### API Testing
- **Postman** / **Insomnia**
  - Manual testing

- **Supertest**
  - Automated API tests

---

## Package.json (Frontend)

```json
{
  "name": "narcymorph-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",

    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",

    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.32.0",

    "react-hook-form": "^7.51.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.3.0",

    "axios": "^1.6.0",
    "socket.io-client": "^4.7.0",

    "framer-motion": "^11.1.0",
    "react-dropzone": "^14.2.0",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.376.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",

    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.2.0",

    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",

    "jest": "^29.7.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@playwright/test": "^1.43.0"
  }
}
```

---

## Package.json (Backend)

```json
{
  "name": "narcymorph-backend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/config": "^3.2.0",
    "@nestjs/swagger": "^7.3.0",

    "@nestjs/passport": "^10.0.0",
    "@nestjs/jwt": "^10.2.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "bcrypt": "^5.1.0",

    "@prisma/client": "^5.13.0",
    "prisma": "^5.13.0",

    "redis": "^4.6.0",
    "@nestjs/cache-manager": "^2.2.0",
    "cache-manager-redis-store": "^3.0.0",

    "@nestjs/websockets": "^10.3.0",
    "@nestjs/platform-socket.io": "^10.3.0",
    "socket.io": "^4.7.0",

    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",

    "openai": "^4.38.0",
    "axios": "^1.6.0",

    "aws-sdk": "^2.1600.0",
    "multer": "^1.4.5-lts.1",

    "bull": "^4.12.0",
    "@nestjs/bull": "^10.1.0",

    "rxjs": "^7.8.0",
    "reflect-metadata": "^0.2.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@nestjs/schematics": "^10.1.0",
    "@nestjs/testing": "^10.3.0",

    "@types/express": "^4.17.0",
    "@types/node": "^20.12.0",
    "@types/passport-jwt": "^4.0.0",
    "@types/passport-local": "^1.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/multer": "^1.4.0",

    "@typescript-eslint/eslint-plugin": "^7.7.0",
    "@typescript-eslint/parser": "^7.7.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.0",

    "prettier": "^3.2.0",

    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "supertest": "^6.3.0",
    "@types/supertest": "^6.0.0",

    "ts-loader": "^9.5.0",
    "ts-node": "^10.9.0",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.4.0"
  }
}
```

---

## Versions Minimales Requises

- Node.js: 18.17.0+
- npm: 9.0.0+
- PostgreSQL: 14+
- Redis: 6+

---

## Estimation des Coûts (Production)

### Phase MVP (100-500 users)
| Service | Coût Mensuel |
|---------|--------------|
| Vercel (Frontend) | $0 (Free tier) |
| Railway (Backend + DB + Redis) | $20-40 |
| Cloudinary (Storage) | $0-20 |
| OpenAI API (5 analyses/user) | $100-300 |
| Azure Face API | $50-100 |
| Domain + SSL | $15 |
| **Total** | **$185-475/mois** |

### Phase Growth (1000-5000 users)
| Service | Coût Mensuel |
|---------|--------------|
| Vercel Pro | $20 |
| Railway / AWS | $100-300 |
| Cloudinary | $50-100 |
| OpenAI API | $500-1000 |
| Azure Face API | $200-500 |
| Monitoring (Sentry + LogRocket) | $50-100 |
| **Total** | **$920-2020/mois** |

### Optimisations pour Réduire Coûts
1. Caching agressif des résultats d'IA
2. Batch processing
3. Rate limiting par user
4. Tier gratuit limité (2-3 analyses/jour)
5. Premium pour unlimited
6. Face analysis en option (ou basique client-side)

---

## Alternatives Open Source (Self-hosted)

Pour réduire drastiquement les coûts:

### LLM
- **Llama 3 70B** via Ollama
- **Mistral 7B**
- Hébergement: GPU server (~$100-200/mois)

### Face Analysis
- **Face-api.js** (Browser-based, gratuit)
- **InsightFace** (Python, self-hosted)

### Infrastructure
- **VPS** (Hetzner, OVH): ~$50/mois
- **Self-hosted PostgreSQL**
- **Self-hosted Redis**
- **MinIO** pour storage (S3-compatible)

**Coût total self-hosted: ~$150-250/mois**

Mais:
- Plus de maintenance
- Moins de scalabilité
- Besoin de compétences DevOps
