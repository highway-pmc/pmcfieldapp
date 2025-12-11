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
  ActivityIndicator,
} from 'react-native';
import {HeaderItems, MATERIAL_REQUEST_STATUS} from '../../constants/constants';
import DropdownPicker from '../../components/UI/DropdownPicker';
import {
  patchDispatchRequest,
  patchMaterialRequestStatus,
  dispatchProductionRequest,
  clearMaterialRequest,
} from '../ManageUsers/actions';
import {useDispatch, useSelector} from 'react-redux';
import {useSnackbar} from '../../context/SnackbarContext';
import {getMixDesignListInfo} from '../RFIs/actions';
import DocumentPicker from 'react-native-document-picker';
import appConfig from '../../common/app.config';

const MaterialApprovalProduction = ({route, navigation}: any) => {
  const {status, item} = route.params || {};

  if (!item) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#4E36A3" />
      </View>
    );
  }

  // Local State
  const [qtyApproved, setQtyApproved] = useState<{[key: string]: string}>({});
  const [qtyIssued, setQtyIssued] = useState<{[key: string]: string}>({});
  const [remarks, setRemarks] = useState<string>('');

  // Mix Design State
  const [mixDesignRows, setMixDesignRows] = useState<{[key: string]: any[]}>(
    {},
  );

  // Dispatch State
  const [vehicleNumbers, setVehicleNumbers] = useState<{
    [key: string]: string[];
  }>({});
  const [currentVehicleInput, setCurrentVehicleInput] = useState<{
    [key: string]: string;
  }>({});
  const [batchSlips, setBatchSlips]: any = useState(null);
  const [fileUrlData, setfileUrlData]: any = useState('');
  const [batchNumbers, setBatchNumbers] = useState<{[key: string]: string}>({});

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {showSnackbar} = useSnackbar();
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  const {
    patchMeterialRequestStatusData,
    error,
    dispatchProductionRequest: dispatchProductionRequestState,
  } = useSelector((state: any) => state.MeterialRequest);
  const {qualityMixDesignListInfo} = useSelector((state: any) => state.RFIs);

  // --- MODES DEFINITION ---
  // 1. Edit Mode: User enters Mix Design and Batch No (Status: request_for_approval)
  const isEditApprovalMode =
    status === 'request_for_approval' ||
    status === MATERIAL_REQUEST_STATUS.REQUEST_FOR_APPROVAL;

  // 2. Read-Only Mode: User Reviews and Accepts/Rejects (Status: pending_approval)
  const isPendingApprovalMode =
    status === 'pending_approval' ||
    status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL;

  // 3. Dispatch Mode: User enters vehicle details (Status: pending_dispatch)
  const isDispatchMode = status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH;

  const isDispatchedMode = status === 'dispatched';

  const mixDesignDropdownOptions = useMemo(() => {
    if (!qualityMixDesignListInfo || !Array.isArray(qualityMixDesignListInfo)) {
      return [];
    }
    return qualityMixDesignListInfo.map((item: any) => ({
      label: item.name,
      value: item._id,
      originalData: item,
    }));
  }, [qualityMixDesignListInfo]);

  useEffect(() => {
    return () => {
      dispatch(clearMaterialRequest());
    };
  }, []);

  useEffect(() => {
    if (patchMeterialRequestStatusData) {
      showSnackbar('Status updated successfully', 'success');
      navigation.goBack();
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [patchMeterialRequestStatusData, error, navigation]);

  useEffect(() => {
    if (dispatchProductionRequestState) {
      showSnackbar('Dispatched successfully', 'success');
      dispatch(clearMaterialRequest());
      navigation.goBack();
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [dispatchProductionRequestState, error]);


  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      let headerTitle = HeaderItems.materialDispatch;
      if (isEditApprovalMode || isPendingApprovalMode) {
        headerTitle = HeaderItems.materialApprove;
      }
      eventEmitter.emit('headerEvent', headerTitle);
    }
  }, [isFocused, isEditApprovalMode, isPendingApprovalMode]);

  // Load Data for Editing Mode
  useEffect(() => {
    if (isFocused && isEditApprovalMode && item?.items?.length > 0) {
      // Clear all local states
      setQtyApproved({});
      setQtyIssued({});
      setRemarks('');
      setMixDesignRows({});
      setVehicleNumbers({});
      setCurrentVehicleInput({});
      setBatchSlips(null);
      setfileUrlData('');
      setBatchNumbers({});

      const firstItem = item.items[0];
      dispatch(
        getMixDesignListInfo({
          projectId: loggedInUser.projectId,
          testWorkCategoryType: firstItem?.testWorkCategoryType,
          testMaterialId: firstItem?.testMaterialId,
        }),
      );

      // Initialize Rows
      const initialRows: any = {};
      item.items.forEach((req: any) => {
        initialRows[req._id] = [
          {id: Date.now(), selectedOption: null, qty: ''},
        ];
      });
      setMixDesignRows(initialRows);
    }
  }, [isFocused, isEditApprovalMode, item, dispatch, loggedInUser.projectId]);

  // --- Handlers ---

  const handleQtyApprovedChange = (id: string, value: string) => {
    setQtyApproved(prev => ({...prev, [id]: value}));
  };

  const handleQtyIssuedChange = (id: string, value: string) => {
    setQtyIssued(prev => ({...prev, [id]: value}));
  };

  const handleBatchNumberChange = (requestId: string, value: string) => {
    setBatchNumbers(prev => ({...prev, [requestId]: value}));
  };

  const addMixDesignRow = (requestId: string) => {
    setMixDesignRows(prev => ({
      ...prev,
      [requestId]: [
        ...(prev[requestId] || []),
        {id: Date.now(), selectedOption: null, qty: ''},
      ],
    }));
  };

  const removeMixDesignRow = (requestId: string, rowId: number) => {
    setMixDesignRows(prev => ({
      ...prev,
      [requestId]: prev[requestId].filter((r: any) => r.id !== rowId),
    }));
  };

  const updateMixDesignRow = (
    requestId: string,
    rowId: number,
    field: string,
    value: any,
  ) => {
    setMixDesignRows(prev => ({
      ...prev,
      [requestId]: prev[requestId].map((r: any) => {
        if (r.id === rowId) {
          if (field === 'mixDesign') {
            const selectedObj = mixDesignDropdownOptions.find(
              (m: any) => m.value === value,
            );
            return {...r, selectedOption: selectedObj};
          }
          if (field === 'qty') {
            return {...r, qty: value};
          }
        }
        return r;
      }),
    }));
  };

  const handleAddVehicle = (requestId: string) => {
    const vNo = currentVehicleInput[requestId]?.trim();
    if (!vNo || vNo.length < 4) {
      Alert.alert('Error', 'Please enter a valid vehicle number (min 4 chars)');
      return;
    }
    setVehicleNumbers(prev => ({
      ...prev,
      [requestId]: [...(prev[requestId] || []), vNo],
    }));
    setCurrentVehicleInput(prev => ({...prev, [requestId]: ''}));
  };

  const handleRemoveVehicle = (requestId: string, vNo: string) => {
    setVehicleNumbers(prev => ({
      ...prev,
      [requestId]: prev[requestId]?.filter(v => v !== vNo) || [],
    }));
  };

  const handleBatchSlipUpload = async (requestId: string) => {
    try {
      const result: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });
      const res = result[0];
      setBatchSlips(res);

      let url = `${appConfig.API_URL}/v1/auth/projects/${loggedInUser.projectId}/material-requests/items/${requestId}/upload-batch-slip`;
      let data = new FormData();
      data.append('file', res);

      const response = await fetch(url, {
        method: 'POST',
        headers: {Authorization: appConfig.getToken()},
        body: data,
      });

      if (response.status === 200) {
        let json = await response.json();
        setfileUrlData(json.data.fileUrl);
        showSnackbar('Batch slip uploaded successfully', 'success');
      } else {
        showSnackbar('Upload Failed', 'error');
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        showSnackbar('Error picking file', 'error');
      }
    }
  };

  // --- SUBMIT: Request For Approval -> Pending Approval ---
  const handleSubmitForApproval = () => {
    const approvalData = item?.items?.map((req: any) => {
      const mId = req._id;
      const totalApprovedQty = qtyApproved[mId]
        ? Number(qtyApproved[mId])
        : Number(req.qty_requested);
      const batchNo = batchNumbers[mId];
      const rows = mixDesignRows[mId] || [];

      const totalMixQty = rows.reduce(
        (sum: number, row: any) => sum + Number(row.qty || 0),
        0,
      );

      if (totalMixQty !== totalApprovedQty) {
        Alert.alert(
          'Validation Warning',
          `Total Mix Design Qty (${totalMixQty}) does not match Approved Qty (${totalApprovedQty})`,
        );
      }

      const mixDesignPayload = rows
        .map((row: any) => ({
          mixDesignId: row.selectedOption?.value,
          mixDesignName: row.selectedOption?.label,
          qtyRequest: Number(row.qty),
          qtyApproved: Number(row.qty),
        }))
        .filter((md: any) => md.mixDesignId);

      if (mixDesignPayload.length === 0) {
        Alert.alert(
          'Error',
          `Please select Mix Design for ${req.testMaterialType}`,
        );
        throw new Error('Missing Mix Design');
      }

      return {
        materialRequestItemId: mId,
        quantityApproved: totalApprovedQty,
        mixDesign: mixDesignPayload,
      };
    });

    const payload = {
      status: MATERIAL_REQUEST_STATUS.PENDING_APPROVAL,
      comments: remarks,
      approvalData: approvalData,
    };

    dispatch(
      patchMaterialRequestStatus({
        projectId: loggedInUser.projectId,
        id: item?.id,
        body: payload,
      }),
    );
  };

  // --- ACTION: Pending Approval -> Pending Dispatch (Accept) ---
  const handlePendingAccept = () => {
    const payload = {
      status: MATERIAL_REQUEST_STATUS.PENDING_DISPATCH,
      comments: remarks || 'Accepted via App',
      // We send the existing items data back to confirm current state or simple status update
      // Based on typical flow, just status and comments are usually enough if data is already saved
      approvalData: item?.items?.map((req: any) => ({
        materialRequestItemId: req._id,
        quantityApproved: req.qty_approved,
        mixDesign: req.mixDesign, // Pass through existing mix design
      })),
    };

    dispatch(
      patchMaterialRequestStatus({
        projectId: loggedInUser.projectId,
        id: item?.id,
        body: payload,
      }),
    );
  };

  // --- ACTION: Pending Approval -> Rejected ---
  const handlePendingReject = () => {
    const payload = {
      status: MATERIAL_REQUEST_STATUS.REJECTED,
      comments: remarks,
    };

    dispatch(
      patchMaterialRequestStatus({
        projectId: loggedInUser.projectId,
        id: item?.id,
        body: payload,
      }),
    );
  };

  // --- SUBMIT: Pending Dispatch -> Dispatched ---
  const handleDispatchSubmit = (request: any) => {
    console.log('Dispatching request:', request);
    const rId = request._id;
    const qIssued = qtyIssued[rId];
    const vList = vehicleNumbers[rId] || [];

    if (!qIssued) {
      Alert.alert('Error', 'Enter Qty Issued');
      return;
    }
    if (vList.length === 0) {
      Alert.alert('Error', 'Add at least one vehicle');
      return;
    }

    const payload = {
      qty_issued: Number(qIssued),
      vehicleDetails: vList,
      batchSlip: fileUrlData || '',
      comments_issued: remarks,
      batchNo: batchNumbers[rId],
      requestId: request?.materialRequestId,
    };
    dispatch(
      dispatchProductionRequest({
        projectId: loggedInUser.projectId,
        itemId: rId,
        body: payload,
      }),
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>
          {isDispatchMode ? 'Dispatch Material' : 'Production Approval'}
        </Text>

        {item?.items?.map((request: any, index: number) => {
          const requestId = request._id;
          return (
            <View key={requestId || index} style={styles.itemCard}>
              {/* Header Info */}
              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.labelStatic}>Material</Text>
                  <Text style={styles.valueStatic}>
                    {request?.testMaterialType}
                  </Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.labelStatic}>Category</Text>
                  <Text style={styles.valueStatic}>
                    {request?.testWorkCategoryType}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.labelStatic}>Requested Qty</Text>
                  <Text style={styles.valueStatic}>
                    {request?.qty_requested} {request?.unit}
                  </Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.labelStatic}>Date</Text>
                  <Text style={styles.valueStatic}>
                    {new Date(request?.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* === MODE 1: READ ONLY (Pending Approval) === */}
              {isPendingApprovalMode && (
                <View style={styles.readOnlyContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.readOnlyTitle}>Approval Details</Text>

                  <View style={styles.infoRow}>
                    <View style={styles.infoCol}>
                      <Text style={styles.labelStatic}>Approved Qty</Text>
                      <Text style={[styles.valueStatic, styles.textBold]}>
                        {request.qty_approved} {request.unit}
                      </Text>
                    </View>
                    <View style={styles.infoCol}>
                      <Text style={styles.labelStatic}>Batch Number</Text>
                      <Text style={[styles.valueStatic, styles.textBold]}>
                        {request.metaData?.batchNo || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.labelStatic, {marginTop: 8}]}>
                    Mix Design Allocation:
                  </Text>
                  {request.mixDesign && request.mixDesign.length > 0 ? (
                    request.mixDesign.map((mix: any, idx: number) => (
                      <View key={idx} style={styles.readOnlyRow}>
                        <Text style={styles.readOnlyValue}>
                          • {mix.mixDesignName}
                        </Text>
                        <Text style={styles.readOnlyValue}>
                          {mix.qtyApproved} {request.unit}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.valueStatic}>
                      No Mix Design Assigned
                    </Text>
                  )}
                </View>
              )}

              {/* === MODE 2: EDITING (Request For Approval) === */}
              {isEditApprovalMode && (
                <View style={styles.actionSection}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Total Qty Approved *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={
                        qtyApproved[requestId] ?? String(request.qty_requested)
                      }
                      onChangeText={val =>
                        handleQtyApprovedChange(requestId, val)
                      }
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.tableContainer}>
                    <Text style={styles.inputLabel}>
                      Mix Design Allocation *
                    </Text>

                    {(mixDesignRows[requestId] || []).map((row, idx) => (
                      <View key={row.id} style={styles.mixDesignRow}>
                        <View
                          style={{flex: 2, marginRight: 8, zIndex: 1000 - idx}}>
                          <DropdownPicker
                            items={mixDesignDropdownOptions}
                            value={row.selectedOption?.value || ''}
                            onChange={(val: any) =>
                              updateMixDesignRow(
                                requestId,
                                row.id,
                                'mixDesign',
                                val,
                              )
                            }
                            placeholder="Select Mix"
                            containerStyle={{height: 45}}
                          />
                        </View>
                        <View style={{flex: 1}}>
                          <TextInput
                            style={styles.textInputSmall}
                            placeholder="Qty"
                            keyboardType="numeric"
                            value={row.qty}
                            onChangeText={val =>
                              updateMixDesignRow(requestId, row.id, 'qty', val)
                            }
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => removeMixDesignRow(requestId, row.id)}
                          style={styles.removeBtn}>
                          <Text style={styles.removeBtnText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    <TouchableOpacity
                      style={styles.addMoreBtn}
                      onPress={() => addMixDesignRow(requestId)}>
                      <Text style={styles.addMoreText}>+ Add Mix Design</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* === MODE 3: DISPATCH === */}
              {isDispatchMode && (
                <View style={styles.actionSection}>
                  <View style={styles.infoRow}>
                    <Text style={styles.highlightText}>
                      Approved: {request.qty_approved} | Batch:{' '}
                      {request.metaData?.batchNo || 'N/A'}
                    </Text>
                  </View>

                  {request.mixDesign && request.mixDesign.length > 0 && (
                    <View style={styles.mixDisplayContainer}>
                      {request.mixDesign.map((md: any, i: number) => (
                        <Text key={i} style={styles.mixDisplayText}>
                          • {md.mixDesignName}: {md.qtyApproved}
                        </Text>
                      ))}
                    </View>
                  )}

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Qty Issued *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Actual Qty Issued"
                      value={qtyIssued[requestId] || ''}
                      onChangeText={val =>
                        handleQtyIssuedChange(requestId, val)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Batch No (For Item) *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter Batch Number"
                      value={batchNumbers[requestId] || ''}
                      onChangeText={val =>
                        handleBatchNumberChange(requestId, val)
                      }
                    />
                  </View>

                  <View style={styles.vehicleWrapper}>
                    <Text style={styles.inputLabel}>
                      Vehicles (Last 4 Digits)
                    </Text>
                    <View style={styles.rowInputBtn}>
                      <TextInput
                        style={[styles.textInput, {flex: 1}]}
                        placeholder="Ex: 8844"
                        maxLength={4}
                        keyboardType="numeric"
                        value={currentVehicleInput[requestId] || ''}
                        onChangeText={val =>
                          setCurrentVehicleInput(prev => ({
                            ...prev,
                            [requestId]: val,
                          }))
                        }
                      />
                      <TouchableOpacity
                        onPress={() => handleAddVehicle(requestId)}
                        style={styles.btnSmall}>
                        <Text style={styles.btnSmallText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.tagContainer}>
                      {(vehicleNumbers[requestId] || []).map((v, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => handleRemoveVehicle(requestId, v)}
                          style={styles.tag}>
                          <Text style={styles.tagText}>{v} ✕</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <TouchableOpacity
                      onPress={() => handleBatchSlipUpload(requestId)}
                      style={styles.uploadBtn}>
                      <Text style={styles.uploadBtnText}>
                        {fileUrlData
                          ? 'Batch Slip Uploaded ✅'
                          : '📄 Upload Batch Slip'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.dispatchBtnItem}
                    onPress={() => handleDispatchSubmit(request)}>
                    <Text style={styles.btnTextWhite}>Dispatch This Item</Text>
                  </TouchableOpacity>
                </View>
              )}

              {isDispatchedMode && (
                <View style={styles.actionSection}>
                  <View style={styles.infoRow}>
                    <Text style={styles.highlightText}>
                      Dispatched Qty: {request.metaData?.qty_issued}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.highlightText}>
                      Batch No: {request.metaData?.batchNo}
                    </Text>
                  </View>

                  {request.metaData?.vehicleDetails &&
                    request.metaData?.vehicleDetails.length > 0 && (
                      <View style={styles.vehicleWrapper}>
                        <Text style={styles.inputLabel}>Vehicles</Text>
                        <View style={styles.tagContainer}>
                          {request.metaData?.vehicleDetails.map(
                            (v: any, i: number) => (
                              <View key={i} style={styles.tag}>
                                <Text style={styles.tagText}>{v}</Text>
                              </View>
                            ),
                          )}
                        </View>
                      </View>
                    )}
                </View>
              )}
            </View>
          );
        })}

        {/* --- FOOTERS --- */}

        {/* 1. Footer for READ ONLY (Accept/Reject) */}
        {isPendingApprovalMode && (
          <View style={styles.footerSection}>
            <Text style={styles.inputLabel}>Remarks</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Comments (optional)..."
              multiline
              value={remarks}
              onChangeText={setRemarks}
            />
            <View style={styles.doubleBtnContainer}>
              <TouchableOpacity
                style={[styles.halfBtn, styles.rejectBtn]}
                onPress={handlePendingReject}>
                <Text style={styles.btnTextWhite}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.halfBtn, styles.acceptBtn]}
                onPress={handlePendingAccept}>
                <Text style={styles.btnTextWhite}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 2. Footer for EDITING (Submit) */}
        {isEditApprovalMode && (
          <View style={styles.footerSection}>
            <Text style={styles.inputLabel}>Remarks</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Optional comments..."
              multiline
              value={remarks}
              onChangeText={setRemarks}
            />
            <TouchableOpacity
              style={styles.mainSubmitBtn}
              onPress={handleSubmitForApproval}>
              <Text style={styles.btnTextWhite}>Submit For Approval</Text>
            </TouchableOpacity>
          </View>
        )}
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoCol: {
    flex: 1,
  },
  labelStatic: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  valueStatic: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  textBold: {
    fontWeight: 'bold',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  readOnlyContainer: {
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  readOnlyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  readOnlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingLeft: 8,
  },
  readOnlyValue: {
    fontSize: 13,
    color: '#333',
  },
  highlightText: {
    fontSize: 13,
    color: '#5A2AAF',
    fontWeight: '600',
    backgroundColor: '#F3E5F5',
    padding: 6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actionSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  textInputSmall: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fafafa',
    color: '#333',
    height: 45,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  tableContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  mixDesignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeBtn: {
    width: 30,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  removeBtnText: {
    fontSize: 18,
    color: '#ff4444',
    fontWeight: 'bold',
  },
  addMoreBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#5A2AAF',
    borderStyle: 'dashed',
    borderRadius: 6,
    marginTop: 4,
  },
  addMoreText: {
    color: '#5A2AAF',
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleWrapper: {
    marginBottom: 12,
  },
  rowInputBtn: {
    flexDirection: 'row',
    gap: 8,
  },
  btnSmall: {
    backgroundColor: '#5A2AAF',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnSmallText: {
    color: '#fff',
    fontWeight: '600',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
  uploadBtn: {
    borderWidth: 1,
    borderColor: '#5A2AAF',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
  },
  uploadBtnText: {
    color: '#5A2AAF',
    fontWeight: '500',
  },
  mixDisplayContainer: {
    marginBottom: 10,
    paddingLeft: 4,
  },
  mixDisplayText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  footerSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  mainSubmitBtn: {
    backgroundColor: '#5A2AAF',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
    elevation: 3,
  },
  dispatchBtnItem: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  btnTextWhite: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Double Button Styles
  doubleBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  halfBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  acceptBtn: {
    backgroundColor: '#28a745',
  },
  rejectBtn: {
    backgroundColor: '#dc3545',
  },
});

export default MaterialApprovalProduction;
