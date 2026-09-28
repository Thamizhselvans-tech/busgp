export interface GeocodeResult {
  placeId: string;
  displayName: string;
  lat: number;
  lng: number;
}

export class GeocodingService {
  static async searchLocation(query: string): Promise<GeocodeResult[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      if (!response.ok) throw new Error('Geocoding search failed');

      const data = await response.json();
      return data.map((item: any) => ({
        placeId: item.place_id,
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));
    } catch (error) {
      console.warn('Nominatim geocoding error:', error);
      // Fallback geocoding dictionary for popular Tamil Nadu cities
      const fallbacks: Record<string, { lat: number; lng: number }> = {
        chennai: { lat: 13.0827, lng: 80.2707 },
        cuddalore: { lat: 11.748, lng: 79.7714 },
        pondicherry: { lat: 11.9416, lng: 79.8083 },
        guindy: { lat: 13.0102, lng: 80.2157 },
        't nagar': { lat: 13.0418, lng: 80.2341 },
        'anna nagar': { lat: 13.085, lng: 80.21 },
        trichy: { lat: 10.7905, lng: 78.7047 },
        coimbatore: { lat: 11.0168, lng: 76.9558 },
        madurai: { lat: 9.9252, lng: 78.1198 },
        salem: { lat: 11.6643, lng: 78.146 },
      };

      const key = query.toLowerCase().trim();
      const match = Object.keys(fallbacks).find((k) => key.includes(k));
      if (match) {
        return [
          {
            placeId: `fb-${match}`,
            displayName: `${match.toUpperCase()}, Tamil Nadu, India`,
            lat: fallbacks[match].lat,
            lng: fallbacks[match].lng,
          },
        ];
      }
      return [];
    }
  }
}
