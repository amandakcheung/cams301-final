import { Text, SafeAreaView, StyleSheet } from 'react-native';
import PathView from "./PathView";
/**
 * This file contains information needed to display the Display psuedoscreen
 * This contains the markers and start and end points for a recording
 * @author // Amanda Cheung with help from Lyn's snack https://snack.expo.dev/@fturbak/wellesleymapdraggablemarkerspolylinedistance 
 * @param pathToDisplay: the information of the path that is being displayed
 * @param convertDate: the function to convert a date to be readable
 */
export default function DisplayPScreen({ pathToDisplay, convertDate }) {
  // variables to display the start and end coordinates- checks if there is a path selected
  if (pathToDisplay){
  startCoord = pathToDisplay.coords[0]
  endCoord = pathToDisplay.coords[pathToDisplay.coords.length - 1]
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* checks if the pathToDisplay has been initialized, if not then nothing, if yes then shows the path*/}
      {pathToDisplay && <Text style={styles.title}>{pathToDisplay.name} </Text>}
      {(pathToDisplay === null) ?
        <Text>No path yet</Text> :
        // creates a MapView object through PathView which sets up the map display
        <PathView 
          convertDate={convertDate}
          myCoord={startCoord}
          startCoord={startCoord} 
          startTime={pathToDisplay.startTime} 
          endCoord={endCoord} 
          stopTime={pathToDisplay.stopTime}
          spots={pathToDisplay.spots}
          coords={pathToDisplay.coords} />
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