import jsPDF from "jspdf";
import { CONFIG, formatUsd, formatTzs } from "./trips";

export type ReceiptPdfData = {
  ref: string;
  name: string;
  email: string;
  phone: string;
  mode: "full" | "half" | "negotiate";
  total: number;
  paid: number;
  rows: { label: string; qty: number; lineTotal: number }[];
  trip: { title: string; location: string; duration: string };
};

async function loadImageDataUrl(src: string): Promise<string> {
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function downloadReceiptPdf(data: ReceiptPdfData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  try {
    const logoDataUrl = await loadImageDataUrl("/logo-full.png");
    const logoW = 22;
    const logoH = logoW * (730 / 652);
    doc.addImage(logoDataUrl, "PNG", margin, y, logoW, logoH);
  } catch {
    // Logo is a nice-to-have; the receipt still works without it.
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30, 74, 38);
  doc.text("Booking Receipt", pageWidth - margin, y + 8, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  doc.text(`Reference ${data.ref}`, pageWidth - margin, y + 15, { align: "right" });
  doc.text(
    new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    pageWidth - margin,
    y + 20,
    { align: "right" },
  );

  y += 42;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  const section = (title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 74, 38);
    doc.text(title.toUpperCase(), margin, y);
    y += 7;
  };

  const row = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(40, 40, 40);
    doc.text(label, margin, y);
    doc.text(value, pageWidth - margin, y, { align: "right" });
    y += 7;
  };

  const subRow = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(140, 140, 140);
    doc.text(text, pageWidth - margin, y, { align: "right" });
    y += 6;
  };

  section("Trip");
  row("Trip", data.trip.title);
  row("Location", data.trip.location);
  row("Duration", data.trip.duration);
  y += 4;

  section("Guest");
  row("Name", data.name || "-");
  row("Email", data.email || "-");
  row("Phone", data.phone || "-");
  y += 4;

  section("Travelers");
  data.rows.forEach((r) => {
    row(`${r.qty} x ${r.label}`, formatUsd(r.lineTotal));
  });

  y += 2;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 9;

  row("Trip total", formatUsd(data.total), true);
  subRow(formatTzs(data.total));

  const balance = data.total - data.paid;
  row(data.mode === "full" ? "Paid in full" : "Paid now (50% deposit)", formatUsd(data.paid), true);
  subRow(formatTzs(data.paid));

  if (balance > 0) {
    row("Balance due on arrival", formatUsd(balance));
    subRow(formatTzs(balance));
  }

  y += 6;
  doc.setFillColor(245, 245, 240);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text("This is a simulated checkout. No real payment has been processed.", margin + 5, y + 9);
  doc.text(`Questions? ${CONFIG.supportEmail} - WhatsApp ${CONFIG.whatsapp}`, margin + 5, y + 16);

  doc.save(`UrbanWay-Receipt-${data.ref}.pdf`);
}
