import { useEffect, useState } from 'react';
import { useSession } from '../SessionProvider';
import {
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Menu,
    MenuItem,
    Box
} from '@mui/material';
import { 
    Place,
    MenuRounded
} from '@mui/icons-material';
import EditDialog from './Dialogs/EditDialog';

/**
 * Geolocation etrnies in list
 * @param {{data: { position: float[], name: string }[]}}
 */
export function GeoLocationItems({ data, disabledSaveChangesButton }) {
    const 
        session = useSession(),
        [open, setOpen] = useState(false),
        [anchorEl, setAnchorEl] = useState(null),
        [geolocation, setGeolocation] = useState(),
        [geolocations, setGeolocations] = useState(data);

    // Everytime when a new json-file is chosen and the data parameter changes, rerender the geolocations
    useEffect(() => {
        setGeolocations(data);
    }, [data])

    return (
        <Box>
            {
                geolocations.map((geo, index) => (
                    <ListItem key={index}>
                        {/* Place-Icon */}
                        <ListItemIcon 
                            onClick={() => session.setSessionData({ ...session.sessionData, geolocation: geo })} // Exchange data with MapContainer
                            children={<Place sx={{ color: '#2587be', '&:hover': { cursor: 'pointer' } }} />} 
                        />
                        {/* Placename + Position */}
                        <ListItemText 
                            primary={
                                `${geo.name}\t(${geo.position})`
                            }
                        />
                        {/* Menu of Geolocation */}
                        <ListItemSecondaryAction>
                            {/* Menu-Icon */}
                            <MenuRounded 
                                edge="end" 
                                onClick={(event) => {
                                    setGeolocation(geo);
                                    setAnchorEl(event.currentTarget);
                                }}
                                sx={{
                                    '&:hover': { cursor: 'pointer' }
                                }}
                            />
                            {/* Menu */}
                            <Menu 
                                anchorEl={anchorEl} 
                                open={Boolean(anchorEl)} 
                                onClose={() => setAnchorEl(null)}
                            >
                                {/* Edit */}
                                <MenuItem 
                                    variant="outlined" 
                                    onClick={() => {
                                        setOpen(true);
                                        setAnchorEl(null);
                                    }}
                                >
                                    Edit
                                </MenuItem>
                                {/* Delete */}
                                {/* TODO: Rerender textcontent and mapping when geolocations are deleted */}
                                <MenuItem 
                                    onClick={() =>{
                                        // When a geolocation is deleted, re-map through the changed geolocations array and rerender
                                        setAnchorEl(null);
                                        disabledSaveChangesButton(false);
                                        session.setSessionData({ ...session.sessionData, updatedGeolocations: geolocations.filter((geo) => geo.name !== geolocation.name) })
                                }}>Delete</MenuItem>
                            </Menu>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))
            }
            <EditDialog
                geolocation={geolocation}
                dialogProps={{
                    open: open,
                    onClose: setOpen,
                    enableSaveChangesButton: () => disabledSaveChangesButton(false)
                }}
            />
        </Box>
    )
}
