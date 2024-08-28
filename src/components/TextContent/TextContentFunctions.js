import React from 'react';
import { SelectableTextItem } from "../customComponents"

/**
 * Hightlight locations
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
        regexPattern = `${wordsToHighlight.length ? `(${wordsToHighlight.join('|')})|` : ''}[\\wäöüß']+|[.,!?;:()\\-"]`,
        regex = new RegExp(regexPattern, 'gi'),
        parts = text.match(regex);
    
    return (
        parts.map((part, index) =>
            wordsToHighlight.includes(part) ? 
                <SelectableTextItem key={index} props={{ text: part, isHighlighted: true }} />
            : 
                <SelectableTextItem key={index} props={{ text: part, isHighlighted: false}} />
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

/**
 * Geoparse given textcontent
 * @param {} textContent
 * @returns {}
 */
async function geoparseTextContent(textContent) {
    let 
    config = {
      baseURL: 'http://localhost:8000/api',
      responseType: 'json'
    },
    data = await axios.get(`/geolocations/geoparse?textContent=${textContent}`, config);

  return data.data;
}