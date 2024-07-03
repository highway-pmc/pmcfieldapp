// Snackbar.js
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const Snackbar = ({message, type, icon, visible, onClose}) => {
  if (!visible) {
    return null;
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return styles.errorBackground;
      case 'success':
        return styles.successBackground;
      case 'info':
        return styles.infoBackground;
      default:
        return styles.defaultBackground;
    }
  };

  const getIconSource = () => {
    switch (type) {
      case 'error':
        return require('../../images/mark.png');
      case 'success':
        return require('../../images/correct.png');
      case 'info':
        return require('../../images/info.png');
      default:
        return require('../../images/info.png');
    }
  };

  return (
    <View style={[styles.container, getBackgroundColor()]}>
      <View style={styles.content}>
        <Image source={getIconSource()} style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
      </View>
      {/* <TouchableOpacity onPress={onClose}>
        <Image source={require('../../images/close.png')} style={styles.icon} />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    position: 'absolute',
    top: 40,
    right: 10,
    zIndex: 1000,
    minWidth: 250,
    maxWidth: '90%', // Adjust the width to fit the content dynamically
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    flexShrink: 1, // Allow text to wrap if it's too long
    flexGrow: 1, // Allow text to take up available space
  },
  icon: {
    width: 24,
    height: 24,
  },
  errorBackground: {
    backgroundColor: '#d9534f',
  },
  successBackground: {
    backgroundColor: '#5cb85c',
  },
  infoBackground: {
    backgroundColor: '#2396F3',
  },
  defaultBackground: {
    backgroundColor: '#333',
  },
});

export default Snackbar;
