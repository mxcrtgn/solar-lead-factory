# LFS Lead Factory - Plateforme de Production de Leads

Plateforme web pour optimiser et scaler la production de leads solaires ultra-qualifiés.

## 🎯 Objectif
Multiplier par 2-3x la productivité des ops (30 → 60-100 leads/mois) via automatisation et IA.

## 🏗️ Architecture

```
lfs-lead-platform/
├── backend/          # API Node.js + PostgreSQL
├── frontend/         # React + TypeScript
├── docs/            # Documentation
└── README.md
```

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📦 Stack Technique

**Backend:**
- Node.js + Express
- PostgreSQL + PostGIS
- Prisma ORM
- JWT Authentication

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS
- React Query
- Mapbox GL JS
- Recharts

**IA & Automatisation:**
- OpenAI API (GPT-4)
- Python scripts (scraping)
- ML Scoring (XGBoost)

## 🔑 Fonctionnalités Principales

### Module 1: Pipeline Kanban
- Vue d'ensemble visuelle des leads
- Drag & drop entre étapes
- Filtres et recherche
- Analytics temps réel

### Module 2: Fiche Lead
- 9 onglets détaillés
- Carte interactive (Mapbox)
- Enrichissement automatique
- Calculs financiers auto

### Module 3: Enrichissement IA
- APIs externes (cadastre, PVGIS, INPN)
- Rédaction assistée GPT-4
- Scoring qualité ML (0-100)
- Détection anomalies

### Module 4: Génération Dossiers
- PDF professionnel auto
- Cartes et graphiques
- Modèle Excel financier
- Templates personnalisables

### Module 5: QA & Collaboration
- Validations automatiques
- Workflow review manager
- Commentaires & notifications
- Historique complet

## 📊 Performances Attendues

- **Productivité**: +100-150%
- **Temps/lead**: 4j → 2.5j (-37%)
- **Score qualité**: +15%
- **Prix moyen**: +17%

## 🔐 Sécurité

- Authentification JWT
- Données sensibles chiffrées (AES-256)
- RBAC (Admin, Manager, Ops, Commercial)
- Logs d'audit

## 📱 Support

- Desktop: Chrome, Firefox, Safari, Edge
- Mobile: Responsive design
- Tablet: Optimisé

## 🛠️ Développement

Voir `/docs` pour:
- Guide installation détaillé
- Architecture technique
- API documentation
- Guide contribution

## 📄 Licence

Propriétaire - La Ferme Solaire © 2025
