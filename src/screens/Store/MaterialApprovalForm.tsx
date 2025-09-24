// src/screens/MaterialApprovalForm.tsx

import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  NativeEventEmitter,
} from 'react-native';
import {HeaderItems, MATERIAL_REQUEST_STATUS} from '../../constants/constants';
import DropdownPicker from '../../components/UI/DropdownPicker';
import DetailsCard from '../Common/DetailsCard';
import { getSourceApprovals, patchDispatchRequest, patchMaterialRequestStatus } from '../ManageUsers/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from '../../context/SnackbarContext';

// --- Type Definitions ---

interface RequestData {
  workCategory: string;
  materialName: string;
  materialCategory: string;
  unit: string;
  qtyRequested: number;
  qtyApproved: number;
  taskPath: string;
  userName: string;
  requestDateTime: string;
}

interface SourceOption {
  label: string;
  value: string;
}

interface DispatchSource {
  id: number;
  source: string;
  quantity: string;
}

// Assuming React Navigation types
// type MaterialApprovalFormProps = {
//   route: {params?: {status?: string, item: any}};
//   navigation: any; // Replace 'any' with your actual navigation type for better safety
// };

// --- Mock Data ---

const requestData: RequestData = {
  workCategory: 'Structural Steel',
  materialName: 'TMT Bars',
  materialCategory: 'Fe-500D',
  unit: 'Tonne',
  qtyRequested: 150.5,
  qtyApproved: 150,
  taskPath: 'Project X / Tower A / Foundation / Raft',
  userName: 'Prakash Kumar (Site Engineer)',
  requestDateTime: '15/08/2025 10:30 AM',
};

const sourcesData: SourceOption[] = [
  {label: 'Select Source', value: ''},
  {label: 'Main Warehouse', value: 'main_warehouse'},
  {label: 'Site Storage A', value: 'site_storage_a'},
  {label: 'Vendor Direct Supply', value: 'vendor_direct'},
  {label: 'Local Purchase', value: 'local_purchase'},
];

// --- Component ---

