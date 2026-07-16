import React from "react";
import styles from "./Steps.module.css";

const steps = [
    {
        number: 1,
        title: "Choose a vehicle",
        content:
            "Unlock unparalleled adventures and memorable journeys with our vast fleet of vehicles tailored to suit every need, taste, and destination.",
    },
    {
        number: 2,
        title: "Pick location & date",
        content:
            "Pick your ideal location and date, and let us take you on a journey filled with convenience, flexibility, and unforgettable experiences.",
    },
    {
        number: 3,
        title: "Make a booking",
        content:
            "Secure your reservation with ease, unlocking a world of possibilities and embarking on your next adventure with confidence.",
    },
    {
        number: 4,
        title: "Sit back & relax",
        content:
            "Hassle-free convenience as we take care of every detail, allowing you to unwind and embrace a journey filled with comfort.",
    },
];

const Steps = () => {
    return (
        <div className={styles.stepsContainer}>
            <h1>Make It Happen In 4 Steps</h1>
            <div className={styles.stepsWrapper}>
                {steps.map((step) => (
                    <div className={styles.step} key={step.number}>
                        <div className={styles.stepNumber}>{step.number}</div>
                        <div className={styles.stepContent}>
                            <h3>{step.title}</h3>
                            <p>{step.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Steps;
