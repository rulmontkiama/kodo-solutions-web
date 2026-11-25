export type PlanKey = 'starter' | 'pro' | 'max';
export type BillingCycle = 'monthly' | 'annual';

export type PricingTier = {
  id: PlanKey;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualMonthlyPrice: number;
  annualTotal: number;
  featured?: boolean;
  badge?: string;
  inheritsLabel?: string;
  highlights: string[];
  ctaLabel: string;
};

export type FeatureMatrixRow = {
  feature: string;
  essentiel: boolean;
  pro: boolean;
  omnicanal: boolean;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Essentiel',
    tagline: 'Tout pour encaisser vite, proprement et hors-ligne.',
    monthlyPrice: 29,
    annualMonthlyPrice: 23,
    annualTotal: 276,
    highlights: [
      'Caisse tactile (pavé numérique), clavier/souris & multi-paiements',
      'Arrondi belge 5c, remises, tickets en attente & retours',
      'Imprimante thermique 80mm, douchette 2D & tiroir RJ11',
      'Journal chaîné SHA-256, Clôture Z & mode hors-ligne SQLite',
      'Catalogue produits, tailles & catégories',
    ],
    ctaLabel: 'Choisir Essentiel',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Pilotage complet : stocks, marges, CRM et comptabilité.',
    monthlyPrice: 69,
    annualMonthlyPrice: 55,
    annualTotal: 660,
    featured: true,
    badge: 'Plus populaire',
    inheritsLabel: 'Tout Essentiel, plus :',
    highlights: [
      'Mouvements de stock justifiés, alertes & étiquettes code-barres PDF',
      'Prix d’achat HT, marges & valorisation du stock',
      'Multi-vendeurs, permissions Gérant/Vendeur & comptage espèces',
      'Fichier clients, fidélité & cartes cadeaux / avoirs',
      'Module Comptabilité (WinBooks CSV, Excel, PDF) & stats avancées',
    ],
    ctaLabel: 'Choisir Pro',
  },
  {
    id: 'max',
    name: 'Omnicanal',
    tagline: 'Expérience marque, 2ᵉ écran et synchronisation Shopify.',
    monthlyPrice: 149,
    annualMonthlyPrice: 119,
    annualTotal: 1428,
    inheritsLabel: 'Tout Pro, plus :',
    highlights: [
      'Personnalisation ticket (logo + QR réseaux sociaux / avis Google)',
      'Afficheur client 2ᵉ écran temps réel',
      'Synchronisation E-Commerce Shopify (stocks, import/export)',
    ],
    ctaLabel: 'Choisir Omnicanal',
  },
];

export const FEATURE_MATRIX: FeatureMatrixRow[] = [
  {
    feature: 'Caisse tactile (pavé numérique) + clavier/souris + multi-paiements',
    essentiel: true,
    pro: true,
    omnicanal: true,
  },
  {
    feature: 'Arrondi belge 5c, remises, tickets en attente, retours',
    essentiel: true,
    pro: true,
    omnicanal: true,
  },
  {
    feature: 'Imprimante thermique 80mm, douchette 2D, tiroir RJ11',
    essentiel: true,
    pro: true,
    omnicanal: true,
  },
  {
    feature: 'Journal chaîné SHA-256, Clôture Z, mode hors-ligne SQLite',
    essentiel: true,
    pro: true,
    omnicanal: true,
  },
  {
    feature: 'Catalogue produits, tailles & catégories',
    essentiel: true,
    pro: true,
    omnicanal: true,
  },
  {
    feature: 'Mouvements de stock justifiés, alertes & étiquettes code-barres PDF',
    essentiel: false,
    pro: true,
    omnicanal: true,
  },
  {
    feature: 'Prix d’achat HT, marges & valorisation du stock',
    essentiel: false,
    pro: true,
    omnicanal: true,
  },
  {
    feature: 'Multi-vendeurs, permissions Gérant/Vendeur & comptage espèces',
    essentiel: false,
    pro: true,
    omnicanal: true,
  },
  {
    feature: 'Fichier clients, fidélité & cartes cadeaux / avoirs',
    essentiel: false,
    pro: true,
    omnicanal: true,
  },
  {
    feature: 'Module Comptabilité (WinBooks CSV, Excel, PDF, archive migration)',
    essentiel: false,
    pro: true,
    omnicanal: true,
  },
  {
    feature: 'Statistiques avancées (graphiques multi-modes, filtres, comparatifs)',
    essentiel: false,
    pro: true,
    omnicanal: true,
  },
  {
    feature: 'Personnalisation ticket (logo + QR réseaux sociaux / avis Google)',
    essentiel: false,
    pro: false,
    omnicanal: true,
  },
  {
    feature: 'Afficheur client 2ᵉ écran temps réel',
    essentiel: false,
    pro: false,
    omnicanal: true,
  },
  {
    feature: 'Synchronisation E-Commerce Shopify (stocks, import/export)',
    essentiel: false,
    pro: false,
    omnicanal: true,
  },
];
