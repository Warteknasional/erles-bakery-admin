import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Plus, Search, Filter, Calendar, RotateCcw, Trash2, X,
  ChevronDown, Tag, FileText, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import Pagination from '../components/common/Pagination';
import financeService from '../services/financeService';
import useToast from '../hooks/useToast';

// ─── Kategori & Helpers ───────────────────────────────────────────────────────

const kategoriPemasukan = ['Penjualan', 'Hampers', 'Pesanan Khusus', 'Penjualan Langsung', 'Lainnya'];
const kategoriPengeluaran = ['Bahan Baku', 'Operasional', 'Gaji', 'Packaging', 'Peralatan', 'Lainnya'];
const allKategori = [...new Set([...kategoriPemasukan, ...kategoriPengeluaran])].sort();

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(num || 0);
}

function localDate() {
  const now = new Date();
  const pad = (v) => String(v).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// ─── Modal Form Tambah Transaksi ─────────────────────────────────────────────

function TransactionModal({ onClose, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(() => ({
    tipe: 'pengeluaran',
    nominal: '',
    kategori: 'Bahan Baku',
    catatan: '',
    tanggal: localDate(),
  }));
  const [errors, setErrors] = useState({});

  const currentKategori = form.tipe === 'pemasukan' ? kategoriPemasukan : kategoriPengeluaran;

  const validate = () => {
    const e = {};
    if (!form.nominal || Number(form.nominal) < 1) e.nominal = 'Nominal harus lebih dari 0';
    if (!form.kategori) e.kategori = 'Pilih kategori';
    if (!form.tanggal) e.tanggal = 'Pilih tanggal';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await onSubmit({
      tipe: form.tipe,
      nominal: Number(form.nominal),
      kategori: form.kategori,
      catatan: form.catatan,
      tanggal: form.tanggal,
    });
    setLoading(false);
  };

  const fieldStyle = (hasError) => ({
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: `1px solid ${hasError ? '#DC2626' : '#E6DED4'}`,
    background: '#FFFFFF',
    fontSize: '13.5px',
    color: '#241B14',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6E5D4F',
    marginBottom: '6px',
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
          width: 'min(440px, calc(100vw - 32px))',
          background: '#FFFFFF', borderRadius: '12px',
          border: '1px solid #E6DED4',
          boxShadow: '0 16px 40px rgba(36, 27, 20, 0.14)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px', borderBottom: '1px solid #EFEAE3',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#241B14', margin: '0 0 2px' }}>
              Catat Transaksi Kas
            </h2>
            <p style={{ fontSize: '12px', color: '#8C7A6B', margin: 0 }}>
              Input pemasukan atau pengeluaran operasional toko
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
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Toggle Pemasukan / Pengeluaran */}
          <div>
            <label style={labelStyle}>Jenis Transaksi</label>
            <div
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px',
                background: '#FAF7F2', padding: '4px', borderRadius: '8px', border: '1px solid #E6DED4',
              }}
            >
              <button
                type="button"
                onClick={() => setForm({ ...form, tipe: 'pemasukan', kategori: 'Penjualan' })}
                style={{
                  padding: '7px 0', borderRadius: '6px', border: 'none',
                  background: form.tipe === 'pemasukan' ? '#FFFFFF' : 'transparent',
                  color: form.tipe === 'pemasukan' ? '#166534' : '#8C7A6B',
                  fontWeight: '600', fontSize: '12.5px', cursor: 'pointer',
                  boxShadow: form.tipe === 'pemasukan' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                + Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, tipe: 'pengeluaran', kategori: 'Bahan Baku' })}
                style={{
                  padding: '7px 0', borderRadius: '6px', border: 'none',
                  background: form.tipe === 'pengeluaran' ? '#FFFFFF' : 'transparent',
                  color: form.tipe === 'pengeluaran' ? '#991B1B' : '#8C7A6B',
                  fontWeight: '600', fontSize: '12.5px', cursor: 'pointer',
                  boxShadow: form.tipe === 'pengeluaran' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                - Pengeluaran
              </button>
            </div>
          </div>

          {/* Nominal */}
          <div>
            <label style={labelStyle}>Nominal (Rp) *</label>
            <input
              type="number"
              placeholder="Contoh: 150000"
              value={form.nominal}
              onChange={(e) => setForm({ ...form, nominal: e.target.value })}
              style={fieldStyle(errors.nominal)}
            />
            {errors.nominal && (
              <span style={{ fontSize: '11px', color: '#DC2626', marginTop: '3px', display: 'block' }}>
                {errors.nominal}
              </span>
            )}
          </div>

          {/* Kategori & Tanggal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Kategori *</label>
              <select
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                style={{ ...fieldStyle(errors.kategori), cursor: 'pointer' }}
              >
                {currentKategori.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Tanggal *</label>
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                style={fieldStyle(errors.tanggal)}
              />
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label style={labelStyle}>Catatan / Keterangan</label>
            <input
              type="text"
              placeholder="Contoh: Pembelian ragi dan margarin 10kg"
              value={form.catatan}
              onChange={(e) => setForm({ ...form, catatan: e.target.value })}
              style={fieldStyle(false)}
            />
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex', justifyContent: 'flex-end', gap: '10px',
              paddingTop: '8px', borderTop: '1px solid #EFEAE3',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
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
              disabled={loading}
              style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none',
                background: form.tipe === 'pemasukan' ? '#166534' : '#241B14',
                color: '#FFFFFF', fontSize: '13px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function KeuanganPage() {
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipe, setFilterTipe] = useState('semua');
  const [filterKategori, setFilterKategori] = useState('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Ambil Transaksi & Ringkasan dari Backend API
  const loadFinanceData = useCallback(async () => {
    setLoading(true);
    try {
      const [txRes, sumRes] = await Promise.all([
        financeService.getTransactions({ per_page: 100 }),
        financeService.getSummary(),
      ]);

      if (sumRes?.data) {
        setSummaryData(sumRes.data);
      }

      if (txRes?.data) {
        const mapped = txRes.data.map((t) => ({
          id: t.id,
          tipe: t.tipe,
          nominal: Number(t.nominal) || 0,
          kategori: t.kategori || 'Operasional',
          catatan: t.catatan || '-',
          tanggal: t.tanggal || (t.created_at ? t.created_at.split('T')[0] : '-'),
          user: t.user?.name || 'Admin',
        }));
        setTransactions(mapped);
      }
    } catch (err) {
      console.error('Gagal mengambil data keuangan:', err);
      showToast('Gagal memuat data keuangan dari server backend.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadFinanceData();
  }, [loadFinanceData]);

  // Simpan Transaksi Baru
  const handleAddTransaction = async (formData) => {
    try {
      await financeService.createTransaction(formData);
      showToast('Transaksi keuangan berhasil dicatat!', 'success');
      setIsModalOpen(false);
      loadFinanceData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menyimpan transaksi.';
      showToast(msg, 'error');
    }
  };

  // Hapus Transaksi
  const handleDeleteTransaction = async (id) => {
    try {
      await financeService.deleteTransaction(id);
      showToast('Transaksi berhasil dihapus.', 'success');
      setDeleteTarget(null);
      loadFinanceData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menghapus transaksi.';
      showToast(msg, 'error');
    }
  };

  // Metrics
  const totalPemasukan = summaryData?.total_pemasukan ?? transactions
    .filter((t) => t.tipe === 'pemasukan')
    .reduce((a, b) => a + b.nominal, 0);

  const totalPengeluaran = summaryData?.total_pengeluaran ?? transactions
    .filter((t) => t.tipe === 'pengeluaran')
    .reduce((a, b) => a + b.nominal, 0);

  const saldo = totalPemasukan - totalPengeluaran;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.catatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.kategori.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTipe = filterTipe === 'semua' || t.tipe === filterTipe;
      const matchKategori = filterKategori === 'semua' || t.kategori === filterKategori;
      return matchSearch && matchTipe && matchKategori;
    });
  }, [transactions, searchTerm, filterTipe, filterKategori]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const hasFilter = searchTerm || filterTipe !== 'semua' || filterKategori !== 'semua';

  const resetFilter = () => {
    setSearchTerm('');
    setFilterTipe('semua');
    setFilterKategori('semua');
    setCurrentPage(1);
  };

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        color: '#241B14',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* ── [1] HEADER ──────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '4px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#8C7A6B',
              fontWeight: '600',
              letterSpacing: '0.02em',
              marginBottom: '4px',
            }}
          >
            <span>ERLES BAKERY</span>
            <span style={{ color: '#D4C5B9' }}>/</span>
            <span>KEUANGAN & ARUS KAS</span>
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#241B14',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
            }}
          >
            Pembukuan & Laporan Keuangan
          </h1>

          <p style={{ fontSize: '13px', color: '#6E5D4F', margin: 0 }}>
            Pencatatan pemasukan otomatis dari pesanan dan pengeluaran operasional toko
          </p>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={loadFinanceData}
            title="Muat ulang data keuangan"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #E2D9CE',
              background: '#FFFFFF',
              color: '#5C4A3C',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Muat Ulang
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3D2D22';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#241B14';
            }}
          >
            <Plus size={15} />
            Catat Transaksi
          </button>
        </div>
      </div>

      {/* ── [2] METRIC STRIP ────────────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
        }}
      >
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Total Pemasukan / Omzet
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#166534',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: '6px',
            }}
          >
            {formatRupiah(totalPemasukan)}
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Dari pembayaran pesanan & kasir
          </div>
        </div>

        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Total Pengeluaran
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#991B1B',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: '6px',
            }}
          >
            {formatRupiah(totalPengeluaran)}
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>Bahan baku, gaji, & operasional</div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Saldo / Laba Bersih
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: saldo >= 0 ? '#241B14' : '#DC2626',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: '6px',
            }}
          >
            {formatRupiah(saldo)}
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            {saldo >= 0 ? 'Surplus keuangan operasional' : 'Defisit (pengeluaran > omzet)'}
          </div>
        </div>
      </div>

      {/* ── [3] FILTER & PENCARIAN ────────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '220px', maxWidth: '300px', flex: 1 }}>
            <Search
              size={14}
              color="#8C7A6B"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Cari keterangan, kategori..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '7px 10px 7px 30px',
                borderRadius: '8px',
                border: '1px solid #E6DED4',
                background: '#FAF7F2',
                fontSize: '12.5px',
                color: '#241B14',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <select
            value={filterTipe}
            onChange={(e) => {
              setFilterTipe(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '7px 10px',
              borderRadius: '8px',
              border: '1px solid #E6DED4',
              background: '#FAF7F2',
              fontSize: '12.5px',
              color: '#5C4A3C',
              fontWeight: '500',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="semua">Semua Jenis</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>

          <select
            value={filterKategori}
            onChange={(e) => {
              setFilterKategori(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '7px 10px',
              borderRadius: '8px',
              border: '1px solid #E6DED4',
              background: '#FAF7F2',
              fontSize: '12.5px',
              color: '#5C4A3C',
              fontWeight: '500',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="semua">Semua Kategori</option>
            {allKategori.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>

          {hasFilter && (
            <button
              onClick={resetFilter}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: '#F5EFEB',
                color: '#6E5D4F',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>

        <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
          Menampilkan <strong>{filteredTransactions.length}</strong> transaksi
        </div>
      </div>

      {/* ── [4] TABEL TRANSAKSI ──────────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  background: '#FAF7F2',
                  borderBottom: '1px solid #E6DED4',
                  color: '#6E5D4F',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                <th style={{ padding: '10px 18px' }}>Tanggal</th>
                <th style={{ padding: '10px 18px' }}>Jenis</th>
                <th style={{ padding: '10px 18px' }}>Kategori</th>
                <th style={{ padding: '10px 18px' }}>Keterangan</th>
                <th style={{ padding: '10px 18px', textAlign: 'right' }}>Nominal</th>
                <th style={{ padding: '10px 18px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#8C7A6B' }}>
                    Memuat data transaksi dari server backend...
                  </td>
                </tr>
              ) : paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#8C7A6B' }}>
                    Tidak ada transaksi yang cocok.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  const isPemasukan = tx.tipe === 'pemasukan';

                  return (
                    <tr
                      key={tx.id}
                      style={{
                        borderBottom: '1px solid #F3EDE6',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF7F2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                    >
                      {/* Tanggal */}
                      <td
                        style={{
                          padding: '12px 18px',
                          color: '#6E5D4F',
                          fontSize: '12.5px',
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tx.tanggal}
                      </td>

                      {/* Jenis Badge */}
                      <td style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: isPemasukan ? '#F0FDF4' : '#FEF2F2',
                            color: isPemasukan ? '#166534' : '#991B1B',
                            fontSize: '11.5px',
                            fontWeight: '600',
                          }}
                        >
                          {isPemasukan ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {isPemasukan ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </td>

                      {/* Kategori */}
                      <td style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: '#F7F3EE',
                            color: '#6E5D4F',
                            fontSize: '11.5px',
                            fontWeight: '500',
                          }}
                        >
                          {tx.kategori}
                        </span>
                      </td>

                      {/* Catatan */}
                      <td style={{ padding: '12px 18px', color: '#241B14' }}>
                        <div>{tx.catatan}</div>
                        <div style={{ fontSize: '11px', color: '#8C7A6B' }}>Dicatat oleh: {tx.user}</div>
                      </td>

                      {/* Nominal */}
                      <td
                        style={{
                          padding: '12px 18px',
                          textAlign: 'right',
                          fontWeight: '700',
                          color: isPemasukan ? '#166534' : '#991B1B',
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {isPemasukan ? '+' : '-'} {formatRupiah(tx.nominal)}
                      </td>

                      {/* Aksi */}
                      <td style={{ padding: '12px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => setDeleteTarget(tx)}
                          title="Hapus Transaksi"
                          style={{
                            padding: '5px',
                            borderRadius: '6px',
                            border: '1px solid #FECACA',
                            background: '#FEF2F2',
                            color: '#DC2626',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
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
          totalItems={filteredTransactions.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal Tambah Transaksi */}
      {isModalOpen && (
        <TransactionModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTransaction}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
        <>
          <div
            onClick={() => setDeleteTarget(null)}
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
              width: 'min(360px, calc(100vw - 32px))',
              background: '#FFFFFF', borderRadius: '12px',
              border: '1px solid #E6DED4',
              boxShadow: '0 16px 40px rgba(36, 27, 20, 0.14)',
              padding: '24px 24px 20px', textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: '#FEF2F2', margin: '0 auto 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <AlertTriangle size={22} color="#DC2626" />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#241B14', margin: '0 0 6px' }}>
              Hapus Transaksi?
            </h3>
            <p style={{ fontSize: '13px', color: '#6E5D4F', margin: '0 0 16px', lineHeight: 1.4 }}>
              Transaksi <strong>{deleteTarget.catatan}</strong> ({formatRupiah(deleteTarget.nominal)}) akan dihapus dari pembukuan.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: '1px solid #E6DED4',
                  background: '#FFFFFF', color: '#5C4A3C', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteTransaction(deleteTarget.id)}
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
      )}
    </div>
  );
}
