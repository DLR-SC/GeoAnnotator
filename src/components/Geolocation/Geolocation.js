/** Main location system with list of location */

import { useEffect } from 'react';
import { List } from '@mui/material';
import { useSession } from '../SessionProvider';
import { SaveButton } from '../customComponents';
import { GeolocationItems } from './GeolocationFunctions';

export default function Geolocation(props) {
    const
        { sessionData, setSessionData } = useSession(),
        {
            geolocations,   setGeolocations,
            handleSaveButtonClick,
        } = props;

    // When a new json-file is chosen, disable the save changes button
    useEffect(() => setSessionData({ ...sessionData, disableSaveGeolocationChangesButton: true }), [sessionData?.fileData])
    
    return (
        <>
            <List
                sx={{
                    height: '75vh',
                    overflowY: 'auto',
                    backgroundColor: 'white',
                    marginBottom: 2
                }}
                children={ 
                    // When no geolocation has been assigned, do not render the GeoLocationItems
                    geolocations ?  (
                        <GeolocationItems
                            geolocations={geolocations}
                            setGeolocations={setGeolocations}
                        />
                    ) : null
                }
            />
            <SaveButton
                variant='contained'
                disabled={sessionData?.disableSaveGeolocationChangesButton}
                onClick={handleSaveButtonClick}
                sx={{
                    width: '10rem'
                }}
            >
                Save changes
            </SaveButton>
        </>
    )
}