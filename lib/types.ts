export type Unit = { id: string; label: string; bedrooms: number; bathrooms: number; sqft: number; rent: number; available: boolean; image?: string };
export type Property = {
  id: string; name: string; address: string; city: string; state: string; zip: string;
  status: 'For Rent' | 'For Sale' | 'Coming Soon'; type: string; description: string;
  bedroomsSummary: string; bathsSummary: string; sqftApprox: string;
  heroImg: string; gallery: string[]; amenities: string[]; rentFrom: number; rentTo: number; units: Unit[];
  coordinates: { lat: number; lng: number };
};
