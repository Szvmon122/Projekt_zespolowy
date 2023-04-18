import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Categories = ['Spożywcze', 'Artykuły Biurowe', 'Rozrywka', 'Jedzenie', 'Sport', 'Ubrania'];


export default function App() {
  const [kwota, setKwota] = useState('');
  const [data, setData] = useState('');
  const [kategoria, setKategoria] = useState(Categories[0]);

  return (
    <View style={styles}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

