//Coarse Aggregate - WMM - FI & EI
export const getTestSampleFIEIObjectBSB = (sampleNum: any) => {
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
        'Weight retained on elongation gauge in mm',
      ],
      values: [
        {
          sizeFractionOfAggregatePassing: '63.5',
          sizeFractionOfAggregateRetained: '50.0',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '50.0',
          sizeFractionOfAggregateRetained: '40.0',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '40.0',
          sizeFractionOfAggregateRetained: '31.5',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '31.5',
          sizeFractionOfAggregateRetained: '25.0',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '25.0',
          sizeFractionOfAggregateRetained: '20.0',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '20.0',
          sizeFractionOfAggregateRetained: '16.0',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '16.0',
          sizeFractionOfAggregateRetained: '12.5',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '12.5',
          sizeFractionOfAggregateRetained: '10.0',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
        {
          sizeFractionOfAggregatePassing: '10.0',
          sizeFractionOfAggregateRetained: '6.3',
          totalWeightOfAggregateRetained: 0,
          weightPassingOnFlakinessGauge: 0,
          weightRetainedOnElongationGauge: 0,
        },
      ],
    },
  };
};
//Coarse Aggregate - WMM - AIV(D)
export const getTestSampleAIVObjectBSB = (sampleNum: any) => {
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
      ],
    },
  };
};
//Fine Aggregate-WMM-Aterberrg Limit(D)
export const getGrainSizeAnalysisTestSampleObjectBSB = (sampleNum: any) => {
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
          description: 'Wt.of Container and Dry Soil (W3) gm ',
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
          // pl1: 'Avg :',
          // pl2: '',
        },
      ],
    },
  };
};
//WMM-Gration(D)
export const getCTSBGrationTestSampleObjectBSB = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    totalInGram: 0,
    details: {
      titles: ['Sieve Size', 'Weight Retained in gm'],
      values: [
        {
          isSieveSize: '53.00 mm',
          weightRetained: 0,
        },
        {
          isSieveSize: '37.50 mm',
          weightRetained: 0,
        },
        {
          isSieveSize: '19.00 mm',
          weightRetained: 0,
        },
        {
          isSieveSize: '9.50 mm',
          weightRetained: 0,
        },
        {
          isSieveSize: '4.75 mm',
          weightRetained: 0,
        },
        {
          isSieveSize: '600 micron',
          weightRetained: 0,
        },
        {
          isSieveSize: '300 micron',
          weightRetained: 0,
        },
        {
          isSieveSize: '75 micron',
          weightRetained: 0,
        },
      ],
    },
  };
};
//WMM-Water Absorption(D)
export const getWaterAbsorptionObjectBSB = (sampleNum: any) => {
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
//WMM - Field Dry Density(D)
export const getFieldDryDensitySampleObjectBSB = (sampleNum: any) => {
  if (sampleNum === 1) {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
        values: [
          {
            description: 'Weight of wet material from hole in gm (Ww)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of sand + cylinder before puring (W1) in gm',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of sand + cylinder after puring (W2) in gm',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of Sand in cone (W3) in gm',
            test1: 0,
            test2: 0,
            test3: 0,
          },
        ],
      },
    };
  } else if (sampleNum === 2) {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
        values: [
          {
            description: 'Water content container no.',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of wet GSB in gm (W5)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of Dry GSB in gm (W6)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
        ],
      },
    };
  }
};
//WMM - Proctor Density Test
export const getProctorDensityTestSampleObjectBSB = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: [
        'Description',
        'Test 1',
        'Test 2',
        'Test 3',
        'Test 4',
        'Test 5',
        'Test 6',
      ],
      values: [
        {
          description: 'Weight of mould in gm (A)',
          test1: 0,
          test2: 0,
          test3: 0,
          test4: 0,
          test5: 0,
          test6: 0,
        },
        {
          description: 'Volume of mould in cc (V)',
          test1: 0,
          test2: 0,
          test3: 0,
          test4: 0,
          test5: 0,
          test6: 0,
        },
        {
          description: 'Weight of wet soil + mould in gm (D)',
          test1: 0,
          test2: 0,
          test3: 0,
          test4: 0,
          test5: 0,
          test6: 0,
        },
        {
          description: 'Container No.',
          test1: 0,
          test2: 0,
          test3: 0,
          test4: 0,
          test5: 0,
          test6: 0,
        },
        {
          description: 'Weight of Container in gm (H)',
          test1: 0,
          test2: 0,
          test3: 0,
          test4: 0,
          test5: 0,
          test6: 0,
        },
        {
          description: 'Weight of wet soil + container in gm (J)',
          test1: 0,
          test2: 0,
          test3: 0,
          test4: 0,
          test5: 0,
          test6: 0,
        },
        {
          description: 'Weight of dry Soil + Container in gm (K)',
          test1: 0,
          test2: 0,
          test3: 0,
          test4: 0,
          test5: 0,
          test6: 0,
        },
      ],
    },
  };
};

