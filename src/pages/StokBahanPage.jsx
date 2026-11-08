import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Boxes, Plus, Search, Filter,
  CheckCircle2, AlertTriangle, AlertCircle,
  RotateCcw, X, Edit2, Trash2, Tag, ChevronDown,
  RefreshCw, Clock
} from 'lucide-react';
import Pagination from '../components/common/Pagination';
import { ingredientService } from '../services/ingredientService';
import useToast from '../hooks/useToast';

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
    nama: 'Susu UHT Full Cream',
    kategori: 'Dairy & Telur',
    stok: 24,
    satuan: 'liter',
    minimumStok: 12,
    status: 'Aman',
  },
  {
    id: 7,
    kode: 'BHN-007',
    nama: 'Telur Ayam Segar',
    kategori: 'Dairy & Telur',
    stok: 8,
    satuan: 'kg',
    minimumStok: 10,
    status: 'Menipis',
  },
  {
    id: 8,
    kode: 'BHN-008',
    nama: 'Keju Cheddar Blok Kraft',
    kategori: 'Dairy & Telur',
    stok: 6,
    satuan: 'block',
    minimumStok: 5,
    status: 'Aman',
  },
  {
    id: 9,
    kode: 'BHN-009',
    nama: 'Vanili Bubuk Ekstrak',
    kategori: 'Perisa & Pewarna',
    stok: 10,
    satuan: 'pack',
    minimumStok: 4,
    status: 'Aman',
  },
  {
    id: 10,
    kode: 'BHN-010',
    nama: 'Garam Laut Halus Murni (Sea Salt)',
    kategori: 'Pemanis',
    stok: 20,
    satuan: 'kg',
    minimumStok: 5,
    status: 'Aman',
  },
  {
    id: 11,
    kode: 'BHN-011',
    nama: 'Choco Chips Semi-Sweet Callebaut',
    kategori: 'Coklat & Topping',
    stok: 14,
    satuan: 'kg',
    minimumStok: 6,
    status: 'Aman',
  },
  {
    id: 12,
    kode: 'BHN-012',
    nama: 'Baking Powder Double Acting',
    kategori: 'Pengembang',
    stok: 2,
    satuan: 'can',
    minimumStok: 4,
    status: 'Kritis',
  },
  {
    id: 13,
    kode: 'BHN-013',
    nama: 'Almond Slice Panggang',
    kategori: 'Coklat & Topping',
    stok: 7,
    satuan: 'kg',
    minimumStok: 5,
    status: 'Aman',
  },
];

const categoryList = [
  'Semua Kategori',
  'Tepung',
  'Lemak & Butter',
  'Pemanis',
  'Pengembang',
  'Dairy & Telur',
  'Coklat & Topping',
  'Perisa & Pewarna',
];

function getStatusBadge(status) {
  switch (status) {
    case 'Kritis':
      return {
        bg: '#FEF2F2',
        text: '#991B1B',
        dot: '#DC2626',
        label: 'Kritis (Belanja Segera)',
      };
    case 'Menipis':
      return {
        bg: '#FEF9C3',
        text: '#854D0E',
        dot: '#CA8A04',
        label: 'Stok Menipis',
      };
    case 'Aman':
      return {
        bg: '#F0FDF4',
        text: '#166534',
        dot: '#16A34A',
        label: 'Stok Aman',
      };
    default:
      return {
        bg: '#FAF7F2',
        text: '#5C4A3C',
        dot: '#8C7A6B',
        label: status,
      };
  }
}

// ─── Modal Form Tambah / Edit Bahan ───────────────────────────────────────────

