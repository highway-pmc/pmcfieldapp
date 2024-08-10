import { View, Text, NativeEventEmitter, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Dimensions, Alert, Modal, StatusBar, SafeAreaView } from 'react-native'
import React, { Fragment, useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems, PROJECT_TYPE, RFI_STATUS, SAMPLE_BY_LIST, TEST_CONDUCTED_BY_LIST, TEST_MATERIALS_TYPES, TEST_SAMPLE_CONCRETE_CATEGORY, TEST_SAMPLE_STATUS, TEST_SAMPLE_STATUS_LIST, TEST_TYPES, } from "../../constants/constants"
import { useDispatch, useSelector } from 'react-redux';
import { clearMyWorksEvent, generateTestSampleReport, getMyTests, updateTestSample, } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import { getDbDateFromDDMMYYYY, isTestInventoryClassification } from '../../utils/Utils';
import CalendarPicker from '../../components/UI/CalenderPicker';
import Input from '../../components/UI/Input';
import DropdownPicker from '../../components/UI/DropdownPicker';

const MyQualityWork = ({ route, navigation }: { route: any, navigation: any }) => {
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const workType = PROJECT_TYPE.QUALITY_WORK;

  const { myTests, testSampleUpdated, generatedTestSampleReport, loading, error } = useSelector((state: any) => state.MyWorks);
  const [myTestsData, setMyTestsData] = useState([]);
  const [currentTestWorkCategoryData, setCurrentTestWorkCategoryData] = useState([]);
  const [currentTestMaterialsData, setCurrentTestMaterialsData] = useState([]);
  const [currentTestMaterialData, setCurrentTestMaterialData]: any = useState({});
  const [currentTestTypesData, setCurrentTestTypesData] = useState([]);
  const [currentSubTestTypesData, setCurrentSubTestTypesData] = useState([]);
  const [currentSubTestTypeRFIsData, setCurrentSubTestTypeRFIsData] = useState([]);
  const [testClassificationId, setTestClassificationId] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedTestSample, setSelectedTestSample]: any = useState(null);

  const [breadcrumbData, setBreadcrumbData] = useState([{
    name: '',
    testClassifIndex: 0,
    workCateIndex: 0,
    testMateIndex: 0,
    testTypeIndex: 0,
    level: 0,
    assignmentLevel: 0,
    active: false
  }]);

  const dispatch = useDispatch()
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.myQualityWorks);
      setCurrentLevel(1);
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
    dispatch(getMyTests({
      projectId: loggedInUser.projectId,
      workType: workType
    }));
  }

  useEffect(() => {
    if (myTests) {
      setMyTestsData(myTests);
    }
    if (testSampleUpdated) {
      const sampleDataTemp: any = [...currentSubTestTypeRFIsData]
      const updatedSampleIndex = sampleDataTemp.findIndex((x: any) => x._id === testSampleUpdated._id);
      if (updatedSampleIndex != -1) {
        sampleDataTemp[updatedSampleIndex] = testSampleUpdated;
      }
      setCurrentSubTestTypeRFIsData([]);
      setCurrentSubTestTypeRFIsData(sampleDataTemp);
      Alert.alert('Info', 'Sample updated')
      dispatch(clearMyWorksEvent());
    }
  }, [myTests, testSampleUpdated, error]);

  // unmount
  useEffect(() => () => {
    dispatch(clearMyWorksEvent());
    setCurrentLevel(1);
    setMyTestsData([]);
    setCurrentTestWorkCategoryData([]);
    setCurrentTestMaterialsData([]);
    setCurrentTestTypesData([]);
    setCurrentSubTestTypesData([]);
    setCurrentSubTestTypeRFIsData([]);
    setBreadcrumbData([]);
    setSearchText('');
  }, []);

  const onClick = (level: number, assignmentLevel: number, testClassifIndex: number, workCateIndex: number = -1, testMateIndex: number = -1, testTypeIndex: number = -1) => {
    const testClassifData: any = myTestsData[testClassifIndex];
    if (isTestInventoryClassification(testClassifData.name)) { // TODO - will introduce type in db and use it iso Classification Name
      const testWorkCategory = testClassifData.testWorkCategoriesData[0];
      navigation.navigate('AssignTestMaterialsPurchage', {
        testClassificationId: testClassifData.id,
        testClassificationName: testClassifData.name,
        testWorkCategoryId: testWorkCategory._id,
        testWorkCategoryName: testWorkCategory.name,
        workType: workType
      })
      return;
    }

    setOpenPopup(false);
    setSearchText('');
    setCurrentLevel(level)
    setBreadcrumbData([]);
    setCurrentTestTypesData([]);
    setCurrentSubTestTypesData([]);
    setCurrentSubTestTypeRFIsData([]);
    let testWorkCategoryData = null;
    let testMateData = null;
    let testTypeData = null;
    let breadCrumb: any = [{
      name: testClassifData.name,
      testClassifIndex: testClassifIndex,
      workCateIndex: workCateIndex,
      testMateIndex: testMateIndex,
      testTypeIndex: testTypeIndex,
      level: level,
      assignmentLevel: 1,
      active: true
    },
    {
      name: 'Work Category',
      testClassifIndex: testClassifIndex,
      workCateIndex: workCateIndex,
      testMateIndex: testMateIndex,
      testTypeIndex: testTypeIndex,
      level: 0,
      assignmentLevel: 0,
      active: false
    }];
    setCurrentTestWorkCategoryData(testClassifData.testWorkCategoriesData);
    if (workCateIndex != -1) {
      testWorkCategoryData = testClassifData.testWorkCategoriesData[workCateIndex];
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
        active: true
      })

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
          active: true
        })

        if (testTypeIndex != -1) {
          testTypeData = testMateData.testTypesData[testTypeIndex];
          breadCrumb[3].name = testTypeData.name;
          if (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CONCRETE) {
            if (testTypeData.type === TEST_SAMPLE_CONCRETE_CATEGORY.CORE_TEST) {
              setCurrentTestTypesData([]);
              testTypeData.materialType = TEST_MATERIALS_TYPES.CONCRETE; // TEMP - TODO
              setSelectedTestSample(testTypeData);

              const testObservations: any = [];
              testObservations.push(getTestSampleConcreteObject(1));
              setConcreteSampleTestItems(testObservations);
              setOpenPopup(true);
            }
          } else if (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CEMENT) {
            testTypeData.materialType = TEST_MATERIALS_TYPES.CEMENT;
            setSelectedTestSample(testTypeData);
            if (testTypeData.type === TEST_TYPES.COMPRESSIVE_STRENGTH) {
              if (testTypeData.subTestTypes?.length) {
                setCurrentSubTestTypesData(testTypeData.subTestTypes)
              }
            } else if (testTypeData.type === TEST_TYPES.SOUNDNESS) {
              const testObservations: any = [];
              testObservations.push(getTestSampleCementSoundnessObject(1));
              setConcreteSampleTestItems(testObservations);
              setOpenPopup(true);
            }
          } else if (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE) {
            console.log('=======', testTypeData)
            testTypeData.materialType = TEST_MATERIALS_TYPES.FINE_AGGREGATE;
            setSelectedTestSample(testTypeData);
            const testObservations: any = [];
            testObservations.push(getTestSampleCementFineAggregateObject(1, testTypeData.type));
            setConcreteSampleTestItems(testObservations);
            setOpenPopup(true);
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

  }

  const onClickNested = (level: number, data: any) => {
    setSearchText('');
    setCurrentSubTestTypeRFIsData([]);
    if (data.testClassificationId) {
      setTestClassificationId(data.testClassificationId);
    }
    setCurrentLevel(level);
    if (level === 2) {
      setCurrentTestWorkCategoryData(data.testWorkCategoriesData)
      //const beadcrumb = breadcrumbData[1];
    } else if (level === 3) {
      breadcrumbData[1].name = data.name;
      setCurrentTestMaterialsData(data.testMaterialsData)
      const bcrubm = {
        name: 'Test Materials',
        testClassifIndex: breadcrumbData[0].testClassifIndex,
        workCateIndex: breadcrumbData[1].workCateIndex,
        testMateIndex: breadcrumbData[2]?.testMateIndex || -1,
        testTypeIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false
      }
      breadcrumbData.push(bcrubm)
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
      setCurrentTestTypesData(data.testTypesData)
      const bcrubm = {
        name: 'Test Types',
        testClassifIndex: breadcrumbData[0].testClassifIndex,
        workCateIndex: breadcrumbData[1].workCateIndex,
        testMateIndex: breadcrumbData[2]?.testMateIndex || -1,
        testTypeIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false
      }
      breadcrumbData.push(bcrubm)
    } else if (level === 6) {
      // show sample test generated
      setCurrentSubTestTypeRFIsData(data.testRFIsData);
    }
  }

  const onUpdateTestSample = (item: any) => {
    if (!item['sampleStatus_TEMP'] || item['sampleStatus_TEMP'] === TEST_SAMPLE_STATUS.PENDING) {
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
      rfiDateTime: (dateTimeArray[2] + '-' + dateTimeArray[1] + '-' + dateTimeArray[0]),
    };
    dispatch(updateTestSample({
      projectId: loggedInUser.projectId,
      id: item._id,
      body: obj
    }));
  }

  const onClickTestSampleItem = (item: any) => {
    setSelectedTestSample(item);
    const testObservations: any = [];

    if (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CONCRETE) {
      item.materialType = TEST_MATERIALS_TYPES.CONCRETE;
      if (!item.workChecklistSubmitted) {
        Alert.alert('Error', 'Checklist of this sample yet to be submitted.')
        return;
      }
      if (!item.readyForDayTesting) {
        Alert.alert('Error', `Testing of this sample will be started by ${item.startTestingByDate}`);
        return;
      }

      testObservations.push(getTestSampleConcreteObject(1));
      if (item.testCategory === TEST_SAMPLE_CONCRETE_CATEGORY.C_28TH_DAYS) {
        testObservations.push(getTestSampleConcreteObject(2));
        testObservations.push(getTestSampleConcreteObject(3));
      }
    } else if (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CEMENT) {
      item.materialType = TEST_MATERIALS_TYPES.CEMENT;
      testObservations.push(getTestSampleCementCompressiveStrengthObject(1));
      testObservations[0].ageInDays.value = item.testCategory;
    }

    setConcreteSampleTestItems(testObservations);
    setOpenPopup(true);
  }

  const onSubmitTestSample = (status: string) => {
    const objSampleTest7thOr28thDay = Object.assign({}, formSampleTest7thOr28thDay);
    objSampleTest7thOr28thDay.dateOfTesting = getDbDateFromDDMMYYYY(objSampleTest7thOr28thDay.dateOfTesting);
    objSampleTest7thOr28thDay.roomTemperature = Number(objSampleTest7thOr28thDay.roomTemperature);
    objSampleTest7thOr28thDay.humidity = Number(objSampleTest7thOr28thDay.humidity);
    objSampleTest7thOr28thDay.observations = Object.assign([], concreteSampleTestItems);
    const sampleObservations: any = objSampleTest7thOr28thDay.observations && objSampleTest7thOr28thDay.observations;
    for (let i = 0; i < sampleObservations?.length; i++) {
      const observations = sampleObservations[i];
      observations['details']?.values.forEach((item: any) => {
        if (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CONCRETE || selectedTestSample.type === TEST_TYPES.COMPRESSIVE_STRENGTH) {
          item.wtCube = Number(item.wtCube);
          item.failureLoad = Number(item.failureLoad);
        }

        if (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CONCRETE) {
          item.testArea = Number(item.testArea);
          item.volOfCube = Number(item.volOfCube);
        }

        if (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CEMENT && selectedTestSample.type === TEST_TYPES.SOUNDNESS) {
          item.beforePuttingInBoilingWater = Number(item.beforePuttingInBoilingWater);
          item.afterPuttingInBoilingWater = Number(item.afterPuttingInBoilingWater);
        }

        if (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE) {
          if (selectedTestSample.type === TEST_TYPES.GRADATION) {
            item.weightRetainedInGm = Number(item.weightRetainedInGm);
          } else if (selectedTestSample.type === TEST_TYPES.NATURAL_MOISTURE_CONTENT) {
            item.test1 = Number(item.test1);
            item.test2 = Number(item.test2);
            item.test3 = Number(item.test3);
          }
        }

      })

      if (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE) {
        if (selectedTestSample.type === TEST_TYPES.GRADATION) {
          observations.weightOfSample = Number(observations.weightOfSample);
        }
      }

      if (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CEMENT) {
        if (selectedTestSample.type === TEST_TYPES.COMPRESSIVE_STRENGTH) {
          observations.dateOfTesting.value = objSampleTest7thOr28thDay.dateOfTesting;
        }
      }
    }

    console.log('=====@@====', JSON.stringify(objSampleTest7thOr28thDay))
    dispatch(generateTestSampleReport({
      projectId: loggedInUser.projectId,
      testRFIId: (selectedTestSample.type === TEST_TYPES.SOUNDNESS || currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE) ? selectedTestSample.testRFIsData[0]?._id : selectedTestSample._id,
      body: {
        sampleData: objSampleTest7thOr28thDay
      }
    }));
  }

  const getTestSampleConcreteObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum
      },
      details: {
        titles: ['Cube No.', 'Wt. of cube in gm', 'Volume of Cube in Cum', 'Test Area in mm2', 'Failure Load (KN)', 'Compressive Strength (N/mm2)'],
        values: [
          {
            cubeNo: 1,
            wtCube: 0,
            volOfCube: 0,
            testArea: 0,
            failureLoad: 0,
            compressiveStrength: 0
          },
          {
            cubeNo: 2,
            wtCube: 0,
            volOfCube: 0,
            testArea: 0,
            failureLoad: 0,
            compressiveStrength: 0
          },
          {
            cubeNo: 3,
            wtCube: 0,
            volOfCube: 0,
            testArea: 0,
            failureLoad: 0,
            compressiveStrength: 0
          }
        ]
      },
      avgStrength: {
        title: 'Avg. Strength (N/mm2)',
        value: 0
      },
      remarks: {
        title: 'Remarks',
        value: ''
      }
    }
  }

  const getTestSampleCementCompressiveStrengthObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum
      },
      details: {
        titles: ['Sl. No.', 'Wt. of cube in gm', 'Failure Load (KN)', 'Compressive Strength (N/mm2)'],
        values: [
          {
            slNo: 1,
            wtCube: 0,
            failureLoad: 0,
            compressiveStrength: 0
          },
          {
            slNo: 2,
            wtCube: 0,
            failureLoad: 0,
            compressiveStrength: 0
          },
          {
            slNo: 3,
            wtCube: 0,
            failureLoad: 0,
            compressiveStrength: 0
          }
        ]
      },
      ageInDays: {
        title: 'Age in Days',
        value: ''
      },
      dateOfTesting: {
        title: 'Date of Testing',
        value: ''
      },
      avgStrength: {
        title: 'Avg. Strength (N/mm2)',
        value: 0
      },

    }
  }

  const getTestSampleCementSoundnessObject = (sampleNum: any) => {
    return {
      sampleNo: {
        title: 'Sample no',
        value: sampleNum
      },
      details: {
        titles: ['Sl. No.', 'Before putting in boiling water (A) in mm', 'After (3 hours) putting in boiling water(B)', 'Soundness (B-A) in terms of le Chatelier’s (mm)'],
        values: [
          {
            slNo: 1,
            beforePuttingInBoilingWater: 0,
            afterPuttingInBoilingWater: 0,
            soundnessChatelier: 0
          },
          {
            slNo: 2,
            beforePuttingInBoilingWater: 0,
            afterPuttingInBoilingWater: 0,
            soundnessChatelier: 0
          },
        ]
      },
    }
  }

  const getTestSampleCementFineAggregateObject = (sampleNum: any, taskType: string) => {
    if (taskType === TEST_TYPES.GRADATION) {
      return {
        weightOfSample: 0,
        sampleNo: {
          title: 'Sample no',
          value: sampleNum
        },
        details: {
          titles: ['Sieve Size', 'Weight retained in gm', 'Cumulative weight retained in gm', 'Cumulative retained in %', '% Passing'],
          values: [
            {
              sieveSize: '10.0 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0
            },
            {
              sieveSize: '4.75 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0
            },
            {
              sieveSize: '2.36 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0
            },
            {
              sieveSize: '1.18 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0
            },
            {
              sieveSize: '0.600 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0
            },
            {
              sieveSize: '0.300 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0
            },
            {
              sieveSize: '0.150 mm',
              weightRetainedInGm: 0,
              cumulativeWeightRetainedInGm: 0,
              cumulativeRetainedInPercent: 0,
              passignPercent: 0
            },
          ]
        },
      }
    } else if (taskType === TEST_TYPES.NATURAL_MOISTURE_CONTENT) {
      return {
        sampleNo: {
          title: 'Sample no',
          value: sampleNum
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
              description: 'Avg. Moisture Content = w = (K1+K2+K3)/3',
              avgMoistureContent: 0,
            },
          ]
        },
      }
    }

  }

  useEffect(() => {
    if (generatedTestSampleReport) {
      Alert.alert('Info', 'Test sample report generated.')
    }
  }, [generatedTestSampleReport, error]);

  const getStyle = (item: any) => {
    if (item.rfiStatus) {
      if (item.rfiStatus === RFI_STATUS.GENERATED || item.rfiStatus === RFI_STATUS.RE_GENERATED) {
        return [styles.StartWorkCard, styles.StartBorder];
      } else if (item.rfiStatus === RFI_STATUS.REJECTED || item.rfiStatus === RFI_STATUS.CANCELLED) {
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
  }

  const getRFIDataByWorkAssignmentId = (task: any) => {
    // setSelectedTask(task);
    // dispatch(getRFIByWaId({
    //   projectId: loggedInUser.projectId,
    //   projectModuleId: projectModuleId,
    //   waId: task.workAssignmentId,
    // }));
  }

  const tasksListing = () => {
    return currentTestTypesData.filter((task: any) => {
      if (searchText && task.name) {
        return task.name.toLowerCase().includes(searchText.toLowerCase())
      } else {
        return true;
      }
    }).map((item: any, index) => (
      <View style={getStyle(item)}>
        <View style={styles.leftContainer}>
          <Text style={styles.HeadText}>{item.name}</Text>
          {/* <Text style={styles.MyWorkSubHead}>Sub Text</Text> */}
        </View>
        {
          item.rfiStatus === RFI_STATUS.GENERATED ?
            <TouchableOpacity style={[styles.MyWorkCta, styles.StartBorder]} onPress={() => {
              getRFIDataByWorkAssignmentId(item)
            }}>
              <Image style={styles.WorkIcon} source={require('../../images/play-icon.png')} />
              <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>Start</Text>
            </TouchableOpacity> : null
        }

        {
          item.rfiStatus === RFI_STATUS.RE_GENERATED ?
            <TouchableOpacity style={[styles.MyWorkCta, styles.StartBorder]} onPress={() => {
              getRFIDataByWorkAssignmentId(item)
            }}>
              <Image style={styles.WorkIcon} source={require('../../images/play-icon.png')} />
              <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>Re-start</Text>
            </TouchableOpacity> : null
        }

        {
          (item.rfiStatus === RFI_STATUS.REJECTED || item.rfiStatus === RFI_STATUS.CANCELLED) ?
            <TouchableOpacity style={[styles.MyWorkCta, styles.StartRejectBorder]}>
              {/* <Image style={styles.WorkIcon} source={require('../../images/play-icon.png')} /> */}
              <Text style={[styles.CtaStartText, styles.CtaRejectTextColor]}>{item.rfiStatus === RFI_STATUS.CANCELLED ? 'Cancelled' : 'Rejected'}</Text>
            </TouchableOpacity> : null
        }

        {
          item.rfiStatus === RFI_STATUS.IN_PROGRESS ?
            <TouchableOpacity style={[styles.MyWorkCta, styles.StartInProgressBorder]} onPress={() => {
              getRFIDataByWorkAssignmentId(item)
            }}>
              <Image style={styles.WorkIcon} source={require('../../images/inprogress.png')} />
              <Text style={[styles.CtaStartText, styles.CtaInProgressTextColor]}>In Progress</Text>
            </TouchableOpacity> : null
        }

        {
          item.rfiStatus === RFI_STATUS.IN_REVIEW ?
            <TouchableOpacity style={[styles.MyWorkCta, styles.StartReviewBorder]}>
              <Image style={styles.WorkIcon} source={require('../../images/review-icon.png')} />
              <Text style={[styles.CtaStartText, styles.CtaReviewTextColor]}>Under Review</Text>
            </TouchableOpacity> : null
        }

        {
          item.rfiStatus === RFI_STATUS.APPROVED ?
            <TouchableOpacity style={[styles.MyWorkCta, styles.StartCompleteBorder]}>
              <Image style={styles.WorkIcon} source={require('../../images/complete-icon.png')} />
              <Text style={[styles.CtaStartText, styles.CtaCompleteTextColor]}>Completed</Text>
            </TouchableOpacity> : null
        }

      </View>
    ))
  }

  const CustomDropdownPicker = ({ items, rowItem, fieldName, tempProp }: { items: any, rowItem: any, fieldName: any, tempProp: boolean }) => {
    const [value, setValue] = useState(rowItem[fieldName]);
    const updateValue = (value: any) => {
      setValue(value);
      { rowItem[fieldName + (tempProp ? '_TEMP' : '')] = value }
    }
    return (
      // style={{ width: 110, height: 30, zIndex: 10 }}
      <DropdownPicker
        value={value}
        label=''
        items={items}
        onChange={(value: string) => updateValue(value)}
      />
    )
  }

  const CustomTextInput = ({ rowItem, fieldName, tempProp = false, styleName = {} }: { rowItem: any, fieldName: any, tempProp: boolean, styleName: any }) => {
    const [value, setValue] = useState(rowItem[fieldName]);
    const updateValue = (text: any) => {
      { rowItem[fieldName + (tempProp ? '_TEMP' : '')] = text }
    }

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
          setValue(value); updateValue(value);
        }}
      //onBlur={() => onBlur()}
      />
    )
  }

  const CustomCalendarPicker = ({ rowItem, fieldName, tempProp = false }: { rowItem: any, fieldName: any, tempProp: boolean }) => {
    const [value, setValue] = useState(rowItem[fieldName]);
    const updateValue = (text: any) => {
      rowItem[fieldName + (tempProp ? '_TEMP' : '')] = text;
    }

    return (
      <CalendarPicker
        value={value}
        onChange={date => {
          setValue(date); updateValue(date);
        }}
      />
    )
  }

  const [concreteSampleTestItems, setConcreteSampleTestItems]: any[] = useState([]);

  type FormSampleTest7thOr28thDayState = {
    dateOfTesting: string;
    sampleBy: string;
    testConductedBy: string;
    roomTemperature: number;
    humidity: number;
    observations?: any[]
  }

  const [formSampleTest7thOr28thDay, setFormSampleTest7thOr28thDay] = useState<FormSampleTest7thOr28thDayState>({
    dateOfTesting: '',
    sampleBy: '',
    testConductedBy: '',
    roomTemperature: 0,
    humidity: 0,
    observations: []
  });

  const handleInputChange = (name: keyof FormSampleTest7thOr28thDayState, value: string | number | []) => {
    setFormSampleTest7thOr28thDay({ ...formSampleTest7thOr28thDay, [name]: value });
  };

  const handleInputChangeFineAggregate = (item: any, name: any, value: string | number | []) => {
    item[name] = value;
    setFormSampleTest7thOr28thDay({ ...formSampleTest7thOr28thDay});
  };

  const testSampleForm = (materialType: any) => {
    if (materialType === TEST_MATERIALS_TYPES.CONCRETE || materialType === TEST_MATERIALS_TYPES.CEMENT || materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE) {
      return <View>
        <View style={{ flexDirection: 'column', paddingBottom: 40 }}>
          <View style={{ flexDirection: 'column' }}>
            <CalendarPicker
              label="Date of Testing"
              value={formSampleTest7thOr28thDay.dateOfTesting}
              onChange={date => handleInputChange('dateOfTesting', date)}
            />
          </View>

          <View style={{ flexDirection: 'column' }}>
            <DropdownPicker
              value={formSampleTest7thOr28thDay.sampleBy}
              label='Sampled By'
              items={SAMPLE_BY_LIST}
              onChange={(value: string) => handleInputChange('sampleBy', value)}
            />
          </View>

          <View style={{ flexDirection: 'column' }}>
            <DropdownPicker
              value={formSampleTest7thOr28thDay.testConductedBy}
              label='Test Conducted By'
              items={TEST_CONDUCTED_BY_LIST}
              onChange={(value: string) => handleInputChange('testConductedBy', value)}
            />
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Input
              label="Room Temperature/ Atmospheric Temperature (in C)"
              value={'' + formSampleTest7thOr28thDay.roomTemperature}
              onChange={(value: string) => handleInputChange('roomTemperature', value)}
              isRequired={true}
            />
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Input
              label="Humidity in %"
              value={'' + formSampleTest7thOr28thDay.humidity}
              onChange={(value: string) => handleInputChange('humidity', value)}
              isRequired={true}
            />
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Observations:</Text>
            <ScrollView style={styles.Width100} horizontal={true}>
              {
                currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CONCRETE &&
                <View>
                  {
                    concreteSampleTestItems.map((item: any, index: any) => (
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column', width: 80 }}>
                          <View style={index === 0 && { height: 40 }}>
                            {
                              index === 0 && <Text style={{ fontWeight: '700' }}>{item.sampleNo.title}</Text>
                            }
                          </View>
                          <View>
                            <Text style={{ textAlign: 'center' }}>{item.sampleNo.value}</Text>
                          </View>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
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
                          {
                            item.details.values.map((value: any, indexDetails: number) => (
                              <View style={{ flexDirection: 'row' }}>
                                {/* <View style={{flexDirection: 'column', width: 60}}>
                                      {
                                        index === 0 ? 
                                        <View style={{height: 40}}>
                                          <Text style={{fontWeight: '700'}}>{item.details.titles[0]}</Text>
                                      </View> : null
                                      }
                                      <Text style={[styles.textStyle2, {textAlign: 'center'}]}>{value.cubeNo}</Text>
                                    </View> */}

                                <View style={{ flexDirection: 'column', width: 120 }}>
                                  {
                                    index === 0 && indexDetails === 0 ?
                                      <View style={{ height: 40 }}>
                                        <Text style={{ fontWeight: '700' }}>{item.details.titles[1]}</Text>
                                      </View> : null
                                  }
                                  <CustomTextInput rowItem={value}
                                    tempProp={false}
                                    styleName={styles.inputStyle3}
                                    fieldName={'wtCube'}></CustomTextInput>
                                </View>

                                <View style={{ flexDirection: 'column', width: 120 }}>
                                  {
                                    index === 0 && indexDetails === 0 ?
                                      <View style={{ height: 40 }}>
                                        <Text style={{ fontWeight: '700' }}>{item.details.titles[2]}</Text>
                                      </View> : null
                                  }
                                  <CustomTextInput rowItem={value}
                                    tempProp={false}
                                    styleName={styles.inputStyle3}
                                    fieldName={'volOfCube'}></CustomTextInput>
                                </View>

                                <View style={{ flexDirection: 'column', width: 120 }}>
                                  {
                                    index === 0 && indexDetails === 0 ?
                                      <View style={{ height: 40 }}>
                                        <Text style={{ fontWeight: '700' }}>{item.details.titles[3]}</Text>
                                      </View> : null
                                  }
                                  <CustomTextInput rowItem={value}
                                    tempProp={false}
                                    styleName={styles.inputStyle3}
                                    fieldName={'testArea'}></CustomTextInput>
                                </View>

                                <View style={{ flexDirection: 'column', width: 120 }}>
                                  {
                                    index === 0 && indexDetails === 0 ?
                                      <View style={{ height: 40 }}>
                                        <Text style={{ fontWeight: '700' }}>{item.details.titles[4]}</Text>
                                      </View> : null
                                  }
                                  <CustomTextInput rowItem={value}
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
                            ))
                          }
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
                    )
                    )
                  }
                </View>
              }
              {
                currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CEMENT &&
                (
                  selectedTestSample.type === TEST_TYPES.COMPRESSIVE_STRENGTH ?
                    <View>
                      {
                        concreteSampleTestItems.map((item: any, index: any) => (
                          <View style={{ flexDirection: 'row' }}>
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

                            <View style={{ flexDirection: 'column' }}>
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
                              {
                                item.details.values.map((value: any, indexDetails: number) => (
                                  <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flexDirection: 'column', width: 60 }}>
                                      {
                                        index === 0 && indexDetails === 0 ?
                                          <View style={{ height: 40 }}>
                                            <Text style={{ fontWeight: '700' }}>{item.details.titles[0]}</Text>
                                          </View> : null
                                      }
                                      <Text style={[styles.textStyle2, { textAlign: 'center' }]}>{value.slNo}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', width: 120 }}>
                                      {
                                        index === 0 && indexDetails === 0 ?
                                          <View style={{ height: 40 }}>
                                            <Text style={{ fontWeight: '700' }}>{item.details.titles[1]}</Text>
                                          </View> : null
                                      }
                                      <CustomTextInput rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'wtCube'}></CustomTextInput>
                                    </View>

                                    <View style={{ flexDirection: 'column', width: 120 }}>
                                      {
                                        index === 0 && indexDetails === 0 ?
                                          <View style={{ height: 40 }}>
                                            <Text style={{ fontWeight: '700' }}>{item.details.titles[4]}</Text>
                                          </View> : null
                                      }
                                      <CustomTextInput rowItem={value}
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
                                ))
                              }
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
                        )
                        )
                      }
                    </View>
                    :
                    <View>
                      {
                        concreteSampleTestItems.map((item: any, index: any) => (
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                              {
                                item.details.values.map((value: any, indexDetails: number) => (
                                  <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flexDirection: 'column', width: 80 }}>
                                      {
                                        index === 0 && indexDetails === 0 ?
                                          <View style={{ height: 40 }}>
                                            <Text style={{ fontWeight: '700' }}>{item.details.titles[0]}</Text>
                                          </View> : null
                                      }
                                      <Text style={[styles.textStyle2, { textAlign: 'center' }]}>{value.slNo}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', width: 150 }}>
                                      {
                                        index === 0 && indexDetails === 0 ?
                                          <View style={{ height: 40 }}>
                                            <Text style={{ fontWeight: '700' }}>{item.details.titles[1]}</Text>
                                          </View> : null
                                      }
                                      <CustomTextInput rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle4}
                                        fieldName={'beforePuttingInBoilingWater'}></CustomTextInput>
                                    </View>

                                    <View style={{ flexDirection: 'column', width: 150 }}>
                                      {
                                        index === 0 && indexDetails === 0 ?
                                          <View style={{ height: 40 }}>
                                            <Text style={{ fontWeight: '700' }}>{item.details.titles[2]}</Text>
                                          </View> : null
                                      }
                                      <CustomTextInput rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle4}
                                        fieldName={'afterPuttingInBoilingWater'}></CustomTextInput>
                                    </View>
                                  </View>
                                ))
                              }

                            </View>
                          </View>
                        )
                        )
                      }
                    </View>
                )
              }
              {
                currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.FINE_AGGREGATE &&
                (
                  (
                    selectedTestSample.type === TEST_TYPES.GRADATION ?
                    <View>
                      <View style={{ flexDirection: 'column' }}>
                        <Input
                          label="Total weight of Sample in gm (T)"
                          value={concreteSampleTestItems[0].weightOfSample}
                          onChange={(value: any) => handleInputChangeFineAggregate(concreteSampleTestItems[0], 'weightOfSample', value)}
                          isRequired={true}
                        />
                      </View>
                      {
                        concreteSampleTestItems.map((item: any, index: any) => (
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                              {
                                item.details.values.map((value: any, indexDetails: number) => (
                                  <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flexDirection: 'column', width: 80 }}>
                                      {
                                        index === 0 && indexDetails === 0 ?
                                          <View style={{ height: 40 }}>
                                            <Text style={{ fontWeight: '700' }}>{item.details.titles[0]}</Text>
                                          </View> : null
                                      }
                                      <Text style={[styles.textStyle2, { textAlign: 'center' }]}>{value.sieveSize}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', width: 150 }}>
                                      {
                                        index === 0 && indexDetails === 0 ?
                                          <View style={{ height: 40 }}>
                                            <Text style={{ fontWeight: '700' }}>{item.details.titles[1]}</Text>
                                          </View> : null
                                      }
                                      <CustomTextInput rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle4}
                                        fieldName={'weightRetainedInGm'}></CustomTextInput>
                                    </View>
                                  </View>
                                ))
                              }

                            </View>
                          </View>
                        )
                        )
                      }
                    </View>
                    : selectedTestSample.type === TEST_TYPES.NATURAL_MOISTURE_CONTENT ?
                    <View>
                      {
                        concreteSampleTestItems.map((item: any, index: any) => (
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                              {
                                item.details.values.filter((value: any) => !value.hide).map((value: any, indexDetails: number) => (
                                  <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flexDirection: 'column', width: 80 }}>
                                      {
                                        index === 0 && indexDetails === 0 ?
                                          <View style={{ height: 40 }}>
                                            <Text style={{ fontWeight: '700' }}>{item.details.titles[0]}</Text>
                                          </View> : null
                                      }
                                      <Text style={[styles.textStyle2, { textAlign: 'center' }]}>{value.description}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', width: 120 }}>
                                      {
                                        index === 0 && indexDetails === 0 ?
                                          <View style={{ height: 40 }}>
                                            <Text style={{ fontWeight: '700' }}>{item.details.titles[1]}</Text>
                                          </View> : null
                                      }
                                      <CustomTextInput rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test1'}></CustomTextInput>
                                    </View>
                                    <View style={{ flexDirection: 'column', width: 120 }}>
                                      {
                                        index === 0 && indexDetails === 0 ?
                                          <View style={{ height: 40 }}>
                                            <Text style={{ fontWeight: '700' }}>{item.details.titles[2]}</Text>
                                          </View> : null
                                      }
                                      <CustomTextInput rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test2'}></CustomTextInput>
                                    </View>
                                    <View style={{ flexDirection: 'column', width: 120 }}>
                                      {
                                        index === 0 && indexDetails === 0 ?
                                          <View style={{ height: 40 }}>
                                            <Text style={{ fontWeight: '700' }}>{item.details.titles[3]}</Text>
                                          </View> : null
                                      }
                                      <CustomTextInput rowItem={value}
                                        tempProp={false}
                                        styleName={styles.inputStyle3}
                                        fieldName={'test3'}></CustomTextInput>
                                    </View>
                                  </View>
                                ))
                              }

                            </View>
                          </View>
                        )
                        )
                      }
                    </View>
                    : null
                  )
                )
              }

            </ScrollView>
          </View>

        </View>
      </View>
    }
  }

  return (
    <View style={styles.Container}>
      <View style={styles.BreadcrumbContainer}>
        {
          breadcrumbData.map((item: any, index) => (
            <View style={{ flexDirection: 'row' }}>
              {
                index == 0 ? <Text style={styles.BreadcrumbPrevTextUnderline} onPress={() => index === 0 && (setCurrentLevel(1), setBreadcrumbData([]))}>{item.name}</Text>
                  : index === (breadcrumbData.length - 1) ? <Text style={styles.BreadcrumbCurrentText}>{item.name}</Text>
                    : <Text style={styles.BreadcrumbPrevText}>{item.name}</Text>
              }
              {
                index < (breadcrumbData.length - 1) ? <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} /> : null
              }
            </View>
          ))
        }
      </View>
      {
        (currentLevel !== 1 && currentLevel !== 4) ? <View style={styles.SearchBox}>
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
            onChangeText={(text) => {
              setSearchText(text);
            }}
          />
        </View>
          : null
      }
      <ScrollView showsVerticalScrollIndicator={false}  style={styles.Height100}>
        {
          currentLevel === 1 ?
            myTestsData.map((testClassificationItem: any, testClassificationIndex) => (
              testClassificationItem.assignmentLevel === 1 ?
                <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(2, testClassificationItem.assignmentLevel, testClassificationIndex)}>
                  <Text style={styles.HeadingText}>{testClassificationItem.name}</Text>
                  <View style={styles.TaskDetails}>
                    <Text style={styles.SubHeadingText}>Assigned:</Text>
                    <Text style={[styles.SubHeadingText, styles.SubActive]}>{testClassificationItem.name}</Text>
                  </View>
                </TouchableOpacity>
                :
                (testClassificationItem.testWorkCategoriesData?.map((workCateItem: any, workCateIndex: any) => (
                  (workCateItem.assignmentLevel === 2) ? (
                    <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(3, workCateItem.assignmentLevel, testClassificationIndex, workCateIndex)}>
                      <Text style={styles.HeadingText}>{testClassificationItem.name}</Text>
                      <View style={styles.TaskDetails}>
                        <Text style={styles.SubHeadingText}>Assigned:</Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={[styles.SubHeadingText, styles.SubActive]}>{workCateItem.name}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                    :
                    workCateItem.testMaterialsData && workCateItem.testMaterialsData.length ? (
                      workCateItem.testMaterialsData?.map((testMateItem: any, testMateIndex: number) => (
                        testMateItem.assignmentLevel === 3 ?
                          (
                            <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(4, testMateItem.assignmentLevel, testClassificationIndex, workCateIndex, testMateIndex)}>
                              <Text style={styles.HeadingText}>{testClassificationItem.name}</Text>
                              <View style={styles.TaskDetails}>
                                <Text style={styles.SubHeadingText}>Assigned:</Text>
                                <Text style={styles.SubHeadingText}>{workCateItem.name} /</Text>
                                <Text style={[styles.SubHeadingText, styles.SubActive]}>{testMateItem.name}</Text>
                              </View>
                            </TouchableOpacity>

                          )
                          :
                          testMateItem.testTypesData?.map((testTypeItem: any, testTypeIndex: number) => (
                            testTypeItem.assignmentLevel === 4 &&
                            <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(5, testTypeItem.assignmentLevel, testClassificationIndex, workCateIndex, testMateIndex, testTypeIndex)}>
                              <Text style={styles.HeadingText}>{testClassificationItem.name}</Text>
                              <View style={styles.TaskDetails}>
                                <Text style={styles.SubHeadingText}>Assigned:</Text>
                                <Text style={styles.SubHeadingText}>{workCateItem.name} /</Text>
                                <Text style={styles.SubHeadingText}>{testMateItem.name} /</Text>
                                <Text style={[styles.SubHeadingText, styles.SubActive]}>{testTypeItem.name}</Text>
                              </View>
                            </TouchableOpacity>

                          ))

                      ))
                    )
                      :
                      null

                )))

            )) : null
        }
        {
          currentLevel === 2 ?
            currentTestWorkCategoryData && currentTestWorkCategoryData.length ? currentTestWorkCategoryData.filter((subSeg: any) => {
              if (searchText && subSeg.name) {
                return subSeg.name.toLowerCase().includes(searchText.toLowerCase())
              } else {
                return true;
              }
            }).map((item: any, index) => (
              <TouchableOpacity style={getStyle(item)} onPress={() => onClickNested(3, item)}>
                <View style={styles.leftContainer}>
                  <Text style={styles.HeadText}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )) : tasksListing()
            :
            null
        }
        {
          currentLevel === 3 ?
            currentTestMaterialsData && currentTestMaterialsData.length ? currentTestMaterialsData.filter((testMate: any) => {
              if (searchText && testMate.name) {
                return testMate.name.toLowerCase().includes(searchText.toLowerCase())
              } else {
                return true;
              }
            }).map((item: any, index) => (
              <TouchableOpacity style={getStyle(item)} onPress={() => onClickNested(4, item)}>
                <View style={styles.leftContainer}>
                  <Text style={styles.HeadText}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )) : tasksListing()
            :
            null
        }
        {
          (currentLevel === 4) ?
            tasksListing()
            : null
        }
        {
          (currentLevel === 5) ?
            currentSubTestTypesData?.length ?
              currentSubTestTypesData.filter((subTestType: any) => {
                if (searchText && subTestType.name) {
                  return subTestType.name.toLowerCase().includes(searchText.toLowerCase())
                } else {
                  return true;
                }
              }).map((item: any) => (
                <TouchableOpacity style={getStyle(item)} onPress={() => onClickNested(6, item)}>
                  <View style={styles.leftContainer}>
                    <Text style={styles.HeadText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )) : ((currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CONCRETE && selectedTestSample?.type === TEST_TYPES.CUBE_TEST) ||
                (currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CEMENT && selectedTestSample?.type === TEST_TYPES.COMPRESSIVE_STRENGTH)) && tasksListing()
            :
            null
        }
        {
          (currentLevel === 6) ?
            currentSubTestTypeRFIsData?.length ?
              <ScrollView style={styles.Height100}>
                {
                  currentSubTestTypeRFIsData.filter((testRFI: any) => {
                    if (searchText && testRFI.name) {
                      return testRFI.name.toLowerCase().includes(searchText.toLowerCase())
                    } else {
                      return true;
                    }
                  }).map((item: any) => (
                    <View>
                      <View style={currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CONCRETE && item.sampleStatus != TEST_SAMPLE_STATUS.PREPARED && { borderColor: '#000', borderWidth: 1, borderRadius: 10, marginBottom: 10 }}>
                        <TouchableOpacity style={getStyle(item)} disabled={(currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CONCRETE && item.sampleStatus != TEST_SAMPLE_STATUS.PREPARED) || item.rfiStatus === RFI_STATUS.APPROVED} onPress={() => onClickTestSampleItem(item)}>
                          <View style={styles.leftContainer}>
                            <Text style={styles.HeadText}>{item.name}</Text>
                          </View>
                        </TouchableOpacity>
                        {
                          currentTestMaterialData.materialType === TEST_MATERIALS_TYPES.CONCRETE && item.sampleStatus != TEST_SAMPLE_STATUS.PREPARED ?
                            <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                              <View style={[styles.SectionStyle, { width: 140 }]}>
                                <CustomDropdownPicker items={TEST_SAMPLE_STATUS_LIST}
                                  rowItem={item} tempProp={true}
                                  fieldName={'sampleStatus'}
                                />
                              </View>
                              <View style={{ height: 45 }}>
                                <CustomCalendarPicker rowItem={item}
                                  tempProp={true}
                                  fieldName={'rfiDateTime'}></CustomCalendarPicker>
                              </View>
                              <View style={{ height: 45, width: 100 }}>
                                <TouchableOpacity style={[styles.SubmitSample, styles.StartBorder]} onPress={() => onUpdateTestSample(item)}>
                                  <View style={styles.leftContainer}>
                                    <Text style={styles.HeadText}>Submit</Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            </View>
                            :
                            null
                        }
                      </View>

                    </View>

                  ))
                }
              </ScrollView>
              : null//tasksListing()
            : null
        }
        {/* No Data Found */}
        {(!loading && !myTestsData.length) ?
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
          </View> : null
        }
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
                  <Text style={styles.modalLabel}>{selectedTestSample?.name}</Text>
                </View>
                <ScrollView style={{ paddingTop: 10, height: 500, width: 1000 }}>
                  <Fragment>
                    <StatusBar barStyle="dark-content" />
                    <SafeAreaView>
                      {
                        testSampleForm(selectedTestSample?.materialType)
                      }
                    </SafeAreaView>
                  </Fragment>
                </ScrollView>

                <View style={[styles.btnParentSection, { flexDirection: 'row', justifyContent: 'center', gap: 20 }]}>
                  <TouchableOpacity style={styles.submitButton} onPress={() => onSubmitTestSample(RFI_STATUS.IN_PROGRESS)}>
                    <Text style={styles.submitButtonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.submitButton} onPress={() => onSubmitTestSample(RFI_STATUS.APPROVED)}>
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
  )
}

