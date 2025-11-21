import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React, {forwardRef, useRef} from 'react'; // useImperativeHandle removed
import DynamicForm, {
  DynamicFormRef,
} from '../../../components/Form/DynamicForm';

interface TaskDetailsTabProps {
  formData: any;
  globalFormData: Record<string, any>;
  onGlobalValueChange: (fieldId: string, newValue: any) => void;
}

// --- Configuration Data Structures (Unchanged) ---

const pre_tensioning_headerTaskDetailsConfig = {
  mainTitle: 'Pre-Tensioning Basic Details',
  isMultiTask: false,
  isVariable: false,
  sections: [
    {
      title: 'Basic Details (Header)',
      type: 'expandable',
      items: [
        {
          id: '{{task unique id}}_Header_Bed_No',
          label: 'Bed No.',
          type: 'number',
          value: 0,
          placeholder: 'e.g., 123 (Integer up to 3 digits)',
          validations: {
            required: true,
            type: 'number',
            min: 1,
            max: 999,
            decimalPlaces: 0,
            errorMessage: 'Required: Must be a positive integer, Max 999.',
          },
        },
        {
          label: 'Theoretical Area of Strand (mm²) (A)',
          value: 'N/A',
        },
        {
          label: 'Theoretical Modulus of Elasticity (N/mm²) (B)',
          value: 'N/A',
        },
        {
          label: 'Theoretical Jack Force (kN/Strand)(F)',
          value: 'N/A',
        },
        {
          label: 'Theoretical Elongation (mm/m)(E)',
          value: 'N/A',
        },
        {
          label: 'No. of Cables above Neutral Axis (n1)',
          value: 'N/A',
        },
        {
          label: 'No. of Cables below Neutral Axis (n2)',
          value: 'N/A',
        },
        {
          id: '{{task unique id}}_Header_Actual_Area_of_Strand_C',
          label: 'Actual Area of Strand (mm²) (C)',
          type: 'number',
          value: 0,
          placeholder: 'e.g., 100.00 (Max 2 decimals)',
          validations: {
            required: true,
            type: 'number',
            min: 0.01,
            max: 500000.0,
            decimalPlaces: 2,
            errorMessage:
              'Required: Must be > 0, Max 500000, Max 2 decimal places.',
          },
        },
        {
          id: '{{task unique id}}_Header_Actual_Modulus_of_Elasticity_D',
          label: 'Actual Modulus of Elasticity (N/mm²) (D)',
          type: 'number',
          value: 0,
          placeholder: 'e.g., 200000.00 (Max 2 decimals)',
          validations: {
            required: true,
            type: 'number',
            min: 0.01,
            max: 500000.0,
            decimalPlaces: 2,
            errorMessage:
              'Required: Must be > 0, Max 500000, Max 2 decimal places.',
          },
        },
      ],
    },
  ],
};
const pre_tensioning_below_neutral_TaskDetailsConfig = {
  mainTitle: 'Pre-Tensioning Basic Details',
  isMultiTask: false,
  isVariable: false,
  sections: [
    {
      title: 'BN Inputs',
      type: 'non-expandable',
      items: [
        {
          id: '{{task unique id}}_Specimen1_L2',
          label: 'Length of HTS Wire (m) -Master grip to Master Grip (L2)',
          type: 'number',
          value: 0,
          placeholder: 'e.g., 50.000 (Max 3 decimals, Max 100)',
          validations: {
            required: true,
            type: 'number',
            min: 0.001,
            max: 100.0,
            decimalPlaces: 3,
            errorMessage:
              'Required: Must be > 0, Max 100, Max 3 decimal places.',
          },
        },
        {
          id: '{{task unique id}}_Specimen1_A2',
          label: 'Jack Ram Area (cm²)(A2)',
          type: 'number',
          value: 0,
          placeholder: 'e.g., 100.00 (Max 2 decimals, Max 50000)',
          validations: {
            required: true,
            type: 'number',
            min: 0.01,
            max: 50000.0,
            decimalPlaces: 2,
            errorMessage:
              'Required: Must be > 0, Max 50000, Max 2 decimal places.',
          },
        },
        {
          id: '{{task unique id}}_Specimen1_N2',
          label: 'No. of Jacks are used(N2)',
          type: 'number',
          value: 1,
          placeholder: 'e.g., 2 (Positive Integer, Max 100)',
          validations: {
            required: true,
            type: 'number',
            min: 1,
            max: 100.0,
            decimalPlaces: 0,
            errorMessage: 'Required: Must be a positive integer, Max 100.',
          },
        },
        {
          id: '{{task unique id}}_Specimen1_I2',
          label: 'Jack Efficiency (%)(I2)',
          type: 'number',
          value: 0,
          placeholder: 'e.g., 90.00 (Max 2 decimals, Max 100)',
          validations: {
            required: true,
            type: 'number',
            min: 0.01,
            max: 100.0,
            decimalPlaces: 2,
            errorMessage:
              'Required: Must be > 0, Max 100, Max 2 decimal places.',
          },
        },
        {
          id: '{{task unique id}}_Specimen1_applied_pressure',
          label: 'Applied pressure (Kg/cm²)',
          type: 'number',
          value: 0,
          placeholder: 'e.g., 1500.00 (Max 2 decimals)',
          validations: {
            required: true,
            type: 'number',
            min: 0.01,
            max: 100000.0,
            decimalPlaces: 2,
            errorMessage:
              'Required: Must be > 0, Max 100000, Max 2 decimal places.',
          },
        },
      ],
    },
  ],
};

