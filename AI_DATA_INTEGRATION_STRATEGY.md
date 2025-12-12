# Stratégie d'Intégration IA & Sources de Données - Lead Factory

## Vue d'ensemble

La **Lead Factory** est conçue pour accélérer drastiquement la production de leads solaires qualifiés en combinant l'intelligence artificielle, des API publiques et privées, et l'expertise humaine. L'objectif est de réduire le temps de qualification d'un lead de **plusieurs semaines à quelques jours**.

---

## Architecture de l'Intégration

```
┌─────────────────────────────────────────────────────────────┐
│                     LEAD FACTORY                            │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   SOURCING   │ => │  REGULATORY  │ => │  TECHNICAL   │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         ↓                    ↓                    ↓        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   NETWORK    │ => │   FONCIER    │ => │   ECONOMIC   │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         ↓                    ↓                    ↓        │
│  └──────────────────────────────────────────────────────┘  │
│                      QA_REVIEW                             │
└─────────────────────────────────────────────────────────────┘
                             ↓
                  VALIDATED / REJECTED
```

---

## 1. Étape SOURCING

### Objectif
Identifier des terrains potentiels pour projets solaires via analyse satellite et données géographiques.

### Technologies & APIs

#### IA - Analyse Satellite
- **Source**: Google Earth Engine, Sentinel-2, Planet Labs
- **Modèle**: CNN (Convolutional Neural Network) entraîné sur images satellite
- **Tâche**: Détecter terrains plats, dégradés, friches industrielles
- **Output**: Coordonnées GPS + probabilité (0-100%)

```python
# Exemple pseudo-code
def identify_potential_sites(region_bbox):
    satellite_images = fetch_sentinel2(region_bbox)
    predictions = cnn_model.predict(satellite_images)
    sites = filter_by_confidence(predictions, threshold=0.75)
    return sites
```

#### API IGN Cadastre
- **Endpoint**: `https://apicarto.ign.fr/api/cadastre/parcelle`
- **Usage**: Obtenir références cadastrales, surface exacte
- **Fréquence**: 1 appel par terrain identifié
- **Checklist**: ✓ Vérification surface disponible

#### API IGN DEM (Digital Elevation Model)
- **Endpoint**: `https://data.geopf.fr/wms-r`
- **Usage**: Topographie (pente, orientation, altitude)
- **Checklist**: ✓ Analyse topographique préliminaire

#### IA - Détection Ombrage
- **Modèle**: Object Detection (YOLO) sur satellite
- **Tâche**: Détecter arbres, bâtiments, reliefs
- **Output**: Carte ombrage, % surface impactée

### Checklist Automatisée (6 items)
1. ✓ Identification terrain via satellite (IA)
2. ✓ Vérification surface (API IGN)
3. ✓ Analyse topographique (API IGN DEM)
4. ⚠️ Vérification accessibilité (MANUEL)
5. ✓ Évaluation ombrage (IA)
6. ✓ Score qualité initial (IA)

**Taux automatisation**: ~83% (5/6 items)

---

## 2. Étape REGULATORY_ANALYSIS

### Objectif
Analyser les contraintes réglementaires et environnementales pour évaluer la faisabilité administrative.

### Technologies & APIs

#### API Géoportail de l'Urbanisme (GPU)
- **Endpoint**: `https://www.geoportail-urbanisme.gouv.fr/api`
- **Usage**: Télécharger PLU/POS de la commune
- **Format**: PDF, parfois XML
- **Checklist**: ✓ Extraction PLU automatique

#### IA - Analyse Documents PLU
- **Modèle**: GPT-4 Vision ou Claude 3.5 Sonnet
- **Tâche**: Lire PDF PLU, identifier zones compatibles (A, N, Nps)
- **Input**: PDF PLU + coordonnées terrain
- **Output**: Compatible / Non compatible + justification

```python
def analyze_plu(plu_pdf_path, site_coords):
    document_text = extract_text_from_pdf(plu_pdf_path)
    prompt = f"""
    Analyser le PLU suivant pour un projet solaire aux coordonnées {site_coords}.
    Déterminer si zone A (agricole) ou N (naturelle) autorise photovoltaïque.
    """
    response = openai.ChatCompletion.create(
        model="gpt-4-vision",
        messages=[{"role": "user", "content": prompt}]
    )
    return response['compatible'], response['justification']
```

