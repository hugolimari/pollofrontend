import { Order, Product, Category, ShiftSummary, CashMovement, User, DashboardMetrics, OrderStatus } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Initial Mock Data (Fallback when backend is not running)
const initialCategories: Category[] = [
  { categoria_id: 1, nombre: 'Pollos Broaster', descripcion: 'Receta crujiente tradicional', activo: true },
  { categoria_id: 2, nombre: 'Acompañamientos', descripcion: 'Guarniciones y extras', activo: true },
  { categoria_id: 3, nombre: 'Bebidas', descripcion: 'Refrescos y gaseosas frías', activo: true },
  { categoria_id: 4, nombre: 'Combos Familiares', descripcion: 'Promociones especiales', activo: true },
];

const initialProducts: Product[] = [
  {
    producto_id: 1,
    categoria_id: 1,
    categoria_nombre: 'Pollos Broaster',
    nombre: 'Cuarto de Pollo Broaster',
    descripcion: 'Pierna o pechuga con crocante cobertura, papas fritas y salsas caseras.',
    precio: 25.0,
    disponible: true,
  },
  {
    producto_id: 2,
    categoria_id: 1,
    categoria_nombre: 'Pollos Broaster',
    nombre: 'Medio Pollo Broaster',
    descripcion: 'Dos presas selectas con doble porción de papas fritas, arroz y ensalada.',
    precio: 45.0,
    disponible: true,
  },
  {
    producto_id: 3,
    categoria_id: 1,
    categoria_nombre: 'Pollos Broaster',
    nombre: 'Pollo Entero Económico',
    descripcion: '4 presas completas, papas familiares, salsas ilimitadas y plátano frito.',
    precio: 85.0,
    disponible: true,
  },
  {
    producto_id: 4,
    categoria_id: 2,
    categoria_nombre: 'Acompañamientos',
    nombre: 'Porción Extra de Papas Fritas',
    descripcion: 'Papas doradas al punto con sal parrillera.',
    precio: 12.0,
    disponible: true,
  },
  {
    producto_id: 5,
    categoria_id: 3,
    categoria_nombre: 'Bebidas',
    nombre: 'Coca-Cola 2 Litros',
    descripcion: 'Bien fría y burbujeante.',
    precio: 15.0,
    disponible: true,
  },
  {
    producto_id: 6,
    categoria_id: 4,
    categoria_nombre: 'Combos Familiares',
    nombre: 'Mega Combo Familiar Pollo Feliz',
    descripcion: '1 Pollo entero + 6 alitas barbecue + papas gigantes + Coca-Cola 2L.',
    precio: 110.0,
    disponible: true,
  },
];

const now = new Date();
const timeAgo = (minutes: number) => new Date(now.getTime() - minutes * 60000).toISOString();

let mockOrders: Order[] = [
  {
    pedido_id: 101,
    numero_orden: 142,
    tipo_entrega: 'mesa',
    numero_mesa: 4,
    cliente_nombre: 'Juan Pérez',
    estado: 'cocina',
    total: 70.0,
    metodo_pago: 'efectivo',
    creado_en: timeAgo(12),
    detalles: [
      { producto_id: 1, producto_nombre: 'Cuarto de Pollo Broaster', cantidad: 2, precio_unitario: 25.0, subtotal: 50.0, notas: 'Bien dorado, salsa golf aparte' },
      { producto_id: 5, producto_nombre: 'Coca-Cola 2 Litros', cantidad: 1, precio_unitario: 15.0, subtotal: 15.0 },
    ],
  },
  {
    pedido_id: 102,
    numero_orden: 143,
    tipo_entrega: 'para_llevar',
    cliente_nombre: 'María Gómez',
    estado: 'cocina',
    total: 85.0,
    metodo_pago: 'qr',
    creado_en: timeAgo(17),
    detalles: [
      { producto_id: 3, producto_nombre: 'Pollo Entero Económico', cantidad: 1, precio_unitario: 85.0, subtotal: 85.0, notas: 'Empacar bien caliente' },
    ],
  },
  {
    pedido_id: 103,
    numero_orden: 144,
    tipo_entrega: 'mesa',
    numero_mesa: 2,
    cliente_nombre: 'Carlos Rojas',
    estado: 'listo',
    total: 45.0,
    metodo_pago: 'tarjeta',
    creado_en: timeAgo(22),
    detalles: [
      { producto_id: 2, producto_nombre: 'Medio Pollo Broaster', cantidad: 1, precio_unitario: 45.0, subtotal: 45.0 },
    ],
  },
  {
    pedido_id: 104,
    numero_orden: 145,
    tipo_entrega: 'para_llevar',
    cliente_nombre: 'Ana Flores',
    estado: 'listo',
    total: 110.0,
    metodo_pago: 'efectivo',
    creado_en: timeAgo(26),
    detalles: [
      { producto_id: 6, producto_nombre: 'Mega Combo Familiar Pollo Feliz', cantidad: 1, precio_unitario: 110.0, subtotal: 110.0 },
    ],
  },
  {
    pedido_id: 105,
    numero_orden: 146,
    tipo_entrega: 'mesa',
    numero_mesa: 7,
    cliente_nombre: 'Roberto Suárez',
    estado: 'entregado',
    total: 50.0,
    metodo_pago: 'efectivo',
    creado_en: timeAgo(40),
    detalles: [
      { producto_id: 1, producto_nombre: 'Cuarto de Pollo Broaster', cantidad: 2, precio_unitario: 25.0, subtotal: 50.0 },
    ],
  },
];

