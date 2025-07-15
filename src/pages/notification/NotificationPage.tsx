
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  IoMail, 
  IoSend, 
  IoFilter, 
  IoPersonAdd, 
  IoCheckmark,
  IoEye,
  IoRefresh,
  IoSearch
} from 'react-icons/io5';
import { sendCustomEmail } from '../../store/firebase/helper';
import { useUserStore } from '../../stores/users/user.store';
import { useLevelStore } from '../../stores/level/level.store';
import { useSubLevelStore } from '../../stores/level/sublevel.store';
import { useEnterpriseInfoStore } from '../../stores/enterpriseinfo/enterpriseinfo.store';
import { FirestoreUser, level, subLevel } from '../../interface';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

// Esquema de validación
const notificationSchema = z.object({
  recipients: z.array(z.string().email('Email inválido')).min(1, 'Debe seleccionar al menos un destinatario'),
  subject: z.string().min(1, 'El asunto es requerido').max(200, 'El asunto es muy largo'),
  message: z.string().min(1, 'El mensaje es requerido'),
  isHtml: z.boolean().default(true),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

interface FilterOptions {
  searchTerm: string;
  status: string;
  level: string;
  sublevel: string;
}

export const NotificationPage = () => {
  const { users, getAllUsers } = useUserStore();
  const { levels, getAndSetLevels } = useLevelStore();
  const { subLevels, getAndSetSubLevels } = useSubLevelStore();
  const { enterpriseInfo, getEnterpriseInfo } = useEnterpriseInfoStore();
  
  const [selectedUsers, setSelectedUsers] = useState<FirestoreUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<FirestoreUser[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    status: '',
    level: '',
    sublevel: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sending, setSending] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      recipients: [],
      subject: '',
      message: '',
      isHtml: true
    }
  });

  const watchedMessage = watch('message');
  const watchedSubject = watch('subject');
  const watchedRecipients = watch('recipients');

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setUsersLoading(true);
      try {
        await Promise.all([
          getAllUsers(),
          getAndSetLevels(),
          getAndSetSubLevels(),
          getEnterpriseInfo()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setUsersLoading(false);
      }
    };
    loadData();
  }, [getAllUsers, getAndSetLevels, getAndSetSubLevels, getEnterpriseInfo]);

  // Función utilidad para eliminar duplicados
  const removeDuplicateUsers = (users: FirestoreUser[]) => {
    return users.filter((user, index, self) => 
      index === self.findIndex(u => u.id === user.id)
    );
  };

  // Filtrar usuarios
  useEffect(() => {
    let filtered = users;

    // Filtro por término de búsqueda
    if (filters.searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filters.status) {
      filtered = filtered.filter(user => user.isActive === (filters.status === 'active'));
    }

    // Filtro por nivel
    if (filters.level) {
      filtered = filtered.filter(user => user.level === filters.level);
    }

    // Filtro por subnivel
    if (filters.sublevel) {
      filtered = filtered.filter(user => user.subLevel === filters.sublevel);
    }

    // Eliminar duplicados basándose en el ID único
    const uniqueFiltered = removeDuplicateUsers(filtered);

    setFilteredUsers(uniqueFiltered);
  }, [users, filters]);

  // Actualizar recipients cuando cambian los usuarios seleccionados
  useEffect(() => {
    // Asegurar que no haya duplicados en selectedUsers
    const uniqueSelectedUsers = removeDuplicateUsers(selectedUsers);
    
    if (uniqueSelectedUsers.length !== selectedUsers.length) {
      setSelectedUsers(uniqueSelectedUsers);
      return;
    }
    
    const emails = uniqueSelectedUsers.map(user => user.email).filter(Boolean) as string[];
    setValue('recipients', emails);
  }, [selectedUsers, setValue]);

  const toggleUserSelection = (user: FirestoreUser) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        // Asegurar que no se agregue un duplicado
        const exists = prev.some(u => u.id === user.id);
        if (!exists) {
          return [...prev, user];
        }
        return prev;
      }
    });
  };

  const selectAllFiltered = () => {
    // Asegurarse de que no haya duplicados combinando los usuarios ya seleccionados
    // con los usuarios filtrados que no estén ya seleccionados
    const selectedIds = new Set(selectedUsers.map(user => user.id));
    const newUsersToAdd = filteredUsers.filter(user => !selectedIds.has(user.id));
    
    // Combinar y eliminar cualquier posible duplicado
    const allUsers = [...selectedUsers, ...newUsersToAdd];
    const uniqueUsers = removeDuplicateUsers(allUsers);
    
    setSelectedUsers(uniqueUsers);
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const generateHtmlTemplate = (message: string, subject: string) => {
    const logo = enterpriseInfo?.logo || import.meta.env.VITE_REACT_APP_LOGO_URL || 'https://via.placeholder.com/150x60?text=Logo';
    const companyName = enterpriseInfo?.name || 'Gateway English';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #e0e0e0; margin-bottom: 20px; }
            .logo { max-width: 200px; height: auto; }
            .content { padding: 20px 0; }
            .message { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .button:hover { background-color: #0056b3; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${logo}" alt="${companyName}" class="logo">
              <h1 style="color: #333; margin: 10px 0;">${companyName}</h1>
            </div>
            
            <div class="content">
              <h2 style="color: #007bff;">${subject}</h2>
              <div class="message">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${companyName}. Todos los derechos reservados.</p>
              ${enterpriseInfo?.address ? `<p>📍 ${enterpriseInfo.address}</p>` : ''}
              ${enterpriseInfo?.phoneNumber ? `<p>📞 ${enterpriseInfo.phoneNumber}</p>` : ''}
              ${enterpriseInfo?.email ? `<p>✉️ ${enterpriseInfo.email}</p>` : ''}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const onSubmit = async (data: NotificationFormData) => {
    try {
      setSending(true);
      
      const htmlContent = data.isHtml ? 
        generateHtmlTemplate(data.message, data.subject) : 
        data.message;

      await sendCustomEmail({
        to: data.recipients,
        message: {
          subject: data.subject,
          text: data.message,
          html: htmlContent
        }
      });

      await Swal.fire({
        title: '¡Éxito!',
        text: `Se ha enviado la notificación a ${data.recipients.length} destinatario(s)`,
        icon: 'success',
        confirmButtonColor: '#007bff',
        confirmButtonText: 'Continuar'
      });

      // Limpiar formulario
      reset();
      setSelectedUsers([]);
      
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Error al enviar la notificación');
    } finally {
      setSending(false);
    }
  };

  const previewHtml = () => {
    const htmlContent = generateHtmlTemplate(watchedMessage, watchedSubject);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <IoMail className="text-blue-600" />
          Gestor de Notificaciones
        </h1>
        <p className="text-gray-600">
          Envía notificaciones por email a usuarios seleccionados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Selección de Usuarios */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Seleccionar Usuarios
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-white hover:text-blue-600 transition-colors"
              >
                <IoFilter className="w-5 h-5" />
              </button>
            </div>

            {/* Filtros */}
            {showFilters && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="relative">
                  {/* <IoSearch className="absolute left-3 top-3 text-gray-400 w-4 h-4" /> */}
                  <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>

                <select
                  value={filters.level}
                  onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los niveles</option>
                  {levels.map(level => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>

                <select
                  value={filters.sublevel}
                  onChange={(e) => setFilters(prev => ({ ...prev, sublevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los subniveles</option>
                  {subLevels.map((sublevel: subLevel) => (
                    <option key={sublevel.id} value={sublevel.id}>{sublevel.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Controles de Selección */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={selectAllFiltered}
                className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Seleccionar Todos
              </button>
              <button
                onClick={clearSelection}
                className="flex-1 py-2 px-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Limpiar
              </button>
            </div>

            {/* Contador */}
            <div className="mb-4 text-sm text-gray-600">
              <span className="font-semibold">{selectedUsers.length}</span> usuario(s) seleccionado(s)
              <span className="mx-2">•</span>
              <span className="font-semibold">{filteredUsers.length}</span> usuario(s) mostrado(s)
            </div>

            {/* Lista de Usuarios */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {usersLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Cargando usuarios...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => toggleUserSelection(user)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedUsers.some(u => u.id === user.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.level && (
                          <p className="text-xs text-gray-400">
                            Nivel: {levels.find((l: level) => l.id === user.level)?.name || 'N/A'}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {selectedUsers.some(u => u.id === user.id) ? (
                          <IoCheckmark className="w-5 h-5 text-blue-600" />
                        ) : (
                          <IoPersonAdd className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <IoPersonAdd className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No se encontraron usuarios</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Formulario de Notificación */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Crear Notificación
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Destinatarios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destinatarios ({watchedRecipients.length})
                </label>
                {watchedRecipients.length > 0 ? (
                  <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-3">
                    <div className="flex flex-wrap gap-2">
                      {watchedRecipients.map((email, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {email}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <IoMail className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Selecciona usuarios para enviar la notificación</p>
                  </div>
                )}
                {errors.recipients && (
                  <p className="text-red-500 text-sm mt-1">{errors.recipients.message}</p>
                )}
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto
                </label>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingresa el asunto del mensaje"
                    />
                  )}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Escribe tu mensaje aquí..."
                    />
                  )}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Opciones */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Controller
                    name="isHtml"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        value={undefined}
                      />
                    )}
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Usar plantilla HTML
                  </label>
                </div>

                <button
                  type="button"
                  onClick={previewHtml}
                  disabled={!watchedMessage || !watchedSubject}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <IoEye className="w-4 h-4 mr-2" />
                  Vista Previa
                </button>
              </div>

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={sending || watchedRecipients.length === 0}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <IoRefresh className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <IoSend className="w-5 h-5" />
                      Enviar Notificación
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setSelectedUsers([]);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {sending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Enviando Notificación
              </h3>
              <p className="text-gray-600">
                Por favor espere mientras se envía la notificación a {watchedRecipients.length} destinatario(s)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
