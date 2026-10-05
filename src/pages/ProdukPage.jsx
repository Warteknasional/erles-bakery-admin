import { useState, useMemo } from 'react';
import {
  ShoppingBag, Plus, Search, Filter,
  CheckCircle, XCircle, Slash, Layers,
  ChevronDown, RotateCcw, X, Edit2, Trash2,
  AlertTriangle, Tag
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
    hargaJual: 250000,
    hpp: 140000,
    stok: 0,
    status: 'Sold Out',
    emoji: '🎂',
  },
  {
    id: 6,
    nama: 'Black Forest Cake Slice',
    sku: 'CAK-BFS-006',
    kategori: 'Cake',
    hargaJual: 35000,
    hpp: 18000,
    stok: 8,
    status: 'Tersedia',
    emoji: '🍰',
  },
  {
    id: 7,
    nama: 'Roti Gandum Utuh (Whole Wheat)',
    sku: 'ROT-WHT-007',
    kategori: 'Roti Tawar',
    hargaJual: 26000,
    hpp: 14000,
    stok: 0,
    status: 'Sold Out',
    emoji: '🥖',
  },
  {
    id: 8,
    nama: 'Hampers Spesial Kue Kering Box',
    sku: 'HMP-SPS-008',
    kategori: 'Hampers',
    hargaJual: 320000,
    hpp: 195000,
    stok: 0,
    status: 'Tidak Aktif',
    emoji: '🎁',
  },
];

const categoryList = [
  'Semua Kategori',
  'Roti Manis',
  'Croissant & Pastry',
  'Donat',
  'Cake',
  'Roti Tawar',
  'Hampers',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(num);
}

