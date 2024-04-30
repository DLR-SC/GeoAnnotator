import { List } from '@mui/material';
import React, { useState } from 'react';
import FileUploader from './FileUploader';
import { extractEntries } from './FileExplorerFunctions';
import { convertFileToJSONArray } from '../../utils/jsonFunctions';

export default function FileExplorer({ handleFileItemClick }) {
    // Data from file
    const [fileDataset, setFileDataset] = useState([]);

    return (
        <>
            <FileUploader 
                onFilesSelect={(files) => { 
                    // FIXME: We assume, that we only have selected one file. Thus we expect only one element in the array
                    convertFileToJSONArray(files[0], setFileDataset)
                }}
            />
            <List
                sx={{
                    paddingX: 2,
                    marginTop: 2,
                    height: '75vh',
                    overflowY: 'auto',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white'
                }}
                children={
                    extractEntries(
                        fileDataset,
                        handleFileItemClick
                    )
                }
            />
        </>
    )
}