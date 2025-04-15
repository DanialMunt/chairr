'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function BenchMap({ benches }) {
    const defaultCenter = [48.0196, 66.9237];

    const validBenches = benches.filter((b) => {
        const match = b.location?.match(/^([-+]?\d+\.\d+),\s*([-+]?\d+\.\d+)/);
        return match;
    });

    return (
        <MapContainer center={defaultCenter} zoom={5.5} style={{ height: '600px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {validBenches.map((bench, index) => {
                const match = bench.location.match(/^([-+]?\d+\.\d+),\s*([-+]?\d+\.\d+)/);
                const lat = parseFloat(match[1]);
                const lng = parseFloat(match[2]);

                return (
                    <Marker key={index} position={[lat, lng]}>
                        <Popup>
                            <div className="text-sm">
                                <strong>{bench.title}</strong><br />
                                <p className="text-xs line-clamp-2 mb-1">{bench.description}</p>
                                <a
                                    href={`/chair/${bench.id}`}
                                    className="text-blue-500 hover:underline text-xs"
                                >
                                    Перейти →
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
