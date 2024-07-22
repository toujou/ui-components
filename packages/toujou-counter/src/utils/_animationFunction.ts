/**
 * Bezier based ease out function.
 * Docs here: https://greweb.me/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation
 *
 * @param t
 */
export const easeOutQuad = (t: number) => {
  return t * (2 - t);
};
