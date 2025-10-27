# Narcymorph - Guide de Démarrage Rapide

## Prérequis

- Node.js 18.17+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- Redis 6+ ([Download](https://redis.io/download))
- Git ([Download](https://git-scm.com/))
- Compte OpenAI avec API key ([OpenAI](https://platform.openai.com/))
- (Optionnel) Compte Azure pour Face API ([Azure](https://azure.microsoft.com/))

---

## Installation - Méthode 1 : Docker (Recommandé)

### 1. Cloner le repo
```bash
git clone https://github.com/[USERNAME]/narcymorph.git
cd narcymorph
```

### 2. Setup variables d'environnement
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Configurer les .env
Voir section "Configuration" ci-dessous

### 4. Lancer avec Docker
```bash
docker-compose up -d
```

### 5. Initialiser la base de données
```bash
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:generate
```

### 6. Accéder à l'application
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs
- Prisma Studio: http://localhost:5555

---

## Installation - Méthode 2 : Local

### Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Générer Prisma Client
npm run prisma:generate

# Lancer les migrations
npm run prisma:migrate

# Démarrer le serveur en mode dev
npm run start:dev
```

Le backend sera accessible sur http://localhost:4000

### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# Démarrer Next.js en mode dev
npm run dev
```

Le frontend sera accessible sur http://localhost:3000

---

## Configuration

### Backend (.env)

```env
# Application
NODE_ENV=development
PORT=4000
APP_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://narcymorph:password@localhost:5432/narcymorph?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_REFRESH_EXPIRATION=7d

# OpenAI
OPENAI_API_KEY=sk-...your-key-here...
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MODEL_CHEAP=gpt-3.5-turbo

# Face Analysis (Azure)
AZURE_FACE_API_KEY=your-azure-key
AZURE_FACE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/

# Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Ou AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=narcymorph-uploads

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=debug
```

### Frontend (.env.local)

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Narcymorph

# Features Flags (pour désactiver des features en dev)
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_SOCIAL=true
NEXT_PUBLIC_ENABLE_FACE_ANALYSIS=true

# Analytics (optionnel)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_POSTHOG_KEY=
```

---

## Structure du Projet

```
narcymorph/
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── auth/              # Module d'authentification
│   │   ├── users/             # Module utilisateurs
│   │   ├── personality/       # Module analyse de personnalité
│   │   ├── associations/      # Module associations culturelles
│   │   ├── chat/              # Module chat IA
│   │   ├── upload/            # Module upload de fichiers
│   │   ├── ai/                # Services IA (OpenAI, Azure)
│   │   ├── common/            # Guards, interceptors, etc.
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── test/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # App Next.js
│   ├── app/                   # App Router
│   │   ├── (auth)/           # Routes authentification
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/      # Routes protégées
│   │   │   ├── profile/
│   │   │   ├── discover/
│   │   │   ├── chat/
│   │   │   └── friends/
│   │   ├── onboarding/       # Processus d'onboarding
│   │   ├── api/              # API routes (BFF)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/               # Shadcn components
│   │   ├── personality/      # Components métier
│   │   ├── chat/
│   │   └── layout/
│   ├── lib/
│   │   ├── api.ts            # Axios instance
│   │   ├── socket.ts         # Socket.io setup
│   │   └── utils.ts
│   ├── stores/               # Zustand stores
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── chat.ts
│   ├── hooks/                # Custom hooks
│   ├── types/                # TypeScript types
│   ├── public/
│   ├── .env.local.example
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   ├── QUESTIONNAIRE.md
│   ├── AI_PROMPTS.md
│   └── TECH_STACK.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Commandes Utiles

### Backend

```bash
# Développement
npm run start:dev           # Dev avec hot-reload
npm run start:debug         # Dev avec debugger

# Build & Production
npm run build               # Build pour production
npm run start:prod          # Lancer en production

# Database
npm run prisma:generate     # Générer Prisma Client
npm run prisma:migrate      # Créer/appliquer migration
npm run prisma:studio       # Ouvrir Prisma Studio GUI
npm run prisma:seed         # Seed la DB (à créer)

# Tests
npm run test                # Unit tests
npm run test:watch          # Tests en mode watch
npm run test:cov            # Tests avec coverage
npm run test:e2e            # Tests E2E

# Code Quality
npm run lint                # ESLint
npm run format              # Prettier
```

### Frontend

```bash
# Développement
npm run dev                 # Dev server
npm run dev -- --turbo      # Dev avec Turbo (plus rapide)

# Build & Production
npm run build               # Build pour production
npm run start               # Serveur production
npm run analyze             # Analyser bundle size

# Tests
npm run test                # Jest tests
npm run test:watch          # Tests en mode watch
npm run test:e2e            # Playwright E2E

# Code Quality
npm run lint                # ESLint
npm run type-check          # TypeScript check
```

---

## Obtenir les Clés API

### OpenAI
1. Aller sur https://platform.openai.com/
2. S'inscrire / Se connecter
3. Aller dans API Keys
4. Créer une nouvelle clé
5. Ajouter du crédit (minimum $5)

**Coût estimé:**
- Développement: ~$5-10/mois
- Production (100 users): ~$100-300/mois

### Azure Face API
1. Créer un compte Azure
2. Créer une ressource "Face"
3. Récupérer la clé et l'endpoint
4. Free tier: 30,000 transactions/mois

**Alternative gratuite:** Utiliser Face-api.js (client-side)

### Cloudinary
1. S'inscrire sur https://cloudinary.com/
2. Free tier: 25GB storage, 25GB bandwidth/mois
3. Récupérer cloud_name, api_key, api_secret dans Dashboard

---

## Tester l'Installation

### 1. Vérifier que tout est lancé

```bash
# Backend
curl http://localhost:4000/health
# Doit retourner: {"status":"ok"}

# Frontend
curl http://localhost:3000
# Doit retourner la page HTML

# WebSocket
curl http://localhost:4000/socket.io/
# Doit retourner info Socket.io
```

### 2. Créer un utilisateur de test

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "username": "testuser"
  }'
```

### 3. Se connecter

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

Devrait retourner un token JWT.

---

## Troubleshooting

### Erreur: Cannot connect to database

**Solution:**
```bash
# Vérifier que PostgreSQL tourne
psql -U postgres

# Créer la DB manuellement si besoin
createdb narcymorph

# Vérifier la connection string dans .env
```

### Erreur: OpenAI API error

**Causes possibles:**
- Clé API invalide
- Pas de crédit sur le compte
- Rate limit dépassé

**Solution:**
- Vérifier la clé dans .env
- Vérifier le solde: https://platform.openai.com/account/usage

### Erreur: Port already in use

**Solution:**
```bash
# Trouver le process
lsof -i :4000  # ou :3000

# Kill le process
kill -9 [PID]

# Ou changer le port dans .env et package.json
```

### Erreur Prisma: Migration failed

**Solution:**
```bash
# Reset la DB (ATTENTION: efface toutes les données)
npm run prisma:migrate reset

# Ou manuellement
dropdb narcymorph
createdb narcymorph
npm run prisma:migrate
```

---

## Prochaines Étapes

Une fois l'installation fonctionnelle:

1. **Lire l'architecture:** `docs/ARCHITECTURE.md`
2. **Suivre la roadmap:** `docs/ROADMAP.md`
3. **Implémenter Phase 0:** Setup & Infrastructure
4. **Créer des issues GitHub** pour chaque tâche
5. **Commencer à coder!**

---

## Ressources

- **Next.js Docs:** https://nextjs.org/docs
- **NestJS Docs:** https://docs.nestjs.com/
- **Prisma Docs:** https://www.prisma.io/docs
- **Tailwind Docs:** https://tailwindcss.com/docs
- **OpenAI API Docs:** https://platform.openai.com/docs
- **Shadcn/ui:** https://ui.shadcn.com/

---

## Support

Pour toute question:
- Ouvrir une issue sur GitHub
- Consulter la documentation dans `/docs`
- Vérifier les logs: `docker-compose logs -f` ou `npm run start:dev`

Bon développement! 🚀