let mockProducts = [...initialProducts];
let mockCategories = [...initialCategories];

let mockShift: ShiftSummary = {
  turno_id: 12,
  cajero_nombre: 'Hugo Limari',
  fondo_inicial: 200.0,
  total_ventas: 370.0,
  total_efectivo: 230.0,
  total_ingresos_extra: 50.0,
  total_egresos_gastos: 35.0,
  efectivo_esperado: 445.0, // 200 + 230 + 50 - 35
  estado: 'abierto',
  fecha_apertura: timeAgo(180),
};

let mockMovements: CashMovement[] = [
  {
    movimiento_id: 1,
    turno_id: 12,
    tipo: 'EGRESO',
    monto: 35.0,
    concepto: 'Compra de carbón vegetal para grill',
    cajero_nombre: 'Hugo Limari',
    creado_en: timeAgo(110),
  },
  {
    movimiento_id: 2,
    turno_id: 12,
    tipo: 'INGRESO',
    monto: 50.0,
    concepto: 'Inyección de cambio chico (monedas de 2 y 5 Bs.)',
    cajero_nombre: 'Hugo Limari',
    creado_en: timeAgo(150),
  },
];

let mockUsers: User[] = [
  {
    usuario_id: 1,
    nombre_completo: 'Administrador General',
    nombre_usuario: 'admin',
    rol_id: 1,
    rol_nombre: 'admin',
    sucursal_nombre: 'Sucursal Central',
    tiene_pin: true,
    activo: true,
  },
  {
    usuario_id: 2,
    nombre_completo: 'Hugo Limari',
    nombre_usuario: 'hugo.caja',
    rol_id: 2,
    rol_nombre: 'cajero',
    sucursal_nombre: 'Sucursal Central',
    tiene_pin: true,
    activo: true,
  },
  {
    usuario_id: 3,
    nombre_completo: 'Marcos Cocinero',
    nombre_usuario: 'marcos.kds',
    rol_id: 3,
    rol_nombre: 'cocina',
    sucursal_nombre: 'Sucursal Central',
    tiene_pin: false,
    activo: true,
  },
];

const calculateMetrics = (): DashboardMetrics => {
  const cocinando = mockOrders.filter(o => o.estado === 'cocina' || o.estado === 'en_cocina').length;
  const listos = mockOrders.filter(o => o.estado === 'listo').length;
  const totalVentas = mockOrders.reduce((acc, o) => acc + (o.estado !== 'cancelado' ? o.total : 0), 0);
  const totalPedidos = mockOrders.filter(o => o.estado !== 'cancelado').length;
  const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0;

  const ventasEfectivo = mockOrders.filter(o => o.metodo_pago === 'efectivo').reduce((s, o) => s + o.total, 0);
  const ventasTarjeta = mockOrders.filter(o => o.metodo_pago === 'tarjeta').reduce((s, o) => s + o.total, 0);
  const ventasQr = mockOrders.filter(o => o.metodo_pago === 'qr').reduce((s, o) => s + o.total, 0);

  return {
    totalVentasHoy: totalVentas,
    totalPedidosHoy: totalPedidos,
    ticketPromedio: ticketPromedio,
    pedidosEnCocina: cocinando,
    pedidosListos: listos,
    ventasEfectivo: ventasEfectivo || 230,
    ventasTarjeta: ventasTarjeta || 45,
    ventasQr: ventasQr || 85,
  };
};

