import {
    Dialog,
    DialogTitle,
    DialogContent,
    Paper,
    List,
    ListItem,
    MenuItem
} from '@mui/material';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useState } from 'react';

/**
 * Content area of Edit-Dialog
 * @param {PropTypes} props 
 * @returns {React.JSX.Element}
 */
export function DialogContentArea(props) {
  let { 
      title, 
      open, 
      onClose, 
      children 
  } = props;

  return (
    <Dialog 
      open={open}
      onClose={() => onClose()} 
      PaperComponent={(props) => (
        <Draggable
          handle="#draggable-dialog-title"
          cancel={'[class*="MuiDialogContent-root"]'}
        >
          <Paper {...props}/>
        </Draggable>
      )}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle 
        id='draggable-dialog-title'
        sx={{ cursor: 'move' }}
        children={title}
      />
      <DialogContent>
          <List 
              sx={{ pt: 0 }}
          >
            <ListItem
              sx={{
                flexDirection: 'column'
              }}
              children={children}
            />
          </List>
      </DialogContent>
    </Dialog>
  );
}
  
DialogContentArea.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.any
};

export function OptionalCoordinates({ geolocation }) {
  let [optionalCoordinates, setOptionalCoordinates] = useState();
  getOptionalCoordinates(geolocation?.name)
    // Retrieve data
    .then(data => setOptionalCoordinates(data))
    // Exceptionhandling
    .catch(error => null);

  return (
    optionalCoordinates?.map(([lat, long]) => (
      <MenuItem value={[lat, long]} children={`(${lat}, ${long})`} />
    ))
  )
}

/**
 * Return 5 possible coordinates for given placename
 * @param {string} placename
 * @returns {[float, float][]}
 */
export async function getOptionalCoordinates(placename) {
  let 
    config = {
      baseURL: 'http://localhost:8000/api',
      responseType: 'json'
    },
    data = await axios.get(`/coordinates?placename=${placename}`, config),
    coordinates = Object.entries(data.data).map(([placename, coordinates], index) => coordinates);
  
  return coordinates;
}