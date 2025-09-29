import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';

// Import the validation utility
import {validateField} from './formValidation';

// Enable LayoutAnimation on Android for smooth collapse/expand animations
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// --- Types updated to reflect the new schema ---
// --- Types updated to reflect the new schema including recursion ---

type ValidationRules = {
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'url';
  min?: number;
  max?: number;
  decimalPlaces?: number;
  maxLength?: number;
  pattern?: string;
  options?: Array<{key: string; label: string}>;
  errorMessage?: string;
};

type InputItem = {
  id: string; // Unique ID for state management
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date';
  value: any;
  placeholder: string;
  validations: ValidationRules;
};

type DataItem = {
  label: string;
  value: string;
};

type BaseSection = {
  title?: string; // Title is optional for subSection wrapper
  sectionInfo?: string;
  notes?: string;
};

// **Recursive Section Type Definition**
export type Section = BaseSection &
  (
    | {
        type: 'info' | 'expandable'; // Simple sections (non-recursive)
        data?: DataItem[];
        inputs?: InputItem[];
      }
    | {
        type: 'subSection'; // Recursive wrapper
        mainTitle: string; // Title for the wrapper form header
        mainInfo?: DataItem[];
        sections: Section[]; // Recursively holds more sections/sub-sections
      }
  );

export type FormDataSchema = {
  mainTitle: string;
  mainInfo?: DataItem[];
  sections: Section[];
};

// The DynamicTestFormProps interface uses the updated schema
interface DynamicTestFormProps {
  formData: FormDataSchema;
}
// ... (Keep existing props interfaces for sub-components)

// --- Props interfaces ---
interface DropdownInputProps {
  input: InputItem;
  value: any;
  onChange: (input: InputItem, value: any) => void;
  error?: string;
}

interface SectionContentProps {
  section: Section;
  inputData: Record<string, any>;
  onValueChange: (input: InputItem, value: any) => void;
  inputErrors: Record<string, string>;
}

interface ExpandableSectionProps {
  section: Section;
  inputData: Record<string, any>;
  onValueChange: (input: InputItem, value: any) => void;
  inputErrors: Record<string, string>;
}

interface DynamicTestFormProps {
  formData: FormDataSchema;
}

// --- Sub-component to simulate a Dropdown (integrated logic/styles from CustomSelectDropdown) ---
const DropdownInput: React.FC<DropdownInputProps> = ({
  input,
  value,
  onChange,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption =
    input.validations.options?.find(opt => opt.key === value)?.label ||
    input.placeholder;

  const handleSelect = (optionKey: string) => {
    // The dynamic form expects the key to be passed to onValueChange
    onChange(input, optionKey);
    setModalVisible(false);
  };

  return (
    <View style={styles.gridItem}>
      <Text style={styles.inputLabel}>{input.label}</Text>

      {/* Dropdown Button styled to fit the form */}
      <TouchableOpacity
        style={[
          styles.textInput, // Use textInput for layout consistency
          styles.dropdownButton, // Custom dropdown styles
          error ? styles.inputErrorBorder : {},
        ]}
        onPress={() => setModalVisible(true)}>
        <Text
          style={value ? styles.dropdownValue : styles.dropdownPlaceholder}
          numberOfLines={1}>
          {selectedOption}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Dropdown Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <FlatList
              data={input.validations.options || []}
              keyExtractor={item => item.key}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(item.key)}>
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// --- Sub-component to render section content (data or inputs) ---
const SectionContent = ({
  section,
  inputData,
  onValueChange,
  inputErrors,
}: any) => {
  return (
    <View style={styles.sectionContent}>
      {section.data && (
        <View style={styles.contentGrid}>
          {section.data.map((item: any, index: any) => (
            <View key={index} style={styles.gridItem}>
              <Text style={styles.dataLabel}>{item.label}</Text>
              <Text style={styles.dataValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}
      {section.inputs && (
        <View style={styles.contentGrid}>
          {section.inputs.map((input, index) => {
            const currentInputValue =
              inputData[input.id] !== undefined
                ? inputData[input.id]
                : input.value;
            const error = inputErrors[input.id];

            if (input.type === 'select') {
              return (
                <DropdownInput
                  key={input.id}
                  input={input}
                  value={currentInputValue}
                  onChange={onValueChange} // Pass the handler
                  error={error}
                />
              );
            }

            // Default Text/Number Input (can be extended with separate components)
            return (
              <View key={input.id} style={styles.gridItem}>
                <Text style={styles.inputLabel}>{input.label}</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    error ? styles.inputErrorBorder : {},
                  ]}
                  placeholder={input.placeholder}
                  placeholderTextColor="#999"
                  value={currentInputValue}
                  onChangeText={text => onValueChange(input, text)} // Pass the full input object
                  keyboardType={input.type === 'number' ? 'numeric' : 'default'}
                />
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>
            );
          })}
        </View>
      )}
      {section.notes && <Text style={styles.notesText}>{section.notes}</Text>}
    </View>
  );
};

// --- Sub-component to handle expandable sections ---
const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  section,
  inputData,
  onValueChange,
  inputErrors,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.expandableSectionContainer}>
      <TouchableOpacity onPress={toggleExpand} style={styles.expandableHeader}>
        <View>
          <Text style={styles.subsectionTitle}>{section.title}</Text>
          {section.sectionInfo && (
            <Text style={styles.sectionInfoText}>{section.sectionInfo}</Text>
          )}
        </View>
        <Text style={styles.expandCollapseIcon}>{isExpanded ? '−' : '+'}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <SectionContent
          section={section}
          inputData={inputData}
          onValueChange={onValueChange}
          inputErrors={inputErrors}
        />
      )}
    </View>
  );
};

