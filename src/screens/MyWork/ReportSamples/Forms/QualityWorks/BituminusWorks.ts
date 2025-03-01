//Bituminus work -> Coarse Aggregate -> FI & EI
export const getTestSampleFIEIObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: [
        'Size fraction of aggregate passing on IS Sieve in mm',
        'Size fraction of aggregate retained on IS Sieves (mm)',
        'Total weight of aggregate retained in gm',
        'Weight passing on flakiness gauge in gm',
        //'Weight retained on flakiness gauge in gm',
        'Weight retained on elongation gauge in mm',
      ],
      values: [
        {
          sizeFractionOfAggregatePassing: '63.5',
          sizeFractionOfAggregateRetained: '50.0',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          // weightRetainedOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '50.0',
          sizeFractionOfAggregateRetained: '40.0',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          // weightRetainedOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '40.0',
          sizeFractionOfAggregateRetained: '31.5',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          // weightRetainedOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '31.5',
          sizeFractionOfAggregateRetained: '25.0',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          // weightRetainedOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '25.0',
          sizeFractionOfAggregateRetained: '20.0',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          // weightRetainedOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '20.0',
          sizeFractionOfAggregateRetained: '16.0',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          // weightRetainedOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '16.0',
          sizeFractionOfAggregateRetained: '12.5',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          // weightRetainedOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '12.5',
          sizeFractionOfAggregateRetained: '10.0',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          // weightRetainedOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '10.0',
          sizeFractionOfAggregateRetained: '6.3',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          // weightRetainedOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
      ],
    },
  };
};
//Bituminus work -> Coarse Aggregate -> AIV
export const getTestSampleAIVObject = (sampleNum: any) => {
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
        // {
        //   description: 'Loss in weight (W4 = W1-(W2+W3))',
        //   test1: 0,
        //   test2: 0,
        //   test3: 0,
        // },
        // {
        //   description: 'Aggregate Impact Value (AIV = W2/W1 *100)',
        //   test1: 0,
        //   test2: 0,
        //   test3: 0,
        // },
        // {
        //   description: 'Average AIV Value = (AIV1+AIV2+AIV3)/3',
        //   test1: 0,
        //   test2: 0,
        //   test3: 0,
        // },
      ],
    },
  };
};
//Bituminus work -> Micro Surfaceing -> Binder Content
//Bituminus work -> SMA -> Binder Content
//Bituminus work -> BC -> Binder Content
//Bituminus work -> DBM/RAP DBM -> Binder Content DBM
export const getTestSampleBinderContentObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
      values: [
        {
          description: 'Weight of Sample before extraction in gm (A)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Weight of Filter paper before extraction in gm (B)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Weight of Sample after extraction in gm (C)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Weight of filter paper after extraction in gm (D)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        // {
        //   description: 'Weight of Bitumen in the mix (E = (A-C) - (D-B))',
        //   test1: 0,
        //   test2: 0,
        //   test3: 0,
        // },
        // {
        //   description: '% of the Bitumen in the total Mix (F= E/A* 100)',
        //   test1: 0,
        //   test2: 0,
        //   test3: 0,
        // },
        // {
        //   description: 'Average Binder Content ((F1+F2+F3)/3)',
        //   test1: 0,
        //   test2: 0,
        //   test3: 0,
        // },
      ],
    },
  };
};
//Bituminus work -> SMA -> Density After Compaction
//Bituminus work -> BC -> Density After Compaction
//Bituminus work -> DBM/RAP DBM -> Density After Compaction DBM
export const getTestSampleDensityAfterCompactionObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
      values: [
        // {
        //   description: '% of Bitumen by weight of Mix (a)',
        //   test1: 0,
        //   test2: 0,
        //   test3: 0,
        // },
        // {
        //   description: '% of aggregate (b= 100 - a)',
        //   test1: 0,
        //   test2: 0,
        //   test3: 0,
        // },
        {
          description: 'Height of Sample in mm (c)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Weight of sample in Air in gm (d)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Weight of sample in water in gm (e)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'SSD weight of Sample in gm (f)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        // {
        //   description: 'Volume of sample in cc (g= f-e)',
        //   test1: 0,
        //   test2: 0,
        //   test3: 0,
        // },
        // {
        //   description: 'Bulk density gm/cc (h = d/g)',
        //   test1: 0,
        //   test2: 0,
        //   test3: 0,
        // },
        // {
        //   description: 'Average of Bulk Density (Gmb= (H1+H2+H3)/3)',
        //   test1: 0,
        //   test2: 0,
        //   test3: 0,
        // },
      ],
    },
  };
};
//Bituminus work -> BC -> BC Stability And Void Analysis
//Bituminus work -> DBM/RAP DBM -> Stability And Void Analysis DBM
//Bituminus work -> SMA -> Stability And Void Analysis SMA
export const getTestSampleBCStabilityAndVoidAnalysisObject = (
  sampleNum: any,
) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
      values: [
        {
          description: '% of Bitumen by weight of Mix (a)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Height of Sample in mm (c)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Weight of sample in Air in gm (d)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Weight of sample in water in gm (e)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'SSD weight of Sample in gm (f)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Load in KN for Marshall Stability (i)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Correction Factor (j)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Flow Value in mm (L)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
      ],
    },
  };
};
//Bituminus work -> BC -> BC Mix Grade I
//Bituminus work -> SMA -> SMA Mix Grading (13mm/19mm)
export const getTestSampleBCMixGradingGradeIObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    totalInGram: 0,
    details: {
      titles: ['Sieve Size', 'Weight retained in gm'],
      values: [
        {
          sieveSize: '26.5 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '19 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '13.2 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '9.5 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '4.75 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '2.36 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '1.18 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.6 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.3 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.15 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.075 mm',
          weightRetained: 0.0,
        },
      ],
    },
  };
};
//Bituminus work -> BC -> BC Mix Grade II
export const getTestSampleBCMixGradingGradeIIObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    totalInGram: 0,
    details: {
      titles: ['Sieve Size', 'Weight retained in gm'],
      values: [
        {
          sieveSize: '19 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '13.2 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '9.5 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '4.75 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '2.36 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '1.18 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.6 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.3 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.15 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.075 mm',
          weightRetained: 0.0,
        },
      ],
    },
  };
};
//Bituminus work -> DBM/RAP DBM -> DBM Mix Grading (Grade-I)
export const getTestSampleDBMMixGradingGradeIObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    totalInGram: 0,
    details: {
      titles: ['Sieve Size', 'Weight retained in gm'],
      values: [
        {
          sieveSize: '45 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '37.5 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '26.5 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '19 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '13.2 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '4.75 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '2.36 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.3 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.075 mm',
          weightRetained: 0.0,
        },
      ],
    },
  };
};
//Bituminus work -> DBM/RAP DBM -> DBM Mix Grading (Grade-II)
export const getTestSampleDBMMixGradingGradeIIObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    totalInGram: 0,
    details: {
      titles: ['Sieve Size', 'Weight retained in gm'],
      values: [
        {
          sieveSize: '45 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '37.5 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '26.5 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '19 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '13.2 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '4.75 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '2.36 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.3 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.075 mm',
          weightRetained: 0.0,
        },
      ],
    },
  };
};
//Bituminus work ->Bitumen -> Softening Point
export const getTestSampleSofteningPointObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    pouringTemp: 0.0,
    details: {
      titles: [
        'Time in Minutes',
        'Ball No. 1 (Temp in °C)',
        'Ball No. 2 (Temp in °C)',
      ],
      values: [
        {
          timeInMin: '1',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '2',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '3',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '4',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '5',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '6',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '7',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '8',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '9',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '10',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '11',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '12',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '13',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '14',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
        {
          timeInMin: '15',
          ballNumber1Temp: 0.0,
          ballNumber2Temp: 0.0,
        },
      ],
    },
  };
};
//Bituminus work ->Bitumen -> Flash & Fire Points
export const getTestSampleFlashFirePointsObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: ['Test Property', 'Test 1', 'Test 2', 'Test 3'],
      values: [
        {
          testProperty: 'Flash Point (°C)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          testProperty: 'Fire Point (°C)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
      ],
    },
  };
};
//Bituminus work ->Bitumen -> Ductility Test
export const getTestSampleDuctilityTestObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    pouringOfCoolingAir: 0.0,
    periodCoolintBeforeTrimming: 0.0,
    periodCoolingAfterTriming: 0.0,
    details: {
      titles: ['Test Property', 'Test 1', 'Test 2', 'Test 3'],
      values: [
        {
          testProperty: 'Ductility value (cm)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
      ],
    },
  };
};
//Bituminus work ->Bitumen -> Bituminous Penetration Test
//BITUMINOUS_PENETRATION_TEST;
export const getTestSampleBituminousPenetrationTestObject = (
  sampleNum: any,
) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    pouringTemp: 0.0,
    periodCoolingTemp: 0.0,
    periodCoolingInWater: 0.0,
    details: {
      titles: ['Test No.', 'Initial Dial Reading', 'Final Dial Reading'],
      values: [
        {
          testNumber: '1',
          initialDialReading: 0.0,
          finalDialReading: 0.0,
        },
        {
          testNumber: '2',
          initialDialReading: 0.0,
          finalDialReading: 0.0,
        },
        {
          testNumber: '2',
          initialDialReading: 0.0,
          finalDialReading: 0.0,
        },
      ],
    },
  };
};
//Bituminus work ->Coarse Aggregate -> Water Absorption
//Bituminus work ->Coarse Aggregate(SMA) -> Water Absorption
export const getWaterAbsorptionObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
      values: [
        {
          testProperty:
            'Weight of Saturated aggregate and Basket in water (W1) in gm',
          test1: 0.0,
          test2: 0.0,
          test3: 0.0,
        },
        {
          testProperty:
            'Weight of saturated Surface dry aggregate in air (W2) in gm',
          test1: 0.0,
          test2: 0.0,
          test3: 0.0,
        },
        {
          testProperty: 'Weight of oven dried aggregate in air (W3) in gm',
          test1: 0.0,
          test2: 0.0,
          test3: 0.0,
        },
      ],
    },
  };
};
//Bituminus work ->Coarse Aggregate -> Percentage of Fractured Face
export const getPercentageOfFracturedFaceObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: ['Description', 'Trial 1', 'Trial 2', 'Trial 3'],
      values: [
        {
          testProperty: 'Wt. of material retained on 4.75 mm sieve (gms)',
          test1: 0.0,
          test2: 0.0,
          test3: 0.0,
        },
        {
          testProperty: 'Wt. of material having at least two fractured faces',
          test1: 0.0,
          test2: 0.0,
          test3: 0.0,
        },
        {
          testProperty: 'Percentage by weight',
          test1: 0.0,
          test2: 0.0,
          test3: 0.0,
        },
      ],
    },
  };
};
//Bituminus work -> Coarse Aggregate(Micro Surfacing) -> Gradation
export const getTestSampleGradationObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    totalInGram: 0,
    details: {
      titles: ['Sieve Size', 'Weight retained in gm'],
      values: [
        {
          sieveSize: '9.5 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '4.75 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '2.36 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '1.18 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.6 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.3 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.15 mm',
          weightRetained: 0.0,
        },
        {
          sieveSize: '0.075 mm',
          weightRetained: 0.0,
        },
      ],
    },
  };
};

