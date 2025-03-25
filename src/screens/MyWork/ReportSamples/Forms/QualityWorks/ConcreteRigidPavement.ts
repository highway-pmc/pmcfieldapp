//PQC->Flexual Strength->7th Day
export const getFlexualStrength7thDayTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    humidity: '',
    temperature: '',
    sampledBy: '',
    dateOfTesting: '',
    testConductedBy: '',
    details: {
      titles: ['Parameter', 'Beam 1', 'Beam 2', 'Beam 3'],
      values: [
        {
          parameter: 'Length of Beam (mm) (L)',
          b1: 0,
          b2: 0,
          b3: 0,
        },
        {
          parameter: 'Width of Beam (mm) (B)',
          b1: 0,
          b2: 0,
          b3: 0,
        },
        {
          parameter: 'Hight of Beam (mm) (H)',
          b1: 0,
          b2: 0,
          b3: 0,
        },
        {
          parameter: 'Weight of Beam (g)',
          b1: 0,
          b2: 0,
          b3: 0,
        },
        {
          parameter:
            'Distance between Fracture Line and Nearest Support (mm) (a)',
          b1: 0,
          b2: 0,
          b3: 0,
        },
        {
          parameter: 'Load at Failure (kN) (P)',
          b1: 0,
          b2: 0,
          b3: 0,
        },
        {
          parameter: 'Flexural Strength (MPa)',
          b1: 0,
          b2: 0,
          b3: 0,
        },
      ],
    },
  };
};
