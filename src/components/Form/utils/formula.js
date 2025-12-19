export const average3Dec = values => {
  if (!Array.isArray(values) || values.length === 0) {
    return 0;
  }
  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;
  return parseFloat(avg.toFixed(3));
};

export const average2Dec = values => {
  if (!Array.isArray(values) || values.length === 0) {
    return 0;
  }
  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;
  return parseFloat(avg.toFixed(2));
};

export const calculatePercentage = (obtained, total) => {
  if (total === 0) {
    return 0; // avoid division by zero
  }
  const percent = (obtained / total) * 100;
  return parseFloat(percent.toFixed(2)); // return number with 2 decimals
};

export const calculateTFV = (X, Y) => {
  if (Y + 4 === 0) {
    throw new Error('Denominator cannot be zero.');
  }
  const tfv = (14 * X) / (Y + 4);
  return parseFloat(tfv.toFixed(2)); // number only
};

export const multiply3Dec = (...values) => {
  if (values.length === 0) {
    return 0;
  }
  const product = values.reduce((acc, val) => acc * val, 1);
  return parseFloat(product.toFixed(3));
};

export const multiply2Dec = (...values) => {
  if (values.length === 0) {
    return 0;
  }
  const product = values.reduce((acc, val) => acc * val, 1);
  return parseFloat(product.toFixed(2));
};

export const addValues = (...values) => {
  return values.reduce((acc, val) => acc + val, 0);
};

export const subtractValues = (...values) => {
  if (values.length === 0) return 0;
  return values.reduce((acc, val) => acc - val);
};

export const divide2Dec = (...values) => {
  if (values.length === 0) return 0;
  return parseFloat(
    values
      .reduce((acc, val) => {
        if (val === 0) throw new Error('Division by zero is not allowed.');
        return acc / val;
      })
      .toFixed(2),
  );
};

export const divide3Dec = (...values) => {
  if (values.length === 0) return 0;
  return parseFloat(
    values
      .reduce((acc, val) => {
        if (val === 0) throw new Error('Division by zero is not allowed.');
        return acc / val;
      })
      .toFixed(3),
  );
};

export const complexModulus1Dec = (Gstar, deltaDegrees) => {
  // convert degrees to radians
  const deltaRadians = (Math.PI / 180) * deltaDegrees;

  if (Math.sin(deltaRadians) === 0) {
    throw new Error('sin(δ) cannot be zero.');
  }

  const value = Gstar / Math.sin(deltaRadians);
  return parseFloat(value.toFixed(1)); // 1 decimal
};

export const specificGravityKerosene2Dec = (W1, W4, W5) => {
  if (W4 === W1) {
    throw new Error('Denominator (W4 - W1) cannot be zero.');
  }
  const SG = (W5 - W1) / (W4 - W1);
  return parseFloat(SG.toFixed(2));
};

export const specificGravityCement2Dec = (W1, W2, W3, W5, W6) => {
  const numerator = (W2 - W1) * W6;
  const denominator = W2 - W1 - (W3 - W5);

  if (denominator === 0) {
    throw new Error('Denominator cannot be zero.');
  }

  const SG = numerator / denominator;
  return parseFloat(SG.toFixed(2));
};

export const multiplyInt = (...numbers) => {
  let result = 1;
  for (const num of numbers) {
    result *= num;
  }
  return Math.floor(result); // returns integer value
};

export const checkRange = (value, min, max) => {
  return value >= min && value <= max ? 'Accepted' : 'Rejected';
};

export const greaterThan = (value, limit) => {
  return value > limit ? 'Accepted' : 'Rejected';
};

export const greaterThanOrEqual = (value, limit) => {
  return value >= limit ? 'Pass' : 'Fail';
};

export const lessThan = (value, limit) => {
  return value < limit ? 'Accepted' : 'Rejected';
};

export const lessThanOrEqual = (value, limit) => {
  return value <= limit ? 'Accepted' : 'Rejected';
};

export const overallStatus = (...values) => {
  return values.includes('Rejected') ? 'Rejected' : 'Accepted';
};

