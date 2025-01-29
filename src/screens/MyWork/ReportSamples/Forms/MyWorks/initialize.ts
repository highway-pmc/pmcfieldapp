import { Guid } from "guid-typescript";
import { TASK_TYPES } from "../../../../../constants/constants";
import { selectedTask, setApplicationOfFilterMediaData, setAssemblingOfTrussData, setAutoLaunchingData, setBackfillData, setBackfillingData, setBallastData, setBarBendingScheduleChecked, setBoringOfDiaphragmData, setBoringOfPileData, setBricksLayeringData, setBricksWorkData, setCableDressingData, setCableTrenchDressingData, setCableTrenchExcavationData, setCastingOfBallastData, setCeilingWorkData, setChippingAndRemovalOfConcreteData, setChuteMembersData, setCleanliness, setComments, setCompactionData, setConcreteData, setConcreteFinishLevelMarked, setConcreteHasAchievedDesiredStrength, setConduitLayingData, setConstructionOfChamberData, setConstructionOfFoundationData, setCouplerArrangementsWithinTolerance, setCuringData, setCuttingOfJointsData, setCuttingOfSoilData, setDeStressingOfGirderData, setDoorWorksData, setDumpingData, setDumpingOfSoilData, setElectricalWorkData, setErectionData, setErectionOfAngleSectionData, setErectionOfBusShelterData, setErectionOfColumnsData, setErectionOfDoublePoleStructureData, setErectionOfFaciaPanelsData, setErectionOfFrictionSlabData, setErectionOfPolesData, setErectionOfStructureData, setErectionOfTemporaryStructure, setErectionPreCastColumnData, setErectionUsingCranesData, setExcavationOfTrenchData, setFabricationData, setFabricationOfStructureData, setFixingAndInstallationData, setFixingGeoCellData, setFixingOfAntiglaresData, setFixingOfArmsData, setFixingOfBearingData, setFixingOfBracingsData, setFixingOfConvexMirrorsData, setFixingOfFlexibleMedianMarkersData, setFixingOfGeoGridData, setFixingOfHazardMarkersData, setFixingOfLEDTrafficBlinkersData, setFixingOfMC4Data, setFixingOfMeshData, setFixingOfMetalBeamData, setFixingOfMMSData, setFixingOfModulesData, setFixingOfNoiseBarrierData, setFixingOfObjectMarkersData, setFixingOfPanelsData, setFixingOfRailingData, setFixingOfRoadDelineatorsData, setFixingOfRoadStudsData, setFixingOfSheathingJointsData, setFixingOfSolarBlinkersData, setFixingOfSolarRoadStudsData, setFixingOfSpringPostData, setFixingOfStoneData, setFixingOfWireRopeData, setFixingShutterData, setFixingVerticalPostData, setFlooringData, setFlooringWorkData, setFlushingOperationsData, setFormworkAlignmentChecked, setFormworkdDrawingsChecked, setFormworkFitConcreting, setFormworkProperlySupported, setFormworkSealingChecked, setFoundationData, setFurnitureWorkData, setGlassWorksData, setGlueingData, setGroutingData, setHackingOfGirderData, setHddCrossingData, setHvacWorkData, setImageObject, setInstallationOfEquipmentData, setInstallationOfExpansionJointData, setInstallationOfLEDLightsData, setInstallationOfNetworkDevicesData, setInstallationOfSolarSystemData, setInverterInstallationData, setLayingAndCompactionData, setLayingCautionTapeData, setLayingOfDLCData, setLayingOfDlcTableData, setLayingOfDuctData, setLayingOfFlexibleCableData, setLayingOfGrassTurfData, setLayingOfLTCableData, setLayingOfPaverBlockData, setLayingOfPQCData, setLayingOfSeparationMembraneData, setLayingOfTopSoilData, setLiftingCombinedLRData, setMachineCuttingData, setMillingData, setMinimumTimeHasBeenAttained, setMortarChecklistData, setNoLBendBottomOfTheCageChecked, setOpenPopup, setPaintingData, setPaintingOfSteelGirdersDiaphragms, setPipeLayingAndJointingData, setPitExcavationData, setPlacementOfReinforcementCage, setPlacementOfSignageSheetData, setPlacingChainLinkData, setPlacingOfDowelData, setPlacingOfFillerBoardData, setPlacingOfTieBarData, setPlantationData, setPlantingGrassData, setPlantingTreesData, setPlasteringData, setPlieShaftCleanedLooseMaterial, setPlumbingWorkData, setPreCastRccPanelData, setPreparationOfSoilData, setPrestressingData, setPrimeCoatData, setProcurementOfSheetData, setProcurementOfSteelData, setPuttyData, setQuantity, setRebarAndDimensionGFC, setRebarsSecurelyTightened, setRebarWithinToleranceLimit, setRemovalFormworkData, setRemovalOfTemporaryStructureData, setRFIDate, setRfiId, setRoadMarkingData, setRouteMarkingData, setSandLayerData, setSealantFilingData, setShapingNoAndLengthOfBarsGFC, setSignageLocationData, setSpacerBarCheckedGFC, setSpliceLengthAndLocationGFC, setSpreadingAndCompactionData, setSpreadingOfGrassSeedsData, setStackingInYardData, setStitchConcreteData, setStonePitchingData, setStrippingAndStoringTopSoilData, setSuitableSpacerProvidedToMaintainCoverToSteel, setTemporaryPrestressingData, setTexturingData, setTorquingData, setTrafficImpactAttenuatorsData, setTransportationData, setTransportationOfSteelGirdersDiaphragms, setWateringData, setWindowWorksData } from "./Variables";
import { getDbDate, getDisplayTime } from "../../../../../utils/Utils";

