import { useState, useEffect, useCallback } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, Plus, Search,
  Filter, ChevronDown, Edit3, Trash2, X,
} from 'lucide-react';
import { financeService } from '../services/financeService';
import { formatRupiah, formatTanggal } from '../utils/formatters';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import { LoadingState, EmptyState, ErrorState } from '../components/StateDisplay';

const kategoriPemasukan = ['Penjualan', 'Hampers', 'Pesanan Khusus', 'Lainnya'];
const kategoriPengeluaran = ['Bahan Baku', 'Packaging', 'Gaji', 'Operasional', 'Peralatan', 'Lainnya'];

const emptyForm = {
  tipe: 'pemasukan',
  nominal: '',
  kategori: '',
  catatan: '',
  tanggal: new Date().toISOString().split('T')[0],
};

export default function KeuanganPage() {
  // Data
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, summary: null });
  const [summary, setSummary] = useState({ total_pemasukan: 0, total_pengeluaran: 0, saldo: 0 });

  // Filters
  const [filterTipe, setFilterTipe] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch transactions
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [txRes, sumRes] = await Promise.all([
        financeService.list({
          tipe: filterTipe || undefined,
          tanggal_mulai: dateStart || undefined,
          tanggal_akhir: dateEnd || undefined,
          search: debouncedSearch || undefined,
          page,
          per_page: 5,
        }),
        financeService.summary(),
      ]);

      if (txRes.success) {
        setTransactions(txRes.data);
        setMeta(txRes.meta);
      } else {
        setError(txRes.message);
      }
      if (sumRes.success) {
        setSummary(sumRes.data);
      }
    } catch {
      setError('Gagal memuat data keuangan.');
    } finally {
      setLoading(false);
    }
  }, [filterTipe, dateStart, dateEnd, debouncedSearch, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Form handling
  const currentKategori = form.tipe === 'pemasukan' ? kategoriPemasukan : kategoriPengeluaran;

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormErrors({});
    setShowForm(true);
  };

  const openEdit = (tx) => {
    setEditingId(tx.id);
    setForm({
      tipe: tx.tipe,
      nominal: String(tx.nominal),
      kategori: tx.kategori,
      catatan: tx.catatan || '',
      tanggal: tx.tanggal,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!form.tipe) errs.tipe = 'Tipe wajib dipilih.';
    if (!form.nominal || Number(form.nominal) <= 0) errs.nominal = 'Nominal harus lebih dari 0.';
    if (!form.kategori) errs.kategori = 'Kategori wajib dipilih.';
    if (!form.tanggal) errs.tanggal = 'Tanggal wajib diisi.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      let res;
      if (editingId) {
        res = await financeService.update(editingId, form);
      } else {
        res = await financeService.create(form);
      }

      if (res.success) {
        setShowForm(false);
        setForm({ ...emptyForm });
        setEditingId(null);
        fetchData();
      } else if (res.errors) {
        // Server-side validation errors
        const mapped = {};
        Object.entries(res.errors).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? v[0] : v; });
        setFormErrors(mapped);
      }
    } catch {
      // ignore
    } finally {
      setFormLoading(false);
    }
  };

  // Delete
  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      const res = await financeService.delete(deleteConfirm);
      if (res.success) fetchData();
    } catch {
      // ignore
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm(null);
    }
  };

  // Summary cards data
  const cards = [
    { label: 'Total Pemasukan', value: summary.total_pemasukan, icon: TrendingUp, color: '#10B981', bg: '#D1FAE5' },
    { label: 'Total Pengeluaran', value: summary.total_pengeluaran, icon: TrendingDown, color: '#EF4444', bg: '#FEE2E2' },
    { label: 'Saldo', value: summary.saldo, icon: DollarSign, color: summary.saldo >= 0 ? '#6366F1' : '#EF4444', bg: summary.saldo >= 0 ? '#E0E7FF' : '#FEE2E2' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Wallet size={28} color="#6366F1" />
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0 }}>Keuangan</h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>{meta.total} transaksi ditemukan</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white',
            border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
            fontSize: '14px', transition: 'transform 150ms', boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Plus size={18} /> Catat Transaksi
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              background: 'white', borderRadius: '12px', padding: '20px',
              border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'transform 150ms, box-shadow 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>{card.label}</span>
              <div style={{ background: card.bg, borderRadius: '8px', padding: '8px', display: 'flex' }}>
                <card.icon size={18} color={card.color} />
              </div>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: card.color }}>{formatRupiah(card.value)}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1E293B' }}>
              {editingId ? 'Edit Transaksi' : 'Catat Transaksi Baru'}
            </h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <FormField label="Tipe" error={formErrors.tipe}>
              <select value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value, kategori: '' })} style={inputStyle}>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>
            </FormField>
            <FormField label="Nominal (Rp)" error={formErrors.nominal}>
              <input type="number" value={form.nominal} onChange={(e) => setForm({ ...form, nominal: e.target.value })} min="1" placeholder="0" style={inputStyle} />
            </FormField>
            <FormField label="Kategori" error={formErrors.kategori}>
              <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} style={inputStyle}>
                <option value="">Pilih Kategori</option>
                {currentKategori.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </FormField>
            <FormField label="Tanggal" error={formErrors.tanggal}>
              <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} style={inputStyle} />
            </FormField>
            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Catatan (opsional)">
                <input type="text" value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Keterangan transaksi..." style={inputStyle} />
              </FormField>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
                style={{ padding: '10px 20px', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
                Batal
              </button>
              <button type="submit" disabled={formLoading}
                style={{
                  padding: '10px 20px',
                  background: formLoading ? '#94A3B8' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600',
                  cursor: formLoading ? 'not-allowed' : 'pointer', fontSize: '14px',
                }}>
                {formLoading ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text" placeholder="Cari catatan atau kategori..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            onFocus={(e) => (e.target.style.borderColor = '#6366F1')}
            onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
          />
        </div>
        <div style={{ position: 'relative', minWidth: '150px' }}>
          <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <select value={filterTipe} onChange={(e) => { setFilterTipe(e.target.value); setPage(1); }}
            style={{ width: '100%', padding: '10px 12px 10px 40px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', appearance: 'none', background: 'white', cursor: 'pointer' }}>
            <option value="">Semua Tipe</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
        </div>
        <input type="date" value={dateStart} onChange={(e) => { setDateStart(e.target.value); setPage(1); }} placeholder="Dari"
          style={{ padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', minWidth: '140px' }}
          onFocus={(e) => (e.target.style.borderColor = '#6366F1')}
          onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
        />
        <input type="date" value={dateEnd} onChange={(e) => { setDateEnd(e.target.value); setPage(1); }} placeholder="Sampai"
          style={{ padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', minWidth: '140px' }}
          onFocus={(e) => (e.target.style.borderColor = '#6366F1')}
          onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
        />
      </div>

      {/* Table */}
      <div style={{ borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', overflow: 'hidden' }}>
        {loading ? (
          <LoadingState message="Memuat transaksi..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : transactions.length === 0 ? (
          <EmptyState message="Tidak ada transaksi ditemukan." icon={Wallet} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Tanggal', 'Tipe', 'Kategori', 'Catatan', 'Nominal', 'Aksi'].map((h) => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#64748B', borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 150ms' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}>
                    <td style={{ padding: '14px 16px', color: '#64748B', whiteSpace: 'nowrap' }}>{formatTanggal(tx.tanggal)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                        backgroundColor: tx.tipe === 'pemasukan' ? '#D1FAE5' : '#FEE2E2',
                        color: tx.tipe === 'pemasukan' ? '#065F46' : '#991B1B',
                      }}>
                        {tx.tipe === 'pemasukan' ? '↑ Masuk' : '↓ Keluar'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#1E293B', fontWeight: '500' }}>{tx.kategori}</td>
                    <td style={{ padding: '14px 16px', color: '#64748B', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.catatan || '-'}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '600', whiteSpace: 'nowrap', color: tx.tipe === 'pemasukan' ? '#10B981' : '#EF4444' }}>
                      {tx.tipe === 'pemasukan' ? '+' : '-'}{formatRupiah(tx.nominal)}
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEdit(tx)}
                          style={{
                            display: 'flex', alignItems: 'center', padding: '6px',
                            borderRadius: '6px', border: '1px solid #E2E8F0', background: 'white',
                            cursor: 'pointer', color: '#6366F1', transition: 'all 150ms',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#E0E7FF')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm(tx.id)}
                          style={{
                            display: 'flex', alignItems: 'center', padding: '6px',
                            borderRadius: '6px', border: '1px solid #E2E8F0', background: 'white',
                            cursor: 'pointer', color: '#EF4444', transition: 'all 150ms',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#FEE2E2')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9' }}>
            <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteConfirm}
        title="Hapus Transaksi"
        message="Transaksi yang dihapus tidak dapat dikembalikan. Lanjutkan?"
        confirmLabel="Ya, Hapus"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        loading={deleteLoading}
      />
    </div>
  );
}

/* ─── Form Field Helper ──────────────────────── */

function FormField({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748B', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ display: 'block', fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{error}</span>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 150ms',
};
