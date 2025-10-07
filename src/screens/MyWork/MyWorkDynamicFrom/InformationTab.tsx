import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React, {forwardRef, useRef, useImperativeHandle} from 'react'; // <--- Import useRef and useImperativeHandle
import DynamicForm, {
  DynamicFormRef,
} from '../../../components/Form/DynamicForm';

interface InformationTabProps {
  // Update interface to use the two specific props instead of a single formData
  projectInfoSection: any;
  materialConsumptionSection: any;
}

const InformationTab = forwardRef<DynamicFormRef, InformationTabProps>(
  ({projectInfoSection, materialConsumptionSection}, ref) => {
    // 1. Create separate internal refs for each DynamicForm
    const projectInfoRef = useRef<DynamicFormRef>(null);
    const materialConsumptionRef = useRef<DynamicFormRef>(null);
    console.log(
      'InformationTab - projectInfoSection:',
      projectInfoSection,
      'materialConsumptionSection:',
      materialConsumptionSection,
    );
    // 2. Use useImperativeHandle to expose the combined logic to the outside world (TaskForm)
    useImperativeHandle(ref, () => ({
      collectAllInputs: () => {
        let combinedInputData: Record<string, any> = {};
        let combinedInputErrors: Record<string, string> = {};

        // Collect data from Project Info Form
        if (projectInfoRef.current) {
          const {inputData, inputErrors} =
            projectInfoRef.current.collectAllInputs();
          // The data structure of Project Info is typically key-value pairs without specific IDs,
          // but we still include any potential input fields.
          combinedInputData = {...combinedInputData, ...inputData};
          combinedInputErrors = {...combinedInputErrors, ...inputErrors};
        }

        // Collect data from Material Consumption Form
        if (materialConsumptionRef.current) {
          const {inputData, inputErrors} =
            materialConsumptionRef.current.collectAllInputs();
          // The Material Consumption section has actual input fields (qty_consumed),
          // so this data and any errors will be merged here.
          combinedInputData = {...combinedInputData, ...inputData};
          combinedInputErrors = {...combinedInputErrors, ...inputErrors};
        }

        // Return the combined result
        return {
          inputData: combinedInputData,
          inputErrors: combinedInputErrors,
        };
      },
    }));

    // Optional: Check if at least one section is available
    if (
      (!projectInfoSection || Object.keys(projectInfoSection).length === 0) &&
      (!materialConsumptionSection ||
        Object.keys(materialConsumptionSection).length === 0)
    ) {
      return (
        <View style={[styles.tabContent, styles.centered]}>
          <Text style={styles.dataText}>No Information data available.</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        {/* Render Project Info Section, passing its internal ref */}
        {projectInfoSection && (
          <DynamicForm ref={projectInfoRef} formData={projectInfoSection} />
        )}

        {/* Render Material Consumption Section, passing its internal ref */}
        {materialConsumptionSection && (
          <DynamicForm
            ref={materialConsumptionRef}
            formData={materialConsumptionSection}
          />
        )}
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: '#fff',
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
