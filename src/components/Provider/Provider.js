import React, { useState } from 'react';
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
export default function Provider() {
  const
    // Access to global data
    { sessionData, setSessionData } = useSession(),
    [selectedLLM, setSelectedLLM] = useState(),
    llmOptions = [
        // { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
        // { value: 'llama-3.1-8B', label: 'LLaMA 3.1 8B' },
        // { value: 'self-hosted', label: 'Self-hosted' }
      ];

  return (
    <Grid 
        container
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        <Grid item>
            <ProvidersConfig />
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
                            <InputLabel id="llm-select-label">Wähle einen Provider</InputLabel>
                            <Select
                                labelId="llm-select-label"
                                label="LLM"
                                value={selectedLLM}
                                onChange={(event) => setSelectedLLM(event.target.value)}
                                fullWidth
                            >
                                {
                                    llmOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
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
