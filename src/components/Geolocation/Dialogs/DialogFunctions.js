import {
    Dialog,
    DialogTitle,
    DialogContent,
    Paper,
    List,
    ListItem
} from '@mui/material';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

/**
 * Content area of Edit-Dialog
 * @param {PropTypes} props 
 * @returns {React.JSX.Element}
 */
export function DialogContentArea(props) {
    const { 
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