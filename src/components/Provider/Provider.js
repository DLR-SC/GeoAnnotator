import React from 'react';
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
} from '@mui/material';
import ProvidersConfig from './ProvidersConfig';

/**
 * Provider to manage LLMs
 */
export default function Provider(props) {
  const 
    { 
        provider, setProvider,
        providers, setProviders
    } = props;

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
                        {/* Auswahl des Providers */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="provider-select-label">Provider *</InputLabel>
                            <Select
                                label="Provider *"
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
                            <FormHelperText>Choose a provider</FormHelperText>
                        </FormControl>
                    </ListItem>
                </List>
            </Paper>
        </Grid>
    </Grid>
  )
}
