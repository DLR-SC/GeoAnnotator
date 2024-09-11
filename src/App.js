import './App.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { Toolbar } from '@mui/material';
import MainArea from './components/MainArea';
import HeaderArea from './components/HeaderArea';
import Provider from './components/Provider/Provider';
import { SessionProvider } from './components/SessionProvider';
import { structureLocationAttribute } from './utils/jsonFunctions';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Set correct URLs for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;  // Remove old icon paths

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function App() {
  const
    // Provider
    [provider, setProvider] = useState(), [providers, setProviders] = useState(),
    // Dataset from uploaded file
    [fileDataset, setFileDataset] = useState([]),
    // Data from json-file
    [currentData, setCurrentData] = useState(),
    // TextContent of currentData
    [textContent, setTextContent] = useState(),
    // Geolocations of currentData
    [geolocations, setGeolocations] = useState(),
    // Georeferences detected by the geoparser
    [detectedGeoreferences, setDetectedGeoreferences] = useState();
  
  /**  
   * Set data when new file is chosen
   * Hint: Attributes "text" and "locations" may vary due
   */
  useEffect(() => {
    setTextContent(currentData?.text);
    setGeolocations(structureLocationAttribute(currentData?.locations));
  }, [currentData]);


  return (
    <SessionProvider
      children={
        <>
          <Router>
            {/* AppBar */}
            <HeaderArea />
            <Toolbar />
            {/* Pages */}
            <Routes>
              <Route path='/main' element={
                  <MainArea 
                    provider={provider}
                    fileDataset={fileDataset}
                    setFileDataset={setFileDataset}
                    // currentData: currentData
                    setCurrentData={setCurrentData}
                    textContent={textContent}
                    // setTextContent: setTextContent
                    geolocations={geolocations}
                    setGeolocations={setGeolocations}
                    detectedGeoreferences={detectedGeoreferences}
                    setDetectedGeoreferences={setDetectedGeoreferences}
                  />
                } 
                replace
              />
              <Route path='/provider' element={
                <Provider 
                  provider={provider}
                  setProvider={setProvider}
                  providers={providers}
                  setProviders={setProviders}
                />
              } />
            </Routes>
          </Router>  
        </>
      }
    />
  );
}