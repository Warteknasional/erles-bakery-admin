import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ShoppingBag, Plus, Search, Filter,
  RotateCcw, X, Edit2, Trash2, Tag, ChevronDown,
  AlertTriangle, RefreshCw
} from 'lucide-react';
import Pagination from '../components/common/Pagination';
import productService from '../services/productService';
import useToast from '../hooks/useToast';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num || 0);
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

function ProductFormModal({ product, categories, onClose, onSave }) {
  const isEditing = Boolean(product);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: product ? product.id : null,
    nama: product ? product.nama : '',
    sku: product ? product.sku : `PRD-00${Math.floor(Math.random() * 90 + 10)}`,
    category_id: product?.category_id || (categories[0]?.id || 1),
    kategori: product ? product.kategori : (categories[0]?.name || 'Roti'),
    hargaJual: product ? product.hargaJual : '',
    hpp: product ? product.hpp : '',
    stok: product ? product.stok : '',
    deskripsi: product ? product.deskripsi || '' : '',
    status: product ? product.status : 'Tersedia',
    emoji: product ? product.emoji : '🍞',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jual = parseFloat(formData.hargaJual) || 0;
    const hpp = parseFloat(formData.hpp) || 0;
    const stk = parseInt(formData.stok, 10) || 0;

    let computedStatus = formData.status;
    if (stk === 0 && computedStatus === 'Tersedia') {
      computedStatus = 'Sold Out';
    }

    setLoading(true);
    await onSave({
      ...formData,
      hargaJual: jual,
      hpp,
      stok: stk,
      status: computedStatus,
    });
    setLoading(false);
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
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1099,
          background: 'rgba(36, 27, 20, 0.45)',
          backdropFilter: 'blur(2px)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          zIndex: 1100,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(460px, calc(100vw - 32px))',
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          boxShadow: '0 16px 40px rgba(36, 27, 20, 0.14)',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #EFEAE3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '15px',
                fontWeight: '700',
                color: '#241B14',
                margin: '0 0 2px',
              }}
            >
              {isEditing ? 'Perbarui Data Produk' : 'Tambah Produk Baru ke Etalase'}
            </h2>
            <p style={{ fontSize: '12px', color: '#8C7A6B', margin: 0 }}>
              Katalog roti, kue, dan pastry terintegrasi database
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#8C7A6B',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            overflowY: 'auto',
          }}
        >
          <div>
            <label style={labelStyle}>Nama Produk *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Roti Coklat Klasik"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              style={fieldStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>SKU / Kode</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Kategori</label>
              <select
                value={formData.category_id}
                onChange={(e) => {
                  const catId = Number(e.target.value);
                  const selected = categories.find((c) => c.id === catId);
                  setFormData({
                    ...formData,
                    category_id: catId,
                    kategori: selected ? selected.name : formData.kategori,
                  });
                }}
                style={{ ...fieldStyle, cursor: 'pointer' }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
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
                min="100"
                placeholder="25000"
                value={formData.hargaJual}
                onChange={(e) => setFormData({ ...formData, hargaJual: e.target.value })}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Estimasi HPP (Rp)</label>
              <input
                type="number"
                min="0"
                placeholder="15000"
                value={formData.hpp}
                onChange={(e) => setFormData({ ...formData, hpp: e.target.value })}
                style={fieldStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Stok Etalase *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="20"
                value={formData.stok}
                onChange={(e) => {
                  const val = e.target.value;
                  const num = parseInt(val, 10);
                  setFormData((prev) => ({
                    ...prev,
                    stok: val,
                    status: num === 0 ? 'Sold Out' : (prev.status === 'Sold Out' ? 'Tersedia' : prev.status),
                  }));
                }}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Status Produk</label>
              <select
                value={formData.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    status: newStatus,
                    stok: newStatus === 'Sold Out' ? 0 : (prev.stok === 0 || prev.stok === '0' ? 10 : prev.stok),
                  }));
                }}
                style={{ ...fieldStyle, cursor: 'pointer' }}
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Sold Out">Sold Out</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Deskripsi Produk</label>
            <textarea
              rows={2}
              placeholder="Deskripsi singkat produk untuk etalase..."
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              style={{ ...fieldStyle, resize: 'vertical' }}
            />
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              paddingTop: '8px',
              borderTop: '1px solid #EFEAE3',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #E6DED4',
                background: '#FFFFFF',
                color: '#5C4A3C',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#241B14',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah ke Etalase'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ─── Modal Konfirmasi Hapus Produk ───────────────────────────────────────────

