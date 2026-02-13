
export interface BeekeeperInput {
  name: string;
  farmName: string;
  location: string;
  painPointMarket: string;
  painPointTraceability: string;
  painPointMoney: string;
  socialUrl: string; // Ahora es obligatorio
  logo?: string;
  wantsToSellOnline?: boolean;
  instagramPhotos?: string[];
}

export interface GeneratedWebProfile {
  heroTitle: string;
  tagline: string;
  aboutUsText: string;
  valueProposition: string[];
  strategicAnalysis: string;
  farcasterHandle: string;
  heroImage?: string;
  galleryImages?: string[];
  primaryColor?: string; // HEX
  secondaryColor?: string; // HEX
  styleVibe?: 'rustic' | 'minimalist' | 'luxury' | 'modern';
}

export enum AppState {
  LANDING,
  FORM,
  LOADING,
  RESULT
}
