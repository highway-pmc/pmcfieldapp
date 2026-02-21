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
import React, {useEffect, useState, useRef} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getTestRfisForms, saveOrSubmitTestRfisForm} from '../actions';
import {useSnackbar} from '../../../../context/SnackbarContext';
import DynamicForm, {
  DynamicFormRef,
} from '../../../../components/Form/DynamicForm';

const TABS = {
  INFORMATION: 'Information',
  INSPECTION: 'Inspection',
  TASK_DETAILS: 'Task Details',
};

const TestForm = ({route, navigation}: any) => {
  const {showSnackbar} = useSnackbar();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);

  const taskData = route.params?.taskData || {};
  const {testRfiData} = taskData;
  const testRfiId = testRfiData?.id;

  const {
    testRfisForms,
    loading: apiLoading,
    error,
    saveLoading,
    submitLoading,
    saveResponse,
    submitResponse,
  } = useSelector((state: any) => state.TestRfisForms);

  // Section-wise centralized state
  const [informationData, setInformationData] = useState<Record<string, any>>(
    {},
  );
  const [inspectionHeaderData, setInspectionHeaderData] = useState<
    Record<string, any>
  >({});
  const [inspectionCardData, setInspectionCardData] = useState<
    Record<string, any>
  >({});
  const [taskDetailsData, setTaskDetailsData] = useState<Record<string, any>>(
    {},
  );

  const [activeTab, setActiveTab] = useState(TABS.INFORMATION);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for DynamicForm components
  const informationRef = useRef<DynamicFormRef>(null);
  const inspectionHeaderRef = useRef<DynamicFormRef>(null);
  const inspectionCardRef = useRef<(DynamicFormRef | null)[]>([]);

  const stateSetters = {
    informationData: setInformationData,
    inspectionHeaderData: setInspectionHeaderData,
    inspectionCardData: setInspectionCardData,
    taskDetailsData: setTaskDetailsData,
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
      console.log(
        'API call for getTestRfisForms successful:',
        JSON.stringify(testRfisForms),
      );
      setFormData(testRfisForms);
      setLoading(false);
    } else if (error) {
      console.error('API call for getTestRfisForms failed:', error);
      showSnackbar('Failed to load form data', 'error');
      setLoading(false);
    }
  }, [testRfisForms, error, showSnackbar]);

  useEffect(() => {
    if (saveResponse) {
      console.log('Save successful:', saveResponse);
      showSnackbar('Form saved successfully!', 'success');
    } else if (error && saveLoading === false) {
      console.error('Save failed:', error);
      showSnackbar('Failed to save form', 'error');
    }
  }, [saveResponse, error, saveLoading, showSnackbar]);

  useEffect(() => {
    if (submitResponse) {
      console.log('Submit successful:', submitResponse);
      showSnackbar('Form submitted successfully!', 'success');
      navigation.goBack();
    } else if (error && submitLoading === false) {
      console.error('Submit failed:', error);
      showSnackbar('Failed to submit form', 'error');
      setIsSubmitting(false);
    }
  }, [submitResponse, error, submitLoading, showSnackbar, navigation]);

  const getFormDataFromTabs = () => {
    let allErrors: Record<string, any> = {};
    let hasError = false;

    // Collect validation errors from DynamicForm refs
    const refs = [
      informationRef.current,
      inspectionHeaderRef.current,
      ...(inspectionCardRef.current || []),
    ];

    refs.forEach(ref => {
      if (ref) {
        const {inputErrors} = ref.collectAllInputs();
        allErrors = {...allErrors, ...inputErrors};
        if (Object.values(inputErrors).some(err => err)) {
          hasError = true;
        }
      }
    });

    // Aggregate the centralized STATE DATA for the final payload
    const allInputs = {
      informationSections: informationData,
      headerSection: inspectionHeaderData,
      cardSection: inspectionCardData,
      taskDetails: taskDetailsData,
    };
    return {allInputs, allErrors, hasError};
  };

  const handleSave = () => {
    const {allInputs} = getFormDataFromTabs();
    console.log('Save button payload:', JSON.stringify(allInputs, null, 2));
    const projectId = loggedInUser?.projectId;
    if (projectId && testRfiId) {
      dispatch(
        saveOrSubmitTestRfisForm({
          projectId,
          testRfiId,
          action: 'save',
          formData: allInputs,
        }),
      );
    }
  };

  const handleSubmit = () => {
    if (isSubmitting || loading || apiLoading) return;
    const {allInputs, hasError, allErrors} = getFormDataFromTabs();

    if (hasError) {
      showSnackbar('Please fix validation errors.', 'error');
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting data:', JSON.stringify(allInputs, null, 2));

    const projectId = loggedInUser?.projectId;
    if (projectId && testRfiId) {
      dispatch(
        saveOrSubmitTestRfisForm({
          projectId,
          testRfiId,
          action: 'submit',
          formData: allInputs,
        }),
      );
    }
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
          {formData.informationSections ? (
            <DynamicForm
              ref={informationRef}
              formData={formData.informationSections}
              globalFormData={informationData}
              onGlobalValueChange={(fieldId, newValue) =>
                handleUniversalValueChange('informationData', fieldId, newValue)
              }
            />
          ) : (
            <View style={styles.centered}>
              <Text style={styles.statusText}>
                Information section data is not available.
              </Text>
            </View>
          )}
        </View>

        {/* INSPECTION TAB */}
        <View
          style={{
            display: activeTab === TABS.INSPECTION ? 'flex' : 'none',
            flex: 1,
          }}>
          {formData.headerSection && (
            <DynamicForm
              ref={inspectionHeaderRef}
              formData={formData.headerSection}
              globalFormData={inspectionHeaderData}
              onGlobalValueChange={(fieldId, newValue) =>
                handleUniversalValueChange(
                  'inspectionHeaderData',
                  fieldId,
                  newValue,
                )
              }
            />
          )}
          {formData.cardSection &&
            formData.cardSection.map((card: any, index: number) => (
              <DynamicForm
                key={index}
                ref={(el: DynamicFormRef | null) => {
                  inspectionCardRef.current[index] = el;
                }}
                formData={card}
                globalFormData={inspectionCardData}
                onGlobalValueChange={(fieldId, newValue) =>
                  handleUniversalValueChange(
                    'inspectionCardData',
                    fieldId,
                    newValue,
                  )
                }
              />
            ))}
          {!formData.headerSection && !formData.cardSection && (
            <View style={styles.centered}>
              <Text style={styles.statusText}>
                Inspection data is not available.
              </Text>
            </View>
          )}
        </View>

        {/* TASK DETAILS TAB */}
        <View
          style={{
            display: activeTab === TABS.TASK_DETAILS ? 'flex' : 'none',
            flex: 1,
          }}>
          <View style={styles.taskDetailsContainer}>
            <Text style={styles.taskDetailTitle}>Task Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Task ID:</Text>
              <Text style={styles.detailValue}>TSK-2024-001</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Assigned To:</Text>
              <Text style={styles.detailValue}>John Doe</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={styles.detailValue}>In Progress</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Priority:</Text>
              <Text style={styles.detailValue}>High</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Bar for navigation */}
      <View style={styles.tabBar}>
        {Object.values(TABS).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable Content Area */}
      <ScrollView style={styles.contentContainer}>
        {renderTabContent()}
        <View style={styles.scrollViewPadding} />
      </ScrollView>

      {/* Save and Submit Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={isSubmitting || loading || apiLoading || saveLoading}>
          {saveLoading ? (
            <ActivityIndicator color="#5A2AAF" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={isSubmitting || loading || apiLoading || submitLoading}>
          {isSubmitting || submitLoading ? (
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
  saveButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#5A2AAF',
  },
  saveButtonText: {
    color: '#5A2AAF',
    fontSize: 14,
    fontWeight: 'bold',
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
  taskDetailsContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    margin: 10,
  },
  taskDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: '600',
    width: 100,
    color: '#555',
  },
  detailValue: {
    color: '#333',
    flex: 1,
  },
});

export default TestForm;
