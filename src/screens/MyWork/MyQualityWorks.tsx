import { View, Text, NativeEventEmitter, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Modal, StatusBar, SafeAreaView, Dimensions, Alert } from 'react-native'
import React, { Fragment, useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems, PROJECT_TYPE, RFI_STATUS, SEGMENT_TYPES_DISPLAY, TASK_TYPES, TEST_SAMPLE_STATUS, TEST_SAMPLE_STATUS_LIST, USER_CATEGORY, YES_NO_LIST, YES_NO_NA_LIST } from "../../constants/constants"
import { useDispatch, useSelector } from 'react-redux';
import { clearMyWorksEvent, getMyTests, updateTestSample, } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Guid } from 'guid-typescript';

const MyQualityWork = ({ route, navigation }: { route: any, navigation: any }) => {
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const workType = PROJECT_TYPE.QUALITY_WORK;

  const { myTests, testSampleUpdated, loading, error } = useSelector((state: any) => state.MyWorks);
  const [myTestsData, setMyTestsData] = useState([]);
  const [currentTestWorkCategoryData, setCurrentTestWorkCategoryData] = useState([]);
  const [currentTestMaterialsData, setCurrentTestMaterialsData] = useState([]);
  const [currentTestTypesData, setCurrentTestTypesData] = useState([]);
  const [currentSubTestTypesData, setCurrentSubTestTypesData] = useState([]);
  const [currentSubTestTypeRFIsData, setCurrentSubTestTypeRFIsData] = useState([]);
  const [testClassificationId, setTestClassificationId] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [breadcrumbData, setBreadcrumbData] = useState([{
    name: '',
    testClassifIndex: 0,
    workCateIndex: 0,
    testMateIndex: 0,
    testTypeIndex: 0,
    level: 0,
    assignmentLevel: 0,
    active: false
  }]);

  const imageObjectEmpty = {
    filepath: {
      data: '',
      uri: ''
    },
    fileData: '',
    fileUri: ''
  };

  const [rfiDate, setRFIDate] = useState('');
  const [hours, setHours] = useState([]);
  const [minutes, setMinutes] = useState([]);
  const [timeFormats, setTimeFormats] = useState([]);

  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [timeFormat, setTimeFormat] = useState('AM');

  const [openHours, setOpenHours] = useState(false);
  const [openMinutes, setOpenMinutes] = useState(false);
  const [openTimeFormats, setOpenTimeFormats] = useState(false);

  const [openCalendar, setOpenCalendar] = useState(false);

  const [comments, setComments] = useState('');
  const { width, height } = Dimensions.get('window');

  // CNG_AND_SETTING_OUT
  // PLACING_OF_SHEATHING_DUCT
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [imageObject, setImageObject] = useState(imageObjectEmpty);

  // FORM_WORK
  // PLACEMENT_OF_INNER_SHUTTERS
  // PLACEMENT_OF_SIDE_SHUTTERS
  // PLACEMENT_OF_BOTTOM_SHUTTER
  // PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER
  const [cleanliness, setCleanliness] = useState('Y');
  const [openCleanliness, setOpenCleanliness] = useState(false);
  const [formworkAlignmentChecked, setFormworkAlignmentChecked] = useState('Y');
  const [openFormworkAlignmentChecked, setOpenFormworkAlignmentChecked] = useState(false);
  const [formworkSealingChecked, setFormworkSealingChecked] = useState('Y');
  const [openFormworkSealingChecked, setOpenFormworkSealingChecked] = useState(false);
  const [formworkdDrawingsChecked, setFormworkdDrawingsChecked] = useState('Y');
  const [openFormworkdDrawingsChecked, setOpenFormworkdDrawingsChecked] = useState(false);
  const [concreteFinishLevelMarked, setConcreteFinishLevelMarked] = useState('Y');
  const [openConcreteFinishLevelMarked, setOpenConcreteFinishLevelMarked] = useState(false);
  const [formworkProperlySupported, setFormworkProperlySupported] = useState('Y');
  const [openFormworkProperlySupported, setOpenFormworkProperlySupported] = useState(false);
  const [formworkFitConcreting, setFormworkFitConcreting] = useState('Y');
  const [openFormworkFitConcreting, setOpenFormworkFitConcreting] = useState(false);

  // REINFORCEMENT
  // REINFORCEMENT_PREPARATION
  // PLACEMENT_OF_REINFORCEMENT_CAGE **(except spacerBarCheckedGFC)
  const [rebarAndDimensionGFC, setRebarAndDimensionGFC] = useState('Y');
  const [openRebarAndDimensionGFC, setOpenRebarAndDimensionGFC] = useState(false);
  const [shapingNoAndLengthOfBarsGFC, setShapingNoAndLengthOfBarsGFC] = useState('Y');
  const [openShapingNoAndLengthOfBarsGFC, setOpenShapingNoAndLengthOfBarsGFC] = useState(false);
  const [rebarsSecurelyTightened, setRebarsSecurelyTightened] = useState('Y');
  const [openRebarsSecurelyTightened, setOpenRebarsSecurelyTightened] = useState(false);
  const [spliceLengthAndLocationGFC, setSpliceLengthAndLocationGFC] = useState('Y');
  const [openSpliceLengthAndLocationGFC, setOpenSpliceLengthAndLocationGFC] = useState(false);
  const [rebarWithinToleranceLimit, setRebarWithinToleranceLimit] = useState('Y');
  const [openRebarWithinToleranceLimit, setOpenRebarWithinToleranceLimit] = useState(false);
  const [couplerArrangementsWithinTolerance, setCouplerArrangementsWithinTolerance] = useState('Y');
  const [openCouplerArrangementsWithinTolerance, setOpenCouplerArrangementsWithinTolerance] = useState(false);
  const [barBendingScheduleChecked, setBarBendingScheduleChecked] = useState('Y');
  const [openBarBendingScheduleChecked, setOpenBarBendingScheduleChecked] = useState(false);
  const [spacerBarCheckedGFC, setSpacerBarCheckedGFC] = useState('Y');
  const [openSpacerBarCheckedGFC, setOpenSpacerBarCheckedGFC] = useState(false);

  // EXCAVATION
  const [quantity, setQuantity] = useState(0);

  // REMOVAL_OF_SHUTTER
  // REMOVAL_OF_SHUTTERS
  const [concreteHasAchievedDesiredStrength, setConcreteHasAchievedDesiredStrength] = useState('Y');
  const [openConcreteHasAchievedDesiredStrength, setOpenConcreteHasAchievedDesiredStrength] = useState(false);
  const [minimumTimeHasBeenAttained, setMinimumTimeHasBeenAttained] = useState('Y');
  const [openMinimumTimeHasBeenAttained, setOpenMinimumTimeHasBeenAttained] = useState(false);

  // THREADING_OF_PRE_STRESSING_STRANDS
  // only comments

  // CAGE_LOWERING
  const [plieShaftCleanedLooseMaterial, setPlieShaftCleanedLooseMaterial] = useState('Y');
  const [openPlieShaftCleanedLooseMaterial, setOpenPlieShaftCleanedLooseMaterial] = useState(false);
  const [suitableSpacerProvidedToMaintainCoverToSteel, setSuitableSpacerProvidedToMaintainCoverToSteel] = useState('Y');
  const [openSuitableSpacerProvidedToMaintainCoverToSteel, setOpenSuitableSpacerProvidedToMaintainCoverToSteel] = useState(false);
  const [noLBendBottomOfTheCageChecked, setNoLBendBottomOfTheCageChecked] = useState('Y');
  const [openNoLBendBottomOfTheCageChecked, setOpenNoLBendBottomOfTheCageChecked] = useState(false);

  // CONCRETE
  const [concreteData, setConcreteData] = useState([{
    vehicleNo: '',
    timeOfArrival: 'N',
    gradeOfConcrete: 'Y',
    concreteTemp: '',
    slumpValue: '',
    noOfCubesCasted: '',
    concreteStartTime: '',
    concretePoured: '',
    concreteFinishTime: '',
    key: Guid.create()
  }]);
  const dispatch = useDispatch()
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.myQualityWorks);
      setCurrentLevel(1);
      setMyTestsData([]);
      setCurrentTestWorkCategoryData([]);
      setCurrentTestMaterialsData([]);
      setCurrentTestTypesData([]);
      setCurrentSubTestTypesData([]);
      setCurrentSubTestTypeRFIsData([]);
      setBreadcrumbData([]);
      getMyWorksData();
      setSearchText('');
      setOpenPopup(false)
    }
  }, [focus]);

  const getMyWorksData = () => {
    dispatch(getMyTests({
      projectId: loggedInUser.projectId,
      workType: workType
    }));
  }

  useEffect(() => {
    if (myTests) {
      setMyTestsData(myTests);
    }
    if (testSampleUpdated) {
        const sampleDataTemp: any = [...currentSubTestTypeRFIsData]
        const updatedSampleIndex = sampleDataTemp.findIndex((x: any) => x._id === testSampleUpdated._id);
        if (updatedSampleIndex != -1) {
          sampleDataTemp[updatedSampleIndex] = testSampleUpdated;
        }
        setCurrentSubTestTypeRFIsData([]);
        setCurrentSubTestTypeRFIsData(sampleDataTemp);
        Alert.alert('Info', 'Sample updated')
      dispatch(clearMyWorksEvent());
    }
  }, [myTests, testSampleUpdated, error]);

  // unmount
  useEffect(() => () => {
    dispatch(clearMyWorksEvent());
    setCurrentLevel(1);
    setMyTestsData([]);
    setCurrentTestWorkCategoryData([]);
    setCurrentTestMaterialsData([]);
    setCurrentTestTypesData([]);
    setCurrentSubTestTypesData([]);
    setCurrentSubTestTypeRFIsData([]);
    setBreadcrumbData([]);
    setSearchText('');
  }, []);

  const onClick = (level: number, assignmentLevel: number, testClassifIndex: number, workCateIndex: number = -1, testMateIndex: number = -1, testTypeIndex: number = -1) => {
    setSearchText('');
    setCurrentLevel(level)
    setBreadcrumbData([]);
    setCurrentTestTypesData([]);
    setCurrentSubTestTypesData([]);
    setCurrentSubTestTypeRFIsData([]);
    const testClassifData: any = myTestsData[testClassifIndex];
    let testWorkCategoryData = null;
    let testMateData = null;
    let testTypeData = null;
    let breadCrumb: any = [{
      name: testClassifData.name,
      testClassifIndex: testClassifIndex,
      workCateIndex: workCateIndex,
      testMateIndex: testMateIndex,
      testTypeIndex: testTypeIndex,
      level: level,
      assignmentLevel: 1,
      active: true
    },
    {
      name: 'Work Category',
      testClassifIndex: testClassifIndex,
      workCateIndex: workCateIndex,
      testMateIndex: testMateIndex,
      testTypeIndex: testTypeIndex,
      level: 0,
      assignmentLevel: 0,
      active: false
    }];
    setCurrentTestWorkCategoryData(testClassifData.testWorkCategoriesData);
    if (workCateIndex != -1) {
      testWorkCategoryData = testClassifData.testWorkCategoriesData[workCateIndex];
      breadCrumb[1].name = testWorkCategoryData.name;
      setCurrentTestMaterialsData(testWorkCategoryData.testMaterialsData);
      breadCrumb.push({
        name: 'Test Materials',
        testClassifIndex: testClassifIndex,
        workCateIndex: workCateIndex,
        testMateIndex: testMateIndex,
        testTypeIndex: testTypeIndex,
        level: level,
        assignmentLevel: 2,
        active: true
      })

      if (testMateIndex != -1) {
        testMateData = testWorkCategoryData.testMaterialsData[testMateIndex];
        breadCrumb[2].name = testMateData.name;
        setCurrentTestTypesData(testMateData.testTypesData);
        breadCrumb.push({
          name: 'Test Types',
          testClassifIndex: testClassifIndex,
          workCateIndex: workCateIndex,
          testMateIndex: testMateIndex,
          testTypeIndex: testTypeIndex,
          level: level,
          assignmentLevel: 3,
          active: true
        })

        if (testTypeIndex != -1) {
          testTypeData = testMateData.testTypesData[testTypeIndex];
          breadCrumb[3].name = testTypeData.name;

          if (testTypeData.subTestTypes?.length) {
            setCurrentSubTestTypesData(testTypeData.subTestTypes)
          }
          // breadCrumb.push({
          //   name: testTypeData.name,
          //   testClassifIndex: testClassifIndex,
          //   workCateIndex: workCateIndex,
          //   testMateIndex: testMateIndex,
          //   testTypeIndex: testTypeIndex,
          //   level: level,
          //   assignmentLevel: 4,
          //   active: true
          // })
        }
      }
    }

    setBreadcrumbData(breadCrumb);

  }

  const onClickNested = (level: number, data: any) => {
    setSearchText('');
    setCurrentSubTestTypeRFIsData([]);
    if (data.testClassificationId) {
      setTestClassificationId(data.testClassificationId);
    }
    setCurrentLevel(level);
    if (level === 2) {
      setCurrentTestWorkCategoryData(data.testWorkCategoriesData)
      //const beadcrumb = breadcrumbData[1];
    } else if (level === 3) {
      breadcrumbData[1].name = data.name;
      setCurrentTestMaterialsData(data.testMaterialsData)
      const bcrubm = {
        name: 'Test Materials',
        testClassifIndex: breadcrumbData[0].testClassifIndex,
        workCateIndex: breadcrumbData[1].workCateIndex,
        testMateIndex: breadcrumbData[2]?.testMateIndex || -1,
        testTypeIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false
      }
      breadcrumbData.push(bcrubm)
      // if (data.subComponentsData && data.subComponentsData.length) {
      //   setCurrentTestMaterialsData(data.subComponentsData)
      // } else {
      //   setCurrentTestTypesData(data.testTypesData)
      //   breadcrumbData.push({
      //     name: 'Tasks',
      //     testClassifIndex: breadcrumbData[0].testClassifIndex,
      //     workCateIndex: breadcrumbData[1].workCateIndex,
      //     testMateIndex: breadcrumbData[2]?.testMateIndex || -1,
      //     testTypeIndex: 0,
      //     level: 0,
      //     assignmentLevel: 0,
      //     active: false
      //   })
      // }
    } else if (level === 4) {
      breadcrumbData[2].name = data.name;
      setCurrentTestTypesData(data.testTypesData)
      const bcrubm = {
        name: 'Test Types',
        testClassifIndex: breadcrumbData[0].testClassifIndex,
        workCateIndex: breadcrumbData[1].workCateIndex,
        testMateIndex: breadcrumbData[2]?.testMateIndex || -1,
        testTypeIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false
      }
      breadcrumbData.push(bcrubm)
    } else if (level === 6) {
      // show sample test generated
      setCurrentSubTestTypeRFIsData(data.testRFIsData);
    }
  }

  const onUpdateSample = (item: any) => {
    if (!item['sampleStatus_TEMP'] || item['sampleStatus_TEMP'] === TEST_SAMPLE_STATUS.PENDING) {
      Alert.alert('Error', 'Please sample status');
      return;
    }
    if (item['sampleStatus_TEMP'] === TEST_SAMPLE_STATUS.PREPARED) {
      if (!item['rfiDateTime_TEMP'] || (new Date(item['rfiDateTime_TEMP'])).toString() == 'Invalid Date') {
        Alert.alert('Error', 'Please enter date');
        return;
      }
    } else {
      item['rfiDateTime_TEMP'] = '';
    }
    
    const obj = {
      sampleStatus: item['sampleStatus_TEMP'],
      rfiDateTime: item['rfiDateTime_TEMP'],
    };
    dispatch(updateTestSample({
      projectId: loggedInUser.projectId,
      id: item._id,
      body: obj
    }));
  }

  const onClickTestSampleItem = (item: any) => {
    if (item.sampleStatus != TEST_SAMPLE_STATUS.PENDING) {
      Alert.alert('Info', "TODO")
    }
  }

  const getStyle = (item: any) => {
    if (item.rfiStatus) {
      if (item.rfiStatus === RFI_STATUS.GENERATED || item.rfiStatus === RFI_STATUS.RE_GENERATED) {
        return [styles.StartWorkCard, styles.StartBorder];
      } else if (item.rfiStatus === RFI_STATUS.REJECTED || item.rfiStatus === RFI_STATUS.CANCELLED) {
        return [styles.StartWorkCard, styles.StartRejectBorder];
      } else if (item.rfiStatus === RFI_STATUS.IN_PROGRESS) {
        return [styles.StartWorkCard, styles.StartInProgressBorder];
      } else if (item.rfiStatus === RFI_STATUS.IN_REVIEW) {
        return [styles.StartWorkCard, styles.StartReviewBorder];
      } else if (item.rfiStatus === RFI_STATUS.APPROVED) {
        return [styles.StartWorkCard, styles.StartCompleteBorder];
      }
    }
    return [styles.StartWorkCardDisabled, styles.DisabledBorder];
  }

  const getRFIDataByWorkAssignmentId = (task: any) => {
    // setRFIDate('');
    // setComments('');
    // setImageObject(imageObjectEmpty);
    setSelectedTask(task);
    // dispatch(getRFIByWaId({
    //   projectId: loggedInUser.projectId,
    //   projectModuleId: projectModuleId,
    //   waId: task.workAssignmentId,
    // }));
  }

  const tasksListing = () => {
    return currentTestTypesData.filter((task: any) => {
      if (searchText && task.name) {
        return task.name.toLowerCase().includes(searchText.toLowerCase())
      } else {
        return true;
      }
    }).map((item: any, index) => (
      <View style={getStyle(item)}>
        <View style={styles.leftContainer}>
          <Text style={styles.HeadText}>{item.name}</Text>
          {/* <Text style={styles.MyWorkSubHead}>Sub Text</Text> */}
        </View>
        {
          item.rfiStatus === RFI_STATUS.GENERATED ?
            <TouchableOpacity style={[styles.MyWorkCta, styles.StartBorder]} onPress={() => {
              getRFIDataByWorkAssignmentId(item)
            }}>
              <Image style={styles.WorkIcon} source={require('../../images/play-icon.png')} />
              <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>Start</Text>
            </TouchableOpacity> : null
        }

        {
          item.rfiStatus === RFI_STATUS.RE_GENERATED ?
            <TouchableOpacity style={[styles.MyWorkCta, styles.StartBorder]} onPress={() => {
              getRFIDataByWorkAssignmentId(item)
            }}>
              <Image style={styles.WorkIcon} source={require('../../images/play-icon.png')} />
              <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>Re-start</Text>
            </TouchableOpacity> : null
        }

        {
          (item.rfiStatus === RFI_STATUS.REJECTED || item.rfiStatus === RFI_STATUS.CANCELLED) ?
            <TouchableOpacity style={[styles.MyWorkCta, styles.StartRejectBorder]}>
              {/* <Image style={styles.WorkIcon} source={require('../../images/play-icon.png')} /> */}
              <Text style={[styles.CtaStartText, styles.CtaRejectTextColor]}>{item.rfiStatus === RFI_STATUS.CANCELLED ? 'Cancelled' : 'Rejected'}</Text>
            </TouchableOpacity> : null
        }

        {
          item.rfiStatus === RFI_STATUS.IN_PROGRESS ?
            <TouchableOpacity style={[styles.MyWorkCta, styles.StartInProgressBorder]} onPress={() => {
              getRFIDataByWorkAssignmentId(item)
            }}>
              <Image style={styles.WorkIcon} source={require('../../images/inprogress.png')} />
              <Text style={[styles.CtaStartText, styles.CtaInProgressTextColor]}>In Progress</Text>
            </TouchableOpacity> : null
        }

        {
          item.rfiStatus === RFI_STATUS.IN_REVIEW ?
            <TouchableOpacity style={[styles.MyWorkCta, styles.StartReviewBorder]}>
              <Image style={styles.WorkIcon} source={require('../../images/review-icon.png')} />
              <Text style={[styles.CtaStartText, styles.CtaReviewTextColor]}>Under Review</Text>
            </TouchableOpacity> : null
        }

        {
          item.rfiStatus === RFI_STATUS.APPROVED ?
            <TouchableOpacity style={[styles.MyWorkCta, styles.StartCompleteBorder]}>
              <Image style={styles.WorkIcon} source={require('../../images/complete-icon.png')} />
              <Text style={[styles.CtaStartText, styles.CtaCompleteTextColor]}>Completed</Text>
            </TouchableOpacity> : null
        }

      </View>
    ))
  }

  const CustomDropdownPicker = ({ items, rowItem, fieldName }: { items: any, rowItem: any, fieldName: any }) => {
    const [value, setValue] = useState(rowItem[fieldName]);
    const [openList, setOpenList] = useState(false);
    const updateValue = () => {
      { rowItem[fieldName + '_TEMP'] = value }
    }
    return (
      <DropDownPicker style={{ width: 110, height: 30, zIndex: 10 }}
        open={openList}
        value={value}
        items={items}
        setOpen={setOpenList}
        setValue={setValue}
        listMode='MODAL'
        closeAfterSelecting={true}
        onChangeValue={() => updateValue()}
      />
    )
  }

  const CustomTextInput = ({ rowItem, fieldName }: { rowItem: any, fieldName: any }) => {
    const [value, setValue] = useState(rowItem[fieldName]);
    const updateValue = (text: any) => {
      { rowItem[fieldName + '_TEMP'] = text }
    }

    return (
      <TextInput
        style={styles.inputStyle3}
        placeholder=""
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        underlineColorAndroid="#f000"
        blurOnSubmit={false}
        value={value}
        onChangeText={(text) => {
          setValue(text); updateValue(text);
        }}
      />
    )
  }

  return (
    <View style={styles.Container}>
      <View style={styles.BreadcrumbContainer}>
        {
          breadcrumbData.map((item: any, index) => (
            <View style={{ flexDirection: 'row' }}>
              {
                index == 0 ? <Text style={styles.BreadcrumbPrevTextUnderline} onPress={() => index === 0 && (setCurrentLevel(1), setBreadcrumbData([]))}>{item.name}</Text>
                  : index === (breadcrumbData.length - 1) ? <Text style={styles.BreadcrumbCurrentText}>{item.name}</Text>
                    : <Text style={styles.BreadcrumbPrevText}>{item.name}</Text>
              }
              {
                index < (breadcrumbData.length - 1) ? <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} /> : null
              }
            </View>
          ))
        }
      </View>
      {
        (currentLevel !== 1 && currentLevel !== 4) ? <View style={styles.SearchBox}>
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
          : null
      }
      <ScrollView style={styles.Height100}>
        {
          currentLevel === 1 ?
            myTestsData.map((testClassificationItem: any, testClassificationIndex) => (
              testClassificationItem.assignmentLevel === 1 ?
                <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(2, testClassificationItem.assignmentLevel, testClassificationIndex)}>
                  <Text style={styles.HeadingText}>{testClassificationItem.name}</Text>
                  <View style={styles.TaskDetails}>
                    <Text style={styles.SubHeadingText}>Assigned:</Text>
                    <Text style={[styles.SubHeadingText, styles.SubActive]}>{testClassificationItem.name}</Text>
                  </View>
                </TouchableOpacity>
                :
                (testClassificationItem.testWorkCategoriesData?.map((workCateItem: any, workCateIndex: any) => (
                  (workCateItem.assignmentLevel === 2) ? (
                    <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(3, workCateItem.assignmentLevel, testClassificationIndex, workCateIndex)}>
                      <Text style={styles.HeadingText}>{testClassificationItem.name}</Text>
                      <View style={styles.TaskDetails}>
                        <Text style={styles.SubHeadingText}>Assigned:</Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={[styles.SubHeadingText, styles.SubActive]}>{workCateItem.name}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                    :
                    workCateItem.testMaterialsData && workCateItem.testMaterialsData.length ? (
                      workCateItem.testMaterialsData?.map((testMateItem: any, testMateIndex: number) => (
                        testMateItem.assignmentLevel === 3 ?
                          (
                            <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(4, testMateItem.assignmentLevel, testClassificationIndex, workCateIndex, testMateIndex)}>
                              <Text style={styles.HeadingText}>{testClassificationItem.name}</Text>
                              <View style={styles.TaskDetails}>
                                <Text style={styles.SubHeadingText}>Assigned:</Text>
                                <Text style={styles.SubHeadingText}>{workCateItem.name} /</Text>
                                <Text style={[styles.SubHeadingText, styles.SubActive]}>{testMateItem.name}</Text>
                              </View>
                            </TouchableOpacity>

                          )
                          :
                          testMateItem.testTypesData?.map((testTypeItem: any, testTypeIndex: number) => (
                            testTypeItem.assignmentLevel === 4 &&
                            <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(5, testTypeItem.assignmentLevel, testClassificationIndex, workCateIndex, testMateIndex, testTypeIndex)}>
                              <Text style={styles.HeadingText}>{testClassificationItem.name}</Text>
                              <View style={styles.TaskDetails}>
                                <Text style={styles.SubHeadingText}>Assigned:</Text>
                                <Text style={styles.SubHeadingText}>{workCateItem.name} /</Text>
                                <Text style={styles.SubHeadingText}>{testMateItem.name} /</Text>
                                <Text style={[styles.SubHeadingText, styles.SubActive]}>{testTypeItem.name}</Text>
                              </View>
                            </TouchableOpacity>

                          ))

                      ))
                    )
                      :
                      null

                )))

            )) : null
        }
        {
          currentLevel === 2 ?
            currentTestWorkCategoryData && currentTestWorkCategoryData.length ? currentTestWorkCategoryData.filter((subSeg: any) => {
              if (searchText && subSeg.name) {
                return subSeg.name.toLowerCase().includes(searchText.toLowerCase())
              } else {
                return true;
              }
            }).map((item: any, index) => (
              <TouchableOpacity style={getStyle(item)} onPress={() => onClickNested(3, item)}>
                <View style={styles.leftContainer}>
                  <Text style={styles.HeadText}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )) : tasksListing()
            :
            null
        }
        {
          currentLevel === 3 ?
            currentTestMaterialsData && currentTestMaterialsData.length ? currentTestMaterialsData.filter((testMate: any) => {
              if (searchText && testMate.name) {
                return testMate.name.toLowerCase().includes(searchText.toLowerCase())
              } else {
                return true;
              }
            }).map((item: any, index) => (
              <TouchableOpacity style={getStyle(item)} onPress={() => onClickNested(4, item)}>
                <View style={styles.leftContainer}>
                  <Text style={styles.HeadText}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )) : tasksListing()
            :
            null
        }
        {
          (currentLevel === 4) ?
            tasksListing()
            : null
        }
        {
          (currentLevel === 5) ?
            currentSubTestTypesData?.length ?
              currentSubTestTypesData.filter((subTestType: any) => {
                if (searchText && subTestType.name) {
                  return subTestType.name.toLowerCase().includes(searchText.toLowerCase())
                } else {
                  return true;
                }
              }).map((item: any) => (
                <TouchableOpacity style={getStyle(item)} onPress={() => onClickNested(6, item)}>
                  <View style={styles.leftContainer}>
                    <Text style={styles.HeadText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )) : tasksListing()
            :
            null
        }
        {
          (currentLevel === 6) ?
            currentSubTestTypeRFIsData?.length ?
              <ScrollView style={styles.Height100}>
                {
                  currentSubTestTypeRFIsData.filter((testRFI: any) => {
                    if (searchText && testRFI.name) {
                      return testRFI.name.toLowerCase().includes(searchText.toLowerCase())
                    } else {
                      return true;
                    }
                  }).map((item: any) => (
                    <View>
                      <View style={item.sampleStatus != TEST_SAMPLE_STATUS.PREPARED && { borderColor: '#000', borderWidth: 1, borderRadius: 10, marginBottom: 10 }}>
                        <TouchableOpacity style={getStyle(item)} onPress={() => onClickTestSampleItem(item)}>
                          <View style={styles.leftContainer}>
                            <Text style={styles.HeadText}>{item.name}</Text>
                          </View>
                        </TouchableOpacity>
                        {
                          item.sampleStatus != TEST_SAMPLE_STATUS.PREPARED ?
                            <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                              <View style={[styles.SectionStyle, { width: 130 }]}>
                                <CustomDropdownPicker items={TEST_SAMPLE_STATUS_LIST}
                                  rowItem={item}
                                  fieldName={'sampleStatus'}
                                />
                              </View>
                              <View style={{ height: 45 }}>
                                <CustomTextInput rowItem={item}
                                  fieldName={'rfiDateTime'}></CustomTextInput>
                              </View>
                              <View style={{ height: 45, width: 100 }}>
                                <TouchableOpacity style={[styles.SubmitSample, styles.StartBorder]} onPress={() => onUpdateSample(item)}>
                                  <View style={styles.leftContainer}>
                                    <Text style={styles.HeadText}>Submit</Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            </View>
                            :
                            null
                        }
                      </View>

                    </View>

                  ))
                }
              </ScrollView>
              : null//tasksListing()
            : null
        }
        {/* No Data Found */}
        {(!loading && !myTestsData.length) ?
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
          </View> : null
        }
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={openPopup}
        onRequestClose={() => {
          setOpenPopup(!openPopup);
        }}>
        <View style={styles.bodyPopup}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.ModalHeader}>
                <Text style={styles.modalText}>RFIs</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => setOpenPopup(!openPopup)}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ModalInnerContainer}>
                <View>
                  <Text style={styles.modalLabel}>Task: {selectedTask?.name}</Text>
                </View>
                <ScrollView style={{ paddingTop: 10, height: 500 }}>
                  <Fragment>
                    <StatusBar barStyle="dark-content" />
                    <SafeAreaView>
                      {
                        // taskForm(selectedTask?.name)
                      }
                    </SafeAreaView>
                  </Fragment>
                </ScrollView>

                {/* <View style={[styles.btnParentSection, { flexDirection: 'row', justifyContent: 'center', gap: 20 }]}>
                  <TouchableOpacity style={styles.submitButton} onPress={() => onFillChecklist(RFI_STATUS.IN_PROGRESS)}>
                    <Text style={styles.submitButtonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.submitButton} onPress={() => onFillChecklist(RFI_STATUS.IN_REVIEW)}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            </View>
          </View>
        </View>
      </Modal>


      <LoadingAnimation loading={loading}></LoadingAnimation>
    </View>
  )
}

const CustomTextInput = ({ rowItem, fieldName }: { rowItem: any, fieldName: any }) => {
  const [value, setValue] = useState(rowItem[fieldName]);
  const updateValue = (text: any) => {
    { rowItem[fieldName] = text }
  }

  return (
    <TextInput
      style={styles.inputStyle2}
      placeholder=""
      autoCapitalize="none"
      keyboardType="email-address"
      returnKeyType="next"
      underlineColorAndroid="#f000"
      blurOnSubmit={false}
      value={value}
      onChangeText={(text) => {
        setValue(text); updateValue(text);
      }}
    />
  )
}

const CustomDropdownPicker = ({ items, rowItem, fieldName }: { items: any, rowItem: any, fieldName: any }) => {
  const [value, setValue] = useState(rowItem[fieldName]);
  const [openList, setOpenList] = useState(false);
  const updateValue = () => {
    { rowItem[fieldName] = value }
  }
  return (
    <DropDownPicker style={{ width: 90, height: 45, zIndex: 10 }}
      open={openList}
      value={value}
      items={items}
      setOpen={setOpenList}
      setValue={setValue}
      listMode='MODAL'
      closeAfterSelecting={true}
      onChangeValue={() => updateValue()}
    />
  )
}

const styles = StyleSheet.create({
  assignTagButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  GenerateRFIFieldLabel: {
    fontSize: 16,
    color: '#150A33',
    fontWeight: '500'
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 10,
    marginTop: 5,
  },
  Container: {
    padding: 20,
  },
  Height100: {
    height: '100%',
  },
  SearchBox: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 20,
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
  inputStyle: {
    flex: 1,
    color: '#2c2c2c',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#808089',
    backgroundColor: '#fff',
    fontWeight: '600',
    paddingVertical: 5,
    height: 45,
  },
  inputStyle2: {
    flex: 1,
    color: '#2c2c2c',
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#808089',
    backgroundColor: '#fff',
    fontWeight: '600',
    height: 45,
    width: 50
  },
  inputStyle3: {
    flex: 1,
    color: '#2c2c2c',
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#808089',
    backgroundColor: '#fff',
    fontWeight: '600',
    height: 30,
    width: 120
  },
  //Start Work
  StartWorkCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  StartWorkCardDisabled: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    opacity: 0.5
  },
  SubmitSample: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 45,
    textAlign: 'center',
    padding: 10,
    alignItems: 'center',
    marginLeft: 20
  },
  leftContainer: {
    flexDirection: 'column',
  },
  HeadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  MyWorkSubHead: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666'
  },
  WorkIcon: {
    width: 12,
    height: 12
  },
  MyWorkCta: {
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  CtaStartText: {
    fontSize: 12,
    fontWeight: '400'
  },
  CtaStartTextColor: {
    color: '#A1A1A1',
  },
  StartBorder: {
    borderColor: '#A1A1A1',
  },
  DisabledBorder: {
    borderColor: '#EBEBE4'
  },
  CtaInProgressTextColor: {
    color: '#FCB700',
  },
  StartInProgressBorder: {
    borderColor: '#FCB700'
  },
  CtaReviewTextColor: {
    color: '#1C58C0',
  },
  StartReviewBorder: {
    borderColor: '#1C58C0'
  },
  CtaCompleteTextColor: {
    color: '#2BC267',
  },
  StartCompleteBorder: {
    borderColor: '#2BC267'
  },
  StartRejectBorder: {
    borderColor: '#FF0000'
  },
  CtaRejectTextColor: {
    color: '#FF0000',
  },
  //Breacrumb Start
  BreadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 10,
    marginBottom: 10,
    gap: 5
  },
  BreadcrumbPrevText: {
    fontSize: 14,
    color: '#333'
  },
  BreadcrumbPrevTextUnderline: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#333'
  },
  BreadcrumbCurrentText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600'
  },
  ArrowIcon: {
    width: 18,
    height: 18
  },

  //MyQualityWork Card
  MyWorkCard: {
    backgroundColor: '#CCD6E7',
    borderRadius: 12,
    justifyContent: 'flex-start',
    paddingVertical: 50,
    paddingHorizontal: 20,
    marginBottom: 15,
    position: 'relative'
  },
  CompleteWork: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#2BC267',
    backgroundColor: '#fff'
  },
  CompleteIcon: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  HeadingText: {
    color: '#010101',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5
  },
  TaskDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  SubHeadingText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '400',
    marginRight: 5,
  },
  SubActive: {
    color: '#1C58C0',
    fontWeight: '800'
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
  modalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27272A',
    textAlign: 'center',
  },
  buttonClose: {
    position: 'absolute',
    right: 15,
  },
  CloseIcon: {
    width: 30,
    height: 30,
  },
  ModalInnerContainer: {
    paddingHorizontal: 15,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#27272A',
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#1C58C0',
    borderRadius: 10,
    color: '#fff',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },


  bodyPopup: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('window').height - 60,
    width: Dimensions.get('window').width
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center'
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3
  },
  btnParentSection: {
    // alignItems: 'center',
    marginTop: 10
  },
  btnSection: {
    width: 150,
    height: 50,
    backgroundColor: '#1C58C0',
    // alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  /* Left Swipe */
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green',
    margin: 20,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Dark Gray 
    margin: 10,
    textAlign: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF', // White 
    borderBottomColor: '#E0E0E0', // Lighter Gray 
    borderBottomWidth: 1,
    height: 45,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 10,
  },
  itemText: {
    color: '#333', // Dark Gray 
    fontSize: 16,
    fontWeight: 'bold',
  },
  hiddenContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 45,
    borderRadius: 20,
  },
  hiddenButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: 45,
  },
  closeButton: {
    backgroundColor: 'green', // Blue 
    borderRadius: 20,
  },
  deleteButton: {
    backgroundColor: '#E74C3C', // Red 
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyQualityWork