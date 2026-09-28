import { Bus } from '../types';
import { api } from './api';

export interface NearbyBusesResult {
  success: boolean;
  isLiveAvailable: boolean;
  isSimulated: boolean;
  message: string;
  buses: Bus[];
}

export interface IBusLocationService {
  getNearbyBuses(lat: number, lng: number, radiusKm: number): Promise<NearbyBusesResult>;
  getBusRoute(busId: string): Promise<Array<[number, number]>>;
  getBusLocation(busId: string): Promise<{ lat: number; lng: number; speed: number; heading: number }>;
}

export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

// Realistic Waypoints in Tamil Nadu
const REAL_BUS_ROUTES: Record<string, Array<[number, number]>> = {
  '21G': [
    [13.0228, 80.2231], // Saidapet
    [13.0102, 80.2157], // Guindy
    [13.0405, 80.2504], // Teynampet
    [13.0580, 80.2590], // Thousand Lights
    [13.0645, 80.2660], // Anna Salai LIC
    [13.0827, 80.2707], // Broadway
  ],
  '5E': [
    [12.9249, 80.1000], // Tambaram
    [12.9516, 80.1462], // Chromepet
    [12.9675, 80.1491], // Pallavaram
    [12.9863, 80.1687], // Airport
    [13.0102, 80.2157], // Guindy
    [13.0405, 80.2504], // Teynampet
  ],
  '102': [
    [13.0604, 80.2612], // Anna Salai
    [13.0418, 80.2341], // T. Nagar
    [13.0500, 80.2120], // Vadapalani
    [13.0694, 80.1948], // CMBT Koyambedu
    [13.0850, 80.2100], // Anna Nagar
  ],
  'TN-32-A': [
    [11.7480, 79.7714], // Cuddalore BS
    [11.8200, 79.7800], // Reddichavadi
    [11.8600, 79.7900], // Kirumampakkam
    [11.9350, 79.8150], // Pondicherry BS
  ],
};

// Progress tracker state for smooth simulation
const simulationProgress: Record<string, number> = {
  '21G': 0.1,
  '5E': 0.35,
  '102': 0.6,
  'TN-32-A': 0.2,
};

const getInterpolatedPosition = (waypoints: Array<[number, number]>, progress: number) => {
  if (waypoints.length === 0) return { lat: 13.0827, lng: 80.2707, heading: 90 };
  if (waypoints.length === 1) return { lat: waypoints[0][0], lng: waypoints[0][1], heading: 90 };

  const totalSegments = waypoints.length - 1;
  const scaledProgress = (progress % 1) * totalSegments;
  const index = Math.floor(scaledProgress);
  const segmentT = scaledProgress - index;

  const current = waypoints[index];
  const next = waypoints[Math.min(index + 1, waypoints.length - 1)];

  const lat = current[0] + (next[0] - current[0]) * segmentT;
  const lng = current[1] + (next[1] - current[1]) * segmentT;

  const dLat = next[0] - current[0];
  const dLng = next[1] - current[1];
  const heading = Math.round((Math.atan2(dLng, dLat) * 180) / Math.PI + 360) % 360;

  return { lat, lng, heading };
};

export class DemoBusLocationService implements IBusLocationService {
  async getNearbyBuses(userLat: number, userLng: number, radiusKm: number): Promise<NearbyBusesResult> {
    try {
      const response = await api.detectNearbyBuses(userLat, userLng);
      if (response.success && response.buses?.length > 0) {
        const updatedBuses = response.buses.map((bus: any) => {
          const key = bus.busNumber || '21G';
          const waypoints = REAL_BUS_ROUTES[key] || REAL_BUS_ROUTES['21G'];

          simulationProgress[key] = ((simulationProgress[key] || 0) + 0.03) % 1;
          const pos = getInterpolatedPosition(waypoints, simulationProgress[key]);

          const distanceKm = calculateHaversineDistance(userLat, userLng, pos.lat, pos.lng);
          const speed = bus.speed || 28 + Math.floor(Math.random() * 8);
          const etaMin = Math.max(2, Math.round((distanceKm / speed) * 60));

          return {
            ...bus,
            currentLat: pos.lat,
            currentLng: pos.lng,
            lat: pos.lat,
            lng: pos.lng,
            heading: pos.heading,
            speed,
            distance: `${distanceKm} km`,
            distanceKm,
            eta: `${etaMin} min`,
            etaMinutes: etaMin,
            status: (bus.status === 'stopped' ? 'stopped' : 'moving') as any,
            routeCoordinates: waypoints,
            lastUpdated: new Date().toISOString(),
            isSimulated: true,
          };
        });

        const filtered = updatedBuses.filter((b: any) => b.distanceKm <= radiusKm);

        return {
          success: true,
          isLiveAvailable: true,
          isSimulated: true,
          message: 'Demo live GPS simulation active.',
          buses: filtered.length > 0 ? filtered : updatedBuses,
        };
      }
    } catch (err) {
      console.warn('API unavailable, returning local demo simulation:', err);
    }

    return {
      success: true,
      isLiveAvailable: true,
      isSimulated: true,
      message: 'Demo live GPS simulation active.',
      buses: BusLocationService.getMockBuses(),
    };
  }

