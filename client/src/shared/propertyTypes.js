const normalizeText = (value) =>
  (value || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'lote / terreno', label: 'Lote / Terreno' },
  { value: 'finca', label: 'Finca' },
  { value: 'bodega', label: 'Bodega' },
  { value: 'local / oficina', label: 'Local / Oficina' },
  { value: 'galpon', label: 'Galpon' }
];

const TYPE_ALIASES = {
  casa: 'casa',
  departamento: 'departamento',
  depto: 'departamento',
  lote: 'lote / terreno',
  terreno: 'lote / terreno',
  'lote terreno': 'lote / terreno',
  'lote / terreno': 'lote / terreno',
  finca: 'finca',
  bodega: 'bodega',
  local: 'local / oficina',
  oficina: 'local / oficina',
  'local oficina': 'local / oficina',
  'local / oficina': 'local / oficina',
  galpon: 'galpon'
};

export const getCanonicalPropertyType = (value) => {
  const normalized = normalizeText(value).replace(/\s*\/\s*/g, ' / ').replace(/\s+/g, ' ');
  return TYPE_ALIASES[normalized] || normalized;
};

export const propertyTypesMatch = (leftValue, rightValue) => {
  const leftCanonical = getCanonicalPropertyType(leftValue);
  const rightCanonical = getCanonicalPropertyType(rightValue);

  if (!leftCanonical || !rightCanonical) {
    return false;
  }

  return leftCanonical === rightCanonical;
};

export const getPropertyTypeLabel = (value) => {
  const canonical = getCanonicalPropertyType(value);
  const option = PROPERTY_TYPE_OPTIONS.find((item) => item.value === canonical);
  return option ? option.label : value;
};
