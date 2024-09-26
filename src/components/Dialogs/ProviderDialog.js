import './Dialog.css';
import React, { useEffect, useState } from 'react';
import { SaveButton } from '../customComponents';
import { DialogContentArea } from './DialogFunctions';
import { getOpenAIModels, getSelfhostedModels, saveProviderData } from '../Provider/ProviderFunctions';
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
  AddCircle, 
  TuneTwoTone
} from '@mui/icons-material';

/**
 * Dialog for adding or editing providers
 * @returns {React.JSX.Element}
 */
export default function ProviderDialog({ dialogProps }) {
  const
    provider = dialogProps.provider,

    [selectedOption, setSelectedOption] = useState(''),

    [apiKey, setApiKey] = useState(''),
    [isApiKeyValid, setIsApiKeyValid] = useState(true),

    [hostserver, setHostserver] = useState(''),
    [isURLValid, setIsURLValid] = useState(true),

    [model, setModel] = useState(),
    [models, setModels] = useState(),
    [loading, setLoading] = useState(false),

    [instanceName, setInstanceName] = useState(),
    
    [threshold, setThreshold] = useState(),
    [isThresholdValid, setIsThresholdValid] = useState(true),

    options = [ 
      { label: 'OPEN_AI', value: 'openai' },
      { label: 'SELF_HOSTED', value: 'selfhosted' },
    ],
    // Reset states
    resetStates = () => {
      setApiKey('');
      setIsApiKeyValid(true);
      
      setHostserver('');
      setIsURLValid(true);

      setModel('');
      setModels();

      setInstanceName('');

      setThreshold();
      setIsThresholdValid(true);
    },
    // Reset properties, when dialog is closed
    resetProps = () => {
      resetStates();
      setSelectedOption('');
      dialogProps.onClose();
    };

  useEffect(() => {
    if(provider) {
      setSelectedOption(provider?.option);
      setApiKey(provider?.data?.api_key ?? '');
      setHostserver(provider?.data?.hostserver_url ?? '');
      setModel(provider?.data?.model);
      setInstanceName(provider?.instance_name);
      setThreshold(provider?.data?.threshold_retrain_job);
    }
  }, [provider])

  return (
    <>
      <DialogContentArea
        title={dialogProps.usage + ' provider'}
        open={dialogProps.open}
        onClose={resetProps}
        fullWidth={true}
        backdropIntensity={0.4}
        children={
          <>
            {/* Auswahl einer Option */}
            <ListItem>
                <FormControl fullWidth margin="dense">
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
                fullWidth
                defaultValue={apiKey}
                onBlur={event => setApiKey(event.target.value)}
                margin='normal'
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
                helperText="Hint: The URL should support the endpoints '/models' and '/chat/completions'"
                fullWidth
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
                InputProps={{
                  startAdornment: <Computer style={{ marginRight: 8 }} />,
                }}
                sx={{
                  mt: 1, mb: 0
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
                    value={model}
                    onChange={event => setModel(event.target.value)}
                  >
                    {
                      models?.map(model => (
                          <MenuItem key={model.id} value={model.id}>
                              {model.id}
                          </MenuItem>
                      ))
                    }
                    { // MenuItem of provided Model
                      model && models === undefined ? 
                      <MenuItem key={model} value={model}>
                          {model}
                      </MenuItem> : null 
                    }
                  </Select>
                </FormControl>
              </Box>
            </ListItem>

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
                  {/* Instance name for provider */}
                  <TextField
                    required
                    fullWidth
                    sx={{ mr: 2 }}
                    label="Instance Name"
                    defaultValue={instanceName}
                    onBlur={event => setInstanceName(event.target.value.trim())}
                    InputProps={{
                      startAdornment: <AddCircle style={{ marginRight: 8 }} />,
                    }}
                  />

                  {/* Threshold for Retrain-job of provider */}
                  <TextField
                    required
                    fullWidth
                    label="Treshold for Retrain-Job"
                    placeholder="> 100 recommended"
                    defaultValue={threshold}
                    error={!isThresholdValid}
                    onBlur={event => {
                      let value = event.target.value
                      if(!isNaN(value) && value.trim() !== '') {
                        setIsThresholdValid(true)
                        setThreshold(Number(event.target.value))
                      }
                      else {
                        setIsThresholdValid(false) 
                        setThreshold()
                      }
                    }}
                    InputProps={{
                      startAdornment: <TuneTwoTone style={{ marginRight: 8 }} />,
                    }}
                  />
                </ Box>
            </ListItem>

            {/* Add button to save provider */}
            <ListItem
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'space-between'
              }}
            >
              <SaveButton
                variant='contained'
                disabled={
                  (
                    selectedOption === 'openai' ? apiKey.length === 0 || !isApiKeyValid
                  : selectedOption === 'selfhosted' ? hostserver.length === 0 || !isURLValid
                  : true
                  )
                  || model.length === 0
                  || instanceName.length === 0
                  || threshold === undefined
                }
                onClick={() => 
                  saveProviderData(
                    {
                      "option": selectedOption,
                      "instance_name": instanceName,
                      "temperature": 0,
                      "data": 
                        selectedOption === 'openai' ? {
                          "api_key": apiKey,
                          "model": model,
                          "threshold_retrain_job": threshold
                        } :
                        selectedOption === 'selfhosted' ? {
                          "hostserver_url": hostserver,
                          "model": model,
                          "threshold_retrain_job": threshold
                        } : undefined
                    },
                    dialogProps.usage
                  )
                    .then(() => resetProps())
                    .catch(error => alert(error.response?.data.detail))
                }
              >
                {dialogProps.usage}
              </SaveButton>
              <Button
                variant='outlined'
                onClick={resetProps}
              >
                Close
              </Button>
            </ListItem>
          </>
        }
      />
    </>
  )
}