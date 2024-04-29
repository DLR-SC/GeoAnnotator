import React from 'react';
import 'leaflet/dist/leaflet.css';
import { 
    Popup,
    Marker, 
    TileLayer,
    MapContainer,
} from 'react-leaflet';
import {
    FocusOnLatest,
    FocusOnClickedMarker
} from './MappingFunctions';

export default function Mapping({ geolocations }) {
    return (
        <MapContainer 
            center={[21.41, 39.81]} 
            zoom={13} 
            style={{ 
                height: "55vh",
                width: '100%' 
            }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {
                geolocations ? geolocations.map((marker, index) => (
                    <Marker key={index} position={marker.position}>
                        <Popup>{marker.name}</Popup>
                    </Marker>
                )) : null
            }
            { geolocations ? <FocusOnLatest markers={geolocations}/> : null }
            <FocusOnClickedMarker/>
        </MapContainer>
    );
}