/** Filters and joins a list of classnames */
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
