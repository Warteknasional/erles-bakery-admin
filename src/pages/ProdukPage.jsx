import { useState, useMemo } from 'react';
import {
  ShoppingBag, Plus, Search, Filter,
  RotateCcw, X, Edit2, Trash2, Tag, ChevronDown,
  AlertTriangle
} from 'lucide-react';

// ─── Dummy Data Master Produk Erles Bakery ────────────────────────────────────

const initialProducts = [
  {
    id: 1,
    nama: 'Roti Coklat Klasik',
    sku: 'ROT-CKL-001',
    kategori: 'Roti Manis',
    hargaJual: 12000,
    hpp: 6500,
    stok: 25,
    status: 'Tersedia',
    emoji: '🍞',
  },
  {
    id: 2,
    nama: 'Butter Croissant Premium',
    sku: 'PST-CRS-002',
    kategori: 'Croissant & Pastry',
    hargaJual: 22000,
    hpp: 11000,
    stok: 15,
    status: 'Tersedia',
    emoji: '🥐',
  },
  {
    id: 3,
    nama: 'Roti Sobek Keju Spesial',
    sku: 'ROT-KJU-003',
    kategori: 'Roti Manis',
    hargaJual: 28000,
    hpp: 15000,
    stok: 12,
    status: 'Tersedia',
    emoji: '🧀',
  },
  {
    id: 4,
    nama: 'Donat Coklat Meses Glazed',
    sku: 'DNT-CKL-004',
    kategori: 'Donat',
    hargaJual: 9000,
    hpp: 4500,
    stok: 30,
    status: 'Tersedia',
    emoji: '🍩',
  },
  {
    id: 5,
    nama: 'Signature Strawberry Tart Cake 20cm',
    sku: 'CAK-STR-005',
    kategori: 'Cake',
    hargaJual: 280000,
    hpp: 160000,
    stok: 3,
    status: 'Tersedia',
    emoji: '🎂',
  },
  {
    id: 6,
    nama: 'Roti Tawar Gandum Whole Wheat',
    sku: 'ROT-GND-006',
    kategori: 'Roti Tawar',
    hargaJual: 20000,
    hpp: 11500,
    stok: 0,
    status: 'Sold Out',
    emoji: '🍞',
  },
  {
    id: 7,
    nama: 'Bolu Gulung Moka Meses',
    sku: 'CAK-MOK-007',
    kategori: 'Cake',
    hargaJual: 65000,
    hpp: 35000,
    stok: 8,
    status: 'Tersedia',
    emoji: '🍰',
  },
  {
    id: 8,
    nama: 'French Sourdough Loaf Artisan',
    sku: 'ART-SRD-008',
    kategori: 'Artisan Bread',
    hargaJual: 35000,
    hpp: 18000,
    stok: 0,
    status: 'Sold Out',
    emoji: '🥖',
  },
  {
    id: 9,
    nama: 'Hampers Spesial Lebaran Box Exclusive',
    sku: 'HMP-LBR-009',
    kategori: 'Hampers',
    hargaJual: 350000,
    hpp: 210000,
    stok: 5,
    status: 'Tersedia',
    emoji: '🎁',
  },
  {
    id: 10,
    nama: 'Kue Semprit Keju Edam Toples',
    sku: 'KRG-SMP-010',
    kategori: 'Kue Kering',
    hargaJual: 85000,
    hpp: 48000,
    stok: 0,
    status: 'Tidak Aktif',
    emoji: '🍪',
  },
];

const categoryList = [
  'Semua Kategori',
  'Roti Manis',
  'Roti Tawar',
  'Croissant & Pastry',
  'Donat',
  'Cake',
  'Artisan Bread',
  'Hampers',
  'Kue Kering',
];

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(num);
}

