import {
  View,
  Text,
  NativeEventEmitter,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import {useSnackbar} from '../../context/SnackbarContext';
import React, {Fragment, useEffect, useState} from 'react'; // Make sure useState is imported
import {useIsFocused} from '@react-navigation/native';
import {
  HeaderItems,
  PROJECT_TYPE,
  RFI_STATUS,
  SEGMENT_TYPES_DISPLAY,
  TASK_CATEGORY,
} from '../../constants/constants';
import {
  clearMyWorksEvent,
  getMyWorks,
} from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import {
  groupBy,
} from '../../utils/Utils';

import {initRfiData} from './ReportSamples/Forms/MyWorks/initialize';
import {styles} from './ReportSamples/Forms/MyWorks/Styles';
import {Variables} from './ReportSamples/Forms/MyWorks/Variables'; // Assuming you still use other variables from here
import {Events} from './ReportSamples/Forms/MyWorks/Events';
import {CustomForms} from './ReportSamples/Forms/MyWorks/CustomForms';

const MyWork = ({route, navigation}: {route: any; navigation: any}) => {
  const _v = Variables(); // Keep using Variables for other shared state and logic
  const {showSnackbar} = useSnackbar();
  const _event = Events(_v);

  const {workType, taskCategory} = route.params;

  const _customForms = CustomForms(_v, workType, taskCategory);

  const focus = useIsFocused();
  // Declare chainageData state directly within MyWork component
  const [chainageData, setChainageData] = useState(null);

  const {height} = Dimensions.get('window');
  const calculatedHeight = height * 0.77;

  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      let headerTitle: any;

      if (taskCategory === TASK_CATEGORY.MY_WORK) {
        if (workType === PROJECT_TYPE.STRUCTURE_WORK) {
          headerTitle = HeaderItems.myWorkStructureWork;
        } else if (workType === PROJECT_TYPE.HIGHWAY_WORK) {
          headerTitle = HeaderItems.myWorkHighwayWork;
        } else if (workType === PROJECT_TYPE.OTHER_WORK) {
          headerTitle = HeaderItems.myWorkOtherWork;
        }
      } else if (taskCategory === TASK_CATEGORY.SURVEY) {
        if (workType === PROJECT_TYPE.INITIAL_SURVEY) {
          headerTitle = HeaderItems.initialSurvey;
        }
        if (workType === PROJECT_TYPE.STRUCTURE_WORK) {
          headerTitle = HeaderItems.surveyStructureWork;
        } else if (workType === PROJECT_TYPE.HIGHWAY_WORK) {
          headerTitle = HeaderItems.surveyHighwayWork;
        } else if (workType === PROJECT_TYPE.OTHER_WORK) {
          headerTitle = HeaderItems.surveyOtherWork;
        }
      } else if (taskCategory === TASK_CATEGORY.CASTING_YARD) {
        //
      }
      eventEmitter.emit('headerEvent', headerTitle);
      initMywork();
    }
  }, [focus]);

  const initMywork = () => {
    _v.setCurrentLevel(1);
    _v.setMyWorksData([]);
    _v.setCurrentSegmentsData([]);
    _v.setCurrentComponentsData([]);
    _v.setCurrentSubComponentsData([]);
    _v.setCurrentTasksData([]);
    _v.setBreadcrumbData([]);
    _v.setSelectedProjectModuleData([]);
    _v.setSelectedSegmentData([]);
    _v.setSelectedComponentData([]);
    _v.setSelectedSubComponentData([]);
    getMyWorksData();
    _v.setSearchText('');
    _v.setOpenPopup(false);
    setChainageData(null);
  }

  const getMyWorksData = (
    level: number = 1,
    projectModuleId = '',
    segmentId = '',
    componentId = '',
    subComponentId = '',
  ) => {
    _v.setSearchText('');
    console.log('getMyWorks params:', {
      projectId: _v.loggedInUser.projectId,
      workType: workType,
      taskCategory: taskCategory,
      level: level,
      projectModuleId: projectModuleId || _v.selectedProjectModuleData?.id,
      segmentId: segmentId || _v.selectedSegmentData?._id,
      componentId: componentId || _v.selectedComponentData?._id,
      subComponentId: subComponentId || _v.selectedSubComponentData?._id,
    });
    _v.dispatch(
      getMyWorks({
        projectId: _v.loggedInUser.projectId,
        workType: workType,
        taskCategory: taskCategory,
        level: level,
        projectModuleId: projectModuleId || _v.selectedProjectModuleData?.id,
        segmentId: segmentId || _v.selectedSegmentData?._id,
        componentId: componentId || _v.selectedComponentData?._id,
        subComponentId: subComponentId || _v.selectedSubComponentData?._id,
      }),
    );
  };

  useEffect(() => {
    if (_v.myWorks) {
      if (_v.currentLevel == 1) {
        _v.setSegmentView(0);
        _v.setMyWorksData(_v.myWorks);
        if (
          _v.myWorks &&
          _v.myWorks.length > 0 &&
          _v.myWorks[0].metaData?.chainage
        ) {
          setChainageData(_v.myWorks[0].metaData.chainage); // Use local setter
          console.log(
            'Level 1 Chainage (Saved to local state):',
            _v.myWorks[0].metaData.chainage,
          );
        } else {
          setChainageData(null); // Clear if no chainage data
        }
        _v.setSelectedSegmentData([]);
        _v.setSelectedComponentData([]);
        _v.setSelectedSubComponentData([]);
        setBreadcrumbItems();
      } else if (_v.currentLevel == 2) {
        _v.setSelectedSegmentType(null);
        _v.setSegmentView(0);
        const data = Object.assign({}, _v.selectedProjectModuleData);
        data.segmentsData = _v.myWorks;
        _v.setSelectedProjectModuleData(data);
        const gbSegmentTypes = groupBy(_v.myWorks, 'type');
        _v.setSegmentsByGroupOnType(gbSegmentTypes);

        if (Object.keys(gbSegmentTypes)?.length === 1) {
          _v.setSelectedSegmentType(Object.keys(gbSegmentTypes)[0]);
          _v.setSegmentView(1);

          setBreadcrumbItems(_v.currentLevel, 1);
        } else {
          setBreadcrumbItems();
        }
        _v.setSelectedComponentData([]);
        _v.setSelectedSubComponentData([]);
      } else if (_v.currentLevel == 3) {
        const data = Object.assign({}, _v.selectedSegmentData);
        data.componentsData = _v.myWorks;
        _v.setSelectedSegmentData(data);
        setBreadcrumbItems();
        _v.setSelectedComponentData([]);
      } else if (_v.currentLevel == 4) {
        const data = Object.assign({}, _v.selectedComponentData);
        data.subComponentsData = _v.myWorks;
        _v.setSelectedComponentData(data);
        setBreadcrumbItems();
        _v.setSelectedSubComponentData([]);
      } else if (_v.currentLevel == 5) {
        _v.setCurrentTasksData(_v.myWorks);
        if (chainageData) {
          console.log(
            'Chainage data accessible at Level 5 (Tasks):',
            chainageData,
          );
        }
        setBreadcrumbItems();
      }
    }

    if (_v.rfiData) {
      console.log('RFI Data:', _v.rfiData);
      initRfiData(_v, navigation, chainageData);
    }
    if (_v.error) {
      showSnackbar(_v.error, 'error');
    }
    if (_v.rfiChecklistSaved) {
      _v.setOpenPopup(false);
      Alert.alert('RFIs checklist saved.');
      _v.setCurrentLevel(1);
      _v.setImageObject(_v.imageObjectEmpty);
      _v.dispatch(clearMyWorksEvent());
      getMyWorksData();
    }
  }, [_v.myWorks, _v.rfiData, _v.rfiChecklistSaved, _v.error, chainageData]); // Add chainageData to dependency array if you access it here

  // unmount
  useEffect(
    () => () => {
      _v.dispatch(clearMyWorksEvent());
      _v.setCurrentLevel(1);
      _v.setMyWorksData([]);
      _v.setCurrentSegmentsData([]);
      _v.setCurrentComponentsData([]);
      _v.setCurrentSubComponentsData([]);
      _v.setCurrentTasksData([]);
      _v.setSelectedProjectModuleData([]);
      _v.setSelectedSegmentData([]);
      _v.setSelectedComponentData([]);
      _v.setSelectedSubComponentData([]);
      _v.setBreadcrumbData([]);
      _v.setSearchText('');
      setChainageData(null); // Clear local chainage data on unmount
    },
    [],
  );

  const setBreadcrumbItems = (
    currentLevel = _v.currentLevel,
    segmentView = _v.segmentView,
  ) => {
    if (currentLevel == 1) {
      _v.setBreadcrumbData([
        {
          name: 'Project Modules',
          level: 1,
          active: false,
        },
      ]);
      _v.setSelectedSegmentData([]);
      _v.setSelectedComponentData([]);
      _v.setSelectedSubComponentData([]);
    } else if (currentLevel == 2) {
      if (!segmentView) {
        _v.setBreadcrumbData([
          {
            name: _v.selectedProjectModuleData.name,
            level: 1,
            active: true,
          },
          {
            name: 'Segment Types',
            level: 0,
            active: false,
          },
        ]);
      } else {
        _v.setBreadcrumbData([]);
        const bredcrumdTemp = [];

        bredcrumdTemp.push({
          name: _v.selectedProjectModuleData.name,
          level: 1,
          active: true,
        })
        
        if (_v.segmentsByGroupOnType && Object.keys(_v.segmentsByGroupOnType)?.length > 1) {
          bredcrumdTemp.push(
            {
              name: SEGMENT_TYPES_DISPLAY[_v.selectedSegmentType],
              level: 2,
              segmentView: 0,
              active: false,
            },
          )
        }

        bredcrumdTemp.push(
          {
            name: 'Segments',
            level: 0,
            active: false,
          }
        );

        _v.setBreadcrumbData(bredcrumdTemp);
      }
      _v.setSelectedComponentData([]);
      _v.setSelectedSubComponentData([]);
    } else if (currentLevel == 3) {
      let breadcrumbData: any[] = _v.breadcrumbData;
      breadcrumbData = _v.segmentsByGroupOnType && Object.keys(_v.segmentsByGroupOnType)?.length === 1 ? breadcrumbData.slice(0, 2) : breadcrumbData.slice(0, 3);

      breadcrumbData[breadcrumbData.length - 1] = {
        name: _v.selectedSegmentData.name,
        level: 2,
        segmentView: 1,
      };

      breadcrumbData.push({
        name: 'Components',
        level: 0,
        active: false,
      });

      _v.setBreadcrumbData([...breadcrumbData]);

      _v.setSelectedComponentData([]);
      _v.setSelectedSubComponentData([]);
    } else if (currentLevel == 4) {
      let breadcrumbData: any[] = _v.breadcrumbData;
      breadcrumbData = _v.segmentsByGroupOnType && Object.keys(_v.segmentsByGroupOnType)?.length === 1 ? breadcrumbData.slice(0, 3) : breadcrumbData.slice(0, 4);
      breadcrumbData[breadcrumbData.length - 1] = {
        name: _v.selectedComponentData.name,
        level: 3,
        active: false,
      };

      breadcrumbData.push({
        name: 'Sub Components',
        level: 0,
        active: false,
      });
      _v.setBreadcrumbData(breadcrumbData);

      _v.setSelectedSubComponentData([]);
    } else if (currentLevel == 5) {
      const breadcrumbData = _v.breadcrumbData;
      breadcrumbData[_v.breadcrumbData.length - 1] = {
        name: !_v.selectedComponentData.hasSubComponent
          ? _v.selectedComponentData.name
          : _v.selectedSubComponentData.name,
        level: !_v.selectedComponentData.hasSubComponent ? 3 : 4,
        active: false,
      };

      breadcrumbData.push({
        name: 'Tasks',
        level: 0,
        active: false,
      });
      _v.setBreadcrumbData(breadcrumbData);
    }
  };

  const onBreadcrumbItemClick = (item: any, index: number) => {
    _v.setSearchText('');
    if (item.level === 2) {
      _v.setSegmentView(item.segmentView || 0);
    }
    _v.setCurrentLevel(item.level);
    setBreadcrumbItems(item.level, item.segmentView);
  };

  return (
    <View style={styles.Container}>
      {_v.breadcrumbData.length ? (
        <View style={styles.BreadcrumbContainer}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={styles.scrollView}>
            {_v.breadcrumbData.map((item: any, index: number) => (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {
                  /*index == 0 ? (
                    <Text
                      style={styles.BreadcrumbPrevTextUnderline}
                      onPress={() =>
                        index === 0 &&
                        (_v.setCurrentLevel(1), _v.setBreadcrumbData([]))
                      }>
                      {item.name}
                    </Text>
                  ) : */
                  index === _v.breadcrumbData.length - 1 ? (
                    <Text style={styles.BreadcrumbCurrentText}>
                      {item.name}
                    </Text>
                  ) : (
                    <Text
                      onPress={() => onBreadcrumbItemClick(item, index)}
                      style={styles.BreadcrumbPrevTextUnderline}>
                      {item.name}
                    </Text>
                  )
                }
                {index < _v.breadcrumbData.length - 1 ? (
                  <Image
                    style={styles.ArrowIcon}
                    source={require('../../images/right-arrow-icon.png')}
                  />
                ) : null}
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}
      {_v.currentLevel !== 1 && _v.currentLevel !== 5 ? (
        <View style={styles.SearchBox}>
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
            value={_v.searchText}
            onChangeText={text => {
              _v.setSearchText(text);
            }}
          />
        </View>
      ) : null}
      
      <ScrollView style={[{paddingVertical: 15, height: calculatedHeight}]}>
        {
          (() => {
            if (_v.currentLevel === 1) {
              return _customForms.projectModuleListing(_v, getMyWorksData)
            } else if (_v.currentLevel === 2 && _v.segmentView === 0 && _v.selectedProjectModuleData?.segmentsData?.length) {
              return _customForms.segmentGroupListing(_v)
            } else if (_v.currentLevel === 2 && _v.segmentView === 1) {
              return _customForms.segmentListing(_v, getMyWorksData)
            } else if (_v.currentLevel === 3) {
              return _customForms.componentListing(_v, getMyWorksData)
            } else if (_v.currentLevel === 4) {
              return _customForms.subComponentListing(_v, getMyWorksData)
            } else if (_v.currentLevel === 5) {
              return _customForms.tasksListing(_v)
            }
          })()
        }
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={_v.openPopup}
        onRequestClose={() => {
          _v.setOpenPopup(!_v.openPopup);
        }}>
        <View style={styles.bodyPopup}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.ModalHeader}>
                <Text style={styles.modalText}>RFIs</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => _v.setOpenPopup(!_v.openPopup)}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ModalInnerContainer}>
                <View style={styles.taskAddContainer}>
                  <Text style={styles.Lable}>
                    Task:{' '}
                    <Text style={{fontWeight: '600', color: '#5A2AAF'}}>
                      {_v.selectedTask?.displayName}
                    </Text>
                  </Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{minHeight: 100, maxHeight: 500}}>
                  <Fragment>
                    <StatusBar barStyle="dark-content" />
                    <SafeAreaView>
                      {_customForms.taskForm(_v.selectedTask?.name)}
                    </SafeAreaView>
                  </Fragment>
                </ScrollView>

                <View
                  style={[
                    styles.btnParentSection,
                    {
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 20,
                      marginBottom: -65,
                      backgroundColor: '#F7F3FF',
                      paddingVertical: 10,
                      marginHorizontal: -15,
                    },
                  ]}>
                  <TouchableOpacity
                    style={[styles.submitButton, styles.saveButtonColor]}
                    onPress={() =>
                      _event.onFillChecklist(RFI_STATUS.IN_PROGRESS)
                    }>
                    <Text style={[styles.submitButtonText, {color: '#5A2AAF'}]}>
                      Save
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() =>
                      _event.onFillChecklist(RFI_STATUS.IN_REVIEW)
                    }>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <LoadingAnimation loading={_v.loading}></LoadingAnimation>
    </View>
  );
};

export default MyWork;
