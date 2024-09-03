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
} from '@mui/material';
import { PlaceTwoTone } from "@mui/icons-material";

/**
 * Dialog for editing location
 * @param {Object} param
 * @param {{ name: string, position: float[] }[]} param.geolocations
 * @param {React.Dispatch<any>} param.setGeolocations
 * @param {{ open: Boolean, onClose: Function }} dialogProps
 * @returns {React.JSX.Element}
 */
export default function GeoparseDialog({ georeferences, setGeolocations, dialogProps }) {
  const
    // Access to global data
    { sessionData, setSessionData } = useSession(),
    // Placename of current toponym
    [placename, setPlacename] = useState(),
    // Coordinate, which is chosen in secondary dialog
    [coordinate, setCoordinate] = useState(),
    // Reset properties, when dialog is closed
    resetProps = () => {
      dialogProps.onClose(false)
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
                    overflowY: 'auto'
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
                        <ListItemIcon children={<PlaceTwoTone />}/>
                        <ListItemText 
                            primary={
                                (georeference.name       ? `${georeference.name   }, `  : '')
                                +
                                `(${georeference.position})`
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
              <SaveButton
                variant='contained'
                // disabled={disableButton}
                // onClick={() => {
                  
                // }}
              >
                Save georeferences
              </SaveButton>
              <Typography paragraph={true}>
                Attention: The existing georeferences will be overwritten!
              </Typography> 
            </ListItem>
          </>
        }
      />
  )
}