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
import { useNavigate } from 'react-router-dom';

export default function HeaderArea() {
  const
    navigate = useNavigate(),
    navItems = [{ label: 'Main', path: '/main' }, { label: 'Provider', path: '/provider' }],
    [selectedItem, setSelectedItem] = useState();

  // When the GeoAnnotator is started, navigate to main page and highlight menu button
  useEffect(() => {
    navigate('/main')
    setSelectedItem('/main')
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

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
                  setSelectedItem(item.path);
                  navigate(item.path);
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