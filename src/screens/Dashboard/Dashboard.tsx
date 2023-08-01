import { View, Text } from 'react-native'
import React from 'react'
import DrawerNavigator from '../../navigator/drawer/DrawerNavigator'

const Dashboard = () => {
  return (
    <View style={{flex: 1}}>
      <DrawerNavigator />
    </View>
  )
}

export default Dashboard