export const divideInt = (...values) => {
  if (values.length === 0) return 0;
  return values.reduce((acc, val, idx) => {
    if (val === 0) throw new Error('Division by zero is not allowed.');
    return idx === 0 ? val : Math.floor(acc / val);
  });
};

export const subtract3Dec = (...values) => {
  if (values.length === 0) return 0;
  const result = values.reduce((acc, val) => acc - val);
  return parseFloat(result.toFixed(3));
};

export const square3Dec = value => {
  const result = value * value;
  return parseFloat(result.toFixed(3));
};

export const sqrt3Dec = value => {
  if (value < 0) {
    throw new Error('Square root of negative numbers is not allowed.');
  }
  const result = Math.sqrt(value);
  return parseFloat(result.toFixed(3));
};

export const rangeBasedCalculation = (
  value,
  min,
  max,
  lessFn,
  withinFn,
  greaterFn,
) => {
  if (value < min) {
    return lessFn(value);
  } else if (value > max) {
    return greaterFn(value);
  } else {
    return withinFn(value);
  }
};

export const flexuralStrength = (P, L, b, d, a, specimenSize) => {
  let fr;

  if (specimenSize === 150) {
    if (a > 200) {
      fr = (P * 1000 * L) / (b * d * d);
    } else if (a > 170 && a <= 200) {
      fr = (3 * P * 1000 * a) / (b * d * d);
    } else {
      throw new Error('Invalid a value for 150 mm specimen.');
    }
  } else if (specimenSize === 100) {
    if (a > 130) {
      fr = (P * 1000 * L) / (b * d * d);
    } else if (a > 110 && a <= 133) {
      fr = (3 * P * 1000 * a) / (b * d * d);
    } else {
      throw new Error('Invalid a value for 100 mm specimen.');
    }
  } else {
    throw new Error('Invalid specimen size. Use 150 or 100.');
  }

  return parseFloat(fr.toFixed(3));
};

export const pickValue = (val1, val2) => {
  if (val1 > 0) return val1;
  if (val2 > 0) return val2;
  throw new Error('Both values are invalid (≤ 0).');
};

export const getMaxValue = (...args) => {
  if (args.length === 0) {
    return null;
  }
  let max = args[0];
  for (let i = 1; i < args.length; i++) {
    if (args[i] > max) {
      max = args[i];
    }
  }
  return max;
};

export const getSin = value => Math.sin(value);

export const divideCeil = (a, b) => {
  if (b === 0) throw new Error('Division by zero');
  return Math.ceil(a / b);
};

export const divideCeilMin2 = (a, b) => {
  if (b === 0) throw new Error('Division by zero');
  const result = Math.ceil(a / b);
  return result < 2 ? 2 : result;
};

export const countArray = arr => {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }
  return arr.length;
};

export const getFlyAshSampleCount = quantityTonne => {
  if (quantityTonne <= 0) {
    throw new Error('Quantity must be greater than 0');
  } else if (quantityTonne <= 50) {
    return 1;
  } else if (quantityTonne <= 150) {
    return 2;
  } else if (quantityTonne <= 300) {
    return 3;
  } else if (quantityTonne <= 500) {
    return 4;
  } else if (quantityTonne <= 1000) {
    return 5;
  } else {
    return Math.ceil(quantityTonne / 200);
  }
};

export const getSilicaFumeSampleCount = quantityTonne => {
  if (quantityTonne <= 0) {
    throw new Error('Quantity must be greater than 0');
  }
  if (quantityTonne <= 100) {
    return 2;
  } else {
    return 2 + Math.ceil((quantityTonne - 100) / 100);
  }
};

export const getReinforcementSampleCount = quantityTonne => {
  if (quantityTonne <= 0) {
    throw new Error('Quantity must be greater than 0');
  }
  let tests;
  if (quantityTonne <= 100) {
    tests = 2;
  } else {
    tests = 2 + Math.ceil((quantityTonne - 100) / 100);
  }
  return Math.max(tests, 2);
};

