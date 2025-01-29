import { TASK_TYPES } from "../../../../../constants/constants";
import { validateBackfillData, validateBackfillingData, validateBallastData, validateBoringOfDiaphragmData, validateBoringOfPileData, validateBricksLayeringData, validateBricksWorkData, validateCableTrenchDressingData, validateCableTrenchExcavationData, validateCastingOfBallastData, validateCeilingWorkData, validateChippingAndRemovalData, validateChuteMembersData, validateCompactionData, validateConcreteData, validateConduitLayingData, validateConstructionOfChamberData, validateConstructionOfFoundationData, validateCuringData, validateCuttingOfJointsData, validateCuttingOfSoilData, validateDumpingData, validateElectricalWorkData, validateErectionOfAngleSectionData, validateErectionOfBusShelterData, validateErectionOfDoublePoleStructureData, validateErectionOfPolesData, validateErectionPreCastColumnData, validateExcavationOfTrenchData, validateFixingAndInstallationData, validateFixingGeoCellData, validateFixingOfAntiglaresData, validateFixingOfArmsData, validateFixingOfConvexMirrorsData, validateFixingOfFlexibleMedianMarkersData, validateFixingOfHazardMarkersData, validateFixingOfLEDTrafficBlinkersData, validateFixingOfMeshData, validateFixingOfMetalBeamData, validateFixingOfMMSData, validateFixingOfModulesData, validateFixingOfNoiseBarrierData, validateFixingOfObjectMarkersData, validateFixingOfPanelsData, validateFixingOfRoadDelineatorsData, validateFixingOfRoadStudsData, validateFixingOfSolarBlinkersData, validateFixingOfSolarRoadStudsData, validateFixingOfSpringPostData, validateFixingOfStoneData, validateFixingVerticalPostData, validateFlooringData, validateFlooringWorkData, validateFlushingOperationsData, validateFoundationData, validateGlassWorksData, validateGlueingData, validateGroutingData, validateHddCrossingData, validateHvacWorkData, validateInstallationOfEquipmentData, validateInstallationOfLEDLightsData, validateInstallationOfNetworkDevicesData, validateInstallationOfSolarSystemData, validateInverterInstallationData, validateLayingAndCompactionData, validateLayingCautionTapeData, validateLayingOfDLCData, validateLayingOfDlcData, validateLayingOfDuctData, validateLayingOfFlexibleCableData, validateLayingOfGrassTurfData, validateLayingOfLTCableData, validateLayingOfPaverBlockData, validateLayingOfPQCData, validateLayingOfSeparationMembraneData, validateLayingOfTopSoilData, validateMillingData, validateMortarChecklistData, validatePlacementOfSignageSheetData, validatePlacingChainLinkData, validatePlacingOfDowelData, validatePlacingOfFillerBoardData, validatePlantationData, validatePlantingTreesData, validatePlasteringData, validatePlumbingWorkData, validatePreCastRccPanelData, validatePreparationOfSoilData, validatePrestressingData, validateProcurementOfSteelData, validatePuttyData, validateRouteMarkingData, validateSandLayerData, validateSealantFilingData, validateStonePitchingData, validateStrippingAndStoringTopSoilData, validateTemporaryPrestressingData, validateTexturingData, validateTrafficImpactAttenuatorsData, validateTransportationData, validateWateringData } from "./Validates";
import { applicationOfFilterMediaData, assemblingOfTrussData, autoLaunchingData, backfillingData, barBendingScheduleChecked, boringOfDiaphragmData, boringOfPileData, bricksWorkData, chippingAndRemovalOfConcreteData, chuteMembersData, cleanliness, compactionData, concreteData, concreteFinishLevelMarked, concreteHasAchievedDesiredStrength, couplerArrangementsWithinTolerance, curingData, cuttingOfJointsData, cuttingOfSoilData, deStressingOfGirderData, dumpingData, dumpingOfSoilData, erectionData, erectionOfColumnsData, erectionOfFaciaPanelsData, erectionOfFrictionSlabData, erectionOfTemporaryStructure, erectionUsingCranesData, fixingGeoCellData, fixingOfBearingData, fixingOfBracingsData, fixingOfGeoGridData, fixingOfMeshData, fixingOfMetalBeamData, fixingOfRailingData, fixingOfSheathingJointsData, fixingOfWireRopeData, fixingShutterData, fixingVerticalPostData, flushingOperationsData, formworkAlignmentChecked, formworkdDrawingsChecked, formworkFitConcreting, formworkProperlySupported, formworkSealingChecked, glueingData, groutingData, hackingOfGirderData, imageObject, installationOfExpansionJointData, layingAndCompactionData, layingOfDLCData, layingOfDlcTableData, layingOfGrassTurfData, layingOfPaverBlockData, layingOfPQCData, layingOfSeparationMembraneData, layingOfTopSoilData, machineCuttingData, millingData, minimumTimeHasBeenAttained, noLBendBottomOfTheCageChecked, paintingData, paintingOfSteelGirdersDiaphragms, pipeLayingAndJointingData, pitExcavationData, placementOfReinforcementCage, placingOfDowelData, placingOfFillerBoardData, placingOfTieBarData, plieShaftCleanedLooseMaterial, primeCoatData, procurementOfSheetData, procurementOfSteelData, quantity, rebarAndDimensionGFC, rebarsSecurelyTightened, rebarWithinToleranceLimit, removalOfTemporaryStructureData, roadMarkingData, sealantFilingData, selectedTask, shapingNoAndLengthOfBarsGFC, showSnackbar, spacerBarCheckedGFC, spliceLengthAndLocationGFC, spreadingAndCompactionData, stackingInYardData, stitchConcreteData, strippingAndStoringTopSoilData, suitableSpacerProvidedToMaintainCoverToSteel, texturingData, torquingData, transportationData, transportationOfSteelGirdersDiaphragms, validatePipeLayingAndJointingData, removalFormworkData, plantingGrassData, plantingTreesData, preparationOfSoilData, spreadingOfGrassSeedsData, wateringData, plantationData, stonePitchingData, inverterInstallationData, erectionOfDoublePoleStructureData, fixingOfMC4Data, fixingOfMMSData, fixingOfModulesData, layingCautionTapeData, routeMarkingData, bricksLayeringData, cableDressingData, cableTrenchDressingData, conduitLayingData, cableTrenchExcavationData, fixingAndInstallationData, erectionOfStructureData, fabricationOfStructureData, fixingOfPanelsData, erectionPreCastColumnData, erectionOfBusShelterData, erectionOfAngleSectionData, preCastRccPanelData, placingChainLinkData, mortarChecklistData, flooringData, signageLocationData, backfillData, placementOfSignageSheetData, trafficImpactAttenuatorsData, fixingOfSpringPostData, fixingOfSolarRoadStudsData, fixingOfSolarBlinkersData, fixingOfRoadStudsData, fixingOfRoadDelineatorsData, fixingOfObjectMarkersData, fixingOfNoiseBarrierData, fixingOfLEDTrafficBlinkersData, fixingOfHazardMarkersData, fixingOfFlexibleMedianMarkersData, fixingOfConvexMirrorsData, fixingOfAntiglaresData, erectionOfPolesData, fixingOfArmsData, installationOfLEDLightsData, layingOfFlexibleCableData, layingOfLTCableData, fixingOfStoneData, plasteringData, puttyData, hvacWorkData, ceilingWorkData, furnitureWorkData, doorWorksData, windowWorksData, glassWorksData, electricalWorkData, plumbingWorkData, flooringWorkData, excavationOfTrenchData, layingOfDuctData, hddCrossingData, constructionOfChamberData, installationOfEquipmentData, installationOfSolarSystemData, installationOfNetworkDevicesData, constructionOfFoundationData, foundationData, castingOfBallastData, ballastData, sandLayerData, liftingCombinedLRData, fabricationData, temporaryPrestressingData, prestressingData } from "./Variables";

