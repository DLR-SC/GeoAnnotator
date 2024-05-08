import { useSession } from '../../SessionProvider';
import React, { useEffect, useState } from 'react';
import { SaveButton } from '../../customComponents';
import DialogMapping from '../../Mapping/DialogMapping';
import { DialogContentArea, getOptionalCoordinates } from './DialogFunctions';
import { TextField, MenuItem, Select, FormControl, InputLabel, Box, Typography, Grid, ListItem } from '@mui/material';

/**
 * Dialog for editing location
 * @param {Object} param
 * @param {{ name: string, position: float[] }} param.geolocation
 * @param {{ name: string, position: float[] }[]} param.geolocations
 * @param {{ open: Boolean, onClose: Function }} param.dialogProps
 * @returns {React.JSX.Element}
 */
export default function LocationDialog({ geolocations, geolocation, dialogProps }) {
  const
    { sessionData, setSessionData } = useSession(),
    [location, setLocation] = useState(0),
    [disableButton, setDisableButton] = useState(true),
    [optionalCoordinates, setOptionalCoordinates] = useState(),
    resetProps = () => {
      setLocation(0)              // Reset the location value
      setDisableButton(true)      // Reset disabled status of save button
      setOptionalCoordinates(undefined) // Reset the optional values
      setSessionData({...sessionData, selectedOptionPosition: undefined }); // Reset selected option position value
      dialogProps.onClose(false)  // Close edit dialog
    };

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
        title={dialogProps.title}
        open={dialogProps.open}
        onClose={resetProps}
      >
        <ListItem disablePadding>
          <Grid
            container
            spacing={1}
            columns={12}
            wrap='nowrap'
          >

            {/* Placename */}
            <Grid item xs={4}>
              <TextField
                disabled
                fullWidth
                variant='filled'
                label='Placename'
                defaultValue={geolocation?.name}
              />
            </Grid>

            {/* Position */}
            <Grid item xs={8}>
              <FormControl variant='filled' sx={{ width: "100%" }}>
                <InputLabel id="locationdialog-position-select-label">Position</InputLabel>
                <Select
                  labelId="locationdialog-position-select-label"
                  id="locationdialog-position-select"
                  value={location}
                  onChange={(event) => {
                    event.preventDefault(); // Prevent the default rerendering of the dialog
                    let value = event.target?.value, isDefault = value === 0;
                    if(value) {
                      setLocation(value);
                      // When the value changes, enable or disable the corresponding button, depending whether it is the same value as before (default value)
                      setDisableButton(isDefault);
                      // Set the focus on to the selected marker position
                      setSessionData({...sessionData, selectedOptionPosition: isDefault ? geolocation?.position : JSON.parse(`[${value}]`) });
                    }
                  }}
                >
                  {/* Default value */} <MenuItem key={geolocation?.name} value={0} children={geolocation?.position.length ? `(${geolocation?.position[0]}, ${geolocation?.position[1]})` : 'None'} />
                  {
                    // Optional values
                    optionalCoordinates?.map((coordinates, index) => (
                      <MenuItem
                        key={coordinates.name + index} 
                        value={coordinates.position.toString()} 
                        children={
                          // Label of each option
                          (coordinates.continent  ? `${coordinates.continent}`  : '')
                          +
                          (coordinates.country    ? `, ${coordinates.country}`  : '') 
                          +
                          (coordinates.state      ? `, ${coordinates.state  }`  : '')
                          +
                          (coordinates.name       ? `, ${coordinates.name   }`  : '')
                          +
                          ` (${coordinates.position})`
                        }
                      />
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>

          </Grid>
        </ListItem>

        <ListItem disablePadding sx={{ mt: 1 }}>
          {/* Mapping */}
          <Box sx={{ width: '100%', height: '15rem' }}>
            <DialogMapping
              // Add current geolocation, sothat all locations + the optional ones are displayed
              geolocations={optionalCoordinates?.concat([geolocation])}
              // FIXME: When dblclicking the default marker, an error occurs ('Reading property of undefined is not possible (reading value when Array.map)')
              markerDblClickHandler={(event) => {
                let latlng = event.latlng, position = [latlng['lat'], latlng['lng']];
                setLocation(position.toString()); // Convert it into a string, sothat JS doesn't compare by reference, but by value (In this case, only with primitive values)
                setDisableButton(position.toString() === geolocation?.position.toString());  
                setSessionData({...sessionData, selectedOptionPosition: position });
              }}
            />
            <Typography fontSize={10}>Double click the respective marker to select the position (BETA)</Typography>
          </Box>
        </ListItem>

        <ListItem disablePadding sx={{ mt: 2, display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
          {/* Save Button */}
          <SaveButton
            variant='contained'
            disabled={disableButton}
            onClick={() => {
              // If changes were made, pass the updated geolocation to the high order component "MainArea" and enable the save changes button
              if(location) {
                if(dialogProps.enableSaveChangesButton) dialogProps.enableSaveChangesButton();
                setSessionData({...sessionData, updatedGeolocations: geolocations.forEach((geo) => { if(geo.name === geolocation?.name) geo.position = JSON.parse(`[${location}]`) })});
              }
              resetProps()
            }}
          >
            Save
          </SaveButton>
          { 
            optionalCoordinates === undefined || optionalCoordinates?.length === 0 ? 
              <Typography paragraph={true} sx={{ fontWeight: 'bold', color: 'red' }}>
                No Locations available
              </Typography> 
            : null
          }
        </ListItem>
      </DialogContentArea>
  )
}
