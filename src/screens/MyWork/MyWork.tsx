import { View, Text, Button, NativeEventEmitter, StyleSheet, ScrollView, Image  } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems } from "../../constants/constants"
import { useDispatch, useSelector } from 'react-redux';
import { clearMyWorksEvent, getMyWorks } from './actions';

const MyWork = ({ navigation }: {navigation: any}) => {
  

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { myWorks, loading, error } = useSelector((state: any) => state.MyWorks);
  const [myWorksData, setMyWorksData] = useState([]);

  const dispatch = useDispatch()

  if (useIsFocused()) {
    const eventEmitter = new NativeEventEmitter();
    eventEmitter.emit('headerEvent', HeaderItems.myWork);
  }

  const getMyWorksData = () => {
    dispatch(getMyWorks(loggedInUser.projectId));
  }

  useEffect(() => {
    getMyWorksData();
  }, []);

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
        {myWorksData.map((item: any, index) => (
          <View style={styles.UserCategory}>
            <View style={styles.FlexRowCenter}>
              <View>
                <Text>{item.projectModule.name} &gt; {item.projectModule.type} &gt; {item.projectModule.subType}</Text>
                {
                  // (item.assignmentLevel === 1 && 
                  //   <Text style={styles.UserRole}>{item.projectModule.name}</Text>
                  // )
                  // ||
                  ((item.segmentData && (item.assignmentLevel === 2 || item.assignmentLevel === 3 || item.assignmentLevel === 4)) && 
                    <Text style={styles.UserRole}>{item.segmentData.name} &gt; {item.segmentData.type}</Text>
                  )
                }
                {
                  ((item.subSegmentData && (item.assignmentLevel === 2 || item.assignmentLevel === 3 || item.assignmentLevel === 4)) && 
                    <Text style={styles.UserRole}>{item.subSegmentData.name} &gt; {item.subSegmentData.type}</Text>
                  )
                }
                {
                  ((item.taskData && (item.assignmentLevel === 2 || item.assignmentLevel === 3 || item.assignmentLevel === 4)) && 
                    <Text style={styles.UserRole}>{item.taskData.displayName} &gt; {item.taskData.segmentType} &gt; {item.taskData.segmentCategory}</Text>
                  )
                }
                
              </View>
            </View>
            <View>
            </View>
          </View>
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
    </View>
  )
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    paddingVertical: 10,
    padding: 15,
  },
  Height100: {
    height: '100%',
  },
  UserCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#BECADA',
    borderStyle: 'solid',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  FlexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  UserRole: {
    fontSize: 16,
    fontWeight: '400',
    color: '#808089',
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