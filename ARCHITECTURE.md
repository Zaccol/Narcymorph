# Narcymorph - Architecture Technique

## Vue d'ensemble

Narcymorph est une plateforme web qui combine analyse de personnalité par IA, morphopsychologie et associations culturelles pour créer des profils psychologiques enrichis.

## Stack Technique

### Frontend
- **Framework:** Next.js 14+ (React 18+)
- **Language:** TypeScript
- **Styling:** TailwindCSS + Shadcn/ui
- **State Management:** Zustand + React Query
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Upload:** React Dropzone
- **Real-time:** Socket.io-client

### Backend
- **Framework:** NestJS (Node.js + TypeScript)
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Cache:** Redis
- **Authentication:** JWT + Passport
- **File Storage:** AWS S3 / Cloudinary
- **Real-time:** Socket.io
- **API Documentation:** Swagger/OpenAPI

### IA & Machine Learning
- **Analyse de personnalité:** OpenAI GPT-4 API
- **Analyse faciale:** Azure Face API / AWS Rekognition
- **Prompt Engineering:** Custom prompts pour associations
- **Vector DB:** Pinecone (pour similarité de profils)

### Infrastructure
- **Containerisation:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Hosting Frontend:** Vercel / Netlify
- **Hosting Backend:** Railway / AWS ECS
- **Storage:** AWS S3 / Cloudinary
- **Monitoring:** Sentry + LogRocket

## Architecture Système

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Pages     │  │  Components  │  │   State Mgmt    │   │
│  │  - Home     │  │  - Profile   │  │  - Auth Store   │   │
│  │  - Profile  │  │  - Quiz      │  │  - User Store   │   │
│  │  - Chat     │  │  - Chat      │  │  - Chat Store   │   │
│  │  - Friends  │  │  - Upload    │  │                 │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API + WebSocket
┌────────────────────────┴────────────────────────────────────┐
│                         BACKEND                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              API Gateway (NestJS)                    │   │
│  └─────────┬────────────────────────────────────┬──────┘   │
│            │                                     │           │
│  ┌─────────▼─────────┐              ┌──────────▼────────┐  │
│  │   Auth Module     │              │   User Module     │  │
│  │  - Login/Register │              │  - CRUD Users     │  │
│  │  - JWT Tokens     │              │  - Friends        │  │
│  └───────────────────┘              └───────────────────┘  │
│                                                              │
│  ┌───────────────────┐              ┌───────────────────┐  │
│  │ Personality Module│              │   Chat Module     │  │
│  │  - Quiz           │              │  - WebSocket      │  │
│  │  - Analysis       │              │  - Message Queue  │  │
│  │  - Associations   │              │  - AI Integration │  │
│  └─────────┬─────────┘              └───────────────────┘  │
│            │                                                 │
│  ┌─────────▼─────────────────────────────────────────────┐ │
│  │              AI Service Layer                         │ │
│  │  - OpenAI Integration                                 │ │
│  │  - Face Analysis                                      │ │
│  │  - Prompt Management                                  │ │
│  └───────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────────┐  ┌───────────┐  ┌────────────────────┐   │
│  │  PostgreSQL  │  │   Redis   │  │   S3 / Cloudinary  │   │
│  │  - Users     │  │  - Cache  │  │   - Photos         │   │
│  │  - Profiles  │  │  - Session│  │   - Assets         │   │
│  │  - Messages  │  │  - Queue  │  │                    │   │
│  └──────────────┘  └───────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Modèle de Données

### Utilisateur
```typescript
User {
  id: string
  email: string
  password: string (hashed)
  username: string
  createdAt: DateTime
  profile: Profile?
  friends: User[]
  messages: Message[]
}
```

### Profil
```typescript
Profile {
  id: string
  userId: string
  photoUrl: string

  // Questionnaire
  quizResponses: JSON

  // Analyse IA
  personalityType: string // "INTJ", "ENFP", etc.
  personalityDescription: string
  traits: JSON // Big Five, etc.

  // Associations découvertes
  totemAnimal: string?
  color: string?
  associatedObject: string?
  narutoCharacter: string?
  demonSlayerCharacter: string?
  harryPotterHouse: string?
  // ... autres associations

  // Métadonnées
  completionPercentage: number
  lastUpdated: DateTime
}
```

