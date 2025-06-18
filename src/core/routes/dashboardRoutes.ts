import {
  RiDashboardLine,
  RiUser3Line,
  RiTeamLine,
  RiKey2Line,
  RiSettingsLine,
} from "react-icons/ri";

export const dashboardRoutes = [
  {
    section: "Menu",
    children: [
      { path: "/dashboard", name: "Inicio", icon: RiDashboardLine },
      // {
      //   name: "Push",
      //   children: [
      //     {
      //       path: "/dashboard/push/send",
      //       name: "Enviar Push",
      //       permission: "/push/send",
      //     },
      //     {
      //       path: "/dashboard/push",
      //       name: "Crear Mensajes",
      //       permission: "/push",
      //     },
      //     {
      //       path: "/dashboard/push/logs",
      //       name: "Obtener Logs",
      //       permission: "/push/logs",
      //     },
      //   ],
      // },
    ],
  },
  {
    section: "Ajustes",
    children: [
      {
        name: "Configuracion",
        icon: RiSettingsLine,
        children: [
          {
            path: "/dashboard/user",
            name: "Usuarios",
            permission: "/users",
            icon: RiUser3Line,
          },
          {
            path: "/dashboard/user/roles",
            name: "Roles",
            permission: "/users/roles",
            icon: RiTeamLine,
          },
          {
            path: "/dashboard/user/permission",
            name: "Permisos",
            permission: "/users/permission",
            icon: RiKey2Line,
          },
        ],
      },
    ],
  },
];
