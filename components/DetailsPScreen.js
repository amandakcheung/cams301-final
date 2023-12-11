import { Text, SafeAreaView, StyleSheet, View} from 'react-native';
import PathView from "./PathView";
import { useState } from 'react';
import { Button } from "react-native-paper";
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import MapView, { Marker, Polyline } from "react-native-maps";



/**
 * This file contains information needed to display the Display psuedoscreen
 * This contains the markers and start and end points for a recording
 * @author // Amanda Cheung with help from Lyn's snack https://snack.expo.dev/@fturbak/wellesleymapdraggablemarkerspolylinedistance 
 */
export default function DetailsPScreen({ chosenPin }) {
    const pinArray = [];
    pinArray.push(chosenPin)
    return (
        <SafeAreaView style={styles.container}>
            {/* checks if the pathToDisplay has been initialized, if not then nothing, if yes then shows the path*/}
            {chosenPin && <Text style={styles.title}>{chosenPin.desc} </Text>}
            {(chosenPin === null) ?
                <Text>No path selected yet</Text> :
                // creates a MapView object through PathView which sets up the map display
                <PathView
                    myCoord={chosenPin.coords}
                    pins={pinArray} />
            }
            <View style={styles.description}>
                <Text style={styles.descWords}>
                    Type of Surveillance: {chosenPin.type}
                </Text>
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
        height: '100%',
    },
    listWrapper: {
      height: '75%', 
      width: '95%',
    },
    list: {
      borderWidth: 1,
      borderColor: 'blue'
    },
    listItem: {
      flexDirection: "row",
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
      backgroundColor: '#f9c2ff',
    },
    listItemText: {
      fontSize: 20,
    },
    map: {
        flex: 2,
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 25,
        paddingTop: 30,
        fontWeight: 'bold'
    },
    description: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingTop: 10,
    },
    descWords:{
        fontSize: 20,
    }
  });