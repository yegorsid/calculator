import { Box, Button, Grid, GridItem, Input } from "@chakra-ui/react"
import { useCallback, useEffect, useRef, useState } from "react"

const COLUMN_HEIGHT = "480px"

const columns = [
  { 
    buttons: ['sin', 'cos', 'tan', 'π', '!'], 
    color: 'gray',
    fontSize: '24px'
  },
  { 
    buttons: ['ln', 'log', 'e', '^', '√'], 
    color: 'gray',
    fontSize: '24px'
  },
  { buttons: ['7', '4', '1', '0'], fontSize: '32px' },
  { buttons: ['8', '5', '2', '.'], fontSize: '32px' },
  { buttons: ['9', '6', '3', 'DEL'], fontSize: '32px' },
  { 
    buttons: ['÷', '×', '-', '+'], 
    color: 'gray',
    fontSize: '24px'
  },
  { 
    buttons: ['(', ')', '='], 
    color: 'gray',
    fontSize: '24px'
  },
];

const bracketFunctions = ["sin", "cos", "tan", "ln", "log", "√"];

const keyMap: { [key: string]: string } = {
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
  '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  '.': '.', '+': '+', '-': '-', '*': '×', '/': '÷',
  '^': '^', '!': '!', '(': '(', ')': ')', 
  'Enter': '=', 'Backspace': 'DEL', 'Delete': 'DEL'
};

const specialMap: { [key: string]: string } = {
  'p': 'π', 'e': 'e', 's': 'sin', 'c': 'cos', 
  't': 'tan', 'l': 'ln', 'g': 'log', 'q': '√'
};

function Calculator() {
  const [operation, setOperation] = useState('')
  const [result, setResult] = useState('')
  const operationRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLInputElement>(null)
  const openBracketsCount = useRef(0);
  const lastFunction = useRef("");

  const handleFocus = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.blur()
  }

  const handleButton = useCallback((value: string) => {
    setOperation(prev => {
      let newValue = prev;

      if (value === 'DEL') {
        if (result) {
          setOperation('');
          setResult('');
        } else {
          if (prev === 'Error' || prev === 'Negative factorial') return '' 
          return prev.slice(0, -1)
        }
      }

      if (bracketFunctions.includes(value)) {
        newValue += `${value}(`;
        openBracketsCount.current += 1;
        lastFunction.current = value;
      }
      else newValue += value;
     
      return newValue
    })
  }, [result])

  const factorial = useCallback((n: number): number => {
    if (n < 0) throw new Error('Negative factorial')
    return n <= 1 ? 1 : n * factorial(n - 1)
  }, [])

  const calculateResult = useCallback(() => {
    try {
      let expression = operation;
     
      const open = (expression.match(/\(/g) || []).length;
      const close = (expression.match(/\)/g) || []).length;
      const missingBrackets = open - close;

      if (missingBrackets > 0) {
        expression += ')'.repeat(missingBrackets);
        setOperation(expression);
      }

      expression = expression
      .replace(/π/g, Math.PI.toString())
      .replace(/√(\d+|\(.+?\))/g, 'Math.sqrt($1)')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/(sin|cos|tan)\(/g, 'Math.$1(')
      .replace(/e/g, 'Math.E')
      .replace(/\^/g, '**')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/(\d+)!/g, (_, n) => factorial(Number(n)).toString());

      const calcResult = eval(expression);
      setResult(String(calcResult));
      openBracketsCount.current = 0;
    } catch {
      setResult('Error');
    }
  }, [operation, factorial])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {  
      const key = e.key;
      
      if (key in keyMap) {
        e.preventDefault();
        handleButton(keyMap[key]);
      } 
      else if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (key in specialMap) {
          handleButton(specialMap[key]);
        }
        return;
      }
      
      if (key === 'Enter') {
        e.preventDefault();
        calculateResult();
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleButton, calculateResult]);

  return (
    <Box width="1000px" margin="24px auto">
      <Input
        value={operation}
        mb={2}
        height="60px"
        fontSize="30px"
        borderRadius="md"
        readOnly
        textAlign="right"
        border="none"
        _focus={{ boxShadow: 'none' }}
        color={'gray'}
        placeholder="Count something"
        tabIndex={-1}
        ref={operationRef}
        onFocus={() => handleFocus(operationRef)}
      />
      <Input
        value={result}
        mb="32px"
        height="60px"
        fontSize="54px"
        borderRadius="md"
        readOnly
        textAlign="right"
        border="none"
        _focus={{ boxShadow: 'none' }}
        tabIndex={-1}
        ref={resultRef}
        onFocus={() => handleFocus(resultRef)}
      />
      <Grid templateColumns="repeat(7, 1fr)" gap={2} height={COLUMN_HEIGHT}>
        {columns.map((col, colIndex) => (
          <GridItem key={colIndex} height="100%">
            <Grid
              templateRows={colIndex === 6 ? '2fr 2fr 3fr' : `repeat(${col.buttons.length}, 1fr)`}
              gap={2}
              height="100%"
            >
              {col.buttons.map((btn) => (
                <GridItem key={btn} rowSpan={btn === '=' ? 2 : 1}>
                  <Button
                    w="full"
                    h="full"
                    color={btn === '=' ? 'white' : col.color}
                    fontSize={btn === '=' ? '32px' : col.fontSize}
                    fontWeight={600}
                    variant={btn === '=' ? 'solid' : 'ghost'}
                    bg={btn === '=' ? '#ff513c' : 'transparent'}
                    _hover={{ bg: btn === '=' ? '#ff3924' : 'gray.100' }}
                    onClick={btn === '=' ? calculateResult : () => handleButton(btn)}
                  >
                    {btn}
                  </Button>
                </GridItem>
              ))}
            </Grid>
          </GridItem>
        ))}
      </Grid>
    </Box>
  )
}

export default Calculator