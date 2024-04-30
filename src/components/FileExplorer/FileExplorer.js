import { List } from '@mui/material';
import FileUploader from './FileUploader';
import { useSession } from '../SessionProvider';
import React, { useEffect, useState } from 'react';
import { convertFileToJSONArray } from '../../utils/jsonFunctions';
import { ExtractEntries, ExtractNewEntries, hasKey } from './FileExplorerFunctions';

export default function FileExplorer({ handleFileItemClick }) {
    // Data from file
    const 
        { sessionData, setSessionData } = useSession(),
        [fileDataset, setFileDataset] = useState([]),
        [newFileDataset, setNewFileDataset] = useState();

    // When changes are saved, it should be added to the "newFileDataset" list
    useEffect(
        () => {
            const fileData = sessionData?.newFileData;
            if(fileData) {
                if(newFileDataset === undefined) setNewFileDataset([fileData]) 
                else if(hasKey(newFileDataset, fileData)) alert('File has already been changed!'); 
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
                    paddingX: 2,
                    marginTop: 2,
                    height: '75vh',
                    overflowY: 'auto',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white'
                }}
            >
                <ExtractEntries data={fileDataset} handleClick={handleFileItemClick}/>
                {/* Dynamically add new entries (by saving changes) */}
                <ExtractNewEntries data={newFileDataset} handleClick={handleFileItemClick} />
            </List>
        </>
    )
}