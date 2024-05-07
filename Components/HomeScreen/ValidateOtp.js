import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { API_VALIDATEPIN } from '../../APILIST/APILIST';
import Modal from "react-native-modal";

export function ValidateOtp({route,navigation}) {

    const userID = route['params']['UserId']
    const PhoneNumber =  route['params']['number']
    const [otp, setOTP] = useState(['', '', '', '',]); // State to store OTP digits
    const [isModalVisible, setModalVisible] = useState(false);
    const [errorMsg,setErrorMsg] = useState(null);
    
    const inputRefs = useRef([]);
    const handleChangeText = (text, index) => {
        if (text.length > 1) {
          // If the input is more than one character, only take the last character
          text = text.slice(-1);
        }
        const newOTP = [...otp];
        newOTP[index] = text;
        setOTP(newOTP);
        if (text !== '' && index < 3) {
          // Move focus to the next input field if a digit is entered
          inputRefs.current[index + 1].focus();
        }
      };
     

      const storeData = async (value) => {
        try {
          await AsyncStorage.setItem('isLoggedIn', true);
        } catch (e) {
          // saving error
        }
      };

      const fetchData = async (OTP) => {
            const resp = await fetch(API_VALIDATEPIN,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user_id" : userID,
                "pin":OTP
            }),
        
            })    
            const response = await resp.json();
            if (response.success == '1'){
                storeData()
                if(response.is_register == 1){
                    navigation.navigate('AdmissionSignup',{
                        number:PhoneNumber
                    })
                }else{
                    if(response.data.agent_status == 'inactive' && response.data.parent_agent_id != null) {
                        navigation.navigate('AgentSignUpFull',{
                            number:PhoneNumber,
                            agentid:response.data.id,
                            consultantid:response.data.parent_agent_id,
                            agentForm:true,
                            token:response.data.token
                        })
                        return
                    }
                    if(response.msg == 'Your login successfully as owner'){
                        navigation.navigate('AgentAdmissionDetailS',{
                            LoginData : response.data,
                            userid:response.data.id,
                            org_id :response.data.org[0].id
                        })
                        return
                    }
                    navigation.navigate('BottomTabStack',{
                        LoginData : response.data,
                        userid:response.data.id
                    })
                    
                }
                
            }else{
                setErrorMsg(response.msg)
                setModalVisible(true)
            }
        };

        

      const ValidatePIN = () =>{
        let OTP = otp[0]+otp[1]+otp[2]+otp[3]
        // if(OTP != '111111'){
        //     Alert.alert('Please Enter Valid OTP !')
        //     return
        // }
        fetchData(OTP)
        
      }
    
      // Function to handle backspace/delete key press
      const handleBackspace = (index) => {
        const newOTP = [...otp];
        newOTP[index] = '';
        setOTP(newOTP);
        if (index > 0) {
          // Move focus to the previous input field if backspace is pressed
          inputRefs.current[index - 1].focus();
        }
      };    
    return(
        <View style={{flex:1,backgroundColor:'#F7F8FA'}}>
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
                        <Text style={styles.headerText}>PIN Verification</Text>
                    </View>
                    <View style={[styles.headpad,{opacity:0,width:'20%'}]}></View>
                </View>
            </View>
            <View>
                <Text style={{fontSize:16,color:'#313955',margin:20,left:30}}>Enter PIN</Text>
            </View>
            <View style={styles.container}>
                {otp.map((digit, index) => (
                    <TextInput
                    key={index}
                    style={styles.input}
                    value={digit}
                    onChangeText={(text) => handleChangeText(text, index)}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace') {
                        handleBackspace(index);
                        }
                    }}
                    maxLength={1}
                    keyboardType="numeric"
                    ref={(ref) => {
                        inputRefs.current[index] = ref;
                    }}
                    />
                ))}
            </View>

            <TouchableOpacity onPress={()=>navigation.navigate('OTPScreen',{
                Number:PhoneNumber,
                PIN:0
            })}>
                <Text style={{fontSize:16,color:'#FCB301',textAlign:'right',marginRight:30,fontWeight:'bold',textDecorationLine:'underline'}}>Forget PIN?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} onPress={()=>ValidatePIN()}>
                <Text style={styles.loginText}>
                    Continue
                </Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    fittotext:{
        flexDirection:'row',
        margin:10
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
        top:40,
        width: '90%',
        borderRadius: 25,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FCB301',
        alignSelf:'center'
      },
      loginText:{
        fontSize:18,
        color:'#fff',
        fontWeight:'bold',
        letterSpacing:2
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
})