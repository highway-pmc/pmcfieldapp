import { detectSpacesRegex , passwordRegex, mobilenoRegex, emailRegex } from "./RegexApp"

const validationStrings = {
    usernameRequired : 'Username is required',
    passwordRequired : 'Password is required',
    fullNameRequired : 'Name is required',
    emailRequired : 'Email or mobile is required',
    mobileNoRequired : 'Mobile no is required',
    invalidUsername : 'Invalid username',
    invalidpassword : 'Invalid password',
    invalidMobileNo : 'Invalid mobile number',
    invalidEmail : 'Invalid email or mobile'
}


export const emailRequired = (value) => value? undefined : validationStrings.emailRequired

export const passwordRequired = (value) => value? undefined : validationStrings.passwordRequired

export const mobileNoRequired = (value) => value? undefined : validationStrings.mobileNoRequired

export const usernameRequired = (value) => value? undefined : validationStrings.usernameRequired

export const fullnameRequired = (value) => value? undefined : validationStrings.fullNameRequired

export const removeSpaces = (term) => term.replace(detectSpacesRegex, '')

    
export const validateMobileno = value => 
    value && !value.match(mobilenoRegex)
    ? validationStrings.invalidMobileNo
    : undefined

export const validateEmail = value => 
    value && !value.match(emailRegex)
    ? validationStrings.invalidEmail
    : undefined

export const validatePassword = value => 
    value && !value.match(passwordRegex)
    ? validationStrings.invalidpassword
    : undefined
