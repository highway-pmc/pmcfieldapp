// src/screens/MaterialApprovalProduction.tsx

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
import { getSourceApprovals, patchDispatchRequest, patchMaterialRequestStatus, postUploadBatchSlip } from '../ManageUsers/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from '../../context/SnackbarContext';
import { getMixDesignListInfo } from '../RFIs/actions';
import DocumentPicker from 'react-native-document-picker';
import appConfig from '../../common/app.config';

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

const MaterialApprovalProduction = ({route, navigation}) => {
  const {status} = route.params?.item || {};
  console.log('Statysdsfmldsk: ', route.params?.item?.items)
  const [qtyIssued, setQtyIssued] = useState<string>('');
  const [qtyApproved, setQtyApproved] = useState(route.params?.item);
  const [remarks, setRemarks] = useState<string>('');
  const [dispatchSources, setDispatchSources] = useState<any[]>([]);
  // initial state: one row
  const [localApprovals, setLocalApprovals] = useState<any[]>([]);
    // Add these state variables at the top of your component
  const [vehicleNumbers, setVehicleNumbers] = useState<{[key: string]: string[]}>({});
  const [currentVehicleInput, setCurrentVehicleInput] = useState<{[key: string]: string}>({});
  const [batchNumbers, setBatchNumbers] = useState<{[key: string]: string}>({});
  const [batchSlips, setBatchSlips]: any = useState(null);
  const [fileUrlData, setfileUrlData]: any = useState('');
  const [selectedMixDesigns, setSelectedMixDesigns] = useState<{[key: string]: string}>({});
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const [approvedQty, setApprovedQty] = useState({}); // object keyed by id
  const { patchMeterialRequestStatusData, uploadingBatchData, loading: any, error } = useSelector((state) => state.MeterialRequest);
  const {sourceApprovals} = useSelector((state: any) => state.SourceApprovals);
  const {qualityMixDesignListInfo} = useSelector((state: any) => state.RFIs);

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
    dispatch(getMixDesignListInfo({projectId: loggedInUser.projectId, testWorkCategoryType: route.params?.item?.items[0]?.testWorkCategoryType, testMaterialId: route.params?.item?.items[0]?.testMaterialId}));
  }
}, [route.params?.item?.items, qualityMixDesignListInfo]);

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



// Add vehicle number functions
const handleAddVehicle = (requestId: string) => {
  const vehicleNumber = currentVehicleInput[requestId]?.trim();
  if (!vehicleNumber || vehicleNumber.length !== 4) {
    Alert.alert('Error', 'Please enter a valid 4-digit vehicle number');
    return;
  }

  setVehicleNumbers(prev => ({
    ...prev,
    [requestId]: [...(prev[requestId] || []), vehicleNumber]
  }));

  setCurrentVehicleInput(prev => ({
    ...prev,
    [requestId]: ''
  }));
};

const handleRemoveVehicle = (requestId: string, vehicleNumber: string) => {
  setVehicleNumbers(prev => ({
    ...prev,
    [requestId]: prev[requestId]?.filter(v => v !== vehicleNumber) || []
  }));
};

// Handle batch slip upload (you'll need to implement file picker)
const handleBatchSlipUpload = async (requestId: string) => {
      try {
      const result: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });
      const res = result[0];
      setBatchSlips(res);
      console.log('==res===', batchSlips);
    } catch (err) {
      console.log('======err2===', err);
      if (DocumentPicker.isCancel(err)) {
        showSnackbar('No document selected');
      } else {
        throw err;
      }
    }



      if (!batchSlips) {
        return;
      }


      let urlOfS = `${appConfig.API_URL}/v1/auth/projects/${
        loggedInUser.projectId
      }/material-requests/items/${route.params?.item?.items[0]?.testMaterialId}/upload-batch-slip`;
      if (batchSlips.size < 5000000) {
        let data = new FormData();
        data.append('file', batchSlips);
        try {
          const responseOfFileUpload = await fetch(urlOfS, {
            method: 'POST',
            headers: {
              Authorization: appConfig.getToken(),
            },
            body: data,
          });
          console.log('===responseOfFileUpload====', responseOfFileUpload);
          if (responseOfFileUpload.status == 200) {
            let responseInJs = await responseOfFileUpload.json();
            console.log('===responseInJs====', responseInJs);
            let fileName = responseInJs.data.fileUrl; // file name which will be        sent from backend
            setfileUrlData(fileName)
            showSnackbar('Upload Succesfull');
            setBatchSlips(null);
          } else {
            showSnackbar('Upload Failed');
          }
        } catch (err) {
          console.log('========err==', err);
          showSnackbar('Upload Failed');
          console.log(err, 'error in upload');
        }
      } else {
        showSnackbar('File size should not exceed 4 MB');
      }
};

