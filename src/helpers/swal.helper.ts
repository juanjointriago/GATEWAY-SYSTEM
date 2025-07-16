import Swal, { SweetAlertOptions } from 'sweetalert2';

// Configuración base para SweetAlert2 con z-index adecuado
const swalConfig: Partial<SweetAlertOptions> = {
  backdrop: true,
  allowOutsideClick: false,
  allowEscapeKey: false,
  heightAuto: false,
  width: '600px',
  padding: '32px',
  showClass: {
    popup: 'swal2-show',
    backdrop: 'swal2-backdrop-show'
  },
  hideClass: {
    popup: 'swal2-hide',
    backdrop: 'swal2-backdrop-hide'
  },
  customClass: {
    container: 'swal2-container',
    popup: 'swal2-popup'
  },
  didOpen: () => {
    // Configurar el backdrop de forma más sutil
    const container = document.querySelector('.swal2-container');
    if (container) {
      (container as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
      (container as HTMLElement).style.backdropFilter = 'blur(1px)';
    }
  }
};

// Helper para mostrar alerta de éxito
export const showSuccessAlert = (title: string, text: string, confirmButtonText: string = 'Continuar') => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText,
    ...swalConfig
  });
};

// Helper para mostrar alerta de error
export const showErrorAlert = (title: string, text: string, confirmButtonText: string = 'Entendido') => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText,
    ...swalConfig
  });
};

// Helper para mostrar alerta de confirmación
export const showConfirmAlert = (title: string, text: string, options?: Partial<SweetAlertOptions>) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    ...swalConfig,
    ...options
  });
};

// Helper para mostrar alerta de información
export const showInfoAlert = (title: string, text: string, confirmButtonText: string = 'Entendido') => {
  return Swal.fire({
    title,
    text,
    icon: 'info',
    confirmButtonText,
    ...swalConfig
  });
};

// Helper para mostrar alerta de advertencia
export const showWarningAlert = (title: string, text: string, confirmButtonText: string = 'Entendido') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonText,
    ...swalConfig
  });
};

// Helper para mostrar alerta personalizada
export const showCustomAlert = (options: SweetAlertOptions) => {
  return Swal.fire({
    ...swalConfig,
    ...options
  });
};

// Helper simple para errores rápidos
export const showSimpleError = (message: string) => {
  return Swal.fire({
    title: 'Error',
    text: message,
    icon: 'error',
    ...swalConfig
  });
};

// Helper simple para éxitos rápidos
export const showSimpleSuccess = (message: string) => {
  return Swal.fire({
    title: '¡Éxito!',
    text: message,
    icon: 'success',
    ...swalConfig
  });
};
