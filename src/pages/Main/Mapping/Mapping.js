import React from 'react';
import 'leaflet/dist/leaflet.css';
import { 
    Popup,
    Marker, 
    TileLayer,
    MapContainer
} from 'react-leaflet';
import {
    FocusOnLatest,
    FocusOnClickedMarker
} from './MappingFunctions';

/**
 * Mapping of locations
 * @param {Object} param 
 * @param {{ name: string, position: float[] }[]} param.geolocations
 * @param {Function} param.clickHandler
 */
export default function Mapping({ geolocations }) {
    return (
        <MapContainer 
            zoom={1}
            center={[21.41, 39.81]} // Mekka 
            style={{
                height: '100%'
            }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {
                geolocations ? geolocations.map((marker, index) => {
                    if(
                        marker.position === undefined   ||
                        marker.position.length === 0    ||
                        marker.position[0] === undefined||marker.position[1] === undefined   
                    ) return null;

                    return (
                        <Marker 
                            key={index} 
                            position={marker.position}
                        >
                            <Popup>
                                {marker.name}
                                <br/>
                                {`(${marker.position})`}
                            </Popup>
                        </Marker>
                    )
                }) : null
            }
            <FocusOnLatest markers={geolocations}/>
            <FocusOnClickedMarker/>
        </MapContainer>
    );
}