export type OrderStatus = 'pendiente' | 'en_cocina' | 'cocina' | 'listo' | 'entregado' | 'cancelado';

export interface OrderDetail {
  detalle_id?: number;
  pedido_id?: number;
  producto_id?: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
  notas?: string;
}

export interface Order {
  pedido_id: number;
  numero_orden: number;
  tipo_entrega: 'mesa' | 'para_llevar';
  numero_mesa?: number | null;
  cliente_nombre?: string;
  estado: OrderStatus;
  total: number;
  metodo_pago?: 'efectivo' | 'tarjeta' | 'qr' | 'mixto';
  creado_en: string;
  detalles: OrderDetail[];
}

export interface Category {
  categoria_id: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface Product {
  producto_id: number;
  categoria_id: number;
  categoria_nombre?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  disponible: boolean;
}

export type Role = 'admin' | 'cajero' | 'cocina';

export interface User {
  usuario_id: number;
  nombre_completo: string;
  nombre_usuario: string;
  rol_id?: number;
  rol_nombre: Role;
  sucursal_id?: number;
  sucursal_nombre?: string;
  correo?: string;
  telefono?: string;
  tiene_pin?: boolean;
  activo: boolean;
  creado_en?: string;
}

export interface CashMovement {
  movimiento_id: number;
  turno_id?: number;
  tipo: 'INGRESO' | 'EGRESO';
  monto: number;
  concepto: string;
  cajero_nombre?: string;
  creado_en: string;
}

export interface ShiftSummary {
  turno_id: number;
  cajero_nombre: string;
  fondo_inicial: number;
  total_ventas?: number;
  total_efectivo: number;
  total_ingresos_extra: number;
  total_egresos_gastos: number;
  efectivo_esperado: number;
  estado?: 'abierto' | 'cerrado';
  fecha_apertura?: string;
  fecha_cierre?: string | null;
}

export interface DashboardMetrics {
  totalVentasHoy: number;
  totalPedidosHoy: number;
  ticketPromedio: number;
  pedidosEnCocina: number;
  pedidosListos: number;
  ventasEfectivo: number;
  ventasTarjeta: number;
  ventasQr: number;
}
