const isCommentedTemplate = (templateHTML: string): boolean => {
  return templateHTML.startsWith('<!--') && templateHTML.endsWith('-->');
};

/**
 * Remove the comment marks from the template content
 */
export const uncommentTemplate = (template: HTMLTemplateElement) =>  {

  const templateHtml = template.innerHTML.trim();

  return isCommentedTemplate(templateHtml)
    ? templateHtml.substring(4, templateHtml.length - 3)
    : templateHtml;
};
