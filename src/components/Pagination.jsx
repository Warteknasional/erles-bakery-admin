import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    border: '1px solid var(--color-border, #E8D9C5)',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    background: '#FFFFFF',
    color: 'var(--color-text-secondary, #705847)',
    padding: '0 6px',
  };

  const btnActive = {
    ...btnBase,
    background: 'var(--color-primary, #D97748)',
    color: '#FFFFFF',
    border: '1px solid var(--color-primary, #D97748)',
    boxShadow: '0 2px 6px rgba(217, 119, 72, 0.25)',
  };

  const btnDisabled = {
    ...btnBase,
    opacity: 0.35,
    cursor: 'not-allowed',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        margin: '16px 0 8px',
        flexWrap: 'wrap',
      }}
      aria-label="Navigasi halaman"
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
          <button style={btnBase} onClick={() => onPageChange(1)} aria-label="Ke halaman 1">1</button>
          {start > 2 && <span style={{ color: 'var(--color-text-muted, #9E8776)', fontSize: '13px', padding: '0 2px' }}>…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          style={p === currentPage ? btnActive : btnBase}
          onClick={() => onPageChange(p)}
          aria-label={`Halaman ${p}`}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {end < lastPage && (
        <>
          {end < lastPage - 1 && <span style={{ color: 'var(--color-text-muted, #9E8776)', fontSize: '13px', padding: '0 2px' }}>…</span>}
          <button style={btnBase} onClick={() => onPageChange(lastPage)} aria-label={`Ke halaman ${lastPage}`}>{lastPage}</button>
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
