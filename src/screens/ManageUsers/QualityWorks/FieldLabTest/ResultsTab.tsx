import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const ResultsTab = () => {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.contentTitle}>Results Tab Content</Text>
      <Text style={styles.contentText}>
        This section will present the final results and conclusions of the test.
        Graphs, charts, and summary reports can be placed here.
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

export default ResultsTab;