  async getBusRoute(busId: string): Promise<Array<[number, number]>> {
    return REAL_BUS_ROUTES['21G'];
  }

  async getBusLocation(busId: string) {
    return { lat: 13.0228, lng: 80.2231, speed: 28, heading: 90 };
  }
}

export class RealGPSLocationService implements IBusLocationService {
  async getNearbyBuses(lat: number, lng: number, radiusKm: number): Promise<NearbyBusesResult> {
    const response = await api.detectNearbyBuses(lat, lng);
    return {
      success: true,
      isLiveAvailable: true,
      isSimulated: false,
      message: 'Live GPS device telemetry stream active.',
      buses: response.buses || [],
    };
  }

  async getBusRoute(busId: string) {
    const res = await api.getBusById(busId);
    return res.data?.bus?.routeCoordinates || [];
  }

  async getBusLocation(busId: string) {
    const res = await api.getBusById(busId);
    const bus = res.data?.bus;
    return {
      lat: bus?.currentLat || 13.0827,
      lng: bus?.currentLng || 80.2707,
      speed: bus?.speed || 0,
      heading: bus?.heading || 0,
    };
  }
}

// Service Factory Wrapper
export class BusLocationService {
  private static demoService = new DemoBusLocationService();
  private static realService = new RealGPSLocationService();
  public static isRealGPSConnected = false;

  static getService(): IBusLocationService {
    return this.isRealGPSConnected ? this.realService : this.demoService;
  }

  static async detectNearbyBuses(lat?: number, lng?: number, radiusKm: number = 20) {
    const userLat = lat || 13.0827;
    const userLng = lng || 80.2707;
    return this.getService().getNearbyBuses(userLat, userLng, radiusKm);
  }

  static getMockBuses(): Bus[] {
    return [
      {
        _id: 'mock-1',
        busNumber: '21G',
        registrationNumber: 'TN01N9988',
        route: 'Saidapet → Broadway',
        source: 'Saidapet',
        destination: 'Broadway',
        driver: 'M. Arumugam',
        conductor: 'K. Balan',
        status: 'moving',
        currentLat: 13.0228,
        currentLng: 80.2231,
        lat: 13.0228,
        lng: 80.2231,
        speed: 28,
        heading: 90,
        distance: '1.2 km',
        eta: '5 min',
        routeCoordinates: REAL_BUS_ROUTES['21G'],
        isLive: true,
      },
      {
        _id: 'mock-2',
        busNumber: '5E',
        registrationNumber: 'TN45N5678',
        route: 'Tambaram → Teynampet',
        source: 'Tambaram',
        destination: 'Teynampet',
        driver: 'S. Rajendran',
        conductor: 'P. Palani',
        status: 'moving',
        currentLat: 12.9516,
        currentLng: 80.1462,
        lat: 12.9516,
        lng: 80.1462,
        speed: 32,
        heading: 45,
        distance: '2.4 km',
        eta: '10 min',
        routeCoordinates: REAL_BUS_ROUTES['5E'],
        isLive: true,
      },
      {
        _id: 'mock-3',
        busNumber: '102',
        registrationNumber: 'TN32N1234',
        route: 'Anna Salai → CMBT',
        source: 'Anna Salai',
        destination: 'CMBT Koyambedu',
        driver: 'V. Elangovan',
        conductor: 'G. Natarajan',
        status: 'moving',
        currentLat: 13.0604,
        currentLng: 80.2612,
        lat: 13.0604,
        lng: 80.2612,
        speed: 22,
        heading: 270,
        distance: '3.1 km',
        eta: '14 min',
        routeCoordinates: REAL_BUS_ROUTES['102'],
        isLive: true,
      },
    ];
  }
}
