import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React, {forwardRef} from 'react';
import DynamicForm, {
  DynamicFormRef,
} from '../../../components/Form/DynamicForm';

interface TaskDetailsTabProps {
  formData: any;
  header?: any;
  globalFormData: Record<string, any>;
  onGlobalValueChange: (fieldId: string, newValue: any) => void;
}

const TaskDetailsTab = forwardRef<DynamicFormRef, TaskDetailsTabProps>(
  ({formData, header, globalFormData, onGlobalValueChange}, ref) => {
    // Logic to check if form data is actually present
    const isFormDataEmpty =
      !formData ||
      (Array.isArray(formData) && formData.length === 0) ||
      (typeof formData === 'object' &&
        !Array.isArray(formData) &&
        Object.keys(formData).length === 0);

    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        {/* 1. Always render header if it exists */}
        {header && (
          <DynamicForm
            ref={isFormDataEmpty ? ref : null} // Attach ref here if no main form exists
            formData={header}
            globalFormData={globalFormData}
            onGlobalValueChange={onGlobalValueChange}
          />
        )}

        {/* 2. Render Form Data OR Error Message */}
        {isFormDataEmpty ? (
          <View style={styles.centered}>
            <Text style={styles.dataText}>
              There are no samples for current task. Add sample by material
              request or update material consumption in information one.
            </Text>
          </View>
        ) : (
          formData.map((element: any, index: number) => (
            <View key={index} style={styles.formContainer}>
              <DynamicForm
                // If multiple forms exist, the ref will attach to the last one mapped
                ref={ref}
                formData={element}
                globalFormData={globalFormData}
                onGlobalValueChange={onGlobalValueChange}
              />
            </View>
          ))
        )}
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: '#fff',
    minHeight: '100%',
    padding: 10,
  },
  formContainer: {
    marginBottom: 15,
  },
  centered: {
    marginTop: 40, // Spacing from header
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
});

export default TaskDetailsTab;
