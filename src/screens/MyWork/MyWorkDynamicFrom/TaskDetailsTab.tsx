import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React, {forwardRef, useRef} from 'react';
import DynamicForm, {
  DynamicFormRef,
} from '../../../components/Form/DynamicForm';

// Assuming formData can be a single object or an array of objects
interface TaskDetailsTabProps {
  formData: any;
  globalFormData: Record<string, any>;
  onGlobalValueChange: (fieldId: string, newValue: any) => void;
}

// Since you insisted on using DynamicFormRef as the generic type for forwardRef,
// this implementation focuses on rendering, but keeps in mind that the parent
// TaskForm will only be able to call methods (like collectAllInputs) on the *last* // DynamicForm if formData is an array, due to the nature of a single forwarded ref.

const TaskDetailsTab = forwardRef<DynamicFormRef, TaskDetailsTabProps>(
  ({formData, globalFormData, onGlobalValueChange}, ref) => {
    // 1. Handle missing/empty data
    if (
      !formData ||
      (Array.isArray(formData) && formData.length === 0) ||
      (typeof formData === 'object' &&
        !Array.isArray(formData) &&
        Object.keys(formData).length === 0)
    ) {
      return (
        <View style={[styles.tabContent, styles.centered]}>
          <Text style={styles.dataText}>No Task Details data available.</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        {formData.map((element: any, index: any) => (
          <DynamicForm
            // WARNING: The single forwarded ref ('ref') will only point
            // to the last rendered DynamicForm instance.
            ref={ref}
            formData={element} // Pass the individual object
            globalFormData={globalFormData}
            onGlobalValueChange={onGlobalValueChange}
          />
        ))}
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: '#fff',
    minHeight: '100%',
    padding: 10, // Added padding for better separation of multiple forms
  },
  formContainer: {
    marginBottom: 15, // Space between dynamically generated forms
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    paddingHorizontal: 5,
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
