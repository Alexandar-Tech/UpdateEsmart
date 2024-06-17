import React, {  useState,useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Keyboard,
  LogBox,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';

import { API_SENTOTP,API_GETCOUNTRY } from '../../APILIST/APILIST';
import { StatusBar } from 'expo-status-bar';
import { SelectCountry } from 'react-native-element-dropdown';
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import CountryCodeDropdownPicker from "react-native-dropdown-country-picker";
// import AsyncStorage from '@react-native-async-storage/async-storage';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HomepageLoginScreen() {
  LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.']);
  LogBox.ignoreLogs(['ReactImageView'])
    const [couData, setCouData] = useState([]);
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [isChecked, setChecked] = useState(false);
    const [isScreen, setIsScreen] = useState(1);
    const [isModalVisible, setModalVisible] = useState(false);
    const [errorMsg,setErrorMsg] = useState(null);
    const [country, setCountry] = useState('91');

    // const [selected, setSelected] = React.useState('+91');
    // const [country, setCountry] = React.useState('');
    // const [phone, setPhone] = React.useState('');

    useEffect(() => {
      // Fetch data when the component mounts
      axios.post(API_GETCOUNTRY)
      .then(response => {
        setCouData(response.data.data);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
      }, []);

    const keyboardAviod  = (val) =>{
      if(val.length == 10){        
        Keyboard.dismiss()
      }      
      setPhoneNumber(val)
    }

    const [refreshing, setRefreshing] = React.useState(true);
const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

    const toggleOTP = () =>{        
        if(!isChecked){
            setErrorMsg('Please Check terms and Conditions !')
            setModalVisible(true)
            return
        }

        const fetchData = async () => {
            const resp = await fetch(API_SENTOTP,{
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "phone_no" : phoneNumber, 
              }),
        
            })    
            const response = await resp.json();
            if (response.success == '1'){
              if(response.is_register == 1){
                navigation.navigate('OTPScreen',{
                  Number:phoneNumber,
                  PIN:response.pin
              }) 
              return                    
              }

              if(response.pin == 0 && response.data != undefined){
                  navigation.navigate('PinScreen',{
                    UserId:response.data.id,
                    PIN:response.pin,
                    number:phoneNumber
                }) 
                return

              }
              if(response.pin == 1){
                navigation.navigate('ValidateOtp',{
                  UserId:response.data.id,
                  PIN:response.pin,
                  number:phoneNumber
                }) 
                return
              }
              
            }else{
              setErrorMsg(response.msg)
              setModalVisible(true)
            }
          };
    fetchData()

    }

    const SelectCountryScreen = _props => {
        
      return (
        <SelectCountry
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          placeholderStyle={styles.placeholderStyle}
          imageStyle={styles.imageStyle}
          inputSearchStyle={styles.inputSearchStyle}
          search
          maxHeight={200}
          value={country}
          data={couData}
          valueField="id"
          labelField="phonecode"
          placeholder={country}
          searchPlaceholder="Search..."
          onChange={e => {
            setCountry(e.id);
          }}
        />
      );
    };

      return(
        <View style={{backgroundColor:'#313955',paddingBottom:20,flex:1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >

        {
            isScreen?(
                <>

                        <Modal 
                          isVisible={isModalVisible}
                          style={styles.modelcontainer}
                          onBackdropPress={() => setModalVisible(false)}
                          swipeDirection={['down']}
                          onSwipeComplete={() => setModalVisible(false)}
                          >
                              <View style={styles.modelView}>
                                {
                                  errorMsg?<Text style={{fontSize:15,fontWeight:'bold',top:30}}>{errorMsg}</Text>:null
                                }
                                
                                <TouchableOpacity style={{top:70,height:50,width:'100%',alignSelf:'center',backgroundColor:'#313955',alignItems:'center',justifyContent:'center',borderRadius:10}} onPress={()=>setModalVisible(false)}>
                                  <Text style={{color:'#fff',fontSize:18,fontWeight:'bold'}}>Ok</Text>
                                </TouchableOpacity>
                              </View>
                        </Modal>
                        <StatusBar style='auto' />
                        <KeyboardAwareScrollView >
                            <View style={{height:windowHeight/1.54}}>
                                <Image style={styles.logo} source={require('../../assets/HomeScreen/splash_header_image.png')} />
                            </View>
                            <View style={{height:20}}>

                            </View>
                            
                            <View>                                
                                <Text style={[styles.fontcss,{}]}>Enter your phone number</Text>
                                <View style={styles.LoginPadding}>
                                    <View style={styles.fixToText}>
                                        <View style={{width:'30%'}}>
                                            <SelectCountryScreen />
                                        </View>
                                        <View style={{width:'70%'}}>
                                        <TextInput
                                            style={styles.TextInput}
                                            placeholder="Phone Number"
                                            placeholderTextColor="#003f5c"
                                            inputMode="numeric"
                                            onChangeText={text=>keyboardAviod(text)}
                                            value={phoneNumber}
                                            maxLength={10}
                                        />
                                            
                                        </View>
                                    </View>
                                </View>
                                
                                <View style={styles.section}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={isChecked}
                                        onValueChange={setChecked}
                                        color={isChecked ? '#FCB301' : undefined}
                                    />
                                    <Text style={[styles.fontcss,{fontSize:12,width:'80%'}]}>By signing , I agree to the <Text style={{color:'#FCB301'}}>Terms & Conditions</Text> and <Text style={{color:'#FCB301'}}>Privacy Policy</Text> of Colleaze</Text>
                                </View>
                                <TouchableOpacity style={styles.loginBtn} onPress={()=>toggleOTP()}>
                                    <Text style={styles.loginText}>
                                        Continue
                                    </Text>

                                </TouchableOpacity>
                            </View>
                        </KeyboardAwareScrollView>                        
                </>                
            ):null
        }
            
        </View>
    )

  }


  const styles = StyleSheet.create({

  fontcss:{
    fontSize:16,
    fontWeight:'bold',
    color:'#fff',
    padding:15
  },
  button: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width:'100%',
    margin:10
  },
  LoginPadding: {
    backgroundColor: '#ffff',
    borderRadius: 10,
    height:50,
    width:'90%',
    alignSelf:'center',
    bottom:5
  },
  logo: {
    height:'100%',
    width:windowWidth,
  },
  inputView: {
    top: 20,
    left: 40,
    backgroundColor: '#FFFF',
    borderRadius: 10,
    width: '80%',
    height: 45,
    marginBottom: 20,
  },
  TextInput: {
    height: 40,
    flex: 1,
    paddingRight: 20,
    marginLeft: 60,
    fontSize:15,
    fontWeight:'bold'
    
  },

  loginBtn: {
    width: '90%',
    borderRadius: 20,
    height:50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCB301',
    alignSelf:'center'
  },
  dropdown: {
    height: 30,
  },
  icon: {
    height:35,
    width:40
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    zIndex: 999,
    fontSize: 14,
    fontWeight:'bold',
    
  },
  placeholderStyle: {
    fontSize: 14,
    fontWeight:'bold',
    marginLeft:15    
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight:'bold',
    marginLeft:15
    
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight:20,
    marginLeft:20
  },
  checkbox: {
    margin: 8,
    backgroundColor:'#fff',
    borderColor:'#fff'
  },
  loginText:{
    fontSize:18,
    color:'#fff',
    fontWeight:'bold'
  },
  container: {

  },
  imageStyle: {
    width: 24,
    height: 24,
  },
  modelcontainer:{
    margin: 10,
    justifyContent:'center'
  },
  modelView:{
    backgroundColor: 'white', 
    padding: 16,
    height:200,
    borderRadius:20,
    alignItems:'center'
  },
});