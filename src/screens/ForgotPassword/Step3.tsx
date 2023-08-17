/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Linking,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { passwordRequired } from '../../utils/Validations';
import NetworkUtils from '../../utils/NetworkUtil';
import { resetPassword } from './actions';

const ForgotPasswordStep3 = ({route, navigation}: { route: any, navigation: any }) => {

  const { username, otp } = route.params;
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const {passwordUpdated, loading, error} = useSelector(state => state.ForgotPassword)
  const dispatch = useDispatch()

  const handlePasswordError = (pwd = "") => {
    const pwdError = passwordRequired(pwd);
    if(pwdError) {
      setPasswordError(pwdError);
    } else {
      setPasswordError("");
    }

    return pwdError;
  }

  const onSubmit = async() => {
    setPasswordError('');
    setFormSubmitted(true);

    if (handlePasswordError(password)) {
      return false;
    }

    const isInternetAvailable = await NetworkUtils.isNetworkAvailable();

    if (!isInternetAvailable) {
      Alert.alert("No internet", "Please connect to internet and try again");
      return;
    }

    dispatch(resetPassword(username, otp, password));
  };

  useEffect(() => {
    console.log("sssssss", passwordUpdated);
    if (passwordUpdated) {
      Alert.alert("Success", "Password has been reset successfully");
      setTimeout(() => {
        navigation.navigate('Login');
      }, 5000);
    } else if(error) {
      //setErrorMessage(error);
    }
  }, [passwordUpdated, error]);
  return (
    <View style={styles.mainBody}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={styles.MainContainerStyle}>
              <View style={styles.TitleSection}>
                <View>
                  <Text style={styles.SignInText}>Change Password</Text>
                </View>
              </View>
              <Text>New Password</Text>
              <View style={styles.SectionStyle}>
              <TextInput
                  style={styles.inputStyle}
                  placeholder="*******"
                  keyboardType="default"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  secureTextEntry={true}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                  onChangeText={(text) => {
                    setPassword(text);
                    handlePasswordError(text);
                  }}
                />
              </View>
              {(passwordError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                  <Text style={styles.errorText}>{passwordError}</Text>
                </View>}
              <Text>Confirm Password</Text>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="*******"
                  keyboardType="default"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  secureTextEntry={true}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                />
              </View>
              <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.5} onPress={() => onSubmit()}>
                <Text style={styles.buttonTextStyle}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ErrorSectionStyle: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  errorText: {
    color: '#f11f1f',
  },
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignContent: 'center',
  },
  TitleSection: {
    marginBottom: 20,
    justifyContent: 'flex-start',
  },
  SignInText: {
    fontSize: 28,
    color: '#1C58C0',
    fontWeight: '700',
  },
  SubText: {
    fontSize: 16,
    color: '#2C2C2C',
    fontWeight: '600',
  },
  MainContainerStyle: {
    flexDirection: 'column',
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 20,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 10,
    marginTop: 5,
  },
  buttonStyle: {
    backgroundColor: '#1C58C0',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  inputStyle: {
    flex: 1,
    color: '#2c2c2c',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E1E1E1',
    backgroundColor: '#F5F5F5',
    fontWeight: '600',
    paddingVertical: 10,
  },
  AlignRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  orangeText: {
    color: '#F78720',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    flexDirection: 'column',
    paddingVertical: '25%',
  },
  logo: {
    height: 128,
    width: 128,
    marginBottom: 30,
    marginTop: 30,
  }
});

export default ForgotPasswordStep3;
