import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { loginUser } from './actions'
import { emailRequired, validateEmail } from '../../utils/Validations';

const Login = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loading = useSelector(state => state.Auth.loading)
  let errorMessageLogin = useSelector(state => state.Auth.error)

  const dispatch = useDispatch()

  const onSubmit = () => {
    if (!username || !password) return;
    dispatch(loginUser(username, password));
  }

  const handleNavigateToDetails = () => {
   // navigation.navigate('ForgotPassword');
  };

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
                  <Text style={styles.SignInText}>Sign in</Text>
                </View>
                <View>
                  <Text style={styles.SubText}>
                    Please log in into your account
                  </Text>
                </View>
                {errorMessageLogin && <View style={{ alignItems: 'center', marginTop: 20 }}>
                  <Text style={styles.errorText}>{errorMessageLogin}</Text>
                </View>}
              </View>
              <Text>Email</Text>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Enter Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  onChangeText={(text) => {
                    setUsername(text)
                  }}
                />
              </View>
              <Text>Password</Text>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Enter Password"
                  keyboardType="default"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  secureTextEntry={true}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                  onChangeText={(text) => {
                    setPassword(text)
                  }}
                />
              </View>
              <View style={styles.AlignRight}>
                <TouchableOpacity onPress={handleNavigateToDetails}>
                  <Text style={styles.orangeText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.5}
                onPress={() => onSubmit()}>
                <Text style={styles.buttonTextStyle}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
}

export default Login;


const styles = StyleSheet.create({
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
  }
});