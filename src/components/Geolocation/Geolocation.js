import { useState } from 'react';
import { List } from '@mui/material';
import { SaveButton } from '../customComponents';
import { GeolocationItems } from './GeolocationFunctions';

export default function Geolocation({ geolocations, handleSaveButtonClick }) {
    const [disabledButton, setDisabledButton] = useState(true);

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
                            disableSaveChangesButton={setDisabledButton}
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