# GUZE — Import Marketplace Platform
## Static HTML Templates

UK's first subscription-powered shared container supply chain for Nigerian imports.

---

## Directory Structure

```
ImportMarketplace/
├── templates/
│   ├── shared-styles.css              ← Global design system (all pages share this)
│   │
│   ├── external/                      ← Public-facing pages (no login required)
│   │   ├── index.html                 ← Landing Page
│   │   └── account.html               ← Login / Account Creation Page
│   │
│   └── internal/                      ← Authenticated pages (post-login)
│       ├── dashboard.html             ← Retailer Dashboard
│       ├── catalogue.html             ← Product Catalogue
│       ├── calculator.html            ← Landed Cost Calculator
│       ├── aggregation.html           ← Aggregation Batch Visualization
│       ├── supplier-dashboard.html    ← Supplier Portal / Dashboard
│       └── admin-compliance.html      ← Admin Compliance Review
```

---

## Pages Summary

### External (Public)

| Page | File | Description |
|---|---|---|
| Landing Page | `external/index.html` | Hero, how-it-works, benefits, compliance info (FSA/OPSS/DCTS modals) |
| Account / Login | `external/account.html` | Toggle between Sign In and Create Account with account type selection |

### Internal (Authenticated)

| Page | File | User Role |
|---|---|---|
| Retailer Dashboard | `internal/dashboard.html` | UK Retailer |
| Product Catalogue | `internal/catalogue.html` | UK Retailer |
| Landed Cost Calculator | `internal/calculator.html` | UK Retailer |
| Container Tracker | `internal/aggregation.html` | UK Retailer |
| Supplier Portal | `internal/supplier-dashboard.html` | Nigerian Supplier |
| Admin Compliance Review | `internal/admin-compliance.html` | Platform Admin |

---

## Technology Stack (Production)

- **Frontend**: Vue.js 3 (Composition API)
- **Backend**: ASP.NET Core 8 Web API
- **Database**: MySQL / MariaDB
- **Auth**: JWT + ASP.NET Identity
- **Hosting**: Azure App Service / Docker

---

## Design System

All pages reference `shared-styles.css` which includes:
- CSS custom properties (design tokens)
- Typography: Fraunces (display) + DM Sans (body) + JetBrains Mono (code/data)
- Color palette: Deep green, gold, cream
- Reusable components: sidebar, cards, tables, badges, tabs, modals, forms

---

## Compliance Framework

| Standard | Scope | Description |
|---|---|---|
| **FSA** | Food & beverages | Food Standards Agency — UK food safety |
| **OPSS** | All non-food consumer goods | Office for Product Safety & Standards |
| **DCTS** | Tariffs | Developing Countries Trading Scheme — 0% duty from Nigeria |
| **UKRP** | Non-food products | UK Responsible Person appointment required |

---

## Key Features

- **Shared container model** — importers split a 40ft container (full at 85%)
- **Live container visualisation** — horizontal bar + pie chart with colour-coded shipper shares
- **Landed cost calculator** — breakdown: product cost, inland logistics, export docs, ocean freight, insurance, CIF, import VAT, port handling, UK delivery
- **Compliance document workflow** — suppliers submit → admin reviews → approve/reject/request changes
- **Savings dashboard** — YTD savings, cost reduction %, annualised projections

---

*Generated for GUZE Ltd · © 2025*
