import { FC, useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import logo from "../../../assets/logo.png"; // Importa el logo desde la carpeta assets
import { fee } from "../../../interface/fees.interface";

const generatePDFBlob = async (
  row: fee,
  studentName: string
): Promise<Blob> => {
  const doc = new jsPDF();

  try {
    // Agregar el logo al PDF
    const logoWidth = 50; // Ancho del logo
    const logoHeight = 20; // Alto del logo
    doc.addImage(logo, "PNG", 15, 10, logoWidth, logoHeight);

    // Generar el código QR
    const qrUrl = `Recibo Nro:${row.code}`;
    const qrCodeBase64 = await QRCode.toDataURL(qrUrl);
    // const qrCodeBase64 = await QRCode.toDataURL('https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/Catalogo%20ARKREM-TERRUA%CC%81.pdf?alt=media&token=d659ebfb-27eb-475f-a0bb-7f4c16432204%20');


    // Agregar el código QR al PDF
    const qrWidth = 50; // Ancho del QR
    const qrHeight = 50; // Alto del QR
    doc.addImage(qrCodeBase64, "PNG", 145, 40, qrWidth, qrHeight); // Posición y tamaño del QR
  } catch (error) {
    console.error("Error al generar el PDF:", error);
  }

  // Configuración inicial
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  // Título
  doc.text("RECIBO DE PAGO", 145, 20);
  doc.setFontSize(10);
  // Número de recibo
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Nro:`, 135, 25);
  doc.setFont("helvetica", "normal");
  doc.text(`${row.code || "0000000000"}`, 145, 25);

  // Lugar y fecha
  doc.setFont("helvetica", "bold");
  doc.text(`Lugar y Fecha:`, 155, 35);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${row.place || "Ciudad"}, ${row.createdAt || "01/01/2023"}`,
    145,
    40
  );

  // Recibí de
  doc.setFont("helvetica", "bold");
  doc.text(`Recibí de                         :`, 20, 46);
  doc.setFont("helvetica", "normal");
  doc.text(`${row.customerName || "Nombre del cliente"}`, 80, 46);

  // La cantidad de
  doc.setFont("helvetica", "bold");
  doc.text(`La cantidad de                :`, 20, 52);
  doc.setFont("helvetica", "normal");
  doc.text(`${row.qty || "0.00"} dólares`, 80, 52);

  // Por concepto de
  doc.setFont("helvetica", "bold");
  doc.text(`Por concepto de             :`, 20, 58);
  doc.setFont("helvetica", "normal");
  doc.text(`${row.reason || "Descripción del concepto"}`, 80, 58);

  // C.I.
  doc.setFont("helvetica", "bold");
  doc.text(`CI Estudiante                  :`, 20, 64);
  doc.setFont("helvetica", "normal");
  doc.text(`${row.cc || "0000000000"}`, 80, 64);

  // Nombre Estudiante
  doc.setFont("helvetica", "bold");
  doc.text(`Nombres Estudiante      :`, 20, 70);
  doc.setFont("helvetica", "normal");
  doc.text(`${studentName || "Nombre del estudiante"}`, 80, 70);

    // Forma de pago
    doc.setFont("helvetica", "bold");
    doc.text(`Forma de Pago               :`, 20, 76);
    doc.setFont("helvetica", "normal");
    doc.text(`${row.paymentMethod || "Cash"}`, 80, 76);

    // Forma de pago
    doc.setFont("helvetica", "bold");
    doc.text(`Nro Comprobante           :`, 20, 82);
    doc.setFont("helvetica", "normal");
    doc.text(`${row.paymentMethod !== 'cash'? row.docNumber : 'Efectivo'}`, 80, 82);

  // Firma
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Comprobante de pago: ${row.code}, recuerde esto no es una factura y sirve de comprobante de pago, la firma de este recibo es de manera electronica, GATEWAY CORPORATION`,
    20,
    90
  );

  // Retornar el PDF como Blob
  return doc.output("blob");
};
interface Props {
  row: fee, 
  studentName: string
}
const PDFPreview:FC<Props> = ({row, studentName}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGeneratePreview = async () => {
    const pdfBlob = await generatePDFBlob(row, studentName);
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
