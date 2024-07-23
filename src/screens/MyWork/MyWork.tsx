import { View, Text, NativeEventEmitter, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Modal, StatusBar, SafeAreaView, Dimensions, Alert } from 'react-native'
import React, { Fragment, useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems, PROJECT_TYPE, RFI_STATUS, SEGMENT_TYPES_DISPLAY, TASK_TYPES, YES_NO_LIST, YES_NO_NA_LIST } from "../../constants/constants"
import { useDispatch, useSelector } from 'react-redux';
import { clearMyWorksEvent, fillRFIsChecklist, getMyWorks, getRFIByWaId } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import { groupBy } from '../../utils/Utils';
import * as ImagePicker from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Guid } from 'guid-typescript';

const MyWork = ({ route, navigation }: { route: any, navigation: any }) => {
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { workType } = route.params;

  const { myWorks, rfiData, rfiChecklistSaved, loading, error } = useSelector((state: any) => state.MyWorks);
  const [myWorksData, setMyWorksData] = useState([]);
  const [currentSegmentsData, setCurrentSegmentsData] = useState([]);
  const [currentComponentsData, setCurrentComponentsData] = useState([]);
  const [currentSubComponentsData, setCurrentSubComponentsData] = useState([]);
  const [currentTasksData, setCurrentTasksData] = useState([]);
  const [projectModuleId, setProjectModuleId] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [segmentsByGroupOnType, setSegmentsByGroupOnType] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [rfiId, setRfiId] = useState('');
  const [breadcrumbData, setBreadcrumbData] = useState([{
    name: '',
    projectModuleIndex: 0,
    segIndex: 0,
    componentIndex: 0,
    subComponentIndex: 0,
    taskIndex: 0,
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
    timeOfArrival: '',
    gradeOfConcrete: '',
    concreteTemp: 0,
    slumpValue: 0,
    noOfCubesCasted: 0,
    concreteStartTime: '',
    concretePoured: 0,
    concreteFinishTime: '',
    key: Guid.create()
  }]);
  const dispatch = useDispatch()
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.myWork);
      setCurrentLevel(1);
      setMyWorksData([]);
      setCurrentSegmentsData([]);
      setCurrentComponentsData([]);
      setCurrentSubComponentsData([]);
      setCurrentTasksData([]);
      setBreadcrumbData([]);
      getMyWorksData();
      setSearchText('');
      setOpenPopup(false)
      getHours();
      getMins();
      getTimeFormats();
    }
  }, [focus]);

  const getMyWorksData = () => {
    dispatch(getMyWorks({
      projectId: loggedInUser.projectId,
      workType: workType
    }));
  }

  useEffect(() => {
    if (myWorks) {
      setMyWorksData(myWorks);
    }

    if (rfiData) {
      setRfiId(rfiData._id);
      if (rfiData.metaData) {
        switch (selectedTask?.name) {
          case TASK_TYPES.CNG_AND_SETTING_OUT:
          case TASK_TYPES.PLACING_OF_SHEATHING_DUCT:
            setImageObject({
              filePath: '',
              fileData: rfiData.metaData.base64Image,
              fileUri: ''
            });
            break;
          case TASK_TYPES.FORM_WORK:
          case TASK_TYPES.PLACEMENT_OF_INNER_SHUTTERS:
          case TASK_TYPES.PLACEMENT_OF_SIDE_SHUTTERS:
          case TASK_TYPES.PLACEMENT_OF_BOTTOM_SHUTTER:
          case TASK_TYPES.PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER:
            setCleanliness(rfiData.metaData.cleanliness);
            setFormworkAlignmentChecked(rfiData.metaData.formworkAlignmentChecked);
            setFormworkSealingChecked(rfiData.metaData.formworkSealingChecked);
            setFormworkdDrawingsChecked(rfiData.metaData.formworkdDrawingsChecked);
            setConcreteFinishLevelMarked(rfiData.metaData.concreteFinishLevelMarked);
            setFormworkProperlySupported(rfiData.metaData.formworkProperlySupported);
            setFormworkFitConcreting(rfiData.metaData.formworkFitConcreting);
            break;
          case TASK_TYPES.REINFORCEMENT_PREPARATION:
          case TASK_TYPES.REINFORCEMENT:
            setRebarAndDimensionGFC(rfiData.metaData.rebarAndDimensionGFC);
            setShapingNoAndLengthOfBarsGFC(rfiData.metaData.shapingNoAndLengthOfBarsGFC);
            setRebarsSecurelyTightened(rfiData.metaData.rebarsSecurelyTightened);
            setSpliceLengthAndLocationGFC(rfiData.metaData.spliceLengthAndLocationGFC);
            setRebarWithinToleranceLimit(rfiData.metaData.rebarWithinToleranceLimit);
            setCouplerArrangementsWithinTolerance(rfiData.metaData.couplerArrangementsWithinTolerance);
            setBarBendingScheduleChecked(rfiData.metaData.barBendingScheduleChecked);
            setSpacerBarCheckedGFC(rfiData.metaData.spacerBarCheckedGFC);
            break;
          case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
            setRebarAndDimensionGFC(rfiData.metaData.rebarAndDimensionGFC);
            setShapingNoAndLengthOfBarsGFC(rfiData.metaData.shapingNoAndLengthOfBarsGFC);
            setRebarsSecurelyTightened(rfiData.metaData.rebarsSecurelyTightened);
            setSpliceLengthAndLocationGFC(rfiData.metaData.spliceLengthAndLocationGFC);
            setRebarWithinToleranceLimit(rfiData.metaData.rebarWithinToleranceLimit);
            setCouplerArrangementsWithinTolerance(rfiData.metaData.couplerArrangementsWithinTolerance);
            setBarBendingScheduleChecked(rfiData.metaData.barBendingScheduleChecked);
            break;
          case TASK_TYPES.EXCAVATION:
            setQuantity(rfiData.metaData.quantity);
            break;
          case TASK_TYPES.REMOVAL_OF_SHUTTER:
          case TASK_TYPES.REMOVAL_OF_SHUTTERS:
            setConcreteHasAchievedDesiredStrength(rfiData.metaData.concreteHasAchievedDesiredStrength);
            setMinimumTimeHasBeenAttained(rfiData.metaData.minimumTimeHasBeenAttained);
            break;
          case TASK_TYPES.CAGE_LOWERING:
            setPlieShaftCleanedLooseMaterial(rfiData.metaData.plieShaftCleanedLooseMaterial);
            setSuitableSpacerProvidedToMaintainCoverToSteel(rfiData.metaData.suitableSpacerProvidedToMaintainCoverToSteel);
            setNoLBendBottomOfTheCageChecked(rfiData.metaData.noLBendBottomOfTheCageChecked);
            break;
          case TASK_TYPES.CONCRETING:
            if (rfiData.metaData.concreteData) {
              rfiData.metaData.concreteData.forEach((item: any) => {
                item.key = Guid.create();
              })
              setConcreteData(rfiData.metaData.concreteData);
            } else {
              setConcreteData([]);
            }
            break;
          default:
            break;
        }
      }

      if (rfiData.rfiSubmitDateTime) {

        setRFIDate(moment(new Date(rfiData.rfiSubmitDateTime)).format('YYYY-MM-DD'));

        const time = moment(new Date(rfiData.rfiSubmitDateTime)).format('hh:mm A')
        const hourMin = time.split(' ')[0];
        setHour(hourMin.split(':')[0])
        setMinute(hourMin.split(':')[1])

        setTimeFormat(time.split(' ')[1])
      }

      if (rfiData.comments) {
        setComments(rfiData.comments);
      }
      setOpenPopup(true)
    }

    if (rfiChecklistSaved) {
      setOpenPopup(false)
      Alert.alert('RFIs checklist saved.')
      setCurrentLevel(1);
      setImageObject(imageObjectEmpty)
      dispatch(clearMyWorksEvent());
      getMyWorksData();
    }
  }, [myWorks, rfiData, rfiChecklistSaved, error]);

  // unmount
  useEffect(() => () => {
    dispatch(clearMyWorksEvent());
    setCurrentLevel(1);
    setMyWorksData([]);
    setCurrentSegmentsData([]);
    setCurrentComponentsData([]);
    setCurrentSubComponentsData([]);
    setCurrentTasksData([]);
    setBreadcrumbData([]);
    setSearchText('');
  }, []);

  const onClick = (level: number, assignmentLevel: number, projectModuleIndex: number, segIndex: number = -1, componentIndex: number = -1, subComponentIndex: number = -1, taskIndex: number = -1, segmentType = null) => {
    setSearchText('');
    setCurrentLevel(level)
    setBreadcrumbData([]);
    setCurrentTasksData([]);
    if (level === 2) {
      if (assignmentLevel === 1) {
        setCurrentLevel(7);
        const gbSegmentTypes = groupBy(myWorksData[projectModuleIndex].segmentsData, "type");
        setSegmentsByGroupOnType(gbSegmentTypes);
        setBreadcrumbData([
          {
            name: myWorksData[projectModuleIndex].name,
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 2,
            assignmentLevel: assignmentLevel,
            active: true
          },
          {
            name: "Segment Types",
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 0,
            assignmentLevel: assignmentLevel,
            active: false
          }
        ])
      } else if (assignmentLevel == -1) {
        setCurrentSegmentsData(segmentsByGroupOnType[segmentType]);
        setBreadcrumbData([
          {
            name: myWorksData[projectModuleIndex].name,
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 2,
            assignmentLevel: assignmentLevel,
            active: true
          },
          {
            name: SEGMENT_TYPES_DISPLAY[segmentType],
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 0,
            assignmentLevel: assignmentLevel,
            active: false
          }
        ])
      } else {
        const segmentsData = myWorksData[projectModuleIndex].segmentsData.filter((seg: any) => seg.type == segmentType);
        setCurrentSegmentsData(segmentsData)
        setBreadcrumbData([
          {
            name: myWorksData[projectModuleIndex].name,
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 2,
            assignmentLevel: assignmentLevel,
            active: true
          },
          {
            //name: "Foundation", // todo - dynamic
            name: SEGMENT_TYPES_DISPLAY[segmentsData[0].type] || "Foundation", // todo - dynamic
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 0,
            assignmentLevel: assignmentLevel,
            active: false
          }
        ])
      }

    } else if (level === 3 && segIndex != -1) {
      const segmentData = myWorksData[projectModuleIndex].segmentsData[segIndex];
      if (segmentData.componentsData && segmentData.componentsData.length) {
        setCurrentTasksData([]);
        setCurrentComponentsData(segmentData.componentsData)
      } else {
        setCurrentLevel(6)
        setCurrentComponentsData([]);
        setCurrentTasksData(segmentData.tasksData)
      }
      setBreadcrumbData([
        {
          name: myWorksData[projectModuleIndex].name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true
        },
        {
          name: SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: false
        }
      ])

    } else if (level === 4 && segIndex != -1 && componentIndex != -1) {
      const segmentData = myWorksData[projectModuleIndex].segmentsData[segIndex];
      const componentData = segmentData.componentsData[componentIndex];
      if (componentData.subComponentsData && componentData.subComponentsData.length) {
        setCurrentTasksData([])
        setCurrentLevel(4)
        setCurrentSubComponentsData(componentData.subComponentsData)
      } else {
        setCurrentSubComponentsData([])
        setCurrentLevel(6)
        setCurrentTasksData(componentData.tasksData)
      }
      setBreadcrumbData([
        {
          name: myWorksData[projectModuleIndex].name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true
        },
        {
          name: SEGMENT_TYPES_DISPLAY[segmentData.type] + '' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: false
        },
        {
          name: componentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 3,
          assignmentLevel: assignmentLevel,
          active: true
        },
      ])

    } else if (level === 5 && segIndex != -1 && componentIndex != -1 && subComponentIndex != -1) {
      const segmentData = myWorksData[projectModuleIndex].segmentsData[segIndex];
      const componentData: any = segmentData.componentsData[componentIndex];
      const subComponentData: any = componentData.subComponentsData[subComponentIndex];
      setProjectModuleId(segmentData.projectModuleId);
      setCurrentTasksData(subComponentData.tasksData)

      setBreadcrumbData([
        {
          name: myWorksData[projectModuleIndex].name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true
        },
        {
          name: SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: true
        },
        {
          name: componentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 3,
          assignmentLevel: assignmentLevel,
          active: true
        },
        {
          name: subComponentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 4,
          assignmentLevel: assignmentLevel,
          active: true
        }
      ])

    } else if (level === 6 && taskIndex != -1) {
      const segmentData = myWorksData[projectModuleIndex].segmentsData[segIndex];
      const breadcrumbItems = [{
        name: myWorksData[projectModuleIndex].name,
        projectModuleIndex: projectModuleIndex,
        segIndex: segIndex,
        componentIndex: componentIndex,
        subComponentIndex: subComponentIndex,
        taskIndex: taskIndex,
        level: 2,
        assignmentLevel: assignmentLevel,
        active: true
      },
      {
        name: SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
        projectModuleIndex: projectModuleIndex,
        segIndex: segIndex,
        componentIndex: componentIndex,
        subComponentIndex: subComponentIndex,
        taskIndex: taskIndex,
        level: 0,
        assignmentLevel: assignmentLevel,
        active: true
      }
    ];
      if (componentIndex != -1 && subComponentIndex != -1) {
        const componentData: any = segmentData.componentsData[componentIndex];
        const subComponentData = componentData.subComponentsData[subComponentIndex];
        const taskData: any = [subComponentData.tasksData[taskIndex]];
        setProjectModuleId(segmentData.projectModuleId);
        setCurrentTasksData(taskData)
        breadcrumbItems.push(
          ...[{
            name: componentData.name,
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 3,
            assignmentLevel: assignmentLevel,
            active: true
          },
          {
            name: subComponentData.name,
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 4,
            assignmentLevel: assignmentLevel,
            active: true
          }]
        )
      } else if (componentIndex != -1) {
        const componentData: any = segmentData.componentsData[componentIndex];
        const taskData: any = [componentData.tasksData[taskIndex]];
        setProjectModuleId(segmentData.projectModuleId);
        setCurrentTasksData(taskData)
        breadcrumbItems.push(
          {
            name: componentData.name,
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 3,
            assignmentLevel: assignmentLevel,
            active: true
          });
      } else if (segIndex != -1) {
        setProjectModuleId(segmentData.projectModuleId);
        const taskData: any = [segmentData.tasksData[taskIndex]];
        setCurrentTasksData(taskData)
      }

      breadcrumbItems.push({
        name: 'Tasks',
        projectModuleIndex: projectModuleIndex,
        segIndex: segIndex,
        componentIndex: componentIndex,
        subComponentIndex: subComponentIndex,
        taskIndex: taskIndex,
        level: 0,
        assignmentLevel: assignmentLevel,
        active: false
      });
      setBreadcrumbData(breadcrumbItems)
    }
  }

  const onClickNested = (level: number, data: any) => {
    setSearchText('');
    if (data.projectModuleId) {
      setProjectModuleId(data.projectModuleId);
    }
    setCurrentLevel(level);
    if (level === 3) {
      setCurrentComponentsData(data.componentsData)
      const beadcrumb = breadcrumbData[1];
      beadcrumb.name = SEGMENT_TYPES_DISPLAY[data.type] + ' ' + data.name;
    } else if (level === 4) {
      setProjectModuleId(data.projectModuleId);
      const bcrubm = {
        name: data.name,
        projectModuleIndex: breadcrumbData[0].projectModuleIndex,
        segIndex: breadcrumbData[1].segIndex,
        componentIndex: breadcrumbData[2]?.componentIndex || -1,
        subComponentIndex: breadcrumbData[3]?.subComponentIndex || -1,
        taskIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false
      }
      breadcrumbData.push(bcrubm)
      if (data.subComponentsData && data.subComponentsData.length) {
        setCurrentSubComponentsData(data.subComponentsData)
      } else {
        setCurrentTasksData(data.tasksData)
        breadcrumbData.push({
          name: 'Tasks',
          projectModuleIndex: breadcrumbData[0].projectModuleIndex,
          segIndex: breadcrumbData[1].segIndex,
          componentIndex: breadcrumbData[2]?.componentIndex || -1,
          subComponentIndex: breadcrumbData[3]?.subComponentIndex || -1,
          taskIndex: 0,
          level: 0,
          assignmentLevel: 0,
          active: false
        })
      }
    } else if (level === 5) {
      setCurrentTasksData(data.tasksData)
      const bcrubm = {
        name: data.name,
        projectModuleIndex: breadcrumbData[0].projectModuleIndex,
        segIndex: breadcrumbData[1].segIndex,
        componentIndex: breadcrumbData[2]?.componentIndex || -1,
        subComponentIndex: breadcrumbData[3]?.subComponentIndex || -1,
        taskIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false
      }
      breadcrumbData.push(bcrubm)
      breadcrumbData.push({
        name: 'Tasks',
        projectModuleIndex: breadcrumbData[0].projectModuleIndex,
        segIndex: breadcrumbData[1].segIndex,
        componentIndex: breadcrumbData[2]?.componentIndex || -1,
        subComponentIndex: breadcrumbData[3]?.subComponentIndex || -1,
        taskIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false
      })
    }
  }

  const onSegmentTypeClick = (type: any) => {
    if (segmentsByGroupOnType) {
      onClick(2, -1, breadcrumbData[0].projectModuleIndex, -1, -1, -1, -1, type);
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


  // const chooseImage = () => {
  //   let options = {
  //     title: 'Select Image',
  //     customButtons: [
  //       { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
  //     ],
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };
  //   ImagePicker.showImagePicker(options, (response) => {
  //     console.log('Response = ', response);

  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //       alert(response.customButton);
  //     } else {
  //       const source = { uri: response.uri };

  //       // You can also display the image using data:
  //       // const source = { uri: 'data:image/jpeg;base64,' + response.data };
  //       // alert(JSON.stringify(response));
  //       console.log('response', JSON.stringify(response));
  //       this.setState({
  //         filePath: response,
  //         fileData: response.data,
  //         fileUri: response.uri
  //       });
  //     }
  //   });
  // }
  const getRFIDataByWorkAssignmentId = (task: any) => {
    setRFIDate('');
    setComments('');
    setImageObject(imageObjectEmpty);
    setSelectedTask(task);
    dispatch(getRFIByWaId({
      projectId: loggedInUser.projectId,
      projectModuleId: projectModuleId,
      waId: task.workAssignmentId,
    }));
  }

  const onFillChecklist = (rfiStatus: string) => {
    if (!rfiDate) {
      Alert.alert('Error', 'Date is required.');
      return false;
    }

    if (!comments) {
      Alert.alert('Error', 'Recommendations is required.');
      return false;
    }

    let rfiSubmitDateTime = '';
    let rfiTime = '';
    if (rfiDate) {
      if (timeFormat === 'PM') {
        if (Number(hour) === 12) {
          rfiTime = hour + ':' + minute;
        } else {
          rfiTime = (Number(hour) + 12) + ':' + minute;
        }
      } else {
        if (Number(hour) === 12) {
          rfiTime = '00:' + minute;
        } else {
          rfiTime = hour + ':' + minute;
        }
      }

      rfiSubmitDateTime = rfiDate + ' ' + rfiTime + ":00"
    }

    let checkList = {};

    switch (selectedTask?.name) {
      case TASK_TYPES.CNG_AND_SETTING_OUT:
      case TASK_TYPES.PLACING_OF_SHEATHING_DUCT:
        checkList = {
          taskName: selectedTask.name,
          base64Image: imageObject.fileData,
        }
        break;
      case TASK_TYPES.FORM_WORK:
      case TASK_TYPES.PLACEMENT_OF_INNER_SHUTTERS:
      case TASK_TYPES.PLACEMENT_OF_SIDE_SHUTTERS:
      case TASK_TYPES.PLACEMENT_OF_BOTTOM_SHUTTER:
      case TASK_TYPES.PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER:
        checkList = {
          taskName: selectedTask.name,
          cleanliness: cleanliness,
          formworkAlignmentChecked: formworkAlignmentChecked,
          formworkSealingChecked: formworkSealingChecked,
          formworkdDrawingsChecked: formworkdDrawingsChecked,
          concreteFinishLevelMarked: concreteFinishLevelMarked,
          formworkProperlySupported: formworkProperlySupported,
          formworkFitConcreting: formworkFitConcreting
        }
        break;
      case TASK_TYPES.REINFORCEMENT_PREPARATION:
      case TASK_TYPES.REINFORCEMENT:
        checkList = {
          taskName: selectedTask.name,
          rebarAndDimensionGFC: rebarAndDimensionGFC,
          shapingNoAndLengthOfBarsGFC: shapingNoAndLengthOfBarsGFC,
          rebarsSecurelyTightened: rebarsSecurelyTightened,
          spliceLengthAndLocationGFC: spliceLengthAndLocationGFC,
          rebarWithinToleranceLimit: rebarWithinToleranceLimit,
          couplerArrangementsWithinTolerance: couplerArrangementsWithinTolerance,
          barBendingScheduleChecked: barBendingScheduleChecked,
          spacerBarCheckedGFC: spacerBarCheckedGFC
        }
        break;
      case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
        checkList = {
          taskName: selectedTask.name,
          rebarAndDimensionGFC: rebarAndDimensionGFC,
          shapingNoAndLengthOfBarsGFC: shapingNoAndLengthOfBarsGFC,
          rebarsSecurelyTightened: rebarsSecurelyTightened,
          spliceLengthAndLocationGFC: spliceLengthAndLocationGFC,
          rebarWithinToleranceLimit: rebarWithinToleranceLimit,
          couplerArrangementsWithinTolerance: couplerArrangementsWithinTolerance,
          barBendingScheduleChecked: barBendingScheduleChecked,
        }
        break;
      case TASK_TYPES.EXCAVATION:
        checkList = {
          taskName: selectedTask.name,
          quantity: quantity
        }
        break;
      case TASK_TYPES.REMOVAL_OF_SHUTTER:
      case TASK_TYPES.REMOVAL_OF_SHUTTERS:
        checkList = {
          taskName: selectedTask.name,
          concreteHasAchievedDesiredStrength: concreteHasAchievedDesiredStrength,
          minimumTimeHasBeenAttained: minimumTimeHasBeenAttained
        }
        break;
      case TASK_TYPES.THREADING_OF_PRE_STRESSING_STRANDS:
        checkList = {
          taskName: selectedTask.name,
        }
        break;
      case TASK_TYPES.CAGE_LOWERING:
        checkList = {
          taskName: selectedTask.name,
          plieShaftCleanedLooseMaterial: plieShaftCleanedLooseMaterial,
          suitableSpacerProvidedToMaintainCoverToSteel: suitableSpacerProvidedToMaintainCoverToSteel,
          noLBendBottomOfTheCageChecked: noLBendBottomOfTheCageChecked
        }
        break;
      case TASK_TYPES.CONCRETING:
        concreteData.forEach((item: any) => {
          delete item.key;
          item.concreteTemp = Number(item.concreteTemp),
          item.slumpValue = Number(item.slumpValue),
          item.noOfCubesCasted = Number(item.noOfCubesCasted),
          item.concretePoured = Number(item.concretePoured)
        })
        checkList = {
          taskName: selectedTask.name,
          concreteData: concreteData
        }
        break;
      default:
        break;
    }
    
    dispatch(fillRFIsChecklist({
      projectId: loggedInUser.projectId,
      projectModuleId: projectModuleId,
      rfiId: rfiId,
      status: rfiStatus,
      body: {
        checkList: checkList,
        additionalData: {
          comments: comments,
          rfiSubmitDateTime: rfiSubmitDateTime
        }
      },
    }));
  }

  const launchCamera = () => {
    let options = {
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        const responseImage = response.assets?.length ? response.assets[0] : response.assets ? response.assets : response;

        setImageObject({
          filePath: responseImage,
          fileData: responseImage.base64,
          fileUri: responseImage.uri
        });
      }
    });

  }

  const launchImageLibrary = () => {
    let options = {
      includeBase64: true,
      maxWidth: 1024,
      maxHeight: 768,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response: any) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {

        const responseImage = response.assets?.length ? response.assets[0] : response.assets ? response.assets : response;

        setImageObject({
          filePath: responseImage,
          fileData: responseImage.base64,
          fileUri: responseImage.uri
        });
      }
    });

  }

  const renderFileData = () => {
    if (imageObject.fileData) {
      return <Image source={{ uri: 'data:image/jpeg;base64,' + imageObject.fileData }}
        style={styles.images}
      />
    } else {
      return <Image source={require('./../../images/dummy.png')} // ./assets/dummy.png
        style={styles.images}
      />
    }
  }

  const renderFileUri = () => {
    if (imageObject.fileUri) {
      return <Image
        source={{ uri: imageObject.fileUri }}
        style={styles.images}
      />
    } else {
      return <Image
        source={require('./../../images/galeryImages.jpg')} // ./assets/galeryImages.jpg
        style={styles.images}
      />
    }
  }

  const openCloseCalendar = () => {
    setOpenCalendar(!openCalendar);
    // if (!openCalendar) {
    //   setLayoutHeight(DEFAULT_COMPONENT_HEIGHT + DEFAULT_CALENDAR_HEIGHT)
    // } else {
    //   setLayoutHeight(DEFAULT_COMPONENT_HEIGHT)
    // }
  }

  const getHours = () => {
    let hours = [];
    for (let i = 1; i <= 12; i++) {
      hours.push({
        label: i < 10 ? '0' + i : '' + i,
        value: i < 10 ? '0' + i : '' + i
      });
    }
    setHours(hours);
  }

  const getMins = () => {
    let mins = [];
    for (let i = 0; i < 60; i = i + 10) {
      mins.push({
        label: i < 10 ? '0' + i : '' + i,
        value: i < 10 ? '0' + i : '' + i
      });
    }
    setMinutes(mins);
  }

  const getTimeFormats = () => {
    setTimeFormats([{
      label: 'AM',
      value: 'AM'
    }, {
      label: 'PM',
      value: 'PM'
    }]);
  }

  const onAddMoreConcrete = () => {
    setConcreteData([...concreteData, {
      vehicleNo: '',
      timeOfArrival: 'N',
      gradeOfConcrete: 'Y',
      concreteTemp: 0,
      slumpValue: 0,
      noOfCubesCasted: 0,
      concreteStartTime: '',
      concretePoured: 0,
      concreteFinishTime: '',
      key: Guid.create()
    }])
  }

  // Function to render each list item 
  const renderItem = (rowData: any) => (
    <View style={{ flexDirection: 'row', backgroundColor: 'red' }}>
      <View>
        <Text>TM {rowData.index + 1}</Text>
      </View>
      <View>
        <CustomTextInput rowItem={rowData.item}
          fieldName={'vehicleNo'}></CustomTextInput>
      </View>
      <View>
        <CustomDropdownPicker items={YES_NO_LIST}
          rowItem={rowData.item}
          fieldName={'timeOfArrival'}
        />
      </View>
      <View>
      <CustomDropdownPicker items={YES_NO_LIST}
          rowItem={rowData.item}
          fieldName={'gradeOfConcrete'}
        />
      </View>
      <View>
        <CustomTextInput rowItem={rowData.item}
          fieldName={'concreteTemp'}></CustomTextInput>
      </View>
      <View>
        <CustomTextInput rowItem={rowData.item}
          fieldName={'slumpValue'}></CustomTextInput>
      </View>
      <View>
        <CustomTextInput rowItem={rowData.item}
          fieldName={'noOfCubesCasted'}></CustomTextInput>
      </View>
      <View>
      <CustomDropdownPicker items={YES_NO_LIST}
          rowItem={rowData.item}
          fieldName={'concreteStartTime'}
        />
      </View>
      <View>
        <CustomTextInput rowItem={rowData.item}
          fieldName={'concretePoured'}></CustomTextInput>
      </View>
      <View>
      <CustomDropdownPicker items={YES_NO_LIST}
          rowItem={rowData.item}
          fieldName={'concreteFinishTime'}
        />
      </View>
        
      </View>
);

