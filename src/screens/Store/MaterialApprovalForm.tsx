import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
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
import {
  getSourceApprovals,
  patchDispatchRequest,
  patchMaterialRequestStatus,
  clearMaterialRequest,
} from '../ManageUsers/actions';
import {useDispatch, useSelector} from 'react-redux';
import {useSnackbar} from '../../context/SnackbarContext';

const formatDateTime = isoString => {
  if (!isoString) {
    return '-';
  }
  const d = new Date(isoString);
  if (isNaN(d.getTime())) {
    return isoString;
  }

  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MaterialApprovalForm = ({route, navigation}) => {
  const materialRequest = route.params?.item; // { id, items: [...] }
  const {status} = materialRequest || {};

  // flags
  const isProcurementStage =
    status === MATERIAL_REQUEST_STATUS.REQUEST_FOR_APPROVAL;
  const isReadOnlyApprovalStage =
    status === MATERIAL_REQUEST_STATUS.PENDING_APPROVAL;
  const isApprovalStage = isProcurementStage || isReadOnlyApprovalStage;
  const isDispatchStage = status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH;
  const isDispatchedViewMode = status === 'dispatched';

  const [remarks, setRemarks] = useState('');
  const [localApprovals, setLocalApprovals] = useState([]);
  const [approvedQty, setApprovedQty] = useState({});
  const [dispatchedItemsVisible, setDispatchedItemsVisible] = useState(false);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {showSnackbar} = useSnackbar();
  const loggedInUser = useSelector(state => state.Auth.userInfo);
  const {
    patchMeterialRequestStatusData,
    loading: any,
    error,
  } = useSelector(state => state.MeterialRequest);
  const {sourceApprovals} = useSelector(state => state.SourceApprovals);

  // toast from redux
  useEffect(() => {
    if (patchMeterialRequestStatusData) {
      showSnackbar('Material status updated successfully', 'success');
      dispatch(clearMaterialRequest());
      navigation.goBack();
    } else if (error) {
      showSnackbar(error, 'error');
      dispatch(clearMaterialRequest());
    }
  }, [
    patchMeterialRequestStatusData,
    error,
    showSnackbar,
    navigation,
    dispatch,
  ]);

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

  const handleQtyChange = (id, value) => {
    setApprovedQty(prev => ({...prev, [id]: value}));
  };

  // Fetch available sources (API uses material type ID)
  const getAvailableSources = materialTypeId => {
    dispatch(
      getSourceApprovals({
        projectId: loggedInUser.projectId,
        testMaterialId: materialTypeId,
      }),
    );
  };

  const handleSourceChange = (newValue, rowId) => {
    setLocalApprovals(prev =>
      prev.map(row => (row.id === rowId ? {...row, name: newValue} : row)),
    );
  };

  const handleQuantityChange = (value, rowId) => {
    setLocalApprovals(prev =>
      prev.map(row => (row.id === rowId ? {...row, quantity: value} : row)),
    );
  };

  // Remove row
  const handleRemoveSourceRow = id => {
    setLocalApprovals(prev => prev?.filter(row => row.id !== id));
  };

  // Calculate sum based on UNIQUE ITEM ID, not material type
  const totalSourceQuantityForMaterial = requestItemId => {
    return localApprovals
      ?.filter(row => row.requestItemId === requestItemId)
      ?.reduce((total, row) => total + (parseFloat(row.quantity) || 0), 0);
  };

  // Add row specifically for this REQUEST ITEM ID
  const handleAddSourceRowForMaterial = (requestItemId, materialTypeId) => {
    setLocalApprovals(prev => [
      ...prev,
      {
        id: `${requestItemId}_${Date.now()}`, // Unique Row ID
        requestItemId: requestItemId, // Crucial: Links this row to THIS specific item card
        testMaterialId: materialTypeId, // Kept for referencing source options
        name: '',
        quantity: '',
      },
    ]);
  };

  // Get rows specifically for this REQUEST ITEM ID
  const getSourceRowsForMaterial = requestItemId => {
    return localApprovals?.filter(row => row.requestItemId === requestItemId);
  };

  // SUBMIT
  const handleSubmit = type => {
    if (isProcurementStage && type === 'approve') {
      const approvalData =
        materialRequest?.items?.map(req => {
          const materialSources = localApprovals.filter(
            row => row.requestItemId === req._id,
          );

          const approvedQtyForMaterial = Number(
            approvedQty[req._id] ?? req.qty_requested,
          );

          const backendSourcesForMaterial = sourceApprovals?.filter(
            s => s.testMaterialId === req.testMaterialId,
          );

          const source = materialSources.map(row => {
            const matched = backendSourcesForMaterial?.find(
              s => s.name === row.name,
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
          id: materialRequest?.id,
          body: payload,
        }),
      );

      return;
    }

    // Dispatch Stage Submission (Dispatch All Material)
    const payload = {
      status:
        type === 'dispatch'
          ? MATERIAL_REQUEST_STATUS.DISPATCHED
          : MATERIAL_REQUEST_STATUS.PENDING_DISPATCH,
      comments: remarks,
      approvalData: materialRequest?.items?.map(req => ({
        materialRequestItemId: req._id,
        quantityApproved:
          approvedQty[req._id] ?? Number(req.qty_approved ?? req.qty_requested),
      })),
    };

    dispatch(
      patchMaterialRequestStatus({
        projectId: loggedInUser.projectId,
        id: materialRequest?.id,
        body: payload,
      }),
    );

    Alert.alert('Success', 'Form has been submitted successfully!');
  };

  // Final Decision Logic (Pending Approval -> Pending Dispatch / Rejected)
  const handleFinalApprovalDecision = action => {
    const items = materialRequest?.items || [];
    if (action === 'reject') {
      const payload = {
        status: MATERIAL_REQUEST_STATUS.REJECTED,
        comments: remarks,
      };
      dispatch(
        patchMaterialRequestStatus({
          projectId: loggedInUser.projectId,
          id: materialRequest?.id,
          body: payload,
        }),
      );
      Alert.alert('Success', 'Request rejected successfully!');
      return;
    }

    const approvalData =
      items?.map(req => {
        const base = {
          materialRequestItemId: req._id,
          quantityApproved:
            typeof req.qty_approved === 'number'
              ? req.qty_approved
              : Number(req.qty_requested ?? 0),
        };

        if (Array.isArray(req.mixDesign) && req.mixDesign.length > 0) {
          base.mixDesign = req.mixDesign.map(md => ({
            mixDesignId: md.mixDesignId,
            mixDesignName: md.mixDesignName,
            qtyRequest: md.qtyRequest,
            qtyApproved: md.qtyApproved ?? md.qtyRequest,
          }));
          base.batchNo = req.metaData?.batchNo ?? null;
        } else if (Array.isArray(req.source) && req.source.length > 0) {
          base.source = req.source.map(src => ({
            sourceApprovalId: src.sourceApprovalId,
            sourceName: src.sourceName,
            qtyRequest: src.qtyRequest,
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
        id: materialRequest?.id,
        body: payload,
      }),
    );
    Alert.alert('Success', 'Request accepted successfully!');
  };

  // Dispatch Single
  const handleDispatchSingleMaterial = request => {
    const qtyToDispatch = parseFloat(
      approvedQty[request._id] ??
        String(request.qty_approved ?? request.qty_requested),
    );

    if (Number.isNaN(qtyToDispatch) || qtyToDispatch <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity to dispatch.');
      return;
    }

    const totalApprovedForItem =
      Number(request.qty_approved ?? request.qty_requested ?? qtyToDispatch) ||
      1;

    const sources = (request.source || []).map(src => {
      const srcApproved =
        Number(src.qtyApproved ?? src.qtyRequest ?? totalApprovedForItem) || 0;
      const ratio = srcApproved / totalApprovedForItem || 0;
      const qtyForSource = qtyToDispatch * ratio;

      return {
        sourceName: src.sourceName,
        sourceApprovalId: src.sourceApprovalId,
        qty: qtyForSource,
      };
    });

    const payload = {
      qty_issued: qtyToDispatch,
      comments_issued: remarks,
      source: [
        {
          materialRequestItemId: request._id,
          quantityDispatched: qtyToDispatch,
          sources,
        },
      ],
    };

    dispatch(
      patchDispatchRequest({
        projectId: loggedInUser.projectId,
        itemId: request._id,
        body: payload,
      }),
    );
    Alert.alert(
      'Success',
      `${request.testMaterialType} has been dispatched successfully!`,
    );
  };

  const renderApprovalItemEditable = request => {
    const unit = request?.unit || '';
    const requestItemId = request._id;
    const materialTypeId = request.testMaterialId || requestItemId;

    return (
      <>
        <View>
          <Text style={styles.label}>
            Total Qty Approve <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={
              approvedQty[requestItemId] ?? String(request.qty_requested ?? '')
            }
            onChangeText={val => handleQtyChange(requestItemId, val)}
            keyboardType="decimal-pad"
            placeholder="Enter total approved quantity"
          />
          <Text style={styles.helperText}>
            Maximum: {request?.qty_requested} {unit} (Requested quantity)
          </Text>
        </View>

        <View style={styles.sourceTableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, {flex: 2}]}>Source</Text>
            <Text style={[styles.tableHeaderText, {flex: 1.2}]}>Quantity</Text>
            <View style={{width: 30}} />
          </View>

          {getSourceRowsForMaterial(requestItemId)?.map(row => {
            const selectedNames = localApprovals
              ?.filter(
                r =>
                  r.id !== row.id &&
                  r.name &&
                  r.requestItemId === requestItemId,
              )
              ?.map(r => r.name);

            const specificSources =
              sourceApprovals?.filter(
                s => s.testMaterialId === materialTypeId,
              ) || [];

            const dropdownOptions = specificSources.map(s => ({
              label: s.name,
              value: s.name,
            }));

            const availableOptions = dropdownOptions.filter(
              opt => !selectedNames.includes(opt.value),
            );

            return (
              <View key={row.id} style={styles.tableRow}>
                <View style={{flex: 2, marginRight: 8}}>
                  <TouchableOpacity
                    onPress={() => getAvailableSources(materialTypeId)}>
                    <DropdownPicker
                      items={availableOptions}
                      value={row.name}
                      onChange={value => handleSourceChange(value, row.id)}
                    />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[styles.input, {flex: 1.2, height: 42}]}
                  value={row.quantity}
                  onChangeText={text => handleQuantityChange(text, row.id)}
                  keyboardType="decimal-pad"
                  placeholder="Qty"
                />

                <TouchableOpacity
                  onPress={() => handleRemoveSourceRow(row.id)}
                  style={styles.removeButton}>
                  <Text style={[styles.removeButtonText, {color: '#e74c3c'}]}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <TouchableOpacity
            onPress={() =>
              handleAddSourceRowForMaterial(requestItemId, materialTypeId)
            }
            style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Source</Text>
          </TouchableOpacity>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Sum of Source Qty:</Text>
            <Text
              style={[
                styles.totalValue,
               
              ]}>
              {totalSourceQuantityForMaterial(requestItemId)}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const renderApprovalItemReadonly = request => {
    const unit = request?.unit || '';
    return (
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
            {request?.qty_approved ?? request?.qty_requested} {unit}
          </Text>
        </View>

        {Array.isArray(request?.source) && request.source.length > 0 ? (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Source Allocation</Text>
            {request.source.map((s, idx) => (
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
        ) : (
          Array.isArray(request?.mixDesign) &&
          request.mixDesign.length > 0 && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Mix Design Details</Text>
              {request.mixDesign.map((md, idx) => (
                <View key={idx} style={styles.sourceRowReadonly}>
                  <Text style={styles.sourceReadonlyText}>
                    {md.mixDesignName ?? '-'}
                  </Text>
                  <Text style={styles.sourceReadonlyQty}>
                    {md.qtyApproved ?? md.qtyRequest ?? 0} {unit}
                  </Text>
                </View>
              ))}
              {request.metaData?.batchNo && (
                <View style={styles.sourceRowReadonly}>
                  <Text style={styles.sourceReadonlyText}>Batch No</Text>
                  <Text style={styles.sourceReadonlyQty}>
                    {request.metaData.batchNo}
                  </Text>
                </View>
              )}
            </View>
          )
        )}
      </>
    );
  };

  const renderApprovalSection = () => {
    if (!isApprovalStage || !materialRequest?.items?.length) return null;

    return materialRequest.items.map(request => {
      return (
        <View
          style={styles.formGroup}
          key={request._id || request.testMaterialId}>
          <View style={styles.mainContainer}>
            <View style={styles.topHeaderRow}>
              <Text style={styles.materialTitle}>
                {request?.testMaterialType || 'Material'}
              </Text>
              {request?.testMaterialCategory && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    {request.testMaterialCategory}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.columnContainer}>
              {request?.testWorkCategoryType && (
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Work Category</Text>
                  <Text style={styles.fieldValue}>
                    {request?.testWorkCategoryType}
                  </Text>
                </View>
              )}
              {request?.createdAt && (
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Request Date</Text>
                  <Text style={styles.fieldValue}>
                    {formatDateTime(request?.createdAt)}
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
              {materialRequest?.statusText && (
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Status</Text>
                  <Text style={styles.fieldValue}>
                    {materialRequest.statusText}
                  </Text>
                </View>
              )}
            </View>

            {isReadOnlyApprovalStage
              ? renderApprovalItemReadonly(request)
              : renderApprovalItemEditable(request)}
          </View>
        </View>
      );
    });
  };

  const renderDispatchSection = () => {
    if (!isDispatchStage || !materialRequest?.items?.length) return null;

    return materialRequest.items.map((request, index) => {
      const isItemPendingDispatch =
        request.status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH;
      const isItemDispatched =
        request.status === MATERIAL_REQUEST_STATUS.DISPATCHED;
      console.log(
        'Rendering dispatch item:',
        request._id,
        'Status:',
        request.status,
      );
      return (
        <View
          key={request._id || index}
          style={[
            styles.mainContainer,
            isItemDispatched && styles.dispatchedCard,
          ]}>
          <View style={styles.topHeaderRow}>
            <Text style={styles.materialTitle}>
              {request?.testMaterialType || 'Material'}
            </Text>
            {request?.testMaterialCategory && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  {request.testMaterialCategory}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.columnContainer}>
            {request?.testWorkCategoryType && (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Work Category</Text>
                <Text style={styles.fieldValue}>
                  {request?.testWorkCategoryType}
                </Text>
              </View>
            )}
            {request?.createdAt && (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Request Date</Text>
                <Text style={styles.fieldValue}>
                  {formatDateTime(request?.createdAt)}
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
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Item Status</Text>
              <Text style={styles.fieldValue}>
                {request.status === MATERIAL_REQUEST_STATUS.PENDING_DISPATCH
                  ? 'Pending for Dispatch'
                  : request.status === MATERIAL_REQUEST_STATUS.DISPATCHED
                  ? 'Dispatched'
                  : request.status || '-'}
              </Text>
            </View>
          </View>

          {request &&
          Array.isArray(request.source) &&
          request.source.length > 0 ? (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Source Allocation</Text>
              {request.source.map((s, idx) => (
                <View key={idx} style={styles.sourceRowReadonly}>
                  <Text style={styles.sourceReadonlyText}>
                    {s.sourceName ?? '-'}
                  </Text>
                  <Text style={styles.sourceReadonlyQty}>
                    {s.qtyRequest ?? s.qty ?? 0} {request.unit}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            request &&
            Array.isArray(request.mixDesign) &&
            request.mixDesign.length > 0 && (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Mix Design Details</Text>
                {request.mixDesign.map((md, idx) => (
                  <View key={idx} style={styles.sourceRowReadonly}>
                    <Text style={styles.sourceReadonlyText}>
                      {md.mixDesignName ?? '-'}
                    </Text>
                    <Text style={styles.sourceReadonlyQty}>
                      {md.qtyApproved ?? md.qtyRequest ?? 0} {request.unit}
                    </Text>
                  </View>
                ))}
                {request.metaData?.batchNo && (
                  <View style={styles.sourceRowReadonly}>
                    <Text style={styles.sourceReadonlyText}>Batch No</Text>
                    <Text style={styles.sourceReadonlyQty}>
                      {request.metaData.batchNo}
                    </Text>
                  </View>
                )}
              </View>
            )
          )}


          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Total Qty Issued <Text style={styles.required}>*</Text>
            </Text>

            {isItemPendingDispatch ? (
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
            ) : (
              <Text style={styles.fieldValue}>
                {request?.qty_issued ?? '-'}
              </Text>
            )}

            <Text style={styles.helperText}>
              Maximum: {request?.qty_approved ?? request?.qty_requested}{' '}
              {request?.unit ?? ''} (Approved quantity)
            </Text>
          </View>

          {isItemPendingDispatch && (
            <TouchableOpacity
              style={styles.dispatchButton}
              onPress={() => handleDispatchSingleMaterial(request)}>
              <Text style={styles.dispatchButtonText}>Dispatch</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    });
  };

  const renderRemarksSection = () => (
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
  );

  const renderFooterButtons = () => {
    if (isDispatchStage) {
      return (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleSubmit('dispatch')}>
          <Text style={styles.submitButtonText}>Dispatch All Material</Text>
        </TouchableOpacity>
      );
    }

    if (isReadOnlyApprovalStage) {
      return (
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
      );
    }

    if (isProcurementStage) {
      return (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleSubmit('approve')}>
          <Text style={styles.submitButtonText}>Request for Approval</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderDispatchedItemsView = () => {
    if (!materialRequest?.items?.every(item => item.status === 'dispatched')) {
      return null;
    }

    return (
      <View style={styles.formContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => setDispatchedItemsVisible(prev => !prev)}>
          <Text style={styles.submitButtonText}>
            {dispatchedItemsVisible
              ? 'Hide Dispatched Items'
              : 'View Dispatched Items'}
          </Text>
        </TouchableOpacity>

        {dispatchedItemsVisible &&
          materialRequest.items.map(request => (
            <View
              key={request._id}
              style={[styles.mainContainer, styles.dispatchedCard]}>
              <Text style={styles.materialTitle}>
                {request?.testMaterialType || 'Material'}
              </Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Qty Issued</Text>
                <Text style={styles.fieldValue}>
                  {request?.qty_issued ?? '-'}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Item Status</Text>
                <Text style={styles.fieldValue}>Dispatched</Text>
              </View>
              {Array.isArray(request?.source) && request.source.length > 0 ? (
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Source Allocation</Text>
                  {request.source.map((s, idx) => (
                    <View key={idx} style={styles.sourceRowReadonly}>
                      <Text style={styles.sourceReadonlyText}>
                        {s.sourceName ?? '-'}
                      </Text>
                      <Text style={styles.sourceReadonlyQty}>
                        {s.qtyRequest ?? s.qty ?? 0} {request.unit}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                Array.isArray(request?.mixDesign) &&
                request.mixDesign.length > 0 && (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Mix Design Details</Text>
                    {request.mixDesign.map((md, idx) => (
                      <View key={idx} style={styles.sourceRowReadonly}>
                        <Text style={styles.sourceReadonlyText}>
                          {md.mixDesignName ?? '-'}
                        </Text>
                        <Text style={styles.sourceReadonlyQty}>
                          {md.qtyApproved ?? md.qtyRequest ?? 0} {request.unit}
                        </Text>
                      </View>
                    ))}
                    {request.metaData?.batchNo && (
                      <View style={styles.sourceRowReadonly}>
                        <Text style={styles.sourceReadonlyText}>Batch No</Text>
                        <Text style={styles.sourceReadonlyQty}>
                          {request.metaData.batchNo}
                        </Text>
                      </View>
                    )}
                  </View>
                )
              )}
            </View>
          ))}
      </View>
    );
  };

  const renderContent = () => {
    if (isDispatchedViewMode) {
      return (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Dispatched Items</Text>
          {materialRequest.items.map(request => (
            <View
              key={request._id}
              style={[styles.mainContainer, styles.dispatchedCard]}>
              <Text style={styles.materialTitle}>
                {request?.testMaterialType || 'Material'}
              </Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Qty Issued</Text>
                <Text style={styles.fieldValue}>
                  {request?.qty_issued ?? '-'}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Item Status</Text>
                <Text style={styles.fieldValue}>Dispatched</Text>
              </View>
              {Array.isArray(request?.source) && request.source.length > 0 ? (
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Source Allocation</Text>
                  {request.source.map((s, idx) => (
                    <View key={idx} style={styles.sourceRowReadonly}>
                      <Text style={styles.sourceReadonlyText}>
                        {s.sourceName ?? '-'}
                      </Text>
                      <Text style={styles.sourceReadonlyQty}>
                        {s.qtyRequest ?? s.qty ?? 0} {request.unit}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                Array.isArray(request?.mixDesign) &&
                request.mixDesign.length > 0 && (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Mix Design Details</Text>
                    {request.mixDesign.map((md, idx) => (
                      <View key={idx} style={styles.sourceRowReadonly}>
                        <Text style={styles.sourceReadonlyText}>
                          {md.mixDesignName ?? '-'}
                        </Text>
                        <Text style={styles.sourceReadonlyQty}>
                          {md.qtyApproved ?? md.qtyRequest ?? 0} {request.unit}
                        </Text>
                      </View>
                    ))}
                    {request.metaData?.batchNo && (
                      <View style={styles.sourceRowReadonly}>
                        <Text style={styles.sourceReadonlyText}>Batch No</Text>
                        <Text style={styles.sourceReadonlyQty}>
                          {request.metaData.batchNo}
                        </Text>
                      </View>
                    )}
                  </View>
                )
              )}
            </View>
          ))}
        </View>
      );
    }
    return (
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>
          {isDispatchStage ? 'Dispatch Details' : 'Approval Details'}
        </Text>

        {renderApprovalSection()}
        {renderDispatchSection()}
        {renderRemarksSection()}
        {renderFooterButtons()}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {isDispatchedViewMode ? null : renderDispatchedItemsView()}
      {renderContent()}
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
    backgroundColor: '#f1f3f5',
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
  dispatchedCard: {
    borderWidth: 1,
    borderColor: '#2e7d32',
    opacity: 0.8,
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
  dispatchButton: {
    height: 44,
    backgroundColor: '#2e7d32',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dispatchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  materialTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#EDE7F6',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A2AAF',
  },
});

export default MaterialApprovalForm;
