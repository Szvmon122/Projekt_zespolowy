import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import DateInput from "./components/DateInput";
import {
  convertCurrencyToInteger,
  convertIntegerToCurrency,
  createfilter,
  fetchData,
  zapiszDane,
} from "./utils/index";
import Summary from "./views/Summary";

const Categories = [
  "Zakupy Spożywcze",
  "Artykuły Biurowe",
  "Rozrywka",
  "Jedzenie",
  "Sport",
  "Ubrania",
];

const App = () => {
  const [kwota, setKwota] = useState("");
  const [kategoria, setKategoria] = useState(Categories[0]);
  const [wydatki, setWydatki] = useState([]);
  const [currentView, setCurrentView] = useState("main");
  const [date, setDate] = useState();

  function deleteWydatek(i) {
    setWydatki([...wydatki.splice(0, i), ...wydatki.splice(i + 1)]);
  }

  const handleDodaj = async () => {
    const nowyWydatek = {
      kwota: convertCurrencyToInteger(parseFloat(kwota)),
      data: [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-"),
      kategoria,
    };
    setWydatki([nowyWydatek, ...wydatki]);
    setKategoria(Categories[0]);
    setKwota('')
  };

  useEffect(() => {
    // pobierzDane("wydatki")
    //   .then(setWydatki)
    //   .catch(() => setWydatki([]));
    fetchData().then(setWydatki);
  }, []);

  useEffect(() => {
    zapiszDane("wydatki", wydatki);
  }, [wydatki]);

  return (
    <View style={{ width: "100vw", padding: 16 }}>
      <Button
        title={currentView === "summary" ? "zarządzaj" : "zestawienie"}
        onPress={() =>
          setCurrentView(currentView === "summary" ? "main" : "summary")
        }
      />
      {currentView === "summary" ? (
        <Summary data={wydatki} />
      ) : (
        <View style={{ width: "100%", padding: 32 }}>
          <Text>Kwota:</Text>
          <TextInput
            value={kwota}
            onChangeText={setKwota}
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 8 }}
          />

          <DateInput onChange={setDate} />

          <Text>Kategoria:</Text>
          <Picker
            selectedValue={kategoria}
            onValueChange={setKategoria}
            style={{ borderWidth: 1 }}
          >
            {Categories.map((category) => (
              <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>

          <Button title="Dodaj" onPress={handleDodaj} />
          {wydatki.map((wydatek, i) => (
            <View key={wydatek.kwota.toString() + i} style={{ marginTop: 16 }}>
              <Button title="Usuń" onPress={() => deleteWydatek(i)} />
              <Text>{convertIntegerToCurrency(wydatek.kwota)}</Text>
              <Text>{wydatek.data.replaceAll("-", "/")}</Text>
              <Text>{wydatek.kategoria}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default App;
