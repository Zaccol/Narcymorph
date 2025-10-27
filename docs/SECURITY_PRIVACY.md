# Sécurité & Confidentialité - Narcymorph

## Vue d'ensemble

Narcymorph traite des données sensibles (photos, informations psychologiques). La sécurité et le respect de la vie privée sont critiques.

---

## Conformité Réglementaire

### RGPD (Europe)

#### Droits des Utilisateurs
- **Droit d'accès:** Export complet du profil
- **Droit de rectification:** Modification des données
- **Droit à l'effacement:** Suppression complète du compte
- **Droit à la portabilité:** Export JSON de toutes les données
- **Droit d'opposition:** Opt-out du traitement IA

#### Consentement
- Consentement explicite avant upload de photo
- Consentement pour l'analyse IA
- Consentement pour le stockage des données
- Possibilité de retirer le consentement

#### Base Légale
- **Consentement** pour l'analyse de personnalité
- **Intérêt légitime** pour amélioration du service
- **Exécution du contrat** pour features premium

### CCPA (Californie)

- Transparency sur collecte de données
- Droit de suppression
- Opt-out de vente de données (on ne vend JAMAIS)

---

## Architecture de Sécurité

### 1. Authentification

#### Mots de Passe
```typescript
// Hashing avec bcrypt
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Politique de mot de passe
- Minimum 8 caractères
- Au moins 1 majuscule
- Au moins 1 chiffre
- Au moins 1 caractère spécial
```

#### JWT Tokens
```typescript
// Access Token
{
  expiresIn: '15m',
  algorithm: 'HS256',
  issuer: 'narcymorph-api'
}

// Refresh Token
{
  expiresIn: '7d',
  stored in httpOnly cookie
}
```

#### Session Management
- Refresh token rotation
- Invalidation lors du logout
- Détection de token volé (fingerprinting)

### 2. Autorisation

#### Role-Based Access Control (RBAC)
```typescript
enum Role {
  USER = 'user',
  PREMIUM = 'premium',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

// Guards
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
```

#### Resource-Level Permissions
- User peut seulement voir/modifier ses propres données
- Profils publics limités aux amis acceptés
- Chat IA privé par utilisateur

### 3. Protection des Données

#### Encryption at Rest
```typescript
// Photos
- Stockées sur S3/Cloudinary avec encryption
- URLs signées temporaires (expiration 1h)
- Pas de stockage local permanent

// Données sensibles
- Hashed passwords (bcrypt)
- Encrypted PII fields (AES-256)
```

#### Encryption in Transit
```typescript
// HTTPS Obligatoire
- TLS 1.3
- Certificate SSL valide
- HSTS header

app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

#### Database Security
```typescript
// Prisma Client
- Prepared statements (SQL injection prevention)
- Parameterized queries
- No raw SQL sans sanitization

// Connection
- SSL/TLS connection
- Minimum privileges pour l'app user
- Readonly replicas pour analytics
```

### 4. API Security

#### Rate Limiting
```typescript
// Par endpoint
@Throttle(5, 60) // 5 requests per 60s
async analyzePersonality() {}

// Global
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100 // requests per IP
}));
```

#### Input Validation
```typescript
// DTO Validation avec class-validator
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  @MinLength(8)
  password: string;

  @IsString()
  @MaxLength(50)
  username: string;
}
```

#### CORS
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
```

#### Security Headers
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"]
    }
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'no-referrer' }
}));
```

### 5. Upload Security

#### File Validation
```typescript
// Type checking
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

// Size limit
const maxSize = 10 * 1024 * 1024; // 10MB

// Magic number verification (pas juste extension)
import fileType from 'file-type';
const type = await fileType.fromBuffer(buffer);
```

#### Image Processing
```typescript
// Sanitization avec Sharp
await sharp(buffer)
  .resize(1000, 1000, { fit: 'inside' })
  .removeExif() // Remove metadata
  .toFormat('jpeg')
  .jpeg({ quality: 85 })
  .toBuffer();
```

### 6. AI Security

#### Prompt Injection Prevention
```typescript
// Sanitize user input avant envoi à OpenAI
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML
    .substring(0, 5000) // Limit length
    .trim();
}

