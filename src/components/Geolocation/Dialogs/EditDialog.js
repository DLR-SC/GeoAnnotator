import Mapping from '../../Mapping/Mapping';
import { useSession } from '../../SessionProvider';
import React, { useEffect, useState } from 'react';
import { SaveButton } from '../../customComponents';
import { DialogContentArea, getOptionalCoordinates } from './DialogFunctions';
import { TextField, MenuItem, Select, FormControl, InputLabel, Box, Typography } from '@mui/material';

/**
 * Dialog for editing location
 * @param {Object} param
 * @param {{ name: string, position: float[] }} param.geolocation
 * @param {{ name: string, position: float[] }[]} param.geolocations
 * @param {{ open: Boolean, onClose: Function }} param.dialogProps
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
          setLocation(0) // Reset the value
          dialogProps.onClose(false)
        }}
      >
            {/* Placename */}
            <TextField
              disabled
              variant='filled'
              label='Placename'
              defaultValue={geolocation?.name}
              fullWidth
            />

            {/* Position */}
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
                  optionalCoordinates?.map((coordinates, index) => (
                    <MenuItem
                      key={coordinates.name + index} 
                      value={coordinates.position.toString() /* See below */} 
                      children={
                        coordinates.continent
                        +
                        (coordinates.country ? `, ${coordinates.country}` : '') 
                        +
                        (coordinates.state   ? `, ${coordinates.state  }` : '')
                        +
                        (coordinates.name   ? `, ${coordinates.name  }` : '')
                      }
                    />
                  ))
                }
              </Select>
            </FormControl>

            {/* Mapping */}
            <Box sx={{ width: '100%', height: '15rem', marginBottom: 4 }}>
              <Mapping 
                geolocations={optionalCoordinates.concat([geolocation])} // Add current geolocation, sothat all locations + the optional ones are displayed
                markerClickHandler={(event) => {
                  let latlng = event.latlng, position = [latlng['lat'], latlng['lng']];
                  setLocation(position.toString()); // Convert it into a string, sothat JS doesn't compare by reference, but by value (In this case, only with primitive values)
                }}
              />
              <Typography fontSize={10}>Double click the respective marker to change the corresponding position</Typography>
            </Box>

            {/* Save Button */}
            <SaveButton
              onClick={() => {
                // If changes were made, pass the updated geolocation to the high order component "MainArea" and enable the save changes button
                if(location) {
                  dialogProps.enableSaveChangesButton();
                  setSessionData({...sessionData, updatedGeolocations: geolocations.forEach((geo) => { if(geo.name === geolocation?.name) geo.position = JSON.parse(`[${location}]`) })});
                }
                setLocation(0); // Reset the value for future changes
                dialogProps.onClose(false); 
              }}
            >
              Save
            </SaveButton>

      </DialogContentArea>
  )
}
