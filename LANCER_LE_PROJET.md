# 🚀 Guide Rapide - Lancer Narcymorph

> **Mise à jour :** Le projet utilise maintenant **Gemini (Google) - GRATUIT** au lieu d'OpenAI !

---

## ✅ ÉTAPE 1 : Obtenir votre Clé API Gemini (GRATUIT)

### 🎁 Gemini est GRATUIT
- **60 requêtes par minute**
- **Pas de carte bancaire requise**
- **Parfait pour tester et développer**

### Obtenir la clé :

1. **Aller sur :** https://makersuite.google.com/app/apikey

2. **Se connecter** avec votre compte Google

3. **Cliquer sur "Create API Key"**

4. **Copier la clé** (commence par `AIza...`)

**Gardez cette clé, on en aura besoin à l'étape 3 !**

---

## ✅ ÉTAPE 2 : Obtenir Cloudinary (GRATUIT)

Pour le stockage des photos (25GB gratuit) :

1. **Aller sur :** https://cloudinary.com/users/register_free

2. **S'inscrire** (gratuit)

3. Sur le **Dashboard**, copier :
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

## ✅ ÉTAPE 3 : Configurer le Projet

Vous êtes dans `C:\Users\louis\Narcymorph` :

```powershell
# 1. Configurer le Backend
cd backend
copy .env.example .env

# 2. Ouvrir le fichier .env
notepad .env
```

**Dans le fichier .env, remplir UNIQUEMENT ces lignes :**

```env
# GEMINI (METTRE VOTRE CLÉ - commence par AIza...)
GEMINI_API_KEY=AIzaVotreCléIci

# CLOUDINARY (METTRE VOS INFOS)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# JWT (METTRE N'IMPORTE QUEL TEXTE LONG)
JWT_SECRET=mon-super-secret-aleatoire-minimum-32-caracteres
JWT_REFRESH_SECRET=autre-secret-different-aussi-long

# LAISSER LE RESTE TEL QUEL
```

**Sauvegarder et fermer** le fichier.

```powershell
# Retour au dossier principal
cd ..
```

---

## ✅ ÉTAPE 4 : Installer PostgreSQL

**Option Simple - Docker (Recommandé) :**

1. **Télécharger Docker Desktop :** https://www.docker.com/products/docker-desktop/
2. **Installer** et redémarrer l'ordinateur
3. **Lancer Docker Desktop**

```powershell
# Dans C:\Users\louis\Narcymorph
docker-compose up -d postgres redis

# Attendre 20 secondes que ça démarre
```

**Option Manuelle (Si pas Docker) :**

1. **Télécharger PostgreSQL :** https://www.postgresql.org/download/windows/
2. Installer avec mot de passe : `password`
3. Laisser le port : `5432`

---

## ✅ ÉTAPE 5 : Installer les Dépendances

```powershell
# Backend
cd backend
npm install
# Attendre 2-3 minutes...

# Frontend
cd ..\frontend
npm install
# Attendre 2-3 minutes...

cd ..
```

---

## ✅ ÉTAPE 6 : Initialiser la Base de Données

```powershell
cd backend

# Générer Prisma
npx prisma generate

# Créer les tables
npx prisma migrate dev --name init

# Vous devriez voir: "Your database is now in sync"
```

---

## ✅ ÉTAPE 7 : Lancer le Backend

```powershell
# Dans backend/
npm run start:dev
```

**Vous devriez voir :**
```
🚀 Narcymorph API running on: http://localhost:4000
📚 API Documentation: http://localhost:4000/api/docs
✅ Database connected successfully
```

**✅ LAISSER CE TERMINAL OUVERT**

---

## ✅ ÉTAPE 8 : Lancer le Frontend

**Ouvrir un NOUVEAU terminal PowerShell :**

```powershell
cd C:\Users\louis\Narcymorph\frontend
npm run dev
```

**Vous devriez voir :**
```
▲ Next.js 14.2.3
- Local:   http://localhost:3000
```

**✅ LAISSER CE TERMINAL OUVERT AUSSI**

---

## ✅ ÉTAPE 9 : Tester !

### 1. **Ouvrir le navigateur :**

http://localhost:3000

Vous devriez voir la page d'accueil Narcymorph !

### 2. **Créer un compte :**

- Cliquer "Commencer l'aventure"
- Remplir le formulaire
- S'inscrire

### 3. **Tester l'API Swagger :**

http://localhost:4000/api/docs

Voir toute la documentation API interactive !

---

## 🎉 C'EST TOUT !

**Votre app tourne :**
- ✅ Frontend : http://localhost:3000
- ✅ Backend : http://localhost:4000
- ✅ API Docs : http://localhost:4000/api/docs
- ✅ IA Gemini : **GRATUIT** et connectée !

---

## 🐛 En Cas de Problème

### ❌ Erreur "Cannot connect to database"

```powershell
# Si Docker:
docker-compose restart postgres

# Si PostgreSQL manuel:
# Vérifier que le service PostgreSQL tourne dans Services Windows
```

### ❌ Erreur "Port 4000 already in use"

```powershell
# Trouver le processus
netstat -ano | findstr :4000

# Noter le PID (dernier nombre) et tuer:
taskkill /PID <le_PID> /F
```

### ❌ Erreur Gemini API

**Vérifier que :**
- La clé dans `backend/.env` est correcte
- La clé commence bien par `AIza...`
- Vous êtes connecté à Internet

**Tester la clé :**
Aller sur https://makersuite.google.com/app/apikey et vérifier qu'elle existe

---

## 💡 Commandes Utiles

```powershell
# Arrêter tout
# Faire Ctrl+C dans les 2 terminaux

# Relancer Backend
cd backend
npm run start:dev

# Relancer Frontend
cd frontend
npm run dev

# Voir la base de données (interface graphique)
cd backend
npx prisma studio
# Ouvre http://localhost:5555
```

---

## 📚 Prochaines Étapes

Une fois que tout marche :

1. **Explorer le code** dans `backend/` et `frontend/`
2. **Créer des comptes** pour tester
3. **Lire la documentation** dans `docs/`
4. **Développer les interfaces** (quiz, upload, etc.)

**Consultez `ROADMAP.md` pour le plan de développement complet !**

---

## 🆓 Coûts

**Actuellement : 0€ !**

- ✅ Gemini : GRATUIT (60 req/min)
- ✅ Cloudinary : GRATUIT (25GB)
- ✅ PostgreSQL : Local (gratuit)
- ✅ Redis : Local (gratuit)

**En production (Vercel + Railway) :**
- Frontend : $0 (Vercel free)
- Backend + DB : ~$20-40/mois (Railway)
- Total : **~$20-40/mois** pour 100-500 users

---

## ❓ Questions ?

- Lire `START_HERE.md` pour le guide complet
- Lire `ARCHITECTURE.md` pour comprendre la structure
- Vérifier `TROUBLESHOOTING` ci-dessus

**Bon développement ! 🚀**
