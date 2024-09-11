import './Dialog.css';
import React, { useEffect, useState } from 'react';
import { useSession } from '../SessionProvider';
import { SaveButton } from '../customComponents';
import DialogMapping from '../Mapping/DialogMapping';
import OptionalPositionsDialog from './OptionalCoordinatesDialog';
import { DialogContentArea, getOptionalCoordinates } from './DialogFunctions';
import { 
  Box, 
  Grid, 
  Button,
  ListItem, 
  TextField, 
  Typography, 
} from '@mui/material';

/**
 * Dialog for editing location
 * @param {Object} param
 * @param {{ name: string, position: float[] }} param.geolocation
 * @param {{ name: string, position: float[] }[]} param.geolocations
 * @param {{ open: Boolean, onClose: Function, dialogUsage: 'add' | 'edit' }} param.dialogProps
 * @returns {React.JSX.Element}
 */
export default function LocationDialog({ geolocations, geolocation, dialogProps }) {
  const
    // Access to global data
    { sessionData, setSessionData } = useSession(),
    // Error message, when no location is available
    [errorMessage, setErrorMessage] = useState(),
    // Add/Save-button accessability
    [disableButton, setDisableButton] = useState(true),
    // Placename of current toponym
    [placename, setPlacename] = useState(),
    // Coordinate, which is chosen in secondary dialog
    [coordinate, setCoordinate] = useState(),
    [optionalCoordinates, setOptionalCoordinates] = useState([]),
    [optionalPositionDialogOpen, setOptionalPositionDialogOpen] = useState(false),
    // Reset properties, when dialog is closed
    resetProps = () => {
      setErrorMessage(undefined)
      setOptionalCoordinates([])
      setDisableButton(true)
      dialogProps.onClose(false)
    };

  useEffect(
    () => {
      setPlacename(geolocation?.name)
      setCoordinate({ lat: geolocation?.position[0], lng: geolocation?.position[1] })
    }, 
    [geolocation]
  )

  return (
    <>
      <DialogContentArea
        title={dialogProps.title}
        open={dialogProps.open}
        onClose={resetProps}
        fullWidth={true}
        backdropIntensity={0.4}
        children={
          <>
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
                    onBlur={event => setPlacename(event.target.value)}
                  />
                </Grid>

                {/* Position - Latitude */}
                <Grid item xs={3}>
                    <TextField
                      fullWidth
                      variant='filled'
                      label="Latitude"
                      defaultValue={coordinate?.lat}
                      onBlur={event => {
                        let lat = Number(event.target.value);
                        if(!isNaN(lat)) {
                          setCoordinate({ ...coordinate, lat: lat });
                          if(coordinate?.lng) {
                            setSessionData({...sessionData, selectedOptionalCoordinate: [lat, coordinate?.lng] });
                            setDisableButton( false )
                          }
                        }
                      }}
                    />
                </Grid>

                {/* Position - Longitude */}
                <Grid item xs={3}>
                    <TextField
                      fullWidth
                      variant='filled'
                      label="Longitude"
                      defaultValue={coordinate?.lng}
                      onBlur={event => {
                        let lng = Number(event.target.value);
                        if(!isNaN(lng)) {
                          setCoordinate({ ...coordinate, lng: lng });
                          if(coordinate?.lat) {
                            setSessionData({...sessionData, selectedOptionalCoordinate: [coordinate?.lat, lng] });
                            setDisableButton( false )
                          }
                        }
                      }}
                    />
                </Grid>
                
                {/* Search positions button */}
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
                        .catch(error => setErrorMessage(error.response?.data.detail ? error.response.data.detail : error.message))
                    }}
                  >
                    Search positions
                  </Button>
                </Grid>

              </Grid>
            </ListItem>

            {/* Mapping  */}
            <ListItem disablePadding sx={{ mt: 1 }}>
              <Box sx={{ width: '100%', height: '15rem' }}>
                <DialogMapping
                  // Display current geolocation + optional coordinates
                  geolocations={[geolocation, { name: placename, position: [coordinate?.lat, coordinate?.lng] }, ...optionalCoordinates]}
                  // Double clicking a marker should be selected
                  markerDblClickHandler={event => {
                    let latlng = event.latlng, position = { lat: latlng['lat'], lng: latlng['lng'] };
                    setCoordinate(position);
                    setDisableButton(false);  
                    setSessionData({ ...sessionData, selectedOptionalCoordinate: [position.lat, position.lng] });
                  }}
                />
                <Typography fontSize={10}>Double click the respective marker to select the position</Typography>
              </Box>
            </ListItem>

            {/* Save Button */}
            <ListItem disablePadding sx={{ mt: 2, display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
              <SaveButton
                variant='contained'
                disabled={disableButton}
                onClick={() => {
                  let geolocationPos = [ coordinate.lat, coordinate.lng ];
                                    
                  if(dialogProps.dialogUsage === 'edit')     geolocations.forEach((geo) => { if(geo.name === geolocation?.name) geo.position = geolocationPos }); 
                  else if(dialogProps.dialogUsage === 'add') geolocations.push({ ...geolocation, position: geolocationPos });
                  
                  setSessionData({ ...sessionData, disableSaveChangesButton: false });
                  resetProps();
                }}
              >
                { dialogProps.dialogUsage === 'add' ? 'Add' : 'Save' }
              </SaveButton>
              <Typography paragraph={true} sx={{ fontWeight: 'bold', color: 'red' }}>
                { errorMessage ? errorMessage : null }
              </Typography> 
            </ListItem>
          </>
        }
      />
      <OptionalPositionsDialog 
        open={optionalPositionDialogOpen}
        onClose={() => setOptionalPositionDialogOpen(false)}
        optionalCoordinates={optionalCoordinates}
        setCoordinate={setCoordinate}
        setDisableButton={setDisableButton}
      />
    </>
  )
}
