import './Dialog.css';
import React, { useState } from 'react';
import { useSession } from '../SessionProvider';
import { SaveButton } from '../customComponents';
import DialogMapping from '../Mapping/DialogMapping';
import { DialogContentArea } from './DialogFunctions';
import { 
    //   Button,
    Box,
    List,
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    Typography,
    Grid,
} from '@mui/material';
import { PlaceTwoTone } from "@mui/icons-material";

/**
 * Dialog for editing location
 * @param {Object} param
 * @param {{ name: string, position: float[] }[]} param.georeferences
 * @param {React.Dispatch<any>} param.setGeolocations
 * @param {{ open: Boolean, onClose: Function }} dialogProps
 * @returns {React.JSX.Element}
 */
export default function GeoparseDialog({ dataProps, dialogProps }) {
  const
    // Access to global data
    { sessionData, setSessionData } = useSession(),
    {
      setGeolocations,
      georeferences,
      setDetectedGeoreferences,
    } = dataProps,
    // Reset properties, when dialog is closed
    resetProps = () => {
      dialogProps.onClose();
      setDetectedGeoreferences();
    };

  return (
      <DialogContentArea
        title={dialogProps.title}
        open={dialogProps.open}
        onClose={resetProps}
        fullWidth={true}
        backdropIntensity={0.4}
        children={
          <>
            {/* Detected Georeferences */}
            <List 
                disablePadding
                sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    flexWrap: 'nowrap',
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    maxHeight: '10rem',
                    overflowY: 'auto',
                    border: '4px solid #2587be',
                    borderRadius: '0.5rem'
                }}
            >
            {
                georeferences?.map((georeference, index) => (
                    <ListItem 
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <ListItemIcon 
                          children={<PlaceTwoTone sx={{ color: '#2587be', '&:hover': { cursor: 'pointer' } }} />}
                          onClick={() => setSessionData({ ...sessionData, georeferencePosition: georeference.position })}
                        />
                        <ListItemText 
                            primary={
                                (georeference.name ?? '')
                                +
                                ` (${georeference.position})`
                            }
                        />
                    </ListItem>
                ))
            }
            </List>

            {/* Mapping  */}
            <ListItem disablePadding sx={{ mt: 1 }}>
              <Box sx={{ width: '100%', height: '15rem' }}>
                <DialogMapping
                  geolocations={georeferences}
                />
              </Box>
            </ListItem>

            {/* Save Button */}
            <ListItem disablePadding sx={{ mt: 2, display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
              <Grid 
                container
                spacing={3}
                columns={12}
                wrap='nowrap'
                sx={{
                  padding: 2
                }}
              >
                <Grid item xs={10}>
                  <Typography paragraph={true}>
                    The existing georeferences will be overwritten!
                  </Typography> 
                </Grid>

                <Grid item xs={2}>
                  <SaveButton
                    variant='contained'
                    onClick={() => {
                      setSessionData({ ...sessionData, disableSaveGeolocationChangesButton: false })
                      setGeolocations(georeferences);
                      dialogProps.onClose();
                    }}
                  >
                    Save
                  </SaveButton>
                </Grid>
              </Grid>
            </ListItem>
          </>
        }
      />
  )
}