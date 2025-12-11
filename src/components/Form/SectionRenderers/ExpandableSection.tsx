import React, {useState} from 'react';
import {View, Text, TouchableOpacity, LayoutAnimation} from 'react-native';
import styles from '../DynamicForm.styles';
import {Section, SectionContentProps} from '../DynamicForm.types';
import SectionContent from './SectionContent';

const ExpandableSection: React.FC<SectionContentProps> = ({
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

export default ExpandableSection;
