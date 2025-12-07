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
      type: 'nonExpandable',
      items: [
        // 1. INPUT Field: Bed No.
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
        // 2. READONLY Field: Theoretical Area of Strand (mm²) (A)
        {
          label: 'Theoretical Area of Strand (mm²) (A)',
          value: 'N/A (From web app)',
          readOnly: true, // Explicitly marked as readOnly for clarity
        },
        // 3. READONLY Field: Theoretical Modulus of Elasticity (N/mm²) (B)
        {
          label: 'Theoretical Modulus of Elasticity (N/mm²) (B)',
          value: 'N/A (From web app)',
          readOnly: true,
        },
        // 4. INPUT Field: Actual Area of Strand (mm²) (C)
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
        // 5. INPUT Field: Actual Modulus of Elasticity (N/mm²) (D)
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
        // 6. READONLY Field: Theoretical Jack Force (kN/Strand)(F)
        {
          label: 'Theoretical Jack Force (kN/Strand)(F)',
          value: 'N/A (From web app)',
          readOnly: true,
        },
        // 7. READONLY Field: Theoretical Elongation (mm/m)(E)
        {
          label: 'Theoretical Elongation (mm/m)(E)',
          value: 'N/A (From web app)',
          readOnly: true,
        },
      ],
    },
  ],
};
const pre_tensioning_above_neutral_axisTaskDetailsConfig = {
  mainTitle: 'Pre-Tensioning Readings: Above Neutral Axis (AN)',
  isMultiTask: true,
  isVariable: false,
  sections: [
    {
      title: 'AN Basic Data',
      type: 'expandable',
      items: [
        // READONLY Field: No. of Cables above Neutral Axis (n1)
        {
          label: 'No. of Cables above Neutral Axis (n1)',
          value: 'N/A (From web app)',
          readOnly: true,
        },
        // INPUT Field: Length of HTS Wire (m) (L1)
        {
          id: 'length_of_hts_wire_m_for_above_neutral_L1',
          label: 'Length of HTS Wire (m) (L1)',
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
        // INPUT Field: Jack Ram Area (cm²)(A1)
        {
          id: 'jack_ram_area_cm2_a1_for_above_neutral_axis_A1',
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
        // INPUT Field: No. of Jacks are used(N1)
        {
          id: 'jack_efficiency_i1_for_above_neutral_axis_N1',
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
        // INPUT Field: Jack Efficiency (%)(I1)
        {
          id: 'jack_efficiency_i1_for_above_neutral_axis_I1',
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
      ],
    },
    {
      title: 'AN Calculated Results',
      type: 'expandable',
      items: [
        // READONLY Field: Modified Elongation (mm)(x1) - Formula: (A*L1*B*E)/(C*D)
        {
          label: 'Modified Elongation (mm)(x1)',
          value: 'N/A (Calculated: (A*L1*B*E)/(C*D))',
          readOnly: true,
        },
        // READONLY Field: Minimum allowable elongation x1 (min)
        {
          label: 'Minimum allowable elongation x1 (min)',
          value: 'N/A (Calculated: .95* x1)',
          readOnly: true,
        },
        // READONLY Field: Maximum allowable elongation x1 (max)
        {
          label: 'Maximum allowable elongation x1 (max)',
          value: 'N/A (Calculated: 1.05* x1)',
          readOnly: true,
        },
        // READONLY Field: Modified Pressure (Kg/cm²)(P1) - Formula: (n1*F*100000)/(A1*N1*I1)
        {
          label: 'Modified Pressure (Kg/cm²)(P1)',
          value: 'N/A (Calculated: (n1*F*100000)/(A1*N1*I1))',
          readOnly: true,
        },
        // READONLY Field: Minimum allowable pressure P1 (min)
        {
          label: 'Minimum allowable pressure P1 (min)',
          value: 'N/A (Calculated: .95* P1)',
          readOnly: true,
        },
        // READONLY Field: Maximum allowable pressure P1 (max)
        {
          label: 'Maximum allowable pressure P1 (max)',
          value: 'N/A (Calculated: 1.05* P1)',
          readOnly: true,
        },
        // Placeholder for User Input (e.g., Applied Pressure/Reading Field)
        // (Note: The provided list for AN only lists input fields L1, A1, N1, I1, which are included above)
      ],
    },
  ],
};

const pre_tensioning_below_neutral_axisTaskDetailsConfig = {
  mainTitle: 'Pre-Tensioning Readings: Below Neutral Axis (BN)',
  isMultiTask: true,
  isVariable: false,
  sections: [
    {
      title: 'BN Basic Data',
      type: 'expandable',
      items: [
        // READONLY Field: No. of Cables below Neutral Axis (n2)
        {
          label: 'No. of Cables below Neutral Axis (n2)',
          value: 'N/A (From web app)',
          readOnly: true,
        },
        // INPUT Field: Length of HTS Wire (m) (L2)
        {
          id: '{{task unique id}}_Specimen1_L2',
          label: 'Length of HTS Wire (m) (L2)',
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
        // INPUT Field: Jack Ram Area (cm²)(A2)
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
        // INPUT Field: No. of Jacks are used(N2)
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
        // INPUT Field: Jack Efficiency (%)(I2)
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
      ],
    },
    {
      title: 'BN Calculated Results',
      type: 'expandable',
      items: [
        // READONLY Field: Modified Elongation (mm)(x2) - Formula: (A*L2*B*E)/(C*D)
        {
          label: 'Modified Elongation (mm)(x2)',
          value: 'N/A (Calculated: (A*L2*B*E)/(C*D))',
          readOnly: true,
        },
        // READONLY Field: Minimum allowable elongation x2 (min)
        {
          label: 'Minimum allowable elongation x2 (min)',
          value: 'N/A (Calculated: .95* x2)',
          readOnly: true,
        },
        // READONLY Field: Maximum allowable elongation x2 (max)
        {
          label: 'Maximum allowable elongation x2 (max)',
          value: 'N/A (Calculated: 1.05* x2)',
          readOnly: true,
        },
        // READONLY Field: Modified Pressure (Kg/cm²)(P2) - Formula: (n2*F*100000)/(A2*N2*I2)
        {
          label: 'Modified Pressure (Kg/cm²)(P2)',
          value: 'N/A (Calculated: (n2*F*100000)/(A2*N2*I2))',
          readOnly: true,
        },
        // READONLY Field: Minimum allowable pressure P2 (min)
        {
          label: 'Minimum allowable pressure P2 (min)',
          value: 'N/A (Calculated: .95* P2)',
          readOnly: true,
        },
        // READONLY Field: Maximum allowable pressure P2 (max)
        {
          label: 'Maximum allowable pressure P2 (max)',
          value: 'N/A (Calculated: 1.05* P2)',
          readOnly: true,
        },
        // Placeholder for User Input (e.g., Applied Pressure/Reading Field)
        // (Note: A standard input field for 'Applied Pressure' is typically added for actual measurements.)
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
