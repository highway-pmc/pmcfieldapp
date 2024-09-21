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
        errorMessage = 'Vehicle No must be the last 4 digits and contain only numbers.';
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
        errorMessage = 'Quantity dumped must be > 0, up to 3 decimal places, and max 100,000.';
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
const validateFixingVerticalPostData = (fixingVerticalPostData: any): boolean => {
  const totalPostsInstalled = parseInt(fixingVerticalPostData.totalVerticalPostInstalled);

  if (isNaN(totalPostsInstalled) || totalPostsInstalled <= 0 || totalPostsInstalled > 10000) {
    showSnackbar(
      'Please enter a valid number of vertical posts installed (integer, > 0, <= 10000)',
      'error',
    );
    return false;
  }

  fixingVerticalPostData.totalVerticalPostInstalled = Number(fixingVerticalPostData.totalVerticalPostInstalled);
  
  return true;
};

const validateFixingOfMetalBeamData = (fixingOfMetalBeamData: any): boolean => {
  const totalLength = parseFloat(fixingOfMetalBeamData.totalLengthOfMetalBeamFixed);

  // Validation for Total Length of Metal Beam Fixed in RM
  if (
    isNaN(totalLength) ||
    totalLength <= 0 ||
    totalLength > 1000000 ||
    fixingOfMetalBeamData.totalLengthOfMetalBeamFixed.split('.')[1]?.length > 3
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

    if (isNaN(vehicleNo) || item.vehicleNo.length !== 4 || !/^\d{4}$/.test(item.vehicleNo)) {
      showSnackbar('Vehicle No must be the last 4 digits and contain only numbers.', 'error');
      return false;
    }
    if (isNaN(qtyDumped) || qtyDumped <= 0 || qtyDumped > 100000 || item.qtyDumped.split('.')[1]?.length > 3) {
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

    setTemporaryPrestressingData((prevData:any) => ({
      ...prevData,
      [key]: newValue,
    }));
  };
  const handleInputChangePainting = (key:any, value:any) => {
    setPaintingData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const validatePipeLayingAndJointingData = (pipeLayingAndJointingData: any): boolean => {
    const totalPipeLength = parseFloat(pipeLayingAndJointingData.totalPipeLength);
    const totalNumberOfPipes = parseInt(pipeLayingAndJointingData.totalNumberOfPipes);

    if (isNaN(totalPipeLength) || totalPipeLength <= 0 || totalPipeLength > 1000 || pipeLayingAndJointingData.totalPipeLength.split('.')[1]?.length > 3) {
      showSnackbar('Please enter a valid Total Pipe Length (in meters) with max 3 decimal places, value should be > 0 and <= 1000', 'error');
      return false;
    }

    if (isNaN(totalNumberOfPipes) || totalNumberOfPipes <= 0 || totalNumberOfPipes > 1000) {
      showSnackbar('Please enter a valid Total Number of Pipes laid (integer), value should be > 0 and <= 1000', 'error');
      return false;
    }

    pipeLayingAndJointingData.totalPipeLength = Number(pipeLayingAndJointingData.totalPipeLength);
    pipeLayingAndJointingData.totalNumberOfPipes = Number(pipeLayingAndJointingData.totalNumberOfPipes);

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
            setPipeLayingAndJointingData(rfiData.metaData.pipeLayingAndJointingData);
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
      case TASK_TYPES.COMPACTION:
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
  const handleDropdownChangeDumping = (index: number, fieldName: string, value: any) => {
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
      case TASK_TYPES.COMPACTING_GROUND_SUPPORT_FOR_EMBANKMENT:
      case TASK_TYPES.DEWATERING:
      case TASK_TYPES.PLACING_OF_COVER:
      case TASK_TYPES.COMPACTION:
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
          { title: 'Ensure all material as per GFC drawing', key: 'materialAsPerGFC' },
          { title: 'Check for availability of the latest GFC drawing', key: 'latestGFCAvailable' },
          { title: 'Location, levels, pipe size as per GFC', key: 'locationLevelsPipeSizeAsPerGFC' },
          { title: 'Check routing of pipe as per drawing', key: 'routingCheckedAsPerGFC' },
          { title: 'Check hanger & support spacing as per drawing', key: 'hangerSupportProperSpacing' },
          { title: 'Fastener & hanger rod as per drawing', key: 'fastenerHangerRodAsPerGFC' },
          { title: 'Joint preparation & fit-up proper', key: 'jointPreparationFitUp' },
          { title: 'Visual inspection of welded joints', key: 'visualInspectionOfWeldedJoints' },
          { title: 'Thread check for pipe joints', key: 'threadCheckForJoints' },
          { title: 'Threaded joints properly tightened', key: 'threadedJointsTightened' },
          { title: 'Bituminous paint & polythene tape applied to underground GI piping', key: 'undergroundGIPipingTreatment' },
          { title: 'Threaded pipes aligned and straight', key: 'threadedPipesAlignedStraight' },
          { title: 'Installed pipes aligned properly', key: 'installedPipesAlignedProperly' },
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
            title: 'Distance maintained between barrier and start of embankment slope',
            key: 'barrierToEmbankmentDistance',
          },
          {
            title: 'Distance maintained between barrier and edge of carriageway',
            key: 'barrierToEdgeOfCarriagewayDistance',
          },
          {
            title: 'At median, W-beam face is 100 mm away from carriageway face of median',
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
              <View style={{ flexDirection: 'column' }} key={property.key}>
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
      title: 'Distance Maintained Between Barrier and Start of Embankment Slope',
      key: 'distanceMaintainedBarrierSlope',
    },
    {
      title: 'Distance Maintained Between Barrier and Edge of Carriageway',
      key: 'distanceMaintainedBarrierCarriageway',
    },
    {
      title: 'Posts Aligned Properly & Height Above Ground as per Approved Drawing',
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

export default MyWork;(
