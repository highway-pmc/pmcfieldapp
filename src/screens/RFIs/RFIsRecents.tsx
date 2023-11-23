import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { RFIs_TYPE } from '../../constants/constants'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react'
import { actionGetRFIs, clearRFITasksEvent } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import moment from 'moment';

const RFIsRecents = (props: any) => {
  const navigation = useNavigation();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { rfiDataList, loading, error } = useSelector((state: any) => state.RFIs);
  const [rfiData, setRfiData] = useState([]);

  const dispatch = useDispatch()
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      setRfiData([]);
      getRFIsData();
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
  }, [rfiDataList]);

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
    }

    return '';
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
                <TouchableOpacity style={styles.recentWorkCard}>
                  <View style={styles.taskCategory}>
                    <Text style={styles.subHead}>{item.workAssignmentData.projectModule.name}</Text>
                    <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                    <Text style={styles.subHead}>{item.workAssignmentData.segmentId.name}</Text>
                    <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                    <Text style={styles.subHead}>{item.workAssignmentData.subSegmentId.name}</Text>
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
                <Text style={styles.noDataHeadText}>No Pending RFI's</Text>
                <Text style={styles.noDataSubText}>There is no pending RFI's</Text>
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

      <LoadingAnimation loading={loading}></LoadingAnimation>
    </View>
  )
}

const styles = StyleSheet.create({
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
    borderRadius: 30,
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
  }
});

export default RFIsRecents