/** Main program to process the uploaded file */

import FileUploader from './FileUploader'
import { Save } from '@mui/icons-material'
import { useSession } from '../SessionProvider'
import { SaveButton } from '../customComponents'
import React, { useEffect, useState } from 'react'
import { List, Menu, MenuItem } from '@mui/material'
import { addFileWithoutDupe } from '../../utils/utilFunctions'
import { convertFileToJSONArray } from '../../utils/jsonFunctions'
import { ExtractEntries, downloadFile, downloadFiles } from './FileExplorerFunctions'

export default function FileExplorer({ handleFileItemClick }) {
    const 
        { sessionData, setSessionData } = useSession(),
        [anchorEl, setAnchorEl] = useState(null),
        [disabledSaveButton, setDisabledSaveButton] = useState(true),
        [fileData, setFileData] = useState(),
        [fileDataset, setFileDataset] = useState([]),
        handleMenuClick = (event, object, index) => {
            setAnchorEl(event.currentTarget);
            setFileData({ ...object, key: index });
        };

    // Apply changes to the corresponding files
    useEffect(
        () => {
            const newFileData = sessionData?.newFileData;
            if(newFileData) {
                // Overwrite location attribute in corresponding file in the dataset
                fileDataset[newFileData.key] = { ...fileDataset[newFileData.key], locations: newFileData.locations };
                setSessionData({ ...sessionData, changedFiles : sessionData?.changedFiles ? addFileWithoutDupe(sessionData, newFileData.key) : [newFileData.key]});
            }
        }, 
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sessionData?.newFileData]
    )

    // Enable 'Save all files'-button, when 'fileDataset' changes (e.g. local file chosen) (once)
    useEffect(() => { 
        if(fileDataset.length && disabledSaveButton) setDisabledSaveButton(false);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileDataset])

    return (
        <>
            <FileUploader 
                onFilesSelect={files => { 
                    // FIXME: We assume, that we only have selected one file. Thus we expect only one element in the array
                    convertFileToJSONArray(files[0], setFileDataset);
                    // Reset the changeFiles-stat
                    setSessionData({ ...sessionData, changedFiles: undefined });
                }}
            />
            <List
                sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    mt: 2, mb: 2,
                    height: '70vh',
                    overflowY: 'auto',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white'
                }}
            >
                <ExtractEntries 
                    data={fileDataset} 
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
                            setFileDataset(fileDataset.map((file, index) => { if(index === fileData?.key) return undefined; else return file; }));
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
        </>
    )
}