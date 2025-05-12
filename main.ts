import { parse } from "jsr:@std/csv";

const airportsURL = "https://davidmegginson.github.io/ourairports-data/airports.csv";
const countriesURL = "https://davidmegginson.github.io/ourairports-data/countries.csv";
const outputFile = "result.json";

async function fetchAndParseCSV(url: string): Promise<Record<string, string>[]> {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`❌ Échec du téléchargement : ${url}`);
	}
	const text = await res.text();
	return parse(text, { skipFirstRow: true }) as Record<string, string>[];
}

async function main() {
	const filterCountry = Deno.args[0]?.toLowerCase();

	console.log("⬇️ Téléchargement des fichiers CSV...");
	const [airportsData, countriesData] = await Promise.all([
		fetchAndParseCSV(airportsURL),
		fetchAndParseCSV(countriesURL),
	]);

	const countryMap: Record<string, string> = {};
	for (const row of countriesData) {
		if (row.code && row.name) {
			countryMap[row.code.trim()] = row.name.trim();
		}
	}

	let result = airportsData
		.filter((row) => row.iata_code && row.iata_code.trim() !== "")
		.map((row) => ({
			name: row.name || "N/A",
			iso_country: countryMap[row.iso_country] || row.iso_country || "N/A",
			municipality: row.municipality || "N/A",
			icao_code: row.icao_code || "N/A",
			iata_code: row.iata_code,
		}));

	if (filterCountry) {
		result = result.filter(
			(a) => a.iso_country.toLowerCase() === filterCountry
		);
		console.log(`🔍 Filtrage sur le pays : ${filterCountry} (${result.length} aéroports)`);
	}

	await Deno.writeTextFile(outputFile, JSON.stringify(result, null, 2));
	console.log(`✅ Fichier "${outputFile}" généré avec ${result.length} entrées.`);
}

await main();
