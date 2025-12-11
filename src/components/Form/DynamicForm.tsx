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
// Assuming the following files/types exist
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
 * Utility to replace the section index in IDs and titles (e.g., _S1 -> _S2 or Specimen 1 -> Specimen 2)
 */
const replaceIndexInString = (
  str: string,
  oldIndex: number,
  newIndex: number,
): string => {
  // Regex to target the index at the end of an ID: `_SoldIndex`
  const idRegex = new RegExp(`_S${oldIndex}$`);
  if (str.match(idRegex)) {
    return str.replace(idRegex, `_S${newIndex}`);
  }

  // Regex to target "Specimen" followed by a number (e.g., "Specimen1" or "Specimen 1")
  // This handles IDs like: {{task unique id}}_Specimen1_applied_pressure_BN
  const specimenInIdRegex = new RegExp(`Specimen${oldIndex}`, 'g');
  if (str.match(specimenInIdRegex)) {
    return str.replace(specimenInIdRegex, `Specimen${newIndex}`);
  }
  
  const titleNumberRegex = new RegExp(`(\\s|\\b)${oldIndex}(\\b)`);

  if (str.match(titleNumberRegex)) {
  
    const specimenTitleRegex = new RegExp(`(\\s)${oldIndex}(\\b|$)`, 'i');

    // If the string contains the index as a separate word, replace it.
    if (str.match(specimenTitleRegex)) {
      return str.replace(specimenTitleRegex, ` ${newIndex}`);
    }
  }

  // Fallback, should not happen for well-formed data
  return str;
};

/**
 * Creates a new section by cloning the base section and updating all IDs and titles
 * to reflect the new index.
 * It is critical that it also resets the value property for the cloned structure.
 */
