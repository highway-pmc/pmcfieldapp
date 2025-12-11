import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  NativeEventEmitter,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getMaterialRequest, submitMaterialRequest } from '../ManageUsers/actions';
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems } from '../../constants/constants';
import { useSnackbar } from '../../context/SnackbarContext';

const ProductionRequestFormComponent = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { getMeterialRequestFormData, postMeterialRequestFormData, error } = useSelector((state: any) => state.MeterialRequest);

  const [materialRequests, setMaterialRequests] = useState<any[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<any>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<any>(null);

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.ProductionRequestFormLists);
    }
  }, [isFocused]);

   useEffect(() => {
      if (postMeterialRequestFormData) {
        showSnackbar("Material Request submitted successfully", "success");
      } else if (error) {
        showSnackbar(error, "error");
      }
    }, [postMeterialRequestFormData, error]);

  useEffect(() => {
    dispatch(
      getMaterialRequest({
        projectId: loggedInUser?.projectId,
        id: '68a61165cb6297d89de38a28',
      })
    );
  }, []);

  useEffect(() => {
    if (getMeterialRequestFormData?.requestGroups?.length) {
      // Flatten the structure to create individual Material Request cards
      const flattenedRequests: any[] = [];
      let requestCounter = 1;

      getMeterialRequestFormData.requestGroups.forEach((group: any) => {
        group.materialRequests.forEach((workCategory: any) => {
          workCategory.materials.forEach((material: any) => {
            flattenedRequests.push({
              id: requestCounter,
              expanded: false,
              requestTo: group.requestTo,
              testWorkCategoryId: workCategory.testWorkCategoryId,
              testWorkCategoryType: workCategory.testWorkCategoryType,
              testWorkCategoryName: workCategory.testWorkCategoryName,
              testMaterialId: material.testMaterialId,
              materialType: material.materialType,
              materialName: material.materialName,
              unit: material.unit,
              availableCategories: material.materialRequests || [],
              selectedCategories: [],
              comments: '',
            });
            requestCounter++;
          });
        });
      });

      setMaterialRequests(flattenedRequests);
    }
  }, [getMeterialRequestFormData]);

  const toggleExpanded = (requestId: any) => {
    setMaterialRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? { ...request, expanded: !request.expanded }
          : request
      )
    );
  };

  const updateRequest = (requestId: any, field: any, value: any) => {
    setMaterialRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, [field]: value } : request
      )
    );
  };

  const updateCategory = (requestId: any, categoryId: any, field: any, value: any) => {
    setMaterialRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              selectedCategories: request.selectedCategories.map((cat: any) =>
                cat.id === categoryId ? { ...cat, [field]: value } : cat
              ),
            }
          : request
      )
    );
  };

  const addCategory = (requestId: any) => {
    setMaterialRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              selectedCategories: [
                ...request.selectedCategories,
                { id: Date.now(), category: '', quantity: '', unit: request.unit },
              ],
            }
          : request
      )
    );
  };

  const removeCategory = (requestId: any, categoryId: any) => {
    setMaterialRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              selectedCategories: request.selectedCategories.filter(
                (catItem: any) => catItem.id !== categoryId
              ),
            }
          : request
      )
    );
  };

  const handleSave = () => {
    Alert.alert('Success', 'Data saved successfully!');
  };

  const handleSubmitAlternative = () => {
  // Group requests by requestTo, testWorkCategoryId, and testEquipmentId for submission
  const groupedRequests = {};
  
  materialRequests.forEach((request) => {
    if (request.selectedCategories.length === 0) return;
    
    // Include testEquipmentId in the grouping key if it exists
    const key: any = `production-${request.testWorkCategoryId}-${request.testEquipmentId || 'no-equipment'}`;
    
    if (!groupedRequests[key]) {
      groupedRequests[key] = {
        requestTo: 'production',
        testWorkCategoryId: request.testWorkCategoryId,
        testWorkCategoryType: request.testWorkCategoryType,
        testEquipmentId: request.testEquipmentId, // Include equipment ID
        materialTypes: {},
      };
    }
    
    if (!groupedRequests[key].materialTypes[request.testMaterialId]) {
      groupedRequests[key].materialTypes[request.testMaterialId] = {
        testMaterialId: request.testMaterialId,
        type: request.materialType,
        materialCategory: [],
      };
    }
    
    request.selectedCategories.forEach((cat) => {
      if (cat.category && cat.quantity) {
        groupedRequests[key].materialTypes[request.testMaterialId].materialCategory.push({
          category: cat.category,
          qty: Number(cat.quantity),
        });
      }
    });
  });

  const payload = {
    rfiId: '6841ecdec00f933c0c1796c2',
    comments: 'Material request submitted from mobile app.',
    materialRequests: Object.values(groupedRequests).map((group: any) => {
      const materialRequest = {
        requestTo: group.requestTo,
        requestType: 'contingency',
        testWorkCategories: [
          {
            testWorkCategoryId: group.testWorkCategoryId,
            testWorkCategoryType: group.testWorkCategoryType,
            materialTypes: Object.values(group.materialTypes),
          }
        ],
      };
      
      // Only include testEquipmentId if it exists
      if (group.testEquipmentId && group.testEquipmentId !== 'no-equipment') {
        materialRequest.testEquipmentId = group.testEquipmentId;
      }
      
      return materialRequest;
    }),
  };

  console.log('Submitting payload:', JSON.stringify(payload, null, 2));
  dispatch(submitMaterialRequest({ 
    projectId: loggedInUser?.projectId,  
    body: payload
  }));
};

