import { View, Text, Button, NativeEventEmitter, Alert, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { HeaderItems } from "../../constants/constants"
import { useDispatch, useSelector } from 'react-redux';
import { clearProjectInfoEvent, getProjectInfo } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import moment from 'moment';

const ProjectInfo = ({ navigation }: { navigation: any }) => {

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { projectInfo, loading, error } = useSelector((state: any) => state.ProjectInfo);

  const dispatch = useDispatch()

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.projectInfo);
  }

  const getProjectInfoData = () => {
    dispatch(getProjectInfo(loggedInUser.projectId));
  }

  useEffect(() => {
    getProjectInfoData();
  }, []);

  useEffect(() => {
  }, [projectInfo, error]);

  // unmount
  useEffect(() => () => {
    dispatch(clearProjectInfoEvent());
  }, []);

  const currencyFormat = (amount: any) => {
    const fractionDegits = (''+amount).split('.');
    let decimalNum = 0;
    if (fractionDegits.length > 1) {
      decimalNum = fractionDegits[1].length;
    }
    let rupee = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: decimalNum
    });

    return rupee.format(amount) + " CR";
  }

  return (
    <ScrollView style={styles.Container}>
      <View style={styles.BgColorGray}>
        <View style={styles.ViewProfile}>
          {(error) && <View style={styles.ErrorSectionStyle}>
            <Text style={styles.errorText}>{error}</Text>
          </View>}
          {projectInfo && (
            <View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelTextProjectName}>{projectInfo?.name}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Project Description</Text>
                <Text style={styles.LabelSubText}>{projectInfo?.description}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Contractor</Text>
                <Text style={styles.LabelSubText}>{projectInfo?.contractor}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Project Cost</Text>
                <Text style={styles.LabelSubText}>{currencyFormat(projectInfo?.cost)}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Client</Text>
                <Text style={styles.LabelSubText}>{projectInfo?.client}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Location</Text>
                <Text style={styles.LabelSubText}>{projectInfo?.location}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>State</Text>
                <Text style={styles.LabelSubText}>{projectInfo?.state}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Start Date</Text>
                <Text style={styles.LabelSubText}>{projectInfo?.duration?.startDate ? moment(new Date(projectInfo.duration.startDate)).format('DD-MMM-YYYY') : 'NA'}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>End Date</Text>
                <Text style={styles.LabelSubText}>{projectInfo?.duration?.endDate ? moment(new Date(projectInfo.duration.endDate)).format('DD-MMM-YYYY') : 'NA'}</Text>
              </View>
              <View style={styles.FormGroup}>
                <Text style={styles.LabelText}>Project Length</Text>
                <Text style={styles.LabelSubText}>{projectInfo?.projectLength} KM</Text>
              </View>
            </View>
          )}

        </View>

        <LoadingAnimation loading={loading}></LoadingAnimation>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    paddingVertical: 10,
    padding: 15,
  },
  BgColorGray: {
    backgroundColor: '#F2F2F2',
    flex: 1,
    paddingHorizontal: 15,
  },

  ViewProfile: {
    backgroundColor: '#fff',
    marginTop: 20,
    flex: 1,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },

  ErrorSectionStyle: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  errorText: {
    color: '#f11f1f',
  },
  FormGroup: {
    marginVertical: 7,
  },
  LabelTextProjectName: {
    fontSize: 18,
    color: '#150A33',
    fontWeight: '500',
    textAlign: 'center'
  },
  LabelText: {
    fontSize: 16,
    color: '#150A33',
    fontWeight: '500'
  },
  LabelSubText: {
    fontSize: 14,
    color: '#AAA6B9',
    fontWeight: '500'
  },
});

export default ProjectInfo