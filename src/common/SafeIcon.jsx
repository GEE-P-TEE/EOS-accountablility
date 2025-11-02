import React from 'react';

/**
 * SafeIcon Component
 * 
 * A wrapper component for safely rendering icons from react-icons.
 * This ensures that icons are only rendered if they exist and provides fallbacks.
 * 
 * @param {Object} props
 * @param {React.Component} props.icon - The icon component from react-icons
 * @param {string} props.className - CSS classes to apply to the icon
 * @param {Object} props.rest - Additional props to pass to the icon component
 */
const SafeIcon = ({ icon: Icon, className = '', ...rest }) => {
  if (!Icon) {
    return <span className={`inline-block ${className}`}>⚠️</span>;
  }

  try {
    return <Icon className={className} {...rest} />;
  } catch (error) {
    console.warn('Icon rendering error:', error);
    return <span className={`inline-block ${className}`}>⚠️</span>;
  }
};

export default SafeIcon;