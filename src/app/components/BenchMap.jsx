'use client';

import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { API_URL } from '../../../config';

// Fix leaflet icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function BenchMap({ benches }) {
    const defaultCenter = [48.0196, 66.9237];

    const validBenches = benches.filter(
        (b) => !isNaN(parseFloat(b.latitude)) && !isNaN(parseFloat(b.longitude))
    );

    return (
        <MapContainer center={defaultCenter} zoom={5.5} style={{ height: '600px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {validBenches.map((bench) => {
                const lat = parseFloat(bench.latitude);
                const lng = parseFloat(bench.longitude);

                return (
                    <Marker
                        key={bench.id}
                        position={[lat, lng]}
                        eventHandlers={{
                            click: () => {
                                window.location.href = `/chair/${bench.id}`;
                            },
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                            <div className="w-[240px] bg-white rounded shadow-md p-2">
                                {bench.thumbnail && (
                                    <img
                                        src={
                                            bench.thumbnail.startsWith('http')
                                                ? bench.thumbnail
                                                : `${API_URL}${bench.thumbnail}`
                                        }
                                        alt={bench.title}
                                        className="w-full h-28 object-cover rounded mb-2"
                                    />
                                )}
                                <h3 className="font-semibold text-sm text-black">{bench.title}</h3>
                                <p className="text-xs text-gray-700">{bench.description}</p>
                            </div>
                        </Tooltip>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
