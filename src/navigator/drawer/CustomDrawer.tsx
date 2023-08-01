import {View, Text} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CustomDrawer = ({navigation}: {navigation: any}) => {
  return (
    <View>
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