const pre_tensioning_below_neutral_axisTaskDetailsConfig = {
  mainTitle: 'Pre-Tensioning Readings: Below Neutral Axis (BN)',
  isMultiTask: true,
  isVariable: true,
  variableSectionConfig: {
    addButtonLabel: 'Add Set of BN Readings',
    minSections: 1,
    maxSections: 10,
    title: 'BN Reading Set',
    cta: 'addSection',
  },
  sections: [
    {
      mainTitle: 'BN Readings 1',
      type: 'subSection',
      sections: [
        {
          title: 'Elongation Readings (Dynamically Generated)',
          type: 'expandable',
          items: [
            {
              id: '{{task unique id}}_Specimen1_elongation_jack_1',
              label: 'Elongation (mm)- jack 1',
              type: 'number',
              value: 0,
              placeholder: 'e.g., 50.00 (Max 2 decimals)',
              validations: {
                required: true,
                type: 'number',
                min: 0.01,
                max: 50000000.0,
                decimalPlaces: 2,
                errorMessage: 'Required: Must be a positive number.',
              },
            },
          ],
        },
      ],
    },
  ],
};

const pre_tensioning_above_neutral_axisTaskDetailsConfig = {
  mainTitle: 'Pre-Tensioning Readings: Above Neutral Axis (AN)',
  isMultiTask: true,
  isVariable: true,
  variableSectionConfig: {
    addButtonLabel: 'Add Set of AN Readings',
    minSections: 1,
    maxSections: 10,
    title: 'AN Reading Set',
    cta: 'addSection',
  },
  sections: [
    {
      mainTitle: 'AN Readings 1',
      type: 'subSection',
      sections: [
        {
          title: 'AN Inputs',
          type: 'expandable',
          items: [
            {
              id: '{{task unique id}}_Specimen1_L1',
              label: 'Length of HTS Wire (m) -Master grip to Master Grip (L1)',
              type: 'number',
              value: 0,
              placeholder: 'e.g., 50.000 (Max 3 decimals, Max 100)',
              validations: {
                required: true,
                type: 'number',
                min: 0.001,
                max: 100.0,
                decimalPlaces: 3,
                errorMessage:
                  'Required: Must be > 0, Max 100, Max 3 decimal places.',
              },
            },
            {
              id: '{{task unique id}}_Specimen1_A1',
              label: 'Jack Ram Area (cm²)(A1)',
              type: 'number',
              value: 0,
              placeholder: 'e.g., 100.00 (Max 2 decimals, Max 50000)',
              validations: {
                required: true,
                type: 'number',
                min: 0.01,
                max: 50000.0,
                decimalPlaces: 2,
                errorMessage:
                  'Required: Must be > 0, Max 50000, Max 2 decimal places.',
              },
            },
            {
              id: '{{task unique id}}_Specimen1_N1',
              label: 'No. of Jacks are used(N1)',
              type: 'number',
              value: 1,
              placeholder: 'e.g., 2 (Positive Integer, Max 100)',
              validations: {
                required: true,
                type: 'number',
                min: 1,
                max: 100.0,
                decimalPlaces: 0,
                errorMessage: 'Required: Must be a positive integer, Max 100.',
              },
            },
            {
              id: '{{task unique id}}_Specimen1_I1',
              label: 'Jack Efficiency (%)(I1)',
              type: 'number',
              value: 0,
              placeholder: 'e.g., 90.00 (Max 2 decimals, Max 100)',
              validations: {
                required: true,
                type: 'number',
                min: 0.01,
                max: 100.0,
                decimalPlaces: 2,
                errorMessage:
                  'Required: Must be > 0, Max 100, Max 2 decimal places.',
              },
            },
            {
              id: '{{task unique id}}_Specimen1_applied_pressure',
              label: 'Applied pressure (Kg/cm²)',
              type: 'number',
              value: 0,
              placeholder: 'e.g., 1500.00 (Max 2 decimals)',
              validations: {
                required: true,
                type: 'number',
                min: 0.01,
                max: 100000.0,
                decimalPlaces: 2,
                errorMessage:
                  'Required: Must be > 0, Max 100000, Max 2 decimal places.',
              },
            },
          ],
        },
        {
          title: 'Elongation Readings (Dynamically Generated)',
          type: 'expandable',
          items: [
            {
              id: '{{task unique id}}_Specimen1_elongation_jack_1',
              label: 'Elongation (mm)- jack 1',
              type: 'number',
              value: 0,
              placeholder: 'e.g., 50.00 (Max 2 decimals)',
              validations: {
                required: true,
                type: 'number',
                min: 0.01,
                max: 50000000.0,
                decimalPlaces: 2,
                errorMessage: 'Required: Must be a positive number.',
              },
            },
          ],
        },
        {
          title: 'AN Calculated Results',
          type: 'expandable',
          items: [
            {
              label: 'Modified Elongation (mm)(x1)',
              value: 'N/A',
            },
            {
              label: 'Minimum allowable elongation x1 (min)',
              value: 'N/A',
            },
            {
              label: 'Maximum allowable elongation x1 (max)',
              value: 'N/A',
            },
            {
              label: 'Modified Pressure (Kg/cm²)(P1)',
              value: 'N/A',
            },
            {
              label: 'Minimum allowable pressure P1 (min)',
              value: 'N/A',
            },
            {
              label: 'Maximum allowable pressure P1 (max)',
              value: 'N/A',
            },
            {
              label: 'Avg. Elongation Reading (mm)',
              value: 'N/A',
            },
            {
              label: 'Difference (Max - Min Elongation) (mm)',
              value: 'N/A',
            },
            {
              label: 'Status / Remarks',
              value: 'N/A',
            },
          ],
        },
      ],
    },
  ],
};

