import { useState, useEffect, useRef, useCallback, act } from "react";
import useSpeechToText from "./useSpeechToText";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import Map from "./Map";
import styles from "./Alex.module.css";
import useGetLocation from "./useGetLocation";
import Weather from "./Weather";
import Navbarcomp from "../components/Navbarcomp";
import AboutUs from "../components/AboutUs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMicrophone,
    faStop,
    faArrowRight,
    faArrowLeft,
    faPaperPlane,
    faComments,
    faL,
} from "@fortawesome/free-solid-svg-icons";
import { set } from "date-fns";

const ALEX_MAP_LIBRARIES = ["places"];

function Alex() {
    const [textInput1, setTextInput1] = useState(""); // Origin
    const [textInput2, setTextInput2] = useState(""); // Destination
    const [budgetInput, setBudgetInput] = useState(""); // Track budget input
    const [people, setPeople] = useState(""); // Track number of people
    const [spokenText1, setSpokenText1] = useState(""); // Track spoken text for input 1
    const [spokenText2, setSpokenText2] = useState(""); // Track spoken text for input 2
    const [spokenText3, setSpokenText3] = useState(""); // Track spoken text for budget
    const [spokenText4, setSpokenText4] = useState(""); // Track spoken text for people
    const [spokenText5, setSpokenText5] = useState("");
    const [greetingText, setGreetingText] = useState("");
    const [isNewChat, setIsNewChat] = useState(false); // Track greeting text // Track greeting text
    const [showChatDestinaton, setShowChatDestination] = useState(false);
    const [showChatOrigin, setShowChatOrigin] = useState(false);
    const [showChatBudget, setShowChatBudget] = useState(false);
    const [showChatPeople, setShowChatPeople] = useState(false);

    const { isListening, transcript, startListening, stopListening } =
        useSpeechToText({ continuous: true });

    const [voices, setVoices] = useState([]);
    const [activeInput, setActiveInput] = useState(1); // Track active input field
    const [showInputs, setShowInputs] = useState(false); // Track visibility of input fields
    const [showDestination, setShowDestination] = useState(false); // Track visibility of destination input field
    const [showBudget, setShowBudget] = useState(false); // Track visibility of budget input field
    const [showPeople, setShowPeople] = useState(false); // Track visibility of people input field
    const [inputError, setInputError] = useState("");

    const [mapProps, setMapProps] = useState({
        origin: "",
        destination: "",
        latitude: null,
        longitude: null,
    });

    const language = "en-GB";
    const autocompleteRef1 = useRef(null); // Ref for the first Autocomplete
    const autocompleteRef2 = useRef(null); // Ref for the second Autocomplete

    useEffect(() => {
        const fetchVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                setVoices(voices);
            }
        };

        fetchVoices();
        window.speechSynthesis.onvoiceschanged = fetchVoices;
        <Map />;
    }, []);

    const availableVoices = voices.filter((voice) => {
        return voice.lang === language;
    });

    const activeVoice =
        availableVoices?.find(({ name }) =>
            name.includes("Google UK English Male")
        ) ||
        availableVoices?.find(({ name }) => name.includes("Daniel")) ||
        availableVoices?.find(({ name }) =>
            name.includes("Google UK English Female")
        );

    useEffect(() => {
        if (!isListening && transcript) {
            if (activeInput === 1) {
                setTextInput1(
                    (prevVal) =>
                        prevVal +
                        (transcript.length
                            ? (prevVal.length ? " " : "") + transcript
                            : "")
                );
            } else if (activeInput === 2) {
                setTextInput2(
                    (prevVal) =>
                        prevVal +
                        (transcript.length
                            ? (prevVal.length ? " " : "") + transcript
                            : "")
                );
            } else if (activeInput === 3) {
                setBudgetInput(
                    (prevVal) =>
                        prevVal +
                        (transcript.length
                            ? (prevVal.length ? " " : "") + transcript
                            : "")
                );
            } else if (activeInput === 4) {
                setPeople(
                    (prevVal) =>
                        prevVal +
                        (transcript.length
                            ? (prevVal.length ? " " : "") + transcript
                            : "")
                );
            }
        }
    }, [isListening, transcript]);

    const startStopListening = () => {
        if (isListening) {
            stopVoiceInput();
        } else {
            startListening();
        }
    };

    const stopVoiceInput = () => {
        stopListening();
    };

    function takeCommand(command) {
        if (command.includes("hello")) {
            readOut("How may I help you today");
        }
    }

    function readOut(message) {
        let utterance = new SpeechSynthesisUtterance(message);
        const voices = window.speechSynthesis.getVoices();
        utterance.voice = activeVoice;

        window.speechSynthesis.speak(utterance);
    }

    const handleStart = () => {
        const greetingMessage =
            "Hello, where do you want to go today? Choose your route.";
        readOut(greetingMessage);
        setGreetingText(greetingMessage);
        setShowInputs(true);
        setIsNewChat(false); // Show input fields after the greeting
    };

    const handleEnter = () => {
        if (activeInput === 1) {
            if (!textInput1.trim()) {
                setInputError("Please enter a pickup location before continuing.");
                return;
            }
            setInputError("");
            takeCommand(textInput1);
            const destinationMessage = "Enter destination";
            readOut(destinationMessage);
            setSpokenText2(destinationMessage);
            setShowChatOrigin(true);
            setActiveInput(2);
            setShowDestination(true); // Show destination input field
        } else if (activeInput === 2) {
            if (!textInput2.trim()) {
                setInputError("Please enter a destination before continuing.");
                return;
            }
            setInputError("");
            takeCommand(textInput2);
            const budgetMessage = "Enter your budget";
            readOut(budgetMessage);
            setSpokenText3(budgetMessage);
            setShowChatDestination(true);
            setActiveInput(3);
            setShowBudget(true); // Show budget input field
        } else if (activeInput === 3) {
            if (!budgetInput.trim() || isNaN(Number(budgetInput))) {
                setInputError("Please enter a valid budget before continuing.");
                return;
            }
            setInputError("");
            takeCommand(budgetInput);
            const peopleMessage = "Enter number of people";
            readOut(peopleMessage);
            setSpokenText4(peopleMessage);
            setShowChatBudget(true);
            setActiveInput(4);
            setShowPeople(true); // Show people input field
        } else if (activeInput === 4) {
            if (
                !people.trim() ||
                isNaN(Number(people)) ||
                Number(people) <= 0
            ) {
                setInputError("Please enter a valid number of people before continuing.");
                return;
            }
            setInputError("");
            takeCommand(people);
            const resultMessage = "This is the result I found";
            readOut(resultMessage);
            setShowChatPeople(true);
            setSpokenText5(resultMessage);
            setMapProps({
                origin: textInput1,
                destination: textInput2,
                people: people,
                budget: budgetInput,
            });
            setIsSubmitted(true);
        }
    };

    const handlePlaceChanged1 = () => {
        if (autocompleteRef1.current) {
            const place = autocompleteRef1.current.getPlace();
            setTextInput1(place.formatted_address || place.name);
        }
    };

    const handlePlaceChanged2 = () => {
        if (autocompleteRef2.current) {
            const place = autocompleteRef2.current.getPlace();
            setTextInput2(place.formatted_address || place.name);
        }
    };

    const handleBack = () => {
        setInputError("");
        if (activeInput === 2) {
            setActiveInput(1);
            setShowDestination(false); // Hide destination input field when going back
            setSpokenText2(""); // Clear spoken text for destination
        } else if (activeInput === 3) {
            setActiveInput(2);
            setShowBudget(false); // Hide budget input field when going back
            setSpokenText3(""); // Clear spoken text for budget
        } else if (activeInput === 4) {
            setActiveInput(3);
            setShowPeople(false); // Hide people input field when going back
            setSpokenText4(""); // Clear spoken text for people
        }
    };

    // Places API call code
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ALEX_MAP_LIBRARIES,
    });

    const originRef = useRef();
    const destinationRef = useRef();
    const [choose, setChoose] = useState("");
    const [locationSelectValue, setLocationSelectValue] = useState("");
    const { location, error: locationError, status: locationStatus } =
        useGetLocation();

    const fillOriginFromCoords = useCallback((latitude, longitude) => {
        setChoose("Your location");
        originRef.current.value = `${latitude},${longitude}`;
        fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.results && data.results[0]) {
                    const address_components_origin =
                        data.results[0].address_components;
                    originRef.current.value =
                        data.results[0].formatted_address;
                    setTextInput1(originRef.current.value);
                    const cityComponent = address_components_origin.find(
                        (component) =>
                            component.types.includes("locality") ||
                            component.types.includes(
                                "administrative_level_3"
                            )
                    );
                    if (cityComponent) {
                        setCity(cityComponent.long_name);
                    }
                }
            })
            .catch((err) => {
                console.error("Error reverse-geocoding location:", err);
            });
    }, []);

    const handleLocationChange = useCallback(
        (e) => {
            const selectedValue = e.target.value;
            setLocationSelectValue(selectedValue);

            if (selectedValue !== "Current location") {
                setChoose("Choose location");
                originRef.current.value = "";
                setTextInput1(originRef.current.value);
                return;
            }

            if (locationStatus === "success" && location.latitude && location.longitude) {
                fillOriginFromCoords(location.latitude, location.longitude);
            }
            // If location hasn't resolved yet (status is "loading"), the effect
            // below will fill the field automatically once it does.
        },
        [location, locationStatus, fillOriginFromCoords]
    );

    // Auto-fill the origin the moment geolocation resolves, in case the user
    // picked "Current location" before the browser's permission prompt settled.
    useEffect(() => {
        if (
            locationSelectValue === "Current location" &&
            locationStatus === "success" &&
            location.latitude &&
            location.longitude &&
            originRef.current &&
            !originRef.current.value
        ) {
            fillOriginFromCoords(location.latitude, location.longitude);
        }
    }, [locationSelectValue, locationStatus, location, fillOriginFromCoords]);

    const handleChat = () => {
        setTextInput1("");
        setTextInput2("");
        setBudgetInput("");
        setPeople("");
        setSpokenText1("");
        setSpokenText2("");
        setSpokenText3("");
        setSpokenText4("");
        setSpokenText5("");
        setGreetingText("");
        setActiveInput(1);
        setShowInputs(false);
        setShowDestination(false);
        setShowBudget(false);
        setShowPeople(false);
        setInputError("");
        setLocationSelectValue("");
        setMapProps({
            origin: "",
            destination: "",
            people: "",
            budget: "",
        });
        setIsSubmitted(false);
        setCity("");
        setIsNewChat(true);
    };
    //Getting the city of origin for weather data
    const [city, setCity] = useState("");
    useEffect(
        () => {
            if (choose === "Choose location") {
                const address = originRef.current.value;
                const formattedAddress = encodeURIComponent(address);
                console.log(formattedAddress);
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
                let addressComponent = [];

                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Geocode API response:", data);
                        if (!data.results || !data.results[0]) {
                            return;
                        }
                        addressComponent = data.results[0].address_components;
                        console.log(addressComponent);
                        const city = addressComponent.find(
                            (component) =>
                                component.types.includes("locality") ||
                                component.types.includes(
                                    "administrative_level_3"
                                )
                        );
                        if (city) {
                            setCity(city.long_name);
                        }
                    })
                    .catch((err) => {
                        console.log("Error:", err);
                    });
            }
        },
        [textInput1],
        [city]
    );
    const [isSubmitted, setIsSubmitted] = useState(false);
    console.log(city);
    return (
        <>
            <Navbarcomp />
            <div className={styles.headerimage}>
                <p>Plan Your Trip</p>
            </div>
            <div className={styles.Alexcontainer}>
                <div className={styles.mainContainer}>
                    <div className={styles.map}>
                        <Map
                            origin={mapProps.origin}
                            destination={mapProps.destination}
                            latitude={mapProps.latitude}
                            longitude={mapProps.longitude}
                            people={mapProps.people}
                            budget={mapProps.budget}
                            chat={isNewChat ? true : false}
                        />
                    </div>
                    <div className={styles.mainchat}>
                        <div className={styles.main1}>
                            <h1 className={styles.chatheading}>Alex VA</h1>
                            <div className={styles.chatScroll}>
                            {!showInputs && (
                                <button
                                    className={styles.start}
                                    onClick={handleStart}
                                >
                                    Start
                                </button>
                            )}

                            {showInputs && (
                                <>
                                    {greetingText && (
                                        <div
                                            className={`${styles["chat-message"]} ${styles.question}`}
                                        >
                                            <p>{greetingText}</p>
                                        </div>
                                    )}

                                    <div className={styles["inputs-container"]}>
                                        <div
                                            className={`${styles["chat-message"]} ${styles.question}`}
                                        >
                                            <div
                                                className={
                                                    styles["select-container"]
                                                }
                                            >
                                                <select
                                                    name="location"
                                                    id="location"
                                                    onChange={
                                                        handleLocationChange
                                                    }
                                                    defaultValue="Select location"
                                                >
                                                    <option
                                                        value="Select location"
                                                        disabled
                                                    >
                                                        Select location
                                                    </option>
                                                    <option value="Current location">
                                                        Current location
                                                    </option>
                                                    <option value="Choose location">
                                                        Choose location
                                                    </option>
                                                </select>
                                            </div>
                                            {locationSelectValue ===
                                                "Current location" && (
                                                <p
                                                    className={
                                                        styles.locationStatus
                                                    }
                                                >
                                                    {locationStatus ===
                                                        "loading" &&
                                                        "Getting your location..."}
                                                    {locationStatus ===
                                                        "error" &&
                                                        "Location unavailable — please choose your address manually."}
                                                    {locationStatus ===
                                                        "success" &&
                                                        "Location found."}
                                                </p>
                                            )}
                                        </div>

                                        {showChatOrigin && (
                                            <div
                                                className={`${styles["chat-message"]} ${styles.response}`}
                                            >
                                                <Autocomplete
                                                    onLoad={(autocomplete) =>
                                                        (autocompleteRef1.current =
                                                            autocomplete)
                                                    }
                                                    onPlaceChanged={
                                                        handlePlaceChanged1
                                                    }
                                                >
                                                    <input
                                                        type="text"
                                                        name="voiceInput1"
                                                        id="v-input1"
                                                        placeholder="Origin"
                                                        ref={originRef}
                                                        value={
                                                            isListening &&
                                                            activeInput === 1
                                                                ? textInput1 +
                                                                  (transcript.length
                                                                      ? (textInput1.length
                                                                            ? " "
                                                                            : "") +
                                                                        transcript
                                                                      : "")
                                                                : textInput1
                                                        }
                                                        onChange={(e) =>
                                                            setTextInput1(
                                                                e.target.value
                                                            )
                                                        }
                                                        className={styles.input}
                                                        disabled={
                                                            isListening ||
                                                            activeInput !== 1
                                                        }
                                                    />
                                                </Autocomplete>
                                            </div>
                                        )}
                                        <div
                                            className={`${styles["chat-message"]} ${styles.question}`}
                                        >
                                            <p
                                                style={{
                                                    opacity: showChatOrigin
                                                        ? "1"
                                                        : "0",
                                                }}
                                            >
                                                {spokenText2}
                                            </p>
                                        </div>

                                        {showChatDestinaton && (
                                            <>
                                                <div
                                                    className={`${styles["chat-message"]} ${styles.response}`}
                                                >
                                                    <Autocomplete
                                                        onLoad={(
                                                            autocomplete
                                                        ) =>
                                                            (autocompleteRef2.current =
                                                                autocomplete)
                                                        }
                                                        onPlaceChanged={
                                                            handlePlaceChanged2
                                                        }
                                                    >
                                                        <input
                                                            type="text"
                                                            name="voiceInput2"
                                                            id="v-input2"
                                                            placeholder="Destination"
                                                            ref={destinationRef}
                                                            value={
                                                                isListening &&
                                                                activeInput ===
                                                                    2
                                                                    ? textInput2 +
                                                                      (transcript.length
                                                                          ? (textInput2.length
                                                                                ? " "
                                                                                : "") +
                                                                            transcript
                                                                          : "")
                                                                    : textInput2
                                                            }
                                                            onChange={(e) =>
                                                                setTextInput2(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={
                                                                styles.input
                                                            }
                                                            disabled={
                                                                isListening ||
                                                                activeInput !==
                                                                    2
                                                            }
                                                        />
                                                    </Autocomplete>
                                                </div>
                                            </>
                                        )}

                                        {showBudget && (
                                            <>
                                                <div
                                                    className={`${styles["chat-message"]} ${styles.question}`}
                                                >
                                                    <p
                                                        style={{
                                                            opacity:
                                                                showChatDestinaton
                                                                    ? "1"
                                                                    : "0",
                                                        }}
                                                    >
                                                        {spokenText3}
                                                    </p>
                                                </div>
                                                {showChatBudget && (
                                                    <div
                                                        className={`${styles["chat-message"]} ${styles.response}`}
                                                    >
                                                        <input
                                                            type="text"
                                                            name="budgetInput"
                                                            id="budget-input"
                                                            placeholder="Budget"
                                                            value={
                                                                isListening &&
                                                                activeInput ===
                                                                    3
                                                                    ? budgetInput +
                                                                      (transcript.length
                                                                          ? (budgetInput.length
                                                                                ? " "
                                                                                : "") +
                                                                            transcript
                                                                          : "")
                                                                    : budgetInput
                                                            }
                                                            onChange={(e) =>
                                                                setBudgetInput(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={
                                                                styles.input
                                                            }
                                                            disabled={
                                                                isListening ||
                                                                activeInput !==
                                                                    3
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {showPeople && (
                                            <>
                                                <div
                                                    className={`${styles["chat-message"]} ${styles.question}`}
                                                >
                                                    <p
                                                        style={{
                                                            opacity:
                                                                showChatBudget
                                                                    ? "1"
                                                                    : "0",
                                                        }}
                                                    >
                                                        {spokenText4}
                                                    </p>
                                                </div>
                                                {showChatPeople && (
                                                    <div
                                                        className={`${styles["chat-message"]} ${styles.response}`}
                                                    >
                                                        <input
                                                            type="text"
                                                            name="peopleInput"
                                                            id="people-input"
                                                            placeholder="Number of people"
                                                            value={
                                                                isListening &&
                                                                activeInput ===
                                                                    4
                                                                    ? people +
                                                                      (transcript.length
                                                                          ? (people.length
                                                                                ? " "
                                                                                : "") +
                                                                            transcript
                                                                          : "")
                                                                    : people
                                                            }
                                                            onChange={(e) =>
                                                                setPeople(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={
                                                                styles.input
                                                            }
                                                            disabled={
                                                                isListening ||
                                                                activeInput !==
                                                                    4
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        <div
                                            className={`${styles["chat-message"]} ${styles.question}`}
                                        >
                                            <p
                                                style={{
                                                    opacity: showChatPeople
                                                        ? "1"
                                                        : "0",
                                                }}
                                            >
                                                {spokenText5}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.weather}>
                                        {isSubmitted && <Weather city={city} />}
                                    </div>
                                    <div className={styles.typingsection}>
                                        {activeInput === 1 && (
                                            <div
                                                className={`${styles["chat-message"]} ${styles.response}`}
                                            >
                                                <Autocomplete
                                                    onLoad={(autocomplete) =>
                                                        (autocompleteRef1.current =
                                                            autocomplete)
                                                    }
                                                    onPlaceChanged={
                                                        handlePlaceChanged1
                                                    }
                                                >
                                                    <input
                                                        type="text"
                                                        name="voiceInput1"
                                                        id="v-input1"
                                                        placeholder="Origin"
                                                        ref={originRef}
                                                        value={
                                                            isListening &&
                                                            activeInput === 1
                                                                ? textInput1 +
                                                                  (transcript.length
                                                                      ? (textInput1.length
                                                                            ? " "
                                                                            : "") +
                                                                        transcript
                                                                      : "")
                                                                : textInput1
                                                        }
                                                        onChange={(e) =>
                                                            setTextInput1(
                                                                e.target.value
                                                            )
                                                        }
                                                        className={
                                                            styles.usermessage
                                                        }
                                                        disabled={
                                                            isListening ||
                                                            activeInput !== 1
                                                        }
                                                    />
                                                </Autocomplete>
                                            </div>
                                        )}
                                        {activeInput === 2 && (
                                            <div
                                                className={`${styles["chat-message"]} ${styles.response}`}
                                            >
                                                <Autocomplete
                                                    onLoad={(autocomplete) =>
                                                        (autocompleteRef2.current =
                                                            autocomplete)
                                                    }
                                                    onPlaceChanged={
                                                        handlePlaceChanged2
                                                    }
                                                >
                                                    <input
                                                        type="text"
                                                        name="voiceInput2"
                                                        id="v-input2"
                                                        placeholder="Destination"
                                                        ref={destinationRef}
                                                        value={
                                                            isListening &&
                                                            activeInput === 2
                                                                ? textInput2 +
                                                                  (transcript.length
                                                                      ? (textInput2.length
                                                                            ? " "
                                                                            : "") +
                                                                        transcript
                                                                      : "")
                                                                : textInput2
                                                        }
                                                        onChange={(e) =>
                                                            setTextInput2(
                                                                e.target.value
                                                            )
                                                        }
                                                        className={
                                                            styles.usermessage
                                                        }
                                                        disabled={
                                                            isListening ||
                                                            activeInput !== 2
                                                        }
                                                    />
                                                </Autocomplete>
                                            </div>
                                        )}
                                        {activeInput === 3 && (
                                            <>
                                                <div
                                                    className={`${styles["chat-message"]} ${styles.response}`}
                                                >
                                                    <input
                                                        type="text"
                                                        name="budgetInput"
                                                        id="budget-input"
                                                        placeholder="Budget"
                                                        value={
                                                            isListening &&
                                                            activeInput === 3
                                                                ? budgetInput +
                                                                  (transcript.length
                                                                      ? (budgetInput.length
                                                                            ? " "
                                                                            : "") +
                                                                        transcript
                                                                      : "")
                                                                : budgetInput
                                                        }
                                                        onChange={(e) =>
                                                            setBudgetInput(
                                                                e.target.value
                                                            )
                                                        }
                                                        className={
                                                            styles.usermessage
                                                        }
                                                        disabled={
                                                            isListening ||
                                                            activeInput !== 3
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {activeInput === 4 && (
                                            <>
                                                <div
                                                    className={`${styles["chat-message"]} ${styles.response}`}
                                                >
                                                    <input
                                                        type="text"
                                                        name="peopleInput"
                                                        id="people-input"
                                                        placeholder="Number of people"
                                                        value={
                                                            isListening &&
                                                            activeInput === 4
                                                                ? people +
                                                                  (transcript.length
                                                                      ? (people.length
                                                                            ? " "
                                                                            : "") +
                                                                        transcript
                                                                      : "")
                                                                : people
                                                        }
                                                        onChange={(e) =>
                                                            setPeople(
                                                                e.target.value
                                                            )
                                                        }
                                                        className={
                                                            styles.usermessage
                                                        }
                                                        disabled={
                                                            isListening ||
                                                            activeInput !== 4
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {inputError && (
                                            <p className={styles.inputError}>
                                                {inputError}
                                            </p>
                                        )}
                                        <div className={styles.btns}>
                                            <button
                                                className={styles.speak}
                                                onClick={startStopListening}
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        isListening
                                                            ? faStop
                                                            : faMicrophone
                                                    }
                                                />{" "}
                                                {isListening ? "" : ""}
                                            </button>
                                            <button
                                                className={styles.speak}
                                                onClick={handleEnter}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faArrowRight}
                                                />{" "}
                                                {activeInput === 1 ||
                                                activeInput === 2 ||
                                                activeInput === 3
                                                    ? ""
                                                    : ""}
                                            </button>
                                            {spokenText5 !== "" && (
                                                <button
                                                    className={styles.speak}
                                                    onClick={handleChat}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faComments}
                                                    />
                                                </button>
                                            )}
                                            {/* {activeInput > 1 && (
                                                <button
                                                    className={styles.speak}
                                                    onClick={handleBack}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faArrowLeft}
                                                    />
                                                </button>
                                            )} */}
                                        </div>
                                    </div>
                                </>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AboutUs />
        </>
    );
}

export default Alex;
