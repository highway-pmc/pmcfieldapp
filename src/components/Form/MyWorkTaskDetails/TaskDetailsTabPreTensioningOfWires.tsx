import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
} from 'react';
import DynamicForm, {
  DynamicFormRef,
} from '../../../components/Form/DynamicForm'; // Ensure this path is correct

interface TaskDetailsTabProps {
  formData: any;
  globalFormData: Record<string, any>;
  onGlobalValueChange: (fieldId: string, newValue: any) => void;
}

// Helper function to get the unique task ID prefix (e.g., 'RFI123')
const getTaskUniqueId = () => {
  const bedNoId =
    pre_tensioning_headerTaskDetailsConfig.sections[0].items[0].id;
  // Assumes ID is structured like '{{task unique id}}_Header_Bed_No'
  const match = bedNoId.match(/(.+?)_Header_Bed_No/);
  return match ? match[1] : '{{task unique id}}';
};

// Base configuration for header section (unchanged from your prompt)
const pre_tensioning_headerTaskDetailsConfig = {
  mainTitle: 'Pre-Tensioning Basic Details',
  isMultiTask: false,
  isVariable: false,
  sections: [
    {
      title: 'Basic Details (Header)',
      type: 'nonExpandable',
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
          value: 'N/A (From web app)',
          readOnly: true,
        },
        {
          label: 'Theoretical Modulus of Elasticity (N/mm²) (B)',
          value: 'N/A (From web app)',
          readOnly: true,
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
        {
          label: 'Theoretical Jack Force (kN/Strand)(F)',
          value: 'N/A (From web app)',
          readOnly: true,
        },
        {
          label: 'Theoretical Elongation (mm/m)(E)',
          value: 'N/A (From web app)',
          readOnly: true,
        },
      ],
    },
  ],
};

// Function to generate dynamic specimen sections with correct jack inputs
const generateSpecimenSection = (
  specimenIndex: number,
  numJacks: number,
  axisIdentifier: string, // 'AN' or 'BN'
) => {
  const elongationItems = [];

  // Generate elongation fields for each jack
  for (let jackIndex = 1; jackIndex <= numJacks; jackIndex++) {
    elongationItems.push({
      id: `${getTaskUniqueId()}_Specimen${specimenIndex}_elongation_mm_jack_${jackIndex}_${axisIdentifier}`, // Unique ID structure for global data
      label: `Elongation (mm) - Jack ${jackIndex}`,
      type: 'number',
      value: 0,
      placeholder: 'e.g., 500.00',
      validations: {
        required: true,
        type: 'number',
        errorMessage: `Elongation for Jack ${jackIndex} is required.`,
      },
    });
  }

  return {
    mainTitle: `Specimen ${axisIdentifier} ${specimenIndex}`, // Updated title to show AN/BN
    type: 'subSection',
    sections: [
      {
        title: 'Specimen Inputs',
        type: 'expandable',
        items: [
          {
            id: `${getTaskUniqueId()}_Specimen${specimenIndex}_applied_pressure_${axisIdentifier}`, // Unique ID for applied pressure
            label: 'Applied pressure (Kg/cm²)',
            type: 'number',
            value: 0,
            placeholder: 'e.g., 200.00',
            validations: {
              required: true,
              type: 'number',
              errorMessage: 'Applied pressure is required.',
            },
          },
          // Dynamically generated elongation fields
          ...elongationItems,
        ],
      },
      // You can add calculated results section here if needed per specimen
    ],
  };
};