#### API INPN (Inventaire National du Patrimoine Naturel)
- **Endpoint**: `https://inpn.mnhn.fr/api`
- **Usage**: Vérifier distance Natura 2000
- **Checklist**: ✓ Vérification Natura 2000

#### API Mérimée (Monuments Historiques)
- **Endpoint**: `https://data.culture.gouv.fr/api/merimee`
- **Usage**: Vérifier périmètre 500m monuments historiques
- **Checklist**: ✓ Monuments historiques 500m

#### API Géorisques
- **Endpoint**: `https://www.georisques.gouv.fr/api`
- **Usage**: Zones inondables, PPR naturels
- **Checklist**: ✓ Zones inondables PPRN

#### API RPG (Registre Parcellaire Graphique)
- **Endpoint**: `https://data.agriculture.gouv.fr/api`
- **Usage**: Classification parcelle agricole, CDPENAF
- **Checklist**: ✓ Classification parcelle agricole

#### IA - Jurisprudence
- **Modèle**: RAG (Retrieval-Augmented Generation)
- **Base**: Recueil décisions tribunaux administratifs
- **Tâche**: Trouver projets similaires dans région
- **Checklist**: ✓ Jurisprudence locale

### Checklist Automatisée (8 items)
**Taux automatisation**: 100% (8/8 items)

---

## 3. Étape TECHNICAL_STUDY

### Objectif
Dimensionner précisément le projet solaire et estimer la production.

### Technologies & APIs

#### API PVGIS (Photovoltaic Geographical Information System)
- **Endpoint**: `https://re.jrc.ec.europa.eu/api/PVcalc`
- **Usage**: Irradiation (GHI), production spécifique (kWh/kWc)
- **Checklist**: ✓ Données irradiation PVGIS

#### IA - Optimisation Production
- **Modèle**: Algorithmes génétiques + ML
- **Tâche**: Calcul P50, P75, P90 selon historique météo
- **Checklist**: ✓ Distribution mensuelle production

#### IA - Simulation 3D Ombrage
- **Modèle**: Ray tracing 3D
- **Input**: DEM + obstacles détectés
- **Output**: Pertes ombrage par heure/mois
- **Checklist**: ✓ Étude ombrage détaillée

#### API BRGM (Bureau de Recherches Géologiques et Minières)
- **Endpoint**: `https://infoterre.brgm.fr/api`
- **Usage**: Type de sol, risques géotechniques
- **Checklist**: ✓ Analyse géotechnique préliminaire

#### IA - Dimensionnement Optimal
- **Modèle**: Optimisation multi-objectifs
- **Variables**: Surface, MWc, technologie (fixe/tracker), GCR
- **Objectif**: Maximiser TRI
- **Checklist**: ✓ Dimensionnement optimal

#### IA - Génération Layout
- **Modèle**: Algorithme de placement optimisé
- **Output**: Plan CAD/DXF implantation panneaux
- **Checklist**: ✓ Plan implantation généré

### Checklist Automatisée (8 items)
**Taux automatisation**: 100% (8/8 items)

---

## 4. Étape NETWORK_STUDY

### Objectif
Évaluer le raccordement au réseau électrique (coût, délais, faisabilité).

### Technologies & APIs

#### API Enedis/RTE
- **Status**: Accès via partenariat
- **Usage**: Identifier poste source le plus proche
- **Checklist**: ✓ Identification poste source

#### API S3REnR (Schéma Régional de Raccordement)
- **Endpoint**: Via portails Enedis/RTE
- **Usage**: Capacité disponible au poste, file d'attente
- **Checklist**:
  - ✓ Consultation S3REnR
  - ✓ Analyse file d'attente

#### IA - Routing Optimal
- **Modèle**: Algorithme Dijkstra sur réseau routier
- **Tâche**: Calculer distance et trajet raccordement
- **Checklist**: ✓ Calcul distance raccordement

#### IA - Estimation Coûts
- **Modèle**: Regression ML (Random Forest)
- **Features**: Distance, puissance, tension, complexité
- **Training Data**: Historique PTF/ATR
- **Checklist**: ✓ Chiffrage coût raccordement

