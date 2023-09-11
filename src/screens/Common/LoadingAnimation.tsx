import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoadingAnimation = (props: any) => {
      
    return (
        props.loading &&
            <View style={styles.indicatorWrapper}  >
                <ActivityIndicator color={'royalblue'} style={styles.indicator}/>
            {/* <Text style={styles.indicatorText}>Loading... {props.loadingMessage}</Text> */}
            </View>
    );
  }

  const styles = StyleSheet.create({
    indicatorWrapper: {
      flex: 1,
      backgroundColor: 'rgba(52, 52, 52, 0.8)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    indicator: {
        transform: [{ scaleX: 2 }, { scaleY: 2 }]
    },
    indicatorText: {
      fontSize: 18,
      marginTop: 12,
    },
  });

  export default LoadingAnimation;
  