export const getHumePipeSampleCount = quantityPipes => {
  if (quantityPipes <= 0) {
    throw new Error('Quantity must be greater than 0');
  }
  let samples;
  if (quantityPipes <= 50) {
    samples = 8;
  } else if (quantityPipes <= 100) {
    samples = 13;
  } else if (quantityPipes <= 300) {
    samples = 20;
  } else if (quantityPipes <= 500) {
    samples = 32;
  } else {
    samples = 50;
  }
  return Math.max(samples, 8);
};

export const getPrecastKerbSampleCount = quantityRM => {
  if (quantityRM <= 0) {
    throw new Error('Quantity must be greater than 0');
  }
  if (quantityRM <= 900) {
    return 1;
  } else {
    return 1 + Math.ceil((quantityRM - 900) / 1800);
  }
};

export const getBrickSampleCount = quantityBricks => {
  if (quantityBricks <= 0) {
    throw new Error('Quantity must be greater than 0');
  }
  if (quantityBricks <= 2000) return 0;
  if (quantityBricks <= 10000) return 5;
  if (quantityBricks <= 35000) return 10;
  return 15;
};

export const getViscosityGrade = value => {
  if (value >= 3200 && value <= 4800) return 'VG40';
  if (value >= 2400 && value <= 3600) return 'VG30';
  if (value >= 1600 && value <= 2400) return 'VG20';
  if (value >= 800 && value <= 1200) return 'VG10';
  return 'Out of specified VG range';
};

export const getPassingMaterials = (aivValue, W4) => {
  if (W4 > 1) return 'Discard test and retest (W4 > 1g)';
  const limits = {
    DLC: 30,
    PQC: 30,
    WMM: 30,
    BC: 24,
    DBM: 27,
    SMA: 18,
    CONCRETE: 45,
    GSB: 40,
    CTSB: 40,
    CTB: 40,
  };
  const passing = Object.keys(limits).filter(
    material => aivValue <= limits[material],
  );
  return passing.length === 0
    ? 'No material passes for given AIV value'
    : `Passing Materials: ${passing.join(', ')}`;
};

export const checkSlurryTests = (material, testValues) => {
  const limits = {
    'Polymer Slurry': {
      specificGravity: [1.02, 1.1],
      marshViscosity: [40, 70],
      pH: [9, 11],
      sandContent: [0, 1],
      liquidLimit: null,
    },
    'Bentonite Slurry': {
      specificGravity: [1.03, 1.1],
      marshViscosity: [32, 50],
      pH: [9, 11],
      sandContent: [0, 1],
      liquidLimit: [300, Infinity],
    },
  };
  const inRange = (val, range) =>
    range === null || (val >= range[0] && val <= range[1]);
  if (!limits[material]) return `❌ Unknown material type: ${material}`;
  const matLimits = limits[material];
  const passed = [],
    failed = [];
  for (const test in matLimits) {
    if (testValues[test] !== undefined) {
      inRange(testValues[test], matLimits[test])
        ? passed.push(test)
        : failed.push(test);
    }
  }
  return {passed, failed};
};

export const checkRelativeCompaction = rcValue => {
  if (rcValue > 100) return 'Discard Sample (Relative Compaction > 100%)';
  return rcValue > 98
    ? 'Pass (Relative Compaction within limits)'
    : 'Fail (Relative Compaction ≤ 98%)';
};

export const checkRSTackCoat = (surfaceType, value) => {
  const limits = {
    Bituminous: [0.2, 0.3],
    Granular: [0.25, 0.3],
    'Cement Concrete': [0.3, 0.35],
  };
  if (!limits[surfaceType]) return `❌ Unknown surface type: ${surfaceType}`;
  const [min, max] = limits[surfaceType];
  const passed = value >= min && value <= max;
  return `${
    passed ? '✅ Pass' : '❌ Fail'
  } (${surfaceType} surface, Value = ${value} kg/sqm, Limit = ${min}-${max})`;
};

export const checkSSPrimeCoat = value => {
  const min = 0.7,
    max = 1.0;
  const passed = value >= min && value <= max;
  return `${
    passed ? '✅ Pass' : '❌ Fail'
  } (Prime Coat SS-1, Value = ${value} kg/sqm, Limit = ${min}-${max})`;
};