#### IA - Prédiction Délais
- **Modèle**: Time series forecasting
- **Features**: Zone géographique, période, file d'attente
- **Output**: Délais PTF, ATR, travaux
- **Checklist**: ✓ Estimation délais PTF/ATR

### Checklist Automatisée (7 items)
**Taux automatisation**: 100% (7/7 items)

---

## 5. Étape FONCIER

### Objectif
Identifier propriétaire(s) et négocier bail/acquisition foncière.

### Technologies & APIs

#### API Cadastre (Matrices)
- **Status**: Accès restreint (conventionné)
- **Usage**: Extraction nom propriétaire
- **Checklist**: ✓ Identification propriétaire(s)

#### API Infogreffe / Societe.com
- **Usage**: Enrichissement coordonnées (email, téléphone)
- **Checklist**: ✓ Recherche coordonnées propriétaire

#### IA - Génération Emails
- **Modèle**: GPT-4 fine-tuned
- **Tâche**: Rédiger email/courrier personnalisé
- **Template**: Adapter au profil propriétaire
- **Checklist**: ✓ Premier contact propriétaire

#### IA - Séquence Relances
- **Modèle**: Email automation + ML timing
- **Tâche**: Relances J+7, J+14, J+30
- **Checklist**: ✓ Relances propriétaire

#### IA - Market Analysis
- **Modèle**: Regression sur données marché
- **Tâche**: Estimer loyer €/ha/an selon région
- **Checklist**: ✓ Évaluation loyer marché

#### IA - Génération Contrats
- **Modèle**: GPT-4 + templates juridiques
- **Tâche**: Générer promesse de bail personnalisée
- **Checklist**: ✓ Préparation promesse de bail

### Checklist Automatisée (7 items)
1 item manuel (vérification servitudes)
**Taux automatisation**: ~86% (6/7 items)

---

## 6. Étape ECONOMIC_MODEL

### Objectif
Construire modèle financier complet (CAPEX, OPEX, revenus, TRI, VAN).

### Technologies & APIs

#### IA - Market Pricing
- **Source**: Web scraping fournisseurs (Krannich, Alma Solar, etc.)
- **Modèle**: Prédiction prix selon volume et techno
- **Checklist**:
  - ✓ Estimation CAPEX panneaux
  - ✓ Estimation CAPEX onduleurs

#### IA - Cost Estimation
- **Modèle**: ML basé sur projets historiques
- **Features**: Topographie, géotechnique, distance
- **Checklist**:
  - ✓ Estimation structures/VRD
  - ✓ OPEX optimisé calculé

#### Auto-Import
- **Source**: Étude réseau (étape 4)
- **Checklist**: ✓ Intégration coût raccordement

