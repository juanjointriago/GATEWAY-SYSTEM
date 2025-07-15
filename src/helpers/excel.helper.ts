import * as ExcelJS from 'exceljs';
import { fee } from '../interface/fees.interface';
import { level } from '../interface/levels.interface';
import { event } from '../interface/events.interface';
import { subLevel } from '../interface/levels.interface';
import { FirestoreUser } from '../interface/user.interface';
import { unit } from '../interface/unit.interface';

export const exportFeesToExcel = async (fees: fee[], fileName: string = 'pagos') => {
  try {
    // Crear un nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pagos');

    // Configurar las columnas
    worksheet.columns = [
      { header: 'Código', key: 'code', width: 15 },
      { header: 'Fecha', key: 'date', width: 12 },
      { header: 'Estudiante CI', key: 'cc', width: 15 },
      { header: 'Cliente', key: 'customerName', width: 20 },
      { header: 'Monto', key: 'qty', width: 10 },
      { header: 'Motivo', key: 'reason', width: 25 },
      { header: 'Forma de Pago', key: 'paymentMethod', width: 15 },
      { header: 'Nro. Comprobante', key: 'docNumber', width: 15 },
      { header: 'Lugar', key: 'place', width: 15 },
      { header: 'Estado', key: 'status', width: 12 }
    ];

    // Agregar datos
    fees.forEach(fee => {
      worksheet.addRow({
        code: fee.code,
        date: new Date(fee.createdAt).toLocaleDateString(),
        cc: fee.cc,
        customerName: fee.customerName,
        qty: `$${fee.qty}`,
        reason: fee.reason,
        paymentMethod: getPaymentMethodLabel(fee.paymentMethod),
        docNumber: fee.docNumber || 'N/A',
        place: fee.place,
        status: fee.isSigned ? 'Aprobado' : 'Pendiente'
      });
    });

    // Estilizar el header
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    // Aplicar bordes a todas las celdas
    worksheet.eachRow({ includeEmpty: false }, row => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Descargar el archivo
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error al exportar Excel:', error);
    return false;
  }
};

// Helper para convertir el método de pago a texto legible
const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'cash':
      return 'Efectivo';
    case 'transference':
      return 'Transferencia';
    case 'deposit':
      return 'Depósito';
    case 'tc':
      return 'Tarjeta de Crédito';
    case 'voucher_tc':
      return 'Voucher TC';
    default:
      return method;
  }
};

// Función para exportar un resumen de pagos
export const exportPaymentSummary = async (fees: fee[], fileName: string = 'resumen_pagos') => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resumen de Pagos');

    // Calcular estadísticas
    const totalAmount = fees.reduce((sum, fee) => sum + fee.qty, 0);
    const approvedAmount = fees.filter(f => f.isSigned).reduce((sum, fee) => sum + fee.qty, 0);
    const pendingAmount = fees.filter(f => !f.isSigned).reduce((sum, fee) => sum + fee.qty, 0);
    const totalCount = fees.length;
    const approvedCount = fees.filter(f => f.isSigned).length;
    const pendingCount = fees.filter(f => !f.isSigned).length;

    // Agregar título
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = 'RESUMEN DE PAGOS';
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Agregar fecha de generación
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').value = `Generado el: ${new Date().toLocaleDateString()}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    // Agregar resumen
    worksheet.addRow([]);
    worksheet.addRow(['Concepto', 'Cantidad', 'Monto Total', 'Porcentaje']);
    worksheet.addRow(['Total de Pagos', totalCount, `$${totalAmount.toFixed(2)}`, '100%']);
    worksheet.addRow(['Pagos Aprobados', approvedCount, `$${approvedAmount.toFixed(2)}`, `${((approvedAmount / totalAmount) * 100).toFixed(1)}%`]);
    worksheet.addRow(['Pagos Pendientes', pendingCount, `$${pendingAmount.toFixed(2)}`, `${((pendingAmount / totalAmount) * 100).toFixed(1)}%`]);

    // Estilizar el header del resumen
    worksheet.getRow(4).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF70AD47' }
      };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
    });

    // Configurar anchos de columna
    worksheet.columns = [
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 15 }
    ];

    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Descargar el archivo
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error al exportar resumen:', error);
    return false;
  }
};

