import { Box } from "@mui/material"
import { highlightDetectedLocations } from "./TextContentFunctions"

export function TextContent({ textContent, geolocations }) {
    return (
        <Box 
            variant='inherit'
            children={
                highlightDetectedLocations(textContent, geolocations)
            }
            sx={{
                padding: 1.5,
                height: '15rem',
                overflowY: 'auto',
                borderRadius: '0.5rem',
                backgroundColor: 'white'
            }}
        />
    )
}