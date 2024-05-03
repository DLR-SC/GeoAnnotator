import React, { useRef } from 'react';
import { 
    Input, 
    Box 
} from '@mui/material';
import { DataObject } from '@mui/icons-material';
import { UploadButton } from '../customComponents';
import { checkFileType } from '../../utils/jsonFunctions';

export default function FolderUploader({ onFilesSelect }) {
  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box>
        <Input 
          // multiple 
          type="file"
          inputRef={fileInputRef} 
          // accept=".json"
          webkitdirectory="false" /* Due to restrictions, we are not capable to select a folder */
          onChange={(event) => {
              try {
                  let files = [...event.target.files];
                  // If no file was selected, do not update the currentFile-object
                  if(files.length && checkFileType(files)) onFilesSelect(files)
              } catch(e) {
                  alert(e.message)
              }
          }}
          sx={{ display: 'none' }}
        />
        <UploadButton 
          variant="contained"
          startIcon={<DataObject />}
          onClick={handleFileInputClick}
        >
          Choose file
        </UploadButton>
    </Box>
  );
}