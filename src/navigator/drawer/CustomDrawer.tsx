import {View, Text, StyleSheet, Button, Image, } from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CustomDrawer = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.Container}>
      <View style={styles.ProfileContainer}>
        <View>
          <View style={styles.ProfileIcon}>
            <Image style={styles.ProfileIcon} source={require('./../../images/avtar.png')} />
          </View>
          <Text style={styles.ProfileName}>Rishi Kant</Text>
          <Text style={styles.ProfileRole}>Project Head</Text>
          <TouchableOpacity style={styles.ViewButton}>
            <Text style={styles.ViewText}>View</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.CloseContainer}  onPress={() => {navigation.closeDrawer()}}>
          <Image style={styles.CloseIcon} source={require('./../../images/menu/close-icon.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.NavigationContainer}>
        <TouchableOpacity style={styles.MenuContainer} onPress={() => { navigation.navigate('MyWork'); navigation.closeDrawer();}}>
          <Image style={styles.MenuIcon} source={require('./../../images/menu/mywork-icon.png')} />
          <Text style={styles.MenuText}>My Work</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer} onPress={() => { navigation.navigate('MyWork'); navigation.closeDrawer();}}>
          <Image style={styles.MenuIcon} source={require('./../../images/menu/manage-icon.png')} />
          <Text style={styles.MenuText}>Manage User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer} onPress={() => { navigation.navigate('MyWork'); navigation.closeDrawer();}}>
          <Image style={styles.MenuIcon} source={require('./../../images/menu/report-menu-icon.png')} />
          <Text style={styles.MenuText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer} onPress={() => { navigation.navigate('MyWork'); navigation.closeDrawer();}}>
          <Image style={styles.MenuIcon} source={require('./../../images/menu/progress-dash-icon.png')} />
          <Text style={styles.MenuText}>Progress Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer} onPress={() => { navigation.navigate('MyWork'); navigation.closeDrawer();}}>
          <Image style={styles.MenuIcon} source={require('./../../images/menu/manage-rfi-icom.png')} />
          <Text style={styles.MenuText}>Manage FRI’s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer} onPress={() => { navigation.navigate('MyWork'); navigation.closeDrawer();}}>
          <Image style={styles.MenuIcon} source={require('./../../images/menu/logout-icon.png')} />
          <Text style={styles.MenuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#1C58C0',
    padding: 20,
    position: 'relative'
  },
  ProfileContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ProfileIcon: {
    width: 72,
    height: 72,
    marginBottom: 10
  },
  ProfileName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff'
  },
  ProfileRole: {
    fontSize: 16,
    fontWeight: '600',
    color: '#AAC7FF'
  },
  ViewButton: {
    width: 60,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCDCDC',
    borderRadius: 4,
    marginTop: 15,
  },
  ViewText: {
    color: '#1C58C0',
    fontSize: 14,
    fontWeight: '600'
  },
  NavigationContainer: {
    flex: 1,
    marginTop: 15,
  },
  MenuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  MenuIcon: {
    width: 30,
    height: 30,
    marginRight: 10
  },
  MenuText: {
    fontSize : 16,
    fontWeight: '400',
    color: '#fff'
  },
  CloseContainer: {
    width: 24,
    height: 24,
    marginTop:15,
  },
  CloseIcon: {
    width: 24,
    height: 24,

  }
});

export default CustomDrawer;
