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
    TextField,
} from '@mui/material';
import { CheckCircle, Cancel, Numbers } from '@mui/icons-material';
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
        countAnnotatedData(provider?.instance_name)
            .then(count => setDatacount(count))
            .catch(error => alert(error))

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
                        Provider Settings
                    </Typography>
                    <List>
                        <ListItem
                            sx={{
                                display: 'flex',
                                flexWrap: 'nowrap',
                                alignItems: 'baseline'
                            }}
                        >
                            {/* Provider selection */}
                            <FormControl 
                                margin="normal"
                                sx={{
                                    flexBasis: '50%',
                                    mr: 2
                                }}
                            >
                                <InputLabel id="provider-select-label">Provider</InputLabel>
                                <Select
                                    disabled={providers?.length === 0 || providers === undefined}
                                    label="Provider"
                                    labelId="provider-select-label"
                                    value={provider?.instance_name ?? ''}
                                    onChange={(event) => setProvider(providers.find((p) => p.instance_name === event.target.value))}
                                >
                                    {
                                        providers?.map((provider, index) => (
                                            <MenuItem key={index} value={provider.instance_name}>
                                                {provider.instance_name}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                                <FormHelperText>Select a provider</FormHelperText>
                            </FormControl>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    flexBasis: '50%'
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
                        {/* Current amount of annotated datasets */}
                        <ListItem>
                            <TextField
                                disabled
                                size='small'
                                label="Number"
                                value={datacount}
                                helperText={"Current amount of annotated data with selected provider"}
                                InputProps={{
                                    startAdornment: <Numbers style={{ marginRight: 8 }} />,
                                }}
                                sx={{
                                    flexBasis: '25%'
                                }}
                            />
                        </ListItem>
                    </List>
                </Paper>
            </Grid>
        </Grid>
    )
}
