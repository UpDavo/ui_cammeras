"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { RiDashboardLine, RiSettingsLine } from "react-icons/ri";
import { useState, useMemo } from "react";
import { dashboardRoutes } from "@/core/routes/dashboardRoutes";
import Image from "next/image";

export default function Sidebar2({ className = "", user }) {
  const pathname = usePathname();

  const userPermissions =
    user?.role?.permissions?.map((perm) => perm.path) || [];
  const isAdmin = user?.role?.is_admin;

  const filterRoutes = (routeList) => {
    return routeList
      .map((section) => ({
        ...section,
        children: section.children
          .map((route) => {
            if (route.children) {
              const filteredChildren = route.children.filter(
                (child) =>
                  isAdmin ||
                  !child.permission ||
                  userPermissions.includes(child.permission)
              );
              return filteredChildren.length > 0
                ? { ...route, children: filteredChildren }
                : null;
            } else {
              return isAdmin ||
                !route.permission ||
                userPermissions.includes(route.permission)
                ? route
                : null;
            }
          })
          .filter(Boolean),
      }))
      .filter((section) => section.children.length > 0);
  };

  const filteredRoutes = useMemo(
    () => filterRoutes(dashboardRoutes),
    [dashboardRoutes, userPermissions, isAdmin, user]
  );

  const [openSubmenus, setOpenSubmenus] = useState(() => {
    const initialOpenSubmenus = {};
    filteredRoutes.forEach((section) => {
      section.children.forEach((route) => {
        if (route.children) {
          const isChildActive = route.children.some((child) =>
            pathname.startsWith(child.path)
          );
          if (isChildActive) {
            initialOpenSubmenus[route.name] = true;
          }
        }
      });
    });
    return initialOpenSubmenus;
  });

  const toggleSubmenu = (menu) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div
      id="sidebar"
      className={`relative hidden md:block w-96 h-screen p-4 overflow-y-auto transition-transform bg-white shadow ${className}`}
    >
      {/* Logo */}
      <div className="mt-8 flex justify-center">
        <h1 className="text-6xl uppercase font-bold text-primary">HINT</h1>
      </div>

      {/* Menú */}
      <div className="py-4 overflow-y-auto mt-4">
        <ul className="menu w-full menu-lg menu-vertical p-0 text-primary text-lg [&_li>*]:rounded-md [&_details>*]:rounded-md">
          {filteredRoutes.map((section) => (
            <div key={section.section}>
              {/* Divider con nombre de sección */}
              <div className="divider divider-primary text-md">
                {section.section}
              </div>

              {/* Items de menú */}
              {section.children.map((route) => {
                // Determinar si alguna subruta está activa
                const isSubrouteActive =
                  route.children &&
                  route.children.some((child) => pathname === child.path);
                const isActive = pathname === route.path || isSubrouteActive;
                return (
                  <li className="mt-1" key={route.name}>
                    {route.children ? (
                      <details open={openSubmenus[route.name]}>
                        <summary
                          className={isActive ? "menu-active" : ""}
                          onClick={() => toggleSubmenu(route.name)}
                        >
                          {route.icon ? <route.icon /> : <RiSettingsLine />}
                          <span className="ms-3">{route.name}</span>
                        </summary>
                        <ul>
                          {route.children.map((child) => (
                            <li className="mt-1" key={child.path}>
                              <Link
                                href={child.path}
                                className={`${
                                  pathname === child.path ? "menu-active" : ""
                                }`}
                              >
                                {child.icon ? (
                                  <child.icon />
                                ) : (
                                  <RiDashboardLine />
                                )}
                                <span className="ms-3">{child.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <Link
                        href={route.path}
                        className={` ${isActive ? "menu-active" : ""}`}
                      >
                        {route.icon ? <route.icon /> : <RiDashboardLine />}
                        <span className="ms-3">{route.name}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </div>
          ))}
        </ul>
      </div>
      {/* Botón de perfil horizontal DaisyUI 5 al final del sidebar */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center">
        <Link
          href="/dashboard/profile"
          className="btn btn-ghost flex flex-row items-center gap-4 px-4 py-10 w-auto min-w-[220px] max-w-xs bg-white/90 shadow-lg rounded-xl transition-all"
        >
          <div className="avatar avatar-online avatar-placeholder">
            <div className="w-12 rounded-full bg-neutral">
              {user?.photoUrl ? (
                <Image
                  src={user.photoUrl}
                  alt="avatar"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {user?.first_name?.charAt(0) || (
                    <span className="icon-[mdi--account]" />
                  )}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-base font-semibold text-primary line-clamp-1">
              {user?.first_name || "Usuario"}
            </span>
            <span className="text-xs text-gray-500 font-medium mt-1">
              Ver perfil
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
