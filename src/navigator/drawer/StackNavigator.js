import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MyWork from "../../screens/MyWork/MyWork";
import MyWork2 from "../../screens/MyWork/MyWork2";
import CustomHeader from "../../screens/Dashboard/CustomHeader";
import MyWork3 from "../../screens/MyWork/MyWork3";

const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

// const MainStackNavigator = () => {
//   return (
//     <Stack.Navigator screenOptions={screenOptionStyle}>
//       <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
//       <Stack.Screen name="About" component={About} />
//       <Stack.Screen name="About2" component={About2} />
//     </Stack.Navigator>
//   );
// };

const MyWorkStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="MyWork" component={MyWork} options={{headerShown: false}} />
      <Stack.Screen name="MyWork2" component={MyWork2} options={{headerShown: false}} />
      <Stack.Screen name="MyWork3" component={MyWork3} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

export { /*MainStackNavigator,*/ MyWorkStackNavigator };
