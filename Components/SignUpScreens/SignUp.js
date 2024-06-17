import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Checkbox from 'expo-checkbox';
import { API_REGISTERUSER } from '../../APILIST/APILIST';
import { RadioButton } from 'react-native-paper';
import Modal from "react-native-modal";
import { StatusBar } from 'expo-status-bar';

export function AdmissionSignup({route,navigation}) {
    const phoneNumber = route['params']['number']
    const [isChecked, setIsChecked] = useState(false);
    const [isFirstName, setisFirstName] = useState(false);
    const [isLastName, setisLastName] = useState(false);
    const [email, setEmail] = useState(false);
    const [checked, setChecked] = useState('student');
    const [isModalVisible, setModalVisible] = useState(false);
    const [errorMsg,setErrorMsg] = useState(null);
    const [consultancy, setConsultancy] = useState(false);
    
    const handleRadioChange = (value) => {
        setChecked(value);
    };

    const fetchData = async () => {
        const resp = await fetch(API_REGISTERUSER,{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        "firstname" : isFirstName,
          "lastname":isLastName,
          "email":email,
          "phone_no":phoneNumber,
          "phone_code":'91',
          "type":checked,
          "consultancy_agency_name":consultancy
        }),
    
        })    
        const response = await resp.json();
        if(!isChecked){
            setErrorMsg('Please Check terms and Conditions !')
            setModalVisible(true)
            return
        }
        if (response.success == '1'){ 
            setErrorMsg(response.msg)
            setModalVisible(true)   
            setTimeout(() => {
                setModalVisible(false)   
                navigation.navigate('Login')      
              }, 2000)     
        }else{
            setErrorMsg(response.msg)
            setModalVisible(true)
        }
    };
      
    return(
        <View style={{flex:1,backgroundColor:'#F7F8FA'}}>
            <StatusBar style='auto' />
            <View style={{flex:1}}>
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
            <View style={styles.headerPad}>
                <View style={styles.headpadCss}>
                    <TouchableOpacity onPress={()=>navigation.goBack()} style={{width:'20%'}}>
                        <View style={styles.headpad}>
                            <Icon name="chevron-left" size={30}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{width:'60%'}}>
                        <Text style={styles.headerText}>Admission Signup</Text>
                    </View>
                    <View style={[styles.headpad,{opacity:0,width:'20%'}]}></View>
                </View>
            </View>
            <ScrollView style={{flex:1}}>
                <View style={{padding:10}}>
                    <Text style={styles.textcss}>Select Student or Consultant</Text>
                <RadioButton.Group onValueChange={handleRadioChange} value={checked}>
                    <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10}} >
                        <View style={{flexDirection:'row'}}>
                            <RadioButton value={'student'} />
                            <Text style={{fontWeight:'bold',fontSize:15,marginRight:10,top:6}}>Student</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <RadioButton value={'agent'} />
                            <Text style={{fontWeight:'bold',fontSize:15,marginRight:10,top:6}}>Consultant</Text>
                        </View>
                    </View>
                </RadioButton.Group>
                    <Text style={styles.textcss}>First Name</Text>
                    <View style={styles.fittotext}>
                        <View style={[styles.inputView,{width:'30%'}]}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Mr"
                                placeholderTextColor="#003f5c"
                            />
                        </View>
                        <View style={[styles.inputView,{width:'62%'}]}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="First Name"
                                placeholderTextColor="#003f5c"
                                onChangeText={(text)=>setisFirstName(text)}
                            />
                        </View>
                    </View>
                    <Text style={styles.textcss}>Last Name</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder="Last Name"
                        placeholderTextColor="#003f5c"
                        onChangeText={(text)=>setisLastName(text)}
                        />
                    </View>
                    <Text style={styles.textcss}>Phone Number</Text>
                    <View style={styles.fittotext}>
                        <View style={[styles.inputView,{width:'30%'}]}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder=" IN (+91)"
                                placeholderTextColor="#003f5c"
                            />
                        </View>
                        <View style={[styles.inputView,{width:'62%',alignItems:'center',justifyContent:'center'}]}>
                            <Text>{phoneNumber}</Text>
                        </View>
                    </View>
                    <Text style={styles.textcss}>Email</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        placeholder="Email"
                        placeholderTextColor="#003f5c"
                        onChangeText={(text)=>setEmail(text)}
                        />
                    </View>
                    {
                        checked == 'agent'?(
                            <View>
                                <Text style={styles.textcss}>Consultancy name</Text>
                                <View style={[styles.inputView]}>
                                    <TextInput
                                        style={styles.TextInput}
                                        placeholder="Consultancy name"
                                        placeholderTextColor="#003f5c"
                                        onChangeText={(text)=>setConsultancy(text)}
                                    />
                                </View>
                            </View>
                        ):null
                    }
                    
                </View>
            </ScrollView>
            <View style={styles.section}>
                <Checkbox
                    style={styles.checkbox}
                    value={isChecked}
                    onValueChange={setIsChecked}
                    color={isChecked ? '#FCB301' : undefined}
                />
                <View style={{padding:20}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.fontcss}>By signing , I agree to the</Text>
                        <Text style={[styles.fontcss,{color:'#FCB301'}]}>Terms & Conditions</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>                     
                        <Text style={styles.fontcss}> and </Text>
                        <Text style={[styles.fontcss,{color:'#FCB301'}]}>Privacy Policy</Text> 
                        <Text style={styles.fontcss}>of Colleaze</Text>
                    </View>
                </View>
                
            </View>
            
            <TouchableOpacity style={styles.loginBtn} onPress={()=>fetchData()}>
                <Text style={styles.loginText}>
                    Sign Up
                </Text>
            </TouchableOpacity>
            <View style={{flexDirection:'row',alignSelf:'center',margin:10}}>
                <Text style={{fontSize:14,fontWeight:'bold',color:'#313955'}}>
                        Already have an accoun? 
                </Text>
                <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
                    <Text style={{fontSize:16,color:'#FCB301',fontWeight:'bold',left:10}}>
                        Login
                    </Text>
                </TouchableOpacity>
            </View>
            
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    fittotext:{
        flexDirection:'row',
        columnGap:10
    },
    headerPad:{
        minHeight:150,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        backgroundColor:'#313955',
    },
    headpadCss:{
        flexDirection:'row',
        marginTop:60,
        justifyContent:'space-between',
        paddingHorizontal:10,
        margin:10,
        width:'100%'
    },
    headpad:{
        height:50,
        width:50,
        borderRadius:10,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center'
    },
    headerText:{
        textAlign:'center',
        fontSize:18,
        fontWeight:'bold',
        color:'#fff',
        top:10,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        margin:10,
        alignSelf:'center'
      },
      input: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 20,
        marginHorizontal: 5,
      },
      loginBtn: {
        width: '90%',
        borderRadius: 10,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FCB301',
        alignSelf:'center'
      },
      loginText:{
        fontSize:18,
        color:'#fff',
        fontWeight:'bold'
      },
      inputView: {
        borderRadius: 10,
        height: 45,
        borderWidth:0.4,
        marginTop:20,
        marginLeft:5,
        marginRight:5
      },
      TextInput: {
        height: 40,
        flex: 1,
        fontWeight:'bold',
        textAlign:'center'
      },
      textcss:{
        fontSize:16,
        fontWeight:'bold',
        opacity:0.5,
        top:10,
        left:10
      },
      fontcss:{
        fontSize:13,
        fontWeight:'bold',
        color:'#313955',
      },
      section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight:20,
        marginLeft:20
      },
      checkbox: {
        margin: 8,
        backgroundColor:'#313955',
        borderColor:'#313955'
      },
      modelcontainer:{
        margin: 10,
        justifyContent:'center'
      },
      modelView:{
        backgroundColor: 'white', 
        padding: 16,
        height:170,
        borderRadius:20,
        alignItems:'center'
      },
})