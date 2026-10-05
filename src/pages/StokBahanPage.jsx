import { useState, useMemo } from 'react';
import {
  Boxes, Plus, Search, Filter,
  CheckCircle, AlertTriangle, AlertCircle,
  RotateCcw, X, Edit2, Trash2, Tag, ChevronDown,
  Layers
} from 'lucide-react';

// ─── Dummy Data Stok Bahan Baku Erles Bakery ──────────────────────────────────

const initialIngredients = [
  {
    id: 1,
    kode: 'BHN-001',
    nama: 'Tepung Terigu Protein Tinggi',
    kategori: 'Tepung',
    stok: 15,
    satuan: 'kg',
    minimumStok: 25,
    status: 'Kritis',
  },
  {
    id: 2,
    kode: 'BHN-002',
    nama: 'Butter Unsalted (Mentega Tawar)',
    kategori: 'Lemak & Butter',
    stok: 4,
    satuan: 'kg',
    minimumStok: 10,
    status: 'Kritis',
  },
  {
    id: 3,
    kode: 'BHN-003',
    nama: 'Gula Pasir Kristal Putih',
    kategori: 'Pemanis',
    stok: 12,
    satuan: 'kg',
    minimumStok: 15,
    status: 'Menipis',
  },
  {
    id: 4,
    kode: 'BHN-004',
    nama: 'Ragi Instan Saf-Instant',
    kategori: 'Pengembang',
    stok: 3,
    satuan: 'box',
    minimumStok: 5,
    status: 'Menipis',
  },
  {
    id: 5,
    kode: 'BHN-005',
    nama: 'Coklat Batang Dark Couverture',
    kategori: 'Coklat & Topping',
    stok: 18,
    satuan: 'kg',
    minimumStok: 8,
    status: 'Aman',
  },
  {
    id: 6,
    kode: 'BHN-006',
    nama: 'Tepung Terigu Protein Sedang',
    kategori: 'Tepung',
    stok: 50,
    satuan: 'kg',
    minimumStok: 20,
    status: 'Aman',
  },
  {
    id: 7,
    kode: 'BHN-007',
    nama: 'Keju Cheddar Olahan',
    kategori: 'Dairy & Keju',
    stok: 10,
    satuan: 'block',
    minimumStok: 5,
    status: 'Aman',
  },
  {
    id: 8,
    kode: 'BHN-008',
    nama: 'Susu Cair UHT Full Cream',
    kategori: 'Dairy & Keju',
    stok: 28,
    satuan: 'liter',
    minimumStok: 12,
    status: 'Aman',
  },
];

