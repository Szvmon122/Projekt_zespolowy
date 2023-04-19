import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyDatePicker from "./components/datepicker";

const Categories = [
  "Zakupy Spożywcze",
  "Artykuły Biurowe",
  "Rozrywka",
  "Jedzenie",
  "Sport",
  "Ubrania",
];
const pobierzDane = async (klucz) => {
  try {
    const daneJSON = await AsyncStorage.getItem(klucz);
    return JSON.parse(daneJSON);
  } catch (error) {
    console.error(error);
    return [];
  }
};
function convertCurrencyToInteger(currency) {
  return parseInt(currency * 100);
}
function convertIntegerToCurrency(integer) {
  return parseFloat((integer / 100).toFixed(2));
}
const zapiszDane = async (klucz, dane) => {
  try {
    const daneJSON = JSON.stringify(dane);
    await AsyncStorage.setItem(klucz, daneJSON);
  } catch (error) {
    console.error(error);
  }
};

const today = new Date();
const App = () => {
  const [kwota, setKwota] = useState("");
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [kategoria, setKategoria] = useState(Categories[0]);
  const [wydatki, setWydatki] = useState([]);

  function deleteWydatek(i) {
    setWydatki([...wydatki.splice(0, i), ...wydatki.splice(i + 1)]);
  }

  const handleDodaj = async () => {
    const nowyWydatek = {
      kwota: convertCurrencyToInteger(parseFloat(kwota)),
      data: [day, month, year].join("-"),
      kategoria,
    };
    setWydatki([...wydatki, nowyWydatek]);
    setKategoria(Categories[0]);
  };

  useEffect(() => {
    pobierzDane("wydatki")
      .then(setWydatki)
      .catch(() => setWydatki([]));
  }, []);

  useEffect(() => {
    zapiszDane("wydatki", wydatki);
  }, [wydatki]);

  return (
    <View style={{ padding: 16 }}>
      <Text>Kwota:</Text>
      <TextInput
        value={kwota}
        onChangeText={setKwota}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8 }}
      />

      <View style={{ flexDirection: "row" }}>
        <View style={inputStyles.container}>
          <Text>Dzień:</Text>
          <TextInput
            value={day}
            onChangeText={setDay}
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 8 }}
          />
        </View>

        <View style={inputStyles.container}>
          <Text>Miesiąc:</Text>
          <TextInput
            value={month}
            onChangeText={setMonth}
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 8 }}
          />
        </View>
        <View style={inputStyles.container}>
          <Text>Rok:</Text>
          <TextInput
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 8 }}
          />
        </View>
      </View>

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
      {/* <Text>{JSON.stringify(wydatki, null, 2)}</Text> */}
      {wydatki.map((wydatek, i) => (
        <View key={wydatek.kwota.toString() + i}>
          <Button title="Usuń" onPress={() => deleteWydatek(i)} />
          <Text>{wydatek.kwota}</Text>
          <Text>{wydatek.data.replaceAll("-", "/")}</Text>
          <Text>{wydatek.kategoria}</Text>
        </View>
      ))}
    </View>
  );
};

export default App;

const inputStyles = StyleSheet.create({
  container: {
    width: "60px",
  },
});
