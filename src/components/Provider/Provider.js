import React from 'react';
import { useSession } from '../SessionProvider';
import { 
    List, 
    ListItem,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Grid,
    Typography
} from '@mui/material';
import ProvidersConfig from './ProvidersConfig';

/**
 * Provider to manage LLMs
 */
export default function Provider({ dataProps }) {
  const 
    { 
        provider, setProvider,
        providers, setProviders
    } = dataProps;

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
                    Select a provider
                </Typography>
                <List>
                    <ListItem>
                        {/* Auswahl des LLMs */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="provider-select-label">Provider</InputLabel>
                            <Select
                                label="Provider"
                                labelId="provider-select-label"
                                value={provider?.instance_name}
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
                        </FormControl>
                    </ListItem>
                </List>
            </Paper>
        </Grid>
    </Grid>
  )
}
