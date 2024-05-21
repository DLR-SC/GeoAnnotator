import { List } from '@mui/material';
import { useState, useEffect } from 'react';
import { SaveButton } from '../customComponents';
import { GeolocationItems } from './GeolocationFunctions';
import { useSession } from '../SessionProvider';

export default function Geolocation({ geolocations, handleSaveButtonClick }) {
    const
        { sessionData } = useSession(),
        [disabledButton, setDisabledButton] = useState(true);

    // When a new json-file is chosen, disable the save changes button
    useEffect(() => {
        setDisabledButton(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionData?.fileData])
    
    // When a new location is added or deleted, enable save changes button
    useEffect(() => setDisabledButton(false), [sessionData?.updatedGeolocations])

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