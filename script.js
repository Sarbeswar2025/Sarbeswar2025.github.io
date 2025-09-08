
document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.calculator-display');
    const buttons = document.querySelector('.calculator-buttons');

    let currentInput = '0';
    let operator = null;
    let previousInput = '';
    let resetDisplay = false;

    const updateDisplay = (value) => {
        display.value = value;
    };

    const calculate = (n1, operator, n2) => {
        let result = 0;
        n1 = parseFloat(n1);
        n2 = parseFloat(n2);

        if (operator === 'add') {
            result = n1 + n2;
        } else if (operator === 'subtract') {
            result = n1 - n2;
        } else if (operator === 'multiply') {
            result = n1 * n2;
        } else if (operator === 'divide') {
            if (n2 === 0) return 'Error'; // Handle division by zero
            result = n1 / n2;
        } else if (operator === 'percentage') {
            result = n1 * (n2 / 100);
        }
        return result.toString();
    };

    buttons.addEventListener('click', (e) => {
        const target = e.target;
        if (!target.matches('button')) return;

        const buttonText = target.textContent;
        const action = target.dataset.action;

        // Handle number buttons
        if (!action) {
            if (currentInput === '0' || resetDisplay) {
                currentInput = buttonText;
                resetDisplay = false;
            } else {
                currentInput += buttonText;
            }
            updateDisplay(currentInput);
        }

        // Handle operator buttons
        if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide' || action === 'percentage') {
            if (previousInput && operator && !resetDisplay) {
                currentInput = calculate(previousInput, operator, currentInput);
                updateDisplay(currentInput);
                previousInput = currentInput; // Chain operations
            } else {
                previousInput = currentInput;
            }
            operator = action;
            resetDisplay = true;
        }

        // Handle decimal button
        if (action === 'decimal') {
            if (resetDisplay) {
                currentInput = '0.';
                resetDisplay = false;
            } else if (!currentInput.includes('.')) {
                currentInput += '.';
            }
            updateDisplay(currentInput);
        }

        // Handle clear (AC) button
        if (action === 'clear') {
            currentInput = '0';
            previousInput = '';
            operator = null;
            resetDisplay = false;
            updateDisplay(currentInput);
        }

        // Handle backspace (DEL) button
        if (action === 'backspace') {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay(currentInput);
        }

        // Handle equals button
        if (action === 'calculate') {
            if (previousInput && operator) {
                currentInput = calculate(previousInput, operator, currentInput);
                updateDisplay(currentInput);
                previousInput = ''; // Clear previous input after calculation
                operator = null;
                resetDisplay = true; // Prepare for new calculation
            }
        }
    });
});
