import {
  View,
  Text,
  NativeEventEmitter,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {HeaderItems, USER_CATEGORIES, USER_CATEGORY, UserRoles} from '../../constants/constants';
import CheckBox from '@react-native-community/checkbox';
import { RadioButton } from 'react-native-paper';
import LoadingAnimation from '../Common/LoadingAnimation';
import { useDispatch, useSelector } from 'react-redux';
import { user } from '../../models/user';
import { addUserCategories, clearUserAssignment, getUsers, getUserCategories } from './actions';

const ManageUsers = ({navigation}:{navigation: any}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isAssignPopOpen, openAssignPopup] = useState(false);
  const [projectHead, setProjectHead] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userCategories, setUserCategories] = useState([]);

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { users, usersAdded, categories, loading, error} = useSelector((state: any) => state.UserAssignment);

  const dispatch = useDispatch()

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.manageUsers);
  }

  const userIcon = require('./../../images/avtar.png');

  useEffect(() => {
    if (users) {
      users.forEach((u: any) => {
        u.categoriesDisplay = getUserCategoriesString(u.categories);
      });
      setUserList(users);
    }
  }, [users, error]);

  useEffect(() => {
    if (categories) {
      categories.forEach((cate: any) => {
        cate.isChecked = false
      });
      setUserCategories(categories);
    }
  }, [categories, error]);

  useEffect(() => {
    if (usersAdded) {
      Alert.alert("Success", "User categories added successfully");
      const selectedUser: any = userList.find((u: user) => u._id === selectedUserId);
      if (selectedUser) {
        selectedUser.categories = getSelectedUserCategories();
        selectedUser.categoriesDisplay = getUserCategoriesString(selectedUser.categories);
      }
      setTimeout(() => {
        openAssignPopup(false);
      }, 1000)
    }
  }, [usersAdded, error]);

  useEffect(() => {
    if(loggedInUser.roles) {
      if (loggedInUser.roles.split(',').find((role: any) => role === "project-head")) {
        setProjectHead(true);
      }
    }
    dispatch(getUsers());
    dispatch(getUserCategories());
  }, []);

  // unmount
  useEffect( () => () => {
    dispatch(clearUserAssignment());
  }, [] );

  const onUserCategoryAssignment = () => {
    dispatch(addUserCategories({
      userId: selectedUserId,
      categories: getSelectedUserCategories()
    }));
  }

  const getSelectedUserCategories = () => {
    const categories: any[] = [];//userCategories.filter((item: any) => item.isChecked).forEach();
    userCategories.forEach((item: any) => {
      if(item.isChecked) {
        categories.push({
          id: item._id,
          name: item.name
        })
      }
    });

    return categories;
  }

  const getUserCategoriesString = (assignedCategories = []) => {
    var assignedCate = assignedCategories.map((item: any) => userCategories.find((uc: any) => uc.name === item.name)?.displayName?.split(' ')[0] || '')
    return assignedCate.join(', ');
  }

  const handleRadioChange = (value: any) => {
    setSelectedUserId(value);

    const selectedUser: any = userList.find((u: user) => u._id === value);

    if (selectedUser && selectedUser.categories) {
      userCategories.forEach((cate: any) => {
        if (selectedUser.categories.find((uCate: any) => uCate.name == cate.name)) {
          cate.isChecked = true;
        } else {
          cate.isChecked = false;
        }
      })
    } else {
      userCategories.forEach((cate: any) => {
        cate.isChecked = false;
      })
    }
  };

  const handleUserCategories = (item: any) => {
    // const updatedCheckboxes = [...userCategories];
    // updatedCheckboxes[index].isChecked = !updatedCheckboxes[index].isChecked;
    item.isChecked = !item.isChecked;
    if(item.isChecked && item.name === USER_CATEGORY.QUALITY_WORK) {
      userCategories.forEach((cate: any) => {
        if (cate.name != USER_CATEGORY.QUALITY_WORK) {
          cate.isChecked = false;
        }
      })
    } else if (item.isChecked) {
      const qualityWork: any = userCategories.find((cate: any) => cate.name === USER_CATEGORY.QUALITY_WORK);
      if (qualityWork) {
        qualityWork.isChecked = false;
      }
    }
    setUserCategories([...userCategories]);
  };

  const openUserCategoriesOptions = () => {
    if (!selectedUserId) {
      userCategories.forEach((cate: any) => {
        cate.isChecked = false;
      });
    }
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
            placeholder="Search user"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            onChangeText={(text) => {
              setSearchText(text);
            }}
          />
        </View>
      </View>
      <ScrollView style={styles.Height80}>
      <RadioButton.Group onValueChange={handleRadioChange} value={selectedUserId}>
        {userList.filter((u: any) => {
          if (searchText && u.name) {
            return u.name.toLowerCase().includes(searchText.toLowerCase())
          } else {
            return true;
          }
        }).map((item: user, index) => (
          <View style={styles.UserCategory}>
            <View style={styles.FlexRowCenter}>
              <Image
                source={userIcon}
                style={styles.UserImage}
              />
              <View>
                <View style={styles.FlexRowCenter}>
                  <Text style={styles.UserName}>{item.name}</Text>
                  {/* <View style={styles.assignTag}>
                    <Text style={styles.assignTagText}>{item.title}</Text>
                  </View> */}
                </View>
                <Text style={styles.UserRole}>{item.designation}</Text>
                <Text style={styles.UserCategoryDisplay}>{item.categoriesDisplay}</Text>
              </View>
            </View>
            {
              projectHead && <View>
              <RadioButton
                value={item._id}
                color="#1C58C0"
                uncheckedColor="gray"
              />
            </View>
            }
            
          </View>
        ))}
      </RadioButton.Group>
        {/* No Data Found */}
        {!userList.length && 
          <View style={styles.NoDataContainer}>
            <Image
              style={styles.WthHeight}
              source={require('./../../images/no-data-found.png')}
            />
            <Text style={styles.NodataHeadText}>Sorry, no result found!</Text>
            <Text style={styles.NodataSubText}>
              Please try to search another keywork...
            </Text>
          </View>
        }
      </ScrollView>

      {/* Footer Assign CTA Start */}
      {
        projectHead && <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: -15,
          backgroundColor: '#1C58C0',
        }}>
        <Pressable
          style={[
            !selectedUserId ? styles.DisabledButton : styles.buttonAssign,
            styles.SeperatorBorder,
          ]}
          disabled={!selectedUserId}
          onPress={() => openAssignPopup(true)}>
          <Text style={styles.textStyle}>Assign Category</Text>
        </Pressable>

        <Pressable
          style={[styles.buttonAssign]} onPress={() => navigation.navigate("AssignTask")}>
          <Text style={styles.textStyle}>Assign Task</Text>
        </Pressable>
      </View>
      }

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
                <Text style={styles.modalText}>Assign Category</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => openUserCategoriesOptions()}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ModalInnerContainer}>
              {userCategories.map((item: any, index) => (
                  <View style={styles.CategoryType}>
                    <View style={styles.FlexRowCenter}>
                      <CheckBox
                        value={item.isChecked}
                        onValueChange={() => handleUserCategories(item)}
                        style={styles.checkbox}
                        tintColors={{true: '#0F56B3', false: '#818181'}}
                      />
                      <View>
                        <Text style={styles.AssignRoleText}>
                          {item.displayName}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
                <TouchableOpacity style={styles.assignTagButoon} onPress={() => onUserCategoryAssignment()}>
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
  ErrorSectionStyle: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  errorText: {
    color: '#f11f1f',
  },
  Container: {
    flexDirection: 'column',
    paddingVertical: 10,
    padding: 15,
  },
  NoDataContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '30%',
  },
  WthHeight: {
    width: 150,
    height: 150
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
  UserCategoryDisplay: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C58C0',
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
    width: '50%'
  },
  SeperatorBorder: {
    borderRightWidth: 1,
    borderColor: '#fff'
  },
  DisabledButton: {
    opacity: .5,
    backgroundColor: '#1C58C0',
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: '50%'
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
    height: '83%',
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

export default ManageUsers;
