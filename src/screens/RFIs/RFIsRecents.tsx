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
import {RFI_STATUS, RFIs_TYPE, TASK_TYPES} from '../../constants/constants';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import React, {Fragment, useEffect, useState} from 'react';
import {
  actionGetRFIs,
  clearRFITasksEvent,
  generateRFIReport,
  updatedRFIs,
} from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import Pdf from 'react-native-pdf';
import {SwipeListView} from 'react-native-swipe-list-view';
import {getDisplayDate, getDisplayTime} from '../../utils/Utils';
const {height} = Dimensions.get('window');

const RFIsRecents = (props: any) => {
  const navigation = useNavigation();

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
      getRFIsData();
      setPdfSource(null);
    }
  }, [focus]);

  const getRFIsData = () => {
    dispatch(
      actionGetRFIs({
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
    // if (status === RFI_STATUS.APPROVED) {
    //   if (!rfiDate) {
    //     Alert.alert('Error', 'Approval Date is required.');
    //     return false;
    //   }
    // }

    // let rfiSubmitDateTime = '';
    // let rfiTime = '';
    // if (rfiDate) {
    //   if (timeFormat === 'PM') {
    //     if (Number(hour) === 12) {
    //       rfiTime = hour + ':' + minute;
    //     } else {
    //       rfiTime = (Number(hour) + 12) + ':' + minute;
    //     }
    //   } else {
    //     if (Number(hour) === 12) {
    //       rfiTime = '00:' + minute;
    //     } else {
    //       rfiTime = hour + ':' + minute;
    //     }
    //   }

    //   rfiSubmitDateTime = rfiDate + ' ' + rfiTime + ":00"
    // }

    dispatch(
      updatedRFIs({
        projectId: loggedInUser.projectId,
        projectModuleId: selectedRFI.projectModuleId,
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
      generateRFIReport({
        projectId: loggedInUser.projectId,
        projectModuleId: selectedRFI.projectModuleId,
        rfiId: selectedRFI._id,
      }),
    );
  };

  const openCloseCalendar = () => {
    setOpenCalendar(!openCalendar);
    // if (!openCalendar) {
    //   setLayoutHeight(DEFAULT_COMPONENT_HEIGHT + DEFAULT_CALENDAR_HEIGHT)
    // } else {
    //   setLayoutHeight(DEFAULT_COMPONENT_HEIGHT)
    // }
  };
  const calculatedHeight = height * 0.6;
  // const getHours = () => {
  //   let hours = [];
  //   for (let i = 1; i <= 12; i++) {
  //     hours.push({
  //       label: i < 10 ? '0' + i : '' + i,
  //       value: i < 10 ? '0' + i : '' + i
  //     });
  //   }
  //   setHours(hours);
  // }

  // const getMins = () => {
  //   let mins = [];
  //   for (let i = 0; i < 60; i = i + 10) {
  //     mins.push({
  //       label: i < 10 ? '0' + i : '' + i,
  //       value: i < 10 ? '0' + i : '' + i
  //     });
  //   }
  //   setMinutes(mins);
  // }

  // const getTimeFormats = () => {
  //   setTimeFormats([{
  //     label: 'AM',
  //     value: 'AM'
  //   }, {
  //     label: 'PM',
  //     value: 'PM'
  //   }]);
  // }

  // Function to render each list item
  const renderItem = (rowData: any) => (
    <View style={{flexDirection: 'column', gap: 5}}>
      {rowData.index === 0 && (
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>TM No.</Text>
          <Text style={styles.headerCell}>Last 4 digits of Vehicle No.</Text>
          <Text style={styles.headerCell}>Time of arrival</Text>
          <Text style={styles.headerCell}>Grade of Concrete</Text>
          <Text style={styles.headerCell}>Concrete temp in C</Text>
          <Text style={styles.headerCell}>Slump value in mm</Text>
          <Text style={styles.headerCell}>Concrete start time</Text>
          <Text style={styles.headerCell}>Concrete poured in cum</Text>
          <Text style={styles.headerCell}>Concrete finish time</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.cell}>TM {rowData.index + 1}</Text>
        <Text style={styles.cell}>{rowData.item.vehicleNo}</Text>
        <Text style={styles.cell}>{rowData.item.timeOfArrival}</Text>
        <Text style={styles.cell}>{rowData.item.gradeOfConcrete}</Text>
        <Text style={styles.cell}>{rowData.item.concreteTemp}</Text>
        <Text style={styles.cell}>{rowData.item.slumpValue}</Text>
        <Text style={styles.cell}>{rowData.item.noOfCubesCasted}</Text>
        <Text style={styles.cell}>{rowData.item.concreteStartTime}</Text>
        <Text style={styles.cell}>{rowData.item.concretePoured}</Text>
        <Text style={styles.cell}>{rowData.item.concreteFinishTime}</Text>
      </View>
    </View>
  );

  const renderSectionHeader = (rowData: any) => {
    return (
      <View>
        <View>
          <Text>TM No.</Text>
        </View>
        <View>
          <Text>Last 4 digits of Vehicle No.</Text>
        </View>
        <View>
          <Text>Time of arrival</Text>
        </View>
        <View>
          <Text>Grade of Concrete</Text>
        </View>
        <View>
          <Text>Concrete temp in C</Text>
        </View>
        <View>
          <Text>Slump value in mm</Text>
        </View>
        <View>
          <Text>Concrete start time</Text>
        </View>
        <View>
          <Text>Concrete poured in cum</Text>
        </View>
        <View>
          <Text>Concrete finish time</Text>
        </View>
      </View>
    );
  };

  const renderItemPCCLevelling = (rowData: any) => (
    <View style={{flexDirection: 'column', gap: 5}}>
      {rowData.index === 0 && (
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>TM No.</Text>
          <Text style={styles.headerCell}>Last 4 digits of Vehicle No.</Text>
          <Text style={styles.headerCell}>Time of arrival</Text>
          <Text style={styles.headerCell}>Grade of Concrete</Text>
          <Text style={styles.headerCell}>Concrete start time</Text>
          <Text style={styles.headerCell}>Concrete poured in cum</Text>
          <Text style={styles.headerCell}>Concrete finish time</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.cell}>TM {rowData.index + 1}</Text>
        <Text style={styles.cell}>{rowData.item.vehicleNo}</Text>
        <Text style={styles.cell}>{rowData.item.timeOfArrival}</Text>
        <Text style={styles.cell}>{rowData.item.gradeOfConcrete}</Text>
        <Text style={styles.cell}>{rowData.item.noOfCubesCasted}</Text>
        <Text style={styles.cell}>{rowData.item.concreteStartTime}</Text>
        <Text style={styles.cell}>{rowData.item.concretePoured}</Text>
        <Text style={styles.cell}>{rowData.item.concreteFinishTime}</Text>
      </View>
    </View>
  );

  const renderSectionHeaderPCCLevelling = (rowData: any) => {
    return (
      <View>
        <View>
          <Text>TM No.</Text>
        </View>
        <View>
          <Text>Last 4 digits of Vehicle No.</Text>
        </View>
        <View>
          <Text>Time of arrival</Text>
        </View>
        <View>
          <Text>Grade of Concrete</Text>
        </View>
        <View>
          <Text>Concrete start time</Text>
        </View>
        <View>
          <Text>Concrete poured in cum</Text>
        </View>
        <View>
          <Text>Concrete finish time</Text>
        </View>
      </View>
    );
  };
  const renderItemPrestressing = (rowData: any) => (
    <View style={{flexDirection: 'column', gap: 5}}>
      {rowData.index === 0 && (
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Cable No.</Text>
          <Text style={styles.headerCell}>Stressing Sequence</Text>
          <Text style={styles.headerCell}>Gauge A0 (100 Kg/cm²)</Text>
          <Text style={styles.headerCell}>Gauge B0 (100 Kg/cm²)</Text>
          <Text style={styles.headerCell}>Gauge A1 (200 Kg/cm²)</Text>
          <Text style={styles.headerCell}>Gauge B1 (200 Kg/cm²)</Text>
          <Text style={styles.headerCell}>Gauge A2 (Locking)</Text>
          <Text style={styles.headerCell}>Pressure PA (Locking)</Text>
          <Text style={styles.headerCell}>Gauge B2 (Locking)</Text>
          <Text style={styles.headerCell}>Pressure PB (Locking)</Text>
          <Text style={styles.headerCell}>Slip SA0 (Locking)</Text>
          <Text style={styles.headerCell}>Slip SB0 (Locking)</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.cell}>{rowData.item.cableNo}</Text>
        <Text style={styles.cell}>{rowData.item.stressingSequence}</Text>
        <Text style={styles.cell}>{rowData.item.gaugeA0}</Text>
        <Text style={styles.cell}>{rowData.item.gaugeB0}</Text>
        <Text style={styles.cell}>{rowData.item.gaugeA1}</Text>
        <Text style={styles.cell}>{rowData.item.gaugeB1}</Text>
        <Text style={styles.cell}>{rowData.item.gaugeA2}</Text>
        <Text style={styles.cell}>{rowData.item.pressurePA}</Text>
        <Text style={styles.cell}>{rowData.item.gaugeB2}</Text>
        <Text style={styles.cell}>{rowData.item.pressurePB}</Text>
        <Text style={styles.cell}>{rowData.item.slipSA0}</Text>
        <Text style={styles.cell}>{rowData.item.slipSB0}</Text>
      </View>
    </View>
  );

  const renderSectionHeaderPrestressing = (rowData: any) => (
    <View>
      <View>
        <Text>Cable No.</Text>
      </View>
      <View>
        <Text>Stressing Sequence</Text>
      </View>
      <View>
        <Text>Gauge A0 (100 Kg/cm²)</Text>
      </View>
      <View>
        <Text>Gauge B0 (100 Kg/cm²)</Text>
      </View>
      <View>
        <Text>Gauge A1 (200 Kg/cm²)</Text>
      </View>
      <View>
        <Text>Gauge B1 (200 Kg/cm²)</Text>
      </View>
      <View>
        <Text>Gauge A2 (Locking)</Text>
      </View>
      <View>
        <Text>Pressure PA (Locking)</Text>
      </View>
      <View>
        <Text>Gauge B2 (Locking)</Text>
      </View>
      <View>
        <Text>Pressure PB (Locking)</Text>
      </View>
      <View>
        <Text>Slip SA0 (Locking)</Text>
      </View>
      <View>
        <Text>Slip SB0 (Locking)</Text>
      </View>
    </View>
  );
  const renderSectionHeaderDumping = (rowData: any) => (
    <View>
      <View>
        <Text>TM Number</Text>
      </View>
      <View>
        <Text>Vehicle No</Text>
      </View>
      <View>
        <Text>Quantity Dumped</Text>
      </View>
      <View>
        <Text>Source</Text>
      </View>
      <View>
        <Text>Approved Source</Text>
      </View>
      <View>
        <Text>Contains Boulders</Text>
      </View>
    </View>
  );
  const renderSectionHeaderLayingOfDlc = (rowData: any) => (
    <View>
      <View>
        <Text>Serial No.</Text>
      </View>
      <View>
        <Text>Vehicle No.</Text>
      </View>
      <View>
        <Text>Total Qty of DLC (cum)</Text>
      </View>
      <View>
        <Text>Laying Start Time</Text>
      </View>
      <View>
        <Text>Laying End Time</Text>
      </View>
    </View>
  );

  const renderItemLayingOfDlc = (rowData: any) => (
    <View style={{flexDirection: 'column', gap: 5}}>
      {rowData.index === 0 && (
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Vehicle No</Text>
          <Text style={styles.headerCell}>Vehicle No</Text>
          <Text style={styles.headerCell}>Total Qty of DLC (cum)</Text>
          <Text style={styles.headerCell}>Laying Start Time</Text>
          <Text style={styles.headerCell}>Laying End Time</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.cell}>{rowData.index + 1}</Text> {/* Row Number */}
        <Text style={styles.cell}>{rowData.item.vehicleNo}</Text>
        <Text style={styles.cell}>{rowData.item.totalQtyDlc}</Text>
        <Text style={styles.cell}>{rowData.item.layingStartTime}</Text>
        <Text style={styles.cell}>{rowData.item.layingEndTime}</Text>
      </View>
    </View>
  );
  const renderItemDumping = (rowData: any) => (
    <View style={{flexDirection: 'column', gap: 5}}>
      {rowData.index === 0 && (
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>TM Number</Text>
          <Text style={styles.headerCell}>Vehicle No</Text>
          <Text style={styles.headerCell}>Quantity Dumped</Text>
          <Text style={styles.headerCell}>Source</Text>
          <Text style={styles.headerCell}>Approved Source</Text>
          <Text style={styles.headerCell}>Contains Boulders</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.cell}>{rowData.index + 1}</Text> {/* Row Number */}
        <Text style={styles.cell}>{rowData.item.vehicleNo}</Text>
        <Text style={styles.cell}>{rowData.item.qtyDumped}</Text>
        <Text style={styles.cell}>{rowData.item.source}</Text>
        <Text style={styles.cell}>
          {rowData.item.isApprovedSource ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.cell}>
          {rowData.item.containsBoulders === 'Y' ? 'Yes' : 'No'}
        </Text>
      </View>
    </View>
  );

  const renderItemGlueing = (rowData: any) => (
    <View style={{flexDirection: 'column', gap: 5}}>
      {rowData.index === 0 && (
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Joint Numbers</Text>
          <Text style={styles.headerCell}>Ambient Temperature</Text>
          <Text style={styles.headerCell}>Batch No Resin</Text>
          <Text style={styles.headerCell}>Batch No Hardener</Text>
          <Text style={styles.headerCell}>Mixing Start Time</Text>
          <Text style={styles.headerCell}>Mixing Finish Time</Text>
          <Text style={styles.headerCell}>Application Start Time</Text>
          <Text style={styles.headerCell}>Application Finish Time</Text>
          <Text style={styles.headerCell}>Segment Joining Time Closure</Text>
          <Text style={styles.headerCell}>
            Segment Joining Time Temporary Finish
          </Text>
          <Text style={styles.headerCell}>Segment Surface Area (SQM)</Text>
          <Text style={styles.headerCell}>
            Epoxy Consumption Theoretical Resin (Kgs)
          </Text>
          <Text style={styles.headerCell}>
            Epoxy Consumption Theoretical Hardener (Kgs)
          </Text>
          <Text style={styles.headerCell}>
            Epoxy Consumption Actual Resin (Kgs)
          </Text>
          <Text style={styles.headerCell}>
            Epoxy Consumption Actual Hardener (Kgs)
          </Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.cell}>{rowData.item.jointNumbers}</Text>
        <Text style={styles.cell}>{rowData.item.ambientTemperature}</Text>
        <Text style={styles.cell}>{rowData.item.batchNoResin}</Text>
        <Text style={styles.cell}>{rowData.item.batchNoHardener}</Text>
        <Text style={styles.cell}>{rowData.item.mixingStartTime}</Text>
        <Text style={styles.cell}>{rowData.item.mixingFinishTime}</Text>
        <Text style={styles.cell}>{rowData.item.applicationStartTime}</Text>
        <Text style={styles.cell}>{rowData.item.applicationFinishTime}</Text>
        <Text style={styles.cell}>
          {rowData.item.segmentJoiningTimeClosure}
        </Text>
        <Text style={styles.cell}>
          {rowData.item.segmentJoiningTimeTemporaryFinish}
        </Text>
        <Text style={styles.cell}>{rowData.item.segmentSurfaceArea}</Text>
        <Text style={styles.cell}>
          {rowData.item.epoxyConsumptionTheoreticalResin}
        </Text>
        <Text style={styles.cell}>
          {rowData.item.epoxyConsumptionTheoreticalHardener}
        </Text>
        <Text style={styles.cell}>
          {rowData.item.epoxyConsumptionActualResin}
        </Text>
        <Text style={styles.cell}>
          {rowData.item.epoxyConsumptionActualHardener}
        </Text>
      </View>
    </View>
  );
  const renderItemTorquing = (rowData: any) => (
    <View style={{flexDirection: 'column', gap: 5}}>
      {rowData.index === 0 && (
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Time</Text>
          <Text style={styles.headerCell}>Component</Text>
          <Text style={styles.headerCell}>Details of Joints</Text>
          <Text style={styles.headerCell}>Nos of Bolt</Text>
          <Text style={styles.headerCell}>Dia of Bolt in mm</Text>
          <Text style={styles.headerCell}>Size in mm</Text>
          <Text style={styles.headerCell}>Sl.No. of Invoice/MTC File</Text>
          <Text style={styles.headerCell}>Sl.No. of Torque Wrench</Text>
          <Text style={styles.headerCell}>Torque Applied</Text>
          <Text style={styles.headerCell}>Nos. of Refusals (3nos)</Text>
          <Text style={styles.headerCell}>Nos. of Refusals (4nos)</Text>
          <Text style={styles.headerCell}>Nos. of Refusals (5nos)</Text>
          <Text style={styles.headerCell}>Nos. of Refusals (6nos)</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.cell}>{rowData.item.date}</Text>
        <Text style={styles.cell}>{rowData.index.time}</Text>

        <Text style={styles.cell}>{rowData.item.component}</Text>
        <Text style={styles.cell}>{rowData.item.detailsOfJoints}</Text>
        <Text style={styles.cell}>{rowData.item.nosOfBolt}</Text>
        <Text style={styles.cell}>{rowData.item.diaOfBoltInMm}</Text>
        <Text style={styles.cell}>{rowData.item.sizeInMm}</Text>
        <Text style={styles.cell}>{rowData.item.slNoOfInvoiceMTCFile}</Text>
        <Text style={styles.cell}>{rowData.item.slNoOfTorqueWrench}</Text>
        <Text style={styles.cell}>{rowData.item.torqueApplied}</Text>
        <Text style={styles.cell}>{rowData.item.refusalsGauage3nos}</Text>
        <Text style={styles.cell}>{rowData.item.refusalsGauage4nos}</Text>
        <Text style={styles.cell}>{rowData.item.refusalsGauage5nos}</Text>
        <Text style={styles.cell}>{rowData.item.refusalsGauage6nos}</Text>
      </View>
    </View>
  );
  const renderSectionHeaderTorquing = (rowData: any) => {
    return (
      <View>
        <View>
          <Text>Date</Text>
        </View>
        <View>
          <Text>Time</Text>
        </View>
        <View>
          <Text>Component</Text>
        </View>
        <View>
          <Text>Details of Joints</Text>
        </View>
        <View>
          <Text>Nos of Bolt</Text>
        </View>
        <View>
          <Text>Dia of Bolt in mm</Text>
        </View>
        <View>
          <Text>Size in mm</Text>
        </View>
        <View>
          <Text>Sl.No. of Invoice/MTC File</Text>
        </View>
        <View>
          <Text>Sl.No. of Torque Wrench</Text>
        </View>
        <View>
          <Text>Torque Applied</Text>
        </View>
        <View>
          <Text>Nos. of Refusals (3nos)</Text>
        </View>
        <View>
          <Text>Nos. of Refusals (4nos)</Text>
        </View>
        <View>
          <Text>Nos. of Refusals (5nos)</Text>
        </View>
        <View>
          <Text>Nos. of Refusals (6nos)</Text>
        </View>
      </View>
    );
  };
  const renderItemTemporaryPrestressing = (rowData: any) => (
    <View style={{flexDirection: 'column', gap: 5}}>
      {rowData.index === 0 && (
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Joint Numbers</Text>
          <Text style={styles.headerCell}>Calibration Done</Text>
          <Text style={styles.headerCell}>
            Stressing Sequence Drawing Number
          </Text>
          <Text style={styles.headerCell}>Date of Prestressing</Text>
          <Text style={styles.headerCell}>Time of Prestressing</Text>
          <Text style={styles.headerCell}>Max Jack Pressure (Kg/Cm²)</Text>
          <Text style={styles.headerCell}>Jack Pressure Applied (Kg/Cm²)</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.cell}>{rowData.item.jointNumbers}</Text>
        <Text style={styles.cell}>{rowData.item.calibrationDone}</Text>
        <Text style={styles.cell}>
          {rowData.item.stressingSequenceDrawingNumber}
        </Text>
        <Text style={styles.cell}>{rowData.item.dateOfPrestressing}</Text>
        <Text style={styles.cell}>{rowData.item.timeOfPrestressing}</Text>
        <Text style={styles.cell}>{rowData.item.maxJackPressure}</Text>
        <Text style={styles.cell}>{rowData.item.jackPressureApplied}</Text>
      </View>
    </View>
  );
  const renderSectionHeaderTemporaryPrestressing = (rowData: any) => (
    <View>
      <View>
        <Text>Joint Numbers</Text>
      </View>
      <View>
        <Text>Calibration Done</Text>
      </View>
      <View>
        <Text>Stressing Sequence Drawing Number</Text>
      </View>
      <View>
        <Text>Date of Prestressing</Text>
      </View>
      <View>
        <Text>Time of Prestressing</Text>
      </View>
      <View>
        <Text>Max Jack Pressure (Kg/Cm²)</Text>
      </View>
      <View>
        <Text>Jack Pressure Applied (Kg/Cm²)</Text>
      </View>
    </View>
  );

  const renderSectionHeaderGlueing = (rowData: any) => {
    return (
      <View>
        <View>
          <Text>Joint Numbers</Text>
        </View>
        <View>
          <Text>Ambient Temperature</Text>
        </View>
        <View>
          <Text>Batch No Resin</Text>
        </View>
        <View>
          <Text>Batch No Hardener</Text>
        </View>
        <View>
          <Text>Mixing Start Time</Text>
        </View>
        <View>
          <Text>Mixing Finish Time</Text>
        </View>
        <View>
          <Text>Application Start Time</Text>
        </View>
        <View>
          <Text>Application Finish Time</Text>
        </View>
        <View>
          <Text>Segment Joining Time Closure</Text>
        </View>
        <View>
          <Text>Segment Joining Time Temporary Finish</Text>
        </View>
        <View>
          <Text>Segment Surface Area (SQM)</Text>
        </View>
        <View>
          <Text>Epoxy Consumption Theoretical Resin (Kgs)</Text>
        </View>
        <View>
          <Text>Epoxy Consumption Theoretical Hardener (Kgs)</Text>
        </View>
        <View>
          <Text>Epoxy Consumption Actual Resin (Kgs)</Text>
        </View>
        <View>
          <Text>Epoxy Consumption Actual Hardener (Kgs)</Text>
        </View>
      </View>
    );
  };

  const taskForm = (selectedRFI: any) => {
    switch (selectedRFI?.metaData?.taskName) {
      case TASK_TYPES.CNG_AND_SETTING_OUT:
      case TASK_TYPES.PLACING_OF_SHEATHING_DUCT:
      case TASK_TYPES.POST_CONCRETE_CHECK:
        return (
          <View style={styles.ImageSections}>
            <View>
              {selectedRFI?.metaData?.base64Image && renderFileData()}
            </View>
          </View>
        );
      case TASK_TYPES.FORM_WORK:
      case TASK_TYPES.PLACEMENT_OF_INNER_SHUTTERS:
      case TASK_TYPES.PLACEMENT_OF_SIDE_SHUTTERS:
      case TASK_TYPES.PLACEMENT_OF_BOTTOM_SHUTTER:
      case TASK_TYPES.PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Cleanliness and Oil application checked
              </Text>
              <Text>{selectedRFI?.metaData.cleanliness}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Formwork alignment checked
              </Text>
              <Text>{selectedRFI?.metaData.formworkAlignmentChecked}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Formwork tightness/sealing checked
              </Text>
              <Text>{selectedRFI?.metaData.formworkSealingChecked}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Required covers provided as per drawings checked
              </Text>
              <Text>{selectedRFI?.metaData.formworkdDrawingsChecked}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Concrete finish level marked
              </Text>
              <Text>{selectedRFI?.metaData.concreteFinishLevelMarked}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Formwork properly supported
              </Text>
              <Text>{selectedRFI?.metaData.formworkProperlySupported}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Formwork fit for concreting
              </Text>
              <Text>{selectedRFI?.metaData.formworkFitConcreting}</Text>
            </View>
          </View>
        );
      case TASK_TYPES.REINFORCEMENT:
      case TASK_TYPES.REINFORCEMENT_PREPARATION:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Rebar and dimension (dia,len and shape) checked as per GFC
              </Text>
              <Text>{selectedRFI?.metaData.rebarAndDimensionGFC}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Shaping, No and Length of Bars checked as per GFC
              </Text>
              <Text>{selectedRFI?.metaData.shapingNoAndLengthOfBarsGFC}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Rebars securely tightened/bound by tie bars
              </Text>
              <Text>{selectedRFI?.metaData.rebarsSecurelyTightened}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Splice length and location checked as per GFC
              </Text>
              <Text>{selectedRFI?.metaData.spliceLengthAndLocationGFC}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Rebar within tolerance limit
              </Text>
              <Text>{selectedRFI?.metaData.rebarWithinToleranceLimit}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Coupler arrangements within tolerance
              </Text>
              <Text>
                {selectedRFI?.metaData.couplerArrangementsWithinTolerance}
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Bar Bending schedule checked
              </Text>
              <Text>{selectedRFI?.metaData.barBendingScheduleChecked}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Spacer bar checked as per GFC
              </Text>
              <Text>{selectedRFI?.metaData.spacerBarCheckedGFC}</Text>
            </View>
          </View>
        );
      case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Rebar and dimension (dia,len and shape) checked as per GFC
              </Text>
              <Text>{selectedRFI?.metaData.rebarAndDimensionGFC}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Shaping, No and Length of Bars checked as per GFC
              </Text>
              <Text>{selectedRFI?.metaData.shapingNoAndLengthOfBarsGFC}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Rebars securely tightened/bound by tie bars
              </Text>
              <Text>{selectedRFI?.metaData.rebarsSecurelyTightened}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Splice length and location checked as per GFC
              </Text>
              <Text>{selectedRFI?.metaData.spliceLengthAndLocationGFC}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Rebar within tolerance limit
              </Text>
              <Text>{selectedRFI?.metaData.rebarWithinToleranceLimit}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Coupler arrangements within tolerance
              </Text>
              <Text>
                {selectedRFI?.metaData.couplerArrangementsWithinTolerance}
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Bar Bending schedule checked
              </Text>
              <Text>{selectedRFI?.metaData.barBendingScheduleChecked}</Text>
            </View>
          </View>
        );
      case TASK_TYPES.EXCAVATION:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Qty of earth work excavated in cum
              </Text>
              <Text>{selectedRFI?.metaData.quantity}</Text>
            </View>
          </View>
        );
      case TASK_TYPES.REMOVAL_OF_SIDE_SHUTTERS:
      case TASK_TYPES.REMOVAL_OF_MIDDLIE_TOP_SHUTTERS:
      case TASK_TYPES.REMOVAL_OF_INNER_SHUTTERS:
      case TASK_TYPES.REMOVAL_OF_SHUTTER:
      case TASK_TYPES.REMOVAL_OF_SHUTTERS:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Whether concrete has achieved desired strength
              </Text>
              <Text>
                {selectedRFI?.metaData.concreteHasAchievedDesiredStrength}
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Whether minimum time has been attained
              </Text>
              <Text>{selectedRFI?.metaData.minimumTimeHasBeenAttained}</Text>
            </View>
          </View>
        );
      case TASK_TYPES.COMPACTION:
        const compactionProperties = [
          {
            title: 'Uniform Sprinkling of Water Done if Required',
            key: 'uniformSprinkling',
          },
          {
            title: 'Loose Thickness of Layer Checked',
            key: 'looseThicknessChecked',
          },
          {
            title: 'OMC is Maintained Before Commencement of Rolling',
            key: 'omcMaintained',
          },
          {
            title: 'Suitable Roller Available for Compaction',
            key: 'suitableRollerAvailable',
          },
          {
            title: 'Number of Passes, Speed, and Rolling Pattern Followed',
            key: 'passesSpeedPatternFollowed',
          },
          {
            title: 'Finished Compacted Layer Thickness as Specified',
            key: 'compactedLayerThicknessSpecified',
          },
          {
            title: 'Any Localized Wet, Soft, or Under Compacted Area Found',
            key: 'localizedWetSoftAreaFound',
          },
          {
            title: 'Layer is Free from Segregation',
            key: 'layerFreeFromSegregation',
          },
          {
            title: 'Arrangement for Protection of Finished Surface Available',
            key: 'protectionForFinishedSurface',
          },
          {
            title: 'Any Non-conformance/Non-compliance Found',
            key: 'nonConformanceFound',
          },
          {
            title: 'Finished Compacted Layer Thickness in mm',
            key: 'compactedLayerThickness',
          },
        ];

        return (
          <View>
            {compactionProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.compactionData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );

      case TASK_TYPES.COMPACTING_GROUND_SUPPORT_FOR_EMBANKMENT:
      case TASK_TYPES.DEWATERING:
      case TASK_TYPES.PLACING_OF_COVER:
      case TASK_TYPES.FIXING_OF_SHEET:
      case TASK_TYPES.GRADING:
      case TASK_TYPES.THREADING_OF_PRE_STRESSING_STRANDS:
        return (
          <View>
            <Text>No Observations</Text>
          </View>
        );

      case TASK_TYPES.PROCUREMENT_OF_STRUCTURAL_STEEL:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Total qty of steel procured in tonne
              </Text>
              <Text>{selectedRFI?.metaData.totalQtyOfSteelProcured}</Text>
            </View>
          </View>
        );

      case TASK_TYPES.TRANSPORTATION_OF_MATERIAL:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Transit Time in hrs
              </Text>
              <Text>{selectedRFI?.metaData.transitTime}</Text>
            </View>
          </View>
        );
      case TASK_TYPES.CAGE_LOWERING:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Plie shaft cleaned of all loose material or not
              </Text>
              <Text>{selectedRFI?.metaData.plieShaftCleanedLooseMaterial}</Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Suitable spacer provided to maintain the required cover to steel
              </Text>
              <Text>
                {
                  selectedRFI?.metaData
                    .suitableSpacerProvidedToMaintainCoverToSteel
                }
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                No L bend at the bottom of the Cage checked or not
              </Text>
              <Text>{selectedRFI?.metaData.noLBendBottomOfTheCageChecked}</Text>
            </View>
          </View>
        );
      case TASK_TYPES.STITCH_CONCRETE:
        const stitchConcreteProperties = [
          {
            title: 'Grade of Concrete (Reference approved drawing)',
            key: 'gradeOfConcrete',
          },
          {
            title: 'Method statement is approved',
            key: 'methodStatementApproved',
          },
          {
            title: 'HT strands for all duct inserted before concreting',
            key: 'htStrandsInserted',
          },
          {
            title:
              'Water, sand, coarse aggregate, cement, admixture approved by IE',
            key: 'materialsApproved',
          },
          {
            title: 'Formwork approved by IE',
            key: 'formworkApproved',
          },
          {
            title: 'Reinforcement cage approved',
            key: 'reinforcementCageApproved',
          },
          {
            title: 'Concreting equipment is in proper working condition',
            key: 'equipmentWorking',
          },
          {
            title: 'Access provided',
            key: 'accessProvided',
          },
          {
            title: 'Safety arrangements are adequate',
            key: 'safetyArrangements',
          },
          {
            title: 'Heavy rainfall protection available',
            key: 'rainfallProtection',
          },
          {
            title: 'Needle Vibrators status',
            key: 'needleVibratorStatus',
          },
          {
            title: 'Needles vibrator’s nos and status',
            key: 'needleVibratorNos',
          },
          {
            title: 'Slump cone apparatus and sufficient Cube moulds available',
            key: 'slumpConeApparatusAvailable',
          },
          {
            title:
              'Start pre-stressing after getting strength 30 Mpa or 5 days',
            key: 'startPreStressing',
          },
          {
            title: 'Pre-stressing & Grouting format followed as per Spine',
            key: 'groutingFormatFollowed',
          },
        ];
        return (
          <View>
            {stitchConcreteProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.stitchConcreteData?.[property.key]}
                </Text>
              </View>
            ))}
            <ScrollView horizontal={true}>
              <View style={{flexDirection: 'column'}}>
                {
                  <SwipeListView
                    data={selectedRFI?.metaData.concreteData}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                  />
                }
              </View>
            </ScrollView>
          </View>
        );
      case TASK_TYPES.COPING:
      case TASK_TYPES.CONCRETING:
        return (
          <View>
            <ScrollView horizontal={true}>
              <View style={{flexDirection: 'column'}}>
                {
                  <SwipeListView
                    data={selectedRFI?.metaData.concreteData}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                  />
                }
              </View>
            </ScrollView>
          </View>
        );
      case TASK_TYPES.PCC_LEVELLING_COURSE:
        return (
          <View>
            <ScrollView horizontal={true}>
              <View style={{flexDirection: 'column'}}>
                {
                  <SwipeListView
                    data={selectedRFI?.metaData.concreteData}
                    renderItem={renderItemPCCLevelling}
                    renderSectionHeader={renderSectionHeaderPCCLevelling}
                  />
                }
              </View>
            </ScrollView>
          </View>
        );
      case TASK_TYPES.BORING_OF_PILE:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Density of Polymer in gm/ml
              </Text>
              <Text>
                {selectedRFI?.metaData.boringOfPileData?.densityOfPolymer}
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Viscosity of Polymer in sec/liter
              </Text>
              <Text>
                {selectedRFI?.metaData.boringOfPileData?.viscosityOfPolymer}
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                pH value of Polymer
              </Text>
              <Text>
                {selectedRFI?.metaData.boringOfPileData?.valueOfPolymer}
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Sand content of Polymer in %
              </Text>
              <Text>
                {selectedRFI?.metaData.boringOfPileData?.contentOfPolymer}
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Depth of Bore in m
              </Text>
              <Text>{selectedRFI?.metaData.boringOfPileData?.depthOfBore}</Text>
            </View>
          </View>
        );
      case TASK_TYPES.FLUSHING_OPERATIONS:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Start time of flushing
              </Text>
              <Text>
                {
                  selectedRFI?.metaData.flushingOperationsData
                    ?.startTimeOfFlushing
                }
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Finish time of flushing
              </Text>
              <Text>
                {
                  selectedRFI?.metaData.flushingOperationsData
                    ?.finishTimeOfFlushing
                }
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Whether Pour cleared or not
              </Text>
              <Text>
                {
                  selectedRFI?.metaData.flushingOperationsData
                    ?.whetherPourCleared
                }
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Density of Polymer in gm/ml
              </Text>
              <Text>
                {selectedRFI?.metaData.flushingOperationsData?.densityOfPolymer}
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Viscosity of Polymer in sec/liter
              </Text>
              <Text>
                {
                  selectedRFI?.metaData.flushingOperationsData
                    ?.viscosityOfPolymer
                }
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                pH value of Polymer
              </Text>
              <Text>
                {selectedRFI?.metaData.flushingOperationsData?.valueOfPolymer}
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Sand content of Polymer in %
              </Text>
              <Text>
                {selectedRFI?.metaData.flushingOperationsData?.contentOfPolymer}
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Depth of Bore in m
              </Text>
              <Text>
                {selectedRFI?.metaData.flushingOperationsData?.depthOfBore}
              </Text>
            </View>
          </View>
        );
      case TASK_TYPES.CHIPPING_AND_REMOVAL_OF_CONCRETE_ABOVE_CUT_OFF_LEVEL:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                No. of days of chipping after casting of concrete
              </Text>
              <Text>
                {
                  selectedRFI?.metaData.chippingAndRemovalOfConcreteData
                    ?.noOfDaysOfChipping
                }
              </Text>
            </View>
          </View>
        );
      case TASK_TYPES.GROUTING:
        const groutingProperties = [
          {title: 'Inlet free of blockage', key: 'inletFree'},
          {title: 'Outlet free of blockage', key: 'outletFree'},
          {title: 'Vents free of blockage', key: 'ventsFree'},
          {title: 'Cable Duct free of blockage', key: 'cableDuctFree'},
          {title: 'Leakage observed', key: 'leakageObserved'},
          {title: 'Sealed', key: 'sealed'},
          {title: 'Remedial measures taken', key: 'remedialMeasures'},
          {title: 'Last Date of prestressing', key: 'prestressingDate'},
          {title: 'Date of Grouting', key: 'groutingDate'},
          {title: 'Type of cement', key: 'cementType'},
          {title: 'W/c Ratio', key: 'wcRatio'},
          {title: 'Temperature of mixing water in °C', key: 'mixingWaterTemp'},
          {title: 'Temperature of Grout in °C', key: 'groutTemp'},
          {title: 'Start time', key: 'startTime'},
          {title: 'Finish Time', key: 'finishTime'},
          {title: 'Volume of Grout in Ltr', key: 'volumeOfGrout'},
          {title: 'Grouting Pressure in Kg/cm²', key: 'groutingPressure'},
          {
            title: 'Cement consumption theoretical',
            key: 'cementConsumptionTheoretical',
          },
          {title: 'Cement consumption actual', key: 'cementConsumptionActual'},
          {title: 'Passage of grout through vents', key: 'passageThroughVents'},
          {
            title: 'Passage of grout through outlet',
            key: 'passageThroughOutlet',
          },
          {title: 'Any equipment failure', key: 'equipmentFailure'},
          {title: 'Probing by Stiffwire', key: 'probingByStiffwire'},
        ];

        return (
          <View>
            {groutingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.groutingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.TORQUING:
        return (
          <View>
            <ScrollView horizontal={true}>
              <View style={{flexDirection: 'column'}}>
                <SwipeListView
                  data={selectedRFI?.metaData.torquingData}
                  renderItem={renderItemTorquing}
                  renderSectionHeader={renderSectionHeaderTorquing}
                />
              </View>
            </ScrollView>
          </View>
        );
      case TASK_TYPES.DUMPING:
        return (
          <View>
            <ScrollView horizontal={true}>
              <View style={{flexDirection: 'column'}}>
                <SwipeListView
                  data={selectedRFI?.metaData.dumpingData}
                  renderItem={renderItemDumping}
                  renderSectionHeader={renderSectionHeaderDumping}
                />
              </View>
            </ScrollView>
          </View>
        );

      case TASK_TYPES.GLUEING:
        return (
          <View>
            <ScrollView horizontal={true}>
              <View style={{flexDirection: 'column'}}>
                <SwipeListView
                  data={selectedRFI?.metaData.glueingData}
                  renderItem={renderItemGlueing}
                  renderSectionHeader={renderSectionHeaderGlueing}
                />
              </View>
            </ScrollView>
          </View>
        );
      case TASK_TYPES.PRE_STRESSING:
        return (
          <View>
            <ScrollView horizontal={true}>
              <View style={{flexDirection: 'column'}}>
                <SwipeListView
                  data={selectedRFI?.metaData.prestressingData}
                  renderItem={renderItemPrestressing}
                  renderSectionHeader={renderSectionHeaderPrestressing}
                />
              </View>
            </ScrollView>
          </View>
        );

      case TASK_TYPES.REMOVAL_OF_FORMWORK:
        const formworkProperties = [
          {
            title: 'Whether concrete has achieved desired strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Whether minimum time has been attained',
            key: 'minimumTimeAttained',
          },
        ];

        return (
          <View>
            {formworkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.removalFormworkData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.TEMPORARY_PRESTRESSING:
        return (
          <View>
            <ScrollView horizontal={true}>
              <View style={{flexDirection: 'column'}}>
                <SwipeListView
                  data={selectedRFI?.metaData.temporaryPrestressingData}
                  renderItem={renderItemTemporaryPrestressing}
                  renderSectionHeader={renderSectionHeaderTemporaryPrestressing}
                />
              </View>
            </ScrollView>
          </View>
        );

      case TASK_TYPES.FABRICATION_OF_MEMBERS:
      case TASK_TYPES.FABRICATION_OF_STEEL_GIRDERS:
        const fabricationProperties = [
          {
            title:
              'Is Steel inspection for surface condition (Twist, Straightness etc.)',
            key: 'steelInspectionSurfaceCondition',
          },
          {
            title: 'Is Section checked for dimension and checked as per GFC',
            key: 'sectionCheckedForDimension',
          },
          {
            title: 'Is Material specification and checked as per GFC',
            key: 'materialSpecificationChecked',
          },
          {title: 'Is connection checked as per GFC', key: 'connectionChecked'},
          {title: 'Are bolt holes clean and to size?', key: 'boltHolesClean'},
          {title: 'Only approved welders used', key: 'approvedWeldersUsed'},
          {title: 'Welds identified as per welder ID', key: 'weldsIdentified'},
          {
            title: 'Welds inspected for dimension, shape, location, etc.',
            key: 'weldsInspected',
          },
          {title: 'Welds repaired as required.', key: 'weldsRepaired'},
          {
            title: 'Shape edge burns, weld spatter removed.',
            key: 'shapeEdgeBurnsRemoved',
          },
          {
            title: 'Oil grease removed prior to final clean.',
            key: 'oilGreaseRemoved',
          },
          {
            title: 'Steel cleaned and painted as per specification.',
            key: 'steelCleanedAndPainted',
          },
          {
            title: 'Final shop coat applied as per approve color.',
            key: 'finalShopCoatApplied',
          },
          {
            title: 'Each member marked for erection as per scope',
            key: 'memberMarkedForErection',
          },
          {
            title: 'Each member approved by inspector prior to shipment.',
            key: 'memberApprovedByInspector',
          },
        ];
        return (
          <View>
            {fabricationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fabricationData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );

      case TASK_TYPES.LIFTING_LEFT:
      case TASK_TYPES.LIFTING_YARD:
      case TASK_TYPES.LIFTING_RIGHT:
      case TASK_TYPES.LIFTING_TRANSPORT_ERECTION:
        const liftingCombinedLRProperties = [
          {
            title: 'Area is hard barricaded with proper signages',
            key: 'areaBarricaded',
          },
          {
            title:
              'Temporary lights for proper illumination of the erection area is available at night',
            key: 'temporaryLights',
          },
          {title: 'Flag man/Marshal available', key: 'flagManAvailable'},
          {
            title:
              'Methodology & Scheme for lifting and stacking is available at site',
            key: 'liftingMethodology',
          },
          {
            title:
              'De-shackles and slings of proper capacity and their test certificate by third party is available',
            key: 'deshacklesTestCertificate',
          },
          {
            title: 'Safety color code present on the de-shackles',
            key: 'safetyColorCode',
          },
          {
            title:
              'Hydraulic jacks are in good condition with proper calibration certificates',
            key: 'hydraulicJacksCondition',
          },
          {
            title: 'Limit switch of lifting hoist is working properly',
            key: 'hoistLimitSwitch',
          },
          {
            title: 'Cotter pin are placed in all lifting assembly',
            key: 'cotterPinsPlaced',
          },
          {
            title:
              'Macalloy Bars / pins for lifting of Wings in proper condition',
            key: 'macalloyBarsCondition',
          },
          {
            title: 'Work at height permit obtained from IE/concerned agency',
            key: 'heightPermitObtained',
          },
          {
            title:
              'All Mac-alloy bars and wire rope assemblies have valid third-party test certificate',
            key: 'macalloyBarsTestCertificate',
          },
          {
            title:
              'Lifting sequence as per the approved methodology provided at site for counter',
            key: 'liftingSequence',
          },
          {
            title:
              'Lifting holes are in proper location as per approved drawing',
            key: 'liftingHolesLocation',
          },
          {
            title: 'Lifting arrangements are working properly',
            key: 'liftingArrangementsWorking',
          },
          {
            title:
              'Pre-stressing duct of segments are clear of any foreign materials',
            key: 'preStressingDuctsClear',
          },
          {
            title:
              'Comprehensive Strength of concrete of wings are gained as per the approved drawing',
            key: 'concreteStrengthGained',
          },
          {
            title: 'Slider trolley is in proper position',
            key: 'sliderTrolleyPosition',
          },
          {
            title: 'Sand blasting on match cast face done',
            key: 'sandBlastingDone',
          },
          {
            title: 'Repairing (if necessary) & finishing done',
            key: 'repairingFinished',
          },
          {
            title: 'No repairing on shearkey & gluing location',
            key: 'noRepairsOnShearkey',
          },
          {
            title:
              'Bund for curing at top removed & top to be cleaned by broom',
            key: 'bundRemoved',
          },
          {
            title: 'Soffit & deck top cleaned by broomer',
            key: 'soffitDeckCleaned',
          },
          {
            title:
              'Sheathing duct is cleaned, no concrete at rubber bunk portion',
            key: 'sheathingDuctCleaned',
          },
          {
            title: 'Sheathing duct alignment ok, checked by drolly passing',
            key: 'ductAlignmentChecked',
          },
          {
            title:
              'Temporary stressing hole at soffit cleaned & dimension checked',
            key: 'temporaryStressingHoleCleaned',
          },
          {
            title: 'Fitness of Trailer with proper calibration certificate',
            key: 'trailerFitnessChecked',
          },
          {
            title: 'Tyres of trailer and air pressure checked',
            key: 'trailerTyresChecked',
          },
          {
            title: 'Ground properly leveled for placement of trailer',
            key: 'groundLeveled',
          },
          {
            title:
              'Area is hard barricaded with proper signages (Erection Site)',
            key: 'areaBarricadedErectionSite',
          },
          {
            title:
              'Temporary lights for proper illumination of the erection area is available at night (Erection Site)',
            key: 'temporaryLightsErectionSite',
          },
          {
            title: 'Flag man/Marshal available (Erection Site)',
            key: 'flagManAvailableErectionSite',
          },
          {
            title:
              'Methodology & Scheme for lifting and stacking is available at site (Erection Site)',
            key: 'liftingMethodologyErectionSite',
          },
          {title: 'Crane is positioned as per drawing', key: 'cranePositioned'},
          {
            title:
              'De-shackles and slings of proper capacity and their test certificate by third party is available (Erection Site)',
            key: 'deshacklesTestCertificateErectionSite',
          },
          {
            title:
              'Safety color code present on the de-shackles (Erection Site)',
            key: 'safetyColorCodeErectionSite',
          },
          {
            title:
              'Hydraulic jacks are in good condition with proper calibration certificates (Erection Site)',
            key: 'hydraulicJacksConditionErectionSite',
          },
          {
            title:
              'Limit switch of lifting hoist is working properly (Erection Site)',
            key: 'hoistLimitSwitchErectionSite',
          },
          {
            title:
              'Cotter pin are placed in all lifting assembly (Erection Site)',
            key: 'cotterPinsPlacedErectionSite',
          },
          {
            title:
              'Macalloy Bars / pins for lifting of Wings in proper condition (Erection Site)',
            key: 'macalloyBarsConditionErectionSite',
          },
          {
            title: 'TPI of all parts of Cranes & Slings done',
            key: 'cranesTPICompleted',
          },
          {
            title:
              'Latest TPI Certificates of all parts of Cranes & Slings available at Site',
            key: 'cranesTPICertificatesAvailable',
          },
          {
            title: 'Counter-weights are available & placed as per drawing',
            key: 'counterWeightsPlaced',
          },
          {
            title: 'Positioning of segment marked',
            key: 'positioningOfSegmentMarked',
          },
          {
            title: 'Traffic properly diverted & Traffic marshals are in place',
            key: 'trafficDiverted',
          },
          {
            title:
              'Safety & Fitness of all workers working at height checked and certified',
            key: 'workersSafetyChecked',
          },
          {
            title: 'All Safety arrangements are placed at Site',
            key: 'safetyArrangementsPlaced',
          },
          {
            title: 'Segments positioned at the specified / marked location',
            key: 'segmentPositioned',
          },
          {
            title:
              'Necessary lateral / Site support ensured before releasing the segment by Cranes',
            key: 'lateralSupportEnsured',
          },
        ];

        return (
          <View>
            {liftingCombinedLRProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.liftingCombinedLRData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PAINTING_OF_STEEL_GIRDERS_DIAPHRAGMS:
        const paintingOfSteelGirdersProperties = [
          {
            title: 'Is equipment regular inspected',
            key: 'equipmentRegularInspected',
          },
          {
            title: 'Is the worker worn Personal Protective Equipment',
            key: 'workerWornPPE',
          },
          {
            title:
              'Is the personal present at the Blasting Pot and compressor at all times',
            key: 'presentAtBlastingPot',
          },
          {
            title:
              'Is every structural member released for painting having identification Tag',
            key: 'identificationTag',
          },
          {
            title:
              'Is the surface checked prior to blasting for mechanical damages',
            key: 'surfaceCheckPriorBlasting',
          },
          {
            title:
              'Is the surface free from oil, grease and other contamination',
            key: 'surfaceFreeFromContamination',
          },
          {
            title: 'Is the weather and temperature suitable for blasting',
            key: 'suitableWeatherForBlasting',
          },
          {
            title: 'Is the compressed air free from water, oil etc.',
            key: 'compressedAirQuality',
          },
          {
            title: 'Are the areas of member protected that not to be blasted',
            key: 'protectedAreas',
          },
          {
            title:
              'Is there high-pressure water used to remove salt and other contaminations',
            key: 'highPressureWaterUsage',
          },
          {
            title: 'Is the abrasive used as per the required specification',
            key: 'abrasiveSpecification',
          },
          {
            title:
              'Is the copy of batch certificate of abrasive used available at the factory',
            key: 'batchCertificateAvailable',
          },
          {
            title: 'Is the Blasting Nozzle Pressure checked',
            key: 'nozzlePressureChecked',
          },
          {
            title: 'Are all blasted surfaces inspected for proper cleaning',
            key: 'inspectedForCleaning',
          },
          {
            title:
              'Is the surface visually checked for any mechanical damage/lamination',
            key: 'visualCheckDamage',
          },
          {
            title:
              'Is the Blasted structural member shifted carefully without damage',
            key: 'shiftedWithoutDamage',
          },
          {
            title: 'Are the surrounding areas covered to prevent overspray',
            key: 'surroundingAreaCovered',
          },
          {
            title: 'Is the painting system as per specification',
            key: 'paintingSystemSpecification',
          },
          {
            title:
              'Is the Paint mixed and prepared in accordance with manufacturer instructions',
            key: 'paintMixedAsPerInstructions',
          },
          {
            title: 'Is the TIP size and spraying procedure adhered to',
            key: 'tipSizeSprayingProcedure',
          },
          {
            title:
              'Is the Solvent dilution in accordance with manufacturer recommendations',
            key: 'solventDilutionAccordance',
          },
          {
            title: 'Are the required areas striped before applying paints',
            key: 'areasStripedBeforePainting',
          },
          {
            title: 'Are the materials within the shelf life',
            key: 'materialsWithinShelfLife',
          },
          {
            title: 'Is the weather condition checked prior to painting',
            key: 'weatherConditionChecked',
          },
          {
            title:
              'Is the paint applied as per specification and related paint system',
            key: 'paintAppliedPerSpecification',
          },
          {
            title:
              'Is the paint mixed and applied within the specified pot life',
            key: 'paintMixedWithinPotLife',
          },
          {
            title: 'Is the paint applied with even coating thickness',
            key: 'evenCoatingThickness',
          },
          {
            title: 'Is the WFT checked for required DFT',
            key: 'wftCheckedForDft',
          },
          {
            title: 'Is the overcoating interval maintained as per requirement',
            key: 'overcoatingIntervalMaintained',
          },
          {
            title: 'Is the proper coating system applied during intervals',
            key: 'properCoatingSystemApplied',
          },
          {
            title: 'Is the paint surface visually good and free from defects',
            key: 'paintSurfaceQuality',
          },
          {
            title: 'Is the record maintained for painting',
            key: 'recordMaintained',
          },
        ];

        return (
          <View>
            {paintingOfSteelGirdersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.paintingOfSteelGirdersDiaphragms?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
        const placementOfReinforcementCageProperties = [
          {
            title: 'Rebar and dimension (dia, len, shape) checked as per GFC',
            key: 'rebarDimensionChecked',
          },
          {
            title: 'Shaping, No and Length of Bars checked as per GFC',
            key: 'shapingCheckedAsPerGFC',
          },
          {
            title: 'Rebars securely tightened/bound by tie bars',
            key: 'rebarsSecurelyBound',
          },
          {
            title: 'Splice length and location checked as per GFC',
            key: 'spliceLengthChecked',
          },
          {title: 'Rebar within tolerance limit', key: 'rebarWithinTolerance'},
          {
            title: 'Coupler arrangements within tolerance',
            key: 'couplerArrangementsWithinTolerance',
          },
          {
            title: 'Bar Bending schedule checked',
            key: 'barBendingScheduleChecked',
          },
        ];

        return (
          <View>
            {placementOfReinforcementCageProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.placementOfReinforcementCage?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.TRANSPORTATION_OF_STEEL_GIRDERS_DIAPHRAGMS_ERECTION_AT_SITE:
        const transportationOfSteelGirdersDiaphragmsProperties = [
          {
            title: 'Safe access to work place is provided',
            key: 'safeAccessProvided',
          },
          {
            title: 'Working platform fully on boarded on the deck',
            key: 'workingPlatformOnBoarded',
          },
          {title: 'Guard rails firmly attached', key: 'guardRailsAttached'},
          {
            title: 'Adequate fall protection arrangement made',
            key: 'fallProtectionArrangement',
          },
          {
            title: 'Tools secured against accidental fall',
            key: 'toolsSecuredAgainstFall',
          },
          {
            title: 'Risk assessment carried out',
            key: 'riskAssessmentCarriedOut',
          },
          {title: 'Crane on firm level bases', key: 'craneOnFirmLevelBases'},
          {
            title: 'Operations trained and competent',
            key: 'operatorsTrainedAndCompetent',
          },
          {title: 'Crane tested and operated', key: 'craneTestedAndOperated'},
          {
            title: 'Swing alarm installed and functioning',
            key: 'swingAlarmInstalled',
          },
          {
            title: 'Crane test certificate current',
            key: 'craneTestCertificateCurrent',
          },
          {
            title: 'Boom test certificate current',
            key: 'craneBoomTestCertificateCurrent',
          },
          {title: 'Oil leakage checked', key: 'oilLeakageChecked'},
          {title: 'Greasing checked', key: 'greasingChecked'},
          {title: 'Outriggers fully extended', key: 'outriggersFullyExtended'},
          {
            title: 'Level indicators within limit',
            key: 'levelIndicatorsWithinLimit',
          },
          {
            title: 'Base plate under outriggers',
            key: 'basePlateUnderOutriggers',
          },
          {title: 'Rigging angles checked', key: 'riggingAnglesChecked'},
          {
            title: 'All lifting tools checked and valid',
            key: 'liftingToolsCheckedAndValid',
          },
          {
            title: 'Personnel trained and protected',
            key: 'personnelTrainedAndProtected',
          },
          {title: 'PPE provided', key: 'ppeProvided'},
          {
            title: 'Sufficient illumination provided',
            key: 'sufficientIlluminationProvided',
          },
          {title: 'SWL marked on all tools', key: 'swlMarkedOnTools'},
          {
            title: 'Equipment properly earthed',
            key: 'equipmentProperlyEarthed',
          },
          {
            title: 'Walkways free from obstacles',
            key: 'walkwaysFreeFromObstacles',
          },
          {title: 'Safety latch available', key: 'safetyLatchAvailable'},
          {title: 'Warning signs available', key: 'warningSignsAvailable'},
          {
            title: 'Lifting arrangements checked',
            key: 'liftingArrangementsChecked',
          },
          {title: 'Ground leveling done', key: 'groundLevelingDone'},
          {
            title: 'Structure set out correctly',
            key: 'structureSetOutCorrectly',
          },
          {
            title: 'Welder qualified and certified',
            key: 'welderQualifiedAndCertified',
          },
        ];

        return (
          <View>
            {transportationOfSteelGirdersDiaphragmsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData
                      .transportationOfSteelGirdersDiaphragms?.[property.key]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ERECTION_OF_TEMPORARY_STRUCTURE:
        const erectionOfTemporaryStructureProperties = [
          {
            title: 'Has any risk assessment been carried out',
            key: 'riskAssessmentCarriedOut',
          },
          {
            title: 'Is the crane/hydra on firm level bases',
            key: 'craneOnFirmLevelBases',
          },
          {
            title: 'Are all operation trained and competent',
            key: 'operationsTrainedAndCompetent',
          },
          {
            title: 'Is crane tested and operated',
            key: 'craneTestedAndOperated',
          },
          {
            title: 'Does the crane have a current test certificate',
            key: 'craneCurrentTestCertificate',
          },
          {
            title:
              'All lifting tools and tackles are being identified, checked and have valid resister',
            key: 'liftingToolsValidRegistered',
          },
          {
            title:
              'The person working at height are trained and lash with all fall protection devices',
            key: 'fallProtectionDevicesForHeight',
          },
          {
            title:
              'Structure on which columns/beams erected have attained their strength',
            key: 'structureStrengthAttained',
          },
          {
            title: 'Workmen provided with all required PPE’s',
            key: 'ppeProvided',
          },
          {
            title:
              'Whether sufficient illumination is provided around the working area',
            key: 'sufficientIlluminationProvided',
          },
          {
            title: 'Is the SWL marked on all lifting tools & tackles',
            key: 'swlMarkedOnLiftingTools',
          },
          {
            title:
              'All wielding machines, electrical equipment & generators properly earthed',
            key: 'equipmentProperlyEarthed',
          },
          {
            title:
              'Are the walkways maintained free from obstacles all the time',
            key: 'walkwaysFreeFromObstacles',
          },
          {
            title: 'Is safety latch/locking available',
            key: 'safetyLatchAvailable',
          },
          {
            title: 'Proper warning sign available at site',
            key: 'warningSignAvailableAtSite',
          },
          {
            title: 'Lifting arrangements are approved by a competent person',
            key: 'liftingArrangementsApproved',
          },
          {
            title:
              'Is footing above temporary structure fixed achieve their compressive strength',
            key: 'footingStrengthAchieved',
          },
          {title: 'Ground leveling', key: 'groundLeveling'},
          {
            title: 'Is Structure set out to the required line and levels',
            key: 'structureSetOutToRequiredLine',
          },
          {
            title:
              'For welding, is welder qualification and skills checked and certified',
            key: 'welderQualificationCertified',
          },
        ];

        return (
          <View>
            {erectionOfTemporaryStructureProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.erectionOfTemporaryStructure?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_SHUTTER:
        const fixingOfShutterProperties = [
          {title: 'Shuttering material is New', key: 'shutteringMaterialNew'},
          {title: 'Repairs are ok', key: 'repairsOk'},
          {title: 'Cleanliness of shuttering', key: 'cleanlinessOfShuttering'},
          {title: 'Oiling of shuttering', key: 'oilingOfShuttering'},
          {
            title:
              'Shuttering design, ok? (Dimension, Diagonal, Sunken portion etc.)',
            key: 'shutteringDesignOk',
          },
          {
            title: 'Alignments /levels /rigidity, ok',
            key: 'alignmentLevelsRigidityOk',
          },
          {title: 'Check props are they ok', key: 'propsOk'},
          {title: 'Check acrow span. Are they ok', key: 'acrowSpanOk'},
          {title: 'Check braces. Are they ok', key: 'bracesOk'},
          {
            title: 'Check sealing joints/holes, ok',
            key: 'sealingJointsHolesOk',
          },
        ];

        return (
          <View>
            {fixingOfShutterProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfShutter?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.CURING:
        const curingProperties = [
          {
            title:
              'Water used for curing is free from oil, salt, acid, and organic minerals',
            key: 'waterFreeFromContaminants',
          },
          {
            title: 'pH value of water not be less than 6',
            key: 'phValueOfWater',
          },
          {
            title: 'Consumption of water in Kilo liter',
            key: 'waterConsumptionInKL',
          },
        ];

        return (
          <View>
            {curingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>{selectedRFI?.metaData.curingData?.[property.key]}</Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ERECTION_USING_CRANES:
        const erectionUsingCranesProperties = [
          {
            title: 'Has any risk assessment been carried out',
            key: 'riskAssessmentCarriedOut',
          },
          {
            title: 'Is the crane on firm level bases',
            key: 'craneOnFirmLevelBases',
          },
          {
            title: 'Are all operators trained and competent',
            key: 'allOperatorsTrained',
          },
          {
            title: 'Is crane tested and operated',
            key: 'craneTestedAndOperated',
          },
          {
            title: 'Is there swing alarm installed and functioning',
            key: 'swingAlarmFunctioning',
          },
          {
            title: 'Does the crane have a current test certificate',
            key: 'craneTestCertificate',
          },
          {
            title: 'Boom of crane have a current test certificate',
            key: 'boomTestCertificate',
          },
          {title: 'Oil (leakage)', key: 'oilLeakage'},
          {title: 'Greasing', key: 'greasing'},
          {
            title: 'Outriggers (Fully extended)',
            key: 'outriggersFullyExtended',
          },
          {
            title: 'Level indicators (2 degree to 3 degree)',
            key: 'levelIndicators',
          },
          {
            title: 'Base plate under the outriggers',
            key: 'basePlateUnderOutriggers',
          },
          {title: 'Rigging (2 Nos) angles', key: 'riggingAngles'},
          {
            title:
              'Are all the examination and test carried out and certified by competent person',
            key: 'examinationCertified',
          },
          {
            title:
              'All lifting tools and tackles are being identified, checked and have valid register',
            key: 'liftingToolsChecked',
          },
          {
            title:
              'The person working at height are trained and lash with all fall protection devices',
            key: 'workersWithFallProtection',
          },
          {
            title: 'Workmen provided with all required PPE’s',
            key: 'ppeProvided',
          },
          {
            title:
              'Whether sufficient illumination is provided around the working area',
            key: 'sufficientIllumination',
          },
          {
            title: 'Is the SWL marked on all lifting tools & tackles',
            key: 'swlMarked',
          },
          {
            title:
              'All welding machine, electrical equipment’s & generators properly earthed',
            key: 'equipmentProperlyEarthed',
          },
          {
            title: 'Are the walkway maintained free from obstacle all the time',
            key: 'walkwayObstacleFree',
          },
          {
            title: 'Is safety latch/locking available',
            key: 'safetyLatchAvailable',
          },
          {
            title: 'Proper warning sign available at site',
            key: 'warningSignAvailable',
          },
          {title: 'Lifting arrangements', key: 'liftingArrangements'},
          {title: 'Ground leveling', key: 'groundLeveling'},
          {
            title: 'Is Structure set out to the required line and levels',
            key: 'structureSetOut',
          },
          {
            title:
              'For welding, is welder qualification and skill checked and certified',
            key: 'welderQualificationChecked',
          },
        ];
        return (
          <View>
            {erectionUsingCranesProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.erectionUsingCranesData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.STACKING_IN_YARD:
        const stackingInYardProperties = [
          {
            title: 'Area Barricaded with Proper Signages',
            key: 'areaBarricaded',
          },
          {
            title: 'Temporary Lights Available at Night',
            key: 'temporaryLightsAvailable',
          },
          {title: 'Flag Man/Marshal Available', key: 'flagManAvailable'},
          {
            title: 'Methodology & Scheme for Lifting and Stacking Available',
            key: 'methodologyAvailable',
          },
          {
            title: 'De-shackles and Slings with Test Certificate',
            key: 'deShacklesAndSlings',
          },
          {title: 'Safety Color Code on De-shackles', key: 'safetyColorCode'},
          {
            title: 'Hydraulic Jacks in Good Condition',
            key: 'hydraulicJacksCondition',
          },
          {
            title: 'Limit Switch of Lifting Hoist Working',
            key: 'limitSwitchWorking',
          },
          {
            title: 'Cotter Pins in All Lifting Assemblies',
            key: 'cotterPinsInPlace',
          },
          {
            title: 'Macalloy Bars/Pins for Lifting in Proper Condition',
            key: 'macalloyBarsCondition',
          },
          {title: 'Work at Height Permit Obtained', key: 'workAtHeightPermit'},
          {
            title: 'All Macalloy Bars and Wire Rope Assemblies Certified',
            key: 'macalloyBarsCertificate',
          },
          {
            title: 'Lifting Sequence as per Approved Methodology',
            key: 'liftingSequenceProvided',
          },
          {
            title: 'Lifting Holes in Proper Location',
            key: 'liftingHolesLocation',
          },
          {
            title: 'Lifting Arrangements Working Properly',
            key: 'liftingArrangementsWorking',
          },
          {
            title: 'Pre-stressing Duct Clear of Foreign Materials',
            key: 'preStressingDuctClear',
          },
          {
            title: 'Concrete Strength as per Approved Drawing',
            key: 'concreteStrength',
          },
          {
            title: 'Slider Trolley in Proper Position',
            key: 'sliderTrolleyPosition',
          },
          {
            title: 'Methodology for Stacking Approved',
            key: 'methodologyForStackingApproved',
          },
          {
            title: 'Stacking Area Properly Located and Earmarked',
            key: 'stackingAreaLocation',
          },
          {
            title: 'Stacking Area Level and Supported',
            key: 'stackingAreaLevelSupport',
          },
        ];
        return (
          <View>
            {stackingInYardProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.stackingInYardData[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ASSEMBLING_OF_TRUSS:
        const assemblingOfTrussProperties = [
          {
            title: 'Parts Accurately Assembled (GFC)',
            key: 'partsAccuratelyAssembled',
          },
          {
            title: 'No Bent or Broken Parts During Handling',
            key: 'noBentOrBrokenParts',
          },
          {
            title: 'Truss Span Laid on Blocks for Proper Camber',
            key: 'trussSpanOnBlocks',
          },
          {
            title: 'All Joint Surfaces, Bolts, Nuts, Washers Free from Dirt',
            key: 'cleanJointSurfaces',
          },
          {
            title:
              'All Fasteners Have Washer Under Nut or Bolt During Tightening',
            key: 'fastenersWithWashers',
          },
          {
            title: 'Service Bolts Fully Tightened After Assembly',
            key: 'serviceBoltsTightened',
          },
        ];
        return (
          <View>
            {assemblingOfTrussProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.assemblingOfTrussData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_SHEATHING_JOINTS:
        const fixingOfSheathingJointsProperties = [
          {
            title: 'All Temporary Openings in Sheathing Satisfactory Plugged',
            key: 'temporaryOpeningsPlugged',
          },
          {
            title: 'Has Joint Water Tight',
            key: 'jointWaterTight',
          },
          {
            title:
              'Sheathing Neatly Fitted at Joint without Internal Projection',
            key: 'sheathingNeatlyFitted',
          },
          {
            title:
              'Sheathing Tightly Fitted on Anchorage End and Sealed with Tape',
            key: 'anchorageEndSealed',
          },
          {
            title: 'Coupler Tightly Screwed on Outer Side of Sheathing Duct',
            key: 'couplerTightlyScrewed',
          },
          {
            title: 'Length of Coupler Not Less Than 150mm (Up to 200mm)',
            key: 'couplerLengthSufficient',
          },
          {
            title: 'Joint Between Coupler End and Duct Sealed with Tape',
            key: 'jointSealedWithTape',
          },
          {
            title: 'Coupler of Adjacent Duct Staggered',
            key: 'couplerStaggered',
          },
        ];

        return (
          <View>
            {fixingOfSheathingJointsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.fixingOfSheathingJointsData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );

      case TASK_TYPES.HACKING_OF_GIRDER:
        const hackingOfGirderProperties = [
          {
            title: 'Methodology Approved for Hacking by the Contractor',
            key: 'methodologyApproved',
          },
          {
            title:
              'Whether the Surface Cleaned and Wet at Which Hacking is to be Done',
            key: 'surfaceCleanedAndWet',
          },
          {
            title: 'Whether the Personnel are Skilled',
            key: 'skilledPersonnel',
          },
          {
            title: 'Whether the Instrument Used for Hacking is Sharpened',
            key: 'sharpenedInstruments',
          },
          {
            title: 'Whether the 300-400 Recess Cut Formed in Per Square Meter',
            key: 'recessCutFormation',
          },
        ];

        return (
          <View>
            {hackingOfGirderProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.hackingOfGirderData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.DE_STRESSING_OF_GIRDER:
        const deStressingOfGirderProperties = [
          {
            title: 'Girders and Segments Achieved Their Strength',
            key: 'strengthAchieved',
          },
          {
            title: 'Diamond Bit Saw or Grinder Used to Cut the Strands',
            key: 'diamondBitSawUsed',
          },
          {
            title: 'Normal Gradual Uniform Transfer of Prestress to Girder',
            key: 'gradualUniformTransfer',
          },
        ];

        return (
          <View>
            {deStressingOfGirderProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.deStressingOfGirderData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_BEARING:
        const fixingOfBearingProperties = [
          {
            title: 'Bearing Placed as Per GFC Drawing',
            key: 'bearingPlacedAsPerGFC',
          },
          {
            title: 'Bearing Surface Fully Contact with Girder',
            key: 'bearingSurfaceFullyContactWithGirder',
          },
          {
            title: 'Bearing Plates Set Horizontal in Both Directions',
            key: 'bearingPlatesSetHorizontal',
          },
          {
            title: 'Bearing Pre-Set with Respect to Axis',
            key: 'bearingPreSetWithAxis',
          },
          {
            title: 'Supports Provided to Hold Bearing in Position',
            key: 'supportsProvidedToHoldBearing',
          },
          {
            title: 'Anchor Bolt Holes Matching',
            key: 'anchorBoltHolesMatching',
          },
          {
            title: 'Void Beneath Bearing Filled with Bedding Material',
            key: 'voidBeneathBearingFilled',
          },
          {
            title: 'Bearing Fixed with Metal Bedding Plate',
            key: 'bearingFixedWithMetalBedding',
          },
          {
            title: 'Threaded Fastener Tightened Uniformly',
            key: 'threadedFastenerTightenedUniformly',
          },
        ];

        return (
          <View>
            {fixingOfBearingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfBearingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.REMOVAL_OF_TEMPORARY_STRUCTURE:
        const removalOfTemporaryStructureProperties = [
          {
            title: 'Whether Concrete Has Achieved Desired Strength',
            key: 'concreteAchievedStrength',
          },
          {
            title: 'Whether Minimum Time Has Been Attained',
            key: 'minimumTimeAttained',
          },
          {
            title:
              'Whether All Main Components Tightened and Fixed at Their Position',
            key: 'allComponentsTightened',
          },
        ];
        return (
          <View>
            {removalOfTemporaryStructureProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.removalOfTemporaryStructureData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.INSTALLATION_OF_EXPANSION_JOINT:
        const installationOfExpansionJointProperties = [
          {
            title: 'Expansion Joint in the Right Position',
            key: 'expansionJointPositionCorrect',
          },
          {
            title: 'Shipping Devices or Stabilizers Removed',
            key: 'shippingDevicesRemoved',
          },
          {
            title: 'No Foreign Objects Impending the Expansion Joint',
            key: 'noForeignObjects',
          },
          {
            title: 'Materials Flowing in the Right Direction',
            key: 'materialsFlowProperly',
          },
          {
            title: 'Anchors and Supports Match System Drawing',
            key: 'anchorsAndSupportsMatched',
          },
          {
            title: 'Joints Properly Aligned',
            key: 'jointsProperlyAligned',
          },
          {
            title: 'No Damage Sustained During Shipping or Installation',
            key: 'noDamageSustained',
          },
        ];
        return (
          <View>
            {installationOfExpansionJointProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.installationOfExpansionJointData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PAINTING:
        const paintingProperties = [
          {
            title:
              'Painting System Including Materials and Color Shades Approved',
            key: 'paintingSystemApproved',
          },
          {
            title: 'Method Statement, QCP, ITP & Risk Assessment Approved',
            key: 'documentsApproved',
          },
          {
            title: 'Surface Preparation Done as Per Approved Method Statement',
            key: 'surfacePreparationDone',
          },
          {
            title: 'Defects in Substrate Corrected',
            key: 'defectsCorrected',
          },
          {
            title: 'Moisture Content Checked',
            key: 'moistureContentChecked',
          },
          {
            title: 'Plaster Surfaces Rubbed Down with Rubbing Stone',
            key: 'plasterSurfacesRubbed',
          },
          {
            title: 'Material Thoroughly Stirred Prior to Application',
            key: 'materialStirred',
          },
          {
            title: 'Filler Coat Applied Only After Curing Period of Primer',
            key: 'fillerCoatAfterPrimer',
          },
          {
            title:
              'Suction Spots Covered with Primer Prior to Filler Coat Application',
            key: 'suctionSpotsPrimed',
          },
          {
            title:
              'Filler Coat Applied Evenly and All Angles and Corners are Straight',
            key: 'fillerCoatAppliedEvenly',
          },
          {
            title: 'Sanding Done Between Coats',
            key: 'sandingBetweenCoats',
          },
          {
            title: 'Drying Time Allowed as Per Approved Method Statement',
            key: 'dryingTimeAllowed',
          },
          {
            title: 'Materials Mixed Properly',
            key: 'materialsMixedProperly',
          },
          {
            title: 'First Coat Applied by Roller Over the Whole Surface',
            key: 'firstCoatAppliedByRoller',
          },
          {
            title: 'Roller Joints Checked',
            key: 'rollerJointsChecked',
          },
          {
            title: 'Curing Period Allowed as Per Approved Method Statement',
            key: 'curingPeriodAllowed',
          },
          {
            title: 'Second Coat Applied After Touch Up on First Coat',
            key: 'secondCoatAfterTouchUp',
          },
          {
            title: 'Final Coat Applied',
            key: 'finalCoatApplied',
          },
          {
            title: 'Cleaning and Protection of Adjacent Surfaces',
            key: 'cleaningAndProtection',
          },
        ];
        return (
          <View>
            {paintingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.paintingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.AUTO_LAUNCHING:
        const autoLaunchingProperties = [
          {
            title: 'First Span Lowering on Temporary Steel Stools Completed',
            key: 'firstSpanLowering',
          },
          {
            title: 'Slider as per Drawing/Methodology',
            key: 'sliderPerDrawing',
          },
          {
            title: 'Middle Support Leveling & Alignment Completed',
            key: 'middleSupportLeveling',
          },
          {
            title: 'Rear Support Leveling & Alignment Completed',
            key: 'rearSupportLeveling',
          },
          {
            title:
              'Check for Hydraulic Jacks at Mid & Rear Support (Alignment & Seating)',
            key: 'checkHydraulicJacks',
          },
          {
            title:
              'Ensure All Vertical Jacks at Mid Support are Connected to Single Power Pack',
            key: 'allVerticalJacksMidSupport',
          },
          {
            title:
              'Ensure All Vertical Jacks at Rear Support are Connected to Single Power Pack',
            key: 'allVerticalJacksRearSupport',
          },
          {
            title:
              'Ensure Cleanliness and Application of Lubricant on Sliding Surfaces at Mid & Rear Support',
            key: 'cleanlinessAndApplicationLubricant',
          },
          {
            title:
              'Physically Checked All Accessories of Launching (Rear Support, Middle Support, Anchoring Bolt)',
            key: 'physicallyCheckedAllAccessories',
          },
          {
            title:
              'Ensure Pins Between Jack and Monorail are Properly Fixed & in Good Condition',
            key: 'jackAndMonorailProperlyFixed',
          },
          {
            title: 'Knuckle Bearing in Position',
            key: 'knuckleBearing',
          },
          {
            title: 'Guide Rollers in Place and Functioning',
            key: 'guideRollers',
          },
          {
            title: 'Macalloy Bars Stressed - Mid Support & Rear Support',
            key: 'macalloyBarsStressed',
          },
          {
            title: 'Front Support Telescopic Leg Closed Properly',
            key: 'frontSupportTelescopic',
          },
          {
            title:
              'Ensure Lock Nuts Arrangement at Mid & Rear Support is Unlocked',
            key: 'lockNutsArrangement',
          },
          {
            title: 'Check Pressure on Mid Support and Rear Support Jacks',
            key: 'pressureOnMidRearSupport',
          },
          {
            title: 'Gradient of Auto Launching Checked',
            key: 'gradient',
          },
          {
            title: 'Check Alignment of Track Rail for Rear Trolley Movement',
            key: 'alignmentOfTrackRail',
          },
          {
            title:
              'Ensure Front Support is at Correct Position to Lower Legs as per Methodology Drawing',
            key: 'frontSupportCorrectPosition',
          },
          {
            title: 'Ensure Front Support Pins are Properly Placed and Locked',
            key: 'frontSupportPins',
          },
          {
            title: 'Ensure Inserts at Pier Cap are Tightened Properly',
            key: 'insertsPierCap',
          },
          {
            title: 'Ensure Front Support is Engaged Properly',
            key: 'frontSupportEngaged',
          },
          {
            title: 'Ensure Entire Area is Barricaded',
            key: 'entireAreaBarricaded',
          },
        ];

        return (
          <View>
            {autoLaunchingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.autoLaunchingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_GEO_GRID:
        const fixingOfGeoGridProperties = [
          {
            title: 'Material of Geo Grid Approved by Engineer',
            key: 'materialApprovedByEngineer',
          },
          {
            title: 'Specifications/Strength as per Approved Drawing',
            key: 'specificationsAsPerApprovedDrawing',
          },
          {
            title:
              'Underneath Soil Layer Compacted, Tested (Moisture & Density)',
            key: 'soilProperlyCompacted',
          },
          {
            title: 'Geo Grids Properly Anchored into Facia Panels',
            key: 'geoGridsAnchoredIntoFaciaPanels',
          },
          {
            title: 'Geo Grids Properly Tensioned and Nailed into Soil',
            key: 'geoGridsTensionedAndNailed',
          },
          {
            title: 'Minimum Length of Geo Grid as per Approved Drawing',
            key: 'minimumLengthAsPerApprovedDrawing',
          },
        ];

        return (
          <View>
            {fixingOfGeoGridProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfGeoGridData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ERECTION_OF_FRICTION_SLAB:
        const erectionOfFrictionSlabProperties = [
          {
            title: 'Friction Slab cum Crash Barrier has Sufficient Strength',
            key: 'sufficientStrength',
          },
          {
            title: 'Friction Slab cum Crash Barrier Not Damaged',
            key: 'notDamaged',
          },
          {
            title: 'Line/Levels Checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Vertical Slope as per Drawing',
            key: 'verticalSlopeAsPerDrawing',
          },
          {
            title: 'Soil Compacted & Geo Grids Fixed under Panels',
            key: 'soilCompactedAndGeoGridsFixed',
          },
          {
            title: 'Coping Done',
            key: 'copingDone',
          },
        ];

        return (
          <View>
            {erectionOfFrictionSlabProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.erectionOfFrictionSlabData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ERECTION_OF_FACIA_PANELS:
        const erectionOfFaciaPanelsProperties = [
          {
            title: 'Facia Panels have Sufficient Strength',
            key: 'sufficientStrength',
          },
          {
            title: 'Facia Panels Not Damaged',
            key: 'notDamaged',
          },
          {
            title: 'Line/Levels Checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Male-Female Joints Checked',
            key: 'maleFemaleJointsChecked',
          },
          {
            title: 'Vertical Slope as per Drawing',
            key: 'verticalSlopeAsPerDrawing',
          },
          {
            title: 'Soil Compacted & Geo Grids Fixed under Panels',
            key: 'soilCompactedAndGeoGridsFixed',
          },
        ];

        return (
          <View>
            {erectionOfFaciaPanelsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.erectionOfFaciaPanelsData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ERECTION_OF_COLUMNS:
        const erectionOfColumnsProperties = [
          {
            title: 'Position Checked',
            key: 'positionChecked',
          },
          {
            title: 'Welding Done as per Approved Drawing',
            key: 'weldingAsPerDrawing',
          },
          {
            title: 'Columns are as per Approved Drawing',
            key: 'columnsAsPerDrawing',
          },
          {
            title: 'Necessary Support Provided',
            key: 'supportProvided',
          },
        ];

        return (
          <View>
            {erectionOfColumnsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.erectionOfColumnsData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.APPLICATION_OF_FILTER_MEDIA:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Filter Media is as per the approved drawing
              </Text>
              <Text>
                {
                  selectedRFI?.metaData.applicationOfFilterMediaData
                    ?.filterMediaAsPerDrawing
                }
              </Text>
            </View>
          </View>
        );
      case TASK_TYPES.FIXING_OF_BRACINGS:
        const fixingOfBracingsProperties = [
          {
            title: 'Line/Levels Checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Welding Done as per Approved Drawing',
            key: 'weldingAsPerApprovedDrawing',
          },
          {
            title: 'Bracings are as per Approved Drawing',
            key: 'bracingsAsPerApprovedDrawing',
          },
        ];

        return (
          <View>
            {fixingOfBracingsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfBracingsData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_RAILING:
        const fixingOfRailingProperties = [
          {
            title: 'Line/Levels Checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Railing is as per Approved Drawing',
            key: 'railingAsPerApprovedDrawing',
          },
        ];

        return (
          <View>
            {fixingOfRailingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfRailingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PROCUREMENT_OF_SHEET:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Total Sheet purchased (sqm)
              </Text>
              <Text>
                {
                  selectedRFI?.metaData.procurementOfSheetData
                    ?.totalSheetPurchased
                }
              </Text>
            </View>
          </View>
        );
      case TASK_TYPES.DUMPING_OF_SOIL:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Soil from Approved Source
              </Text>
              <Text>
                {selectedRFI?.metaData.dumpingOfSoilData?.soilApprovedSource}
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Soil without Unwanted Materials
              </Text>
              <Text>
                {
                  selectedRFI?.metaData.dumpingOfSoilData
                    ?.soilWithoutUnwantedMaterials
                }
              </Text>
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Quantity of Soil Dumped (cum)
              </Text>
              <Text>
                {selectedRFI?.metaData.dumpingOfSoilData?.quantityOfSoilDumped}
              </Text>
            </View>
          </View>
        );
      case TASK_TYPES.BORING_OF_DIAPHRAGM:
        const boringOfDiaphragmProperties = [
          {
            title: 'Density of Polymer',
            key: 'densityOfPolymer',
          },
          {
            title: 'Viscosity of Polymer',
            key: 'viscosityOfPolymer',
          },
          {
            title: 'pH Value of Polymer',
            key: 'pHValueOfPolymer',
          },
          {
            title: 'Sand Content of Polymer',
            key: 'sandContentOfPolymer',
          },
          {
            title: 'Depth of Wall',
            key: 'depthOfWall',
          },
        ];

        return (
          <View>
            {boringOfDiaphragmProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.boringOfDiaphragmData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ERECTION:
        const erectionProperties = [
          {
            title: 'Ground properly leveled for trailer placement',
            key: 'groundLeveled',
          },
          {
            title: 'Area is barricaded with proper signages',
            key: 'areaBarricaded',
          },
          {
            title: 'Temporary lights for proper illumination at night',
            key: 'temporaryLights',
          },
          {title: 'Flag man/Marshal available', key: 'flagManAvailable'},
          {
            title: 'Methodology & Scheme available at site',
            key: 'methodologyAvailable',
          },
          {title: 'Crane positioned as per drawing', key: 'cranePositioned'},
          {title: 'De-shackles certified', key: 'deShacklesCertified'},
          {
            title: 'Safety color code present on de-shackles',
            key: 'safetyColorCode',
          },
          {
            title: 'Hydraulic jacks calibrated',
            key: 'hydraulicJacksCalibrated',
          },
          {
            title: 'Limit switch of hoist working properly',
            key: 'limitSwitchWorking',
          },
          {
            title: 'Cotter pins placed in lifting assembly',
            key: 'cotterPinPlaced',
          },
          {
            title: 'Macalloy bars in proper condition',
            key: 'macalloyBarsCondition',
          },
          {title: 'TPI of Cranes & Slings done', key: 'tpiDone'},
          {
            title: 'TPI certificates available',
            key: 'tpiCertificatesAvailable',
          },
          {
            title: 'Counter-weights placed as per drawing',
            key: 'counterWeightsPlaced',
          },
          {title: 'Positioning marked at site', key: 'positioningMarked'},
          {
            title: 'Traffic diverted & marshals in place',
            key: 'trafficDiverted',
          },
          {title: 'Workers safety certified', key: 'workersSafetyCertified'},
          {title: 'Safety arrangements at site', key: 'safetyArrangements'},
          {title: 'Positioned at marked location', key: 'sitePositioned'},
          {
            title: 'Lateral support ensured before release',
            key: 'lateralSupportEnsured',
          },
        ];

        return (
          <View>
            {erectionProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.boringOfDiaphragmData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.STRIPPING_AND_STORING_TOP_SOIL:
        return (
          <View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.GenerateRFIFieldLabel}>
                Qty of Top Soil collected and stored (cum)
              </Text>
              <Text>
                {
                  selectedRFI?.metaData.strippingAndStoringTopSoilData
                    ?.topSoilCollectedStored
                }
              </Text>
            </View>
          </View>
        );
      case TASK_TYPES.SPREADING_AND_COMPACTION:
        const spreadingAndCompactionProperties = [
          {
            title: 'Source of material is approved',
            key: 'sourceOfMaterialApproved',
          },
          {
            title: 'Ground improvement is done if required',
            key: 'groundImprovementDone',
          },
          {
            title: 'Under laying layer is approved',
            key: 'underLayingLayerApproved',
          },
          {
            title:
              'Adequate grade and survey stakes available for control of layer placement',
            key: 'gradeSurveyStakesAvailable',
          },
          {
            title:
              'Adequate no. of grader available for spreading and levelling of fill',
            key: 'graderAvailable',
          },
          {
            title: 'Grading is done as per the required gradient and camber',
            key: 'gradingDoneAsPerRequirement',
          },
          {
            title:
              'Uniform sprinkling of water done on previous layer if required',
            key: 'uniformSprinklingDone',
          },
          {title: 'Dumping pattern is followed', key: 'dumpingPatternFollowed'},
          {
            title: 'Material free from deleterious material',
            key: 'materialFreeFromDeleterious',
          },
          {
            title: 'Material contains over size boulders/ stones',
            key: 'containsOverSizeBoulders',
          },
          {
            title: 'Loose thickness of layer checked',
            key: 'looseThicknessChecked',
          },
          {
            title: 'OMC is maintained before commencement of rolling',
            key: 'omcMaintained',
          },
          {
            title: 'Suitable roller available for compaction',
            key: 'suitableRollerAvailable',
          },
          {
            title: 'Number of passes, speed, and rolling pattern followed',
            key: 'rollingPatternFollowed',
          },
          {
            title: 'Finished compacted layer thickness is as specified',
            key: 'finishedLayerThicknessSpecified',
          },
          {
            title: 'Any localized wet, soft, and under compacted area found',
            key: 'localizedIssuesFound',
          },
          {
            title: 'Layer is free from segregation',
            key: 'layerFreeFromSegregation',
          },
          {
            title: 'Arrangement for protection of finished surface available',
            key: 'protectionOfFinishedSurfaceAvailable',
          },
          {
            title: 'Any non-conformance/ noncompliance found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {spreadingAndCompactionProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.spreadingAndCompactionData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PRIME_COAT:
      case TASK_TYPES.TACK_COAT:
        const primeCoatProperties = [
          {
            title: 'Previous Layer Approved',
            key: 'previousLayerApproved',
          },
          {
            title: 'Surface Preparation Satisfactory (Surface Condition)',
            key: 'surfacePreparationSatisfactory',
          },
          {
            title: 'Grade of Material Approved',
            key: 'materialGradeApproved',
          },
          {
            title: 'Bituminous Emulsion Temperature Checked',
            key: 'bituminousEmulsionTemperatureChecked',
          },
          {
            title: 'Uniform Rate of Spray',
            key: 'uniformSprayRate',
          },
          {
            title: 'Non-Conformance/Non-Compliance Found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {primeCoatProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.primeCoatData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ROAD_MARKING:
        const roadMarkingProperties = [
          {
            title: 'Drawing & Method Statement Approved by Client',
            key: 'drawingAndMethodApproved',
          },
          {
            title: 'Thermoplastic Paint & Glass Bead Approved by Client',
            key: 'thermoplasticAndGlassBeadApproved',
          },
          {
            title: 'Heater Condition and Laying Checked',
            key: 'heaterConditionChecked',
          },
          {
            title: 'Thermometer of Heater Working Properly',
            key: 'thermometerWorking',
          },
          {
            title: 'Thermoplastic Material Heated to Specified Temperature',
            key: 'materialHeatedToSpecifiedTemperature',
          },
          {
            title: 'Surface is Free from Dust, Dirt, Grease, and Oil',
            key: 'surfaceClean',
          },
          {
            title: 'Marking Done Before Laying Thermoplastic',
            key: 'markingDoneBeforeLaying',
          },
          {
            title: 'Glass Beads Applied at Rate of 250gms/sqm',
            key: 'glassBeadsApplied',
          },
          {
            title: 'Thermoplastic Paint Laid in Molten State',
            key: 'paintLaidInMoltenState',
          },
          {
            title: 'Thermoplastic Paint Thickness Checked',
            key: 'paintThicknessChecked',
          },
          {
            title: 'Non-conformance/Non-compliance Found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {roadMarkingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.roadMarkingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.LAYING_AND_COMPACTION:
        const layingAndCompactionProperties = [
          {
            title:
              'Whether all the safety measures has been taken as per the plan',
            key: 'safetyMeasuresTaken',
          },
          {
            title:
              'Approved methodology of work is available with the Paving-in-charge',
            key: 'approvedMethodologyAvailable',
          },
          {
            title: 'Prime coat is cured and cleaned properly',
            key: 'primeCoatCured',
          },
          {
            title:
              'Is the rate of spray for tact coat checked & recorded, if required',
            key: 'sprayRateChecked',
          },
          {
            title: 'Is the joint trimmed & prepared as per method statement',
            key: 'jointTrimmedPrepared',
          },
          {
            title:
              'Whether the program of laying conveyed to plant and machinery and QA/QC in-charges',
            key: 'programConveyed',
          },
          {
            title: 'Whether the thermometer is available at laying location',
            key: 'thermometerAvailable',
          },
          {
            title: 'Paver sensors are set as per requirement',
            key: 'paverSensorsSet',
          },
          {
            title:
              'Whether alignment of paving has been marked with lime powder and equipment’s positioned accordingly',
            key: 'alignmentMarked',
          },
          {
            title:
              'Whether the paver is placed at the laying area well in advance & the skeed of the paver is cleaned',
            key: 'paverPlacedCleaned',
          },
          {
            title:
              'Whether mix has been transported to paving location with the tarpaulin covering',
            key: 'mixTransported',
          },
          {
            title:
              'Whether mix temperature is found as per table 500-2 before spreading',
            key: 'mixTemperatureFound',
          },
          {
            title:
              'Whether loose thickness of layer has been checked to ensure required compacted layer thickness',
            key: 'looseThicknessChecked',
          },
          {
            title:
              'Whether rolling pattern is followed as established in the trial patch',
            key: 'rollingPatternFollowed',
          },
          {
            title:
              'Whether surface level has been checked and found within specified tolerance limit',
            key: 'surfaceLevelChecked',
          },
          {
            title:
              'Whether Transverse joints prepared is as per method statement',
            key: 'transverseJointsPrepared',
          },
          {
            title: 'Was a Non-conformance/Non-compliance found',
            key: 'nonConformanceFound',
          },
          {
            title: 'Thickness of Layer laid in mm',
            key: 'layerThickness',
          },
          {
            title: 'Total material qty laid in tonne',
            key: 'totalMaterialQtyLaid',
          },
          {
            title: 'Total material qty in Sqm',
            key: 'totalMaterialQtySqm',
          },
        ];

        return (
          <View>
            {layingAndCompactionProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.layingAndCompactionData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PIPE_LAYING_AND_JOINTING:
        const pipeLayingAndJointingProperties = [
          {
            title: 'Material checks and GFC drawings available',
            key: 'materialChecksGfcDrawingsAvailable',
          },
          {
            title: 'Pipe routing is as per the approved plan',
            key: 'pipeRoutingApproved',
          },
          {
            title: 'Hangers and supports are installed as per the design',
            key: 'hangersSupportsInstalled',
          },
          {
            title: 'Fasteners and hanger rods are checked and installed',
            key: 'fastenersHangerRodsChecked',
          },
          {
            title: 'Joint preparation is completed according to specifications',
            key: 'jointPreparationCompleted',
          },
          {
            title: 'Visual inspection of welded joints is completed',
            key: 'weldedJointsVisualInspection',
          },
          {
            title:
              'Threaded joints are prepared and tightened as per the standards',
            key: 'threadedJointsPreparedTightened',
          },
          {
            title: 'GI piping is installed and secured properly',
            key: 'giPipingInstalled',
          },
          {
            title: 'Pipe alignment is checked and verified',
            key: 'pipeAlignmentChecked',
          },
          {
            title: 'Total pipe length laid in meters',
            key: 'totalPipeLengthLaid',
          },
          {
            title: 'Total number of pipes laid',
            key: 'totalNumberPipesLaid',
          },
        ];

        return (
          <View>
            {pipeLayingAndJointingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.pipeLayingAndJointingData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_METAL_BEAM:
        const fixingOfMetalBeamProperties = [
          {
            title:
              'Distance maintained between barrier and start of embankment slope',
            key: 'barrierToEmbankmentDistance',
          },
          {
            title:
              'Distance maintained between barrier and edge of carriageway',
            key: 'barrierToEdgeOfCarriagewayDistance',
          },
          {
            title:
              'At median, W-beam face is 100 mm away from carriageway face of median',
            key: 'medianWBeamFaceDistance',
          },
          {
            title: 'All spacers installed properly as per approved drawing',
            key: 'spacersInstalledProperly',
          },
          {
            title: 'All bolts are fixed and tightened properly',
            key: 'boltsFixedAndTightened',
          },
          {
            title: 'Total Length of Metal Beam Fixed in RM',
            key: 'totalLengthOfMetalBeamFixed',
          },
        ];

        return (
          <View>
            {fixingOfMetalBeamProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfMetalBeamData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_VERTICAL_POST:
        const fixingVerticalPostProperties = [
          {
            title: 'Pits Dugged/Drilled to Depth Indicated on Plan',
            key: 'pitsDuggedToPlan',
          },
          {
            title:
              'Distance Maintained Between Barrier and Start of Embankment Slope',
            key: 'distanceMaintainedBarrierSlope',
          },
          {
            title:
              'Distance Maintained Between Barrier and Edge of Carriageway',
            key: 'distanceMaintainedBarrierCarriageway',
          },
          {
            title:
              'Posts Aligned Properly & Height Above Ground as per Approved Drawing',
            key: 'postsAlignedHeightAsPerDrawing',
          },
          {
            title: 'Steel Posts Placed as per Methodology',
            key: 'steelPostsPlacedMethodology',
          },
          {
            title: 'Total No. of Vertical Post Installed',
            key: 'totalVerticalPostInstalled',
          },
        ];

        return (
          <View>
            {fixingVerticalPostProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingVerticalPostData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.CUTTING_OF_JOINTS:
        const cuttingOfJointsProperties = [
          {
            title: 'Is joints cut at desired intervals',
            key: 'jointsCutAtDesiredIntervals',
          },
          {
            title: 'Is joint cut at desired depth',
            key: 'jointsCutAtDesiredDepth',
          },
          {title: 'Is joint cut done properly', key: 'jointCutDoneProperly'},
          {title: 'Total Length Completed in Km', key: 'totalLengthCompleted'},
        ];

        return (
          <View>
            {cuttingOfJointsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.cuttingOfJointsData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.LAYING_OF_PAVER_BLOCK:
        const layingOfPaverBlockProperties = [
          {
            title:
              'Top 150mm thick sub base layer spread levelled and compacted to 95% MMD?',
            key: 'subBaseLayerCompacted',
          },
          {
            title:
              'Washed sand of appropriate thickness 50 mm as laying course?',
            key: 'washedSandLayingCourse',
          },
          {
            title: 'Paving blocks are from approved source',
            key: 'approvedSourcePavingBlocks',
          },
          {
            title:
              'Paving blocks dimension and finishing as per approved material submitted and shop drawing?',
            key: 'blocksDimensionsAndFinishing',
          },
          {
            title:
              'Paving blocks installation/pattern done as per approved drawing?',
            key: 'installationPatternAsPerDrawing',
          },
          {
            title:
              'Check Whether the plate compactor has been moved on laid paving blocks with dune sand spread over it?',
            key: 'plateCompactorOnBlocks',
          },
          {
            title:
              'Check whether the joints between the paving blocks are as per method statement and joint filler spread on paving blocks and brushed between the blocks',
            key: 'jointsAsPerMethodStatement',
          },
          {
            title:
              'Location, Elevation, Level and Alignment of installed paver block are as per approved drawing and tolerances (+/- 6mm)',
            key: 'locationElevationLevelAlignment',
          },
          {
            title: 'Total length of paver block laid in RM',
            key: 'totalLengthLaid',
          },
          {
            title: 'Total sqm of paver blocks laid',
            key: 'totalSqmLaid',
          },
          {
            title: 'Thickness of paver block laid in mm',
            key: 'thicknessPaverBlockLaid',
          },
          {
            title: 'Grade of concrete of paver block',
            key: 'gradeOfConcretePaverBlock',
          },
        ];

        return (
          <View>
            {layingOfPaverBlockProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.layingOfPaverBlockData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.LAYING_OF_DLC:
        const layingOfDLCProperties = [
          {
            title: 'Is the mix design of DLC approved?',
            key: 'mixDesignApproved',
          },
          {
            title: 'Is the under laying GSB layer approved?',
            key: 'underLayingGSBApproved',
          },
          {
            title:
              'Are there adequate grade and survey stakes available for control of placement layers?',
            key: 'gradeSurveyStakesAvailable',
          },
          {
            title: 'Is the placing of material appropriate?',
            key: 'materialPlacingAppropriate',
          },
          {
            title: 'Is there paver available for the laying of DLC?',
            key: 'paverAvailable',
          },
          {
            title: 'Is the arrangement of curing available?',
            key: 'curingArrangementAvailable',
          },
          {
            title:
              'Are there adequate number of suitable rollers available for the compaction operation?',
            key: 'rollersAvailable',
          },
          {
            title: 'Is the layer free from any segregation?',
            key: 'layerFreeFromSegregation',
          },
          {
            title:
              'Is there any arrangement for protection of the finished surface?',
            key: 'protectionForFinishedSurface',
          },
          {
            title: 'Is there adequate arrangement of light for night work?',
            key: 'adequateLightForNightWork',
          },
          {
            title: 'Is the received batch slip as per approved mix design?',
            key: 'batchSlipApproved',
          },
          {
            title:
              'Whether the worker and staff have proper personal protection equipment (PPE)?',
            key: 'properPPEAvailable',
          },
          {
            title: 'Total length of DLC laid in mtr.',
            key: 'totalLengthLaidMtr',
          },
          {
            title: 'Total area of DLC laid in sqm.',
            key: 'totalAreaLaidSqm',
          },
        ];

        return (
          <View>
            {layingOfDLCProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.layingOfDLCData?.[property.key]}
                </Text>
              </View>
            ))}
            <ScrollView horizontal={true}>
              <View style={{flexDirection: 'column'}}>
                <SwipeListView
                  data={selectedRFI?.metaData.layingOfDlcTableData}
                  renderItem={renderItemLayingOfDlc}
                  renderSectionHeader={renderSectionHeaderLayingOfDlc}
                />
              </View>
            </ScrollView>
          </View>
        );
      case TASK_TYPES.MACHINE_CUTTING_OF_JOINTS:
        const machineCuttingOfJointsProperties = [
          {
            title: 'Is adequate no. of the cutting saws are available at site',
            key: 'cuttingSawsAvailable',
          },
          {
            title:
              'Is the adequate no. of diamond-edge saw blades available at site',
            key: 'diamondEdgeBladesAvailable',
          },
          {
            title:
              'Is water tank with proper flexible hose and pump available at site',
            key: 'waterTankAvailable',
          },
          {
            title:
              'Is machine cut started after 4-8 hr of initial setting time',
            key: 'machineCutStartedAfterSetting',
          },
          {
            title: 'Is cutting done as per approved drawing',
            key: 'cuttingDoneAsPerDrawing',
          },
        ];

        return (
          <View>
            {machineCuttingOfJointsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.machineCuttingOfJointsData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PLACING_OF_TIE_BAR:
        const placingOfTieBarProperties = [
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the placing is done as per drawings',
            key: 'placingDoneAsPerDrawings',
          },
          {
            title: 'Whether the alignment done properly',
            key: 'alignmentDoneProperly',
          },
          {
            title: 'Was a Non-conformance/Non-compliance found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {placingOfTieBarProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.placingOfTieBarData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_WIRE_ROPE:
        const fixingOfWireRopeProperties = [
          {
            title: 'Is the strands are from approved source',
            key: 'strandsFromApprovedSource',
          },
          {
            title: 'Are the end attachments cracked, deformed/ worn',
            key: 'endAttachmentsCondition',
          },
          {
            title: 'Is there evidence to heat damage',
            key: 'heatDamageEvidence',
          },
          {
            title: 'Is there kinking, crushing, bird caging or other damage',
            key: 'ropeDamageRectification',
          },
          {
            title: 'Are they aligned properly as per drawing',
            key: 'alignedProperlyAsPerDrawing',
          },
          {
            title: 'Is the strand tensioned tightly at ends',
            key: 'strandTensionedAtEnds',
          },
        ];

        return (
          <View>
            {fixingOfWireRopeProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfWireRopeData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PLACING_OF_DOWEL:
        const placingOfDowelProperties = [
          {
            title: 'Whether the PQC drawing approved',
            key: 'pqcDrawingApproved',
          },
          {
            title: 'Whether the dowel bars placed at the proper depth',
            key: 'barsProperDepth',
          },
          {
            title: 'Whether the bars are aligned properly',
            key: 'barsAlignedProperly',
          },
          {
            title: 'Is the dowel bar covered with plastic sheath',
            key: 'barCoveredWithSheath',
          },
          {
            title: 'Dia of the sheath in mm',
            key: 'sheathDia',
          },
          {
            title: 'Is sheath mouth closed properly',
            key: 'sheathMouthClosed',
          },
          {
            title: 'Is the Length of each dowel bar as per approved drawing',
            key: 'dowelBarLength',
          },
          {
            title: 'Total number of dowel bars',
            key: 'totalDowelBars',
          },
        ];

        return (
          <View>
            {placingOfDowelProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.placingOfDowelData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.TEXTURING:
        const texturingProperties = [
          {
            title:
              'Is a beam or bridge mounted with steel Tines/brush operate with automatic sensing and control devices from main paver',
            key: 'beamBridgeMounted',
          },
          {
            title:
              'Is Texturing not exceeded 120 min for temp. below 25 degrees and 90 min for temp. between 25-30 degrees',
            key: 'texturingTimeLimit',
          },
          {
            title:
              'Is the tining unit adjusted to the download pressure to produce the desired finish surface',
            key: 'tiningUnitAdjusted',
          },
          {
            title: 'Is the tining rakers cleaned properly',
            key: 'tiningRakersCleaned',
          },
          {
            title: 'Are the tines bent or damaged',
            key: 'tinesBentDamaged',
          },
          {
            title: 'Are the tined grooves 3mm wide and 3-4mm deep',
            key: 'tinedGroovesDimension',
          },
          {
            title: 'Is the bleeding done on the surface',
            key: 'bleedingDone',
          },
          {
            title: 'Is the brush applied in one direction',
            key: 'brushAppliedDirection',
          },
          {
            title: 'Is the brush for texturing as per Morth Specification',
            key: 'brushAsPerMorth',
          },
          {
            title: 'Total Texturing Done in Sqm',
            key: 'totalTexturingSqm',
          },
        ];

        return (
          <View>
            {texturingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.texturingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PLACING_OF_FILLER_BOARD:
        const placingOfFillerBoardProperties = [
          {
            title: 'Is the source of filler board material approved',
            key: 'sourceOfFillerBoardApproved',
          },
          {
            title:
              'Is the joint surface free from dust, flakes, or other particles',
            key: 'jointSurfaceFreeFromParticles',
          },
          {
            title: 'Is filler board cut in proper shape and size',
            key: 'fillerBoardProperShapeAndSize',
          },
          {
            title: 'Is placing of filler board done properly',
            key: 'fillerBoardPlacedProperly',
          },
          {
            title: 'Is the filler board compressed to the desired level',
            key: 'fillerBoardCompressed',
          },
          {
            title: 'Thickness of filler board in mm',
            key: 'fillerBoardThickness',
          },
          {
            title: 'Total qty of filler board laid in Sqmm',
            key: 'totalQtyFillerBoardLaid',
          },
        ];

        return (
          <View>
            {placingOfFillerBoardProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.placingOfFillerBoardData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.SEALANT_FILLING:
        const sealantFilingProperties = [
          {
            title: 'Is the sealant source approved?',
            key: 'sealantSourceApproved',
          },
          {
            title:
              'Is the joint face clean properly with wire brush to remove dust and oil using xylene or toluene?',
            key: 'jointFaceCleaned',
          },
          {
            title: 'Is the sealant placed at the proper depth?',
            key: 'sealantProperDepth',
          },
          {
            title: 'Is the two-coat primer done?',
            key: 'twoCoatPrimerDone',
          },
          {
            title: 'Is the tapping done at the edges of the joint face?',
            key: 'tappingDoneAtEdges',
          },
          {
            title: 'Is the sealant poured properly?',
            key: 'sealantPouredProperly',
          },
          {
            title: 'Is the tape removed after the tooling of the sealant?',
            key: 'tapeRemovedAfterTooling',
          },
          {
            title: 'Is the arrangement made for curing?',
            key: 'arrangementForCuring',
          },
          {
            title: 'Quantity of sealant utilized at site (in liters)',
            key: 'sealantQuantity',
          },
        ];

        return (
          <View>
            {sealantFilingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.sealantFilingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.MILLING_OF_FLEXIBLE_PAVEMENT:
        const millingFlexiblePavementProperties = [
          {
            title: 'Whether the milled surface is uniform in texture',
            key: 'milledSurfaceUniform',
          },
          {
            title:
              'Whether the finished milled surface is within 6-8 mm in both longitudinal and transverse directions',
            key: 'milledSurfaceWithinLimit',
          },
          {
            title: 'Is the texture surface safe for motorist',
            key: 'textureSafeForMotorist',
          },
          {
            title: 'Depth of milling in mm',
            key: 'depthOfMilling',
          },
          {
            title: 'Total qty of milled material obtained in cm',
            key: 'totalQtyMilledMaterial',
          },
          {
            title: 'Total surface area where milling is done in Sqmm',
            key: 'totalSurfaceAreaMilled',
          },
        ];

        return (
          <View>
            {millingFlexiblePavementProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>{selectedRFI?.metaData.millingData?.[property.key]}</Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.LAYING_OF_SEPARATION_MEMBRANE:
        const layingOfSeparationMembraneProperties = [
          {
            title:
              'The subbase / DLC layer swept clean of extraneous materials using air compressor and sprinkled with water to bring down the temperature of the PQC',
            key: 'subbaseSweptClean',
          },
          {
            title:
              'If any undulations visible after cleaning & sprinkling of water, it should be leveled with Mix of 10mm down aggregate to avoid restraint of Panel movement',
            key: 'undulationsLeveled',
          },
          {
            title:
              'Separation membrane shall be tight, straight, wrinkle free & anchored on Sub-base',
            key: 'membraneTightStraight',
          },
          {title: 'Colour of Separation Membrane', key: 'colourOfMembrane'},
          {
            title: 'Thickness of Separation Membrane',
            key: 'thicknessOfMembrane',
          },
          {
            title:
              'Proper overlapping provided in case of membrane is laid in part width',
            key: 'properOverlappingProvided',
          },
          {
            title: 'Finished Compacted Layer Thickness in mm',
            key: 'finishedCompactedLayerThickness',
          },
          {
            title: 'Any non-conformance/non-compliance found',
            key: 'nonConformanceFound',
          },
        ];

        return (
          <View>
            {layingOfSeparationMembraneProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.layingOfSeparationMembraneData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.LAYING_OF_PAVEMENT_QUALITY_CONCRETE:
        const layingOfPQCProperties = [
          {
            title:
              'Is the trail patch done and approved by the Engineer In Charge?',
            key: 'trailPatchApproved',
          },
          {
            title: 'Is the mix design of PQC approved?',
            key: 'mixDesignApproved',
          },
          {
            title: 'Is the under laying DLC layer approved?',
            key: 'dlcLayerApproved',
          },
          {
            title:
              'Are there adequate grade and survey stakes available for control of placement layers?',
            key: 'adequateGradeSurveyStakes',
          },
          {
            title:
              'The PQC material is being transported by covering the tippers with tarpaulin to protect from the weather?',
            key: 'pqcTransportedWithTarpaulin',
          },
          {
            title: 'Is sufficient number of labours available at laying site?',
            key: 'sufficientLaboursAvailable',
          },
          {
            title:
              'Is the separation membrane tight, straight, wrinkle-free & anchored on Sub Base?',
            key: 'separationMembraneTight',
          },
          {
            title:
              'Are the dowel bars in the contraction and construction joints tightly covered by thin plastic sheath?',
            key: 'dowelBarsCoveredWithSheath',
          },
          {
            title:
              'Is a backhoe bucket available for spreading of PQC mix to protect damaging of separation membrane?',
            key: 'backhoeBucketAvailable',
          },
          {
            title: 'Is the paver available for the laying of DLC?',
            key: 'paverAvailableForDLC',
          },
          {
            title: 'Is the functioning of the paver checked and verified?',
            key: 'paverFunctioningChecked',
          },
          {
            title: 'Is the material placed appropriately and uniformly?',
            key: 'materialPlacedAppropriately',
          },
          {
            title: 'Is the curing arrangement available?',
            key: 'curingArrangementAvailable',
          },
          {
            title: 'Is the segregation of layers free?',
            key: 'layersSegregationFree',
          },
          {
            title: 'Is the surface protection arranged?',
            key: 'surfaceProtectionArranged',
          },
          {
            title: 'Is the light arrangement for night work available?',
            key: 'lightArrangementForNightWork',
          },
          {
            title:
              'Is personal protective equipment (PPE) available for the workers?',
            key: 'ppeAvailable',
          },
          {
            title: 'Total PQC laid length in meters',
            key: 'totalPQCLaidLength',
          },
          {
            title: 'Total PQC laid area in sqm',
            key: 'totalPQCLaidArea',
          },
          {
            title: 'Thickness of PQC laid in mm',
            key: 'pqcThicknessLaid',
          },
          {
            title: 'Lead distance of PQC material in Km',
            key: 'pqcLeadDistance',
          },
        ];

        return (
          <View>
            {layingOfPQCProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.layingOfPQCData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.BACKFILLING:
        const backfillingProperties = [
          {
            title: 'Verify area is clear of debris and formwork materials',
            key: 'areaClearOfDebris',
          },
          {
            title:
              'Ensure backfilling starts after 7 days or 60% strength of concrete',
            key: 'backfillingTimingAppropriate',
          },
          {
            title:
              'Confirm fill materials are approved and comply with specifications',
            key: 'approvedFillMaterials',
          },
          {
            title: 'Check layer thickness does not exceed 200mm',
            key: 'layerThicknessCheck',
          },
          {
            title: 'Check compaction degree (95% according to Proctor test)',
            key: 'compactionDegreeCheck',
          },
          {
            title: 'Check required tests for each 200mm compacted layer',
            key: 'layerTestsDone',
          },
          {
            title: 'Verify level and elevation are correct',
            key: 'levelAndElevationVerified',
          },
          {
            title:
              'Ensure bedding material is compacted in trenches for services',
            key: 'beddingMaterialCompacted',
          },
          {
            title: 'Ensure waterproofing membrane, if any, is undamaged',
            key: 'waterproofingMembraneProtected',
          },
          {
            title: 'Ensure backfilling is complete and area is clean and tidy',
            key: 'backfillingCompleteAndClean',
          },
          {title: 'Total Quantity of Soil Used (cum)', key: 'totalSoilQtyUsed'},
        ];

        return (
          <View>
            {backfillingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.backfillingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.BRICKS_WORK:
        const bricksWorkProperties = [
          {
            title: 'Are the latest "Good for Construction" drawings available',
            key: 'drawingsAvailable',
          },
          {
            title: 'Are the size and Class of bricks as per approved drawing',
            key: 'bricksSizeClassAsPerDrawing',
          },
          {
            title: 'Are the required number of blocks available',
            key: 'requiredBlocksAvailable',
          },
          {
            title:
              'Has the hacking at contact surfaces of columns and beams been done',
            key: 'hackingDone',
          },
          {
            title:
              'Has cement mortar slurry been applied over the hacked surface',
            key: 'cementMortarApplied',
          },
          {
            title:
              'Have aluminium templates been used for door/window openings',
            key: 'aluminiumTemplatesUsed',
          },
          {
            title: 'Are the required tools available',
            key: 'requiredToolsAvailable',
          },
          {
            title: 'Are there any specific requirements from the client',
            key: 'clientSpecificRequirements',
          },
          {
            title: 'Is Cement of the approved grade and less than 1 month old',
            key: 'cementApprovedGrade',
          },
          {
            title: 'Is sand medium gritty, clean, and silt-free',
            key: 'sandCleanGritty',
          },
          {
            title:
              'Is the finished floor level button marked on the structural slab',
            key: 'floorLevelMarked',
          },
          {
            title: 'Are the markings for reference lines on the pillar done',
            key: 'pillarMarkingsDone',
          },
          {
            title:
              'Is the brickwork checked in vertical and horizontal directions',
            key: 'brickworkChecked',
          },
          {
            title: 'Total Area where Brick Work is to be done in Sqm',
            key: 'totalBrickWorkArea',
          },
          {title: 'Total Brick Work in Cum', key: 'totalBrickWorkCum'},
        ];

        return (
          <View>
            {bricksWorkProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.bricksWorkData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.CUTTING_OF_SOIL:
        const cuttingOfSoilProperties = [
          {
            title:
              'Whether the proper safety measure taken at the site for cutting of soil?',
            key: 'safetyMeasuresTaken',
          },
          {
            title:
              'Whether all the equipment and tools are available at site at time of cutting of soil?',
            key: 'equipmentAvailable',
          },
          {
            title: 'Whether the excavation done at required depth?',
            key: 'excavationDone',
          },
          {
            title: 'Total qty of soil cut in cum',
            key: 'totalSoilCutQty',
          },
        ];

        return (
          <View>
            {cuttingOfSoilProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.cuttingOfSoilData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      // Displaying Fixing Geo Cell form data in a read-only view
      case TASK_TYPES.FIXING_GEO_CELL:
        const fixingGeoCellProperties = [
          {
            title: 'Whether the source is approved',
            key: 'sourceApproved',
          },
          {
            title: 'Whether the method statement approved',
            key: 'methodStatementApproved',
          },
          {
            title: 'Whether the slope properly maintained',
            key: 'slopeMaintained',
          },
          {
            title: 'Whether the slope is properly compacted',
            key: 'slopeCompacted',
          },
          {
            title: 'Whether the Geo cell laid as per approved drawing',
            key: 'geoCellLaidAsPerDrawing',
          },
          {
            title: 'Whether joints of geo cell fixed properly',
            key: 'geoCellJointsFixedProperly',
          },
          {
            title: 'Whether the Geo cell size is same as per approved drawing',
            key: 'geoCellSizeAsPerDrawing',
          },
          {
            title: 'Total area where Geo cell placed in Sqm',
            key: 'totalGeoCellArea',
          },
          {
            title: 'Total consumption of Geo cell in Sqm',
            key: 'totalGeoCellConsumption',
          },
        ];

        return (
          <View>
            {fixingGeoCellProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingGeoCellData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_MESH:
        const fixingOfMeshProperties = [
          {
            title: 'Whether the source of approved',
            key: 'sourceApproved',
          },
          {
            title: 'Whether the size of mesh as per approved drawing',
            key: 'sizeMeshApproved',
          },
          {
            title:
              'Check for the damage of the wire mesh or not after the opening',
            key: 'damageWireMeshChecked',
          },
          {
            title:
              'Whether the Unit shall be stretched for removal of fold/bend after opening done or not',
            key: 'unitStretchedAfterOpening',
          },
          {
            title: 'Total area of the slope in Sqm',
            key: 'totalAreaSlopeSqm',
          },
          {
            title: 'Total qty of mesh in kg',
            key: 'totalQtyMeshKg',
          },
        ];

        return (
          <View>
            {fixingOfMeshProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfMeshData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.LAYING_OF_GRASS_TURF:
        const layingOfGrassTurfProperties = [
          {
            title: 'Ensure turfs are cut and will be planted within 24 hours',
            key: 'turfsCutPlantedWithin24hrs',
          },
          {
            title: 'Check that the base area is well prepared',
            key: 'baseAreaPrepared',
          },
          {
            title: 'Verify correct topsoil thickness',
            key: 'topsoilThicknessVerified',
          },
          {
            title:
              'Check suitable material to be used for top dressing (no gaps)',
            key: 'suitableTopDressingMaterial',
          },
          {
            title:
              'Check the turfing level; fill any sunken or depressed areas',
            key: 'turfingLevelChecked',
          },
          {
            title: 'Ensure water is sprayed upon completion of turfing work',
            key: 'waterSprayedCompletion',
          },
          {
            title:
              'Check that wood nailing is used to hold the turves in position',
            key: 'woodNailingUsed',
          },
          {
            title: 'Check the turfing arrangement and nailing pattern',
            key: 'turfingArrangementChecked',
          },
          {
            title: 'Check that the overall turfing work is visually acceptable',
            key: 'overallTurfingWorkAccepted',
          },
          {
            title: 'Ensure no vehicles enter or trespass the turfed area',
            key: 'noVehiclesTrespass',
          },
          {
            title:
              'Ensure hydroseeding is carried out properly with the correct method',
            key: 'hydroseedingMethodVerified',
          },
          {
            title: 'Fibromat installation properly done and secured',
            key: 'fibromatInstalled',
          },
          {
            title: 'Total Area Covered with Grass (sqm)',
            key: 'totalAreaCovered',
          },
        ];

        return (
          <View>
            {layingOfGrassTurfProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.layingOfGrassTurfData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.LAYING_OF_TOP_SOIL:
        const layingOfTopSoilProperties = [
          {
            title: 'Whether the soil is from approved source',
            key: 'soilFromApprovedSource',
          },
          {
            title:
              'Is the proper arrangement for the movement of vehicle in the area',
            key: 'vehicleMovementArrangement',
          },
          {
            title: 'Is the proper machinery and equipment available at site',
            key: 'machineryAvailableAtSite',
          },
          {
            title: 'Is the marking done at which level laying is to be done',
            key: 'markingDoneAtRequiredLevel',
          },
          {
            title: 'Total area where laying is done in Sqm',
            key: 'totalAreaSqm',
          },
          {
            title: 'Total quantity of soil in cum',
            key: 'totalQtyOfSoilCum',
          },
        ];

        return (
          <View>
            {layingOfTopSoilProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.layingOfTopSoilData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PLACING_AND_JOINTING_OF_CHUTE_MEMBERS:
        const placingAndJointingOfChuteMembersProperties = [
          {
            title: 'Whether the bottom soil layer compacted properly',
            key: 'bottomSoilCompacted',
          },
          {
            title: 'Whether the slope properly maintained',
            key: 'slopeMaintained',
          },
          {
            title: 'Whether chute lining done properly',
            key: 'chuteLiningDone',
          },
          {
            title: 'Whether the support for chute shuttering done properly',
            key: 'supportForChuteShuttering',
          },
          {
            title: 'Whether the joint done in line and level',
            key: 'jointInLineAndLevel',
          },
          {
            title: 'Whether the concrete placing arrangement done',
            key: 'concretePlacingArrangement',
          },
          {
            title: 'Total length of chute in meters',
            key: 'totalChuteLength',
          },
        ];

        return (
          <View>
            {placingAndJointingOfChuteMembersProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData
                      .placingAndJointingOfChuteMembersData?.[property.key]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PIT_EXCAVATION:
        const pitExcavationProperties = [
          {
            title:
              'Are there any underground utilities like sewers, water pipelines, cables',
            key: 'undergroundUtilities',
          },
          {
            title:
              'Check whether the excavated pits are adequately shored/ timbered',
            key: 'pitsShoredTimbered',
          },
          {
            title: 'Are the excavated areas provided with fences/ barricades',
            key: 'fencesBarricadesProvided',
          },
          {
            title:
              'Are the excavated material kept from the edge of the pit/ trench by at least 1m',
            key: 'excavatedMaterialKeptAway',
          },
          {
            title:
              'Are the heavy equipment such as cranes, shovels, back toe loaders etc. kept away at least 6m from the edge of excavated pit',
            key: 'heavyEquipmentKeptAway',
          },
          {
            title: 'Are danger signs provided near the excavated area',
            key: 'dangerSignsProvided',
          },
          {
            title: 'Means of access and exit from the work area provided',
            key: 'accessExitProvided',
          },
          {title: 'Check Set out', key: 'setOutChecked'},
          {
            title: 'Check Excavation Size with Tolerance (offset)',
            key: 'excavationSizeChecked',
          },
          {
            title: 'Check for Loose materials / Loose soil',
            key: 'looseMaterialsChecked',
          },
          {
            title:
              'Check bottom of excavation (indicate proposed GL/Basement level with respect to existing road level)',
            key: 'bottomOfExcavationChecked',
          },
        ];

        return (
          <View>
            {pitExcavationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.pitExcavationData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PLANTING_GRASS:
        const plantingGrassPropertiesView = [
          {
            title: 'Is grass seeding handled gently',
            key: 'grassSeedingHandledGently',
          },
          {
            title: 'Is grass seeding done after handling',
            key: 'grassSeedingDoneAfterHandling',
          },
          {
            title: 'Is the grass seeding protected from the sun and wind',
            key: 'grassSeedingProtectedFromSunWind',
          },
          {
            title: 'The grass seed kept moist',
            key: 'grassSeedKeptMoist',
          },
          {
            title: 'Is grass transport during cooler period',
            key: 'grassTransportDuringCoolerPeriod',
          },
          {
            title: 'Is seeding done as per approved drawing?',
            key: 'seedingDoneAsPerApprovedDrawing',
          },
          {
            title: 'Is the seeding watered properly for the growth',
            key: 'seedingWateredProperly',
          },
          {
            title: 'Control weeds near plantation',
            key: 'controlWeedsNearPlantation',
          },
          {
            title: 'Total Area Covered with Grass (sqm)',
            key: 'totalAreaCoveredWithGrass',
          },
        ];

        return (
          <View>
            {plantingGrassPropertiesView.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.plantingGrassData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PLANTING_TREES:
        const plantingTreesProperties = [
          {title: 'Is Plant Handle Gently?', key: 'handleGently'},
          {title: 'Is the Plant Root Kept in Moist?', key: 'rootKeptMoist'},
          {
            title: 'Is Planting Done as per Approved Drawing?',
            key: 'plantingDoneAsPerDrawing',
          },
          {
            title: 'Is the Watering Done Properly for Growth?',
            key: 'wateringDoneProperly',
          },
          {
            title: 'Control Weeds Near Plantation?',
            key: 'controlWeedsNearPlantation',
          },
          {title: 'Is Proper Barricading Done?', key: 'barricadingDone'},
          {
            title: 'Is the Height of the Plant as per Drawings?',
            key: 'heightAsPerDrawings',
          },
          {
            title: 'Is the Type of Plant as per Approved Drawings?',
            key: 'typeOfPlantAsPerDrawing',
          },
          {title: 'Total No. of Trees Planted', key: 'totalNoOfTreesPlanted'},
        ];

        return (
          <View>
            {plantingTreesProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.plantingTreesData[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PREPARATION_OF_SOIL:
        const preparationOfSoilDisplayProperties = [
          {
            title: 'Whether the soil dumped in 200mm layer',
            key: 'soilDumpedInLayer',
          },
          {
            title:
              'Whether the soil spread in proper length mentioned in drawing',
            key: 'soilSpreadProperLength',
          },
          {
            title: 'Whether the soil compacted properly',
            key: 'soilCompactedProperly',
          },
          {
            title: 'Total qty of soil prepared in cum',
            key: 'totalQtySoil',
          },
          {
            title: 'Total surface area of soil laid in sqm',
            key: 'totalSurfaceArea',
          },
        ];

        return (
          <View>
            {preparationOfSoilDisplayProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.preparationOfSoilData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.SPREADING_OF_GRASS_SEEDS:
        const spreadingOfGrassSeedsProperties = [
          {
            title: 'Is the seed from an approved source?',
            key: 'seedApprovedSource',
          },
          {
            title: 'Is the surface free from garbage and plastic material?',
            key: 'surfaceFreeFromGarbage',
          },
          {title: 'Is the surface well prepared?', key: 'surfaceWellPrepared'},
        ];

        return (
          <View>
            {spreadingOfGrassSeedsProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.spreadingOfGrassSeedsData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.WATERING:
        const wateringProperties = [
          {title: 'Whether the water is clean?', key: 'waterClean'},
          {
            title: 'Whether the watering is done three times a day?',
            key: 'wateringThreeTimesADay',
          },
          {
            title: 'Total Quantity of Water Used (in Litres)',
            key: 'totalQtyWaterUsed',
          },
        ];

        return (
          <View>
            {wateringProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.wateringData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PLANTATION:
        const plantationProperties = [
          {title: 'Is seeding handled gently', key: 'seedingHandledGently'},
          {
            title: 'Is plant seedings done after handling',
            key: 'seedingDoneAfterHandling',
          },
          {
            title: 'Is the plant seeding protected from the sun and wind',
            key: 'protectedFromSunWind',
          },
          {title: 'The plant seed kept in moist', key: 'seedKeptInMoist'},
          {
            title: 'Is seeding transport during cooler period',
            key: 'transportDuringCoolerPeriod',
          },
          {
            title: 'Is seeding done as per approved drawing?',
            key: 'seedingDoneAsPerDrawing',
          },
          {
            title: 'Is the seeding watered properly for the growth',
            key: 'seedingWateredProperly',
          },
          {
            title: 'Control weeds near plantation',
            key: 'controlWeedsNearPlantation',
          },
          {
            title:
              'Is proper barricading done around the plant to avoid animal damage',
            key: 'barricadingDone',
          },
          {
            title: 'Total number of plants planted',
            key: 'totalNoOfPlantsPlanted',
          },
          {title: 'Total area covered in sqm', key: 'totalAreaCovered'},
        ];

        return (
          <View>
            {plantationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.plantationData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.STONE_PITCHING:
        const stonePitchingProperties = [
          {
            title:
              'All related construction documents, material approvals, and shop drawings are in place and approved',
            key: 'documentsApprovalsInPlace',
          },
          {
            title: 'Work of other trades is completed and accepted',
            key: 'workOfOtherTradesCompleted',
          },
          {
            title: 'Whether the below layer is compacted',
            key: 'belowLayerCompacted',
          },
          {
            title: 'Whether the stone shape and size as per specification',
            key: 'stoneShapeSizeSpecification',
          },
          {
            title:
              'Whether the mortar bonding material is ready at the work area',
            key: 'mortarMaterialReady',
          },
          {
            title: 'Whether the mortar bonding with stone done properly',
            key: 'mortarBondingProper',
          },
          {
            title: 'Total surface area of stone pitching done in sqm',
            key: 'totalSurfaceArea',
          },
          {
            title: 'Total material laid in tonne',
            key: 'totalMaterialLaid',
          },
        ];

        return (
          <View>
            {stonePitchingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.stonePitchingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_INVERTER_INSTALLATION:
        const inverterInstallationProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether equipment inspected at site and factory dispatch clearance obtained',
            key: 'equipmentInspected',
          },
          {
            title:
              'Is there any damage to the equipment, if yes, informed to vendor',
            key: 'equipmentDamagedInformed',
          },
          {
            title: 'Whether foundation work is completed for installation',
            key: 'foundationWorkCompleted',
          },
          {
            title: 'Whether concrete components achieved desired strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation methodology approved',
            key: 'installationMethodologyApproved',
          },
          {
            title: 'Whether safety arrangements are in place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Whether sufficient machinery and manpower available',
            key: 'machineryAndManpowerAvailable',
          },
          {
            title: 'Installation completed as per approved methodology',
            key: 'installationCompletedAsPerMethodology',
          },
          {
            title:
              'All instructions from the manufacturer complied during installation',
            key: 'manufacturerInstructionsComplied',
          },
          {
            title: 'Total Number of Equipment Installed',
            key: 'totalEquipmentInstalled',
          },
        ];

        return (
          <View>
            {inverterInstallationProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.inverterInstallationData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ERECTION_OF_DOUBLE_POLE_STRUCTURE:
        const erectionOfDoublePoleStructureProperties = [
          {title: 'Drawings Approved', key: 'drawingsApproved'},
          {
            title: 'Structure Reached Site and Ready for Erection',
            key: 'structureAtSiteReady',
          },
          {
            title: 'Foundation Work Completed and Ready for Installation',
            key: 'foundationWorkCompleted',
          },
          {
            title: 'Concrete Components Achieved Desired Strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation Methodology Approved',
            key: 'installationMethodologyApproved',
          },
          {
            title: 'Safety Arrangements in Place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Sufficient Machinery and Manpower Available',
            key: 'machineryManpowerAvailable',
          },
          {
            title: 'Erection Completed as per Approved Methodology',
            key: 'erectionCompletedAsPerMethodology',
          },
          {
            title: 'Total No. of Double Pole Structures Erected',
            key: 'totalStructuresErected',
          },
        ];
        return (
          <View>
            {erectionOfDoublePoleStructureProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.erectionOfDoublePoleStructureData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_MC4_Y_CONNECTOR:
        const fixingOfMC4Properties = [
          {
            title:
              'Whether all the cables are connected using the MC 4/ Y connectors',
            key: 'cablesConnected',
          },
          {
            title: 'All connection checked physical and found OK',
            key: 'connectionsChecked',
          },
          {
            title: 'Total no. of Y connectors used',
            key: 'totalYConnectorsUsed',
          },
        ];

        return (
          <View>
            {fixingOfMC4Properties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfMC4Data?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_MMS:
        const fixingOfMMSProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether the material has been inspected at factory and dispatch clearance obtained',
            key: 'materialInspectedAtFactory',
          },
          {
            title:
              'Whether the material reached at site all ok and none of the part is damaged, damaged part informed to the contractor or not',
            key: 'materialReachedAtSite',
          },
          {
            title:
              'Whether the foundation has been completed in all respect including the casting of column post in its alignment properly',
            key: 'foundationCompleted',
          },
          {
            title: 'Whether the concrete has achieved the desired strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'The alignment of the MMS is as per the drawings or not',
            key: 'alignmentAsPerDrawings',
          },
          {
            title: 'Whether line / level checked or not',
            key: 'lineLevelChecked',
          },
          {
            title:
              'Whether the angle of the structure checked and found as per the drawings',
            key: 'angleOfStructureChecked',
          },
          {
            title:
              'Whether all the nut bolts are torqued properly and tested as per the specification',
            key: 'nutBoltsTorqued',
          },
          {
            title:
              'Whether MMS installed appears to be fit in all respect visually',
            key: 'mmsVisuallyFit',
          },
          {
            title:
              'Total no. of MMS structures in terms of no. of tables erected',
            key: 'totalNoOfTables',
          },
          {
            title: 'Total length of MMS structure completed in RM',
            key: 'totalLengthOfStructure',
          },
        ];

        return (
          <View>
            {fixingOfMMSProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfMMSData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_MODULES:
        const fixingOfModulesProperties = [
          {
            title: 'Whether the drawings are approved',
            key: 'drawingsApproved',
          },
          {
            title: 'Material inspected at the factory',
            key: 'materialInspectedFactory',
          },
          {
            title: 'Material has reached the site and is in OK condition',
            key: 'materialReachedSiteOk',
          },
          {
            title: 'MMS installation is completed',
            key: 'mmsInstallationCompleted',
          },
          {
            title: 'Alignment is as per drawings',
            key: 'alignmentAsPerDrawings',
          },
          {
            title: 'Line and level have been checked',
            key: 'lineLevelChecked',
          },
          {
            title: 'Module angle has been checked',
            key: 'moduleAngleChecked',
          },
          {
            title: 'Nut bolts have been torqued',
            key: 'nutBoltsTorqued',
          },
          {
            title: 'Modules fit visually',
            key: 'modulesFitVisually',
          },
          {
            title: 'Total number of modules mounted',
            key: 'totalModulesMounted',
          },
          {
            title: 'Total length of modules mounted (in meters)',
            key: 'totalLengthMounted',
          },
        ];

        return (
          <View>
            {fixingOfModulesProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfModulesData[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.LAYING_OF_CAUTION_TAPE:
        const layingCautionTapeProperties = [
          {
            title: 'Whether the Drawings Approved or Not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Are the size, shape and thickness of the caution tape as per the approved drawings/specifications',
            key: 'sizeShapeThicknessAsPerDrawings',
          },
          {
            title: 'Whether source of the material approved or not',
            key: 'sourceMaterialApproved',
          },
          {
            title: 'Whether the caution tape laid properly',
            key: 'cautionTapeLaidProperly',
          },
          {
            title:
              'Whether caution tape has been laid at desired depth and desired clearance above the cables',
            key: 'cautionTapeLaidAtDesiredDepth',
          },
          {
            title: 'Total length of caution tape laid in RM',
            key: 'totalCautionTapeLength',
          },
        ];

        return (
          <View>
            {layingCautionTapeProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.layingCautionTapeData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ROUTE_MARKING:
        const routeMarkingProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Are the size and shape of the markers as per the approved drawings/specifications',
            key: 'markersSizeShapeAsPerApproved',
          },
          {
            title: 'Whether source of the material approved or not',
            key: 'materialSourceApproved',
          },
          {
            title: 'Whether the layout marked at site or not',
            key: 'layoutMarkedAtSite',
          },
          {
            title: 'Whether route markers are fixed properly',
            key: 'routeMarkersFixedProperly',
          },
          {
            title: 'Whether spacing is as per the specifications',
            key: 'spacingAsPerSpecifications',
          },
          {
            title: 'Total no. of route markers installed at site in no.',
            key: 'totalRouteMarkersInstalled',
          },
          {title: 'Total length covered in RM', key: 'totalLengthCoveredRM'},
        ];
        return (
          <View>
            {routeMarkingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.routeMarkingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.BRICKS_LAYERING:
        const bricksLayeringDisplayProperties = [
          {
            title: 'Whether the Drawings Approved or Not',
            key: 'drawingsApproved',
          },
          {
            title: 'Are the Size and Class of Bricks as per Approved Drawing',
            key: 'bricksSizeClassApproved',
          },
          {
            title: 'Total Area of Brick Layering Completed (sqm)',
            key: 'totalAreaCompleted',
          },
          {
            title: 'Total No. of Bricks Laid (No)',
            key: 'totalBricksLaid',
          },
          {
            title: 'Total Length of Trench Completed (RM)',
            key: 'totalLengthTrenchCompleted',
          },
        ];

        return (
          <View>
            {bricksLayeringDisplayProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.bricksLayeringData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.CABLE_DRESSING:
        const cableDressingDisplayProperties = [
          {
            title:
              'Whether all the cables are tied properly to the MMS structure and no cables are hanging',
            key: 'cablesTiedProperly',
          },
          {
            title: 'No cable has been damaged found during the dressing',
            key: 'noCableDamaged',
          },
        ];

        return (
          <View>
            {cableDressingDisplayProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.cableDressingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.CABLE_TRENCH_DRESSING:
        const cableTrenchDressingProperties = [
          {
            title: 'Whether the proper safety measure taken at the site',
            key: 'safetyMeasuresTaken',
          },
          {
            title: 'Sufficient manpower available at site',
            key: 'manpowerAvailable',
          },
          {
            title: 'Line levels are checked properly',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Trench has been made free from undesirable material',
            key: 'trenchClearedUndesirableMaterial',
          },
          {
            title: 'Bottom of trench well compacted as per specifications',
            key: 'trenchCompacted',
          },
          {
            title: 'Total trench dressed in RM',
            key: 'totalTrenchDressed',
          },
        ];
        return (
          <View>
            {cableTrenchDressingProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.cableTrenchDressingData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.CONDUIT_LAYING:
        const conduitLayingProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Are the size and shape of the conduit as per the approved drawings/specifications',
            key: 'conduitSizeShapeAsPerSpecs',
          },
          {
            title: 'Whether source of the material approved or not',
            key: 'materialSourceApproved',
          },
          {
            title: 'Whether the conduit pipe laid properly',
            key: 'conduitPipeLaidProperly',
          },
          {
            title: 'Whether jointing has been done properly',
            key: 'jointingDoneProperly',
          },
          {
            title: 'Total Length of Conduit Laid in RM',
            key: 'totalConduitLength',
          },
        ];
        return (
          <View>
            {conduitLayingProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.conduitLayingData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.CABLE_TRENCH_EXCAVATION:
        const cableTrenchExcavationProperties = [
          {
            title:
              'Whether the proper safety measure taken at the site before excavation of trench',
            key: 'safetyMeasuresTaken',
          },
          {title: 'Drawings approved', key: 'drawingsApproved'},
          {title: 'Alignment of trench marked at site', key: 'alignmentMarked'},
          {
            title:
              'Whether any utility infringing the alignment has been shifted',
            key: 'utilitiesShifted',
          },
          {
            title: 'Whether the excavation done at required depth and width',
            key: 'excavationDepthWidth',
          },
          {
            title: 'Total qty of soil excavated in Cum',
            key: 'totalSoilQtyExcavated',
          },
          {title: 'Total trench excavated in RM', key: 'totalTrenchExcavated'},
        ];
        return (
          <View>
            {cableTrenchExcavationProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.cableTrenchExcavationData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_LT_PANEL:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_SERVO:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_MCB:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_INVERTOR:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_HT_PANEL:
      case TASK_TYPES.FIXING_AND_INSTALLATION_OF_TRANSFORMER:
        const fixingAndInstallationProperties = [
          {
            title: 'Whether the Drawings approved or not',
            key: 'drawingsApproved',
          },
          {
            title:
              'Whether the equipment inspected at site and factory dispatch clearance obtained',
            key: 'equipmentInspected',
          },
          {
            title:
              'Is there any damage to the equipment, if yes informed to vendor',
            key: 'equipmentDamageInformed',
          },
          {
            title: 'Whether the equipment foundation work completed and ready',
            key: 'foundationReady',
          },
          {
            title:
              'Whether the concrete components of the foundations achieved desired strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation methodology approved',
            key: 'installationMethodologyApproved',
          },
          {
            title: 'Whether safety arrangements in place prior to installation',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Sufficient machinery and manpower available',
            key: 'machineryManpowerAvailable',
          },
          {
            title: 'Installation completed as per approved methodology',
            key: 'installationCompleted',
          },
          {
            title: 'All manufacturer instructions complied during installation',
            key: 'manufacturerInstructionsComplied',
          },
          {
            title: 'Total no. of equipment installed',
            key: 'totalEquipmentInstalled',
          },
        ];
        return (
          <View>
            {fixingAndInstallationProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.fixingAndInstallationData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.HT_PANEL_INSTALLATION:
        const htPanelInstallationProperties = [
          {title: 'Whether the Drawings Approved', key: 'drawingsApproved'},
          {
            title: 'Equipment Inspected & Factory Dispatch Clearance Obtained',
            key: 'equipmentInspected',
          },
          {
            title: 'Equipment Damage Reported to Vendor',
            key: 'equipmentDamageReported',
          },
          {
            title: 'Foundation Work Completed and Ready for Installation',
            key: 'foundationWorkCompleted',
          },
          {
            title: 'Concrete Components Achieved Desired Strength',
            key: 'concreteStrengthAchieved',
          },
          {
            title: 'Installation Methodology Approved',
            key: 'installationMethodologyApproved',
          },
          {
            title: 'All Safety Arrangements in Place',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Sufficient Machinery and Manpower Available',
            key: 'machineryAndManpowerAvailable',
          },
          {
            title: 'Installation Completed as per Approved Methodology',
            key: 'installationCompleted',
          },
          {
            title: 'Manufacturer Instructions Followed during Installation',
            key: 'manufacturerInstructionsFollowed',
          },
          {
            title: 'Total No. of Equipment Installed',
            key: 'totalEquipmentsInstalled',
          },
        ];
        return (
          <View>
            {htPanelInstallationProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.htPanelInstallationData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ERECTION_OF_STRUCTURE:
        const erectionOfStructureDisplayProperties = [
          {title: 'Whether the Position checked', key: 'positionChecked'},
          {
            title: 'Whether the Welding done as per the approved drawing',
            key: 'weldingDoneAsPerDrawing',
          },
          {
            title: 'Whether the Structure is as per approved drawing',
            key: 'structureAsPerDrawing',
          },
          {
            title: 'Whether the Necessary support provided',
            key: 'necessarySupportProvided',
          },
        ];

        return (
          <View>
            {erectionOfStructureDisplayProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.erectionOfStructureData?.[
                    property.key
                  ] ?? 'N/A'}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FABRICATION_OF_STRUCTURE:
        const fabricationOfStructureProperties = [
          {
            title: 'Is Steel Inspection for Surface Condition',
            key: 'steelInspection',
          },
          {
            title: 'Is Section Checked for Dimension and as per GFC',
            key: 'sectionChecked',
          },
          {
            title: 'Is Material Specification Checked as per GFC',
            key: 'materialSpecificationChecked',
          },
          {title: 'Is Connection Checked as per GFC', key: 'connectionChecked'},
          {title: 'Are Bolt Holes Clean and to Size', key: 'boltHolesClean'},
          {title: 'Only Approved Welders Used', key: 'approvedWeldersUsed'},
          {title: 'Welds Identified as per Welder ID', key: 'weldsIdentified'},
          {
            title: 'Welds Inspected for Dimension, Shape, Location',
            key: 'weldsInspected',
          },
          {title: 'Welds Repaired as Required', key: 'weldsRepaired'},
          {
            title: 'Shape Edge Burns and Weld Spatter Removed',
            key: 'shapeEdgeBurnsRemoved',
          },
          {
            title: 'Oil/Grease Removed Before Final Cleaning',
            key: 'oilGreaseRemoved',
          },
          {
            title: 'Steel Cleaned and Painted as per Specification',
            key: 'steelCleanedAndPainted',
          },
          {
            title: 'Final Shop Coat Applied as per Approved Color',
            key: 'finalShopCoatApplied',
          },
          {
            title: 'Each Structure Marked for Erection as per Scope',
            key: 'structureMarkedForErection',
          },
          {
            title: 'Structure Approved by Inspector Prior to Shipment',
            key: 'structureApprovedPriorShipment',
          },
        ];
        return (
          <View>
            {fabricationOfStructureProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.fabricationOfStructureData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_PANELS:
        const fixingOfPanelsProperties = [
          {
            title: 'Is the bus shelter drawing approved',
            key: 'drawingApproved',
          },
          {
            title: 'Is the material source approved',
            key: 'materialSourceApproved',
          },
          {
            title:
              'Is the shape and size of panel same as mentioned in drawing',
            key: 'panelShapeSizeAsDrawing',
          },
          {title: 'Are bolts and holes aligned', key: 'boltsAligned'},
          {title: 'Are the panels fixed in line', key: 'panelsFixedInLine'},
          {title: 'Are the all bolts fully torqued', key: 'boltsFullyTorqued'},
          {title: 'Total no. of Panels Installed', key: 'totalPanelsInstalled'},
          {
            title: 'Total no. of Bus Shelter Completed',
            key: 'totalBusShelterCompleted',
          },
        ];
        return (
          <View>
            {fixingOfPanelsProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfPanelsData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ERECTION_OF_PRECAST_COLUMN:
        const erectionPreCastColumnProperties = [
          {title: 'Is the Drawing Approved', key: 'drawingApproved'},
          {
            title: 'Pre-Cast Columns from Approved Source',
            key: 'columnsFromApprovedSource',
          },
          {title: 'Is Any Column Damaged', key: 'columnDamaged'},
          {
            title: 'Erection is as per the Drawing',
            key: 'erectionAsPerDrawing',
          },
          {title: 'Line and Level Checked Properly', key: 'lineLevelChecked'},
          {
            title: 'Dimensions of the Column are as per Drawing',
            key: 'dimensionsAsPerDrawing',
          },
          {
            title: 'Spacing of Columns is as per Approved Drawing',
            key: 'columnSpacingAsPerDrawing',
          },
          {
            title: 'Total No. of Columns Erected in No.',
            key: 'totalNoOfColumnsErected',
          },
          {
            title: 'Total Length of B/Wall Covered in RM',
            key: 'totalLengthOfBwallCovered',
          },
        ];
        return (
          <View>
            {erectionPreCastColumnProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfPanelsData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ERECTION_OF_BUS_SHELTER:
        const erectionOfBusShelterProperties = [
          {
            title: 'Whether source of material approved or not',
            key: 'materialSourceApproved',
          },
          {
            title: 'Whether the drawings approved',
            key: 'drawingsApproved',
          },
          {
            title: 'Is the supporting surface checked and found OK',
            key: 'supportingSurfaceChecked',
          },
          {
            title: 'Are sufficient safety arrangements in place at site',
            key: 'safetyArrangementsInPlace',
          },
          {
            title: 'Total No. of Panels Installed',
            key: 'totalPanelsInstalled',
          },
          {
            title: 'Total No. of Bus Stands Completed',
            key: 'totalBusStandsCompleted',
          },
        ];
        return (
          <View>
            {erectionOfBusShelterProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.erectionOfBusShelterData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ERECTION_OF_ANGLE_SECTION:
        const erectionOfAngleSectionProperties = [
          {
            title: 'Check all the angles are from approved source',
            key: 'anglesFromApprovedSource',
          },
          {
            title:
              'Material inspection at factory done and clearance for dispatch obtained',
            key: 'materialInspectionClearance',
          },
          {
            title:
              'Whether any material reached at site is damaged, if yes, whether informed to supplier',
            key: 'materialDamagedInformed',
          },
          {
            title: 'Erection done as per approved drawing',
            key: 'erectionAsPerDrawing',
          },
          {
            title: 'Alignment, plumb, fixing, and temporary support all ok',
            key: 'alignmentSupportOk',
          },
          {title: 'Total column/angles erected', key: 'totalAnglesErected'},
        ];
        return (
          <View>
            {erectionOfAngleSectionProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.erectionOfAngleSectionData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PLACING_OF_PRE_CAST_RCC_PANELS:
        const preCastRccPanelProperties = [
          {title: 'Whether drawing approved', key: 'drawingApproved'},
          {
            title: 'Check all the pre cast panels are from approved source',
            key: 'panelsFromApprovedSource',
          },
          {
            title:
              'Whether any panel found damaged, especially at the male-female joint',
            key: 'damagedPanelFound',
          },
          {
            title: 'Alignment, plumb, fixing, and temporary support',
            key: 'alignmentPlumbFixingSupport',
          },
          {
            title: 'Total no. of panels installed in nos.',
            key: 'totalPanelsInstalled',
          },
          {
            title: 'Total area of panels installed in sqm',
            key: 'totalAreaInstalled',
          },
        ];
        return (
          <View>
            {preCastRccPanelProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.preCastRccPanelData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PLACING_OF_CHAIN_LINK:
        const placingChainLinkDisplayProperties = [
          {title: 'Is the drawing approved', key: 'drawingApproved'},
          {
            title: 'Is fencing installed in accordance with the plot plan?',
            key: 'fencingInstalledAsPerPlotPlan',
          },
          {
            title:
              'Are all fittings, caps, tension bars, hinges, and hardware installed properly?',
            key: 'fittingsCapsTensionBarsHingesHardwareInstalled',
          },
          {
            title: 'Are corner and end posts firmly anchored and supported?',
            key: 'cornerEndPostsAnchoredSupported',
          },
          {
            title: 'Are all fence components free from defects in workmanship?',
            key: 'fenceComponentsDefectFree',
          },
          {
            title:
              'Has the fence been installed at the correct height requirement?',
            key: 'fenceInstalledAtCorrectHeight',
          },
          {
            title: 'Does the fence end with a terminal post?',
            key: 'fenceEndsWithTerminalPost',
          },
          {
            title: 'Are appropriate fasteners used?',
            key: 'appropriateFastenersUsed',
          },
          {
            title: 'Is there damaged mesh, if yes informed to the supplier?',
            key: 'damagedMeshInformedSupplier',
          },
          {
            title:
              'Are there missing or damaged components such as the tension wire, tension bar, tension band, or ties?',
            key: 'missingDamagedComponents',
          },
          {
            title:
              'Is there too much movement on the top rail between end post, line post, and terminal post?',
            key: 'tooMuchMovementTopRail',
          },
          {
            title:
              'Has the right fencing material been used according to the detail?',
            key: 'rightFencingMaterialUsed',
          },
          {
            title:
              'Is the required fence gap present (from soil to the fence mesh)?',
            key: 'requiredFenceGapPresent',
          },
          {
            title: 'Is the mesh and tension wire/band too loose?',
            key: 'meshTensionWireLoose',
          },
          {
            title: 'Total Sqm of Fence Installed',
            key: 'totalSqmFenceInstalled',
          },
        ];

        return (
          <View>
            {placingChainLinkDisplayProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.placingChainLinkData?.[property.key] ||
                    'N/A'}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.MORTAR_CHECKLIST:
        const mortarChecklistProperties = [
          {
            title: 'Is the mortar mix uniform and of optimal workability?',
            key: 'mortarMixUniform',
          },
          {
            title:
              'Is there a sufficient quantity of mortar mixed for the next 30 minutes?',
            key: 'sufficientMortarQuantity',
          },
          {
            title: 'Is the block work in proper alignment and plumb?',
            key: 'blockAlignmentPlumb',
          },
          {
            title: 'Have all the joints been staggered and raked properly?',
            key: 'jointsStaggered',
          },
          {
            title:
              'Is mortar placed between the edge of the block and the column?',
            key: 'mortarBetweenBlockAndColumn',
          },
          {
            title: 'Total Cement Bag Consumed (in no.)',
            key: 'totalCementBagsConsumed',
          },
          {
            title: 'Total Surface Area to be Plastered (in sqm)',
            key: 'totalSurfaceAreaToBePlastered',
          },
          {
            title: 'Total Quantity of Mortar Used (in cum)',
            key: 'totalMortarUsed',
          },
        ];
        return (
          <View>
            {mortarChecklistProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.mortarChecklistData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FLOORING:
        const flooringProperties = [
          {
            title: 'Flooring Material Source Approved',
            key: 'flooringMaterialSourceApproved',
          },
          {title: 'Tiles Free from Cracks', key: 'tilesCrackFree'},
          {
            title: 'Cracks, Holes or Uneven Surface',
            key: 'cracksHolesUnevenSurface',
          },
          {
            title: 'Joints at Transition Smooth',
            key: 'jointsAtTransitionSmooth',
          },
          {
            title: 'Flooring Done at Entry/Exit Ramps',
            key: 'flooringDoneAtRamps',
          },
          {title: 'Total Surface Area Done (Sqm)', key: 'totalSurfaceArea'},
          {title: 'Total Number of Tiles Used', key: 'totalTilesUsed'},
        ];
        return (
          <View>
            {flooringProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.flooringData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.SIGNAGE_LOCATION_IDENTIFICATION:
        const signageLocationProperties = [
          {title: 'Whether the drawing is approved', key: 'drawingApproved'},
          {
            title: 'Whether the location is marked using temporary arrangement',
            key: 'locationMarked',
          },
          {
            title: 'Whether the marked location is checked by engineer',
            key: 'locationCheckedByEngineer',
          },
          {
            title: 'Whether the location has no hindrance in installation',
            key: 'noHindranceInInstallation',
          },
        ];
        return (
          <View>
            {signageLocationProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.signageLocationData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.BACKFILL:
        const backfillProperties = [
          {
            title:
              'Verify that the excavated area to be backfilled is clear of debris and formwork materials',
            key: 'areaClearOfDebris',
          },
          {
            title:
              'Confirm that the fill materials are approved and test results comply with the specifications',
            key: 'fillMaterialsApproved',
          },
          {
            title:
              'Ensure avoidance of damage to the cables, caution tapes, or other things laid in the trench',
            key: 'noDamageToCables',
          },
          {
            title:
              'Ensure the backfilling is complete and the area is clean and tidy',
            key: 'backfillingComplete',
          },
          {
            title: 'Total Qty of Soil Used in cum',
            key: 'totalQtySoilUsed',
          },
          {
            title: 'Total Length of Trench Backfilled in RM',
            key: 'totalLengthTrenchBackfilled',
          },
        ];
        return (
          <View>
            {backfillProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.backfillData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.PLACEMENT_OF_SIGNAGE_SHEET:
        const placementOfSignageSheetProperties = [
          {
            title: 'Whether the material source is approved',
            key: 'materialSourceApproved',
          },
          {title: 'Whether the drawings approved', key: 'drawingsApproved'},
          {
            title: 'Whether the letter size is as per approved drawing',
            key: 'letterSizeAsPerDrawing',
          },
          {
            title: 'Whether riveted properly in the frame',
            key: 'rivetedProperlyInFrame',
          },
          {
            title: 'Whether placed as per approved drawing',
            key: 'placedAsPerDrawing',
          },
          {title: 'Total Sheet Fixed in Sqm', key: 'totalSheetFixed'},
          {
            title: 'Total Length of Road Covered in Km',
            key: 'totalRoadLengthCovered',
          },
        ];
        return (
          <View>
            {placementOfSignageSheetProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.placementOfSignageSheetData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_TRAFFIC_IMPACT_ATTENUATORS:
        const trafficImpactAttenuatorsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeAsPerDrawing',
          },
          {
            title: 'Whether the fixing methodology approved',
            key: 'fixingMethodologyApproved',
          },
          {
            title:
              'Whether attenuators fixed properly as per the approved method and drawings',
            key: 'attenuatorsFixedProperly',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
          {
            title: 'Total No. of Attenuators Installed',
            key: 'totalNoOfAttenuatorsInstalled',
          },
          {
            title: 'Total Length of Road Covered in Km',
            key: 'totalLengthOfRoadCovered',
          },
        ];
        return (
          <View>
            {trafficImpactAttenuatorsProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.trafficImpactAttenuatorsData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_SPRING_POST:
        const fixingOfSpringPostProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeAndSizeAsPerDrawing',
          },
          {
            title: 'Whether posts are fixed properly',
            key: 'postsFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineAndLevelChecked',
          },
          {
            title: 'Whether the spacing between them are as per specifications',
            key: 'spacingAsPerSpecification',
          },
          {
            title: 'Whether items are properly cleaned and visible',
            key: 'itemsCleanedAndVisible',
          },
          {
            title: 'Nos of Spring Post Installed',
            key: 'springPostInstalled',
          },
          {
            title: 'Total Length of Road Covered in km',
            key: 'totalRoadLengthCovered',
          },
        ];
        return (
          <View>
            {fixingOfSpringPostProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfSpringPostData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_SOLAR_ROAD_STUDS:
        const fixingOfSolarRoadStudsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeAsPerDrawing',
          },
          {
            title:
              'Whether the color code and locations are as per specification',
            key: 'colorCodeAndLocationAsPerSpec',
          },
          {
            title: 'Whether studs are fixed properly',
            key: 'studsFixedProperly',
          },
          {title: 'Whether line checked properly', key: 'lineCheckedProperly'},
          {
            title: 'Whether the spacing is as per specifications',
            key: 'spacingAsPerSpecs',
          },
          {
            title: 'Whether items are clean and visible properly',
            key: 'itemsCleanVisible',
          },
          {
            title: 'Nos of Road Studs Installed',
            key: 'noOfRoadStuds',
          },
          {
            title: 'Total Length of Road Covered in Km',
            key: 'totalLengthCovered',
          },
        ];
        return (
          <View>
            {fixingOfSolarRoadStudsProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.fixingOfSolarRoadStudsData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_SOLAR_BLINKERS:
        const fixingOfSolarBlinkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeAndSizeAsPerDrawing',
          },
          {
            title: 'Whether blinkers are in working condition',
            key: 'blinkersWorkingCondition',
          },
          {
            title: 'Whether blinkers are fixed properly?',
            key: 'blinkersFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineLevelChecked',
          },
          {
            title: 'Whether items are properly cleaned and visible',
            key: 'itemsCleanedAndVisible',
          },
          {
            title: 'Total No. of Blinkers Installed',
            key: 'totalBlinkersInstalled',
          },
          {
            title: 'Total Length of Road Covered in Km',
            key: 'totalRoadLengthCovered',
          },
        ];
        return (
          <View>
            {fixingOfSolarBlinkersProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.fixingOfSolarBlinkersData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_ROAD_STUDS:
        const fixingOfRoadStudsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size are as per approved drawing',
            key: 'shapeAndSizeAsPerDrawing',
          },
          {
            title:
              'Whether the color code and locations are as per specification and approved drawings',
            key: 'colorCodeAndLocationAsPerSpecification',
          },
          {
            title: 'Whether studs are fixed properly',
            key: 'studsFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineAndLevelChecked',
          },
          {
            title: 'Whether the spacing is as per the specification',
            key: 'spacingAsPerSpecification',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
          {
            title: 'Nos of Road Studs Installed (in nos.)',
            key: 'roadStudsInstalled',
          },
          {
            title: 'Total Length of Road Covered (in Km)',
            key: 'totalLengthCovered',
          },
        ];
        return (
          <View>
            {fixingOfRoadStudsProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfRoadStudsData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_ROAD_DELINEATORS:
        const fixingOfRoadDelineatorsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeAsPerDrawing',
          },
          {
            title: 'Whether the delineators fixed properly',
            key: 'delineatorsFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineLevelChecked',
          },
          {
            title:
              'Whether the spacing between delineator is as per specifications',
            key: 'spacingBetweenDelineators',
          },
          {
            title: 'Nos of Delineators Installed',
            key: 'nosOfDelineatorsInstalled',
          },
          {
            title: 'Total Length the Road Covered in Km',
            key: 'totalLengthRoadCovered',
          },
        ];
        return (
          <View>
            {fixingOfRoadDelineatorsProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.fixingOfRoadDelineatorsData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_OBJECT_MARKERS:
        const fixingOfObjectMarkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the markers fixed properly?',
            key: 'markersFixedProperly',
          },
          {
            title: 'Whether line and levels checked properly',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
          {
            title: 'Total no. of markers installed',
            key: 'totalMarkersInstalled',
          },
          {
            title: 'Total length of highway covered in Km',
            key: 'totalLengthCoveredKm',
          },
        ];
        return (
          <View>
            {fixingOfObjectMarkersProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.fixingOfObjectMarkersData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_NOISE_BARRIER:
        const fixingOfNoiseBarrierProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the posts fixed at crash barrier properly',
            key: 'postsFixedProperly',
          },
          {
            title: 'Whether posts are in proper line and level',
            key: 'postsLineLevelChecked',
          },
          {
            title:
              'Whether there is gap left between crash barrier and noise barrier',
            key: 'gapBetweenCrashAndNoiseBarrier',
          },
          {
            title: 'Whether the frame fixed tightly with posts',
            key: 'frameFixedTightly',
          },
          {
            title: 'Nos of noise barrier panels installed',
            key: 'totalNoiseBarrierPanelsInstalled',
          },
          {
            title: 'Total length of noise barrier fixed at crash barrier in RM',
            key: 'totalLengthNoiseBarrierFixedRM',
          },
        ];

        return (
          <View>
            {fixingOfNoiseBarrierProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.fixingOfNoiseBarrierData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_LED_TRAFFIC_BLINKERS:
        const fixingOfLEDTrafficBlinkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the items are in working condition',
            key: 'workingCondition',
          },
          {
            title: 'Whether items are fixed properly',
            key: 'itemsFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineLevelChecked',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
          {
            title: 'Total no. of blinkers installed',
            key: 'totalBlinkersInstalled',
          },
          {
            title: 'Total length of highway covered in Km',
            key: 'totalHighwayLengthCovered',
          },
        ];

        return (
          <View>
            {fixingOfLEDTrafficBlinkersProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.fixingOfLEDTrafficBlinkersData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_HAZARD_MARKERS:
        const fixingOfHazardMarkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawings',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the markers fixed properly?',
            key: 'markersFixedProperly',
          },
          {
            title: 'Whether line and level checked',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
          {
            title: 'Total no. of hazard markers installed',
            key: 'totalMarkersInstalled',
          },
          {
            title: 'Total length of highway covered in Km',
            key: 'totalLengthCoveredKm',
          },
        ];
        return (
          <View>
            {fixingOfHazardMarkersProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.fixingOfHazardMarkersData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_FLEXIBLE_MEDIAN_MARKERS:
        const fixingOfFlexibleMedianMarkersProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the flexible median marker fixed properly',
            key: 'markersFixedProperly',
          },
          {
            title: 'Whether line and level checked properly',
            key: 'lineLevelsChecked',
          },
          {
            title: 'Whether the spacing is as per specifications',
            key: 'spacingAsPerSpecifications',
          },
          {
            title: 'Whether items are cleaned and visible properly',
            key: 'itemsCleanedVisible',
          },
          {
            title: 'Nos of flexible median marker installed',
            key: 'totalMarkersInstalled',
          },
          {
            title: 'Total length of the road covered in Km',
            key: 'totalLengthCoveredKm',
          },
        ];

        return (
          <View>
            {fixingOfFlexibleMedianMarkersProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.fixingOfFlexibleMedianMarkersData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_CONVEX_MIRRORS:
        const fixingOfConvexMirrorsProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether items are in working condition',
            key: 'workingCondition',
          },
          {
            title: 'Whether mirrors fixed properly at proper location',
            key: 'mirrorsFixedProperly',
          },
          {
            title: 'Whether line, level and angle checked properly',
            key: 'lineLevelAngleChecked',
          },
          {
            title: 'Whether items are clean and visible properly',
            key: 'itemsCleanVisible',
          },
          {
            title: 'Total no. of mirrors installed',
            key: 'totalMirrorsInstalled',
          },
          {
            title: 'Total length of highway covered in Km',
            key: 'totalLengthCoveredKm',
          },
        ];

        return (
          <View>
            {fixingOfConvexMirrorsProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.fixingOfConvexMirrorsData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_ANTIGLARES:
        const fixingOfAntiglaresProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether items are fixed properly',
            key: 'itemsFixedProperly',
          },
          {title: 'Whether line and level checked', key: 'lineLevelsChecked'},
          {
            title: 'Whether the spacing are as per specifications',
            key: 'spacingAsPerSpecifications',
          },
          {
            title: 'Whether items are clean and visible properly',
            key: 'itemsCleanVisible',
          },
          {
            title: 'Total Nos of Antiglares installed',
            key: 'totalAntiglaresInstalled',
          },
          {
            title: 'Total length of the road covered in Km',
            key: 'totalLengthCoveredKm',
          },
        ];

        return (
          <View>
            {fixingOfAntiglaresProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfAntiglaresData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.ERECTION_OF_POLES:
        const erectionOfPolesProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {title: 'Whether the source approved or not', key: 'sourceApproved'},
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title:
              'Whether foundations are ready and concrete has achieved the desired strength',
            key: 'foundationsReady',
          },
          {
            title:
              'All the poles are erected properly with alignment as per drawings',
            key: 'polesAlignedProperly',
          },
          {
            title: 'All the nut bolts are tightened and checked properly',
            key: 'nutBoltsTightened',
          },
          {title: 'Total qty of poles erected', key: 'totalPolesErected'},
          {
            title: 'Total length of highway covered in Km',
            key: 'totalHighwayLengthCovered',
          },
        ];

        return (
          <View>
            {erectionOfPolesProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.erectionOfPolesData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_ARMS:
        const fixingOfArmsProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {title: 'Whether the source approved or not', key: 'sourceApproved'},
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title:
              'All the arms are fixed properly with alignment as per drawings',
            key: 'armsFixedProperly',
          },
          {
            title: 'All the nut bolts are tightened and checked properly',
            key: 'nutsBoltsTightened',
          },
          {
            title: 'Total qty of arms erected in no.',
            key: 'totalQtyArmsErected',
          },
          {
            title: 'Total length of highway covered in Km',
            key: 'totalHighwayLengthCoveredKm',
          },
        ];

        return (
          <View>
            {fixingOfArmsProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfArmsData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_ARMS:
        const fixingOfArmsProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {title: 'Whether the source approved or not', key: 'sourceApproved'},
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title:
              'All the arms are fixed properly with alignment as per drawings',
            key: 'armsFixedProperly',
          },
          {
            title: 'All the nut bolts are tightened and checked properly',
            key: 'nutsBoltsTightened',
          },
          {
            title: 'Total qty of arms erected in no.',
            key: 'totalQtyArmsErected',
          },
          {
            title: 'Total length of highway covered in Km',
            key: 'totalHighwayLengthCoveredKm',
          },
        ];

        return (
          <View>
            {fixingOfArmsProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfArmsData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.INSTALLATION_OF_LED_LIGHTS:
        const installationOfLEDLightsProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {title: 'Whether the source approved or not', key: 'sourceApproved'},
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title: 'All the lights are tested before installation',
            key: 'lightsTestedBeforeInstallation',
          },
          {title: 'All the installed properly', key: 'lightsInstalledProperly'},
          {
            title: 'Total qty of lights installed',
            key: 'totalQtyOfLightsInstalled',
          },
          {
            title: 'Total length of highway covered in Km',
            key: 'totalLengthOfHighwayCoveredKm',
          },
        ];

        return (
          <View>
            {installationOfLEDLightsProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.installationOfLEDLightsData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.LAYING_OF_FLEXIBLE_CABLE:
        const layingOfFlexibleCableProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {title: 'Whether the source approved or not', key: 'sourceApproved'},
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title: 'Whether the cable have been laid properly',
            key: 'cableLaidProperly',
          },
          {
            title:
              'Whether all the joints are made properly and junction boxes are as per specifications',
            key: 'jointsMadeProperly',
          },
          {
            title: 'Whether the end points are terminated properly',
            key: 'endpointsTerminatedProperly',
          },
          {
            title: 'Whether proper testing done and successful',
            key: 'testingSuccessful',
          },
          {
            title: 'Total length of cable laid in RM',
            key: 'totalCableLengthRM',
          },
          {
            title: 'Total length of highway covered in Km',
            key: 'totalHighwayLengthKm',
          },
        ];

        return (
          <View>
            {layingOfFlexibleCableProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.layingOfFlexibleCableData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.LAYING_OF_LT_CABLE:
        const layingOfLTCableProperties = [
          {
            title: 'Whether the drawings approved or not',
            key: 'drawingsApproved',
          },
          {title: 'Whether the source approved or not', key: 'sourceApproved'},
          {
            title:
              'Whether the factory inspection done and dispatch clearance obtained',
            key: 'factoryInspectionDone',
          },
          {
            title: 'Whether the cable have been laid properly',
            key: 'cableLaidProperly',
          },
          {
            title:
              'Whether all the joints are made properly as per the specifications or not',
            key: 'jointsMadeProperly',
          },
          {
            title: 'Whether the end points are terminated properly',
            key: 'endPointsTerminated',
          },
          {
            title: 'Whether proper testing done and successful',
            key: 'properTestingDone',
          },
          {
            title: 'Total length of cable laid in RM',
            key: 'totalCableLengthRM',
          },
          {
            title: 'Total length of highway covered in Km',
            key: 'totalHighwayLengthKm',
          },
        ];

        return (
          <View>
            {layingOfLTCableProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.layingOfLTCableData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );
      case TASK_TYPES.FIXING_OF_STONE:
        const fixingOfStoneProperties = [
          {
            title: 'Whether the source material approved',
            key: 'sourceMaterialApproved',
          },
          {title: 'Whether the drawing approved', key: 'drawingApproved'},
          {
            title: 'Whether the shape and size as per approved drawing',
            key: 'shapeSizeApproved',
          },
          {
            title: 'Whether the stones are fixed properly',
            key: 'stonesFixedProperly',
          },
          {
            title:
              'Whether the project number, Terminal station & kilometrage etc. are mentioned',
            key: 'projectDetailsCorrect',
          },
          {
            title: 'Whether the items are properly cleaned and visible',
            key: 'itemsCleanedVisible',
          },
          {title: 'Total no. of stones installed', key: 'totalStonesInstalled'},
          {
            title: 'Total length of road covered in Km',
            key: 'totalLengthCoveredKm',
          },
        ];

        return (
          <View>
            {fixingOfStoneProperties.map(property => (
              <View
                style={{flexDirection: 'column', marginBottom: 10}}
                key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {selectedRFI?.metaData.fixingOfStoneData?.[property.key]}
                </Text>
              </View>
            ))}
          </View>
        );

      // ReadOnlyRfi
      default:
        return (
          <View>
            <Text>TODO</Text>
          </View>
        );
    }
  };

  return (
    <View>
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
                  <Text style={styles.subHead}>
                    {item.workAssignmentData.projectModule.name}
                  </Text>
                  <Image
                    style={styles.ArrowIcon}
                    source={require('../../images/right-arrow-icon.png')}
                  />
                  <Text style={styles.subHead}>
                    {item.workAssignmentData.segmentId?.name}
                  </Text>
                  <Image
                    style={styles.ArrowIcon}
                    source={require('../../images/right-arrow-icon.png')}
                  />
                  {item.workAssignmentData.componentId ? (
                    <View style={styles.taskCategory}>
                      <Text style={styles.subHead}>
                        {item.workAssignmentData.componentId?.name}
                      </Text>
                      <Image
                        style={styles.ArrowIcon}
                        source={require('../../images/right-arrow-icon.png')}
                      />
                    </View>
                  ) : null}

                  {item.workAssignmentData.subComponentId ? (
                    <View style={styles.taskCategory}>
                      <Text style={styles.subHead}>
                        {item.workAssignmentData.subComponentId?.name}
                      </Text>
                      <Image
                        style={styles.ArrowIcon}
                        source={require('../../images/right-arrow-icon.png')}
                      />
                    </View>
                  ) : null}
                  <Text style={[styles.subHead, styles.taskCount]}>
                    {item.workAssignmentData.taskId?.displayName}
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
                      {getDisplayDate(item.rfiDateTime)}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.dateText, styles.fontBold]}>
                      Generated Time
                    </Text>
                    <Text style={[styles.dateText, styles.subFontText]}>
                      {getDisplayTime(item.rfiDateTime)}
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
                navigation.navigate('RFIsUserCategorySelection', {
                  rfiType: props.rfiType,
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
                    <Text style={styles.subHead}>
                      {selectedRFI.workAssignmentData.projectModule?.name}
                    </Text>
                    <Image
                      style={styles.ArrowIcon}
                      source={require('../../images/right-arrow-icon.png')}
                    />
                    <Text style={styles.subHead}>
                      {selectedRFI.workAssignmentData.segmentId?.name}
                    </Text>
                    <Image
                      style={styles.ArrowIcon}
                      source={require('../../images/right-arrow-icon.png')}
                    />
                    {selectedRFI.workAssignmentData.componentId ? (
                      <View style={styles.taskCategory}>
                        <Text style={styles.subHead}>
                          {selectedRFI.workAssignmentData.componentId?.name}
                        </Text>
                        <Image
                          style={styles.ArrowIcon}
                          source={require('../../images/right-arrow-icon.png')}
                        />
                      </View>
                    ) : null}

                    {selectedRFI.workAssignmentData.subComponentId ? (
                      <View style={styles.taskCategory}>
                        <Text style={styles.subHead}>
                          {selectedRFI.workAssignmentData.subComponentId?.name}
                        </Text>
                        <Image
                          style={styles.ArrowIcon}
                          source={require('../../images/right-arrow-icon.png')}
                        />
                      </View>
                    ) : null}

                    <Text style={[styles.subHead, styles.taskCount]}>
                      {selectedRFI.workAssignmentData.taskId?.displayName}
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
});

export default RFIsRecents;
