import React, { useEffect, useState } from "react";
import { TextInput, Text, View, StyleSheet } from "react-native-web";

const DateInput = ({ onChange }) => {
  const [date, setDate] = useState(new Date());
  const [day, setDay] = useState(date.getDate());
  const [month, setMonth] = useState(date.getMonth() + 1);
  const [year, setYear] = useState(date.getFullYear());

  useEffect(() => {
    setDate(new Date([year, month, day].join("-")));
  }, [day, month, year]);

  useEffect(() => {
    onChange(date)
  }, [date])

  return (
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
  );
};

const inputStyles = StyleSheet.create({
  container: {
    width: 60,
  },
});

export default DateInput;
