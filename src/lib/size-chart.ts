export const SIZE_CHART_SIZES = ["XS", "S", "M", "ML", "L", "XL"] as const;

export interface SizeChartTable {
  title: string;
  rows: { label: string; values: (number | string)[] }[];
}

/** Shees Khan size guide — garment measurements in inches */
export const SIZE_CHART_TABLES: SizeChartTable[] = [
  {
    title: "Relaxed Fit (Kurta)",
    rows: [
      { label: "Shoulder", values: [13.5, 14, 14.5, 14.5, 15.5, 15.5] },
      { label: "Chest", values: [19.5, 20, 21, 22, 23, 24] },
    ],
  },
  {
    title: "Slim Fit (Choli/Bodice/Peshwas)",
    rows: [
      { label: "Shoulder", values: [13.5, 14, 14.5, 14.5, 15.5, 15.5] },
      { label: "Chest", values: [17, 18, 19, 20, 21, 22] },
      { label: "Waist", values: [13, 14, 15, 16, 17, 18] },
    ],
  },
  {
    title: "Drop Shoulder Baggy Cut (Kurta)",
    rows: [
      { label: "Shoulder", values: [20, 22, 22, 23, 23, 24] },
      { label: "Chest", values: [20, 22, 22, 23, 23, 24] },
    ],
  },
  {
    title: "Boxy Cut (Kurta/Abha)",
    rows: [
      { label: "Shoulder", values: [13.5, 14, 14.5, 14.5, 15.5, 15.5] },
      { label: "Chest", values: [20, 21, 22, 23, 24, 25] },
    ],
  },
  {
    title: "Trouser/Shalwar",
    rows: [
      { label: "Length", values: [35, 36, 37, 38, 38, 38] },
      { label: "Waist (Body Measurements)", values: [26, 28, 30, 32, 34, 36] },
      { label: "Hip", values: [20, 21, 22, 22.5, 23, 24] },
      { label: "Thigh", values: [22, 24, 26, 27, 28, 30] },
      { label: "Bottom", values: [5.25, 6, 6.5, 6.75, 6.75, 7] },
    ],
  },
  {
    title: "Culottes",
    rows: [
      { label: "Length", values: [34, 35, 36, 37, 37, 38] },
      { label: "Waist (Body Measurements)", values: [26, 28, 30, 32, 34, 36] },
      { label: "Hip", values: [20, 21, 22, 22.5, 23, 24] },
      { label: "Thigh", values: [22, 24, 26, 27, 28, 30] },
      { label: "Bottom", values: [9.5, 10.5, 11, 11.5, 12, 12.5] },
    ],
  },
  {
    title: "Wide Leg Trouser",
    rows: [
      { label: "Length", values: [41, 41, 42, 42, 43, 43] },
      { label: "Waist (Body Measurements)", values: [26, 28, 30, 32, 34, 36] },
      { label: "Hip", values: [20, 21, 22, 22.5, 23, 24] },
      { label: "Thigh", values: [22, 24, 26, 27, 28, 30] },
      { label: "Bottom", values: [12, 12, 13, 13, 14, 14] },
    ],
  },
];

export const SIZE_CHART_NOTE =
  "*Size may vary according to style. All measurements are in inches.";
