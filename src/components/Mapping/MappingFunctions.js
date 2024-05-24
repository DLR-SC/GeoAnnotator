import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSession } from '../SessionProvider';

/**
 * Focus on latest added marker
 * @param {Object} param 
 * @param {{name: string, position: [float, float]}[]} param.markers 
 * @returns 
 */
export const FocusOnLatest = ({ markers }) => {
  const map = useMap();
  
  useEffect(() => {
    if (markers && markers.length > 0) {
      const lastMarker = markers[markers.length - 1];  // Get the last marker
      console.log(lastMarker)
      if(lastMarker.position.length) map.setView(lastMarker.position, 8);  // Set view to the last marker
    }
  }, [markers, map]);  // Effect depends on markers changing

  return null;  // No direct rendering
};

/**
 * Focus on clicked Place-Icon in location list
 */
export const FocusOnClickedMarker = () => {
  const 
    map = useMap(),
    session = useSession(), geolocation = session.sessionData?.geolocation;

  useEffect(() => {
      if (geolocation) {
          map.setView(geolocation.position, 10);  
      }
    }, [geolocation, map]);

  return null;
};

/**
 * Focus on selected marker in edit dialog
 */
export const FocusOnSelectedMarker = () => {
  const 
    map = useMap(),
    session = useSession(), selectedOptionalCoordinate = session.sessionData?.selectedOptionalCoordinate;

  useEffect(() => {
      if (selectedOptionalCoordinate) {
          map.setView(selectedOptionalCoordinate, 10);
      }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedOptionalCoordinate, map]);

  return null;
}