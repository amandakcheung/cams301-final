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
import { Text, View, SafeAreaView, StyleSheet, Dimensions, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import * as Location from 'expo-location';
import * as PathStore from '../PathStore.js';
import { Button } from "react-native-paper";
import PathView from "./PathView";
import NewPin from "./NewPin";
import ModalDropdown from 'react-native-modal-dropdown';
import DisplayPScreen from './DisplayPScreen.js';

const { width } = Dimensions.get("window");

let subscription = null; // location tracking service

export default function RecordingPScreen({ allPins, setAllPins, setPScreen, setChosenPin }) {
    // state variables used for recording
    // checks permission to access location
    const [permissionText, setPermissionText] = useState('Location permission not requested yet');
    // sets the current location of the user and continues to update with the tracker
    const [myCoord, setMyCoord] = useState(null);
    // all coordinates crossed in the path
    const [coords, setCoords] = useState([]);
    // the title of the path
    const [type, setType] = useState('');
    // toggles whether or not the modal for stop title is displayed
    const [visible, setVisible] = useState(false);
    // description
    const [desc, setDesc] = useState('')

    const [selectedOption, setSelectedOption] = useState('Select an option');
    const options = [
        'security camera',
        'card reader',
        'police station',
        'blue buttons'
    ];
    const handleOptionSelect = (index, value) => {
        setSelectedOption(value);
        setType(value);
    };
    /**
   * This function sets the state variable chosenPath which will be displayed and 
   * also changes the PScreen to DisplayPScreen.js
   * @param path: contains the json information for the date needing to be displayed
   */
    function choosePin(pin) {
        setChosenPin(pin);
        setPScreen((prevState) => {
            return 'details_pscreen'
        });
    }

    // creates a ListItem that contains the information in a summary for each path
    const ListItem = props => {
        return (
            <TouchableOpacity
                onPress={() => choosePin(props.text)}
            >
                <View style={styles.listItem}>
                    <Text style={styles.listItemText}>Type: {props.text.type} {"\n"}
                        Description: {props.text.desc} {"\n"}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    /**
    //  * This function starts foreground location tracking and makes sure that the 
    //  * path is being tracked as the user moves.
    //  *
    //  * */
    async function startTracking() {
        setVisible(true)
        console.log('started tracking')
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
        console.log('Starting location subscription service.')
        // changes and watches the updating position
        subscription = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.BestForNavigation,
                distanceInterval: 1
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
            }
        );
    }
    /**
     * This function takes in all the inputs that have been put in 
     * and creates it into a path object (JSON)
     * @returns the new path that is saved
     */
    function createPin() {

        let newPin = {
            "type": type,
            "desc": desc,
            "coords": myCoord
        }
        return newPin
    }
    function savePin() {
        startTracking();
        console.log(JSON.stringify(myCoord))
        setVisible(false);
        setAllPins((prevPins => {
            return [...prevPins, createPin()]
        }))
        setPScreen('recording_pscreen');
    }
    return (
        <SafeAreaView style={styles.container}>
            {/* checks if the location services has been approved and started */}
            <PathView
                myCoord={{
                    'latitude': 42.294613,
                    'longitude': -71.3075
                }}
                pins={allPins} />
            <View style={styles.listWrapper}>
                {/* creates a flatlist consisting of every item that needs to go into the flatlist */}
                <FlatList style={styles.list}
                    data={allPins}
                    renderItem={datum => <ListItem key={datum.item.desc} text={datum.item}></ListItem>}
                    keyExtractor={item => item.desc}
                />
            </View>
            <View style={styles.controls}>
                <Button
                    mode="outlined"
                    style={color = 'green'}
                    buttonColor={'#c1d7ae'}
                    textColor={'#065535'}
                    labelStyle={styles.text}
                    onPress={() =>  startTracking()}>
                    Create New Pin
                </Button>
            </View>
            <Modal animationType="slide"
                transparent visible={visible}
                presentationStyle="overFullScreen">
                <View style={styles.modalViewWrapper}>
                    <View style={styles.modalView}>
                        <ModalDropdown style={styles.input}
                            options={options}
                            defaultValue={selectedOption}
                            onSelect={handleOptionSelect}
                        />
                        {/* <Text>Selected option: {selectedOption}</Text> */}
                        <TextInput placeholder="Enter a description (optional)..."
                            style={styles.input}
                            value={desc}
                            onChangeText={(value) => setDesc(value)} />
                        {/** This button is responsible to close the modal + saving path */}
                        <Button
                            style={styles.button}
                            mode="contained"
                            labelStyle={styles.buttonText}
                            onPress={savePin}
                        >
                            Save Pin
                        </Button>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>

    )
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
    },
    listWrapper: {
        height: '45%',
        width: '95%',
    },
    listItem: {
        flexDirection: "row",
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#f9c2ff',
    },
    list: {
        borderWidth: 1,
        borderColor: 'blue'
    },
});