import React, { useState, useEffect } from 'react';
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
    { providers, setProviders } = dataProps,
    { sessionData, setSessionData } = useSession();

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
                                value={sessionData?.provider?.instance_name}
                                onChange={(event) => setSessionData({ ...sessionData, provider: event.target.value })}
                                fullWidth
                            >
                                {
                                    providers?.map((provider) => (
                                        <MenuItem key={provider.instance_name} value={{provider: provider}}>
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
