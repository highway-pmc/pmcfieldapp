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
import {getInspectionChecklist, clearFormDetails} from './actions';
// Import Tab Components
import InformationTab from './MyWorkDynamicFrom/InformationTab';
import InspectionTab from './MyWorkDynamicFrom/InspectionTab';
import TaskDetailsTab from './MyWorkDynamicFrom/TaskDetailsTab';
import {DynamicFormRef} from '../../components/Form/DynamicForm';
import {validateChainageIntervals} from '../../components/Form/utils/formValidation';
// Define the structure for form data to be passed to tabs
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

  // --- SECTION-WISE CENTRALIZED STATE (PERSISTS) ---
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

  // Helper to map section identifiers to their state setters
  const stateSetters = {
    projectInfoSection: setProjectInfoData,
    materialConsumptionSection: setMaterialConsumptionData,
    inspectionChecklistSection: setInspectionChecklistData,
    taskDetails: setTaskDetailsData,
  };

  // The universal update handler passed down to all DynamicForms
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
      // *** FUTURE CROSS-CALCULATION/REACTION LOGIC GOES HERE ***
    }
  };
  // ---------------------------------------------

  // 1. Refs for collecting validation errors from each tab (NOW PERSIST)
  const informationRef = useRef<DynamicFormRef>(null);
  const inspectionRef = useRef<DynamicFormRef>(null);
  const taskDetailsRef = useRef<DynamicFormRef>(null);

  const {inspectionChecklist, loading, error} = useSelector(
    (state: any) => state.FormDetails,
  );

  const [activeTab, setActiveTab] = useState(TABS.INFORMATION);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LIFECYCLE / REDUX FETCHING --- (No change)
  useEffect(() => {
    if (isFocused) {
      const payload = {
        projectId: '684181d57a306ccd976d8374',
        checklistName: 'dumping-soil',
        rfiId: '6841ecdec00f933c0c179699',
      };
      dispatch(getInspectionChecklist(payload));
    }
    return () => {
      if (!isFocused) {
        dispatch(clearFormDetails());
      }
    };
  }, [isFocused, dispatch]);

  useEffect(() => {
    if (isFocused) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.taskForm);
    }
  }, [isFocused]);

  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const getFormDataFromTabs = () => {
    let allErrors = {};
    let hasError = false;

    // --- 1. Collect initial errors from DynamicForm refs ---
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
    ); // Expected to be a number (e.g., 0)
    const projectEndChainage = Number(inspectionChecklist?.info?.endChainage); // Expected to be a number (e.g., 100)

    // Check if project chainage is valid before proceeding
    if (projectStartChainage >= projectEndChainage) {
      // If project limits are invalid, skip chainage validation but log/handle the error
      console.error('Project chainage limits are invalid or missing.');
    } else {
      // B. Extract all specimen chainage inputs from the centralized state (taskDetailsData)
      const specimenSections = inspectionChecklist?.taskDetails?.sections || []; // Use checklist config for structure

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

          // Use the value from the centralized component state (taskDetailsData) which is the source of truth
          const startValue = taskDetailsData[startItem.id] || startItem.value;
          const endValue = taskDetailsData[endItem.id] || endItem.value;

          const index = sectionIndex + 1;

          if (startValue && endValue) {
            return [{start: startValue, end: endValue, index: index}];
          }
          return [];
        },
      );

      // C. Run Validation
      const chainageErrors = validateChainageIntervals(
        chainageInputs,
        projectStartChainage,
        projectEndChainage,
      );

      // D. Populate Errors
      chainageErrors.forEach((err: any) => {
        allErrors[err.fieldId] = err.message;
        hasError = true;
      });
    }

    // --- 3. Aggregate the centralized STATE DATA for the final payload ---
    const allInputs = {
      projectInfoSection: projectInfoData,
      materialConsumptionSection: materialConsumptionData,
      inspectionChecklistSection: inspectionChecklistData,
      taskDetails: taskDetailsData,
    };
    console.log('All Inputs Collected:', allInputs);
    console.log('All Errors Collected:', allErrors);
    return {allInputs, allErrors, hasError};
  };

  const handleSave = async () => {
    if (isSaving || isSubmitting) return;
    const {allInputs, hasError, allErrors} = getFormDataFromTabs();

    // ... (rest of handleSave logic)
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);

    if (hasError) {
      Alert.alert('Validation Warning', 'One or more fields have errors.');
    } else {
      Alert.alert('Success', 'Form data has been saved.');
    }
  };

  const handleSubmit = async () => {
    if (isSaving || isSubmitting) return;
    const {allInputs, hasError} = getFormDataFromTabs();

    if (hasError) {
      Alert.alert(
        'Validation Error',
        'Please correct all validation errors before submitting.',
      );
      return;
    }

    // ... (rest of handleSubmit logic)
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    Alert.alert('Success', 'Form data has been submitted.');
  };

  const renderTabContent = () => {
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
    } = inspectionChecklist || {};

    // --- NEW LOGIC: Render all tabs conditionally visible based on activeTab state ---
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
              isMaterialRequested={isMaterialRequested} // Ensure boolean type
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
          {inspectionChecklist &&
          inspectionChecklist.inspectionChecklistSection ? (
            <InspectionTab
              ref={inspectionRef}
              formData={
                inspectionChecklist.inspectionChecklistSection as FormData
              }
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
          {/* Pass taskDetails from checklist if available, otherwise use DUMMY_TASK_DETAILS */}
          <TaskDetailsTab
            ref={taskDetailsRef}
            formData={inspectionChecklist?.taskDetails || null}
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
      {/* ScrollView now wraps the container for all tab content */}
      <ScrollView style={styles.contentContainer}>
        {renderTabContent()}
        <View style={styles.scrollViewPadding} />
      </ScrollView>

      {/* --- SAVE AND SUBMIT BUTTON BAR --- */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={isActionInProgress}>
          {isSaving ? (
            <ActivityIndicator color="#5A2AAF" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={isActionInProgress}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" /> // Use isSubmitting for Submit button indicator
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
