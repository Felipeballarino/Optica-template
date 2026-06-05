export const fieldsConfig = {
  productExtraFields: [
    {
      key: "graduacion",
      label: "Graduación",
      type: "text" as const,
      placeholder: "Ej: -1.50 / -2.00",
    },
    {
      key: "material",
      label: "Material del marco",
      type: "select" as const,
      options: ["Acetato", "Metal", "TR-90", "Titanio"],
    },
    {
      key: "forma",
      label: "Forma",
      type: "select" as const,
      options: ["Cuadrado", "Redondo", "Aviador", "Cat-eye", "Rectangular"],
    },
    {
      key: "genero",
      label: "Género",
      type: "select" as const,
      options: ["Hombre", "Mujer", "Unisex"],
    },
  ],
}
