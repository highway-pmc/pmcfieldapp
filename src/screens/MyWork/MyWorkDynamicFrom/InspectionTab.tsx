import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React, {forwardRef} from 'react';
import DynamicForm, {
  DynamicFormRef,
} from '../../../components/Form/DynamicForm';

interface InspectionTabProps {
  formData: any;
  // NEW PROPS from TaskForm
  globalFormData: Record<string, any>;
  onGlobalValueChange: (fieldId: string, newValue: any) => void;
}

const InspectionTab = forwardRef<DynamicFormRef, InspectionTabProps>(
  ({formData, globalFormData, onGlobalValueChange}, ref) => {
    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        {/* Pass the centralized state and setter down to DynamicForm */}
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

export default InspectionTab;
