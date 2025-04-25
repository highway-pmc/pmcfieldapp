// HomeScreen.js
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  NativeEventEmitter,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import {Dashboard_MENU, HeaderItems} from '../../constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {updateFCMToken} from './actions';
import messaging from '@react-native-firebase/messaging';

const {width} = Dimensions.get('window');
const itemWidth = (width - 45) / 2; // 45 accounts for padding and gap

const DashboardListing = ({navigation}: {navigation: any}) => {
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const dispatch = useDispatch();

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.dashboard);
  }

  useEffect(() => {
    if (loggedInUser) {
      updateDeviceToken();
    }
  }, [loggedInUser]);

  const updateDeviceToken = async () => {
    let token = await messaging().getToken();
    dispatch(updateFCMToken(token));
  };

  const checkPermissions = (permissions: string[], categories?: string[]) => {
    let index = -1;
    const roles = loggedInUser.roles?.split(',') || [];
    permissions.forEach(item => {
      if (roles.indexOf(item) != -1) {
        index = 1;
      }
    });

    if (
      categories &&
      index === -1 &&
      roles.length === 1 &&
      roles[0] === 'user'
    ) {
      const userCategories = loggedInUser.categories?.split(',');

      categories.forEach(item => {
        if (userCategories.indexOf(item) != -1) {
          index = 1;
        }
      });
    }

    return index;
  };

  // Filter menu items based on permissions
  const filteredMenu = Dashboard_MENU.filter(
    item => checkPermissions(item.permissions, item.categories) !== -1,
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar/>
      <View style={styles.gridContainer}>
        {filteredMenu.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuCard,
              {
                backgroundColor: item.backgroundColor || '#E6F2F3',
                borderColor: item.border || '#D0EDF3',
              },
            ]}
            onPress={() => {
              navigation.navigate(item.route);
              navigation.closeDrawer();
            }}>
            <View
              style={[
                styles.iconContainer,
                {backgroundColor: item.backgroundColor || '#E6F2F3'},
              ]}>
              <Image style={styles.menuIcon} source={item.icon} />
            </View>
            <Text
              style={[styles.titleText, {color: item.titleColor || '#1C6BA4'}]}>
              {item.title}
            </Text>
            <Text style={styles.subtitleText}>{item.subTitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: itemWidth,
    height: 180,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5, // Fixed distance from top
    marginBottom: 20, // Consistent spacing between icon and text
  },
  menuIcon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 14,
    color: '#7B8D9E',
    fontWeight: '400',
  },
});

export default DashboardListing;
