import {
  View,
  Text,
  NativeEventEmitter,
  StyleSheet,
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
import React, {Fragment, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  HeaderItems,
  PROJECT_TYPE,
  RFI_STATUS,
  SEGMENT_TYPES_DISPLAY,
  TASK_TYPES,
  YES_NO_LIST,
  YES_NO_NA_LIST,
  CONCRETE_GRADE_LIST,
  CEMENT_GRADE_LIST,
  CEMENT_TYPE_LIST,
} from '../../constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearMyWorksEvent,
  fillRFIsChecklist,
  getMyWorks,
  getRFIByWaId,
} from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import {
  getDbDate,
  getDbDateFromDDMMYYYY,
  getDisplayDate,
  getDisplayTime,
  groupBy,
} from '../../utils/Utils';
import * as ImagePicker from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownPicker from '../../components/UI/DropdownPicker';
import CalendarPicker from '../../components/UI/CalenderPicker';
import TimePicker from '../../components/UI/TimePicker';
import moment from 'moment';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Guid} from 'guid-typescript';
import {FlatList} from 'react-native-gesture-handler';
import Input from '../../components/UI/Input';

const MyWork = ({route, navigation}: {route: any; navigation: any}) => {
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {workType} = route.params;

  const {myWorks, rfiData, rfiChecklistSaved, loading, error} = useSelector(
    (state: any) => state.MyWorks,
  );
  const [myWorksData, setMyWorksData]: any = useState([]);
  const [currentSegmentsData, setCurrentSegmentsData]: any = useState([]);
  const [currentComponentsData, setCurrentComponentsData]: any = useState([]);
  const [currentSubComponentsData, setCurrentSubComponentsData]: any = useState(
    [],
  );
  const [currentTasksData, setCurrentTasksData]: any = useState([]);
  const [projectModuleId, setProjectModuleId]: any = useState('');
  const [currentLevel, setCurrentLevel]: any = useState(1);
  const [segmentsByGroupOnType, setSegmentsByGroupOnType]: any = useState(null);
  const [searchText, setSearchText]: any = useState('');
  const [rfiId, setRfiId]: any = useState('');
  const [breadcrumbData, setBreadcrumbData]: any = useState([
    {
      name: '',
      projectModuleIndex: 0,
      segIndex: 0,
      componentIndex: 0,
      subComponentIndex: 0,
      taskIndex: 0,
      level: 0,
      assignmentLevel: 0,
      active: false,
    },
  ]);

  const imageObjectEmpty = {
    filepath: {
      data: '',
      uri: '',
    },
    fileData: '',
    fileUri: '',
  };

  const [rfiDate, setRFIDate] = useState('');
  const [rfiTime, setRFITime] = useState('');
  const [openCalendar, setOpenCalendar] = useState(false);

  const [comments, setComments] = useState('');
  const {width, height} = Dimensions.get('window');

  // CNG_AND_SETTING_OUT
  // PLACING_OF_SHEATHING_DUCT
  // TASK_TYPES.POST_CONCRETE_CHECK:
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedTask, setSelectedTask]: any = useState(null);
  const [imageObject, setImageObject]: any = useState(imageObjectEmpty);

  // FORM_WORK
  // PLACEMENT_OF_INNER_SHUTTERS
  // PLACEMENT_OF_SIDE_SHUTTERS
  // PLACEMENT_OF_BOTTOM_SHUTTER
  // PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER
  const [cleanliness, setCleanliness] = useState('Y');
  const [openCleanliness, setOpenCleanliness] = useState(false);
  const [formworkAlignmentChecked, setFormworkAlignmentChecked] = useState('Y');
  const [openFormworkAlignmentChecked, setOpenFormworkAlignmentChecked] =
    useState(false);
  const [formworkSealingChecked, setFormworkSealingChecked] = useState('Y');
  const [openFormworkSealingChecked, setOpenFormworkSealingChecked] =
    useState(false);
  const [formworkdDrawingsChecked, setFormworkdDrawingsChecked] = useState('Y');
  const [openFormworkdDrawingsChecked, setOpenFormworkdDrawingsChecked] =
    useState(false);
  const [concreteFinishLevelMarked, setConcreteFinishLevelMarked] =
    useState('Y');
  const [openConcreteFinishLevelMarked, setOpenConcreteFinishLevelMarked] =
    useState(false);
  const [formworkProperlySupported, setFormworkProperlySupported] =
    useState('Y');
  const [openFormworkProperlySupported, setOpenFormworkProperlySupported] =
    useState(false);
  const [formworkFitConcreting, setFormworkFitConcreting] = useState('Y');
  const [openFormworkFitConcreting, setOpenFormworkFitConcreting] =
    useState(false);

  // REINFORCEMENT
  // REINFORCEMENT_PREPARATION
  // PLACEMENT_OF_REINFORCEMENT_CAGE **(except spacerBarCheckedGFC)
  const [rebarAndDimensionGFC, setRebarAndDimensionGFC] = useState('Y');
  const [openRebarAndDimensionGFC, setOpenRebarAndDimensionGFC] =
    useState(false);
  const [shapingNoAndLengthOfBarsGFC, setShapingNoAndLengthOfBarsGFC] =
    useState('Y');
  const [openShapingNoAndLengthOfBarsGFC, setOpenShapingNoAndLengthOfBarsGFC] =
    useState(false);
  const [rebarsSecurelyTightened, setRebarsSecurelyTightened] = useState('Y');
  const [openRebarsSecurelyTightened, setOpenRebarsSecurelyTightened] =
    useState(false);
  const [spliceLengthAndLocationGFC, setSpliceLengthAndLocationGFC] =
    useState('Y');
  const [openSpliceLengthAndLocationGFC, setOpenSpliceLengthAndLocationGFC] =
    useState(false);
  const [rebarWithinToleranceLimit, setRebarWithinToleranceLimit] =
    useState('Y');
  const [openRebarWithinToleranceLimit, setOpenRebarWithinToleranceLimit] =
    useState(false);
  const [
    couplerArrangementsWithinTolerance,
    setCouplerArrangementsWithinTolerance,
  ] = useState('Y');
  const [
    openCouplerArrangementsWithinTolerance,
    setOpenCouplerArrangementsWithinTolerance,
  ] = useState(false);
  const [barBendingScheduleChecked, setBarBendingScheduleChecked] =
    useState('Y');
  const [openBarBendingScheduleChecked, setOpenBarBendingScheduleChecked] =
    useState(false);
  const [spacerBarCheckedGFC, setSpacerBarCheckedGFC] = useState('Y');
  const [openSpacerBarCheckedGFC, setOpenSpacerBarCheckedGFC] = useState(false);

  // EXCAVATION
  const [quantity, setQuantity] = useState(0);

  // REMOVAL_OF_SHUTTER
  // REMOVAL_OF_SHUTTERS
  const [
    concreteHasAchievedDesiredStrength,
    setConcreteHasAchievedDesiredStrength,
  ] = useState('Y');
  const [
    openConcreteHasAchievedDesiredStrength,
    setOpenConcreteHasAchievedDesiredStrength,
  ] = useState(false);
  const [minimumTimeHasBeenAttained, setMinimumTimeHasBeenAttained] =
    useState('Y');
  const [openMinimumTimeHasBeenAttained, setOpenMinimumTimeHasBeenAttained] =
    useState(false);

  // THREADING_OF_PRE_STRESSING_STRANDS
  // only comments

  // CAGE_LOWERING
  const [plieShaftCleanedLooseMaterial, setPlieShaftCleanedLooseMaterial] =
    useState('Y');
  const [
    openPlieShaftCleanedLooseMaterial,
    setOpenPlieShaftCleanedLooseMaterial,
  ] = useState(false);
  const [
    suitableSpacerProvidedToMaintainCoverToSteel,
    setSuitableSpacerProvidedToMaintainCoverToSteel,
  ] = useState('Y');
  const [
    openSuitableSpacerProvidedToMaintainCoverToSteel,
    setOpenSuitableSpacerProvidedToMaintainCoverToSteel,
  ] = useState(false);
  const [noLBendBottomOfTheCageChecked, setNoLBendBottomOfTheCageChecked] =
    useState('Y');
  const [
    openNoLBendBottomOfTheCageChecked,
    setOpenNoLBendBottomOfTheCageChecked,
  ] = useState(false);

  // CONCRETE
  const [concreteData, setConcreteData] = useState([
    {
      vehicleNo: '',
      timeOfArrival: '',
      gradeOfConcrete: '',
      concreteTemp: 0,
      slumpValue: 0,
      concretePoured: 0,
      concreteStartTime: '',
      concreteFinishTime: '',
      key: Guid.create(),
    },
  ]);
  //GLUEING
  const [glueingData, setGlueingData] = useState([
    {
      jointNumbers: '',
      ambientTemperature: 0,
      batchNoResin: 0,
      batchNoHardener: 0,
      mixingStartTime: '',
      mixingFinishTime: '',
      applicationStartTime: '',
      applicationFinishTime: '',
      segmentJoiningTimeClosure: '',
      segmentJoiningTimeTemporaryFinish: '',
      segmentSurfaceArea: 0,
      epoxyConsumptionTheoreticalResin: 0,
      epoxyConsumptionTheoreticalHardener: 0,
      epoxyConsumptionActualResin: 0,
      epoxyConsumptionActualHardener: 0,
      key: Guid.create(),
    },
  ]);

  // BORING_OF_PILE
  type FormStateBoringOfPile = {
    densityOfPolymer: number;
    viscosityOfPolymer: number;
    valueOfPolymer: number;
    contentOfPolymer: number;
    depthOfBore: number;
  };
  const [boringOfPileData, setBoringOfPileData] =
    useState<FormStateBoringOfPile>({
      densityOfPolymer: 0,
      viscosityOfPolymer: 0,
      valueOfPolymer: 0,
      contentOfPolymer: 0,
      depthOfBore: 0,
    });

  const handleInputChangeBoringOfPile = (
    name: keyof FormStateBoringOfPile,
    value: string | number | [],
  ) => {
    setBoringOfPileData({...boringOfPileData, [name]: Number(value)});
  };

  // FLUSHING_OPERATIONS
  type FormStateFlushingOperations = {
    startTimeOfFlushing: string;
    finishTimeOfFlushing: string;
    whetherPourCleared: string;
    densityOfPolymer: number;
    viscosityOfPolymer: number;
    valueOfPolymer: number;
    contentOfPolymer: number;
    depthOfBore: number;
  };
  const [flushingOperationsData, setFlushingOperationsData] =
    useState<FormStateFlushingOperations>({
      startTimeOfFlushing: '',
      finishTimeOfFlushing: '',
      whetherPourCleared: 'Y',
      densityOfPolymer: 0,
      viscosityOfPolymer: 0,
      valueOfPolymer: 0,
      contentOfPolymer: 0,
      depthOfBore: 0,
    });

  const handleInputChangeFlushingOperations = (
    name: keyof FormStateFlushingOperations,
    value: string | number | [],
  ) => {
    if (
      name === 'startTimeOfFlushing' ||
      name === 'finishTimeOfFlushing' ||
      name === 'whetherPourCleared'
    ) {
      setFlushingOperationsData({...flushingOperationsData, [name]: value});
    } else {
      setFlushingOperationsData({
        ...flushingOperationsData,
        [name]: Number(value),
      });
    }
  };

  // CHIPPING_AND_REMOVAL_OF_CONCRETE_ABOVE_CUT_OFF_LEVEL
  type FormStateChippingAndRemovalOfConcrete = {
    noOfDaysOfChipping: number;
  };
  const [
    chippingAndRemovalOfConcreteData,
    setChippingAndRemovalOfConcreteData,
  ] = useState<FormStateChippingAndRemovalOfConcrete>({
    noOfDaysOfChipping: 0,
  });

  const handleInputChangeChippingAndRemovalOfConcrete = (
    name: keyof FormStateChippingAndRemovalOfConcrete,
    value: string | number | [],
  ) => {
    setChippingAndRemovalOfConcreteData({
      ...chippingAndRemovalOfConcreteData,
      [name]: Number(value),
    });
  };

  // GROUTING
  type FormStateGrouting = {
    inletFree: string;
    outletFree: string;
    ventsFree: string;
    cableDuctFree: string;
    leakageObserved: string;
    sealed: string;
    remedialMeasures: string;
    prestressingDate: string;
    groutingDate: string;
    cementType: string;
    wcRatio: number;
    mixingWaterTemp: number;
    groutTemp: number;
    startTime: string;
    finishTime: string;
    volumeOfGrout: number;
    groutingPressure: number;
    cementConsumptionTheoretical: number;
    cementConsumptionActual: number;
    passageThroughVents: string;
    passageThroughOutlet: string;
    equipmentFailure: string;
    probingByStiffwire: string;
  };
  const [groutingData, setGroutingData] = useState<FormStateGrouting>({
    inletFree: 'Y',
    outletFree: 'Y',
    ventsFree: 'Y',
    cableDuctFree: 'Y',
    leakageObserved: 'Y',
    sealed: 'Y',
    remedialMeasures: 'Y',
    prestressingDate: '',
    groutingDate: '',
    cementType: 'OPC43',
    wcRatio: 0,
    mixingWaterTemp: 0,
    groutTemp: 0,
    startTime: '',
    finishTime: '',
    volumeOfGrout: 0,
    groutingPressure: 0,
    cementConsumptionTheoretical: 0,
    cementConsumptionActual: 0,
    passageThroughVents: 'Y',
    passageThroughOutlet: 'Y',
    equipmentFailure: 'Y',
    probingByStiffwire: 'Y',
  });

  const handleInputChangeGrouting = (
    name: keyof FormStateGrouting,
    value: string | number | [],
  ) => {
    let parsedValue: number;
    // Only parse if the value is a string or number
    if (typeof value === 'string') {
      parsedValue = parseFloat(value);
    } else if (typeof value === 'number') {
      parsedValue = value;
    } else {
      // If the value is not a string or number, return early without updating
      return;
    }
    const isValidInput = (val: number, maxLimit: number, decimals: number) => {
      const regex = new RegExp(`^\\d*(\\.\\d{0,${decimals}})?$`);
      return val > 0 && val <= maxLimit && regex.test(val.toString());
    };

    switch (name) {
      case 'wcRatio':
        if (!isValidInput(parsedValue, 2, 2)) {
          showSnackbar(
            'Invalid W/C Ratio: Must be >0 and <= 2, with up to 2 decimal places.',
            'error',
          );
        }
        break;
      case 'mixingWaterTemp':
      case 'groutTemp':
        if (!isValidInput(parsedValue, 60, 2)) {
          showSnackbar(
            'Invalid Temperature: Must be >0 and <= 60°C, with up to 2 decimal places.',
            'error',
          );
        }
        break;
      case 'volumeOfGrout':
        if (!isValidInput(parsedValue, 1000, 2)) {
          showSnackbar(
            'Invalid Volume of Grout: Must be >0 and <= 1000L, with up to 2 decimal places.',
            'error',
          );
        }
        break;
      case 'groutingPressure':
        if (!isValidInput(parsedValue, 50, 2)) {
          showSnackbar(
            'Invalid Grouting Pressure: Must be >0 and <= 50 Kg/cm², with up to 2 decimal places.',
            'error',
          );
        }
        break;
      case 'cementConsumptionTheoretical':
      case 'cementConsumptionActual':
        if (!isValidInput(parsedValue, 1000, 2)) {
          showSnackbar(
            'Invalid Cement Consumption: Must be >0 and <= 1000, with up to 2 decimal places.',
            'error',
          );
        }
        break;
      default:
        break;
    }

    // if (name === 'wcRatio' || name === 'mixingWaterTemp' || name === 'groutTemp' ||
    //     name === 'volumeOfGrout' || name === 'groutingPressure' || name === 'cementConsumptionTheoretical' ||
    //     name === 'cementConsumptionActual') {
    //   setGroutingData({...groutingData, [name]: Number(value)});
    // }
    setGroutingData({...groutingData, [name]: value});
  };

  const dispatch = useDispatch();
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
      setOpenPopup(false);
    }
  }, [focus]);

  const getMyWorksData = () => {
    dispatch(
      getMyWorks({
        projectId: loggedInUser.projectId,
        workType: workType,
      }),
    );
  };

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
          case TASK_TYPES.POST_CONCRETE_CHECK:
            setImageObject({
              filePath: '',
              fileData: rfiData.metaData.base64Image,
              fileUri: '',
            });
            break;
          case TASK_TYPES.FORM_WORK:
          case TASK_TYPES.PLACEMENT_OF_INNER_SHUTTERS:
          case TASK_TYPES.PLACEMENT_OF_SIDE_SHUTTERS:
          case TASK_TYPES.PLACEMENT_OF_BOTTOM_SHUTTER:
          case TASK_TYPES.PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER:
            setCleanliness(rfiData.metaData.cleanliness);
            setFormworkAlignmentChecked(
              rfiData.metaData.formworkAlignmentChecked,
            );
            setFormworkSealingChecked(rfiData.metaData.formworkSealingChecked);
            setFormworkdDrawingsChecked(
              rfiData.metaData.formworkdDrawingsChecked,
            );
            setConcreteFinishLevelMarked(
              rfiData.metaData.concreteFinishLevelMarked,
            );
            setFormworkProperlySupported(
              rfiData.metaData.formworkProperlySupported,
            );
            setFormworkFitConcreting(rfiData.metaData.formworkFitConcreting);
            break;
          case TASK_TYPES.REINFORCEMENT_PREPARATION:
          case TASK_TYPES.REINFORCEMENT:
            setRebarAndDimensionGFC(rfiData.metaData.rebarAndDimensionGFC);
            setShapingNoAndLengthOfBarsGFC(
              rfiData.metaData.shapingNoAndLengthOfBarsGFC,
            );
            setRebarsSecurelyTightened(
              rfiData.metaData.rebarsSecurelyTightened,
            );
            setSpliceLengthAndLocationGFC(
              rfiData.metaData.spliceLengthAndLocationGFC,
            );
            setRebarWithinToleranceLimit(
              rfiData.metaData.rebarWithinToleranceLimit,
            );
            setCouplerArrangementsWithinTolerance(
              rfiData.metaData.couplerArrangementsWithinTolerance,
            );
            setBarBendingScheduleChecked(
              rfiData.metaData.barBendingScheduleChecked,
            );
            setSpacerBarCheckedGFC(rfiData.metaData.spacerBarCheckedGFC);
            break;
          case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
            setRebarAndDimensionGFC(rfiData.metaData.rebarAndDimensionGFC);
            setShapingNoAndLengthOfBarsGFC(
              rfiData.metaData.shapingNoAndLengthOfBarsGFC,
            );
            setRebarsSecurelyTightened(
              rfiData.metaData.rebarsSecurelyTightened,
            );
            setSpliceLengthAndLocationGFC(
              rfiData.metaData.spliceLengthAndLocationGFC,
            );
            setRebarWithinToleranceLimit(
              rfiData.metaData.rebarWithinToleranceLimit,
            );
            setCouplerArrangementsWithinTolerance(
              rfiData.metaData.couplerArrangementsWithinTolerance,
            );
            setBarBendingScheduleChecked(
              rfiData.metaData.barBendingScheduleChecked,
            );
            break;
          case TASK_TYPES.EXCAVATION:
            setQuantity(rfiData.metaData.quantity);
            break;
          case TASK_TYPES.REMOVAL_OF_SHUTTER:
          case TASK_TYPES.REMOVAL_OF_SHUTTERS:
            setConcreteHasAchievedDesiredStrength(
              rfiData.metaData.concreteHasAchievedDesiredStrength,
            );
            setMinimumTimeHasBeenAttained(
              rfiData.metaData.minimumTimeHasBeenAttained,
            );
            break;
          case TASK_TYPES.CAGE_LOWERING:
            setPlieShaftCleanedLooseMaterial(
              rfiData.metaData.plieShaftCleanedLooseMaterial,
            );
            setSuitableSpacerProvidedToMaintainCoverToSteel(
              rfiData.metaData.suitableSpacerProvidedToMaintainCoverToSteel,
            );
            setNoLBendBottomOfTheCageChecked(
              rfiData.metaData.noLBendBottomOfTheCageChecked,
            );
            break;
          case TASK_TYPES.BORING_OF_PILE:
            if (rfiData.metaData.boringOfPileData) {
              setBoringOfPileData(rfiData.metaData.boringOfPileData);
            } else {
              setBoringOfPileData({
                densityOfPolymer: 0,
                viscosityOfPolymer: 0,
                valueOfPolymer: 0,
                contentOfPolymer: 0,
                depthOfBore: 0,
              });
            }
            break;
          case TASK_TYPES.FLUSHING_OPERATIONS:
            if (rfiData.metaData.flushingOperationsData) {
              setFlushingOperationsData(
                rfiData.metaData.flushingOperationsData,
              );
            } else {
              setFlushingOperationsData({
                startTimeOfFlushing: '',
                finishTimeOfFlushing: '',
                whetherPourCleared: 'Y',
                densityOfPolymer: 0,
                viscosityOfPolymer: 0,
                valueOfPolymer: 0,
                contentOfPolymer: 0,
                depthOfBore: 0,
              });
            }
            break;
          case TASK_TYPES.GROUTING:
            if (rfiData.metaData.groutingData) {
              setBoringOfPileData(rfiData.metaData.groutingData);
            } else {
              setGroutingData({
                inletFree: 'Y',
                outletFree: 'Y',
                ventsFree: 'Y',
                cableDuctFree: 'Y',
                leakageObserved: 'Y',
                sealed: 'Y',
                remedialMeasures: 'Y',
                prestressingDate: '',
                groutingDate: '',
                cementType: 'OPC43',
                wcRatio: 0,
                mixingWaterTemp: 0,
                groutTemp: 0,
                startTime: '',
                finishTime: '',
                volumeOfGrout: 0,
                groutingPressure: 0,
                cementConsumptionTheoretical: 0,
                cementConsumptionActual: 0,
                passageThroughVents: 'Y',
                passageThroughOutlet: 'Y',
                equipmentFailure: 'Y',
                probingByStiffwire: 'Y',
              });
            }
            break;
          case TASK_TYPES.CHIPPING_AND_REMOVAL_OF_CONCRETE_ABOVE_CUT_OFF_LEVEL:
            if (rfiData.metaData.chippingAndRemovalOfConcreteData) {
              setChippingAndRemovalOfConcreteData(
                rfiData.metaData.chippingAndRemovalOfConcreteData,
              );
            } else {
              setChippingAndRemovalOfConcreteData({
                noOfDaysOfChipping: 0,
              });
            }
            break;
          case TASK_TYPES.CONCRETING:
          case TASK_TYPES.PCC_LEVELLING_COURSE:
            if (rfiData.metaData.concreteData) {
              rfiData.metaData.concreteData.forEach((item: any) => {
                item.key = Guid.create();
              });
              setConcreteData(rfiData.metaData.concreteData);
            } else {
              setConcreteData([]);
            }
          case TASK_TYPES.GLUEING:
            if (rfiData.metaData.glueingData) {
              rfiData.metaData.glueingData.forEach((item: any) => {
                item.key = Guid.create();
              });
              setGlueingData(rfiData.metaData.glueingData);
            } else {
              setGlueingData([]);
            }
            break;

          default:
            break;
        }
      }

      if (rfiData.rfiSubmitDateTime) {
        setRFIDate(getDbDate(rfiData.rfiSubmitDateTime));

        const time = getDisplayTime(rfiData.rfiSubmitDateTime);
      }

      if (rfiData.comments) {
        setComments(rfiData.comments);
      }
      setOpenPopup(true);
    }

    if (rfiChecklistSaved) {
      setOpenPopup(false);
      Alert.alert('RFIs checklist saved.');
      setCurrentLevel(1);
      setImageObject(imageObjectEmpty);
      dispatch(clearMyWorksEvent());
      getMyWorksData();
    }
  }, [myWorks, rfiData, rfiChecklistSaved, error]);

  // unmount
  useEffect(
    () => () => {
      dispatch(clearMyWorksEvent());
      setCurrentLevel(1);
      setMyWorksData([]);
      setCurrentSegmentsData([]);
      setCurrentComponentsData([]);
      setCurrentSubComponentsData([]);
      setCurrentTasksData([]);
      setBreadcrumbData([]);
      setSearchText('');
    },
    [],
  );

  const onClick = (
    level: number,
    assignmentLevel: number,
    projectModuleIndex: number,
    segIndex: number = -1,
    componentIndex: number = -1,
    subComponentIndex: number = -1,
    taskIndex: number = -1,
    segmentType = null,
  ) => {
    setSearchText('');
    setCurrentLevel(level);
    setBreadcrumbData([]);
    setCurrentTasksData([]);
    if (level === 2) {
      if (assignmentLevel === 1) {
        setCurrentLevel(7);
        const gbSegmentTypes = groupBy(
          myWorksData[projectModuleIndex].segmentsData,
          'type',
        );
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
            active: true,
          },
          {
            name: 'Segment Types',
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 0,
            assignmentLevel: assignmentLevel,
            active: false,
          },
        ]);
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
            active: true,
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
            active: false,
          },
        ]);
      } else {
        const segmentsData = myWorksData[
          projectModuleIndex
        ].segmentsData.filter((seg: any) => seg.type == segmentType);
        setCurrentSegmentsData(segmentsData);
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
            active: true,
          },
          {
            //name: "Foundation", // todo - dynamic
            name: SEGMENT_TYPES_DISPLAY[segmentsData[0].type] || 'Foundation', // todo - dynamic
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 0,
            assignmentLevel: assignmentLevel,
            active: false,
          },
        ]);
      }
    } else if (level === 3 && segIndex != -1) {
      const segmentData =
        myWorksData[projectModuleIndex].segmentsData[segIndex];
      if (segmentData.componentsData && segmentData.componentsData.length) {
        setCurrentTasksData([]);
        setCurrentComponentsData(segmentData.componentsData);
      } else {
        setCurrentLevel(6);
        setCurrentComponentsData([]);
        setCurrentTasksData(segmentData.tasksData);
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
          active: true,
        },
        {
          name:
            SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: false,
        },
      ]);
    } else if (level === 4 && segIndex != -1 && componentIndex != -1) {
      const segmentData =
        myWorksData[projectModuleIndex].segmentsData[segIndex];
      const componentData = segmentData.componentsData[componentIndex];
      if (
        componentData.subComponentsData &&
        componentData.subComponentsData.length
      ) {
        setCurrentTasksData([]);
        setCurrentLevel(4);
        setCurrentSubComponentsData(componentData.subComponentsData);
      } else {
        setCurrentSubComponentsData([]);
        setCurrentLevel(6);
        setCurrentTasksData(componentData.tasksData);
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
          active: true,
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
          active: false,
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
          active: true,
        },
      ]);
    } else if (
      level === 5 &&
      segIndex != -1 &&
      componentIndex != -1 &&
      subComponentIndex != -1
    ) {
      const segmentData =
        myWorksData[projectModuleIndex].segmentsData[segIndex];
      const componentData: any = segmentData.componentsData[componentIndex];
      const subComponentData: any =
        componentData.subComponentsData[subComponentIndex];
      setProjectModuleId(segmentData.projectModuleId);
      setCurrentTasksData(subComponentData.tasksData);

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
          active: true,
        },
        {
          name:
            SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: true,
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
          active: true,
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
          active: true,
        },
      ]);
    } else if (level === 6 && taskIndex != -1) {
      const segmentData =
        myWorksData[projectModuleIndex].segmentsData[segIndex];
      const breadcrumbItems = [
        {
          name: myWorksData[projectModuleIndex].name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true,
        },
        {
          name:
            SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: true,
        },
      ];
      if (componentIndex != -1 && subComponentIndex != -1) {
        const componentData: any = segmentData.componentsData[componentIndex];
        const subComponentData =
          componentData.subComponentsData[subComponentIndex];
        const taskData: any = [subComponentData.tasksData[taskIndex]];
        setProjectModuleId(segmentData.projectModuleId);
        setCurrentTasksData(taskData);
        breadcrumbItems.push(
          ...[
            {
              name: componentData.name,
              projectModuleIndex: projectModuleIndex,
              segIndex: segIndex,
              componentIndex: componentIndex,
              subComponentIndex: subComponentIndex,
              taskIndex: taskIndex,
              level: 3,
              assignmentLevel: assignmentLevel,
              active: true,
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
              active: true,
            },
          ],
        );
      } else if (componentIndex != -1) {
        const componentData: any = segmentData.componentsData[componentIndex];
        const taskData: any = [componentData.tasksData[taskIndex]];
        setProjectModuleId(segmentData.projectModuleId);
        setCurrentTasksData(taskData);
        breadcrumbItems.push({
          name: componentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 3,
          assignmentLevel: assignmentLevel,
          active: true,
        });
      } else if (segIndex != -1) {
        setProjectModuleId(segmentData.projectModuleId);
        const taskData: any = [segmentData.tasksData[taskIndex]];
        setCurrentTasksData(taskData);
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
        active: false,
      });
      setBreadcrumbData(breadcrumbItems);
    }
  };

  const onClickNested = (level: number, data: any) => {
    setSearchText('');
    if (data.projectModuleId) {
      setProjectModuleId(data.projectModuleId);
    }
    setCurrentLevel(level);
    if (level === 3) {
      setCurrentComponentsData(data.componentsData);
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
        active: false,
      };
      breadcrumbData.push(bcrubm);
      if (data.subComponentsData && data.subComponentsData.length) {
        setCurrentSubComponentsData(data.subComponentsData);
      } else {
        setCurrentTasksData(data.tasksData);
        breadcrumbData.push({
          name: 'Tasks',
          projectModuleIndex: breadcrumbData[0].projectModuleIndex,
          segIndex: breadcrumbData[1].segIndex,
          componentIndex: breadcrumbData[2]?.componentIndex || -1,
          subComponentIndex: breadcrumbData[3]?.subComponentIndex || -1,
          taskIndex: 0,
          level: 0,
          assignmentLevel: 0,
          active: false,
        });
      }
    } else if (level === 5) {
      setCurrentTasksData(data.tasksData);
      const bcrubm = {
        name: data.name,
        projectModuleIndex: breadcrumbData[0].projectModuleIndex,
        segIndex: breadcrumbData[1].segIndex,
        componentIndex: breadcrumbData[2]?.componentIndex || -1,
        subComponentIndex: breadcrumbData[3]?.subComponentIndex || -1,
        taskIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false,
      };
      breadcrumbData.push(bcrubm);
      breadcrumbData.push({
        name: 'Tasks',
        projectModuleIndex: breadcrumbData[0].projectModuleIndex,
        segIndex: breadcrumbData[1].segIndex,
        componentIndex: breadcrumbData[2]?.componentIndex || -1,
        subComponentIndex: breadcrumbData[3]?.subComponentIndex || -1,
        taskIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false,
      });
    }
  };

  const onSegmentTypeClick = (type: any) => {
    if (segmentsByGroupOnType) {
      onClick(
        2,
        -1,
        breadcrumbData[0].projectModuleIndex,
        -1,
        -1,
        -1,
        -1,
        type,
      );
    }
  };

  const getStyle = (item: any) => {
    if (item.rfiStatus) {
      if (
        item.rfiStatus === RFI_STATUS.GENERATED ||
        item.rfiStatus === RFI_STATUS.RE_GENERATED
      ) {
        return [styles.StartWorkCard, styles.StartBorder];
      } else if (
        item.rfiStatus === RFI_STATUS.REJECTED ||
        item.rfiStatus === RFI_STATUS.CANCELLED
      ) {
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
  };

  const getRFIDataByWorkAssignmentId = (task: any) => {
    setRFIDate('');
    setComments('');
    setImageObject(imageObjectEmpty);
    setSelectedTask(task);
    dispatch(
      getRFIByWaId({
        projectId: loggedInUser.projectId,
        projectModuleId: projectModuleId,
        waId: task.workAssignmentId,
      }),
    );
  };

  const validateFlushingOperationsData = (
    flushingOperationsData: any,
  ): boolean => {
    if (!flushingOperationsData.startTimeOfFlushing) {
      showSnackbar('Start time of flushing cannot be empty', 'error');
      return false;
    }

    if (!flushingOperationsData.finishTimeOfFlushing) {
      showSnackbar('Finish time of flushing cannot be empty', 'error');
      return false;
    }

    if (!flushingOperationsData.whetherPourCleared) {
      showSnackbar('Whether Pour Cleared must be either Yes or No', 'error');
      return false;
    }
    const densityOfPolymer = parseFloat(
      flushingOperationsData.densityOfPolymer,
    );
    if (
      isNaN(densityOfPolymer) ||
      densityOfPolymer <= 0 ||
      densityOfPolymer > 5 ||
      !/^\d+(\.\d{1,2})?$/.test(densityOfPolymer.toString())
    ) {
      showSnackbar(
        'Density of Polymer must be greater than 0, up to 2 decimal places, and less than or equal to 5 gm/ml',
        'error',
      );
      return false;
    }

    const viscosityOfPolymer = parseInt(
      flushingOperationsData.viscosityOfPolymer,
    );
    if (
      isNaN(viscosityOfPolymer) ||
      viscosityOfPolymer <= 0 ||
      viscosityOfPolymer > 500
    ) {
      showSnackbar(
        'Viscosity of Polymer must be an integer greater than 0 and less than or equal to 500 sec/liter',
        'error',
      );
      return false;
    }

    const valueOfPolymer = parseInt(flushingOperationsData.valueOfPolymer);
    if (isNaN(valueOfPolymer) || valueOfPolymer <= 0 || valueOfPolymer > 14) {
      showSnackbar(
        'pH Value of Polymer must be an integer greater than 0 and less than or equal to 14',
        'error',
      );
      return false;
    }
    const contentOfPolymer = parseInt(flushingOperationsData.contentOfPolymer);
    if (
      isNaN(contentOfPolymer) ||
      contentOfPolymer <= 0 ||
      contentOfPolymer > 100
    ) {
      showSnackbar(
        'Sand content of Polymer must be an integer greater than 0 and less than or equal to 100%',
        'error',
      );
      return false;
    }

    const depthOfBore = parseFloat(flushingOperationsData.depthOfBore);
    if (
      isNaN(depthOfBore) ||
      depthOfBore <= 0 ||
      depthOfBore > 100 ||
      !/^\d+(\.\d{1,3})?$/.test(depthOfBore.toString())
    ) {
      showSnackbar(
        'Depth of Bore must be greater than 0, up to 3 decimal places, and less than or equal to 100 meters',
        'error',
      );
      return false;
    }

    return true;
  };
  const validateBoringOfPileData = (boringOfPileData: any): boolean => {
    const densityOfPolymer = parseFloat(boringOfPileData.densityOfPolymer);
    if (
      isNaN(densityOfPolymer) ||
      densityOfPolymer <= 0 ||
      densityOfPolymer > 5 ||
      !/^\d+(\.\d{1,2})?$/.test(densityOfPolymer.toString())
    ) {
      showSnackbar(
        'Density of Polymer must be greater than 0, up to 2 decimal places, and less than or equal to 5 gm/ml',
        'error',
      );
      return false;
    }

    const viscosityOfPolymer = parseInt(boringOfPileData.viscosityOfPolymer);
    if (
      isNaN(viscosityOfPolymer) ||
      viscosityOfPolymer <= 0 ||
      viscosityOfPolymer > 500
    ) {
      showSnackbar(
        'Viscosity of Polymer must be an integer greater than 0 and less than or equal to 500 sec/liter',
        'error',
      );
      return false;
    }

    const valueOfPolymer = parseInt(boringOfPileData.valueOfPolymer);
    if (isNaN(valueOfPolymer) || valueOfPolymer <= 0 || valueOfPolymer > 14) {
      showSnackbar(
        'pH Value of Polymer must be an integer greater than 0 and less than or equal to 14',
        'error',
      );
      return false;
    }

    const contentOfPolymer = parseInt(boringOfPileData.contentOfPolymer);
    if (
      isNaN(contentOfPolymer) ||
      contentOfPolymer <= 0 ||
      contentOfPolymer > 100
    ) {
      showSnackbar(
        'Sand content of Polymer must be an integer greater than 0 and less than or equal to 100%',
        'error',
      );
      return false;
    }
    const depthOfBore = parseFloat(boringOfPileData.depthOfBore);
    if (
      isNaN(depthOfBore) ||
      depthOfBore <= 0 ||
      depthOfBore > 100 ||
      !/^\d+(\.\d{1,3})?$/.test(depthOfBore.toString())
    ) {
      showSnackbar(
        'Depth of Bore must be greater than 0 and less than or equal to 100 meters up to 3 decimal places, ',
        'error',
      );
      return false;
    }

    return true;
  };
  const validateChippingAndRemovalData = (
    chippingAndRemovalOfConcreteData: any,
  ): boolean => {
    const noOfDaysOfChipping = parseInt(
      chippingAndRemovalOfConcreteData.noOfDaysOfChipping,
    );
    if (
      isNaN(noOfDaysOfChipping) ||
      noOfDaysOfChipping <= 0 ||
      noOfDaysOfChipping > 100
    ) {
      showSnackbar(
        'Number of days of chipping must be a positive integer and less than or equal to 100',
        'error',
      );
      return false;
    }

    return true;
  };
  const validateGlueingData = (glueingData: any): boolean => {
    for (const item of glueingData) {
      // Parsing values to float/integer
      const ambientTemperature = parseFloat(item.ambientTemperature);
      const segmentSurfaceArea = parseFloat(item.segmentSurfaceArea);
      const epoxyConsumptionTheoreticalResin = parseFloat(
        item.epoxyConsumptionTheoreticalResin,
      );
      const epoxyConsumptionTheoreticalHardener = parseFloat(
        item.epoxyConsumptionTheoreticalHardener,
      );
      const epoxyConsumptionActualResin = parseFloat(
        item.epoxyConsumptionActualResin,
      );
      const epoxyConsumptionActualHardener = parseFloat(
        item.epoxyConsumptionActualHardener,
      );
      const batchNoResin = parseInt(item.batchNoResin, 10);
      const batchNoHardener = parseInt(item.batchNoHardener, 10);

      // Validation checks
      if (!item.jointNumbers || item.jointNumbers.length > 50) {
        showSnackbar(
          'Joint Numbers must be non-empty and up to 50 characters.',
          'error',
        );
        return false;
      }
      if (
        isNaN(ambientTemperature) ||
        ambientTemperature <= 0 ||
        ambientTemperature > 100
      ) {
        showSnackbar(
          'Ambient Temperature must be greater than 0 and up to 100, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (
        !Number.isInteger(batchNoResin) ||
        batchNoResin <= 0 ||
        batchNoResin > 100
      ) {
        showSnackbar(
          'Batch No Resin must be a positive integer up to 100.',
          'error',
        );
        return false;
      }
      if (
        !Number.isInteger(batchNoHardener) ||
        batchNoHardener <= 0 ||
        batchNoHardener > 100
      ) {
        showSnackbar(
          'Batch No Hardener must be a positive integer up to 100.',
          'error',
        );
        return false;
      }
      if (
        !item.mixingStartTime ||
        !item.mixingFinishTime ||
        !item.applicationStartTime ||
        !item.applicationFinishTime ||
        !item.segmentJoiningTimeClosure ||
        !item.segmentJoiningTimeTemporaryFinish
      ) {
        showSnackbar('All time fields must be filled.', 'error');
        return false;
      }
      if (
        isNaN(segmentSurfaceArea) ||
        segmentSurfaceArea <= 0 ||
        segmentSurfaceArea > 1000
      ) {
        showSnackbar(
          'Segment Surface Area must be greater than 0 and up to 1000 sqm, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (
        isNaN(epoxyConsumptionTheoreticalResin) ||
        epoxyConsumptionTheoreticalResin <= 0 ||
        epoxyConsumptionTheoreticalResin > 1000
      ) {
        showSnackbar(
          'Epoxy Consumption Theoretical Resin must be greater than 0 and up to 1000 kgs, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (
        isNaN(epoxyConsumptionTheoreticalHardener) ||
        epoxyConsumptionTheoreticalHardener <= 0 ||
        epoxyConsumptionTheoreticalHardener > 1000
      ) {
        showSnackbar(
          'Epoxy Consumption Theoretical Hardener must be greater than 0 and up to 1000 kgs, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (
        isNaN(epoxyConsumptionActualResin) ||
        epoxyConsumptionActualResin <= 0 ||
        epoxyConsumptionActualResin > 1000
      ) {
        showSnackbar(
          'Epoxy Consumption Actual Resin must be greater than 0 and up to 1000 kgs, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (
        isNaN(epoxyConsumptionActualHardener) ||
        epoxyConsumptionActualHardener <= 0 ||
        epoxyConsumptionActualHardener > 1000
      ) {
        showSnackbar(
          'Epoxy Consumption Actual Hardener must be greater than 0 and up to 1000 kgs, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
    }

    // Convert the values back to numbers after validation
    glueingData.forEach((item: any) => {
      item.ambientTemperature = Number(item.ambientTemperature);
      item.segmentSurfaceArea = Number(item.segmentSurfaceArea);
      item.epoxyConsumptionTheoreticalResin = Number(
        item.epoxyConsumptionTheoreticalResin,
      );
      item.epoxyConsumptionTheoreticalHardener = Number(
        item.epoxyConsumptionTheoreticalHardener,
      );
      item.epoxyConsumptionActualResin = Number(
        item.epoxyConsumptionActualResin,
      );
      item.epoxyConsumptionActualHardener = Number(
        item.epoxyConsumptionActualHardener,
      );
      item.batchNoResin = Number(item.batchNoResin);
      item.batchNoHardener = Number(item.batchNoHardener);
    });

    return true;
  };

  const validateGroutingData = (groutingData: any): boolean => {
    const wcRatio = parseFloat(groutingData.wcRatio);
    const mixingWaterTemp = parseFloat(groutingData.mixingWaterTemp);
    const groutTemp = parseFloat(groutingData.groutTemp);
    const volumeOfGrout = parseFloat(groutingData.volumeOfGrout);
    const groutingPressure = parseFloat(groutingData.groutingPressure);
    const cementConsumptionTheoretical = parseFloat(
      groutingData.cementConsumptionTheoretical,
    );
    const cementConsumptionActual = parseFloat(
      groutingData.cementConsumptionActual,
    );

    if (isNaN(wcRatio) || wcRatio <= 0 || wcRatio > 2) {
      showSnackbar(
        'W/C Ratio must be greater than 0 and less than or equal to 2, with up to 2 decimal places.',
        'error',
      );
      return false;
    }

    if (
      isNaN(mixingWaterTemp) ||
      mixingWaterTemp <= 0 ||
      mixingWaterTemp > 60
    ) {
      showSnackbar(
        'Temperature of Mixing Water must be greater than 0 and less than or equal to 60°C, with up to 2 decimal places.',
        'error',
      );
      return false;
    }

    if (isNaN(groutTemp) || groutTemp <= 0 || groutTemp > 60) {
      showSnackbar(
        'Temperature of Grout must be greater than 0 and less than or equal to 60°C, with up to 2 decimal places.',
        'error',
      );
      return false;
    }

    if (isNaN(volumeOfGrout) || volumeOfGrout <= 0 || volumeOfGrout > 1000) {
      showSnackbar(
        'Volume of Grout must be greater than 0 and less than or equal to 1000L, with up to 2 decimal places.',
        'error',
      );
      return false;
    }

    if (
      isNaN(groutingPressure) ||
      groutingPressure <= 0 ||
      groutingPressure > 50
    ) {
      showSnackbar(
        'Grouting Pressure must be greater than 0 and less than or equal to 50 Kg/cm², with up to 2 decimal places.',
        'error',
      );
      return false;
    }

    if (
      isNaN(cementConsumptionTheoretical) ||
      cementConsumptionTheoretical <= 0 ||
      cementConsumptionTheoretical > 1000
    ) {
      showSnackbar(
        'Cement Consumption Theoretical must be greater than 0 and less than or equal to 1000, with up to 2 decimal places.',
        'error',
      );
      return false;
    }

    if (
      isNaN(cementConsumptionActual) ||
      cementConsumptionActual <= 0 ||
      cementConsumptionActual > 1000
    ) {
      showSnackbar(
        'Cement Consumption Actual must be greater than 0 and less than or equal to 1000, with up to 2 decimal places.',
        'error',
      );
      return false;
    }

    if (!groutingData.prestressingDate || !groutingData.groutingDate) {
      showSnackbar(
        'Prestressing Date and Grouting Date must not be empty.',
        'error',
      );
      return false;
    }
    if (!groutingData.startTime || !groutingData.finishTime) {
      showSnackbar('Provide Start time and Finish time', 'error');
      return false;
    }
    // If validation passes, convert the required fields to numbers
    groutingData.wcRatio = Number(groutingData.wcRatio);
    groutingData.mixingWaterTemp = Number(groutingData.mixingWaterTemp);
    groutingData.groutTemp = Number(groutingData.groutTemp);
    groutingData.volumeOfGrout = Number(groutingData.volumeOfGrout);
    groutingData.groutingPressure = Number(groutingData.groutingPressure);
    groutingData.cementConsumptionTheoretical = Number(
      groutingData.cementConsumptionTheoretical,
    );
    groutingData.cementConsumptionActual = Number(
      groutingData.cementConsumptionActual,
    );
    return true;
  };

  const onFillChecklist = (rfiStatus: string) => {
    if (!rfiDate) {
      Alert.alert('Error', 'Date is required.');
      return false;
    }

    if (!comments) {
      Alert.alert('Error', 'Recommendations is required.');
      return false;
    }
    //return;
    let rfiSubmitDateTime = `${getDbDateFromDDMMYYYY(rfiDate)} ${rfiTime}:00`;
    let checkList = {};

    switch (selectedTask?.name) {
      case TASK_TYPES.CNG_AND_SETTING_OUT:
      case TASK_TYPES.PLACING_OF_SHEATHING_DUCT:
      case TASK_TYPES.POST_CONCRETE_CHECK:
        if (!imageObject?.fileData) {
          showSnackbar('Please upload an image file', 'error');
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          base64Image: imageObject.fileData,
        };
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
          formworkFitConcreting: formworkFitConcreting,
        };
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
          couplerArrangementsWithinTolerance:
            couplerArrangementsWithinTolerance,
          barBendingScheduleChecked: barBendingScheduleChecked,
          spacerBarCheckedGFC: spacerBarCheckedGFC,
        };
        break;
      case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
        checkList = {
          taskName: selectedTask.name,
          rebarAndDimensionGFC: rebarAndDimensionGFC,
          shapingNoAndLengthOfBarsGFC: shapingNoAndLengthOfBarsGFC,
          rebarsSecurelyTightened: rebarsSecurelyTightened,
          spliceLengthAndLocationGFC: spliceLengthAndLocationGFC,
          rebarWithinToleranceLimit: rebarWithinToleranceLimit,
          couplerArrangementsWithinTolerance:
            couplerArrangementsWithinTolerance,
          barBendingScheduleChecked: barBendingScheduleChecked,
        };
        break;
      case TASK_TYPES.EXCAVATION:
        checkList = {
          taskName: selectedTask.name,
          quantity: quantity,
        };
        break;
      case TASK_TYPES.REMOVAL_OF_SHUTTER:
      case TASK_TYPES.REMOVAL_OF_SHUTTERS:
        checkList = {
          taskName: selectedTask.name,
          concreteHasAchievedDesiredStrength:
            concreteHasAchievedDesiredStrength,
          minimumTimeHasBeenAttained: minimumTimeHasBeenAttained,
        };
        break;
      case TASK_TYPES.THREADING_OF_PRE_STRESSING_STRANDS:
        checkList = {
          taskName: selectedTask.name,
        };
        break;
      case TASK_TYPES.CAGE_LOWERING:
        checkList = {
          taskName: selectedTask.name,
          plieShaftCleanedLooseMaterial: plieShaftCleanedLooseMaterial,
          suitableSpacerProvidedToMaintainCoverToSteel:
            suitableSpacerProvidedToMaintainCoverToSteel,
          noLBendBottomOfTheCageChecked: noLBendBottomOfTheCageChecked,
        };
        break;
      case TASK_TYPES.BORING_OF_PILE:
        if (!validateBoringOfPileData(boringOfPileData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          boringOfPileData: {
            densityOfPolymer: Number(boringOfPileData.densityOfPolymer),
            viscosityOfPolymer: Number(boringOfPileData.viscosityOfPolymer),
            valueOfPolymer: Number(boringOfPileData.valueOfPolymer),
            contentOfPolymer: Number(boringOfPileData.contentOfPolymer),
            depthOfBore: Number(boringOfPileData.depthOfBore),
          },
        };
        break;
      case TASK_TYPES.FLUSHING_OPERATIONS:
        if (!validateFlushingOperationsData(flushingOperationsData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          flushingOperationsData: {
            startTimeOfFlushing: flushingOperationsData.startTimeOfFlushing,
            finishTimeOfFlushing: flushingOperationsData.finishTimeOfFlushing,
            whetherPourCleared: flushingOperationsData.whetherPourCleared,
            densityOfPolymer: Number(flushingOperationsData.densityOfPolymer),
            viscosityOfPolymer: Number(
              flushingOperationsData.viscosityOfPolymer,
            ),
            valueOfPolymer: Number(flushingOperationsData.valueOfPolymer),
            contentOfPolymer: Number(flushingOperationsData.contentOfPolymer),
            depthOfBore: Number(flushingOperationsData.depthOfBore),
          },
        };
        break;
      case TASK_TYPES.CHIPPING_AND_REMOVAL_OF_CONCRETE_ABOVE_CUT_OFF_LEVEL:
        if (!validateChippingAndRemovalData(chippingAndRemovalOfConcreteData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          chippingAndRemovalOfConcreteData: {
            noOfDaysOfChipping: Number(
              chippingAndRemovalOfConcreteData.noOfDaysOfChipping,
            ),
          },
        };
        break;
      case TASK_TYPES.CONCRETING:
      case TASK_TYPES.PCC_LEVELLING_COURSE:
        const isDataValid = validateConcreteData(selectedTask?.name);
        if (!isDataValid) {
          return;
        }
        concreteData.forEach((item: any) => {
          delete item.key;
          if (selectedTask.name === TASK_TYPES.CONCRETING) {
            item.concreteTemp = Number(item.concreteTemp);
            item.slumpValue = Number(item.slumpValue);
          } else {
            delete item.concreteTemp;
            delete item.slumpValue;
          }
          item.concretePoured = Number(item.concretePoured);
        });
        checkList = {
          taskName: selectedTask.name,
          concreteData: concreteData,
        };
        break;
      case TASK_TYPES.GLUEING:
        const isDataValid1 = validateGlueingData(glueingData);
        if (!isDataValid1) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          glueingData: glueingData,
        };
        break;

      case TASK_TYPES.GROUTING:
        if (!validateGroutingData(groutingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          groutingData: groutingData,
        };
        break;
      default:
        break;
    }
    dispatch(
      fillRFIsChecklist({
        projectId: loggedInUser.projectId,
        projectModuleId: projectModuleId,
        rfiId: rfiId,
        status: rfiStatus,
        body: {
          checkList: checkList,
          additionalData: {
            comments: comments,
            rfiSubmitDateTime: rfiSubmitDateTime,
          },
        },
      }),
    );
  };

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
        const responseImage = response.assets?.length
          ? response.assets[0]
          : response.assets
          ? response.assets
          : response;

        setImageObject({
          filePath: responseImage,
          fileData: responseImage.base64,
          fileUri: responseImage.uri,
        });
      }
    });
  };

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
        const responseImage = response.assets?.length
          ? response.assets[0]
          : response.assets
          ? response.assets
          : response;

        setImageObject({
          filePath: responseImage,
          fileData: responseImage.base64,
          fileUri: responseImage.uri,
        });
      }
    });
  };

  const renderFileData = () => {
    if (imageObject.fileData) {
      return (
        <Image
          source={{uri: 'data:image/jpeg;base64,' + imageObject.fileData}}
          style={styles.images}
        />
      );
    } else {
      return (
        <Image
          source={require('./../../images/dummy.png')} // ./assets/dummy.png
          style={styles.images}
        />
      );
    }
  };

  const renderFileUri = () => {
    if (imageObject.fileUri) {
      return (
        <Image source={{uri: imageObject.fileUri}} style={styles.images} />
      );
    } else {
      return (
        <Image
          source={require('./../../images/galeryImages.jpg')} // ./assets/galeryImages.jpg
          style={styles.images}
        />
      );
    }
  };

  const openCloseCalendar = () => {
    setOpenCalendar(!openCalendar);
    // if (!openCalendar) {
    //   setLayoutHeight(DEFAULT_COMPONENT_HEIGHT + DEFAULT_CALENDAR_HEIGHT)
    // } else {
    //   setLayoutHeight(DEFAULT_COMPONENT_HEIGHT)
    // }
  };

  const onAddMoreConcrete = () => {
    setConcreteData([
      ...concreteData,
      {
        vehicleNo: '',
        timeOfArrival: '',
        gradeOfConcrete: '',
        concreteTemp: 0,
        slumpValue: 0,
        concretePoured: 0,
        concreteStartTime: '',
        concreteFinishTime: '',
        key: Guid.create(),
      },
    ]);
  };
  const onAddMoreGlueing = () => {
    setGlueingData([
      ...glueingData,
      {
        jointNumbers: '',
        ambientTemperature: 0,
        batchNoResin: 0,
        batchNoHardener: 0,
        mixingStartTime: '',
        mixingFinishTime: '',
        applicationStartTime: '',
        applicationFinishTime: '',
        segmentJoiningTimeClosure: '',
        segmentJoiningTimeTemporaryFinish: '',
        segmentSurfaceArea: 0,
        epoxyConsumptionTheoreticalResin: 0,
        epoxyConsumptionTheoreticalHardener: 0,
        epoxyConsumptionActualResin: 0,
        epoxyConsumptionActualHardener: 0,
        key: Guid.create(),
      },
    ]);
  };
  const {showSnackbar} = useSnackbar();
  const renderGlueingHeadings = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 5,
      }}>
      <View style={{width: 50, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>TM No.</Text>
      </View>
      <View style={{width: 50, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>Joint No.</Text>
      </View>
      <View style={{width: 100, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>Ambient Temp (°C)</Text>
      </View>
      <View style={{width: 150, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>Batch No Resin</Text>
      </View>
      <View style={{width: 150, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>Batch No Hardener</Text>
      </View>
      <View style={{width: 130, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>Mixing Start Time</Text>
      </View>
      <View style={{width: 130, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Mixing Finish Time
        </Text>
      </View>
      <View style={{width: 150, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Application Start Time
        </Text>
      </View>
      <View style={{width: 150, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Application Finish Time
        </Text>
      </View>
      <View style={{width: 180, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Segment Joining Time Closure
        </Text>
      </View>
      <View style={{width: 220, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Segment Joining Time Temporary PT Finish
        </Text>
      </View>
      <View style={{width: 150, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Segment Surface Area (SQM)
        </Text>
      </View>
      <View style={{width: 200, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Epoxy Consumption Theoretical Resin (Kgs)
        </Text>
      </View>
      <View style={{width: 200, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Epoxy Consumption Theoretical Hardener (Kgs)
        </Text>
      </View>
      <View style={{width: 200, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Epoxy Consumption Actual Resin (Kgs)
        </Text>
      </View>
      <View style={{width: 200, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Epoxy Consumption Actual Hardener (Kgs)
        </Text>
      </View>
      <View style={{width: 80, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>Actions</Text>
      </View>
    </View>
  );

  const renderHeadings = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 5,
      }}>
      <View style={{width: 50, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>TM No.</Text>
      </View>
      <View style={{width: 100, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>Vehicle No.</Text>
      </View>
      <View style={{width: 150, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>Time of arrival</Text>
      </View>
      <View style={{width: 130, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>Grade of Concrete</Text>
      </View>
      {selectedTask.name === TASK_TYPES.CONCRETING && (
        <View style={{width: 130, alignItems: 'center', padding: 5}}>
          <Text style={{fontWeight: '600', fontSize: 12}}>
            Concrete temp in C
          </Text>
        </View>
      )}

      {selectedTask.name === TASK_TYPES.CONCRETING && (
        <View style={{width: 130, alignItems: 'center', padding: 5}}>
          <Text style={{fontWeight: '600', fontSize: 12}}>
            Slump value in mm
          </Text>
        </View>
      )}

      <View style={{width: 150, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Concrete start time
        </Text>
      </View>
      <View style={{width: 150, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Concrete poured in cum
        </Text>
      </View>
      <View style={{width: 150, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>
          Concrete finish time
        </Text>
      </View>
      <View style={{width: 80, alignItems: 'center', padding: 5}}>
        <Text style={{fontWeight: '600', fontSize: 12}}>Actions</Text>
      </View>
    </View>
  );
  // Function to render each list item
  const handleTimeChange = (index: any, field: any, value: any) => {
    const newData = [...concreteData];
    newData[index][field] = value;
    setConcreteData(newData);
  };
  const handleTimeChangeGlueing = (index: any, field: any, value: any) => {
    const newData = [...glueingData];
    newData[index][field] = value;
    setGlueingData(newData);
  };
  const handleTextInputChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const newData = [...concreteData];
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'vehicleNo':
        const vehicleNoRegex = /^\d{4}$/;
        if (!vehicleNoRegex.test(value)) {
          isValid = false;
          errorMessage = 'Enter only the last 4 digits of the vehicle number';
        }
        break;

      case 'concreteTemp':
        const tempValue = parseFloat(value);
        if (
          isNaN(tempValue) ||
          tempValue <= 0 ||
          tempValue > 60 ||
          value.split('.')[1]?.length > 2
        ) {
          isValid = false;
          errorMessage =
            'Enter a temperature between 0 and 60 with up to 2 decimal places';
        }
        break;

      case 'slumpValue':
        const slumpValue = parseInt(value);
        if (
          isNaN(slumpValue) ||
          slumpValue <= 0 ||
          slumpValue > 300 ||
          !Number.isInteger(slumpValue)
        ) {
          isValid = false;
          errorMessage = 'Enter an integer between 1 and 300 for slump value';
        }
        break;

      case 'concretePoured':
        const cubesValue = parseInt(value);
        if (
          isNaN(cubesValue) ||
          cubesValue <= 0 ||
          cubesValue > 100 ||
          !Number.isInteger(cubesValue)
        ) {
          isValid = false;
          errorMessage =
            'Enter an integer between 1 and 100 for number of cubes casted';
        }
        break;
    }

    if (isValid) {
      newData[index][field] = value;
      setConcreteData(newData);
    } else {
      newData[index][field] = value;
      setConcreteData(newData);
      showSnackbar(errorMessage, 'error');
    }
  };
  const validateConcreteData = (taskName: string) => {
    let isValid = true;

    concreteData.forEach((item, index) => {
      if (!item.vehicleNo.match(/^\d{4}$/)) {
        isValid = false;
        showSnackbar(
          `TM ${index + 1}: Enter the last 4 digits of the vehicle number.`,
          'error',
        );
        return;
      }

      if (!item.timeOfArrival) {
        isValid = false;
        showSnackbar(`TM ${index + 1}: Time of arrival is required.`, 'error');
        return;
      }

      if (!item.gradeOfConcrete) {
        isValid = false;
        showSnackbar(
          `TM ${index + 1}: Grade of concrete is required.`,
          'error',
        );
        return;
      }

      if (selectedTask.name === TASK_TYPES.CONCRETING) {
        const tempValue = parseFloat(item.concreteTemp.toString());
        if (
          isNaN(tempValue) ||
          tempValue <= 0 ||
          tempValue > 60 ||
          item.concreteTemp.toString().split('.')[1]?.length > 2
        ) {
          isValid = false;
          showSnackbar(
            `TM ${
              index + 1
            }: Enter a temperature between 0 and 60 with up to 2 decimal places.`,
            'error',
          );
          return;
        }

        const slumpValue = parseInt(item.slumpValue.toString());
        if (
          isNaN(slumpValue) ||
          slumpValue <= 0 ||
          slumpValue > 300 ||
          !Number.isInteger(slumpValue)
        ) {
          isValid = false;
          showSnackbar(
            `TM ${
              index + 1
            }: Enter an integer between 1 and 300 for slump value in mm.`,
            'error',
          );
          return;
        }
      }
      const cubesValue = parseInt(item.concretePoured.toString());
      if (
        isNaN(cubesValue) ||
        cubesValue <= 0 ||
        cubesValue > 100 ||
        !Number.isInteger(cubesValue)
      ) {
        isValid = false;
        showSnackbar(
          `TM ${
            index + 1
          }: Enter an integer between 1 and 100 for number of cubes casted.`,
          'error',
        );
        return;
      }

      if (!item.concreteStartTime) {
        isValid = false;
        showSnackbar(
          `TM ${index + 1}: Concrete start time is required.`,
          'error',
        );
        return;
      }

      if (!item.concreteFinishTime) {
        isValid = false;
        showSnackbar(
          `TM ${index + 1}: Concrete finish time is required.`,
          'error',
        );
        return;
      }
    });

    return isValid;
  };

  const renderItemGlueing = (rowData: any) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 10,
      }}>
      <View style={{width: 50, alignItems: 'center'}}>
        <Text style={{fontWeight: '600', fontSize: 13}}>
          TM {rowData.index + 1}
        </Text>
      </View>

      <View style={{width: 100}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'jointNumbers'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={{width: 130}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'ambientTemperature'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={{width: 130}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'batchNoResin'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={{width: 130}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'batchNoHardener'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.mixingStartTime}
          onChange={time =>
            handleTimeChangeGlueing(rowData.index, 'mixingStartTime', time)
          }
        />
      </View>

      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.mixingFinishTime}
          onChange={time =>
            handleTimeChangeGlueing(rowData.index, 'mixingFinishTime', time)
          }
        />
      </View>

      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.applicationStartTime}
          onChange={time =>
            handleTimeChangeGlueing(rowData.index, 'applicationStartTime', time)
          }
        />
      </View>

      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.applicationFinishTime}
          onChange={time =>
            handleTimeChangeGlueing(
              rowData.index,
              'applicationFinishTime',
              time,
            )
          }
        />
      </View>
      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.segmentJoiningTimeClosure}
          onChange={time =>
            handleTimeChangeGlueing(
              rowData.index,
              'segmentJoiningTimeClosure',
              time,
            )
          }
        />
      </View>
      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.applicationFinishTime}
          onChange={time =>
            handleTimeChangeGlueing(
              rowData.index,
              'segmentJoiningTimeTemporaryFinish',
              time,
            )
          }
        />
      </View>

      <View style={{width: 130}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'segmentSurfaceArea'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>
      <View style={{width: 130}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'epoxyConsumptionTheoreticalResin'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>
      <View style={{width: 130}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'epoxyConsumptionTheoreticalHardener'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={{width: 130}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'epoxyConsumptionActualResin'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>
      <View style={{width: 130}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'epoxyConsumptionActualHardener'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>
      <View style={styles.hiddenContainer}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => deleteGlueingItem(rowData, rowData.item.key)}>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('./../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleTextInputChangeGlueing = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedData = [...glueingData];
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'jointNumbers':
        if (value.length > 50) {
          isValid = false;
          errorMessage = 'Joint Numbers cannot exceed 50 characters';
        }
        break;

      case 'ambientTemperature':
        const tempValue = parseFloat(value);
        if (
          isNaN(tempValue) ||
          tempValue <= 0 ||
          tempValue > 100 ||
          value.split('.')[1]?.length > 2
        ) {
          isValid = false;
          errorMessage =
            'Enter a temperature between 0 and 100 with up to 2 decimal places';
        }
        break;

      case 'batchNoResin':
      case 'batchNoHardener':
        const batchNo = parseInt(value);
        if (
          isNaN(batchNo) ||
          batchNo <= 0 ||
          batchNo > 100 ||
          !Number.isInteger(batchNo)
        ) {
          isValid = false;
          errorMessage =
            'Enter a positive integer between 1 and 100 for batch number';
        }
        break;

      case 'segmentSurfaceArea':
        const surfaceArea = parseFloat(value);
        if (
          isNaN(surfaceArea) ||
          surfaceArea <= 0 ||
          surfaceArea > 1000 ||
          value.split('.')[1]?.length > 2
        ) {
          isValid = false;
          errorMessage =
            'Enter a surface area up to 1000 SQM with up to 2 decimal places';
        }
        break;

      case 'epoxyConsumptionTheoreticalResin':
      case 'epoxyConsumptionTheoreticalHardener':
      case 'epoxyConsumptionActualResin':
      case 'epoxyConsumptionActualHardener':
        const epoxyConsumption = parseFloat(value);
        if (
          isNaN(epoxyConsumption) ||
          epoxyConsumption <= 0 ||
          epoxyConsumption > 1000 ||
          value.split('.')[1]?.length > 2
        ) {
          isValid = false;
          errorMessage =
            'Enter epoxy consumption up to 1000 Kgs with up to 2 decimal places';
        }
        break;

      default:
        break;
    }

    if (isValid) {
      updatedData[index][field] = value;
      setGlueingData(updatedData);
    } else {
      updatedData[index][field] = value; // To reflect changes even with an error
      setGlueingData(updatedData);
      showSnackbar(errorMessage, 'error');
    }
  };

  const renderItem = (rowData: any) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 10,
      }}>
      <View style={{width: 50, alignItems: 'center'}}>
        <Text style={{fontWeight: '600', fontSize: 13}}>
          TM {rowData.index + 1}
        </Text>
      </View>
      <View style={{width: 100}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'vehicleNo'}
          index={rowData.index}
          onChange={handleTextInputChange}></CustomTextInputValue>
      </View>
      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.timeOfArrival}
          style={styles.disPlayNone}
          styleCont={styles.marginBootomZero}
          onChange={time =>
            handleTimeChange(rowData.index, 'timeOfArrival', time)
          }
        />
      </View>
      <View style={{width: 130}}>
        <DropdownPicker
          label=""
          value={rowData.item.gradeOfConcrete}
          items={CONCRETE_GRADE_LIST}
          style={styles.marginBootomZero}
          onChange={(newValue: string) => {
            const newData = [...concreteData];
            newData[rowData.index]['gradeOfConcrete'] = newValue;
            setConcreteData(newData);
          }}
          isRequired={true}
        />
      </View>
      {selectedTask.name === TASK_TYPES.CONCRETING && (
        <View style={{width: 130}}>
          <CustomTextInputValue
            rowItem={rowData.item}
            fieldName={'concreteTemp'}
            index={rowData.index}
            onChange={handleTextInputChange}></CustomTextInputValue>
        </View>
      )}

      {selectedTask.name === TASK_TYPES.CONCRETING && (
        <View style={{width: 140}}>
          <CustomTextInputValue
            rowItem={rowData.item}
            fieldName={'slumpValue'}
            index={rowData.index}
            onChange={handleTextInputChange}></CustomTextInputValue>
        </View>
      )}

      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.concreteStartTime}
          style={styles.disPlayNone}
          styleCont={styles.marginBootomZero}
          onChange={time =>
            handleTimeChange(rowData.index, 'concreteStartTime', time)
          }
        />
      </View>

      <View style={{width: 130}}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'concretePoured'}
          index={rowData.index}
          onChange={handleTextInputChange}></CustomTextInputValue>
      </View>

      <View style={{width: 150}}>
        <TimePicker
          label=""
          value={rowData.item.concreteFinishTime}
          style={styles.disPlayNone}
          styleCont={styles.marginBootomZero}
          onChange={time =>
            handleTimeChange(rowData.index, 'concreteFinishTime', time)
          }
        />
      </View>
      <View style={styles.hiddenContainer}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => deleteItem(rowData, rowData.item.key)}>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('./../../images/menu/delete.png')}
          />
        </TouchableOpacity>
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
    const prevIndex = concreteData.findIndex(
      item => item.gradeOfConcrete === rowKey,
    );
    newData.splice(prevIndex, 1);
    setConcreteData(newData);
  };
  //Function to delete glueing row
  const deleteGlueingItem = (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...glueingData];
    const prevIndex = glueingData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setGlueingData(newData);
  };
  // Function to handle row open event
  const onRowOpen = (rowKey: any) => {
    console.log('Opened row with key:', rowKey);
  };

  // Function to render hidden swipe actions
  const renderHiddenItem = (rowData: any, rowMap: any) => (
    <View style={styles.hiddenContainer}>
      <TouchableOpacity
        style={[styles.closeButton]}
        onPress={() => closeRow(rowMap, rowData.item.key)}>
        {/* <Text style={styles.buttonText}>Close</Text>  */}
        <Image
          style={styles.CloseIcon}
          source={require('./../../images/menu/close-icon.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.deleteButton]}
        onPress={() => deleteItem(rowMap, rowData.item.key)}>
        <Image
          style={[styles.CloseIcon, {tintColor: '#fff'}]}
          source={require('./../../images/menu/delete.png')}
        />
        {/* <Text style={styles.buttonText}>Delete</Text>  */}
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
    );
  };

  const [enableScroll, setEnableScroll] = useState(true);
  const onSwipeValueChange = (data: any) => {
    if (data.value < 0) {
      setEnableScroll(false);
    } else {
      setEnableScroll(true);
    }
  };

  const taskForm = (taskName: any) => {
    switch (taskName) {
      case TASK_TYPES.CNG_AND_SETTING_OUT:
      case TASK_TYPES.PLACING_OF_SHEATHING_DUCT:
      case TASK_TYPES.POST_CONCRETE_CHECK:
        return (
          <View>
            <Text
              style={{textAlign: 'center', fontSize: 20, paddingBottom: 10}}>
              Pick Image from Camera & Gallery
            </Text>
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

            <View
              style={[
                styles.btnParentSection,
                {flexDirection: 'row', gap: 20, justifyContent: 'center'},
              ]}>
              <TouchableOpacity
                onPress={launchCamera}
                style={styles.btnSection}>
                <Text style={styles.btnText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={launchImageLibrary}
                style={styles.btnSection}>
                <Text style={styles.btnText}>Gallery</Text>
              </TouchableOpacity>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.FORM_WORK:
      case TASK_TYPES.PLACEMENT_OF_INNER_SHUTTERS:
      case TASK_TYPES.PLACEMENT_OF_SIDE_SHUTTERS:
      case TASK_TYPES.PLACEMENT_OF_BOTTOM_SHUTTER:
      case TASK_TYPES.PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Cleanliness and Oil application checked
              </Text>
              <View
                style={[
                  styles.SectionStyle,
                  {zIndex: 16, height: 50, borderColor: '#FF0000'},
                ]}>
                <DropDownPicker
                  open={openCleanliness}
                  value={cleanliness}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  setOpen={setOpenCleanliness}
                  setValue={setCleanliness}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Formwork alignment checked</Text>
              <View style={[styles.SectionStyle, {zIndex: 15, height: 50}]}>
                <DropDownPicker
                  open={openFormworkAlignmentChecked}
                  value={formworkAlignmentChecked}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  setOpen={setOpenFormworkAlignmentChecked}
                  setValue={setFormworkAlignmentChecked}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Formwork tightness/sealing checked
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 14, height: 50}]}>
                <DropDownPicker
                  open={openFormworkSealingChecked}
                  value={formworkSealingChecked}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  setOpen={setOpenFormworkSealingChecked}
                  setValue={setFormworkSealingChecked}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Required covers provided as per drawings checked
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 13, height: 50}]}>
                <DropDownPicker
                  open={openFormworkdDrawingsChecked}
                  value={formworkdDrawingsChecked}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  setOpen={setOpenFormworkdDrawingsChecked}
                  setValue={setFormworkdDrawingsChecked}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Concrete finish level marked</Text>
              <View style={[styles.SectionStyle, {zIndex: 12, height: 50}]}>
                <DropDownPicker
                  open={openConcreteFinishLevelMarked}
                  value={concreteFinishLevelMarked}
                  items={YES_NO_LIST}
                  style={styles.selectDropdown}
                  setOpen={setOpenConcreteFinishLevelMarked}
                  setValue={setConcreteFinishLevelMarked}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Formwork properly supported</Text>
              <View style={[styles.SectionStyle, {zIndex: 11, height: 50}]}>
                <DropDownPicker
                  open={openFormworkProperlySupported}
                  value={formworkProperlySupported}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  setOpen={setOpenFormworkProperlySupported}
                  setValue={setFormworkProperlySupported}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Formwork fit for concreting</Text>
              <View style={[styles.SectionStyle, {zIndex: 10, height: 50}]}>
                <DropDownPicker
                  open={openFormworkFitConcreting}
                  value={formworkFitConcreting}
                  items={YES_NO_NA_LIST}
                  style={styles.selectDropdown}
                  setOpen={setOpenFormworkFitConcreting}
                  setValue={setFormworkFitConcreting}
                />
              </View>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.REINFORCEMENT:
      case TASK_TYPES.REINFORCEMENT_PREPARATION:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Rebar and dimension (dia,len and shape) checked as per GFC
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 16, height: 50}]}>
                <DropDownPicker
                  open={openRebarAndDimensionGFC}
                  value={rebarAndDimensionGFC}
                  items={YES_NO_LIST}
                  setOpen={setOpenRebarAndDimensionGFC}
                  setValue={setRebarAndDimensionGFC}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Shaping, No and Length of Bars checked as per GFC
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 15, height: 50}]}>
                <DropDownPicker
                  open={openShapingNoAndLengthOfBarsGFC}
                  value={shapingNoAndLengthOfBarsGFC}
                  items={YES_NO_LIST}
                  setOpen={setOpenShapingNoAndLengthOfBarsGFC}
                  setValue={setShapingNoAndLengthOfBarsGFC}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Rebars securely tightened/bound by tie bars
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 14, height: 50}]}>
                <DropDownPicker
                  open={openRebarsSecurelyTightened}
                  value={rebarsSecurelyTightened}
                  items={YES_NO_NA_LIST}
                  setOpen={setOpenRebarsSecurelyTightened}
                  setValue={setRebarsSecurelyTightened}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Splice length and location checked as per GFC
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 13, height: 50}]}>
                <DropDownPicker
                  open={openSpliceLengthAndLocationGFC}
                  value={spliceLengthAndLocationGFC}
                  items={YES_NO_LIST}
                  setOpen={setOpenSpliceLengthAndLocationGFC}
                  setValue={setSpliceLengthAndLocationGFC}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Rebar within tolerance limit</Text>
              <View style={[styles.SectionStyle, {zIndex: 12, height: 50}]}>
                <DropDownPicker
                  open={openRebarWithinToleranceLimit}
                  value={rebarWithinToleranceLimit}
                  items={YES_NO_LIST}
                  setOpen={setOpenRebarWithinToleranceLimit}
                  setValue={setRebarWithinToleranceLimit}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Coupler arrangements within tolerance
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 11, height: 50}]}>
                <DropDownPicker
                  open={openCouplerArrangementsWithinTolerance}
                  value={couplerArrangementsWithinTolerance}
                  items={YES_NO_NA_LIST}
                  setOpen={setOpenCouplerArrangementsWithinTolerance}
                  setValue={setCouplerArrangementsWithinTolerance}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Bar Bending schedule checked</Text>
              <View style={[styles.SectionStyle, {zIndex: 10, height: 50}]}>
                <DropDownPicker
                  open={openBarBendingScheduleChecked}
                  value={barBendingScheduleChecked}
                  items={YES_NO_NA_LIST}
                  setOpen={setOpenBarBendingScheduleChecked}
                  setValue={setBarBendingScheduleChecked}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Spacer bar checked as per GFC</Text>
              <View style={[styles.SectionStyle, {zIndex: 9, height: 50}]}>
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
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.REINFORCEMENT_PREPARATION:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Rebar and dimension (dia,len and shape) checked as per GFC
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 16, height: 50}]}>
                <DropDownPicker
                  open={openRebarAndDimensionGFC}
                  value={rebarAndDimensionGFC}
                  items={YES_NO_LIST}
                  setOpen={setOpenRebarAndDimensionGFC}
                  setValue={setRebarAndDimensionGFC}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Shaping, No and Length of Bars checked as per GFC
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 15, height: 50}]}>
                <DropDownPicker
                  open={openShapingNoAndLengthOfBarsGFC}
                  value={shapingNoAndLengthOfBarsGFC}
                  items={YES_NO_LIST}
                  setOpen={setOpenShapingNoAndLengthOfBarsGFC}
                  setValue={setShapingNoAndLengthOfBarsGFC}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Rebars securely tightened/bound by tie bars
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 14, height: 50}]}>
                <DropDownPicker
                  open={openRebarsSecurelyTightened}
                  value={rebarsSecurelyTightened}
                  items={YES_NO_NA_LIST}
                  setOpen={setOpenRebarsSecurelyTightened}
                  setValue={setRebarsSecurelyTightened}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Splice length and location checked as per GFC
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 13, height: 50}]}>
                <DropDownPicker
                  open={openSpliceLengthAndLocationGFC}
                  value={spliceLengthAndLocationGFC}
                  items={YES_NO_LIST}
                  setOpen={setOpenSpliceLengthAndLocationGFC}
                  setValue={setSpliceLengthAndLocationGFC}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Rebar within tolerance limit</Text>
              <View style={[styles.SectionStyle, {zIndex: 12, height: 50}]}>
                <DropDownPicker
                  open={openRebarWithinToleranceLimit}
                  value={rebarWithinToleranceLimit}
                  items={YES_NO_LIST}
                  setOpen={setOpenRebarWithinToleranceLimit}
                  setValue={setRebarWithinToleranceLimit}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Coupler arrangements within tolerance
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 11, height: 50}]}>
                <DropDownPicker
                  open={openCouplerArrangementsWithinTolerance}
                  value={couplerArrangementsWithinTolerance}
                  items={YES_NO_NA_LIST}
                  setOpen={setOpenCouplerArrangementsWithinTolerance}
                  setValue={setCouplerArrangementsWithinTolerance}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>Bar Bending schedule checked</Text>
              <View style={[styles.SectionStyle, {zIndex: 10, height: 50}]}>
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
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.EXCAVATION:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Qty of earth work excavated in cum
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 16, height: 50}]}>
                <TextInput
                  style={styles.inputFieldsText}
                  placeholder="Quantity"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  value={'' + quantity}
                  onChangeText={text => {
                    let exp = text.replace(/[^0-9.]/g, '');
                    if (!isNaN(parseFloat(exp))) {
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
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.REMOVAL_OF_SHUTTER:
      case TASK_TYPES.REMOVAL_OF_SHUTTERS:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Whether concrete has achieved desired strength
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 16, height: 50}]}>
                <DropDownPicker
                  open={openConcreteHasAchievedDesiredStrength}
                  value={concreteHasAchievedDesiredStrength}
                  items={YES_NO_LIST}
                  setOpen={setOpenConcreteHasAchievedDesiredStrength}
                  setValue={setConcreteHasAchievedDesiredStrength}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Whether minimum time has been attained
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 15, height: 50}]}>
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
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.THREADING_OF_PRE_STRESSING_STRANDS:
        return (
          <View>
            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.CAGE_LOWERING:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Plie shaft cleaned of all loose material or not
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 16, height: 50}]}>
                <DropDownPicker
                  open={openPlieShaftCleanedLooseMaterial}
                  value={plieShaftCleanedLooseMaterial}
                  items={YES_NO_LIST}
                  setOpen={setOpenPlieShaftCleanedLooseMaterial}
                  setValue={setPlieShaftCleanedLooseMaterial}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                Suitable spacer provided to maintain the required cover to steel{' '}
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 15, height: 50}]}>
                <DropDownPicker
                  open={openSuitableSpacerProvidedToMaintainCoverToSteel}
                  value={suitableSpacerProvidedToMaintainCoverToSteel}
                  items={YES_NO_LIST}
                  setOpen={setOpenSuitableSpacerProvidedToMaintainCoverToSteel}
                  setValue={setSuitableSpacerProvidedToMaintainCoverToSteel}
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.Lable}>
                No L bend at the bottom of the Cage checked or not{' '}
              </Text>
              <View style={[styles.SectionStyle, {zIndex: 15, height: 50}]}>
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
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );

      case TASK_TYPES.BORING_OF_PILE:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Input
                label="Density of Polymer in gm/ml"
                value={boringOfPileData.densityOfPolymer}
                onChange={(value: string) =>
                  handleInputChangeBoringOfPile('densityOfPolymer', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Viscosity of Polymer in sec/liter"
                value={boringOfPileData.viscosityOfPolymer}
                onChange={(value: string) =>
                  handleInputChangeBoringOfPile('viscosityOfPolymer', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="pH value of Polymer"
                value={boringOfPileData.valueOfPolymer}
                onChange={(value: string) =>
                  handleInputChangeBoringOfPile('valueOfPolymer', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Sand content of Polymer in %"
                value={boringOfPileData.contentOfPolymer}
                onChange={(value: string) =>
                  handleInputChangeBoringOfPile('contentOfPolymer', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Depth of Bore in m"
                value={boringOfPileData.depthOfBore}
                onChange={(value: string) =>
                  handleInputChangeBoringOfPile('depthOfBore', value)
                }
              />
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );

      case TASK_TYPES.FLUSHING_OPERATIONS:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <TimePicker
                label="Start time of flushing"
                value={flushingOperationsData.startTimeOfFlushing}
                onChange={time =>
                  handleInputChangeFlushingOperations(
                    'startTimeOfFlushing',
                    time,
                  )
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <TimePicker
                label="Finish time of flushing"
                value={flushingOperationsData.finishTimeOfFlushing}
                onChange={time =>
                  handleInputChangeFlushingOperations(
                    'finishTimeOfFlushing',
                    time,
                  )
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Whether Pour cleared or not"
                value={flushingOperationsData.whetherPourCleared}
                items={YES_NO_LIST}
                onChange={(newValue: string) => {
                  handleInputChangeFlushingOperations(
                    'whetherPourCleared',
                    newValue,
                  );
                }}
                isRequired={true}
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Density of Polymer in gm/ml"
                value={boringOfPileData.densityOfPolymer}
                onChange={(value: string) =>
                  handleInputChangeFlushingOperations('densityOfPolymer', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Viscosity of Polymer in sec/liter"
                value={boringOfPileData.viscosityOfPolymer}
                onChange={(value: string) =>
                  handleInputChangeFlushingOperations(
                    'viscosityOfPolymer',
                    value,
                  )
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="pH value of Polymer"
                value={boringOfPileData.valueOfPolymer}
                onChange={(value: string) =>
                  handleInputChangeFlushingOperations('valueOfPolymer', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Sand content of Polymer in %"
                value={boringOfPileData.contentOfPolymer}
                onChange={(value: string) =>
                  handleInputChangeFlushingOperations('contentOfPolymer', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Depth of Bore in m"
                value={boringOfPileData.depthOfBore}
                onChange={(value: string) =>
                  handleInputChangeFlushingOperations('depthOfBore', value)
                }
              />
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );

      case TASK_TYPES.CHIPPING_AND_REMOVAL_OF_CONCRETE_ABOVE_CUT_OFF_LEVEL:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Input
                label="No. of days of chipping after casting of concrete"
                value={chippingAndRemovalOfConcreteData.noOfDaysOfChipping}
                onChange={(value: string) =>
                  handleInputChangeChippingAndRemovalOfConcrete(
                    'noOfDaysOfChipping',
                    value,
                  )
                }
              />
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );

      case TASK_TYPES.CONCRETING:
      case TASK_TYPES.PCC_LEVELLING_COURSE:
        if (!concreteData || !concreteData.length) {
          setConcreteData([
            {
              vehicleNo: '',
              timeOfArrival: '',
              gradeOfConcrete: '',
              concreteTemp: 0,
              slumpValue: 0,
              concretePoured: 0,
              concreteStartTime: '',
              concreteFinishTime: '',
              key: Guid.create(),
            },
          ]);
        }

        return (
          <View>
            <View style={styles.MainContainer}>
              <ScrollView
                id="scrollViewConcrete"
                showsHorizontalScrollIndicator={false}
                horizontal={enableScroll}>
                <View>
                  {renderHeadings()}
                  <FlatList
                    data={concreteData}
                    renderItem={renderItem}
                    keyExtractor={item => item.key?.toString()}
                    style={{zIndex: 10}}
                    automaticallyAdjustContentInsets={true}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>

            <View>
              <TouchableOpacity
                style={{paddingVertical: 15, zIndex: 8}}
                onPress={() => onAddMoreConcrete()}>
                <Text style={styles.AddMoreLink}>+ Add More</Text>
              </TouchableOpacity>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.GLUEING:
        if (!glueingData || !glueingData.length) {
          setGlueingData([
            {
              jointNumbers: '',
              ambientTemperature: 0,
              batchNoResin: 0,
              batchNoHardener: 0,
              mixingStartTime: '',
              mixingFinishTime: '',
              applicationStartTime: '',
              applicationFinishTime: '',
              segmentJoiningTimeClosure: '',
              segmentJoiningTimeTemporaryFinish: '',
              segmentSurfaceArea: 0,
              epoxyConsumptionTheoreticalResin: 0,
              epoxyConsumptionTheoreticalHardener: 0,
              epoxyConsumptionActualResin: 0,
              epoxyConsumptionActualHardener: 0,
              key: Guid.create(),
            },
          ]);
        }

        return (
          <View>
            <View style={styles.MainContainer}>
              <ScrollView
                id="scrollViewGlueing"
                showsHorizontalScrollIndicator={false}
                horizontal={enableScroll}>
                <View>
                  {renderGlueingHeadings()}
                  <FlatList
                    data={glueingData}
                    renderItem={renderItemGlueing}
                    keyExtractor={item => item.key?.toString()}
                    style={{zIndex: 10}}
                    automaticallyAdjustContentInsets={true}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </View>

            <View>
              <TouchableOpacity
                style={{paddingVertical: 15, zIndex: 8}}
                onPress={() => onAddMoreGlueing()}>
                <Text style={styles.AddMoreLink}>+ Add More</Text>
              </TouchableOpacity>
            </View>

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );
      //Code For Lifting
      case TASK_TYPES.LIFTING:
        if (!concreteData || !concreteData.length) {
          setConcreteData([
            {
              vehicleNo: '',
              timeOfArrival: '',
              gradeOfConcrete: '',
              concreteTemp: 0,
              slumpValue: 0,
              concretePoured: 0,
              concreteStartTime: '',
              concreteFinishTime: '',
              key: Guid.create(),
            },
          ]);
        }
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <Text style={styles.headerText}>
                Preparation of Area for Lifting at Stacking Yard
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Area is hard barricaded with proper signages"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary lights for proper illumination of the erection area is available at night"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Flag man/Marshal available"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Methodology & Scheme for lifting and stacking is available at site"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <Text style={styles.headerText}>
                Tools and Tackles for Lifting at Stacking Yard
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="De-shackles and slings of proper capacity and their test certificate by third party is available"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety color code present on the de-shackles"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Hydraulic jacks are in good condition with proper calibration certificates"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Limit switch of lifting hoist is working properly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Cotter pin are placed in all lifting assembly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Macalloy Bars / pins for lifting of Wings in proper condition"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <Text style={styles.headerText}>
                Lifting of Segment at Stacking Yard
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Work at height permit obtained from IE/concerned agency"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All Mac-alloy bars and wire rope assemblies have valid third-party test certificate"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting sequence as per the approved methodology provided at site for counter"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting holes are in proper location as per approved drawing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting arrangements are working properly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Pre-stressing duct of segments are clear of any foreign materials"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Comprehensive Strength of concrete of wings are gained as per the approved drawing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Slider trolley is in proper position"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>
                Segment Dispatch and Transportation
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sand blasting on match cast face done"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Repairing (if necessary) & finishing done"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="No repairing on shearkey & gluing location"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Bund for curing at top removed & top to be cleaned by broom"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Soffit & deck top cleaned by broomer"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sheathing duct is cleaned, no concrete at rubber bunk portion"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sheathing duct alignment ok, checked by drolly passing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary stressing hole at soffit cleaned & dimension checked"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Fitness of Trailer with proper calibration certificate"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Tyres of trailer and air pressure checked"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>
                Preparation of Area for Lifting at Erection Site
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Ground properly leveled for placement of trailer"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Area is hard barricaded with proper signages"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary lights for proper illumination of the erection area is available at night"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Flag man/Marshal available"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Methodology & Scheme for lifting and stacking is available at site"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Crane is positioned as per drawing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>
                Tools and Tackles for Lifting at Erection Site
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="De-shackles and slings of proper capacity and their test certificate by third party is available"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety color code present on the de-shackles"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Hydraulic jacks are in good condition with proper calibration certificates"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Limit switch of lifting hoist is working properly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Cotter pin are placed in all lifting assembly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Macalloy Bars / pins for lifting of Wings in proper condition"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="TPI of all parts of Cranes & Slings done"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Latest TPI Certificates of all parts of Cranes & Slings available at Site"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Counter-weights are available & placed as per drawing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>
                Lifting and Positioning of Segments
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Positioning of segment marked"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Traffic properly diverted & Traffic marshals are in place"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety & Fitness of all workers working at height checked and certified"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All Safety arrangements are placed at Site"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Segments positioned at the specified / marked location"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Necessary lateral / Site support ensured before releasing the segment by Cranes"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </ScrollView>
        );

      //Code For Lifting
      case TASK_TYPES.LIFTING:
        if (!concreteData || !concreteData.length) {
          setConcreteData([
            {
              vehicleNo: '',
              timeOfArrival: '',
              gradeOfConcrete: '',
              concreteTemp: 0,
              slumpValue: 0,
              concretePoured: 0,
              concreteStartTime: '',
              concreteFinishTime: '',
              key: Guid.create(),
            },
          ]);
        }
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <Text style={styles.headerText}>
                Preparation of Area for Lifting at Stacking Yard
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Area is hard barricaded with proper signages"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary lights for proper illumination of the erection area is available at night"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Flag man/Marshal available"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Methodology & Scheme for lifting and stacking is available at site"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <Text style={styles.headerText}>
                Tools and Tackles for Lifting at Stacking Yard
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="De-shackles and slings of proper capacity and their test certificate by third party is available"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety color code present on the de-shackles"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Hydraulic jacks are in good condition with proper calibration certificates"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Limit switch of lifting hoist is working properly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Cotter pin are placed in all lifting assembly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Macalloy Bars / pins for lifting of Wings in proper condition"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <Text style={styles.headerText}>
                Lifting of Segment at Stacking Yard
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Work at height permit obtained from IE/concerned agency"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All Mac-alloy bars and wire rope assemblies have valid third-party test certificate"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting sequence as per the approved methodology provided at site for counter"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting holes are in proper location as per approved drawing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting arrangements are working properly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Pre-stressing duct of segments are clear of any foreign materials"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Comprehensive Strength of concrete of wings are gained as per the approved drawing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Slider trolley is in proper position"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>
                Segment Dispatch and Transportation
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sand blasting on match cast face done"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Repairing (if necessary) & finishing done"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="No repairing on shearkey & gluing location"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Bund for curing at top removed & top to be cleaned by broom"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Soffit & deck top cleaned by broomer"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sheathing duct is cleaned, no concrete at rubber bunk portion"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sheathing duct alignment ok, checked by drolly passing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary stressing hole at soffit cleaned & dimension checked"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Fitness of Trailer with proper calibration certificate"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Tyres of trailer and air pressure checked"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>
                Preparation of Area for Lifting at Erection Site
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Ground properly leveled for placement of trailer"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Area is hard barricaded with proper signages"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary lights for proper illumination of the erection area is available at night"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Flag man/Marshal available"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Methodology & Scheme for lifting and stacking is available at site"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Crane is positioned as per drawing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>
                Tools and Tackles for Lifting at Erection Site
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="De-shackles and slings of proper capacity and their test certificate by third party is available"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety color code present on the de-shackles"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Hydraulic jacks are in good condition with proper calibration certificates"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Limit switch of lifting hoist is working properly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Cotter pin are placed in all lifting assembly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Macalloy Bars / pins for lifting of Wings in proper condition"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="TPI of all parts of Cranes & Slings done"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Latest TPI Certificates of all parts of Cranes & Slings available at Site"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Counter-weights are available & placed as per drawing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>
                Lifting and Positioning of Segments
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Positioning of segment marked"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Traffic properly diverted & Traffic marshals are in place"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety & Fitness of all workers working at height checked and certified"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All Safety arrangements are placed at Site"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Segments positioned at the specified / marked location"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Necessary lateral / Site support ensured before releasing the segment by Cranes"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </ScrollView>
        );

      //Code For Lifting
      case TASK_TYPES.LIFTING:
        if (!concreteData || !concreteData.length) {
          setConcreteData([
            {
              vehicleNo: '',
              timeOfArrival: '',
              gradeOfConcrete: '',
              concreteTemp: 0,
              slumpValue: 0,
              concretePoured: 0,
              concreteStartTime: '',
              concreteFinishTime: '',
              key: Guid.create(),
            },
          ]);
        }
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <Text style={styles.headerText}>Preparation of Area for Lifting at Stacking Yard</Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                    label="Area is hard barricaded with proper signages"
                    value={groutingData.outletFree}
                    items={YES_NO_NA_LIST}
                    onChange={(value: string) =>
                      handleInputChangeGrouting('outletFree', value)
                    }
                  />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                    label="Temporary lights for proper illumination of the erection area is available at night"
                    value={groutingData.outletFree}
                    items={YES_NO_NA_LIST}
                    onChange={(value: string) =>
                      handleInputChangeGrouting('outletFree', value)
                    }
                  />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                    label="Flag man/Marshal available"
                    value={groutingData.outletFree}
                    items={YES_NO_NA_LIST}
                    onChange={(value: string) =>
                      handleInputChangeGrouting('outletFree', value)
                    }
                  />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                    label="Methodology & Scheme for lifting and stacking is available at site"
                    value={groutingData.outletFree}
                    items={YES_NO_NA_LIST}
                    onChange={(value: string) =>
                      handleInputChangeGrouting('outletFree', value)
                    }
                  />
              </View>
              <Text style={styles.headerText}>Tools and Tackles for Lifting at Stacking Yard</Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="De-shackles and slings of proper capacity and their test certificate by third party is available"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety color code present on the de-shackles"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Hydraulic jacks are in good condition with proper calibration certificates"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Limit switch of lifting hoist is working properly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Cotter pin are placed in all lifting assembly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Macalloy Bars / pins for lifting of Wings in proper condition"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <Text style={styles.headerText}>Lifting of Segment at Stacking Yard</Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Work at height permit obtained from IE/concerned agency"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All Mac-alloy bars and wire rope assemblies have valid third-party test certificate"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting sequence as per the approved methodology provided at site for counter"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting holes are in proper location as per approved drawing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting arrangements are working properly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Pre-stressing duct of segments are clear of any foreign materials"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Comprehensive Strength of concrete of wings are gained as per the approved drawing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Slider trolley is in proper position"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>Segment Dispatch and Transportation</Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sand blasting on match cast face done"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Repairing (if necessary) & finishing done"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="No repairing on shearkey & gluing location"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Bund for curing at top removed & top to be cleaned by broom"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Soffit & deck top cleaned by broomer"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sheathing duct is cleaned, no concrete at rubber bunk portion"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sheathing duct alignment ok, checked by drolly passing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary stressing hole at soffit cleaned & dimension checked"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Fitness of Trailer with proper calibration certificate"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Tyres of trailer and air pressure checked"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>Preparation of Area for Lifting at Erection Site</Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Ground properly leveled for placement of trailer"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Area is hard barricaded with proper signages"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary lights for proper illumination of the erection area is available at night"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Flag man/Marshal available"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Methodology & Scheme for lifting and stacking is available at site"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Crane is positioned as per drawing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>Tools and Tackles for Lifting at Erection Site</Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="De-shackles and slings of proper capacity and their test certificate by third party is available"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety color code present on the de-shackles"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Hydraulic jacks are in good condition with proper calibration certificates"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Limit switch of lifting hoist is working properly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Cotter pin are placed in all lifting assembly"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Macalloy Bars / pins for lifting of Wings in proper condition"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="TPI of all parts of Cranes & Slings done"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Latest TPI Certificates of all parts of Cranes & Slings available at Site"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Counter-weights are available & placed as per drawing"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>Lifting and Positioning of Segments</Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Positioning of segment marked"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Traffic properly diverted & Traffic marshals are in place"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety & Fitness of all workers working at height checked and certified"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All Safety arrangements are placed at Site"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Segments positioned at the specified / marked location"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Necessary lateral / Site support ensured before releasing the segment by Cranes"
                  value={groutingData.outletFree}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeGrouting('outletFree', value)
                  }
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                  <Text style={styles.Lable}>Recommendations</Text>
                  <TextInput
                    style={styles.commonInputFiels}
                    placeholder="Recommendations"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    underlineColorAndroid="#f000"
                    multiline={true}
                    numberOfLines={4}
                    blurOnSubmit={false}
                    value={comments}
                    onChangeText={text => {
                      setComments(text);
                    }}
                  />
                </View>
              </View>
          </ScrollView>
        );
      case TASK_TYPES.GROUTING:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Inlet free of blockage"
                value={groutingData.inletFree}
                items={YES_NO_NA_LIST}
                onChange={(newValue: string) => {
                  handleInputChangeGrouting('inletFree', newValue);
                }}
                isRequired={true}
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Outlet free of blockage"
                value={groutingData.outletFree}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeGrouting('outletFree', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Vents free of blockage"
                value={groutingData.ventsFree}
                items={YES_NO_LIST}
                onChange={(value: string) =>
                  handleInputChangeGrouting('ventsFree', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Cable Duct free of blockage"
                value={groutingData.cableDuctFree}
                items={YES_NO_LIST}
                onChange={(value: string) =>
                  handleInputChangeGrouting('cableDuctFree', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Leakage observed"
                value={groutingData.leakageObserved}
                items={YES_NO_LIST}
                onChange={(value: string) =>
                  handleInputChangeGrouting('leakageObserved', value)
                }
              />
            </View>
            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Sealed"
                value={groutingData.sealed}
                items={YES_NO_LIST}
                onChange={(value: string) =>
                  handleInputChangeGrouting('sealed', value)
                }
              />
            </View>
            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="If cable duct blocked remedial measures taken"
                value={groutingData.remedialMeasures}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeGrouting('remedialMeasures', value)
                }
              />
            </View>
            <Text style={styles.HeadText}>Details of Grouting</Text>
            <CalendarPicker
              label="Last Date of prestressing"
              value={groutingData.prestressingDate}
              onChange={date =>
                handleInputChangeGrouting('prestressingDate', date)
              }
            />
            <CalendarPicker
              label="Date of Grouting"
              value={groutingData.groutingDate}
              onChange={date => handleInputChangeGrouting('groutingDate', date)}
            />
            <DropdownPicker
              label="Type of cement"
              value={groutingData.cementType}
              items={CEMENT_TYPE_LIST}
              onChange={(value: string) =>
                handleInputChangeGrouting('cementType', value)
              }
            />
            <Input
              label="W/c Ratio"
              value={groutingData.wcRatio}
              onChange={(value: string) =>
                handleInputChangeGrouting('wcRatio', value)
              }
              isRequired={true}
            />
            <Input
              label="Temperature of mixing water (°C)"
              value={groutingData.mixingWaterTemp}
              onChange={(value: string) =>
                handleInputChangeGrouting('mixingWaterTemp', value)
              }
              isRequired={true}
            />
            <Input
              label="Temperature of Grout (°C)"
              value={groutingData.groutTemp}
              onChange={(value: string) =>
                handleInputChangeGrouting('groutTemp', value)
              }
              isRequired={true}
            />
            <TimePicker
              label="Start Time"
              value={groutingData.startTime}
              onChange={time => handleInputChangeGrouting('startTime', time)}
            />
            <TimePicker
              label="Finish Time"
              value={groutingData.finishTime}
              onChange={time => handleInputChangeGrouting('finishTime', time)}
            />
            <Input
              label="Volume of Grout (Ltr)"
              value={groutingData.volumeOfGrout}
              onChange={(value: string) =>
                handleInputChangeGrouting('volumeOfGrout', value)
              }
              isRequired={true}
            />
            <Input
              label="Grouting Pressure (Kg/cm²)"
              value={groutingData.groutingPressure}
              onChange={(value: string) =>
                handleInputChangeGrouting('groutingPressure', value)
              }
              isRequired={true}
            />
            <Input
              label="Cement consumption theoretical"
              value={groutingData.cementConsumptionTheoretical}
              onChange={(value: string) =>
                handleInputChangeGrouting('cementConsumptionTheoretical', value)
              }
              isRequired={true}
            />
            <Input
              label="Cement consumption actual"
              value={groutingData.cementConsumptionActual}
              onChange={(value: string) =>
                handleInputChangeGrouting('cementConsumptionActual', value)
              }
              isRequired={true}
            />
            <DropdownPicker
              label="Passage of grout through vents"
              value={groutingData.passageThroughVents}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeGrouting('passageThroughVents', value)
              }
            />
            <DropdownPicker
              label="Passage of grout through outlet"
              value={groutingData.passageThroughOutlet}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeGrouting('passageThroughOutlet', value)
              }
            />
            <DropdownPicker
              label="Any equipment failure"
              value={groutingData.equipmentFailure}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeGrouting('equipmentFailure', value)
              }
            />
            <DropdownPicker
              label="Probing by Stiffwire"
              value={groutingData.probingByStiffwire}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeGrouting('probingByStiffwire', value)
              }
            />

            <View>
              <View style={{flexDirection: 'column'}}>
                <CalendarPicker
                  label="Date"
                  value={rfiDate}
                  onChange={date => setRFIDate(date)}
                />
              </View>
              <View>
                <TimePicker
                  label="Time"
                  value={rfiTime}
                  onChange={time => setRFITime(time)}
                />
              </View>

              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => {
                    setComments(text);
                  }}
                />
              </View>
            </View>
          </View>
        );

      default:
        return (
          <View>
            <Text>TODO</Text>
          </View>
        );
    }
  };

  const tasksListing = () => {
    return currentTasksData
      .filter((task: any) => {
        if (searchText && task.displayName) {
          return task.displayName
            .toLowerCase()
            .includes(searchText.toLowerCase());
        } else {
          return true;
        }
      })
      .map((item: any, index) => (
        <View style={getStyle(item)}>
          <View style={styles.leftContainer}>
            <Text style={[styles.HeadText, {maxWidth: 300}]}>
              {item.displayName}
            </Text>
            {/* <Text style={styles.MyWorkSubHead}>Sub Text</Text> */}
          </View>
          {item.rfiStatus === RFI_STATUS.GENERATED ? (
            <TouchableOpacity
              style={[styles.MyWorkCta, styles.StartBorder]}
              onPress={() => {
                getRFIDataByWorkAssignmentId(item);
              }}>
              <Image
                style={styles.WorkIcon}
                source={require('../../images/play-icon.png')}
              />
              <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>
                Start
              </Text>
            </TouchableOpacity>
          ) : null}

          {item.rfiStatus === RFI_STATUS.RE_GENERATED ? (
            <TouchableOpacity
              style={[styles.MyWorkCta, styles.StartBorder]}
              onPress={() => {
                getRFIDataByWorkAssignmentId(item);
              }}>
              <Image
                style={styles.WorkIcon}
                source={require('../../images/play-icon.png')}
              />
              <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>
                Re-start
              </Text>
            </TouchableOpacity>
          ) : null}

          {item.rfiStatus === RFI_STATUS.REJECTED ||
          item.rfiStatus === RFI_STATUS.CANCELLED ? (
            <TouchableOpacity
              style={[styles.MyWorkCta, styles.StartRejectBorder]}>
              {/* <Image style={styles.WorkIcon} source={require('../../images/play-icon.png')} /> */}
              <Text style={[styles.CtaStartText, styles.CtaRejectTextColor]}>
                {item.rfiStatus === RFI_STATUS.CANCELLED
                  ? 'Cancelled'
                  : 'Rejected'}
              </Text>
            </TouchableOpacity>
          ) : null}

          {item.rfiStatus === RFI_STATUS.IN_PROGRESS ? (
            <TouchableOpacity
              style={[styles.MyWorkCta, styles.StartInProgressBorder]}
              onPress={() => {
                getRFIDataByWorkAssignmentId(item);
              }}>
              <Image
                style={styles.WorkIcon}
                source={require('../../images/inprogress.png')}
              />
              <Text
                style={[styles.CtaStartText, styles.CtaInProgressTextColor]}>
                In Progress
              </Text>
            </TouchableOpacity>
          ) : null}

          {item.rfiStatus === RFI_STATUS.IN_REVIEW ? (
            <TouchableOpacity
              style={[styles.MyWorkCta, styles.StartReviewBorder]}>
              <Image
                style={styles.WorkIcon}
                source={require('../../images/review-icon.png')}
              />
              <Text style={[styles.CtaStartText, styles.CtaReviewTextColor]}>
                Under Review
              </Text>
            </TouchableOpacity>
          ) : null}

          {item.rfiStatus === RFI_STATUS.APPROVED ? (
            <TouchableOpacity
              style={[styles.MyWorkCta, styles.StartCompleteBorder]}>
              <Image
                style={styles.WorkIcon}
                source={require('../../images/complete-icon.png')}
              />
              <Text style={[styles.CtaStartText, styles.CtaCompleteTextColor]}>
                Completed
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ));
  };

  return (
    <View style={styles.Container}>
      {breadcrumbData.length ? (
        <View style={styles.BreadcrumbContainer}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={styles.scrollView}>
            {breadcrumbData.map((item: any, index) => (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {index == 0 ? (
                  <Text
                    style={styles.BreadcrumbPrevTextUnderline}
                    onPress={() =>
                      index === 0 && (setCurrentLevel(1), setBreadcrumbData([]))
                    }>
                    {item.name}
                  </Text>
                ) : index === breadcrumbData.length - 1 ? (
                  <Text style={styles.BreadcrumbCurrentText}>{item.name}</Text>
                ) : (
                  <Text style={styles.BreadcrumbPrevText}>{item.name}</Text>
                )}
                {index < breadcrumbData.length - 1 ? (
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
      {currentLevel !== 1 && currentLevel !== 5 ? (
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
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
            }}
          />
        </View>
      ) : null}
      <ScrollView style={styles.Height100}>
        {currentLevel === 1
          ? myWorksData.map((projModuleItem: any, projModuleIndex) =>
              projModuleItem.assignmentLevel === 1 ? (
                <TouchableOpacity
                  style={styles.MyWorkCard}
                  onPress={() =>
                    onClick(2, projModuleItem.assignmentLevel, projModuleIndex)
                  }>
                  <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                  <View style={styles.TaskDetails}>
                    <Text style={styles.SubHeadingText}>Assigned:</Text>
                    <Text style={[styles.SubHeadingText, styles.SubActive]}>
                      {projModuleItem.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                projModuleItem.segmentsData?.map(
                  (segItem: any, segIndex: any) =>
                    segItem.assignmentLevel === 2 ? (
                      projModuleItem.segmentsData?.filter(
                        (segItem: any) => segItem.assignmentLevel == 2,
                      ).length === 1 ? (
                        <TouchableOpacity
                          style={styles.MyWorkCard}
                          onPress={() =>
                            onClick(
                              3,
                              segItem.assignmentLevel,
                              projModuleIndex,
                              projModuleItem.segmentsData?.findIndex(
                                (segItem: any) => segItem.assignmentLevel == 2,
                              ),
                            )
                          }>
                          <View style={styles.ContentContainer}>
                            <Text style={styles.HeadingText}>
                              {projModuleItem.name}
                            </Text>
                            <View style={styles.TaskDetails}>
                              <Text
                                style={[
                                  styles.SubHeadingText,
                                  styles.BoldText,
                                ]}>
                                Assigned:
                              </Text>
                            </View>
                            <View style={styles.TaskDetails}>
                              <Text style={styles.SubHeadingText}>
                                {SEGMENT_TYPES_DISPLAY[segItem.type]} /
                              </Text>
                              <Text style={styles.SubHeadingText}>
                                {segItem.name} /
                              </Text>
                            </View>
                            <View style={styles.TaskDetails}>
                              <Text
                                style={[
                                  styles.SubHeadingText,
                                  styles.SubActive,
                                ]}>
                                {
                                  projModuleItem.segmentsData?.filter(
                                    (segItem: any) =>
                                      segItem.assignmentLevel == 2,
                                  )[0].name
                                }
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        Object.keys(groupBy([segItem], 'type')).map(
                          (segType: any, index: any) => (
                            <TouchableOpacity
                              style={styles.MyWorkCard}
                              onPress={() =>
                                onClick(
                                  2,
                                  segItem.assignmentLevel,
                                  projModuleIndex,
                                  -1,
                                  -1,
                                  -1,
                                  -1,
                                  segType,
                                )
                              }>
                              <View style={styles.ContentContainer}>
                                <Text style={styles.HeadingText}>
                                  {projModuleItem.name}
                                </Text>
                                <View style={styles.TaskDetails}>
                                  <Text
                                    style={[
                                      styles.SubHeadingText,
                                      styles.BoldText,
                                    ]}>
                                    Assigned: {'' + index}
                                  </Text>
                                </View>
                                <View style={styles.TaskDetails}>
                                  <Text
                                    style={[
                                      styles.SubHeadingText,
                                      styles.SubActive,
                                    ]}>
                                    {SEGMENT_TYPES_DISPLAY[segType]}{' '}
                                    {
                                      projModuleItem.segmentsData?.filter(
                                        (segItem: any) =>
                                          segItem.type == segType &&
                                          segItem.assignmentLevel == 2,
                                      ).length
                                    }
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ),
                        )
                      )
                    ) : segItem.componentsData &&
                      segItem.componentsData.length ? (
                      segItem.componentsData?.map(
                        (componentItem: any, componentIndex: number) =>
                          componentItem.assignmentLevel === 3 ? (
                            <TouchableOpacity
                              style={styles.MyWorkCard}
                              onPress={() =>
                                onClick(
                                  4,
                                  componentItem.assignmentLevel,
                                  projModuleIndex,
                                  segIndex,
                                  componentIndex,
                                )
                              }>
                              <View style={styles.ContentContainer}>
                                <Text style={styles.HeadingText}>
                                  {projModuleItem.name}
                                </Text>
                                <View style={styles.TaskDetails}>
                                  <Text
                                    style={[
                                      styles.SubHeadingText,
                                      styles.BoldText,
                                    ]}>
                                    Assigned:
                                  </Text>
                                </View>
                                <View style={styles.TaskDetails}>
                                  <Text style={styles.SubHeadingText}>
                                    {SEGMENT_TYPES_DISPLAY[segItem.type]} /
                                  </Text>
                                  <Text style={styles.SubHeadingText}>
                                    {segItem.name} /
                                  </Text>
                                </View>
                                <View style={styles.TaskDetails}>
                                  <Text style={styles.SubHeadingText}>
                                    {componentItem.name}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ) : componentItem.subComponentsData &&
                            componentItem.subComponentsData.length ? (
                            componentItem.subComponentsData.map(
                              (subComponentItem: any, subCompIndex: number) =>
                                subComponentItem.assignmentLevel === 4 ? (
                                  <TouchableOpacity
                                    style={styles.MyWorkCard}
                                    onPress={() =>
                                      onClick(
                                        5,
                                        subComponentItem.assignmentLevel,
                                        projModuleIndex,
                                        segIndex,
                                        componentIndex,
                                        subCompIndex,
                                      )
                                    }>
                                    <View style={styles.ContentContainer}>
                                      <Text style={styles.HeadingText}>
                                        {projModuleItem.name}
                                      </Text>
                                      <View style={styles.TaskDetails}>
                                        <Text
                                          style={[
                                            styles.SubHeadingText,
                                            styles.BoldText,
                                          ]}>
                                          Assigned To:
                                        </Text>
                                      </View>
                                      <View style={styles.TaskDetails}>
                                        <Text style={styles.SubHeadingText}>
                                          {SEGMENT_TYPES_DISPLAY[segItem.type]}{' '}
                                          /
                                        </Text>
                                        <Text style={styles.SubHeadingText}>
                                          {segItem.name} /
                                        </Text>
                                        <Text style={styles.SubHeadingText}>
                                          {componentItem.name} /
                                        </Text>
                                      </View>
                                      <View style={styles.TaskDetails}>
                                        <Text
                                          style={[
                                            styles.SubHeadingText,
                                            styles.SubActive,
                                          ]}>
                                          {subComponentItem.displayName}
                                        </Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  subComponentItem.tasksData?.map(
                                    (taskItem: any, taskIndex: number) =>
                                      taskItem.assignmentLevel === 5 && (
                                        <TouchableOpacity
                                          style={styles.MyWorkCard}
                                          onPress={() =>
                                            onClick(
                                              6,
                                              taskItem.assignmentLevel,
                                              projModuleIndex,
                                              segIndex,
                                              componentIndex,
                                              subCompIndex,
                                              taskIndex,
                                            )
                                          }>
                                          <View style={styles.ContentContainer}>
                                            <Text style={styles.HeadingText}>
                                              {projModuleItem.name}
                                            </Text>
                                            <View style={styles.TaskDetails}>
                                              <Text
                                                style={[
                                                  styles.SubHeadingText,
                                                  styles.BoldText,
                                                ]}>
                                                Assigned To:
                                              </Text>
                                            </View>
                                            <View style={styles.TaskDetails}>
                                              <Text
                                                style={styles.SubHeadingText}>
                                                {
                                                  SEGMENT_TYPES_DISPLAY[
                                                    segItem.type
                                                  ]
                                                }{' '}
                                                /
                                              </Text>
                                              <Text
                                                style={styles.SubHeadingText}>
                                                {componentItem.name} /
                                              </Text>
                                              <Text
                                                style={styles.SubHeadingText}>
                                                {subComponentItem.name} /
                                              </Text>
                                            </View>
                                            <View style={styles.TaskDetails}>
                                              <Text
                                                style={[
                                                  styles.SubHeadingText,
                                                  styles.SubActive,
                                                ]}>
                                                {taskItem.displayName}
                                              </Text>
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      ),
                                  )
                                ),
                            )
                          ) : (
                            componentItem.tasksData?.map(
                              (taskItem: any, taskIndex: number) =>
                                taskItem.assignmentLevel === 5 && (
                                  <TouchableOpacity
                                    style={styles.MyWorkCard}
                                    onPress={() =>
                                      onClick(
                                        6,
                                        taskItem.assignmentLevel,
                                        projModuleIndex,
                                        segIndex,
                                        componentIndex,
                                        -1,
                                        taskIndex,
                                      )
                                    }>
                                    <View style={styles.ContentContainer}>
                                      <Text style={styles.HeadingText}>
                                        {projModuleItem.name}
                                      </Text>
                                      <View style={styles.TaskDetails}>
                                        <Text
                                          style={[
                                            styles.SubHeadingText,
                                            styles.BoldText,
                                          ]}>
                                          Assigned To:
                                        </Text>
                                      </View>
                                      <View style={styles.TaskDetails}>
                                        <Text style={styles.SubHeadingText}>
                                          {SEGMENT_TYPES_DISPLAY[segItem.type]}{' '}
                                          /
                                        </Text>
                                        <Text style={styles.SubHeadingText}>
                                          {segItem.name} /
                                        </Text>
                                        <Text style={styles.SubHeadingText}>
                                          {componentItem.name} /
                                        </Text>
                                      </View>
                                      <View style={styles.TaskDetails}>
                                        <Text
                                          style={[
                                            styles.SubHeadingText,
                                            styles.SubActive,
                                          ]}>
                                          {taskItem.displayName}
                                        </Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ),
                            )
                          ),
                      )
                    ) : (
                      segItem.tasksData?.map(
                        (taskItem: any, taskIndex: number) =>
                          taskItem.assignmentLevel === 5 && (
                            <TouchableOpacity
                              style={styles.MyWorkCard}
                              onPress={() =>
                                onClick(
                                  6,
                                  taskItem.assignmentLevel,
                                  projModuleIndex,
                                  segIndex,
                                  -1,
                                  -1,
                                  taskIndex,
                                )
                              }>
                              <View style={styles.ContentContainer}>
                                <Text style={styles.HeadingText}>
                                  {projModuleItem.name}
                                </Text>
                                <View style={styles.TaskDetails}>
                                  <Text
                                    style={[
                                      styles.SubHeadingText,
                                      styles.BoldText,
                                    ]}>
                                    Assigned To:
                                  </Text>
                                </View>
                                <View style={styles.TaskDetails}>
                                  <Text style={styles.SubHeadingText}>
                                    {SEGMENT_TYPES_DISPLAY[segItem.type]} /
                                  </Text>
                                  <Text style={styles.SubHeadingText}>
                                    {segItem.name} /
                                  </Text>
                                </View>
                                <View style={styles.TaskDetails}>
                                  <Text
                                    style={[
                                      styles.SubHeadingText,
                                      styles.SubActive,
                                    ]}>
                                    {taskItem.displayName}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ),
                      )
                    ),
                )
              ),
            )
          : null}
        {currentLevel === 7 &&
        segmentsByGroupOnType &&
        Object.keys(segmentsByGroupOnType).length
          ? Object.keys(segmentsByGroupOnType).map(item => (
              <TouchableOpacity
                style={[styles.StartWorkCard, styles.StartBorder]}
                onPress={() => onSegmentTypeClick(item)}>
                <View style={styles.leftContainer}>
                  <Text style={styles.HeadText}>
                    {segmentsByGroupOnType[item].length}
                  </Text>
                  <Text style={styles.MyWorkSubHead}>
                    {SEGMENT_TYPES_DISPLAY[item]}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          : null}
        {currentLevel === 2
          ? currentSegmentsData
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
                <TouchableOpacity
                  style={getStyle(item)}
                  onPress={() => onClickNested(3, item)}>
                  <View style={styles.leftContainer}>
                    <Text style={styles.HeadText}>{item.name}</Text>
                    {/* <Text style={styles.MyWorkSubHead}>Sub Text</Text> */}
                  </View>
                </TouchableOpacity>
              ))
          : null}
        {currentLevel === 3
          ? currentComponentsData && currentComponentsData.length
            ? currentComponentsData
                .filter((subSeg: any) => {
                  if (searchText && subSeg.name) {
                    return subSeg.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                  } else {
                    return true;
                  }
                })
                .map((item: any, index) => (
                  <TouchableOpacity
                    style={getStyle(item)}
                    onPress={() => onClickNested(4, item)}>
                    <View style={styles.leftContainer}>
                      <Text style={styles.HeadText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))
            : tasksListing()
          : null}
        {currentLevel === 4
          ? currentSubComponentsData && currentSubComponentsData.length
            ? currentSubComponentsData
                .filter((subComponent: any) => {
                  if (searchText && subComponent.name) {
                    return subComponent.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                  } else {
                    return true;
                  }
                })
                .map((item: any, index) => (
                  <TouchableOpacity
                    style={getStyle(item)}
                    onPress={() => onClickNested(5, item)}>
                    <View style={styles.leftContainer}>
                      <Text style={styles.HeadText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))
            : tasksListing()
          : null}
        {currentLevel === 5 || currentLevel === 6 ? tasksListing() : null}
        {/* No Data Found */}
        {!loading && !myWorksData.length ? (
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
        ) : null}
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
                <View style={styles.taskAddContainer}>
                  <Text style={styles.Lable}>
                    Task:{' '}
                    <Text style={{fontWeight: '600', color: '#1C58C0'}}>
                      {selectedTask?.displayName}
                    </Text>
                  </Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{minHeight: 100, maxHeight: 500}}>
                  <Fragment>
                    <StatusBar barStyle="dark-content" />
                    <SafeAreaView>{taskForm(selectedTask?.name)}</SafeAreaView>
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
                      backgroundColor: '#fff',
                      paddingVertical: 10,
                      marginHorizontal: -15,
                    },
                  ]}>
                  <TouchableOpacity
                    style={[styles.submitButton, styles.saveButtonColor]}
                    onPress={() => onFillChecklist(RFI_STATUS.IN_PROGRESS)}>
                    <Text style={styles.submitButtonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => onFillChecklist(RFI_STATUS.IN_REVIEW)}>
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
  );
};

const CustomTextInput = ({
  rowItem,
  fieldName,
}: {
  rowItem: any;
  fieldName: any;
}) => {
  const [value, setValue] = useState(rowItem[fieldName]);
  const updateValue = (text: any) => {
    {
      rowItem[fieldName] = text;
    }
  };

  return (
    <TextInput
      style={styles.commonInputFiels}
      placeholder=""
      autoCapitalize="none"
      keyboardType="email-address"
      returnKeyType="next"
      underlineColorAndroid="#f000"
      blurOnSubmit={false}
      value={value}
      onChangeText={text => {
        setValue(text);
        updateValue(text);
      }}
    />
  );
};
const CustomTextInputValue = ({
  rowItem,
  fieldName,
  index,
  onChange,
}: {
  rowItem: any;
  fieldName: string;
  index: number;
  onChange: (index: number, field: string, value: string) => void;
}) => {
  const [value, setValue] = useState(rowItem[fieldName]);

  const handleChange = (text: string) => {
    setValue(text);
    onChange(index, fieldName, text);
  };

  return (
    <TextInput
      style={styles.commonInputFiels}
      placeholder=""
      autoCapitalize="none"
      keyboardType="email-address"
      returnKeyType="next"
      underlineColorAndroid="#f000"
      blurOnSubmit={false}
      value={value}
      onChangeText={handleChange}
    />
  );
};

const CustomDropdownPicker = ({
  items,
  rowItem,
  fieldName,
}: {
  items: any;
  rowItem: any;
  fieldName: any;
}) => {
  const [value, setValue] = useState(rowItem[fieldName]);
  const [openList, setOpenList] = useState(false);
  const updateValue = () => {
    {
      rowItem[fieldName] = value;
    }
  };
  return (
    <DropDownPicker
      style={[styles.DropDownFiels, {minWidth: 110, maxWidth: 220}]}
      open={openList}
      value={value}
      items={items}
      setOpen={setOpenList}
      setValue={setValue}
      listMode="MODAL"
      closeAfterSelecting={true}
      onChangeValue={() => updateValue()}
    />
  );
};

const styles = StyleSheet.create({
  marginBootomZero: {
    marginBottom: 0,
    marginTop: 0,
  },
  disPlayNone: {
    display: 'none',
  },
  selectDropdown: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 4,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
    fontSize: 12,
    color: '#2c2c2c',
    position: 'relative',
  },
  MainContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 0,
    borderColor: '#cccccc',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  AddMoreLink: {
    color: '#1C58C0',
    fontSize: 12,
    fontWeight: '500',
  },
  assignTagButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  Lable: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
    fontWeight: '500',
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
    marginBottom: 30,
    position: 'relative',
    marginHorizontal: -20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    // Shadow for Android
    elevation: 10,
  },
  ImageSearch: {
    position: 'absolute',
    width: 24,
    height: 24,
    zIndex: 9,
    left: 10,
    top: '34%',
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
  commonInputFiels: {
    color: '#2c2c2c',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontWeight: '400',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 10,
    width: '100%',
    borderColor: '#ccc',
    flexDirection: 'column',
    textAlignVertical: 'top',
    fontSize: 13,
    height: 44,
  },
  inputFieldsText: {
    color: '#2c2c2c',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontWeight: '400',
    borderWidth: 1,
    borderRadius: 4,
    height: 42,
    width: '100%',
    borderColor: '#ccc',
    flexDirection: 'column',
    textAlignVertical: 'center',
    fontSize: 12,
  },
  DropDownFiels: {
    color: '#2c2c2c',
    backgroundColor: '#fff',
    fontWeight: '400',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
    fontSize: 12,
  },
  calendarInput: {
    paddingRight: 35,
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
    opacity: 0.5,
  },
  leftContainer: {
    flexDirection: 'column',
  },
  HeadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  MyWorkSubHead: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  WorkIcon: {
    width: 12,
    height: 12,
  },
  MyWorkCta: {
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  CtaStartText: {
    fontSize: 12,
    fontWeight: '400',
  },
  CtaStartTextColor: {
    color: '#A1A1A1',
  },
  StartBorder: {
    borderColor: '#A1A1A1',
  },
  DisabledBorder: {
    borderColor: '#EBEBE4',
  },
  CtaInProgressTextColor: {
    color: '#FCB700',
  },
  StartInProgressBorder: {
    borderColor: '#FCB700',
  },
  CtaReviewTextColor: {
    color: '#1C58C0',
  },
  StartReviewBorder: {
    borderColor: '#1C58C0',
  },
  CtaCompleteTextColor: {
    color: '#2BC267',
  },
  StartCompleteBorder: {
    borderColor: '#2BC267',
  },
  StartRejectBorder: {
    borderColor: '#FF0000',
  },
  CtaRejectTextColor: {
    color: '#FF0000',
  },
  //Breacrumb Start
  BreadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginTop: -21,
    backgroundColor: '#e7ebf4',
    gap: 5,
  },
  scrollView: {
    paddingVertical: 10,
    paddingBottom: 15,
  },
  BreadcrumbPrevText: {
    fontSize: 14,
    color: '#333',
  },
  BreadcrumbPrevTextUnderline: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#333',
  },
  BreadcrumbCurrentText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  ArrowIcon: {
    width: 18,
    height: 18,
  },

  //MyWork Card
  MyWorkCard: {
    backgroundColor: '#CCD6E7',
    borderRadius: 12,
    justifyContent: 'flex-start',
    marginBottom: 15,
    position: 'relative',
  },
  ContentContainer: {
    paddingVertical: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  CompleteWork: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#2BC267',
    backgroundColor: '#fff',
  },
  CompleteIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  HeadingText: {
    color: '#010101',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  TaskDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  SubHeadingText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '400',
    marginRight: 5,
  },
  SubActive: {
    color: '#1C58C0',
    fontWeight: '800',
  },
  BoldText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27272A',
  },
  HeadingContainer: {
    backgroundColor: '#e7ebf4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
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
  },
  submitButton: {
    width: 120,
    backgroundColor: '#1C58C0',
    borderRadius: 30,
    color: '#fff',
    paddingHorizontal: 30,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonColor: {
    backgroundColor: '#5eab4b',
  },
  submitButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  taskAddContainer: {
    paddingTop: 15,
  },

  bodyPopup: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('window').height - 60,
    width: Dimensions.get('window').width,
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3,
  },
  btnParentSection: {
    // alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    // Shadow for Android
    elevation: 10,
    borderTopWidth: 1,
    borderColor: '#f3f3f3',
  },
  btnSection: {
    width: 150,
    height: 50,
    backgroundColor: '#1C58C0',
    // alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
    shadowOffset: {width: 0, height: 2},
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
    borderRadius: 6,
    gap: 10,
    marginLeft: 5,
  },
  hiddenButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: 45,
  },
  closeButton: {
    backgroundColor: 'green', // Blue
    borderRadius: 6,
    minHeight: 45,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#E74C3C', // Red
    borderRadius: 6,
    minHeight: 45,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  columnWiseData: {
    flexDirection: 'column',
  },
  categoryColumn: {
    width: '100%',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 10
  },
});

export default MyWork;
