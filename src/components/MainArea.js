/** Main content area of the page - grid with 4 cells */

import Mapping from './Mapping/Mapping';
import { Box, Grid } from '@mui/material';
import { Item } from './customComponents';
import { useSession } from './SessionProvider';
import Geolocation from './Geolocation/Geolocation';
import FileExplorer from './FileExplorer/FileExplorer';
import { TextContent } from './TextContent/TextContent';
import { restructureLocationAttribute } from '../utils/jsonFunctions';
import { useEffect } from 'react';

export default function MainArea({ dataProps }) {
    const 
        {
            provider,
            fileDataset,        setFileDataset,
            /*currentData,*/    setCurrentData,
            textContent,        /*setTextContent,*/
            geolocations,       setGeolocations
        } = dataProps,
        { sessionData, setSessionData } = useSession();
    
    // Rerender Geolocation list, when changes are made
    useEffect(() => {if(sessionData?.updatedGeolocations) setGeolocations(sessionData?.updatedGeolocations)}, [sessionData?.updatedGeolocations]);

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
                        minWidth: '18rem' // Content should not be crushed when window is being reduced in size
                    }}
                >
                    <Item
                        children={
                            <FileExplorer 
                                handleFileItemClick={(jsonData, key) => {
                                    setCurrentData(jsonData);
                                    setSessionData({ ...sessionData, fileData: jsonData, fileIndex: key });
                                }}
                                dataProps={{
                                    fileDataset:    fileDataset,
                                    setFileDataset: setFileDataset
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
                                        provider        ={provider      }
                                        textContent     ={textContent   }
                                        geolocations    ={geolocations  }
                                        setGeolocations ={setGeolocations}
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
                                handleSaveButtonClick={() => 
                                    setSessionData({
                                        ...sessionData, 
                                        newFileData: { text: textContent, locations: restructureLocationAttribute(geolocations), key: sessionData?.fileIndex },
                                        disableSaveGeolocationChangesButton: true                                        
                                    })
                                }
                            />
                        }
                    />
                </Grid>
            </Grid>
        </Box>
    )
 }