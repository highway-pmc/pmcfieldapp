import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {NativeEventEmitter} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {HeaderItems, RFIs_TYPE} from '../../constants/constants';
const RFIsHome = ({route, navigation}: any) => {
  const focus = useIsFocused();

  useEffect(() => {
    if (focus === true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.rfisHome);
    }
  }, [focus]);

  const onRFIClick = (type: any) => {
    navigation.navigate('RFIsDashboard', {
      rfiType: type,
    });
  };
  //TODO-rajiv-sir
  // Category data with counts, colors, and custom icons
  const categories = [
    {
      title: "Generate RFI's",
      count: 20,
      countText: 'Generated RfI’s',
      type: RFIs_TYPE.GENERATE,
      colors: ['#7A54FF70', '#493299B2'],
      buttonText: "Generate RFI's",
      iconSource: require('../../images/rfis/image.png'),
    },
    {
      title: "In Progress RFI's",
      count: 20,
      countText: 'In Progress RfI’s',
      type: RFIs_TYPE.IN_PROGRESS,
      colors: ['#FFB24670', '#E99928B2'],
      buttonText: "Progress RFI's",
      iconSource: require('../../images/rfis/ic_inprogress.png'),
    },
    {
      title: "Rejected RFI's",
      count: 20,
      countText: 'Rejected RfI’s',
      type: RFIs_TYPE.REJECTED,
      colors: ['#FD898970', '#FF6968B2'],
      buttonText: "Rejected RFI's",
      iconSource: require('../../images/rfis/ic_rejected.png'),
    },
    {
      title: "Closed RFI's",
      count: 20,
      countText: 'Closed RfI’s',
      type: RFIs_TYPE.CLOSED,
      colors: ['#FFA37E70', '#F47D4DB2'],
      buttonText: "Closed RFI's",
      iconSource: require('../../images/rfis/ic_closed.png'),
    },
    {
      title: "Approved RFI's",
      count: 20,
      countText: 'Approved RfI’s',
      type: RFIs_TYPE.APPROVED,
      colors: ['#6CC05870', '#4B9938B2'],
      buttonText: "Approved RFI's",
      iconSource: require('../../images/rfis/ic_approved.png'),
    },
  ];

  const renderCategoryCard = (category: any, index: any) => {
    return (
      <LinearGradient
        key={index}
        colors={category.colors}
        style={styles.categoryCard}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryCount}>
              {category.countText} : {category.count}
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => onRFIClick(category.type)}>
              <Text style={styles.buttonText}>{category.buttonText}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            <Image
              source={category.iconSource}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
        </View>
      </LinearGradient>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardsContainer}>
        {categories.map((category, index) =>
          renderCategoryCard(category, index),
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 16,
  },
  cardsContainer: {},
  categoryCard: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 12,
    height: 125,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  categoryCount: {
    fontSize: 13,
    color: '#333333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 30,
    paddingVertical: 7,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#333333',
  },
  buttonText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
  },
  iconContainer: {
    marginTop: 43,
    marginRight: -19,
    width: 70,
    heigh: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 70,
    height: 70,
  },
});

export default RFIsHome;
