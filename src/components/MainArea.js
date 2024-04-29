import { 
    useEffect,
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
import { useSession } from './SessionProvider';
import Geolocation from './Geolocation/Geolocation';
import FileExplorer from './FileExplorer/FileExplorer';
import { TextContent } from './TextContent/TextContent';
import { structureLocationAttribute } from '../utils/jsonFunctions';

export default function MainArea() {
    const 
        { sessionData, setSessionData } = useSession(),
        // Data from json-file
        [currentData, setCurrentData] = useState(),
        // TextContent of currentData
        [textContent, setTextContent] = useState(),
        // Geolocations of currentData
        [geolocations, setGeolocations] = useState();

    /**  
     * When a new json-file is chosen, set the value and rerender MainArea
     * FIXME: Attributes "text" and "locations" may vary due to the reason, that it depends on the imported json-file
     */
    useEffect(() => {
        setTextContent(currentData?.text)
        setGeolocations(structureLocationAttribute(currentData?.locations))
    }, [currentData]);
    
    // When the attribute "updatedGeolocations" changes (e.g. Deletion of a location), the MainArea should be rerendered
    useEffect(() => setGeolocations(sessionData?.updatedGeolocations), [sessionData?.updatedGeolocations]);

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
                                        textContent ={textContent }
                                        geolocations={geolocations}
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