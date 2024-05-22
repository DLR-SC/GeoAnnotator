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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setSessionData({ ...sessionData, disableSaveChangesButton: true }), [sessionData?.fileData])
    
    // When a new location is added, deleted or edited, enable save changes button
    useEffect(() => setDisabledButton(sessionData?.disableSaveChangesButton), [sessionData?.disableSaveChangesButton])

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
                disabled={disabledButton}
                onClick={handleSaveButtonClick}
            >
                Save changes
            </SaveButton>
        </>
    )
}