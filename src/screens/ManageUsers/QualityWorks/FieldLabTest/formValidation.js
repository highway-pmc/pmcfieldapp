/**
 * Validates a single input field against its defined rules.
 * @param {object} field The complete input object from the form schema.
 * @param {any} value The new value entered by the user.
 * @returns {string | null} Returns an error message string if invalid, otherwise null.
 */
export const validateField = (field, value) => {
  const {validations, type} = field;
  const val = value; // Use a simpler alias for the value being validated

  if (!validations) {
    return null; // No validations defined, assume valid
  }
  if (validations.required) {
    if (val === null || val === undefined || val === '') {
      return validations.errorMessage || `${field.label} is required.`;
    }
    // Specific check for arrays (like multi-select/checkbox)
    if (Array.isArray(val) && val.length === 0) {
      return validations.errorMessage || `${field.label} is required.`;
    }
  }

  if (val === null || val === undefined || val === '') {
    return null;
  }

  if (type === 'number' || validations.type === 'number') {
    const num = Number(val);

    if (isNaN(num)) {
      return (
        validations.errorMessage || `${field.label} must be a valid number.`
      );
    }

    // Min/Max Value Check
    if (validations.min !== null && num < validations.min) {
      return (
        validations.errorMessage ||
        `${field.label} must be at least ${validations.min}.`
      );
    }
    if (validations.max !== null && num > validations.max) {
      return (
        validations.errorMessage ||
        `${field.label} cannot exceed ${validations.max}.`
      );
    }

    // Decimal Places Check
    if (validations.decimalPlaces !== null) {
      const decimalCount = (num.toString().split('.')[1] || '').length;
      if (decimalCount > validations.decimalPlaces) {
        return (
          validations.errorMessage ||
          `${field.label} can only have up to ${validations.decimalPlaces} decimal places.`
        );
      }
    }
  } else if (
    type === 'text' ||
    type === 'textarea' ||
    validations.type === 'string'
  ) {
    const str = String(val);

    if (validations.minLength !== null && str.length < validations.minLength) {
      return (
        validations.errorMessage ||
        `${field.label} must be at least ${validations.minLength} characters.`
      );
    }
    if (validations.maxLength !== null && str.length > validations.maxLength) {
      return (
        validations.errorMessage ||
        `${field.label} cannot exceed ${validations.maxLength} characters.`
      );
    }

    // Pattern Check
    if (validations.pattern) {
      const regex = new RegExp(validations.pattern);
      if (!regex.test(str)) {
        return (
          validations.errorMessage || `${field.label} is not in a valid format.`
        );
      }
    }

    if (validations.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(str)) {
        return (
          validations.errorMessage || `Please enter a valid email address.`
        );
      }
    }
  } else if (type === 'select' || type === 'dropdown') {
    // Check if the selected value is one of the valid options (optional check)
    if (validations.options && validations.options.length > 0) {
      const isValidOption = validations.options.some(
        option => option.key === val,
      );
      if (!isValidOption) {
        return (
          validations.errorMessage ||
          `Selected option for ${field.label} is invalid.`
        );
      }
    }
  }

  // No errors found
  return null;
};
