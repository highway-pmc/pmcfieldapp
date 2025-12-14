import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MATERIAL_REQUEST_STATUS} from '../../constants/constants';

interface RequestCardProps {
  request: {
    id: number;
    rfiId?: string; // Added optional
    materialType: string;
    materialCategory?: string; // Added optional
    workCategory: string;
    unit: string;
    requestQty: number;
    status: string;
    statusText: string;
    items: [];
  };
  onActionPress: (action: string, status: string, items: any) => void;
}

const RequestCard = ({request, onActionPress}: RequestCardProps) => {
  const getCardStyle = (status: string) => {
    switch (status) {
      case MATERIAL_REQUEST_STATUS.REQUEST_FOR_APPROVAL:
        return styles.pendingApprovalCard;
      case MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE:
        return styles.pendingAcceptanceCard;
      case MATERIAL_REQUEST_STATUS.PENDING_APPROVAL:
        return styles.pendingApprovalCard;
      case MATERIAL_REQUEST_STATUS.PENDING_DISPATCH:
        return styles.pendingDispatchCard;
      case MATERIAL_REQUEST_STATUS.REJECTED:
        return styles.rejectedCard;
      case MATERIAL_REQUEST_STATUS.DISPATCHED:
        return styles.dispatchedCard;
      default:
        return styles.defaultCard;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case MATERIAL_REQUEST_STATUS.REQUEST_FOR_APPROVAL:
        return styles.pendingApprovalCard;
      case MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE:
        return styles.pendingAcceptanceStatus;
      case MATERIAL_REQUEST_STATUS.PENDING_APPROVAL:
        return styles.pendingApprovalStatus;
      case MATERIAL_REQUEST_STATUS.PENDING_DISPATCH:
        return styles.pendingDispatchStatus;
      case MATERIAL_REQUEST_STATUS.REJECTED:
        return styles.rejectedStatus;
      default:
        return styles.defaultStatus;
    }
  };

  const getLeftBorderColor = (status: string) => {
    switch (status) {
      case MATERIAL_REQUEST_STATUS.REQUEST_FOR_APPROVAL:
      case MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE:
      case MATERIAL_REQUEST_STATUS.PENDING_APPROVAL:
        return '#FF9800'; // Orange for pending states
      case MATERIAL_REQUEST_STATUS.PENDING_DISPATCH:
        return '#5A7EF8'; // Blue for dispatch
      case MATERIAL_REQUEST_STATUS.REJECTED:
        return '#FF4747'; // Red for rejected
      case MATERIAL_REQUEST_STATUS.DISPATCHED:
        return '#28A745'; // Green for dispatched
      default:
        return '#CCCCCC'; // Default gray
    }
  };

  const getActionButtons = (status: string, item: any) => {
    switch (status) {
      case MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE:
        return (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              onPress={() => onActionPress('accept', status, item)}
              style={styles.acceptButton}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => onActionPress('reject', status, item)}>
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        );
      case MATERIAL_REQUEST_STATUS.PENDING_APPROVAL:
        return (
          <TouchableOpacity
            style={styles.approvalButton}
            onPress={() => onActionPress('request_approval', status, item)}>
            <Text style={styles.approvalButtonText}>Pending Approval</Text>
          </TouchableOpacity>
        );
      case MATERIAL_REQUEST_STATUS.PENDING_DISPATCH:
        return (
          <TouchableOpacity
            style={styles.dispatchButton}
            onPress={() => onActionPress('dispatch_material', status, item)}>
            <Text style={styles.dispatchButtonText}>Dispatch Material</Text>
          </TouchableOpacity>
        );
      case MATERIAL_REQUEST_STATUS.REJECTED:
        return (
          <TouchableOpacity
            style={styles.newRequestButton}
            onPress={() => onActionPress('create_new', status, item)}>
            <Text style={styles.newRequestButtonText}>Create New Request</Text>
          </TouchableOpacity>
        );
      case MATERIAL_REQUEST_STATUS.REQUEST_FOR_APPROVAL:
        return (
          <TouchableOpacity
            style={styles.approvalButton}
            onPress={() => onActionPress('request_approval', status, item)}>
            <Text style={styles.approvalButtonText}>Request for Approval</Text>
          </TouchableOpacity>
        );
      case MATERIAL_REQUEST_STATUS.DISPATCHED:
        return (
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => onActionPress('view', status, item)}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#E0E7FF']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[styles.requestCard, getCardStyle(request.status)]}>
      {/* Left border with dynamic color */}
      <View
        style={[
          styles.leftBorder,
          {backgroundColor: getLeftBorderColor(request.status)},
        ]}
      />
      <View>
        {/* Card content */}
        <View style={styles.cardContent}>
          
          {/* RFI ID Display */}
          {request.rfiId ? (
             <Text style={styles.rowLabel}>
             RFI ID: <Text style={styles.rowValue}>{request.rfiId}</Text>
           </Text>
          ) : null}

          <Text style={styles.rowLabel}>
            Work Category:{' '}
            <Text style={styles.rowValue}>{request.workCategory}</Text>
          </Text>

          <Text style={styles.rowLabel}>
            Material Type:{' '}
            <Text style={styles.rowValue}>{request.materialType}</Text>
          </Text>

          {/* Material Category Display */}
          {request.materialCategory ? (
            <Text style={styles.rowLabel}>
              Material Category:{' '}
              <Text style={styles.rowValue}>{request.materialCategory}</Text>
            </Text>
          ) : null}

        </View>

        <View style={styles.divider} />

        {/* Card footer with status and action buttons */}
        <View style={styles.cardFooter}>
          <Text style={[styles.statusText, getStatusStyle(request.status)]}>
            {request.statusText}
          </Text>
          {getActionButtons(request.status, request)}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  requestCard: {
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pendingAcceptanceCard: {
    borderColor: '#FF9800',
  },
  pendingApprovalCard: {
    borderColor: '#FF9800',
  },
  pendingDispatchCard: {
    borderColor: '#5A7EF8',
  },
  rejectedCard: {
    borderColor: '#FF4747',
  },
  dispatchedCard: {
    borderColor: '#28A745',
  },
  defaultCard: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCCCCC',
  },
  cardContent: {
    padding: 15,
  },
  // Generic styles for rows to keep it clean
  rowLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  rowValue: {
    color: '#000',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 15,
  },
  cardFooter: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  pendingAcceptanceStatus: {
    color: '#FF8C00',
  },
  pendingApprovalStatus: {
    color: '#FF8C00',
  },
  pendingDispatchStatus: {
    color: '#007BFF',
  },
  rejectedStatus: {
    color: '#FF4444',
  },
  defaultStatus: {
    color: '#666',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  acceptButton: {
    borderColor: '#28A745',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  acceptButtonText: {
    color: '#28A745',
    fontSize: 12,
    fontWeight: '500',
  },
  rejectButton: {
    borderColor: '#DC3545',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rejectButtonText: {
    color: '#DC3545',
    fontSize: 12,
    fontWeight: '500',
  },
  approvalButton: {
    borderColor: '#FF9800',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  approvalButtonText: {
    color: '#FF9800',
    fontSize: 12,
    fontWeight: '500',
  },
  viewButton: {
    borderColor: '#28A745',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
    color: '#28A745',
    fontSize: 12,
    fontWeight: '500',
  },
  dispatchButton: {
    borderColor: '#28A745',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dispatchButtonText: {
    color: '#28A745',
    fontSize: 12,
    fontWeight: '500',
  },
  newRequestButton: {
    borderColor: '#28A745',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newRequestButtonText: {
    color: '#28A745',
    fontSize: 12,
    fontWeight: '500',
  },
  leftBorder: {
    paddingVertical: 3,
    position: 'absolute',
    left: 0,
    top: '15%',
    bottom: '15%',
    zIndex: 100,
    width: 2,
  },
});

export default RequestCard;