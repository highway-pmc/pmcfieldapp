import {
  View,
  Text,
  NativeEventEmitter,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  HeaderItems,
  PROJECT_TYPE,
  TEST_ASSIGNMENT_LEVEL,
} from '../../constants/constants';
import CheckBox from '@react-native-community/checkbox';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearTestClassificationsAssignmentData,
  getTestClassifications,
  getUsersForTestAssignment,
  testClassificationsTestAssignToUsers,
} from './QualityWorks/actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import {isProductionClassification} from '../../utils/Utils';
import LinearGradient from 'react-native-linear-gradient';

const AssignProductionUsers = () => {
  const navigation: any = useNavigation();
  const [testClassificationsData, setTestClassificationsData] = useState([]);
  const [selectedTestClassification, setSelectedTestClassification] = useState({
    isChecked: false,
    _id: '',
    name: '',
  });
  const [searchText, setSearchText] = useState('');
  // const [usersToBeAssigned, setUsersToBeAssigned] = useState([])
  const [userData, setUserCheckboxes] = useState([]);

  const workType = PROJECT_TYPE.PRODUCTION;

  // Hardcoded data for the new cards
  const hardcodedCards = [
    {
      id: 1,
      title: 'HPMC RMC 001',
      plantInfo: 'RMC Plant Volte Volte 522 KZ210',
      machineId: 'M/s HPMC / Machineries/5812539',
      pendingRequests: 100,
      isChecked: false,
    },
    {
      id: 2,
      title: 'HPMC RMC 002',
      plantInfo: 'RMC Plant Delhi Delhi 823 AB456',
      machineId: 'M/s HPMC / Machineries/5812540',
      pendingRequests: 85,
      isChecked: false,
    },
    {
      id: 3,
      title: 'HPMC RMC 003',
      plantInfo: 'RMC Plant Mumbai Mumbai 654 XY789',
      machineId: 'M/s HPMC / Machineries/5812541',
      pendingRequests: 120,
      isChecked: false,
    },
    {
      id: 4,
      title: 'HPMC RMC 004',
      plantInfo: 'RMC Plant Chennai Chennai 432 PQ123',
      machineId: 'M/s HPMC / Machineries/5812542',
      pendingRequests: 95,
      isChecked: false,
    },
  ];

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.assignProductionUsers);
  }

  const dispatch = useDispatch();

  const [isAssignPopOpen, openAssignPopup] = useState(false);
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {
    testClassifications,
    users,
    testClassificationsTestAssigned,
    loading,
    loadingUsers,
    error,
  } = useSelector((state: any) => state.TestAssignment);

  // unmount
  useEffect(
    () => () => {
      setTestClassificationsData([]);
      setUserCheckboxes([]);
      setSearchText('');
    },
    [],
  );

  useEffect(() => {
    if (testClassifications) {
      const testClassificationsFiltered = testClassifications.filter(
        (tClassi: any) => isProductionClassification(tClassi.type),
      );
      testClassificationsFiltered.forEach((tClassi: any) => {
        tClassi.isChecked = false;
      });
      setTestClassificationsData(testClassificationsFiltered);
    }

    if (users) {
      users.forEach((user: any) => {
        user.isChecked = false;
      });
      setUserCheckboxes(users);
    }
  }, [testClassifications, users]);

  useEffect(() => {
    dispatch(
      getTestClassifications({
        projectId: loggedInUser.projectId,
        workType: workType,
      }),
    );

    dispatch(
      getUsersForTestAssignment({
        projectId: loggedInUser.projectId,
        workType: PROJECT_TYPE.ADMIN_WORK,
      }),
    );
  }, []);

  const handleRadioChange = (index: any) => {
    const testClassification: any = testClassificationsData[index];

    testClassification.isChecked = !testClassification.isChecked;
    setSelectedTestClassification(testClassification);

    const updatedCheckboxes: any = [...userData];

    if (testClassification.isChecked) {
      updatedCheckboxes.forEach((user: any) => {
        user.isChecked = false;
        delete user.assignmentLevel;
        const testAssignment = user.testAssignment?.find(
          (wa: any) =>
            wa.testClassification?.id === testClassificationsData[index]._id &&
            wa.assignmentLevel === 1,
        );

        if (testAssignment) {
          user.isChecked = true;
        }
      });
    }

    setUserCheckboxes(updatedCheckboxes);
    openAssignPopup(!isAssignPopOpen);
  };

  const handleUserData = (index: any) => {
    const updatedCheckboxes: any = [...userData];
    const selectedUser: any = updatedCheckboxes[index];
    selectedUser.isChecked = !selectedUser.isChecked;
    const testAssignment = selectedUser.testAssignment?.find(
      (wa: any) =>
        wa.testClassification?.id === selectedTestClassification._id &&
        wa.assignmentLevel === 1,
    );
    if (selectedUser.isChecked) {
      if (testAssignment) {
        testAssignment.dirty = false;
        selectedUser.dirty = false;
      } else {
        selectedUser.dirty = true;
      }
      selectedUser.delete = false;
    } else {
      if (!testAssignment) {
        selectedUser.dirty = false;
      } else {
        selectedUser.dirty = true;
        selectedUser.delete = true;
        testAssignment.dirty = true;
      }
    }

    setUserCheckboxes(updatedCheckboxes);
  };

  useEffect(() => {
    if (testClassificationsTestAssigned) {
      Alert.alert('Success', 'Tests assigned successfully');
      openAssignClose();
      dispatch(clearTestClassificationsAssignmentData());
      dispatch(
        getUsersForTestAssignment({
          projectId: loggedInUser.projectId,
          workType: PROJECT_TYPE.ADMIN_WORK,
        }),
      );
    }
  }, [testClassificationsTestAssigned, error]);

  const onTestAssignment = () => {
    const usersToBeAssign = userData.filter((u: any) => u.dirty);

    let usersToBeAssignArray: any = [];

    usersToBeAssign.forEach((u: any) => {
      let user: any = {
        _id: u._id,
        delete: u.delete || false,
      };
      const testAssignment = u.testAssignment?.find((wa: any) => wa.dirty);
      if (testAssignment) {
        user.testAssignmentId = testAssignment._id;
      }

      usersToBeAssignArray.push(user);
    });

    if (usersToBeAssignArray.length) {
      dispatch(
        testClassificationsTestAssignToUsers({
          projectId: loggedInUser.projectId,
          testClassificationId: selectedTestClassification._id,
          body: {
            users: usersToBeAssignArray,
            level: 1,
          },
        }),
      );
    }
  };

  const openAssignClose = () => {
    testClassificationsData.forEach((item: any) => {
      item.isChecked = false;
    });
    userData.forEach((item: any) => {
      item.isChecked = false;
    });
    openAssignPopup(!isAssignPopOpen);
  };

  const handleHardcodedCardSelect = (cardId: number) => {
    // Handle hardcoded card selection
    console.log('Selected hardcoded card:', cardId);
  };

  return (
    <View style={styles.Container}>
      <View style={styles.TopHeaderFixed}>
        {error && (
          <View style={styles.ErrorSectionStyle}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      {/* Original ScrollView - Commented out as requested */}
      {/* <ScrollView style={styles.Height100}>
        {testClassificationsData
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
            <View style={styles.categoryItemContainer}>
              <LinearGradient
                colors={['#FFFFFF', '#E0E7FF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.gradientContainer}>
                <View style={styles.leftBorder} />
                <View style={styles.FlexRowCenter}>
                  <CheckBox
                    value={item.isChecked}
                    onValueChange={() => handleRadioChange(index)}
                    style={styles.checkbox}
                    tintColors={{true: '#5A2AAF', false: '#818181'}}
                  />
                  <View>
                    <Text style={styles.categoryText}>{item.name}</Text>
                  </View>
                </View>
                <View>
                </View>
              </LinearGradient>
            </View>
          ))}

        {!loading && !testClassificationsData.length && (
          <View style={styles.NoDataContainer}>
            <Image
              style={styles.WthHeight}
              source={require('./../../images/no-data-found.png')}
            />
            <Text style={styles.NodataHeadText}>Sorry, no result found!</Text>
          </View>
        )}
      </ScrollView> */}
      <ScrollView style={styles.Height100}>
        {hardcodedCards.map((card, index) => (
          <View key={card.id} style={styles.hardcodedCardContainer}>
            <LinearGradient
              colors={['#FFFFFF', '#E0E7FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.hardcodedGradientContainer}>
              <View style={styles.hardcodedLeftBorder} />
              <View style={styles.hardcodedCardContent}>
                <View style={styles.FlexRowCenter}>
                  <CheckBox
                    value={card.isChecked}
                    onValueChange={() => handleHardcodedCardSelect(card.id)}
                    style={styles.checkbox}
                    tintColors={{true: '#5A7EF8', false: '#818181'}}
                  />
                  <View style={styles.hardcodedCardTextContainer}>
                    <Text style={styles.hardcodedCardTitle}>{card.title}</Text>
                    <Text style={styles.hardcodedCardSubtitle}>
                      {card.plantInfo}
                    </Text>
                    <Text style={styles.hardcodedCardId}>
                      ID: {card.machineId}
                    </Text>
                    <Text style={styles.hardcodedCardPending}>
                      Total no. of pending request: {card.pendingRequests}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      {/* Modal Start */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isAssignPopOpen}
        onRequestClose={() => {
          openAssignPopup(!isAssignPopOpen);
        }}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.ModalHeader}>
                <Text style={styles.modalText}>User's List</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => openAssignClose()}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ModalInnerContainer}>
                <View>
                  <Text style={styles.AssignRoleText}>
                    Test Classification: {selectedTestClassification.name}
                  </Text>
                </View>
                <ScrollView style={{paddingTop: 10, height: 500}}>
                  {userData.map((item: any, index) => (
                    <View style={styles.CategoryType}>
                      <View style={styles.FlexRowCenter}>
                        <CheckBox
                          value={item.isChecked}
                          disabled={item.assignmentLevel != null}
                          onValueChange={() => handleUserData(index)}
                          style={styles.checkbox}
                          tintColors={{true: '#5A2AAF', false: '#818181'}}
                        />
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.AssignRoleText}>{item.name}</Text>
                          {item.assignmentLevel && (
                            <Text style={styles.userAlreadyAssigned}>
                              {item.assignmentLevel}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.assignTagButoon}
                  onPress={() => onTestAssignment()}>
                  <Text style={styles.assignTagButtonText}>Assign</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

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
    transform: [{scaleX: 1.2}, {scaleY: 1.2}],
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
    marginRight: 10,
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
  // New styles for hardcoded cards
  hardcodedCardContainer: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#B8D4FF',
    shadowColor: '#5A7EF8',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  hardcodedGradientContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 12,
    position: 'relative',
  },
  hardcodedLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: '#5A7EF8',
  },
  hardcodedCardContent: {
    flex: 1,
    marginLeft: 8,
  },
  hardcodedCardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  hardcodedCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  hardcodedCardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 2,
  },
  hardcodedCardId: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 2,
  },
  hardcodedCardPending: {
    fontSize: 14,
    fontWeight: '400',
  },
});

export default AssignProductionUsers;
