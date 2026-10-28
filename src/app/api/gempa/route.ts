
export const runtime = "nodejs";
export const revalidate = 300;

const SUMBER = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json";

interface GempaBMKG {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
  Shakemap: string;
}

export async function GET() {
  try {
    const res = await fetch(SUMBER, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = (await res.json()) as { Infogempa: { gempa: GempaBMKG } };
    const g = json.Infogempa.gempa;
    return Response.json(
      {
        tanggal: g.Tanggal,
        jam: g.Jam,
        waktu: g.DateTime,
        koordinat: g.Coordinates,
        magnitudo: g.Magnitude,
        kedalaman: g.Kedalaman,
        wilayah: g.Wilayah,
        potensi: g.Potensi,
        shakemap: g.Shakemap
          ? "https://data.bmkg.go.id/DataMKG/TEWS/" + g.Shakemap
          : null,
        sumber: "BMKG",
      },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch {
    return Response.json(
      { error: "Data gempa belum tersedia." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}