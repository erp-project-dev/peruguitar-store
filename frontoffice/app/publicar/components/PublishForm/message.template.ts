interface MessageTemplateParams {
  merchantName: string;
  productName: string;
  showPrice: boolean;
  productPrice?: string | number | null;
}

export function getMessageTemplate({
  merchantName,
  productName,
  showPrice,
  productPrice,
}: MessageTemplateParams): string {
  return `
Hola, te escribe *${merchantName}*. Deseo publicar en Peru Guitar.

- *Nombre:* ${productName}
${showPrice && productPrice ? `- *Precio:* S/ ${productPrice}` : ""}

Confirmo que cumple con los criterios de evaluación.

Quedo atento(a).
  `.trim();
}
