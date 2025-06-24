import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  NativeEventEmitter,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {HeaderItems, STORE_OPTION} from '../../constants/constants';
import LinearGradient from 'react-native-linear-gradient';

export default function ProductionHome() {
  const [activeTab, setActiveTab] = useState(STORE_OPTION.PURCHASING);
  const navigation = useNavigation();
  const focus = useIsFocused();

  
  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.production);
    }
  }, [focus]);

  const handleEquipmentPress = ()=> {
    navigation.navigate('ProductionDetail');
  };

  const equipmentData = [
    {
      id: 'HPMC RMC 001',
      plant: 'RMC Plant',
      location: 'Volte Volte 522 KZ210',
      contractorId: 'M/s HPMC Testing contractor/Machineries/5812539',
      pendingRequests: 100,
    },
    {
      id: 'HPMC RMC 002',
      plant: 'RMC Plant',
      location: 'Volte Volte 522 KZ210',
      contractorId: 'M/s HPMC Testing contractor/Machineries/5812539',
      pendingRequests: 80,
    },
    {
      id: 'HPMC RMP 001',
      plant: 'RMP Plant',
      location: 'HMP HMP 522 KZ210',
      contractorId: 'M/s HPMC Testing contractor/Machineries/5812539',
      pendingRequests: 80,
    },
    {
      id: 'HPMC WMM 001',
      plant: 'WMM Plant',
      location: 'WMM HMP 522 KZ210',
      contractorId: 'M/s HPMC Testing contractor/Machineries/5812539',
      pendingRequests: 80,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Plants Equipment List</Text>
      </View>
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}>
        {equipmentData.map((equipment, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleEquipmentPress(equipment)}
            style={styles.equipmentCard}>
            <LinearGradient
              colors={['#FFFFFF', '#E0E7FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientBackground}
            />
            <View style={styles.leftBorder} />
            <View style={styles.equipmentCardContent}>
              <View style={styles.equipmentInfo}>
                <Text style={styles.equipmentId}>{equipment.id}</Text>
                <Text style={styles.equipmentDetails}>
                  {equipment.plant} {equipment.location}
                </Text>
                <Text style={styles.contractorId}>
                  ID: {equipment.contractorId}
                </Text>
                <Text style={styles.pendingText}>
                  Total no. of pending request :{' '}
                  <Text style={styles.pendingCount}>
                    {equipment.pendingRequests}
                  </Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  listContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  equipmentCard: {
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ABBEFD',
    position: 'relative',
    maxHeight: 120,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: '15%',
    bottom: '15%',
    width: 3,
    backgroundColor: '#6366F1',
  },
  equipmentCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
    paddingLeft: 24,
    height: '100%',
  },
  equipmentInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  equipmentId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  equipmentDetails: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 4,
  },
  contractorId: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 8,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  pendingCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
});
