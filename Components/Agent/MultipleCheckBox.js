import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Checkbox } from 'react-native-paper';

const MultiCheckBox = ({ dataId,onSelectDate, selected }) => {
      
    
  const [checkboxes, setCheckboxes] = useState([
    { id: dataId, checked: false },
  ]);

  const handleCheckboxChange = (id) => {
    const updatedCheckboxes = checkboxes.map((checkbox) =>    
      checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
      
    );
    setCheckboxes(updatedCheckboxes);
    onSelectDate((prevData) => {
        const newData = { ...prevData };    
        newData[updatedCheckboxes[0]['id']] = updatedCheckboxes[0];      
        return newData;
      });
  };

  return (
    <View>
      {checkboxes.map((checkbox) => (
        <View key={checkbox.id}>
          <Checkbox.Item
            status={checkbox.checked ? 'checked' : 'unchecked'}
            onPress={() => handleCheckboxChange(checkbox.id)}
          />
        </View>
      ))}
    </View>
  );
};

export default MultiCheckBox;
