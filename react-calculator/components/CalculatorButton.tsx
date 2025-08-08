
import React from 'react';

interface CalculatorButtonProps {
  onClick: (label: string) => void;
  label: string;
  className?: string;
  testId?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ onClick, label, className = '', testId }) => {
  return (
    <button
      onClick={() => onClick(label)}
      className={`h-20 w-20 rounded-full text-3xl font-semibold flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 ${className}`}
      data-testid={testId}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;
