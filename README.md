# Airports-JSON-Builder ✈️

Script Deno pour télécharger, parser et filtrer les données d'aéroports à partir du projet [OurAirports](https://ourairports.com/), avec une sortie JSON optimisée.

## ✨ Fonctionnalités

- Téléchargement automatique de :
  - airports.csv : https://davidmegginson.github.io/ourairports-data/airports.csv
  - countries.csv : https://davidmegginson.github.io/ourairports-data/countries.csv
- Nettoyage des champs vides
- Remplacement des codes ISO pays par leur nom complet
- Filtrage possible par nom de pays (argument CLI)

## 🚀 Utilisation

Exécution simple (génère un JSON de tous les aéroports avec un code IATA) :
```
deno run --allow-net --allow-write main.ts
```
Filtrer par pays (ex : France) :
```
deno run --allow-net --allow-write main.ts France
```
## 📦 Fichier généré

- result.json : tableau d’objets JSON avec les champs essentiels :
  - name
  - iso_country
  - municipality
  - icao_code
  - iata_code

## 🛠️ Dépendances

- Deno : https://deno.land/
- @std/csv : https://jsr.io/@std/csv

## 📄 Licence

[MIT](LICENSE)

## 🎯 Objectif

> ✈️ Ce projet a été conçu pour alimenter le site [suivi.dby-fly.fr](https://suivi.dby-fly.fr) avec des données constamment actualisées sur les aéroports, afin de faciliter l’autocomplétion lors du suivi des vols, des journalières, des hôtels et des trajets — dans le but de simplifier la déclaration fiscale des pilotes et membres d’équipage.
