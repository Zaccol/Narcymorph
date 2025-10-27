# Narcymorph

> Découvrez votre personnalité à travers l'IA et les associations culturelles

Narcymorph est une plateforme web innovante qui combine intelligence artificielle, morphopsychologie et culture populaire pour créer des profils psychologiques enrichis et personnalisés.

## Concept

Narcymorph permet aux utilisateurs de :

- **Analyser leur personnalité** via un questionnaire approfondi et l'analyse faciale
- **Découvrir des associations uniques** : animal totem, couleur, élément naturel
- **Se retrouver dans la culture pop** : personnages de Naruto, Demon Slayer, Harry Potter, Marvel...
- **Affiner leur profil** grâce à un chat IA interactif
- **Partager et comparer** avec des amis dans une dimension sociale

## Stack Technique

### Frontend
- **Next.js 14+** avec React 18 et TypeScript
- **TailwindCSS** + Shadcn/ui pour l'interface
- **Zustand** + React Query pour la gestion d'état
- **Framer Motion** pour les animations

### Backend
- **NestJS** (Node.js + TypeScript)
- **PostgreSQL** + Prisma ORM
- **Redis** pour le cache
- **Socket.io** pour le chat en temps réel

### IA & ML
- **OpenAI GPT-4** pour l'analyse de personnalité
- **Azure Face API** pour l'analyse faciale
- **Prompt engineering** personnalisé pour chaque association

### Infrastructure
- **Docker** + Docker Compose
- **CI/CD** avec GitHub Actions
- **Vercel** (Frontend) + **Railway** (Backend)

## Démarrage Rapide

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Compte OpenAI avec API key

### Installation avec Docker (Recommandé)

```bash
# Cloner le repository
git clone https://github.com/[USERNAME]/narcymorph.git
cd narcymorph

# Configurer les variables d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Éditer les fichiers .env avec vos clés API

# Lancer avec Docker
docker-compose up -d

# Initialiser la base de données
docker-compose exec backend npm run prisma:migrate

# Accéder à l'application
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
# API Docs: http://localhost:4000/api/docs
```

### Installation Locale

Voir le guide détaillé dans [QUICKSTART.md](./QUICKSTART.md)

## Documentation

- **[Architecture](./docs/ARCHITECTURE.md)** - Architecture technique détaillée
- **[Roadmap](./docs/ROADMAP.md)** - Plan de développement par phases
- **[Questionnaire](./docs/QUESTIONNAIRE.md)** - Questionnaire de personnalité
- **[Prompts IA](./docs/AI_PROMPTS.md)** - Prompts OpenAI optimisés
- **[Stack Technique](./docs/TECH_STACK.md)** - Technologies et dépendances
- **[Sécurité & Privacy](./docs/SECURITY_PRIVACY.md)** - Sécurité et RGPD
- **[Guide de Démarrage](./QUICKSTART.md)** - Installation pas à pas

## Structure du Projet

```
narcymorph/
├── backend/          # API NestJS
├── frontend/         # App Next.js
├── docs/            # Documentation
├── docker-compose.yml
└── README.md
```

## Roadmap de Développement

### Phase 1: MVP (Semaines 1-6)
- ✅ Architecture et setup
- 🔄 Authentification
- 🔄 Upload photo & questionnaire
- 🔄 Analyse IA de base
- 🔄 Dashboard profil

### Phase 2: Associations (Semaines 7-10)
- ⏳ Analyse faciale
- ⏳ Associations basiques (animal, couleur)
- ⏳ Associations pop culture (Naruto, HP, etc.)

### Phase 3: Chat IA (Semaines 11-13)
- ⏳ Interface chat en temps réel
- ⏳ Conversation contextuelle
- ⏳ Affinage du profil

### Phase 4: Social (Semaines 14-17)
- ⏳ Système d'amis
- ⏳ Profils publics
- ⏳ Comparaison de profils

### Phase 5+: Advanced Features
- ⏳ Features premium
- ⏳ Mobile app
- ⏳ Plus d'associations et d'univers

Voir la [roadmap complète](./docs/ROADMAP.md) pour plus de détails.

## Features Clés

### Analyse de Personnalité
- Questionnaire de 30 questions basé sur Big Five et 16 Personalities
- Analyse faciale via morphopsychologie
- Profil psychologique détaillé généré par GPT-4
- Traits, forces, valeurs et style de communication

### Associations Culturelles
- **Animal Totem** : Quel animal représente votre essence ?
- **Couleur** : Quelle couleur reflète votre personnalité ?
- **Élément** : Feu, Eau, Terre ou Air ?
- **Naruto** : Quel personnage êtes-vous ?
- **Demon Slayer** : Votre style de respiration ?
- **Harry Potter** : Votre maison à Hogwarts ?
- **Marvel** : Quel super-héros êtes-vous ?
- Et bien d'autres à venir...

### Chat IA Narcymorph
- Conversation intelligente pour affiner votre profil
- Questions personnalisées basées sur vos réponses
- Mise à jour en temps réel de votre analyse
- Suggestions de nouvelles associations

### Dimension Sociale
- Ajoutez des amis et découvrez leurs profils
- Comparez vos associations
- Score de compatibilité
- Profils publics/privés configurables

## Sécurité & Confidentialité

- **RGPD Compliant** : Respect total de la vie privée
- **Encryption** : Données sensibles chiffrées
- **Transparence** : Usage clair des données
- **Contrôle** : Export et suppression faciles
- **Sécurité** : HTTPS, JWT, rate limiting

Voir [SECURITY_PRIVACY.md](./docs/SECURITY_PRIVACY.md) pour plus de détails.

## Contribution

Ce projet est actuellement en développement initial. Les contributions seront ouvertes après le MVP.

Pour l'instant, vous pouvez :
- Reporter des bugs via Issues
- Suggérer des features
- Proposer de nouveaux univers culturels

## Licence

MIT License - Voir [LICENSE](./LICENSE)

## Auteur

Développé par [Votre Nom]

## Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- Twitter: [@yourusername](https://twitter.com/yourusername)

## Remerciements

- OpenAI pour l'API GPT-4
- Communautés Naruto, Demon Slayer, Harry Potter, etc.
- Contributors et beta-testers

---

**Note**: Ce projet est en développement actif. Les fonctionnalités peuvent évoluer.

⭐ Si vous aimez le concept, n'hésitez pas à star le repo!
