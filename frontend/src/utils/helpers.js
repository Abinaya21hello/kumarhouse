// src/utils/helpers.js

// Example utility function to format a date
export const formatDate = (date) => {
    // Implementation to format date as needed
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Example utility function to truncate text
  export const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };
  
  // Example utility function to generate a random ID
  export const generateId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };
  
  // Other utility functions can be added as needed
  