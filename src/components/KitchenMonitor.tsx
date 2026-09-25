import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { ChefHat, Check, Clock, AlertTriangle, Utensils, ShoppingBag } from 'lucide-react';
import { soundService } from '../services/speech';

interface KitchenMonitorProps {
  orders: Order[];
  onUpdateStatus: (orderId: number, newStatus: OrderStatus) => void;
}

export const KitchenMonitor: React.FC<KitchenMonitorProps> = ({ orders, onUpdateStatus }) => {
  const [filter, setFilter] = useState<'cocina' | 'listo' | 'todos'>('cocina');
  const [, setTick] = useState(0);

  // Update timer ticks every 15s to refresh elapsed time
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  const filteredOrders = orders.filter(o => {
    if (filter === 'cocina') return o.estado === 'cocina' || o.estado === 'en_cocina';
    if (filter === 'listo') return o.estado === 'listo';
    return o.estado !== 'cancelado';
  });

  const getElapsedTimeMinutes = (createdDateStr: string): number => {
    const created = new Date(createdDateStr).getTime();
    const now = Date.now();
    return Math.floor((now - created) / 60000);
  };

  const handleMarkReady = (order: Order) => {
    onUpdateStatus(order.pedido_id, 'listo');
    soundService.announceOrderReady(order.numero_orden);
  };

  const handleMarkDelivered = (order: Order) => {
    onUpdateStatus(order.pedido_id, 'entregado');
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      maxWidth: 1600,
      margin: '0 auto',
      width: '100%',
      gap: 20
    }}>
      {/* Header and Filter Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
          }}>
            <ChefHat size={24} color="#FFF" />
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFF' }}>
              MONITOR DE COMANDAS & COCINA (KDS)
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Flujo en tiempo real para cocineros y despachadores
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          padding: 4,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          gap: 6
        }}>
          <button
            onClick={() => setFilter('cocina')}
            className={`btn ${filter === 'cocina' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            <span>En Cocina ({orders.filter(o => o.estado === 'cocina' || o.estado === 'en_cocina').length})</span>
          </button>
          <button
            onClick={() => setFilter('listo')}
            className={`btn ${filter === 'listo' ? 'btn-success' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            <span>Listos ({orders.filter(o => o.estado === 'listo').length})</span>
          </button>
          <button
            onClick={() => setFilter('todos')}
            className={`btn ${filter === 'todos' ? 'btn-secondary' : 'btn-outline'}`}
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            <span>Todos</span>
          </button>
        </div>
      </div>

      {/* Grid of Kitchen Order Cards */}
      {filteredOrders.length === 0 ? (
        <div className="glass-panel" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
          gap: 14,
          color: 'var(--text-muted)'
        }}>
          <ChefHat size={48} />
          <h3 style={{ fontSize: 20, color: 'var(--text-secondary)' }}>No hay pedidos en este estado</h3>
          <p style={{ fontSize: 14 }}>Las nuevas comandas tomadas desde el mostrador aparecerán aquí al instante.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 20,
          alignItems: 'start'
        }}>
          {filteredOrders.map(order => {
            const mins = getElapsedTimeMinutes(order.creado_en);
            const isLate = mins >= 15;
            const isWarning = mins >= 8 && mins < 15;
            const isReady = order.estado === 'listo';

            return (
              <div
                key={order.pedido_id}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderTop: `5px solid ${isReady ? 'var(--ready-text)' : isLate ? '#EF4444' : isWarning ? 'var(--prep-text)' : 'var(--ember-500)'}`,
                  background: isReady ? 'rgba(16, 185, 129, 0.04)' : 'rgba(21, 29, 45, 0.85)'
                }}
              >
                {/* Order Card Header */}
                <div style={{
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'rgba(255, 255, 255, 0.02)'
                }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Comanda
                    </span>
                    <h3 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.1, color: '#FFF' }}>
                      #{order.numero_orden}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    {/* Delivery Type Badge */}
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: order.tipo_entrega === 'mesa' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                      color: order.tipo_entrega === 'mesa' ? '#60A5FA' : '#FB923C',
                      border: `1px solid ${order.tipo_entrega === 'mesa' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(249, 115, 22, 0.3)'}`
                    }}>
                      {order.tipo_entrega === 'mesa' ? <Utensils size={13} /> : <ShoppingBag size={13} />}
                      <span>{order.tipo_entrega === 'mesa' ? (order.numero_mesa ? `Mesa ${order.numero_mesa}` : 'Salón') : 'Para Llevar'}</span>
                    </span>

                    {/* Time Counter Badge */}
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 800,
                      color: isLate ? '#EF4444' : isWarning ? '#F59E0B' : 'var(--text-secondary)'
                    }}>
                      {isLate && <AlertTriangle size={13} />}
                      <Clock size={13} />
                      <span>{mins} min</span>
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  {order.detalles.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        paddingBottom: 10,
                        borderBottom: idx < order.detalles.length - 1 ? '1px dashed var(--border-subtle)' : 'none'
                      }}
                    >
                      {/* Quantity Pill */}
                      <span style={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 15,
                        fontWeight: 800,
                        color: 'var(--ember-400)',
                        flexShrink: 0
                      }}>
                        {item.cantidad}x
                      </span>

                      {/* Item Name & Notes */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#FFF' }}>
                          {item.producto_nombre}
                        </div>
                        {item.notas && (
                          <div style={{
                            display: 'inline-block',
                            marginTop: 4,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#FCD34D'
                          }}>
                            Nota: {item.notas}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Action Footer */}
                <div style={{
                  padding: '14px 16px',
                  background: 'var(--bg-surface)',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: 10
                }}>
                  {!isReady ? (
                    <button
                      onClick={() => handleMarkReady(order)}
                      className="btn btn-success"
                      style={{ flex: 1, padding: '12px' }}
                    >
                      <Check size={18} />
                      <span>¡Marcar Listo! (Llamar)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkDelivered(order)}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '12px' }}
                    >
                      <Check size={18} />
                      <span>Completar / Entregar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
