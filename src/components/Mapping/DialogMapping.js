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
    FocusOnSelectedMarker
} from './MappingFunctions';

/**
 * Mapping of locations in a dialog
 * @param {Object} param 
 * @param {{ name: string, position: float[] }[]} param.geolocations
 * @param {Function} param.markerClickHandler
 */
export default function DialogMapping({ geolocations, markerDblClickHandler }) {
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
                geolocations?.map((marker, index) => {
                    if(
                        marker.name === undefined       ||  
                        marker.position === undefined   ||
                        marker.position.length === 0
                    ) return null;
                    return (
                        <Marker 
                            key={index} 
                            position={marker.position}
                            eventHandlers={{
                                'dblclick': markerDblClickHandler ? markerDblClickHandler : () => undefined
                            }}
                        >
                            <Popup>
                                {marker.name}
                                <br/>
                                {`(${marker.position})`}
                            </Popup>
                        </Marker>
                    )
                })
            }
            <FocusOnLatest markers={geolocations}/>
            <FocusOnSelectedMarker/>
        </MapContainer>
    );
}