import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import ListItem from '../../../../components/UI/ListItem';

const SourceDetail = ({workCategories}: any) => {
  const navigation = useNavigation<any>();

  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const addSouceFormNavigation = () => {
    navigation.navigate('SourceApprovalForm');
  };

  const handleMaterialClick = (material: any) => {
    console.log(`Selected Material: ${material.name}`);
  };

  if (selectedCategory) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedCategory(null)}>
            <Text style={styles.backButton}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selectedCategory.name}</Text>
        </View>

        <ScrollView style={styles.listContainer}>
          {selectedCategory?.testMaterialsData?.map((material: any) => (
            <ListItem
              key={material._id}
              item={material}
              onPress={() => handleMaterialClick(material)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Otherwise, render the main list of work categories passed via props
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Work Categories</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={addSouceFormNavigation}>
          <Text style={styles.addButtonText}>+ Add Source</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer}>
        {workCategories.map((category: any) => (
          <ListItem
            key={category._id}
            item={category}
            onPress={() => {
              console.log('Selected category:', category);
              setSelectedCategory(category);
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7FF',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
  },
  backButton: {
    fontSize: 16,
    color: '#4E36A3',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4E36A3',
  },
  addButtonText: {
    color: '#4E36A3',
    fontWeight: 'bold',
  },
});

export default SourceDetail;
