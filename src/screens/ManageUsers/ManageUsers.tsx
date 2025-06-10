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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {
  HeaderItems,
  ROLES,
  USER_CATEGORIES,
  USER_CATEGORY,
  UserRoles,
} from '../../constants/constants';
import CheckBox from '@react-native-community/checkbox';
import {RadioButton} from 'react-native-paper';
import LoadingAnimation from '../Common/LoadingAnimation';
import {useDispatch, useSelector} from 'react-redux';
import {user} from '../../models/user';
import {
  addUserCategories,
  clearUserAssignment,
  getUsers,
  getUserCategories,
} from './actions';

const ManageUsers = ({navigation}: {navigation: any}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isAssignPopOpen, openAssignPopup] = useState(false);
  const [projectHead, setProjectHead] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userCategories, setUserCategories] = useState([]);

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {users, usersAdded, categories, loading, usersLoading, error} =
    useSelector((state: any) => state.UserAssignment);

  const dispatch = useDispatch();

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
        cate.isChecked = false;
      });
      setUserCategories(categories);
    }
  }, [categories, error]);

  useEffect(() => {
    if (usersAdded) {
      Alert.alert('Success', 'User categories added successfully');
      const selectedUser: any = userList.find(
        (u: user) => u._id === selectedUserId,
      );
      if (selectedUser) {
        selectedUser.categories = getSelectedUserCategories();
        selectedUser.categoriesDisplay = getUserCategoriesString(
          selectedUser.categories,
        );
      }
      setTimeout(() => {
        openAssignPopup(false);
      }, 1000);
    }
  }, [usersAdded, error]);

  useEffect(() => {
    if (loggedInUser.roles) {
      if (
        loggedInUser.roles
          .split(',')
          .find((role: any) => role === ROLES.PROJECT_HEAD)
      ) {
        setProjectHead(true);
      }
    }
    dispatch(getUsers());
    dispatch(getUserCategories());
  }, []);

  // unmount
  useEffect(
    () => () => {
      dispatch(clearUserAssignment());
    },
    [],
  );

  const onUserCategoryAssignment = () => {
    dispatch(
      addUserCategories({
        userId: selectedUserId,
        categories: getSelectedUserCategories(),
      }),
    );
  };

  const getSelectedUserCategories = () => {
    const categories: any[] = [];
    userCategories.forEach((item: any) => {
      if (item.isChecked) {
        categories.push({
          id: item._id,
          name: item.name,
        });
      }
    });

    return categories;
  };

  const getUserCategoriesString = (assignedCategories = []) => {
    var assignedCate = assignedCategories.map(
      (item: any) =>
        userCategories
          .find((uc: any) => uc.name === item.name)
          ?.displayName?.split(' ')[0] || '',
    );
    return assignedCate.join(', ');
  };

  const handleRadioChange = (value: any) => {
    setSelectedUserId(value);

    const selectedUser: any = userList.find((u: user) => u._id === value);

    if (selectedUser && selectedUser.categories) {
      userCategories.forEach((cate: any) => {
        if (
          selectedUser.categories.find((uCate: any) => uCate.name == cate.name)
        ) {
          cate.isChecked = true;
        } else {
          cate.isChecked = false;
        }
      });
    } else {
      userCategories.forEach((cate: any) => {
        cate.isChecked = false;
      });
    }
  };

  const handleUserCategories = (item: any) => {
    item.isChecked = !item.isChecked;
    if (item.isChecked && item.name === USER_CATEGORY.QUALITY_WORK) {
      userCategories.forEach((cate: any) => {
        if (cate.name != USER_CATEGORY.QUALITY_WORK) {
          cate.isChecked = false;
        }
      });
    } else if (item.isChecked && item.name === USER_CATEGORY.SURVEY_WORK) {
      userCategories.forEach((cate: any) => {
        if (cate.name != USER_CATEGORY.SURVEY_WORK) {
          cate.isChecked = false;
        }
      });
    } else if (item.isChecked) {
      const qualityWork: any = userCategories.find(
        (cate: any) => cate.name === USER_CATEGORY.QUALITY_WORK,
      );
      if (qualityWork) {
        qualityWork.isChecked = false;
      }
      const surveyWork: any = userCategories.find(
        (cate: any) => cate.name === USER_CATEGORY.SURVEY_WORK,
      );
      if (surveyWork) {
        surveyWork.isChecked = false;
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
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        {error && (
          <View style={styles.errorSection}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <View style={styles.searchInputContainer}>
          <Image
            source={require('./../../images/search-icon.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search user"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            onChangeText={text => {
              setSearchText(text);
              setUserList(
                users.filter((u: any) => {
                  if (text && u.name) {
                    return u.name.toLowerCase().includes(text.toLowerCase());
                  } else {
                    return true;
                  }
                }),
              );
            }}
          />
        </View>
      </View>

      {/* User List */}
      <ScrollView style={styles.userListContainer}>
        <RadioButton.Group
          onValueChange={handleRadioChange}
          value={selectedUserId}>
          {userList.map((item: user, index) => (
            <View style={styles.userCard} key={item._id}>
              <View style={styles.userInfoContainer}>
                <Image source={userIcon} style={styles.userAvatar} />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <View style={styles.userRoleContainer}>
                    <Text style={styles.userDesignationTitle}>
                      {item.designation} :
                    </Text>
                    <Text style={styles.userDesignation}>
                      {' '}
                      {item.categoriesDisplay}
                    </Text>
                  </View>
                </View>
              </View>
              {projectHead && (
                <RadioButton
                  value={item._id}
                  color="#673AB7"
                  uncheckedColor="#DDDDDD"
                />
              )}
            </View>
          ))}
        </RadioButton.Group>

        {/* No Data Found */}
        {!usersLoading && !userList.length && (
          <View style={styles.noDataContainer}>
            <Image
              style={styles.noDataImage}
              source={require('./../../images/no-data-found.png')}
            />
            <Text style={styles.noDataTitle}>Sorry, no result found!</Text>
            {searchText && (
              <Text style={styles.noDataSubtext}>
                Please try to search another keywork...
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer Buttons */}
      {projectHead && (
        <View style={styles.footerContainer}>
          <Pressable
            style={[
              styles.footerButton,
              styles.assignCategoryButton,
              !selectedUserId && styles.disabledButton,
            ]}
            disabled={!selectedUserId}
            onPress={() => openAssignPopup(true)}>
            <Text style={styles.buttonText}>Assign Category</Text>
          </Pressable>
          <View
            style={{
              width: 1,
              backgroundColor: '#fff',
              marginHorizontal: 15,
            }}
          />
          <Pressable
            style={[styles.footerButton, styles.assignWorkButton]}
            onPress={() => navigation.navigate('WorkType')}>
            <Text style={styles.buttonText}>Assign Work</Text>
          </Pressable>
        </View>
      )}

      {/* Category Assignment Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isAssignPopOpen}
        onRequestClose={() => {
          openAssignPopup(!isAssignPopOpen);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Assign Category</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => openUserCategoriesOptions()}>
                  <Image
                    style={styles.closeIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                {userCategories.map((item: any, index) => (
                  <View style={styles.categoryItem} key={item._id}>
                    <View style={styles.categoryCheckbox}>
                      <CheckBox
                        value={item.isChecked}
                        onValueChange={() => handleUserCategories(item)}
                        style={styles.checkbox}
                        tintColors={{true: '#5A2AAF', false: '#818181'}}
                      />
                      <Text style={styles.categoryText}>
                        {item.displayName}
                      </Text>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.assignButton}
                  onPress={() => onUserCategoryAssignment()}>
                  <Text style={styles.assignButtonText}>Assign</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <LoadingAnimation loading={loading || usersLoading}></LoadingAnimation>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
  },
  errorSection: {
    marginBottom: 10,
  },
  errorText: {
    color: '#f11f1f',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 45,
    paddingRight: 15,
    fontSize: 16,
    color: '#333',
  },
  userListContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#BECADA',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  userRoleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDesignationTitle: {
    fontSize: 12,
    color: '#333333',
  },
  userDesignation: {
    fontSize: 12,
    color: '#5A2AAF',
  },
  userCategories: {
    fontSize: 12,
    color: '#5A2AAF',
    fontWeight: '500',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  noDataImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  noDataTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#666',
  },
  footerContainer: {
    flexDirection: 'row',
    backgroundColor: '#5A2AAF',
    height: 75,
    paddingVertical: 7,
  },
  footerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignCategoryButton: {},
  assignWorkButton: {},
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  modalContent: {},
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
  },
  closeIcon: {
    width: 22,
    height: 22,
  },
  modalBody: {
    padding: 15,
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  categoryCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    color: '#333333',
  },
  assignButton: {
    backgroundColor: '#5A2AAF',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ManageUsers;
