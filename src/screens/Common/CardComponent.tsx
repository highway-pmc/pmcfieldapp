import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import PropTypes from "prop-types";

// Define and Export the Component
const CardComponent = (props: any) => {
    const handleRadioChange = () => {
        props.handleRadio(props.index); // Pass index to parent's function
      };
    
      const onComponentNextClick = () => {
        props.onComponentNext(props.item); // Pass item to parent's function
      };
  return (
    <View style={styles.UserCategory}>
      <View style={styles.FlexRowCenter}>
        <CheckBox
          value={props.isChecked}
          onValueChange={handleRadioChange} // Call function with index
          style={styles.checkbox}
          tintColors={{ true: '#0F56B3', false: '#818181' }}
        />
        <View>
          <Text style={styles.UserRole}>{props.name || 'Unnamed'}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onComponentNextClick}>
        <Image
          style={styles.CloseIcon}
          source={require('./../../images/right-arrow.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

CardComponent.propTypes = {
    name: PropTypes.string.isRequired,
    isChecked: PropTypes.bool,
    item: PropTypes.object,
    index: PropTypes.number,
    handleRadio: PropTypes.func.isRequired,
    onComponentNext: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  UserCategory: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginTop: 15,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginLeft: 12,
    marginRight: 12
  },
  checkbox: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  FlexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  UserRole: {
    fontSize: 16,
    fontWeight: '400',
    color: '#808089',
  },
  CloseIcon: {
    width: 30,
    height: 30,
  },
});

export default CardComponent;
