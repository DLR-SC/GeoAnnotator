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
import LocationDialog from './Dialogs/LocationDialog'

/** 
 * Location list: Geolocation entries
 * @param {Object} param
 * @param {{ position: float[], name: string }[]} param.data
 * @param {Function} param.disableSaveChangesButton
 */
export function GeolocationItems({ data, disableSaveChangesButton }) {
    const 
        session = useSession(),
        [open, setOpen] = useState(false),
        [anchorEl, setAnchorEl] = useState(null),
        [geolocation, setGeolocation] = useState(),
        [geolocations, setGeolocations] = useState(data);

    // When the geolocations are updated (Not necessarily a new json-file chosen), rerender the location list
    useEffect(() => setGeolocations(data), [data])

    // When a new json-file is chosen, disable the save changes button
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => disableSaveChangesButton(true), [session.sessionData?.fileData])
    
    // When a new location is added, enable save changes button
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => disableSaveChangesButton(false), [session.sessionData?.updatedGeolocations])

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
                                onClick={(event) => {
                                    setGeolocation(geo);
                                    setAnchorEl(event.currentTarget);
                                }}
                                sx={{
                                    '&:hover': { cursor: 'pointer' }
                                }}
                            />
                            {/* Menu */}
                            {/* FIXME: Outsource the Menu, sothat performance gets better */}
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
                                    onClick={() =>{
                                        // When a geolocation is deleted, re-map through the changed geolocations array and rerender
                                        setAnchorEl(null);
                                        // High-order components are being 'informed' about the deletion
                                        session.setSessionData({ ...session.sessionData, updatedGeolocations: geolocations.filter((geo) => geo.name !== geolocation.name) })
                                }}>Delete</MenuItem>
                            </Menu>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))
            }
            <LocationDialog
                geolocation={geolocation}
                geolocations={geolocations}
                dialogProps={{
                    title: 'Edit location',
                    open: open,
                    onClose: setOpen,
                    dialogUsage: 'edit',
                    enableSaveChangesButton: () => disableSaveChangesButton(false)
                }}
            />
        </Box>
    )
}
