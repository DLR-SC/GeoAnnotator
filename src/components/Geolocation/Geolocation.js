import { useState } from 'react';
import { List } from '@mui/material';
import { SaveButton } from '../customComponents';
import { GeoLocationItems } from './GeolocationFunctions';

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
                    geolocations ?  (
                        <GeoLocationItems
                            data={geolocations}
                            disableSaveChangesButton={setDisabledButton}
                        />
                    ) : null
                }
            />
            <SaveButton
                disabled={disabledButton}
                variant='contained'
                onClick={handleSaveButtonClick}
            >
                Save changes
            </SaveButton>
        </>
    )
}