"use strict";
let runningTotal = 0; //total provisório
let buffer = 0;
let textBuffer = "0";
let bufferLoaded = false; //Cálculo interno
let currentKey;
let lastKey;
let previousOperator;

const calc = document.querySelector(".calculator");
const screen = document.querySelector(".display");

function handleButtonClick(value) {
  //Não é um número -> handleSymbol
  if (isNaN(parseInt(value))) {
    handleSymbol(value);
  } else {
    //É um número -> handleNumber
    handleNumber(value);
  }
  rerender();
}

function handleNumber(value) {
  console.log(value, buffer, textBuffer, bufferLoaded);
  //Se não existe buffer
  if (!bufferLoaded) {
    lastKey === "," ? (buffer = value / 10) : (buffer = value);
    bufferLoaded = true;
    //Se existir textBuffer
    if (parseFloat(textBuffer)) {
      //Se o valor for igual a zero
      textBuffer += value;
    } else {
      lastKey === "," ? (textBuffer = "0," + value) : (textBuffer = value);
    }
  } else {
    //Não decimal
    if (lastKey !== ",") {
      //Se o textBuffer for diferente de zero e a lastkey não for "="
      if (parseFloat(textBuffer) && lastKey !== "=" && lastKey !== ",") {
        //concatena o valor
        textBuffer += value;
        buffer += value;
      } else {
        //Atribui o valor
        textBuffer = value;
        buffer = value;
      }
    } else {
      //Tratamento do decimal
      textBuffer += "," + value;
      buffer = parseFloat((buffer + value) / 10).toFixed(1);
    }
  }
}

function handleSymbol(value) {
  switch (value) {
    case "C": //Limpa o buffer
      buffer = 0;
      textBuffer = "0";
      bufferLoaded = false;
      runningTotal = 0;
      break;
    case "=":
      if (!previousOperator) {
        return;
      }
      flushOperation(parseFloat(buffer));

      previousOperator = null;

      buffer = +runningTotal;
      console.log(buffer);
      if (buffer === Infinity) {
        textBuffer = "Not a number";
        bufferLoaded = false;
        buffer = 0;
      } else {
        //Arredonda o resultado a duas casas decimais
        //Só apresenta os zeros à direita se necessário
        buffer = +parseFloat(buffer).toFixed(2);
        textBuffer = buffer.toString().replace(".", ",");
      }
      //Em qualquer dos casos, esvazia o total temporário
      runningTotal = 0;
      break;
    case ",":
      handleDecimal();
      break;
    case "÷":
    case "x":
    case "+":
    case "–":
      handleMath(value);
      break;
  }
}

function handleDecimal() {
  //verifica se o textBuffer já contem o separador decimal na string
  if (!textBuffer.toString().includes(",")) {
    switch (lastKey) {
      case "÷":
      case "x":
      case "+":
      case "–":
        textBuffer += "0,";
        break;
      default:
        break;
    }
  }
}

function handleMath(value) {
  // Se não tem buffer, sai logo
  if (!bufferLoaded) {
    return;
  }

  const intBuffer = parseFloat(buffer);

  if (parseFloat(runningTotal) === 0) {
    runningTotal = intBuffer;
  } else {
    flushOperation(intBuffer);
  }

  previousOperator = value;
  value === "–" ? (textBuffer += "-") : (textBuffer += value);
  bufferLoaded = false;
}

function flushOperation(intBuffer) {
  if (previousOperator === "+") {
    runningTotal += intBuffer;
  } else if (previousOperator === "–") {
    runningTotal -= intBuffer;
  } else if (previousOperator === "x") {
    runningTotal *= intBuffer;
  } else if (previousOperator === "÷") {
    runningTotal /= intBuffer;
  } else {
    alert("Erro na função flushOperation, operador inválido.");
  }
}

function rerender() {
  screen.innerText = textBuffer;
}

const button = document
  .querySelector(".calculator")
  .addEventListener("click", function (event) {
    if (!event.target.classList.contains("calculator")) {
      lastKey = currentKey;
      currentKey = event.target.innerText;
      handleButtonClick(event.target.innerText);
    }
  });