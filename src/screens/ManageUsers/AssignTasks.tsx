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
import {HeaderItems, WORK_ASSIGNMENT_LEVEL} from '../../constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearProjectModulesWorkAssignmentData,
  getProjectModuleComponentTasks,
  getUsersForWorkAssignment,
  taskWorkAssignToUsers,
  getProjectModuleSegmentTasks,
  getProjectModuleSubComponentTasks,
} from './actions';
import {ScrollView} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import LoadingAnimation from '../Common/LoadingAnimation';
import LinearGradient from 'react-native-linear-gradient';
import { getWorkTypeColors } from '../Common/CommonConstantsTypes';

const AssignTasks = ({route, navigation}: {route: any; navigation: any}) => {
  const {
    projectModuleId,
    projectModuleName,
    type,
    subType,
    segmentId,
    segmentName,
    componentId,
    componentName,
    subComponentId,
    subComponentName,
    workType,
    taskCategory
  } = route.params;

  // Color scheme function
  

  const workTypeColors = getWorkTypeColors(workType);

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {
    tasks,
    users,
    loadingUsers,
    loadingTask,
    taskWorkAssigned,
    loading,
    error,
  } = useSelector((state: any) => state.WorkAssignment);
  const [tasksData, setTasksData] = useState([]);
  const [selectedTask, setSelectedTask] = useState({
    isChecked: false,
    _id: '',
    name: '',
    displayName: '',
  });
  const [userData, setUserCheckboxes] = useState([]);
  const [isAssignPopOpen, openAssignPopup] = useState(false);
  const [searchText, setSearchText] = useState('');

  const dispatch = useDispatch();

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.assignTasks);
  }

  useEffect(() => {
    if (tasks) {
      tasks.forEach((pModule: any) => {
        pModule.isChecked = false;
      });
      setTasksData(tasks);
    }

    if (users) {
      users.forEach((user: any) => {
        user.isChecked = false;
      });
      setUserCheckboxes(users);
    }
  }, [tasks, users, error]);

  useEffect(() => {
    if (subComponentId) {
      dispatch(
        getProjectModuleSubComponentTasks({
          projectId: loggedInUser.projectId,
          projectModuleId: projectModuleId,
          segmentId: segmentId,
          componentId: componentId,
          subComponentId: subComponentId,
          taskCategory: taskCategory
        }),
      );
    } else if (componentId) {
      dispatch(
        getProjectModuleComponentTasks({
          projectId: loggedInUser.projectId,
          projectModuleId: projectModuleId,
          segmentId: segmentId,
          componentId: componentId,
          taskCategory: taskCategory
        }),
      );
    } else {
      dispatch(
        getProjectModuleSegmentTasks({
          projectId: loggedInUser.projectId,
          projectModuleId: projectModuleId,
          segmentId: segmentId,
          taskCategory: taskCategory
        }),
      );
    }

    dispatch(
      getUsersForWorkAssignment({
        projectId: loggedInUser.projectId,
        workType: workType,
      }),
    );
  }, []);

  const handleRadioChange = (index: any) => {
    const task: any = tasksData[index];

    task.isChecked = !task.isChecked;
    setSelectedTask(task);

    const updatedCheckboxes: any = [...userData];

    if (task.isChecked) {
      updatedCheckboxes.forEach((user: any) => {
        user.isChecked = false;
        delete user.assignmentLevel;
        /*if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.assignmentLevel === 1,
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL1;
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId === segmentId &&
              wa.assignmentLevel === 2,
          )
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL2;
          user.isChecked = true;
        }*/
       if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId === segmentId &&
              wa.componentId === componentId &&
              wa.assignmentLevel === 3 &&
              wa.assignmentLevelFrom === 3,
          )
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL3;
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId === segmentId &&
              wa.componentId === componentId &&
              wa.subComponentId === subComponentId &&
              wa.assignmentLevel === 4 &&
              wa.assignmentLevelFrom === 4,
          )
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL4;
          user.isChecked = true;
        } else {
          const workAssignment = user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId === segmentId &&
              wa.componentId === componentId &&
              wa.subComponentId === subComponentId &&
              wa.taskId === task._id &&
              wa.assignmentLevel === 5,
          );
          if (workAssignment) {
            user.isChecked = true;
          } else if (
            user.workAssignment?.find(
              (wa: any) =>
                wa.projectModule?.id === projectModuleId &&
                wa.segmentId === segmentId &&
                wa.componentId === componentId &&
                subComponentId == null &&
                wa.taskId === task._id &&
                wa.assignmentLevel === 5,
            )
          ) {
            user.isChecked = true;
          } else if (
            user.workAssignment?.find(
              (wa: any) =>
                wa.projectModule?.id === projectModuleId &&
                wa.segmentId &&
                componentId == null &&
                subComponentId == null &&
                wa.taskId === task._id &&
                wa.assignmentLevel === 5,
            ) != null
          ) {
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
        wa.componentId === componentId &&
        wa.taskId === selectedTask._id &&
        wa.assignmentLevel === 5,
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
    if (taskWorkAssigned) {
      Alert.alert('Success', 'Tasks assigned successfully');
      openAssignClose();
      dispatch(clearProjectModulesWorkAssignmentData());
      setTimeout(() => {
        dispatch(
          getUsersForWorkAssignment({
            projectId: loggedInUser.projectId,
            workType: workType,
          }),
        );
      }, 500);
    }
  }, [taskWorkAssigned, error]);

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
        taskWorkAssignToUsers({
          projectId: loggedInUser.projectId,
          projectModuleId: projectModuleId,
          segmentId: segmentId,
          componentId: componentId,
          subComponentId: subComponentId,
          taskId: selectedTask._id,
          taskCategory: taskCategory,
          body: {
            users: usersToBeAssignArray,
            level: 5,
          },
        }),
      );
    }
  };

  const openAssignClose = () => {
    tasksData.forEach((item: any) => {
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

      <ScrollView style={styles.Height100}>
        {tasksData
          .filter((task: any) => {
            if (searchText && task.displayName) {
              return task.displayName
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
                styles.taskItemContainer,
                {borderColor: workTypeColors.borderColor},
              ]}>
              <LinearGradient
                colors={workTypeColors.gradientColors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.gradientContainer}>
                <View
                  style={[
                    styles.leftBorder,
                    {backgroundColor: workTypeColors.leftBorderColor},
                  ]}
                />
                <View style={styles.FlexRowCenter}>
                  <CheckBox
                    value={item.isChecked}
                    onValueChange={() => handleRadioChange(index)}
                    style={styles.checkbox}
                    tintColors={{
                      true: workTypeColors.checkboxColor,
                      false: '#818181',
                    }}
                  />
                  <View>
                    <Text style={styles.UserRole}>{item.displayName}</Text>
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
                  <Text style={styles.AssignRoleTextHeading}>
                    Task: {selectedTask.displayName}
                  </Text>
                </View>
                <ScrollView style={{paddingTop: 0, height: 500}}>
                  {userData.map((item: any, index) => (
                    <View key={index} style={styles.CategoryType}>
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
                  onPress={() => onWorkAssignment()}>
                  <Text style={styles.assignTagButoonText}>Assign</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <LoadingAnimation
        loading={loading || loadingUsers || loadingTask}></LoadingAnimation>
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
  // New gradient styles - replacing the old UserCategory style
  taskItemContainer: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  gradientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
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
  },
  UserCategory: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
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
    color: '#27272A',
    marginLeft: 10,
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
    marginVertical: 10,
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
  assignTagButoonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default AssignTasks;
