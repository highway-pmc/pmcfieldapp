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
 * Utility to replace the section index in IDs and titles (e.g., _1 -> _2)
 */
const replaceIndexInString = (
  str: string,
  oldIndex: number,
  newIndex: number,
): string => {
  // Regex to target the index at the end of a string: `_oldIndex`
  const regex = new RegExp(`_${oldIndex}$`);
  return str.replace(regex, `_${newIndex}`);
};

/**
 * Creates a new section by cloning the base section and updating all IDs and titles
 * to reflect the new index.
 */
const getNewSectionData = (
  baseSection: any,
  newIndex: number,
  prevIndex: number,
): Section => {
  const newSection: any = JSON.parse(JSON.stringify(baseSection));

  const traverseAndReplace = (sections: any): void => {
    sections?.forEach((section: any) => {
      // Update titles
      if (section.mainTitle) {
        section.mainTitle = replaceIndexInString(
          section.mainTitle,
          prevIndex,
          newIndex,
        );
        // Special case: update human-readable number in title (e.g., "Specimen X")
        section.mainTitle = section.mainTitle.replace(/\d+/, newIndex);
      }
      if (section.title) {
        section.title = replaceIndexInString(
          section.title,
          prevIndex,
          newIndex,
        );
      }

      // Update IDs and reset values for new sections
      if (section.items) {
        section.items.forEach((item: any) => {
          const input = item as InputItem;
          if (input.id) {
            input.id = replaceIndexInString(input.id, prevIndex, newIndex);
          }
          // Reset value for a newly created section
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
 * Extracts all input field IDs from a section.
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
 * Re-indexes sections and updates global data after a section is removed.
 */
const reIndexSectionsAndData = (
  sections: Section[],
  startIndex: number,
  onGlobalValueChange: (fieldId: string, newValue: any) => void,
): Section[] => {
  const updatedSections = [...sections];

  // Iterate over sections that follow the removed section
  for (let i = startIndex; i < updatedSections.length; i++) {
    const currentSection = updatedSections[i];
    const oldIndex = i + 2; // +1 for 1-based index, +1 because we skipped the deleted index
    const newIndex = i + 1; // The correct new 1-based index

    // Create a copy of the section structure with updated titles/IDs
    const reindexedSection = getNewSectionData(
      currentSection,
      newIndex,
      oldIndex,
    );

    // Update global data (move saved values from old ID to new ID)
    const oldIds = getInputIdsFromSection(currentSection); // original IDs (e.g., start_chainage_2)
    const newIds = getInputIdsFromSection(reindexedSection); // new IDs (e.g., start_chainage_1)

    oldIds.forEach((oldId, idIndex) => {
      const newId = newIds[idIndex];

      // Use the helper to access the current value before clearing the old ID
      const currentValue = currentSection.inputData?.[oldId] || null; // Access data for the current section if needed

      // Retrieve the value from the current global state (we don't have globalFormData here, so we rely on onGlobalValueChange)

      // 1. Set the value to the new ID
      // NOTE: This relies on the parent component's `globalFormData` to correctly apply this.
      // A more robust solution would pass globalFormData down and update the entire state object,
      // but sticking to the provided function signature:
      if (currentValue !== undefined && currentValue !== null) {
        onGlobalValueChange(newId, currentValue);
      } else {
        // If we don't know the exact value, we rely on the next fetch.
      }

      // 2. Clear the old ID from global state (important!)
      onGlobalValueChange(oldId, undefined);
    });

    // Replace the section structure with the re-indexed one
    updatedSections[i] = reindexedSection;
  }

  return updatedSections;
};

/**
 * A recursive form component that renders dynamic sections with expand/collapse functionality.
 * Supports adding and removing sections dynamically, nested subsections, and form validation.
 */
const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps>(
  ({formData, globalFormData, onGlobalValueChange}, ref) => {
    const [isMainExpanded, setIsMainExpanded] = useState<boolean>(true);
    const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

    // State to hold the current, potentially modified list of dynamic sections
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
     * Collects input data and errors from this form and all nested forms.
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
     * This handles loading of saved data into state variables.
     */
    useEffect(() => {
      const initialData: Record<string, any> = {};

      const initializeInputs = (sections: Section[]): void => {
        sections.forEach(section => {
          if (section.sections) {
            initializeInputs(section.sections);
          } else if (section.items) {
            section.items.forEach(item => {
              const input = item as InputItem;

              // Only initialize if the global state doesn't have a value AND a saved value exists
              // The parent TaskForm is responsible for populating globalFormData from checklist.savedData.
              if (
                globalFormData[input.id] === undefined &&
                input.value !== undefined
              ) {
                initialData[input.id] = input.value;
              }
            });
          }
        });
      };

      initializeInputs(dynamicSections);

      Object.keys(initialData).forEach(id => {
        // Only set if the field is truly empty in the global store
        if (globalFormData[id] === undefined) {
          onGlobalValueChange(id, initialData[id]);
        }
      });
    }, [dynamicSections, globalFormData, onGlobalValueChange]);

    const toggleMainExpand = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsMainExpanded(!isMainExpanded);
    };

    const handleValueChange = (field: InputItem, newValue: any) => {
      onGlobalValueChange(field.id, newValue);

      const error = validateField(field, newValue);

      setInputErrors((prev: any) => ({
        ...prev,
        [field.id]: error,
      }));
    };

    const isNested: boolean =
      formData.mainTitle !== 'Project & Material Testing';

    const setNestedRef = (key: string, instance: DynamicFormRef | null) => {
      if (instance) {
        nestedFormRefs.current[key] = instance;
      } else {
        delete nestedFormRefs.current[key];
      }
    };

    /**
     * Adds a new dynamic section.
     */
    const handleAddSection = () => {
      const config = formData.variableSectionConfig;
      if (!config || dynamicSections.length >= config.maxSections) {
        return;
      }

      const lastSection = dynamicSections[dynamicSections.length - 1];

      // Calculate the next index directly based on the array length
      const newIndex = dynamicSections.length + 1;

      // Find the index of the last section for replacement utility
      // We assume the last section's ID/Title ends in the current length (e.g., Specimen 1 for length 1)
      const prevIndex = dynamicSections.length;

      const newSection = getNewSectionData(lastSection, newIndex, prevIndex);
      // Ensure the display title is correct, even if ID replacement failed slightly
      newSection.mainTitle = `${config.addButtonLabel.replace(
        'Add ',
        '',
      )} ${newIndex}`;

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setDynamicSections((prev: any) => [...prev, newSection]);
    };

    /**
     * Removes a section and correctly re-indexes subsequent sections and clears data.
     */
    const handleRemoveSection = (indexToRemove: number) => {
      const config = formData.variableSectionConfig;
      if (!config || dynamicSections.length <= config.minSections) {
        return;
      }

      const sectionToRemove = dynamicSections[indexToRemove];
      const allInputIdsToRemove = getInputIdsFromSection(sectionToRemove);

      // 1. Remove data and errors for the deleted section
      allInputIdsToRemove.forEach(id => onGlobalValueChange(id, undefined));
      setInputErrors(prev => {
        const newErrors = {...prev};
        allInputIdsToRemove.forEach(id => delete newErrors[id]);
        return newErrors;
      });

      // 2. Filter out the removed section
      const sectionsAfterRemoval = dynamicSections.filter(
        (_, index) => index !== indexToRemove,
      );

      // 3. Re-index all subsequent sections and shift saved data
      // Start re-indexing from the index where the shift begins (which is indexToRemove)
      const reindexedSections = reIndexSectionsAndData(
        sectionsAfterRemoval,
        indexToRemove,
        onGlobalValueChange,
      );

      // 4. Update state with animation
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setDynamicSections(reindexedSections);
    };

    const isVariableSection: boolean = !!(
      formData.isVariable && formData.variableSectionConfig
    );
    const config = formData.variableSectionConfig;

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
                {dynamicSections?.map((section: any, index: any) => {
                  const isRemovable: boolean =
                    isVariableSection &&
                    config !== undefined &&
                    dynamicSections?.length > config.minSections;
                  const isSubSection: boolean = section.type === 'subSection';

                  // Dynamically adjust section display title based on current array index
                  const currentDisplayTitle = `${config?.title} ${index + 1}`;

                  return (
                    <View key={`${section.mainTitle}-${index}`}>
                      {/* Render nested form for subsections */}
                      {isSubSection ? (
                        // Render a DynamicForm instance for the subsection
                        <DynamicForm
                          ref={instance =>
                            setNestedRef(section.mainTitle!, instance)
                          }
                          formData={{
                            // Override mainTitle to ensure it's displayed correctly
                            mainTitle: section.mainTitle || currentDisplayTitle,
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
                                Remove {currentDisplayTitle}
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
                dynamicSections?.length < config.maxSections && (
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
