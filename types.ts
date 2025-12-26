
export interface BeekeeperInput {
  name: string;
  farmName: string;
  location: string;
  painPointMarket: string;
  painPointTraceability: string;
  painPointMoney: string;
  socialUrl: string; // Ahora es obligatorio
  logo?: string;
}

export interface GeneratedWebProfile {
  heroTitle: string;
  tagline: string;
  aboutUsText: string;
  valueProposition: string[];
  strategicAnalysis: string;
  farcasterHandle: string; // Nueva propiedad
}

export enum AppState {
  LANDING,
  FORM,
  LOADING,
  RESULT
}