export const getMaterialsPassingFlakiness = value => {
  const limits = {
    DBM: 35,
    BC: 35,
    WMM: 35,
    CTSB: 35,
    CTB: 35,
    DLC: 35,
    PQC: 35,
    SMA: 30,
    CONCRETE: 35,
  };
  const passing = Object.keys(limits).filter(
    material => value < limits[material],
  );
  return passing.length > 0
    ? `✅ Passing Materials: ${passing.join(', ')}`
    : '❌ No material passes for this value';
};

export const checkAverageFineness = value => {
  return value < 10
    ? `✅ Pass (Average Fineness = ${value}%, Limit < 10%)`
    : `❌ Fail (Average Fineness = ${value}%, Limit < 10%)`;
};

export const getStandardConsistency = (penetrationValue, waterPercent) => {
  return penetrationValue >= 5 && penetrationValue <= 7
    ? `✅ Standard Consistency reached: ${waterPercent}% (penetration = ${penetrationValue} mm)`
    : `❌ Not yet — Penetration = ${penetrationValue} mm (continue test with different water %)`;
};

export const checkMinMax = (value, min, max) => {
  return value >= min && value <= max
    ? `✅ Pass (Value = ${value}, Limit = ${min}–${max})`
    : `❌ Fail (Value = ${value}, Limit = ${min}–${max})`;
};

export const isVGBitumen = materialCategory => {
  const vgCategories = ['VG-10', 'VG-20', 'VG-30', 'VG-40'];
  return vgCategories.includes(materialCategory.toUpperCase()) ? 1 : 0;
};

export const isPMBBitumen = materialCategory => {
  const pmbCategories = [
    'PMB-64-10',
    'PMB-70-10',
    'PMB-76-10',
    'PMB-82-10',
    'PMB-76-31',
  ];
  return pmbCategories.includes(materialCategory.toUpperCase()) ? 1 : 0;
};

export const countPMBSamples = (lotNos, materialCategory) => {
  const pmbCategories = [
    'PMB-64-10',
    'PMB-70-10',
    'PMB-76-10',
    'PMB-82-10',
    'PMB-76-31',
  ];
  return pmbCategories.includes(materialCategory.toUpperCase())
    ? lotNos.length
    : 0;
};

export const countVGSamples = (lotNos, materialCategory) => {
  const vgCategories = ['VG-10', 'VG-20', 'VG-30', 'VG-40'];
  return vgCategories.includes(materialCategory.toUpperCase())
    ? lotNos.length
    : 0;
};

export const checkFinesContent = (sandType, value) => {
  const limits = {
    'Natural sand': 3,
    'Crushed stone sand': 15,
    'Mixed sand': 12,
    'Manufactured sand': 10,
  };
  if (!limits[sandType]) return `❌ Unknown sand type: ${sandType}`;
  const limit = limits[sandType];
  return value <= limit
    ? `✅ Pass (${sandType}, Value = ${value}%, Limit ≤ ${limit}%)`
    : `❌ Fail (${sandType}, Value = ${value}%, Limit ≤ ${limit}%)`;
};

export const getPassingMaterialsFines75 = value => {
  const limits = {CONCRETE: 1, PQC: 1, DLC: 1, DBC: 5, BC: 5, SMA: 2};
  const passing = Object.keys(limits).filter(m => value <= limits[m]);
  return passing.length === 0
    ? '❌ No material passes for this value'
    : `✅ Passing Materials: ${passing.join(', ')}`;
};

export const getPassingMaterialsFracturedFace = value => {
  const limits = {BC: 95, SMA: 95, WMM: 90, CTB: 90, CTSB: 90, DBM: 90};
  const passing = Object.keys(limits).filter(m => value >= limits[m]);
  return passing.length === 0
    ? '❌ No material passes for this value'
    : `✅ Passing Materials: ${passing.join(', ')}`;
};

