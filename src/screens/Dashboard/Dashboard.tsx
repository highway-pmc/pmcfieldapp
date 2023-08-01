import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import DrawerNavigator from '../../navigator/drawer/DrawerNavigator'

const Dashboard = ({navigation}:{navigation: any}) => {
  return (
    <View style={{flex: 1}}>
      <View style={styles.Container}>
        <TouchableOpacity style={styles.HeaderMenuContainer} onPress={() => {navigation.openDrawer()}}>
          <Image
            style={styles.HeaderTopMenuIcon}
            source={require('./../../images/menu-icon.png')} 
          />
          <Text style={styles.HeaderTextBold}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.HeaderMenuContainer}>
          <Image
            style={styles.TopMenuIcon}
            source={require('./../../images/avtar.png')}
          />
        </TouchableOpacity>
      </View>
      <DrawerNavigator />
      <View style={styles.Container}>
        <TouchableOpacity style={styles.MenuContainer}>
          <Image
            style={styles.TopMenuIcon}
            source={require('./../../images/home-icon.png')}
          />
          <Text style={styles.TextBold}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer}>
          <Image
            style={styles.TopMenuIcon}
            source={require('./../../images/rfi-icon.png')}
          />
          <Text style={styles.TextBold}>RFI's</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer}>
          <Image
            style={styles.TopMenuIcon}
            source={require('./../../images/report-icon.png')}
          />
          <Text style={styles.TextBold}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer}>
          <Image
            style={styles.TopMenuIcon}
            source={require('./../../images/notification-icon.png')}
          />
          <Text style={styles.TextBold}>Notification</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
  },
  HeaderMenuContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start'
  },
  HeaderTextBold: {
    fontWeight: '700',
    fontSize: 18,
    color: '#333'
  },
  HeaderTopMenuIcon: {
    width: 24,
    height: 24,
    borderWidth: 1,
    marginRight: 5,
  },
});

export default Dashboard