// Función genérica para exportar cualquier tipo de datos
export const exportGenericToExcel = async <T>(
  data: T[],
  columns: Array<{ header: string; key: keyof T; width?: number; format?: (value: unknown) => string }>,
  fileName: string = 'datos',
  sheetName: string = 'Datos'
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Configurar las columnas
    worksheet.columns = columns.map(col => ({
      header: col.header,
      key: col.key as string,
      width: col.width || 15
    }));

    // Agregar datos
    data.forEach(item => {
      const row: Record<string, unknown> = {};
      columns.forEach(col => {
        const value = item[col.key];
        row[col.key as string] = col.format ? col.format(value) : value;
      });
      worksheet.addRow(row);
    });

    // Estilizar el header
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    // Aplicar bordes a todas las celdas
    worksheet.eachRow({ includeEmpty: false }, row => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Descargar el archivo
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error al exportar Excel:', error);
    return false;
  }
};

// Función específica para exportar niveles
export const exportLevelsToExcel = async (levels: level[], fileName: string = 'niveles') => {
  const columns = [
    { header: 'Nombre', key: 'name' as keyof level, width: 20 },
    { header: 'Descripción', key: 'description' as keyof level, width: 30 },
    { header: 'Estado', key: 'isActive' as keyof level, width: 15, format: (value: unknown) => (value as boolean) ? 'Activo' : 'Inactivo' },
    { header: 'Fecha de Creación', key: 'createdAt' as keyof level, width: 20, format: (value: unknown) => new Date(value as number).toLocaleDateString() }
  ];

  return exportGenericToExcel(levels, columns, fileName, 'Niveles');
};

// Función específica para exportar eventos
export const exportEventsToExcel = async (events: event[], fileName: string = 'eventos') => {
  const columns = [
    { header: 'Nombre', key: 'name' as keyof event, width: 25 },
    { header: 'Descripción', key: 'description' as keyof event, width: 30 },
    { header: 'Fecha de Evento', key: 'date' as keyof event, width: 20, format: (value: unknown) => new Date(value as number).toLocaleDateString() },
    { header: 'Estado', key: 'isActive' as keyof event, width: 15, format: (value: unknown) => (value as boolean) ? 'Activo' : 'Inactivo' },
    { header: 'Fecha de Creación', key: 'createdAt' as keyof event, width: 20, format: (value: unknown) => new Date(value as number).toLocaleDateString() }
  ];

  return exportGenericToExcel(events, columns, fileName, 'Eventos');
};

// Función específica para exportar subniveles
export const exportSublevelsToExcel = async (sublevels: subLevel[], fileName: string = 'subniveles') => {
  const columns = [
    { header: 'Nombre', key: 'name' as keyof subLevel, width: 25 },
    { header: 'Descripción', key: 'description' as keyof subLevel, width: 30 },
    { header: 'Estado', key: 'isActive' as keyof subLevel, width: 15, format: (value: unknown) => (value as boolean) ? 'Activo' : 'Inactivo' },
    { header: 'Fecha de Creación', key: 'createdAt' as keyof subLevel, width: 20, format: (value: unknown) => new Date(value as number).toLocaleDateString() }
  ];

  return exportGenericToExcel(sublevels, columns, fileName, 'Subniveles');
};

// Función específica para exportar usuarios
export const exportUsersToExcel = async (users: FirestoreUser[], fileName: string = 'usuarios') => {
  const columns = [
    { header: 'Nombre', key: 'name' as keyof FirestoreUser, width: 25 },
    { header: 'Email', key: 'email' as keyof FirestoreUser, width: 30 },
    { header: 'Rol', key: 'role' as keyof FirestoreUser, width: 15 },
    { header: 'Teléfono', key: 'phone' as keyof FirestoreUser, width: 15 },
    { header: 'Estado', key: 'isActive' as keyof FirestoreUser, width: 15, format: (value: unknown) => (value as boolean) ? 'Activo' : 'Inactivo' },
    { header: 'Fecha de Creación', key: 'createdAt' as keyof FirestoreUser, width: 20, format: (value: unknown) => new Date(value as number).toLocaleDateString() }
  ];

  return exportGenericToExcel(users, columns, fileName, 'Usuarios');
};

// Función específica para exportar unidades/libros
export const exportUnitsToExcel = async (units: unit[], fileName: string = 'libros') => {
  const columns = [
    { header: 'Nombre', key: 'name' as keyof unit, width: 30 },
    { header: 'Descripción', key: 'description' as keyof unit, width: 40 },
    { header: 'Nivel', key: 'subLevel' as keyof unit, width: 20 },
    { header: 'Estado', key: 'isActive' as keyof unit, width: 15, format: (value: unknown) => (value as boolean) ? 'Activo' : 'Inactivo' },
    { header: 'Fecha de Creación', key: 'createdAt' as keyof unit, width: 20, format: (value: unknown) => new Date(value as number).toLocaleDateString() }
  ];

  return exportGenericToExcel(units, columns, fileName, 'Libros');
};