export const getPassingMaterialsPlasticIndex = value => {
  const limits = {WMM: 6, CTB: 6, CTSB: 6, DBM: 4, BC: 4, SMA: 0};
  const passing = Object.keys(limits).filter(m =>
    m === 'SMA' ? value === 0 : value < limits[m],
  );
  return passing.length === 0
    ? '❌ No material passes for this value'
    : `✅ Passing Materials: ${passing.join(', ')}`;
};

export const checkLiquidLimit = value =>
  value < 50
    ? `✅ Pass (Liquid Limit = ${value}%, Requirement < 50%)`
    : `❌ Fail (Liquid Limit = ${value}%, Requirement < 50%)`;

export const checkSoilPlasticity = (liquidLimit, plasticIndex) => {
  const results = {
    liquidLimit: liquidLimit < 50 ? 'Pass' : 'Fail',
    plasticIndex: plasticIndex < 25 ? 'Pass' : 'Fail',
  };
  results.overall =
    results.liquidLimit === 'Pass' && results.plasticIndex === 'Pass'
      ? '✅ Soil passes requirements'
      : '❌ Soil fails requirements';
  return results;
};

export const checkPlasticityIndex = value =>
  value < 25
    ? `✅ Pass (Plasticity Index = ${value}%, Requirement < 25%)`
    : `❌ Fail (Plasticity Index = ${value}%, Requirement < 25%)`;

export const checkLiquidLimit25 = value =>
  value < 25
    ? `✅ Pass (Liquid Limit = ${value}%, Requirement < 25%)`
    : `❌ Fail (Liquid Limit = ${value}%, Requirement < 25%)`;

export const checkPlasticityIndex6 = value =>
  value < 6
    ? `✅ Pass (Plasticity Index = ${value}%, Requirement < 6%)`
    : `❌ Fail (Plasticity Index = ${value}%, Requirement < 6%)`;

export const isFineAggregateSample1 = source =>
  ['CONCRETE', 'DLC', 'PQC'].includes(source.toUpperCase()) ? 1 : 0;
export const isFineAggregateSample2 = source =>
  ['CONCRETE', 'DLC', 'PQC', 'DBM', 'BC', 'SMA', 'MICRO-SURFACING'].includes(
    source.toUpperCase(),
  )
    ? 1
    : 0;
export const isFineAggregateSample3 = source =>
  [
    'CONCRETE',
    'DLC',
    'PQC',
    'WMM',
    'DBM',
    'BC',
    'SMA',
    'MICRO-SURFACING',
  ].includes(source.toUpperCase())
    ? 1
    : 0;
export const isFineAggregateSample4 = source =>
  [
    'CONCRETE',
    'DLC',
    'PQC',
    'WMM',
    'DBM',
    'BC',
    'SMA',
    'CTSB',
    'CTB',
    'MICRO-SURFACING',
  ].includes(source.toUpperCase())
    ? 1
    : 0;
export const isFineAggregateSample5 = source =>
  ['CONCRETE', 'DLC', 'PQC', 'WMM'].includes(source.toUpperCase()) ? 1 : 0;
export const isFineAggregateSample6 = source =>
  ['WMM', 'DBM', 'BC', 'SMA', 'CTSB', 'CTB'].includes(source.toUpperCase())
    ? 1
    : 0;
export const isCoarseAggregateSample1 = source =>
  ['CONCRETE', 'DLC', 'PQC', 'WMM', 'DBM', 'BC', 'SMA', 'CTSB', 'CTB'].includes(
    source.toUpperCase(),
  )
    ? 1
    : 0;
export const isCoarseAggregateSample2 = source =>
  ['CONCRETE', 'DLC', 'PQC'].includes(source.toUpperCase()) ? 1 : 0;
export const isCoarseAggregateSample3 = source =>
  ['DBM', 'BC', 'SMA'].includes(source.toUpperCase()) ? 1 : 0;
export const isCoarseAggregateSample4 = source =>
  ['DBM', 'BC'].includes(source.toUpperCase()) ? 1 : 0;
export const isCoarseAggregateSample5 = source =>
  ['CONCRETE', 'DLC', 'PQC', 'CTSB', 'CTB'].includes(source.toUpperCase())
    ? 1
    : 0;
