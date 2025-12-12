# Guide de Déploiement - LFS Lead Factory

## Prérequis

### Système
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Services Externes (optionnels)
- OpenAI API key (pour enrichissement IA)
- Solargis API key (données solaires premium)
- Mapbox API key (cartographie)

---

## Installation Locale (Développement)

### 1. Cloner le Repository

```bash
git clone https://github.com/lfs/lfs-lead-platform.git
cd lfs-lead-platform
```

### 2. Configuration Backend

```bash
cd backend
npm install
```

Créer `.env` (copier depuis `.env.example`):

```bash
cp .env.example .env
```

Éditer `.env` avec vos paramètres:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lfs_leads"
JWT_SECRET="votre-secret-jwt-super-securise"
OPENAI_API_KEY="sk-votre-cle-openai"
PORT=5000
```

Initialiser la base de données:

```bash
npx prisma migrate dev
npx prisma db seed # Données de démo
```

Lancer le serveur:

```bash
npm run dev
```

API disponible sur `http://localhost:5000`

### 3. Configuration Frontend

```bash
cd ../frontend
npm install
```

Créer `.env`:

```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env
echo "VITE_MAPBOX_TOKEN=votre-token-mapbox" >> .env
```

Lancer l'application:

```bash
npm run dev
```

App disponible sur `http://localhost:5173`

---

## Déploiement Production

### Option 1: Vercel + Railway (Recommandé - Simple)

**Backend (Railway):**

1. Créer compte sur railway.app
2. New Project → Deploy PostgreSQL
3. New Project → Deploy from GitHub
4. Ajouter variables d'environnement (DATABASE_URL, JWT_SECRET, etc.)
5. Deploy automatique sur push

**Frontend (Vercel):**

1. Créer compte sur vercel.com
2. Import Git Repository
3. Framework Preset: Vite
4. Ajouter variables d'environnement (VITE_API_URL)
5. Deploy

### Option 2: Docker (VPS/Cloud)

**Backend Dockerfile:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]
```

**Frontend Dockerfile:**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:14-3.3-alpine
    environment:
      POSTGRES_DB: lfs_leads
      POSTGRES_USER: lfs
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://lfs:${DB_PASSWORD}@postgres:5432/lfs_leads
      JWT_SECRET: ${JWT_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Déployer:

```bash
docker-compose up -d
```

### Option 3: AWS (Scalable)

- **Backend**: AWS ECS (Fargate) + RDS PostgreSQL
- **Frontend**: S3 + CloudFront
- **Files**: S3 pour stockage documents
- **Monitoring**: CloudWatch

---

## Configuration Initiale

### 1. Créer Utilisateur Admin

```bash
# Backend en local
cd backend
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

(async () => {
  const password = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@lfs.fr',
      password,
      firstName: 'Admin',
      lastName: 'LFS',
      role: 'ADMIN',
    },
  });
  console.log('Admin créé:', admin.email);
  process.exit();
})();
"
```

### 2. Configurer APIs Externes

**OpenAI (enrichissement IA):**
- Obtenir clé: https://platform.openai.com/api-keys
- Ajouter à `.env`: `OPENAI_API_KEY=sk-...`

**Mapbox (cartes):**
- Obtenir token: https://account.mapbox.com/
- Ajouter à frontend `.env`: `VITE_MAPBOX_TOKEN=pk...`

---

## Maintenance

### Backup Base de Données

```bash
pg_dump -h localhost -U lfs lfs_leads > backup_$(date +%Y%m%d).sql
```

### Restauration

```bash
psql -h localhost -U lfs lfs_leads < backup_20250128.sql
```

### Logs

```bash
# Backend
docker logs lfs-backend -f

# Frontend
docker logs lfs-frontend -f
```

### Mise à jour

```bash
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d
```

---

## Monitoring & Performance

### Métriques à Surveiller

- **API Response Time**: <200ms (médian)
- **Database Connections**: <50
- **Memory Usage**: <512MB (backend)
- **Error Rate**: <1%

### Outils Recommandés

- **Uptime**: UptimeRobot (gratuit)
- **Errors**: Sentry
- **Performance**: New Relic / DataDog
- **Logs**: Papertrail / Logtail

---

## Sécurité

### Checklist Production

- [ ] HTTPS activé (Let's Encrypt)
- [ ] JWT_SECRET robuste (32+ caractères)
- [ ] CORS configuré (whitelist domaines)
- [ ] Rate limiting activé (100 req/min)
- [ ] Backup automatique quotidien
- [ ] Logs d'accès activés
- [ ] Données sensibles chiffrées (AES-256)
- [ ] Variables d'environnement sécurisées (pas dans Git)

---

## Support

**Documentation**: `/docs`
**Issues**: GitHub Issues
**Contact**: tech@lafermesolaire.fr

---

**Version**: 1.0.0
**Dernière mise à jour**: 28 novembre 2025
