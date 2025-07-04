# Formulario de Contrato de Estudiante (React Hook Form)

## Descripción
El formulario de contrato de estudiante permite crear y editar la información contractual y financiera de los estudiantes en el sistema Gateway. **Ahora implementado con React Hook Form** para mejor rendimiento y validación.

## 🚀 Nuevas Mejoras con React Hook Form

### ⚡ Rendimiento Optimizado
- **Menos re-renders**: Solo se re-renderizan los campos que cambian
- **Validación en tiempo real**: Validaciones más eficientes y reactivas
- **Mejor UX**: Estados de loading y errores más fluidos
- **Menor bundle size**: Menos código JavaScript

### 🔧 Validaciones Avanzadas

#### Validaciones Declarativas
```typescript
rules={{
  required: "El nombre de representante es requerido",
  minLength: {
    value: 2,
    message: "El nombre debe tener al menos 2 caracteres"
  }
}}
```

#### Validaciones Personalizadas
- **Fechas inteligentes**: Expiración debe ser posterior a inscripción
- **Números negativos**: Prevención automática con mensajes claros
- **Validación cruzada**: Los campos se validan entre sí

### 🎯 Características Principales

#### 🎨 Diseño Responsivo
- Grid adaptativo que se ajusta desde 1 columna (móvil) hasta 3 columnas (desktop)
- Componentes optimizados para uso dentro de `ModalGeneric`
- Diseño moderno con Tailwind CSS

#### 🔧 Funcionalidades

##### Información del Contrato
- **Nombre Preferido** (requerido, mín. 2 caracteres): Nombre que prefiere usar el estudiante
- **Otros Contactos**: Información adicional de contacto
- **Fecha de Inscripción** (requerida): Fecha de inicio del contrato
- **Fecha de Expiración** (requerida + validación cruzada): Fecha de vencimiento del contrato

##### Información Financiera
- **Total Adeudado**: Monto total del contrato (≥ 0)
- **Total Pagado**: Monto ya pagado por el estudiante (≥ 0)
- **Total Descuento**: Descuentos aplicados (≥ 0)
- **Cantidad de Cuotas**: Número de pagos programados (≥ 1)
- **Total Pendiente**: Calculado automáticamente (Adeudado - Pagado - Descuento)
- **Total Saldo**: Saldo actual (igual al total pendiente)

### ✅ Sistema de Validación Mejorado

#### Validaciones en Tiempo Real
```typescript
// Ejemplo de validación cruzada
validate: (value) => {
  const inscriptionDate = watch('inscriptionDate');
  if (inscriptionDate && value) {
    const inscription = new Date(inscriptionDate);
    const expiration = new Date(value);
    
    if (expiration <= inscription) {
      return "La fecha de expiración debe ser posterior a la de inscripción";
    }
  }
  return true;
}
```

#### Estados de Validación
- ✅ **Válido**: Bordes verdes, sin mensajes de error
- ❌ **Error**: Bordes rojos, fondo rosado, mensaje de error claro
- 🔄 **Validando**: Estados intermedios durante la escritura
- 💾 **Guardando**: Botón con spinner y estado disabled

### 🔄 Cálculos Automáticos Reactivos

```typescript
// Watch valores para cálculos automáticos
const totalFee = watch('totalFee');
const totalPaid = watch('totalPaid');
const totalDiscount = watch('totalDiscount');

// Efecto para calcular automáticamente valores derivados
useEffect(() => {
  const totalDue = Number(totalFee || 0) - Number(totalPaid || 0) - Number(totalDiscount || 0);
  setValue('totalDue', totalDue);
  setValue('totalBalance', totalDue);
}, [totalFee, totalPaid, totalDiscount, setValue]);
```

### 📱 Acceso al Formulario
1. Ir a la página de **Usuarios**
2. Hacer clic en el botón de **3 puntos verticales** (azul) en la fila del estudiante
3. Seleccionar **"Contrato"** del menú dropdown
4. Se abrirá el modal con el formulario

### 🔄 Estados del Formulario

#### Nuevo Contrato
- Si el estudiante no tiene contrato, se crea uno automáticamente con:
  - Nombre preferido = nombre del estudiante
  - Fecha de inscripción = fecha actual
  - Fecha de expiración = fecha actual + 1 año
  - Valores financieros = 0

#### Editar Contrato Existente
- Los campos se cargan con los datos existentes usando `reset()`
- Se puede modificar cualquier campo
- Los cambios se guardan al hacer clic en "Guardar Contrato"

### 🎯 Experiencia de Usuario Mejorada

#### Interfaz Reactiva
- Header con información del estudiante (foto, nombre, CC, email)
- Secciones claramente separadas (Contrato e Información Financiera)
- Campos de solo lectura para valores calculados
- Estados de carga con spinner animado
- Confirmaciones con SweetAlert2

