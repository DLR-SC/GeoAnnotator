import './Dialog.css';
import React, { useState } from 'react';
import { SaveButton } from '../customComponents';
import { DialogContentArea, getOpenAIModels, getSelfhostedModels, saveProviderData } from './DialogFunctions';
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
    // { sessionData, setSessionData } = useSession(),

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
      resetStates();
      dialogProps.onClose();
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

            {/* Model */}
            <ListItem>
              <Box 
                sx={{
                  width: '100%',
                  height: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexWrap: 'nowrap',
                  alignItems: 'center', 
                  flexGrow: 1 
                }}
              >
                <Button 
                  disabled={
                    selectedOption === 'openai'     ? apiKey.length === 0 :
                    selectedOption === 'selfhosted' ? hostserver.length === 0 : true
                  }
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
                      setModels(selectedOption === 'openai' ? await getOpenAIModels(apiKey) : await getSelfhostedModels(hostserver));
                      if(selectedOption === 'openai') setIsApiKeyValid(true);
                    } catch (error) {
                      if(selectedOption === 'openai') setIsApiKeyValid(false);
                      alert(error.response?.data.error.message);
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
                onClick={() => 
                  saveProviderData(
                    {
                      "option": selectedOption,
                      "'instance_name": instanceName,
                      "data": selectedOption === 'openai' ? {
                        "api_key": apiKey,
                        "model": model
                      } : {
                        "hostserver_url": hostserver,
                        "model": model
                      }
                    }
                  )
                    .then(() => resetProps())
                    .catch(error => alert(error.response?.data.detail))
                }
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