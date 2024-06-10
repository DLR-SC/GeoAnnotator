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
To simply install all packages, run:
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
- and more...

After installing, simply run:
```bash
npm start
```

## Usage
Choose a json-file, that contains a JSON-Array with JSON-Objects, each with following attributes:
- *locations*: The locations, including their geolocations/coordinates (Latitude, Longitude)
- *text*: Text content, from which the locations have been detected and extracted

Other attributes could also be included, but they won't be considered relevant for this project

## Example
A json object could look like this:
```json
[
    {
        "id": 0,
        "text": "The Philippine Department of Agriculture (DA), local health and agricultural teams Sunday have started slaughtering, burning and burying roughly 6,500 hogs at a farm in Pandi, Bulacan in Central Luzon on Sunday after three farm workers became infected with Reston ebolavirus (ERV) of the virus group Ebola, as a precautionary measure and to protect the local livestock industry. \"We culled around 300 heads\u2014piglets and growers\u2014in two and a half hours; we tried to start the process at 5 p.m. Sunday; after three hours we disposed of 442 hogs; that includes transporting the hogs to an area in the farm where they will be disposed of; with this rate and with some improvements in the procedure tomorrow, we expect to complete the depopulation by Wednesday,\u201d Bureau of Animal Industry (BAI) head Davinio Catbagan said. \"With the problems we encountered last night, we may go beyond Thursday,\" he added.",
        "locations": {
            "Pandi": [
                14.87,
                120.95
            ],
            "Bulacan": [
                15,
                121.08
            ],
            "Central Luzon": [
                15.47,
                120.75
            ]
        }
    },
    ...
]
```

Afterwards, the textcontent, including the highlighted locations, the mapping of each location and the locations will be shown on the page.

## Project status
Project finished.