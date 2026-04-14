export const decorators = [
  (story, context) => {
    const themes = context.parameters?.toujouThemes || [];
    const htmlElement = context.canvasElement.ownerDocument.documentElement;

    if (themes.includes('deprecated')) {
      htmlElement.style.border = '4px dashed #e80058';
      htmlElement.style.minHeight = '100vh';
      htmlElement.style.boxSizing = 'border-box';
    } else {
      htmlElement.style.border = '';
      htmlElement.style.minHeight = '';
      htmlElement.style.boxSizing = '';
    }

    return story();
  },
];
