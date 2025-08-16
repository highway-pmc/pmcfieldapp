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

export default function Inventory() {
  const navigation = useNavigation();
  const [inventoryData, setInventoryData] = useState([
    {
      id: '1',
      material: 'Cement',
      qty: 10,
      unit: 'KG',
      rate: 50,
      value: 500,
      purchaseDate: '10 Apr 2025',
      category: 'Raw Materials',
    },
    {
      id: '2',
      material: 'Steel',
      qty: 5,
      unit: 'Tons',
      rate: 2000,
      value: 10000,
      purchaseDate: '15 Apr 2025',
      category: 'Raw Materials',
    },
    {
      id: '3',
      material: 'Bricks',
      qty: 5000,
      unit: 'Pieces',
      rate: 8,
      value: 40000,
      purchaseDate: '22 Apr 2025',
      category: 'Building Materials',
    },
    {
      id: '4',
      material: 'Sand',
      qty: 2,
      unit: 'Ton',
      rate: 1500,
      value: 3000,
      purchaseDate: '25 Apr 2025',
      category: 'Raw Materials',
    },
  ]);

  const [originalData, setOriginalData] = useState([...inventoryData]);

  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);

  // Added states for date filtering
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const handleEdit = (item: any) => {
    console.log('Edit item:', item);
    // Implement edit functionality
  };

  // Added delete handler to match Purchase component
  const handleDelete = (id: any) => {
    console.log('Delete item with id:', id);
    const updatedData = inventoryData.filter(item => item.id !== id);
    setInventoryData(updatedData);
    setOriginalData(originalData.filter(item => item.id !== id));
  };

  const handleFilter = () => {
    setFilterVisible(true);
  };

  const closeFilterModal = () => {
    setFilterVisible(false);
  };

  const resetFilters = () => {
    setFromDate('');
    setToDate('');
    setSelectedCategory(null);
    setSelectedMaterial(null);
  };

  const applyFilter = () => {
    const filters = {
      fromDate,
      toDate,
      category: selectedCategory,
      material: selectedMaterial,
    };
    setActiveFilters(filters);

    let filteredData = [...originalData];

    // Date range filtering logic
    if (filters.fromDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.purchaseDate);
        const fromDateObj = new Date(
          filters.fromDate.split('/').reverse().join('-'),
        );
        return itemDate >= fromDateObj;
      });
    }

    if (filters.toDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.purchaseDate);
        const toDateObj = new Date(
          filters.toDate.split('/').reverse().join('-'),
        );
        return itemDate <= toDateObj;
      });
    }

    if (filters.category) {
      filteredData = filteredData.filter(
        item => item.category === filters.category,
      );
    }
    if (filters.material) {
      filteredData = filteredData.filter(
        item => item.material === filters.material,
      );
    }

    setInventoryData(filteredData);
    setFilterVisible(false);
  };

  const clearFilters = () => {
    setInventoryData([...originalData]);
    setActiveFilters(null);
    resetFilters();
  };

  // Sub-components for the fixed column table structure
  const FixedColumnHeader = () => (
    <View style={styles.fixedHeaderCell}>
      <Text style={styles.fixedHeaderText}>Material</Text>
    </View>
  );

  const ScrollableHeaders = () => (
    <View style={styles.scrollableHeaderRow}>
      <Text style={[styles.headerCell, {width: 60}]}>Qty</Text>
      <Text style={[styles.headerCell, {width: 80}]}>Unit</Text>
      <Text style={[styles.headerCell, {width: 100}]}>Rate/Unit</Text>
      <Text style={[styles.headerCell, {width: 100}]}>Value</Text>
      <Text style={[styles.headerCell, {width: 150}]}>Purchase Date</Text>
      <Text style={[styles.headerCell, {width: 80}]}>Action</Text>
    </View>
  );

  const ScrollableTable = () => (
    <View>
      <ScrollableHeaders />
      <FlatList
        data={inventoryData}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ScrollableRow item={item} />}
        scrollEnabled={false}
      />
    </View>
  );

  const FixedColumnRow = ({item}: any) => (
    <View style={styles.fixedCell}>
      <Text style={styles.fixedCellText}>{item.material}</Text>
    </View>
  );

  const ScrollableRow = ({item}: any) => (
    <View style={styles.scrollableRow}>
      <Text style={[styles.cell, {width: 60}]}>{item.qty}</Text>
      <Text style={[styles.cell, {width: 80}]}>{item.unit}</Text>
      <Text style={[styles.cell, {width: 100}]}>{item.rate}</Text>
      <Text style={[styles.cell, {width: 100}]}>{item.value}</Text>
      <Text style={[styles.cell, {width: 150}]}>{item.purchaseDate}</Text>
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
      {/* Header with Add and Filter buttons */}
      <View style={styles.header}>
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

      {/* Table with Fixed First Column */}
      <View style={styles.tableContainer}>
        {inventoryData.length > 0 ? (
          <View style={styles.dataContainer}>
            {/* Fixed Column */}
            <View style={styles.fixedColumn}>
              <FixedColumnHeader />
              <FlatList
                data={inventoryData}
                keyExtractor={item => item.id}
                renderItem={({item}) => <FixedColumnRow item={item} />}
                scrollEnabled={false}
              />
            </View>

            {/* Scrollable Columns */}
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <ScrollableTable />
            </ScrollView>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No inventory data found</Text>
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={closeFilterModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <View style={{width: 30}} />
              <Text style={styles.modalTitle}>Filter</Text>
              <TouchableOpacity onPress={closeFilterModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {/* Date Filters */}
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

              {/* Category and Material Filters */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Category</Text>
                <TouchableOpacity style={styles.dropdown}>
                  <Text style={styles.dropdownText}>
                    {selectedCategory || 'Select Category'}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Material</Text>
                <TouchableOpacity style={styles.dropdown}>
                  <Text style={styles.dropdownText}>
                    {selectedMaterial || 'Select Material'}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

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

// Styles copied and merged from Purchase component
const styles = StyleSheet.create({
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
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 5,
  },
  dataContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  fixedColumn: {
    width: 120,
  },
  fixedHeaderCell: {
    width: 120,
    padding: 12,
    backgroundColor: '#E3DEF6',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  fixedHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
    paddingHorizontal: 3,
  },
  scrollableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#E3DEF6',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
    paddingHorizontal: 3,
    textAlign: 'center',
  },
  fixedCell: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    minHeight: 50,
  },
  fixedCellText: {
    fontSize: 14,
    paddingHorizontal: 5,
    color: '#333333',
  },
  scrollableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
    backgroundColor: '#F8F8F8',
    minHeight: 50,
  },
  cell: {
    fontSize: 14,
    paddingHorizontal: 5,
    color: '#333333',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 16,
  },
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
    maxHeight: 400, // Limit height to prevent full-screen modal on larger devices
    marginHorizontal: 7,
    paddingTop: 10,
  },
  filterSection: {
    marginBottom: 15,
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
    color: '#333',
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
