import {
  View,
  Text,
  NativeEventEmitter,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  Modal,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  HeaderItems,
  PROJECT_TYPE,
  RFI_STATUS,
  SAMPLE_BY_LIST,
  TEST_CLASSIFICATION_TYPES,
  TEST_CONDUCTED_BY_LIST,
  TEST_MATERIALS_TYPES,
  TEST_SAMPLE_CONCRETE_CATEGORY,
  TEST_SAMPLE_STATUS,
  TEST_SAMPLE_STATUS_LIST,
  TEST_TYPES,
  TEST_WORK_CATEGORY_TYPES,
  TYPE_OF_CONCRETE_SURFACE_LIST,
  YES_NO_LIST,
} from '../../constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearMyWorksEvent,
  fillRFIsChecklistForTestSample,
  generateTestSampleReport,
  getMyTests,
  updateTestSample,
} from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import {
  getDbDateFromDDMMYYYY,
  isMixDesignClassification,
  isTestInventoryClassification,
} from '../../utils/Utils';
import {useSnackbar} from '../../context/SnackbarContext';
import commonStyles from '../Common/commonStyles';
import {CARD_COLORS_ARRAY, CARD_ICONS} from '../Common/CommonConstantsTypes';
import {
  getTestSampleCementCoarseAggregateObject,
  getTestSampleCementCompressiveStrengthObject,
  getTestSampleCementFineAggregateObject,
  getTestSampleCementInitialFinalSettingObject,
  getTestSampleCementSoundnessObject,
  getTestSampleConcreteObject,
} from './ReportSamples/Forms/QualityWorks/ConcreteCements';
import {
  CustomCalendarPicker,
  CustomDropdownPicker,
  FormSampleTest7thOr28thDayState,
  tasksListing,
  testSampleForm,
} from './ReportSamples/Forms/QualityWorks/CustomForms';
import {
  getTestSampleAIVObject,
  getTestSampleBCMixGradingGradeIObject,
  getTestSampleBCStabilityAndVoidAnalysisObject,
  getTestSampleBinderContentObject,
  getTestSampleBituminousPenetrationTestObject,
  getTestSampleDensityAfterCompactionObject,
  getTestSampleDuctilityTestObject,
  getTestSampleFIEIObject,
  getTestSampleFlashFirePointsObject,
  getTestSampleSofteningPointObject,
  getWaterAbsorptionObject,
} from './ReportSamples/Forms/QualityWorks/BituminusWorks';
import {
  getCBRTestSampleObject,
  getFieldDryDensityTestSampleObject,
  getFreeSwellIndexTestSampleObject,
  getGrainSizeAnalysisTestSampleObject,
  getMoistureContentTestSampleObject,
  getPlasticityIndexTestSampleObject,
  getProctorDensityTestSampleObject,
} from './ReportSamples/Forms/QualityWorks/Earthwork';
import {testSampleFormEarthwork} from './ReportSamples/Forms/QualityWorks/EarthWorkCustomForm';
import {testSampleFormSubBase} from './ReportSamples/Forms/QualityWorks/SubBaseCustomForm';
import {testSampleFormBaseSubBase} from './ReportSamples/Forms/QualityWorks/BaseSubBaseCustomForm';
import {
  getCBRTestSampleObjectSB,
  getCTSBGrationTestSampleObjectSB,
  getFieldDryDensityTestSampleObjectSB,
  getGrainSizeAnalysisTestSampleObjectSB,
  getMoistureContentTestSampleObjectSB,
  getTestSampleAIVObjectSB,
  getWaterAbsorptionObjectSB,
} from './ReportSamples/Forms/QualityWorks/SubBase';
import {
  getCTSBGrationTestSampleObjectBSB,
  getFieldDryDensitySampleObjectBSB,
  getGrainSizeAnalysisTestSampleObjectBSB,
  getProctorDensityTestSampleObjectBSB,
  getTestSampleAIVObjectBSB,
  getTestSampleFIEIObjectBSB,
  getWaterAbsorptionObjectBSB,
} from './ReportSamples/Forms/QualityWorks/BaseSubBase';
import { thirdPartySampleTest } from './ReportSamples/Forms/QualityWorks/ThirdPartyLabTestCustomForm';
import CustomSelectDropdown from '../Common/CustomSelectDropdown';
import {getThirdPartyTestSampleObject} from './ReportSamples/Forms/QualityWorks/ThirdPartyTest';
import LinearGradient from 'react-native-linear-gradient';
const MyQualityWork = ({route, navigation}: {route: any; navigation: any}) => {
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const workType = PROJECT_TYPE.QUALITY_WORK;

  const {
    myTests,
    testSampleUpdated,
    generatedTestSampleReport,
    rfiChecklistSaved,
    loading,
    error,
  } = useSelector((state: any) => state.MyWorks);
  const [myTestsDataAll, setMyTestsDataAll]: any = useState([]);
  const [myTestsData, setMyTestsData]: any = useState([]);
  const [currentTestWorkCategoryData, setCurrentTestWorkCategoryData]: any =
    useState([]);
  const [currentTestMaterialsData, setCurrentTestMaterialsData] = useState([]);
  const [currentTestMaterialData, setCurrentTestMaterialData]: any = useState(
    {},
  );
  const [currentTestTypesData, setCurrentTestTypesData] = useState([]);
  const [currentSubTestTypesData, setCurrentSubTestTypesData]: any = useState(
    [],
  );
  const [currentSubTestTypeRFIsData, setCurrentSubTestTypeRFIsData]: any =
    useState([]);
  const [testClassificationId, setTestClassificationId] = useState('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedTestSample, setSelectedTestSample]: any = useState(null);

  const [breadcrumbData, setBreadcrumbData] = useState([
    {
      name: '',
      testClassifIndex: 0,
      workCateIndex: 0,
      testMateIndex: 0,
      testTypeIndex: 0,
      level: 0,
      assignmentLevel: 0,
      active: false,
    },
  ]);

  const dispatch = useDispatch();
  const focus = useIsFocused();
  const {showSnackbar} = useSnackbar();
  const [selectedValues, setSelectedValues] = useState({
    name: 'Source Approvals',
    type: 'source-approvals',
  });
  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.myQualityWorks);
      setCurrentLevel(0);
      setMyTestsDataAll([...approvalTypeArray]);
      setMyTestsData([]);
      setCurrentTestWorkCategoryData([]);
      setCurrentTestMaterialsData([]);
      setCurrentTestTypesData([]);
      setCurrentSubTestTypesData([]);
      setCurrentSubTestTypeRFIsData([]);
      setBreadcrumbData([]);
      setSearchText('');
    }
  }, [focus]);

  const approvalTypeArray = [
    {name: 'Source Approvals', type: 'source-approvals'},
    // {name: 'Procurement Details', type: 'procurement-details'},
    {name: 'Field Lab Test', type: 'field-lab-test'},
    {name: 'Third Party Lab Test', type: 'third-party-lab-test'},
    {name: 'Mix Design', type: 'mix-design'},
  ];

  const handleApprovalType = (selectedOption: any) => {
    setSelectedValues(selectedOption);
    getMyWorksData(selectedOption?.type);
    console.log('selectedOption', selectedOption);
  };

  useEffect(() => {
   // getMyWorksData(selectedValues?.type);
  }, [selectedValues]);

  const getMyWorksData = (selectedType: any) => {
    dispatch(
      getMyTests({
        projectId: loggedInUser.projectId,
        workType: workType,
        selectedType: selectedType || '',
      }),
    );
  };

  useEffect(() => {
    if (myTests) {
      //setCurrentLevel(0);
      // setMyTestsDataAll(myTests);
      if (myTests.length > 0) {
        onMyTestClick(myTests[0]);
      }
    }
  }, [myTests]);

  useEffect(() => {
    if (testSampleUpdated) {
      const sampleDataTemp: any = [...currentSubTestTypeRFIsData];
      const updatedSampleIndex = sampleDataTemp.findIndex(
        (x: any) => x._id === testSampleUpdated._id,
      );
      if (updatedSampleIndex != -1) {
        sampleDataTemp[updatedSampleIndex] = testSampleUpdated;
      }
      setCurrentSubTestTypeRFIsData([]);
      setCurrentSubTestTypeRFIsData(sampleDataTemp);
      Alert.alert('Info', 'Sample updated');
      dispatch(clearMyWorksEvent());
    }

    if (rfiChecklistSaved) {
      setOpenPopup(false);
      Alert.alert('RFIs checklist saved.');
      setCurrentLevel(1);
      dispatch(clearMyWorksEvent());
      getMyWorksData(selectedValues?.type);
    }
  }, [testSampleUpdated, rfiChecklistSaved, error]);

  // unmount
  useEffect(
    () => () => {
      dispatch(clearMyWorksEvent());
      setCurrentLevel(0);
      setMyTestsData([]);
      setCurrentTestWorkCategoryData([]);
      setCurrentTestMaterialsData([]);
      setCurrentTestTypesData([]);
      setCurrentSubTestTypesData([]);
      setCurrentSubTestTypeRFIsData([]);
      setBreadcrumbData([]);
      setSearchText('');
    },
    [],
  );

  const onMyTestClick = (item: any) => {
    //setCurrentLevel(1);
    if (isTestInventoryClassification(item.type)) {
      navigation.navigate('SelectTestWorkCategory', {
        testClassificationId: item.id,
        testClassificationName: item.name,
        testClassificationType: item.type,
        testWorkCategoriesData: item.testWorkCategoriesData,
        workType: workType,
      });
      return;
    }
    if (isMixDesignClassification(item.type)) {
      navigation.navigate('MixDesignListing', {
        testClassificationId: item.id,
        testClassificationName: item.name,
        testClassificationType: item.type,
        testWorkCategoriesData: item.testWorkCategoriesData,
        workType: workType,
      });
      return;
    }
    setMyTestsData([item]);
    setTimeout(() => {
      onClick(2, item.assignmentLevel, 0, -1, -1, -1, [item])
    }, 100);    
  };

  const onClick = (
    level: number,
    assignmentLevel: number,
    testClassifIndex: number,
    workCateIndex: number = -1,
    testMateIndex: number = -1,
    testTypeIndex: number = -1,
    myTestsDataDuplicate: any = null
  ) => {
    const testClassifData: any = myTestsData[testClassifIndex] || myTestsDataDuplicate[testClassifIndex];
    if (isTestInventoryClassification(testClassifData.type)) {
      // TODO - will introduce type in db and use it iso Classification Name
      const testWorkCategory = testClassifData.testWorkCategoriesData[0];
      navigation.navigate('AssignTestMaterialsPurchage', {
        testClassificationId: testClassifData.id,
        testClassificationName: testClassifData.name,
        testClassificationType: testClassifData.type,
        testWorkCategoryId: testWorkCategory._id,
        testWorkCategoryName: testWorkCategory.name,
        testWorkCategoryType: testWorkCategory.type,
        workType: workType,
      });
      return;
    }

    setOpenPopup(false);
    setSearchText('');
    setCurrentLevel(level);
    setBreadcrumbData([]);
    setCurrentTestTypesData([]);
    setCurrentSubTestTypesData([]);
    setCurrentSubTestTypeRFIsData([]);
    let testWorkCategoryData = null;
    let testMateData = null;
    let testTypeData: any = null;
    let breadCrumb: any = [
      {
        name: testClassifData.name,
        testClassifIndex: testClassifIndex,
        workCateIndex: workCateIndex,
        testMateIndex: testMateIndex,
        testTypeIndex: testTypeIndex,
        level: level,
        assignmentLevel: 1,
        active: true,
      },
      {
        name: 'Work Category',
        testClassifIndex: testClassifIndex,
        workCateIndex: workCateIndex,
        testMateIndex: testMateIndex,
        testTypeIndex: testTypeIndex,
        level: 0,
        assignmentLevel: 0,
        active: false,
      },
    ];
    setCurrentTestWorkCategoryData(testClassifData.testWorkCategoriesData);
    if (workCateIndex != -1) {
      testWorkCategoryData =
        testClassifData.testWorkCategoriesData[workCateIndex];
      breadCrumb[1].name = testWorkCategoryData.name;
      setCurrentTestMaterialsData(testWorkCategoryData.testMaterialsData);
      breadCrumb.push({
        name: 'Test Materials',
        testClassifIndex: testClassifIndex,
        workCateIndex: workCateIndex,
        testMateIndex: testMateIndex,
        testTypeIndex: testTypeIndex,
        level: level,
        assignmentLevel: 2,
        active: true,
      });

      if (testMateIndex != -1) {
        testMateData = testWorkCategoryData.testMaterialsData[testMateIndex];
        setCurrentTestMaterialData(testMateData);
        breadCrumb[2].name = testMateData.name;
        setCurrentTestTypesData(testMateData.testTypesData);
        breadCrumb.push({
          name: 'Test Types',
          testClassifIndex: testClassifIndex,
          workCateIndex: workCateIndex,
          testMateIndex: testMateIndex,
          testTypeIndex: testTypeIndex,
          level: level,
          assignmentLevel: 3,
          active: true,
        });

        if (testTypeIndex != -1) {
          testTypeData = testMateData.testTypesData[testTypeIndex];
          testTypeData.testClassificationType = testClassifData.type;

          breadCrumb[3].name = testTypeData.name;
          testTypeData.testRFIsData?.forEach((rfi: any) => {
            rfi.type = testTypeData.type;
          });
          if (
            testMateData.materialType === TEST_MATERIALS_TYPES.CONCRETE ||
            testMateData.materialType === TEST_MATERIALS_TYPES.DLC ||
            testMateData.materialType === TEST_MATERIALS_TYPES.PQC
          ) {
            if (testTypeData.type === TEST_TYPES.CORE_TEST) {
              setCurrentTestTypesData([]);
              testTypeData.materialType = TEST_MATERIALS_TYPES.CONCRETE; // TEMP - TODO
              setSelectedTestSample(testTypeData);

              const testObservations: any = [];
              testObservations.push(getTestSampleConcreteObject(1));
              setConcreteSampleTestItems(testObservations);
              setOpenPopup(true);
            } else if (testTypeData.type === TEST_TYPES.CUBE_TEST) {
              setCurrentTestTypesData([]);
              testTypeData.materialType = testMateData.materialType; // TEMP - TODO
              setSelectedTestSample(testTypeData);
              if (testTypeData.subTestTypes?.length) {
                setTimeout(() => {
                  setCurrentSubTestTypesData([...testTypeData.subTestTypes]);
                });
              }
            }
          } else if (
            testMateData.materialType === TEST_MATERIALS_TYPES.CEMENT
          ) {
            testTypeData.materialType = TEST_MATERIALS_TYPES.CEMENT;
            setCurrentSubTestTypeRFIsData(testTypeData.testRFIsData);
            setSelectedTestSample(testTypeData);
            if (testTypeData.type === TEST_TYPES.COMPRESSIVE_STRENGTH) {
              if (testTypeData.subTestTypes?.length) {
                setCurrentSubTestTypesData([...testTypeData.subTestTypes]);
              }
            } else if (
              testTypeData.type === TEST_TYPES.SOUNDNESS ||
              testTypeData.type ===
                TEST_TYPES.FINENESS_CONSISTENCY_INITIAL_AND_FINAL_SETTING_TIME
            ) {
              setCurrentSubTestTypeRFIsData(testTypeData.testRFIsData);
              setCurrentLevel(6);
              // const testObservations: any = [];
              // testObservations.push(getTestSampleCementSoundnessObject(1));
              // setConcreteSampleTestItems(testObservations);
              // setOpenPopup(true);
            }
          } else if (
            testMateData.materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE
          ) {
            testTypeData.materialType = TEST_MATERIALS_TYPES.FINE_AGGREGATE;
            testTypeData.testRFIsData?.forEach((rfi: any) => {
              rfi.type = testTypeData.type;
            });
            setCurrentLevel(6);
            setCurrentSubTestTypeRFIsData(testTypeData.testRFIsData);
            setSelectedTestSample(testTypeData);
            // const testObservations: any = [];
            // testObservations.push(getTestSampleCementFineAggregateObject(1, testTypeData.type));
            // setConcreteSampleTestItems(testObservations);
            // setOpenPopup(true);
          } else if (
            testMateData.materialType === TEST_MATERIALS_TYPES.COARSE_AGGREGATE
          ) {
            testTypeData.materialType = TEST_MATERIALS_TYPES.COARSE_AGGREGATE;
            setCurrentSubTestTypeRFIsData(testTypeData.testRFIsData);
            setSelectedTestSample(testTypeData);
            setCurrentLevel(6);
            // const testObservations: any = [];
            // testObservations.push(getTestSampleCementCoarseAggregateObject(1, testTypeData.type));
            // if (testTypeData.type === TEST_TYPES.GRADATION) {
            //   testObservations.push(getTestSampleCementCoarseAggregateObject(2, testTypeData.type));
            //   testObservations.push(getTestSampleCementCoarseAggregateObject(3, testTypeData.type));
            // }
            // setConcreteSampleTestItems(testObservations);
            // setOpenPopup(true);
          } else if (
            testMateData.materialType === TEST_MATERIALS_TYPES.SMA ||
            testMateData.materialType === TEST_MATERIALS_TYPES.DBM_RAP_DBM ||
            testMateData.materialType === TEST_MATERIALS_TYPES.BC ||
            testMateData.materialType ===
              TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING ||
            testMateData.materialType === TEST_MATERIALS_TYPES.BITUMEN ||
            testMateData.materialType ===
              TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC ||
            testMateData.materialType ===
              TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA ||
            testMateData.materialType === TEST_MATERIALS_TYPES.EMULSION
          ) {
            //testTypeData.materialType = TEST_MATERIALS_TYPES.SMA;
            setCurrentSubTestTypeRFIsData(testTypeData.testRFIsData);
            setSelectedTestSample(testTypeData);
            setCurrentLevel(6);
          } else if (
            testMateData.materialType === TEST_MATERIALS_TYPES.SOIL ||
            testMateData.materialType === TEST_MATERIALS_TYPES.FLY_ASH
          ) {
            //testTypeData.materialType = TEST_MATERIALS_TYPES.SMA;
            setCurrentSubTestTypeRFIsData(testTypeData.testRFIsData);
            setSelectedTestSample(testTypeData);
            setCurrentLevel(6);
          } else if (
            testMateData.materialType === TEST_MATERIALS_TYPES.GSB ||
            testMateData.materialType === TEST_MATERIALS_TYPES.CTSB ||
            testMateData.materialType === TEST_MATERIALS_TYPES.WMM ||
            testMateData.materialType ===
              TEST_MATERIALS_TYPES.FINE_AGGREGATE_WMM ||
            testMateData.materialType ===
              TEST_MATERIALS_TYPES.COARSE_AGGREGATE_WMM
          ) {
            //testTypeData.materialType = TEST_MATERIALS_TYPES.SMA;
            setCurrentSubTestTypeRFIsData(testTypeData.testRFIsData);
            setSelectedTestSample(testTypeData);
            setCurrentLevel(6);
          } else {
            setCurrentSubTestTypeRFIsData(testTypeData.testRFIsData);
            setSelectedTestSample(testTypeData);
            setCurrentLevel(6);
          }
        }
      }
    }

    setBreadcrumbData(breadCrumb);
  };

  const onClickNested = (level: number, data: any) => {
    setSearchText('');
    setCurrentTestTypesData([]);
    setCurrentSubTestTypeRFIsData([]);
    if (data.testClassificationId) {
      setTestClassificationId(data.testClassificationId);
    }
    setCurrentLevel(level);
    if (level === 2) {
      setCurrentTestWorkCategoryData(data.testWorkCategoriesData);
      //const beadcrumb = breadcrumbData[1];
    } else if (level === 3) {
      breadcrumbData[1].name = data.name;
      setCurrentTestMaterialsData(data.testMaterialsData);
      const bcrubm = {
        name: 'Test Materials',
        testClassifIndex: breadcrumbData[0].testClassifIndex,
        workCateIndex: breadcrumbData[1].workCateIndex,
        testMateIndex: breadcrumbData[2]?.testMateIndex || -1,
        testTypeIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false,
      };
      breadcrumbData.push(bcrubm);
      // if (data.subComponentsData && data.subComponentsData.length) {
      //   setCurrentTestMaterialsData(data.subComponentsData)
      // } else {
      //   setCurrentTestTypesData(data.testTypesData)
      //   breadcrumbData.push({
      //     name: 'Tasks',
      //     testClassifIndex: breadcrumbData[0].testClassifIndex,
      //     workCateIndex: breadcrumbData[1].workCateIndex,
      //     testMateIndex: breadcrumbData[2]?.testMateIndex || -1,
      //     testTypeIndex: 0,
      //     level: 0,
      //     assignmentLevel: 0,
      //     active: false
      //   })
      // }
    } else if (level === 4) {
      breadcrumbData[2].name = data.name;
      setCurrentTestTypesData(data.testTypesData);
      const bcrubm = {
        name: 'Test Types',
        testClassifIndex: breadcrumbData[0].testClassifIndex,
        workCateIndex: breadcrumbData[1].workCateIndex,
        testMateIndex: breadcrumbData[2]?.testMateIndex || -1,
        testTypeIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false,
      };
      breadcrumbData.push(bcrubm);
    } else if (level === 6) {
      // show sample test generated
      setCurrentSubTestTypeRFIsData(data.testRFIsData);
    }
  };

  const onUpdateTestSample = (item: any) => {
    if (
      !item['sampleStatus_TEMP'] ||
      item['sampleStatus_TEMP'] === TEST_SAMPLE_STATUS.PENDING
    ) {
      Alert.alert('Error', 'Please sample status');
      return;
    }
    if (item['sampleStatus_TEMP'] === TEST_SAMPLE_STATUS.PREPARED) {
      if (!item['rfiDateTime_TEMP']) {
        Alert.alert('Error', 'Please enter date');
        return;
      }
    } else {
      item['rfiDateTime_TEMP'] = '';
    }

    const dateTimeArray = item['rfiDateTime_TEMP'].split('/');

    const obj = {
      sampleStatus: item['sampleStatus_TEMP'],
      rfiDateTime:
        dateTimeArray[2] + '-' + dateTimeArray[1] + '-' + dateTimeArray[0],
    };
    dispatch(
      updateTestSample({
        projectId: loggedInUser.projectId,
        id: item._id,
        body: obj,
      }),
    );
  };

  const onClickTestSampleItem = (item: any) => {
    let testObservations: any = [];
    item.type = selectedTestSample.type;
    item.testClassificationType = selectedTestSample.testClassificationType;
    if (
      selectedTestSample.testClassificationType ===
      TEST_CLASSIFICATION_TYPES.THIRD_PARTY_LAB_TEST
    ) {
      onClickSampleThirdPartyItem(item);
      return;
    }
    if (
      currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CONCRETE ||
      currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CEMENT
    ) {
      if (item.testCategory) {
        if (
          currentTestMaterialData.materialType ===
            TEST_MATERIALS_TYPES.CONCRETE &&
          !item.workChecklistSubmitted
        ) {
          Alert.alert('Error', 'Checklist of this sample yet to be submitted.');
          return;
        }
        if (!item.readyForDayTesting) {
          Alert.alert(
            'Error',
            `Testing of this sample will be started by ${item.startTestingByDate}`,
          );
          return;
        }
      }
    }

    if (
      currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CONCRETE
    ) {
      //Doubt
      item.materialType = TEST_MATERIALS_TYPES.CONCRETE;
      // if (!item.workChecklistSubmitted) {
      //   Alert.alert('Error', 'Checklist of this sample yet to be submitted.')
      //   return;
      // }
      // if (!item.readyForDayTesting) {
      //   Alert.alert('Error', `Testing of this sample will be started by ${item.startTestingByDate}`);
      //   return;
      // }
      testObservations.push(getTestSampleConcreteObject(1));
      if (item.testCategory === TEST_SAMPLE_CONCRETE_CATEGORY.C_28TH_DAYS) {
        testObservations.push(getTestSampleConcreteObject(2));
        testObservations.push(getTestSampleConcreteObject(3));
      }
    } else if (
      currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CEMENT
    ) {
      item.materialType = TEST_MATERIALS_TYPES.CEMENT;
      if (selectedTestSample.type === TEST_TYPES.COMPRESSIVE_STRENGTH) {
        //Doubt
        testObservations.push(getTestSampleCementCompressiveStrengthObject(1));
        testObservations[0].ageInDays.value = item.testCategory;
      } else if (selectedTestSample.type === TEST_TYPES.SOUNDNESS) {
        if (item?.metaData?.observations) {
          testObservations = item?.metaData?.observations;
        } else testObservations.push(getTestSampleCementSoundnessObject(1));
      } else if (
        selectedTestSample.type ===
        TEST_TYPES.FINENESS_CONSISTENCY_INITIAL_AND_FINAL_SETTING_TIME
      ) {
        if (item?.metaData?.observations) {
          testObservations = item?.metaData?.observations;
        } else {
          testObservations.push(
            getTestSampleCementInitialFinalSettingObject(1),
          );
          testObservations.push(
            getTestSampleCementInitialFinalSettingObject(2),
          );
          testObservations.push(
            getTestSampleCementInitialFinalSettingObject(3),
          );
        }
      }
    } else if (
      currentTestMaterialData.materialType ===
      TEST_MATERIALS_TYPES.FINE_AGGREGATE
    ) {
      item.materialType = TEST_MATERIALS_TYPES.FINE_AGGREGATE;
      testObservations.push(
        getTestSampleCementFineAggregateObject(1, selectedTestSample.type),
      );
    } else if (
      currentTestMaterialData.materialType ===
      TEST_MATERIALS_TYPES.COARSE_AGGREGATE
    ) {
      item.materialType = TEST_MATERIALS_TYPES.COARSE_AGGREGATE;
      testObservations.push(
        getTestSampleCementCoarseAggregateObject(1, selectedTestSample.type),
      );
      if (selectedTestSample.type === TEST_TYPES.GRADATION) {
        if (item?.metaData?.observations) {
          testObservations = item?.metaData?.observations;
        } else {
          testObservations.push(
            getTestSampleCementCoarseAggregateObject(
              2,
              selectedTestSample.type,
            ),
          );
          testObservations.push(
            getTestSampleCementCoarseAggregateObject(
              3,
              selectedTestSample.type,
            ),
          );
        }
      }
    }

    setSelectedTestSample(item);
    setConcreteSampleTestItems(testObservations);
    setOpenPopup(true);
  };

  const onClickBitumenTestSampleItem = (item: any) => {
    let testObservations: any = [];
    item.type = selectedTestSample.type;
    item.testClassificationType = selectedTestSample.testClassificationType;
    if (selectedTestSample.type == TEST_TYPES.MIX_GRADING) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getTestSampleBCMixGradingGradeIObject(1));
    } else if (selectedTestSample.type == TEST_TYPES.FLASH_FIRE_POINTS) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getTestSampleFlashFirePointsObject(1));
    } else if (selectedTestSample.type == TEST_TYPES.BINDER_CONTENT) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getTestSampleBinderContentObject(1));
    } else if (selectedTestSample.type == TEST_TYPES.FI_EI) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getTestSampleFIEIObject(1));
    } else if (selectedTestSample.type == TEST_TYPES.AGGREGATE_IMPACT_VALUE) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getTestSampleAIVObject(1));
    } else if (
      selectedTestSample.type == TEST_TYPES.DENSITY_OF_COMPACTED_LAYER
    ) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else
        testObservations.push(getTestSampleDensityAfterCompactionObject(1));
    } else if (
      selectedTestSample.type == TEST_TYPES.STABILITY_AND_VOID_ANALYSIS
    ) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else
        testObservations.push(getTestSampleBCStabilityAndVoidAnalysisObject(1));
    } else if (
      selectedTestSample.type == TEST_TYPES.STABILITY_AND_VOID_ANALYSIS
    ) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else
        testObservations.push(getTestSampleBCStabilityAndVoidAnalysisObject(1));
    } else if (selectedTestSample.type == TEST_TYPES.SOFTENING_POINT) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getTestSampleSofteningPointObject(1));
    } else if (selectedTestSample.type == TEST_TYPES.DUCTILITY_TEST) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getTestSampleDuctilityTestObject(1));
    } else if (selectedTestSample.type == TEST_TYPES.PENETRATION_TEST) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else
        testObservations.push(getTestSampleBituminousPenetrationTestObject(1));
    } else if (
      selectedTestSample.type == TEST_TYPES.WATER_ABSORPTION_OF_AGGREGATES
    ) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getWaterAbsorptionObject(1));
    }
    setSelectedTestSample(item);
    setConcreteSampleTestItems(testObservations);
    setOpenPopup(true);
  };
  const onClickSampleThirdPartyItem = (item: any) => {
    let testObservations: any = [];
    item.type = selectedTestSample.type;
    // item.testClassificationType = selectedTestSample.testClassificationType;
    if (item?.metaData?.observations) {
      testObservations = item?.metaData?.observations;
    } else testObservations.push(getThirdPartyTestSampleObject(1));
    setSelectedTestSample(item);
    setConcreteSampleTestItems(testObservations);
    setOpenPopup(true);
  };
  const onClickEarthworkSampleItem = (item: any) => {
    let testObservations: any = [];
    item.type = selectedTestSample.type;
    item.testClassificationType = selectedTestSample.testClassificationType;
    if (selectedTestSample.type == TEST_TYPES.MOISTURE_CONTENT) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getMoistureContentTestSampleObject(1));
    } else if (selectedTestSample.type == TEST_TYPES.FREE_SWELL_INDEX) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getFreeSwellIndexTestSampleObject(1));
    } else if (selectedTestSample.type == TEST_TYPES.GRAIN_SIZE_ANALYSIS) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getGrainSizeAnalysisTestSampleObject(1));
    } else if (selectedTestSample.type == TEST_TYPES.PROCTOR_DENSITY_TEST) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getProctorDensityTestSampleObject(1));
    } else if (selectedTestSample.type == TEST_TYPES.FIELD_DRY_DENSITY) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else {
        testObservations.push(getFieldDryDensityTestSampleObject(1));
        testObservations.push(getFieldDryDensityTestSampleObject(2));
      }
    } else if (selectedTestSample.type == TEST_TYPES.CBR_TEST) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else {
        testObservations.push(getCBRTestSampleObject(1));
        testObservations.push(getCBRTestSampleObject(2));
      }
    } else if (selectedTestSample.type == TEST_TYPES.PLASTICITY_INDEX) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getPlasticityIndexTestSampleObject(1));
    }
    setSelectedTestSample(item);
    setConcreteSampleTestItems(testObservations);
    setOpenPopup(true);
  };

  const onClickSubBaseSampleItem = (item: any) => {
    let testObservations: any = [];
    item.type = selectedTestSample.type;
    item.testClassificationType = selectedTestSample.testClassificationType;
    if (selectedTestSample.type == TEST_TYPES.GRADING_OF_AGGREGATE) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getCTSBGrationTestSampleObjectSB(1));
    } else if (selectedTestSample.type == TEST_TYPES.WATER_ABSORPTION) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getWaterAbsorptionObjectSB(1));
    } else if (selectedTestSample.type == TEST_TYPES.ATTERBEG_LIMIT_TEST) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getGrainSizeAnalysisTestSampleObjectSB(1));
    } else if (selectedTestSample.type == TEST_TYPES.AGGREGATE_IMPACT_VALUE) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getTestSampleAIVObjectSB(1));
    } else if (selectedTestSample.type == TEST_TYPES.FIELD_DRY_DENSITY) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else {
        testObservations.push(getFieldDryDensityTestSampleObjectSB(1));
        testObservations.push(getFieldDryDensityTestSampleObjectSB(2));
      }
    } else if (selectedTestSample.type == TEST_TYPES.CBR_TEST) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else {
        testObservations.push(getCBRTestSampleObjectSB(1));
        testObservations.push(getCBRTestSampleObjectSB(2));
      }
    } else if (selectedTestSample.type == TEST_TYPES.MOISTURE_CONTENT) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getMoistureContentTestSampleObjectSB(1));
    }
    setSelectedTestSample(item);
    setConcreteSampleTestItems(testObservations);
    setOpenPopup(true);
  };

  const onClickBaseSubBaseSampleItem = (item: any) => {
    let testObservations: any = [];
    item.type = selectedTestSample.type;
    item.testClassificationType = selectedTestSample.testClassificationType;
    if (selectedTestSample.type == TEST_TYPES.GRADING_OF_AGGREGATE) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getCTSBGrationTestSampleObjectBSB(1));
    } else if (selectedTestSample.type == TEST_TYPES.WATER_ABSORPTION) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getWaterAbsorptionObjectBSB(1));
    } else if (selectedTestSample.type == TEST_TYPES.ATTERBEG_LIMIT_TEST) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getGrainSizeAnalysisTestSampleObjectBSB(1));
    } else if (selectedTestSample.type == TEST_TYPES.AGGREGATE_IMPACT_VALUE) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getTestSampleAIVObjectBSB(1));
    } else if (selectedTestSample.type == TEST_TYPES.FIELD_DRY_DENSITY) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else {
        testObservations.push(getFieldDryDensitySampleObjectBSB(1));
        testObservations.push(getFieldDryDensitySampleObjectBSB(2));
      }
    } else if (selectedTestSample.type == TEST_TYPES.FI_EI) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getTestSampleFIEIObjectBSB(1));
    } else if (selectedTestSample.type == TEST_TYPES.PROCTOR_DENSITY_TEST) {
      if (item?.metaData?.observations) {
        testObservations = item?.metaData?.observations;
      } else testObservations.push(getProctorDensityTestSampleObjectBSB(1));
    }
    setSelectedTestSample(item);
    setConcreteSampleTestItems(testObservations);
    setOpenPopup(true);
  };

  const isValidTemperature = (value: any): boolean => {
    const val = parseFloat(value.toString());

    if (isNaN(val)) {
      showSnackbar('Please Enter a valid temperature in Sample Data', 'error');
      return false;
    }

    if (val <= 0 || val > 100) {
      showSnackbar(
        'Temperature must be greater than 0 and less than or equal to 100',
        'error',
      );
      return false;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
      showSnackbar(
        'Temperature can have a maximum of 2 decimal places',
        'error',
      );
      return false;
    }

    return true;
  };

  const isValidHumidity = (value: any): boolean => {
    const val = parseFloat(value.toString());

    if (isNaN(val)) {
      showSnackbar('Please Enter a valid humidity in Sample Data', 'error');
      return false;
    }

    if (val <= 0 || val > 100) {
      showSnackbar(
        'Humidity must be greater than 0 and less than or equal to 100',
        'error',
      );
      return false;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
      showSnackbar('Humidity can have a maximum of 2 decimal places', 'error');
      return false;
    }

    return true;
  };

  const isValidNumber = (value: any, fieldName: string): boolean => {
    const val = parseFloat(value.toString());
    if (isNaN(value)) {
      showSnackbar(`Please enter a valid number for ${fieldName}`, 'error');
      return false;
    }
    return true;
  };

  const onSubmitTestSample = (status: string) => {
    const testWorkCategoryDataType = currentTestWorkCategoryData.find(
      (wc: any) => wc._id === currentTestMaterialData.testWorkCategoryId[0],
    )?.type;
    let sampleData = {};

    const objSampleTest7thOr28thDay: any = Object.assign(
      {},
      formSampleTest7thOr28thDay,
    );
    objSampleTest7thOr28thDay.dateOfTesting = getDbDateFromDDMMYYYY(
      objSampleTest7thOr28thDay.dateOfTesting,
    );

    if (selectedTestSample.testClassificationType === TEST_CLASSIFICATION_TYPES.THIRD_PARTY_LAB_TEST) {
      objSampleTest7thOr28thDay.dateOfSampling = getDbDateFromDDMMYYYY(
        objSampleTest7thOr28thDay.dateOfSampling,
      );

      objSampleTest7thOr28thDay.result = concreteSampleTestItems[0].result

      //objSampleTest7thOr28thDay.base64Image = "" // TODO

      dispatch(
        fillRFIsChecklistForTestSample({
          projectId: loggedInUser.projectId,
          rfiId: selectedTestSample._id,
          status: status,
          body: {
            sampleData: objSampleTest7thOr28thDay,
            additionalData: {
              comments: concreteSampleTestItems[0].comments
            }
          },
        }),
      );

      return;
    }
    
    // Temperature Validation
    if (isValidTemperature(objSampleTest7thOr28thDay.roomTemperature)) {
      objSampleTest7thOr28thDay.roomTemperature = Number(
        objSampleTest7thOr28thDay.roomTemperature,
      );
    } else {
      return;
    }
    // Humidity Validation
    if (isValidHumidity(objSampleTest7thOr28thDay.humidity)) {
      objSampleTest7thOr28thDay.humidity = Number(
        objSampleTest7thOr28thDay.humidity,
      );
    } else {
      return;
    }

    objSampleTest7thOr28thDay.observations = Object.assign(
      [],
      concreteSampleTestItems,
    );
    const sampleObservations: any =
      objSampleTest7thOr28thDay.observations &&
      objSampleTest7thOr28thDay.observations;

    if (
      testWorkCategoryDataType ===
        TEST_WORK_CATEGORY_TYPES.CONCRETE_STRUCTURE ||
      testWorkCategoryDataType ===
        TEST_WORK_CATEGORY_TYPES.CONCRETE_RIGID_PAVEMENT
    ) {
      for (let i = 0; i < sampleObservations?.length; i++) {
        const observations = sampleObservations[i];
        observations['details']?.values.forEach((item: any) => {
          if (
            currentTestMaterialData.materialType ===
              TEST_MATERIALS_TYPES.CONCRETE ||
            selectedTestSample.type === TEST_TYPES.COMPRESSIVE_STRENGTH
          ) {
            if (
              !isValidNumber(item.wtCube, 'wtCube') ||
              !isValidNumber(item.failureLoad, 'failureLoad')
            )
              return;
            item.wtCube = Number(item.wtCube);
            item.failureLoad = Number(item.failureLoad);
          }

          if (
            currentTestMaterialData.materialType ===
            TEST_MATERIALS_TYPES.CONCRETE
          ) {
            if (
              !isValidNumber(item.testArea, 'testArea') ||
              !isValidNumber(item.volOfCube, 'volOfCube')
            )
              return;
            item.testArea = Number(item.testArea);
            item.volOfCube = Number(item.volOfCube);
          }
          // Cement Check
          if (
            currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CEMENT
          ) {
            if (selectedTestSample.type === TEST_TYPES.SOUNDNESS) {
              if (
                !isValidNumber(
                  item.beforePuttingInBoilingWater,
                  'beforePuttingInBoilingWater',
                ) ||
                !isValidNumber(
                  item.afterPuttingInBoilingWater,
                  'afterPuttingInBoilingWater',
                )
              )
                return;
              item.beforePuttingInBoilingWater = Number(
                item.beforePuttingInBoilingWater,
              );
              item.afterPuttingInBoilingWater = Number(
                item.afterPuttingInBoilingWater,
              );
            } else if (
              selectedTestSample.type ===
              TEST_TYPES.FINENESS_CONSISTENCY_INITIAL_AND_FINAL_SETTING_TIME
            ) {
              if (i === 0) {
                if (
                  !isValidNumber(item.weightOfSample, 'weightOfSample') ||
                  !isValidNumber(
                    item.weightOfCementRetained,
                    'weightOfCementRetained',
                  )
                )
                  return;
                item.weightOfSample = Number(item.weightOfSample);
                item.weightOfCementRetained = Number(
                  item.weightOfCementRetained,
                );
              } else if (i === 1) {
                if (
                  !isValidNumber(item.weightOfCement, 'weightOfCement') ||
                  !isValidNumber(item.weightOfWater, 'weightOfWater') ||
                  !isValidNumber(
                    item.penetrationOfPlunger,
                    'penetrationOfPlunger',
                  )
                )
                  return;
                item.weightOfCement = Number(item.weightOfCement);
                item.weightOfWater = Number(item.weightOfWater);
                item.penetrationOfPlunger = Number(item.penetrationOfPlunger);
              } else {
                if (!isValidNumber(item.weightOfCement, 'weightOfCement'))
                  return;
                item.weightOfCement = Number(item.weightOfCement);
              }
            }
          }
          // Fine Aggregate checks
          if (
            currentTestMaterialData.materialType ===
            TEST_MATERIALS_TYPES.FINE_AGGREGATE
          ) {
            if (selectedTestSample.type === TEST_TYPES.GRADATION) {
              if (!isValidNumber(item.weightRetainedInGm, 'weightRetainedInGm'))
                return;
              item.weightRetainedInGm = Number(item.weightRetainedInGm);
            } else if (
              selectedTestSample.type === TEST_TYPES.NATURAL_MOISTURE_CONTENT ||
              selectedTestSample.type ===
                TEST_TYPES.SPECIFIC_GRAVITY_AND_WATER_ABSORPTION
            ) {
              if (!item.hide) {
                if (
                  !isValidNumber(item.test1, 'test1') ||
                  !isValidNumber(item.test2, 'test2') ||
                  !isValidNumber(item.test3, 'test3')
                )
                  return;
                item.test1 = Number(item.test1);
                item.test2 = Number(item.test2);
                item.test3 = Number(item.test3);
              }
            }
          }
          // Coarse Aggregate Checks
          if (
            currentTestMaterialData.materialType ===
            TEST_MATERIALS_TYPES.COARSE_AGGREGATE
          ) {
            if (selectedTestSample.type === TEST_TYPES.GRADATION) {
              if (!isValidNumber(item.weightRetainedInGm, 'weightRetainedInGm'))
                return;
              item.weightRetainedInGm = Number(item.weightRetainedInGm);
            } else if (
              selectedTestSample.type === TEST_TYPES.LOS_ANGELES_ABRATION ||
              selectedTestSample.type === TEST_TYPES.NATURAL_MOISTURE_CONTENT ||
              selectedTestSample.type ===
                TEST_TYPES.SPECIFIC_GRAVITY_AND_WATER_ABSORPTION ||
              selectedTestSample.type === TEST_TYPES.AGGREGATE_IMPACT_VALUE
            ) {
              if (!item.hide) {
                if (
                  !isValidNumber(item.test1, 'test1') ||
                  !isValidNumber(item.test2, 'test2') ||
                  !isValidNumber(item.test2, 'test3')
                )
                  return;
                item.test1 = Number(item.test1);
                item.test2 = Number(item.test2);
                item.test3 = Number(item.test3);
              }
            } else if (selectedTestSample.type === TEST_TYPES.FI_EI) {
              if (
                !isValidNumber(
                  item.totalWeightOfAggregateRetained,
                  'totalWeightOfAggregateRetained',
                ) ||
                !isValidNumber(
                  item.weightPassingFlakinessGauge,
                  'weightPassingFlakinessGauge',
                ) ||
                !isValidNumber(
                  item.weightRetainedFlakinessGauge,
                  'weightRetainedFlakinessGauge',
                ) ||
                !isValidNumber(
                  item.weightRetainedElongationGauge,
                  'weightRetainedElongationGauge',
                )
              )
                return;
              item.totalWeightOfAggregateRetained = Number(
                item.totalWeightOfAggregateRetained,
              );
              item.weightPassingFlakinessGauge = Number(
                item.weightPassingFlakinessGauge,
              );
              item.weightRetainedFlakinessGauge = Number(
                item.weightRetainedFlakinessGauge,
              );
              item.weightRetainedElongationGauge = Number(
                item.weightRetainedElongationGauge,
              );
            }
          }
        });

        if (
          currentTestMaterialData.materialType ===
          TEST_MATERIALS_TYPES.FINE_AGGREGATE
        ) {
          if (selectedTestSample.type === TEST_TYPES.GRADATION) {
            if (!isValidNumber(observations.weightOfSample, 'weightOfSample'))
              return;
            observations.weightOfSample = Number(observations.weightOfSample);
          }
        }

        if (
          currentTestMaterialData.materialType ===
          TEST_MATERIALS_TYPES.COARSE_AGGREGATE
        ) {
          if (i === 0 && selectedTestSample.type === TEST_TYPES.GRADATION) {
            if (!isValidNumber(observations.weightOfSample, 'weightOfSample'))
              return;
            observations.weightOfSample = Number(observations.weightOfSample);
          }
        }

        if (
          currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CEMENT
        ) {
          if (selectedTestSample.type === TEST_TYPES.COMPRESSIVE_STRENGTH) {
            observations.dateOfTesting.value =
              objSampleTest7thOr28thDay.dateOfTesting;
          }
        }
      }
    } else if (
      testWorkCategoryDataType === TEST_WORK_CATEGORY_TYPES.BITUMINOUS_WORKS
    ) {
      if (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.SMA) {
        //
      }
    }

    sampleData = objSampleTest7thOr28thDay;

    dispatch(
      fillRFIsChecklistForTestSample({
        projectId: loggedInUser.projectId,
        rfiId: selectedTestSample._id,
        status: status,
        body: {
          sampleData: sampleData,
        },
      }),
    );

    /*dispatch(
      generateTestSampleReport({
        // testRFIId: (selectedTestSample.type === TEST_TYPES.SOUNDNESS || currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE
        //   || currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.COARSE_AGGREGATE
        //   ) ? selectedTestSample.testRFIsData[0]?._id : selectedTestSample._id,
        projectId: loggedInUser.projectId,
        testRFIId: selectedTestSample._id,
        body: {
          sampleData: sampleData,
        },
      }),
    );*/
  };

  useEffect(() => {
    if (generatedTestSampleReport) {
      Alert.alert('Info', 'Test sample report generated.');
    }
  }, [generatedTestSampleReport, error]);

  const getStyle = (item: any) => {
    if (item.rfiStatus) {
      if (
        item.rfiStatus === RFI_STATUS.GENERATED ||
        item.rfiStatus === RFI_STATUS.RE_GENERATED
      ) {
        return [styles.StartWorkCard, styles.StartBorder];
      } else if (
        item.rfiStatus === RFI_STATUS.REJECTED ||
        item.rfiStatus === RFI_STATUS.CANCELLED
      ) {
        return [styles.StartWorkCard, styles.StartRejectBorder];
      } else if (item.rfiStatus === RFI_STATUS.IN_PROGRESS) {
        return [styles.StartWorkCard, styles.StartInProgressBorder];
      } else if (item.rfiStatus === RFI_STATUS.IN_REVIEW) {
        return [styles.StartWorkCard, styles.StartReviewBorder];
      } else if (item.rfiStatus === RFI_STATUS.APPROVED) {
        return [styles.StartWorkCard, styles.StartCompleteBorder];
      }
    }
    return [styles.StartWorkCardDisabled, styles.DisabledBorder];
  };

  const [concreteSampleTestItems, setConcreteSampleTestItems]: any[] = useState(
    [],
  );

  const [formSampleTest7thOr28thDay, setFormSampleTest7thOr28thDay] =
    useState<FormSampleTest7thOr28thDayState>({
      dateOfTesting: '',
      sampleBy: '',
      testConductedBy: '',
      roomTemperature: 0,
      humidity: 0,
      typeOfConcreteSurface: '',
      observations: [],
    });

  const colors = CARD_COLORS_ARRAY;
  const imageMap: any = CARD_ICONS;

  return (
    <View style={styles.Container}>
      {breadcrumbData.length ? (
        <View style={styles.BreadcrumbContainer}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={styles.scrollView}>
            {breadcrumbData.map((item: any, index) => (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {index == 0 ? (
                  <Text
                    style={styles.BreadcrumbPrevTextUnderline}
                    onPress={() =>
                      index === 0 && (setCurrentLevel(0), setBreadcrumbData([]))
                    }>
                    {item.name}
                  </Text>
                ) : index === breadcrumbData.length - 1 ? (
                  <Text style={styles.BreadcrumbCurrentText}>{item.name}</Text>
                ) : (
                  <Text style={styles.BreadcrumbPrevText}>{item.name}</Text>
                )}
                {index < breadcrumbData.length - 1 ? (
                  <Image
                    style={styles.ArrowIcon}
                    source={require('../../images/right-arrow-icon.png')}
                  />
                ) : null}
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}
      {/* {currentLevel === 0 && (
        <View style={{paddingHorizontal: 10}}>
          <View style={styles.qualityDropDown}> */}
            {/* <CustomSelectDropdown
              label="Selected Type"
              data={approvalTypeArray}
              selectedValue={selectedValues}
              onSelect={(selectedOption: any) =>
                handleApprovalType(selectedOption)
              }
            /> */}

            {/* {approvalTypeArray.map((item: any, index: number) => (
              <TouchableOpacity
                onPress={() => handleApprovalType(item)}>
                <View key={index}>
                  <Text>{item.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )} */}

      {currentLevel !== 0 && currentLevel !== 1 && currentLevel !== 4 ? (
        <View style={styles.SearchBox}>
          <Image
            source={require('./../../images/search-icon.png')}
            style={styles.ImageSearch}
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Search"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
            }}
          />
        </View>
      ) : null}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.Height100}>
        {currentLevel === 0
          ? myTestsDataAll.map((testClassificationItem: any, index: number) => (
            <LinearGradient colors={['#FEFEFF', '#E1E8FF']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.hardcodedGradientContainer}>
              <TouchableOpacity
                style={[
                  styles.MyWorkCard
                ]}
                onPress={() => handleApprovalType(testClassificationItem)}>
                <View style={styles.TaskDetails}>
                  <Text style={styles.HeadingText}>
                    {testClassificationItem.name}
                  </Text>
                  {/* <View style={{flexDirection: 'row'}}>
                    <Text style={styles.SubHeadingText}>Assigneddd :</Text>
                    <Text style={[styles.SubHeadingText, styles.SubActive]}>
                      {testClassificationItem.name}
                    </Text>
                  </View> */}
                </View>
                <View style={commonStyles.iconsStyle}>
                  {imageMap.length && (
                    <Image
                      source={imageMap[index % imageMap.length]}
                      style={commonStyles.image}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </LinearGradient>
            ))
          : currentLevel === 1
          ? myTestsData.map(
              (testClassificationItem: any, testClassificationIndex: number) =>
                testClassificationItem.assignmentLevel === 1 ? (
                  <TouchableOpacity
                    style={[
                      styles.MyWorkCard,
                      {
                        backgroundColor:
                          colors[testClassificationIndex % colors.length],
                      },
                    ]}
                    onPress={() =>
                      onClick(
                        2,
                        testClassificationItem.assignmentLevel,
                        testClassificationIndex,
                      )
                    }>
                    <View style={styles.TaskDetails}>
                      <Text style={styles.HeadingText}>
                        {testClassificationItem.name}
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.SubHeadingText}>Assigned:</Text>
                        <Text style={[styles.SubHeadingText, styles.SubActive]}>
                          {testClassificationItem.name}
                        </Text>
                      </View>
                    </View>
                    <View style={commonStyles.iconsStyle}>
                      {imageMap.length && (
                        <Image
                          source={
                            imageMap[testClassificationIndex % imageMap.length]
                          }
                          style={commonStyles.image}
                        />
                      )}
                    </View>
                    <View style={commonStyles.rightStyle}>
                      <Image
                        style={commonStyles.CloseIcon}
                        source={require('./../../images/right-arrow.png')}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  testClassificationItem.testWorkCategoriesData?.map(
                    (workCateItem: any, workCateIndex: any) =>
                      workCateItem.assignmentLevel === 2 ? (
                        <TouchableOpacity
                          style={[
                            styles.MyWorkCard,
                            {
                              backgroundColor:
                                colors[workCateIndex % colors.length],
                            },
                          ]}
                          onPress={() =>
                            onClick(
                              3,
                              workCateItem.assignmentLevel,
                              testClassificationIndex,
                              workCateIndex,
                            )
                          }>
                          <View style={styles.TaskDetails}>
                            <Text style={styles.HeadingText}>
                              {testClassificationItem.name}
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                              <Text style={styles.SubHeadingText}>
                                Assigned:
                              </Text>
                              <View style={{flexDirection: 'row'}}>
                                <Text
                                  style={[
                                    styles.SubHeadingText,
                                    styles.SubActive,
                                  ]}>
                                  {workCateItem.name}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={commonStyles.iconsStyle}>
                            {imageMap.length && (
                              <Image
                                source={
                                  imageMap[workCateIndex % imageMap.length]
                                }
                                style={commonStyles.image}
                              />
                            )}
                          </View>
                          <View style={commonStyles.rightStyle}>
                            <Image
                              style={commonStyles.CloseIcon}
                              source={require('./../../images/right-arrow.png')}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : workCateItem.testMaterialsData &&
                        workCateItem.testMaterialsData.length ? (
                        workCateItem.testMaterialsData?.map(
                          (testMateItem: any, testMateIndex: number) =>
                            testMateItem.assignmentLevel === 3 ? (
                              <TouchableOpacity
                                style={[
                                  styles.MyWorkCard,
                                  {
                                    backgroundColor:
                                      colors[testMateIndex % colors.length],
                                  },
                                ]}
                                onPress={() =>
                                  onClick(
                                    4,
                                    testMateItem.assignmentLevel,
                                    testClassificationIndex,
                                    workCateIndex,
                                    testMateIndex,
                                  )
                                }>
                                <View style={styles.TaskDetails}>
                                  <Text style={styles.HeadingText}>
                                    {testClassificationItem.name}
                                  </Text>
                                  <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.SubHeadingText}>
                                      Assigned:
                                    </Text>
                                    <Text style={styles.SubHeadingText}>
                                      {workCateItem.name} /
                                    </Text>
                                    <Text
                                      style={[
                                        styles.SubHeadingText,
                                        styles.SubActive,
                                      ]}>
                                      {testMateItem.name}
                                    </Text>
                                  </View>
                                </View>
                                <View style={commonStyles.iconsStyle}>
                                  {imageMap.length && (
                                    <Image
                                      source={
                                        imageMap[
                                          testMateIndex % imageMap.length
                                        ]
                                      }
                                      style={commonStyles.image}
                                    />
                                  )}
                                </View>
                                <View style={commonStyles.rightStyle}>
                                  <Image
                                    style={commonStyles.CloseIcon}
                                    source={require('./../../images/right-arrow.png')}
                                  />
                                </View>
                              </TouchableOpacity>
                            ) : (
                              testMateItem.testTypesData?.map(
                                (testTypeItem: any, testTypeIndex: number) =>
                                  testTypeItem.assignmentLevel === 4 && (
                                    <TouchableOpacity
                                      style={[
                                        styles.MyWorkCard,
                                        {
                                          backgroundColor:
                                            colors[
                                              testTypeIndex % colors.length
                                            ],
                                        },
                                      ]}
                                      onPress={() =>
                                        onClick(
                                          5,
                                          testTypeItem.assignmentLevel,
                                          testClassificationIndex,
                                          workCateIndex,
                                          testMateIndex,
                                          testTypeIndex,
                                        )
                                      }>
                                      <View style={styles.TaskDetails}>
                                        <Text style={styles.HeadingText}>
                                          {testClassificationItem.name}
                                        </Text>
                                        <View style={{flexDirection: 'row'}}>
                                          <Text style={styles.SubHeadingText}>
                                            Assigned:
                                          </Text>
                                          <Text style={styles.SubHeadingText}>
                                            {workCateItem.name} /
                                          </Text>
                                          <Text style={styles.SubHeadingText}>
                                            {testMateItem.name} /
                                          </Text>
                                          <Text
                                            style={[
                                              styles.SubHeadingText,
                                              styles.SubActive,
                                            ]}>
                                            {testTypeItem.name}
                                          </Text>
                                        </View>
                                      </View>
                                      <View style={commonStyles.iconsStyle}>
                                        {imageMap.length && (
                                          <Image
                                            source={
                                              imageMap[
                                                testTypeIndex % imageMap.length
                                              ]
                                            }
                                            style={commonStyles.image}
                                          />
                                        )}
                                      </View>
                                      <View style={commonStyles.rightStyle}>
                                        <Image
                                          style={commonStyles.CloseIcon}
                                          source={require('./../../images/right-arrow.png')}
                                        />
                                      </View>
                                    </TouchableOpacity>
                                  ),
                              )
                            ),
                        )
                      ) : null,
                  )
                ),
            )
          : null}
        {currentLevel === 2
          ? currentTestWorkCategoryData && currentTestWorkCategoryData.length
            ? currentTestWorkCategoryData
                .filter((subSeg: any) => {
                  if (searchText && subSeg.name) {
                    return subSeg.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                  } else {
                    return true;
                  }
                })
                .map((item: any, index) => (
                  <TouchableOpacity
                    style={getStyle(item)}
                    onPress={() => onClickNested(3, item)}>
                    <View style={styles.leftContainer}>
                      <Text style={styles.HeadText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))
            : tasksListing(currentTestTypesData, searchText, getStyle, styles)
          : null}
        {currentLevel === 3
          ? currentTestMaterialsData && currentTestMaterialsData.length
            ? currentTestMaterialsData
                .filter((testMate: any) => {
                  if (searchText && testMate.name) {
                    return testMate.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                  } else {
                    return true;
                  }
                })
                .map((item: any, index) => (
                  <TouchableOpacity
                    style={getStyle(item)}
                    onPress={() => onClickNested(4, item)}>
                    <View style={styles.leftContainer}>
                      <Text style={styles.HeadText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))
            : tasksListing(currentTestTypesData, searchText, getStyle, styles)
          : null}
        {currentLevel === 4
          ? tasksListing(currentTestTypesData, searchText, getStyle, styles)
          : null}
        {currentLevel === 5 && currentSubTestTypesData?.length
          ? currentSubTestTypesData
              .filter((subTestType: any) => {
                if (searchText && subTestType.name) {
                  return subTestType.name
                    .toLowerCase()
                    .includes(searchText.toLowerCase());
                } else {
                  return true;
                }
              })
              .map((item: any) => (
                <TouchableOpacity
                  style={getStyle(item)}
                  onPress={() => onClickNested(6, item)}>
                  <View style={styles.leftContainer}>
                    <Text style={styles.HeadText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))
          : ((currentTestMaterialData.materialType ===
              TEST_MATERIALS_TYPES.CONCRETE &&
              selectedTestSample?.type === TEST_TYPES.CUBE_TEST) ||
              (currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.CEMENT &&
                selectedTestSample?.type === TEST_TYPES.COMPRESSIVE_STRENGTH) ||
              ((currentTestMaterialData.materialType ===
                TEST_MATERIALS_TYPES.DLC ||
                currentTestMaterialData.materialType ===
                  TEST_MATERIALS_TYPES.PQC) &&
                selectedTestSample?.type === TEST_TYPES.CUBE_TEST)) &&
            tasksListing(currentTestTypesData, searchText, getStyle, styles)}
        {currentLevel === 6 ? (
          currentSubTestTypeRFIsData?.length ? (
            <ScrollView style={styles.Height100}>
              {currentSubTestTypeRFIsData
                .filter((testRFI: any) => {
                  if (searchText && testRFI.name) {
                    return testRFI.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
                  } else {
                    return true;
                  }
                })
                .map((item: any) => {
                  if (
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.SMA ||
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.DBM_RAP_DBM ||
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.BC ||
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.COARSE_AGGREGATE_MICRO_SURFACING ||
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.BITUMEN ||
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.COARSE_AGGREGATE_DBM_BC ||
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.COARSE_AGGREGATE_SMA ||
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.EMULSION
                  ) {
                    return (
                      <TouchableOpacity
                        style={getStyle(item)}
                        onPress={() => onClickBitumenTestSampleItem(item)}>
                        <View style={styles.leftContainer}>
                          <Text style={styles.HeadText}>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  } else if (
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.SOIL ||
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.FLY_ASH
                  ) {
                    return (
                      <TouchableOpacity
                        style={getStyle(item)}
                        onPress={() => onClickEarthworkSampleItem(item)}>
                        <View style={styles.leftContainer}>
                          <Text style={styles.HeadText}>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  } else if (
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.GSB ||
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.CTSB
                  ) {
                    return (
                      <TouchableOpacity
                        style={getStyle(item)}
                        onPress={() => onClickSubBaseSampleItem(item)}>
                        <View style={styles.leftContainer}>
                          <Text style={styles.HeadText}>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  } else if (
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.WMM ||
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.FINE_AGGREGATE_WMM ||
                    currentTestMaterialData.materialType ===
                      TEST_MATERIALS_TYPES.COARSE_AGGREGATE_WMM
                  ) {
                    return (
                      <TouchableOpacity
                        style={getStyle(item)}
                        onPress={() => onClickBaseSubBaseSampleItem(item)}>
                        <View style={styles.leftContainer}>
                          <Text style={styles.HeadText}>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  } else {
                    return (
                      <View>
                        <View
                          style={
                            item.sampleStatus !=
                              TEST_SAMPLE_STATUS.PREPARED && {
                              borderColor: '#000',
                              borderWidth: 1,
                              borderRadius: 10,
                              marginBottom: 10,
                            }
                          }>
                          <TouchableOpacity
                            style={getStyle(item)}
                            disabled={
                              item.sampleStatus !=
                                TEST_SAMPLE_STATUS.PREPARED ||
                              item.rfiStatus === RFI_STATUS.APPROVED
                            }
                            onPress={() => onClickTestSampleItem(item)}>
                            <View style={styles.leftContainer}>
                              <Text style={styles.HeadText}>{item.name}</Text>
                            </View>
                          </TouchableOpacity>
                          {item.sampleStatus != TEST_SAMPLE_STATUS.PREPARED ? (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                alignItems: 'center',
                              }}>
                              <View style={[styles.SectionStyle, {width: 140}]}>
                                <CustomDropdownPicker
                                  items={TEST_SAMPLE_STATUS_LIST}
                                  rowItem={item}
                                  tempProp={true}
                                  fieldName={'sampleStatus'}
                                />
                              </View>
                              <View style={{height: 45}}>
                                <CustomCalendarPicker
                                  rowItem={item}
                                  tempProp={true}
                                  fieldName={
                                    'rfiDateTime'
                                  }></CustomCalendarPicker>
                              </View>
                              <View style={{height: 45, width: 100}}>
                                <TouchableOpacity
                                  style={[
                                    styles.SubmitSample,
                                    styles.StartBorder,
                                  ]}
                                  onPress={() => onUpdateTestSample(item)}>
                                  <View style={styles.leftContainer}>
                                    <Text style={styles.HeadText}>Submit</Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    );
                  }
                })}
            </ScrollView>
          ) : (
            <Text>Sample/RFI not found.</Text>
          ) //tasksListing()
        ) : null}
        {/* No Data Found */}
        {!loading && !myTestsDataAll.length ? (
          <View style={styles.NoDataContainer}>
            <Image
              style={styles.WthHeight}
              source={require('./../../images/no-data-found.png')}
            />
            <Text style={styles.NodataHeadText}>Sorry, no result found!</Text>
            {/* {(searchText && <Text style={styles.NodataSubText}>
              Please try to search another keywork...
            </Text>
            )} */}
          </View>
        ) : null}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={openPopup}
        onRequestClose={() => {
          setOpenPopup(false);
        }}>
        <View style={styles.bodyPopup}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.ModalHeader}>
                <Text style={styles.modalText}>Test Sample</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => setOpenPopup(false)}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ModalInnerContainer}>
                <View>
                  <Text style={styles.modalLabel}>
                    {selectedTestSample?.name}
                  </Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={[styles.Width100, styles.Height90]}>
                  <Fragment>
                    <StatusBar barStyle="dark-content" />
                    <SafeAreaView>
                      {selectedTestSample &&
                      selectedTestSample?.testClassificationType ==
                        TEST_CLASSIFICATION_TYPES.THIRD_PARTY_LAB_TEST
                        ? thirdPartySampleTest(
                            styles,
                            selectedTestSample?.materialType,
                            formSampleTest7thOr28thDay,
                            setFormSampleTest7thOr28thDay,
                            currentTestMaterialData,
                            selectedTestSample,
                            concreteSampleTestItems,
                          )
                        : concreteSampleTestItems.length > 0 &&
                          (currentTestMaterialData.materialType ===
                            TEST_MATERIALS_TYPES.SOIL ||
                          currentTestMaterialData.materialType ===
                            TEST_MATERIALS_TYPES.FLY_ASH
                            ? testSampleFormEarthwork(
                                styles,
                                selectedTestSample?.materialType,
                                formSampleTest7thOr28thDay,
                                setFormSampleTest7thOr28thDay,
                                currentTestMaterialData,
                                selectedTestSample,
                                concreteSampleTestItems,
                              )
                            : currentTestMaterialData.materialType ===
                                TEST_MATERIALS_TYPES.GSB ||
                              currentTestMaterialData.materialType ===
                                TEST_MATERIALS_TYPES.CTSB
                            ? testSampleFormSubBase(
                                styles,
                                selectedTestSample?.materialType,
                                formSampleTest7thOr28thDay,
                                setFormSampleTest7thOr28thDay,
                                currentTestMaterialData,
                                selectedTestSample,
                                concreteSampleTestItems,
                              )
                            : currentTestMaterialData.materialType ===
                                TEST_MATERIALS_TYPES.WMM ||
                              currentTestMaterialData.materialType ===
                                TEST_MATERIALS_TYPES.FINE_AGGREGATE_WMM ||
                              currentTestMaterialData.materialType ===
                                TEST_MATERIALS_TYPES.COARSE_AGGREGATE_WMM
                            ? testSampleFormBaseSubBase(
                                styles,
                                selectedTestSample?.materialType,
                                formSampleTest7thOr28thDay,
                                setFormSampleTest7thOr28thDay,
                                currentTestMaterialData,
                                selectedTestSample,
                                concreteSampleTestItems,
                              )
                            : testSampleForm(
                                styles,
                                selectedTestSample?.materialType,
                                formSampleTest7thOr28thDay,
                                setFormSampleTest7thOr28thDay,
                                currentTestMaterialData,
                                selectedTestSample,
                                concreteSampleTestItems,
                              ))}
                    </SafeAreaView>
                  </Fragment>
                </ScrollView>

                <View
                  style={[
                    styles.btnParentSection,
                    {
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 20,
                      marginBottom: -65,
                      backgroundColor: '#fff',
                      paddingVertical: 10,
                      marginHorizontal: -15,
                    },
                  ]}>
                  <TouchableOpacity
                    style={[styles.submitButton, styles.saveButtonColor]}
                    onPress={() => onSubmitTestSample(RFI_STATUS.IN_PROGRESS)}>
                    <Text style={styles.submitButtonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => onSubmitTestSample(RFI_STATUS.IN_REVIEW)}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <LoadingAnimation loading={loading}></LoadingAnimation>
    </View>
  );
};

const styles = StyleSheet.create({
  assignTagButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  GenerateRFIFieldLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 5,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 10,
    marginTop: 5,
  },
  Container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  Height100: {
    height: '100%',
  },
  Width100: {
    width: Dimensions.get('screen').width - 20,
  },
  Height90: {
    height: Dimensions.get('screen').height - 300,
  },
  SearchBox: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 30,
    position: 'relative',
    marginHorizontal: -20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    // Shadow for Android
    elevation: 10,
  },
  ImageSearch: {
    position: 'absolute',
    width: 24,
    height: 24,
    zIndex: 9,
    left: 10,
    top: '34%',
  },
  inputStyle: {
    flex: 1,
    color: '#2c2c2c',
    paddingLeft: 45,
    paddingRight: 15,
    backgroundColor: '#fff',
    fontWeight: '600',
    paddingVertical: 15,
    height: 55,
  },
  inputStyle2: {
    flex: 1,
    color: '#2c2c2c',
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#808089',
    backgroundColor: '#fff',
    fontWeight: '600',
    height: 45,
    width: 50,
  },
  inputStyle3: {
    flex: 1,
    color: '#2c2c2c',
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#808089',
    backgroundColor: '#fff',
    fontWeight: '600',
    height: 40,
    width: 120,
  },
  inputStyle4: {
    flex: 1,
    color: '#2c2c2c',
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#808089',
    backgroundColor: '#fff',
    fontWeight: '600',
    height: 40,
    width: 150,
  },
  textStyle: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#808089',
    backgroundColor: '#ccc',
    fontWeight: '600',
    height: 40,
    width: 120,
  },
  textStyle2: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#808089',
    backgroundColor: '#ccc',
  },
  boxBorder: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#808089',
  },
  //Start Work
  StartWorkCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  StartWorkCardDisabled: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    opacity: 0.5,
  },
  SubmitSample: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 45,
    textAlign: 'center',
    padding: 10,
    alignItems: 'center',
    marginLeft: 20,
  },
  leftContainer: {
    flexDirection: 'column',
  },
  HeadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  MyWorkSubHead: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  WorkIcon: {
    width: 12,
    height: 12,
  },
  MyWorkCta: {
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  CtaStartText: {
    fontSize: 12,
    fontWeight: '400',
  },
  CtaStartTextColor: {
    color: '#A1A1A1',
  },
  StartBorder: {
    borderColor: '#A1A1A1',
  },
  DisabledBorder: {
    borderColor: '#EBEBE4',
  },
  CtaInProgressTextColor: {
    color: '#FCB700',
  },
  StartInProgressBorder: {
    borderColor: '#FCB700',
  },
  CtaReviewTextColor: {
    color: '#1C58C0',
  },
  StartReviewBorder: {
    borderColor: '#1C58C0',
  },
  CtaCompleteTextColor: {
    color: '#2BC267',
  },
  StartCompleteBorder: {
    borderColor: '#2BC267',
  },
  StartRejectBorder: {
    borderColor: '#FF0000',
  },
  CtaRejectTextColor: {
    color: '#FF0000',
  },
  BackToQualityworkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginTop: -10,
    marginBottom: 8,
    backgroundColor: '#e7ebf4',
    gap: 5,
  },
  //Breacrumb Start
  BreadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginTop: -21,
    backgroundColor: '#e7ebf4',
    gap: 5,
  },
  scrollView: {
    paddingVertical: 10,
    paddingBottom: 15,
  },
  BreadcrumbPrevText: {
    fontSize: 14,
    color: '#333',
  },
  BreadcrumbPrevTextUnderline: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#333',
  },
  BreadcrumbCurrentText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  ArrowIcon: {
    width: 18,
    height: 18,
  },

  //MyQualityWork Card
  MyWorkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    alignItems: 'flex-start',
    width: '100%'
  },
  hardcodedGradientContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderRadius: 12,
    position: 'relative',
    marginBottom: 20,
    borderColor: '#CDD6F6',
    borderWidth: 1,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,

  },
  CompleteWork: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#2BC267',
    backgroundColor: '#fff',
  },
  CompleteIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  HeadingText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  TaskDetails: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  SubHeadingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    marginRight: 5,
  },
  SubActive: {
    color: '#fff',
    fontWeight: '800',
  },
  NoDataContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '30%',
  },
  WthHeight: {
    width: 150,
    height: 150,
  },
  NodataHeadText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27272A',
  },
  NodataSubText: {
    fontSize: 16,
    color: '#27272A',
  },

  centeredView: {
    marginTop: 'auto',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 60,
  },
  modalView: {
    minHeight: 150,
  },
  ModalHeader: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
  },
  modalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27272A',
    textAlign: 'center',
  },
  buttonClose: {
    position: 'absolute',
    right: 15,
  },
  CloseIcon: {
    width: 30,
    height: 30,
  },
  ModalInnerContainer: {
    paddingHorizontal: 15,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginTop: 10,
  },
  submitButton: {
    width: 120,
    backgroundColor: '#5A2AAF',
    borderRadius: 30,
    color: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 8,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonColor: {
    backgroundColor: '#5eab4b',
  },
  submitButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  Lable: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
    fontWeight: '500',
  },
  bodyPopup: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('window').height - 60,
    width: Dimensions.get('window').width,
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3,
  },
  btnParentSection: {
    // alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    // Shadow for Android
    elevation: 10,
    borderTopWidth: 1,
    borderColor: '#f3f3f3',
  },
  btnSection: {
    width: 150,
    height: 50,
    backgroundColor: '#1C58C0',
    // alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  /* Left Swipe */
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green',
    margin: 20,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Dark Gray
    margin: 10,
    textAlign: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF', // White
    borderBottomColor: '#E0E0E0', // Lighter Gray
    borderBottomWidth: 1,
    height: 45,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 10,
  },
  itemText: {
    color: '#333', // Dark Gray
    fontSize: 16,
    fontWeight: 'bold',
  },
  hiddenContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 45,
    borderRadius: 20,
  },
  hiddenButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: 45,
  },
  closeButton: {
    backgroundColor: 'green', // Blue
    borderRadius: 20,
  },
  deleteButton: {
    backgroundColor: '#E74C3C', // Red
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qualityDropDown: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 12,
    marginBottom: 15,
  },
});

export default MyQualityWork;
