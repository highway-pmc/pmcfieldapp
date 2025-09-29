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
type ValidationRules = {
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'url' | 'boolean';
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
  type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'radio';
  value: any;
  placeholder: string;
  validations: ValidationRules;
};

type DataItem = {
  label: string;
  value: string;
};

type BaseSection = {
  title?: string;
  sectionInfo?: string;
  notes?: string;
};

// **Recursive Section Type Definition**
export type Section = BaseSection &
  (
    | {
        type: 'info' | 'expandable';
        data?: DataItem[];
        inputs?: InputItem[];
      }
    | {
        type: 'subSection';
        mainTitle: string;
        mainInfo?: DataItem[];
        sections: Section[];
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

// --- Props interfaces ---
interface DropdownInputProps {
  input: InputItem;
  value: any;
  onChange: (input: InputItem, value: any) => void;
  error?: string;
}

// New Props Interface for the Radio Button Component
interface YesNoRadioInputProps {
  input: InputItem;
  value: string; // Expected value is 'Yes', 'NO', or 'NA'
  onChange: (input: InputItem, value: string) => void;
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

// --- NEW COMPONENT: Yes/No/NA Radio Group (UPDATED) ---
const YES_NO_OPTIONS = [
  {key: 'Yes', label: 'Yes', color: '#52b552'}, // Success Green
  {key: 'NO', label: 'NO', color: '#dc3545'}, // Danger Red
  {key: 'NA', label: 'NA', color: '#6c757d'}, // Secondary Gray
];

const YesNoRadioInput: React.FC<YesNoRadioInputProps> = ({
  input,
  value,
  onChange,
  error,
}) => {
  const handlePress = (optionKey: string) => {
    onChange(input, optionKey);
  };

  return (
    // Outer container for the whole component (label + buttons)
    <View
      style={[
        styles.radioComponentContainer,
        error ? styles.radioErrorOuterBorder : {},
      ]}>
      {/* 1. Question Label (Always takes full width line) */}
      <View style={styles.radioLabelWrapper}>
        <Text style={styles.radioLabelText}>{input.label}</Text>
      </View>

      {/* 2. Button Group (moved below the label, aligned right, smaller) */}
      <View style={styles.radioGroupRow}>
        {YES_NO_OPTIONS.map((option, index) => {
          const isSelected = value === option.key;

          const buttonStyle = [
            styles.radioButton,
            isSelected
              ? {backgroundColor: option.color, borderColor: option.color}
              : styles.unselectedRadioButton,
            // Add margin to separate buttons slightly (except the first one)
            index > 0 && {marginLeft: 6},
          ];

          const textStyle = isSelected
            ? styles.radioTextSelected
            : styles.radioTextUnselected;

          return (
            <TouchableOpacity
              key={option.key}
              style={buttonStyle}
              onPress={() => handlePress(option.key)}>
              <Text style={textStyle}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// --- Sub-component to simulate a Dropdown (Kept for completeness) ---
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
    onChange(input, optionKey);
    setModalVisible(false);
  };

  return (
    <View style={styles.gridItem}>
      <Text style={styles.inputLabel}>{input.label}</Text>
      <TouchableOpacity
        style={[
          styles.textInput,
          styles.dropdownButton,
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

// --- Sub-component to render section content (UPDATED LOGIC) ---
const SectionContent = ({
  section,
  inputData,
  onValueChange,
  inputErrors,
}: SectionContentProps) => {
  // 1. Separate radio inputs from regular inputs
  const regularInputs = (section.inputs || []).filter(
    input => input.type !== 'radio',
  );
  const radioInputs = (section.inputs || []).filter(
    input => input.type === 'radio',
  );

  const renderInput = (input: InputItem) => {
    const currentInputValue =
      inputData[input.id] !== undefined ? inputData[input.id] : input.value;
    const error = inputErrors[input.id];

    if (input.type === 'select') {
      return (
        <DropdownInput
          key={input.id}
          input={input}
          value={currentInputValue}
          onChange={onValueChange}
          error={error}
        />
      );
    }

    // Default Text/Number Input
    return (
      <View key={input.id} style={styles.gridItem}>
        <Text style={styles.inputLabel}>{input.label}</Text>
        <TextInput
          style={[styles.textInput, error ? styles.inputErrorBorder : {}]}
          placeholder={input.placeholder}
          placeholderTextColor="#999"
          value={currentInputValue}
          onChangeText={text => onValueChange(input, text)}
          keyboardType={input.type === 'number' ? 'numeric' : 'default'}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  const renderRadioInput = (input: InputItem) => {
    const currentInputValue =
      inputData[input.id] !== undefined ? inputData[input.id] : input.value;
    const error = inputErrors[input.id];

    return (
      <YesNoRadioInput
        key={input.id}
        input={input}
        value={currentInputValue}
        onChange={onValueChange}
        error={error}
      />
    );
  };

  return (
    <View style={styles.sectionContent}>
      {/* Display data first */}
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

      {/* 2. Render all regular inputs (text/number/select) first in grid layout */}
      {regularInputs.length > 0 && (
        <View style={styles.contentGrid}>{regularInputs.map(renderInput)}</View>
      )}

      {/* 3. Render all radio inputs last, each taking a full row */}
      {radioInputs.length > 0 && (
        <View style={styles.radioInputsContainer}>
          {radioInputs.map(renderRadioInput)}
        </View>
      )}

      {section.notes && <Text style={styles.notesText}>{section.notes}</Text>}
    </View>
  );
};

// --- Sub-component to handle expandable sections (Kept for completeness) ---
const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  section,
  inputData,
  onValueChange,
  inputErrors,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

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
          section={section as Section}
          inputData={inputData}
          onValueChange={onValueChange}
          inputErrors={inputErrors}
        />
      )}
    </View>
  );
};

// --- Main component to render the dynamic form (Kept for completeness) ---
const DynamicTestForm: React.FC<DynamicTestFormProps> = ({formData}) => {
  const [isMainExpanded, setIsMainExpanded] = useState(true);
  const [inputData, setInputData] = useState<Record<string, any>>({});
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialData: Record<string, any> = {};

    const initializeInputs = (sections: Section[]) => {
      sections.forEach(section => {
        if (section.type === 'subSection') {
          initializeInputs(section.sections);
        } else if (section.inputs) {
          section.inputs.forEach(input => {
            if (inputData[input.id] === undefined) {
              initialData[input.id] = input.value;
            }
          });
        }
      });
    };

    initializeInputs(formData.sections);

    setInputData(prev => ({...prev, ...initialData}));
  }, [formData]);

  const toggleMainExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsMainExpanded(!isMainExpanded);
  };

  const handleValueChange = (field: InputItem, newValue: any) => {
    setInputData(prev => ({
      ...prev,
      [field.id]: newValue,
    }));

    const error = validateField(field, newValue);

    setInputErrors(prev => ({
      ...prev,
      [field.id]: error,
    }));
  };

  const isNested = formData.mainTitle !== 'Project & Material Testing';

  return (
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

// --- STYLES ADDITIONS FOR RADIO BUTTON ---
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
  sectionsContainer: {
    paddingVertical: 6,
    paddingHorizontal: 6,
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
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 2,
  },
  // --- NEW/MODIFIED RADIO STYLES ---
  radioInputsContainer: {
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 0,
    marginTop: 5, // Small gap after other inputs/data
  },
  radioComponentContainer: {
    width: '100%',
    flexDirection: 'column', // Stack label and buttons vertically
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 5, // Indent slightly for visual grouping
  },
  radioLabelWrapper: {
    width: '100%', // Label takes full width
    marginBottom: 8,
  },
  radioLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  radioGroupRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align buttons to the right
    alignItems: 'center',
    height: 35, // Smaller height
  },
  radioButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15, // Control button width
    height: '100%',
    borderRadius: 6,
    borderWidth: 1,
  },
  unselectedRadioButton: {
    backgroundColor: '#FFFFFF', // Unselected background is white
    borderColor: '#D0D0D0', // Light gray border
  },
  radioTextUnselected: {
    color: '#666',
    fontWeight: '500',
    fontSize: 13,
  },
  radioTextSelected: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  radioErrorOuterBorder: {
    // No outer border styling needed if buttons handle their own error border
  },

  radioGroup: {
    flexDirection: 'row',
    // The group takes a fixed width or flex based on content/size
    width: 140, // Fixed width to make it compact
    height: 35, // Smaller height
    borderRadius: 6,
    overflow: 'hidden',
  },

  // Special style for unselected NA, as it uses the same gray as selected NA,
  // we ensure it has a distinct look when NOT selected.
  unselectedRadioButtonNA: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D0D0D0',
  },
  mainIcon: {
    marginRight: 10,
    fontSize: 17,
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
  // START: RADIO STYLES
  radioContainer: {
    width: '100%', // Radio buttons take full width
    marginBottom: 12,
  },
  radioLabel: {
    marginBottom: 8, // More space between label and buttons
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  radioText: {
    color: '#444', // Default text color
    fontWeight: '500',
    fontSize: 14,
  },
  radioErrorBorder: {
    borderColor: 'red',
    borderWidth: 2,
  },
  // END: RADIO STYLES
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
    borderColor: '#C0C6FF',
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
