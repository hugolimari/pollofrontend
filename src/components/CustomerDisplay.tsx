import React from 'react';
import { Order } from '../types';
import { Bell, Clock, CheckCircle2, Volume2, Sparkles } from 'lucide-react';
import { soundService } from '../services/speech';

interface CustomerDisplayProps {
  orders: Order[];
  onOrderDelivered: (orderId: number) => void;
}

export const CustomerDisplay: React.FC<CustomerDisplayProps> = ({ orders, onOrderDelivered }) => {
  const readyOrders = orders.filter(o => o.estado === 'listo');
  const prepOrders = orders.filter(o => o.estado === 'cocina' || o.estado === 'en_cocina');

  const handleTestAnnouncement = (orderNum: number) => {
    soundService.announceOrderReady(orderNum);
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
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'linear-gradient(90deg, rgba(255, 106, 0, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '16px',
            background: 'var(--ready-gradient, linear-gradient(135deg, #10B981 0%, #059669 100%))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px var(--ready-glow)'
          }}>
            <Bell size={26} color="#FFF" />
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFF', letterSpacing: '-0.02em' }}>
              PANTALLA DE PEDIDOS Y LLAMADA A CLIENTES
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Verifica el número de tu ticket. Cuando tu orden esté en verde, ¡acércate a recogerla en mostrador!
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
            Modo Pantalla Completa activo para televisores
          </span>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 1.4fr)',
        gap: 24,
        flex: 1
      }}>
        {/* Left Column: EN PREPARACIÓN */}
        <div className="glass-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          background: 'rgba(17, 24, 39, 0.85)',
          borderTop: '4px solid var(--prep-text)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            paddingBottom: 14,
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={24} color="var(--prep-text)" />
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--prep-text)' }}>
                EN PREPARACIÓN
              </h3>
            </div>
            <span className="badge badge-prep" style={{ fontSize: 14, padding: '6px 14px' }}>
              {prepOrders.length} {prepOrders.length === 1 ? 'pedido' : 'pedidos'}
            </span>
          </div>

          {prepOrders.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              gap: 8
            }}>
              <Sparkles size={36} color="var(--text-muted)" />
              <p style={{ fontSize: 16 }}>No hay pedidos en cola actualmente</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 14,
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 280px)',
              paddingRight: 6
            }}>
              {prepOrders.map(order => (
                <div
                  key={order.pedido_id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--prep-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    TICKET
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 42,
                    fontWeight: 900,
                    color: 'var(--prep-text)',
                    lineHeight: 1.1
                  }}>
                    #{order.numero_orden}
                  </span>
                  <span style={{
                    fontSize: 11,
                    marginTop: 4,
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {order.tipo_entrega === 'mesa' ? (order.numero_mesa ? `Mesa ${order.numero_mesa}` : 'En Salón') : 'Para Llevar'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: ¡LISTO PARA RECOGER! */}
        <div className="glass-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '4px solid var(--ready-text)',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.15)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            paddingBottom: 14,
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={28} color="var(--ready-text)" />
              <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--ready-text)', letterSpacing: '-0.01em' }}>
                ¡LISTO PARA RECOGER!
              </h3>
            </div>
            <span className="badge badge-ready" style={{ fontSize: 15, padding: '6px 16px' }}>
              {readyOrders.length} {readyOrders.length === 1 ? 'listo' : 'listos'}
            </span>
          </div>

          {readyOrders.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              gap: 12
            }}>
              <Bell size={44} color="var(--text-muted)" />
              <p style={{ fontSize: 18, fontWeight: 600 }}>Esperando pedidos listos desde la cocina...</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Los pedidos listos aparecerán aquí automáticamente y serán llamados por los parlantes.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: 18,
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 280px)',
              paddingRight: 6
            }}>
              {readyOrders.map((order, idx) => (
                <div
                  key={order.pedido_id}
                  className={idx === 0 ? 'animate-pulse-glow' : ''}
                  style={{
                    background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    border: '2px solid var(--ready-text)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '24px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: '0 8px 30px rgba(16, 185, 129, 0.25)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <span style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: 'var(--ready-text)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}>
                    ¡RECOGER AHORA!
                  </span>

                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 68,
                    fontWeight: 900,
                    color: '#FFF',
                    lineHeight: 1,
                    textShadow: '0 0 20px var(--ready-glow)',
                    margin: '8px 0'
                  }}>
                    #{order.numero_orden}
                  </span>

                  <span style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: 12
                  }}>
                    {order.tipo_entrega === 'mesa' ? (order.numero_mesa ? `Mesa ${order.numero_mesa}` : 'Consumo en Salón') : 'Para Llevar'}
                  </span>

                  {/* Actions for counter / test */}
                  <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                    <button
                      onClick={() => handleTestAnnouncement(order.numero_orden)}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '6px 10px', fontSize: 11 }}
                      title="Volver a llamar por voz"
                    >
                      <Volume2 size={13} />
                      <span>Re-Llamar</span>
                    </button>

                    <button
                      onClick={() => onOrderDelivered(order.pedido_id)}
                      className="btn btn-success"
                      style={{ flex: 1, padding: '6px 10px', fontSize: 11 }}
                      title="Marcar como entregado"
                    >
                      <span>Entregar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Marquee Footer for Restaurant Announcements */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 14,
        color: 'var(--text-secondary)',
        fontWeight: 600
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ready-text)' }}></span>
          <span>Por favor tenga a mano su ticket de compra al retirar su comida en el mostrador.</span>
        </div>
        <div style={{ color: 'var(--ember-400)', fontWeight: 700 }}>
          ¡Pollo que hace pollo · Sabor garantizado en cada presa!
        </div>
      </div>
    </div>
  );
};
