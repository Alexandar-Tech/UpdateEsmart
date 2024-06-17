import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ScrollView,ActivityIndicator,Image,TextInput,
    BackHandler,Alert
 } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import { API_COLLEGELIST } from '../../APILIST/APILIST';
import { ButtonGroup } from '@rneui/themed';
import Modal from "react-native-modal";
import DoubleSlider from './Slider';

export function CollegeList({route,navigation}) {

    const AllData = route.params.LoginData
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState(null);

    useEffect(() => {
        const backAction = () => {
          Alert.alert('Hold on!', 'Are you sure you want to go back?', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {text: 'YES', onPress: () => BackHandler.exitApp()},
          ]);
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
    
        return () => backHandler.remove();
      }, []);

    useEffect(() => {
        axios.post(API_COLLEGELIST,{
            "search":searchText
        })
        .then(response => {
            setData(response.data);
            setLoading(false)
        })
        .catch(error => {
            setData(error.response.data);
            setLoading(true)
        });
    }, [searchText]);    

    return(
        <>
                    <Modal 
                    isVisible={isModalVisible}
                    style={styles.modelcontainer}
                    onBackdropPress={() => setModalVisible(false)}
                    swipeDirection={['down']}
                    onSwipeComplete={() => setModalVisible(false)}
                    >
                        <View style={styles.modelView}>                            
                            <DoubleSlider />
                            <View>
                                <Text style={{color:'#313955',fontWeight:'bold',left:15}}>Accreditions</Text>
                            </View>  
                            <View style={{flexDirection:'row',justifyContent:'space-around',margin:10}}>
                                <View style={{flexDirection:'row',height:50,width:80,backgroundColor:'#313955',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{fontSize:15,fontWeight:'bold',color:'#fff'}}>NAAC</Text>
                                </View>
                                <View style={{flexDirection:'row',height:50,width:80,backgroundColor:'#313955',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{fontSize:15,fontWeight:'bold',color:'#fff'}}>NBA</Text>
                                </View>
                                <View style={{flexDirection:'row',height:50,padding:5,backgroundColor:'#313955',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{fontSize:15,fontWeight:'bold',color:'#fff'}}>AUTONOMOUS</Text>
                                </View>
                            </View>
                        </View>
                    </Modal>
                <View style={{ flex: 1}}>
                    <View style={styles.headerPad}>
                        <View style={{margin:10,padding:10}}>
                            <Text style={styles.headerText}>Colleges & Universities</Text>
                        </View>
                        
                        <View style={{paddingVertical:20}}>
                            <ButtonGroup
                            buttons={['Colleges', 'Universities']}
                            selectedIndex={selectedIndex}
                            onPress={(value) => {
                                setSelectedIndex(value);
                            }}
                            containerStyle={{ borderRadius:10,height:50,borderRadius:30,backgroundColor:'#fff'}}
                            textStyle={{fontSize:16,fontWeight:'bold'}}
                            buttonStyle={{borderRadius:30}}
                            innerBorderStyle={{color:'#fff'}}
                            selectedButtonStyle = {{backgroundColor:'#FCB301'}}
                            />  
                        </View>
                    </View>
                    <ScrollView style={{flex:1}}>
                        <View style={{padding:20}}>
                            {
                                !selectedIndex?(
                                    <View>

                            <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>
                                {
                                    data?<Text style={{fontSize:16,fontWeight:'bold',}}>{data.data.length} Colleges</Text>:<Text style={{fontSize:16,fontWeight:'bold',}}>0 College</Text>
                                }
                                
                                {/* <TouchableOpacity onPress={()=>toggleModal()}>
                                 <IconMC name="filter-menu-outline" size={30} style={{bottom:5}}/>
                                </TouchableOpacity> */}
                            </View>
                            <View style={[styles.inputView,{opacity:0.5}]}>
                                        <TextInput
                                            style={[styles.TextInput,{textAlign:'left',padding:10,left:20}]}
                                            placeholder="Search by colleges/courses"
                                            placeholderTextColor="#313955"
                                            onChangeText={(text)=>setSearchText(text)}
                                        />
                                    </View>
                            {
                                loading?(
                                    <View>
                                        {
                                            data?(<View style={{justifyContent:'center',alignItems:'center',flex:1,marginTop:200}}>
                                                <Text style={{fontSize:18,fontWeight:'bold',color:'red'}}>{data.msg}</Text>
                                                </View>):<ActivityIndicator size="large" color="#0000ff" />
                                        }
                                        
                                    </View>
                                ):(<View>                                    
                                    {
                                        data.data?(
                                        data['data'].map((item,index)=>(
                                            <View key={item.id}>
                                                <TouchableOpacity onPress={()=>navigation.navigate('MainCollege',{
                                                    ItemData:item,
                                                    LoginData:AllData
                                                })}>
                                                <View style={{flexDirection:'row',alignSelf:'center'}}>
                                                    <View style={{minHeight:150,width:'100%',backgroundColor:'#fff',borderRadius:20,margin:10,flexDirection:'row',borderColor:'#fff',borderWidth:1}}>
                                                        <View style={{width:'40%'}}>
                                                            <Image source={require('../../assets/College/universities.png')} style={{height:140,width:'100%',margin:10,borderRadius:10}}  />
                                                        </View>
                                                        
                                                        <View style={{width:'45%',margin:10,paddingLeft:20}}>     
                                                            <View style={{flexDirection:'row',height:30,width:80,backgroundColor:'#313955',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                                                                <Image source={require('../../assets/College/Star_1.png')} style={{height:10,width:10,borderRadius:10,margin:5}}  />
                                                                <Text style={{fontSize:15,fontWeight:'bold',color:'#fff'}}>NAAC</Text>
                                                            </View>                                                      
                                                            <Text style={{fontSize:15,fontWeight:'bold',color:'#313955',padding:10}}>{item.name}</Text>
                                                            <View style={{flexDirection:'row',width:'100%',top:20}}>
                                                                <View style={{width:'70%',flexDirection:'row',top:10}}>
                                                                    <Icon name="location-pin" size={20} color={'#313955'}/>
                                                                    <Text style={{fontSize:11,fontWeight:'bold',color:'#313955'}}>{item.city.name}</Text>
                                                                </View>
                                                                <View style={{width:'50%'}}>
                                                                    {/* <View style={{alignSelf:'flex-end',height:30,width:30,backgroundColor:'#FCB301',borderRadius:20,alignItems:'center',justifyContent:'center'}}>
                                                                        <IconMC name='navigation-variant' size={20} color={'#fff'}/>                                                                    
                                                                    </View> */}
                                                                </View>
                                                                
                                                                
                                                            </View>
                                                        </View>    
                                                    </View>                                                    
                                                </View>        
                                                </TouchableOpacity>                                        
                                            </View>
                                        ))):null
                                    }
                                    
                                    </View>)
                            }
                            </View>
                                )
                            :(<View style={{alignItems:'center',marginTop:100}}>
                            <Image source={require('../../assets/HomeScreen/NoData.png')} style={{height:200,width:'80%',borderRadius:10}}  />
                        </View>)}
                        </View>
                    </ScrollView>
                </View>
        </>
    )
}

const styles = StyleSheet.create({
    headerPad:{
        minHeight:140,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        backgroundColor:'#313955',
    },
  headpadCss:{
      flexDirection:'row',
      marginTop:60,
      justifyContent:'space-between',
      margin:15,
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
  },
  inputView: {
    borderColor:'#313955',
    height:50,
    width:'100%',
    borderWidth:1,
    alignSelf:'center',
    borderRadius:20
  },
  TextInput: {
    height: 40,
    flex: 1,
    fontWeight:'bold',
    textAlign:'center'
  },
  modelcontainer:{
    margin: 0,
    justifyContent:'flex-end'
  },
  modelView:{
    backgroundColor: 'white', 
    padding: 16,
    height:250,
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
  },
  
})