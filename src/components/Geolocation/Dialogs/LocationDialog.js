import './Dialog.css';
import React, { useState } from 'react';
import { useSession } from '../../SessionProvider';
import { SaveButton } from '../../customComponents';
import DialogMapping from '../../Mapping/DialogMapping';
import OptionalPositionsDialog from './OptionalCoordinatesDialog';
import { DialogContentArea, getOptionalCoordinates } from './DialogFunctions';
import { TextField, Box, Typography, Grid, ListItem, Button } from '@mui/material';

/**
 * Dialog for editing location
 * @param {Object} param
 * @param {{ name: string, position: float[] }} param.geolocation
 * @param {{ name: string, position: float[] }[]} param.geolocations
 * @param {{ open: Boolean, onClose: Function, dialogUsage: 'add' | 'edit' }} param.dialogProps
 * @returns {React.JSX.Element}
 */
export default function LocationDialog({ geolocations, geolocation, dialogProps }) {
  // Input value variables (No re-rendering)
  var 
    location = { lat: null, long: null },
    placename = geolocation?.name;

  const
    { sessionData, setSessionData } = useSession(),
    [errorMessage, setErrorMessage] = useState(),
    [disableButton, setDisableButton] = useState(true),
    [optionalCoordinates, setOptionalCoordinates] = useState([]),
    [coordinate, setCoordinate] = useState(),
    [optionalPositionDialogOpen, setOptionalPositionDialogOpen] = useState(false),
    // Reset properties, when dialog is closed
    resetProps = () => {
      location = { lat: null, long: null }
      setDisableButton(true)
      setErrorMessage(undefined)      
      dialogProps.onClose(false)
    };

  // useEffect(
  //   () => {
  //     if(geolocation)
  //       getOptionalCoordinates(geolocation?.name)
  //         .then(data => setOptionalCoordinates(data))
  //         .catch(error => alert(error))
  //   },
  //   [geolocation]
  // );

  return (
    <>
      <DialogContentArea
        title={dialogProps.title}
        open={dialogProps.open}
        onClose={resetProps}
        fullWidth={true}
        backdropIntensity={0.4}
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
                fullWidth
                variant='filled'
                label='Placename'
                defaultValue={placename}
                onBlur={event => placename = event.target.value}
              />
            </Grid>

            {/* Position - Latitude */}
            <Grid item xs={3}>
                <TextField
                  fullWidth
                  variant='filled'
                  label="Latitude"
                  defaultValue={coordinate?.lat ? coordinate?.lat : location.lat}
                  onBlur={(event) => {
                    location = { ...location, lat: event.target.value };
                    // let value = event.target?.value, isDefault = value === 0;
                    // if(value) {
                    //   setLocation(value);
                    //   // When the value changes, enable or disable the corresponding button, depending whether it is the same value as before (default value)
                    //   setDisableButton(isDefault);
                    //   // Set the focus on to the selected marker position
                    //   setSessionData({...sessionData, selectedOptionPosition: isDefault ? geolocation?.position : JSON.parse(`[${value}]`) });
                    // }
                  }}
                />
            </Grid>

            {/* Position - Longitude */}
            <Grid item xs={3}>
                <TextField
                  fullWidth
                  variant='filled'
                  label="Longitude"
                  defaultValue={coordinate.long ? coordinate.long : location.long}
                  onBlur={(event) => {
                    location = { ...location, long: event.target.value };
                  }}
                />
            </Grid>
            
            <Grid item xs={2}>
              <Button
                id='Open-OptionalPositionsDialog-Button'
                onClick={() => {
                  getOptionalCoordinates(placename)
                    .then(coordinates => {
                      setOptionalCoordinates(coordinates);
                      setOptionalPositionDialogOpen(true);
                      if(errorMessage) setErrorMessage();
                    })
                    .catch(error => setErrorMessage(error.response.data.detail))
                }}
              >
                Search positions
              </Button>
            </Grid>

            {/* Checkbox */}
            {/* <Grid item xs>
              <FormControlLabel 
                control={
                  <Checkbox 
                    color="default"
                    sx={{ 
                      '& .MuiSvgIcon-root': { fontSize: 18 },
                      ':hover': { backgroundColor: 'transparent' }
                    }}
                    onChange={() => {

                    }}
                  />
                } 
                label="Enter position manually"
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: 13 }
                }}
              />
            </Grid> */}

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
                // setLocation(position.toString()); // Convert it into a string, sothat JS doesn't compare by reference, but by value (In this case, only with primitive values)
                setDisableButton(position.toString() === geolocation?.position.toString());  
                setSessionData({...sessionData, selectedOptionalCoordinate: position });
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
                if(dialogProps.dialogUsage === 'edit')     geolocations.forEach((geo) => { if(geo.name === geolocation?.name) geo.position = JSON.parse(`[${location}]`) }); 
                else if(dialogProps.dialogUsage === 'add') geolocations.push({ ...geolocation, position: JSON.parse(`[${location}]`) });
              }
              setSessionData({ ...sessionData, disableSaveChangesButton: false })
              resetProps()
            }}
          >
            { dialogProps.dialogUsage === 'add' ? 'Add' : 'Save' }
          </SaveButton>
          <Typography paragraph={true} sx={{ fontWeight: 'bold', color: 'red' }}>
            { errorMessage ? errorMessage : null }
          </Typography> 
        </ListItem>
      </DialogContentArea>
      <OptionalPositionsDialog 
        open={optionalPositionDialogOpen}
        onClose={() => setOptionalPositionDialogOpen(false)}
        optionalCoordinates={optionalCoordinates}
        setCoordinate={setCoordinate}
      />
    </>
  )
}
