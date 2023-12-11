/*
 * Author: Amanda Cheung with help from:
 * Lyn from https://chafikgharbi.com/expo-location-tracking/
 * Lyn from https://snack.expo.dev/@fturbak/reactnativepaperbuttons 
 * Modified date: 12/10/23
 * Class: CAMS 301
 */

// imports all necessary tools for the project
import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import DetailsPScreen from './components/DetailsPScreen';
import DisplayPScreen from './components/DisplayPScreen';
import RecordingPScreen from './components/RecordingPScreen';
import DefaultPins from './DefaultPins'
import * as PathStore from './PathStore.js'
import * as utils from "./utils.js";

export default function App() {
  // state variables
  // sets the initial state for the psuedoscreens to be summary
  const [pscreen, setPscreen] = useState("display_pscreen");
  // state variable that contains all the pins that are stored on the device
  const [pins, setPins] = useState(DefaultPins);
  // state variable that contains the specific recording that is being selected to be displayed
  const [chosenPin, setChosenPin] = useState(null);
  // contains the new paths that are just created and not yet in storage
  const [newPaths, setNewPaths] = useState([]);

  // // initializes and loads the paths that are in storage onto the app
  // useEffect(() => {
  //   async function addPersistentPaths() {
  //     const persistentPaths = await PathStore.init();
  //     console.log(`In useEffect, have ${persistentPaths.length} saved paths`);
  //     combineWithSamplePaths(persistentPaths);
  //   }
  //   addPersistentPaths();
  // }, []);

  /**
   * This function converts a date object from an ISO string to a human readable object
   * @param date: a date object to convert it to be readable
   * @returns: the new object that is readable to humans
   */
  function convertDate(date) {
    readableDate = new Date(date)
    return readableDate.toLocaleString()
  }


  /**
   * This function merges together the path lists so that all of them will be displayed in the flatlist
   * @param oldPaths: the paths that are in persistent storage
   * @param newPaths: the paths that are actively being recorded
   * @returns the list of paths that will be displayed in the flatlist
   */
  // function mergePathList(oldPaths, newPaths){
  //   if (oldPaths && newPaths){
  //     return oldPaths.concat(newPaths)
  //   }
  //   else{
  //     return oldPaths
  //   }
  // }
  return (
    <SafeAreaView style={styles.container}>
      {/* creates if statements for deteriming which psuedoscreen is displayed */}
      {pscreen === "details_pscreen" &&
        <DetailsPScreen chosenPin={chosenPin}/>
      }
      {pscreen === "display_pscreen" &&
        <DisplayPScreen allPins={pins}/>
      }
      {pscreen === "recording_pscreen" &&
        <RecordingPScreen allPins = {pins} setAllPins={setPins} setPScreen={setPscreen} setChosenPin={setChosenPin}/>
      }
      {/* segemented buttons for the bottom of the screen to display each psuedoscreen option */}
      <SegmentedButtons
        value={pscreen}
        onValueChange={setPscreen}
        buttons={[
          {
            value: 'display_pscreen',
            label: 'Home',
          },
          {
            value: 'recording_pscreen',
            label: 'Manage Pins',
          },
        ]}
      />
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
  },
});