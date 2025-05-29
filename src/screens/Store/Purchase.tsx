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

export default function Purchase() {
  const navigation = useNavigation();
  const [purchaseData, setPurchaseData] = useState([
    {
      id: '1',
      material: 'Cement',
      vendor: 'XYZ',
      qty: 2,
      unit: 'KG',
      rate: 50,
      date: '10 Apr 2025',
      category: 'Raw Materials',
    },
    {
      id: '2',
      material: 'Sand',
      vendor: 'ABC Suppliers',
      qty: 10,
      unit: 'Bags',
      rate: 30,
      date: '15 Apr 2025',
      category: 'Raw Materials',
    },
    {
      id: '3',
      material: 'Bricks',
      vendor: 'Quality',
      qty: 500,
      unit: 'Pieces',
      rate: 8,
      date: '22 Apr 2025',
      category: 'Raw Materials',
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

  const handleEdit = (item: any) => {
    console.log('Edit item:', item);
    // Implement edit functionality
  };

  const handleDelete = (id: any) => {
    console.log('Delete item with id:', id);
    const updatedData = purchaseData.filter(item => item.id !== id);
    setPurchaseData(updatedData);
    setOriginalData(originalData.filter(item => item.id !== id));
  };

  // Function to handle add purchase
  const handleAddPurchase = () => {
    console.log('Add purchase');
    navigation.navigate('AddPurchase');
    // Implement add functionality
  };

  // Function to handle filter
  const handleFilter = () => {
    console.log('Filter purchases');
    setFilterVisible(true);
  };

  // Function to close filter modal
  const closeFilterModal = () => {
    setFilterVisible(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFromDate('');
    setToDate('');
    setSelectedCategory(null);
    setSelectedMaterial(null);
    setSelectedVendor(null);
  };

  // Function to apply filters
  const applyFilter = () => {
    const filters = {
      fromDate,
      toDate,
      category: selectedCategory,
      material: selectedMaterial,
      vendor: selectedVendor,
    };

    console.log('Applying filters:', filters);
    setActiveFilters(filters);

    // Filter the data based on the selected criteria
    let filteredData = [...originalData];

    // Filter by date range
    if (filters.fromDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.date.replace('Apr', '04'));
        const fromDate = new Date(
          filters.fromDate.split('/').reverse().join('-'),
        );
        return itemDate >= fromDate;
      });
    }

    if (filters.toDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.date.replace('Apr', '04'));
        const toDate = new Date(filters.toDate.split('/').reverse().join('-'));
        return itemDate <= toDate;
      });
    }

    // Filter by category
    if (filters.category) {
      filteredData = filteredData.filter(
        item => item.category === filters.category,
      );
    }

    // Filter by material
    if (filters.material) {
      filteredData = filteredData.filter(
        item => item.material === filters.material,
      );
    }

    // Filter by vendor
    if (filters.vendor) {
      filteredData = filteredData.filter(
        item => item.vendor === filters.vendor,
      );
    }

    setPurchaseData(filteredData);
    setFilterVisible(false);
  };

  // Function to clear filters
  const clearFilters = () => {
    setPurchaseData([...originalData]);
    setActiveFilters(null);
    resetFilters();
  };

  // Table Header Component
  const TableHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, {width: 120}]}>Material</Text>
      <Text style={[styles.headerCell, {width: 100}]}>Vendor</Text>
      <Text style={[styles.headerCell, {width: 60}]}>Qty</Text>
      <Text style={[styles.headerCell, {width: 80}]}>Unit</Text>
      <Text style={[styles.headerCell, {width: 100}]}>Rate/Unit</Text>
      <Text style={[styles.headerCell, {width: 150}]}>Purchase Date</Text>
      <Text style={[styles.headerCell, {width: 80}]}>Action</Text>
    </View>
  );

  // Table Row Component
  const renderItem = ({item}: any) => (
    <View style={styles.row}>
      <Text style={[styles.cell, {width: 120}]}>{item.material}</Text>
      <Text style={[styles.cell, {width: 100}]}>{item.vendor}</Text>
      <Text style={[styles.cell, {width: 60}]}>{item.qty}</Text>
      <Text style={[styles.cell, {width: 80}]}>{item.unit}</Text>
      <Text style={[styles.cell, {width: 100}]}>{item.rate}</Text>
      <Text style={[styles.cell, {width: 120}]}>{item.date}</Text>
      <View
        style={[
          {width: 80, flexDirection: 'row', justifyContent: 'space-around'},
        ]}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Text style={styles.cell}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Main Purchase Screen */}
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

      <ScrollView horizontal={true} style={styles.tableContainer}>
        <View>
          <TableHeader />

          {purchaseData.length > 0 ? (
            <FlatList
              data={purchaseData}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No purchase data found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={closeFilterModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <View></View>
              <Text style={styles.modalTitle}>Filter</Text>
              <TouchableOpacity onPress={closeFilterModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>From Date</Text>
                <Pressable style={styles.dateInput}>
                  <TextInput
                    style={styles.input}
                    placeholder="23/04/2025"
                    value={fromDate}
                    onChangeText={setFromDate}
                  />
                  <Text style={styles.dateIcon}>📅</Text>
                </Pressable>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>To Date</Text>
                <Pressable style={styles.dateInput}>
                  <TextInput
                    style={styles.input}
                    placeholder="14/05/2025"
                    value={toDate}
                    onChangeText={setToDate}
                  />
                  <Text style={styles.dateIcon}>📅</Text>
                </Pressable>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Category</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => {}}>
                  <Text style={styles.dropdownText}>
                    {selectedCategory || 'Select Category'}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Material</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    // Simple toggle for this example
                    setSelectedMaterial(selectedMaterial ? null : 'Cement');
                  }}>
                  <Text style={styles.dropdownText}>
                    {selectedMaterial || 'Select Material'}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Vendor</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    // Simple toggle for this example
                    setSelectedVendor(selectedVendor ? null : 'XYZ');
                  }}>
                  <Text style={styles.dropdownText}>
                    {selectedVendor || 'Approved Vendor'}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.footContainer}>
              <TouchableOpacity style={styles.goButton} onPress={applyFilter}>
                <Text style={styles.goButtonText}>Go</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Existing styles from your component
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tableContainer: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4E36A3',
    marginRight: 8,
  },
  addButtonText: {
    color: '#4E36A3',
  },
  filterButton: {
    backgroundColor: '#fff',
    padding: 4,
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
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#E3DEF6',
    padding: 12,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
    paddingHorizontal: 3,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#F8F8F8',
  },
  cell: {
    fontSize: 14,
    paddingHorizontal: 5,
    color: '#333333',
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  emptyStateText: {
    color: '#999',
    fontSize: 16,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  activeFiltersText: {
    color: '#4E36A3',
    fontSize: 14,
  },
  clearFiltersText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Modal styles
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
