import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import KebabMenu from '../Common/KebabMenu';

export default function ProductionSummary() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      module: 'Project Module/ Segment/ Component',
      materialType: 'PCC',
      materialCategory: 'M20',
      totalQtyProduced: 100,
      status: 'pending',
    },
    {
      id: 2,
      module: 'Project Module/ Foundation/ Base',
      materialType: 'RCC',
      materialCategory: 'M25',
      totalQtyProduced: 150,
      status: 'pending',
    },
    {
      id: 3,
      module: 'Project Module/ Structure/ Column',
      materialType: 'PCC',
      materialCategory: 'M30',
      totalQtyProduced: 75,
      status: 'pending',
    },
  ]);

  const handleEdit = (orderId: number) => {
    Alert.alert('Accept Order', 'Are you sure you want to accept this order?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Accept',
        onPress: () => {
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === orderId ? {...order, status: 'accepted'} : order,
            ),
          );
          Alert.alert('Success', 'Order accepted successfully!');
        },
      },
    ]);
  };

  const handleView = (orderId: number) => {
    Alert.alert('Reject Order', 'Are you sure you want to reject this order?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => {
          setOrders(prevOrders =>
            prevOrders.map(order =>
              order.id === orderId ? {...order, status: 'rejected'} : order,
            ),
          );
          Alert.alert('Success', 'Order rejected successfully!');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}>
        {orders.map(order => (
          <View key={order.id} style={styles.orderCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F0F4FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientBackground}
            />
            <View style={styles.leftBorder} />

            <View style={styles.orderCardContent}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderModule}>{order.module}</Text>
                <Text style={styles.detailText}>
                  Material Type:{' '}
                  <Text style={styles.detailValue}>{order.materialType}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Material Category:{' '}
                  <Text style={styles.detailValue}>
                    {order.materialCategory}
                  </Text>
                </Text>
                <Text style={styles.detailText}>
                  Total Qty produced in Cum:{' '}
                  <Text style={styles.detailValue}>
                    {order.totalQtyProduced}
                  </Text>
                </Text>
              </View>

              <View style={styles.actionContainer}>
                <KebabMenu
                  onEdit={() => handleEdit(order.id)}
                  onView={() => handleView(order.id)}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  listContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  orderCard: {
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ABBEFD',
    position: 'relative',
    minHeight: 140,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: '15%',
    bottom: '15%',
    width: 2,
    backgroundColor: '#6366F1', // Added background color for the border
  },
  orderCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingLeft: 24,
    width: '100%', // Ensure full width
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%', // Ensure full width
  },
  orderModule: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    width: '100%', // Ensure full width
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    width: '100%', // Changed from maxWidth: 200 to width: '100%'
    flexWrap: 'wrap', // Allow wrapping if needed
    gap: 20,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 4,
    flex: 1, // Allow flexible width
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusContainer: {
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    minWidth: 40, // Ensure minimum width for the action container
  },
  menuIconText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