// Handle mix design selection
const handleMixDesignChange = (requestId: string, value: string) => {
  setSelectedMixDesigns(prev => ({
    ...prev,
    [requestId]: value
  }));
};

// Handle quantity issued change
const handleQtyIssuedChange = (requestId: string, value: string) => {
  setQtyIssued(prev => ({
    ...prev,
    [requestId]: value
  }));
};

// Handle batch number change
const handleBatchNumberChange = (requestId: string, value: string) => {
  setBatchNumbers(prev => ({
    ...prev,
    [requestId]: value
  }));
};

// Updated dispatch function with proper API payload
const handleDispatchSingleMaterial = (request: any) => {
  const requestId = request._id;
  const issiedQty = qtyIssued[requestId];
  const selectedMixDesign = selectedMixDesigns[requestId];
  const vehicleList = vehicleNumbers[requestId] || [];
  const batchNo = batchNumbers[requestId];

  // Validation
  if (!issiedQty || parseFloat(issiedQty) <= 0) {
    Alert.alert('Error', 'Please enter a valid quantity to issue');
    return;
  }

  // if (!selectedMixDesign) {
  //   Alert.alert('Error', 'Please select a mix design');
  //   return;
  // }

  if (vehicleList.length === 0) {
    Alert.alert('Error', 'Please add at least one vehicle number');
    return;
  }

  if (!batchNo) {
    Alert.alert('Error', 'Please enter batch number');
    return;
  }

  // Create API payload
  const payload = {
    qty_issued: parseFloat(issiedQty),
    vehicleDetails: vehicleList.map(vehicle => (vehicle)),
    batchNo: batchNo,
    batchSlip: fileUrlData || '', // File path or base64
    comments_issued: remarks,
    mixDesign: [{
      mixDesignName: selectedMixDesign,
      mixDesignId: selectedMixDesigns?._id || selectedMixDesigns?.id,
      qty: parseFloat(issiedQty)
    }]
  };

  console.log('Dispatch Payload:', payload);

  dispatch(
    patchDispatchRequest({
      projectId: loggedInUser.projectId,
      id: route.params?.item?.id,
      body: payload,
    })
  );
};




