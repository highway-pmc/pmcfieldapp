import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React from 'react';
import DynamicForm from '../../../components/Form/DynamicForm';

interface InformationTabProps {
  formData: any; 
}

const InformationTab: React.FC<InformationTabProps> = ({formData}) => {

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <View style={[styles.tabContent, styles.centered]}>
        <Text style={styles.dataText}>No Information data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Assuming DynamicForm renders the content based on the passed formData */}
      <DynamicForm formData={formData} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: '#fff',
    minHeight: '100%', // Ensure it takes up space even if content is small
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataText: {
    fontSize: 16,
    color: '#666',
    padding: 20,
  },
});

export default InformationTab;
