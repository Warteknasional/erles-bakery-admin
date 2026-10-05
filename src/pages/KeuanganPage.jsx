import { useState, useMemo } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, Plus, DollarSign,
  Search, Filter, Calendar, RotateCcw, Trash2, X,
  ChevronDown, Tag, FileText, AlertTriangle,
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

// ─── Komponen Kartu Summary ───────────────────────────────────────────────────

function SummaryCard({ icon: Icon, label, value, accent, bg, sub }) {
  return (
    <div
      style={{
        background: 'white', borderRadius: '12px',
        padding: '20px 22px', border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        borderLeft: `4px solid ${accent}`,
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(99,102,241,0.10)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: '600' }}>{label}</span>
        <div style={{ background: bg, borderRadius: '9px', padding: '8px', display: 'flex' }}>
          <Icon size={18} color={accent} />
        </div>
      </div>
      <div style={{ fontSize: '22px', fontWeight: '800', color: accent, letterSpacing: '-0.3px' }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{sub}</div>
      )}
    </div>
  );
}

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
    width: '100%', padding: '10px 12px',
    border: `1.5px solid ${hasError ? '#EF4444' : '#E2E8F0'}`,
    borderRadius: '9px', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  });

  const labelStyle = {
    display: 'block', fontSize: '12.5px',
    fontWeight: '600', color: '#64748B', marginBottom: '6px',
  };

  const isIncome = form.tipe === 'pemasukan';

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)',
        animation: 'fadeInKeu 0.15s ease',
      }} />
      <style>{`
        @keyframes fadeInKeu  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpKeu { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Modal */}
      <div style={{
        position: 'fixed', zIndex: 1000,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(520px, calc(100vw - 48px))',
        maxHeight: 'calc(100vh - 80px)',
        background: '#FFFFFF', borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(30, 27, 75, 0.20)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        animation: 'slideUpKeu 0.2s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #F1F5F9',
          background: isIncome
            ? 'linear-gradient(135deg, #064E3B, #059669)'
            : 'linear-gradient(135deg, #7F1D1D, #DC2626)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '500', marginBottom: '3px' }}>
              Catat Transaksi Baru
            </div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF' }}>
              {isIncome ? '↑ Pemasukan' : '↓ Pengeluaran'}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px',
            width: '34px', height: '34px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'white',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Tipe toggle */}
          <div>
            <label style={labelStyle}>Tipe Transaksi</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['pemasukan', 'pengeluaran'].map(t => (
                <button key={t} type="button"
                  onClick={() => setForm(f => ({ ...f, tipe: t, kategori: '' }))}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '9px',
                    border: `2px solid ${form.tipe === t ? (t === 'pemasukan' ? '#10B981' : '#EF4444') : '#E2E8F0'}`,
                    background: form.tipe === t ? (t === 'pemasukan' ? '#D1FAE5' : '#FEE2E2') : 'white',
                    color: form.tipe === t ? (t === 'pemasukan' ? '#065F46' : '#991B1B') : '#64748B',
                    fontWeight: '700', fontSize: '13.5px', cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  {t === 'pemasukan' ? '↑ Pemasukan' : '↓ Pengeluaran'}
                </button>
              ))}
            </div>
          </div>

          {/* Nominal */}
          <div>
            <label style={labelStyle}>Nominal (Rp)</label>
            <input
              type="number" min="1" required
              value={form.nominal}
              onChange={e => { setForm(f => ({ ...f, nominal: e.target.value })); setErrors(ev => ({ ...ev, nominal: '' })); }}
              placeholder="Contoh: 500000"
              style={fieldStyle(errors.nominal)}
              onFocus={e => { if (!errors.nominal) e.target.style.borderColor = '#6366F1'; }}
              onBlur={e => { if (!errors.nominal) e.target.style.borderColor = '#E2E8F0'; }}
            />
            {errors.nominal && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.nominal}</div>}
          </div>

          {/* Kategori */}
          <div>
            <label style={labelStyle}>Kategori</label>
            <div style={{ position: 'relative' }}>
              <select
                required value={form.kategori}
                onChange={e => { setForm(f => ({ ...f, kategori: e.target.value })); setErrors(ev => ({ ...ev, kategori: '' })); }}
                style={{ ...fieldStyle(errors.kategori), appearance: 'none', cursor: 'pointer' }}
              >
                <option value="">Pilih Kategori</option>
                {currentKategori.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }} />
            </div>
            {errors.kategori && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.kategori}</div>}
          </div>

          {/* Tanggal dan jam setempat */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <div>
              <label htmlFor="transaksi-tanggal" style={labelStyle}>Tanggal</label>
              <input
                id="transaksi-tanggal" type="date" required
                value={form.tanggal}
                onChange={e => { setForm(f => ({ ...f, tanggal: e.target.value })); setErrors(ev => ({ ...ev, tanggal: '' })); }}
                style={fieldStyle(errors.tanggal)}
              />
              {errors.tanggal && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.tanggal}</div>}
            </div>
            <div>
              <label htmlFor="transaksi-jam" style={labelStyle}>Jam</label>
              <input
                id="transaksi-jam" type="time" required
                value={form.jam}
                onChange={e => { setForm(f => ({ ...f, jam: e.target.value })); setErrors(ev => ({ ...ev, jam: '' })); }}
                style={fieldStyle(errors.jam)}
              />
              {errors.jam && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.jam}</div>}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label style={labelStyle}>Catatan <span style={{ color: '#CBD5E1', fontWeight: '400' }}>(opsional)</span></label>
            <input
              type="text"
              value={form.catatan}
              onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
              placeholder="Keterangan transaksi..."
              style={fieldStyle(false)}
              onFocus={e => e.target.style.borderColor = '#6366F1'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 20px', border: '1.5px solid #E2E8F0',
              borderRadius: '9px', background: 'white', cursor: 'pointer',
              fontWeight: '600', fontSize: '14px', color: '#64748B',
              fontFamily: 'inherit', transition: 'background 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              Batal
            </button>
            <button type="submit" style={{
              padding: '10px 24px',
              background: isIncome
                ? 'linear-gradient(135deg, #059669, #10B981)'
                : 'linear-gradient(135deg, #DC2626, #EF4444)',
              color: 'white', border: 'none', borderRadius: '9px',
              fontWeight: '700', fontSize: '14px', cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: isIncome
                ? '0 3px 10px rgba(16,185,129,0.30)'
                : '0 3px 10px rgba(239,68,68,0.30)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ─── Konfirmasi Hapus ─────────────────────────────────────────────────────────

function DeleteConfirmModal({ tx, onClose, onConfirm }) {
  if (!tx) return null;
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 1099,
        background: 'rgba(15, 23, 42, 0.50)', backdropFilter: 'blur(3px)',
      }} />
      <div style={{
        position: 'fixed', zIndex: 1100,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(380px, calc(100vw - 48px))',
        background: '#FFFFFF', borderRadius: '14px',
        boxShadow: '0 20px 50px rgba(30, 27, 75, 0.18)',
        padding: '28px 28px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '54px', height: '54px', borderRadius: '50%',
          background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AlertTriangle size={26} color="#EF4444" />
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
            Hapus Transaksi?
          </div>
          <div style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.5 }}>
            <strong style={{ color: '#EF4444' }}>{tx.catatan || tx.kategori}</strong> senilai{' '}
            <strong>{formatRupiah(tx.nominal)}</strong> akan dihapus permanen.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <button onClick={onClose} style={{
            padding: '9px 22px', borderRadius: '9px',
            border: '1.5px solid #E2E8F0', background: 'white',
            fontWeight: '600', fontSize: '14px', cursor: 'pointer',
            color: '#64748B', fontFamily: 'inherit',
          }}>
            Batal
          </button>
          <button onClick={() => { onConfirm(tx.id); onClose(); }} style={{
            padding: '9px 22px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
            color: 'white', border: 'none',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 3px 10px rgba(239,68,68,0.30)',
          }}>
            Ya, Hapus
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function KeuanganPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filter states
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

  // Summary (selalu dari data lengkap, tidak dipengaruhi filter)
  const totalPemasukan   = transactions.filter(t => t.tipe === 'pemasukan').reduce((s, t) => s + t.nominal, 0);
  const totalPengeluaran = transactions.filter(t => t.tipe === 'pengeluaran').reduce((s, t) => s + t.nominal, 0);
  const saldo            = totalPemasukan - totalPengeluaran;

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

  // Subtotal filtered
  const filteredPemasukan   = filteredTx.filter(t => t.tipe === 'pemasukan').reduce((s, t) => s + t.nominal, 0);
  const filteredPengeluaran = filteredTx.filter(t => t.tipe === 'pengeluaran').reduce((s, t) => s + t.nominal, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── [A] Header ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1, #312E81)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.30)',
          }}>
            <Wallet size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1E1B4B', margin: 0, letterSpacing: '-0.3px' }}>
              Keuangan
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
              {transactions.length} transaksi tercatat
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #6366F1, #312E81)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(99,102,241,0.30)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(99,102,241,0.40)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(99,102,241,0.30)'; }}
        >
          <Plus size={17} />
          Catat Transaksi
        </button>
      </div>

      {/* ── [B] Summary Cards ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
        <SummaryCard
          icon={TrendingUp} label="Total Pemasukan"
          value={formatRupiah(totalPemasukan)}
          accent="#10B981" bg="#D1FAE5"
          sub={`${transactions.filter(t => t.tipe === 'pemasukan').length} transaksi masuk`}
        />
        <SummaryCard
          icon={TrendingDown} label="Total Pengeluaran"
          value={formatRupiah(totalPengeluaran)}
          accent="#EF4444" bg="#FEE2E2"
          sub={`${transactions.filter(t => t.tipe === 'pengeluaran').length} transaksi keluar`}
        />
        <SummaryCard
          icon={DollarSign} label="Saldo Bersih"
          value={formatRupiah(saldo)}
          accent={saldo >= 0 ? '#6366F1' : '#EF4444'}
          bg={saldo >= 0 ? '#E0E7FF' : '#FEE2E2'}
          sub={saldo >= 0 ? 'Kondisi keuangan sehat ✓' : '⚠ Pengeluaran melebihi pemasukan'}
        />
      </div>

      {/* ── [C] Filter Bar ──────────────────────────────────────────── */}
      <div style={{
        background: 'white', borderRadius: '12px',
        border: '1px solid #E2E8F0', padding: '16px 20px',
        display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text" placeholder="Cari catatan atau kategori..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 38px',
              border: '1.5px solid #E2E8F0', borderRadius: '9px',
              fontSize: '13.5px', outline: 'none', boxSizing: 'border-box',
              fontFamily: 'inherit', transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#6366F1'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
          />
        </div>

        {/* Filter Tipe */}
        <div style={{ position: 'relative', minWidth: '148px' }}>
          <Filter size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <select
            value={filterTipe} onChange={e => setFilterTipe(e.target.value)}
            style={{
              width: '100%', padding: '9px 30px 9px 32px',
              border: '1.5px solid #E2E8F0', borderRadius: '9px',
              fontSize: '13.5px', outline: 'none', appearance: 'none',
              background: 'white', cursor: 'pointer', fontFamily: 'inherit',
              color: filterTipe ? '#1E293B' : '#94A3B8',
            }}
          >
            <option value="">Semua Tipe</option>
            <option value="pemasukan">↑ Pemasukan</option>
            <option value="pengeluaran">↓ Pengeluaran</option>
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }} />
        </div>

        {/* Filter Kategori */}
        <div style={{ position: 'relative', minWidth: '155px' }}>
          <Tag size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <select
            value={filterKategori} onChange={e => setFilterKategori(e.target.value)}
            style={{
              width: '100%', padding: '9px 30px 9px 32px',
              border: '1.5px solid #E2E8F0', borderRadius: '9px',
              fontSize: '13.5px', outline: 'none', appearance: 'none',
              background: 'white', cursor: 'pointer', fontFamily: 'inherit',
              color: filterKategori ? '#1E293B' : '#94A3B8',
            }}
          >
            <option value="">Semua Kategori</option>
            {allKategori.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }} />
        </div>

        {/* Rentang tanggal, termasuk kedua batasnya */}
        {[
          { id: 'filter-dari', label: 'Dari', value: dateFrom, onChange: value => { setDateFrom(value); if (dateTo && value && value > dateTo) setDateTo(''); } },
          { id: 'filter-sampai', label: 'Sampai', value: dateTo, onChange: setDateTo, min: dateFrom || undefined },
        ].map(filter => (
          <div key={filter.id} style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: '190px' }}>
            <label htmlFor={filter.id} style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>
              {filter.label}
            </label>
            <div style={{ position: 'relative', flex: 1 }}>
              <Calendar size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
              <input
                id={filter.id} type="date" value={filter.value}
                min={filter.min} max={filter.max}
                onChange={e => filter.onChange(e.target.value)}
                style={{
                  width: '100%', padding: '9px 8px 9px 30px',
                  border: '1.5px solid #E2E8F0', borderRadius: '9px',
                  fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                  background: 'white', cursor: 'pointer', fontFamily: 'inherit', color: '#1E293B',
                }}
              />
            </div>
          </div>
        ))}

        {/* Reset */}
        {hasActiveFilter && (
          <button onClick={resetFilters} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 14px', borderRadius: '9px',
            border: '1.5px solid #EEF2FF', background: '#EEF2FF',
            color: '#6366F1', fontSize: '13px', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'background 0.15s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
          onMouseLeave={e => e.currentTarget.style.background = '#EEF2FF'}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        )}

        {/* Counter */}
        <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
          {filteredTx.length} dari {transactions.length} transaksi
        </div>
      </div>

      {/* ── [D] Tabel Transaksi ─────────────────────────────────────── */}
      <div style={{
        background: 'white', borderRadius: '14px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Tanggal & Jam', 'Tipe', 'Kategori', 'Catatan', 'Nominal', 'Aksi'].map(h => (
                  <th key={h} style={{
                    padding: '13px 16px', textAlign: 'left',
                    fontWeight: '700', color: '#64748B', fontSize: '12px',
                    borderBottom: '1px solid #E2E8F0',
                    whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.4px',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '56px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '14px',
                        background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <FileText size={24} color="#CBD5E1" />
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#94A3B8' }}>
                        Tidak ada transaksi ditemukan
                      </div>
                      <div style={{ fontSize: '13px', color: '#CBD5E1' }}>
                        Coba ubah filter atau kata kunci pencarian.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTx.map(tx => (
                  <tr key={tx.id}
                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAFF'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    {/* Tanggal */}
                    <td style={{ padding: '14px 16px', color: '#64748B', whiteSpace: 'nowrap', fontSize: '13px' }}>
                      <div>{tx.tanggal}</div>
                      <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '3px' }}>{tx.jam}</div>
                    </td>

                    {/* Tipe badge */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '4px 11px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                        backgroundColor: tx.tipe === 'pemasukan' ? '#D1FAE5' : '#FEE2E2',
                        color:           tx.tipe === 'pemasukan' ? '#065F46' : '#991B1B',
                      }}>
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                          background: tx.tipe === 'pemasukan' ? '#10B981' : '#EF4444',
                        }} />
                        {tx.tipe === 'pemasukan' ? 'Masuk' : 'Keluar'}
                      </span>
                    </td>

                    {/* Kategori */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px', borderRadius: '6px',
                        background: '#F1F5F9', color: '#475569',
                        fontSize: '12.5px', fontWeight: '600',
                      }}>
                        {tx.kategori}
                      </span>
                    </td>

                    {/* Catatan */}
                    <td style={{ padding: '14px 16px', color: '#64748B', maxWidth: '220px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tx.catatan || <span style={{ color: '#CBD5E1', fontStyle: 'italic' }}>—</span>}
                      </div>
                    </td>

                    {/* Nominal */}
                    <td style={{
                      padding: '14px 16px', fontWeight: '800',
                      color: tx.tipe === 'pemasukan' ? '#10B981' : '#EF4444',
                      whiteSpace: 'nowrap',
                    }}>
                      {tx.tipe === 'pemasukan' ? '+' : '-'}{formatRupiah(tx.nominal)}
                    </td>

                    {/* Aksi hapus */}
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => setDeleteTarget(tx)}
                        title="Hapus transaksi"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '34px', height: '34px', borderRadius: '8px',
                          border: '1.5px solid #FEE2E2', background: '#FEF2F2',
                          color: '#EF4444', cursor: 'pointer',
                          transition: 'background 0.12s, border-color 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.borderColor = '#FECACA'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderColor = '#FEE2E2'; }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredTx.length > 0 && (
          <div style={{
            padding: '12px 20px', borderTop: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '8px', background: '#FAFAFA',
          }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>
              Menampilkan {filteredTx.length} dari {transactions.length} transaksi
            </span>
            <div style={{ display: 'flex', gap: '20px' }}>
              {filteredPemasukan > 0 && (
                <span style={{ fontSize: '12.5px', color: '#10B981', fontWeight: '700' }}>
                  + {formatRupiah(filteredPemasukan)}
                </span>
              )}
              {filteredPengeluaran > 0 && (
                <span style={{ fontSize: '12.5px', color: '#EF4444', fontWeight: '700' }}>
                  − {formatRupiah(filteredPengeluaran)}
                </span>
              )}
              <span style={{
                fontSize: '12.5px', fontWeight: '800',
                color: (filteredPemasukan - filteredPengeluaran) >= 0 ? '#6366F1' : '#EF4444',
              }}>
                Net: {formatRupiah(filteredPemasukan - filteredPengeluaran)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────── */}
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
