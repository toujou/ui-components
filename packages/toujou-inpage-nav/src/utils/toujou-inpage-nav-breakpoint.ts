/**
 * Get the combined width of all navigation items
 *
 * @param navItems
 * @returns {number}
 */
function getNavItemsWidth(navItems: Object): number {
  let navWidth: number = 0;

  Object.keys(navItems).forEach((navItem: string) => {
    const itemCS: CSSStyleDeclaration = getComputedStyle(navItems[navItem].item);
    const horizontalPadding: number = parseFloat(itemCS.paddingLeft) + parseFloat(itemCS.paddingRight);
    navWidth += navItems[navItem].item.offsetWidth + horizontalPadding;
  });

  return navWidth;
}

/**
 * Get width of an element
 *
 * @param element
 * @returns {number}
 */
function getElementWidth(element: HTMLElement): number {
  if (!element) {
    return 0;
  }

  if (element.classList.contains('inpage-nav__label')) {
    const itemCS: CSSStyleDeclaration = getComputedStyle(element);
    const horizontalPadding: number = parseFloat(itemCS.paddingLeft) + parseFloat(itemCS.paddingRight);
    return element.offsetWidth + horizontalPadding;
  }

  return element.offsetWidth;
}

/**
 *
 * @returns {number}
 * @private
 */


/**
 * Get inpage nav breakpoint
 * If the nav is centered we have to account for the cta button ("on each side" + a little buffer)
 *
 * @param navItems {Object}
 * @param navLabel {HTMLElement}
 * @param ctaElement {HTMLElement}
 * @param isCentered {boolean}
 * @returns number
 */
export default function getNavBreakpoint(
  navItems: Object,
  navLabel: HTMLElement,
  ctaElement: HTMLElement,
  isCentered: boolean
): number {
  const navItemsWidth: number = getNavItemsWidth(navItems);
  const navLabelWidth: number = getElementWidth(navLabel);
  const ctaElementWidth: number = getElementWidth(ctaElement);

  return navItemsWidth + navLabelWidth + ctaElementWidth * (isCentered ? 3 : 1);
}
