import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Фикс для иконок Leaflet (иначе не отображаются в Next.js)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}

export default function MapView() {
    const [benches, setBenches] = useState([]);

    const handleMapClick = (latlng) => {
        const label = prompt('Введите название скамейки:');
        if (label) {
            setBenches([...benches, { position: latlng, label }]);
        }
    };

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <ClickHandler onMapClick={handleMapClick} />
            {benches.map((bench, index) => (
                <Marker key={index} position={bench.position}>
                    <Popup>{bench.label}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
