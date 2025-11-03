interface FilterBarProps {
  activeFilter: 'all' | 'high' | 'medium' | 'low';
  onFilterChange: (filter: 'all' | 'high' | 'medium' | 'low') => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters: Array<{
    id: 'all' | 'high' | 'medium' | 'low';
    label: string;
    emoji: string;
  }> = [
    { id: 'all', label: 'All Modules', emoji: '📚' },
    { id: 'low', label: 'Easy Risk', emoji: '🟢' },
    { id: 'medium', label: 'Medium Risk', emoji: '🟡' },
    { id: 'high', label: 'High Risk', emoji: '🔴' },
  ];

  return (
    <div className="flex items-center justify-center gap-2.5 mb-6 flex-wrap">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive 
                ? 'bg-success dark:bg-teal text-white' 
                : 'bg-card dark:bg-card text-primary dark:text-slate-200 border border-primary dark:border-slate-600'
            }`}
            style={{
              fontFamily: 'Public Sans, sans-serif',
              fontWeight: 600,
              fontSize: '0.875rem',
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isActive ? '0 0 6px rgba(46, 133, 64, 0.4)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.transform = 'scale(1.01)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.transform = 'scale(1)';
              } else {
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
          >
            <span className="mr-1.5">{filter.emoji}</span>
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
