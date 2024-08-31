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
  const renderItemGlueing = (rowData: any) => (
    <View style={{flexDirection: 'column', gap: 5}}>
      {rowData.index === 0 && (
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>TM No.</Text>
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
        <Text style={styles.cell}>TM {rowData.index + 1}</Text>
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

  const renderSectionHeaderGlueing = (rowData: any) => {
    return (
      <View>
        <View>
          <Text>TM No.</Text>
        </View>
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
      case TASK_TYPES.THREADING_OF_PRE_STRESSING_STRANDS:
        return (
          <View>
            <Text>No Observations</Text>
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
        const temporaryPrestressingProperties = [
          {
            title: 'Calibration Certificate Available',
            key: 'calibrationCertificateAvailable',
          },
          {
            title: 'Stressing Sequence Drawing Number',
            key: 'stressingSequenceDrawingNumber',
          },
          {title: 'Prestressing Date', key: 'prestressingDate'},
          {title: 'Max Jack Pressure (Kg/cm²)', key: 'maxJackPressure'},
          {title: 'Jack Pressure Applied (Kg/cm²)', key: 'jackPressureApplied'},
        ];

        return (
          <View>
            {temporaryPrestressingProperties.map(property => (
              <View style={{flexDirection: 'column'}} key={property.key}>
                <Text style={styles.GenerateRFIFieldLabel}>
                  {property.title}
                </Text>
                <Text>
                  {
                    selectedRFI?.metaData.temporaryPrestressingData?.[
                      property.key
                    ]
                  }
                </Text>
              </View>
            ))}
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
