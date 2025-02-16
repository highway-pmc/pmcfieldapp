import {
  View,
  Text,
  TouchableOpacity,
  NativeEventEmitter,
  StyleSheet,
  Image,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  HeaderItems,
  TEST_ASSIGNMENT_LEVEL,
  TEST_CLASSIFICATION_TYPES,
  TEST_MATERIALS_TYPES,
  TEST_WORK_CATEGORY_TYPES,
} from '../../../constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearTestClassificationsAssignmentData,
  getUsersForTestAssignment,
  getTestMaterials,
  testMaterialsTestAssignToUsers,
} from './actions';
import {ScrollView} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import LoadingAnimation from '../../Common/LoadingAnimation';
import {isTestInventoryClassification} from '../../../utils/Utils';

const AssignTestMaterials = ({
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
    testWorkCategoryId,
    testWorkCategoryName,
    testWorkCategoryType,
    workType,
  } = route.params;

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {
    testMaterials,
    users,
    loadingUsers,
    loadingTestWorkCategory,
    testMaterialsTestAssigned,
    loading,
    error,
  } = useSelector((state: any) => state.TestAssignment);
  const [testMaterialsData, setTestMaterialsData] = useState([]);
  const [selectedTestMaterial, setSelectedTestMaterial] = useState({
    isChecked: false,
    _id: '',
    name: '',
  });
  const [userData, setUserCheckboxes] = useState([]);
  const [isAssignPopOpen, openAssignPopup] = useState(false);
  const [searchText, setSearchText] = useState('');

  const dispatch = useDispatch();

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.assignTestMaterials);
  }

  useEffect(() => {
    if (testMaterials) {
      testMaterials.forEach((tMaterial: any) => {
        tMaterial.isChecked = false;
      });
      setTestMaterialsData(testMaterials);
    }

    if (users) {
      users.forEach((user: any) => {
        user.isChecked = false;
      });
      setUserCheckboxes(users);
    }
  }, [testMaterials, users, error]);

  useEffect(() => {
    dispatch(
      getTestMaterials({
        projectId: loggedInUser.projectId,
        testClassificationId: testClassificationId,
        testWorkCategoryId: testWorkCategoryId,
      }),
    );

    dispatch(
      getUsersForTestAssignment({
        projectId: loggedInUser.projectId,
        workType: workType,
      }),
    );
  }, []);

  const handleRadioChange = (index: any) => {
    const testMaterial: any = testMaterialsData[index];

    testMaterial.isChecked = !testMaterial.isChecked;
    setSelectedTestMaterial(testMaterial);

    const updatedCheckboxes: any = [...userData];

    if (testMaterial.isChecked) {
      updatedCheckboxes.forEach((user: any) => {
        user.isChecked = false;
        delete user.assignmentLevel;
        if (
          user.testAssignment?.find(
            (wa: any) =>
              wa.testClassification?.id === testClassificationId &&
              wa.assignmentLevel === 1,
          ) != null
        ) {
          user.assignmentLevel = TEST_ASSIGNMENT_LEVEL.LEVEL1;
          user.isChecked = true;
        } else if (
          user.testAssignment?.find(
            (wa: any) =>
              wa.testClassification?.id === testClassificationId &&
              wa.testWorkCategoryId === testWorkCategoryId &&
              wa.assignmentLevel === 2,
          )
        ) {
          user.assignmentLevel = TEST_ASSIGNMENT_LEVEL.LEVEL2;
          user.isChecked = true;
        } else if (
          user.testAssignment?.find(
            (wa: any) =>
              wa.testClassification?.id === testClassificationId &&
              wa.testWorkCategoryId === testWorkCategoryId &&
              wa.testMaterialId === testMaterial._id &&
              wa.testTypeId &&
              wa.assignmentLevel === 4,
          )
        ) {
          user.assignmentLevel = TEST_ASSIGNMENT_LEVEL.LEVEL4;
          user.isChecked = true;
        } else {
          const testAssignment = user.testAssignment?.find(
            (wa: any) =>
              wa.testClassification?.id === testClassificationId &&
              wa.testWorkCategoryId === testWorkCategoryId &&
              wa.testMaterialId === testMaterial._id &&
              wa.assignmentLevel === 3,
          );
          if (testAssignment) {
            user.isChecked = true;
          }
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
        wa.testClassification?.id === testClassificationId &&
        wa.testWorkCategoryId === testWorkCategoryId &&
        wa.testMaterialId === selectedTestMaterial._id &&
        wa.assignmentLevel === 3,
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
    if (testMaterialsTestAssigned) {
      Alert.alert('Success', 'Tests assigned successfully');
      openAssignClose();
      dispatch(clearTestClassificationsAssignmentData());
      setTimeout(() => {
        dispatch(
          getUsersForTestAssignment({
            projectId: loggedInUser.projectId,
            workType: workType,
          }),
        );
      }, 500);
    }
  }, [testMaterialsTestAssigned, error]);

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
        testMaterialsTestAssignToUsers({
          projectId: loggedInUser.projectId,
          testClassificationId: testClassificationId,
          testWorkCategoryId: testWorkCategoryId,
          testMaterialId: selectedTestMaterial._id,
          body: {
            users: usersToBeAssignArray,
            level: 3,
          },
        }),
      );
    }
  };

  const openAssignClose = () => {
    testMaterialsData.forEach((item: any) => {
      item.isChecked = false;
    });
    userData.forEach((item: any) => {
      item.isChecked = false;
    });
    setUserCheckboxes(userData);
    openAssignPopup(!isAssignPopOpen);
  };

  // unmount
  useEffect(
    () => () => {
      setSearchText('');
    },
    [],
  );

  const onNext = (item: any) => {
    if (isTestInventoryClassification(testClassificationType)) {
      // TODO - will introduce type in db and use it iso Classification Name
      if (
        item.materialType === TEST_MATERIALS_TYPES.CONCRETE ||
        item.materialType === TEST_MATERIALS_TYPES.CEMENT ||
        item.materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE ||
        item.materialType === TEST_MATERIALS_TYPES.EMULSION ||
        item.materialType === TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC ||
        item.materialType ===
          TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING ||
        item.materialType === TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA ||
        item.materialType === TEST_MATERIALS_TYPES.BITUMEN ||
        item.materialType === TEST_MATERIALS_TYPES.SOIL ||
        item.materialType === TEST_MATERIALS_TYPES.FLY_ASH
      ) {
        if (
          testClassificationType ===
          TEST_CLASSIFICATION_TYPES.PROCUREMENT_DETAILS
        ) {
          let routeName = "Procurements";
          if (testWorkCategoryType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS) {
            routeName = "ProcurementsBitnumiousWork";
          }
          else if(testWorkCategoryType===TEST_WORK_CATEGORY_TYPES.EARTH_WORKS){
            routeName = "ProcurementsEarthWork";
          }
          navigation.navigate(routeName, {
            testClassificationId: testClassificationId,
            testClassificationName: testClassificationName,
            testClassificationType: testClassificationType,
            testWorkCategoryId: testWorkCategoryId,
            testWorkCategoryName: testWorkCategoryName,
            testWorkCategoryType: testWorkCategoryType,
            testMaterialId: item._id,
            testMaterialName: item.name,
            materialType: item.materialType,
            workType: workType,
          });
        } else if (
          testClassificationType === TEST_CLASSIFICATION_TYPES.SOURCE_APPROVALS
        ) {
          navigation.navigate('SourceApprovals', {
            testClassificationId: testClassificationId,
            testClassificationName: testClassificationName,
            testClassificationType: testClassificationType,
            testWorkCategoryId: testWorkCategoryId,
            testWorkCategoryName: testWorkCategoryName,
            testWorkCategoryType: testWorkCategoryType,
            testMaterialId: item._id,
            testMaterialName: item.name,
            materialType: item.materialType,
            workType: workType,
          });
        }
      }
    } else {
      navigation.navigate('AssignTestTypes', {
        testClassificationId: testClassificationId,
        testClassificationName: testClassificationName,
        testWorkCategoryId: testWorkCategoryId,
        testWorkCategoryName: testWorkCategoryName,
        testMaterialId: item._id,
        testMaterialName: item.name,
        workType: workType,
      });
    }
  };

  return (
    <View style={styles.Container}>
      {error && (
        <View style={styles.ErrorSectionStyle}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <View style={styles.SectionStyle}>
        <Image
          source={require('./../../../images/search-icon.png')}
          style={styles.ImageSearch}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Search"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          underlineColorAndroid="#f000"
          blurOnSubmit={false}
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
          }}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.Height100}>
        <View style={{paddingBottom: 50}}>
          {testMaterialsData
            .filter((subSeg: any) => {
              if (searchText && subSeg.name) {
                return subSeg.name
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
              } else {
                return true;
              }
            })
            .map((item: any, index) => (
              <View style={styles.UserCategory}>
                <View style={styles.FlexRowCenter}>
                  {!isTestInventoryClassification(testClassificationType) && (
                    <CheckBox
                      value={item.isChecked}
                      onValueChange={() => handleRadioChange(index)}
                      style={styles.checkbox}
                      tintColors={{true: '#0F56B3', false: '#818181'}}
                    />
                  )}
                  <View>
                    <Text style={styles.UserRole}>{item.name}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => onNext(item)}>
                  <Image
                    style={styles.CloseIcon}
                    source={require('./../../../images/right-arrow.png')}
                  />
                </TouchableOpacity>
              </View>
            ))}
        </View>
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
                    source={require('./../../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ModalInnerContainer}>
                <View>
                  <Text style={styles.AssignRoleText}>
                    Test Material: {selectedTestMaterial.name}
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
                          tintColors={{true: '#0F56B3', false: '#818181'}}
                        />
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.AssignRoleText}>{item.name}</Text>
                          {item.assignmentLevel ? (
                            <Text style={styles.userAlreadyAssigned}>
                              {item.assignmentLevel}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.assignTagButoon}
                  onPress={() => onTestAssignment()}>
                  <Text style={styles.assignTagButoonText}>Assign</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <LoadingAnimation
        loading={
          loading || loadingUsers || loadingTestWorkCategory
        }></LoadingAnimation>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    paddingVertical: 10,
    padding: 15,
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
    paddingLeft: 45,
    paddingRight: 15,
    backgroundColor: '#fff',
    fontWeight: '600',
    paddingVertical: 15,
    height: 55,
  },
  SectionStyle: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
    marginHorizontal: -15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    // Shadow for Android
    elevation: 10,
    alignItems: 'center',
    marginTop: -10,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: '#1C58C0',
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
    backgroundColor: '#1C58C0',
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
    backgroundColor: '#1C58C0',
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
    backgroundColor: '#1C58C0',
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
  assignTagButoonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default AssignTestMaterials;
