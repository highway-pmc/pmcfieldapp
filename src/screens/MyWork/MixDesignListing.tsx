import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
  NativeEventEmitter,
  Image,
} from 'react-native';
import {useSnackbar} from '../../context/SnackbarContext';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import LoadingAnimation from '../Common/LoadingAnimation';
import {
  getQualityMasterList,
  clearRFITasksEvent,
  getMixDesignListInfo,
} from '../RFIs/actions';
import {HeaderItems} from '../../constants/constants';
import LinearGradient from 'react-native-linear-gradient';

const MixDesignListing = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {showSnackbar} = useSnackbar();
  const focus = useIsFocused();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const [selectedTestCategoryData, setSelectedTestCategoryData] = useState<any>(
    {},
  );
  const dispatch = useDispatch();

  const {qualityMasterListing, qualityMixDesignListInfo, loading, error} =
    useSelector((state: any) => state.RFIs);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.mixDesignListing);
  }

  useEffect(() => {
    if (focus == true) {
      dispatch(clearRFITasksEvent());
      dispatch(getQualityMasterList({testType: 'mix-design'}));
      console.log(
        '=======qualityMasterListing=======',
        qualityMasterListing?.testWorkCategoryData,
      );
      console.log(
        '=======qualityMixDesignListInfo=======',
        qualityMixDesignListInfo,
      );
    }
  }, [focus]);

  useEffect(() => {
    if (error) {
      showSnackbar('Unable to saveMix design data');
      console.log('=======ERROR=======', error);
    }
  }, [error]);

  // const handleCategorySelect = (selectedOption: any) => {
  //   setSelectedTestCategoryData({...selectedOption});
  //   handleFormData(selectedOption);
  // };

  // const handleFormData = async (testCategoryData: any) => {
  //   dispatch(
  //     getMixDesignListInfo({
  //       projectId: loggedInUser.projectId,
  //       testWorkCategoryType: testCategoryData.type,
  //       testMaterialId: 'NA',
  //     }),
  //   );
  //   console.log('======qualityMixDesign=======', qualityMixDesignListInfo);
  // };

  return (
    <View style={styles.recentWorkContainer}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Category List</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              console.log('Add Equipment');
              navigation.navigate('MixDesign');
            }}>
            <Text style={styles.addButtonText}>Add Mix Design</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {qualityMasterListing?.testWorkCategoryData.map(
            (item: any, index: any) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    console.log('Selected Category:', item);
                    // handleFormData(item);
                    navigation.navigate('MixDesignCategoryList', {
                      testWorkCategoryType: item.type,
                      testWorkCategoryId: item._id,
                      testWorkCategoryName: item.name,
                    });
                  }}
                  style={styles.equipmentCard}>
                  <LinearGradient
                    colors={['#FFFFFF', '#E9FFE9']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.gradientBackground}
                  />
                  <View style={styles.leftBorder} />
                  <View style={styles.equipmentCardContent}>
                    <Text style={styles.equipmentName}>{item.name}</Text>
                    <View style={styles.equipmentCountContainer}>
                      <Text style={styles.equipmentCount}> 2 </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            },
          )}
        </View>
      </ScrollView>
      <LoadingAnimation loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  ActionIcon: {
    width: 20,
    height: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  itemContainerSourceDetailList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 2,
    backgroundColor: '#f9f9f9',
  },
  itemText: {
    fontSize: 14,
    maxWidth: 200,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 110,
  },
  recentWorkContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    height: Dimensions.get('window').height,
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#5EAB4B',
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#5EAB4B',
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  equipmentCard: {
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#5EAB4B40',
    position: 'relative',
    height: 70,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  leftBorder: {
    paddingVertical: 3,
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    zIndex: 100,
    width: 2,
    backgroundColor: '#5EAB4B',
  },
  equipmentCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    height: '100%',
  },
  equipmentName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    marginLeft: 6,
  },
  equipmentCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5EAB4B',
  },
  equipmentCountContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MixDesignListing;
