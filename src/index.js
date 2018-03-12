const assert = require('assert');

const operations = {
  add: {
    name: 'add',
    operate: (a, b) => a + b,
  },
  substract: {
    name: 'substract',
    operate: (a, b) => a - b,
  },
  multiply: {
    name: 'multiply',
    operate: (a, b) => a * b,
  },
  devide: {
    name: 'devide',
    operate: (a, b) => a / b,
  },
  pow: {
    name: 'pow',
    operate: (a, b) => Math.pow(a, b),
  },
  empty: {
    name: 'empty',
    operate: a => a,
  },
};

class SmartCalculator {
  constructor(initialValue) {
    this.stack = [];

    this.addOperation(initialValue, operations.empty);
  }

  addOperation(value, operation) {
    this.stack.push({
      value: value,
      operation: operation,
    });
  }

  toString() {
    this.executePreviousOperations();
    this.flushStack();

    return this.stack[0].value;
  }

  flushStack() {
    while (this.stack.length !== 1) {
      const firstOperation = this.stack.shift();
      const secondOperation = this.stack.shift();
      const newValue = secondOperation.operation.operate(
        firstOperation.value,
        secondOperation.value,
      );

      this.stack.unshift({
        value: newValue,
        operation: firstOperation.operation,
      });
    }
  }

  flushOperation(name) {
    for (let i = this.stack.length - 1; i > 0; i--) {
      if (this.stack[i].operation.name === name) {
        const newValue = this.stack[i].operation.operate(
          this.stack[i - 1].value,
          this.stack[i].value
        );

        this.stack.splice(i - 1, 2, {
          value: newValue,
          operation: this.stack[i - 1].operation,
        });

        break;
      }
    }
  }

  executePreviousOperations() {
    let hasPow = this.stack.filter(item => item.operation.name === operations.pow.name);
    let hasMultiply = this.stack.filter(item => item.operation.name === operations.multiply.name);
    let hasDevide = this.stack.filter(item => item.operation.name === operations.devide.name);

    while (hasPow.length || hasMultiply.length || hasDevide.length) {
      if (hasPow.length) {
        this.flushOperation(operations.pow.name);
      } else if (hasMultiply.length) {
        this.flushOperation(operations.multiply.name);
      } else if (hasDevide.length) {
        this.flushOperation(operations.devide.name);
      } else {
        this.flushStack();
      }

      hasPow = this.stack.filter(item => item.operation.name === operations.pow.name);
      hasMultiply = this.stack.filter(item => item.operation.name === operations.multiply.name);
      hasDevide = this.stack.filter(item => item.operation.name === operations.devide.name);
    }
  }

  add(number) {
    this.executePreviousOperations();
    this.addOperation(number, operations.add);

    return this;
  }

  subtract(number) {
    this.executePreviousOperations();
    this.addOperation(number, operations.substract);

    return this;
  }

  multiply(number) {
    this.addOperation(number, operations.multiply);

    return this;
  }

  devide(number) {
    this.addOperation(number, operations.devide);

    return this;
  }

  pow(number) {
    this.addOperation(number, operations.pow);

    return this;
  }
}

module.exports = SmartCalculator;
