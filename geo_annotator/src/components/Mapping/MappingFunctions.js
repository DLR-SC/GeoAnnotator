import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSession } from '../SessionProvider';

export const FocusOnLatest = ({ markers }) => {
    const map = useMap();
    
    useEffect(() => {
      if (markers && markers.length > 0) {
        const lastMarker = markers[markers.length - 1];  // Get the last marker
        map.setView(lastMarker.position, 8);  // Set view to the last marker
      }
    }, [markers, map]);  // Effect depends on markers changing
  
    return null;  // No direct rendering
};

export const FocusOnClickedMarker = () => {
    const 
      map = useMap(),
      session = useSession(), geolocation = session.sessionData?.geolocation;

    useEffect(() => {
        if (geolocation) {
            map.setView(geolocation.position, 10);  
        }
      }, [geolocation, map]);  // Effect depends on sessionData
};