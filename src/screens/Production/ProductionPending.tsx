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

export default function ProductionPending() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      module: 'Project Module/ Segment/ Component',
      gradeOfConcrete: 'M45',
      quantity: 3,
      orderedBy: 'cubic yard (CY)',
      orderedTime: '10:30pm 9th June',
      status: 'pending',
    },
    {
      id: 2,
      module: 'Project Module/ Foundation/ Base',
      gradeOfConcrete: 'M30',
      quantity: 5,
      orderedBy: 'cubic yard (CY)',
      orderedTime: '11:15am 10th June',
      status: 'pending',
    },
    {
      id: 3,
      module: 'Project Module/ Structure/ Column',
      gradeOfConcrete: 'M25',
      quantity: 2,
      orderedBy: 'cubic yard (CY)',
      orderedTime: '2:45pm 10th June',
      status: 'pending',
    },
  ]);

  const handleAccept = (orderId: number) => {
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

  const handleReject = (orderId: number) => {
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
                <View style={styles.orderDetails}>
                  <Text style={[styles.detailText,{flex:2}]}>
                    Grade of Concrete:{' '}
                    <Text style={styles.detailValue}>
                      {order.gradeOfConcrete}
                    </Text>
                  </Text>
                  <Text style={styles.detailText}>
                    QTY:{' '}
                    <Text style={styles.detailValue}>{order.quantity}</Text>
                  </Text>
                </View>
                <Text style={styles.detailText}>
                  Ordered By:{' '}
                  <Text style={styles.detailValue}>{order.orderedBy}</Text>
                </Text>
                <Text style={styles.detailText}>
                  Ordered Time:{' '}
                  <Text style={styles.detailValue}>{order.orderedTime}</Text>
                </Text>
              </View>

              {order.status === 'pending' && (
                <View style={styles.actionContainer}>
                  <KebabMenu
                    onAccept={() => handleAccept(order.id)}
                    onReject={() => handleReject(order.id)}
                  />
                </View>
              )}
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
    gap:20,
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
  // Kebab Menu Styles
  kebabIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  dot: {
    fontSize: 20,
    color: '#6366F1',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 120,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptIcon: {
    backgroundColor: '#10B981',
  },
  rejectIcon: {
    backgroundColor: '#EF4444',
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
