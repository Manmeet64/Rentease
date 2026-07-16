import React from "react";
import styles from "./RevvSubscription.module.css";

const RevvSubscription = () => {
    return (
        <div className={styles.revvSubscription}>
            <div className={styles.textContent}>
                <h1>What is RentEase Subscription?</h1>
                <p>
                    <b>Rentease</b> offers a premium car rental experience with
                    sanitized cars, insurance included, flexible booking and
                    extensions, free delivery, and the option to choose your own
                    drivers. Enjoy 50% more value compared to standard rentals
                    with flexible monthly plans.
                </p>
            </div>
            <div className={styles.videoContent}>
                <img
                    className={styles.subscriptionImage}
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1200&auto=format&fit=crop"
                    alt="RentEase Subscription"
                />
            </div>
        </div>
    );
};

export default RevvSubscription;
