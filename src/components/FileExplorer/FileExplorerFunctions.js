/** File system with the list entries */
import { MapRounded, MenuRounded } from '@mui/icons-material';
import {
    ListItem,
    ListItemIcon,
    ListItemButton,
    ListItemSecondaryAction
} from '@mui/material';
import { useSession } from '../SessionProvider';

/**
 * Extract the respective JSONObjects from the JSON-file and construct a List out of it
 * @param {Object}   props
 * @param {JSON[]}   props.fileDataset
 * @param {Function} props.handleClick
 * @param {Function} props.handleMenuClick
 * @returns {React.JSX.Element[]}
 */
export function ExtractEntries(props) {
    const 
        { fileDataset, fileIndex, handleClick, handleMenuClick } = props,
        { sessionData } = useSession();

    return (
        !isNaN(fileIndex) ? <Entry props={props} sessionData={sessionData}/> :
            fileDataset.map((object, index) => {
                // In case the entry got "deleted"
                if(object === undefined) return null;

                return (
                    <ListItem 
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            bgcolor: sessionData?.fileIndex === index ? 'rgba(0, 255, 0, 0.2)' : 'inherit'
                        }}
                    >
                        <ListItemIcon 
                            sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                            children={<MapRounded sx={{ color: sessionData?.changedFiles?.includes(index) ? 'red' : 'limegreen' }}/>} 
                        />
                        <ListItemButton onClick={() => handleClick(object, index)}>
                            {index}
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

function Entry({ props, sessionData }) {
    const 
        { fileDataset, fileIndex, handleClick, handleMenuClick } = props,
        fileData = fileDataset[fileIndex];

    return (
        fileData ?
        <ListItem 
            key={fileIndex}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                bgcolor: sessionData?.fileIndex === fileIndex ? 'rgba(0, 255, 0, 0.2)' : 'inherit'
            }}
        >
            <ListItemIcon 
                sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
                children={<MapRounded sx={{ color: sessionData?.changedFiles?.includes(fileIndex) ? 'red' : 'limegreen' }}/>} 
            />
            <ListItemButton onClick={() => handleClick(fileData, fileIndex)}>
                {fileIndex}
            </ListItemButton>
            {/* Menu of json file */}
            <ListItemSecondaryAction>
                {/* Menu-Icon */}
                <MenuRounded 
                    edge="end" 
                    onClick={event => handleMenuClick(event, fileData, fileIndex)}
                    sx={{
                        '&:hover': { cursor: 'pointer' }
                    }}
                />
            </ListItemSecondaryAction>
        </ListItem>
        : <ListItem>Entry not found</ListItem>
    )
}

/**
 * Check, if the new file is already added to the list
 * @param {{text: string, locations: { location: [float, float] }, id?: number}[]} dataset 
 * @param {{text: string, locations: { location: [float, float] }, id: number}} fileData 
 */
export function hasID(dataset, fileData) {
    for(let data of dataset) if(data.id === fileData?.id) return true;
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
    a.download = `file_${fileData.id ?? 'unregistered'}${sessionData?.changedFiles?.includes(fileData.id) ? '.edt' : ''}.json`;
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