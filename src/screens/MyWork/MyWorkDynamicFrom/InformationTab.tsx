import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React, {forwardRef, useRef, useImperativeHandle, useEffect} from 'react';
import DynamicForm, {
  DynamicFormRef,
} from '../../../components/Form/DynamicForm';
import MaterialConsumptionForm from '../MaterialConsumptionForm';

interface InformationTabProps {
  projectInfoSection: any;
  materialConsumptionSection: any;
  prepareMaterialConsumption: any;
  rfiId: string;
  taskId: string;
  readOnly: boolean;
  isMaterialRequested: boolean;
  onMaterialSubmitSuccess?: () => void;
  projectInfoData: Record<string, any>;
  onProjectInfoChange: (fieldId: string, newValue: any) => void;
  materialConsumptionData: Record<string, any>;
  onMaterialConsumptionChange: (fieldId: string, newValue: any) => void;
}

const InformationTab = forwardRef<DynamicFormRef, InformationTabProps>(
  (
    {
      projectInfoSection,
      materialConsumptionSection,
      projectInfoData,
      onProjectInfoChange,
      materialConsumptionData,
      onMaterialConsumptionChange,
      prepareMaterialConsumption,
      isMaterialRequested,
      onMaterialSubmitSuccess,
      rfiId,
      taskId,
      readOnly,
    },
    ref,
  ) => {
    // Refs for collecting validation errors remain necessary
    const projectInfoRef = useRef<DynamicFormRef>(null);
    const materialConsumptionRef = useRef<DynamicFormRef>(null);
    // Use useImperativeHandle to expose the combined logic to the outside world (TaskForm)
    useEffect(() => {
      if (materialConsumptionSection) {
        console.log(
          'Material Consumption Section:',
          JSON.stringify(materialConsumptionSection),
        );
        console.log('readOnly', readOnly);
        console.log('isMaterialRequested:', isMaterialRequested);
      }
    });
    useImperativeHandle(ref, () => ({
      collectAllInputs: () => {
        let combinedInputErrors: Record<string, string> = {};

        // Collect ERRORS from Project Info Form via ref
        if (projectInfoRef.current) {
          const {inputErrors} = projectInfoRef.current.collectAllInputs();
          combinedInputErrors = {...combinedInputErrors, ...inputErrors};
        }

        // Collect ERRORS from Material Consumption Form via ref
        if (materialConsumptionRef.current) {
          const {inputErrors} =
            materialConsumptionRef.current.collectAllInputs();
          combinedInputErrors = {...combinedInputErrors, ...inputErrors};
        }

        return {
          inputData: {...projectInfoData, ...materialConsumptionData},
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
        {/* Render Project Info Section, passing state and setter */}
        {projectInfoSection && (
          <View>
            <DynamicForm
              ref={projectInfoRef}
              formData={projectInfoSection}
              globalFormData={projectInfoData}
              onGlobalValueChange={onProjectInfoChange}
            />
          </View>
        )}
        {materialConsumptionData && isMaterialRequested && !readOnly && (
          <View>
            <DynamicForm
              ref={materialConsumptionRef}
              formData={materialConsumptionSection}
              globalFormData={materialConsumptionData}
              onGlobalValueChange={onMaterialConsumptionChange}
            />
          </View>
        )}
        {!isMaterialRequested && !readOnly && (
          <View>
            <MaterialConsumptionForm
              materialData={prepareMaterialConsumption}
              rfiId={rfiId}
              taskId={taskId}
              onSubmissionSuccess={onMaterialSubmitSuccess}
            />
          </View>
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
