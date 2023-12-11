// // defining a PathView component that is used by both the Display PseudoScreen
// // and the Recording PseudoScreen for displaying a map with a Polyline Path and
// // appropriate markers for that pseudoScreen. 
// import { Text, View, SafeAreaView, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
// import MapView, { Marker, Polyline } from "react-native-maps";
// import { Modal } from 'react-native-paper';
// import ModalDropdown from 'react-native-modal-dropdown';




// /**
//  * This function creates an object PathView which is a MapView of the path that is being displayed
//  * or recorded
//  * @param convertDate: a function that converts a date from an ISO date to a human readable date object
//  * @param myCoord: the current coordinate of the user
//  * @param startCoord: the start coordinate of the path
//  * @param startTime: the start time for the path
//  * @param endCoord: the end coordinate of the path
//  * @param stopTime: the end time of the path
//  * @param spots: an array of all the spots in the path
//  * @param coords: an list of all the coordinates in the path
//  * @returns MapView of the path with all the parameters entered
//  */
// export default function NewPin({ myCoord, visible, setVisible, setType, setDesc, setCoords, coords, setAllPins}) {
//     console.log(myCoord)
//     const [selectedOption, setSelectedOption] = useState('Select an option');
//     const options = [
//         'security camera',
//         'card readers',
//         'police station',
//         'blue buttons'
//     ];
//     const handleOptionSelect = (index, value) => {
//         setSelectedOption(value);
//         setType(value);
//     };
//  /**
//      * This function takes in all the inputs that have been put in 
//      * and creates it into a path object (JSON)
//      * @returns the new path that is saved
//      */
//     function createPin() {
//         let newPin = {
//             "type": type,
//             "desc": desc,
//             "coords": myCoord
//         }
//         return newPin
//     }
//     function savePin(){
//         setVisible(false);
//         setAllPins((prevPins => {
//             return [...prevPins, createPin()]}))
//         setPscreen('recording_pscreen');
//         }

//     return (
//         <Modal animationType="slide"
//             transparent visible={visible}
//             presentationStyle="overFullScreen">
//             <View style={styles.modalViewWrapper}>
//                 <View style={styles.modalView}>
//                     <ModalDropdown
//                         options={options}
//                         defaultValue={selectedOption}
//                         onSelect={handleOptionSelect}
//                         style={styles.dropdown}
//                         textStyle={styles.dropdownText}
//                         dropdownStyle={styles.dropdownDropdown}
//                         dropdownTextStyle={styles.dropdownDropdownText}
//                     />
//                     {/* <Text>Selected option: {selectedOption}</Text> */}
//                     <TextInput placeholder="Enter a description (optional)..."
//                                 style={styles.input}
//                                 value={desc}
//                                 onChangeText={(value) => setDesc(value)} />
//                     {/** This button is responsible to close the modal + saving path */}
//                     <Button
//                         style={styles.button}
//                         mode="contained"
//                         labelStyle={styles.buttonText}
//                         onPress={savePin}
//                     >
//                         Save Pin
//                     </Button>
//                 </View>
//             </View>
//         </Modal>
//     )
// }
// // style information for the page
// const styles = StyleSheet.create({
//     map: {
//         flex: 2,
//         width: '100%',
//         height: '100%',
//     },
//       dropdown: {
//         width: 150,
//         borderWidth: 1,
//         borderColor: 'gray',
//         padding: 5,
//       },
//       dropdownText: {
//         fontSize: 18,
//       },
//       dropdownDropdown: {
//         width: 150,
//         height: 200,
//         borderColor: 'gray',
//         borderWidth: 1,
//       },
//       dropdownDropdownText: {
//         fontSize: 18,
//       },
//       container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 20,
//         width: '100%',
//         height: '100%'
//     },
//     controls: {
//         marginTop: 10,
//         padding: 10,
//         borderRadius: 10,
//     },
//     data: {
//         flex: 1
//     },
//     button: {
//         margin: 10,
//     },
//     text: {
//         fontSize: 20,
//         textTransform: "capitalize"
//     },
//     modalViewWrapper: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "rgba(0, 0, 0, 0.2)",
//     },
//     modalView: {
//         alignItems: "center",
//         justifyContent: "center",
//         position: "absolute",
//         top: "50%",
//         left: "50%",
//         elevation: 5,
//         transform: [{ translateX: -(width * 0.4) },
//         { translateY: -90 }],
//         height: 200,
//         width: width * 0.8,
//         backgroundColor: "#fff",
//         borderRadius: 7,
//     },
//     textInput: {
//         fontSize: 25,
//         width: "80%",
//         borderRadius: 5,
//         paddingVertical: 8,
//         paddingHorizontal: 16,
//         borderColor: "rgba(0, 0, 0, 0.2)",
//         borderWidth: 1,
//         marginBottom: 8,
//     },
//     textOutput: {
//         fontSize: 25,
//         margin: 10,
//         padding: 10,
//         borderWidth: 1,
//         borderStyle: 'dashed',
//         borderColor: 'blue'
//     },
//     input: {
//         height: 40,
//         margin: 12,
//         borderWidth: 1,
//         padding: 10,
//     }
// });