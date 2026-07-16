import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Car from "./Car";
import styles from "./CarList.module.css";

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cars`);
            if (response.ok) {
                const data = await response.json();
                setCars(data.slice(0, 6)); // Only take the first 6 cars for display
            } else {
                console.error("Failed to fetch cars");
            }
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
    };

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <div className={styles.carListContainer}>
            <p className={styles.carouselText1}>Enjoy Your Ride</p>
            <div className={styles.carouselText2}>
                <p>Our Vehicle Fleet</p>
            </div>
            <div className={styles.carouselText3}>
                <p>
                    Driving your dreams to reality with an exquisite fleet of
                    versatile vehicles for unforgettable journeys.
                </p>{" "}
            </div>

            <div className={styles.carouselContainer}>
                <div className={styles.embla} ref={emblaRef}>
                    <div className={styles.emblaContainer}>
                        {cars.map((car) => (
                            <div key={car.id} className={styles.emblaSlide}>
                                <Car
                                    imageUrl={car.images.image1}
                                    type={car.type}
                                    name={car.name}
                                    fuelType={car.fuelType}
                                    seater={car.seater}
                                    pricePerHour={car.pricing}
                                    carId={car.id}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    className={`${styles.emblaButton} ${styles.emblaButtonPrev}`}
                    onClick={scrollPrev}
                    aria-label="Previous car"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                    className={`${styles.emblaButton} ${styles.emblaButtonNext}`}
                    onClick={scrollNext}
                    aria-label="Next car"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </div>
    );
};

export default CarList;