// --- Component Definition (Frontend Only) ---

const TaskDetailsTabPreTensioningOfWires = forwardRef<
  DynamicFormRef,
  TaskDetailsTabProps
>(({formData, globalFormData, onGlobalValueChange}, ref) => {
  // useRef is still present for DynamicForm components to potentially handle internal logic,
  // but it is no longer exposed via useImperativeHandle.
  const headerFormRef = useRef<DynamicFormRef>(null);
  const belowNeutralAxisFormRef = useRef<DynamicFormRef>(null);
  const aboveNeutralAxisFormRef = useRef<DynamicFormRef>(null);

  // The useImperativeHandle block that contained collectAllInputs has been removed.

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Header Section */}
      <DynamicForm
        ref={headerFormRef}
        formData={pre_tensioning_headerTaskDetailsConfig}
        globalFormData={globalFormData}
        onGlobalValueChange={onGlobalValueChange}
      />

      {/* Separator */}
      <View style={styles.separator} />

      {/* Below Neutral Axis Section */}
      <DynamicForm
        ref={belowNeutralAxisFormRef}
        formData={pre_tensioning_below_neutral_axisTaskDetailsConfig}
        globalFormData={globalFormData}
        onGlobalValueChange={onGlobalValueChange}
      />

      {/* Separator */}
      <View style={styles.separator} />

      {/* Above Neutral Axis Section */}
      <DynamicForm
        ref={aboveNeutralAxisFormRef}
        formData={pre_tensioning_above_neutral_axisTaskDetailsConfig}
        globalFormData={globalFormData}
        onGlobalValueChange={onGlobalValueChange}
      />
    </ScrollView>
  );
});

// --- Stylesheet (Unchanged) ---

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: '#fff',
    minHeight: '100%',
    padding: 10,
  },
  separator: {
    height: 2,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
    marginHorizontal: 10,
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

export default TaskDetailsTabPreTensioningOfWires;
