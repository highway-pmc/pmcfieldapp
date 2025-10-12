import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import styles from './DynamicForm.styles';
import {Section, InputItem, DynamicTestFormProps} from './DynamicForm.types';
import {validateField} from './utils/formValidation';

import ExpandableSection from './SectionRenderers/ExpandableSection';
import SectionContent from './SectionRenderers/SectionContent';

// Enable layout animations on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface EnhancedDynamicTestFormProps extends DynamicTestFormProps {
  isVariable?: boolean;
  variableSectionConfig?: any;
}

export interface DynamicFormProps extends EnhancedDynamicTestFormProps {
  globalFormData: Record<string, any>;
  onGlobalValueChange: (fieldId: string, newValue: any) => void;
}

export interface DynamicFormRef {
  collectAllInputs: () => {
    inputData: Record<string, any>;
    inputErrors: Record<string, string>;
  };
}

/**
 * Creates a new section by cloning the base section and updating all IDs and titles
 * to reflect the new index (e.g., from Specimen_1 to Specimen_2)
 */
const getNewSectionData = (
  baseSection: any,
  newIndex: number,
  prevIndex: number,
): Section => {
  const newSection: any = JSON.parse(JSON.stringify(baseSection));
  const prevIndexStr = `_${prevIndex}`;
  const newIndexStr = `_${newIndex}`;

  const replaceInString = (str: string): string =>
    str.replace(new RegExp(prevIndexStr + '$'), newIndexStr);

  const traverseAndReplace = (sections: any): void => {
    sections.forEach((section: any) => {
      if (section.mainTitle) {
        section.mainTitle = replaceInString(section.mainTitle);
      }
      if (section.title) {
        section.title = replaceInString(section.title);
      }

      if (section.items) {
        section.items.forEach((item: any) => {
          const input = item as InputItem;
          if (input.id) {
            input.id = replaceInString(input.id);
          }
          input.value = '';
        });
      }

      if (section.sections) {
        traverseAndReplace(section.sections);
      }
    });
  };

  traverseAndReplace([newSection]);
  return newSection;
};

/**
 * Extracts all input field IDs from a section and its nested sections
 * Used for cleanup when removing a section
 */
const getInputIdsFromSection = (section: any): string[] => {
  let ids: string[] = [];
  const extract = (s: any): void => {
    if (s.items) {
      s.items.forEach((item: any) => {
        if ((item as InputItem).id) {
          ids.push((item as InputItem).id);
        }
      });
    }
    if (s.sections) {
      s.sections.forEach(extract);
    }
  };
  extract(section);
  return ids;
};

/**
 * A recursive form component that renders dynamic sections with expand/collapse functionality.
 * Supports adding and removing sections dynamically, nested subsections, and form validation.
 */
const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps>(
  ({formData, globalFormData, onGlobalValueChange}, ref) => {
    const [isMainExpanded, setIsMainExpanded] = useState<boolean>(true);
    const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
    const [dynamicSections, setDynamicSections] = useState<any>(
      formData.sections,
    );

    // Stores references to nested form instances for data collection
    const nestedFormRefs = useRef<Record<string, DynamicFormRef>>({});

    // Sync dynamic sections when form data changes from parent
    useEffect(() => {
      setDynamicSections(formData.sections);
    }, [formData.sections]);

    // Expose collectAllInputs method to parent components
    useImperativeHandle(ref, () => ({
      collectAllInputs,
    }));

    /**
     * Collects input data and errors from this form and all nested forms
     */
    const collectAllInputs = () => {
      let allData: Record<string, any> = {...globalFormData};
      let allErrors: Record<string, string> = {...inputErrors};

      dynamicSections.forEach((section: any) => {
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

    /**
     * Initialize input values in global form data if they don't exist
     */
    useEffect(() => {
      const initialData: Record<string, any> = {};

      const initializeInputs = (sections: Section[]): void => {
        sections.forEach(section => {
          if (section.type === 'subSection') {
            initializeInputs(section.sections);
          } else if (section.items) {
            section.items.forEach(item => {
              if ((item as InputItem).type) {
                const input = item as InputItem;
                if (globalFormData[input.id] === undefined) {
                  initialData[input.id] = input.value;
                }
              }
            });
          }
        });
      };

      initializeInputs(dynamicSections);

      Object.keys(initialData).forEach(id => {
        onGlobalValueChange(id, initialData[id]);
      });
    }, [dynamicSections, globalFormData, onGlobalValueChange]);

    /**
     * Toggles the main section expand/collapse state with animation
     */
    const toggleMainExpand = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsMainExpanded(!isMainExpanded);
    };

    /**
     * Handles input value changes and validates the field
     */
    const handleValueChange = (field: InputItem, newValue: any) => {
      onGlobalValueChange(field.id, newValue);

      const error = validateField(field, newValue);

      setInputErrors((prev: any) => ({
        ...prev,
        [field.id]: error,
      }));
    };

    // Determines if this is a nested form based on the main title
    const isNested: boolean =
      formData.mainTitle !== 'Project & Material Testing';

    /**
     * Stores or removes nested form references
     */
    const setNestedRef = (key: string, instance: DynamicFormRef | null) => {
      if (instance) {
        nestedFormRefs.current[key] = instance;
      } else {
        delete nestedFormRefs.current[key];
      }
    };

    /**
     * Adds a new section by cloning the last section and updating its index
     */
    const handleAddSection = () => {
      const config = formData.variableSectionConfig;
      if (!config || dynamicSections.length >= config.maxSections) {
        return;
      }

      const lastSection = dynamicSections[dynamicSections.length - 1];
      const lastIndexMatch = lastSection.mainTitle.match(/(\d+)$/);
      const prevIndex = lastIndexMatch
        ? parseInt(lastIndexMatch[1], 10)
        : dynamicSections.length;

      const newIndex = prevIndex + 1;

      const newSection = getNewSectionData(lastSection, newIndex, prevIndex);
      newSection.mainTitle = `Specimen ${newIndex}`;

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setDynamicSections((prev: any) => [...prev, newSection]);
    };

    /**
     * Removes a section and clears all its input data and errors from global state
     */
    const handleRemoveSection = (indexToRemove: number) => {
      const config = formData.variableSectionConfig;
      if (!config || dynamicSections.length <= config.minSections) {
        return;
      }

      const sectionToRemove = dynamicSections[indexToRemove];
      const allInputIdsToRemove = getInputIdsFromSection(sectionToRemove);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setDynamicSections(prev =>
        prev.filter((_, index) => index !== indexToRemove),
      );

      allInputIdsToRemove.forEach(id => onGlobalValueChange(id, undefined));

      setInputErrors(prev => {
        const newErrors = {...prev};
        allInputIdsToRemove.forEach(id => delete newErrors[id]);
        return newErrors;
      });
    };

    const isVariableSection: boolean = !!(
      formData.isVariable && formData.variableSectionConfig
    );
    const config: VariableSectionConfig | undefined =
      formData.variableSectionConfig;

    return (
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isNested && styles.nestedScroll,
        ]}>
        <View
          style={[styles.mainContainer, isNested && styles.recursiveContainer]}>
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

          {isMainExpanded && (
            <View>
              {/* Render main info section if provided */}
              {formData.mainInfo && formData.mainInfo.length > 0 && (
                <View style={styles.mainInfoContainer}>
                  {formData.mainInfo.map((item: any, index: any) => (
                    <View key={index} style={styles.mainInfoItem}>
                      <Text style={styles.dataLabel}>{item.label}</Text>
                      <Text style={styles.dataValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.sectionsContainer}>
                {dynamicSections.map((section: any, index: any) => {
                  const isRemovable: boolean =
                    isVariableSection &&
                    config !== undefined &&
                    dynamicSections.length > config.minSections;
                  const isSubSection: boolean = section.type === 'subSection';

                  return (
                    <View key={`${section.mainTitle}-${index}`}>
                      {/* Render nested form for subsections */}
                      {isSubSection ? (
                        <DynamicForm
                          ref={instance =>
                            setNestedRef(section.mainTitle!, instance)
                          }
                          formData={{
                            mainTitle: section.mainTitle,
                            mainInfo: section.mainInfo,
                            sections: section.sections,
                          }}
                          globalFormData={globalFormData}
                          onGlobalValueChange={onGlobalValueChange}
                        />
                      ) : section.type === 'expandable' ? (
                        <ExpandableSection
                          key={index}
                          section={section}
                          inputData={globalFormData}
                          onValueChange={handleValueChange}
                          inputErrors={inputErrors}
                        />
                      ) : (
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
                            section={section}
                            inputData={globalFormData}
                            onValueChange={handleValueChange}
                            inputErrors={inputErrors}
                          />
                        </View>
                      )}

                      {/* Show remove button for dynamic subsections when allowed */}
                      {isVariableSection && isSubSection && (
                        <View style={styles.buttonContainer}>
                          {isRemovable && (
                            <TouchableOpacity
                              onPress={() => handleRemoveSection(index)}
                              style={styles.removeButton}>
                              <Text style={styles.removeButtonText}>
                                Remove {section.mainTitle}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Show add button when sections can still be added */}
              {isVariableSection &&
                config !== undefined &&
                dynamicSections.length < config.maxSections && (
                  <TouchableOpacity
                    onPress={handleAddSection}
                    style={styles.addButton}>
                    <Text style={styles.addButtonText}>
                      {config.addButtonLabel}
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          )}
        </View>
      </ScrollView>
    );
  },
);

export default DynamicForm;
