import { Text, SafeAreaView, StyleSheet } from 'react-native';
import PathView from "./PathView";
import { useState } from 'react';
import { Button } from "react-native-paper";
import * as Location from 'expo-location';

let subscription = null; // location tracking service

/**
 * This file contains information needed to display the Display psuedoscreen
 * This contains the markers and start and end points for a recording
 * @author // Amanda Cheung with help from Lyn's snack https://snack.expo.dev/@fturbak/wellesleymapdraggablemarkerspolylinedistance 
 */
export default function DisplayPScreen({ allPins }) {
    const [permissionText, setPermissionText]
        = useState('Location permission not requested yet');
    const [myCoord, setMyCoord] = useState(null)

    /**
    //  * This function starts foreground location tracking and makes sure that the 
    //  * path is being tracked as the user moves.
    //  *
    //  * */
    async function startTracking() {
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
    return (
        <SafeAreaView style={styles.container}>
            {
                // (subscription === null) ?
                //     <Button
                //         mode="outlined"
                //         style={color = 'yellow'}
                //         buttonColor={'#fff8b6'}
                //         textColor={'#ffc61a'}
                //         labelStyle={styles.text}
                //         onPress={() => startTracking()}>
                //         Enable Location
                //     </Button> :
                    (allPins === null) ?
                        <Text>No path yet</Text> :
                        // creates a MapView object through PathView which sets up the map display
                        <PathView
                            myCoord={{
                                'latitude': 42.294613,
                                'longitude':-71.3075}}
                            pins={allPins} />
            }
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
        height: '100%'
    },
    title: {
        fontSize: 28
    }
});