// --- Main component to render the dynamic form ---
const DynamicTestForm: React.FC<DynamicTestFormProps> = ({formData}) => {
  const [isMainExpanded, setIsMainExpanded] = useState(true);
  // State management remains local to this form instance
  const [inputData, setInputData] = useState<Record<string, any>>({});
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  // Initialize inputData state from the schema on mount
  useEffect(() => {
    const initialData: Record<string, any> = {};

    // Only initialize inputs in this level of sections (non-recursive)
    formData.sections.forEach(section => {
      // Avoid looking into recursive sub-sections for state initialization here
      if (section.type !== 'subSection' && section.inputs) {
        section.inputs.forEach(input => {
          initialData[input.id] = input.value;
        });
      }
    });
    setInputData(initialData);
  }, [formData]);

  const toggleMainExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsMainExpanded(!isMainExpanded);
  };

  /**
   * Handler for input value change, which also triggers validation.
   * This handles inputs belonging to the CURRENT DynamicTestForm instance.
   */
  const handleValueChange = (field: InputItem, newValue: any) => {
    // 1. Update the input value
    setInputData(prev => ({
      ...prev,
      [field.id]: newValue,
    }));

    // 2. Validate the new value
    const error = validateField(field, newValue);

    // 3. Update the error state
    setInputErrors(prev => ({
      ...prev,
      [field.id]: error,
    }));
  };

  // Give the recursive instance a slightly different look
  const isNested = formData.mainTitle !== 'Project & Material Testing';

  return (
    // Adjust scrollContainer to prevent double scrolling in nested forms
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        isNested && styles.nestedScroll,
      ]}>
      <View
        style={[styles.mainContainer, isNested && styles.recursiveContainer]}>
        {/* Main Header with Expand/Collapse */}
        <TouchableOpacity onPress={toggleMainExpand} style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerText}>
              {formData.mainTitle || 'Main Section'}
            </Text>
          </View>
          <Text style={styles.expandCollapseIcon}>
            {isMainExpanded ? '−' : '+'}
          </Text>
        </TouchableOpacity>

        {/* Collapsible Content */}
        {isMainExpanded && (
          <View>
            {/* Main Info */}
            {formData.mainInfo && formData.mainInfo.length > 0 && (
              <View style={styles.mainInfoContainer}>
                {formData.mainInfo.map((item, index) => (
                  <View key={index} style={styles.mainInfoItem}>
                    <Text style={styles.dataLabel}>{item.label}</Text>
                    <Text style={styles.dataValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Sections */}
            <View style={styles.sectionsContainer}>
              {formData.sections.map((section, index) => {
                if (section.type === 'subSection') {
                  // Pass the sub-section's data as a new formData object
                  return (
                    <View key={index}>
                      <DynamicTestForm
                        formData={{
                          mainTitle: section.mainTitle,
                          mainInfo: section.mainInfo,
                          sections: section.sections,
                        }}
                      />
                    </View>
                  );
                }
                // END RECURSIVE CALL

                // Handle regular section types ('expandable', 'info', 'inputs')
                if (section.type === 'expandable') {
                  return (
                    <ExpandableSection
                      key={index}
                      section={section as Section}
                      inputData={inputData}
                      onValueChange={handleValueChange}
                      inputErrors={inputErrors}
                    />
                  );
                } else {
                  // 'info' or 'inputs' (non-expandable)
                  return (
                    <View key={index} style={styles.nonExpandableSection}>
                      <View style={styles.nonExpandableHeader}>
                        <View>
                          <Text style={styles.subsectionTitle}>
                            {section.title}
                          </Text>
                          {section.sectionInfo && (
                            <Text style={styles.sectionInfoText}>
                              {section.sectionInfo}
                            </Text>
                          )}
                        </View>
                      </View>
                      <SectionContent
                        section={section as Section}
                        inputData={inputData}
                        onValueChange={handleValueChange}
                        inputErrors={inputErrors}
                      />
                    </View>
                  );
                }
              })}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 8,
  },
  mainContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ABBEFD',
    overflow: 'hidden',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ABBEFD',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainIcon: {
    marginRight: 10,
    fontSize: 17,
    color: '#333',
  },
  expandCollapseIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  mainInfoContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: '#e0e0e0',
  },
  mainInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionsContainer: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  nonExpandableSection: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    overflow: 'hidden',
  },
  nonExpandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
  },
  expandableSectionContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    overflow: 'hidden',
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  sectionContent: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    marginVertical: 3,
    marginHorizontal: 5,
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 12,
  },
  dataLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  dataValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginBottom: 3,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8, 
  },
  dropdownValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#999',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
  },
  modalContainer: {
    width: '85%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  dropdownItemText: {
    fontSize: 16, 
    color: '#333',
    fontWeight: '400',
  },
  inputErrorBorder: {
    borderColor: 'red', 
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 2,
  },
  notesText: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionInfoText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    fontStyle: 'italic',
    marginRight: 5,
  },
  nestedScroll: {
    flexGrow: 0,
    paddingVertical: 0,
  },
  recursiveContainer: {
    marginHorizontal: 0,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#C0C6FF', // Lighter border color for nesting
    
  },
  subSectionTitleRecursive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#606060',
    paddingHorizontal: 5,
    marginBottom: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default DynamicTestForm;
