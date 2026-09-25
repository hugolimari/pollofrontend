import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Minus, X, Check, ShoppingBag, Utensils } from 'lucide-react';

interface NewOrderModalProps {
  products: Product[];
  onClose: () => void;
  onCreateOrder: (orderNum: number, tipo: 'mesa' | 'para_llevar', items: { prodId: number; qty: number; notas?: string }[]) => Promise<void>;
  nextOrderNumber: number;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ products, onClose, onCreateOrder, nextOrderNumber }) => {
  const [tipo, setTipo] = useState<'mesa' | 'para_llevar'>('mesa');
  const [selectedItems, setSelectedItems] = useState<{ [prodId: number]: { qty: number; notas: string } }>({
    2: { qty: 2, notas: 'Bien doradas con salsa aparte' },
    5: { qty: 2, notas: 'Bien frías' }
  });
  const [loading, setLoading] = useState<boolean>(false);

  const addItem = (prodId: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [prodId]: {
        qty: (prev[prodId]?.qty || 0) + 1,
        notas: prev[prodId]?.notas || ''
      }
    }));
  };

  const removeItem = (prodId: number) => {
    setSelectedItems(prev => {
      const current = prev[prodId]?.qty || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[prodId];
        return copy;
      }
      return {
        ...prev,
        [prodId]: {
          ...prev[prodId],
          qty: current - 1
        }
      };
    });
  };

  const updateNotes = (prodId: number, notas: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [prodId]: {
        ...prev[prodId],
        notas
      }
    }));
  };

  const calculateTotal = () => {
    return Object.entries(selectedItems).reduce((sum, [idStr, data]) => {
      const p = products.find(prod => prod.producto_id === parseInt(idStr, 10));
      return sum + (p ? p.precio * data.qty : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemsList = Object.entries(selectedItems)
      .filter(([, data]) => data.qty > 0)
      .map(([idStr, data]) => ({
        prodId: parseInt(idStr, 10),
        qty: data.qty,
        notas: data.notas || undefined
      }));

    if (itemsList.length === 0) return;

    setLoading(true);
    try {
      await onCreateOrder(nextOrderNumber, tipo, itemsList);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: 20
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: 620,
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        padding: 28,
        border: '1px solid var(--border-medium)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ember-400)', letterSpacing: '0.05em' }}>
              SIMULADOR DE PEDIDO POS
            </span>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#FFF' }}>
              Crear Nuevo Pedido #{nextOrderNumber}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-icon" style={{ width: 34, height: 34 }}>
            <X size={18} />
          </button>
        </div>

        {/* Tipo de Entrega */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button
            type="button"
            onClick={() => setTipo('mesa')}
            className={`btn ${tipo === 'mesa' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '12px' }}
          >
            <Utensils size={18} />
            <span>Consumo en Salón</span>
          </button>

          <button
            type="button"
            onClick={() => setTipo('para_llevar')}
            className={`btn ${tipo === 'para_llevar' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '12px' }}
          >
            <ShoppingBag size={18} />
            <span>Para Llevar</span>
          </button>
        </div>

        {/* Product Selector List */}
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>
            Seleccionar Productos del Menú:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260, overflowY: 'auto', paddingRight: 6 }}>
            {products.filter(p => p.disponible).map(prod => {
              const inCart = selectedItems[prod.producto_id];
              return (
                <div
                  key={prod.producto_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: inCart ? 'rgba(255, 106, 0, 0.08)' : 'var(--bg-input)',
                    border: inCart ? '1px solid var(--border-active)' : '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFF', fontSize: 14 }}>
                      {prod.nombre}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ember-400)', fontWeight: 800 }}>
                      Bs. {prod.precio.toFixed(2)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {inCart ? (
                      <>
                        <button
                          type="button"
                          onClick={() => removeItem(prod.producto_id)}
                          className="btn btn-secondary btn-icon"
                          style={{ width: 30, height: 30 }}
                        >
                          <Minus size={14} />
                        </button>

                        <span style={{ fontWeight: 800, fontSize: 15, minWidth: 20, textAlign: 'center' }}>
                          {inCart.qty}
                        </span>

                        <button
                          type="button"
                          onClick={() => addItem(prod.producto_id)}
                          className="btn btn-primary btn-icon"
                          style={{ width: 30, height: 30 }}
                        >
                          <Plus size={14} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addItem(prod.producto_id)}
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: 12 }}
                      >
                        <Plus size={14} />
                        <span>Agregar</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes for Kitchen */}
        {Object.entries(selectedItems).length > 0 && (
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Notas de Cocina por Ítem:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(selectedItems).map(([idStr, data]) => {
                const prod = products.find(p => p.producto_id === parseInt(idStr, 10));
                if (!prod) return null;
                return (
                  <div key={idStr} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#FFF', width: 140, flexShrink: 0 }}>
                      {data.qty}x {prod.nombre}:
                    </span>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Ej. Pechuga bien cocida, sin ají..."
                      value={data.notas}
                      onChange={e => updateNotes(prod.producto_id, e.target.value)}
                      style={{ flex: 1, padding: '6px 10px', fontSize: 12 }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer with Total and Submit */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 16,
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total a Pagar</span>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--ember-400)' }}>
              Bs. {calculateTotal().toFixed(2)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || Object.keys(selectedItems).length === 0}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: 15 }}
            >
              <Check size={18} />
              <span>{loading ? 'Enviando...' : 'Enviar a Cocina'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
