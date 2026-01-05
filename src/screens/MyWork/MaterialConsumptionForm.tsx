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
  getMaterialRequestByRfi,
  getSourceApprovalsByStatus,
  submitMaterialRequest,
} from '../ManageUsers/actions';
import {getMixDesignListInfo} from '../RFIs/actions';
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
  const {
    getMeterialRequestFormData,
    getMeterialRequestByRfiData,
    postMeterialRequestFormData,
    loading,
    error,
  } = useSelector((state: any) => state.MeterialRequest);

  useEffect(() => {
    if (getMeterialRequestFormData) {
      console.log(
        'Form Structure:',
        JSON.stringify(getMeterialRequestFormData),
      );
    }
    if (getMeterialRequestByRfiData) {
      console.log('Saved Data:', JSON.stringify(getMeterialRequestByRfiData));
    }
  }, [getMeterialRequestFormData, getMeterialRequestByRfiData]);

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
  const [sourceDropdownVisible, setSourceDropdownVisible] = useState(false);

  // Context for current selection
  const [currentRequestId, setCurrentRequestId] = useState<any>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<any>(null);
  const [currentSourceRowId, setCurrentSourceRowId] = useState<any>(null);
  const [currentRequestForPlant, setCurrentRequestForPlant] =
    useState<any>(null);

  const [currentSourceOptions, setCurrentSourceOptions] = useState<any[]>([]);
  const [currentSourceType, setCurrentSourceType] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Initial Load
  useEffect(() => {
    dispatch(clearMaterialRequest());
    if (rfiId && loggedInUser?.projectId) {
      dispatch(
        getMaterialRequestByRfi({
          projectId: loggedInUser.projectId,
          id: rfiId,
        }),
      );
    }
    if (taskId && loggedInUser?.projectId) {
      dispatch(
        getMaterialRequest({
          projectId: loggedInUser.projectId,
          id: taskId?._id,
        }),
      );
    }
  }, [dispatch, taskId, rfiId, loggedInUser?.projectId]);

  // 2. Handle Submission Response
  useEffect(() => {
    if (postMeterialRequestFormData) {
      setIsSubmitting(false);
      showSnackbar('Material Consumption updated successfully', 'success');
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }
      dispatch(clearMaterialRequest());
      dispatch(
        getMaterialRequest({
          projectId: loggedInUser?.projectId,
          id: taskId?._id,
        }),
      );
      dispatch(
        getMaterialRequestByRfi({
          projectId: loggedInUser.projectId,
          id: rfiId,
        }),
      );
    } else if (error) {
      setIsSubmitting(false);
      showSnackbar(error, 'error');
    }
  }, [postMeterialRequestFormData, error, onSubmissionSuccess]);

  // 3. Listen for Source/Mix API Responses
  useEffect(() => {
    if (sourceDropdownVisible) {
      if (currentSourceType === 'source' && sourceByStatusData) {
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
  const savedData = getMeterialRequestByRfiData;

  // 4. Transform Data & Merge with Saved Data
  useEffect(() => {
    if (dataSource?.requestGroups?.length) {
      const flattenedRequests: any[] = [];
      let requestCounter = 1;

      // Helper to find saved items for a specific material ID
      const findSavedItems = (
        targetMaterialId: string,
        requestType: string,
      ) => {
        if (!savedData?.materialRequests) return [];

        // Find parent request group (production vs procurement) logic could go here
        // For now, flattening all items from all groups to find match
        const allSavedItems = savedData.materialRequests.flatMap((mr: any) => {
          // Attach the parent equipment info to the item for mapping
          return (mr.items || []).map((item: any) => ({
            ...item,
            parentEquipmentId: mr.testEquipmentId,
          }));
        });

        return allSavedItems.filter((item: any) => {
          const savedId = item.testMaterialId?._id || item.testMaterialId;
          return savedId === targetMaterialId;
        });
      };

      dataSource.requestGroups.forEach((group: any) => {
        const requestType = group.requestTo;

        group.materialRequests.forEach((workCategory: any) => {
          workCategory.materials.forEach((material: any) => {
            // --- Logic to Populate Pre-Saved Data ---
            const savedItems = findSavedItems(
              material.testMaterialId,
              requestType,
            );

            let prefilledCategories: any[] = [];
            let prefilledPlantId = null;
            let prefilledPlantName = '';

            if (savedItems.length > 0) {
              // Group items by category (e.g., "13.0 mm")
              savedItems.forEach((item: any) => {
                // If production, try to grab the plant from the saved parent
                if (requestType === 'production' && item.parentEquipmentId) {
                  prefilledPlantId = item.parentEquipmentId._id;
                  prefilledPlantName = item.parentEquipmentId.name;
                }

                // Determine sources array based on type
                const sourcesRaw =
                  item.source && item.source.length > 0
                    ? item.source
                    : item.mixDesign || [];

                // Map sources
                const mappedSources = sourcesRaw.map((s: any) => ({
                  id: Date.now() + Math.random(),
                  sourceId: s.sourceApprovalId || s.mixDesignId || s._id,
                  sourceName: s.sourceName || s.mixDesignName || s.name,
                  // If quantity is inside source object use it, else fallback to item quantity
                  quantity: (s.qty || item.qty_consumed || '').toString(),
                  isPrefilled: true, // <--- LOCKING FLAG
                }));

                const catName =
                  item.testMaterialCategory || item.testMaterialCategoryName;

                // We create a new block for every item found to be safe
                prefilledCategories.push({
                  id: Date.now() + Math.random(),
                  category: catName,
                  unit: material.unit,
                  sources: mappedSources,
                  isPrefilled: true, // <--- LOCKING FLAG FOR CATEGORY
                });
              });
            }

            flattenedRequests.push({
              id: requestCounter,
              uniqueKey: `${requestCounter}-${material.testMaterialId}`,
              expanded: savedItems.length > 0, // Auto expand if data exists
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

              // Set the prefilled data
              selectedCategories: prefilledCategories,
              selectedPlantId: prefilledPlantId,
              selectedPlantName: prefilledPlantName,
              comments: savedData?.comments || '',
            });
            requestCounter++;
          });
        });
      });
      setMaterialRequests(flattenedRequests);
    }
  }, [dataSource, savedData]);

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

  // --- HIERARCHY LOGIC: CATEGORY -> SOURCES ---

  // 1. Add a Category Card (Parent)
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
                  unit: request.unit,
                  sources: [],
                  isPrefilled: false,
                },
              ],
            }
          : request,
      ),
    );
  };

  // 2. Add a Source Row inside a Category
  const addSourceToCategory = (requestId: any, categoryId: any) => {
    setMaterialRequests(prev =>
      prev.map(request => {
        if (request.id !== requestId) return request;

        const updatedCategories = request.selectedCategories.map((cat: any) => {
          if (cat.id !== categoryId) return cat;

          return {
            ...cat,
            sources: [
              ...cat.sources,
              {
                id: Date.now(),
                sourceId: null,
                sourceName: '',
                quantity: '',
                isPrefilled: false,
              },
            ],
          };
        });

        return {...request, selectedCategories: updatedCategories};
      }),
    );
  };

  // 3. Remove a specific source row
  const removeSource = (requestId: any, categoryId: any, sourceRowId: any) => {
    setMaterialRequests(prev =>
      prev.map(request => {
        if (request.id !== requestId) return request;
        return {
          ...request,
          selectedCategories: request.selectedCategories.map((cat: any) => {
            if (cat.id !== categoryId) return cat;
            return {
              ...cat,
              sources: cat.sources.filter((s: any) => s.id !== sourceRowId),
            };
          }),
        };
      }),
    );
  };

  // 4. Update data inside a source row (Qty, Name, etc)
  const updateSourceRow = (
    requestId: any,
    categoryId: any,
    sourceRowId: any,
    field: any,
    value: any,
  ) => {
    setMaterialRequests(prev =>
      prev.map(request => {
        if (request.id !== requestId) return request;
        return {
          ...request,
          selectedCategories: request.selectedCategories.map((cat: any) => {
            if (cat.id !== categoryId) return cat;
            return {
              ...cat,
              sources: cat.sources.map((s: any) =>
                s.id === sourceRowId ? {...s, [field]: value} : s,
              ),
            };
          }),
        };
      }),
    );
  };

  // 5. Update Category Info
  const updateCategoryInfo = (
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
    updateCategoryInfo(
      currentRequestId,
      currentCategoryId,
      'category',
      selectedCategory.category,
    );
    updateCategoryInfo(
      currentRequestId,
      currentCategoryId,
      'unit',
      selectedCategory.unit,
    );

    // Auto-add first source row if empty
    const request = materialRequests.find(r => r.id === currentRequestId);
    const category = request?.selectedCategories.find(
      (c: any) => c.id === currentCategoryId,
    );
    if (category && category.sources.length === 0) {
      addSourceToCategory(currentRequestId, currentCategoryId);
    }

    setCategoryDropdownVisible(false);
  };

  const openPlantDropdown = (request: any) => {
    if (request.selectedCategories.some((cat: any) => cat.isPrefilled)) {
      Alert.alert(
        'Action not allowed',
        'Plant cannot be changed for saved requests.',
      );
      return;
    }
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

  const openSourceDropdown = (
    request: any,
    categoryId: any,
    sourceRowId: any,
  ) => {
    setCurrentRequestId(request.id);
    setCurrentCategoryId(categoryId);
    setCurrentSourceRowId(sourceRowId);
    setCurrentSourceOptions([]);

    const isProduction = request.requestTo === 'production';
    const type = isProduction ? 'mix' : 'source';
    setCurrentSourceType(type);

    if (isProduction) {
      dispatch(
        getMixDesignListInfo({
          projectId: loggedInUser.projectId,
          testWorkCategoryType: request.testWorkCategoryType,
          testMaterialId: request.testMaterialId,
        }),
      );
    } else {
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
    const id = item.id || item._id || item.sourceApprovalId || item.mixDesignId;
    const name = item.name || item.sourceName || item.mixDesignName;

    updateSourceRow(
      currentRequestId,
      currentCategoryId,
      currentSourceRowId,
      'sourceId',
      id,
    );
    updateSourceRow(
      currentRequestId,
      currentCategoryId,
      currentSourceRowId,
      'sourceName',
      name,
    );
    setSourceDropdownVisible(false);
  };

  // --- FILTERED CATEGORY LOGIC ---
  const getAvailableCategories = (requestId: any) => {
    const request = materialRequests.find(r => r.id === requestId);
    if (!request) return [];

    const selectedNames = request.selectedCategories
      .map((sc: any) => sc.category)
      .filter((name: any) => name);

    return request.availableCategories.filter(
      (cat: any) => !selectedNames.includes(cat.category),
    );
  };

  // --- FILTERED SOURCE LOGIC ---
  const getAvailableSources = () => {
    if (!currentRequestId || !currentCategoryId) return currentSourceOptions;

    // Find current request
    const request = materialRequests.find(r => r.id === currentRequestId);
    if (!request) return currentSourceOptions;

    // Find current category block
    const categoryBlock = request.selectedCategories.find(
      (c: any) => c.id === currentCategoryId,
    );
    if (!categoryBlock) return currentSourceOptions;

    // Get list of IDs already selected in this category block
    const selectedSourceIds = categoryBlock.sources
      .map((s: any) => s.sourceId)
      .filter((id: any) => id); // filter out empty/nulls

    // Filter the master list options
    return currentSourceOptions.filter(option => {
      const optionId =
        option.id ||
        option._id ||
        option.sourceApprovalId ||
        option.mixDesignId;
      return !selectedSourceIds.includes(optionId);
    });
  };

  // --- SUBMISSION LOGIC ---
  const handleSubmit = () => {
    // 1. Validation
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

      const validCategories: any[] = [];

      request.selectedCategories.forEach((catBlock: any) => {
        if (!catBlock.category || catBlock.sources.length === 0) return;

        const validSources = catBlock.sources
          .filter(
            (s: any) => s.sourceId && s.quantity && Number(s.quantity) > 0,
          )
          .map((s: any) => ({
            qty: Number(s.quantity),
            ...(request.requestTo === 'production'
              ? {
                  mixDesignId: s.sourceId,
                  mixDesignName: s.sourceName,
                }
              : {
                  sourceApprovalId: s.sourceId,
                  sourceName: s.sourceName,
                }),
          }));

        if (validSources.length > 0) {
          validCategories.push({
            category: catBlock.category,
            [request.requestTo === 'production' ? 'mixDesign' : 'source']:
              validSources,
          });
        }
      });

      if (validCategories.length === 0) return;

      if (request.requestTo === 'production') {
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
                  materialCategory: validCategories,
                },
              ],
            },
          ],
        };
        finalPayloadRequests.push(productionRequest);
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

    const comments = materialRequests
      .map(request => request.comments)
      .filter(Boolean)
      .join('; ');

    const payload = {
      rfiId: dataSource?.rfiId || rfiId,
      isMaterialRequested: false,
      comments: comments,
      materialRequests: finalPayloadRequests,
    };

    console.log('Final Nested Payload:', JSON.stringify(payload, null, 2));

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
                  <Text style={styles.wcName}>
                    {request.testWorkCategoryName}
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
                      style={[
                        styles.dropdownButton,
                        request.selectedPlantId && savedData
                          ? {backgroundColor: '#f0f0f0'}
                          : {},
                      ]}
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

                {/* --- CATEGORY BLOCKS --- */}
                {request.selectedCategories.map(
                  (catBlock: any, index: number) => (
                    <View key={catBlock.id} style={styles.categorySection}>
                      <View style={styles.categorySectionHeader}>
                        <Text style={styles.categorySectionTitle}>
                          Category {index + 1}
                        </Text>

                        {/* Only show delete if NOT prefilled */}
                        {!catBlock.isPrefilled && (
                          <TouchableOpacity
                            onPress={() =>
                              removeCategory(request.id, catBlock.id)
                            }
                            style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>✕</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* LEVEL 1: Select Category */}
                      <View style={styles.categorySelectRow}>
                        <Text style={styles.inputLabel}>Material Category</Text>
                        <TouchableOpacity
                          style={[
                            styles.categoryDropdown,
                            catBlock.isPrefilled && {opacity: 0.7},
                          ]}
                          disabled={catBlock.isPrefilled}
                          onPress={() =>
                            openCategoryDropdown(request.id, catBlock.id)
                          }>
                          <View
                            style={[
                              styles.dropdown,
                              catBlock.isPrefilled && {
                                backgroundColor: '#f0f0f0',
                                borderColor: '#ddd',
                              },
                            ]}>
                            <Text
                              style={[
                                styles.dropdownText,
                                catBlock.category
                                  ? styles.dropdownTextSelected
                                  : {},
                              ]}>
                              {catBlock.category || 'Select Category'}
                            </Text>
                            {!catBlock.isPrefilled && (
                              <Text style={styles.dropdownArrow}>▼</Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>

                      {/* LEVEL 2: Sources List */}
                      {catBlock.category ? (
                        <View style={styles.sourcesContainer}>
                          <Text style={styles.sourcesHeaderLabel}>
                            Sources & Quantities
                          </Text>

                          {catBlock.sources.map(
                            (source: any, sIndex: number) => (
                              <View key={source.id} style={styles.sourceRow}>
                                <View style={{flex: 1}}>
                                  {/* Source Selector */}
                                  <TouchableOpacity
                                    style={[
                                      styles.smallDropdown,
                                      source.isPrefilled && {
                                        backgroundColor: '#f0f0f0',
                                        borderColor: '#ddd',
                                      },
                                    ]}
                                    disabled={source.isPrefilled} // LOCK SOURCE
                                    onPress={() =>
                                      openSourceDropdown(
                                        request,
                                        catBlock.id,
                                        source.id,
                                      )
                                    }>
                                    <Text
                                      style={[
                                        styles.smallDropdownText,
                                        !source.sourceName &&
                                          styles.placeholderText,
                                      ]}
                                      numberOfLines={1}>
                                      {source.sourceName ||
                                        (request.requestTo === 'production'
                                          ? 'Select Mix'
                                          : 'Select Source')}
                                    </Text>
                                    {!source.isPrefilled && (
                                      <Text style={{fontSize: 10}}>▼</Text>
                                    )}
                                  </TouchableOpacity>
                                </View>

                                {/* Quantity Input - ALWAYS EDITABLE */}
                                <View style={styles.qtyContainer}>
                                  <TextInput
                                    style={styles.smallInput}
                                    value={source.quantity}
                                    onChangeText={text =>
                                      updateSourceRow(
                                        request.id,
                                        catBlock.id,
                                        source.id,
                                        'quantity',
                                        text,
                                      )
                                    }
                                    placeholder="Qty"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                  />
                                  <Text style={styles.unitSmall}>
                                    {catBlock.unit}
                                  </Text>
                                </View>

                                {/* Remove Source Button - Hidden if Prefilled */}
                                {!source.isPrefilled && (
                                  <TouchableOpacity
                                    style={styles.removeSourceBtn}
                                    onPress={() =>
                                      removeSource(
                                        request.id,
                                        catBlock.id,
                                        source.id,
                                      )
                                    }>
                                    <Text style={styles.removeSourceText}>
                                      −
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            ),
                          )}

                          <TouchableOpacity
                            style={styles.addSourceButton}
                            onPress={() =>
                              addSourceToCategory(request.id, catBlock.id)
                            }>
                            <Text style={styles.addSourceText}>
                              + Add Source
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  ),
                )}

                {/* Show "Add Category" button only if there are available categories left */}
                {getAvailableCategories(request.id).length > 0 && (
                  <TouchableOpacity
                    style={styles.addMoreButton}
                    onPress={() => addCategory(request.id)}>
                    <Text style={styles.addMoreText}>+ Add Category Block</Text>
                  </TouchableOpacity>
                )}

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
              ListEmptyComponent={
                <Text style={{padding: 20, textAlign: 'center'}}>
                  No Categories Available
                </Text>
              }
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

      {/* MODAL 3: Source / Mix Design Selection */}
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
                data={getAvailableSources()} // Use the filtered list here
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
                    {item.approxQty && (
                      <Text style={{fontSize: 11, color: '#888'}}>
                        Stock: {item.approxQty}
                      </Text>
                    )}
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
  wcName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
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

  // --- Category Block Styles ---
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  categorySectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6B46C1',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#ff4d4f',
  },
  categorySelectRow: {
    marginBottom: 15,
  },
  categoryDropdown: {
    width: '100%',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d1d1',
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

  // --- Source List Styles ---
  sourcesContainer: {
    marginTop: 5,
    paddingLeft: 4,
  },
  sourcesHeaderLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  smallDropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallDropdownText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  smallInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 2,
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  unitSmall: {
    fontSize: 10,
    color: '#888',
    marginLeft: 2,
  },
  removeSourceBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffebee',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  removeSourceText: {
    color: '#d32f2f',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  addSourceButton: {
    alignSelf: 'flex-start',
    marginTop: 5,
    marginBottom: 5,
  },
  addSourceText: {
    color: '#6B46C1',
    fontSize: 13,
    fontWeight: '600',
  },

  // General Buttons
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