const categoryList = [
  'Semua Kategori',
  'Tepung',
  'Lemak & Butter',
  'Pemanis',
  'Pengembang',
  'Coklat & Topping',
  'Dairy & Keju',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusBadge(status) {
  switch (status) {
    case 'Aman':
      return { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0', icon: CheckCircle };
    case 'Menipis':
      return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', icon: AlertCircle };
    case 'Kritis':
      return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', icon: AlertTriangle };
    default:
      return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0', icon: CheckCircle };
  }
}

// ─── Modal Tambah / Edit Bahan ────────────────────────────────────────────────

function IngredientFormModal({ item, onClose, onSave }) {
  const isEditing = Boolean(item);
  const [formData, setFormData] = useState({
    id: item?.id || Date.now(),
    kode: item?.kode || `BHN-00${Math.floor(10 + Math.random() * 90)}`,
    nama: item?.nama || '',
    kategori: item?.kategori || 'Tepung',
    stok: item?.stok !== undefined ? item.stok : '',
    satuan: item?.satuan || 'kg',
    minimumStok: item?.minimumStok !== undefined ? item.minimumStok : 10,
    status: item?.status || 'Aman',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || formData.stok === '') return;

    const stokNum = parseFloat(formData.stok) || 0;
    const minNum = parseFloat(formData.minimumStok) || 0;

    let autoStatus = 'Aman';
    if (stokNum <= minNum * 0.6) autoStatus = 'Kritis';
    else if (stokNum <= minNum) autoStatus = 'Menipis';

    onSave({
      ...formData,
      stok: stokNum,
      minimumStok: minNum,
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
        width: 'min(480px, calc(100vw - 40px))',
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
            <div style={{ fontSize: '12px', color: '#A5B4FC', fontWeight: '500' }}>Master Bahan Baku</div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#FFFFFF' }}>
              {isEditing ? 'Edit Data Bahan' : 'Tambah Bahan Baku Baru'}
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
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
              Nama Bahan Baku *
            </label>
            <input
              required
              type="text"
              placeholder="Contoh: Tepung Terigu Protein Tinggi"
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
                Kode Bahan
              </label>
              <input
                type="text"
                value={formData.kode}
                onChange={e => setFormData({ ...formData, kode: e.target.value })}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                Jumlah Stok *
              </label>
              <input
                required
                type="number"
                placeholder="10"
                value={formData.stok}
                onChange={e => setFormData({ ...formData, stok: e.target.value })}
                style={{
                  width: '100%', padding: '9px 10px', borderRadius: '8px',
                  border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                Minimum Stok
              </label>
              <input
                type="number"
                value={formData.minimumStok}
                onChange={e => setFormData({ ...formData, minimumStok: e.target.value })}
                style={{
                  width: '100%', padding: '9px 10px', borderRadius: '8px',
                  border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                Satuan
              </label>
              <select
                value={formData.satuan}
                onChange={e => setFormData({ ...formData, satuan: e.target.value })}
                style={{
                  width: '100%', padding: '9px 8px', borderRadius: '8px',
                  border: '1.5px solid #CBD5E1', fontSize: '13px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit', background: 'white',
                }}
              >
                <option value="kg">kg</option>
                <option value="gr">gr</option>
                <option value="liter">liter</option>
                <option value="box">box</option>
                <option value="block">block</option>
                <option value="pack">pack</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
              {isEditing ? 'Simpan Perubahan' : 'Tambah Bahan'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ─── Modal Hapus Bahan ────────────────────────────────────────────────────────

function DeleteModal({ item, onClose, onConfirm }) {
  if (!item) return null;

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
            Hapus Bahan Baku?
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.4' }}>
            Bahan <strong style={{ color: '#0F172A' }}>{item.nama}</strong> ({item.kode}) akan dihapus permanen dari sistem inventaris.
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
            onClick={() => onConfirm(item.id)}
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

export default function StokBahanPage() {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');

  const [modalState, setModalState] = useState({ isOpen: false, item: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 4 Summary Metrics Sesuai Task 3
  const totalBahan = ingredients.length;
  const bahanAman = ingredients.filter(i => i.status === 'Aman').length;
  const bahanMenipis = ingredients.filter(i => i.status === 'Menipis').length;
  const bahanKritis = ingredients.filter(i => i.status === 'Kritis').length;

  const handleSaveIngredient = (itemData) => {
    if (modalState.item) {
      setIngredients(prev => prev.map(i => i.id === itemData.id ? itemData : i));
    } else {
      setIngredients(prev => [itemData, ...prev]);
    }
  };

  const handleDeleteIngredient = (id) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
    setDeleteTarget(null);
  };

  const filteredIngredients = useMemo(() => {
    return ingredients.filter(item => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus === 'Semua Status' ? true : item.status === selectedStatus;
      const matchCategory = selectedCategory === 'Semua Kategori' ? true : item.kategori === selectedCategory;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [ingredients, searchTerm, selectedStatus, selectedCategory]);

  const hasFilter = searchTerm || selectedStatus !== 'Semua Status' || selectedCategory !== 'Semua Kategori';

  const resetFilter = () => {
    setSearchTerm('');
    setSelectedStatus('Semua Status');
    setSelectedCategory('Semua Kategori');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }}>

      {/* ── [A] HEADER STOK BAHAN ────────────────────────────────────── */}
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
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245,158,11,0.25)',
          }}>
            <Boxes size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              Inventaris Bahan Baku
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Pantau ketersediaan tepung, butter, gula, ragi, coklat, serta batas minimum stok bahan bakery.
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalState({ isOpen: true, item: null })}
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
          Tambah Bahan
        </button>
      </div>

      {/* ── [B] 4 SUMMARY CARDS (SESUAI INSTRUKSI) ───────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
      }}>
        {/* 1. Total Bahan */}
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
              Total Bahan
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>
              {totalBahan}
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
              Bahan baku terdaftar
            </div>
          </div>
        </div>

        {/* 2. Bahan Aman */}
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
              Bahan Aman
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>
              {bahanAman}
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
              Di atas batas minimum
            </div>
          </div>
        </div>

        {/* 3. Bahan Menipis */}
        <div style={{
          background: '#FFFFFF', borderRadius: '14px', padding: '20px 22px',
          border: '1px solid #E2E8F0', borderLeft: '4px solid #F59E0B',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{ background: '#FFFBEB', borderRadius: '12px', padding: '12px', display: 'flex' }}>
            <AlertCircle size={22} color="#F59E0B" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginBottom: '3px' }}>
              Bahan Menipis
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>
              {bahanMenipis}
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
              Mendekati batas aman
            </div>
          </div>
        </div>

        {/* 4. Bahan Kritis */}
        <div style={{
          background: '#FFFFFF', borderRadius: '14px', padding: '20px 22px',
          border: '1px solid #E2E8F0', borderLeft: '4px solid #EF4444',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{ background: '#FEF2F2', borderRadius: '12px', padding: '12px', display: 'flex' }}>
            <AlertTriangle size={22} color="#EF4444" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginBottom: '3px' }}>
              Bahan Kritis
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.4px' }}>
              {bahanKritis}
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
              Perlu segera belanja ulang
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
            placeholder="Cari nama bahan (Tepung, Butter, Ragi, dll) atau kode..."
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
            <option value="Aman">Aman</option>
            <option value="Menipis">Menipis</option>
            <option value="Kritis">Kritis</option>
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
          {filteredIngredients.length} dari {ingredients.length} bahan
        </div>
      </div>

      {/* ── [D] TABEL INVENTARIS BAHAN BAKU ─────────────────────────── */}
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
                <th style={{ padding: '13px 18px', textAlign: 'left', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Kode</th>
                <th style={{ padding: '13px 18px', textAlign: 'left', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: '220px' }}>Nama Bahan</th>
                <th style={{ padding: '13px 18px', textAlign: 'left', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Kategori</th>
                <th style={{ padding: '13px 18px', textAlign: 'center', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Jumlah Stok</th>
                <th style={{ padding: '13px 18px', textAlign: 'center', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Satuan</th>
                <th style={{ padding: '13px 18px', textAlign: 'center', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Minimum Stok</th>
                <th style={{ padding: '13px 18px', textAlign: 'center', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Status</th>
                <th style={{ padding: '13px 18px', textAlign: 'center', fontWeight: '700', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <Boxes size={28} color="#CBD5E1" />
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#94A3B8' }}>Bahan baku tidak ditemukan</div>
                      <div style={{ fontSize: '12.5px', color: '#CBD5E1' }}>Sesuaikan kata kunci pencarian atau filter status.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIngredients.map(item => {
                  const badge = getStatusBadge(item.status);
                  const Icon = badge.icon;

                  return (
                    <tr
                      key={item.id}
                      style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFAFF'}
                      onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                    >
                      {/* Kode */}
                      <td style={{ padding: '13px 18px', fontWeight: '700', color: '#6366F1', whiteSpace: 'nowrap' }}>
                        {item.kode}
                      </td>

                      {/* Nama Bahan */}
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '13.5px' }}>
                          {item.nama}
                        </div>
                      </td>

                      {/* Kategori */}
                      <td style={{ padding: '13px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-block', padding: '3px 8px', borderRadius: '6px',
                          background: '#F1F5F9', color: '#475569', fontSize: '12px', fontWeight: '600',
                        }}>
                          {item.kategori}
                        </span>
                      </td>

                      {/* Jumlah Stok */}
                      <td style={{ padding: '13px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontSize: '14px', fontWeight: '800',
                          color: item.status === 'Kritis' ? '#EF4444' : item.status === 'Menipis' ? '#D97706' : '#0F172A',
                        }}>
                          {item.stok}
                        </span>
                      </td>

                      {/* Satuan */}
                      <td style={{ padding: '13px 18px', textAlign: 'center', fontWeight: '600', color: '#64748B', fontSize: '12.5px' }}>
                        {item.satuan}
                      </td>

                      {/* Minimum Stok */}
                      <td style={{ padding: '13px 18px', textAlign: 'center', color: '#64748B', fontWeight: '600', fontSize: '13px' }}>
                        {item.minimumStok} {item.satuan}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '13px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '3px 10px', borderRadius: '20px',
                          background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`,
                          fontSize: '11.5px', fontWeight: '700',
                        }}>
                          <Icon size={12} />
                          {badge.label || item.status}
                        </span>
                      </td>

                      {/* Aksi: Edit & Hapus */}
                      <td style={{ padding: '13px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <button
                            onClick={() => setModalState({ isOpen: true, item: item })}
                            title="Edit Bahan"
                            style={{
                              padding: '6px', borderRadius: '6px',
                              background: '#EEF2FF', border: '1px solid #C7D2FE',
                              color: '#6366F1', cursor: 'pointer', display: 'flex',
                            }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            title="Hapus Bahan"
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
        {filteredIngredients.length > 0 && (
          <div style={{
            padding: '12px 20px', borderTop: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#FAFAFA', fontSize: '12.5px', color: '#64748B',
          }}>
            <span>Menampilkan <strong>{filteredIngredients.length}</strong> bahan baku</span>
            <span>Bahan Perlu Belanja Ulang: <strong style={{ color: '#EF4444' }}>{ingredients.filter(i => i.status === 'Kritis').length}</strong> item</span>
          </div>
        )}
      </div>

      {/* Modal Form Tambah / Edit */}
      {modalState.isOpen && (
        <IngredientFormModal
          item={modalState.item}
          onClose={() => setModalState({ isOpen: false, item: null })}
          onSave={handleSaveIngredient}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteIngredient}
        />
      )}

    </div>
  );
}
