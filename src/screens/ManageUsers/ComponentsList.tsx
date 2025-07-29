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
  splitComponent,
  deleteSplitComponent,
} from './actions';
import commonStyles from '../Common/commonStyles';
import {ScrollView} from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import LoadingAnimation from '../Common/LoadingAnimation';
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
    chainage,
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
      console.log('======', components);
    }

    if (users) {
      users.forEach((user: any) => {
        user.isChecked = false;
      });
      setUserCheckboxes(users);
    }
  }, [components, users, error]);

  const reloadComponents = () => {
    dispatch(
      getProjectModuleComponents({
        projectId: loggedInUser.projectId,
        projectModuleId: projectModuleId,
        segmentId: segmentId,
        taskCategory: taskCategory,
      }),
    );
  };

  useEffect(() => {
    reloadComponents(); // Fetch initial data

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
          user.assignmentLevel = WORK_ASSIGNMENT_LEVEL.LEVEL5;
          user.isChecked = true;
        } else {
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
  const handleDeleteComponent = (componentToDelete: any) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete "${componentToDelete.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(
              deleteSplitComponent({
                projectModuleId: projectModuleId,
                type: 'components',
                id: componentToDelete._id,
              }),
            );
            // Give feedback and reload the list after a short delay
            Alert.alert(
              'Success',
              `"${componentToDelete.name}" has been deleted.`,
            );
            setTimeout(() => {
              reloadComponents();
            }, 1000);
          },
        },
      ],
      {cancelable: true},
    );
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
            workType:
              workType === PROJECT_TYPE.INITIAL_SURVEY
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

  const [isSplitChainageModalOpen, setIsSplitChainageModalOpen] =
    useState(false);
  const [selectedComponentForSplit, setSelectedComponentForSplit] =
    useState(null);
  const [splitChainageData, setSplitChainageData] = useState({
    startChainage: 0.0,
    endChainage: 0.0,
    splitValue: 0.0,
  });

  const openSplitChainageModal = (item: any) => {
    setSelectedComponentForSplit(item);
    const startChainage =
      item.splitInfo?.chainage?.start ?? chainage?.start ?? 0.0;
    const endChainage = item.splitInfo?.chainage?.end ?? chainage?.end ?? 0.0;

    setSplitChainageData({
      startChainage: startChainage,
      endChainage: endChainage,
      splitValue: 0.0,
    });
    setIsSplitChainageModalOpen(true);
  };

  const closeSplitChainageModal = () => {
    setIsSplitChainageModalOpen(false);
    setSelectedComponentForSplit(null);
    setSplitChainageData({
      startChainage: 0.0,
      endChainage: 0.0,
      splitValue: 0.0,
    });
  };

  const handleSplitByChainage = () => {
    const {startChainage, endChainage, splitValue} = splitChainageData;

    if (isNaN(splitValue) || splitValue <= 0) {
      Alert.alert('Error', 'Please enter a valid number for the split value.');
      return;
    }

    if (splitValue <= startChainage || splitValue >= endChainage) {
      Alert.alert(
        'Validation Error',
        `Split value must be between ${startChainage} and ${endChainage}.`,
      );
      return;
    }

    if (!selectedComponentForSplit) {
      Alert.alert('Error', 'No component selected for splitting.');
      closeSplitChainageModal();
      return;
    }

    const payload = {
      projectModuleId: projectModuleId,
      splitTo: 'components',
      body: {
        splitInfo: {
          splitBy: 'chainage',
          splitNo: splitValue,
          originalParentId:
            selectedComponentForSplit.splitInfo?.originalParentId ||
            selectedComponentForSplit._id,
          parentId: selectedComponentForSplit._id,
        },
      },
    };

    dispatch(splitComponent(payload));
    Alert.alert(
      'Success',
      'Component split by chainage has been successfully initiated.',
    );
    setTimeout(() => {
      reloadComponents();
    }, 1000);
    closeSplitChainageModal();
  };

  const [isSplitLayerModalOpen, setIsSplitLayerModalOpen] = useState(false);
  const [selectedComponentForLayerSplit, setSelectedComponentForLayerSplit] =
    useState(null);
  const [splitLayerData, setSplitLayerData] = useState({numberOfLayers: 0});

  const openSplitByLayerModal = (item: any) => {
    setSelectedComponentForLayerSplit(item);
    setSplitLayerData({numberOfLayers: 0});
    setIsSplitLayerModalOpen(true);
  };

  const closeSplitByLayerModal = () => {
    setIsSplitLayerModalOpen(false);
    setSelectedComponentForLayerSplit(null);
    setSplitLayerData({numberOfLayers: 0});
  };

  const handleSplitByLayer = () => {
    if (
      !splitLayerData.numberOfLayers ||
      isNaN(splitLayerData.numberOfLayers) ||
      splitLayerData.numberOfLayers <= 0
    ) {
      console.log('Please enter a valid number of layers.');
      return;
    }

    const payload = {
      projectModuleId: projectModuleId,
      splitTo: 'components',
      body: {
        splitInfo: {
          splitBy: 'layer',
          splitNo: splitLayerData.numberOfLayers,
          originalParentId:
            selectedComponentForLayerSplit.splitInfo?.originalParentId ||
            selectedComponentForLayerSplit._id,
          parentId: selectedComponentForLayerSplit._id,
        },
      },
    };

    dispatch(splitComponent(payload));
    Alert.alert('Success', 'Component split by layer successfully initiated.');
    setTimeout(() => {
      reloadComponents();
    }, 1000);
    closeSplitByLayerModal();
  };

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
      return (
        filteredItems.length > 0 && (
          <View style={styles.separatTaskType} key={type}>
            <View style={styles.titleTextForGrouping}>
              <Text
                style={[styles.titleText, {color: workTypeColors.titleColor}]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </View>
            {filteredItems.map((item, i) => {
              // --- LOGIC FOR CONDITIONAL RENDERING ---
              let isLastLayer = false;
              if (item.splitInfo?.splitBy === 'layer' && item.name) {
                const match = item.name.match(/\(Layer (\d+)\)/);
                const currentLayer = match ? parseInt(match[1], 10) : 0;
                const totalLayers = item.splitInfo.splitNo;

                if (currentLayer > 0 && currentLayer === totalLayers) {
                  isLastLayer = true;
                }
              }

              const showActionSection =
                !item.rfiGenerated &&
                (item.splitByChainage || item.splitByLayer || isLastLayer);

              return (
                <View
                  key={`${type}-${i}`}
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

                  {/* ---Main content row --- */}
                  <View style={styles.mainContentRow}>
                    <View
                      style={[styles.FlexRowCenter, {flex: 1, marginRight: 8}]}>
                      <CheckBox
                        value={item.isChecked}
                        onValueChange={() =>
                          handleRadioChange(filteredItems.indexOf(item))
                        }
                        style={styles.checkbox}
                        tintColors={{true: '#5A2AAF', false: '#000001'}}
                      />
                      {/* This container ensures the text can wrap */}
                      <View style={styles.nameContainer}>
                        <Text style={styles.UserRole}>{item.name || ''}</Text>
                      </View>
                    </View>

                    {/* This container remains fixed on the right */}
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

                  {showActionSection && (
                    <>
                      <View
                        style={[
                          styles.dashedLine,
                          {borderBottomColor: workTypeColors.leftBorderColor},
                        ]}
                      />

                      <View style={styles.buttonsContainer}>
                        {/* 1. Split by Chainage Button */}
                        {item.splitByChainage && (
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              styles.actionButtonChainage,
                            ]}
                            onPress={() => openSplitChainageModal(item)}>
                            <View style={styles.buttonContent}>
                              <Image
                                style={[
                                  styles.buttonIcon,
                                  {tintColor: '#5EAB4B'},
                                ]}
                                source={require('./../../images/userManagement/spliting.png')}
                              />
                              <Text
                                style={[
                                  styles.buttonText,
                                  styles.buttonTextChainage,
                                ]}>
                                Split by Chainage
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}

                        {/* 2. Split by Layer Button */}
                        {item.splitByLayer && (
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              styles.actionButtonLayer,
                            ]}
                            onPress={() => openSplitByLayerModal(item)}>
                            <View style={styles.buttonContent}>
                              <Image
                                style={[
                                  styles.buttonIcon,
                                  {tintColor: '#5A2AAF'},
                                ]}
                                source={require('./../../images/userManagement/spliting.png')}
                              />
                              <Text
                                style={[
                                  styles.buttonText,
                                  styles.buttonTextLayer,
                                ]}>
                                Split by Layer
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}

                        {/* 3. Delete Button */}
                        {isLastLayer && (
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              styles.actionButtonDelete,
                            ]}
                            onPress={() => handleDeleteComponent(item)}>
                            <View style={styles.buttonContent}>
                              <Image
                                style={[
                                  styles.buttonIcon,
                                  {tintColor: '#FF4747'},
                                ]}
                                source={require('./../../images/userManagement/delete.png')}
                              />
                              <Text
                                style={[
                                  styles.buttonText,
                                  styles.buttonTextDelete,
                                ]}>
                                Delete
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  )}
                </View>
              );
            })}
          </View>
        )
      );
    },
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

      {/* Assign User Modal Start */}
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
                    Component: {selectedComponent.name}
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

      {/* Split by Chainage Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSplitChainageModalOpen}
        onRequestClose={closeSplitChainageModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.splitChainageModalContainer}>
            <View style={styles.splitChainageModalContent}>
              <View style={styles.ModalHeader}>
                <Text style={styles.modalText}>Split by Chainage</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={closeSplitChainageModal}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.splitChainageModalBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <TextInput
                    style={[styles.splitInput, styles.readOnlyInput]}
                    value={selectedComponentForSplit?.name || ''}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Start Chainage</Text>
                  <TextInput
                    style={[styles.splitInput, styles.readOnlyInput]}
                    value={splitChainageData.startChainage?.toString() ?? ''}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>End Chainage</Text>
                  <TextInput
                    style={[styles.splitInput, styles.readOnlyInput]}
                    value={splitChainageData.endChainage?.toString() ?? ''}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Split at</Text>
                  <TextInput
                    style={styles.splitInput}
                    placeholder="Enter split value"
                    value={splitChainageData.splitValue}
                    onChangeText={(num: string) =>
                      setSplitChainageData(prev => ({
                        ...prev,
                        splitValue: parseFloat(num) || 0,
                      }))
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.splitChainageModalFooter}>
                <TouchableOpacity
                  style={styles.splitButton}
                  onPress={handleSplitByChainage}>
                  <Text style={styles.splitButtonText}>Split</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Split by Layer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSplitLayerModalOpen}
        onRequestClose={closeSplitByLayerModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.splitChainageModalContainer}>
            <View style={styles.splitChainageModalContent}>
              <View style={styles.ModalHeader}>
                <Text style={styles.modalText}>Split by Layer</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={closeSplitByLayerModal}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.splitChainageModalBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Component Name</Text>
                  <TextInput
                    style={[styles.splitInput, styles.readOnlyInput]}
                    value={selectedComponentForLayerSplit?.name || ''}
                    editable={false}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Number of Layers</Text>
                  <TextInput
                    style={styles.splitInput}
                    placeholder="Enter number of layers"
                    keyboardType="numeric"
                    value={splitLayerData.numberOfLayers?.toString()}
                    onChangeText={text =>
                      setSplitLayerData({numberOfLayers: Number(text)})
                    }
                  />
                </View>
              </View>

              <View style={styles.splitChainageModalFooter}>
                <TouchableOpacity
                  style={styles.splitButton}
                  onPress={handleSplitByLayer}>
                  <Text style={styles.splitButtonText}>Split</Text>
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

//NOTE: Your styles are not included here for brevity, but they should remain unchanged.
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
  FlexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
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
  UserRole: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  nameContainer: {
    // NEW STYLE
    flex: 1,
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
    alignItems: 'center', // Changed from alignContent
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
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 6,
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
  actionButtonChainage: {
    borderColor: '#5EAB4B',
    backgroundColor: '#EFFFEB',
  },
  actionButtonLayer: {
    borderColor: '#5A2AAF',
    backgroundColor: '#E8DBFF',
  },
  actionButtonDelete: {
    borderColor: '#FF4747',
    backgroundColor: '#F3DEDE',
  },
  buttonTextChainage: {
    color: '#5EAB4B',
  },
  buttonTextLayer: {
    color: '#5A2AAF',
  },
  buttonTextDelete: {
    color: '#FF4747',
  },
  splitChainageModalContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  splitChainageModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  splitChainageModalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  splitInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  readOnlyInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  splitChainageModalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  splitButton: {
    backgroundColor: '#5A2AAF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  splitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ComponentsList;