const MaterialApprovalForm = ({route, navigation}) => {
  const {status} = route.params?.item || {};
  console.log('Statysdsfmldsk: ', route.params?.item?.items)
  const [qtyIssued, setQtyIssued] = useState<string>('');
  const [qtyApproved, setQtyApproved] = useState(route.params?.item);
  const [remarks, setRemarks] = useState<string>('');
  const [dispatchSources, setDispatchSources] = useState<any[]>([]);
  // initial state: one row
  const [localApprovals, setLocalApprovals] = useState<any[]>([]);
  const [nextId, setNextId] = useState<number>(2);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const [approvedQty, setApprovedQty] = useState({}); // object keyed by id
  const { patchMeterialRequestStatusData, loading: any, error } = useSelector((state) => state.MeterialRequest);
  const {sourceApprovals} = useSelector((state: any) => state.SourceApprovals);

  useEffect(() => {
        if (patchMeterialRequestStatusData) {
          showSnackbar("Meterial status updated successfully", "success");
        } else if (error) {
          showSnackbar(error, "error");
        }
      }, [patchMeterialRequestStatusData, error]);

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit(
        'headerEvent',
        status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL
          ? HeaderItems.materialApprove
          : HeaderItems.materialDispatch,
      );
    }
  }, [isFocused, status]);

  useEffect(() => {
  if (route.params?.item?.items?.length > 0 && localApprovals.length === 0) {
    const initialApprovals = route.params.item.items.map((request: any) => ({
      id: `${request._id || request.testMaterialId}_${Date.now()}`,
      testMaterialId: request.testMaterialId || request._id,
      name: '',
      quantity: '',
    }));
    setLocalApprovals(initialApprovals);
  }
}, [route.params?.item?.items]);

  const detailsData = useMemo(() => {
    const data = [
      {label: 'Material Name', value: requestData.materialName},
      {label: 'Category', value: requestData.materialCategory},
      {label: 'Work Category', value: requestData.workCategory},
      {label: 'Unit', value: requestData.unit},
      {
        label: 'Qty Requested',
        value: `${requestData.qtyRequested} ${requestData.unit}`,
      },
    ];
    if (status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH) {
      data.push({
        label: 'Qty Approved',
        value: `${requestData.qtyApproved} ${requestData.unit}`,
      });
    }
    data.push({type: 'divider' as const});
    data.push(
      {label: 'Task Details', value: requestData.taskPath},
      {label: 'Requested by', value: requestData.userName},
      {label: 'Request Date', value: requestData.requestDateTime},
    );
    return data;
  }, [status]);


  const handleQtyChange = (id, value) => {
    setApprovedQty(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (type:any) => {
    let payload = {
      status: type === 'dispatch' ? MATERIAL_REQUEST_STATUS.DISPATCHED : MATERIAL_REQUEST_STATUS.PENDING_DISPATCH,
      comments: remarks,
      approvalData: route.params?.item?.items?.map((req: any) => ({
        materialRequestItemId: req._id,
        quantityApproved: approvedQty[req._id] ?? Number(req.qty_requested),
      })),
    };
console.log('dsjskljf!!!----',{projectId: loggedInUser.projectId,
      id: route.params?.item?.id,
      body: payload,})
  dispatch(
    patchMaterialRequestStatus({
      projectId: loggedInUser.projectId,
      id: route.params?.item?.id,
      body: payload,
    })
  );

  Alert.alert('Success', 'Form has been submitted successfully!');
};




// Fetch available sources only if not already in Redux
const getAvailableSources = (currentRowId: any) => {
  //Alert.alert('Error', 'Please fill in all source details');
  const existingApprovals = sourceApprovals?.filter(
    (row: any) => row.testMaterialId === currentRowId
  );

  console.log('Test Data: ----', existingApprovals?.length)
  if (existingApprovals?.length === 0 || existingApprovals?.length === undefined) {
    dispatch(
      getSourceApprovals({
        projectId: loggedInUser.projectId,
        testMaterialId: currentRowId,
      })
    );
  }

  // Build dropdown list
  const allSources = sourceApprovals?.map((opt: any) => ({
    label: opt.name,
    value: opt.name,
  }));

  setDispatchSources(allSources);
};

// Handle source dropdown change
const handleSourceChange = (newValue: string, rowId: string) => {
  setLocalApprovals(prev =>
    prev.map(row =>
      row.testMaterialId === rowId ? { ...row, name: newValue } : row
    )
  );
};

// Handle qty input
const handleQuantityChange = (value: string, rowId: string) => {
  setLocalApprovals(prev =>
    prev.map(row => (row.id === rowId ? { ...row, quantity: value } : row))
  );
};

// Remove row
// Updated remove function to ensure at least one row per material
const handleRemoveSourceRow = (id: string, materialId: any) => {
  const materialRows = localApprovals?.filter(row => row.testMaterialId === materialId);
  
  // Don't remove if it's the last row for this material
  if (materialRows.length <= 1) {
    return;
  }
  
  setLocalApprovals(prev => prev?.filter(row => row.id !== id));
};


const totalSourceQuantityForMaterial = (materialId: any) => {
  return localApprovals?.filter(row => row.testMaterialId === materialId)?.reduce((total, row) => total + (parseFloat(row.quantity) || 0), 0);
};

// Add source row for specific material
const handleAddSourceRowForMaterial = (materialId: any) => {
  setLocalApprovals((prev: any) => [
    ...prev,
    {
      id: `${materialId}_${Date.now()}`,
      testMaterialId: materialId,
      name: '',
      quantity: '',
    },
  ]);
};

// Helper function to get default row for a material if none exists
const getSourceRowsForMaterial = (materialId: any) => {
  return localApprovals?.filter(row => row.testMaterialId === materialId);
};

// Handle dispatch for single material
const handleDispatchSingleMaterial = (request: any) => {
  const materialSources = localApprovals?.filter(row => row.testMaterialId === request.testMaterialId);
  const totalQty = totalSourceQuantityForMaterial(request.testMaterialId);
  const approvedQtyForMaterial = parseFloat(approvedQty[request._id] ?? String(request.qty_approved ?? request.qty_requested));

  // Validate quantities
  if (totalQty !== approvedQtyForMaterial) {
    Alert.alert('Error', `Source quantities (${totalQty}) must equal approved quantity (${approvedQtyForMaterial}) for ${request.testMaterialType}`);
    return;
  }

  // // Validate all sources are selected
  // const incompleteRows = materialSources?.filter(row => !row.name || !row.quantity);
  // if (incompleteRows.length > 0) {
  //   Alert.alert('Error', 'Please fill in all source details');
  //   return;
  // }

  // Create payload for single material dispatch
  let payload = {
    qty_issued: request.qty_requested,
    //status: MATERIAL_REQUEST_STATUS.PENDING_DISPATCH, // Assuming there's a DISPATCHED status
    comments_issued: remarks,
    source: [{
      materialRequestItemId: request._id,
      quantityDispatched: approvedQtyForMaterial,
      sources: materialSources.map(source => ({
        sourceName: source.name,
        sourceApprovalId: source?._id,
        qty: parseFloat(source.quantity)
      }))
    }]
  };
  dispatch(
    patchDispatchRequest({
      projectId: loggedInUser.projectId,
      id: route.params?.item?.id,
      body: payload,
    })
  );

  Alert.alert('Success', `${request.testMaterialType} has been dispatched successfully!`);
};

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* <DetailsCard title="Material Request Details" data={detailsData} /> */}

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>
          {status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL
            ? 'Approval Details'
            : 'Dispatch Details'}
        </Text>

        {status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL && route.params?.item?.items?.length > 0 &&
          route.params?.item?.items?.map((request: any) => (
            <View style={styles.formGroup}>
              <View style={styles.mainContainer}>
                <View style={styles.columnContainer}>
                  {request?.testMaterialType && (
                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>Material Name</Text>
                      <Text style={styles.fieldValue}>{request?.testMaterialType}</Text>
                    </View>
                  )}
                  {request?.testWorkCategoryType && (
                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>Work Category</Text>
                      <Text style={styles.fieldValue}>{request?.testWorkCategoryType}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.columnContainer}>
                  {request?.name && (
                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>Requested By</Text>
                      <Text style={styles.fieldValue}>{request?.name}</Text>
                    </View>
                  )}
                  {request?.createdAt && (
                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>Request Date</Text>
                      <Text style={styles.fieldValue}>{request?.createdAt}</Text>
                    </View>
                  )}
                </View>
                {/* ... Approval Section JSX ... */}
                <View>
                  <Text style={styles.label}>
                    Total Qty Approve <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    // 👇 controlled by state
                    value={approvedQty[request._id] ?? String(request.qty_requested ?? '')}
                    onChangeText={val => handleQtyChange(request._id, val)}
                    keyboardType="decimal-pad"
                    placeholder="Enter total issued quantity"
                  />
                  <Text style={styles.helperText}>
                    Maximum: {request?.qty_requested} {requestData.unit}  (Requested
                    quantity)
                  </Text>
                </View>
              </View>
            </View>
          ))
        }

        {status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH && (
          <>
            {route.params?.item?.items?.map((request: any, index: number) => (
              <View key={request._id || index} style={styles.mainContainer}>
                <View style={styles.columnContainer}>
                  {request?.testMaterialType && (
                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>Material Name</Text>
                      <Text style={styles.fieldValue}>{request?.testMaterialType}</Text>
                    </View>
                  )}
                  {request?.testWorkCategoryType && (
                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>Work Category</Text>
                      <Text style={styles.fieldValue}>{request?.testWorkCategoryType}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.columnContainer}>
                  {request?.name && (
                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>Requested By</Text>
                      <Text style={styles.fieldValue}>{request?.name}</Text>
                    </View>
                  )}
                  {request?.createdAt && (
                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>Request Date</Text>
                      <Text style={styles.fieldValue}>{request?.createdAt}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Total Qty Issued <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={approvedQty[request._id] ?? String(request.qty_approved ?? request.qty_requested ?? '')}
                    onChangeText={val => handleQtyChange(request._id, val)}
                    keyboardType="decimal-pad"
                    placeholder="Enter total issued quantity"
                  />
                  <Text style={styles.helperText}>
                    Maximum: {request?.qty_approved ?? request?.qty_requested} {request?.unit ?? requestData.unit} (Approved quantity)
                  </Text>
                </View>

                <View style={styles.sourceTableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, {flex: 2}]}>Source</Text>
                    <Text style={[styles.tableHeaderText, {flex: 1.2}]}>Quantity</Text>
                    <View style={{width: 30}} />
                  </View>

                  {getSourceRowsForMaterial(request.testMaterialId)?.map(row => {
                    // Collect already selected names except current row for this specific material
                    const selectedNames = localApprovals?.filter(r => r.id !== row.id && r.name && r.testMaterialId === request.testMaterialId)
                      ?.map(r => r.name);

                    const availableOptions = dispatchSources?.filter(
                      opt => !selectedNames.includes(opt.value)
                    );

                    return (
                      <View key={row.id} style={styles.tableRow}>
                        <View style={{ flex: 2, marginRight: 8 }}>
                           <TouchableOpacity
                          onPress={() => getAvailableSources(request.testMaterialId)}>
                          <DropdownPicker
                            items={availableOptions}
                            value={row.name}
                            onChange={(value: any) => handleSourceChange(value, row.testMaterialId)}
                          />
                          </TouchableOpacity>
                        </View>
                        <TextInput
                          style={[styles.input, { flex: 1.2, height: 42 }]}
                          value={row.quantity}
                          onChangeText={text => handleQuantityChange(text, row.id)}
                          keyboardType="decimal-pad"
                          placeholder="Qty"
                        />

                        <TouchableOpacity
                          onPress={() => handleRemoveSourceRow(row.id, request.testMaterialId)}
                          style={styles.removeButton}
                          disabled={getSourceRowsForMaterial(request.testMaterialId).length === 1}
                        >
                          <Text
                            style={[
                              styles.removeButtonText,
                              getSourceRowsForMaterial(request.testMaterialId).length === 1 && { color: '#ccc' },
                            ]}
                          >
                            ✕
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}

                  <TouchableOpacity 
                    onPress={() => handleAddSourceRowForMaterial(request.testMaterialId)} 
                    style={styles.addButton}
                  >
                    <Text style={styles.addButtonText}>+ Add Source</Text>
                  </TouchableOpacity>

                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Sum of Source Qty:</Text>
                    <Text
                      style={[
                        styles.totalValue,
                        totalSourceQuantityForMaterial(request.testMaterialId) > parseFloat(approvedQty[request._id] ?? '0') &&
                          styles.errorText,
                      ]}>
                      {totalSourceQuantityForMaterial(request.testMaterialId)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.submitButtonSingle} 
                  onPress={() => handleDispatchSingleMaterial(request)}
                >
                  <Text style={styles.submitButtonTextSingle}>Dispatch Material</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Remarks (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter any remarks or notes..."
            multiline
            maxLength={500}
          />
          <Text style={styles.helperText}>{remarks.length}/500 characters</Text>
        </View>
        {status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL ?
          <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit('approve')}>
            <Text style={styles.submitButtonText}>
              Approve Material
            </Text>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit('dispatch')}>
            <Text style={styles.submitButtonText}>Dispatch All Material</Text>
          </TouchableOpacity>
        }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#5A2AAF',
    paddingBottom: 8,
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  submitButton: {
    height: 52,
    backgroundColor: '#5A2AAF',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  submitButtonSingle: {
    height: 40,
    backgroundColor: '#5A2AAF',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 10,
    elevation: 3,
  },
  submitButtonTextSingle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sourceTableContainer: {
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  tableHeaderText: {
    fontWeight: '600',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  removeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    fontSize: 20,
    color: '#e74c3c',
  },
  addButton: {
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#5A2AAF',
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    marginRight: 10,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontWeight: 'bold',
    color: 'green',
  },
  errorText: {
    color: '#e74c3c',
  },
  mainContainer: {
    flexDirection: 'column',
    gap: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },

  // Left and right column containers
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  // Individual field containers
  fieldContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
  },

  // Field labels
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6c757d',
    textTransform: "capitalize",
  },

  // Field values
  fieldValue: {
    fontSize: 12,
    fontWeight: '400',
    color: '#212529',
  },

  // Alternative: Card style with gradient background
  cardContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#667eea', // Fallback color
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  cardFieldContainer: {
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(255, 255, 255, 0.5)',
  },

  cardFieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  cardFieldValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#ffffff',
    lineHeight: 20,
  },

  // Alternative: Minimal style
  minimalContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },

  minimalColumnContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },

  minimalFieldContainer: {
    marginBottom: 16,
    paddingVertical: 4,
  },

  minimalFieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#868e96',
    marginBottom: 2,
  },

  minimalFieldValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#343a40',
    lineHeight: 22,
  },

  // Responsive styles (for smaller screens)
  smallScreenContainer: {
    flexDirection: 'column',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  smallScreenColumn: {
    marginBottom: 12,
  },

  // Loading/skeleton styles
  skeletonField: {
    height: 16,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 8,
  },

  skeletonLabel: {
    height: 12,
    width: '60%',
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
    marginBottom: 4,
  },

  // Status-based field styling
  successField: {
    borderLeftColor: '#28a745',
    backgroundColor: '#f8fff9',
  },

  warningField: {
    borderLeftColor: '#ffc107',
    backgroundColor: '#fffef7',
  },

  errorField: {
    borderLeftColor: '#dc3545',
    backgroundColor: '#fff8f8',
  },
});

export default MaterialApprovalForm;
