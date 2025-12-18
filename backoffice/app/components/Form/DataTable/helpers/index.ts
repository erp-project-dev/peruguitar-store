export function compareValues(
  a: unknown,
  b: unknown,
  direction: "asc" | "desc"
) {
  if (a == null) return 1;
  if (b == null) return -1;
  const va = typeof a === "string" ? a.toLowerCase() : a;
  const vb = typeof b === "string" ? b.toLowerCase() : b;
  if (va > vb) return direction === "asc" ? 1 : -1;
  if (va < vb) return direction === "asc" ? -1 : 1;
  return 0;
}

export function alignClass(align?: "left" | "center" | "right") {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}
