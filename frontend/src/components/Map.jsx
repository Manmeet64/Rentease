import React, { useState, useEffect, useCallback } from "react";
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer,
} from "@react-google-maps/api";
import styles from "./Map.module.css"; // Import the CSS module
import useGetLocation from "./useGetLocation";
import CarMatch from "./CarMatch";

// Define the libraries outside of the component
const MAP_LIBRARIES = ["places"];

// Fallback center (New Delhi) used when geolocation is denied or unavailable
const FALLBACK_CENTER = { lat: 28.6139, lng: 77.209 };

function Map(props) {
    const { location, error: locationError } = useGetLocation();

    const hasLocation =
        typeof location?.latitude === "number" &&
        typeof location?.longitude === "number";

    const defaultCenter = hasLocation
        ? { lat: location.latitude, lng: location.longitude }
        : FALLBACK_CENTER;

    const [center, setCenter] = useState(defaultCenter);
    const [map, setMap] = useState(null);
    const [directionResponse, setDirectionResponse] = useState(null);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [zoom, setZoom] = useState(16);
    const [time, setTime] = useState("");
    const [routeError, setRouteError] = useState("");

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: MAP_LIBRARIES,
    });

    useEffect(() => {
        if (hasLocation) {
            setCenter({
                lat: location.latitude,
                lng: location.longitude,
            });
        }
    }, [hasLocation, location]);

    useEffect(() => {
        if (props.origin && props.destination && isLoaded && !props.chat) {
            setRouteError("");
            const directionsService = new google.maps.DirectionsService();
            directionsService
                .route({
                    origin: props.origin,
                    destination: props.destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                })
                .then((results) => {
                    setDirectionResponse(results);
                    setTime(results.routes[0].legs[0].duration.text);
                    setDistance(results.routes[0].legs[0].distance.text);
                    setDuration(results.routes[0].legs[0].duration.value);
                })
                .catch((error) => {
                    console.error("Error fetching directions:", error);
                    setRouteError(
                        "Couldn't find a route between those locations. Try picking suggestions from the dropdown instead of typing a full address."
                    );
                });
        }
    }, [isLoaded, props.origin, props.destination, props.chat]);

    // Effect to clear the route data when props.chat changes to true
    useEffect(() => {
        if (props.chat) {
            clearRoute();
        }
    }, [props.chat]);

    const clearRoute = useCallback(() => {
        setDistance("");
        setDuration("");
        setDirectionResponse(null);
        setTime("");
        setRouteError("");
    }, []);

    const centerPosition = useCallback(() => {
        if (map && center.lat && center.lng) {
            map.panTo(center);
            setZoom(16);
        }
    }, [map, center]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className={styles.frame}>
                <GoogleMap
                    center={center}
                    zoom={zoom}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                    onLoad={(map) => setMap(map)}
                >
                    <Marker position={center} />
                    {directionResponse && !props.chat && (
                        <DirectionsRenderer directions={directionResponse} />
                    )}
                </GoogleMap>
            </div>
            <div className={styles.btns}>
                <div className={styles.dis}>
                    <p>Duration: {time}</p>
                    <p>Distance: {distance}</p>
                </div>
                <div className={styles.btns1}>
                    <button onClick={clearRoute}>Clear</button>
                    <button onClick={centerPosition}>Center</button>
                </div>
            </div>
            <div className={styles.details}>
                {routeError && !props.chat && (
                    <p className={styles.routeError}>{routeError}</p>
                )}
                <div className={styles.carData}>
                    {distance !== "" && duration !== "" && !props.chat && (
                        <CarMatch
                            distance={distance}
                            duration={duration}
                            people={props.people}
                            budget={props.budget}
                            newChat={props.chat}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default Map;
