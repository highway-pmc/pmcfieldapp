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
import { emailRequired, validateEmail } from '../../utils/Validations';
import NetworkUtils from '../../utils/NetworkUtil';
import LoadingAnimation from '../Common/LoadingAnimation';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from './actions';

const ForgotPasswordStep1 = ({navigation}: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const {user, loading, error} = useSelector(state => state.ForgotPassword)
  const dispatch = useDispatch()

  const handleEmailError = (email = "") => {
    const emailError = emailRequired(email)
    if(emailError) {
      setEmailError(emailError);
    } else {
      setEmailError("");
    }

    if(!emailError) {
      const emailError = validateEmail(email);
      if (emailError) {
        setEmailError(emailError);
      } else {
        setEmailError("");
      }
    }
    return emailError;
  }

  const onSubmit = async() => {
    setEmailError('');
    setFormSubmitted(true);

    if (handleEmailError(username)) {
      return false;
    }

    const isInternetAvailable = await NetworkUtils.isNetworkAvailable();

    if (!isInternetAvailable) {
      Alert.alert("No internet", "Please connect to internet and try again");
      return;
    }

    dispatch(forgotPassword(username));
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigation.navigate('ForgotPasswordStep2', {
          username: username
        });
      });
    } else if(error) {
      setEmailError(error);
    }
  }, [user, error]);

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
                <View style={styles.forGotText}>
                  <Text style={styles.SignInText}>Forgot Password?</Text>
                </View>
                <View>
                  <Text style={styles.SubText}>
                    Enter your email for the verification process, we will send verification code to your email
                  </Text>
                </View>
              </View>
              <Text>Email</Text>
              <View style={styles.SectionStyle}>
              <TextInput
                  style={styles.inputStyle}
                  placeholder="Enter Email"
                  keyboardType="default"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                  onChangeText={(text) => {
                    setUsername(text);
                    handleEmailError(text);
                  }}
                />
              </View>
              {(emailError && formSubmitted) && <View style={styles.ErrorSectionStyle}>
                  <Text style={styles.errorText}>{emailError}</Text>
                </View>}
              
              <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.5} onPress={() => onSubmit()}>
                <Text style={styles.buttonTextStyle}>Continue</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
      <LoadingAnimation loading={loading}></LoadingAnimation>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignContent: 'center',
  },
  TitleSection: {
    marginBottom: 80,
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
  ErrorSectionStyle: {
    flexDirection: 'row',
    marginBottom: 20,
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
  errorText: {
    color: '#f11f1f',
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
  },
  HeaderTopMenuIcon: {
    width: 127,
    height: 127,
  },
  forGotText: {
    width: 150,
    marginBottom: 10
  }
});

export default ForgotPasswordStep1;
