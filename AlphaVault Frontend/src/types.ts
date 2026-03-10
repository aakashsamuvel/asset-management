export interface SettingsResponse {
  id: number;
  siteName: string;
  logoUrl: string;
  contactEmail: string;
  recycleBinEnabled: boolean;
  recycleBinAutoPurgeDays: number;
}

export interface TrashedAsset {
  id: number;
  name: string;
  type: string;
  deletedAt: string;
  deletedBy: string;
}