function getStatusBadge(status) {
  switch (status) {
    case 'Tersedia':
      return { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0', icon: CheckCircle };
    case 'Sold Out':
      return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', icon: XCircle };
    case 'Tidak Aktif':
      return { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1', icon: Slash };
    default:
      return { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1', icon: CheckCircle };
  }
}

// ─── Modal Tambah / Edit Produk ───────────────────────────────────────────────

function ProductFormModal({ product, onClose, onSave }) {
  const isEditing = Boolean(product);
  const [formData, setFormData] = useState({
    id: product?.id || Date.now(),
    nama: product?.nama || '',
    sku: product?.sku || `ROT-${Math.floor(100 + Math.random() * 900)}`,
    kategori: product?.kategori || 'Roti Manis',
    hargaJual: product?.hargaJual || '',
    hpp: product?.hpp || '',
    stok: product?.stok !== undefined ? product.stok : '',
    status: product?.status || 'Tersedia',
    emoji: product?.emoji || '🍞',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.hargaJual) return;

    const stokNum = parseInt(formData.stok, 10) || 0;
    let autoStatus = formData.status;
    if (formData.status !== 'Tidak Aktif') {
      autoStatus = stokNum === 0 ? 'Sold Out' : 'Tersedia';
    }

    onSave({
      ...formData,
      hargaJual: Number(formData.hargaJual),
      hpp: Number(formData.hpp) || Math.round(Number(formData.hargaJual) * 0.55),
      stok: stokNum,
      status: autoStatus,
    });
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(3px)',
      }} />

      <div style={{
        position: 'fixed', zIndex: 1000,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(500px, calc(100vw - 40px))',
        background: '#FFFFFF', borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.20)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #F1F5F9',
          background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#A5B4FC', fontWeight: '500' }}>Katalog Produk Erles Bakery</div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#FFFFFF' }}>
              {isEditing ? 'Edit Data Produk' : 'Tambah Produk Baru'}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '8px',
            width: '32px', height: '32px', color: 'white', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '70vh', overflowY: 'auto' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
              Nama Produk *
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Roti Keju Spesial"
              value={formData.nama}
              onChange={e => setFormData({ ...formData, nama: e.target.value })}
              style={{
                width: '100%', padding: '9px 12px', borderRadius: '8px',
                border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                Kode SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: '8px',
                  border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                Kategori
              </label>
              <select
                value={formData.kategori}
                onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: '8px',
                  border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit', background: 'white',
                }}
              >
                {categoryList.filter(c => c !== 'Semua Kategori').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                Harga Jual (Rp) *
              </label>
              <input
                required
                type="number"
                placeholder="25000"
                value={formData.hargaJual}
                onChange={e => setFormData({ ...formData, hargaJual: e.target.value })}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: '8px',
                  border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                HPP Modal (Rp)
              </label>
              <input
                type="number"
                placeholder="14000"
                value={formData.hpp}
                onChange={e => setFormData({ ...formData, hpp: e.target.value })}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: '8px',
                  border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                Jumlah Stok
              </label>
              <input
                type="number"
                placeholder="20"
                value={formData.stok}
                onChange={e => setFormData({ ...formData, stok: e.target.value })}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: '8px',
                  border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                Status Produk
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: '8px',
                  border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit', background: 'white',
                }}
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Sold Out">Sold Out</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
              Ikon Roti / Cake
            </label>
            <select
              value={formData.emoji}
              onChange={e => setFormData({ ...formData, emoji: e.target.value })}
              style={{
                width: '100%', padding: '9px 12px', borderRadius: '8px',
                border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit', background: 'white',
              }}
            >
              <option value="🍞">🍞 Roti Tawar / Manis</option>
              <option value="🥐">🥐 Croissant</option>
              <option value="🧀">🧀 Roti Keju</option>
              <option value="🍩">🍩 Donat</option>
              <option value="🎂">🎂 Cake & Tart</option>
              <option value="🍰">🍰 Slice Cake</option>
              <option value="🥖">🥖 Baguette</option>
              <option value="🎁">🎁 Hampers</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px', borderRadius: '8px',
                border: '1.5px solid #E2E8F0', background: 'white',
                color: '#64748B', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 22px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366F1, #4338CA)',
                border: 'none', color: 'white', fontWeight: '700',
                fontSize: '13px', cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(99,102,241,0.3)',
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

// ─── Modal Konfirmasi Hapus ───────────────────────────────────────────────────

function DeleteModal({ product, onClose, onConfirm }) {
  if (!product) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 1099,
        background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(3px)',
      }} />

      <div style={{
        position: 'fixed', zIndex: 1100,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(380px, calc(100vw - 40px))',
        background: '#FFFFFF', borderRadius: '14px',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.18)',
        padding: '28px 24px', textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
      }}>
        <div style={{
          width: '50px', height: '50px', borderRadius: '50%',
          background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AlertTriangle size={24} color="#EF4444" />
        </div>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B', margin: '0 0 6px' }}>
            Hapus Produk?
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.4' }}>
            Produk <strong style={{ color: '#0F172A' }}>{product.nama}</strong> ({product.sku}) akan dihapus permanen dari katalog.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 18px', borderRadius: '8px',
              border: '1.5px solid #E2E8F0', background: 'white',
              color: '#64748B', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
            }}
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(product.id)}
            style={{
              padding: '9px 20px', borderRadius: '8px',
              background: '#EF4444', color: 'white', border: 'none',
              fontWeight: '700', fontSize: '13px', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(239,68,68,0.3)',
            }}
          >
            Hapus
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProdukPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');

  const [modalState, setModalState] = useState({ isOpen: false, product: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Summary Metrics Sesuai Instruksi
  const totalAktif = products.filter(p => p.status !== 'Tidak Aktif').length;
  const totalTersedia = products.filter(p => p.status === 'Tersedia').length;
  const totalSoldOut = products.filter(p => p.status === 'Sold Out').length;
  const totalTidakAktif = products.filter(p => p.status === 'Tidak Aktif').length;

  const handleSaveProduct = (prodData) => {
    if (modalState.product) {
      // Edit
      setProducts(prev => prev.map(p => p.id === prodData.id ? prodData : p));
    } else {
      // Create
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }}>

      {/* ── [A] HEADER KATALOG PRODUK ────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px 28px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1, #312E81)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
          }}>
            <ShoppingBag size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              Katalog Produk
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Master produk bakery untuk mengelola roti, kue, harga jual, estimasi HPP, dan stok etalase.
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalState({ isOpen: true, product: null })}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366F1, #4338CA)',
            color: 'white', border: 'none', fontWeight: '700',
            fontSize: '13.5px', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
            transition: 'all 0.15s ease', fontFamily: 'inherit',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={17} />
          Tambah Produk
        </button>
      </div>

      {/* ── [B] 4 SUMMARY CARDS (SESUAI INSTRUKSI) ───────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
      }}>
        {/* 1. Total Produk Aktif */}
        <div style={{
          background: '#FFFFFF', borderRadius: '14px', padding: '20px 22px',
          border: '1px solid #E2E8F0', borderLeft: '4px solid #6366F1',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{ background: '#EEF2FF', borderRadius: '12px', padding: '12px', display: 'flex' }}>
            <Layers size={22} color="#6366F1" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginBottom: '3px' }}>
              Total Produk Aktif
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>
              {totalAktif}
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
              Siap tampil di katalog
            </div>
          </div>
        </div>

        {/* 2. Produk Tersedia */}
        <div style={{
          background: '#FFFFFF', borderRadius: '14px', padding: '20px 22px',
          border: '1px solid #E2E8F0', borderLeft: '4px solid #10B981',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{ background: '#ECFDF5', borderRadius: '12px', padding: '12px', display: 'flex' }}>
            <CheckCircle size={22} color="#10B981" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginBottom: '3px' }}>
              Produk Tersedia
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>
              {totalTersedia}
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
              Stok tersedia di rak
            </div>
          </div>
        </div>

        {/* 3. Produk Sold Out */}
        <div style={{
          background: '#FFFFFF', borderRadius: '14px', padding: '20px 22px',
          border: '1px solid #E2E8F0', borderLeft: '4px solid #EF4444',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{ background: '#FEF2F2', borderRadius: '12px', padding: '12px', display: 'flex' }}>
            <XCircle size={22} color="#EF4444" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginBottom: '3px' }}>
              Produk Sold Out
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>
              {totalSoldOut}
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
              Stok kosong saat ini
            </div>
          </div>
        </div>

        {/* 4. Produk Tidak Aktif */}
        <div style={{
          background: '#FFFFFF', borderRadius: '14px', padding: '20px 22px',
          border: '1px solid #E2E8F0', borderLeft: '4px solid #64748B',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{ background: '#F1F5F9', borderRadius: '12px', padding: '12px', display: 'flex' }}>
            <Slash size={22} color="#64748B" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginBottom: '3px' }}>
              Produk Tidak Aktif
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>
              {totalTidakAktif}
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
              Arsip / menu musiman
            </div>
          </div>
        </div>
      </div>

      {/* ── [C] FILTER & SEARCH BAR ──────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Cari nama produk (Roti Coklat, Croissant, dll) atau SKU..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 38px',
              border: '1.5px solid #E2E8F0', borderRadius: '9px',
              fontSize: '13.5px', outline: 'none', boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Filter Kategori */}
        <div style={{ position: 'relative', minWidth: '170px' }}>
          <Tag size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              width: '100%', padding: '9px 30px 9px 32px',
              border: '1.5px solid #E2E8F0', borderRadius: '9px',
              fontSize: '13px', outline: 'none', appearance: 'none',
              background: 'white', cursor: 'pointer', fontFamily: 'inherit',
              color: selectedCategory !== 'Semua Kategori' ? '#1E293B' : '#64748B',
            }}
          >
            {categoryList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }} />
        </div>

        {/* Filter Status */}
        <div style={{ position: 'relative', minWidth: '150px' }}>
          <Filter size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{
              width: '100%', padding: '9px 30px 9px 32px',
              border: '1.5px solid #E2E8F0', borderRadius: '9px',
              fontSize: '13px', outline: 'none', appearance: 'none',
              background: 'white', cursor: 'pointer', fontFamily: 'inherit',
              color: selectedStatus !== 'Semua Status' ? '#1E293B' : '#64748B',
            }}
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Sold Out">Sold Out</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }} />
        </div>

        {/* Reset Filter */}
        {hasFilter && (
          <button
            onClick={resetFilter}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '9px 12px', borderRadius: '8px',
              border: '1.5px solid #EEF2FF', background: '#EEF2FF',
              color: '#6366F1', fontSize: '12.5px', fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}

        <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#94A3B8' }}>
          {filteredProducts.length} dari {products.length} produk
        </div>
      </div>

      {/* ── [D] TABEL MASTER PRODUK ──────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '13px 18px', textAlign: 'left', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px', width: '60px' }}>Foto</th>
                <th style={{ padding: '13px 18px', textAlign: 'left', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Nama Produk</th>
                <th style={{ padding: '13px 18px', textAlign: 'left', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>SKU</th>
                <th style={{ padding: '13px 18px', textAlign: 'left', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Kategori</th>
                <th style={{ padding: '13px 18px', textAlign: 'right', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Harga Jual</th>
                <th style={{ padding: '13px 18px', textAlign: 'right', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>HPP</th>
                <th style={{ padding: '13px 18px', textAlign: 'center', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Stok</th>
                <th style={{ padding: '13px 18px', textAlign: 'center', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Status</th>
                <th style={{ padding: '13px 18px', textAlign: 'center', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '48px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <ShoppingBag size={28} color="#CBD5E1" />
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#94A3B8' }}>Tidak ada produk ditemukan</div>
                      <div style={{ fontSize: '12.5px', color: '#CBD5E1' }}>Sesuaikan kata kunci pencarian atau filter status.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(prod => {
                  const badge = getStatusBadge(prod.status);
                  const Icon = badge.icon;
                  const marginLaba = prod.hargaJual - prod.hpp;

                  return (
                    <tr
                      key={prod.id}
                      style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFAFF'}
                      onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                    >
                      {/* Foto Dummy */}
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '10px',
                          background: '#F8FAFC', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                          border: '1px solid #E2E8F0',
                        }}>
                          {prod.emoji}
                        </div>
                      </td>

                      {/* Nama Produk */}
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '14px' }}>
                          {prod.nama}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '1px' }}>
                          Margin laba kotor: {formatRupiah(marginLaba)}
                        </div>
                      </td>

                      {/* SKU */}
                      <td style={{ padding: '12px 18px', color: '#6366F1', fontWeight: '600', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                        {prod.sku}
                      </td>

                      {/* Kategori */}
                      <td style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-block', padding: '3px 8px', borderRadius: '6px',
                          background: '#F1F5F9', color: '#475569', fontSize: '12px', fontWeight: '600',
                        }}>
                          {prod.kategori}
                        </span>
                      </td>

                      {/* Harga Jual */}
                      <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: '800', color: '#0F172A', whiteSpace: 'nowrap' }}>
                        {formatRupiah(prod.hargaJual)}
                      </td>

                      {/* HPP */}
                      <td style={{ padding: '12px 18px', textAlign: 'right', color: '#64748B', fontWeight: '500', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {formatRupiah(prod.hpp)}
                      </td>

                      {/* Stok */}
                      <td style={{ padding: '12px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontSize: '14px', fontWeight: '800',
                          color: prod.stok === 0 ? '#EF4444' : '#0F172A',
                        }}>
                          {prod.stok}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '3px' }}>pcs</span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '3px 10px', borderRadius: '20px',
                          background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`,
                          fontSize: '11.5px', fontWeight: '700',
                        }}>
                          <Icon size={12} />
                          {prod.status}
                        </span>
                      </td>

                      {/* Aksi: Edit & Hapus */}
                      <td style={{ padding: '12px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <button
                            onClick={() => setModalState({ isOpen: true, product: prod })}
                            title="Edit Produk"
                            style={{
                              padding: '6px', borderRadius: '6px',
                              background: '#EEF2FF', border: '1px solid #C7D2FE',
                              color: '#6366F1', cursor: 'pointer', display: 'flex',
                            }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(prod)}
                            title="Hapus Produk"
                            style={{
                              padding: '6px', borderRadius: '6px',
                              background: '#FEF2F2', border: '1px solid #FECACA',
                              color: '#EF4444', cursor: 'pointer', display: 'flex',
                            }}
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
            padding: '12px 20px', borderTop: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#FAFAFA', fontSize: '12.5px', color: '#64748B',
          }}>
            <span>Menampilkan <strong>{filteredProducts.length}</strong> produk</span>
            <span>Total Potensi Nilai Stok: <strong>{formatRupiah(filteredProducts.reduce((s, p) => s + (p.stok * p.hargaJual), 0))}</strong></span>
          </div>
        )}
      </div>

      {/* Modal Form Tambah / Edit */}
      {modalState.isOpen && (
        <ProductFormModal
          product={modalState.product}
          onClose={() => setModalState({ isOpen: false, product: null })}
          onSave={handleSaveProduct}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
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
