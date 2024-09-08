/** The main text content area */

import './TextContent.css'
import { pipe } from '../../utils/utilFunctions'
import { SaveButton } from '../customComponents'
import { Box, Button, Grid } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { SelectableGroup } from "react-selectable-fast"
import LocationDialog from '../Dialogs/LocationDialog'
import GeoparseDialog from '../Dialogs/GeoparseDialog'
import { highlightDetectedLocations, geoparseTextContent } from "./TextContentFunctions"

export function TextContent({ provider, textContent, geolocations, setGeolocations }) {
    const 
        // eslint-disable-next-line no-unused-vars
        refSelectableGroup = useRef(null),
        // Open-States for dialogs
        [openLocationDialog, setOpenLocationDialog] = useState(false),
        [openGeoparseDialog, setOpenGeoparseDialog] = useState(false),
        // Selected entities in text content
        [selectedItems, setSelectedItems] = useState([]),
        // Disable 'Add location' and 'Geoparse' button
        [disableButton, setDisableButton] = useState(true),
        [disableGeoparseButton, setDisableGeoparseButton] = useState(false),
        // The georeferences from the geoparsed text content and the new geolocation
        [detectedGeoreferences, setDetectedGeoreferences] = useState(),
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
        setDisableGeoparseButton(false);
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

                {/* Geoparse button */}
                <Grid item xs={'auto'}>
                    <Button
                        disabled={disableGeoparseButton}
                        variant='contained'
                        sx={{ fontWeight: 'bold' }}
                        onClick={() => {
                            setDisableGeoparseButton(true);
                            geoparseTextContent(provider, textContent)
                                .then(data => {
                                    setDetectedGeoreferences(data);
                                    setOpenGeoparseDialog(true);
                                })
                                .catch(error => {
                                    setDisableGeoparseButton(false);
                                    alert(error?.response.data?.detail)
                                })
                        }}
                    >
                        Geoparse
                    </Button>
                </Grid>

                {/* Add location button */}
                <Grid item xs={'auto'}>
                    <SaveButton
                        variant='contained'
                        disabled={disableButton}
                        onClick={() => {
                            setGeolocation({...geolocation, name: selectedItems.join(' ')});
                            refSelectableGroup.current.clearSelection();
                            setOpenLocationDialog(true);
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
                    open: openLocationDialog,
                    onClose: setOpenLocationDialog,
                    dialogUsage: 'add'
                }}
            />

            <GeoparseDialog
                georeferences={detectedGeoreferences}
                setGeolocations={setGeolocations}
                dialogProps={{
                    title: 'Detected Georeferences',
                    open: openGeoparseDialog,
                    onClose: () => {
                        setDetectedGeoreferences(null);
                        setOpenGeoparseDialog(false);
                    }
                }}         
            />               
        </Box>
    )
}