import {
  View,
  Text,
  NativeEventEmitter,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {HeaderItems, PROJECT_TYPE, TASK_CATEGORY} from '../../constants/constants';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {getUsersForTestAssignment} from './QualityWorks/actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import LinearGradient from 'react-native-linear-gradient';
import TileCardComponent from '../Common/TileCardComponent';
import { SURVEY_MODULE_TYPE } from '../Common/CommonConstantsTypes';


const AssignSurveyUsers = () => {
  const navigation: any = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [userData, setUserCheckboxes] = useState([]);

  const workType = PROJECT_TYPE.SURVEY_WORK;

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.assignSurveyUsers);
  }

  const dispatch = useDispatch();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {users, loading, loadingUsers, error} = useSelector(
    (state: any) => state.TestAssignment,
  );

  // Handle work type press
  const onPressWorkType = (workType: any) => {
    console.log('Work type pressed:', workType);
    navigation.navigate('AssignWork', {
      workType: workType,
      taskCategory: TASK_CATEGORY.SURVEY,
    });
  };

  // unmount
  useEffect(
    () => () => {
      setUserCheckboxes([]);
      setSearchText('');
    },
    [],
  );

  useEffect(() => {
    if (users) {
      users.forEach((user: any) => {
        user.isChecked = false;
      });
      setUserCheckboxes(users);
    }
  }, [users]);

  useEffect(() => {
    dispatch(
      getUsersForTestAssignment({
        projectId: loggedInUser.projectId,
        workType: workType,
      }),
    );
  }, []);

  return (
    <View style={styles.Container}>
      <ScrollView style={styles.Height100}>
        {/* Render TileCardComponents */}
        <View style={styles.tileCardsContainer}>
          {SURVEY_MODULE_TYPE.map((role, index) => (
            <TileCardComponent
              key={index}
              title={role.title}
              workType={role.workType}
              bgColor={role.backgroundColor}
              imageBg={role.imageBg}
              linearLight={role.linearLight}
              linearDark={role.linearDark}
              image={role.src}
              generatedTask={role.generatedTask}
              inProgressTask={role.inProgressTask}
              closedTask={role.closedTask}
              rejected={role.rejected}
              borderColor={role.borderColor}
              onPress={() => onPressWorkType(role.workType)}
            />
          ))}
        </View>

        {/* Existing user list */}
        {/* {userData?.length > 0 &&
          userData
            .filter((testClassif: any) => {
              if (searchText && testClassif.name) {
                return testClassif.name
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
              } else {
                return true;
              }
            })
            .map((item: any, index) => (
              <View key={index} style={styles.categoryItemContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#E0E7FF']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.gradientContainer}>
                  <View style={styles.leftBorder} />
                  <View style={styles.FlexRowCenter}>
                    <View>
                      <Text style={styles.categoryText}>{item.name}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))} */}

        {/* No Data Found */}
        {!loading && !users?.length && (
          <View style={styles.NoDataContainer}>
            <Image
              style={styles.WthHeight}
              source={require('./../../images/no-data-found.png')}
            />
            <Text style={styles.NodataHeadText}>Sorry, no result found!</Text>
          </View>
        )}
      </ScrollView>

      <LoadingAnimation loading={loading || loadingUsers}></LoadingAnimation>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    paddingVertical: 10,
    padding: 15,
    paddingBottom: 35,
  },
  tileCardsContainer: {
    marginBottom: 20,
  },
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
    backgroundColor: '##A2AAF',
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
  UserCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#BECADA',
    borderStyle: 'solid',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  checkbox: {
    transform: [{scaleX: 1}, {scaleY: 1}],
  },
  label: {
    margin: 8,
  },
  UserImage: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: '#BECADA',
    borderStyle: 'solid',
    borderRadius: 36,
    marginRight: 15,
  },
  UserName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#27272A',
  },
  UserRole: {
    fontSize: 16,
    fontWeight: '400',
    color: '#808089',
  },
  centeredView: {
    marginTop: 'auto',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 60,
  },
  PopHeader: {},
  modalView: {
    minHeight: 150,
  },
  ModalInnerContainer: {
    paddingHorizontal: 15,
  },
  button: {
    borderRadius: 4,
    borderBottomEndRadius: 0,
    paddingVertical: 20,
    marginHorizontal: -15,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonAssign: {
    backgroundColor: '#5A2AAF',
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: '50%',
  },
  SeperatorBorder: {
    borderRightWidth: 1,
    borderColor: '#fff',
  },
  DisabledButton: {
    opacity: 0.5,
    backgroundColor: '#5A2AAF',
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: '50%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27272A',
    textAlign: 'center',
  },
  Height80: {
    height: '80%',
  },
  Height100: {
    height: '100%',
  },
  CloseIcon: {
    width: 30,
    height: 30,
  },
  ModalHeader: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
  },
  buttonClose: {
    position: 'absolute',
    right: 15,
  },
  CategoryType: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
    paddingVertical: 10,
  },
  AssignRoleText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#27272A',
    marginLeft: 5,
  },
  assignTagButoon: {
    backgroundColor: '#5A2AAF',
    borderRadius: 30,
    color: '#fff',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  userAlreadyAssigned: {
    backgroundColor: '#5A2AAF',
    borderRadius: 30,
    fontSize: 12,
    color: '#fff',
    paddingLeft: 12,
    marginLeft: 20,
    width: 60,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
  },
  assignTagButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
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
    justifyContent: 'space-between',
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
  arrowContainer: {
    alignSelf: 'center',
  },
});

export default AssignSurveyUsers;
