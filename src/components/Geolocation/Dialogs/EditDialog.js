import React from 'react';
import {  
  // InputAdornment,
  MenuItem,
  TextField
} from '@mui/material';
import { SaveButton } from '../../customComponents';
import { DialogContentArea } from './DialogFunctions';
// import { AccountCircle } from '@mui/icons-material';

/**
 * 
 * @param {{
 *  geolocation: { name: string, position: float[] }, 
 *  dialogProps: { open: Boolean, onClose: Function }
 * }}
 * @returns {React.JSX.Element}
 */
export default function EditDialog({ geolocation, dialogProps }) {
  return (
      <DialogContentArea
        title={'Edit location'}
        open={dialogProps.open}
        onClose={() => dialogProps.onClose(false)}
        children={
          <>
            {/* Placename */}
            <TextField
              disabled
              margin='normal'
              variant='outlined'
              // inputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">
              //       <AccountCircle />
              //     </InputAdornment>
              //   ),
              // }}
              label='Placename'
              defaultValue={geolocation?.name}
            />
            {/* Position */}
            <TextField
              select
              size='small'
              margin='normal'
              label='Position'
              id='editdialog-position'
              helperText='Select one option'
              defaultValue={geolocation?.name}
            >
              {/* TODO: Communication with Backend - 5 possible Options */}
              <MenuItem key={geolocation?.name} value={geolocation?.name} children={`(${geolocation?.position[0]}, ${geolocation?.position[1]})`}/>
            </TextField>
            <SaveButton
              // TODO: Save the edited location
              onClick={() => {
                dialogProps.onClose(false)
                dialogProps.enableSaveChangesButton()
              }}
            >
              Save
            </SaveButton>
          </>
        }
      />
  )
}
