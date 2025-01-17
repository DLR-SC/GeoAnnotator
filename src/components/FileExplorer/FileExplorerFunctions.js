/** File system with the list entries */
import { useState } from 'react';
import { MapRounded, MenuRounded } from '@mui/icons-material';
import {
    ListItem,
    ListItemIcon,
    ListItemButton,
    ListItemSecondaryAction
} from '@mui/material';
import { useSession } from '../SessionProvider';

/**
 * Extract the respective JSONObjects from the JSON-file and
 * construct a List out of it
 * @param {JSON[]} data
 * @param {Function} handleClick
 * @returns {React.JSX.Element[]}
 */
export function ExtractEntries({data, handleClick, handleMenuClick}) {
    const
        { sessionData } = useSession(),
        // State to track the selected index
        [selectedIndex, setSelectedIndex] = useState(null),
        // Handler to set selected index
        handleListItemClick = (object, index) => {
            setSelectedIndex(index);    
            handleClick(object, index);
        };

    return (
        data.map((object, index) => {
            if(object === undefined) return null;

            return (
                <ListItem 
                    key={index}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        bgcolor: selectedIndex === index ? 'rgba(0, 255, 0, 0.2)' : 'inherit'
                    }}
                >
                    <ListItemIcon 
                        sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                        children={<MapRounded sx={{ color: sessionData?.changedFiles?.includes(index) ? 'red' : 'limegreen' }}/>} 
                    />
                    <ListItemButton onClick={() => handleListItemClick(object, index)}>
                        {`file_${index}.json`}
                    </ListItemButton>
                    {/* Menu of json file */}
                    <ListItemSecondaryAction>
                        {/* Menu-Icon */}
                        <MenuRounded 
                            edge="end" 
                            onClick={event => handleMenuClick(event, object, index)}
                            sx={{
                                '&:hover': { cursor: 'pointer' }
                            }}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            )
        })
    )
}

/**
 * Check, if the new file is already added to the list
 * @param {{text: string, locations: { location: [float, float] }, key?: number}[]} dataset 
 * @param {{text: string, locations: { location: [float, float] }, key: number}} fileData 
 */
export function hasKey(dataset, fileData) {
    for(let data of dataset) if(data.key === fileData?.key) return true;
    return false;
}

/**
 * Trigger Download-Event of corresponding json file
 * @param {{text: string, locations: { location: [float, float] }}} fileData
 * @param {JSON} sessionData
 */
export function downloadFile(fileData, sessionData) {
    let 
        blob = new Blob([JSON.stringify(fileData, null, 4)], { type: 'application/json' }),
        url = window.URL.createObjectURL(blob),
        a = document.createElement('a');
        
    a.href = url;
    a.download = `file_${fileData.key ?? 'unregistered'}${sessionData?.changedFiles?.includes(fileData.key) ? '.edt' : ''}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

/**
 * Trigger Download-Event of all json-files
 * @param {{text: string, locations: { location: [float, float] }}[]} fileDataset 
 * @param {JSON} sessionData
 */
export function downloadFiles(fileDataset, sessionData) {
    let
        newFileDataset = fileDataset.filter(file => file),
        blob = new Blob([JSON.stringify(newFileDataset, null, 4)], { type: 'application/json' }),
        url = window.URL.createObjectURL(blob),
        a = document.createElement('a');

    a.href = url;
    a.download = `files${newFileDataset.length !== fileDataset.length || sessionData?.changedFiles ? '.edt' : ''}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}