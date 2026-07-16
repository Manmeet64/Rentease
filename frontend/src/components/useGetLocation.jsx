// GetLocation.jsx
import { useEffect, useState } from "react";

// status: "idle" | "loading" | "success" | "error"
const useGetLocation = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("idle");

    useEffect(() => {
        const getUserLocation = () => {
            if (navigator.geolocation) {
                setStatus("loading");
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ latitude, longitude });
                        setStatus("success");
                    },
                    (error) => {
                        console.error("Error getting user location:", error);
                        setError(error);
                        setStatus("error");
                    }
                );
            } else {
                setError(new Error("Geolocation not supported"));
                setStatus("error");
            }
        };

        getUserLocation();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return { location, error, status };
};

export default useGetLocation;
