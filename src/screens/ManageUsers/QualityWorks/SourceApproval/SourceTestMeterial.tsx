import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { getSourceApprovals } from '../../actions';
import TestMeterialCard from '../../../Common/TestMeterialCard';

const SourceTestMeterial = ({route, navigation}: {route: any; navigation: any}) => {
    const { meterialId } = route.params; 
    const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
    const {sourceApprovals, loading, error} = useSelector((state: any) => state.SourceApprovals);
    const dispatch = useDispatch();
    useEffect(() => {
        getMeterialData(meterialId);
        if (sourceApprovals) {
            console.log('source meterial DATA: ', meterialId, loggedInUser.projectId, sourceApprovals)
        }
    },[]);

    const getMeterialData = (meterialId: any) => {
        dispatch(
          getSourceApprovals({
            projectId: loggedInUser.projectId,
            testMaterialId: meterialId || '',
          }),
        );
      };

      const handleActionPress = (request: any) => {
        // Implement your action logic here
        console.log('Action pressed for request:', request);
      };


  return (
    <ScrollView style={styles.listContainer}>
        {sourceApprovals?.length > 0 &&
              sourceApprovals.map((request: any) => (
                <TestMeterialCard
                  key={request._id}
                  request={request}
                  onActionPress={handleActionPress}
                />
              ))
        }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7FF',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
  },
  backButton: {
    fontSize: 16,
    color: '#4E36A3',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4E36A3',
  },
  addButtonText: {
    color: '#4E36A3',
    fontWeight: 'bold',
  },
});

export default SourceTestMeterial