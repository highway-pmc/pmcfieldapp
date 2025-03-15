//EarthWork->Soil->Borrow Area->CBR  (Doubt)
export const getCBRTestSampleObject = (sampleNum: any) => {
  if (sampleNum === 1) {
    return {
      sampleNo: {
        title: 'A) Moisture Content & Dry Density Determination',
        value: sampleNum,
      },
      details: {
        titles: [],
        values: [
          {
            desc1: 'Description',
            desc2: 'Mould No.',
            mouldNo1: 0.0,
            desc3: 'Mould No.',
            mouldNo2: 0.0,
            desc4: 'Mould No.',
            mouldNo3: 0.0,
          },
          {
            desc1: 'Condition of Sample (Before Soaking/ After Soaking)',
            desc2: 'Before',
            desc3: 'After',
            desc4: 'Before',
            desc5: 'After',
            desc6: 'Before',
            desc7: 'After',
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
    };
  } else if (sampleNum === 2) {
    return {
      sampleNo: {
        title: 'B) Load - Penetration Test Data:',
        value: sampleNum,
      },
      details: {
        titles: [],
        values: [
          {
            desc1: 'Penetration (mm)',
            desc2: 'Mould No.',
            mouldNo1: 0.0,
            desc3: 'Mould No.',
            mouldNo2: 0.0,
            desc4: 'Mould No.',
            mouldNo3: 0.0,
          },
          {
            desc1: '',
            desc2: 'Proving Ring Reading',
            desc3: 'Corrected Load (Kg)',
            desc4: 'Proving Ring Reading',
            desc5: 'Corrected Load (Kg)',
            desc6: 'Proving Ring ReadingProving Ring Reading',
            desc7: 'Corrected Load (Kg)',
          },
          {
            desc1: '0.50',
            mouldNo1ProvingRingReading: 0.0,
            mouldNo1CorrectedLoad: '',
            mouldNo2ProvingRingReading: 0.0,
            mouldNo2CorrectedLoad: '',
            mouldNo3ProvingRingReading: 0.0,
            mouldNo3CorrectedLoad: '',
          },
          {
            desc1: '1.00',
            mouldNo1ProvingRingReading: 0.0,
            mouldNo1CorrectedLoad: '',
            mouldNo2ProvingRingReading: 0.0,
            mouldNo2CorrectedLoad: '',
            mouldNo3ProvingRingReading: 0.0,
            mouldNo3CorrectedLoad: '',
          },
          {
            desc1: '1.50',
            mouldNo1ProvingRingReading: 0.0,
            mouldNo1CorrectedLoad: '',
            mouldNo2ProvingRingReading: 0.0,
            mouldNo2CorrectedLoad: '',
            mouldNo3ProvingRingReading: 0.0,
            mouldNo3CorrectedLoad: '',
          },
          {
            desc1: '2.00',
            mouldNo1ProvingRingReading: 0.0,
            mouldNo1CorrectedLoad: '',
            mouldNo2ProvingRingReading: 0.0,
            mouldNo2CorrectedLoad: '',
            mouldNo3ProvingRingReading: 0.0,
            mouldNo3CorrectedLoad: '',
          },
          {
            desc1: '2.50',
            mouldNo1ProvingRingReading: 0.0,
            mouldNo1CorrectedLoad: '',
            mouldNo2ProvingRingReading: 0.0,
            mouldNo2CorrectedLoad: '',
            mouldNo3ProvingRingReading: 0.0,
            mouldNo3CorrectedLoad: '',
          },
          {
            desc1: '3.00',
            mouldNo1ProvingRingReading: 0.0,
            mouldNo1CorrectedLoad: '',
            mouldNo2ProvingRingReading: 0.0,
            mouldNo2CorrectedLoad: '',
            mouldNo3ProvingRingReading: 0.0,
            mouldNo3CorrectedLoad: '',
          },
          {
            desc1: '4.00',
            mouldNo1ProvingRingReading: 0.0,
            mouldNo1CorrectedLoad: '',
            mouldNo2ProvingRingReading: 0.0,
            mouldNo2CorrectedLoad: '',
            mouldNo3ProvingRingReading: 0.0,
            mouldNo3CorrectedLoad: '',
          },
          {
            desc1: '5.00',
            mouldNo1ProvingRingReading: 0.0,
            mouldNo1CorrectedLoad: '',
            mouldNo2ProvingRingReading: 0.0,
            mouldNo2CorrectedLoad: '',
            mouldNo3ProvingRingReading: 0.0,
            mouldNo3CorrectedLoad: '',
          },
          {
            desc1: '7.50',
            mouldNo1ProvingRingReading: 0.0,
            mouldNo1CorrectedLoad: '',
            mouldNo2ProvingRingReading: 0.0,
            mouldNo2CorrectedLoad: '',
            mouldNo3ProvingRingReading: 0.0,
            mouldNo3CorrectedLoad: '',
          },
          {
            desc1: '10.00',
            mouldNo1ProvingRingReading: 0.0,
            mouldNo1CorrectedLoad: '',
            mouldNo2ProvingRingReading: 0.0,
            mouldNo2CorrectedLoad: '',
            mouldNo3ProvingRingReading: 0.0,
            mouldNo3CorrectedLoad: '',
          },
          {
            desc1: '12.50',
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
  }
};

//EarthWork->Soil->Borrow Area->Free Swell Index
export const getFreeSwellIndexTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    details: {
      titles: [
        'Sl. No.',
        'Sample level in Water (Vw) ml',
        'Sample level in kerosene (Vk) ml',
      ],
      values: [
        {
          slNo: '1',
          sampleLevelInWater: 0,
          sampleLevelInKerosene: 0,
        },
        {
          slNo: '2',
          sampleLevelInWater: 0,
          sampleLevelInKerosene: 0,
        },
        {
          slNo: '3',
          sampleLevelInWater: 0,
          sampleLevelInKerosene: 0,
        },
        {
          slNo: '4',
          sampleLevelInWater: 0,
          sampleLevelInKerosene: 0,
        },
        {
          slNo: '5',
          sampleLevelInWater: 0,
          sampleLevelInKerosene: 0,
        },
      ],
    },
  };
};
//EarthWork->Soil->Borrow Area->Grain Size Analysis
export const getGrainSizeAnalysisTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    totalInGram: 0,
    details: {
      titles: ['IS Sieve Size (mm)', 'Weight Retained in gm'],
      values: [
        {
          isSieveSize: '100.00',
          weightRetained: 0,
        },
        {
          isSieveSize: '75.00',
          weightRetained: 0,
        },
        {
          isSieveSize: '19.00',
          weightRetained: 0,
        },
        {
          isSieveSize: '4.75',
          weightRetained: 0,
        },
        {
          isSieveSize: '2.00',
          weightRetained: 0,
        },
        {
          isSieveSize: '0.425',
          weightRetained: 0,
        },
        {
          isSieveSize: '0.075',
          weightRetained: 0,
        },
        {
          isSieveSize: 'Pan',
          weightRetained: 0,
        },
      ],
    },
  };
};

//EarthWork->Soil->Borrow Area->Moisture Content
export const getMoistureContentTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      methodUsed: '',
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
//EarthWork->Soil->Borrow Area->Plasticity Index (Doubt)
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
          // pl1:'Avg :' ,
          // pl2: '',
        },
      ],
    },
  };
};
//EarthWork->Soil->Borrow Area->Proctor Density Test
export const getProctorDensityTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      proposedHeightEmbankment: 0.0,
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

//EarthWork->Soil->Sub Grade->Field Dry Density
export const getFieldDryDensityTestSampleObject = (sampleNum: any) => {
  if (sampleNum === 1) {
    return {
      sampleNo: {
        title: 'Sample no',
        value: 'a) Field Density',
      },
      otherInfo: {
        bulkDensitySand: 0.0,
        testPitChainage: 0.0,
        offsetCentreLine: 0.0,
        sideLhsRhs: '',
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
        value: 'b) Moisture Content',
      },
      otherInfo: {
        methodUsed: '',
      },
      details: {
        titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
        values: [
          {
            description: 'Water content container no',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of wet soil in gm (W5)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of Dry Soil in gm (W6)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
        ],
      },
    };
  }
};