#### Validación Inteligente
- **Modo onChange**: Validaciones en tiempo real mientras escribes
- **Mensajes contextuales**: Errores específicos por campo
- **Limpieza automática**: Errores se ocultan al corregir el campo
- **Prevención de envío**: No se puede enviar formulario con errores

#### Responsive Design
- **Móvil**: 1 columna, controles táctiles optimizados
- **Tablet**: 2 columnas, transiciones suaves
- **Desktop**: 3 columnas para información financiera

### 🛠 Tecnologías Utilizadas
- **React Hook Form**: Manejo eficiente de formularios
- **React + TypeScript**: Componente fuertemente tipado
- **Tailwind CSS**: Estilos modernos y responsivos
- **Zustand**: Gestión de estado
- **SweetAlert2**: Alertas y confirmaciones

### 📋 Configuración del Formulario

```typescript
const {
  control,
  handleSubmit,
  watch,
  setValue,
  reset,
  formState: { errors, isSubmitting }
} = useForm<FormData>({
  defaultValues: {
    inscriptionDate: '',
    expirationDate: '',
    myPreferredName: '',
    otherContacts: '',
    totalFee: 0,
    totalPaid: 0,
    totalDue: 0,
    totalDiscount: 0,
    totalBalance: 0,
    quotesQty: 0,
  },
  mode: 'onChange' // Validación en tiempo real
});
```

### 📊 Validaciones por Campo

| Campo | Validaciones | Mensaje de Error |
|-------|-------------|------------------|
| Nombre Preferido | required, minLength(2) | "El nombre preferido es requerido" / "Mín. 2 caracteres" |
| Fecha Inscripción | required | "La fecha de inscripción es requerida" |
| Fecha Expiración | required, validate(crossCheck) | "Debe ser posterior a inscripción" |
| Total Adeudado | min(0) | "No puede ser negativo" |
| Total Pagado | min(0) | "No puede ser negativo" |
| Total Descuento | min(0) | "No puede ser negativo" |
| Cantidad Cuotas | min(1) | "Debe ser mayor a 0" |

### ⚠️ Ventajas de React Hook Form

#### Rendimiento
- ✅ **Menos re-renders**: Solo campos modificados se actualizan
- ✅ **Mejor memoria**: Menos estado interno en React
- ✅ **Validaciones eficientes**: Solo cuando es necesario

#### Desarrollo
- ✅ **Menos código**: Menos boilerplate manual
- ✅ **TypeScript friendly**: Tipado automático
- ✅ **Fácil testing**: Lógica de formulario separada

#### Usuario
- ✅ **Respuesta inmediata**: Validaciones en tiempo real
- ✅ **Estados claros**: Loading, error, success
- ✅ **Mejor accesibilidad**: ARIA labels automáticos

### 🔄 Cálculos Automáticos

```typescript
// Los cálculos se ejecutan automáticamente cuando cambian los valores
totalDue = totalFee - totalPaid - totalDiscount
totalBalance = totalDue
```

### 🎛 Controles del Formulario

#### Controller Component
```typescript
<Controller
  name="myPreferredName"
  control={control}
  rules={{
    required: "El nombre Representante es requerido",
    minLength: {
      value: 2,
      message: "El nombre debe tener al menos 2 caracteres"
    }
  }}
  render={({ field }) => (
    <input {...field} />
  )}
/>
```

## 🏗 Estructura del Código Actualizada

```typescript
type FormData = {
  inscriptionDate: string;
  expirationDate: string;
  myPreferredName: string;
  otherContacts: string;
  totalFee: number;
  totalPaid: number;
  totalDue: number;
  totalDiscount: number;
  totalBalance: number;
  quotesQty: number;
};
```

## 📈 Mejoras de Rendimiento

| Aspecto | Antes (useState) | Ahora (React Hook Form) |
|---------|------------------|-------------------------|
| Re-renders | ❌ En cada cambio | ✅ Solo cuando necesario |
| Validación | ❌ Manual | ✅ Declarativa |
| Bundle Size | ❌ Código custom | ✅ Librería optimizada |
| TypeScript | ❌ Tipado manual | ✅ Inferencia automática |
| Testing | ❌ Complejo | ✅ Fácil |

## 🔮 Próximas Mejoras Planificadas
- [ ] Historial de cambios en el contrato
- [ ] Generación de PDF del contrato
- [ ] Notificaciones de vencimiento
- [ ] Integración con sistema de pagos
- [ ] Reportes financieros por estudiante
- [ ] Validaciones de servidor en tiempo real
- [ ] Autoguardado de borradores
- [ ] Campos condicionales dinámicos
