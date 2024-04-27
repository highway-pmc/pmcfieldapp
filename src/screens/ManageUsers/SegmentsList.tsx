import { View, Text, TouchableOpacity, NativeEventEmitter, StyleSheet, Image, Modal, Alert, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems, SEGMENT_TYPES_DISPLAY, WORK_ASSIGNMENT_LEVEL } from '../../constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { clearProjectModulesWorkAssignmentData, getProjectModuleSegments, getUsersForWorkAssignment, segmentTypeWorkAssignToUsers, segmentWorkAssignToUsers } from './actions';
import { ScrollView } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import LoadingAnimation from '../Common/LoadingAnimation';
import { groupBy } from '../../utils/Utils';

const SegmentsList = ({ route, navigation }: { route: any, navigation: any }) => {
  const { projectModuleId, projectModuleName, type, subType, workType } = route.params;

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { segments, users, segmentWorkAssigned, loading, loadingSegment, loadingUsers, error } = useSelector((state: any) => state.WorkAssignment);
  const [segmentsData, setSegmentsData] = useState([]);
  const [selectedSegmentType, setSelectedSegmentType] = useState('');
  const [segmentTypeToAssignWork, setSegmentTypeToAssignWork] = useState('');
  const [segmentsByGroupOnType, setSegmentsByGroupOnType] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState({ isChecked: false, _id: "", name: "" });
  const [userData, setUserCheckboxes] = useState([]);
  const [isAssignPopOpen, openAssignPopup] = useState(false);
  const [searchText, setSearchText] = useState('');

  const dispatch = useDispatch()

  useEffect(() => {
    if (segments) {
      segments.forEach((pModule: any) => {
        pModule.isChecked = false
      });
      const gbSegmentTypes = groupBy(segments, "type");
      setSegmentsByGroupOnType(gbSegmentTypes);
    }

    if (users) {
      users.forEach((user: any) => {
        user.isChecked = false
      });
      setUserCheckboxes(users);
    }
  }, [segments, users, error]);

  useEffect(() => {
    setSelectedSegmentType('');
    setSearchText('');
    dispatch(getProjectModuleSegments({
      projectId: loggedInUser.projectId,
      projectModuleId: projectModuleId
    }));

    dispatch(getUsersForWorkAssignment({
      projectId: loggedInUser.projectId,
      workType: workType
    }));
  }, []);

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.segmentsList);
  }

  const onSegmentTypeClick = (type: any) => {
    setSelectedSegmentType(type);
    if (segmentsByGroupOnType) {
      setSegmentsData(segmentsByGroupOnType[type])
    }
  }

  const handleSegmentTypeChange = (segmentType: any) => {
    setSegmentTypeToAssignWork(segmentType);
    if (!isAssignPopOpen) {
      const updatedCheckboxes: any = [...userData];
      updatedCheckboxes.forEach((user: any) => {
        user.isChecked = false;
        delete user.assignedSegmentType;
        delete user.assignmentLevel;
        if (user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModuleId && wa.assignmentLevel === 1) != null) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL1;
          user.isChecked = true;
        } else if (user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModuleId && wa.segmentId && wa.assignmentLevel === 3) != null) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL3;
          user.isChecked = true;
        } else if (user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModuleId && wa.segmentId && wa.componentId && wa.assignmentLevel === 4) != null) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL4;
          user.isChecked = true;
        } else {
          const assignedWorkLength = user.workAssignment?.filter((wa: any) => wa.projectModule?.id === projectModuleId && wa.segmentType === segmentType && wa.assignmentLevel === 2).length;
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
    segment.isChecked = !segment.isChecked
    setSelectedSegment(segment);

    const updatedCheckboxes: any = [...userData];

    if (segment.isChecked) {
      updatedCheckboxes.forEach((user: any) => {
        user.isChecked = false;
        delete user.assignmentLevel;
        if (user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModuleId && wa.assignmentLevel === 1) != null) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL1;
          user.isChecked = true;
        } else if (user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModuleId && wa.segmentId === segment._id && wa.assignmentLevel === 3) != null) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL3;
          user.isChecked = true;
        } else if (user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModuleId && wa.segmentId === segment._id && wa.componentId && wa.assignmentLevel === 4) != null) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL4;
          user.isChecked = true;
        } else {
          const workAssignment = user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModuleId && wa.segmentId === segment._id && wa.assignmentLevel === 2);
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
      workAssignment = {}
    } else {
      workAssignment = selectedUser.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModuleId && wa.segmentId === selectedSegment._id && wa.assignmentLevel === 2)
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
      Alert.alert("Success", "Works assigned successfully");
      openAssignClose();
      dispatch(clearProjectModulesWorkAssignmentData());
      setTimeout(() => {
        dispatch(getUsersForWorkAssignment({
          projectId: loggedInUser.projectId,
          workType: workType
        }));
      }, 500)
    }
  }, [segmentWorkAssigned, error]);

  const onWorkAssignment = () => {
    const usersToBeAssign = userData.filter((u: any) => u.dirty);

    let usersToBeAssignArray: any = [];

    usersToBeAssign.forEach((u: any) => {
      let user: any = {
        _id: u._id,
        delete: u.delete || false
      }
      const workAssignment = u.workAssignment?.find((wa: any) => wa.dirty);
      if (workAssignment) {
        user.workAssignmentId = workAssignment._id;
      }

      usersToBeAssignArray.push(user);
    });

    if (usersToBeAssignArray.length) {
      if (selectedSegmentType) {
        dispatch(segmentWorkAssignToUsers({
          projectId: loggedInUser.projectId,
          projectModuleId: projectModuleId,
          segmentId: selectedSegment._id,
          body: {
            users: usersToBeAssignArray,
            level: 2
          }
        }));
      } else {
          dispatch(segmentTypeWorkAssignToUsers({
            projectId: loggedInUser.projectId,
            projectModuleId: projectModuleId,
            type: segmentTypeToAssignWork,
            body: {
              users: usersToBeAssignArray,
              level: 2
            }
          }));
      }
    }
  }

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
  useEffect( () => () => {
    setSearchText('');
  }, [] );

  return (
    <View style={styles.Container}>
      {(error) && <View style={styles.ErrorSectionStyle}>
        <Text style={styles.errorText}>{error}</Text>
      </View>}

      {
        selectedSegmentType && <View style={styles.SectionStyle}>
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
          onChangeText={(text) => {
            setSearchText(text);
          }}
        />
      </View>
      }
      <ScrollView style={styles.Height100}>

        {
          !selectedSegmentType && segmentsByGroupOnType && Object.keys(segmentsByGroupOnType).length ? Object.keys(segmentsByGroupOnType).map((item) => (
            <View style={styles.UserCategory}>
              <View style={[styles.FlexRowCenter, {gap: 10}]}>
              <CheckBox
                //value={item.isChecked}
                onValueChange={() => handleSegmentTypeChange(item)}
                style={styles.checkbox}
                tintColors={{ true: '#0F56B3', false: '#818181' }}
              />
              <View>
              <TouchableOpacity onPress={() => onSegmentTypeClick(item)}
              >
                <Text>{segmentsByGroupOnType[item].length}</Text>
                <Text>{SEGMENT_TYPES_DISPLAY[item]}</Text>
              </TouchableOpacity>
              </View>
            </View>
              
            </View>
          )): null
        }

        {selectedSegmentType && segmentsData.filter((seg: any) => {
            if (searchText && seg.name) {
              return seg.name.toLowerCase().includes(searchText.toLowerCase())
            } else {
              return true;
            }
          }).map((item: any, index) => (
          <View style={styles.UserCategory}>
            <View style={styles.FlexRowCenter}>
              <CheckBox
                value={item.isChecked}
                onValueChange={() => handleRadioChange(index)}
                style={styles.checkbox}
                tintColors={{ true: '#0F56B3', false: '#818181' }}
              />
              <View>
                <Text style={styles.UserRole}>{item.name}</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate('ComponentsList', {
                  projectModuleId: projectModuleId,
                  projectModuleName: projectModuleName,
                  segmentId: item._id,
                  segmentName: item.name,
                  type: type,
                  subType: subType,
                  workType: workType
                })}>
                <Image
                  style={styles.CloseIcon}
                  source={require('./../../images/right-arrow.png')}
                />
              </TouchableOpacity>
            </View>
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
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
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
                  <Text style={styles.AssignRoleText}>{selectedSegmentType ? (SEGMENT_TYPES_DISPLAY[selectedSegmentType] + ' : ' + selectedSegment.name) : 'Segment type: ' + SEGMENT_TYPES_DISPLAY[segmentTypeToAssignWork]}</Text>
                </View>
                <ScrollView style={{ paddingTop: 10, height: 500 }}>
                  {userData.map((item: any, index) => (
                    <View style={styles.CategoryType}>
                      <View style={styles.FlexRowCenter}>
                        <CheckBox
                          value={item.isChecked}
                          disabled={item.assignmentLevel != null}
                          onValueChange={() => handleUserData(index)}
                          style={styles.checkbox}
                          tintColors={{ true: '#0F56B3', false: '#818181' }}
                        />
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.AssignRoleText}>
                            {item.name}
                          </Text>
                          {
                            item.assignmentLevel &&
                            <Text style={styles.userAlreadyAssigned}>
                              {item.assignmentLevel}
                            </Text>
                          }

                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity style={styles.assignTagButoon} onPress={() => onWorkAssignment()}>
                  <Text style={styles.assignTagButoonText}>Assign</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <LoadingAnimation loading={loading || loadingSegment || loadingUsers}></LoadingAnimation>
    </View>
  )
}

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
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
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

export default SegmentsList