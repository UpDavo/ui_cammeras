"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  listPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "@/services/roleApi";
import {
  Loader,
  TextInput,
  Button,
  Notification,
  Pagination,
  Modal,
  MultiSelect,
  Checkbox,
} from "@mantine/core";
import {
  RiAddLine,
  RiSearchLine,
  RiEdit2Line,
  RiDeleteBin6Line,
} from "react-icons/ri";

const methodOptions = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "DELETE", label: "DELETE" },
];

export default function PermissionPage() {
  const { accessToken } = useAuth();
  const [permissions, setPermissions] = useState<any[]>([]);
  const [formState, setFormState] = useState<{
    name: string;
    path: string;
    methods: string[];
    description: string;
  }>({
    name: "",
    path: "",
    methods: [],
    description: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch permissions con paginación y búsqueda
  useEffect(() => {
    if (accessToken) {
      const delaySearch = setTimeout(() => {
        fetchData();
      }, 500);
      return () => clearTimeout(delaySearch);
    }
  }, [accessToken, page, searchQuery]);

  // Actualiza fetchData para soportar paginación y búsqueda en frontend
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await listPermissions(accessToken);
      // Filtrado y paginación en frontend
      let filtered = data.results || data;
      if (searchQuery) {
        filtered = filtered.filter((perm: any) =>
          perm.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setTotalPages(Math.ceil(filtered.length / 10));
      setPermissions(filtered.slice((page - 1) * 10, page * 10));
      setError(null);
    } catch (err) {
      setError("Error al cargar los permisos");
    } finally {
      setLoading(false);
    }
  };

  // Save permission
  const handleSave = async () => {
    if (!formState.name || !formState.path) return;
    try {
      if (editingId) {
        // Convert methods from string[] to number[] if needed
        const updatedFormState = {
          ...formState,
          methods: formState.methods.map((m) => {
            // If your backend expects method IDs (numbers), map accordingly.
            // Replace this logic if you have a mapping from method name to ID.
            // For now, just return as-is if already a number, or provide a mapping.
            // Example mapping (adjust as needed):
            const methodMap: { [key: string]: number } = {
              GET: 1,
              POST: 2,
              PUT: 3,
              DELETE: 4,
            };
            return typeof m === "string" ? methodMap[m] ?? m : m;
          }),
        };
        await updatePermission(editingId, updatedFormState, accessToken);
      } else {
        // Convert methods from string[] to number[] if needed
        const methodMap: { [key: string]: number } = {
          GET: 1,
          POST: 2,
          PUT: 3,
          DELETE: 4,
        };
        const createPayload = {
          ...formState,
          methods: formState.methods.map((m) => methodMap[m] ?? m),
        };
        await createPermission(createPayload, accessToken);
      }
      setModalOpen(false);
      setEditingId(null);
      setFormState({ name: "", path: "", methods: [], description: "" });
      fetchData();
    } catch (err) {
      setError("Error al guardar el permiso");
    }
  };

  // Edit permission
  const handleEdit = (item: any) => {
    setFormState({
      name: item.name,
      path: item.path,
      methods: Array.isArray(item.methods)
        ? item.methods.map((m: any) => (typeof m === "string" ? m : m.name))
        : [],
      description: item.description || "",
    });
    setEditingId(item.id);
    setModalOpen(true);
  };

  // Delete permission
  const handleDelete = async (id: number) => {
    try {
      await deletePermission(id, accessToken);
      fetchData();
    } catch (err) {
      setError("Error al eliminar el permiso");
    }
  };

  return (
    <div className="text-black">
      <div className="flex justify-between items-center mb-4 gap-2">
        <TextInput
          leftSection={<RiSearchLine />}
          placeholder="Buscar por nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        <Button
          onClick={() => {
            setFormState({ name: "", path: "", methods: [], description: "" });
            setEditingId(null);
            setModalOpen(true);
          }}
          leftSection={<RiAddLine />}
          className="btn btn-info btn-sm"
        >
          Agregar
        </Button>
      </div>
      {error && (
        <Notification color="red" className="mb-4">
          {error}
        </Notification>
      )}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto rounded-md">
            <table className="table w-full hidden md:table">
              <thead className="bg-info text-white text-md uppercase font-bold">
                <tr className="text-white">
                  <th>Nombre</th>
                  <th>Ruta</th>
                  <th>Métodos</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <Loader size="sm" color="blue" />
                      <p className="mt-2 text-gray-500">Cargando...</p>
                    </td>
                  </tr>
                ) : permissions.length > 0 ? (
                  permissions.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.path}</td>
                      <td>
                        {Array.isArray(item.methods)
                          ? item.methods
                              .map((m: any) =>
                                typeof m === "string" ? m : m.name
                              )
                              .join(", ")
                          : "—"}
                      </td>
                      <td>{item.description || "—"}</td>
                      <td className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(item)}
                          className="btn btn-info btn-sm"
                        >
                          <RiEdit2Line />
                        </Button>
                        <Button
                          onClick={() => handleDelete(item.id)}
                          className="btn btn-error btn-sm text-white"
                        >
                          <RiDeleteBin6Line />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No se encontraron datos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Vista móvil */}
            <div className="md:hidden space-y-4">
              {loading ? (
                <div className="flex flex-col items-center py-4">
                  <Loader size="sm" color="blue" />
                  <p className="mt-2 text-gray-500">Cargando...</p>
                </div>
              ) : permissions.length > 0 ? (
                permissions.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 bg-white shadow-md "
                  >
                    <div className="mb-2">
                      <span className="font-semibold">Nombre: </span>
                      {item.name}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Ruta: </span>
                      {item.path}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Métodos: </span>
                      {Array.isArray(item.methods)
                        ? item.methods
                            .map((m: any) =>
                              typeof m === "string" ? m : m.name
                            )
                            .join(", ")
                        : "—"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Descripción: </span>
                      {item.description || "—"}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button
                        onClick={() => handleEdit(item)}
                        className="btn btn-info btn-sm w-full"
                      >
                        <RiEdit2Line className="mr-1" /> Editar
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-error btn-sm text-white w-full"
                      >
                        <RiDeleteBin6Line className="mr-1" /> Eliminar
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">No se encontraron datos.</div>
              )}
            </div>
          </div>
          {/* Paginación */}
          {totalPages > 1 && (
            <Pagination
              value={page}
              onChange={setPage}
              total={totalPages}
              className="mt-6"
            />
          )}
        </div>
      </div>
      {/* Modal para Crear/Editar */}
      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
        }}
        title={editingId ? "Editar Permiso" : "Nuevo Permiso"}
        centered
        className="text-black"
      >
        <div className="space-y-4 text-black">
          <TextInput
            label="Nombre"
            placeholder="Nombre"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
          />
          <TextInput
            label="Ruta"
            placeholder="/api/ejemplo"
            value={formState.path}
            onChange={(e) =>
              setFormState({ ...formState, path: e.target.value })
            }
          />
          <MultiSelect
            label="Métodos"
            placeholder="Selecciona métodos"
            data={methodOptions}
            value={formState.methods}
            onChange={(value) => setFormState({ ...formState, methods: value })}
            searchable
          />
          <TextInput
            label="Descripción"
            placeholder="Descripción"
            value={formState.description}
            onChange={(e) =>
              setFormState({ ...formState, description: e.target.value })
            }
          />
          <Button
            className="btn btn-info btn-sm"
            fullWidth
            onClick={handleSave}
          >
            {editingId ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
