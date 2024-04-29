import { 
    useState
} from 'react';
import { 
    Box, 
    Grid
} from '@mui/material';
import {
    Item
} from './customComponents';
import Mapping from './Mapping/Mapping';
import Geolocation from './Geolocation/Geolocation';
import FileExplorer from './FileExplorer/FileExplorer';
import { TextContent } from './TextContent/TextContent';

export default function MainArea() {
    const 
        [currentData, setCurrentData] = useState(),
        // Geolocations of currentData
        geolocations = currentData ? Object.entries(currentData.locations).map(([placename, [lat, long]]) => ({
            position: [lat, long],
            name: placename,
        })) : undefined;

    return (
        <Box component="main"
            sx={{
                minWidth: '100vh'
            }}
        >
            <Grid container 
                spacing={1} 
                columns={12} 
                wrap='nowrap'
                sx={{ 
                    padding: 2
                }}
            >
                {/* Left wing - FileExplorer */}
                <Grid item xs={2}
                    sx={{
                        minWidth: '15rem',
                    }}
                >
                    <Item
                        children={
                            <FileExplorer 
                                handleFileItemClick={(jsonData) => setCurrentData(jsonData)}
                            />
                        }
                    />
                </Grid>
                {/* Center */}
                <Grid item xs={7}
                    sx={{
                        minWidth: '30rem'
                    }}
                >
                    <Grid 
                        container 
                        spacing={1} 
                        direction="column"
                    >
                        {/* Textcontent */}
                        <Grid item xs>
                            <Item
                                sx={{
                                    padding: 2,
                                }}
                                children={
                                    <TextContent
                                        data={currentData}
                                    />
                                }
                            />
                        </Grid>
                        {/* Mapping  */}
                        <Grid item xs>
                            <Item
                                sx={{
                                    padding: 1,
                                    height: '100%',
                                }}
                                children={
                                    <Mapping
                                        geolocations={geolocations}
                                    />
                                }
                            />
                        </Grid>
                    </Grid>
                </Grid>
                {/* Right wing - Locations */}
                <Grid item xs={3}
                    sx={{
                        minWidth: '22.5rem'
                    }}
                >
                    <Item
                        children={
                            <Geolocation
                                geolocations={geolocations}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </Box>
    )
 }