import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ScrollView,ActivityIndicator,Image,TextInput } from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import { ButtonGroup } from '@rneui/themed';
import { RadioButton } from 'react-native-paper';
import { API_COURSELIST } from '../../APILIST/APILIST';

export function MainCollege({route,navigation}) {
    const CollegeData = route['params']['ItemData']
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [checked, setChecked] = useState(0);

    
    const handleRadioChange = (value) => {
        setChecked(value);
    };

    useEffect(() => {
        axios.post(API_COURSELIST,{
            "college_id":CollegeData.id
        })
        .then(response => {
            setData(response.data);
            setLoading(false)
        })
        .catch(error => {
            setData(error.response.data);
        });
    }, []);

    return(
        <>
                    <View style={{ flex: 1}}>
                            <Image source={require('../../assets/College/MianCollege.png')} style={{height:'55%',width:'100%',resizeMode:'contain'}}  />
                            <View style={[styles.headerPad,{padding:10}]}>
                                <Text style={{fontSize:16,fontWeight:'bold',padding:10}}>{CollegeData.name}</Text>
                                <View style={{flexDirection:'row',columnGap:20,paddingLeft:10,paddingRight:10}}>
                                    <Text style={{fontSize:13,fontWeight:'bold'}}>Engineering</Text>
                                    <Text style={{fontSize:13,fontWeight:'bold'}}>|</Text>
                                    <Text style={{fontSize:13,fontWeight:'bold'}}>
                                    <Icon name="location-pin" size={15} color={'#FCB301'}/>{CollegeData.city.name}</Text>
                                </View>
                                <View style={{flexDirection:'row',columnGap:10}}>
                                    <View style={{flexDirection:'row'}}>
                                        <Image source={require('../../assets/College/Star_1.png')} style={{height:10,width:10,borderRadius:10,margin:5}}  />
                                        <Text style={{fontSize:15,fontWeight:'bold',color:'#313955'}}>NAAC</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Image source={require('../../assets/College/Star_1.png')} style={{height:10,width:10,borderRadius:10,margin:5}}  />
                                        <Text style={{fontSize:15,fontWeight:'bold',color:'#313955'}}>NBA</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection:'row',columnGap:10,alignSelf:'flex-end',marginTop:10}}>
                                    <View style={{flexDirection:'row',padding:3,backgroundColor:'#313955',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                                        <Image source={require('../../assets/College/Star_1.png')} style={{height:10,width:10,borderRadius:10,margin:5}}  />
                                        <Text style={{fontSize:15,fontWeight:'bold',color:'#fff'}}>CALL US</Text>
                                    </View>
                                    <View style={{flexDirection:'row',padding:3,backgroundColor:'#313955',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                                        <Image source={require('../../assets/College/whatsapp.png')} style={{height:20,width:20,borderRadius:10,margin:5}}  />
                                        <Text style={{fontSize:15,fontWeight:'bold',color:'#fff'}}>Whats App</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{height:50}}>

                            </View>

                        <ScrollView style={{flex:1}}>
                            <View style={{minHeight:100,width:'90%',backgroundColor:'#fff',alignSelf:'center',borderRadius:10}}>
                                <Text style={{paddingTop:10,paddingLeft:12,fontSize:16,fontWeight:'bold'}}>
                                    About US
                                </Text>
                                <Text style={{textAlign:'justify',padding:12,fontWeight:'bold',fontSize:14,opacity:0.8}}>
                                    {CollegeData.about_us}
                                </Text>
                                <TouchableOpacity style={{alignSelf:'flex-end'}}>
                                    <Text style={{fontSize:15,fontWeight:'bold',color:'#FCB301'}}>Read more..</Text>
                                </TouchableOpacity>                                    
                            </View>
                            <View style={{paddingVertical:20}}>
                                <ButtonGroup
                                buttons={['Under Gradute', 'Post Gradute']}
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
                            <ScrollView style={{flex:1}}>
                                <View style={{paddingBottom:10}}>
                                    {
                                    loading?(
                                        <View>
                                            {
                                                data?(<View style={{alignSelf:'center',width:'90%',padding:10,backgroundColor:'#313955',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                                                    <Text style={{fontSize:18,fontWeight:'bold',color:'#fff'}}>{data.msg}</Text>
                                                    </View>):<ActivityIndicator size="large" color="#0000ff" />
                                            }
                                            
                                        </View>
                                    ):(
                                        
                                            !selectedIndex?(
                                                data.data.ug.map((item,index)=>(
                                                    <View key={index} style={{margin:10}}>
                                                <View style={{width:'100%',backgroundColor:'#fff',alignSelf:'center',borderRadius:10,borderWidth:0.2}}>
                                                    <View style={{width:'100%',backgroundColor:'#313955',alignSelf:'center',borderRadius:10,flexDirection:'row'}}>
                                                        <View style={{width:'65%'}}>
                                                            <Text style={{fontSize:15,fontWeight:'bold',color:'#fff',padding:10}}>{item.name}</Text>
                                                        </View>
                                                        <View style={{width:'32%',alignSelf:'center'}}>
                                                            <TouchableOpacity onPress={()=>navigation.navigate('EnquiryForm',{
                                                                Coursename : item.name
                                                            })} style={{height:30,width:'100%',backgroundColor:'#FCB301',borderRadius:10,alignItems:'center',justifyContent:'center',padding:5}}>
                                                                <RadioButton.Group onValueChange={handleRadioChange} value={checked}>
                                                                <View style={{flexDirection:'row',justifyContent:'space-between'}} >
                                                                    <RadioButton value={index} />
                                                                    <Text style={{fontWeight:'bold',fontSize:15,marginRight:10,top:6}}>Enquire</Text>                                                        
                                                                </View>
                                                                </RadioButton.Group>                                                                
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>  
                                                    <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>
                                                        <Text style={{fontSize:15,fontWeight:'bold'}}>Fees Per Semester</Text>
                                                        <Text style={{fontSize:15,fontWeight:'bold'}}>{item.fees}</Text>
                                                    </View>                                                                              
                                                </View>
                                            </View>
                                                ))
                                            ):(
                                        data.data.pg.map((item,index)=>(
                                            <View key={index} style={{margin:10}}>
                                                <View style={{width:'100%',backgroundColor:'#fff',alignSelf:'center',borderRadius:10,borderWidth:0.2}}>
                                                    <View style={{width:'100%',backgroundColor:'#313955',alignSelf:'center',borderRadius:10,flexDirection:'row'}}>
                                                        <View style={{width:'65%'}}>
                                                            <Text style={{fontSize:15,fontWeight:'bold',color:'#fff',padding:10}}>{item.name}</Text>
                                                        </View>
                                                        <View style={{width:'32%',alignSelf:'center'}}>
                                                            <TouchableOpacity onPress={()=>navigation.navigate('EnquiryForm',{
                                                                Coursename : item.name
                                                            })} style={{height:30,width:'100%',backgroundColor:'#FCB301',borderRadius:10,alignItems:'center',justifyContent:'center',padding:5}}>
                                                                <RadioButton.Group onValueChange={handleRadioChange} value={checked}>
                                                                <View style={{flexDirection:'row',justifyContent:'space-between'}} >
                                                                    <RadioButton value={index} />
                                                                    <Text style={{fontWeight:'bold',fontSize:15,marginRight:10,top:6}}>Enquire</Text>                                                        
                                                                </View>
                                                                </RadioButton.Group>                                                                
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>  
                                                    <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>
                                                        <Text style={{fontSize:15,fontWeight:'bold'}}>Fees Per Semester</Text>
                                                        <Text style={{fontSize:15,fontWeight:'bold'}}>{item.fees}</Text>
                                                    </View>                                                                              
                                                </View>
                                            </View>

                                        )  
                                        ))                                          
                                    )
                                }
                                </View>
                            </ScrollView>
                            <View>
                                <Text style={{margin:10,left:20,fontSize:17,fontWeight:'bold',opacity:0.8}}>Placement Companies</Text>
                                <View style={styles.fittotext}>
                                    <View style={styles.boxpad}>
                                        <View style={{flexDirection:'row',width:'100%',columnGap:5}}>
                                            <View style={{width:'25%'}}>
                                                <Image source={require('../../assets/College/Ellipse.png')} style={{height:30,width:30}}  />
                                            </View>
                                            <View style={{width:'75%'}}>
                                                <Text style={{fontWeight:'bold',fontSize:16}}>Cadila Pharma</Text>
                                            </View>
                                        </View>
                                        <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:20}}>
                                            <Text style={{fontWeight:'bold',fontSize:16,width:'70%',opacity:0.5}}>No of Placements</Text>
                                            <Text style={{fontWeight:'bold',fontSize:16}}>125</Text>
                                        </View>                                       
                                    </View>
                                    <View style={styles.boxpad}>
                                        <View style={{flexDirection:'row',width:'100%',columnGap:5}}>
                                            <View style={{width:'25%'}}>
                                                <Image source={require('../../assets/College/Ellipse.png')} style={{height:30,width:30}}  />
                                            </View>
                                            <View style={{width:'75%'}}>
                                                <Text style={{fontWeight:'bold',fontSize:16}}>Cadila Pharma</Text>
                                            </View>
                                        </View>
                                        <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:20}}>
                                            <Text style={{fontWeight:'bold',fontSize:16,width:'70%',opacity:0.5}}>No of Placements</Text>
                                            <Text style={{fontWeight:'bold',fontSize:16}}>125</Text>
                                        </View>                                       
                                    </View>
                                </View>
                                <View style={styles.fittotext}>
                                    <View style={styles.boxpad}>
                                        <View style={{flexDirection:'row',width:'100%',columnGap:5}}>
                                            <View style={{width:'25%'}}>
                                                <Image source={require('../../assets/College/Ellipse.png')} style={{height:30,width:30}}  />
                                            </View>
                                            <View style={{width:'75%'}}>
                                                <Text style={{fontWeight:'bold',fontSize:16}}>Cadila Pharma</Text>
                                            </View>
                                        </View>
                                        <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:20}}>
                                            <Text style={{fontWeight:'bold',fontSize:16,width:'70%',opacity:0.5}}>No of Placements</Text>
                                            <Text style={{fontWeight:'bold',fontSize:16}}>125</Text>
                                        </View>                                       
                                    </View>
                                    <View style={styles.boxpad}>
                                        <View style={{flexDirection:'row',width:'100%',columnGap:5}}>
                                            <View style={{width:'25%'}}>
                                                <Image source={require('../../assets/College/Ellipse.png')} style={{height:30,width:30}}  />
                                            </View>
                                            <View style={{width:'75%'}}>
                                                <Text style={{fontWeight:'bold',fontSize:16}}>Cadila Pharma</Text>
                                            </View>
                                        </View>
                                        <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:20}}>
                                            <Text style={{fontWeight:'bold',fontSize:16,width:'70%',opacity:0.5}}>No of Placements</Text>
                                            <Text style={{fontWeight:'bold',fontSize:16}}>125</Text>
                                        </View>                                       
                                    </View>
                                </View>
                            </View>                     
                        </ScrollView>                       
                    </View>
            
        </>
        )

}

const styles = StyleSheet.create({
    fittotext:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        margin:10
    },
    headerPad:{
        backgroundColor:'#fff',
        width:'90%',
        alignSelf:'center',
        borderRadius:10,
        position:'absolute',
        marginTop:'68%'
    },
    boxpad:{
        padding:10,
        height:130,
        width:'48%',
        backgroundColor:'#fff',
        borderRadius:10,
        borderWidth:0.2
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
      top:10,
      right:20
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
    height:350,
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
  },
})