export const isCoarseAggregateSample6 = source =>
  [
    'CONCRETE',
    'DLC',
    'PQC',
    'WMM',
    'DBM',
    'BC',
    'SMA',
    'CTSB',
    'CTB',
    'MICRO-SURFACING',
  ].includes(source.toUpperCase())
    ? 1
    : 0;
export const isCoarseAggregateSample7 = source =>
  ['CONCRETE', 'DLC', 'PQC', 'WMM', 'DBM', 'BC', 'SMA'].includes(
    source.toUpperCase(),
  )
    ? 1
    : 0;
export const isCoarseAggregateSample8 = source =>
  ['CONCRETE', 'DLC', 'PQC', 'DBM', 'BC', 'SMA'].includes(source.toUpperCase())
    ? 1
    : 0;
export const isCoarseAggregateSample9 = source =>
  ['CTSB', 'CTB'].includes(source.toUpperCase()) ? 1 : 0;
export const isCoarseAggregateSample10 = source =>
  ['WMM', 'DBM', 'BC', 'SMA'].includes(source.toUpperCase()) ? 1 : 0;

export const checkRetroreflectivity = (value, color, type) => {
  color = color.toLowerCase();
  type = type.toLowerCase();
  let min;
  if (color === 'white' && type === 'beaded') min = 300;
  else if (color === 'yellow' && type === 'beaded') min = 200;
  else if (color === 'white' && type === 'un-beaded') min = 100;
  else
    return 'Invalid input — valid options: (White/Yellow) and (Beaded/Un-beaded)';
  return {
    color,
    type,
    measured_value: value,
    minimum_required: min,
    result: value >= min ? 'Pass' : 'Fail',
  };
};

export const checkUnconfinedCompressiveStrength = (unconfined, avg, char) => {
  const upper = avg * 1.15,
    lower = avg * 0.85;
  const isAccepted = unconfined.every(val => val <= upper && val >= lower);
  if (!isAccepted) return 'Discarded';
  return avg > char ? 'Pass' : 'Fail';
};

export const checkFlexuralStrengthResult = (
  specimenSize,
  strengthArr,
  avg,
  char,
  a,
) => {
  const size = Number(specimenSize);
  if (
    !Array.isArray(strengthArr) ||
    strengthArr.length === 0 ||
    !Number.isFinite(avg)
  )
    return {
      isaccepted: 0,
      result: 'Test Discarded (invalid or missing strength inputs)',
    };
  if ((size === 150 && a < 170) || (size === 100 && a < 110))
    return {
      isaccepted: 0,
      result: 'Test Discarded due to Unsatisfactory Failure (a value too low)',
    };
  const low = avg * 0.85,
    high = avg * 1.15;
  if (strengthArr.some(v => !Number.isFinite(v) || v < low || v > high))
    return {
      isaccepted: 0,
      result: 'Sample Discarded due to > ±15% variation from average strength',
    };
  return {isaccepted: 1, result: avg > char ? 'Pass' : 'Fail'};
};

export const checkFlexuralStrengthResultPqc7thDay = (
  specimenSize,
  strengthArr,
  avg,
  char,
  a,
) => {
  const size = Number(specimenSize);
  if ((size === 150 && a < 170) || (size === 100 && a < 110))
    return {
      isaccepted: 0,
      result: 'Test Discarded due to Unsatisfactory Failure (a too low)',
    };
  if (
    !Array.isArray(strengthArr) ||
    strengthArr.length === 0 ||
    !Number.isFinite(avg)
  )
    return {
      isaccepted: 0,
      result: 'Test Discarded (invalid or missing strength inputs)',
    };
  const low = avg * 0.85,
    high = avg * 1.15;
  if (strengthArr.some(v => !Number.isFinite(v) || v < low || v > high))
    return {
      isaccepted: 0,
      result: 'Sample Discarded due to > ±15% variation from average strength',
    };
  return {isaccepted: 1, result: avg > 0.65 * char ? 'Pass' : 'Fail'};
};

export const getTestCountByTaskName = taskName =>
  ['flushing-operations'].includes(taskName) ? 1 : 0;
