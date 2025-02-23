//CTSB-Gration
export const getCTSBGrationTestSampleObject = (sampleNum: any) => {
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

//CTSB-Water Absorption
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
//CTSB-Aterberrg Limit
export const getGrainSizeAnalysisTestSampleObject = (sampleNum: any) => {
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

//CSTB-AIV
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
//CSTB-CBR  (Doubt)
export const getCBRTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: [],
      values: [
        {
          desc: 'Description',
          mouldNoTitle1: 'Mould No.',
          mouldNo1: 0.0,
          mouldNoTitle2: 'Mould No.',
          mouldNo2: 0.0,
          mouldNoTitle3: 'Mould No.',
          mouldNo3: 0.0,
        },
        {
          desc: 'Condition of Sample (Before Soaking/ After Soaking)',
          mouldNo1Before: 'Before',
          mouldNo1After: 'After',
          mouldNo2Before: 'Before',
          mouldNo2After: 'After',
          mouldNo3Before: 'Before',
          mouldNo3After: 'After',
        },
        {
          desc: 'No. of layers',
          mouldNo1BeforeVal: 0.0,
          mouldNo1AfterVal: 0.0,
          mouldNo2BeforeVal: 0.0,
          mouldNo2AfterVal: 0.0,
          mouldNo3BeforeVal: 0.0,
          mouldNo3AfterVal: 0.0,
        },
        {
          desc: 'No. of Blows per layer',
          mouldNo1BeforeVal: 0.0,
          mouldNo1AfterVal: 0.0,
          mouldNo2BeforeVal: 0.0,
          mouldNo2AfterVal: 0.0,
          mouldNo3BeforeVal: 0.0,
          mouldNo3AfterVal: 0.0,
        },
        {
          desc: 'Wt. of mould W1 in gm',
          mouldNo1BeforeVal: 0.0,
          mouldNo1AfterVal: 0.0,
          mouldNo2BeforeVal: 0.0,
          mouldNo2AfterVal: 0.0,
          mouldNo3BeforeVal: 0.0,
          mouldNo3AfterVal: 0.0,
        },
        {
          desc: 'Wt. of wet soil + Mould W2 in gm',
          mouldNo1BeforeVal: 0.0,
          mouldNo1AfterVal: 0.0,
          mouldNo2BeforeVal: 0.0,
          mouldNo2AfterVal: 0.0,
          mouldNo3BeforeVal: 0.0,
          mouldNo3AfterVal: 0.0,
        },
        {
          desc: 'Volume of Mould (V) in cc',
          mouldNo1BeforeVal: 0.0,
          mouldNo1AfterVal: 0.0,
          mouldNo2BeforeVal: 0.0,
          mouldNo2AfterVal: 0.0,
          mouldNo3BeforeVal: 0.0,
          mouldNo3AfterVal: 0.0,
        },
        {
          desc: 'Container No',
          mouldNo1BeforeVal: 0.0,
          mouldNo1AfterVal: 0.0,
          mouldNo2BeforeVal: 0.0,
          mouldNo2AfterVal: 0.0,
          mouldNo3BeforeVal: 0.0,
          mouldNo3AfterVal: 0.0,
        },
        {
          desc: 'Wt. of container W5 in gm',
          mouldNo1BeforeVal: 0.0,
          mouldNo1AfterVal: 0.0,
          mouldNo2BeforeVal: 0.0,
          mouldNo2AfterVal: 0.0,
          mouldNo3BeforeVal: 0.0,
          mouldNo3AfterVal: 0.0,
        },
        {
          desc: 'Wt. of Wet soil + container W6 in gm',
          mouldNo1BeforeVal: 0.0,
          mouldNo1AfterVal: 0.0,
          mouldNo2BeforeVal: 0.0,
          mouldNo2AfterVal: 0.0,
          mouldNo3BeforeVal: 0.0,
          mouldNo3AfterVal: 0.0,
        },
        {
          desc: 'Wt. of dry soil + container W7 in gm',
          mouldNo1BeforeVal: 0.0,
          mouldNo1AfterVal: 0.0,
          mouldNo2BeforeVal: 0.0,
          mouldNo2AfterVal: 0.0,
          mouldNo3BeforeVal: 0.0,
          mouldNo3AfterVal: 0.0,
        },
      ],
    },
    details2: {
      titles: [],
      values: [
        {
          desc: 'Penetration (mm)',
          mouldNoTitle1: 'Mould No.',
          mouldNo1: 0.0,
          mouldNoTitle2: 'Mould No.',
          mouldNo2: 0.0,
          mouldNoTitle3: 'Mould No.',
          mouldNo3: 0.0,
        },
        {
          desc: '',
          mouldNo1ProvingRingReading: 'Proving Ring Reading',
          mouldNo1CorrectedLoad: 'Corrected Load (Kg)',
          mouldNo2ProvingRingReading: 'Proving Ring Reading',
          mouldNo2CorrectedLoad: 'Corrected Load (Kg)',
          mouldNo3ProvingRingReading:
            'Proving Ring ReadingProving Ring Reading',
          mouldNo3CorrectedLoad: 'Corrected Load (Kg)',
        },
        {
          desc: '0.50',
          mouldNo1ProvingRingReading: 0.0,
          mouldNo1CorrectedLoad: '',
          mouldNo2ProvingRingReading: 0.0,
          mouldNo2CorrectedLoad: '',
          mouldNo3ProvingRingReading: 0.0,
          mouldNo3CorrectedLoad: '',
        },
        {
          desc: '1.00',
          mouldNo1ProvingRingReading: 0.0,
          mouldNo1CorrectedLoad: '',
          mouldNo2ProvingRingReading: 0.0,
          mouldNo2CorrectedLoad: '',
          mouldNo3ProvingRingReading: 0.0,
          mouldNo3CorrectedLoad: '',
        },
        {
          desc: '1.50',
          mouldNo1ProvingRingReading: 0.0,
          mouldNo1CorrectedLoad: '',
          mouldNo2ProvingRingReading: 0.0,
          mouldNo2CorrectedLoad: '',
          mouldNo3ProvingRingReading: 0.0,
          mouldNo3CorrectedLoad: '',
        },
        {
          desc: '2.00',
          mouldNo1ProvingRingReading: 0.0,
          mouldNo1CorrectedLoad: '',
          mouldNo2ProvingRingReading: 0.0,
          mouldNo2CorrectedLoad: '',
          mouldNo3ProvingRingReading: 0.0,
          mouldNo3CorrectedLoad: '',
        },
        {
          desc: '2.50',
          mouldNo1ProvingRingReading: 0.0,
          mouldNo1CorrectedLoad: '',
          mouldNo2ProvingRingReading: 0.0,
          mouldNo2CorrectedLoad: '',
          mouldNo3ProvingRingReading: 0.0,
          mouldNo3CorrectedLoad: '',
        },
        {
          desc: '3.00',
          mouldNo1ProvingRingReading: 0.0,
          mouldNo1CorrectedLoad: '',
          mouldNo2ProvingRingReading: 0.0,
          mouldNo2CorrectedLoad: '',
          mouldNo3ProvingRingReading: 0.0,
          mouldNo3CorrectedLoad: '',
        },
        {
          desc: '4.00',
          mouldNo1ProvingRingReading: 0.0,
          mouldNo1CorrectedLoad: '',
          mouldNo2ProvingRingReading: 0.0,
          mouldNo2CorrectedLoad: '',
          mouldNo3ProvingRingReading: 0.0,
          mouldNo3CorrectedLoad: '',
        },
        {
          desc: '5.00',
          mouldNo1ProvingRingReading: 0.0,
          mouldNo1CorrectedLoad: '',
          mouldNo2ProvingRingReading: 0.0,
          mouldNo2CorrectedLoad: '',
          mouldNo3ProvingRingReading: 0.0,
          mouldNo3CorrectedLoad: '',
        },
        {
          desc: '7.50',
          mouldNo1ProvingRingReading: 0.0,
          mouldNo1CorrectedLoad: '',
          mouldNo2ProvingRingReading: 0.0,
          mouldNo2CorrectedLoad: '',
          mouldNo3ProvingRingReading: 0.0,
          mouldNo3CorrectedLoad: '',
        },
        {
          desc: '10.00',
          mouldNo1ProvingRingReading: 0.0,
          mouldNo1CorrectedLoad: '',
          mouldNo2ProvingRingReading: 0.0,
          mouldNo2CorrectedLoad: '',
          mouldNo3ProvingRingReading: 0.0,
          mouldNo3CorrectedLoad: '',
        },
        {
          desc: '12.50',
          mouldNo1ProvingRingReading: 0.0,
          mouldNo1CorrectedLoad: '',
          mouldNo2ProvingRingReading: 0.0,
          mouldNo2CorrectedLoad: '',
          mouldNo3ProvingRingReading: 0.0,
          mouldNo3CorrectedLoad: '',
        },
      ],
    },
  };
};
//CSTB-Density After Compaction/Field Dry Density
export const getDensitAfterCompactionTestSampleObject = (sampleNum: any) => {
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
    details2: {
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
};
//CSTB-Moisture Content
export const getMoistureContentTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
      values: [
        {
          description: 'Container no.',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Weight of empty container (W1)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Weight of container + wet soil (W2)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Weight of container + weight Dry Soil in gm (W4)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
        {
          description: 'Weight of water in gm(W6)= (W3-W5)',
          test1: 0,
          test2: 0,
          test3: 0,
        },
      ],
    },
  };
};
