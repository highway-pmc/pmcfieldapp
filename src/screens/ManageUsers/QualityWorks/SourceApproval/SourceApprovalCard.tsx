import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Using the constants provided
export const SOURCE_APPROVAL_STATUS = {
  PENDING: 'pending',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  APPROVED: 'approved',
};

interface SourceApprovalCardProps {
  request: any;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const SourceApprovalCard = ({
  request,
  onApprove,
  onReject,
}: SourceApprovalCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case SOURCE_APPROVAL_STATUS.PENDING:
        return '#FF9800'; // Orange
      case SOURCE_APPROVAL_STATUS.APPROVED:
        return '#28A745';
      case SOURCE_APPROVAL_STATUS.REJECTED:
        return '#FF4747';
      default:
        return '#666';
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F0F4FF']}
      style={[styles.card, {borderColor: getStatusColor(request.status)}]}>
      {/* Left Accent Border */}
      <View
        style={[
          styles.leftBorder,
          {backgroundColor: getStatusColor(request.status)},
        ]}
      />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{request.name || 'Unnamed Source'}</Text>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(request.status) + '20'},
            ]}>
            <Text
              style={[
                styles.statusText,
                {color: getStatusColor(request.status)},
              ]}>
              {request.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.detailText}>
          Work Category:{' '}
          <Text style={styles.bold}>
            {request.testWorkCategoryType || 'N/A'}
          </Text>
        </Text>
        <Text style={styles.detailText}>
          Material:{' '}
          <Text style={styles.bold}>{request.testMaterialType || 'N/A'}</Text>
        </Text>

        <View style={styles.statsRow}>
          <Text style={styles.statLabel}>
            Qty: <Text style={styles.bold}>{request.approxQty}</Text>
          </Text>
          <Text style={styles.statLabel}>
            Rate: <Text style={styles.bold}>₹{request.unitRate}</Text>
          </Text>
        </View>

        {/* Action Buttons: Only show when status is pending */}
        {request.status === SOURCE_APPROVAL_STATUS.PENDING && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveBtn]}
              onPress={() => onApprove(request._id)}>
              <Text style={styles.approveBtnText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.rejectBtn]}
              onPress={() => onReject(request._id)}>
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3,
    marginHorizontal: 2,
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  content: {
    padding: 15,
    paddingLeft: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  bold: {
    color: '#000',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 20,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  // Specific requested colors: Approved -> Red, Reject -> Green
  approveBtn: {
    borderColor: '#28A745',
    backgroundColor: '#F5FFF7',
  },
  approveBtnText: {
    color: '#28A745',
    fontWeight: 'bold',
  },
  rejectBtn: {
    borderColor: '#FF4747',
    backgroundColor: '#FFF5F5',
  },
  rejectBtnText: {
    color: '#FF4747',
    fontWeight: 'bold',
  },
});

export default SourceApprovalCard;
