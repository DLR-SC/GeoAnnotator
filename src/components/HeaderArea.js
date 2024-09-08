import './Dialogs/Dialog.css';
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Toolbar,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export default function HeaderArea() {
  const
    navigate = useNavigate(), location = useLocation(),
    navItems = [{ label: 'Main', path: '/main' }, { label: 'Provider', path: '/provider' }],
    [selectedItem, setSelectedItem] = useState();

  // When the GeoAnnotator is started, check on which page it starts and highlight the path
  useEffect(() => setSelectedItem(location.pathname), [])

  return (
    <Box sx={{ display: 'flex', minWidth: '50rem' }}>
      <CssBaseline enableColorScheme />
      <AppBar component="nav" 
        className="App-Bar"
        sx={{ backgroundColor: '#2587be' }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: '1',
              mr: 2
            }}
          >
            GeoAnnotator
          </Typography>
          <Divider />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {
            navItems.map((item) => (
              <Button 
                key={item.label} 
                sx={{
                  m: 1,
                  color: selectedItem === item.path ? '#2587be' : '#fff', 
                  backgroundColor: selectedItem === item.path ? '#fff' : '#2587be',
                  '&:hover': {
                    backgroundColor: selectedItem === item.path ? 'lightgrey' : 'transparent',
                  }
                }}
                onClick={() => {
                  navigate(item.path);
                  setSelectedItem(item.path);
                }}

              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}