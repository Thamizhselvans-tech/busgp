import React, { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Bus } from '../../types';
import { Navigation, RefreshCw, Maximize2, ZoomIn, ZoomOut, Compass } from 'lucide-react';

// Fix default Leaflet marker icon asset paths in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom DivIcons for Geographic Accuracy
const createCustomIcon = (type: 'user' | 'moving' | 'selected' | 'stopped' | 'offline', label: string) => {
  if (type === 'user') {
    return L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-10 h-10 rounded-full bg-rose-500/30 animate-ping"></div>
          <div class="w-6 h-6 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black">
            📍
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  }

  let bgClass = 'bg-blue-600 text-white border-white shadow-blue-500/30';
  if (type === 'selected') bgClass = 'bg-amber-500 text-white border-white ring-4 ring-amber-300 shadow-amber-500/50 scale-110 z-50';
  else if (type === 'stopped') bgClass = 'bg-emerald-600 text-white border-white shadow-emerald-500/30';
  else if (type === 'offline') bgClass = 'bg-slate-600 text-white border-white';

  return L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div class="flex flex-col items-center group cursor-pointer transition-transform duration-300">
        <div class="w-9 h-9 rounded-full ${bgClass} border-2 shadow-xl flex items-center justify-center font-black text-sm">
          🚌
        </div>
        <span class="bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-md mt-1 whitespace-nowrap border border-slate-700">
          ${label}
        </span>
      </div>
    `,
    iconSize: [36, 50],
    iconAnchor: [18, 25],
    popupAnchor: [0, -22],
  });
};

// Map Controller for Smooth flyTo Animations and Bounds Fitting
const MapController: React.FC<{
  center: [number, number];
  zoom?: number;
  selectedBus?: Bus | null;
  fitBoundsPositions?: Array<[number, number]>;
  flyToTrigger?: number;
}> = ({ center, zoom, selectedBus, fitBoundsPositions, flyToTrigger }) => {
  const map = useMap();

  // FlyTo selected bus location with high street-level zoom (Zoom 16)
  useEffect(() => {
    if (selectedBus && (selectedBus.currentLat || selectedBus.lat)) {
      const lat = selectedBus.currentLat || selectedBus.lat || 13.0827;
      const lng = selectedBus.currentLng || selectedBus.lng || 80.2707;
      map.flyTo([lat, lng], 16, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [selectedBus, map]);

  // FlyTo targeted location / User location
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 14, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [center, flyToTrigger, map]);

  // Fit bounds when requested
  useEffect(() => {
    if (fitBoundsPositions && fitBoundsPositions.length > 0) {
      const bounds = L.latLngBounds(fitBoundsPositions);
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
    }
  }, [fitBoundsPositions, map]);

  return null;
};

interface LeafletMapProps {
  userLocation: { lat: number; lng: number } | null;
  buses: Bus[];
  selectedBus: Bus | null;
  onSelectBus: (bus: Bus) => void;
  onReportComplaint: (bus: Bus) => void;
  onRefresh: () => void;
  searchRadiusKm?: number;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  userLocation,
  buses,
  selectedBus,
  onSelectBus,
  onReportComplaint,
  onRefresh,
  searchRadiusKm = 10,
}) => {
  const defaultCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [13.0827, 80.2707];

  const [mapCenter, setMapCenter] = React.useState<[number, number]>(defaultCenter);
  const [flyToTrigger, setFlyToTrigger] = React.useState(0);
  const [fitPositions, setFitPositions] = React.useState<Array<[number, number]>>([]);

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  const handleLocateMe = () => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setFlyToTrigger((prev) => prev + 1);
    }
  };

  const handleFitAllBuses = () => {
    const coords: Array<[number, number]> = [];
    if (userLocation) coords.push([userLocation.lat, userLocation.lng]);
    buses.forEach((b) => {
      const lat = b.currentLat || b.lat;
      const lng = b.currentLng || b.lng;
      if (lat && lng) {
        coords.push([lat, lng]);
      }
    });

    if (coords.length > 0) {
      setFitPositions(coords);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[450px] lg:min-h-[620px] rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-slate-100">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        maxZoom={19}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        style={{ height: '100%', minHeight: '450px' }}
      >
        {/* High Precision OpenStreetMap Vector Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          subdomains={['a', 'b', 'c']}
        />

        <MapController
          center={mapCenter}
          zoom={14}
          selectedBus={selectedBus}
          fitBoundsPositions={fitPositions.length > 0 ? fitPositions : undefined}
          flyToTrigger={flyToTrigger}
        />

        {/* User Location Marker & Search Circle */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createCustomIcon('user', 'You')}
            >
              <Popup>
                <div className="p-1.5 text-xs font-sans">
                  <h4 className="font-extrabold text-rose-700">🔴 Your Location</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={searchRadiusKm * 1000}
              pathOptions={{
                color: '#2563eb',
                fillColor: '#3b82f6',
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '5, 5',
              }}
            />
          </>
        )}

        {/* Marker Clustering for Clean High-Density Zoom Scaling */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={40}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
        >
          {buses.map((bus) => {
            const isSelected = selectedBus?._id === bus._id;
            const lat = bus.currentLat || bus.lat || 13.0827;
            const lng = bus.currentLng || bus.lng || 80.2707;
            const markerType = isSelected
              ? 'selected'
              : bus.status === 'stopped'
              ? 'stopped'
              : bus.status === 'offline'
              ? 'offline'
              : 'moving';

            return (
              <Marker
                key={bus._id}
                position={[lat, lng]}
                icon={createCustomIcon(markerType, bus.busNumber)}
                eventHandlers={{
                  click: () => {
                    onSelectBus(bus);
                  },
                }}
              >
                <Popup>
                  <div className="p-2 space-y-2.5 min-w-[220px] font-sans text-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-black text-base text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                        {bus.busNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                          isSelected
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : bus.status === 'stopped'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}
                      >
                        🟢 {bus.status || 'Moving'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-extrabold text-slate-800">{bus.route}</p>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 pt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Speed</span>
                          <span className="font-bold text-slate-900">{bus.speed || 28} km/h</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Distance</span>
                          <span className="font-bold text-slate-900">{bus.distance || '1.2 km'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">ETA</span>
                          <span className="font-bold text-blue-700">{bus.eta || '6 min'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Updated</span>
                          <span className="font-medium text-slate-600">5 sec ago</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => onSelectBus(bus)}
                        className="flex-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Select Bus
                      </button>
                      <button
                        onClick={() => onReportComplaint(bus)}
                        className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Report Issue
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>

        {/* Selected Bus Route Polyline */}
        {selectedBus?.routeCoordinates && selectedBus.routeCoordinates.length > 0 && (
          <Polyline
            positions={selectedBus.routeCoordinates}
            pathOptions={{
              color: '#f59e0b',
              weight: 5,
              opacity: 0.9,
              dashArray: '6, 10',
            }}
          />
        )}
      </MapContainer>

      {/* MAP LEGEND OVERLAY (Top Right) */}
      <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl text-[11px] font-bold text-slate-800 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
          <span>🔴 Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span>🔵 Moving Bus</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>🟢 Bus Stop / Stopped</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>🟠 Selected Bus</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
          <span>⚫ Offline Bus</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
          <span className="w-4 h-1 bg-amber-500 rounded"></span>
          <span>━ Bus Route</span>
        </div>
      </div>

      {/* MAP CONTROLS OVERLAY (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleLocateMe}
          className="p-3 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 hover:bg-slate-50 transition flex items-center gap-2 text-xs font-bold"
          title="Center map on your location"
        >
          <Navigation className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Locate Me</span>
        </button>

        <button
          onClick={handleFitAllBuses}
          className="p-3 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 hover:bg-slate-50 transition flex items-center gap-2 text-xs font-bold"
          title="Fit bounds to all active buses"
        >
          <Maximize2 className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Fit All Buses</span>
        </button>

        <button
          onClick={onRefresh}
          className="p-3 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 hover:bg-slate-50 transition flex items-center gap-2 text-xs font-bold"
          title="Refresh telemetry"
        >
          <RefreshCw className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </div>
  );
};
