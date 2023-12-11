// defining a PathView component that is used by both the Display PseudoScreen
// and the Recording PseudoScreen for displaying a map with a Polyline Path and
// appropriate markers for that pseudoScreen. 
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from "react-native-maps";

/**
 * This function creates an object PathView which is a MapView of the path that is being displayed
 * or recorded
 * @param convertDate: a function that converts a date from an ISO date to a human readable date object
 * @param myCoord: the current coordinate of the user
 * @param startCoord: the start coordinate of the path
 * @param startTime: the start time for the path
 * @param endCoord: the end coordinate of the path
 * @param stopTime: the end time of the path
 * @param spots: an array of all the spots in the path
 * @param coords: an list of all the coordinates in the path
 * @returns MapView of the path with all the parameters entered
 */
export default function PathView({ myCoord, pins }) {
    console.log('mycoord' + myCoord)
    console.log('pins' + JSON.stringify(pins))

    return (
        <MapView style={styles.map}
        // contains the intial region of the map being displayed
            initialRegion={{
                latitude: myCoord.latitude,
                longitude: myCoord.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
            showsCompass={true}
            showsUserLocation={true}
            rotateEnabled={true}>
                {/* check if it is security camera */}
            {pins &&
                pins.map(pin =>
                    pin.type == 'security camera' &&
                        <Marker key={pin.desc}
                            coordinate={pin.coords}
                            pinColor='red'
                            title={pin.type}
                            description={pin.desc}
                        >
                        </Marker>
                )
            }
            {pins &&
                pins.map(pin =>
                    pin.type == 'card reader' &&
                        <Marker key={pin.desc}
                            coordinate={pin.coords}
                            pinColor='green'
                            title={pin.type}
                            description={pin.desc}
                        >
                        </Marker>
                )
            }
            {pins &&
                pins.map(pin =>
                    pin.type == 'police station' &&
                        <Marker key={pin.desc}
                            coordinate={pin.coords}
                            pinColor='black'
                            title={pin.type}
                            description={pin.desc}
                        >
                        </Marker>
                )
            }
            {pins &&
                pins.map(pin =>
                    pin.type == 'blue buttons' &&
                        <Marker key={pin.desc}
                            coordinate={pin.coords}
                            pinColor='blue'
                            title={pin.type}
                            description={pin.desc}
                        >
                        </Marker>
                )
            }
        </MapView >
    )
}
// style information for the page
const styles = StyleSheet.create({
    map: {
        flex: 2,
        width: '100%',
        height: '100%',
    }
});