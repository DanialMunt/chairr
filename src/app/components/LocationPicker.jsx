'use client';

import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Города Казахстана
const cities = {
    'Центр Казахстана': [48.0196, 66.9237],
    Алматы: [43.2389, 76.8897],
    Астана: [51.1605, 71.4704],
    Шымкент: [42.3417, 69.5901],
    Актобе: [50.2839, 57.1660],
};

function FlyToCity({ coordinates }) {
    const map = useMap();

    useEffect(() => {
        if (coordinates) {
            map.flyTo(coordinates, 12);
        }
    }, [coordinates, map]);

    return null;
}

function LocationMarker({ onConfirm }) {
    const [position, setPosition] = useState(null);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setLoading(true);
            setAddress('');

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );
                const data = await response.json();

                if (data && data.address) {
                    const road = data.address.road || data.address.pedestrian || '';
                    const city = data.address.city || data.address.town || data.address.village || '';
                    const fullAddress = `${road}, ${city}`.trim();

                    setAddress(fullAddress);
                    setPosition({ lat, lng, road, city });
                } else {
                    setAddress('Адрес не найден');
                }
            } catch (error) {
                setAddress('Ошибка при получении адреса');
            } finally {
                setLoading(false);
            }
        },
    });

    return position ? (
        <Marker position={[position.lat, position.lng]}>
            <Popup>
                <div className="text-sm max-w-[200px]">
                    <strong>Координаты:</strong><br />
                    {position.lat.toFixed(6)}, {position.lng.toFixed(6)}<br /><br />
                    <strong>Адрес:</strong><br />
                    {loading ? 'Загрузка адреса...' : address}<br />
                    <button
                        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        onClick={() =>
                            onConfirm({
                                coordinates: `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`,
                                address: address,
                                road: position.road,
                                city: position.city,
                            })
                        }
                    >
                        Подтвердить
                    </button>
                </div>
            </Popup>
        </Marker>
    ) : null;
}

export default function LocationPicker({ onLocationSelect }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);

    const handleSelect = ({ coordinates, address, road, city }) => {
        onLocationSelect({
            location: coordinates,
            address,
            road,
            city,
        });
        setModalOpen(false);
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Выбрать локацию
            </button>

            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                contentLabel="Выбор локации"
                style={{
                    overlay: { backgroundColor: 'rgba(0,0,0,0.6)' },
                    content: {
                        height: '85%',
                        width: '85%',
                        margin: 'auto',
                        padding: 0,
                        borderRadius: '12px',
                        overflow: 'hidden',
                    },
                }}
            >
                {/* Селект города */}
                <div className="p-4 bg-gray-100 border-b border-gray-300">
                    <label className="mr-2 font-semibold">Город:</label>
                    <select
                        className="px-2 py-1 rounded border"
                        onChange={(e) => setSelectedCity(cities[e.target.value])}
                        defaultValue=""
                    >
                        <option disabled value="">Выберите город</option>
                        {Object.keys(cities).map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                {/* Карта */}
                <MapContainer center={cities['Центр Казахстана']} zoom={6} style={{ height: '90%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {selectedCity && <FlyToCity coordinates={selectedCity} />}
                    <LocationMarker onConfirm={handleSelect} />
                </MapContainer>
            </Modal>
        </div>
    );
}
