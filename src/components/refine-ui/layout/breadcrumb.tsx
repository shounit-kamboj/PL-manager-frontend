"use client";

import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem as ShadcnBreadcrumbItem,
  BreadcrumbList as ShadcnBreadcrumbList,
  BreadcrumbPage as ShadcnBreadcrumbPage,
  BreadcrumbSeparator as ShadcnBreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  matchResourceFromRoute,
  useBreadcrumb,
  useLink,
  useResourceParams,
} from "@refinedev/core";
import { Home } from "lucide-react";
import { Fragment, useMemo } from "react";

export function Breadcrumb() {
  const Link = useLink();
  const { breadcrumbs } = useBreadcrumb();
  const { resources, resource, action } = useResourceParams();
  const showLabel: string | undefined = action === "show" ? resource?.meta?.showLabel : undefined;
  const rootRouteResource = matchResourceFromRoute("/", resources);

  const breadCrumbItems = useMemo(() => {
    const list: {
      key: string;
      href: string;
      Component: React.ReactNode;
    }[] = [];

    list.push({
      key: "breadcrumb-item-home",
      href: rootRouteResource.matchedRoute ?? "/",
      Component: (
        <Link to={rootRouteResource.matchedRoute ?? "/"}>
          {rootRouteResource?.resource?.meta?.icon ?? (
            <Home className="h-4 w-4" />
          )}
        </Link>
      ),
    });

    breadcrumbs.forEach(({ label: refineLabel, href }, index) => {
      const isLast = index === breadcrumbs.length - 1;
      const label = isLast && showLabel ? showLabel : refineLabel;
      list.push({
        key: `breadcrumb-item-${label}`,
        href: href ?? "",
        Component: href ? <Link to={href}>{label}</Link> : <span>{label}</span>,
      });
    });

    return list;
  }, [breadcrumbs, Link, rootRouteResource, showLabel]);

  return (
    <ShadcnBreadcrumb>
      <ShadcnBreadcrumbList>
        {breadCrumbItems.map((item, index) => {
          if (index === breadCrumbItems.length - 1) {
            return (
              <ShadcnBreadcrumbPage key={item.key}>
                {item.Component}
              </ShadcnBreadcrumbPage>
            );
          }

          return (
            <Fragment key={item.key}>
              <ShadcnBreadcrumbItem key={item.key}>
                {item.Component}
              </ShadcnBreadcrumbItem>
              <ShadcnBreadcrumbSeparator />
            </Fragment>
          );
        })}
      </ShadcnBreadcrumbList>
    </ShadcnBreadcrumb>
  );
}

Breadcrumb.displayName = "Breadcrumb";
