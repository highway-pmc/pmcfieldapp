import {Platform, UIManager} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// --- CORE TYPES ---

export type ValidationRules = {
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'url' | 'boolean';
  min?: number;
  max?: number;
  decimalPlaces?: number;
  maxLength?: number;
  pattern?: string;
  options?: Array<{key: string; label: string}>;
  errorMessage?: string;
};

// InputItem: Fields that require user input
export type InputItem = {
  id: string; // Unique ID for state management
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'radio';
  value: any;
  placeholder: string;
  validations: ValidationRules;
};

// DataItem: Fields for displaying read-only data
export type DataItem = {
  label: string;
  value: string;
};

// Mixed type allows content to be either data or input
export type MixedItem = DataItem | InputItem;

type BaseSection = {
  title?: string;
  sectionInfo?: string;
  notes?: string;
};

// Recursive Section Type Definition
export type Section = BaseSection &
  (
    | {
        type: 'info' | 'expandable';
        items?: MixedItem[]; // Single array for data and inputs
      }
    | {
        type: 'subSection';
        mainTitle: string;
        mainInfo?: DataItem[];
        sections: Section[];
      }
  );

export type FormDataSchema = {
  mainTitle: string;
  mainInfo?: DataItem[];
  sections: Section[];
};


export interface DynamicTestFormProps {
  formData: any;
}

export interface SectionContentProps {
  section: Section;
  inputData: Record<string, any>;
  onValueChange: (input: InputItem, value: any) => void;
  inputErrors: Record<string, string>;
}

export interface InputComponentProps {
  input: InputItem;
  value: any;
  onChange: (input: InputItem, value: any) => void;
  error: string;
}
