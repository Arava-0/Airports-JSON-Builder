import { parse } from "jsr:@std/csv";

const airportsURL = "https://davidmegginson.github.io/ourairports-data/airports.csv";
const countriesURL = "https://davidmegginson.github.io/ourairports-data/countries.csv";
const outputFile = "result.json";

/**
 * EXTRAIT DE LA LISTE DES PAYS CIBLES (ZONE EUR / LETTER 1998)
 * a) Dans les pays suivants :
 * Albanie, Algérie, Allemagne, Andorre, Autriche, Belgique, Bosnie-Herzégovine, Bulgarie, Chypre, Croatie,
 * Danemark, Espagne, Finlande, France (y compris DOM et collectivités territoriales de Mayotte et de Saint-Pierre-et-Miquelon),
 * Grèce, Hongrie, Irlande, Islande, Italie, Luxembourg, Macédoine, Malte, Maroc, Norvège, Pays-Bas, Pologne, Portugal,
 * Roumanie, Royaume-Uni, Slovaquie, Slovénie, Suède, Suisse, Tchèque (République), Tunisie, Yougoslavie (République Fédérale de)
 */
const TARGET_COUNTRY_CODES = [
    "AL", // Albanie
    "DZ", // Algérie
    "DE", // Allemagne
    "AD", // Andorre
    "AT", // Autriche
    "BE", // Belgique
    "BA", // Bosnie-Herzégovine
    "BG", // Bulgarie
    "CY", // Chypre
    "HR", // Croatie
    "DK", // Danemark
    "ES", // Espagne
    "FI", // Finlande
    "FR", // France
    "GR", // Grèce
    "HU", // Hongrie
    "IE", // Irlande
    "IS", // Islande
    "IT", // Italie
    "LU", // Luxembourg
    "MK", // Macédoine
    "MT", // Malte
    "MA", // Maroc
    "NO", // Norvège
    "NL", // Pays-Bas
    "PL", // Pologne
    "PT", // Portugal
    "RO", // Roumanie
    "GB", // Royaume-Uni
    "SK", // Slovaquie
    "SI", // Slovénie
    "SE", // Suède
    "CH", // Suisse
    "CZ", // République tchèque
    "TN"  // Tunisie
];

async function fetchAndParseCSV(url: string): Promise<Record<string, string>[]> {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`❌ Échec du téléchargement : ${url}`);
    }
    const text = await res.text();
    return parse(text, { skipFirstRow: true }) as Record<string, string>[];
}

async function main() {
    const filterCountry = Deno.args[0]?.toUpperCase();

    console.log("⬇️ Téléchargement des fichiers CSV...");
    const [airportsData, countriesData] = await Promise.all([
        fetchAndParseCSV(airportsURL),
        fetchAndParseCSV(countriesURL),
    ]);

    // Création d'une map pour les noms de pays
    const countryMap: Record<string, string> = {};
    for (const row of countriesData) {
        if (row.code && row.name) {
            countryMap[row.code.trim()] = row.name.trim();
        }
    }

    let result = airportsData
        .filter((row) => row.iata_code && row.iata_code.trim() !== "")
        .map((row) => {
            const countryCode = row.iso_country?.trim() || "";
            return {
                name: row.name || "N/A",
                iso_country: countryMap[countryCode] || countryCode || "N/A",
                country_code: countryCode,
                municipality: row.municipality || "N/A",
                icao_code: row.icao_code || "N/A",
                iata_code: row.iata_code,
                isTargetCountry: TARGET_COUNTRY_CODES.includes(countryCode)
            };
        });

    if (filterCountry) {
        result = result.filter(
            (a) => a.country_code === filterCountry
        );
        console.log(`🔍 Filtrage sur le pays : ${filterCountry} (${result.length} aéroports)`);
    }

    await Deno.writeTextFile(outputFile, JSON.stringify(result, null, 2));
    console.log(`✅ Fichier "${outputFile}" généré avec ${result.length} entrées.`);
    console.log(`ℹ️ ${result.filter(a => a.isTargetCountry).length} aéroports dans les pays cibles`);
}

await main();
