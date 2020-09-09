import type { BaseRouter } from 'next/dist/next-server/lib/router/router'
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { createContext, useContext } from 'react'

export type RouteMatcherParams = {
  current: BaseRouter
  href: LinkProps['href']
  as?: LinkProps['as']
}

export type RouteMatcher = (params: RouteMatcherParams) => boolean

export type ActiveLinkProps = PropsWithChildren<
  LinkProps & { isMatchingRoute?: RouteMatcher }
>

const ActiveLinkContext = createContext<boolean | null>(null)

export function useActiveLink(): boolean {
  const isActive = useContext(ActiveLinkContext)

  if (isActive === null) {
    throw new Error(
      '`useActiveLink` must be nested inside an `ActiveLinkContext.Provider`',
    )
  }

  return isActive
}

/** dummy base url */
const baseUrl = new URL('https://example.org/')

function removeTrailingSlash(str?: string | null) {
  return str && str.endsWith('/') ? str.slice(0, -1) : str
}

/** matches the pathname only, ignoring query params and hash */
export function isMatchingPathnameExactly({
  current,
  href,
  as,
}: RouteMatcherParams): boolean {
  const to = as != null ? as : href
  const link = typeof to === 'string' ? new URL(to, baseUrl) : to
  const route = new URL(current.asPath, baseUrl)
  return (
    removeTrailingSlash(route.pathname) === removeTrailingSlash(link.pathname)
  )
}

/**
 * provides a flag whether the current page matches a `Link`'s href
 *
 * by default matches pathname exactly (ignoring query params and hash)
 *
 * use `useActiveLink` in a child component to access the `active` state
 *
 * @example
 * ```ts
 * import { render } from 'react-dom'
 * import { forwardRef } from 'react'
 * import type { ComponentPropsWithoutRef, Ref } from 'react'
 * import ActiveLink, { useActiveLink } from '@stefanprobst/next-active-link'
 *
 * const ActiveAnchor = forwardRef(function ActiveAnchor(
 *   props: ComponentPropsWithoutRef<'a'>,
 *   ref: Ref<HTMLAnchorElement>,
 * ) {
 *   const isActive = useActiveLink()
 *
 *   return (
 *     <a aria-current={isActive ? 'page' : undefined} ref={ref} {...props} />
 *   )
 * })
 *
 * function Page() {
 *   return (
 *     <ActiveLink href="/docs/[slug]" as="/docs/intro" passHref>
 *       <ActiveAnchor>Click me</ActiveAnchor>
 *     </ActiveLink>,
 *     document.getElementById('root')
 *   )
 * }
 * ```
 */
export default function ActiveLink({
  isMatchingRoute,
  ...props
}: ActiveLinkProps): JSX.Element {
  const router = useRouter()

  const isMatching =
    isMatchingRoute != null ? isMatchingRoute : isMatchingPathnameExactly
  const isActive = isMatching({
    current: router,
    href: props.href,
    as: props.as,
  })

  return (
    <ActiveLinkContext.Provider value={isActive}>
      <Link {...props} />
    </ActiveLinkContext.Provider>
  )
}
