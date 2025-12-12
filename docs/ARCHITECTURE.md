# Architecture Technique - LFS Lead Factory

## Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │ Pipeline │  │   Lead   │  │Analytics │   │
│  │          │  │  Kanban  │  │  Detail  │  │          │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └─────────────┴─────────────┴──────────────┘         │
│                        │ REST API                            │
└────────────────────────┼────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                   BACKEND (Node.js)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             Express API Server                        │  │
│  ├──────────┬──────────┬──────────┬──────────┬──────────┤  │
│  │  Auth    │  Leads   │Enrichment│Documents │Analytics │  │
│  │  Routes  │  Routes  │  Routes  │  Routes  │  Routes  │  │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┘  │
│       │          │          │          │          │         │
│  ┌────┴──────────┴──────────┴──────────┴──────────┴─────┐  │
│  │              Prisma ORM                              │  │
│  └────────────────────────┬──────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    PostgreSQL + PostGIS                     │
│  ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │Users │ │Leads │ │Sourcing  │ │Regulatory│ │Technical │ │
│  └──────┘ └──────┘ └──────────┘ └──────────┘ └──────────┘ │
│  ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │Network│ │Foncier│ │Economic │ │Documents │ │Comments │ │
│  └──────┘ └──────┘ └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ OpenAI   │  │  PVGIS   │  │  INPN    │  │ Mapbox   │   │
│  │  GPT-4   │  │ Irrad.   │  │Environmt │  │  Maps    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Stack Détaillé

### Frontend
- **Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **State Management**: React Query (server state) + useState/useContext (local)
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS
- **Charts**: Recharts
- **Forms**: Native HTML5 + custom hooks
- **HTTP**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod (optionnel)
- **File Upload**: Multer
- **PDF Generation**: PDFKit
- **Excel**: ExcelJS
- **IA**: OpenAI API
- **HTTP Client**: Axios

### Database
- **SGBD**: PostgreSQL 14+
- **Extension**: PostGIS (géospatial)
- **Migration**: Prisma Migrate
- **Backup**: pg_dump automatisé

### Infrastructure
- **Hosting Backend**: Railway / AWS ECS
- **Hosting Frontend**: Vercel / AWS S3+CloudFront
- **Database**: Railway PostgreSQL / AWS RDS
- **Storage**: AWS S3 (documents)
- **CDN**: CloudFlare
- **Monitoring**: Sentry (errors) + UptimeRobot (uptime)

## Flux de Données

### 1. Création Lead

```
User (Frontend)
    │
    ├─ POST /api/leads { commune, coordinates, ... }
    │
Backend (Express)
    │
    ├─ Validate data
    ├─ Generate internalName (auto)
    ├─ Create lead + sourcing (Prisma transaction)
    ├─ Log activity
    │
Database (PostgreSQL)
    │
    └─ Return lead ID + data
    │
Frontend
    │
    └─ Navigate to /leads/:id
```

### 2. Enrichissement Automatique

```
User clicks "Enrichir"
    │
    ├─ POST /api/enrichment/:leadId
    │
Backend
    │
    ├─ Fetch lead data (coordinates, etc.)
    │
    ├── Parallel API calls:
    │    ├─ PVGIS (irradiation)
    │    ├─ INPN (zonages environnementaux)
    │    └─ Internal DB (postes sources)
    │
    ├─ Calculate quality score (ML model)
    ├─ Update lead tables (technical, regulatory, etc.)
    ├─ Log activity
    │
Database
    │
    └─ Return enrichment results
    │
Frontend
    │
    └─ Refresh lead data, show toast notification
```

### 3. Génération Dossier PDF

```
User clicks "Générer PDF"
    │
    ├─ POST /api/leads/:id/generate-pdf
    │
Backend
    │
    ├─ Fetch complete lead data (all relations)
    │
    ├─ PDFKit document creation:
    │    ├─ Page de garde
    │    ├─ Synthèse (data from DB)
    │    ├─ Cartes (Mapbox Static API)
    │    ├─ Graphiques (Chart.js to PNG)
    │    └─ Annexes (uploaded documents)
    │
    ├─ Save PDF to storage (S3)
    ├─ Create document record
    │
Database
    │
    └─ Return PDF URL
    │
Frontend
    │
    └─ Download PDF
```

## Sécurité

### Authentication Flow

```
1. User login (email + password)
2. Backend validates credentials
3. Generate JWT token (signed with secret)
4. Return token to frontend
5. Frontend stores token (localStorage)
6. All subsequent requests include token in header:
   Authorization: Bearer <token>
7. Backend middleware validates token
8. If valid → continue, else 401 Unauthorized
```

### Permissions (RBAC)

| Role | Permissions |
|------|------------|
| **ADMIN** | Tout (CRUD users, leads, config) |
| **MANAGER** | Voir tous leads, reviewer QA, analytics |
| **OPS** | CRUD ses leads assignés, voir leads publics |
| **COMMERCIAL** | Voir leads "Client Ready", marquer vendus |

### Data Encryption

- **Passwords**: bcrypt (10 rounds)
- **Sensitive data** (propriétaire): AES-256 (encrypt at rest)
- **JWT**: HS256 signature
- **HTTPS**: TLS 1.3 (production)

## Performance

### Optimisations Backend

1. **Database Indexing**:
   - Index sur `lead.status`, `lead.assignedToId`, `lead.qualityScore`
   - Composite index sur `activityLog(leadId, createdAt)`

2. **Caching** (Redis):
   - S3REnR data (1 jour)
   - Dashboard stats (5 min)
   - User sessions (JWT blacklist)

3. **Rate Limiting**:
   - API: 100 req/min par IP
   - Auth endpoints: 5 req/min

4. **Pagination**:
   - Leads list: 50 par page
   - Activity logs: 100 derniers

### Optimisations Frontend

1. **Code Splitting**: Routes lazy-loaded
2. **React Query**: Automatic caching, deduplication
3. **Image Optimization**: WebP format, lazy loading
4. **Bundle Size**: Tree-shaking, minification

## Monitoring

### Métriques Clés

- **Uptime**: >99.5%
- **API Latency**: P95 <500ms
- **Error Rate**: <1%
- **Database Connections**: <50 simultaneous

### Alertes

- API down >5 min → Email + SMS
- Error spike >10/min → Slack notification
- Database CPU >80% → Auto-scaling trigger

## Évolutivité

### Scalabilité Horizontale

- **Backend**: Stateless, multi-instances (load balancer)
- **Database**: Read replicas, connection pooling
- **Storage**: CDN pour documents statiques

### Limites Actuelles

- **Leads**: 100k records (PostgreSQL peut gérer)
- **Users**: 100 concurrent (1 instance backend suffit)
- **Files**: S3 illimité

### Plan Scale (>500k leads/an)

- Microservices (lead-service, enrichment-service)
- Message queue (RabbitMQ, AWS SQS)
- ElasticSearch pour recherche full-text
- Kubernetes pour orchestration

---

**Version**: 1.0.0
**Dernière mise à jour**: 28 novembre 2025
