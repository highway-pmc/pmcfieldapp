import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  NativeEventEmitter,
  ActivityIndicator, // Import ActivityIndicator for loading state
} from 'react-native';
import React, {useEffect, useState} from 'react';
import InformationTab from './MyWorkDynamicFrom/InformationTab';
import InspectionTab from './MyWorkDynamicFrom/InspectionTab';
import TaskDetailsTab from './MyWorkDynamicFrom/TaskDetailsTab';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {HeaderItems} from '../../constants/constants';
import {getInspectionChecklist, clearFormDetails} from './actions';

// Define the structure for form data to be passed to tabs
interface FormData {
  mainTitle: string;
  sections: any[];
}

// 1. DUMMY_INSPECTION_DATA has been removed.

// Placeholder data structure for the other tabs (keep until API is ready for them)
const DUMMY_FORM_DATA: FormData = {
  mainTitle: 'Project & Material Testing',
  sections: [
    {
      title: 'Project Details',
      sectionInfo: 'Key project details.',
      type: 'info',
      items: [
        {label: 'Project Name', value: 'Elevated Expressway'},
        {label: 'Client', value: 'NHAI'},
      ],
    },
  ],
};

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

  // Destructure the data, loading, and error states from Redux
  const {inspectionChecklist, loading, error} = useSelector(
    (state: any) => state.FormDetails,
  );

  const [activeTab, setActiveTab] = useState(TABS.INFORMATION);

  useEffect(() => {
    if (isFocused) {
      const payload = {
        projectId: '684181d57a306ccd976d8374',
        checklistName: 'lifting-transportation-and-erection-at-site',
      };
      // Fetch the checklist when the component is focused
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
  useEffect(() => {
    if (inspectionChecklist && !loading && !error) {
      console.log('API Inspection Checklist Data:', inspectionChecklist);
      // You can now view this data in your Metro/Chrome debugger console
    }
  }, [inspectionChecklist, loading, error]);
  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Function to render content based on tab and data availability
  const renderTabContent = () => {
    // 3. Handle loading and error states globally or specific to the Inspection tab
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

    switch (activeTab) {
      case TABS.INFORMATION:
        return <InformationTab formData={DUMMY_FORM_DATA} />;

      case TABS.INSPECTION:
        if (
          inspectionChecklist &&
          inspectionChecklist.inspectionChecklistSection
        ) {
          return (
            <InspectionTab
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
        return <TaskDetailsTab formData={DUMMY_TASK_DETAILS} />;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Bar for navigation */}
      <View style={styles.tabBar}>
        {/* ... (Your TouchableOpacity elements for tabs remain the same) ... */}
        {/* INFORMATION Tab */}
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
      </ScrollView>
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
  // Added new styles for loading/error state visibility
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200, // Ensure it's visible even on short lists
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#5A2AAF',
  },
});

export default TaskForm;
