import { Image, StyleSheet, Text, TouchableOpacity, View, NativeEventEmitter } from 'react-native'
import React, {useEffect, useState} from 'react'
import DrawerNavigator from '../../navigator/drawer/DrawerNavigator'
import { DrawerActions } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { HeaderItems } from "../../constants/constants"

const Dashboard = ({navigation}:{navigation: any}) => {
  const [headerInfo, setHeaderInfo] = useState(HeaderItems.dashboard);
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.addListener('headerEvent', event => {
      setHeaderInfo(event);
    });
  }, []);

  
  return (
    
    <View style={{flex: 1}}>
      <View style={styles.Container}>
      
        <TouchableOpacity style={styles.HeaderMenuContainer}>
        {headerInfo && headerInfo.showBack ?
        <TouchableOpacity style={styles.HeaderMenuContainer} onPress={(props) => {
          const popAction = StackActions.pop(1);
          navigation.dispatch(popAction);
        }}>
          <Image
              style={styles.TopMenuIcon}
              source={require('./../../images/back-button.png')} 
            />
            <Text style={styles.HeaderTextBold}>{headerInfo.title}</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.HeaderMenuContainer} onPress={() => {navigation.dispatch(DrawerActions.openDrawer())}}>

            <Image
              style={styles.HeaderTopMenuIcon}
              source={require('./../../images/menu-icon.png')} 
            />
            <Text style={styles.HeaderTextBold}>{headerInfo.title}</Text>
          </TouchableOpacity>
          }
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.HeaderMenuContainer}>
          <Image
            style={styles.TopMenuIcon}
            source={require('./../../images/avtar.png')}
          />
        </TouchableOpacity> */}
      </View>
      <DrawerNavigator />
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
    marginRight: 10
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