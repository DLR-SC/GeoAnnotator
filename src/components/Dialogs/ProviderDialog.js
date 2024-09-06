import './Dialog.css';
import React, { useState } from 'react';
import { useSession } from '../SessionProvider';
import { SaveButton } from '../customComponents';
import { DialogContentArea, getOpenAIModels } from './DialogFunctions';
import { 
  ListItem, 
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  Box
} from '@mui/material';
import { AccountBalance, VpnKey, Computer, ExpandMore, Refresh, AddCircle } from '@mui/icons-material';

/**
 * Dialog for adding or editing providers
 * @returns {React.JSX.Element}
 */
export default function ProviderDialog({ dialogProps }) {
  const
    // Access to global data
    { sessionData, setSessionData } = useSession(),

    [selectedOption, setSelectedOption] = useState(''),
    [apiKey, setApiKey] = useState(''),
    [hostserver, setHostserver] = useState(''),
    [model, setModel] = useState(),
    [models, setModels] = useState(),
    [instanceName, setInstanceName] = useState(),
    
    options = [ 
      { label: 'OPEN_AI', value: 'openai' },
      { label: 'SELF_HOSTED', value: 'selfhosted' },
    ],
    // Reset states
    resetStates = () => {
      setApiKey('');
      setHostserver('');
      setModel('');
      setModels();
      setInstanceName('');
    },
    // Reset properties, when dialog is closed
    resetProps = () => {
      setSelectedOption('');
      resetStates('');
      dialogProps.onClose(false);
    };

  return (
    <>
      <DialogContentArea
        title={dialogProps.title}
        open={dialogProps.open}
        onClose={resetProps}
        fullWidth={true}
        backdropIntensity={0.4}
        children={
          <>
            <ListItem>
                {/* Auswahl einer Option */}
                <FormControl fullWidth margin="normal">
                    <InputLabel id="option-select-label">Option</InputLabel>
                    <Select
                        fullWidth
                        label="Option"
                        labelId="option-select-label"
                        value={selectedOption}
                        onChange={event => {
                          resetStates();
                          setSelectedOption(event.target.value);
                        }}
                    >
                        {
                            options.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </ListItem>

            <ListItem>
              <TextField
                fullWidth
                margin="normal"
                label="API Key"
                defaultValue={apiKey}
                disabled={selectedOption !== 'openai'}
                onBlur={event => setApiKey(event.target.value)}
                InputProps={{
                  startAdornment: <VpnKey style={{ marginRight: 8 }} />,
                }}
              />
            </ListItem>

            <ListItem>
              <TextField
                disabled={selectedOption !== 'selfhosted'}
                label="Hostname"
                defaultValue={hostserver}
                onChange={event => setHostserver(event.target.value)}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: <Computer style={{ marginRight: 8 }} />,
                }}
              />
            </ListItem>

            <ListItem>
              <Box 
                sx={{ 
                  display: 'flex',
                  flexWrap: 'nowrap',
                  alignItems: 'center', 
                  flexGrow: 1 
                }}
              >
                <Button 
                  disabled={apiKey.length === 0}
                  variant="contained" 
                  startIcon={<Refresh />}
                  sx={{ mr: 2 }}
                  onClick={() => 
                    getOpenAIModels(apiKey)
                      .then(data => {
                        console.log(data)
                        setModels(data)
                      })
                      .catch(error => alert(error))
                  }
                >
                  Load
                </Button>
                <FormControl fullWidth margin="normal">
                  <InputLabel id='model-select-label'>Model</InputLabel>
                  <Select
                    disabled={selectedOption !== "openai"}
                    label='Model'
                    labelId='model-select-label'
                    defaultValue={model}
                    onChange={event => setModel(event.target.value)}
                  >
                    {
                      models?.map(model => (
                          <MenuItem key={model.id} value={model.id}>
                              {model.id}
                          </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Box>
            </ListItem>

            <ListItem>
              <TextField
                fullWidth
                label="Instance Name"
                defaultValue={instanceName}
                onBlur={event => setInstanceName(event.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: <AddCircle style={{ marginRight: 8 }} />,
                }}
              />
            </ListItem>
            <ListItem>
              <SaveButton>
                Add
              </SaveButton>
            </ListItem>
          </>
        }
        dialogActions={
          <>
          
          <Button onClick={() => null} color="primary" variant="contained">
            Add
          </Button>
          </>
        }
      />
    </>
  )
}