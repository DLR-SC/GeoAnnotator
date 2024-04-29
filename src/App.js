import './App.css';
import L from 'leaflet';
import { Toolbar } from '@mui/material';
import MainArea from './components/MainArea';
import DrawerAppBar from './components/AppBar';
import { SessionProvider } from './components/SessionProvider';

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
          <DrawerAppBar />
          <Toolbar />
          <MainArea />
        </>
      }
    />
  );
}

export default App;