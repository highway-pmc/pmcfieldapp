import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
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

export interface DynamicFormProps extends DynamicTestFormProps {
  globalFormData: Record<string, any>;
  onGlobalValueChange: (fieldId: string, newValue: any) => void;
}

export interface DynamicFormRef {
  collectAllInputs: () => {
    inputData: Record<string, any>;
    inputErrors: Record<string, string>;
  };
}

const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps>(
  ({formData, globalFormData, onGlobalValueChange}, ref) => {
    const [isMainExpanded, setIsMainExpanded] = useState(true);
    const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

    const nestedFormRefs = React.useRef<Record<string, DynamicFormRef>>({});

    useImperativeHandle(ref, () => ({
      collectAllInputs,
    }));

    const collectAllInputs = () => {
      let allData: Record<string, any> = {...globalFormData};
      let allErrors: Record<string, string> = {...inputErrors};

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

    useEffect(() => {
      const initialData: Record<string, any> = {};

      const initializeInputs = (sections: Section[]) => {
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

      initializeInputs(formData.sections);

      Object.keys(initialData).forEach(id => {
        onGlobalValueChange(id, initialData[id]);
      });
    }, [formData, globalFormData]);

    const toggleMainExpand = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsMainExpanded(!isMainExpanded);
    };

    const handleValueChange = (field: InputItem, newValue: any) => {
      onGlobalValueChange(field.id, newValue);

      const error = validateField(field, newValue);

      setInputErrors(prev => ({
        ...prev,
        [field.id]: error,
      }));
    };

    const isNested = formData.mainTitle !== 'Project & Material Testing';

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

              <View style={styles.sectionsContainer}>
                {formData.sections.map((section, index) => {
                  if (section.type === 'subSection') {
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
                          globalFormData={globalFormData}
                          onGlobalValueChange={onGlobalValueChange}
                        />
                      </View>
                    );
                  }

                  if (section.type === 'expandable') {
                    return (
                      <ExpandableSection
                        key={index}
                        section={section as Section}
                        inputData={globalFormData}
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
                          inputData={globalFormData}
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
