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
  PROJECT_TYPE,
  USER_CATEGORY,
  WORK_ASSIGNMENT_LEVEL,
} from '../../constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearProjectModulesWorkAssignmentData,
  getProjectModuleComponents,
  getUsersForWorkAssignment,
  componentWorkAssignToUsers,
  getProjectModuleNextLevel,
  clearNextLevel,
} from './actions';
import commonStyles from '../Common/commonStyles';
import {ScrollView} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import LoadingAnimation from '../Common/LoadingAnimation';
import CardComponent from '../Common/CardComponent';
import {
  commonComponentTypes,
  getWorkTypeColors,
} from '../Common/CommonConstantsTypes';
import LinearGradient from 'react-native-linear-gradient';

const ComponentsList = ({route, navigation}: {route: any; navigation: any}) => {
  const {
    projectModuleId,
    projectModuleName,
    type,
    subType,
    segmentId,
    segmentName,
    workType,
    taskCategory,
  } = route.params;

  // Get colors based on work type
  const workTypeColors = getWorkTypeColors(workType);

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {
    components,
    users,
    nextLevel,
    loadingUsers,
    loadingComponent,
    componentWorkAssigned,
    loading,
    error,
  } = useSelector((state: any) => state.WorkAssignment);
  const [componentsData, setComponentsData] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState({
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
    eventEmitter.emit('headerEvent', HeaderItems.componentsList);
  }

  useEffect(() => {
    if (components) {
      components.forEach((pModule: any) => {
        pModule.isChecked = false;
      });
      setComponentsData(components);
    }

    if (users) {
      users.forEach((user: any) => {
        user.isChecked = false;
      });
      setUserCheckboxes(users);
    }
  }, [components, users, error]);

  useEffect(() => {
    dispatch(
      getProjectModuleComponents({
        projectId: loggedInUser.projectId,
        projectModuleId: projectModuleId,
        segmentId: segmentId,
        taskCategory: taskCategory,
      }),
    );

    dispatch(
      getUsersForWorkAssignment({
        projectId: loggedInUser.projectId,
        workType:
          workType === PROJECT_TYPE.INITIAL_SURVEY
            ? USER_CATEGORY.SURVEY_WORK
            : workType,
      }),
    );
  }, []);

  const handleRadioChange = (index: any) => {
    const component: any = componentsData[index];

    component.isChecked = !component.isChecked;
    setSelectedComponent(component);

    const updatedCheckboxes: any = [...userData];

    if (component.isChecked) {
      updatedCheckboxes.forEach((user: any) => {
        user.isChecked = false;
        delete user.assignmentLevel;
        /*
        if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.assignmentLevel === 1 &&
              wa.assignmentLevelFrom === 1
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL1;
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId === segmentId &&
              wa.assignmentLevel === 2 &&
              wa.assignmentLevelFrom === 2
          )
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL2;
          user.isChecked = true;
        } else
        */
        if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId === segmentId &&
              wa.componentId === component._id &&
              wa.assignmentLevel === 4 &&
              wa.assignmentLevelFrom === 4,
          )
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL4;
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId === segmentId &&
              wa.componentId === component._id &&
              wa.assignmentLevel === 5 &&
              wa.assignmentLevelFrom === 5,
          )
        ) {
          console.log('=================', JSON.stringify(user.workAssignment));
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL5;
          user.isChecked = true;
        } /*else if (user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModuleId && wa.segmentId === segmentId && wa.assignmentLevel === 5)) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL5;
          user.isChecked = true;
        }*/ else {
          const workAssignment = user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId === segmentId &&
              wa.componentId === component._id &&
              wa.assignmentLevel === 3,
          );
          if (workAssignment) {
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
    const workAssignment = selectedUser.workAssignment?.find(
      (wa: any) =>
        wa.projectModule?.id === projectModuleId &&
        wa.segmentId === segmentId &&
        wa.componentId === selectedComponent._id &&
        wa.assignmentLevel === 3,
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
    if (componentWorkAssigned) {
      Alert.alert('Success', 'Works assigned successfully');
      openAssignClose();
      dispatch(clearProjectModulesWorkAssignmentData());
      setTimeout(() => {
        dispatch(
          getUsersForWorkAssignment({
            projectId: loggedInUser.projectId,
            workType: workType === PROJECT_TYPE.INITIAL_SURVEY
                        ? USER_CATEGORY.SURVEY_WORK
                        : workType,
          }),
        );
      }, 500);
    }
  }, [componentWorkAssigned, error]);

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
        componentWorkAssignToUsers({
          projectId: loggedInUser.projectId,
          projectModuleId: projectModuleId,
          segmentId: segmentId,
          componentId: selectedComponent._id,
          taskCategory: taskCategory,
          body: {
            users: usersToBeAssignArray,
            level: 3,
          },
        }),
      );
    }
  };

  const openAssignClose = () => {
    componentsData.forEach((item: any) => {
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

  const onComponentNextClick = (item: any) => {
    setSelectedComponent(item);
    dispatch(
      getProjectModuleNextLevel({
        projectId: loggedInUser.projectId,
        projectModuleId: projectModuleId,
        id: item._id,
        taskCategory: taskCategory,
        type: 'component',
      }),
    );
  };

  useEffect(() => {
    if (nextLevel) {
      dispatch(clearNextLevel());
      if (nextLevel.nextLevel === 'sub-component') {
        navigation.navigate('SubComponentsList', {
          projectModuleId: projectModuleId,
          projectModuleName: projectModuleName,
          segmentId: segmentId,
          segmentName: segmentName,
          componentId: selectedComponent._id,
          componentName: selectedComponent.name,
          type: type,
          subType: subType,
          workType: workType,
          taskCategory: taskCategory,
        });
      } else if (nextLevel.nextLevel === 'task') {
        navigation.navigate('AssignTasks', {
          projectModuleId: projectModuleId,
          projectModuleName: projectModuleName,
          segmentId: segmentId,
          segmentName: segmentName,
          componentId: selectedComponent._id,
          componentName: selectedComponent.name,
          type: type,
          subType: subType,
          workType: workType,
          taskCategory: taskCategory,
        });
      }
    }
  }, [nextLevel]);

  // code for Grouping coponent types
  const {componentType} = componentsData
    .filter((subSeg: any) => {
      if (searchText && subSeg.name) {
        return subSeg.name.toLowerCase().includes(searchText.toLowerCase());
      }
      return true;
    })
    .reduce(
      (result: {componentType: any[]}, item: any) => {
        result.componentType.push(item);
        return result;
      },
      {componentType: []},
    );

  const filteredCategory = componentType
    .filter((item, index) => index === 0)
    .map(item => ({
      segmentCategory: item.segmentCategory || '',
      name: item.type || '',
    }));

  const repeatedComponentTypes = commonComponentTypes.map(
    (type: any, index: any) => {
      const filteredItems = componentType.filter(item => item.type === type);
      if (filteredItems.length === 0) {
        return null;
      }
      console.log('Filtered Items:', filteredItems);
      return (
        filteredItems.length > 0 && (
          <>
            <View style={styles.separatTaskType} key={type}>
              <View style={styles.titleTextForGrouping}>
                <Text
                  style={[
                    styles.titleText,
                    {color: workTypeColors.titleColor},
                  ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </View>
              {filteredItems.map((item, index) => (
                <View
                  key={`${type}-${index}`}
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

                  {/* Main content row */}
                  <View style={styles.mainContentRow}>
                    <View style={styles.FlexRowCenter}>
                      <CheckBox
                        value={item.isChecked}
                        onValueChange={() =>
                          handleRadioChange(filteredItems.indexOf(item))
                        }
                        style={styles.checkbox}
                        tintColors={{true: '#5A2AAF', false: '#000001'}}
                      />

                      {/* Updated layout for name and task count */}
                      <View>
                        <Text style={styles.UserRole}>{item.name || ''}</Text>
                      </View>
                    </View>
                    <View style={styles.FlexRowCenter}>
                      <View style={styles.numberCircle}>
                        <Text
                          style={[
                            styles.numberText,
                            {color: workTypeColors.leftBorderColor},
                          ]}>
                          {item.taskCount}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => onComponentNextClick(item)}>
                        <Image
                          style={styles.CloseIcon}
                          source={require('./../../images/right-arrow.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Dashed line separator */}
                  <View
                    style={[
                      styles.dashedLine,
                      {borderBottomColor: workTypeColors.leftBorderColor},
                    ]}
                  />

                  {/* Three buttons row */}
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        console.log(
                          'Split by Chainage pressed for:',
                          item.name,
                        );
                        // Add your split by chainage logic here
                      }}>
                      <View style={styles.buttonContent}>
                        <Image
                          style={styles.buttonIcon}
                          source={require('./../../images/userManagement/spliting.png')} // Replace with your actual icon
                        />
                        <Text style={styles.buttonText}>Split by Chainage</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        console.log('Split by Layer pressed for:', item.name);
                        // Add your split by layer logic here
                      }}>
                      <View style={styles.buttonContent}>
                        <Image
                          style={styles.buttonIcon}
                          source={require('./../../images/userManagement/spliting.png')} // Replace with your actual icon
                        />
                        <Text style={styles.buttonText}>Split by Layer</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        console.log('Delete pressed for:', item.name);
                        // Add your delete logic here
                      }}>
                      <View style={styles.buttonContent}>
                        <Image
                          style={styles.buttonIcon}
                          source={require('./../../images/userManagement/delete.png')} // Replace with your actual icon
                        />
                        <Text style={styles.buttonText}>Delete</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )
      );
    },
  );
  // End code for Grouping coponent types

  return (
    <View style={styles.Container}>
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
      <ScrollView
        style={styles.Height100}
        contentContainerStyle={commonStyles.paddingBottom20}>
        <>
          <View style={{paddingVertical: 10}}>
            <Text
              style={[
                styles.titleText,
                {color: workTypeColors.titleColor, fontWeight: '700'},
              ]}>
              {filteredCategory[0]?.segmentCategory !== 'NA'
                ? filteredCategory[0]?.segmentCategory
                    ?.charAt(0)
                    .toUpperCase() +
                  filteredCategory[0]?.segmentCategory?.slice(1)
                : filteredCategory[0]?.name
                ? filteredCategory[0]?.name.charAt(0).toUpperCase() +
                  filteredCategory[0]?.name.slice(1)
                : ''}
            </Text>
          </View>
          {repeatedComponentTypes}
        </>
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
                      console.log('Select All users');
                      // Add logic to select all users
                    }}>
                    <Text style={styles.modalTopButtonText}>Select All</Text>
                  </TouchableOpacity>

                  <Text style={[styles.buttonSeparator, {fontSize: 19}]}>
                    |
                  </Text>

                  <TouchableOpacity
                    style={styles.modalTopButton}
                    onPress={() => {
                      console.log('Refresh users');
                      // Add logic to refresh users
                    }}>
                    <Text style={styles.modalTopButtonText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.AssignRoleTextHeading}>
                    Component: {selectedComponent.name}
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
                            // Add logic to update user assignment
                          }}>
                          <Text style={styles.updateButtonText}>Update</Text>
                        </TouchableOpacity>

                        <Text style={styles.buttonSeparator}>|</Text>

                        <TouchableOpacity
                          style={styles.deassignButton}
                          onPress={() => {
                            console.log('Deassign user:', item.name);
                            // Add logic to deassign user
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
      <LoadingAnimation
        loading={
          loading || loadingUsers || loadingComponent
        }></LoadingAnimation>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    paddingVertical: 10,
    padding: 8,
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
    backgroundColor: '#5A2AAF',
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
    marginBottom: 0,
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
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 8,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginLeft: 12,
    marginRight: 12,
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
    top: '15%',
    bottom: '15%',
    zIndex: 100,
    width: 2,
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
    color: '#000000',
    paddingLeft: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingVertical: 15,
    paddingHorizontal: 5,
    minHeight: 60,
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
  separatTaskType: {
    marginBottom: 10,
  },
  titleTextForGrouping: {},
  titleText: {
    fontSize: 18,
    fontWeight: '400',
    paddingLeft: 12,
    paddingBottom: 2,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
  mainContentRow: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    borderStyle: 'dashed',
    marginVertical: 10,
    marginHorizontal: -10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
    paddingTop: 5,
  },
  actionButton: {
    //backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#5A2AAF',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  buttonIcon: {
    width: 15,
    height: 15,
  },
  buttonText: {
    fontSize: 12,
    color: '#5A2AAF',
    fontWeight: '500',
  },
});

export default ComponentsList;
