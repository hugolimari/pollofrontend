import React from 'react';
import { DashboardMetrics, ShiftSummary, Order } from '../types';
import { 
  TrendingUp, 
  ShoppingBag, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Coins, 
  Clock, 
  ChefHat, 
  CheckCircle2 
} from 'lucide-react';

interface DashboardProps {
  metrics: DashboardMetrics;
  shift: ShiftSummary;
  recentOrders: Order[];
}

export const Dashboard: React.FC<DashboardProps> = ({ metrics, shift, recentOrders }) => {
  const totalPagos = (metrics.ventasEfectivo + metrics.ventasTarjeta + metrics.ventasQr) || 1;
  const pctEfectivo = Math.round((metrics.ventasEfectivo / totalPagos) * 100);
  const pctTarjeta = Math.round((metrics.ventasTarjeta / totalPagos) * 100);
  const pctQr = Math.round((metrics.ventasQr / totalPagos) * 100);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      maxWidth: 1600,
      margin: '0 auto',
      width: '100%',
      gap: 24
    }}>
      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20
      }}>
        {/* KPI 1: Ventas Hoy */}
        <div className="glass-panel" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '16px',
            background: 'var(--ember-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px var(--ember-glow)'
          }}>
            <TrendingUp size={28} color="#FFF" />
          </div>
          <div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
              Ventas Totales Hoy
            </span>
            <h3 style={{ fontSize: 30, fontWeight: 900, color: '#FFF' }}>
              Bs. {metrics.totalVentasHoy.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* KPI 2: Pedidos Cobrados */}
        <div className="glass-panel" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
          }}>
            <ShoppingBag size={28} color="#FFF" />
          </div>
          <div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
              Órdenes Cobradas
            </span>
            <h3 style={{ fontSize: 30, fontWeight: 900, color: '#FFF' }}>
              {metrics.totalPedidosHoy} pedidos
            </h3>
          </div>
        </div>

        {/* KPI 3: Ticket Promedio */}
        <div className="glass-panel" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
          }}>
            <Coins size={28} color="#FFF" />
          </div>
          <div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
              Ticket Promedio
            </span>
            <h3 style={{ fontSize: 30, fontWeight: 900, color: '#FFF' }}>
              Bs. {metrics.ticketPromedio.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* KPI 4: En Cocina / Activos */}
        <div className="glass-panel" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
          }}>
            <ChefHat size={28} color="#FFF" />
          </div>
          <div>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
              En Cocina / Listos
            </span>
            <h3 style={{ fontSize: 30, fontWeight: 900, color: '#FFF' }}>
              {metrics.pedidosEnCocina} / {metrics.pedidosListos}
            </h3>
          </div>
        </div>
      </div>

      {/* Middle Section: Payment Methods + Cash Register Status */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: 20
      }}>
        {/* Payment Methods Distribution */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF', marginBottom: 16 }}>
            Recaudación por Método de Pago
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Visual Bar */}
            <div style={{
              height: 12,
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface)',
              overflow: 'hidden',
              display: 'flex'
            }}>
              <div style={{ width: `${pctEfectivo}%`, background: '#10B981' }} title={`Efectivo ${pctEfectivo}%`}></div>
              <div style={{ width: `${pctQr}%`, background: '#F59E0B' }} title={`QR ${pctQr}%`}></div>
              <div style={{ width: `${pctTarjeta}%`, background: '#3B82F6' }} title={`Tarjeta ${pctTarjeta}%`}></div>
            </div>

            {/* Breakdown Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div style={{
                background: 'var(--bg-surface)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34D399', fontSize: 12, fontWeight: 700 }}>
                  <Banknote size={15} />
                  <span>Efectivo ({pctEfectivo}%)</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#FFF', marginTop: 4 }}>
                  Bs. {metrics.ventasEfectivo.toFixed(2)}
                </div>
              </div>

              <div style={{
                background: 'var(--bg-surface)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FBBF24', fontSize: 12, fontWeight: 700 }}>
                  <QrCode size={15} />
                  <span>QR ({pctQr}%)</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#FFF', marginTop: 4 }}>
                  Bs. {metrics.ventasQr.toFixed(2)}
                </div>
              </div>

              <div style={{
                background: 'var(--bg-surface)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#60A5FA', fontSize: 12, fontWeight: 700 }}>
                  <CreditCard size={15} />
                  <span>Tarjeta ({pctTarjeta}%)</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#FFF', marginTop: 4 }}>
                  Bs. {metrics.ventasTarjeta.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Register Shift Info */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }}>
                Arqueo de Turno Actual
              </h3>
              <span className="badge badge-ready" style={{ fontSize: 11 }}>
                TURNO ABIERTO #{shift.turno_id}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 12 }}>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Cajero Responsable</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#FFF' }}>{shift.cajero_nombre}</div>
              </div>

              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Fondo Inicial</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#FFF' }}>Bs. {shift.fondo_inicial.toFixed(2)}</div>
              </div>

              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Gastos de Caja Chica</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#F87171' }}>- Bs. {shift.total_egresos_gastos.toFixed(2)}</div>
              </div>

              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ingresos Extra</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#34D399' }}>+ Bs. {shift.total_ingresos_extra.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                Efectivo Físico Esperado en Gaveta
              </span>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--ember-400)' }}>
                Bs. {shift.efectivo_esperado.toFixed(2)}
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
              Incluye fondo base,<br />ventas y gastos
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF', marginBottom: 16 }}>
          Últimas Órdenes del Turno
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: 12 }}>
                <th style={{ padding: '10px 14px' }}>TICKET</th>
                <th style={{ padding: '10px 14px' }}>TIPO</th>
                <th style={{ padding: '10px 14px' }}>PRODUCTOS</th>
                <th style={{ padding: '10px 14px' }}>TOTAL</th>
                <th style={{ padding: '10px 14px' }}>ESTADO</th>
                <th style={{ padding: '10px 14px' }}>HORA</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.slice(0, 6).map(order => (
                <tr key={order.pedido_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#FFF', fontSize: 16 }}>
                    #{order.numero_orden}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                    {order.tipo_entrega === 'mesa' ? (order.numero_mesa ? `Mesa ${order.numero_mesa}` : 'Salón') : 'Para Llevar'}
                  </td>
                  <td style={{ padding: '14px', color: '#FFF' }}>
                    {order.detalles.map(d => `${d.cantidad}x ${d.producto_nombre}`).join(', ')}
                  </td>
                  <td style={{ padding: '14px', fontWeight: 800, color: 'var(--ember-400)' }}>
                    Bs. {order.total.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge ${order.estado === 'listo' ? 'badge-ready' : order.estado === 'entregado' ? 'badge-delivered' : 'badge-prep'}`}>
                      {order.estado === 'listo' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      <span>{order.estado}</span>
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    {new Date(order.creado_en).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
