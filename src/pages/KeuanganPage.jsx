import { useState, useMemo } from 'react';
import {
  Plus, Search, Filter, Calendar, RotateCcw, Trash2, X,
  ChevronDown, Tag, FileText, AlertTriangle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// ─── Dummy Data ────────────────────────────────────────────────────────────────

const initialTransactions = [
  { id: 1,  tipe: 'pemasukan',   nominal: 1500000, kategori: 'Penjualan',       catatan: 'Penjualan roti harian',               tanggal: '2024-01-15', jam: '16:20' },
  { id: 2,  tipe: 'pengeluaran', nominal: 350000,  kategori: 'Bahan Baku',      catatan: 'Beli tepung terigu 25kg',             tanggal: '2024-01-15', jam: '09:10' },
  { id: 3,  tipe: 'pemasukan',   nominal: 2200000, kategori: 'Hampers',         catatan: 'Pesanan hampers pernikahan',          tanggal: '2024-01-14', jam: '14:35' },
  { id: 4,  tipe: 'pengeluaran', nominal: 150000,  kategori: 'Operasional',     catatan: 'Biaya listrik',                       tanggal: '2024-01-14', jam: '08:45' },
  { id: 5,  tipe: 'pemasukan',   nominal: 800000,  kategori: 'Penjualan',       catatan: 'Penjualan kue kering',                tanggal: '2024-01-13', jam: '17:05' },
  { id: 6,  tipe: 'pengeluaran', nominal: 500000,  kategori: 'Gaji',            catatan: 'Uang makan karyawan mingguan',        tanggal: '2024-01-13', jam: '12:15' },
  { id: 7,  tipe: 'pemasukan',   nominal: 450000,  kategori: 'Pesanan Khusus',  catatan: 'Kue ulang tahun custom 20cm',         tanggal: '2024-01-12', jam: '15:30' },
  { id: 8,  tipe: 'pengeluaran', nominal: 275000,  kategori: 'Bahan Baku',      catatan: 'Mentega, gula, coklat bubuk',         tanggal: '2024-01-12', jam: '09:25' },
  { id: 9,  tipe: 'pemasukan',   nominal: 680000,  kategori: 'Penjualan',       catatan: 'Penjualan weekend (Sabtu)',           tanggal: '2024-01-11', jam: '16:40' },
  { id: 10, tipe: 'pengeluaran', nominal: 120000,  kategori: 'Operasional',     catatan: 'Beli gas LPG 12kg',                   tanggal: '2024-01-11', jam: '08:20' },
  { id: 11, tipe: 'pemasukan',   nominal: 3500000, kategori: 'Hampers',         catatan: 'Hampers Lebaran bulk order 10 box',   tanggal: '2024-01-10', jam: '13:50' },
  { id: 12, tipe: 'pengeluaran', nominal: 800000,  kategori: 'Peralatan',       catatan: 'Beli loyang baru dan spatula set',    tanggal: '2024-01-10', jam: '10:05' },
  { id: 13, tipe: 'pemasukan',   nominal: 920000,  kategori: 'Penjualan',       catatan: 'Penjualan roti & pastry harian',      tanggal: '2024-01-09', jam: '17:10' },
  { id: 14, tipe: 'pengeluaran', nominal: 430000,  kategori: 'Bahan Baku',      catatan: 'Stok keju, susu UHT, krim',           tanggal: '2024-01-09', jam: '09:40' },
  { id: 15, tipe: 'pemasukan',   nominal: 1100000, kategori: 'Pesanan Khusus',  catatan: 'Wedding cake + cupcake 50pcs',        tanggal: '2024-01-08', jam: '15:15' },
];

const kategoriPemasukan   = ['Penjualan', 'Hampers', 'Pesanan Khusus', 'Lainnya'];
const kategoriPengeluaran = ['Bahan Baku', 'Operasional', 'Gaji', 'Peralatan', 'Lainnya'];
const allKategori = [...new Set([...kategoriPemasukan, ...kategoriPengeluaran])].sort();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(num);
}

function localDateTime() {
  const now = new Date();
  const pad = value => String(value).padStart(2, '0');
  return {
    tanggal: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    jam: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  };
}

let _idCounter = initialTransactions.length + 1;
function nextId() { return _idCounter++; }

// ─── Modal Form Transaksi ─────────────────────────────────────────────────────

function TransactionModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(() => ({
    tipe: 'pemasukan',
    nominal: '',
    kategori: '',
    catatan: '',
    ...localDateTime(),
  }));
  const [errors, setErrors] = useState({});

  const currentKategori = form.tipe === 'pemasukan' ? kategoriPemasukan : kategoriPengeluaran;

  const validate = () => {
    const e = {};
    if (!form.nominal || Number(form.nominal) < 1) e.nominal = 'Nominal harus lebih dari 0';
    if (!form.kategori) e.kategori = 'Pilih kategori';
    if (!form.tanggal) e.tanggal = 'Pilih tanggal';
    if (!form.jam) e.jam = 'Pilih jam';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({ ...form, nominal: Number(form.nominal), id: nextId() });
    onClose();
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
    marginBottom: '5px',
  };

  const isIncome = form.tipe === 'pemasukan';

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
        boxShadow: '0 16px 40px rgba(36, 27, 20, 0.12)',
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
              Catat Transaksi Keuangan
            </h2>
            <p style={{ fontSize: '12px', color: '#8C7A6B', margin: 0 }}>
              Masukkan pemasukan atau pengeluaran operasional toko
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
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tipe Selector */}
          <div>
            <label style={labelStyle}>Jenis Arus Kas</label>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px',
              background: '#FAF7F2', padding: '4px', borderRadius: '8px', border: '1px solid #EAE4DC',
            }}>
              <button
                type="button"
                onClick={() => { setForm(f => ({ ...f, tipe: 'pemasukan', kategori: '' })); setErrors({}); }}
                style={{
                  padding: '8px', borderRadius: '6px', border: 'none',
                  background: isIncome ? '#FFFFFF' : 'transparent',
                  color: isIncome ? '#166534' : '#7D6B5C',
                  fontWeight: isIncome ? '700' : '500',
                  fontSize: '13px', cursor: 'pointer',
                  boxShadow: isIncome ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                + Pemasukan
              </button>
              <button
                type="button"
                onClick={() => { setForm(f => ({ ...f, tipe: 'pengeluaran', kategori: '' })); setErrors({}); }}
                style={{
                  padding: '8px', borderRadius: '6px', border: 'none',
                  background: !isIncome ? '#FFFFFF' : 'transparent',
                  color: !isIncome ? '#991B1B' : '#7D6B5C',
                  fontWeight: !isIncome ? '700' : '500',
                  fontSize: '13px', cursor: 'pointer',
                  boxShadow: !isIncome ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                − Pengeluaran
              </button>
            </div>
          </div>

          {/* Nominal */}
          <div>
            <label style={labelStyle}>Nominal (Rp)</label>
            <input
              type="number"
              placeholder="Contoh: 150000"
              value={form.nominal}
              onChange={e => {
                setForm(f => ({ ...f, nominal: e.target.value }));
                setErrors(ev => ({ ...ev, nominal: '' }));
              }}
              style={fieldStyle(errors.nominal)}
              onFocus={e => e.target.style.borderColor = '#C25E34'}
              onBlur={e => e.target.style.borderColor = '#E6DED4'}
            />
            {errors.nominal && <div style={{ fontSize: '11.5px', color: '#DC2626', marginTop: '3px' }}>{errors.nominal}</div>}
          </div>

          {/* Kategori */}
          <div>
            <label style={labelStyle}>Kategori</label>
            <select
              value={form.kategori}
              onChange={e => {
                setForm(f => ({ ...f, kategori: e.target.value }));
                setErrors(ev => ({ ...ev, kategori: '' }));
              }}
              style={{ ...fieldStyle(errors.kategori), cursor: 'pointer' }}
            >
              <option value="">Pilih Kategori...</option>
              {currentKategori.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            {errors.kategori && <div style={{ fontSize: '11.5px', color: '#DC2626', marginTop: '3px' }}>{errors.kategori}</div>}
          </div>

          {/* Tanggal & Jam */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Tanggal</label>
              <input
                type="date"
                value={form.tanggal}
                onChange={e => { setForm(f => ({ ...f, tanggal: e.target.value })); setErrors(ev => ({ ...ev, tanggal: '' })); }}
                style={fieldStyle(errors.tanggal)}
              />
            </div>
            <div>
              <label style={labelStyle}>Jam</label>
              <input
                type="time"
                value={form.jam}
                onChange={e => { setForm(f => ({ ...f, jam: e.target.value })); setErrors(ev => ({ ...ev, jam: '' })); }}
                style={fieldStyle(errors.jam)}
              />
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label style={labelStyle}>Keterangan Catatan <span style={{ color: '#9C8B7E', fontWeight: '400' }}>(opsional)</span></label>
            <input
              type="text"
              placeholder="Contoh: Beli tepung terigu 25kg..."
              value={form.catatan}
              onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
              style={fieldStyle(false)}
            />
          </div>

          {/* Actions */}
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
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ─── Modal Konfirmasi Hapus ───────────────────────────────────────────────────

function DeleteConfirmModal({ tx, onClose, onConfirm }) {
  if (!tx) return null;
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
          Hapus Transaksi?
        </h3>
        <p style={{ fontSize: '13px', color: '#6E5D4F', margin: '0 0 16px', lineHeight: 1.4 }}>
          Transaksi <strong>{tx.catatan || tx.kategori}</strong> senilai{' '}
          <strong style={{ color: '#DC2626' }}>{formatRupiah(tx.nominal)}</strong> akan dihapus dari buku kas.
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
            onClick={() => { onConfirm(tx.id); onClose(); }}
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

export default function KeuanganPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipe, setFilterTipe] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const hasActiveFilter = searchTerm || filterTipe || filterKategori || dateFrom || dateTo;

  const resetFilters = () => {
    setSearchTerm('');
    setFilterTipe('');
    setFilterKategori('');
    setDateFrom('');
    setDateTo('');
  };

  // Metrics
  const totalPemasukan   = transactions.filter(t => t.tipe === 'pemasukan').reduce((s, t) => s + t.nominal, 0);
  const totalPengeluaran = transactions.filter(t => t.tipe === 'pengeluaran').reduce((s, t) => s + t.nominal, 0);
  const saldo            = totalPemasukan - totalPengeluaran;
  const countIn          = transactions.filter(t => t.tipe === 'pemasukan').length;
  const countOut         = transactions.filter(t => t.tipe === 'pengeluaran').length;

  const filteredTx = useMemo(() => transactions.filter(tx => {
    const matchSearch   = tx.catatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.kategori.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipe     = filterTipe     ? tx.tipe     === filterTipe     : true;
    const matchKategori = filterKategori ? tx.kategori === filterKategori : true;
    const matchDateFrom = !dateFrom || tx.tanggal >= dateFrom;
    const matchDateTo   = !dateTo || tx.tanggal <= dateTo;
    return matchSearch && matchTipe && matchKategori && matchDateFrom && matchDateTo;
  }), [transactions, searchTerm, filterTipe, filterKategori, dateFrom, dateTo]);

  const handleAdd = (newTx) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const filteredPemasukan   = filteredTx.filter(t => t.tipe === 'pemasukan').reduce((s, t) => s + t.nominal, 0);
  const filteredPengeluaran = filteredTx.filter(t => t.tipe === 'pengeluaran').reduce((s, t) => s + t.nominal, 0);

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
            <span>BUKU KAS & ARUS KAS</span>
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#241B14',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
          }}>
            Laporan Keuangan & Kas Toko
          </h1>

          <div style={{ fontSize: '13px', color: '#6E5D4F' }}>
            {saldo >= 0 ? (
              <span style={{ color: '#166534', fontWeight: '600' }}>
                ✓ Arus kas positif ({formatRupiah(saldo)} saldo bersih)
              </span>
            ) : (
              <span style={{ color: '#DC2626', fontWeight: '600' }}>
                ⚠ Pengeluaran melebihi pemasukan ({formatRupiah(Math.abs(saldo))})
              </span>
            )}
            <span style={{ color: '#D4C5B9', margin: '0 8px' }}>•</span>
            <span>{transactions.length} transaksi tercatat secara berurutan</span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
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
          Catat Transaksi
        </button>
      </div>

      {/* ── [2] UNIFIED METRIC STRIP ─────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E6DED4',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        boxShadow: '0 1px 2px rgba(36,27,20,0.03)',
      }}>
        {/* Metric 1: Saldo Kas Bersih (Primary Focal Metric) */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Saldo Kas Bersih
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: saldo >= 0 ? '#166534' : '#DC2626',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {formatRupiah(saldo)}
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Selisih penerimaan vs pengeluaran toko
          </div>
        </div>

        {/* Metric 2: Total Pemasukan */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Total Pemasukan
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {formatRupiah(totalPemasukan)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#166534' }}>
            <ArrowUpRight size={13} />
            <span>{countIn} transaksi masuk</span>
          </div>
        </div>

        {/* Metric 3: Total Pengeluaran */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Total Pengeluaran
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {formatRupiah(totalPengeluaran)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#B45309' }}>
            <ArrowDownRight size={13} />
            <span>{countOut} pengeluaran bahan & operasional</span>
          </div>
        </div>

        {/* Metric 4: Rasio Kas */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Rasio Operasional
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#241B14',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '6px',
          }}>
            {totalPemasukan > 0 ? Math.round((totalPengeluaran / totalPemasukan) * 100) : 0}%
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            Beban biaya terhadap omzet kas
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
            placeholder="Cari transaksi atau kategori..."
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

        {/* Filter Tipe */}
        <div style={{ minWidth: '135px' }}>
          <select
            value={filterTipe}
            onChange={e => setFilterTipe(e.target.value)}
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
            <option value="">Semua Arus Kas</option>
            <option value="pemasukan">↑ Pemasukan</option>
            <option value="pengeluaran">↓ Pengeluaran</option>
          </select>
        </div>

        {/* Filter Kategori */}
        <div style={{ minWidth: '140px' }}>
          <select
            value={filterKategori}
            onChange={e => setFilterKategori(e.target.value)}
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
            <option value="">Semua Kategori</option>
            {allKategori.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        {/* Date From & To */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            style={{
              padding: '7px 9px',
              border: '1px solid #E6DED4',
              borderRadius: '7px',
              fontSize: '12px',
              color: '#4A3B30',
              background: '#FAF7F2',
            }}
          />
          <span style={{ fontSize: '12px', color: '#9C8B7E' }}>s/d</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            style={{
              padding: '7px 9px',
              border: '1px solid #E6DED4',
              borderRadius: '7px',
              fontSize: '12px',
              color: '#4A3B30',
              background: '#FAF7F2',
            }}
          />
        </div>

        {/* Reset Button */}
        {hasActiveFilter && (
          <button
            onClick={resetFilters}
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
          {filteredTx.length} dari {transactions.length} transaksi
        </div>
      </div>

      {/* ── [4] BUKU KAS TRANSAKSI (Honest Table Ledger) ─────────────── */}
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
                <th style={{ padding: '11px 18px' }}>Tanggal & Waktu</th>
                <th style={{ padding: '11px 18px' }}>Jenis</th>
                <th style={{ padding: '11px 18px' }}>Kategori</th>
                <th style={{ padding: '11px 18px' }}>Keterangan Catatan</th>
                <th style={{ padding: '11px 18px', textAlign: 'right' }}>Nominal</th>
                <th style={{ padding: '11px 18px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <FileText size={28} color="#D4C5B9" />
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#7D6B5C' }}>
                        Tidak ada transaksi ditemukan
                      </div>
                      <div style={{ fontSize: '12px', color: '#9C8B7E' }}>
                        Sesuaikan kata kunci atau rentang tanggal filter.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTx.map(tx => {
                  const isIncome = tx.tipe === 'pemasukan';

                  return (
                    <tr
                      key={tx.id}
                      style={{
                        borderBottom: '1px solid #F3EDE6',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAF7F2'}
                      onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                    >
                      {/* Tanggal & Waktu */}
                      <td style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: '600', color: '#241B14' }}>{tx.tanggal}</div>
                        <div style={{ color: '#9C8B7E', fontSize: '11.5px', marginTop: '2px' }}>{tx.jam} WIB</div>
                      </td>

                      {/* Jenis Badge */}
                      <td style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: isIncome ? '#F0FDF4' : '#FEF2F2',
                          color: isIncome ? '#166534' : '#991B1B',
                          fontSize: '11.5px',
                          fontWeight: '600',
                        }}>
                          <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: isIncome ? '#16A34A' : '#DC2626',
                          }} />
                          {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
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
                          {tx.kategori}
                        </span>
                      </td>

                      {/* Keterangan */}
                      <td style={{ padding: '12px 18px', color: '#6E5D4F', maxWidth: '280px' }}>
                        <div style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {tx.catatan || <span style={{ color: '#D4C5B9', fontStyle: 'italic' }}>—</span>}
                        </div>
                      </td>

                      {/* Nominal (Right-aligned, tabular figures) */}
                      <td style={{
                        padding: '12px 18px',
                        textAlign: 'right',
                        fontWeight: '700',
                        color: isIncome ? '#166534' : '#241B14',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}>
                        {isIncome ? '+' : '−'} {formatRupiah(tx.nominal)}
                      </td>

                      {/* Aksi Hapus */}
                      <td style={{ padding: '12px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => setDeleteTarget(tx)}
                          title="Hapus transaksi"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#9C8B7E',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#DC2626'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#9C8B7E'; }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Ledger Footer / Subtotal */}
        {filteredTx.length > 0 && (
          <div style={{
            padding: '12px 18px',
            borderTop: '1px solid #E6DED4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            background: '#FAF7F2',
            fontSize: '12px',
          }}>
            <span style={{ color: '#7D6B5C' }}>
              Menampilkan {filteredTx.length} baris transaksi
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {filteredPemasukan > 0 && (
                <span style={{ color: '#166534', fontWeight: '600' }}>
                  Masuk: +{formatRupiah(filteredPemasukan)}
                </span>
              )}
              {filteredPengeluaran > 0 && (
                <span style={{ color: '#6E5D4F', fontWeight: '600' }}>
                  Keluar: −{formatRupiah(filteredPengeluaran)}
                </span>
              )}
              <span style={{
                color: '#241B14',
                fontWeight: '700',
                paddingLeft: '8px',
                borderLeft: '1px solid #D4C5B9',
              }}>
                Bersih: {formatRupiah(filteredPemasukan - filteredPengeluaran)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── [5] MODALS ───────────────────────────────────────────────── */}
      {showForm && (
        <TransactionModal
          onClose={() => setShowForm(false)}
          onSubmit={handleAdd}
        />
      )}

      <DeleteConfirmModal
        tx={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
