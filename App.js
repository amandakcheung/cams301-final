/*
 * Author: Amanda Cheung with help from:
 * Lyn from https://chafikgharbi.com/expo-location-tracking/
 * Lyn from https://snack.expo.dev/@fturbak/reactnativepaperbuttons 
 * Modified date: 11/30/23
 * Class: CS317
 */

// imports all necessary tools for the project
import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import DetailsPScreen from './components/DetailsPScreen';
import DisplayPScreen from './components/DisplayPScreen';
import RecordingPScreen from './components/RecordingPScreen';
import * as PathStore from './PathStore.js'
import * as utils from "./utils.js";

export default function App() {
  // state variables
  // sets the initial state for the psuedoscreens to be summary
  const [pscreen, setPscreen] = useState("details_pscreen");
  // state variable that contains all the paths that are stored on the device
  const [paths, setPaths] = useState(null);
  // state variable that contains the specific recording that is being selected to be displayed
  const [chosenPath, setChosenPath] = useState(null);
  // contains all of the names of the paths
  const [allNames, setAllNames] = useState([]);
  // contains the new paths that are just created and not yet in storage
  const [newPaths, setNewPaths] = useState([]);

  // initializes and loads the paths that are in storage onto the app
  useEffect(() => {
    async function addPersistentPaths() {
      const persistentPaths = await PathStore.init();
      console.log(`In useEffect, have ${persistentPaths.length} saved paths`);
      combineWithSamplePaths(persistentPaths);
    }
    addPersistentPaths();
  }, []);


  /**
   * This function takes the names of all the paths that already existed and adds them into a list
   * that contains all of the names. 
   * This function is used to ensure that no two paths can have the same name
   * @param samplePaths: contains the paths from the samplePath.js document
   * @param persistentPaths: contains the paths that are in persistent storage on the local device
   */
  function getPathNames(samplePaths, persistentPaths, newPaths) {
    let allNames = []
    let allPaths = mergePathList(samplePaths, persistentPaths)
    allPaths = mergePathList(allPaths, newPaths)
    utils.range(allPaths.length).map((i) => allNames.push(allPaths[i].name))
    setAllNames((prevList => {
      return allNames
    }))
  }

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
  function mergePathList(oldPaths, newPaths){
    if (oldPaths && newPaths){
      return oldPaths.concat(newPaths)
    }
    else{
      return oldPaths
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* creates if statements for deteriming which psuedoscreen is displayed */}
      {pscreen === "details_pscreen" &&
        <DetailsPScreen myPaths={mergePathList(paths, newPaths)} setChosenPath={setChosenPath} setPScreen={setPscreen} convertDate={convertDate} />
      }
      {pscreen === "display_pscreen" &&
        <DisplayPScreen pathToDisplay={chosenPath} convertDate={convertDate} />
      }
      {pscreen === "recording_pscreen" &&
        <RecordingPScreen allNames={allNames} convertDate={convertDate} setNewPaths={setNewPaths} setAllNames={setAllNames}/>
      }
      {/* segemented buttons for the bottom of the screen to display each psuedoscreen option */}
      <SegmentedButtons
        value={pscreen}
        onValueChange={setPscreen}
        buttons={[
          {
            value: 'details_pscreen',
            label: 'Detail',
          },
          {
            value: 'display_pscreen',
            label: 'Display',
          },
          {
            value: 'recording_pscreen',
            label: 'Recording',
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