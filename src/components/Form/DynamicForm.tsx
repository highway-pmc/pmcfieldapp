import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'; // Import forwardRef and useImperativeHandle
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
// @ts-ignore
import styles from './DynamicForm.styles';
import {
  Section,
  InputItem,
  FormDataSchema,
  DynamicTestFormProps,
} from './DynamicForm.types';
import {validateField} from './utils/formValidation';

// Import Renderer Components
import ExpandableSection from './SectionRenderers/ExpandableSection';
import SectionContent from './SectionRenderers/SectionContent';

// Define the interface for the methods the parent component can call via ref
export interface DynamicFormRef {
  collectAllInputs: () => {
    inputData: Record<string, any>;
    inputErrors: Record<string, string>;
  };
}

// Wrap the component with forwardRef
const DynamicForm = forwardRef<DynamicFormRef, DynamicTestFormProps>(
  ({formData}, ref) => {
    // Use 'ref' here
    const [isMainExpanded, setIsMainExpanded] = useState(true);
    const [inputData, setInputData] = useState<Record<string, any>>({});
    const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

    // Use a ref to hold references to nested DynamicForms (for subSections)
    const nestedFormRefs = React.useRef<Record<string, DynamicFormRef>>({});

    // Expose methods to the parent component via ref
    useImperativeHandle(ref, () => ({
      collectAllInputs,
    }));

    // Recursive function to collect data from nested DynamicForms
    const collectAllInputs = () => {
      let allData: Record<string, any> = {...inputData};
      let allErrors: Record<string, string> = {...inputErrors};

      // Recursively collect data from subSections
      formData.sections.forEach((section, index) => {
        if (section.type === 'subSection') {
          const subFormRef = nestedFormRefs.current[section.mainTitle];
          if (subFormRef) {
            const nestedData = subFormRef.collectAllInputs();
            allData = {...allData, ...nestedData.inputData};
            allErrors = {...allErrors, ...nestedData.inputErrors};
          }
        }
      });

      return {inputData: allData, inputErrors: allErrors};
    };

    // 1. Initialize input data (Logic remains the same)
    useEffect(() => {
      // ... (existing initialization logic)
      const initialData: Record<string, any> = {};

      const initializeInputs = (sections: Section[]) => {
        sections.forEach(section => {
          if (section.type === 'subSection') {
            initializeInputs(section.sections);
          } else if (section.items) {
            section.items.forEach(item => {
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

    // 2. State/Validation Handler (Logic remains the same)
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

    const isNested = formData.mainTitle !== 'Project & Material Testing'; // Heuristic for nested form

    // Function to set the ref for a nested DynamicForm
    const setNestedRef = (key: string, instance: DynamicFormRef | null) => {
      if (instance) {
        nestedFormRefs.current[key] = instance;
      } else {
        delete nestedFormRefs.current[key];
      }
    };

    return (
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isNested && styles.nestedScroll,
        ]}>
        <View
          style={[styles.mainContainer, isNested && styles.recursiveContainer]}>
          {/* ... Main Header ... */}
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
              {/* ... Main Info ... */}
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
                    // Recursion: Render another DynamicForm with a ref
                    return (
                      <View key={index}>
                        <DynamicForm
                          ref={instance =>
                            setNestedRef(section.mainTitle, instance)
                          }
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
                    // Expandable Section
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
                    // Non-Expandable/Info Section
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
  },
);

export default DynamicForm;
