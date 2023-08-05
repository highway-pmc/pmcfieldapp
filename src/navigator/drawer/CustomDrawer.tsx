import {View, Text, NativeEventEmitter} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CustomDrawer = ({navigation}: {navigation: any}) => {
  const eventEmitter = new NativeEventEmitter();
  const headerDetails = {title: 'Dashboard', showBack: false, backScreen: ''};
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Home');
          navigation.closeDrawer();
          eventEmitter.emit('headerEvent', headerDetails);
        }}>
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MyWork');
          navigation.closeDrawer();
        }}>
        <Text>My Work</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomDrawer;
