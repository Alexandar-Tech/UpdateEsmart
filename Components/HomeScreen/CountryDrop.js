import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import CountryCodeDropdownPicker from "react-native-dropdown-country-picker";



export default function CountryDrop() {
  const [selected, setSelected] = React.useState('+91');
  const [country, setCountry] = React.useState('');
  const [phone, setPhone] = React.useState('');
  
  return (
    <View style={styles.container}>
      <View>
        <CountryCodeDropdownPicker 
          selected={selected} 
          setSelected={setSelected}
          phone={phone} 
          setPhone={setPhone} 
          countryCodeContainerStyles={{}}
          countryCodeTextStyles={{fontSize: 11}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#fff',
    margin:10,
    borderRadius:10,
    height:'auto'
  },
});
