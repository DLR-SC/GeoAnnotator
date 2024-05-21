import FileUploader from './FileUploader'
import { useSession } from '../SessionProvider'
import { SaveButton } from '../customComponents'
import React, { useEffect, useState } from 'react'
import { List, Menu, MenuItem } from '@mui/material'
import { convertFileToJSONArray } from '../../utils/jsonFunctions'
import { ExtractEntries, ExtractNewEntries, hasKey, downloadFile, downloadFiles } from './FileExplorerFunctions'
import { Save } from '@mui/icons-material'

export default function FileExplorer({ handleFileItemClick }) {
    // Data from file
    const 
        { sessionData } = useSession(),
        [anchorEl, setAnchorEl] = useState(null),
        [disabledSaveButton, setDisabledSaveButton] = useState(true),
        [fileData, setFileData] = useState(),
        [fileDataset, setFileDataset] = useState([]),
        [newFileDataset, setNewFileDataset] = useState(),
        handleMenuClick = (event, object) => {
                setAnchorEl(event.currentTarget);
                setFileData(object);
        };

    // When changes are saved, it should be added to the "newFileDataset" list
    useEffect(
        () => {
            const fileData = sessionData?.newFileData;
            if(fileData) {
                if(newFileDataset === undefined) setNewFileDataset([fileData]) 
                else if(hasKey(newFileDataset, fileData)) /* TODO: When editing the same file, try to add a sub_index to it or overwrite the existing json-entry */; 
                else newFileDataset.push(fileData);
            }
        }, 
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sessionData?.newFileData]
    )

    // Enable 'Save all files'-button, when 'fileDataset' changes (e.b. local file chosen)
    useEffect(() => { if(fileDataset.length) setDisabledSaveButton(false) }, [fileDataset])

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
                {/* Dynamically add new entries (by saving changes) */}
                <ExtractNewEntries 
                    data={newFileDataset} 
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
                            downloadFile(fileData);
                        }}
                    >
                        Download
                    </MenuItem>
                    {/* Delete */}
                    <MenuItem 
                        onClick={() =>{
                            setAnchorEl(null);
                            // High-order components are being 'informed' about the deletion TODO:
                            // setSessionData({ ...sessionData, updatedFileDataset: geolocations.filter((geo) => geo.name !== geolocation.name) })
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
                    backgroundColor: 'blue',
                    '&:hover': {
                        backgroundColor: 'darkblue',
                    }
                }}
                onClick={() => downloadFiles(fileDataset)}
            >
                Save all files
            </SaveButton>
        </>
    )
}