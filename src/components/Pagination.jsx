import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Komponen pagination — menampilkan tombol halaman.
 * Props: currentPage, lastPage, onPageChange
 */
export default function Pagination({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(lastPage, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const btnBase = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    height: '36px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    background: 'white',
    color: '#64748B',
    padding: '0 4px',
  };

  const btnActive = {
    ...btnBase,
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    color: 'white',
    border: '1px solid #6366F1',
    boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
  };

  const btnDisabled = {
    ...btnBase,
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '20px',
        flexWrap: 'wrap',
      }}
    >
      <button
        style={currentPage === 1 ? btnDisabled : btnBase}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft size={16} />
      </button>

      {start > 1 && (
        <>
          <button style={btnBase} onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span style={{ color: '#94A3B8', fontSize: '13px', padding: '0 2px' }}>…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          style={p === currentPage ? btnActive : btnBase}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {end < lastPage && (
        <>
          {end < lastPage - 1 && <span style={{ color: '#94A3B8', fontSize: '13px', padding: '0 2px' }}>…</span>}
          <button style={btnBase} onClick={() => onPageChange(lastPage)}>{lastPage}</button>
        </>
      )}

      <button
        style={currentPage === lastPage ? btnDisabled : btnBase}
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Halaman berikutnya"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
