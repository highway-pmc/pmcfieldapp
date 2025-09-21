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
import ExpandableSection from './ExpandableSection';

const InformationTab = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const {tab1TestDetails, loading, error} = useSelector(
    (state: any) => state.TestDetails,
  );
  const sectionsData = [
    {
      title: 'General Info',
      data: [
        {label: 'Project Name', value: 'Elevated Expressway'},
        {label: 'Name of the Client', value: 'NHAI'},
        {label: 'Name of the Concessionaire', value: 'XYZ Infrastructure Ltd'},
        {
          label: 'Name of the EPC Contractor',
          value: 'PQR Constructions Pvt. Ltd',
        },
      ],
    },
    {
      title: 'Material Info',
      data: [
        {label: 'Work category', value: 'Highway'},
        {label: 'Material Name', value: 'Fine Aggregate (Sand)'},
        {label: 'Material Category', value: 'Aggregate'},
        {label: 'Mix-design/ Source', value: 'River sand'},
      ],
    },
    {
      title: 'Basic Info',
      inputs: [
        {label: 'Date of Testing', placeholder: 'DD-MM-YYYY'},
        {label: 'Test Conducted By', placeholder: 'Enter name'},
        {label: 'Room Temperature', placeholder: '°C'},
        {label: 'Humidity in %', placeholder: '%'},
      ],
    },
  ];
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
        <ExpandableSection
          mainTitle="Material Test Report"
          sections={sectionsData}
        />
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
