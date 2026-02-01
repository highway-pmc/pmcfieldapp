// TestForm component for Quality Works Field Lab Test
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useRef, useMemo} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getTestRfisForms} from '../actions';
import {useSnackbar} from '../../../../context/SnackbarContext';
import DynamicForm, {
  DynamicFormRef,
} from '../../../../components/Form/DynamicForm';
//import DynamicForm, {DynamicFormRef} from '../../components/Form/DynamicForm';

const TABS = {
  INFORMATION: 'Information',
  OBSERVATION: 'Observation',
  RESULT: 'Result',
};

const TestForm = ({route, navigation}: any) => {
  const {showSnackbar} = useSnackbar();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  const taskData = route.params?.taskData || {};
  const {testRfiData} = taskData;
  const projectId = loggedInUser?.projectId;
  const testRfiId = testRfiData?.id;

  const {
    testRfisForms,
    loading: apiLoading,
    error,
  } = useSelector((state: any) => state.TestRfisForms);

  // Section-wise centralized state
  const [generalInfoSection, setGeneralInfoSection] = useState<
    Record<string, any>
  >({});
  const [observationSection, setObservationSection] = useState<
    Record<string, any>
  >({});
  const [resultSection, setResultSection] = useState<Record<string, any>>({});

  const [activeTab, setActiveTab] = useState(TABS.INFORMATION);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for DynamicForm components
  const informationRef = useRef<DynamicFormRef>(null);
  const observationRef = useRef<DynamicFormRef>(null);
  const resultRef = useRef<DynamicFormRef>(null);

  const stateSetters = {
    generalInfoSection: setGeneralInfoSection,
    observationSection: setObservationSection,
    resultSection: setResultSection,
  };

  const handleUniversalValueChange = (
    sectionKey: keyof typeof stateSetters,
    fieldId: string,
    newValue: any,
  ) => {
    const setter = stateSetters[sectionKey];
    if (setter) {
      setter(prev => ({
        ...prev,
        [fieldId]: newValue,
      }));
    }
  };

  useEffect(() => {
    const projectId = loggedInUser?.projectId;
    if (projectId && testRfiId) {
      dispatch(getTestRfisForms({projectId, testRfiId}));
    }
  }, [dispatch, loggedInUser, testRfiId]);

  useEffect(() => {
    if (testRfisForms) {
      console.log('API call for getTestRfisForms successful:', testRfisForms);
      setFormData(testRfisForms.data);
      setLoading(false);
    } else if (error) {
      console.error('API call for getTestRfisForms failed:', error);
      showSnackbar('Failed to load form data', 'error');
      setLoading(false);
    }
  }, [testRfisForms, error, showSnackbar]);

  const getFormDataFromTabs = () => {
    let allErrors: Record<string, any> = {};
    let hasError = false;

    // Collect validation errors from DynamicForm refs
    const refs = {
      [TABS.INFORMATION]: informationRef.current,
      [TABS.OBSERVATION]: observationRef.current,
      [TABS.RESULT]: resultRef.current,
    };

    for (const tabName in refs) {
      const ref = refs[tabName as keyof typeof refs];
      if (ref) {
        const {inputErrors} = ref.collectAllInputs();
        allErrors = {...allErrors, ...inputErrors};
        if (Object.values(inputErrors).some(err => err)) {
          hasError = true;
        }
      }
    }

    // Aggregate the centralized STATE DATA for the final payload
    const allInputs = {
      generalInfoSection: generalInfoSection,
      observationSection: observationSection,
      resultSection: resultSection,
    };
    return {allInputs, allErrors, hasError};
  };

  const handleSubmit = () => {
    if (isSubmitting || loading || apiLoading) return;
    const {allInputs, hasError, allErrors} = getFormDataFromTabs();

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      showSnackbar('Test form submitted successfully!', 'success');
      navigation.goBack();
    }, 1000);
  };

  const renderTabContent = () => {
    if (loading || apiLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5A2AAF" />
          <Text style={styles.statusText}>Loading form...</Text>
        </View>
      );
    }

    if (!formData) {
      return (
        <View style={styles.centered}>
          <Text style={styles.statusText}>No form data available.</Text>
        </View>
      );
    }

    return (
      <>
        {/* INFORMATION TAB */}
        <View
          style={{
            display: activeTab === TABS.INFORMATION ? 'flex' : 'none',
            flex: 1,
          }}>
          {formData.headerSection ? (
            <DynamicForm
              ref={informationRef}
              formData={formData.headerSection}
              globalFormData={generalInfoSection}
              onGlobalValueChange={(fieldId, newValue) =>
                handleUniversalValueChange(
                  'generalInfoSection',
                  fieldId,
                  newValue,
                )
              }
            />
          ) : (
            <View style={styles.centered}>
              <Text style={styles.statusText}>
                Header section data is not available.
              </Text>
            </View>
          )}
        </View>

        {/* OBSERVATION TAB */}
        <View
          style={{
            display: activeTab === TABS.OBSERVATION ? 'flex' : 'none',
            flex: 1,
          }}>
          {formData.cardSection ? (
            <DynamicForm
              ref={observationRef}
              formData={{
                mainTitle: 'Observation',
                sections: formData.cardSection,
              }}
              globalFormData={observationSection}
              onGlobalValueChange={(fieldId, newValue) =>
                handleUniversalValueChange(
                  'observationSection',
                  fieldId,
                  newValue,
                )
              }
            />
          ) : (
            <View style={styles.centered}>
              <Text style={styles.statusText}>
                Card section data is not available.
              </Text>
            </View>
          )}
        </View>

        {/* RESULT TAB */}
        <View
          style={{
            display: activeTab === TABS.RESULT ? 'flex' : 'none',
            flex: 1,
          }}>
          {formData.cardSection ? (
            <DynamicForm
              ref={resultRef}
              formData={{mainTitle: 'Result', sections: formData.cardSection}}
              globalFormData={resultSection}
              onGlobalValueChange={(fieldId, newValue) =>
                handleUniversalValueChange('resultSection', fieldId, newValue)
              }
            />
          ) : (
            <View style={styles.centered}>
              <Text style={styles.statusText}>
                Result section data is not available.
              </Text>
            </View>
          )}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Bar for navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === TABS.INFORMATION && styles.activeTab,
          ]}
          onPress={() => setActiveTab(TABS.INFORMATION)}>
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.INFORMATION && styles.activeTabText,
            ]}>
            {TABS.INFORMATION}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === TABS.OBSERVATION && styles.activeTab,
          ]}
          onPress={() => setActiveTab(TABS.OBSERVATION)}>
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.OBSERVATION && styles.activeTabText,
            ]}>
            {TABS.OBSERVATION}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === TABS.RESULT && styles.activeTab,
          ]}
          onPress={() => setActiveTab(TABS.RESULT)}>
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.RESULT && styles.activeTabText,
            ]}>
            {TABS.RESULT}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content Area */}
      <ScrollView style={styles.contentContainer}>
        {renderTabContent()}
        <View style={styles.scrollViewPadding} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={isSubmitting || loading || apiLoading}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#D2C5FF',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: '#5A2AAF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabText: {
    color: '#6666664D',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#5A2AAF',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#5A2AAF',
  },
  scrollViewPadding: {
    height: 60,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#F7F3FF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  submitButton: {
    backgroundColor: '#5A2AAF',
    borderWidth: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TestForm;
