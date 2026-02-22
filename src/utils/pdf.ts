import PDFDocument from "pdfkit";
import * as fs from "fs";

interface InvoiceItem {
  product: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
}

export async function generateInvoicePDF(
  data: InvoiceData,
  filePath: string,
): Promise<boolean> {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Header
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("INVOICE", { align: "center" });
      doc.moveDown();

      // Invoice details
      doc.fontSize(12).font("Helvetica");
      doc.text(`Invoice #: ${data.invoiceNumber}`);
      doc.text(`Issue Date: ${data.issueDate}`);
      doc.text(`Due Date: ${data.dueDate}`);
      doc.moveDown();

      // Customer info
      doc.fontSize(14).font("Helvetica-Bold").text("Bill To:");
      doc.fontSize(12).font("Helvetica");
      doc.text(data.customerName);
      doc.text(data.customerEmail);
      doc.text(data.customerAddress);
      doc.moveDown();

      // Items table
      doc.fontSize(12).font("Helvetica-Bold");
      doc.text("Description", 50, doc.y);
      doc.text("Qty", 300, doc.y);
      doc.text("Unit Price", 350, doc.y);
      doc.text("Tax", 430, doc.y);
      doc.text("Total", 500, doc.y);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Items
      doc.fontSize(11).font("Helvetica");
      data.items.forEach((item) => {
        doc.text(item.description, 50, doc.y, { width: 240 });
        doc.text(
          item.quantity.toString(),
          300,
          doc.y - doc.heightOfString(item.description),
        );
        doc.text(
          `₹${item.unitPrice.toFixed(2)}`,
          350,
          doc.y - doc.heightOfString(item.description),
        );
        doc.text(
          `₹${item.tax.toFixed(2)}`,
          430,
          doc.y - doc.heightOfString(item.description),
        );
        doc.text(
          `₹${item.total.toFixed(2)}`,
          500,
          doc.y - doc.heightOfString(item.description),
        );
        doc.moveDown();
      });

      // Totals
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      doc.fontSize(12).font("Helvetica");
      doc.text(`Subtotal: ₹${data.subtotal.toFixed(2)}`, 350);
      doc.text(`Tax (18%): ₹${data.tax.toFixed(2)}`, 350);
      doc.fontSize(14).font("Helvetica-Bold");
      doc.text(`Total: ₹${data.totalAmount.toFixed(2)}`, 350);

      // Footer
      doc.moveTo(50, 750).lineTo(550, 750).stroke();
      doc.fontSize(10).font("Helvetica");
      doc.moveDown();
      doc.text("Thank you for your business!", { align: "center" });

      doc.end();

      stream.on("finish", () => {
        resolve(true);
      });

      stream.on("error", (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return false;
  }
}

export async function generateQuotePDF(
  data: InvoiceData,
  filePath: string,
): Promise<boolean> {
  // Similar to invoice but labeled as quote
  return generateInvoicePDF(data, filePath);
}
