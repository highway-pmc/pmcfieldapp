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

export default function Inventory() {
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
      material: 'Cement',
      qty: 10,
      unit: 'KG',
      rate: 50,
      value: 500,
      purchaseDate: '10 Apr 2025',
      category: 'Raw Materials',
    },
    {
      id: '4',
      material: 'Steel',
      qty: 5,
      unit: 'Tons',
      rate: 2000,
      value: 10000,
      purchaseDate: '15 Apr 2025',
      category: 'Raw Materials',
    },
    {
      id: '5',
      material: 'Cement',
      qty: 10,
      unit: 'KG',
      rate: 50,
      value: 500,
      purchaseDate: '10 Apr 2025',
      category: 'Raw Materials',
    },
    {
      id: '6',
      material: 'Steel',
      qty: 5,
      unit: 'Tons',
      rate: 2000,
      value: 10000,
      purchaseDate: '15 Apr 2025',
      category: 'Raw Materials',
    },
    // Add more items as needed
  ]);

  const [originalData, setOriginalData] = useState([...inventoryData]);

  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Function to handle edit action
  const handleEdit = (item: any) => {
    console.log('Edit item:', item);
    // Implement edit functionality
  };

  // Function to handle filter
  const handleFilter = () => {
    console.log('Filter inventory');
    setFilterVisible(true);
  };

  // Function to close filter modal
  const closeFilterModal = () => {
    setFilterVisible(false);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedMaterial(null);
  };

  // Function to apply filters
  const applyFilter = () => {
    const filters = {
      category: selectedCategory,
      material: selectedMaterial,
    };

    console.log('Applying filters:', filters);
    setActiveFilters(filters);

    // Filter the data based on the selected criteria
    let filteredData = [...originalData];

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

    setInventoryData(filteredData);
    setFilterVisible(false);
  };

  // Function to clear filters
  const clearFilters = () => {
    setInventoryData([...originalData]);
    setActiveFilters(null);
    resetFilters();
  };

  // Table Header Component
  const TableHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, {width: 120}]}>Material</Text>
      <Text style={[styles.headerCell, {width: 60}]}>Qty</Text>
      <Text style={[styles.headerCell, {width: 80}]}>Unit</Text>
      <Text style={[styles.headerCell, {width: 100}]}>Rate/Unit</Text>
      <Text style={[styles.headerCell, {width: 100}]}>Value</Text>
      <Text style={[styles.headerCell, {width: 150}]}>Purchase Date</Text>
      <Text style={[styles.headerCell, {width: 80}]}>Action</Text>
    </View>
  );

  // Table Row Component
  const renderItem = ({item}) => (
    <View style={styles.row}>
      <Text style={[styles.cell, {width: 120}]}>{item.material}</Text>
      <Text style={[styles.cell, {width: 60}]}>{item.qty}</Text>
      <Text style={[styles.cell, {width: 80}]}>{item.unit}</Text>
      <Text style={[styles.cell, {width: 100}]}>{item.rate}</Text>
      <Text style={[styles.cell, {width: 100}]}>{item.value}</Text>
      <Text style={[styles.cell, {width: 150}]}>{item.purchaseDate}</Text>
      <View
        style={[
          styles.cell,
          {width: 80, flexDirection: 'row', justifyContent: 'space-around'},
        ]}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Text>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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

          {inventoryData.length > 0 ? (
            <FlatList
              data={inventoryData}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No inventory data found</Text>
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
                <Text style={styles.filterLabel}>Category</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    // Simple toggle for this example
                    setSelectedCategory(
                      selectedCategory ? null : 'Raw Materials',
                    );
                  }}>
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
    paddingHorizontal: 3,
    color: '#000000',
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
