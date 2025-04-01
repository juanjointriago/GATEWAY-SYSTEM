import { useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import logo from "../../../assets/logo.png"; // Importa el logo desde la carpeta assets
import { fee } from "../../../interface/fees.interface";

const generatePDFBlob = async (row: fee): Promise<Blob> => {
  const doc = new jsPDF();

  try {
    // Agregar el logo al PDF
    const logoWidth = 50; // Ancho del logo
    const logoHeight = 20; // Alto del logo
    doc.addImage(logo, "PNG", 20, 10, logoWidth, logoHeight);

    // Generar el código QR
    const qrUrl = "https://gateway-english.com/";
    const qrCodeBase64 = await QRCode.toDataURL(qrUrl);

    // Agregar el código QR al PDF
    const qrWidth = 50; // Ancho del QR
    const qrHeight = 50; // Alto del QR
    doc.addImage(qrCodeBase64, "PNG", 20, 200, qrWidth, qrHeight); // Posición y tamaño del QR
  } catch (error) {
    console.error("Error al generar el PDF:", error);
  }

  // Configuración inicial
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  // Título
  doc.text("GATEWAY CORPORATION", 20, 40);
  doc.setFontSize(10);
  doc.text("Recibo de Pago", 20, 50);

  // Número de recibo
  doc.setFontSize(12);
  doc.text(`Nro: ${row.code || "0000000000"}`, 150, 40);

  // Lugar y fecha
  doc.text(
    `Lugar y Fecha: ${row.place || "Ciudad"}, ${row.createdAt || "01/01/2023"}`,
    20,
    60
  );

  // Recibí de
  doc.text(`Recibí de: ${row.customerName || "Nombre del cliente"}`, 20, 70);

  // La cantidad de
  doc.text(`La cantidad de: ${row.qty || "0.00"} dólares`, 20, 80);

  // Por concepto de
  doc.text(`Por concepto de: ${row.reason || "Descripción del concepto"}`, 20, 90);

  // Firma y C.I.
  doc.text("Firmado Electrónicamente", 20, 110);
  doc.text(`C.I.: ${row.cc || "0000000000"}`, 150, 110);

  // Retornar el PDF como Blob
  return doc.output("blob");
};

const PDFPreview = ({ row }: { row: fee }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGeneratePreview = async () => {
    const pdfBlob = await generatePDFBlob(row);
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfBlobUrl);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `recibo_${row.code || "0000000000"}.pdf`;
      link.click();
    }
  };

  // const handlePrint = () => {
  //   if (pdfUrl) {
  //     const iframe = document.createElement("iframe");
  //     iframe.style.display = "none";
  //     iframe.src = pdfUrl;
  //     document.body.appendChild(iframe);
  //     iframe.contentWindow?.print();
  //     document.body.removeChild(iframe);
  //   }
  // };

  return (
    <div>
      <button
        onClick={handleGeneratePreview}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generar Vista Previa
      </button>

      {pdfUrl && (
        <div className="mt-4">
          <iframe
            src={pdfUrl}
            title="Vista previa del PDF"
            width="100%"
            height="500px"
            className="border"
          ></iframe>
          <div className="mt-2 flex gap-4">
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Descargar PDF
            </button>
            {/* <button
              onClick={handlePrint}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Imprimir PDF
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFPreview;