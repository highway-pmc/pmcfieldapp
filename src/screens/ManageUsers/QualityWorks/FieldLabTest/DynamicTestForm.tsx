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

// NOTE: You must ensure 'validateField' exists in './formValidation'
// or comment out its usage below if not needed.
// import {validateField} from './formValidation';sssssn*bsn*ssssss
const validateField = (field: any, value: any) => {
  // Placeholder: Implement your validation logic here.
  if (field.validations?.required && !value) {
    return field.validations.errorMessage || `${field.label} is required.`;
  }
  return '';
};

// Enable LayoutAnimation on Android for smooth collapse/expand animations
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// --- CORE TYPES ---

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

// InputItem: Defined by having an 'id' and 'type' property
export type InputItem = {
  id: string; // Unique ID for state management
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'radio';
  value: any;
  placeholder: string;
  validations: ValidationRules;
};

// DataItem: Defined by having 'label' and 'value', and NO 'type' property
export type DataItem = {
  label: string;
  value: string;
};

// Mixed type allows content to be either data or input
type MixedItem = DataItem | InputItem;

type BaseSection = {
  title?: string;
  sectionInfo?: string;
  notes?: string;
};

// **Recursive Section Type Definition: Uses a single 'items' array for all content**
export type Section = BaseSection &
  (
    | {
        type: 'info' | 'expandable';
        items?: MixedItem[]; // Single array for data and inputs
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

interface DynamicTestFormProps {
  formData: FormDataSchema;
}

// --- PROPS INTERFACES (Using 'any' for brevity) ---
interface SectionContentProps {
  section: Section;
  inputData: Record<string, any>;
  onValueChange: (input: InputItem, value: any) => void;
  inputErrors: Record<string, string>;
}

// --- RADIO COMPONENT ---
const YES_NO_OPTIONS = [
  {key: 'Yes', label: 'Yes', color: '#52b552'},
  {key: 'No', label: 'No', color: '#dc3545'},
  {key: 'NA', label: 'NA', color: '#6c757d'},
];

const YesNoRadioInput: React.FC<any> = ({input, value, onChange, error}) => {
  const handlePress = (optionKey: string) => {
    onChange(input, optionKey);
  };

  return (
    <View
      style={[
        styles.radioComponentContainer,
        error ? styles.radioErrorOuterBorder : {},
      ]}>
      <View style={styles.radioLabelWrapper}>
        <Text style={styles.inputLabel}>{input.label}</Text>
      </View>

      <View style={styles.radioGroupRow}>
        {YES_NO_OPTIONS.map((option, index) => {
          const isSelected = value === option.key;

          const buttonStyle = [
            styles.radioButton,
            isSelected
              ? {backgroundColor: option.color, borderColor: option.color}
              : styles.unselectedRadioButton,
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

// --- DROPDOWN COMPONENT (Simulated with Modal) ---
const DropdownInput: React.FC<any> = ({input, value, onChange, error}) => {
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

// --- CORE: SECTION CONTENT RENDERER ---
// ... (imports and types remain the same)

// --- CORE: SECTION CONTENT RENDERER ---
const SectionContent = ({
  section,
  inputData,
  onValueChange,
  inputErrors,
}: SectionContentProps) => {
  // Use a single items array as the source of truth
  const allItems = section.items || [];

  // Categorize items
  const dataItems: DataItem[] = []; // 1. Data-Only Items
  const regularInputs: InputItem[] = []; // 2. Regular Input Items
  // 3 & 4: Titles and Radio Inputs must maintain their original sequence.
  const sequencedTitlesAndRadios: Array<{title: string} | InputItem> = [];

  // Map to hold items that go into the grid (Data & Regular Inputs)
  const mixedGridItems: MixedItem[] = [];

  // 1. Process and categorize all items based on your sorting rules
  allItems.forEach(item => {
    // Check for 'type' to distinguish between DataItem and InputItem
    const isInput = (item as InputItem).type !== undefined;

    if (!isInput && (item as any).title) {
      // 3. Title-Only Item: Has 'title' but no 'type'
      sequencedTitlesAndRadios.push(item as {title: string});
    } else if (isInput) {
      const input = item as InputItem;
      if (input.type === 'radio') {
        // 4. Radio Input Item
        sequencedTitlesAndRadios.push(input);
      } else {
        // 2. Regular Input Item
        regularInputs.push(input);
      }
    } else {
      // 1. Data-Only Item
      dataItems.push(item as DataItem);
    }
  });

  // Combine Data and Regular Inputs for the grid display (at the top)
  mixedGridItems.push(...dataItems, ...regularInputs);

  // Helper function to render a single Data Item
  const renderDataItem = (item: DataItem, index: number) => (
    <View key={`data-${index}`} style={styles.gridItem}>
      <Text style={styles.dataLabel}>{item.label}</Text>
      <Text style={styles.dataValue}>{item.value}</Text>
    </View>
  );

  // Helper function to render a single Regular Input Item
  const renderRegularInput = (input: InputItem) => {
    const currentInputValue =
      inputData[input.id] !== undefined ? inputData[input.id] : input.value;
    const error = inputErrors[input.id];

    if (input.type === 'select') {
      return (
        <DropdownInput
          key={`input-${input.id}`}
          input={input}
          value={currentInputValue}
          onChange={onValueChange}
          error={error}
        />
      );
    }

    // Default Text/Number/Date Input
    return (
      <View key={`input-${input.id}`} style={styles.gridItem}>
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

  const renderTitleItem = (item: {title: string}, index: number) => (
    <Text key={`title-${index}`} style={styles.itemTitle}>
      {item.title}
    </Text>
  );

  return (
    <View style={styles.sectionContent}>
      {/* 1 & 2. RENDER MIXED GRID ITEMS (Data-Only and Regular Inputs - Displayed at top) */}
      {mixedGridItems.length > 0 && (
        <View style={styles.contentGrid}>
          {mixedGridItems.map((item, index) => {
            if ((item as InputItem).type) {
              return renderRegularInput(item as InputItem);
            } else {
              return renderDataItem(item as DataItem, index);
            }
          })}
        </View>
      )}

      {/* 3 & 4. RENDER SEQUENCED ITEMS (Titles and Radio Inputs) */}
      {sequencedTitlesAndRadios.length > 0 && (
        <View style={styles.radioInputsContainer}>
          {sequencedTitlesAndRadios.map((item, index) => {
            if ((item as any).title) {
              // It's a Title-Only item
              return renderTitleItem(item as {title: string}, index);
            } else {
              // It's a Radio Input item
              return renderRadioInput(item as InputItem);
            }
          })}
        </View>
      )}

      {section.notes && <Text style={styles.notesText}>{section.notes}</Text>}
    </View>
  );
};

// --- EXPANDABLE SECTION WRAPPER / MAIN FORM / STYLES (Unchanged logic, styles updated below) ---

// ... (ExpandableSection component remains the same)
const ExpandableSection: React.FC<any> = ({
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

// ... (DynamicTestForm component remains the same)
const DynamicTestForm: React.FC<DynamicTestFormProps> = ({formData}) => {
  const [isMainExpanded, setIsMainExpanded] = useState(true);
  const [inputData, setInputData] = useState<Record<string, any>>({});
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  // Initialize input data from the 'items' arrays
  useEffect(() => {
    const initialData: Record<string, any> = {};

    const initializeInputs = (sections: Section[]) => {
      sections.forEach(section => {
        if (section.type === 'subSection') {
          initializeInputs(section.sections);
        } else if (section.items) {
          section.items.forEach(item => {
            // Check if it's an input item by looking for 'type'
            if ((item as InputItem).type) {
              const input = item as InputItem;
              if (inputData[input.id] === undefined) {
                initialData[input.id] = input.value;
              }
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

// --- STYLES ---
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
  // --- UPDATED FOR CONSISTENCY: inputLabel and dataLabel styles are merged ---
  // The 'dataLabel' style is updated to match the 'inputLabel' (bold/semiblod and color)
  inputLabel: {
    fontSize: 13,
    fontWeight: '600', // Made this slightly bolder for consistency
    color: '#333',
    marginBottom: 3,
  },
  dataLabel: {
    fontSize: 13,
    fontWeight: '600', // MATCHES inputLabel
    color: '#333', // MATCHES inputLabel
    marginBottom: 3,
  },
  dataValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400', // Kept value less bold than label
  },
  // --------------------------------------------------------------------------
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
  // --- RADIO STYLES ---
  radioInputsContainer: {
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 0,
    marginTop: 5,
  },
  radioComponentContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  radioLabelWrapper: {
    width: '100%',
    marginBottom: 8,
  },
  // NOTE: radioLabelText is removed as inputLabel is used directly in YesNoRadioInput
  radioGroupRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 35,
  },
  radioButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    height: '100%',
    borderRadius: 6,
    borderWidth: 1,
  },
  unselectedRadioButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D0D0D0',
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
  radioErrorOuterBorder: {},
  // --- DROPDOWN STYLES ---
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
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 10,
    marginBottom: 8,
    width: '100%',
  },
});

export default DynamicTestForm;
