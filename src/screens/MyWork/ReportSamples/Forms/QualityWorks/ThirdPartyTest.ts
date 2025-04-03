//Bearing -> Ultra Sonic Test
export const getThirdPartyTestSampleObject = (sampleNum: any) => {
  return {
    sampleNo: {
      title: 'Sample no',
      value: sampleNum,
    },
    sampleData: {
      dateOfSampling: '',
      dateOfTesting: '',
      base64Image: null,
      result: '',
      sampleBy: '',
    },
    additionalData: {
      comments: '',
    },
  };
};
