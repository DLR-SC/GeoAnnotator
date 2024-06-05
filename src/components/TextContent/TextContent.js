/** The main text content area */

import './TextContent.css'
import { pipe } from '../../utils/utilFunctions'
import { SaveButton } from '../customComponents'
import { Box, Button, Grid } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { SelectableGroup } from "react-selectable-fast"
import LocationDialog from '../Geolocation/Dialogs/LocationDialog'
import { highlightDetectedLocations } from "./TextContentFunctions"

export function TextContent({ textContent, geolocations }) {
    const 
        // eslint-disable-next-line no-unused-vars
        refSelectableGroup = useRef(null),
        [open, setOpen] = useState(false),
        [selectedItems, setSelectedItems] = useState([]),
        [disableButton, setDisableButton] = useState(true),
        [geolocation, setGeolocation] = useState({ name: undefined, position: [] }),
        handleSelectionFinish = (selectedItems) => {
            let processOutput = pipe(
                items => items.filter(item => !item.props.props.isHighlighted),
                items => items.map(item => item.props.props.text)
            ), output = processOutput(selectedItems);
            setSelectedItems(output);
            setDisableButton(output.length === 0);
        };

    // When another file is loaded, clear the selected items
    useEffect(() => { 
        if(refSelectableGroup.current) refSelectableGroup.current.clearSelection();
        setDisableButton(true);
    }, [geolocations])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap'
            }}
        >
            {/* Text area */}
            <Box 
                variant='inherit'
                sx={{
                    mb: 1,
                    padding: 1,
                    height: '15rem',
                    overflowY: 'auto',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white'
                }}
            >
                <SelectableGroup
                    ref={refSelectableGroup}
                    deselectOnEsc
                    enableDeselect
                    onSelectionFinish={handleSelectionFinish}
                    style={{ display: 'flex', flexWrap: 'wrap' }}
                >
                    {highlightDetectedLocations(textContent, geolocations)}
                </SelectableGroup>
            </Box>

            <Grid container spacing={1} className='grid-container-textcontent-buttons'>
                
                {/* Clear selection button */}
                <Grid item xs={'auto'}>
                    <Button
                        variant='contained'
                        disabled={disableButton}
                        sx={{ fontWeight: 'bold' }}
                        onClick={() => refSelectableGroup.current.clearSelection()}
                    >
                        Clear selection
                    </Button>
                </Grid>
                
                {/* Info-Text for clearing selection */}
                <Grid item xs sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <p>or press ESC</p>
                </Grid>

                {/* Add location button */}
                <Grid item xs={'auto'}>
                    <SaveButton
                        variant='contained'
                        disabled={disableButton}
                        onClick={() => {
                            setGeolocation({...geolocation, name: selectedItems.join(' ')});
                            refSelectableGroup.current.clearSelection();
                            setOpen(true);
                        }}
                    >
                        Add new location
                    </SaveButton>
                </Grid>

            </Grid>

            <LocationDialog
                geolocations={geolocations}
                geolocation={geolocation}
                dialogProps={{
                    title: 'Add new location',
                    open: open,
                    onClose: setOpen,
                    dialogUsage: 'add'
                }}
            />                
        </Box>
    )
}