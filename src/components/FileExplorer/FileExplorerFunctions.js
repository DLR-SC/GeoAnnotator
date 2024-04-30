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
export function extractEntries(data, handleClick) {
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