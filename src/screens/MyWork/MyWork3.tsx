import { View, Text, NativeEventEmitter, ScrollView, Button, StyleSheet } from 'react-native'
import React from 'react'
import { useIsFocused } from '@react-navigation/native';

const MyWork3 = ({navigation}) => {
  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', { showBack: true, title: 'My Work 3', backScreen: 'MyWork2' });
  }
  return (
    <ScrollView style={styles.Container}>
      <View>
        <Text>MyWork3</Text>
        
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    paddingVertical: 10,
    padding: 15,
  },
});

export default MyWork3