/** Main content area of the page - grid with 4 cells */

import Mapping from './Mapping/Mapping';
import { Box, Grid } from '@mui/material';
import { Item } from '../../components/customComponents';
import { useSession } from '../../components/SessionProvider';
import Geolocation from './Geolocation/Geolocation';
import FileExplorer from './FileExplorer/FileExplorer';
import { TextContent } from './TextContent/TextContent';
import { restructureLocationAttribute } from '../../utils/jsonFunctions';
import { processFeedback } from './Geolocation/GeolocationFunctions';

export default function MainArea(props) {
    const 
        {
            provider,
            fileDataset,            setFileDataset,
            /*currentData,*/        setCurrentData,
            textContent,            /*setTextContent,*/
            geolocations,           setGeolocations,
            detectedGeoreferences,   setDetectedGeoreferences
        } = props,
        { sessionData, setSessionData } = useSession();
    
    return (
        <Box component="main"
            sx={{
                minWidth: 'fit-content'
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
                        minWidth: 'fit-content' // Content should not be crushed when window is being reduced in size
                    }}
                >
                    <Item
                        children={
                            <FileExplorer 
                                handleFileItemClick={(jsonData, index) => {
                                    setCurrentData(jsonData);
                                    setSessionData({ ...sessionData, fileData: jsonData, fileIndex: index });
                                }}
                                dataProps={{
                                    fileDataset:    fileDataset,
                                    setFileDataset: setFileDataset,
                                    setCurrentData: setCurrentData,
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
                                        provider={provider}
                                        textContent={textContent}
                                        geolocations={geolocations}
                                        setGeolocations={setGeolocations}
                                        detectedGeoreferences={detectedGeoreferences}
                                        setDetectedGeoreferences={setDetectedGeoreferences}
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
                                setGeolocations={setGeolocations}
                                handleSaveButtonClick={() => {
                                    setSessionData({
                                        ...sessionData, 
                                        newFileData: { text: textContent, locations: restructureLocationAttribute(geolocations), id: sessionData?.fileIndex },
                                        disableSaveGeolocationChangesButton: true                                    
                                    });
                                
                                    if(detectedGeoreferences)
                                        processFeedback({ text: textContent, predictions: detectedGeoreferences, corrections: geolocations, provider: provider })
                                            .then(message => console.log(message))
                                            .catch(error => alert(error));
                                }}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </Box>
    )
 }