function getStatusBadge(status) {
  switch (status) {
    case 'Tersedia':
      return {
        bg: '#F0FDF4',
        text: '#166534',
        dot: '#16A34A',
      };
    case 'Sold Out':
      return {
        bg: '#FEF2F2',
        text: '#991B1B',
        dot: '#DC2626',
      };
    case 'Tidak Aktif':
      return {
        bg: '#F5F5F4',
        text: '#78716C',
        dot: '#A8A29E',
      };
    default:
      return {
        bg: '#FAF7F2',
        text: '#5C4A3C',
        dot: '#8C7A6B',
      };
  }
}

// ─── Modal Form Tambah / Edit Produk ──────────────────────────────────────────

function ProductFormModal({ product, onClose, onSave }) {
  const isEditing = Boolean(product);
  const [formData, setFormData] = useState({
    id: product ? product.id : Date.now(),
    nama: product ? product.nama : '',
    sku: product ? product.sku : `PRD-00${Math.floor(Math.random() * 90 + 10)}`,
    kategori: product ? product.kategori : 'Roti Manis',
    hargaJual: product ? product.hargaJual : '',
    hpp: product ? product.hpp : '',
    stok: product ? product.stok : '',
    status: product ? product.status : 'Tersedia',
    emoji: product ? product.emoji : '🍞',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const jual = parseFloat(formData.hargaJual) || 0;
    const hpp = parseFloat(formData.hpp) || 0;
    const stk = parseInt(formData.stok, 10) || 0;

    let computedStatus = formData.status;
    if (stk === 0 && computedStatus === 'Tersedia') {
      computedStatus = 'Sold Out';
    }

    onSave({
      ...formData,
      hargaJual: jual,
      hpp,
      stok: stk,
      status: computedStatus,
    });
    onClose();
  };

  const fieldStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #E6DED4',
    background: '#FFFFFF',
    fontSize: '13px',
    color: '#241B14',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6E5D4F',
    marginBottom: '5px',
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 1099,
        background: 'rgba(36, 27, 20, 0.45)', backdropFilter: 'blur(2px)',
      }} />
      <div style={{
        position: 'fixed', zIndex: 1100,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(460px, calc(100vw - 32px))',
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E6DED4',
        boxShadow: '0 16px 40px rgba(36, 27, 20, 0.14)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #EFEAE3',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#241B14', margin: '0 0 2px' }}>
              {isEditing ? 'Perbarui Data Produk' : 'Tambah Produk Baru ke Etalase'}
            </h2>
            <p style={{ fontSize: '12px', color: '#8C7A6B', margin: 0 }}>
              Katalog roti, kue, dan pastry Erles Bakery
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#8C7A6B',
            cursor: 'pointer', padding: '4px', borderRadius: '4px',
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Nama Produk *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Roti Coklat Klasik"
              value={formData.nama}
              onChange={e => setFormData({ ...formData, nama: e.target.value })}
              style={fieldStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Kategori</label>
              <select
                value={formData.kategori}
                onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                style={{ ...fieldStyle, cursor: 'pointer' }}
              >
                {categoryList.filter(c => c !== 'Semua Kategori').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Harga Jual (Rp) *</label>
              <input
                type="number"
                required
                value={formData.hargaJual}
                onChange={e => setFormData({ ...formData, hargaJual: e.target.value })}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>HPP Modal (Rp)</label>
              <input
                type="number"
                value={formData.hpp}
                onChange={e => setFormData({ ...formData, hpp: e.target.value })}
                style={fieldStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Stok (pcs) *</label>
              <input
                type="number"
                required
                value={formData.stok}
                onChange={e => setFormData({ ...formData, stok: e.target.value })}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                style={{ ...fieldStyle, cursor: 'pointer' }}
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Sold Out">Sold Out</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Ikon Produk</label>
              <select
                value={formData.emoji}
                onChange={e => setFormData({ ...formData, emoji: e.target.value })}
                style={{ ...fieldStyle, cursor: 'pointer' }}
              >
                <option value="🍞">🍞 Roti</option>
                <option value="🥐">🥐 Croissant</option>
                <option value="🧀">🧀 Keju</option>
                <option value="🍩">🍩 Donat</option>
                <option value="🎂">🎂 Cake</option>
                <option value="🍰">🍰 Slice</option>
                <option value="🥖">🥖 Baguette</option>
                <option value="🎁">🎁 Hampers</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: '1px solid #E6DED4',
                background: '#FFFFFF', color: '#5C4A3C', fontSize: '13px', fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 18px', borderRadius: '8px', border: 'none',
                background: '#241B14', color: '#FFFFFF', fontSize: '13px', fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {isEditing ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ─── Modal Konfirmasi Hapus Produk ────────────────────────────────────────────

function DeleteModal({ product, onClose, onConfirm }) {
  if (!product) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 1099,
        background: 'rgba(36, 27, 20, 0.45)', backdropFilter: 'blur(2px)',
      }} />
      <div style={{
        position: 'fixed', zIndex: 1100,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(360px, calc(100vw - 32px))',
        background: '#FFFFFF', borderRadius: '12px',
        border: '1px solid #E6DED4',
        boxShadow: '0 16px 40px rgba(36, 27, 20, 0.14)',
        padding: '24px 24px 20px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          background: '#FEF2F2', margin: '0 auto 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AlertTriangle size={22} color="#DC2626" />
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#241B14', margin: '0 0 6px' }}>
          Hapus Produk?
        </h3>
        <p style={{ fontSize: '13px', color: '#6E5D4F', margin: '0 0 16px', lineHeight: 1.4 }}>
          Produk <strong>{product.nama}</strong> ({product.sku}) akan dihapus permanen dari daftar etalase.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: '1px solid #E6DED4',
              background: '#FFFFFF', color: '#5C4A3C', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
          <button
            onClick={() => { onConfirm(product.id); onClose(); }}
            style={{
              padding: '8px 18px', borderRadius: '8px', border: 'none',
              background: '#DC2626', color: '#FFFFFF', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function ProdukPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');

  const [modalState, setModalState] = useState({ isOpen: false, product: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Metrics
  const totalProduk   = products.length;
  const totalTersedia = products.filter(p => p.status === 'Tersedia').length;
  const totalSoldOut  = products.filter(p => p.status === 'Sold Out').length;
  const avgMargin     = Math.round(
    products.reduce((acc, p) => acc + ((p.hargaJual - p.hpp) / p.hargaJual), 0) / (products.length || 1) * 100
  );

  const handleSaveProduct = (prodData) => {
    if (modalState.product) {
      setProducts(prev => prev.map(p => p.id === prodData.id ? prodData : p));
    } else {
      setProducts(prev => [prodData, ...prev]);
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteTarget(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'Semua Kategori' ? true : p.kategori === selectedCategory;
      const matchStatus = selectedStatus === 'Semua Status' ? true : p.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const hasFilter = searchTerm || selectedCategory !== 'Semua Kategori' || selectedStatus !== 'Semua Status';

  const resetFilter = () => {
    setSearchTerm('');
    setSelectedCategory('Semua Kategori');
    setSelectedStatus('Semua Status');
  };

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      color: '#241B14',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>

      {/* ── [1] HEADER ──────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '4px',
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#8C7A6B',
            fontWeight: '600',
            letterSpacing: '0.02em',
            marginBottom: '4px',
          }}>
            <span>ERLES BAKERY</span>
            <span style={{ color: '#D4C5B9' }}>/</span>
            <span>KATALOG ETALASE & PRODUK</span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#241B14',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
          }}>
            Katalog Produk & Harga Jual
          </h1>

          <div style={{ fontSize: '13px', color: '#6E5D4F' }}>
            <span>{totalTersedia} produk siap jual di etalase</span>
            <span style={{ color: '#D4C5B9', margin: '0 8px' }}>•</span>
            {totalSoldOut > 0 ? (
              <span style={{ color: '#DC2626', fontWeight: '600' }}>
                {totalSoldOut} varian habis (sold out)
              </span>
            ) : (
              <span style={{ color: '#166534', fontWeight: '500' }}>
                ✓ Tidak ada produk habis
              </span>
            )}
            <span style={{ color: '#D4C5B9', margin: '0 8px' }}>•</span>
            <span>Rata-rata margin kotor toko {avgMargin}%</span>
          </div>
        </div>

        <button
          onClick={() => setModalState({ isOpen: true, product: null })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: 'none',
            background: '#241B14',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#3D2D22'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#241B14'; }}
        >
          <Plus size={15} />
          Tambah Produk
        </button>
      </div>

      {/* ── [2] UNIFIED METRIC STRIP ─────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E6DED4',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
      }}>
        {/* Metric 1: Total Produk */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Total Katalog Produk
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {totalProduk} <span style={{ fontSize: '14px', fontWeight: '500', color: '#8C7A6B' }}>varian</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Koleksi roti, cake & pastry
          </div>
        </div>

        {/* Metric 2: Tersedia */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Siap Jual di Etalase
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#166534',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {totalTersedia} <span style={{ fontSize: '14px', fontWeight: '500', color: '#8C7A6B' }}>produk</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Stok etalase tersedia
          </div>
        </div>

        {/* Metric 3: Sold Out */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Habis (Sold Out)
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: totalSoldOut > 0 ? '#DC2626' : '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {totalSoldOut} <span style={{ fontSize: '14px', fontWeight: '500', color: '#8C7A6B' }}>varian</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Perlu jadwal baking ulang
          </div>
        </div>

        {/* Metric 4: Rata-rata Margin Laba */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Rata-rata Margin Laba
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {avgMargin}%
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Margin kotor harga jual vs HPP
          </div>
        </div>
      </div>

      {/* ── [3] FILTER CONTROLS ──────────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E6DED4',
        padding: '14px 18px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center',
        boxShadow: '0 1px 2px rgba(36,27,20,0.02)',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9C8B7E' }} />
          <input
            type="text"
            placeholder="Cari nama produk (Croissant, Roti Coklat...) atau SKU..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              border: '1px solid #E6DED4',
              borderRadius: '7px',
              fontSize: '13px',
              color: '#241B14',
              outline: 'none',
              boxSizing: 'border-box',
              background: '#FAF7F2',
            }}
          />
        </div>

        {/* Filter Kategori */}
        <div style={{ minWidth: '160px' }}>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #E6DED4',
              borderRadius: '7px',
              fontSize: '12.5px',
              color: '#4A3B30',
              background: '#FAF7F2',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {categoryList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Filter Status */}
        <div style={{ minWidth: '140px' }}>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #E6DED4',
              borderRadius: '7px',
              fontSize: '12.5px',
              color: '#4A3B30',
              background: '#FAF7F2',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Sold Out">Sold Out</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
        </div>

        {/* Reset Filter */}
        {hasFilter && (
          <button
            onClick={resetFilter}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '7px 11px',
              borderRadius: '7px',
              border: '1px solid #E6DED4',
              background: '#FFFFFF',
              color: '#7D6B5C',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}

        {/* Counter */}
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#8C7A6B' }}>
          {filteredProducts.length} dari {products.length} produk
        </div>
      </div>

      {/* ── [4] TABEL MASTER PRODUK ──────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E6DED4',
        boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            textAlign: 'left',
          }}>
            <thead>
              <tr style={{
                background: '#FAF7F2',
                borderBottom: '1px solid #E6DED4',
                color: '#6E5D4F',
                fontSize: '12px',
                fontWeight: '600',
              }}>
                <th style={{ padding: '11px 18px', width: '50px' }}>Item</th>
                <th style={{ padding: '11px 18px' }}>Nama Produk</th>
                <th style={{ padding: '11px 18px' }}>SKU</th>
                <th style={{ padding: '11px 18px' }}>Kategori</th>
                <th style={{ padding: '11px 18px', textAlign: 'right' }}>Harga Jual</th>
                <th style={{ padding: '11px 18px', textAlign: 'right' }}>HPP</th>
                <th style={{ padding: '11px 18px', textAlign: 'center' }}>Stok</th>
                <th style={{ padding: '11px 18px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '11px 18px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <ShoppingBag size={28} color="#D4C5B9" />
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#7D6B5C' }}>
                        Tidak ada produk ditemukan
                      </div>
                      <div style={{ fontSize: '12px', color: '#9C8B7E' }}>
                        Sesuaikan kata kunci pencarian atau reset filter.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(prod => {
                  const badge = getStatusBadge(prod.status);
                  const marginLaba = prod.hargaJual - prod.hpp;

                  return (
                    <tr
                      key={prod.id}
                      style={{
                        borderBottom: '1px solid #F3EDE6',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAF7F2'}
                      onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                    >
                      {/* Emoji Icon */}
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '6px',
                          background: '#F7F3EE', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', fontSize: '17px',
                          border: '1px solid #EAE4DC',
                        }}>
                          {prod.emoji}
                        </div>
                      </td>

                      {/* Nama Produk */}
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ fontWeight: '600', color: '#241B14' }}>
                          {prod.nama}
                        </div>
                        <div style={{ fontSize: '11px', color: '#8C7A6B', marginTop: '1px' }}>
                          Margin kotor: {formatRupiah(marginLaba)}
                        </div>
                      </td>

                      {/* SKU */}
                      <td style={{
                        padding: '12px 18px',
                        color: '#6E5D4F',
                        fontWeight: '600',
                        fontSize: '12px',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}>
                        {prod.sku}
                      </td>

                      {/* Kategori */}
                      <td style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          background: '#F7F3EE',
                          color: '#5C4A3C',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          {prod.kategori}
                        </span>
                      </td>

                      {/* Harga Jual */}
                      <td style={{
                        padding: '12px 18px',
                        textAlign: 'right',
                        fontWeight: '700',
                        color: '#241B14',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}>
                        {formatRupiah(prod.hargaJual)}
                      </td>

                      {/* HPP */}
                      <td style={{
                        padding: '12px 18px',
                        textAlign: 'right',
                        color: '#6E5D4F',
                        fontSize: '12.5px',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}>
                        {formatRupiah(prod.hpp)}
                      </td>

                      {/* Stok */}
                      <td style={{
                        padding: '12px 18px',
                        textAlign: 'center',
                        fontWeight: '700',
                        color: prod.stok === 0 ? '#DC2626' : '#241B14',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}>
                        {prod.stok} <span style={{ fontSize: '11px', fontWeight: '400', color: '#8C7A6B' }}>pcs</span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: badge.bg,
                          color: badge.text,
                          fontSize: '11.5px',
                          fontWeight: '600',
                        }}>
                          <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: badge.dot,
                          }} />
                          {prod.status}
                        </span>
                      </td>

                      {/* Aksi: Edit & Hapus */}
                      <td style={{ padding: '12px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => setModalState({ isOpen: true, product: prod })}
                            title="Edit Produk"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#6E5D4F',
                              cursor: 'pointer',
                              padding: '3px',
                              borderRadius: '4px',
                              transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#241B14'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#6E5D4F'; }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(prod)}
                            title="Hapus Produk"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#9C8B7E',
                              cursor: 'pointer',
                              padding: '3px',
                              borderRadius: '4px',
                              transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#DC2626'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#9C8B7E'; }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filteredProducts.length > 0 && (
          <div style={{
            padding: '12px 18px',
            borderTop: '1px solid #E6DED4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FAF7F2',
            fontSize: '12px',
            color: '#7D6B5C',
          }}>
            <span>Menampilkan {filteredProducts.length} produk etalase</span>
            <span>Total Potensi Nilai Stok: <strong>{formatRupiah(filteredProducts.reduce((s, p) => s + (p.stok * p.hargaJual), 0))}</strong></span>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalState.isOpen && (
        <ProductFormModal
          product={modalState.product}
          onClose={() => setModalState({ isOpen: false, product: null })}
          onSave={handleSaveProduct}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteProduct}
        />
      )}

    </div>
  );
}
