import { useSession } from '../../SessionProvider';
import React, { useEffect, useState } from 'react';
import { SaveButton } from '../../customComponents';
import { DialogContentArea, getOptionalCoordinates } from './DialogFunctions';
import { TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

/**
 * Dialog for editing location
 * @param {{
 *  geolocations: { name: string, position: float[] }[], 
 *  geolocation: { name: string, position: float[] }, 
 *  dialogProps: { open: Boolean, onClose: Function }
 * }}
 * @returns {React.JSX.Element}
 */
export default function EditDialog({ geolocations, geolocation, dialogProps }) {
  const
    { sessionData, setSessionData } = useSession(),
    [location, setLocation] = useState(0),
    [optionalCoordinates, setOptionalCoordinates] = useState();

    useEffect(
      () => {
        if(geolocation)
          getOptionalCoordinates(geolocation?.name)
            // Retrieve data
            .then(data => setOptionalCoordinates(data))
            // TODO: Exception handling when request fails
            .catch(error => null)
      },
      [geolocation]
    );

  return (
      <DialogContentArea
        title={'Edit location'}
        open={dialogProps.open}
        onClose={() => {
          setLocation(' ')
          dialogProps.onClose(false)
        }}
        children={
          <>
            {/* Placename */}
            <TextField
              disabled
              margin='normal'
              variant='outlined'
              label='Placename'
              defaultValue={geolocation?.name}
            />
            {/* Position */}
            {/* TODO: Communication with Backend - 5 possible Options */}
            <FormControl variant='filled' sx={{ m: 1, width: "100%" }}>
              <InputLabel id="editdialog-position-select-label">Position</InputLabel>
              <Select
                labelId="editdialog-position-select-label"
                id="editdialog-position-select"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              >
                <MenuItem key={geolocation?.name} value={0} children={`(${geolocation?.position[0]}, ${geolocation?.position[1]})`} />
                {
                  optionalCoordinates?.map(([lat, long], index) => (
                    <MenuItem key={geolocation?.name + `_${index}`} value={`[${lat},${long}]`} children={`(${lat}, ${long})`} />
                  ))
                }
              </Select>
            </FormControl>
            <SaveButton
              // TODO: Save the edited location
              onClick={() => {
                setSessionData({...sessionData, updatedGeolocations: geolocations.forEach((geo) => { if(geo.name === geolocation?.name) geo.position = JSON.parse(location)})})
                setLocation(0); // Reset the value
                dialogProps.onClose(false); 
                dialogProps.enableSaveChangesButton(); // FIXME: Only enable button when changes are really made
              }}
            >
              Save
            </SaveButton>
          </>
        }
      />
  )
}
