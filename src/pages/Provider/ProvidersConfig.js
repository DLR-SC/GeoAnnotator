import React, { useState } from 'react';
import { deleteProvider, loadProviders } from './ProviderFunctions';
import ProviderDialog from '../../components/Dialogs/ProviderDialog';
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
  Tooltip,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ProvidersConfig({ providers, setProviders }) {
  const 
    [openProviderDialog, setOpenProviderDialog] = useState(false),
    [providerDialogData, setProviderDialogData] = useState(),
    handleLoadProvider = async () => {
      try {
        setProviders(await loadProviders())
      } catch (e) { alert(e?.response?.data?.detail) }
    };
      
  return (
    <Paper elevation={3} sx={{ m: '20px', p: '20px' }}>
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
                  <TableCell>Threshold for Retrain-Job</TableCell>
                  <TableCell>Actions <Tooltip title="Edit ✏️ or delete 🗑️ provider">ⓘ</Tooltip></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  providers ? (
                    providers?.map((provider, index) => (
                      <TableRow key={index}>
                        <TableCell>{index}</TableCell>
                        <TableCell>{provider?.instance_name}</TableCell>
                        <TableCell>{provider?.option}</TableCell>
                        <TableCell>{provider?.data.model}</TableCell>
                        <TableCell>{provider?.data.threshold_retrain_job}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton 
                              color="primary"
                              onClick={() => {
                                setProviderDialogData({ index: index, provider: provider, usage: 'Edit' });
                                setOpenProviderDialog(true);
                                
                              }}
                            >✏️</IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              color="secondary"
                              onClick={() => 
                                deleteProvider(index)
                                  .then(async () => await handleLoadProvider())
                                  .catch(e => alert(e))
                              }
                            >🗑️</IconButton>
                          </Tooltip>
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
              sx={{ mt: '20px' }}
              onClick={() => {
                setProviderDialogData({ provider: undefined, usage: 'Add' });
                setOpenProviderDialog(true);
              }}
            >
              Add Provider
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Refresh />}
              sx={{ mt: '20px' }}
              onClick={handleLoadProvider}
            >
              Load Provider
            </Button>
          </Box>
          <ProviderDialog 
            dialogProps={{
              open: openProviderDialog,
              onClose: async () => {
                try {
                  setProviders(await loadProviders());
                } catch(e) { console.log(e?.response?.data?.detail) }
                setOpenProviderDialog(false);
              },
              usage: providerDialogData?.usage,
              provider: providerDialogData?.provider
            }}
          />
        </AccordionDetails>
      </Accordion>
    </Paper>
  )
}