function IngredientFormModal({ item, onClose, onSave, isSaving }) {
  const isEditing = Boolean(item);
  const [formData, setFormData] = useState({
    id: item ? item.id : null,
    kode: item ? item.kode : '',
    nama: item ? item.nama : '',
    kategori: item ? item.kategori : 'Tepung',
    stok: item ? item.stok : '',
    satuan: item ? item.satuan : 'kg',
    minimumStok: item ? (item.minimumStok ?? item.minimum_stok) : '',
    status: item ? item.status : 'Aman',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const stokNum = parseFloat(formData.stok) || 0;
    const minNum = parseFloat(formData.minimumStok) || 0;

    let computedStatus = 'Aman';
    if (stokNum <= minNum * 0.5) {
      computedStatus = 'Kritis';
    } else if (stokNum <= minNum) {
      computedStatus = 'Menipis';
    }

    onSave({
      ...formData,
      stok: stokNum,
      minimum_stok: minNum,
      minimumStok: minNum,
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
        width: 'min(440px, calc(100vw - 32px))',
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
              {isEditing ? 'Perbarui Bahan Baku' : 'Tambah Bahan Baku Baru'}
            </h2>
            <p style={{ fontSize: '12px', color: '#8C7A6B', margin: 0 }}>
              Inventaris dapur dan gudang penyimpanan Erles Bakery
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
            <label style={labelStyle}>Nama Bahan Baku *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Tepung Terigu Protein Tinggi"
              value={formData.nama}
              onChange={e => setFormData({ ...formData, nama: e.target.value })}
              style={fieldStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Kode</label>
              <input
                type="text"
                value={formData.kode}
                onChange={e => setFormData({ ...formData, kode: e.target.value })}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Stok Saat Ini *</label>
              <input
                type="number"
                required
                value={formData.stok}
                onChange={e => setFormData({ ...formData, stok: e.target.value })}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Batas Minimum</label>
              <input
                type="number"
                value={formData.minimumStok}
                onChange={e => setFormData({ ...formData, minimumStok: e.target.value })}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Satuan</label>
              <select
                value={formData.satuan}
                onChange={e => setFormData({ ...formData, satuan: e.target.value })}
                style={{ ...fieldStyle, cursor: 'pointer' }}
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
              disabled={isSaving}
              style={{
                padding: '8px 18px', borderRadius: '8px', border: 'none',
                background: isSaving ? '#6E5D4F' : '#241B14', color: '#FFFFFF', fontSize: '13px', fontWeight: '600',
                cursor: isSaving ? 'not-allowed' : 'pointer',
              }}
            >
              {isSaving ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Bahan')}
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
          Hapus Bahan Baku?
        </h3>
        <p style={{ fontSize: '13px', color: '#6E5D4F', margin: '0 0 16px', lineHeight: 1.4 }}>
          Bahan <strong>{item.nama}</strong> ({item.kode}) akan dihapus permanen dari sistem inventaris dapur.
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
            onClick={() => { onConfirm(item.id); onClose(); }}
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

// ─── Modal Riwayat Pemakaian Produksi Dapur ───────────────────────────────────

function ProductionHistoryModal({ isOpen, onClose, logs, loadingHistory }) {
  if (!isOpen) return null;

  const formatDateTime = (iso) => {
    if (!iso) return '-';
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1099,
          background: 'rgba(36, 27, 20, 0.45)', backdropFilter: 'blur(2px)',
        }}
      />
      <div
        style={{
          position: 'fixed', zIndex: 1100,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(640px, calc(100vw - 32px))',
          maxHeight: '85vh',
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          boxShadow: '0 16px 40px rgba(36, 27, 20, 0.14)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #EFEAE3',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#241B14', margin: '0 0 2px' }}>
              Riwayat Pemakaian Bahan Baku Dapur
            </h2>
            <p style={{ fontSize: '12px', color: '#8C7A6B', margin: 0 }}>
              Daftar pesanan produksi yang otomatis memotong stok bahan baku gudang
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: '#8C7A6B',
              cursor: 'pointer', padding: '4px', borderRadius: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loadingHistory ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#8C7A6B', fontSize: '13px' }}>
              Memuat riwayat pemakaian bahan baku...
            </div>
          ) : !logs || logs.length === 0 ? (
            <div style={{ padding: '36px 24px', textAlign: 'center', color: '#8C7A6B', fontSize: '13px' }}>
              Belum ada riwayat pemotongan bahan baku dari produksi pesanan.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.order_id}
                style={{
                  border: '1px solid #E6DED4',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  background: '#FAF7F2',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#241B14' }}>
                        {log.kode_pesanan}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6E5D4F', fontWeight: '500' }}>
                        • {log.customer_name}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#5C4A3C', marginTop: '3px' }}>
                      <strong>Item Diproduksi:</strong> {(log.products || []).join(', ')}
                    </div>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#8C7A6B', whiteSpace: 'nowrap' }}>
                    {formatDateTime(log.deducted_at)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#7D6B5C', marginBottom: '6px' }}>
                    BAHAN BAKU TERPAKAI:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(log.ingredients || []).map((ing) => (
                      <span
                        key={ing.id || ing.kode}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 9px',
                          borderRadius: '6px',
                          background: '#FFFFFF',
                          border: '1px solid #E2D5C6',
                          fontSize: '12px',
                          color: '#241B14',
                          fontWeight: '500',
                        }}
                      >
                        <span>{ing.nama}</span>
                        <strong style={{ color: '#B45309' }}>-{ing.qty} {ing.satuan}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid #EFEAE3',
            background: '#FAF7F2',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '12px', color: '#7D6B5C' }}>
            Total {logs?.length || 0} produksi pesanan tercatat
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: '1px solid #D4C5B9',
              background: '#FFFFFF',
              color: '#241B14',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function StokBahanPage() {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [modalState, setModalState] = useState({ isOpen: false, item: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await ingredientService.getHistory();
      if (Array.isArray(res?.data)) {
        setHistoryLogs(res.data);
      }
    } catch (_) {
      // Ignore history fetch error on fallback
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const fetchIngredients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ingredientService.getIngredients({ all: true });
      const data = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      if (data.length > 0) {
        setIngredients(data.map(i => ({
          ...i,
          minimumStok: i.minimum_stok ?? i.minimumStok ?? 0,
        })));
      }
      fetchHistory();
    } catch (err) {
      console.warn('Gagal memuat bahan baku dari server, memakai fallback lokal:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchHistory]);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  // Metrics
  const totalBahan    = ingredients.length;
  const bahanAman     = ingredients.filter(i => i.status === 'Aman').length;
  const bahanMenipis  = ingredients.filter(i => i.status === 'Menipis').length;
  const bahanKritis   = ingredients.filter(i => i.status === 'Kritis').length;

  const handleSaveIngredient = async (itemData) => {
    setIsSaving(true);
    try {
      const payload = {
        kode: itemData.kode || undefined,
        nama: itemData.nama,
        kategori: itemData.kategori,
        stok: itemData.stok,
        satuan: itemData.satuan,
        minimum_stok: itemData.minimum_stok ?? itemData.minimumStok,
      };

      if (modalState.item?.id && typeof modalState.item.id === 'number') {
        const res = await ingredientService.updateIngredient(modalState.item.id, payload);
        const updated = res.data;
        setIngredients(prev => prev.map(i => i.id === updated.id ? { ...updated, minimumStok: updated.minimum_stok } : i));
        showSuccess('Bahan baku berhasil diperbarui');
      } else {
        const res = await ingredientService.createIngredient(payload);
        const created = res.data;
        setIngredients(prev => [{ ...created, minimumStok: created.minimum_stok }, ...prev]);
        showSuccess('Bahan baku baru berhasil ditambahkan');
      }
      setModalState({ isOpen: false, item: null });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Gagal menyimpan bahan baku';
      showError(msg);
      // Fallback update state lokal jika backend belum running
      if (modalState.item) {
        setIngredients(prev => prev.map(i => i.id === itemData.id ? itemData : i));
      } else {
        setIngredients(prev => [{ ...itemData, id: Date.now() }, ...prev]);
      }
      setModalState({ isOpen: false, item: null });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteIngredient = async (id) => {
    try {
      if (typeof id === 'number') {
        await ingredientService.deleteIngredient(id);
      }
      setIngredients(prev => prev.filter(i => i.id !== id));
      showSuccess('Bahan baku berhasil dihapus');
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || 'Gagal menghapus bahan baku');
      setIngredients(prev => prev.filter(i => i.id !== id));
    } finally {
      setDeleteTarget(null);
    }
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

  const paginatedIngredients = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIngredients.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredIngredients, currentPage]);

  const hasFilter = searchTerm || selectedStatus !== 'Semua Status' || selectedCategory !== 'Semua Kategori';

  const resetFilter = () => {
    setSearchTerm('');
    setSelectedStatus('Semua Status');
    setSelectedCategory('Semua Kategori');
    setCurrentPage(1);
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
            <span>INVENTARIS GUDANG & DAPUR</span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#241B14',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
          }}>
            Inventaris Bahan Baku
          </h1>

          <div style={{ fontSize: '13px', color: '#6E5D4F' }}>
            {bahanKritis > 0 ? (
              <span style={{ color: '#DC2626', fontWeight: '600' }}>
                ⚠ {bahanKritis} bahan mencapai batas kritis (segera belanja ulang)
              </span>
            ) : (
              <span style={{ color: '#166534', fontWeight: '500' }}>
                ✓ Seluruh stok bahan baku dalam batas aman
              </span>
            )}
            <span style={{ color: '#D4C5B9', margin: '0 8px' }}>•</span>
            <span>Total {totalBahan} item bahan terdaftar di dapur</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={fetchIngredients}
            title="Refresh Data"
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid #E6DED4',
              background: '#FFFFFF',
              color: '#6E5D4F',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>

          <button
            onClick={() => {
              fetchHistory();
              setShowHistoryModal(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #D4C5B9',
              background: '#FFFFFF',
              color: '#241B14',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FAF7F2'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; }}
          >
            <Clock size={15} color="#6E5D4F" />
            <span>Riwayat Pemakaian</span>
            {historyLogs.length > 0 && (
              <span
                style={{
                  background: '#FAF0E6',
                  color: '#8C5A2B',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  border: '1px solid #E6D2B5',
                }}
              >
                {historyLogs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setModalState({ isOpen: true, item: null })}
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
            Tambah Bahan Baku
          </button>
        </div>
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
        {/* Metric 1: Total Bahan */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Total Bahan Terdata
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {totalBahan} <span style={{ fontSize: '14px', fontWeight: '500', color: '#8C7A6B' }}>item</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Inventaris bahan mentah dapur
          </div>
        </div>

        {/* Metric 2: Bahan Kritis (Urgent) */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Stok Kritis
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: bahanKritis > 0 ? '#DC2626' : '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {bahanKritis} <span style={{ fontSize: '14px', fontWeight: '500', color: '#8C7A6B' }}>bahan</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Di bawah 50% batas minimum
          </div>
        </div>

        {/* Metric 3: Bahan Menipis */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Stok Menipis
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: bahanMenipis > 0 ? '#B45309' : '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {bahanMenipis} <span style={{ fontSize: '14px', fontWeight: '500', color: '#8C7A6B' }}>bahan</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Mendekati batas minimum
          </div>
        </div>

        {/* Metric 4: Bahan Aman */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Stok Aman
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#166534',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {bahanAman} <span style={{ fontSize: '14px', fontWeight: '500', color: '#8C7A6B' }}>bahan</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Cukup untuk produksi berjalan
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
            placeholder="Cari nama bahan (Tepung, Butter, Ragi...) atau kode..."
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
        <div style={{ minWidth: '150px' }}>
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
            <option value="Aman">Stok Aman</option>
            <option value="Menipis">Stok Menipis</option>
            <option value="Kritis">Stok Kritis</option>
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
          {filteredIngredients.length} dari {ingredients.length} bahan
        </div>
      </div>

      {/* ── [4] TABEL INVENTARIS BAHAN BAKU ─────────────────────────── */}
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
                <th style={{ padding: '11px 18px' }}>Kode</th>
                <th style={{ padding: '11px 18px', minWidth: '220px' }}>Nama Bahan Baku</th>
                <th style={{ padding: '11px 18px' }}>Kategori</th>
                <th style={{ padding: '11px 18px', textAlign: 'right' }}>Jumlah Stok</th>
                <th style={{ padding: '11px 18px', textAlign: 'right' }}>Batas Minimum</th>
                <th style={{ padding: '11px 18px', textAlign: 'center' }}>Status Stok</th>
                <th style={{ padding: '11px 18px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <Boxes size={28} color="#D4C5B9" />
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#7D6B5C' }}>
                        Bahan baku tidak ditemukan
                      </div>
                      <div style={{ fontSize: '12px', color: '#9C8B7E' }}>
                        Sesuaikan kata kunci pencarian atau reset filter.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedIngredients.map(item => {
                  const badge = getStatusBadge(item.status);

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #F3EDE6',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAF7F2'}
                      onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                    >
                      {/* Kode */}
                      <td style={{
                        padding: '12px 18px',
                        fontWeight: '600',
                        color: '#6E5D4F',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.kode}
                      </td>

                      {/* Nama Bahan */}
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ fontWeight: '600', color: '#241B14' }}>{item.nama}</div>
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
                          {item.kategori}
                        </span>
                      </td>

                      {/* Jumlah Stok (Right-aligned, tabular figures) */}
                      <td style={{
                        padding: '12px 18px',
                        textAlign: 'right',
                        fontWeight: '700',
                        color: item.status === 'Kritis' ? '#DC2626' : item.status === 'Menipis' ? '#B45309' : '#241B14',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.stok} <span style={{ fontSize: '11.5px', fontWeight: '500', color: '#8C7A6B' }}>{item.satuan}</span>
                      </td>

                      {/* Minimum Stok */}
                      <td style={{
                        padding: '12px 18px',
                        textAlign: 'right',
                        color: '#6E5D4F',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.minimumStok} {item.satuan}
                      </td>

                      {/* Status Badge */}
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
                          {badge.label}
                        </span>
                      </td>

                      {/* Aksi: Edit & Hapus */}
                      <td style={{ padding: '12px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => setModalState({ isOpen: true, item: item })}
                            title="Edit Bahan"
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
                            onClick={() => setDeleteTarget(item)}
                            title="Hapus Bahan"
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

        {/* Pagination 10 items/page */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredIngredients.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />

        {/* Footer */}
        {filteredIngredients.length > 0 && (
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
            <span>Menampilkan {filteredIngredients.length} item bahan dapur</span>
            <span>Bahan kritis perlu belanja ulang: <strong style={{ color: '#DC2626' }}>{bahanKritis}</strong> item</span>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalState.isOpen && (
        <IngredientFormModal
          item={modalState.item}
          isSaving={isSaving}
          onClose={() => setModalState({ isOpen: false, item: null })}
          onSave={handleSaveIngredient}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteIngredient}
        />
      )}

      <ProductionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        logs={historyLogs}
        loadingHistory={loadingHistory}
      />

    </div>
  );
}
