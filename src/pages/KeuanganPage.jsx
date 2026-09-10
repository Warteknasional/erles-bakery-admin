import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, DollarSign } from 'lucide-react';

const dummyTransactions = [
  { id: 1, tipe: 'pemasukan', nominal: 1500000, kategori: 'Penjualan', catatan: 'Penjualan roti harian', tanggal: '2024-01-15' },
  { id: 2, tipe: 'pengeluaran', nominal: 350000, kategori: 'Bahan Baku', catatan: 'Beli tepung terigu 25kg', tanggal: '2024-01-15' },
  { id: 3, tipe: 'pemasukan', nominal: 2200000, kategori: 'Hampers', catatan: 'Pesanan hampers pernikahan', tanggal: '2024-01-14' },
  { id: 4, tipe: 'pengeluaran', nominal: 150000, kategori: 'Operasional', catatan: 'Biaya listrik', tanggal: '2024-01-14' },
  { id: 5, tipe: 'pemasukan', nominal: 800000, kategori: 'Penjualan', catatan: 'Penjualan kue kering', tanggal: '2024-01-13' },
];

const kategoriPemasukan = ['Penjualan', 'Hampers', 'Pesanan Khusus', 'Lainnya'];
const kategoriPengeluaran = ['Bahan Baku', 'Operasional', 'Gaji', 'Peralatan', 'Lainnya'];

export default function KeuanganPage() {
  const [transactions, setTransactions] = useState(dummyTransactions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    tipe: 'pemasukan',
    nominal: '',
    kategori: '',
    catatan: '',
    tanggal: new Date().toISOString().split('T')[0],
  });

  const totalPemasukan = transactions.filter(t => t.tipe === 'pemasukan').reduce((sum, t) => sum + t.nominal, 0);
  const totalPengeluaran = transactions.filter(t => t.tipe === 'pengeluaran').reduce((sum, t) => sum + t.nominal, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTx = {
      id: transactions.length + 1,
      ...form,
      nominal: Number(form.nominal),
    };
    setTransactions(prev => [newTx, ...prev]);
    setForm({ tipe: 'pemasukan', nominal: '', kategori: '', catatan: '', tanggal: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  const currentKategori = form.tipe === 'pemasukan' ? kategoriPemasukan : kategoriPengeluaran;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Wallet size={28} color="#6366F1" />
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', margin: 0 }}>Keuangan</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white',
            border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
            fontSize: '14px', transition: 'transform 0.15s', boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Plus size={18} /> Catat Transaksi
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Pemasukan', value: totalPemasukan, icon: TrendingUp, color: '#10B981', bg: '#D1FAE5' },
          { label: 'Total Pengeluaran', value: totalPengeluaran, icon: TrendingDown, color: '#EF4444', bg: '#FEE2E2' },
          { label: 'Saldo', value: saldo, icon: DollarSign, color: '#6366F1', bg: '#E0E7FF' },
        ].map((card) => (
          <div key={card.label} style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
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
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1E293B' }}>Catat Transaksi Baru</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748B', marginBottom: '6px' }}>Tipe</label>
              <select value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value, kategori: '' })}
                style={{ width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748B', marginBottom: '6px' }}>Nominal (Rp)</label>
              <input type="number" value={form.nominal} onChange={(e) => setForm({ ...form, nominal: e.target.value })} required min="1"
                style={{ width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748B', marginBottom: '6px' }}>Kategori</label>
              <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} required
                style={{ width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}>
                <option value="">Pilih Kategori</option>
                {currentKategori.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748B', marginBottom: '6px' }}>Tanggal</label>
              <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} required
                style={{ width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748B', marginBottom: '6px' }}>Catatan</label>
              <input type="text" value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Keterangan transaksi..."
                style={{ width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ padding: '10px 20px', border: '1px solid #E2E8F0', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}>
                Batal
              </button>
              <button type="submit"
                style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction List */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Tanggal', 'Tipe', 'Kategori', 'Catatan', 'Nominal'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #F1F5F9' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <td style={{ padding: '14px 16px', color: '#64748B' }}>{tx.tanggal}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                    backgroundColor: tx.tipe === 'pemasukan' ? '#D1FAE5' : '#FEE2E2',
                    color: tx.tipe === 'pemasukan' ? '#065F46' : '#991B1B',
                  }}>
                    {tx.tipe === 'pemasukan' ? '↑ Masuk' : '↓ Keluar'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#1E293B' }}>{tx.kategori}</td>
                <td style={{ padding: '14px 16px', color: '#64748B' }}>{tx.catatan}</td>
                <td style={{ padding: '14px 16px', fontWeight: '600', color: tx.tipe === 'pemasukan' ? '#10B981' : '#EF4444' }}>
                  {tx.tipe === 'pemasukan' ? '+' : '-'}{formatRupiah(tx.nominal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
