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
export default function PathView({ convertDate, myCoord, startCoord, startTime, endCoord, stopTime, spots, coords }) {
    
    return (
        <MapView style={styles.map}
        // contains the intial region of the map being displayed
            initialRegion={{
                latitude: myCoord.latitude,
                longitude: myCoord.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            }}
            showsCompass={true}
            showsUserLocation={true}
            rotateEnabled={true}>
            {/* checks if there is a current coordinate, and if so, put a purple pin to indicate 
            where the user is*/}
            {myCoord && <Marker key='myLocation'
                coordinate={myCoord}
                pinColor='purple'
                title='My location'>
                    </Marker>}
            {/* checks if there is a start coordinate provided, and if so, places a green pin */}
            {startCoord &&
                <Marker key='start'
                    coordinate={startCoord}
                    pinColor='green'
                    title='Start'
                    description={convertDate(startTime)}>
                </Marker>}
            {/* checks if there is an end coordinate and if so, places a red pin */}
            {endCoord &&
                <Marker key='stop'
                    coordinate={endCoord}
                    pinColor='red'
                    title='Stop'
                    description={convertDate(stopTime)}
                >
                </Marker>}
            {/* checks if there is an array of spots, and if so, puts a yellow pin down
            for every spot */}
            {spots &&
                spots.map(spot =>
                    <Marker key={spot.title}
                        coordinate={spot.coord}
                        pinColor='yellow'
                        title={spot.title}
                        description={convertDate(spot.time) + spot.moreInfo}
                    >
                    </Marker>
                )
            }
            {/* checks for a list of coordinates, and creates a polyline based on the list
            of coordinates */}
            {coords && <Polyline
                coordinates={coords}
                strokeWidth={4}
                strokeColor={'blue'}
            />}
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