### Association
```typescript
Association {
  id: string
  profileId: string
  category: string // "anime", "color", "animal"
  subcategory: string? // "naruto", "demon-slayer"
  result: string
  confidence: number
  explanation: string
  createdAt: DateTime
}
```

### Message (Chat)
```typescript
Message {
  id: string
  userId: string
  content: string
  role: "user" | "assistant"
  context: JSON // Conversation context
  createdAt: DateTime
}
```

### Amitié
```typescript
Friendship {
  id: string
  userId1: string
  userId2: string
  status: "pending" | "accepted" | "rejected"
  createdAt: DateTime
}
```

## Flux Utilisateur Principaux

### 1. Onboarding
```
User Registration → Photo Upload → Quiz →
AI Analysis → Personality Profile Created → Dashboard
```

### 2. Découverte d'Associations
```
Dashboard → Select Association Type →
AI Processing → Result Display → Save to Profile
```

### 3. Chat avec IA
```
Open Chat → Send Message →
AI Analysis + Context → Response →
Profile Refinement (background)
```

### 4. Social
```
Search Users → Send Friend Request →
Accepted → View Friend Profile → Compare Associations
```

## Services IA

### Service d'Analyse de Personnalité
```typescript
PersonalityAnalysisService {
  - analyzeFromPhoto(photo): FacialTraits
  - analyzeFromQuiz(responses): PersonalityTraits
  - combineAnalyses(facial, quiz): PersonalityProfile
  - refineWithChat(profile, messages): UpdatedProfile
}
```

### Service d'Associations
```typescript
AssociationService {
  - getTotemAnimal(profile): Animal
  - getColor(profile): Color
  - getNarutoCharacter(profile): Character
  - getDemonSlayerCharacter(profile): Character
  - getHarryPotterHouse(profile): House
  // ... autres associations
}
```

### Prompts IA (Exemples)

**Analyse de Personnalité:**
```
Basé sur ces réponses au questionnaire et les traits faciaux identifiés,
dresse un profil psychologique détaillé selon le modèle des 16 personnalités.
Explique les traits dominants, les forces et les zones de développement.
```

**Association Naruto:**
```
Basé sur ce profil de personnalité [INTJ, traits: ...],
détermine quel personnage de Naruto correspond le mieux.
Prends en compte les valeurs, motivations et comportements du personnage.
Explique les similarités.
```

## Sécurité

- **Authentication:** JWT tokens (access + refresh)
- **Autorisation:** Role-based (user, premium, admin)
- **Data Protection:**
  - Encryption at rest (photos, sensitive data)
  - HTTPS only
  - Rate limiting
  - Input validation (Zod schemas)
- **Privacy:**
  - GDPR compliant
  - User consent for AI analysis
  - Data deletion on request

## Performance

- **Frontend:**
  - Code splitting
  - Image optimization (Next.js Image)
  - Lazy loading
  - CDN pour assets statiques

- **Backend:**
  - Redis caching (profils, associations)
  - Database indexing
  - Connection pooling
  - API rate limiting

- **IA:**
  - Batch processing quand possible
  - Cache des résultats similaires
  - Async processing pour analyses lourdes

## Évolutivité

- **Phase 1:** MVP (Questionnaire + Analyse basique + Quelques associations)
- **Phase 2:** Chat IA + Plus d'associations
- **Phase 3:** Social features (amis)
- **Phase 4:** Premium features (analyses avancées)
- **Phase 5:** Mobile app

## Coûts Estimés (Mensuel)

- **OpenAI API:** $100-500 (selon usage)
- **Face Analysis API:** $50-200
- **Hosting Backend:** $20-100
- **Hosting Frontend:** $0-20 (Vercel free tier)
- **Database:** $25-100
- **Storage:** $10-50
- **Total:** ~$200-1000/mois pour démarrer

## Alternatives Open Source

Pour réduire les coûts:
- **Face Analysis:** Face-api.js (browser-based)
- **LLM:** Llama 3 / Mistral (self-hosted)
- **Storage:** MinIO (self-hosted S3)