// Base config structure for AN section (excluding the dynamic specimen section for now)
const getBaseANConfig = (taskUniqueId: string) => ({
  mainTitle: 'Pre-Tensioning Readings: Above Neutral Axis (AN)',
  isMultiTask: true,
  isVariable: true,
  variableSectionConfig: {
    title: 'Specimen',
    minSections: 1,
    maxSections: 10,
    addButtonLabel: 'Add Specimen AN',
  },
  sections: [
    {
      title: 'AN Basic Data',
      type: 'expandable',
      items: [
        {
          label: 'No. of Cables above Neutral Axis (n1)',
          value: 'N/A (From web app)',
          readOnly: true,
        },
        {
          id: `${taskUniqueId}_Specimen1_L1`,
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
        {
          id: `${taskUniqueId}_Specimen1_A1`,
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
          id: `${taskUniqueId}_Specimen1_N1`,
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
          id: `${taskUniqueId}_Specimen1_I1`,
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
        {
          label: 'Modified Elongation (mm)(x1)',
          value: 'N/A (Calculated: (A*L1*B*E)/(C*D))',
          readOnly: true,
        },
        {
          label: 'Minimum allowable elongation x1 (min)',
          value: 'N/A (Calculated: .95* x1)',
          readOnly: true,
        },
        {
          label: 'Maximum allowable elongation x1 (max)',
          value: 'N/A (Calculated: 1.05* x1)',
          readOnly: true,
        },
        {
          label: 'Modified Pressure (Kg/cm²)(P1)',
          value: 'N/A (Calculated: (n1*F*100000)/(A1*N1*I1))',
          readOnly: true,
        },
        {
          label: 'Minimum allowable pressure P1 (min)',
          value: 'N/A (Calculated: .95* P1)',
          readOnly: true,
        },
        {
          label: 'Maximum allowable pressure P1 (max)',
          value: 'N/A (Calculated: 1.05* P1)',
          readOnly: true,
        },
      ],
    },
    // The dynamic specimen section (Specimen AN 1) will be inserted by the useEffect hook
  ],
});

// Base config structure for BN section (excluding the dynamic specimen section for now)
const getBaseBNConfig = (taskUniqueId: string) => ({
  mainTitle: 'Pre-Tensioning Readings: Below Neutral Axis (BN)',
  isMultiTask: true,
  isVariable: true,
  variableSectionConfig: {
    title: 'Specimen',
    minSections: 1,
    maxSections: 10,
    addButtonLabel: 'Add Specimen BN',
  },
  sections: [
    {
      title: 'BN Basic Data',
      type: 'expandable',
      items: [
        {
          label: 'No. of Cables below Neutral Axis (n2)',
          value: 'N/A (From web app)',
          readOnly: true,
        },
        {
          id: `${taskUniqueId}_Specimen1_L2`,
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
        {
          id: `${taskUniqueId}_Specimen1_A2`,
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
          id: `${taskUniqueId}_Specimen1_N2`,
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
          id: `${taskUniqueId}_Specimen1_I2`,
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
        {
          label: 'Modified Elongation (mm)(x2)',
          value: 'N/A (Calculated: (A*L2*B*E)/(C*D))',
          readOnly: true,
        },
        {
          label: 'Minimum allowable elongation x2 (min)',
          value: 'N/A (Calculated: .95* x2)',
          readOnly: true,
        },
        {
          label: 'Maximum allowable elongation x2 (max)',
          value: 'N/A (Calculated: 1.05* x2)',
          readOnly: true,
        },
        {
          label: 'Modified Pressure (Kg/cm²)(P2)',
          value: 'N/A (Calculated: (n2*F*100000)/(A2*N2*I2))',
          readOnly: true,
        },
        {
          label: 'Minimum allowable pressure P2 (min)',
          value: 'N/A (Calculated: .95* P2)',
          readOnly: true,
        },
        {
          label: 'Maximum allowable pressure P2 (max)',
          value: 'N/A (Calculated: 1.05* P2)',
          readOnly: true,
        },
      ],
    },
    // The dynamic specimen section (Specimen BN 1) will be inserted by the useEffect hook
  ],
});

const TaskDetailsTabPreTensioningOfWires = forwardRef<
  DynamicFormRef,
  TaskDetailsTabProps
>(({formData, globalFormData, onGlobalValueChange}, ref) => {
  const taskUniqueId = useMemo(() => getTaskUniqueId(), []);

  const headerFormRef = useRef<DynamicFormRef>(null);
  const belowNeutralAxisFormRef = useRef<DynamicFormRef>(null);
  const aboveNeutralAxisFormRef = useRef<DynamicFormRef>(null);

  // State to hold dynamic configurations
  const [aboveNeutralConfig, setAboveNeutralConfig] = useState(
    getBaseANConfig(taskUniqueId),
  );
  const [belowNeutralConfig, setBelowNeutralConfig] = useState(
    getBaseBNConfig(taskUniqueId),
  );

  // Expose collectAllInputs method for parent component
  useImperativeHandle(ref, () => ({
    collectAllInputs: () => {
      const header = headerFormRef.current?.collectAllInputs() || {
        inputData: {},
        inputErrors: {},
      };
      const an = aboveNeutralAxisFormRef.current?.collectAllInputs() || {
        inputData: {},
        inputErrors: {},
      };
      const bn = belowNeutralAxisFormRef.current?.collectAllInputs() || {
        inputData: {},
        inputErrors: {},
      };

      return {
        inputData: {...header.inputData, ...an.inputData, ...bn.inputData},
        inputErrors: {
          ...header.inputErrors,
          ...an.inputErrors,
          ...bn.inputErrors,
        },
      };
    },
  }));

  // Logic to dynamically update AN and BN sections based on N1/N2 inputs
  useEffect(() => {
    // 1. Get Jack Count Inputs
    const N1_ID = `${taskUniqueId}_Specimen1_N1`;
    const N2_ID = `${taskUniqueId}_Specimen1_N2`;

    // Default to 1 if not set or invalid
    const numJacksAN = Math.max(1, Math.floor(globalFormData[N1_ID] || 1));
    const numJacksBN = Math.max(1, Math.floor(globalFormData[N2_ID] || 1));

    // --- Update AN Configuration ---
    setAboveNeutralConfig(prevConfig => {
      // Find current variable sections (Specimens)
      const currentSpecimens = prevConfig.sections.filter(
        s => s.type === 'subSection',
      );
      const staticSections = prevConfig.sections.filter(
        s => s.type !== 'subSection',
      );

      const newSpecimens = currentSpecimens.map((specimen, idx) => {
        const specimenIndex = idx + 1;
        // Re-generate the specimen structure with the new jack count
        const newSpecimenSection = generateSpecimenSection(
          specimenIndex,
          numJacksAN,
          'AN',
        );

        // Use the old mainTitle to ensure the DynamicForm component re-indexing logic works
        newSpecimenSection.mainTitle = specimen.mainTitle;

        return newSpecimenSection;
      });

      // If there are no specimens yet (on initial load/reset)
      if (newSpecimens.length === 0) {
        newSpecimens.push(generateSpecimenSection(1, numJacksAN, 'AN'));
      }

      return {
        ...prevConfig,
        sections: [...staticSections, ...newSpecimens],
      };
    });

    // --- Update BN Configuration ---
    setBelowNeutralConfig(prevConfig => {
      // Find current variable sections (Specimens)
      const currentSpecimens = prevConfig.sections.filter(
        s => s.type === 'subSection',
      );
      const staticSections = prevConfig.sections.filter(
        s => s.type !== 'subSection',
      );

      const newSpecimens = currentSpecimens.map((specimen, idx) => {
        const specimenIndex = idx + 1;
        // Re-generate the specimen structure with the new jack count
        const newSpecimenSection = generateSpecimenSection(
          specimenIndex,
          numJacksBN,
          'BN',
        );

        // Use the old mainTitle to ensure the DynamicForm component re-indexing logic works
        newSpecimenSection.mainTitle = specimen.mainTitle;

        return newSpecimenSection;
      });

      // If there are no specimens yet (on initial load/reset)
      if (newSpecimens.length === 0) {
        newSpecimens.push(generateSpecimenSection(1, numJacksBN, 'BN'));
      }

      return {
        ...prevConfig,
        sections: [...staticSections, ...newSpecimens],
      };
    });
  }, [globalFormData, taskUniqueId]); // Dependency array: Re-run when globalFormData changes

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Header Section */}
      <DynamicForm
        ref={headerFormRef}
        formData={pre_tensioning_headerTaskDetailsConfig}
        globalFormData={globalFormData}
        onGlobalValueChange={onGlobalValueChange}
      />

      <View style={styles.separator} />

      {/* Below Neutral Axis Section with Dynamic Specimens */}
      <DynamicForm
        ref={belowNeutralAxisFormRef}
        formData={belowNeutralConfig}
        globalFormData={globalFormData}
        onGlobalValueChange={onGlobalValueChange}
      />

      <View style={styles.separator} />

      {/* Above Neutral Axis Section with Dynamic Specimens */}
      <DynamicForm
        ref={aboveNeutralAxisFormRef}
        formData={aboveNeutralConfig}
        globalFormData={globalFormData}
        onGlobalValueChange={onGlobalValueChange}
      />
    </ScrollView>
  );
});

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
});

export default TaskDetailsTabPreTensioningOfWires;
