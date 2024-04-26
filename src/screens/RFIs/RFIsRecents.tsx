import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, SafeAreaView, Dimensions, TextInput, Alert } from 'react-native'
import { RFI_STATUS, RFIs_TYPE, TASK_TYPES } from '../../constants/constants'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment, useEffect, useState } from 'react'
import { actionGetRFIs, clearRFITasksEvent, generateRFIReport, updatedRFIs } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import moment from 'moment';
import Pdf from 'react-native-pdf';

const RFIsRecents = (props: any) => {
  const navigation = useNavigation();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { rfiDataList, rfiUpdated, reportGenerated, loading, error } = useSelector((state: any) => state.RFIs);

  const [rfiData, setRfiData] = useState([]);

  const [openPopup, setOpenPopup] = useState(false);
  const [selectedRFI, setSelectedRFI] = useState(null);

  // const [rfiDate, setRFIDate] = useState('');
  // const [hours, setHours] = useState([]);
  // const [minutes, setMinutes] = useState([]);
  // const [timeFormats, setTimeFormats] = useState([]);

  // const [hour, setHour] = useState('12');
  // const [minute, setMinute] = useState('00');
  // const [timeFormat, setTimeFormat] = useState('AM');

  // const [openHours, setOpenHours] = useState(false);
  // const [openMinutes, setOpenMinutes] = useState(false);
  // const [openTimeFormats, setOpenTimeFormats] = useState(false);

  const [openCalendar, setOpenCalendar] = useState(false);

  // const [comments, setComments] = useState('');

  // const { width, height } = Dimensions.get('window');

  const [pdfSource, setPdfSource] = useState(null);


  const dispatch = useDispatch()
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      // getHours();
      // getMins();
      // getTimeFormats();
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

  const taskForm = (selectedRFI: any) => {
    switch (selectedRFI?.metaData?.taskName) {

      case TASK_TYPES.CNG_AND_SETTING_OUT: return <View style={styles.ImageSections}>
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
                  <View style={styles.taskCategory}>
                    <Text style={styles.subHead}>{item.workAssignmentData.projectModule.name}</Text>
                    <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                    <Text style={styles.subHead}>{item.workAssignmentData.segmentId.name}</Text>
                    <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                    <Text style={styles.subHead}>{item.workAssignmentData.componentId.name}</Text>
                    <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                    <Text style={[styles.subHead, styles.taskCount]}>{item.workAssignmentData.taskId?.displayName}</Text>
                  </View>
                  <Text style={styles.dateText}>Generated Date: {moment(new Date(item.rfiDateTime)).format('DD-MM-YYYY')}</Text>
                  <Text style={styles.dateText}>Generated Time: {moment(new Date(item.rfiDateTime)).format('hh:mm A')}</Text>
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
                <View style={styles.taskCategory}>
                  <Text style={styles.subHead}>{selectedRFI.workAssignmentData.projectModule.name}</Text>
                  <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                  <Text style={styles.subHead}>{selectedRFI.workAssignmentData.segmentId.name}</Text>
                  <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                  <Text style={styles.subHead}>{selectedRFI.workAssignmentData.componentId.name}</Text>
                  <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                  <Text style={[styles.subHead, styles.taskCount]}>{selectedRFI.workAssignmentData.taskId?.displayName}</Text>
                </View>
                <Text style={styles.dateText}>Generated Date: {moment(new Date(selectedRFI.rfiDateTime)).format('DD-MM-YYYY')}</Text>
                <Text style={styles.dateText}>Generated Time: {moment(new Date(selectedRFI.rfiDateTime)).format('hh:mm A')}</Text>
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

                      {/* {
                        props.rfiType !== RFIs_TYPE.APPROVED &&
                        <View>
                          <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.GenerateRFIFieldLabel}>Date</Text>

                            <View style={{ flexDirection: 'row' }}>
                              <TextInput
                                style={styles.inputStyle}
                                placeholder=""
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                underlineColorAndroid="#f000"
                                blurOnSubmit={false}
                                value={rfiDate ? moment(new Date(rfiDate)).format('DD-MM-YYYY') : ''}
                                editable={false}
                              />
                              <TouchableOpacity onPress={() => openCloseCalendar()} style={{ width: 40, backgroundColor: "#ccc" }}>
                                <Text style={styles.assignTagButtonText}>Icon</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          {openCalendar && (

                            <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 10 }}>
                              <CalendarPicker width={width - 40}
                                initialDate={rfiDate ? new Date(rfiDate) : new Date()}
                                onDateChange={(date) => {
                                  setRFIDate(date.format("YYYY-MM-DD"));
                                  openCloseCalendar()
                                }}
                              />
                            </View>
                          )}

                          <View style={{ flexDirection: 'column', height: 80, paddingTop: 15, zIndex: 5, marginBottom: 140 }}>
                            <Text style={styles.GenerateRFIFieldLabel}>Time</Text>
                            <View style={{ flexDirection: 'row', gap: 20 }}>
                              <View style={{ width: 80, height: 90 }}>
                                <DropDownPicker onPress={() => {
                                  setOpenMinutes(false);
                                  setOpenTimeFormats(false);
                                }}
                                  dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                                  maxHeight={75}
                                  zIndex={1000}
                                  listMode='MODAL'
                                  open={openHours}
                                  value={hour}
                                  items={hours}
                                  setOpen={setOpenHours}
                                  setValue={setHour}
                                />
                              </View>

                              <View style={{ width: 80, height: 90 }}>
                                <DropDownPicker onPress={() => {
                                  setOpenHours(false);
                                  setOpenTimeFormats(false);
                                }}
                                  dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                                  maxHeight={75}
                                  zIndex={1000}
                                  listMode='MODAL'
                                  open={openMinutes}
                                  value={minute}
                                  items={minutes}
                                  setOpen={setOpenMinutes}
                                  setValue={setMinute}
                                />
                              </View>
                              <View style={{ width: 80, height: 90 }}>
                                <DropDownPicker onPress={() => {
                                  setOpenHours(false);
                                  setOpenMinutes(false);
                                }}
                                  dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                                  maxHeight={75}
                                  zIndex={1000}
                                  listMode='SCROLLVIEW'
                                  open={openTimeFormats}
                                  value={timeFormat}
                                  items={timeFormats}
                                  setOpen={setOpenTimeFormats}
                                  setValue={setTimeFormat}
                                />
                              </View>
                            </View>

                            <View style={{ flexDirection: 'column', height: 65 }}>
                              <Text style={styles.GenerateRFIFieldLabel}>Comments</Text>
                              <TextInput
                                style={styles.inputStyle}
                                placeholder="Comments"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                underlineColorAndroid="#f000"
                                blurOnSubmit={false}
                                value={comments}
                                onChangeText={(text) => {
                                  setComments(text);
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      } */}
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
                  <View style={[styles.btnParentSection, { flexDirection: 'row', justifyContent: 'center', gap: 20 }]}>
                    <TouchableOpacity style={styles.submitButton} onPress={() => onRFIAction(RFI_STATUS.REJECTED)}>
                      <Text style={styles.submitButtonText}>Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitButton} onPress={() => onRFIAction(RFI_STATUS.APPROVED)}>
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
    // alignItems: 'center',
    marginTop: 10
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