import { TASK_TYPES } from "../../../../../constants/constants";
import { Validates } from "./Validates";

export const onFillChecklistData = (_v: any, checkList: any) => { 
  const _valdation = Validates(_v);
  const showSnackbar = _v.showSnackbar;
    switch (_v.selectedTask?.name) {
        case TASK_TYPES.CNG_AND_SETTING_OUT:
        case TASK_TYPES.PLACING_OF_SHEATHING_DUCT:
        case TASK_TYPES.POST_CONCRETE_CHECK:
        case TASK_TYPES.FIXING_OF_BEARING_SLEEVES:
          if (!_v.imageObject?.fileData) {
            showSnackbar('Please upload an image file', 'error');
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            base64Image: _v.imageObject.fileData,
          };
          break;
        case TASK_TYPES.FORM_WORK:
        case TASK_TYPES.PLACEMENT_OF_INNER_SHUTTERS:
        case TASK_TYPES.PLACEMENT_OF_SIDE_SHUTTERS:
        case TASK_TYPES.PLACEMENT_OF_BOTTOM_SHUTTER:
        case TASK_TYPES.PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER:
          checkList = {
            taskName: _v.selectedTask.name,
            cleanliness: _v.cleanliness,
            formworkAlignmentChecked: _v.formworkAlignmentChecked,
            formworkSealingChecked: _v.formworkSealingChecked,
            formworkdDrawingsChecked: _v.formworkdDrawingsChecked,
            concreteFinishLevelMarked: _v.concreteFinishLevelMarked,
            formworkProperlySupported: _v.formworkProperlySupported,
            formworkFitConcreting: _v.formworkFitConcreting,
          };
          break;
        case TASK_TYPES.REINFORCEMENT_PREPARATION:
        case TASK_TYPES.REINFORCEMENT:
          checkList = {
            taskName: _v.selectedTask.name,
            rebarAndDimensionGFC: _v.rebarAndDimensionGFC,
            shapingNoAndLengthOfBarsGFC: _v.shapingNoAndLengthOfBarsGFC,
            rebarsSecurelyTightened: _v.rebarsSecurelyTightened,
            spliceLengthAndLocationGFC: _v.spliceLengthAndLocationGFC,
            rebarWithinToleranceLimit: _v.rebarWithinToleranceLimit,
            couplerArrangementsWithinTolerance:
            _v.couplerArrangementsWithinTolerance,
            barBendingScheduleChecked: _v.barBendingScheduleChecked,
            spacerBarCheckedGFC: _v.spacerBarCheckedGFC,
          };
          break;
        case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
          checkList = {
            taskName: _v.selectedTask.name,
            rebarAndDimensionGFC: _v.rebarAndDimensionGFC,
            shapingNoAndLengthOfBarsGFC: _v.shapingNoAndLengthOfBarsGFC,
            rebarsSecurelyTightened: _v.rebarsSecurelyTightened,
            spliceLengthAndLocationGFC: _v.spliceLengthAndLocationGFC,
            rebarWithinToleranceLimit: _v.rebarWithinToleranceLimit,
            couplerArrangementsWithinTolerance:
            _v.couplerArrangementsWithinTolerance,
            barBendingScheduleChecked: _v.barBendingScheduleChecked,
          };
          break;
        case TASK_TYPES.EXCAVATION:
          checkList = {
            taskName: _v.selectedTask.name,
            quantity: _v.quantity,
          };
          break;
        case TASK_TYPES.REMOVAL_OF_SIDE_SHUTTERS:
        case TASK_TYPES.REMOVAL_OF_MIDDLIE_TOP_SHUTTERS:
        case TASK_TYPES.REMOVAL_OF_INNER_SHUTTERS:
        case TASK_TYPES.REMOVAL_OF_SHUTTER:
        case TASK_TYPES.REMOVAL_OF_SHUTTERS:
          checkList = {
            taskName: _v.selectedTask.name,
            concreteHasAchievedDesiredStrength:
            _v.concreteHasAchievedDesiredStrength,
            minimumTimeHasBeenAttained: _v.minimumTimeHasBeenAttained,
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
            taskName: _v.selectedTask.name,
          };
          break;
        case TASK_TYPES.CAGE_LOWERING:
          checkList = {
            taskName: _v.selectedTask.name,
            plieShaftCleanedLooseMaterial: _v.plieShaftCleanedLooseMaterial,
            suitableSpacerProvidedToMaintainCoverToSteel:
            _v.suitableSpacerProvidedToMaintainCoverToSteel,
            noLBendBottomOfTheCageChecked: _v.noLBendBottomOfTheCageChecked,
          };
          break;
        case TASK_TYPES.BORING_OF_PILE:
          if (!_valdation.validateBoringOfPileData(_v.boringOfPileData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            boringOfPileData: {
              densityOfPolymer: Number(_v.boringOfPileData.densityOfPolymer),
              viscosityOfPolymer: Number(_v.boringOfPileData.viscosityOfPolymer),
              valueOfPolymer: Number(_v.boringOfPileData.valueOfPolymer),
              contentOfPolymer: Number(_v.boringOfPileData.contentOfPolymer),
              depthOfBore: Number(_v.boringOfPileData.depthOfBore),
            },
          };
          break;
        case TASK_TYPES.FLUSHING_OPERATIONS:
          if (!_valdation.validateFlushingOperationsData(_v.flushingOperationsData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            flushingOperationsData: {
              startTimeOfFlushing: _v.flushingOperationsData.startTimeOfFlushing,
              finishTimeOfFlushing: _v.flushingOperationsData.finishTimeOfFlushing,
              whetherPourCleared: _v.flushingOperationsData.whetherPourCleared,
              densityOfPolymer: Number(_v.flushingOperationsData.densityOfPolymer),
              viscosityOfPolymer: Number(
                _v.flushingOperationsData.viscosityOfPolymer,
              ),
              valueOfPolymer: Number(_v.flushingOperationsData.valueOfPolymer),
              contentOfPolymer: Number(_v.flushingOperationsData.contentOfPolymer),
              depthOfBore: Number(_v.flushingOperationsData.depthOfBore),
            },
          };
          break;
        case TASK_TYPES.CHIPPING_AND_REMOVAL_OF_CONCRETE_ABOVE_CUT_OFF_LEVEL:
          if (!_valdation.validateChippingAndRemovalData(_v.chippingAndRemovalOfConcreteData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            chippingAndRemovalOfConcreteData: {
              noOfDaysOfChipping: Number(
                _v.chippingAndRemovalOfConcreteData.noOfDaysOfChipping,
              ),
            },
          };
          break;
        case TASK_TYPES.STITCH_CONCRETE:
          if (!_valdation.validateConcreteData(_v.selectedTask?.name)) {
            return;
          }
          _v.concreteData.forEach((item: any) => {
            delete item.key;
            if (_v.selectedTask.name === TASK_TYPES.CONCRETING) {
              item.concreteTemp = Number(item.concreteTemp);
              item.slumpValue = Number(item.slumpValue);
            } else {
              delete item.concreteTemp;
              delete item.slumpValue;
            }
            item.concretePoured = Number(item.concretePoured);
          });
          checkList = {
            taskName: _v.selectedTask.name,
            stitchConcreteData: _v.stitchConcreteData,
            concreteData: _v.concreteData,
          };
          break;
        case TASK_TYPES.COPING:
        case TASK_TYPES.CONCRETING:
        case TASK_TYPES.PCC_LEVELLING_COURSE:
          const isDataValid = _valdation.validateConcreteData(_v.selectedTask?.name);
          if (!isDataValid) {
            return;
          }
          _v.concreteData.forEach((item: any) => {
            delete item.key;
            if (_v.selectedTask.name === TASK_TYPES.CONCRETING) {
              item.concreteTemp = Number(item.concreteTemp);
              item.slumpValue = Number(item.slumpValue);
            } else {
              delete item.concreteTemp;
              delete item.slumpValue;
            }
            item.concretePoured = Number(item.concretePoured);
          });
          checkList = {
            taskName: _v.selectedTask.name,
            concreteData: _v.concreteData,
          };
          break;
        case TASK_TYPES.DUMPING:
          if (!_valdation.validateDumpingData(_v.dumpingData)) {
            return;
          }
  
          checkList = {
            taskName: _v.selectedTask.name,
            dumpingData: _v.dumpingData,
          };
          break;
        case TASK_TYPES.GLUEING:
          if (!_valdation.validateGlueingData(_v.glueingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            glueingData: _v.glueingData,
          };
          break;
        case TASK_TYPES.TORQUING:
          if (!_valdation.validateDumpingData(_v.torquingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            torquingData: _v.torquingData,
          };
          break;
  
        case TASK_TYPES.GROUTING:
          if (!_valdation.validateGroutingData(_v.groutingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            groutingData: _v.groutingData,
          };
        case TASK_TYPES.PAINTING_OF_STEEL_GIRDERS_DIAPHRAGMS:
          checkList = {
            taskName: _v.selectedTask.name,
            paintingOfSteelGirdersDiaphragms: _v.paintingOfSteelGirdersDiaphragms,
          };
          break;
  
        case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
          checkList = {
            taskName: _v.selectedTask.name,
            placementOfReinforcementCage: _v.placementOfReinforcementCage,
          };
          break;
  
        case TASK_TYPES.TRANSPORTATION_OF_STEEL_GIRDERS_DIAPHRAGMS_ERECTION_AT_SITE:
          checkList = {
            taskName: _v.selectedTask.name,
            transportationOfSteelGirdersDiaphragms:
            _v.transportationOfSteelGirdersDiaphragms,
          };
          break;
  
        case TASK_TYPES.CURING:
          if (!_valdation.validateCuringData(_v.curingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            curingData: _v.curingData,
          };
          break;
  
        case TASK_TYPES.FIXING_OF_SHUTTER:
          checkList = {
            taskName: _v.selectedTask.name,
            fixingShutterData: _v.fixingShutterData,
          };
          break;
  
        case TASK_TYPES.ERECTION_OF_TEMPORARY_STRUCTURE:
          checkList = {
            taskName: _v.selectedTask.name,
            erectionOfTemporaryStructure: _v.erectionOfTemporaryStructure,
          };
          break;
        case TASK_TYPES.ERECTION_USING_CRANES:
          checkList = {
            taskName: _v.selectedTask.name,
            erectionUsingCranesData: _v.erectionUsingCranesData,
          };
          break;
        case TASK_TYPES.STACKING_IN_YARD:
          checkList = {
            taskName: _v.selectedTask.name,
            stackingInYardData: _v.stackingInYardData,
          };
          break;
  
        case TASK_TYPES.ASSEMBLING_OF_TRUSS:
          checkList = {
            taskName: _v.selectedTask.name,
            assemblingOfTrussData: _v.assemblingOfTrussData,
          };
          break;
        case TASK_TYPES.HACKING_OF_GIRDER:
          checkList = {
            taskName: _v.selectedTask.name,
            hackingOfGirderData: _v.hackingOfGirderData,
          };
          break;
        case TASK_TYPES.DE_STRESSING_OF_GIRDER:
          checkList = {
            taskName: _v.selectedTask.name,
            deStressingOfGirderData: _v.deStressingOfGirderData,
          };
          break;
        case TASK_TYPES.FIXING_OF_BEARING:
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfBearingData: _v.fixingOfBearingData,
          };
          break;
        case TASK_TYPES.REMOVAL_OF_TEMPORARY_STRUCTURE:
          checkList = {
            taskName: _v.selectedTask.name,
            removalOfTemporaryStructureData: _v.removalOfTemporaryStructureData,
          };
          break;
        case TASK_TYPES.INSTALLATION_OF_EXPANSION_JOINT:
          checkList = {
            taskName: _v.selectedTask.name,
            installationOfExpansionJointData: _v.installationOfExpansionJointData,
          };
          break;
        case TASK_TYPES.PAINTING:
          checkList = {
            taskName: _v.selectedTask.name,
            paintingData: _v.paintingData,
          };
          break;
        case TASK_TYPES.AUTO_LAUNCHING:
          checkList = {
            taskName: _v.selectedTask.name,
            autoLaunchingData: _v.autoLaunchingData,
          };
          break;
        case TASK_TYPES.PROCUREMENT_OF_STRUCTURAL_STEEL:
          if (!_valdation.validateProcurementOfSteelData(_v.procurementOfSteelData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            procurementOfSteelData: _v.procurementOfSteelData,
          };
          break;
  
        case TASK_TYPES.TRANSPORTATION_OF_MATERIAL:
          if (!_valdation.validateTransportationData(_v.transportationData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            transportationData: _v.transportationData,
          };
          break;
        case TASK_TYPES.FIXING_OF_SHEATHING_JOINTS:
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfSheathingJointsData: _v.fixingOfSheathingJointsData,
          };
          break;
        case TASK_TYPES.FIXING_OF_GEO_GRID:
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfGeoGridData: _v.fixingOfGeoGridData,
          };
          break;
        case TASK_TYPES.ERECTION_OF_FRICTION_SLAB:
          checkList = {
            taskName: _v.selectedTask.name,
            erectionOfFrictionSlabData: _v.erectionOfFrictionSlabData,
          };
          break;
        case TASK_TYPES.ERECTION_OF_FACIA_PANELS:
          checkList = {
            taskName: _v.selectedTask.name,
            erectionOfFaciaPanelsData: _v.erectionOfFaciaPanelsData,
          };
          break;
        case TASK_TYPES.ERECTION_OF_COLUMNS:
          checkList = {
            taskName: _v.selectedTask.name,
            erectionOfColumnsData: _v.erectionOfColumnsData,
          };
          break;
        case TASK_TYPES.APPLICATION_OF_FILTER_MEDIA:
          checkList = {
            taskName: _v.selectedTask.name,
            applicationOfFilterMediaData: _v.applicationOfFilterMediaData,
          };
          break;
        case TASK_TYPES.FIXING_OF_BRACINGS:
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfBracingsData: _v.fixingOfBracingsData,
          };
          break;
        case TASK_TYPES.FIXING_OF_RAILING:
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfRailingData: _v.fixingOfRailingData,
          };
          break;
        case TASK_TYPES.PROCUREMENT_OF_SHEET:
          checkList = {
            taskName: _v.selectedTask.name,
            procurementOfSheetData: {
              totalSheetPurchased: Number(
                _v.procurementOfSheetData.totalSheetPurchased,
              ),
            },
          };
          break;
        case TASK_TYPES.DUMPING_OF_SOIL:
          checkList = {
            taskName: _v.selectedTask.name,
            dumpingOfSoilData: _v.dumpingOfSoilData,
          };
          break;
        case TASK_TYPES.BORING_OF_DIAPHRAGM:
          if (!_valdation.validateBoringOfDiaphragmData(_v.boringOfDiaphragmData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            boringOfDiaphragmData: _v.boringOfDiaphragmData,
          };
          break;
        case TASK_TYPES.ERECTION:
          checkList = {
            taskName: _v.selectedTask.name,
            erectionData: _v.erectionData,
          };
          break;
        case TASK_TYPES.STRIPPING_AND_STORING_TOP_SOIL:
          if (
            !_valdation.validateStrippingAndStoringTopSoilData(
              _v.strippingAndStoringTopSoilData,
            )
          ) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            strippingAndStoringTopSoilData: {
              topSoilCollectedStored: Number(
                _v. strippingAndStoringTopSoilData.topSoilCollectedStored,
              ), // Ensuring it's a number
            },
          };
          break;
        case TASK_TYPES.ROAD_MARKING:
          checkList = {
            taskName: _v.selectedTask.name,
            roadMarkingData: _v.roadMarkingData,
          };
          break;
        case TASK_TYPES.PRIME_COAT:
        case TASK_TYPES.TACK_COAT:
          checkList = {
            taskName: _v.selectedTask.name,
            primeCoatData: _v.primeCoatData,
          };
          break;
        case TASK_TYPES.SPREADING_AND_COMPACTION:
          checkList = {
            taskName: _v.selectedTask.name,
            spreadingAndCompactionData: _v.spreadingAndCompactionData,
          };
          break;
        case TASK_TYPES.LAYING_AND_COMPACTION:
          if (!_valdation.validateLayingAndCompactionData(_v.layingAndCompactionData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            layingAndCompactionData: _v.layingAndCompactionData,
          };
          break;
        case TASK_TYPES.PIPE_LAYING_AND_JOINTING:
          if (!_valdation.validatePipeLayingAndJointingData(_v.pipeLayingAndJointingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            pipeLayingAndJointingData: _v.pipeLayingAndJointingData,
          };
          break;
        case TASK_TYPES.FIXING_OF_METAL_BEAM:
          if (!_valdation.validateFixingOfMetalBeamData(_v.fixingOfMetalBeamData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfMetalBeamData: _v.fixingOfMetalBeamData,
          };
          break;
        case TASK_TYPES.FIXING_VERTICAL_POST:
          if (!_valdation.validateFixingVerticalPostData(_v.fixingVerticalPostData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingVerticalPostData: _v.fixingVerticalPostData,
          };
          break;
  
        case TASK_TYPES.CUTTING_OF_JOINTS:
          if (!_valdation.validateCuttingOfJointsData(_v.cuttingOfJointsData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            cuttingOfJointsData: _v.cuttingOfJointsData,
          };
          break;
        case TASK_TYPES.LAYING_OF_PAVER_BLOCK:
          if (!_valdation.validateLayingOfPaverBlockData(_v.layingOfPaverBlockData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            layingOfPaverBlockData: _v.layingOfPaverBlockData,
          };
          break;
        case TASK_TYPES.LAYING_OF_DLC:
          if (!_valdation.validateLayingOfDlcData(_v.layingOfDlcTableData)) {
            return;
          }
          if (!_valdation.validateLayingOfDLCData(_v.layingOfDLCData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            layingOfDLCData: _v.layingOfDLCData,
            layingOfDlcTableData: _v.layingOfDlcTableData,
          };
          break;
        case TASK_TYPES.MACHINE_CUTTING_OF_JOINTS:
          checkList = {
            taskName: _v.selectedTask.name,
            machineCuttingData: _v.machineCuttingData,
          };
          break;
        case TASK_TYPES.PLACING_OF_TIE_BAR:
          checkList = {
            taskName: _v.selectedTask.name,
            placingOfTieBarData: _v.placingOfTieBarData,
          };
          break;
        case TASK_TYPES.FIXING_OF_WIRE_ROPE:
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfWireRopeData: _v.fixingOfWireRopeData,
          };
          break;
        case TASK_TYPES.TEXTURING:
          if (!_valdation.validateTexturingData(_v.texturingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            texturingData: _v.texturingData,
          };
          break;
        case TASK_TYPES.PLACING_OF_DOWEL:
          if (!_valdation.validatePlacingOfDowelData(_v.placingOfDowelData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            placingOfDowelData: _v.placingOfDowelData,
          };
          break;
        case TASK_TYPES.COMPACTION:
          if (!_valdation.validateCompactionData(_v.compactionData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            compactionData: _v.compactionData,
          };
          break;
        case TASK_TYPES.PLACING_OF_FILLER_BOARD:
          if (!_valdation.validatePlacingOfFillerBoardData(_v.placingOfFillerBoardData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            placingOfFillerBoardData: _v.placingOfFillerBoardData,
          };
          break;
        case TASK_TYPES.SEALANT_FILING:
          if (!_valdation.validateSealantFilingData(_v.sealantFilingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            sealantFilingData: _v.sealantFilingData,
          };
          break;
        case TASK_TYPES.MILLING_OF_FLEXIBLE_PAVEMENT:
          if (!_valdation.validateMillingData(_v.millingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            millingData: _v.millingData,
          };
          break;
        case TASK_TYPES.LAYING_OF_SEPARATION_MEMBRANE:
          if (
            !_valdation.validateLayingOfSeparationMembraneData(
              _v.layingOfSeparationMembraneData,
            )
          ) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            layingOfSeparationMembraneData: _v.layingOfSeparationMembraneData,
          };
          break;
        case TASK_TYPES.LAYING_OF_PAVEMENT_QUALITY_CONCRETE:
          if (!_valdation.validateLayingOfPQCData(_v.layingOfPQCData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            layingOfPQCData: _v.layingOfPQCData,
          };
          break;
        case TASK_TYPES.BACKFILLING:
          if (!_valdation.validateBackfillingData(_v.backfillingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            backfillingData: _v.backfillingData,
          };
          break;
        case TASK_TYPES.BRICKS_WORK:
          if (!_valdation.validateBricksWorkData(_v.bricksWorkData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            bricksWorkData: _v.bricksWorkData,
          };
          break;
        case TASK_TYPES.CUTTING_OF_SOIL:
          if (!_valdation.validateCuttingOfSoilData(_v.cuttingOfSoilData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            cuttingOfSoilData: _v.cuttingOfSoilData,
          };
          break;
        case TASK_TYPES.FIXING_GEO_CELL:
          if (!_valdation.validateFixingGeoCellData(_v.fixingGeoCellData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingGeoCellData: _v.fixingGeoCellData,
          };
          break;
        case TASK_TYPES.FIXING_OF_MESH:
          if (!_valdation.validateFixingOfMeshData(_v.fixingOfMeshData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfMeshData: _v.fixingOfMeshData,
          };
          break;
        case TASK_TYPES.LAYING_OF_GRASS_TURF:
          if (!_valdation.validateLayingOfGrassTurfData(_v.layingOfGrassTurfData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            layingOfGrassTurfData: _v.layingOfGrassTurfData,
          };
          break;
        case TASK_TYPES.LAYING_OF_TOP_SOIL:
          if (!_valdation.validateLayingOfTopSoilData(_v.layingOfTopSoilData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            layingOfTopSoilData: _v.layingOfTopSoilData,
          };
          break;
        case TASK_TYPES.PLACING_AND_JOINTING_OF_CHUTE_MEMBERS:
          if (!_valdation.validateChuteMembersData(_v.chuteMembersData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            chuteMembersData: _v.chuteMembersData,
          };
          break;
        case TASK_TYPES.PIT_EXCAVATION:
          checkList = {
            taskName: _v.selectedTask.name,
            pitExcavationData: _v.pitExcavationData,
          };
          break;
        case TASK_TYPES.PLANTING_GRASS:
          if (!_valdation.validateLayingOfGrassTurfData(_v.plantingGrassData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            plantingGrassData: _v.plantingGrassData,
          };
          break;
        case TASK_TYPES.PLANTING_TREES:
          if (!_valdation.validatePlantingTreesData(_v.plantingTreesData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            plantingTreesData: _v.plantingTreesData,
          };
          break;
        case TASK_TYPES.PREPARATION_OF_SOIL:
          if (!_valdation.validatePreparationOfSoilData(_v.preparationOfSoilData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            preparationOfSoilData: _v.preparationOfSoilData,
          };
          break;
        case TASK_TYPES.SPREADING_OF_GRASS_SEEDS:
          checkList = {
            taskName: _v.selectedTask.name,
            spreadingOfGrassSeedsData: _v.spreadingOfGrassSeedsData,
          };
          break;
        case TASK_TYPES.WATERING:
          if (!_valdation.validateWateringData(_v.wateringData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            wateringData: _v.wateringData,
          };
          break;
        case TASK_TYPES.PLANTATION:
          if (!_valdation.validatePlantationData(_v.plantationData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            plantationData: _v.plantationData,
          };
          break;
        case TASK_TYPES.STONE_PITCHING:
          if (!_valdation.validateStonePitchingData(_v.stonePitchingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            stonePitchingData: _v.stonePitchingData,
          };
          break;
        case TASK_TYPES.FIXING_INVERTER_INSTALLATION:
          if (!_valdation.validateInverterInstallationData(_v.inverterInstallationData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            inverterInstallationData: _v.inverterInstallationData,
          };
          break;
        case TASK_TYPES.ERECTION_OF_DOUBLE_POLE_STRUCTURE:
          if (
            !_valdation.validateErectionOfDoublePoleStructureData(
              _v.erectionOfDoublePoleStructureData,
            )
          ) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            erectionOfDoublePoleStructureData: _v.erectionOfDoublePoleStructureData,
          };
          break;
        case TASK_TYPES.FIXING_OF_MC4_Y_CONNECTOR:
          if (!_valdation.validateFixingOfMeshData(_v.fixingOfMC4Data)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfMC4Data: _v.fixingOfMC4Data,
          };
          break;
        case TASK_TYPES.FIXING_OF_MMS:
          if (!_valdation.validateFixingOfMMSData(_v.fixingOfMMSData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfMMSData: _v.fixingOfMMSData,
          };
          break;
        case TASK_TYPES.FIXING_OF_MODULES:
          if (!_valdation.validateFixingOfModulesData(_v.fixingOfModulesData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfModulesData: _v.fixingOfModulesData,
          };
          break;
        case TASK_TYPES.LAYING_OF_CAUTION_TAPE:
          if (!_valdation.validateLayingCautionTapeData(_v.layingCautionTapeData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            layingCautionTapeData: _v.layingCautionTapeData,
          };
          break;
        case TASK_TYPES.ROUTE_MARKING:
          if (!_valdation.validateRouteMarkingData(_v.routeMarkingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            routeMarkingData: _v.routeMarkingData,
          };
          break;
        case TASK_TYPES.BRICKS_LAYERING:
          if (!_valdation.validateBricksLayeringData(_v.bricksLayeringData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            bricksLayeringData: _v.bricksLayeringData,
          };
          break;
        case TASK_TYPES.CABLE_DRESSING:
          checkList = {
            taskName: _v.selectedTask.name,
            cableDressingData: _v.cableDressingData,
          };
          break;
        case TASK_TYPES.CABLE_TRENCH_DRESSING:
          if (!_valdation.validateCableTrenchDressingData(_v.cableTrenchDressingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            cableTrenchDressingData: _v.cableTrenchDressingData,
          };
          break;
        case TASK_TYPES.CONDUIT_LAYING:
          if (!_valdation.validateConduitLayingData(_v.conduitLayingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            conduitLayingData: _v.conduitLayingData,
          };
          break;
        case TASK_TYPES.CABLE_TRENCH_EXCAVATION:
          if (!_valdation.validateCableTrenchExcavationData(_v.cableTrenchExcavationData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            cableTrenchExcavationData: _v.cableTrenchExcavationData,
          };
          break;
        case TASK_TYPES.FIXING_AND_INSTALLATION_OF_LT_PANEL:
        case TASK_TYPES.FIXING_AND_INSTALLATION_OF_SERVO:
        case TASK_TYPES.FIXING_AND_INSTALLATION_OF_MCB:
        case TASK_TYPES.FIXING_AND_INSTALLATION_OF_INVERTOR:
        case TASK_TYPES.FIXING_AND_INSTALLATION_OF_HT_PANEL:
        case TASK_TYPES.FIXING_AND_INSTALLATION_OF_TRANSFORMER:
          if (!_valdation.validateFixingAndInstallationData(_v.fixingAndInstallationData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingAndInstallationData: _v.fixingAndInstallationData,
          };
          break;
        // case TASK_TYPES.HT_PANEL_INSTALLATION:
        //   if (!_valdation.validateHtPanelInstallationData(htPanelInstallationData)) {
        //     return;
        //   }
        //   checkList = {
        //     taskName: _v.selectedTask.name,
        //     htPanelInstallationData: htPanelInstallationData,
        //   };
        //   break;
        case TASK_TYPES.ERECTION_OF_STRUCTURE:
          checkList = {
            taskName: _v.selectedTask.name,
            erectionOfStructureData: _v.erectionOfStructureData,
          };
          break;
        case TASK_TYPES.FABRICATION_OF_STRUCTURE:
          checkList = {
            taskName: _v.selectedTask.name,
            fabricationOfStructureData: _v.fabricationOfStructureData,
          };
          break;
        case TASK_TYPES.FIXING_OF_PANELS:
          if (!_valdation.validateFixingOfPanelsData(_v.fixingOfPanelsData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfPanelsData: _v.fixingOfPanelsData,
          };
          break;
        case TASK_TYPES.ERECTION_OF_PRECAST_COLUMN:
          if (!_valdation.validateErectionPreCastColumnData(_v.erectionPreCastColumnData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            erectionPreCastColumnData: _v.erectionPreCastColumnData,
          };
          break;
        case TASK_TYPES.ERECTION_OF_BUS_SHELTER:
          if (!_valdation.validateErectionOfBusShelterData(_v.erectionOfBusShelterData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            erectionOfBusShelterData: _v.erectionOfBusShelterData,
          };
          break;
        case TASK_TYPES.ERECTION_OF_ANGLE_SECTION:
          if (!_valdation.validateErectionOfAngleSectionData(_v.erectionOfAngleSectionData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            erectionOfAngleSectionData: _v.erectionOfAngleSectionData,
          };
          break;
        case TASK_TYPES.PLACING_OF_PRE_CAST_RCC_PANELS:
          if (!_valdation.validatePreCastRccPanelData(_v.preCastRccPanelData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            preCastRccPanelData: _v.preCastRccPanelData,
          };
          break;
        case TASK_TYPES.PLACING_OF_CHAIN_LINK:
          if (!_valdation.validatePlacingChainLinkData(_v.placingChainLinkData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            placingChainLinkData: _v.placingChainLinkData,
          };
          break;
        case TASK_TYPES.MORTAR_CHECKLIST:
          if (!_valdation.validateMortarChecklistData(_v.mortarChecklistData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            mortarChecklistData: _v.mortarChecklistData,
          };
          break;
        case TASK_TYPES.FLOORING:
          if (!_valdation.validateFlooringData(_v.flooringData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            flooringData: _v.flooringData,
          };
          break;
        case TASK_TYPES.SIGNAGE_LOCATION_IDENTIFICATION:
          checkList = {
            taskName: _v.selectedTask.name,
            signageLocationData: _v.signageLocationData,
          };
          break;
        case TASK_TYPES.BACKFILL:
          if (!_valdation.validateBackfillData(_v.backfillData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            backfillData: _v.backfillData,
          };
          break;
        case TASK_TYPES.PLACEMENT_OF_SIGNAGE_SHEET:
          if (!_valdation.validatePlacementOfSignageSheetData(_v.placementOfSignageSheetData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            placementOfSignageSheetData: _v.placementOfSignageSheetData,
          };
          break;
        case TASK_TYPES.FIXING_OF_TRAFFIC_IMPACT_ATTENUATORS:
          if (
            !_valdation.validateTrafficImpactAttenuatorsData(_v.trafficImpactAttenuatorsData)
          ) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            trafficImpactAttenuatorsData: _v.trafficImpactAttenuatorsData,
          };
          break;
        case TASK_TYPES.FIXING_OF_SPRING_POST:
          if (!_valdation.validateFixingOfSpringPostData(_v.fixingOfSpringPostData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfSpringPostData: _v.fixingOfSpringPostData,
          };
          break;
        case TASK_TYPES.FIXING_OF_SOLAR_ROAD_STUDS:
          if (!_valdation.validateFixingOfSolarRoadStudsData(_v.fixingOfSolarRoadStudsData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfSolarRoadStudsData: _v.fixingOfSolarRoadStudsData,
          };
          break;
        case TASK_TYPES.FIXING_OF_SOLAR_BLINKERS:
          if (!_valdation.validateFixingOfSolarBlinkersData(_v.fixingOfSolarBlinkersData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfSolarBlinkersData: _v.fixingOfSolarBlinkersData,
          };
          break;
        case TASK_TYPES.FIXING_OF_ROAD_STUDS:
          if (!_valdation.validateFixingOfRoadStudsData(_v.fixingOfRoadStudsData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfRoadStudsData: _v.fixingOfRoadStudsData,
          };
          break;
        case TASK_TYPES.FIXING_OF_ROAD_DELINEATORS:
          if (!_valdation.validateFixingOfRoadDelineatorsData(_v.fixingOfRoadDelineatorsData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfRoadDelineatorsData: _v.fixingOfRoadDelineatorsData,
          };
          break;
        case TASK_TYPES.FIXING_OF_OBJECT_MARKERS:
          if (!_valdation.validateFixingOfObjectMarkersData(_v.fixingOfObjectMarkersData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfObjectMarkersData: _v.fixingOfObjectMarkersData,
          };
          break;
        case TASK_TYPES.FIXING_OF_NOISE_BARRIER:
          if (!_valdation.validateFixingOfNoiseBarrierData(_v.fixingOfNoiseBarrierData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfNoiseBarrierData: _v.fixingOfNoiseBarrierData,
          };
          break;
        case TASK_TYPES.FIXING_OF_LED_TRAFFIC_BLINKERS:
          if (
            !_valdation.validateFixingOfLEDTrafficBlinkersData(
              _v.fixingOfLEDTrafficBlinkersData,
            )
          ) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfLEDTrafficBlinkersData: _v.fixingOfLEDTrafficBlinkersData,
          };
          break;
        case TASK_TYPES.FIXING_OF_HAZARD_MARKERS:
          if (!_valdation.validateFixingOfHazardMarkersData(_v.fixingOfHazardMarkersData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfHazardMarkersData: _v.fixingOfHazardMarkersData,
          };
          break;
        case TASK_TYPES.FIXING_OF_FLEXIBLE_MEDIAN_MARKERS:
          if (
            !_valdation.validateFixingOfFlexibleMedianMarkersData(
              _v.fixingOfFlexibleMedianMarkersData,
            )
          ) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfFlexibleMedianMarkersData: _v.fixingOfFlexibleMedianMarkersData,
          };
          break;
        case TASK_TYPES.FIXING_OF_CONVEX_MIRRORS:
          if (!_valdation.validateFixingOfConvexMirrorsData(_v.fixingOfConvexMirrorsData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfConvexMirrorsData: _v.fixingOfConvexMirrorsData,
          };
          break;
        case TASK_TYPES.FIXING_OF_ANTIGLARES:
          if (!_valdation.validateFixingOfAntiglaresData(_v.fixingOfAntiglaresData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfAntiglaresData: _v.fixingOfAntiglaresData,
          };
          break;
        case TASK_TYPES.ERECTION_OF_POLES:
          if (!_valdation.validateErectionOfPolesData(_v.erectionOfPolesData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            erectionOfPolesData: _v.erectionOfPolesData,
          };
          break;
        case TASK_TYPES.FIXING_OF_ARMS:
          if (!_valdation.validateFixingOfArmsData(_v.fixingOfArmsData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfArmsData: _v.fixingOfArmsData,
          };
          break;
        case TASK_TYPES.INSTALLATION_OF_LED_LIGHTS:
          if (!_valdation.validateInstallationOfLEDLightsData(_v.installationOfLEDLightsData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            installationOfLEDLightsData: _v.installationOfLEDLightsData,
          };
          break;
        case TASK_TYPES.LAYING_OF_FLEXIBLE_CABLE:
          if (!_valdation.validateLayingOfFlexibleCableData(_v.layingOfFlexibleCableData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            layingOfFlexibleCableData: _v.layingOfFlexibleCableData,
          };
          break;
        case TASK_TYPES.LAYING_OF_LT_CABLE:
          if (!_valdation.validateLayingOfLTCableData(_v.layingOfLTCableData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            layingOfLTCableData: _v.layingOfLTCableData,
          };
          break;
        case TASK_TYPES.FIXING_OF_STONE:
          if (!_valdation.validateFixingOfStoneData(_v.fixingOfStoneData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            fixingOfStoneData: _v.fixingOfStoneData,
          };
          break;
        case TASK_TYPES.PLASTERING:
          if (!_valdation.validatePlasteringData(_v.plasteringData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            plasteringData: _v.plasteringData,
          };
          break;
        case TASK_TYPES.PUTTY:
          if (!_valdation.validatePuttyData(_v.puttyData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            puttyData: _v.puttyData,
          };
          break;
        case TASK_TYPES.HVAC_WORK:
          if (!_valdation.validateHvacWorkData(_v.hvacWorkData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            hvacWorkData: _v.hvacWorkData,
          };
          break;
        case TASK_TYPES.CEILING_WORK:
          if (!_valdation.validateCeilingWorkData(_v.ceilingWorkData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            ceilingWorkData: _v.ceilingWorkData,
          };
          break;
        case TASK_TYPES.FURNITURE_WORK:
          checkList = {
            taskName: _v.selectedTask.name,
            furnitureWorkData: _v.furnitureWorkData,
          };
          break;
        case TASK_TYPES.DOOR_WORKS:
          checkList = {
            taskName: _v.selectedTask.name,
            doorWorksData: _v.doorWorksData,
          };
          break;
        case TASK_TYPES.WINDOW_WORKS:
          checkList = {
            taskName: _v.selectedTask.name,
            windowWorksData: _v.windowWorksData,
          };
          break;
        case TASK_TYPES.GLASS_WORKS:
          if (!_valdation.validateGlassWorksData(_v.glassWorksData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            glassWorksData: _v.glassWorksData,
          };
          break;
        case TASK_TYPES.ELECTRICAL_WORK:
          if (!_valdation.validateElectricalWorkData(_v.electricalWorkData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            electricalWorkData: _v.electricalWorkData,
          };
          break;
        case TASK_TYPES.PLUMBING_WORK:
          if (!_valdation.validatePlumbingWorkData(_v.plumbingWorkData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            plumbingWorkData: _v.plumbingWorkData,
          };
          break;
        case TASK_TYPES.FLOORING_WORK:
          if (!_valdation.validateFlooringWorkData(_v.flooringWorkData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            flooringWorkData: _v.flooringWorkData,
          };
          break;
        case TASK_TYPES.EXCAVATION_OF_TRENCH:
          if (!_valdation.validateExcavationOfTrenchData(_v.excavationOfTrenchData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            excavationOfTrenchData: _v.excavationOfTrenchData,
          };
          break;
        case TASK_TYPES.LAYING_OF_DUCT:
          if (!_valdation.validateLayingOfDuctData(_v.layingOfDuctData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            layingOfDuctData: _v.layingOfDuctData,
          };
          break;
        case TASK_TYPES.HDD_CROSSING:
          if (!_valdation.validateHddCrossingData(_v.hddCrossingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            hddCrossingData: _v.hddCrossingData,
          };
          break;
        case TASK_TYPES.CONSTRUCTION_OF_CHAMBER:
          if (!_valdation.validateConstructionOfChamberData(_v.constructionOfChamberData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            constructionOfChamberData: _v.constructionOfChamberData,
          };
          break;
        case TASK_TYPES.INSTALLATION_OF_EQUIPMENT:
          if (!_valdation.validateInstallationOfEquipmentData(_v.installationOfEquipmentData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            installationOfEquipmentData: _v.installationOfEquipmentData,
          };
          break;
        case TASK_TYPES.INSTALLATION_OF_SOLAR_SYSTEM:
          if (
            !_valdation.validateInstallationOfSolarSystemData(_v.installationOfSolarSystemData)
          ) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            installationOfSolarSystemData: _v.installationOfSolarSystemData,
          };
          break;
        case TASK_TYPES.INSTALLATION_OF_NETWORK_DEVICES:
          if (
            !_valdation.validateInstallationOfNetworkDevicesData(
              _v.installationOfNetworkDevicesData,
            )
          ) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            installationOfNetworkDevicesData: _v.installationOfNetworkDevicesData,
          };
          break;
        case TASK_TYPES.CONSTRUCTION_OF_FOUNDATION:
          if (
            !_valdation.validateConstructionOfFoundationData(_v.constructionOfFoundationData)
          ) {
            return;
          }
          if (!_valdation.validateFoundationData(_v.foundationData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            constructionOfFoundationData: _v.constructionOfFoundationData,
            foundationData: _v.foundationData,
          };
          break;
        case TASK_TYPES.CASTING_OF_BALLAST:
          if (!_valdation.validateCastingOfBallastData(_v.castingOfBallastData)) {
            return;
          }
          if (!_valdation.validateBallastData(_v.ballastData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            castingOfBallastData: _v.castingOfBallastData,
            ballastData: _v.ballastData,
          };
          break;
        case TASK_TYPES.SAND_LAYER:
          if (!_valdation.validateSandLayerData(_v.sandLayerData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            sandLayerData: _v.sandLayerData,
          };
          break;
        case TASK_TYPES.LIFTING_TRANSPORT_ERECTION:
        case TASK_TYPES.LIFTING_LEFT:
        case TASK_TYPES.LIFTING_YARD:
        case TASK_TYPES.LIFTING_RIGHT:
          checkList = {
            taskName: _v.selectedTask.name,
            liftingCombinedLRData: _v.liftingCombinedLRData,
          };
          break;
        case TASK_TYPES.REMOVAL_OF_FORMWORK:
          checkList = {
            taskName: _v.selectedTask.name,
            removalFormworkData: _v.removalFormworkData,
          };
          break;
        case TASK_TYPES.FABRICATION_OF_BUS_SHELTER:
        case TASK_TYPES.FABRICATION_OF_MEMBERS:
        case TASK_TYPES.FABRICATION_OF_STEEL_GIRDERS:
          checkList = {
            taskName: _v.selectedTask.name,
            fabricationData: _v.fabricationData,
          };
          break;
  
        case TASK_TYPES.TEMPORARY_PRESTRESSING:
          if (!_valdation.validateTemporaryPrestressingData(_v.temporaryPrestressingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            temporaryPrestressingData: _v.temporaryPrestressingData,
          };
          break;
        case TASK_TYPES.PRE_STRESSING:
          if (!_valdation.validatePrestressingData(_v.prestressingData)) {
            return;
          }
          checkList = {
            taskName: _v.selectedTask.name,
            prestressingData: _v.prestressingData,
          };
          break;
        default:
          break;
      }
};