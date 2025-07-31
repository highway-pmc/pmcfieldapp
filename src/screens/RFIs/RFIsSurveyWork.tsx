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
import {PROJECT_TYPE, RFI_STATUS, RFIs_TYPE, TASK_TYPES, USER_CATEGORY_DISPLAY} from '../../constants/constants';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import React, {Fragment, useEffect, useLayoutEffect, useState} from 'react';
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
import commonStyles from '../Common/commonStyles';
import LinearGradient from 'react-native-linear-gradient';
const {height} = Dimensions.get('window');

const RFIsSurveyWork = (props: any) => {
  const navigation: any = useNavigation();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {rfiDataList, rfiUpdated, reportGenerated, loading, error} =
    useSelector((state: any) => state.RFIs);

  const [rfiData, setRfiData] = useState([]);

  const [openPopup, setOpenPopup] = useState(false);
  const [selectedRFI, setSelectedRFI]: any = useState(null);

  const [openCalendar, setOpenCalendar] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(PROJECT_TYPE.INITIAL_SURVEY);

  const [pdfSource, setPdfSource] = useState(null);
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined, // Reset on back
      });
    };
  }, [navigation]);
  const dispatch = useDispatch();
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      setRfiData([]);
      getRFIsData();
      setPdfSource(null);
    }
  }, [focus]);

  const getRFIsData = (projModuleType = selectedCategory) => {
    dispatch(
      actionGetRFIs({
        projectId: loggedInUser.projectId,
        status:
          props.rfiType === RFIs_TYPE.GENERATE ? 'generated' : props.rfiType,
        taskCategory: props.taskCategory,
        projectModuleType: projModuleType,
      }),
    );
  };

  useEffect(() => {
    if (rfiDataList) {
      console.log('rfiDataList', rfiDataList);
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

  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{marginVertical: 0, padding: 0}}>
        <View
          style={[
            commonStyles.toggleContainer,
            {
              borderBottomColor: '#D2C5FF',
              borderBottomWidth: 1,
              flexDirection: 'row',
            },
          ]}>
          <TouchableOpacity
            style={[
              commonStyles.toggleButton,
              selectedCategory === PROJECT_TYPE.INITIAL_SURVEY &&
                commonStyles.activeToggleButton,
            ]}
            onPress={() => {
              setSelectedCategory(PROJECT_TYPE.INITIAL_SURVEY); getRFIsData(PROJECT_TYPE.INITIAL_SURVEY);
            }}>
            <Text
              style={[
                commonStyles.toggleText,
                selectedCategory === PROJECT_TYPE.INITIAL_SURVEY &&
                  commonStyles.activeToggleText,
              ]}>
              Initial Survey
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              commonStyles.toggleButton,
              selectedCategory === PROJECT_TYPE.STRUCTURE_WORK &&
                commonStyles.activeToggleButton,
            ]}
            onPress={() => {
                setSelectedCategory(PROJECT_TYPE.STRUCTURE_WORK);
                getRFIsData(PROJECT_TYPE.STRUCTURE_WORK);
              }}>
            <Text
              style={[
                commonStyles.toggleText,
                selectedCategory === PROJECT_TYPE.STRUCTURE_WORK &&
                  commonStyles.activeToggleText,
              ]}>
              {USER_CATEGORY_DISPLAY.STRUCTURE}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              commonStyles.toggleButton,
              selectedCategory === PROJECT_TYPE.HIGHWAY_WORK && commonStyles.activeToggleButton,
            ]}
            onPress={() => {
              setSelectedCategory(PROJECT_TYPE.HIGHWAY_WORK);
              getRFIsData(PROJECT_TYPE.HIGHWAY_WORK);
            }}>
            <Text
              style={[
                commonStyles.toggleText,
                selectedCategory === PROJECT_TYPE.HIGHWAY_WORK && commonStyles.activeToggleText,
              ]}>
              {USER_CATEGORY_DISPLAY.HIGHWAY}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              commonStyles.toggleButton,
              selectedCategory === PROJECT_TYPE.OTHER_WORK && commonStyles.activeToggleButton,
            ]}
            onPress={() => {
              setSelectedCategory(PROJECT_TYPE.OTHER_WORK);
              getRFIsData(PROJECT_TYPE.OTHER_WORK);
            }}>
            <Text
              style={[
                commonStyles.toggleText,
                selectedCategory === PROJECT_TYPE.OTHER_WORK && commonStyles.activeToggleText,
              ]}>
              {USER_CATEGORY_DISPLAY.OTHER}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.recentWorkHead}>
        <Text style={styles.headerText}>
          {' '}
          Recent {getRFIType()} RFI's(
          <Text style={styles.taskCount}>{rfiData.length}</Text>){' '}
        </Text>
        {props.rfiType === RFIs_TYPE.GENERATE && (
          <View style={styles.footerButton}>
            <TouchableOpacity
              style={styles.btnCta}
              onPress={() =>
                navigation.navigate('RFIsGenerateMyWork', {
                  rfiType: props.rfiType,
                  projectType: selectedCategory,
                  taskCategory: props.taskCategory,
                  moduleType: props.moduleType
                })
              }>
              <Text style={styles.btnCtaText}>Generate RFI's</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.recentWorkContainer}>
        {/* <View style={styles.recentWorkHead}>
          <Text style={styles.headerText}>
            Recent RFI's (<Text style={styles.taskCount}>{rfiData.length}</Text>
            )
          </Text>
        </View> */}
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
              <TouchableOpacity onPress={() => onSelectRFI(item)}>
                <LinearGradient
                  colors={['#FFFFFF', '#E0E7FF']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.recentWorkCard}>
                  <View
                    style={[
                      styles.taskCategory,
                      {flexWrap: 'wrap', paddingBottom: 10},
                    ]}>
                    <Text style={styles.subHead}>
                      {item.workAssignmentData.projectModule?.name}
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
                      backgroundColor: '#FFF',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: '#5A2AAF',
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
                </LinearGradient>
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
                      <Text style={[styles.dateText]}>Generated Date</Text>
                      <Text style={[styles.dateText, styles.subFontText]}>
                        {getDisplayDate(selectedRFI.rfiDateTime)}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.dateText]}>Generated Time</Text>
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
    marginTop: 5,
    height: '80%',
  },
  recentWorkHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#DEE1E7',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskCount: {
    color: '#4E36A3',
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
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CDD6F6',
    borderStyle: 'solid',
    marginBottom: 15,
  },
  taskCategory: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 2,
    marginBottom: 2,
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
    flexDirection: 'row-reverse',
    borderColor: '#D2C5FF',
  },
  btnCta: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4E36A3',
  },
  btnCtaText: {
    color: '#4E36A3',
    fontSize: 14,
    fontWeight: '400',
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
    backgroundColor: '#4E36A3',
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

export default RFIsSurveyWork;
