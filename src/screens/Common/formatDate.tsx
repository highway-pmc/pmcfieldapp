import { Text } from "react-native";

/**
 * Formats a date to "DD MMM YY, HH:MM AM/PM" format
 * Example: "12 Sept 25, 02:30PM"
 * 
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date | number): string => {
  if (!date) return '';

  const dateObj = new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];

  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear().toString().slice(-2); // Get last 2 digits
  
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  
  // Convert to 12-hour format
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  // Format minutes and hours with leading zeros if needed
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedHours = hours.toString().padStart(2, '0');
  
  return `${day} ${month} ${year}, ${formattedHours}:${formattedMinutes}${ampm}`;
};

/**
 * Formats a date to just date part "DD MMM YY"
 * Example: "12 Sept 25"
 */
export const formatDateOnly = (date: string | Date | number): string => {
  if (!date) return '';

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];

  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear().toString().slice(-2);
  
  return `${day} ${month} ${year}`;
};

/**
 * Formats a date to just time part "HH:MM AM/PM"
 * Example: "02:30PM"
 */
export const formatTimeOnly = (date: string | Date | number): string => {
  if (!date) return '';

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Time';
  }

  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedHours = hours.toString().padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes}${ampm}`;
};

/**
 * Example usage:
 */
const ExampleUsage = () => {
  // Various date inputs
  const examples = [
    new Date(), // Current date
    '2025-09-12T14:30:00Z', // ISO string
    '2025-12-25T09:15:30', // ISO string without Z
    1699887600000, // Timestamp
    new Date(2025, 8, 12, 14, 30), // Date object (month is 0-indexed)
  ];

  examples.forEach((date, index) => {
    console.log(`Example ${index + 1}:`);
    console.log(`Full format: ${formatDate(date)}`);
    console.log(`Date only: ${formatDateOnly(date)}`);
    console.log(`Time only: ${formatTimeOnly(date)}`);
    console.log('---');
  });

  return null;
};

// Usage in React component
export const DateDisplay = ({date}: {date: string | Date | number}) => {
  return (
    <Text style={{fontSize: 14, color: '#666'}}>
      {formatDate(date)}
    </Text>
  );
};

// Usage examples:
/*
formatDate('2025-09-12T14:30:00Z') // "12 Sept 25, 02:30PM"
formatDate(new Date()) // Current date in format "12 Sept 25, 02:30PM"
formatDate(1699887600000) // Timestamp to "12 Sept 25, 02:30PM"
formatDateOnly('2025-09-12T14:30:00Z') // "12 Sept 25"
formatTimeOnly('2025-09-12T14:30:00Z') // "02:30PM"
*/