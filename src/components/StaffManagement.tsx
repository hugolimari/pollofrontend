import React, { useState } from 'react';
import { User, Role } from '../types';
import { Users, UserPlus, Shield, KeyRound, Check, X } from 'lucide-react';

interface StaffManagementProps {
  users: User[];
  onCreateUser: (data: { nombre_completo: string; nombre_usuario: string; rol_id: number; sucursal_id: number; correo?: string; telefono?: string; pin_rapido?: string; password: string }) => Promise<void>;
  onToggleStatus: (userId: number, newStatus: boolean) => Promise<void>;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({ users, onCreateUser, onToggleStatus }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [nombre, setNombre] = useState<string>('');
  const [usuario, setUsuario] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [rolId, setRolId] = useState<number>(2); // 2: cajero por defecto
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !usuario.trim() || !password.trim()) return;

    setLoading(true);
    try {
      await onCreateUser({
        nombre_completo: nombre.trim(),
        nombre_usuario: usuario.trim(),
        password: password.trim(),
        pin_rapido: pin.trim() || undefined,
        rol_id: rolId,
        sucursal_id: 1
      });
      setShowModal(false);
      setNombre('');
      setUsuario('');
      setPassword('');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (rol: Role) => {
    if (rol === 'admin') {
      return <span className="badge badge-ready" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#F87171' }}>ADMINISTRADOR</span>;
    }
    if (rol === 'cajero') {
      return <span className="badge badge-ready">CAJERO / POS</span>;
    }
    return <span className="badge badge-prep" style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#FBBF24' }}>COCINA / KDS</span>;
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
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
          }}>
            <Users size={24} color="#FFF" />
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFF' }}>
              GESTIÓN DE PERSONAL & ROLES (RBAC)
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Administra cuentas de cajeros, operadores de cocina y accesos de administración
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <UserPlus size={16} />
          <span>Nuevo Empleado</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: 12 }}>
                <th style={{ padding: '12px 14px' }}>EMPLEADO</th>
                <th style={{ padding: '12px 14px' }}>USUARIO</th>
                <th style={{ padding: '12px 14px' }}>ROL ASIGNADO</th>
                <th style={{ padding: '12px 14px' }}>PIN RÁPIDO</th>
                <th style={{ padding: '12px 14px' }}>ESTADO</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.usuario_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '16px 14px' }}>
                    <div style={{ fontWeight: 800, color: '#FFF' }}>{u.nombre_completo}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.sucursal_nombre || 'Sucursal Centro'}</div>
                  </td>
                  <td style={{ padding: '16px 14px', fontFamily: 'var(--font-mono)', color: 'var(--ember-400)' }}>
                    @{u.nombre_usuario}
                  </td>
                  <td style={{ padding: '16px 14px' }}>
                    {getRoleBadge(u.rol_nombre)}
                  </td>
                  <td style={{ padding: '16px 14px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: u.tiene_pin ? 'var(--ready-text)' : 'var(--text-muted)'
                    }}>
                      <KeyRound size={14} />
                      <span>{u.tiene_pin ? 'Configurado' : 'Sin PIN'}</span>
                    </span>
                  </td>
                  <td style={{ padding: '16px 14px' }}>
                    <span className={`badge ${u.activo ? 'badge-ready' : 'badge-danger'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                    <button
                      onClick={() => onToggleStatus(u.usuario_id, !u.activo)}
                      className={`btn ${u.activo ? 'btn-outline' : 'btn-success'}`}
                      style={{ padding: '6px 12px', fontSize: 12 }}
                    >
                      {u.activo ? 'Desactivar' : 'Reactivar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear Empleado */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: 20
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: 480,
            background: 'var(--bg-surface)',
            padding: 28,
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-medium)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Shield size={22} color="var(--ember-400)" />
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFF' }}>
                  Registrar Nuevo Empleado
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline btn-icon"
                style={{ width: 32, height: 32 }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="input-group">
                <label className="input-label">Nombre Completo</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. Roberto Morales"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Nombre de Usuario (Login)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. roberto.caja"
                  value={usuario}
                  onChange={e => setUsuario(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Contraseña de Acceso</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">PIN Rápido Numérico (Opcional - 4 dígitos)</label>
                <input
                  type="text"
                  maxLength={6}
                  className="input-field"
                  placeholder="Ej. 1234"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Rol del Sistema</label>
                <select
                  className="input-field"
                  value={rolId}
                  onChange={e => setRolId(parseInt(e.target.value, 10))}
                  style={{ cursor: 'pointer' }}
                >
                  <option value={2}>Cajero (Terminal POS, Cobros, Arqueo)</option>
                  <option value={3}>Cocina (Monitor KDS de Comandas)</option>
                  <option value={1}>Administrador (Control Total & Reportes)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <Check size={16} />
                  <span>{loading ? 'Creando...' : 'Crear Usuario'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
