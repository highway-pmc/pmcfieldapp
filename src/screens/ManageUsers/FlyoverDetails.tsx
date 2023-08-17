import { View, Text, TouchableOpacity, NativeEventEmitter } from 'react-native'
import React from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems } from '../../constants/constants';

const FlyoverDetails = ({navigation: any}:{navigation: any}, props: any) => {
    if (useIsFocused()) {
        const eventEmitter = new NativeEventEmitter();
        eventEmitter.emit('headerEvent', HeaderItems.flyoverDetails);
      }
      const receivedData = props.dataProp;

      
  return (
    <View>
      <Text>FlyoverDetails</Text>
    </View>
  )
}

export default FlyoverDetails