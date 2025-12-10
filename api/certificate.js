import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { id, team, member } = req.query;

  try {
    const templatePath = path.join(process.cwd(), "public", "template.pdf");
    const templateBytes = fs.readFileSync(templatePath);

    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];

    page.drawText(team, { x: 410, y: 430, size: 18, color: rgb(0, 0, 0) });
    page.drawText(member, { x: 410, y: 400, size: 18, color: rgb(0, 0, 0) });

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    res.status(500).send("PDF 생성 오류: " + err.message);
  }
}
