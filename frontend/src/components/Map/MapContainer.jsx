import React, { useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// User location marker with glowing radar ping
const createUserIcon = () => L.divIcon({
    className: 'custom-user-puck',
    html: `
        <div class="relative flex items-center justify-center w-8 h-8">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60"></span>
            <span class="relative inline-flex rounded-full h-5 w-5 bg-red-600 border-2 border-white shadow-xl items-center justify-center">
                <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
            </span>
        </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

// SOS Alert Marker
const createSosIcon = (type) => L.divIcon({
    className: 'custom-sos-marker',
    html: `
        <div class="relative flex flex-col items-center">
            <div class="relative flex items-center justify-center w-10 h-10">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-50"></span>
                <span class="relative inline-flex rounded-full h-8 w-8 bg-red-600 text-white font-bold text-[11px] items-center justify-center border-2 border-white shadow-2xl">
                    SOS
                </span>
            </div>
            <span class="mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-red-300 border border-red-500/40 whitespace-nowrap shadow-md">
                ${(type || 'EMERGENCY').toUpperCase()}
            </span>
        </div>
    `,
    iconSize: [40, 56],
    iconAnchor: [20, 28]
});

// Active Nearby Responders Pins (Medic, Security, Fire)
const createResponderPin = (label, color, distance) => L.divIcon({
    className: 'custom-resp-pin',
    html: `
        <div class="flex flex-col items-center pointer-events-none select-none">
            <span class="w-3.5 h-3.5 rounded-full bg-${color}-500 ring-4 ring-${color}-500/30 shadow-lg animate-pulse"></span>
            <span class="mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/90 text-${color}-300 border border-${color}-500/30 whitespace-nowrap shadow-md">
                ${label} ${distance}
            </span>
        </div>
    `,
    iconSize: [30, 40],
    iconAnchor: [15, 20]
});

function MapController({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center && center.lat && center.lng) {
            map.setView([center.lat, center.lng], 15);
        }
    }, [center, map]);
    return null;
}

function MapControls({ onRecenter }) {
    const map = useMap();
    return (
        <div className="absolute right-5 bottom-24 flex flex-col gap-2 z-[400]">
            <div className="flex flex-col rounded-xl overflow-hidden bg-slate-900/80 backdrop-blur-md shadow-xl border border-white/10">
                <button 
                    aria-label="Zoom In" 
                    onClick={() => map.zoomIn()}
                    className="w-9 h-9 flex items-center justify-center hover:bg-slate-700/60 text-slate-200 transition border-b border-white/10 cursor-pointer" 
                    type="button"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button 
                    aria-label="Zoom Out" 
                    onClick={() => map.zoomOut()}
                    className="w-9 h-9 flex items-center justify-center hover:bg-slate-700/60 text-slate-200 transition cursor-pointer" 
                    type="button"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M20 12H4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            <button 
                onClick={onRecenter}
                className="w-9 h-9 rounded-xl bg-slate-900/80 backdrop-blur-md flex items-center justify-center hover:bg-slate-700/60 text-slate-300 transition shadow-xl border border-white/10 cursor-pointer" 
                title="Recentering GPS" 
                type="button"
            >
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v3m0 14v3M2 12h3m14 0h3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </div>
    );
}

export function MapContainer({ userLocation, activeIncidents, responders, mode }) {
    const defaultCenter = [37.7749, -122.4194]; // Default San Francisco
    const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

    // Simulated nearby mock responders offset slightly from center
    const mockNearby = userLocation ? [
        { lat: userLocation.lat + 0.003, lng: userLocation.lng - 0.004, label: 'Medic', color: 'emerald', dist: '0.4km' },
        { lat: userLocation.lat - 0.004, lng: userLocation.lng + 0.005, label: 'Security', color: 'blue', dist: '0.7km' },
        { lat: userLocation.lat + 0.005, lng: userLocation.lng + 0.006, label: 'Fire Dept', color: 'amber', dist: '0.9km' },
    ] : [];

    return (
        <div id="map" className="w-full h-full relative z-0">
            <LeafletMap 
                center={center} 
                zoom={15} 
                style={{ height: '100%', width: '100%', background: '#0b1319' }}
                zoomControl={false}
            >
                {/* Google Maps Hybrid Satellite Layer */}
                <TileLayer
                    url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    attribution='&copy; Google Maps Satellite'
                    className="map-tiles"
                />

                {userLocation && (
                    <>
                        <MapController center={userLocation} />
                        
                        {/* 1000m / 1KM Perimeter Radius Ring */}
                        <Circle 
                            center={[userLocation.lat, userLocation.lng]} 
                            radius={1000} 
                            pathOptions={{ 
                                color: '#ef4444', 
                                dashArray: '6, 8',
                                fillColor: '#ef4444', 
                                fillOpacity: 0.04, 
                                weight: 1.5 
                            }} 
                        />

                        {/* Immediate user accuracy circle */}
                        <Circle 
                            center={[userLocation.lat, userLocation.lng]} 
                            radius={userLocation.accuracy || 120} 
                            pathOptions={{ 
                                color: '#4cd7f6', 
                                fillColor: '#4cd7f6', 
                                fillOpacity: 0.12, 
                                weight: 1 
                            }} 
                        />

                        {/* User Origin Marker */}
                        <Marker 
                            position={[userLocation.lat, userLocation.lng]} 
                            icon={createUserIcon()} 
                            zIndexOffset={1000} 
                        />
                    </>
                )}

                {/* Simulated Nearby Responder Markers */}
                {mockNearby.map((resp, i) => (
                    <Marker
                        key={`mock-${i}`}
                        position={[resp.lat, resp.lng]}
                        icon={createResponderPin(resp.label, resp.color, resp.dist)}
                    />
                ))}

                {/* Real Active SOS Incident Markers */}
                {activeIncidents.map(incident => (
                    <Marker 
                        key={incident.id || incident._id} 
                        position={[incident.lat, incident.lng]} 
                        icon={createSosIcon(incident.type)}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2 text-slate-900">
                                <strong className="text-red-600 uppercase text-xs block">
                                    {incident.type || 'EMERGENCY'}
                                </strong>
                                <span className="text-xs text-slate-600 block mt-1">
                                    {incident.description || 'Immediate assistance required'}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Real Connected Responders */}
                {responders && Object.values(responders).map(responder => (
                    <Marker 
                        key={responder.id} 
                        position={[responder.lat, responder.lng]} 
                        icon={createResponderPin(responder.name || 'Responder', 'emerald', 'Nearby')}
                    />
                ))}

                <MapControls onRecenter={() => {}} />
            </LeafletMap>
        </div>
    );
}