const getNewSectionData = (
  baseSection: any,
  newIndex: number,
  prevIndex: number, // The 1-based index to replace (e.g., 1 if cloning Specimen 1)
  isCloningForAdd: boolean = true, // Flag to control value reset
): Section => {
  const newSection: any = JSON.parse(JSON.stringify(baseSection));
  console.log('getNewSectionData called with:', JSON.stringify(baseSection));

  const traverseAndReplace = (sections: any): void => {
    sections.forEach((section: any) => {
      // 1. Update titles (mainTitle, which holds "Specimen X")
      if (section.mainTitle) {
        section.mainTitle = replaceIndexInString(
          section.mainTitle,
          prevIndex,
          newIndex,
        );
      }
      // Update titles (title, typically static but included for safety)
      if (section.title) {
        // Only replace the index if it's part of the title's structure
        section.title = replaceIndexInString(
          section.title,
          prevIndex,
          newIndex,
        );
      }

      // 2. Update IDs and reset values for new sections
      if (section.items) {
        section.items.forEach((item: any) => {
          const input = item as InputItem;
          if (input.id) {
            input.id = replaceIndexInString(input.id, prevIndex, newIndex);
          }
          // Critical Data Reset (The Fix): Reset value for a newly created section
          if (isCloningForAdd) {
            input.value = '';
          }
          // NOTE: When re-indexing (isCloningForAdd = false), we keep the structural value as-is,
          // as the actual value is transferred via onGlobalValueChange.
        });
      }

      if (section.sections) {
        traverseAndReplace(section.sections);
      }
    });
  };

  traverseAndReplace([newSection]);
  console.log(
    'New section data after replacement:',
    JSON.stringify(newSection),
  );
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
 * @param sections The array of sections *after* the section to be removed has been filtered out.
 * @param startIndex The array index from which the re-indexing must begin.
 * @param onGlobalValueChange Function to update/clear globalFormData.
 * @param globalFormData The current global data map (needed for value lookup).
 */
const reIndexSectionsAndData = (
  sections: Section[],
  startIndex: number,
  onGlobalValueChange: (fieldId: string, newValue: any) => void,
  globalFormData: Record<string, any>,
): Section[] => {
  const updatedSections = [...sections];

  // Iterate over sections that follow the removal point (from startIndex onwards)
  for (let i = startIndex; i < updatedSections.length; i++) {
    const sectionToPromote = updatedSections[i];

    // The section's original 1-based index (e.g., if Specimen 3 is now at index 1 after removing Specimen 2)
    // The original array length was N. After removal, it is N-1.
    // Index i in the new array corresponds to the original index i+1's new position.
    // The index to be replaced in the data structure is the 'old' index.
    // If we removed index 1 (Specimen 2), and i=1 (Specimen 3), the old index is i+2 (3).
    // The new index is i+1 (2).

    // OldIndex is the 1-based index this section originally had (before re-indexing).
    // In a zero-indexed array after removal, the item at index 'i' was at original index 'i+1',
    // but the ID suffix refers to its *original* index before the removal.
    // If we remove section at array index `indexToRemove` (1-based index `indexToRemove+1`),
    // the item currently at array index `i` (where `i >= indexToRemove`)
    // originally had the 1-based index `i + 2`.
    const oldIndex = i + 2;

    // NewIndex is the correct 1-based index it should have now (after re-indexing)
    const newIndex = i + 1;

    // 1. Get the re-indexed structure (only changing IDs and Titles, NOT resetting values)
    const reindexedSection = getNewSectionData(
      sectionToPromote,
      newIndex,
      oldIndex,
      false, // Set to false to prevent structural value reset
    );

    // 2. Transfer Data (The Core Fix)
    const oldIds = getInputIdsFromSection(sectionToPromote);
    const newIds = getInputIdsFromSection(reindexedSection);

    oldIds.forEach((oldId, idIndex) => {
      const newId = newIds[idIndex];

      // Retrieve the value from globalFormData using the Old Input ID
      const valueToTransfer = globalFormData[oldId];

      // a) Write that retrieved value to globalFormData using the New Input ID
      onGlobalValueChange(newId, valueToTransfer);

      // b) Call onGlobalValueChange(oldId, undefined) again to clear the old key from globalFormData.
      onGlobalValueChange(oldId, undefined);
    });

    // 3. Replace the section structure with the re-indexed one
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
     */
    useEffect(() => {
      const initialData: Record<string, any> = {};

      const initializeInputs = (sections: any): void => {
        sections.forEach((section: any) => {
          if (section.sections) {
            initializeInputs(section.sections);
          } else if (section.items) {
            section.items.forEach((item: any) => {
              const input = item as InputItem;

              if (
                input.id &&
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
     * Adds a new dynamic section. (FIXED)
     */
    const handleAddSection = () => {
      const config = formData.variableSectionConfig;
      // Find the first index that is a variable section (to handle the static "Source Info" section)
      const firstVariableSectionIndex = dynamicSections.findIndex(
        (s: any) => s.type === 'subSection',
      );

      if (
        !config ||
        dynamicSections.length - firstVariableSectionIndex >= config.maxSections
      ) {
        return;
      }

      // Get the last variable section (the one we want to clone)
      const lastVariableSection = dynamicSections[dynamicSections.length - 1];

      // Determine the New 1-based Index
      const newIndex = dynamicSections.length - firstVariableSectionIndex + 1; // Correctly calculates the next index

      // The last section's index for replacement utility
      // This assumes the last section's ID/Title ends in its current 1-based index.
      const prevIndex = newIndex - 1;

      // Clone structure, update IDs/Titles, and CRITICAL DATA RESET: reset all structural input.value to ''
      const newSection = getNewSectionData(
        lastVariableSection,
        newIndex,
        prevIndex,
        true,
      );

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setDynamicSections((prev: any) => [...prev, newSection]);
    };

    /**
     * Removes a section and correctly re-indexes subsequent sections and clears data. (FIXED)
     */
    const handleRemoveSection = (arrayIndexToRemove: number) => {
      const config = formData.variableSectionConfig;

      // Calculate the number of variable sections
      const variableSections = dynamicSections.filter(
        (s: any) => s.type === 'subSection',
      );

      if (!config || variableSections.length <= config.minSections) {
        return;
      }

      const sectionToRemove = dynamicSections[arrayIndexToRemove];
      const allInputIdsToRemove = getInputIdsFromSection(sectionToRemove);

      // 1. Immediate Data Cleanup (Old ID)
      allInputIdsToRemove.forEach(id => onGlobalValueChange(id, undefined));
      setInputErrors(prev => {
        const newErrors = {...prev};
        allInputIdsToRemove.forEach(id => delete newErrors[id]);
        return newErrors;
      });

      // 2. Filter out the removed section
      const sectionsAfterRemoval = dynamicSections.filter(
        (_, index) => index !== arrayIndexToRemove,
      );

      // 3. Re-index all subsequent sections and shift saved data
      // We pass the globalFormData so the reIndexSectionsAndData utility can look up the old values.
      const reindexedSections = reIndexSectionsAndData(
        sectionsAfterRemoval,
        arrayIndexToRemove,
        onGlobalValueChange,
        globalFormData,
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
                {dynamicSections.map((section: any, index: any) => {
                  const isSubSection: boolean = section.type === 'subSection';

                  // Only consider for variable logic if it's a subsection
                  const isVariableSubSection =
                    isVariableSection && isSubSection;

                  const isRemovable: boolean =
                    isVariableSubSection &&
                    config !== undefined &&
                    // Check array length (total sections) against the minimum limit
                    dynamicSections.filter((s: any) => s.type === 'subSection')
                      .length > config.minSections;

                  // Dynamically adjust section display title based on current array index (1-based, relative to other subsections)
                  let currentDisplayTitle = section.mainTitle;

                  if (isVariableSubSection) {
                    const variableIndex = dynamicSections.filter(
                      (_, i) =>
                        i <= index && dynamicSections[i].type === 'subSection',
                    ).length;
                    currentDisplayTitle = `${config?.title} ${variableIndex}`;
                  }

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
                            onGlobalValueChange={onGlobalValueChange} // Pass down for nested forms if needed, though this is SectionContent
                            inputErrors={inputErrors}
                          />
                        </View>
                      )}

                      {/* Show remove button for dynamic subsections when allowed */}
                      {isVariableSubSection && (
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
                dynamicSections.filter((s: any) => s.type === 'subSection')
                  .length < config.maxSections && (
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
