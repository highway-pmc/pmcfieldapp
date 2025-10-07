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
import InformationTab from './MyWorkDynamicFrom/InformationTab';
import InspectionTab from './MyWorkDynamicFrom/InspectionTab';
import TaskDetailsTab from './MyWorkDynamicFrom/TaskDetailsTab';
import {DynamicFormRef} from '../../components/Form/DynamicForm';

// Define the structure for form data to be passed to tabs
interface FormData {
  mainTitle: string;
  sections: any[];
}

const DUMMY_TASK_DETAILS: FormData = {
  mainTitle: 'Concrete Pour Task',
  sections: [
    {
      title: 'Task Info',
      type: 'info',
      items: [
        {label: 'Task ID', value: 'C-001'},
        {label: 'Start Date', value: '2025-01-10'},
        {label: 'Location', value: 'Pillar 15'},
      ],
    },
    {
      title: 'Task Inputs',
      type: 'expandable',
      items: [
        {
          id: 'mix_design_approved',
          label: 'Mix design approved',
          type: 'radio',
          value: 'Yes',
          validations: {required: true, type: 'string'},
        },
      ],
    },
  ],
};

const TABS = {
  INFORMATION: 'Information',
  INSPECTION: 'Inspection',
  TASK_DETAILS: 'Task Details',
};

const TaskForm = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  // 1. Refs for collecting data from each tab's DynamicForm
  const informationRef = useRef<DynamicFormRef>(null);
  const inspectionRef = useRef<DynamicFormRef>(null);
  const taskDetailsRef = useRef<DynamicFormRef>(null);

  const {inspectionChecklist, loading, error} = useSelector(
    (state: any) => state.FormDetails,
  );

  const [activeTab, setActiveTab] = useState(TABS.INFORMATION);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LIFECYCLE / REDUX FETCHING ---
  useEffect(() => {
    if (isFocused) {
      const payload = {
        projectId: '684181d57a306ccd976d8374',
        checklistName: 'lifting-transportation-and-erection-at-site',
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

  // --- SAVE AND SUBMIT LOGIC ---

  const getFormDataFromTabs = () => {
    let allInputs: Record<string, any> = {};
    let allErrors: Record<string, string> = {};
    let hasError = false;

    const refs = {
      [TABS.INFORMATION]: informationRef.current,
      [TABS.INSPECTION]: inspectionRef.current,
      [TABS.TASK_DETAILS]: taskDetailsRef.current,
    };

    // Iterate through all refs and call the exposed function to collect data
    for (const tabName in refs) {
      const ref = refs[tabName as keyof typeof refs];
      if (ref) {
        const {inputData, inputErrors} = ref.collectAllInputs();
        allInputs[tabName] = inputData;
        allErrors = {...allErrors, ...inputErrors};

        if (Object.values(inputErrors).some(err => err)) {
          hasError = true;
        }
      }
    }

    // CONSOLE ALL TAB INPUTS IN ORGANIZED WAY SIMULTANEOUSLY
    console.log('--- COLLECTED INPUTS (ALL TABS) SIMULTANEOUSLY ---');
    console.log('Information Tab Data:', allInputs[TABS.INFORMATION] || 'N/A');
    console.log('Inspection Tab Data:', allInputs[TABS.INSPECTION] || 'N/A');
    console.log(
      'Task Details Tab Data:',
      allInputs[TABS.TASK_DETAILS] || 'N/A',
    );
    console.log('--- ALL COLLECTED ERRORS ---');
    console.log(allErrors);
    console.log('----------------------------------------------------');

    // The final payload includes all inputs and a flag for errors
    return {allInputs, allErrors, hasError};
  };

  const handleSave = async () => {
    // Check if submitting is already in progress to prevent double action
    if (isSaving || isSubmitting) return;

    // Calls getFormDataFromTabs, which logs all data
    const {allInputs, hasError} = getFormDataFromTabs();

    if (hasError) {
      Alert.alert(
        'Warning',
        'Some fields have validation errors. Please check the form before saving.',
      );
    }

    // --- API CALL FOR SAVE ---
    console.log('Saving Data Payload (Full):', allInputs);

    setIsSaving(true);
    // Replace with actual API call / Redux dispatch and await
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSaving(false);
    Alert.alert('Success', 'Form data has been saved.');
  };

  const handleSubmit = async () => {
    // Check if saving is already in progress to prevent double action
    if (isSaving || isSubmitting) return;

    // Calls getFormDataFromTabs, which logs all data
    const {allInputs, hasError} = getFormDataFromTabs();

    if (hasError) {
      // Block submission if there are validation errors
      Alert.alert(
        'Validation Error',
        'Please correct all validation errors before submitting.',
      );
      return;
    }

    // --- API CALL FOR SUBMIT ---
    console.log('Submitting Data Payload (Full):', allInputs);

    setIsSubmitting(true); // Set submitting state
    // Replace with actual API call / Redux dispatch and await
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false); // Clear submitting state
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
    console.log(inspectionChecklist);
    switch (activeTab) {
      case TABS.INFORMATION:
        const projectInfo = inspectionChecklist?.projectInfoSection;
        const materialConsumption =
          inspectionChecklist?.materialConsumptionSection;
        console.log('Rendering InformationTab with data:', {
          projectInfo,
          materialConsumption,
        });
        if (projectInfo && materialConsumption) {
          return (
            <InformationTab
              ref={informationRef}
              projectInfoSection={projectInfo}
              materialConsumptionSection={materialConsumption}
            />
          );
        }
        return (
          <View style={styles.centered}>
            <Text style={styles.statusText}>
              Project info data is not available.
            </Text>
          </View>
        );

      case TABS.INSPECTION:
        if (
          inspectionChecklist &&
          inspectionChecklist.inspectionChecklistSection
        ) {
          // Pass ref to the InspectionTab wrapper
          return (
            <InspectionTab
              ref={inspectionRef}
              formData={
                inspectionChecklist.inspectionChecklistSection as FormData
              }
            />
          );
        }
        return (
          <View style={styles.centered}>
            <Text style={styles.statusText}>
              Inspection checklist data is not available.
            </Text>
          </View>
        );

      case TABS.TASK_DETAILS:
        return (
          <TaskDetailsTab ref={taskDetailsRef} formData={DUMMY_TASK_DETAILS} />
        );

      default:
        return null;
    }
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
