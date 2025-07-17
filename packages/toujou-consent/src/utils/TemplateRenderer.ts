export class TemplateRenderer {
  public readonly templateElement: HTMLTemplateElement;

  constructor(templateElement: HTMLTemplateElement) {
    this.templateElement = templateElement;
  }

  public renderInto(range: Range): void {
    range.insertNode(this.getContent(range));
  }

  private getContent(range: Range): DocumentFragment
  {
    if (!this.isCommentedTemplate(this.templateElement)) {
      return document.importNode(this.templateElement.content, true);
    }
    const uncommentedTemplateContent = this.uncommentTemplate(this.templateElement);
    return range.createContextualFragment(uncommentedTemplateContent);
  }

  private isCommentedTemplate(template: HTMLTemplateElement) {
    const templateString = template.innerHTML.trim();
    return templateString.startsWith('<!--') && templateString.endsWith('-->');
  }

  private uncommentTemplate(template: HTMLTemplateElement) {
    const templateString = template.innerHTML.trim();
    return templateString.substring(4, templateString.length - 3).trim();
  }
}
