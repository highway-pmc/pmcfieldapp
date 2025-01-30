import { Guid } from "guid-typescript";
import { useState } from "react";
import { useSnackbar } from "../../../../../context/SnackbarContext";
import { Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
export const { myWorks, rfiData, rfiChecklistSaved, loading, error } = useSelector(
    (state: any) => state.MyWorks,
);
// const [myWorksData, setMyWorksData]: any = useState([]);


export const dispatch = useDispatch();

export const { showSnackbar } = useSnackbar();

export const [myWorksData, setMyWorksData]: any = useState([]);

export const [fixingAndInstallationLTPanelData, setFixingAndInstallationLTPanelData]: any = useState([]);
export const [currentSegmentsData, setCurrentSegmentsData]: any = useState([]);
export const [currentComponentsData, setCurrentComponentsData]: any = useState([]);
export const [currentSubComponentsData, setCurrentSubComponentsData]: any = useState(
    [],
);
export const [currentTasksData, setCurrentTasksData]: any = useState([]);
export const [projectModuleId, setProjectModuleId]: any = useState('');
export const [currentLevel, setCurrentLevel]: any = useState(1);
export const [segmentsByGroupOnType, setSegmentsByGroupOnType]: any = useState(null);
export const [searchText, setSearchText]: any = useState('');
export const [rfiId, setRfiId]: any = useState('');
export const [breadcrumbData, setBreadcrumbData]: any = useState([
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

export const imageObjectEmpty = {
    filepath: {
        data: '',
        uri: '',
    },
    fileData: '',
    fileUri: '',
};

export const [rfiDate, setRFIDate] = useState('');
export const [rfiTime, setRFITime] = useState('');
export const [openCalendar, setOpenCalendar] = useState(false);

export const [comments, setComments] = useState('');
export const { width, height } = Dimensions.get('window');

// CNG_AND_SETTING_OUT
// PLACING_OF_SHEATHING_DUCT
// POST_CONCRETE_CHECK
// FIXING_OF_BEARING_SLEEVES
export const [openPopup, setOpenPopup] = useState(false);
export const [selectedTask, setSelectedTask]: any = useState(null);
export const [imageObject, setImageObject]: any = useState(imageObjectEmpty);

// FORM_WORK
// PLACEMENT_OF_INNER_SHUTTERS
// PLACEMENT_OF_SIDE_SHUTTERS
// PLACEMENT_OF_BOTTOM_SHUTTER
// PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER
export const [cleanliness, setCleanliness] = useState('Y');
export const [openCleanliness, setOpenCleanliness] = useState(false);
export const [formworkAlignmentChecked, setFormworkAlignmentChecked] = useState('Y');
export const [openFormworkAlignmentChecked, setOpenFormworkAlignmentChecked] =
    useState(false);
export const [formworkSealingChecked, setFormworkSealingChecked] = useState('Y');
export const [openFormworkSealingChecked, setOpenFormworkSealingChecked] =
    useState(false);
export const [formworkdDrawingsChecked, setFormworkdDrawingsChecked] = useState('Y');
export const [openFormworkdDrawingsChecked, setOpenFormworkdDrawingsChecked] =
    useState(false);
export const [concreteFinishLevelMarked, setConcreteFinishLevelMarked] =
    useState('Y');
export const [openConcreteFinishLevelMarked, setOpenConcreteFinishLevelMarked] =
    useState(false);
export const [formworkProperlySupported, setFormworkProperlySupported] =
    useState('Y');
export const [openFormworkProperlySupported, setOpenFormworkProperlySupported] =
    useState(false);
export const [formworkFitConcreting, setFormworkFitConcreting] = useState('Y');
export const [openFormworkFitConcreting, setOpenFormworkFitConcreting] =
    useState(false);

// REINFORCEMENT
// REINFORCEMENT_PREPARATION
// PLACEMENT_OF_REINFORCEMENT_CAGE **(except spacerBarCheckedGFC)
export const [rebarAndDimensionGFC, setRebarAndDimensionGFC] = useState('Y');
export const [openRebarAndDimensionGFC, setOpenRebarAndDimensionGFC] =
    useState(false);
export const [shapingNoAndLengthOfBarsGFC, setShapingNoAndLengthOfBarsGFC] =
    useState('Y');
export const [openShapingNoAndLengthOfBarsGFC, setOpenShapingNoAndLengthOfBarsGFC] =
    useState(false);
export const [rebarsSecurelyTightened, setRebarsSecurelyTightened] = useState('Y');
export const [openRebarsSecurelyTightened, setOpenRebarsSecurelyTightened] =
    useState(false);
export const [spliceLengthAndLocationGFC, setSpliceLengthAndLocationGFC] =
    useState('Y');
export const [openSpliceLengthAndLocationGFC, setOpenSpliceLengthAndLocationGFC] =
    useState(false);
export const [rebarWithinToleranceLimit, setRebarWithinToleranceLimit] =
    useState('Y');
export const [openRebarWithinToleranceLimit, setOpenRebarWithinToleranceLimit] =
    useState(false);
export const [
    couplerArrangementsWithinTolerance,
    setCouplerArrangementsWithinTolerance,
] = useState('Y');
export const [
    openCouplerArrangementsWithinTolerance,
    setOpenCouplerArrangementsWithinTolerance,
] = useState(false);
export const [barBendingScheduleChecked, setBarBendingScheduleChecked] =
    useState('Y');
export const [openBarBendingScheduleChecked, setOpenBarBendingScheduleChecked] =
    useState(false);
export const [spacerBarCheckedGFC, setSpacerBarCheckedGFC] = useState('Y');
export const [openSpacerBarCheckedGFC, setOpenSpacerBarCheckedGFC] = useState(false);

// EXCAVATION
export const [quantity, setQuantity] = useState(0);

// REMOVAL_OF_SHUTTER
// REMOVAL_OF_SHUTTERS
export const [
    concreteHasAchievedDesiredStrength,
    setConcreteHasAchievedDesiredStrength,
] = useState('Y');
export const [
    openConcreteHasAchievedDesiredStrength,
    setOpenConcreteHasAchievedDesiredStrength,
] = useState(false);
export const [minimumTimeHasBeenAttained, setMinimumTimeHasBeenAttained] =
    useState('Y');
export const [openMinimumTimeHasBeenAttained, setOpenMinimumTimeHasBeenAttained] =
    useState(false);

// THREADING_OF_PRE_STRESSING_STRANDS
// only comments

// CAGE_LOWERING
export const [plieShaftCleanedLooseMaterial, setPlieShaftCleanedLooseMaterial] =
    useState('Y');
export const [
    openPlieShaftCleanedLooseMaterial,
    setOpenPlieShaftCleanedLooseMaterial,
] = useState(false);
export const [
    suitableSpacerProvidedToMaintainCoverToSteel,
    setSuitableSpacerProvidedToMaintainCoverToSteel,
] = useState('Y');
export const [
    openSuitableSpacerProvidedToMaintainCoverToSteel,
    setOpenSuitableSpacerProvidedToMaintainCoverToSteel,
] = useState(false);
export const [noLBendBottomOfTheCageChecked, setNoLBendBottomOfTheCageChecked]: any =
    useState('Y');
export const [
    openNoLBendBottomOfTheCageChecked,
    setOpenNoLBendBottomOfTheCageChecked,
]: any = useState(false);

// CONCRETE
export const [concreteData, setConcreteData]: any = useState([
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
export const [glueingData, setGlueingData]: any = useState([
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
export const [boringOfPileData, setBoringOfPileData]: any =
    useState<FormStateBoringOfPile>({
        densityOfPolymer: 0,
        viscosityOfPolymer: 0,
        valueOfPolymer: 0,
        contentOfPolymer: 0,
        depthOfBore: 0,
    });
export const [erectionUsingCranesData, setErectionUsingCranesData]: any = useState({
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
export const [fixingOfBearingData, setFixingOfBearingData]: any = useState({
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
export const handleInputChangeAutoLaunching = (key: any, value: any) => {
    setAutoLaunchingData(prevState => ({
        ...prevState,
        [key]: value,
    }));
};

export const handleInputChangeInstallationOfExpansionJoint = (key: any, value: any) => {
    setInstallationOfExpansionJointData(prevState => ({
        ...prevState,
        [key]: value,
    }));
};

export const handleInputChangeRemovalOfTemporaryStructure = (key: any, value: any) => {
    setRemovalOfTemporaryStructureData(prevState => ({
        ...prevState,
        [key]: value,
    }));
};

export const handleInputChangeDeStressingOfGirder = (key: string, value: string) => {
    setDeStressingOfGirderData(prevState => ({
        ...prevState,
        [key]: value,
    }));
};

export const handleInputChangeHackingOfGirder = (key: string, value: string) => {
    setHackingOfGirderData(prevState => ({
        ...prevState,
        [key]: value,
    }));
};

export const handleInputChangeErectionUsingCranes = (
    field: string,
    value: string,
) => {
    setErectionUsingCranesData(prevData => ({
        ...prevData,
        [field]: value,
    }));
};
export const handleInputChangeBoringOfPile = (
    name: keyof FormStateBoringOfPile,
    value: string | number | [],
) => {
    setBoringOfPileData({ ...boringOfPileData, [name]: Number(value) });
};
export const handleInputChangeAssemblingOfTruss = (field: any, value: any) => {
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
export const [flushingOperationsData, setFlushingOperationsData] =
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

export const handleInputChangeFlushingOperations = (
    name: keyof FormStateFlushingOperations,
    value: string | number | [],
) => {
    if (
        name === 'startTimeOfFlushing' ||
        name === 'finishTimeOfFlushing' ||
        name === 'whetherPourCleared'
    ) {
        setFlushingOperationsData({ ...flushingOperationsData, [name]: value });
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
export const [
    chippingAndRemovalOfConcreteData,
    setChippingAndRemovalOfConcreteData,
] = useState<FormStateChippingAndRemovalOfConcrete>({
    noOfDaysOfChipping: 0,
});

export const handleInputChangeChippingAndRemovalOfConcrete = (
    name: keyof FormStateChippingAndRemovalOfConcrete,
    value: string | number | [],
) => {
    setChippingAndRemovalOfConcreteData({
        ...chippingAndRemovalOfConcreteData,
        [name]: Number(value),
    });
};
export const [dumpingData, setDumpingData] = useState([
    {
        vehicleNo: '', // last 4 digits, number
        source: 'Y',
        qtyDumped: 0,
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
export const [castingOfBallastData, setCastingOfBallastData]: any = useState({
    drawingsApproved: 'Y',
    mouldsReady: 'Y',
    reinforcementTiedProperly: 'Y',
    totalReinforcementWeightKg: 0.0,
});
export const [ballastData, setBallastData]: any = useState([
    {
        gradeOfConcrete: '',
        slumpValue: 0,
        concreteStartTime: '',
        concretePoured: 0,
        concreteFinishTime: '',
        totalBallastCasted: 0,
        key: Guid.create(),
    },
]);

export const [foundationData, setFoundationData]: any = useState([
    {
        gradeOfConcrete: '',
        slumpValue: 0,
        concreteStartTime: '',
        concretePoured: 0,
        concreteFinishTime: '',
        totalFoundationCasted: 0,
        key: Guid.create(),
    },
]);
export const [constructionOfFoundationData, setConstructionOfFoundationData]: any =
    useState({
        drawingsApproved: 'Y',
        pitExcavatedAtApprovedLocation: 'Y',
        pitsExcavatedAsPerDrawings: 'Y',
        reinforcementPlacedProperly: 'Y',
        formworkCheckedProperly: 'Y',
        totalWeightReinforcementKg: 0.0,
    });

export const [
    installationOfNetworkDevicesData,
    setInstallationOfNetworkDevicesData,
]: any = useState({
    drawingsApproved: 'Y',
    devicesInspected: 'Y',
    damageReported: 'Y',
    methodologyApproved: 'Y',
    safetyArrangementsInPlace: 'Y',
    machineryAndManpowerAvailable: 'Y',
    installationCompleted: 'Y',
    instructionsComplied: 'Y',
    devicesInstalled: 0,
});

export const [installationOfSolarSystemData, setInstallationOfSolarSystemData]: any =
    useState({
        drawingsApproved: 'Y',
        equipmentInspectedAtFactory: 'Y',
        damageReportedToVendor: 'Y',
        factoryInspectionAndDispatchClearance: 'Y',
        installationMethodologyApproved: 'Y',
        safetyArrangementsInPlace: 'Y',
        machineryAndManpowerAvailable: 'Y',
        installationCompleted: 'Y',
        manufacturerInstructionsComplied: 'Y',
        totalSolarSystemsInstalled: 0,
    });

export const [installationOfEquipmentData, setInstallationOfEquipmentData]: any =
    useState({
        drawingsApproved: 'Y',
        equipmentInspected: 'Y',
        damageReportedToVendor: 'Y',
        factoryInspectionCleared: 'Y',
        foundationWorkReady: 'Y',
        foundationStrengthAchieved: 'Y',
        installationMethodologyApproved: 'Y',
        safetyArrangementsInPlace: 'Y',
        sufficientMachineryManpower: 'Y',
        installationCompletedAsPlanned: 'Y',
        manufacturerInstructionsComplied: 'Y',
        totalEquipmentInstalled: 0,
    });

export const [constructionOfChamberData, setConstructionOfChamberData]: any = useState({
    drawingsAvailable: 'Y',
    sizeClassOfBricksApproved: 'Y',
    requiredBlocksAvailable: 'Y',
    hackingDone: 'Y',
    cementSlurryCured: 'Y',
    aluminiumTemplatesUsed: 'Y',
    requiredToolsAvailable: 'Y',
    specificClientRequirements: 'Y',
    cementApprovedAndFresh: 'Y',
    sandGrittyAndSiltFree: 'Y',
    floorLevelMarked: 'Y',
    referenceLinesMarked: 'Y',
    brickworkChecked: 'Y',
    totalBrickworkAreaSqm: 0.0,
    totalBrickworkVolumeCum: 0.0,
});
export const [hddCrossingData, setHddCrossingData]: any = useState({
    drawingsApproved: 'Y',
    safetyArrangementsInPlace: 'Y',
    layoutMarkedAtSite: 'Y',
    routeMarkingDeviceAvailable: 'Y',
    depthAlignmentAsPerDrawings: 'Y',
    excavatedAreaCoveredProperly: 'Y',
    ductPipePulledSuccessfully: 'Y',
    totalLengthOfHddCrossing: 0.0,
});

export const [layingOfDuctData, setLayingOfDuctData]: any = useState({
    drawingsApproved: 'Y',
    safetyArrangementsInPlace: 'Y',
    sourceMaterialObtained: 'Y',
    materialNotDamaged: 'Y',
    ductsLaidProperly: 'Y',
    jointsCompletedProperly: 'Y',
    totalLengthOfDuctLaid: 0.0,
});

export const [excavationOfTrenchData, setExcavationOfTrenchData]: any = useState({
    drawingsApproved: 'Y',
    safetyArrangementsInPlace: 'Y',
    layoutMarked: 'Y',
    noUtilityInAlignment: 'Y',
    depthWidthAsPerDrawing: 'Y',
    areaCoveredProperly: 'Y',
    totalLengthExcavated: 0.0,
    totalQtyEarthExcavated: 0.0,
});

export const [flooringWorkData, setFlooringWorkData]: any = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceivedAsPerSpecs: 'Y',
    siteReadyForFlooring: 'Y',
    finishingWorkProper: 'Y',
    slopeCheckedAsRequired: 'Y',
    workCompletedToSatisfaction: 'Y',
    totalSqftAreaCompleted: 0.0,
});

export const [plumbingWorkData, setPlumbingWorkData]: any = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceived: 'Y',
    siteReady: 'Y',
    safetyArrangementsInPlace: 'Y',
    inputOutputPointsGiven: 'Y',
    workCompletedSatisfactorily: 'Y',
    workTestedProperly: 'Y',
    approvedLayoutInBuilding: 'Y',
    totalSqftAreaCompleted: 0.0,
});

export const [electricalWorkData, setElectricalWorkData]: any = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceived: 'Y',
    siteReadyForWork: 'Y',
    safetyArrangementsInPlace: 'Y',
    inputOutputPointsCorrect: 'Y',
    workCompletedSatisfactorily: 'Y',
    workTestedAndCertified: 'Y',
    layoutDrawingsPlacedForReference: 'Y',
    totalSqftCompleted: 0.0,
});

export const [glassWorksData, setGlassWorksData]: any = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceivedAsPerSpecs: 'Y',
    glassQualityAndThicknessApproved: 'Y',
    siteReadyForGlassWork: 'Y',
    finishingWorkProper: 'Y',
    workCompletedToSiteInChargeSatisfaction: 'Y',
    totalGlassWorkCompletedSqft: 0.0,
});

export const [windowWorksData, setWindowWorksData]: any = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceivedAsPerSpecs: 'Y',
    siteReadyForWindowWork: 'Y',
    finishingWorkProper: 'Y',
    workCompletedToSatisfaction: 'Y',
});

export const [doorWorksData, setDoorWorksData]: any = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceivedAsPerSpec: 'Y',
    siteReadyForDoorWork: 'Y',
    finishingWorkProper: 'Y',
    workSatisfactionAchieved: 'Y',
});

export const [furnitureWorkData, setFurnitureWorkData]: any = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceivedAsPerSpecs: 'Y',
    siteReadyForFurnitureWork: 'Y',
    finishingFurnitureProper: 'Y',
    workSatisfactoryToSiteInCharge: 'Y',
});

export const [ceilingWorkData, setCeilingWorkData]: any = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    materialReceivedAsPerSpecifications: 'Y',
    siteReadyForCeilingWork: 'Y',
    finishingWorkUniform: 'Y',
    ceilingWorkCompletedToSatisfaction: 'Y',
    totalSqftAreaCompleted: 0.0,
});

export const [hvacWorkData, setHvacWorkData]: any = useState({
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

export const [puttyData, setPuttyData]: any = useState({
    drawingsApproved: 'Y',
    materialSourceApproved: 'Y',
    surfaceDriedReadyForPutty: 'Y',
    thicknessAsPerDrawing: 'Y',
    surfaceFinishUniform: 'Y',
    totalPuttyWorkSqft: 0.0,
});

export const [plasteringData, setPlasteringData]: any = useState({
    drawingsApproved: 'Y',
    cementSourceApproved: 'Y',
    otherMaterialsSourceApproved: 'Y',
    proportionsAsPerSpecs: 'Y',
    thicknessAsPerDrawings: 'Y',
    surfaceFinishProper: 'Y',
    totalPlasteringWorkSqft: 0.0,
});

export const [fixingOfStoneData, setFixingOfStoneData]: any = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeSizeApproved: 'Y',
    stonesFixedProperly: 'Y',
    projectDetailsCorrect: 'Y',
    itemsCleanedVisible: 'Y',
    totalStonesInstalled: 0,
    totalLengthCoveredKm: 0.0,
});

export const [layingOfLTCableData, setLayingOfLTCableData]: any = useState({
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

export const [layingOfFlexibleCableData, setLayingOfFlexibleCableData]: any = useState({
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

export const [installationOfLEDLightsData, setInstallationOfLEDLightsData]: any =
    useState({
        drawingsApproved: 'Y',
        sourceApproved: 'Y',
        factoryInspectionDone: 'Y',
        lightsTestedBeforeInstallation: 'Y',
        lightsInstalledProperly: 'Y',
        totalQtyOfLightsInstalled: 0,
        totalLengthOfHighwayCoveredKm: 0.0,
    });
export const [fixingOfArmsData, setFixingOfArmsData]: any = useState({
    drawingsApproved: 'Y',
    sourceApproved: 'Y',
    factoryInspectionDone: 'Y',
    armsFixedProperly: 'Y',
    nutsBoltsTightened: 'Y',
    totalQtyArmsErected: 0,
    totalHighwayLengthCoveredKm: 0.0,
});
export const [erectionOfPolesData, setErectionOfPolesData]: any = useState({
    drawingsApproved: 'Y',
    sourceApproved: 'Y',
    factoryInspectionDone: 'Y',
    foundationsReady: 'Y',
    polesAlignedProperly: 'Y',
    nutBoltsTightened: 'Y',
    totalPolesErected: 0,
    totalHighwayLengthCovered: 0.0,
});

export const [fixingOfAntiglaresData, setFixingOfAntiglaresData]: any = useState({
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
export const [fixingOfConvexMirrorsData, setFixingOfConvexMirrorsData]: any = useState({
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
export const [
    fixingOfFlexibleMedianMarkersData,
    setFixingOfFlexibleMedianMarkersData,
]: any = useState({
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
export const [fixingOfHazardMarkersData, setFixingOfHazardMarkersData]: any = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeSizeApproved: 'Y',
    markersFixedProperly: 'Y',
    lineLevelsChecked: 'Y',
    itemsCleanedVisible: 'Y',
    totalMarkersInstalled: 0,
    totalLengthCoveredKm: 0.0,
});
export const [fixingOfLEDTrafficBlinkersData, setFixingOfLEDTrafficBlinkersData]: any =
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
export const [fixingOfNoiseBarrierData, setFixingOfNoiseBarrierData]: any = useState({
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
export const [fixingOfObjectMarkersData, setFixingOfObjectMarkersData]: any = useState({
    sourceMaterialApproved: 'Y',
    drawingApproved: 'Y',
    shapeSizeApproved: 'Y',
    markersFixedProperly: 'Y',
    lineLevelsChecked: 'Y',
    itemsCleanedVisible: 'Y',
    totalMarkersInstalled: 0,
    totalLengthCoveredKm: 0.0,
});
export const [fixingOfRoadDelineatorsData, setFixingOfRoadDelineatorsData]: any =
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
export const [fixingOfRoadStudsData, setFixingOfRoadStudsData]: any = useState({
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
export const [fixingOfSolarBlinkersData, setFixingOfSolarBlinkersData]: any = useState({
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
export const [fixingOfSolarRoadStudsData, setFixingOfSolarRoadStudsData]: any = useState({
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
export const [fixingOfSpringPostData, setFixingOfSpringPostData]: any = useState({
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
export const [trafficImpactAttenuatorsData, setTrafficImpactAttenuatorsData]: any =
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
export const [placementOfSignageSheetData, setPlacementOfSignageSheetData]: any =
    useState({
        materialSourceApproved: 'Y',
        drawingsApproved: 'Y',
        letterSizeAsPerDrawing: 'Y',
        rivetedProperlyInFrame: 'Y',
        placedAsPerDrawing: 'Y',
        totalSheetFixed: 0.0,
        totalRoadLengthCovered: 0.0,
    });
export const [backfillData, setBackfillData]: any = useState({
    areaClearOfDebris: 'Y',
    fillMaterialsApproved: 'Y',
    noDamageToCables: 'Y',
    backfillingComplete: 'Y',
    totalQtySoilUsed: 0.0,
    totalLengthTrenchBackfilled: 0.0,
});
export const [signageLocationData, setSignageLocationData]: any = useState({
    drawingApproved: 'Y',
    locationMarked: 'Y',
    locationCheckedByEngineer: 'Y',
    noHindranceInInstallation: 'Y',
});
export const [flooringData, setFlooringData]: any = useState({
    flooringMaterialSourceApproved: 'Y',
    tilesCrackFree: 'Y',
    cracksHolesUnevenSurface: 'Y',
    jointsAtTransitionSmooth: 'Y',
    flooringDoneAtRamps: 'Y',
    totalSurfaceArea: 0.0,
    totalTilesUsed: 0,
});
export const [mortarChecklistData, setMortarChecklistData]: any = useState({
    mortarMixUniform: 'Y',
    sufficientMortarQuantity: 'Y',
    blockAlignmentPlumb: 'Y',
    jointsStaggered: 'Y',
    mortarBetweenBlockAndColumn: 'Y',
    totalCementBagsConsumed: 0,
    totalSurfaceAreaToBePlastered: 0.0,
    totalMortarUsed: 0.0,
});
export const [placingChainLinkData, setPlacingChainLinkData]: any = useState({
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
export const [preCastRccPanelData, setPreCastRccPanelData]: any = useState({
    drawingApproved: 'Y',
    panelsFromApprovedSource: 'Y',
    damagedPanelFound: 'Y',
    alignmentPlumbFixingSupport: 'Y',
    totalPanelsInstalled: 0,
    totalAreaInstalled: 0.0,
});
export const [erectionOfAngleSectionData, setErectionOfAngleSectionData]: any = useState({
    anglesFromApprovedSource: 'Y',
    materialInspectionClearance: 'Y',
    materialDamagedInformed: 'Y',
    erectionAsPerDrawing: 'Y',
    alignmentSupportOk: 'Y',
    totalAnglesErected: 0,
});
export const [erectionOfBusShelterData, setErectionOfBusShelterData]: any = useState({
    materialSourceApproved: 'Y',
    drawingsApproved: 'Y',
    supportingSurfaceChecked: 'Y',
    safetyArrangementsInPlace: 'Y',
    totalPanelsInstalled: 0,
    totalBusStandsCompleted: 0,
});
export const [erectionPreCastColumnData, setErectionPreCastColumnData]: any = useState({
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
export const [fixingOfPanelsData, setFixingOfPanelsData]: any = useState({
    drawingApproved: 'Y',
    materialSourceApproved: 'Y',
    panelShapeSizeAsDrawing: 'Y',
    boltsAligned: 'Y',
    panelsFixedInLine: 'Y',
    boltsFullyTorqued: 'Y',
    totalPanelsInstalled: 0,
    totalBusShelterCompleted: 0,
});
export const [fabricationOfStructureData, setFabricationOfStructureData]: any = useState({
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
export const [erectionOfStructureData, setErectionOfStructureData]: any = useState({
    positionChecked: 'Y',
    weldingDoneAsPerDrawing: 'Y',
    structureAsPerDrawing: 'Y',
    necessarySupportProvided: 'Y',
});
export const [htPanelInstallationData, setHtPanelInstallationData]: any = useState({
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
export const [fixingAndInstallationData, setFixingAndInstallationData]: any = useState({
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
export const [cableTrenchExcavationData, setCableTrenchExcavationData]: any = useState({
    safetyMeasuresTaken: 'Y',
    drawingsApproved: 'Y',
    alignmentMarked: 'Y',
    utilitiesShifted: 'Y',
    excavationDepthWidth: 'Y',
    totalSoilQtyExcavated: 0.0,
    totalTrenchExcavated: 0.0,
});
export const [conduitLayingData, setConduitLayingData]: any = useState({
    drawingsApproved: 'Y',
    conduitSizeShapeAsPerSpecs: 'Y',
    materialSourceApproved: 'Y',
    conduitPipeLaidProperly: 'Y',
    jointingDoneProperly: 'Y',
    totalConduitLength: 0.0,
});
export const [cableTrenchDressingData, setCableTrenchDressingData]: any = useState({
    safetyMeasuresTaken: 'Y',
    manpowerAvailable: 'Y',
    lineLevelsChecked: 'Y',
    trenchClearedUndesirableMaterial: 'Y',
    trenchCompacted: 'Y',
    totalTrenchDressed: 0.0,
});
export const [cableDressingData, setCableDressingData]: any = useState({
    cablesTiedProperly: 'Y',
    noCableDamaged: 'Y',
});
export const [bricksLayeringData, setBricksLayeringData]: any = useState({
    drawingsApproved: 'Y',
    bricksSizeClassApproved: 'Y',
    totalAreaCompleted: 0.0,
    totalBricksLaid: 0,
    totalLengthTrenchCompleted: 0.0,
});
export const [routeMarkingData, setRouteMarkingData]: any = useState({
    drawingsApproved: 'Y',
    markersSizeShapeAsPerApproved: 'Y',
    materialSourceApproved: 'Y',
    layoutMarkedAtSite: 'Y',
    routeMarkersFixedProperly: 'Y',
    spacingAsPerSpecifications: 'Y',
    totalRouteMarkersInstalled: 0,
    totalLengthCoveredRM: 0.0,
});

export const [layingCautionTapeData, setLayingCautionTapeData]: any = useState({
    drawingsApproved: 'Y',
    sizeShapeThicknessAsPerDrawings: 'Y',
    sourceMaterialApproved: 'Y',
    cautionTapeLaidProperly: 'Y',
    cautionTapeLaidAtDesiredDepth: 'Y',
    totalCautionTapeLength: 0.0,
});

export const [fixingOfModulesData, setFixingOfModulesData]: any = useState({
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

export const [fixingOfMMSData, setFixingOfMMSData]: any = useState({
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

export const [fixingOfMC4Data, setFixingOfMC4Data]: any = useState({
    cablesConnected: 'Y',
    connectionsChecked: 'Y',
    totalYConnectorsUsed: 0,
});

export const [
    erectionOfDoublePoleStructureData,
    setErectionOfDoublePoleStructureData,
]: any = useState({
    drawingsApproved: 'Y',
    doublePoleReadyForErection: 'Y',
    foundationWorkCompleted: 'Y',
    concreteStrengthAchieved: 'Y',
    installationMethodologyApproved: 'Y',
    safetyArrangementsInPlace: 'Y',
    machineryAndManpowerAvailable: 'Y',
    erectionCompleted: 'Y',
    totalDoublePolesErected: 0,
});


export const [inverterInstallationData, setInverterInstallationData]: any = useState({
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

export const [stonePitchingData, setStonePitchingData]: any = useState({
    constructionDocsApproved: 'Y',
    workOfOtherTradesCompleted: 'Y',
    layerCompacted: 'Y',
    stoneShapeAndSizeAsPerSpec: 'Y',
    mortarReady: 'Y',
    mortarBondingDone: 'Y',
    totalSurfaceArea: 0.0,
    totalMaterialLaid: 0.0,
});

export const [plantationData, setPlantationData]: any = useState({
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

export const [wateringData, setWateringData]: any = useState({
    waterClean: 'Y',
    wateringThreeTimesADay: 'Y',
    totalQtyWaterUsed: 0.0,
});

export const [spreadingOfGrassSeedsData, setSpreadingOfGrassSeedsData]: any = useState({
    seedApprovedSource: 'Y',
    surfaceFreeFromGarbage: 'Y',
    surfaceWellPrepared: 'Y',
});

export const [preparationOfSoilData, setPreparationOfSoilData]: any = useState({
    soilDumpedInLayer: 'Y',
    soilSpreadProperLength: 'Y',
    soilCompactedProperly: 'Y',
    totalQtySoil: 0.0,
    totalSurfaceArea: 0.0,
});

export const [plantingTreesData, setPlantingTreesData]: any = useState({
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

export const [plantingGrassData, setPlantingGrassData]: any = useState({
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
export const [pitExcavationData, setPitExcavationData]: any = useState({
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
export const [chuteMembersData, setChuteMembersData]: any = useState({
    bottomSoilCompacted: 'Y',
    slopeMaintained: 'Y',
    chuteLiningDone: 'Y',
    supportForShutteringDone: 'Y',
    jointInLineAndLevel: 'Y',
    concretePlacingArrangement: 'Y',
    totalChuteLength: 0.0,
});
export const [layingOfTopSoilData, setLayingOfTopSoilData]: any = useState({
    approvedSource: 'Y',
    vehicleMovementArrangement: 'Y',
    machineryAvailable: 'Y',
    markingDone: 'Y',
    totalAreaLaying: 0.0,
    totalQtyOfSoil: 0.0,
});

export const [layingOfGrassTurfData, setLayingOfGrassTurfData]: any = useState({
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

export const [fixingOfMeshData, setFixingOfMeshData]: any = useState({
    sourceApproved: 'Y',
    sizeAsPerDrawing: 'Y',
    wireMeshDamageChecked: 'Y',
    unitStretchedForFoldsRemoved: 'Y',
    totalAreaSlope: 0.0,
    totalQtyMesh: 0.0,
});

export const [fixingGeoCellData, setFixingGeoCellData]: any = useState({
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
export const [cuttingOfSoilData, setCuttingOfSoilData]: any = useState({
    safetyMeasuresTaken: 'Y',
    equipmentAvailable: 'Y',
    excavationDone: 'Y',
    totalSoilCutQty: 0.0,
});
export const [bricksWorkData, setBricksWorkData]: any = useState({
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

export const [backfillingData, setBackfillingData]: any = useState({
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
export const [sandLayerData, setSandLayerData]: any = useState({
    drawingsApproved: 'Y',
    safetyArrangementsInPlace: 'Y',
    sourceOfSandApproved: 'Y',
    thicknessAsPerDrawings: 'Y',
    excavatedAreaCovered: 'Y',
    totalLengthTrenchCovered: 0.0,
    totalQtySandFilled: 0.0,
});

export const [layingOfPQCData, setLayingOfPQCData]: any = useState({
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

export const [layingOfSeparationMembraneData, setLayingOfSeparationMembraneData]: any =
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

export const [millingData, setMillingData]: any = useState({
    milledSurfaceUniform: 'Y',
    finishedSurfaceWithinTolerance: 'Y',
    textureSafeForMotorist: 'Y',
    depthOfMilling: 0.0,
    totalQtyMilledMaterial: 0.0,
    totalSurfaceAreaMilled: 0.0,
});

export const [sealantFilingData, setSealantFilingData]: any = useState({
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

export const [placingOfFillerBoardData, setPlacingOfFillerBoardData]: any = useState({
    sourceApproved: 'Y',
    surfaceFreeFromDust: 'Y',
    fillerBoardCutProperly: 'Y',
    fillerBoardPlacedProperly: 'Y',
    fillerBoardCompressed: 'Y',
    fillerBoardThickness: 0.0,
    totalFillerBoardQty: 0.0,
});

export const [compactionData, setCompactionData]: any = useState({
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

export const [placingOfDowelData, setPlacingOfDowelData]: any = useState({
    pqcDrawingApproved: 'Y',
    dowelBarsPlacedProperDepth: 'Y',
    barsAlignedProperly: 'Y',
    dowelBarCoveredWithPlasticSheath: 'Y',
    sheathDia: 0.0,
    sheathMouthClosed: 'Y',
    dowelBarLengthAsPerDrawing: 'Y',
    totalDowelBars: 0,
});

export const [texturingData, setTexturingData]: any = useState({
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

export const [fixingOfWireRopeData, setFixingOfWireRopeData]: any = useState({
    strandsFromApprovedSource: 'Y',
    endAttachmentsCondition: 'Y',
    heatDamageEvidence: 'Y',
    ropeDamageRectification: 'Y',
    alignedProperlyAsPerDrawing: 'Y',
    strandTensionedAtEnds: 'Y',
});

export const [placingOfTieBarData, setPlacingOfTieBarData]: any = useState({
    drawingApproved: 'Y',
    placingDoneAsPerDrawings: 'Y',
    alignmentDoneProperly: 'Y',
    nonConformanceFound: 'Y',
});

export const [machineCuttingData, setMachineCuttingData]: any = useState({
    cuttingSawsAvailable: 'Y',
    diamondSawBladesAvailable: 'Y',
    waterTankAvailable: 'Y',
    machineCutStartTimeCorrect: 'Y',
    cuttingAsPerApprovedDrawing: 'Y',
});

export const [layingOfDlcTableData, setLayingOfDlcTableData]: any = useState([
    {
        vehicleNo: '',
        totalQtyDlc: 0,
        layingStartTime: '',
        layingEndTime: '',
        key: Guid.create(),
    },
]);
export const [layingOfDLCData, setLayingOfDLCData]: any = useState({
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

export const [layingOfPaverBlockData, setLayingOfPaverBlockData]: any = useState({
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

export const [cuttingOfJointsData, setCuttingOfJointsData]: any = useState({
    jointsCutAtDesiredIntervals: 'Y',
    jointsCutAtDesiredDepth: 'Y',
    jointCutDoneProperly: 'Y',
    totalLengthCompleted: 0.0,
});

export const [fixingVerticalPostData, setFixingVerticalPostData]: any = useState({
    pitsDuggedToPlan: 'Y',
    distanceMaintainedBarrierSlope: 'Y',
    distanceMaintainedBarrierCarriageway: 'Y',
    postsAlignedHeightAsPerDrawing: 'Y',
    steelPostsPlacedMethodology: 'Y',
    totalVerticalPostInstalled: 0,
});

export const [fixingOfMetalBeamData, setFixingOfMetalBeamData]: any = useState({
    barrierToEmbankmentDistance: 'Y',
    barrierToEdgeOfCarriagewayDistance: 'Y',
    medianWBeamFaceDistance: 'Y',
    spacersInstalledProperly: 'Y',
    boltsFixedAndTightened: 'Y',
    totalLengthOfMetalBeamFixed: 0.0,
});

export const [pipeLayingAndJointingData, setPipeLayingAndJointingData]: any = useState({
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

export const [layingAndCompactionData, setLayingAndCompactionData]: any = useState({
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

export const [roadMarkingData, setRoadMarkingData]: any = useState({
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
export const [primeCoatData, setPrimeCoatData]: any = useState({
    previousLayerApproved: 'Y',
    surfacePreparationSatisfactory: 'Y',
    materialGradeApproved: 'Y',
    bituminousEmulsionTemperatureChecked: 'Y',
    uniformSprayRate: 'Y',
    nonConformanceFound: 'N',
});

export const [spreadingAndCompactionData, setSpreadingAndCompactionData]: any = useState({
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

export const [strippingAndStoringTopSoilData, setStrippingAndStoringTopSoilData] =
    useState({
        topSoilCollectedStored: 0, // Default value for top soil collected (cum)
    });

export const [erectionData, setErectionData]: any = useState({
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

export const [boringOfDiaphragmData, setBoringOfDiaphragmData] = useState({
    densityOfPolymer: 0.0,
    viscosityOfPolymer: 0,
    pHValueOfPolymer: 0,
    sandContentOfPolymer: 0,
    depthOfWall: 0.0,
});

export const [dumpingOfSoilData, setDumpingOfSoilData] = useState({
    soilApprovedSource: 'Y',
    soilWithoutUnwantedMaterials: 'Y',
    quantityOfSoilDumped: '0.0',
});
export const [procurementOfSheetData, setProcurementOfSheetData] = useState({
    totalSheetPurchased: 0,
});
export const [fixingOfBracingsData, setFixingOfBracingsData]: any = useState({
    lineLevelsChecked: 'Y',
    weldingAsPerApprovedDrawing: 'Y',
    bracingsAsPerApprovedDrawing: 'Y',
});
export const [fixingOfRailingData, setFixingOfRailingData]: any = useState({
    lineLevelsChecked: 'Y',
    railingAsPerApprovedDrawing: 'Y',
});
export const [applicationOfFilterMediaData, setApplicationOfFilterMediaData] =
    useState({
        filterMediaAsPerDrawing: 'Y',
    });

export const [erectionOfColumnsData, setErectionOfColumnsData]: any = useState({
    positionChecked: 'Y',
    weldingAsPerDrawing: 'Y',
    columnsAsPerDrawing: 'Y',
    supportProvided: 'Y',
});

export const [erectionOfFaciaPanelsData, setErectionOfFaciaPanelsData]: any = useState({
    sufficientStrength: 'Y',
    notDamaged: 'Y',
    lineLevelsChecked: 'Y',
    maleFemaleJointsChecked: 'Y',
    verticalSlopeAsPerDrawing: 'Y',
    soilCompactedAndGeoGridsFixed: 'Y',
});

export const [erectionOfFrictionSlabData, setErectionOfFrictionSlabData]: any = useState({
    sufficientStrength: 'Y',
    notDamaged: 'Y',
    lineLevelsChecked: 'Y',
    verticalSlopeAsPerDrawing: 'Y',
    soilCompactedAndGeoGridsFixed: 'Y',
    copingDone: 'Y',
});

export const [fixingOfGeoGridData, setFixingOfGeoGridData]: any = useState({
    materialApprovedByEngineer: 'Y',
    specificationsAsPerApprovedDrawing: 'Y',
    soilProperlyCompacted: 'Y',
    geoGridsAnchoredIntoFaciaPanels: 'Y',
    geoGridsTensionedAndNailed: 'Y',
    minimumLengthAsPerApprovedDrawing: 'Y',
});

export const [groutingData, setGroutingData] = useState<FormStateGrouting>({
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
export const [liftingSegmentData, setLiftingSegmentData] = useState({
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
export const [liftingCombinedLRData, setLiftingCombinedLRData] = useState({
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
export const [removalFormworkData, setRemovalFormworkData] = useState({
    concreteStrengthAchieved: 'Y',
    minimumTimeAttained: 'Y',
});
export const [fabricationData, setFabricationData] = useState({
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

export const [prestressingData, setPrestressingData]: any = useState([
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
export const [temporaryPrestressingData, setTemporaryPrestressingData]: any =
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

export const onAddMoreTemporaryPrestressing = () => {
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

export const [curingData, setCuringData]: any = useState({
    waterUsedForCuring: 'Y',
    phValueOfWater: 'Y',
    consumptionOfWater: 0,
});

export const handleCuring = (field: string, value: string) => {
    setCuringData(prevData => ({
        ...prevData,
        [field]: value,
    }));
};
export const handleInputChangeFixingOfBearing = (key: any, value: any) => {
    setFixingOfBearingData(prevState => ({
        ...prevState,
        [key]: value,
    }));
};

export const handleInputChangeFabrication = (key: string, value: string) => {
    setFabricationData(prevState => ({
        ...prevState,
        [key]: value,
    }));
};
export const handleTextInputChangeDumping = (
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
export const onAddMoreLayingOfDlc = () => {
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
export const onAddComstructionOfFoundation = () => {
    setFoundationData([
        ...foundationData,
        {
            gradeOfConcrete: '',
            slumpValue: 0,
            concreteStartTime: '',
            concretePoured: 0,
            concreteFinishTime: '',
            totalFoundationCasted: 0,
            key: Guid.create(),
        },
    ]);
};

export const [torquingData, setTorquingData] = useState([
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
export const handleTextInputChangeTransportation = (key: any, value: any) => {
    setTransportationData({
        ...transportationData,
        [key]: value,
    });
};
export const [stitchConcreteData, setStitchConcreteData] = useState({
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

export const [fixingOfSheathingJointsData, setFixingOfSheathingJointsData] =
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

export const [
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
export const [autoLaunchingData, setAutoLaunchingData] = useState({
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

export const [stackingInYardData, setStackingInYardData]: any = useState({
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
export const [hackingOfGirderData, setHackingOfGirderData] = useState({
    methodologyApproved: 'Y',
    surfaceCleanedAndWet: 'Y',
    skilledPersonnel: 'Y',
    sharpenedInstruments: 'Y',
    recessCutFormation: 'Y',
});
export const [deStressingOfGirderData, setDeStressingOfGirderData] = useState({
    strengthAchieved: 'Y',
    diamondBitSawUsed: 'Y',
    gradualUniformTransfer: 'Y',
});
export const [
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

export const [removalOfTemporaryStructureData, setRemovalOfTemporaryStructureData] =
    useState({
        concreteAchievedStrength: 'Y',
        minimumTimeAttained: 'Y',
        allComponentsTightened: 'Y',
    });

export const handleTransportationOfSteelGirdersDiaphragms = (
    field: string,
    value: string,
) => {
    setTransportationOfSteelGirdersDiaphragms(prevData => ({
        ...prevData,
        [field]: value,
    }));
};

export const handleInputChangeLifting = (field: string, value: string) => {
    setLiftingCombinedLRData(prevData => ({
        ...prevData,
        [field]: value,
    }));
};
export const handleInputChangeStackingInYard = (field: string, value: string) => {
    setStackingInYardData(prevState => ({
        ...prevState,
        [field]: value,
    }));
};

export const handleInputChangeTemporaryPrestressing = (key: string, value: any) => {
    let newValue = value;

    if (key === 'maxJackPressure' || key === 'jackPressureApplied') {
        newValue = parseFloat(value);

        if (isNaN(newValue) || newValue <= 0 || newValue > 1000) {
            showSnackbar(
                `${key === 'maxJackPressure'
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
export const handleInputChangePainting = (key: any, value: any) => {
    setPaintingData(prevState => ({
        ...prevState,
        [key]: value,
    }));
};

export const validatePipeLayingAndJointingData = (
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

export const handleInputChangeGrouting = (
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
    setGroutingData({ ...groutingData, [name]: value });
};

export const [
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
export const [paintingData, setPaintingData] = useState({
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

export const handlePaintingOfSteelGirdersDiaphragms = (
    field: string,
    value: string,
) => {
    setPaintingOfSteelGirdersDiaphragms(prevData => ({
        ...prevData,
        [field]: value,
    }));
};

export const [placementOfReinforcementCage, setPlacementOfReinforcementCage] =
    useState({
        rebarDimensionChecked: 'Y',
        shapingCheckedAsPerGFC: 'Y',
        rebarsSecurelyBound: 'Y',
        spliceLengthChecked: 'Y',
        rebarWithinTolerance: 'Y',
        couplerArrangementsWithinTolerance: 'Y',
        barBendingScheduleChecked: 'Y',
    });

export const handlePlacementOfReinforcementCage = (field: string, value: string) => {
    setPaintingOfSteelGirdersDiaphragms(prevData => ({
        ...prevData,
        [field]: value,
    }));
};
export const [procurementOfSteelData, setProcurementOfSteelData] = useState({
    totalQtyOfSteelProcured: 0.0,
});
export const [transportationData, setTransportationData] = useState({
    transitTime: 0.0,
});
export const handleTextInputChangeProcurementOfSteel = (key: any, value: any) => {
    setProcurementOfSteelData({
        ...procurementOfSteelData,
        [key]: value,
    });
};
export const handleInputChangeFixingOfSheathingJoints = (key: any, value: any) => {
    setFixingOfSheathingJointsData(prevState => ({
        ...prevState,
        [key]: value,
    }));
};
export const handleInputChangeStitchConcrete = (key: any, value: any) => {
    setStitchConcreteData(prevState => ({
        ...prevState,
        [key]: value,
    }));
};
export const handleTextInputChangeTemporaryPrestressing = (
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




export const [fixingShutterData, setFixingShutterData] = useState({
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
export const [assemblingOfTrussData, setAssemblingOfTrussData] = useState({
    partsAccuratelyAssembled: 'Y',
    noBentOrBrokenParts: 'Y',
    trussSpanOnBlocks: 'Y',
    cleanJointSurfaces: 'Y',
    fastenersWithWashers: 'Y',
    serviceBoltsTightened: 'Y',
});

export const handleFixingShutter = (field: string, value: string) => {
    setFixingShutterData(prevData => ({
        ...prevData,
        [field]: value,
    }));
};

export const [erectionOfTemporaryStructure, setErectionOfTemporaryStructure] =
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

export const handleErectionOfTemporaryStructure = (field: string, value: string) => {
    setErectionOfTemporaryStructure(prevData => ({
        ...prevData,
        [field]: value,
    }));
};
export const handleBoringOfDiaphragmInputChange = (field: string, value: string) => {
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

export const deleteBallastItem = (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...ballastData];
    const prevIndex = ballastData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setBallastData(newData);
};

export const onAddBallastItem = () => {
    setBallastData([
        ...ballastData,
        {
            gradeOfConcrete: '',
            slumpValue: 0,
            concreteStartTime: '',
            concretePoured: 0,
            concreteFinishTime: '',
            totalBallastCasted: 0,
            key: Guid.create(),
        },
    ]);
};

// Function to close a swiped row
export const closeRow = (rowMap: any, rowKey: any) => {
    if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
    }
};

// Function to delete an item from the list
export const deleteItem = (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...concreteData];
    const prevIndex = concreteData.findIndex(
        item => item.gradeOfConcrete === rowKey,
    );
    newData.splice(prevIndex, 1);
    setConcreteData(newData);
};
export const deleteTorquingItem = (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...torquingData];
    const prevIndex = torquingData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setTorquingData(newData);
};
export const deleteDumpingItem = (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...dumpingData];
    const prevIndex = dumpingData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setDumpingData(newData);
};

//Function to delete glueing row
export const deleteGlueingItem = (rowMap: any, rowKey: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...glueingData];
    const prevIndex = glueingData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setGlueingData(newData);
};
// Function to handle row open event
export const onRowOpen = (rowKey: any) => {
    console.log('Opened row with key:', rowKey);
};