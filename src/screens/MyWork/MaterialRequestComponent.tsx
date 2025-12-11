import React, {useEffect, useState} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearMaterialRequest,
  getMaterialRequest,
  submitMaterialRequest,
} from '../ManageUsers/actions';
import {useIsFocused} from '@react-navigation/native';
import {HeaderItems} from '../../constants/constants';
import {useSnackbar} from '../../context/SnackbarContext';

const MaterialRequestComponent = ({route, navigation}: any) => {
  const taskId = route && route.params ? route.params.taskId : undefined;
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {showSnackbar} = useSnackbar();
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {getMeterialRequestFormData, postMeterialRequestFormData, error} =
    useSelector((state: any) => state.MeterialRequest);

  const [materialRequests, setMaterialRequests] = useState<any[]>([]);

  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<any>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<any>(null);

  const [plantDropdownVisible, setPlantDropdownVisible] = useState(false);
  const [currentRequestForPlant, setCurrentRequestForPlant] =
    useState<any>(null);

  // button loaders
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.materialRequestFormLists);
    }
  }, [isFocused]);

  useEffect(() => {
    if (postMeterialRequestFormData) {
      setIsSubmitting(false);
      showSnackbar('Material Request submitted successfully', 'success');
      navigation.goBack();
    } else if (error) {
      setIsSubmitting(false);
      showSnackbar(error, 'error');
    }
  }, [postMeterialRequestFormData, error]);

  useEffect(() => {
    if (isFocused && taskId) {
      dispatch(clearMaterialRequest());
      dispatch(
        getMaterialRequest({
          projectId: loggedInUser?.projectId,
          id: taskId,
        }),
      );
    }
  }, [isFocused, taskId]);

  useEffect(() => {
    if (getMeterialRequestFormData?.requestGroups?.length) {
      const flattenedRequests: any[] = [];
      let requestCounter = 1;

      getMeterialRequestFormData.requestGroups.forEach((group: any) => {
        const requestType = group.requestTo;

        group.materialRequests.forEach((workCategory: any) => {
          workCategory.materials.forEach((material: any) => {
            flattenedRequests.push({
              id: requestCounter,
              uniqueKey: `${requestCounter}-${material.testMaterialId}`,
              expanded: false,

              requestTo: requestType,
              testWorkCategoryId: workCategory.testWorkCategoryId,
              testWorkCategoryType: workCategory.testWorkCategoryType,
              testWorkCategoryName: workCategory.testWorkCategoryName,
              testMaterialId: material.testMaterialId,

              materialType: material.materialType,
              materialName: material.materialName,
              unit: material.unit,

              availableCategories: material.materialRequests || [],
              availablePlants: material.availablePlants || [],

              selectedCategories: [],
              selectedPlantId: null,
              selectedPlantName: '',
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
    setMaterialRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {...request, expanded: !request.expanded}
          : request,
      ),
    );
  };

  const updateRequest = (requestId: any, field: any, value: any) => {
    setMaterialRequests(prev =>
      prev.map(request =>
        request.id === requestId ? {...request, [field]: value} : request,
      ),
    );
  };

  const addCategory = (requestId: any) => {
    setMaterialRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              selectedCategories: [
                ...request.selectedCategories,
                {
                  id: Date.now(),
                  category: '',
                  quantity: '',
                  unit: request.unit,
                },
              ],
            }
          : request,
      ),
    );
  };

  const updateCategory = (
    requestId: any,
    categoryId: any,
    field: any,
    value: any,
  ) => {
    setMaterialRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              selectedCategories: request.selectedCategories.map((cat: any) =>
                cat.id === categoryId ? {...cat, [field]: value} : cat,
              ),
            }
          : request,
      ),
    );
  };

  const removeCategory = (requestId: any, categoryId: any) => {
    setMaterialRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              selectedCategories: request.selectedCategories.filter(
                (catItem: any) => catItem.id !== categoryId,
              ),
            }
          : request,
      ),
    );
  };

  const openCategoryDropdown = (requestId: any, categoryId: any) => {
    setCurrentRequestId(requestId);
    setCurrentCategoryId(categoryId);
    setCategoryDropdownVisible(true);
  };

  const handleSelectCategory = (selectedCategory: any) => {
    updateCategory(
      currentRequestId,
      currentCategoryId,
      'category',
      selectedCategory.category,
    );
    updateCategory(
      currentRequestId,
      currentCategoryId,
      'unit',
      selectedCategory.unit,
    );
    setCategoryDropdownVisible(false);
  };

  const openPlantDropdown = (request: any) => {
    setCurrentRequestForPlant(request);
    setPlantDropdownVisible(true);
  };

  const handleSelectPlant = (plant: any) => {
    if (currentRequestForPlant) {
      updateRequest(currentRequestForPlant.id, 'selectedPlantId', plant._id);
      updateRequest(currentRequestForPlant.id, 'selectedPlantName', plant.name);
      setPlantDropdownVisible(false);
    }
  };

  const getAvailableCategories = (requestId: any) => {
    const request = materialRequests.find(r => r.id === requestId);
    if (!request) return [];
    const selectedCats = request.selectedCategories
      .map((sc: any) => sc.category)
      .filter(Boolean);
    return request.availableCategories.filter(
      (cat: any) => !selectedCats.includes(cat.category),
    );
  };

  const handleSubmit = () => {
    const isValid = materialRequests.every(req => {
      if (
        req.selectedCategories.length > 0 &&
        req.requestTo === 'production' &&
        !req.selectedPlantId
      ) {
        return false;
      }
      return true;
    });

    if (!isValid) {
      Alert.alert(
        'Validation Error',
        'Please select a Plant for all Production requests.',
      );
      return;
    }

    const finalPayloadRequests: any[] = [];
    const procurementMap = new Map();

    materialRequests.forEach(request => {
      if (request.selectedCategories.length === 0) return;

      const validCategories = request.selectedCategories
        .filter((c: any) => c.category && c.quantity)
        .map((c: any) => ({
          category: c.category,
          qty: Number(c.quantity),
        }));

      if (validCategories.length === 0) return;

      if (request.requestTo === 'production') {
        validCategories.forEach((catObj: any) => {
          const productionRequest = {
            requestTo: 'production',
            testEquipmentId: request.selectedPlantId,
            testWorkCategories: [
              {
                testWorkCategoryId: request.testWorkCategoryId,
                testWorkCategoryType: request.testWorkCategoryType,
                materialTypes: [
                  {
                    testMaterialId: request.testMaterialId,
                    type: request.materialType,
                    materialCategory: [catObj],
                  },
                ],
              },
            ],
          };
          finalPayloadRequests.push(productionRequest);
        });
      } else {
        const key = `${request.testWorkCategoryId}`;

        if (!procurementMap.has(key)) {
          procurementMap.set(key, {
            requestTo: request.requestTo,
            testWorkCategoryId: request.testWorkCategoryId,
            testWorkCategoryType: request.testWorkCategoryType,
            materialTypes: [],
          });
        }

        const group = procurementMap.get(key);
        group.materialTypes.push({
          testMaterialId: request.testMaterialId,
          type: request.materialType,
          materialCategory: validCategories,
        });
      }
    });

    procurementMap.forEach(group => {
      finalPayloadRequests.push({
        requestTo: group.requestTo,
        testWorkCategories: [
          {
            testWorkCategoryId: group.testWorkCategoryId,
            testWorkCategoryType: group.testWorkCategoryType,
            materialTypes: group.materialTypes,
          },
        ],
      });
    });

    if (finalPayloadRequests.length === 0) {
      Alert.alert('Empty', 'Please add at least one material quantity.');
      return;
    }

    const payload = {
      rfiId: getMeterialRequestFormData?.rfiId,
      isMaterialRequested: 'true',
      comments: 'Request generated from mobile app',
      materialRequests: finalPayloadRequests,
    };

    console.log('Final Payload:', JSON.stringify(payload, null, 2));

    setIsSubmitting(true);
    console.log('Final Project id:', loggedInUser?.projectId);
    dispatch(
      submitMaterialRequest({
        projectId: loggedInUser?.projectId,
        body: payload,
      }),
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    Alert.alert('Saved', 'Local progress saved.');
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  const isInitialLoading =
    !getMeterialRequestFormData &&
    !error &&
    !!taskId &&
    materialRequests.length === 0;

  if (isInitialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
        <Text style={styles.loadingText}>Loading material requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Create requests for Procurement or Production simultaneously.
        </Text>

        {materialRequests.map(request => (
          <View key={request.id} style={styles.requestCard}>
            <TouchableOpacity
              style={styles.requestHeader}
              onPress={() => toggleExpanded(request.id)}>
              <View style={styles.requestHeaderLeft}>
                <View
                  style={[
                    styles.typeBadge,
                    request.requestTo === 'production'
                      ? styles.badgeProduction
                      : styles.badgeProcurement,
                  ]}>
                  <Text style={styles.typeBadgeText}>
                    {request.requestTo === 'production' ? 'PROD' : 'STORE'}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.requestTitle}>
                    {request.materialName}
                  </Text>
                  <Text style={styles.subTitle}>
                    To:{' '}
                    {request.requestTo === 'production'
                      ? 'Production Plant'
                      : 'Procurement/Store'}
                  </Text>
                </View>
              </View>
              <View style={styles.expandIconContainer}>
                <Text style={styles.expandIcon}>
                  {request.expanded ? '−' : '+'}
                </Text>
              </View>
            </TouchableOpacity>

            {request.expanded && (
              <View style={styles.requestContent}>
                {/* Work Category / Material Name / Material Type – vertical */}
                <View style={styles.verticalInfoGroup}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Work Category</Text>
                    <TextInput
                      style={[styles.textInput, styles.readOnlyInput]}
                      value={request.testWorkCategoryName}
                      editable={false}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Material Name</Text>
                    <TextInput
                      style={[styles.textInput, styles.readOnlyInput]}
                      value={request.materialName}
                      editable={false}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Material Type</Text>
                    <TextInput
                      style={[styles.textInput, styles.readOnlyInput]}
                      value={request.materialType}
                      editable={false}
                    />
                  </View>
                </View>

                {request.requestTo === 'production' && (
                  <View style={styles.plantSelectionContainer}>
                    <Text style={styles.inputLabel}>
                      Select Plant/Machinery *
                    </Text>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => openPlantDropdown(request)}>
                      <Text
                        style={[
                          styles.dropdownButtonText,
                          !request.selectedPlantName && styles.placeholderText,
                        ]}>
                        {request.selectedPlantName || 'Select Batching Plant'}
                      </Text>
                      <Text>▼</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {request.selectedCategories.map(
                  (category: any, index: number) => (
                    <View key={category.id} style={styles.categorySection}>
                      <View style={styles.categorySectionHeader}>
                        <Text style={styles.categorySectionTitle}>
                          Item {index + 1}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            removeCategory(request.id, category.id)
                          }
                          style={styles.deleteButton}>
                          <Text style={styles.deleteButtonText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.categoryInputRow}>
                        <TouchableOpacity
                          style={styles.categoryDropdown}
                          onPress={() =>
                            openCategoryDropdown(request.id, category.id)
                          }>
                          <View style={styles.dropdown}>
                            <Text
                              style={[
                                styles.dropdownText,
                                category.category
                                  ? styles.dropdownTextSelected
                                  : {},
                              ]}>
                              {category.category || 'Select Grade/Size'}
                            </Text>
                            <Text style={styles.dropdownArrow}>▼</Text>
                          </View>
                        </TouchableOpacity>

                        <View style={styles.quantityInput}>
                          <TextInput
                            style={styles.textInput}
                            value={category.quantity}
                            onChangeText={text =>
                              updateCategory(
                                request.id,
                                category.id,
                                'quantity',
                                text,
                              )
                            }
                            placeholder="Qty"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                          />
                        </View>

                        <View style={styles.unitContainer}>
                          <Text style={styles.unitText}>
                            {category.unit || request.unit}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ),
                )}

                <TouchableOpacity
                  style={styles.addMoreButton}
                  onPress={() => addCategory(request.id)}>
                  <Text style={styles.addMoreText}>+ Add Quantity</Text>
                </TouchableOpacity>

                <View style={styles.commentsContainer}>
                  <TextInput
                    style={[styles.textInput, styles.commentsInput]}
                    placeholder="Remarks / Comments"
                    value={request.comments}
                    multiline
                    onChangeText={text =>
                      updateRequest(request.id, 'comments', text)
                    }
                  />
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom bar buttons fixed at bottom */}
      <View style={styles.bottomBar}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (isSaving || isSubmitting) && styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={isSaving || isSubmitting}>
            {isSaving ? (
              <ActivityIndicator size="small" color="#6B46C1" />
            ) : (
              <Text style={styles.saveButtonText}>Save Draft</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (isSubmitting || isSaving) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || isSaving}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* full-screen submit loader */}
      {isSubmitting && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#6B46C1" />
            <Text style={styles.loaderText}>Submitting request...</Text>
          </View>
        </View>
      )}

      {/* MODAL 1: Category Selection */}
      <Modal
        transparent
        visible={categoryDropdownVisible}
        animationType="fade"
        onRequestClose={() => setCategoryDropdownVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setCategoryDropdownVisible(false)}>
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>Select Category</Text>
              <TouchableOpacity
                onPress={() => setCategoryDropdownVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={
                currentRequestId ? getAvailableCategories(currentRequestId) : []
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectCategory(item)}>
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

      {/* MODAL 2: Plant Selection */}
      <Modal
        transparent
        visible={plantDropdownVisible}
        animationType="fade"
        onRequestClose={() => setPlantDropdownVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setPlantDropdownVisible(false)}>
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>
                Select Equipment / Plant
              </Text>
              <TouchableOpacity onPress={() => setPlantDropdownVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={
                currentRequestForPlant
                  ? currentRequestForPlant.availablePlants
                  : []
              }
              keyExtractor={item => item._id}
              ListEmptyComponent={
                <Text style={{padding: 20, textAlign: 'center'}}>
                  No plants available
                </Text>
              }
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectPlant(item)}>
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                  <Text style={styles.dropdownItemSubtext}>
                    {item.uniqueEquipmentId} | {item.testEquipmentType}
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
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
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginRight: 10,
    minWidth: 55,
    alignItems: 'center',
  },
  badgeProduction: {
    backgroundColor: '#FFF4E5',
    borderWidth: 1,
    borderColor: '#FFD8A8',
  },
  badgeProcurement: {
    backgroundColor: '#E7F5FF',
    borderWidth: 1,
    borderColor: '#A5D8FF',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#444',
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subTitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  expandIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
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
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  verticalInfoGroup: {
    marginTop: 16,
    marginBottom: 12,
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 12,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  readOnlyInput: {
    backgroundColor: '#f9f9f9',
    color: '#777',
  },
  plantSelectionContainer: {
    marginBottom: 16,
    marginTop: 4,
    backgroundColor: '#FFF9DB',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE066',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  dropdownButtonText: {
    color: '#333',
    fontSize: 14,
  },
  placeholderText: {
    color: '#999',
  },
  categorySection: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  categorySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categorySectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  categoryInputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
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
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    height: 45,
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
  unitContainer: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unitText: {
    fontSize: 12,
    color: '#666',
  },
  addMoreButton: {
    borderWidth: 1,
    borderColor: '#6B46C1',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderStyle: 'dashed',
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
    minHeight: 60,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6B46C1',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  saveButtonText: {
    color: '#6B46C1',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#6B46C1',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
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
    shadowOffset: {width: 0, height: 2},
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
    fontSize: 16,
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
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  dropdownItemSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  dropdownList: {
    maxHeight: 300,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  loaderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
});

export default MaterialRequestComponent;
