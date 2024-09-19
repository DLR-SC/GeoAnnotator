/** The main text content area */

import './TextContent.css'
import { useEffect, useState } from "react"
import { SaveButton } from '../customComponents'
import LocationDialog from '../Dialogs/LocationDialog'
import GeoparseDialog from '../Dialogs/GeoparseDialog'
import { Box, Button, Grid, Typography } from "@mui/material"
import { highlightDetectedLocations, geoparseTextContent } from "./TextContentFunctions"

export function TextContent(props) {
    const
        {
            provider,
            textContent,
            geolocations,           setGeolocations,
            detectedGeoreferences,  setDetectedGeoreferences,
        } = props,


        // Open-States for dialogs
        [openLocationDialog, setOpenLocationDialog] = useState(false),
        [openGeoparseDialog, setOpenGeoparseDialog] = useState(false),

        // Selected entities in text content
        [selectedItems, setSelectedItems] = useState(null),
        clearSelection = () => {
            setSelectedItems(null);
            let selection = window.getSelection(); selection.removeAllRanges();
        },
        handleEscapeClick = (event) => { if(event.key === 'Escape') clearSelection() },

        // Disable 'Add location' button
        [disableAddLocationButton, setDisableAddLocationButton] = useState(true),
        [disableGeoparseButton, setDisableGeoparseButton] = useState(),

        [geolocation, setGeolocation] = useState({ name: undefined, position: [] });

    useEffect(() => {
        // Disable GeoparseButton when no provider is selected
        setDisableGeoparseButton(!provider)
        // Reset selected Items when new text content is loaded
        setSelectedItems(null)
    }, [textContent])

    useEffect(() => setDisableAddLocationButton(!selectedItems || selectedItems?.length < 1), [selectedItems])

    // Add event-listener for ESC-button and remove @ unrendering
    useEffect(() => { 
        document.addEventListener('keydown', handleEscapeClick);
        return () => { document.removeEventListener('keydown', handleEscapeClick) }
    }, [])

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'column',
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
                    backgroundColor: 'white',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start'
                }}
            >
                <Typography 
                    className='textcontentarea_textcontent'
                    onMouseUp={() => {
                        let selection_ = window.getSelection(), selection = selection_.toString().trim();
                        setSelectedItems(selection);
                    }}
                >
                    {highlightDetectedLocations(textContent, geolocations)}
                </Typography>
            </Box>

            {/* Selection */}
            <Box 
                variant='inherit'
                sx={{
                    padding: 1,
                    height: '5ch',
                    overflowX: 'auto',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'flex-start'
                }}
            >
                <Typography>
                    {selectedItems}
                </Typography>
            </Box>

            <Grid container spacing={1} className='grid-container-textcontent-buttons'>
                {/* Clear selection button */}
                <Grid item className='clearselection-button'>
                    <Button
                        disabled={!selectedItems}
                        variant='contained'
                        sx={{ fontWeight: 'bold' }}
                        onClick={clearSelection}
                    >
                        Clear selection
                    </Button>
                    <p>or press ESC</p>
                </Grid>

                {/* Add location button */}
                <Grid item className='addlocation-geoparse-buttons'>
                    <SaveButton
                        variant='contained'
                        disabled={disableAddLocationButton}
                        onClick={() => {
                            setGeolocation({...geolocation, name: selectedItems});
                            setOpenLocationDialog(true);
                        }}
                    >
                        Add location
                    </SaveButton>
                    {/* Geoparse button */}
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
                                    alert(error?.response?.data?.detail)
                                })
                        }}
                    >
                        Geoparse
                    </Button>
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
                dataProps={{
                    georeferences: detectedGeoreferences,
                    setDetectedGeoreferences: setDetectedGeoreferences,
                    setGeolocations: setGeolocations,
                }}
                dialogProps={{
                    title: 'Detected Georeferences',
                    open: openGeoparseDialog,
                    onClose: () => setOpenGeoparseDialog(false)
                }}         
            />               
        </Box>
    )
}