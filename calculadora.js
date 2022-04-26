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
  //Se não existe buffer
  if (!bufferLoaded) {
    lastKey === "," ? (buffer = value / 10) : (buffer = value);
    bufferLoaded = true;
    //Se existir textBuffer e não for a mensagem de erro
    if (textBuffer !== "0" && textBuffer !== "Not a number") {
      //Acrescenta o valor
      textBuffer += value;
    } else {
      //caso contrário, não existindo textBuffer, se for decimal, concatena o 0 e a ","
      lastKey === "," ? (textBuffer = "0," + value) : (textBuffer = value);
    }
  } else {
    //Não decimal
    if (lastKey !== ",") {
      //Se o textBuffer for diferente de zero e a lastkey não for "="
      if (
        parseFloat(textBuffer.toString().replace(",", ".")) &&
        lastKey !== "=" &&
        lastKey !== ","
      ) {
        //concatena o valor
        textBuffer += value;
        buffer += value;
      } else {
        //Atribui o valor
        if (textBuffer === "0,0") {
          textBuffer += value;
          buffer = "0.0" + value;
        } else {
          textBuffer = value;
          buffer = value;
        }
      }
    } else {
      //Tratamento do decimal
      textBuffer += value;
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

      if (buffer === Infinity || isNaN(buffer)) {
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
  //Se a última tecla não foi um "="
  if (lastKey !== "=") {
    //verifica se o número em buffer é inteiro
    if (!(parseFloat(buffer) - Math.floor(parseFloat(buffer)))) {
      switch (lastKey) {
        case "÷":
        case "x":
        case "+":
        case "–":
          textBuffer += "0,";
          break;
        default:
          textBuffer += ",";
          break;
      }
    }
  } else {
    //quando a última tecla foi um "="
    textBuffer = "0,";
    buffer = 0;
    bufferLoaded = false;
    runningTotal = 0;
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
