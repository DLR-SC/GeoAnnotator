import { List } from '@mui/material';
import { SaveButton } from '../customComponents';
import { GeoLocationItems } from './GeolocationFunctions';
import { useState } from 'react';

export default function Geolocation({ geolocations }) {
    const [disabledButton, setDisabledButton] = useState(true);

    return (
        <>
            <List
                sx={{
                    height: '72.5vh',
                    overflowY: 'auto',
                    backgroundColor: 'white',
                    marginBottom: 2
                }}
                children={
                    geolocations ?  (
                        <GeoLocationItems
                            data={geolocations}
                            disabledSaveChangesButton={setDisabledButton}
                        />
                    ) : null
                }
            />
            <SaveButton
                // TODO: Enable button when changes were made and save the edited annotations in a new file with additional ending '.edt' when clicked
                disabled={disabledButton}
                variant='contained'
                onClick={
                    null
                }
            >
                Save changes
            </SaveButton>
        </>
    )
}