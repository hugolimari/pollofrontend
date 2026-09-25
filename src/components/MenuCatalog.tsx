import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Search, CheckCircle2, XCircle, UtensilsCrossed } from 'lucide-react';

interface MenuCatalogProps {
  products: Product[];
  categories: Category[];
  onToggleStock: (productId: number, newStock: boolean) => void;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({ products, categories, onToggleStock }) => {
  const [selectedCat, setSelectedCat] = useState<number | 'todos'>('todos');
  const [search, setSearch] = useState<string>('');

  const filtered = products.filter(p => {
    const matchCat = selectedCat === 'todos' || p.categoria_id === selectedCat;
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || 
                        (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

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
            background: 'var(--ember-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px var(--ember-glow)'
          }}>
            <UtensilsCrossed size={24} color="#FFF" />
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFF' }}>
              GESTIÓN DE CATÁLOGO & DISPONIBILIDAD
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Pausa o habilita platos en tiempo real si se terminan en cocina
            </p>
          </div>
        </div>

        {/* Search Field */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 38 }}
          />
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
        <button
          onClick={() => setSelectedCat('todos')}
          className={`btn ${selectedCat === 'todos' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: 13 }}
        >
          Todos ({products.length})
        </button>

        {categories.map(cat => {
          const count = products.filter(p => p.categoria_id === cat.categoria_id).length;
          return (
            <button
              key={cat.categoria_id}
              onClick={() => setSelectedCat(cat.categoria_id)}
              className={`btn ${selectedCat === cat.categoria_id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              {cat.nombre} ({count})
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 20
      }}>
        {filtered.map(product => (
          <div
            key={product.producto_id}
            className="glass-panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              opacity: product.disponible ? 1 : 0.65,
              border: product.disponible ? '1px solid var(--border-subtle)' : '1px solid rgba(239, 68, 68, 0.4)'
            }}
          >
            {/* Image Banner */}
            <div style={{
              height: 160,
              background: '#0B0F19',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {product.imagen_url ? (
                <img
                  src={product.imagen_url}
                  alt={product.nombre}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    (e.target as any).style.display = 'none';
                  }}
                />
              ) : null}

              {/* Status Badge */}
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <span className={`badge ${product.disponible ? 'badge-ready' : 'badge-danger'}`}>
                  {product.disponible ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>{product.disponible ? 'Disponible' : 'Agotado'}</span>
                </span>
              </div>

              {/* Price Tag */}
              <div style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                background: 'rgba(14, 19, 31, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-heading)',
                fontSize: 18,
                fontWeight: 900,
                color: 'var(--ember-400)'
              }}>
                Bs. {product.precio.toFixed(2)}
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {product.categoria_nombre || 'Menú Principal'}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFF' }}>
                {product.nombre}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>
                {product.descripcion || 'Especialidad preparada al momento.'}
              </p>
            </div>

            {/* Toggle Button */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)'
            }}>
              <button
                onClick={() => onToggleStock(product.producto_id, !product.disponible)}
                className={`btn ${product.disponible ? 'btn-outline' : 'btn-success'}`}
                style={{ width: '100%', fontSize: 13 }}
              >
                {product.disponible ? (
                  <>
                    <XCircle size={15} color="#F87171" />
                    <span>Marcar como Agotado</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Re-habilitar Disponibilidad</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
