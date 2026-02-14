export function average3Dec(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return 0;
  }
  let sum = values.reduce((acc, val) => acc + val, 0);
  let avg = sum / values.length;
  return parseFloat(avg.toFixed(3));
}
export function average2Dec(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return 0;
  }
  let sum = values.reduce((acc, val) => acc + val, 0);
  let avg = sum / values.length;
  return parseFloat(avg.toFixed(2));
}
export function calculatePercentage(obtained, total) {
  if (total === 0) {
    return 0; // avoid division by zero
  }
  let percent = (obtained / total) * 100;
  return parseFloat(percent.toFixed(2)); // return number with 2 decimals
}
export function calculateTFV(X, Y) {
  if (Y + 4 === 0) {
    throw new Error("Denominator cannot be zero.");
  }
  let tfv = (14 * X) / (Y + 4);
  return parseFloat(tfv.toFixed(2)); // number only
}
export function multiply3Dec(...values) {
  if (values.length === 0) {
    return 0;
  }
  let product = values.reduce((acc, val) => acc * val, 1);
  return parseFloat(product.toFixed(3));
}
export function multiply2Dec(...values) {
  if (values.length === 0) {
    return 0;
  }
  let product = values.reduce((acc, val) => acc * val, 1);
  return parseFloat(product.toFixed(2));
}
export function addValues(...values) {
  return values.reduce((acc, val) => acc + val, 0);
}
export function subtractValues(...values) {
  if (values.length === 0) return 0;
  return values.reduce((acc, val) => acc - val);
}
export function divide2Dec(...values) {
  if (values.length === 0) return 0;
  return parseFloat(values.reduce((acc, val) => {
    if (val === 0) throw new Error("Division by zero is not allowed.");
    return acc / val;
  }).toFixed(2));
}
export function divide3Dec(...values) {
  if (values.length === 0) return 0;
  return parseFloat(values.reduce((acc, val) => {
    if (val === 0) throw new Error("Division by zero is not allowed.");
    return acc / val;
  }).toFixed(3));
}
export function complexModulus1Dec(Gstar, deltaDegrees) {
  // convert degrees to radians
  let deltaRadians = (Math.PI / 180) * deltaDegrees;

  if (Math.sin(deltaRadians) === 0) {
    throw new Error("sin(δ) cannot be zero.");
  }

  let value = Gstar / Math.sin(deltaRadians);
  return parseFloat(value.toFixed(1)); // 1 decimal
}
export function specificGravityKerosene2Dec(W1, W4, W5) {
  if (W4 === W1) {
    throw new Error("Denominator (W4 - W1) cannot be zero.");
  }
  let SG = (W5 - W1) / (W4 - W1);
  return parseFloat(SG.toFixed(2));
}
export function specificGravityCement2Dec(W1, W2, W3, W5, W6) {
  let numerator = (W2 - W1) * W6;
  let denominator = (W2 - W1) - (W3 - W5);

  if (denominator === 0) {
    throw new Error("Denominator cannot be zero.");
  }

  let SG = numerator / denominator;
  return parseFloat(SG.toFixed(2));
}
export function multiplyInt(...numbers) {
  let result = 1;
  for (let num of numbers) {
    result *= num;
  }
  return Math.floor(result); // returns integer value
}

export function checkRange(value, min, max) {
  return (value >= min && value <= max) ? "Pass" : "Fail";
}
export function greaterThan(value, limit) {
  return value > limit ? "Pass" : "Fail";
}
export function greaterThanOrEqual(value, limit) {
  return value >= limit ? "Pass" : "Fail";
}
export function lessThan(value, limit) {
  return value < limit ? "Pass" : "Fail";
}
export function lessThanOrEqual(value, limit) {
  return value <= limit ? "Pass" : "Fail";
}
export function overallStatus(...values) {
  return values.includes("Rejected") ? "Rejected" : "Accepted";
}
export function divideInt(...values) {
  if (values.length === 0) return 0;
  return values.reduce((acc, val, idx) => {
    if (val === 0) throw new Error("Division by zero is not allowed.");
    return idx === 0 ? val : Math.floor(acc / val);
  });
}


export function subtract3Dec(...values) {
  if (values.length === 0) return 0;

  let result = values.reduce((acc, val) => acc - val);
  return parseFloat(result.toFixed(3));
}

export function square3Dec(value) {
  let result = value * value;
  return parseFloat(result.toFixed(3));
}


export function sqrt3Dec(value) {
  if (value < 0) {
    throw new Error("Square root of negative numbers is not allowed.");
  }
  let result = Math.sqrt(value);
  return parseFloat(result.toFixed(3));
}


export function rangeBasedCalculation(value, min, max, lessFn, withinFn, greaterFn) {
  if (value < min) {
    return lessFn(value);       // run "less" case formula
  } 
  else if (value > max) {
    return greaterFn(value);    // run "greater" case formula
  } 
  else {
    return withinFn(value);     // run "within" case formula
  }
}


