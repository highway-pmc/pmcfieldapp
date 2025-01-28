import { TEST_TYPES } from "../../../../../constants/constants";

export const getTestSampleConcreteObject = (sampleNum: any) => {
    return {
        sampleNo: {
            title: 'Sample no',
            value: sampleNum,
        },
        details: {
            titles: [
                'Cube No.',
                'Wt. of cube in gm',
                'Volume of Cube in Cum',
                'Test Area in mm2',
                'Failure Load (KN)',
                'Compressive Strength (N/mm2)',
            ],
            values: [
                {
                    cubeNo: 1,
                    wtCube: 0,
                    volOfCube: 0,
                    testArea: 0,
                    failureLoad: 0,
                    compressiveStrength: 0,
                },
                {
                    cubeNo: 2,
                    wtCube: 0,
                    volOfCube: 0,
                    testArea: 0,
                    failureLoad: 0,
                    compressiveStrength: 0,
                },
                {
                    cubeNo: 3,
                    wtCube: 0,
                    volOfCube: 0,
                    testArea: 0,
                    failureLoad: 0,
                    compressiveStrength: 0,
                },
            ],
        },
        avgStrength: {
            title: 'Avg. Strength (N/mm2)',
            value: 0,
        },
        remarks: {
            title: 'Remarks',
            value: '',
        },
    };
};

export const getTestSampleCementCompressiveStrengthObject = (sampleNum: any) => {
    return {
        sampleNo: {
            title: 'Sample no',
            value: sampleNum,
        },
        details: {
            titles: [
                'Sl. No.',
                'Wt. of cube in gm',
                'Failure Load (KN)',
                'Compressive Strength (N/mm2)',
            ],
            values: [
                {
                    slNo: 1,
                    wtCube: 0,
                    failureLoad: 0,
                    compressiveStrength: 0,
                },
                {
                    slNo: 2,
                    wtCube: 0,
                    failureLoad: 0,
                    compressiveStrength: 0,
                },
                {
                    slNo: 3,
                    wtCube: 0,
                    failureLoad: 0,
                    compressiveStrength: 0,
                },
            ],
        },
        ageInDays: {
            title: 'Age in Days',
            value: '',
        },
        dateOfTesting: {
            title: 'Date of Testing',
            value: '',
        },
        avgStrength: {
            title: 'Avg. Strength (N/mm2)',
            value: 0,
        },
    };
};

export const getTestSampleCementSoundnessObject = (sampleNum: any) => {
    return {
        sampleNo: {
            title: 'Sample no',
            value: sampleNum,
        },
        details: {
            titles: [
                'Sl. No.',
                'Before putting in boiling water (A) in mm',
                'After (3 hours) putting in boiling water(B)',
                'Soundness (B-A) in terms of le Chatelier’s (mm)',
            ],
            values: [
                {
                    slNo: 1,
                    beforePuttingInBoilingWater: 0,
                    afterPuttingInBoilingWater: 0,
                    soundnessChatelier: 0,
                },
                {
                    slNo: 2,
                    beforePuttingInBoilingWater: 0,
                    afterPuttingInBoilingWater: 0,
                    soundnessChatelier: 0,
                },
            ],
        },
    };
};

