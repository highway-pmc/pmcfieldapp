import {
  View,
  Text,
  TouchableOpacity,
  NativeEventEmitter,
  StyleSheet,
  Image,
} from 'react-native';
import React from 'react';
import {useIsFocused} from '@react-navigation/native';
import {HeaderItems} from '../../../constants/constants';
import {useDispatch} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

const SelectTestWorkCategory = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {
    testClassificationId,
    testClassificationName,
    testClassificationType,
    testWorkCategoriesData,
    workType,
  } = route.params;

  const dispatch = useDispatch();

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.selectTestWorkCategory);
  }

  const onTestWorkCategoryNextClick = (item: any) => {
    navigation.navigate('AssignTestMaterialsPurchage', {
      testClassificationId: testClassificationId,
      testClassificationName: testClassificationName,
      testClassificationType: testClassificationType,
      testWorkCategoryId: item._id,
      testWorkCategoryName: item.name,
      testWorkCategoryType: item.type,
      workType: workType,
    });
  };

  return (
    <View style={styles.Container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {testWorkCategoriesData.map((item: any, index: any) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryItemContainer}
            onPress={() => onTestWorkCategoryNextClick(item)}>
            <LinearGradient
              colors={['#FFFFFF', '#E0E7FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientContainer}>
              <View style={styles.leftBorder} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    paddingVertical: 10,
    padding: 15,
    backgroundColor: '#F5F5F7',
  },
  categoryItemContainer: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ABBEFD',
  },
  gradientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 16,
    position: 'relative',
  },
  leftBorder: {
    paddingVertical: 3,
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    zIndex: 100,
    width: 2,
    backgroundColor: '#5A7EF8',
  },
  categoryText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '400',
    color: '#27272A',
  },

  // Keeping other styles from original component below
  ErrorSectionStyle: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  errorText: {
    color: '#f11f1f',
  },
  NoDataContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '30%',
  },
  WthHeight: {
    width: 150,
    height: 150,
  },
  NodataHeadText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27272A',
  },
  NodataSubText: {
    fontSize: 16,
    color: '#27272A',
  },
  FlexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignTag: {
    backgroundColor: '#1C58C0',
    borderRadius: 15,
    color: '#fff',
    paddingHorizontal: 10,
    paddingTop: 2,
    paddingBottom: 3,
    marginLeft: 10,
  },
  assignTagText: {
    fontSize: 12,
    color: '#fff',
  },
  TopHeaderFixed: {
    marginBottom: 15,
  },
  TopButtonContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 10,
    justifyContent: 'flex-end',
    gap: 10,
  },
  ButtonStyle: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#333',
  },
  TextStyle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  inputStyle: {
    flex: 1,
    color: '#2c2c2c',
    paddingLeft: 40,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#808089',
    backgroundColor: '#fff',
    fontWeight: '600',
    paddingVertical: 5,
    height: 45,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 10,
    marginTop: 5,
    position: 'relative',
  },
  ImageSearch: {
    position: 'absolute',
    width: 24,
    height: 24,
    zIndex: 9,
    left: 10,
    top: '27%',
  },
});

export default SelectTestWorkCategory;
