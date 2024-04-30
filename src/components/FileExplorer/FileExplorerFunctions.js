import { MapRounded } from '@mui/icons-material';
import {
    ListItemButton,
    ListItemText,
    ListItemIcon
} from '@mui/material';

/**
 * Extract the respective JSONObjects from the JSON-file and
 * construct a List out of it
 * @param {JSON[]} data
 * @param {Function} handleClick
 * @returns {React.JSX.Element[]}
 */
export function ExtractEntries({data, handleClick}) {
    return (
        data.map((object, index) => (
            <ListItemButton
                key={index}
                onClick={() => handleClick(object, index)}
            >
                <ListItemIcon children={<MapRounded sx={{ color: 'limegreen' }}/>} />
                <ListItemText primary={`file_${index}.json`} />
            </ListItemButton>
        ))
    )
}

/**
 * TODO: When editing the same file, try to add a sub_index to it.
 * 
 */
export function ExtractNewEntries({ data, handleClick }) {
    if(!data) return;

    return (
        data.map((object) => (
            <ListItemButton
                key={object?.key}
                onClick={() => handleClick(object, object?.key)}
            >
                <ListItemIcon children={<MapRounded sx={{ color: 'red' }}/>} />
                <ListItemText primary={`file_${object?.key}.edt.json`} />
            </ListItemButton>
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