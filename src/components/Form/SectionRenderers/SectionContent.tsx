import React from 'react';
import {View, Text} from 'react-native';
// @ts-ignore
import styles from '../DynamicForm.styles';
import {
  SectionContentProps,
  DataItem,
  InputItem,
  MixedItem,
} from '../DynamicForm.types';

// Import Input Components
import DropdownInput from '../FormComponents/InputDropdown';
import YesNoRadioInput from '../FormComponents/InputRadioYesNo';
import InputText from '../FormComponents/InputText';

const renderDataItem = (item: DataItem, index: number) => (
  <View key={`data-${index}`} style={styles.gridItem}>
    <Text style={styles.dataLabel}>{item.label}</Text>
    <Text style={styles.dataValue}>{item.value}</Text>
  </View>
);

const renderRegularInput = (
  input: InputItem,
  inputData: Record<string, any>,
  onValueChange: SectionContentProps['onValueChange'],
  inputErrors: Record<string, string>,
) => {
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
    <InputText
      key={`input-${input.id}`}
      input={input}
      value={currentInputValue}
      onChange={onValueChange}
      error={error}
    />
  );
};

const renderRadioInput = (
  input: InputItem,
  inputData: Record<string, any>,
  onValueChange: SectionContentProps['onValueChange'],
  inputErrors: Record<string, string>,
) => {
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

const SectionContent: React.FC<SectionContentProps> = ({
  section,
  inputData,
  onValueChange,
  inputErrors,
}) => {
  const allItems = section.items || [];

  const dataItems: DataItem[] = [];
  const regularInputs: InputItem[] = [];
  const sequencedTitlesAndRadios: Array<{title: string} | InputItem> = [];
  const mixedGridItems: MixedItem[] = [];

  allItems.forEach((item: any) => {
    const isInput = (item as InputItem).type !== undefined;

    if (!isInput && (item as any).title) {
      sequencedTitlesAndRadios.push(item as {title: string});
    } else if (isInput) {
      const input = item as InputItem;
      if (input.type === 'radio') {
        sequencedTitlesAndRadios.push(input);
      } else {
        regularInputs.push(input);
      }
    } else {
      dataItems.push(item as DataItem);
    }
  });

  mixedGridItems.push(...dataItems, ...regularInputs);

  return (
    <View style={styles.sectionContent}>
      {/* 1 & 2. RENDER MIXED GRID ITEMS (Data-Only and Regular Inputs) */}
      {mixedGridItems.length > 0 && (
        <View style={styles.contentGrid}>
          {mixedGridItems.map((item, index) => {
            if ((item as InputItem).type) {
              return renderRegularInput(
                item as InputItem,
                inputData,
                onValueChange,
                inputErrors,
              );
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
              return renderTitleItem(item as {title: string}, index);
            } else {
              return renderRadioInput(
                item as InputItem,
                inputData,
                onValueChange,
                inputErrors,
              );
            }
          })}
        </View>
      )}

      {section.notes && <Text style={styles.notesText}>{section.notes}</Text>}
    </View>
  );
};

export default SectionContent;
