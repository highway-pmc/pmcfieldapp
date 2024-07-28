import { View, Text, NativeEventEmitter, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, SafeAreaView, Dimensions, TextInput, Alert } from 'react-native'
import React, {Fragment, useEffect, useState} from 'react'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { HeaderItems } from "../../constants/constants"
import { RFI_STATUS, RFIs_TYPE, TASK_TYPES } from '../../constants/constants'
import { useDispatch, useSelector } from 'react-redux';
import LoadingAnimation from '../Common/LoadingAnimation';
import Pdf from 'react-native-pdf';
import { SwipeListView } from 'react-native-swipe-list-view';
import { actionDownloadRFIsReports, actionGetRFIsReports, clearRFIReportsEvent } from './actions';
import { getDisplayDate, getDisplayTime } from '../../utils/Utils';

const Reports = (props: any) => {
  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.reports);
  }
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { rfiDataList, reportDownloaded, loading, error } = useSelector((state: any) => state.Reports);

  const [rfiData, setRfiData] = useState([]);

  const [openPopup, setOpenPopup] = useState(false);

  const [pdfSource, setPdfSource] = useState(null);


  const dispatch = useDispatch()
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      dispatch(clearRFIReportsEvent());
      setRfiData([]);
      setPdfSource(null);
      getRFIsReportsData();
      setPdfSource(null);
    }
  }, [focus]);

  const getRFIsReportsData = () => {
    dispatch(actionGetRFIsReports({
      projectId: loggedInUser.projectId
    }));
  }

  useEffect(() => {
    if (rfiDataList) {
      setRfiData(rfiDataList);
    }
    if (reportDownloaded) {
      setOpenPopup(true);
      setPdfSource({ uri: "data:application/pdf;base64," + reportDownloaded });
    }
  }, [rfiDataList, reportDownloaded]);

  // unmount
  useEffect(() => () => {
    dispatch(clearRFIReportsEvent());
  }, []);

  const onDownloadReport = (item: any) => {
    setPdfSource(null);
    dispatch(clearRFIReportsEvent());
    setTimeout(() => {
      dispatch(actionDownloadRFIsReports({
        projectId: loggedInUser.projectId,
        projectModuleId: item.projectModuleId,
        rfiId: item._id,
      }));
    })
  }

  return (
    <View>
      <Text style={styles.headerText}>RFI's Reports</Text>
      <View style={styles.recentWorkContainer}>
        <View style={styles.recentWorkContentHeight100}>
          <ScrollView showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {
              rfiData.map((item: any, index) => (
                <TouchableOpacity style={styles.recentWorkCard} onPress={() => onDownloadReport(item)}>
                  <View style={styles.taskCategory}>
                    <Text style={styles.subHead}>{item.workAssignmentData.projectModule.name}</Text>
                    <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                    <Text style={styles.subHead}>{item.workAssignmentData.segmentId.name}</Text>
                    <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                    {
                    item.workAssignmentData.componentId ? (
                      <View>
                        <Text style={styles.subHead}>{item.workAssignmentData.componentId?.name}</Text>
                        <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                      </View>
                    )
                    : null
                  }

                  {
                    item.workAssignmentData.subComponentId ? (
                      <View>
                        <Text style={styles.subHead}>{item.workAssignmentData.subComponentId?.name}</Text>
                        <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                      </View>
                    )
                    : null
                  }
                    <Text style={[styles.subHead, styles.taskCount]}>{item.workAssignmentData.taskId?.displayName}</Text>
                  </View>
                  <Text style={styles.dateText}>Generated Date: {getDisplayDate(item.rfiDateTime)}</Text>
                  <Text style={styles.dateText}>Generated Time: {getDisplayTime(item.rfiDateTime)}</Text>
                </TouchableOpacity>
              ))
            }

            {
              (!rfiData.length && !loading) &&
              <View style={styles.noDataContainer}>
                <Image style={styles.noDataImage} source={require('../../images/no-data-found.png')} />
                <Text style={styles.noDataHeadText}>No RFI's</Text>
                <Text style={styles.noDataSubText}>There is no RFI's report generated</Text>
              </View>
            }
          </ScrollView>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={openPopup}
        onRequestClose={() => {
          setOpenPopup(!openPopup);
          setPdfSource(null);
        }}>
        <View style={styles.bodyPopup}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.ModalHeader}>
                <Text style={styles.modalText}>Report</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => { setOpenPopup(!openPopup); setPdfSource(null); }}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
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

export default Reports