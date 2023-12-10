/**
 * This file contains information needed to display the Display psuedoscreen
 * This contains the markers and start and end points for a recording
 * @author // Amanda Cheung with help from 
 * Lyn's snack https://snack.expo.dev/@fturbak/modal-textinput-popup-dialog
 * Lyn's snack https://snack.expo.dev/@fturbak/tracklocationmapbuttons 
 * @param allNames: the names of all paths-  used to check if there are duplicates
 * @param convertDate: the function to convert a date to be readable
 * @param setNewPaths: sets the new path array with all paths that are not in local storage yet
 * @param setAllNames: sets the names of the new paths that are not yet in local storage
 */

import { useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, Modal, TextInput, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import * as PathStore from '../PathStore.js';
import { Button } from "react-native-paper";
import { pathDistanceInMeters } from '../distance.js'
import PathView from "./PathView";

const { width } = Dimensions.get("window");

let subscription = null; // location tracking service

export default function RecordingPScreen({ allNames, convertDate, setNewPaths, setAllNames }) {
    // state variables used for recording
    // checks permission to access location
    const [permissionText, setPermissionText]
        = useState('Location permission not requested yet');
    // sets the current location of the user and continues to update with the tracker
    const [myCoord, setMyCoord] = useState(null);
    // all coordinates crossed in the path
    const [coords, setCoords] = useState([]);
    // an array that contains all the stops that are marked in the path
    const [stops, setStops] = useState([]);
    // the title of the path
    const [title, setTitle] = useState('');
    // the start time of the path
    const [startTime, setStartTime] = useState(null);
    // the end time of the path
    const [endTime, setEndTime] = useState(null);
    // toggles whether or not the modal for stop title is displayed
    const [isModalVisible, setModalVisible] = useState(false);
    // Manages text within the dialog popup
    const [stopTitleInputValue, setStopTitleInputValue] = useState('');
    // contains the text that is being entered on the modal textbox
    const [descInputValue, setDescInputValue] = useState('')
    // toggles to show the save or delete modal
    const [chooseAction, setChooseAction] = useState(false);
    // toggles to show entering a title for the recording
    const [canEnterTitle, setCanEnterTitle] = useState(false);
    // toggles whether the start recording, add stop, and stop recording buttons are enabled
    const [isRecording, setIsRecording] = useState(true);
    // a boolean that determines whether or not there are duplicates in the entered title
    const [needNewTitle, setNeedNewTitle] = useState(false);

    /**
     * this function tracks the input put into the modal text box when a stop title is being added
     */
    function enterDialog() {
        setStopTitleInputValue('');
        setDescInputValue('');
        setModalVisible(true);
    }

    /**
     * This function gets the current time at the moment clicked and changes it into a date object
     */
    function getCurrTime() {
        d1 = new Date(Date.now())
        return d1
    }

    /**
     * This function takes in all the inputs that have been put in 
     * and creates it into a path object (JSON)
     * @returns the new path that is saved
     */
    function createPathObj() {
        let newPath = {
            "name": title,
            "startTime": startTime,
            "stopTime": endTime,
            "pathDistance": calculateDistance(),
            "spots": stops,
            "coords": coords
        }
        return newPath
    }

    /**
     * This function gets the title of the recording from the text modal input
     */
    function getTitle() {
        setTitle('');
        setChooseAction(false);
        setCanEnterTitle(true);
    }

    /**
     * This function handles all actions that are executed when a path has to be saved
     */
    function savePath() {
        console.log('save')
        // hides the modal to enter a title
        setCanEnterTitle(false);
        // checks for duplicates in name
        if (allNames.includes(title)) {
            setCanEnterTitle(true);
            setNeedNewTitle(true);
        }
        else{
            setNeedNewTitle(false);
        }
        // creates and stores the new path object
        pathObj = createPathObj();
        PathStore.storePath(pathObj);
        console.log('successfully saved ' + JSON.stringify(pathObj))
        // adds the path to a list of all the paths that are not yet in persistent storage
        // and puts its name into the name list to check for duplicates
        setNewPaths((prevPaths) => {
            return [...prevPaths, pathObj]
        })
        setAllNames((prevNames)=>{
            return [...prevNames, pathObj.name]
        })
    }

    /**
     * This path allows the path that was created to be deleted instead of saved
     */
    function deletePath() {
        setChooseAction(false);
        resetRecording();
        console.log('successfully deleted')
    }

    /**
     * This function calculates the distance of the path and then divides it
     * by 1000 to change it from meters to km.
     * 
     */
    function calculateDistance() {
        console.log(coords)
        return (pathDistanceInMeters(coords)) / 1000;
    }

    /**
     * This resets the variables that track each recording so its fresh for the next recording
     */
    function resetRecording() {
        // hides the map
        setMyCoord(null)
        // resets the stops for the next recording
        setStops(prevStops => {
            return []
        })
        // reset coords for next recording
        setCoords(prevCoords => {
            return []
        })
    }
    /**
     * This function starts foreground location tracking and makes sure that the 
     * path is being tracked as the user moves.
     *
     * */
    async function startTracking() {
        setIsRecording(false);
        let perm = await Location.requestForegroundPermissionsAsync();
        setPermissionText(perm);
        if (perm.status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }

        // Shut down a foreground service subscription that's already running
        if (subscription !== null) {
            console.log('Stopping active location subscription service.')
            subscription.remove();
        }

        // Reset myCoord and coords state variables for new tracking session 
        resetRecording();
        // record the state time of a path
        setStartTime(prevTime => {
            return getCurrTime();
        })
        console.log('Starting location subscription service.')
        // changes and watches the updating position
        subscription = await Location.watchPositionAsync(               
            {
                accuracy: Location.Accuracy.BestForNavigation,
                distanceInterval: 20
            },
            newLocation => {
                const newCoord = {
                    latitude: newLocation.coords.latitude,
                    longitude: newLocation.coords.longitude
                }
                console.log('Moved to new coord.', newCoord);
                setMyCoord(prevMyCoord => {
                    return newCoord;
                });
                setCoords(prevCoords => {
                    return [...prevCoords, newCoord];
                });
            }
        );
    }

    /**
     * This function handles adding a stop on the path while recording
     */
    function addStop() {
        // makes the modal for entering a title & description for the stop available
        setModalVisible(false);
        // sets the title and information about the stop into variables
        let stopTitle = stopTitleInputValue;
        let stopMoreInfo = descInputValue;
        let stopCoord = myCoord
        let stopTime = getCurrTime()
        // creates the json object for the stop
        let newStop = {
            title: stopTitle,
            moreInfo: stopMoreInfo,
            time: stopTime,
            coord: stopCoord
        }
        // adds the stop into an array with the other stops that will be used when
        // creates the pathObj
        setStops(prevStops => {
            return [...prevStops, newStop]
        })
        console.log('added new stop', stopCoord)
    }
    /**
     * This function stops foreground location tracking and makes sure that
     * the path being tracked has all the additional data saved.
     * */ 
    function stopTracking() {
        console.log('stopping')
        if (subscription !== null) {
            console.log('Stopping active location subscription service.')
            subscription.remove();
        }
        // setting the end time, stopping the recording, and allowing users to choose whether
        // to choose to save or delete the recording
        setEndTime(prevTime => {
            return getCurrTime()
        })
        setIsRecording(true);
        setChooseAction(prevAction => {
            return true
        })
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* checks if the location services has been approved and started */}
            {(myCoord === null) ?
                <Text>Waiting for location to display map ...</Text> :
                // creates the MapView for the recording of the path
                <PathView
                    convertDate={convertDate}
                    myCoord={myCoord}
                    startCoord={coords[0]}
                    startTime={startTime}
                    endCoord={isRecording && coords[coords.length - 1]}
                    stopTime={endTime}
                    spots={stops}
                    coords={coords} />
            }
            {/* the buttons to start, stop and add stop */}
            <View style={styles.controls}>
                <Button
                    mode="outlined"
                    disabled={!isRecording}
                    style={color = 'green'}
                    buttonColor={'#c1d7ae'}
                    textColor={'#065535'}
                    labelStyle={styles.text}
                    onPress={() => startTracking()}>
                    Start Tracking
                </Button>
                <Button
                    mode="outlined"
                    disabled={isRecording}
                    style={color = 'yellow'}
                    buttonColor={'#fff8b6'}
                    textColor={'#ffc61a'}
                    labelStyle={styles.text}
                    onPress={() => enterDialog()}>
                    Add Stop
                </Button>
                <Button
                    mode="outlined"
                    disabled={isRecording}
                    buttonColor={'#c53d46'}
                    textColor={'#800020'}
                    labelStyle={styles.text}
                    onPress={() => stopTracking()}>
                    Stop Tracking
                </Button>
                {/* creates the modals to enter a title for a stop or the whole
                recording and whether or not the recording should be saved or delete */}
                <Modal animationType="slide"
                    transparent visible={isModalVisible}
                    presentationStyle="overFullScreen"
                >
                    <View style={styles.modalViewWrapper}>
                        <View style={styles.modalView}>
                            <TextInput placeholder="Enter a title..."
                                style={styles.input}
                                value={stopTitleInputValue}
                                onChangeText={(value) => setStopTitleInputValue(value)} />
                            <TextInput placeholder="(optional) Enter a description..."
                                style={styles.input}
                                multiline
                                numberOfLines={4}
                                value={descInputValue}
                                onChangeText={(value) => setDescInputValue(value)} />
                            {/** This button is responsible to close the modal */}
                            <Button
                                mode="contained"
                                labelStyle={styles.buttonText}
                                onPress={addStop}
                            >
                                Done
                            </Button>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="slide"
                    transparent visible={chooseAction}
                    presentationStyle="overFullScreen"
                >
                    <View style={styles.modalViewWrapper}>
                        <View style={styles.modalView}>
                            {/** This button is responsible to close the modal + saving path */}
                            <Button
                                style={styles.button}
                                mode="contained"
                                labelStyle={styles.buttonText}
                                onPress={getTitle}
                            >
                                Save Path Recording
                            </Button>
                            {/** this button is responsible for deleting the path + closing modal*/}
                            <Button
                                mode="contained"
                                labelStyle={styles.buttonText}
                                onPress={deletePath}>
                                Delete Path Recording
                            </Button>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="slide"
                    transparent visible={canEnterTitle}
                    presentationStyle="overFullScreen"
                >
                    <View style={styles.modalViewWrapper}>
                        <View style={styles.modalView}>
                            {needNewTitle && <Text> A path with this name already exists. Please enter a new name.</Text>}
                            <TextInput placeholder="Enter a title..."
                                style={styles.input}
                                value={title}
                                onChangeText={(value) => setTitle(value)} />
                            {/** This button is responsible to close the modal */}
                            <Button
                                mode="contained"
                                labelStyle={styles.buttonText}
                                onPress={savePath}>
                                Done
                            </Button>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

// style information for the page
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        width: '100%',
        height: '100%'
    },
    map: {
        flex: 2,
        width: '100%',
        height: '100%',
    },
    controls: {
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
    },
    data: {
        flex: 1
    },
    button: {
        margin: 10,
    },
    text: {
        fontSize: 20,
        textTransform: "capitalize"
    },
    modalViewWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    modalView: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        elevation: 5,
        transform: [{ translateX: -(width * 0.4) },
        { translateY: -90 }],
        height: 200,
        width: width * 0.8,
        backgroundColor: "#fff",
        borderRadius: 7,
    },
    textInput: {
        fontSize: 25,
        width: "80%",
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        marginBottom: 8,
    },
    textOutput: {
        fontSize: 25,
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'blue'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
});