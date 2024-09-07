/** Main location system with list of location */

import { List } from '@mui/material';
import { useState, useEffect } from 'react';
import { SaveButton } from '../customComponents';
import { GeolocationItems } from './GeolocationFunctions';
import { useSession } from '../SessionProvider';

export default function Geolocation({ geolocations, handleSaveButtonClick }) {
    const
        { sessionData, setSessionData } = useSession(),
        [disabledButton, setDisabledButton] = useState(true);

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
                            data={geolocations}
                        />
                    ) : null
                }
            />
            <SaveButton
                variant='contained'
                disabled={sessionData?.disableSaveGeolocationChangesButton}
                onClick={() => handleSaveButtonClick()}
            >
                Save changes
            </SaveButton>
        </>
    )
}