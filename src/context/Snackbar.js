import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const Snackbar = ({
  message,
  actionText,
  onActionPress,
  duration = 3000, // Default duration in milliseconds
  position = "bottom", // Default position
  containerStyle,
  messageStyle,
  actionTextStyle,
  backgroundColor,
  textColor,
  actionTextColor,
  isImageShow= false
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, duration]);
const CloseSnackBar = (() => {
    setIsVisible(false);
})
  return isVisible ? (
    <View
      style={[
        styles.container,
        position === "top" ? styles.topContainer : styles.bottomContainer,
        containerStyle,
        { backgroundColor: backgroundColor },
      ]}
    >
      <Text style={[styles.messageText, messageStyle, { color: textColor }]}>
        {message}
      </Text>
      {actionText && (
        <TouchableOpacity onPress={() => CloseSnackBar()}>
            {
                isImageShow ? <Image
                style={styles.CloseIcon}
                tintColor={'#ff0000'}
                source={require('./../images/menu/close-icon.png')}
              /> : <Text
              style={[
                styles.actionText,
                actionTextStyle,
                { color: actionTextColor },
              ]}
            >
              {actionText}
            </Text>
            }
        </TouchableOpacity>
      )}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 999
  },
  topContainer: {
    top: 15,
  },
  bottomContainer: {
    bottom: 15,
  },
  messageText: {
    fontSize: 16,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
  },
  CloseIcon: {
    width: 30,
    height: 30,
  },
});

export default Snackbar;