import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type ItemProps = {
  item: {
    name: string;
  };
  onPress: () => void;
};

const ListItem = ({item, onPress}: ItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={['#FFFFFF', '#F0F3FF']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientContainer}>
        <View style={styles.leftBorder} />
        <Text style={styles.itemText}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  itemText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#27272A',
  },
});

export default ListItem;
