/**
 * Formats achievement values for display
 * @param {number|string} value - The value to format
 * @returns {string} - The formatted value
 */
export const formatAchievementValue = (value) => {
  if (typeof value === 'number') {
    // For percentage values
    if (value <= 1 && value >= 0) {
      return `${(value * 100).toFixed(0)}%`;
    }
    // For whole numbers
    return value.toLocaleString();
  }
  // Return as is if it's already a string
  return value;
};
