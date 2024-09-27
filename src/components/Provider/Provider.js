import './Provider.css';
import React, { useEffect, useState } from 'react';
import { 
    Box,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List, 
    ListItem,
    MenuItem,
    Paper,
    Select,
    Typography,
    Tooltip,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import ProvidersConfig from './ProvidersConfig';
import { checkSelfhostedServerStatus, countAnnotatedData, checkModelStatus } from './ProviderFunctions';

/**
 * Provider to manage LLMs
 */
export default function Provider(props) {
    const 
        { 
            provider, setProvider,
            providers, setProviders
        } = props,
        [datacount, setDatacount] = useState(0),

        [serverStatus, setServerStatus] = useState(),
        renderServerStatus = () => {
            switch (serverStatus) {
                case 'offline':
                  return <Cancel sx={{ color: 'red', mr: 1 }} />;
                case 'online':
                  return <CheckCircle sx={{ color: 'green', mr: 1 }} />;
                default:
                  return null;
              }
        },

        [modelStatus, setModelStatus] = useState(),
        renderModelStatus = () => {
            switch (modelStatus) {
                case 'Model loaded':
                    return <CheckCircle sx={{ color: 'green', mr: 1 }} />;
                case 'Model not loaded':
                    return <Cancel sx={{ color: 'red', mr: 1 }} />;
                default:
                  return null;
              }
        };

    useEffect(() => {
        if(provider){
            // Annotated Datacount with selected provider
            countAnnotatedData(provider?.instance_name)
                .then(count => setDatacount(count))
                .catch(error => alert(error))
    
            // Server Status Check for selfhosted provider
            if(provider?.data?.hostserver_url) 
                checkSelfhostedServerStatus(provider?.data?.hostserver_url)
                    .then(async status => {
                        setServerStatus(status === 200 ? 'online' : 'offline');
                        setModelStatus(await checkModelStatus(provider));
                    })
                    .catch(() => {
                        setServerStatus('offline')
                        setModelStatus('Model not loaded')
                    })
            else {
                setServerStatus()
                setModelStatus()
            }
        }
    }, [provider])

    return (
        <Grid 
            container
            sx={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Grid item>
                <ProvidersConfig 
                    providers={providers}
                    setProviders={setProviders}
                />
            </Grid>
            <Grid item>
                <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
                    <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px' }}>⚙️</span>Provider Settings
                    </Typography>
                    <List className="provider-settings-list">
                        <ListItem>
                            {/* Provider selection */}
                            <FormControl 
                                margin="normal"
                                sx={{
                                    flexBasis: '50%'
                                }}
                            >
                                <InputLabel id="provider-select-label">Provider</InputLabel>
                                <Select
                                    disabled={providers?.length === 0 || providers === undefined}
                                    label="Provider"
                                    labelId="provider-select-label"
                                    value={provider?.instance_name ?? ''}
                                    onChange={event => setProvider(providers.find(p => p.instance_name === event.target.value))}
                                >
                                    {
                                        providers?.map((provider, index) => (
                                            <MenuItem key={index} value={provider.instance_name}>
                                                {provider.instance_name}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            {/* Server Status */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexBasis: '50%',
                                    justifyContent: 'space-around',
                                }}
                            >
                                <Typography 
                                    variant="overline"
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'nowrap',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    {renderServerStatus()} {serverStatus}
                                </Typography>
                                <Typography 
                                    variant="overline"
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'nowrap',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    {renderModelStatus()} {modelStatus}
                                </Typography>
                            </Box>
                        </ListItem>
                        <ListItem>
                            {/* Conversation style */}
                            <FormControl 
                                margin="normal"
                                sx={{
                                    flexBasis: '50%',
                                    mr: 2
                                }}
                            >
                                <InputLabel id="provider-select-label">Conversation style</InputLabel>
                                <Select
                                    value={provider?.temperature ?? ''}
                                    disabled={provider === undefined}
                                    label="Conversation style"
                                    labelId="provider-select-label"
                                    onChange={event => setProvider({ ...provider, temperature: event.target.value })}
                                >
                                    {
                                        ['Precise', 'Balanced', 'Creative'].map((style, index) => (
                                            <MenuItem key={index} value={index/2}>
                                                {style}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                                <FormHelperText>Creativity or predictability of the output <Tooltip title="'Precise' is the default value. It is recommended to either use 'Precise' or 'Balanced'. Either way, the outputs are deterministic and diverse. Selecting 'Creative' can cause issues and return non-sense (Only for experimental purposes).">ⓘ</Tooltip></FormHelperText>
                            </FormControl>
                            {/* Current amount of annotated datasets */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50%'
                                }}
                            >
                                <Typography
                                    component='p'
                                    sx={{
                                        display: 'flex',
                                        textAlign: 'right'
                                    }}
                                > 
                                    Amount of annotated data with provider: {datacount}
                                </Typography>
                            </Box>
                        </ListItem>
                    </List>
                </Paper>
            </Grid>
        </Grid>
    )
}
