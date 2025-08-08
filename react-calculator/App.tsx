
import React, { useState, useCallback } from 'react';
import CalculatorButton from './components/CalculatorButton';
import { Operator } from './types';

const App: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);

  const performCalculation = {
    [Operator.Divide]: (first: number, second: number) => first / second,
    [Operator.Multiply]: (first: number, second: number) => first * second,
    [Operator.Subtract]: (first: number, second: number) => first - second,
    [Operator.Add]: (first: number, second: number) => first + second,
  };

  const clearAll = useCallback(() => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  }, []);

  const clearEntry = useCallback(() => {
    setDisplayValue('0');
  }, []);

  const toggleSign = useCallback(() => {
    setDisplayValue(prev => (parseFloat(prev) * -1).toString());
  }, []);

  const inputPercent = useCallback(() => {
    const currentValue = parseFloat(displayValue);
    if (currentValue === 0) return;
    setDisplayValue((currentValue / 100).toString());
  }, [displayValue]);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  }, [displayValue, waitingForSecondOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  }, [displayValue, waitingForSecondOperand]);

  const handleOperator = useCallback((nextOperator: Operator) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation[operator](firstOperand, inputValue);
      const resultString = String(parseFloat(result.toPrecision(15)));
      setDisplayValue(resultString);
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  }, [displayValue, firstOperand, operator, waitingForSecondOperand, performCalculation]);

  const handleEquals = useCallback(() => {
    if (!operator || firstOperand === null) return;
    
    const secondOperand = parseFloat(displayValue);
    const result = performCalculation[operator](firstOperand, secondOperand);
    const resultString = String(parseFloat(result.toPrecision(15)));
    
    setDisplayValue(resultString);
    setFirstOperand(null); // Allow for new calculations
    setOperator(null);
    setWaitingForSecondOperand(false);
  }, [displayValue, firstOperand, operator, performCalculation]);
  
  const handleButtonClick = (label: string) => {
    if (label >= '0' && label <= '9') {
      inputDigit(label);
    } else if (Object.values(Operator).includes(label as Operator)) {
      handleOperator(label as Operator);
    } else {
      switch (label) {
        case 'AC':
          clearAll();
          break;
        case 'C':
          clearEntry();
          break;
        case '+/-':
          toggleSign();
          break;
        case '%':
          inputPercent();
          break;
        case '.':
          inputDecimal();
          break;
        case '=':
          handleEquals();
          break;
      }
    }
  };

  const getButtonClass = (label: string) => {
    if (['AC', 'C', '+/-', '%'].includes(label)) {
      return 'bg-gray-400 text-black hover:bg-gray-300';
    }
    if ([Operator.Divide, Operator.Multiply, Operator.Subtract, Operator.Add, '='].includes(label as Operator)) {
      return 'bg-orange-500 text-white hover:bg-orange-400';
    }
    if (label === '0') {
      return 'col-span-2 w-auto bg-gray-600 text-white hover:bg-gray-500';
    }
    return 'bg-gray-600 text-white hover:bg-gray-500';
  };
  
  const displayFontSize = displayValue.length > 9 ? 'text-4xl' : 'text-6xl';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-6">
        {/* Display */}
        <div className="bg-gray-900 text-white p-4 rounded-lg text-right overflow-hidden">
          <p className={`font-mono break-words ${displayFontSize} transition-all duration-200`} style={{minHeight: '4.5rem'}}>
            {displayValue}
          </p>
        </div>
        
        {/* Buttons */}
        <div className="grid grid-cols-4 gap-4">
            <CalculatorButton onClick={handleButtonClick} label="AC" className={getButtonClass('AC')} />
            <CalculatorButton onClick={handleButtonClick} label="+/-" className={getButtonClass('+/-')} />
            <CalculatorButton onClick={handleButtonClick} label="%" className={getButtonClass('%')} />
            <CalculatorButton onClick={handleButtonClick} label={Operator.Divide} className={getButtonClass(Operator.Divide)} />

            <CalculatorButton onClick={handleButtonClick} label="7" className={getButtonClass('7')} />
            <CalculatorButton onClick={handleButtonClick} label="8" className={getButtonClass('8')} />
            <CalculatorButton onClick={handleButtonClick} label="9" className={getButtonClass('9')} />
            <CalculatorButton onClick={handleButtonClick} label={Operator.Multiply} className={getButtonClass(Operator.Multiply)} />

            <CalculatorButton onClick={handleButtonClick} label="4" className={getButtonClass('4')} />
            <CalculatorButton onClick={handleButtonClick} label="5" className={getButtonClass('5')} />
            <CalculatorButton onClick={handleButtonClick} label="6" className={getButtonClass('6')} />
            <CalculatorButton onClick={handleButtonClick} label={Operator.Subtract} className={getButtonClass(Operator.Subtract)} />

            <CalculatorButton onClick={handleButtonClick} label="1" className={getButtonClass('1')} />
            <CalculatorButton onClick={handleButtonClick} label="2" className={getButtonClass('2')} />
            <CalculatorButton onClick={handleButtonClick} label="3" className={getButtonClass('3')} />
            <CalculatorButton onClick={handleButtonClick} label={Operator.Add} className={getButtonClass(Operator.Add)} />
            
            <CalculatorButton onClick={handleButtonClick} label="0" className={getButtonClass('0')} />
            <CalculatorButton onClick={handleButtonClick} label="." className={getButtonClass('.')} />
            <CalculatorButton onClick={handleButtonClick} label="=" className={getButtonClass('=')} />
        </div>
      </div>
    </div>
  );
};

export default App;
