import { detectSpacesRegex , passwordRegex, mobilenoRegex, emailRegex, emailOrMobileRegex } from "./RegexApp"

const validationStrings = {
    usernameRequired : 'Username is required',
    passwordRequired : 'Password is required',
    otpRequired : 'Otp is required',
    fullNameRequired : 'Name is required',
    emailRequired : 'Email is required',
    fieldRequired : ' is required',
    emailOrMobileRequired : 'Email or mobile is required',
    mobileNoRequired : 'Mobile no is required',
    invalidUsername : 'Invalid username',
    invalidpassword : 'Invalid password',
    invalidMobileNo : 'Invalid mobile number',
    invalidEmail : 'Invalid email or mobile',
    invalidEmailOrMobile : 'Invalid email or mobile'
}

export const fieldRequired = (value, propertyName) => value? undefined : (propertyName ? propertyName + validationStrings.fieldRequired : 'Required')

export const emailRequired = (value) => value? undefined : validationStrings.emailRequired

export const emailOrMobileRequired = (value) => value? undefined : validationStrings.emailOrMobileRequired

export const passwordRequired = (value) => value? undefined : validationStrings.passwordRequired

export const otpRequired = (value) => value? undefined : validationStrings.otpRequired

export const mobileNoRequired = (value) => value? undefined : validationStrings.mobileNoRequired

export const usernameRequired = (value) => value? undefined : validationStrings.usernameRequired

export const fullnameRequired = (value) => value? undefined : validationStrings.fullNameRequired

export const removeSpaces = (term) => term.replace(detectSpacesRegex, '')

export const validateMobileno = value => 
    value && !value.match(mobilenoRegex)
    ? validationStrings.invalidMobileNo
    : undefined;

export const validateEmail = value => 
    value && !value.match(emailRegex)
    ? validationStrings.invalidEmail
    : undefined;

export const validateEmailOrMobile = value =>
    value && !value.match(emailOrMobileRegex)
    ? validationStrings.invalidEmailOrMobile
    : undefined;

export const validatePassword = value => 
    value && !value.match(passwordRegex)
    ? validationStrings.invalidpassword
    : undefined;