//Bituminus work -> Fine Aggregate -> Sand Equivalent
export const getSandEquivalentObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: ['Description', 'Trial 1', 'Trial 2', 'Trial 3'],
      values: [
        {
          testProperty: 'Sand Reading (Sr)',
          test1: 0.0,
          test2: 0.0,
          test3: 0.0,
        },
        {
          testProperty: 'Clay Reading (Cr)',
          test1: 0.0,
          test2: 0.0,
          test3: 0.0,
        },
        {
          testProperty: 'Sand Equivalent Value ( Sr/Cr *100)',
          test1: 0.0,
          test2: 0.0,
          test3: 0.0,
        },
      ],
    },
  };
};

//Bituminus work -> Fine Aggregate -> Plasticity index
export const getPlasticityIndexTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: [
        'Determination No',
        'Liquid Limit 1',
        'Liquid Limit 2',
        'Liquid Limit 3',
        'Liquid Limit 4',
        'Plastic Limit 1',
        'Plastic Limit 2',
      ],
      values: [
        {
          description: 'Container no.',
          l1: 0.0,
          ll2: 0.0,
          ll3: 0.0,
          ll4: 0.0,
          pl1: 0.0,
          pl2: 0.0,
        },
        {
          description: 'Empty Wt.of Container (W1) gm',
          l1: 0.0,
          ll2: 0.0,
          ll3: 0.0,
          ll4: 0.0,
          pl1: 0.0,
          pl2: 0.0,
        },
        {
          description: 'Wt.of Container and Wet Soil (W2) gm',
          l1: 0.0,
          ll2: 0.0,
          ll3: 0.0,
          ll4: 0.0,
          pl1: 0.0,
          pl2: 0.0,
        },
        {
          description: 'Wt.of Container and Dry Soil (W3) gm',
          l1: 0.0,
          ll2: 0.0,
          ll3: 0.0,
          ll4: 0.0,
          pl1: 0.0,
          pl2: 0.0,
        },
        {
          description: 'Wt. of Moisture (W4= W2-W3) gm',
          l1: 0.0,
          ll2: 0.0,
          ll3: 0.0,
          ll4: 0.0,
          pl1: 0.0,
          pl2: 0.0,
        },
        {
          description: 'Wt. of dry material (W5= W3-W1) gm',
          l1: 0.0,
          ll2: 0.0,
          ll3: 0.0,
          ll4: 0.0,
          pl1: 0.0,
          pl2: 0.0,
        },
        {
          description: 'Moisture Content w = 100 x W4/W5 %',
          l1: 0.0,
          ll2: 0.0,
          ll3: 0.0,
          ll4: 0.0,
          pl1: 0.0,
          pl2: 0.0,
        },
        {
          description: 'No. of blows',
          l1: 0.0,
          ll2: 0.0,
          ll3: 0.0,
          ll4: 0.0,
          pl1: 0.0,
          pl2: 0.0,
        },
      ],
    },
  };
};
