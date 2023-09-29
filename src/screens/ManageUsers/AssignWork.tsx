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
import {HeaderItems, PROJECT_TYPE} from '../../constants/constants';
import CheckBox from '@react-native-community/checkbox';
import {ScrollView} from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { clearProjectModulesWorkAssignmentData, getProjectModules, getUsersForWorkAssignment, projectModulesWorkAssignToUsers } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';

const AssignWork = ({route, navigation}: { route: any, navigation: any }) => {
  const { projectType } = route.params;

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.assignWork);
  }

  const dispatch = useDispatch()

  const [isAssignPopOpen, openAssignPopup] = useState(false);
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { projectModules, users, projectModulesWorkAssigned, loading, error} = useSelector((state: any) => state.WorkAssignment);
  
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
  }, [projectModules, users, error]);

  useEffect(() => {
    dispatch(getProjectModules({
      projectId: loggedInUser.projectId,
      projectType: projectType
    }));

    dispatch(getUsersForWorkAssignment({
      projectId: loggedInUser.projectId
    }));
  }, []);

  const [projectModulesData, setProjectModulesData] = useState([]);
  const [selectedProjectModule, setSelectedProjectModule] = useState({isChecked: false, _id: ""});

  // const [usersToBeAssigned, setUsersToBeAssigned] = useState([])
  const [userData, setUserCheckboxes] = useState([]);

  const handleRadioChange = (index: any) => {
    //const updatedCheckboxes: any = [...projectModulesData];
    setSelectedProjectModule(projectModulesData[index]);
    selectedProjectModule.isChecked = !selectedProjectModule.isChecked;
    // setProjectModulesData(updatedCheckboxes);

    const updatedCheckboxes: any = [...userData];

    if (selectedProjectModule.isChecked) {
      updatedCheckboxes.forEach((user: any) => {
        const workAssignment = user.workAssignment?.find((wa: any) => wa.projectModuleId === projectModulesData[index]._id && !wa.segmentId && !wa.subSegmentId);
        if (workAssignment) {
          user.isChecked = true;
        } else {
          user.isChecked = false;
          console.log(user.name+"=====", projectModulesData[index]._id, workAssignment)
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
    const workAssignment = selectedUser.workAssignment?.find((wa: any) => wa.projectModuleId === selectedProjectModule._id && !wa.segmentId && !wa.subSegmentId)
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
      Alert.alert("Success", "User assigned successfully");
      dispatch(clearProjectModulesWorkAssignmentData());
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
          users: usersToBeAssignArray
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
          />
        </View>
      </View>
      <ScrollView>
        {projectModulesData.map((item: any, index) => (
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
              <ScrollView style={{paddingTop: 10, height: 500}}>
                {userData.map((item: any, index) => (
                  <View style={styles.CategoryType}>
                    <View style={styles.FlexRowCenter}>
                      <CheckBox
                        value={item.isChecked}
                        onValueChange={() => handleUserData(index)}
                        style={styles.checkbox}
                        tintColors={{true: '#0F56B3', false: '#818181'}}
                      />
                      <View>
                        <Text style={styles.AssignRoleText}>
                          {item.name}
                        </Text>
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

      <LoadingAnimation loading={loading}></LoadingAnimation>
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
    height: '87%',
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
  assignTagButoonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default AssignWork;