// Function to close a swiped row 
const closeRow = (rowMap: any, rowKey: any) => {
  if (rowMap[rowKey]) { 
      rowMap[rowKey].closeRow(); 
  } 
}; 

// Function to delete an item from the list 
const deleteItem = (rowMap: any, rowKey: any) => { 
  closeRow(rowMap, rowKey); 
  const newData = [...concreteData]; 
  const prevIndex = concreteData 
      .findIndex(item => item.gradeOfConcrete === rowKey); 
  newData.splice(prevIndex, 1); 
  setConcreteData(newData); 
}; 

// Function to handle row open event 
const onRowOpen = (rowKey: any) => { 
  console.log('Opened row with key:', rowKey); 
}; 

// Function to render hidden swipe actions 
const renderHiddenItem = (rowData: any, rowMap: any) => ( 
    <View style={styles.hiddenContainer}> 
        <TouchableOpacity 
            style={[styles.hiddenButton, styles.closeButton]} 
            onPress={() => closeRow(rowMap, rowData.item.key)} 
        > 
            <Text style={styles.buttonText}>Close</Text> 
        </TouchableOpacity> 
        <TouchableOpacity 
            style={[styles.hiddenButton, styles.deleteButton]} 
            onPress={() => deleteItem(rowMap, rowData.item.key)} 
        > 
            <Text style={styles.buttonText}>Delete</Text> 
        </TouchableOpacity> 
    </View> 
);

