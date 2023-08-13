/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
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
} from 'react-native';

const ForgotPasswordStep2 = ({navigation}) => {
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
                <View style={{marginBottom: 20}}>
                  <Text style={styles.SignInText}>OTP</Text>
                </View>
                <View style={{marginBottom: 10}}>
                  <Text style={[styles.SubText, {fontSize: 18, fontWeight: '700'}]}>Enter 4 digit code</Text>
                </View>
                <View>
                  <Text style={styles.SubText}>A four-digit code should have come to your email address that you indicated.</Text>
                </View>
              </View>
              <View style={styles.SectionStyle}>
              <TextInput
                  style={styles.inputStyle}
                  keyboardType="default"
                  placeholder='Enter 4 digit code'
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                />
              </View>
              <View style={styles.AlignRight}>
                <Text
                  style={styles.orangeText}>
                  Resend OTP
                </Text>
              </View>
              <View style={styles.footerButton}>
                <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.5} onPress={() => {
                  navigation.navigate('ForgotPasswordStep3');
                }}>
                  <Text style={styles.buttonTextStyle}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonStyleWhite} activeOpacity={0.5} onPress={() => {
                  navigation.navigate('Login');
                }}>
                  <Text style={styles.buttonTextStyleWhite}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
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
    marginBottom: 40,
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
    paddingHorizontal: 30,
  },
  buttonStyleWhite: {
    backgroundColor: '#fff',
    borderWidth: 1,
    color: '#1C58C0',
    borderColor: '#1C58C0',
    height: 40,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 25,
    paddingHorizontal: 30,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextStyleWhite: {
    color: '#1C58C0',
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
  },
  footerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default ForgotPasswordStep2;
