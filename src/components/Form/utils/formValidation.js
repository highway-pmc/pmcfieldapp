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
export const validateChainageIntervals = (
  chainageInputs,
  projectStartChainage,
  projectEndChainage,
) => {
  const errors = [];
  const minRange = 0.001; // Tolerance for floating point checks

  // --- 1. PRE-CHECK AND NORMALIZATION (including range constraints) ---
  const intervals = chainageInputs
    .map(input => {
      const index = input.index;
      // Attempt to parse input values
      const start = parseFloat(input.start);
      const end = parseFloat(input.end);

      // Basic numerical validation
      if (isNaN(start) || isNaN(end)) {
        errors.push({
          fieldId: `start_chainage_${index}`,
          message: 'Chainage must be a valid number.',
        });
        return null;
      }

      // Check if Start is before End for the current specimen
      if (start >= end) {
        errors.push({
          fieldId: `end_chainage_${index}`,
          message: 'End Chainage must be greater than Start Chainage.',
        });
        return null;
      }

      // Check range containment within overall project limits
      if (start < projectStartChainage || end > projectEndChainage) {
        errors.push({
          fieldId: `start_chainage_${index}`,
          message: `Must be within project range ${projectStartChainage} - ${projectEndChainage}.`,
        });
        return null;
      }

      return {start, end, index};
    })
    .filter(input => input !== null)
    .sort((a, b) => a.start - b.start); // Sort by start chainage for sequential checks

  // If initial checks failed, return those errors immediately
  if (errors.length > 0) return errors;

  // --- 2. OVERLAP AND CONSECUTIVE GAP CHECK ---
  let currentCoveredEnd = projectStartChainage;

  // A. Check the gap before the first interval
  if (
    intervals.length > 0 &&
    intervals[0].start > currentCoveredEnd + minRange
  ) {
    errors.push({
      fieldId: `start_chainage_${intervals[0].index}`,
      message: `Gap found! Must start at ${currentCoveredEnd}.`,
    });
  }

  // B. Check for overlap or gap between consecutive intervals
  for (let i = 0; i < intervals.length; i++) {
    const current = intervals[i];

    // 2a. Overlap check (current start must be equal to or greater than the end of the previous covered segment)
    if (current.start < currentCoveredEnd - minRange) {
      errors.push({
        fieldId: `start_chainage_${current.index}`,
        message: `Overlap detected with previous segment. Must start at or after ${currentCoveredEnd}.`,
      });
    }

    // 2b. Gap check (current start must be equal to the end of the previous covered segment)
    // We only check for a gap if we are beyond the first segment's start (already checked in A)
    if (i > 0 && current.start > intervals[i - 1].end + minRange) {
      errors.push({
        fieldId: `start_chainage_${current.index}`,
        message: `Gap found! Segment must start at ${
          intervals[i - 1].end
        } to maintain coverage.`,
      });
    }

    // Update the end of the continuously covered area
    currentCoveredEnd = Math.max(currentCoveredEnd, current.end);
  }

  // C. Final coverage check (must reach project end)
  if (currentCoveredEnd < projectEndChainage - minRange) {
    // Point the error to the last entry's end chainage, or the first if there are no entries
    const lastIndex =
      intervals.length > 0 ? intervals[intervals.length - 1].index : 1;
    errors.push({
      fieldId: `end_chainage_${lastIndex}`,
      message: `Range is incomplete. Total coverage must reach ${projectEndChainage}.`,
    });
  }

  return errors;
};
