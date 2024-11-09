import axios from 'axios';
import { useState } from 'react';
import { useSession } from '../../../components/SessionProvider';
import {
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Menu,
    MenuItem,
    Box,
    Tooltip
} from '@mui/material';
import { 
    Place,
    MenuRounded
} from '@mui/icons-material';
import LocationDialog from '../../../components/Dialogs/LocationDialog'

/** 
 * Location list: Geolocation entries
 * @param {Object} param
 * @param {{ position: float[], name: string }[]} param.data
 */
export function GeolocationItems(props) {
    const 
        { sessionData, setSessionData } = useSession(),
        { geolocations, setGeolocations } = props,
        [open, setOpen] = useState(false),
        [anchorEl, setAnchorEl] = useState(null),
        [geolocation, setGeolocation] = useState();

    return (
        <Box>
            {
                geolocations.map((geo, index) => (
                    <ListItem key={index}>
                        {/* Place-Icon */}
                        <ListItemIcon 
                            onClick={() => setSessionData({ ...sessionData, geolocation: geo })} // Exchange data with MapContainer
                            children={<Tooltip title="Click to view on map"><Place sx={{ color: '#2587be', '&:hover': { cursor: 'pointer' } }} /></Tooltip>} 
                        />
                        {/* Placename + Position */}
                        <ListItemText 
                            children={
                                <>
                                    {geo.name}
                                    <br />
                                    {`(${geo.position})`}
                                </>
                            }
                        />
                        {/* Menu of Geolocation */}
                        <ListItemSecondaryAction>
                            {/* Menu-Icon */}
                            <MenuRounded 
                                edge="end" 
                                onClick={event => {
                                    setGeolocation(geo); // Set geolocation for Menu-Anchor
                                    setAnchorEl(event.currentTarget);
                                }}
                                sx={{
                                    '&:hover': { cursor: 'pointer' }
                                }}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                ))
            }
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
                <MenuItem 
                    onClick={() => {
                        setAnchorEl(null);
                        // High-order components are being 'informed' about the deletion
                        setSessionData({ ...sessionData, disableSaveGeolocationChangesButton: false});
                        // When a geolocation is deleted, re-map through the changed geolocations array and rerender
                        setGeolocations(geolocations.filter(geo => geo.name !== geolocation.name));
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>
            <LocationDialog
                geolocation={geolocation}
                geolocations={geolocations}
                dialogProps={{
                    title: 'Edit location',
                    open: open,
                    onClose: setOpen,
                    dialogUsage: 'edit'
                }}
            />
        </Box>
    )
}

/**
 * Save corrected georeferences in backend for specific provider
 */
export async function processFeedback(feedback) {
    let
        config = {
            baseURL: "http://localhost:8000/api",
            headers: {
                "Content-Type": "application/json"
            }
        },
        response = await axios.post(
            "/feedback",
            feedback,
            config
        );

    return response.data;
}