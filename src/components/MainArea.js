import Mapping from './Mapping/Mapping';
import { Box, Grid } from '@mui/material';
import { Item } from './customComponents';
import { useEffect, useState } from 'react';
import { useSession } from './SessionProvider';
import Geolocation from './Geolocation/Geolocation';
import FileExplorer from './FileExplorer/FileExplorer';
import { TextContent } from './TextContent/TextContent';
import { restructureLocationAttribute, structureLocationAttribute } from '../utils/jsonFunctions';

export default function MainArea() {
    const 
        // eslint-disable-next-line no-unused-vars
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
        setTextContent(currentData?.text);
        setGeolocations(structureLocationAttribute(currentData?.locations));
    }, [currentData]);
    
    // When the attribute "updatedGeolocations" changes (e.g. Deletion of a location), the MainArea should be rerendered
    useEffect(() => setGeolocations(sessionData?.updatedGeolocations), [sessionData?.updatedGeolocations]);

    return (
        <Box component="main"
            sx={{
                minWidth: '50rem'
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
                        minWidth: '16rem' // Content should'nt be crushed when window is being reduced in size
                    }}
                >
                    <Item
                        children={
                            <FileExplorer 
                                handleFileItemClick={(jsonData, key) => {
                                    setCurrentData(jsonData);
                                    setSessionData({ ...sessionData, fileData: jsonData, fileIndex: key });
                                }}
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
                        wrap='nowrap'
                        height={'100%'}
                        direction="column"
                    >
                        {/* TextContent */}
                        <Grid item>
                            <Item
                                children={
                                    <TextContent
                                        textContent ={textContent }
                                        geolocations={geolocations}
                                    />
                                }
                            />
                        </Grid>
                        {/* Mapping */}
                        <Grid item height>
                            <Item
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
                                handleSaveButtonClick={() => {
                                    setSessionData({...sessionData, newFileData: { text: textContent, locations: restructureLocationAttribute(geolocations), key: sessionData?.fileIndex }})
                                }}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </Box>
    )
 }