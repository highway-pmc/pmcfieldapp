import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  NativeEventEmitter,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {HeaderItems} from '../../constants/constants';
import {
  getInspectionChecklist,
  clearFormDetails,
  saveRfiFormData,
  saveRfiFormDataClear, // Import the new action
} from './actions';
// Import Tab Components
import InformationTab from './MyWorkDynamicFrom/InformationTab';
import InspectionTab from './MyWorkDynamicFrom/InspectionTab';
import TaskDetailsTab from './MyWorkDynamicFrom/TaskDetailsTab';
import {DynamicFormRef} from '../../components/Form/DynamicForm';
import {validateChainageIntervals} from '../../components/Form/utils/formValidation';

interface FormData {
  mainTitle: string;
  sections: any[];
}

const TABS = {
  INFORMATION: 'Information',
  INSPECTION: 'Inspection',
  TASK_DETAILS: 'Task Details',
};

const TaskForm = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  // --- SECTION-WISE CENTRALIZED STATE ---
  const [projectInfoData, setProjectInfoData] = useState<Record<string, any>>(
    {},
  );
  const [materialConsumptionData, setMaterialConsumptionData] = useState<
    Record<string, any>
  >({});
  const [inspectionChecklistData, setInspectionChecklistData] = useState<
    Record<string, any>
  >({});
  const [taskDetailsData, setTaskDetailsData] = useState<Record<string, any>>(
    {},
  );

  const stateSetters = {
    projectInfoSection: setProjectInfoData,
    materialConsumptionSection: setMaterialConsumptionData,
    inspectionChecklistSection: setInspectionChecklistData,
    taskDetails: setTaskDetailsData,
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

  const informationRef = useRef<DynamicFormRef>(null);
  const inspectionRef = useRef<DynamicFormRef>(null);
  const taskDetailsRef = useRef<DynamicFormRef>(null);

  const {
    inspectionChecklist,
    loading,
    error,
    rfiFormDataSaveResponse,
    saveError,
  } = useSelector((state: any) => state.FormDetails);

  const PROJECT_ID = '684181d57a306ccd976d8374';
  const RFI_ID = '68ec0473f124eedac12b23a1';
  const CHECKLIST_NAME = 'laying-and-compaction';

  const [activeTab, setActiveTab] = useState(TABS.INFORMATION);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchChecklist = () => {
    dispatch(
      getInspectionChecklist({
        projectId: PROJECT_ID,
        checklistName: CHECKLIST_NAME,
        rfiId: RFI_ID,
      }),
    );
  };

  // 1. Initial Load & Cleanup
  useEffect(() => {
    if (isFocused) {
      fetchChecklist();
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.taskForm);
    }
    return () => {
      if (!isFocused) {
        dispatch(clearFormDetails());
      }
    };
  }, [isFocused, dispatch]);

  // 2. Initialize state with saved data after fetch
  useEffect(() => {
    if (inspectionChecklist && inspectionChecklist.savedData) {
      const savedData = inspectionChecklist.savedData;
      console.log('Saved Data:', savedData);
      setProjectInfoData(savedData.projectInfoSection || {});
      setMaterialConsumptionData(savedData.materialConsumptionSection || {});
      setInspectionChecklistData(savedData.inspectionChecklistSection || {});
      setTaskDetailsData(savedData.taskDetails || {});
    }
  }, [inspectionChecklist]);

  // 3. Handle Save Success/Failure
  useEffect(() => {
    if (rfiFormDataSaveResponse) {
      // SUCCESS
      setIsSaving(false);
      Alert.alert(
        'Success',
        rfiFormDataSaveResponse.message ||
          'Form data has been saved successfully.',
      );

      // RECALL API TO RE-FETCH THE LATEST DATA
      fetchChecklist();

      // Clear the response data
      dispatch(saveRfiFormDataClear());
    } else if (saveError) {
      // FAILURE (using the dedicated saveError field)
      setIsSaving(false);
      Alert.alert(
        'Save Failed',
        saveError.message ||
          'The form data could not be saved. Please try again.',
      );
      // Clear the error data (though the reducer should handle this on next request)
      dispatch(saveRfiFormDataClear());
    }
  }, [rfiFormDataSaveResponse, saveError, dispatch]);

  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const getFormDataFromTabs = () => {
    let allErrors = {};
    let hasError = false;

    // Collect validation errors from DynamicForm refs
    const refs = {
      [TABS.INFORMATION]: informationRef.current,
      [TABS.INSPECTION]: inspectionRef.current,
      [TABS.TASK_DETAILS]: taskDetailsRef.current,
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

    const projectStartChainage = Number(
      inspectionChecklist?.info?.startChainage,
    );
    const projectEndChainage = Number(inspectionChecklist?.info?.endChainage);

    // Chainage validation logic
    if (projectStartChainage < projectEndChainage) {
      const specimenSections = inspectionChecklist?.taskDetails?.sections || [];

      const chainageInputs = specimenSections.flatMap(
        (section: any, sectionIndex: any) => {
          const items = section.sections.flatMap(
            (subSection: any) => subSection.items || [],
          );
          const startItem = items.find((item: any) =>
            item.id.startsWith('start_chainage_'),
          );
          const endItem = items.find((item: any) =>
            item.id.startsWith('end_chainage_'),
          );
          const startValue = taskDetailsData[startItem?.id] || startItem?.value;
          const endValue = taskDetailsData[endItem?.id] || endItem?.value;
          const index = sectionIndex + 1;

          return startValue && endValue
            ? [{start: startValue, end: endValue, index: index}]
            : [];
        },
      );

      const chainageErrors = validateChainageIntervals(
        chainageInputs,
        projectStartChainage,
        projectEndChainage,
      );

      chainageErrors.forEach((err: any) => {
        allErrors[err.fieldId] = err.message;
        hasError = true;
      });
    } else {
      console.error('Project chainage limits are invalid or missing.');
    }

    // Aggregate the centralized STATE DATA for the final payload
    const allInputs = {
      projectInfoSection: projectInfoData,
      materialConsumptionSection: materialConsumptionData,
      inspectionChecklistSection: inspectionChecklistData,
      taskDetails: taskDetailsData,
    };
    return {allInputs, allErrors, hasError};
  };

  const handleSave = () => {
    if (isSaving || isSubmitting || loading) return; // Disable if loading the checklist initially
    const {allInputs, hasError, allErrors} = getFormDataFromTabs();

    // if (hasError) {
    //   const errorMessages = Object.values(allErrors).filter(
    //     (message, index, self) => message && self.indexOf(message) === index,
    //   );

    //   const formattedErrorList = errorMessages.join('\n\n');

    //   Alert.alert(
    //     'Validation Warning',
    //     formattedErrorList || 'One or more fields have errors.',
    //   );
    //   return;
    // }

    setIsSaving(true);
    dispatch(
      saveRfiFormData({
        projectId: PROJECT_ID,
        rfiId: RFI_ID,
        formData: allInputs, // Pass the aggregated form data
      }),
    );
  };

  const handleSubmit = async () => {
    if (isSaving || isSubmitting || loading || error) return;
    const {allInputs, hasError, allErrors} = getFormDataFromTabs();

    if (hasError) {
      const errorMessages = Object.values(allErrors).filter(
        (message, index, self) => message && self.indexOf(message) === index,
      );
      const formattedErrorList = errorMessages.join('\n\n');

      Alert.alert(
        'Validation Warning',
        formattedErrorList || 'One or more fields have errors.',
      );
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    Alert.alert('Success', 'Form data has been submitted.');
  };

  const renderTabContent = () => {
    // Check initial load error (error fetching checklist)
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5A2AAF" />
          <Text style={styles.statusText}>Loading checklist...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.statusText}>
            Error: Failed to load checklist.
          </Text>
        </View>
      );
    }

    const {
      isMaterialRequested,
      materialConsumptionSection,
      prepareMaterialConsumption,
      projectInfoSection,
      inspectionChecklistSection,
      taskDetails,
    } = inspectionChecklist || {};

    return (
      <>
        {/* INFORMATION TAB */}
        <View
          style={{
            display: activeTab === TABS.INFORMATION ? 'flex' : 'none',
            flex: 1,
          }}>
          {projectInfoSection ||
          materialConsumptionSection ||
          prepareMaterialConsumption ? (
            <InformationTab
              ref={informationRef}
              projectInfoSection={projectInfoSection}
              materialConsumptionSection={materialConsumptionSection}
              prepareMaterialConsumption={prepareMaterialConsumption}
              isMaterialRequested={isMaterialRequested}
              projectInfoData={projectInfoData}
              onProjectInfoChange={(fieldId, newValue) =>
                handleUniversalValueChange(
                  'projectInfoSection',
                  fieldId,
                  newValue,
                )
              }
              materialConsumptionData={materialConsumptionData}
              onMaterialConsumptionChange={(fieldId, newValue) =>
                handleUniversalValueChange(
                  'materialConsumptionSection',
                  fieldId,
                  newValue,
                )
              }
            />
          ) : (
            <View style={styles.centered}>
              <Text style={styles.statusText}>
                Project info data is not available.
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
          {inspectionChecklistSection ? (
            <InspectionTab
              ref={inspectionRef}
              formData={inspectionChecklistSection as FormData}
              globalFormData={inspectionChecklistData}
              onGlobalValueChange={(fieldId, newValue) =>
                handleUniversalValueChange(
                  'inspectionChecklistSection',
                  fieldId,
                  newValue,
                )
              }
            />
          ) : (
            <View style={styles.centered}>
              <Text style={styles.statusText}>
                Inspection checklist data is not available.
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
          <TaskDetailsTab
            ref={taskDetailsRef}
            formData={taskDetails || null}
            globalFormData={taskDetailsData}
            onGlobalValueChange={(fieldId, newValue) =>
              handleUniversalValueChange('taskDetails', fieldId, newValue)
            }
          />
        </View>
      </>
    );
  };

  const isActionInProgress = isSaving || isSubmitting;

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Bar for navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === TABS.INFORMATION && styles.activeTab,
          ]}
          onPress={() => switchTab(TABS.INFORMATION)}>
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.INFORMATION && styles.activeTabText,
            ]}>
            {TABS.INFORMATION}
          </Text>
        </TouchableOpacity>

        {/* INSPECTION Tab */}
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === TABS.INSPECTION && styles.activeTab,
          ]}
          onPress={() => switchTab(TABS.INSPECTION)}>
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.INSPECTION && styles.activeTabText,
            ]}>
            {TABS.INSPECTION}
          </Text>
        </TouchableOpacity>

        {/* TASK DETAILS Tab */}
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === TABS.TASK_DETAILS && styles.activeTab,
          ]}
          onPress={() => switchTab(TABS.TASK_DETAILS)}>
          <Text
            style={[
              styles.tabText,
              activeTab === TABS.TASK_DETAILS && styles.activeTabText,
            ]}>
            {TABS.TASK_DETAILS}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content Area */}
      <ScrollView style={styles.contentContainer}>
        {renderTabContent()}
        <View style={styles.scrollViewPadding} />
      </ScrollView>

      {/* --- SAVE AND SUBMIT BUTTON BAR --- */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={isActionInProgress || loading || error}>
          {isSaving ? (
            <ActivityIndicator color="#5A2AAF" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={isActionInProgress || loading || error}>
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
    justifyContent: 'space-between',
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
    borderRadius: 30, // More rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#5A2AAF',
  },
  submitButton: {
    backgroundColor: '#5A2AAF',
    borderWidth: 0,
  },
  saveButtonText: {
    color: '#5A2AAF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TaskForm;
