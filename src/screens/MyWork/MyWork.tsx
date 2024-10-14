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
  // POST_CONCRETE_CHECK
  // FIXING_OF_BEARING_SLEEVES
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
  const [glueingData, setGlueingData]: any = useState([
    // {
    //   jointNumbers: '',
    //   ambientTemperature: 0,
    //   batchNoResin: 0,
    //   batchNoHardener: 0,
    //   mixingStartTime: '',
    //   mixingFinishTime: '',
    //   applicationStartTime: '',
    //   applicationFinishTime: '',
    //   segmentJoiningTimeClosure: '',
    //   segmentJoiningTimeTemporaryFinish: '',
    //   segmentSurfaceArea: 0,
    //   epoxyConsumptionTheoreticalResin: 0,
    //   epoxyConsumptionTheoreticalHardener: 0,
    //   epoxyConsumptionActualResin: 0,
    //   epoxyConsumptionActualHardener: 0,
    //   key: Guid.create(),
    // },
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
  const [erectionUsingCranesData, setErectionUsingCranesData] = useState({
    riskAssessmentCarriedOut: 'Y',
    craneOnFirmLevelBases: 'Y',
    allOperatorsTrained: 'Y',
    craneTestedAndOperated: 'Y',
    swingAlarmFunctioning: 'Y',
    craneTestCertificate: 'Y',
    boomTestCertificate: 'Y',
    oilLeakage: 'Y',
    greasing: 'Y',
    outriggersFullyExtended: 'Y',
    levelIndicators: 'Y',
    basePlateUnderOutriggers: 'Y',
    riggingAngles: 'Y',
    examinationCertified: 'Y',
    liftingToolsChecked: 'Y',
    workersWithFallProtection: 'Y',
    ppeProvided: 'Y',
    sufficientIllumination: 'Y',
    swlMarked: 'Y',
    equipmentProperlyEarthed: 'Y',
    walkwayObstacleFree: 'Y',
    safetyLatchAvailable: 'Y',
    warningSignAvailable: 'Y',
    liftingArrangements: 'Y',
    groundLeveling: 'Y',
    structureSetOut: 'Y',
    welderQualificationChecked: 'Y',
  });
  const [fixingOfBearingData, setFixingOfBearingData] = useState({
    bearingPlacedAsPerGFC: 'Y',
    bearingSurfaceFullyContactWithGirder: 'Y',
    bearingPlatesSetHorizontal: 'Y',
    bearingPreSetWithAxis: 'Y',
    supportsProvidedToHoldBearing: 'Y',
    anchorBoltHolesMatching: 'Y',
    voidBeneathBearingFilled: 'Y',
    bearingFixedWithMetalBedding: 'Y',
    threadedFastenerTightenedUniformly: 'Y',
  });
  const handleInputChangeAutoLaunching = (key, value) => {
    setAutoLaunchingData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleInputChangeInstallationOfExpansionJoint = (key, value) => {
    setInstallationOfExpansionJointData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleInputChangeRemovalOfTemporaryStructure = (key, value) => {
    setRemovalOfTemporaryStructureData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleInputChangeDeStressingOfGirder = (key: string, value: string) => {
    setDeStressingOfGirderData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleInputChangeHackingOfGirder = (key: string, value: string) => {
    setHackingOfGirderData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleInputChangeErectionUsingCranes = (
    field: string,
    value: string,
  ) => {
    setErectionUsingCranesData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleInputChangeBoringOfPile = (
    name: keyof FormStateBoringOfPile,
    value: string | number | [],
  ) => {
    setBoringOfPileData({...boringOfPileData, [name]: Number(value)});
  };
  const handleInputChangeAssemblingOfTruss = (field, value) => {
    setAssemblingOfTrussData(prevData => ({
      ...prevData,
      [field]: value,
    }));
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
  const [dumpingData, setDumpingData] = useState([
    {
      vehicleNo: '', // last 4 digits, number
      source: 'Y',
      qtyDumped: 0, // must be > 0, up to 3 decimals, max 100,000
      approvedSource: '', // "Y" or "N"
      bouldersPresent: 'Y', // "Y" or "N"
      key: Guid.create(),
    },
  ]);

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
  //FormUseStates
  const [glassWorksData, setGlassWorksData] = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceivedAsPerSpecs: 'Y',
    glassQualityAndThicknessApproved: 'Y',
    siteReadyForGlassWork: 'Y',
    finishingWorkProper: 'Y',
    workCompletedToSiteInChargeSatisfaction: 'Y',
    totalGlassWorkCompletedSqft: 0.0,
  });

  const [windowWorksData, setWindowWorksData] = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceivedAsPerSpecs: 'Y',
    siteReadyForWindowWork: 'Y',
    finishingWorkProper: 'Y',
    workCompletedToSatisfaction: 'Y',
  });

  const [doorWorksData, setDoorWorksData] = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceivedAsPerSpec: 'Y',
    siteReadyForDoorWork: 'Y',
    finishingWorkProper: 'Y',
    workSatisfactionAchieved: 'Y',
  });

  const [furnitureWorkData, setFurnitureWorkData] = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceivedAsPerSpecs: 'Y',
    siteReadyForFurnitureWork: 'Y',
    finishingFurnitureProper: 'Y',
    workSatisfactoryToSiteInCharge: 'Y',
  });

  const [ceilingWorkData, setCeilingWorkData] = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceivedAsPerSpecifications: 'Y',
    siteReadyForCeilingWork: 'Y',
    finishingWorkUniform: 'Y',
    ceilingWorkCompletedToSatisfaction: 'Y',
    totalSqftAreaCompleted: 0.0,
  });

  const [hvacWorkData, setHvacWorkData] = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    inspectionAndDispatchCleared: 'Y',
    siteReadyForHVAC: 'Y',
    ductingAsPerDrawings: 'Y',
    connectionPointsAsPerDrawings: 'Y',
    acFittingsAsPerDrawings: 'Y',
    systemTestedAndCertified: 'Y',
    totalSqftAreaCovered: 0.0,
  });

  const [puttyData, setPuttyData] = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    surfaceDriedReadyForPutty: 'Y',
    thicknessAsPerDrawing: 'Y',
    surfaceFinishUniform: 'Y',
    totalPuttyWorkSqft: 0.0,
  });

  const [plasteringData, setPlasteringData] = useState({
    drawingsApproved: 'Y',
    cementSourceApproved: 'Y',
    otherMaterialsSourceApproved: 'Y',
    proportionsAsPerSpecs: 'Y',
    thicknessAsPerDrawings: 'Y',
    surfaceFinishProper: 'Y',
    totalPlasteringWorkSqft: 0.0,
  });

  const [fixingOfStoneData, setFixingOfStoneData] = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeSizeApproved: 'Y',
    stonesFixedProperly: 'Y',
    projectDetailsCorrect: 'Y',
    itemsCleanedVisible: 'Y',
    totalStonesInstalled: 0,
    totalLengthCoveredKm: 0.0,
  });

  const [layingOfLTCableData, setLayingOfLTCableData] = useState({
    drawingsApproved: 'Y',
    sourceApproved: 'Y',
    factoryInspectionDone: 'Y',
    cableLaidProperly: 'Y',
    jointsMadeProperly: 'Y',
    endPointsTerminated: 'Y',
    properTestingDone: 'Y',
    totalCableLengthRM: 0.0,
    totalHighwayLengthKm: 0.0,
  });

  const [layingOfFlexibleCableData, setLayingOfFlexibleCableData] = useState({
    drawingsApproved: 'Y',
    sourceApproved: 'Y',
    factoryInspectionDone: 'Y',
    cableLaidProperly: 'Y',
    jointsMadeProperly: 'Y',
    endpointsTerminatedProperly: 'Y',
    testingSuccessful: 'Y',
    totalCableLengthRM: 0.0,
    totalHighwayLengthKm: 0.0,
  });

  const [installationOfLEDLightsData, setInstallationOfLEDLightsData] =
    useState({
      drawingsApproved: 'Y',
      sourceApproved: 'Y',
      factoryInspectionDone: 'Y',
      lightsTestedBeforeInstallation: 'Y',
      lightsInstalledProperly: 'Y',
      totalQtyOfLightsInstalled: 0,
      totalLengthOfHighwayCoveredKm: 0.0,
    });
  const [fixingOfArmsData, setFixingOfArmsData] = useState({
    drawingsApproved: 'Y',
    sourceApproved: 'Y',
    factoryInspectionDone: 'Y',
    armsFixedProperly: 'Y',
    nutsBoltsTightened: 'Y',
    totalQtyArmsErected: 0,
    totalHighwayLengthCoveredKm: 0.0,
  });
  const [erectionOfPolesData, setErectionOfPolesData] = useState({
    drawingsApproved: 'Y',
    sourceApproved: 'Y',
    factoryInspectionDone: 'Y',
    foundationsReady: 'Y',
    polesAlignedProperly: 'Y',
    nutBoltsTightened: 'Y',
    totalPolesErected: 0,
    totalHighwayLengthCovered: 0.0,
  });

  const [fixingOfAntiglaresData, setFixingOfAntiglaresData] = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeSizeApproved: 'Y',
    itemsFixedProperly: 'Y',
    lineLevelsChecked: 'Y',
    spacingAsPerSpecifications: 'Y',
    itemsCleanVisible: 'Y',
    totalAntiglaresInstalled: 0,
    totalLengthCoveredKm: 0.0,
  });
  const [fixingOfConvexMirrorsData, setFixingOfConvexMirrorsData] = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeSizeApproved: 'Y',
    workingCondition: 'Y',
    mirrorsFixedProperly: 'Y',
    lineLevelAngleChecked: 'Y',
    itemsCleanVisible: 'Y',
    totalMirrorsInstalled: 0,
    totalLengthCoveredKm: 0.0,
  });
  const [
    fixingOfFlexibleMedianMarkersData,
    setFixingOfFlexibleMedianMarkersData,
  ] = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeSizeApproved: 'Y',
    markersFixedProperly: 'Y',
    lineLevelsChecked: 'Y',
    spacingAsPerSpecifications: 'Y',
    itemsCleanedVisible: 'Y',
    totalMarkersInstalled: 0,
    totalLengthCoveredKm: 0.0,
  });
  const [fixingOfHazardMarkersData, setFixingOfHazardMarkersData] = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeSizeApproved: 'Y',
    markersFixedProperly: 'Y',
    lineLevelsChecked: 'Y',
    itemsCleanedVisible: 'Y',
    totalMarkersInstalled: 0,
    totalLengthCoveredKm: 0.0,
  });
  const [fixingOfLEDTrafficBlinkersData, setFixingOfLEDTrafficBlinkersData] =
    useState({
      sourceMaterialApproved: 'Y',
      drawingApproved: 'Y',
      shapeSizeApproved: 'Y',
      workingCondition: 'Y',
      itemsFixedProperly: 'Y',
      lineLevelChecked: 'Y',
      itemsCleanedVisible: 'Y',
      totalBlinkersInstalled: 0,
      totalHighwayLengthCovered: 0.0,
    });
  const [fixingOfNoiseBarrierData, setFixingOfNoiseBarrierData] = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeSizeApproved: 'Y',
    postsFixedProperly: 'Y',
    postsLineLevelChecked: 'Y',
    gapBetweenCrashAndNoiseBarrier: 'Y',
    frameFixedTightly: 'Y',
    totalNoiseBarrierPanelsInstalled: 0,
    totalLengthNoiseBarrierFixedRM: 0.0,
  });
  const [fixingOfObjectMarkersData, setFixingOfObjectMarkersData] = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeSizeApproved: 'Y',
    markersFixedProperly: 'Y',
    lineLevelsChecked: 'Y',
    itemsCleanedVisible: 'Y',
    totalMarkersInstalled: 0,
    totalLengthCoveredKm: 0.0,
  });
  const [fixingOfRoadDelineatorsData, setFixingOfRoadDelineatorsData] =
    useState({
      sourceMaterialApproved: 'Y',
      drawingApproved: 'Y',
      shapeSizeAsPerDrawing: 'Y',
      delineatorsFixedProperly: 'Y',
      lineLevelChecked: 'Y',
      spacingBetweenDelineators: 'Y',
      nosOfDelineatorsInstalled: 0,
      totalLengthRoadCovered: 0.0,
    });
  const [fixingOfRoadStudsData, setFixingOfRoadStudsData] = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeAndSizeAsPerDrawing: 'Y',
    colorCodeAndLocationAsPerSpecification: 'Y',
    studsFixedProperly: 'Y',
    lineAndLevelChecked: 'Y',
    spacingAsPerSpecification: 'Y',
    itemsCleanedVisible: 'Y',
    roadStudsInstalled: 0,
    totalLengthCovered: 0.0,
  });
  const [fixingOfSolarBlinkersData, setFixingOfSolarBlinkersData] = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeAndSizeAsPerDrawing: 'Y',
    blinkersWorkingCondition: 'Y',
    blinkersFixedProperly: 'Y',
    lineLevelChecked: 'Y',
    itemsCleanedAndVisible: 'Y',
    totalBlinkersInstalled: 0,
    totalRoadLengthCovered: 0.0,
  });
  const [fixingOfSolarRoadStudsData, setFixingOfSolarRoadStudsData] = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeSizeAsPerDrawing: 'Y',
    colorCodeAndLocationAsPerSpec: 'Y',
    studsFixedProperly: 'Y',
    lineCheckedProperly: 'Y',
    spacingAsPerSpecs: 'Y',
    itemsCleanVisible: 'Y',
    noOfRoadStuds: 0,
    totalLengthCovered: 0.0,
  });
  const [fixingOfSpringPostData, setFixingOfSpringPostData] = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeAndSizeAsPerDrawing: 'Y',
    postsFixedProperly: 'Y',
    lineAndLevelChecked: 'Y',
    spacingAsPerSpecification: 'Y',
    itemsCleanedAndVisible: 'Y',
    springPostInstalled: 0,
    totalRoadLengthCovered: 0.0,
  });
  const [trafficImpactAttenuatorsData, setTrafficImpactAttenuatorsData] =
    useState({
      sourceMaterialApproved: 'Y',
      drawingApproved: 'Y',
      shapeSizeAsPerDrawing: 'Y',
      fixingMethodologyApproved: 'Y',
      attenuatorsFixedProperly: 'Y',
      itemsCleanedVisible: 'Y',
      totalNoOfAttenuatorsInstalled: 0,
      totalLengthOfRoadCovered: 0.0,
    });
  const [placementOfSignageSheetData, setPlacementOfSignageSheetData] =
    useState({
      materialSourceApproved: 'Y',
      drawingsApproved: 'Y',
      letterSizeAsPerDrawing: 'Y',
      rivetedProperlyInFrame: 'Y',
      placedAsPerDrawing: 'Y',
      totalSheetFixed: 0.0,
      totalRoadLengthCovered: 0.0,
    });
  const [backfillData, setBackfillData] = useState({
    areaClearOfDebris: 'Y',
    fillMaterialsApproved: 'Y',
    noDamageToCables: 'Y',
    backfillingComplete: 'Y',
    totalQtySoilUsed: 0.0,
    totalLengthTrenchBackfilled: 0.0,
  });
  const [signageLocationData, setSignageLocationData] = useState({
    drawingApproved: 'Y',
    locationMarked: 'Y',
    locationCheckedByEngineer: 'Y',
    noHindranceInInstallation: 'Y',
  });
  const [flooringData, setFlooringData] = useState({
    flooringMaterialSourceApproved: 'Y',
    tilesCrackFree: 'Y',
    cracksHolesUnevenSurface: 'Y',
    jointsAtTransitionSmooth: 'Y',
    flooringDoneAtRamps: 'Y',
    totalSurfaceArea: 0.0,
    totalTilesUsed: 0,
  });
  const [mortarChecklistData, setMortarChecklistData] = useState({
    mortarMixUniform: 'Y',
    sufficientMortarQuantity: 'Y',
    blockAlignmentPlumb: 'Y',
    jointsStaggered: 'Y',
    mortarBetweenBlockAndColumn: 'Y',
    totalCementBagsConsumed: 0,
    totalSurfaceAreaToBePlastered: 0.0,
    totalMortarUsed: 0.0,
  });
  const [placingChainLinkData, setPlacingChainLinkData] = useState({
    drawingApproved: 'Y',
    fencingInstalledAsPerPlotPlan: 'Y',
    fittingsCapsTensionBarsHingesHardwareInstalled: 'Y',
    cornerEndPostsAnchoredSupported: 'Y',
    fenceComponentsDefectFree: 'Y',
    fenceInstalledAtCorrectHeight: 'Y',
    fenceEndsWithTerminalPost: 'Y',
    appropriateFastenersUsed: 'Y',
    damagedMeshInformedSupplier: 'Y',
    missingDamagedComponents: 'Y',
    tooMuchMovementTopRail: 'Y',
    rightFencingMaterialUsed: 'Y',
    requiredFenceGapPresent: 'Y',
    meshTensionWireLoose: 'Y',
    totalSqmFenceInstalled: 0.0,
  });
  const [preCastRccPanelData, setPreCastRccPanelData] = useState({
    drawingApproved: 'Y',
    panelsFromApprovedSource: 'Y',
    damagedPanelFound: 'Y',
    alignmentPlumbFixingSupport: 'Y',
    totalPanelsInstalled: 0,
    totalAreaInstalled: 0.0,
  });
  const [erectionOfAngleSectionData, setErectionOfAngleSectionData] = useState({
    anglesFromApprovedSource: 'Y',
    materialInspectionClearance: 'Y',
    materialDamagedInformed: 'Y',
    erectionAsPerDrawing: 'Y',
    alignmentSupportOk: 'Y',
    totalAnglesErected: 0,
  });
  const [erectionOfBusShelterData, setErectionOfBusShelterData] = useState({
    materialSourceApproved: 'Y',
    drawingsApproved: 'Y',
    supportingSurfaceChecked: 'Y',
    safetyArrangementsInPlace: 'Y',
    totalPanelsInstalled: 0,
    totalBusStandsCompleted: 0,
  });
  const [erectionPreCastColumnData, setErectionPreCastColumnData] = useState({
    drawingApproved: 'Y',
    columnsFromApprovedSource: 'Y',
    columnDamaged: 'Y',
    erectionAsPerDrawing: 'Y',
    lineLevelChecked: 'Y',
    dimensionsAsPerDrawing: 'Y',
    totalNoOfColumnsErected: 0,
    columnSpacingAsPerDrawing: 'Y',
    totalLengthOfBwallCovered: 0.0,
  });
  const [fixingOfPanelsData, setFixingOfPanelsData] = useState({
    drawingApproved: 'Y',
    materialSourceApproved: 'Y',
    panelShapeSizeAsDrawing: 'Y',
    boltsAligned: 'Y',
    panelsFixedInLine: 'Y',
    boltsFullyTorqued: 'Y',
    totalPanelsInstalled: 0,
    totalBusShelterCompleted: 0,
  });
  const [fabricationOfStructureData, setFabricationOfStructureData] = useState({
    steelInspection: 'Y',
    sectionChecked: 'Y',
    materialSpecificationChecked: 'Y',
    connectionChecked: 'Y',
    boltHolesClean: 'Y',
    approvedWeldersUsed: 'Y',
    weldsIdentified: 'Y',
    weldsInspected: 'Y',
    weldsRepaired: 'Y',
    shapeEdgeBurnsRemoved: 'Y',
    oilGreaseRemoved: 'Y',
    steelCleanedAndPainted: 'Y',
    finalShopCoatApplied: 'Y',
    structureMarkedForErection: 'Y',
    structureApprovedPriorShipment: 'Y',
  });
  const [erectionOfStructureData, setErectionOfStructureData] = useState({
    positionChecked: 'Y',
    weldingDoneAsPerDrawing: 'Y',
    structureAsPerDrawing: 'Y',
    necessarySupportProvided: 'Y',
  });
  const [htPanelInstallationData, setHtPanelInstallationData] = useState({
    drawingsApproved: 'Y',
    equipmentInspected: 'Y',
    equipmentDamageReported: 'Y',
    foundationWorkCompleted: 'Y',
    concreteStrengthAchieved: 'Y',
    installationMethodologyApproved: 'Y',
    safetyArrangementsInPlace: 'Y',
    machineryAndManpowerAvailable: 'Y',
    installationCompleted: 'Y',
    manufacturerInstructionsFollowed: 'Y',
    totalEquipmentsInstalled: 0,
  });
  const [fixingAndInstallationData, setFixingAndInstallationData] = useState({
    drawingsApproved: 'Y',
    equipmentInspected: 'Y',
    equipmentDamageInformed: 'Y',
    foundationReady: 'Y',
    concreteStrengthAchieved: 'Y',
    installationMethodologyApproved: 'Y',
    safetyArrangementsInPlace: 'Y',
    machineryManpowerAvailable: 'Y',
    installationCompleted: 'Y',
    manufacturerInstructionsComplied: 'Y',
    totalEquipmentInstalled: 0,
  });
  const [cableTrenchExcavationData, setCableTrenchExcavationData] = useState({
    safetyMeasuresTaken: 'Y',
    drawingsApproved: 'Y',
    alignmentMarked: 'Y',
    utilitiesShifted: 'Y',
    excavationDepthWidth: 'Y',
    totalSoilQtyExcavated: 0.0,
    totalTrenchExcavated: 0.0,
  });
  const [conduitLayingData, setConduitLayingData] = useState({
    drawingsApproved: 'Y',
    conduitSizeShapeAsPerSpecs: 'Y',
    materialSourceApproved: 'Y',
    conduitPipeLaidProperly: 'Y',
    jointingDoneProperly: 'Y',
    totalConduitLength: 0.0,
  });
  const [cableTrenchDressingData, setCableTrenchDressingData] = useState({
    safetyMeasuresTaken: 'Y',
    manpowerAvailable: 'Y',
    lineLevelsChecked: 'Y',
    trenchClearedUndesirableMaterial: 'Y',
    trenchCompacted: 'Y',
    totalTrenchDressed: 0.0,
  });
  const [cableDressingData, setCableDressingData] = useState({
    cablesTiedProperly: 'Y',
    noCableDamaged: 'Y',
  });
  const [bricksLayeringData, setBricksLayeringData] = useState({
    drawingsApproved: 'Y',
    bricksSizeClassApproved: 'Y',
    totalAreaCompleted: 0.0,
    totalBricksLaid: 0,
    totalLengthTrenchCompleted: 0.0,
  });
  const [routeMarkingData, setRouteMarkingData] = useState({
    drawingsApproved: 'Y',
    markersSizeShapeAsPerApproved: 'Y',
    materialSourceApproved: 'Y',
    layoutMarkedAtSite: 'Y',
    routeMarkersFixedProperly: 'Y',
    spacingAsPerSpecifications: 'Y',
    totalRouteMarkersInstalled: 0,
    totalLengthCoveredRM: 0.0,
  });

  const [layingCautionTapeData, setLayingCautionTapeData] = useState({
    drawingsApproved: 'Y',
    sizeShapeThicknessAsPerDrawings: 'Y',
    sourceMaterialApproved: 'Y',
    cautionTapeLaidProperly: 'Y',
    cautionTapeLaidAtDesiredDepth: 'Y',
    totalCautionTapeLength: 0.0,
  });

  const [fixingOfModulesData, setFixingOfModulesData] = useState({
    drawingsApproved: 'Y',
    materialInspectedFactory: 'Y',
    materialReachedSiteOk: 'Y',
    mmsInstallationCompleted: 'Y',
    alignmentAsPerDrawings: 'Y',
    lineLevelChecked: 'Y',
    moduleAngleChecked: 'Y',
    nutBoltsTorqued: 'Y',
    modulesFitVisually: 'Y',
    totalModulesMounted: 0,
    totalLengthMounted: 0.0,
  });

  const [fixingOfMMSData, setFixingOfMMSData] = useState({
    drawingsApproved: 'Y',
    materialInspectedAndCleared: 'Y',
    materialReachedUndamaged: 'Y',
    foundationCompleted: 'Y',
    concreteAchievedStrength: 'Y',
    alignmentAsPerDrawings: 'Y',
    lineLevelChecked: 'Y',
    structureAngleChecked: 'Y',
    nutBoltsTorquedProperly: 'Y',
    visualFitCheck: 'Y',
    totalNoOfMMSTablesErected: 0,
    totalLengthOfMMSCompleted: 0.0,
  });

  const [fixingOfMC4Data, setFixingOfMC4Data] = useState({
    cablesConnected: 'Y',
    connectionsChecked: 'Y',
    totalYConnectorsUsed: 0,
  });

  const [
    erectionOfDoublePoleStructureData,
    setErectionOfDoublePoleStructureData,
  ] = useState({
    drawingsApproved: 'Y',
    structureAtSiteReady: 'Y',
    foundationWorkCompleted: 'Y',
    concreteStrengthAchieved: 'Y',
    installationMethodologyApproved: 'Y',
    safetyArrangementsInPlace: 'Y',
    machineryManpowerAvailable: 'Y',
    erectionCompletedAsPerMethodology: 'Y',
    totalStructuresErected: 0,
  });
  const [inverterInstallationData, setInverterInstallationData] = useState({
    drawingsApproved: 'Y',
    equipmentInspected: 'Y',
    equipmentDamagedInformed: 'Y',
    foundationWorkCompleted: 'Y',
    concreteStrengthAchieved: 'Y',
    installationMethodologyApproved: 'Y',
    safetyArrangementsInPlace: 'Y',
    machineryAndManpowerAvailable: 'Y',
    installationCompletedAsPerMethodology: 'Y',
    manufacturerInstructionsComplied: 'Y',
    totalEquipmentInstalled: 0,
  });

  const [stonePitchingData, setStonePitchingData] = useState({
    constructionDocsApproved: 'Y',
    workOfOtherTradesCompleted: 'Y',
    layerCompacted: 'Y',
    stoneShapeAndSizeAsPerSpec: 'Y',
    mortarReady: 'Y',
    mortarBondingDone: 'Y',
    totalSurfaceArea: 0.0,
    totalMaterialLaid: 0.0,
  });

  const [plantationData, setPlantationData] = useState({
    seedingHandledGently: 'Y',
    seedingDoneAfterHandling: 'Y',
    protectedFromSunWind: 'Y',
    seedKeptMoist: 'Y',
    transportDuringCoolerPeriod: 'Y',
    seedingAsPerDrawing: 'Y',
    waterDoneForGrowth: 'Y',
    controlWeeds: 'Y',
    barricadingDone: 'Y',
    totalPlantsPlanted: 0,
    totalAreaCovered: 0.0,
  });

  const [wateringData, setWateringData] = useState({
    waterClean: 'Y',
    wateringThreeTimesADay: 'Y',
    totalQtyWaterUsed: 0.0,
  });

  const [spreadingOfGrassSeedsData, setSpreadingOfGrassSeedsData] = useState({
    seedApprovedSource: 'Y',
    surfaceFreeFromGarbage: 'Y',
    surfaceWellPrepared: 'Y',
  });

  const [preparationOfSoilData, setPreparationOfSoilData] = useState({
    soilDumpedInLayer: 'Y',
    soilSpreadProperLength: 'Y',
    soilCompactedProperly: 'Y',
    totalQtySoil: 0.0,
    totalSurfaceArea: 0.0,
  });

  const [plantingTreesData, setPlantingTreesData] = useState({
    handleGently: 'Y',
    rootKeptMoist: 'Y',
    plantingDoneAsPerDrawing: 'Y',
    wateringDoneProperly: 'Y',
    controlWeedsNearPlantation: 'Y',
    barricadingDone: 'Y',
    heightAsPerDrawings: 'Y',
    typeOfPlantAsPerDrawing: 'Y',
    totalNoOfTreesPlanted: 0,
  });

  const [plantingGrassData, setPlantingGrassData] = useState({
    grassSeedingHandledGently: 'Y',
    grassSeedingDoneAfterHandling: 'Y',
    grassSeedingProtectedFromSunWind: 'Y',
    grassSeedKeptMoist: 'Y',
    grassTransportDuringCoolerPeriod: 'Y',
    seedingDoneAsPerApprovedDrawing: 'Y',
    seedingWateredProperly: 'Y',
    controlWeedsNearPlantation: 'Y',
    totalAreaCoveredWithGrass: 0.0,
  });
  const [pitExcavationData, setPitExcavationData] = useState({
    undergroundUtilities: 'Y',
    pitsShoredTimbered: 'Y',
    fencesBarricadesProvided: 'Y',
    excavatedMaterialKeptAway: 'Y',
    heavyEquipmentKeptAway: 'Y',
    dangerSignsProvided: 'Y',
    accessExitProvided: 'Y',
    setOutChecked: 'Y',
    excavationSizeChecked: 'Y',
    looseMaterialsChecked: 'Y',
    bottomOfExcavationChecked: 'Y',
  });
  const [chuteMembersData, setChuteMembersData] = useState({
    bottomSoilCompacted: 'Y',
    slopeMaintained: 'Y',
    chuteLiningDone: 'Y',
    supportForShutteringDone: 'Y',
    jointInLineAndLevel: 'Y',
    concretePlacingArrangement: 'Y',
    totalChuteLength: 0.0,
  });
  const [layingOfTopSoilData, setLayingOfTopSoilData] = useState({
    approvedSource: 'Y',
    vehicleMovementArrangement: 'Y',
    machineryAvailable: 'Y',
    markingDone: 'Y',
    totalAreaLaying: 0.0,
    totalQtyOfSoil: 0.0,
  });

  const [layingOfGrassTurfData, setLayingOfGrassTurfData] = useState({
    turfsCutPlantedWithin24hrs: 'Y',
    baseAreaPrepared: 'Y',
    topsoilThicknessVerified: 'Y',
    suitableTopDressingMaterial: 'Y',
    turfingLevelChecked: 'Y',
    waterSprayedCompletion: 'Y',
    woodNailingUsed: 'Y',
    turfingArrangementChecked: 'Y',
    overallTurfingWorkAccepted: 'Y',
    noVehiclesTrespass: 'Y',
    hydroseedingMethodVerified: 'Y',
    fibromatInstalled: 'Y',
    totalAreaCovered: 0.0,
  });

  const [fixingOfMeshData, setFixingOfMeshData] = useState({
    sourceApproved: 'Y',
    sizeAsPerDrawing: 'Y',
    wireMeshDamageChecked: 'Y',
    unitStretchedForFoldsRemoved: 'Y',
    totalAreaSlope: 0.0,
    totalQtyMesh: 0.0,
  });

  const [fixingGeoCellData, setFixingGeoCellData] = useState({
    sourceApproved: 'Y',
    methodStatementApproved: 'Y',
    slopeMaintained: 'Y',
    slopeCompacted: 'Y',
    geoCellLaidAsPerDrawing: 'Y',
    geoCellJointsFixedProperly: 'Y',
    geoCellSizeAsPerDrawing: 'Y',
    totalGeoCellArea: 0.0,
    totalGeoCellConsumption: 0.0,
  });
  const [cuttingOfSoilData, setCuttingOfSoilData] = useState({
    safetyMeasuresTaken: 'Y',
    equipmentAvailable: 'Y',
    excavationDone: 'Y',
    totalSoilCutQty: 0.0,
  });
  const [bricksWorkData, setBricksWorkData] = useState({
    drawingsAvailable: 'Y',
    bricksSizeClassAsPerDrawing: 'Y',
    requiredBlocksAvailable: 'Y',
    hackingDone: 'Y',
    cementMortarApplied: 'Y',
    aluminiumTemplatesUsed: 'Y',
    requiredToolsAvailable: 'Y',
    clientSpecificRequirements: 'N',
    cementApprovedGrade: 'Y',
    sandCleanGritty: 'Y',
    floorLevelMarked: 'Y',
    pillarMarkingsDone: 'Y',
    brickworkChecked: 'Y',
    totalBrickWorkArea: 0.0,
    totalBrickWorkCum: 0.0,
  });

  const [backfillingData, setBackfillingData] = useState({
    areaClearOfDebris: 'Y',
    backfillingTimingAppropriate: 'Y',
    approvedFillMaterials: 'Y',
    layerThicknessCheck: 'Y',
    compactionDegreeCheck: 'Y',
    layerTestsDone: 'Y',
    levelAndElevationVerified: 'Y',
    beddingMaterialCompacted: 'Y',
    waterproofingMembraneProtected: 'Y',
    backfillingCompleteAndClean: 'Y',
    totalSoilQtyUsed: 0.0,
  });

  const [layingOfPQCData, setLayingOfPQCData] = useState({
    trailPatchApproved: 'Y',
    mixDesignApproved: 'Y',
    dlcLayerApproved: 'Y',
    adequateGradeSurveyStakes: 'Y',
    pqcTransportedWithTarpaulin: 'Y',
    sufficientLaboursAvailable: 'Y',
    separationMembraneTight: 'Y',
    dowelBarsCoveredWithSheath: 'Y',
    backhoeBucketAvailable: 'Y',
    pqcLeadDistance: 0.0,
    paverAvailableForDLC: 'Y',
    paverFunctioningChecked: 'Y',
    materialPlacedAppropriately: 'Y',
    curingArrangementAvailable: 'Y',
    layersSegregationFree: 'Y',
    surfaceProtectionArranged: 'Y',
    lightArrangementForNightWork: 'Y',
    ppeAvailable: 'Y',
    totalPQCLaidLength: 0.0,
    totalPQCLaidArea: 0.0,
    pqcThicknessLaid: 0.0,
  });

  const [layingOfSeparationMembraneData, setLayingOfSeparationMembraneData] =
    useState({
      subbaseSweptClean: 'Y',
      undulationsLeveled: 'Y',
      membraneTightStraight: 'Y',
      colourOfMembrane: 'Y',
      thicknessOfMembrane: 'Y',
      properOverlappingProvided: 'Y',
      finishedCompactedLayerThickness: 0.0,
      nonConformanceFound: 'Y',
    });

  const [millingData, setMillingData] = useState({
    milledSurfaceUniform: 'Y',
    finishedSurfaceWithinTolerance: 'Y',
    textureSafeForMotorist: 'Y',
    depthOfMilling: 0.0,
    totalQtyMilledMaterial: 0.0,
    totalSurfaceAreaMilled: 0.0,
  });

  const [sealantFilingData, setSealantFilingData] = useState({
    sealantSourceApproved: 'Y',
    jointFaceCleaned: 'Y',
    sealantPlacedProperDepth: 'Y',
    twoCoatPrimerDone: 'Y',
    tappingDoneEdges: 'Y',
    sealantPouredProperly: 'Y',
    tapeRemovedAfterTooling: 'Y',
    arrangementForCuring: 'Y',
    sealantQtyUtilized: 0.0,
  });

  const [placingOfFillerBoardData, setPlacingOfFillerBoardData] = useState({
    sourceApproved: 'Y',
    surfaceFreeFromDust: 'Y',
    fillerBoardCutProperly: 'Y',
    fillerBoardPlacedProperly: 'Y',
    fillerBoardCompressed: 'Y',
    fillerBoardThickness: 0.0,
    totalFillerBoardQty: 0.0,
  });

  const [compactionData, setCompactionData] = useState({
    uniformSprinkling: 'Y',
    looseThicknessChecked: 'Y',
    omcMaintained: 'Y',
    suitableRollerAvailable: 'Y',
    passesSpeedPatternFollowed: 'Y',
    compactedLayerThicknessSpecified: 'Y',
    compactedLayerThickness: 0.0,
    localizedWetSoftAreaFound: 'N',
    layerFreeFromSegregation: 'Y',
    protectionForFinishedSurface: 'Y',
    nonConformanceFound: 'N',
  });

  const [placingOfDowelData, setPlacingOfDowelData] = useState({
    pqcDrawingApproved: 'Y',
    dowelBarsPlacedProperDepth: 'Y',
    barsAlignedProperly: 'Y',
    dowelBarCoveredWithPlasticSheath: 'Y',
    sheathDia: 0.0,
    sheathMouthClosed: 'Y',
    dowelBarLengthAsPerDrawing: 'Y',
    totalDowelBars: 0,
  });

  const [texturingData, setTexturingData] = useState({
    steelTinesBrushAutomatic: 'Y',
    texturingWithinTimeLimits: 'Y',
    tiningUnitPressureAdjusted: 'Y',
    tiningRakersCleaned: 'Y',
    tinesBentOrDamaged: 'Y',
    tinedGrooveDimensionsCorrect: 'Y',
    surfaceBleedingDone: 'Y',
    brushAppliedOneDirection: 'Y',
    brushAsPerMorthSpecification: 'Y',
    totalTexturingDone: 0.0,
  });

  const [fixingOfWireRopeData, setFixingOfWireRopeData] = useState({
    strandsFromApprovedSource: 'Y',
    endAttachmentsCondition: 'Y',
    heatDamageEvidence: 'Y',
    ropeDamageRectification: 'Y',
    alignedProperlyAsPerDrawing: 'Y',
    strandTensionedAtEnds: 'Y',
  });

  const [placingOfTieBarData, setPlacingOfTieBarData] = useState({
    drawingApproved: 'Y',
    placingDoneAsPerDrawings: 'Y',
    alignmentDoneProperly: 'Y',
    nonConformanceFound: 'Y',
  });

  const [machineCuttingData, setMachineCuttingData] = useState({
    cuttingSawsAvailable: 'Y',
    diamondSawBladesAvailable: 'Y',
    waterTankAvailable: 'Y',
    machineCutStartTimeCorrect: 'Y',
    cuttingAsPerApprovedDrawing: 'Y',
  });

  const [layingOfDlcTableData, setLayingOfDlcTableData] = useState([
    {
      vehicleNo: '',
      totalQtyDlc: 0,
      layingStartTime: '',
      layingEndTime: '',
      key: Guid.create(),
    },
  ]);
  const [layingOfDLCData, setLayingOfDLCData] = useState({
    mixDesignApproved: 'Y',
    gsbLayerApproved: 'Y',
    gradeSurveyStakesAvailable: 'Y',
    placingMaterialAppropriate: 'Y',
    paverAvailable: 'Y',
    curingArrangementAvailable: 'Y',
    suitableRollersAvailable: 'Y',
    layersSegregationFree: 'Y',
    surfaceProtectionArrangement: 'Y',
    lightArrangementForNightWork: 'Y',
    batchSlipAsPerMixDesign: 'Y',
    workerPPE: 'Y',
    totalLengthDLC: 0.0,
    totalAreaDLC: 0.0,
  });

  const [layingOfPaverBlockData, setLayingOfPaverBlockData] = useState({
    subBaseCompacted: 'Y',
    sandLayingCourse: 'Y',
    pavingBlocksApprovedSource: 'Y',
    pavingBlocksDimension: 'Y',
    pavingBlocksInstallation: 'Y',
    plateCompactorMoved: 'Y',
    jointsAsPerMethodStatement: 'Y',
    locationAlignmentCorrect: 'Y',
    totalLengthLaid: 0.0,
    totalSqmLaid: 0.0,
    thicknessPaverBlock: 0.0,
    gradeOfConcrete: 'M20',
  });

  const [cuttingOfJointsData, setCuttingOfJointsData] = useState({
    jointsCutAtDesiredIntervals: 'Y',
    jointsCutAtDesiredDepth: 'Y',
    jointCutDoneProperly: 'Y',
    totalLengthCompleted: 0.0,
  });

  const [fixingVerticalPostData, setFixingVerticalPostData] = useState({
    pitsDuggedToPlan: 'Y',
    distanceMaintainedBarrierSlope: 'Y',
    distanceMaintainedBarrierCarriageway: 'Y',
    postsAlignedHeightAsPerDrawing: 'Y',
    steelPostsPlacedMethodology: 'Y',
    totalVerticalPostInstalled: 0,
  });

  const [fixingOfMetalBeamData, setFixingOfMetalBeamData] = useState({
    barrierToEmbankmentDistance: 'Y',
    barrierToEdgeOfCarriagewayDistance: 'Y',
    medianWBeamFaceDistance: 'Y',
    spacersInstalledProperly: 'Y',
    boltsFixedAndTightened: 'Y',
    totalLengthOfMetalBeamFixed: 0.0,
  });

  const [pipeLayingAndJointingData, setPipeLayingAndJointingData] = useState({
    materialAsPerGFC: 'Y',
    latestGFCAvailable: 'Y',
    locationLevelsPipeSizeAsPerGFC: 'Y',
    routingCheckedAsPerGFC: 'Y',
    hangerSupportProperSpacing: 'Y',
    fastenerHangerRodAsPerGFC: 'Y',
    jointPreparationFitUp: 'Y',
    visualInspectionOfWeldedJoints: 'Y',
    threadCheckForJoints: 'Y',
    threadedJointsTightened: 'Y',
    undergroundGIPipingTreatment: 'Y',
    threadedPipesAlignedStraight: 'Y',
    installedPipesAlignedProperly: 'Y',
    totalPipeLength: 0.0,
    totalNumberOfPipes: 0,
  });

  const [layingAndCompactionData, setLayingAndCompactionData] = useState({
    safetyMeasuresTaken: 'Y',
    approvedMethodologyAvailable: 'Y',
    primeCoatCured: 'Y',
    sprayRateChecked: 'Y',
    jointTrimmedPrepared: 'Y',
    programConveyed: 'Y',
    thermometerAvailable: 'Y',
    paverSensorsSet: 'Y',
    alignmentMarked: 'Y',
    paverPlacedCleaned: 'Y',
    mixTransported: 'Y',
    mixTemperatureFound: 'Y',
    looseThicknessChecked: 'Y',
    rollingPatternFollowed: 'Y',
    surfaceLevelChecked: 'Y',
    transverseJointsPrepared: 'Y',
    nonConformanceFound: 'N',
    layerThickness: 0.0,
    totalMaterialQtyLaid: 0.0,
    totalMaterialQtySqm: 0.0,
  });

  const [roadMarkingData, setRoadMarkingData] = useState({
    drawingAndMethodApproved: 'Y',
    thermoplasticAndGlassBeadApproved: 'Y',
    heaterConditionChecked: 'Y',
    thermometerWorking: 'Y',
    materialHeatedToSpecifiedTemperature: 'Y',
    surfaceClean: 'Y',
    markingDoneBeforeLaying: 'Y',
    glassBeadsApplied: 'Y',
    paintLaidInMoltenState: 'Y',
    paintThicknessChecked: 'Y',
    nonConformanceFound: 'N',
  });
  const [primeCoatData, setPrimeCoatData] = useState({
    previousLayerApproved: 'Y',
    surfacePreparationSatisfactory: 'Y',
    materialGradeApproved: 'Y',
    bituminousEmulsionTemperatureChecked: 'Y',
    uniformSprayRate: 'Y',
    nonConformanceFound: 'N',
  });

  const [spreadingAndCompactionData, setSpreadingAndCompactionData] = useState({
    sourceOfMaterialApproved: 'Y',
    groundImprovementDone: 'Y',
    underLayingLayerApproved: 'Y',
    gradeSurveyStakesAvailable: 'Y',
    graderAvailable: 'Y',
    gradingDoneAsPerRequirement: 'Y',
    uniformSprinklingDone: 'Y',
    dumpingPatternFollowed: 'Y',
    materialFreeFromDeleterious: 'Y',
    containsOverSizeBoulders: 'Y',
    looseThicknessChecked: 'Y',
    omcMaintained: 'Y',
    suitableRollerAvailable: 'Y',
    rollingPatternFollowed: 'Y',
    finishedLayerThicknessSpecified: 'Y',
    localizedIssuesFound: 'N',
    layerFreeFromSegregation: 'Y',
    protectionOfFinishedSurfaceAvailable: 'Y',
    nonConformanceFound: 'N',
  });

  const [strippingAndStoringTopSoilData, setStrippingAndStoringTopSoilData] =
    useState({
      topSoilCollectedStored: 0, // Default value for top soil collected (cum)
    });

  const [erectionData, setErectionData] = useState({
    groundLeveled: 'Y',
    areaBarricaded: 'Y',
    temporaryLights: 'Y',
    flagManAvailable: 'Y',
    methodologyAvailable: 'Y',
    cranePositioned: 'Y',
    deShacklesCertified: 'Y',
    safetyColorCode: 'Y',
    hydraulicJacksCalibrated: 'Y',
    limitSwitchWorking: 'Y',
    cotterPinPlaced: 'Y',
    macalloyBarsCondition: 'Y',
    tpiDone: 'Y',
    tpiCertificatesAvailable: 'Y',
    counterWeightsPlaced: 'Y',
    positioningMarked: 'Y',
    trafficDiverted: 'Y',
    workersSafetyCertified: 'Y',
    safetyArrangements: 'Y',
    sitePositioned: 'Y',
    lateralSupportEnsured: 'Y',
  });

  const [boringOfDiaphragmData, setBoringOfDiaphragmData] = useState({
    densityOfPolymer: 0.0,
    viscosityOfPolymer: 0,
    pHValueOfPolymer: 0,
    sandContentOfPolymer: 0,
    depthOfWall: 0.0,
  });

  const [dumpingOfSoilData, setDumpingOfSoilData] = useState({
    soilApprovedSource: 'Y',
    soilWithoutUnwantedMaterials: 'Y',
    quantityOfSoilDumped: '0.0',
  });
  const [procurementOfSheetData, setProcurementOfSheetData] = useState({
    totalSheetPurchased: 0,
  });
  const [fixingOfBracingsData, setFixingOfBracingsData] = useState({
    lineLevelsChecked: 'Y',
    weldingAsPerApprovedDrawing: 'Y',
    bracingsAsPerApprovedDrawing: 'Y',
  });
  const [fixingOfRailingData, setFixingOfRailingData] = useState({
    lineLevelsChecked: 'Y',
    railingAsPerApprovedDrawing: 'Y',
  });
  const [applicationOfFilterMediaData, setApplicationOfFilterMediaData] =
    useState({
      filterMediaAsPerDrawing: 'Y',
    });

  const [erectionOfColumnsData, setErectionOfColumnsData] = useState({
    positionChecked: 'Y',
    weldingAsPerDrawing: 'Y',
    columnsAsPerDrawing: 'Y',
    supportProvided: 'Y',
  });

  const [erectionOfFaciaPanelsData, setErectionOfFaciaPanelsData] = useState({
    sufficientStrength: 'Y',
    notDamaged: 'Y',
    lineLevelsChecked: 'Y',
    maleFemaleJointsChecked: 'Y',
    verticalSlopeAsPerDrawing: 'Y',
    soilCompactedAndGeoGridsFixed: 'Y',
  });

  const [erectionOfFrictionSlabData, setErectionOfFrictionSlabData] = useState({
    sufficientStrength: 'Y',
    notDamaged: 'Y',
    lineLevelsChecked: 'Y',
    verticalSlopeAsPerDrawing: 'Y',
    soilCompactedAndGeoGridsFixed: 'Y',
    copingDone: 'Y',
  });

  const [fixingOfGeoGridData, setFixingOfGeoGridData] = useState({
    materialApprovedByEngineer: 'Y',
    specificationsAsPerApprovedDrawing: 'Y',
    soilProperlyCompacted: 'Y',
    geoGridsAnchoredIntoFaciaPanels: 'Y',
    geoGridsTensionedAndNailed: 'Y',
    minimumLengthAsPerApprovedDrawing: 'Y',
  });

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
  const [liftingSegmentData, setLiftingSegmentData] = useState({
    barricadedArea: 'Y',
    temporaryLights: 'Y',
    flagManAvailable: 'Y',
    liftingMethodology: 'Y',
    deshacklesTestCertificate: 'Y',
    safetyColorCode: 'Y',
    hydraulicJacksCondition: 'Y',
    hoistLimitSwitch: 'Y',
    cotterPinsPlaced: 'Y',
    macalloyBarsCondition: 'Y',
    heightPermitObtained: 'Y',
    macalloyBarsTestCertificate: 'Y',
    liftingSequence: 'Y',
    liftingHolesLocation: 'Y',
    liftingArrangementsWorking: 'Y',
    preStressingDuctsClear: 'Y',
    concreteStrengthGained: 'Y',
    sliderTrolleyPosition: 'Y',
    sandBlastingDone: 'Y',
    repairingFinished: 'Y',
    noRepairsOnShearkey: 'Y',
    bundRemoved: 'Y',
    soffitDeckCleaned: 'Y',
    sheathingDuctCleaned: 'Y',
    ductAlignmentChecked: 'Y',
    stressingHoleCleaned: 'Y',
    trailerFitnessChecked: 'Y',
    trailerTyresChecked: 'Y',
    groundLeveled: 'Y',
    cranePositioned: 'Y',
    trafficDiverted: 'Y',
    workersSafetyChecked: 'Y',
    safetyArrangementsPlaced: 'Y',
    segmentPositioned: 'Y',
    lateralSupportEnsured: 'Y',
  });
  const [liftingCombinedLRData, setLiftingCombinedLRData] = useState({
    // A) Preparation of Area for Lifting at Stacking Yard
    areaBarricaded: 'Y',
    temporaryLights: 'Y',
    flagManAvailable: 'Y',
    liftingMethodology: 'Y',
    // B) Tools and Tackles for lifting at Stacking Yard
    deshacklesTestCertificate: 'Y',
    safetyColorCode: 'Y',
    hydraulicJacksCondition: 'Y',
    hoistLimitSwitch: 'Y',
    cotterPinsPlaced: 'Y',
    macalloyBarsCondition: 'Y',
    // C) Lifting of Segment at Stacking Yard
    heightPermitObtained: 'Y',
    macalloyBarsTestCertificate: 'Y',
    liftingSequence: 'Y',
    liftingHolesLocation: 'Y',
    liftingArrangementsWorking: 'Y',
    preStressingDuctsClear: 'Y',
    concreteStrengthGained: 'Y',
    sliderTrolleyPosition: 'Y',
    // D) Segment dispatch and transportation
    sandBlastingDone: 'Y',
    repairingFinished: 'Y',
    noRepairsOnShearkey: 'Y',
    bundRemoved: 'Y',
    soffitDeckCleaned: 'Y',
    sheathingDuctCleaned: 'Y',
    ductAlignmentChecked: 'Y',
    temporaryStressingHoleCleaned: 'Y',
    trailerFitnessChecked: 'Y',
    trailerTyresChecked: 'Y',
    // E) Preparation of Area for Lifting at Erection Site
    groundLeveled: 'Y',
    areaBarricadedErectionSite: 'Y',
    temporaryLightsErectionSite: 'Y',
    flagManAvailableErectionSite: 'Y',
    liftingMethodologyErectionSite: 'Y',
    cranePositioned: 'Y',
    // F) Tools and Tackles for lifting at Erection Site
    deshacklesTestCertificateErectionSite: 'Y',
    safetyColorCodeErectionSite: 'Y',
    hydraulicJacksConditionErectionSite: 'Y',
    hoistLimitSwitchErectionSite: 'Y',
    cotterPinsPlacedErectionSite: 'Y',
    macalloyBarsConditionErectionSite: 'Y',
    cranesTPICompleted: 'Y',
    cranesTPICertificatesAvailable: 'Y',
    counterWeightsPlaced: 'Y',
    // G) Lifting and Positioning of segments
    positioningOfSegmentMarked: 'Y',
    trafficDiverted: 'Y',
    workersSafetyChecked: 'Y',
    safetyArrangementsPlaced: 'Y',
    segmentPositioned: 'Y',
    lateralSupportEnsured: 'Y',
  });
  const [removalFormworkData, setRemovalFormworkData] = useState({
    concreteStrengthAchieved: 'Y',
    minimumTimeAttained: 'Y',
  });
  const [fabricationData, setFabricationData] = useState({
    steelInspectionSurfaceCondition: 'Y',
    sectionCheckedForDimension: 'Y',
    materialSpecificationChecked: 'Y',
    connectionChecked: 'Y',
    boltHolesClean: 'Y',
    approvedWeldersUsed: 'Y',
    weldsIdentified: 'Y',
    weldsInspected: 'Y',
    weldsRepaired: 'Y',
    shapeEdgeBurnsRemoved: 'Y',
    oilGreaseRemoved: 'Y',
    steelCleanedAndPainted: 'Y',
    finalShopCoatApplied: 'Y',
    memberMarkedForErection: 'Y',
    memberApprovedByInspector: 'Y',
  });

  const [prestressingData, setPrestressingData]: any = useState([
    {
      cableNo: '',
      stressingSequence: '',
      A0: 0,
      B0: 0,
      A1: 0,
      B1: 0,
      A2: 0,
      PA: 0,
      B2: 0,
      PB: 0,
      SA0: 0,
      SB0: 0,
    },
  ]);
  const [temporaryPrestressingData, setTemporaryPrestressingData]: any =
    useState([
      // {
      //   jointNumbers: '',
      //   calibrationDone: 'Y',
      //   stressingSequenceDrawingNumber: '',
      //   dateOfPrestressing: '',
      //   timeOfPrestressing: '',
      //   maxJackPressure: 0,
      //   jackPressureApplied: 0,
      //   key: Guid.create(),
      // },
    ]);

  const onAddMoreTemporaryPrestressing = () => {
    setTemporaryPrestressingData([
      ...temporaryPrestressingData,
      {
        jointNumbers: '',
        calibrationDone: 'Y',
        stressingSequenceDrawingNumber: '',
        dateOfPrestressing: '',
        timeOfPrestressing: '',
        maxJackPressure: 0,
        jackPressureApplied: 0,
        key: Guid.create(),
      },
    ]);
  };

  const [curingData, setCuringData] = useState({
    waterUsedForCuring: 'Y',
    phValueOfWater: 'Y',
    consumptionOfWater: 0,
  });

  const handleCuring = (field: string, value: string) => {
    setCuringData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleInputChangeFixingOfBearing = (key: any, value: any) => {
    setFixingOfBearingData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleInputChangeFabrication = (key: string, value: string) => {
    setFabricationData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleTextInputChangeDumping = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedData = [...dumpingData];
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'vehicleNo':
        if (!/^\d{4}$/.test(value)) {
          isValid = false;
          errorMessage =
            'Vehicle No must be the last 4 digits and contain only numbers.';
        }
        break;

      case 'qtyDumped':
        const qtyDumped = parseFloat(value);
        if (
          isNaN(qtyDumped) ||
          qtyDumped <= 0 ||
          qtyDumped > 100000 ||
          value.split('.')[1]?.length > 3
        ) {
          isValid = false;
          errorMessage =
            'Quantity dumped must be > 0, up to 3 decimal places, and max 100,000.';
        }
        break;

      default:
        break;
    }

    if (!isValid) {
      showSnackbar(errorMessage, 'error');
    } else {
      updatedData[index][field] = value;
      setDumpingData(updatedData);
    }
  };
  const onAddMoreLayingOfDlc = () => {
    setLayingOfDlcTableData([
      ...layingOfDlcTableData,
      {
        vehicleNo: '',
        totalQtyDlc: 0,
        layingStartTime: '',
        layingEndTime: '',
        key: Guid.create(),
      },
    ]);
  };
  const validateInverterInstallationData = (
    inverterInstallationData: any,
  ): boolean => {
    // Validation for total number of equipment installed
    const totalEquipmentInstalled = parseInt(
      inverterInstallationData.totalEquipmentInstalled,
    );

    if (
      isNaN(totalEquipmentInstalled) ||
      totalEquipmentInstalled <= 0 ||
      totalEquipmentInstalled > 1000
    ) {
      showSnackbar(
        'Please enter a valid number of equipment installed (should be > 0 and <= 1000)',
        'error',
      );
      return false;
    }

    return true;
  };
  const validateErectionOfDoublePoleStructureData = (
    erectionOfDoublePoleStructureData: any,
  ): boolean => {
    // Validate total number of structures erected
    const totalStructuresErected = parseInt(
      erectionOfDoublePoleStructureData.totalStructuresErected,
      10,
    );
    if (
      isNaN(totalStructuresErected) ||
      totalStructuresErected <= 0 ||
      totalStructuresErected > 1000
    ) {
      showSnackbar(
        'Please enter a valid Total number of Double Pole Structures erected (should be > 0 and <= 1000)',
        'error',
      );
      return false;
    }

    // Converting the values back to numbers after validation
    erectionOfDoublePoleStructureData.totalStructuresErected = Number(
      erectionOfDoublePoleStructureData.totalStructuresErected,
    );

    return true;
  };

  const validateStonePitchingData = (stonePitchingData: any) => {
    const totalSurfaceArea = parseFloat(stonePitchingData.totalSurfaceArea);
    const totalMaterialLaid = parseFloat(stonePitchingData.totalMaterialLaid);

    // Validation for Total Surface Area of Stone Pitching (sqm)
    if (
      isNaN(totalSurfaceArea) ||
      totalSurfaceArea <= 0 ||
      totalSurfaceArea > 100000 ||
      stonePitchingData.totalSurfaceArea.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Surface Area (sqm) with max 3 decimal places, value should be > 0 and <= 100,000',
        'error',
      );
      return false;
    }

    // Validation for Total Material Laid (tonne)
    if (
      isNaN(totalMaterialLaid) ||
      totalMaterialLaid <= 0 ||
      totalMaterialLaid > 100000 ||
      stonePitchingData.totalMaterialLaid.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Material Laid (tonne) with max 3 decimal places, value should be > 0 and <= 100,000',
        'error',
      );
      return false;
    }

    return true;
  };

  const validatePlantationData = (plantationData: any): boolean => {
    const totalPlants = parseInt(plantationData.totalPlantsPlanted);
    const totalArea = parseFloat(plantationData.totalAreaCovered);

    if (isNaN(totalPlants) || totalPlants <= 0 || totalPlants > 100000) {
      showSnackbar(
        'Please enter a valid Total Number of Plants Planted (value > 0, max 100000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalArea) ||
      totalArea <= 0 ||
      totalArea > 100000 ||
      plantationData.totalAreaCovered.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Area Covered (in Sqm) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    plantationData.totalPlantsPlanted = Number(
      plantationData.totalPlantsPlanted,
    );
    plantationData.totalAreaCovered = Number(plantationData.totalAreaCovered);

    return true;
  };

  const validateWateringData = (wateringData: any): boolean => {
    const totalQtyWaterUsed = parseFloat(wateringData.totalQtyWaterUsed);

    // Validation for Total Quantity of Water Used
    if (
      isNaN(totalQtyWaterUsed) ||
      totalQtyWaterUsed <= 0 ||
      totalQtyWaterUsed > 100000 ||
      wateringData.totalQtyWaterUsed.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Quantity of Water Used (in litres) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    wateringData.totalQtyWaterUsed = Number(wateringData.totalQtyWaterUsed);
    return true;
  };

  const validatePreparationOfSoilData = (
    preparationOfSoilData: any,
  ): boolean => {
    const totalQtySoil = parseFloat(preparationOfSoilData.totalQtySoil);
    const totalSurfaceArea = parseFloat(preparationOfSoilData.totalSurfaceArea);

    if (
      isNaN(totalQtySoil) ||
      totalQtySoil <= 0 ||
      totalQtySoil > 1000000 ||
      preparationOfSoilData.totalQtySoil.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total qty of soil prepared (in cum) with max 3 decimal places, value should be > 0 and <= 1000000',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalSurfaceArea) ||
      totalSurfaceArea <= 0 ||
      totalSurfaceArea > 1000000 ||
      preparationOfSoilData.totalSurfaceArea.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total surface area laid (in sqm) with max 3 decimal places, value should be > 0 and <= 1000000',
        'error',
      );
      return false;
    }

    preparationOfSoilData.totalQtySoil = Number(
      preparationOfSoilData.totalQtySoil,
    );
    preparationOfSoilData.totalSurfaceArea = Number(
      preparationOfSoilData.totalSurfaceArea,
    );

    return true;
  };

  const validatePlantingTreesData = (plantingTreesData: any) => {
    const totalNoOfTreesPlanted = parseInt(
      plantingTreesData.totalNoOfTreesPlanted,
      10,
    );

    // Validation for Total No. of Trees Planted
    if (
      isNaN(totalNoOfTreesPlanted) ||
      totalNoOfTreesPlanted <= 0 ||
      totalNoOfTreesPlanted > 100000
    ) {
      showSnackbar(
        'Please enter a valid Total No. of Trees Planted (> 0 and <= 100000)',
        'error',
      );
      return false;
    }

    // Converting the value back to a number after validation
    plantingTreesData.totalNoOfTreesPlanted = totalNoOfTreesPlanted;

    return true;
  };

  const validatePlantingGrassData = (plantingGrassData: any): boolean => {
    const totalAreaCovered = parseFloat(
      plantingGrassData.totalAreaCoveredWithGrass,
    );
    if (
      isNaN(totalAreaCovered) ||
      totalAreaCovered <= 0 ||
      totalAreaCovered > 100000 ||
      plantingGrassData.totalAreaCoveredWithGrass.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Area Covered with Grass (sqm) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }
    plantingGrassData.totalAreaCoveredWithGrass = Number(
      plantingGrassData.totalAreaCoveredWithGrass,
    );

    return true;
  };

  const validateChuteMembersData = (chuteMembersData: any): boolean => {
    const totalChuteLength = parseFloat(chuteMembersData.totalChuteLength);
    if (
      isNaN(totalChuteLength) ||
      totalChuteLength <= 0 ||
      totalChuteLength > 100000 ||
      chuteMembersData.totalChuteLength.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Length of Chute (in meters) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    chuteMembersData.totalChuteLength = Number(
      chuteMembersData.totalChuteLength,
    );

    return true;
  };

  const validateLayingOfTopSoilData = (layingOfTopSoilData: any): boolean => {
    const totalAreaLaying = parseFloat(layingOfTopSoilData.totalAreaLaying);
    const totalQtyOfSoil = parseFloat(layingOfTopSoilData.totalQtyOfSoil);
    if (
      isNaN(totalAreaLaying) ||
      totalAreaLaying <= 0 ||
      totalAreaLaying > 100000 ||
      layingOfTopSoilData.totalAreaLaying.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Area (Sqm) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }
    if (
      isNaN(totalQtyOfSoil) ||
      totalQtyOfSoil <= 0 ||
      totalQtyOfSoil > 100000 ||
      layingOfTopSoilData.totalQtyOfSoil.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Quantity of Soil (cum) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    layingOfTopSoilData.totalAreaLaying = Number(
      layingOfTopSoilData.totalAreaLaying,
    );
    layingOfTopSoilData.totalQtyOfSoil = Number(
      layingOfTopSoilData.totalQtyOfSoil,
    );

    return true;
  };

  const validateLayingOfGrassTurfData = (
    layingOfGrassTurfData: any,
  ): boolean => {
    const totalAreaCovered = parseFloat(layingOfGrassTurfData.totalAreaCovered);
    if (
      isNaN(totalAreaCovered) ||
      totalAreaCovered <= 0 ||
      totalAreaCovered > 100000 ||
      layingOfGrassTurfData.totalAreaCovered.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Area Covered (in sqm) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }
    layingOfGrassTurfData.totalAreaCovered = Number(
      layingOfGrassTurfData.totalAreaCovered,
    );

    return true;
  };

  const validateFixingOfMeshData = (fixingOfMeshData: any): boolean => {
    const totalAreaSlope = parseFloat(fixingOfMeshData.totalAreaSlope);
    const totalQtyMesh = parseFloat(fixingOfMeshData.totalQtyMesh);

    // Validation for Total Area of the Slope in Sqm
    if (
      isNaN(totalAreaSlope) ||
      totalAreaSlope <= 0 ||
      totalAreaSlope > 100000 ||
      fixingOfMeshData.totalAreaSlope.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Area of the Slope (in Sqm) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    // Validation for Total Qty of Mesh in kg
    if (
      isNaN(totalQtyMesh) ||
      totalQtyMesh <= 0 ||
      totalQtyMesh > 100000 ||
      fixingOfMeshData.totalQtyMesh.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Qty of Mesh (in kg) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    // Converting values back after validation
    fixingOfMeshData.totalAreaSlope = Number(fixingOfMeshData.totalAreaSlope);
    fixingOfMeshData.totalQtyMesh = Number(fixingOfMeshData.totalQtyMesh);

    return true;
  };

  const validateFixingGeoCellData = (fixingGeoCellData: any): boolean => {
    // Parsing values to float
    const totalAreaGeoCell = parseFloat(fixingGeoCellData.totalGeoCellArea);
    const totalConsumptionGeoCell = parseFloat(
      fixingGeoCellData.totalGeoCellConsumption,
    );

    // Validation for Total Area where Geo cell is placed in Sqm
    if (
      isNaN(totalAreaGeoCell) ||
      totalAreaGeoCell <= 0 ||
      totalAreaGeoCell > 1000000 ||
      fixingGeoCellData.totalGeoCellArea.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Area where Geo cell is placed (Sqm) with max 3 decimal places, value should be > 0 and <= 1000000',
        'error',
      );
      return false;
    }

    // Validation for Total Consumption of Geo cell in Sqm
    if (
      isNaN(totalConsumptionGeoCell) ||
      totalConsumptionGeoCell <= 0 ||
      totalConsumptionGeoCell > 1000000 ||
      fixingGeoCellData.totalGeoCellConsumption.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Consumption of Geo cell in Sqm with max 3 decimal places, value should be > 0 and <= 1000000',
        'error',
      );
      return false;
    }

    // Convert the values back to numbers after validation
    fixingGeoCellData.totalGeoCellArea = Number(
      fixingGeoCellData.totalGeoCellArea,
    );
    fixingGeoCellData.totalGeoCellConsumption = Number(
      fixingGeoCellData.totalGeoCellConsumption,
    );

    return true;
  };

  const validateCuttingOfSoilData = (cuttingOfSoilData: any): boolean => {
    const totalSoilCutQty = parseFloat(cuttingOfSoilData.totalSoilCutQty);

    // Validation for Total qty of soil cut in cum
    if (
      isNaN(totalSoilCutQty) ||
      totalSoilCutQty <= 0 ||
      totalSoilCutQty > 1000000 ||
      cuttingOfSoilData.totalSoilCutQty.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total qty of soil cut (in cum) with max 3 decimal places, value should be > 0 and <= 1000000',
        'error',
      );
      return false;
    }

    cuttingOfSoilData.totalSoilCutQty = Number(
      cuttingOfSoilData.totalSoilCutQty,
    );
    return true;
  };

  const validateBricksWorkData = (bricksWorkData: any): boolean => {
    const totalArea = parseFloat(bricksWorkData.totalBrickWorkArea);
    const totalCum = parseFloat(bricksWorkData.totalBrickWorkCum);

    if (
      isNaN(totalArea) ||
      totalArea <= 0 ||
      totalArea > 100000 ||
      bricksWorkData.totalBrickWorkArea.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Area (in Sqm) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalCum) ||
      totalCum <= 0 ||
      totalCum > 100000 ||
      bricksWorkData.totalBrickWorkCum.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Brick Work in Cum with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    bricksWorkData.totalBrickWorkArea = Number(
      bricksWorkData.totalBrickWorkArea,
    );
    bricksWorkData.totalBrickWorkCum = Number(bricksWorkData.totalBrickWorkCum);

    return true;
  };

  const validateBackfillingData = (backfillingData: any): boolean => {
    const totalSoilQty = parseFloat(backfillingData.totalSoilQtyUsed);

    // Validation for Total Quantity of Soil Used
    if (
      isNaN(totalSoilQty) ||
      totalSoilQty <= 0 ||
      totalSoilQty > 100000 ||
      backfillingData.totalSoilQtyUsed.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Quantity of Soil (in cum) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    // Converting the value back to a number after validation
    backfillingData.totalSoilQtyUsed = Number(backfillingData.totalSoilQtyUsed);

    return true;
  };

  const validateLayingOfPQCData = (layingOfPQCData: any): boolean => {
    // Parsing values to float
    const pqcLeadDistance = parseFloat(layingOfPQCData.pqcLeadDistance);
    const totalPQCLaidLength = parseFloat(layingOfPQCData.totalPQCLaidLength);
    const totalPQCLaidArea = parseFloat(layingOfPQCData.totalPQCLaidArea);
    const pqcThicknessLaid = parseFloat(layingOfPQCData.pqcThicknessLaid);

    if (
      isNaN(pqcLeadDistance) ||
      pqcLeadDistance <= 0 ||
      pqcLeadDistance > 100 ||
      layingOfPQCData.pqcLeadDistance.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Lead distance of PQC material in Km with max 3 decimal places, value should be > 0 and <= 100',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalPQCLaidLength) ||
      totalPQCLaidLength <= 0 ||
      totalPQCLaidLength > 100000 ||
      layingOfPQCData.totalPQCLaidLength.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total length of PQC laid in meters with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalPQCLaidArea) ||
      totalPQCLaidArea <= 0 ||
      totalPQCLaidArea > 1000000 ||
      layingOfPQCData.totalPQCLaidArea.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total area of PQC laid in sqm with max 3 decimal places, value should be > 0 and <= 1000000',
        'error',
      );
      return false;
    }

    if (
      isNaN(pqcThicknessLaid) ||
      pqcThicknessLaid <= 0 ||
      pqcThicknessLaid > 1000 ||
      layingOfPQCData.pqcThicknessLaid.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Thickness of PQC laid in mm with max 3 decimal places, value should be > 0 and <= 1000',
        'error',
      );
      return false;
    }

    layingOfPQCData.pqcLeadDistance = Number(layingOfPQCData.pqcLeadDistance);
    layingOfPQCData.totalPQCLaidLength = Number(
      layingOfPQCData.totalPQCLaidLength,
    );
    layingOfPQCData.totalPQCLaidArea = Number(layingOfPQCData.totalPQCLaidArea);
    layingOfPQCData.pqcThicknessLaid = Number(layingOfPQCData.pqcThicknessLaid);

    return true;
  };

  const validateLayingOfSeparationMembraneData = (
    layingOfSeparationMembraneData: any,
  ): boolean => {
    const finishedCompactedLayerThickness = parseFloat(
      layingOfSeparationMembraneData.finishedCompactedLayerThickness,
    );
    if (
      isNaN(finishedCompactedLayerThickness) ||
      finishedCompactedLayerThickness <= 0 ||
      finishedCompactedLayerThickness > 1000 ||
      layingOfSeparationMembraneData.finishedCompactedLayerThickness.split(
        '.',
      )[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Finished Compacted Layer Thickness (in mm) with max 3 decimal places, value should be > 0 and <= 1000',
        'error',
      );
      return false;
    }
    layingOfSeparationMembraneData.finishedCompactedLayerThickness = Number(
      layingOfSeparationMembraneData.finishedCompactedLayerThickness,
    );

    return true;
  };

  const validateMillingData = (millingData: any) => {
    const depthOfMilling = parseFloat(millingData.depthOfMilling);
    const totalQtyMilledMaterial = parseFloat(
      millingData.totalQtyMilledMaterial,
    );
    const totalSurfaceAreaMilled = parseFloat(
      millingData.totalSurfaceAreaMilled,
    );

    if (
      isNaN(depthOfMilling) ||
      depthOfMilling <= 0 ||
      depthOfMilling > 100 ||
      millingData.depthOfMilling.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Depth of Milling (in mm) with max 3 decimal places, value should be > 0 and <= 100',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalQtyMilledMaterial) ||
      totalQtyMilledMaterial <= 0 ||
      totalQtyMilledMaterial > 1000000 ||
      millingData.totalQtyMilledMaterial.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Quantity of Milled Material (in cm) with max 3 decimal places, value should be > 0 and <= 1000000',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalSurfaceAreaMilled) ||
      totalSurfaceAreaMilled <= 0 ||
      totalSurfaceAreaMilled > 100000 ||
      millingData.totalSurfaceAreaMilled.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Surface Area Milled (in Sqmm) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    millingData.depthOfMilling = Number(millingData.depthOfMilling);
    millingData.totalQtyMilledMaterial = Number(
      millingData.totalQtyMilledMaterial,
    );
    millingData.totalSurfaceAreaMilled = Number(
      millingData.totalSurfaceAreaMilled,
    );

    return true;
  };

  const validateSealantFilingData = (sealantFilingData: any): boolean => {
    const sealantQtyUtilized = parseFloat(sealantFilingData.sealantQtyUtilized);

    // Validation for Sealant Quantity Utilized
    if (
      isNaN(sealantQtyUtilized) ||
      sealantQtyUtilized <= 0 ||
      sealantQtyUtilized > 100000 ||
      sealantFilingData.sealantQtyUtilized.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid quantity of sealant utilized (in liters) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    sealantFilingData.sealantQtyUtilized = Number(
      sealantFilingData.sealantQtyUtilized,
    );

    return true;
  };

  const validatePlacingOfFillerBoardData = (
    placingOfFillerBoardData: any,
  ): boolean => {
    const fillerBoardThickness = parseFloat(
      placingOfFillerBoardData.fillerBoardThickness,
    );
    const totalFillerBoardQty = parseFloat(
      placingOfFillerBoardData.totalFillerBoardQty,
    );

    // Validation for Thickness of Filler Board in mm
    if (
      isNaN(fillerBoardThickness) ||
      fillerBoardThickness <= 0 ||
      fillerBoardThickness > 1000 ||
      placingOfFillerBoardData.fillerBoardThickness.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Thickness of Filler Board (in mm) with max 3 decimal places, value should be > 0 and <= 1000',
        'error',
      );
      return false;
    }

    // Validation for Total Filler Board qty in Sqmm
    if (
      isNaN(totalFillerBoardQty) ||
      totalFillerBoardQty <= 0 ||
      totalFillerBoardQty > 100000 ||
      placingOfFillerBoardData.totalFillerBoardQty.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Filler Board quantity in Sqmm with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    // Convert to numbers after validation
    placingOfFillerBoardData.fillerBoardThickness = Number(
      placingOfFillerBoardData.fillerBoardThickness,
    );
    placingOfFillerBoardData.totalFillerBoardQty = Number(
      placingOfFillerBoardData.totalFillerBoardQty,
    );

    return true;
  };

  const validateCompactionData = compactionData => {
    const compactedLayerThickness = parseFloat(
      compactionData.compactedLayerThickness,
    );

    if (
      isNaN(compactedLayerThickness) ||
      compactedLayerThickness <= 0 ||
      compactedLayerThickness > 1000 ||
      compactionData.compactedLayerThickness.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Finished Compacted Layer Thickness (in mm) with max 3 decimal places, value should be > 0 and <= 1000',
        'error',
      );
      return false;
    }

    compactionData.compactedLayerThickness = Number(
      compactionData.compactedLayerThickness,
    );

    return true;
  };

  const validatePlacingOfDowelData = (placingOfDowelData: any) => {
    const sheathDia = parseFloat(placingOfDowelData.sheathDia);
    const totalDowelBars = parseInt(placingOfDowelData.totalDowelBars);

    // Validation for Dia of Sheath in mm
    if (
      isNaN(sheathDia) ||
      sheathDia <= 0 ||
      sheathDia > 1000 ||
      placingOfDowelData.sheathDia.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Dia of Sheath in mm (max 3 decimal places, value should be > 0 and <= 1000)',
        'error',
      );
      return false;
    }

    // Validation for Total number of dowel bars
    if (
      isNaN(totalDowelBars) ||
      totalDowelBars <= 0 ||
      totalDowelBars > 100000
    ) {
      showSnackbar(
        'Please enter a valid Total number of dowel bars (value should be > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    return true;
  };

  const validateLayingOfDlcData = (data: any) => {
    for (const item of data) {
      const totalQtyDlc = parseFloat(item.totalQtyDlc);
      const vehicleNo = parseInt(item.vehicleNo);

      if (
        isNaN(vehicleNo) ||
        item.vehicleNo.length !== 4 ||
        !/^\d{4}$/.test(item.vehicleNo)
      ) {
        showSnackbar(
          'Vehicle No must be the last 4 digits and contain only numbers.',
          'error',
        );
        return false;
      }
      if (
        isNaN(totalQtyDlc) ||
        totalQtyDlc <= 0 ||
        totalQtyDlc > 20 ||
        item.totalQtyDlc.split('.')[1]?.length > 3
      ) {
        showSnackbar(
          'Total qty of DLC must be greater than 0, up to 3 decimal places, and less than or equal to 20.',
          'error',
        );
        return false;
      }
    }

    return true;
  };
  const renderLayingOfDlcHeadings = () => (
    <View style={styles.rowContainer}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Serial No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Vehicle No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Total Qty of DLC (cum)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Laying Start Time</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Laying End Time</Text>
      </View>
      <View style={[styles.cell, {paddingHorizontal: 40}]}>
        <Text style={styles.cellText}>Actions</Text>
      </View>
    </View>
  );
  const deleteLayingOfDlcItem = (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...layingOfDlcTableData];
    const prevIndex = layingOfDlcTableData.findIndex(
      item => item.key === rowKey,
    );
    newData.splice(prevIndex, 1);
    setLayingOfDlcTableData(newData);
  };
  const renderItemLayingOfDlc = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={styles.cell}>
        <Text>{rowData.index + 1}</Text>
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'vehicleNo'}
          index={rowData.index}
          onChange={handleTextInputChangeLayingOfDlc}
        />
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'totalQtyDlc'}
          index={rowData.index}
          onChange={handleTextInputChangeLayingOfDlc}
        />
      </View>

      <View style={styles.cell}>
        <TimePicker
          label="Laying Start Time"
          value={rowData.item.layingStartTime}
          onChange={time =>
            handleTimeChangeLayingOfDlc(rowData.index, 'layingStartTime', time)
          }
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
        />
      </View>

      <View style={styles.cell}>
        <TimePicker
          label="Laying End Time"
          value={rowData.item.layingEndTime}
          onChange={time =>
            handleTimeChangeLayingOfDlc(rowData.index, 'layingEndTime', time)
          }
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
        />
      </View>

      <View style={[styles.cell, {paddingHorizontal: 45}]}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => deleteLayingOfDlcItem(rowData, rowData.item.key)}>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('./../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleTextInputChangeLayingOfDlc = (index, fieldName, value) => {
    setLayingOfDlcTableData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [fieldName]: value,
      };
      return newData;
    });
  };

  const handleTimeChangeLayingOfDlc = (index, fieldName, time) => {
    setLayingOfDlcTableData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [fieldName]: time,
      };
      return newData;
    });
  };
  const validateTexturingData = (texturingData: any): boolean => {
    const totalTexturingDone = parseFloat(texturingData.totalTexturingDone);
    if (
      isNaN(totalTexturingDone) ||
      totalTexturingDone <= 0 ||
      totalTexturingDone > 100000 ||
      texturingData.totalTexturingDone.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Texturing Done (in sqmtr) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }
    texturingData.totalTexturingDone = Number(texturingData.totalTexturingDone);

    return true;
  };

  const validateLayingOfDLCData = (layingOfDLCData: any): boolean => {
    const totalLengthDLC = parseFloat(layingOfDLCData.totalLengthDLC);
    const totalAreaDLC = parseFloat(layingOfDLCData.totalAreaDLC);
    if (
      isNaN(totalLengthDLC) ||
      totalLengthDLC <= 0 ||
      totalLengthDLC > 100000 ||
      layingOfDLCData.totalLengthDLC.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Length of DLC laid (in mtr) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }
    if (
      isNaN(totalAreaDLC) ||
      totalAreaDLC <= 0 ||
      totalAreaDLC > 1000000 ||
      layingOfDLCData.totalAreaDLC.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Area of DLC laid (in sqm) with max 3 decimal places, value should be > 0 and <= 1000000',
        'error',
      );
      return false;
    }

    layingOfDLCData.totalLengthDLC = Number(layingOfDLCData.totalLengthDLC);
    layingOfDLCData.totalAreaDLC = Number(layingOfDLCData.totalAreaDLC);

    return true;
  };

  const validateLayingOfPaverBlockData = (
    layingOfPaverBlockData: any,
  ): boolean => {
    const totalLengthLaid = parseFloat(layingOfPaverBlockData.totalLengthLaid);
    const totalSqmLaid = parseFloat(layingOfPaverBlockData.totalSqmLaid);
    const thicknessPaverBlock = parseFloat(
      layingOfPaverBlockData.thicknessPaverBlock,
    );

    if (
      isNaN(totalLengthLaid) ||
      totalLengthLaid <= 0 ||
      totalLengthLaid > 100000 ||
      layingOfPaverBlockData.totalLengthLaid.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Length of Paver Block Laid with max 3 decimal places, value should be > 0 and <= 100,000',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalSqmLaid) ||
      totalSqmLaid <= 0 ||
      totalSqmLaid > 1000000 ||
      layingOfPaverBlockData.totalSqmLaid.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total SQM of Paver Blocks Laid with max 3 decimal places, value should be > 0 and <= 1,000,000',
        'error',
      );
      return false;
    }

    if (
      isNaN(thicknessPaverBlock) ||
      thicknessPaverBlock <= 0 ||
      thicknessPaverBlock > 150 ||
      layingOfPaverBlockData.thicknessPaverBlock.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Thickness of Paver Block Laid with max 3 decimal places, value should be > 0 and <= 150',
        'error',
      );
      return false;
    }

    // Converting values back to numbers after validation
    layingOfPaverBlockData.totalLengthLaid = Number(
      layingOfPaverBlockData.totalLengthLaid,
    );
    layingOfPaverBlockData.totalSqmLaid = Number(
      layingOfPaverBlockData.totalSqmLaid,
    );
    layingOfPaverBlockData.thicknessPaverBlock = Number(
      layingOfPaverBlockData.thicknessPaverBlock,
    );

    return true;
  };
  const validateCuttingOfJointsData = (cuttingOfJointsData: any): boolean => {
    const totalLengthCompleted = parseFloat(
      cuttingOfJointsData.totalLengthCompleted,
    );

    // Validation for Total Length Completed in Km
    if (
      isNaN(totalLengthCompleted) ||
      totalLengthCompleted <= 0 ||
      totalLengthCompleted > 100 ||
      cuttingOfJointsData.totalLengthCompleted.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Length Completed in Km with max 3 decimal places, value should be > 0 and <= 100',
        'error',
      );
      return false;
    }

    // Converting the values back to numbers after validation
    cuttingOfJointsData.totalLengthCompleted = Number(
      cuttingOfJointsData.totalLengthCompleted,
    );

    return true;
  };

  const validateFixingVerticalPostData = (
    fixingVerticalPostData: any,
  ): boolean => {
    const totalPostsInstalled = parseInt(
      fixingVerticalPostData.totalVerticalPostInstalled,
    );

    if (
      isNaN(totalPostsInstalled) ||
      totalPostsInstalled <= 0 ||
      totalPostsInstalled > 10000
    ) {
      showSnackbar(
        'Please enter a valid number of vertical posts installed (integer, > 0, <= 10000)',
        'error',
      );
      return false;
    }

    fixingVerticalPostData.totalVerticalPostInstalled = Number(
      fixingVerticalPostData.totalVerticalPostInstalled,
    );

    return true;
  };

  const validateFixingOfMetalBeamData = (
    fixingOfMetalBeamData: any,
  ): boolean => {
    const totalLength = parseFloat(
      fixingOfMetalBeamData.totalLengthOfMetalBeamFixed,
    );

    // Validation for Total Length of Metal Beam Fixed in RM
    if (
      isNaN(totalLength) ||
      totalLength <= 0 ||
      totalLength > 1000000 ||
      fixingOfMetalBeamData.totalLengthOfMetalBeamFixed.split('.')[1]?.length >
        3
    ) {
      showSnackbar(
        'Please enter a valid Total Length of Metal Beam Fixed (in RM) with max 3 decimal places, value should be > 0 and <= 1,000,000',
        'error',
      );
      return false;
    }

    // Converting the value back to number after validation
    fixingOfMetalBeamData.totalLengthOfMetalBeamFixed = Number(
      fixingOfMetalBeamData.totalLengthOfMetalBeamFixed,
    );

    return true;
  };

  const validateDumpingData = (dumpingData: any[]): boolean => {
    for (const item of dumpingData) {
      // Parsing values to float
      const qtyDumped = parseFloat(item.qtyDumped);
      const vehicleNo = parseInt(item.vehicleNo);

      if (
        isNaN(vehicleNo) ||
        item.vehicleNo.length !== 4 ||
        !/^\d{4}$/.test(item.vehicleNo)
      ) {
        showSnackbar(
          'Vehicle No must be the last 4 digits and contain only numbers.',
          'error',
        );
        return false;
      }
      if (
        isNaN(qtyDumped) ||
        qtyDumped <= 0 ||
        qtyDumped > 100000 ||
        item.qtyDumped.split('.')[1]?.length > 3
      ) {
        showSnackbar(
          'Quantity dumped must be greater than 0, up to 3 decimal places, and less than or equal to 100,000.',
          'error',
        );
        return false;
      }
    }

    // Convert the validated values back to numbers
    dumpingData.forEach((item: any) => {
      item.qtyDumped = Number(item.qtyDumped);
      item.vehicleNo = Number(item.vehicleNo);
    });

    return true;
  };

  const [fixingShutterData, setFixingShutterData] = useState({
    shutterMaterial: 'Y',
    repairsAreOf: 'Y',
    cleanlinessOfShutter: 'Y',
    oilingOfShutter: 'Y',
    shutterDesignOk: 'Y',
    alignmentLevelsRigidity: 'Y',
    checkPropsAreTheyOk: 'Y',
    checkAcrowSapnAreTheyOk: 'Y',
    checkBracesAreTheyOk: 'Y',
    checkSealingJointsHoles: 'Y',
  });
  const [assemblingOfTrussData, setAssemblingOfTrussData] = useState({
    partsAccuratelyAssembled: 'Y',
    noBentOrBrokenParts: 'Y',
    trussSpanOnBlocks: 'Y',
    cleanJointSurfaces: 'Y',
    fastenersWithWashers: 'Y',
    serviceBoltsTightened: 'Y',
  });

  const handleFixingShutter = (field: string, value: string) => {
    setFixingShutterData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [erectionOfTemporaryStructure, setErectionOfTemporaryStructure] =
    useState({
      hasAnyRiskAssessment: 'Y',
      craneHydraLevelBase: 'Y',
      areAllOperationTrained: 'Y',
      isCraneTested: 'Y',
      doesTheCraneCertificate: 'Y',
      allLiftingToolsAndTackles: 'Y',
      protectionDevices: 'Y',
      atteainedTheirStrength: 'Y',
      workmenProvided: 'Y',
      whetherSufficient: 'Y',
      liftingToolsTackles: 'Y',
      equipmentsGeneratorsProperlyEarthed: 'Y',
      walkwayMaintainedFreeForm: 'Y',
      safetyLatchLockingAvailable: 'Y',
      properWarningSign: 'Y',
      liftingArrangementsAreApproved: 'Y',
      achieveTheirCompressiveStrength: 'Y',
      groundLeveling: 'Y',
      structureSetOutToTheLevels: 'Y',
      aualificationAndSkilledCheckedAndCertified: 'Y',
    });

  const handleErectionOfTemporaryStructure = (field: string, value: string) => {
    setErectionOfTemporaryStructure(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleBoringOfDiaphragmInputChange = (field: string, value: string) => {
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'densityOfPolymer':
        const densityOfPolymer = parseFloat(value);
        if (
          isNaN(densityOfPolymer) ||
          densityOfPolymer <= 0 ||
          densityOfPolymer > 5 ||
          !/^\d+(\.\d{1,2})?$/.test(value)
        ) {
          isValid = false;
          errorMessage =
            'Density of Polymer must be greater than 0, up to 2 decimal places, and less than or equal to 5 gm/ml.';
        }
        break;

      case 'viscosityOfPolymer':
        const viscosityOfPolymer = parseInt(value, 10);
        if (
          isNaN(viscosityOfPolymer) ||
          viscosityOfPolymer <= 0 ||
          viscosityOfPolymer > 500
        ) {
          isValid = false;
          errorMessage =
            'Viscosity of Polymer must be an integer greater than 0 and less than or equal to 500 sec/liter.';
        }
        break;

      case 'pHValueOfPolymer':
        const pHValueOfPolymer = parseInt(value, 10);
        if (
          isNaN(pHValueOfPolymer) ||
          pHValueOfPolymer <= 0 ||
          pHValueOfPolymer > 14
        ) {
          isValid = false;
          errorMessage =
            'pH Value of Polymer must be an integer greater than 0 and less than or equal to 14.';
        }
        break;

      case 'sandContentOfPolymer':
        const sandContentOfPolymer = parseInt(value, 10);
        if (
          isNaN(sandContentOfPolymer) ||
          sandContentOfPolymer <= 0 ||
          sandContentOfPolymer > 100
        ) {
          isValid = false;
          errorMessage =
            'Sand Content of Polymer must be an integer greater than 0 and less than or equal to 100%.';
        }
        break;

      case 'depthOfWall':
        const depthOfWall = parseFloat(value);
        if (
          isNaN(depthOfWall) ||
          depthOfWall <= 0 ||
          depthOfWall > 100 ||
          !/^\d+(\.\d{1,3})?$/.test(value)
        ) {
          isValid = false;
          errorMessage =
            'Depth of Wall must be greater than 0, up to 3 decimal places, and less than or equal to 100 meters.';
        }
        break;

      default:
        break;
    }

    if (!isValid) {
      showSnackbar(errorMessage, 'error');
    }

    setBoringOfDiaphragmData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [
    paintingOfSteelGirdersDiaphragms,
    setPaintingOfSteelGirdersDiaphragms,
  ] = useState({
    hasAnyRiskAssessment: 'Y',
    isWorkerWarnPersonalProtective: 'Y',
    presentAtBlastingPot: 'Y',
    identificationTag: 'Y',
    surfaceCheckPriorBlasting: 'Y',
    surfaceFreeFromContamination: 'Y',
    suitableWeatherForBlasting: 'Y',
    compressedAirQuality: 'Y',
    protectedAreas: 'Y',
    highPressureWaterUsage: 'Y',
    abrasiveSpecification: 'Y',
    batchCertificateAvailable: 'Y',
    nozzlePressureChecked: 'Y',
    inspectedForCleaning: 'Y',
    visualCheckDamage: 'Y',
    shiftedWithoutDamage: 'Y',
    surroundingAreaCovered: 'Y',
    paintingSystemSpecification: 'Y',
    paintMixedAsPerInstructions: 'Y',
    tipSizeSprayingProcedure: 'Y',
    solventDilutionAccordance: 'Y',
    areasStripedBeforePainting: 'Y',
    materialsWithinShelfLife: 'Y',
    weatherConditionChecked: 'Y',
    paintAppliedPerSpecification: 'Y',
    paintMixedWithinPotLife: 'Y',
    evenCoatingThickness: 'Y',
    wftCheckedForDft: 'Y',
    overcoatingIntervalMaintained: 'Y',
    properCoatingSystemApplied: 'Y',
    paintSurfaceQuality: 'Y',
    recordMaintained: 'Y',
  });
  const [paintingData, setPaintingData] = useState({
    paintingSystemApproved: 'Y',
    documentsApproved: 'Y',
    surfacePreparationDone: 'Y',
    defectsCorrected: 'Y',
    moistureContentChecked: 'Y',
    plasterSurfacesRubbed: 'Y',
    materialStirred: 'Y',
    fillerCoatAfterPrimer: 'Y',
    suctionSpotsPrimed: 'Y',
    fillerCoatAppliedEvenly: 'Y',
    sandingBetweenCoats: 'Y',
    dryingTimeAllowed: 'Y',
    materialsMixedProperly: 'Y',
    firstCoatAppliedByRoller: 'Y',
    rollerJointsChecked: 'Y',
    curingPeriodAllowed: 'Y',
    secondCoatAfterTouchUp: 'Y',
    finalCoatApplied: 'Y',
    cleaningAndProtection: 'Y',
  });

  const handlePaintingOfSteelGirdersDiaphragms = (
    field: string,
    value: string,
  ) => {
    setPaintingOfSteelGirdersDiaphragms(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [placementOfReinforcementCage, setPlacementOfReinforcementCage] =
    useState({
      rebarDimensionChecked: 'Y',
      shapingCheckedAsPerGFC: 'Y',
      rebarsSecurelyBound: 'Y',
      spliceLengthChecked: 'Y',
      rebarWithinTolerance: 'Y',
      couplerArrangementsWithinTolerance: 'Y',
      barBendingScheduleChecked: 'Y',
    });

  const handlePlacementOfReinforcementCage = (field: string, value: string) => {
    setPaintingOfSteelGirdersDiaphragms(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };
  const [procurementOfSteelData, setProcurementOfSteelData] = useState({
    totalQtyOfSteelProcured: 0.0,
  });
  const [transportationData, setTransportationData] = useState({
    transitTime: 0.0,
  });
  const handleTextInputChangeProcurementOfSteel = (key: any, value: any) => {
    setProcurementOfSteelData({
      ...procurementOfSteelData,
      [key]: value,
    });
  };
  const handleInputChangeFixingOfSheathingJoints = (key: any, value: any) => {
    setFixingOfSheathingJointsData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleInputChangeStitchConcrete = (key: any, value: any) => {
    setStitchConcreteData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleTextInputChangeTemporaryPrestressing = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedData = [...temporaryPrestressingData];
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'jointNumbers':
        if (value.length > 50) {
          isValid = false;
          errorMessage = 'Joint Numbers cannot exceed 50 characters';
        }
        break;

      case 'maxJackPressure':
      case 'jackPressureApplied':
        const pressureValue = parseFloat(value);
        if (
          isNaN(pressureValue) ||
          pressureValue <= 0 ||
          pressureValue > 1000 ||
          value.split('.')[1]?.length > 3
        ) {
          isValid = false;
          errorMessage =
            'Pressure must be between 0 and 1000 with up to 3 decimal places';
        }
        break;

      default:
        break;
    }

    if (!isValid) {
      showSnackbar(errorMessage, 'error');
    }

    updatedData[index][field] = value;
    setTemporaryPrestressingData(updatedData);
  };

  const [torquingData, setTorquingData] = useState([
    {
      date: '',
      time: '',
      component: '',
      detailsOfJoints: '',
      nosOfBolt: 0,
      diaOfBoltInMm: 0,
      sizeInMm: 0,
      slNoOfInvoiceMTCFile: '',
      slNoOfTorqueWrench: '',
      torqueApplied: 0,
      refusalsGauage3nos: 'Y',
      refusalsGauage4nos: 'Y',
      refusalsGauage5nos: 'Y',
      refusalsGauage6nos: 'Y',
      key: Guid.create(),
    },
  ]);
  const handleTextInputChangeTransportation = (key: any, value: any) => {
    setTransportationData({
      ...transportationData,
      [key]: value,
    });
  };
  const [stitchConcreteData, setStitchConcreteData] = useState({
    gradeOfConcrete: 'Y',
    methodStatementApproved: 'Y',
    htStrandsInserted: 'Y',
    materialsApproved: 'Y',
    formworkApproved: 'Y',
    reinforcementCageApproved: 'Y',
    equipmentWorking: 'Y',
    accessProvided: 'Y',
    safetyArrangements: 'Y',
    rainfallProtection: 'Y',
    needleVibratorStatus: 'Y',
    needleVibratorNos: 'Y',
    slumpConeApparatusAvailable: 'Y',
    startPreStressing: 'Y',
    groutingFormatFollowed: 'Y',
  });

  const [fixingOfSheathingJointsData, setFixingOfSheathingJointsData] =
    useState({
      temporaryOpeningsPlugged: 'Y',
      jointWaterTight: 'Y',
      sheathingNeatlyFitted: 'Y',
      anchorageEndSealed: 'Y',
      couplerTightlyScrewed: 'Y',
      couplerLengthSufficient: 'Y',
      jointSealedWithTape: 'Y',
      couplerStaggered: 'Y',
    });

  const [
    transportationOfSteelGirdersDiaphragms,
    setTransportationOfSteelGirdersDiaphragms,
  ] = useState({
    safeAccessProvided: 'Y',
    workingPlatformOnBoarded: 'Y',
    guardRailsAttached: 'Y',
    fallProtectionArrangement: 'Y',
    toolsSecuredAgainstFall: 'Y',
    riskAssessmentCarriedOut: 'Y',
    craneOnFirmLevelBases: 'Y',
    operatorsTrainedAndCompetent: 'Y',
    craneTestedAndOperated: 'Y',
    swingAlarmInstalled: 'Y',
    craneTestCertificateCurrent: 'Y',
    craneBoomTestCertificateCurrent: 'Y',
    oilLeakageChecked: 'Y',
    greasingChecked: 'Y',
    outriggersFullyExtended: 'Y',
    levelIndicatorsWithinLimit: 'Y',
    basePlateUnderOutriggers: 'Y',
    riggingAnglesChecked: 'Y',
    examsAndTestsCertified: 'Y',
    liftingToolsCheckedAndValid: 'Y',
    personnelTrainedAndProtected: 'Y',
    ppeProvided: 'Y',
    sufficientIlluminationProvided: 'Y',
    swlMarkedOnTools: 'Y',
    equipmentProperlyEarthed: 'Y',
    walkwaysFreeFromObstacles: 'Y',
    safetyLatchAvailable: 'Y',
    warningSignsAvailable: 'Y',
    liftingArrangementsChecked: 'Y',
    groundLevelingDone: 'Y',
    structureSetOutCorrectly: 'Y',
    welderQualifiedAndCertified: 'Y',
  });
  const [autoLaunchingData, setAutoLaunchingData] = useState({
    firstSpanLowering: 'Y',
    sliderPerDrawing: 'Y',
    middleSupportLeveling: 'Y',
    rearSupportLeveling: 'Y',
    checkHydraulicJacks: 'Y',
    allVerticalJacksMidSupport: 'Y',
    allVerticalJacksRearSupport: 'Y',
    cleanlinessAndApplicationLubricant: 'Y',
    physicallyCheckedAllAccessories: 'Y',
    jackAndMonorailProperlyFixed: 'Y',
    knuckleBearing: 'Y',
    guideRollers: 'Y',
    macalloyBarsStressed: 'Y',
    frontSupportTelescopic: 'Y',
    lockNutsArrangement: 'Y',
    pressureOnMidRearSupport: 'Y',
    gradient: 'Y',
    alignmentOfTrackRail: 'Y',
    frontSupportCorrectPosition: 'Y',
    frontSupportPins: 'Y',
    insertsPierCap: 'Y',
    frontSupportEngaged: 'Y',
    entireAreaBarricaded: 'Y',
  });

  const [stackingInYardData, setStackingInYardData] = useState({
    areaBarricaded: 'Y',
    temporaryLightsAvailable: 'Y',
    flagManAvailable: 'Y',
    methodologySchemeAvailable: 'Y',
    deShacklesSlingsCertified: 'Y',
    safetyColorCodePresent: 'Y',
    hydraulicJacksCondition: 'Y',
    limitSwitchWorking: 'Y',
    cotterPinsInAssembly: 'Y',
    macalloyBarsCondition: 'Y',
    workAtHeightPermit: 'Y',
    macalloyBarsTestCertificate: 'Y',
    liftingSequenceProvided: 'Y',
    liftingHolesLocation: 'Y',
    liftingArrangementsWorking: 'Y',
    prestressingDuctClear: 'Y',
    concreteStrengthGained: 'Y',
    sliderTrolleyPosition: 'Y',
    stackingMethodologyApproved: 'Y',
    stackingAreaLocated: 'Y',
    stackingAreaLeveled: 'Y',
  });
  const [hackingOfGirderData, setHackingOfGirderData] = useState({
    methodologyApproved: 'Y',
    surfaceCleanedAndWet: 'Y',
    skilledPersonnel: 'Y',
    sharpenedInstruments: 'Y',
    recessCutFormation: 'Y',
  });
  const [deStressingOfGirderData, setDeStressingOfGirderData] = useState({
    strengthAchieved: 'Y',
    diamondBitSawUsed: 'Y',
    gradualUniformTransfer: 'Y',
  });
  const [
    installationOfExpansionJointData,
    setInstallationOfExpansionJointData,
  ] = useState({
    expansionJointPositionCorrect: 'Y',
    shippingDevicesRemoved: 'Y',
    noForeignObjects: 'Y',
    materialsFlowProperly: 'Y',
    anchorsAndSupportsMatched: 'Y',
    jointsProperlyAligned: 'Y',
    noDamageSustained: 'Y',
  });

  const [removalOfTemporaryStructureData, setRemovalOfTemporaryStructureData] =
    useState({
      concreteAchievedStrength: 'Y',
      minimumTimeAttained: 'Y',
      allComponentsTightened: 'Y',
    });

  const handleTransportationOfSteelGirdersDiaphragms = (
    field: string,
    value: string,
  ) => {
    setTransportationOfSteelGirdersDiaphragms(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleInputChangeLifting = (field: string, value: string) => {
    setLiftingCombinedLRData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleInputChangeStackingInYard = (field: string, value: string) => {
    setStackingInYardData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleInputChangeTemporaryPrestressing = (key: string, value: any) => {
    let newValue = value;

    if (key === 'maxJackPressure' || key === 'jackPressureApplied') {
      newValue = parseFloat(value);

      if (isNaN(newValue) || newValue <= 0 || newValue > 1000) {
        showSnackbar(
          `${
            key === 'maxJackPressure'
              ? 'Maximum Jack Pressure'
              : 'Jack Pressure Applied'
          } must be greater than 0 and less than or equal to 1000 Kg/Cm²`,
          'error',
        );
        return; // Exit without updating state
      }
    }

    if (key === 'stressingSequenceDrawingNumber') {
      newValue = parseInt(value);

      if (isNaN(newValue) || newValue <= 0) {
        showSnackbar(
          'Stressing Sequence Drawing Number must be greater than 0',
          'error',
        );
        return; // Exit without updating state
      }
    }

    setTemporaryPrestressingData((prevData: any) => ({
      ...prevData,
      [key]: newValue,
    }));
  };
  const handleInputChangePainting = (key: any, value: any) => {
    setPaintingData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const validatePipeLayingAndJointingData = (
    pipeLayingAndJointingData: any,
  ): boolean => {
    const totalPipeLength = parseFloat(
      pipeLayingAndJointingData.totalPipeLength,
    );
    const totalNumberOfPipes = parseInt(
      pipeLayingAndJointingData.totalNumberOfPipes,
    );

    if (
      isNaN(totalPipeLength) ||
      totalPipeLength <= 0 ||
      totalPipeLength > 1000 ||
      pipeLayingAndJointingData.totalPipeLength.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Pipe Length (in meters) with max 3 decimal places, value should be > 0 and <= 1000',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalNumberOfPipes) ||
      totalNumberOfPipes <= 0 ||
      totalNumberOfPipes > 1000
    ) {
      showSnackbar(
        'Please enter a valid Total Number of Pipes laid (integer), value should be > 0 and <= 1000',
        'error',
      );
      return false;
    }

    pipeLayingAndJointingData.totalPipeLength = Number(
      pipeLayingAndJointingData.totalPipeLength,
    );
    pipeLayingAndJointingData.totalNumberOfPipes = Number(
      pipeLayingAndJointingData.totalNumberOfPipes,
    );

    return true;
  };

  const handleInputChangeGrouting = (
    name: keyof FormStateGrouting,
    value: string | number | [],
  ) => {
    let parsedValue: number;
    if (typeof value === 'string') {
      parsedValue = parseFloat(value);
    } else if (typeof value === 'number') {
      parsedValue = value;
    } else {
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
      //if (rfiData.metaData) {
      switch (selectedTask?.name) {
        case TASK_TYPES.CNG_AND_SETTING_OUT:
        case TASK_TYPES.PLACING_OF_SHEATHING_DUCT:
        case TASK_TYPES.POST_CONCRETE_CHECK:
        case TASK_TYPES.FIXING_OF_BEARING_SLEEVES:
          setImageObject({
            filePath: '',
            fileData: rfiData.metaData?.base64Image,
            fileUri: '',
          });
          break;
        case TASK_TYPES.FORM_WORK:
        case TASK_TYPES.PLACEMENT_OF_INNER_SHUTTERS:
        case TASK_TYPES.PLACEMENT_OF_SIDE_SHUTTERS:
        case TASK_TYPES.PLACEMENT_OF_BOTTOM_SHUTTER:
        case TASK_TYPES.PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER:
          setCleanliness(rfiData.metaData?.cleanliness);
          setFormworkAlignmentChecked(
            rfiData.metaData?.formworkAlignmentChecked,
          );
          setFormworkSealingChecked(rfiData.metaData?.formworkSealingChecked);
          setFormworkdDrawingsChecked(
            rfiData.metaData?.formworkdDrawingsChecked,
          );
          setConcreteFinishLevelMarked(
            rfiData.metaData?.concreteFinishLevelMarked,
          );
          setFormworkProperlySupported(
            rfiData.metaData?.formworkProperlySupported,
          );
          setFormworkFitConcreting(rfiData.metaData?.formworkFitConcreting);
          break;
        case TASK_TYPES.REINFORCEMENT_PREPARATION:
        case TASK_TYPES.REINFORCEMENT:
          setRebarAndDimensionGFC(rfiData.metaData?.rebarAndDimensionGFC);
          setShapingNoAndLengthOfBarsGFC(
            rfiData.metaData?.shapingNoAndLengthOfBarsGFC,
          );
          setRebarsSecurelyTightened(rfiData.metaData?.rebarsSecurelyTightened);
          setSpliceLengthAndLocationGFC(
            rfiData.metaData?.spliceLengthAndLocationGFC,
          );
          setRebarWithinToleranceLimit(
            rfiData.metaData?.rebarWithinToleranceLimit,
          );
          setCouplerArrangementsWithinTolerance(
            rfiData.metaData?.couplerArrangementsWithinTolerance,
          );
          setBarBendingScheduleChecked(
            rfiData.metaData?.barBendingScheduleChecked,
          );
          setSpacerBarCheckedGFC(rfiData.metaData?.spacerBarCheckedGFC);
          break;
        case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
          setRebarAndDimensionGFC(rfiData.metaData?.rebarAndDimensionGFC);
          setShapingNoAndLengthOfBarsGFC(
            rfiData.metaData?.shapingNoAndLengthOfBarsGFC,
          );
          setRebarsSecurelyTightened(rfiData.metaData?.rebarsSecurelyTightened);
          setSpliceLengthAndLocationGFC(
            rfiData.metaData?.spliceLengthAndLocationGFC,
          );
          setRebarWithinToleranceLimit(
            rfiData.metaData?.rebarWithinToleranceLimit,
          );
          setCouplerArrangementsWithinTolerance(
            rfiData.metaData?.couplerArrangementsWithinTolerance,
          );
          setBarBendingScheduleChecked(
            rfiData.metaData?.barBendingScheduleChecked,
          );
          break;
        case TASK_TYPES.EXCAVATION:
          setQuantity(rfiData.metaData?.quantity);
          break;
        case TASK_TYPES.REMOVAL_OF_SIDE_SHUTTERS:
        case TASK_TYPES.REMOVAL_OF_MIDDLIE_TOP_SHUTTERS:
        case TASK_TYPES.REMOVAL_OF_INNER_SHUTTERS:
        case TASK_TYPES.REMOVAL_OF_SHUTTER:
        case TASK_TYPES.REMOVAL_OF_SHUTTERS:
          setConcreteHasAchievedDesiredStrength(
            rfiData.metaData?.concreteHasAchievedDesiredStrength,
          );
          setMinimumTimeHasBeenAttained(
            rfiData.metaData?.minimumTimeHasBeenAttained,
          );
          break;
        case TASK_TYPES.CAGE_LOWERING:
          setPlieShaftCleanedLooseMaterial(
            rfiData.metaData?.plieShaftCleanedLooseMaterial,
          );
          setSuitableSpacerProvidedToMaintainCoverToSteel(
            rfiData.metaData?.suitableSpacerProvidedToMaintainCoverToSteel,
          );
          setNoLBendBottomOfTheCageChecked(
            rfiData.metaData?.noLBendBottomOfTheCageChecked,
          );
          break;
        case TASK_TYPES.BORING_OF_PILE:
          if (rfiData.metaData?.boringOfPileData) {
            setBoringOfPileData(rfiData.metaData?.boringOfPileData);
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
          if (rfiData.metaData?.flushingOperationsData) {
            setFlushingOperationsData(rfiData.metaData?.flushingOperationsData);
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
          if (rfiData.metaData?.groutingData) {
            setBoringOfPileData(rfiData.metaData?.groutingData);
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
          if (rfiData.metaData?.chippingAndRemovalOfConcreteData) {
            setChippingAndRemovalOfConcreteData(
              rfiData.metaData?.chippingAndRemovalOfConcreteData,
            );
          } else {
            setChippingAndRemovalOfConcreteData({
              noOfDaysOfChipping: 0,
            });
          }
          break;
        case TASK_TYPES.STITCH_CONCRETE:
          if (rfiData.metaData?.concreteData) {
            rfiData.metaData?.concreteData.forEach((item: any) => {
              item.key = Guid.create();
            });
            setConcreteData(rfiData.metaData?.concreteData);
          } else {
            setConcreteData([]);
          }
          if (rfiData.metaData?.stitchConcreteData) {
            setStitchConcreteData(rfiData.metaData?.stitchConcreteData);
          } else {
            setStitchConcreteData({
              gradeOfConcrete: 'Y',
              methodStatementApproved: 'Y',
              htStrandsInserted: 'Y',
              materialsApproved: 'Y',
              formworkApproved: 'Y',
              reinforcementCageApproved: 'Y',
              equipmentWorking: 'Y',
              accessProvided: 'Y',
              safetyArrangements: 'Y',
              rainfallProtection: 'Y',
              needleVibratorStatus: 'Y',
              needleVibratorNos: 'Y',
              slumpConeApparatusAvailable: 'Y',
              startPreStressing: 'Y',
              groutingFormatFollowed: 'Y',
            });
          }
          break;
        case TASK_TYPES.COPING:
        case TASK_TYPES.CONCRETING:
        case TASK_TYPES.PCC_LEVELLING_COURSE:
          if (rfiData.metaData?.concreteData) {
            rfiData.metaData?.concreteData.forEach((item: any) => {
              item.key = Guid.create();
            });
            setConcreteData(rfiData.metaData?.concreteData);
          } else {
            setConcreteData([]);
          }
          break;
        case TASK_TYPES.DUMPING:
          if (rfiData.metaData.dumpingData) {
            rfiData.metaData.dumpingData.forEach((item: any) => {
              item.key = Guid.create();
            });
            setDumpingData(rfiData.metaData.dumpingData);
          } else {
            setDumpingData([]);
          }
          break;

        case TASK_TYPES.GLUEING:
          if (rfiData.metaData?.glueingData) {
            rfiData.metaData?.glueingData.forEach((item: any) => {
              item.key = Guid.create();
            });
            setGlueingData(rfiData.metaData?.glueingData);
          } else {
            if (selectedTask.taskDetailsData) {
              const taskDetails: any = [];
              selectedTask.taskDetailsData.forEach((item: any) => {
                taskDetails.push({
                  jointNumbers: item.name,
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
                });
              });
              setGlueingData(taskDetails);
            } else {
              setGlueingData([]);
            }
          }
          break;
        case TASK_TYPES.TORQUING:
          if (rfiData.metaData?.torquingData) {
            rfiData.metaData?.torquingData.forEach((item: any) => {
              item.key = Guid.create();
            });
            setTorquingData(rfiData.metaData?.torquingData);
          } else {
            setTorquingData([]);
          }
          break;

        case TASK_TYPES.REMOVAL_OF_FORMWORK:
          if (rfiData.metaData?.removalFormworkData) {
            setRemovalFormworkData(rfiData.metaData?.removalFormworkData);
          } else {
            setRemovalFormworkData({
              concreteStrengthAchieved: 'Y',
              minimumTimeAttained: 'Y',
            });
          }
          break;
        case TASK_TYPES.FABRICATION_OF_BUS_SHELTER:
        case TASK_TYPES.FABRICATION_OF_MEMBERS:
        case TASK_TYPES.FABRICATION_OF_STEEL_GIRDERS:
          if (rfiData.metaData?.fabricationData) {
            setFabricationData(rfiData.metaData?.fabricationData);
          } else {
            setFabricationData({
              steelInspectionSurfaceCondition: 'Y',
              sectionCheckedForDimension: 'Y',
              materialSpecificationChecked: 'Y',
              connectionChecked: 'Y',
              boltHolesClean: 'Y',
              approvedWeldersUsed: 'Y',
              weldsIdentified: 'Y',
              weldsInspected: 'Y',
              weldsRepaired: 'Y',
              shapeEdgeBurnsRemoved: 'Y',
              oilGreaseRemoved: 'Y',
              steelCleanedAndPainted: 'Y',
              finalShopCoatApplied: 'Y',
              memberMarkedForErection: 'Y',
              memberApprovedByInspector: 'Y',
            });
          }
          break;

        case TASK_TYPES.TEMPORARY_PRESTRESSING:
          if (rfiData.metaData?.temporaryPrestressingData) {
            rfiData.metaData?.temporaryPrestressingData.forEach((item: any) => {
              item.maxJackPressure = item.maxJackPressure.toString();
              item.jackPressureApplied = item.jackPressureApplied.toString();
              item.key = Guid.create();
            });
            setTemporaryPrestressingData(
              rfiData.metaData?.temporaryPrestressingData,
            );
          } else {
            if (selectedTask.taskDetailsData) {
              const taskDetails: any = [];
              selectedTask.taskDetailsData.forEach((item: any) => {
                taskDetails.push({
                  jointNumbers: item.name,
                  calibrationDone: 'Y',
                  stressingSequenceDrawingNumber: '',
                  dateOfPrestressing: '',
                  timeOfPrestressing: '',
                  maxJackPressure: 0,
                  jackPressureApplied: 0,
                  key: Guid.create(),
                });
              });
              setTemporaryPrestressingData(taskDetails);
            } else {
              setTemporaryPrestressingData([]);
            }
          }
          break;

        case TASK_TYPES.PAINTING_OF_STEEL_GIRDERS_DIAPHRAGMS:
          if (rfiData.metaData?.paintingOfSteelGirdersDiaphragms) {
            setPaintingOfSteelGirdersDiaphragms(
              rfiData.metaData?.paintingOfSteelGirdersDiaphragms,
            );
          } else {
            setPaintingOfSteelGirdersDiaphragms({
              hasAnyRiskAssessment: 'Y',
              isWorkerWarnPersonalProtective: 'Y',
              presentAtBlastingPot: 'Y',
              identificationTag: 'Y',
              surfaceCheckPriorBlasting: 'Y',
              surfaceFreeFromContamination: 'Y',
              suitableWeatherForBlasting: 'Y',
              compressedAirQuality: 'Y',
              protectedAreas: 'Y',
              highPressureWaterUsage: 'Y',
              abrasiveSpecification: 'Y',
              batchCertificateAvailable: 'Y',
              nozzlePressureChecked: 'Y',
              inspectedForCleaning: 'Y',
              visualCheckDamage: 'Y',
              shiftedWithoutDamage: 'Y',
              surroundingAreaCovered: 'Y',
              paintingSystemSpecification: 'Y',
              paintMixedAsPerInstructions: 'Y',
              tipSizeSprayingProcedure: 'Y',
              solventDilutionAccordance: 'Y',
              areasStripedBeforePainting: 'Y',
              materialsWithinShelfLife: 'Y',
              weatherConditionChecked: 'Y',
              paintAppliedPerSpecification: 'Y',
              paintMixedWithinPotLife: 'Y',
              evenCoatingThickness: 'Y',
              wftCheckedForDft: 'Y',
              overcoatingIntervalMaintained: 'Y',
              properCoatingSystemApplied: 'Y',
              paintSurfaceQuality: 'Y',
              recordMaintained: 'Y',
            });
          }
          break;

        case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
          if (rfiData.metaData?.placementOfReinforcementCage) {
            setPlacementOfReinforcementCage(
              rfiData.metaData?.placementOfReinforcementCage,
            );
          } else {
            setPlacementOfReinforcementCage({
              rebarDimensionChecked: 'Y',
              shapingCheckedAsPerGFC: 'Y',
              rebarsSecurelyBound: 'Y',
              spliceLengthChecked: 'Y',
              rebarWithinTolerance: 'Y',
              couplerArrangementsWithinTolerance: 'Y',
              barBendingScheduleChecked: 'Y',
            });
          }
          break;

        case TASK_TYPES.TRANSPORTATION_OF_STEEL_GIRDERS_DIAPHRAGMS_ERECTION_AT_SITE:
          if (rfiData.metaData?.transportationOfSteelGirdersDiaphragms) {
            setTransportationOfSteelGirdersDiaphragms(
              rfiData.metaData?.transportationOfSteelGirdersDiaphragms,
            );
          } else {
            setTransportationOfSteelGirdersDiaphragms({
              safeAccessProvided: 'Y',
              workingPlatformOnBoarded: 'Y',
              guardRailsAttached: 'Y',
              fallProtectionArrangement: 'Y',
              toolsSecuredAgainstFall: 'Y',
              riskAssessmentCarriedOut: 'Y',
              craneOnFirmLevelBases: 'Y',
              operatorsTrainedAndCompetent: 'Y',
              craneTestedAndOperated: 'Y',
              swingAlarmInstalled: 'Y',
              craneTestCertificateCurrent: 'Y',
              craneBoomTestCertificateCurrent: 'Y',
              oilLeakageChecked: 'Y',
              greasingChecked: 'Y',
              outriggersFullyExtended: 'Y',
              levelIndicatorsWithinLimit: 'Y',
              basePlateUnderOutriggers: 'Y',
              riggingAnglesChecked: 'Y',
              examsAndTestsCertified: 'Y',
              liftingToolsCheckedAndValid: 'Y',
              personnelTrainedAndProtected: 'Y',
              ppeProvided: 'Y',
              sufficientIlluminationProvided: 'Y',
              swlMarkedOnTools: 'Y',
              equipmentProperlyEarthed: 'Y',
              walkwaysFreeFromObstacles: 'Y',
              safetyLatchAvailable: 'Y',
              warningSignsAvailable: 'Y',
              liftingArrangementsChecked: 'Y',
              groundLevelingDone: 'Y',
              structureSetOutCorrectly: 'Y',
              welderQualifiedAndCertified: 'Y',
            });
          }
          break;

        case TASK_TYPES.CURING:
          if (rfiData.metaData?.curingData) {
            setCuringData(rfiData.metaData?.curingData);
          } else {
            setCuringData({
              waterUsedForCuring: 'Y',
              phValueOfWater: 'Y',
              consumptionOfWater: 0,
            });
          }
          break;

        case TASK_TYPES.FIXING_OF_SHUTTER:
          if (rfiData.metaData?.fixingShutterData) {
            setFixingShutterData(rfiData.metaData?.fixingShutterData);
          } else {
            setFixingShutterData({
              shutterMaterial: 'Y',
              repairsAreOf: 'Y',
              cleanlinessOfShutter: 'Y',
              oilingOfShutter: 'Y',
              shutterDesignOk: 'Y',
              alignmentLevelsRigidity: 'Y',
              checkPropsAreTheyOk: 'Y',
              checkAcrowSapnAreTheyOk: 'Y',
              checkBracesAreTheyOk: 'Y',
              checkSealingJointsHoles: 'Y',
            });
          }
          break;

        case TASK_TYPES.ERECTION_OF_TEMPORARY_STRUCTURE:
          if (rfiData.metaData?.erectionOfTemporaryStructure) {
            setErectionOfTemporaryStructure(
              rfiData.metaData?.erectionOfTemporaryStructure,
            );
          } else {
            setErectionOfTemporaryStructure({
              hasAnyRiskAssessment: 'Y',
              craneHydraLevelBase: 'Y',
              areAllOperationTrained: 'Y',
              isCraneTested: 'Y',
              doesTheCraneCertificate: 'Y',
              allLiftingToolsAndTackles: 'Y',
              protectionDevices: 'Y',
              atteainedTheirStrength: 'Y',
              workmenProvided: 'Y',
              whetherSufficient: 'Y',
              liftingToolsTackles: 'Y',
              equipmentsGeneratorsProperlyEarthed: 'Y',
              walkwayMaintainedFreeForm: 'Y',
              safetyLatchLockingAvailable: 'Y',
              properWarningSign: 'Y',
              liftingArrangementsAreApproved: 'Y',
              achieveTheirCompressiveStrength: 'Y',
              groundLeveling: 'Y',
              structureSetOutToTheLevels: 'Y',
              aualificationAndSkilledCheckedAndCertified: 'Y',
            });
          }
          break;
        case TASK_TYPES.ERECTION_USING_CRANES:
          if (rfiData.metaData?.erectionUsingCranesData) {
            setErectionUsingCranesData(
              rfiData.metaData?.erectionUsingCranesData,
            );
          } else {
            setErectionUsingCranesData({
              riskAssessmentCarriedOut: 'Y',
              craneOnFirmLevelBases: 'Y',
              allOperatorsTrained: 'Y',
              craneTestedAndOperated: 'Y',
              swingAlarmFunctioning: 'Y',
              craneTestCertificate: 'Y',
              boomTestCertificate: 'Y',
              oilLeakage: 'Y',
              greasing: 'Y',
              outriggersFullyExtended: 'Y',
              levelIndicators: 'Y',
              basePlateUnderOutriggers: 'Y',
              riggingAngles: 'Y',
              examinationCertified: 'Y',
              liftingToolsChecked: 'Y',
              workersWithFallProtection: 'Y',
              ppeProvided: 'Y',
              sufficientIllumination: 'Y',
              swlMarked: 'Y',
              equipmentProperlyEarthed: 'Y',
              walkwayObstacleFree: 'Y',
              safetyLatchAvailable: 'Y',
              warningSignAvailable: 'Y',
              liftingArrangements: 'Y',
              groundLeveling: 'Y',
              structureSetOut: 'Y',
              welderQualificationChecked: 'Y',
            });
          }
          break;
        case TASK_TYPES.STACKING_IN_YARD:
          if (rfiData.metaData?.stackingInYardData) {
            setStackingInYardData(rfiData.metaData?.stackingInYardData);
          } else {
            setStackingInYardData({
              areaBarricaded: 'Y',
              temporaryLightsAvailable: 'Y',
              flagManAvailable: 'Y',
              methodologySchemeAvailable: 'Y',
              deShacklesSlingsCertified: 'Y',
              safetyColorCodePresent: 'Y',
              hydraulicJacksCondition: 'Y',
              limitSwitchWorking: 'Y',
              cotterPinsInAssembly: 'Y',
              macalloyBarsCondition: 'Y',
              workAtHeightPermit: 'Y',
              macalloyBarsTestCertificate: 'Y',
              liftingSequenceProvided: 'Y',
              liftingHolesLocation: 'Y',
              liftingArrangementsWorking: 'Y',
              prestressingDuctClear: 'Y',
              concreteStrengthGained: 'Y',
              sliderTrolleyPosition: 'Y',
              stackingMethodologyApproved: 'Y',
              stackingAreaLocated: 'Y',
              stackingAreaLeveled: 'Y',
            });
          }
          break;

        case TASK_TYPES.ASSEMBLING_OF_TRUSS:
          if (rfiData.metaData?.assemblingOfTrussData) {
            setAssemblingOfTrussData(rfiData.metaData?.assemblingOfTrussData);
          } else {
            setAssemblingOfTrussData({
              partsAccuratelyAssembled: 'Y',
              noBentOrBrokenParts: 'Y',
              trussSpanOnBlocks: 'Y',
              cleanJointSurfaces: 'Y',
              fastenersWithWashers: 'Y',
              serviceBoltsTightened: 'Y',
            });
          }
          break;
        case TASK_TYPES.HACKING_OF_GIRDER:
          if (rfiData.metaData?.hackingOfGirderData) {
            setHackingOfGirderData(rfiData.metaData?.hackingOfGirderData);
          } else {
            setHackingOfGirderData({
              methodologyApproved: 'Y',
              surfaceCleanedAndWet: 'Y',
              skilledPersonnel: 'Y',
              sharpenedInstruments: 'Y',
              recessCutFormation: 'Y',
            });
          }
          break;
        case TASK_TYPES.DE_STRESSING_OF_GIRDER:
          if (rfiData.metaData?.deStressingOfGirderData) {
            setDeStressingOfGirderData(
              rfiData.metaData?.deStressingOfGirderData,
            );
          } else {
            setDeStressingOfGirderData({
              strengthAchieved: 'Y',
              diamondBitSawUsed: 'Y',
              gradualUniformTransfer: 'Y',
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_BEARING:
          if (rfiData.metaData?.fixingOfBearingData) {
            setFixingOfBearingData(rfiData.metaData?.fixingOfBearingData);
          } else {
            setFixingOfBearingData({
              bearingPlacedAsPerGFC: 'Y',
              bearingSurfaceFullyContactWithGirder: 'Y',
              bearingPlatesSetHorizontal: 'Y',
              bearingPreSetWithAxis: 'Y',
              supportsProvidedToHoldBearing: 'Y',
              anchorBoltHolesMatching: 'Y',
              voidBeneathBearingFilled: 'Y',
              bearingFixedWithMetalBedding: 'Y',
              threadedFastenerTightenedUniformly: 'Y',
            });
          }
          break;
        case TASK_TYPES.REMOVAL_OF_TEMPORARY_STRUCTURE:
          if (rfiData.metaData?.removalOfTemporaryStructureData) {
            setRemovalOfTemporaryStructureData(
              rfiData.metaData?.removalOfTemporaryStructureData,
            );
          } else {
            setRemovalOfTemporaryStructureData({
              concreteAchievedStrength: 'Y',
              minimumTimeAttained: 'Y',
              allComponentsTightened: 'Y',
            });
          }
          break;
        case TASK_TYPES.INSTALLATION_OF_EXPANSION_JOINT:
          if (rfiData.metaData?.installationOfExpansionJointData) {
            setInstallationOfExpansionJointData(
              rfiData.metaData?.installationOfExpansionJointData,
            );
          } else {
            setInstallationOfExpansionJointData({
              expansionJointPositionCorrect: 'Y',
              shippingDevicesRemoved: 'Y',
              noForeignObjects: 'Y',
              materialsFlowProperly: 'Y',
              anchorsAndSupportsMatched: 'Y',
              jointsProperlyAligned: 'Y',
              noDamageSustained: 'Y',
            });
          }
          break;
        case TASK_TYPES.PAINTING:
          if (rfiData.metaData?.paintingData) {
            setPaintingData(rfiData.metaData?.paintingData);
          } else {
            setPaintingData({
              paintingSystemApproved: 'Y',
              documentsApproved: 'Y',
              surfacePreparationDone: 'Y',
              defectsCorrected: 'Y',
              moistureContentChecked: 'Y',
              plasterSurfacesRubbed: 'Y',
              materialStirred: 'Y',
              fillerCoatAfterPrimer: 'Y',
              suctionSpotsPrimed: 'Y',
              fillerCoatAppliedEvenly: 'Y',
              sandingBetweenCoats: 'Y',
              dryingTimeAllowed: 'Y',
              materialsMixedProperly: 'Y',
              firstCoatAppliedByRoller: 'Y',
              rollerJointsChecked: 'Y',
              curingPeriodAllowed: 'Y',
              secondCoatAfterTouchUp: 'Y',
              finalCoatApplied: 'Y',
              cleaningAndProtection: 'Y',
            });
          }
          break;
        case TASK_TYPES.AUTO_LAUNCHING:
          if (rfiData.metaData?.autoLaunchingData) {
            setAutoLaunchingData(rfiData.metaData?.autoLaunchingData);
          } else {
            setAutoLaunchingData({
              firstSpanLowering: 'Y',
              sliderPerDrawing: 'Y',
              middleSupportLeveling: 'Y',
              rearSupportLeveling: 'Y',
              checkHydraulicJacks: 'Y',
              allVerticalJacksMidSupport: 'Y',
              allVerticalJacksRearSupport: 'Y',
              cleanlinessAndApplicationLubricant: 'Y',
              physicallyCheckedAllAccessories: 'Y',
              jackAndMonorailProperlyFixed: 'Y',
              knuckleBearing: 'Y',
              guideRollers: 'Y',
              macalloyBarsStressed: 'Y',
              frontSupportTelescopic: 'Y',
              lockNutsArrangement: 'Y',
              pressureOnMidRearSupport: 'Y',
              gradient: 'Y',
              alignmentOfTrackRail: 'Y',
              frontSupportCorrectPosition: 'Y',
              frontSupportPins: 'Y',
              insertsPierCap: 'Y',
              frontSupportEngaged: 'Y',
              entireAreaBarricaded: 'Y',
            });
          }
          break;
        case TASK_TYPES.PROCUREMENT_OF_STRUCTURAL_STEEL:
          if (rfiData.metaData?.procurementOfSteelData) {
            setProcurementOfSteelData(rfiData.metaData?.procurementOfSteelData);
          } else {
            setProcurementOfSteelData({
              totalQtyOfSteelProcured: 0.0,
            });
          }
          break;
        case TASK_TYPES.TRANSPORTATION_OF_MATERIAL:
          if (rfiData.metaData?.transportationData) {
            setTransportationData(rfiData.metaData?.transportationData);
          } else {
            setTransportationData({
              transitTime: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_SHEATHING_JOINTS:
          if (rfiData.metaData?.fixingOfSheathingJointsData) {
            setFixingOfSheathingJointsData(
              rfiData.metaData?.fixingOfSheathingJointsData,
            );
          } else {
            setFixingOfSheathingJointsData({
              temporaryOpeningsPlugged: 'Y',
              jointWaterTight: 'Y',
              sheathingNeatlyFitted: 'Y',
              anchorageEndSealed: 'Y',
              couplerTightlyScrewed: 'Y',
              couplerLengthSufficient: 'Y',
              jointSealedWithTape: 'Y',
              couplerStaggered: 'Y',
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_GEO_GRID:
          if (rfiData.metaData.fixingOfGeoGridData) {
            setFixingOfGeoGridData(rfiData.metaData.fixingOfGeoGridData);
          } else {
            setFixingOfGeoGridData({
              materialApprovedByEngineer: 'Y',
              specificationsAsPerApprovedDrawing: 'Y',
              soilProperlyCompacted: 'Y',
              geoGridsAnchoredIntoFaciaPanels: 'Y',
              geoGridsTensionedAndNailed: 'Y',
              minimumLengthAsPerApprovedDrawing: 'Y',
            });
          }
          break;
        case TASK_TYPES.ERECTION_OF_FRICTION_SLAB:
          if (rfiData.metaData.erectionOfFrictionSlabData) {
            setErectionOfFrictionSlabData(
              rfiData.metaData.erectionOfFrictionSlabData,
            );
          } else {
            setErectionOfFrictionSlabData({
              sufficientStrength: 'Y',
              notDamaged: 'Y',
              lineLevelsChecked: 'Y',
              verticalSlopeAsPerDrawing: 'Y',
              soilCompactedAndGeoGridsFixed: 'Y',
              copingDone: 'Y',
            });
          }
          break;
        case TASK_TYPES.ERECTION_OF_FACIA_PANELS:
          if (rfiData.metaData.erectionOfFaciaPanelsData) {
            setErectionOfFaciaPanelsData(
              rfiData.metaData.erectionOfFaciaPanelsData,
            );
          } else {
            setErectionOfFaciaPanelsData({
              sufficientStrength: 'Y',
              notDamaged: 'Y',
              lineLevelsChecked: 'Y',
              maleFemaleJointsChecked: 'Y',
              verticalSlopeAsPerDrawing: 'Y',
              soilCompactedAndGeoGridsFixed: 'Y',
            });
          }
          break;
        case TASK_TYPES.ERECTION_OF_COLUMNS:
          if (rfiData.metaData.erectionOfColumnsData) {
            setErectionOfColumnsData(rfiData.metaData.erectionOfColumnsData);
          } else {
            setErectionOfColumnsData({
              positionChecked: 'Y',
              weldingAsPerDrawing: 'Y',
              columnsAsPerDrawing: 'Y',
              supportProvided: 'Y',
            });
          }
          break;
        case TASK_TYPES.APPLICATION_OF_FILTER_MEDIA:
          if (rfiData.metaData.applicationOfFilterMediaData) {
            setApplicationOfFilterMediaData(
              rfiData.metaData.applicationOfFilterMediaData,
            );
          } else {
            setApplicationOfFilterMediaData({
              filterMediaAsPerDrawing: 'Y',
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_BRACINGS:
          if (rfiData.metaData.fixingOfBracingsData) {
            setFixingOfBracingsData(rfiData.metaData.fixingOfBracingsData);
          } else {
            setFixingOfBracingsData({
              lineLevelsChecked: 'Y',
              weldingAsPerApprovedDrawing: 'Y',
              bracingsAsPerApprovedDrawing: 'Y',
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_RAILING:
          if (rfiData.metaData.fixingOfRailingData) {
            setFixingOfRailingData(rfiData.metaData.fixingOfRailingData);
          } else {
            setFixingOfRailingData({
              lineLevelsChecked: 'Y',
              railingAsPerApprovedDrawing: 'Y',
            });
          }
          break;
        case TASK_TYPES.PROCUREMENT_OF_SHEET:
          if (rfiData.metaData.procurementOfSheetData) {
            setProcurementOfSheetData(rfiData.metaData.procurementOfSheetData);
          } else {
            setProcurementOfSheetData({
              totalSheetPurchased: 0,
            });
          }
          break;
        case TASK_TYPES.DUMPING_OF_SOIL:
          if (rfiData.metaData.dumpingOfSoilData) {
            setDumpingOfSoilData(rfiData.metaData.dumpingOfSoilData);
          } else {
            setDumpingOfSoilData({
              soilApprovedSource: 'Y',
              soilWithoutUnwantedMaterials: 'Y',
              quantityOfSoilDumped: '0.0',
            });
          }
          break;
        case TASK_TYPES.BORING_OF_DIAPHRAGM:
          if (rfiData.metaData.boringOfDiaphragmData) {
            setBoringOfDiaphragmData(rfiData.metaData.boringOfDiaphragmData);
          } else {
            setBoringOfDiaphragmData({
              densityOfPolymer: 0.0,
              viscosityOfPolymer: 0,
              pHValueOfPolymer: 0,
              sandContentOfPolymer: 0,
              depthOfWall: 0.0,
            });
          }
          break;
        case TASK_TYPES.ERECTION:
          if (rfiData.metaData.erectionData) {
            setErectionData(rfiData.metaData.erectionData);
          } else {
            setErectionData({
              groundLeveled: 'Y',
              areaBarricaded: 'Y',
              temporaryLights: 'Y',
              flagManAvailable: 'Y',
              methodologyAvailable: 'Y',
              cranePositioned: 'Y',
              deShacklesCertified: 'Y',
              safetyColorCode: 'Y',
              hydraulicJacksCalibrated: 'Y',
              limitSwitchWorking: 'Y',
              cotterPinPlaced: 'Y',
              macalloyBarsCondition: 'Y',
              tpiDone: 'Y',
              tpiCertificatesAvailable: 'Y',
              counterWeightsPlaced: 'Y',
              positioningMarked: 'Y',
              trafficDiverted: 'Y',
              workersSafetyCertified: 'Y',
              safetyArrangements: 'Y',
              sitePositioned: 'Y',
              lateralSupportEnsured: 'Y',
            });
          }
          break;
        case TASK_TYPES.STRIPPING_AND_STORING_TOP_SOIL:
          if (rfiData.metaData.strippingAndStoringTopSoilData) {
            setStrippingAndStoringTopSoilData(
              rfiData.metaData.strippingAndStoringTopSoilData,
            );
          } else {
            setStrippingAndStoringTopSoilData({
              topSoilCollectedStored: 0, // Default value
            });
          }
          break;
        case TASK_TYPES.SPREADING_AND_COMPACTION:
          if (rfiData.metaData.spreadingAndCompactionData) {
            setSpreadingAndCompactionData(
              rfiData.metaData.spreadingAndCompactionData,
            );
          } else {
            setSpreadingAndCompactionData({
              sourceOfMaterialApproved: 'Y',
              groundImprovementDone: 'Y',
              underLayingLayerApproved: 'Y',
              gradeSurveyStakesAvailable: 'Y',
              graderAvailable: 'Y',
              gradingDoneAsPerRequirement: 'Y',
              uniformSprinklingDone: 'Y',
              dumpingPatternFollowed: 'Y',
              materialFreeFromDeleterious: 'Y',
              containsOverSizeBoulders: 'Y',
              looseThicknessChecked: 'Y',
              omcMaintained: 'Y',
              suitableRollerAvailable: 'Y',
              rollingPatternFollowed: 'Y',
              finishedLayerThicknessSpecified: 'Y',
              localizedIssuesFound: 'N',
              layerFreeFromSegregation: 'Y',
              protectionOfFinishedSurfaceAvailable: 'Y',
              nonConformanceFound: 'N',
            });
          }
          break;
        case TASK_TYPES.PRIME_COAT:
        case TASK_TYPES.TACK_COAT:
          if (rfiData.metaData.primeCoatData) {
            setPrimeCoatData(rfiData.metaData.primeCoatData);
          } else {
            setPrimeCoatData({
              previousLayerApproved: 'Y',
              surfacePreparationSatisfactory: 'Y',
              materialGradeApproved: 'Y',
              bituminousEmulsionTemperatureChecked: 'Y',
              uniformSprayRate: 'Y',
              nonConformanceFound: 'N',
            });
          }
          break;
        case TASK_TYPES.ROAD_MARKING:
          if (rfiData.metaData.roadMarkingData) {
            setRoadMarkingData(rfiData.metaData.roadMarkingData);
          } else {
            setRoadMarkingData({
              drawingAndMethodApproved: 'Y',
              thermoplasticAndGlassBeadApproved: 'Y',
              heaterConditionChecked: 'Y',
              thermometerWorking: 'Y',
              materialHeatedToSpecifiedTemperature: 'Y',
              surfaceClean: 'Y',
              markingDoneBeforeLaying: 'Y',
              glassBeadsApplied: 'Y',
              paintLaidInMoltenState: 'Y',
              paintThicknessChecked: 'Y',
              nonConformanceFound: 'N',
            });
          }
          break;
        case TASK_TYPES.LAYING_AND_COMPACTION:
          if (rfiData.metaData.layingAndCompactionData) {
            setLayingAndCompactionData(
              rfiData.metaData.layingAndCompactionData,
            );
          } else {
            setLayingAndCompactionData({
              safetyMeasuresTaken: 'Y',
              approvedMethodologyAvailable: 'Y',
              primeCoatCured: 'Y',
              sprayRateChecked: 'Y',
              jointTrimmedPrepared: 'Y',
              programConveyed: 'Y',
              thermometerAvailable: 'Y',
              paverSensorsSet: 'Y',
              alignmentMarked: 'Y',
              paverPlacedCleaned: 'Y',
              mixTransported: 'Y',
              mixTemperatureFound: 'Y',
              looseThicknessChecked: 'Y',
              rollingPatternFollowed: 'Y',
              surfaceLevelChecked: 'Y',
              transverseJointsPrepared: 'Y',
              nonConformanceFound: 'N',
              layerThickness: 0.0,
              totalMaterialQtyLaid: 0.0,
              totalMaterialQtySqm: 0.0,
            });
          }
          break;
        case TASK_TYPES.PIPE_LAYING_AND_JOINTING:
          if (rfiData.metaData.pipeLayingAndJointingData) {
            setPipeLayingAndJointingData(
              rfiData.metaData.pipeLayingAndJointingData,
            );
          } else {
            setPipeLayingAndJointingData({
              materialAsPerGFC: 'Y',
              latestGFCAvailable: 'Y',
              locationLevelsPipeSizeAsPerGFC: 'Y',
              routingCheckedAsPerGFC: 'Y',
              hangerSupportProperSpacing: 'Y',
              fastenerHangerRodAsPerGFC: 'Y',
              jointPreparationFitUp: 'Y',
              visualInspectionOfWeldedJoints: 'Y',
              threadCheckForJoints: 'Y',
              threadedJointsTightened: 'Y',
              undergroundGIPipingTreatment: 'Y',
              threadedPipesAlignedStraight: 'Y',
              installedPipesAlignedProperly: 'Y',
              totalPipeLength: 0.0,
              totalNumberOfPipes: 0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_METAL_BEAM:
          if (rfiData.metaData.fixingOfMetalBeamData) {
            setFixingOfMetalBeamData(rfiData.metaData.fixingOfMetalBeamData);
          } else {
            setFixingOfMetalBeamData({
              barrierToEmbankmentDistance: 'Y',
              barrierToEdgeOfCarriagewayDistance: 'Y',
              medianWBeamFaceDistance: 'Y',
              spacersInstalledProperly: 'Y',
              boltsFixedAndTightened: 'Y',
              totalLengthOfMetalBeamFixed: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_VERTICAL_POST:
          if (rfiData.metaData.fixingVerticalPostData) {
            setFixingVerticalPostData(rfiData.metaData.fixingVerticalPostData);
          } else {
            setFixingVerticalPostData({
              pitsDuggedToPlan: 'Y',
              distanceMaintainedBarrierSlope: 'Y',
              distanceMaintainedBarrierCarriageway: 'Y',
              postsAlignedHeightAsPerDrawing: 'Y',
              steelPostsPlacedMethodology: 'Y',
              totalVerticalPostInstalled: 0,
            });
          }
          break;

        case TASK_TYPES.CUTTING_OF_JOINTS:
          if (rfiData.metaData.cuttingOfJointsData) {
            setCuttingOfJointsData(rfiData.metaData.cuttingOfJointsData);
          } else {
            setCuttingOfJointsData({
              jointsCutAtDesiredIntervals: 'Y',
              jointsCutAtDesiredDepth: 'Y',
              jointCutDoneProperly: 'Y',
              totalLengthCompleted: 0.0,
            });
          }
          break;
        case TASK_TYPES.LAYING_OF_PAVER_BLOCK:
          if (rfiData.metaData.layingOfPaverBlockData) {
            setLayingOfPaverBlockData(rfiData.metaData.layingOfPaverBlockData);
          } else {
            setLayingOfPaverBlockData({
              subBaseCompacted: 'Y',
              sandLayingCourse: 'Y',
              pavingBlocksApprovedSource: 'Y',
              pavingBlocksDimension: 'Y',
              pavingBlocksInstallation: 'Y',
              plateCompactorMoved: 'Y',
              jointsAsPerMethodStatement: 'Y',
              locationAlignmentCorrect: 'Y',
              totalLengthLaid: 0.0,
              totalSqmLaid: 0.0,
              thicknessPaverBlock: 0.0,
              gradeOfConcrete: '',
            });
          }
          break;
        case TASK_TYPES.LAYING_OF_DLC:
          if (rfiData.metaData.layingOfDlcTableData) {
            rfiData.metaData.layingOfDlcTableData.forEach(item => {
              item.key = Guid.create();
            });
            setLayingOfDlcTableData(rfiData.metaData.layingOfDlcTableData);
          } else {
            setLayingOfDlcTableData([]);
          }
          if (rfiData.metaData.layingOfDLCData) {
            setLayingOfDLCData(rfiData.metaData.layingOfDLCData);
          } else {
            setLayingOfDLCData({
              mixDesignApproved: 'Y',
              gsbLayerApproved: 'Y',
              gradeSurveyStakesAvailable: 'Y',
              placingMaterialAppropriate: 'Y',
              paverAvailable: 'Y',
              curingArrangementAvailable: 'Y',
              suitableRollersAvailable: 'Y',
              layersSegregationFree: 'Y',
              surfaceProtectionArrangement: 'Y',
              lightArrangementForNightWork: 'Y',
              batchSlipAsPerMixDesign: 'Y',
              workerPPE: 'Y',
              totalLengthDLC: 0.0,
              totalAreaDLC: 0.0,
            });
          }
          break;
        case TASK_TYPES.MACHINE_CUTTING_OF_JOINTS:
          if (rfiData.metaData.machineCuttingData) {
            setMachineCuttingData(rfiData.metaData.machineCuttingData);
          } else {
            setMachineCuttingData({
              cuttingSawsAvailable: 'Y',
              diamondSawBladesAvailable: 'Y',
              waterTankAvailable: 'Y',
              machineCutStartTimeCorrect: 'Y',
              cuttingAsPerApprovedDrawing: 'Y',
            });
          }
          break;
        case TASK_TYPES.PLACING_OF_TIE_BAR:
          if (rfiData.metaData.placingOfTieBarData) {
            setPlacingOfTieBarData(rfiData.metaData.placingOfTieBarData);
          } else {
            setPlacingOfTieBarData({
              drawingApproved: 'Y',
              placingDoneAsPerDrawings: 'Y',
              alignmentDoneProperly: 'Y',
              nonConformanceFound: 'Y',
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_WIRE_ROPE:
          if (rfiData.metaData.fixingOfWireRopeData) {
            setFixingOfWireRopeData(rfiData.metaData.fixingOfWireRopeData);
          } else {
            setFixingOfWireRopeData({
              strandsFromApprovedSource: 'Y',
              endAttachmentsCondition: 'Y',
              heatDamageEvidence: 'Y',
              ropeDamageRectification: 'Y',
              alignedProperlyAsPerDrawing: 'Y',
              strandTensionedAtEnds: 'Y',
            });
          }
          break;
        case TASK_TYPES.TEXTURING:
          if (rfiData.metaData.texturingData) {
            setTexturingData(rfiData.metaData.texturingData);
          } else {
            setTexturingData({
              steelTinesBrushAutomatic: 'Y',
              texturingWithinTimeLimits: 'Y',
              tiningUnitPressureAdjusted: 'Y',
              tiningRakersCleaned: 'Y',
              tinesBentOrDamaged: 'Y',
              tinedGrooveDimensionsCorrect: 'Y',
              surfaceBleedingDone: 'Y',
              brushAppliedOneDirection: 'Y',
              brushAsPerMorthSpecification: 'Y',
              totalTexturingDone: 0.0,
            });
          }
          break;
        case TASK_TYPES.PLACING_OF_DOWEL:
          if (rfiData.metaData.placingOfDowelData) {
            setPlacingOfDowelData(rfiData.metaData.placingOfDowelData);
          } else {
            setPlacingOfDowelData({
              pqcDrawingApproved: 'Y',
              dowelBarsPlacedProperDepth: 'Y',
              barsAlignedProperly: 'Y',
              dowelBarCoveredWithPlasticSheath: 'Y',
              sheathDia: 0.0,
              sheathMouthClosed: 'Y',
              dowelBarLengthAsPerDrawing: 'Y',
              totalDowelBars: 0,
            });
          }
          break;
        case TASK_TYPES.COMPACTION:
          if (rfiData.metaData.compactionData) {
            setCompactionData(rfiData.metaData.compactionData);
          } else {
            setCompactionData({
              uniformSprinkling: 'Y',
              looseThicknessChecked: 'Y',
              omcMaintained: 'Y',
              suitableRollerAvailable: 'Y',
              passesSpeedPatternFollowed: 'Y',
              compactedLayerThicknessSpecified: 'Y',
              compactedLayerThickness: 0.0,
              localizedWetSoftAreaFound: 'Y',
              layerFreeFromSegregation: 'Y',
              protectionForFinishedSurface: 'Y',
              nonConformanceFound: 'Y',
            });
          }
          break;
        case TASK_TYPES.PLACING_OF_FILLER_BOARD:
          if (rfiData.metaData.placingOfFillerBoardData) {
            setPlacingOfFillerBoardData(
              rfiData.metaData.placingOfFillerBoardData,
            );
          } else {
            setPlacingOfFillerBoardData({
              sourceApproved: 'Y',
              surfaceFreeFromDust: 'Y',
              fillerBoardCutProperly: 'Y',
              fillerBoardPlacedProperly: 'Y',
              fillerBoardCompressed: 'Y',
              fillerBoardThickness: 0.0,
              totalFillerBoardQty: 0.0,
            });
          }
          break;
        case TASK_TYPES.SEALANT_FILING:
          if (rfiData.metaData.sealantFilingData) {
            setSealantFilingData(rfiData.metaData.sealantFilingData);
          } else {
            setSealantFilingData({
              sealantSourceApproved: 'Y',
              jointFaceCleaned: 'Y',
              sealantPlacedProperDepth: 'Y',
              twoCoatPrimerDone: 'Y',
              tappingDoneEdges: 'Y',
              sealantPouredProperly: 'Y',
              tapeRemovedAfterTooling: 'Y',
              arrangementForCuring: 'Y',
              sealantQtyUtilized: 0.0,
            });
          }
          break;
        case TASK_TYPES.MILLING_OF_FLEXIBLE_PAVEMENT:
          if (rfiData.metaData.millingData) {
            setMillingData(rfiData.metaData.millingData);
          } else {
            setMillingData({
              milledSurfaceUniform: 'Y',
              finishedSurfaceWithinTolerance: 'Y',
              textureSafeForMotorist: 'Y',
              depthOfMilling: 0.0,
              totalQtyMilledMaterial: 0.0,
              totalSurfaceAreaMilled: 0.0,
            });
          }
          break;
        case TASK_TYPES.LAYING_OF_SEPARATION_MEMBRANE:
          if (rfiData.metaData.layingOfSeparationMembraneData) {
            setLayingOfSeparationMembraneData(
              rfiData.metaData.layingOfSeparationMembraneData,
            );
          } else {
            setLayingOfSeparationMembraneData({
              subbaseSweptClean: 'Y',
              undulationsLeveled: 'Y',
              membraneTightStraight: 'Y',
              colourOfMembrane: 'Y',
              thicknessOfMembrane: 'Y',
              properOverlappingProvided: 'Y',
              finishedCompactedLayerThickness: 0.0,
              nonConformanceFound: 'Y',
            });
          }
          break;
        case TASK_TYPES.CUTTING_OF_SOIL:
          if (rfiData.metaData.cuttingOfSoilData) {
            setCuttingOfSoilData(rfiData.metaData.cuttingOfSoilData);
          } else {
            setCuttingOfSoilData({
              safetyMeasuresTaken: 'Y',
              equipmentAvailable: 'Y',
              excavationDone: 'Y',
              totalSoilCutQty: 0.0,
            });
          }
          break;
        case TASK_TYPES.LAYING_OF_PAVEMENT_QUALITY_CONCRETE:
          if (rfiData.metaData.layingOfPQCData) {
            setLayingOfPQCData(rfiData.metaData.layingOfPQCData);
          } else {
            setLayingOfPQCData({
              trailPatchApproved: 'Y',
              mixDesignApproved: 'Y',
              dlcLayerApproved: 'Y',
              adequateGradeSurveyStakes: 'Y',
              pqcTransportedWithTarpaulin: 'Y',
              sufficientLaboursAvailable: 'Y',
              separationMembraneTight: 'Y',
              dowelBarsCoveredWithSheath: 'Y',
              backhoeBucketAvailable: 'Y',
              pqcLeadDistance: 0.0,
              paverAvailableForDLC: 'Y',
              paverFunctioningChecked: 'Y',
              materialPlacedAppropriately: 'Y',
              curingArrangementAvailable: 'Y',
              layersSegregationFree: 'Y',
              surfaceProtectionArranged: 'Y',
              lightArrangementForNightWork: 'Y',
              ppeAvailable: 'Y',
              totalPQCLaidLength: 0.0,
              totalPQCLaidArea: 0.0,
              pqcThicknessLaid: 0.0,
            });
          }
          break;
        case TASK_TYPES.BACKFILLING:
          if (rfiData.metaData.backfillingData) {
            setBackfillingData(rfiData.metaData.backfillingData);
          } else {
            setBackfillingData({
              areaClearOfDebris: 'Y',
              backfillingTimingAppropriate: 'Y',
              approvedFillMaterials: 'Y',
              layerThicknessCheck: 'Y',
              compactionDegreeCheck: 'Y',
              layerTestsDone: 'Y',
              levelAndElevationVerified: 'Y',
              beddingMaterialCompacted: 'Y',
              waterproofingMembraneProtected: 'Y',
              backfillingCompleteAndClean: 'Y',
              totalSoilQtyUsed: 0.0,
            });
          }
          break;
        case TASK_TYPES.BRICKS_WORK:
          if (rfiData.metaData.bricksWorkData) {
            setBricksWorkData(rfiData.metaData.bricksWorkData);
          } else {
            setBricksWorkData({
              drawingsAvailable: 'Y',
              bricksSizeClassAsPerDrawing: 'Y',
              requiredBlocksAvailable: 'Y',
              hackingDone: 'Y',
              cementMortarApplied: 'Y',
              aluminiumTemplatesUsed: 'Y',
              requiredToolsAvailable: 'Y',
              clientSpecificRequirements: 'N',
              cementApprovedGrade: 'Y',
              sandCleanGritty: 'Y',
              floorLevelMarked: 'Y',
              pillarMarkingsDone: 'Y',
              brickworkChecked: 'Y',
              totalBrickWorkArea: 0.0,
              totalBrickWorkCum: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_GEO_CELL:
          if (rfiData.metaData.fixingGeoCellData) {
            setFixingGeoCellData(rfiData.metaData.fixingGeoCellData);
          } else {
            setFixingGeoCellData({
              sourceApproved: 'Y',
              methodStatementApproved: 'Y',
              slopeMaintained: 'Y',
              slopeCompacted: 'Y',
              geoCellLaidAsPerDrawing: 'Y',
              geoCellJointsFixedProperly: 'Y',
              geoCellSizeAsPerDrawing: 'Y',
              totalGeoCellArea: 0.0,
              totalGeoCellConsumption: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_MESH:
          if (rfiData.metaData.fixingOfMeshData) {
            setFixingOfMeshData(rfiData.metaData.fixingOfMeshData);
          } else {
            setFixingOfMeshData({
              sourceApproved: 'Y',
              sizeAsPerDrawing: 'Y',
              wireMeshDamageChecked: 'Y',
              unitStretchedForFoldsRemoved: 'Y',
              totalAreaSlope: 0.0,
              totalQtyMesh: 0.0,
            });
          }
          break;
        case TASK_TYPES.LAYING_OF_GRASS_TURF:
          if (rfiData.metaData.layingOfGrassTurfData) {
            setLayingOfGrassTurfData(rfiData.metaData.layingOfGrassTurfData);
          } else {
            setLayingOfGrassTurfData({
              turfsCutPlantedWithin24hrs: 'Y',
              baseAreaPrepared: 'Y',
              topsoilThicknessVerified: 'Y',
              suitableTopDressingMaterial: 'Y',
              turfingLevelChecked: 'Y',
              waterSprayedCompletion: 'Y',
              woodNailingUsed: 'Y',
              turfingArrangementChecked: 'Y',
              overallTurfingWorkAccepted: 'Y',
              noVehiclesTrespass: 'Y',
              hydroseedingMethodVerified: 'Y',
              fibromatInstalled: 'Y',
              totalAreaCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.LAYING_OF_TOP_SOIL:
          if (rfiData.metaData.layingOfTopSoilData) {
            setLayingOfTopSoilData(rfiData.metaData.layingOfTopSoilData);
          } else {
            setLayingOfTopSoilData({
              approvedSource: 'Y',
              vehicleMovementArrangement: 'Y',
              machineryAvailable: 'Y',
              markingDone: 'Y',
              totalAreaLaying: 0.0,
              totalQtyOfSoil: 0.0,
            });
          }
          break;
        case TASK_TYPES.PLACING_AND_JOINTING_OF_CHUTE_MEMBERS:
          if (rfiData.metaData.chuteMembersData) {
            setChuteMembersData(rfiData.metaData.chuteMembersData);
          } else {
            setChuteMembersData({
              bottomSoilCompacted: 'Y',
              slopeMaintained: 'Y',
              chuteLiningDone: 'Y',
              supportForShutteringDone: 'Y',
              jointInLineAndLevel: 'Y',
              concretePlacingArrangement: 'Y',
              totalChuteLength: 0.0,
            });
          }
          break;
        case TASK_TYPES.PIT_EXCAVATION:
          if (rfiData.metaData.pitExcavationData) {
            setPitExcavationData(rfiData.metaData.pitExcavationData);
          } else {
            setPitExcavationData({
              undergroundUtilities: 'Y',
              pitsShoredTimbered: 'Y',
              fencesBarricadesProvided: 'Y',
              excavatedMaterialKeptAway: 'Y',
              heavyEquipmentKeptAway: 'Y',
              dangerSignsProvided: 'Y',
              accessExitProvided: 'Y',
              setOutChecked: 'Y',
              excavationSizeChecked: 'Y',
              looseMaterialsChecked: 'Y',
              bottomOfExcavationChecked: 'Y',
            });
          }
          break;
        case TASK_TYPES.PLANTING_GRASS:
          if (rfiData.metaData.plantingGrassData) {
            setPlantingGrassData(rfiData.metaData.plantingGrassData);
          } else {
            setPlantingGrassData({
              grassSeedingHandledGently: 'Y',
              grassSeedingDoneAfterHandling: 'Y',
              grassSeedingProtectedFromSunWind: 'Y',
              grassSeedKeptMoist: 'Y',
              grassTransportDuringCoolerPeriod: 'Y',
              seedingDoneAsPerApprovedDrawing: 'Y',
              seedingWateredProperly: 'Y',
              controlWeedsNearPlantation: 'Y',
              totalAreaCoveredWithGrass: 0.0,
            });
          }
          break;
        case TASK_TYPES.PLANTING_TREES:
          if (rfiData.metaData.plantingTreesData) {
            setPlantingTreesData(rfiData.metaData.plantingTreesData);
          } else {
            setPlantingTreesData({
              handleGently: 'Y',
              rootKeptMoist: 'Y',
              plantingDoneAsPerDrawing: 'Y',
              wateringDoneProperly: 'Y',
              controlWeedsNearPlantation: 'Y',
              barricadingDone: 'Y',
              heightAsPerDrawings: 'Y',
              typeOfPlantAsPerDrawing: 'Y',
              totalNoOfTreesPlanted: 0,
            });
          }
          break;
        case TASK_TYPES.PREPARATION_OF_SOIL:
          if (rfiData.metaData.preparationOfSoilData) {
            setPreparationOfSoilData(rfiData.metaData.preparationOfSoilData);
          } else {
            setPreparationOfSoilData({
              soilDumpedInLayer: 'Y',
              soilSpreadProperLength: 'Y',
              soilCompactedProperly: 'Y',
              totalQtySoil: 0.0,
              totalSurfaceArea: 0.0,
            });
          }
          break;
        case TASK_TYPES.SPREADING_OF_GRASS_SEEDS:
          if (rfiData.metaData.spreadingOfGrassSeedsData) {
            setSpreadingOfGrassSeedsData(
              rfiData.metaData.spreadingOfGrassSeedsData,
            );
          } else {
            setSpreadingOfGrassSeedsData({
              seedApprovedSource: 'Y',
              surfaceFreeFromGarbage: 'Y',
              surfaceWellPrepared: 'Y',
            });
          }
          break;
        case TASK_TYPES.WATERING:
          if (rfiData.metaData.wateringData) {
            setWateringData(rfiData.metaData.wateringData);
          } else {
            setWateringData({
              waterClean: 'Y',
              wateringThreeTimesADay: 'Y',
              totalQtyWaterUsed: 0.0,
            });
          }
          break;
        case TASK_TYPES.PLANTATION:
          if (rfiData.metaData.plantationData) {
            setPlantationData(rfiData.metaData.plantationData);
          } else {
            setPlantationData({
              seedingHandledGently: 'Y',
              seedingDoneAfterHandling: 'Y',
              protectedFromSunWind: 'Y',
              seedKeptMoist: 'Y',
              transportDuringCoolerPeriod: 'Y',
              seedingAsPerDrawing: 'Y',
              waterDoneForGrowth: 'Y',
              controlWeeds: 'Y',
              barricadingDone: 'Y',
              totalPlantsPlanted: 0,
              totalAreaCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.STONE_PITCHING:
          if (rfiData.metaData.stonePitchingData) {
            setStonePitchingData(rfiData.metaData.stonePitchingData);
          } else {
            setStonePitchingData({
              constructionDocsApproved: 'Y',
              workOfOtherTradesCompleted: 'Y',
              layerCompacted: 'Y',
              stoneShapeAndSizeAsPerSpec: 'Y',
              mortarReady: 'Y',
              mortarBondingDone: 'Y',
              totalSurfaceArea: 0.0,
              totalMaterialLaid: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_INVERTER_INSTALLATION:
          if (rfiData.metaData.inverterInstallationData) {
            setInverterInstallationData(
              rfiData.metaData.inverterInstallationData,
            );
          } else {
            setInverterInstallationData({
              drawingsApproved: 'Y',
              equipmentInspected: 'Y',
              equipmentDamagedInformed: 'Y',
              foundationWorkCompleted: 'Y',
              concreteStrengthAchieved: 'Y',
              installationMethodologyApproved: 'Y',
              safetyArrangementsInPlace: 'Y',
              machineryAndManpowerAvailable: 'Y',
              installationCompletedAsPerMethodology: 'Y',
              manufacturerInstructionsComplied: 'Y',
              totalEquipmentInstalled: 0,
            });
          }
          break;
        case TASK_TYPES.ERECTION_OF_DOUBLE_POLE_STRUCTURE:
          if (rfiData.metaData.erectionOfDoublePoleStructureData) {
            setErectionOfDoublePoleStructureData(
              rfiData.metaData.erectionOfDoublePoleStructureData,
            );
          } else {
            setErectionOfDoublePoleStructureData({
              drawingsApproved: 'Y',
              structureAtSiteReady: 'Y',
              foundationWorkCompleted: 'Y',
              concreteStrengthAchieved: 'Y',
              installationMethodologyApproved: 'Y',
              safetyArrangementsInPlace: 'Y',
              machineryManpowerAvailable: 'Y',
              erectionCompletedAsPerMethodology: 'Y',
              totalStructuresErected: 0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_MC4_Y_CONNECTOR:
          if (rfiData.metaData.fixingOfMC4Data) {
            setFixingOfMC4Data(rfiData.metaData.fixingOfMC4Data);
          } else {
            setFixingOfMC4Data({
              cablesConnected: 'Y',
              connectionsChecked: 'Y',
              totalYConnectorsUsed: 0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_MC4_Y_CONNECTOR:
          if (rfiData.metaData.fixingOfMC4Data) {
            setFixingOfMC4Data(rfiData.metaData.fixingOfMC4Data);
          } else {
            setFixingOfMC4Data({
              cablesConnected: 'Y',
              connectionsChecked: 'Y',
              totalYConnectorsUsed: 0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_MMS:
          if (rfiData.metaData.fixingOfMMSData) {
            setFixingOfMMSData(rfiData.metaData.fixingOfMMSData);
          } else {
            setFixingOfMMSData({
              drawingsApproved: 'Y',
              materialInspectedAndCleared: 'Y',
              materialReachedUndamaged: 'Y',
              foundationCompleted: 'Y',
              concreteAchievedStrength: 'Y',
              alignmentAsPerDrawings: 'Y',
              lineLevelChecked: 'Y',
              structureAngleChecked: 'Y',
              nutBoltsTorquedProperly: 'Y',
              visualFitCheck: 'Y',
              totalNoOfMMSTablesErected: 0,
              totalLengthOfMMSCompleted: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_MODULES:
          if (rfiData.metaData.fixingOfModulesData) {
            setFixingOfModulesData(rfiData.metaData.fixingOfModulesData);
          } else {
            setFixingOfModulesData({
              drawingsApproved: 'Y',
              materialInspectedFactory: 'Y',
              materialReachedSiteOk: 'Y',
              mmsInstallationCompleted: 'Y',
              alignmentAsPerDrawings: 'Y',
              lineLevelChecked: 'Y',
              moduleAngleChecked: 'Y',
              nutBoltsTorqued: 'Y',
              modulesFitVisually: 'Y',
              totalModulesMounted: 0,
              totalLengthMounted: 0.0,
            });
          }
          break;
        case TASK_TYPES.LAYING_OF_CAUTION_TAPE:
          if (rfiData.metaData.layingCautionTapeData) {
            setLayingCautionTapeData(rfiData.metaData.layingCautionTapeData);
          } else {
            setLayingCautionTapeData({
              drawingsApproved: 'Y',
              sizeShapeThicknessAsPerDrawings: 'Y',
              sourceMaterialApproved: 'Y',
              cautionTapeLaidProperly: 'Y',
              cautionTapeLaidAtDesiredDepth: 'Y',
              totalCautionTapeLength: 0.0,
            });
          }
          break;
        case TASK_TYPES.ROUTE_MARKING:
          if (rfiData.metaData.routeMarkingData) {
            setRouteMarkingData(rfiData.metaData.routeMarkingData);
          } else {
            setRouteMarkingData({
              drawingsApproved: 'Y',
              markersSizeShapeAsPerApproved: 'Y',
              materialSourceApproved: 'Y',
              layoutMarkedAtSite: 'Y',
              routeMarkersFixedProperly: 'Y',
              spacingAsPerSpecifications: 'Y',
              totalRouteMarkersInstalled: 0,
              totalLengthCoveredRM: 0.0,
            });
          }
          break;
        case TASK_TYPES.BRICKS_LAYERING:
          if (rfiData.metaData.bricksLayeringData) {
            setBricksLayeringData(rfiData.metaData.bricksLayeringData);
          } else {
            setBricksLayeringData({
              drawingsApproved: 'Y',
              bricksSizeClassApproved: 'Y',
              totalAreaCompleted: 0.0,
              totalBricksLaid: 0,
              totalLengthTrenchCompleted: 0.0,
            });
          }
          break;
        case TASK_TYPES.CABLE_DRESSING:
          if (rfiData.metaData.cableDressingData) {
            setCableDressingData(rfiData.metaData.cableDressingData);
          } else {
            setCableDressingData({
              cablesTiedProperly: 'Y',
              noCableDamaged: 'Y',
            });
          }
          break;
        case TASK_TYPES.CABLE_TRENCH_DRESSING:
          if (rfiData.metaData.cableTrenchDressingData) {
            setCableTrenchDressingData(
              rfiData.metaData.cableTrenchDressingData,
            );
          } else {
            setCableTrenchDressingData({
              safetyMeasuresTaken: 'Y',
              manpowerAvailable: 'Y',
              lineLevelsChecked: 'Y',
              trenchClearedUndesirableMaterial: 'Y',
              trenchCompacted: 'Y',
              totalTrenchDressed: 0.0,
            });
          }
          break;
        case TASK_TYPES.CONDUIT_LAYING:
          if (rfiData.metaData.conduitLayingData) {
            setConduitLayingData(rfiData.metaData.conduitLayingData);
          } else {
            setConduitLayingData({
              drawingsApproved: 'Y',
              conduitSizeShapeAsPerSpecs: 'Y',
              materialSourceApproved: 'Y',
              conduitPipeLaidProperly: 'Y',
              jointingDoneProperly: 'Y',
              totalConduitLength: 0.0,
            });
          }
          break;
        case TASK_TYPES.CABLE_TRENCH_EXCAVATION:
          if (rfiData.metaData.cableTrenchExcavationData) {
            setCableTrenchExcavationData(
              rfiData.metaData.cableTrenchExcavationData,
            );
          } else {
            setCableTrenchExcavationData({
              safetyMeasuresTaken: 'Y',
              drawingsApproved: 'Y',
              alignmentMarked: 'Y',
              utilitiesShifted: 'Y',
              excavationDepthWidth: 'Y',
              totalSoilQtyExcavated: 0.0,
              totalTrenchExcavated: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_AND_INSTALLATION_OF_LT_PANEL:
        case TASK_TYPES.FIXING_AND_INSTALLATION_OF_SERVO:
        case TASK_TYPES.FIXING_AND_INSTALLATION_OF_MCB:
        case TASK_TYPES.FIXING_AND_INSTALLATION_OF_INVERTOR:
        case TASK_TYPES.FIXING_AND_INSTALLATION_OF_HT_PANEL:
        case TASK_TYPES.FIXING_AND_INSTALLATION_OF_TRANSFORMER:
          if (rfiData.metaData.fixingAndInstallationData) {
            setFixingAndInstallationData(
              rfiData.metaData.fixingAndInstallationData,
            );
          } else {
            setFixingAndInstallationData({
              drawingsApproved: 'Y',
              equipmentInspected: 'Y',
              equipmentDamageInformed: 'Y',
              foundationReady: 'Y',
              concreteStrengthAchieved: 'Y',
              installationMethodologyApproved: 'Y',
              safetyArrangementsInPlace: 'Y',
              machineryManpowerAvailable: 'Y',
              installationCompleted: 'Y',
              manufacturerInstructionsComplied: 'Y',
              totalEquipmentInstalled: 0,
            });
          }
          break;
        case TASK_TYPES.HT_PANEL_INSTALLATION:
          if (rfiData.metaData.htPanelInstallationData) {
            setHtPanelInstallationData(
              rfiData.metaData.htPanelInstallationData,
            );
          } else {
            setHtPanelInstallationData({
              drawingsApproved: 'Y',
              equipmentInspected: 'Y',
              equipmentDamageReported: 'Y',
              foundationWorkCompleted: 'Y',
              concreteStrengthAchieved: 'Y',
              installationMethodologyApproved: 'Y',
              safetyArrangementsInPlace: 'Y',
              machineryAndManpowerAvailable: 'Y',
              installationCompleted: 'Y',
              manufacturerInstructionsFollowed: 'Y',
              totalEquipmentsInstalled: 0,
            });
          }
          break;
        case TASK_TYPES.ERECTION_OF_STRUCTURE:
          if (rfiData.metaData.erectionOfStructureData) {
            setErectionOfStructureData(
              rfiData.metaData.erectionOfStructureData,
            );
          } else {
            setErectionOfStructureData({
              positionChecked: 'Y',
              weldingDoneAsPerDrawing: 'Y',
              structureAsPerDrawing: 'Y',
              necessarySupportProvided: 'Y',
            });
          }
          break;
        case TASK_TYPES.FABRICATION_OF_STRUCTURE:
          if (rfiData.metaData.fabricationOfStructureData) {
            setFabricationOfStructureData(
              rfiData.metaData.fabricationOfStructureData,
            );
          } else {
            setFabricationOfStructureData({
              steelInspection: 'Y',
              sectionChecked: 'Y',
              materialSpecificationChecked: 'Y',
              connectionChecked: 'Y',
              boltHolesClean: 'Y',
              approvedWeldersUsed: 'Y',
              weldsIdentified: 'Y',
              weldsInspected: 'Y',
              weldsRepaired: 'Y',
              shapeEdgeBurnsRemoved: 'Y',
              oilGreaseRemoved: 'Y',
              steelCleanedAndPainted: 'Y',
              finalShopCoatApplied: 'Y',
              structureMarkedForErection: 'Y',
              structureApprovedPriorShipment: 'Y',
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_PANELS:
          if (rfiData.metaData.fixingOfPanelsData) {
            setFixingOfPanelsData(rfiData.metaData.fixingOfPanelsData);
          } else {
            setFixingOfPanelsData({
              drawingApproved: 'Y',
              materialSourceApproved: 'Y',
              panelShapeSizeAsDrawing: 'Y',
              boltsAligned: 'Y',
              panelsFixedInLine: 'Y',
              boltsFullyTorqued: 'Y',
              totalPanelsInstalled: 0,
              totalBusShelterCompleted: 0,
            });
          }
          break;
        case TASK_TYPES.ERECTION_OF_PRECAST_COLUMN:
          if (rfiData.metaData.erectionPreCastColumnData) {
            setErectionPreCastColumnData(
              rfiData.metaData.erectionPreCastColumnData,
            );
          } else {
            setErectionPreCastColumnData({
              drawingApproved: 'Y',
              columnsFromApprovedSource: 'Y',
              columnDamaged: 'Y',
              erectionAsPerDrawing: 'Y',
              lineLevelChecked: 'Y',
              dimensionsAsPerDrawing: 'Y',
              totalNoOfColumnsErected: 0,
              columnSpacingAsPerDrawing: 'Y',
              totalLengthOfBwallCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.ERECTION_OF_BUS_SHELTER:
          if (rfiData.metaData.erectionOfBusShelterData) {
            setErectionOfBusShelterData(
              rfiData.metaData.erectionOfBusShelterData,
            );
          } else {
            setErectionOfBusShelterData({
              materialSourceApproved: 'Y',
              drawingsApproved: 'Y',
              supportingSurfaceChecked: 'Y',
              safetyArrangementsInPlace: 'Y',
              totalPanelsInstalled: 0,
              totalBusStandsCompleted: 0,
            });
          }
          break;
        case TASK_TYPES.ERECTION_OF_ANGLE_SECTION:
          if (rfiData.metaData.erectionOfAngleSectionData) {
            setErectionOfAngleSectionData(
              rfiData.metaData.erectionOfAngleSectionData,
            );
          } else {
            setErectionOfAngleSectionData({
              anglesFromApprovedSource: 'Y',
              materialInspectionClearance: 'Y',
              materialDamagedInformed: 'Y',
              erectionAsPerDrawing: 'Y',
              alignmentSupportOk: 'Y',
              totalAnglesErected: 0,
            });
          }
          break;
        case TASK_TYPES.PLACING_OF_PRE_CAST_RCC_PANELS:
          if (rfiData.metaData.preCastRccPanelData) {
            setPreCastRccPanelData(rfiData.metaData.preCastRccPanelData);
          } else {
            setPreCastRccPanelData({
              drawingApproved: 'Y',
              panelsFromApprovedSource: 'Y',
              damagedPanelFound: 'Y',
              alignmentPlumbFixingSupport: 'Y',
              totalPanelsInstalled: 0,
              totalAreaInstalled: 0.0,
            });
          }
          break;
        case TASK_TYPES.PLACING_OF_CHAIN_LINK:
          if (rfiData.metaData.placingChainLinkData) {
            setPlacingChainLinkData(rfiData.metaData.placingChainLinkData);
          } else {
            setPlacingChainLinkData({
              drawingApproved: 'Y',
              fencingInstalledAsPerPlotPlan: 'Y',
              fittingsCapsTensionBarsHingesHardwareInstalled: 'Y',
              cornerEndPostsAnchoredSupported: 'Y',
              fenceComponentsDefectFree: 'Y',
              fenceInstalledAtCorrectHeight: 'Y',
              fenceEndsWithTerminalPost: 'Y',
              appropriateFastenersUsed: 'Y',
              damagedMeshInformedSupplier: 'Y',
              missingDamagedComponents: 'Y',
              tooMuchMovementTopRail: 'Y',
              rightFencingMaterialUsed: 'Y',
              requiredFenceGapPresent: 'Y',
              meshTensionWireLoose: 'Y',
              totalSqmFenceInstalled: 0.0,
            });
          }
          break;
        case TASK_TYPES.MORTAR_CHECKLIST:
          if (rfiData.metaData.mortarChecklistData) {
            setMortarChecklistData(rfiData.metaData.mortarChecklistData);
          } else {
            setMortarChecklistData({
              mortarMixUniform: 'Y',
              sufficientMortarQuantity: 'Y',
              blockAlignmentPlumb: 'Y',
              jointsStaggered: 'Y',
              mortarBetweenBlockAndColumn: 'Y',
              totalCementBagsConsumed: 0,
              totalSurfaceAreaToBePlastered: 0.0,
              totalMortarUsed: 0.0,
            });
          }
          break;
        case TASK_TYPES.FLOORING:
          if (rfiData.metaData.flooringData) {
            setFlooringData(rfiData.metaData.flooringData);
          } else {
            setFlooringData({
              flooringMaterialSourceApproved: 'Y',
              tilesCrackFree: 'Y',
              cracksHolesUnevenSurface: 'Y',
              jointsAtTransitionSmooth: 'Y',
              flooringDoneAtRamps: 'Y',
              totalSurfaceArea: 0.0,
              totalTilesUsed: 0,
            });
          }
          break;
        case TASK_TYPES.SIGNAGE_LOCATION_IDENTIFICATION:
          if (rfiData.metaData.signageLocationData) {
            setSignageLocationData(rfiData.metaData.signageLocationData);
          } else {
            setSignageLocationData({
              drawingApproved: 'Y',
              locationMarked: 'Y',
              locationCheckedByEngineer: 'Y',
              noHindranceInInstallation: 'Y',
            });
          }
          break;
        case TASK_TYPES.BACKFILL:
          if (rfiData.metaData.backfillData) {
            setBackfillData(rfiData.metaData.backfillData);
          } else {
            setBackfillData({
              areaClearOfDebris: 'Y',
              fillMaterialsApproved: 'Y',
              noDamageToCables: 'Y',
              backfillingComplete: 'Y',
              totalQtySoilUsed: 0.0,
              totalLengthTrenchBackfilled: 0.0,
            });
          }
          break;
        case TASK_TYPES.PLACEMENT_OF_SIGNAGE_SHEET:
          if (rfiData.metaData.placementOfSignageSheetData) {
            setPlacementOfSignageSheetData(
              rfiData.metaData.placementOfSignageSheetData,
            );
          } else {
            setPlacementOfSignageSheetData({
              materialSourceApproved: 'Y',
              drawingsApproved: 'Y',
              letterSizeAsPerDrawing: 'Y',
              rivetedProperlyInFrame: 'Y',
              placedAsPerDrawing: 'Y',
              totalSheetFixed: 0.0,
              totalRoadLengthCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_TRAFFIC_IMPACT_ATTENUATORS:
          if (rfiData.metaData.trafficImpactAttenuatorsData) {
            setTrafficImpactAttenuatorsData(
              rfiData.metaData.trafficImpactAttenuatorsData,
            );
          } else {
            setTrafficImpactAttenuatorsData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeSizeAsPerDrawing: 'Y',
              fixingMethodologyApproved: 'Y',
              attenuatorsFixedProperly: 'Y',
              itemsCleanedVisible: 'Y',
              totalNoOfAttenuatorsInstalled: 0,
              totalLengthOfRoadCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_SPRING_POST:
          if (rfiData.metaData.fixingOfSpringPostData) {
            setFixingOfSpringPostData(rfiData.metaData.fixingOfSpringPostData);
          } else {
            setFixingOfSpringPostData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeAndSizeAsPerDrawing: 'Y',
              postsFixedProperly: 'Y',
              lineAndLevelChecked: 'Y',
              spacingAsPerSpecification: 'Y',
              itemsCleanedAndVisible: 'Y',
              springPostInstalled: 0,
              totalRoadLengthCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_SOLAR_ROAD_STUDS:
          if (rfiData.metaData.fixingOfSolarRoadStudsData) {
            setFixingOfSolarRoadStudsData(
              rfiData.metaData.fixingOfSolarRoadStudsData,
            );
          } else {
            setFixingOfSolarRoadStudsData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeSizeAsPerDrawing: 'Y',
              colorCodeAndLocationAsPerSpec: 'Y',
              studsFixedProperly: 'Y',
              lineCheckedProperly: 'Y',
              spacingAsPerSpecs: 'Y',
              itemsCleanVisible: 'Y',
              noOfRoadStuds: 0,
              totalLengthCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_SOLAR_BLINKERS:
          if (rfiData.metaData.fixingOfSolarBlinkersData) {
            setFixingOfSolarBlinkersData(
              rfiData.metaData.fixingOfSolarBlinkersData,
            );
          } else {
            setFixingOfSolarBlinkersData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeAndSizeAsPerDrawing: 'Y',
              blinkersWorkingCondition: 'Y',
              blinkersFixedProperly: 'Y',
              lineLevelChecked: 'Y',
              itemsCleanedAndVisible: 'Y',
              totalBlinkersInstalled: 0,
              totalRoadLengthCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_ROAD_STUDS:
          if (rfiData.metaData.fixingOfRoadStudsData) {
            setFixingOfRoadStudsData(rfiData.metaData.fixingOfRoadStudsData);
          } else {
            setFixingOfRoadStudsData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeAndSizeAsPerDrawing: 'Y',
              colorCodeAndLocationAsPerSpecification: 'Y',
              studsFixedProperly: 'Y',
              lineAndLevelChecked: 'Y',
              spacingAsPerSpecification: 'Y',
              itemsCleanedVisible: 'Y',
              roadStudsInstalled: 0,
              totalLengthCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_ROAD_DELINEATORS:
          if (rfiData.metaData.fixingOfRoadDelineatorsData) {
            setFixingOfRoadDelineatorsData(
              rfiData.metaData.fixingOfRoadDelineatorsData,
            );
          } else {
            setFixingOfRoadDelineatorsData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeSizeAsPerDrawing: 'Y',
              delineatorsFixedProperly: 'Y',
              lineLevelChecked: 'Y',
              spacingBetweenDelineators: 'Y',
              nosOfDelineatorsInstalled: 0,
              totalLengthRoadCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_OBJECT_MARKERS:
          if (rfiData.metaData.fixingOfObjectMarkersData) {
            setFixingOfObjectMarkersData(
              rfiData.metaData.fixingOfObjectMarkersData,
            );
          } else {
            setFixingOfObjectMarkersData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeSizeApproved: 'Y',
              markersFixedProperly: 'Y',
              lineLevelsChecked: 'Y',
              itemsCleanedVisible: 'Y',
              totalMarkersInstalled: 0,
              totalLengthCoveredKm: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_NOISE_BARRIER:
          if (rfiData.metaData.fixingOfNoiseBarrierData) {
            setFixingOfNoiseBarrierData(
              rfiData.metaData.fixingOfNoiseBarrierData,
            );
          } else {
            setFixingOfNoiseBarrierData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeSizeApproved: 'Y',
              postsFixedProperly: 'Y',
              postsLineLevelChecked: 'Y',
              gapBetweenCrashAndNoiseBarrier: 'Y',
              frameFixedTightly: 'Y',
              totalNoiseBarrierPanelsInstalled: 0,
              totalLengthNoiseBarrierFixedRM: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_LED_TRAFFIC_BLINKERS:
          if (rfiData.metaData.fixingOfLEDTrafficBlinkersData) {
            setFixingOfLEDTrafficBlinkersData(
              rfiData.metaData.fixingOfLEDTrafficBlinkersData,
            );
          } else {
            setFixingOfLEDTrafficBlinkersData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeSizeApproved: 'Y',
              workingCondition: 'Y',
              itemsFixedProperly: 'Y',
              lineLevelChecked: 'Y',
              itemsCleanedVisible: 'Y',
              totalBlinkersInstalled: 0,
              totalHighwayLengthCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_HAZARD_MARKERS:
          if (rfiData.metaData.fixingOfHazardMarkersData) {
            setFixingOfHazardMarkersData(
              rfiData.metaData.fixingOfHazardMarkersData,
            );
          } else {
            setFixingOfHazardMarkersData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeSizeApproved: 'Y',
              markersFixedProperly: 'Y',
              lineLevelsChecked: 'Y',
              itemsCleanedVisible: 'Y',
              totalMarkersInstalled: 0,
              totalLengthCoveredKm: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_FLEXIBLE_MEDIAN_MARKERS:
          if (rfiData.metaData.fixingOfFlexibleMedianMarkersData) {
            setFixingOfFlexibleMedianMarkersData(
              rfiData.metaData.fixingOfFlexibleMedianMarkersData,
            );
          } else {
            setFixingOfFlexibleMedianMarkersData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeSizeApproved: 'Y',
              markersFixedProperly: 'Y',
              lineLevelsChecked: 'Y',
              spacingAsPerSpecifications: 'Y',
              itemsCleanedVisible: 'Y',
              totalMarkersInstalled: 0,
              totalLengthCoveredKm: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_CONVEX_MIRRORS:
          if (rfiData.metaData.fixingOfConvexMirrorsData) {
            setFixingOfConvexMirrorsData(
              rfiData.metaData.fixingOfConvexMirrorsData,
            );
          } else {
            setFixingOfConvexMirrorsData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeSizeApproved: 'Y',
              workingCondition: 'Y',
              mirrorsFixedProperly: 'Y',
              lineLevelAngleChecked: 'Y',
              itemsCleanVisible: 'Y',
              totalMirrorsInstalled: 0,
              totalLengthCoveredKm: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_ANTIGLARES:
          if (rfiData.metaData.fixingOfAntiglaresData) {
            setFixingOfAntiglaresData(rfiData.metaData.fixingOfAntiglaresData);
          } else {
            setFixingOfAntiglaresData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeSizeApproved: 'Y',
              itemsFixedProperly: 'Y',
              lineLevelsChecked: 'Y',
              spacingAsPerSpecifications: 'Y',
              itemsCleanVisible: 'Y',
              totalAntiglaresInstalled: 0,
              totalLengthCoveredKm: 0.0,
            });
          }
          break;
        case TASK_TYPES.ERECTION_OF_POLES:
          if (rfiData.metaData.erectionOfPolesData) {
            setErectionOfPolesData(rfiData.metaData.erectionOfPolesData);
          } else {
            setErectionOfPolesData({
              drawingsApproved: 'Y',
              sourceApproved: 'Y',
              factoryInspectionDone: 'Y',
              foundationsReady: 'Y',
              polesAlignedProperly: 'Y',
              nutBoltsTightened: 'Y',
              totalPolesErected: 0,
              totalHighwayLengthCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_ARMS:
          if (rfiData.metaData.fixingOfArmsData) {
            setFixingOfArmsData(rfiData.metaData.fixingOfArmsData);
          } else {
            setFixingOfArmsData({
              drawingsApproved: 'Y',
              sourceApproved: 'Y',
              factoryInspectionDone: 'Y',
              armsFixedProperly: 'Y',
              nutsBoltsTightened: 'Y',
              totalQtyArmsErected: 0,
              totalHighwayLengthCoveredKm: 0.0,
            });
          }
          break;
        case TASK_TYPES.INSTALLATION_OF_LED_LIGHTS:
          if (rfiData.metaData.installationOfLEDLightsData) {
            setInstallationOfLEDLightsData(
              rfiData.metaData.installationOfLEDLightsData,
            );
          } else {
            setInstallationOfLEDLightsData({
              drawingsApproved: 'Y',
              sourceApproved: 'Y',
              factoryInspectionDone: 'Y',
              lightsTestedBeforeInstallation: 'Y',
              lightsInstalledProperly: 'Y',
              totalQtyOfLightsInstalled: 0,
              totalLengthOfHighwayCoveredKm: 0.0,
            });
          }
          break;
        case TASK_TYPES.LAYING_OF_FLEXIBLE_CABLE:
          if (rfiData.metaData.layingOfFlexibleCableData) {
            setLayingOfFlexibleCableData(
              rfiData.metaData.layingOfFlexibleCableData,
            );
          } else {
            setLayingOfFlexibleCableData({
              drawingsApproved: 'Y',
              sourceApproved: 'Y',
              factoryInspectionDone: 'Y',
              cableLaidProperly: 'Y',
              jointsMadeProperly: 'Y',
              endpointsTerminatedProperly: 'Y',
              testingSuccessful: 'Y',
              totalCableLengthRM: 0.0,
              totalHighwayLengthKm: 0.0,
            });
          }
          break;
        case TASK_TYPES.LAYING_OF_LT_CABLE:
          if (rfiData.metaData.layingOfLTCableData) {
            setLayingOfLTCableData(rfiData.metaData.layingOfLTCableData);
          } else {
            setLayingOfLTCableData({
              drawingsApproved: 'Y',
              sourceApproved: 'Y',
              factoryInspectionDone: 'Y',
              cableLaidProperly: 'Y',
              jointsMadeProperly: 'Y',
              endPointsTerminated: 'Y',
              properTestingDone: 'Y',
              totalCableLengthRM: 0.0,
              totalHighwayLengthKm: 0.0,
            });
          }
          break;
        case TASK_TYPES.FIXING_OF_STONE:
          if (rfiData.metaData.fixingOfStoneData) {
            setFixingOfStoneData(rfiData.metaData.fixingOfStoneData);
          } else {
            setFixingOfStoneData({
              sourceMaterialApproved: 'Y',
              drawingApproved: 'Y',
              shapeSizeApproved: 'Y',
              stonesFixedProperly: 'Y',
              projectDetailsCorrect: 'Y',
              itemsCleanedVisible: 'Y',
              totalStonesInstalled: 0,
              totalLengthCoveredKm: 0.0,
            });
          }
          break;
        case TASK_TYPES.PLASTERING:
          if (rfiData.metaData.plasteringData) {
            setPlasteringData(rfiData.metaData.plasteringData);
          } else {
            setPlasteringData({
              drawingsApproved: 'Y',
              cementSourceApproved: 'Y',
              otherMaterialsSourceApproved: 'Y',
              proportionsAsPerSpecs: 'Y',
              thicknessAsPerDrawings: 'Y',
              surfaceFinishProper: 'Y',
              totalPlasteringWorkSqft: 0.0,
            });
          }
          break;
        case TASK_TYPES.PUTTY:
          if (rfiData.metaData.puttyData) {
            setPuttyData(rfiData.metaData.puttyData);
          } else {
            setPuttyData({
              drawingsApproved: 'Y',
              materialSourceApproved: 'Y',
              surfaceDriedReadyForPutty: 'Y',
              thicknessAsPerDrawing: 'Y',
              surfaceFinishUniform: 'Y',
              totalPuttyWorkSqft: 0.0,
            });
          }
          break;
        case TASK_TYPES.HVAC_WORK:
          if (rfiData.metaData.hvacWorkData) {
            setHvacWorkData(rfiData.metaData.hvacWorkData);
          } else {
            setHvacWorkData({
              drawingsApproved: 'Y',
              materialSourceApproved: 'Y',
              inspectionAndDispatchCleared: 'Y',
              siteReadyForHVAC: 'Y',
              ductingAsPerDrawings: 'Y',
              connectionPointsAsPerDrawings: 'Y',
              acFittingsAsPerDrawings: 'Y',
              systemTestedAndCertified: 'Y',
              totalSqftAreaCovered: 0.0,
            });
          }
          break;
        case TASK_TYPES.CEILING_WORK:
          if (rfiData.metaData.ceilingWorkData) {
            setCeilingWorkData(rfiData.metaData.ceilingWorkData);
          } else {
            setCeilingWorkData({
              drawingsApproved: 'Y',
              materialSourceApproved: 'Y',
              materialReceivedAsPerSpecifications: 'Y',
              siteReadyForCeilingWork: 'Y',
              finishingWorkUniform: 'Y',
              ceilingWorkCompletedToSatisfaction: 'Y',
              totalSqftAreaCompleted: 0.0,
            });
          }
          break;
        case TASK_TYPES.FURNITURE_WORK:
          if (rfiData.metaData.furnitureWorkData) {
            setFurnitureWorkData(rfiData.metaData.furnitureWorkData);
          } else {
            setFurnitureWorkData({
              drawingsApproved: 'Y',
              materialSourceApproved: 'Y',
              materialReceivedAsPerSpecs: 'Y',
              siteReadyForFurnitureWork: 'Y',
              finishingFurnitureProper: 'Y',
              workSatisfactoryToSiteInCharge: 'Y',
            });
          }
          break;
        case TASK_TYPES.DOOR_WORKS:
          if (rfiData.metaData.doorWorksData) {
            setDoorWorksData(rfiData.metaData.doorWorksData);
          } else {
            setDoorWorksData({
              drawingsApproved: 'Y',
              materialSourceApproved: 'Y',
              materialReceivedAsPerSpec: 'Y',
              siteReadyForDoorWork: 'Y',
              finishingWorkProper: 'Y',
              workSatisfactionAchieved: 'Y',
            });
          }
          break;
        case TASK_TYPES.WINDOW_WORKS:
          if (rfiData.metaData.windowWorksData) {
            setWindowWorksData(rfiData.metaData.windowWorksData);
          } else {
            setWindowWorksData({
              drawingsApproved: 'Y',
              materialSourceApproved: 'Y',
              materialReceivedAsPerSpecs: 'Y',
              siteReadyForWindowWork: 'Y',
              finishingWorkProper: 'Y',
              workCompletedToSatisfaction: 'Y',
            });
          }
          break;
        case TASK_TYPES.GLASS_WORKS:
          if (rfiData.metaData.glassWorksData) {
            setGlassWorksData(rfiData.metaData.glassWorksData);
          } else {
            setGlassWorksData({
              drawingsApproved: 'Y',
              materialSourceApproved: 'Y',
              materialReceivedAsPerSpecs: 'Y',
              glassQualityAndThicknessApproved: 'Y',
              siteReadyForGlassWork: 'Y',
              finishingWorkProper: 'Y',
              workCompletedToSiteInChargeSatisfaction: 'Y',
              totalGlassWorkCompletedSqft: 0.0,
            });
          }
          break;

        case TASK_TYPES.LIFTING_LEFT:
        case TASK_TYPES.LIFTING_YARD:
        case TASK_TYPES.LIFTING_RIGHT:
        case TASK_TYPES.LIFTING_TRANSPORT_ERECTION:
          if (rfiData.metaData?.liftingCombinedLRData) {
            setLiftingCombinedLRData(rfiData.metaData?.liftingCombinedLRData);
          } else {
            setLiftingCombinedLRData({
              areaBarricaded: 'Y',
              temporaryLights: 'Y',
              flagManAvailable: 'Y',
              liftingMethodology: 'Y',
              deshacklesTestCertificate: 'Y',
              safetyColorCode: 'Y',
              hydraulicJacksCondition: 'Y',
              hoistLimitSwitch: 'Y',
              cotterPinsPlaced: 'Y',
              macalloyBarsCondition: 'Y',
              heightPermitObtained: 'Y',
              macalloyBarsTestCertificate: 'Y',
              liftingSequence: 'Y',
              liftingHolesLocation: 'Y',
              liftingArrangementsWorking: 'Y',
              preStressingDuctsClear: 'Y',
              concreteStrengthGained: 'Y',
              sliderTrolleyPosition: 'Y',
              sandBlastingDone: 'Y',
              repairingFinished: 'Y',
              noRepairsOnShearkey: 'Y',
              bundRemoved: 'Y',
              soffitDeckCleaned: 'Y',
              sheathingDuctCleaned: 'Y',
              ductAlignmentChecked: 'Y',
              temporaryStressingHoleCleaned: 'Y',
              trailerFitnessChecked: 'Y',
              trailerTyresChecked: 'Y',
              groundLeveled: 'Y',
              areaBarricadedErectionSite: 'Y',
              temporaryLightsErectionSite: 'Y',
              flagManAvailableErectionSite: 'Y',
              liftingMethodologyErectionSite: 'Y',
              cranePositioned: 'Y',
              deshacklesTestCertificateErectionSite: 'Y',
              safetyColorCodeErectionSite: 'Y',
              hydraulicJacksConditionErectionSite: 'Y',
              hoistLimitSwitchErectionSite: 'Y',
              cotterPinsPlacedErectionSite: 'Y',
              macalloyBarsConditionErectionSite: 'Y',
              cranesTPICompleted: 'Y',
              cranesTPICertificatesAvailable: 'Y',
              counterWeightsPlaced: 'Y',
              positioningOfSegmentMarked: 'Y',
              trafficDiverted: 'Y',
              workersSafetyChecked: 'Y',
              safetyArrangementsPlaced: 'Y',
              segmentPositioned: 'Y',
              lateralSupportEnsured: 'Y',
            });
          }
          break;
        case TASK_TYPES.PRE_STRESSING:
          if (rfiData.metaData?.prestressingData) {
            setPrestressingData(rfiData.metaData.prestressingData);
          } else {
            const prestressingCablesDetails =
              selectedTask.taskDetailsData[0]?.details
                ?.prestressingCablesDetails;
            console.log(
              '====prestressing===',
              JSON.stringify(prestressingCablesDetails),
            );
            const array = [];
            for (let prop in prestressingCablesDetails) {
              array.push({
                cableNo: array.length + 1,
                stressingSequence:
                  prestressingCablesDetails[prop].stressingSequence,
                A0: 0,
                B0: 0,
                A1: 0,
                B1: 0,
                A2: 0,
                PA: 0,
                B2: 0,
                PB: 0,
                SA0: 0,
                SB0: 0,
              });
            }
            setPrestressingData(array);
          }
          break;
        default:
          break;
      }
      //}

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
  const validateLayingAndCompactionData = (
    layingAndCompactionData: any,
  ): boolean => {
    // Parsing values to float
    const thicknessOfLayer = parseFloat(layingAndCompactionData.layerThickness);
    const totalMaterialQtyTonne = parseFloat(
      layingAndCompactionData.totalMaterialQtyLaid,
    );
    const totalMaterialQtySqm = parseFloat(
      layingAndCompactionData.totalMaterialQtySqm,
    );

    // Validation for Thickness of Layer laid in mm
    if (
      isNaN(thicknessOfLayer) ||
      thicknessOfLayer <= 0 ||
      thicknessOfLayer > 1000 ||
      layingAndCompactionData.layerThickness.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Thickness of Layer laid (in mm) with max 3 decimal places, value should be > 0 and <= 1000',
        'error',
      );
      return false;
    }

    // Validation for Total material qty laid in tonne
    if (
      isNaN(totalMaterialQtyTonne) ||
      totalMaterialQtyTonne <= 0 ||
      totalMaterialQtyTonne > 10000 ||
      layingAndCompactionData.totalMaterialQtyLaid.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total material quantity laid (in tonne) with max 3 decimal places, value should be > 0 and <= 10000',
        'error',
      );
      return false;
    }

    // Validation for Total material qty in Sqm
    if (
      isNaN(totalMaterialQtySqm) ||
      totalMaterialQtySqm <= 0 ||
      totalMaterialQtySqm > 100000 ||
      layingAndCompactionData.totalMaterialQtySqm.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total material quantity in Sqm with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    // Converting the values back to numbers after validation
    layingAndCompactionData.layerThickness = Number(
      layingAndCompactionData.layerThickness,
    );
    layingAndCompactionData.totalMaterialQtyLaid = Number(
      layingAndCompactionData.totalMaterialQtyLaid,
    );
    layingAndCompactionData.totalMaterialQtySqm = Number(
      layingAndCompactionData.totalMaterialQtySqm,
    );

    return true;
  };

  const validateBoringOfDiaphragmData = (data: any): boolean => {
    const densityOfPolymer = parseFloat(data.densityOfPolymer);
    const viscosityOfPolymer = parseInt(data.viscosityOfPolymer, 10);
    const pHValueOfPolymer = parseInt(data.pHValueOfPolymer, 10);
    const sandContentOfPolymer = parseInt(data.sandContentOfPolymer, 10);
    const depthOfWall = parseFloat(data.depthOfWall);

    // Validation for Density of Polymer
    if (
      isNaN(densityOfPolymer) ||
      densityOfPolymer <= 0 ||
      densityOfPolymer > 5 ||
      !/^\d+(\.\d{1,2})?$/.test(data.densityOfPolymer)
    ) {
      showSnackbar(
        'Density of Polymer must be greater than 0, up to 2 decimal places, and less than or equal to 5 gm/ml.',
        'error',
      );
      return false;
    }

    // Validation for Viscosity of Polymer
    if (
      isNaN(viscosityOfPolymer) ||
      viscosityOfPolymer <= 0 ||
      viscosityOfPolymer > 500
    ) {
      showSnackbar(
        'Viscosity of Polymer must be an integer greater than 0 and less than or equal to 500 sec/liter.',
        'error',
      );
      return false;
    }

    // Validation for pH Value of Polymer
    if (
      isNaN(pHValueOfPolymer) ||
      pHValueOfPolymer <= 0 ||
      pHValueOfPolymer > 14
    ) {
      showSnackbar(
        'pH Value of Polymer must be an integer greater than 0 and less than or equal to 14.',
        'error',
      );
      return false;
    }

    // Validation for Sand Content of Polymer
    if (
      isNaN(sandContentOfPolymer) ||
      sandContentOfPolymer <= 0 ||
      sandContentOfPolymer > 100
    ) {
      showSnackbar(
        'Sand Content of Polymer must be an integer greater than 0 and less than or equal to 100%.',
        'error',
      );
      return false;
    }

    // Validation for Depth of Wall
    if (
      isNaN(depthOfWall) ||
      depthOfWall <= 0 ||
      depthOfWall > 100 ||
      !/^\d+(\.\d{1,3})?$/.test(data.depthOfWall)
    ) {
      showSnackbar(
        'Depth of Wall must be greater than 0, up to 3 decimal places, and less than or equal to 100 meters.',
        'error',
      );
      return false;
    }
    data.densityOfPolymer = Number(data.densityOfPolymer);
    data.viscosityOfPolymer = Number(data.viscosityOfPolymer);
    data.pHValueOfPolymer = Number(data.pHValueOfPolymer);
    data.sandContentOfPolymer = Number(data.sandContentOfPolymer);
    data.depthOfWall = Number(data.depthOfWall);
    return true;
  };

  const validateTransportationData = (data: any): boolean => {
    const transitTime = parseFloat(data.transitTime);

    // Validation for transit time
    if (
      isNaN(transitTime) ||
      transitTime <= 0 ||
      transitTime > 10000 ||
      !/^\d+(\.\d{1,2})?$/.test(data.transitTime)
    ) {
      showSnackbar(
        'Transit time must be greater than 0, up to 2 decimal places, and less than or equal to 10,000 hours.',
        'error',
      );
      return false;
    }

    data.transitTime = Number(data.transitTime);
    return true;
  };

  const validateProcurementOfSteelData = (data: any): boolean => {
    const totalQtyOfSteelProcured = parseFloat(data.totalQtyOfSteelProcured);

    // Validation for total quantity of steel procured
    if (
      isNaN(totalQtyOfSteelProcured) ||
      totalQtyOfSteelProcured <= 0 ||
      totalQtyOfSteelProcured > 100000 ||
      !/^\d+(\.\d{1,3})?$/.test(data.totalQtyOfSteelProcured)
    ) {
      showSnackbar(
        'Total quantity of steel procured must be greater than 0, up to 3 decimal places, and less than or equal to 1,00,000 tonnes.',
        'error',
      );
      return false;
    }
    data.totalQtyOfSteelProcured = Number(data.totalQtyOfSteelProcured);
    return true;
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
  const validateCuringData = (curingData: any): boolean => {
    const waterConsumptionInKL = parseFloat(curingData.waterConsumptionInKL);

    // Check if water consumption is a valid number, greater than 0, and within the limit of 100,000
    if (
      isNaN(waterConsumptionInKL) ||
      waterConsumptionInKL <= 0 ||
      waterConsumptionInKL > 100000 ||
      !/^\d+(\.\d{1,3})?$/.test(curingData.waterConsumptionInKL)
    ) {
      showSnackbar(
        'Water consumption must be a positive number, up to 3 decimal places, and less than or equal to 100,000',
        'error',
      );
      return false;
    }
    curingData.waterConsumptionInKL = Number(curingData.waterConsumptionInKL);
    return true;
  };

  const validateStrippingAndStoringTopSoilData = (data: any) => {
    const value = parseFloat(data.topSoilCollectedStored);
    if (isNaN(value)) {
      showSnackbar(
        'Invalid value for topsoil collected. Please enter a valid number.',
      );
      return false;
    }
    if (value <= 0) {
      showSnackbar('Quantity of topsoil collected must be greater than 0.');
      return false;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(data.topSoilCollectedStored)) {
      showSnackbar('Topsoil quantity must have up to two decimal places.');
      return false;
    }
    if (value > 100000) {
      showSnackbar('Topsoil quantity cannot exceed 100,000 cubic meters.');
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
  const validatePrestressingData = (prestressingData: any): boolean => {
    for (const item of prestressingData) {
      // Parsing values to float
      const A0 = parseFloat(item.A0);
      const B0 = parseFloat(item.B0);
      const A1 = parseFloat(item.A1);
      const B1 = parseFloat(item.B1);
      const A2 = parseFloat(item.A2);
      const B2 = parseFloat(item.B2);
      const PA = parseFloat(item.PA);
      const PB = parseFloat(item.PB);
      const SA0 = parseFloat(item.SA0);
      const SB0 = parseFloat(item.SB0);

      // Validation checks
      if (isNaN(A0) || A0 <= 0 || A0 > 500) {
        showSnackbar(
          'A0 must be greater than 0 and up to 500, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (isNaN(B0) || B0 <= 0 || B0 > 500) {
        showSnackbar(
          'B0 must be greater than 0 and up to 500, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (isNaN(A1) || A1 <= 0 || A1 > 500) {
        showSnackbar(
          'A1 must be greater than 0 and up to 500, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (isNaN(B1) || B1 <= 0 || B1 > 500) {
        showSnackbar(
          'B1 must be greater than 0 and up to 500, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (isNaN(A2) || A2 <= 0 || A2 > 500) {
        showSnackbar(
          'A2 must be greater than 0 and up to 500, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (isNaN(B2) || B2 <= 0 || B2 > 500) {
        showSnackbar(
          'B2 must be greater than 0 and up to 500, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (isNaN(PA) || PA <= 0 || PA > 500) {
        showSnackbar(
          'PA must be greater than 0 and up to 500, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (isNaN(PB) || PB <= 0 || PB > 500) {
        showSnackbar(
          'PB must be greater than 0 and up to 500, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (isNaN(SA0) || SA0 <= 0 || SA0 > 500) {
        showSnackbar(
          'SA0 must be greater than 0 and up to 500, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
      if (isNaN(SB0) || SB0 <= 0 || SB0 > 500) {
        showSnackbar(
          'SB0 must be greater than 0 and up to 500, with up to 2 decimal places.',
          'error',
        );
        return false;
      }
    }

    // Convert the values back to numbers after validation
    prestressingData.forEach((item: any) => {
      item.A0 = Number(item.A0);
      item.B0 = Number(item.B0);
      item.A1 = Number(item.A1);
      item.B1 = Number(item.B1);
      item.A2 = Number(item.A2);
      item.B2 = Number(item.B2);
      item.PA = Number(item.PA);
      item.PB = Number(item.PB);
      item.SA0 = Number(item.SA0);
      item.SB0 = Number(item.SB0);
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
      case TASK_TYPES.FIXING_OF_BEARING_SLEEVES:
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
      case TASK_TYPES.REMOVAL_OF_SIDE_SHUTTERS:
      case TASK_TYPES.REMOVAL_OF_MIDDLIE_TOP_SHUTTERS:
      case TASK_TYPES.REMOVAL_OF_INNER_SHUTTERS:
      case TASK_TYPES.REMOVAL_OF_SHUTTER:
      case TASK_TYPES.REMOVAL_OF_SHUTTERS:
        checkList = {
          taskName: selectedTask.name,
          concreteHasAchievedDesiredStrength:
            concreteHasAchievedDesiredStrength,
          minimumTimeHasBeenAttained: minimumTimeHasBeenAttained,
        };
        break;
      case TASK_TYPES.COMPACTING_GROUND_SUPPORT_FOR_EMBANKMENT:
      case TASK_TYPES.DEWATERING:
      case TASK_TYPES.PLACING_OF_COVER:
      case TASK_TYPES.FIXING_OF_SHEET:
      case TASK_TYPES.GRADING:
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
      case TASK_TYPES.STITCH_CONCRETE:
        if (!validateConcreteData(selectedTask?.name)) {
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
          stitchConcreteData: stitchConcreteData,
          concreteData: concreteData,
        };
        break;
      case TASK_TYPES.COPING:
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
      case TASK_TYPES.DUMPING:
        if (!validateDumpingData(dumpingData)) {
          return;
        }

        checkList = {
          taskName: selectedTask.name,
          dumpingData: dumpingData,
        };
        break;
      case TASK_TYPES.GLUEING:
        if (!validateGlueingData(glueingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          glueingData: glueingData,
        };
        break;
      case TASK_TYPES.TORQUING:
        if (!validateTorquingData(torquingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          torquingData: torquingData,
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
      case TASK_TYPES.PAINTING_OF_STEEL_GIRDERS_DIAPHRAGMS:
        checkList = {
          taskName: selectedTask.name,
          paintingOfSteelGirdersDiaphragms: paintingOfSteelGirdersDiaphragms,
        };
        break;

      case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
        checkList = {
          taskName: selectedTask.name,
          placementOfReinforcementCage: placementOfReinforcementCage,
        };
        break;

      case TASK_TYPES.TRANSPORTATION_OF_STEEL_GIRDERS_DIAPHRAGMS_ERECTION_AT_SITE:
        checkList = {
          taskName: selectedTask.name,
          transportationOfSteelGirdersDiaphragms:
            transportationOfSteelGirdersDiaphragms,
        };
        break;

      case TASK_TYPES.CURING:
        if (!validateCuringData(curingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          curingData: curingData,
        };
        break;

      case TASK_TYPES.FIXING_OF_SHUTTER:
        checkList = {
          taskName: selectedTask.name,
          fixingShutterData: fixingShutterData,
        };
        break;

      case TASK_TYPES.ERECTION_OF_TEMPORARY_STRUCTURE:
        checkList = {
          taskName: selectedTask.name,
          erectionOfTemporaryStructure: erectionOfTemporaryStructure,
        };
        break;
      case TASK_TYPES.ERECTION_USING_CRANES:
        checkList = {
          taskName: selectedTask.name,
          erectionUsingCranesData: erectionUsingCranesData,
        };
        break;
      case TASK_TYPES.STACKING_IN_YARD:
        checkList = {
          taskName: selectedTask.name,
          stackingInYardData: stackingInYardData,
        };
        break;

      case TASK_TYPES.ASSEMBLING_OF_TRUSS:
        checkList = {
          taskName: selectedTask.name,
          assemblingOfTrussData: assemblingOfTrussData,
        };
        break;
      case TASK_TYPES.HACKING_OF_GIRDER:
        checkList = {
          taskName: selectedTask.name,
          hackingOfGirderData: hackingOfGirderData,
        };
        break;
      case TASK_TYPES.DE_STRESSING_OF_GIRDER:
        checkList = {
          taskName: selectedTask.name,
          deStressingOfGirderData: deStressingOfGirderData,
        };
        break;
      case TASK_TYPES.FIXING_OF_BEARING:
        checkList = {
          taskName: selectedTask.name,
          fixingOfBearingData: fixingOfBearingData,
        };
        break;
      case TASK_TYPES.REMOVAL_OF_TEMPORARY_STRUCTURE:
        checkList = {
          taskName: selectedTask.name,
          removalOfTemporaryStructureData: removalOfTemporaryStructureData,
        };
        break;
      case TASK_TYPES.INSTALLATION_OF_EXPANSION_JOINT:
        checkList = {
          taskName: selectedTask.name,
          installationOfExpansionJointData: installationOfExpansionJointData,
        };
        break;
      case TASK_TYPES.PAINTING:
        checkList = {
          taskName: selectedTask.name,
          paintingData: paintingData,
        };
        break;
      case TASK_TYPES.AUTO_LAUNCHING:
        checkList = {
          taskName: selectedTask.name,
          autoLaunchingData: autoLaunchingData,
        };
        break;
      case TASK_TYPES.PROCUREMENT_OF_STRUCTURAL_STEEL:
        if (!validateProcurementOfSteelData(procurementOfSteelData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          procurementOfSteelData: procurementOfSteelData,
        };
        break;

      case TASK_TYPES.TRANSPORTATION_OF_MATERIAL:
        if (!validateTransportationData(transportationData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          transportationData: transportationData,
        };
        break;
      case TASK_TYPES.FIXING_OF_SHEATHING_JOINTS:
        checkList = {
          taskName: selectedTask.name,
          fixingOfSheathingJointsData: fixingOfSheathingJointsData,
        };
        break;
      case TASK_TYPES.FIXING_OF_GEO_GRID:
        checkList = {
          taskName: selectedTask.name,
          fixingOfGeoGridData: fixingOfGeoGridData,
        };
        break;
      case TASK_TYPES.ERECTION_OF_FRICTION_SLAB:
        checkList = {
          taskName: selectedTask.name,
          erectionOfFrictionSlabData: erectionOfFrictionSlabData,
        };
        break;
      case TASK_TYPES.ERECTION_OF_FACIA_PANELS:
        checkList = {
          taskName: selectedTask.name,
          erectionOfFaciaPanelsData: erectionOfFaciaPanelsData,
        };
        break;
      case TASK_TYPES.ERECTION_OF_COLUMNS:
        checkList = {
          taskName: selectedTask.name,
          erectionOfColumnsData: erectionOfColumnsData,
        };
        break;
      case TASK_TYPES.APPLICATION_OF_FILTER_MEDIA:
        checkList = {
          taskName: selectedTask.name,
          applicationOfFilterMediaData: applicationOfFilterMediaData,
        };
        break;
      case TASK_TYPES.FIXING_OF_BRACINGS:
        checkList = {
          taskName: selectedTask.name,
          fixingOfBracingsData: fixingOfBracingsData,
        };
        break;
      case TASK_TYPES.FIXING_OF_RAILING:
        checkList = {
          taskName: selectedTask.name,
          fixingOfRailingData: fixingOfRailingData,
        };
        break;
      case TASK_TYPES.PROCUREMENT_OF_SHEET:
        checkList = {
          taskName: selectedTask.name,
          procurementOfSheetData: {
            totalSheetPurchased: Number(
              procurementOfSheetData.totalSheetPurchased,
            ),
          },
        };
        break;
      case TASK_TYPES.DUMPING_OF_SOIL:
        checkList = {
          taskName: selectedTask.name,
          dumpingOfSoilData: dumpingOfSoilData,
        };
        break;
      case TASK_TYPES.BORING_OF_DIAPHRAGM:
        if (!validateBoringOfDiaphragmData(boringOfDiaphragmData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          boringOfDiaphragmData: boringOfDiaphragmData,
        };
        break;
      case TASK_TYPES.ERECTION:
        checkList = {
          taskName: selectedTask.name,
          erectionData: erectionData,
        };
        break;
      case TASK_TYPES.STRIPPING_AND_STORING_TOP_SOIL:
        if (
          !validateStrippingAndStoringTopSoilData(
            strippingAndStoringTopSoilData,
          )
        ) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          strippingAndStoringTopSoilData: {
            topSoilCollectedStored: Number(
              strippingAndStoringTopSoilData.topSoilCollectedStored,
            ), // Ensuring it's a number
          },
        };
        break;
      case TASK_TYPES.ROAD_MARKING:
        checkList = {
          taskName: selectedTask.name,
          roadMarkingData: roadMarkingData,
        };
        break;
      case TASK_TYPES.PRIME_COAT:
      case TASK_TYPES.TACK_COAT:
        checkList = {
          taskName: selectedTask.name,
          primeCoatData: primeCoatData,
        };
        break;
      case TASK_TYPES.SPREADING_AND_COMPACTION:
        checkList = {
          taskName: selectedTask.name,
          spreadingAndCompactionData: spreadingAndCompactionData,
        };
        break;
      case TASK_TYPES.LAYING_AND_COMPACTION:
        if (!validateLayingAndCompactionData(layingAndCompactionData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          layingAndCompactionData: layingAndCompactionData,
        };
        break;
      case TASK_TYPES.PIPE_LAYING_AND_JOINTING:
        if (!validatePipeLayingAndJointingData(pipeLayingAndJointingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          pipeLayingAndJointingData: pipeLayingAndJointingData,
        };
        break;
      case TASK_TYPES.FIXING_OF_METAL_BEAM:
        if (!validateFixingOfMetalBeamData(fixingOfMetalBeamData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfMetalBeamData: fixingOfMetalBeamData,
        };
        break;
      case TASK_TYPES.FIXING_VERTICAL_POST:
        if (!validateFixingVerticalPostData(fixingVerticalPostData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingVerticalPostData: fixingVerticalPostData,
        };
        break;

      case TASK_TYPES.CUTTING_OF_JOINTS:
        if (!validateCuttingOfJointsData(cuttingOfJointsData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          cuttingOfJointsData: cuttingOfJointsData,
        };
        break;
      case TASK_TYPES.LAYING_OF_PAVER_BLOCK:
        if (!validateLayingOfPaverBlockData(layingOfPaverBlockData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          layingOfPaverBlockData: layingOfPaverBlockData,
        };
        break;
      case TASK_TYPES.LAYING_OF_DLC:
        if (!validateLayingOfDlcData(layingOfDlcTableData)) {
          return;
        }
        if (!validateLayingOfDLCData(layingOfDLCData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          layingOfDLCData: layingOfDLCData,
          layingOfDlcTableData: layingOfDlcTableData,
        };
        break;
      case TASK_TYPES.MACHINE_CUTTING_OF_JOINTS:
        checkList = {
          taskName: selectedTask.name,
          machineCuttingData: machineCuttingData,
        };
        break;
      case TASK_TYPES.PLACING_OF_TIE_BAR:
        checkList = {
          taskName: selectedTask.name,
          placingOfTieBarData: placingOfTieBarData,
        };
        break;
      case TASK_TYPES.FIXING_OF_WIRE_ROPE:
        checkList = {
          taskName: selectedTask.name,
          fixingOfWireRopeData: fixingOfWireRopeData,
        };
        break;
      case TASK_TYPES.TEXTURING:
        if (!validateTexturingData(texturingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          texturingData: texturingData,
        };
        break;
      case TASK_TYPES.PLACING_OF_DOWEL:
        if (!validatePlacingOfDowelData(placingOfDowelData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          placingOfDowelData: placingOfDowelData,
        };
        break;
      case TASK_TYPES.COMPACTION:
        if (!validateCompactionData(compactionData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          compactionData: compactionData,
        };
        break;
      case TASK_TYPES.PLACING_OF_FILLER_BOARD:
        if (!validatePlacingOfFillerBoardData(placingOfFillerBoardData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          placingOfFillerBoardData: placingOfFillerBoardData,
        };
        break;
      case TASK_TYPES.SEALANT_FILING:
        if (!validateSealantFilingData(sealantFilingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          sealantFilingData: sealantFilingData,
        };
        break;
      case TASK_TYPES.MILLING_OF_FLEXIBLE_PAVEMENT:
        if (!validateMillingData(millingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          millingData: millingData,
        };
        break;
      case TASK_TYPES.LAYING_OF_SEPARATION_MEMBRANE:
        if (
          !validateLayingOfSeparationMembraneData(
            layingOfSeparationMembraneData,
          )
        ) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          layingOfSeparationMembraneData: layingOfSeparationMembraneData,
        };
        break;
      case TASK_TYPES.LAYING_OF_PAVEMENT_QUALITY_CONCRETE:
        if (!validateLayingOfPQCData(layingOfPQCData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          layingOfPQCData: layingOfPQCData,
        };
        break;
      case TASK_TYPES.BACKFILLING:
        if (!validateBackfillingData(backfillingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          backfillingData: backfillingData,
        };
        break;
      case TASK_TYPES.BRICKS_WORK:
        if (!validateBricksWorkData(bricksWorkData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          bricksWorkData: bricksWorkData,
        };
        break;
      case TASK_TYPES.CUTTING_OF_SOIL:
        if (!validateCuttingOfSoilData(cuttingOfSoilData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          cuttingOfSoilData: cuttingOfSoilData,
        };
        break;
      case TASK_TYPES.FIXING_GEO_CELL:
        if (!validateFixingGeoCellData(fixingGeoCellData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingGeoCellData: fixingGeoCellData,
        };
        break;
      case TASK_TYPES.FIXING_OF_MESH:
        if (!validateFixingOfMeshData(fixingOfMeshData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfMeshData: fixingOfMeshData,
        };
        break;
      case TASK_TYPES.LAYING_OF_GRASS_TURF:
        if (!validateLayingOfGrassTurfData(layingOfGrassTurfData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          layingOfGrassTurfData: layingOfGrassTurfData,
        };
        break;
      case TASK_TYPES.LAYING_OF_TOP_SOIL:
        if (!validateLayingOfTopSoilData(layingOfTopSoilData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          layingOfTopSoilData: layingOfTopSoilData,
        };
        break;
      case TASK_TYPES.PLACING_AND_JOINTING_OF_CHUTE_MEMBERS:
        if (!validateChuteMembersData(chuteMembersData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          chuteMembersData: chuteMembersData,
        };
        break;
      case TASK_TYPES.PIT_EXCAVATION:
        checkList = {
          taskName: selectedTask.name,
          pitExcavationData: pitExcavationData,
        };
        break;
      case TASK_TYPES.PLANTING_GRASS:
        if (!validatePlantingGrassData(plantingGrassData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          plantingGrassData: plantingGrassData,
        };
        break;
      case TASK_TYPES.PLANTING_TREES:
        if (!validatePlantingTreesData(plantingTreesData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          plantingTreesData: plantingTreesData,
        };
        break;
      case TASK_TYPES.PREPARATION_OF_SOIL:
        if (!validatePreparationOfSoilData(preparationOfSoilData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          preparationOfSoilData: preparationOfSoilData,
        };
        break;
      case TASK_TYPES.SPREADING_OF_GRASS_SEEDS:
        checkList = {
          taskName: selectedTask.name,
          spreadingOfGrassSeedsData: spreadingOfGrassSeedsData,
        };
        break;
      case TASK_TYPES.WATERING:
        if (!validateWateringData(wateringData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          wateringData: wateringData,
        };
        break;
      case TASK_TYPES.PLANTATION:
        if (!validatePlantationData(plantationData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          plantationData: plantationData,
        };
        break;
      case TASK_TYPES.STONE_PITCHING:
        if (!validateStonePitchingData(stonePitchingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          stonePitchingData: stonePitchingData,
        };
        break;
      case TASK_TYPES.FIXING_INVERTER_INSTALLATION:
        if (!validateInverterInstallationData(inverterInstallationData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          inverterInstallationData: inverterInstallationData,
        };
        break;
      case TASK_TYPES.ERECTION_OF_DOUBLE_POLE_STRUCTURE:
        if (
          !validateErectionOfDoublePoleStructureData(
            erectionOfDoublePoleStructureData,
          )
        ) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          erectionOfDoublePoleStructureData: erectionOfDoublePoleStructureData,
        };
        break;
      case TASK_TYPES.FIXING_OF_MC4_Y_CONNECTOR:
        if (!validateFixingOfMC4Data(fixingOfMC4Data)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfMC4Data: fixingOfMC4Data,
        };
        break;
      case TASK_TYPES.FIXING_OF_MMS:
        if (!validateFixingOfMMSData(fixingOfMMSData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfMMSData: fixingOfMMSData,
        };
        break;
      case TASK_TYPES.FIXING_OF_MODULES:
        if (!validateFixingOfModulesData(fixingOfModulesData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfModulesData: fixingOfModulesData,
        };
        break;
      case TASK_TYPES.LAYING_OF_CAUTION_TAPE:
        if (!validateLayingCautionTapeData(layingCautionTapeData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          layingCautionTapeData: layingCautionTapeData,
        };
        break;
      case TASK_TYPES.ROUTE_MARKING:
        if (!validateRouteMarkingData(routeMarkingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          routeMarkingData: routeMarkingData,
        };
        break;
      case TASK_TYPES.BRICKS_LAYERING:
        if (!validateBricksLayeringData(bricksLayeringData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          bricksLayeringData: bricksLayeringData,
        };
        break;
      case TASK_TYPES.CABLE_DRESSING:
        checkList = {
          taskName: selectedTask.name,
          cableDressingData: cableDressingData,
        };
        break;
      case TASK_TYPES.CABLE_TRENCH_DRESSING:
        if (!validateCableTrenchDressingData(cableTrenchDressingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          cableTrenchDressingData: cableTrenchDressingData,
        };
        break;
      case TASK_TYPES.CONDUIT_LAYING:
        if (!validateConduitLayingData(conduitLayingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          conduitLayingData: conduitLayingData,
        };
        break;
      case TASK_TYPES.CABLE_TRENCH_EXCAVATION:
        if (!validateCableTrenchExcavationData(cableTrenchExcavationData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          cableTrenchExcavationData: cableTrenchExcavationData,
        };
        break;
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_LT_PANEL:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_SERVO:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_MCB:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_INVERTOR:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_HT_PANEL:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_TRANSFORMER:
        if (!validateFixingAndInstallationData(fixingAndInstallationData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingAndInstallationData: fixingAndInstallationData,
        };
        break;
      case TASK_TYPES.HT_PANEL_INSTALLATION:
        if (!validateHtPanelInstallationData(htPanelInstallationData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          htPanelInstallationData: htPanelInstallationData,
        };
        break;
      case TASK_TYPES.ERECTION_OF_STRUCTURE:
        checkList = {
          taskName: selectedTask.name,
          erectionOfStructureData: erectionOfStructureData,
        };
        break;
      case TASK_TYPES.FABRICATION_OF_STRUCTURE:
        checkList = {
          taskName: selectedTask.name,
          fabricationOfStructureData: fabricationOfStructureData,
        };
        break;
      case TASK_TYPES.FIXING_OF_PANELS:
        if (!validateFixingOfPanelsData(fixingOfPanelsData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfPanelsData: fixingOfPanelsData,
        };
        break;
      case TASK_TYPES.ERECTION_OF_PRECAST_COLUMN:
        if (!validateErectionPreCastColumnData(erectionPreCastColumnData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          erectionPreCastColumnData: erectionPreCastColumnData,
        };
        break;
      case TASK_TYPES.ERECTION_OF_BUS_SHELTER:
        if (!validateErectionOfBusShelterData(erectionOfBusShelterData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          erectionOfBusShelterData: erectionOfBusShelterData,
        };
        break;
      case TASK_TYPES.ERECTION_OF_ANGLE_SECTION:
        if (!validateErectionOfAngleSectionData(erectionOfAngleSectionData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          erectionOfAngleSectionData: erectionOfAngleSectionData,
        };
        break;
      case TASK_TYPES.PLACING_OF_PRE_CAST_RCC_PANELS:
        if (!validatePreCastRccPanelData(preCastRccPanelData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          preCastRccPanelData: preCastRccPanelData,
        };
        break;
      case TASK_TYPES.PLACING_OF_CHAIN_LINK:
        if (!validatePlacingChainLinkData(placingChainLinkData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          placingChainLinkData: placingChainLinkData,
        };
        break;
      case TASK_TYPES.MORTAR_CHECKLIST:
        if (!validateMortarChecklistData(mortarChecklistData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          mortarChecklistData: mortarChecklistData,
        };
        break;
      case TASK_TYPES.FLOORING:
        if (!validateFlooringData(flooringData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          flooringData: flooringData,
        };
        break;
      case TASK_TYPES.SIGNAGE_LOCATION_IDENTIFICATION:
        checkList = {
          taskName: selectedTask.name,
          signageLocationData: signageLocationData,
        };
        break;
      case TASK_TYPES.BACKFILL:
        if (!validateBackfillData(backfillData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          backfillData: backfillData,
        };
        break;
      case TASK_TYPES.PLACEMENT_OF_SIGNAGE_SHEET:
        if (!validatePlacementOfSignageSheetData(placementOfSignageSheetData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          placementOfSignageSheetData: placementOfSignageSheetData,
        };
        break;
      case TASK_TYPES.FIXING_OF_TRAFFIC_IMPACT_ATTENUATORS:
        if (
          !validateTrafficImpactAttenuatorsData(trafficImpactAttenuatorsData)
        ) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          trafficImpactAttenuatorsData: trafficImpactAttenuatorsData,
        };
        break;
      case TASK_TYPES.FIXING_OF_SPRING_POST:
        if (!validateFixingOfSpringPostData(fixingOfSpringPostData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfSpringPostData: fixingOfSpringPostData,
        };
        break;
      case TASK_TYPES.FIXING_OF_SOLAR_ROAD_STUDS:
        if (!validateFixingOfSolarRoadStudsData(fixingOfSolarRoadStudsData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfSolarRoadStudsData: fixingOfSolarRoadStudsData,
        };
        break;
      case TASK_TYPES.FIXING_OF_SOLAR_BLINKERS:
        if (!validateFixingOfSolarBlinkersData(fixingOfSolarBlinkersData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfSolarBlinkersData: fixingOfSolarBlinkersData,
        };
        break;
      case TASK_TYPES.FIXING_OF_ROAD_STUDS:
        if (!validateFixingOfRoadStudsData(fixingOfRoadStudsData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfRoadStudsData: fixingOfRoadStudsData,
        };
        break;
      case TASK_TYPES.FIXING_OF_ROAD_DELINEATORS:
        if (!validateFixingOfRoadDelineatorsData(fixingOfRoadDelineatorsData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfRoadDelineatorsData: fixingOfRoadDelineatorsData,
        };
        break;
      case TASK_TYPES.FIXING_OF_OBJECT_MARKERS:
        if (!validateFixingOfObjectMarkersData(fixingOfObjectMarkersData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfObjectMarkersData: fixingOfObjectMarkersData,
        };
        break;
      case TASK_TYPES.FIXING_OF_NOISE_BARRIER:
        if (!validateFixingOfNoiseBarrierData(fixingOfNoiseBarrierData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfNoiseBarrierData: fixingOfNoiseBarrierData,
        };
        break;
      case TASK_TYPES.FIXING_OF_LED_TRAFFIC_BLINKERS:
        if (
          !validateFixingOfLEDTrafficBlinkersData(
            fixingOfLEDTrafficBlinkersData,
          )
        ) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfLEDTrafficBlinkersData: fixingOfLEDTrafficBlinkersData,
        };
        break;
      case TASK_TYPES.FIXING_OF_HAZARD_MARKERS:
        if (!validateFixingOfHazardMarkersData(fixingOfHazardMarkersData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfHazardMarkersData: fixingOfHazardMarkersData,
        };
        break;
      case TASK_TYPES.FIXING_OF_FLEXIBLE_MEDIAN_MARKERS:
        if (
          !validateFixingOfFlexibleMedianMarkersData(
            fixingOfFlexibleMedianMarkersData,
          )
        ) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfFlexibleMedianMarkersData: fixingOfFlexibleMedianMarkersData,
        };
        break;
      case TASK_TYPES.FIXING_OF_CONVEX_MIRRORS:
        if (!validateFixingOfConvexMirrorsData(fixingOfConvexMirrorsData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfConvexMirrorsData: fixingOfConvexMirrorsData,
        };
        break;
      case TASK_TYPES.FIXING_OF_ANTIGLARES:
        if (!validateFixingOfAntiglaresData(fixingOfAntiglaresData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfAntiglaresData: fixingOfAntiglaresData,
        };
        break;
      case TASK_TYPES.ERECTION_OF_POLES:
        if (!validateErectionOfPolesData(erectionOfPolesData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          erectionOfPolesData: erectionOfPolesData,
        };
        break;
      case TASK_TYPES.FIXING_OF_ARMS:
        if (!validateFixingOfArmsData(fixingOfArmsData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfArmsData: fixingOfArmsData,
        };
        break;
      case TASK_TYPES.INSTALLATION_OF_LED_LIGHTS:
        if (!validateInstallationOfLEDLightsData(installationOfLEDLightsData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          installationOfLEDLightsData: installationOfLEDLightsData,
        };
        break;
      case TASK_TYPES.LAYING_OF_FLEXIBLE_CABLE:
        if (!validateLayingOfFlexibleCableData(layingOfFlexibleCableData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          layingOfFlexibleCableData: layingOfFlexibleCableData,
        };
        break;
      case TASK_TYPES.LAYING_OF_LT_CABLE:
        if (!validateLayingOfLTCableData(layingOfLTCableData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          layingOfLTCableData: layingOfLTCableData,
        };
        break;
      case TASK_TYPES.FIXING_OF_STONE:
        if (!validateFixingOfStoneData(fixingOfStoneData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          fixingOfStoneData: fixingOfStoneData,
        };
        break;
      case TASK_TYPES.PLASTERING:
        if (!validatePlasteringData(plasteringData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          plasteringData: plasteringData,
        };
        break;
      case TASK_TYPES.PUTTY:
        if (!validatePuttyData(puttyData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          puttyData: puttyData,
        };
        break;
      case TASK_TYPES.HVAC_WORK:
        if (!validateHvacWorkData(hvacWorkData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          hvacWorkData: hvacWorkData,
        };
        break;
      case TASK_TYPES.CEILING_WORK:
        if (!validateCeilingWorkData(ceilingWorkData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          ceilingWorkData: ceilingWorkData,
        };
        break;
      case TASK_TYPES.FURNITURE_WORK:
        checkList = {
          taskName: selectedTask.name,
          furnitureWorkData: furnitureWorkData,
        };
        break;
      case TASK_TYPES.DOOR_WORKS:
        checkList = {
          taskName: selectedTask.name,
          doorWorksData: doorWorksData,
        };
        break;
      case TASK_TYPES.WINDOW_WORKS:
        checkList = {
          taskName: selectedTask.name,
          windowWorksData: windowWorksData,
        };
        break;
      case TASK_TYPES.GLASS_WORKS:
        if (!validateGlassWorksData(glassWorksData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          glassWorksData: glassWorksData,
        };
        break;

      case TASK_TYPES.LIFTING_TRANSPORT_ERECTION:
      case TASK_TYPES.LIFTING_LEFT:
      case TASK_TYPES.LIFTING_YARD:
      case TASK_TYPES.LIFTING_RIGHT:
        checkList = {
          taskName: selectedTask.name,
          liftingCombinedLRData: liftingCombinedLRData,
        };
        break;
      case TASK_TYPES.REMOVAL_OF_FORMWORK:
        checkList = {
          taskName: selectedTask.name,
          removalFormworkData: removalFormworkData,
        };
        break;
      case TASK_TYPES.FABRICATION_OF_BUS_SHELTER:
      case TASK_TYPES.FABRICATION_OF_MEMBERS:
      case TASK_TYPES.FABRICATION_OF_STEEL_GIRDERS:
        checkList = {
          taskName: selectedTask.name,
          fabricationData: fabricationData,
        };
        break;

      case TASK_TYPES.TEMPORARY_PRESTRESSING:
        if (!validateTemporaryPrestressingData(temporaryPrestressingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          temporaryPrestressingData: temporaryPrestressingData,
        };
        break;
      case TASK_TYPES.PRE_STRESSING:
        if (!validatePrestressingData(prestressingData)) {
          return;
        }
        checkList = {
          taskName: selectedTask.name,
          prestressingData: prestressingData,
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
  const onAddMoreTorquing = () => {
    setTorquingData([
      ...torquingData,
      {
        date: '',
        time: '',
        component: '',
        detailsOfJoints: '',
        nosOfBolt: 0,
        diaOfBoltInMm: 0,
        sizeInMm: 0,
        slNoOfInvoiceMTCFile: '',
        slNoOfTorqueWrench: '',
        torqueApplied: 0,
        refusalsGauage3nos: 'Y',
        refusalsGauage4nos: 'Y',
        refusalsGauage5nos: 'Y',
        refusalsGauage6nos: 'Y',
        key: Guid.create(),
      },
    ]);
  };
  const onAddMoreDumping = () => {
    setDumpingData([
      ...dumpingData,
      {
        vehicleNo: '',
        source: 'Y',
        qtyDumped: 0,
        approvedSource: '',
        bouldersPresent: 'Y',
        key: Guid.create(),
      },
    ]);
  };

  // const onAddMoreGlueing = () => {
  //   setGlueingData([
  //     ...glueingData,
  //     {
  //       jointNumbers: '',
  //       ambientTemperature: 0,
  //       batchNoResin: 0,
  //       batchNoHardener: 0,
  //       mixingStartTime: '',
  //       mixingFinishTime: '',
  //       applicationStartTime: '',
  //       applicationFinishTime: '',
  //       segmentJoiningTimeClosure: '',
  //       segmentJoiningTimeTemporaryFinish: '',
  //       segmentSurfaceArea: 0,
  //       epoxyConsumptionTheoreticalResin: 0,
  //       epoxyConsumptionTheoreticalHardener: 0,
  //       epoxyConsumptionActualResin: 0,
  //       epoxyConsumptionActualHardener: 0,
  //       key: Guid.create(),
  //     },
  //   ]);
  // };
  const {showSnackbar} = useSnackbar();
  const renderGlueingHeadings = () => (
    <View style={styles.rowContainer}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Joint No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Ambient Temp (°C)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Batch No Resin</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Batch No Hardener</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Mixing Start Time</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Mixing Finish Time</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Application Start Time</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Application Finish Time</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Segment Joining Time Closure</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          Segment Joining Time Temporary PT Finish
        </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Segment Surface Area (SQM)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          Epoxy Consumption Theoretical Resin (Kgs)
        </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          Epoxy Consumption Theoretical Hardener (Kgs)
        </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          Epoxy Consumption Actual Resin (Kgs)
        </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          Epoxy Consumption Actual Hardener (Kgs)
        </Text>
      </View>
    </View>
  );
  const renderTemporaryPrestressingHeadings = () => (
    <View style={styles.rowContainer}>
      {/* <View style={[styles.cell, {width: 50}]}>
        <Text style={styles.cellText}>TM No.</Text>
      </View> */}
      <View style={styles.cell}>
        <Text style={styles.cellText}>Joint No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Calibration Done</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Stressing Sequence Drawing No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Date of Prestressing</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Time of Prestressing</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Max Jack Pressure (Kg/Cm²)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Jack Pressure Applied (Kg/Cm²)</Text>
      </View>
      {/* <View style={[styles.cell, {paddingHorizontal: 40}]}>
        <Text style={styles.cellText}>Actions</Text>
      </View> */}
    </View>
  );
  const renderItemTemporaryPrestressing = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={styles.cell}>
        {/* <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'jointNumbers'}
          index={rowData.index}
          onChange={
            handleTextInputChangeTemporaryPrestressing
          }></CustomTextInputValue> */}
        <Text style={styles.cellText}>{rowData.item['jointNumbers']}</Text>
      </View>

      <View style={styles.cell}>
        {/* <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'calibrationDone'}
          index={rowData.index}
          onChange={
            handleTextInputChangeTemporaryPrestressing
          }></CustomTextInputValue> */}

        <DropdownPicker
          label=""
          value={rowData.item.calibrationDone}
          items={YES_NO_NA_LIST}
          style={styles.marginBootomZero}
          onChange={(newValue: string) => {
            const newData = [...temporaryPrestressingData];
            newData[rowData.index]['calibrationDone'] = newValue;
            setTemporaryPrestressingData(newData);
          }}
          isRequired={true}
        />
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'stressingSequenceDrawingNumber'}
          index={rowData.index}
          onChange={
            handleTextInputChangeTemporaryPrestressing
          }></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CalendarPicker
          label=""
          value={rowData.item.dateOfPrestressing}
          onChange={date =>
            handleTextInputChangeTemporaryPrestressing(
              rowData.index,
              'dateOfPrestressing',
              date,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.timeOfPrestressing}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTextInputChangeTemporaryPrestressing(
              rowData.index,
              'timeOfPrestressing',
              time,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'maxJackPressure'}
          index={rowData.index}
          onChange={
            handleTextInputChangeTemporaryPrestressing
          }></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'jackPressureApplied'}
          index={rowData.index}
          onChange={
            handleTextInputChangeTemporaryPrestressing
          }></CustomTextInputValue>
      </View>

      {/* <View style={[styles.cell, {paddingHorizontal: 45}]}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() =>
            deleteTemporaryPrestressingItem(rowData, rowData.item.key)
          }>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('./../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );

  const renderItemTorquing = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={[styles.cell, {width: 50}]}>
        <Text style={styles.cellText}>TM {rowData.index + 1}</Text>
      </View>

      <View style={styles.cell}>
        <CalendarPicker
          label=""
          value={rowData.item.date}
          onChange={date =>
            handleTextInputChangeTorquing(rowData.index, 'date', date)
          }
        />
      </View>
      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.date}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTextInputChangeTorquing(rowData.index, 'time', time)
          }
        />
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'component'}
          index={rowData.index}
          onChange={handleTextInputChangeTorquing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'detailsOfJoints'}
          index={rowData.index}
          onChange={handleTextInputChangeTorquing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'nosOfBolt'}
          index={rowData.index}
          onChange={handleTextInputChangeTorquing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'diaOfBoltInMm'}
          index={rowData.index}
          onChange={handleTextInputChangeTorquing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'sizeInMm'}
          index={rowData.index}
          onChange={handleTextInputChangeTorquing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'slNoOfInvoiceMTCFile'}
          index={rowData.index}
          onChange={handleTextInputChangeTorquing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'slNoOfTorqueWrench'}
          index={rowData.index}
          onChange={handleTextInputChangeTorquing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'torqueApplied'}
          index={rowData.index}
          onChange={handleTextInputChangeTorquing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <Text>{rowData.item.refusalsGauage3nos}</Text>
      </View>

      <View style={styles.cell}>
        <Text>{rowData.item.refusalsGauage4nos}</Text>
      </View>

      <View style={styles.cell}>
        <Text>{rowData.item.refusalsGauage5nos}</Text>
      </View>

      <View style={styles.cell}>
        <Text>{rowData.item.refusalsGauage6nos}</Text>
      </View>

      <View style={[styles.cell, {paddingHorizontal: 45}]}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => deleteTorquingItem(rowData, rowData.item.key)}>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('./../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTorquingHeadings = () => (
    <View style={styles.rowContainer}>
      <View style={[styles.cell, {width: 50}]}>
        <Text style={styles.cellText}>Date</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Time</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Component</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Details of Joints</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Nos of Bolt</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Dia of Bolt (mm)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Size (mm)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Invoice/MTC File No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Torque Wrench Sl. No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Torque Applied</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Refusals (Gauage 3nos)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Refusals (Gauage 4nos)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Refusals (Gauage 5nos)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Refusals (Gauage 6nos)</Text>
      </View>
      <View style={[styles.cell, {paddingHorizontal: 40}]}>
        <Text style={styles.cellText}>Actions</Text>
      </View>
    </View>
  );
  const handleTextInputChangeTorquing = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedData = [...torquingData];
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'component':
      case 'detailsOfJoints':
        if (value.length > 20) {
          isValid = false;
          errorMessage = `${field} cannot exceed 20 characters`;
        }
        break;

      case 'nosOfBolt':
        const nosOfBolt = parseInt(value);
        if (isNaN(nosOfBolt) || nosOfBolt <= 0 || nosOfBolt > 1000000) {
          isValid = false;
          errorMessage =
            'Enter a positive integer up to 10 lakh for Nos of Bolt';
        }
        break;

      case 'diaOfBoltInMm':
      case 'sizeInMm':
        const sizeValue = parseFloat(value);
        if (
          isNaN(sizeValue) ||
          sizeValue <= 0 ||
          sizeValue > 100 ||
          value.split('.')[1]?.length > 2
        ) {
          isValid = false;
          errorMessage =
            'Enter a size value greater than 0 and up to 100 mm with up to 2 decimal places';
        }
        break;

      case 'slNoOfInvoiceMTCFile':
      case 'slNoOfTorqueWrench':
        if (value.length > 50) {
          isValid = false;
          errorMessage = `${field} cannot exceed 50 characters`;
        }
        break;

      case 'torqueApplied':
        const torqueApplied = parseFloat(value);
        if (
          isNaN(torqueApplied) ||
          torqueApplied <= 0 ||
          torqueApplied > 1000000 ||
          value.split('.')[1]?.length > 2
        ) {
          isValid = false;
          errorMessage =
            'Enter a torque value greater than 0 and up to 10 lakh with up to 2 decimal places';
        }
        break;

      default:
        break;
    }

    if (isValid) {
      updatedData[index][field] = value;
      setTorquingData(updatedData);
    } else {
      updatedData[index][field] = value;
      setTorquingData(updatedData);
      showSnackbar(errorMessage, 'error');
    }
  };
  const validateTorquingData = (torquingData: any): boolean => {
    for (const item of torquingData) {
      // Parsing values to float
      const nosOfBolt = parseFloat(item.nosOfBolt);
      const diaOfBoltInMm = parseFloat(item.diaOfBoltInMm);
      const sizeInMm = parseFloat(item.sizeInMm);
      const torqueApplied = parseFloat(item.torqueApplied);

      // Validation checks
      if (!item.date || !item.time) {
        showSnackbar('Please select a date and Time for Torquing', 'error');
        return false;
      }

      if (!item.component || item.component.length > 20) {
        showSnackbar(
          'Please enter a valid component (max 20 characters)',
          'error',
        );
        return false;
      }

      if (!item.detailsOfJoints || item.detailsOfJoints.length > 20) {
        showSnackbar(
          'Please enter valid details of joints (max 20 characters)',
          'error',
        );
        return false;
      }

      if (isNaN(nosOfBolt) || nosOfBolt <= 0 || nosOfBolt > 1000000) {
        showSnackbar('Please enter a valid number of bolts', 'error');
        return false;
      }

      if (
        isNaN(diaOfBoltInMm) ||
        diaOfBoltInMm <= 0 ||
        diaOfBoltInMm > 100 ||
        item.diaOfBoltInMm.split('.')[1]?.length > 2
      ) {
        showSnackbar('Please enter a valid diameter of bolt (mm)', 'error');
        return false;
      }

      if (
        isNaN(sizeInMm) ||
        sizeInMm <= 0 ||
        sizeInMm > 100 ||
        item.sizeInMm.split('.')[1]?.length > 2
      ) {
        showSnackbar('Please enter a valid size (mm)', 'error');
        return false;
      }

      if (!item.slNoOfInvoiceMTCFile || item.slNoOfInvoiceMTCFile.length > 50) {
        showSnackbar(
          'Please enter a valid Invoice/MTC file number (max 50 characters)',
          'error',
        );
        return false;
      }

      if (!item.slNoOfTorqueWrench || item.slNoOfTorqueWrench.length > 50) {
        showSnackbar(
          'Please enter a valid Torque Wrench Sl. No. (max 50 characters)',
          'error',
        );
        return false;
      }

      if (
        isNaN(torqueApplied) ||
        torqueApplied <= 0 ||
        torqueApplied > 1000000 ||
        item.torqueApplied.split('.')[1]?.length > 2
      ) {
        showSnackbar('Please enter a valid torque applied value', 'error');
        return false;
      }
    }

    // Convert the values back to numbers after validation
    torquingData.forEach((item: any) => {
      item.nosOfBolt = Number(item.nosOfBolt);
      item.diaOfBoltInMm = Number(item.diaOfBoltInMm);
      item.sizeInMm = Number(item.sizeInMm);
      item.torqueApplied = Number(item.torqueApplied);
    });

    return true;
  };
  const validateGlassWorksData = (glassWorksData: any): boolean => {
    const totalGlassWorkCompletedSqft = parseFloat(
      glassWorksData.totalGlassWorkCompletedSqft,
    );

    // Validation for totalGlassWorkCompletedSqft
    if (
      isNaN(totalGlassWorkCompletedSqft) ||
      totalGlassWorkCompletedSqft <= 0 ||
      totalGlassWorkCompletedSqft > 10000 ||
      glassWorksData.totalGlassWorkCompletedSqft.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total glass work completed (sqft, > 0, max 3 decimal places, and <= 10000)',
        'error',
      );
      return false;
    }

    // Convert value back to a number after validation
    glassWorksData.totalGlassWorkCompletedSqft = Number(
      glassWorksData.totalGlassWorkCompletedSqft,
    );

    return true;
  };

  const validateCeilingWorkData = (ceilingWorkData: any): boolean => {
    const totalSqftAreaCompleted = parseFloat(
      ceilingWorkData.totalSqftAreaCompleted,
    );

    // Validation for totalSqftAreaCompleted
    if (
      isNaN(totalSqftAreaCompleted) ||
      totalSqftAreaCompleted <= 0 ||
      totalSqftAreaCompleted > 100000 ||
      ceilingWorkData.totalSqftAreaCompleted.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total sqft area (max 3 decimal places, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    // Converting value back to number after validation
    ceilingWorkData.totalSqftAreaCompleted = Number(
      ceilingWorkData.totalSqftAreaCompleted,
    );

    return true;
  };

  const validateHvacWorkData = (hvacWorkData: any): boolean => {
    const totalSqftAreaCovered = parseFloat(hvacWorkData.totalSqftAreaCovered);

    // Validation for totalSqftAreaCovered
    if (
      isNaN(totalSqftAreaCovered) ||
      totalSqftAreaCovered <= 0 ||
      totalSqftAreaCovered > 100000 ||
      hvacWorkData.totalSqftAreaCovered.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total area covered (max 3 decimal places, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    // Converting values back to numbers after validation
    hvacWorkData.totalSqftAreaCovered = Number(
      hvacWorkData.totalSqftAreaCovered,
    );

    return true;
  };

  const validatePuttyData = (puttyData: any) => {
    const totalPuttyWorkSqft = parseFloat(puttyData.totalPuttyWorkSqft);

    // Validation for totalPuttyWorkSqft
    if (
      isNaN(totalPuttyWorkSqft) ||
      totalPuttyWorkSqft <= 0 ||
      totalPuttyWorkSqft > 100000 ||
      puttyData.totalPuttyWorkSqft.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total putty work in sqft (max 3 decimal places, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    // Convert value back to number after validation
    puttyData.totalPuttyWorkSqft = Number(puttyData.totalPuttyWorkSqft);

    return true;
  };

  const validatePlasteringData = (plasteringData: any): boolean => {
    const totalPlasteringWorkSqft = parseFloat(
      plasteringData.totalPlasteringWorkSqft,
    );

    // Validation for totalPlasteringWorkSqft
    if (
      isNaN(totalPlasteringWorkSqft) ||
      totalPlasteringWorkSqft <= 0 ||
      totalPlasteringWorkSqft > 100000 ||
      plasteringData.totalPlasteringWorkSqft.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total plastering work (sqft, max 3 decimal places, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    // Convert the value back to a number after validation
    plasteringData.totalPlasteringWorkSqft = Number(
      plasteringData.totalPlasteringWorkSqft,
    );

    return true;
  };

  const validateFixingOfStoneData = (fixingOfStoneData: any) => {
    const totalStonesInstalled = parseInt(
      fixingOfStoneData.totalStonesInstalled,
    );
    const totalLengthCoveredKm = parseFloat(
      fixingOfStoneData.totalLengthCoveredKm,
    );

    // Validation for totalStonesInstalled
    if (
      isNaN(totalStonesInstalled) ||
      totalStonesInstalled <= 0 ||
      totalStonesInstalled > 100000
    ) {
      showSnackbar(
        'Please enter a valid number of stones installed (integer, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    // Validation for totalLengthCoveredKm
    if (
      isNaN(totalLengthCoveredKm) ||
      totalLengthCoveredKm <= 0 ||
      totalLengthCoveredKm > 100 ||
      fixingOfStoneData.totalLengthCoveredKm.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length covered (Km, max 3 decimal places, > 0 and <= 100)',
        'error',
      );
      return false;
    }

    // Convert values to numbers after validation
    fixingOfStoneData.totalStonesInstalled = Number(
      fixingOfStoneData.totalStonesInstalled,
    );
    fixingOfStoneData.totalLengthCoveredKm = Number(
      fixingOfStoneData.totalLengthCoveredKm,
    );

    return true;
  };

  const validateFixingOfMC4Data = (fixingOfMC4Data: any): boolean => {
    const totalYConnectorsUsed = parseInt(
      fixingOfMC4Data.totalYConnectorsUsed,
      10,
    );

    // Validation for totalYConnectorsUsed
    if (
      isNaN(totalYConnectorsUsed) ||
      totalYConnectorsUsed <= 0 ||
      totalYConnectorsUsed > 100000
    ) {
      showSnackbar(
        'Please enter a valid Total no. of Y connectors used. It should be a positive integer and <= 100000',
        'error',
      );
      return false;
    }

    fixingOfMC4Data.totalYConnectorsUsed = totalYConnectorsUsed;
    return true;
  };
  const validateLayingOfLTCableData = (layingOfLTCableData: any) => {
    const totalCableLengthRM = parseFloat(
      layingOfLTCableData.totalCableLengthRM,
    );
    const totalHighwayLengthKm = parseFloat(
      layingOfLTCableData.totalHighwayLengthKm,
    );

    if (
      isNaN(totalCableLengthRM) ||
      totalCableLengthRM <= 0 ||
      totalCableLengthRM > 100000 ||
      layingOfLTCableData.totalCableLengthRM.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid cable length (RM, max 3 decimal places, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalHighwayLengthKm) ||
      totalHighwayLengthKm <= 0 ||
      totalHighwayLengthKm > 100 ||
      layingOfLTCableData.totalHighwayLengthKm.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid highway length (Km, max 3 decimal places, > 0 and <= 100)',
        'error',
      );
      return false;
    }

    layingOfLTCableData.totalCableLengthRM = Number(totalCableLengthRM);
    layingOfLTCableData.totalHighwayLengthKm = Number(totalHighwayLengthKm);

    return true;
  };

  const validateLayingOfFlexibleCableData = (
    layingOfFlexibleCableData: any,
  ) => {
    const totalCableLengthRM = parseFloat(
      layingOfFlexibleCableData.totalCableLengthRM,
    );
    const totalHighwayLengthKm = parseFloat(
      layingOfFlexibleCableData.totalHighwayLengthKm,
    );

    // Validation for totalCableLengthRM
    if (
      isNaN(totalCableLengthRM) ||
      totalCableLengthRM <= 0 ||
      totalCableLengthRM > 100000 ||
      layingOfFlexibleCableData.totalCableLengthRM.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total cable length (RM, max 3 decimal places, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    // Validation for totalHighwayLengthKm
    if (
      isNaN(totalHighwayLengthKm) ||
      totalHighwayLengthKm <= 0 ||
      totalHighwayLengthKm > 100 ||
      layingOfFlexibleCableData.totalHighwayLengthKm.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total highway length (Km, max 3 decimal places, > 0 and <= 100)',
        'error',
      );
      return false;
    }

    // Converting values back to numbers after validation
    layingOfFlexibleCableData.totalCableLengthRM = Number(totalCableLengthRM);
    layingOfFlexibleCableData.totalHighwayLengthKm =
      Number(totalHighwayLengthKm);

    return true;
  };

  const validateInstallationOfLEDLightsData = (
    installationOfLEDLightsData: any,
  ): boolean => {
    const totalQtyOfLightsInstalled = parseInt(
      installationOfLEDLightsData.totalQtyOfLightsInstalled,
    );
    const totalLengthOfHighwayCoveredKm = parseFloat(
      installationOfLEDLightsData.totalLengthOfHighwayCoveredKm,
    );

    // Validation for totalQtyOfLightsInstalled
    if (
      isNaN(totalQtyOfLightsInstalled) ||
      totalQtyOfLightsInstalled <= 0 ||
      totalQtyOfLightsInstalled > 100000
    ) {
      showSnackbar(
        'Please enter a valid total quantity of lights installed (integer, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    // Validation for totalLengthOfHighwayCoveredKm
    if (
      isNaN(totalLengthOfHighwayCoveredKm) ||
      totalLengthOfHighwayCoveredKm <= 0 ||
      totalLengthOfHighwayCoveredKm > 100 ||
      installationOfLEDLightsData.totalLengthOfHighwayCoveredKm.split('.')[1]
        ?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length covered (Km, max 3 decimal places, > 0 and <= 100)',
        'error',
      );
      return false;
    }

    return true;
  };

  const validateFixingOfArmsData = (fixingOfArmsData: any) => {
    const totalQtyArmsErected = parseInt(fixingOfArmsData.totalQtyArmsErected);
    const totalHighwayLengthCoveredKm = parseFloat(
      fixingOfArmsData.totalHighwayLengthCoveredKm,
    );

    // Validate totalQtyArmsErected
    if (
      isNaN(totalQtyArmsErected) ||
      totalQtyArmsErected <= 0 ||
      totalQtyArmsErected > 100000
    ) {
      showSnackbar(
        'Please enter a valid number of arms erected (integer, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    // Validate totalHighwayLengthCoveredKm
    if (
      isNaN(totalHighwayLengthCoveredKm) ||
      totalHighwayLengthCoveredKm <= 0 ||
      totalHighwayLengthCoveredKm > 100 ||
      fixingOfArmsData.totalHighwayLengthCoveredKm.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length covered (Km, max 3 decimal places, > 0 and <= 100)',
        'error',
      );
      return false;
    }

    // Convert values to numbers after validation
    fixingOfArmsData.totalQtyArmsErected = Number(totalQtyArmsErected);
    fixingOfArmsData.totalHighwayLengthCoveredKm = Number(
      totalHighwayLengthCoveredKm,
    );

    return true;
  };

  const validateErectionOfPolesData = (erectionOfPolesData: any) => {
    const totalPolesErected = parseInt(erectionOfPolesData.totalPolesErected);
    const totalHighwayLengthCovered = parseFloat(
      erectionOfPolesData.totalHighwayLengthCovered,
    );

    if (
      isNaN(totalPolesErected) ||
      totalPolesErected <= 0 ||
      totalPolesErected > 100000
    ) {
      showSnackbar(
        'Please enter a valid number of poles erected (integer, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalHighwayLengthCovered) ||
      totalHighwayLengthCovered <= 0 ||
      totalHighwayLengthCovered > 100 ||
      erectionOfPolesData.totalHighwayLengthCovered.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length of highway covered (Km, max 3 decimal places, > 0 and <= 100)',
        'error',
      );
      return false;
    }

    erectionOfPolesData.totalPolesErected = Number(
      erectionOfPolesData.totalPolesErected,
    );
    erectionOfPolesData.totalHighwayLengthCovered = Number(
      erectionOfPolesData.totalHighwayLengthCovered,
    );

    return true;
  };

  const validateFixingOfAntiglaresData = (
    fixingOfAntiglaresData: any,
  ): boolean => {
    const totalAntiglaresInstalled = parseInt(
      fixingOfAntiglaresData.totalAntiglaresInstalled,
    );
    const totalLengthCoveredKm = parseFloat(
      fixingOfAntiglaresData.totalLengthCoveredKm,
    );

    // Validation for totalAntiglaresInstalled
    if (
      isNaN(totalAntiglaresInstalled) ||
      totalAntiglaresInstalled <= 0 ||
      totalAntiglaresInstalled > 1000000
    ) {
      showSnackbar(
        'Please enter a valid number of Antiglares installed (integer, > 0 and <= 1000000)',
        'error',
      );
      return false;
    }

    // Validation for totalLengthCoveredKm
    if (
      isNaN(totalLengthCoveredKm) ||
      totalLengthCoveredKm <= 0 ||
      totalLengthCoveredKm > 1000 ||
      fixingOfAntiglaresData.totalLengthCoveredKm.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length covered (Km, max 3 decimal places, > 0 and <= 1000)',
        'error',
      );
      return false;
    }

    // Converting values back to numbers after validation
    fixingOfAntiglaresData.totalAntiglaresInstalled = Number(
      fixingOfAntiglaresData.totalAntiglaresInstalled,
    );
    fixingOfAntiglaresData.totalLengthCoveredKm = Number(
      fixingOfAntiglaresData.totalLengthCoveredKm,
    );

    return true;
  };

  const validateFixingOfConvexMirrorsData = (
    fixingOfConvexMirrorsData: any,
  ): boolean => {
    const totalMirrorsInstalled = parseInt(
      fixingOfConvexMirrorsData.totalMirrorsInstalled,
    );
    const totalLengthCoveredKm = parseFloat(
      fixingOfConvexMirrorsData.totalLengthCoveredKm,
    );

    // Validation for totalMirrorsInstalled
    if (
      isNaN(totalMirrorsInstalled) ||
      totalMirrorsInstalled <= 0 ||
      totalMirrorsInstalled > 100
    ) {
      showSnackbar(
        'Please enter a valid number of mirrors installed (integer, > 0 and <= 100)',
        'error',
      );
      return false;
    }

    // Validation for totalLengthCoveredKm
    if (
      isNaN(totalLengthCoveredKm) ||
      totalLengthCoveredKm <= 0 ||
      totalLengthCoveredKm > 100 ||
      fixingOfConvexMirrorsData.totalLengthCoveredKm.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length covered (Km, max 3 decimal places, > 0 and <= 100)',
        'error',
      );
      return false;
    }

    // Converting values back to numbers after validation
    fixingOfConvexMirrorsData.totalMirrorsInstalled = Number(
      fixingOfConvexMirrorsData.totalMirrorsInstalled,
    );
    fixingOfConvexMirrorsData.totalLengthCoveredKm = Number(
      fixingOfConvexMirrorsData.totalLengthCoveredKm,
    );

    return true;
  };

  const validateFixingOfFlexibleMedianMarkersData = (
    fixingOfFlexibleMedianMarkersData: any,
  ): boolean => {
    const totalMarkersInstalled = parseInt(
      fixingOfFlexibleMedianMarkersData.totalMarkersInstalled,
    );
    const totalLengthCoveredKm = parseFloat(
      fixingOfFlexibleMedianMarkersData.totalLengthCoveredKm,
    );

    // Validation for totalMarkersInstalled
    if (
      isNaN(totalMarkersInstalled) ||
      totalMarkersInstalled <= 0 ||
      totalMarkersInstalled > 1000000
    ) {
      showSnackbar(
        'Please enter a valid number of markers installed (integer, > 0 and <= 1000000)',
        'error',
      );
      return false;
    }

    // Validation for totalLengthCoveredKm
    if (
      isNaN(totalLengthCoveredKm) ||
      totalLengthCoveredKm <= 0 ||
      totalLengthCoveredKm > 100 ||
      fixingOfFlexibleMedianMarkersData.totalLengthCoveredKm.split('.')[1]
        ?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length covered (Km, max 3 decimal places, > 0 and <= 100)',
        'error',
      );
      return false;
    }

    // Converting values back to numbers after validation
    fixingOfFlexibleMedianMarkersData.totalMarkersInstalled = Number(
      fixingOfFlexibleMedianMarkersData.totalMarkersInstalled,
    );
    fixingOfFlexibleMedianMarkersData.totalLengthCoveredKm = Number(
      fixingOfFlexibleMedianMarkersData.totalLengthCoveredKm,
    );

    return true;
  };

  const validateFixingOfHazardMarkersData = (
    fixingOfHazardMarkersData: any,
  ): boolean => {
    const totalMarkersInstalled = parseInt(
      fixingOfHazardMarkersData.totalMarkersInstalled,
    );
    const totalLengthCoveredKm = parseFloat(
      fixingOfHazardMarkersData.totalLengthCoveredKm,
    );

    // Validation for totalMarkersInstalled
    if (
      isNaN(totalMarkersInstalled) ||
      totalMarkersInstalled <= 0 ||
      totalMarkersInstalled > 100000
    ) {
      showSnackbar(
        'Please enter a valid number of hazard markers installed (integer, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    // Validation for totalLengthCoveredKm
    if (
      isNaN(totalLengthCoveredKm) ||
      totalLengthCoveredKm <= 0 ||
      totalLengthCoveredKm > 100 ||
      fixingOfHazardMarkersData.totalLengthCoveredKm.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length covered (Km, max 3 decimal places, > 0 and <= 100)',
        'error',
      );
      return false;
    }

    // Converting values back to numbers after validation
    fixingOfHazardMarkersData.totalMarkersInstalled = Number(
      fixingOfHazardMarkersData.totalMarkersInstalled,
    );
    fixingOfHazardMarkersData.totalLengthCoveredKm = Number(
      fixingOfHazardMarkersData.totalLengthCoveredKm,
    );

    return true;
  };

  const validateFixingOfLEDTrafficBlinkersData = (
    fixingOfLEDTrafficBlinkersData: any,
  ): boolean => {
    const totalBlinkersInstalled = parseInt(
      fixingOfLEDTrafficBlinkersData.totalBlinkersInstalled,
    );
    const totalHighwayLengthCovered = parseFloat(
      fixingOfLEDTrafficBlinkersData.totalHighwayLengthCovered,
    );

    // Validation for totalBlinkersInstalled
    if (
      isNaN(totalBlinkersInstalled) ||
      totalBlinkersInstalled <= 0 ||
      totalBlinkersInstalled > 10000
    ) {
      showSnackbar(
        'Please enter a valid number of blinkers installed (integer, > 0 and <= 10000)',
        'error',
      );
      return false;
    }

    // Validation for totalHighwayLengthCovered
    if (
      isNaN(totalHighwayLengthCovered) ||
      totalHighwayLengthCovered <= 0 ||
      totalHighwayLengthCovered > 100 ||
      fixingOfLEDTrafficBlinkersData.totalHighwayLengthCovered.split('.')[1]
        ?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length covered (Km, max 3 decimal places, > 0 and <= 100)',
        'error',
      );
      return false;
    }

    // Converting values back to numbers after validation
    fixingOfLEDTrafficBlinkersData.totalBlinkersInstalled = Number(
      fixingOfLEDTrafficBlinkersData.totalBlinkersInstalled,
    );
    fixingOfLEDTrafficBlinkersData.totalHighwayLengthCovered = Number(
      fixingOfLEDTrafficBlinkersData.totalHighwayLengthCovered,
    );

    return true;
  };
  const validateFixingOfNoiseBarrierData = (
    fixingOfNoiseBarrierData: any,
  ): boolean => {
    const totalNoiseBarrierPanelsInstalled = parseInt(
      fixingOfNoiseBarrierData.totalNoiseBarrierPanelsInstalled,
    );
    const totalLengthNoiseBarrierFixedRM = parseFloat(
      fixingOfNoiseBarrierData.totalLengthNoiseBarrierFixedRM,
    );

    // Validation for totalNoiseBarrierPanelsInstalled
    if (
      isNaN(totalNoiseBarrierPanelsInstalled) ||
      totalNoiseBarrierPanelsInstalled <= 0 ||
      totalNoiseBarrierPanelsInstalled > 1000000
    ) {
      showSnackbar(
        'Please enter a valid number of noise barrier panels installed (integer, > 0 and <= 1000000)',
        'error',
      );
      return false;
    }

    // Validation for totalLengthNoiseBarrierFixedRM
    if (
      isNaN(totalLengthNoiseBarrierFixedRM) ||
      totalLengthNoiseBarrierFixedRM <= 0 ||
      totalLengthNoiseBarrierFixedRM > 100000 ||
      fixingOfNoiseBarrierData.totalLengthNoiseBarrierFixedRM.split('.')[1]
        ?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length fixed (RM, max 3 decimal places, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    // Converting values back to numbers after validation
    fixingOfNoiseBarrierData.totalNoiseBarrierPanelsInstalled = Number(
      fixingOfNoiseBarrierData.totalNoiseBarrierPanelsInstalled,
    );
    fixingOfNoiseBarrierData.totalLengthNoiseBarrierFixedRM = Number(
      fixingOfNoiseBarrierData.totalLengthNoiseBarrierFixedRM,
    );

    return true;
  };
  const validateFixingOfObjectMarkersData = (
    fixingOfObjectMarkersData: any,
  ): boolean => {
    const totalMarkersInstalled = parseInt(
      fixingOfObjectMarkersData.totalMarkersInstalled,
    );
    const totalLengthCoveredKm = parseFloat(
      fixingOfObjectMarkersData.totalLengthCoveredKm,
    );

    if (
      isNaN(totalMarkersInstalled) ||
      totalMarkersInstalled <= 0 ||
      totalMarkersInstalled > 1000000
    ) {
      showSnackbar(
        'Please enter a valid number of markers installed (integer, > 0 and <= 1000000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalLengthCoveredKm) ||
      totalLengthCoveredKm <= 0 ||
      totalLengthCoveredKm > 100 ||
      fixingOfObjectMarkersData.totalLengthCoveredKm.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length covered (Km, max 3 decimal places, > 0 and <= 100)',
        'error',
      );
      return false;
    }
    fixingOfObjectMarkersData.totalMarkersInstalled = Number(
      fixingOfObjectMarkersData.totalMarkersInstalled,
    );
    fixingOfObjectMarkersData.totalLengthCoveredKm = Number(
      fixingOfObjectMarkersData.totalLengthCoveredKm,
    );

    return true;
  };

  const validateFixingOfRoadDelineatorsData = (
    fixingOfRoadDelineatorsData: any,
  ) => {
    const nosOfDelineators = parseInt(
      fixingOfRoadDelineatorsData.nosOfDelineatorsInstalled,
      10,
    );
    const totalLengthRoad = parseFloat(
      fixingOfRoadDelineatorsData.totalLengthRoadCovered,
    );

    if (
      isNaN(nosOfDelineators) ||
      nosOfDelineators <= 0 ||
      nosOfDelineators > 1000000
    ) {
      showSnackbar(
        'Please enter a valid number of Delineators installed (value should be > 0 and <= 1,000,000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalLengthRoad) ||
      totalLengthRoad <= 0 ||
      totalLengthRoad > 100
    ) {
      showSnackbar(
        'Please enter a valid Total Length of Road Covered in Km (value should be > 0 and <= 100)',
        'error',
      );
      return false;
    }

    fixingOfRoadDelineatorsData.nosOfDelineatorsInstalled = nosOfDelineators;
    fixingOfRoadDelineatorsData.totalLengthRoadCovered = totalLengthRoad;

    return true;
  };
  const validateFixingOfRoadStudsData = (
    fixingOfRoadStudsData: any,
  ): boolean => {
    const roadStudsInstalled = parseInt(
      fixingOfRoadStudsData.roadStudsInstalled,
    );
    const totalLengthCovered = parseFloat(
      fixingOfRoadStudsData.totalLengthCovered,
    );

    if (
      isNaN(roadStudsInstalled) ||
      roadStudsInstalled <= 0 ||
      roadStudsInstalled > 1000000
    ) {
      showSnackbar(
        'Please enter a valid number of road studs installed (must be > 0 and <= 1000000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalLengthCovered) ||
      totalLengthCovered <= 0 ||
      totalLengthCovered > 100 ||
      fixingOfRoadStudsData.totalLengthCovered.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length of road covered (in Km, with max 3 decimal places, must be > 0 and <= 100)',
        'error',
      );
      return false;
    }

    fixingOfRoadStudsData.roadStudsInstalled = Number(
      fixingOfRoadStudsData.roadStudsInstalled,
    );
    fixingOfRoadStudsData.totalLengthCovered = Number(
      fixingOfRoadStudsData.totalLengthCovered,
    );

    return true;
  };
  const validateFixingOfSolarBlinkersData = (
    fixingOfSolarBlinkersData: any,
  ): boolean => {
    const totalBlinkersInstalled = parseInt(
      fixingOfSolarBlinkersData.totalBlinkersInstalled,
      10,
    );
    const totalRoadLengthCovered = parseFloat(
      fixingOfSolarBlinkersData.totalRoadLengthCovered,
    );

    if (
      isNaN(totalBlinkersInstalled) ||
      totalBlinkersInstalled <= 0 ||
      totalBlinkersInstalled > 100000
    ) {
      showSnackbar(
        'Please enter a valid Total No. of Blinkers Installed (value should be > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalRoadLengthCovered) ||
      totalRoadLengthCovered <= 0 ||
      totalRoadLengthCovered > 100
    ) {
      showSnackbar(
        'Please enter a valid Total Length of Road Covered in Km (value should be > 0 and <= 100, with max 3 decimal places)',
        'error',
      );
      return false;
    }

    fixingOfSolarBlinkersData.totalBlinkersInstalled = Number(
      fixingOfSolarBlinkersData.totalBlinkersInstalled,
    );
    fixingOfSolarBlinkersData.totalRoadLengthCovered = Number(
      fixingOfSolarBlinkersData.totalRoadLengthCovered,
    );

    return true;
  };

  const validateFixingOfSolarRoadStudsData = (
    fixingOfSolarRoadStudsData: any,
  ): boolean => {
    const noOfRoadStuds = parseInt(fixingOfSolarRoadStudsData.noOfRoadStuds);
    const totalLengthCovered = parseFloat(
      fixingOfSolarRoadStudsData.totalLengthCovered,
    );

    if (isNaN(noOfRoadStuds) || noOfRoadStuds <= 0 || noOfRoadStuds > 1000000) {
      showSnackbar(
        'Please enter a valid number of road studs installed (value should be > 0 and <= 1000000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalLengthCovered) ||
      totalLengthCovered <= 0 ||
      totalLengthCovered > 100 ||
      fixingOfSolarRoadStudsData.totalLengthCovered.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length of road covered (in Km) with max 3 decimal places, value should be > 0 and <= 100',
        'error',
      );
      return false;
    }

    fixingOfSolarRoadStudsData.noOfRoadStuds = Number(
      fixingOfSolarRoadStudsData.noOfRoadStuds,
    );
    fixingOfSolarRoadStudsData.totalLengthCovered = Number(
      fixingOfSolarRoadStudsData.totalLengthCovered,
    );

    return true;
  };
  const validateFixingOfSpringPostData = (
    fixingOfSpringPostData: any,
  ): boolean => {
    const springPostInstalled = parseInt(
      fixingOfSpringPostData.springPostInstalled,
      10,
    );
    const totalRoadLengthCovered = parseFloat(
      fixingOfSpringPostData.totalRoadLengthCovered,
    );

    if (
      isNaN(springPostInstalled) ||
      springPostInstalled <= 0 ||
      springPostInstalled > 1000000
    ) {
      showSnackbar(
        'Please enter a valid number of Spring Posts installed (value should be > 0 and <= 1000000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalRoadLengthCovered) ||
      totalRoadLengthCovered <= 0 ||
      totalRoadLengthCovered > 100
    ) {
      showSnackbar(
        'Please enter a valid total length of road covered (in km) with max 3 decimal places, value should be > 0 and <= 100',
        'error',
      );
      return false;
    }

    // Converting the values back to numbers after validation
    fixingOfSpringPostData.springPostInstalled = Number(
      fixingOfSpringPostData.springPostInstalled,
    );
    fixingOfSpringPostData.totalRoadLengthCovered = Number(
      fixingOfSpringPostData.totalRoadLengthCovered,
    );

    return true;
  };
  const validateTrafficImpactAttenuatorsData = (
    trafficImpactAttenuatorsData: any,
  ): boolean => {
    const totalNoOfAttenuatorsInstalled = parseInt(
      trafficImpactAttenuatorsData.totalNoOfAttenuatorsInstalled,
    );
    const totalLengthOfRoadCovered = parseFloat(
      trafficImpactAttenuatorsData.totalLengthOfRoadCovered,
    );

    if (
      isNaN(totalNoOfAttenuatorsInstalled) ||
      totalNoOfAttenuatorsInstalled <= 0 ||
      totalNoOfAttenuatorsInstalled > 100000
    ) {
      showSnackbar(
        'Please enter a valid number of attenuators installed (value should be > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalLengthOfRoadCovered) ||
      totalLengthOfRoadCovered <= 0 ||
      totalLengthOfRoadCovered > 100 ||
      trafficImpactAttenuatorsData.totalLengthOfRoadCovered.split('.')[1]
        ?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total length of road covered in Km (max 3 decimal places, value should be > 0 and <= 100)',
        'error',
      );
      return false;
    }
    trafficImpactAttenuatorsData.totalNoOfAttenuatorsInstalled = Number(
      trafficImpactAttenuatorsData.totalNoOfAttenuatorsInstalled,
    );
    trafficImpactAttenuatorsData.totalLengthOfRoadCovered = Number(
      trafficImpactAttenuatorsData.totalLengthOfRoadCovered,
    );
    return true;
  };

  const validatePlacementOfSignageSheetData = (
    placementOfSignageSheetData: any,
  ): boolean => {
    const totalSheetFixed = parseFloat(
      placementOfSignageSheetData.totalSheetFixed,
    );
    const totalRoadLengthCovered = parseFloat(
      placementOfSignageSheetData.totalRoadLengthCovered,
    );

    if (
      isNaN(totalSheetFixed) ||
      totalSheetFixed <= 0 ||
      totalSheetFixed > 100000 ||
      placementOfSignageSheetData.totalSheetFixed.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Sheet Fixed in Sqm with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalRoadLengthCovered) ||
      totalRoadLengthCovered <= 0 ||
      totalRoadLengthCovered > 100 ||
      placementOfSignageSheetData.totalRoadLengthCovered.split('.')[1]?.length >
        3
    ) {
      showSnackbar(
        'Please enter a valid Total Road Length Covered in Km with max 3 decimal places, value should be > 0 and <= 100',
        'error',
      );
      return false;
    }
    placementOfSignageSheetData.totalSheetFixed = Number(
      placementOfSignageSheetData.totalSheetFixed,
    );
    placementOfSignageSheetData.totalRoadLengthCovered = Number(
      placementOfSignageSheetData.totalRoadLengthCovered,
    );
    return true;
  };

  const validateBackfillData = (backfillData: any): boolean => {
    const totalQtySoil = parseFloat(backfillData.totalQtySoilUsed);
    const totalLengthTrench = parseFloat(
      backfillData.totalLengthTrenchBackfilled,
    );

    if (
      isNaN(totalQtySoil) ||
      totalQtySoil <= 0 ||
      totalQtySoil > 100000 ||
      backfillData.totalQtySoilUsed.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Qty of Soil Used (in cum) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalLengthTrench) ||
      totalLengthTrench <= 0 ||
      totalLengthTrench > 100000 ||
      backfillData.totalLengthTrenchBackfilled.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Length of Trench Backfilled (in RM) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    backfillData.totalQtySoilUsed = Number(backfillData.totalQtySoilUsed);
    backfillData.totalLengthTrenchBackfilled = Number(
      backfillData.totalLengthTrenchBackfilled,
    );

    return true;
  };

  const validateFlooringData = (flooringData: any): boolean => {
    const totalSurfaceArea = parseFloat(flooringData.totalSurfaceArea);
    const totalTilesUsed = parseInt(flooringData.totalTilesUsed);

    if (
      isNaN(totalSurfaceArea) ||
      totalSurfaceArea <= 0 ||
      totalSurfaceArea > 1000000 ||
      flooringData.totalSurfaceArea.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Surface Area (in Sqm) with max 3 decimal places, value should be > 0 and <= 1000000',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalTilesUsed) ||
      totalTilesUsed <= 0 ||
      totalTilesUsed > 1000000
    ) {
      showSnackbar(
        'Please enter a valid Total Number of Tiles Used (integer value), value should be > 0 and <= 1000000',
        'error',
      );
      return false;
    }

    flooringData.totalSurfaceArea = Number(flooringData.totalSurfaceArea);
    flooringData.totalTilesUsed = Number(flooringData.totalTilesUsed);

    return true;
  };
  const validateMortarChecklistData = (mortarChecklistData: any): boolean => {
    const totalCementBags = parseInt(
      mortarChecklistData.totalCementBagsConsumed,
    );
    const totalSurfaceArea = parseFloat(
      mortarChecklistData.totalSurfaceAreaToBePlastered,
    );
    const totalMortarUsed = parseFloat(mortarChecklistData.totalMortarUsed);

    // Validate total cement bags consumed
    if (
      isNaN(totalCementBags) ||
      totalCementBags <= 0 ||
      totalCementBags > 10000
    ) {
      showSnackbar(
        'Please enter a valid number of cement bags consumed (integer > 0 and <= 10000)',
        'error',
      );
      return false;
    }

    // Validate total surface area to be plastered
    if (
      isNaN(totalSurfaceArea) ||
      totalSurfaceArea <= 0 ||
      totalSurfaceArea > 1000000 ||
      mortarChecklistData.totalSurfaceAreaToBePlastered.split('.')[1]?.length >
        3
    ) {
      showSnackbar(
        'Please enter a valid total surface area to be plastered (in sqm, > 0 and <= 1,000,000 with max 3 decimal places)',
        'error',
      );
      return false;
    }

    // Validate total mortar used
    if (
      isNaN(totalMortarUsed) ||
      totalMortarUsed <= 0 ||
      totalMortarUsed > 1000000 ||
      mortarChecklistData.totalMortarUsed.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total quantity of mortar used (in cum, > 0 and <= 1,000,000 with max 3 decimal places)',
        'error',
      );
      return false;
    }
    mortarChecklistData.totalCementBagsConsumed = Number(
      mortarChecklistData.totalCementBagsConsumed,
    );
    mortarChecklistData.totalSurfaceAreaToBePlastered = Number(
      mortarChecklistData.totalSurfaceAreaToBePlastered,
    );
    mortarChecklistData.totalMortarUsed = Number(
      mortarChecklistData.totalMortarUsed,
    );
    return true;
  };
  const validatePlacingChainLinkData = (placingChainLinkData: any) => {
    const totalSqm = parseFloat(placingChainLinkData.totalSqmFenceInstalled);

    if (
      isNaN(totalSqm) ||
      totalSqm <= 0 ||
      totalSqm > 1000000 ||
      placingChainLinkData.totalSqmFenceInstalled.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Sqm of Fence Installed with up to 3 decimal places, value should be > 0 and <= 1,000,000',
        'error',
      );
      placingChainLinkData.totalSqmFenceInstalled = Number(
        placingChainLinkData.totalSqmFenceInstalled,
      );
      return false;
    }

    return true;
  };
  const validatePreCastRccPanelData = (preCastRccPanelData: any) => {
    const totalPanels = parseInt(preCastRccPanelData.totalPanelsInstalled);
    const totalArea = parseFloat(preCastRccPanelData.totalAreaInstalled);

    if (isNaN(totalPanels) || totalPanels <= 0 || totalPanels > 100000) {
      showSnackbar(
        'Please enter a valid total number of panels installed (in nos.), value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalArea) ||
      totalArea <= 0 ||
      totalArea > 1000000 ||
      preCastRccPanelData.totalAreaInstalled.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid total area of panels installed (in sqm) with max 3 decimal places, value should be > 0 and <= 1000000',
        'error',
      );
      return false;
    }

    preCastRccPanelData.totalPanelsInstalled = Number(
      preCastRccPanelData.totalPanelsInstalled,
    );
    preCastRccPanelData.totalAreaInstalled = Number(
      preCastRccPanelData.totalAreaInstalled,
    );

    return true;
  };

  const validateErectionOfAngleSectionData = (
    erectionOfAngleSectionData: any,
  ): boolean => {
    const totalAngles = parseInt(erectionOfAngleSectionData.totalAnglesErected);

    // Validation for total column/angles erected
    if (isNaN(totalAngles) || totalAngles <= 0 || totalAngles > 10000) {
      showSnackbar(
        'Please enter a valid number of angles erected (should be > 0 and <= 10000)',
        'error',
      );
      return false;
    }

    erectionOfAngleSectionData.totalAnglesErected = Number(
      erectionOfAngleSectionData.totalAnglesErected,
    );

    return true;
  };

  const validateErectionOfBusShelterData = (erectionOfBusShelterData: any) => {
    const totalPanels = parseInt(erectionOfBusShelterData.totalPanelsInstalled);
    const totalBusStands = parseInt(
      erectionOfBusShelterData.totalBusStandsCompleted,
    );

    if (isNaN(totalPanels) || totalPanels <= 0 || totalPanels > 100) {
      showSnackbar(
        'Please enter a valid number of Panels Installed (value should be > 0 and <= 100)',
        'error',
      );
      return false;
    }

    if (isNaN(totalBusStands) || totalBusStands <= 0 || totalBusStands > 100) {
      showSnackbar(
        'Please enter a valid number of Bus Stands Completed (value should be > 0 and <= 100)',
        'error',
      );
      return false;
    }
    erectionOfBusShelterData.totalPanelsInstalled = Number(
      erectionOfBusShelterData.totalPanelsInstalled,
    );
    erectionOfBusShelterData.totalBusStandsCompleted = Number(
      erectionOfBusShelterData.totalBusStandsCompleted,
    );
    return true;
  };

  const validateErectionPreCastColumnData = (
    erectionPreCastColumnData: any,
  ): boolean => {
    const totalNoOfColumns = parseInt(
      erectionPreCastColumnData.totalNoOfColumnsErected,
      10,
    );
    const totalLengthBwall = parseFloat(
      erectionPreCastColumnData.totalLengthOfBwallCovered,
    );

    if (
      isNaN(totalNoOfColumns) ||
      totalNoOfColumns <= 0 ||
      totalNoOfColumns > 10000
    ) {
      showSnackbar(
        'Please enter a valid Total No. of Columns Erected (integer, > 0 and <= 10000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalLengthBwall) ||
      totalLengthBwall <= 0 ||
      totalLengthBwall > 100000 ||
      erectionPreCastColumnData.totalLengthOfBwallCovered.split('.')[1]
        ?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Length of B/Wall Covered (in RM, max 3 decimal places, > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    erectionPreCastColumnData.totalNoOfColumnsErected = Number(
      erectionPreCastColumnData.totalNoOfColumnsErected,
    );
    erectionPreCastColumnData.totalLengthOfBwallCovered = Number(
      erectionPreCastColumnData.totalLengthOfBwallCovered,
    );

    return true;
  };

  const validateFixingOfPanelsData = (fixingOfPanelsData: any) => {
    const totalPanelsInstalled = parseInt(
      fixingOfPanelsData.totalPanelsInstalled,
    );
    const totalBusShelterCompleted = parseInt(
      fixingOfPanelsData.totalBusShelterCompleted,
    );

    if (
      isNaN(totalPanelsInstalled) ||
      totalPanelsInstalled <= 0 ||
      totalPanelsInstalled > 10000
    ) {
      showSnackbar(
        'Please enter a valid number for Total Panels Installed (value should be > 0 and <= 10000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalBusShelterCompleted) ||
      totalBusShelterCompleted <= 0 ||
      totalBusShelterCompleted > 10000
    ) {
      showSnackbar(
        'Please enter a valid number for Total Bus Shelter Completed (value should be > 0 and <= 10000)',
        'error',
      );
      return false;
    }
    fixingOfPanelsData.totalPanelsInstalled = Number(
      fixingOfPanelsData.totalPanelsInstalled,
    );
    fixingOfPanelsData.totalBusShelterCompleted = Number(
      fixingOfPanelsData.totalBusShelterCompleted,
    );
    return true;
  };

  const validateHtPanelInstallationData = (
    htPanelInstallationData: any,
  ): boolean => {
    const totalEquipmentsInstalled = parseInt(
      htPanelInstallationData.totalEquipmentsInstalled,
      10,
    );

    if (
      isNaN(totalEquipmentsInstalled) ||
      totalEquipmentsInstalled <= 0 ||
      totalEquipmentsInstalled > 1000
    ) {
      showSnackbar(
        'Please enter a valid Total No. of Equipment Installed, value should be > 0 and <= 1000',
        'error',
      );
      return false;
    }

    // Converting back to number after validation
    htPanelInstallationData.totalEquipmentsInstalled = Number(
      htPanelInstallationData.totalEquipmentsInstalled,
    );

    return true;
  };

  const validateFixingAndInstallationData = (
    fixingAndInstallationData: any,
  ): boolean => {
    const totalEquipment = parseInt(
      fixingAndInstallationData.totalEquipmentInstalled,
      10,
    );

    if (isNaN(totalEquipment) || totalEquipment <= 0 || totalEquipment > 1000) {
      showSnackbar(
        'Please enter a valid number of equipment installed, value should be > 0 and <= 1000',
        'error',
      );
      return false;
    }

    fixingAndInstallationData.totalEquipmentInstalled = Number(
      fixingAndInstallationData.totalEquipmentInstalled,
    );

    return true;
  };

  const validateCableTrenchExcavationData = (
    cableTrenchExcavationData: any,
  ): boolean => {
    const totalSoilQty = parseFloat(
      cableTrenchExcavationData.totalSoilQtyExcavated,
    );
    const totalTrenchQty = parseFloat(
      cableTrenchExcavationData.totalTrenchExcavated,
    );

    if (
      isNaN(totalSoilQty) ||
      totalSoilQty <= 0 ||
      totalSoilQty > 1000000 ||
      cableTrenchExcavationData.totalSoilQtyExcavated.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Qty of Soil Excavated (in Cum) with max 3 decimal places, value should be > 0 and <= 1,000,000',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalTrenchQty) ||
      totalTrenchQty <= 0 ||
      totalTrenchQty > 100000 ||
      cableTrenchExcavationData.totalTrenchExcavated.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Trench Excavated (in RM) with max 3 decimal places, value should be > 0 and <= 100,000',
        'error',
      );
      return false;
    }

    // Convert to numbers
    cableTrenchExcavationData.totalSoilQtyExcavated = Number(
      cableTrenchExcavationData.totalSoilQtyExcavated,
    );
    cableTrenchExcavationData.totalTrenchExcavated = Number(
      cableTrenchExcavationData.totalTrenchExcavated,
    );

    return true;
  };

  const validateConduitLayingData = (conduitLayingData: any) => {
    const totalConduitLength = parseFloat(conduitLayingData.totalConduitLength);

    if (
      isNaN(totalConduitLength) ||
      totalConduitLength <= 0 ||
      totalConduitLength > 10000 ||
      conduitLayingData.totalConduitLength.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Length of Conduit laid (in RM) with max 3 decimal places, value should be > 0 and <= 10000',
        'error',
      );
      return false;
    }

    conduitLayingData.totalConduitLength = Number(
      conduitLayingData.totalConduitLength,
    );

    return true;
  };

  const validateCableTrenchDressingData = (
    cableTrenchDressingData: any,
  ): boolean => {
    const totalTrenchDressed = parseFloat(
      cableTrenchDressingData.totalTrenchDressed,
    );

    if (
      isNaN(totalTrenchDressed) ||
      totalTrenchDressed <= 0 ||
      totalTrenchDressed > 1000000 ||
      cableTrenchDressingData.totalTrenchDressed.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Trench Dressed (in RM) with max 3 decimal places, value should be > 0 and <= 1000000',
        'error',
      );
      return false;
    }

    cableTrenchDressingData.totalTrenchDressed = Number(
      cableTrenchDressingData.totalTrenchDressed,
    );

    return true;
  };
  const validateBricksLayeringData = (bricksLayeringData: any): boolean => {
    const totalAreaCompleted = parseFloat(
      bricksLayeringData.totalAreaCompleted,
    );
    const totalBricksLaid = parseInt(bricksLayeringData.totalBricksLaid);
    const totalLengthTrenchCompleted = parseFloat(
      bricksLayeringData.totalLengthTrenchCompleted,
    );

    // Validation for Total Area of Brick Layering Completed (sqm)
    if (
      isNaN(totalAreaCompleted) ||
      totalAreaCompleted <= 0 ||
      totalAreaCompleted > 100000 ||
      bricksLayeringData.totalAreaCompleted.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Area of Brick Layering Completed (sqm) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    // Validation for Total No. of Bricks Laid (No)
    if (
      isNaN(totalBricksLaid) ||
      totalBricksLaid <= 0 ||
      totalBricksLaid > 100000
    ) {
      showSnackbar(
        'Please enter a valid Total No. of Bricks Laid (No) with value > 0 and <= 100000',
        'error',
      );
      return false;
    }

    // Validation for Total Length of Trench Completed (RM)
    if (
      isNaN(totalLengthTrenchCompleted) ||
      totalLengthTrenchCompleted <= 0 ||
      totalLengthTrenchCompleted > 100000 ||
      bricksLayeringData.totalLengthTrenchCompleted.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Length of Trench Completed (RM) with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }
    bricksLayeringData.totalAreaCompleted = Number(
      bricksLayeringData.totalAreaCompleted,
    );
    bricksLayeringData.totalBricksLaid = Number(
      bricksLayeringData.totalBricksLaid,
    );
    bricksLayeringData.totalLengthTrenchCompleted = Number(
      bricksLayeringData.totalLengthTrenchCompleted,
    );
    return true;
  };

  const validateRouteMarkingData = (routeMarkingData: any) => {
    const totalLength = parseFloat(routeMarkingData.totalLengthCoveredRM);
    const numberOfMaker = parseInt(routeMarkingData.totalLengthCoveredRM);

    if (isNaN(numberOfMaker) || numberOfMaker <= 0) {
      showSnackbar(
        'Please enter a valid number for Route Markers Installed, value should be > 0',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalLength) ||
      totalLength <= 0 ||
      totalLength > 100000 ||
      routeMarkingData.totalLengthCoveredRM.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Length Covered in RM with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    routeMarkingData.totalRouteMarkersInstalled = Number(
      routeMarkingData.totalRouteMarkersInstalled,
    );
    routeMarkingData.totalLengthCoveredRM = Number(
      routeMarkingData.totalLengthCoveredRM,
    );

    return true;
  };

  const validateLayingCautionTapeData = (layingCautionTapeData: any) => {
    const totalCautionTapeLength = parseFloat(
      layingCautionTapeData.totalCautionTapeLength,
    );

    if (
      isNaN(totalCautionTapeLength) ||
      totalCautionTapeLength <= 0 ||
      totalCautionTapeLength > 10000 ||
      layingCautionTapeData.totalCautionTapeLength.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Length of Caution Tape Laid (RM) with max 3 decimal places, value should be > 0 and <= 10000',
        'error',
      );
      return false;
    }

    layingCautionTapeData.totalCautionTapeLength = Number(
      layingCautionTapeData.totalCautionTapeLength,
    );
    return true;
  };

  const validateFixingOfModulesData = (fixingOfModulesData: any): boolean => {
    const totalModulesMounted = parseInt(
      fixingOfModulesData.totalModulesMounted,
    );
    const totalLengthMounted = parseFloat(
      fixingOfModulesData.totalLengthMounted,
    );

    if (
      isNaN(totalModulesMounted) ||
      totalModulesMounted <= 0 ||
      totalModulesMounted > 100000
    ) {
      showSnackbar(
        'Please enter a valid Total No. of Modules Mounted (integer > 0, max 100000)',
        'error',
      );
      return false;
    }

    if (
      isNaN(totalLengthMounted) ||
      totalLengthMounted <= 0 ||
      totalLengthMounted > 100000 ||
      fixingOfModulesData.totalLengthMounted.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Length of Modules Mounting (max 3 decimal places, value should be > 0 and <= 100000)',
        'error',
      );
      return false;
    }

    fixingOfModulesData.totalModulesMounted = Number(
      fixingOfModulesData.totalModulesMounted,
    );
    fixingOfModulesData.totalLengthMounted = Number(
      fixingOfModulesData.totalLengthMounted,
    );

    return true;
  };

  const validateFixingOfMMSData = fixingOfMMSData => {
    const totalMMSTables = parseInt(fixingOfMMSData.totalNoOfMMSTablesErected);
    const totalLengthMMS = parseFloat(
      fixingOfMMSData.totalLengthOfMMSCompleted,
    );

    // Validation for Total No. of MMS Tables Erected
    if (
      isNaN(totalMMSTables) ||
      totalMMSTables <= 0 ||
      totalMMSTables > 100000
    ) {
      showSnackbar(
        'Please enter a valid Total No. of MMS Tables Erected, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    // Validation for Total Length of MMS Structure Completed in RM
    if (
      isNaN(totalLengthMMS) ||
      totalLengthMMS <= 0 ||
      totalLengthMMS > 100000 ||
      fixingOfMMSData.totalLengthOfMMSCompleted.split('.')[1]?.length > 3
    ) {
      showSnackbar(
        'Please enter a valid Total Length of MMS Structure in RM with max 3 decimal places, value should be > 0 and <= 100000',
        'error',
      );
      return false;
    }

    return true;
  };

  const validateTemporaryPrestressingData = (
    temporaryPrestressingData: any[],
  ): boolean => {
    for (const item of temporaryPrestressingData) {
      // Parsing values to float
      const maxJackPressure = parseFloat(item.maxJackPressure);
      const jackPressureApplied = parseFloat(item.jackPressureApplied);

      if (
        isNaN(maxJackPressure) ||
        maxJackPressure <= 0 ||
        maxJackPressure > 1000 ||
        item.maxJackPressure.split('.')[1]?.length > 3
      ) {
        showSnackbar(
          'Max Jack Pressure must be greater than 0 and up to 1000 Kg/Cm² with up to 3 decimal places.',
          'error',
        );
        return false;
      }

      if (
        isNaN(jackPressureApplied) ||
        jackPressureApplied <= 0 ||
        jackPressureApplied > 1000 ||
        item.jackPressureApplied.split('.')[1]?.length > 3
      ) {
        showSnackbar(
          'Jack Pressure Applied must be greater than 0 and up to 1000 Kg/Cm² with up to 3 decimal places.',
          'error',
        );
        return false;
      }

      if (!item.dateOfPrestressing || !item.timeOfPrestressing) {
        showSnackbar('Date and Time of Prestressing must be filled.', 'error');
        return false;
      }
    }

    // Convert the values back to numbers after validation
    temporaryPrestressingData.forEach((item: any) => {
      item.maxJackPressure = Number(item.maxJackPressure);
      item.jackPressureApplied = Number(item.jackPressureApplied);
    });

    return true;
  };
  const renderPrestressingHeadings = () => (
    <View style={styles.rowContainer}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Cable No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Stressing Sequence</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Gauge A0 (100 Kg/cm²)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Gauge B0 (100 Kg/cm²)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Gauge A1 (200 Kg/cm²)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Gauge B1 (200 Kg/cm²)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Gauge A2 (Locking)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Pressure PA (Locking)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Gauge B2 (Locking)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Pressure PB (Locking)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Slip SA0 (Locking)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Slip SB0 (Locking)</Text>
      </View>
    </View>
  );
  const renderItemPrestressing = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{rowData.item['cableNo']}</Text>
      </View>

      <View style={styles.cell}>
        <Text style={styles.cellText}>{rowData.item['stressingSequence']}</Text>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'A0'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'B0'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'A1'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'B1'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'A2'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'PA'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'B2'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'PB'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'SA0'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'SB0'}
          index={rowData.index}
          onChange={handleTextInputChangePrestressing}></CustomTextInputValue>
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
  const handleTimeChangeTemporaryPrestressing = (
    index: any,
    field: any,
    value: any,
  ) => {
    const newData = [...temporaryPrestressingData];
    newData[index][field] = value;
    setTemporaryPrestressingData(newData);
  };
  const handleTimeChangeGlueing = (index: any, field: any, value: any) => {
    const newData = [...glueingData];
    newData[index][field] = value;
    setGlueingData(newData);
  };
  const handleInputChangeFormwork = (field: string, value: string) => {
    setRemovalFormworkData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };
  const handleTextInputChangePrestressing = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedData = [...prestressingData];
    let isValid = true;
    let errorMessage = '';

    const readingValue = parseFloat(value);

    if (isNaN(readingValue) || readingValue <= 0 || readingValue > 500) {
      isValid = false;
      errorMessage =
        'Enter a valid number greater than 0 and less than or equal to 500';
    } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      isValid = false;
      errorMessage = 'Enter a number with up to 2 decimal places';
    }

    if (!isValid) {
      showSnackbar(errorMessage, 'error');
    }
    updatedData[index][field] = value;
    setPrestressingData(updatedData);
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
  const renderDumpingHeadings = () => (
    <View style={styles.rowContainer}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Tm No.</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Vehicle No. (Last 4 digits)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Source (Y/N)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Qty Dumped (cum)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Approved Source (Y/N)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Boulders/ Unwanted Materials (Y/N)</Text>
      </View>
      <View style={[styles.cell, {paddingHorizontal: 40}]}>
        <Text style={styles.cellText}>Actions</Text>
      </View>
    </View>
  );

  const renderItemDumping = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={styles.cell}>
        <Text>TM {rowData.index + 1}</Text>
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'vehicleNo'}
          index={rowData.index}
          onChange={handleTextInputChangeDumping}
        />
      </View>

      <View style={styles.cell}>
        <DropdownPicker
          label="Source"
          value={rowData.item.source}
          items={YES_NO_LIST}
          onChange={(value: any) =>
            handleDropdownChangeDumping(rowData.index, 'source', value)
          }
          isRequired={true}
        />
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'qtyDumped'}
          index={rowData.index}
          onChange={handleTextInputChangeDumping}
        />
      </View>

      <View style={styles.cell}>
        <DropdownPicker
          label="Approved Source"
          value={rowData.item.approvedSource}
          items={YES_NO_LIST}
          onChange={(value: any) =>
            handleDropdownChangeDumping(rowData.index, 'approvedSource', value)
          }
          isRequired={true}
        />
      </View>

      <View style={styles.cell}>
        <DropdownPicker
          label="Boulders Present"
          value={rowData.item.bouldersPresent}
          items={YES_NO_LIST}
          onChange={(value: any) =>
            handleDropdownChangeDumping(rowData.index, 'bouldersPresent', value)
          }
          isRequired={true}
        />
      </View>

      <View style={[styles.cell, {paddingHorizontal: 45}]}>
        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => deleteDumpingItem(rowData, rowData.item.key)}>
          <Image
            style={[styles.CloseIcon, {tintColor: '#fff'}]}
            source={require('./../../images/menu/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  const handleDropdownChangeDumping = (
    index: number,
    fieldName: string,
    value: any,
  ) => {
    setDumpingData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [fieldName]: value,
      };
      return newData;
    });
  };

  const renderItemGlueing = (rowData: any) => (
    <View style={[styles.rowContainer, styles.marginBottom10]}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{rowData.item['jointNumbers']}</Text>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'ambientTemperature'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'batchNoResin'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'batchNoHardener'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.mixingStartTime}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTimeChangeGlueing(rowData.index, 'mixingStartTime', time)
          }
        />
      </View>

      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.mixingFinishTime}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTimeChangeGlueing(rowData.index, 'mixingFinishTime', time)
          }
        />
      </View>

      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.applicationStartTime}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTimeChangeGlueing(rowData.index, 'applicationStartTime', time)
          }
        />
      </View>

      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.applicationFinishTime}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTimeChangeGlueing(
              rowData.index,
              'applicationFinishTime',
              time,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.segmentJoiningTimeClosure}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTimeChangeGlueing(
              rowData.index,
              'segmentJoiningTimeClosure',
              time,
            )
          }
        />
      </View>
      <View style={styles.cell}>
        <TimePicker
          label=""
          value={rowData.item.segmentJoiningTimeTemporaryFinish}
          styleCont={styles.marginBootomZero}
          style={styles.disPlayNone}
          onChange={time =>
            handleTimeChangeGlueing(
              rowData.index,
              'segmentJoiningTimeTemporaryFinish',
              time,
            )
          }
        />
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'segmentSurfaceArea'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'epoxyConsumptionTheoreticalResin'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'epoxyConsumptionTheoreticalHardener'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>

      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'epoxyConsumptionActualResin'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
      </View>
      <View style={styles.cell}>
        <CustomTextInputValue
          rowItem={rowData.item}
          fieldName={'epoxyConsumptionActualHardener'}
          index={rowData.index}
          onChange={handleTextInputChangeGlueing}></CustomTextInputValue>
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
  const deleteTorquingItem = (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...torquingData];
    const prevIndex = torquingData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setTorquingData(newData);
  };
  const deleteDumpingItem = (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...dumpingData];
    const prevIndex = dumpingData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setDumpingData(newData);
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
      case TASK_TYPES.FIXING_OF_BEARING_SLEEVES:
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
      case TASK_TYPES.REMOVAL_OF_SIDE_SHUTTERS:
      case TASK_TYPES.REMOVAL_OF_MIDDLIE_TOP_SHUTTERS:
      case TASK_TYPES.REMOVAL_OF_INNER_SHUTTERS:
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
      case TASK_TYPES.COMPACTION:
        const compactionProperties = [
          {
            title: 'Uniform Sprinkling of Water Done if Required',
            key: 'uniformSprinkling',
          },
          {
            title: 'Loose Thickness of Layer Checked',
            key: 'looseThicknessChecked',
          },
          {
            title: 'OMC is Maintained Before Commencement of Rolling',
            key: 'omcMaintained',
          },
          {
            title: 'Suitable Roller Available for Compaction',
            key: 'suitableRollerAvailable',
          },
          {
            title: 'Number of Passes, Speed, and Rolling Pattern Followed',
            key: 'passesSpeedPatternFollowed',
          },
          {
            title: 'Any Localized Wet, Soft, or Under Compacted Area Found',
            key: 'localizedWetSoftAreaFound',
          },
          {
            title: 'Layer is Free from Segregation',
            key: 'layerFreeFromSegregation',
          },
          {
            title: 'Arrangement for Protection of Finished Surface Available',
            key: 'protectionForFinishedSurface',
          },
          {
            title: 'Any Non-conformance/Non-compliance Found',
            key: 'nonConformanceFound',
          },
          {
            title: 'Finished Compacted Layer Thickness as Specified',
            key: 'compactedLayerThicknessSpecified',
          },
        ];

        return (
          <View>
            {compactionProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={compactionData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setCompactionData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Finished Compacted Layer Thickness in mm"
              value={compactionData.compactedLayerThickness}
              onChange={(value: any) =>
                setCompactionData(prevData => ({
                  ...prevData,
                  compactedLayerThickness: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );

      case TASK_TYPES.COMPACTING_GROUND_SUPPORT_FOR_EMBANKMENT:
      case TASK_TYPES.DEWATERING:
      case TASK_TYPES.PLACING_OF_COVER:
      case TASK_TYPES.FIXING_OF_SHEET:
      case TASK_TYPES.GRADING:
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
      case TASK_TYPES.STITCH_CONCRETE:
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
            <DropdownPicker
              label="Grade of Concrete (Reference approved drawing)"
              value={stitchConcreteData.gradeOfConcrete}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete('gradeOfConcrete', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Method statement is approved"
              value={stitchConcreteData.methodStatementApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete(
                  'methodStatementApproved',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="All HT strands for all duct inserted before concreting"
              value={stitchConcreteData.htStrandsInserted}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete('htStrandsInserted', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Water, sand, coarse aggregate, cement, admixture approved by IE"
              value={stitchConcreteData.materialsApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete('materialsApproved', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Formwork approved by IE"
              value={stitchConcreteData.formworkApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete('formworkApproved', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Reinforcement cage approved"
              value={stitchConcreteData.reinforcementCageApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete(
                  'reinforcementCageApproved',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Concreting equipment is in proper working condition"
              value={stitchConcreteData.equipmentWorking}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete('equipmentWorking', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Access provided"
              value={stitchConcreteData.accessProvided}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete('accessProvided', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Safety arrangements are adequate"
              value={stitchConcreteData.safetyArrangements}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete('safetyArrangements', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Heavy rainfall protection available"
              value={stitchConcreteData.rainfallProtection}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete('rainfallProtection', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Needle Vibrators status"
              value={stitchConcreteData.needleVibratorStatus}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete('needleVibratorStatus', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Needles vibrator’s nos and status"
              value={stitchConcreteData.needleVibratorNos}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete('needleVibratorNos', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Slump cone apparatus and sufficient Cube moulds available"
              value={stitchConcreteData.slumpConeApparatusAvailable}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete(
                  'slumpConeApparatusAvailable',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Start pre-stressing after getting strength 30 Mpa or 5 days"
              value={stitchConcreteData.startPreStressing}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete('startPreStressing', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Pre-stressing & Grouting format followed as per Spine"
              value={stitchConcreteData.groutingFormatFollowed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeStitchConcrete('groutingFormatFollowed', value)
              }
              isRequired={true}
            />
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
      case TASK_TYPES.COPING:
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
      case TASK_TYPES.TORQUING:
        if (!torquingData || !torquingData.length) {
          setTorquingData([
            {
              date: '',
              time: '',
              component: '',
              detailsOfJoints: '',
              nosOfBolt: 0,
              diaOfBoltInMm: 0,
              sizeInMm: 0,
              slNoOfInvoiceMTCFile: '',
              slNoOfTorqueWrench: '',
              torqueApplied: 0,
              refusalsGauage3nos: 'Y',
              refusalsGauage4nos: 'Y',
              refusalsGauage5nos: 'Y',
              refusalsGauage6nos: 'Y',
              key: Guid.create(),
            },
          ]);
        }
        return (
          <View>
            <View style={styles.MainContainer}>
              <ScrollView
                id="scrollViewTorquing"
                showsHorizontalScrollIndicator={false}
                horizontal={enableScroll}>
                <View>
                  {renderTorquingHeadings()}
                  <FlatList
                    data={torquingData}
                    renderItem={renderItemTorquing}
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
                onPress={() => onAddMoreTorquing()}>
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
      case TASK_TYPES.DUMPING:
        if (!dumpingData || !dumpingData.length) {
          setDumpingData([
            {
              vehicleNo: '',
              source: 'Y',
              qtyDumped: 0,
              approvedSource: '',
              bouldersPresent: 'Y',
              key: Guid.create(),
            },
          ]);
        }

        return (
          <View>
            <ScrollView horizontal={true}>
              <View>
                {renderDumpingHeadings()}
                <FlatList
                  data={dumpingData}
                  renderItem={renderItemDumping}
                  keyExtractor={item => item.key?.toString()}
                  automaticallyAdjustContentInsets={true}
                  scrollEnabled={false}
                />
              </View>
            </ScrollView>
            <TouchableOpacity onPress={() => onAddMoreDumping()}>
              <Text>+ Add More</Text>
            </TouchableOpacity>

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
      case TASK_TYPES.REMOVAL_OF_FORMWORK:
        return (
          <View style={styles.columnWiseData}>
            <Text style={styles.headerText}>Removal of Formwork</Text>
            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Whether concrete has achieved desired strength"
                value={removalFormworkData.concreteStrengthAchieved}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFormwork('concreteStrengthAchieved', value)
                }
              />
            </View>
            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Whether minimum time has been attained"
                value={removalFormworkData.minimumTimeAttained}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFormwork('minimumTimeAttained', value)
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
      case TASK_TYPES.FABRICATION_OF_BUS_SHELTER:
      case TASK_TYPES.FABRICATION_OF_MEMBERS:
      case TASK_TYPES.FABRICATION_OF_STEEL_GIRDERS:
        return (
          <View style={styles.columnWiseData}>
            <Text style={styles.headerText}>
              Fabrication of Steel Girders/Diaphragms
            </Text>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Is Steel inspection for surface condition (Twist, Straightness etc.)"
                value={fabricationData.steelInspectionSurfaceCondition}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication(
                    'steelInspectionSurfaceCondition',
                    value,
                  )
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Is Section checked for dimension and checked as per GFC"
                value={fabricationData.sectionCheckedForDimension}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication(
                    'sectionCheckedForDimension',
                    value,
                  )
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Is Material specification and checked as per GFC"
                value={fabricationData.materialSpecificationChecked}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication(
                    'materialSpecificationChecked',
                    value,
                  )
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Is connection checked as per GFC"
                value={fabricationData.connectionChecked}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication('connectionChecked', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Are bolt holes clean and to size?"
                value={fabricationData.boltHolesClean}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication('boltHolesClean', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Only approved welders used"
                value={fabricationData.approvedWeldersUsed}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication('approvedWeldersUsed', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Welds identified as per welder ID"
                value={fabricationData.weldsIdentified}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication('weldsIdentified', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Welds inspected for dimension, shape, location, etc."
                value={fabricationData.weldsInspected}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication('weldsInspected', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Welds repaired as required."
                value={fabricationData.weldsRepaired}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication('weldsRepaired', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Shape edge burns, weld spatter removed."
                value={fabricationData.shapeEdgeBurnsRemoved}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication('shapeEdgeBurnsRemoved', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Oil grease removed prior to final clean."
                value={fabricationData.oilGreaseRemoved}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication('oilGreaseRemoved', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Steel cleaned and painted as per specification."
                value={fabricationData.steelCleanedAndPainted}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication('steelCleanedAndPainted', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Final shop coat applied as per approve color."
                value={fabricationData.finalShopCoatApplied}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication('finalShopCoatApplied', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Each member marked for erection as per scope"
                value={fabricationData.memberMarkedForErection}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication('memberMarkedForErection', value)
                }
              />
            </View>

            <View style={styles.categoryColumn}>
              <DropdownPicker
                label="Each member approved by inspector prior to shipment."
                value={fabricationData.memberApprovedByInspector}
                items={YES_NO_NA_LIST}
                onChange={(value: string) =>
                  handleInputChangeFabrication(
                    'memberApprovedByInspector',
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

      case TASK_TYPES.TEMPORARY_PRESTRESSING:
        return (
          <View>
            <View style={styles.MainContainer}>
              <ScrollView
                id="scrollViewTemporaryPrestressing"
                showsHorizontalScrollIndicator={false}
                horizontal={enableScroll}>
                <View>
                  {renderTemporaryPrestressingHeadings()}
                  <FlatList
                    data={temporaryPrestressingData}
                    renderItem={renderItemTemporaryPrestressing}
                    keyExtractor={item => item.key?.toString()}
                    style={{zIndex: 10}}
                    automaticallyAdjustContentInsets={true}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
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
      case TASK_TYPES.ERECTION_USING_CRANES:
        const erectionUsingCranesProperties = [
          {
            label: 'Has any risk assessment been carried out',
            key: 'riskAssessmentCarriedOut',
          },
          {
            label: 'Is the crane on firm level bases',
            key: 'craneOnFirmLevelBases',
          },
          {
            label: 'Are all operators trained and competent',
            key: 'allOperatorsTrained',
          },
          {
            label: 'Is crane tested and operated',
            key: 'craneTestedAndOperated',
          },
          {
            label: 'Is there swing alarm installed and functioning',
            key: 'swingAlarmFunctioning',
          },
          {
            label: 'Does the crane have a current test certificate',
            key: 'craneTestCertificate',
          },
          {
            label: 'Boom of crane have a current test certificate',
            key: 'boomTestCertificate',
          },
          {label: 'Oil (leakage)', key: 'oilLeakage'},
          {label: 'Greasing', key: 'greasing'},
          {
            label: 'Outriggers (Fully extended)',
            key: 'outriggersFullyExtended',
          },
          {
            label: 'Level indicators (2 degree to 3 degree)',
            key: 'levelIndicators',
          },
          {
            label: 'Base plate under the outriggers',
            key: 'basePlateUnderOutriggers',
          },
          {label: 'Rigging (2 Nos) angles', key: 'riggingAngles'},
          {
            label:
              'Are all the examination and test carried out and certified by competent person',
            key: 'examinationCertified',
          },
          {
            label:
              'All lifting tools and tackles are being identified, checked and have valid register',
            key: 'liftingToolsChecked',
          },
          {
            label:
              'The person working at height are trained and lash with all fall protection devices',
            key: 'workersWithFallProtection',
          },
          {
            label: 'Workmen provided with all required PPE’s',
            key: 'ppeProvided',
          },
          {
            label:
              'Whether sufficient illumination is provided around the working area',
            key: 'sufficientIllumination',
          },
          {
            label: 'Is the SWL marked on all lifting tools & tackles',
            key: 'swlMarked',
          },
          {
            label:
              'All welding machine, electrical equipment’s & generators properly earthed',
            key: 'equipmentProperlyEarthed',
          },
          {
            label: 'Are the walkway maintained free from obstacle all the time',
            key: 'walkwayObstacleFree',
          },
          {
            label: 'Is safety latch/locking available',
            key: 'safetyLatchAvailable',
          },
          {
            label: 'Proper warning sign available at site',
            key: 'warningSignAvailable',
          },
          {label: 'Lifting arrangements', key: 'liftingArrangements'},
          {label: 'Ground leveling', key: 'groundLeveling'},
          {
            label: 'Is Structure set out to the required line and levels',
            key: 'structureSetOut',
          },
          {
            label:
              'For welding, is welder qualification and skill checked and certified',
            key: 'welderQualificationChecked',
          },
        ];

        return (
          <View>
            {erectionUsingCranesProperties.map(property => (
              <DropdownPicker
                label={property.label}
                value={erectionUsingCranesData[property.key]}
                items={YES_NO_LIST}
                onChange={(value: string) =>
                  handleInputChangeErectionUsingCranes(property.key, value)
                }
                isRequired={true}
              />
            ))}

            {/* Additional form elements */}
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
      case TASK_TYPES.STACKING_IN_YARD:
        const stackingInYardProperties = [
          {
            title: 'Area Barricaded with Proper Signages',
            key: 'areaBarricaded',
          },
          {
            title: 'Temporary Lights Available at Night',
            key: 'temporaryLightsAvailable',
          },
          {title: 'Flag Man/Marshal Available', key: 'flagManAvailable'},
          {
            title: 'Methodology & Scheme for Lifting and Stacking Available',
            key: 'methodologyAvailable',
          },
          {
            title: 'De-shackles and Slings with Test Certificate',
            key: 'deShacklesAndSlings',
          },
          {title: 'Safety Color Code on De-shackles', key: 'safetyColorCode'},
          {
            title: 'Hydraulic Jacks in Good Condition',
            key: 'hydraulicJacksCondition',
          },
          {
            title: 'Limit Switch of Lifting Hoist Working',
            key: 'limitSwitchWorking',
          },
          {
            title: 'Cotter Pins in All Lifting Assemblies',
            key: 'cotterPinsInPlace',
          },
          {
            title: 'Macalloy Bars/Pins for Lifting in Proper Condition',
            key: 'macalloyBarsCondition',
          },
          {title: 'Work at Height Permit Obtained', key: 'workAtHeightPermit'},
          {
            title: 'All Macalloy Bars and Wire Rope Assemblies Certified',
            key: 'macalloyBarsCertificate',
          },
          {
            title: 'Lifting Sequence as per Approved Methodology',
            key: 'liftingSequenceProvided',
          },
          {
            title: 'Lifting Holes in Proper Location',
            key: 'liftingHolesLocation',
          },
          {
            title: 'Lifting Arrangements Working Properly',
            key: 'liftingArrangementsWorking',
          },
          {
            title: 'Pre-stressing Duct Clear of Foreign Materials',
            key: 'preStressingDuctClear',
          },
          {
            title: 'Concrete Strength as per Approved Drawing',
            key: 'concreteStrength',
          },
          {
            title: 'Slider Trolley in Proper Position',
            key: 'sliderTrolleyPosition',
          },
          {
            title: 'Methodology for Stacking Approved',
            key: 'methodologyForStackingApproved',
          },
          {
            title: 'Stacking Area Properly Located and Earmarked',
            key: 'stackingAreaLocation',
          },
          {
            title: 'Stacking Area Level and Supported',
            key: 'stackingAreaLevelSupport',
          },
        ];
        return (
          <View>
            {stackingInYardProperties.map(property => (
              <DropdownPicker
                key={property.key}
                label={property.title}
                value={stackingInYardData[property.key]}
                items={YES_NO_LIST}
                onChange={(value: string) =>
                  handleInputChangeStackingInYard(property.key, value)
                }
                isRequired={true}
              />
            ))}
            <View>
              {/* This should present irrespective of property */}
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
                  keyboardType="default"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => setComments(text)}
                />
              </View>
            </View>
          </View>
        );

      case TASK_TYPES.ASSEMBLING_OF_TRUSS:
        return (
          <View>
            <DropdownPicker
              label="Parts Accurately Assembled (GFC)"
              value={assemblingOfTrussData.partsAccuratelyAssembled}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAssemblingOfTruss(
                  'partsAccuratelyAssembled',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="No Bent or Broken Parts During Handling"
              value={assemblingOfTrussData.noBentOrBrokenParts}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAssemblingOfTruss('noBentOrBrokenParts', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Truss Span Laid on Blocks for Proper Camber"
              value={assemblingOfTrussData.trussSpanOnBlocks}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAssemblingOfTruss('trussSpanOnBlocks', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="All Joint Surfaces Free from Dirt, Burrs"
              value={assemblingOfTrussData.cleanJointSurfaces}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAssemblingOfTruss('cleanJointSurfaces', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="All Fasteners Have Washer Under Nut or Bolt"
              value={assemblingOfTrussData.fastenersWithWashers}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAssemblingOfTruss(
                  'fastenersWithWashers',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Service Bolts Fully Tightened"
              value={assemblingOfTrussData.serviceBoltsTightened}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAssemblingOfTruss(
                  'serviceBoltsTightened',
                  value,
                )
              }
              isRequired={true}
            />
            <View>
              {/* this should present irrespective of property */}
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
      case TASK_TYPES.HACKING_OF_GIRDER:
        return (
          <View>
            <DropdownPicker
              label="Methodology Approved for Hacking by the Contractor"
              value={hackingOfGirderData.methodologyApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeHackingOfGirder('methodologyApproved', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Whether the Surface Cleaned and Wet at Which Hacking is to be Done"
              value={hackingOfGirderData.surfaceCleanedAndWet}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeHackingOfGirder('surfaceCleanedAndWet', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Whether the Personnel are Skilled"
              value={hackingOfGirderData.skilledPersonnel}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeHackingOfGirder('skilledPersonnel', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Whether the Instrument Used for Hacking is Sharpened"
              value={hackingOfGirderData.sharpenedInstruments}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeHackingOfGirder('sharpenedInstruments', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Whether the 300-400 Recess Cut Formed in Per Square Meter"
              value={hackingOfGirderData.recessCutFormation}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeHackingOfGirder('recessCutFormation', value)
              }
              isRequired={true}
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
      case TASK_TYPES.DE_STRESSING_OF_GIRDER:
        return (
          <View>
            <DropdownPicker
              label="Girders and Segments Achieved Their Strength"
              value={deStressingOfGirderData.strengthAchieved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeDeStressingOfGirder('strengthAchieved', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Diamond Bit Saw or Grinder Used to Cut the Strands"
              value={deStressingOfGirderData.diamondBitSawUsed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeDeStressingOfGirder('diamondBitSawUsed', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Normal Gradual Uniform Transfer of Prestress to Girder"
              value={deStressingOfGirderData.gradualUniformTransfer}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeDeStressingOfGirder(
                  'gradualUniformTransfer',
                  value,
                )
              }
              isRequired={true}
            />

            <View>
              {/* Additional common components */}
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
      case TASK_TYPES.FIXING_OF_BEARING:
        return (
          <View>
            <DropdownPicker
              label="Bearing Placed as Per GFC Drawing"
              value={fixingOfBearingData.bearingPlacedAsPerGFC}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfBearing('bearingPlacedAsPerGFC', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Bearing Surface Fully Contact with Girder"
              value={fixingOfBearingData.bearingSurfaceFullyContactWithGirder}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfBearing(
                  'bearingSurfaceFullyContactWithGirder',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Bearing Plates Set Horizontal in Both Directions"
              value={fixingOfBearingData.bearingPlatesSetHorizontal}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfBearing(
                  'bearingPlatesSetHorizontal',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Bearing Pre-Set with Respect to Axis"
              value={fixingOfBearingData.bearingPreSetWithAxis}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfBearing('bearingPreSetWithAxis', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Supports Provided to Hold Bearing in Position"
              value={fixingOfBearingData.supportsProvidedToHoldBearing}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfBearing(
                  'supportsProvidedToHoldBearing',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Anchor Bolt Holes Matching"
              value={fixingOfBearingData.anchorBoltHolesMatching}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfBearing(
                  'anchorBoltHolesMatching',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Void Beneath Bearing Filled with Bedding Material"
              value={fixingOfBearingData.voidBeneathBearingFilled}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfBearing(
                  'voidBeneathBearingFilled',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Bearing Fixed with Metal Bedding Plate"
              value={fixingOfBearingData.bearingFixedWithMetalBedding}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfBearing(
                  'bearingFixedWithMetalBedding',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Threaded Fastener Tightened Uniformly"
              value={fixingOfBearingData.threadedFastenerTightenedUniformly}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfBearing(
                  'threadedFastenerTightenedUniformly',
                  value,
                )
              }
              isRequired={true}
            />

            {/* Common fields for Date, Time, Recommendations */}
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
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.REMOVAL_OF_TEMPORARY_STRUCTURE:
        return (
          <View>
            <DropdownPicker
              label="Whether Concrete Has Achieved Desired Strength"
              value={removalOfTemporaryStructureData.concreteAchievedStrength}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeRemovalOfTemporaryStructure(
                  'concreteAchievedStrength',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Whether Minimum Time Has Been Attained"
              value={removalOfTemporaryStructureData.minimumTimeAttained}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeRemovalOfTemporaryStructure(
                  'minimumTimeAttained',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Whether All Main Components Tightened and Fixed at Their Position"
              value={removalOfTemporaryStructureData.allComponentsTightened}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeRemovalOfTemporaryStructure(
                  'allComponentsTightened',
                  value,
                )
              }
              isRequired={true}
            />

            <View>
              {/* this should present irrespective of property */}
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
      case TASK_TYPES.INSTALLATION_OF_EXPANSION_JOINT:
        return (
          <View>
            <DropdownPicker
              label="Expansion Joint in the Right Position"
              value={
                installationOfExpansionJointData.expansionJointPositionCorrect
              }
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeInstallationOfExpansionJoint(
                  'expansionJointPositionCorrect',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Shipping Devices or Stabilizers Removed"
              value={installationOfExpansionJointData.shippingDevicesRemoved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeInstallationOfExpansionJoint(
                  'shippingDevicesRemoved',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="No Foreign Objects Impending the Expansion Joint"
              value={installationOfExpansionJointData.noForeignObjects}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeInstallationOfExpansionJoint(
                  'noForeignObjects',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Materials Flowing in the Right Direction"
              value={installationOfExpansionJointData.materialsFlowProperly}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeInstallationOfExpansionJoint(
                  'materialsFlowProperly',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Anchors and Supports Match System Drawing"
              value={installationOfExpansionJointData.anchorsAndSupportsMatched}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeInstallationOfExpansionJoint(
                  'anchorsAndSupportsMatched',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Joints Properly Aligned"
              value={installationOfExpansionJointData.jointsProperlyAligned}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeInstallationOfExpansionJoint(
                  'jointsProperlyAligned',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="No Damage Sustained During Shipping or Installation"
              value={installationOfExpansionJointData.noDamageSustained}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeInstallationOfExpansionJoint(
                  'noDamageSustained',
                  value,
                )
              }
              isRequired={true}
            />

            <View>
              {/* Common components irrespective of property */}
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
      case TASK_TYPES.PAINTING:
        return (
          <View>
            <DropdownPicker
              label="Painting System Including Materials and Color Shades Approved"
              value={paintingData.paintingSystemApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('paintingSystemApproved', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Method Statement, QCP, ITP & Risk Assessment Approved"
              value={paintingData.documentsApproved}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('documentsApproved', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Surface Preparation Done as Per Approved Method Statement"
              value={paintingData.surfacePreparationDone}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('surfacePreparationDone', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Defects in Substrate Corrected"
              value={paintingData.defectsCorrected}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('defectsCorrected', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Moisture Content Checked"
              value={paintingData.moistureContentChecked}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('moistureContentChecked', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Plaster Surfaces Rubbed Down with Rubbing Stone"
              value={paintingData.plasterSurfacesRubbed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('plasterSurfacesRubbed', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Material Thoroughly Stirred Prior to Application"
              value={paintingData.materialStirred}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('materialStirred', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Filler Coat Applied Only After Curing Period of Primer"
              value={paintingData.fillerCoatAfterPrimer}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('fillerCoatAfterPrimer', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Suction Spots Covered with Primer Prior to Filler Coat Application"
              value={paintingData.suctionSpotsPrimed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('suctionSpotsPrimed', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Filler Coat Applied Evenly and All Angles and Corners are Straight"
              value={paintingData.fillerCoatAppliedEvenly}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('fillerCoatAppliedEvenly', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Sanding Done Between Coats"
              value={paintingData.sandingBetweenCoats}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('sandingBetweenCoats', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Drying Time Allowed as Per Approved Method Statement"
              value={paintingData.dryingTimeAllowed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('dryingTimeAllowed', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Materials Mixed Properly"
              value={paintingData.materialsMixedProperly}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('materialsMixedProperly', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="First Coat Applied by Roller Over the Whole Surface"
              value={paintingData.firstCoatAppliedByRoller}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('firstCoatAppliedByRoller', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Roller Joints Checked"
              value={paintingData.rollerJointsChecked}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('rollerJointsChecked', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Curing Period Allowed as Per Approved Method Statement"
              value={paintingData.curingPeriodAllowed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('curingPeriodAllowed', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Second Coat Applied After Touch Up on First Coat"
              value={paintingData.secondCoatAfterTouchUp}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('secondCoatAfterTouchUp', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Final Coat Applied"
              value={paintingData.finalCoatApplied}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('finalCoatApplied', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Cleaning and Protection of Adjacent Surfaces"
              value={paintingData.cleaningAndProtection}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangePainting('cleaningAndProtection', value)
              }
              isRequired={true}
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
      case TASK_TYPES.AUTO_LAUNCHING:
        return (
          <View>
            <DropdownPicker
              label="First Span Lowering on Temporary Steel Stools Completed"
              value={autoLaunchingData.firstSpanLowering}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('firstSpanLowering', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Slider as per Drawing/Methodology"
              value={autoLaunchingData.sliderPerDrawing}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('sliderPerDrawing', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Middle Support Leveling & Alignment Completed"
              value={autoLaunchingData.middleSupportLeveling}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('middleSupportLeveling', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Rear Support Leveling & Alignment Completed"
              value={autoLaunchingData.rearSupportLeveling}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('rearSupportLeveling', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Check for Hydraulic Jacks at Mid & Rear Support (Alignment & Seating)"
              value={autoLaunchingData.checkHydraulicJacks}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('checkHydraulicJacks', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure All Vertical Jacks at Mid Support are Connected to Single Power Pack"
              value={autoLaunchingData.allVerticalJacksMidSupport}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching(
                  'allVerticalJacksMidSupport',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure All Vertical Jacks at Rear Support are Connected to Single Power Pack"
              value={autoLaunchingData.allVerticalJacksRearSupport}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching(
                  'allVerticalJacksRearSupport',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Cleanliness and Application of Lubricant on Sliding Surfaces at Mid & Rear Support"
              value={autoLaunchingData.cleanlinessAndApplicationLubricant}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching(
                  'cleanlinessAndApplicationLubricant',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Physically Checked All Accessories of Launching (Rear Support, Middle Support, Anchoring Bolt)"
              value={autoLaunchingData.physicallyCheckedAllAccessories}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching(
                  'physicallyCheckedAllAccessories',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Pins Between Jack and Monorail are Properly Fixed & in Good Condition"
              value={autoLaunchingData.jackAndMonorailProperlyFixed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching(
                  'jackAndMonorailProperlyFixed',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Knuckle Bearing in Position"
              value={autoLaunchingData.knuckleBearing}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('knuckleBearing', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Guide Rollers in Place and Functioning"
              value={autoLaunchingData.guideRollers}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('guideRollers', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Macalloy Bars Stressed - Mid Support & Rear Support"
              value={autoLaunchingData.macalloyBarsStressed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('macalloyBarsStressed', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Front Support Telescopic Leg Closed Properly"
              value={autoLaunchingData.frontSupportTelescopic}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('frontSupportTelescopic', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Lock Nuts Arrangement at Mid & Rear Support is Unlocked"
              value={autoLaunchingData.lockNutsArrangement}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('lockNutsArrangement', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Check Pressure on Mid Support and Rear Support Jacks"
              value={autoLaunchingData.pressureOnMidRearSupport}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching(
                  'pressureOnMidRearSupport',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Gradient of Auto Launching Checked"
              value={autoLaunchingData.gradient}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('gradient', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Check Alignment of Track Rail for Rear Trolley Movement"
              value={autoLaunchingData.alignmentOfTrackRail}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('alignmentOfTrackRail', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Front Support is at Correct Position to Lower Legs as per Methodology Drawing"
              value={autoLaunchingData.frontSupportCorrectPosition}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching(
                  'frontSupportCorrectPosition',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Front Support Pins are Properly Placed and Locked"
              value={autoLaunchingData.frontSupportPins}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('frontSupportPins', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Inserts at Pier Cap are Tightened Properly"
              value={autoLaunchingData.insertsPierCap}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('insertsPierCap', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Front Support is Engaged Properly"
              value={autoLaunchingData.frontSupportEngaged}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('frontSupportEngaged', value)
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Ensure Entire Area is Barricaded"
              value={autoLaunchingData.entireAreaBarricaded}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeAutoLaunching('entireAreaBarricaded', value)
              }
              isRequired={true}
            />

            {/* Date, Time, and Comments Fields */}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
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

      case TASK_TYPES.PROCUREMENT_OF_STRUCTURAL_STEEL:
        return (
          <View>
            <Input
              label="Total qty of steel procured in tonne"
              value={procurementOfSteelData.totalQtyOfSteelProcured}
              onChange={(value: string) =>
                handleTextInputChangeProcurementOfSteel(
                  'totalQtyOfSteelProcured',
                  value,
                )
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
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
      case TASK_TYPES.TRANSPORTATION_OF_MATERIAL:
        <View>
          <Input
            label="Transit Time in hrs"
            value={transportationData.transitTime}
            onChange={(value: string) =>
              handleTextInputChangeTransportation('transitTime', value)
            }
            isRequired={true}
          />
          <View>
            <CalendarPicker
              label="Date"
              value={rfiDate}
              onChange={date => setRFIDate(date)}
            />
            <TimePicker
              label="Time"
              value={rfiTime}
              onChange={time => setRFITime(time)}
            />
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
        </View>;
      case TASK_TYPES.FIXING_OF_SHEATHING_JOINTS:
        return (
          <View>
            <DropdownPicker
              label="All Temporary Openings in Sheathing Satisfactory Plugged"
              value={fixingOfSheathingJointsData.temporaryOpeningsPlugged}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfSheathingJoints(
                  'temporaryOpeningsPlugged',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Has Joint Water Tight"
              value={fixingOfSheathingJointsData.jointWaterTight}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfSheathingJoints(
                  'jointWaterTight',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Sheathing Neatly Fitted at Joint without Internal Projection"
              value={fixingOfSheathingJointsData.sheathingNeatlyFitted}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfSheathingJoints(
                  'sheathingNeatlyFitted',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Sheathing Tightly Fitted on Anchorage End and Sealed with Tape"
              value={fixingOfSheathingJointsData.anchorageEndSealed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfSheathingJoints(
                  'anchorageEndSealed',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Coupler Tightly Screwed on Outer Side of Sheathing Duct"
              value={fixingOfSheathingJointsData.couplerTightlyScrewed}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfSheathingJoints(
                  'couplerTightlyScrewed',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Length of Coupler Not Less Than 150mm (Up to 200mm)"
              value={fixingOfSheathingJointsData.couplerLengthSufficient}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfSheathingJoints(
                  'couplerLengthSufficient',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Joint Between Coupler End and Duct Sealed with Tape"
              value={fixingOfSheathingJointsData.jointSealedWithTape}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfSheathingJoints(
                  'jointSealedWithTape',
                  value,
                )
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Coupler of Adjacent Duct Staggered"
              value={fixingOfSheathingJointsData.couplerStaggered}
              items={YES_NO_LIST}
              onChange={(value: string) =>
                handleInputChangeFixingOfSheathingJoints(
                  'couplerStaggered',
                  value,
                )
              }
              isRequired={true}
            />

            <View>
              {/* Common Date and Time Picker Section */}
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
      case TASK_TYPES.FIXING_OF_GEO_GRID:
        const fixingOfGeoGridProperties = [
          {
            title: 'Material of Geo Grid Approved by Engineer',
            key: 'materialApprovedByEngineer',
          },
          {
            title: 'Specifications/Strength as per Approved Drawing',
            key: 'specificationsAsPerApprovedDrawing',
          },
          {
            title:
              'Underneath Soil Layer Compacted, Tested (Moisture & Density)',
            key: 'soilProperlyCompacted',
          },
          {
            title: 'Geo Grids Properly Anchored into Facia Panels',
            key: 'geoGridsAnchoredIntoFaciaPanels',
          },
          {
            title: 'Geo Grids Properly Tensioned and Nailed into Soil',
            key: 'geoGridsTensionedAndNailed',
          },
          {
            title: 'Minimum Length of Geo Grid as per Approved Drawing',
            key: 'minimumLengthAsPerApprovedDrawing',
          },
        ];

        return (
          <View>
            {fixingOfGeoGridProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfGeoGridData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfGeoGridData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* This section can remain the same for date, time, and recommendations */}
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
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_FRICTION_SLAB:
        const erectionOfFrictionSlabProperties = [
          {
            title: 'Friction Slab cum Crash Barrier has Sufficient Strength',
            key: 'sufficientStrength',
          },
          {
            title: 'Friction Slab cum Crash Barrier Not Damaged',
            key: 'notDamaged',
          },
          {
            title: 'Line/Levels Checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Vertical Slope as per Drawing',
            key: 'verticalSlopeAsPerDrawing',
          },
          {
            title: 'Soil Compacted & Geo Grids Fixed under Panels',
            key: 'soilCompactedAndGeoGridsFixed',
          },
          {
            title: 'Coping Done',
            key: 'copingDone',
          },
        ];

        return (
          <View>
            {erectionOfFrictionSlabProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={erectionOfFrictionSlabData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setErectionOfFrictionSlabData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* Common Section for Date, Time, and Recommendations */}
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
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_FACIA_PANELS:
        const erectionOfFaciaPanelsProperties = [
          {
            title: 'Facia Panels have Sufficient Strength',
            key: 'sufficientStrength',
          },
          {
            title: 'Facia Panels Not Damaged',
            key: 'notDamaged',
          },
          {
            title: 'Line/Levels Checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Male-Female Joints Checked',
            key: 'maleFemaleJointsChecked',
          },
          {
            title: 'Vertical Slope as per Drawing',
            key: 'verticalSlopeAsPerDrawing',
          },
          {
            title: 'Soil Compacted & Geo Grids Fixed under Panels',
            key: 'soilCompactedAndGeoGridsFixed',
          },
        ];

        return (
          <View>
            {erectionOfFaciaPanelsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={erectionOfFaciaPanelsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setErectionOfFaciaPanelsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* Common Section for Date, Time, and Recommendations */}
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
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_COLUMNS:
        const erectionOfColumnsProperties = [
          {
            title: 'Position Checked',
            key: 'positionChecked',
          },
          {
            title: 'Welding Done as per Approved Drawing',
            key: 'weldingAsPerDrawing',
          },
          {
            title: 'Columns are as per Approved Drawing',
            key: 'columnsAsPerDrawing',
          },
          {
            title: 'Necessary Support Provided',
            key: 'supportProvided',
          },
        ];

        return (
          <View>
            {erectionOfColumnsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={erectionOfColumnsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setErectionOfColumnsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* Common Section for Date, Time, and Recommendations */}
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
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.APPLICATION_OF_FILTER_MEDIA:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Filter Media is as per the approved drawing"
                value={applicationOfFilterMediaData.filterMediaAsPerDrawing}
                items={YES_NO_LIST}
                onChange={(value: any) =>
                  setApplicationOfFilterMediaData(prevData => ({
                    ...prevData,
                    filterMediaAsPerDrawing: value,
                  }))
                }
                isRequired={true}
              />
            </View>

            {/* Common Section for Date, Time, and Recommendations */}
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
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_BRACINGS:
        const fixingOfBracingsProperties = [
          {
            title: 'Line/Levels Checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Welding Done as per Approved Drawing',
            key: 'weldingAsPerApprovedDrawing',
          },
          {
            title: 'Bracings are as per Approved Drawing',
            key: 'bracingsAsPerApprovedDrawing',
          },
        ];

        return (
          <View>
            {fixingOfBracingsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfBracingsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfBracingsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* Common Section for Date, Time, and Recommendations */}
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
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_RAILING:
        const fixingOfRailingProperties = [
          {
            title: 'Line/Levels Checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Railing is as per Approved Drawing',
            key: 'railingAsPerApprovedDrawing',
          },
        ];

        return (
          <View>
            {fixingOfRailingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfRailingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfRailingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* Common Section for Date, Time, and Recommendations */}
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
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.PROCUREMENT_OF_SHEET:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Input
                label="Total Sheet purchased (sqm)"
                value={procurementOfSheetData.totalSheetPurchased}
                onChange={(value: any) =>
                  setProcurementOfSheetData(prevData => ({
                    ...prevData,
                    totalSheetPurchased: value,
                  }))
                }
                isRequired={true}
              />
            </View>

            <View>
              {/* This section can remain the same for date, time, and recommendations */}
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
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.DUMPING_OF_SOIL:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Soil from Approved Source"
                value={dumpingOfSoilData.soilApprovedSource}
                items={YES_NO_LIST}
                onChange={(value: any) =>
                  setDumpingOfSoilData(prevData => ({
                    ...prevData,
                    soilApprovedSource: value,
                  }))
                }
                isRequired={true}
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                label="Soil without Unwanted Materials"
                value={dumpingOfSoilData.soilWithoutUnwantedMaterials}
                items={YES_NO_LIST}
                onChange={(value: any) =>
                  setDumpingOfSoilData(prevData => ({
                    ...prevData,
                    soilWithoutUnwantedMaterials: value,
                  }))
                }
                isRequired={true}
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Quantity of Soil Dumped (cum)"
                value={dumpingOfSoilData.quantityOfSoilDumped}
                onChange={(value: any) =>
                  setDumpingOfSoilData(prevData => ({
                    ...prevData,
                    quantityOfSoilDumped: value,
                  }))
                }
                isRequired={true}
              />
            </View>

            {/* Date and Time */}
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

            {/* Recommendations */}
            <View style={{flexDirection: 'column', paddingBottom: 20}}>
              <Text style={styles.Lable}>Recommendations</Text>
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                autoCapitalize="none"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.BORING_OF_DIAPHRAGM:
        return (
          <View>
            <View>
              {/* Density of Polymer */}
              <Input
                label="Density of Polymer (gm/ml)"
                value={boringOfDiaphragmData.densityOfPolymer}
                onChange={(value: string) =>
                  handleBoringOfDiaphragmInputChange('densityOfPolymer', value)
                }
                isRequired={true}
              />

              {/* Viscosity of Polymer */}
              <Input
                label="Viscosity of Polymer (sec/liter)"
                value={boringOfDiaphragmData.viscosityOfPolymer}
                onChange={(value: string) =>
                  handleBoringOfDiaphragmInputChange(
                    'viscosityOfPolymer',
                    value,
                  )
                }
                isRequired={true}
              />

              {/* pH Value of Polymer */}
              <Input
                label="pH Value of Polymer"
                value={boringOfDiaphragmData.pHValueOfPolymer}
                onChange={(value: string) =>
                  handleBoringOfDiaphragmInputChange('pHValueOfPolymer', value)
                }
                isRequired={true}
              />

              {/* Sand Content of Polymer */}
              <Input
                label="Sand Content of Polymer (%)"
                value={boringOfDiaphragmData.sandContentOfPolymer}
                onChange={(value: string) =>
                  handleBoringOfDiaphragmInputChange(
                    'sandContentOfPolymer',
                    value,
                  )
                }
                isRequired={true}
              />

              {/* Depth of Wall */}
              <Input
                label="Depth of Wall (mtr)"
                value={boringOfDiaphragmData.depthOfWall}
                onChange={(value: string) =>
                  handleBoringOfDiaphragmInputChange('depthOfWall', value)
                }
                isRequired={true}
              />
            </View>
            <View>
              {/* Date, time, and recommendations remain the same */}
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <Text style={styles.Lable}>Recommendations</Text>
                <TextInput
                  style={styles.commonInputFiels}
                  placeholder="Recommendations"
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.PRE_STRESSING:
        return (
          <View>
            <View style={styles.MainContainer}>
              <ScrollView
                id="scrollViewPrestressing"
                showsHorizontalScrollIndicator={false}
                horizontal={enableScroll}>
                <View>
                  {renderPrestressingHeadings()}
                  <FlatList
                    data={prestressingData}
                    renderItem={renderItemPrestressing}
                    keyExtractor={item => item.key?.toString()}
                    style={{zIndex: 10}}
                    automaticallyAdjustContentInsets={true}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
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
      case TASK_TYPES.ERECTION:
        const erectionProperties = [
          {
            title: 'Ground properly leveled for trailer placement',
            key: 'groundLeveled',
          },
          {
            title: 'Area is barricaded with proper signages',
            key: 'areaBarricaded',
          },
          {
            title: 'Temporary lights for proper illumination at night',
            key: 'temporaryLights',
          },
          {title: 'Flag man/Marshal available', key: 'flagManAvailable'},
          {
            title: 'Methodology & Scheme available at site',
            key: 'methodologyAvailable',
          },
          {title: 'Crane positioned as per drawing', key: 'cranePositioned'},
          {title: 'De-shackles certified', key: 'deShacklesCertified'},
          {
            title: 'Safety color code present on de-shackles',
            key: 'safetyColorCode',
          },
          {
            title: 'Hydraulic jacks calibrated',
            key: 'hydraulicJacksCalibrated',
          },
          {
            title: 'Limit switch of hoist working properly',
            key: 'limitSwitchWorking',
          },
          {
            title: 'Cotter pins placed in lifting assembly',
            key: 'cotterPinPlaced',
          },
          {
            title: 'Macalloy bars in proper condition',
            key: 'macalloyBarsCondition',
          },
          {title: 'TPI of Cranes & Slings done', key: 'tpiDone'},
          {
            title: 'TPI certificates available',
            key: 'tpiCertificatesAvailable',
          },
          {
            title: 'Counter-weights placed as per drawing',
            key: 'counterWeightsPlaced',
          },
          {title: 'Positioning marked at site', key: 'positioningMarked'},
          {
            title: 'Traffic diverted & marshals in place',
            key: 'trafficDiverted',
          },
          {title: 'Workers safety certified', key: 'workersSafetyCertified'},
          {title: 'Safety arrangements at site', key: 'safetyArrangements'},
          {title: 'Positioned at marked location', key: 'sitePositioned'},
          {
            title: 'Lateral support ensured before release',
            key: 'lateralSupportEnsured',
          },
        ];
        return (
          <View>
            {erectionProperties.map(property => (
              <View key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={erectionData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setErectionData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
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
      case TASK_TYPES.STRIPPING_AND_STORING_TOP_SOIL:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Input
                label="Qty of Top Soil collected and stored (cum)"
                value={strippingAndStoringTopSoilData.topSoilCollectedStored}
                onChange={(value: any) =>
                  setStrippingAndStoringTopSoilData(prevData => ({
                    ...prevData,
                    topSoilCollectedStored: value,
                  }))
                }
                isRequired={true}
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
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.SPREADING_AND_COMPACTION:
        const spreadingAndCompactionProperties = [
          {
            title: 'Source of material is approved',
            key: 'sourceOfMaterialApproved',
          },
          {
            title: 'Ground improvement is done if required',
            key: 'groundImprovementDone',
          },
          {
            title: 'Under laying layer is approved',
            key: 'underLayingLayerApproved',
          },
          {
            title:
              'Adequate grade and survey stakes available for control of layer placement',
            key: 'gradeSurveyStakesAvailable',
          },
          {
            title:
              'Adequate no. of grader available for spreading and levelling of fill',
            key: 'graderAvailable',
          },
          {
            title: 'Grading is done as per the required gradient and camber',
            key: 'gradingDoneAsPerRequirement',
          },
          {
            title:
              'Uniform sprinkling of water done on previous layer if required',
            key: 'uniformSprinklingDone',
          },
          {title: 'Dumping pattern is followed', key: 'dumpingPatternFollowed'},
          {
            title: 'Material free from deleterious material',
            key: 'materialFreeFromDeleterious',
          },
          {
            title: 'Material contains over size boulders/ stones',
            key: 'containsOverSizeBoulders',
          },
          {
            title: 'Loose thickness of layer checked',
            key: 'looseThicknessChecked',
          },
          {
            title: 'OMC is maintained before commencement of rolling',
            key: 'omcMaintained',
          },
          {
            title: 'Suitable roller available for compaction',
            key: 'suitableRollerAvailable',
          },
          {
            title: 'Number of passes, speed, and rolling pattern followed',
            key: 'rollingPatternFollowed',
          },
          {
            title: 'Finished compacted layer thickness is as specified',
            key: 'finishedLayerThicknessSpecified',
          },
          {
            title: 'Any localized wet, soft, and under compacted area found',
            key: 'localizedIssuesFound',
          },
          {
            title: 'Layer is free from segregation',
            key: 'layerFreeFromSegregation',
          },
          {
            title: 'Arrangement for protection of finished surface available',
            key: 'protectionOfFinishedSurfaceAvailable',
          },
          {
            title: 'Any non-conformance/ noncompliance found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {spreadingAndCompactionProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={spreadingAndCompactionData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setSpreadingAndCompactionData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PRIME_COAT:
      case TASK_TYPES.TACK_COAT:
        const primeCoatProperties = [
          {
            title: 'Previous Layer Approved',
            key: 'previousLayerApproved',
          },
          {
            title: 'Surface Preparation Satisfactory (Surface Condition)',
            key: 'surfacePreparationSatisfactory',
          },
          {
            title: 'Grade of Material Approved',
            key: 'materialGradeApproved',
          },
          {
            title: 'Bituminous Emulsion Temperature Checked',
            key: 'bituminousEmulsionTemperatureChecked',
          },
          {
            title: 'Uniform Rate of Spray',
            key: 'uniformSprayRate',
          },
          {
            title: 'Non-Conformance/Non-Compliance Found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {primeCoatProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={primeCoatData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPrimeCoatData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* Date and Time Pickers */}
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
                  multiline={true}
                  numberOfLines={4}
                  blurOnSubmit={false}
                  value={comments}
                  onChangeText={text => setComments(text)}
                />
              </View>
            </View>
          </View>
        );
      case TASK_TYPES.ROAD_MARKING:
        const roadMarkingProperties = [
          {
            title: 'Drawing & Method Statement Approved by Client',
            key: 'drawingAndMethodApproved',
          },
          {
            title: 'Thermoplastic Paint & Glass Bead Approved by Client',
            key: 'thermoplasticAndGlassBeadApproved',
          },
          {
            title: 'Heater Condition and Laying Checked',
            key: 'heaterConditionChecked',
          },
          {
            title: 'Thermometer of Heater Working Properly',
            key: 'thermometerWorking',
          },
          {
            title: 'Thermoplastic Material Heated to Specified Temperature',
            key: 'materialHeatedToSpecifiedTemperature',
          },
          {
            title: 'Surface is Free from Dust, Dirt, Grease, and Oil',
            key: 'surfaceClean',
          },
          {
            title: 'Marking Done Before Laying Thermoplastic',
            key: 'markingDoneBeforeLaying',
          },
          {
            title: 'Glass Beads Applied at Rate of 250gms/sqm',
            key: 'glassBeadsApplied',
          },
          {
            title: 'Thermoplastic Paint Laid in Molten State',
            key: 'paintLaidInMoltenState',
          },
          {
            title: 'Thermoplastic Paint Thickness Checked',
            key: 'paintThicknessChecked',
          },
          {
            title: 'Non-conformance/Non-compliance Found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {roadMarkingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={roadMarkingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setRoadMarkingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              {/* This section for date, time, and recommendations remains the same */}
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_AND_COMPACTION:
        const layingAndCompactionProperties = [
          {
            title: 'All Safety Measures Taken as per Plan',
            key: 'safetyMeasuresTaken',
          },
          {
            title: 'Approved Methodology Available with Paving-in-Charge',
            key: 'approvedMethodologyAvailable',
          },
          {
            title: 'Prime Coat Cured and Cleaned Properly',
            key: 'primeCoatCured',
          },
          {
            title: 'Rate of Spray for Tact Coat Checked & Recorded',
            key: 'sprayRateChecked',
          },
          {
            title: 'Joint Trimmed & Prepared as per Method Statement',
            key: 'jointTrimmedPrepared',
          },
          {
            title: 'Program of Laying Conveyed to Plant and QA/QC',
            key: 'programConveyed',
          },
          {
            title: 'Thermometer Available at Laying Location',
            key: 'thermometerAvailable',
          },
          {
            title: 'Paver Sensors Set as per Requirement',
            key: 'paverSensorsSet',
          },
          {title: 'Alignment Marked with Lime Powder', key: 'alignmentMarked'},
          {
            title: 'Paver Placed & Skeed Cleaned at Laying Area',
            key: 'paverPlacedCleaned',
          },
          {
            title: 'Mix Transported with Tarpaulin Covering',
            key: 'mixTransported',
          },
          {
            title: 'Mix Temperature as per Table 500-2',
            key: 'mixTemperatureFound',
          },
          {
            title: 'Loose Thickness Checked for Required Compactness',
            key: 'looseThicknessChecked',
          },
          {
            title: 'Rolling Pattern Followed as per Trial Patch',
            key: 'rollingPatternFollowed',
          },
          {
            title: 'Surface Level Checked within Tolerance',
            key: 'surfaceLevelChecked',
          },
          {
            title: 'Transverse Joints Prepared as per Method Statement',
            key: 'transverseJointsPrepared',
          },
          {
            title: 'Non-conformance/Non-compliance Found',
            key: 'nonConformanceFound',
          },
        ];
        return (
          <View>
            {layingAndCompactionProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={layingAndCompactionData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setLayingAndCompactionData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Thickness of Layer Laid in mm"
              value={layingAndCompactionData.layerThickness}
              onChange={(value: any) =>
                setLayingAndCompactionData(prevData => ({
                  ...prevData,
                  layerThickness: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Material Qty Laid in Tonne"
              value={layingAndCompactionData.totalMaterialQtyLaid}
              onChange={(value: any) =>
                setLayingAndCompactionData(prevData => ({
                  ...prevData,
                  totalMaterialQtyLaid: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Material Qty in Sqm"
              value={layingAndCompactionData.totalMaterialQtySqm}
              onChange={(value: any) =>
                setLayingAndCompactionData(prevData => ({
                  ...prevData,
                  totalMaterialQtySqm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PIPE_LAYING_AND_JOINTING:
        const pipeLayingAndJointingProperties = [
          {
            title: 'Ensure all material as per GFC drawing',
            key: 'materialAsPerGFC',
          },
          {
            title: 'Check for availability of the latest GFC drawing',
            key: 'latestGFCAvailable',
          },
          {
            title: 'Location, levels, pipe size as per GFC',
            key: 'locationLevelsPipeSizeAsPerGFC',
          },
          {
            title: 'Check routing of pipe as per drawing',
            key: 'routingCheckedAsPerGFC',
          },
          {
            title: 'Check hanger & support spacing as per drawing',
            key: 'hangerSupportProperSpacing',
          },
          {
            title: 'Fastener & hanger rod as per drawing',
            key: 'fastenerHangerRodAsPerGFC',
          },
          {
            title: 'Joint preparation & fit-up proper',
            key: 'jointPreparationFitUp',
          },
          {
            title: 'Visual inspection of welded joints',
            key: 'visualInspectionOfWeldedJoints',
          },
          {title: 'Thread check for pipe joints', key: 'threadCheckForJoints'},
          {
            title: 'Threaded joints properly tightened',
            key: 'threadedJointsTightened',
          },
          {
            title:
              'Bituminous paint & polythene tape applied to underground GI piping',
            key: 'undergroundGIPipingTreatment',
          },
          {
            title: 'Threaded pipes aligned and straight',
            key: 'threadedPipesAlignedStraight',
          },
          {
            title: 'Installed pipes aligned properly',
            key: 'installedPipesAlignedProperly',
          },
        ];

        return (
          <View>
            {pipeLayingAndJointingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={pipeLayingAndJointingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPipeLayingAndJointingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Length of Pipe Laid in Meters"
              value={pipeLayingAndJointingData.totalPipeLength}
              onChange={(value: any) =>
                setPipeLayingAndJointingData(prevData => ({
                  ...prevData,
                  totalPipeLength: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Number of Pipes Laid"
              value={pipeLayingAndJointingData.totalNumberOfPipes}
              onChange={(value: any) =>
                setPipeLayingAndJointingData(prevData => ({
                  ...prevData,
                  totalNumberOfPipes: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_METAL_BEAM:
        const fixingOfMetalBeamProperties = [
          {
            title:
              'Distance maintained between barrier and start of embankment slope',
            key: 'barrierToEmbankmentDistance',
          },
          {
            title:
              'Distance maintained between barrier and edge of carriageway',
            key: 'barrierToEdgeOfCarriagewayDistance',
          },
          {
            title:
              'At median, W-beam face is 100 mm away from carriageway face of median',
            key: 'medianWBeamFaceDistance',
          },
          {
            title: 'All spacers installed properly as per approved drawing',
            key: 'spacersInstalledProperly',
          },
          {
            title: 'All bolts are fixed and tightened properly',
            key: 'boltsFixedAndTightened',
          },
        ];

        return (
          <View>
            {fixingOfMetalBeamProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfMetalBeamData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfMetalBeamData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Length of Metal Beam Fixed in RM"
              value={fixingOfMetalBeamData.totalLengthOfMetalBeamFixed}
              onChange={(value: any) =>
                setFixingOfMetalBeamData(prevData => ({
                  ...prevData,
                  totalLengthOfMetalBeamFixed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_VERTICAL_POST:
        const fixingVerticalPostProperties = [
          {
            title: 'Pits Dugged/Drilled to Depth Indicated on Plan',
            key: 'pitsDuggedToPlan',
          },
          {
            title:
              'Distance Maintained Between Barrier and Start of Embankment Slope',
            key: 'distanceMaintainedBarrierSlope',
          },
          {
            title:
              'Distance Maintained Between Barrier and Edge of Carriageway',
            key: 'distanceMaintainedBarrierCarriageway',
          },
          {
            title:
              'Posts Aligned Properly & Height Above Ground as per Approved Drawing',
            key: 'postsAlignedHeightAsPerDrawing',
          },
          {
            title: 'Steel Posts Placed as per Methodology',
            key: 'steelPostsPlacedMethodology',
          },
          {
            title: 'Total No. of Vertical Post Installed',
            key: 'totalVerticalPostInstalled',
          },
        ];

        return (
          <View>
            {fixingVerticalPostProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingVerticalPostData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingVerticalPostData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Vertical Post Installed"
              value={fixingVerticalPostData.totalVerticalPostInstalled}
              onChange={(value: any) =>
                setFixingVerticalPostData(prevData => ({
                  ...prevData,
                  totalVerticalPostInstalled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CUTTING_OF_JOINTS:
        const cuttingOfJointsProperties = [
          {
            title: 'Is joints cut at desired intervals',
            key: 'jointsCutAtDesiredIntervals',
          },
          {
            title: 'Is joint cut at desired depth',
            key: 'jointsCutAtDesiredDepth',
          },
          {title: 'Is joint cut done properly', key: 'jointCutDoneProperly'},
        ];

        return (
          <View>
            {cuttingOfJointsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={cuttingOfJointsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setCuttingOfJointsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Length Completed in Km"
              value={cuttingOfJointsData.totalLengthCompleted}
              onChange={(value: any) =>
                setCuttingOfJointsData(prevData => ({
                  ...prevData,
                  totalLengthCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_PAVER_BLOCK:
        const layingOfPaverBlockProperties = [
          {
            title:
              'Top 150mm thick sub base layer spread levelled and compacted to 95% MMD?',
            key: 'subBaseCompacted',
          },
          {
            title:
              'Washed sand of appropriate thickness 50 mm as laying course?',
            key: 'sandLayingCourse',
          },
          {
            title: 'Paving Blocks from Approved Source',
            key: 'pavingBlocksApprovedSource',
          },
          {
            title:
              'Paving blocks dimension and finishing as per approved material submitted and shop drawing?',
            key: 'pavingBlocksDimension',
          },
          {
            title:
              'Paving blocks installation/ pattern done as per approved drawing',
            key: 'pavingBlocksInstallation',
          },
          {
            title:
              'Check Whether the plate compactor has been moved on laid paving blocks with dune sand spread over it?',
            key: 'plateCompactorMoved',
          },
          {
            title:
              'Check whether the joints between the paving blocks are as per method statement and joint filler spread on paving blocks and brushed between the blocks',
            key: 'jointsAsPerMethodStatement',
          },
          {
            title:
              'Location, Elevation, Level and Alignment of installed paver block are as per approved drawing and tolerances (+/- 6mm)',
            key: 'locationAlignmentCorrect',
          },
        ];

        return (
          <View>
            {layingOfPaverBlockProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={layingOfPaverBlockData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setLayingOfPaverBlockData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Length of Paver Block Laid (RM)"
              value={layingOfPaverBlockData.totalLengthLaid}
              onChange={(value: any) =>
                setLayingOfPaverBlockData(prevData => ({
                  ...prevData,
                  totalLengthLaid: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total SQM of Paver Blocks Laid"
              value={layingOfPaverBlockData.totalSqmLaid}
              onChange={(value: any) =>
                setLayingOfPaverBlockData(prevData => ({
                  ...prevData,
                  totalSqmLaid: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Thickness of Paver Block Laid (mm)"
              value={layingOfPaverBlockData.thicknessPaverBlock}
              onChange={(value: any) =>
                setLayingOfPaverBlockData(prevData => ({
                  ...prevData,
                  thicknessPaverBlock: value,
                }))
              }
              isRequired={true}
            />

            <DropdownPicker
              label="Grade of Concrete"
              value={layingOfPaverBlockData.gradeOfConcrete}
              items={['M20', 'M25', 'M30', 'M35', 'M40']}
              onChange={(value: any) =>
                setLayingOfPaverBlockData(prevData => ({
                  ...prevData,
                  gradeOfConcrete: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_DLC:
        if (!layingOfDlcTableData || !layingOfDlcTableData.length) {
          setLayingOfDlcTableData([
            {
              vehicleNo: '',
              totalQtyDlc: 0,
              layingStartTime: '',
              layingEndTime: '',
              key: Guid.create(),
            },
          ]);
        }
        const layingOfDLCProperties = [
          {
            title: 'Is the mix design of DLC approved?',
            key: 'mixDesignApproved',
          },
          {
            title: 'Is the under laying GSB layer approved?',
            key: 'gsbLayerApproved',
          },
          {
            title:
              'Are there adequate grade and survey stakes available for control of placement layers?',
            key: 'gradeSurveyStakesAvailable',
          },
          {
            title: 'Is the placing of material appropriate?',
            key: 'placingMaterialAppropriate',
          },
          {
            title: 'Is there paver available for the laying of DLC?',
            key: 'paverAvailable',
          },
          {
            title: 'Is the arrangement of curing available?',
            key: 'curingArrangementAvailable',
          },
          {
            title:
              'Are there adequate number of suitable rollers available for the compaction operation?',
            key: 'suitableRollersAvailable',
          },
          {
            title: 'Is the layer free from any segregation?',
            key: 'layersSegregationFree',
          },
          {
            title:
              'Is there any arrangement for protection of the finished surface?',
            key: 'surfaceProtectionArrangement',
          },
          {
            title: 'Is there adequate arrangement of light for night work?',
            key: 'lightArrangementForNightWork',
          },
          {
            title: 'Is the received batch slip as per approved mix design?',
            key: 'batchSlipAsPerMixDesign',
          },
          {
            title:
              'Whether the worker and staff have proper personal protection equipment (PPE)?',
            key: 'workerPPE',
          },
        ];

        return (
          <View>
            {layingOfDLCProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={layingOfDLCData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setLayingOfDLCData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Length of DLC Laid in Mtr"
              value={layingOfDLCData.totalLengthDLC}
              onChange={(value: any) =>
                setLayingOfDLCData(prevData => ({
                  ...prevData,
                  totalLengthDLC: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Area of DLC Laid in Sqm"
              value={layingOfDLCData.totalAreaDLC}
              onChange={(value: any) =>
                setLayingOfDLCData(prevData => ({
                  ...prevData,
                  totalAreaDLC: value,
                }))
              }
              isRequired={true}
            />
            <ScrollView horizontal={true}>
              <View>
                {renderLayingOfDlcHeadings()}
                <FlatList
                  data={layingOfDlcTableData}
                  renderItem={renderItemLayingOfDlc}
                  keyExtractor={item => item.key?.toString()}
                  automaticallyAdjustContentInsets={true}
                  scrollEnabled={false}
                />
              </View>
            </ScrollView>
            <TouchableOpacity onPress={() => onAddMoreLayingOfDlc()}>
              <Text>+ Add More</Text>
            </TouchableOpacity>
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.MACHINE_CUTTING_OF_JOINTS:
        const machineCuttingProperties = [
          {
            title: 'Is adequate no. of cutting saws available at site?',
            key: 'cuttingSawsAvailable',
          },
          {
            title:
              'Is adequate no. of diamond-edge saw blades available at site?',
            key: 'diamondSawBladesAvailable',
          },
          {
            title:
              'Is water tank with proper flexible hose and pump available at site?',
            key: 'waterTankAvailable',
          },
          {
            title:
              'Is machine cut started after 4-8 hr of initial setting time?',
            key: 'machineCutStartTimeCorrect',
          },
          {
            title: 'Is cutting done as per approved drawing?',
            key: 'cuttingAsPerApprovedDrawing',
          },
        ];

        return (
          <View>
            {machineCuttingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={machineCuttingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setMachineCuttingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACING_OF_TIE_BAR:
        const placingOfTieBarProperties = [
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the placing is done as per drawings',
            key: 'placingDoneAsPerDrawings',
          },
          {
            title: 'Whether the alignment done properly',
            key: 'alignmentDoneProperly',
          },
          {
            title: 'Was a Non-conformance/Non-compliance found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {placingOfTieBarProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={placingOfTieBarData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPlacingOfTieBarData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_WIRE_ROPE:
        const fixingOfWireRopeProperties = [
          {
            title: 'Strands are from Approved Source',
            key: 'strandsFromApprovedSource',
          },
          {
            title: 'End Attachments Cracked/Deformed/Worn',
            key: 'endAttachmentsCondition',
          },
          {
            title: 'Evidence of Heat Damage',
            key: 'heatDamageEvidence',
          },
          {
            title:
              'Kinking, Crushing, Bird Caging, or Other Damage Rectification',
            key: 'ropeDamageRectification',
          },
          {
            title: 'Proper Alignment as per Drawing',
            key: 'alignedProperlyAsPerDrawing',
          },
          {
            title: 'Strand Tensioned Tightly at Ends',
            key: 'strandTensionedAtEnds',
          },
        ];

        return (
          <View>
            {fixingOfWireRopeProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfWireRopeData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfWireRopeData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.TEXTURING:
        const texturingProperties = [
          {
            title: 'Steel Tines/Brush Automatic Sensing & Control Devices',
            key: 'steelTinesBrushAutomatic',
          },
          {
            title: 'Texturing Time Limits for Temperature Conditions',
            key: 'texturingWithinTimeLimits',
          },
          {
            title: 'Tining Unit Pressure Adjusted',
            key: 'tiningUnitPressureAdjusted',
          },
          {title: 'Tining Rakers Cleaned Properly', key: 'tiningRakersCleaned'},
          {title: 'Tines Bent or Damaged', key: 'tinesBentOrDamaged'},
          {
            title: 'Tined Groove Dimensions (3mm Wide, 3-4mm Deep)',
            key: 'tinedGrooveDimensionsCorrect',
          },
          {title: 'Surface Bleeding Done', key: 'surfaceBleedingDone'},
          {
            title: 'Brush Applied in One Direction',
            key: 'brushAppliedOneDirection',
          },
          {
            title: 'Brush for Texturing as per Morth Specification',
            key: 'brushAsPerMorthSpecification',
          },
        ];

        return (
          <View>
            {texturingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={texturingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setTexturingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Texturing Done (sqmtr)"
              value={texturingData.totalTexturingDone}
              onChange={(value: any) =>
                setTexturingData(prevData => ({
                  ...prevData,
                  totalTexturingDone: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACING_OF_DOWEL:
        const placingOfDowelProperties = [
          {
            title: 'Whether the PQC drawing approved',
            key: 'pqcDrawingApproved',
          },
          {
            title: 'Whether the dowel bars placed at the proper depth',
            key: 'dowelBarsPlacedProperDepth',
          },
          {
            title: 'Whether the bars are aligned properly',
            key: 'barsAlignedProperly',
          },
          {
            title: 'Is the dowel bar covered with plastic sheath',
            key: 'dowelBarCoveredWithPlasticSheath',
          },
          {title: 'Dia of the sheath in mm', key: 'sheathDia'},
          {title: 'Is sheath mouth closed properly', key: 'sheathMouthClosed'},
          {
            title: 'Is the Length of each dowel bar as per approved drawing',
            key: 'dowelBarLengthAsPerDrawing',
          },
          {title: 'Total number of dowel bars', key: 'totalDowelBars'},
        ];

        return (
          <View>
            {placingOfDowelProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={placingOfDowelData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPlacingOfDowelData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Dia of Sheath (in mm)"
              value={placingOfDowelData.sheathDia}
              onChange={(value: any) =>
                setPlacingOfDowelData(prevData => ({
                  ...prevData,
                  sheathDia: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total number of dowel bars"
              value={placingOfDowelData.totalDowelBars}
              onChange={(value: any) =>
                setPlacingOfDowelData(prevData => ({
                  ...prevData,
                  totalDowelBars: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACING_OF_FILLER_BOARD:
        const placingOfFillerBoardProperties = [
          {
            title: 'Is the source of filler board material approved',
            key: 'sourceApproved',
          },
          {
            title:
              'Is the joint surface free from dusts, flakes or other particles',
            key: 'surfaceFreeFromDust',
          },
          {
            title: 'Is filler board cut in proper shape and size',
            key: 'fillerBoardCutProperly',
          },
          {
            title: 'Is placing of filler board done properly',
            key: 'fillerBoardPlacedProperly',
          },
          {
            title: 'Is the filler board compressed to the desired level',
            key: 'fillerBoardCompressed',
          },
        ];

        return (
          <View>
            {placingOfFillerBoardProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={placingOfFillerBoardData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPlacingOfFillerBoardData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Thickness of Filler Board in mm"
              value={placingOfFillerBoardData.fillerBoardThickness}
              onChange={(value: any) =>
                setPlacingOfFillerBoardData(prevData => ({
                  ...prevData,
                  fillerBoardThickness: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Filler Board Qty in Sqmm"
              value={placingOfFillerBoardData.totalFillerBoardQty}
              onChange={(value: any) =>
                setPlacingOfFillerBoardData(prevData => ({
                  ...prevData,
                  totalFillerBoardQty: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.SEALANT_FILING:
        const sealantFilingProperties = [
          {
            title: 'Is the sealant source approved',
            key: 'sealantSourceApproved',
          },
          {
            title: 'Is the joint face cleaned properly',
            key: 'jointFaceCleaned',
          },
          {
            title: 'Is the sealant placed at the proper depth',
            key: 'sealantPlacedProperDepth',
          },
          {title: 'Is the two-coat primer done', key: 'twoCoatPrimerDone'},
          {
            title: 'Is the tapping done at the edges of joint face',
            key: 'tappingDoneEdges',
          },
          {
            title: 'Is the sealant poured properly',
            key: 'sealantPouredProperly',
          },
          {
            title: 'Is the tape removed after tooling of sealant',
            key: 'tapeRemovedAfterTooling',
          },
          {
            title: 'Is the arrangement made for curing',
            key: 'arrangementForCuring',
          },
        ];

        return (
          <View>
            {sealantFilingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={sealantFilingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setSealantFilingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Quantity of Sealant Utilized (in liters)"
              value={sealantFilingData.sealantQtyUtilized}
              onChange={(value: any) =>
                setSealantFilingData(prevData => ({
                  ...prevData,
                  sealantQtyUtilized: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.MILLING_OF_FLEXIBLE_PAVEMENT:
        const millingProperties = [
          {
            title: 'Is the milled surface uniform in texture?',
            key: 'milledSurfaceUniform',
          },
          {
            title:
              'Is the finished milled surface within 6-8 mm in both longitudinal and transverse directions?',
            key: 'finishedSurfaceWithinTolerance',
          },
          {
            title: 'Is the texture surface safe for motorists?',
            key: 'textureSafeForMotorist',
          },
          {
            title: 'Depth of Milling in mm',
            key: 'depthOfMilling',
          },
          {
            title: 'Total Quantity of Milled Material (cm)',
            key: 'totalQtyMilledMaterial',
          },
          {
            title: 'Total Surface Area Milled (Sqmm)',
            key: 'totalSurfaceAreaMilled',
          },
        ];

        return (
          <View>
            {millingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={millingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setMillingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Depth of Milling (mm)"
              value={millingData.depthOfMilling}
              onChange={(value: any) =>
                setMillingData(prevData => ({
                  ...prevData,
                  depthOfMilling: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Quantity of Milled Material (cm)"
              value={millingData.totalQtyMilledMaterial}
              onChange={(value: any) =>
                setMillingData(prevData => ({
                  ...prevData,
                  totalQtyMilledMaterial: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Surface Area Milled (Sqmm)"
              value={millingData.totalSurfaceAreaMilled}
              onChange={(value: any) =>
                setMillingData(prevData => ({
                  ...prevData,
                  totalSurfaceAreaMilled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_SEPARATION_MEMBRANE:
        const layingOfSeparationMembraneProperties = [
          {
            title:
              'The subbase / DLC layer swept clean of extraneous materials using air compressor and sprinkled with water to bring down the temperature of the PQC',
            key: 'subbaseSweptClean',
          },
          {
            title:
              'If any undulations visible after cleaning & sprinkling of water, it should be leveled with Mix of 10mm down aggregate to avoid restraint of Panel movement',
            key: 'undulationsLeveled',
          },
          {
            title:
              'Separation membrane shall be tight, straight, wrinkle free & anchored on Sub-base',
            key: 'membraneTightStraight',
          },
          {title: 'Colour of Separation Membrane', key: 'colourOfMembrane'},
          {
            title: 'Thickness of Separation Membrane',
            key: 'thicknessOfMembrane',
          },
          {
            title:
              'Proper overlapping provided in case of membrane is laid in part width',
            key: 'properOverlappingProvided',
          },
          {
            title: 'Finished Compacted Layer Thickness in mm',
            key: 'finishedCompactedLayerThickness',
          },
          {
            title: 'Any non-conformance/non-compliance found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {layingOfSeparationMembraneProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={layingOfSeparationMembraneData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setLayingOfSeparationMembraneData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Finished Compacted Layer Thickness in mm"
              value={
                layingOfSeparationMembraneData.finishedCompactedLayerThickness
              }
              onChange={(value: any) =>
                setLayingOfSeparationMembraneData(prevData => ({
                  ...prevData,
                  finishedCompactedLayerThickness: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_PQC:
        const layingOfPQCProperties = [
          {
            title:
              'Is the trail patch done and approved by the Engineer In Charge',
            key: 'trailPatchApproved',
          },
          {
            title: 'Is the mix design of PQC approved?',
            key: 'mixDesignApproved',
          },
          {
            title: 'Is the under laying DLC layer approved?',
            key: 'dlcLayerApproved',
          },
          {
            title:
              'Are there adequate grade and survey stakes available for control of placement layers?',
            key: 'adequateGradeSurveyStakes',
          },
          {
            title:
              'The PQC material is being transported by covering the tippers with tarpaulin to protect from the weather',
            key: 'pqcTransportedWithTarpaulin',
          },
          {
            title: 'Is the sufficient no. of labours available at laying site',
            key: 'sufficientLaboursAvailable',
          },
          {
            title:
              'Separation membrane shall be tight, straight, wrinkle free & anchored on Sub Base',
            key: 'separationMembraneTight',
          },
          {
            title: 'Dowel bars in the joints covered by thin plastic sheath',
            key: 'dowelBarsCoveredWithSheath',
          },
          {
            title:
              'Backhoe bucket of JCB available to protect damaging of separation membrane',
            key: 'backhoeBucketAvailable',
          },
          {
            title: 'Is paver available for the laying of DLC?',
            key: 'paverAvailableForDLC',
          },
          {
            title: 'Is the functioning of Paver checked?',
            key: 'paverFunctioningChecked',
          },
          {
            title: 'Is the placing of material appropriate?',
            key: 'materialPlacedAppropriately',
          },
          {
            title: 'Is the arrangement of curing available?',
            key: 'curingArrangementAvailable',
          },
          {
            title: 'Is the layers free from any segregation?',
            key: 'layersSegregationFree',
          },
          {
            title:
              'Is there any arrangement for protection of the finished surface?',
            key: 'surfaceProtectionArranged',
          },
          {
            title: 'Is there adequate arrangement of light for night work?',
            key: 'lightArrangementForNightWork',
          },
          {
            title: 'Whether the worker and staff have proper PPE?',
            key: 'ppeAvailable',
          },
        ];

        return (
          <View>
            {layingOfPQCProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={layingOfPQCData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setLayingOfPQCData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Lead of PQC Material (in Km)"
              value={layingOfPQCData.pqcLeadDistance}
              onChange={(value: any) =>
                setLayingOfPQCData(prevData => ({
                  ...prevData,
                  pqcLeadDistance: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of PQC Laid (in meters)"
              value={layingOfPQCData.totalPQCLaidLength}
              onChange={(value: any) =>
                setLayingOfPQCData(prevData => ({
                  ...prevData,
                  totalPQCLaidLength: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Area of PQC Laid (in sqm)"
              value={layingOfPQCData.totalPQCLaidArea}
              onChange={(value: any) =>
                setLayingOfPQCData(prevData => ({
                  ...prevData,
                  totalPQCLaidArea: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Thickness of PQC Laid (in mm)"
              value={layingOfPQCData.pqcThicknessLaid}
              onChange={(value: any) =>
                setLayingOfPQCData(prevData => ({
                  ...prevData,
                  pqcThicknessLaid: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.BACKFILLING:
        const backfillingProperties = [
          {
            title: 'Verify area is clear of debris and formwork materials',
            key: 'areaClearOfDebris',
          },
          {
            title:
              'Ensure backfilling starts after 7 days or 60% strength of concrete',
            key: 'backfillingTimingAppropriate',
          },
          {
            title:
              'Confirm fill materials are approved and comply with specifications',
            key: 'approvedFillMaterials',
          },
          {
            title: 'Check layer thickness does not exceed 200mm',
            key: 'layerThicknessCheck',
          },
          {
            title: 'Check compaction degree (95% according to Proctor test)',
            key: 'compactionDegreeCheck',
          },
          {
            title: 'Check required tests for each 200mm compacted layer',
            key: 'layerTestsDone',
          },
          {
            title: 'Verify level and elevation are correct',
            key: 'levelAndElevationVerified',
          },
          {
            title:
              'Ensure bedding material is compacted in trenches for services',
            key: 'beddingMaterialCompacted',
          },
          {
            title: 'Ensure waterproofing membrane, if any, is undamaged',
            key: 'waterproofingMembraneProtected',
          },
          {
            title: 'Ensure backfilling is complete and area is clean and tidy',
            key: 'backfillingCompleteAndClean',
          },
        ];

        return (
          <View>
            {backfillingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={backfillingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setBackfillingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Quantity of Soil Used in cum"
              value={backfillingData.totalSoilQtyUsed}
              onChange={(value: any) =>
                setBackfillingData(prevData => ({
                  ...prevData,
                  totalSoilQtyUsed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.BRICKS_WORK:
        const bricksWorkProperties = [
          {
            title: 'Are the latest "Good for Construction" drawings available',
            key: 'drawingsAvailable',
          },
          {
            title: 'Are the size and Class of bricks as per approved drawing',
            key: 'bricksSizeClassAsPerDrawing',
          },
          {
            title: 'Are the required number of blocks available',
            key: 'requiredBlocksAvailable',
          },
          {
            title:
              'Has the hacking at contact surfaces of columns and beams been done',
            key: 'hackingDone',
          },
          {
            title:
              'Has cement mortar slurry been applied over the hacked surface',
            key: 'cementMortarApplied',
          },
          {
            title:
              'Have aluminium templates been used for door/window openings',
            key: 'aluminiumTemplatesUsed',
          },
          {
            title: 'Are the required tools available',
            key: 'requiredToolsAvailable',
          },
          {
            title: 'Are there any specific requirements from the client',
            key: 'clientSpecificRequirements',
          },
          {
            title: 'Is Cement of the approved grade and less than 1 month old',
            key: 'cementApprovedGrade',
          },
          {
            title: 'Is sand medium gritty, clean, and silt-free',
            key: 'sandCleanGritty',
          },
          {
            title:
              'Is the finished floor level button marked on the structural slab',
            key: 'floorLevelMarked',
          },
          {
            title: 'Are the markings for reference lines on the pillar done',
            key: 'pillarMarkingsDone',
          },
          {
            title:
              'Is the brickwork checked in vertical and horizontal directions',
            key: 'brickworkChecked',
          },
        ];

        return (
          <View>
            {bricksWorkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={bricksWorkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setBricksWorkData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Area where Brick Work is to be done in Sqm"
              value={bricksWorkData.totalBrickWorkArea}
              onChange={(value: any) =>
                setBricksWorkData(prevData => ({
                  ...prevData,
                  totalBrickWorkArea: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Brick Work in Cum"
              value={bricksWorkData.totalBrickWorkCum}
              onChange={(value: any) =>
                setBricksWorkData(prevData => ({
                  ...prevData,
                  totalBrickWorkCum: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CUTTING_OF_SOIL:
        const cuttingOfSoilProperties = [
          {
            title:
              'Whether the proper safety measure taken at the site for cutting of soil?',
            key: 'safetyMeasuresTaken',
          },
          {
            title:
              'Whether all the equipment and tools are available at site at time of cutting of soil?',
            key: 'equipmentAvailable',
          },
          {
            title: 'Whether the excavation done at required depth?',
            key: 'excavationDone',
          },
        ];

        return (
          <View>
            {cuttingOfSoilProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={cuttingOfSoilData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setCuttingOfSoilData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total qty of soil cut in cum"
              value={cuttingOfSoilData.totalSoilCutQty}
              onChange={(value: any) =>
                setCuttingOfSoilData(prevData => ({
                  ...prevData,
                  totalSoilCutQty: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_GEO_CELL:
        const fixingGeoCellProperties = [
          {title: 'Whether the source is approved', key: 'sourceApproved'},
          {
            title: 'Whether the method statement is approved',
            key: 'methodStatementApproved',
          },
          {
            title: 'Whether the slope is properly maintained',
            key: 'slopeMaintained',
          },
          {
            title: 'Whether the slope is properly compacted',
            key: 'slopeCompacted',
          },
          {
            title: 'Whether the Geo cell is laid as per approved drawing',
            key: 'geoCellLaidAsPerDrawing',
          },
          {
            title: 'Whether joints of geo cell are fixed properly',
            key: 'geoCellJointsFixedProperly',
          },
          {
            title: 'Whether the Geo cell size is as per approved drawing',
            key: 'geoCellSizeAsPerDrawing',
          },
        ];

        return (
          <View>
            {fixingGeoCellProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingGeoCellData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingGeoCellData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Area where Geo cell placed (Sqm)"
              value={fixingGeoCellData.totalGeoCellArea}
              onChange={(value: any) =>
                setFixingGeoCellData(prevData => ({
                  ...prevData,
                  totalGeoCellArea: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total consumption of Geo cell in Sqm"
              value={fixingGeoCellData.totalGeoCellConsumption}
              onChange={(value: any) =>
                setFixingGeoCellData(prevData => ({
                  ...prevData,
                  totalGeoCellConsumption: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_MESH:
        const fixingOfMeshProperties = [
          {
            title: 'Whether the source of approved',
            key: 'sourceApproved',
          },
          {
            title: 'Whether the size of mesh as per approved drawing',
            key: 'sizeAsPerDrawing',
          },
          {
            title: 'Check for the damage of the wire mesh after the opening',
            key: 'wireMeshDamageChecked',
          },
          {
            title:
              'Whether the unit shall be stretched for removal of fold/bend after opening',
            key: 'unitStretchedForFoldsRemoved',
          },
        ];

        return (
          <View>
            {fixingOfMeshProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfMeshData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfMeshData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Area of the Slope in Sqm"
              value={fixingOfMeshData.totalAreaSlope}
              onChange={(value: any) =>
                setFixingOfMeshData(prevData => ({
                  ...prevData,
                  totalAreaSlope: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Qty of Mesh in kg"
              value={fixingOfMeshData.totalQtyMesh}
              onChange={(value: any) =>
                setFixingOfMeshData(prevData => ({
                  ...prevData,
                  totalQtyMesh: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_GRASS_TURF:
        const layingOfGrassTurfProperties = [
          {
            title: 'Ensure turfs are cut and will be planted within 24 hours',
            key: 'turfsCutPlantedWithin24hrs',
          },
          {
            title: 'Check that the base area is well prepared',
            key: 'baseAreaPrepared',
          },
          {
            title: 'Verify correct topsoil thickness',
            key: 'topsoilThicknessVerified',
          },
          {
            title:
              'Check suitable material to be used for top dressing (no gaps)',
            key: 'suitableTopDressingMaterial',
          },
          {
            title:
              'Check the turfing level; fill any sunken or depressed areas',
            key: 'turfingLevelChecked',
          },
          {
            title: 'Ensure water is sprayed upon completion of turfing work',
            key: 'waterSprayedCompletion',
          },
          {
            title:
              'Check that wood nailing is used to hold the turves in position',
            key: 'woodNailingUsed',
          },
          {
            title: 'Check the turfing arrangement and nailing pattern',
            key: 'turfingArrangementChecked',
          },
          {
            title: 'Check that the overall turfing work is visually acceptable',
            key: 'overallTurfingWorkAccepted',
          },
          {
            title: 'Ensure no vehicles enter or trespass the turfed area',
            key: 'noVehiclesTrespass',
          },
          {
            title:
              'Ensure hydroseeding is carried out properly with the correct method',
            key: 'hydroseedingMethodVerified',
          },
          {
            title: 'Fibromat installation properly done and secured',
            key: 'fibromatInstalled',
          },
        ];

        return (
          <View>
            {layingOfGrassTurfProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={layingOfGrassTurfData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setLayingOfGrassTurfData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Area Covered with Grass (sqm)"
              value={layingOfGrassTurfData.totalAreaCovered}
              onChange={(value: any) =>
                setLayingOfGrassTurfData(prevData => ({
                  ...prevData,
                  totalAreaCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_TOP_SOIL:
        const layingOfTopSoilProperties = [
          {
            title: 'Whether the soil is from approved source',
            key: 'approvedSource',
          },
          {
            title: 'Proper arrangement for vehicle movement',
            key: 'vehicleMovementArrangement',
          },
          {
            title: 'Proper machinery and equipment available',
            key: 'machineryAvailable',
          },
          {title: 'Marking done for the level of laying', key: 'markingDone'},
        ];

        return (
          <View>
            {layingOfTopSoilProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={layingOfTopSoilData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setLayingOfTopSoilData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Area where Laying is Done (Sqm)"
              value={layingOfTopSoilData.totalAreaLaying}
              onChange={(value: any) =>
                setLayingOfTopSoilData(prevData => ({
                  ...prevData,
                  totalAreaLaying: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Quantity of Soil (cum)"
              value={layingOfTopSoilData.totalQtyOfSoil}
              onChange={(value: any) =>
                setLayingOfTopSoilData(prevData => ({
                  ...prevData,
                  totalQtyOfSoil: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACING_AND_JOINTING_CHUTE_MEMBERS:
        const chuteMembersProperties = [
          {
            title: 'Whether the bottom soil layer compacted properly',
            key: 'bottomSoilCompacted',
          },
          {
            title: 'Whether the slope properly maintained',
            key: 'slopeMaintained',
          },
          {
            title: 'Whether chute lining done properly',
            key: 'chuteLiningDone',
          },
          {
            title: 'Whether the support for chute shuttering done properly',
            key: 'supportForShutteringDone',
          },
          {
            title: 'Whether the joint done in line and level',
            key: 'jointInLineAndLevel',
          },
          {
            title: 'Whether the concrete placing arrangement done',
            key: 'concretePlacingArrangement',
          },
        ];

        return (
          <View>
            {chuteMembersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={chuteMembersData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setChuteMembersData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Length of Chute in mtr"
              value={chuteMembersData.totalChuteLength}
              onChange={(value: any) =>
                setChuteMembersData(prevData => ({
                  ...prevData,
                  totalChuteLength: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PIT_EXCAVATION:
        const pitExcavationProperties = [
          {
            title:
              'Are there any underground utilities like sewers, water pipelines, cables',
            key: 'undergroundUtilities',
          },
          {
            title:
              'Check whether the excavated pits are adequately shored/ timbered',
            key: 'pitsShoredTimbered',
          },
          {
            title: 'Are the excavated areas provided with fences/ barricades',
            key: 'fencesBarricadesProvided',
          },
          {
            title:
              'Are the excavated material kept from the edge of the pit/ trench by at least 1m',
            key: 'excavatedMaterialKeptAway',
          },
          {
            title:
              'Are the heavy equipment such as cranes, shovels, back toe loaders etc. kept away at least 6m from the edge of excavated pit',
            key: 'heavyEquipmentKeptAway',
          },
          {
            title: 'Are danger signs provided near the excavated area',
            key: 'dangerSignsProvided',
          },
          {
            title: 'Means of access and exit from the work area provided',
            key: 'accessExitProvided',
          },
          {
            title: 'Check Set out',
            key: 'setOutChecked',
          },
          {
            title: 'Check Excavation Size with Tolerance (offset)',
            key: 'excavationSizeChecked',
          },
          {
            title: 'Check for Loose materials / Loose soil',
            key: 'looseMaterialsChecked',
          },
          {
            title:
              'Check bottom of excavation (indicate proposed GL/Basement level with respect to existing road level)',
            key: 'bottomOfExcavationChecked',
          },
        ];

        return (
          <View>
            {pitExcavationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={pitExcavationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPitExcavationData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLANTING_GRASS:
        const plantingGrassProperties = [
          {
            title: 'Is grass seeding handled gently',
            key: 'grassSeedingHandledGently',
          },
          {
            title: 'Is grass seeding done after handling',
            key: 'grassSeedingDoneAfterHandling',
          },
          {
            title: 'Is the grass seeding protected from the sun and wind',
            key: 'grassSeedingProtectedFromSunWind',
          },
          {
            title: 'The grass seed kept moist',
            key: 'grassSeedKeptMoist',
          },
          {
            title: 'Is grass transport during cooler period',
            key: 'grassTransportDuringCoolerPeriod',
          },
          {
            title: 'Is seeding done as per approved drawing?',
            key: 'seedingDoneAsPerApprovedDrawing',
          },
          {
            title: 'Is the seeding watered properly for the growth',
            key: 'seedingWateredProperly',
          },
          {
            title: 'Control weeds near plantation',
            key: 'controlWeedsNearPlantation',
          },
        ];

        return (
          <View>
            {plantingGrassProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={plantingGrassData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPlantingGrassData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Area Covered with Grass (sqm)"
              value={plantingGrassData.totalAreaCoveredWithGrass}
              onChange={(value: any) =>
                setPlantingGrassData(prevData => ({
                  ...prevData,
                  totalAreaCoveredWithGrass: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLANTING_TREES:
        const plantingTreesProperties = [
          {title: 'Is Plant Handle Gently?', key: 'handleGently'},
          {title: 'Is the Plant Root Kept in Moist?', key: 'rootKeptMoist'},
          {
            title: 'Is Planting Done as per Approved Drawing?',
            key: 'plantingDoneAsPerDrawing',
          },
          {
            title: 'Is the Watering Done Properly for Growth?',
            key: 'wateringDoneProperly',
          },
          {
            title: 'Control Weeds Near Plantation?',
            key: 'controlWeedsNearPlantation',
          },
          {title: 'Is Proper Barricading Done?', key: 'barricadingDone'},
          {
            title: 'Is the Height of the Plant as per Drawings?',
            key: 'heightAsPerDrawings',
          },
          {
            title: 'Is the Type of Plant as per Approved Drawings?',
            key: 'typeOfPlantAsPerDrawing',
          },
        ];
        return (
          <View>
            {plantingTreesProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={plantingTreesData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPlantingTreesData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Trees Planted"
              value={plantingTreesData.totalNoOfTreesPlanted}
              onChange={(value: any) =>
                setPlantingTreesData(prevData => ({
                  ...prevData,
                  totalNoOfTreesPlanted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PREPARATION_OF_SOIL:
        const preparationOfSoilProperties = [
          {
            title: 'Is the soil dumped in a 200mm layer?',
            key: 'soilDumpedInLayer',
          },
          {
            title:
              'Is the soil spread in the proper length as mentioned in drawing?',
            key: 'soilSpreadProperLength',
          },
          {
            title: 'Is the soil compacted properly?',
            key: 'soilCompactedProperly',
          },
        ];

        return (
          <View>
            {preparationOfSoilProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={preparationOfSoilData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPreparationOfSoilData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total qty of soil prepared in cum"
              value={preparationOfSoilData.totalQtySoil}
              onChange={(value: any) =>
                setPreparationOfSoilData(prevData => ({
                  ...prevData,
                  totalQtySoil: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total surface area of soil laid in sqm"
              value={preparationOfSoilData.totalSurfaceArea}
              onChange={(value: any) =>
                setPreparationOfSoilData(prevData => ({
                  ...prevData,
                  totalSurfaceArea: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.SPREADING_OF_GRASS_SEEDS:
        const spreadingOfGrassSeedsProperties = [
          {
            title: 'Is the seed from an approved source?',
            key: 'seedApprovedSource',
          },
          {
            title: 'Is the surface free from garbage and plastic material?',
            key: 'surfaceFreeFromGarbage',
          },
          {title: 'Is the surface well prepared?', key: 'surfaceWellPrepared'},
        ];

        return (
          <View>
            {spreadingOfGrassSeedsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={spreadingOfGrassSeedsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={value =>
                    setSpreadingOfGrassSeedsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.WATERING:
        const wateringProperties = [
          {title: 'Whether the water is clean?', key: 'waterClean'},
          {
            title: 'Whether the watering is done three times a day?',
            key: 'wateringThreeTimesADay',
          },
        ];

        return (
          <View>
            {wateringProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={wateringData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setWateringData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Quantity of Water Used (in Litres)"
              value={wateringData.totalQtyWaterUsed}
              onChange={(value: any) =>
                setWateringData(prevData => ({
                  ...prevData,
                  totalQtyWaterUsed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLANTATION:
        const plantationProperties = [
          {title: 'Is seeding handled gently', key: 'seedingHandledGently'},
          {
            title: 'Is plant seeding done after handling',
            key: 'seedingDoneAfterHandling',
          },
          {
            title: 'Is the plant seeding protected from the sun and wind',
            key: 'protectedFromSunWind',
          },
          {title: 'The plant seed kept in moist', key: 'seedKeptMoist'},
          {
            title: 'Is seeding transport during cooler period',
            key: 'transportDuringCoolerPeriod',
          },
          {
            title: 'Is seeding done as per approved drawing?',
            key: 'seedingAsPerDrawing',
          },
          {
            title: 'Is the seeding water done properly for the growth',
            key: 'waterDoneForGrowth',
          },
          {title: 'Control weeds near plantation', key: 'controlWeeds'},
          {
            title:
              'Is proper barricading done around the plant to avoid animal damage',
            key: 'barricadingDone',
          },
        ];

        return (
          <View>
            {plantationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={plantationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPlantationData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Number of Plants Planted"
              value={plantationData.totalPlantsPlanted}
              onChange={(value: any) =>
                setPlantationData(prevData => ({
                  ...prevData,
                  totalPlantsPlanted: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Area Covered in Sqm"
              value={plantationData.totalAreaCovered}
              onChange={(value: any) =>
                setPlantationData(prevData => ({
                  ...prevData,
                  totalAreaCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.STONE_PITCHING:
        const stonePitchingProperties = [
          {
            title:
              'All Construction Docs, Approvals, and Drawings are in Place',
            key: 'constructionDocsApproved',
          },
          {
            title: 'Work of Other Trades Completed and Accepted',
            key: 'workOfOtherTradesCompleted',
          },
          {title: 'Layer Compacted', key: 'layerCompacted'},
          {
            title: 'Stone Shape and Size as per Specification',
            key: 'stoneShapeAndSizeAsPerSpec',
          },
          {
            title: 'Mortar Bonding Material Ready at Work Area',
            key: 'mortarReady',
          },
          {
            title: 'Mortar Bonding with Stone Done Properly',
            key: 'mortarBondingDone',
          },
        ];
        return (
          <View>
            {stonePitchingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={stonePitchingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setStonePitchingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Surface Area of Stone Pitching (sqm)"
              value={stonePitchingData.totalSurfaceArea}
              onChange={(value: any) =>
                setStonePitchingData(prevData => ({
                  ...prevData,
                  totalSurfaceArea: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Material Laid (tonne)"
              value={stonePitchingData.totalMaterialLaid}
              onChange={(value: any) =>
                setStonePitchingData(prevData => ({
                  ...prevData,
                  totalMaterialLaid: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_INVERTER_INSTALLATION:
        const inverterInstallationProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether equipment inspected at site and factory dispatch clearance obtained',
            key: 'equipmentInspected',
          },
          {
            title:
              'Is there any damage to the equipment, if yes, informed to vendor',
            key: 'equipmentDamagedInformed',
          },
          {
            title: 'Whether foundation work is completed for installation',
            key: 'foundationWorkCompleted',
          },
          {
            title: 'Whether concrete components achieved desired strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation methodology approved',
            key: 'installationMethodologyApproved',
          },
          {
            title: 'Whether safety arrangements are in place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Whether sufficient machinery and manpower available',
            key: 'machineryAndManpowerAvailable',
          },
          {
            title: 'Installation completed as per approved methodology',
            key: 'installationCompletedAsPerMethodology',
          },
          {
            title:
              'All instructions from the manufacturer complied during installation',
            key: 'manufacturerInstructionsComplied',
          },
        ];

        return (
          <View>
            {inverterInstallationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={inverterInstallationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setInverterInstallationData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Number of Equipment Installed"
              value={inverterInstallationData.totalEquipmentInstalled}
              onChange={(value: any) =>
                setInverterInstallationData(prevData => ({
                  ...prevData,
                  totalEquipmentInstalled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_DOUBLE_POLE_STRUCTURE:
        const erectionOfDoublePoleStructureProperties = [
          {title: 'Drawings Approved', key: 'drawingsApproved'},
          {
            title: 'Structure Reached Site and Ready for Erection',
            key: 'structureAtSiteReady',
          },
          {
            title: 'Foundation Work Completed and Ready for Installation',
            key: 'foundationWorkCompleted',
          },
          {
            title: 'Concrete Components Achieved Desired Strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation Methodology Approved',
            key: 'installationMethodologyApproved',
          },
          {
            title: 'Safety Arrangements in Place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Sufficient Machinery and Manpower Available',
            key: 'machineryManpowerAvailable',
          },
          {
            title: 'Erection Completed as per Approved Methodology',
            key: 'erectionCompletedAsPerMethodology',
          },
        ];

        return (
          <View>
            {erectionOfDoublePoleStructureProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={erectionOfDoublePoleStructureData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setErectionOfDoublePoleStructureData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total No. of Double Pole Structures Erected"
              value={erectionOfDoublePoleStructureData.totalStructuresErected}
              onChange={(value: any) =>
                setErectionOfDoublePoleStructureData(prevData => ({
                  ...prevData,
                  totalStructuresErected: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_MC4_Y_CONNECTOR:
        const fixingOfMC4Properties = [
          {
            title:
              'Whether all the cables are connected using the MC 4/ Y connectors',
            key: 'cablesConnected',
          },
          {
            title: 'All connection checked physical and found OK',
            key: 'connectionsChecked',
          },
        ];

        return (
          <View>
            {fixingOfMC4Properties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfMC4Data[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfMC4Data(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of Y connectors used"
              value={fixingOfMC4Data.totalYConnectorsUsed}
              onChange={(value: any) =>
                setFixingOfMC4Data(prevData => ({
                  ...prevData,
                  totalYConnectorsUsed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_MMS:
        const fixingOfMMSProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether the material has been inspected at factory and dispatch clearance obtained',
            key: 'materialInspectedAndCleared',
          },
          {
            title:
              'Whether the material reached at site all ok and none of the part is damaged, damaged part informed to the contractor or not',
            key: 'materialReachedUndamaged',
          },
          {
            title:
              'Whether the foundation has been completed in all respect including the casting of column post in its alignment properly',
            key: 'foundationCompleted',
          },
          {
            title: 'Whether the concrete has achieved the desired strength',
            key: 'concreteAchievedStrength',
          },
          {
            title: 'The alignment of the MMS is as per the drawings or not',
            key: 'alignmentAsPerDrawings',
          },
          {
            title: 'Whether line / level checked or not',
            key: 'lineLevelChecked',
          },
          {
            title:
              'Whether the angle of the structure checked and found as per the drawings',
            key: 'structureAngleChecked',
          },
          {
            title:
              'Whether all the nut bolts are torqued properly and tested as per the specification',
            key: 'nutBoltsTorquedProperly',
          },
          {
            title:
              'Whether MMS installed appears to be fit in all respect visually',
            key: 'visualFitCheck',
          },
        ];

        return (
          <View>
            {fixingOfMMSProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfMMSData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfMMSData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total No. of MMS Tables Erected"
              value={fixingOfMMSData.totalNoOfMMSTablesErected}
              onChange={(value: any) =>
                setFixingOfMMSData(prevData => ({
                  ...prevData,
                  totalNoOfMMSTablesErected: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of MMS Structure Completed in RM"
              value={fixingOfMMSData.totalLengthOfMMSCompleted}
              onChange={(value: any) =>
                setFixingOfMMSData(prevData => ({
                  ...prevData,
                  totalLengthOfMMSCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_MODULES:
        const fixingOfModulesProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether the material has been inspected at factory and dispatch clearance obtained',
            key: 'materialInspectedFactory',
          },
          {
            title:
              'Whether the material reached at site all ok and none of the part is damaged, damaged part informed to the vendor and insurance company',
            key: 'materialReachedSiteOk',
          },
          {
            title:
              'Whether the installation of MMS has been completed in all respect including its alignment properly',
            key: 'mmsInstallationCompleted',
          },
          {
            title: 'The alignment of the Modules is as per the drawings or not',
            key: 'alignmentAsPerDrawings',
          },
          {
            title: 'Whether line / level checked or not',
            key: 'lineLevelChecked',
          },
          {
            title:
              'Whether the angle of the Modules checked and found as per the drawings',
            key: 'moduleAngleChecked',
          },
          {
            title:
              'Whether all the nut bolts are torqued properly and tested as per the specification',
            key: 'nutBoltsTorqued',
          },
          {
            title:
              'Whether Modules installed appears to be fit in all respect visually',
            key: 'modulesFitVisually',
          },
        ];

        return (
          <View>
            {fixingOfModulesProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfModulesData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfModulesData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Modules Mounted"
              value={fixingOfModulesData.totalModulesMounted}
              onChange={(value: any) =>
                setFixingOfModulesData(prevData => ({
                  ...prevData,
                  totalModulesMounted: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of Modules Mounting Completed in RM"
              value={fixingOfModulesData.totalLengthMounted}
              onChange={(value: any) =>
                setFixingOfModulesData(prevData => ({
                  ...prevData,
                  totalLengthMounted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_CAUTION_TAPE:
        const layingCautionTapeProperties = [
          {
            title: 'Whether the Drawings Approved or Not',
            key: 'drawingsApproved',
          },
          {
            title: 'Size, Shape and Thickness as per Drawings',
            key: 'sizeShapeThicknessAsPerDrawings',
          },
          {title: 'Source of Material Approved', key: 'sourceMaterialApproved'},
          {title: 'Caution Tape Laid Properly', key: 'cautionTapeLaidProperly'},
          {
            title: 'Caution Tape Laid at Desired Depth/Clearance',
            key: 'cautionTapeLaidAtDesiredDepth',
          },
        ];
        return (
          <View>
            {layingCautionTapeProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={layingCautionTapeData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setLayingCautionTapeData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Length of Caution Tape Laid (RM)"
              value={layingCautionTapeData.totalCautionTapeLength}
              onChange={(value: any) =>
                setLayingCautionTapeData(prevData => ({
                  ...prevData,
                  totalCautionTapeLength: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ROUTE_MARKING:
        const routeMarkingProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Are the size and shape of the markers as per the approved drawings/specifications',
            key: 'markersSizeShapeAsPerApproved',
          },
          {
            title: 'Whether source of the material approved or not',
            key: 'materialSourceApproved',
          },
          {
            title: 'Whether the layout marked at site or not',
            key: 'layoutMarkedAtSite',
          },
          {
            title: 'Whether route markers are fixed properly',
            key: 'routeMarkersFixedProperly',
          },
          {
            title: 'Whether spacing is as per the specifications',
            key: 'spacingAsPerSpecifications',
          },
        ];

        return (
          <View>
            {routeMarkingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={routeMarkingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setRouteMarkingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Route Markers Installed at Site"
              value={routeMarkingData.totalRouteMarkersInstalled}
              onChange={(value: any) =>
                setRouteMarkingData(prevData => ({
                  ...prevData,
                  totalRouteMarkersInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length Covered in RM"
              value={routeMarkingData.totalLengthCoveredRM}
              onChange={(value: any) =>
                setRouteMarkingData(prevData => ({
                  ...prevData,
                  totalLengthCoveredRM: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.BRICKS_LAYERING:
        const bricksLayeringProperties = [
          {
            title: 'Whether the Drawings Approved or Not',
            key: 'drawingsApproved',
          },
          {
            title: 'Are the Size and Class of Bricks as per Approved Drawing',
            key: 'bricksSizeClassApproved',
          },
        ];

        return (
          <View>
            {bricksLayeringProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={bricksLayeringData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setBricksLayeringData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Area of Brick Layering Completed (sqm)"
              value={bricksLayeringData.totalAreaCompleted}
              onChange={(value: any) =>
                setBricksLayeringData(prevData => ({
                  ...prevData,
                  totalAreaCompleted: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total No. of Bricks Laid (No)"
              value={bricksLayeringData.totalBricksLaid}
              onChange={(value: any) =>
                setBricksLayeringData(prevData => ({
                  ...prevData,
                  totalBricksLaid: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Length of Trench Completed (RM)"
              value={bricksLayeringData.totalLengthTrenchCompleted}
              onChange={(value: any) =>
                setBricksLayeringData(prevData => ({
                  ...prevData,
                  totalLengthTrenchCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CABLE_DRESSING:
        const cableDressingProperties = [
          {
            title:
              'Whether all the cables are tied properly to the MMS structure and no cables are hanging',
            key: 'cablesTiedProperly',
          },
          {
            title: 'No cable has been damaged found during the dressing',
            key: 'noCableDamaged',
          },
        ];

        return (
          <View>
            {cableDressingProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={cableDressingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setCableDressingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CABLE_TRENCH_DRESSING:
        const cableTrenchDressingProperties = [
          {
            title: 'Whether the proper safety measure taken at the site',
            key: 'safetyMeasuresTaken',
          },
          {
            title: 'Sufficient manpower available at site',
            key: 'manpowerAvailable',
          },
          {
            title: 'Line levels are checked properly',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Trench has been made free from undesirable material',
            key: 'trenchClearedUndesirableMaterial',
          },
          {
            title: 'Bottom of trench well compacted as per specifications',
            key: 'trenchCompacted',
          },
        ];
        return (
          <View>
            {cableTrenchDressingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={cableTrenchDressingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setCableTrenchDressingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Trench Dressed in RM"
              value={cableTrenchDressingData.totalTrenchDressed}
              onChange={(value: any) =>
                setCableTrenchDressingData(prevData => ({
                  ...prevData,
                  totalTrenchDressed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CONDUIT_LAYING:
        const conduitLayingProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Are the size and shape of the conduit as per the approved drawings/ specifications',
            key: 'conduitSizeShapeAsPerSpecs',
          },
          {
            title: 'Whether source of the material approved or not',
            key: 'materialSourceApproved',
          },
          {
            title: 'Whether the conduit pipe laid properly',
            key: 'conduitPipeLaidProperly',
          },
          {
            title: 'Whether jointing has been done properly',
            key: 'jointingDoneProperly',
          },
        ];

        return (
          <View>
            {conduitLayingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={conduitLayingData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setConduitLayingData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Length of Conduit Laid in RM"
              value={conduitLayingData.totalConduitLength}
              onChange={(value: any) =>
                setConduitLayingData(prevData => ({
                  ...prevData,
                  totalConduitLength: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CABLE_TRENCH_EXCAVATION:
        const cableTrenchExcavationProperties = [
          {
            title: 'Proper Safety Measures Taken Before Excavation',
            key: 'safetyMeasuresTaken',
          },
          {title: 'Drawings Approved', key: 'drawingsApproved'},
          {title: 'Alignment of Trench Marked at Site', key: 'alignmentMarked'},
          {title: 'Utility Infringement Shifted', key: 'utilitiesShifted'},
          {
            title: 'Excavation Done to Required Depth and Width',
            key: 'excavationDepthWidth',
          },
        ];

        return (
          <View>
            {cableTrenchExcavationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={cableTrenchExcavationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setCableTrenchExcavationData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Qty of Soil Excavated (in Cum)"
              value={cableTrenchExcavationData.totalSoilQtyExcavated}
              onChange={(value: any) =>
                setCableTrenchExcavationData(prevData => ({
                  ...prevData,
                  totalSoilQtyExcavated: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Trench Excavated (in RM)"
              value={cableTrenchExcavationData.totalTrenchExcavated}
              onChange={(value: any) =>
                setCableTrenchExcavationData(prevData => ({
                  ...prevData,
                  totalTrenchExcavated: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_LT_PANEL:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_SERVO:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_MCB:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_INVERTOR:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_HT_PANEL:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_TRANSFORMER:
        const fixingAndInstallationProperties = [
          {title: 'Drawings Approved', key: 'drawingsApproved'},
          {
            title: 'Equipment Inspected at Factory Dispatch',
            key: 'equipmentInspected',
          },
          {
            title: 'Damage to Equipment Informed to Vendor',
            key: 'equipmentDamageInformed',
          },
          {
            title: 'Foundation Work Completed and Ready',
            key: 'foundationReady',
          },
          {
            title: 'Concrete Strength Achieved',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation Methodology Approved',
            key: 'installationMethodologyApproved',
          },
          {
            title: 'Safety Arrangements in Place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Sufficient Machinery and Manpower Available',
            key: 'machineryManpowerAvailable',
          },
          {
            title: 'Installation Completed per Approved Methodology',
            key: 'installationCompleted',
          },
          {
            title: 'Manufacturer Instructions Complied with',
            key: 'manufacturerInstructionsComplied',
          },
        ];

        return (
          <View>
            {fixingAndInstallationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingAndInstallationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingAndInstallationData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total No. of Equipment Installed"
              value={fixingAndInstallationData.totalEquipmentInstalled}
              onChange={(value: any) =>
                setFixingAndInstallationData(prevData => ({
                  ...prevData,
                  totalEquipmentInstalled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_LT_PANEL:
        const fixingAndInstallationLTPanelProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether the equipment reached at site has been inspected in factory dispatch clearance obtained',
            key: 'equipmentInspected',
          },
          {
            title:
              'Is there any damage to the equipment or not, if yes whether informed to the vendor',
            key: 'equipmentDamageInformed',
          },
          {
            title:
              'Whether the equipment foundation work completed in all respect and ready for installation of equipment',
            key: 'foundationReady',
          },
          {
            title:
              'Whether the concrete components of the foundations achieved desired strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation methodology approved',
            key: 'installationMethodologyApproved',
          },
          {
            title:
              'Whether all safety arrangements are in place prior to the installation',
            key: 'safetyArrangementsInPlace',
          },
          {
            title:
              'Whether sufficient machinery and manpower available at site',
            key: 'machineryManpowerAvailable',
          },
          {
            title: 'Installation completed as per the approved methodology',
            key: 'installationCompleted',
          },
          {
            title:
              'All instructions as informed by the manufacturer have been complied with during installation',
            key: 'manufacturerInstructionsComplied',
          },
        ];

        return (
          <View>
            {fixingAndInstallationLTPanelProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingAndInstallationLTPanelData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingAndInstallationLTPanelData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total No. of Equipment Installed"
              value={fixingAndInstallationLTPanelData.totalEquipmentInstalled}
              onChange={(value: any) =>
                setFixingAndInstallationLTPanelData(prevData => ({
                  ...prevData,
                  totalEquipmentInstalled: value,
                }))
              }
              isRequired={true}
              keyboardType="numeric"
            />

            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.HT_PANEL_INSTALLATION:
        const htPanelInstallationProperties = [
          {title: 'Whether the Drawings Approved', key: 'drawingsApproved'},
          {
            title: 'Equipment Inspected & Factory Dispatch Clearance Obtained',
            key: 'equipmentInspected',
          },
          {
            title: 'Equipment Damage Reported to Vendor',
            key: 'equipmentDamageReported',
          },
          {
            title: 'Foundation Work Completed and Ready for Installation',
            key: 'foundationWorkCompleted',
          },
          {
            title: 'Concrete Components Achieved Desired Strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation Methodology Approved',
            key: 'installationMethodologyApproved',
          },
          {
            title: 'All Safety Arrangements in Place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Sufficient Machinery and Manpower Available',
            key: 'machineryAndManpowerAvailable',
          },
          {
            title: 'Installation Completed as per Approved Methodology',
            key: 'installationCompleted',
          },
          {
            title: 'Manufacturer Instructions Followed during Installation',
            key: 'manufacturerInstructionsFollowed',
          },
        ];

        return (
          <View>
            {htPanelInstallationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={htPanelInstallationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setHtPanelInstallationData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Equipment Installed"
              value={htPanelInstallationData.totalEquipmentsInstalled}
              onChange={(value: any) =>
                setHtPanelInstallationData(prevData => ({
                  ...prevData,
                  totalEquipmentsInstalled: value,
                }))
              }
              isRequired={true}
            />
          </View>
        );
      case TASK_TYPES.ERECTION_OF_STRUCTURE:
        const erectionOfStructureProperties = [
          {title: 'Whether the Position checked', key: 'positionChecked'},
          {
            title: 'Whether the Welding done as per the approved drawing',
            key: 'weldingDoneAsPerDrawing',
          },
          {
            title: 'Whether the Structure is as per approved drawing',
            key: 'structureAsPerDrawing',
          },
          {
            title: 'Whether the Necessary support provided',
            key: 'necessarySupportProvided',
          },
        ];

        return (
          <View>
            {erectionOfStructureProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={erectionOfStructureData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setErectionOfStructureData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FABRICATION_OF_STRUCTURE:
        const fabricationOfStructureProperties = [
          {
            title: 'Steel Inspection for Surface Condition',
            key: 'steelInspection',
          },
          {
            title: 'Section Checked for Dimension and GFC Compliance',
            key: 'sectionChecked',
          },
          {
            title: 'Material Specification Checked as per GFC',
            key: 'materialSpecificationChecked',
          },
          {title: 'Connection Checked as per GFC', key: 'connectionChecked'},
          {title: 'Bolt Holes Clean and to Size', key: 'boltHolesClean'},
          {title: 'Only Approved Welders Used', key: 'approvedWeldersUsed'},
          {title: 'Welds Identified with Welder ID', key: 'weldsIdentified'},
          {
            title: 'Welds Inspected for Dimension, Shape, Location',
            key: 'weldsInspected',
          },
          {title: 'Welds Repaired as Required', key: 'weldsRepaired'},
          {
            title: 'Shape Edge Burns/Weld Spatter Removed',
            key: 'shapeEdgeBurnsRemoved',
          },
          {
            title: 'Oil and Grease Removed before Final Cleaning',
            key: 'oilGreaseRemoved',
          },
          {
            title: 'Steel Cleaned and Painted as per Specification',
            key: 'steelCleanedAndPainted',
          },
          {
            title: 'Final Shop Coat Applied as per Approved Color',
            key: 'finalShopCoatApplied',
          },
          {
            title: 'Each Structure Marked for Erection as per Scope',
            key: 'structureMarkedForErection',
          },
          {
            title: 'Structure Approved by Inspector Before Shipment',
            key: 'structureApprovedPriorShipment',
          },
        ];

        return (
          <View>
            {fabricationOfStructureProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fabricationOfStructureData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFabricationOfStructureData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_PANELS:
        const fixingOfPanelsProperties = [
          {
            title: 'Is the bus shelter drawing approved',
            key: 'drawingApproved',
          },
          {
            title: 'Is the material source approved',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Is the shape and size of panel same as mentioned in drawing',
            key: 'panelShapeSizeAsDrawing',
          },
          {title: 'Are bolts and holes aligned', key: 'boltsAligned'},
          {title: 'Are the panels fixed in line', key: 'panelsFixedInLine'},
          {title: 'Are the all bolts fully torqued', key: 'boltsFullyTorqued'},
        ];

        return (
          <View>
            {fixingOfPanelsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfPanelsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfPanelsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Panels Installed"
              value={fixingOfPanelsData.totalPanelsInstalled}
              onChange={(value: any) =>
                setFixingOfPanelsData(prevData => ({
                  ...prevData,
                  totalPanelsInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total No. of Bus Shelter Completed"
              value={fixingOfPanelsData.totalBusShelterCompleted}
              onChange={(value: any) =>
                setFixingOfPanelsData(prevData => ({
                  ...prevData,
                  totalBusShelterCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_PRECAST_COLUMN:
        const erectionPreCastColumnProperties = [
          {title: 'Is the Drawing Approved', key: 'drawingApproved'},
          {
            title: 'Pre-Cast Columns from Approved Source',
            key: 'columnsFromApprovedSource',
          },
          {title: 'Is Any Column Damaged', key: 'columnDamaged'},
          {
            title: 'Erection is as per the Drawing',
            key: 'erectionAsPerDrawing',
          },
          {title: 'Line and Level Checked Properly', key: 'lineLevelChecked'},
          {
            title: 'Dimensions of the Column are as per Drawing',
            key: 'dimensionsAsPerDrawing',
          },
          {
            title: 'Spacing of Columns is as per Approved Drawing',
            key: 'columnSpacingAsPerDrawing',
          },
        ];

        return (
          <View>
            {erectionPreCastColumnProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={erectionPreCastColumnData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setErectionPreCastColumnData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Columns Erected"
              value={erectionPreCastColumnData.totalNoOfColumnsErected}
              onChange={(value: any) =>
                setErectionPreCastColumnData(prevData => ({
                  ...prevData,
                  totalNoOfColumnsErected: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of B/Wall Covered (RM)"
              value={erectionPreCastColumnData.totalLengthOfBwallCovered}
              onChange={(value: any) =>
                setErectionPreCastColumnData(prevData => ({
                  ...prevData,
                  totalLengthOfBwallCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_BUS_SHELTER:
        const erectionOfBusShelterProperties = [
          {
            title: 'Whether source of material approved or not',
            key: 'materialSourceApproved',
          },
          {
            title: 'Whether the drawings approved',
            key: 'drawingsApproved',
          },
          {
            title: 'Is the supporting surface checked and found OK',
            key: 'supportingSurfaceChecked',
          },
          {
            title: 'Are sufficient safety arrangements in place at site',
            key: 'safetyArrangementsInPlace',
          },
        ];

        return (
          <View>
            {erectionOfBusShelterProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={erectionOfBusShelterData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setErectionOfBusShelterData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total No. of Panels Installed"
              value={erectionOfBusShelterData.totalPanelsInstalled}
              onChange={(value: any) =>
                setErectionOfBusShelterData(prevData => ({
                  ...prevData,
                  totalPanelsInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total No. of Bus Stands Completed"
              value={erectionOfBusShelterData.totalBusStandsCompleted}
              onChange={(value: any) =>
                setErectionOfBusShelterData(prevData => ({
                  ...prevData,
                  totalBusStandsCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_ANGLE_SECTION:
        const erectionOfAngleSectionProperties = [
          {
            title: 'Check all the angles are from approved source',
            key: 'anglesFromApprovedSource',
          },
          {
            title:
              'Material inspection at factory done and clearance for dispatch obtained',
            key: 'materialInspectionClearance',
          },
          {
            title:
              'Whether any material reached at site is damaged, if yes, informed to supplier',
            key: 'materialDamagedInformed',
          },
          {
            title: 'Erection done as per approved drawing',
            key: 'erectionAsPerDrawing',
          },
          {
            title: 'Alignment, plumb, fixing, and temporary support all ok',
            key: 'alignmentSupportOk',
          },
          {title: 'Total column/angles erected', key: 'totalAnglesErected'},
        ];

        return (
          <View>
            {erectionOfAngleSectionProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={erectionOfAngleSectionData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setErectionOfAngleSectionData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total column/angles erected"
              value={erectionOfAngleSectionData.totalAnglesErected}
              onChange={(value: any) =>
                setErectionOfAngleSectionData(prevData => ({
                  ...prevData,
                  totalAnglesErected: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACING_OF_PRE_CAST_RCC_PANELS:
        const preCastRccPanelProperties = [
          {title: 'Whether drawing approved', key: 'drawingApproved'},
          {
            title: 'Check all the pre cast panels are from approved source',
            key: 'panelsFromApprovedSource',
          },
          {
            title:
              'Whether any panel found damaged, especially at the male-female joint',
            key: 'damagedPanelFound',
          },
          {
            title: 'Alignment, plumb, fixing, and temporary support',
            key: 'alignmentPlumbFixingSupport',
          },
        ];

        return (
          <View>
            {preCastRccPanelProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={preCastRccPanelData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPreCastRccPanelData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Panels Installed in Nos."
              value={preCastRccPanelData.totalPanelsInstalled}
              onChange={(value: any) =>
                setPreCastRccPanelData(prevData => ({
                  ...prevData,
                  totalPanelsInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Area of Panels Installed in Sqm"
              value={preCastRccPanelData.totalAreaInstalled}
              onChange={(value: any) =>
                setPreCastRccPanelData(prevData => ({
                  ...prevData,
                  totalAreaInstalled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACING_OF_CHAIN_LINK:
        const placingChainLinkProperties = [
          {title: 'Is the drawing approved', key: 'drawingApproved'},
          {
            title: 'Is fencing installed in accordance with the plot plan?',
            key: 'fencingInstalledAsPerPlotPlan',
          },
          {
            title:
              'Are all fittings, caps, tension bars, hinges, and hardware installed properly?',
            key: 'fittingsCapsTensionBarsHingesHardwareInstalled',
          },
          {
            title: 'Are corner and end posts firmly anchored and supported?',
            key: 'cornerEndPostsAnchoredSupported',
          },
          {
            title: 'Are all fence components free from defects in workmanship?',
            key: 'fenceComponentsDefectFree',
          },
          {
            title:
              'Has the fence been installed at the correct height requirement?',
            key: 'fenceInstalledAtCorrectHeight',
          },
          {
            title: 'Does the fence end with a terminal post?',
            key: 'fenceEndsWithTerminalPost',
          },
          {
            title: 'Are appropriate fasteners used?',
            key: 'appropriateFastenersUsed',
          },
          {
            title: 'Is there damaged mesh, if yes informed to the supplier?',
            key: 'damagedMeshInformedSupplier',
          },
          {
            title:
              'Are there missing or damaged components such as the tension wire, tension bar, tension band, or ties?',
            key: 'missingDamagedComponents',
          },
          {
            title:
              'Is there too much movement on the top rail between end post, line post, and terminal post?',
            key: 'tooMuchMovementTopRail',
          },
          {
            title:
              'Has the right fencing material been used according to the detail?',
            key: 'rightFencingMaterialUsed',
          },
          {
            title:
              'Is the required fence gap present (from soil to the fence mesh)?',
            key: 'requiredFenceGapPresent',
          },
          {
            title: 'Is the mesh and tension wire/band too loose?',
            key: 'meshTensionWireLoose',
          },
        ];

        return (
          <View>
            {placingChainLinkProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={placingChainLinkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPlacingChainLinkData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}

            <Input
              label="Total Sqm of Fence Installed"
              value={placingChainLinkData.totalSqmFenceInstalled}
              onChange={(value: any) =>
                setPlacingChainLinkData(prevData => ({
                  ...prevData,
                  totalSqmFenceInstalled: value,
                }))
              }
              isRequired={true}
              keyboardType="numeric"
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.MORTAR_CHECKLIST:
        const mortarChecklistProperties = [
          {
            title: 'Is the mortar mix uniform and of optimal workability?',
            key: 'mortarMixUniform',
          },
          {
            title:
              'Is there a sufficient quantity of mortar mixed for the next 30 minutes?',
            key: 'sufficientMortarQuantity',
          },
          {
            title: 'Is the block work in proper alignment and plumb?',
            key: 'blockAlignmentPlumb',
          },
          {
            title: 'Have all the joints been staggered and raked properly?',
            key: 'jointsStaggered',
          },
          {
            title:
              'Is mortar placed between the edge of the block and the column?',
            key: 'mortarBetweenBlockAndColumn',
          },
        ];

        return (
          <View>
            {mortarChecklistProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={mortarChecklistData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setMortarChecklistData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Cement Bag Consumed (in no.)"
              value={mortarChecklistData.totalCementBagsConsumed}
              onChange={(value: any) =>
                setMortarChecklistData(prevData => ({
                  ...prevData,
                  totalCementBagsConsumed: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Surface Area to be Plastered (in sqm)"
              value={mortarChecklistData.totalSurfaceAreaToBePlastered}
              onChange={(value: any) =>
                setMortarChecklistData(prevData => ({
                  ...prevData,
                  totalSurfaceAreaToBePlastered: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Quantity of Mortar Used (in cum)"
              value={mortarChecklistData.totalMortarUsed}
              onChange={(value: any) =>
                setMortarChecklistData(prevData => ({
                  ...prevData,
                  totalMortarUsed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FLOORING:
        const flooringProperties = [
          {
            title: 'Flooring Material Source Approved',
            key: 'flooringMaterialSourceApproved',
          },
          {
            title: 'Tiles/Other Material Free from Cracks',
            key: 'tilesCrackFree',
          },
          {
            title: 'Cracks, Holes or Uneven Surface Present',
            key: 'cracksHolesUnevenSurface',
          },
          {
            title: 'Joints at Transition Area are Smooth',
            key: 'jointsAtTransitionSmooth',
          },
          {
            title: 'Flooring Done at Entry/Exit Ramps',
            key: 'flooringDoneAtRamps',
          },
        ];

        return (
          <View>
            {flooringProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={flooringData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFlooringData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Surface Area Flooring Done (Sqm)"
              value={flooringData.totalSurfaceArea}
              onChange={(value: any) =>
                setFlooringData(prevData => ({
                  ...prevData,
                  totalSurfaceArea: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Number of Tiles Used"
              value={flooringData.totalTilesUsed}
              onChange={(value: any) =>
                setFlooringData(prevData => ({
                  ...prevData,
                  totalTilesUsed: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.SIGNAGE_LOCATION_IDENTIFICATION:
        const signageLocationProperties = [
          {title: 'Whether the drawing is approved', key: 'drawingApproved'},
          {
            title: 'Whether the location is marked using temporary arrangement',
            key: 'locationMarked',
          },
          {
            title: 'Whether the marked location is checked by engineer',
            key: 'locationCheckedByEngineer',
          },
          {
            title: 'Whether the location has no hindrance in installation',
            key: 'noHindranceInInstallation',
          },
        ];

        return (
          <View>
            {signageLocationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={signageLocationData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setSignageLocationData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.BACKFILL:
        const backfillProperties = [
          {
            title:
              'Verify that the excavated area to be backfilled is clear of debris and formwork materials',
            key: 'areaClearOfDebris',
          },
          {
            title:
              'Confirm that the fill materials are approved and test results comply with the specifications',
            key: 'fillMaterialsApproved',
          },
          {
            title:
              'Ensure avoidance of damage to the cables, caution tapes, or other things laid in the trench',
            key: 'noDamageToCables',
          },
          {
            title:
              'Ensure the backfilling is complete and the area is clean and tidy',
            key: 'backfillingComplete',
          },
        ];

        return (
          <View>
            {backfillProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={backfillData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setBackfillData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Qty of Soil Used in cum"
              value={backfillData.totalQtySoilUsed}
              onChange={(value: any) =>
                setBackfillData(prevData => ({
                  ...prevData,
                  totalQtySoilUsed: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Length of Trench Backfilled in RM"
              value={backfillData.totalLengthTrenchBackfilled}
              onChange={(value: any) =>
                setBackfillData(prevData => ({
                  ...prevData,
                  totalLengthTrenchBackfilled: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLACEMENT_OF_SIGNAGE_SHEET:
        const placementOfSignageSheetProperties = [
          {
            title: 'Whether the material source is approved',
            key: 'materialSourceApproved',
          },
          {title: 'Whether the drawings approved', key: 'drawingsApproved'},
          {
            title: 'Whether the letter size is as per approved drawing',
            key: 'letterSizeAsPerDrawing',
          },
          {
            title: 'Whether riveted properly in the frame',
            key: 'rivetedProperlyInFrame',
          },
          {
            title: 'Whether placed as per approved drawing',
            key: 'placedAsPerDrawing',
          },
        ];
        return (
          <View>
            {placementOfSignageSheetProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={placementOfSignageSheetData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPlacementOfSignageSheetData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Sheet Fixed in Sqm"
              value={placementOfSignageSheetData.totalSheetFixed}
              onChange={(value: any) =>
                setPlacementOfSignageSheetData(prevData => ({
                  ...prevData,
                  totalSheetFixed: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of Road Covered in Km"
              value={placementOfSignageSheetData.totalRoadLengthCovered}
              onChange={(value: any) =>
                setPlacementOfSignageSheetData(prevData => ({
                  ...prevData,
                  totalRoadLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_TRAFFIC_IMPACT_ATTENUATORS:
        const trafficImpactAttenuatorsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeAsPerDrawing',
          },
          {
            title: 'Whether the fixing methodology approved',
            key: 'fixingMethodologyApproved',
          },
          {
            title:
              'Whether attenuators fixed properly as per the approved method and drawings',
            key: 'attenuatorsFixedProperly',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {trafficImpactAttenuatorsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={trafficImpactAttenuatorsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setTrafficImpactAttenuatorsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Attenuators Installed"
              value={trafficImpactAttenuatorsData.totalNoOfAttenuatorsInstalled}
              onChange={(value: any) =>
                setTrafficImpactAttenuatorsData(prevData => ({
                  ...prevData,
                  totalNoOfAttenuatorsInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of Road Covered in Km"
              value={trafficImpactAttenuatorsData.totalLengthOfRoadCovered}
              onChange={(value: any) =>
                setTrafficImpactAttenuatorsData(prevData => ({
                  ...prevData,
                  totalLengthOfRoadCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_SPRING_POST:
        const fixingOfSpringPostProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeAndSizeAsPerDrawing',
          },
          {
            title: 'Whether posts are fixed properly',
            key: 'postsFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineAndLevelChecked',
          },
          {
            title: 'Whether the spacing between them are as per specifications',
            key: 'spacingAsPerSpecification',
          },
          {
            title: 'Whether items are properly cleaned and visible',
            key: 'itemsCleanedAndVisible',
          },
        ];

        return (
          <View>
            {fixingOfSpringPostProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfSpringPostData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfSpringPostData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Nos of Spring Post Installed"
              value={fixingOfSpringPostData.springPostInstalled}
              onChange={(value: any) =>
                setFixingOfSpringPostData(prevData => ({
                  ...prevData,
                  springPostInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Length of Road Covered in km"
              value={fixingOfSpringPostData.totalRoadLengthCovered}
              onChange={(value: any) =>
                setFixingOfSpringPostData(prevData => ({
                  ...prevData,
                  totalRoadLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_SOLAR_ROAD_STUDS:
        const fixingOfSolarRoadStudsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeAsPerDrawing',
          },
          {
            title:
              'Whether the color code and locations are as per specification',
            key: 'colorCodeAndLocationAsPerSpec',
          },
          {
            title: 'Whether studs are fixed properly',
            key: 'studsFixedProperly',
          },
          {title: 'Whether line checked properly', key: 'lineCheckedProperly'},
          {
            title: 'Whether the spacing is as per specifications',
            key: 'spacingAsPerSpecs',
          },
          {
            title: 'Whether items are clean and visible properly',
            key: 'itemsCleanVisible',
          },
        ];

        return (
          <View>
            {fixingOfSolarRoadStudsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfSolarRoadStudsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfSolarRoadStudsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Nos of Road Studs Installed"
              value={fixingOfSolarRoadStudsData.noOfRoadStuds}
              onChange={(value: any) =>
                setFixingOfSolarRoadStudsData(prevData => ({
                  ...prevData,
                  noOfRoadStuds: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Length of Road Covered in Km"
              value={fixingOfSolarRoadStudsData.totalLengthCovered}
              onChange={(value: any) =>
                setFixingOfSolarRoadStudsData(prevData => ({
                  ...prevData,
                  totalLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_SOLAR_BLINKERS:
        const fixingOfSolarBlinkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeAndSizeAsPerDrawing',
          },
          {
            title: 'Whether blinkers are in working condition',
            key: 'blinkersWorkingCondition',
          },
          {
            title: 'Whether blinkers are fixed properly?',
            key: 'blinkersFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineLevelChecked',
          },
          {
            title: 'Whether items are properly cleaned and visible',
            key: 'itemsCleanedAndVisible',
          },
        ];

        return (
          <View>
            {fixingOfSolarBlinkersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfSolarBlinkersData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfSolarBlinkersData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total No. of Blinkers Installed"
              value={fixingOfSolarBlinkersData.totalBlinkersInstalled}
              onChange={(value: any) =>
                setFixingOfSolarBlinkersData(prevData => ({
                  ...prevData,
                  totalBlinkersInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total Length of Road Covered in Km"
              value={fixingOfSolarBlinkersData.totalRoadLengthCovered}
              onChange={(value: any) =>
                setFixingOfSolarBlinkersData(prevData => ({
                  ...prevData,
                  totalRoadLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_ROAD_STUDS:
        const fixingOfRoadStudsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size are as per approved drawing',
            key: 'shapeAndSizeAsPerDrawing',
          },
          {
            title:
              'Whether the color code and locations are as per specification and approved drawings',
            key: 'colorCodeAndLocationAsPerSpecification',
          },
          {
            title: 'Whether studs are fixed properly',
            key: 'studsFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineAndLevelChecked',
          },
          {
            title: 'Whether the spacing is as per the specification',
            key: 'spacingAsPerSpecification',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {fixingOfRoadStudsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfRoadStudsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfRoadStudsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Number of Road Studs Installed"
              value={fixingOfRoadStudsData.roadStudsInstalled}
              onChange={(value: any) =>
                setFixingOfRoadStudsData(prevData => ({
                  ...prevData,
                  roadStudsInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Length of Road Covered (in Km)"
              value={fixingOfRoadStudsData.totalLengthCovered}
              onChange={(value: any) =>
                setFixingOfRoadStudsData(prevData => ({
                  ...prevData,
                  totalLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_ROAD_DELINEATORS:
        const fixingOfRoadDelineatorsProperties = [
          {title: 'Source Material Approved', key: 'sourceMaterialApproved'},
          {title: 'Drawing Approved', key: 'drawingApproved'},
          {
            title: 'Shape and Size as per Approved Drawing',
            key: 'shapeSizeAsPerDrawing',
          },
          {
            title: 'Delineators Fixed Properly',
            key: 'delineatorsFixedProperly',
          },
          {title: 'Line and Level Checked Properly', key: 'lineLevelChecked'},
          {
            title: 'Spacing Between Delineators as per Specifications',
            key: 'spacingBetweenDelineators',
          },
        ];
        return (
          <View>
            {fixingOfRoadDelineatorsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfRoadDelineatorsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfRoadDelineatorsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Nos of Delineators Installed"
              value={fixingOfRoadDelineatorsData.nosOfDelineatorsInstalled}
              onChange={(value: any) =>
                setFixingOfRoadDelineatorsData(prevData => ({
                  ...prevData,
                  nosOfDelineatorsInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total Length the Road Covered in Km"
              value={fixingOfRoadDelineatorsData.totalLengthRoadCovered}
              onChange={(value: any) =>
                setFixingOfRoadDelineatorsData(prevData => ({
                  ...prevData,
                  totalLengthRoadCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_OBJECT_MARKERS:
        const fixingOfObjectMarkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the markers fixed properly?',
            key: 'markersFixedProperly',
          },
          {
            title: 'Whether line and levels checked properly',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {fixingOfObjectMarkersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfObjectMarkersData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfObjectMarkersData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of markers installed"
              value={fixingOfObjectMarkersData.totalMarkersInstalled}
              onChange={(value: any) =>
                setFixingOfObjectMarkersData(prevData => ({
                  ...prevData,
                  totalMarkersInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of highway covered in Km"
              value={fixingOfObjectMarkersData.totalLengthCoveredKm}
              onChange={(value: any) =>
                setFixingOfObjectMarkersData(prevData => ({
                  ...prevData,
                  totalLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_NOISE_BARRIER:
        const fixingOfNoiseBarrierProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the posts fixed at crash barrier properly',
            key: 'postsFixedProperly',
          },
          {
            title: 'Whether posts are in proper line and level',
            key: 'postsLineLevelChecked',
          },
          {
            title:
              'Whether there is gap left between crash barrier and noise barrier',
            key: 'gapBetweenCrashAndNoiseBarrier',
          },
          {
            title: 'Whether the frame fixed tightly with posts',
            key: 'frameFixedTightly',
          },
        ];

        return (
          <View>
            {fixingOfNoiseBarrierProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfNoiseBarrierData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfNoiseBarrierData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Nos of noise barrier panels installed"
              value={fixingOfNoiseBarrierData.totalNoiseBarrierPanelsInstalled}
              onChange={(value: any) =>
                setFixingOfNoiseBarrierData(prevData => ({
                  ...prevData,
                  totalNoiseBarrierPanelsInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of noise barrier fixed at crash barrier in RM"
              value={fixingOfNoiseBarrierData.totalLengthNoiseBarrierFixedRM}
              onChange={(value: any) =>
                setFixingOfNoiseBarrierData(prevData => ({
                  ...prevData,
                  totalLengthNoiseBarrierFixedRM: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_LED_TRAFFIC_BLINKERS:
        const fixingOfLEDTrafficBlinkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the items are in working condition',
            key: 'workingCondition',
          },
          {
            title: 'Whether items are fixed properly',
            key: 'itemsFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineLevelChecked',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {fixingOfLEDTrafficBlinkersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfLEDTrafficBlinkersData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfLEDTrafficBlinkersData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of blinkers installed"
              value={fixingOfLEDTrafficBlinkersData.totalBlinkersInstalled}
              onChange={(value: any) =>
                setFixingOfLEDTrafficBlinkersData(prevData => ({
                  ...prevData,
                  totalBlinkersInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of highway covered in Km"
              value={fixingOfLEDTrafficBlinkersData.totalHighwayLengthCovered}
              onChange={(value: any) =>
                setFixingOfLEDTrafficBlinkersData(prevData => ({
                  ...prevData,
                  totalHighwayLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_HAZARD_MARKERS:
        const fixingOfHazardMarkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawings',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the markers fixed properly?',
            key: 'markersFixedProperly',
          },
          {title: 'Whether line and level checked', key: 'lineLevelsChecked'},
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {fixingOfHazardMarkersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfHazardMarkersData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfHazardMarkersData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of hazard markers installed"
              value={fixingOfHazardMarkersData.totalMarkersInstalled}
              onChange={(value: any) =>
                setFixingOfHazardMarkersData(prevData => ({
                  ...prevData,
                  totalMarkersInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of highway covered in Km"
              value={fixingOfHazardMarkersData.totalLengthCoveredKm}
              onChange={(value: any) =>
                setFixingOfHazardMarkersData(prevData => ({
                  ...prevData,
                  totalLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_FLEXIBLE_MEDIAN_MARKERS:
        const fixingOfFlexibleMedianMarkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the flexible median marker fixed properly',
            key: 'markersFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Whether the spacing is as per specifications',
            key: 'spacingAsPerSpecifications',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {fixingOfFlexibleMedianMarkersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfFlexibleMedianMarkersData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfFlexibleMedianMarkersData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Nos of flexible median marker installed"
              value={fixingOfFlexibleMedianMarkersData.totalMarkersInstalled}
              onChange={(value: any) =>
                setFixingOfFlexibleMedianMarkersData(prevData => ({
                  ...prevData,
                  totalMarkersInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of the road covered in Km"
              value={fixingOfFlexibleMedianMarkersData.totalLengthCoveredKm}
              onChange={(value: any) =>
                setFixingOfFlexibleMedianMarkersData(prevData => ({
                  ...prevData,
                  totalLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_CONVEX_MIRRORS:
        const fixingOfConvexMirrorsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether items are in working condition',
            key: 'workingCondition',
          },
          {
            title: 'Whether mirrors fixed properly at proper location',
            key: 'mirrorsFixedProperly',
          },
          {
            title: 'Whether line, level and angle checked properly',
            key: 'lineLevelAngleChecked',
          },
          {
            title: 'Whether items are clean and visible properly',
            key: 'itemsCleanVisible',
          },
        ];

        return (
          <View>
            {fixingOfConvexMirrorsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfConvexMirrorsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfConvexMirrorsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of mirrors installed"
              value={fixingOfConvexMirrorsData.totalMirrorsInstalled}
              onChange={(value: any) =>
                setFixingOfConvexMirrorsData(prevData => ({
                  ...prevData,
                  totalMirrorsInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of highway covered in Km"
              value={fixingOfConvexMirrorsData.totalLengthCoveredKm}
              onChange={(value: any) =>
                setFixingOfConvexMirrorsData(prevData => ({
                  ...prevData,
                  totalLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />

            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_ANTIGLARES:
        const fixingOfAntiglaresProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether items are fixed properly',
            key: 'itemsFixedProperly',
          },
          {title: 'Whether line and level checked', key: 'lineLevelsChecked'},
          {
            title: 'Whether the spacing are as per specifications',
            key: 'spacingAsPerSpecifications',
          },
          {
            title: 'Whether items are clean and visible properly',
            key: 'itemsCleanVisible',
          },
        ];

        return (
          <View>
            {fixingOfAntiglaresProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfAntiglaresData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfAntiglaresData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total Nos of Antiglares installed"
              value={fixingOfAntiglaresData.totalAntiglaresInstalled}
              onChange={(value: any) =>
                setFixingOfAntiglaresData(prevData => ({
                  ...prevData,
                  totalAntiglaresInstalled: value,
                }))
              }
              isRequired={true}
            />

            <Input
              label="Total length of the road covered in Km"
              value={fixingOfAntiglaresData.totalLengthCoveredKm}
              onChange={(value: any) =>
                setFixingOfAntiglaresData(prevData => ({
                  ...prevData,
                  totalLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.ERECTION_OF_POLES:
        const erectionOfPolesProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {title: 'Whether the source approved or not', key: 'sourceApproved'},
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title:
              'Whether foundations are ready and concrete has achieved the desired strength',
            key: 'foundationsReady',
          },
          {
            title:
              'All the poles are erected properly with alignment as per drawings',
            key: 'polesAlignedProperly',
          },
          {
            title: 'All the nut bolts are tightened and checked properly',
            key: 'nutBoltsTightened',
          },
        ];

        return (
          <View>
            {erectionOfPolesProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={erectionOfPolesData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setErectionOfPolesData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total qty of poles erected"
              value={erectionOfPolesData.totalPolesErected}
              onChange={(value: any) =>
                setErectionOfPolesData(prevData => ({
                  ...prevData,
                  totalPolesErected: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total length of highway covered in Km"
              value={erectionOfPolesData.totalHighwayLengthCovered}
              onChange={(value: any) =>
                setErectionOfPolesData(prevData => ({
                  ...prevData,
                  totalHighwayLengthCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_ARMS:
        const fixingOfArmsProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {title: 'Whether the source approved or not', key: 'sourceApproved'},
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title:
              'All the arms are fixed properly with alignment as per drawings',
            key: 'armsFixedProperly',
          },
          {
            title: 'All the nut bolts are tightened and checked properly',
            key: 'nutsBoltsTightened',
          },
        ];

        return (
          <View>
            {fixingOfArmsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfArmsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfArmsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total qty of arms erected in no."
              value={fixingOfArmsData.totalQtyArmsErected}
              onChange={(value: any) =>
                setFixingOfArmsData(prevData => ({
                  ...prevData,
                  totalQtyArmsErected: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total length of highway covered in Km"
              value={fixingOfArmsData.totalHighwayLengthCoveredKm}
              onChange={(value: any) =>
                setFixingOfArmsData(prevData => ({
                  ...prevData,
                  totalHighwayLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.INSTALLATION_OF_LED_LIGHTS:
        const installationOfLEDLightsProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {title: 'Whether the source approved or not', key: 'sourceApproved'},
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title: 'All the lights are tested before installation',
            key: 'lightsTestedBeforeInstallation',
          },
          {title: 'All the installed properly', key: 'lightsInstalledProperly'},
        ];

        return (
          <View>
            {installationOfLEDLightsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={installationOfLEDLightsData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setInstallationOfLEDLightsData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total qty of lights installed"
              value={installationOfLEDLightsData.totalQtyOfLightsInstalled}
              onChange={(value: any) =>
                setInstallationOfLEDLightsData(prevData => ({
                  ...prevData,
                  totalQtyOfLightsInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total length of highway covered in Km"
              value={installationOfLEDLightsData.totalLengthOfHighwayCoveredKm}
              onChange={(value: any) =>
                setInstallationOfLEDLightsData(prevData => ({
                  ...prevData,
                  totalLengthOfHighwayCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_FLEXIBLE_CABLE:
        const layingOfFlexibleCableProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {title: 'Whether the source approved or not', key: 'sourceApproved'},
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title: 'Whether the cable have been laid properly',
            key: 'cableLaidProperly',
          },
          {
            title:
              'Whether all the joints are made properly and junction boxes are as per specifications',
            key: 'jointsMadeProperly',
          },
          {
            title: 'Whether the end points are terminated properly',
            key: 'endpointsTerminatedProperly',
          },
          {
            title: 'Whether proper testing done and successful',
            key: 'testingSuccessful',
          },
        ];

        return (
          <View>
            {layingOfFlexibleCableProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={layingOfFlexibleCableData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setLayingOfFlexibleCableData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total length of cable laid in RM"
              value={layingOfFlexibleCableData.totalCableLengthRM}
              onChange={(value: any) =>
                setLayingOfFlexibleCableData(prevData => ({
                  ...prevData,
                  totalCableLengthRM: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total length of highway covered in Km"
              value={layingOfFlexibleCableData.totalHighwayLengthKm}
              onChange={(value: any) =>
                setLayingOfFlexibleCableData(prevData => ({
                  ...prevData,
                  totalHighwayLengthKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.LAYING_OF_LT_CABLE:
        const layingOfLTCableProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {title: 'Whether the source approved or not', key: 'sourceApproved'},
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title: 'Whether the cable have been laid properly',
            key: 'cableLaidProperly',
          },
          {
            title:
              'Whether all the joints are made properly as per the specifications or not',
            key: 'jointsMadeProperly',
          },
          {
            title: 'Whether the end points are terminated properly',
            key: 'endPointsTerminated',
          },
          {
            title: 'Whether proper testing done and successful',
            key: 'properTestingDone',
          },
        ];

        return (
          <View>
            {layingOfLTCableProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={layingOfLTCableData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setLayingOfLTCableData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total length of cable laid in RM"
              value={layingOfLTCableData.totalCableLengthRM}
              onChange={(value: any) =>
                setLayingOfLTCableData(prevData => ({
                  ...prevData,
                  totalCableLengthRM: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total length of highway covered in Km"
              value={layingOfLTCableData.totalHighwayLengthKm}
              onChange={(value: any) =>
                setLayingOfLTCableData(prevData => ({
                  ...prevData,
                  totalHighwayLengthKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_STONE:
        const fixingOfStoneProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the stones are fixed properly',
            key: 'stonesFixedProperly',
          },
          {
            title:
              'Whether the project number, Terminal station & kilometrage etc. are mentioned',
            key: 'projectDetailsCorrect',
          },
          {
            title: 'Whether the items are properly cleaned and visible',
            key: 'itemsCleanedVisible',
          },
        ];

        return (
          <View>
            {fixingOfStoneProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={fixingOfStoneData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFixingOfStoneData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total no. of stones installed"
              value={fixingOfStoneData.totalStonesInstalled}
              onChange={(value: any) =>
                setFixingOfStoneData(prevData => ({
                  ...prevData,
                  totalStonesInstalled: value,
                }))
              }
              isRequired={true}
            />
            <Input
              label="Total length of road covered in Km"
              value={fixingOfStoneData.totalLengthCoveredKm}
              onChange={(value: any) =>
                setFixingOfStoneData(prevData => ({
                  ...prevData,
                  totalLengthCoveredKm: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PLASTERING:
        const plasteringProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the cement source approved or not',
            key: 'cementSourceApproved',
          },
          {
            title:
              'Whether the source of other materials such as sand, water etc.',
            key: 'otherMaterialsSourceApproved',
          },
          {
            title:
              'Whether the plaster has been made in the proportions as per the specifications',
            key: 'proportionsAsPerSpecs',
          },
          {
            title:
              'Whether the thickness of plaster has been done as per the approved drawings',
            key: 'thicknessAsPerDrawings',
          },
          {
            title: 'Whether the surface finish is proper and uniform',
            key: 'surfaceFinishProper',
          },
        ];

        return (
          <View>
            {plasteringProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={plasteringData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPlasteringData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total plastering work done in sqft"
              value={plasteringData.totalPlasteringWorkSqft}
              onChange={(value: any) =>
                setPlasteringData(prevData => ({
                  ...prevData,
                  totalPlasteringWorkSqft: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.PUTTY:
        const puttyProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether the plastered surface is dried properly and ready for putty',
            key: 'surfaceDriedReadyForPutty',
          },
          {
            title:
              'Whether the thickness of putty has been done as per the approved drawings',
            key: 'thicknessAsPerDrawing',
          },
          {
            title: 'Whether the surface finish is proper and uniform',
            key: 'surfaceFinishUniform',
          },
        ];

        return (
          <View>
            {puttyProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={puttyData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setPuttyData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total putty work done in sqft"
              value={puttyData.totalPuttyWorkSqft}
              onChange={(value: any) =>
                setPuttyData(prevData => ({
                  ...prevData,
                  totalPuttyWorkSqft: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.HVAC_WORK:
        const hvacWorkProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title: 'Whether inspection done and dispatch clearance obtained',
            key: 'inspectionAndDispatchCleared',
          },
          {
            title: 'Whether the site is ready prior to HVAC work',
            key: 'siteReadyForHVAC',
          },
          {
            title: 'Whether ducting is done as per the approved drawings',
            key: 'ductingAsPerDrawings',
          },
          {
            title:
              'Whether all the connection points are as per the approved drawings',
            key: 'connectionPointsAsPerDrawings',
          },
          {
            title: 'Whether AC fittings etc done as per the approved drawings',
            key: 'acFittingsAsPerDrawings',
          },
          {
            title:
              'Whether the entire system is tested properly and electrical certificate obtained',
            key: 'systemTestedAndCertified',
          },
        ];

        return (
          <View>
            {hvacWorkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={hvacWorkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setHvacWorkData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total sqft area covered under HVAC work"
              value={hvacWorkData.totalSqftAreaCovered}
              onChange={(value: any) =>
                setHvacWorkData(prevData => ({
                  ...prevData,
                  totalSqftAreaCovered: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.CEILING_WORK:
        const ceilingWorkProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceivedAsPerSpecifications',
          },
          {
            title: 'Whether the site is ready for ceiling work',
            key: 'siteReadyForCeilingWork',
          },
          {
            title:
              'Whether the finishing work of ceiling is proper and uniform',
            key: 'finishingWorkUniform',
          },
          {
            title:
              'Whether the ceiling work completed to the satisfaction of the site in charge',
            key: 'ceilingWorkCompletedToSatisfaction',
          },
        ];

        return (
          <View>
            {ceilingWorkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={ceilingWorkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setCeilingWorkData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total sqft area of ceiling work completed"
              value={ceilingWorkData.totalSqftAreaCompleted}
              onChange={(value: any) =>
                setCeilingWorkData(prevData => ({
                  ...prevData,
                  totalSqftAreaCompleted: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.FURNITURE_WORK:
        const furnitureWorkProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceivedAsPerSpecs',
          },
          {
            title: 'Whether the site is ready for Furniture work',
            key: 'siteReadyForFurnitureWork',
          },
          {
            title: 'Whether the finishing furniture work is proper and uniform',
            key: 'finishingFurnitureProper',
          },
          {
            title:
              'Whether the furniture work completed to the satisfaction of the site in charge',
            key: 'workSatisfactoryToSiteInCharge',
          },
        ];

        return (
          <View>
            {furnitureWorkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={furnitureWorkData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setFurnitureWorkData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.DOOR_WORKS:
        const doorWorksProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceivedAsPerSpec',
          },
          {
            title: 'Whether the site is ready for Door work',
            key: 'siteReadyForDoorWork',
          },
          {
            title: 'Whether the finishing work is proper and uniform',
            key: 'finishingWorkProper',
          },
          {
            title:
              'Whether the work completed to the satisfaction of the site in charge',
            key: 'workSatisfactionAchieved',
          },
        ];

        return (
          <View>
            {doorWorksProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={doorWorksData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setDoorWorksData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.WINDOW_WORKS:
        const windowWorksProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceivedAsPerSpecs',
          },
          {
            title: 'Whether the site is ready for Window work',
            key: 'siteReadyForWindowWork',
          },
          {
            title: 'Whether the finishing work is proper and uniform',
            key: 'finishingWorkProper',
          },
          {
            title:
              'Whether the work completed to the satisfaction of the site in charge',
            key: 'workCompletedToSatisfaction',
          },
        ];

        return (
          <View>
            {windowWorksProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={windowWorksData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setWindowWorksData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );
      case TASK_TYPES.GLASS_WORKS:
        const glassWorksProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title: 'Whether the material source approved or not',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Whether material received at site is as per the specifications and not damaged',
            key: 'materialReceivedAsPerSpecs',
          },
          {
            title:
              'Whether the quality and thickness of the glass is as per the desired specifications',
            key: 'glassQualityAndThicknessApproved',
          },
          {
            title: 'Whether the site is ready for Glass work',
            key: 'siteReadyForGlassWork',
          },
          {
            title: 'Whether the finishing work is proper and uniform',
            key: 'finishingWorkProper',
          },
          {
            title:
              'Whether the work completed to the satisfaction of the site in charge',
            key: 'workCompletedToSiteInChargeSatisfaction',
          },
        ];

        return (
          <View>
            {glassWorksProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <DropdownPicker
                  label={property.title}
                  value={glassWorksData[property.key]}
                  items={YES_NO_LIST}
                  onChange={(value: any) =>
                    setGlassWorksData(prevData => ({
                      ...prevData,
                      [property.key]: value,
                    }))
                  }
                  isRequired={true}
                />
              </View>
            ))}
            <Input
              label="Total glass work completed in sqft"
              value={glassWorksData.totalGlassWorkCompletedSqft}
              onChange={(value: any) =>
                setGlassWorksData(prevData => ({
                  ...prevData,
                  totalGlassWorkCompletedSqft: value,
                }))
              }
              isRequired={true}
            />
            <View>
              <CalendarPicker
                label="Date"
                value={rfiDate}
                onChange={date => setRFIDate(date)}
              />
              <TimePicker
                label="Time"
                value={rfiTime}
                onChange={time => setRFITime(time)}
              />
              <TextInput
                style={styles.commonInputFiels}
                placeholder="Recommendations"
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={false}
                value={comments}
                onChangeText={text => setComments(text)}
              />
            </View>
          </View>
        );

      case TASK_TYPES.LIFTING_LEFT:
      case TASK_TYPES.LIFTING_YARD:
      case TASK_TYPES.LIFTING_RIGHT:
      case TASK_TYPES.LIFTING_TRANSPORT_ERECTION:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <Text style={styles.headerText}>
                Preparation of Area for Lifting at Stacking Yard
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Area is hard barricaded with proper signages"
                  value={liftingCombinedLRData.areaBarricaded}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('areaBarricaded', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary lights for proper illumination of the erection area is available at night"
                  value={liftingCombinedLRData.temporaryLights}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('temporaryLights', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Flag man/Marshal available"
                  value={liftingCombinedLRData.flagManAvailable}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('flagManAvailable', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Methodology & Scheme for lifting and stacking is available at site"
                  value={liftingCombinedLRData.liftingMethodology}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('liftingMethodology', value)
                  }
                />
              </View>
              <Text style={styles.headerText}>
                Tools and Tackles for Lifting at Stacking Yard
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="De-shackles and slings of proper capacity and their test certificate by third party is available"
                  value={liftingCombinedLRData.deshacklesTestCertificate}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('deshacklesTestCertificate', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety color code present on the de-shackles"
                  value={liftingCombinedLRData.safetyColorCode}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('safetyColorCode', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Hydraulic jacks are in good condition with proper calibration certificates"
                  value={liftingCombinedLRData.hydraulicJacksCondition}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('hydraulicJacksCondition', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Limit switch of lifting hoist is working properly"
                  value={liftingCombinedLRData.hoistLimitSwitch}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('hoistLimitSwitch', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Cotter pin are placed in all lifting assembly"
                  value={liftingCombinedLRData.cotterPinsPlaced}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('cotterPinsPlaced', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Macalloy Bars / pins for lifting of Wings in proper condition"
                  value={liftingCombinedLRData.macalloyBarsCondition}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('macalloyBarsCondition', value)
                  }
                />
              </View>
              <Text style={styles.headerText}>
                Lifting of Segment at Stacking Yard
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Work at height permit obtained from IE/concerned agency"
                  value={liftingCombinedLRData.heightPermitObtained}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('heightPermitObtained', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All Mac-alloy bars and wire rope assemblies have valid third-party test certificate"
                  value={liftingCombinedLRData.macalloyBarsTestCertificate}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'macalloyBarsTestCertificate',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting sequence as per the approved methodology provided at site for counter"
                  value={liftingCombinedLRData.liftingSequence}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('liftingSequence', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting holes are in proper location as per approved drawing"
                  value={liftingCombinedLRData.liftingHolesLocation}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('liftingHolesLocation', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting arrangements are working properly"
                  value={liftingCombinedLRData.liftingArrangementsWorking}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'liftingArrangementsWorking',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Pre-stressing duct of segments are clear of any foreign materials"
                  value={liftingCombinedLRData.preStressingDuctsClear}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('preStressingDuctsClear', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Comprehensive Strength of concrete of wings are gained as per the approved drawing"
                  value={liftingCombinedLRData.concreteStrengthGained}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('concreteStrengthGained', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Slider trolley is in proper position"
                  value={liftingCombinedLRData.sliderTrolleyPosition}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('sliderTrolleyPosition', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>
                Segment Dispatch and Transportation
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sand blasting on match cast face done"
                  value={liftingCombinedLRData.sandBlastingDone}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('sandBlastingDone', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Repairing (if necessary) & finishing done"
                  value={liftingCombinedLRData.repairingFinished}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('repairingFinished', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="No repairing on shearkey & gluing location"
                  value={liftingCombinedLRData.noRepairsOnShearkey}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('noRepairsOnShearkey', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Bund for curing at top removed & top to be cleaned by broom"
                  value={liftingCombinedLRData.bundRemoved}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('bundRemoved', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Soffit & deck top cleaned by broomer"
                  value={liftingCombinedLRData.soffitDeckCleaned}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('soffitDeckCleaned', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sheathing duct is cleaned, no concrete at rubber bunk portion"
                  value={liftingCombinedLRData.sheathingDuctCleaned}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('sheathingDuctCleaned', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Sheathing duct alignment ok, checked by drolly passing"
                  value={liftingCombinedLRData.ductAlignmentChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('ductAlignmentChecked', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary stressing hole at soffit cleaned & dimension checked"
                  value={liftingCombinedLRData.temporaryStressingHoleCleaned}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('stressingHoleCleaned', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Fitness of Trailer with proper calibration certificate"
                  value={liftingCombinedLRData.trailerFitnessChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('trailerFitnessChecked', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Tyres of trailer and air pressure checked"
                  value={liftingCombinedLRData.trailerTyresChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('trailerTyresChecked', value)
                  }
                />
              </View>

              <Text style={styles.headerText}>
                Preparation of Area for Lifting at Erection Site
              </Text>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Ground properly leveled for placement of trailer"
                  value={liftingCombinedLRData.groundLeveled}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('groundLeveled', value)
                  }
                />
              </View>
              {/* E) Preparation of Area for Lifting at Erection Site */}
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Ground properly leveled for placement of trailer"
                  value={liftingCombinedLRData.groundLeveled}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('groundLeveled', value)
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Area is hard barricaded with proper signages"
                  value={liftingCombinedLRData.areaBarricadedErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'areaBarricadedErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Temporary lights for proper illumination of the erection area is available at night"
                  value={liftingCombinedLRData.temporaryLightsErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'temporaryLightsErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Flag man/Marshal available"
                  value={liftingCombinedLRData.flagManAvailableErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'flagManAvailableErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Methodology & Scheme for lifting and stacking is available at site"
                  value={liftingCombinedLRData.liftingMethodologyErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'liftingMethodologyErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Crane is positioned as per drawing"
                  value={liftingCombinedLRData.cranePositioned}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('cranePositioned', value)
                  }
                />
              </View>

              {/* F) Tools and Tackles for lifting at Erection Site */}
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="De-shackles and slings of proper capacity and their test certificate by third party is available"
                  value={
                    liftingCombinedLRData.deshacklesTestCertificateErectionSite
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'deshacklesTestCertificateErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety color code present on the de-shackles"
                  value={liftingCombinedLRData.safetyColorCodeErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'safetyColorCodeErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Hydraulic jacks are in good condition with proper calibration certificates"
                  value={
                    liftingCombinedLRData.hydraulicJacksConditionErectionSite
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'hydraulicJacksConditionErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Limit switch of lifting hoist is working properly"
                  value={liftingCombinedLRData.hoistLimitSwitchErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'hoistLimitSwitchErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Cotter pin are placed in all lifting assembly"
                  value={liftingCombinedLRData.cotterPinsPlacedErectionSite}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'cotterPinsPlacedErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Macalloy Bars / pins for lifting of Wings in proper condition"
                  value={
                    liftingCombinedLRData.macalloyBarsConditionErectionSite
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'macalloyBarsConditionErectionSite',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="TPI of all parts of Cranes & Slings done"
                  value={liftingCombinedLRData.cranesTPICompleted}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('cranesTPICompleted', value)
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Latest TPI Certificates of all parts of Cranes & Slings available at Site"
                  value={liftingCombinedLRData.cranesTPICertificatesAvailable}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'cranesTPICertificatesAvailable',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Counter-weights are available & placed as per drawing"
                  value={liftingCombinedLRData.counterWeightsPlaced}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('counterWeightsPlaced', value)
                  }
                />
              </View>

              {/* G) Lifting and Positioning of segments */}
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Positioning of segment marked"
                  value={liftingCombinedLRData.positioningOfSegmentMarked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting(
                      'positioningOfSegmentMarked',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Traffic properly diverted & Traffic marshals are in place"
                  value={liftingCombinedLRData.trafficDiverted}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('trafficDiverted', value)
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Safety & Fitness of all workers working at height checked and certified"
                  value={liftingCombinedLRData.workersSafetyChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('workersSafetyChecked', value)
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All Safety arrangements are placed at Site"
                  value={liftingCombinedLRData.safetyArrangementsPlaced}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('safetyArrangementsPlaced', value)
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Segments positioned at the specified / marked location"
                  value={liftingCombinedLRData.segmentPositioned}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('segmentPositioned', value)
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Necessary lateral / Site support ensured before releasing the segment by Cranes"
                  value={liftingCombinedLRData.lateralSupportEnsured}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleInputChangeLifting('lateralSupportEnsured', value)
                  }
                />
              </View>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
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
      case TASK_TYPES.CURING:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Water used for curing is free from oil, salt, acid and organic minerals."
                  value={curingData.waterUsedForCuring}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleCuring('waterUsedForCuring', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="pH value of water not be less than 6."
                  value={curingData.waterUsedForCuring}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleCuring('phValueOfWater', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <Input
                  label="Consumption of water in Kilo liter"
                  value={curingData.consumptionOfWater}
                  onChange={(value: string) =>
                    handleCuring('consumptionOfWater', value)
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
          </ScrollView>
        );
      case TASK_TYPES.FIXING_OF_SHUTTER:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Shuttering material is New"
                  value={fixingShutterData.shutterMaterial}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleFixingShutter('shutterMaterial', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Repairs are ok"
                  value={fixingShutterData.repairsAreOf}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleFixingShutter('repairsAreOf', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Cleanliness of shuttering"
                  value={fixingShutterData.cleanlinessOfShutter}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleFixingShutter('cleanlinessOfShutter', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Oiling of shuttering"
                  value={fixingShutterData.oilingOfShutter}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleFixingShutter('oilingOfShutter', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Shuttering design, ok? (Dimension, Diagonal, Sunken portion etc.)"
                  value={fixingShutterData.shutterDesignOk}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleFixingShutter('shutterDesignOk', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Alignments /levels /rigidity, ok"
                  value={fixingShutterData.alignmentLevelsRigidity}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleFixingShutter('alignmentLevelsRigidity', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Check props are they ok"
                  value={fixingShutterData.checkPropsAreTheyOk}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleFixingShutter('checkPropsAreTheyOk', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Check acrow span. Are they ok"
                  value={fixingShutterData.checkAcrowSapnAreTheyOk}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleFixingShutter('checkAcrowSapnAreTheyOk', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Check braces. Are they ok"
                  value={fixingShutterData.checkBracesAreTheyOk}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleFixingShutter('checkBracesAreTheyOk', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Check sealing joints/holes, ok"
                  value={fixingShutterData.checkSealingJointsHoles}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleFixingShutter('checkSealingJointsHoles', value)
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
          </ScrollView>
        );
      case TASK_TYPES.ERECTION_OF_TEMPORARY_STRUCTURE:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Has any risk assessment been carried out"
                  value={erectionOfTemporaryStructure.hasAnyRiskAssessment}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'hasAnyRiskAssessment',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the crane/hydra on firm level bases"
                  value={erectionOfTemporaryStructure.craneHydraLevelBase}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'craneHydraLevelBase',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are all operation trained and competent"
                  value={erectionOfTemporaryStructure.areAllOperationTrained}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'areAllOperationTrained',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is crane tested and operated"
                  value={erectionOfTemporaryStructure.isCraneTested}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure('isCraneTested', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Does the crane have a current test certificate"
                  value={erectionOfTemporaryStructure.doesTheCraneCertificate}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'doesTheCraneCertificate',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All lifting tools and tackles are being identified, checked and have valid resister"
                  value={erectionOfTemporaryStructure.allLiftingToolsAndTackles}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'allLiftingToolsAndTackles',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="The person working at height are trained and lash with all fall protection devices"
                  value={erectionOfTemporaryStructure.protectionDevices}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'protectionDevices',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Structure on which columns / beams erected have attained their strength"
                  value={erectionOfTemporaryStructure.atteainedTheirStrength}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'atteainedTheirStrength',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Workmen provided with all required PPE’s"
                  value={erectionOfTemporaryStructure.workmenProvided}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure('workmenProvided', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Whether sufficient illumination is provided around the working area"
                  value={erectionOfTemporaryStructure.whetherSufficient}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'whetherSufficient',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the SWL marked on all lifting tools & tackles"
                  value={erectionOfTemporaryStructure.liftingToolsTackles}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'liftingToolsTackles',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All wielding machine, electrical equipment’s & generators properly earthed."
                  value={
                    erectionOfTemporaryStructure.equipmentsGeneratorsProperlyEarthed
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'equipmentsGeneratorsProperlyEarthed',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are the walkway maintained free from obstacle all the time."
                  value={erectionOfTemporaryStructure.walkwayMaintainedFreeForm}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'walkwayMaintainedFreeForm',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is safety latch/locking available"
                  value={
                    erectionOfTemporaryStructure.safetyLatchLockingAvailable
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'safetyLatchLockingAvailable',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Proper warning sign available at site."
                  value={erectionOfTemporaryStructure.properWarningSign}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'properWarningSign',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting arrangements are approved by competent person"
                  value={
                    erectionOfTemporaryStructure.liftingArrangementsAreApproved
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'liftingArrangementsAreApproved',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is footing above temp. structure fixed achieve their compressive strength"
                  value={
                    erectionOfTemporaryStructure.achieveTheirCompressiveStrength
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'achieveTheirCompressiveStrength',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Ground leveling"
                  value={erectionOfTemporaryStructure.groundLeveling}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure('groundLeveling', value)
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is Structure set out to the required line and levels."
                  value={
                    erectionOfTemporaryStructure.structureSetOutToTheLevels
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'structureSetOutToTheLevels',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="For welding, is welder qualification and skilled checked and certified"
                  value={
                    erectionOfTemporaryStructure.aualificationAndSkilledCheckedAndCertified
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleErectionOfTemporaryStructure(
                      'aualificationAndSkilledCheckedAndCertified',
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
          </ScrollView>
        );
      case TASK_TYPES.PAINTING_OF_STEEL_GIRDERS_DIAPHRAGMS:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is equipment regular inspected"
                  value={paintingOfSteelGirdersDiaphragms.hasAnyRiskAssessment}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'hasAnyRiskAssessment',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the worker worn Personal Protective Equipment"
                  value={
                    paintingOfSteelGirdersDiaphragms.isWorkerWarnPersonalProtective
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'isWorkerWarnPersonalProtective',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the personal present at the Blasting Pot and compressor at all times"
                  value={paintingOfSteelGirdersDiaphragms.presentAtBlastingPot}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'presentAtBlastingPot',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is every structural member released for painting having identification Tag"
                  value={paintingOfSteelGirdersDiaphragms.identificationTag}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'identificationTag',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the surface checking prior to blasting for mechanical damages (like spatters, slag’s etc.)"
                  value={
                    paintingOfSteelGirdersDiaphragms.surfaceCheckPriorBlasting
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'surfaceCheckPriorBlasting',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the surface free from oil, grease and other contamination"
                  value={
                    paintingOfSteelGirdersDiaphragms.surfaceFreeFromContamination
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'surfaceFreeFromContamination',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the weather and temperature suitable for blasting"
                  value={
                    paintingOfSteelGirdersDiaphragms.suitableWeatherForBlasting
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'suitableWeatherForBlasting',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the compressed air free from water, oil etc."
                  value={paintingOfSteelGirdersDiaphragms.compressedAirQuality}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'compressedAirQuality',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are the areas of member protected that not to be blasted"
                  value={paintingOfSteelGirdersDiaphragms.protectedAreas}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'protectedAreas',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is there high-pressure water used to remove salt and other contaminations"
                  value={
                    paintingOfSteelGirdersDiaphragms.highPressureWaterUsage
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'highPressureWaterUsage',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the abrasive used as per the required specification (No reuse of abrasives in open Blast condition)"
                  value={paintingOfSteelGirdersDiaphragms.abrasiveSpecification}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'abrasiveSpecification',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the copy of batch certificate of abrasive used available at the factory"
                  value={
                    paintingOfSteelGirdersDiaphragms.batchCertificateAvailable
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'batchCertificateAvailable',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the Blasting Nozzle Pressure checked"
                  value={paintingOfSteelGirdersDiaphragms.nozzlePressureChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'nozzlePressureChecked',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are the all-blasted surface inspected for proper cleaning"
                  value={paintingOfSteelGirdersDiaphragms.inspectedForCleaning}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'inspectedForCleaning',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the Visually checked for any mechanical damage/ lamination"
                  value={paintingOfSteelGirdersDiaphragms.visualCheckDamage}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'visualCheckDamage',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the Blasted structural member shifted carefully without damage"
                  value={paintingOfSteelGirdersDiaphragms.shiftedWithoutDamage}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'shiftedWithoutDamage',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are the surrounding areas covered to prevent overspray"
                  value={
                    paintingOfSteelGirdersDiaphragms.surroundingAreaCovered
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'surroundingAreaCovered',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the painting system as per specification"
                  value={
                    paintingOfSteelGirdersDiaphragms.paintingSystemSpecification
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'paintingSystemSpecification',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the Paint mixed and prepared in accordance with the approved manufacturer instructions"
                  value={
                    paintingOfSteelGirdersDiaphragms.paintMixedAsPerInstructions
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'paintMixedAsPerInstructions',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the TIP size and spraying procedure adhered"
                  value={
                    paintingOfSteelGirdersDiaphragms.tipSizeSprayingProcedure
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'tipSizeSprayingProcedure',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the Solvent dilution accordance with the manufacturer instruction and recommendation"
                  value={
                    paintingOfSteelGirdersDiaphragms.solventDilutionAccordance
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'solventDilutionAccordance',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the required areas striped before applying paints"
                  value={
                    paintingOfSteelGirdersDiaphragms.areasStripedBeforePainting
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'areasStripedBeforePainting',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are the paints, curing agent, Thinner used of within the shelf life and from the same manufacturer"
                  value={
                    paintingOfSteelGirdersDiaphragms.materialsWithinShelfLife
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'materialsWithinShelfLife',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the weather condition checked prior to painting"
                  value={
                    paintingOfSteelGirdersDiaphragms.weatherConditionChecked
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'weatherConditionChecked',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the paint applied as per specification and related paint system"
                  value={
                    paintingOfSteelGirdersDiaphragms.paintAppliedPerSpecification
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'paintAppliedPerSpecification',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the paint mixed, agitated and applied within the specified pot life"
                  value={
                    paintingOfSteelGirdersDiaphragms.paintMixedWithinPotLife
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'paintMixedWithinPotLife',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the paint applied having even coating thickness at the overlapping passes to achieve the specified dry film thickness"
                  value={paintingOfSteelGirdersDiaphragms.evenCoatingThickness}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'evenCoatingThickness',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the WFT checked for required DFT"
                  value={paintingOfSteelGirdersDiaphragms.wftCheckedForDft}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'wftCheckedForDft',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the overcoating interval maintained as per requirement"
                  value={
                    paintingOfSteelGirdersDiaphragms.overcoatingIntervalMaintained
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'overcoatingIntervalMaintained',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the proper coating system applied during intervals"
                  value={
                    paintingOfSteelGirdersDiaphragms.properCoatingSystemApplied
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'properCoatingSystemApplied',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the paint surface visually good and free from runs, sags, wrinkles etc.…"
                  value={paintingOfSteelGirdersDiaphragms.paintSurfaceQuality}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'paintSurfaceQuality',
                      value,
                    )
                  }
                />
              </View>

              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the record maintained of painting"
                  value={paintingOfSteelGirdersDiaphragms.recordMaintained}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePaintingOfSteelGirdersDiaphragms(
                      'recordMaintained',
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
          </ScrollView>
        );
      case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Rebar and dimension (dia, len, and shape) checked as per GFC"
                  value={placementOfReinforcementCage.rebarDimensionChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePlacementOfReinforcementCage(
                      'rebarDimensionChecked',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Shaping, No and Length of Bars checked as per GFC"
                  value={placementOfReinforcementCage.shapingCheckedAsPerGFC}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePlacementOfReinforcementCage(
                      'shapingCheckedAsPerGFC',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Rebars securely tightened/bound by tie bars"
                  value={placementOfReinforcementCage.rebarsSecurelyBound}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePlacementOfReinforcementCage(
                      'rebarsSecurelyBound',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Splice length and location checked as per GFC"
                  value={placementOfReinforcementCage.spliceLengthChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePlacementOfReinforcementCage(
                      'spliceLengthChecked',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Rebar within tolerance limit"
                  value={placementOfReinforcementCage.rebarWithinTolerance}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePlacementOfReinforcementCage(
                      'rebarWithinTolerance',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Coupler arrangements within tolerance"
                  value={
                    placementOfReinforcementCage.couplerArrangementsWithinTolerance
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePlacementOfReinforcementCage(
                      'couplerArrangementsWithinTolerance',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Bar Bending schedule checked"
                  value={placementOfReinforcementCage.barBendingScheduleChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handlePlacementOfReinforcementCage(
                      'barBendingScheduleChecked',
                      value,
                    )
                  }
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
          </ScrollView>
        );
      case TASK_TYPES.TRANSPORTATION_OF_STEEL_GIRDERS_DIAPHRAGMS_ERECTION_AT_SITE:
        return (
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.columnWiseData}>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Whether safe access to workplace is provided?"
                  value={
                    transportationOfSteelGirdersDiaphragms.safeAccessProvided
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'safeAccessProvided',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the working platform fully onboarded on the deck?"
                  value={
                    transportationOfSteelGirdersDiaphragms.workingPlatformOnBoarded
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'workingPlatformOnBoarded',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All guard rails are firmly attached with mould (at 1m with mid rails and toe board)?"
                  value={
                    transportationOfSteelGirdersDiaphragms.guardRailsAttached
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'guardRailsAttached',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Adequate fall protection arrangement made (static line, double lanyard harness, fall arrestor)?"
                  value={
                    transportationOfSteelGirdersDiaphragms.fallProtectionArrangement
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'fallProtectionArrangement',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Whether hand tools and handling material secure against accidental fall?"
                  value={
                    transportationOfSteelGirdersDiaphragms.toolsSecuredAgainstFall
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'toolsSecuredAgainstFall',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Has any risk assessment been carried out?"
                  value={
                    transportationOfSteelGirdersDiaphragms.riskAssessmentCarriedOut
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'riskAssessmentCarriedOut',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the crane on firm level bases?"
                  value={
                    transportationOfSteelGirdersDiaphragms.craneOnFirmLevelBases
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'craneOnFirmLevelBases',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are all operators trained and competent?"
                  value={
                    transportationOfSteelGirdersDiaphragms.operatorsTrainedAndCompetent
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'operatorsTrainedAndCompetent',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the crane tested and operated?"
                  value={
                    transportationOfSteelGirdersDiaphragms.craneTestedAndOperated
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'craneTestedAndOperated',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is there a swing alarm installed and functioning?"
                  value={
                    transportationOfSteelGirdersDiaphragms.swingAlarmInstalled
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'swingAlarmInstalled',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Does the crane have a current test certificate?"
                  value={
                    transportationOfSteelGirdersDiaphragms.craneTestCertificateCurrent
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'craneTestCertificateCurrent',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Does the boom of the crane have a current test certificate?"
                  value={
                    transportationOfSteelGirdersDiaphragms.craneBoomTestCertificateCurrent
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'craneBoomTestCertificateCurrent',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Oil (leakage)"
                  value={
                    transportationOfSteelGirdersDiaphragms.oilLeakageChecked
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'oilLeakageChecked',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Greasing"
                  value={transportationOfSteelGirdersDiaphragms.greasingChecked}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'greasingChecked',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Outriggers (Fully extended)"
                  value={
                    transportationOfSteelGirdersDiaphragms.outriggersFullyExtended
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'outriggersFullyExtended',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Level indicators (2 degree to 3 degree)"
                  value={
                    transportationOfSteelGirdersDiaphragms.levelIndicatorsWithinLimit
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'levelIndicatorsWithinLimit',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Base plate under the outriggers"
                  value={
                    transportationOfSteelGirdersDiaphragms.basePlateUnderOutriggers
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'basePlateUnderOutriggers',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Rigging (2 Nos) angles"
                  value={
                    transportationOfSteelGirdersDiaphragms.riggingAnglesChecked
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'riggingAnglesChecked',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are all the examination and tests carried out and certified by a competent person?"
                  value={
                    transportationOfSteelGirdersDiaphragms.examsAndTestsCertified
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'examsAndTestsCertified',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All lifting tools and tackles are being identified, checked, and have a valid register?"
                  value={
                    transportationOfSteelGirdersDiaphragms.liftingToolsCheckedAndValid
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'liftingToolsCheckedAndValid',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are personnel working at height trained and equipped with all fall protection devices?"
                  value={
                    transportationOfSteelGirdersDiaphragms.personnelTrainedAndProtected
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'personnelTrainedAndProtected',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are workmen provided with all required PPEs?"
                  value={transportationOfSteelGirdersDiaphragms.ppeProvided}
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'ppeProvided',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Whether sufficient illumination is provided around the working area?"
                  value={
                    transportationOfSteelGirdersDiaphragms.sufficientIlluminationProvided
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'sufficientIlluminationProvided',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the SWL marked on all lifting tools & tackles?"
                  value={
                    transportationOfSteelGirdersDiaphragms.swlMarkedOnTools
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'swlMarkedOnTools',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="All welding machines, electrical equipment, and generators properly earthed?"
                  value={
                    transportationOfSteelGirdersDiaphragms.equipmentProperlyEarthed
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'equipmentProperlyEarthed',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are the walkways maintained free from obstacles at all times?"
                  value={
                    transportationOfSteelGirdersDiaphragms.walkwaysFreeFromObstacles
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'walkwaysFreeFromObstacles',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is safety latch/locking available?"
                  value={
                    transportationOfSteelGirdersDiaphragms.safetyLatchAvailable
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'safetyLatchAvailable',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Are proper warning signs available at the site?"
                  value={
                    transportationOfSteelGirdersDiaphragms.warningSignsAvailable
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'warningSignsAvailable',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Lifting arrangements checked?"
                  value={
                    transportationOfSteelGirdersDiaphragms.liftingArrangementsChecked
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'liftingArrangementsChecked',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Ground leveling done?"
                  value={
                    transportationOfSteelGirdersDiaphragms.groundLevelingDone
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'groundLevelingDone',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="Is the structure set out to the required line and levels?"
                  value={
                    transportationOfSteelGirdersDiaphragms.structureSetOutCorrectly
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'structureSetOutCorrectly',
                      value,
                    )
                  }
                />
              </View>
              <View style={styles.categoryColumn}>
                <DropdownPicker
                  label="For welding, is welder qualification and skill checked and certified?"
                  value={
                    transportationOfSteelGirdersDiaphragms.welderQualifiedAndCertified
                  }
                  items={YES_NO_NA_LIST}
                  onChange={(value: string) =>
                    handleTransportationOfSteelGirdersDiaphragms(
                      'welderQualifiedAndCertified',
                      value,
                    )
                  }
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
          </ScrollView>
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
    marginVertical: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    rowGap: 7,
  },
  cell: {
    width: 150,
    maxWidth: 220,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
  },
  marginBottom10: {
    marginBottom: 10,
  },
  cellText: {
    fontWeight: '600',
    fontSize: 13,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
});

export default MyWork;