export const getTestSampleCementInitialFinalSettingObject = (sampleNum: any) => {
    if (sampleNum === 1) {
        return {
            sampleNo: {
                title: 'Sample no',
                value: 'Fineness of Cement (IS:4031 PART - I)',
            },
            details: {
                titles: [
                    'Trial No.',
                    'IS Sieve (mm)',
                    'Weight of Sample (W1) in gms',
                    'Wt. of cement retained (W2) in gms',
                ],
                values: [
                    {
                        trainNo: 1,
                        isSieve: '0.090',
                        weightOfSample: 0,
                        weightOfCementRetained: 0,
                        finenessOfCement: 0,
                    },
                    {
                        trainNo: 2,
                        isSieve: '0.090',
                        weightOfSample: 0,
                        weightOfCementRetained: 0,
                        finenessOfCement: 0,
                    },
                    {
                        trainNo: 3,
                        isSieve: '0.090',
                        weightOfSample: 0,
                        weightOfCementRetained: 0,
                        finenessOfCement: 0,
                    },
                ],
            },
        };
    } else if (sampleNum === 2) {
        return {
            sampleNo: {
                title: 'Sample no',
                value: 'Standard Consistency of Cement (IS 4031 Part - IV)',
            },
            details: {
                titles: [
                    'Trial No.',
                    'Wt. of Cement (gms) = A',
                    'Wt. of water (gms) = B',
                    'Penetration of the plunger from the bottom of Vicat mould (mm)',
                    'Is the penetration between 5 to 7 mm (Yes/ No)',
                ],
                values: [
                    {
                        trainNo: 1,
                        weightOfCement: 0,
                        weightOfWater: 0,
                        penetrationOfPlunger: 0,
                        penetrationBetween5To7: 0,
                        standardConsistency: 0,
                    },
                ],
            },
        };
    } else if (sampleNum === 3) {
        return {
            sampleNo: {
                title: 'Sample no',
                value:
                    'Initial Setting time and Final Setting time (IS 4031 Part - IV)',
            },
            details: {
                titles: [
                    'Sl. No.',
                    'Wt. of Cement (gms) (w)',
                    'Water 0.85 % of Standard Consistency',
                    'Time of adding water (T0)',
                    'Time when the needle fails to penetrate test block by 5+-0.5 mm (T1)',
                    'Time when needle makes an impression but the attachment fails to do so (T2)',
                ],
                values: [
                    {
                        trainNo: 1,
                        weightOfCement: 0,
                        waterStandardConsistency: 0,
                        timeOfAddingWater: '',
                        timeWhenNeedleFails: '',
                        timeWhenNeedleMakes: '',
                        initialSettingTime: '',
                        finalSettingTime: '',
                    },
                ],
            },
        };
    }
};

export const getTestSampleCementFineAggregateObject = (
    sampleNum: any,
    taskType: string,
) => {
    if (taskType === TEST_TYPES.GRADATION) {
        return {
            weightOfSample: 0,
            sampleNo: {
                title: 'Sample no',
                value: sampleNum,
            },
            details: {
                titles: [
                    'Sieve Size',
                    'Weight retained in gm',
                    'Cumulative weight retained in gm',
                    'Cumulative retained in %',
                    '% Passing',
                ],
                values: [
                    {
                        sieveSize: '10.0 mm',
                        weightRetainedInGm: 0,
                        cumulativeWeightRetainedInGm: 0,
                        cumulativeRetainedInPercent: 0,
                        passignPercent: 0,
                    },
                    {
                        sieveSize: '4.75 mm',
                        weightRetainedInGm: 0,
                        cumulativeWeightRetainedInGm: 0,
                        cumulativeRetainedInPercent: 0,
                        passignPercent: 0,
                    },
                    {
                        sieveSize: '2.36 mm',
                        weightRetainedInGm: 0,
                        cumulativeWeightRetainedInGm: 0,
                        cumulativeRetainedInPercent: 0,
                        passignPercent: 0,
                    },
                    {
                        sieveSize: '1.18 mm',
                        weightRetainedInGm: 0,
                        cumulativeWeightRetainedInGm: 0,
                        cumulativeRetainedInPercent: 0,
                        passignPercent: 0,
                    },
                    {
                        sieveSize: '0.600 mm',
                        weightRetainedInGm: 0,
                        cumulativeWeightRetainedInGm: 0,
                        cumulativeRetainedInPercent: 0,
                        passignPercent: 0,
                    },
                    {
                        sieveSize: '0.300 mm',
                        weightRetainedInGm: 0,
                        cumulativeWeightRetainedInGm: 0,
                        cumulativeRetainedInPercent: 0,
                        passignPercent: 0,
                    },
                    {
                        sieveSize: '0.150 mm',
                        weightRetainedInGm: 0,
                        cumulativeWeightRetainedInGm: 0,
                        cumulativeRetainedInPercent: 0,
                        passignPercent: 0,
                    },
                ],
            },
        };
    } else if (taskType === TEST_TYPES.NATURAL_MOISTURE_CONTENT) {
        return {
            sampleNo: {
                title: 'Sample no',
                value: sampleNum,
            },
            details: {
                titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
                values: [
                    {
                        description: 'Weight of container + wet Soil in gm (W1)',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description: 'Weight of container + Dry Soil in gm (W2)',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description: 'Weight of container (W3) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Weight of Water (W4 = W1-W2) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Weight of Dry Soil (W5 = W2-W3) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Moisture Content = (W4/W5)x100 in %',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Avg. Moisture Content',
                        avgMoistureContent: 0,
                    },
                ],
            },
        };
    } else if (taskType === TEST_TYPES.SPECIFIC_GRAVITY_AND_WATER_ABSORPTION) {
        return {
            sampleNo: {
                title: 'Sample no',
                value: sampleNum,
            },
            details: {
                titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
                values: [
                    {
                        description: 'Temperature of Water in C',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description: 'Pycnometer Bottle No.',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description: 'Weight of SSD Sample in gm (W1) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description:
                            'Weight of Pycnometer Bottle + water + Sample (W2) in gm ',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description: 'Weight of Pycnometer Bottle + water (W3) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description: 'Weight of oven dry sample (W4) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Specific Gravity = W4/(W4-(W2-W3))',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Apparent Specific Gravity= W4/(W4-(W2-W3))',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Water Absorption= 100 x (W1-W4)/W4 in %',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Avg. Specific Gravity',
                        avgSpecificGravity: 0,
                    },
                    {
                        hide: true,
                        description: 'Avg. Water Absorption in %',
                        avgWaterAbsorption: 0,
                    },
                ],
            },
        };
    }
};

