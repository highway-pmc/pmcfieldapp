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
import {HeaderItems, PROJECT_TYPE, WORK_ASSIGNMENT_LEVEL} from '../../constants/constants';
import CheckBox from '@react-native-community/checkbox';
import {ScrollView} from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { clearProjectModulesWorkAssignmentData, getProjectModules, getUsersForWorkAssignment, projectModulesWorkAssignToUsers } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';

const AssignWork = ({route, navigation}: { route: any, navigation: any }) => {

  const [projectModulesData, setProjectModulesData] = useState([]);
  const [selectedProjectModule, setSelectedProjectModule] = useState({isChecked: false, _id: "", name: ''});
  const [searchText, setSearchText] = useState('');
  // const [usersToBeAssigned, setUsersToBeAssigned] = useState([])
  const [userData, setUserCheckboxes] = useState([]);

  const { workType } = route.params;

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.assignWork);
  }

  const dispatch = useDispatch()

  const [isAssignPopOpen, openAssignPopup] = useState(false);
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { projectModules, users, projectModulesWorkAssigned, loading, loadingUsers, error} = useSelector((state: any) => state.WorkAssignment);
  
  // unmount
  useEffect( () => () => {
    setProjectModulesData([]);
    setUserCheckboxes([]);
    setSearchText('');
  }, [] );

  useEffect(() => {
    if (projectModules) {
      projectModules.forEach((pModule: any) => {
        pModule.isChecked = false
      });
      setProjectModulesData(projectModules);
    }

    if (users) {
      users.forEach((user: any) => {
        user.isChecked = false
      });
      setUserCheckboxes(users);
    }
  }, [projectModules, users]);

  useEffect(() => {
    dispatch(getProjectModules({
      projectId: loggedInUser.projectId,
      workType: workType
    }));

    dispatch(getUsersForWorkAssignment({
      projectId: loggedInUser.projectId,
      workType: workType
    }));
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
        const workAssignment = user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModulesData[index]._id && wa.assignmentLevel === 1);

        if (workAssignment) {
          user.isChecked = true;
        } else if (user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModule._id && wa.segmentId && wa.assignmentLevel === 2) != null) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL2;
          user.isChecked = true;
        } else if (user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModule._id && wa.segmentId && wa.componentId && wa.assignmentLevel === 3) != null) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL3;
          user.isChecked = true;
        } else if (user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModule._id && wa.segmentId && wa.componentId && wa.taskId && wa.assignmentLevel === 4) != null) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL4;
          user.isChecked = true;
        } else if (user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModule._id && wa.segmentId && wa.componentId && wa.subComponentId && wa.taskId && wa.assignmentLevel === 5) != null) {
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL5;
          user.isChecked = true;
        } else if (user.workAssignment?.find((wa: any) => wa.projectModule?.id === projectModule._id && wa.segmentId && wa.taskId && wa.assignmentLevel === 5) != null) {
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
    const workAssignment = selectedUser.workAssignment?.find((wa: any) => wa.projectModule?.id === selectedProjectModule._id && wa.assignmentLevel === 1)
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
      Alert.alert("Success", "Works assigned successfully");
      openAssignClose();
      dispatch(clearProjectModulesWorkAssignmentData());
      dispatch(getUsersForWorkAssignment({
        projectId: loggedInUser.projectId,
        workType: workType
      }));
    }
  }, [projectModulesWorkAssigned, error]);

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
      dispatch(projectModulesWorkAssignToUsers({
        projectId: loggedInUser.projectId,
        projectModuleId: selectedProjectModule._id,
        body: {
          users: usersToBeAssignArray,
          level: 1
        }
      }));
    }
  }

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
        {(error) && <View style={styles.ErrorSectionStyle}>
                <Text style={styles.errorText}>{error}</Text>
              </View>}
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
            onChangeText={(text) => {
              setSearchText(text);
            }}
          />
        </View>
      </View>
      <ScrollView style={styles.Height100}>
        {projectModulesData.filter((projectMod: any) => {
            if (searchText && projectMod.name) {
              return projectMod.name.toLowerCase().includes(searchText.toLowerCase())
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
                tintColors={{true: '#0F56B3', false: '#818181'}}
              />
              <View>
                <Text style={styles.UserRole}>{item.name}</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate('SegmentsList', {
                  projectModuleId: item._id,
                  projectModuleName: item.name,
                  type: item.type,
                  subType: item.subType,
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

        {/* No Data Found */}
        {(!loading && !projectModulesData.length) && 
          <View style={styles.NoDataContainer}>
            <Image
              style={styles.WthHeight}
              source={require('./../../images/no-data-found.png')}
            />
            <Text style={styles.NodataHeadText}>Sorry, no result found!</Text>
            {/* {(searchText && <Text style={styles.NodataSubText}>
              Please try to search another keywork...
            </Text>
            )} */}
          </View>
        }
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
                <Text style={styles.AssignRoleTextHeading}>Project Module: {selectedProjectModule.name}</Text>
              </View>
              <ScrollView style={{paddingTop: 0, height: 500}}>
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

      <LoadingAnimation loading={loading || loadingUsers}></LoadingAnimation>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    paddingVertical: 10,
    padding: 15,
    paddingBottom: 35
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
    height: 55
  },
  SectionStyle: {
    flexDirection: 'row',
    marginBottom: 0,
    position: 'relative',
    marginHorizontal: -15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
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
    marginTop: 15,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between'
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
  AssignRoleTextHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27272A',
    marginLeft: 5,
    marginTop: 10
  },
  AssignRoleText: {
    fontSize: 14,
    fontWeight: '600',
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

export default AssignWork;
