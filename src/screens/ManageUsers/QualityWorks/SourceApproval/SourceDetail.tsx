import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Define the types for the props this component receives
type SourceDetailProps = {
  workCategories: any[]; // Again, use a more specific type if possible
  onCategoryClick: (item: any) => void;
};

const SourceDetail = ({workCategories, onCategoryClick}: SourceDetailProps) => {
  const navigation = useNavigation<any>();
  const addSouceFormNavigation = () => {
    console.log('Source Detail');
    navigation.navigate('SourceApprovalForm');
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          addSouceFormNavigation();
        }}>
        <Text style={styles.addButtonText}>+ Add Source</Text>
      </TouchableOpacity>
      <ScrollView style={styles.container}>
        {workCategories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryItemContainer}
            onPress={() => onCategoryClick(item)} // Use the function passed in via props
          >
            <LinearGradient
              colors={['#FFFFFF', '#F0F3FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.gradientContainer}>
              <View style={styles.leftBorder} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Styles specific to this component
const styles = StyleSheet.create({
  container: {marginBottom: 80},
  addButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4E36A3',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#4E36A3',
    fontWeight: 'bold',
  },
  categoryItemContainer: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  gradientContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftBorder: {
    width: 2,
    height: '70%',
    backgroundColor: '#5A7EF8',
    borderRadius: 2,
    marginRight: 15,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#27272A',
  },
});

export default SourceDetail;
