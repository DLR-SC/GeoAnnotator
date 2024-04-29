import React, { useState } from 'react';
import {
    List,
    Box
} from '@mui/material';
import {
    extractEntries
} from './FileExplorerFunctions';
import FileUploader from './FileUploader';
import { convertFileToJSONArray } from '../../utils/jsonFunctions';

export default function FileExplorer({ handleFileItemClick }) {
    // Data from file
    const [fileData, setFileData] = useState([]);

    return (
        <Box>
            <FileUploader 
                onFilesSelect={(files) => { 
                    // FIXME: We assume, that we only have selected one file. Thus we expect only one element in the array
                    convertFileToJSONArray(files[0], setFileData)
                }}
            />
            <List
                sx={{
                    marginTop: 2,
                    paddingX: 2,
                    overflowY: 'auto',
                    height: '70vh',
                    backgroundColor: 'white'
                }}
                >
                {
                    extractEntries(
                        fileData,
                        handleFileItemClick
                    )
                }
            </List>
        </Box>
    )
}