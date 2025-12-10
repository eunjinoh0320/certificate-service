import { GoogleSpreadsheet } from "google-spreadsheet";

export default async function handler(req, res) {
  const { team, email } = req.body;

  try {
    const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    const doc = new GoogleSpreadsheet(
      "119s7f42uPb6vgZpr109iP8W5TrsZ50MkFskyNNAZgIk"
    );

    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const found = rows.find(
      (r) =>
        r.Team?.trim() === team.trim() &&
        r.Email?.trim() === email.trim()
    );

    if (!found) return res.json({ ok: false });

    res.json({
      ok: true,
      id: found.ID,
      team: found.Team,
      member: found.Member ?? "",
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
