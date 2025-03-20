//Expansion Joint -> Anchorage Pull Out Test
export const getAnchoragePullOutTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    numberOfAnchorages: '',
    loadToBeApplied: '',
    effectiveRamArea: '',
    appliedPressure: '',
    details: {
      titles: ['Sl. No.', 'Observation', 'Acceptance'],
      values: [
        {
          slNo: '1',
          observation: '',
          acceptance: 'Y',
        },
      ],
    },
  };
};

//Expansion Joint -> Cyclic Motion Test  Doubt
export const getCyclicMotionTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    testDuration: '',
    detailsObs: {
      titles: ['', 'From', 'To'],
      values: [
        {
          description: 'Design Movement(mm)',
          from: 0.0,
          to: 0.0,
        },
        {
          description: 'Design Movement(mm)',
          from: '',
          to: '',
        },
      ],
    },
    details: {
      titles: ['Sl. No.', 'Observation', 'Acceptance'],
      values: [
        {
          slNo: '1',
          observation: '',
          acceptance: 'Y',
        },
      ],
    },
  };
};

//Expansion Joint -> Debris Expulsion Test
export const getDebrisExpulsionTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    weightOfDebrisFilled: 0.0,
    weightOfDebrisExpelled: 0.0,
    actualWeightOfDebris: 0.0,
    numberOfCycleRuns: 0.0,
    isDebrisExpulsion: 0.0,
  };
};

//Expansion Joint -> Dye Penetration Test
export const getDyePenetrationTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    cleanerUsed: '',
    penetrantUsed: '',
    developerUsed: '',
    penetrantTime: '',
    details: {
      titles: ['Sr. No.', 'Observation', 'Acceptance'],
      values: [
        {
          slNo: '1',
          observation: '',
          acceptance: 'Y',
        },
      ],
    },
  };
};

//Expansion Joint -> Ponding Test
export const getPondingTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    actualHeightOfWater: 0.0,
    testDuration: '',
    details: {
      titles: ['Sr. No.', 'Observation', 'Acceptance'],
      values: [
        {
          slNo: '1',
          observation: '',
          acceptance: 'Y',
        },
      ],
    },
  };
};

//Expansion Joint -> Seal Pull Test
export const getSealPullTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    actualExtensionBefore: 0.0,
    sealNotSlip: 'Y',
    details: {
      titles: ['', 'From', 'To'],
      values: [
        {
          description: 'Design Movement(mm)',
          from: 0.0,
          to: 0.0,
        },
      ],
    },
  };
};

//Expansion Joint -> Visual & Dimension Test
export const getVisualDimensionTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    detailsObs: {
      titles: [
        'Item',
        'Dimension as per Approved Drawing (MM)',
        'Observed Value',
      ],
      values: [
        {
          description: 'Joints Segment Length',
          approved: 0.0,
          observed: 0.0,
        },
        {
          description: 'C/C SPACING OF LOOP',
          approved: 0.0,
          observed: 0.0,
        },
        {
          description: 'DIA OF LOOP',
          approved: 0.0,
          observed: 0.0,
        },
        {
          description: 'EDGE BEAM',
          approved: 0.0,
          observed: 0.0,
        },
        {
          description: 'Box to Box C/C',
          approved: 0.0,
          observed: 0.0,
        },
        {
          description: 'Center Beam',
          approved: 0.0,
          observed: 0.0,
        },
      ],
    },

    welding: '',
    surfaceFinish: '',
    strightness: '',
    details: {
      titles: ['', 'From', 'To'],
      values: [
        {
          description: 'Design Movement(mm)',
          from: 0.0,
          to: 0.0,
        },
      ],
    },
  };
};
