import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator,createDrawerNavigator} from 'react-navigation';

import Homescreen from './screens/Homescreen';
import Addscreen from './screens/Addscreen';
import Editscreen from './screens/Editscreen';

// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>Hello World</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

export default createDrawerNavigator({
  Home: {
    screen: Homescreen,
  },
  Add:{
    screen:Addscreen,
  },
  Edit:{
      screen:Editscreen
  },
}, {
    initialRouteName: 'Home',
});