const styles = StyleSheet.create({
  assignTagButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  GenerateRFIFieldLabel: {
    fontSize: 16,
    color: '#150A33',
    fontWeight: '500'
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 10,
    marginTop: 5,
  },
  Container: {
    padding: 20,
  },
  Height100: {
    height: '100%',
  },
  Width100: {
    width: Dimensions.get("screen").width,
  },
  SearchBox: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 20,
    marginTop: 5,
    position: 'relative',
  },
  ImageSearch: {
    position: 'absolute',
    width: 24,
    height: 24,
    zIndex: 9,
    left: 10,
    top: '27%',
  },
  inputStyle: {
    flex: 1,
    color: '#2c2c2c',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#808089',
    backgroundColor: '#fff',
    fontWeight: '600',
    paddingVertical: 5,
    height: 45,
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
    width: 50
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
    width: 120
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
    width: 150
  },
  textStyle: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 0,
    borderColor: '#808089',
    backgroundColor: '#ccc',
    fontWeight: '600',
    height: 40,
    width: 120
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
    opacity: 0.5
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
    marginLeft: 20
  },
  leftContainer: {
    flexDirection: 'column',
  },
  HeadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  MyWorkSubHead: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666'
  },
  WorkIcon: {
    width: 12,
    height: 12
  },
  MyWorkCta: {
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  CtaStartText: {
    fontSize: 12,
    fontWeight: '400'
  },
  CtaStartTextColor: {
    color: '#A1A1A1',
  },
  StartBorder: {
    borderColor: '#A1A1A1',
  },
  DisabledBorder: {
    borderColor: '#EBEBE4'
  },
  CtaInProgressTextColor: {
    color: '#FCB700',
  },
  StartInProgressBorder: {
    borderColor: '#FCB700'
  },
  CtaReviewTextColor: {
    color: '#1C58C0',
  },
  StartReviewBorder: {
    borderColor: '#1C58C0'
  },
  CtaCompleteTextColor: {
    color: '#2BC267',
  },
  StartCompleteBorder: {
    borderColor: '#2BC267'
  },
  StartRejectBorder: {
    borderColor: '#FF0000'
  },
  CtaRejectTextColor: {
    color: '#FF0000',
  },
  //Breacrumb Start
  BreadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 10,
    marginBottom: 10,
    gap: 5
  },
  BreadcrumbPrevText: {
    fontSize: 14,
    color: '#333'
  },
  BreadcrumbPrevTextUnderline: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#333'
  },
  BreadcrumbCurrentText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600'
  },
  ArrowIcon: {
    width: 18,
    height: 18
  },

  //MyQualityWork Card
  MyWorkCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    marginHorizontal: 10,
    minHeight: 100,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
  CompleteWork: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#2BC267',
    backgroundColor: '#fff'
  },
  CompleteIcon: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  HeadingText: {
    color: '#010101',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5
  },
  TaskDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  SubHeadingText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '400',
    marginRight: 5,
  },
  SubActive: {
    color: '#1C58C0',
    fontWeight: '800'
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
    fontSize: 16,
    fontWeight: '400',
    color: '#27272A',
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#1C58C0',
    borderRadius: 10,
    color: '#fff',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },


  bodyPopup: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('window').height - 60,
    width: Dimensions.get('window').width
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center'
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3
  },
  btnParentSection: {
    // alignItems: 'center',
    marginTop: 10
  },
  btnSection: {
    width: 150,
    height: 50,
    backgroundColor: '#1C58C0',
    // alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
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
    shadowOffset: { width: 0, height: 2 },
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

export default MyQualityWork