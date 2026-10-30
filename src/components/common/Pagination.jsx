import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // If there are no items, show simple empty info
  if (totalItems === 0) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 18px',
        borderTop: '1px solid #E6DED4',
        background: '#FAF7F2',
        fontSize: '12.5px',
        color: '#6E5D4F',
      }}
    >
      {/* Range Information */}
      <div style={{ fontVariantNumeric: 'tabular-nums' }}>
        Menampilkan{' '}
        <span style={{ fontWeight: '600', color: '#241B14' }}>{startItem}</span>
        {' '}–{' '}
        <span style={{ fontWeight: '600', color: '#241B14' }}>{endItem}</span>
        {' '}dari{' '}
        <span style={{ fontWeight: '600', color: '#241B14' }}>{totalItems}</span>
        {' '}data ({itemsPerPage} baris/halaman)
      </div>

      {/* Page Navigation Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          title="Halaman Sebelumnya"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid #E6DED4',
            background: currentPage <= 1 ? '#F3EDE6' : '#FFFFFF',
            color: currentPage <= 1 ? '#A8998C' : '#4A3B30',
            fontSize: '12px',
            fontWeight: '600',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            transition: 'background 0.12s, border-color 0.12s',
          }}
        >
          <ChevronLeft size={14} />
          <span>Sebelumnya</span>
        </button>

        {/* Numbered Page Buttons */}
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{
                  padding: '4px 6px',
                  color: '#A8998C',
                  fontSize: '12px',
                  userSelect: 'none',
                }}
              >
                ...
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={`page-${p}`}
              onClick={() => onPageChange(p)}
              style={{
                minWidth: '30px',
                height: '30px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 6px',
                borderRadius: '6px',
                border: isActive ? '1px solid #C25E34' : '1px solid #E6DED4',
                background: isActive ? '#C25E34' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#4A3B30',
                fontSize: '12px',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                fontVariantNumeric: 'tabular-nums',
                transition: 'background 0.12s, color 0.12s',
              }}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Halaman Berikutnya"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid #E6DED4',
            background: currentPage >= totalPages ? '#F3EDE6' : '#FFFFFF',
            color: currentPage >= totalPages ? '#A8998C' : '#4A3B30',
            fontSize: '12px',
            fontWeight: '600',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            transition: 'background 0.12s, border-color 0.12s',
          }}
        >
          <span>Berikutnya</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
