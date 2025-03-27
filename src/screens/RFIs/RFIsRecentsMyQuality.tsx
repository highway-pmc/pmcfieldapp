import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import {
  RFI_STATUS,
  RFIs_TYPE,
  TASK_TYPES,
  TEST_TYPES,
} from '../../constants/constants';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import React, {Fragment, useEffect, useState} from 'react';
import {
  actionGetTestRFIs,
  clearRFITasksEvent,
  generateTestRFIReport,
  updatedTestRFIs,
} from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import Pdf from 'react-native-pdf';
import {SwipeListView} from 'react-native-swipe-list-view';
import {getDisplayDate, getDisplayTime} from '../../utils/Utils';
const {height} = Dimensions.get('window');
import commonStyles from '../Common/commonStyles';

const RFIsRecentsMyQuality = (props: any) => {
  const navigation: any = useNavigation();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {rfiDataList, rfiUpdated, reportGenerated, loading, error} =
    useSelector((state: any) => state.RFIs);

  const [rfiData, setRfiData] = useState([]);

  const [openPopup, setOpenPopup] = useState(false);
  const [selectedRFI, setSelectedRFI]: any = useState(null);

  const [openCalendar, setOpenCalendar] = useState(false);

  const [pdfSource, setPdfSource] = useState(null);

  const dispatch = useDispatch();
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      setRfiData([]);
      getTestRFIsData();
      setPdfSource(null);
    }
  }, [focus]);

  const getTestRFIsData = () => {
    dispatch(
      actionGetTestRFIs({
        projectId: loggedInUser.projectId,
        status:
          props.rfiType === RFIs_TYPE.GENERATE ? 'generated' : props.rfiType,
      }),
    );
  };

  useEffect(() => {
    if (rfiDataList) {
      setRfiData(rfiDataList);
    }

    if (rfiUpdated) {
      Alert.alert('Success', 'RFI updated successfully.');
      navigation.navigate('RFIsHome');
    }

    if (reportGenerated) {
      //Alert.alert('Success', 'Report generated successfully.');
      setPdfSource({uri: 'data:application/pdf;base64,' + reportGenerated});
    }
  }, [rfiDataList, rfiUpdated, reportGenerated]);

  // unmount
  useEffect(
    () => () => {
      dispatch(clearRFITasksEvent());
    },
    [],
  );

  const getRFIType = () => {
    if (props.rfiType === RFIs_TYPE.GENERATE) {
      return 'Generated';
    } else if (props.rfiType === RFIs_TYPE.CLOSED) {
      return 'Closed';
    } else if (props.rfiType === RFIs_TYPE.APPROVED) {
      return 'Approved';
    } else if (props.rfiType === RFIs_TYPE.REJECTED) {
      return 'Rejected/Cancelled';
    } else if (props.rfiType === RFIs_TYPE.IN_PROGRESS) {
      return 'In Progress';
    }

    return '';
  };

  const onSelectRFI = (item: any) => {
    setPdfSource(null);
    setSelectedRFI(item);
    setOpenPopup(true);
  };

  const renderFileData = () => {
    if (selectedRFI?.metaData?.base64Image) {
      return (
        <Image
          source={{
            uri: 'data:image/jpeg;base64,' + selectedRFI?.metaData?.base64Image,
          }}
          style={styles.images}
        />
      );
    } else {
      return (
        <Image
          source={require('./../../images/dummy.png')} // ./assets/dummy.png
          style={styles.images}
        />
      );
    }
  };

  const onRFIAction = (status: string) => {
    dispatch(
      updatedTestRFIs({
        projectId: loggedInUser.projectId,
        rfiId: selectedRFI._id,
        status: status,
        body: {
          // additionalData: {
          //   comments: comments,
          //   rfiSubmitDateTime: rfiSubmitDateTime
          // }
        },
      }),
    );
  };

  const onGenerateReport = () => {
    dispatch(
      generateTestRFIReport({
        projectId: loggedInUser.projectId,
        rfiId: selectedRFI._id,
      }),
    );
  };

  const calculatedHeight = height * 0.6;
  // Rfi

  const [sampleTestItems, setSampleTestItems]: any[] = useState([]);
  const [data, setData]: any[] = useState({
    dateOfTesting: '',
    sampleBy: '',
    testConductedBy: '',
    roomTemperature: '',
    humidity: '',
    typeOfConcreteSurface: '',
  });

  const [selectedTestType, setSelectedTestType] = useState("field-lab-test");

  const renderdata = (selectedRFI: any) => {
    return (
      <>
        <View style={{flexDirection: 'column', marginBottom: 10}}>
          <Text style={styles.GenerateRFIFieldLabel}>Date of Testing</Text>
          <Text>{selectedRFI?.metaData.dateOfTesting}</Text>
        </View>
        {selectedRFI.metaData.sampleBy !== '' && (
          <View style={{flexDirection: 'column', marginBottom: 10}}>
            <Text style={styles.GenerateRFIFieldLabel}>Sample By</Text>
            <Text>{selectedRFI?.metaData.sampleBy}</Text>
          </View>
        )}
        {selectedRFI.metaData.testConductedBy !== '' && (
          <View style={{flexDirection: 'column', marginBottom: 10}}>
            <Text style={styles.GenerateRFIFieldLabel}>Test Conducted By</Text>
            <Text>{selectedRFI?.metaData.testConductedBy}</Text>
          </View>
        )}
        <View style={{flexDirection: 'column', marginBottom: 10}}>
          <Text style={styles.GenerateRFIFieldLabel}>Room Temperature</Text>
          <Text>{selectedRFI?.metaData.roomTemperature}</Text>
        </View>
        <View style={{flexDirection: 'column', marginBottom: 10}}>
          <Text style={styles.GenerateRFIFieldLabel}>Humidity</Text>
          <Text>{selectedRFI?.metaData.humidity}</Text>
        </View>
        {selectedRFI.metaData.typeOfConcreteSurface !== '' && (
          <View style={{flexDirection: 'column', marginBottom: 10}}>
            <Text style={styles.GenerateRFIFieldLabel}>
              Type Of Concrete Surface
            </Text>
            <Text>{selectedRFI?.metaData.typeOfConcreteSurface}</Text>
          </View>
        )}
      </>
    );
  };

  // Function to render each list item
  const taskForm = (selectedRFI: any) => {
    const selectedTestSample = selectedRFI.testTypeId;

    const data = selectedRFI.metaData.observations;
    // console.log(selectedTestSample.type);
    // console.log(data);
    // console.log(typeof data);
    if (selectedTestSample.type === TEST_TYPES.BINDER_CONTENT) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: any) => (
            <View key={sampleIndex}>
              {/* <Text style={styles.observationSampleNumberTitle}>
                {sample.sampleNo.title}: {sample.sampleNo.value}
              </Text> */}
              <Text style={styles.observationSampleNumberTitle}>
                Grade of Bitumen:
                {sample.otherInfo.gradeOfBitumen}
              </Text>
              <Text style={styles.observationSampleNumberTitle}>
                Source of Bitumen: {sample.otherInfo.sourceOfBitumen}
              </Text>
              <Text style={styles.observationSampleNumberTitle}>
                Source of Aggregate: {sample.otherInfo.sourceOfAggregate}
              </Text>
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: any, index: any) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {sample.details.values.map((row: any, rowIndex: any) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.description}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test1}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test2}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test3}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (
      selectedTestSample.type === TEST_TYPES.PERCENTAGE_OF_FRACTURE_FACE
    ) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: any) => (
            <View key={sampleIndex}>
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: any, index: any) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {sample.details.values.map((row: any, rowIndex: any) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.testProperty}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test1}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test2}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test3}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.SAND_EQUIVALENT) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: any) => (
            <View key={sampleIndex}>
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: any, index: any) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {sample.details.values.map((row: any, rowIndex: any) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.testProperty}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test1}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test2}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test3}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (
      selectedTestSample.type === TEST_TYPES.MICRO_SURFACING_GRADATION
    ) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: any) => (
            <View key={sampleIndex}>
              <Text style={styles.observationSampleNumberTitle}>
                Type: {sample.otherInfo.type}
              </Text>
              <Text style={styles.observationSampleNumberTitle}>
                Total in Gram: {sample.totalInGram}
              </Text>

              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: any, index: any) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {sample.details.values.map((row: any, rowIndex: any) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.sieveSize}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.weightRetained}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (
      selectedTestSample.type === TEST_TYPES.WATER_ABSORPTION_OF_AGGREGATES
    ) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: any) => (
            <View key={sampleIndex}>
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: any, index: any) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {sample.details.values.map((row: any, rowIndex: any) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.testProperty}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test1}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test2}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test3}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.PENETRATION_TEST) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              {/* Sample Number */}
              <Text style={styles.observationSampleNumberTitle}>
                Grade of Bitumen:{sample.otherInfo.gradeOfBitumen}
              </Text>

              {/* Additional properties */}
              <Text style={styles.observationSampleNumberTitle}>
                Pouring Temp: {sample.pouringTemp}
              </Text>
              <Text style={styles.observationSampleNumberTitle}>
                Period Cooling Temp: {sample.periodCoolingTemp}
              </Text>
              <Text style={styles.observationSampleNumberTitle}>
                Period Cooling In Water: {sample.periodCoolingInWater}
              </Text>

              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.testNumber}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.initialDialReading}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.finalDialReading}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.DUCTILITY_TEST) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              {/* Sample Number */}
              {/* <Text style={styles.observationSampleNumberTitle}>
                {sample.sampleNo.title}: {sample.sampleNo.value}
              </Text> */}
              <Text style={styles.observationSampleNumberTitle}>
                Grade of Bitumen:{sample.otherInfo.gradeOfBitumen}
              </Text>
              {/* Additional properties */}
              <Text style={styles.observationSampleNumberTitle}>
                Pouring of Cooling Air: {sample.pouringOfCoolingAir}
              </Text>
              <Text style={styles.observationSampleNumberTitle}>
                Period Cooling Before Trimming:{' '}
                {sample.periodCoolintBeforeTrimming}
              </Text>
              <Text style={styles.observationSampleNumberTitle}>
                Period Cooling After Trimming:{' '}
                {sample.periodCoolingAfterTriming}
              </Text>

              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.testProperty}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test1}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test2}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test3}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.FLASH_FIRE_POINTS) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              <Text style={styles.observationSampleNumberTitle}>
                Grade of Bitumen:{sample.otherInfo.gradeOfBitumen}
              </Text>
              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.testProperty}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test1}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test2}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test3}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.SOFTENING_POINT) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              <Text style={styles.observationSampleNumberTitle}>
                Grade of Bitumen:{sample.otherInfo.gradeOfBitumen}
              </Text>
              {/* Pouring Temperature */}
              <Text style={styles.observationSampleNumberTitle}>
                Pouring Temperature: {sample.pouringTemp}
              </Text>

              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.timeInMin}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.ballNumber1Temp} °C</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.ballNumber2Temp} °C</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (
      selectedTestSample.type === TEST_TYPES.DENSITY_OF_COMPACTED_LAYER
    ) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              {/* Sample Number */}
              <Text style={styles.observationSampleNumberTitle}>
                {sample.sampleNo.value}
              </Text>

              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.description}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test1}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test2}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test3}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (
      selectedTestSample.type === TEST_TYPES.STABILITY_AND_VOID_ANALYSIS
    ) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.description}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test1}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test2}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test3}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.MIX_GRADING) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              {/* Total Weight */}
              <Text style={styles.observationSampleNumberTitle}>
                Total in Gram: {sample.totalInGram}
              </Text>

              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.sieveSize}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.weightRetained}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.MOISTURE_CONTENT) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              <Text style={styles.observationSampleNumberTitle}>
                Type of Method Used :{sample.otherInfo.methodUsed}
              </Text>
              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.description}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test1}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test2}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test3}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.FREE_SWELL_INDEX) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: any) => (
            <View key={sampleIndex}>
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: any, index: any) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {sample.details.values.map((row: any, rowIndex: any) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.slNo}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.sampleLevelInWater}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.sampleLevelInKerosene}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.GRAIN_SIZE_ANALYSIS) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              <Text style={styles.observationSampleNumberTitle}>
                Total in Gram: {sample.totalInGram}
              </Text>

              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.description}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test1}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test2}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test3}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test4}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test5}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test6}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.PROCTOR_DENSITY_TEST) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              <Text style={styles.observationSampleNumberTitle}>
                Proposed Height of Embankment (m) :
                {sample.otherInfo.proposedHeightEmbankment}
              </Text>
              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.isSieveSize}</Text>
                  </View>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationValueColumn,
                    ]}>
                    <Text>{row.weightRetained}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.FIELD_DRY_DENSITY) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              <Text style={styles.observationSampleNumberTitle}>
                Bulk Density of sand (Ys) in gmm/cc:
                {sample.otherInfo.bulkDensitySand}
              </Text>
              <Text style={styles.observationSampleNumberTitle}>
                Test Pit chainage: {sample.otherInfo.testPitChainage}
              </Text>
              <Text style={styles.observationSampleNumberTitle}>
                Side (LHS/RHS): {sample.otherInfo.sideLhsRhs}
              </Text>
              <Text style={styles.observationSampleNumberTitle}>
                Offset from Centre line (m): {sample.otherInfo.offsetCentreLine}
              </Text>
              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.description}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test1}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test2}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.test3}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.PLASTICITY_INDEX) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.description}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.l1}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.ll2}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.ll3}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.ll4}</Text>
                  </View>
                  {row.pl1 && (
                    <View style={styles.observationValueColumn}>
                      <Text>{row.pl1}</Text>
                    </View>
                  )}
                  {row.pl2 && (
                    <View style={styles.observationValueColumn}>
                      <Text>{row.pl2}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.ATTERBEG_LIMIT_TEST) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.description}</Text>
                  </View>
                  {/* Dynamically map all values */}
                  {Object.keys(row)
                    .filter(key => key !== 'description') // Exclude description field
                    .map((key, index) => (
                      <View key={index} style={styles.observationValueColumn}>
                        <Text>{row[key]}</Text>
                      </View>
                    ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.GRADING_OF_AGGREGATE) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              {/* Sample Number */}
              <Text style={styles.observationSampleNumberTitle}>
                {sample.sampleNo.title}: {sample.sampleNo.value}
              </Text>

              {/* Total Weight */}
              <Text style={styles.observationSampleNumberTitle}>
                Total in Gram: {sample.totalInGram}
              </Text>

              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.isSieveSize}</Text>
                  </View>
                  <View style={styles.observationValueColumn}>
                    <Text>{row.weightRetained}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.FI_EI) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.sizeFractionOfAggregatePassing}</Text>
                  </View>
                  <View style={styles.observationTableCell}>
                    <Text>{row.sizeFractionOfAggregateRetained}</Text>
                  </View>
                  <View style={styles.observationTableCell}>
                    <Text>{row.totalWeightOfAggregateRetained}</Text>
                  </View>
                  <View style={styles.observationTableCell}>
                    <Text>{row.weightPassingOnFlakinessGauge}</Text>
                  </View>
                  <View style={styles.observationTableCell}>
                    <Text>{row.weightRetainedOnElongationGauge}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    } else if (selectedTestSample.type === TEST_TYPES.AGGREGATE_IMPACT_VALUE) {
      return (
        <View style={styles.observationTableContainer}>
          {data.map((sample: any, sampleIndex: number) => (
            <View key={sampleIndex}>
              {/* Table Headers */}
              <View style={styles.observationTableRow}>
                {sample.details.titles.map((title: string, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.observationTableCell,
                      index === 0
                        ? styles.observationDescriptionColumn
                        : styles.observationValueColumn,
                    ]}>
                    <Text style={styles.observationColumnHeader}>{title}</Text>
                  </View>
                ))}
              </View>

              {/* Table Data */}
              {sample.details.values.map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={styles.observationTableRow}>
                  <View
                    style={[
                      styles.observationTableCell,
                      styles.observationDescriptionColumn,
                    ]}>
                    <Text>{row.description}</Text>
                  </View>
                  <View style={styles.observationTableCell}>
                    <Text>{row.test1}</Text>
                  </View>
                  <View style={styles.observationTableCell}>
                    <Text>{row.test2}</Text>
                  </View>
                  <View style={styles.observationTableCell}>
                    <Text>{row.test3}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    }
  };

  // const LabWorkDropDown = () => {
    

  //   return (
      
  //   );
  // }

  return (
    <View>
      <View style={commonStyles.toggleContainer}>
        <TouchableOpacity
          style={[commonStyles.toggleButton, selectedTestType === "field-lab-test" && commonStyles.activeToggleButton]}
          onPress={() => setSelectedTestType("field-lab-test")}
        >
          <Text style={[commonStyles.toggleText, selectedTestType === "field-lab-test" && commonStyles.activeToggleText]}>
            Lab Test
          </Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          style={[commonStyles.toggleButton, selectedTestType === "third-party-lab-test" && commonStyles.activeToggleButton]}
          onPress={() => setSelectedTestType("third-party-lab-test")}
        >
          <Text style={[commonStyles.toggleText, selectedTestType === "third-party-lab-test" && commonStyles.activeToggleText]}>
            Third Party Test 
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.headerText}> Recent {getRFIType()} RFI's</Text>
      <View style={styles.recentWorkContainer}>
        <View style={styles.recentWorkHead}>
          <Text style={styles.headerText}>
            Recent RFI's (<Text style={styles.taskCount}>{rfiData.length}</Text>
            )
          </Text>
        </View>
        <View
          style={[
            props.rfiType === RFIs_TYPE.GENERATE
              ? styles.recentWorkContent
              : styles.recentWorkContentHeight100,
            {height: calculatedHeight},
          ]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {rfiData.map((item: any, index) => (
              <TouchableOpacity
                style={styles.recentWorkCard}
                onPress={() => onSelectRFI(item)}>
                <View
                  style={[
                    styles.taskCategory,
                    {flexWrap: 'wrap', paddingBottom: 10},
                  ]}>
                  <Text style={styles.subHead}>{item.name}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View>
                    <Text style={[styles.dateText, styles.fontBold]}>
                      Generated Date
                    </Text>
                    <Text style={[styles.dateText, styles.subFontText]}>
                      {getDisplayDate(item.rfiDateTime)}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.dateText, styles.fontBold]}>
                      Generated Time
                    </Text>
                    <Text style={[styles.dateText, styles.subFontText]}>
                      {/* {getDisplayTime(item.rfiDateTime)} */}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {!rfiData.length && !loading && (
              <View style={styles.noDataContainer}>
                <Image
                  style={styles.noDataImage}
                  source={require('../../images/no-data-found.png')}
                />
                <Text style={styles.noDataHeadText}>
                  No {getRFIType()} RFI's
                </Text>
                <Text style={styles.noDataSubText}>
                  There is no {getRFIType()?.toLowerCase()} RFI's
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
        {props.rfiType === RFIs_TYPE.GENERATE && (
          <View style={styles.footerButton}>
            <TouchableOpacity
              style={styles.btnCta}
              onPress={() =>
                navigation.navigate('RFIsGenerateMyQuality', {
                  rfiType: props.rfiType,
                  testType: selectedTestType
                })
              }>
              <Text style={styles.btnCtaText}>Generate RFI's</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={openPopup}
        onRequestClose={() => {
          setOpenPopup(!openPopup);
          setSelectedRFI(null);
          setPdfSource(null);
        }}>
        <View style={styles.bodyPopup}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.ModalHeader}>
                <Text style={styles.modalText}>{getRFIType()} RFI</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => {
                    setOpenPopup(!openPopup);
                    setSelectedRFI(null);
                    setPdfSource(null);
                  }}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              {selectedRFI && !pdfSource && (
                <View style={styles.ModalInnerContainer}>
                  <View
                    style={[
                      styles.taskCategory,
                      {flexWrap: 'wrap', paddingBottom: 20, paddingTop: 10},
                    ]}>
                    <Text style={[styles.subHead, styles.taskCount]}>
                      {selectedRFI?.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View>
                      <Text style={[styles.dateText, styles.fontBold]}>
                        Generated Date
                      </Text>
                      <Text style={[styles.dateText, styles.subFontText]}>
                        {getDisplayDate(selectedRFI.rfiDateTime)}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.dateText, styles.fontBold]}>
                        Generated Time
                      </Text>
                      <Text style={[styles.dateText, styles.subFontText]}>
                        {getDisplayTime(selectedRFI.rfiDateTime)}
                      </Text>
                    </View>
                  </View>
                  <ScrollView style={{paddingTop: 10, height: 500}}>
                    <Fragment>
                      <SafeAreaView>
                        {props.rfiType !== RFIs_TYPE.GENERATE && (
                          <View>
                            {/* <Text style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }} ></Text> */}
                            {renderdata(selectedRFI)}
                            {taskForm(selectedRFI)}
                          </View>
                        )}
                      </SafeAreaView>
                    </Fragment>
                  </ScrollView>
                  {props.rfiType === RFIs_TYPE.GENERATE && (
                    <View
                      style={[styles.btnParentSection, styles.ButtonPosition]}>
                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => onRFIAction(RFI_STATUS.CANCELLED)}>
                        <Text style={styles.submitButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {props.rfiType === RFIs_TYPE.CLOSED && (
                    <View
                      style={[styles.btnParentSection, styles.ButtonPosition]}>
                      <TouchableOpacity
                        style={[styles.submitButton, styles.rejectRfis]}
                        onPress={() => onRFIAction(RFI_STATUS.REJECTED)}>
                        <Text style={styles.submitButtonText}>Reject</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.submitButton, styles.saveButtonColor]}
                        onPress={() => onRFIAction(RFI_STATUS.APPROVED)}>
                        <Text style={styles.submitButtonText}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {props.rfiType === RFIs_TYPE.APPROVED && (
                    <View
                      style={[styles.btnParentSection, styles.ButtonPosition]}>
                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => onGenerateReport()}>
                        <Text style={styles.submitButtonText}>
                          Generate Report
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {props.rfiType === RFIs_TYPE.REJECTED && (
                    <View
                      style={[styles.btnParentSection, styles.ButtonPosition]}>
                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => onRFIAction(RFI_STATUS.RE_GENERATED)}>
                        <Text style={styles.submitButtonText}>Re-generate</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {pdfSource && (
                <View style={styles.containerPdf}>
                  <Pdf
                    source={pdfSource}
                    onLoadComplete={(numberOfPages, filePath) => {
                      console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                      console.log(`Current page: ${page}`);
                    }}
                    onError={error => {
                      console.log(error);
                    }}
                    onPressLink={uri => {
                      console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <LoadingAnimation loading={loading}></LoadingAnimation>
    </View>
  );
};

const styles = StyleSheet.create({
  ButtonPosition: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginHorizontal: -15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRightWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: '500',
    borderLeftWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: 120,
    textAlign: 'center',
    height: '100%',
    alignContent: 'center',
  },
  cell: {
    width: 120,
    paddingVertical: 7,
    textAlign: 'center',
  },
  fontBold: {
    fontWeight: '600',
  },
  containerPdf: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    height: Dimensions.get('screen').height - 200,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  headerText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  recentWorkContainer: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 15,
    height: '80%',
  },
  recentWorkHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#DEE1E7',
    padding: 20,
  },
  taskCount: {
    color: '#1C58C0',
  },
  recentWorkContent: {
    padding: 20,
    height: '90%',
  },
  recentWorkContentHeight100: {
    padding: 20,
    height: '100%',
  },
  recentWorkCard: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderStyle: 'solid',
    marginBottom: 15,
  },
  taskCategory: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 2,
    marginBottom: 5,
  },
  subHead: {
    color: '#150B3D',
    fontSize: 14,
    fontWeight: '600',
  },
  ArrowIcon: {
    width: 18,
    height: 18,
  },
  dateText: {
    color: '#150B3D',
    fontSize: 14,
    fontWeight: '300',
  },
  subFontText: {
    fontSize: 12,
    fontWeight: '400',
  },
  footerButton: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: -20,
  },
  btnCta: {
    borderRadius: 10,
    backgroundColor: '#1C58C0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCtaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  noDataContainer: {
    marginVertical: 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataHeadText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#34343F',
  },
  noDataSubText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#464665',
    marginTop: 10,
  },
  noDataImage: {
    width: 245,
    height: 184,
    marginBottom: 15,
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
    paddingBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#27272A',
    marginLeft: 5,
  },
  submitButton: {
    minWidth: 120,
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
  rejectRfis: {
    backgroundColor: '#FF0000',
  },
  saveButtonColor: {
    backgroundColor: '#5eab4b',
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
    height: Dimensions.get('screen').height - 50,
    width: Dimensions.get('screen').width,
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  images: {
    width: 500,
    height: 400,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3,
  },
  btnParentSection: {
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

  GenerateRFIFieldLabel: {
    fontSize: 16,
    color: '#150A33',
    fontWeight: '500',
  },
  GenerateRFIFieldTextInput: {
    width: 295,
    height: 40,
    fontSize: 12,
    color: '#666666',
    backgroundColor: '#99ABC6',
  },
  assignTagButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
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
  //input styles
  observationTableContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  observationSampleNumberTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  observationTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  observationTableCell: {
    padding: 8,
  },
  observationDescriptionColumn: {
    flex: 2,
  },
  observationValueColumn: {
    flex: 1,
    alignItems: 'center',
  },
  observationColumnHeader: {
    fontWeight: 'bold',
  },
});

export default RFIsRecentsMyQuality;
