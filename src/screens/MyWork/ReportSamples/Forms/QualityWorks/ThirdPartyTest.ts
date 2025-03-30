//Bearing -> Ultra Sonic Test
export const getThirdPartyTestSampleObject = (sampleNum: any) => {
  return {
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
