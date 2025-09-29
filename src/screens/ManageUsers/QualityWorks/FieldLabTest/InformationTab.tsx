import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
import {getTestDetailsTab1, clearTestDetailsTab1} from './actions';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import DynamicTestForm from './DynamicTestForm';

const InformationTab = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const {tab1TestDetails, loading, error} = useSelector(
    (state: any) => state.TestDetails,
  );
  const formData = {
    mainTitle: 'Project & Material Testing',
    // mainInfo: [
    //   {label: 'Project ID', value: 'PROJ-9876'},
    //   {label: 'Test Report #', value: 'TR-1234'},
    // ],
    sections: [
      {
        title: 'General Info',
        // sectionInfo:
        //   'This section provides an overview of the project details (Non-Editable).',
        type: 'expandable', // Non-expandable with info data
        data: [
          {label: 'Project Name', value: 'Elevated Expressway'},
          {label: 'Name of the Client', value: 'NHAI'},
          {
            label: 'Name of the Concessionaire',
            value: 'XYZ Infrastructure Ltd',
          },
          {
            label: 'Name of the EPC Contractor',
            value: 'PQR Constructions Pvt. Ltd',
          },
        ],
        //notes: 'All information is pre-filled and non-editable.',
      },
      {
        title: 'Test Parameters & Results',
        // sectionInfo:
        //   'Please enter the required test values and select the test type.',
        type: 'expandable', // Expandable with inputs directly inside
        inputs: [
          {
            id: 'roomTemp',
            label: 'Room Temperature',
            type: 'number',
            value: '25.500',
            placeholder: 'Max 3 decimals',
            validations: {
              required: true,
              type: 'number',
              min: 15.0,
              max: 35.0,
              decimalPlaces: 3,
              errorMessage:
                'Temperature must be between 15°C and 35°C (3 decimal limit).',
            },
          },
          {
            id: 'testType',
            label: 'Type of Test',
            type: 'select', // New dropdown type
            value: 'ucs',
            placeholder: 'Select Test Type',
            validations: {
              required: true,
              type: 'string',
              options: [
                {key: 'ucs', label: 'Unconfined Compressive Strength'},
                {key: 'flex', label: 'Flexural Strength'},
                {key: 'density', label: 'In-Situ Density'},
              ],
              errorMessage: 'A valid test type must be selected.',
            },
          },
          {
            id: 'humidity',
            label: 'Humidity (%)',
            type: 'number',
            value: '',
            placeholder: 'Enter humidity percentage',
            validations: {
              required: true,
              type: 'number',
              min: 0,
              max: 100,
              decimalPlaces: 0, // Integer only
              errorMessage: 'Humidity must be an integer between 0 and 100.',
            },
          },
          {
            id: 'testerName',
            label: 'Tested By (Name)',
            type: 'text',
            value: 'John Doe',
            placeholder: 'Enter full name',
            validations: {
              required: true,
              type: 'string',
              maxLength: 50,
              errorMessage: 'Name is required and limited to 50 characters.',
            },
          },
        ],
        //notes: 'Please ensure all field values are within specified limits.',
      },
      {
        title: 'Material Info (Fixed)',
        // sectionInfo: 'Details about the materials used in the project.',
        type: 'info',
        data: [
          {label: 'Work category', value: 'Highway'},
          {label: 'Material Name', value: 'Fine Aggregate (Sand)'},
          {label: 'Material Category', value: 'Aggregate'},
          {label: 'Mix-design/ Source', value: 'River sand'},
        ],
        //notes: 'This information is fixed from the project configuration.',
      },
      {
        type: 'subSection',
        mainTitle: 'Sample 1',
        sections: [
          {
            title: 'General Info',
            sectionInfo:
              'This section provides an overview of the project details (Non-Editable).',
            type: 'expandable', // Non-expandable with info data
            data: [
              {label: 'Project Name', value: 'Elevated Expressway'},
              {label: 'Name of the Client', value: 'NHAI'},
              {
                label: 'Name of the Concessionaire',
                value: 'XYZ Infrastructure Ltd',
              },
              {
                label: 'Name of the EPC Contractor',
                value: 'PQR Constructions Pvt. Ltd',
              },
            ],
            //notes: 'All information is pre-filled and non-editable.',
          },
          {
            title: 'Test Parameters & Results',
            // sectionInfo:
            //   'Please enter the required test values and select the test type.',
            type: 'expandable', // Expandable with inputs directly inside
            inputs: [
              {
                id: 'roomTemp',
                label: 'Room Temperature',
                type: 'number',
                value: '25.500',
                placeholder: 'Max 3 decimals',
                validations: {
                  required: true,
                  type: 'number',
                  min: 15.0,
                  max: 35.0,
                  decimalPlaces: 3,
                  errorMessage:
                    'Temperature must be between 15°C and 35°C (3 decimal limit).',
                },
              },
              {
                id: 'testType',
                label: 'Type of Test',
                type: 'select', // New dropdown type
                value: 'ucs',
                placeholder: 'Select Test Type',
                validations: {
                  required: true,
                  type: 'string',
                  options: [
                    {key: 'ucs', label: 'Unconfined Compressive Strength'},
                    {key: 'flex', label: 'Flexural Strength'},
                    {key: 'density', label: 'In-Situ Density'},
                  ],
                  errorMessage: 'A valid test type must be selected.',
                },
              },
              {
                id: 'humidity',
                label: 'Humidity (%)',
                type: 'number',
                value: '',
                placeholder: 'Enter humidity percentage',
                validations: {
                  required: true,
                  type: 'number',
                  min: 0,
                  max: 100,
                  decimalPlaces: 0, // Integer only
                  errorMessage:
                    'Humidity must be an integer between 0 and 100.',
                },
              },
              {
                id: 'testerName',
                label: 'Tested By (Name)',
                type: 'text',
                value: 'John Doe',
                placeholder: 'Enter full name',
                validations: {
                  required: true,
                  type: 'string',
                  maxLength: 50,
                  errorMessage:
                    'Name is required and limited to 50 characters.',
                },
              },
            ],
            //notes: 'Please ensure all field values are within specified limits.',
          },
          {
            title: 'Material Info (Fixed)',
            // sectionInfo: 'Details about the materials used in the project.',
            type: 'info',
            data: [
              {label: 'Work category', value: 'Highway'},
              {label: 'Material Name', value: 'Fine Aggregate (Sand)'},
              {label: 'Material Category', value: 'Aggregate'},
              {label: 'Mix-design/ Source', value: 'River sand'},
            ],
            //notes: 'This information is fixed from the project configuration.',
          },
        ],
      },
      {
        type: 'subSection',
        mainTitle: 'Sample 2',
        sections: [
          {
            title: 'General Info',
            sectionInfo:
              'This section provides an overview of the project details (Non-Editable).',
            type: 'expandable', // Non-expandable with info data
            data: [
              {label: 'Project Name', value: 'Elevated Expressway'},
              {label: 'Name of the Client', value: 'NHAI'},
              {
                label: 'Name of the Concessionaire',
                value: 'XYZ Infrastructure Ltd',
              },
              {
                label: 'Name of the EPC Contractor',
                value: 'PQR Constructions Pvt. Ltd',
              },
            ],
            //notes: 'All information is pre-filled and non-editable.',
          },
          {
            title: 'Test Parameters & Results',
            // sectionInfo:
            //   'Please enter the required test values and select the test type.',
            type: 'expandable', // Expandable with inputs directly inside
            inputs: [
              {
                id: 'roomTemp',
                label: 'Room Temperature',
                type: 'number',
                value: '25.500',
                placeholder: 'Max 3 decimals',
                validations: {
                  required: true,
                  type: 'number',
                  min: 15.0,
                  max: 35.0,
                  decimalPlaces: 3,
                  errorMessage:
                    'Temperature must be between 15°C and 35°C (3 decimal limit).',
                },
              },
              {
                id: 'testType',
                label: 'Type of Test',
                type: 'select', // New dropdown type
                value: 'ucs',
                placeholder: 'Select Test Type',
                validations: {
                  required: true,
                  type: 'string',
                  options: [
                    {key: 'ucs', label: 'Unconfined Compressive Strength'},
                    {key: 'flex', label: 'Flexural Strength'},
                    {key: 'density', label: 'In-Situ Density'},
                  ],
                  errorMessage: 'A valid test type must be selected.',
                },
              },
              {
                id: 'humidity',
                label: 'Humidity (%)',
                type: 'number',
                value: '',
                placeholder: 'Enter humidity percentage',
                validations: {
                  required: true,
                  type: 'number',
                  min: 0,
                  max: 100,
                  decimalPlaces: 0, // Integer only
                  errorMessage:
                    'Humidity must be an integer between 0 and 100.',
                },
              },
              {
                id: 'testerName',
                label: 'Tested By (Name)',
                type: 'text',
                value: 'John Doe',
                placeholder: 'Enter full name',
                validations: {
                  required: true,
                  type: 'string',
                  maxLength: 50,
                  errorMessage:
                    'Name is required and limited to 50 characters.',
                },
              },
            ],
            //notes: 'Please ensure all field values are within specified limits.',
          },
          {
            title: 'Material Info (Fixed)',
            // sectionInfo: 'Details about the materials used in the project.',
            type: 'info',
            data: [
              {label: 'Work category', value: 'Highway'},
              {label: 'Material Name', value: 'Fine Aggregate (Sand)'},
              {label: 'Material Category', value: 'Aggregate'},
              {label: 'Mix-design/ Source', value: 'River sand'},
            ],
            //notes: 'This information is fixed from the project configuration.',
          },
        ],
      },
    ],
  };
  useEffect(() => {
    if (isFocused) {
      const payload = {
        projectId: '684181d57a306ccd976d8374',
        testWorkCategoryType: 'base-sub-base',
        materialType: 'ctb',
        testType: 'unconfined-compressive-strength',
        subTestTypes: '',
      };
      dispatch(getTestDetailsTab1(payload));
    }
    return () => {
      if (!isFocused) {
        dispatch(clearTestDetailsTab1());
      }
    };
  }, [isFocused, dispatch]);

  if (loading) {
    return (
      <View style={[styles.tabContent, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  } else {
    console.log('tab1TestDetails', tab1TestDetails);
  }

  if (error) {
    return (
      <View style={[styles.tabContent, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!tab1TestDetails || Object.keys(tab1TestDetails).length === 0) {
    return (
      <View style={[styles.tabContent, styles.centered]}>
        <Text style={styles.dataText}>No data available for this tab.</Text>
      </View>
    );
  }

  const {otherInfo, prebasicDetails} = tab1TestDetails.tab1;

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <View>
        <DynamicTestForm formData={formData} />
      </View>
      <Text style={styles.contentTitle}>Information Tab Content</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Information</Text>
        {otherInfo?.map((item: any, index: number) => (
          <Text key={index} style={styles.dataText}>
            {item.label}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pre-basic Details</Text>
        {prebasicDetails?.map((item: any, index: number) => (
          <Text key={index} style={styles.dataText}>
            {item.prebasicDetailsDisplayName || item.prebasicDetails}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  dataText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default InformationTab;
