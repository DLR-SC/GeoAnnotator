import './App.css';
import L from 'leaflet';
import { Toolbar } from '@mui/material';
import MainArea from './components/MainArea';
import HeaderArea from './components/HeaderArea';
import Provider from './components/Provider/Provider';
import { SessionProvider } from './components/SessionProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Set correct URLs for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;  // Remove old icon paths

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


function App() {
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
              <Route path='/' element={<MainArea />} />
              <Route path='/provider' element={<Provider />} />
            </Routes>
          </Router>  
        </>
      }
    />
  );
}

export default App;