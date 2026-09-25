import React, { useState } from 'react';
import { ShiftSummary, CashMovement } from '../types';
import { Coins, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';

interface ShiftHistoryProps {
  shift: ShiftSummary;
  movements: CashMovement[];
  onAddMovement: (tipo: 'INGRESO' | 'EGRESO', monto: number, concepto: string) => Promise<void>;
}

export const ShiftHistory: React.FC<ShiftHistoryProps> = ({ shift, movements, onAddMovement }) => {
  const [tipo, setTipo] = useState<'EGRESO' | 'INGRESO'>('EGRESO');
  const [monto, setMonto] = useState<string>('');
  const [concepto, setConcepto] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(monto);
    if (!num || num <= 0 || !concepto.trim()) return;

    setLoading(true);
    try {
      await onAddMovement(tipo, num, concepto.trim());
      setMonto('');
      setConcepto('');
    } finally {
      setLoading(false);
    }
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
      gap: 24
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
        }}>
          <Coins size={24} color="#FFF" />
        </div>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFF' }}>
            CAJA CHICA & CONTROL DE ARQUEO EN TURNO
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Registro fiel de compras de emergencia, inyección de cambio y conciliación
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 24,
        alignItems: 'start'
      }}>
        {/* Form: Registrar Movimiento */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF', marginBottom: 16 }}>
            Nuevo Movimiento de Caja Chica
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Tipo Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                onClick={() => setTipo('EGRESO')}
                className={`btn ${tipo === 'EGRESO' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '10px' }}
              >
                <ArrowUpRight size={16} />
                <span>Egreso / Gasto</span>
              </button>

              <button
                type="button"
                onClick={() => setTipo('INGRESO')}
                className={`btn ${tipo === 'INGRESO' ? 'btn-success' : 'btn-outline'}`}
                style={{ padding: '10px' }}
              >
                <ArrowDownLeft size={16} />
                <span>Ingreso Extra</span>
              </button>
            </div>

            {/* Monto */}
            <div className="input-group">
              <label className="input-label">Monto (Bs.)</label>
              <input
                type="number"
                step="0.01"
                min="0.10"
                className="input-field"
                placeholder="Ej. 35.50"
                value={monto}
                onChange={e => setMonto(e.target.value)}
                required
              />
            </div>

            {/* Concepto */}
            <div className="input-group">
              <label className="input-label">Concepto o Justificación</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej. Compra de carbón, hielo, flete..."
                value={concepto}
                onChange={e => setConcepto(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ marginTop: 8 }}
            >
              <Plus size={16} />
              <span>{loading ? 'Registrando...' : 'Registrar en Caja Chica'}</span>
            </button>
          </form>
        </div>

        {/* Live Arqueo Card */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <ShieldCheck size={20} color="var(--ready-text)" />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }}>
              Fórmula de Arqueo en Turno
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Fondo Inicial de Apertura</span>
              <span style={{ fontWeight: 700, color: '#FFF' }}>Bs. {shift.fondo_inicial.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ventas en Efectivo (Puro + Mixto)</span>
              <span style={{ fontWeight: 700, color: '#34D399' }}>+ Bs. {shift.total_efectivo.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ingresos Extra a Caja</span>
              <span style={{ fontWeight: 700, color: '#34D399' }}>+ Bs. {shift.total_ingresos_extra.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Egresos y Compras de Caja Chica</span>
              <span style={{ fontWeight: 700, color: '#F87171' }}>- Bs. {shift.total_egresos_gastos.toFixed(2)}</span>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>EFECTIVO TOTAL ESPERADO</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--ember-400)' }}>
                  Bs. {shift.efectivo_esperado.toFixed(2)}
                </div>
              </div>
              <span className="badge badge-ready">EN REGLA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF', marginBottom: 16 }}>
          Historial de Movimientos de Caja Chica
        </h3>

        {movements.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No se han registrado movimientos de caja chica en este turno.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: 12 }}>
                  <th style={{ padding: '10px 14px' }}>TIPO</th>
                  <th style={{ padding: '10px 14px' }}>CONCEPTO</th>
                  <th style={{ padding: '10px 14px' }}>MONTO</th>
                  <th style={{ padding: '10px 14px' }}>RESPONSABLE</th>
                  <th style={{ padding: '10px 14px' }}>HORA</th>
                </tr>
              </thead>
              <tbody>
                {movements.map(m => (
                  <tr key={m.movimiento_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px' }}>
                      <span className={`badge ${m.tipo === 'INGRESO' ? 'badge-ready' : 'badge-danger'}`}>
                        {m.tipo === 'INGRESO' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                        <span>{m.tipo}</span>
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: '#FFF', fontWeight: 600 }}>
                      {m.concepto}
                    </td>
                    <td style={{
                      padding: '14px',
                      fontWeight: 800,
                      color: m.tipo === 'INGRESO' ? '#34D399' : '#F87171'
                    }}>
                      {m.tipo === 'INGRESO' ? '+' : '-'} Bs. {m.monto.toFixed(2)}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                      {m.cajero_nombre || 'Cajero de Turno'}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {new Date(m.creado_en).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