export const getTestSampleCementCoarseAggregateObject = (
    sampleNum: any,
    taskType: string,
) => {
    if (taskType === TEST_TYPES.GRADATION) {
        if (sampleNum === 1) {
            return {
                weightOfSample: 0,
                sampleNo: {
                    title: 'Sample no',
                    value: 'Sieve Analysis (for 40mm)',
                },
                details: {
                    titles: [
                        'Sieve Size',
                        'Weight retained in gm',
                        'Cumulative weight retained in gm',
                        'Cumulative retained in %',
                        '% Passing',
                    ],
                    values: [
                        {
                            sieveSize: '63.0 mm',
                            weightRetainedInGm: 0,
                            cumulativeWeightRetainedInGm: 0,
                            cumulativeRetainedInPercent: 0,
                            passignPercent: 0,
                        },
                        {
                            sieveSize: '40.0 mm',
                            weightRetainedInGm: 0,
                            cumulativeWeightRetainedInGm: 0,
                            cumulativeRetainedInPercent: 0,
                            passignPercent: 0,
                        },
                        {
                            sieveSize: '20.0 mm',
                            weightRetainedInGm: 0,
                            cumulativeWeightRetainedInGm: 0,
                            cumulativeRetainedInPercent: 0,
                            passignPercent: 0,
                        },
                        {
                            sieveSize: '10.0 mm',
                            weightRetainedInGm: 0,
                            cumulativeWeightRetainedInGm: 0,
                            cumulativeRetainedInPercent: 0,
                            passignPercent: 0,
                        },
                    ],
                },
            };
        } else if (sampleNum === 2) {
            return {
                sampleNo: {
                    title: 'Sample no',
                    value: 'Sieve Analysis (for 20mm)',
                },
                details: {
                    titles: [
                        'Sieve Size',
                        'Weight retained in gm',
                        'Cumulative weight retained in gm',
                        'Cumulative retained in %',
                        '% Passing',
                    ],
                    values: [
                        {
                            sieveSize: '40.0 mm',
                            weightRetainedInGm: 0,
                            cumulativeWeightRetainedInGm: 0,
                            cumulativeRetainedInPercent: 0,
                            passignPercent: 0,
                        },
                        {
                            sieveSize: '20.0 mm',
                            weightRetainedInGm: 0,
                            cumulativeWeightRetainedInGm: 0,
                            cumulativeRetainedInPercent: 0,
                            passignPercent: 0,
                        },
                        {
                            sieveSize: '10.0 mm',
                            weightRetainedInGm: 0,
                            cumulativeWeightRetainedInGm: 0,
                            cumulativeRetainedInPercent: 0,
                            passignPercent: 0,
                        },
                        {
                            sieveSize: '4.75 mm',
                            weightRetainedInGm: 0,
                            cumulativeWeightRetainedInGm: 0,
                            cumulativeRetainedInPercent: 0,
                            passignPercent: 0,
                        },
                    ],
                },
            };
        } else if (sampleNum === 3) {
            return {
                sampleNo: {
                    title: 'Sample no',
                    value: 'Sieve Analysis (for 10mm)',
                },
                details: {
                    titles: [
                        'Sieve Size',
                        'Weight retained in gm',
                        'Cumulative weight retained in gm',
                        'Cumulative retained in %',
                        '% Passing',
                    ],
                    values: [
                        {
                            sieveSize: '12.5 mm',
                            weightRetainedInGm: 0,
                            cumulativeWeightRetainedInGm: 0,
                            cumulativeRetainedInPercent: 0,
                            passignPercent: 0,
                        },
                        {
                            sieveSize: '10.0 mm',
                            weightRetainedInGm: 0,
                            cumulativeWeightRetainedInGm: 0,
                            cumulativeRetainedInPercent: 0,
                            passignPercent: 0,
                        },
                        {
                            sieveSize: '4.75 mm',
                            weightRetainedInGm: 0,
                            cumulativeWeightRetainedInGm: 0,
                            cumulativeRetainedInPercent: 0,
                            passignPercent: 0,
                        },
                        {
                            sieveSize: '2.36 mm',
                            weightRetainedInGm: 0,
                            cumulativeWeightRetainedInGm: 0,
                            cumulativeRetainedInPercent: 0,
                            passignPercent: 0,
                        },
                    ],
                },
            };
        }
    } else if (taskType === TEST_TYPES.LOS_ANGELES_ABRATION) {
        return {
            sampleNo: {
                title: 'Sample no',
                value: sampleNum,
            },
            details: {
                titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
                values: [
                    {
                        description: 'Initial Weight (W1) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description: 'Weight retained after test on 1.70mm (W2) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description:
                            'Los Angeles Abrasion Value  in % = {(W1-W2)/W1}x100',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Average Los Angeles Abrasion Value',
                        avgLosAngelesAbrasion: 0,
                    },
                ],
            },
        };
    } else if (taskType === TEST_TYPES.SPECIFIC_GRAVITY_AND_WATER_ABSORPTION) {
        return {
            sampleNo: {
                title: 'Sample no',
                value: sampleNum,
            },
            details: {
                titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
                values: [
                    {
                        description:
                            'Weight of Saturated aggregate and Basket in water (W1) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description:
                            'Weight of saturated Surface dry aggregate in air (W2) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description: 'Weight of oven dried aggregate in air (W3) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Specific Gravity = W3/ (W3-W1)',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Apparent Specific Gravity = W3/(W3-W1)',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Water Absorption (%) = 100 x (W2-W3)/W3',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Avg. Specific Gravity',
                        avgSpecificGravity: 0,
                    },
                    {
                        hide: true,
                        description: 'Avg. Water Absorption in %',
                        avgWaterAbsorption: 0,
                    },
                ],
            },
        };
    } else if (taskType === TEST_TYPES.NATURAL_MOISTURE_CONTENT) {
        return {
            sampleNo: {
                title: 'Sample no',
                value: sampleNum,
            },
            details: {
                titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
                values: [
                    {
                        description: 'Weight of container + wet Soil in gm (W1)',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description: 'Weight of container + Dry Soil in gm (W2)',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description: 'Weight of container (W3) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Weight of Water (W4 = W1-W2) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Weight of Dry Soil (W5 = W2-W3) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Moisture Content = (W4/W5)x100 in %',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Avg. Moisture Content',
                        avgMoistureContent: 0,
                    },
                ],
            },
        };
    } else if (taskType === TEST_TYPES.AGGREGATE_IMPACT_VALUE) {
        return {
            sampleNo: {
                title: 'Sample no',
                value: sampleNum,
            },
            details: {
                titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
                values: [
                    {
                        description:
                            'Weight of Surface dry sample passing 12.5 mm and retained on 10 mm IS sieves (W1) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description:
                            'Weight of fraction passing 2.36 mm sieve after the test (W2) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        description:
                            'Weight of fraction retained on 2.36 mm sieve after the test (W3) in gm',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Loss in weight (W4 = W1-(W2+W3))',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Aggregate Impact Value (AIV = W2/W1 *100)',
                        test1: 0,
                        test2: 0,
                        test3: 0,
                    },
                    {
                        hide: true,
                        description: 'Average AIV Value',
                        avgAIVValue: 0,
                    },
                ],
            },
        };
    } else if (taskType === TEST_TYPES.FI_EI) {
        return {
            weightOfSample: 0,
            sampleNo: {
                title: 'Sample no',
                value: 1,
            },
            details: {
                titles: [
                    'Size fraction of aggregate passing on IS Sieve in mm',
                    'Size fraction of aggregate retained on IS Sieves (mm)',
                    'Total weight of aggregate retained in gm',
                    'Weight passing on flakiness gauge in gm',
                    'Weight retained on flakiness gauge in gm',
                    'Weight retained on elongation gauge in mm',
                ],
                values: [
                    {
                        sizeFraction: '63.0',
                        sizeFractionOfAggregateRetained: '50.0',
                        totalWeightOfAggregateRetained: 0,
                        weightPassingFlakinessGauge: 0,
                        weightRetainedFlakinessGauge: 0,
                        weightRetainedElongationGauge: 0,
                    },
                    {
                        sizeFraction: '50.0',
                        sizeFractionOfAggregateRetained: '40.0',
                        totalWeightOfAggregateRetained: 0,
                        weightPassingFlakinessGauge: 0,
                        weightRetainedFlakinessGauge: 0,
                        weightRetainedElongationGauge: 0,
                    },
                    {
                        sizeFraction: '40.0',
                        sizeFractionOfAggregateRetained: '31.5',
                        totalWeightOfAggregateRetained: 0,
                        weightPassingFlakinessGauge: 0,
                        weightRetainedFlakinessGauge: 0,
                        weightRetainedElongationGauge: 0,
                    },
                    {
                        sizeFraction: '31.5',
                        sizeFractionOfAggregateRetained: '25.0',
                        totalWeightOfAggregateRetained: 0,
                        weightPassingFlakinessGauge: 0,
                        weightRetainedFlakinessGauge: 0,
                        weightRetainedElongationGauge: 0,
                    },
                    {
                        sizeFraction: '25.0',
                        sizeFractionOfAggregateRetained: '20.0',
                        totalWeightOfAggregateRetained: 0,
                        weightPassingFlakinessGauge: 0,
                        weightRetainedFlakinessGauge: 0,
                        weightRetainedElongationGauge: 0,
                    },
                    {
                        sizeFraction: '20.0',
                        sizeFractionOfAggregateRetained: '16.0',
                        totalWeightOfAggregateRetained: 0,
                        weightPassingFlakinessGauge: 0,
                        weightRetainedFlakinessGauge: 0,
                        weightRetainedElongationGauge: 0,
                    },
                    {
                        sizeFraction: '16.0',
                        sizeFractionOfAggregateRetained: '12.5',
                        totalWeightOfAggregateRetained: 0,
                        weightPassingFlakinessGauge: 0,
                        weightRetainedFlakinessGauge: 0,
                        weightRetainedElongationGauge: 0,
                    },
                    {
                        sizeFraction: '12.5',
                        sizeFractionOfAggregateRetained: '10.0',
                        totalWeightOfAggregateRetained: 0,
                        weightPassingFlakinessGauge: 0,
                        weightRetainedFlakinessGauge: 0,
                        weightRetainedElongationGauge: 0,
                    },
                    {
                        sizeFraction: '10.0',
                        sizeFractionOfAggregateRetained: '6.3',
                        totalWeightOfAggregateRetained: 0,
                        weightPassingFlakinessGauge: 0,
                        weightRetainedFlakinessGauge: 0,
                        weightRetainedElongationGauge: 0,
                    },
                    {
                        hide: true,
                        sizeFraction: 'Total',
                        sizeFractionOfAggregateRetained: '',
                        totalWeightOfAggregateRetained: 0,
                        weightPassingFlakinessGauge: 0,
                        weightRetainedFlakinessGauge: 0,
                        weightRetainedElongationGauge: 0,
                    },
                ],
            },
        };
    }
};