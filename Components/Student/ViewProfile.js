import React, { useState,useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import { API_GETPROFILE } from '../../APILIST/APILIST';
import Modal from "react-native-modal";

export function ViewProfile({route,navigation}) {
    const ProfileData = route['params']['LoginData']
    const token =ProfileData['token']
    const user_id = route['params']['LoginData']['id']
    const [inputValues, setInputValues] = useState([]);
    const [Profile,setProfile] = useState(null);

    const [isModalVisible, setModalVisible] = useState(false); 
    const [errorMsg,setErrorMsg] = useState(null);  

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 100);
      }, []);

    const handleInputChange = (key, value) => {
        setInputValues((prevData) => {
            const newData = { ...prevData };      
            newData[key] = value;      
            return newData;
          });
    };

    useEffect(() => {
        axios.post(API_GETPROFILE,{
            "user_id":user_id
        })
        .then(response => {
            setProfile(response.data.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [route]);


    return(
        <View style={{flex:1,backgroundColor:'#F7F8FA',paddingBottom:20}}>
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
            {/* <View style={styles.headerPad}>
                <View style={styles.headpadCss}>
                    <TouchableOpacity onPress={()=>navigation.goBack()} style={{width:'20%'}}>
                        <View style={styles.headpad}>
                            <Icon name="chevron-left" size={30}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{width:'60%'}}>
                        <Text style={styles.headerText}>My Profile</Text>
                    </View>
                    <View style={[styles.headpad,{opacity:0,width:'20%'}]}></View>
                </View>
            </View> */}
            <ScrollView style={{flex:1}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
            >
                    {
                        Profile != null?(
                    <View style={{padding:10}}>
                    
                    <Text style={styles.textcss}>First Name</Text>
                    <View style={[styles.inputView]}>
                        <Text style={styles.TextInput}>{Profile.user_detail.firstname}</Text>
                    </View>
                    <Text style={styles.textcss}>Last Name</Text>
                    <View style={[styles.inputView]}>
                        <Text style={styles.TextInput}>{Profile.user_detail.lastname}</Text>
                    </View>
                    <Text style={styles.textcss}>Father/Guardians Name</Text>
                    <View style={[styles.inputView]}>
                        <Text style={styles.TextInput}>{Profile.user_detail.father_name}</Text>                        
                    </View>
                    <Text style={styles.textcss}>Address</Text>
                    <View style={[styles.inputView,{height:100}]}>
                        <Text style={styles.TextInput}>{Profile.user_detail.address}</Text>                        
                    </View>
                    {
                      ProfileData.type == null?(
                        <View>
                          <Text style={styles.textcss}>Student Mobile number</Text>
                          <View style={[styles.inputView]}>
                             <Text style={styles.TextInput}>{Profile.phone_no}</Text>                              
                          </View>
                          <Text style={styles.textcss}>Parent Mobile number</Text>
                          <View style={[styles.inputView]}>
                            <Text style={styles.TextInput}>{Profile.user_detail.parent_phone}</Text>                                 
                          </View>
                          
                          
                          <Text style={styles.textcss}>Religion</Text>
                          <View style={[styles.inputView]}>
                            {
                              Profile.user_detail.religion !=null?(
                                <Text style={styles.TextInput}>{Profile.user_detail.religion.name}</Text>
                              ):null
                            }
                            
                        </View>
                          <Text style={styles.textcss}>Community</Text>
                          <View style={[styles.inputView]}>
                          {
                              Profile.user_detail.community !=null?(
                                <Text style={styles.TextInput}>{Profile.user_detail.community.name}</Text>
                              ):null
                            }
                          </View>
                          <Text style={styles.textcss}>Caste</Text>
                          <View style={[styles.inputView]}>
                          {
                              Profile.user_detail.cast !=null?(
                                <Text style={styles.TextInput}>{Profile.user_detail.cast.name}</Text>
                              ):null
                            }                             
                          </View>
                        </View>

                      ):(
                        <View>
                          <Text style={styles.textcss}>Mobile number</Text>
                          <View style={[styles.inputView]}>
                                <Text style={styles.TextInput}>{Profile.phone_no}</Text>
                          </View>
                        </View>
                      )
                    }
                    <Text style={styles.textcss}>Gender</Text>
                    <View style={[styles.inputView]}>
                        <Text style={styles.TextInput}>{Profile.user_detail.gender}</Text>
                    </View>
                    <Text style={styles.textcss}>Email</Text>
                    <View style={[styles.inputView]}>
                        <Text style={styles.TextInput}>{Profile.email}</Text>
                    </View>

                    <View style={{marginTop:5}}>
                      <Text style={styles.textcss}>Date Of Birth</Text>
                        <View style={[styles.inputView]}>
                            <Text style={styles.TextInput}>{Profile.user_detail.dob_formatted}</Text>
                        </View>
                    </View>                    
                    
                    <Text style={styles.textcss}>AAdhar Number</Text>
                    <View style={[styles.inputView]}>
                        <Text style={styles.TextInput}>{Profile.user_detail.aadhar_number}</Text>
                    </View>
                    {
                      ProfileData.type == null?(
                        <View>
                          <Text style={styles.textcss}>Parent Annual Income</Text>
                          <View style={[styles.inputView]}>
                            <Text style={styles.TextInput}>{Profile.user_detail.parent_income}</Text>
                          </View> 
                        </View>

                      ):null
                    }
                                        
                </View>
                        ):(
                            <View style={{marginTop:200}}>                            
                              <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        )
                    }
                
            </ScrollView>
            
            <TouchableOpacity style={[styles.loginBtn,{backgroundColor:'#313955'}]} onPress={()=>navigation.navigate('My Profile',
              {
                ProfileVal:Profile,
                token:token
              }
            )}>
                <Text style={styles.loginText} >
                    Edit
                </Text>
            </TouchableOpacity>            
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
        minHeight:100,
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
        borderRadius: 20,
        height: 50,
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
        borderRadius: 7,
        height: 50,
        borderWidth:0.4,
        marginTop:20,
        marginLeft:5,
        marginRight:5,
        bottom:6,
        backgroundColor:'#fff',
        justifyContent:'center'
      },
      TextInput: {
        alignSelf:'center',
        fontSize:13,
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
      container: {
        backgroundColor: 'white',
        borderRadius:5,
        borderWidth:0.2,
        margin:5
      },
      dropdown: {
        height: 50,
        paddingHorizontal: 8,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
        color:'#003f5c'
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
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