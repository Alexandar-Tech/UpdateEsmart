import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const DoubleSlider = () => {
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const minValue = 0;
  const maxValue = 100;

  return (
    <View>
    <View style={styles.container}>
      <MultiSlider
        values={sliderValues}
        sliderLength={300}
        min={minValue}
        max={maxValue}
        minimumTrackTintColor="#313955"
        maximumTrackTintColor="#313955"
        thumbTintColor="#0000FF"
        step={1}
        onValuesChange={(values) => setSliderValues(values)}
      />
    </View>
    <View style={{flexDirection:'row',justifyContent:'space-between',margin:30}}>
        <Text style={{color:'#313955',fontWeight:'bold'}}>1 KM</Text>
        <Text style={{color:'#313955',fontWeight:'bold'}}>{sliderValues[1] - sliderValues[0]}</Text>
        <Text style={{color:'#313955',fontWeight:'bold'}}>200 KM</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center'
  },
});

export default DoubleSlider;