// Alternative approach if you need to prevent over-grouping:
const handleSubmit = () => {
  const materialRequestsMap = new Map();
  
  materialRequests.forEach((request) => {
    if (request.selectedCategories.length === 0) return;
    
    const materialCategories = request.selectedCategories
      .filter(cat => cat.category && cat.quantity)
      .map(cat => ({
        category: cat.category,
        qty: Number(cat.quantity),
      }));
    
    if (materialCategories.length === 0) return;
    
    const requestKey = `'productions'-${request.testEquipmentId || 'no-equipment'}`;
    
    if (!materialRequestsMap.has(requestKey)) {
      materialRequestsMap.set(requestKey, {
        requestTo: 'productions',
        ...(request.testEquipmentId && { testEquipmentId: request.testEquipmentId }),
        testWorkCategories: new Map(),
      });
    }
    
    const materialRequest = materialRequestsMap.get(requestKey);
    const categoryKey = `${request.testWorkCategoryId}`;
    
    if (!materialRequest.testWorkCategories.has(categoryKey)) {
      materialRequest.testWorkCategories.set(categoryKey, {
        testWorkCategoryId: request.testWorkCategoryId,
        testWorkCategoryType: request.testWorkCategoryType,
        materialTypes: [],
      });
    }
    
    materialRequest.testWorkCategories.get(categoryKey).materialTypes.push({
      testMaterialId: request.testMaterialId,
      type: request.materialType,
      materialCategory: materialCategories,
    });
  });

  const payload = {
    rfiId: '6841ecdec00f933c0c1796c2',
    comments: 'Material request submitted from mobile app dsss.',
    materialRequests: Array.from(materialRequestsMap.values()).map(request => ({
      ...request,
      testWorkCategories: Array.from(request.testWorkCategories.values()),
    })),
  };

  console.log('Submitting payloaddsada:', JSON.stringify(payload, null, 2));
  dispatch(submitMaterialRequest({ 
    projectId: loggedInUser?.projectId,  
    body: payload
  }));
};

  const openDropdown = (requestId: any, categoryId: any) => {
    setCurrentRequestId(requestId);
    setCurrentCategoryId(categoryId);
    setDropdownVisible(true);
  };

  const handleSelectCategory = (selectedCategory: any) => {
    updateCategory(currentRequestId, currentCategoryId, 'category', selectedCategory.category);
    updateCategory(currentRequestId, currentCategoryId, 'unit', selectedCategory.unit);
    setDropdownVisible(false);
  };

  const getAvailableCategories = (requestId: any) => {
    const request = materialRequests.find((r) => r.id === requestId);
    if (!request) return [];

    const selectedCategories = request.selectedCategories
      .map((sc: any) => sc.category)
      .filter(Boolean);

    return request.availableCategories.filter(
      (cat: any) => !selectedCategories.includes(cat.category)
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
        </Text>

        {materialRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <TouchableOpacity
              style={styles.requestHeader}
              onPress={() => toggleExpanded(request.id)}
            >
              <View style={styles.requestHeaderLeft}>
                <View style={styles.requestIcon}>
                  <Text style={styles.requestIconText}>{request.id}</Text>
                </View>
                <Text style={styles.requestTitle}>
                  Material Request {request.id}
                </Text>
              </View>
              <View style={styles.expandIconContainer}>
                <Text style={styles.expandIcon}>
                  {request.expanded ? '−' : '+'}
                </Text>
              </View>
            </TouchableOpacity>

            {request.expanded && (
              <View style={styles.requestContent}>
                <View style={styles.inputRow}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Work Category</Text>
                    <TextInput
                      style={styles.textInput}
                      value={request.testWorkCategoryName}
                      placeholder="Concrete structure"
                      placeholderTextColor="#999"
                      editable={false}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Material Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={request.materialName}
                      placeholder="Reinforcement cement"
                      placeholderTextColor="#999"
                      editable={false}
                    />
                  </View>
                </View>

                {request.selectedCategories.map((category: any, index: number) => (
                  <View key={category.id} style={styles.categorySection}>
                    <View style={styles.categorySectionHeader}>
                      <Text style={styles.categorySectionTitle}>
                        Material Category {index + 1}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeCategory(request.id, category.id)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.categoryInputRow}>
                      <TouchableOpacity
                        style={styles.categoryDropdown}
                        onPress={() => openDropdown(request.id, category.id)}
                      >
                        <View style={styles.dropdown}>
                          <Text
                            style={[
                              styles.dropdownText,
                              category.category ? styles.dropdownTextSelected : {},
                            ]}
                          >
                            {category.category || 'Select Category'}
                          </Text>
                          <Text style={styles.dropdownArrow}>▼</Text>
                        </View>
                      </TouchableOpacity>

                      <View style={styles.quantityInput}>
                        <TextInput
                          style={styles.textInput}
                          value={category.quantity}
                          onChangeText={(text) =>
                            updateCategory(request.id, category.id, 'quantity', text)
                          }
                          placeholder="Qty"
                          placeholderTextColor="#999"
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.addMoreButton}
                  onPress={() => addCategory(request.id)}
                >
                  <Text style={styles.addMoreText}>+ Add More</Text>
                </TouchableOpacity>

                <View style={styles.commentsContainer}>
                  <TextInput
                    style={[styles.textInput, styles.commentsInput]}
                    placeholder="Comments, if any"
                    value={request.comments}
                    multiline
                    onChangeText={(text) => updateRequest(request.id, 'comments', text)}
                  />
                </View>
              </View>
            )}
          </View>
        ))}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={dropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>Select Category</Text>
              <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={currentRequestId ? getAvailableCategories(currentRequestId) : []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectCategory(item)}
                >
                  <Text style={styles.dropdownItemText}>{item.category}</Text>
                  <Text style={styles.dropdownItemSubtext}>
                    Unit: {item.unit}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  requestHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  requestIconText: {
    fontSize: 14,
    color: '#6B46C1',
    fontWeight: '600',
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  expandIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandIcon: {
    fontSize: 18,
    color: '#6B46C1',
    fontWeight: 'bold',
  },
  requestContent: {
    padding: 16,
    paddingTop: 0,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  categorySection: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  categorySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categorySectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#FF6B6B',
  },
  categoryInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryDropdown: {
    flex: 2,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#999',
  },
  dropdownTextSelected: {
    color: '#333',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  quantityInput: {
    flex: 1,
  },
  addMoreButton: {
    borderWidth: 1,
    borderColor: '#6B46C1',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  addMoreText: {
    color: '#6B46C1',
    fontSize: 14,
    fontWeight: '500',
  },
  commentsContainer: {
    marginTop: 4,
  },
  commentsInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6B46C1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  saveButtonText: {
    color: '#6B46C1',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#6B46C1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 20,
    maxHeight: '70%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dropdownHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 18,
    color: '#666',
    padding: 4,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dropdownItemSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  dropdownList: {
    maxHeight: 300,
  },
});

export default ProductionRequestFormComponent;