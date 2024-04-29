import { Box } from "@mui/material"
import { highlightDetectedLocations } from "./TextContentFunctions"

export function TextContent({ data }) {
    return (
        <Box 
            // noWrap
            variant='inherit'
            children={
                highlightDetectedLocations(data)
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