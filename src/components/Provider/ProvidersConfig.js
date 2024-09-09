import React, { useState } from 'react';
import { deleteProvider, loadProviders } from './ProviderFunctions';
import ProviderDialog from '../Dialogs/ProviderDialog';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
  Paper,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ProvidersConfig({ providers, setProviders }) {
  const 
    [openProviderDialog, setOpenProviderDialog] = useState(false),
    handleLoadProvider = async () => {
      try {
        setProviders(await loadProviders())
      } catch (e) { alert(e) }
    };
      
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
                          <IconButton 
                            color="primary"
                            // onClick={() => 
                            //   deleteProvider(provider?.instance_name)
                            //     .then(async () => await handleLoadProvider())
                            //     .catch(e => alert(e))
                            // }
                          >✏️</IconButton>
                          <IconButton 
                            color="secondary"
                            onClick={() => 
                              deleteProvider(provider?.instance_name)
                                .then(async () => await handleLoadProvider())
                                .catch(e => alert(e.response?.data.detail))
                            }
                          >🗑️</IconButton>
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
              onClick={handleLoadProvider}
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