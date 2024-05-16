import FileUploader from './FileUploader';
import { useSession } from '../SessionProvider';
import React, { useEffect, useState } from 'react';
import { List, Menu, MenuItem } from '@mui/material';
import { convertFileToJSONArray } from '../../utils/jsonFunctions';
import { ExtractEntries, ExtractNewEntries, hasKey, downloadFile } from './FileExplorerFunctions';

export default function FileExplorer({ handleFileItemClick }) {
    // Data from file
    const 
        { sessionData, setSessionData } = useSession(),
        [anchorEl, setAnchorEl] = useState(null),
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
                    marginTop: 2,
                    height: '75vh',
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
                            downloadFile(fileData)
                                .then()
                                .catch(err => console.log(err));
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
        </>
    )
}