import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Dimensions, Text, TextInput, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import DateInput from "./components/DateInput";

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

function createfilter(startDate, endDate) {
  // Użyj metody filter, aby utworzyć nową tablicę zawierającą tylko transakcje z podanego zakresu daty
  return (transakcja) => {
    const transactionDate = new Date(transakcja.data);
    return transactionDate >= startDate && transactionDate <= endDate;
  };
}

function groupByCategory(data) {
  // Utwórz pusty obiekt, w którym będą grupowane transakcje
  const groupedData = {};

  // Przejdź przez każdą transakcję
  data.forEach((transakcja) => {
    const kategoria = transakcja.kategoria;

    // Jeśli kategoria jeszcze nie została dodana do obiektu, utwórz nową tablicę dla tej kategorii
    if (!groupedData[kategoria]) {
      groupedData[kategoria] = [];
    }

    // Dodaj bieżącą transakcję do tablicy transakcji dla tej kategorii
    groupedData[kategoria].push(transakcja);
  });

  return groupedData;
}

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
const fetchData = async () => {
  const { data } = await axios("http://localhost:3000/dane", {
    mode: "no-cors",
  });
  return data.map((el) => ({
    ...el,
    data: el.data.split("-").reverse().join("-"),
  }));
};

const today = new Date();
const App = () => {
  const [kwota, setKwota] = useState("");
  // const [day, setDay] = useState(today.getDate().toString());
  // const [month, setMonth] = useState((today.getMonth() + 1).toString());
  // const [year, setYear] = useState(today.getFullYear().toString());
  const [kategoria, setKategoria] = useState(Categories[0]);
  const [wydatki, setWydatki] = useState([]);
  const [wydatkiGrupowane, setWydatkiGrupowane] = useState({});
  const [plotData, setPlotData] = useState([]);
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState(new Date());

  function deleteWydatek(i) {
    setWydatki([...wydatki.splice(0, i), ...wydatki.splice(i + 1)]);
  }

  const handleDodaj = async () => {
    const nowyWydatek = {
      kwota: convertCurrencyToInteger(parseFloat(kwota)),
      data: [year, month, day].join("-"),
      kategoria,
    };
    setWydatki([...wydatki, nowyWydatek]);
    setKategoria(Categories[0]);
  };

  useEffect(() => {
    fetchData().then(setWydatki);
    // pobierzDane("wydatki")
    //   .then(setWydatki)
    //   .catch(() => setWydatki([]));
  }, []);

  useEffect(() => {
    zapiszDane("wydatki", wydatki);
  }, [wydatki, rangeEnd, rangeStart]);

  useEffect(() => {
    setWydatkiGrupowane(
      groupByCategory(wydatki.filter(createfilter(rangeStart, rangeEnd)))
    );
  }, [rangeStart, rangeEnd]);

  useEffect(() => {
    setPlotData(
      Object.entries(wydatkiGrupowane).map(([name, arr], i) => ({
        name,
        kwota: arr.reduce((a, b) => a + b.kwota, 0),
        color: `rgba(33,70, 155,${(i + 1) * 0.1})`,
        legendFontColor: `rgba(0,0,0, 1)`,
      }))
    );
  }, [wydatkiGrupowane]);

  return (
    <View style={{ padding: 16 }}>
      <Text>Kwota:</Text>
      <TextInput
        value={kwota}
        onChangeText={setKwota}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8 }}
      />

      {/* <DateInput onChange={(date) => console.log(date) }/> */}
      <View style={{ flex: 1, flexDirection: "row", gap: "8px" }}>
        <View>
          <Text>{rangeStart.toDateString()}</Text>
          <Text>Zakres od:</Text>
          <DateInput onChange={setRangeStart} />
        </View>
        <View>
          <Text>{rangeEnd.toDateString()}</Text>
          <Text>Zakres do:</Text>
          <DateInput onChange={setRangeEnd} />
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
      {/* {wydatki
        .filter(createfilter(new Date("2023-04-15"), new Date("2023-04-25")))
        .splice(0, 5)
        .map((wydatek, i) => (
          <View key={wydatek.kwota.toString() + i} style={{ marginTop: 16 }}>
            <Button title="Usuń" onPress={() => deleteWydatek(i)} />
            <Text>{wydatek.kwota}</Text>
            <Text>{wydatek.data.replaceAll("-", "/")}</Text>
            <Text>{wydatek.kategoria}</Text>
          </View>
        ))} */}

      {plotData.length !== 0 && (
        <PieChart
          data={plotData}
          accessor={"kwota"}
          width={Dimensions.get("window").width}
          height={300}
          backgroundColor="transparent"
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",

            color: (opacity = 1, i) => `rgba(0, 0, 0, ${opacity})`,
          }}
        />
      )}
      {plotData.length !== 0 && (
        <View>
          <Text>W wybranym okresie wydałeś łącznie:</Text>
          <Text>
            {convertIntegerToCurrency(
              plotData.reduce((acc, { kwota }) => acc + kwota, 0)
            )} zł
          </Text>
        </View>
      )}
      {/* <Button title="zestawienie" onPress={}     */}
    </View>
  );
};

export default App;
