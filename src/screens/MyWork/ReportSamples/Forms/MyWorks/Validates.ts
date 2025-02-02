import { TASK_TYPES } from "../../../../../constants/constants";

export const Validates = (_v: any) => {
    const showSnackbar = _v.showSnackbar;

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
        const totalDoublePolesErected = parseInt(
            erectionOfDoublePoleStructureData.totalDoublePolesErected,
        );

        // Validation for totalDoublePolesErected
        if (
            isNaN(totalDoublePolesErected) ||
            totalDoublePolesErected <= 0 ||
            totalDoublePolesErected > 1000
        ) {
            showSnackbar(
                'Please enter a valid number of double pole structures erected (integer, > 0 and <= 1000)',
                'error',
            );
            return false;
        }

        erectionOfDoublePoleStructureData.totalDoublePolesErected = Number(
            erectionOfDoublePoleStructureData.totalDoublePolesErected,
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


    const validateCompactionData = (compactionData: any) => {
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

    const handleTimeChangeBallast = (index: number, field: any, value: any) => {
        const newData = [..._v.ballastData]; // Assuming ballastData state
        newData[index][field] = value;
        _v.setBallastData(newData); // Update state
    };

    const handleTextInputChangeBallast = (index: any, field: any, value: any) => {
        const updatedData = [..._v.ballastData]; // Assuming ballastData state
        let isValid = true;
        let errorMessage = '';

        switch (field) {
            case 'slumpValue':
                const slump = parseInt(value, 10);
                if (isNaN(slump) || slump <= 0 || slump > 300) {
                    isValid = false;
                    errorMessage = 'Enter a valid slump value between 1 and 300 mm';
                }
                break;

            case 'concretePoured':
                const poured = parseFloat(value);
                if (
                    isNaN(poured) ||
                    poured <= 0 ||
                    poured > 100 ||
                    value.split('.')[1]?.length > 3
                ) {
                    isValid = false;
                    errorMessage =
                        'Enter a valid value (0-100 cum) with up to 3 decimals';
                }
                break;

            case 'totalBallastCasted':
                const total = parseInt(value, 10);
                if (isNaN(total) || total <= 0 || total > 10000) {
                    isValid = false;
                    errorMessage = 'Enter a valid number between 1 and 10,000';
                }
                break;

            default:
                break;
        }

        if (isValid) {
            updatedData[index][field] = value;
            _v.setBallastData(updatedData); // Update state
        } else {
            showSnackbar(errorMessage, 'error'); // Display error
        }
    };


    const handleTimeChangeFoundation = (index: any, field: any, value: any) => {
        const newData = [..._v.foundationData];
        newData[index][field] = value;
        _v.setFoundationData(newData);
    };

    const handleTextInputChangeFoundation = (index: any, field: any, value: any) => {
        const updatedData = [..._v.foundationData];
        let isValid = true;
        let errorMessage = '';

        switch (field) {
            case 'slumpValue':
                const slump = parseInt(value);
                if (isNaN(slump) || slump <= 0 || slump > 300) {
                    isValid = false;
                    errorMessage = 'Enter a valid slump value between 1 and 300 mm';
                }
                break;

            case 'concretePoured':
                const poured = parseFloat(value);
                if (
                    isNaN(poured) ||
                    poured <= 0 ||
                    poured > 100 ||
                    value.split('.')[1]?.length > 3
                ) {
                    isValid = false;
                    errorMessage =
                        'Enter a valid value (0-100 cum) with up to 3 decimals';
                }
                break;

            case 'totalFoundationCasted':
                const total = parseInt(value);
                if (isNaN(total) || total <= 0 || total > 10000) {
                    isValid = false;
                    errorMessage = 'Enter a valid number between 1 and 10,000';
                }
                break;

            default:
                break;
        }

        if (isValid) {
            updatedData[index][field] = value;
            _v.setFoundationData(updatedData);
        } else {
            showSnackbar(errorMessage, 'error');
        }
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
    const validateFoundationData = (foundationData: any): boolean => {
        for (const item of foundationData) {
            // Parsing values to float/integer
            const slumpValue = parseInt(item.slumpValue, 10);
            const concretePoured = parseFloat(item.concretePoured);
            const totalFoundationCasted = parseInt(item.totalFoundationCasted, 10);

            // Validation checks
            if (isNaN(slumpValue) || slumpValue <= 0 || slumpValue > 300) {
                showSnackbar(
                    'Slump Value must be an integer greater than 0 and up to 300.',
                    'error',
                );
                return false;
            }

            if (
                isNaN(concretePoured) ||
                concretePoured <= 0 ||
                concretePoured > 100 ||
                !/^\d+(\.\d{1,3})?$/.test(item.concretePoured)
            ) {
                showSnackbar(
                    'Concrete Poured must be greater than 0 and up to 100, with up to 3 decimal places.',
                    'error',
                );
                return false;
            }

            if (
                isNaN(totalFoundationCasted) ||
                !Number.isInteger(totalFoundationCasted) ||
                totalFoundationCasted <= 0 ||
                totalFoundationCasted > 10000
            ) {
                showSnackbar(
                    'Total Foundation Casted must be an integer greater than 0 and up to 10,000.',
                    'error',
                );
                return false;
            }
        }

        // Convert the values back to numbers after validation
        foundationData.forEach((item: any) => {
            item.slumpValue = Number(item.slumpValue);
            item.concretePoured = Number(item.concretePoured);
            item.totalFoundationCasted = Number(item.totalFoundationCasted);
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

    const validateConcreteData = (taskName: string) => {
        let isValid = true;

        _v.concreteData.forEach((item, index) => {
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

            if (_v.selectedTask.name === TASK_TYPES.CONCRETING) {
                const tempValue = parseFloat(item.concreteTemp.toString());
                if (
                    isNaN(tempValue) ||
                    tempValue <= 0 ||
                    tempValue > 60 ||
                    item.concreteTemp.toString().split('.')[1]?.length > 2
                ) {
                    isValid = false;
                    showSnackbar(
                        `TM ${index + 1
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
                        `TM ${index + 1
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
                    `TM ${index + 1
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

    const handleTextInputChangeTorquing = (
        index: number,
        field: string,
        value: string,
    ) => {
        const updatedData = [..._v.torquingData];
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
            _v.setTorquingData(updatedData);
        } else {
            updatedData[index][field] = value;
            _v.setTorquingData(updatedData);
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
    const validateSandLayerData = (sandLayerData: any): boolean => {
        const totalLengthTrenchCovered = parseFloat(
            sandLayerData.totalLengthTrenchCovered,
        );
        const totalQtySandFilled = parseFloat(sandLayerData.totalQtySandFilled);

        // Validation for totalLengthTrenchCovered
        if (
            isNaN(totalLengthTrenchCovered) ||
            totalLengthTrenchCovered <= 0 ||
            totalLengthTrenchCovered > 10000 ||
            sandLayerData.totalLengthTrenchCovered.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Please enter a valid trench length covered by sand layer (max 3 decimal places, > 0 and <= 10000)',
                'error',
            );
            return false;
        }

        // Validation for totalQtySandFilled
        if (
            isNaN(totalQtySandFilled) ||
            totalQtySandFilled <= 0 ||
            totalQtySandFilled > 10000 ||
            sandLayerData.totalQtySandFilled.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Please enter a valid quantity of sand filled (cum, max 3 decimal places, > 0 and <= 10000)',
                'error',
            );
            return false;
        }

        sandLayerData.totalLengthTrenchCovered = Number(
            sandLayerData.totalLengthTrenchCovered,
        );
        sandLayerData.totalQtySandFilled = Number(sandLayerData.totalQtySandFilled);

        return true;
    };

    const validateBallastData = (ballastData: any): boolean => {
        for (const item of ballastData) {
            const slumpValue = parseInt(item.slumpValue, 10);
            const concretePoured = parseFloat(item.concretePoured);
            const totalBallastCasted = parseInt(item.totalBallastCasted, 10);

            // Validation checks
            if (isNaN(slumpValue) || slumpValue <= 0 || slumpValue > 300) {
                showSnackbar(
                    'Slump Value must be an integer greater than 0 and up to 300.',
                    'error',
                );
                return false;
            }

            if (
                isNaN(concretePoured) ||
                concretePoured <= 0 ||
                concretePoured > 100 ||
                !/^\d+(\.\d{1,3})?$/.test(item.concretePoured)
            ) {
                showSnackbar(
                    'Concrete Poured must be greater than 0 and up to 100, with up to 3 decimal places.',
                    'error',
                );
                return false;
            }

            if (
                isNaN(totalBallastCasted) ||
                !Number.isInteger(totalBallastCasted) ||
                totalBallastCasted <= 0 ||
                totalBallastCasted > 10000
            ) {
                showSnackbar(
                    'Total Ballast Casted must be an integer greater than 0 and up to 10,000.',
                    'error',
                );
                return false;
            }
        }

        ballastData.forEach((item: any) => {
            item.slumpValue = Number(item.slumpValue);
            item.concretePoured = Number(item.concretePoured);
            item.totalBallastCasted = Number(item.totalBallastCasted);
        });

        return true;
    };

    const validateCastingOfBallastData = (castingOfBallastData: any): boolean => {
        const totalReinforcementWeight = parseFloat(
            castingOfBallastData.totalReinforcementWeightKg,
        );

        // Validation for totalReinforcementWeightKg
        if (
            isNaN(totalReinforcementWeight) ||
            totalReinforcementWeight <= 0 ||
            totalReinforcementWeight > 1000 ||
            castingOfBallastData.totalReinforcementWeightKg.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Please enter a valid reinforcement weight (Kg, > 0, <= 1000, max 3 decimal places)',
                'error',
            );
            return false;
        }

        // Convert the value back to a number after validation
        castingOfBallastData.totalReinforcementWeightKg = Number(
            totalReinforcementWeight,
        );

        return true;
    };

    const validateConstructionOfFoundationData = (data: any): boolean => {
        const totalWeight = parseFloat(data.totalWeightReinforcementKg);

        if (
            isNaN(totalWeight) ||
            totalWeight <= 0 ||
            totalWeight > 1000 ||
            data.totalWeightReinforcementKg.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Please enter a valid total weight (Kg, max 3 decimal places, > 0 and <= 1000)',
                'error',
            );
            return false;
        }

        data.totalWeightReinforcementKg = Number(data.totalWeightReinforcementKg);
        return true;
    };

    const validateInstallationOfNetworkDevicesData = (data: any) => {
        const devicesInstalled = parseInt(data.devicesInstalled);

        if (
            isNaN(devicesInstalled) ||
            devicesInstalled <= 0 ||
            devicesInstalled > 1000
        ) {
            showSnackbar(
                'Please enter a valid number of devices installed (integer, > 0 and <= 1000)',
                'error',
            );
            return false;
        }

        data.devicesInstalled = Number(data.devicesInstalled);
        return true;
    };

    const validateInstallationOfSolarSystemData = (data: any): boolean => {
        const totalSystemsInstalled = parseInt(data.totalSolarSystemsInstalled);

        // Validation for totalSystemsInstalled
        if (
            isNaN(totalSystemsInstalled) ||
            totalSystemsInstalled <= 0 ||
            totalSystemsInstalled > 1000
        ) {
            showSnackbar(
                'Please enter a valid number of Solar Systems installed (integer, > 0 and <= 1000)',
                'error',
            );
            return false;
        }

        // Convert to number after validation
        data.totalSolarSystemsInstalled = Number(data.totalSolarSystemsInstalled);

        return true;
    };

    const validateInstallationOfEquipmentData = (
        installationOfEquipmentData: any,
    ): boolean => {
        const totalEquipmentInstalled = parseInt(
            installationOfEquipmentData.totalEquipmentInstalled,
        );

        // Validation for totalEquipmentInstalled
        if (
            isNaN(totalEquipmentInstalled) ||
            totalEquipmentInstalled <= 0 ||
            totalEquipmentInstalled > 1000
        ) {
            showSnackbar(
                'Please enter a valid number of equipment installed (integer, > 0 and <= 1000)',
                'error',
            );
            return false;
        }

        // Convert value back to number after validation
        installationOfEquipmentData.totalEquipmentInstalled = Number(
            totalEquipmentInstalled,
        );

        return true;
    };

    const validateConstructionOfChamberData = (data: any) => {
        const areaSqm = parseFloat(data.totalBrickworkAreaSqm);
        const volumeCum = parseFloat(data.totalBrickworkVolumeCum);

        // Validation for area in Sqm
        if (
            isNaN(areaSqm) ||
            areaSqm <= 0 ||
            areaSqm > 100000 ||
            data.totalBrickworkAreaSqm.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Please enter a valid brickwork area (Sqm, > 0 and <= 100000, max 3 decimal places)',
                'error',
            );
            return false;
        }

        // Validation for volume in Cum
        if (
            isNaN(volumeCum) ||
            volumeCum <= 0 ||
            volumeCum > 100000 ||
            data.totalBrickworkVolumeCum.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Please enter a valid brickwork volume (Cum, > 0 and <= 100000, max 3 decimal places)',
                'error',
            );
            return false;
        }
        data.totalBrickworkAreaSqm = Number(data.totalBrickworkAreaSqm);
        data.totalBrickworkVolumeCum = Number(data.totalBrickworkVolumeCum);

        return true;
    };

    const validateHddCrossingData = (hddCrossingData: any) => {
        const totalLength = parseFloat(hddCrossingData.totalLengthOfHddCrossing);

        // Validation for totalLengthOfHddCrossing
        if (
            isNaN(totalLength) ||
            totalLength <= 0 ||
            totalLength > 10000 ||
            hddCrossingData.totalLengthOfHddCrossing.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Please enter a valid total length (max 3 decimal places, > 0 and <= 10000)',
                'error',
            );
            return false;
        }

        hddCrossingData.totalLengthOfHddCrossing = Number(totalLength);
        return true;
    };

    const validateLayingOfDuctData = (layingOfDuctData: any) => {
        const totalLength = parseFloat(layingOfDuctData.totalLengthOfDuctLaid);

        if (
            isNaN(totalLength) ||
            totalLength <= 0 ||
            totalLength > 10000 ||
            layingOfDuctData.totalLengthOfDuctLaid.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Please enter a valid total length of duct laid (RM, max 3 decimal places, > 0 and <= 10000)',
                'error',
            );
            return false;
        }

        layingOfDuctData.totalLengthOfDuctLaid = Number(
            layingOfDuctData.totalLengthOfDuctLaid,
        );
        return true;
    };

    const validateExcavationOfTrenchData = (data: any) => {
        const totalLength = parseFloat(data.totalLengthExcavated);
        const totalQty = parseFloat(data.totalQtyEarthExcavated);

        if (
            isNaN(totalLength) ||
            totalLength <= 0 ||
            totalLength > 10000 ||
            data.totalLengthExcavated.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Invalid trench length (max 3 decimals, > 0, <= 10000)',
                'error',
            );
            return false;
        }

        if (
            isNaN(totalQty) ||
            totalQty <= 0 ||
            totalQty > 10000 ||
            data.totalQtyEarthExcavated.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Invalid earth quantity (max 3 decimals, > 0, <= 10000)',
                'error',
            );
            return false;
        }
        data.totalLengthExcavated = Number(data.totalLengthExcavated);
        data.totalQtyEarthExcavated = Number(data.totalQtyEarthExcavated);
        return true;
    };

    const validateFlooringWorkData = (flooringWorkData: any) => {
        const totalSqftAreaCompleted = parseFloat(
            flooringWorkData.totalSqftAreaCompleted,
        );

        // Validation for totalSqftAreaCompleted
        if (
            isNaN(totalSqftAreaCompleted) ||
            totalSqftAreaCompleted <= 0 ||
            totalSqftAreaCompleted > 100000 ||
            flooringWorkData.totalSqftAreaCompleted.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Please enter a valid total area (sqft, max 3 decimal places, > 0 and <= 100000)',
                'error',
            );
            return false;
        }

        flooringWorkData.totalSqftAreaCompleted = Number(totalSqftAreaCompleted);
        return true;
    };

    const validatePlumbingWorkData = (plumbingWorkData: any): boolean => {
        const totalSqftAreaCompleted = parseFloat(
            plumbingWorkData.totalSqftAreaCompleted,
        );

        // Validation for totalSqftAreaCompleted
        if (
            isNaN(totalSqftAreaCompleted) ||
            totalSqftAreaCompleted <= 0 ||
            totalSqftAreaCompleted > 10000 ||
            plumbingWorkData.totalSqftAreaCompleted.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Please enter a valid total sqft area (max 3 decimal places, > 0 and <= 10000)',
                'error',
            );
            return false;
        }

        // Convert values to numbers after validation
        plumbingWorkData.totalSqftAreaCompleted = Number(
            plumbingWorkData.totalSqftAreaCompleted,
        );

        return true;
    };

    const validateElectricalWorkData = (electricalWorkData: any): boolean => {
        const totalSqftCompleted = parseFloat(
            electricalWorkData.totalSqftCompleted,
        );

        // Validation for totalSqftCompleted
        if (
            isNaN(totalSqftCompleted) ||
            totalSqftCompleted <= 0 ||
            totalSqftCompleted > 10000 ||
            electricalWorkData.totalSqftCompleted.split('.')[1]?.length > 3
        ) {
            showSnackbar(
                'Please enter a valid sqft area (max 3 decimal places, > 0 and <= 10000)',
                'error',
            );
            return false;
        }

        electricalWorkData.totalSqftCompleted = Number(
            electricalWorkData.totalSqftCompleted,
        );
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

    const validateFixingOfMMSData = (fixingOfMMSData: any) => {
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

    return {
        validateInverterInstallationData,
        validateErectionOfDoublePoleStructureData,
        validateStonePitchingData,
        validatePlantationData,
        validateWateringData,
        validatePreparationOfSoilData,
        validatePlantingTreesData,
        validatePlantingGrassData,
        validateChuteMembersData,
        validateLayingOfTopSoilData,
        validateLayingOfGrassTurfData,
        validateFixingOfMeshData,
        validateFixingGeoCellData,
        validateCuttingOfSoilData,
        validateBricksWorkData,
        validateBackfillingData,
        validateLayingOfPQCData,
        validateLayingOfSeparationMembraneData,
        validateMillingData,
        validateSealantFilingData,
        validatePlacingOfFillerBoardData,
        validateCompactionData,
        validatePlacingOfDowelData,
        validateLayingOfDlcData,
        handleTimeChangeBallast,
        handleTextInputChangeBallast,
        handleTimeChangeFoundation,
        handleTextInputChangeFoundation,
        validateTexturingData,
        validateLayingOfDLCData,
        validateLayingOfPaverBlockData,
        validateCuttingOfJointsData,
        validateFixingVerticalPostData,
        validateFixingOfMetalBeamData,
        validateDumpingData,
        validateLayingAndCompactionData,
        validateBoringOfDiaphragmData,
        validateTransportationData,
        validateProcurementOfSteelData,
        validateFlushingOperationsData,
        validateBoringOfPileData,
        validateChippingAndRemovalData,
        validateCuringData,
        validateStrippingAndStoringTopSoilData,
        validateGlueingData,
        validateFoundationData,
        validatePrestressingData,
        validateGroutingData,
        validateConcreteData,
        handleTextInputChangeTorquing,
        validateTorquingData,
        validateSandLayerData,
        validateBallastData,
        validateCastingOfBallastData,
        validateConstructionOfFoundationData,
        validateInstallationOfNetworkDevicesData,
        validateInstallationOfSolarSystemData,
        validateInstallationOfEquipmentData,
        validateConstructionOfChamberData,
        validateHddCrossingData,
        validateLayingOfDuctData,
        validateExcavationOfTrenchData,
        validateFlooringWorkData,
        validatePlumbingWorkData,
        validateElectricalWorkData,
        validateGlassWorksData,
        validateCeilingWorkData,
        validateHvacWorkData,
        validatePuttyData,
        validatePlasteringData,
        validateFixingOfStoneData,
        validateFixingOfMC4Data,
        validateLayingOfLTCableData,
        validateLayingOfFlexibleCableData,
        validateInstallationOfLEDLightsData,
        validateFixingOfArmsData,
        validateErectionOfPolesData,
        validateFixingOfAntiglaresData,
        validateFixingOfConvexMirrorsData,
        validateFixingOfFlexibleMedianMarkersData,
        validateFixingOfHazardMarkersData,
        validateFixingOfLEDTrafficBlinkersData,
        validateFixingOfNoiseBarrierData,
        validateFixingOfObjectMarkersData,
        validateFixingOfRoadDelineatorsData,
        validateFixingOfRoadStudsData,
        validateFixingOfSolarBlinkersData,
        validateFixingOfSolarRoadStudsData,
        validateFixingOfSpringPostData,
        validateTrafficImpactAttenuatorsData,
        validatePlacementOfSignageSheetData,
        validateBackfillData,
        validateFlooringData,
        validateMortarChecklistData,
        validatePlacingChainLinkData,
        validatePreCastRccPanelData,
        validateErectionOfAngleSectionData,
        validateErectionOfBusShelterData,
        validateErectionPreCastColumnData,
        validateFixingOfPanelsData,
        validateHtPanelInstallationData,
        validateFixingAndInstallationData,
        validateCableTrenchExcavationData,
        validateConduitLayingData,
        validateCableTrenchDressingData,
        validateBricksLayeringData,
        validateRouteMarkingData,
        validateLayingCautionTapeData,
        validateFixingOfModulesData,
        validateFixingOfMMSData,
        validateTemporaryPrestressingData,
        validatePipeLayingAndJointingData,
    }
};