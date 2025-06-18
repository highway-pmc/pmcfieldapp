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
import CustomSelectDropdown from '../Common/CustomSelectDropdown';
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
import KebabMenu from '../Common/KebabMenu';

const MixDesignCategoryList = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {testWorkCategoryType, testWorkCategoryId, testWorkCategoryName} =
    route.params;
  const {height} = Dimensions.get('window');
  const calculatedHeight = height * 0.75;
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
      dispatch(
        getMixDesignListInfo({
          projectId: loggedInUser.projectId,
          testWorkCategoryType: testWorkCategoryType,
          testMaterialId: 'NA', 
        }),
      );
    }
  }, [focus]);

  const handleEdit = (): void => {
    console.log('Edit action triggered');
  };

  const handleDelete = (): void => {
    console.log('Delete action triggered');
  };

  useEffect(() => {
    if (error) {
      showSnackbar('Unable to save Mix design data');
      console.log('=======ERROR=======', error);
    }
  }, [error]);

  return (
    <View style={styles.recentWorkContainer}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{testWorkCategoryName}</Text>
        </View>

        <View style={styles.listContainer}>
          {qualityMixDesignListInfo?.map((item: any, index: number) => {
            return (
              <View key={index} style={styles.equipmentCard}>
                <LinearGradient
                  colors={['#FFFFFF', '#E9FFE9']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.gradientBackground}
                />
                <View style={styles.leftBorder} />

                <View style={styles.kebabMenuContainer}>
                  <KebabMenu
                    onEdit={() => handleEdit()}
                    onDelete={() => handleDelete()}
                  />
                </View>

                <View style={styles.equipmentCardContent}>
                  <Text style={styles.equipmentName}>{item.name}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <LoadingAnimation loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
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
  recentWorkContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    height: Dimensions.get('window').height,
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
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: '#5EAB4B',
  },
  kebabMenuContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  equipmentCardContent: {
    flex: 1,
    justifyContent: 'center',

    paddingHorizontal: 15,
  },
  equipmentName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
  },
});

export default MixDesignCategoryList;
