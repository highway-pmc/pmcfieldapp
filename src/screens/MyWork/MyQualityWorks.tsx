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
  TEST_CONDUCTED_BY_LIST,
  TEST_MATERIALS_TYPES,
  TEST_SAMPLE_CONCRETE_CATEGORY,
  TEST_SAMPLE_STATUS,
  TEST_SAMPLE_STATUS_LIST,
  TEST_TYPES,
  TYPE_OF_CONCRETE_SURFACE_LIST,
  YES_NO_LIST,
} from '../../constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearMyWorksEvent,
  generateTestSampleReport,
  getMyTests,
  updateTestSample,
} from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import {
  getDbDateFromDDMMYYYY,
  isTestInventoryClassification,
} from '../../utils/Utils';
import CalendarPicker from '../../components/UI/CalenderPicker';
import Input from '../../components/UI/Input';
import DropdownPicker from '../../components/UI/DropdownPicker';
import TimePicker from '../../components/UI/TimePicker';
import {useSnackbar} from '../../context/SnackbarContext';
import commonStyles from '../Common/commonStyles';
import { CARD_COLORS_ARRAY, CARD_ICONS } from '../Common/CommonConstantsTypes';
const MyQualityWork = ({route, navigation}: {route: any; navigation: any}) => {
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const workType = PROJECT_TYPE.QUALITY_WORK;

  const {
    myTests,
    testSampleUpdated,
    generatedTestSampleReport,
    loading,
    error,
  } = useSelector((state: any) => state.MyWorks);
  const [myTestsDataAll, setMyTestsDataAll]: any = useState([]);
  const [myTestsData, setMyTestsData]: any = useState([]);
  const [currentTestWorkCategoryData, setCurrentTestWorkCategoryData] =
    useState([]);
  const [currentTestMaterialsData, setCurrentTestMaterialsData] = useState([]);
  const [currentTestMaterialData, setCurrentTestMaterialData]: any = useState(
    {},
  );
  const [currentTestTypesData, setCurrentTestTypesData] = useState([]);
  const [currentSubTestTypesData, setCurrentSubTestTypesData]: any = useState(
    [],
  );
  const [currentSubTestTypeRFIsData, setCurrentSubTestTypeRFIsData] = useState(
    [],
  );
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
  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.myQualityWorks);
      setCurrentLevel(1);
      setMyTestsDataAll([]);
      setMyTestsData([]);
      setCurrentTestWorkCategoryData([]);
      setCurrentTestMaterialsData([]);
      setCurrentTestTypesData([]);
      setCurrentSubTestTypesData([]);
      setCurrentSubTestTypeRFIsData([]);
      setBreadcrumbData([]);
      getMyWorksData();
      setSearchText('');
    }
  }, [focus]);

  const getMyWorksData = () => {
    dispatch(
      getMyTests({
        projectId: loggedInUser.projectId,
        workType: workType,
      }),
    );
  };

  useEffect(() => {
    if (myTests) {
      setCurrentLevel(0);
      setMyTestsDataAll(myTests);
    }
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
  }, [myTests, testSampleUpdated, error]);

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
    setCurrentLevel(1);
    if (isTestInventoryClassification(item.type)) {
      // TODO - will introduce type in db and use it iso Classification Name
      //const testWorkCategory = item.testWorkCategoriesData[1];
      navigation.navigate('SelectTestWorkCategory', {
        testClassificationId: item.id,
        testClassificationName: item.name,
        testClassificationType: item.type,
        testWorkCategoriesData: item.testWorkCategoriesData,
        workType: workType,
      });
      return;
    }
    setMyTestsData([item]);
  };

  const onClick = (
    level: number,
    assignmentLevel: number,
    testClassifIndex: number,
    workCateIndex: number = -1,
    testMateIndex: number = -1,
    testTypeIndex: number = -1,
  ) => {
    const testClassifData: any = myTestsData[testClassifIndex];
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
          breadCrumb[3].name = testTypeData.name;
          console.log('testTypeData>>>>>>>>>>>>:', testMateData);
          testTypeData.testRFIsData?.forEach((rfi: any) => {
            rfi.type = testTypeData.type;
          });
          if (testMateData.materialType === TEST_MATERIALS_TYPES.CONCRETE) {
            if (testTypeData.type === TEST_SAMPLE_CONCRETE_CATEGORY.CORE_TEST) {
              setCurrentTestTypesData([]);
              testTypeData.materialType = TEST_MATERIALS_TYPES.CONCRETE; // TEMP - TODO
              setSelectedTestSample(testTypeData);

              const testObservations: any = [];
              testObservations.push(getTestSampleConcreteObject(1));
              setConcreteSampleTestItems(testObservations);
              setOpenPopup(true);
            } else if (testTypeData.type === TEST_TYPES.CUBE_TEST) {
              setCurrentTestTypesData([]);
              testTypeData.materialType = TEST_MATERIALS_TYPES.CONCRETE; // TEMP - TODO
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
            testMateData.materialType === TEST_MATERIALS_TYPES.SMA
          ) {
            testTypeData.materialType = TEST_MATERIALS_TYPES.SMA;
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
          }
          // breadCrumb.push({
          //   name: testTypeData.name,
          //   testClassifIndex: testClassifIndex,
          //   workCateIndex: workCateIndex,
          //   testMateIndex: testMateIndex,
          //   testTypeIndex: testTypeIndex,
          //   level: level,
          //   assignmentLevel: 4,
          //   active: true
          // })
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
    const testObservations: any = [];
    item.type = selectedTestSample.type;
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
        testObservations.push(getTestSampleCementCompressiveStrengthObject(1));
        testObservations[0].ageInDays.value = item.testCategory;
      } else if (selectedTestSample.type === TEST_TYPES.SOUNDNESS) {
        testObservations.push(getTestSampleCementSoundnessObject(1));
      } else if (
        selectedTestSample.type ===
        TEST_TYPES.FINENESS_CONSISTENCY_INITIAL_AND_FINAL_SETTING_TIME
      ) {
        testObservations.push(getTestSampleCementInitialFinalSettingObject(1));
        testObservations.push(getTestSampleCementInitialFinalSettingObject(2));
        testObservations.push(getTestSampleCementInitialFinalSettingObject(3));
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
        testObservations.push(
          getTestSampleCementCoarseAggregateObject(2, selectedTestSample.type),
        );
        testObservations.push(
          getTestSampleCementCoarseAggregateObject(3, selectedTestSample.type),
        );
      }
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
    const objSampleTest7thOr28thDay = Object.assign(
      {},
      formSampleTest7thOr28thDay,
    );
    objSampleTest7thOr28thDay.dateOfTesting = getDbDateFromDDMMYYYY(
      objSampleTest7thOr28thDay.dateOfTesting,
    );
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
          currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CONCRETE
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
              item.weightOfCementRetained = Number(item.weightOfCementRetained);
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
              if (!isValidNumber(item.weightOfCement, 'weightOfCement')) return;
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

    dispatch(
      generateTestSampleReport({
        // testRFIId: (selectedTestSample.type === TEST_TYPES.SOUNDNESS || currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE
        //   || currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.COARSE_AGGREGATE
        //   ) ? selectedTestSample.testRFIsData[0]?._id : selectedTestSample._id,
        projectId: loggedInUser.projectId,
        testRFIId: selectedTestSample._id,
        body: {
          sampleData: objSampleTest7thOr28thDay,
        },
      }),
    );
  };
  //Bituminus work -> Coarse Aggregate -> FI & EI
  const getTestSampleFIEIObject = (sampleNum: any) => {
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
          //'Weight retained on flakiness gauge in gm',
          'Weight retained on elongation gauge in mm',
        ],
        values: [
          {
            sizeFractionOfAggregatePassing: '63.5',
            sizeFractionOfAggregateRetained: '50.0',
            totalWeightOfAggregateRetained: 0,
            weightPassingOnFlakinessGauge: 0,
            // weightRetainedOnFlakinessGauge: 0,
            weightRetainedOnElongationGauge: 0,
          },
          {
            sizeFractionOfAggregatePassing: '50.0',
            sizeFractionOfAggregateRetained: '40.0',
            totalWeightOfAggregateRetained: 0,
            weightPassingOnFlakinessGauge: 0,
            // weightRetainedOnFlakinessGauge: 0,
            weightRetainedOnElongationGauge: 0,
          },
          {
            sizeFractionOfAggregatePassing: '40.0',
            sizeFractionOfAggregateRetained: '31.5',
            totalWeightOfAggregateRetained: 0,
            weightPassingOnFlakinessGauge: 0,
            // weightRetainedOnFlakinessGauge: 0,
            weightRetainedOnElongationGauge: 0,
          },
          {
            sizeFractionOfAggregatePassing: '31.5',
            sizeFractionOfAggregateRetained: '25.0',
            totalWeightOfAggregateRetained: 0,
            weightPassingOnFlakinessGauge: 0,
            // weightRetainedOnFlakinessGauge: 0,
            weightRetainedOnElongationGauge: 0,
          },
          {
            sizeFractionOfAggregatePassing: '25.0',
            sizeFractionOfAggregateRetained: '20.0',
            totalWeightOfAggregateRetained: 0,
            weightPassingOnFlakinessGauge: 0,
            // weightRetainedOnFlakinessGauge: 0,
            weightRetainedOnElongationGauge: 0,
          },
          {
            sizeFractionOfAggregatePassing: '20.0',
            sizeFractionOfAggregateRetained: '16.0',
            totalWeightOfAggregateRetained: 0,
            weightPassingOnFlakinessGauge: 0,
            // weightRetainedOnFlakinessGauge: 0,
            weightRetainedOnElongationGauge: 0,
          },
          {
            sizeFractionOfAggregatePassing: '16.0',
            sizeFractionOfAggregateRetained: '12.5',
            totalWeightOfAggregateRetained: 0,
            weightPassingOnFlakinessGauge: 0,
            // weightRetainedOnFlakinessGauge: 0,
            weightRetainedOnElongationGauge: 0,
          },
          {
            sizeFractionOfAggregatePassing: '12.5',
            sizeFractionOfAggregateRetained: '10.0',
            totalWeightOfAggregateRetained: 0,
            weightPassingOnFlakinessGauge: 0,
            // weightRetainedOnFlakinessGauge: 0,
            weightRetainedOnElongationGauge: 0,
          },
          {
            sizeFractionOfAggregatePassing: '10.0',
            sizeFractionOfAggregateRetained: '6.3',
            totalWeightOfAggregateRetained: 0,
            weightPassingOnFlakinessGauge: 0,
            // weightRetainedOnFlakinessGauge: 0,
            weightRetainedOnElongationGauge: 0,
          },
        ],
      },
    };
  };
  //Bituminus work -> Coarse Aggregate -> AIV
  const getTestSampleAIVObject = (sampleNum: any) => {
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
  //Bituminus work -> Micro Surfaceing -> Binder Content
  //Bituminus work -> SMA -> Binder Content
  //Bituminus work -> BC -> Binder Content
  //Bituminus work -> DBM/RAP DBM -> Binder Content DBM
  const getTestSampleBinderContentObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
        values: [
          {
            description: 'Weight of Sample before extraction in gm (A)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of Filter paper before extraction in gm (B)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of Sample after extraction in gm (C)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of filter paper after extraction in gm (D)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          // {
          //   description: 'Weight of Bitumen in the mix (E = (A-C) - (D-B))',
          //   test1: 0,
          //   test2: 0,
          //   test3: 0,
          // },
          // {
          //   description: '% of the Bitumen in the total Mix (F= E/A* 100)',
          //   test1: 0,
          //   test2: 0,
          //   test3: 0,
          // },
          // {
          //   description: 'Average Binder Content ((F1+F2+F3)/3)',
          //   test1: 0,
          //   test2: 0,
          //   test3: 0,
          // },
        ],
      },
    };
  };
  //Bituminus work -> SMA -> Density After Compaction
  //Bituminus work -> BC -> Density After Compaction
  //Bituminus work -> DBM/RAP DBM -> Density After Compaction DBM
  const getTestSampleDensityAfterCompactionObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
        values: [
          // {
          //   description: '% of Bitumen by weight of Mix (a)',
          //   test1: 0,
          //   test2: 0,
          //   test3: 0,
          // },
          // {
          //   description: '% of aggregate (b= 100 - a)',
          //   test1: 0,
          //   test2: 0,
          //   test3: 0,
          // },
          {
            description: 'Height of Sample in mm (c)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of sample in Air in gm (d)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of sample in water in gm (e)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'SSD weight of Sample in gm (f)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          // {
          //   description: 'Volume of sample in cc (g= f-e)',
          //   test1: 0,
          //   test2: 0,
          //   test3: 0,
          // },
          // {
          //   description: 'Bulk density gm/cc (h = d/g)',
          //   test1: 0,
          //   test2: 0,
          //   test3: 0,
          // },
          // {
          //   description: 'Average of Bulk Density (Gmb= (H1+H2+H3)/3)',
          //   test1: 0,
          //   test2: 0,
          //   test3: 0,
          // },
        ],
      },
    };
  };
  //Bituminus work -> BC -> BC Stability And Void Analysis
  //Bituminus work -> DBM/RAP DBM -> Stability And Void Analysis DBM
  const getTestSampleBCStabilityAndVoidAnalysisObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
        values: [
          {
            description: '% of Bitumen by weight of Mix (a)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Height of Sample in mm (c)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of sample in Air in gm (d)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Weight of sample in water in gm (e)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'SSD weight of Sample in gm (f)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Load in KN for Marshall Stability (i)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Correction Factor (j)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            description: 'Flow Value in mm (L)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
        ],
      },
    };
  };
  //Bituminus work -> BC -> BC Mix Grade I
  const getTestSampleBCMixGradingGradeIObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: ['Sieve Size', 'Weight retained in gm'],
        values: [
          {
            sieveSize: '26.5 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '19 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '13.2 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '9.5 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '4.75 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '2.36 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '1.18 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '0.6 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '0.3 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '0.15 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '0.075 mm',
            weightRetained: 0.0,
          },
        ],
      },
    };
  };
  //Bituminus work -> BC -> BC Mix Grade II
  const getTestSampleBCMixGradingGradeIIObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: ['Sieve Size', 'Weight retained in gm'],
        values: [
          {
            sieveSize: '19 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '13.2 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '9.5 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '4.75 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '2.36 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '1.18 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '0.6 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '0.3 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '0.15 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '0.075 mm',
            weightRetained: 0.0,
          },
        ],
      },
    };
  };
  //Bituminus work -> DBM/RAP DBM -> DBM Mix Grading (Grade-I)
  const getTestSampleDBMMixGradingGradeIObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: ['Sieve Size', 'Weight retained in gm'],
        values: [
          {
            sieveSize: '45 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '37.5 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '26.5 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '19 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '13.2 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '4.75 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '2.36 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '0.3 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '0.075 mm',
            weightRetained: 0.0,
          },
        ],
      },
    };
  };
  //Bituminus work -> DBM/RAP DBM -> DBM Mix Grading (Grade-II)
  const getTestSampleDBMMixGradingGradeIIObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: ['Sieve Size', 'Weight retained in gm'],
        values: [
          {
            sieveSize: '45 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '37.5 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '26.5 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '19 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '13.2 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '4.75 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '2.36 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '0.3 mm',
            weightRetained: 0.0,
          },
          {
            sieveSize: '0.075 mm',
            weightRetained: 0.0,
          },
        ],
      },
    };
  };
  //Bituminus work ->Bitumen -> Softening Point
  const getTestSampleSofteningPointObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: [
          'Time in Minutes',
          'Ball No. 1 (Temp in °C)',
          'Ball No. 2 (Temp in °C)',
        ],
        values: [
          {
            timeInMin: '1',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '2',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '3',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '4',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '5',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '6',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '7',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '8',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '9',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '10',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '11',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '12',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '13',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '14',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
          {
            timeInMin: '15',
            ballNumber1Temp: 0.0,
            ballNumber2Temp: 0.0,
          },
        ],
      },
    };
  };
  //Bituminus work ->Bitumen -> Flash & Fire Points
  const getTestSampleFlashFirePointsObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: ['Test Property', 'Test 1', 'Test 2', 'Test 3'],
        values: [
          {
            testProperty: 'Flash Point (°C)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
          {
            testProperty: 'Fire Point (°C)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
        ],
      },
    };
  };
  //Bituminus work ->Bitumen -> Ductility Test
  const getTestSampleDuctilityTestObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: ['Test Property', 'Test 1', 'Test 2', 'Test 3'],
        values: [
          {
            testProperty: 'Ductility value (cm)',
            test1: 0,
            test2: 0,
            test3: 0,
          },
        ],
      },
    };
  };
  //Bituminus work ->Bitumen -> Bituminous Penetration Test
  //BITUMINOUS_PENETRATION_TEST;
  const getTestSampleBituminousPenetrationTestObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: ['Test No.', 'Initial Dial Reading', 'Final Dial Reading'],
        values: [
          {
            testNumber: '1',
            initialDialReading: 0.0,
            finalDialReading: 0.0,
          },
        ],
      },
    };
  };
  const getTestSampleConcreteObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: [
          'Cube No.',
          'Wt. of cube in gm',
          'Volume of Cube in Cum',
          'Test Area in mm2',
          'Failure Load (KN)',
          'Compressive Strength (N/mm2)',
        ],
        values: [
          {
            cubeNo: 1,
            wtCube: 0,
            volOfCube: 0,
            testArea: 0,
            failureLoad: 0,
            compressiveStrength: 0,
          },
          {
            cubeNo: 2,
            wtCube: 0,
            volOfCube: 0,
            testArea: 0,
            failureLoad: 0,
            compressiveStrength: 0,
          },
          {
            cubeNo: 3,
            wtCube: 0,
            volOfCube: 0,
            testArea: 0,
            failureLoad: 0,
            compressiveStrength: 0,
          },
        ],
      },
      avgStrength: {
        title: 'Avg. Strength (N/mm2)',
        value: 0,
      },
      remarks: {
        title: 'Remarks',
        value: '',
      },
    };
  };

  const getTestSampleCementCompressiveStrengthObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: [
          'Sl. No.',
          'Wt. of cube in gm',
          'Failure Load (KN)',
          'Compressive Strength (N/mm2)',
        ],
        values: [
          {
            slNo: 1,
            wtCube: 0,
            failureLoad: 0,
            compressiveStrength: 0,
          },
          {
            slNo: 2,
            wtCube: 0,
            failureLoad: 0,
            compressiveStrength: 0,
          },
          {
            slNo: 3,
            wtCube: 0,
            failureLoad: 0,
            compressiveStrength: 0,
          },
        ],
      },
      ageInDays: {
        title: 'Age in Days',
        value: '',
      },
      dateOfTesting: {
        title: 'Date of Testing',
        value: '',
      },
      avgStrength: {
        title: 'Avg. Strength (N/mm2)',
        value: 0,
      },
    };
  };

  const getTestSampleCementSoundnessObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum,
      },
      details: {
        titles: [
          'Sl. No.',
          'Before putting in boiling water (A) in mm',
          'After (3 hours) putting in boiling water(B)',
          'Soundness (B-A) in terms of le Chatelier’s (mm)',
        ],
        values: [
          {
            slNo: 1,
            beforePuttingInBoilingWater: 0,
            afterPuttingInBoilingWater: 0,
            soundnessChatelier: 0,
          },
          {
            slNo: 2,
            beforePuttingInBoilingWater: 0,
            afterPuttingInBoilingWater: 0,
            soundnessChatelier: 0,
          },
        ],
      },
    };
  };

  const getTestSampleCementInitialFinalSettingObject = (sampleNum: any) => {
    if (sampleNum === 1) {
      return {
        sampleNo: {
          title: 'Sample no',
          value: 'Fineness of Cement (IS:4031 PART - I)',
        },
        details: {
          titles: [
            'Trial No.',
            'IS Sieve (mm)',
            'Weight of Sample (W1) in gms',
            'Wt. of cement retained (W2) in gms',
          ],
          values: [
            {
              trainNo: 1,
              isSieve: '0.090',
              weightOfSample: 0,
              weightOfCementRetained: 0,
              finenessOfCement: 0,
            },
            {
              trainNo: 2,
              isSieve: '0.090',
              weightOfSample: 0,
              weightOfCementRetained: 0,
              finenessOfCement: 0,
            },
            {
              trainNo: 3,
              isSieve: '0.090',
              weightOfSample: 0,
              weightOfCementRetained: 0,
              finenessOfCement: 0,
            },
          ],
        },
      };
    } else if (sampleNum === 2) {
      return {
        sampleNo: {
          title: 'Sample no',
          value: 'Standard Consistency of Cement (IS 4031 Part - IV)',
        },
        details: {
          titles: [
            'Trial No.',
            'Wt. of Cement (gms) = A',
            'Wt. of water (gms) = B',
            'Penetration of the plunger from the bottom of Vicat mould (mm)',
            'Is the penetration between 5 to 7 mm (Yes/ No)',
          ],
          values: [
            {
              trainNo: 1,
              weightOfCement: 0,
              weightOfWater: 0,
              penetrationOfPlunger: 0,
              penetrationBetween5To7: 0,
              standardConsistency: 0,
            },
          ],
        },
      };
    } else if (sampleNum === 3) {
      return {
        sampleNo: {
          title: 'Sample no',
          value:
            'Initial Setting time and Final Setting time (IS 4031 Part - IV)',
        },
        details: {
          titles: [
            'Sl. No.',
            'Wt. of Cement (gms) (w)',
            'Water 0.85 % of Standard Consistency',
            'Time of adding water (T0)',
            'Time when the needle fails to penetrate test block by 5+-0.5 mm (T1)',
            'Time when needle makes an impression but the attachment fails to do so (T2)',
          ],
          values: [
            {
              trainNo: 1,
              weightOfCement: 0,
              waterStandardConsistency: 0,
              timeOfAddingWater: '',
              timeWhenNeedleFails: '',
              timeWhenNeedleMakes: '',
              initialSettingTime: '',
              finalSettingTime: '',
            },
          ],
        },
      };
    }
  };

  const getTestSampleCementFineAggregateObject = (
    sampleNum: any,
    taskType: string,
  ) => {
    if (taskType === TEST_TYPES.GRADATION) {
      return {
        weightOfSample: 0,
        sampleNo: {
          title: 'Sample no',
          value: sampleNum,
        },
        details: {
          titles: [
            'Sieve Size',
            'Weight retained in gm',
            'Cumulative weight retained in gm',
            'Cumulative retained in %',
            '% Passing',
          ],
          values: [
            {
              sieveSize: '10.0 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0,
            },
            {
              sieveSize: '4.75 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0,
            },
            {
              sieveSize: '2.36 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0,
            },
            {
              sieveSize: '1.18 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0,
            },
            {
              sieveSize: '0.600 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0,
            },
            {
              sieveSize: '0.300 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0,
            },
            {
              sieveSize: '0.150 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0,
            },
          ],
        },
      };
    } else if (taskType === TEST_TYPES.NATURAL_MOISTURE_CONTENT) {
      return {
        sampleNo: {
          title: 'Sample no',
          value: sampleNum,
        },
        details: {
          titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
          values: [
            {
              description: 'Weight of container + wet Soil in gm (W1)',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              description: 'Weight of container + Dry Soil in gm (W2)',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              description: 'Weight of container (W3) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Weight of Water (W4 = W1-W2) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Weight of Dry Soil (W5 = W2-W3) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Moisture Content = (W4/W5)x100 in %',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Avg. Moisture Content',
              avgMoistureContent: 0,
            },
          ],
        },
      };
    } else if (taskType === TEST_TYPES.SPECIFIC_GRAVITY_AND_WATER_ABSORPTION) {
      return {
        sampleNo: {
          title: 'Sample no',
          value: sampleNum,
        },
        details: {
          titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
          values: [
            {
              description: 'Temperature of Water in C',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              description: 'Pycnometer Bottle No.',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              description: 'Weight of SSD Sample in gm (W1) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              description:
                'Weight of Pycnometer Bottle + water + Sample (W2) in gm ',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              description: 'Weight of Pycnometer Bottle + water (W3) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              description: 'Weight of oven dry sample (W4) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Specific Gravity = W4/(W4-(W2-W3))',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Apparent Specific Gravity= W4/(W4-(W2-W3))',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Water Absorption= 100 x (W1-W4)/W4 in %',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Avg. Specific Gravity',
              avgSpecificGravity: 0,
            },
            {
              hide: true,
              description: 'Avg. Water Absorption in %',
              avgWaterAbsorption: 0,
            },
          ],
        },
      };
    }
  };

  const getTestSampleCementCoarseAggregateObject = (
    sampleNum: any,
    taskType: string,
  ) => {
    if (taskType === TEST_TYPES.GRADATION) {
      if (sampleNum === 1) {
        return {
          weightOfSample: 0,
          sampleNo: {
            title: 'Sample no',
            value: 'Sieve Analysis (for 40mm)',
          },
          details: {
            titles: [
              'Sieve Size',
              'Weight retained in gm',
              'Cumulative weight retained in gm',
              'Cumulative retained in %',
              '% Passing',
            ],
            values: [
              {
                sieveSize: '63.0 mm',
                weightRetainedInGm: 0,
                cumulativeWeightRetainedInGm: 0,
                cumulativeRetainedInPercent: 0,
                passignPercent: 0,
              },
              {
                sieveSize: '40.0 mm',
                weightRetainedInGm: 0,
                cumulativeWeightRetainedInGm: 0,
                cumulativeRetainedInPercent: 0,
                passignPercent: 0,
              },
              {
                sieveSize: '20.0 mm',
                weightRetainedInGm: 0,
                cumulativeWeightRetainedInGm: 0,
                cumulativeRetainedInPercent: 0,
                passignPercent: 0,
              },
              {
                sieveSize: '10.0 mm',
                weightRetainedInGm: 0,
                cumulativeWeightRetainedInGm: 0,
                cumulativeRetainedInPercent: 0,
                passignPercent: 0,
              },
            ],
          },
        };
      } else if (sampleNum === 2) {
        return {
          sampleNo: {
            title: 'Sample no',
            value: 'Sieve Analysis (for 20mm)',
          },
          details: {
            titles: [
              'Sieve Size',
              'Weight retained in gm',
              'Cumulative weight retained in gm',
              'Cumulative retained in %',
              '% Passing',
            ],
            values: [
              {
                sieveSize: '40.0 mm',
                weightRetainedInGm: 0,
                cumulativeWeightRetainedInGm: 0,
                cumulativeRetainedInPercent: 0,
                passignPercent: 0,
              },
              {
                sieveSize: '20.0 mm',
                weightRetainedInGm: 0,
                cumulativeWeightRetainedInGm: 0,
                cumulativeRetainedInPercent: 0,
                passignPercent: 0,
              },
              {
                sieveSize: '10.0 mm',
                weightRetainedInGm: 0,
                cumulativeWeightRetainedInGm: 0,
                cumulativeRetainedInPercent: 0,
                passignPercent: 0,
              },
              {
                sieveSize: '4.75 mm',
                weightRetainedInGm: 0,
                cumulativeWeightRetainedInGm: 0,
                cumulativeRetainedInPercent: 0,
                passignPercent: 0,
              },
            ],
          },
        };
      } else if (sampleNum === 3) {
        return {
          sampleNo: {
            title: 'Sample no',
            value: 'Sieve Analysis (for 10mm)',
          },
          details: {
            titles: [
              'Sieve Size',
              'Weight retained in gm',
              'Cumulative weight retained in gm',
              'Cumulative retained in %',
              '% Passing',
            ],
            values: [
              {
                sieveSize: '12.5 mm',
                weightRetainedInGm: 0,
                cumulativeWeightRetainedInGm: 0,
                cumulativeRetainedInPercent: 0,
                passignPercent: 0,
              },
              {
                sieveSize: '10.0 mm',
                weightRetainedInGm: 0,
                cumulativeWeightRetainedInGm: 0,
                cumulativeRetainedInPercent: 0,
                passignPercent: 0,
              },
              {
                sieveSize: '4.75 mm',
                weightRetainedInGm: 0,
                cumulativeWeightRetainedInGm: 0,
                cumulativeRetainedInPercent: 0,
                passignPercent: 0,
              },
              {
                sieveSize: '2.36 mm',
                weightRetainedInGm: 0,
                cumulativeWeightRetainedInGm: 0,
                cumulativeRetainedInPercent: 0,
                passignPercent: 0,
              },
            ],
          },
        };
      }
    } else if (taskType === TEST_TYPES.LOS_ANGELES_ABRATION) {
      return {
        sampleNo: {
          title: 'Sample no',
          value: sampleNum,
        },
        details: {
          titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
          values: [
            {
              description: 'Initial Weight (W1) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              description: 'Weight retained after test on 1.70mm (W2) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description:
                'Los Angeles Abrasion Value  in % = {(W1-W2)/W1}x100',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Average Los Angeles Abrasion Value',
              avgLosAngelesAbrasion: 0,
            },
          ],
        },
      };
    } else if (taskType === TEST_TYPES.SPECIFIC_GRAVITY_AND_WATER_ABSORPTION) {
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
                'Weight of Saturated aggregate and Basket in water (W1) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              description:
                'Weight of saturated Surface dry aggregate in air (W2) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              description: 'Weight of oven dried aggregate in air (W3) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Specific Gravity = W3/ (W3-W1)',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Apparent Specific Gravity = W3/(W3-W1)',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Water Absorption (%) = 100 x (W2-W3)/W3',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Avg. Specific Gravity',
              avgSpecificGravity: 0,
            },
            {
              hide: true,
              description: 'Avg. Water Absorption in %',
              avgWaterAbsorption: 0,
            },
          ],
        },
      };
    } else if (taskType === TEST_TYPES.NATURAL_MOISTURE_CONTENT) {
      return {
        sampleNo: {
          title: 'Sample no',
          value: sampleNum,
        },
        details: {
          titles: ['Description', 'Test 1', 'Test 2', 'Test 3'],
          values: [
            {
              description: 'Weight of container + wet Soil in gm (W1)',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              description: 'Weight of container + Dry Soil in gm (W2)',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              description: 'Weight of container (W3) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Weight of Water (W4 = W1-W2) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Weight of Dry Soil (W5 = W2-W3) in gm',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Moisture Content = (W4/W5)x100 in %',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Avg. Moisture Content',
              avgMoistureContent: 0,
            },
          ],
        },
      };
    } else if (taskType === TEST_TYPES.AGGREGATE_IMPACT_VALUE) {
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
            {
              hide: true,
              description: 'Loss in weight (W4 = W1-(W2+W3))',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Aggregate Impact Value (AIV = W2/W1 *100)',
              test1: 0,
              test2: 0,
              test3: 0,
            },
            {
              hide: true,
              description: 'Average AIV Value',
              avgAIVValue: 0,
            },
          ],
        },
      };
    } else if (taskType === TEST_TYPES.FI_EI) {
      return {
        weightOfSample: 0,
        sampleNo: {
          title: 'Sample no',
          value: 1,
        },
        details: {
          titles: [
            'Size fraction of aggregate passing on IS Sieve in mm',
            'Size fraction of aggregate retained on IS Sieves (mm)',
            'Total weight of aggregate retained in gm',
            'Weight passing on flakiness gauge in gm',
            'Weight retained on flakiness gauge in gm',
            'Weight retained on elongation gauge in mm',
          ],
          values: [
            {
              sizeFraction: '63.0',
              sizeFractionOfAggregateRetained: '50.0',
              totalWeightOfAggregateRetained: 0,
              weightPassingFlakinessGauge: 0,
              weightRetainedFlakinessGauge: 0,
              weightRetainedElongationGauge: 0,
            },
            {
              sizeFraction: '50.0',
              sizeFractionOfAggregateRetained: '40.0',
              totalWeightOfAggregateRetained: 0,
              weightPassingFlakinessGauge: 0,
              weightRetainedFlakinessGauge: 0,
              weightRetainedElongationGauge: 0,
            },
            {
              sizeFraction: '40.0',
              sizeFractionOfAggregateRetained: '31.5',
              totalWeightOfAggregateRetained: 0,
              weightPassingFlakinessGauge: 0,
              weightRetainedFlakinessGauge: 0,
              weightRetainedElongationGauge: 0,
            },
            {
              sizeFraction: '31.5',
              sizeFractionOfAggregateRetained: '25.0',
              totalWeightOfAggregateRetained: 0,
              weightPassingFlakinessGauge: 0,
              weightRetainedFlakinessGauge: 0,
              weightRetainedElongationGauge: 0,
            },
            {
              sizeFraction: '25.0',
              sizeFractionOfAggregateRetained: '20.0',
              totalWeightOfAggregateRetained: 0,
              weightPassingFlakinessGauge: 0,
              weightRetainedFlakinessGauge: 0,
              weightRetainedElongationGauge: 0,
            },
            {
              sizeFraction: '20.0',
              sizeFractionOfAggregateRetained: '16.0',
              totalWeightOfAggregateRetained: 0,
              weightPassingFlakinessGauge: 0,
              weightRetainedFlakinessGauge: 0,
              weightRetainedElongationGauge: 0,
            },
            {
              sizeFraction: '16.0',
              sizeFractionOfAggregateRetained: '12.5',
              totalWeightOfAggregateRetained: 0,
              weightPassingFlakinessGauge: 0,
              weightRetainedFlakinessGauge: 0,
              weightRetainedElongationGauge: 0,
            },
            {
              sizeFraction: '12.5',
              sizeFractionOfAggregateRetained: '10.0',
              totalWeightOfAggregateRetained: 0,
              weightPassingFlakinessGauge: 0,
              weightRetainedFlakinessGauge: 0,
              weightRetainedElongationGauge: 0,
            },
            {
              sizeFraction: '10.0',
              sizeFractionOfAggregateRetained: '6.3',
              totalWeightOfAggregateRetained: 0,
              weightPassingFlakinessGauge: 0,
              weightRetainedFlakinessGauge: 0,
              weightRetainedElongationGauge: 0,
            },
            {
              hide: true,
              sizeFraction: 'Total',
              sizeFractionOfAggregateRetained: '',
              totalWeightOfAggregateRetained: 0,
              weightPassingFlakinessGauge: 0,
              weightRetainedFlakinessGauge: 0,
              weightRetainedElongationGauge: 0,
            },
          ],
        },
      };
    }
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

  const getRFIDataByWorkAssignmentId = (task: any) => {
    // setSelectedTask(task);
    // dispatch(getRFIByWaId({
    //   projectId: loggedInUser.projectId,
    //   projectModuleId: projectModuleId,
    //   waId: task.workAssignmentId,
    // }));
  };

  const tasksListing = () => {
    return currentTestTypesData
      .filter((task: any) => {
        if (searchText && task.name) {
          return task.name.toLowerCase().includes(searchText.toLowerCase());
        } else {
          return true;
        }
      })
      .map((item: any, index) => (
        <View style={getStyle(item)}>
          <View style={styles.leftContainer}>
            <Text style={styles.HeadText}>{item.name}</Text>
            {/* <Text style={styles.MyWorkSubHead}>Sub Text</Text> */}
          </View>
          {item.rfiStatus === RFI_STATUS.GENERATED ? (
            <TouchableOpacity
              style={[styles.MyWorkCta, styles.StartBorder]}
              onPress={() => {
                getRFIDataByWorkAssignmentId(item);
              }}>
              <Image
                style={styles.WorkIcon}
                source={require('../../images/play-icon.png')}
              />
              <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>
                Start
              </Text>
            </TouchableOpacity>
          ) : null}

          {item.rfiStatus === RFI_STATUS.RE_GENERATED ? (
            <TouchableOpacity
              style={[styles.MyWorkCta, styles.StartBorder]}
              onPress={() => {
                getRFIDataByWorkAssignmentId(item);
              }}>
              <Image
                style={styles.WorkIcon}
                source={require('../../images/play-icon.png')}
              />
              <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>
                Re-start
              </Text>
            </TouchableOpacity>
          ) : null}

          {item.rfiStatus === RFI_STATUS.REJECTED ||
          item.rfiStatus === RFI_STATUS.CANCELLED ? (
            <TouchableOpacity
              style={[styles.MyWorkCta, styles.StartRejectBorder]}>
              {/* <Image style={styles.WorkIcon} source={require('../../images/play-icon.png')} /> */}
              <Text style={[styles.CtaStartText, styles.CtaRejectTextColor]}>
                {item.rfiStatus === RFI_STATUS.CANCELLED
                  ? 'Cancelled'
                  : 'Rejected'}
              </Text>
            </TouchableOpacity>
          ) : null}

          {item.rfiStatus === RFI_STATUS.IN_PROGRESS ? (
            <TouchableOpacity
              style={[styles.MyWorkCta, styles.StartInProgressBorder]}
              onPress={() => {
                getRFIDataByWorkAssignmentId(item);
              }}>
              <Image
                style={styles.WorkIcon}
                source={require('../../images/inprogress.png')}
              />
              <Text
                style={[styles.CtaStartText, styles.CtaInProgressTextColor]}>
                In Progress
              </Text>
            </TouchableOpacity>
          ) : null}

          {item.rfiStatus === RFI_STATUS.IN_REVIEW ? (
            <TouchableOpacity
              style={[styles.MyWorkCta, styles.StartReviewBorder]}>
              <Image
                style={styles.WorkIcon}
                source={require('../../images/review-icon.png')}
              />
              <Text style={[styles.CtaStartText, styles.CtaReviewTextColor]}>
                Under Review
              </Text>
            </TouchableOpacity>
          ) : null}

          {item.rfiStatus === RFI_STATUS.APPROVED ? (
            <TouchableOpacity
              style={[styles.MyWorkCta, styles.StartCompleteBorder]}>
              <Image
                style={styles.WorkIcon}
                source={require('../../images/complete-icon.png')}
              />
              <Text style={[styles.CtaStartText, styles.CtaCompleteTextColor]}>
                Completed
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ));
  };

  const CustomDropdownPicker = ({
    items,
    rowItem,
    fieldName,
    tempProp,
  }: {
    items: any;
    rowItem: any;
    fieldName: any;
    tempProp: boolean;
  }) => {
    const [value, setValue] = useState(rowItem[fieldName]);
    const updateValue = (value: any) => {
      setValue(value);
      {
        rowItem[fieldName + (tempProp ? '_TEMP' : '')] = value;
      }
    };
    return (
      // style={{ width: 110, height: 30, zIndex: 10 }}
      <DropdownPicker
        value={value}
        label=""
        items={items}
        onChange={(value: string) => updateValue(value)}
      />
    );
  };

  const CustomTimePicker = ({
    rowItem,
    fieldName,
  }: {
    rowItem: any;
    fieldName: any;
  }) => {
    const [value, setValue] = useState(rowItem[fieldName]);
    const updateValue = (value: any) => {
      setValue(value);
      {
        rowItem[fieldName] = value;
      }
    };
    return (
      <TimePicker
        value={value}
        label=""
        onChange={(time: string) => updateValue(time)}
      />
    );
  };

  const CustomTextInput = ({
    rowItem,
    fieldName,
    tempProp = false,
    styleName = {},
  }: {
    rowItem: any;
    fieldName: any;
    tempProp: boolean;
    styleName: any;
  }) => {
    const [value, setValue] = useState(rowItem[fieldName]);
    const updateValue = (text: any) => {
      {
        rowItem[fieldName + (tempProp ? '_TEMP' : '')] = text;
      }
    };

    /*const onBlur = () => {
      if (fieldName === 'testArea' || fieldName === 'failureLoad') {
        if (Number(rowItem['testArea']).toString() !== 'NaN' && Number(rowItem['failureLoad']).toString() !== 'NaN') {
          const testArea = Number(rowItem['testArea']);
          const failureLoad = Number(rowItem['failureLoad']);
          if (testArea && failureLoad) {
            rowItem['compressiveStrength'] = Number((failureLoad * 1000 / testArea).toFixed(2));
          } else {
            rowItem['compressiveStrength'] = 0;
          }
        } else {
          rowItem['compressiveStrength'] = 0;
        }
        const total = concreteSampleTestItems[0].details.values.map((item: any) => Number(item.compressiveStrength)).reduce((prev: any, next: any) => prev + next, 0) || 0;
        const avg = Number((total / 3).toFixed(2));
        concreteSampleTestItems[0].avgStrength.value = avg;

        // Remark
        if (avg) { // Sample discarded
          const cubeNo1 = (Number(concreteSampleTestItems[0].details.values[0].compressiveStrength) - avg) / avg;
          const cubeNo1Pass = (avg <= (cubeNo1 + 15) && avg >= (cubeNo1 - 15));

          const cubeNo2 = (Number(concreteSampleTestItems[0].details.values[1].compressiveStrength) - avg) / avg;
          const cubeNo2Pass = (avg <= (cubeNo2 + 15) && avg >= (cubeNo2 - 15));

          const cubeNo3 = (Number(concreteSampleTestItems[0].details.values[2].compressiveStrength) - avg) / avg;
          const cubeNo3Pass = (avg <= (cubeNo3 + 15) && avg >= (cubeNo3 - 15));
          
          concreteSampleTestItems[0].remarks.value = '';
          if (!cubeNo1Pass || !cubeNo2Pass || !cubeNo3Pass) {
            concreteSampleTestItems[0].remarks.value = 'Sample discarded';
          } else { // Recheck
            const gradeOfConcrete = Number(selectedTestSample.name.substring(selectedTestSample.name.indexOf('Grade-M') + 7, selectedTestSample.name.lastIndexOf('/')))
            const recheck = !((0.67 * gradeOfConcrete) > avg);
            if (recheck) {
              concreteSampleTestItems[0].remarks.value = 'Recheck';
            } else {
              concreteSampleTestItems[0].remarks.value = 'Pass';
            }
          }
        }

        const concreteSampleTestItemsTemp = [...concreteSampleTestItems];

        setConcreteSampleTestItems(concreteSampleTestItemsTemp);
        
      }
    }*/

    return (
      <Input
        style={styleName || styles.inputStyle3}
        placeholder=""
        label={''}
        marginBottom={false}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        underlineColorAndroid="#f000"
        blurOnSubmit={false}
        value={value}
        onChange={(value: string) => {
          setValue(value);
          updateValue(value);
        }}
        //onBlur={() => onBlur()}
      />
    );
  };

  const CustomCalendarPicker = ({
    rowItem,
    fieldName,
    tempProp = false,
  }: {
    rowItem: any;
    fieldName: any;
    tempProp: boolean;
  }) => {
    const [value, setValue] = useState(rowItem[fieldName]);
    const updateValue = (text: any) => {
      rowItem[fieldName + (tempProp ? '_TEMP' : '')] = text;
    };

    return (
      <CalendarPicker
        value={value}
        onChange={date => {
          setValue(date);
          updateValue(date);
        }}
      />
    );
  };

  const [concreteSampleTestItems, setConcreteSampleTestItems]: any[] = useState(
    [],
  );

  type FormSampleTest7thOr28thDayState = {
    dateOfTesting: string;
    sampleBy: string;
    testConductedBy: string;
    roomTemperature: number;
    humidity: number;
    typeOfConcreteSurface?: string;
    observations?: any[];
  };

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

  const handleInputChange = (
    name: keyof FormSampleTest7thOr28thDayState,
    value: string | number | [],
  ) => {
    setFormSampleTest7thOr28thDay({
      ...formSampleTest7thOr28thDay,
      [name]: value,
    });
  };

  const handleInputChangeFineAggregate = (
    item: any,
    name: any,
    value: string | number | [],
  ) => {
    item[name] = value;
    setFormSampleTest7thOr28thDay({...formSampleTest7thOr28thDay});
  };

  const testSampleForm = (materialType: any) => {
    if (
      !materialType ||
      materialType === TEST_MATERIALS_TYPES.CONCRETE ||
      materialType === TEST_MATERIALS_TYPES.CEMENT ||
      materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE ||
      materialType === TEST_MATERIALS_TYPES.COARSE_AGGREGATE
    ) {
      return (
        <View>
          <View
            style={{
              flexDirection: 'column',
              paddingBottom: 40,
              paddingTop: 10,
            }}>
            <View style={{flexDirection: 'column'}}>
              <CalendarPicker
                label="Date of Testing"
                value={formSampleTest7thOr28thDay.dateOfTesting}
                onChange={date => handleInputChange('dateOfTesting', date)}
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                value={formSampleTest7thOr28thDay.sampleBy}
                label="Sampled By"
                items={SAMPLE_BY_LIST}
                onChange={(value: string) =>
                  handleInputChange('sampleBy', value)
                }
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <DropdownPicker
                value={formSampleTest7thOr28thDay.testConductedBy}
                label="Test Conducted By"
                items={TEST_CONDUCTED_BY_LIST}
                onChange={(value: string) =>
                  handleInputChange('testConductedBy', value)
                }
              />
            </View>
            {currentTestMaterialData.materialType ===
              TEST_MATERIALS_TYPES.COARSE_AGGREGATE &&
              selectedTestSample.type === TEST_TYPES.LOS_ANGELES_ABRATION && (
                <View style={{flexDirection: 'column'}}>
                  <DropdownPicker
                    value={
                      '' + formSampleTest7thOr28thDay.typeOfConcreteSurface
                    }
                    label="Test Conducted By"
                    items={TYPE_OF_CONCRETE_SURFACE_LIST}
                    onChange={(value: string) =>
                      handleInputChange('typeOfConcreteSurface', value)
                    }
                  />
                </View>
              )}

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Room Temperature/ Atmospheric Temperature (in C)"
                value={'' + formSampleTest7thOr28thDay.roomTemperature}
                onChange={(value: string) =>
                  handleInputChange('roomTemperature', value)
                }
                isRequired={true}
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Input
                label="Humidity in %"
                value={'' + formSampleTest7thOr28thDay.humidity}
                onChange={(value: string) =>
                  handleInputChange('humidity', value)
                }
                isRequired={true}
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>Observations:</Text>
              <ScrollView style={styles.Width100} horizontal={true}>
                {currentTestMaterialData.materialType ===
                  TEST_MATERIALS_TYPES.CONCRETE && (
                  <View>
                    {concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column', width: 80}}>
                          <View style={index === 0 && {height: 40}}>
                            {index === 0 && (
                              <Text style={{fontWeight: '700'}}>
                                {item.sampleNo.title}
                              </Text>
                            )}
                          </View>
                          <View>
                            <Text style={{textAlign: 'center'}}>
                              {item.sampleNo.value}
                            </Text>
                          </View>
                        </View>

                        <View style={{flexDirection: 'column'}}>
                          {/* <View style={{flexDirection: 'row'}}>
                              {
                                item.details.titles.map((title: any) => (
                                  <View style={{flexDirection: 'column'}}>
                                  <Text>{title}</Text>
                                </View>
                                ))
                              }
                              </View> */}
                          {/* <View> */}
                          {item.details.values.map(
                            (value: any, indexDetails: number) => (
                              <View style={{flexDirection: 'row'}}>
                                {/* <View style={{flexDirection: 'column', width: 60}}>
                                      {
                                        index === 0 ? 
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>{item.details.titles[0]}</Text>
                                      </View> : null
                                      }
                                      <Text style={[styles.textStyle2, {textAlign: 'center'}]}>{value.cubeNo}</Text>
                                    </View> */}

                                <View
                                  style={{flexDirection: 'column', width: 120}}>
                                  {index === 0 && indexDetails === 0 ? (
                                    <View style={{height: 40}}>
                                      <Text style={{fontWeight: '700'}}>
                                        {item.details.titles[1]}
                                      </Text>
                                    </View>
                                  ) : null}
                                  <CustomTextInput
                                    rowItem={value}
                                    tempProp={false}
                                    styleName={styles.inputStyle3}
                                    fieldName={'wtCube'}></CustomTextInput>
                                </View>

                                <View
                                  style={{flexDirection: 'column', width: 120}}>
                                  {index === 0 && indexDetails === 0 ? (
                                    <View style={{height: 40}}>
                                      <Text style={{fontWeight: '700'}}>
                                        {item.details.titles[2]}
                                      </Text>
                                    </View>
                                  ) : null}
                                  <CustomTextInput
                                    rowItem={value}
                                    tempProp={false}
                                    styleName={styles.inputStyle3}
                                    fieldName={'volOfCube'}></CustomTextInput>
                                </View>

                                <View
                                  style={{flexDirection: 'column', width: 120}}>
                                  {index === 0 && indexDetails === 0 ? (
                                    <View style={{height: 40}}>
                                      <Text style={{fontWeight: '700'}}>
                                        {item.details.titles[3]}
                                      </Text>
                                    </View>
                                  ) : null}
                                  <CustomTextInput
                                    rowItem={value}
                                    tempProp={false}
                                    styleName={styles.inputStyle3}
                                    fieldName={'testArea'}></CustomTextInput>
                                </View>

                                <View
                                  style={{flexDirection: 'column', width: 120}}>
                                  {index === 0 && indexDetails === 0 ? (
                                    <View style={{height: 40}}>
                                      <Text style={{fontWeight: '700'}}>
                                        {item.details.titles[4]}
                                      </Text>
                                    </View>
                                  ) : null}
                                  <CustomTextInput
                                    rowItem={value}
                                    tempProp={false}
                                    styleName={styles.inputStyle3}
                                    fieldName={'failureLoad'}></CustomTextInput>
                                </View>

                                {/* <View style={{flexDirection: 'column', width: 120}}>
                                    {
                                        index === 0 ? 
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>{item.details.titles[5]}</Text>
                                      </View> : null
                                      }
                                      <Text style={[styles.textStyle, {textAlign: 'center'}]}>{value.compressiveStrength}</Text>
                                    </View> */}
                              </View>
                            ),
                          )}
                          {/* </View> */}
                        </View>
                        {/* <View style={{flexDirection: 'column', width: 120}}>
                              <View style={{height: 40}}>
                                <Text style={{fontWeight: '700'}}>{item.avgStrength.title}</Text>
                              </View>
                              <View style={styles.textStyle}>
                                <Text style={{textAlign: 'center'}}>{item.avgStrength.value}</Text>
                              </View>
                          </View>
                          <View style={{flexDirection: 'column', width: 120}}>
                            <View style={{height: 40}}>
                              <Text style={{fontWeight: '700'}}>{item.remarks.title}</Text>
                            </View>
                            <View style={styles.textStyle}>
                              <Text style={[{textAlign: 'center'}]}>{item.remarks.value}</Text>
                            </View>
                          </View> */}
                      </View>
                    ))}
                  </View>
                )}
                {currentTestMaterialData.materialType ===
                  TEST_MATERIALS_TYPES.CEMENT &&
                  // selectedTestSample.type === TEST_TYPES.COMPRESSIVE_STRENGTH ?
                  (selectedTestSample.type === TEST_TYPES.SOUNDNESS ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View style={{flexDirection: 'row'}}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 80,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[0]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.textStyle2,
                                        {textAlign: 'center'},
                                      ]}>
                                      {value.slNo}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 150,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle4}
                                      fieldName={
                                        'beforePuttingInBoilingWater'
                                      }></CustomTextInput>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 150,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[2]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle4}
                                      fieldName={
                                        'afterPuttingInBoilingWater'
                                      }></CustomTextInput>
                                  </View>
                                </View>
                              ),
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type ===
                    TEST_TYPES.FINENESS_CONSISTENCY_INITIAL_AND_FINAL_SETTING_TIME ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            <View style={{height: 40}}>
                              <Text style={{fontWeight: '700'}}>
                                {item.sampleNo.value}
                              </Text>
                            </View>
                            {index === 0
                              ? item.details.values.map(
                                  (value: any, indexDetails: number) => (
                                    <View style={{flexDirection: 'row'}}>
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 80,
                                        }}>
                                        {indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[0]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <Text
                                          style={[
                                            styles.textStyle2,
                                            {textAlign: 'center'},
                                          ]}>
                                          {value.trainNo}
                                        </Text>
                                      </View>

                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 80,
                                        }}>
                                        {indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[1]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <Text
                                          style={[
                                            styles.textStyle2,
                                            {textAlign: 'center'},
                                          ]}>
                                          {value.isSieve}
                                        </Text>
                                      </View>

                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 150,
                                        }}>
                                        {indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[2]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle4}
                                          fieldName={
                                            'weightOfSample'
                                          }></CustomTextInput>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 150,
                                        }}>
                                        {indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[3]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle4}
                                          fieldName={
                                            'weightOfCementRetained'
                                          }></CustomTextInput>
                                      </View>
                                    </View>
                                  ),
                                )
                              : index === 1
                              ? item.details.values.map(
                                  (value: any, indexDetails: number) => (
                                    <View style={{flexDirection: 'row'}}>
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 80,
                                        }}>
                                        {indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[0]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <Text
                                          style={[
                                            styles.textStyle2,
                                            {textAlign: 'center'},
                                          ]}>
                                          {value.trainNo}
                                        </Text>
                                      </View>

                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 150,
                                        }}>
                                        {indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[1]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle4}
                                          fieldName={
                                            'weightOfCement'
                                          }></CustomTextInput>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 150,
                                        }}>
                                        {indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[2]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle4}
                                          fieldName={
                                            'weightOfWater'
                                          }></CustomTextInput>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 150,
                                        }}>
                                        {indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[3]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle4}
                                          fieldName={
                                            'penetrationOfPlunger'
                                          }></CustomTextInput>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 150,
                                        }}>
                                        {indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[4]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomDropdownPicker
                                          rowItem={value}
                                          tempProp={false}
                                          items={YES_NO_LIST}
                                          fieldName={
                                            'penetrationBetween5To7'
                                          }></CustomDropdownPicker>
                                      </View>
                                    </View>
                                  ),
                                )
                              : // 3
                                item.details.values.map(
                                  (value: any, indexDetails: number) => (
                                    <View style={{flexDirection: 'row'}}>
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 80,
                                        }}>
                                        {indexDetails === 0 && (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[0]}
                                            </Text>
                                          </View>
                                        )}
                                        <Text
                                          style={[
                                            styles.textStyle2,
                                            {textAlign: 'center'},
                                          ]}>
                                          {value.trainNo}
                                        </Text>
                                      </View>

                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 150,
                                        }}>
                                        {indexDetails === 0 && (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[1]}
                                            </Text>
                                          </View>
                                        )}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle4}
                                          fieldName={
                                            'weightOfCement'
                                          }></CustomTextInput>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 150,
                                        }}>
                                        {indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[3]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTimePicker
                                          rowItem={value}
                                          fieldName={
                                            'timeOfAddingWater'
                                          }></CustomTimePicker>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 150,
                                        }}>
                                        {indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[4]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTimePicker
                                          rowItem={value}
                                          fieldName={
                                            'timeWhenNeedleFails'
                                          }></CustomTimePicker>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 150,
                                        }}>
                                        {indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[5]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTimePicker
                                          rowItem={value}
                                          fieldName={
                                            'timeWhenNeedleMakes'
                                          }></CustomTimePicker>
                                      </View>
                                    </View>
                                  ),
                                )}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    // ===
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          {/* <View style={{ flexDirection: 'column', width: 80 }}>
                            <View style={index === 0 && { height: 40 }}>
                              {
                                index === 0 && <Text style={{ fontWeight: '700' }}>{item.sampleNo.title}</Text>
                              }
                            </View>
                            <View>
                              <Text style={{ textAlign: 'center' }}>{item.sampleNo.value}</Text>
                            </View>
                          </View> */}

                          <View style={{flexDirection: 'column'}}>
                            {/* <View style={{flexDirection: 'row'}}>
                                {
                                  item.details.titles.map((title: any) => (
                                    <View style={{flexDirection: 'column'}}>
                                    <Text>{title}</Text>
                                  </View>
                                  ))
                                }
                                </View> */}
                            {/* <View> */}
                            {item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View style={{flexDirection: 'row'}}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 60,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[0]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.textStyle2,
                                        {textAlign: 'center'},
                                      ]}>
                                      {value.slNo}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      fieldName={'wtCube'}></CustomTextInput>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 120,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[4]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle3}
                                      fieldName={
                                        'failureLoad'
                                      }></CustomTextInput>
                                  </View>

                                  {/* <View style={{flexDirection: 'column', width: 120}}>
                                      {
                                          index === 0 ? 
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>{item.details.titles[5]}</Text>
                                        </View> : null
                                        }
                                        <Text style={[styles.textStyle, {textAlign: 'center'}]}>{value.compressiveStrength}</Text>
                                      </View> */}
                                </View>
                              ),
                            )}
                            {/* </View> */}
                          </View>
                          {/* <View style={{flexDirection: 'column', width: 120}}>
                                <View style={{height: 40}}>
                                  <Text style={{fontWeight: '700'}}>{item.avgStrength.title}</Text>
                                </View>
                                <View style={styles.textStyle}>
                                  <Text style={{textAlign: 'center'}}>{item.avgStrength.value}</Text>
                                </View>
                            </View>*/}
                        </View>
                      ))}
                    </View>
                  ))}
                {currentTestMaterialData.materialType ===
                  TEST_MATERIALS_TYPES.FINE_AGGREGATE &&
                  (selectedTestSample.type === TEST_TYPES.GRADATION ? (
                    <View>
                      <View style={{flexDirection: 'column'}}>
                        <Input
                          label="Total weight of Sample in gm (T)"
                          value={concreteSampleTestItems[0].weightOfSample}
                          onChange={(value: any) =>
                            handleInputChangeFineAggregate(
                              concreteSampleTestItems[0],
                              'weightOfSample',
                              value,
                            )
                          }
                          isRequired={true}
                        />
                      </View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View style={{flexDirection: 'row'}}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 80,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[0]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.textStyle2,
                                        {textAlign: 'center'},
                                      ]}>
                                      {value.sieveSize}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 150,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle4}
                                      fieldName={
                                        'weightRetainedInGm'
                                      }></CustomTextInput>
                                  </View>
                                </View>
                              ),
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type ===
                    TEST_TYPES.NATURAL_MOISTURE_CONTENT ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values
                                .filter((value: any) => !value.hide)
                                .map((value: any, indexDetails: number) => (
                                  <View style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.description}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test1'}></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test2'}></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[3]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test3'}></CustomTextInput>
                                    </View>
                                  </View>
                                ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type ===
                    TEST_TYPES.SPECIFIC_GRAVITY_AND_WATER_ABSORPTION ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values
                                .filter((value: any) => !value.hide)
                                .map((value: any, indexDetails: number) => (
                                  <View style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.description}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test1'}></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test2'}></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[3]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test3'}></CustomTextInput>
                                    </View>
                                  </View>
                                ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : null)}

                {currentTestMaterialData.materialType ===
                  TEST_MATERIALS_TYPES.COARSE_AGGREGATE &&
                  (selectedTestSample.type === TEST_TYPES.GRADATION ? (
                    <View>
                      <View style={{flexDirection: 'column'}}>
                        <Input
                          label="Total weight of Sample in gm (T)"
                          value={concreteSampleTestItems[0].weightOfSample}
                          onChange={(value: any) =>
                            handleInputChangeFineAggregate(
                              concreteSampleTestItems[0],
                              'weightOfSample',
                              value,
                            )
                          }
                          isRequired={true}
                        />
                      </View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            <View style={{height: 40}}>
                              <Text style={{fontWeight: '700'}}>
                                {item.sampleNo.value}
                              </Text>
                            </View>
                            {item.details.values.map(
                              (value: any, indexDetails: number) => (
                                <View style={{flexDirection: 'row'}}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 80,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[0]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.textStyle2,
                                        {textAlign: 'center'},
                                      ]}>
                                      {value.sieveSize}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: 150,
                                    }}>
                                    {index === 0 && indexDetails === 0 ? (
                                      <View style={{height: 40}}>
                                        <Text style={{fontWeight: '700'}}>
                                          {item.details.titles[1]}
                                        </Text>
                                      </View>
                                    ) : null}
                                    <CustomTextInput
                                      rowItem={value}
                                      tempProp={false}
                                      styleName={styles.inputStyle4}
                                      fieldName={
                                        'weightRetainedInGm'
                                      }></CustomTextInput>
                                  </View>
                                </View>
                              ),
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type ===
                    TEST_TYPES.LOS_ANGELES_ABRATION ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values
                                .filter((value: any) => !value.hide)
                                .map((value: any, indexDetails: number) => (
                                  <View style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.description}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test1'}></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test2'}></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[3]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test3'}></CustomTextInput>
                                    </View>
                                  </View>
                                ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type ===
                    TEST_TYPES.SPECIFIC_GRAVITY_AND_WATER_ABSORPTION ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values
                                .filter((value: any) => !value.hide)
                                .map((value: any, indexDetails: number) => (
                                  <View style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.description}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test1'}></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test2'}></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[3]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test3'}></CustomTextInput>
                                    </View>
                                  </View>
                                ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type ===
                    TEST_TYPES.NATURAL_MOISTURE_CONTENT ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values
                                .filter((value: any) => !value.hide)
                                .map((value: any, indexDetails: number) => (
                                  <View style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.description}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test1'}></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test2'}></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[3]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test3'}></CustomTextInput>
                                    </View>
                                  </View>
                                ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type ===
                    TEST_TYPES.AGGREGATE_IMPACT_VALUE ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values
                                .filter((value: any) => !value.hide)
                                .map((value: any, indexDetails: number) => (
                                  <View style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.description}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test1'}></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test2'}></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[3]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test3'}></CustomTextInput>
                                    </View>
                                  </View>
                                ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type === TEST_TYPES.FI_EI ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values
                                .filter((value: any) => !value.hide)
                                .map((value: any, indexDetails: number) => (
                                  <View style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.sizeFraction}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.sizeFractionOfAggregateRetained}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={
                                          'totalWeightOfAggregateRetained'
                                        }></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[3]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={
                                          'weightPassingFlakinessGauge'
                                        }></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[4]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={
                                          'weightRetainedFlakinessGauge'
                                        }></CustomTextInput>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[5]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={
                                          'weightRetainedElongationGauge'
                                        }></CustomTextInput>
                                    </View>
                                  </View>
                                ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type ===
                    TEST_TYPES.BITUMINOUS_PENETRATION_TEST ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}} key={index}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values.map(
                                (value: any, indexDetails: number) => (
                                  <View
                                    style={{flexDirection: 'row'}}
                                    key={indexDetails}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.testNumber}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'initialDialReading'}
                                      />
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'finalDialReading'}
                                      />
                                    </View>
                                  </View>
                                ),
                              )}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type === TEST_TYPES.DUCTILITY_TEST ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values
                                .filter((value: any) => !value.hide)
                                .map((value: any, indexDetails: number) => (
                                  <View style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 150,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.testProperty}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test1'}
                                      />
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test2'}
                                      />
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[3]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test3'}
                                      />
                                    </View>
                                  </View>
                                ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type ===
                    TEST_TYPES.FLASH_FIRE_POINTS ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}} key={index}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values
                                .filter((value: any) => !value.hide)
                                .map((value: any, indexDetails: number) => (
                                  <View
                                    style={{flexDirection: 'row'}}
                                    key={indexDetails}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.testProperty}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test1'}></CustomTextInput>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test2'}></CustomTextInput>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[3]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test3'}></CustomTextInput>
                                    </View>
                                  </View>
                                ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type === TEST_TYPES.SOFTENING_POINT ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values
                                .filter((value: any) => !value.hide)
                                .map((value: any, indexDetails: number) => (
                                  <View style={{flexDirection: 'row'}}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.timeInMin}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={
                                          'ballNumber1Temp'
                                        }></CustomTextInput>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[2]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={
                                          'ballNumber2Temp'
                                        }></CustomTextInput>
                                    </View>
                                  </View>
                                ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type ===
                    TEST_TYPES.DBM_MIX_GRADING_2 ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}} key={index}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values.map(
                                (value: any, indexDetails: number) => (
                                  <View
                                    style={{flexDirection: 'row'}}
                                    key={indexDetails}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 80,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.sieveSize}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={
                                          'weightRetained'
                                        }></CustomTextInput>
                                    </View>
                                  </View>
                                ),
                              )}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type ===
                    TEST_TYPES.DBM_MIX_GRADING_1 ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View key={index} style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values.map(
                                (value: any, indexDetails: number) => (
                                  <View
                                    key={indexDetails}
                                    style={{
                                      flexDirection: 'row',
                                      marginVertical: 8,
                                    }}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                        alignItems: 'center',
                                      }}>
                                      {index === 0 && indexDetails === 0 && (
                                        <Text
                                          style={{
                                            fontWeight: '700',
                                            marginBottom: 8,
                                          }}>
                                          {item.details.titles[0]}
                                        </Text>
                                      )}
                                      <Text style={styles.textStyle2}>
                                        {value.sieveSize}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 140,
                                        alignItems: 'center',
                                      }}>
                                      {index === 0 && indexDetails === 0 && (
                                        <Text
                                          style={{
                                            fontWeight: '700',
                                            marginBottom: 8,
                                          }}>
                                          {item.details.titles[1]}
                                        </Text>
                                      )}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'weightRetained'}
                                      />
                                    </View>
                                  </View>
                                ),
                              )}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type === TEST_TYPES.BC_MIX_GRADE_2 ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}} key={index}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values
                                .filter((value: any) => !value.hide)
                                .map((value: any, indexDetails: number) => (
                                  <View
                                    style={{flexDirection: 'row'}}
                                    key={`${index}-${indexDetails}`}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.sieveSize}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 120,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={
                                          'weightRetained'
                                        }></CustomTextInput>
                                    </View>
                                  </View>
                                ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type === TEST_TYPES.BC_MIX_GRADE_1 ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View
                          key={index}
                          style={{flexDirection: 'row', marginBottom: 10}}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values.map(
                                (value: any, indexDetails: number) => (
                                  <View
                                    key={indexDetails}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginBottom: 5,
                                    }}>
                                    {/* Sieve Size Column */}
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text
                                            style={{
                                              fontWeight: '700',
                                              textAlign: 'center',
                                            }}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {
                                            textAlign: 'center',
                                            marginVertical: 5,
                                          },
                                        ]}>
                                        {value.sieveSize}
                                      </Text>
                                    </View>

                                    {/* Weight Retained Column */}
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 100,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text
                                            style={{
                                              fontWeight: '700',
                                              textAlign: 'center',
                                            }}>
                                            {item.details.titles[1]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <CustomTextInput
                                        rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'weightRetained'}
                                      />
                                    </View>
                                  </View>
                                ),
                              )}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type ===
                    TEST_TYPES.DENSITY_AFTER_COMPACTION ? (
                    <View>
                      {concreteSampleTestItems.map((item: any, index: any) => (
                        <View style={{flexDirection: 'row'}} key={index}>
                          <View style={{flexDirection: 'column'}}>
                            {item.details &&
                              item.details.values
                                .filter((value: any) => !value.hide)
                                .map((value: any, indexDetails: number) => (
                                  <View
                                    style={{flexDirection: 'row'}}
                                    key={indexDetails}>
                                    <View
                                      style={{
                                        flexDirection: 'column',
                                        width: 180,
                                      }}>
                                      {index === 0 && indexDetails === 0 ? (
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>
                                            {item.details.titles[0]}
                                          </Text>
                                        </View>
                                      ) : null}
                                      <Text
                                        style={[
                                          styles.textStyle2,
                                          {textAlign: 'center'},
                                        ]}>
                                        {value.description}
                                      </Text>
                                    </View>

                                    {['test1', 'test2', 'test3'].map(
                                      (fieldName, testIndex) => (
                                        <View
                                          key={testIndex}
                                          style={{
                                            flexDirection: 'column',
                                            width: 120,
                                          }}>
                                          {index === 0 && indexDetails === 0 ? (
                                            <View style={{height: 40}}>
                                              <Text style={{fontWeight: '700'}}>
                                                {
                                                  item.details.titles[
                                                    testIndex + 1
                                                  ]
                                                }
                                              </Text>
                                            </View>
                                          ) : null}
                                          <CustomTextInput
                                            rowItem={value}
                                            tempProp={false}
                                            styleName={styles.inputStyle3}
                                            fieldName={
                                              fieldName
                                            }></CustomTextInput>
                                        </View>
                                      ),
                                    )}
                                  </View>
                                ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : selectedTestSample.type === TEST_TYPES.BINDER_CONTENT ? (
                    <View>
                      {concreteSampleTestItems.map(
                        (item: any, index: number) => (
                          <View style={{flexDirection: 'row'}} key={index}>
                            <View style={{flexDirection: 'column'}}>
                              {item.details &&
                                item.details.values.map(
                                  (value: any, indexDetails: number) => (
                                    <View
                                      style={{flexDirection: 'row'}}
                                      key={indexDetails}>
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 200,
                                        }}>
                                        {index === 0 && indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[0]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <Text
                                          style={[
                                            styles.textStyle2,
                                            {textAlign: 'center'},
                                          ]}>
                                          {value.description}
                                        </Text>
                                      </View>

                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 120,
                                        }}>
                                        {index === 0 && indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[1]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle3}
                                          fieldName={'test1'}></CustomTextInput>
                                      </View>

                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 120,
                                        }}>
                                        {index === 0 && indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[2]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle3}
                                          fieldName={'test2'}></CustomTextInput>
                                      </View>

                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          width: 120,
                                        }}>
                                        {index === 0 && indexDetails === 0 ? (
                                          <View style={{height: 40}}>
                                            <Text style={{fontWeight: '700'}}>
                                              {item.details.titles[3]}
                                            </Text>
                                          </View>
                                        ) : null}
                                        <CustomTextInput
                                          rowItem={value}
                                          tempProp={false}
                                          styleName={styles.inputStyle3}
                                          fieldName={'test3'}></CustomTextInput>
                                      </View>
                                    </View>
                                  ),
                                )}
                            </View>
                          </View>
                        ),
                      )}
                    </View>
                  ) : selectedTestSample.type === TEST_TYPES.AIV ? (
                    <View>
                      {concreteSampleTestItems.map(
                        (item: any, index: number) => (
                          <View
                            key={index}
                            style={{flexDirection: 'row', marginBottom: 10}}>
                            <View style={{flexDirection: 'column', flex: 1}}>
                              {item.details &&
                                item.details.values.map(
                                  (value: any, indexDetails: number) => (
                                    <View
                                      key={indexDetails}
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 5,
                                      }}>
                                      {/* Description */}
                                      <View
                                        style={{flex: 1, paddingHorizontal: 5}}>
                                        {index === 0 && indexDetails === 0 ? (
                                          <Text
                                            style={{
                                              fontWeight: 'bold',
                                              marginBottom: 5,
                                            }}>
                                            {item.details.titles[0]}
                                          </Text>
                                        ) : null}
                                        <Text style={styles.textStyle}>
                                          {value.description}
                                        </Text>
                                      </View>

                                      {/* Test 1 */}
                                      <View
                                        style={{
                                          flex: 0.8,
                                          paddingHorizontal: 5,
                                        }}>
                                        {index === 0 && indexDetails === 0 ? (
                                          <Text
                                            style={{
                                              fontWeight: 'bold',
                                              marginBottom: 5,
                                            }}>
                                            {item.details.titles[1]}
                                          </Text>
                                        ) : null}
                                        <CustomTextInput
                                          tempProp={false}
                                          rowItem={value}
                                          fieldName="test1"
                                          styleName={styles.inputStyle}
                                        />
                                      </View>

                                      {/* Test 2 */}
                                      <View
                                        style={{
                                          flex: 0.8,
                                          paddingHorizontal: 5,
                                        }}>
                                        {index === 0 && indexDetails === 0 ? (
                                          <Text
                                            style={{
                                              fontWeight: 'bold',
                                              marginBottom: 5,
                                            }}>
                                            {item.details.titles[2]}
                                          </Text>
                                        ) : null}
                                        <CustomTextInput
                                          tempProp={false}
                                          rowItem={value}
                                          fieldName="test2"
                                          styleName={styles.inputStyle}
                                        />
                                      </View>

                                      {/* Test 3 */}
                                      <View
                                        style={{
                                          flex: 0.8,
                                          paddingHorizontal: 5,
                                        }}>
                                        {index === 0 && indexDetails === 0 ? (
                                          <Text
                                            style={{
                                              fontWeight: 'bold',
                                              marginBottom: 5,
                                            }}>
                                            {item.details.titles[3]}
                                          </Text>
                                        ) : null}
                                        <CustomTextInput
                                          tempProp={false}
                                          rowItem={value}
                                          fieldName="test3"
                                          styleName={styles.inputStyle}
                                        />
                                      </View>
                                    </View>
                                  ),
                                )}
                            </View>
                          </View>
                        ),
                      )}
                    </View>
                  ) : null)}
              </ScrollView>
            </View>
          </View>
        </View>
      );
    }
  };
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
                      index === 0 && (setCurrentLevel(1), setBreadcrumbData([]))
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
      ) : (
        currentLevel !== 0 && (
          <View style={styles.BackToQualityworkContainer}>
            <Text
              style={styles.BreadcrumbPrevTextUnderline}
              onPress={() => (setCurrentLevel(0), setBreadcrumbData([]))}>
              Back to quality work
            </Text>
          </View>
        )
      )}
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
              <TouchableOpacity
              style={[
                styles.MyWorkCard,
                { backgroundColor: colors[index % colors.length] }
              ]}
                onPress={() => onMyTestClick(testClassificationItem)}>
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
                  {imageMap.length && <Image source={imageMap[index % imageMap.length]} style={commonStyles.image} />}
                </View>
                <View style={commonStyles.rightStyle}>
                  <Image style={commonStyles.CloseIcon} source={require('./../../images/right-arrow.png')} />
                </View>
              </TouchableOpacity>
            ))
          : currentLevel === 1
          ? myTestsData.map(
              (testClassificationItem: any, testClassificationIndex: number) =>
                testClassificationItem.assignmentLevel === 1 ? (
                  <TouchableOpacity
                  style={[
                    styles.MyWorkCard,
                    { backgroundColor: colors[testClassificationIndex % colors.length] }
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
                      {imageMap.length && <Image source={imageMap[testClassificationIndex % imageMap.length]} style={commonStyles.image} />}
                    </View>
                    <View style={commonStyles.rightStyle}>
                      <Image style={commonStyles.CloseIcon} source={require('./../../images/right-arrow.png')} />
                    </View>
                  </TouchableOpacity>
                ) : (
                  testClassificationItem.testWorkCategoriesData?.map(
                    (workCateItem: any, workCateIndex: any) =>
                      workCateItem.assignmentLevel === 2 ? (
                        <TouchableOpacity
                        style={[
                          styles.MyWorkCard,
                          { backgroundColor: colors[workCateIndex % colors.length] }
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
                              <Text style={styles.SubHeadingText}>Assigned:</Text>
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
                            {imageMap.length && <Image source={imageMap[workCateIndex % imageMap.length]} style={commonStyles.image} />}
                          </View>
                          <View style={commonStyles.rightStyle}>
                            <Image style={commonStyles.CloseIcon} source={require('./../../images/right-arrow.png')} />
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
                                { backgroundColor: colors[testMateIndex % colors.length] }
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
                                  {imageMap.length && <Image source={imageMap[testMateIndex % imageMap.length]} style={commonStyles.image} />}
                                </View>
                                <View style={commonStyles.rightStyle}>
                                  <Image style={commonStyles.CloseIcon} source={require('./../../images/right-arrow.png')} />
                                </View>
                              </TouchableOpacity>
                            ) : (
                              testMateItem.testTypesData?.map(
                                (testTypeItem: any, testTypeIndex: number) =>
                                  testTypeItem.assignmentLevel === 4 && (
                                    <TouchableOpacity
                                    style={[
                                      styles.MyWorkCard,
                                      { backgroundColor: colors[testTypeIndex % colors.length] }
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
                                        {imageMap.length && <Image source={imageMap[testTypeIndex % imageMap.length]} style={commonStyles.image} />}
                                      </View>
                                      <View style={commonStyles.rightStyle}>
                                        <Image style={commonStyles.CloseIcon} source={require('./../../images/right-arrow.png')} />
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
            : tasksListing()
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
            : tasksListing()
          : null}
        {currentLevel === 4 ? tasksListing() : null}
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
                selectedTestSample?.type ===
                  TEST_TYPES.COMPRESSIVE_STRENGTH)) &&
            tasksListing()}
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
                .map((item: any) => (
                  (currentTestMaterialData.materialType ===
                    TEST_MATERIALS_TYPES.SMA) ?
                    <TouchableOpacity
                        style={getStyle(item)}
                        onPress={() => onClickNested(6, item)}>
                        <View style={styles.leftContainer}>
                          <Text style={styles.HeadText}>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                    : <View>
                    <View
                      style={
                        item.sampleStatus != TEST_SAMPLE_STATUS.PREPARED && {
                          borderColor: '#000',
                          borderWidth: 1,
                          borderRadius: 10,
                          marginBottom: 10,
                        }
                      }>
                      <TouchableOpacity
                        style={getStyle(item)}
                        disabled={
                          item.sampleStatus != TEST_SAMPLE_STATUS.PREPARED ||
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
                              fieldName={'rfiDateTime'}></CustomCalendarPicker>
                          </View>
                          <View style={{height: 45, width: 100}}>
                            <TouchableOpacity
                              style={[styles.SubmitSample, styles.StartBorder]}
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
                ))}
            </ScrollView>
          ) : (
            <Text>Sample not found.</Text>
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
                      {testSampleForm(selectedTestSample?.materialType)}
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
                    onPress={() => onSubmitTestSample(RFI_STATUS.APPROVED)}>
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
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
    marginHorizontal: 10,
    minHeight: 100,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
    flexDirection: 'row',
    overflow: 'hidden'
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  TaskDetails: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingLeft: 65,
    width: '90%'
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
    backgroundColor: '#1C58C0',
    borderRadius: 30,
    color: '#fff',
    paddingHorizontal: 30,
    paddingTop: 12,
    paddingBottom: 12,
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
});

export default MyQualityWork;
