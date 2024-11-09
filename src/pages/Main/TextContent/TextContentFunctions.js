import React from 'react';
import axios from 'axios';

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
function highlightText(text, wordsToHighlight) {
    const
        regexPattern = `(${wordsToHighlight.join('|')})`,
        regex = new RegExp(regexPattern, 'gi'),
        parts = text.split(regex);

    return (<>{
        parts.map((part, index) =>
            wordsToHighlight.includes(part) ? (
                <span key={index}>{part}</span>
            ) : (
                <React.Fragment key={index}>{part}</React.Fragment>
            )
        )
    }</>)
}

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
 * @param {{ 
 *  option: "openai" | "selfhosted", 
 *  instance_name: string, 
 *  data: { 
 *      apiKey?: string, 
 *      model?: string, 
 *      hostserver_url?: string 
 *  } 
 * }} provider
 * @param {string} textContent
 * @param {string} model
 */
export async function geoparseTextContent(provider, textContent) {
    let 
        config = {
            baseURL: 'http://localhost:8000/api',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        },
        response = await axios.post(
            `/geoparse`, 
            { "text": textContent, "provider": provider }, 
            config
        );

    return response.data;
}