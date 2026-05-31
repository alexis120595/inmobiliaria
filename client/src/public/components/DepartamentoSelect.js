import React, { useEffect, useRef, useState } from 'react';

const DepartamentoSelect = ({
  value,
  onChange,
  options,
  emptyLabel = 'Todas las zonas',
  className = ''
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt };
    }
    return { label: opt.label, value: opt.value };
  });

  const allOptions = [{ label: emptyLabel, value: '' }, ...normalizedOptions];
  const selectedOption = allOptions.find((opt) => opt.value === value);

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div className={`custom-depto-select ${className}`.trim()} ref={wrapperRef}>
      <button
        type="button"
        className={`custom-depto-trigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="custom-depto-trigger-text">{selectedOption ? selectedOption.label : emptyLabel}</span>
        <span className="custom-depto-chevron" aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="custom-depto-menu" role="listbox" aria-label="Seleccionar departamento">
          {allOptions.map((option) => {
            const selected = option.value === value;
            return (
              <button
                type="button"
                key={option.label}
                className={`custom-depto-option ${selected ? 'is-selected' : ''}`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={selected}
              >
                <span className="custom-depto-option-label">{option.label}</span>
                <span className={`custom-depto-radio ${selected ? 'is-selected' : ''}`} aria-hidden="true">
                  <span className="custom-depto-radio-dot"></span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DepartamentoSelect;
