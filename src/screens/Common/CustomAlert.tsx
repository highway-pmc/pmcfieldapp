import { Modal, StyleSheet, Text, View, TouchableOpacity, Image, Alert } from "react-native";
import PropTypes from "prop-types";

const CustomAlert = (props: any) => {

    const onOkButtonPress = () => {
        props.onPressOkButton && props.onPressOkButton();
    };

    const onCancelButtonPress = () => {
        props.onPressCancelButton && props.onPressCancelButton();
        props.displayAlert = false;
    };

    return (
        <Modal
            visible={props.displayAlert}
            transparent={true}
            animationType={"fade"}>
            <View style={styles.mainOuterComponent}>
                <View style={styles.mainContainer}>
                    {/* First ROw - Alert Icon and Title */}
                    <View style={styles.topPart}>
                        {
                            // props.displayAlertIcon
                            // &&
                            // <Image
                            //   source={require('./images/ic_notification.png')}
                            //   resizeMode={'contain'}
                            //   style={styles.alertIconStyle}
                            // />
                        }
                        <Text style={styles.alertTitleTextStyle}>
                            {`${props.alertTitleText}`}
                        </Text>
                    </View>
                    {/* Second Row - Alert Message Text */}
                    <View style={styles.middlePart}>
                        <Text style={styles.alertMessageTextStyle}>
                            {`${props.alertMessageText}`}
                        </Text>
                    </View>
                    {/* Third Row - Positive and Negative Button */}
                    <View style={styles.bottomPart}>
                        {
                            props.displayOkButton
                            &&
                            <TouchableOpacity
                                onPress={onOkButtonPress}
                                style={[styles.alertMessageButtonStyle, styles.okButton]} >
                                <Text style={styles.alertMessageButtonTextStyle}>{props.okButtonText}</Text>
                            </TouchableOpacity>
                        }
                        {
                            props.displayCancelButton
                            &&
                            <TouchableOpacity
                                onPress={onCancelButtonPress}
                                style={styles.alertMessageButtonStyle}>
                                <Text style={styles.alertMessageButtonTextStyle}>{props.cancelButtonText}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        </Modal>
    );
}

CustomAlert.propTypes = {
    displayAlert: PropTypes.bool,
    displayAlertIcon: PropTypes.bool,
    alertTitleText: PropTypes.string,
    alertMessageText: PropTypes.string,
    displayOkButton: PropTypes.bool,
    okButtonText: PropTypes.string,
    displayCancelButton: PropTypes.bool,
    cancelButtonText: PropTypes.string,
    onPressOkButton: PropTypes.func,
    onPressCancelButton: PropTypes.func,
}

const styles = StyleSheet.create({
    mainOuterComponent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000088'
    },
    mainContainer: {
        flexDirection: 'column',
        width: '90%',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 10,
    },
    topPart: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 2,
        paddingVertical: 4
    },
    middlePart: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        color: '#333333',
        fontSize: 16,
        marginVertical: 2
    },
    bottomPart: {
        flexDirection: 'row',
        paddingBottom: 5,
        gap: 20,
        justifyContent: 'space-evenly'
    },
    alertIconStyle: {
        height: 35,
        width: 35,
    },
    alertTitleTextStyle: {
        color: "#333333",
        fontSize: 18,
        fontWeight: 'bold',
        padding: 2,
        marginHorizontal: 2
    },
    alertMessageTextStyle: {
        color: '#333333',
        fontSize: 16,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    alertMessageButtonStyle: {
        minWidth: 120,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 10,
        borderRadius: 30,
        backgroundColor: '#1C58C0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    okButton: {
        backgroundColor: '#5eab4b'
    },
    alertMessageButtonTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
});

export default CustomAlert;
