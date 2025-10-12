import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React, {forwardRef} from 'react';
import DynamicForm, {
  DynamicFormRef,
} from '../../../components/Form/DynamicForm';

interface TaskDetailsTabProps {
  formData: any;
  globalFormData: Record<string, any>;
  onGlobalValueChange: (fieldId: string, newValue: any) => void;
}

const TaskDetailsTab = forwardRef<DynamicFormRef, TaskDetailsTabProps>(
  ({formData, globalFormData, onGlobalValueChange}, ref) => {
    if (!formData || Object.keys(formData).length === 0) {
      return (
        <View style={[styles.tabContent, styles.centered]}>
          <Text style={styles.dataText}>No Task Details data available.</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        <DynamicForm
          ref={ref}
          formData={formData}
          globalFormData={globalFormData}
          onGlobalValueChange={onGlobalValueChange}
        />
      </ScrollView>
    );
  },
);

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
