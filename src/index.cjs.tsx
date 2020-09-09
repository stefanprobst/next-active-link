/**
 * workaround for microbundle's handling of mixed default and named exports
 * @see https://github.com/developit/microbundle/issues/712#issuecomment-683794530
 */

import ActiveLink, {
  isMatchingPathnameExactly,
  useActiveLink,
} from './ActiveLink'
Object.assign(ActiveLink, { isMatchingPathnameExactly, useActiveLink })
export default ActiveLink
