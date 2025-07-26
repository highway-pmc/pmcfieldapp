import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';

const Request = () => {
  const [selectedTab, setSelectedTab] = useState('inventory');

  // Sample data for inventory requests
  const inventoryRequests = [
    {
      id: 1,
      materialType: 'Concrete (Structure)',
      workCategory: 'Admixture',
      unit: 'Kg',
      requestQty: 100,
      status: 'pending_acceptance',
      statusText: 'Pending for Acceptance',
    },
    {
      id: 2,
      materialType: 'Concrete (Structure)',
      workCategory: 'Admixture',
      unit: 'Kg',
      requestQty: 100,
      status: 'pending_approval',
      statusText: 'Pending for Approval',
    },
    {
      id: 3,
      materialType: 'Concrete (Structure)',
      workCategory: 'Admixture',
      unit: 'Kg',
      requestQty: 100,
      status: 'pending_dispatch',
      statusText: 'Pending for Dispatch',
    },
    {
      id: 4,
      materialType: 'Concrete (Structure)',
      workCategory: 'Admixture',
      unit: 'Kg',
      requestQty: 100,
      status: 'rejected',
      statusText: 'Rejected by Project Head',
    },
    {
      id: 5,
      materialType: 'Concrete (Structure)',
      workCategory: 'Admixture',
      unit: 'Kg',
      requestQty: 100,
      status: 'pending_dispatch',
      statusText: 'Pending for Dispatch',
    },
    {
      id: 6,
      materialType: 'Concrete (Structure)',
      workCategory: 'Admixture',
      unit: 'Kg',
      requestQty: 100,
      status: 'rejected',
      statusText: 'Rejected by Project Head',
    },
  ];

  const contingencyRequests: typeof inventoryRequests = [
    // Add contingency requests data here if needed
  ];

  const currentRequests =
    selectedTab === 'inventory' ? inventoryRequests : contingencyRequests;

  // Function to get the border style for the card based on status
  const getCardStyle = (status: any) => {
    switch (status) {
      case 'pending_acceptance':
        return styles.pendingAcceptanceCard;
      case 'pending_approval':
        return styles.pendingApprovalCard;
      case 'pending_dispatch':
        return styles.pendingDispatchCard;
      case 'rejected':
        return styles.rejectedCard;
      default:
        return styles.defaultCard;
    }
  };

  // Function to get the status text style based on status
  const getStatusStyle = (status: any) => {
    switch (status) {
      case 'pending_acceptance':
        return styles.pendingAcceptanceStatus;
      case 'pending_approval':
        return styles.pendingApprovalStatus;
      case 'pending_dispatch':
        return styles.pendingDispatchStatus;
      case 'rejected':
        return styles.rejectedStatus;
      default:
        return styles.defaultStatus;
    }
  };

  // Function to get the color for the left border based on status
  const getLeftBorderColor = (status: any) => {
    switch (status) {
      case 'pending_acceptance':
      case 'pending_approval':
        return '#FF9800'; // Orange for pending acceptance/approval
      case 'pending_dispatch':
        return '#5A7EF8'; // Blue for pending dispatch
      case 'rejected':
        return '#FF4747'; // Red for rejected
      default:
        return '#CCCCCC'; // Default grey
    }
  };

  // Function to render action buttons based on status
  const getActionButtons = (status: any) => {
    switch (status) {
      case 'pending_acceptance':
        return (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectButton}>
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        );
      case 'pending_approval':
        return (
          <TouchableOpacity style={styles.approvalButton}>
            <Text style={styles.approvalButtonText}>Request for Approval</Text>
          </TouchableOpacity>
        );
      case 'pending_dispatch':
        return (
          <TouchableOpacity style={styles.dispatchButton}>
            <Text style={styles.dispatchButtonText}>Dispatch Material</Text>
          </TouchableOpacity>
        );
      case 'rejected':
        return (
          <TouchableOpacity style={styles.newRequestButton}>
            <Text style={styles.newRequestButtonText}>Create New Request</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  // Function to render a single request card
  const renderRequestCard = (request: any) => (
    <View key={request.id}>
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

          <View style={styles.cardFooter}>
            <Text style={[styles.statusText, getStatusStyle(request.status)]}>
              {request.statusText}
            </Text>
            {getActionButtons(request.status)}
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Toggle Header */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedTab === 'inventory' && styles.activeToggleButton,
          ]}
          onPress={() => setSelectedTab('inventory')}>
          <Text
            style={[
              styles.toggleText,
              selectedTab === 'inventory' && styles.activeToggleText,
            ]}>
            Inventory Request
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedTab === 'contingency' && styles.activeToggleButton,
          ]}
          onPress={() => setSelectedTab('contingency')}>
          <Text
            style={[
              styles.toggleText,
              selectedTab === 'contingency' && styles.activeToggleText,
            ]}>
            Contingency Request
          </Text>
        </TouchableOpacity>
      </View>

      {/* Header Section */}
      <View style={styles.alignmentVertical}>
        <View style={styles.recentWorkContainer}>
          <View style={styles.recentWorkHead}>
            <Text style={styles.headerText}>
              Recent {selectedTab === 'inventory' ? 'Inventory' : 'Contingency'}{' '}
              Requests (
              <Text style={styles.taskCount}>{currentRequests.length}</Text>)
            </Text>
          </View>

          {/* Content Area */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={[styles.recentWorkContent]}>
            {currentRequests.length > 0 ? (
              currentRequests.map(renderRequestCard)
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataHeadText}>
                  No {selectedTab === 'inventory' ? 'Inventory' : 'Contingency'}{' '}
                  Requests
                </Text>
                <Text style={styles.noDataSubText}>
                  There are no{' '}
                  {selectedTab === 'inventory' ? 'inventory' : 'contingency'}{' '}
                  requests available
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  alignmentVertical: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  recentWorkContainer: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  recentWorkHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#DEE1E7',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskCount: {
    color: '#1C58C0',
  },
  recentWorkContent: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  noDataContainer: {
    marginVertical: 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataHeadText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#34343F',
  },
  noDataSubText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#464665',
    marginTop: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    alignSelf: 'center',
    color: '#fff',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  activeToggleButton: {
    borderBottomColor: '#4E36A3',
    borderBottomWidth: 2,
  },
  toggleText: {
    fontSize: 14.5,
    color: '#000000',
    opacity: 0.4,
  },
  activeToggleText: {
    color: '#4E36A3',
    fontWeight: '500',
    opacity: 1,
  },
  // Request Card Styles
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
  pendingDiliveredCard: {
    borderColor: '#5EAB4B',
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
    // backgroundColor will be set dynamically
  },
});

export default Request;
