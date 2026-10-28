
export const runtime = "nodejs";
export const revalidate = 600;

const SUMBER =
  "https://api.open-meteo.com/v1/forecast?latitude=-2.976&longitude=104.775&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FJakarta";

export async function GET() {
  try {
    const res = await fetch(SUMBER, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = (await res.json()) as {
      current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        weather_code: number;
        time: string;
      };
    };
    return Response.json(
      {
        temperatur: json.current.temperature_2m,
        kelembapan: json.current.relative_humidity_2m,
        angin: json.current.wind_speed_10m,
        kode: json.current.weather_code,
        diperbarui: json.current.time,
        sumber: "Open-Meteo",
      },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" } },
    );
  } catch {
    return Response.json(
      { error: "Cuaca belum tersedia." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}