export const initRfiData = (rfiData: any) => {
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
            if (rfiData.metaData?.dumpingData) {
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
            if (rfiData.metaData?.fixingOfGeoGridData) {
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
            if (rfiData.metaData?.erectionOfFrictionSlabData) {
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
            if (rfiData.metaData?.erectionOfFaciaPanelsData) {
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
            if (rfiData.metaData?.erectionOfColumnsData) {
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
            if (rfiData.metaData?.applicationOfFilterMediaData) {
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
            if (rfiData.metaData?.fixingOfBracingsData) {
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
            if (rfiData.metaData?.fixingOfRailingData) {
                setFixingOfRailingData(rfiData.metaData.fixingOfRailingData);
            } else {
                setFixingOfRailingData({
                    lineLevelsChecked: 'Y',
                    railingAsPerApprovedDrawing: 'Y',
                });
            }
            break;
        case TASK_TYPES.PROCUREMENT_OF_SHEET:
            if (rfiData.metaData?.procurementOfSheetData) {
                setProcurementOfSheetData(rfiData.metaData.procurementOfSheetData);
            } else {
                setProcurementOfSheetData({
                    totalSheetPurchased: 0,
                });
            }
            break;
        case TASK_TYPES.DUMPING_OF_SOIL:
            if (rfiData.metaData?.dumpingOfSoilData) {
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
            if (rfiData.metaData?.boringOfDiaphragmData) {
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
            if (rfiData.metaData?.erectionData) {
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
            if (rfiData.metaData?.strippingAndStoringTopSoilData) {
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
            if (rfiData.metaData?.spreadingAndCompactionData) {
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
            if (rfiData.metaData?.primeCoatData) {
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
            if (rfiData.metaData?.roadMarkingData) {
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
            if (rfiData.metaData?.layingAndCompactionData) {
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
            if (rfiData.metaData?.pipeLayingAndJointingData) {
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
            if (rfiData.metaData?.fixingOfMetalBeamData) {
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
            if (rfiData.metaData?.fixingVerticalPostData) {
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
            if (rfiData.metaData?.cuttingOfJointsData) {
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
            if (rfiData.metaData?.layingOfPaverBlockData) {
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
            if (rfiData.metaData?.layingOfDlcTableData) {
                rfiData.metaData.layingOfDlcTableData.forEach((item: any) => {
                    item.key = Guid.create();
                });
                setLayingOfDlcTableData(rfiData.metaData.layingOfDlcTableData);
            } else {
                setLayingOfDlcTableData([]);
            }
            if (rfiData.metaData?.layingOfDLCData) {
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
            if (rfiData.metaData?.machineCuttingData) {
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
            if (rfiData.metaData?.placingOfTieBarData) {
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
            if (rfiData.metaData?.fixingOfWireRopeData) {
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
            if (rfiData.metaData?.texturingData) {
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
            if (rfiData.metaData?.placingOfDowelData) {
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
            if (rfiData.metaData?.compactionData) {
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
            if (rfiData.metaData?.placingOfFillerBoardData) {
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
            if (rfiData.metaData?.sealantFilingData) {
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
            if (rfiData.metaData?.millingData) {
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
            if (rfiData.metaData?.layingOfSeparationMembraneData) {
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
            if (rfiData.metaData?.cuttingOfSoilData) {
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
            if (rfiData.metaData?.layingOfPQCData) {
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
            if (rfiData.metaData?.backfillingData) {
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
            if (rfiData.metaData?.bricksWorkData) {
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
            if (rfiData.metaData?.fixingGeoCellData) {
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
            if (rfiData.metaData?.fixingOfMeshData) {
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
            if (rfiData.metaData?.layingOfGrassTurfData) {
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
            if (rfiData.metaData?.layingOfTopSoilData) {
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
            if (rfiData.metaData?.chuteMembersData) {
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
            if (rfiData.metaData?.pitExcavationData) {
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
            if (rfiData.metaData?.plantingGrassData) {
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
            if (rfiData.metaData?.plantingTreesData) {
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
            if (rfiData.metaData?.preparationOfSoilData) {
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
            if (rfiData.metaData?.spreadingOfGrassSeedsData) {
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
            if (rfiData.metaData?.wateringData) {
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
            if (rfiData.metaData?.plantationData) {
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
            if (rfiData.metaData?.stonePitchingData) {
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
            if (rfiData.metaData?.inverterInstallationData) {
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
            if (rfiData.metaData?.erectionOfDoublePoleStructureData) {
                setErectionOfDoublePoleStructureData(
                    rfiData.metaData.erectionOfDoublePoleStructureData,
                );
            } else {
                setErectionOfDoublePoleStructureData({
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
            }
            break;

        case TASK_TYPES.FIXING_OF_MC4_Y_CONNECTOR:
            if (rfiData.metaData?.fixingOfMC4Data) {
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
            if (rfiData.metaData?.fixingOfMC4Data) {
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
            if (rfiData.metaData?.fixingOfMMSData) {
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
            if (rfiData.metaData?.fixingOfModulesData) {
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
            if (rfiData.metaData?.layingCautionTapeData) {
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
            if (rfiData.metaData?.routeMarkingData) {
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
            if (rfiData.metaData?.bricksLayeringData) {
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
            if (rfiData.metaData?.cableDressingData) {
                setCableDressingData(rfiData.metaData.cableDressingData);
            } else {
                setCableDressingData({
                    cablesTiedProperly: 'Y',
                    noCableDamaged: 'Y',
                });
            }
            break;
        case TASK_TYPES.CABLE_TRENCH_DRESSING:
            if (rfiData.metaData?.cableTrenchDressingData) {
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
            if (rfiData.metaData?.conduitLayingData) {
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
            if (rfiData.metaData?.cableTrenchExcavationData) {
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
            if (rfiData.metaData?.fixingAndInstallationData) {
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
        // case TASK_TYPES.HT_PANEL_INSTALLATION:
        //   if (rfiData.metaData?.htPanelInstallationData) {
        //     setHtPanelInstallationData(
        //       rfiData.metaData.htPanelInstallationData,
        //     );
        //   } else {
        //     setHtPanelInstallationData({
        //       drawingsApproved: 'Y',
        //       equipmentInspected: 'Y',
        //       equipmentDamageReported: 'Y',
        //       foundationWorkCompleted: 'Y',
        //       concreteStrengthAchieved: 'Y',
        //       installationMethodologyApproved: 'Y',
        //       safetyArrangementsInPlace: 'Y',
        //       machineryAndManpowerAvailable: 'Y',
        //       installationCompleted: 'Y',
        //       manufacturerInstructionsFollowed: 'Y',
        //       totalEquipmentsInstalled: 0,
        //     });
        //   }
        //   break;
        case TASK_TYPES.ERECTION_OF_STRUCTURE:
            if (rfiData.metaData?.erectionOfStructureData) {
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
            if (rfiData.metaData?.fabricationOfStructureData) {
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
            if (rfiData.metaData?.fixingOfPanelsData) {
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
            if (rfiData.metaData?.erectionPreCastColumnData) {
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
            if (rfiData.metaData?.erectionOfBusShelterData) {
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
            if (rfiData.metaData?.erectionOfAngleSectionData) {
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
            if (rfiData.metaData?.preCastRccPanelData) {
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
            if (rfiData.metaData?.placingChainLinkData) {
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
            if (rfiData.metaData?.mortarChecklistData) {
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
            if (rfiData.metaData?.flooringData) {
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
            if (rfiData.metaData?.signageLocationData) {
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
            if (rfiData.metaData?.backfillData) {
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
            if (rfiData.metaData?.placementOfSignageSheetData) {
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
            if (rfiData.metaData?.trafficImpactAttenuatorsData) {
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
            if (rfiData.metaData?.fixingOfSpringPostData) {
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
            if (rfiData.metaData?.fixingOfSolarRoadStudsData) {
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
            if (rfiData.metaData?.fixingOfSolarBlinkersData) {
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
            if (rfiData.metaData?.fixingOfRoadStudsData) {
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
            if (rfiData.metaData?.fixingOfRoadDelineatorsData) {
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
            if (rfiData.metaData?.fixingOfObjectMarkersData) {
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
            if (rfiData.metaData?.fixingOfNoiseBarrierData) {
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
            if (rfiData.metaData?.fixingOfLEDTrafficBlinkersData) {
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
            if (rfiData.metaData?.fixingOfHazardMarkersData) {
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
            if (rfiData.metaData?.fixingOfFlexibleMedianMarkersData) {
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
            if (rfiData.metaData?.fixingOfConvexMirrorsData) {
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
            if (rfiData.metaData?.fixingOfAntiglaresData) {
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
            if (rfiData.metaData?.erectionOfPolesData) {
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
            if (rfiData.metaData?.fixingOfArmsData) {
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
            if (rfiData.metaData?.installationOfLEDLightsData) {
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
            if (rfiData.metaData?.layingOfFlexibleCableData) {
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
            if (rfiData.metaData?.layingOfLTCableData) {
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
            if (rfiData.metaData?.fixingOfStoneData) {
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
            if (rfiData.metaData?.plasteringData) {
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
            if (rfiData.metaData?.puttyData) {
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
            if (rfiData.metaData?.hvacWorkData) {
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
            if (rfiData.metaData?.ceilingWorkData) {
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
            if (rfiData.metaData?.furnitureWorkData) {
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
            if (rfiData.metaData?.doorWorksData) {
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
            if (rfiData.metaData?.windowWorksData) {
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
            if (rfiData.metaData?.glassWorksData) {
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
        case TASK_TYPES.ELECTRICAL_WORK:
            if (rfiData.metaData?.electricalWorkData) {
                setElectricalWorkData(rfiData.metaData.electricalWorkData);
            } else {
                setElectricalWorkData({
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
            }
            break;
        case TASK_TYPES.PLUMBING_WORK:
            if (rfiData.metaData?.plumbingWorkData) {
                setPlumbingWorkData(rfiData.metaData.plumbingWorkData);
            } else {
                setPlumbingWorkData({
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
            }
            break;
        case TASK_TYPES.FLOORING_WORK:
            if (rfiData.metaData?.flooringWorkData) {
                setFlooringWorkData(rfiData.metaData.flooringWorkData);
            } else {
                setFlooringWorkData({
                    drawingsApproved: 'Y',
                    materialSourceApproved: 'Y',
                    materialReceivedAsPerSpecs: 'Y',
                    siteReadyForFlooring: 'Y',
                    finishingWorkProper: 'Y',
                    slopeCheckedAsRequired: 'Y',
                    workCompletedToSatisfaction: 'Y',
                    totalSqftAreaCompleted: 0.0,
                });
            }
            break;
        case TASK_TYPES.EXCAVATION_OF_TRENCH:
            if (rfiData.metaData?.excavationOfTrenchData) {
                setExcavationOfTrenchData(rfiData.metaData.excavationOfTrenchData);
            } else {
                setExcavationOfTrenchData({
                    drawingsApproved: 'Y',
                    safetyArrangementsInPlace: 'Y',
                    layoutMarked: 'Y',
                    noUtilityInAlignment: 'Y',
                    depthWidthAsPerDrawing: 'Y',
                    areaCoveredProperly: 'Y',
                    totalLengthExcavated: 0.0,
                    totalQtyEarthExcavated: 0.0,
                });
            }
            break;
        case TASK_TYPES.LAYING_OF_DUCT:
            if (rfiData.metaData?.layingOfDuctData) {
                setLayingOfDuctData(rfiData.metaData.layingOfDuctData);
            } else {
                setLayingOfDuctData({
                    drawingsApproved: 'Y',
                    safetyArrangementsInPlace: 'Y',
                    sourceMaterialObtained: 'Y',
                    materialNotDamaged: 'Y',
                    ductsLaidProperly: 'Y',
                    jointsCompletedProperly: 'Y',
                    totalLengthOfDuctLaid: 0.0,
                });
            }
            break;
        case TASK_TYPES.HDD_CROSSING:
            if (rfiData.metaData?.hddCrossingData) {
                setHddCrossingData(rfiData.metaData.hddCrossingData);
            } else {
                setHddCrossingData({
                    drawingsApproved: 'Y',
                    safetyArrangementsInPlace: 'Y',
                    layoutMarkedAtSite: 'Y',
                    routeMarkingDeviceAvailable: 'Y',
                    depthAlignmentAsPerDrawings: 'Y',
                    excavatedAreaCoveredProperly: 'Y',
                    ductPipePulledSuccessfully: 'Y',
                    totalLengthOfHddCrossing: 0.0,
                });
            }
            break;
        case TASK_TYPES.CONSTRUCTION_OF_CHAMBER:
            if (rfiData.metaData?.constructionOfChamberData) {
                setConstructionOfChamberData(
                    rfiData.metaData.constructionOfChamberData,
                );
            } else {
                setConstructionOfChamberData({
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
            }
            break;
        case TASK_TYPES.INSTALLATION_OF_EQUIPMENT:
            if (rfiData.metaData?.installationOfEquipmentData) {
                setInstallationOfEquipmentData(
                    rfiData.metaData.installationOfEquipmentData,
                );
            } else {
                setInstallationOfEquipmentData({
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
            }
            break;
        case TASK_TYPES.INSTALLATION_OF_SOLAR_SYSTEM:
            if (rfiData.metaData?.installationOfSolarSystemData) {
                setInstallationOfSolarSystemData(
                    rfiData.metaData.installationOfSolarSystemData,
                );
            } else {
                setInstallationOfSolarSystemData({
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
            }
            break;
        case TASK_TYPES.INSTALLATION_OF_NETWORK_DEVICES:
            if (rfiData.metaData?.installationOfNetworkDevicesData) {
                setInstallationOfNetworkDevicesData(
                    rfiData.metaData.installationOfNetworkDevicesData,
                );
            } else {
                setInstallationOfNetworkDevicesData({
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
            }
            break;
        case TASK_TYPES.CONSTRUCTION_OF_FOUNDATION:
            if (rfiData.metaData?.constructionOfFoundationData) {
                setConstructionOfFoundationData(
                    rfiData.metaData.constructionOfFoundationData,
                );
            } else {
                setConstructionOfFoundationData({
                    drawingsApproved: 'Y',
                    pitExcavatedAtApprovedLocation: 'Y',
                    pitsExcavatedAsPerDrawings: 'Y',
                    reinforcementPlacedProperly: 'Y',
                    formworkCheckedProperly: 'Y',
                    totalWeightReinforcementKg: 0.0,
                });
            }
            if (rfiData.metaData?.foundationData) {
                rfiData.metaData.foundationData.forEach((item: any) => {
                    item.key = Guid.create();
                });
                setFoundationData(rfiData.metaData.foundationData);
            } else {
                setFoundationData([]);
            }
            break;
        case TASK_TYPES.CASTING_OF_BALLAST:
            if (rfiData.metaData?.castingOfBallastData) {
                setCastingOfBallastData(rfiData.metaData.castingOfBallastData);
            } else {
                setCastingOfBallastData({
                    drawingsApproved: 'Y',
                    mouldsReady: 'Y',
                    reinforcementTiedProperly: 'Y',
                    totalReinforcementWeightKg: 0.0,
                });
            }
            if (rfiData.metaData?.ballastData) {
                rfiData.metaData.ballastData.forEach((item: any) => {
                    item.key = Guid.create();
                });
                setBallastData(rfiData.metaData.ballastData);
            } else {
                setBallastData([]);
            }
            break;
        case TASK_TYPES.SAND_LAYER:
            if (rfiData.metaData?.sandLayerData) {
                setSandLayerData(rfiData.metaData.sandLayerData);
            } else {
                setSandLayerData({
                    drawingsApproved: 'Y',
                    safetyArrangementsInPlace: 'Y',
                    sourceOfSandApproved: 'Y',
                    thicknessAsPerDrawings: 'Y',
                    excavatedAreaCovered: 'Y',
                    totalLengthTrenchCovered: 0.0,
                    totalQtySandFilled: 0.0,
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