import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import DrawerNavigator from '../../navigator/drawer/DrawerNavigator'

const Dashboard = () => {
  return (
    <View style={{flex: 1}}>
      <DrawerNavigator />
      <View style={styles.Container}>
        <TouchableOpacity style={styles.MenuContainer}>
          <Image style={styles.TopMenuIcon} source={require('./../../images/home-icon.png')} />
          <Text style={styles.TextBold}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer}>
          <Image style={styles.TopMenuIcon} source={require('./../../images/rfi-icon.png')} />
          <Text style={styles.TextBold}>RFI's</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer}>
          <Image style={styles.TopMenuIcon} source={require('./../../images/report-icon.png')} />
          <Text style={styles.TextBold}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer}>
          <Image style={styles.TopMenuIcon} source={require('./../../images/notification-icon.png')} />
          <Text style={styles.TextBold}>Notification</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
    padding: 15,
  },
  TopMenuIcon: {
    width: 28,
    height: 28,
  },
  MenuContainer: {
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  TextBold: {
    fontWeight: '700',
    fontSize: 14,
  }
});

export default Dashboard