export function flexuralStrength(P, L, b, d, a, specimenSize) {
  
  let fr;

  if (specimenSize === 150) {
    if (a > 200) {
      fr = (P * 1000 * L) / (b * d * d);
    } else if (a > 170 && a <= 200) {
      fr = (3 * P * 1000 * a) / (b * d * d);
    } else {
      throw new Error("Invalid 'a' value for 150 mm specimen.");
    }
  } 
  else if (specimenSize === 100) {
    if (a > 130) {
      fr = (P * 1000 * L) / (b * d * d);
    } else if (a > 110 && a <= 133) {
      fr = (3 * P * 1000 * a) / (b * d * d);
    } else {
      throw new Error("Invalid 'a' value for 100 mm specimen.");
    }
  } 
  else {
    throw new Error("Invalid specimen size. Use 150 or 100.");
  }

  return parseFloat(fr.toFixed(3)); // return with 3 decimals
}
export function pickValue(val1, val2) {
  if (val1 > 0) return val1;
  if (val2 > 0) return val2;
  throw new Error("Both values are invalid (≤ 0).");
}
export function getMaxValue(...args) {
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
}
export function getSin(value) {
  return Math.sin(value);
}
export function divideCeil(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return Math.ceil(a / b);
}
export function divideCeilMin2(a, b) {
  if (b === 0) throw new Error("Division by zero");
  let result = Math.ceil(a / b);
  return result < 2 ? 2 : result; // ensure minimum is 2
}
export function countArray(arr) {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }
  return arr.length;
}
export function getFlyAshSampleCount(quantityTonne) {
  if (quantityTonne <= 0) {
    throw new Error("Quantity must be greater than 0");
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
    // optional: beyond 1000 T, every 200 T adds 1 sample
  }
}
export function getSilicaFumeSampleCount(quantityTonne) {
  if (quantityTonne <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (quantityTonne <= 100) {
    return 2; // fixed for up to 100 T
  } else {
    // 2 tests for first 100T + ceil of remaining/100
    return 2 + Math.ceil((quantityTonne - 100) / 100);
  }
}
export function getReinforcementSampleCount(quantityTonne) {
  if (quantityTonne <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  let tests;
  if (quantityTonne <= 100) {
    tests = 2; // fixed for up to 100T
  } else {
    // 2 tests for first 100T + ceil of remaining/100
    tests = 2 + Math.ceil((quantityTonne - 100) / 100);
  }

  // enforce minimum 2 tests per lot
  return Math.max(tests, 2);
}
export function getHumePipeSampleCount(quantityPipes) {
  if (quantityPipes <= 0) {
    throw new Error("Quantity must be greater than 0");
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

  // ensure minimum = 8 samples
  return Math.max(samples, 8);
}
export function getPrecastKerbSampleCount(quantityRM) {
  if (quantityRM <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (quantityRM <= 900) {
    return 1; // one test upto 900 rm
  } else {
    // 1 test for first 900 rm + ceil of remaining/1800
    return 1 + Math.ceil((quantityRM - 900) / 1800);
  }
}
export function getBrickSampleCount(quantityBricks) {
  if (quantityBricks <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  let tests;
  if (quantityBricks <= 2000) {
    tests = 0;
  } else if (quantityBricks <= 10000) {
    tests = 5;
  } else if (quantityBricks <= 35000) {
    tests = 10;
  } else if (quantityBricks <= 50000) {
    tests = 15;
  } else {
    tests = 15;
  }

  return tests;
}
export function checkAbsoluteViscosity60C(materialCategory, average_value) {
  const cat = String(materialCategory).toUpperCase();
  const value = Number(average_value);

  if (isNaN(value)) {
    return "Invalid Input";
  }

  // Specification limits
  const limits = {
    "VG-40": { min: 3200, max: 4800 },
    "VG-30": { min: 2400, max: 3600 },
    "VG-20": { min: 1600, max: 2400 },
    "VG-10": { min: 800,  max: 1200 }
  };

  if (!limits[cat]) {
    return "Invalid materialCategory";
  }

  const { min, max } = limits[cat];

  return value >= min && value <= max ? "Pass" : "Fail";
}
export function checkBentonitePolymerTesting(
  material_type,
  specific_gravity,
  ph,
  viscosity_sec,
  sand_content,
  liquid_limit_of_powder
) {
  const type = String(material_type).toLowerCase();
  const sg = Number(specific_gravity);
  const pH = Number(ph);
  const viscosity = Number(viscosity_sec);
  const sand = Number(sand_content);
  const liquidLimit = Number(liquid_limit_of_powder);

  if (type !== "polymer" && type !== "bentonite") {
    return "Invalid material-type";
  }

  let isPass = true;

  if (type === "polymer") {
    // Specific Gravity: 1.02–1.10
    if (sg < 1.02 || sg > 1.10) isPass = false;

    // Marsh Cone Viscosity: 40–70 sec
    if (viscosity < 40 || viscosity > 70) isPass = false;

    // pH: 9–11
    if (pH < 9 || pH > 11) isPass = false;

    // Sand Content: ≤ 1%
    if (sand > 1) isPass = false;

    // Liquid Limit: Not applicable (no check)
  }

  if (type === "bentonite") {
    // Specific Gravity: 1.03–1.10
    if (sg < 1.03 || sg > 1.10) isPass = false;

    // Marsh Cone Viscosity: 32–50 sec
    if (viscosity < 32 || viscosity > 50) isPass = false;

    // pH: 9–11
    if (pH < 9 || pH > 11) isPass = false;

    // Sand Content: ≤ 1%
    if (sand > 1) isPass = false;

    // Liquid Limit of Powder: ≥ 300% (for bentonite powder only)
    if (liquidLimit < 300) isPass = false;
  }

  return isPass ? "Pass" : "Fail";
}
export function checkRelativeCompaction(rcValue) {
  if (rcValue > 100) {
    return "Discard Sample (Relative Compaction > 100%)";
  } else if (rcValue > 98) {
    return "Pass (Relative Compaction within limits)";
  } else {
    return "Fail (Relative Compaction ≤ 98%)";
  }
}
export function checkEmulsionTackCoat(type_of_underlaying_surface, tray_area, weight_of_emulsion_gm) {
  const surface = String(type_of_underlaying_surface).toLowerCase();
  const area = Number(tray_area);
  const weightKg = Number(weight_of_emulsion_gm) / 1000; // gm → kg

  if (!area || area <= 0 || isNaN(weightKg)) {
    return "Invalid Input";
  }

  // Calculate applied rate (kg per sqm)
  const appliedRate = weightKg / area;

  // Specification limits (kg/sqm)
  const limits = {
    "bituminous-surface": { min: 0.2, max: 0.3 },
    "granular-surface":   { min: 0.25, max: 0.3 },
    "cement-concrete":    { min: 0.3, max: 3.5 }
  };

  if (!limits[surface]) {
    return "Invalid Surface Type";
  }

  const { min, max } = limits[surface];

  return (appliedRate >= min && appliedRate <= max) ? "Pass" : "Fail";
}
export function checkMinMax(value, min, max) {
  if (value >= min && value <= max) {
    return `✅ Pass (Value = ${value}, Limit = ${min}–${max})`;
  } else {
    return `❌ Fail (Value = ${value}, Limit = ${min}–${max})`;
  }
}
export function isVGBitumen(materialCategory) {
  const vgCategories = ["VG-10", "VG-20", "VG-30", "VG-40"];

  if (vgCategories.includes(materialCategory.toUpperCase())) {
    return 1;  // Yes → it's a VG bitumen
  } else {
    return 0;  // No → not VG
  }
}
export function isPMBBitumen(materialCategory) {
  const pmbCategories = [
    "PMB-64-10",
    "PMB-70-10",
    "PMB-76-10",
    "PMB-82-10",
    "PMB-76-22"
  ];

  if (pmbCategories.includes(materialCategory.toUpperCase())) {
    return 1;  // Yes → it's a PMB bitumen
  } else {
    return 0;  // No → not PMB
  }
}
export function countPMBSamples(lotNos, materialCategory) {
  const pmbCategories = [
    "PMB-64-10",
    "PMB-70-10",
    "PMB-76-10",
    "PMB-82-10",
    "PMB-76-22"
  ];

  if (pmbCategories.includes(materialCategory.toUpperCase())) {
    return lotNos.length;
  } else {
    return 0;
  }
}
export function countVGSamples(lotNos, materialCategory) {
  const vgCategories = ["VG-10", "VG-20", "VG-30", "VG-40"];

  if (vgCategories.includes(materialCategory.toUpperCase())) {
    return lotNos.length;
  } else {
    return 0;
  }
}
export function checkFinesContent(sandType, value) {
  const limits = {
    "Natural sand": 3,
    "Crushed stone sand": 15,
    "Mixed sand": 12,
    "Manufactured sand": 10
  };

  if (!limits[sandType]) {
    return `❌ Unknown sand type: ${sandType}`;
  }

  const limit = limits[sandType];

  if (value <= limit) {
    return `✅ Pass (${sandType}, Value = ${value}%, Limit ≤ ${limit}%)`;
  } else {
    return `❌ Fail (${sandType}, Value = ${value}%, Limit ≤ ${limit}%)`;
  }
}
export function checkSoilPlasticity(liquidLimit, plasticIndex) {
  let results = {};

  // Check Liquid Limit
  if (liquidLimit < 50) {
    results.liquidLimit = "Pass";
  } else {
    results.liquidLimit = "Fail";
  }

  // Check Plasticity Index
  if (plasticIndex < 25) {
    results.plasticIndex = "Pass";
  } else {
    results.plasticIndex = "Fail";
  }

  // Overall Result
  if (results.liquidLimit === "Pass" && results.plasticIndex === "Pass") {
    results.overall = "✅ Soil passes requirements";
  } else {
    results.overall = "❌ Soil fails requirements";
  }

  return results;
}
export function isFineAggregateSample1(sourceProposedFor) {
  const validSources = ["CONCRETE", "DLC", "PQC"];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for fine aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isFineAggregateSample2(sourceProposedFor) {
  const validSources = [
    "CONCRETE",
    "DLC",
    "PQC",
    "DBM",
    "BC",
    "SMA",
    "MICRO SURFACING"
  ];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for fine aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isFineAggregateSample3(sourceProposedFor) {
  const validSources = [
    "CONCRETE",
    "DLC",
    "PQC",
    "WMM",
    "DBM",
    "BC",
    "SMA",
    "MICRO SURFACING"
  ];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for fine aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isFineAggregateSample4(sourceProposedFor) {
  const validSources = [
    "CONCRETE",
    "DLC",
    "PQC",
    "WMM",
    "DBM",
    "BC",
    "SMA",
    "CTSB",
    "CTB",
    "MICRO SURFACING"
  ];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for fine aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isFineAggregateSample5(sourceProposedFor) {
  const validSources = ["CONCRETE", "DLC", "PQC", "WMM"];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for fine aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isFineAggregateSample6(sourceProposedFor) {
  const validSources = ["WMM", "DBM", "BC", "SMA", "CTSB", "CTB"];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for fine aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isCoarseAggregateSample1(sourceProposedFor) {
  const validSources = [
    "CONCRETE",
    "DLC",
    "PQC",
    "WMM",
    "DBM",
    "BC",
    "SMA",
    "CTSB",
    "CTB"
  ];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for coarse aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isCoarseAggregateSample2(sourceProposedFor) {
  const validSources = ["CONCRETE", "DLC", "PQC"];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for coarse aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isCoarseAggregateSample3(sourceProposedFor) {
  const validSources = ["DBM", "BC", "SMA"];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for coarse aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isCoarseAggregateSample4(sourceProposedFor) {
  const validSources = ["DBM", "BC"];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for coarse aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isCoarseAggregateSample5(sourceProposedFor) {
  const validSources = ["CONCRETE", "DLC", "PQC", "CTSB", "CTB"];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for coarse aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isCoarseAggregateSample6(sourceProposedFor) {
  const validSources = [
    "CONCRETE",
    "DLC",
    "PQC",
    "WMM",
    "DBM",
    "BC",
    "SMA",
    "CTSB",
    "CTB",
    "MICRO SURFACING"
  ];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for coarse aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isCoarseAggregateSample7(sourceProposedFor) {
  const validSources = ["CONCRETE", "DLC", "PQC", "WMM", "DBM", "BC", "SMA"];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for coarse aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isCoarseAggregateSample8(sourceProposedFor) {
  const validSources = ["CONCRETE", "DLC", "PQC", "DBM", "BC", "SMA"];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for coarse aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isCoarseAggregateSample9(sourceProposedFor) {
  const validSources = ["CTSB", "CTB"];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for coarse aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function isCoarseAggregateSample10(sourceProposedFor) {
  const validSources = ["WMM", "DBM", "BC", "SMA"];

  if (validSources.includes(sourceProposedFor.toUpperCase())) {
    return 1;  // Yes → valid for coarse aggregate sample
  } else {
    return 0;  // No → not valid
  }
}
export function checkRetroreflectivity(value, color, type) {
  // Normalize inputs
  color = color.toLowerCase();
  type = type.toLowerCase();

  let minValue;

  // Define required minimums
  if (color === "white" && type === "beaded") {
    minValue = 300;
  } else if (color === "yellow" && type === "beaded") {
    minValue = 200;
  } else if (color === "white" && type === "un-beaded") {
    minValue = 100;
  } else {
    return "Invalid input — valid options: (White/Yellow) and (Beaded/Un-beaded)";
  }

  // Determine status
  let status = value >= minValue ? "Pass" : "Fail";

  // Return object for clear use
  return status;
}
export function checkUnconfinedCompressiveStrength(
  unconfined_compressive_strength_p_pa,
  avg_unconfined_compressive_strength_mpa,
  characteristic_unconfined_compressive_strengthfucs_mpa
) {
  // local variable to track if sample is accepted (1) or discarded (0)
  let isAccepted = 1;

  // Check discard condition
  for (let i = 0; i < unconfined_compressive_strength_p_pa.length; i++) {
    let individual = unconfined_compressive_strength_p_pa[i];
    let upperLimit = avg_unconfined_compressive_strength_mpa * 1.15;
    let lowerLimit = avg_unconfined_compressive_strength_mpa * 0.85;

    if (individual > upperLimit || individual < lowerLimit) {
      isAccepted = 0;
      break;
    }
  }

  // If discarded, stop and return immediately
  if (isAccepted === 0) {
    return "Discarded";
  }

  // Only if accepted, check for Pass/Fail
  if (isAccepted === 1) {
    if (avg_unconfined_compressive_strength_mpa > characteristic_unconfined_compressive_strengthfucs_mpa) {
      return "Pass";
    } else {
      return "Fail";
    }
  }
}
export function checkFlexuralStrengthResult(
  specimen_size,
  flexural_strength_mpa,                    // array of numbers
  average_flexural_strength_mpa,            // number
  fcs_characteristic_flexural_strength,     // number
  distance_between_fracture_line_and_nearest_support_mm_a // number
) {
  // Normalize specimen_size to number (accept '150'/'100')
  const size = Number(specimen_size);
  let isaccepted = 1;
  let result = "";

  // --- 0) Basic input validation ---
  if (!Array.isArray(flexural_strength_mpa) || flexural_strength_mpa.length === 0 || !Number.isFinite(average_flexural_strength_mpa)) {
    return { isaccepted: 0, result: "Test Discarded (invalid or missing strength inputs)" };
  }

  // --- 1) Unsatisfactory failure: 'a' too low ---
  const a = Number(distance_between_fracture_line_and_nearest_support_mm_a);
  if ((size === 150 && a < 170) || (size === 100 && a < 110)) {
    return { isaccepted: 0, result: "Test Discarded due to Unsatisfactory Failure (a value too low)" };
  }

  // --- 2) ±15% variation check vs provided average ---
  const lowerLimit = average_flexural_strength_mpa * 0.85;
  const upperLimit = average_flexural_strength_mpa * 1.15;

  for (let i = 0; i < flexural_strength_mpa.length; i++) {
    const v = flexural_strength_mpa[i];
    if (!Number.isFinite(v) || v < lowerLimit || v > upperLimit) {
      return {
        isaccepted: 0,
        result: "Sample Discarded due to > ±15% variation from average strength"
      };
    }
  }
  
  // --- 3) Pass/Fail only if accepted ---
  if (isaccepted === 1) {
    const passes = average_flexural_strength_mpa > fcs_characteristic_flexural_strength;
    result = passes ? "Pass" : "Fail";
  }

  return { isaccepted, result };
}
export function checkFlexuralStrengthResultPqc7thDay(
  specimen_size,
  flexural_strength_mpa, // array of numbers
  average_strength_mpa, // number
  fcs_characteristic_flexural_strength, // number
  distance_between_fracture_line_and_nearest_support_mm_a // number
) {
  // Normalize specimen_size to number to accept '150' or 150
  const size = Number(specimen_size);
  let isaccepted = 1;
  let result = "";

  // --- 1) Unsatisfactory failure check on 'a' (discard whole test) ---
  const a = Number(distance_between_fracture_line_and_nearest_support_mm_a);
  if (
    (size === 150 && a < 170) ||
    (size === 100 && a < 110)
  ) {
    isaccepted = 0;
    result = "Test Discarded due to Unsatisfactory Failure (a too low)";
    return { isaccepted, result };
  }

  // --- 2) ±15% variation check against provided average ---
  if (!Array.isArray(flexural_strength_mpa) || flexural_strength_mpa.length === 0 || !Number.isFinite(average_strength_mpa)) {
    isaccepted = 0;
    result = "Test Discarded (invalid or missing strength inputs)";
    return { isaccepted, result };
  }

  const lowerLimit = average_strength_mpa * 0.85;
  const upperLimit = average_strength_mpa * 1.15;

  for (let i = 0; i < flexural_strength_mpa.length; i++) {
    const v = flexural_strength_mpa[i];
    if (!Number.isFinite(v) || v < lowerLimit || v > upperLimit) {
      isaccepted = 0;
      result = "Sample Discarded due to > ±15% variation from average strength";
      return { isaccepted, result }; // stop immediately when discarded
    }
  }

  // --- 3) Pass/Fail only if accepted ---
  if (isaccepted === 1) {
    const threshold = 0.65 * fcs_characteristic_flexural_strength;
    result = average_strength_mpa > threshold ? "Pass" : "Fail";
  }

  return { isaccepted, result };
}
export function checkFlexuralStrengthResultPqc28thDay(
  specimen_size,
  flexural_strength_mpa, // array of numbers
  average_strength_mpa,  // number
  fcs_characteristic_flexural_strength, // number
  distance_between_fracture_line_and_nearest_support_mm_a // number
) {
  const size = Number(specimen_size);
  const a = Number(distance_between_fracture_line_and_nearest_support_mm_a);
  let isaccepted = 1;
  let result = "";

  // 0) Basic validation
  if (
    !Array.isArray(flexural_strength_mpa) ||
    flexural_strength_mpa.length === 0 ||
    !Number.isFinite(average_strength_mpa) ||
    average_strength_mpa <= 0
  ) {
    isaccepted = 0;
    result = "Test Discarded (invalid or missing strength inputs)";
    return { isaccepted, result };
  }

  // 1) Unsatisfactory failure on 'a'
  if ((size === 150 && a < 170) || (size === 100 && a < 110)) {
    isaccepted = 0;
    result = "Test Discarded due to Unsatisfactory Failure (a too low)";
    return { isaccepted, result };
  }

  // 2) ±15% variation check vs provided average
  const lowerLimit = average_strength_mpa * 0.85;
  const upperLimit = average_strength_mpa * 1.15;

  for (let i = 0; i < flexural_strength_mpa.length; i++) {
    const v = Number(flexural_strength_mpa[i]);
    if (!Number.isFinite(v) || v < lowerLimit || v > upperLimit) {
      isaccepted = 0;
      result = "Sample Discarded due to > ±15% variation from average strength";
      return { isaccepted, result };
    }
  }

  // 3) Pass/Fail only if accepted
  if (isaccepted === 1) {
    const threshold = fcs_characteristic_flexural_strength - 0.1;
    result = average_strength_mpa >= threshold ? "Pass" : "Fail";
  }

  return { isaccepted, result };
}
export function checkSoilCompaction(componentType, subComponentType, average_relative_compaction_in_percent) {
  // Convert input to number
  const rc = Number(average_relative_compaction_in_percent);
  let result = "";

  // --- Step 1: Check if sample should be discarded ---
  if (rc > 100) {
    result = "Sample Discarded";
    return result; // Stop further checks
  }

  // --- Step 2: Determine acceptance based on component type ---
  if (componentType === "embankment") {
    result = rc > 95 ? "Pass" : "Fail";
  } else if (
    subComponentType === "sub-grade" ||
    componentType === "earthen-layer"
  ) {
    result = rc > 97 ? "Pass" : "Fail";
  } else {
    result = "Component type not applicable";
  }

  return result;
}
export function checkOffset(offset) {
  const value = Number(offset);
  return value < 0.5 ? 96 : 98;
}
export function getMinValue(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return "Invalid input"; // handle empty or non-array input
  }

  return Math.min(...arr);
}
export function checkElasticRecovery(min_elastic_recovery_percent, materialCategory) {
  const value = Number(min_elastic_recovery_percent);
  let requiredValue;

  switch (materialCategory) {
    case "PMB-64-10":
    case "PMB-70-10":
    case "PMB-76-10":
      requiredValue = 70;
      break;
    case "PMB-82-10":
      requiredValue = 85;
      break;
    case "PMB-76-22":
      requiredValue = 80;
      break;
    default:
      return "Invalid material category";
  }

  return value >= requiredValue ? "Pass" : "Fail";
}
export function checkFinesPassing75MicronsFA(materialCategory, passing_c_percent) {
  const value = Number(passing_c_percent);
  let limit;

  switch (materialCategory) {
    case "natural-sand":
      limit = 3;
      break;
    case "crushed-stone-sand":
      limit = 15;
      break;
    case "mixed-sand":
      limit = 12;
      break;
    case "manufactured-sand":
      limit = 10;
      break;
    default:
      return "Invalid material category";
  }

  return value <= limit ? "Pass" : "Fail";
}
export function checkFinesPassing75MicronsCA(materialType, passing_c_percent) {
  const value = Number(passing_c_percent);

  // Validate inputs
  if (!Array.isArray(materialType) || materialType.length === 0) {
    return "Invalid input";
  }

  // Define allowable limits by material type
  const limits = {
    concrete: 1,
    pqc: 1,
    dlc: 1,
    dbm: 5,
    bc: 5,
    sma: 2,
  };

  // Iterate through all material types and check if each satisfies its limit
  for (const type of materialType) {
    const limit = limits[type.toLowerCase()];
    if (limit === undefined) {
      return "Invalid material type"; // unexpected input
    }
    if (value > limit) {
      return "Fail"; // if any condition fails, overall result = Fail
    }
  }

  return "Pass"; // all material types satisfied their limits
}
export function checkAivResult(materialUsedFor, average_aiv_value, loss_in_weight_w4) {
  const aiv = Number(average_aiv_value);
  const w4 = Number(loss_in_weight_w4);

  // 1) Discard condition based on W4
  if (w4 > 1) {
    return "Sample Discarded (W4 > 1 gm, retest)";
  }

  // 2) AIV limits as per material use
  const material = String(materialUsedFor).toLowerCase();
  let maxLimit;

  switch (material) {
    case "dlc":
    case "pqc":
    case "wmm":
      maxLimit = 30;
      break;
    case "bc":
      maxLimit = 24;
      break;
    case "dbm":
      maxLimit = 27;
      break;
    case "sma":
      maxLimit = 18;
      break;
    case "concrete":
      maxLimit = 45;
      break;
    case "gsb":
    case "ctsb":
    case "ctb":
      maxLimit = 40;
      break;
    default:
      return "Invalid materialUsedFor";
  }

  // 3) Pass / Fail based on AIV
  return aiv <= maxLimit ? "Pass" : "Fail";
}
export function checkFiEi(materialUsedFor, combined_flakiness_and_elongation_index) {
  const value = Number(combined_flakiness_and_elongation_index);
  const material = String(materialUsedFor).toLowerCase();
  let limit;

  // Set limits based on material
  switch (material) {
    case "dbm":
    case "bc":
    case "wmm":
    case "ctsb":
    case "ctb":
    case "dlc":
    case "pqc":
      limit = 35;
      break;
    case "sma":
      limit = 30;
      break;
    default:
      return "Invalid materialUsedFor";
  }

  // Pass / Fail logic
  return value < limit ? "Pass" : "Fail";
}
export function checkFi(materialUsedFor, flakiness_index_fi) {
  const value = Number(flakiness_index_fi);
  const material = String(materialUsedFor).toLowerCase();

  if (material !== "concrete") {
    return "Invalid materialUsedFor";
  }

  const limit = 35; // FI < 35% for concrete

  return value < limit ? "Pass" : "Fail";
}
export function checkLosAngelesAbrasion(sourceProposedFor, average_los_angeles_abrasion_value) {
  const value = Number(average_los_angeles_abrasion_value);
  const material = String(sourceProposedFor).toLowerCase();
  let limit;

  switch (material) {
    case "dlc":
    case "pqc":
    case "bc":
      limit = 30;
      break;

    case "concrete":
      limit = 50;
      break;

    case "wmm":
    case "ctb":
    case "ctsb":
      limit = 40;
      break;

    case "dbm":
      limit = 35;
      break;

    case "sma":
      limit = 25;
      break;

    default:
      return "Invalid material type";
  }

  return value < limit ? "Pass" : "Fail";
}
export function checkTenPercentFinesValue(sourceProposedFor, average_value_of_10_percent_fines) {
  const value = Number(average_value_of_10_percent_fines);
  const material = String(sourceProposedFor).toLowerCase();

  // Only valid materials
  if (material !== "ctsb" && material !== "ctb") {
    return "Invalid material type";
  }

  const limit = 50; // TFV > 50 kN required

  return value > limit ? "Pass" : "Fail";
}
export function checkFracturedFace(materialUsedFor, average_fractured_face) {
  const value = Number(average_fractured_face);
  const material = String(materialUsedFor).toLowerCase();
  let limit;

  switch (material) {
    case "bc":
    case "sma":
      limit = 95; // Minimum 95%
      break;

    case "wmm":
    case "ctb":
    case "ctsb":
    case "dbm":
      limit = 90; // Minimum 90%
      break;

    default:
      return "Invalid materialUsedFor";
  }

  return value >= limit ? "Pass" : "Fail";
}
export function calculateOMCParabolicFit(water_content_n_percent, dry_density_p_gmcc) {
  if (
    !Array.isArray(water_content_n_percent) ||
    !Array.isArray(dry_density_p_gmcc) ||
    water_content_n_percent.length !== dry_density_p_gmcc.length ||
    water_content_n_percent.length < 3
  ) {
    return "Invalid input";
  }

  const n = water_content_n_percent.length;

  let sumW = 0,
      sumW2 = 0,
      sumW3 = 0,
      sumW4 = 0,
      sumD = 0,
      sumWD = 0,
      sumW2D = 0;

  for (let i = 0; i < n; i++) {
    const w = Number(water_content_n_percent[i]);
    const d = Number(dry_density_p_gmcc[i]);

    const w2 = w * w;
    const w3 = w2 * w;
    const w4 = w3 * w;

    sumW += w;
    sumW2 += w2;
    sumW3 += w3;
    sumW4 += w4;

    sumD += d;
    sumWD += w * d;
    sumW2D += w2 * d;
  }

  const A = [
    [sumW4, sumW3, sumW2],
    [sumW3, sumW2, sumW],
    [sumW2, sumW,  n]
  ];

  const B = [sumW2D, sumWD, sumD];

  function determinant(m) {
    return (
      m[0][0] * (m[1][1]*m[2][2] - m[1][2]*m[2][1]) -
      m[0][1] * (m[1][0]*m[2][2] - m[1][2]*m[2][0]) +
      m[0][2] * (m[1][0]*m[2][1] - m[1][1]*m[2][0])
    );
  }

  const detA = determinant(A);
  if (detA === 0) return "Unable to fit parabola";

  function replaceColumn(mat, colIndex, values) {
    const m = JSON.parse(JSON.stringify(mat));
    for (let i = 0; i < 3; i++) m[i][colIndex] = values[i];
    return m;
  }

  const a = determinant(replaceColumn(A, 0, B)) / detA;
  const b = determinant(replaceColumn(A, 1, B)) / detA;

  // OMC = -b / (2a)
  const OMC = -b / (2 * a);

  return Number(OMC.toFixed(3));
}
export function calculateMDDParabolicFit(water_content_n_percent, dry_density_p_gmcc) {
  if (
    !Array.isArray(water_content_n_percent) ||
    !Array.isArray(dry_density_p_gmcc) ||
    water_content_n_percent.length !== dry_density_p_gmcc.length ||
    water_content_n_percent.length < 3
  ) {
    return "Invalid input";
  }

  const n = water_content_n_percent.length;

  let sumW = 0,
      sumW2 = 0,
      sumW3 = 0,
      sumW4 = 0,
      sumD = 0,
      sumWD = 0,
      sumW2D = 0;

  for (let i = 0; i < n; i++) {
    const w = Number(water_content_n_percent[i]);
    const d = Number(dry_density_p_gmcc[i]);

    const w2 = w * w;
    const w3 = w2 * w;
    const w4 = w3 * w;

    sumW += w;
    sumW2 += w2;
    sumW3 += w3;
    sumW4 += w4;

    sumD += d;
    sumWD += w * d;
    sumW2D += w2 * d;
  }

  const A = [
    [sumW4, sumW3, sumW2],
    [sumW3, sumW2, sumW],
    [sumW2, sumW,  n]
  ];

  const B = [sumW2D, sumWD, sumD];

  function determinant(m) {
    return (
      m[0][0] * (m[1][1]*m[2][2] - m[1][2]*m[2][1]) -
      m[0][1] * (m[1][0]*m[2][2] - m[1][2]*m[2][0]) +
      m[0][2] * (m[1][0]*m[2][1] - m[1][1]*m[2][0])
    );
  }

  const detA = determinant(A);
  if (detA === 0) return "Unable to fit parabola";

  function replaceColumn(mat, colIndex, values) {
    const m = JSON.parse(JSON.stringify(mat));
    for (let i = 0; i < 3; i++) m[i][colIndex] = values[i];
    return m;
  }

  const a = determinant(replaceColumn(A, 0, B)) / detA;
  const b = determinant(replaceColumn(A, 1, B)) / detA;
  const c = determinant(replaceColumn(A, 2, B)) / detA;

  // Vertex value of parabola: MDD = c - (b^2 / (4a))
  const MDD = c - (b * b) / (4 * a);

  return Number(MDD.toFixed(3));
}
export function checkProctorDensity(
  componentType,
  subComponentType,
  maximum_dry_density_gmcc,
  proposed_height_of_embankment
) {
  const mdd = Number(maximum_dry_density_gmcc);
  const height = Number(proposed_height_of_embankment);
  const comp = String(componentType).toLowerCase();
  const subcomp = String(subComponentType).toLowerCase();
  let requiredMDD;

  // Case 1 — Embankment
  if (comp === "embankment") {
    if (height <= 3.0) {
      requiredMDD = 1.55;
    } else {
      requiredMDD = 1.63;
    }
    return mdd >= requiredMDD ? "Pass" : "Fail";
  }

  // Case 2 — Subgrade
  if (subcomp === "sub-grade") {
    requiredMDD = 1.75;
    return mdd >= requiredMDD ? "Pass" : "Fail";
  }

  // Invalid / unsupported type
  return "Invalid componentType or subComponentType";
}
export function checkViscosity150(materialCategory, average_value) {
  const value = Number(average_value);
  const category = String(materialCategory).toUpperCase();
  let requiredValue;

  switch (category) {
    case "PMB-64-10":
    case "PMB-70-10":
    case "PMB-76-10":
      requiredValue = 1.2;
      break;

    case "PMB-82-10":
      requiredValue = 1.6;
      break;

    case "PMB-76-22":
      requiredValue = 1.5;
      break;

    default:
      return "Invalid materialCategory";
  }

  return value >= requiredValue ? "Pass" : "Fail";
}
export function checkLuxIllumination(location, average_lux) {
  const loc = String(location).toLowerCase();
  const lux = Number(average_lux);
  let requiredLux;

  // Assign required lux based on location
  switch (loc) {
    case "main-carriageway":
    case "service-road":
      requiredLux = 25;
      break;

    case "median-opening":
    case "bus-lay-bye-or-truck-lay-bye":
    case "bus-queue-shelter":
    case "junction":
    case "island":
    case "others":
      requiredLux = 40;
      break;

    case "toll-plaza":
      requiredLux = 100;
      break;

    default:
      return "Invalid location";
  }

  // Pass / Fail check
  return lux >= requiredLux ? "Pass" : "Fail";
}
export function checkBridgeLoadTestDetailed(
  rebound_percent_midspan_l2,
  rebound_percent_quarter_span_l4,
  rebound_percent_quarter_span_3l4,
  deflection_at_midspan_l2_finaldeflection_mm,
  deflection_at_quarter_span_l4_finaldeflection_mm,
  deflection_at_quarter_span_3l4_finaldeflection_mm,
  deflection_at_midspan_l2_theoretical_deflection_mm,
  deflection_at_quarter_span_l4_theoretical_deflection_mm,
  deflection_at_quarter_span_3l4_theoretical_deflection_mm,
  segmentCategory
) {
  const rL2 = Number(rebound_percent_midspan_l2);
  const rL4 = Number(rebound_percent_quarter_span_l4);
  const r3L4 = Number(rebound_percent_quarter_span_3l4);

  const defL2Final = Number(deflection_at_midspan_l2_finaldeflection_mm);
  const defL4Final = Number(deflection_at_quarter_span_l4_finaldeflection_mm);
  const def3L4Final = Number(deflection_at_quarter_span_3l4_finaldeflection_mm);

  const defL2Theo = Number(deflection_at_midspan_l2_theoretical_deflection_mm);
  const defL4Theo = Number(deflection_at_quarter_span_l4_theoretical_deflection_mm);
  const def3L4Theo = Number(deflection_at_quarter_span_3l4_theoretical_deflection_mm);

  const category = String(segmentCategory).toLowerCase();
  let requiredRecovery;

  // --- Minimum percentage recovery based on segmentCategory ---
  switch (category) {
    case "rcc-deck-slab":
    case "pre-cast-rcc-girder-and-cis-deck-slab":
    case "composite-steel-girder-and-cis-deck-slab":
    case "cast-in-situ-box-girder":
    case "steel-truss-and-cis-deck-slab":
    case "bow-string-girder-and-cis-deck-slab":
      requiredRecovery = 75;
      break;

    case "pre-cast-psc-girder-pre-tensioned-and-cis-deck-slab":
    case "pre-cast-psc-girder-post-tensioned-and-cis-deck-slab":
    case "cast-in-situ-box-girder-pre-stressed":
    case "pre-cast-segment-box-girder-pre-stressed":
    case "pre-cast-segment-box-girder-pre-stressed-wing-and-spine-type":
      requiredRecovery = 85;
      break;

    default:
      return "Invalid segmentCategory";
  }

  // --- 1) Recovery checks at L/2, L/4, 3L/4 ---
  const recoveryOK =
    rL2 >= requiredRecovery &&
    rL4 >= requiredRecovery &&
    r3L4 >= requiredRecovery;

  if (!recoveryOK) {
    return "Fail";
  }

  // --- 2) Deflection checks: final ≤ theoretical at all three points ---
  const deflectionOK =
    defL2Final <= defL2Theo &&
    defL4Final <= defL4Theo &&
    def3L4Final <= def3L4Theo;

  if (!deflectionOK) {
    return "Fail";
  }

  // If all conditions satisfied
  return "Pass";
}
export function checkRTFODuctility(materialCategory, mean_value) {
  const value = Number(mean_value);
  const category = String(materialCategory).toUpperCase();
  let requiredValue;

  switch (category) {
    case "VG-40":
      requiredValue = 25;
      break;
    case "VG-30":
      requiredValue = 40;
      break;
    case "VG-20":
      requiredValue = 50;
      break;
    case "VG-10":
      requiredValue = 75;
      break;
    default:
      return "Invalid materialCategory";
  }

  return value >= requiredValue ? "Pass" : "Fail";
}
export function checkDimensionTest(
  length_of_board_tolerance,
  width_of_board_tolerance,
  thickness_of_sheet_aluminum_or_acp_tolerance,
  border_size_tolerance,
  letter_height_tolerance,
  symbol_size_tolerance,
  margin_from_edges_tolerance,
  hole_positions_for_fixing_tolerance
) {
  return {
    length_of_board: Math.abs(length_of_board_tolerance) <= 2 ? "Pass" : "Fail",
    width_of_board: Math.abs(width_of_board_tolerance) <= 2 ? "Pass" : "Fail",
    thickness_of_sheet: Math.abs(thickness_of_sheet_aluminum_or_acp_tolerance) <= 0.2 ? "Pass" : "Fail",
    border_size: Math.abs(border_size_tolerance) <= 1 ? "Pass" : "Fail",
    letter_height: Math.abs(letter_height_tolerance) <= 1 ? "Pass" : "Fail",
    symbol_size: Math.abs(symbol_size_tolerance) <= 1 ? "Pass" : "Fail",
    margin_from_edges: Math.abs(margin_from_edges_tolerance) <= 1 ? "Pass" : "Fail",
    hole_positions_for_fixing: Math.abs(hole_positions_for_fixing_tolerance) <= 2 ? "Pass" : "Fail"
  };
}
export function checkSieveAnalysis(passing_percent_600_micron, passing_percent_300_micron, passing_percent_75_micron) {
  const p600 = Number(passing_percent_600_micron);
  const p300 = Number(passing_percent_300_micron);
  const p75  = Number(passing_percent_75_micron);

  // Check each requirement
  const cond600 = (p600 === 100);
  const cond300 = (p300 >= 95 && p300 <= 100);
  const cond75  = (p75  >= 85 && p75  <= 100);

  // Pass only if all conditions meet
  return (cond600 && cond300 && cond75) ? "Pass" : "Fail";
}
// --- 1) Lookup table: MoRTH 800-2..800-6 ------------------
// Keys:
// sheetType: "type-iii", "type-iv", "type-viii", "type-ix", "type-xi"
// observationAngle: "0.1", "0.2", "0.5", "1.0" as string
// entranceAngle: "-4", "+30" (or "30") etc. as string
// color: "white","yellow","orange","green","red","blue","brown",
//        "fluorescent-yellow","fluorescent-yellow-green","fluorescent-orange"

const MORTH_RETRO_TABLE = {
  // Table 800-2 : High Intensity Grade Sheeting (Type III)  :contentReference[oaicite:1]{index=1}
  "type-iii": {
    "0.1": {
      "-4": {
        white: 300,
        yellow: 200,
        orange: 120,
        green: 54,
        red: 54,
        blue: 24,
        brown: 14
      },
      "+30": {
        white: 180,
        yellow: 120,
        orange: 72,
        green: 32,
        red: 32,
        blue: 14,
        brown: 10
      }
    },
    "0.2": {
      "-4": {
        white: 250,
        yellow: 170,
        orange: 100,
        green: 45,
        red: 45,
        blue: 20,
        brown: 12
      },
      "+30": {
        white: 150, yellow: 100, orange: 60, green: 25, red: 25, blue: 11, brown: 8.5
      }
    },
    "0.5": {
      "-4": {
        white: 95, yellow: 62, orange: 30, green: 15, red: 15, blue: 7.5, brown: 5.0
      },
      "+30": {
         white: 65, yellow: 45, orange: 25, green: 10, red: 10, blue: 5.0, brown: 3.5
      }
    }
  },

  // Table 800-3 : High Intensity Micro-Prismatic (Type IV)  :contentReference[oaicite:2]{index=2}
  "type-iv": {
    "0.1": {
      "-4": {
        white: 500,
        yellow: 380,
        orange: 200,
        green: 70,
        red: 90,
        blue: 42,
        brown: 25
      },
      "+30": {
        white: 240,
        yellow: 175,
        orange: 94,
        green: 32,
        red: 42,
        blue: 20,
        brown: 12
      }
    },
    "0.2": {
      "-4": {
        white: 360,
        yellow: 270,
        orange: 145,
        green: 50,
        red: 65,
        blue: 30,
        brown: 18
      },
      "+30": {
        white: 170, yellow: 135, orange: 68, green: 25, red: 30, blue: 14, brown: 8.5
      }
    },
    "0.5": {
      "-4": {
        white: 150, yellow: 110, orange: 60, green: 21, red: 27, blue: 13, brown: 7.5
      },
      "+30": {
        white: 72, yellow: 54, orange: 28, green: 10, red: 13, blue: 6, brown: 3.5
      }
    }
  },

  // "type-viii": {
  "0.1": {
       "-4": {
       white: 1000, yellow: 750, orange: 375, green: 100, red: 150, blue: 45, brown: 30
       },
      "+30": {
        white: 460, yellow: 345, orange: 175, green: 46, red: 69, blue: 21, brown: 14
      }
   },
  "0.2": {
      "-4": {
        white: 700, yellow: 525, orange: 265, green: 70, red: 105, blue: 32, brown: 21
      },
      "+30": {
        white: 325, yellow: 245, orange: 120, green: 33, red: 49, blue: 15, brown: 10
      }
    },
 "0.5": {
      "-4": {
        white: 250, yellow: 190, orange: 94, green: 25, red: 38, blue: 11, brown: 7.5
      },
      "+30": {
        white: 115, yellow: 86, orange: 43, green: 12, red: 17, blue: 5, brown: 3.5
      }
    }
}  

export function checkRetroreflectiveSheeting(
  observation_angle,
  entrance_angle,
  color,
  sheet_type,
  coefficient_of_retroreflection
) {
  // Normalise inputs
  const obs = String(observation_angle).trim();
  let ent = String(entrance_angle).trim();
  const col = String(color).toLowerCase().replace(/\s+/g, "-");
  const sheet = String(sheet_type).toLowerCase().replace(/\s+/g, "-");
  const measured = Number(coefficient_of_retroreflection);

  // Normalise entrance angle like "-4", "+30"
  if (!ent.startsWith("-") && !ent.startsWith("+")) {
    // assume positive means +angle
    if (ent === "0") {
      ent = "0";
    } else {
      ent = "+" + ent;
    }
  }

  // Get sheet-type table
  const sheetTable = MORTH_RETRO_TABLE[sheet];
  if (!sheetTable) {
    return "Invalid sheet-type or sheet-type not configured for MoRTH table";
  }

  // Get observation-angle row
  const obsRow = sheetTable[obs];
  if (!obsRow) {
    return "Observation angle not configured for this sheet-type";
  }

  // Get entrance-angle row
  const entRow = obsRow[ent];
  if (!entRow) {
    return "Entrance angle not configured for this sheet-type / observation angle";
  }

  // Get minimum RA for colour
  const minRA = entRow[col];
  if (typeof minRA !== "number") {
    return "Colour not configured for this combination as per MoRTH table";
  }

  // Compare measured vs minimum
  return measured >= minRA ? "Pass" : "Fail";
}
export function checkSettingTime(initial_setting_time_in_minutes, final_setting_time_in_minutes) {
  // Convert minutes to hours
  const initialHours = Number(initial_setting_time_in_minutes) / 60;
  const finalHours = Number(final_setting_time_in_minutes) / 60;

  // Conditions:
  // Initial setting time: between 3 to 12 hours (inclusive)
  const initialOK = initialHours >= 3 && initialHours <= 12;

  // Final setting time: greater than 24 hours
  const finalOK = finalHours > 24;

  return (initialOK && finalOK) ? "Pass" : "Fail";
}
export function checkCementCompressiveStrength(materialCategory, testAgeInDays, avg_strength_nmm2) {
  const cat = String(materialCategory).toLowerCase();
  const age = Number(testAgeInDays);
  const value = Number(avg_strength_nmm2);

  let required = null;

  // Required values table
  const limits = {
    "opc-53": { 3: 27, 7: 37, 28: 53 },
    "opc-43": { 3: 23, 7: 33, 28: 43 },
    "ppc":    { 3: 23, 7: 33, 28: 43 }
  };

  // Validate category
  if (!limits[cat]) {
    return "Invalid materialCategory";
  }

  // Validate age
  if (!limits[cat][age]) {
    return "Invalid testAgeInDays (must be 3, 7, or 28)";
  }

  required = limits[cat][age];

  // Pass/Fail check
  return value >= required ? "Pass" : "Fail";
}
export function checkFlyashCompressiveStrength(corresponding_cement_grade, avg_strength_nmm2) {
  const grade = String(corresponding_cement_grade).toLowerCase();
  const value = Number(avg_strength_nmm2);

  let required;

  // Strength limits based on cement grade
  if (grade === "opc-53") {
    required = 42.4;
  } else if (grade === "opc-43") {
    required = 34.4;
  } else {
    return "Invalid corresponding-cement-grade";
  }

  return value >= required ? "Pass" : "Fail";
}
export function checkGroutCompressiveStrength(compressive_strength_nmm2, ageInDays, avg_strength_nmm2) {
  const values = compressive_strength_nmm2; // array of cube strengths
  const avg = Number(avg_strength_nmm2);
  const age = Number(ageInDays);

  if (!Array.isArray(values) || values.length === 0) {
    return "Invalid Input";
  }

  // --- 1) Sample Discard Check (±15% of mean) ---
  const lowerLimit = avg * 0.85;
  const upperLimit = avg * 1.15;

  for (let i = 0; i < values.length; i++) {
    const v = Number(values[i]);
    if (v < lowerLimit || v > upperLimit) {
      return "Sample Discarded";
    }
  }

  // --- 2) Pass/Fail only if Accepted ---
  let requiredStrength = null;

  if (age === 7) {
    requiredStrength = 27;
  } else if (age === 28) {
    requiredStrength = 30;
  } else {
    return "Invalid ageInDays (must be 7 or 28)";
  }

  return avg >= requiredStrength ? "Pass" : "Fail";
}
export function checkCementFinenessAndSettingTime(average_fineness_of_cement, initial_setting_time_in_minutes, final_setting_time_in_minutes) {
  const fineness = Number(average_fineness_of_cement);
  const initial = Number(initial_setting_time_in_minutes);
  const final = Number(final_setting_time_in_minutes);

  // --- Conditions ---
  const finenessOK = fineness <= 10;        // Average fineness ≤ 10%
  const initialOK = initial >= 30;          // Initial setting time ≥ 30 min
  const finalOK = final <= 600;             // Final setting time ≤ 600 min

  // --- Overall result ---
  return (finenessOK && initialOK && finalOK) ? "Pass" : "Fail";
}
export function checkDlcCubeTest(compressive_strength_nmm2) {
  // compressive_strength_nmm2: array of individual cube strengths (N/mm2)

  if (!Array.isArray(compressive_strength_nmm2) || compressive_strength_nmm2.length === 0) {
    return "Invalid input";
  }

  const values = compressive_strength_nmm2.map(Number);
  const n = values.length;

  // ---- 1) Individual cube check: each cube >= 7.5 MPa ----
  for (let i = 0; i < n; i++) {
    if (values[i] < 7.5) {
      return "Fail"; // minimum individual cube strength not satisfied
    }
  }

  // ---- 2) Group average check: groups of 5 cubes ----
  // If total cubes < 5, consider them in 1 group only.
  if (n < 5) {
    const sum = values.reduce((acc, v) => acc + v, 0);
    const avg = sum / n;
    return avg >= 10 ? "Pass" : "Fail";
  } else {
    // n >= 5 → sliding window groups of 5:
    // 1–5, 2–6, 3–7, ... as per your example
    for (let start = 0; start <= n - 5; start++) {
      let sum = 0;
      for (let j = 0; j < 5; j++) {
        sum += values[start + j];
      }
      const avg = sum / 5;
      if (avg < 10) {
        return "Fail"; // any group average < 10 MPa → Fail
      }
    }
  }

  // If all individual cubes and all groups satisfy conditions
  return "Pass";
}
export function checkConcreteCubeTest7Days(compressive_strength_nmm2, avg_strength_nmm2, fck) {
  // compressive_strength_nmm2: array of individual cube strengths (N/mm2)
  // avg_strength_nmm2: mean strength of all cubes (N/mm2)
  // fck: characteristic compressive strength (N/mm2)

  if (!Array.isArray(compressive_strength_nmm2) || compressive_strength_nmm2.length === 0) {
    return "Invalid input";
  }

  const values = compressive_strength_nmm2.map(Number);
  const avg = Number(avg_strength_nmm2);
  const fckValue = Number(fck);

  // ---- 1) Sample discard check: ±15% of mean strength ----
  const lowerLimit = avg * 0.85;
  const upperLimit = avg * 1.15;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v < lowerLimit || v > upperLimit) {
      return "Sample Discarded";
    }
  }

  // ---- 2) If sample is accepted → check 0.67 fck criterion ----
  const requiredStrength = 0.67 * fckValue;

  return avg >= requiredStrength ? "Pass" : "Fail";
}
export function checkConcreteCubeTest28Days(avg_strength_nmm2, fck, compressive_strength_nmm2, sampleCount) {
  // avg_strength_nmm2: average strength of all cubes (N/mm2)
  // fck: characteristic compressive strength (N/mm2)
  // compressive_strength_nmm2: array of individual cube strengths (N/mm2)
  // sampleCount: total number of samples (cubes) considered

  const avg = Number(avg_strength_nmm2);
  const fckValue = Number(fck);
  const count = Number(sampleCount);

  if (!Array.isArray(compressive_strength_nmm2) || compressive_strength_nmm2.length === 0) {
    return "Invalid input";
  }

  const values = compressive_strength_nmm2.map(Number);

  // ---- 1) Sample discard check: ±15% of mean strength ----
  const lowerLimit = avg * 0.85;
  const upperLimit = avg * 1.15;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (isNaN(v) || v < lowerLimit || v > upperLimit) {
      return "Sample Discarded";
    }
  }

 // ---- 2) Acceptance criteria depending on number of samples ----
  const requiredStrength = count >= 4 ? (fckValue - 3) : (fckValue - 2);

  // ---- 3) Final Pass / Fail based on average strength ----
  return avg >= requiredStrength ? "Pass" : "Fail";
}
export function checkPqcCubeTest7Days(avg_strength_nmm2, fck, compressive_strength_nmm2) {
  const avg = Number(avg_strength_nmm2);
  const fckValue = Number(fck);

  if (!Array.isArray(compressive_strength_nmm2) || compressive_strength_nmm2.length === 0) {
    return "Invalid input";
  }

  const values = compressive_strength_nmm2.map(Number);

  // ---- 1) Sample Discard Rule: ±15% of mean strength ----
  const lowerLimit = avg * 0.85;
  const upperLimit = avg * 1.15;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (isNaN(v) || v < lowerLimit || v > upperLimit) {
      return "Sample Discarded";
    }
  }

  // ---- 2) Acceptance criteria: avg ≥ 0.67 × fck ----
  const requiredStrength = 0.67 * fckValue;

  return avg >= requiredStrength ? "Pass" : "Fail";
}
export function checkPqcCubeTest28Days(avg_strength_nmm2, fck, compressive_strength_nmm2, sampleCount) {
  const avg = Number(avg_strength_nmm2);
  const fckValue = Number(fck);
  const values = compressive_strength_nmm2.map(Number);
  const count = Number(sampleCount);

  if (!Array.isArray(values) || values.length === 0 || isNaN(avg) || isNaN(fckValue) || isNaN(count)) {
    return "Invalid Input";
  }

  // ---------- 1) SAMPLE DISCARD (±15% of mean for ALL cubes) ----------
  const lowerLimit = avg * 0.85;
  const upperLimit = avg * 1.15;

  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v < lowerLimit || v > upperLimit) {
      return "Sample Discarded";
    }
  }

  // ---------- 2) INDIVIDUAL REQUIREMENT (ALL cubes) ----------
  const individualLimit = fckValue - 1;

  for (let i = 0; i < values.length; i++) {
    if (values[i] < individualLimit) {
      return "Fail";
    }
  }

  // ---------- 3) GROUP REQUIREMENT ----------
  const groupLimit = fckValue + 3;

  if (count >= 4) {
    // Groups of 4: 1–4, 2–5, 3–6, ... up to sampleCount
    for (let start = 0; start <= count - 4; start++) {
      let sum = 0;
      for (let j = 0; j < 4; j++) {
        sum += values[start + j];
      }
      const groupAvg = sum / 4;

      if (groupAvg < groupLimit) {
        return "Fail";
      }
    }
  } else {
    // sampleCount < 4 → 1 single group of size = sampleCount
    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += values[i];
    }
    const groupAvg = sum / count;

    if (groupAvg < groupLimit) {
      return "Fail";
    }
  }

  return "Pass";
}
export function checkFreeSwellIndex(testing_for, free_swell_index_percent) {
  const type = String(testing_for).toLowerCase();
  const value = Number(free_swell_index_percent);

  if (isNaN(value)) {
    return "Invalid Input";
  }

  // Limits
  const limits = {
    "embankment": { max: 50 },
    "subgrade":   { max: 0 }
  };

  if (!limits[type]) {
    return "Invalid testing-for value";
  }

  const { max } = limits[type];

  return value <= max ? "Pass" : "Fail";
}
export function checkFlashAndFirePoint(materialCategory, mean_value_oc) {
  const cat = String(materialCategory).toUpperCase();
  const value = Number(mean_value_oc);

  if (isNaN(value)) {
    return "Invalid Input";
  }

  // Specification limits
  const vgGrades = ["VG-10", "VG-20", "VG-30", "VG-40"];
  const pmbGrades = ["PMB-64-10", "PMB-70-10", "PMB-76-10", "PMB-82-10", "PMB-76-22"];

  let minFlashPoint;

  if (vgGrades.includes(cat)) {
    minFlashPoint = 220; // °C
  } else if (pmbGrades.includes(cat)) {
    minFlashPoint = 230; // °C
  } else {
    return "Invalid materialCategory";
  }

  return value >= minFlashPoint ? "Pass" : "Fail";
}
export function checkBitumenPenetration(materialCategory, average_value) {
  const cat = String(materialCategory).toUpperCase();
  const value = Number(average_value);

  if (isNaN(value)) {
    return "Invalid Input";
  }

  // Specification limits (minimum penetration)
  const limits = {
    "VG-40": 35,
    "VG-30": 45,
    "VG-20": 60,
    "VG-10": 80
  };

  if (!limits.hasOwnProperty(cat)) {
    return "Invalid materialCategory";
  }

  const requiredMin = limits[cat];

  return value >= requiredMin ? "Pass" : "Fail";
}
export function checkBitumenViscosityRatio(materialCategory, average_absolute_viscosity_a, viscosity_ratio_at_60c) {
  const cat = String(materialCategory).toUpperCase();
  const absVisc = Number(average_absolute_viscosity_a);
  const viscRatio = Number(viscosity_ratio_at_60c);

  if (isNaN(absVisc) || isNaN(viscRatio)) {
    return "Invalid Input";
  }

  // Absolute viscosity ranges (including limits)
  const absLimits = {
    "VG-40": { min: 3200, max: 4800 },
    "VG-30": { min: 2400, max: 3600 },
    "VG-20": { min: 1600, max: 2400 },
    "VG-10": { min: 800,  max: 1200 }
  };

  // Max viscosity ratio (same for all VG grades)
  const maxViscRatio = 4;

  // Validate category
  if (!absLimits[cat]) {
    return "Invalid materialCategory";
  }

  const { min, max } = absLimits[cat];

  // ---- CHECK 1: Absolute Viscosity Range ----
  if (absVisc < min || absVisc > max) {
    return "Fail";
  }

  // ---- CHECK 2: Viscosity Ratio @ 60°C ----
  if (viscRatio > maxViscRatio) {
    return "Fail";
  }

  return "Pass";
}
export function checkFraassBreakingPoint(materialCategory, fraass_breaking_point) {
  const cat = String(materialCategory).toUpperCase();
  const value = Number(fraass_breaking_point);

  if (isNaN(value)) {
    return "Invalid Input";
  }

  // Specification limits (maximum allowed °C)
  const limits = {
    "PMB-64-10": -10,
    "PMB-70-10": -10,
    "PMB-76-10": -10,
    "PMB-82-10": -10,
    "PMB-76-22": -22
  };

  if (!limits.hasOwnProperty(cat)) {
    return "Invalid materialCategory";
  }

  const maxAllowed = limits[cat];

  // Fraass Breaking Point requirement: value ≤ maxAllowed
  return value <= maxAllowed ? "Pass" : "Fail";
}
export function checkMscrTest(
  type_of_traffic,
  average_nonrecoverable_creep_compliance_at_32_kpa_a,
  percent_diff_in_nonrecoverable_creep_compliance_btw_stress_01_and_32_kpa_b
) {
  const traffic = String(type_of_traffic).toLowerCase();
  const jnr = Number(average_nonrecoverable_creep_compliance_at_32_kpa_a);
  const jnrDiff = Number(percent_diff_in_nonrecoverable_creep_compliance_btw_stress_01_and_32_kpa_b);

  if (isNaN(jnr) || isNaN(jnrDiff)) {
    return "Invalid Input";
  }

  // Max limits as per traffic category
  const limits = {
    "standard-traffic":        { maxJnr: 4.5, maxDiff: 75 },
    "heavy-traffic":           { maxJnr: 2,   maxDiff: 75 },
    "very-heavy-traffic":      { maxJnr: 1,   maxDiff: 75 },
    "extremely-heavy-traffic": { maxJnr: 0.5, maxDiff: 75 }
  };

  if (!limits[traffic]) {
    return "Invalid type-of-traffic";
  }

  const { maxJnr, maxDiff } = limits[traffic];

  // Condition checks
  if (jnr > maxJnr) return "Fail";
  if (jnrDiff > maxDiff) return "Fail";

  return "Pass";
}
export function getBitumenSofteningPoint(ball_no_1_temp, ball_no_2_temp) {
  // Helper: find last non-null, non-zero value from an array
  function getLastValidValue(arr) {
    if (!Array.isArray(arr)) return null;
    for (let i = arr.length - 1; i >= 0; i--) {
      const v = Number(arr[i]);
      if (!isNaN(v) && v !== 0 && arr[i] !== null && arr[i] !== "") {
        return v;
      }
    }
    return null;
  }

  const last1 = getLastValidValue(ball_no_1_temp);
  const last2 = getLastValidValue(ball_no_2_temp);

  // Validate final values
  if (last1 === null || last2 === null) {
    return "Invalid Input";
  }

  // Softening Point calculation
  const softeningPoint = (last1 + last2) / 2;

  return softeningPoint;
}
export function checkBitumenSofteningPoint(materialCategory, softening_point) {
  const cat = String(materialCategory).toUpperCase();
  const value = Number(softening_point);

  if (isNaN(value)) {
    return "Invalid Input";
  }

  // Minimum softening point limits
  const limits = {
    "VG-40": 50,
    "VG-30": 47,
    "VG-20": 45,
    "VG-10": 40,
    "PMB-64-10": 64,
    "PMB-70-10": 70,
    "PMB-76-10": 76,
    "PMB-82-10": 82,
    "PMB-76-22": 76
  };

  if (!limits.hasOwnProperty(cat)) {
    return "Invalid materialCategory";
  }

  const requiredMin = limits[cat];

  return value >= requiredMin ? "Pass" : "Fail";
}
export function checkFraassCrackObservation(crack_observed) {
  const crack = String(crack_observed).toLowerCase();

  return crack === "yes" ? "Accepted" : "Rejected";
}
export function calculateFraassBreakingPointAverage(crack_observed, temperature_at_first_crack) {
  if (!Array.isArray(crack_observed) || !Array.isArray(temperature_at_first_crack)) {
    return 0; // invalid input
  }

  let sum = 0;
  let count = 0;

  for (let i = 0; i < crack_observed.length; i++) {
    const observed = String(crack_observed[i]).toLowerCase();
    const temp = Number(temperature_at_first_crack[i]);

    if (observed === "yes" && !isNaN(temp)) {
      sum += temp;
      count++;
    }
  }

  if (count === 0) {
    return 0; // no valid yes-values found
  }

  return sum / count;
}
export function checkMoistureContentPriorToCompaction(avg_moisture_content_percent, optimum_moisture_content) {
  const avg = Number(avg_moisture_content_percent);
  const omc = Number(optimum_moisture_content);

  if (isNaN(avg) || isNaN(omc)) {
    return "Invalid Input";
  }

  // Allowed range: OMC to OMC - 2
  const maxAllowed = omc;
  const minAllowed = omc - 2;

  return (avg <= maxAllowed && avg >= minAllowed) ? "Pass" : "Fail";
}
/**
 * CBR Test: prepares (penetration_mm vs corrected_load_kg) plot data
 * and returns corrected unit load (Kg) at 2.5 mm AND 5.0 mm separately.
 *
 * If 2.5 or 5.0 mm is not present, it will linearly interpolate between nearest points.
 * Invalid input -> returns 0
 *
 * @param {number[]} penetration_mm
 * @param {number[]} corrected_load_kg
 * @returns {0 | {
 *   points: {x:number,y:number}[],
 *   unit_load_kg_at_2_5mm: number,
 *   unit_load_kg_at_5_0mm: number,
 *   chartJsConfig: object
 * }}
 */
export function cbrTest(penetration_mm, corrected_load_kg) {
  try {
    if (!Array.isArray(penetration_mm) || !Array.isArray(corrected_load_kg)) return 0;
    if (penetration_mm.length === 0 || penetration_mm.length !== corrected_load_kg.length) return 0;

    // Build points + validate numbers
    const points = penetration_mm.map((x, i) => {
      const xx = Number(x);
      const yy = Number(corrected_load_kg[i]);
      if (!Number.isFinite(xx) || !Number.isFinite(yy)) throw new Error("Non-numeric");
      return { x: xx, y: yy };
    });

    // Sort by penetration (safe)
    points.sort((a, b) => a.x - b.x);

    const unit2_5 = getUnitLoadFromGraph(points, 2.5);
    const unit5_0 = getUnitLoadFromGraph(points, 5.0);

    if (unit2_5 === 0 || unit5_0 === 0) return 0;

    return {
      points,
      unit_load_kg_at_2_5mm: unit2_5,
      unit_load_kg_at_5_0mm: unit5_0,
      chartJsConfig: makeChartJsConfig(points)
    };
  } catch (e) {
    return 0;
  }
}

/**
 * Get unit load at a target penetration from points (exact or linear interpolation).
 * Returns 0 if cannot be computed.
 *
 * @param {{x:number,y:number}[]} points
 * @param {number} target
 * @returns {number}
 */
function getUnitLoadFromGraph(points, target) {
  const t = Number(target);
  if (!Number.isFinite(t)) return 0;

  const EPS = 1e-9;

  // Exact match
  for (const p of points) {
    if (Math.abs(p.x - t) < EPS) return p.y;
  }

  // Linear interpolation between nearest points
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i + 1];
    if (a.x < t && t < b.x) {
      return a.y + (t - a.x) * ((b.y - a.y) / (b.x - a.x));
    }
  }

  // Target outside range
  return 0;
}

/**
 * Chart.js config helper (optional, for plotting in UI).
 * @param {{x:number,y:number}[]} points
 */
function makeChartJsConfig(points) {
  return {
    type: "line",
    data: {
      datasets: [
        {
          label: "CBR Load-Penetration Curve",
          data: points,
          parsing: false,
          tension: 0,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { type: "linear", title: { display: true, text: "Penetration (mm)" } },
        y: { title: { display: true, text: "Corrected Load (Kg)" } }
      }
    }
  };
}
/**
 * Calculate Final CBR at permissible dry density (by graph interpolation).
 *
 * Inputs:
 * - cbr_percent_reported: array of CBR (%) values
 * - dry_density_yd_gmcc:  array of corresponding dry density (gm/cc) values
 * - permissible_dry_density_of_specified_layer_gmcc: target dry density (gm/cc)
 *
 * Graph concept: X = dry_density_yd_gmcc, Y = cbr_percent_reported
 * Return: final_cbr_at_permissible_dry_density (number only)
 *
 * Rules:
 * - If target density exactly matches a point -> return its CBR
 * - Else linear interpolation between nearest densities
 * - If target is outside range or invalid input -> return 0
 */
export function finalCBRAtPermissibleDryDensity(
  cbr_percent_reported,
  dry_density_yd_gmcc,
  permissible_dry_density_of_specified_layer_gmcc
) {
  try {
    if (!Array.isArray(cbr_percent_reported) || !Array.isArray(dry_density_yd_gmcc)) return 0;
    if (cbr_percent_reported.length === 0 || cbr_percent_reported.length !== dry_density_yd_gmcc.length) return 0;

    const target = Number(permissible_dry_density_of_specified_layer_gmcc);
    if (!Number.isFinite(target)) return 0;

    // Build (x=density, y=cbr) points and validate numbers
    const points = dry_density_yd_gmcc.map((x, i) => {
      const xx = Number(x);
      const yy = Number(cbr_percent_reported[i]);
      if (!Number.isFinite(xx) || !Number.isFinite(yy)) throw new Error("Non-numeric");
      return { x: xx, y: yy };
    });

    // Sort by density
    points.sort((a, b) => a.x - b.x);

    const EPS = 1e-9;

    // Exact match
    for (const p of points) {
      if (Math.abs(p.x - target) < EPS) return p.y;
    }

    // If outside range -> 0
    if (target < points[0].x || target > points[points.length - 1].x) return 0;

    // Find interval and interpolate
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1];
      if (a.x < target && target < b.x) {
        const y = a.y + (target - a.x) * ((b.y - a.y) / (b.x - a.x));
        return y;
      }
    }

    return 0;
  } catch (e) {
    return 0;
  }
}
/**
 * Check CBR compliance against Contract / Pavement Design requirement.
 *
 * Rule:
 * - PASS if reported CBR (final_cbr_at_permissible_dry_density)
 *   is >= minimum specified CBR
 * - Else FAIL
 *
 * @param {number} final_cbr_at_permissible_dry_density
 * @param {number} min_cbr_percent_specified_in_contract_agreement_pavement_design
 * @returns {"Pass" | "Fail"}
 */
export function checkCBRCompliance(
  final_cbr_at_permissible_dry_density,
  min_cbr_percent_specified_in_contract_agreement_pavement_design
) {
  const reported = Number(final_cbr_at_permissible_dry_density);
  const specified = Number(min_cbr_percent_specified_in_contract_agreement_pavement_design);

  if (!Number.isFinite(reported) || !Number.isFinite(specified)) {
    return "Fail";
  }

  return reported >= specified ? "Pass" : "Fail";
}
/**
 * Calculate cylinder strength of concrete core test.
 *
 * Formula:
 * - n = height_core_mm / dia_core_mm
 * - f = 0.11 * n + 0.78
 * - cylinder_strength = compressive_strength_nmm2 * f
 *
 * Invalid input -> return 0
 *
 * @param {number} compressive_strength_nmm2
 * @param {number} height_core_mm
 * @param {number} dia_core_mm
 * @returns {number} cylinder_strength_nmm2
 */
export function calculateCylinderStrength_CoreTest(
  compressive_strength_nmm2,
  height_core_mm,
  dia_core_mm
) {
  try {
    const a = Number(compressive_strength_nmm2);
    const h = Number(height_core_mm);
    const d = Number(dia_core_mm);

    if (
      !Number.isFinite(a) ||
      !Number.isFinite(h) ||
      !Number.isFinite(d) ||
      d <= 0
    ) {
      return 0;
    }

    const n = h / d;               // height to diameter ratio
    const f = 0.11 * n + 0.78;     // correction factor
    const cylinder_strength = a * f;

    return cylinder_strength;
  } catch (e) {
    return 0;
  }
}
/**
 * Calculate corrected compressive strength based on core diameter.
 *
 * Rule:
 * - If diameter_core_mm < 100 mm:
 *     corrected_strength = compressive_strength_nmm2 * 1.08
 * - Else:
 *     corrected_strength = compressive_strength_nmm2
 *
 * Invalid input -> return 0
 *
 * @param {number} compressive_strength_nmm2
 * @param {number} diameter_core_mm
 * @returns {number} corrected_compressive_strength_nmm2
 */
export function getCorrectedCompressiveStrength(
  compressive_strength_nmm2,
  diameter_core_mm
) {
  try {
    const a = Number(compressive_strength_nmm2);
    const d = Number(diameter_core_mm);

    if (!Number.isFinite(a) || !Number.isFinite(d) || d <= 0) {
      return 0;
    }

    return d < 100 ? a * 1.08 : a;
  } catch (e) {
    return 0;
  }
}
/**
 * Check Pass / Fail for PQC core-test based on average core strength.
 *
 * Rule:
 * - PASS if avg_strength_nmm2 >= 0.8 * 0.85 * fck
 * - Else FAIL
 *
 * @param {number} avg_strength_nmm2 - Average equivalent cube strength of cores (N/mm²)
 * @param {number} fck - Characteristic cube strength of concrete grade (N/mm²)
 * @returns {"Pass" | "Fail"}
 */
export function checkPqcCoreTestResult(avg_strength_nmm2, fck) {
  const avg = Number(avg_strength_nmm2);
  const grade = Number(fck);

  if (!Number.isFinite(avg) || !Number.isFinite(grade)) {
    return "Fail";
  }

  const permissibleStrength = 0.8 * 0.85 * grade; // = 0.68 * fck

  return avg >= permissibleStrength ? "Pass" : "Fail";
}
/**
 * Check Pass / Fail for Concrete Core-Test.
 *
 * Conditions:
 * 1) Average equivalent cube strength of cores
 *    avg_strength_nmm2 >= 0.8 * 0.85 * fck
 *
 * 2) Individual core strength
 *    corrected_compressive_strength >= 0.8 * 0.75 * fck
 *
 * @param {number} corrected_compressive_strength - Individual corrected core strength (N/mm²)
 * @param {number} avg_strength_nmm2 - Average equivalent cube strength of cores (N/mm²)
 * @param {number} fck - Characteristic cube strength of concrete grade (N/mm²)
 * @returns {"Pass" | "Fail"}
 */
export function checkConcreteCoreTestResult(
  corrected_compressive_strength,
  avg_strength_nmm2,
  fck
) {
  const individual = Number(corrected_compressive_strength);
  const average = Number(avg_strength_nmm2);
  const grade = Number(fck);

  if (
    !Number.isFinite(individual) ||
    !Number.isFinite(average) ||
    !Number.isFinite(grade)
  ) {
    return "Fail";
  }

  const avgLimit = 0.8 * 0.85 * grade; // 0.68 * fck
  const individualLimit = 0.8 * 0.75 * grade; // 0.60 * fck

  return (average >= avgLimit && individual >= individualLimit)
    ? "Pass"
    : "Fail";
}
/**
 * Check Pass / Fail for Bitumen Kinematic Viscosity at 135°C.
 *
 * @param {number} average_viscosity - measured average viscosity
 * @param {string} materialCategory - VG-10 | VG-20 | VG-30 | VG-40
 * @returns {"Pass" | "Fail"}
 */
export function checkBitumenKinematicViscosityAt135(
  average_viscosity,
  materialCategory
) {
  const viscosity = Number(average_viscosity);
  const category = String(materialCategory || "").toUpperCase();

  if (!Number.isFinite(viscosity)) return "Fail";

  const limits = {
    "VG-40": 400,
    "VG-30": 350,
    "VG-20": 300,
    "VG-10": 250
  };

  if (!limits.hasOwnProperty(category)) return "Fail";

  return viscosity >= limits[category] ? "Pass" : "Fail";
}
/**
 * BC: Stability & Void Analysis (including theoretical max specific gravity of loose mix)
 * Return Pass/Fail as per given criteria.
 *
 * Inputs:
 * - va_percent (Air Voids %): must be 3 to 5 (inclusive)
 * - vma_100_gmbbgsb (VMA %): minimum depends on NMPS (26.5/37.5) and Va (3/4/5)
 * - nominalMaxParticleSize: 26.5 or 37.5
 * - vfb_vma_vavma_100 (VFB %): 65 to 75 (inclusive)
 * - average_stability_load_value: minimum 9.0
 * - average_flow_value: 2 to 4 (inclusive)
 * - marshal_quotient: 2 to 5 (inclusive)
 *
 * Invalid input -> "Fail"
 */
export function checkStabilityAndVoidAnalysis({
  va_percent,
  vma_100_gmbbgsb,
  nominalMaxParticleSize,
  vfb_vma_vavma_100,
  average_stability_load_value,
  average_flow_value,
  marshal_quotient
}) {
  try {
    const va = Number(va_percent);
    const vma = Number(vma_100_gmbbgsb);
    const nmps = Number(nominalMaxParticleSize);
    const vfb = Number(vfb_vma_vavma_100);
    const stability = Number(average_stability_load_value);
    const flow = Number(average_flow_value);
    const mq = Number(marshal_quotient);

    // Validate numeric inputs
    if (
      !Number.isFinite(va) ||
      !Number.isFinite(vma) ||
      !Number.isFinite(nmps) ||
      !Number.isFinite(vfb) ||
      !Number.isFinite(stability) ||
      !Number.isFinite(flow) ||
      !Number.isFinite(mq)
    ) {
      return "Fail";
    }

    // 1) Air Voids Va: 3–5
    if (va < 3 || va > 5) return "Fail";

    // 2) NMPS allowed
    if (!(nmps === 26.5 || nmps === 37.5)) return "Fail";

    // 3) Determine required minimum VMA based on NMPS and Va
    // As per your statement: Va considered at 3 / 4 / 5 only
    const vaKey = Math.round(va); // expects 3,4,5
    if (!(vaKey === 3 || vaKey === 4 || vaKey === 5)) return "Fail";

    const vmaMinTable = {
      26.5: { 3: 11.0, 4: 12.0, 5: 13.0 },
      37.5: { 3: 10.0, 4: 11.0, 5: 12.0 }
    };

    const vmaMin = vmaMinTable[nmps][vaKey];
    if (vma < vmaMin) return "Fail";

    // 4) VFB: 65–75
    if (vfb < 65 || vfb > 75) return "Fail";

    // 5) Stability: minimum 9.0
    if (stability < 9.0) return "Fail";

    // 6) Flow: 2–4
    if (flow < 2 || flow > 4) return "Fail";

    // 7) Marshal Quotient: 2–5
    if (mq < 2 || mq > 5) return "Fail";

    return "Pass";
  } catch (e) {
    return "Fail";
  }
}
/**
 * SMA: Stability & Void Analysis (including theoretical max specific gravity of loose mix)
 * Return Pass/Fail as per given criteria.
 *
 * Inputs:
 * - va_percent (Air Voids %): must be exactly 4
 * - vma_100_gmbbgsb (VMA %): minimum depends on NMPS (13/19)
 * - nominalMaxParticleSize: 13 or 19
 * - vfb_vma_vavma_100 (VFB %): 65 to 75 (inclusive)
 * - average_stability_load_value: minimum 9.0
 * - average_flow_value: 2 to 4 (inclusive)
 * - marshal_quotient: 2 to 5 (inclusive)
 *
 * Invalid input -> "Fail"
 */
export function checkSMA_StabilityAndVoidAnalysis({
  va_percent,
  vma_100_gmbbgsb,
  nominalMaxParticleSize,
  vfb_vma_vavma_100,
  average_stability_load_value,
  average_flow_value,
  marshal_quotient
}) {
  try {
    const va = Number(va_percent);
    const vma = Number(vma_100_gmbbgsb);
    const nmps = Number(nominalMaxParticleSize);
    const vfb = Number(vfb_vma_vavma_100);
    const stability = Number(average_stability_load_value);
    const flow = Number(average_flow_value);
    const mq = Number(marshal_quotient);

    // Validate numeric inputs
    if (
      !Number.isFinite(va) ||
      !Number.isFinite(vma) ||
      !Number.isFinite(nmps) ||
      !Number.isFinite(vfb) ||
      !Number.isFinite(stability) ||
      !Number.isFinite(flow) ||
      !Number.isFinite(mq)
    ) {
      return "Fail";
    }

    // 1) Air Voids Va: exactly 4
    if (va !== 4) return "Fail";

    // 2) NMPS allowed
    if (!(nmps === 13 || nmps === 19)) return "Fail";

    // 3) Minimum VMA based on NMPS (Va fixed at 4)
    const vmaMinTable = {
      13: 12.0,
      19: 11.0
    };

    const vmaMin = vmaMinTable[nmps];
    if (vma < vmaMin) return "Fail";

    // 4) VFB: 65–75
    if (vfb < 65 || vfb > 75) return "Fail";

    // 5) Stability: minimum 9.0
    if (stability < 9.0) return "Fail";

    // 6) Flow: 2–4
    if (flow < 2 || flow > 4) return "Fail";

    // 7) Marshal Quotient: 2–5
    if (mq < 2 || mq > 5) return "Fail";

    return "Pass";
  } catch (e) {
    return "Fail";
  }
}
/**
 * Calculate Plastic Limit (P.L.) for Plasticity Index test.
 *
 * Rule:
 * - Use only moisture_content_percent where testDetailsCategory === "plastic-limit"
 * - Ignore "liquid-limit" values
 * - Plastic Limit = average of selected values
 * - Round to 3 decimal places
 *
 * @param {string[]} testDetailsCategory
 * @param {number[]} moisture_content_percent
 * @returns {number} plastic_limit (3 decimals)
 */
export function calculatePlasticLimit(
  testDetailsCategory,
  moisture_content_percent
) {
  try {
    if (
      !Array.isArray(testDetailsCategory) ||
      !Array.isArray(moisture_content_percent) ||
      testDetailsCategory.length === 0 ||
      testDetailsCategory.length !== moisture_content_percent.length
    ) {
      return 0;
    }

    const values = [];

    for (let i = 0; i < testDetailsCategory.length; i++) {
      if (
        testDetailsCategory[i] === "plastic-limit" &&
        Number.isFinite(Number(moisture_content_percent[i]))
      ) {
        values.push(Number(moisture_content_percent[i]));
      }
    }

    if (values.length === 0) return 0;

    const avg =
      values.reduce((sum, v) => sum + v, 0) / values.length;

    return Number(avg.toFixed(3));
  } catch (e) {
    return 0;
  }
}
/**
 * Calculate Liquid Limit (LL) for Plasticity Index test.
 *
 * Uses ONLY testDetailsCategory === "liquid-limit" and ignores "plastic-limit".
 *
 * Two methods:
 * 1) test_performed_by = "cone-penetrometer"
 *    - accepted penetration range: 16 to 26 mm
 *    - determine water content at 20 mm penetration (from best-fit line)
 *
 * 2) test_performed_by = "casagrande-apparatus"
 *    - accepted blows range: 15 to 35
 *    - determine water content at 25 blows (from best-fit line)
 *    - round to nearest whole number
 *
 * Returns: liquid_limit value only (number). Invalid input -> 0
 *
 * @param {string} test_performed_by
 * @param {number[]} no_of_blows
 * @param {number[]} moisture_content_percent
 * @param {string[]} testDetailsCategory
 * @returns {number}
 */
export function calculateLiquidLimit(
  test_performed_by,
  no_of_blows,
  moisture_content_percent,
  testDetailsCategory
) {
  try {
    const method = String(test_performed_by || "").toLowerCase();

    if (
      !Array.isArray(no_of_blows) ||
      !Array.isArray(moisture_content_percent) ||
      !Array.isArray(testDetailsCategory)
    ) return 0;

    if (
      no_of_blows.length === 0 ||
      no_of_blows.length !== moisture_content_percent.length ||
      no_of_blows.length !== testDetailsCategory.length
    ) return 0;

    // Filter only liquid-limit points & numeric validation
    const points = [];
    for (let i = 0; i < no_of_blows.length; i++) {
      if (testDetailsCategory[i] !== "liquid-limit") continue;

      const x = Number(no_of_blows[i]);
      const y = Number(moisture_content_percent[i]);

      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

      points.push({ x, y });
    }

    if (points.length < 2) return 0; // need at least 2 points to form a line

    // Apply acceptance filters + target x
    let minX, maxX, targetX, roundFinal;

    if (method === "cone-penetrometer") {
      minX = 16; maxX = 26; targetX = 20; roundFinal = false;
    } else if (method === "casagrande-apparatus") {
      minX = 15; maxX = 35; targetX = 25; roundFinal = true;
    } else {
      return 0;
    }

    const accepted = points.filter(p => p.x >= minX && p.x <= maxX);
    if (accepted.length < 2) return 0;

    // Best-fit straight line y = m*x + c using least squares
    const { m, c } = linearRegression(accepted);
    if (!Number.isFinite(m) || !Number.isFinite(c)) return 0;

    const ll = m * targetX + c;
    if (!Number.isFinite(ll)) return 0;

    return roundFinal ? Math.round(ll) : ll;
  } catch (e) {
    return 0;
  }
}

/**
 * Least squares linear regression for y = m*x + c
 * @param {{x:number,y:number}[]} pts
 * @returns {{m:number,c:number}}
 */
function linearRegression(pts) {
  const n = pts.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  for (const p of pts) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }

  const denom = (n * sumXX - sumX * sumX);
  if (denom === 0) return { m: NaN, c: NaN };

  const m = (n * sumXY - sumX * sumY) / denom;
  const c = (sumY - m * sumX) / n;

  return { m, c };
}
/**
 * Check Pass / Fail for Plasticity Index criteria (Generic).
 *
 * Rules:
 * - Liquid Limit (LL) ≤ max_liquid_limit_percent
 * - Plasticity Index (PI) ≤ max_plasticity_index_percent
 *
 * @param {number} liquid_limit_percent
 * @param {number} plasticity_index_percent
 * @param {number} max_liquid_limit_percent
 * @param {number} max_plasticity_index_percent
 * @returns {"Pass" | "Fail"}
 */
export function checkPlasticityIndexResult(
  liquid_limit_percent,
  plasticity_index_percent,
  max_liquid_limit_percent,
  max_plasticity_index_percent
) {
  const ll = Number(liquid_limit_percent);
  const pi = Number(plasticity_index_percent);
  const maxLL = Number(max_liquid_limit_percent);
  const maxPI = Number(max_plasticity_index_percent);

  if (
    !Number.isFinite(ll) ||
    !Number.isFinite(pi) ||
    !Number.isFinite(maxLL) ||
    !Number.isFinite(maxPI)
  ) {
    return "Fail";
  }

  return (ll <= maxLL && pi <= maxPI) ? "Pass" : "Fail";
}
/**
 * Check Pass / Fail for Plasticity Index (Generic).
 *
 * Rule:
 * - Plasticity Index (PI) ≤ max_plasticity_index_percent
 *
 * @param {number} plasticity_index_percent
 * @param {number} max_plasticity_index_percent
 * @returns {"Pass" | "Fail"}
 */
export function checkPlasticityIndexResult1(
  plasticity_index_percent,
  max_plasticity_index_percent
) {
  const pi = Number(plasticity_index_percent);
  const maxPI = Number(max_plasticity_index_percent);

  if (!Number.isFinite(pi) || !Number.isFinite(maxPI)) {
    return "Fail";
  }

  return pi <= maxPI ? "Pass" : "Fail";
}
/**
 * Check Pass / Fail for Plasticity Index (PI must be exactly 0).
 *
 * Rule:
 * - Plasticity Index (PI) must be equal to 0
 *
 * @param {number} plasticity_index_percent
 * @returns {"Pass" | "Fail"}
 */
export function checkPlasticityIndexResult2(plasticity_index_percent) {
  const pi = Number(plasticity_index_percent);

  if (!Number.isFinite(pi)) {
    return "Fail";
  }

  return pi === 0 ? "Pass" : "Fail";
}
/**
 * Check Pass / Fail for Plasticity Index based on sourceProposedFor.
 *
 * Rules:
 * - wmm, ctb, ctsb → PI ≤ 6
 * - dbm, bc       → PI ≤ 4
 * - sma           → PI = 0
 *
 * If multiple sourceProposedFor values are provided,
 * the strictest criterion is applied.
 *
 * @param {string[]|string} sourceProposedFor
 * @param {number} plasticity_index_percent
 * @returns {"Pass" | "Fail"}
 */
export function checkPlasticityIndexResult3(
  sourceProposedFor,
  plasticity_index_percent
) {
  const pi = Number(plasticity_index_percent);
  if (!Number.isFinite(pi)) return "Fail";

  const sources = Array.isArray(sourceProposedFor)
    ? sourceProposedFor.map(s => String(s).toLowerCase())
    : [String(sourceProposedFor).toLowerCase()];

  if (sources.length === 0) return "Fail";

  // If SMA present → PI must be exactly 0
  if (sources.includes("sma")) {
    return pi === 0 ? "Pass" : "Fail";
  }

  // Determine strictest max PI among remaining sources
  let maxAllowedPI = Infinity;

  for (const src of sources) {
    if (["wmm", "ctb", "ctsb"].includes(src)) {
      maxAllowedPI = Math.min(maxAllowedPI, 6);
    } else if (["dbm", "bc"].includes(src)) {
      maxAllowedPI = Math.min(maxAllowedPI, 4);
    } else {
      // Unknown source → conservative fail
      return "Fail";
    }
  }

  return pi <= maxAllowedPI ? "Pass" : "Fail";
}
/**
 * DBM Mix Grading check (Grade-I / Grade-II) with passing limits + variation limits.
 *
 * Returns "Pass" only if:
 * 1) All required passing_cumulative_* values fall within the specified range (inclusive)
 * 2) All provided variation_* values are within +/- specified tolerance
 *
 * Invalid input -> "Fail"
 */
export function checkDBMMixGrading({
  materialCategory,
  variation_45mm_percent,
  variation_375mm_percent,
  variation_265mm_percent,
  variation_1900mm_percent,
  variation_132mm_percent,
  variation_475mm_percent,
  variation_236mm_percent,
  variation_03mm_percent,
  variation_0075mm_percent,
  passing_cumulative_45mm_percent,
  passing_cumulative_375mm_percent,
  passing_cumulative_265mm_percent,
  passing_cumulative_1900mm_percent,
  passing_cumulative_132mm_percent,
  passing_cumulative_475mm_percent,
  passing_cumulative_236mm_percent,
  passing_cumulative_03mm_percent,
  passing_cumulative_0075mm_percent
}) {
  try {
    const grade = String(materialCategory || "").toLowerCase();

    const toNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    // Variation tolerances (absolute value must be <= tolerance)
    const varTol = {
      variation_45mm_percent: 8,
      variation_375mm_percent: 8,
      variation_265mm_percent: 8,
      variation_1900mm_percent: 8,
      variation_132mm_percent: 7,
      variation_475mm_percent: 6,
      variation_236mm_percent: 5,
      variation_03mm_percent: 4,
      variation_0075mm_percent: 2
    };

    const variations = {
      variation_45mm_percent: toNum(variation_45mm_percent),
      variation_375mm_percent: toNum(variation_375mm_percent),
      variation_265mm_percent: toNum(variation_265mm_percent),
      variation_1900mm_percent: toNum(variation_1900mm_percent),
      variation_132mm_percent: toNum(variation_132mm_percent),
      variation_475mm_percent: toNum(variation_475mm_percent),
      variation_236mm_percent: toNum(variation_236mm_percent),
      variation_03mm_percent: toNum(variation_03mm_percent),
      variation_0075mm_percent: toNum(variation_0075mm_percent)
    };

    // Check variation limits (if any required variation is non-numeric -> Fail)
    for (const k of Object.keys(varTol)) {
      const val = variations[k];
      if (val === null) return "Fail";
      if (Math.abs(val) > varTol[k]) return "Fail";
    }

    // Passing limits by grade (inclusive)
    let spec = null;

    if (grade === "grade-i" || grade === "grade i" || grade === "grade1" || grade === "grade-1") {
      spec = {
        passing_cumulative_45mm_percent:  { min: 100, max: 100 },
        passing_cumulative_375mm_percent: { min: 95,  max: 100 },
        passing_cumulative_265mm_percent: { min: 63,  max: 93  },
        // 19mm not specified for Grade-I in your list -> ignored
        passing_cumulative_132mm_percent: { min: 55,  max: 75  },
        passing_cumulative_475mm_percent: { min: 38,  max: 54  },
        passing_cumulative_236mm_percent: { min: 28,  max: 42  },
        passing_cumulative_03mm_percent:  { min: 7,   max: 21  },
        passing_cumulative_0075mm_percent:{ min: 2,   max: 8   }
      };
    } else if (grade === "grade-ii" || grade === "grade ii" || grade === "grade2" || grade === "grade-2") {
      spec = {
        // 45mm not specified for Grade-II in your list -> ignored
        passing_cumulative_375mm_percent: { min: 100, max: 100 },
        passing_cumulative_265mm_percent: { min: 90,  max: 100 },
        passing_cumulative_1900mm_percent:{ min: 71,  max: 95  },
        passing_cumulative_132mm_percent: { min: 56,  max: 80  },
        passing_cumulative_475mm_percent: { min: 38,  max: 54  },
        passing_cumulative_236mm_percent: { min: 28,  max: 42  },
        passing_cumulative_03mm_percent:  { min: 7,   max: 21  },
        passing_cumulative_0075mm_percent:{ min: 2,   max: 8   }
      };
    } else {
      return "Fail";
    }

    const passings = {
      passing_cumulative_45mm_percent: toNum(passing_cumulative_45mm_percent),
      passing_cumulative_375mm_percent: toNum(passing_cumulative_375mm_percent),
      passing_cumulative_265mm_percent: toNum(passing_cumulative_265mm_percent),
      passing_cumulative_1900mm_percent: toNum(passing_cumulative_1900mm_percent),
      passing_cumulative_132mm_percent: toNum(passing_cumulative_132mm_percent),
      passing_cumulative_475mm_percent: toNum(passing_cumulative_475mm_percent),
      passing_cumulative_236mm_percent: toNum(passing_cumulative_236mm_percent),
      passing_cumulative_03mm_percent: toNum(passing_cumulative_03mm_percent),
      passing_cumulative_0075mm_percent: toNum(passing_cumulative_0075mm_percent)
    };

    // Check only required passing keys for the selected grade
    for (const key of Object.keys(spec)) {
      const val = passings[key];
      if (val === null) return "Fail";
      const { min, max } = spec[key];
      if (val < min || val > max) return "Fail";
    }

    return "Pass";
  } catch (e) {
    return "Fail";
  }
}
/**
 * BC Mix Grading check (Grade-I / Grade-II) with passing limits + variation limits.
 *
 * Returns "Pass" only if:
 * 1) All required passing_cumulative_* values fall within the specified range (inclusive)
 * 2) All variation_* values are within +/- specified tolerance (absolute value check)
 *
 * Invalid input -> "Fail"
 */
export function checkBCMixGrading({
  materialCategory,
  passing_cumulative_265mm_percent,
  passing_cumulative_19mm_percent,
  passing_cumulative_132mm_percent,
  passing_cumulative_95mm_percent,
  passing_cumulative_475mm_percent,
  passing_cumulative_236mm_percent,
  passing_cumulative_118mm_percent,
  passing_cumulative_06mm_percent,
  passing_cumulative_03mm_percent,
  passing_cumulative_015mm_percent,
  passing_cumulative_0075mm_percent,
  variation_265mm_percent,
  variation_19mm_percent,
  variation_132mm_percent,
  variation_95mm_percent,
  variation_475mm_percent,
  variation_236mm_percent,
  variation_118mm_percent,
  variation_06mm_percent,
  variation_03mm_percent,
  variation_015mm_percent,
  variation_0075mm_percent
}) {
  try {
    const grade = String(materialCategory || "").toLowerCase();

    const toNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    // Variation tolerances (absolute value must be <= tolerance)
    const varTol = {
      variation_265mm_percent: 7,
      variation_19mm_percent: 7,
      variation_132mm_percent: 6,
      variation_95mm_percent: 6,
      variation_475mm_percent: 5,
      variation_236mm_percent: 4,
      variation_118mm_percent: 4,
      variation_06mm_percent: 4,
      variation_03mm_percent: 3,
      variation_015mm_percent: 3,
      variation_0075mm_percent: 1.5
    };

    const variations = {
      variation_265mm_percent: toNum(variation_265mm_percent),
      variation_19mm_percent: toNum(variation_19mm_percent),
      variation_132mm_percent: toNum(variation_132mm_percent),
      variation_95mm_percent: toNum(variation_95mm_percent),
      variation_475mm_percent: toNum(variation_475mm_percent),
      variation_236mm_percent: toNum(variation_236mm_percent),
      variation_118mm_percent: toNum(variation_118mm_percent),
      variation_06mm_percent: toNum(variation_06mm_percent),
      variation_03mm_percent: toNum(variation_03mm_percent),
      variation_015mm_percent: toNum(variation_015mm_percent),
      variation_0075mm_percent: toNum(variation_0075mm_percent)
    };

    // Check variation limits
    for (const k of Object.keys(varTol)) {
      const val = variations[k];
      if (val === null) return "Fail";
      if (Math.abs(val) > varTol[k]) return "Fail";
    }

    // Passing limits by grade (inclusive)
    let spec = null;

    if (grade === "grade-i" || grade === "grade i" || grade === "grade1" || grade === "grade-1") {
      spec = {
        passing_cumulative_265mm_percent: { min: 100, max: 100 },
        passing_cumulative_19mm_percent:  { min: 90,  max: 100 },
        passing_cumulative_132mm_percent: { min: 59,  max: 79  },
        passing_cumulative_95mm_percent:  { min: 52,  max: 72  },
        passing_cumulative_475mm_percent: { min: 35,  max: 55  },
        passing_cumulative_236mm_percent: { min: 28,  max: 44  },
        passing_cumulative_118mm_percent: { min: 20,  max: 34  },
        passing_cumulative_06mm_percent:  { min: 15,  max: 27  },
        passing_cumulative_03mm_percent:  { min: 10,  max: 20  },
        passing_cumulative_015mm_percent: { min: 5,   max: 13  },
        passing_cumulative_0075mm_percent:{ min: 2,   max: 8   }
      };
    } else if (grade === "grade-ii" || grade === "grade ii" || grade === "grade2" || grade === "grade-2") {
      spec = {
        // 26.5 not specified for Grade-II -> ignored
        passing_cumulative_19mm_percent:  { min: 100, max: 100 },
        passing_cumulative_132mm_percent: { min: 90,  max: 100 },
        passing_cumulative_95mm_percent:  { min: 70,  max: 88  },
        passing_cumulative_475mm_percent: { min: 53,  max: 71  },
        passing_cumulative_236mm_percent: { min: 42,  max: 58  },
        passing_cumulative_118mm_percent: { min: 34,  max: 48  },
        passing_cumulative_06mm_percent:  { min: 26,  max: 38  },
        passing_cumulative_03mm_percent:  { min: 18,  max: 28  },
        passing_cumulative_015mm_percent: { min: 12,  max: 20  },
        passing_cumulative_0075mm_percent:{ min: 4,   max: 10  }
      };
    } else {
      return "Fail";
    }

    const passings = {
      passing_cumulative_265mm_percent: toNum(passing_cumulative_265mm_percent),
      passing_cumulative_19mm_percent: toNum(passing_cumulative_19mm_percent),
      passing_cumulative_132mm_percent: toNum(passing_cumulative_132mm_percent),
      passing_cumulative_95mm_percent: toNum(passing_cumulative_95mm_percent),
      passing_cumulative_475mm_percent: toNum(passing_cumulative_475mm_percent),
      passing_cumulative_236mm_percent: toNum(passing_cumulative_236mm_percent),
      passing_cumulative_118mm_percent: toNum(passing_cumulative_118mm_percent),
      passing_cumulative_06mm_percent: toNum(passing_cumulative_06mm_percent),
      passing_cumulative_03mm_percent: toNum(passing_cumulative_03mm_percent),
      passing_cumulative_015mm_percent: toNum(passing_cumulative_015mm_percent),
      passing_cumulative_0075mm_percent: toNum(passing_cumulative_0075mm_percent)
    };

    // Check only required passing keys for the selected grade
    for (const key of Object.keys(spec)) {
      const val = passings[key];
      if (val === null) return "Fail";
      const { min, max } = spec[key];
      if (val < min || val > max) return "Fail";
    }

    return "Pass";
  } catch (e) {
    return "Fail";
  }
}
/**
 * CTB Mix Grading check (Pass/Fail).
 *
 * Spec limits (inclusive):
 * - 53.00 mm: 100
 * - 37.5  mm: 95–100
 * - 19.0  mm: 45–100
 * - 9.5   mm: 35–100
 * - 4.75  mm: 25–100
 * - 600 micron: 8–65
 * - 300 micron: 5–40
 * - 75  micron: 0–10
 *
 * Invalid input -> "Fail"
 */
export function checkCTBMixGrading({
  passing_cumulative_5300mm_percent,
  passing_cumulative_375mm_percent,
  passing_cumulative_190mm_percent,
  passing_cumulative_95mm_percent,
  passing_cumulative_475mm_percent,
  passing_cumulative_600micron_percent,
  passing_cumulative_300micron_percent,
  passing_cumulative_75micron_percent
}) {
  try {
    const toNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const vals = {
      passing_cumulative_5300mm_percent: toNum(passing_cumulative_5300mm_percent),
      passing_cumulative_375mm_percent: toNum(passing_cumulative_375mm_percent),
      passing_cumulative_190mm_percent: toNum(passing_cumulative_190mm_percent),
      passing_cumulative_95mm_percent: toNum(passing_cumulative_95mm_percent),
      passing_cumulative_475mm_percent: toNum(passing_cumulative_475mm_percent),
      passing_cumulative_600micron_percent: toNum(passing_cumulative_600micron_percent),
      passing_cumulative_300micron_percent: toNum(passing_cumulative_300micron_percent),
      passing_cumulative_75micron_percent: toNum(passing_cumulative_75micron_percent)
    };

    // All must be numeric
    for (const k of Object.keys(vals)) {
      if (vals[k] === null) return "Fail";
    }

    const spec = {
      passing_cumulative_5300mm_percent: { min: 100, max: 100 },
      passing_cumulative_375mm_percent: { min: 95,  max: 100 },
      passing_cumulative_190mm_percent: { min: 45,  max: 100 },
      passing_cumulative_95mm_percent:  { min: 35,  max: 100 },
      passing_cumulative_475mm_percent: { min: 25,  max: 100 },
      passing_cumulative_600micron_percent: { min: 8,  max: 65 },
      passing_cumulative_300micron_percent: { min: 5,  max: 40 },
      passing_cumulative_75micron_percent:  { min: 0,  max: 10 }
    };

    for (const key of Object.keys(spec)) {
      const v = vals[key];
      const { min, max } = spec[key];
      if (v < min || v > max) return "Fail";
    }

    return "Pass";
  } catch (e) {
    return "Fail";
  }
}
/**
 * CTSB Mix Grading check (Pass/Fail).
 *
 * Spec limits (inclusive):
 * - 53.00 mm: 100
 * - 26.5  mm: 50–80
 * - 4.75  mm: 15–35
 * - 75 micron: 0–5
 *
 * Invalid input -> "Fail"
 */
export function checkCTSBMixGrading({
  passing_cumulative_5300mm_percent,
  passing_cumulative_265mm_percent,
  passing_cumulative_475mm_percent,
  passing_cumulative_75micron_percent
}) {
  try {
    const toNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const vals = {
      passing_cumulative_5300mm_percent: toNum(passing_cumulative_5300mm_percent),
      passing_cumulative_265mm_percent:  toNum(passing_cumulative_265mm_percent),
      passing_cumulative_475mm_percent:  toNum(passing_cumulative_475mm_percent),
      passing_cumulative_75micron_percent: toNum(passing_cumulative_75micron_percent)
    };

    // All inputs must be numeric
    for (const k in vals) {
      if (vals[k] === null) return "Fail";
    }

    const spec = {
      passing_cumulative_5300mm_percent: { min: 100, max: 100 },
      passing_cumulative_265mm_percent:  { min: 50,  max: 80  },
      passing_cumulative_475mm_percent:  { min: 15,  max: 35  },
      passing_cumulative_75micron_percent:{ min: 0,   max: 5   }
    };

    for (const k in spec) {
      const { min, max } = spec[k];
      if (vals[k] < min || vals[k] > max) return "Fail";
    }

    return "Pass";
  } catch (e) {
    return "Fail";
  }
}
/**
 * GSB Mix Grading check (Grade-I to Grade-VI).
 *
 * Rules:
 * - Checks passing cumulative % against grade-wise limits
 * - "<5" is treated as strictly less than 5
 * - Only sieves applicable to the selected grade are validated
 *
 * @returns {"Pass" | "Fail"}
 */
export function checkGSBMixGrading({
  materialCategory,
  passing_cumulative_750mm_percent,
  passing_cumulative_530mm_percent,
  passing_cumulative_265mm_percent,
  passing_cumulative_950mm_percent,
  passing_cumulative_475mm_percent,
  passing_cumulative_236mm_percent,
  passing_cumulative_085mm_percent,
  passing_cumulative_0425mm_percent,
  passing_cumulative_0075mm_percent
}) {
  try {
    const grade = String(materialCategory || "").toLowerCase();

    const toNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const values = {
      passing_cumulative_750mm_percent: toNum(passing_cumulative_750mm_percent),
      passing_cumulative_530mm_percent: toNum(passing_cumulative_530mm_percent),
      passing_cumulative_265mm_percent: toNum(passing_cumulative_265mm_percent),
      passing_cumulative_950mm_percent: toNum(passing_cumulative_950mm_percent),
      passing_cumulative_475mm_percent: toNum(passing_cumulative_475mm_percent),
      passing_cumulative_236mm_percent: toNum(passing_cumulative_236mm_percent),
      passing_cumulative_085mm_percent: toNum(passing_cumulative_085mm_percent),
      passing_cumulative_0425mm_percent: toNum(passing_cumulative_0425mm_percent),
      passing_cumulative_0075mm_percent: toNum(passing_cumulative_0075mm_percent)
    };

    // Grade-wise specifications
    const specs = {
      "grade-i": {
        passing_cumulative_750mm_percent: { min: 100, max: 100 },
        passing_cumulative_530mm_percent: { min: 80, max: 100 },
        passing_cumulative_265mm_percent: { min: 55, max: 90 },
        passing_cumulative_950mm_percent: { min: 35, max: 65 },
        passing_cumulative_475mm_percent: { min: 25, max: 55 },
        passing_cumulative_236mm_percent: { min: 20, max: 40 },
        passing_cumulative_0425mm_percent: { min: 10, max: 15 },
        passing_cumulative_0075mm_percent: { lt: 5 }
      },
      "grade-ii": {
        passing_cumulative_530mm_percent: { min: 100, max: 100 },
        passing_cumulative_265mm_percent: { min: 70, max: 100 },
        passing_cumulative_950mm_percent: { min: 50, max: 80 },
        passing_cumulative_475mm_percent: { min: 40, max: 65 },
        passing_cumulative_236mm_percent: { min: 30, max: 50 },
        passing_cumulative_0425mm_percent: { min: 10, max: 15 },
        passing_cumulative_0075mm_percent: { lt: 5 }
      },
      "grade-iii": {
        passing_cumulative_530mm_percent: { min: 100, max: 100 },
        passing_cumulative_265mm_percent: { min: 55, max: 75 },
        passing_cumulative_475mm_percent: { min: 10, max: 30 },
        passing_cumulative_0075mm_percent: { lt: 5 }
      },
      "grade-iv": {
        passing_cumulative_530mm_percent: { min: 100, max: 100 },
        passing_cumulative_265mm_percent: { min: 50, max: 80 },
        passing_cumulative_475mm_percent: { min: 15, max: 35 },
        passing_cumulative_0075mm_percent: { lt: 5 }
      },
      "grade-v": {
        passing_cumulative_750mm_percent: { min: 100, max: 100 },
        passing_cumulative_530mm_percent: { min: 80, max: 100 },
        passing_cumulative_265mm_percent: { min: 55, max: 90 },
        passing_cumulative_950mm_percent: { min: 35, max: 65 },
        passing_cumulative_475mm_percent: { min: 25, max: 50 },
        passing_cumulative_236mm_percent: { min: 10, max: 20 },
        passing_cumulative_085mm_percent: { min: 2, max: 10 },
        passing_cumulative_0425mm_percent: { min: 0, max: 5 }
      },
      "grade-vi": {
        passing_cumulative_530mm_percent: { min: 100, max: 100 },
        passing_cumulative_265mm_percent: { min: 75, max: 100 },
        passing_cumulative_950mm_percent: { min: 55, max: 75 },
        passing_cumulative_475mm_percent: { min: 30, max: 55 },
        passing_cumulative_236mm_percent: { min: 10, max: 25 },
        passing_cumulative_0425mm_percent: { min: 0, max: 8 },
        passing_cumulative_0075mm_percent: { min: 0, max: 3 }
      }
    };

    const spec = specs[grade];
    if (!spec) return "Fail";

    // Validate only required sieves
    for (const key of Object.keys(spec)) {
      const val = values[key];
      if (val === null) return "Fail";

      const rule = spec[key];
      if (rule.lt !== undefined) {
        if (!(val < rule.lt)) return "Fail";
      } else {
        if (val < rule.min || val > rule.max) return "Fail";
      }
    }

    return "Pass";
  } catch (e) {
    return "Fail";
  }
}
/**
 * Micro-Surfacing Mix Grading check (Type-II / Type-III) with passing limits + variation limits.
 *
 * Returns "Pass" only if:
 * 1) All required passing_cumulative_* values fall within the specified range (inclusive)
 * 2) All variation_* values are within +/- specified tolerance (absolute value check)
 *
 * Invalid input -> "Fail"
 */
export function checkMicroSurfacingMixGrading({
  materialCategory,
  passing_cumulative_95mm_percent,
  passing_cumulative_63mm_percent,
  passing_cumulative_475mm_percent,
  passing_cumulative_236mm_percent,
  passing_cumulative_118mm_percent,
  passing_cumulative_0600mm_percent,
  passing_cumulative_0300mm_percent,
  passing_cumulative_0150mm_percent,
  passing_cumulative_0075mm_percent,
  variation_475mm_percent,
  variation_236mm_percent,
  variation_118mm_percent,
  variation_0600mm_percent,
  variation_0300mm_percent,
  variation_0150mm_percent,
  variation_0075mm_percent
}) {
  try {
    const cat = String(materialCategory || "").toLowerCase().replace(/\s+/g, "");

    const toNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    // Variation tolerances (absolute value must be <= tolerance)
    const varTol = {
      variation_475mm_percent: 5,
      variation_236mm_percent: 5,
      variation_118mm_percent: 5,
      variation_0600mm_percent: 5,
      variation_0300mm_percent: 4,
      variation_0150mm_percent: 3,
      variation_0075mm_percent: 2
    };

    const variations = {
      variation_475mm_percent: toNum(variation_475mm_percent),
      variation_236mm_percent: toNum(variation_236mm_percent),
      variation_118mm_percent: toNum(variation_118mm_percent),
      variation_0600mm_percent: toNum(variation_0600mm_percent),
      variation_0300mm_percent: toNum(variation_0300mm_percent),
      variation_0150mm_percent: toNum(variation_0150mm_percent),
      variation_0075mm_percent: toNum(variation_0075mm_percent)
    };

    // Check variation limits
    for (const k of Object.keys(varTol)) {
      const val = variations[k];
      if (val === null) return "Fail";
      if (Math.abs(val) > varTol[k]) return "Fail";
    }

    // Passing values
    const passings = {
      passing_cumulative_95mm_percent: toNum(passing_cumulative_95mm_percent),
      passing_cumulative_63mm_percent: toNum(passing_cumulative_63mm_percent),
      passing_cumulative_475mm_percent: toNum(passing_cumulative_475mm_percent),
      passing_cumulative_236mm_percent: toNum(passing_cumulative_236mm_percent),
      passing_cumulative_118mm_percent: toNum(passing_cumulative_118mm_percent),
      passing_cumulative_0600mm_percent: toNum(passing_cumulative_0600mm_percent),
      passing_cumulative_0300mm_percent: toNum(passing_cumulative_0300mm_percent),
      passing_cumulative_0150mm_percent: toNum(passing_cumulative_0150mm_percent),
      passing_cumulative_0075mm_percent: toNum(passing_cumulative_0075mm_percent)
    };

    // Specs (inclusive)
    const specs = {
      "type-ii": {
        passing_cumulative_63mm_percent:   { min: 100, max: 100 },
        passing_cumulative_475mm_percent:  { min: 90,  max: 100 },
        passing_cumulative_236mm_percent:  { min: 65,  max: 90  },
        passing_cumulative_118mm_percent:  { min: 45,  max: 70  },
        passing_cumulative_0600mm_percent: { min: 30,  max: 50  },
        passing_cumulative_0300mm_percent: { min: 18,  max: 30  },
        passing_cumulative_0150mm_percent: { min: 10,  max: 21  },
        passing_cumulative_0075mm_percent: { min: 5,   max: 15  }
        // 9.5mm not specified for Type-II -> ignored
      },
      "type-iii": {
        passing_cumulative_95mm_percent:   { min: 100, max: 100 },
        passing_cumulative_63mm_percent:   { min: 90,  max: 100 },
        passing_cumulative_475mm_percent:  { min: 70,  max: 90  },
        passing_cumulative_236mm_percent:  { min: 45,  max: 70  },
        passing_cumulative_118mm_percent:  { min: 28,  max: 50  },
        passing_cumulative_0600mm_percent: { min: 19,  max: 34  },
        passing_cumulative_0300mm_percent: { min: 12,  max: 25  },
        passing_cumulative_0150mm_percent: { min: 7,   max: 18  },
        passing_cumulative_0075mm_percent: { min: 5,   max: 15  }
      }
    };

    const spec = specs[cat];
    if (!spec) return "Fail";

    // Validate required passing keys for selected type
    for (const key of Object.keys(spec)) {
      const val = passings[key];
      if (val === null) return "Fail";
      const { min, max } = spec[key];
      if (val < min || val > max) return "Fail";
    }

    return "Pass";
  } catch (e) {
    return "Fail";
  }
}
/**
 * Mix Grading check for WMM / AIL (Pass / Fail).
 *
 * Spec limits (inclusive):
 * - 53.00 mm: 100
 * - 45.00 mm: 95–100
 * - 22.40 mm: 60–80
 * - 11.20 mm: 40–60
 * - 4.75  mm: 25–40
 * - 2.36  mm: 15–30
 * - 600 micron: 8–22
 * - 75 micron: 0–5
 *
 * Invalid input -> "Fail"
 */
export function checkWMM_AIL_MixGrading({
  passing_cumulative_5300mm_percent,
  passing_cumulative_4500mm_percent,
  passing_cumulative_2240mm_percent,
  passing_cumulative_1120mm_percent,
  passing_cumulative_475mm_percent,
  passing_cumulative_236mm_percent,
  passing_cumulative_60000micron_percent,
  passing_cumulative_7500micron_percent
}) {
  try {
    const toNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const vals = {
      passing_cumulative_5300mm_percent: toNum(passing_cumulative_5300mm_percent),
      passing_cumulative_4500mm_percent: toNum(passing_cumulative_4500mm_percent),
      passing_cumulative_2240mm_percent: toNum(passing_cumulative_2240mm_percent),
      passing_cumulative_1120mm_percent: toNum(passing_cumulative_1120mm_percent),
      passing_cumulative_475mm_percent:  toNum(passing_cumulative_475mm_percent),
      passing_cumulative_236mm_percent:  toNum(passing_cumulative_236mm_percent),
      passing_cumulative_60000micron_percent: toNum(passing_cumulative_60000micron_percent),
      passing_cumulative_7500micron_percent:  toNum(passing_cumulative_7500micron_percent)
    };

    // All inputs must be numeric
    for (const k of Object.keys(vals)) {
      if (vals[k] === null) return "Fail";
    }

    const spec = {
      passing_cumulative_5300mm_percent: { min: 100, max: 100 },
      passing_cumulative_4500mm_percent: { min: 95,  max: 100 },
      passing_cumulative_2240mm_percent: { min: 60,  max: 80  },
      passing_cumulative_1120mm_percent: { min: 40,  max: 60  },
      passing_cumulative_475mm_percent:  { min: 25,  max: 40  },
      passing_cumulative_236mm_percent:  { min: 15,  max: 30  },
      passing_cumulative_60000micron_percent: { min: 8, max: 22 },
      passing_cumulative_7500micron_percent:  { min: 0, max: 5  }
    };

    for (const key of Object.keys(spec)) {
      const { min, max } = spec[key];
      if (vals[key] < min || vals[key] > max) return "Fail";
    }

    return "Pass";
  } catch (e) {
    return "Fail";
  }
}
