import './Dialog.css';
import React, { useEffect, useRef, useState } from 'react';
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
  var 
    // Input value variables (No re-rendering) for manual modification of location
    location = { lat: geolocation?.position[0] ?? null, long: geolocation?.position[1] ?? null },
    placename = geolocation?.name;

  const
    // References, to access the current value of inputFields for Latitude and Longitude
    latInputRef = useRef(null), longInputRef = useRef(null),
    // Access to global data
    { sessionData, setSessionData } = useSession(),
    // Error message, when no location is available
    [errorMessage, setErrorMessage] = useState(),
    // Add/Save-button accessability
    [disableButton, setDisableButton] = useState(true),
    // Coordinate, which is chosen in secondary dialog
    [coordinate, setCoordinate] = useState(),
    [optionalCoordinates, setOptionalCoordinates] = useState([]),
    [optionalPositionDialogOpen, setOptionalPositionDialogOpen] = useState(false),
    // Reset properties, when dialog is closed
    resetProps = () => {
      location = { lat: null, long: null }
      setDisableButton(true)
      setCoordinate(undefined)
      setErrorMessage(undefined)
      setOptionalCoordinates([])
      dialogProps.onClose(false)
    };

  // useEffect(
  //   () => {
  //     setDisableButton(latInputRef.current?.value && longInputRef.current?.value)
  //   },
  //   [latInputRef.current?.value, longInputRef.current?.value]
  // )

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
                inputRef={latInputRef}
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
                  inputRef={longInputRef}
                  defaultValue={coordinate?.long ? coordinate?.long : location.long}
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

          </Grid>
        </ListItem>

        <ListItem disablePadding sx={{ mt: 1 }}>
          {/* Mapping */}
          <Box sx={{ width: '100%', height: '15rem' }}>
            <DialogMapping
              // Add current geolocation, sothat all locations + the optional ones are displayed
              geolocations={optionalCoordinates?.concat([geolocation])}
              markerDblClickHandler={(event) => {
                let latlng = event.latlng, position = { lat: latlng['lat'], long: latlng['lng'] };
                setCoordinate(position);
                setDisableButton(position);  
                setSessionData({...sessionData, selectedOptionalCoordinate: [position.lat, position.long] });
              }}
            />
            <Typography fontSize={10}>Double click the respective marker to select the position</Typography>
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
                let geolocationPos = coordinate?.lat && coordinate?.long ? [coordinate?.lat,coordinate?.long] : JSON.parse(`[${location}]`)
                if(dialogProps.dialogUsage === 'edit')     geolocations.forEach((geo) => { if(geo.name === geolocation?.name) geo.position = geolocationPos }); 
                else if(dialogProps.dialogUsage === 'add') geolocations.push({ ...geolocation, position: geolocationPos });
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
