import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScaledSheet } from 'react-native-size-matters';
import { colors } from '~/utils';

const DateInput = ({ onDateChange, placeholder }: any) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState();
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`
    setText(formattedDate);
    if (onDateChange) {
      onDateChange(currentDate);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatePicker = () => {
    showMode('date');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDatePicker} style={styles.inputContainer}>
        <View style={styles.startDay}>
          <Ionicons name="calendar-outline" color="#000" size={16} style={styles.icon} />
          <TextInput
            style={styles.input}
            value={text}
            placeholder={placeholder}
            placeholderTextColor={"#c0c0c0"}
            editable={false}
          />
        </View>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
  },
  startDay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: "18@s",
    marginBottom: "10@s",
  },
  inputContainer: {
    height: "40@s",
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: "5@s",
    marginBottom: "10@s",
  },
  icon: {
    position: 'absolute',
    top: "10@s",
    left: "10@s"
  },
  input: {
    paddingLeft: "30@s",
    color: colors.black,
    fontSize: "14@s",
  },
});

export default DateInput;
