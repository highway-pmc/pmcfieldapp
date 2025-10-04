import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React from 'react';
import DynamicForm from '../../../components/Form/DynamicForm';

interface TaskDetailsTabProps {
  formData: any;
}

const TaskDetailsTab: React.FC<TaskDetailsTabProps> = ({formData}) => {

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <View style={[styles.tabContent, styles.centered]}>
        <Text style={styles.dataText}>No Task Details data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <DynamicForm formData={formData} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: '#fff',
    minHeight: '100%',
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

export default TaskDetailsTab;
