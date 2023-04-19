import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DatePicker from 'react-native-datepicker';

const MyDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Wybierz datę:</Text>
      <DatePicker
        style={styles.datePicker}
        date={selectedDate}
        onDateChange={handleDateChange}
        mode="date"
        locale="pl"
        format="YYYY-MM-DD"
        minDate="2022-01-01"
        maxDate="2023-12-31"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  datePicker: {
    width: 200,
  },
});

export default MyDatePicker;