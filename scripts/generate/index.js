import {outdent} from 'outdent';
import chalk from 'chalk';
import * as readline from 'readline';
import {createFiles, prepareName} from './functions.js';

process.stdin.setEncoding('utf8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

let currentStep = 0;
const FREE_TEXT_KEY = 'TEXT';
let STORE = {};

console.log(
    chalk.cyan(outdent`
    
    Enter package name (minus the toujou- prefix),
  
    and submit with Enter:

  `)
);

const STEPS = {

  0: {
    [FREE_TEXT_KEY]: prepareName(({ className, fileName }) => {
      currentStep++; // eslint-disable-line no-plusplus

      // eslint-disable-next-line no-console
      console.log(
          chalk.yellow(outdent`

        I am creating the new component *now*.
        Press ${chalk.bold('y')} for yes, or ${chalk.bold('n')} to exit,
        followed by Enter:

      `)
      );

      STORE.className = className;
      STORE.fileName = fileName;
    }),
    n: () => {
      process.exit();
    },
  },
  1: {
    y: createFiles(STORE, folder => {
      currentStep++; // eslint-disable-line no-plusplus

      // eslint-disable-next-line no-console
      console.log(
          chalk.yellow(outdent`

        I am done! Happy coding 🍻🍻!
        Your new component lives here: ${folder}.

      `)
      );

      process.exit();
    }),
    n: () => {
      process.exit();
    },
  },
};


rl.on('line', line => {
  const userInput = line.trim();

  if (STEPS[currentStep] && STEPS[currentStep][userInput]) {
    STEPS[currentStep][userInput]();
  } else if (STEPS[currentStep] && STEPS[currentStep][FREE_TEXT_KEY]) {
    STEPS[currentStep][FREE_TEXT_KEY](userInput);
  } else {
    // eslint-disable-next-line no-console
    console.log(
      chalk.red(outdent`

      I don't understand this command, please try again!

    `)
    );
  }
});

rl.on('close', () => {
  rl.write('end');
});
