import React, { useState } from 'react';
import ProviderDialog from '../Dialogs/ProviderDialog';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
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
import { loadProviders } from './ProviderFunctions';
import { Refresh } from '@mui/icons-material';

export default function ProvidersConfig({ providers, setProviders }) {
  const [openProviderDialog, setOpenProviderDialog] = useState(false);

  return (
    <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
      <Accordion defaultExpanded>
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
          <TableContainer >
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
                {
                  providers ? (
                    providers?.map((provider, index) => (
                      <TableRow key={index + 1}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{provider?.instance_name}</TableCell>
                        <TableCell>{provider?.option}</TableCell>
                        <TableCell>{provider?.data.model}</TableCell>
                        <TableCell>
                          <IconButton color="primary">✏️</IconButton>
                          <IconButton color="secondary">🗑️</IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No providers configured yet.
                      </TableCell>
                    </TableRow>
                  )
                }
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              style={{ marginTop: '20px' }}
              onClick={() => setOpenProviderDialog(true)}
            >
              Add Provider
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Refresh />}
              style={{ marginTop: '20px' }}
              onClick={() => 
                loadProviders()
                  .then(data => setProviders(data))
                  .catch(error => alert(error))
              }
            >
              Load Provider
            </Button>
          </Box>
          <ProviderDialog 
            dialogProps={{
              title: 'Add provider',
              open: openProviderDialog,
              onClose: async () => {
                try {
                  setProviders(await loadProviders());
                } catch(e) { alert(e) }

                setOpenProviderDialog(false);
              }
            }}
          />
        </AccordionDetails>
      </Accordion>
    </Paper>
  )
}