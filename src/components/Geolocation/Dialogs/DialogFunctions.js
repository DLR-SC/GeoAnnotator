import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Paper,
    List,
    IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

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
      children,
      fullWidth=false,
      backdropIntensity
  } = props;

  return (
    <Dialog 
      open={open}
      onClose={onClose} 
      PaperComponent={(props) => (
        <Draggable
          handle="#draggable-dialog-title"
          cancel={'[class*="MuiDialogContent-root"]'}
        >
          <Paper {...props}/>
        </Draggable>
      )}
      aria-labelledby='draggable-dialog-title'
      fullWidth={fullWidth}
      slotProps={{backdrop:{ style: { backgroundColor: `rgba(0, 0, 0, ${backdropIntensity})` } }}}
    >
      <DialogTitle 
        id='draggable-dialog-title'
        sx={{ cursor: 'move', display: 'flex', justifyContent: 'space-between' }}
      >
        {title}
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        > 
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
          <List 
            sx={{ p: 0, flexDirection: 'column' }} 
            children={children}
          />
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

/**
 * Return 5 possible coordinates for given placename
 * @param {string} placename
 * @returns {Promise<[float, float][]>}
 */
export async function getOptionalCoordinates(placename) {
  let 
    config = {
      baseURL: 'http://localhost:8000/api',
      responseType: 'json'
    },
    data = await axios.get(`/geolocations?placename=${placename}`, config);

  return data.data;
}