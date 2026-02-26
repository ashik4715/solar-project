import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Invoice from "@/models/Invoice";
import Customer from "@/models/Customer";
import { APIResponse } from "@/utils/response";
import { generateInvoiceNumber } from "@/utils/helpers";
import { generateInvoicePDF } from "@/utils/pdf";
import { uploadBufferToS3, isS3Configured } from "@/utils/s3";
import { can } from "@/utils/permissions";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = request.cookies.get("session")?.value;
  if (!session)
    return NextResponse.json(APIResponse.unauthorized().toJSON(), {
      status: 401,
    });
  const role = JSON.parse(Buffer.from(session, "base64").toString()).role;
  if (!(await can(role, "orders", "update"))) {
    return NextResponse.json(APIResponse.forbidden().toJSON(), {
      status: 403,
    });
  }

  await connectDB();
  const order = await Order.findById(id)
    .populate("customer")
    .populate("items.product");
  if (!order) {
    return NextResponse.json(APIResponse.notFound().toJSON(), { status: 404 });
  }

  const invoiceNumber = generateInvoiceNumber();
  const items =
    order.items?.map((i: any) => ({
      product: i.product?.name || "",
      description: i.product?.name || "Item",
      quantity: i.quantity || 1,
      unitPrice: i.price || 0,
      tax: 0,
      total: (i.price || 0) * (i.quantity || 1),
    })) || [];

  const subtotal = order.subtotal || 0;
  const tax = order.tax || 0;
  const totalAmount = order.totalAmount || subtotal + tax;

  const invoiceDoc = await Invoice.create({
    invoiceNumber,
    order: order._id,
    customer: order.customer,
    items,
    subtotal,
    tax,
    totalAmount,
    paymentStatus: order.paymentStatus === "paid" ? "paid" : "unpaid",
  });

  const invoicesDir = os.tmpdir();
  const pdfPath = path.join(invoicesDir, `${invoiceNumber}.pdf`);

  await generateInvoicePDF(
    {
      invoiceNumber,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date().toISOString().slice(0, 10),
      customerName: order.customer?.name || "Customer",
      customerEmail: order.customer?.email || "",
      customerAddress: order.customer?.address || "",
      items,
      subtotal,
      tax,
      totalAmount,
    },
    pdfPath,
  );

  const pdfBuffer = fs.readFileSync(pdfPath);

  let pdfUrl = "";
  if (isS3Configured()) {
    const uploaded = await uploadBufferToS3(
      pdfBuffer,
      `${invoiceNumber}.pdf`,
      "application/pdf",
    );
    if (uploaded) pdfUrl = uploaded;
  }

  const pdfBase64 = pdfBuffer.toString("base64");
  invoiceDoc.pdfUrl = pdfUrl || `data:application/pdf;base64,${pdfBase64}`;
  await invoiceDoc.save();

  return NextResponse.json(
    APIResponse.success(
      { invoice: invoiceDoc, pdfUrl: invoiceDoc.pdfUrl, pdfBase64 },
      "Invoice generated",
      201,
    ).toJSON(),
    { status: 201 },
  );
}
