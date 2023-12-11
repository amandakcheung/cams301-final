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
 * @param pathToDisplay: the information of the path that is being displayed
 * @param convertDate: the function to convert a date to be readable
 */
export default function DisplayPScreen({ chosenPin }) {

}