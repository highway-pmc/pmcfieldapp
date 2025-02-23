import { Guid } from "guid-typescript";
import { TASK_TYPES } from "../../../../../constants/constants";
import { getDbDate, getDisplayTime } from "../../../../../utils/Utils";

export const initRfiData = (_v: any) => {
    _v.setRfiId(_v.rfiData._id);
    const rfiData = _v.rfiData;
    //if (rfiData.metaData) {
    switch (_v.selectedTask?.name) {
        case TASK_TYPES.CNG_AND_SETTING_OUT:
        case TASK_TYPES.PLACING_OF_SHEATHING_DUCT:
        case TASK_TYPES.POST_CONCRETE_CHECK:
        case TASK_TYPES.FIXING_OF_BEARING_SLEEVES:
            _v.setImageObject({
                filePath: '',
                fileData: _v.rfiData.metaData?.base64Image,
                fileUri: '',
            });
            break;
        case TASK_TYPES.FORM_WORK:
        case TASK_TYPES.PLACEMENT_OF_INNER_SHUTTERS:
        case TASK_TYPES.PLACEMENT_OF_SIDE_SHUTTERS:
        case TASK_TYPES.PLACEMENT_OF_BOTTOM_SHUTTER:
        case TASK_TYPES.PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER:
            _v.setCleanliness(rfiData.metaData?.cleanliness);
            _v.setFormworkAlignmentChecked(
                rfiData.metaData?.formworkAlignmentChecked,
            );
            _v.setFormworkSealingChecked(rfiData.metaData?.formworkSealingChecked);
            _v.setFormworkdDrawingsChecked(
                rfiData.metaData?.formworkdDrawingsChecked,
            );
            _v.setConcreteFinishLevelMarked(
                rfiData.metaData?.concreteFinishLevelMarked,
            );
            _v.setFormworkProperlySupported(
                rfiData.metaData?.formworkProperlySupported,
            );
            _v.setFormworkFitConcreting(rfiData.metaData?.formworkFitConcreting);
            break;
        case TASK_TYPES.REINFORCEMENT_PREPARATION:
        case TASK_TYPES.REINFORCEMENT:
            _v.setRebarAndDimensionGFC(rfiData.metaData?.rebarAndDimensionGFC);
            _v.setShapingNoAndLengthOfBarsGFC(
                rfiData.metaData?.shapingNoAndLengthOfBarsGFC,
            );
            _v.setRebarsSecurelyTightened(rfiData.metaData?.rebarsSecurelyTightened);
            _v.setSpliceLengthAndLocationGFC(
                rfiData.metaData?.spliceLengthAndLocationGFC,
            );
            _v.setRebarWithinToleranceLimit(
                rfiData.metaData?.rebarWithinToleranceLimit,
            );
            _v.setCouplerArrangementsWithinTolerance(
                rfiData.metaData?.couplerArrangementsWithinTolerance,
            );
            _v.setBarBendingScheduleChecked(
                rfiData.metaData?.barBendingScheduleChecked,
            );
            _v.setSpacerBarCheckedGFC(rfiData.metaData?.spacerBarCheckedGFC);
            break;
        case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
            _v.setRebarAndDimensionGFC(rfiData.metaData?.rebarAndDimensionGFC);
            _v.setShapingNoAndLengthOfBarsGFC(
                rfiData.metaData?.shapingNoAndLengthOfBarsGFC,
            );
            _v.setRebarsSecurelyTightened(rfiData.metaData?.rebarsSecurelyTightened);
            _v.setSpliceLengthAndLocationGFC(
                rfiData.metaData?.spliceLengthAndLocationGFC,
            );
            _v.setRebarWithinToleranceLimit(
                rfiData.metaData?.rebarWithinToleranceLimit,
            );
            _v.setCouplerArrangementsWithinTolerance(
                rfiData.metaData?.couplerArrangementsWithinTolerance,
            );
            _v.setBarBendingScheduleChecked(
                rfiData.metaData?.barBendingScheduleChecked,
            );
            break;
        case TASK_TYPES.EXCAVATION:
            _v.setQuantity(rfiData.metaData?.quantity);
            break;
        case TASK_TYPES.REMOVAL_OF_SIDE_SHUTTERS:
        case TASK_TYPES.REMOVAL_OF_MIDDLIE_TOP_SHUTTERS:
        case TASK_TYPES.REMOVAL_OF_INNER_SHUTTERS:
        case TASK_TYPES.REMOVAL_OF_SHUTTER:
        case TASK_TYPES.REMOVAL_OF_SHUTTERS:
            _v.setConcreteHasAchievedDesiredStrength(
                rfiData.metaData?.concreteHasAchievedDesiredStrength,
            );
            _v.setMinimumTimeHasBeenAttained(
                rfiData.metaData?.minimumTimeHasBeenAttained,
            );
            break;
        case TASK_TYPES.CAGE_LOWERING:
            _v.setPlieShaftCleanedLooseMaterial(
                rfiData.metaData?.plieShaftCleanedLooseMaterial,
            );
            _v.setSuitableSpacerProvidedToMaintainCoverToSteel(
                rfiData.metaData?.suitableSpacerProvidedToMaintainCoverToSteel,
            );
            _v.setNoLBendBottomOfTheCageChecked(
                rfiData.metaData?.noLBendBottomOfTheCageChecked,
            );
            break;
        case TASK_TYPES.BORING_OF_PILE:
            if (rfiData.metaData?.boringOfPileData) {
                _v.setBoringOfPileData(rfiData.metaData?.boringOfPileData);
            } else {
                _v.setBoringOfPileData({
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
                _v.setFlushingOperationsData(rfiData.metaData?.flushingOperationsData);
            } else {
                _v.setFlushingOperationsData({
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
                _v.setBoringOfPileData(rfiData.metaData?.groutingData);
            } else {
                _v.setGroutingData({
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
                _v.setChippingAndRemovalOfConcreteData(
                    rfiData.metaData?.chippingAndRemovalOfConcreteData,
                );
            } else {
                _v.setChippingAndRemovalOfConcreteData({
                    noOfDaysOfChipping: 0,
                });
            }
            break;
        case TASK_TYPES.STITCH_CONCRETE:
            if (rfiData.metaData?.concreteData) {
                rfiData.metaData?.concreteData.forEach((item: any) => {
                    item.key = Guid.create();
                });
                _v.setConcreteData(rfiData.metaData?.concreteData);
            } else {
                _v.setConcreteData([]);
            }
            if (rfiData.metaData?.stitchConcreteData) {
                _v.setStitchConcreteData(rfiData.metaData?.stitchConcreteData);
            } else {
                _v.setStitchConcreteData({
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
                _v.setConcreteData(rfiData.metaData?.concreteData);
            } else {
                _v.setConcreteData([]);
            }
            break;
        case TASK_TYPES.DUMPING:
            if (rfiData.metaData?.dumpingData) {
                rfiData.metaData.dumpingData.forEach((item: any) => {
                    item.key = Guid.create();
                });
                _v.setDumpingData(rfiData.metaData.dumpingData);
            } else {
                _v.setDumpingData([]);
            }
            break;

        case TASK_TYPES.GLUEING:
            if (rfiData.metaData?.glueingData) {
                rfiData.metaData?.glueingData.forEach((item: any) => {
                    item.key = Guid.create();
                });
                _v.setGlueingData(rfiData.metaData?.glueingData);
            } else {
                if (_v.selectedTask.taskDetailsData) {
                    const taskDetails: any = [];
                    _v.selectedTask.taskDetailsData.forEach((item: any) => {
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
                    _v.setGlueingData(taskDetails);
                } else {
                    _v.setGlueingData([]);
                }
            }
            break;
        case TASK_TYPES.TORQUING:
            if (rfiData.metaData?.torquingData) {
                rfiData.metaData?.torquingData.forEach((item: any) => {
                    item.key = Guid.create();
                });
                _v.setTorquingData(rfiData.metaData?.torquingData);
            } else {
                _v.setTorquingData([]);
            }
            break;

        case TASK_TYPES.REMOVAL_OF_FORMWORK:
            if (rfiData.metaData?.removalFormworkData) {
                _v.setRemovalFormworkData(rfiData.metaData?.removalFormworkData);
            } else {
                _v.setRemovalFormworkData({
                    concreteStrengthAchieved: 'Y',
                    minimumTimeAttained: 'Y',
                });
            }
            break;
        case TASK_TYPES.FABRICATION_OF_BUS_SHELTER:
        case TASK_TYPES.FABRICATION_OF_MEMBERS:
        case TASK_TYPES.FABRICATION_OF_STEEL_GIRDERS:
            if (rfiData.metaData?.fabricationData) {
                _v.setFabricationData(rfiData.metaData?.fabricationData);
            } else {
                _v.setFabricationData({
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
                _v.setTemporaryPrestressingData(
                    rfiData.metaData?.temporaryPrestressingData,
                );
            } else {
                if (_v.selectedTask.taskDetailsData) {
                    const taskDetails: any = [];
                    _v.selectedTask.taskDetailsData.forEach((item: any) => {
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
                    _v.setTemporaryPrestressingData(taskDetails);
                } else {
                    _v.setTemporaryPrestressingData([]);
                }
            }
            break;

        case TASK_TYPES.PAINTING_OF_STEEL_GIRDERS_DIAPHRAGMS:
            if (rfiData.metaData?.paintingOfSteelGirdersDiaphragms) {
                _v.setPaintingOfSteelGirdersDiaphragms(
                    rfiData.metaData?.paintingOfSteelGirdersDiaphragms,
                );
            } else {
                _v.setPaintingOfSteelGirdersDiaphragms({
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
                _v.setPlacementOfReinforcementCage(
                    rfiData.metaData?.placementOfReinforcementCage,
                );
            } else {
                _v.setPlacementOfReinforcementCage({
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
                _v.setTransportationOfSteelGirdersDiaphragms(
                    rfiData.metaData?.transportationOfSteelGirdersDiaphragms,
                );
            } else {
                _v.setTransportationOfSteelGirdersDiaphragms({
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
                _v.setCuringData(rfiData.metaData?.curingData);
            } else {
                _v.setCuringData({
                    waterUsedForCuring: 'Y',
                    phValueOfWater: 'Y',
                    consumptionOfWater: 0,
                });
            }
            break;

        case TASK_TYPES.FIXING_OF_SHUTTER:
            if (rfiData.metaData?.fixingShutterData) {
                _v.setFixingShutterData(rfiData.metaData?.fixingShutterData);
            } else {
                _v.setFixingShutterData({
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
                _v.setErectionOfTemporaryStructure(
                    rfiData.metaData?.erectionOfTemporaryStructure,
                );
            } else {
                _v.setErectionOfTemporaryStructure({
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
                _v.setErectionUsingCranesData(
                    rfiData.metaData?.erectionUsingCranesData,
                );
            } else {
                _v.setErectionUsingCranesData({
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
                _v.setStackingInYardData(rfiData.metaData?.stackingInYardData);
            } else {
                _v.setStackingInYardData({
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
                _v.setAssemblingOfTrussData(rfiData.metaData?.assemblingOfTrussData);
            } else {
                _v.setAssemblingOfTrussData({
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
                _v.setHackingOfGirderData(rfiData.metaData?.hackingOfGirderData);
            } else {
                _v.setHackingOfGirderData({
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
                _v.setDeStressingOfGirderData(
                    rfiData.metaData?.deStressingOfGirderData,
                );
            } else {
                _v.setDeStressingOfGirderData({
                    strengthAchieved: 'Y',
                    diamondBitSawUsed: 'Y',
                    gradualUniformTransfer: 'Y',
                });
            }
            break;
        case TASK_TYPES.FIXING_OF_BEARING:
            if (rfiData.metaData?.fixingOfBearingData) {
                _v.setFixingOfBearingData(rfiData.metaData?.fixingOfBearingData);
            } else {
                _v.setFixingOfBearingData({
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
                _v.setRemovalOfTemporaryStructureData(
                    rfiData.metaData?.removalOfTemporaryStructureData,
                );
            } else {
                _v.setRemovalOfTemporaryStructureData({
                    concreteAchievedStrength: 'Y',
                    minimumTimeAttained: 'Y',
                    allComponentsTightened: 'Y',
                });
            }
            break;
        case TASK_TYPES.INSTALLATION_OF_EXPANSION_JOINT:
            if (rfiData.metaData?.installationOfExpansionJointData) {
                _v.setInstallationOfExpansionJointData(
                    rfiData.metaData?.installationOfExpansionJointData,
                );
            } else {
                _v.setInstallationOfExpansionJointData({
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
                _v.setPaintingData(rfiData.metaData?.paintingData);
            } else {
                _v.setPaintingData({
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
                _v.setAutoLaunchingData(rfiData.metaData?.autoLaunchingData);
            } else {
                _v.setAutoLaunchingData({
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
                _v.setProcurementOfSteelData(rfiData.metaData?.procurementOfSteelData);
            } else {
                _v.setProcurementOfSteelData({
                    totalQtyOfSteelProcured: 0.0,
                });
            }
            break;
        case TASK_TYPES.TRANSPORTATION_OF_MATERIAL:
            if (rfiData.metaData?.transportationData) {
                _v.setTransportationData(rfiData.metaData?.transportationData);
            } else {
                _v.setTransportationData({
                    transitTime: 0.0,
                });
            }
            break;
        case TASK_TYPES.FIXING_OF_SHEATHING_JOINTS:
            if (rfiData.metaData?.fixingOfSheathingJointsData) {
                _v.setFixingOfSheathingJointsData(
                    rfiData.metaData?.fixingOfSheathingJointsData,
                );
            } else {
                _v.setFixingOfSheathingJointsData({
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
                _v.setFixingOfGeoGridData(rfiData.metaData.fixingOfGeoGridData);
            } else {
                _v.setFixingOfGeoGridData({
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
                _v.setErectionOfFrictionSlabData(
                    rfiData.metaData.erectionOfFrictionSlabData,
                );
            } else {
                _v.setErectionOfFrictionSlabData({
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
                _v.setErectionOfFaciaPanelsData(
                    rfiData.metaData.erectionOfFaciaPanelsData,
                );
            } else {
                _v.setErectionOfFaciaPanelsData({
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
                _v.setErectionOfColumnsData(rfiData.metaData.erectionOfColumnsData);
            } else {
                _v.setErectionOfColumnsData({
                    positionChecked: 'Y',
                    weldingAsPerDrawing: 'Y',
                    columnsAsPerDrawing: 'Y',
                    supportProvided: 'Y',
                });
            }
            break;
        case TASK_TYPES.APPLICATION_OF_FILTER_MEDIA:
            if (rfiData.metaData?.applicationOfFilterMediaData) {
                _v.setApplicationOfFilterMediaData(
                    rfiData.metaData.applicationOfFilterMediaData,
                );
            } else {
                _v.setApplicationOfFilterMediaData({
                    filterMediaAsPerDrawing: 'Y',
                });
            }
            break;
        case TASK_TYPES.FIXING_OF_BRACINGS:
            if (rfiData.metaData?.fixingOfBracingsData) {
                _v.setFixingOfBracingsData(rfiData.metaData.fixingOfBracingsData);
            } else {
                _v.setFixingOfBracingsData({
                    lineLevelsChecked: 'Y',
                    weldingAsPerApprovedDrawing: 'Y',
                    bracingsAsPerApprovedDrawing: 'Y',
                });
            }
            break;
        case TASK_TYPES.FIXING_OF_RAILING:
            if (rfiData.metaData?.fixingOfRailingData) {
                _v.setFixingOfRailingData(rfiData.metaData.fixingOfRailingData);
            } else {
                _v.setFixingOfRailingData({
                    lineLevelsChecked: 'Y',
                    railingAsPerApprovedDrawing: 'Y',
                });
            }
            break;
        case TASK_TYPES.PROCUREMENT_OF_SHEET:
            if (rfiData.metaData?.procurementOfSheetData) {
                _v.setProcurementOfSheetData(rfiData.metaData.procurementOfSheetData);
            } else {
                _v.setProcurementOfSheetData({
                    totalSheetPurchased: 0,
                });
            }
            break;
        case TASK_TYPES.DUMPING_OF_SOIL:
            if (rfiData.metaData?.dumpingOfSoilData) {
                _v.setDumpingOfSoilData(rfiData.metaData.dumpingOfSoilData);
            } else {
                _v.setDumpingOfSoilData({
                    soilApprovedSource: 'Y',
                    soilWithoutUnwantedMaterials: 'Y',
                    quantityOfSoilDumped: '0.0',
                });
            }
            break;
        case TASK_TYPES.BORING_OF_DIAPHRAGM:
            if (rfiData.metaData?.boringOfDiaphragmData) {
                _v.setBoringOfDiaphragmData(rfiData.metaData.boringOfDiaphragmData);
            } else {
                _v.setBoringOfDiaphragmData({
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
                _v.setErectionData(rfiData.metaData.erectionData);
            } else {
                _v.setErectionData({
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
                _v.setStrippingAndStoringTopSoilData(
                    rfiData.metaData.strippingAndStoringTopSoilData,
                );
            } else {
                _v.setStrippingAndStoringTopSoilData({
                    topSoilCollectedStored: 0, // Default value
                });
            }
            break;
        case TASK_TYPES.SPREADING_AND_COMPACTION:
            if (rfiData.metaData?.spreadingAndCompactionData) {
                _v.setSpreadingAndCompactionData(
                    rfiData.metaData.spreadingAndCompactionData,
                );
            } else {
                _v.setSpreadingAndCompactionData({
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
                    totalQtySpreaded: 0.0,
                });
            }
            break;
        case TASK_TYPES.PRIME_COAT:
        case TASK_TYPES.TACK_COAT:
            if (rfiData.metaData?.primeCoatData) {
                _v.setPrimeCoatData(rfiData.metaData.primeCoatData);
            } else {
                _v.setPrimeCoatData({
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
                _v.setRoadMarkingData(rfiData.metaData.roadMarkingData);
            } else {
                _v.setRoadMarkingData({
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
                _v.setLayingAndCompactionData(
                    rfiData.metaData.layingAndCompactionData,
                );
            } else {
                _v.setLayingAndCompactionData({
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
                _v.setPipeLayingAndJointingData(
                    rfiData.metaData.pipeLayingAndJointingData,
                );
            } else {
                _v.setPipeLayingAndJointingData({
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
                _v.setFixingOfMetalBeamData(rfiData.metaData.fixingOfMetalBeamData);
            } else {
                _v.setFixingOfMetalBeamData({
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
                _v.setFixingVerticalPostData(rfiData.metaData.fixingVerticalPostData);
            } else {
                _v.setFixingVerticalPostData({
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
                _v.setCuttingOfJointsData(rfiData.metaData.cuttingOfJointsData);
            } else {
                _v.setCuttingOfJointsData({
                    jointsCutAtDesiredIntervals: 'Y',
                    jointsCutAtDesiredDepth: 'Y',
                    jointCutDoneProperly: 'Y',
                    totalLengthCompleted: 0.0,
                });
            }
            break;
        case TASK_TYPES.LAYING_OF_PAVER_BLOCK:
            if (rfiData.metaData?.layingOfPaverBlockData) {
                _v.setLayingOfPaverBlockData(rfiData.metaData.layingOfPaverBlockData);
            } else {
                _v.setLayingOfPaverBlockData({
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
                _v.setLayingOfDlcTableData(rfiData.metaData.layingOfDlcTableData);
            } else {
                _v.setLayingOfDlcTableData([]);
            }
            if (rfiData.metaData?.layingOfDLCData) {
                _v.setLayingOfDLCData(rfiData.metaData.layingOfDLCData);
            } else {
                _v.setLayingOfDLCData({
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
                _v.setMachineCuttingData(rfiData.metaData.machineCuttingData);
            } else {
                _v.setMachineCuttingData({
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
                _v.setPlacingOfTieBarData(rfiData.metaData.placingOfTieBarData);
            } else {
                _v.setPlacingOfTieBarData({
                    drawingApproved: 'Y',
                    placingDoneAsPerDrawings: 'Y',
                    alignmentDoneProperly: 'Y',
                    nonConformanceFound: 'Y',
                });
            }
            break;
        case TASK_TYPES.FIXING_OF_WIRE_ROPE:
            if (rfiData.metaData?.fixingOfWireRopeData) {
                _v.setFixingOfWireRopeData(rfiData.metaData.fixingOfWireRopeData);
            } else {
                _v.setFixingOfWireRopeData({
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
                _v.setTexturingData(rfiData.metaData.texturingData);
            } else {
                _v.setTexturingData({
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
                _v.setPlacingOfDowelData(rfiData.metaData.placingOfDowelData);
            } else {
                _v.setPlacingOfDowelData({
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
                _v.setCompactionData(rfiData.metaData.compactionData);
            } else {
                _v.setCompactionData({
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
                _v.setPlacingOfFillerBoardData(
                    rfiData.metaData.placingOfFillerBoardData,
                );
            } else {
                _v.setPlacingOfFillerBoardData({
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
                _v.setSealantFilingData(rfiData.metaData.sealantFilingData);
            } else {
                _v.setSealantFilingData({
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
                _v.setMillingData(rfiData.metaData.millingData);
            } else {
                _v.setMillingData({
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
                _v.setLayingOfSeparationMembraneData(
                    rfiData.metaData.layingOfSeparationMembraneData,
                );
            } else {
                _v.setLayingOfSeparationMembraneData({
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
                _v.setCuttingOfSoilData(rfiData.metaData.cuttingOfSoilData);
            } else {
                _v.setCuttingOfSoilData({
                    safetyMeasuresTaken: 'Y',
                    equipmentAvailable: 'Y',
                    excavationDone: 'Y',
                    totalSoilCutQty: 0.0,
                });
            }
            break;
        case TASK_TYPES.LAYING_OF_PAVEMENT_QUALITY_CONCRETE:
            if (rfiData.metaData?.layingOfPQCData) {
                _v.setLayingOfPQCData(rfiData.metaData.layingOfPQCData);
            } else {
                _v.setLayingOfPQCData({
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
                _v.setBackfillingData(rfiData.metaData.backfillingData);
            } else {
                _v.setBackfillingData({
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
                _v.setBricksWorkData(rfiData.metaData.bricksWorkData);
            } else {
                _v.setBricksWorkData({
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
                _v.setFixingGeoCellData(rfiData.metaData.fixingGeoCellData);
            } else {
                _v.setFixingGeoCellData({
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
                _v.setFixingOfMeshData(rfiData.metaData.fixingOfMeshData);
            } else {
                _v.setFixingOfMeshData({
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
                _v.setLayingOfGrassTurfData(rfiData.metaData.layingOfGrassTurfData);
            } else {
                _v.setLayingOfGrassTurfData({
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
                _v.setLayingOfTopSoilData(rfiData.metaData.layingOfTopSoilData);
            } else {
                _v.setLayingOfTopSoilData({
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
                _v.setChuteMembersData(rfiData.metaData.chuteMembersData);
            } else {
                _v.setChuteMembersData({
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
                _v.setPitExcavationData(rfiData.metaData.pitExcavationData);
            } else {
                _v.setPitExcavationData({
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
                _v.setPlantingGrassData(rfiData.metaData.plantingGrassData);
            } else {
                _v.setPlantingGrassData({
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
                _v.setPlantingTreesData(rfiData.metaData.plantingTreesData);
            } else {
                _v.setPlantingTreesData({
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
                _v.setPreparationOfSoilData(rfiData.metaData.preparationOfSoilData);
            } else {
                _v.setPreparationOfSoilData({
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
                _v.setSpreadingOfGrassSeedsData(
                    rfiData.metaData.spreadingOfGrassSeedsData,
                );
            } else {
                _v.setSpreadingOfGrassSeedsData({
                    seedApprovedSource: 'Y',
                    surfaceFreeFromGarbage: 'Y',
                    surfaceWellPrepared: 'Y',
                });
            }
            break;
        case TASK_TYPES.WATERING:
            if (rfiData.metaData?.wateringData) {
                _v.setWateringData(rfiData.metaData.wateringData);
            } else {
                _v.setWateringData({
                    waterClean: 'Y',
                    wateringThreeTimesADay: 'Y',
                    totalQtyWaterUsed: 0.0,
                });
            }
            break;
        case TASK_TYPES.PLANTATION:
            if (rfiData.metaData?.plantationData) {
                _v.setPlantationData(rfiData.metaData.plantationData);
            } else {
                _v.setPlantationData({
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
                _v.setStonePitchingData(rfiData.metaData.stonePitchingData);
            } else {
                _v.setStonePitchingData({
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
                _v.setInverterInstallationData(
                    rfiData.metaData.inverterInstallationData,
                );
            } else {
                _v.setInverterInstallationData({
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
                _v.setErectionOfDoublePoleStructureData(
                    rfiData.metaData.erectionOfDoublePoleStructureData,
                );
            } else {
                _v.setErectionOfDoublePoleStructureData({
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
                _v.setFixingOfMC4Data(rfiData.metaData.fixingOfMC4Data);
            } else {
                _v.setFixingOfMC4Data({
                    cablesConnected: 'Y',
                    connectionsChecked: 'Y',
                    totalYConnectorsUsed: 0,
                });
            }
            break;
        case TASK_TYPES.FIXING_OF_MC4_Y_CONNECTOR:
            if (rfiData.metaData?.fixingOfMC4Data) {
                _v.setFixingOfMC4Data(rfiData.metaData.fixingOfMC4Data);
            } else {
                _v.setFixingOfMC4Data({
                    cablesConnected: 'Y',
                    connectionsChecked: 'Y',
                    totalYConnectorsUsed: 0,
                });
            }
            break;
        case TASK_TYPES.FIXING_OF_MMS:
            if (rfiData.metaData?.fixingOfMMSData) {
                _v.setFixingOfMMSData(rfiData.metaData.fixingOfMMSData);
            } else {
                _v.setFixingOfMMSData({
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
                _v.setFixingOfModulesData(rfiData.metaData.fixingOfModulesData);
            } else {
                _v.setFixingOfModulesData({
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
                _v.setLayingCautionTapeData(rfiData.metaData.layingCautionTapeData);
            } else {
                _v.setLayingCautionTapeData({
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
                _v.setRouteMarkingData(rfiData.metaData.routeMarkingData);
            } else {
                _v.setRouteMarkingData({
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
                _v.setBricksLayeringData(rfiData.metaData.bricksLayeringData);
            } else {
                _v.setBricksLayeringData({
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
                _v.setCableDressingData(rfiData.metaData.cableDressingData);
            } else {
                _v.setCableDressingData({
                    cablesTiedProperly: 'Y',
                    noCableDamaged: 'Y',
                });
            }
            break;
        case TASK_TYPES.CABLE_TRENCH_DRESSING:
            if (rfiData.metaData?.cableTrenchDressingData) {
                _v.setCableTrenchDressingData(
                    rfiData.metaData.cableTrenchDressingData,
                );
            } else {
                _v.setCableTrenchDressingData({
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
                _v.setConduitLayingData(rfiData.metaData.conduitLayingData);
            } else {
                _v.setConduitLayingData({
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
                _v.setCableTrenchExcavationData(
                    rfiData.metaData.cableTrenchExcavationData,
                );
            } else {
                _v.setCableTrenchExcavationData({
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
                _v.setFixingAndInstallationData(
                    rfiData.metaData.fixingAndInstallationData,
                );
            } else {
                _v.setFixingAndInstallationData({
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
        //     _v.setHtPanelInstallationData(
        //       rfiData.metaData.htPanelInstallationData,
        //     );
        //   } else {
        //     _v.setHtPanelInstallationData({
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
                _v.setErectionOfStructureData(
                    rfiData.metaData.erectionOfStructureData,
                );
            } else {
                _v.setErectionOfStructureData({
                    positionChecked: 'Y',
                    weldingDoneAsPerDrawing: 'Y',
                    structureAsPerDrawing: 'Y',
                    necessarySupportProvided: 'Y',
                });
            }
            break;
        case TASK_TYPES.FABRICATION_OF_STRUCTURE:
            if (rfiData.metaData?.fabricationOfStructureData) {
                _v.setFabricationOfStructureData(
                    rfiData.metaData.fabricationOfStructureData,
                );
            } else {
                _v.setFabricationOfStructureData({
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
                _v.setFixingOfPanelsData(rfiData.metaData.fixingOfPanelsData);
            } else {
                _v.setFixingOfPanelsData({
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
                _v.setErectionPreCastColumnData(
                    rfiData.metaData.erectionPreCastColumnData,
                );
            } else {
                _v.setErectionPreCastColumnData({
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
                _v.setErectionOfBusShelterData(
                    rfiData.metaData.erectionOfBusShelterData,
                );
            } else {
                _v.setErectionOfBusShelterData({
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
                _v.setErectionOfAngleSectionData(
                    rfiData.metaData.erectionOfAngleSectionData,
                );
            } else {
                _v.setErectionOfAngleSectionData({
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
                _v.setPreCastRccPanelData(rfiData.metaData.preCastRccPanelData);
            } else {
                _v.setPreCastRccPanelData({
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
                _v.setPlacingChainLinkData(rfiData.metaData.placingChainLinkData);
            } else {
                _v.setPlacingChainLinkData({
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
                _v.setMortarChecklistData(rfiData.metaData.mortarChecklistData);
            } else {
                _v.setMortarChecklistData({
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
                _v.setFlooringData(rfiData.metaData.flooringData);
            } else {
                _v.setFlooringData({
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
                _v.setSignageLocationData(rfiData.metaData.signageLocationData);
            } else {
                _v.setSignageLocationData({
                    drawingApproved: 'Y',
                    locationMarked: 'Y',
                    locationCheckedByEngineer: 'Y',
                    noHindranceInInstallation: 'Y',
                });
            }
            break;
        case TASK_TYPES.BACKFILL:
            if (rfiData.metaData?.backfillData) {
                _v.setBackfillData(rfiData.metaData.backfillData);
            } else {
                _v.setBackfillData({
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
                _v.setPlacementOfSignageSheetData(
                    rfiData.metaData.placementOfSignageSheetData,
                );
            } else {
                _v.setPlacementOfSignageSheetData({
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
                _v.setTrafficImpactAttenuatorsData(
                    rfiData.metaData.trafficImpactAttenuatorsData,
                );
            } else {
                _v.setTrafficImpactAttenuatorsData({
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
                _v.setFixingOfSpringPostData(rfiData.metaData.fixingOfSpringPostData);
            } else {
                _v.setFixingOfSpringPostData({
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
                _v.setFixingOfSolarRoadStudsData(
                    rfiData.metaData.fixingOfSolarRoadStudsData,
                );
            } else {
                _v.setFixingOfSolarRoadStudsData({
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
                _v.setFixingOfSolarBlinkersData(
                    rfiData.metaData.fixingOfSolarBlinkersData,
                );
            } else {
                _v.setFixingOfSolarBlinkersData({
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
                _v.setFixingOfRoadStudsData(rfiData.metaData.fixingOfRoadStudsData);
            } else {
                _v.setFixingOfRoadStudsData({
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
                _v.setFixingOfRoadDelineatorsData(
                    rfiData.metaData.fixingOfRoadDelineatorsData,
                );
            } else {
                _v.setFixingOfRoadDelineatorsData({
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
                _v.setFixingOfObjectMarkersData(
                    rfiData.metaData.fixingOfObjectMarkersData,
                );
            } else {
                _v.setFixingOfObjectMarkersData({
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
                _v.setFixingOfNoiseBarrierData(
                    rfiData.metaData.fixingOfNoiseBarrierData,
                );
            } else {
                _v.setFixingOfNoiseBarrierData({
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
                _v.setFixingOfLEDTrafficBlinkersData(
                    rfiData.metaData.fixingOfLEDTrafficBlinkersData,
                );
            } else {
                _v.setFixingOfLEDTrafficBlinkersData({
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
                _v.setFixingOfHazardMarkersData(
                    rfiData.metaData.fixingOfHazardMarkersData,
                );
            } else {
                _v.setFixingOfHazardMarkersData({
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
                _v.setFixingOfFlexibleMedianMarkersData(
                    rfiData.metaData.fixingOfFlexibleMedianMarkersData,
                );
            } else {
                _v.setFixingOfFlexibleMedianMarkersData({
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
                _v.setFixingOfConvexMirrorsData(
                    rfiData.metaData.fixingOfConvexMirrorsData,
                );
            } else {
                _v.setFixingOfConvexMirrorsData({
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
                _v.setFixingOfAntiglaresData(rfiData.metaData.fixingOfAntiglaresData);
            } else {
                _v.setFixingOfAntiglaresData({
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
                _v.setErectionOfPolesData(rfiData.metaData.erectionOfPolesData);
            } else {
                _v.setErectionOfPolesData({
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
                _v.setFixingOfArmsData(rfiData.metaData.fixingOfArmsData);
            } else {
                _v.setFixingOfArmsData({
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
                _v.setInstallationOfLEDLightsData(
                    rfiData.metaData.installationOfLEDLightsData,
                );
            } else {
                _v.setInstallationOfLEDLightsData({
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
                _v.setLayingOfFlexibleCableData(
                    rfiData.metaData.layingOfFlexibleCableData,
                );
            } else {
                _v.setLayingOfFlexibleCableData({
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
                _v.setLayingOfLTCableData(rfiData.metaData.layingOfLTCableData);
            } else {
                _v.setLayingOfLTCableData({
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
                _v.setFixingOfStoneData(rfiData.metaData.fixingOfStoneData);
            } else {
                _v.setFixingOfStoneData({
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
                _v.setPlasteringData(rfiData.metaData.plasteringData);
            } else {
                _v.setPlasteringData({
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
                _v.setPuttyData(rfiData.metaData.puttyData);
            } else {
                _v.setPuttyData({
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
                _v.setHvacWorkData(rfiData.metaData.hvacWorkData);
            } else {
                _v.setHvacWorkData({
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
                _v.setCeilingWorkData(rfiData.metaData.ceilingWorkData);
            } else {
                _v.setCeilingWorkData({
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
                _v.setFurnitureWorkData(rfiData.metaData.furnitureWorkData);
            } else {
                _v.setFurnitureWorkData({
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
                _v.setDoorWorksData(rfiData.metaData.doorWorksData);
            } else {
                _v.setDoorWorksData({
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
                _v.setWindowWorksData(rfiData.metaData.windowWorksData);
            } else {
                _v.setWindowWorksData({
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
                _v.setGlassWorksData(rfiData.metaData.glassWorksData);
            } else {
                _v.setGlassWorksData({
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
                _v.setElectricalWorkData(rfiData.metaData.electricalWorkData);
            } else {
                _v.setElectricalWorkData({
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
                _v.setPlumbingWorkData(rfiData.metaData.plumbingWorkData);
            } else {
                _v.setPlumbingWorkData({
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
                _v.setFlooringWorkData(rfiData.metaData.flooringWorkData);
            } else {
                _v.setFlooringWorkData({
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
                _v.setExcavationOfTrenchData(rfiData.metaData.excavationOfTrenchData);
            } else {
                _v.setExcavationOfTrenchData({
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
                _v.setLayingOfDuctData(rfiData.metaData.layingOfDuctData);
            } else {
                _v.setLayingOfDuctData({
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
                _v.setHddCrossingData(rfiData.metaData.hddCrossingData);
            } else {
                _v.setHddCrossingData({
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
                _v.setConstructionOfChamberData(
                    rfiData.metaData.constructionOfChamberData,
                );
            } else {
                _v.setConstructionOfChamberData({
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
                _v.setInstallationOfEquipmentData(
                    rfiData.metaData.installationOfEquipmentData,
                );
            } else {
                _v.setInstallationOfEquipmentData({
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
                _v.setInstallationOfSolarSystemData(
                    rfiData.metaData.installationOfSolarSystemData,
                );
            } else {
                _v.setInstallationOfSolarSystemData({
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
                _v.setInstallationOfNetworkDevicesData(
                    rfiData.metaData.installationOfNetworkDevicesData,
                );
            } else {
                _v.setInstallationOfNetworkDevicesData({
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
                _v.setConstructionOfFoundationData(
                    rfiData.metaData.constructionOfFoundationData,
                );
            } else {
                _v.setConstructionOfFoundationData({
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
                _v.setFoundationData(rfiData.metaData.foundationData);
            } else {
                _v.setFoundationData([]);
            }
            break;
        case TASK_TYPES.CASTING_OF_BALLAST:
            if (rfiData.metaData?.castingOfBallastData) {
                _v.setCastingOfBallastData(rfiData.metaData.castingOfBallastData);
            } else {
                _v.setCastingOfBallastData({
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
                _v.setBallastData(rfiData.metaData.ballastData);
            } else {
                _v.setBallastData([]);
            }
            break;
        case TASK_TYPES.SAND_LAYER:
            if (rfiData.metaData?.sandLayerData) {
                _v.setSandLayerData(rfiData.metaData.sandLayerData);
            } else {
                _v.setSandLayerData({
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
                _v.setLiftingCombinedLRData(rfiData.metaData?.liftingCombinedLRData);
            } else {
                _v.setLiftingCombinedLRData({
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
                _v.setPrestressingData(rfiData.metaData.prestressingData);
            } else {
                const prestressingCablesDetails =
                _v.selectedTask.taskDetailsData[0]?.details
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
                _v.setPrestressingData(array);
            }
            break;
        default:
            break;
    }
    //}

    if (rfiData.rfiSubmitDateTime) {
        _v.setRFIDate(getDbDate(rfiData.rfiSubmitDateTime));

        const time = getDisplayTime(rfiData.rfiSubmitDateTime);
    }

    if (rfiData.comments) {
        _v.setComments(rfiData.comments);
    }
    _v.setOpenPopup(true);
}