import { Box } from "@mui/material"
import { highlightDetectedLocations } from "./TextContentFunctions"

export function TextContent({ textContent, geolocations }) {
    return (
        <Box 
            // noWrap
            variant='inherit'
            children={
                highlightDetectedLocations(textContent, geolocations)
            }
            sx={{
                overflowY: 'auto',
                height: '25vh',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: 1.5
            }}
        />
    )
}