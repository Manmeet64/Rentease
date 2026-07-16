import React from "react";
import styles from "./Car.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faGasPump,
    faCogs,
    faCar,
} from "@fortawesome/free-solid-svg-icons";

const Car = (props) => {
    let navigate = useNavigate();

    async function handleRent(carId) {
        try {
            const usersResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/users?isLoggedIn=true`
            );
            const users = await usersResponse.json();
            const loggedInUser = users[0];

            if (!loggedInUser) {
                alert("Please register yourself with us :)");
                navigate("/register");
                return;
            }

            const bookingsResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/booking?userId=${loggedInUser.id}&status=incomplete`
            );
            const incompleteBookings = await bookingsResponse.json();
            const latestBooking = incompleteBookings.sort(
                (a, b) => new Date(b.pickUpDateTime) - new Date(a.pickUpDateTime)
            )[0];

            if (!latestBooking) {
                alert("Please choose a pickup/drop-off location and date first.");
                navigate("/home");
                return;
            }

            await fetch(`${import.meta.env.VITE_API_BASE_URL}/booking/${latestBooking.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    carName: props.name,
                    carId: carId,
                }),
            });

            navigate(`/booking/${carId}`);
        } catch (error) {
            console.error("Error preparing booking:", error);
            navigate(`/booking/${carId}`);
        }
    }

    return (
        <div className={styles.carCard}>
            <img src={props.imageUrl} alt="Car" className={styles.carImage} />
            <div className={styles.carDetails}>
                <div className={styles.carInfo}>
                    <h3>{props.name}</h3>
                </div>
                <div className={styles.carSpecs}>
                    <div className={styles.carSpecItem}>
                        <FontAwesomeIcon
                            icon={faUser}
                            className={styles.iconUser}
                        />
                        <p>{props.seater}</p>
                    </div>
                    <div className={styles.carSpecItem}>
                        <FontAwesomeIcon
                            icon={faGasPump}
                            className={styles.iconFuel}
                        />
                        <p>{props.fuelType}</p>
                    </div>
                    {/* <div className={styles.carSpecItem}>
                        <p>{props.transmission}</p>
                    </div> */}
                    <div className={styles.carSpecItem}>
                        <FontAwesomeIcon
                            icon={faCar}
                            className={styles.iconType}
                        />
                        <p>{props.type}</p>
                    </div>
                </div>
                <div className={styles.carPricing}>
                    <p className={styles.pricePerHour}>
                        &#8377;{props.pricePerHour}
                    </p>
                    <button
                        className={styles.rentButton}
                        onClick={() => {
                            handleRent(props.carId);
                        }}
                    >
                        Rent
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Car;