#### IA - Revenue Modeling
- **Modèle**: Scénarios CRE (appel d'offres) vs PPA marché
- **Input**: Prix électricité, inflation, durée contrat
- **Checklist**: ✓ Scénario revenus CRE/PPA

#### IA - Financial Model
- **Modèle**: DCF (Discounted Cash Flow) automatisé
- **Output**: TRI, VAN, Payback, LCOE
- **Checklist**: ✓ Calcul TRI/VAN/LCOE

#### IA - Sensitivity Analysis
- **Modèle**: Monte Carlo simulation
- **Variables**: CAPEX ±10%, production ±5%, prix ±15%
- **Checklist**: ✓ Analyse sensibilité

### Checklist Automatisée (8 items)
**Taux automatisation**: 100% (8/8 items)

---

## 7. Étape QA_REVIEW

### Objectif
Vérifier cohérence globale du dossier avant validation finale.

### Technologies & APIs

#### IA - QA Automatique
- **Modèle**: Rule-based + ML anomaly detection
- **Vérifications**:
  - Cohérence données entre sections
  - Ratios techniques (MWc/ha, PR, GCR)
  - Benchmarking économique (TRI, CAPEX/MWc)
  - Complétude documents

**Checklist**:
1. ✓ Vérification cohérence données (IA)
2. ✓ Validation ratios techniques (IA)
3. ✓ Revue économique (IA)
4. ✓ Complétude documents (IA)
5. ⚠️ Revue comité interne (MANUEL)
6. ⚠️ Décision GO/NO-GO (MANUEL)

**Taux automatisation**: 66% (4/6 items)

---

## Synthèse des Gains d'Efficacité

### Statistiques Globales

| Étape | Items Checklist | Items IA | Items Manuels | Taux Auto |
|-------|----------------|----------|---------------|-----------|
| SOURCING | 6 | 5 | 1 | 83% |
| REGULATORY | 8 | 8 | 0 | 100% |
| TECHNICAL | 8 | 8 | 0 | 100% |
| NETWORK | 7 | 7 | 0 | 100% |
| FONCIER | 7 | 6 | 1 | 86% |
| ECONOMIC | 8 | 8 | 0 | 100% |
| QA_REVIEW | 6 | 4 | 2 | 67% |
| **TOTAL** | **50** | **46** | **4** | **92%** |

### Impact sur le Time-to-Qualification

**Avant (100% manuel)**:
- Sourcing: 3-5 jours
- Regulatory: 7-10 jours
- Technical: 5-7 jours
- Network: 10-15 jours
- Foncier: 15-30 jours
- Economic: 3-5 jours
- QA: 2-3 jours
**TOTAL**: 45-75 jours (6-10 semaines)

**Après (92% automatisé)**:
- Sourcing: 4 heures
- Regulatory: 6 heures
- Technical: 8 heures
- Network: 4 heures
- Foncier: 5-10 jours (négociation propriétaire)
- Economic: 2 heures
- QA: 1 journée
**TOTAL**: 7-12 jours

**Gain**: ~80% de réduction du temps

---

## Sources de Données par Catégorie

### APIs Publiques Gratuites
1. **IGN** (Institut Géographique National)
   - Cadastre
   - DEM (topographie)
   - Ortho-photographies
2. **INPN** (Inventaire Patrimoine Naturel)
3. **Géorisques**
4. **PVGIS** (EU Joint Research Centre)
5. **Mérimée** (Monuments Historiques)

### APIs Payantes/Accès Restreint
1. **Google Earth Engine** (satellite)
2. **Enedis/RTE** (réseau électrique)
3. **Infogreffe** (données entreprises)
4. **Cadastre - Matrices** (propriétaires)

### Modèles IA Propriétaires
1. **CNN Détection Terrains** (entraîné sur 10k+ sites)
2. **PLU Analyzer** (GPT-4 Vision fine-tuned)
3. **Layout Generator** (algorithme propriétaire)
4. **Financial Model** (DCF automatisé)
5. **QA Engine** (rule-based + anomaly detection)

---

## Architecture Technique

### Backend Stack
```
Node.js + Express
├── Prisma ORM (SQLite/PostgreSQL)
├── Queue (Bull/Redis) pour tâches IA longues
├── API Gateway pour orchestration
└── Webhooks pour callbacks API externes
```

### AI Services
```
Python Microservices (FastAPI)
├── CNN Satellite Analysis
├── Document Analysis (GPT-4 Vision)
├── Layout Generator
├── Financial Modeling
└── QA Engine
```

### Déploiement
```
Docker Compose (dev)
Kubernetes (prod)
├── Node.js API (3 replicas)
├── Python AI Services (autoscaling)
├── PostgreSQL (primary + replica)
└── Redis (cache + queue)
```

---

## Roadmap Future

### Q2 2025
- [ ] Intégration API S3REnR temps réel
- [ ] Fine-tuning GPT-4 sur corpus PLU français
- [ ] Amélioration CNN détection (précision 90%+)

### Q3 2025
- [ ] Module prédiction acceptation permis (ML)
- [ ] Chatbot interne pour requêtes dossier
- [ ] Génération automatique documents permis

### Q4 2025
- [ ] Intégration données météo historiques 30 ans
- [ ] Simulation risques climatiques futurs
- [ ] API publique pour partenaires

---

## Conclusion

La **Lead Factory** transforme un processus manuel de 6-10 semaines en un workflow semi-automatisé de 7-12 jours grâce à:

1. **92% des tâches automatisées** par IA et APIs
2. **Checklist structurée** de 50 items pour assurer qualité
3. **Intégration 15+ sources de données** publiques et privées
4. **Modèles IA propriétaires** entraînés sur projets solaires

**ROI estimé**:
- Coût qualification lead: -70%
- Volume leads traités: x5
- Taux de réussite: +15% (meilleure sélection initiale)
