import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from '../../context/SnackbarContext';
import { getSourceApprovals, patchDispatchRequest, submitMaterialRequest } from '../ManageUsers/actions';
import { getMixDesignListInfo } from '../RFIs/actions';

const MaterialConsumptionForm = ({materialData}) => {
  const [prepareMaterialConsumption] = useState(materialData);

   const [selectedMixDesigns, setSelectedMixDesigns] = useState<{[key: string]: string}>({});
   const {qualityMixDesignListInfo} = useSelector((state: any) => state.RFIs);

  const [formData, setFormData] = useState({});
  const [selectedSource, setSelectedSource] = useState({});
  const [selectedMixDesign, setSelectedMixDesign] = useState({});
  const [sourceEntries, setSourceEntries] = useState({});
  const [prefilledEntries, setPrefilledEntries] = useState({});
  
  // Static fallback data
  const STATIC_SOURCES = [
    { id: 1, name: 'Source A - Local Quarry' },
    { id: 2, name: 'Source B - Regional Supplier' },
    { id: 3, name: 'Source C - Import Depot' },
    { id: 4, name: 'Source D - Alternative Site' }
  ];

  const STATIC_MIX_DESIGNS = [
    { id: 1, name: 'Mix Design M20' },
    { id: 2, name: 'Mix Design M25' },
    { id: 3, name: 'Mix Design M30' },
    { id: 4, name: 'Mix Design M35' }
  ];
  
  // Store sources by testMaterialId
  const [sourceOptionsByMaterial, setSourceOptionsByMaterial] = useState({});
  const [mixDesignOptions, setMixDesignOptions] = useState(STATIC_MIX_DESIGNS);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDropdown, setCurrentDropdown] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const sourceApprovalsData = useSelector((state: any) => state.sourceApprovals);
  const { postMeterialRequestFormData, loading: any, error } = useSelector((state) => state.MeterialRequest)

  useEffect(() => {
    if (postMeterialRequestFormData) {
      showSnackbar("Meterial status updated successfully", "success");
    } else if (error) {
      showSnackbar(error, "error");
    }
  }, [postMeterialRequestFormData, error]);

  // Fetch Source data for a specific testMaterialId
  const fetchSourceOptionsForMaterial = (testMaterialId: string) => {
    dispatch(
      getSourceApprovals({
        projectId: loggedInUser.projectId,
        testMaterialId: testMaterialId,
      })
    );
  };

  // Fetch Mix Design data from API
  const fetchMixDesignOptions = () => {
    dispatch(getMixDesignListInfo({
        projectId: loggedInUser.projectId, 
        testWorkCategoryType: prepareMaterialConsumption[0]?.materialRequests[0]?.testWorkCategoryType, 
        testMaterialId: prepareMaterialConsumption[0]?.materialRequests[0]?.materials[0]?.testMaterialId
    }));
  };

  // Update source options when API data arrives
  useEffect(() => {
    if (sourceApprovalsData && Array.isArray(sourceApprovalsData) && sourceApprovalsData.length > 0) {
      // You need to track which testMaterialId this data is for
      // This requires modifying how you store the response
      // For now, we'll store it with a key if you can identify it from the response
      
      // Assuming the response might include testMaterialId or you track it separately
      // Store sources grouped by material
      setSourceOptionsByMaterial(prev => ({
        ...prev,
        // You may need to adjust this based on your API response structure
        [sourceApprovalsData[0]?.testMaterialId || 'default']: sourceApprovalsData
      }));
    }
  }, [sourceApprovalsData]);

  // Update mix design options when API data arrives
  useEffect(() => {
    if (qualityMixDesignListInfo && Array.isArray(qualityMixDesignListInfo) && qualityMixDesignListInfo.length > 0) {
      setMixDesignOptions(qualityMixDesignListInfo);
    }
  }, [qualityMixDesignListInfo]);

  // Fetch sources for all unique testMaterialIds on mount
  useEffect(() => {
    const uniqueMaterialIds = new Set();
    
    prepareMaterialConsumption.forEach((item) => {
      item.materialRequests?.forEach((request) => {
        request.materials?.forEach((material) => {
          if (material.testMaterialId) {
            uniqueMaterialIds.add(material.testMaterialId);
          }
        });
      });
    });

    // Fetch sources for each unique material
    uniqueMaterialIds.forEach((testMaterialId) => {
      fetchSourceOptionsForMaterial(testMaterialId);
    });

    fetchMixDesignOptions();
  }, []);

  // Prefill data from materialData when component mounts or data changes
  useEffect(() => {
    if (prepareMaterialConsumption && prepareMaterialConsumption.length > 0) {
      const newFormData = {};
      const newSelectedSource = {};
      const newSelectedMixDesign = {};
      const newSourceEntries = {};
      const newPrefilledEntries = {};

      prepareMaterialConsumption.forEach((item) => {
        item.materialRequests?.forEach((request) => {
          request.materials?.forEach((material) => {
            material.materialRequests?.forEach((req) => {
              const baseKey = `${item.requestTo}-${material.testMaterialId}-${req.category}`;
              
              // If there's existing data in the request
              if (req.source && Array.isArray(req.source) && req.source.length > 0) {
                // Initialize entries array for this category
                const entries = req.source.map((_, idx) => idx);
                newSourceEntries[baseKey] = entries;

                // Prefill each source/mix design entry
                req.source.forEach((sourceItem, idx) => {
                  const key = `${baseKey}-${idx}`;
                  
                  // Mark this entry as prefilled
                  newPrefilledEntries[key] = true;
                  
                  // Prefill quantity
                  if (sourceItem.qty) {
                    newFormData[key] = sourceItem.qty.toString();
                  }

                  // Prefill source or mix design
                  if (item.requestTo === 'procurement-details') {
                    if (sourceItem.sourceName && sourceItem.sourceApprovalId) {
                      newSelectedSource[key] = {
                        id: sourceItem.sourceApprovalId,
                        name: sourceItem.sourceName,
                      };
                    }
                  } else if (item.requestTo === 'production') {
                    if (sourceItem.sourceName && sourceItem.sourceApprovalId) {
                      newSelectedMixDesign[key] = {
                        id: sourceItem.sourceApprovalId,
                        name: sourceItem.sourceName,
                      };
                    }
                  }
                });
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
    }
  }, [prepareMaterialConsumption]);

  // Get source options for a specific testMaterialId
  const getSourceOptionsForMaterial = (testMaterialId: string) => {
    return sourceOptionsByMaterial[testMaterialId] || STATIC_SOURCES;
  };

  // Get filtered source options excluding already selected sources for the same category
  const getFilteredSourceOptions = (currentKey: string, baseKey: string, testMaterialId: string) => {
    const entries = sourceEntries[baseKey] || [0];
    const selectedSourceIds = entries
      .map((entryIndex) => {
        const key = `${baseKey}-${entryIndex}`;
        return key !== currentKey ? selectedSource[key]?.id : null;
      })
      .filter(id => id !== null);

    const sourceOptions = getSourceOptionsForMaterial(testMaterialId);
    return sourceOptions.filter(option => !selectedSourceIds.includes(option.id));
  };

  // Get filtered mix design options excluding already selected mix designs for the same category
  const getFilteredMixDesignOptions = (currentKey: string, baseKey: string) => {
    const entries = sourceEntries[baseKey] || [0];
    const selectedMixDesignIds = entries
      .map((entryIndex) => {
        const key = `${baseKey}-${entryIndex}`;
        return key !== currentKey ? selectedMixDesign[key]?.id : null;
      })
      .filter(id => id !== null);

    return mixDesignOptions.filter(option => !selectedMixDesignIds.includes(option.id));
  };

  const openDropdown = (type, key, testMaterialId) => {
    setCurrentDropdown({ type, key, testMaterialId });
    
    if (type === 'source') {
      // Extract baseKey from the current key (remove the entry index)
      const baseKey = key.substring(0, key.lastIndexOf('-'));
      const filteredOptions = getFilteredSourceOptions(key, baseKey, testMaterialId);
      setDropdownOptions(filteredOptions);
    } else {
      // Extract baseKey for mix design as well
      const baseKey = key.substring(0, key.lastIndexOf('-'));
      const filteredOptions = getFilteredMixDesignOptions(key, baseKey);
      setDropdownOptions(filteredOptions);
    }
    
    setModalVisible(true);
  };

  const selectDropdownItem = (item) => {
    if (currentDropdown.type === 'source') {
      setSelectedSource((prev) => ({
        ...prev,
        [currentDropdown.key]: item,
      }));
    } else {
      setSelectedMixDesign((prev) => ({
        ...prev,
        [currentDropdown.key]: item,
      }));
    }
    setModalVisible(false);
  };

  const handleQuantityChange = (requestTo, materialId, category, value, entryIndex = 0) => {
    setFormData((prev) => ({
      ...prev,
      [`${requestTo}-${materialId}-${category}-${entryIndex}`]: value,
    }));
  };

  const handleAddMore = (requestTo, materialId, category, testMaterialId) => {
    const key = `${requestTo}-${materialId}-${category}`;
    const currentEntries = sourceEntries[key] || [0];
    
    // Check if there are available options left based on request type
    let availableOptions;
    if (requestTo === 'procurement-details') {
      availableOptions = getFilteredSourceOptions('', key, testMaterialId);
    } else if (requestTo === 'production') {
      availableOptions = getFilteredMixDesignOptions('', key);
    }
    
    if (availableOptions && availableOptions.length === 0) {
      const optionType = requestTo === 'procurement-details' ? 'sources' : 'mix designs';
      Alert.alert('No Options Available', `All ${optionType} have been selected. Cannot add more entries.`);
      return;
    }
    
    const newIndex = currentEntries.length;
    
    setSourceEntries((prev) => ({
      ...prev,
      [key]: [...currentEntries, newIndex],
    }));
  };

  const handleRemoveEntry = (requestTo, materialId, category, entryIndex) => {
    const key = `${requestTo}-${materialId}-${category}`;
    const currentEntries = sourceEntries[key] || [0];
    
    if (currentEntries.length > 1) {
      setSourceEntries((prev) => ({
        ...prev,
        [key]: currentEntries.filter((_, idx) => idx !== entryIndex),
      }));
      
      // Clean up form data for removed entry
      setFormData((prev) => {
        const newData = { ...prev };
        delete newData[`${key}-${entryIndex}`];
        return newData;
      });
      
      // Clean up selected source or mix design
      if (requestTo === 'procurement-details') {
        setSelectedSource((prev) => {
          const newData = { ...prev };
          delete newData[`${key}-${entryIndex}`];
          return newData;
        });
      } else if (requestTo === 'production') {
        setSelectedMixDesign((prev) => {
          const newData = { ...prev };
          delete newData[`${key}-${entryIndex}`];
          return newData;
        });
      }
    }
  };

const handleSubmit = async () => {
  try {
    // Validate prepareMaterialConsumption exists
    if (!prepareMaterialConsumption || prepareMaterialConsumption.length === 0) {
      return;
    }

    const materialRequests = [];

    prepareMaterialConsumption.forEach((item) => {
      // Initialize request object based on requestTo type
      const requestObj = {
        requestTo: item.requestTo,
      };

      // Add testEquipmentId only for production requests
      if (item.requestTo === 'production') {
        requestObj.testEquipmentId = item.testEquipmentId || '67f6d3664aaee99e1d3e7749';
      }

      const testWorkCategories = [];

      // Process each material request
      item.materialRequests.forEach((request) => {
        const testWorkCategoryObj = {
          testWorkCategoryId: request.testWorkCategoryId,
          testWorkCategoryType: request.testWorkCategoryType,
          materialTypes: [],
        };

        // Process each material
        request.materials.forEach((material) => {
          const materialTypeObj = {
            testMaterialId: material.testMaterialId,
            type: material.type,
            materialCategory: [],
          };

          // Process each material request (category)
          material.materialRequests.forEach((req) => {
            const baseKey = `${item.requestTo}-${material.testMaterialId}-${req.category}`;
            const entries = sourceEntries[baseKey] || [0];
            
            // Remove duplicates from entries
            const uniqueEntries = [...new Set(entries)];

            // Initialize category object
            const categoryObj = {
              category: req.category,
            };

            // Initialize appropriate array based on requestTo type
            if (item.requestTo === 'procurement-details') {
              categoryObj.source = [];
              
              // Process each source entry
              uniqueEntries.forEach((entryIndex) => {
                const key = `${baseKey}-${entryIndex}`;
                const quantity = formData[key];
                const source = selectedSource[key];

                // Add source if quantity and source are valid
                if (quantity && parseFloat(quantity) > 0 && source) {
                  categoryObj.source.push({
                    sourceName: source.name || source.sourceName,
                    sourceApprovalId: source.id || source._id || source.sourceApprovalId,
                    qty: parseFloat(quantity),
                  });
                }
              });

              // Only add category if it has sources
              if (categoryObj.source.length > 0) {
                materialTypeObj.materialCategory.push(categoryObj);
              }
            } 
            else if (item.requestTo === 'production') {
              categoryObj.mixDesign = [];
              
              // Process each mix design entry
              uniqueEntries.forEach((entryIndex) => {
                const key = `${baseKey}-${entryIndex}`;
                const quantity = formData[key];
                const mixDesign = selectedMixDesign[key];

                // Add mix design if quantity and mixDesign are valid
                if (quantity && parseFloat(quantity) > 0 && mixDesign) {
                  categoryObj.mixDesign.push({
                    mixDesignId: mixDesign.id || mixDesign._id || mixDesign.mixDesignId,
                    mixDesignName: mixDesign.name || mixDesign.mixDesignName,
                    qty: parseFloat(quantity),
                  });
                }
              });

              // Only add category if it has mix designs
              if (categoryObj.mixDesign.length > 0) {
                materialTypeObj.materialCategory.push(categoryObj);
              }
            }
          });

          // Add material type only if it has categories
          if (materialTypeObj.materialCategory.length > 0) {
            testWorkCategoryObj.materialTypes.push(materialTypeObj);
          }
        });

        // Add work category only if it has material types
        if (testWorkCategoryObj.materialTypes.length > 0) {
          testWorkCategories.push(testWorkCategoryObj);
        }
      });

      // Add request only if it has work categories
      if (testWorkCategories.length > 0) {
        requestObj.testWorkCategories = testWorkCategories;
        materialRequests.push(requestObj);
      }
    });

    // Validate we have material requests
    if (materialRequests.length === 0) {
      return;
    }

    // Build final payload
    const payload = {
      rfiId: prepareMaterialConsumption[0]?.rfiId || '68ec0473f124eedac12b23a1',
      isMaterialRequested: false,
      comments: "Postman test request using prepared data.",
      materialRequests,
    };

    console.log("✅ Final Submit Payload:", JSON.stringify(payload, null, 2));

    // Dispatch API request
    dispatch(
      submitMaterialRequest({
        projectId: loggedInUser.projectId,
        body: payload,
      })
    );

  } catch (err) {
    console.error("❌ Error while preparing payload:", err);
  }
};



  const renderDropdownModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Select {currentDropdown?.type === 'source' ? 'Source' : 'Mix Design'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            <FlatList
              data={dropdownOptions}
              keyExtractor={(item) => (item?.id || item?._id || Math.random()).toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectDropdownItem(item)}
                >
                  <Text style={styles.dropdownItemText}>{item?.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No options available</Text>
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

      {prepareMaterialConsumption.map((item, index) => (
        <View key={index} style={styles.section}>
          {item.materialRequests.map((request, reqIndex) => (
            <View key={reqIndex} style={styles.categorySection}>
              <View style={styles.columnContainer}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Material Name</Text>
                    <Text style={styles.fieldValue}>{request?.materials?.[0]?.materialName || 'NA'}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Work Category</Text>
                    <Text style={styles.fieldValue}>{request?.testWorkCategoryName || 'NA'}</Text>
                  </View>
              </View>
              <View style={styles.columnContainer}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Material category*</Text>
                    <Text style={styles.fieldValue}>{request?.materialCategory || request?.testMaterialCategory || 'Aggregate'}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Unit</Text>
                    <Text style={styles.fieldValue}>{request?.unit || 'Ton'}</Text>
                  </View>
              </View>

              {request.materials.map((material, matIndex) => (
                <View key={matIndex} style={styles.materialSection}>
                  {material.materialRequests.map((req, catIndex) => {
                    const baseKey = `${item.requestTo}-${material.testMaterialId}-${req.category}`;
                    const entries = sourceEntries[baseKey] || [0];
                    
                    return (
                      <View key={catIndex} style={styles.categoryContainer}>
                        <Text style={styles.categoryLabel}>
                          {req.category} ({req.unit})
                        </Text>

                        {entries.map((entryIndex, idx) => {
                          const key = `${baseKey}-${entryIndex}`;
                          
                          return (
                            <View key={idx} style={styles.requestItem}>
                              {entries.length > 1 && (
                                <View style={styles.entryHeader}>
                                  <Text style={styles.entryNumber}>Entry {idx + 1}</Text>
                                  <TouchableOpacity
                                    onPress={() => handleRemoveEntry(
                                      item.requestTo,
                                      material.testMaterialId,
                                      req.category,
                                      idx
                                    )}
                                  >
                                    <Text style={styles.removeButton}>✕ Remove</Text>
                                  </TouchableOpacity>
                                </View>
                              )}

                              {item.requestTo === 'procurement-details' && (
                                <View style={styles.inputGroup}>
                                  <Text style={styles.label}>Source:</Text>
                                  <TouchableOpacity
                                    style={[
                                      styles.dropdownButton,
                                      prefilledEntries[key] && styles.dropdownButtonDisabled
                                    ]}
                                    onPress={() => !prefilledEntries[key] && openDropdown('source', key, material.testMaterialId)}
                                    disabled={prefilledEntries[key]}
                                  >
                                    <Text style={[
                                      styles.dropdownButtonText,
                                      !selectedSource[key] && styles.placeholderText,
                                      prefilledEntries[key] && styles.disabledText
                                    ]}>
                                      {selectedSource[key]?.name || 'Select Source'}
                                    </Text>
                                    {!prefilledEntries[key] && (
                                      <Text style={styles.dropdownArrow}>▼</Text>
                                    )}
                                  </TouchableOpacity>
                                </View>
                              )}

                              {item.requestTo === 'production' && (
                                <View style={styles.inputGroup}>
                                  <Text style={styles.label}>Mix Design:</Text>
                                  <TouchableOpacity
                                    style={[
                                      styles.dropdownButton,
                                      prefilledEntries[key] && styles.dropdownButtonDisabled
                                    ]}
                                    onPress={() => !prefilledEntries[key] && openDropdown('mixDesign', key, material.testMaterialId)}
                                    disabled={prefilledEntries[key]}
                                  >
                                    <Text style={[
                                      styles.dropdownButtonText,
                                      !selectedMixDesign[key] && styles.placeholderText,
                                      prefilledEntries[key] && styles.disabledText
                                    ]}>
                                      {selectedMixDesign[key]?.name || 'Select Mix Design'}
                                    </Text>
                                    {!prefilledEntries[key] && (
                                      <Text style={styles.dropdownArrow}>▼</Text>
                                    )}
                                  </TouchableOpacity>
                                </View>
                              )}

                              <View style={styles.inputGroup}>
                                <Text style={styles.label}>Quantity Consumed:</Text>
                                <TextInput
                                  style={styles.input}
                                  placeholder="Enter quantity"
                                  keyboardType="numeric"
                                  value={formData[key] || ''}
                                  onChangeText={(value) =>
                                    handleQuantityChange(
                                      item.requestTo,
                                      material.testMaterialId,
                                      req.category,
                                      value,
                                      entryIndex
                                    )
                                  }
                                />
                              </View>
                            </View>
                          );
                        })}

                        {/* Add More button for both procurement-details and production */}
                        {item.requestTo === 'procurement-details' && (
                          <TouchableOpacity
                            style={styles.addMoreButton}
                            onPress={() =>
                              handleAddMore(
                                item.requestTo,
                                material.testMaterialId,
                                req.category,
                                material.testMaterialId
                              )
                            }
                          >
                            <Text style={styles.addMoreText}>+ Add More</Text>
                          </TouchableOpacity>
                        )}

                        {item.requestTo === 'production' && (
                          <TouchableOpacity
                            style={styles.addMoreButton}
                            onPress={() =>
                              handleAddMore(
                                item.requestTo,
                                material.testMaterialId,
                                req.category,
                                material.testMaterialId
                              )
                            }
                          >
                            <Text style={styles.addMoreText}>+ Add More</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

      {renderDropdownModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categorySection: {
    marginBottom: 0,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 0,
  },
  materialSection: {
    marginBottom: 0,
  },
  materialName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a4a4a',
    marginBottom: 7,
  },
  requestItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginBottom: 12,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  entryNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5e35b1',
  },
  removeButton: {
    fontSize: 13,
    color: '#f44336',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a4a4a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    minHeight: 44,
  },
  dropdownButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#d0d0d0',
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
    paddingTop: 12,
  },
  addMoreText: {
    color: '#5e35b1',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#5e35b1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#5e35b1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '85%',
    maxHeight: '70%',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    fontSize: 24,
    color: '#9e9e9e',
    fontWeight: '400',
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 28,
  },
  dropdownItem: {
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  emptyText: {
    textAlign: 'center',
    padding: 24,
    color: '#9e9e9e',
    fontSize: 14,
  },
  loadingText: {
    textAlign: 'center',
    padding: 24,
    color: '#757575',
    fontSize: 14,
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10
  },
  fieldContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6c757d',
    textTransform: "capitalize",
  },
  fieldValue: {
    fontSize: 12,
    fontWeight: '400',
    color: '#212529',
  },
});

export default MaterialConsumptionForm;