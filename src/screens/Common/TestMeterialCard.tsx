import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MATERIAL_TEST_STATUS} from '../../constants/constants';

interface RequestCardProps {
  request: {
    [key: string]: any; // make request flexible
  };
  onActionPress: (action: string, status: string) => void;
}

const TestMeterialCard = ({request, onActionPress}: RequestCardProps) => {
  const getCardStyle = (status: string) => {
    switch (status) {
      case MATERIAL_TEST_STATUS.PENDING_ACCEPTANCE:
        return styles.pendingAcceptanceCard;
      case MATERIAL_TEST_STATUS.PENDING:
        return styles.pendingAcceptanceCard;
      case MATERIAL_TEST_STATUS.PENDING_DISPATCH:
        return styles.pendingDispatchCard;
      case MATERIAL_TEST_STATUS.REJECTED:
        return styles.rejectedCard;
      default:
        return styles.defaultCard;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case MATERIAL_TEST_STATUS.PENDING_ACCEPTANCE:
        return styles.pendingAcceptanceStatus;
      case MATERIAL_TEST_STATUS.PENDING:
        return styles.pendingAcceptanceStatus;
      case MATERIAL_TEST_STATUS.PENDING_DISPATCH:
        return styles.pendingDispatchStatus;
      case MATERIAL_TEST_STATUS.REJECTED:
        return styles.rejectedStatus;
      default:
        return styles.defaultStatus;
    }
  };

  const getLeftBorderColor = (status: string) => {
    switch (status) {
      case MATERIAL_TEST_STATUS.PENDING_ACCEPTANCE:
      case MATERIAL_TEST_STATUS.PENDING:
        return '#FF9800';
      case MATERIAL_TEST_STATUS.PENDING_DISPATCH:
        return '#5A7EF8';
      case MATERIAL_TEST_STATUS.REJECTED:
        return '#FF4747';
      default:
        return '#CCCCCC';
    }
  };

  const getActionButtons = (status: string) => {
    switch (status) {
      case MATERIAL_TEST_STATUS.PENDING_ACCEPTANCE:
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
      case MATERIAL_TEST_STATUS.PENDING:
        return (
          <TouchableOpacity
            style={styles.approvalButton}
            onPress={() => onActionPress('request_approval', status)}>
            <Text style={styles.approvalButtonText}>Request for Approval</Text>
          </TouchableOpacity>
        );
      case MATERIAL_TEST_STATUS.PENDING_DISPATCH:
        return (
          <TouchableOpacity
            style={styles.dispatchButton}
            onPress={() => onActionPress('dispatch_material', status)}>
            <Text style={styles.dispatchButtonText}>Dispatch Material</Text>
          </TouchableOpacity>
        );
      case MATERIAL_TEST_STATUS.REJECTED:
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

  const fieldMapping: {[key: string]: string} = {
    name: 'Name',
    location: 'Location',
    vendorName: 'Vendor Name',
    engineerApproval: 'Engineer Approval',
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#E0E7FF']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[styles.requestCard, getCardStyle(request.status)]}>
      {/* Left border */}
      <View
        style={[
          styles.leftBorder,
          {backgroundColor: getLeftBorderColor(request.status)},
        ]}
      />

      <View>
        {/* Card Content (Only mapped fields) */}
        <View style={styles.cardContent}>
          {Object.entries(fieldMapping).map(([key, label]) => {
            console.log(key, getCardStyle(request.status))
            //if (!request[key]) return null;
            return (
              <Text key={key} style={styles.workCategory}>
                {label}: 
                <Text style={styles.categoryValue}> {label === 'Engineer Approval' ? (request[key] === false ? 'No' : 'Yes') : `${String(request[key])}`} </Text>
              </Text>
            );
          })}
        </View>

        <View style={styles.divider} />

        {/* Footer with Actions */}
        <View style={styles.cardFooter}>
            <Text style={styles.workCategory}>
                Created At: 
                <Text style={styles.categoryValue}> {request.createdAt} </Text>
            </Text>
          <Text style={[styles.statusText, getStatusStyle(request.status)]}>
            {request.status}
          </Text>
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

export default TestMeterialCard;
