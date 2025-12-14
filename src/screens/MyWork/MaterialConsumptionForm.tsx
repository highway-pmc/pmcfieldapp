import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useSnackbar} from '../../context/SnackbarContext';
import {
  getSourceApprovals,
  submitMaterialRequest,
} from '../ManageUsers/actions';
import {getMixDesignListInfo} from '../RFIs/actions';

// Helper to safely get nested data
const getNestedData = (
  data: any,
  path: any[],
  defaultValue: any = undefined,
): any => {
  let current = data;
  for (const key of path) {
    if (
      current === null ||
      current === undefined ||
      (Array.isArray(current) && key >= current.length)
    ) {
      return defaultValue;
    }
    current = current[key];
  }
  return current;
};

const MaterialConsumptionForm = ({
  materialData,
  rfiId,
  onSubmissionSuccess,
}: any) => {
  //console.log('🔍 Material Data Received:', JSON.stringify(materialData));

  const prepareMaterialConsumption: any[] = materialData?.requestGroups || [];

  // State definitions
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedSource, setSelectedSource] = useState<Record<string, any>>({});
  const [selectedMixDesign, setSelectedMixDesign] = useState<
    Record<string, any>
  >({});
  const [sourceEntries, setSourceEntries] = useState<Record<string, number[]>>(
    {},
  );
  const [prefilledEntries, setPrefilledEntries] = useState<
    Record<string, boolean>
  >({});
  const [sourceOptionsByMaterial, setSourceOptionsByMaterial] = useState<
    Record<string, any[]>
  >({});
  const [mixDesignOptions, setMixDesignOptions] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentDropdown, setCurrentDropdown] = useState<any>(null);
  const [dropdownOptions, setDropdownOptions] = useState<any[]>([]);

  // ADD: Track if data has been prefilled to prevent re-prefilling
  const [isDataPrefilled, setIsDataPrefilled] = useState(false);

  const dispatch = useDispatch<any>();
  const {showSnackbar} = useSnackbar();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const sourceApprovalsData = useSelector(
    (state: any) => state.sourceApprovals,
  );
  const {
    postMeterialRequestFormData,
    loading: submitLoading,
    error,
  } = useSelector((state: any) => state.MeterialRequest);

  const {loading: apiLoading, qualityMixDesignListInfo} = useSelector(
    (state: any) => state.RFIs,
  );

  // FIXED: Add cleanup and prevent infinite loop
  useEffect(() => {
    if (postMeterialRequestFormData) {
      showSnackbar('Material status updated successfully', 'success');
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }
      // Clear the response to prevent re-triggering
      // You should add a clear action to your Redux
      // dispatch(clearMaterialRequestResponse());
    } else if (error) {
      showSnackbar(error, 'error');

      // Clear the error to prevent re-triggering
      // dispatch(clearMaterialRequestError());
    }
  }, [postMeterialRequestFormData, error]);

  // Fetch Source data for a specific testMaterialId
  const fetchSourceOptionsForMaterial = useCallback(
    (testMaterialId: any) => {
      console.log('Fetching sources for Material ID:', testMaterialId);
      dispatch(
        getSourceApprovals({
          projectId: loggedInUser.projectId,
          testMaterialId: testMaterialId,
        }),
      );
    },
    [dispatch, loggedInUser.projectId],
  );

  // Fetch Mix Design data from API
  const fetchMixDesignOptions = useCallback(() => {
    const testWorkCategoryType = getNestedData(prepareMaterialConsumption, [
      0,
      'materialRequests',
      0,
      'testWorkCategoryType',
    ]);
    const testMaterialId = getNestedData(prepareMaterialConsumption, [
      0,
      'materialRequests',
      0,
      'materials',
      0,
      'testMaterialId',
    ]);

    if (testWorkCategoryType && testMaterialId) {
      dispatch(
        getMixDesignListInfo({
          projectId: loggedInUser.projectId,
          testWorkCategoryType: testWorkCategoryType,
          testMaterialId: testMaterialId,
        }),
      );
    }
  }, [dispatch, loggedInUser.projectId, prepareMaterialConsumption]);

  // Update source options when API data arrives
  useEffect(() => {
    if (
      sourceApprovalsData &&
      Array.isArray(sourceApprovalsData) &&
      sourceApprovalsData.length > 0
    ) {
      const materialIdFromFirstSource = sourceApprovalsData[0]?.testMaterialId;
      if (materialIdFromFirstSource) {
        setSourceOptionsByMaterial(prev => ({
          ...prev,
          [materialIdFromFirstSource]: sourceApprovalsData,
        }));
      }
    }
  }, [sourceApprovalsData]);

  // Update mix design options when API data arrives
  useEffect(() => {
    if (
      qualityMixDesignListInfo &&
      Array.isArray(qualityMixDesignListInfo) &&
      qualityMixDesignListInfo.length > 0
    ) {
      setMixDesignOptions(qualityMixDesignListInfo);
    }
  }, [qualityMixDesignListInfo]);

  // FIXED: Fetch sources and mix designs on mount only
  useEffect(() => {
    if (prepareMaterialConsumption.length > 0) {
      const uniqueMaterialIds = new Set<any>();

      prepareMaterialConsumption.forEach((item: any) => {
        item.materialRequests?.forEach((request: any) => {
          request.materials?.forEach((material: any) => {
            if (material.testMaterialId) {
              uniqueMaterialIds.add(material.testMaterialId);
            }
          });
        });
      });

      uniqueMaterialIds.forEach(testMaterialId => {
        fetchSourceOptionsForMaterial(testMaterialId);
      });

      fetchMixDesignOptions();
    }
  }, []); // CHANGED: Empty dependency array - only run on mount

  // FIXED: Prefill Data Logic - only run once when data is available
  useEffect(() => {
    // Only prefill if we haven't already and data is available
    if (isDataPrefilled || prepareMaterialConsumption.length === 0) {
      return;
    }

    const newFormData: Record<string, string> = {};
    const newSelectedSource: Record<string, any> = {};
    const newSelectedMixDesign: Record<string, any> = {};
    const newSourceEntries: Record<string, number[]> = {};
    const newPrefilledEntries: Record<string, boolean> = {};

    prepareMaterialConsumption.forEach((item: any) => {
      item.materialRequests?.forEach((request: any) => {
        request.materials?.forEach((material: any) => {
          material.materialRequests?.forEach((req: any) => {
            const baseKey = `${item.requestTo}-${material.testMaterialId}-${req.category}`;

            const prefillArray =
              item.requestTo === 'procurement-details'
                ? req.source
                : req.mixDesign;

            if (
              prefillArray &&
              Array.isArray(prefillArray) &&
              prefillArray.length > 0
            ) {
              const entries: number[] = prefillArray.map(
                (_: any, idx: number) => idx,
              );
              newSourceEntries[baseKey] = entries;

              prefillArray.forEach((entryItem: any, idx: number) => {
                const key = `${baseKey}-${idx}`;
                newPrefilledEntries[key] = true;

                if (entryItem.qty) {
                  newFormData[key] = entryItem.qty.toString();
                }

                if (item.requestTo === 'procurement-details') {
                  if (entryItem.sourceName && entryItem.sourceApprovalId) {
                    newSelectedSource[key] = {
                      id: entryItem.sourceApprovalId,
                      name: entryItem.sourceName,
                    };
                  }
                } else if (item.requestTo === 'production') {
                  if (entryItem.mixDesignName && entryItem.mixDesignId) {
                    newSelectedMixDesign[key] = {
                      id: entryItem.mixDesignId,
                      name: entryItem.mixDesignName,
                    };
                  }
                }
              });
            } else {
              newSourceEntries[baseKey] = [0];
            }
          });
        });
      });
    });

    // Update all states with prefilled data
    setFormData(newFormData);
    setSelectedSource(newSelectedSource);
    setSelectedMixDesign(newSelectedMixDesign);
    setSourceEntries(newSourceEntries);
    setPrefilledEntries(newPrefilledEntries);

    // Mark as prefilled
    setIsDataPrefilled(true);
  }, [prepareMaterialConsumption, isDataPrefilled]);

  // Get source options for a specific testMaterialId
  const getSourceOptionsForMaterial = (testMaterialId: any): any[] => {
    return sourceOptionsByMaterial[testMaterialId];
  };

  /**
   * CORE LOGIC IMPLEMENTATION for preventing duplicate selection.
   * Filters out sources already selected in other entries of the same category.
   */
  const getFilteredSourceOptions = (
    currentKey: string,
    baseKey: string,
    testMaterialId: any,
  ): any[] => {
    const entries = sourceEntries[baseKey] || [];
    const selectedSourceIds: any[] = entries
      .map(entryIndex => {
        const key = `${baseKey}-${entryIndex}`;
        const source = selectedSource[key];

        // Use the ID of the source in the current entry ONLY if it's NOT the entry being edited (`key !== currentKey`).
        const id = source?.id || source?._id || source?.sourceApprovalId;
        return key !== currentKey ? id : null;
      })
      .filter((id: any) => id !== null && id !== undefined);

    const sourceOptions = getSourceOptionsForMaterial(testMaterialId);
    if (!sourceOptions) {
      return [];
    }
    return sourceOptions.filter((option: any) => {
      const optionId = option.id || option._id || option.sourceApprovalId;
      // Exclude sources whose ID is already present in another entry in this category.
      return !selectedSourceIds.includes(optionId);
    });
  };

  /**
   * CORE LOGIC IMPLEMENTATION for preventing duplicate selection.
   * Filters out mix designs already selected in other entries of the same category.
   */
  const getFilteredMixDesignOptions = (
    currentKey: string,
    baseKey: string,
  ): any[] => {
    const entries = sourceEntries[baseKey] || [];
    const selectedMixDesignIds: any[] = entries
      .map(entryIndex => {
        const key = `${baseKey}-${entryIndex}`;
        const mixDesign = selectedMixDesign[key];

        // Use the ID of the mix design in the current entry ONLY if it's NOT the entry being edited (`key !== currentKey`).
        const id = mixDesign?.id || mixDesign?._id || mixDesign?.mixDesignId;
        return key !== currentKey ? id : null;
      })
      .filter((id: any) => id !== null && id !== undefined);

    // Assuming mixDesignOptions are comprehensive
    return (mixDesignOptions || []).filter((option: any) => {
      const optionId = option.id || option._id || option.mixDesignId;
      // Exclude mix designs whose ID is already present in another entry in this category.
      return !selectedMixDesignIds.includes(optionId);
    });
  };

  const openDropdown = (type: string, key: string, testMaterialId: any) => {
    setCurrentDropdown({type, key, testMaterialId});

    // Extract baseKey from the current key (remove the entry index)
    const baseKey = key.substring(0, key.lastIndexOf('-'));
    let filteredOptions: any[] = [];

    if (type === 'source') {
      filteredOptions = getFilteredSourceOptions(key, baseKey, testMaterialId);
    } else {
      filteredOptions = getFilteredMixDesignOptions(key, baseKey);
    }

    setDropdownOptions(filteredOptions);
    setModalVisible(true);
  };

  const selectDropdownItem = (item: any) => {
    if (currentDropdown.type === 'source') {
      setSelectedSource(prev => ({
        ...prev,
        [currentDropdown.key]: {
          id: item.id || item._id || item.sourceApprovalId,
          name: item.name || item.sourceName,
        },
      }));
    } else {
      setSelectedMixDesign(prev => ({
        ...prev,
        [currentDropdown.key]: {
          id: item.id || item._id || item.mixDesignId,
          name: item.name || item.mixDesignName,
        },
      }));
    }
    setModalVisible(false);
  };

  const handleQuantityChange = (
    requestTo: string,
    materialId: any,
    category: string,
    value: string,
    entryIndex: number = 0,
  ) => {
    // Only allow numeric input (integers or decimals)
    const numericValue = value.replace(/[^0-9.]/g, '');

    setFormData(prev => ({
      ...prev,
      [`${requestTo}-${materialId}-${category}-${entryIndex}`]: numericValue,
    }));
  };

  const handleAddMore = (
    requestTo: string,
    materialId: any,
    category: string,
    testMaterialId: any,
  ) => {
    const key = `${requestTo}-${materialId}-${category}`;
    const currentEntries = sourceEntries[key] || [0];

    // Check if there are available options left based on request type
    let availableOptions: any[] | undefined;
    // When adding a new entry, pass an empty string for currentKey so ALL currently selected items are excluded.
    const tempKeyForFilter = '';

    if (requestTo === 'procurement-details') {
      availableOptions = getFilteredSourceOptions(
        tempKeyForFilter,
        key,
        testMaterialId,
      );
    } else if (requestTo === 'production') {
      availableOptions = getFilteredMixDesignOptions(tempKeyForFilter, key);
    }

    if (availableOptions && availableOptions.length === 0) {
      const optionType =
        requestTo === 'procurement-details' ? 'sources' : 'mix designs';
      Alert.alert(
        'No Options Available',
        `All unique ${optionType} have been selected. Cannot add more entries.`,
      );
      return;
    }

    const newIndex =
      currentEntries.length > 0 ? Math.max(...currentEntries) + 1 : 0;

    setSourceEntries(prev => ({
      ...prev,
      [key]: [...currentEntries, newIndex],
    }));
  };

  const handleRemoveEntry = (
    requestTo: string,
    materialId: any,
    category: string,
    entryIndex: number,
  ) => {
    const baseKey = `${requestTo}-${materialId}-${category}`;
    const entryKey = `${baseKey}-${entryIndex}`;
    const currentEntries = sourceEntries[baseKey] || [];

    // Allow removal only if there is more than 1 entry total.
    const allEntries = sourceEntries[baseKey] || [0];
    if (allEntries.length <= 1) {
      Alert.alert(
        'Cannot Remove',
        'There must be at least one entry per category.',
      );
      return;
    }

    setSourceEntries(prev => ({
      ...prev,
      [baseKey]: currentEntries.filter(i => i !== entryIndex),
    }));

    // Clean up all related state data for the removed entry
    setFormData(prev => {
      const newData = {...prev};
      delete newData[entryKey];
      return newData;
    });

    setPrefilledEntries(prev => {
      const newData = {...prev};
      delete newData[entryKey];
      return newData;
    });

    if (requestTo === 'procurement-details') {
      setSelectedSource(prev => {
        const newData = {...prev};
        delete newData[entryKey];
        return newData;
      });
    } else if (requestTo === 'production') {
      setSelectedMixDesign(prev => {
        const newData = {...prev};
        delete newData[entryKey];
        return newData;
      });
    }
  };

  // Helper to check if the form is fully complete (simple validation)
  const isFormValid = (): boolean => {
    for (const item of prepareMaterialConsumption) {
      for (const request of item.materialRequests || []) {
        for (const material of request.materials || []) {
          for (const req of material.materialRequests || []) {
            const baseKey = `${item.requestTo}-${material.testMaterialId}-${req.category}`;
            const entries = sourceEntries[baseKey] || [0];

            for (const entryIndex of entries) {
              const key = `${baseKey}-${entryIndex}`;
              const quantity = formData[key];
              const selection =
                item.requestTo === 'procurement-details'
                  ? selectedSource[key]
                  : selectedMixDesign[key];

              if (!quantity || parseFloat(quantity) <= 0) {
                showSnackbar(
                  `Quantity is required for ${req.category} entry ${
                    entries.indexOf(entryIndex) + 1
                  }.`,
                  'error',
                );
                return false;
              }
              if (!selection) {
                const type =
                  item.requestTo === 'procurement-details'
                    ? 'Source'
                    : 'Mix Design';
                showSnackbar(
                  `${type} is required for ${req.category} entry ${
                    entries.indexOf(entryIndex) + 1
                  }.`,
                  'error',
                );
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  };
  // ... (rest of the component and functions)

  const handleSubmit = async () => {
    if (!isFormValid()) {
      console.log('❌ Form validation failed. Submission aborted.');
      return;
    }

    try {
      if (
        !prepareMaterialConsumption ||
        prepareMaterialConsumption.length === 0
      ) {
        return;
      }

      // ⚠️ HARDCODED VALUE FOR IMMEDIATE SUBMISSION FIX
      // This value is used as a fallback and to ensure the production object contains the required ID.
      // TODO: In the future, this value must be correctly sourced from the input data (materialData/item.testEquipmentId).
      const HARDCODED_TEST_EQUIPMENT_ID = '6841daf3c00f933c0c16c0a4';

      // Map to hold consolidated request objects.
      // Key format:
      // - Procurement: "procurement-details"
      // - Production: "requestTo-testEquipmentId-testWorkCategoryId-category" (Ensures full separation per consumption entry)
      const requestsMap = new Map();

      prepareMaterialConsumption.forEach((item: any) => {
        // Use item's ID if present, otherwise use the hardcoded fallback
        const testEquipmentId =
          item.testEquipmentId || HARDCODED_TEST_EQUIPMENT_ID;

        item.materialRequests.forEach((request: any) => {
          const workCategoryId = request.testWorkCategoryId;

          request.materials.forEach((material: any) => {
            material.materialRequests.forEach((req: any) => {
              const baseKey = `${item.requestTo}-${material.testMaterialId}-${req.category}`;
              const entries = sourceEntries[baseKey] || [];
              const uniqueEntries = [...new Set(entries)];

              // Check if there is actual valid data entered for this category
              const hasData = uniqueEntries.some(entryIndex => {
                const key = `${baseKey}-${entryIndex}`;
                const quantity = formData[key];
                const selection =
                  item.requestTo === 'procurement-details'
                    ? selectedSource[key]
                    : selectedMixDesign[key];
                return parseFloat(quantity) > 0 && selection;
              });

              if (!hasData) return;

              // 1. Determine the map key (REFINED CORE LOGIC)
              let mapKey;
              if (item.requestTo === 'production') {
                // Production is separated by equipment, work category, AND material category
                const equipmentId = testEquipmentId;
                mapKey = `${item.requestTo}-${equipmentId}-${workCategoryId}-${req.category}`;
              } else {
                // Procurement is grouped together by requestTo
                mapKey = item.requestTo;
              }

              // 2. Initialize the root object if it doesn't exist (Ensures testEquipmentId is placed correctly)
              if (!requestsMap.has(mapKey)) {
                const newRequestObj: any = {
                  requestTo: item.requestTo,
                };
                if (item.requestTo === 'production' && testEquipmentId) {
                  // Placing testEquipmentId at the root level, right after requestTo
                  newRequestObj.testEquipmentId = testEquipmentId;
                }
                // Initialize the testWorkCategories array at the end
                newRequestObj.testWorkCategories = [];

                requestsMap.set(mapKey, newRequestObj);
              }

              const rootRequestObj = requestsMap.get(mapKey);

              // 3. Find or create the testWorkCategory object within the rootRequestObj
              let testWorkCategoryObj = rootRequestObj.testWorkCategories.find(
                (wc: any) => wc.testWorkCategoryId === workCategoryId,
              );

              if (!testWorkCategoryObj) {
                testWorkCategoryObj = {
                  testWorkCategoryId: workCategoryId,
                  testWorkCategoryType: request.testWorkCategoryType,
                  materialTypes: [],
                };
                rootRequestObj.testWorkCategories.push(testWorkCategoryObj);
              }

              // 4. Find or create the materialType object within the testWorkCategory
              let materialTypeObj = testWorkCategoryObj.materialTypes.find(
                (mt: any) => mt.testMaterialId === material.testMaterialId,
              );

              if (!materialTypeObj) {
                materialTypeObj = {
                  testMaterialId: material.testMaterialId,
                  type: material.materialType || material.type,
                  materialCategory: [],
                };
                testWorkCategoryObj.materialTypes.push(materialTypeObj);
              }

              // 5. Build the materialCategory array entry and aggregate quantities
              const categoryObj: any = {
                category: req.category,
              };

              const isProcurement = item.requestTo === 'procurement-details';
              const aggregation: Record<string, any> = {};

              uniqueEntries.forEach(entryIndex => {
                const key = `${baseKey}-${entryIndex}`;
                const quantity = formData[key];
                const selection = isProcurement
                  ? selectedSource[key]
                  : selectedMixDesign[key];

                if (quantity && parseFloat(quantity) > 0 && selection) {
                  const id = selection.id;
                  const qty = parseFloat(quantity);

                  if (aggregation[id]) {
                    aggregation[id].qty += qty;
                  } else {
                    if (isProcurement) {
                      aggregation[id] = {
                        sourceName: selection.name,
                        sourceApprovalId: selection.id,
                        qty: qty,
                      };
                    } else {
                      // production
                      aggregation[id] = {
                        mixDesignName: selection.name,
                        mixDesignId: selection.id,
                        qty: qty,
                      };
                    }
                  }
                }
              });

              if (isProcurement) {
                categoryObj.source = Object.values(aggregation);
              } else {
                categoryObj.mixDesign = Object.values(aggregation);
              }

              // Add the category only if it has valid aggregated data
              if (Object.values(aggregation).length > 0) {
                materialTypeObj.materialCategory.push(categoryObj);
              }
            });
          });
        });
      });

      // Convert the map values into the final materialRequests array, filtering out empty ones
      const materialRequests = Array.from(requestsMap.values()).filter(
        req =>
          req.testWorkCategories.length > 0 &&
          req.testWorkCategories.some((wc: any) => wc.materialTypes.length > 0),
      );

      if (materialRequests.length === 0) {
        Alert.alert(
          'No Data',
          'Please enter quantity and select a source/mix design for at least one entry.',
        );
        return;
      }

      const payload: any = {
        rfiId: materialData.rfiId || rfiId,
        isMaterialRequested: false,
        comments: 'Material consumption submitted/updated.',
        materialRequests,
      };

      console.log(
        '✅ Final Submit/Update Payload (Refined Grouping, Hardcoded ID used for Production):',
        JSON.stringify(payload, null, 2),
      );

      // Dispatch API request
      dispatch(
        submitMaterialRequest({
          projectId: loggedInUser.projectId,
          body: payload,
        }),
      );
    } catch (err) {
      console.error('❌ Error while preparing payload:', err);
      showSnackbar('An error occurred during submission preparation.', 'error');
    }
  };

  // Helper for keyExtractor in FlatList
  const keyExtractor = (item: any): string => {
    return (
      item?.id ||
      item?._id ||
      item?.sourceApprovalId ||
      item?.mixDesignId ||
      Math.random()
    ).toString();
  };

  const renderDropdownModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade" // Use fade for a modern feel
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Select{' '}
              {currentDropdown?.type === 'source' ? 'Source' : 'Mix Design'}
            </Text>
            <TouchableOpacity
              style={styles.closeButtonContainer}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {apiLoading ? (
            <ActivityIndicator
              style={styles.loadingText}
              size="small"
              color="#5e35b1"
            />
          ) : (
            <FlatList
              data={dropdownOptions}
              keyExtractor={keyExtractor}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectDropdownItem(item)}>
                  <Text style={styles.dropdownItemText}>
                    {item?.name || item?.sourceName || item?.mixDesignName}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No available options.</Text>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Material Consumption Form</Text>

      {/* Safe Guard */}
      {prepareMaterialConsumption.length === 0 ? (
        <Text style={styles.emptyText}>
          No material data available to display.
        </Text>
      ) : (
        prepareMaterialConsumption.map((item: any, index: number) => (
          <View key={index} style={styles.section}>
            {item.materialRequests.map((request: any, reqIndex: number) => (
              <View key={reqIndex} style={styles.categorySection}>
                {/* Information Header - Reduced Padding */}
                <View style={styles.infoContainer}>
                  <View style={styles.infoField}>
                    <Text style={styles.infoLabel}>Material Name</Text>
                    <Text style={styles.infoValue}>
                      {request?.materials?.[0]?.materialName || 'NA'}
                    </Text>
                  </View>
                  <View style={styles.infoField}>
                    <Text style={styles.infoLabel}>Work Category</Text>
                    <Text style={styles.infoValue}>
                      {request?.testWorkCategoryName || 'NA'}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoContainer}>
                  <View style={styles.infoField}>
                    <Text style={styles.infoLabel}>Material Category</Text>
                    <Text style={styles.infoValue}>
                      {request?.materialCategory ||
                        request?.testMaterialCategory ||
                        'NA'}
                    </Text>
                  </View>
                  <View style={styles.infoField}>
                    <Text style={styles.infoLabel}>Unit</Text>
                    <Text style={styles.infoValue}>
                      {request?.unit || 'NA'}
                    </Text>
                  </View>
                </View>

                {request.materials.map((material: any, matIndex: number) => (
                  <View key={matIndex} style={styles.materialSection}>
                    {material.materialRequests.map(
                      (req: any, catIndex: number) => {
                        const baseKey = `${item.requestTo}-${material.testMaterialId}-${req.category}`;
                        const entries = sourceEntries[baseKey] || [0];
                        const typeLabel =
                          item.requestTo === 'procurement-details'
                            ? 'Source'
                            : 'Mix Design';

                        return (
                          <View key={catIndex} style={styles.categoryContainer}>
                            <Text style={styles.categoryLabel}>
                              {req.category} ({req.unit})
                            </Text>

                            {entries.map(entryIndex => {
                              const key = `${baseKey}-${entryIndex}`;
                              const isPrefilled = prefilledEntries[key];
                              const currentEntryIdx =
                                entries.indexOf(entryIndex); // Get current display index

                              return (
                                <View
                                  key={entryIndex}
                                  style={styles.requestItem}>
                                  {(entries.length > 1 || isPrefilled) && (
                                    <View style={styles.entryHeader}>
                                      <Text style={styles.entryNumber}>
                                        {typeLabel} Entry {currentEntryIdx + 1}
                                      </Text>
                                      {/* Only allow removing if there is more than one entry */}
                                      {entries.length > 1 && (
                                        <TouchableOpacity
                                          onPress={() =>
                                            handleRemoveEntry(
                                              item.requestTo,
                                              material.testMaterialId,
                                              req.category,
                                              entryIndex,
                                            )
                                          }>
                                          <Text style={styles.removeButton}>
                                            ✕ Remove
                                          </Text>
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                  )}

                                  {/* Source/Mix Design Dropdown */}
                                  <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                      {typeLabel}:
                                    </Text>
                                    <TouchableOpacity
                                      style={[
                                        styles.dropdownButton,
                                        isPrefilled &&
                                          styles.dropdownButtonDisabled,
                                      ]}
                                      onPress={() =>
                                        !isPrefilled &&
                                        openDropdown(
                                          item.requestTo ===
                                            'procurement-details'
                                            ? 'source'
                                            : 'mixDesign',
                                          key,
                                          material.testMaterialId,
                                        )
                                      }
                                      disabled={isPrefilled}>
                                      <Text
                                        style={[
                                          styles.dropdownButtonText,
                                          !(item.requestTo ===
                                          'procurement-details'
                                            ? selectedSource[key]
                                            : selectedMixDesign[key]) &&
                                            styles.placeholderText,
                                          isPrefilled && styles.disabledText,
                                        ]}>
                                        {(item.requestTo ===
                                        'procurement-details'
                                          ? selectedSource[key]?.name
                                          : selectedMixDesign[key]?.name) ||
                                          `Select ${typeLabel}`}
                                      </Text>
                                      {!isPrefilled && (
                                        <Text style={styles.dropdownArrow}>
                                          ▼
                                        </Text>
                                      )}
                                    </TouchableOpacity>
                                  </View>

                                  {/* Quantity Input */}
                                  <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                      Quantity Consumed:
                                    </Text>
                                    <TextInput
                                      style={styles.input}
                                      placeholder="Enter quantity"
                                      keyboardType="numeric"
                                      value={formData[key] || ''}
                                      onChangeText={value =>
                                        handleQuantityChange(
                                          item.requestTo,
                                          material.testMaterialId,
                                          req.category,
                                          value,
                                          entryIndex,
                                        )
                                      }
                                    />
                                  </View>
                                </View>
                              );
                            })}

                            {/* Add More button */}
                            <TouchableOpacity
                              style={styles.addMoreButton}
                              onPress={() =>
                                handleAddMore(
                                  item.requestTo,
                                  material.testMaterialId,
                                  req.category,
                                  material.testMaterialId,
                                )
                              }>
                              <Text style={styles.addMoreText}>
                                + Add More {typeLabel}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      },
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={submitLoading} // Disable when loading
      >
        {submitLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Update Consumption</Text>
        )}
      </TouchableOpacity>

      {renderDropdownModal()}
    </ScrollView>
  );
};

// Modern UI Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12, // Reduced padding
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ABBEFD',
  },
  header: {
    fontSize: 22, // Slightly smaller header
    fontWeight: '700',
    marginBottom: 15, // Reduced margin
    color: '#1a1a1a',
    textAlign: 'center',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10, // Slightly smaller border radius
    padding: 10, // Reduced padding
    marginBottom: 10, // Reduced margin
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1, // Softer shadow
    shadowRadius: 4,
    elevation: 3,
  },
  categorySection: {
    marginBottom: 5, // Reduced margin
  },
  // New styles for the static info fields (Material Name, Category, Unit)
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    gap: 8,
  },
  infoField: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#5e35b1',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6c757d',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212529',
    marginTop: 2,
  },
  // End of new info styles

  materialSection: {
    marginBottom: 0,
  },
  requestItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10, // Reduced padding
    marginBottom: 8, // Reduced margin
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10, // Reduced margin
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5,
  },
  categoryContainer: {
    marginBottom: 15, // Reduced margin
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  entryNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5e35b1',
  },
  removeButton: {
    fontSize: 12, // Slightly smaller
    color: '#f44336',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 8, // Reduced margin
  },
  label: {
    fontSize: 12, // Slightly smaller
    fontWeight: '600',
    color: '#4a4a4a',
    marginBottom: 5, // Reduced margin
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0', // Lighter border
    borderRadius: 6, // Reduced radius
    padding: 10, // Reduced padding
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#1a1a1a',
    height: 40, // Fixed height for consistency
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0d0d0', // Lighter border
    borderRadius: 6, // Reduced radius
    padding: 10, // Reduced padding
    backgroundColor: '#fff',
    minHeight: 40, // Fixed minimum height
  },
  dropdownButtonDisabled: {
    backgroundColor: '#f0f0f0', // Lighter disabled background
    borderColor: '#c0c0c0',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  placeholderText: {
    color: '#9e9e9e',
  },
  disabledText: {
    color: '#757575',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#757575',
    marginLeft: 8,
  },
  addMoreButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  addMoreText: {
    color: '#5e35b1',
    fontSize: 13, // Slightly smaller
    fontWeight: '600',
    paddingVertical: 5,
  },
  submitButton: {
    backgroundColor: '#5e35b1', // Same color
    padding: 14, // Reduced padding
    borderRadius: 6, // Reduced radius
    alignItems: 'center',
    marginTop: 15, // Adjusted margin
    marginBottom: 25,
    shadowColor: '#5e35b1',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3, // Enhanced shadow for modern look
    shadowRadius: 6,
    elevation: 5,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Modal styles (minor adjustments for consistency)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%', // Slightly smaller
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButtonContainer: {
    padding: 5,
  },
  closeButton: {
    fontSize: 20,
    color: '#9e9e9e',
    fontWeight: '400',
  },
  dropdownItem: {
    padding: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#9e9e9e',
    fontSize: 13,
  },
  loadingText: {
    padding: 20,
  },
});

export default MaterialConsumptionForm;
