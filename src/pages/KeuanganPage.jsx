import { useState, useEffect, useCallback } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, Plus, Search,
  Filter, ChevronDown, Edit3, Trash2, X, AlertTriangle,
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

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid var(--color-border, #E8D9C5)',
  borderRadius: 'var(--radius-md, 8px)',
  fontSize: '14px',
  fontFamily: 'inherit',
  color: 'var(--color-text, #3D2817)',
  background: '#FFFFFF',
  outline: 'none',
  boxSizing: 'border-box',
};

function FormField({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text, #3D2817)' }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: '12px', color: 'var(--color-danger, #B91C1C)', fontWeight: '500' }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default function KeuanganPage() {
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, summary: null });
  const [summary, setSummary] = useState({ total_pemasukan: 0, total_pengeluaran: 0, saldo: 0 });
  const [isOfflineData, setIsOfflineData] = useState(false);

  const [filterTipe, setFilterTipe] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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

      setIsOfflineData(!!(txRes?.isOffline || sumRes?.isOffline));

      if (txRes.success) {
        setTransactions(txRes.data);
        setMeta(txRes.meta || { current_page: 1, last_page: 1, total: txRes.data.length });
      } else {
        setError(txRes.message);
      }
      if (sumRes.success) {
        setSummary(sumRes.data);
      }
    } catch {
      setError('Gagal memuat data transaksi keuangan.');
    } finally {
      setLoading(false);
    }
  }, [filterTipe, dateStart, dateEnd, debouncedSearch, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        const mapped = {};
        Object.entries(res.errors).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? v[0] : v; });
        setFormErrors(mapped);
      }
    } catch {
      // API validation or network error handled by response status
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      const res = await financeService.delete(deleteConfirm);
      if (res.success) fetchData();
    } catch {
      // Delete failure handled gracefully
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm(null);
    }
  };

  const cards = [
    {
      label: 'Total Pemasukan',
      value: summary.total_pemasukan,
      icon: TrendingUp,
      color: 'var(--color-success, #2E7D32)',
      bg: 'var(--color-success-bg, #E8F5E9)',
    },
    {
      label: 'Total Pengeluaran',
      value: summary.total_pengeluaran,
      icon: TrendingDown,
      color: 'var(--color-danger, #B91C1C)',
      bg: 'var(--color-danger-bg, #FEF2F2)',
    },
    {
      label: 'Saldo Kas',
      value: summary.saldo,
      icon: DollarSign,
      color: summary.saldo >= 0 ? 'var(--color-primary, #D97748)' : 'var(--color-danger, #B91C1C)',
      bg: summary.saldo >= 0 ? 'var(--color-primary-subtle, #FDF0EA)' : 'var(--color-danger-bg, #FEF2F2)',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'var(--color-primary-subtle, #FDF0EA)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Wallet size={24} color="var(--color-primary, #D97748)" />
          </div>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--color-text, #3D2817)', margin: 0 }}>
              Pencatatan Keuangan
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary, #705847)', margin: 0 }}>
              {meta.total} transaksi tercatat
            </p>
          </div>
        </div>

        <button
          onClick={openCreate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'var(--color-primary, #D97748)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius-md, 8px)',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background var(--transition-fast)',
            boxShadow: '0 2px 6px rgba(217, 119, 72, 0.25)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-hover, #C26336)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary, #D97748)')}
        >
          <Plus size={18} /> Catat Transaksi
        </button>
      </div>

      {isOfflineData && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--color-warning-bg, #FFF8E1)',
          border: '1px solid var(--color-warning-border, #FFE082)',
          borderRadius: 'var(--radius-md, 8px)',
          padding: '12px 16px',
          marginBottom: '24px',
          color: 'var(--color-warning-text, #78350F)',
        }}>
          <AlertTriangle size={20} color="var(--color-warning, #9A6700)" />
          <span style={{ fontSize: '13px' }}>Mode Data Contoh (Offline) — Hubungkan backend Laravel untuk sinkronisasi data riil.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              background: 'var(--color-surface, #FFFFFF)',
              borderRadius: 'var(--radius-lg, 12px)',
              padding: '22px 24px',
              border: '1px solid var(--color-border, #E8D9C5)',
              boxShadow: 'var(--shadow-sm)',
              minWidth: 0,
              overflow: 'hidden',
              transition: 'transform var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary, #705847)', fontWeight: '500' }}>
                {card.label}
              </span>
              <div style={{ background: card.bg, borderRadius: '8px', padding: '8px', display: 'flex' }}>
                <card.icon size={18} color={card.color} />
              </div>
            </div>
            <div style={{
              fontSize: 'clamp(18px, 1.8vw, 22px)',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              color: card.color,
              lineHeight: '1.2',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              minWidth: 0,
            }}>
              {formatRupiah(card.value)}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{
          background: 'var(--color-surface, #FFFFFF)',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: '24px',
          border: '1px solid var(--color-border, #E8D9C5)',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--color-text, #3D2817)' }}>
              {editingId ? 'Edit Transaksi Keuangan' : 'Catat Transaksi Baru'}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary, #705847)', display: 'flex', padding: '4px' }}
              aria-label="Tutup form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <FormField label="Tipe Transaksi" error={formErrors.tipe}>
              <select value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value, kategori: '' })} style={inputStyle}>
                <option value="pemasukan">Pemasukan (Uang Masuk)</option>
                <option value="pengeluaran">Pengeluaran (Uang Keluar)</option>
              </select>
            </FormField>

            <FormField label="Nominal (Rp)" error={formErrors.nominal}>
              <input
                type="number"
                value={form.nominal}
                onChange={(e) => setForm({ ...form, nominal: e.target.value })}
                min="1"
                placeholder="Contoh: 150000"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Kategori" error={formErrors.kategori}>
              <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} style={inputStyle}>
                <option value="">Pilih Kategori</option>
                {currentKategori.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </FormField>

            <FormField label="Tanggal Transaksi" error={formErrors.tanggal}>
              <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} style={inputStyle} />
            </FormField>

            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Catatan / Keterangan (opsional)">
                <input
                  type="text"
                  value={form.catatan}
                  onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                  placeholder="Keterangan transaksi (misal: Beli box hampers 50 pcs)..."
                  style={inputStyle}
                />
              </FormField>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid var(--color-border, #E8D9C5)',
                  borderRadius: 'var(--radius-md, 8px)',
                  background: 'var(--color-bg, #FAF6F0)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: 'var(--color-text, #3D2817)',
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={formLoading}
                style={{
                  padding: '10px 24px',
                  background: formLoading ? '#CBD5E1' : 'var(--color-primary, #D97748)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-md, 8px)',
                  fontWeight: '600',
                  cursor: formLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  transition: 'background var(--transition-fast)',
                }}
              >
                {formLoading ? 'Menyimpan...' : editingId ? 'Perbarui Transaksi' : 'Simpan Transaksi'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary, #705847)' }} />
          <input
            type="text"
            placeholder="Cari catatan atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid var(--color-border, #E8D9C5)',
              borderRadius: 'var(--radius-md, 8px)',
              fontSize: '14px',
              background: '#FFFFFF',
              color: 'var(--color-text, #3D2817)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ position: 'relative', minWidth: '160px' }}>
          <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary, #705847)' }} />
          <select
            value={filterTipe}
            onChange={(e) => { setFilterTipe(e.target.value); setPage(1); }}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid var(--color-border, #E8D9C5)',
              borderRadius: 'var(--radius-md, 8px)',
              fontSize: '14px',
              appearance: 'none',
              background: '#FFFFFF',
              color: 'var(--color-text, #3D2817)',
              cursor: 'pointer',
            }}
          >
            <option value="">Semua Tipe</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary, #705847)', pointerEvents: 'none' }} />
        </div>

        <input
          type="date"
          value={dateStart}
          onChange={(e) => { setDateStart(e.target.value); setPage(1); }}
          placeholder="Dari"
          style={{
            padding: '10px 12px',
            border: '1px solid var(--color-border, #E8D9C5)',
            borderRadius: 'var(--radius-md, 8px)',
            fontSize: '14px',
            background: '#FFFFFF',
            color: 'var(--color-text, #3D2817)',
            minWidth: '140px',
          }}
        />

        <input
          type="date"
          value={dateEnd}
          onChange={(e) => { setDateEnd(e.target.value); setPage(1); }}
          placeholder="Sampai"
          style={{
            padding: '10px 12px',
            border: '1px solid var(--color-border, #E8D9C5)',
            borderRadius: 'var(--radius-md, 8px)',
            fontSize: '14px',
            background: '#FFFFFF',
            color: 'var(--color-text, #3D2817)',
            minWidth: '140px',
          }}
        />
      </div>

      <div style={{ borderRadius: 'var(--radius-lg, 12px)', border: '1px solid var(--color-border, #E8D9C5)', background: '#FFFFFF', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {loading ? (
          <LoadingState message="Memuat transaksi keuangan..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : transactions.length === 0 ? (
          <EmptyState message="Tidak ada transaksi yang cocok dengan filter." icon={Wallet} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg, #FAF6F0)' }}>
                  {['Tanggal', 'Tipe', 'Kategori', 'Catatan', 'Nominal', 'Aksi'].map((h) => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-secondary, #705847)', borderBottom: '1px solid var(--color-border, #E8D9C5)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    style={{ borderBottom: '1px solid var(--color-border-subtle, #F5EDE4)', transition: 'background var(--transition-fast)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg, #FAF6F0)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                  >
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary, #705847)', whiteSpace: 'nowrap' }}>
                      {formatTanggal(tx.tanggal)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: tx.tipe === 'pemasukan' ? 'var(--color-success-bg, #E8F5E9)' : 'var(--color-danger-bg, #FEF2F2)',
                        color: tx.tipe === 'pemasukan' ? 'var(--color-success-text, #1B5E20)' : 'var(--color-danger-text, #991B1B)',
                        border: `1px solid ${tx.tipe === 'pemasukan' ? 'var(--color-success-border, #C8E6C9)' : 'var(--color-danger-border, #FECACA)'}`,
                      }}>
                        {tx.tipe === 'pemasukan' ? '+ Masuk' : '- Keluar'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text, #3D2817)', fontWeight: '600' }}>
                      {tx.kategori}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary, #705847)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.catatan || '-'}
                    </td>
                    <td style={{
                      padding: '14px 16px',
                      fontWeight: '700',
                      fontFamily: 'var(--font-display)',
                      whiteSpace: 'nowrap',
                      color: tx.tipe === 'pemasukan' ? 'var(--color-success, #2E7D32)' : 'var(--color-danger, #B91C1C)',
                    }}>
                      {tx.tipe === 'pemasukan' ? '+' : '-'}{formatRupiah(tx.nominal)}
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openEdit(tx)}
                          style={{
                            padding: '6px 10px',
                            background: 'none',
                            border: '1px solid var(--color-border, #E8D9C5)',
                            borderRadius: '6px',
                            color: 'var(--color-text-secondary, #705847)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                          title="Edit transaksi"
                          aria-label={`Edit transaksi ${tx.kategori}`}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(tx.id)}
                          style={{
                            padding: '6px 10px',
                            background: 'none',
                            border: '1px solid var(--color-danger-border, #FECACA)',
                            borderRadius: '6px',
                            color: 'var(--color-danger, #B91C1C)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                          title="Hapus transaksi"
                          aria-label={`Hapus transaksi ${tx.kategori}`}
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border-subtle, #F5EDE4)' }}>
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      <ConfirmModal
        open={!!deleteConfirm}
        title="Hapus Catatan Transaksi"
        message="Apakah Anda yakin ingin menghapus catatan transaksi keuangan ini? Data yang dihapus tidak dapat dikembalikan."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
