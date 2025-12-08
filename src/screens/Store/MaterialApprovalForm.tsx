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
import {
  getSourceApprovals,
  patchDispatchRequest,
  patchMaterialRequestStatus,
} from '../ManageUsers/actions';
import {useDispatch, useSelector} from 'react-redux';
import {useSnackbar} from '../../context/SnackbarContext';

const MaterialApprovalForm = ({route, navigation}) => {
  const {status} = route.params?.item || {};

  // flags
  const isProcurementStage =
    status === MATERIAL_REQUEST_STATUS.REQUEST_FOR_APPROVAL;
  const isReadOnlyApprovalStage =
    status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL;
  const isApprovalStage = isProcurementStage || isReadOnlyApprovalStage;
  const isDispatchStage = status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH;

  const [remarks, setRemarks] = useState<string>('');
  const [dispatchSources, setDispatchSources] = useState<any[]>([]);
  const [localApprovals, setLocalApprovals] = useState<any[]>([]);
  const [approvedQty, setApprovedQty] = useState<
    Record<string, string | number>
  >({});

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {showSnackbar} = useSnackbar();
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const {
    patchMeterialRequestStatusData,
    loading: any,
    error,
  } = useSelector((state: any) => state.MeterialRequest);
  const {sourceApprovals} = useSelector((state: any) => state.SourceApprovals);

  // toast from redux
  useEffect(() => {
    if (patchMeterialRequestStatusData) {
      showSnackbar('Meterial status updated successfully', 'success');
    } else if (error) {
      showSnackbar(error, 'error');
    }
  }, [patchMeterialRequestStatusData, error]);

  // header
  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit(
        'headerEvent',
        isDispatchStage
          ? HeaderItems.materialDispatch
          : HeaderItems.materialApprove,
      );
    }
  }, [isFocused, isDispatchStage]);

  // initialise source rows: one row per material (only needed in procurement editable stage)
  useEffect(() => {
    if (
      isProcurementStage &&
      route.params?.item?.items?.length > 0 &&
      localApprovals.length === 0
    ) {
      const initialApprovals = route.params.item.items.map((request: any) => ({
        id: `${request._id || request.testMaterialId}_${Date.now()}`,
        testMaterialId: request.testMaterialId || request._id,
        name: '',
        quantity: '',
      }));
      setLocalApprovals(initialApprovals);
    }
  }, [route.params?.item?.items, localApprovals.length, isProcurementStage]);

  // Details for top card (no hard-coded data)
  const detailsData = useMemo(() => {
    const firstItem = route.params?.item?.items?.[0];
    if (!firstItem) return [];

    const unit = firstItem?.unit || '';

    const data: any[] = [
      {label: 'Material Name', value: firstItem?.testMaterialType || '-'},
      {label: 'Category', value: firstItem?.testMaterialCategory || '-'},
      {
        label: 'Work Category',
        value: firstItem?.testWorkCategoryType || '-',
      },
      {label: 'Unit', value: unit || '-'},
      {
        label: 'Qty Requested',
        value: (firstItem?.qty_requested ?? '-') + (unit ? ` ${unit}` : ''),
      },
      {type: 'divider' as const},
      {label: 'Task Details', value: route.params?.item?.taskPath ?? '-'},
      {label: 'Requested by', value: route.params?.item?.requestedBy ?? '-'},
      {
        label: 'Request Date',
        value: firstItem?.createdAt ?? '-',
      },
    ];
    return data;
  }, [route.params?.item]);

  const handleQtyChange = (id: string, value: string) => {
    setApprovedQty(prev => ({...prev, [id]: value}));
  };

  // Fetch available sources from backend (no hard-coded sources)
  const getAvailableSources = (currentMaterialId: any) => {
    dispatch(
      getSourceApprovals({
        projectId: loggedInUser.projectId,
        testMaterialId: currentMaterialId,
      }),
    );
    const allSources =
      sourceApprovals
        ?.filter((opt: any) => opt.testMaterialId === currentMaterialId)
        ?.map((opt: any) => ({
          label: opt.name,
          value: opt.name,
        })) ?? [];

    setDispatchSources(allSources);
  };

  const handleSourceChange = (newValue: string, rowId: string) => {
    setLocalApprovals(prev =>
      prev.map(row => (row.id === rowId ? {...row, name: newValue} : row)),
    );
  };

  const handleQuantityChange = (value: string, rowId: string) => {
    setLocalApprovals(prev =>
      prev.map(row => (row.id === rowId ? {...row, quantity: value} : row)),
    );
  };

  const handleRemoveSourceRow = (id: string, materialId: any) => {
    const materialRows = localApprovals?.filter(
      row => row.testMaterialId === materialId,
    );
    if (materialRows.length <= 1) return;

    setLocalApprovals(prev => prev?.filter(row => row.id !== id));
  };

  const totalSourceQuantityForMaterial = (materialId: any) => {
    return localApprovals
      ?.filter(row => row.testMaterialId === materialId)
      ?.reduce((total, row) => total + (parseFloat(row.quantity) || 0), 0);
  };

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

  const getSourceRowsForMaterial = (materialId: any) => {
    return localApprovals?.filter(row => row.testMaterialId === materialId);
  };

  // SUBMIT: REQUEST_FOR_APPROVAL -> PENDING_APPROVAL (procurement)
  const handleSubmit = (type: 'approve' | 'dispatch') => {
    // 1) REQUEST_FOR_APPROVAL stage (procurement) → send full approvalData with sources
    if (isProcurementStage && type === 'approve') {
      const approvalData =
        route.params?.item?.items?.map((req: any) => {
          const materialSources = localApprovals.filter(
            row => row.testMaterialId === req.testMaterialId,
          );
          const approvedQtyForMaterial = Number(
            approvedQty[req._id] ?? req.qty_requested,
          );

          // backend needs: sourceApprovalId, sourceName, qtyRequest
          const backendSourcesForMaterial = sourceApprovals?.filter(
            (s: any) => s.testMaterialId === req.testMaterialId,
          );

          const source = materialSources.map(row => {
            const matched = backendSourcesForMaterial?.find(
              (s: any) => s.name === row.name,
            );
            return {
              sourceApprovalId: matched?._id,
              sourceName: row.name,
              qtyRequest: Number(row.quantity) || 0,
            };
          });

          return {
            materialRequestItemId: req._id,
            quantityApproved: approvedQtyForMaterial,
            source,
          };
        }) ?? [];

      const payload = {
        status: MATERIAL_REQUEST_STATUS.PENDING_APPROVAL,
        comments: remarks,
        approvalData,
      };

      dispatch(
        patchMaterialRequestStatus({
          projectId: loggedInUser.projectId,
          id: route.params?.item?.id,
          body: payload,
        }),
      );

      Alert.alert('Success', 'Approval submitted successfully!');
      return;
    }

    // 2) existing flow for other stages
    const payload = {
      status:
        type === 'dispatch'
          ? MATERIAL_REQUEST_STATUS.DISPATCHED
          : MATERIAL_REQUEST_STATUS.PENDING_DISPATCH,
      comments: remarks,
      approvalData: route.params?.item?.items?.map((req: any) => ({
        materialRequestItemId: req._id,
        quantityApproved: approvedQty[req._id] ?? Number(req.qty_requested),
      })),
    };

    dispatch(
      patchMaterialRequestStatus({
        projectId: loggedInUser.projectId,
        id: route.params?.item?.id,
        body: payload,
      }),
    );

    Alert.alert('Success', 'Form has been submitted successfully!');
  };

  // FINAL DECISION: PENDING_APPROVAL (read-only) -> PENDING_DISPATCH or REJECTED
  const handleFinalApprovalDecision = (action: 'accept' | 'reject') => {
    const {item} = route.params || {};
    const items = item?.items || [];

    // REJECT: only change status + comments (no approvalData)
    if (action === 'reject') {
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

      Alert.alert('Success', 'Request rejected successfully!');
      return;
    }

    // ACCEPT: move PENDING_APPROVAL -> PENDING_DISPATCH with approvalData
    const approvalData =
      items?.map((req: any) => {
        const base: any = {
          materialRequestItemId: req._id,
          // use qty_approved if backend already set it, otherwise fallback to requested
          quantityApproved:
            typeof req.qty_approved === 'number'
              ? req.qty_approved
              : Number(req.qty_requested ?? 0),
        };

        // PRODUCTION FLOW: mixDesign + batchNo
        if (Array.isArray(req.mixDesign) && req.mixDesign.length > 0) {
          base.mixDesign = req.mixDesign.map((md: any) => ({
            mixDesignId: md.mixDesignId, // backend will wrap with ObjectId
            mixDesignName: md.mixDesignName,
            qtyRequest: md.qtyRequest,
            // for final approval, mirror request as approved if no separate field exists
            qtyApproved: md.qtyApproved ?? md.qtyRequest,
          }));

          // batchNo goes separately at top level in helper
          base.batchNo = req.metaData?.batchNo ?? null;
        }
        // PROCUREMENT FLOW: source[]
        else if (Array.isArray(req.source) && req.source.length > 0) {
          base.source = req.source.map((src: any) => ({
            sourceApprovalId: src.sourceApprovalId, // backend wraps with ObjectId
            sourceName: src.sourceName,
            qtyRequest: src.qtyRequest,
            // mirror request as approved if not present
            qtyApproved: src.qtyApproved ?? src.qtyRequest,
          }));
        }

        return base;
      }) ?? [];

    const payload = {
      status: MATERIAL_REQUEST_STATUS.PENDING_DISPATCH,
      comments: remarks,
      approvalData,
    };

    dispatch(
      patchMaterialRequestStatus({
        projectId: loggedInUser.projectId,
        id: item?.id,
        body: payload,
      }),
    );

    Alert.alert('Success', 'Request accepted successfully!');
  };

  // Dispatch single material
  const handleDispatchSingleMaterial = (request: any) => {
    const materialSources = localApprovals?.filter(
      row => row.testMaterialId === request.testMaterialId,
    );
    const totalQty = totalSourceQuantityForMaterial(request.testMaterialId);
    const approvedQtyForMaterial = parseFloat(
      approvedQty[request._id] ??
        String(request.qty_approved ?? request.qty_requested),
    );

    if (totalQty !== approvedQtyForMaterial) {
      Alert.alert(
        'Error',
        `Source quantities (${totalQty}) must equal approved quantity (${approvedQtyForMaterial}) for ${request.testMaterialType}`,
      );
      return;
    }

    let payload = {
      qty_issued: approvedQtyForMaterial,
      comments_issued: remarks,
      source: [
        {
          materialRequestItemId: request._id,
          quantityDispatched: approvedQtyForMaterial,
          sources: materialSources.map(source => {
            const backendSourcesForMaterial = sourceApprovals?.filter(
              (s: any) => s.testMaterialId === request.testMaterialId,
            );
            const matched = backendSourcesForMaterial?.find(
              (s: any) => s.name === source.name,
            );

            return {
              sourceName: source.name,
              sourceApprovalId: matched?._id,
              qty: parseFloat(source.quantity),
            };
          }),
        },
      ],
    };

    dispatch(
      patchDispatchRequest({
        projectId: loggedInUser.projectId,
        id: route.params?.item?.id,
        body: payload,
      }),
    );

    Alert.alert(
      'Success',
      `${request.testMaterialType} has been dispatched successfully!`,
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* you can enable this when required */}
      {/* <DetailsCard title="Material Request Details" data={detailsData} /> */}

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>
          {isDispatchStage ? 'Dispatch Details' : 'Approval Details'}
        </Text>

        {/* ------------- APPROVAL STAGE ------------- */}
        {isApprovalStage &&
          route.params?.item?.items?.length > 0 &&
          route.params?.item?.items?.map((request: any) => {
            const unit = request?.unit || '';

            return (
              <View
                style={styles.formGroup}
                key={request._id || request.testMaterialId}>
                <View style={styles.mainContainer}>
                  {/* Common header fields */}
                  <View style={styles.columnContainer}>
                    {request?.testMaterialType && (
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Material Name</Text>
                        <Text style={styles.fieldValue}>
                          {request?.testMaterialType}
                        </Text>
                      </View>
                    )}
                    {request?.testWorkCategoryType && (
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Work Category</Text>
                        <Text style={styles.fieldValue}>
                          {request?.testWorkCategoryType}
                        </Text>
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
                        <Text style={styles.fieldValue}>
                          {request?.createdAt}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* READ ONLY VIEW: PENDING_APPROVAL */}
                  {isReadOnlyApprovalStage ? (
                    <>
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Qty Requested</Text>
                        <Text style={styles.fieldValue}>
                          {request?.qty_requested} {unit}
                        </Text>
                      </View>

                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Qty Approved</Text>
                        <Text style={styles.fieldValue}>
                          {request?.qty_approved ?? request?.qty_requested}{' '}
                          {unit}
                        </Text>
                      </View>

                      {/* Source list in read-only */}
                      {Array.isArray(request?.source) &&
                        request.source.length > 0 && (
                          <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>
                              Source Allocation
                            </Text>
                            {request.source.map((s: any, idx: number) => (
                              <View key={idx} style={styles.sourceRowReadonly}>
                                <Text style={styles.sourceReadonlyText}>
                                  {s.sourceName ?? '-'}
                                </Text>
                                <Text style={styles.sourceReadonlyQty}>
                                  {s.qtyRequest ?? s.qty ?? 0} {unit}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                    </>
                  ) : (
                    <>
                      {/* EDITABLE VIEW: REQUEST_FOR_APPROVAL (procurement) */}
                      <View>
                        <Text style={styles.label}>
                          Total Qty Approve{' '}
                          <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={
                            approvedQty[request._id] ??
                            String(request.qty_requested ?? '')
                          }
                          onChangeText={val =>
                            handleQtyChange(request._id, val)
                          }
                          keyboardType="decimal-pad"
                          placeholder="Enter total approved quantity"
                        />
                        <Text style={styles.helperText}>
                          Maximum: {request?.qty_requested} {unit} (Requested
                          quantity)
                        </Text>
                      </View>

                      {/* Source mapping (procurement) */}
                      <View style={styles.sourceTableContainer}>
                        <View style={styles.tableHeader}>
                          <Text style={[styles.tableHeaderText, {flex: 2}]}>
                            Source
                          </Text>
                          <Text style={[styles.tableHeaderText, {flex: 1.2}]}>
                            Quantity
                          </Text>
                          <View style={{width: 30}} />
                        </View>

                        {getSourceRowsForMaterial(request.testMaterialId)?.map(
                          row => {
                            const selectedNames = localApprovals
                              ?.filter(
                                r =>
                                  r.id !== row.id &&
                                  r.name &&
                                  r.testMaterialId === request.testMaterialId,
                              )
                              ?.map(r => r.name);

                            const availableOptions = dispatchSources?.filter(
                              opt => !selectedNames.includes(opt.value),
                            );

                            return (
                              <View key={row.id} style={styles.tableRow}>
                                <View style={{flex: 2, marginRight: 8}}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      getAvailableSources(
                                        request.testMaterialId,
                                      )
                                    }>
                                    <DropdownPicker
                                      items={availableOptions}
                                      value={row.name}
                                      onChange={(value: any) =>
                                        handleSourceChange(value, row.id)
                                      }
                                    />
                                  </TouchableOpacity>
                                </View>
                                <TextInput
                                  style={[
                                    styles.input,
                                    {flex: 1.2, height: 42},
                                  ]}
                                  value={row.quantity}
                                  onChangeText={text =>
                                    handleQuantityChange(text, row.id)
                                  }
                                  keyboardType="decimal-pad"
                                  placeholder="Qty"
                                />

                                <TouchableOpacity
                                  onPress={() =>
                                    handleRemoveSourceRow(
                                      row.id,
                                      request.testMaterialId,
                                    )
                                  }
                                  style={styles.removeButton}
                                  disabled={
                                    getSourceRowsForMaterial(
                                      request.testMaterialId,
                                    ).length === 1
                                  }>
                                  <Text
                                    style={[
                                      styles.removeButtonText,
                                      getSourceRowsForMaterial(
                                        request.testMaterialId,
                                      ).length === 1 && {color: '#ccc'},
                                    ]}>
                                    ✕
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            );
                          },
                        )}

                        <TouchableOpacity
                          onPress={() =>
                            handleAddSourceRowForMaterial(
                              request.testMaterialId,
                            )
                          }
                          style={styles.addButton}>
                          <Text style={styles.addButtonText}>+ Add Source</Text>
                        </TouchableOpacity>

                        <View style={styles.totalContainer}>
                          <Text style={styles.totalLabel}>
                            Sum of Source Qty:
                          </Text>
                          <Text
                            style={[
                              styles.totalValue,
                              totalSourceQuantityForMaterial(
                                request.testMaterialId,
                              ) > parseFloat(approvedQty[request._id] ?? '0') &&
                                styles.errorText,
                            ]}>
                            {totalSourceQuantityForMaterial(
                              request.testMaterialId,
                            )}
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              </View>
            );
          })}

        {/* ------------- DISPATCH STAGE (existing) ------------- */}
        {isDispatchStage &&
          route.params?.item?.items?.map((request: any, index: number) => (
            <View key={request._id || index} style={styles.mainContainer}>
              <View style={styles.columnContainer}>
                {request?.testMaterialType && (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Material Name</Text>
                    <Text style={styles.fieldValue}>
                      {request?.testMaterialType}
                    </Text>
                  </View>
                )}
                {request?.testWorkCategoryType && (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Work Category</Text>
                    <Text style={styles.fieldValue}>
                      {request?.testWorkCategoryType}
                    </Text>
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
                  value={
                    approvedQty[request._id] ??
                    String(request.qty_approved ?? request.qty_requested ?? '')
                  }
                  onChangeText={val => handleQtyChange(request._id, val)}
                  keyboardType="decimal-pad"
                  placeholder="Enter total issued quantity"
                />
                <Text style={styles.helperText}>
                  Maximum: {request?.qty_approved ?? request?.qty_requested}{' '}
                  {request?.unit ?? ''} (Approved quantity)
                </Text>
              </View>

              {/* here you can keep or add source table + per-material dispatch button if needed */}
            </View>
          ))}

        {/* Remarks */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Remarks (Optional)</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              isReadOnlyApprovalStage ? styles.readOnlyInput : null,
            ]}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Enter any remarks or notes..."
            multiline
            maxLength={500}
          />
          <Text style={styles.helperText}>{remarks.length}/500 characters</Text>
        </View>

        {/* Footer buttons */}
        {isDispatchStage ? (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleSubmit('dispatch')}>
            <Text style={styles.submitButtonText}>Dispatch All Material</Text>
          </TouchableOpacity>
        ) : isReadOnlyApprovalStage ? (
          <View style={styles.footerActions}>
            <TouchableOpacity
              style={[styles.submitButton, styles.rejectButton]}
              onPress={() => handleFinalApprovalDecision('reject')}>
              <Text style={styles.submitButtonText}>Reject Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => handleFinalApprovalDecision('accept')}>
              <Text style={styles.submitButtonText}>Accept Request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // REQUEST_FOR_APPROVAL stage
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleSubmit('approve')}>
            <Text style={styles.submitButtonText}>Approve Material</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
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
  formGroup: {marginBottom: 10},
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
  required: {color: '#e74c3c'},
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
  readOnlyInput: {
    // if you want remarks readonly later, you can tweak here
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
    flex: 1,
    height: 52,
    backgroundColor: '#5A2AAF',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
    marginRight: 10,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
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
  errorText: {color: '#e74c3c'},
  mainContainer: {
    flexDirection: 'column',
    gap: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
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
    textTransform: 'capitalize',
  },
  fieldValue: {
    fontSize: 12,
    fontWeight: '400',
    color: '#212529',
  },
  sourceRowReadonly: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  sourceReadonlyText: {
    fontSize: 12,
    color: '#212529',
  },
  sourceReadonlyQty: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212529',
  },
});

export default MaterialApprovalForm;
