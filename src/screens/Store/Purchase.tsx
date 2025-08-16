import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RequestCard from '../Common/RequestCard';
import {MATERIAL_REQUEST_STATUS} from '../../constants/constants';

export default function Purchase() {
  const navigation = useNavigation<any>();
  const [purchaseData, setPurchaseData] = useState([
    {
      id: 1,
      materialType: 'Concrete (Structure)',
      workCategory: 'Admixture',
      unit: 'Kg',
      requestQty: 100,
      status: MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE,
      statusText: 'Pending for Acceptance',
    },
    {
      id: 2,
      materialType: 'Steel TMT Bars',
      workCategory: 'Reinforcement',
      unit: 'Ton',
      requestQty: 5,
      status: MATERIAL_REQUEST_STATUS.PENDING_APPROVAL,
      statusText: 'Pending for Approval',
    },
    {
      id: 3,
      materialType: 'Cement Bags',
      workCategory: 'Masonry',
      unit: 'Bag',
      requestQty: 250,
      status: MATERIAL_REQUEST_STATUS.PENDING_DISPATCH,
      statusText: 'Pending for Dispatch',
    },
    {
      id: 4,
      materialType: 'Electrical Wiring',
      workCategory: 'MEP',
      unit: 'Meter',
      requestQty: 500,
      status: MATERIAL_REQUEST_STATUS.REJECTED,
      statusText: 'Rejected',
    },
  ]);

  const [originalData, setOriginalData] = useState([...purchaseData]);

  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleAddPurchase = () => {
    console.log('Add purchase');
    navigation.navigate('AddPurchase');
  };

  const handleFilter = () => {
    setFilterVisible(true);
  };

  const closeFilterModal = () => {
    setFilterVisible(false);
  };
  const handleActionPress = (request: any) => {
    // Implement your action logic here
    console.log('Action pressed for request:', request);
  };
  const resetFilters = () => {
    setFromDate('');
    setToDate('');
    setSelectedCategory(null);
    setSelectedMaterial(null);
    setSelectedVendor(null);
  };

  const applyFilter = () => {
    const filters = {
      fromDate,
      toDate,
      category: selectedCategory,
      material: selectedMaterial,
      vendor: selectedVendor,
    };
    setActiveFilters(filters);

    let filteredData = [...originalData];

    // Apply filters... (Your existing filter logic is correct and remains unchanged)

    setPurchaseData(filteredData);
    setFilterVisible(false);
  };

  const clearFilters = () => {
    setPurchaseData([...originalData]);
    setActiveFilters(null);
    resetFilters();
  };

  return (
    <View style={styles.container}>
      {/* Header with Add and Filter buttons */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPurchase}>
          <Text style={styles.addButtonText}>Add Purchase</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilters && styles.activeFilterButton,
          ]}
          onPress={handleFilter}>
          <Text
            style={[
              {color: '#4E36A3'},
              activeFilters && styles.activeFilterText,
            ]}>
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Filters Display */}
      {activeFilters && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            Filters applied:{' '}
            {Object.values(activeFilters).filter(Boolean).length}
          </Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Card List */}
      <FlatList
        data={purchaseData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <RequestCard
            key={item.id}
            request={item}
            onActionPress={handleActionPress}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No purchase data found</Text>
          </View>
        }
        contentContainerStyle={{paddingBottom: 20}}
      />

      {/* Filter Modal remains the same */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={closeFilterModal}>
        {/* Your Modal JSX Here - it remains unchanged */}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4E36A3',
    marginRight: 8,
  },
  addButtonText: {
    color: '#4E36A3',
    fontWeight: '600',
  },
  filterButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4E36A3',
  },
  activeFilterButton: {
    backgroundColor: '#4E36A3',
  },
  activeFilterText: {
    color: '#fff',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#E3DEF6',
    borderRadius: 8,
  },
  activeFiltersText: {
    color: '#4E36A3',
    fontSize: 14,
    fontWeight: '500',
  },
  clearFiltersText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 50,
  },
  emptyStateText: {
    color: '#6E6E82',
    fontSize: 16,
  },
  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardBody: {
    padding: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 14,
    color: '#6E6E82',
  },
  dataValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  dataValueBold: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAF5',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButton: {
    marginLeft: 16,
    padding: 8,
  },
  editButtonText: {
    color: '#4E36A3',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#DC3545',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal styles (unchanged)
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#EBEBF0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    fontSize: 24,
    color: '#000000',
  },
  modalContent: {
    marginBottom: 5,
    marginHorizontal: 7,
  },
  filterSection: {
    marginBottom: 6,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  dateInput: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  dateIcon: {
    fontSize: 18,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    height: 40,
    paddingHorizontal: 10,
  },
  dropdownText: {
    color: '#999',
  },
  dropdownIcon: {
    fontSize: 12,
  },
  goButton: {
    backgroundColor: '#4E36A3',
    borderRadius: 25,
    height: 32,
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 62,
    backgroundColor: '#F7F3FF',
    borderTopWidth: 1,
    borderTopColor: '#EBEBF0',
  },
});
