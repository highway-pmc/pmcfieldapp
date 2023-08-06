// HomeScreen.js
import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  NativeEventEmitter,
  FlatList,
} from 'react-native';
import { Dashboard_MENU, HeaderItems } from '../../constants/constants';
import { useSelector } from 'react-redux';

const DashboardListing = ({ navigation }: { navigation: any }) => {

  const loggedInUser = useSelector(state => state.Auth.user);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.dashboard);
  }

  return (
    <ScrollView style={styles.Container}>
      <FlatList data={Dashboard_MENU}
        renderItem={({ item }) =>
          item.permissions.indexOf(loggedInUser.role) != -1 &&
          <TouchableOpacity style={styles.MenuContainer} onPress={() => {
            navigation.navigate(item.route);
            navigation.closeDrawer();
          }}>
            <Image style={styles.TopMenuIcon} source={item.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.TextBold}>{item.title}</Text>
              <Text style={styles.SubText}>{item.subTitle}</Text>
            </View>
          </TouchableOpacity>
        }
      />

      {/* <TouchableOpacity style={styles.MenuContainer} onPress={() => {
          navigation.navigate('MyWork');
          navigation.closeDrawer();
        }}>
        <Image style={styles.TopMenuIcon} source={require('./../../images/dashboard/my-work-icon.png')} />
        <View style={styles.textContainer}>
          <Text style={styles.TextBold}>My Work</Text>
          <Text style={styles.SubText}>Check your task</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.MenuContainer} onPress={() => {
          navigation.navigate('ManageUsers');
          navigation.closeDrawer();
        }}>
        <Image style={styles.TopMenuIcon} source={require('./../../images/dashboard/manage-user-icon.png')} />
        <View style={styles.textContainer}>
          <Text style={styles.TextBold}>Manage User</Text>
          <Text style={styles.SubText}>Check user</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.MenuContainer} onPress={() => {
          navigation.navigate('Reports');
          navigation.closeDrawer();
        }}>
        <Image style={styles.TopMenuIcon} source={require('./../../images/dashboard/report-list-icon.png')} />
        <View style={styles.textContainer}>
          <Text style={styles.TextBold}>Report</Text>
          <Text style={styles.SubText}>Report</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.MenuContainer} onPress={() => {
          navigation.navigate('Progress');
          navigation.closeDrawer();
        }}>
        <Image style={styles.TopMenuIcon} source={require('./../../images/dashboard/progress-icon.png')} />
        <View style={styles.textContainer}>
          <Text style={styles.TextBold}>Progress Dashboard</Text>
          <Text style={styles.SubText}>Progress</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.MenuContainer} onPress={() => {
          navigation.navigate('RFIs');
          navigation.closeDrawer();
        }}>
        <Image style={styles.TopMenuIcon} source={require('./../../images/dashboard/manage-rfi-icon.png')} />
        <View style={styles.textContainer}>
          <Text style={styles.TextBold}>Manage RFIs</Text>
          <Text style={styles.SubText}>RFI</Text>
        </View>
      </TouchableOpacity> */}
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    paddingVertical: 10,
    padding: 15,
  },
  TopMenuIcon: {
    width: 56,
    height: 56,
    marginRight: 15,
  },
  MenuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#BECADA',
    borderStyle: 'solid'
  },
  TextBold: {
    fontWeight: '700',
    fontSize: 18,
    color: '#333',
  },
  SubText: {
    fontWeight: '400',
    fontSize: 14,
    color: '#7B8D9E'
  },
  textContainer: {
    flexDirection: 'column'
  }
});

export default DashboardListing;