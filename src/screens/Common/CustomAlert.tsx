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
                                style={styles.alertMessageButtonStyle} >
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
        height: '25%',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        // borderWidth: 2,
        // borderColor: '#FF0000',
        borderRadius: 10,
        padding: 4,
    },
    topPart: {
        flex: 0.5,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: '#00FF00',
        paddingHorizontal: 2,
        paddingVertical: 4
    },
    middlePart: {
        flex: 1,
        width: '100%',
        // borderWidth: 1,
        // borderColor: '#FF6600',
        padding: 4,
        color: '#333333',
        fontSize: 16,
        marginVertical: 2
    },
    bottomPart: {
        flex: 0.5,
        width: '100%',
        // borderWidth: 1,
        // borderColor: '#0066FF',
        flexDirection: 'row',
        padding: 4,
        justifyContent: 'space-evenly'
    },
    alertIconStyle: {
        // borderWidth: 1,
        // borderColor: '#cc00cc',
        height: 35,
        width: 35,
    },
    alertTitleTextStyle: {
        flex: 1,
        // textAlign: 'justify',
        color: "#333333",
        fontSize: 18,
        fontWeight: 'bold',
        // borderWidth: 1,
        // borderColor: '#660066',
        padding: 2,
        marginHorizontal: 2
    },
    alertMessageTextStyle: {
        color: '#333333',
        // textAlign: 'justify',
        fontSize: 16,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    alertMessageButtonStyle: {
        width: '30%',
        paddingHorizontal: 6,
        marginVertical: 4,
        borderRadius: 10,
        backgroundColor: '#1C58C0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertMessageButtonTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
});

export default CustomAlert;