export const api = {
  async checkBackend(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/pedidos`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback to mock store
    }
    return [...mockOrders];
  },

  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/productos`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return [...mockProducts];
  },

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE}/categorias`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return [...mockCategories];
  },

  async getActiveShift(): Promise<ShiftSummary | null> {
    try {
      const res = await fetch(`${API_BASE}/turnos/activo`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return { ...mockShift };
  },

  async getShiftMovements(): Promise<CashMovement[]> {
    try {
      const res = await fetch(`${API_BASE}/turnos/movimientos`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return [...mockMovements];
  },

  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch(`${API_BASE}/usuarios`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return [...mockUsers];
  },

  async getDashboardMetrics(): Promise<DashboardMetrics | null> {
    try {
      const res = await fetch(`${API_BASE}/dashboard/metricas`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return calculateMetrics();
  },

  async updateOrderStatus(orderId: number, newStatus: OrderStatus): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/pedidos/${orderId}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newStatus }),
      });
      if (res.ok) return;
    } catch {
      // Fallback
    }
    mockOrders = mockOrders.map(o => (o.pedido_id === orderId ? { ...o, estado: newStatus } : o));
  },

  async toggleProductStock(productId: number, newStock: boolean): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/productos/${productId}/disponibilidad`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disponible: newStock }),
      });
      if (res.ok) return;
    } catch {
      // Fallback
    }
    mockProducts = mockProducts.map(p => (p.producto_id === productId ? { ...p, disponible: newStock } : p));
  },

  async addCashMovement(tipo: 'INGRESO' | 'EGRESO', monto: number, concepto: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/turnos/movimientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, monto, concepto }),
      });
      if (res.ok) return;
    } catch {
      // Fallback
    }
    const newMov: CashMovement = {
      movimiento_id: Date.now(),
      turno_id: mockShift.turno_id,
      tipo,
      monto,
      concepto,
      cajero_nombre: mockShift.cajero_nombre,
      creado_en: new Date().toISOString(),
    };
    mockMovements = [newMov, ...mockMovements];

    if (tipo === 'INGRESO') {
      mockShift.total_ingresos_extra += monto;
      mockShift.efectivo_esperado += monto;
    } else {
      mockShift.total_egresos_gastos += monto;
      mockShift.efectivo_esperado -= monto;
    }
  },

  async createDemoOrder(orderNum: number, tipo: 'mesa' | 'para_llevar', items: { prodId: number; qty: number; notas?: string }[]): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_orden: orderNum, tipo_entrega: tipo, items }),
      });
      if (res.ok) return;
    } catch {
      // Fallback
    }

    const detalles = items.map(item => {
      const prod = mockProducts.find(p => p.producto_id === item.prodId);
      const precio = prod ? prod.precio : 25;
      return {
        producto_id: item.prodId,
        producto_nombre: prod ? prod.nombre : `Producto #${item.prodId}`,
        cantidad: item.qty,
        precio_unitario: precio,
        subtotal: precio * item.qty,
        notas: item.notas,
      };
    });

    const total = detalles.reduce((sum, d) => sum + (d.subtotal || 0), 0);

    const newOrder: Order = {
      pedido_id: Date.now(),
      numero_orden: orderNum,
      tipo_entrega: tipo,
      numero_mesa: tipo === 'mesa' ? Math.floor(Math.random() * 8) + 1 : null,
      estado: 'cocina',
      total,
      metodo_pago: 'efectivo',
      creado_en: new Date().toISOString(),
      detalles,
    };

    mockOrders = [newOrder, ...mockOrders];
  },

  async createUser(data: {
    nombre_completo: string;
    nombre_usuario: string;
    rol_id: number;
    sucursal_id: number;
    correo?: string;
    telefono?: string;
    pin_rapido?: string;
    password: string;
  }): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return;
    } catch {
      // Fallback
    }

    const roleName = data.rol_id === 1 ? 'admin' : data.rol_id === 2 ? 'cajero' : 'cocina';
    const newUser: User = {
      usuario_id: Date.now(),
      nombre_completo: data.nombre_completo,
      nombre_usuario: data.nombre_usuario,
      rol_id: data.rol_id,
      rol_nombre: roleName,
      sucursal_id: data.sucursal_id,
      sucursal_nombre: 'Sucursal Central',
      tiene_pin: !!data.pin_rapido,
      activo: true,
      creado_en: new Date().toISOString(),
    };
    mockUsers = [...mockUsers, newUser];
  },

  async toggleUserActive(userId: number, newStatus: boolean): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/usuarios/${userId}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: newStatus }),
      });
      if (res.ok) return;
    } catch {
      // Fallback
    }
    mockUsers = mockUsers.map(u => (u.usuario_id === userId ? { ...u, activo: newStatus } : u));
  },
};
