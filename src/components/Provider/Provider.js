import React, { useEffect, useState } from 'react';
import { 
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
import { Numbers } from '@mui/icons-material';
import ProvidersConfig from './ProvidersConfig';
import { countAnnotatedData } from './ProviderFunctions';

/**
 * Provider to manage LLMs
 */
export default function Provider(props) {
    const 
        { 
            provider, setProvider,
            providers, setProviders
        } = props,
        [datacount, setDatacount] = useState(0);

    // Count annotated data with chosen provider
    useEffect(() => {
        countAnnotatedData(provider?.instance_name)
            .then(count => setDatacount(count))
            .catch(error => alert(error))
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
                        <ListItem>
                            {/* Provider selection */}
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="provider-select-label">Provider</InputLabel>
                                <Select
                                    disabled={providers?.length === 0 || providers === undefined}
                                    label="Provider"
                                    labelId="provider-select-label"
                                    value={provider?.instance_name ?? ''}
                                    onChange={(event) => setProvider(providers.find((p) => p.instance_name === event.target.value))}
                                    fullWidth
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
                        </ListItem>
                        {/* Current amount of annotated datasets */}
                        <ListItem
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-end'
                            }}
                        >
                            <TextField
                                disabled
                                size='small'
                                label="Number"
                                value={datacount}
                                helperText={"Current amount of annotated data with chosen provider"}
                                InputProps={{
                                    startAdornment: <Numbers style={{ marginRight: 8 }} />,
                                }}
                            />
                        </ListItem>
                    </List>
                </Paper>
            </Grid>
        </Grid>
    )
}
