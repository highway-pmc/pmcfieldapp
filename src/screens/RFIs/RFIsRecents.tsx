import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, SafeAreaView, Dimensions, TextInput, Alert } from 'react-native'
import { RFI_STATUS, RFIs_TYPE, TASK_TYPES } from '../../constants/constants'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useEffect, useState } from 'react'
import { actionGetRFIs, clearRFITasksEvent, generateRFIReport, updatedRFIs } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import Pdf from 'react-native-pdf';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getDisplayDate, getDisplayTime } from '../../utils/Utils';

const RFIsRecents = (props: any) => {
  const navigation = useNavigation();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { rfiDataList, rfiUpdated, reportGenerated, loading, error } = useSelector((state: any) => state.RFIs);

  const [rfiData, setRfiData] = useState([]);

  const [openPopup, setOpenPopup] = useState(false);
  const [selectedRFI, setSelectedRFI]:any = useState(null);

  const [openCalendar, setOpenCalendar] = useState(false);

  const [pdfSource, setPdfSource] = useState(null);


  const dispatch = useDispatch()
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      setRfiData([]);
      getRFIsData();
      setPdfSource(null);
    }
  }, [focus]);

  const getRFIsData = () => {
    dispatch(actionGetRFIs({
      projectId: loggedInUser.projectId,
      status: (props.rfiType === RFIs_TYPE.GENERATE ? 'generated' : props.rfiType)
    }));
  }

  useEffect(() => {
    if (rfiDataList) {
      setRfiData(rfiDataList);
    }

    if (rfiUpdated) {
      Alert.alert('Success', 'RFI updated successfully.');
      navigation.navigate('RFIsHome')
    }

    if (reportGenerated) {
      //Alert.alert('Success', 'Report generated successfully.');
      setPdfSource({ uri: "data:application/pdf;base64," + reportGenerated });
    }
  }, [rfiDataList, rfiUpdated, reportGenerated]);

  // unmount
  useEffect(() => () => {
    dispatch(clearRFITasksEvent());
  }, []);

  const getRFIType = () => {
    if (props.rfiType === RFIs_TYPE.GENERATE) {
      return 'Generated'
    } else if (props.rfiType === RFIs_TYPE.CLOSED) {
      return 'Closed'
    } else if (props.rfiType === RFIs_TYPE.APPROVED) {
      return 'Approved'
    } else if (props.rfiType === RFIs_TYPE.REJECTED) {
      return 'Rejected/Cancelled'
    } else if (props.rfiType === RFIs_TYPE.IN_PROGRESS) {
      return 'In Progress'
    }

    return '';
  }

  const onSelectRFI = (item: any) => {
    setPdfSource(null);
    setSelectedRFI(item);
    setOpenPopup(true);
  }

  const renderFileData = () => {
    if (selectedRFI?.metaData?.base64Image) {
      return <Image source={{ uri: 'data:image/jpeg;base64,' + selectedRFI?.metaData?.base64Image }}
        style={styles.images}
      />
    } else {
      return <Image source={require('./../../images/dummy.png')} // ./assets/dummy.png
        style={styles.images}
      />
    }
  }

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

    dispatch(updatedRFIs({
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
    }));
  }

  const onGenerateReport = () => {
    dispatch(generateRFIReport({
      projectId: loggedInUser.projectId,
      projectModuleId: selectedRFI.projectModuleId,
      rfiId: selectedRFI._id,
    }));
  }

  const openCloseCalendar = () => {
    setOpenCalendar(!openCalendar);
    // if (!openCalendar) {
    //   setLayoutHeight(DEFAULT_COMPONENT_HEIGHT + DEFAULT_CALENDAR_HEIGHT)
    // } else {
    //   setLayoutHeight(DEFAULT_COMPONENT_HEIGHT)
    // }
  }

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
          <Text style={styles.headerCell}>No of cubes casted</Text>
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
        <Text>No of cubes casted</Text>
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
  )
}

  const taskForm = (selectedRFI: any) => {
    switch (selectedRFI?.metaData?.taskName) {

      case TASK_TYPES.CNG_AND_SETTING_OUT:
      case TASK_TYPES.PLACING_OF_SHEATHING_DUCT:
        return <View style={styles.ImageSections}>
      <View>
        {selectedRFI?.metaData?.base64Image && renderFileData()}
      </View>
    </View>
      case TASK_TYPES.FORM_WORK:
      case TASK_TYPES.PLACEMENT_OF_INNER_SHUTTERS:
      case TASK_TYPES.PLACEMENT_OF_SIDE_SHUTTERS:
      case TASK_TYPES.PLACEMENT_OF_BOTTOM_SHUTTER:
      case TASK_TYPES.PLACEMENT_OF_MIDDLE_AND_TOP_SHUTTER:
        return <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Cleanliness and Oil application checked</Text>
            <Text>{selectedRFI?.metaData.cleanliness}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Formwork alignment checked</Text>
            <Text>{selectedRFI?.metaData.formworkAlignmentChecked}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Formwork tightness/sealing checked</Text>
            <Text>{selectedRFI?.metaData.formworkSealingChecked}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Required covers provided as per drawings checked</Text>
            <Text>{selectedRFI?.metaData.formworkdDrawingsChecked}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Concrete finish level marked</Text>
            <Text>{selectedRFI?.metaData.concreteFinishLevelMarked}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Formwork properly supported</Text>
            <Text>{selectedRFI?.metaData.formworkProperlySupported}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Formwork fit for concreting</Text>
            <Text>{selectedRFI?.metaData.formworkFitConcreting}</Text>
          </View>
          
        </View>
      case TASK_TYPES.REINFORCEMENT:
      case TASK_TYPES.REINFORCEMENT_PREPARATION:
        return <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Rebar and dimension (dia,len and shape) checked as per GFC</Text>
            <Text>{selectedRFI?.metaData.rebarAndDimensionGFC}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Shaping, No and Length of Bars checked as per GFC</Text>
            <Text>{selectedRFI?.metaData.shapingNoAndLengthOfBarsGFC}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Rebars securely tightened/bound by tie bars</Text>
            <Text>{selectedRFI?.metaData.rebarsSecurelyTightened}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Splice length and location checked as per GFC</Text>
            <Text>{selectedRFI?.metaData.spliceLengthAndLocationGFC}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Rebar within tolerance limit</Text>
            <Text>{selectedRFI?.metaData.rebarWithinToleranceLimit}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Coupler arrangements within tolerance</Text>
            <Text>{selectedRFI?.metaData.couplerArrangementsWithinTolerance}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Bar Bending schedule checked</Text>
            <Text>{selectedRFI?.metaData.barBendingScheduleChecked}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Spacer bar checked as per GFC</Text>
            <Text>{selectedRFI?.metaData.spacerBarCheckedGFC}</Text>
          </View>
        </View>
      case TASK_TYPES.PLACEMENT_OF_REINFORCEMENT_CAGE:
        return <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Rebar and dimension (dia,len and shape) checked as per GFC</Text>
            <Text>{selectedRFI?.metaData.rebarAndDimensionGFC}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Shaping, No and Length of Bars checked as per GFC</Text>
            <Text>{selectedRFI?.metaData.shapingNoAndLengthOfBarsGFC}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Rebars securely tightened/bound by tie bars</Text>
            <Text>{selectedRFI?.metaData.rebarsSecurelyTightened}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Splice length and location checked as per GFC</Text>
            <Text>{selectedRFI?.metaData.spliceLengthAndLocationGFC}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Rebar within tolerance limit</Text>
            <Text>{selectedRFI?.metaData.rebarWithinToleranceLimit}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Coupler arrangements within tolerance</Text>
            <Text>{selectedRFI?.metaData.couplerArrangementsWithinTolerance}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Bar Bending schedule checked</Text>
            <Text>{selectedRFI?.metaData.barBendingScheduleChecked}</Text>
          </View>
        </View>
      case TASK_TYPES.EXCAVATION:
        return <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Qty of earth work excavated in cum</Text>
            <Text>{selectedRFI?.metaData.quantity}</Text>
          </View>
        </View>
      case TASK_TYPES.REMOVAL_OF_SHUTTER:
      case TASK_TYPES.REMOVAL_OF_SHUTTERS:
        return <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Whether concrete has achieved desired strength</Text>
            <Text>{selectedRFI?.metaData.concreteHasAchievedDesiredStrength}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Whether minimum time has been attained</Text>
            <Text>{selectedRFI?.metaData.minimumTimeHasBeenAttained}</Text>
          </View>
        </View>
      case TASK_TYPES.THREADING_OF_PRE_STRESSING_STRANDS:
        return <View>
          <Text>No Observations</Text>
        </View>
      case TASK_TYPES.CAGE_LOWERING:
        return <View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Plie shaft cleaned of all loose material or not</Text>
            <Text>{selectedRFI?.metaData.plieShaftCleanedLooseMaterial}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>Suitable spacer provided to maintain the required cover to steel</Text>
            <Text>{selectedRFI?.metaData.suitableSpacerProvidedToMaintainCoverToSteel}</Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.GenerateRFIFieldLabel}>No L bend at the bottom of the Cage checked or not</Text>
            <Text>{selectedRFI?.metaData.noLBendBottomOfTheCageChecked}</Text>
          </View>
        </View>
      case TASK_TYPES.CONCRETING:
        return <View>
          <ScrollView horizontal={true}>
          <View style={{ flexDirection: 'column'}}>
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
      default: return <View>
        <Text>TODO</Text>
      </View>
    }
  }

  return (
    <View>
      <Text style={styles.headerText}> Recent {getRFIType()} RFI's</Text>
      <View style={styles.recentWorkContainer}>
        <View style={styles.recentWorkHead}>
          <Text style={styles.headerText}>Recent RFI's (<Text style={styles.taskCount}>{rfiData.length}</Text>)</Text>
        </View>
        <View style={props.rfiType === RFIs_TYPE.GENERATE ? styles.recentWorkContent : styles.recentWorkContentHeight100}>
          <ScrollView showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {
              rfiData.map((item: any, index) => (
                <TouchableOpacity style={styles.recentWorkCard} onPress={() => onSelectRFI(item)}>
                  <View style={[styles.taskCategory, {flexWrap: 'wrap', paddingBottom: 10}]}>
                    <Text style={styles.subHead}>{item.workAssignmentData.projectModule.name}</Text>
                    <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                    <Text style={styles.subHead}>{item.workAssignmentData.segmentId?.name}</Text>
                    <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                    {
                    item.workAssignmentData.componentId ? (
                      <View style={styles.taskCategory}>
                        <Text style={styles.subHead}>{item.workAssignmentData.componentId?.name}</Text>
                        <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                      </View>
                    )
                    : null
                  }

                  {
                    item.workAssignmentData.subComponentId ? (
                      <View style={styles.taskCategory}>
                        <Text style={styles.subHead}>{item.workAssignmentData.subComponentId?.name}</Text>
                        <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                      </View>
                    )
                    : null
                  }
                    <Text style={[styles.subHead, styles.taskCount]}>{item.workAssignmentData.taskId?.displayName}</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View>
                      <Text style={[styles.dateText, styles.fontBold]}>Generated Date</Text>
                      <Text style={[styles.dateText, styles.subFontText]}>{getDisplayDate(item.rfiDateTime)}</Text>
                    </View>
                    <View>
                      <Text style={[styles.dateText, styles.fontBold]}>Generated Time</Text>
                      <Text  style={[styles.dateText, styles.subFontText]}>{getDisplayTime(item.rfiDateTime)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            }

            {
              (!rfiData.length && !loading) &&
              <View style={styles.noDataContainer}>
                <Image style={styles.noDataImage} source={require('../../images/no-data-found.png')} />
                <Text style={styles.noDataHeadText}>No {getRFIType()} RFI's</Text>
                <Text style={styles.noDataSubText}>There is no {getRFIType()?.toLowerCase()} RFI's</Text>
              </View>
            }
          </ScrollView>
        </View>
        {props.rfiType === RFIs_TYPE.GENERATE && <View style={styles.footerButton}>
          <TouchableOpacity style={styles.btnCta} onPress={() => navigation.navigate('RFIsUserCategorySelection', {
            rfiType: props.rfiType
          })}>
            <Text style={styles.btnCtaText}>Generate RFI's</Text>
          </TouchableOpacity>
        </View>}
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
                  onPress={() => { setOpenPopup(!openPopup); setSelectedRFI(null); setPdfSource(null); }}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              {selectedRFI && !pdfSource && <View style={styles.ModalInnerContainer}>
                <View style={[styles.taskCategory, {flexWrap: 'wrap', paddingBottom: 20, paddingTop: 10}]}>
                  <Text style={styles.subHead}>{selectedRFI.workAssignmentData.projectModule?.name}</Text>
                  <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                  <Text style={styles.subHead}>{selectedRFI.workAssignmentData.segmentId?.name}</Text>
                  <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                  {
                    selectedRFI.workAssignmentData.componentId ? (
                      <View style={styles.taskCategory}>
                        <Text style={styles.subHead}>{selectedRFI.workAssignmentData.componentId?.name}</Text>
                        <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                      </View>
                    )
                    : null
                  }

                  {
                    selectedRFI.workAssignmentData.subComponentId ? (
                      <View style={styles.taskCategory}>
                        <Text style={styles.subHead}>{selectedRFI.workAssignmentData.subComponentId?.name}</Text>
                        <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                      </View>
                    )
                    : null
                  }
                  
                  <Text style={[styles.subHead, styles.taskCount]}>{selectedRFI.workAssignmentData.taskId?.displayName}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View>
                      <Text style={[styles.dateText, styles.fontBold]}>Generated Date</Text>
                      <Text style={[styles.dateText, styles.subFontText]}>{getDisplayDate(selectedRFI.rfiDateTime)}</Text>
                    </View>
                    <View>
                      <Text style={[styles.dateText, styles.fontBold]}>Generated Time</Text>
                      <Text  style={[styles.dateText, styles.subFontText]}>{getDisplayTime(selectedRFI.rfiDateTime)}</Text>
                    </View>
                  </View>
                <ScrollView style={{ paddingTop: 10, height: 500 }}>
                  <Fragment>
                    <SafeAreaView>
                      {
                        props.rfiType !== RFIs_TYPE.GENERATE &&
                        <View>
                          {/* <Text style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }} ></Text> */}
                          {taskForm(selectedRFI)}
                        </View>
                      }
                    </SafeAreaView>
                  </Fragment>
                </ScrollView>
                {
                  props.rfiType === RFIs_TYPE.GENERATE &&
                  <View style={[styles.btnParentSection, { flexDirection: 'row', justifyContent: 'center', gap: 20 }]}>
                    <TouchableOpacity style={styles.submitButton} onPress={() => onRFIAction(RFI_STATUS.CANCELLED)}>
                      <Text style={styles.submitButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                }

                {
                  props.rfiType === RFIs_TYPE.CLOSED &&
                  <View style={[styles.btnParentSection, { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 10, backgroundColor: '#fff', paddingVertical: 10, marginHorizontal: -15 }]}>
                    <TouchableOpacity style={[styles.submitButton,  styles.rejectRfis]} onPress={() => onRFIAction(RFI_STATUS.REJECTED)}>
                      <Text style={styles.submitButtonText}>Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.submitButton, styles.saveButtonColor]} onPress={() => onRFIAction(RFI_STATUS.APPROVED)}>
                      <Text style={styles.submitButtonText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                }

                {
                  props.rfiType === RFIs_TYPE.APPROVED &&
                  <View style={[styles.btnParentSection, { flexDirection: 'row', justifyContent: 'center', gap: 20 }]}>
                    <TouchableOpacity style={styles.submitButton} onPress={() => onGenerateReport()}>
                      <Text style={styles.submitButtonText}>Generate Report</Text>
                    </TouchableOpacity>
                  </View>
                }

                {
                  props.rfiType === RFIs_TYPE.REJECTED &&
                  <View style={[styles.btnParentSection, { flexDirection: 'row', justifyContent: 'center', gap: 20 }]}>
                    <TouchableOpacity style={styles.submitButton} onPress={() => onRFIAction(RFI_STATUS.RE_GENERATED)}>
                      <Text style={styles.submitButtonText}>Re-generate</Text>
                    </TouchableOpacity>
                  </View>
                }
              </View>
              }

              {
                pdfSource &&
                <View style={styles.containerPdf}>
                  <Pdf source={pdfSource}
                    onLoadComplete={(numberOfPages, filePath) => {
                      console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                      console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                      console.log(error);
                    }}
                    onPressLink={(uri) => {
                      console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf} />
                </View>
              }
            </View>
          </View>
        </View>

      </Modal>

      <LoadingAnimation loading={loading}></LoadingAnimation>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    textAlign: 'center'
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
    alignContent: 'center'
  },
  cell: {
    width: 120,
    paddingVertical: 7,
    textAlign: 'center'
  },
  fontBold: {
    fontWeight: '600'
  },
  containerPdf: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    height: Dimensions.get('screen').height - 200
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  headerText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500'
  },
  recentWorkContainer: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 15,
    height: '80%'
  },
  recentWorkHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#DEE1E7',
    padding: 20
  },
  taskCount: {
    color: '#1C58C0'
  },
  recentWorkContent: {
    padding: 20,
    height: '90%'
  },
  recentWorkContentHeight100: {
    padding: 20,
    height: '100%'
  },
  recentWorkCard: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderStyle: 'solid',
    marginBottom: 15
  },
  taskCategory: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 2,
    marginBottom: 5
  },
  subHead: {
    color: '#150B3D',
    fontSize: 14,
    fontWeight: '600'
  },
  ArrowIcon: {
    width: 18,
    height: 18
  },
  dateText: {
    color: '#150B3D',
    fontSize: 14,
    fontWeight: '300'
  },
  subFontText: {
    fontSize: 12,
    fontWeight: '400'
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
    justifyContent: 'center'
  },
  btnCtaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  },
  noDataContainer: {
    marginVertical: 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noDataHeadText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#34343F'
  },
  noDataSubText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#464665',
    marginTop: 10
  },
  noDataImage: {
    width: 245,
    height: 184,
    marginBottom: 15
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
    paddingBottom: 20
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
    backgroundColor: '#FF0000'
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
    width: Dimensions.get('screen').width
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center'
  },
  images: {
    width: 500,
    height: 400,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3
  },
  btnParentSection: {
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    // Shadow for Android
    elevation: 10,
    borderTopWidth: 1,
    borderColor: '#f3f3f3'
  },

  GenerateRFIFieldLabel: {
    fontSize: 16,
    color: '#150A33',
    fontWeight: '500'
  },
  GenerateRFIFieldTextInput: {
    width: 295,
    height: 40,
    fontSize: 12,
    color: "#666666",
    backgroundColor: "#99ABC6"
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

export default RFIsRecents