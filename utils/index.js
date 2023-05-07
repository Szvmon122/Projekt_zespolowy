import AsyncStorage from "@react-native-async-storage/async-storage";

export function createfilter(startDate, endDate) {
  // Użyj metody filter, aby utworzyć nową tablicę zawierającą tylko transakcje z podanego zakresu daty
  return (transakcja) => {
    const transactionDate = new Date(transakcja.data);
    return transactionDate >= startDate && transactionDate <= endDate;
  };
}

export function groupByCategory(data) {
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

export function convertCurrencyToInteger(currency) {
  return parseInt(currency * 100);
}

export function convertIntegerToCurrency(integer) {
  return parseFloat((integer / 100).toFixed(2));
}

export const zapiszDane = async (klucz, dane) => {
  try {
    const daneJSON = JSON.stringify(dane);
    await AsyncStorage.setItem(klucz, daneJSON);
  } catch (error) {
    console.error(error);
  }
}

export const fetchData = async () => {
  const { data } = await axios("http://localhost:3000/dane", {
    mode: "no-cors",
  });
  return data.map((el) => ({
    ...el,
    data: el.data.split("-").reverse().join("-"),
  }));
};

export const pobierzDane = async (klucz) => {
  try {
    const daneJSON = await AsyncStorage.getItem(klucz);
    return JSON.parse(daneJSON);
  } catch (error) {
    console.error(error);
    return [];
  }
};