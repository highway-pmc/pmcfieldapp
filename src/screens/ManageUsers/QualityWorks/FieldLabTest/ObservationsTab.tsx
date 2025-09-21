import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const ObservationsTab = () => {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.contentTitle}>Observations Tab Content</Text>
      <Text style={styles.contentText}>
        This section will show detailed observations recorded during the test.
        You can integrate lists, forms, or data displays in this component.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  contentText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default ObservationsTab;
