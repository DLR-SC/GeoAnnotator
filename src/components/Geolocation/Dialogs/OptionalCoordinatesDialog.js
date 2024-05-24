import { List, ListItem, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { DialogContentArea } from "./DialogFunctions";
import { PlaceTwoTone } from "@mui/icons-material";
import { useSession } from "../../SessionProvider";

export default function OptionalCoordinatesDialog(props) {
    const 
        {
            open,
            onClose,
            setCoordinate,
            optionalCoordinates=[],
        } = props,
        { sessionData, setSessionData } = useSession();

    return (
        <DialogContentArea
            title={'Optional coordinates'}
            open={open}
            onClose={onClose}
            backdropIntensity={0}
        >
            <List 
                disablePadding
                className="OptionalCoordinatesDialog-List"
            >
                {
                    optionalCoordinates.map((coordinates, index) => (
                        <ListItem 
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                            <ListItemIcon children={<PlaceTwoTone />}/>
                            <ListItemText 
                                primary={
                                    (coordinates.continent  ? `${coordinates.continent}, `  : '')
                                    +
                                    (coordinates.country    ? `${coordinates.country}, `  : '') 
                                    +
                                    (coordinates.state      ? `${coordinates.state  }, `  : '')
                                    +
                                    (coordinates.name       ? `${coordinates.name   }, `  : '')
                                    +
                                    `(${coordinates.position})`
                                }
                            />
                            <ListItemSecondaryAction>
                                <ListItemButton
                                    onClick={() => {
                                        let coordinate = JSON.parse(`[${coordinates.position}]`);
                                        setCoordinate({ lat: coordinate[0], long: coordinate[1] });
                                        setSessionData({...sessionData, selectedOptionalCoordinate: coordinate });
                                        onClose();
                                    }}
                                >
                                    +
                                </ListItemButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))
                }
            </List>
        </DialogContentArea>
    )
}