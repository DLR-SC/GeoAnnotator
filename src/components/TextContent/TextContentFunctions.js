import React from 'react';
import { Typography } from '@mui/material';

/**
 * 
 * @param {string} textContent 
 * @param {{placename: string, position: [float, float]}[]} locations 
 */
export function highlightDetectedLocations(textContent, geolocations) {
    return (textContent && geolocations ? highlightText(textContent, getPlacenamesOfGeolocations(geolocations)) : null)
}

/**
 * Split and hightlight the locations in text
 * @param {string} text 
 * @param {string[]} wordsToHighlight 
 */
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

/**
 * @param {{name: string, position: [float, float]}} geolocations 
 * @returns {string[]}
 */
function getPlacenamesOfGeolocations(geolocations) {
    let placenames = []    
    for(let geolocation of geolocations) {
        placenames.push(geolocation.name)
    }
    return placenames;
}