
export const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `REC-${year}${month}${day}${hour}${minute}${seconds}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const generatePDF = async (row: fee) => {
//   const doc = new jsPDF();

//   try {
//     // Agregar el logo al PDF
//     const logoWidth = 50; // Ancho del logo
//     const logoHeight = 20; // Alto del logo
//     doc.addImage(logo, "PNG", 20, 10, logoWidth, logoHeight);

//     // Generar el código QR
//     const qrUrl = "https://gateway-english.com/";
//     const qrCodeBase64 = await QRCode.toDataURL(qrUrl);

//     // Agregar el código QR al PDF
//     const qrWidth = 50; // Ancho del QR
//     const qrHeight = 50; // Alto del QR
//     doc.addImage(qrCodeBase64, "PNG", 20, 200, qrWidth, qrHeight); // Posición y tamaño del QR
//   } catch (error) {
//     console.error("Error al generar el PDF:", error);
//   }

//   // Configuración inicial
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(12);

//   // Recibi de 
//   doc.setFont("helvetica", "bold");
//   doc.text(`Recibí de : ${row.customerName || "Nombre del cliente"}`, 20, 40);
//   doc.text(`La cantidad de : ${row.qty || "0.00"} dolares`, 20, 50);
//   doc.setFontSize(10);

//   // Número de recibo
//   doc.setFontSize(12);
//   doc.text(`Nro: ${row.code || "0000000000"}`, 150, 40);

//   // Lugar y fecha
//   doc.text(
//     `Lugar y Fecha: ${row.place || "Ciudad"}, ${row.createdAt || "01/01/2023"}`,
//     20,
//     60
//   );

//   // Recibí de
//   doc.text(`Recibí de: ${row.customerName || "Nombre del cliente"}`, 20, 70);

//   // La cantidad de
//   doc.text(`La cantidad de: ${row.qty || "0.00"} dólares`, 20, 80);

//   // Por concepto de
//   doc.text(`Por concepto de: ${row.reason || "Descripción del concepto"}`, 20, 90);

//   // Firma y C.I.
//   doc.setFontSize(7);
//   doc.text("Recuerde que este recibo se encuentra firmado de manera electronica sirviendo de comprobante de pago", 20, 110);
//   doc.text(`C.I.: ${row.cc || "0000000000"}`, 150, 110);

//   // Guardar el PDF
//   doc.save(`recibo_${row.code || "0000000000"}.pdf`);
// };