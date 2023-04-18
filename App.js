import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Categories = ['Spożywcze', 'Artykuły Biurowe', 'Rozrywka', 'Jedzenie', 'Sport', 'Ubrania'];
const pobierzDane = async (klucz) => {
  try {
    const daneJSON = await AsyncStorage.getItem(klucz);
    return JSON.parse(daneJSON);
  } catch (error) {
    console.error(error);
    return [];
  }
};
const zapiszDane = async (klucz, dane) => {
  try {
    const daneJSON = JSON.stringify(dane);
    await AsyncStorage.setItem(klucz, daneJSON);
  } catch (error) {
    console.error(error);
  }
};

export default function App() {
  const [kwota, setKwota] = useState('');
  const [data, setData] = useState('');
  const [kategoria, setKategoria] = useState(Categories[0]);
  const [wydatki, setWydatki] = useState([]);

  const handleDodaj = () => {
    const nowyWydatek = { kwota, data, kategoria };
    setWydatki([...wydatki, nowyWydatek]);
    zapiszDane('wydatki', wydatki)
    setKwota('');
    setData('');
    setKategoria(Categories[0]);
  };

  useEffect(() => {
    pobierzDane('wydatki').then(wyd => setWydatki([...JSON.parse(wyd)])).catch(() => setWydatki([]))
  }, []);

  return (
    <View style={{ padding: 16 }}>
      <Text>Kwota:</Text>
      <TextInput
        value={kwota}
        onChangeText={setKwota}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8 }}
      />

      <Text>Data:</Text>
      <TextInput
        value={data}
        onChangeText={setData}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8 }}
      />

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
      <Text>{JSON.stringify(wydatki, null, 2)}</Text>
    </View>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// elo test aaaa
// jeszze