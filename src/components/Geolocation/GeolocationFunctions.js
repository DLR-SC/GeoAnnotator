import axios from 'axios';
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
import LocationDialog from '../Dialogs/LocationDialog'

/** 
 * Location list: Geolocation entries
 * @param {Object} param
 * @param {{ position: float[], name: string }[]} param.data
 */
export function GeolocationItems({ data }) {
    const 
        { sessionData, setSessionData } = useSession(),
        [open, setOpen] = useState(false),
        [anchorEl, setAnchorEl] = useState(null),
        [geolocation, setGeolocation] = useState(),
        [geolocations, setGeolocations] = useState(data);

    // When the geolocations are updated (Not necessarily a new json-file chosen), rerender the location list
    useEffect(() => setGeolocations(data), [data])

    return (
        <Box>
            {
                geolocations.map((geo, index) => (
                    <ListItem key={index}>
                        {/* Place-Icon */}
                        <ListItemIcon 
                            onClick={() => setSessionData({ ...sessionData, geolocation: geo })} // Exchange data with MapContainer
                            children={<Place sx={{ color: '#2587be', '&:hover': { cursor: 'pointer' } }} />} 
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
                                    setGeolocation(geo);
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
                        // When a geolocation is deleted, re-map through the changed geolocations array and rerender
                        setAnchorEl(null);
                        // High-order components are being 'informed' about the deletion
                        setSessionData({ 
                            ...sessionData, 
                            updatedGeolocations: geolocations.filter(geo => geo.name !== geolocation.name),
                            disableSaveGeolocationChangesButton: false
                        });
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