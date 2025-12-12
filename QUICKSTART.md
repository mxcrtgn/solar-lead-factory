# 🚀 Quick Start - LFS Lead Factory

## ✅ Backend Opérationnel !

Le backend API est **configuré et fonctionnel** sur le port 3001.

### 📊 Status Actuel

- ✅ Base de données SQLite créée (`dev.db`)
- ✅ Migrations Prisma appliquées (12 tables)
- ✅ Données de démo insérées
- ✅ API REST fonctionnelle sur `http://localhost:3001`

### 🔐 Comptes de Test

**Admin:**
- Email: `admin@lfs.fr`
- Password: `admin123`

**Ops:**
- Email: `ops@lfs.fr`
- Password: `ops123`

### 🧪 Tester l'API

**Health check:**
```bash
curl http://localhost:3001/health
# Réponse: {"status":"ok","timestamp":"..."}
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@lfs.fr","password":"admin123"}'
```

**Get leads (avec token):**
```bash
TOKEN="your-jwt-token-here"
curl http://localhost:3001/api/leads \
  -H "Authorization: Bearer $TOKEN"
```

### 📁 Données de Démo

Un lead exemple a été créé :
- **Nom**: SAL-PAC-001
- **Commune**: Salon-de-Provence (13)
- **Surface**: 8.2 ha
- **Score qualité**: 78/100
- **TRI estimé**: 11.5%

---

## 🎨 Prochaine Étape: Frontend

### Installation Frontend

```bash
cd ../frontend
npm install
```

### Configuration

Créer `.env` :
```bash
echo "VITE_API_URL=http://localhost:3001/api" > .env
echo "VITE_MAPBOX_TOKEN=pk.your-mapbox-token" >> .env
```

### Démarrage

```bash
npm run dev
```

Frontend disponible sur: `http://localhost:5173`

---

## 🛑 Arrêter le Backend

```bash
# Trouver le processus Node
ps aux | grep node

# Ou arrêter tous les processus Node
pkill -f "node"
```

---

## 📚 Endpoints API Disponibles

### Auth
- `POST /api/auth/register` - Créer utilisateur
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur actuel

### Leads
- `GET /api/leads` - Liste leads (avec filtres)
- `GET /api/leads/:id` - Lead détaillé
- `POST /api/leads` - Créer lead
- `PATCH /api/leads/:id` - Modifier lead
- `PATCH /api/leads/:id/status` - Changer statut
- `POST /api/leads/:id/assign` - Assigner à ops

### Enrichissement
- `POST /api/enrichment/:leadId` - Enrichir automatiquement

### Documents
- `POST /api/documents/:leadId` - Upload document
- `GET /api/documents/:leadId` - Liste documents
- `DELETE /api/documents/:id` - Supprimer document

### Analytics
- `GET /api/analytics/dashboard` - KPIs dashboard
- `GET /api/analytics/timeline` - Production timeline

### Users
- `GET /api/users` - Liste utilisateurs
- `GET /api/users/:id` - Utilisateur détaillé

---

## 🗄️ Base de Données

**Location:** `/Users/max321/Documents/LFS/lfs-lead-platform/backend/dev.db`

**Visualiser la DB:**
```bash
# Prisma Studio (interface graphique)
npx prisma studio
```

Ouvre sur: `http://localhost:5555`

---

## 🐛 Dépannage

### Port déjà utilisé
Si le port 3001 est pris, modifier dans `.env`:
```
PORT=3002
```

### Réinitialiser la DB
```bash
rm dev.db
npx prisma migrate dev
node prisma/seed.js
```

### Régénérer Prisma Client
```bash
npx prisma generate
```

---

## 📖 Documentation Complète

- Architecture: `/docs/ARCHITECTURE.md`
- Déploiement: `/docs/DEPLOYMENT.md`
- README: `/README.md`

---

**Version**: 1.0.0
**Date**: 28 novembre 2025
**Status**: ✅ Backend opérationnel, Frontend à installer
