const http = require('http');

const fs = require('fs');
const cors = require('cors');

function readJSONFile(filePath) {
  // Odczytanie zawartości pliku
  const fileData = fs.readFileSync(filePath, 'utf8');

  // Konwersja danych na obiekt JSON
  const jsonData = JSON.parse(fileData);

  // Zwrócenie danych
  return jsonData;
}


const express = require('express');
const app = express();
app.use(cors())

// Definiowanie ścieżki GET "/dane"
app.get('/dane', (req, res) => {
  // Wygenerowanie losowych danych do zwrócenia jako odpowiedź
  const data = readJSONFile("./Dane.json")

  // Zwrócenie danych jako odpowiedź w formacie JSON
  console.log({ data })
  res.json(data);
});

// Ustawienie portu, na którym serwer ma działać
const port = 3000;

// Uruchomienie serwera na wybranym porcie
app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});