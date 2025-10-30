/**
 * List of Least Developed Countries (LDCs) as designated by the United Nations
 * Source: UN Committee for Development Policy
 * Updated: 2025
 * Total: 44 countries across 4 regions
 */
export const LDC_COUNTRIES = [
  // Africa (32 countries)
  "Angola",
  "Benin",
  "Burkina Faso",
  "Burundi",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Democratic Republic of the Congo",
  "Djibouti",
  "Eritrea",
  "Ethiopia",
  "Gambia",
  "Guinea",
  "Guinea-Bissau",
  "Lesotho",
  "Liberia",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mozambique",
  "Niger",
  "Rwanda",
  "Senegal",
  "Sierra Leone",
  "Somalia",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Uganda",
  "Zambia",
  
  // Asia (8 countries)
  "Afghanistan",
  "Bangladesh",
  "Cambodia",
  "Lao People's Democratic Republic",
  "Myanmar",
  "Nepal",
  "Timor-Leste",
  "Yemen",
  
  // Pacific (3 countries)
  "Kiribati",
  "Solomon Islands",
  "Tuvalu",
  
  // Caribbean (1 country)
  "Haiti",
] as const;

export type LDCCountry = typeof LDC_COUNTRIES[number];
