import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MATERIAL_REQUEST_STATUS} from '../../constants/constants';

interface RequestCardProps {
  request: {
    id: number;
    materialType: string;
    workCategory: string;
    unit: string;
    requestQty: number;
    status: string;
    statusText: string;
  };
  onActionPress: (action: string, status: string) => void;
}

const RequestCard = ({request, onActionPress}: RequestCardProps) => {
  const getCardStyle = (status: string) => {
    switch (status) {
      case MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE:
        return styles.pendingAcceptanceCard;
      case MATERIAL_REQUEST_STATUS.PENDING_APPROVAL:
        return styles.pendingApprovalCard;
      case MATERIAL_REQUEST_STATUS.PENDING_DISPATCH:
        return styles.pendingDispatchCard;
      case MATERIAL_REQUEST_STATUS.REJECTED:
        return styles.rejectedCard;
      default:
        return styles.defaultCard;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
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
      case MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE:
      case MATERIAL_REQUEST_STATUS.PENDING_APPROVAL:
        return '#FF9800'; // Orange for pending states
      case MATERIAL_REQUEST_STATUS.PENDING_DISPATCH:
        return '#5A7EF8'; // Blue for dispatch
      case MATERIAL_REQUEST_STATUS.REJECTED:
        return '#FF4747'; // Red for rejected
      default:
        return '#CCCCCC'; // Default gray
    }
  };

  const getActionButtons = (status: string) => {
    switch (status) {
      case MATERIAL_REQUEST_STATUS.PENDING_ACCEPTANCE:
        return (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              onPress={() => onActionPress('accept', status)}
              style={styles.acceptButton}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => onActionPress('reject', status)}>
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        );
      case MATERIAL_REQUEST_STATUS.PENDING_APPROVAL:
        return (
          <TouchableOpacity
            style={styles.approvalButton}
            onPress={() => onActionPress('request_approval', status)}>
            <Text style={styles.approvalButtonText}>Request for Approval</Text>
          </TouchableOpacity>
        );
      case MATERIAL_REQUEST_STATUS.PENDING_DISPATCH:
        return (
          <TouchableOpacity
            style={styles.dispatchButton}
            onPress={() => onActionPress('dispatch_material', status)}>
            <Text style={styles.dispatchButtonText}>Dispatch Material</Text>
          </TouchableOpacity>
        );
      case MATERIAL_REQUEST_STATUS.REJECTED:
        return (
          <TouchableOpacity
            style={styles.newRequestButton}
            onPress={() => onActionPress('create_new', status)}>
            <Text style={styles.newRequestButtonText}>Create New Request</Text>
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
          <Text style={styles.materialType}>
            Material Type:{' '}
            <Text style={styles.materialValue}>{request.materialType}</Text>
          </Text>
          <Text style={styles.workCategory}>
            Work Category:{' '}
            <Text style={styles.categoryValue}>{request.workCategory}</Text>
          </Text>
          <Text style={styles.unit}>
            Unit: <Text style={styles.unitValue}>{request.unit}</Text>
          </Text>
          <Text style={styles.requestQty}>
            Request qty:{' '}
            <Text style={styles.qtyValue}>{request.requestQty}</Text>
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Card footer with status and action buttons */}
        <View style={styles.cardFooter}>
          <Text style={[styles.statusText, getStatusStyle(request.status)]}>
            {request.statusText}
          </Text>
          {getActionButtons(request.status)}
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
  defaultCard: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCCCCC',
  },
  cardContent: {
    padding: 15,
  },
  materialType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  materialValue: {
    color: '#000',
    fontWeight: '600',
  },
  workCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  categoryValue: {
    color: '#000',
    fontWeight: '500',
  },
  unit: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  unitValue: {
    color: '#000',
    fontWeight: '500',
  },
  requestQty: {
    fontSize: 14,
    color: '#666',
  },
  qtyValue: {
    color: '#000',
    fontWeight: '500',
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
    borderColor: '#28A745',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  approvalButtonText: {
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
