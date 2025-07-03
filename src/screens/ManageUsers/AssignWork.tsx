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
import {useIsFocused} from '@react-navigation/native';
import {
  HeaderItems,
  PROJECT_TYPE,
  WORK_ASSIGNMENT_LEVEL,
} from '../../constants/constants';
import CheckBox from '@react-native-community/checkbox';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearProjectModulesWorkAssignmentData,
  getProjectModules,
  getUsersForWorkAssignment,
  projectModulesWorkAssignToUsers,
} from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import LinearGradient from 'react-native-linear-gradient';
import {getWorkTypeColors} from '../Common/CommonConstantsTypes';

const AssignWork = ({route, navigation}: {route: any; navigation: any}) => {
  const [projectModulesData, setProjectModulesData] = useState([]);
  const [selectedProjectModule, setSelectedProjectModule] = useState({
    isChecked: false,
    _id: '',
    name: '',
  });
  const [searchText, setSearchText] = useState('');
  const [userData, setUserCheckboxes] = useState([]);

  const {workType, taskCategory} = route.params;

  // Get colors based on work type
  const workTypeColors = getWorkTypeColors(workType);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.assignWork);
  }

  const dispatch = useDispatch();

  const [isAssignPopOpen, openAssignPopup] = useState(false);
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {
    projectModules,
    users,
    projectModulesWorkAssigned,
    loading,
    loadingUsers,
    error,
  } = useSelector((state: any) => state.WorkAssignment);

  // unmount
  useEffect(
    () => () => {
      setProjectModulesData([]);
      setUserCheckboxes([]);
      setSearchText('');
    },
    [],
  );
  // useEffect(() => {
  //   console.log('projectModulesData:', projectModulesData);
  //   console.log('projectModulesData length:', projectModulesData.length);

  //   // Log each item individually
  //   projectModulesData.forEach((item, index) => {
  //     console.log(`Project Module ${index}:`, item);
  //   });
  // }, [projectModulesData]);
  useEffect(() => {
    console.log('Work Type', workType);
    if (projectModules) {
      projectModules.forEach((pModule: any) => {
        pModule.isChecked = false;
      });
      setProjectModulesData(projectModules);
    }

    if (users) {
      users.forEach((user: any) => {
        user.isChecked = false;
      });
      setUserCheckboxes(users);
    }
  }, [projectModules, users]);

  useEffect(() => {
    console.log('====taskCategory=======', taskCategory);
    dispatch(
      getProjectModules({
        projectId: loggedInUser.projectId,
        workType: workType,
        taskCategory: taskCategory,
      }),
    );

    dispatch(
      getUsersForWorkAssignment({
        projectId: loggedInUser.projectId,
        workType: workType,
      }),
    );
  }, []);

  const handleRadioChange = (index: any) => {
    const projectModule: any = projectModulesData[index];

    projectModule.isChecked = !projectModule.isChecked;
    setSelectedProjectModule(projectModule);

    const updatedCheckboxes: any = [...userData];

    if (projectModule.isChecked) {
      updatedCheckboxes.forEach((user: any) => {
        user.isChecked = false;
        delete user.assignmentLevel;
        const workAssignment = user.workAssignment?.find(
          (wa: any) =>
            wa.projectModule?.id === projectModulesData[index]._id &&
            wa.assignmentLevel === 1,
        );

        if (workAssignment) {
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModule._id &&
              wa.segmentId &&
              wa.assignmentLevel === 2,
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL2;
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModule._id &&
              wa.segmentId &&
              wa.componentId &&
              wa.assignmentLevel === 3,
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL3;
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModule._id &&
              wa.segmentId &&
              wa.componentId &&
              wa.taskId &&
              wa.assignmentLevel === 4,
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL4;
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModule._id &&
              wa.segmentId &&
              wa.componentId &&
              wa.subComponentId &&
              wa.taskId &&
              wa.assignmentLevel === 5,
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL5;
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModule._id &&
              wa.segmentId &&
              wa.taskId &&
              wa.assignmentLevel === 5,
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL5;
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
    const workAssignment = selectedUser.workAssignment?.find(
      (wa: any) =>
        wa.projectModule?.id === selectedProjectModule._id &&
        wa.assignmentLevel === 1,
    );
    if (selectedUser.isChecked) {
      if (workAssignment) {
        workAssignment.dirty = false;
        selectedUser.dirty = false;
      } else {
        selectedUser.dirty = true;
      }
      selectedUser.delete = false;
    } else {
      if (!workAssignment) {
        selectedUser.dirty = false;
      } else {
        selectedUser.dirty = true;
        selectedUser.delete = true;
        workAssignment.dirty = true;
      }
    }

    setUserCheckboxes(updatedCheckboxes);
  };

  useEffect(() => {
    if (projectModulesWorkAssigned) {
      Alert.alert('Success', 'Works assigned successfully');
      openAssignClose();
      dispatch(clearProjectModulesWorkAssignmentData());
      dispatch(
        getUsersForWorkAssignment({
          projectId: loggedInUser.projectId,
          workType: workType,
        }),
      );
    }
  }, [projectModulesWorkAssigned, error]);

  const onWorkAssignment = () => {
    const usersToBeAssign = userData.filter((u: any) => u.dirty);

    let usersToBeAssignArray: any = [];

    usersToBeAssign.forEach((u: any) => {
      let user: any = {
        _id: u._id,
        delete: u.delete || false,
      };
      const workAssignment = u.workAssignment?.find((wa: any) => wa.dirty);
      if (workAssignment) {
        user.workAssignmentId = workAssignment._id;
      }

      usersToBeAssignArray.push(user);
    });

    if (usersToBeAssignArray.length) {
      dispatch(
        projectModulesWorkAssignToUsers({
          projectId: loggedInUser.projectId,
          projectModuleId: selectedProjectModule._id,
          body: {
            users: usersToBeAssignArray,
            level: 1,
          },
        }),
      );
    }
  };

  const openAssignClose = () => {
    projectModulesData.forEach((item: any) => {
      item.isChecked = false;
    });
    userData.forEach((item: any) => {
      item.isChecked = false;
    });
    openAssignPopup(!isAssignPopOpen);
  };

  return (
    <View style={styles.Container}>
      <View style={styles.TopHeaderFixed}>
        {error && (
          <View style={styles.ErrorSectionStyle}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <View style={styles.SectionStyle}>
          <Image
            source={require('./../../images/search-icon.png')}
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
      </View>
      <ScrollView style={styles.Height100}>
        {projectModulesData
          .filter((projectMod: any) => {
            if (searchText && projectMod.name) {
              return projectMod.name
                .toLowerCase()
                .includes(searchText.toLowerCase());
            } else {
              return true;
            }
          })
          .map((item: any, index) => (
            <View
              key={index}
              style={[
                styles.UserCategory,
                {borderColor: workTypeColors.borderColor},
              ]}>
              <LinearGradient
                colors={workTypeColors.gradientColors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.gradientBackground}
              />
              <View
                style={[
                  styles.leftBorder,
                  {backgroundColor: workTypeColors.leftBorderColor},
                ]}
              />

              {/* Left side: Checkbox */}
              <View style={styles.FlexRowCenter}>
                <CheckBox
                  value={item.isChecked}
                  onValueChange={() => handleRadioChange(index)}
                  style={styles.checkbox}
                  tintColors={{true: '#5A2AAF', false: '#000001'}}
                />
              </View>

              {/* Right side: Name and Number */}
              <View style={styles.rightContentContainer}>
                <View style={styles.nameNumberContainer}>
                  <Text style={styles.UserRole}>{item.name}</Text>
                  <View style={styles.numberCircle}>
                    <Text
                      style={[
                        styles.numberText,
                        {color: workTypeColors.leftBorderColor},
                      ]}>
                      {item.taskCount}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('SegmentsList', {
                      projectModuleId: item._id,
                      projectModuleName: item.name,
                      type: item.type,
                      subType: item.subType,
                      workType: workType,
                      taskCategory: taskCategory,
                    })
                  }>
                  <Image
                    style={styles.CloseIcon}
                    source={require('./../../images/right-arrow.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}

        {/* No Data Found */}
        {!loading && !projectModulesData.length && (
          <View style={styles.NoDataContainer}>
            <Image
              style={styles.WthHeight}
              source={require('./../../images/no-data-found.png')}
            />
            <Text style={styles.NodataHeadText}>Sorry, no result found!</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal Start */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isAssignPopOpen}
        onRequestClose={() => {
          openAssignPopup(!isAssignPopOpen);
        }}>
        <View style={styles.modalBackdrop}>
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
                <View style={styles.modalTopButtonsContainer}>
                  <TouchableOpacity
                    style={styles.modalTopButton}
                    onPress={() => {
                      console.log('Update user:');
                    }}>
                    <Text style={styles.modalTopButtonText}>Select All</Text>
                  </TouchableOpacity>

                  <Text style={[styles.buttonSeparator, {fontSize: 19}]}>
                    |
                  </Text>

                  <TouchableOpacity style={styles.modalTopButton}>
                    {/* <Image style={{width:14,height:14}} source={require('./../../images/userManagement/refresh.png')} /> */}
                    <Text style={styles.modalTopButtonText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.AssignRoleTextHeading}>
                    Project Module: {selectedProjectModule.name}
                  </Text>
                </View>
                <ScrollView style={styles.modalScrollView}>
                  {userData.map((item: any, index) => (
                    <View key={index} style={styles.CategoryType}>
                      {/* Left side: Checkbox and user info */}
                      <View style={styles.FlexRowCenter}>
                        <CheckBox
                          value={item.isChecked}
                          disabled={item.assignmentLevel != null}
                          onValueChange={() => handleUserData(index)}
                          style={styles.checkbox}
                          tintColors={{true: '#5A2AAF', false: '#000001'}}
                        />
                        <View style={styles.userInfoContainer}>
                          <Text style={styles.AssignRoleText} numberOfLines={1}>
                            {item.name}
                          </Text>
                          {item.assignmentLevel && (
                            <Text
                              style={styles.userRoleSubtext}
                              numberOfLines={1}>
                              {item.assignmentLevel}
                            </Text>
                          )}
                        </View>
                      </View>

                      {/* Right side: Action buttons */}
                      <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                          style={styles.updateButton}
                          onPress={() => {
                            console.log('Update user:', item.name);
                          }}>
                          <Text style={styles.updateButtonText}>Update</Text>
                        </TouchableOpacity>

                        <Text style={styles.buttonSeparator}>|</Text>

                        <TouchableOpacity
                          style={styles.deassignButton}
                          onPress={() => {
                            console.log('Deassign user:', item.name);
                          }}>
                          <Text style={styles.deassignButtonText}>
                            Deassign
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.assignTagButoon}
                  onPress={() => onWorkAssignment()}>
                  <Text style={styles.assignTagButoonText}>Assign</Text>
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
    paddingBottom: 65,
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
  FlexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  TopHeaderFixed: {
    marginBottom: 15,
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
    marginBottom: 0,
    position: 'relative',
    marginHorizontal: -15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 20,
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
    marginTop: 15,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderStyle: 'solid',
    position: 'relative',
    overflow: 'hidden',
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
  },
  checkbox: {
    transform: [{scaleX: 1}, {scaleY: 1}],
  },
  UserRole: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    paddingLeft: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  modalView: {
    minHeight: 150,
  },
  ModalInnerContainer: {
    paddingHorizontal: 15,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27272A',
    textAlign: 'center',
  },
  Height100: {
    height: '100%',
    paddingBottom: 20,
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
  modalTopButtonsContainer: {
    flexDirection: 'row-reverse',
    paddingVertical: 5,
  },
  modalTopButton: {
    paddingHorizontal: 2,
    paddingVertical: 6,
    marginRight: 2,
  },
  modalTopButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5A2AAF',
  },
  modalScrollView: {
    paddingTop: 0,
    height: 500,
  },
  AssignRoleTextHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27272A',
    marginLeft: 5,
    marginTop: 10,
  },
  AssignRoleText: {
    fontSize: 14,
    fontWeight: '600',
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
  assignTagButoonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  CategoryType: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
    paddingVertical: 15,
    paddingHorizontal: 5,
    minHeight: 60,
  },
  userInfoContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    flex: 0.6,
    minWidth: 120,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.4,
    justifyContent: 'flex-end',
    minWidth: 100,
  },
  updateButton: {
    paddingHorizontal: 2,
    paddingVertical: 6,
    marginRight: 2,
  },
  updateButtonText: {
    color: '#5A2AAF',
    fontSize: 12,
    fontWeight: '400',
  },
  deassignButton: {
    paddingHorizontal: 4,
    marginRight: 4,
  },
  deassignButtonText: {
    color: '#5A2AAF',
    fontSize: 12,
    fontWeight: '400',
  },
  buttonSeparator: {
    color: '#CCCCCC',
    fontSize: 13,
  },
  userRoleSubtext: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
    paddingLeft: 8,
  },
  numberCircle: {
    minWidth: 38,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rightContentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default AssignWork;
