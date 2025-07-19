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
  SEGMENT_TYPES_DISPLAY,
  USER_CATEGORY,
  WORK_ASSIGNMENT_LEVEL,
} from '../../constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearNextLevel,
  clearProjectModulesWorkAssignmentData,
  getProjectModuleNextLevel,
  getProjectModuleSegments,
  getUsersForWorkAssignment,
  segmentTypeWorkAssignToUsers,
  segmentWorkAssignToUsers,
} from './actions';
import {ScrollView} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import LoadingAnimation from '../Common/LoadingAnimation';
import {groupBy} from '../../utils/Utils';
import LinearGradient from 'react-native-linear-gradient';
import {getWorkTypeColors} from '../Common/CommonConstantsTypes';

const SegmentsList = ({route, navigation}: {route: any; navigation: any}) => {
  const {
    projectModuleId,
    projectModuleName,
    type,
    subType,
    workType,
    taskCategory,
    chainage,
  } = route.params;

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {
    segments,
    users,
    segmentWorkAssigned,
    nextLevel,
    loading,
    loadingSegment,
    loadingUsers,
    error,
  } = useSelector((state: any) => state.WorkAssignment);
  const [segmentsData, setSegmentsData] = useState([]);
  const [selectedSegmentType, setSelectedSegmentType] = useState('');
  const [segmentTypeToAssignWork, setSegmentTypeToAssignWork] = useState('');
  const [segmentsByGroupOnType, setSegmentsByGroupOnType] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState({
    isChecked: false,
    _id: '',
    name: '',
  });
  const [userData, setUserCheckboxes] = useState([]);
  const [isAssignPopOpen, openAssignPopup] = useState(false);
  const [searchText, setSearchText] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (segments) {
      segments.forEach((pModule: any) => {
        pModule.isChecked = false;
      });
      const gbSegmentTypes = groupBy(segments, 'type');
      setSegmentsByGroupOnType(gbSegmentTypes);
    }

    if (users) {
      users.forEach((user: any) => {
        user.isChecked = false;
      });
      setUserCheckboxes(users);
    }
  }, [segments, users, error]);

  useEffect(() => {
    setSelectedSegmentType('');
    setSearchText('');
    console.log('====taskCategory=======', taskCategory);
    dispatch(
      getProjectModuleSegments({
        projectId: loggedInUser.projectId,
        projectModuleId: projectModuleId,
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

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.segmentsList);
  }

  const onSegmentTypeClick = (type: any) => {
    setSelectedSegmentType(type);
    if (segmentsByGroupOnType) {
      setSegmentsData(segmentsByGroupOnType[type]);
    }
  };

  const handleSegmentTypeChange = (segmentType: any) => {
    setSegmentTypeToAssignWork(segmentType);
    if (!isAssignPopOpen) {
      const updatedCheckboxes: any = [...userData];
      updatedCheckboxes.forEach((user: any) => {
        user.isChecked = false;
        delete user.assignedSegmentType;
        delete user.assignmentLevel;
        if (
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
              wa.segmentId &&
              wa.assignmentLevel === 3,
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL3;
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId &&
              wa.componentId &&
              wa.assignmentLevel === 4,
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL4;
          user.isChecked = true;
        } else {
          const assignedWorkLength = user.workAssignment?.filter(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentType === segmentType &&
              wa.assignmentLevel === 2,
          ).length;
          const segmentTypeLength = segmentsByGroupOnType[segmentType].length;

          if (assignedWorkLength === segmentTypeLength) {
            user.isChecked = true;
            user.assignedSegmentType = 'all';
          }
        }
      });
      setUserCheckboxes(updatedCheckboxes);
      openAssignPopup(!isAssignPopOpen);
    }
  };

  const handleRadioChange = (index: any) => {
    const segment: any = segmentsData[index];
    segment.isChecked = !segment.isChecked;
    setSelectedSegment(segment);

    const updatedCheckboxes: any = [...userData];

    if (segment.isChecked) {
      updatedCheckboxes.forEach((user: any) => {
        user.isChecked = false;
        delete user.assignmentLevel;
        if (
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
              wa.segmentId === segment._id &&
              wa.assignmentLevel === 3,
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL3;
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId === segment._id &&
              wa.componentId &&
              wa.assignmentLevel === 4,
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL4;
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
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
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId &&
              wa.componentId &&
              wa.taskId &&
              wa.assignmentLevel === 5,
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL5;
          user.isChecked = true;
        } else if (
          user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId &&
              wa.taskId &&
              wa.assignmentLevel === 5,
          ) != null
        ) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL5;
          user.isChecked = true;
        } else {
          const workAssignment = user.workAssignment?.find(
            (wa: any) =>
              wa.projectModule?.id === projectModuleId &&
              wa.segmentId === segment._id &&
              wa.assignmentLevel === 2,
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
    let workAssignment: any = null;
    if (!selectedSegmentType && selectedUser.assignedSegmentType === 'all') {
      workAssignment = {};
    } else {
      workAssignment = selectedUser.workAssignment?.find(
        (wa: any) =>
          wa.projectModule?.id === projectModuleId &&
          wa.segmentId === selectedSegment._id &&
          wa.assignmentLevel === 2,
      );
    }
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
    if (segmentWorkAssigned) {
      Alert.alert('Success', 'Works assigned successfully');
      openAssignClose();
      dispatch(clearProjectModulesWorkAssignmentData());
      setTimeout(() => {
        dispatch(
          getUsersForWorkAssignment({
            projectId: loggedInUser.projectId,
            workType:
              workType === PROJECT_TYPE.INITIAL_SURVEY
                ? USER_CATEGORY.SURVEY_WORK
                : workType,
          }),
        );
      }, 500);
    }
  }, [segmentWorkAssigned, error]);

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
      if (selectedSegmentType) {
        dispatch(
          segmentWorkAssignToUsers({
            projectId: loggedInUser.projectId,
            projectModuleId: projectModuleId,
            segmentId: selectedSegment._id,
            taskCategory: taskCategory,
            body: {
              users: usersToBeAssignArray,
              level: 2,
            },
          }),
        );
      } else {
        dispatch(
          segmentTypeWorkAssignToUsers({
            projectId: loggedInUser.projectId,
            projectModuleId: projectModuleId,
            type: segmentTypeToAssignWork,
            taskCategory: taskCategory,
            body: {
              users: usersToBeAssignArray,
              level: 2,
            },
          }),
        );
      }
    }
  };

  const openAssignClose = () => {
    segmentsData.forEach((item: any) => {
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

  const onSegmentNextClick = (item: any) => {
    setSelectedSegment(item);
    dispatch(
      getProjectModuleNextLevel({
        projectId: loggedInUser.projectId,
        projectModuleId: projectModuleId,
        id: item._id,
        type: 'segment',
      }),
    );
  };

  useEffect(() => {
    if (nextLevel) {
      dispatch(clearNextLevel());
      if (nextLevel.nextLevel === 'component') {
        navigation.navigate('ComponentsList', {
          projectModuleId: projectModuleId,
          projectModuleName: projectModuleName,
          segmentId: selectedSegment._id,
          segmentName: selectedSegment.name,
          type: type,
          subType: subType,
          workType: workType,
          taskCategory: taskCategory,
          chainage: chainage,
        });
      } else if (nextLevel.nextLevel === 'task') {
        navigation.navigate('AssignTasks', {
          projectModuleId: projectModuleId,
          projectModuleName: projectModuleName,
          segmentId: selectedSegment._id,
          segmentName: selectedSegment.name,
          type: type,
          subType: subType,
          workType: workType,
          taskCategory: taskCategory,
        });
      }
    }
  }, [nextLevel]);

  // Get work type colors
  const workTypeColors = getWorkTypeColors(workType);

  return (
    <View style={styles.Container}>
      {error && (
        <View style={styles.ErrorSectionStyle}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {selectedSegmentType && (
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
      )}
      <ScrollView style={styles.Height100}>
        {!selectedSegmentType &&
        segmentsByGroupOnType &&
        Object.keys(segmentsByGroupOnType).length
          ? Object.keys(segmentsByGroupOnType).map((item, index) => (
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
                <View style={styles.segmentTypeRow}>
                  <View style={styles.FlexRowCenter}>
                    <CheckBox
                      onValueChange={() => handleSegmentTypeChange(item)}
                      style={styles.checkbox}
                      tintColors={{true: '#5A2AAF', false: '#000001'}}
                    />
                    <TouchableOpacity onPress={() => onSegmentTypeClick(item)}>
                      <Text style={styles.segmentTypeText}>
                        {SEGMENT_TYPES_DISPLAY[item]}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.numberCircle}>
                    <Text
                      style={[
                        styles.numberText,
                        {color: workTypeColors.leftBorderColor},
                      ]}>
                      {segmentsByGroupOnType[item].length}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          : null}

        {selectedSegmentType &&
          segmentsData
            .filter((seg: any) => {
              if (searchText && seg.name) {
                return seg.name
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
                  styles.categoryItemContainer,
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
                  {/* Main content row */}
                  <View style={styles.mainContentRow}>
                    {/* Left section: Checkbox and text */}
                    <View style={styles.FlexRowCenter}>
                      <CheckBox
                        value={item.isChecked}
                        onValueChange={() => handleRadioChange(index)}
                        style={styles.checkbox}
                        tintColors={{true: '#5A2AAF', false: '#000001'}}
                      />
                      <Text style={styles.UserRole}>{item.name}</Text>
                    </View>

                    {/* Right section: Number circle */}
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

                  {/* Arrow button */}
                  <View>
                    <TouchableOpacity onPress={() => onSegmentNextClick(item)}>
                      <Image
                        style={styles.CloseIcon}
                        source={require('./../../images/right-arrow.png')}
                      />
                    </TouchableOpacity>
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
                    }}>
                    <Text style={styles.modalTopButtonText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.AssignRoleTextHeading}>
                    {selectedSegmentType
                      ? SEGMENT_TYPES_DISPLAY[selectedSegmentType] +
                        ' : ' +
                        selectedSegment.name
                      : 'Segment type: ' +
                        SEGMENT_TYPES_DISPLAY[segmentTypeToAssignWork]}
                  </Text>
                </View>
                <ScrollView style={styles.modalScrollView}>
                  {userData.map((item: any, index) => (
                    <View key={index} style={styles.CategoryType}>
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
                            // Add update functionality here
                          }}>
                          <Text style={styles.updateButtonText}>Update</Text>
                        </TouchableOpacity>

                        <Text style={styles.buttonSeparator}>|</Text>

                        <TouchableOpacity
                          style={styles.deassignButton}
                          onPress={() => {
                            console.log('Deassign user:', item.name);
                            // Add deassign functionality here
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
        loading={loading || loadingSegment || loadingUsers}></LoadingAnimation>
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
    paddingHorizontal: 5,
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
    borderRadius: 12,
    marginTop: 15,
    borderWidth: 1,
    borderStyle: 'solid',
    position: 'relative',
    overflow: 'hidden',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  segmentTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingRight: 15,
  },
  segmentTypeText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#27272A',
    marginLeft: 10,
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
  categoryItemContainer: {
    marginVertical: 8,
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
    paddingHorizontal: 12,
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
  },
  PopHeader: {},
  modalView: {
    minHeight: 150,
  },
  ModalInnerContainer: {
    paddingHorizontal: 10,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  // Update existing centeredView style
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

  // Add these new styles to your existing styles object
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
  buttonSeparator: {
    color: '#CCCCCC',
    fontSize: 13,
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
  userRoleSubtext: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
    paddingLeft: 8,
  },

  CategoryType: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
    paddingVertical: 15,
    paddingRight: 15,
    minHeight: 60,
  },
  mainContentRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SegmentsList;
