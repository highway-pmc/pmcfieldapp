import { View, Text, NativeEventEmitter, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems } from "../../constants/constants"
import { useDispatch, useSelector } from 'react-redux';
import { clearMyWorksEvent, getMyWorks } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';

const MyWork = ({ navigation }: { navigation: any }) => {


  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { myWorks, loading, error } = useSelector((state: any) => state.MyWorks);
  const [myWorksData, setMyWorksData] = useState([]);

  const dispatch = useDispatch()
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.myWork);
      getMyWorksData();
    }
  }, [focus]);

  const getMyWorksData = () => {
    dispatch(getMyWorks(loggedInUser.projectId));
  }

  useEffect(() => {
    if (myWorks) {
      setMyWorksData(myWorks);
    }
  }, [myWorks, error]);

  // unmount
  useEffect(() => () => {
    dispatch(clearMyWorksEvent());
  }, []);

  return (
    <View style={styles.Container}>
      <ScrollView style={styles.Height100}>
        {myWorksData.map((projModuleItem: any, index) => (
          projModuleItem.assignmentLevel === 1 ?
            <TouchableOpacity style={styles.MyWorkCard}>
              <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
              <View style={styles.TaskDetails}>
                <Text style={styles.SubHeadingText}>Assigned:</Text>
                <Text style={[styles.SubHeadingText, styles.SubActive]}>{projModuleItem.name}</Text>
              </View>
            </TouchableOpacity>
            :
            (projModuleItem.segmentsData?.map((segItem: any, segIndex: any) => (
              (segItem.assignmentLevel === 2 && segIndex == 0) ? (
                <TouchableOpacity style={styles.MyWorkCard}>
                  <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                  <View style={styles.TaskDetails}>
                    <Text style={styles.SubHeadingText}>Assigned:</Text>

                    {projModuleItem.segmentsData?.filter((segItem: any) => segItem.assignmentLevel == 2).length === 1 ? (
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.SubHeadingText}>Foundation /</Text>
                        <Text style={[styles.SubHeadingText, styles.SubActive]}>{projModuleItem.segmentsData?.filter((segItem: any) => segItem.assignmentLevel == 2)[0].name}</Text>
                      </View>
                    )
                      :
                      <Text style={[styles.SubHeadingText, styles.SubActive]}>Foundation {projModuleItem.segmentsData?.filter((segItem: any) => segItem.assignmentLevel == 2).length}</Text>
                    }
                  </View>
                </TouchableOpacity>
              )
                :
                segItem.subSegmentsData?.map((subSegItem: any, subSegIndex: number) => (
                  subSegItem.assignmentLevel === 3 ?
                    (
                      <TouchableOpacity style={styles.MyWorkCard}>
                        <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                        <View style={styles.TaskDetails}>
                          <Text style={styles.SubHeadingText}>Assigned:</Text>
                          <Text style={styles.SubHeadingText}>Foundation /</Text>
                          <Text style={styles.SubHeadingText}>{segItem.name} /</Text>
                          <Text style={[styles.SubHeadingText, styles.SubActive]}>{subSegItem.name}</Text>
                        </View>
                      </TouchableOpacity>

                    )
                    :
                    subSegItem.tasksData?.map((taskItem: any) => (
                      taskItem.assignmentLevel === 4 &&
                      <TouchableOpacity style={styles.MyWorkCard}>
                        <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                        <View style={styles.TaskDetails}>
                          <Text style={styles.SubHeadingText}>Assigned:</Text>
                          <Text style={styles.SubHeadingText}>Foundation /</Text>
                          <Text style={styles.SubHeadingText}>{segItem.name} /</Text>
                          <Text style={styles.SubHeadingText}>{subSegItem.name} /</Text>
                          <Text style={[styles.SubHeadingText, styles.SubActive]}>{taskItem.displayName}</Text>
                        </View>
                      </TouchableOpacity>

                    ))

                ))


            )))

        ))}
        {/* No Data Found */}
        {(!loading && !myWorksData.length) &&
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
          </View>
        }
      </ScrollView>

      <LoadingAnimation loading={loading}></LoadingAnimation>
    </View>
  )
}

const styles = StyleSheet.create({
  Container: {
    padding: 20,
  },
  Height100: {
    height: '100%',
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
    marginBottom: 15
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
    borderColor: '#A1A1A1'
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
  BreadcrumbCurrentText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600'
  },
  ArrowIcon: {
    width: 18,
    height: 18
  },

  //MyWork Card
  MyWorkCard: {
    backgroundColor: '#CCD6E7',
    borderRadius: 12,
    justifyContent: 'flex-start',
    paddingVertical: 50,
    paddingHorizontal: 20,
    marginBottom: 15,
    position: 'relative'
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
    justifyContent: 'flex-start'
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
});

export default MyWork