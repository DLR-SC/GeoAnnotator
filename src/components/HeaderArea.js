import './Dialogs/Dialog.css';
import React, { useState } from 'react';
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
    [openProviderDialog, setOpenProviderDialog] = useState(),
    navItems = [{ label: 'Main', path: '/' }, { label: 'Provider', path: '/provider' }];

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
            {navItems.map((item) => (
              <Button 
                key={item.label} 
                sx={{ color: '#fff' }}
                onClick={() => navigate(item.path)}
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