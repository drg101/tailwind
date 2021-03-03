import React, { Component } from 'react';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import toGeoJSON from '@mapbox/togeojson';
import raw from "raw.macro";
//import gpx1 from './gpx/Afternoon_Ride.gpx'


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet/dist/leaflet.css';

const MapHooks = () => {
    const map = useMapEvents({
        click: (e) => {
            const URL = `https://api.weather.gov/points/${e.latlng.lat},${e.latlng.lng}/forecast/hourly`
            const headers = {Accept: "application/ld+json"}
            headers["User-Agent"] = "(myweatherapp.com, contact@myweatherapp.com)"
            const options = {"headers": headers};
            // const URL = `http://api.openweathermap.org/data/2.5/forecast/hourly?lat=${e.latlng.lat}&lon=${e.latlng.lng}&appid=ab7b6413bc277a189e575350e85918e9`;
            
            fetchJSON(URL,options).then((res) => {
                if (!res) return
                const firstHour = res.properties.periods[0]
                console.log(`${firstHour.windSpeed} ${firstHour.windDirection}`)
            })
        }
    })
    return null
}

async function fetchJSON(url) {
    let response = await fetch(url)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                return Promise.reject(res.status);
            }
        })
        .then(res => { return res })
        .catch(err => {console.log(`Error with message: ${err}`); return fetchJSON(url)});
    return response;
}

const processCoordsResponse = (res) => {
    console.log(res)
}

const MainMap = () => {
    let gpx = raw('./gpx/Afternoon_Ride.gpx')
    console.log(toGeoJSON.gpx((new DOMParser()).parseFromString(gpx, 'text/xml')));
    return (
        <MapContainer center={[40.5, -105.2]} zoom={11}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapHooks />
        </MapContainer>
    );
}

export default MainMap;