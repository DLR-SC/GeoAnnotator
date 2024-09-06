import React, { useState } from 'react';
import ProviderDialog from '../Dialogs/ProviderDialog';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ProvidersConfig() {
  // Beispielhafte Daten (kann später durch dynamische Daten ersetzt werden)
  const
    [openProviderDialog, setOpenProviderDialog] = useState(false), 
    providers = [];

  return (
    <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
      <Accordion /*defaultExpanded*/>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px' }}>🛠️</span> Configure Providers
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h5" gutterBottom>
            Configured Providers
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Instance Name</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {providers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No providers configured yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  providers.map((provider, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{provider.instanceName}</TableCell>
                      <TableCell>{provider.provider}</TableCell>
                      <TableCell>{provider.model}</TableCell>
                      <TableCell>
                        {/* Beispiel-IconButton für Aktionen */}
                        <IconButton color="primary">✏️</IconButton>
                        <IconButton color="secondary">🗑️</IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            style={{ marginTop: '20px' }}
            onClick={() => setOpenProviderDialog(true)}
          >
            Add Provider
          </Button>
          <ProviderDialog 
            dialogProps={{
              title: 'Add provider',
              open: openProviderDialog,
              onClose: setOpenProviderDialog
            }}
          />
        </AccordionDetails>
      </Accordion>
    </Paper>
  )
}