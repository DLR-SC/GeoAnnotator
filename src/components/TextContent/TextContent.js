import './TextContent.css'
import { Box } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { SelectableGroup } from "react-selectable-fast"
import { highlightDetectedLocations } from "./TextContentFunctions"
import { SaveButton } from '../customComponents'
import { pipe } from '../../utils/utilFunctions'

export function TextContent({ textContent, geolocations }) {
    const 
        // eslint-disable-next-line no-unused-vars
        [selectedItems, setSelectedItems] = useState([]),
        [disableButton, setDisableButton] = useState(true),
        refSelectableGroup = useRef(null),
        /* HandleFunctions */
        handleSelectionFinish = (selectedItems) => {
            let processOutput = pipe(
                items => items.filter(item => !item.props.props.isHighlighted),
                items => items.map(item => item.props.props.text)
            ), output = processOutput(selectedItems);
            setSelectedItems(output);
            setDisableButton(false);
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
                    resetOnStart
                    deselectOnEsc
                    onSelectionFinish={handleSelectionFinish}
                    style={{ display: 'flex', flexWrap: 'wrap' }}
                >
                    {highlightDetectedLocations(textContent, geolocations)}
                </SelectableGroup>
            </Box>
            {/* Add location button */}
            <SaveButton
                variant='contained'
                disabled={disableButton}
                onClick={() => console.log(selectedItems)}
            >
                Add new Location
            </SaveButton>

        </Box>
    )
}