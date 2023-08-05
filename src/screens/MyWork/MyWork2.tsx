import { View, Text, NativeEventEmitter, ScrollView, Button, StyleSheet } from 'react-native'
import React from 'react'
import { useIsFocused } from '@react-navigation/native';

const MyWork2 = ({navigation}) => {
  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', { showBack: true, title: 'My Work 2', backScreen: 'MyWork' });
  }
  return (
    <ScrollView style={styles.Container}>
      <View>
        <Text>MyWork 2</Text>
        <Button
          title="Go to My work 3"
          onPress={() => navigation.navigate("MyWork3")}
        />
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

export default MyWork2