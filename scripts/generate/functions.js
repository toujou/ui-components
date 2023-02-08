
import {outdent} from 'outdent';
import chalk from 'chalk';
const { cwd } = process;
import fs from 'fs-extra'
import replaceInFile from 'replace-in-file';

const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const prepareName = done => userInput => {
  const camelCase = string =>
    string
      .split(/[-_ ]+/)
      .map(capitalizeFirstLetter)
      .join('');
  const fileName = `toujou-${userInput.replace(/ /g, '-').toLowerCase()}`;
  const className = camelCase(fileName);

  // eslint-disable-next-line no-console
  console.log(
    chalk.cyan(outdent`

    Ok good, now we will set up all the files for your new component.

    Class name: ${chalk.bold(className)}
    Folder name: ${chalk.bold(fileName)}

  `)
  );

  done({
    className,
    fileName,
  });
};

export const createFiles = (store, done) => () => {
  const { type, fileName, className } = store;


  const BASE_FOLDER = `./packages/${fileName}`;
  const upperCaseWithSpace = string =>
    string
      .split(/[-_ ]+/)
      .map(capitalizeFirstLetter)
      .join(' ');
  const compTitle = upperCaseWithSpace(fileName.replace(/-/g, ' '));
  fs.copySync('./scripts/generate/skeleton', `${BASE_FOLDER}`, {recursive: true});

  try {
    const results = replaceInFile.sync({
      files: `${BASE_FOLDER}/**`,
      from: [/\{\{package_name\}\}/g, /\{\{component_title\}\}/g, /ComponentName/g],
      to: [fileName, compTitle, className],
    });
    console.log('Replacement results:', results);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }

  done(BASE_FOLDER);
};