// Structured prompts
const systemPrompt = "You are a personality analyzer...";
const userInput = sanitizeInput(userMessage);
```

#### Data Minimization
```typescript
// N'envoyer que le nécessaire à OpenAI
const payload = {
  personalityType: profile.type,
  traits: profile.dominantTraits.map(t => t.name),
  // NE PAS envoyer: email, nom, photo raw
};
```

---

## Privacy by Design

### 1. Data Minimization

**Collecté:**
- Email (auth only)
- Username
- Photo (temporaire pour analyse)
- Réponses questionnaire
- Résultats analyses

**PAS Collecté:**
- Nom réel
- Adresse
- Numéro téléphone
- Données bancaires (Stripe gère)

### 2. Purpose Limitation

```typescript
// Chaque donnée a un but spécifique
interface DataPurpose {
  photo: 'facial_analysis_only',
  quiz_responses: 'personality_analysis',
  chat_history: 'profile_refinement',
  email: 'authentication_only'
}
```

### 3. Storage Limitation

```typescript
// Rétention des données
const retentionPolicies = {
  photos: '24h', // Suppression après analyse
  chatHistory: '90 days',
  deletedAccounts: '30 days', // Grace period
  logs: '30 days'
};
```

### 4. Transparency

#### Privacy Policy
- Langage clair (pas de jargon légal)
- Explication de chaque traitement
- Mise à jour avec notification

#### Data Usage Notice
```
Avant chaque upload de photo:
┌─────────────────────────────────────────┐
│ 🔒 Votre photo sera utilisée pour:     │
│                                         │
│ ✓ Analyse faciale (traits)             │
│ ✓ Amélioration du profil               │
│                                         │
│ ❌ Jamais partagée publiquement         │
│ ❌ Jamais vendue                        │
│ 🗑️  Supprimée après 24h                 │
│                                         │
│ [ ] J'accepte                           │
└─────────────────────────────────────────┘
```

---

## Features de Sécurité

### 1. Privacy Dashboard

```typescript
// Page /settings/privacy
interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showAssociations: boolean;
  allowFriendRequests: boolean;
  dataExport: () => Promise<JSON>;
  deleteAccount: () => Promise<void>;
}
```

### 2. Data Export

```typescript
// RGPD Article 20 - Portabilité
async exportUserData(userId: string): Promise<JSON> {
  return {
    profile: await getProfile(userId),
    personality: await getPersonalityData(userId),
    associations: await getAssociations(userId),
    chatHistory: await getChatHistory(userId),
    friends: await getFriends(userId),
    metadata: {
      exportDate: new Date(),
      dataVersion: '1.0'
    }
  };
}
```

### 3. Account Deletion

```typescript
// RGPD Article 17 - Droit à l'effacement
async deleteAccount(userId: string) {
  // Soft delete (30 days grace period)
  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      email: `deleted_${userId}@deleted.com`,
      username: `deleted_${userId}`
    }
  });

  // Immediate photo deletion
  await deleteUserPhotos(userId);

  // Anonymize chat history
  await anonymizeChatHistory(userId);

  // After 30 days: Hard delete via cron
}
```

### 4. Audit Logging

```typescript
// Log des accès sensibles
interface AuditLog {
  userId: string;
  action: 'login' | 'profile_view' | 'data_export' | 'delete_request';
  ip: string;
  userAgent: string;
  timestamp: Date;
}
```

---

## Threat Model

### Menaces Identifiées

1. **Credential Stuffing**
   - Mitigation: Rate limiting, CAPTCHA, 2FA (future)

2. **SQL Injection**
   - Mitigation: Prisma ORM, parameterized queries

3. **XSS (Cross-Site Scripting)**
   - Mitigation: CSP headers, input sanitization, output encoding

4. **CSRF (Cross-Site Request Forgery)**
   - Mitigation: SameSite cookies, CSRF tokens

5. **Photo Leakage**
   - Mitigation: Signed URLs, temporary storage, encryption

6. **Prompt Injection**
   - Mitigation: Input sanitization, system prompts, output validation

7. **Data Breach**
   - Mitigation: Encryption, access controls, audit logs

---

## Incident Response

### Plan en cas de breach

1. **Detection:** Monitoring automatique (Sentry, logs)
2. **Containment:** Isoler le système compromis
3. **Eradication:** Patch la vulnérabilité
4. **Recovery:** Restaurer depuis backup
5. **Notification:**
   - Utilisateurs affectés (72h)
   - Autorités (CNIL en France)
6. **Post-mortem:** Analyse et amélioration

---

## Checklist de Sécurité (Pre-Launch)

### Backend
- [ ] HTTPS configuré
- [ ] Security headers (Helmet)
- [ ] Rate limiting actif
- [ ] Input validation sur tous endpoints
- [ ] SQL injection tests
- [ ] Authentication robuste (JWT)
- [ ] Authorization checks (Guards)
- [ ] Encryption des données sensibles
- [ ] Secure password storage (bcrypt)
- [ ] Audit logging implémenté

### Frontend
- [ ] CSP headers configurés
- [ ] No sensitive data in localStorage
- [ ] XSS prevention (escape user input)
- [ ] Secure cookie settings
- [ ] HTTPS only
- [ ] No API keys in client code

### Infrastructure
- [ ] Firewall configuré
- [ ] Database access restreint
- [ ] Backups automatiques
- [ ] Monitoring actif (Sentry)
- [ ] SSL certificates valides
- [ ] Environment variables sécurisées

### Légal
- [ ] Privacy Policy rédigée
- [ ] Terms of Service rédigés
- [ ] Cookie consent banner
- [ ] RGPD compliance check
- [ ] Data Processing Agreement si sous-traitants

---

## Bonnes Pratiques Développement

### 1. Secrets Management
```bash
# Ne JAMAIS commit de secrets
# Utiliser .env et .gitignore

# Production: utiliser secret manager
# - AWS Secrets Manager
# - HashiCorp Vault
# - Railway/Vercel env vars
```

### 2. Code Review
```typescript
// Security checklist pour PR
- [ ] No hardcoded secrets
- [ ] Input validation
- [ ] Authorization checks
- [ ] No SQL injection vectors
- [ ] Error messages don't leak info
```

### 3. Dependency Security
```bash
# Scan régulier des dépendances
npm audit
npm audit fix

# Automatique avec GitHub Dependabot
```

### 4. Testing
```typescript
// Tests de sécurité
describe('Security', () => {
  it('should reject weak passwords', async () => {
    await expect(createUser({ password: '123' }))
      .rejects.toThrow();
  });

  it('should prevent SQL injection', async () => {
    await expect(findUser({ name: "'; DROP TABLE users--" }))
      .resolves.toBe(null);
  });
});
```

---

## Ressources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- RGPD: https://www.cnil.fr/
- NestJS Security: https://docs.nestjs.com/security/
- Next.js Security: https://nextjs.org/docs/advanced-features/security-headers
