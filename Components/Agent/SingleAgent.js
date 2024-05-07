import React, { useState,useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Modal from "react-native-modal";
import axios from 'axios';
import { API_COURSE,API_ADMISSIONDETAILUSER } from '../../APILIST/APILIST';

export function SingleAgent({route,navigation}) {
    const AllData = route['params']['LoginData']
    const token  = AllData['token']
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [selectedIndexColor, setSelectedIndexColor] = useState(0);
    const [admissionData,setAdmissionData] = useState(null);
    const OrgID = route['params']['org_id']
    const typeid = route['params']['type']
    const consultant_id = route['params']['consultant_id']

    useEffect(()=>{
        let valJson={
            "consultant_id" : consultant_id,
            "org_id" : OrgID,
            "type":typeid
        }
        fetchdata(valJson)
    },[])

    

    const fetchdata = async (jsonval) =>{
        const resp = await fetch(API_ADMISSIONDETAILUSER,{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(jsonval) })    
          const response = await resp.json();
          if(response.success ==1){
            setAdmissionData(response.data)
          }
          
        //   setAdmissionData(response.data.data)
    }


    const toggledata = (val) =>{
        let valJson={
            "consultant_id" : consultant_id,
            "org_id" : OrgID,
            "department_id" : val,
            "type":typeid
        }
        fetchdata(valJson)
        setModalVisible(false)
    }
    const [isModalVisible, setModalVisible] = useState(false);
    const [valueCourse, setValueCourse] = useState([]);

    const toggleModal = (val) =>{
        setModalVisible(true)
        axios.post(API_COURSE,{
            "org_id" : OrgID,
        },
        {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            setValueCourse(response.data.data)
        })
        .catch(error => {  
          // console.log(error)    
        });
    }
    
    const toggleColor = (val) =>{
        if(val ==1 ){
            setSelectedIndex(1)
            setSelectedIndexColor(0)
        }else{
            setSelectedIndex(0)
            setSelectedIndexColor(1)
        }
    }

    return(
        <View style={{flex:1,backgroundColor:'#fff'}}>
            <Modal 
                isVisible={isModalVisible}
                style={styles.modelcontainer}
                onBackdropPress={() => setModalVisible(false)}
            >
                <View style={styles.modelView}>
                    <View >
                        <View style={[styles.inputView,{borderWidth:0.5,borderColor:'black'}]}>
                            <TextInput
                                style={[styles.TextInput,{textAlign:'left',padding:10,left:20}]}
                                placeholder="Search by courses"
                                placeholderTextColor="#313955"
                                onChangeText={(text)=>setSearchText(text)}
                            />
                        </View>
                        {
                            valueCourse.map((item,index)=>(
                                <TouchableOpacity key={item.id} onPress={()=>toggledata(item.id)}>
                                    <View style={{margin:5,paddingLeft:20,padding:5}}>
                                        <Text>{item.name}</Text>
                                        <View style={styles.verticalLine} /> 
                                    </View>                                                                
                                 </TouchableOpacity>
                            ))
                        }
                        <View style={{flexDirection:'row',alignSelf:'flex-end',columnGap:20}}>
                            <TouchableOpacity onPress={()=>setModalVisible(false)}>
                                <Text style={{color:'#FEC265',fontSize:16,fontWeight:'bold'}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{fontSize:16,fontWeight:'bold'}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
                        <Text style={styles.headerText}>Agent Details</Text>
                    </View>
                    <View style={[styles.headpad,{opacity:0,width:'20%'}]}></View>
                </View>
                <TouchableOpacity style={[styles.inputView,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]} onPress={()=>toggleModal()}>
                    <Text style={{left:20,opacity:0.5,fontWeight:'bold',fontSize:15}}>Search by colleges/courses</Text>
                    <Image  source={require('../../assets/Agent/searchbar.png')} style={{height:40,width:40}}/>
                </TouchableOpacity>
                <View style={{flexDirection:'row',justifyContent:'space-around',margin:30}}>
                    <TouchableOpacity onPress={()=>toggleColor(1)}>
                        <Text style={selectedIndex?[styles.textcss,{color:'#FEC265'}]:[styles.textcss]}>Admitted</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>toggleColor(0)}>
                        <Text style={selectedIndexColor?[styles.textcss,{color:'#FEC265'}]:[styles.textcss]}>Cancelled</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={{flex:1}}>
                <View style={{padding:20}}>
                {
                        admissionData?(
                            <View>
                                {
                                    selectedIndex?(
                                        <View>
                                            {  
                                            admissionData.admitted.length != 0?(                                         
                                            
                                                admissionData.admitted.map((item,index)=>(
                                                    <View style={styles.card} key={index}>     
                                                        <Text style={{fontSize:17,color:'#313955',fontWeight:'bold',paddingLeft:15,paddingTop:20}}>{item.user_detail.name}</Text>
                                                        <Text style={{fontSize:14,color:'#1DA79B',fontWeight:'bold',paddingLeft:15,paddingTop:5}}>{item.department.name}</Text>
                                                        <View style={{flexDirection:'row',justifyContent:'space-around',margin:10,top:20}}>
                                                            <View style={{flexDirection:'row'}}>
                                                                <Text style={[styles.cardtextCss,{color:'#FCB301'}]}>Date:</Text>
                                                                <Text style={[styles.cardtextCss,{color:'#313955'}]}>{item.created_date}</Text>
                                                            </View>
                                                            <View style={{flexDirection:'row'}}>
                                                                <Text style={[styles.cardtextCss,{color:'#FCB301'}]}>Time:</Text>
                                                                <Text style={[styles.cardtextCss,{color:'#313955'}]}>{item.created_time}</Text>
                                                            </View>
                                                            <View style={{flexDirection:'row'}}>
                                                                <Text style={[styles.cardtextCss,{color:'#313955'}]}>Paid:</Text>
                                                                <Text style={[styles.cardtextCss,{color:'red'}]}>{item.paid}</Text>
                                                            </View>
                                                        </View>
                                                    </View>                            
                                                ))):(
                                                    <View style={{alignItems:'center',marginTop:100}}>
                                                        <Image source={require('../../assets/HomeScreen/NoData.png')} style={{height:200,width:'80%',borderRadius:10}}  />
                                                    </View>
                                                )
                                            }
                                        </View>
                                    ):(
                                        <View>
                                            {  
                                            admissionData.canceled.length != 0?(                                         
                                            
                                                admissionData.canceled.map((item,index)=>(
                                                    <View style={styles.card} key={index}> 
                                                        <View style={{flexDirection:'row',justifyContent:'space-between',margin:5}}>
                                                            <Text style={{fontSize:17,color:'#313955',fontWeight:'bold',paddingLeft:10,paddingTop:20}}>{item.user_detail.name}</Text>
                                                            <Text style={{fontSize:14,color:'#313955',fontWeight:'bold',paddingTop:20}}>Consultancy name</Text>
                                                        </View>
                                                        <View style={{flexDirection:'row',justifyContent:'space-between',margin:5}}>
                                                        <Text style={{fontSize:14,color:'#1DA79B',fontWeight:'bold',paddingLeft:15,bottom:5}}>{item.department.name}</Text>
                                                            <Text style={{fontSize:12,color:'#313955',fontWeight:'bold',bottom:5}}>{item.consultancy_agency.consultancy_agency_name}</Text>
                                                        </View>

                                                        <View style={{flexDirection:'row',justifyContent:'space-around',margin:10,top:20}}>
                                                            <View style={{flexDirection:'row'}}>
                                                                <Text style={[styles.cardtextCss,{color:'#FCB301'}]}>Date:</Text>
                                                                <Text style={[styles.cardtextCss,{color:'#313955'}]}>{item.created_date}</Text>
                                                            </View>
                                                            <View style={{flexDirection:'row'}}>
                                                                <Text style={[styles.cardtextCss,{color:'#FCB301'}]}>Time:</Text>
                                                                <Text style={[styles.cardtextCss,{color:'#313955'}]}>{item.created_time}</Text>
                                                            </View>
                                                            <View style={{flexDirection:'row'}}>
                                                                <Text style={[styles.cardtextCss,{color:'#313955'}]}>Paid:</Text>
                                                                <Text style={[styles.cardtextCss,{color:'red'}]}>{item.paid}</Text>
                                                            </View>
                                                        </View>
                                                    </View>                            
                                                ))):(
                                                    <View style={{alignItems:'center',marginTop:100}}>
                                                        <Image source={require('../../assets/HomeScreen/NoData.png')} style={{height:200,width:'80%',borderRadius:10}}  />
                                                    </View>
                                                )
                                            }
                                        </View>
                                    )
                                }
                            </View>
                        ):(
                            <View style={{justifyContent:'center',alignItems:'center',flex:1,marginTop:200}}>
                                <ActivityIndicator size="large" color="red" />
                            </View>
                        )
                    } 

                    
                </View>
            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    card:{
        height:150,
        width:'100%',
        alignSelf:'center',
        backgroundColor:'#F7F8FA',
        borderRadius:10,
        margin:10
    },
    textcss:{
        fontSize:18,
        fontWeight:'bold',
        color:'#fff'
    },
    fittotext:{
        flexDirection:'row',
        columnGap:10,
        margin:15
    },
    headerPad:{
        minHeight:200,
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
    inputView: {
        borderColor:'#fff',
        height:50,
        width:'90%',
        borderWidth:1,
        alignSelf:'center',
        borderRadius:10,
        backgroundColor:'#fff'
      },
      TextInput: {
        height: 40,
        flex: 1,
        fontWeight:'bold',
        textAlign:'center'
      },
      modelcontainer:{
        margin: 10,
      },
      modelView:{
        backgroundColor: 'white', 
        padding: 16,
        minHeight:220,
        borderRadius:20,
        borderWidth:1,
        borderColor:'black',
      },
      verticalLine: {
        width: '90%', // Adjust the width as needed
        height: 1, // Make the line extend the full height of its container
        backgroundColor: 'black', // Change the color as needed
        opacity:0.5,
        top:5
      },

})