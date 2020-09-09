# next-active-link

Replacement for Next.js's `Link` to inform child components whether the current
route matches the link's `href`. Children can access this info with the
`useActiveLink` hook.

By default, `ActiveLink` matches pathnames exactly, ignoring query params and
hash. However, a custom matcher function can be provided.

## `ActiveLink`

In addition to Next.js's `LinkProps`, `ActiveLink` accepts an optional matcher
function as the `isMatchingRoute` prop, which receives the `ActiveLink`'s `href`
and `as` props, as well as the `current` route as arguments.

Note that `ActiveLink` inherits
[Next.js's `Link` behavior of accepting either a string, or an URL object for `href` and `as` props](https://nextjs.org/docs/api-reference/next/link#with-url-object).

The following props are suitable for comparison:

| current route                                              | LinkProps (as UrlObject, not string) |
| ---------------------------------------------------------- | ------------------------------------ |
| `current.pathname`                                         | `href.pathname`                      |
| `new URL(current.asPath, 'https://example.org/').pathname` | `(as ?? href).pathname`              |
| `current.query`                                            | `href.query`                         |
| `new URL(current.asPath, 'https://example.org/').hash`     | `href.hash`                          |

Example:

```ts
import ActiveLink from '@stefanprobst/next-active-link'
import type { RouteMatcher } from '@stefanprobst/next-active-link'

/** dummy base url, since the URL constructor only handles absolute URLs */
const baseUrl = new URL('https://example.org/')

const isMatchingPathnameExactly: RouteMatcher = ({ current, as, href }) => {
  const to = as ?? href
  const link = typeof to === 'string' ? new URL(to, baseUrl) : to
  const route = new URL(current.asPath, baseUrl)
  return route.pathname === link.pathname
}

return (
  <ActiveLink href="/" isMatchingRoute={isMatchingPathnameExactly} passHref>
    <ActiveAnchor>Click me</ActiveAnchor>
  </ActiveLink>
)
```

## `useActiveLink`

Must be nested inside an `ActiveLink`.

```ts
const isActive = useActiveLink()
```

## Example

```ts
import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, Ref } from 'react'
import ActiveLink, { useActiveLink } from '@stefanprobst/next-active-link'

const ActiveAnchor = forwardRef(function ActiveAnchor(
  props: ComponentPropsWithoutRef<'a'>,
  ref: Ref<HTMLAnchorElement>,
) {
  const isActive = useActiveLink()
  return <a aria-current={isActive ? 'page' : undefined} ref={ref} {...props} />
})

function Page() {
  return (
    <ActiveLink href="/docs/[slug]" as="/docs/intro" passHref>
      <ActiveAnchor>Click me</ActiveAnchor>
    </ActiveLink>
  )
}
```
