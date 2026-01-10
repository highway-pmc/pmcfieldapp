import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  NativeEventEmitter,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {HeaderItems} from '../../constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {getPlantsList} from '../../screens/ManageUsers/QualityWorks/Equipment/actions';
import {useSnackbar} from '../../context/SnackbarContext';

export default function ProductionHome() {
  const navigation = useNavigation();
  const focus = useIsFocused();
  const dispatch = useDispatch();
  const {showSnackbar} = useSnackbar();

  const {plants, loading, error} = useSelector(
    (state: any) => state.EquipmentsCalibration,
  );
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  useEffect(() => {
    if (focus) {
      dispatch(getPlantsList({projectId: loggedInUser.projectId}));
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.production);
    }
  }, [focus, dispatch]);

  // Error handling as requested
  useEffect(() => {
    if (error) {
      showSnackbar(error, 'error');
    }
  }, [error]);

  const handleEquipmentPress = (equipment: any) => {
    navigation.navigate('ProductionDetail', {equipment});
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading equipment data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plants Equipment List</Text>
        <Text style={styles.headerCount}>
          {plants?.equipments?.length || 0} Total
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {plants?.equipments?.map((item: any, index: number) => (
          <TouchableOpacity
            key={item._id || index}
            onPress={() => handleEquipmentPress(item)}
            activeOpacity={0.8}
            style={styles.card}>
            {/* Header Section */}
            <View style={styles.cardHeader}>
              <View style={{flex: 1}}>
                <Text style={styles.equipmentName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.uniqueId}>{item.uniqueEquipmentId}</Text>
              </View>
            </View>

            {/* Content Section */}
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>CATEGORY</Text>
                <Text style={styles.value}>
                  {item.testEquipmentCategoryType}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>EQUIPMENT TYPE</Text>
                <Text style={styles.value}>{item.testEquipmentType}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Footer Section */}
            <View style={styles.cardFooter}>
              <View style={styles.footerInfo}>
                <Text style={styles.label}>MODEL NO</Text>
                <Text style={styles.value}>{item.modelNo || 'N/A'}</Text>
              </View>
              <View style={[styles.footerInfo, {alignItems: 'flex-end'}]}>
                <Text style={styles.label}>CREATED BY</Text>
                <Text style={styles.creatorName}>{item.createdBy?.name}</Text>
                <Text style={styles.designation}>
                  {item.createdBy?.designation}
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
    backgroundColor: '#F9FAFB', // Clean light background
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    // Soft shadow for "rich" look
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  uniqueId: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  designation: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
});