function DeleteConfirmModal({ product, onClose, onConfirm }) {
  if (!product) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1099,
          background: 'rgba(36, 27, 20, 0.45)',
          backdropFilter: 'blur(2px)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          zIndex: 1100,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(360px, calc(100vw - 32px))',
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E6DED4',
          boxShadow: '0 16px 40px rgba(36, 27, 20, 0.14)',
          padding: '24px 24px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#FEF2F2',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertTriangle size={22} color="#DC2626" />
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#241B14', margin: '0 0 6px' }}>
          Hapus Produk?
        </h3>
        <p style={{ fontSize: '13px', color: '#6E5D4F', margin: '0 0 16px', lineHeight: 1.4 }}>
          Produk <strong>{product.nama}</strong> akan dihapus permanen dari sistem database.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #E6DED4',
              background: '#FFFFFF',
              color: '#5C4A3C',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(product.id)}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: '#DC2626',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '600',
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
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [modalState, setModalState] = useState({ isOpen: false, product: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Ambil data produk & kategori dari Backend API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts({ per_page: 100, is_active: 'all' }),
        productService.getCategories(),
      ]);

      if (catRes?.data) {
        setCategories(catRes.data);
      }

      if (prodRes?.data) {
        const mapped = prodRes.data.map((p) => {
          let status = 'Tersedia';
          if (!p.is_active) status = 'Tidak Aktif';
          else if (p.stok <= 0) status = 'Sold Out';

          return {
            id: p.id,
            nama: p.nama,
            sku: p.slug ? p.slug.toUpperCase() : `PRD-${p.id}`,
            category_id: p.category_id,
            kategori: p.kategori || 'Roti',
            hargaJual: Number(p.harga) || 0,
            hpp: Math.round((Number(p.harga) || 0) * 0.55),
            stok: Number(p.stok) || 0,
            deskripsi: p.deskripsi || '',
            status,
            emoji: p.kategori === 'Hampers' ? '🎁' : p.kategori === 'Kue Kering' ? '🍪' : p.kategori === 'Kue' ? '🍰' : '🍞',
          };
        });
        setProducts(mapped);
      }
    } catch (err) {
      console.error('Gagal mengambil data produk:', err);
      showToast('Gagal memuat produk dari server backend.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Simpan Produk (Tambah Baru atau Update)
  const handleSaveProduct = async (prodData) => {
    try {
      const payload = {
        nama: prodData.nama,
        category_id: prodData.category_id,
        kategori: prodData.kategori,
        harga: prodData.hargaJual,
        stok: prodData.status === 'Sold Out' ? 0 : prodData.stok,
        deskripsi: prodData.deskripsi,
        is_active: prodData.status !== 'Tidak Aktif',
      };

      if (modalState.product) {
        await productService.updateProduct(prodData.id, payload);
        showToast(`Produk "${prodData.nama}" berhasil diperbarui!`, 'success');
      } else {
        await productService.createProduct(payload);
        showToast(`Produk "${prodData.nama}" berhasil ditambahkan ke etalase!`, 'success');
      }

      setModalState({ isOpen: false, product: null });
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menyimpan data produk.';
      showToast(msg, 'error');
    }
  };

  // Hapus Produk
  const handleDeleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      showToast('Produk berhasil dihapus dari etalase.', 'success');
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menghapus produk.';
      showToast(msg, 'error');
    }
  };

  // Metrics
  const totalProduk = products.length;
  const totalTersedia = products.filter((p) => p.status === 'Tersedia').length;
  const totalSoldOut = products.filter((p) => p.status === 'Sold Out').length;
  const avgMargin = Math.round(
    products.reduce((acc, p) => acc + ((p.hargaJual - p.hpp) / Math.max(p.hargaJual, 1)), 0) /
      Math.max(products.length, 1) *
      100
  );

  const categoryOptions = useMemo(() => {
    const list = ['Semua Kategori'];
    categories.forEach((c) => {
      if (!list.includes(c.name)) list.push(c.name);
    });
    return list;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === 'Semua Kategori' ? true : p.kategori === selectedCategory;
      const matchStatus = selectedStatus === 'Semua Status' ? true : p.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const hasFilter =
    searchTerm || selectedCategory !== 'Semua Kategori' || selectedStatus !== 'Semua Status';

  const resetFilter = () => {
    setSearchTerm('');
    setSelectedCategory('Semua Kategori');
    setSelectedStatus('Semua Status');
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
            <span>KATALOG ETALASE & PRODUK</span>
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
            Katalog Produk & Varian
          </h1>

          <p style={{ fontSize: '13px', color: '#6E5D4F', margin: 0 }}>
            Manajemen master harga, ketersediaan stok etalase, dan kategori produk
          </p>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={loadData}
            title="Muat ulang produk"
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3D2D22';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#241B14';
            }}
          >
            <Plus size={15} />
            Tambah Produk
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
            Total Katalog Produk
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#241B14',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: '6px',
            }}
          >
            {totalProduk} <span style={{ fontSize: '15px', fontWeight: '500', color: '#8C7A6B' }}>varian</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>
            {categories.length} kategori aktif
          </div>
        </div>

        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Produk Tersedia
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
            {totalTersedia} <span style={{ fontSize: '15px', fontWeight: '500', color: '#8C7A6B' }}>siap jual</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>Stok etalase aktif & cukup</div>
        </div>

        <div style={{ padding: '20px 24px', borderRight: '1px solid #EFEAE3' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Produk Habis (Sold Out)
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: totalSoldOut > 0 ? '#DC2626' : '#241B14',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: '6px',
            }}
          >
            {totalSoldOut} <span style={{ fontSize: '15px', fontWeight: '500', color: '#8C7A6B' }}>habis</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>Perlu proses baking berikutnya</div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#7D6B5C', marginBottom: '8px' }}>
            Rata-rata Margin Jual
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#241B14',
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: '6px',
            }}
          >
            ~{avgMargin}%
          </div>
          <div style={{ fontSize: '12px', color: '#8C7A6B' }}>Kalkulasi margin kotor dari HPP</div>
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
          {/* Search Bar */}
          <div
            style={{
              position: 'relative',
              minWidth: '220px',
              maxWidth: '300px',
              flex: 1,
            }}
          >
            <Search
              size={14}
              color="#8C7A6B"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Cari nama atau SKU..."
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

          {/* Kategori Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
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
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
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
            <option value="Semua Status">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Sold Out">Sold Out</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
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
          Menampilkan <strong>{filteredProducts.length}</strong> produk
        </div>
      </div>

      {/* ── [4] TABEL PRODUK ─────────────────────────────────────────── */}
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
                <th style={{ padding: '10px 18px' }}>Produk</th>
                <th style={{ padding: '10px 18px' }}>SKU</th>
                <th style={{ padding: '10px 18px' }}>Kategori</th>
                <th style={{ padding: '10px 18px', textAlign: 'right' }}>Harga Jual</th>
                <th style={{ padding: '10px 18px', textAlign: 'right' }}>Est. HPP</th>
                <th style={{ padding: '10px 18px', textAlign: 'center' }}>Stok</th>
                <th style={{ padding: '10px 18px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '10px 18px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#8C7A6B' }}>
                    Memuat katalog produk dari database backend...
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#8C7A6B' }}>
                    Tidak ada produk yang cocok dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const badge = getStatusBadge(p.status);

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid #F3EDE6',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF7F2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                    >
                      {/* Nama Produk & Emoji */}
                      <td style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '18px' }}>{p.emoji}</span>
                          <div>
                            <div style={{ fontWeight: '600', color: '#241B14' }}>{p.nama}</div>
                            {p.deskripsi && (
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: '#8C7A6B',
                                  maxWidth: '220px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {p.deskripsi}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td
                        style={{
                          padding: '12px 18px',
                          color: '#6E5D4F',
                          fontSize: '12px',
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.sku}
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
                          {p.kategori}
                        </span>
                      </td>

                      {/* Harga Jual */}
                      <td
                        style={{
                          padding: '12px 18px',
                          textAlign: 'right',
                          fontWeight: '600',
                          color: '#241B14',
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatRupiah(p.hargaJual)}
                      </td>

                      {/* HPP */}
                      <td
                        style={{
                          padding: '12px 18px',
                          textAlign: 'right',
                          color: '#8C7A6B',
                          fontSize: '12px',
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatRupiah(p.hpp)}
                      </td>

                      {/* Stok */}
                      <td
                        style={{
                          padding: '12px 18px',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: p.stok === 0 ? '#DC2626' : p.stok < 10 ? '#D97706' : '#241B14',
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.stok} pcs
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 18px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: badge.bg,
                            color: badge.text,
                            fontSize: '11.5px',
                            fontWeight: '600',
                          }}
                        >
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              background: badge.dot,
                            }}
                          />
                          {badge.label || p.status}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td style={{ padding: '12px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => setModalState({ isOpen: true, product: p })}
                            title="Edit Produk"
                            style={{
                              padding: '5px',
                              borderRadius: '6px',
                              border: '1px solid #E2D9CE',
                              background: '#FFFFFF',
                              color: '#5C4A3C',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            title="Hapus Produk"
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
          totalItems={filteredProducts.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal Form Tambah/Edit */}
      {modalState.isOpen && (
        <ProductFormModal
          product={modalState.product}
          categories={categories}
          onClose={() => setModalState({ isOpen: false, product: null })}
          onSave={handleSaveProduct}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
        <DeleteConfirmModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteProduct}
        />
      )}
    </div>
  );
}
