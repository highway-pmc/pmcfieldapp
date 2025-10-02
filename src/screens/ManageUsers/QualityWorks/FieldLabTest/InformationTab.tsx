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
  // InformationTab.tsx (The formData object)

  const formData = {
    mainTitle: 'Project & Material Testing',
    sections: [
      {
        title: 'Project Details & Safety Review (Mixed)',
        sectionInfo:
          'Fixed project data, regular checks, and radio controls combined.',
        type: 'expandable',
        items: [
          // --- Data Items (Rendered First) ---
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
          // --- Regular Input Items (Rendered Second - None in this example, but they would go here) ---

          // --- Radio Input Items (Rendered Third) ---
          {
            id: 'trafficDiversionApproved',
            label: 'Traffic diversion plan approved',
            type: 'radio',
            value: 'Yes',
            placeholder: 'Select Status',
            validations: {
              required: true,
              type: 'string',
              errorMessage: 'Traffic diversion status must be confirmed.',
            },
          },
          {
            id: 'safetyArrangements',
            label:
              'Whether all the safety arrangements including barricading are as per IRC SP 55',
            type: 'radio',
            value: 'NO',
            placeholder: 'Select Status',
            validations: {
              required: true,
              type: 'string',
              errorMessage: 'Safety compliance must be confirmed.',
            },
          },
          {
            id: 'groundImprovementDone',
            label: 'Ground improvement is done if required',
            type: 'radio',
            value: 'NA',
            placeholder: 'Select Status',
            validations: {
              required: true,
              type: 'string',
              errorMessage: 'Ground improvement status must be selected.',
            },
          },
          {
            id: 'gradeSurveyStakes1',
            label:
              'Adequate grade and survey stakes available for control of layer placement',
            type: 'radio',
            value: 'NO',
            placeholder: 'Select Status',
            validations: {
              required: true,
              type: 'string',
              errorMessage:
                'Grade and survey stake availability must be checked.',
            },
          },
        ],
      },
      {
        title: 'Test Parameters & Results (Mixed)',
        sectionInfo: 'Contains only data and regular/radio inputs for testing.',
        type: 'expandable',
        items: [
          // --- Data Items (Rendered First - None in this list) ---

          // --- Regular Input Items (Rendered Second) ---
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
              errorMessage: 'Temperature is required.',
            },
          },
          {
            id: 'testType',
            label: 'Type of Test',
            type: 'select',
            value: 'ucs',
            placeholder: 'Select Test Type',
            validations: {
              required: true,
              type: 'string',
              options: [
                {key: 'ucs', label: 'UCS'},
                {key: 'flex', label: 'Flexural'},
              ],
              errorMessage: 'Test type required.',
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
              decimalPlaces: 0,
              errorMessage: 'Humidity required.',
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
              errorMessage: 'Name required.',
            },
          },
          // --- Radio Input Items (Rendered Third) ---
          {
            id: 'gradeSurveyStakes',
            label:
              'Adequate grade and survey stakes available for control of layer placement',
            type: 'radio',
            value: 'NO',
            placeholder: 'Select Status',
            validations: {
              required: true,
              type: 'string',
              errorMessage: 'Stake availability must be checked.',
            },
          },
        ],
      },
      {
        title: 'Material Info (Data Only)',
        sectionInfo: 'Details about the materials used in the project.',
        type: 'info',
        items: [
          {label: 'Work category', value: 'Highway'},
          {label: 'Material Name', value: 'Fine Aggregate (Sand)'},
          {label: 'Material Category', value: 'Aggregate'},
          {label: 'Mix-design/ Source', value: 'River sand'},
        ],
      },
      // --- SUBSECTION 1 (Example of Nested Structure) ---
      {
        type: 'subSection',
        mainTitle: 'Sample 1',
        sections: [
          {
            title: 'General Info (Sample 1)',
            type: 'expandable',
            items: [
              {label: 'Sample ID', value: 'SAMP-001'},
              {label: 'Sample Location', value: 'Chainage 1+200'},
            ],
          },
          {
            title: 'Test Parameters & Results (Sample 1)',
            type: 'expandable',
            items: [
              {label: 'Project Name', value: 'Elevated Expressway'},
              {label: 'Name of the Client', value: 'NHAI'},
              {
                label: 'Name of the Concessionaire',
                value: 'XYZ Infrastructure Ltd',
              },
              {
                id: 'sample1_testerName',
                label: 'Tested By (Name)',
                type: 'text',
                value: 'Jane Doe',
                placeholder: 'Enter full name',
                validations: {
                  required: true,
                  type: 'string',
                  maxLength: 50,
                  errorMessage: 'Name required.',
                },
              },
              {
                id: 'sample1_resultValid',
                label: 'Sample Result Validated',
                type: 'radio',
                value: 'Yes',
                placeholder: 'Select Status',
                validations: {
                  required: true,
                  type: 'string',
                  errorMessage: 'Result status required.',
                },
              },
            ],
          },
        ],
      },
      // --- SUBSECTION 2 (Example of Nested Structure) ---
      {
        type: 'subSection',
        mainTitle: 'Sample 2',
        sections: [
          {
            title: 'General Info (Sample 2)',
            type: 'expandable',
            items: [
              {label: 'Sample ID', value: 'SAMP-002'},
              {label: 'Sample Location', value: 'Chainage 1+300'},
            ],
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
