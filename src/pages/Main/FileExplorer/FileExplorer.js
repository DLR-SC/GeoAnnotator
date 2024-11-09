/** Main program to process the uploaded file */

import FileUploader from './FileUploader'
import { Save } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { useSession } from '../../../components/SessionProvider'
import { addFileWithoutDupe } from '../../../utils/utilFunctions'
import { SaveButton } from '../../../components/customComponents'
import { convertFileToJSONArray } from '../../../utils/jsonFunctions'
import { List, Menu, MenuItem, TextField, InputAdornment } from '@mui/material'
import { ExtractEntries, downloadFile, downloadFiles } from './FileExplorerFunctions'

export default function FileExplorer({ dataProps, handleFileItemClick }) {
    const
        { 
            fileDataset, setFileDataset,
            setCurrentData
        } = dataProps,
        { sessionData, setSessionData } = useSession(),

        // Menu
        [fileData, setFileData] = useState(),
        [anchorEl, setAnchorEl] = useState(null),
        handleMenuClick = (event, object, index) => {
            setAnchorEl(event.currentTarget);
            setFileData({ ...object, id: index });
        },

        // Save all files button 
        [disabledSaveButton, setDisabledSaveButton] = useState(true),
        
        // Search bar
        [fileIndex, setFileIndex] = useState(),
        handleSearchBarChange = (event) => {
            let value = event.target.value;
            if (!isNaN(value) && /^\d*$/.test(value) && value.trim() !== '') setFileIndex(Number(value))
            else setFileIndex();
        };

    // Apply changes to the corresponding files
    useEffect(() => {
        const newFileData = sessionData?.newFileData;
        if(newFileData) {
            // Overwrite location attribute in corresponding file in the dataset
            fileDataset[newFileData.id] = { ...fileDataset[newFileData.id], locations: newFileData.locations };
            setSessionData({ ...sessionData, changedFiles: sessionData?.changedFiles ? addFileWithoutDupe(sessionData, newFileData.id) : [newFileData.id]});
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionData?.newFileData])

    // Enable 'Save all files'-button, when 'fileDataset' changes (e.g. local file chosen)
    useEffect(() => { if(fileDataset.length && disabledSaveButton) setDisabledSaveButton(false) }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileDataset])

    return (<>
        <FileUploader 
            onFilesSelect={files => { 
                // FIXME: We assume, that we only have selected one file. Thus we expect only one element in the array
                convertFileToJSONArray(files[0], setFileDataset);
                
                // Reset file-properties
                setCurrentData(); setSessionData({ ...sessionData, fileData: undefined, fileIndex: undefined, changedFiles: undefined });
            }}
        />
        <TextField
            disabled={fileDataset.length === 0}
            fullWidth
            margin='normal'
            placeholder='Search for entry'
            onChange={handleSearchBarChange}
            InputProps={{
                startAdornment: <InputAdornment position='start'>ID:</InputAdornment>,
            }}
            sx={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
            }}
        />
        <List
            sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                flexDirection: 'column',
                justifyContent: 'space-between',
                mb: 2,
                height: '70vh',
                overflowY: 'auto',
                borderRadius: '0.5rem',
                backgroundColor: 'white'
            }}
        >
            <ExtractEntries 
                fileIndex={fileIndex}
                fileDataset={fileDataset}
                handleClick={handleFileItemClick} 
                handleMenuClick={handleMenuClick}
            />
            {/* Menu */}
            <Menu 
                anchorEl={anchorEl} 
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {/* Download */}
                <MenuItem 
                    variant="outlined" 
                    onClick={() => {
                        setAnchorEl(null);
                        downloadFile(fileData, sessionData);
                    }}
                >
                    Download
                </MenuItem>
                {/* Delete */}
                <MenuItem 
                    onClick={() => {
                        setAnchorEl(null);
                        setFileDataset(fileDataset.map((file, index) => { if(index === fileData?.id) return undefined; else return file; }));
                        // If data was chosen before, reset the values of textcontent and geolocation-list
                        if(sessionData?.fileIndex === fileData?.id) setCurrentData();
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>
        </List>
        <SaveButton
            disabled={disabledSaveButton}
            variant='contained'
            startIcon={<Save />}
            sx={{
                backgroundColor: 'lightgrey',
                '&:hover': {
                    backgroundColor: 'darkblue',
                }
            }}
            onClick={() => downloadFiles(fileDataset, sessionData)}
        >
            Save all files
        </SaveButton>
    </>)
}