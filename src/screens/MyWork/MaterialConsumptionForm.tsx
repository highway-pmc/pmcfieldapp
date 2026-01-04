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
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearMaterialRequest,
  getMaterialRequest,
  getSourceApprovalsByStatus,
  submitMaterialRequest,
} from '../ManageUsers/actions';
import {getMixDesignListInfo} from '../RFIs/actions'; // Imported from Old
import {useSnackbar} from '../../context/SnackbarContext';
import {SOURCE_APPROVAL_STATUS} from '../../constants/constants';

const MaterialConsumptionForm = ({
  materialData,
  rfiId,
  taskId,
  onSubmissionSuccess,
}: any) => {
  const dispatch = useDispatch();
  const {showSnackbar} = useSnackbar();

  // Redux Selectors
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {getMeterialRequestFormData, postMeterialRequestFormData, error} =
    useSelector((state: any) => state.MeterialRequest);

  // Selectors for Source/Mix Data
  const {sourceByStatusData, loading: sourceLoading} = useSelector(
    (state: any) => state.SourceApprovals,
  );
  const {qualityMixDesignListInfo, loading: mixLoading} = useSelector(
    (state: any) => state.RFIs,
  );

  // Local State
  const [materialRequests, setMaterialRequests] = useState<any[]>([]);

  // Modal States
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [plantDropdownVisible, setPlantDropdownVisible] = useState(false);
  const [sourceDropdownVisible, setSourceDropdownVisible] = useState(false); // New Modal

  // Context for current selection
  const [currentRequestId, setCurrentRequestId] = useState<any>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<any>(null);
  const [currentRequestForPlant, setCurrentRequestForPlant] =
    useState<any>(null);

  // Options State
  const [currentSourceOptions, setCurrentSourceOptions] = useState<any[]>([]);
  const [currentSourceType, setCurrentSourceType] = useState<string>(''); // 'source' or 'mix'

  // Loaders
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Initial Load (Keep New Version Logic)
  useEffect(() => {
    dispatch(clearMaterialRequest());
    if (taskId && loggedInUser?.projectId) {
      dispatch(
        getMaterialRequest({
          projectId: loggedInUser.projectId,
          id: taskId?._id,
        }),
      );
    }
  }, [dispatch, taskId, loggedInUser?.projectId]);

  // 2. Handle Submission Response
  useEffect(() => {
    if (postMeterialRequestFormData) {
      setIsSubmitting(false);
      showSnackbar('Material Consumption updated successfully', 'success');
      dispatch(clearMaterialRequest());
      dispatch(
        getMaterialRequest({
          projectId: loggedInUser?.projectId,
          id: taskId?._id,
        }),
      );
    } else if (error) {
      setIsSubmitting(false);
      showSnackbar(error, 'error');
    }
  }, [postMeterialRequestFormData, error]);

  // 3. Listen for Source/Mix API Responses and update options list
  useEffect(() => {
    console.log('sourceApprovalsByStatus', sourceByStatusData);
    if (sourceDropdownVisible) {
      if (currentSourceType === 'source' && sourceByStatusData) {
        console.log('sourceApprovalsByStatus:', sourceByStatusData);
        setCurrentSourceOptions(sourceByStatusData);
      } else if (currentSourceType === 'mix' && qualityMixDesignListInfo) {
        setCurrentSourceOptions(qualityMixDesignListInfo);
      }
    }
  }, [
    sourceByStatusData,
    qualityMixDesignListInfo,
    currentSourceType,
    sourceDropdownVisible,
  ]);

  const dataSource = getMeterialRequestFormData;

  // 4. Transform Data (Keep New Version Logic)
  useEffect(() => {
    if (dataSource?.requestGroups?.length) {
      const flattenedRequests: any[] = [];
      let requestCounter = 1;

      dataSource.requestGroups.forEach((group: any) => {
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

              selectedCategories: [], // Will hold quantity + source info
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
  }, [dataSource]);

  // --- UI Interactions ---

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
                  // New fields for Source/Mix
                  sourceId: null,
                  sourceName: '',
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

  // --- Dropdown Logic ---

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

  // --- NEW: Source / Mix Design Logic (From Old Version) ---

  const openSourceDropdown = (request: any, categoryItem: any) => {
    setCurrentRequestId(request.id);
    setCurrentCategoryId(categoryItem.id);
    setCurrentSourceOptions([]); // Clear previous options

    // Determine type
    const isProduction = request.requestTo === 'production';
    const type = isProduction ? 'mix' : 'source';
    setCurrentSourceType(type);

    // FETCH ON CLICK (Lazy Loading)
    if (isProduction) {
      // Fetch Mix Design
      dispatch(
        getMixDesignListInfo({
          projectId: loggedInUser.projectId,
          testWorkCategoryType: request.testWorkCategoryType,
          testMaterialId: request.testMaterialId,
        }),
      );
    } else {
      // Fetch Procurement Source
      dispatch(
        getSourceApprovalsByStatus({
          projectId: loggedInUser.projectId,
          testMaterialId: request.testMaterialId,
          status: SOURCE_APPROVAL_STATUS.APPROVED,
        }),
      );
    }

    setSourceDropdownVisible(true);
  };

  const handleSelectSource = (item: any) => {
    // Map based on type (Old version logic normalization)
    const id = item.id || item._id || item.sourceApprovalId || item.mixDesignId;
    const name = item.name || item.sourceName || item.mixDesignName;

    updateCategory(currentRequestId, currentCategoryId, 'sourceId', id);
    updateCategory(currentRequestId, currentCategoryId, 'sourceName', name);
    setSourceDropdownVisible(false);
  };

  // ---------------------------------------------------------

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

  // --- Submission Logic (Merged) ---
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

      // Filter valid entries (must have category, qty AND source/mix)
      const validCategories = request.selectedCategories
        .filter((c: any) => c.category && c.quantity && c.sourceId) // Added sourceId check
        .map((c: any) => {
          // Construct the inner object based on Old Version structure
          const baseObj = {
            qty: Number(c.quantity),
          };

          // Determine if we attach 'source' or 'mixDesign' key
          let sourceOrMixObj;
          if (request.requestTo === 'production') {
            sourceOrMixObj = {
              mixDesign: [
                {
                  ...baseObj,
                  mixDesignId: c.sourceId,
                  mixDesignName: c.sourceName,
                },
              ],
            };
          } else {
            sourceOrMixObj = {
              source: [
                {
                  ...baseObj,
                  sourceApprovalId: c.sourceId,
                  sourceName: c.sourceName,
                },
              ],
            };
          }

          return {
            category: c.category,
            // Spread the source/mix array into the category object
            ...sourceOrMixObj,
          };
        });

      if (validCategories.length === 0) return;

      if (request.requestTo === 'production') {
        // Production Logic
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
        // Procurement Logic
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

        // Find if materialType already exists to group categories
        let matType = group.materialTypes.find(
          (m: any) => m.testMaterialId === request.testMaterialId,
        );
        if (!matType) {
          matType = {
            testMaterialId: request.testMaterialId,
            type: request.materialType,
            materialCategory: [],
          };
          group.materialTypes.push(matType);
        }

        // Push the formatted categories
        matType.materialCategory.push(...validCategories);
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
      Alert.alert(
        'Incomplete Data',
        'Please ensure Category, Quantity, and Source/Mix are selected.',
      );
      return;
    }

    const payload = {
      rfiId: dataSource?.rfiId || rfiId,
      isMaterialRequested: false,
      comments: 'Material consumption submitted/updated.',
      materialRequests: finalPayloadRequests,
    };

    console.log('Final Payload:', JSON.stringify(payload, null, 2));

    setIsSubmitting(true);
    dispatch(
      submitMaterialRequest({
        projectId: loggedInUser?.projectId,
        body: payload,
      }),
    );
  };

  if (!dataSource) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
        <Text style={styles.loadingText}>Loading material data...</Text>
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
          Update consumption for Procurement or Production.
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
                {/* Information Header */}
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

                      {/* ROW 1: Category & Quantity */}
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

                      {/* ROW 2: Source/Mix Design Selection (NEW) */}
                      <View style={{marginTop: 10}}>
                        <Text style={styles.inputLabel}>
                          {request.requestTo === 'production'
                            ? 'Mix Design'
                            : 'Source'}
                        </Text>
                        <TouchableOpacity
                          style={styles.dropdownButton}
                          onPress={() => openSourceDropdown(request, category)}>
                          <Text
                            style={[
                              styles.dropdownButtonText,
                              !category.sourceName && styles.placeholderText,
                            ]}
                            numberOfLines={1}>
                            {category.sourceName ||
                              (request.requestTo === 'production'
                                ? 'Select Mix Design'
                                : 'Select Source')}
                          </Text>
                          <Text>▼</Text>
                        </TouchableOpacity>
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

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Update Consumption</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

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
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectPlant(item)}>
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL 3: Source / Mix Design Selection (New) */}
      <Modal
        transparent
        visible={sourceDropdownVisible}
        animationType="fade"
        onRequestClose={() => setSourceDropdownVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setSourceDropdownVisible(false)}>
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>
                Select {currentSourceType === 'mix' ? 'Mix Design' : 'Source'}
              </Text>
              <TouchableOpacity onPress={() => setSourceDropdownVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {(currentSourceType === 'source' ? sourceLoading : mixLoading) ? (
              <View style={{padding: 20}}>
                <ActivityIndicator size="small" color="#6B46C1" />
                <Text
                  style={{textAlign: 'center', marginTop: 10, color: '#666'}}>
                  Fetching options...
                </Text>
              </View>
            ) : (
              <FlatList
                data={currentSourceOptions}
                keyExtractor={item =>
                  (
                    item.id ||
                    item._id ||
                    item.sourceApprovalId ||
                    item.mixDesignId ||
                    Math.random()
                  ).toString()
                }
                ListEmptyComponent={
                  <Text style={{padding: 20, textAlign: 'center'}}>
                    No options available
                  </Text>
                }
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSelectSource(item)}>
                    <Text style={styles.dropdownItemText}>
                      {item.name || item.sourceName || item.mixDesignName}
                    </Text>
                  </TouchableOpacity>
                )}
                style={styles.dropdownList}
              />
            )}
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
    flex: 1,
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
});

export default MaterialConsumptionForm;
