export const cotationScale = {
  "4a": 1,
  "4b": 2,
  "4c": 3,
  "5a": 4,
  "5b": 5,
  "5c": 6,
  "6a": 7,
  "6b": 8,
  "6c": 9,
  "7a": 10,
  "7b": 11,
  "7c": 12,
  "8a": 13,
  "8b": 14,
  "8c": 15,
  "9a": 16,
  "9b": 17,
  "9c": 18,
};

// Inversion du mapping pour retrouver les labels textuels
export const inverseCotationScale = Object.fromEntries(
  Object.entries(cotationScale).map(([key, value]) => [value, key])
);