//File Upload Code
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
            {route.params?.item?.items?.map((request: any, index: number) => {
              const requestId = request._id;
              return (
                <View key={requestId || index} style={styles.mainContainerDispatch}>
                  {/* Header Information */}
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
                        <Text style={styles.fieldValue}>{request?.testWorkCategoryType || 'NA'}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.columnContainer}>
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Requested By</Text>
                        <Text style={styles.fieldValue}>{request?.name || 'NA'}</Text>
                      </View>
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Request Date</Text>
                        <Text style={styles.fieldValue}>{new Date(request?.createdAt).toLocaleDateString()}</Text>
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

                  <View style={styles.columnContainer}>
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Qty requested</Text>
                        <Text style={styles.fieldValue}>{request?.qty_requested || 0}</Text>
                      </View>
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Qty Approved</Text>
                        <Text style={styles.fieldValue}>{request?.qty_approved || request?.qty_requested || 0}</Text>
                      </View>
                  </View>

                  {/* Mix Design Details Section */}
                  <View style={styles.mixDesignSection}>
                    <Text style={styles.mixDesignTitle}>Mix Design Details</Text>
                    
                    <View style={styles.mixDesignRow}>
                      <View style={styles.mixDesignDropdown}>
                        <TouchableOpacity
                          onPress={() => getAvailableSources(request.testMaterialId)}>
                          <DropdownPicker
                            label={'Mix Design Details*'}
                            items={qualityMixDesignListInfo}
                            value={selectedMixDesigns[requestId] || ''}
                            onChange={(value: any) => handleMixDesignChange(requestId, value)}
                            placeholder="Select"
                          />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.qtyIssuedContainer}>
                        <Text style={styles.qtyIssuedLabel}>Qty issued*</Text>
                        <TextInput
                          style={styles.qtyIssuedInput}
                          placeholder="Qty issued*"
                          keyboardType="decimal-pad"
                          value={qtyIssued[requestId] || ''}
                          onChangeText={(value) => handleQtyIssuedChange(requestId, value)}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Vehicle Details Section */}
                  <View style={styles.vehicleSection}>
                    <Text style={styles.vehicleSectionTitle}>Vehicle No (Last 4 digit)</Text>
                    
                    <View style={styles.vehicleInputRow}>
                      <TextInput
                        style={styles.vehicleInput}
                        placeholder="Enter last 4 digit"
                        keyboardType="numeric"
                        maxLength={4}
                        value={currentVehicleInput[requestId] || ''}
                        onChangeText={(value) => setCurrentVehicleInput(prev => ({
                          ...prev,
                          [requestId]: value
                        }))}
                      />
                      <TouchableOpacity 
                        style={styles.addVehicleButton}
                        onPress={() => handleAddVehicle(requestId)}
                      >
                        <Text style={styles.addVehicleButtonText}>+ Add</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Added Vehicles Display */}
                    {vehicleNumbers[requestId]?.length > 0 && (
                      <View style={styles.addedVehiclesContainer}>
                        <Text style={styles.addedVehiclesTitle}>Added Vehicles</Text>
                        <View style={styles.vehicleTagsContainer}>
                          {vehicleNumbers[requestId].map((vehicle, vehicleIndex) => (
                            <View key={vehicleIndex} style={styles.vehicleTag}>
                              <Text style={styles.vehicleTagText}>{vehicle}</Text>
                              <TouchableOpacity 
                                style={styles.removeVehicleButton}
                                onPress={() => handleRemoveVehicle(requestId, vehicle)}
                              >
                                <Text style={styles.removeVehicleButtonText}>×</Text>
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Batch Details Section */}
                  <View style={styles.batchSection}>
                    <View style={styles.batchInputContainer}>
                      <Text style={styles.batchLabel}>Batch No.</Text>
                      <TextInput
                        style={styles.batchInput}
                        placeholder="Enter batch number"
                        value={batchNumbers[requestId] || ''}
                        onChangeText={(value) => handleBatchNumberChange(requestId, value)}
                      />
                    </View>

                    <View style={styles.batchSlipContainer}>
                      <Text style={styles.batchSlipLabel}>Upload Batch Slip</Text>
                      <TouchableOpacity 
                        style={styles.batchSlipButton}
                        onPress={() => handleBatchSlipUpload(requestId)}
                      >
                        <Text style={styles.batchSlipIcon}>📄</Text>
                        <Text style={styles.batchSlipText}>
                          {batchSlips?.name || 'Select Batch Slip'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Remarks Section */}
                  <View style={styles.remarksSection}>
                    <Text style={styles.remarksLabel}>Remarks</Text>
                    <TextInput
                      style={styles.remarksInput}
                      placeholder="Enter remarks..."
                      multiline
                      numberOfLines={3}
                      value={remarks}
                      onChangeText={setRemarks}
                    />
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => navigation.goBack()}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.dispatchButton}
                      onPress={() => handleDispatchSingleMaterial(request)}
                    >
                      <Text style={styles.dispatchButtonText}>Dispatch</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        )}
        {status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL && (
          <>
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
          
            <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit('approve')}>
              <Text style={styles.submitButtonText}>
                Approve Material
              </Text>
            </TouchableOpacity>
          </>
        )
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

  mainContainerDispatch: {
    flexDirection: 'column',
    gap: 10,
    backgroundColor: '#ffffff',
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


  materialDetailsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#f8f9fa',
  padding: 12,
  borderRadius: 8,
  marginBottom: 12,
},
materialDetailItem: {
  flex: 1,
  marginHorizontal: 4,
},
materialDetailLabel: {
  fontSize: 12,
  color: '#666',
  marginBottom: 4,
  fontWeight: '500',
},
materialDetailValue: {
  fontSize: 14,
  fontWeight: '600',
  color: '#333',
},
quantityRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#f8f9fa',
  padding: 12,
  borderRadius: 8,
  marginBottom: 16,
},
quantityItem: {
  flex: 1,
  alignItems: 'center',
},
quantityLabel: {
  fontSize: 12,
  color: '#666',
  marginBottom: 4,
  fontWeight: '500',
},
quantityValue: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},
mixDesignSection: {
  marginBottom: 16,
},
mixDesignTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
  marginBottom: 12,
},
mixDesignRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 12,
},
mixDesignDropdown: {
  flex: 1,
},
qtyIssuedContainer: {
  flex: 1,
},
qtyIssuedLabel: {
  fontSize: 14,
  color: '#333',
  marginBottom: 5,
  fontWeight: '500',
},
qtyIssuedInput: {
  height: 44,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  paddingHorizontal: 12,
  fontSize: 16,
  backgroundColor: 'white',
},
vehicleSection: {
  marginBottom: 16,
},
vehicleSectionTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
  marginBottom: 12,
},
vehicleInputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  marginBottom: 16,
},
vehicleInput: {
  flex: 1,
  height: 44,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  paddingHorizontal: 12,
  fontSize: 16,
  backgroundColor: 'white',
},
addVehicleButton: {
  backgroundColor: '#5A2AAF',
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 8,
  minHeight: 48,
  justifyContent: 'center',
},
addVehicleButtonText: {
  color: 'white',
  fontWeight: '600',
  fontSize: 14,
},
addedVehiclesContainer: {
  marginTop: 8,
},
addedVehiclesTitle: {
  fontSize: 14,
  color: '#666',
  marginBottom: 8,
  fontWeight: '500',
},
vehicleTagsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
},
vehicleTag: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#e9ecef',
  borderRadius: 20,
  paddingHorizontal: 12,
  paddingVertical: 6,
},
vehicleTagText: {
  fontSize: 14,
  color: '#333',
  marginRight: 8,
  fontWeight: '500',
},
removeVehicleButton: {
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: '#dc3545',
  justifyContent: 'center',
  alignItems: 'center',
},
removeVehicleButtonText: {
  color: 'white',
  fontSize: 12,
  fontWeight: 'bold',
  lineHeight: 12,
},
batchSection: {
  marginBottom: 16,
},
batchInputContainer: {
  marginBottom: 16,
},
batchLabel: {
  fontSize: 14,
  color: '#333',
  marginBottom: 8,
  fontWeight: '500',
},
batchInput: {
  height: 44,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  paddingHorizontal: 12,
  fontSize: 16,
  backgroundColor: 'white',
},
batchSlipContainer: {
  marginBottom: 7,
},
batchSlipLabel: {
  fontSize: 14,
  color: '#333',
  marginBottom: 8,
  fontWeight: '500',
},
batchSlipButton: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 16,
  borderWidth: 2,
  borderColor: '#ddd',
  borderStyle: 'dashed',
  borderRadius: 8,
  backgroundColor: '#f8f9fa',
  justifyContent: 'center',
  minHeight: 60,
},
batchSlipIcon: {
  fontSize: 24,
  marginRight: 8,
},
batchSlipText: {
  fontSize: 16,
  color: '#666',
  fontWeight: '500',
},
remarksSection: {
  marginBottom: 20,
},
remarksLabel: {
  fontSize: 14,
  color: '#333',
  marginBottom: 8,
  fontWeight: '500',
},
remarksInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 12,
  fontSize: 16,
  textAlignVertical: 'top',
  minHeight: 80,
  backgroundColor: 'white',
},
actionButtonsContainer: {
  flexDirection: 'row',
  gap: 12,
  marginTop: 16,
},
cancelButton: {
  flex: 1,
  height: 48,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 24,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
},
cancelButtonText: {
  fontSize: 16,
  color: '#666',
  fontWeight: '600',
},
dispatchButton: {
  flex: 1,
  height: 48,
  backgroundColor: '#5A2AAF',
  borderRadius: 24,
  justifyContent: 'center',
  alignItems: 'center',
},
dispatchButtonText: {
  fontSize: 16,
  color: 'white',
  fontWeight: 'bold',
},
});

export default MaterialApprovalProduction;