export const onFillChecklistData = (checkList: any) => {
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
        case TASK_TYPES.CONSTRUCTION_OF_CONTROL_ROOM:
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
          if (!validateDumpingData(torquingData)) {
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
          if (!validateLayingOfGrassTurfData(plantingGrassData)) {
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
          if (!validateFixingOfMeshData(fixingOfMC4Data)) {
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
        // case TASK_TYPES.HT_PANEL_INSTALLATION:
        //   if (!validateHtPanelInstallationData(htPanelInstallationData)) {
        //     return;
        //   }
        //   checkList = {
        //     taskName: selectedTask.name,
        //     htPanelInstallationData: htPanelInstallationData,
        //   };
        //   break;
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
        case TASK_TYPES.ELECTRICAL_WORK:
          if (!validateElectricalWorkData(electricalWorkData)) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            electricalWorkData: electricalWorkData,
          };
          break;
        case TASK_TYPES.PLUMBING_WORK:
          if (!validatePlumbingWorkData(plumbingWorkData)) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            plumbingWorkData: plumbingWorkData,
          };
          break;
        case TASK_TYPES.FLOORING_WORK:
          if (!validateFlooringWorkData(flooringWorkData)) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            flooringWorkData: flooringWorkData,
          };
          break;
        case TASK_TYPES.EXCAVATION_OF_TRENCH:
          if (!validateExcavationOfTrenchData(excavationOfTrenchData)) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            excavationOfTrenchData: excavationOfTrenchData,
          };
          break;
        case TASK_TYPES.LAYING_OF_DUCT:
          if (!validateLayingOfDuctData(layingOfDuctData)) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            layingOfDuctData: layingOfDuctData,
          };
          break;
        case TASK_TYPES.HDD_CROSSING:
          if (!validateHddCrossingData(hddCrossingData)) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            hddCrossingData: hddCrossingData,
          };
          break;
        case TASK_TYPES.CONSTRUCTION_OF_CHAMBER:
          if (!validateConstructionOfChamberData(constructionOfChamberData)) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            constructionOfChamberData: constructionOfChamberData,
          };
          break;
        case TASK_TYPES.INSTALLATION_OF_EQUIPMENT:
          if (!validateInstallationOfEquipmentData(installationOfEquipmentData)) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            installationOfEquipmentData: installationOfEquipmentData,
          };
          break;
        case TASK_TYPES.INSTALLATION_OF_SOLAR_SYSTEM:
          if (
            !validateInstallationOfSolarSystemData(installationOfSolarSystemData)
          ) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            installationOfSolarSystemData: installationOfSolarSystemData,
          };
          break;
        case TASK_TYPES.INSTALLATION_OF_NETWORK_DEVICES:
          if (
            !validateInstallationOfNetworkDevicesData(
              installationOfNetworkDevicesData,
            )
          ) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            installationOfNetworkDevicesData: installationOfNetworkDevicesData,
          };
          break;
        case TASK_TYPES.CONSTRUCTION_OF_FOUNDATION:
          if (
            !validateConstructionOfFoundationData(constructionOfFoundationData)
          ) {
            return;
          }
          if (!validateFoundationData(foundationData)) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            constructionOfFoundationData: constructionOfFoundationData,
            foundationData: foundationData,
          };
          break;
        case TASK_TYPES.CASTING_OF_BALLAST:
          if (!validateCastingOfBallastData(castingOfBallastData)) {
            return;
          }
          if (!validateBallastData(ballastData)) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            castingOfBallastData: castingOfBallastData,
            ballastData: ballastData,
          };
          break;
        case TASK_TYPES.SAND_LAYER:
          if (!validateSandLayerData(sandLayerData)) {
            return;
          }
          checkList = {
            taskName: selectedTask.name,
            sandLayerData: sandLayerData,
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
};