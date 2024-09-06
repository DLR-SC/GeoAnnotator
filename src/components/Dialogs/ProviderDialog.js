import './Dialog.css';
import React, { useEffect, useState } from 'react';
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
  Box,
  CircularProgress
} from '@mui/material';
import { 
  VpnKey, 
  Computer, 
  Refresh, 
  AddCircle 
} from '@mui/icons-material';

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
    [isApiKeyValid, setIsApiKeyValid] = useState(true),

    [hostserver, setHostserver] = useState(''),
    [isURLValid, setIsURLValid] = useState(true),

    [model, setModel] = useState(),
    [models, setModels] = useState(),
    [loading, setLoading] = useState(false),

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
            {/* Auswahl einer Option */}
            <ListItem>
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

            {/* API Key  */}
            <ListItem>
              <TextField
                disabled={selectedOption !== 'openai'}
                required={selectedOption === 'openai'}
                error={!isApiKeyValid}
                label="API Key"
                defaultValue={apiKey}
                onBlur={event => setApiKey(event.target.value)}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: <VpnKey style={{ marginRight: 8 }} />,
                }}
              />
            </ListItem>

            {/* Hostserver */}
            <ListItem>
              <TextField
                disabled={selectedOption !== 'selfhosted'}
                required={selectedOption === 'selfhosted'}
                error={!isURLValid}
                label="Hostserver-URL"
                defaultValue={hostserver}
                onBlur={event => {
                  let url = event.target.value
                  try {
                    new URL(url);
                    setIsURLValid(true);
                  } catch(_) {
                    setIsURLValid(false);
                  }
                  setHostserver(url);
                }}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: <Computer style={{ marginRight: 8 }} />,
                }}
              />
            </ListItem>

            {/* Choosing a model when OpenAI is chosen */}
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
                  startIcon={
                    loading ? (
                    <CircularProgress
                      size={24}
                      style={{
                        color: 'white',
                        position: 'relative',
                        top: '50%',
                        left: '50%',
                        marginTop: -12,
                        marginLeft: -12,
                      }}
                    />) : <Refresh />
                  }
                  sx={{ mr: 2, height: 40 }}
                  onClick={async () => {
                    setLoading(true); 
                    try {
                      setModels(await getOpenAIModels(apiKey));
                      setIsApiKeyValid(true);
                    } catch (error) {
                      setIsApiKeyValid(false);
                      alert(error.response.data.error.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {!loading ? 'Load' : null}
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

            {/* Instance name for provider */}
            <ListItem>
              <TextField
                required
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

            {/* Add button to save provider */}
            <ListItem>
              <SaveButton
                variant='contained'
                disabled={
                  (
                    selectedOption === 'openai' ? apiKey.length === 0 || model.length === 0
                  : selectedOption === 'selfhosted' ? hostserver.length === 0 || !isURLValid
                  : true
                  ) 
                  || instanceName.length === 0
                }
                onClick={() => null}
              >
                Add
              </SaveButton>
            </ListItem>
          </>
        }
      />
    </>
  )
}