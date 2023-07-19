// let v = "-10"; // You can assign any value to `v` here

// if (!isNaN(v)) {
//     // `v` is a number
//     console.log("v is a number.");
//   } else {
//     // `v` is not a number
//     console.log("v is not a number.");
//   }


let v = "-10-10"

// Remove any non-numeric, '+', '-', or '.' characters from 'v'
v = v.replace(/[^0-9+-.]/g, '');

// Check if 'v' is not empty
let currentValue = 0;

if (v.trim() !== '') {

  
  // Check if 'v' contains a '+' or '-' symbol
  if (v.includes('+') || v.includes('-')) {
    // Find the last occurrence of '+' or '-'
    const lastOperatorIndex = Math.max(v.lastIndexOf('+'), v.lastIndexOf('-'));
    
    // Extract the numbers before and after the operator
    const a = parseFloat(v.slice(0, lastOperatorIndex));
    const b = parseFloat(v.slice(lastOperatorIndex + 1));
    
    // Perform the corresponding operation
    if (v.charAt(lastOperatorIndex) === '+') {
      currentValue = a + b;
    } else {
      currentValue = a - b;
    }
  } else {
    // If 'v' doesn't contain '+' or '-', directly parse it as a number
    currentValue = parseFloat(v);
  }


  // currentValue = result;
}

console.log(currentValue); 
