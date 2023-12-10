import { FlatList, Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
/**
 * This file contains the information for the Summary Psuedoscreen
 * @author // Amanda Cheung with help from Lyn's snack https://snack.expo.dev/@fturbak/animal-images-with-flatlist
 * @param myPaths: contains the paths that exist already from local storage
 * @param setChosenPath: sets the state variable chosenPath which is the path that needs to be displayed
 * @param setPScreen: sets the screen to the display pscreen when there is a path chosen
 * @param convertDate: the convertDate method that changes the date from an ISO string to a human readable string
 */
export default function SummaryPScreen({myPaths, setChosenPath, setPScreen, convertDate}) {
  /**
   * This function sets the state variable chosenPath which will be displayed and 
   * also changes the PScreen to DisplayPScreen.js
   * @param path: contains the json information for the date needing to be displayed
   */
  function chosePath(path){
      setChosenPath(path);
      setPScreen((prevState)=>{
        return 'display_pscreen'
      });
  }

  // creates a ListItem that contains the information in a summary for each path
  const ListItem = props => {
    return (
      <TouchableOpacity
        onPress={() => chosePath(props.text)}
      >
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>Name: {props.text.name} {"\n"} 
          Date/Time of Start: {convertDate(props.text.startTime)} {"\n"}
          Total Length (in km): {props.text.pathDistance} km</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
      <View style={styles.listWrapper}>
        {/* creates a flatlist consisting of every item that needs to go into the flatlist */}
        <FlatList style={styles.list}
          data={myPaths}
          renderItem={datum => <ListItem key={datum.item.name} text={datum.item}></ListItem>}
          keyExtractor={item => item.name}
        />
      </View>
  );
}

// style information for the page
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
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

});