const renderSectionHeader = (rowData: any) => {
  return (
    <View>
      <View>
        <Text>TM No.</Text>
      </View>
      <View>
      <Text>Last 4 digits of Vehicle No.</Text>
      </View>
      <View>
        <Text>Time of arrival</Text>
      </View>
      <View>
        <Text>Grade of Concrete</Text>
      </View>
      <View>
        <Text>Concrete temp in C</Text>
      </View>
      <View>
        <Text>Slump value in mm</Text>
      </View>
      <View>
        <Text>No of cubes casted</Text>
      </View>
      <View>
        <Text>Concrete start time</Text>
      </View>
      <View>
        <Text>Concrete poured in cum</Text>
      </View>
      <View>
        <Text>Concrete finish time</Text>
      </View>
  </View>
  )
}

const [enableScroll, setEnableScroll] = useState(true);
const onSwipeValueChange = (data: any) => {
  if (data.value < 0) {
    setEnableScroll(false);
  } else {
    setEnableScroll(true);
  }

}

  const taskForm = (taskName: any) => {
    switch (taskName) {

      case TASK_TYPES.CNG_AND_SETTING_OUT:
      case TASK_TYPES.PLACING_OF_SHEATHING_DUCT:
        return <View>
        <Text style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }} >Pick Image from Camera & Gallery</Text>
        <View style={styles.ImageSections}>
          <View>
            {imageObject?.fileData && renderFileData()}
            {/* <Text style={{ textAlign: 'center' }}>Base 64 String</Text> */}
          </View>
          {/* <View>
          {imageObject?.fileUri && renderFileUri()}
          <Text style={{ textAlign: 'center' }}>File Uri</Text>
        </View> */}
        </View>

        <View style={[styles.btnParentSection, { flexDirection: 'row', gap: 20, justifyContent: 'center' }]}>

          <TouchableOpacity onPress={launchCamera} style={styles.btnSection}  >
            <Text style={styles.btnText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={launchImageLibrary} style={styles.btnSection}  >
            <Text style={styles.btnText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Date</Text>

            <View style={{ flexDirection: 'row' }}>
              <TextInput
                style={styles.inputStyle}
                placeholder=""
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
                value={rfiDate ? moment(new Date(rfiDate)).format('DD-MM-YYYY') : ''}
                editable={false}
              />
              <TouchableOpacity onPress={() => openCloseCalendar()} style={{ width: 40, backgroundColor: "#ccc" }}>
                <Text style={styles.assignTagButtonText}>Icon</Text>
              </TouchableOpacity>
            </View>
          </View>

          {openCalendar && (

            <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 10 }}>
              <CalendarPicker width={width - 40}
                initialDate={rfiDate ? new Date(rfiDate) : new Date()}
                onDateChange={(date) => {
                  setRFIDate(date.format("YYYY-MM-DD"));
                  openCloseCalendar()
                }}
              />
            </View>
          )}

          <View style={{ flexDirection: 'column', height: 80, paddingTop: 15, zIndex: 5, marginBottom: 140 }}>
            <Text style={styles.GenerateRFIFieldLabel}>Time</Text>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <View style={{ width: 80, height: 90 }}>
                <DropDownPicker onPress={() => {
                  setOpenMinutes(false);
                  setOpenTimeFormats(false);
                }}
                  dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                  maxHeight={75}
                  zIndex={1000}
                  listMode='MODAL'
                  open={openHours}
                  value={hour}
                  items={hours}
                  setOpen={setOpenHours}
                  setValue={setHour}
                />
              </View>

              <View style={{ width: 80, height: 90 }}>
                <DropDownPicker onPress={() => {
                  setOpenHours(false);
                  setOpenTimeFormats(false);
                }}
                  dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                  maxHeight={75}
                  zIndex={1000}
                  listMode='MODAL'
                  open={openMinutes}
                  value={minute}
                  items={minutes}
                  setOpen={setOpenMinutes}
                  setValue={setMinute}
                />
              </View>
              <View style={{ width: 80, height: 90 }}>
                <DropDownPicker onPress={() => {
                  setOpenHours(false);
                  setOpenMinutes(false);
                }}
                  dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                  maxHeight={75}
                  zIndex={1000}
                  listMode='SCROLLVIEW'
                  open={openTimeFormats}
                  value={timeFormat}
                  items={timeFormats}
                  setOpen={setOpenTimeFormats}
                  setValue={setTimeFormat}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'column', height: 65 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Recommendations</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Recommendations"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
                value={comments}
                onChangeText={(text) => {
                  setComments(text);
                }}
              />
            </View>
          </View>
        </View>

      </View>
      case TASK_TYPES.FORM_WORK:
      case TASK_TYPES.PLACEMENT_OF_INNER_SHUTTERS:
      case TASK_TYPES.PLACEMENT_OF_SIDE_SHUTTERS:
      case TASK_TYPES.PLACEMENT_OF_BOTTOM_SHUTTER:
      case TASK_TYPES.PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER:
        return <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Cleanliness and Oil application checked</Text>
            <View style={[styles.SectionStyle, { zIndex: 16, height: 50 }]}>
              <DropDownPicker
                open={openCleanliness}
                value={cleanliness}
                items={YES_NO_LIST}
                setOpen={setOpenCleanliness}
                setValue={setCleanliness}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Formwork alignment checked</Text>
            <View style={[styles.SectionStyle, { zIndex: 15, height: 50 }]}>
              <DropDownPicker
                open={openFormworkAlignmentChecked}
                value={formworkAlignmentChecked}
                items={YES_NO_LIST}
                setOpen={setOpenFormworkAlignmentChecked}
                setValue={setFormworkAlignmentChecked}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Formwork tightness/sealing checked</Text>
            <View style={[styles.SectionStyle, { zIndex: 14, height: 50 }]}>
              <DropDownPicker
                open={openFormworkSealingChecked}
                value={formworkSealingChecked}
                items={YES_NO_NA_LIST}
                setOpen={setOpenFormworkSealingChecked}
                setValue={setFormworkSealingChecked}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Required covers provided as per drawings checked</Text>
            <View style={[styles.SectionStyle, { zIndex: 13, height: 50 }]}>
              <DropDownPicker
                open={openFormworkdDrawingsChecked}
                value={formworkdDrawingsChecked}
                items={YES_NO_LIST}
                setOpen={setOpenFormworkdDrawingsChecked}
                setValue={setFormworkdDrawingsChecked}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Concrete finish level marked</Text>
            <View style={[styles.SectionStyle, { zIndex: 12, height: 50 }]}>
              <DropDownPicker
                open={openConcreteFinishLevelMarked}
                value={concreteFinishLevelMarked}
                items={YES_NO_LIST}
                setOpen={setOpenConcreteFinishLevelMarked}
                setValue={setConcreteFinishLevelMarked}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Formwork properly supported</Text>
            <View style={[styles.SectionStyle, { zIndex: 11, height: 50 }]}>
              <DropDownPicker
                open={openFormworkProperlySupported}
                value={formworkProperlySupported}
                items={YES_NO_NA_LIST}
                setOpen={setOpenFormworkProperlySupported}
                setValue={setFormworkProperlySupported}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Formwork fit for concreting</Text>
            <View style={[styles.SectionStyle, { zIndex: 10, height: 50 }]}>
              <DropDownPicker
                open={openFormworkFitConcreting}
                value={formworkFitConcreting}
                items={YES_NO_NA_LIST}
                setOpen={setOpenFormworkFitConcreting}
                setValue={setFormworkFitConcreting}
              />
            </View>
          </View>
          
          <View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.GenerateRFIFieldLabel}>Date</Text>

              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder=""
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={rfiDate ? moment(new Date(rfiDate)).format('DD-MM-YYYY') : ''}
                  editable={false}
                />
                <TouchableOpacity onPress={() => openCloseCalendar()} style={{ width: 40, backgroundColor: "#ccc" }}>
                  <Text style={styles.assignTagButtonText}>Icon</Text>
                </TouchableOpacity>
              </View>
            </View>

            {openCalendar && (

              <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 10 }}>
                <CalendarPicker width={width - 40}
                  initialDate={rfiDate ? new Date(rfiDate) : new Date()}
                  onDateChange={(date) => {
                    setRFIDate(date.format("YYYY-MM-DD"));
                    openCloseCalendar()
                  }}
                />
              </View>
            )}

            <View style={{ flexDirection: 'column', height: 80, paddingTop: 15, zIndex: 5, marginBottom: 140 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Time</Text>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenMinutes(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openHours}
                    value={hour}
                    items={hours}
                    setOpen={setOpenHours}
                    setValue={setHour}
                  />
                </View>

                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openMinutes}
                    value={minute}
                    items={minutes}
                    setOpen={setOpenMinutes}
                    setValue={setMinute}
                  />
                </View>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenMinutes(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='SCROLLVIEW'
                    open={openTimeFormats}
                    value={timeFormat}
                    items={timeFormats}
                    setOpen={setOpenTimeFormats}
                    setValue={setTimeFormat}
                  />
                </View>
              </View>
              
              <View style={{ flexDirection: 'column', height: 65 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Recommendations</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Recommendations"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
                value={comments}
                onChangeText={(text) => {
                  setComments(text);
                }}
              />
            </View>
            </View>
          </View>

          
        </View>
      case TASK_TYPES.REINFORCEMENT:
      case TASK_TYPES.REINFORCEMENT_PREPARATION:
        return <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Rebar and dimension (dia,len and shape) checked as per GFC</Text>
            <View style={[styles.SectionStyle, { zIndex: 16, height: 50 }]}>
              <DropDownPicker
                open={openRebarAndDimensionGFC}
                value={rebarAndDimensionGFC}
                items={YES_NO_LIST}
                setOpen={setOpenRebarAndDimensionGFC}
                setValue={setRebarAndDimensionGFC}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Shaping, No and Length of Bars checked as per GFC</Text>
            <View style={[styles.SectionStyle, { zIndex: 15, height: 50 }]}>
              <DropDownPicker
                open={openShapingNoAndLengthOfBarsGFC}
                value={shapingNoAndLengthOfBarsGFC}
                items={YES_NO_LIST}
                setOpen={setOpenShapingNoAndLengthOfBarsGFC}
                setValue={setShapingNoAndLengthOfBarsGFC}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Rebars securely tightened/bound by tie bars</Text>
            <View style={[styles.SectionStyle, { zIndex: 14, height: 50 }]}>
              <DropDownPicker
                open={openRebarsSecurelyTightened}
                value={rebarsSecurelyTightened}
                items={YES_NO_NA_LIST}
                setOpen={setOpenRebarsSecurelyTightened}
                setValue={setRebarsSecurelyTightened}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Splice length and location checked as per GFC</Text>
            <View style={[styles.SectionStyle, { zIndex: 13, height: 50 }]}>
              <DropDownPicker
                open={openSpliceLengthAndLocationGFC}
                value={spliceLengthAndLocationGFC}
                items={YES_NO_LIST}
                setOpen={setOpenSpliceLengthAndLocationGFC}
                setValue={setSpliceLengthAndLocationGFC}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Rebar within tolerance limit</Text>
            <View style={[styles.SectionStyle, { zIndex: 12, height: 50 }]}>
              <DropDownPicker
                open={openRebarWithinToleranceLimit}
                value={rebarWithinToleranceLimit}
                items={YES_NO_LIST}
                setOpen={setOpenRebarWithinToleranceLimit}
                setValue={setRebarWithinToleranceLimit}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Coupler arrangements within tolerance</Text>
            <View style={[styles.SectionStyle, { zIndex: 11, height: 50 }]}>
              <DropDownPicker
                open={openCouplerArrangementsWithinTolerance}
                value={couplerArrangementsWithinTolerance}
                items={YES_NO_NA_LIST}
                setOpen={setOpenCouplerArrangementsWithinTolerance}
                setValue={setCouplerArrangementsWithinTolerance}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Bar Bending schedule checked</Text>
            <View style={[styles.SectionStyle, { zIndex: 10, height: 50 }]}>
              <DropDownPicker
                open={openBarBendingScheduleChecked}
                value={barBendingScheduleChecked}
                items={YES_NO_NA_LIST}
                setOpen={setOpenBarBendingScheduleChecked}
                setValue={setBarBendingScheduleChecked}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Spacer bar checked as per GFC</Text>
            <View style={[styles.SectionStyle, { zIndex: 9, height: 50 }]}>
              <DropDownPicker
                open={openSpacerBarCheckedGFC}
                value={spacerBarCheckedGFC}
                items={YES_NO_NA_LIST}
                setOpen={setOpenSpacerBarCheckedGFC}
                setValue={setSpacerBarCheckedGFC}
              />
            </View>
          </View>
          
          <View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.GenerateRFIFieldLabel}>Date</Text>

              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder=""
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={rfiDate ? moment(new Date(rfiDate)).format('DD-MM-YYYY') : ''}
                  editable={false}
                />
                <TouchableOpacity onPress={() => openCloseCalendar()} style={{ width: 40, backgroundColor: "#ccc" }}>
                  <Text style={styles.assignTagButtonText}>Icon</Text>
                </TouchableOpacity>
              </View>
            </View>

            {openCalendar && (

              <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 10 }}>
                <CalendarPicker width={width - 40}
                  initialDate={rfiDate ? new Date(rfiDate) : new Date()}
                  onDateChange={(date) => {
                    setRFIDate(date.format("YYYY-MM-DD"));
                    openCloseCalendar()
                  }}
                />
              </View>
            )}

            <View style={{ flexDirection: 'column', height: 80, paddingTop: 15, zIndex: 5, marginBottom: 140 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Time</Text>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenMinutes(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openHours}
                    value={hour}
                    items={hours}
                    setOpen={setOpenHours}
                    setValue={setHour}
                  />
                </View>

                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openMinutes}
                    value={minute}
                    items={minutes}
                    setOpen={setOpenMinutes}
                    setValue={setMinute}
                  />
                </View>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenMinutes(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='SCROLLVIEW'
                    open={openTimeFormats}
                    value={timeFormat}
                    items={timeFormats}
                    setOpen={setOpenTimeFormats}
                    setValue={setTimeFormat}
                  />
                </View>
              </View>
              
              <View style={{ flexDirection: 'column', height: 65 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Recommendations</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Recommendations"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
                value={comments}
                onChangeText={(text) => {
                  setComments(text);
                }}
              />
            </View>
            </View>
          </View>

          
        </View>
      case TASK_TYPES.REINFORCEMENT_PREPARATION:
        return <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Rebar and dimension (dia,len and shape) checked as per GFC</Text>
            <View style={[styles.SectionStyle, { zIndex: 16, height: 50 }]}>
              <DropDownPicker
                open={openRebarAndDimensionGFC}
                value={rebarAndDimensionGFC}
                items={YES_NO_LIST}
                setOpen={setOpenRebarAndDimensionGFC}
                setValue={setRebarAndDimensionGFC}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Shaping, No and Length of Bars checked as per GFC</Text>
            <View style={[styles.SectionStyle, { zIndex: 15, height: 50 }]}>
              <DropDownPicker
                open={openShapingNoAndLengthOfBarsGFC}
                value={shapingNoAndLengthOfBarsGFC}
                items={YES_NO_LIST}
                setOpen={setOpenShapingNoAndLengthOfBarsGFC}
                setValue={setShapingNoAndLengthOfBarsGFC}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Rebars securely tightened/bound by tie bars</Text>
            <View style={[styles.SectionStyle, { zIndex: 14, height: 50 }]}>
              <DropDownPicker
                open={openRebarsSecurelyTightened}
                value={rebarsSecurelyTightened}
                items={YES_NO_NA_LIST}
                setOpen={setOpenRebarsSecurelyTightened}
                setValue={setRebarsSecurelyTightened}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Splice length and location checked as per GFC</Text>
            <View style={[styles.SectionStyle, { zIndex: 13, height: 50 }]}>
              <DropDownPicker
                open={openSpliceLengthAndLocationGFC}
                value={spliceLengthAndLocationGFC}
                items={YES_NO_LIST}
                setOpen={setOpenSpliceLengthAndLocationGFC}
                setValue={setSpliceLengthAndLocationGFC}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Rebar within tolerance limit</Text>
            <View style={[styles.SectionStyle, { zIndex: 12, height: 50 }]}>
              <DropDownPicker
                open={openRebarWithinToleranceLimit}
                value={rebarWithinToleranceLimit}
                items={YES_NO_LIST}
                setOpen={setOpenRebarWithinToleranceLimit}
                setValue={setRebarWithinToleranceLimit}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Coupler arrangements within tolerance</Text>
            <View style={[styles.SectionStyle, { zIndex: 11, height: 50 }]}>
              <DropDownPicker
                open={openCouplerArrangementsWithinTolerance}
                value={couplerArrangementsWithinTolerance}
                items={YES_NO_NA_LIST}
                setOpen={setOpenCouplerArrangementsWithinTolerance}
                setValue={setCouplerArrangementsWithinTolerance}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Bar Bending schedule checked</Text>
            <View style={[styles.SectionStyle, { zIndex: 10, height: 50 }]}>
              <DropDownPicker
                open={openBarBendingScheduleChecked}
                value={barBendingScheduleChecked}
                items={YES_NO_NA_LIST}
                setOpen={setOpenBarBendingScheduleChecked}
                setValue={setBarBendingScheduleChecked}
              />
            </View>
          </View>
          
          <View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.GenerateRFIFieldLabel}>Date</Text>

              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder=""
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={rfiDate ? moment(new Date(rfiDate)).format('DD-MM-YYYY') : ''}
                  editable={false}
                />
                <TouchableOpacity onPress={() => openCloseCalendar()} style={{ width: 40, backgroundColor: "#ccc" }}>
                  <Text style={styles.assignTagButtonText}>Icon</Text>
                </TouchableOpacity>
              </View>
            </View>

            {openCalendar && (

              <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 10 }}>
                <CalendarPicker width={width - 40}
                  initialDate={rfiDate ? new Date(rfiDate) : new Date()}
                  onDateChange={(date) => {
                    setRFIDate(date.format("YYYY-MM-DD"));
                    openCloseCalendar()
                  }}
                />
              </View>
            )}

            <View style={{ flexDirection: 'column', height: 80, paddingTop: 15, zIndex: 5, marginBottom: 140 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Time</Text>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenMinutes(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openHours}
                    value={hour}
                    items={hours}
                    setOpen={setOpenHours}
                    setValue={setHour}
                  />
                </View>

                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openMinutes}
                    value={minute}
                    items={minutes}
                    setOpen={setOpenMinutes}
                    setValue={setMinute}
                  />
                </View>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenMinutes(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='SCROLLVIEW'
                    open={openTimeFormats}
                    value={timeFormat}
                    items={timeFormats}
                    setOpen={setOpenTimeFormats}
                    setValue={setTimeFormat}
                  />
                </View>
              </View>
              
              <View style={{ flexDirection: 'column', height: 65 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Recommendations</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Recommendations"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
                value={comments}
                onChangeText={(text) => {
                  setComments(text);
                }}
              />
            </View>
            </View>
          </View>

          
        </View>
      case TASK_TYPES.EXCAVATION:
        return <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Qty of earth work excavated in cum</Text>
            <View style={[styles.SectionStyle, { zIndex: 16, height: 50 }]}>
            <TextInput
                  style={styles.inputStyle}
                  placeholder="Quantity"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={''+quantity}
                  onChangeText={(text) => {
                    let exp = text.replace(/[^0-9.]/g, '')
                    if(!isNaN(parseFloat(exp))) {
                      if (exp.split('.').length > 4) {
                        exp = parseFloat(exp).toString();
                      }
                      setQuantity(Number(exp));
                    } else {
                      setQuantity(0);
                    }
                  }}
                />
            </View>
          </View>
          
          <View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.GenerateRFIFieldLabel}>Date</Text>

              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder=""
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={rfiDate ? moment(new Date(rfiDate)).format('DD-MM-YYYY') : ''}
                  editable={false}
                />
                <TouchableOpacity onPress={() => openCloseCalendar()} style={{ width: 40, backgroundColor: "#ccc" }}>
                  <Text style={styles.assignTagButtonText}>Icon</Text>
                </TouchableOpacity>
              </View>
            </View>

            {openCalendar && (

              <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 10 }}>
                <CalendarPicker width={width - 40}
                  initialDate={rfiDate ? new Date(rfiDate) : new Date()}
                  onDateChange={(date) => {
                    setRFIDate(date.format("YYYY-MM-DD"));
                    openCloseCalendar()
                  }}
                />
              </View>
            )}

            <View style={{ flexDirection: 'column', height: 80, paddingTop: 15, zIndex: 5, marginBottom: 140 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Time</Text>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenMinutes(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openHours}
                    value={hour}
                    items={hours}
                    setOpen={setOpenHours}
                    setValue={setHour}
                  />
                </View>

                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openMinutes}
                    value={minute}
                    items={minutes}
                    setOpen={setOpenMinutes}
                    setValue={setMinute}
                  />
                </View>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenMinutes(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='SCROLLVIEW'
                    open={openTimeFormats}
                    value={timeFormat}
                    items={timeFormats}
                    setOpen={setOpenTimeFormats}
                    setValue={setTimeFormat}
                  />
                </View>
              </View>
              
              <View style={{ flexDirection: 'column', height: 65 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Recommendations</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Recommendations"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
                value={comments}
                onChangeText={(text) => {
                  setComments(text);
                }}
              />
            </View>
            </View>
          </View>

          
        </View>
      case TASK_TYPES.REMOVAL_OF_SHUTTER:
      case TASK_TYPES.REMOVAL_OF_SHUTTERS:
        return <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Whether concrete has achieved desired strength</Text>
            <View style={[styles.SectionStyle, { zIndex: 16, height: 50 }]}>
              <DropDownPicker
                open={openConcreteHasAchievedDesiredStrength}
                value={concreteHasAchievedDesiredStrength}
                items={YES_NO_LIST}
                setOpen={setOpenConcreteHasAchievedDesiredStrength}
                setValue={setConcreteHasAchievedDesiredStrength}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Whether minimum time has been attained</Text>
            <View style={[styles.SectionStyle, { zIndex: 15, height: 50 }]}>
              <DropDownPicker
                open={openMinimumTimeHasBeenAttained}
                value={minimumTimeHasBeenAttained}
                items={YES_NO_LIST}
                setOpen={setOpenMinimumTimeHasBeenAttained}
                setValue={setMinimumTimeHasBeenAttained}
              />
            </View>
          </View>
          <View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.GenerateRFIFieldLabel}>Date</Text>

              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder=""
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={rfiDate ? moment(new Date(rfiDate)).format('DD-MM-YYYY') : ''}
                  editable={false}
                />
                <TouchableOpacity onPress={() => openCloseCalendar()} style={{ width: 40, backgroundColor: "#ccc" }}>
                  <Text style={styles.assignTagButtonText}>Icon</Text>
                </TouchableOpacity>
              </View>
            </View>

            {openCalendar && (

              <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 10 }}>
                <CalendarPicker width={width - 40}
                  initialDate={rfiDate ? new Date(rfiDate) : new Date()}
                  onDateChange={(date) => {
                    setRFIDate(date.format("YYYY-MM-DD"));
                    openCloseCalendar()
                  }}
                />
              </View>
            )}

            <View style={{ flexDirection: 'column', height: 80, paddingTop: 15, zIndex: 5, marginBottom: 140 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Time</Text>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenMinutes(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openHours}
                    value={hour}
                    items={hours}
                    setOpen={setOpenHours}
                    setValue={setHour}
                  />
                </View>

                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openMinutes}
                    value={minute}
                    items={minutes}
                    setOpen={setOpenMinutes}
                    setValue={setMinute}
                  />
                </View>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenMinutes(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='SCROLLVIEW'
                    open={openTimeFormats}
                    value={timeFormat}
                    items={timeFormats}
                    setOpen={setOpenTimeFormats}
                    setValue={setTimeFormat}
                  />
                </View>
              </View>
              
              <View style={{ flexDirection: 'column', height: 65 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Recommendations</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Recommendations"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
                value={comments}
                onChangeText={(text) => {
                  setComments(text);
                }}
              />
            </View>
            </View>
          </View>

          
        </View>
      case TASK_TYPES.THREADING_OF_PRE_STRESSING_STRANDS:
        return <View>
          <View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.GenerateRFIFieldLabel}>Date</Text>

              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder=""
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={rfiDate ? moment(new Date(rfiDate)).format('DD-MM-YYYY') : ''}
                  editable={false}
                />
                <TouchableOpacity onPress={() => openCloseCalendar()} style={{ width: 40, backgroundColor: "#ccc" }}>
                  <Text style={styles.assignTagButtonText}>Icon</Text>
                </TouchableOpacity>
              </View>
            </View>

            {openCalendar && (

              <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 10 }}>
                <CalendarPicker width={width - 40}
                  initialDate={rfiDate ? new Date(rfiDate) : new Date()}
                  onDateChange={(date) => {
                    setRFIDate(date.format("YYYY-MM-DD"));
                    openCloseCalendar()
                  }}
                />
              </View>
            )}

            <View style={{ flexDirection: 'column', height: 80, paddingTop: 15, zIndex: 5, marginBottom: 140 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Time</Text>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenMinutes(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openHours}
                    value={hour}
                    items={hours}
                    setOpen={setOpenHours}
                    setValue={setHour}
                  />
                </View>

                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openMinutes}
                    value={minute}
                    items={minutes}
                    setOpen={setOpenMinutes}
                    setValue={setMinute}
                  />
                </View>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenMinutes(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='SCROLLVIEW'
                    open={openTimeFormats}
                    value={timeFormat}
                    items={timeFormats}
                    setOpen={setOpenTimeFormats}
                    setValue={setTimeFormat}
                  />
                </View>
              </View>
              
              <View style={{ flexDirection: 'column', height: 65 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Recommendations</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Recommendations"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
                value={comments}
                onChangeText={(text) => {
                  setComments(text);
                }}
              />
            </View>
            </View>
          </View>

          
        </View>
      case TASK_TYPES.CAGE_LOWERING:
        return <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Plie shaft cleaned of all loose material or not</Text>
            <View style={[styles.SectionStyle, { zIndex: 16, height: 50 }]}>
              <DropDownPicker
                open={openPlieShaftCleanedLooseMaterial}
                value={plieShaftCleanedLooseMaterial}
                items={YES_NO_LIST}
                setOpen={setOpenPlieShaftCleanedLooseMaterial}
                setValue={setPlieShaftCleanedLooseMaterial}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Suitable spacer provided to maintain the required cover to steel </Text>
            <View style={[styles.SectionStyle, { zIndex: 15, height: 50 }]}>
              <DropDownPicker
                open={openSuitableSpacerProvidedToMaintainCoverToSteel}
                value={suitableSpacerProvidedToMaintainCoverToSteel}
                items={YES_NO_LIST}
                setOpen={setOpenSuitableSpacerProvidedToMaintainCoverToSteel}
                setValue={setSuitableSpacerProvidedToMaintainCoverToSteel}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>No L bend at the bottom of the Cage checked or not </Text>
            <View style={[styles.SectionStyle, { zIndex: 15, height: 50 }]}>
              <DropDownPicker
                open={openNoLBendBottomOfTheCageChecked}
                value={noLBendBottomOfTheCageChecked}
                items={YES_NO_NA_LIST}
                setOpen={setOpenNoLBendBottomOfTheCageChecked}
                setValue={setNoLBendBottomOfTheCageChecked}
              />
            </View>
          </View>

          <View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.GenerateRFIFieldLabel}>Date</Text>

              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder=""
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={rfiDate ? moment(new Date(rfiDate)).format('DD-MM-YYYY') : ''}
                  editable={false}
                />
                <TouchableOpacity onPress={() => openCloseCalendar()} style={{ width: 40, backgroundColor: "#ccc" }}>
                  <Text style={styles.assignTagButtonText}>Icon</Text>
                </TouchableOpacity>
              </View>
            </View>

            {openCalendar && (

              <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 10 }}>
                <CalendarPicker width={width - 40}
                  initialDate={rfiDate ? new Date(rfiDate) : new Date()}
                  onDateChange={(date) => {
                    setRFIDate(date.format("YYYY-MM-DD"));
                    openCloseCalendar()
                  }}
                />
              </View>
            )}

            <View style={{ flexDirection: 'column', height: 80, paddingTop: 15, zIndex: 5, marginBottom: 140 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Time</Text>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenMinutes(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openHours}
                    value={hour}
                    items={hours}
                    setOpen={setOpenHours}
                    setValue={setHour}
                  />
                </View>

                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openMinutes}
                    value={minute}
                    items={minutes}
                    setOpen={setOpenMinutes}
                    setValue={setMinute}
                  />
                </View>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenMinutes(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='SCROLLVIEW'
                    open={openTimeFormats}
                    value={timeFormat}
                    items={timeFormats}
                    setOpen={setOpenTimeFormats}
                    setValue={setTimeFormat}
                  />
                </View>
              </View>
              
              <View style={{ flexDirection: 'column', height: 65 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Recommendations</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Recommendations"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
                value={comments}
                onChangeText={(text) => {
                  setComments(text);
                }}
              />
            </View>
            </View>
          </View>
        </View>





      case TASK_TYPES.CONCRETING:
        if (!concreteData || !concreteData.length) {
          setConcreteData([{
            vehicleNo: '',
            timeOfArrival: '',
            gradeOfConcrete:'',
            concreteTemp: 0,
            slumpValue: 0,
            noOfCubesCasted: 0,
            concreteStartTime: '',
            concretePoured: 0,
            concreteFinishTime: '',
            key: Guid.create()
          }])

        }
        return <View>
          <ScrollView id='scrollViewConcrete' horizontal={enableScroll}>
          <View style={{ flexDirection: 'column', padding: 10, borderBlockColor: '#cccccc', borderStyle: 'solid', borderWidth: 1}}>
            {
              <SwipeListView 
                data={concreteData} 
                renderItem={renderItem} 
                renderHiddenItem={renderHiddenItem} 
                renderSectionHeader={renderSectionHeader}
                leftOpenValue={0} 
                rightOpenValue={-430} 
                previewRowKey={'0'} 
                previewOpenValue={-40} 
                previewOpenDelay={3000} 
                onRowDidOpen={onRowOpen}
                style={{zIndex: 10}}
                automaticallyAdjustContentInsets={true}
                scrollEnabled={false}
                onSwipeValueChange={onSwipeValueChange}
            /> 
            
            }
           
            
          </View>
          </ScrollView>
          
          <View>
          <TouchableOpacity style={{marginTop: 50, zIndex: 8}} onPress={() => onAddMoreConcrete()}>
              <Text>Add More</Text>
            </TouchableOpacity>
          </View>

          <View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.GenerateRFIFieldLabel}>Date</Text>

              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder=""
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={rfiDate ? moment(new Date(rfiDate)).format('DD-MM-YYYY') : ''}
                  editable={false}
                />
                <TouchableOpacity onPress={() => openCloseCalendar()} style={{ width: 40, backgroundColor: "#ccc" }}>
                  <Text style={styles.assignTagButtonText}>Icon</Text>
                </TouchableOpacity>
              </View>
            </View>

            {openCalendar && (

              <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 10 }}>
                <CalendarPicker width={width - 40}
                  initialDate={rfiDate ? new Date(rfiDate) : new Date()}
                  onDateChange={(date) => {
                    setRFIDate(date.format("YYYY-MM-DD"));
                    openCloseCalendar()
                  }}
                />
              </View>
            )}

            <View style={{ flexDirection: 'column', height: 80, paddingTop: 15, zIndex: 5, marginBottom: 140 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Time</Text>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenMinutes(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openHours}
                    value={hour}
                    items={hours}
                    setOpen={setOpenHours}
                    setValue={setHour}
                  />
                </View>

                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenTimeFormats(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='MODAL'
                    open={openMinutes}
                    value={minute}
                    items={minutes}
                    setOpen={setOpenMinutes}
                    setValue={setMinute}
                  />
                </View>
                <View style={{ width: 80, height: 90 }}>
                  <DropDownPicker onPress={() => {
                    setOpenHours(false);
                    setOpenMinutes(false);
                  }}
                    dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                    maxHeight={75}
                    zIndex={1000}
                    listMode='SCROLLVIEW'
                    open={openTimeFormats}
                    value={timeFormat}
                    items={timeFormats}
                    setOpen={setOpenTimeFormats}
                    setValue={setTimeFormat}
                  />
                </View>
              </View>
              
              <View style={{ flexDirection: 'column', height: 65 }}>
              <Text style={styles.GenerateRFIFieldLabel}>Recommendations</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Recommendations"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
                value={comments}
                onChangeText={(text) => {
                  setComments(text);
                }}
              />
            </View>
            </View>
          </View>
        </View>







      default: return <View>
        <Text>TODO</Text>
      </View>
    }
  }

  const tasksListing = () => {
    return currentTasksData.filter((task: any) => {
      if (searchText && task.displayName) {
        return task.displayName.toLowerCase().includes(searchText.toLowerCase())
      } else {
        return true;
      }
    }).map((item: any, index) => (
      <View style={getStyle(item)}>
        <View style={styles.leftContainer}>
          <Text style={styles.HeadText}>{item.displayName}</Text>
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
        (currentLevel !== 1 && currentLevel !== 5) ? <View style={styles.SearchBox}>
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
            myWorksData.map((projModuleItem: any, projModuleIndex) => (
              projModuleItem.assignmentLevel === 1 ?
                <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(2, projModuleItem.assignmentLevel, projModuleIndex)}>
                  <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                  <View style={styles.TaskDetails}>
                    <Text style={styles.SubHeadingText}>Assigned:</Text>
                    <Text style={[styles.SubHeadingText, styles.SubActive]}>{projModuleItem.name}</Text>
                  </View>
                </TouchableOpacity>
                :
                (projModuleItem.segmentsData?.map((segItem: any, segIndex: any) => (
                  (segItem.assignmentLevel === 2) ? (
                    projModuleItem.segmentsData?.filter((segItem: any) => segItem.assignmentLevel == 2).length === 1 ? (
                      <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(3, segItem.assignmentLevel, projModuleIndex, projModuleItem.segmentsData?.findIndex((segItem: any) => segItem.assignmentLevel == 2))}>
                        <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                        <View style={styles.TaskDetails}>
                          <Text style={styles.SubHeadingText}>Assigned:AA</Text>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.SubHeadingText}>{SEGMENT_TYPES_DISPLAY[segItem.type]} /</Text>
                            <Text style={[styles.SubHeadingText, styles.SubActive]}>{projModuleItem.segmentsData?.filter((segItem: any) => segItem.assignmentLevel == 2)[0].name}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
                      :
                      (
                        Object.keys(groupBy([segItem], "type")).map((segType: any, index: any) => (
                          <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(2, segItem.assignmentLevel, projModuleIndex, -1, -1, -1, -1, segType)}>
                            <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                            <View style={styles.TaskDetails}>
                              <Text style={styles.SubHeadingText}>Assigned:BB {''+index}</Text>
                              <Text style={[styles.SubHeadingText, styles.SubActive]}>{SEGMENT_TYPES_DISPLAY[segType]} {projModuleItem.segmentsData?.filter((segItem: any) => segItem.type == segType && segItem.assignmentLevel == 2).length}</Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      )
                  )
                    :
                    segItem.componentsData && segItem.componentsData.length ? (
                      segItem.componentsData?.map((componentItem: any, componentIndex: number) => (
                        componentItem.assignmentLevel === 3 ?
                          (
                            <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(4, componentItem.assignmentLevel, projModuleIndex, segIndex, componentIndex)}>
                              <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                              <View style={styles.TaskDetails}>
                                <Text style={styles.SubHeadingText}>Assigned:AA</Text>
                                <Text style={styles.SubHeadingText}>{SEGMENT_TYPES_DISPLAY[segItem.type]} /</Text>
                                <Text style={styles.SubHeadingText}>{segItem.name} /</Text>
                                <Text style={[styles.SubHeadingText, styles.SubActive]}>{componentItem.name}</Text>
                              </View>
                            </TouchableOpacity>
  
                          )
                          :
                          componentItem.subComponentsData && componentItem.subComponentsData.length ? (
                            componentItem.subComponentsData.map((subComponentItem: any, subCompIndex: number) => (
                              subComponentItem.assignmentLevel === 4 ?
                          (
                            <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(5, subComponentItem.assignmentLevel, projModuleIndex, segIndex, componentIndex, subCompIndex)}>
                              <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                              <View style={styles.TaskDetails}>
                                <Text style={styles.SubHeadingText}>Assigned:</Text>
                                <Text style={styles.SubHeadingText}>{SEGMENT_TYPES_DISPLAY[segItem.type]} /</Text>
                                <Text style={styles.SubHeadingText}>{segItem.name} /</Text>
                                <Text style={styles.SubHeadingText}>{componentItem.name} /</Text>
                                <Text style={[styles.SubHeadingText, styles.SubActive]}>{subComponentItem.name}</Text>
                              </View>
                            </TouchableOpacity>
  
                          )
                          :
                          subComponentItem.tasksData?.map((taskItem: any, taskIndex: number) => (
                            taskItem.assignmentLevel === 5 &&
                            <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(6, taskItem.assignmentLevel, projModuleIndex, segIndex, componentIndex, subCompIndex, taskIndex)}>
                              <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                              <View style={styles.TaskDetails}>
                                <Text style={styles.SubHeadingText}>Assigned:</Text>
                                <Text style={styles.SubHeadingText}>{SEGMENT_TYPES_DISPLAY[segItem.type]} /</Text>
                                <Text style={styles.SubHeadingText}>{segItem.name} /</Text>
                                <Text style={styles.SubHeadingText}>{componentItem.name} /</Text>
                                <Text style={styles.SubHeadingText}>{subComponentItem.name} /</Text>
                                <Text style={[styles.SubHeadingText, styles.SubActive]}>{taskItem.displayName}</Text>
                              </View>
                            </TouchableOpacity>
  
                          ))
                            )
                          ))
                          :
                          componentItem.tasksData?.map((taskItem: any, taskIndex: number) => (
                            taskItem.assignmentLevel === 5 &&
                            <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(6, taskItem.assignmentLevel, projModuleIndex, segIndex, componentIndex, -1, taskIndex)}>
                              <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                              <View style={styles.TaskDetails}>
                                <Text style={styles.SubHeadingText}>Assigned:</Text>
                                <Text style={styles.SubHeadingText}>{SEGMENT_TYPES_DISPLAY[segItem.type]} /</Text>
                                <Text style={styles.SubHeadingText}>{segItem.name} /</Text>
                                <Text style={styles.SubHeadingText}>{componentItem.name} /</Text>
                                <Text style={[styles.SubHeadingText, styles.SubActive]}>{taskItem.displayName}</Text>
                              </View>
                            </TouchableOpacity>
  
                          ))
  
                      ))
                    )
                    :
                    segItem.tasksData?.map((taskItem: any, taskIndex: number) => (
                      taskItem.assignmentLevel === 5 &&
                      <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(6, taskItem.assignmentLevel, projModuleIndex, segIndex, -1, -1, taskIndex)}>
                        <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                        <View style={styles.TaskDetails}>
                          <Text style={styles.SubHeadingText}>Assigned:</Text>
                          <Text style={styles.SubHeadingText}>{SEGMENT_TYPES_DISPLAY[segItem.type]} /</Text>
                          <Text style={styles.SubHeadingText}>{segItem.name} /</Text>
                          <Text style={[styles.SubHeadingText, styles.SubActive]}>{taskItem.displayName}</Text>
                        </View>
                      </TouchableOpacity>

                    ))

                )))

            )) : null
        }
        {
          currentLevel === 7 &&
            segmentsByGroupOnType && Object.keys(segmentsByGroupOnType).length ? Object.keys(segmentsByGroupOnType).map((item) => (
              <TouchableOpacity style={[styles.StartWorkCard, styles.StartBorder]} onPress={() => onSegmentTypeClick(item)}>
                <View style={styles.leftContainer}>
                  <Text style={styles.HeadText}>{segmentsByGroupOnType[item].length}</Text>
                  <Text style={styles.MyWorkSubHead}>{SEGMENT_TYPES_DISPLAY[item]}</Text>
                </View>
              </TouchableOpacity>
            )) : null
        }
        {
          currentLevel === 2 ?
            currentSegmentsData.filter((seg: any) => {
              if (searchText && seg.name) {
                return seg.name.toLowerCase().includes(searchText.toLowerCase())
              } else {
                return true;
              }
            }).map((item: any, index) => (
              <TouchableOpacity style={getStyle(item)} onPress={() => onClickNested(3, item)}>
                <View style={styles.leftContainer}>
                  <Text style={styles.HeadText}>{item.name}</Text>
                  {/* <Text style={styles.MyWorkSubHead}>Sub Text</Text> */}
                </View>
              </TouchableOpacity>
            )) : null
        }
        {
          currentLevel === 3 ?
          currentComponentsData && currentComponentsData.length ? currentComponentsData.filter((subSeg: any) => {
              if (searchText && subSeg.name) {
                return subSeg.name.toLowerCase().includes(searchText.toLowerCase())
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
          currentLevel === 4 ?
          currentSubComponentsData && currentSubComponentsData.length ? currentSubComponentsData.filter((subComponent: any) => {
              if (searchText && subComponent.name) {
                return subComponent.name.toLowerCase().includes(searchText.toLowerCase())
              } else {
                return true;
              }
            }).map((item: any, index) => (
              <TouchableOpacity style={getStyle(item)} onPress={() => onClickNested(5, item)}>
                <View style={styles.leftContainer}>
                  <Text style={styles.HeadText}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )) : tasksListing()
            :
            null
        }
        {
          (currentLevel === 5 || currentLevel === 6) ?
            tasksListing()
          : null
        }
        {/* No Data Found */}
        {(!loading && !myWorksData.length) ?
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
                  <Text style={styles.modalLabel}>Task: {selectedTask?.displayName}</Text>
                </View>
                <ScrollView style={{ paddingTop: 10, height: 500 }}>
                  <Fragment>
                    <StatusBar barStyle="dark-content" />
                    <SafeAreaView>
                      {
                        taskForm(selectedTask?.name)
                      }
                    </SafeAreaView>
                  </Fragment>
                </ScrollView>

                <View style={[styles.btnParentSection, { flexDirection: 'row', justifyContent: 'center', gap: 20 }]}>
                  <TouchableOpacity style={styles.submitButton} onPress={() => onFillChecklist(RFI_STATUS.IN_PROGRESS)}>
                    <Text style={styles.submitButtonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.submitButton} onPress={() => onFillChecklist(RFI_STATUS.IN_REVIEW)}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>


      <LoadingAnimation loading={loading}></LoadingAnimation>
    </View>
  )
}

const CustomTextInput = ({rowItem, fieldName}: {rowItem: any, fieldName: any}) => {
  const [value, setValue] = useState(rowItem[fieldName]);
  const updateValue = (text: any) => {
    {rowItem[fieldName] = text}
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

const CustomDropdownPicker = ({items, rowItem, fieldName}: {items: any, rowItem: any, fieldName: any}) => {
  const [value, setValue] = useState(rowItem[fieldName]);
  const [openList, setOpenList] = useState(false);
  const updateValue = () => {
    {rowItem[fieldName] = value}
  }
  return (
    <DropDownPicker style={{width: 90, height: 45, zIndex: 10}}
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

  //MyWork Card
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

export default MyWork