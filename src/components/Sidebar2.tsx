"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { RiDashboardLine, RiSettingsLine } from "react-icons/ri";
import { useState, useMemo } from "react";
import { dashboardRoutes } from "@/routes/dashboardRoutes";
import Image from "next/image";

interface SidebarProps {
  className?: string;
  user: any; // Ajusta según tu modelo de usuario
}

export default function Sidebar2({ className = "", user }: SidebarProps) {
  const pathname = usePathname();

  // -----------------------
  // 1. Extrae permisos e info de admin
  // -----------------------
  const userPermissions =
    user?.role?.permissions?.map((perm: any) => perm.path) || [];
  const isAdmin = user?.role?.is_admin;

  // -----------------------
  // 2. Filtrar rutas según permisos
  // -----------------------
  const filterRoutes = (routeList: any[]) => {
    return routeList
      .map((section) => ({
        ...section,
        children: section.children
          .map((route: any) => {
            if (route.children) {
              const filteredChildren = route.children.filter(
                (child: any) =>
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

  // -----------------------
  // 3. Memorizar rutas filtradas
  // -----------------------
  const filteredRoutes = useMemo(
    () => filterRoutes(dashboardRoutes),
    [dashboardRoutes, userPermissions, isAdmin, user]
  );

  // -----------------------
  // 4. Estado inicial: abre el submenú activo (una sola vez)
  // -----------------------
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    () => {
      const initialOpenSubmenus: { [key: string]: boolean } = {};

      filteredRoutes.forEach((section) => {
        section.children.forEach((route: any) => {
          if (route.children) {
            const isChildActive = route.children.some((child: any) =>
              pathname.startsWith(child.path)
            );
            if (isChildActive) {
              initialOpenSubmenus[route.name] = true;
            }
          }
        });
      });

      return initialOpenSubmenus;
    }
  );

  // -----------------------
  // 5. Toggle manual de submenús
  // -----------------------
  const toggleSubmenu = (menu: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div
      id="sidebar"
      className={`relative hidden md:block w-96 h-screen p-4 overflow-y-auto transition-transform bg-primary text-white shadow ${className}`}
    >
      {/* Logo */}
      <div className="mt-8 flex justify-center">
        <h1 className="text-6xl uppercase font-bold">HINT</h1>
      </div>

      {/* Menú */}
      <div className="py-4 overflow-y-auto mt-4">
        <ul className="menu w-full menu-lg menu-vertical p-0 text-white text-lg [&_li>*]:rounded-md [&_details>*]:rounded-md">
          {filteredRoutes.map((section) => (
            <div key={section.section}>
              {/* Divider con nombre de sección */}
              <div className="divider divider-accent text-md">
                {section.section}
              </div>

              {/* Items de menú */}
              {section.children.map((route: any) => (
                <li className="mt-1" key={route.name}>
                  {route.children ? (
                    <details open={openSubmenus[route.name]}>
                      <summary
                        className="hover:bg-base-100 hover:text-primary cursor-pointer active:bg-white active:text-primary"
                        onClick={() => toggleSubmenu(route.name)}
                      >
                        <RiSettingsLine />
                        <span className="ms-3">{route.name}</span>
                      </summary>
                      <ul>
                        {route.children.map((child: any) => (
                          <li className="mt-1" key={child.path}>
                            <Link
                              href={child.path}
                              className={`hover:bg-base-100 hover:text-primary ${
                                pathname === child.path
                                  ? "bg-base-100 text-primary"
                                  : ""
                              }`}
                            >
                              <span className="ms-3">{child.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <Link
                      href={route.path}
                      className={`hover:bg-base-100 hover:text-primary flex items-center gap-3 ${
                        pathname === route.path
                          ? "bg-base-100 text-primary"
                          : ""
                      }`}
                    >
                      <RiDashboardLine />
                      <span className="ms-3">{route.name}</span>
                    </Link>
                  )}
                </li>
              ))}
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
