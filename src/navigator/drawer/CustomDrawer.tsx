import {View, Text, StyleSheet, Button, Image, NativeEventEmitter, FlatList} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../screens/Login/actions';
import { Dashboard_MENU, UserRoles } from "../../constants/constants"

const CustomDrawer = ({navigation}: {navigation: any}) => {

  const dispatch = useDispatch()

  const loggedInUser = useSelector(state => state.Auth.userInfo);

  const logout = () => {
    dispatch(logoutUser());
  };
  
  const checkPermissions = (permissions: string[]) => {
    let index = -1;
    permissions.forEach((item) => {
      if (loggedInUser.roles?.split(',').indexOf(item) != -1) {
        index = 1;
      }
    })

    return index;
  }

  const getRoles = () => {
    let roleDisplay: any = []
    loggedInUser.roles?.split(',').forEach((role: any) => {
      roleDisplay.push(UserRoles[role])
    });

    return roleDisplay.join(', ');
  }

  return (
    <View style={styles.Container}>
      <View style={styles.ProfileContainer}>
        <View>
          <View style={styles.ProfileIcon}>
            <Image style={styles.ProfileIcon} source={require('./../../images/avtar.png')} />
          </View>
          <Text style={styles.ProfileName}>{loggedInUser.name}</Text>
          <Text style={styles.ProfileRole}>{getRoles()}</Text>
          <TouchableOpacity style={styles.ViewButton} onPress={() => { navigation.navigate('Profile'); navigation.closeDrawer();}}>
            <Text style={styles.ViewText}>Edit profile</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.CloseContainer}  onPress={() => {navigation.closeDrawer()}}>
          <Image style={styles.CloseIcon} source={require('./../../images/menu/close-icon.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.NavigationContainer}>
        <TouchableOpacity style={styles.MenuContainer} onPress={() => { 
          navigation.navigate('Home');
          navigation.closeDrawer();
          }}>
          <Image style={styles.MenuIcon} source={require('./../../images/menu/mywork-icon.png')} />
          <Text style={styles.MenuText}>Home</Text>
        </TouchableOpacity>
        <FlatList data={Dashboard_MENU}
        renderItem={({ item }) =>
          checkPermissions(item.permissions) != -1 &&
          <TouchableOpacity style={styles.MenuContainer} onPress={() => { navigation.navigate(item.route); navigation.closeDrawer();}}>
          <Image style={styles.MenuIcon} source={item.iconMenu} />
          <Text style={styles.MenuText}>{item.title}</Text>
        </TouchableOpacity>
        }
      />
        {/* <TouchableOpacity style={styles.MenuContainer} onPress={() => { navigation.navigate('MyWork'); navigation.closeDrawer();}}>
          <Image style={styles.MenuIcon} source={require('./../../images/menu/manage-icon.png')} />
          <Text style={styles.MenuText}>My Work</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer} onPress={() => { navigation.navigate('ManageUsers'); navigation.closeDrawer();}}>
          <Image style={styles.MenuIcon} source={require('./../../images/menu/manage-icon.png')} />
          <Text style={styles.MenuText}>Manage User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer} onPress={() => { navigation.navigate('Reports'); navigation.closeDrawer();}}>
          <Image style={styles.MenuIcon} source={require('./../../images/menu/report-menu-icon.png')} />
          <Text style={styles.MenuText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer} onPress={() => { navigation.navigate('Progress'); navigation.closeDrawer();}}>
          <Image style={styles.MenuIcon} source={require('./../../images/menu/progress-dash-icon.png')} />
          <Text style={styles.MenuText}>Progress Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.MenuContainer} onPress={() => { navigation.navigate('RFIs'); navigation.closeDrawer();}}>
          <Image style={styles.MenuIcon} source={require('./../../images/menu/manage-rfi-icom.png')} />
          <Text style={styles.MenuText}>Manage FRI’s</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.MenuContainer} onPress={logout}>
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
    width: 85,
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
