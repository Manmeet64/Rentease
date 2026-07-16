import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./ReviewComponent.module.css";

const ReviewComponent = () => {
    const [reviews, setReviews] = useState([]);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);

    useEffect(() => {
        fetchReviews(); // Fetch reviews when component mounts
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cars`); // Replace with your actual endpoint for reviews
            if (response.ok) {
                const data = await response.json();
                // Limit to 8 reviews
                const limitedReviews = data.slice(0, 8);
                setReviews(limitedReviews);
            } else {
                console.error("Failed to fetch reviews");
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <div className={styles.reviewContainer}>
            <div className={styles.carouselText2}>
                <p>HEAR FROM OUR GUESTS</p>
            </div>

            <div className={styles.fullWidthCarousel}>
                <div className={styles.embla} ref={emblaRef}>
                    <div className={styles.emblaContainer}>
                        {reviews.map((review, index) => (
                            <div key={index} className={styles.emblaSlide}>
                                <div className={styles.reviewCard}>
                                    <div className={styles.cardContent}>
                                        <img
                                            src={review.reviews[0].userimage}
                                            alt="User"
                                            className={styles.userImage}
                                        />
                                        <div className={styles.reviewDetails}>
                                            <h3>{review.reviews[0].username}</h3>
                                            <p>{review.reviews[0].review}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    className={`${styles.emblaButton} ${styles.emblaButtonPrev}`}
                    onClick={scrollPrev}
                    aria-label="Previous review"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                    className={`${styles.emblaButton} ${styles.emblaButtonNext}`}
                    onClick={scrollNext}
                    aria-label="Next review"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </div>
    );
};

export default ReviewComponent;
