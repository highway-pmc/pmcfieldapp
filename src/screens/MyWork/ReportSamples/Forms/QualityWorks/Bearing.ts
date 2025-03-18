//Bearing -> Ultra Sonic Test
export const getUltraSonicTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    details: {
      titles: ['Sl. No.', 'Observation', 'Acceptance'],
      values: [
        {
          slNo: '1',
          observation: '',
          acceptance: 'Y',
        },
        {
          slNo: '2',
          observation: '',
          acceptance: 'Y',
        },
        {
          slNo: '3',
          observation: '',
          acceptance: 'Y',
        },
      ],
    },
  };
};
//Bearing -> SURFACE FINISH OF S. S. PLATE  Test
export const getSurfaceFinishOfSSPlateTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    details: {
      titles: ['Sl. No.', 'COMPONENT', 'VALUE (in µm)'],
      values: [
        {
          slNo: '1',
          component: '',
          value: 0.0,
        },
        {
          slNo: '2',
          component: '',
          value: 0.0,
        },
        {
          slNo: '3',
          component: '',
          value: 0.0,
        },
      ],
    },
  };
};
//Bearing -> PISTON ROUGHNESS  Test
export const getPistonRoughnessTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    details: {
      titles: ['Sl. No.', 'COMPONENT', 'VALUE (in µm)'],
      values: [
        {
          slNo: '1',
          component: '',
          value: 0.0,
        },
        {
          slNo: '2',
          component: '',
          value: 0.0,
        },
        {
          slNo: '3',
          component: '',
          value: 0.0,
        },
      ],
    },
  };
};
//Bearing -> Physical, Visual & Dimensions
export const getPhysicalVisualDimensionsTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    details: {
      titles: [
        'Sl. No.',
        'DESCRIPTION',
        'DRAWING DIMENSION (A)',
        'DIMENSION OBSERVED (B )(mm)',
      ],
      values: [
        {
          slNo: '1.BASE PLATE',
          description: 'a) Base Wall Outer Dia',
          drawingDimension: 0.0,
          dimensionObserved: 0.0,
        },
        {
          slNo: '',
          description: 'b) Bolt C/C (PCD)',
          drawingDimension: 0.0,
          dimensionObserved: 0.0,
        },
        {
          slNo: '',
          description: 'c) Flange Thickness',
          drawingDimension: 0.0,
          dimensionObserved: 0.0,
        },
        {
          slNo: '2.TOP PLATE',
          description: 'a) Wall Outer Dim.',
          drawingDimension: 0.0,
          dimensionObserved: 0.0,
        },
        {
          slNo: '',
          description: 'b) Flange Thickness',
          drawingDimension: 0.0,
          dimensionObserved: 0.0,
        },
        {
          slNo: '',
          description: 'c) Bolt C/C',
          drawingDimension: 0.0,
          dimensionObserved: 0.0,
        },
        {
          slNo: '',
          description: 'd) Total Plate Height',
          drawingDimension: 0.0,
          dimensionObserved: 0.0,
        },
        {
          slNo: '',
          description: 'e) Top Plate inside Dia.',
          drawingDimension: 0.0,
          dimensionObserved: 0.0,
        },
        {
          slNo: '3',
          description: 'Dia Of MSM',
          drawingDimension: 0.0,
          dimensionObserved: 0.0,
        },
      ],
    },
  };
};
//Bearing -> Paint Thickness Test
export const getPaintThicknessTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    details: {
      titles: ['Sl. No.', 'COMPONENT', 'VALUE (in µm)'],
      values: [
        {
          slNo: '1',
          component: '',
          value: 0.0,
        },
        {
          slNo: '2',
          component: '',
          value: 0.0,
        },
        {
          slNo: '3',
          component: '',
          value: 0.0,
        },
      ],
    },
  };
};
//Bearing -> Compression (Vertical Load) Test
export const getCompressionVerticalLoadTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    designVerticalSLSLoad: 0.0,
    verticalRamArea: 0.0,
    pressureGaugeReadingActual: 0.0,
    durationOfLoad: 0.0,
    valueOfRotation: 0.0,
    serialOfNumberBearing: 0,
    testLoadTimesOfDesignSLS: 'Y',
    istherePermanentDeformation: 'Y',
    whetherLotFitForDispatch: 'Y',
  };
};
//Bearing -> Combined Vertical & Horizontal Test
export const getCombinedVerticalHorizontalLoadTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    designVerticalSLSLoad: 0.0,
    designHorizontalSLSLoad: 0.0,
    verticalRamArea: 0.0,
    horizontalRamArea: 0.0,
    pressureGaugeReadingActualHorizontal: 0.0,
    pressureGaugeReadingActualVertical: 0.0,
    durationOfLoad: 0.0,
    serialOfNumberBearing: 0,
    testLoadTimesOfDesignSLS: 'Y',
    istherePermanentDeformation: 'Y',
    whetherLotFitForDispatch: 'Y',
  };
};
//Bearing -> CHROME THICKNESS TEST
export const getChromeThicknessTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    otherInfo: {
      drawingNumber: '',
    },
    details: {
      titles: ['Sl. No.', 'COMPONENT', 'VALUE (in µm)'],
      values: [
        {
          slNo: '1',
          component: '',
          value: 0.0,
        },
        {
          slNo: '2',
          component: '',
          value: 0.0,
        },
        {
          slNo: '3',
          component: '',
          value: 0.0,
        },
      ],
    },
  };
};
//Bearing -> Avereage Coefficient Friction Doubt