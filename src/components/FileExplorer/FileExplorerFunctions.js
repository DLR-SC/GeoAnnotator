import { MapRounded, MenuRounded } from '@mui/icons-material';
import {
    ListItem,
    ListItemIcon,
    ListItemButton,
    ListItemSecondaryAction
} from '@mui/material';
import axios from 'axios';

/**
 * Extract the respective JSONObjects from the JSON-file and
 * construct a List out of it
 * @param {JSON[]} data
 * @param {Function} handleClick
 * @returns {React.JSX.Element[]}
 */
export function ExtractEntries({data, handleClick, handleMenuClick}) {

    return (
        data.map((object, index) => (
            <ListItem 
                key={index}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <ListItemIcon 
                    sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                    children={<MapRounded sx={{ color: 'limegreen' }}/>} 
                />
                <ListItemButton onClick={() => handleClick(object, index)}>
                    {`file_${index}.json`}
                </ListItemButton>
                {/* Menu of json file */}
                <ListItemSecondaryAction>
                    {/* Menu-Icon */}
                    <MenuRounded 
                        edge="end" 
                        onClick={event => handleMenuClick(event, object)}
                        sx={{
                            '&:hover': { cursor: 'pointer' }
                        }}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        ))
    )
}

/**
 * Save changes as new entries in FileExplorer-list
 * @param {Object} param 
 * @param {{ text: string, locations: Object, key: number }} param.data 
 * @param {Function} param.handleClick 
 */
export function ExtractNewEntries({ data, handleClick, handleMenuClick }) {
    // If data is undefined, return nothing
    if(!data) return;

    return (
        data.map((object) => (
            <ListItem 
                key={object?.key + 0.1}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <ListItemIcon 
                    sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                    children={<MapRounded sx={{ color: 'red' }}/>} 
                />
                <ListItemButton
                    onClick={() => handleClick(object, object?.key)}
                >
                    {`file_${object?.key}.edt.json`}
                </ListItemButton>
                {/* Menu of json file */}
                <ListItemSecondaryAction>
                    {/* Menu-Icon */}
                    <MenuRounded 
                        edge="end" 
                        onClick={handleMenuClick}
                        sx={{
                            '&:hover': { cursor: 'pointer' }
                        }}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        ))
    )
}

/**
 * Check, if the new file is already added to the list
 * @param {{text: string, locations: { location: [float, float] }, key: number}[]} dataset 
 * @param {{text: string, locations: { location: [float, float] }, key: number}} fileData 
 * @returns 
 */
export function hasKey(dataset, fileData) {
    for(let data of dataset) if(data.key === fileData?.key) return true;
    return false;
}

/**
 * 
 * @param {*} fileData 
 */
export async function downloadFile(fileData) {
    let 
        blob = new Blob([JSON.stringify(fileData, null, 4)], { type: 'application/json' }),
        url = window.URL.createObjectURL(blob),
        a = document.createElement('a');
    a.href = url;
    a.download = "file.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}