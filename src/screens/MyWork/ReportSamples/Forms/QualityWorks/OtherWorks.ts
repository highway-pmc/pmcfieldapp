//Other work -> Bridge -> Bridge Load Test
export const getTestSampleBridgeLoadTestObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    totalInGram: 0,
    otherInfo: {
      namdOfBridge: '',
      spanNumber: '',
      purposeOfLoadTest: '',
    },
    typeOfLoading: '',
    typeOfVehiclesUsed: '',
    // loadDetailsPerVehicle: '',
    // arrangementOfLoad: '',
    // totalTestLoadApplied: '',
    details: {
      titles: [
        'Loading Stage',
        'Deflection at Midspan (L/2) (mm)',
        'Deflection at Quarter Span (L/4)  (mm)',
        'Deflection at Quarter Span (3L/4)  (mm)',
        'Remarks',
      ],
      values: [
        {
          loadingStage: 'Before Start of loading after temp. correction (R1)',
          deflection1: 0.0,
          deflection2: 0.0,
          deflection3: 0.0,
          remark: '',
        },
        {
          loadingStage: '25% Load after temp. correction',
          deflection1: 0.0,
          deflection2: 0.0,
          deflection3: 0.0,
          remark: '',
        },
        {
          loadingStage: '50% Load after temp. correction',
          deflection1: 0.0,
          deflection2: 0.0,
          deflection3: 0.0,
          remark: '',
        },
        {
          loadingStage: '75% Load after temp. correction',
          deflection1: 0.0,
          deflection2: 0.0,
          deflection3: 0.0,
          remark: '',
        },
        {
          loadingStage: '100% Load after temp. correction',
          deflection1: 0.0,
          deflection2: 0.0,
          deflection3: 0.0,
          remark: '',
        },
        {
          loadingStage: 'After 24 hours of Loading after temp. correction (R3)',
          deflection1: 0.0,
          deflection2: 0.0,
          deflection3: 0.0,
          remark: '',
        },
        {
          loadingStage: 'After Unloading after temp. correction',
          deflection1: 0.0,
          deflection2: 0.0,
          deflection3: 0.0,
          remark: '',
        },
        {
          loadingStage:
            'No Live Load on Superstructure Afterremoving Vehicles & temp. correction',
          deflection1: 0.0,
          deflection2: 0.0,
          deflection3: 0.0,
          remark: '',
        },
        {
          loadingStage:
            'After 24 hours of Removal of Loading after temp. correction (R5)',
          deflection1: 0.0,
          deflection2: 0.0,
          deflection3: 0.0,
          remark: '',
        },
      ],
    },
    details2: {
      titles: ['LOCATION', 'THEORETICAL DEFLECTION (mm)', 'Remark'],
      values: [
        {
          location: 'Deflection at Midspan (L/2) (mm)',
          deflection: 0.0,
          remark: '',
        },
        {
          location: 'Deflection at Quarter Span (L/4)  (mm)',
          deflection: 0.0,
          remark: '',
        },
        {
          location: 'Deflection at Quarter Span (3L/4)  (mm)',
          deflection: 0.0,
          remark: '',
        },
      ],
    },
  };
};

//Other work -> Road Making -> Reflectivity
export const getReflectivityObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      noOfTest: 0.0,
    },
    typeOfSignBoard: '',
    cancelAnimationFramehainage: '',
    Side: '',
    color: '',
    glassBeads: '',
    measuredLux: '',
    conditionOfMarkingSurface: '',
    visibilityConditionNight: '',
    cleanlinessOfMarking: '',
    anyDamageObstruction: '',
    meetsMoRTHRetroReflectivityStandards: '',
  };
};
//Other work -> Road Making -> Reflectivity
export const getSofteningPointObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      materialType: 0.0,
    },
    details: {
      titles: ['Trial No.', 'Softening Point Temperature (°C)'],
      values: [
        {
          trial: 'Trial 1',
          temp: 0.0,
        },
        {
          trial: 'Trial 2',
          temp: 0.0,
        },
      ],
    },
  };
};

//Other work -> Sign Board
export const getDimensionSignBoardsObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      noOfTest: 0.0,
    },
    details: {
      titles: [
        'S. No.',
        'Parameter',
        'Specified Dimension (mm)',
        'Measured Dimension(mm)',
        'Remarks',
      ],
      values: [
        {
          sNo: '1',
          parameter: 'Length of Board',
          specifiedDimension: 0.0,
          measuredDimension: 0.0,
          remark: '',
        },
        {
          sNo: '2',
          parameter: 'Width of Board',
          specifiedDimension: 0.0,
          measuredDimension: 0.0,
          remark: '',
        },
        {
          sNo: '3',
          parameter: 'Thickness of Board',
          specifiedDimension: 0.0,
          measuredDimension: 0.0,
          remark: '',
        },
        {
          sNo: '4',
          parameter: 'Letter Height',
          specifiedDimension: 0.0,
          measuredDimension: 0.0,
          remark: '',
        },
        {
          sNo: '5',
          parameter: 'Symbol Size',
          specifiedDimension: 0.0,
          measuredDimension: 0.0,
          remark: '',
        },
        {
          sNo: '6',
          parameter: 'Border Size',
          specifiedDimension: 0.0,
          measuredDimension: 0.0,
          remark: '',
        },
        {
          sNo: '7',
          parameter: 'Margin Clearance',
          specifiedDimension: 0.0,
          measuredDimension: 0.0,
          remark: '',
        },
        {
          sNo: '8',
          parameter: 'Hole Positions',
          specifiedDimension: 0.0,
          measuredDimension: 0.0,
          remark: '',
        },
      ],
    },
  };
};
export const getDRetroReflectiveSignBoardsObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      noOfTest: 0.0,
    },
    typeOfSignBoard: '', // Drop down from app
    chainage: 0.0, // >0, dec 3, max 100000
    side: '', // Drop down (LHS/RHS)
    sheetType: '', // III/IV/VIII/XI/XI
    observationAngle: 0.0, // .10/.20/.50/1.0
    entranceAngle: 0.0, // -40/+30
    color: '', // White/Yellow/Orange/Green/Red/Blue/Brown
    measuredLux: 0, // >0, Int 3, max 100
    conditionOfSignBoardSurface: '', // Char, max 50
    visibilityConditionAtNight: '', // Char, max 50
    cleanlinessOfBoard: '', // Char, max 50
    anyDamageOrObstruction: '', // Char, max 50
    meetsMoRTHRetroReflectivityStandards: '', // YES / NO
  };
};
