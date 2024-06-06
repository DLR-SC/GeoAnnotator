# Geo Annotator V1

## What is the Geo Annotator used for?
The Geo Annotator (GA) is used for managing annotated data, which has been parsed with a specific geoparser like CamCoder, Edinburgh Geoparser or more.

![Geo Annotator - Example](./src/example.png "Geo Annotator")

## Installation
If you haven't Node.js (Version 20.9.0) already installed on your local system, do the following:
```bash
conda create -n GeoAnnotator nodejs=20.9.0 && conda activate GeoAnnotator
```

(RECOMMENDED)
To simply install all packages, run (Nodejs is required. If not installed, see below)
```bash 
npm install
```

(NOT RECOMMENDED)
If you manually want to install the packages, do the following:
- React
```bash
npm install react@^18.2.0 react-dom@^18.2.0
```
- React Material UI (MUI)
```bash
npm install @mui/material@^5.15.15 @mui/icons-material@^5.15.15
```
- React Draggable (For draggable dialogs/popups)
```bash
npm install react-draggable@^4.4.6
```
- Leaflet (Mapping)
```bash
npm install react-leaflet@^4.2.1 leaflet@^1.9.4
```
- 
- emotion.js (for custom react-components)
```bash
npm install @emotion/react@^11.11.4 @emotion/styled@^11.11.5
```
- A custom font
```bash
npm install @fontsource/roboto@^5.0.13
```
- Axios.js for recalling Request-API's in backend
```bash
npm install axios@^1.6.8
```

## Usage
Choose a json-file, that contains a JSON-Array with JSON-Objects, each with following attributes:
- "locations": The locations, including their geolocations/coordinates (Latitude, Longitude)
- "text": Text content, from which the locations have been detected and extracted
- ...

Afterwards, the textcontent, with the highlighted locations, the mapping of each location and the locations themselfs will be shown on the page. 

## Project status
Project finished.