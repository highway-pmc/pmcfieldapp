import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MATERIAL_TEST_STATUS} from '../../constants/constants';
import { formatDate } from './formatDate';

interface RequestCardProps {
  request: {
    id?: string;
    status: string;
    name?: string;
    location?: string;
    vendorName?: string;
    engineerApproval?: boolean;
    createdAt?: string;
    [key: string]: any; // make request flexible
  };
  onView?: (requestData: any) => void;
  onEdit?: (requestData: any) => void;
  onDelete?: (requestData: any) => void;
  onApprove?: (requestData: any) => void;
  onReject?: (requestData: any) => void;
}

const TestMaterialCard = ({request, onView, onEdit, onDelete, onApprove, onReject}: RequestCardProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const getCardStyle = (status: string) => {
    switch (status) {
      case MATERIAL_TEST_STATUS.PENDING_ACCEPTANCE:
        return styles.pendingAcceptanceCard;
      case MATERIAL_TEST_STATUS.PENDING:
        return styles.pendingCard;
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
        return styles.pendingStatus;
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

  const handleMenuAction = (action: string) => {
    setMenuVisible(false);
    switch (action) {
      case 'view':
        onView?.(request);
        break;
      case 'edit':
        onEdit?.(request);
        break;
      case 'approve':
        onApprove?.(request);
        break;
      case 'reject':
      onReject?.(request);
      break;
      case 'delete':
        onDelete?.(request);
        break;
    }
  };

  const fieldMapping: {[key: string]: string} = {
    name: 'Name',
    location: 'Location',
    vendorName: 'Vendor Name',
    engineerApproval: 'Engineer Approval',
  };

  return (
    <>
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

        {/* Kebab Menu Button */}
        <TouchableOpacity 
          style={styles.kebabButton}
          onPress={() => setMenuVisible(true)}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          <Text style={styles.kebabDots}>⋮</Text>
        </TouchableOpacity>

          <View style={styles.cardContentWrapper}>
            {/* Card Content (Only mapped fields) */}
            <View style={styles.cardContent}>
              {Object.entries(fieldMapping).map(([key, label]) => {
                if (request[key] === undefined || request[key] === null) return null;
                return (
                  <Text key={key} style={styles.workCategory}>
                    {label}: 
                    <Text style={styles.categoryValue}>
                      {' '}
                      {label === 'Engineer Approval' 
                        ? (request[key] === false ? 'No' : 'Yes') 
                        : String(request[key])
                      }
                    </Text>
                  </Text>
                );
              })}
            </View>

            <View style={styles.divider} />

            {/* Footer with Actions */}
            <View style={styles.cardFooter}>
              {request.createdAt && (
                <Text style={styles.workCategory}>
                  Created At: 
                  <Text style={styles.categoryValue}> {formatDate(request.createdAt)}</Text>
                </Text>
              )}
              <Text style={styles.workCategory}>
                <Text style={[styles.statusText, getStatusStyle(request.status)]}>
                  {request.status}
                </Text>
              </Text>
            </View>
          </View>
      </LinearGradient>

      {/* Kebab Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuAction('view')}
            >
              <Text style={styles.menuItemText}>View</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuAction('edit')}
            >
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuAction('approve')}
            >
              <Text style={styles.menuItemText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuAction('reject')}
            >
              <Text style={styles.menuItemText}>Reject</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuAction('delete')}
            >
              <Text style={[styles.menuItemText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  requestCard: {
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  pendingAcceptanceCard: {
    borderColor: '#FF9800',
  },
  pendingCard: {
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
  cardContentWrapper: {
    marginLeft: 8, // Add margin to account for left border
  },
  cardContent: {
    padding: 15,
    paddingRight: 45, // Add padding to avoid kebab menu overlap
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
    textTransform: 'capitalize',
  },
  pendingAcceptanceStatus: {
    color: '#FF8C00',
  },
  pendingStatus: {
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
    gap: 10,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  acceptButton: {
    borderColor: '#28A745',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
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
    flex: 1,
    alignItems: 'center',
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
    marginHorizontal: 15,
    marginBottom: 15,
    alignItems: 'center',
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
    marginHorizontal: 15,
    marginBottom: 15,
    alignItems: 'center',
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
    marginHorizontal: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  newRequestButtonText: {
    color: '#28A745',
    fontSize: 12,
    fontWeight: '500',
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: '15%',
    bottom: '15%',
    width: 4,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  // Kebab menu styles
  kebabButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 1,
  },
  kebabDots: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    lineHeight: 18,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    minWidth: 120,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  deleteText: {
    color: '#FF4444',
  },
});

export default TestMaterialCard;