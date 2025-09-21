import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Enable LayoutAnimation on Android for smooth collapse/expand animations
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Define types for the data structures
type DataItem = {
  label: string;
  value: string;
};

type InputItem = {
  label: string;
  placeholder: string;
};

type Section = {
  title: string;
  data?: DataItem[];
  inputs?: InputItem[];
};

type CollapsibleContainerProps = {
  mainTitle: string;
  sections: Section[];
};

// --- Sub-component to render the content of each section ---
const SectionContent = ({section}: {section: Section}) => {
  if (section.data) {
    return (
      <View style={styles.sectionContent}>
        {section.data.map((item, index) => (
          <View key={index} style={styles.dataRow}>
            <Text style={styles.dataLabel}>{item.label}:</Text>
            <Text style={styles.dataValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  } else if (section.inputs) {
    return (
      <View style={styles.sectionContent}>
        {section.inputs.map((input, index) => (
          <View key={index} style={styles.inputRow}>
            <Text style={styles.inputLabel}>{input.label}:</Text>
            <TextInput
              style={styles.textInput}
              placeholder={input.placeholder}
              placeholderTextColor="#999"
            />
          </View>
        ))}
      </View>
    );
  }
  return null;
};

// --- Sub-component to handle collapsible subsections ---
const ExpandableSection = ({sections}: {sections: Section[]}) => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <View style={styles.expandableSectionContainer}>
      {sections.map((section, index) => (
        <View key={index} style={styles.subsectionContainer}>
          <TouchableOpacity
            onPress={() => toggleExpand(index)}
            style={styles.subsectionHeader}>
            <Text style={styles.subsectionTitle}>{section.title}</Text>
            <Icon
              name={
                expandedSection === index
                  ? 'chevron-up-outline'
                  : 'chevron-down-outline'
              }
              size={20}
              color="#333"
            />
          </TouchableOpacity>
          {expandedSection === index && <SectionContent section={section} />}
        </View>
      ))}
    </View>
  );
};

// --- The main component provided by the user, updated with sub-components ---
const CollapsibleContainer: React.FC<CollapsibleContainerProps> = ({
  mainTitle,
  sections,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Icon
            name="pencil-outline"
            size={20}
            color="#666"
            style={styles.icon}
          />
          <Text style={styles.headerText}>{mainTitle}</Text>
        </View>
        <Icon
          name={isCollapsed ? 'add-circle-outline' : 'remove-circle-outline'}
          size={24}
          color="#6200EE"
        />
      </TouchableOpacity>
      {!isCollapsed && <ExpandableSection sections={sections} />}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ABBEFD',
    marginBottom: 20,
    overflow: 'hidden', // Ensures rounded corners clip content
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  expandableSectionContainer: {
    padding: 6,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  subsectionContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
    overflow: 'hidden',
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  inputRow: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
  },
});

export default CollapsibleContainer;
