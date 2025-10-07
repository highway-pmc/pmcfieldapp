import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React, {forwardRef} from 'react'; // Import forwardRef
import DynamicForm, {
  DynamicFormRef,
} from '../../../components/Form/DynamicForm'; // Import DynamicFormRef

interface InspectionTabProps {
  formData: any;
}

const InspectionTab = forwardRef<DynamicFormRef, InspectionTabProps>(
  ({formData}, ref) => {
    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        {/* Pass the ref down to DynamicForm */}
        <DynamicForm ref={ref} formData={formData} />
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
