import React from 'react';
import { Typography } from '@mui/material';

/**
 * 
 * @param {{text: string, source: string, locations: {location: float[]}}} data 
 */
export function highlightDetectedLocations(data) {
    return (
        data ? highlightText(data.text, Object.keys(data.locations)) : null
    )
}

// Function to split and highlight specific words
function highlightText (text, wordsToHighlight) {
    const
        regex = new RegExp(`(${wordsToHighlight.join('|')})`, 'gi'),
        parts = text.split(regex);
  
    return (
        parts.map((part, index) =>
            wordsToHighlight.includes(part) ? (
                <Typography component='span' key={index} sx={{ backgroundColor: '#2587be', color: 'white', padding: 0.5, borderRadius: 3 }}>
                    {part}
                </Typography>
            ) : (
                <Typography component='span' key={index} children={part} />
            )
        )
    )
  };