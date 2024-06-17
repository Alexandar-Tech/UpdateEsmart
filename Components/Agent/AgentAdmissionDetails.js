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
import axios from 'axios';
import { API_ADMISSIONDETAIL } from '../../APILIST/APILIST';
import { StatusBar } from 'expo-status-bar';


export function AgentAdmissionDetail({route,navigation}) {   
    const AllData = route['params']['LoginData']
    const OrgID = route['params']['org_id']
    const token  = AllData['token']
    const [admissionData,setAdmissionData] = useState(null)

    useEffect(() => {
        axios.post(API_ADMISSIONDETAIL,{
            "consultant_id" : AllData.id,
            "org_id" : OrgID
        },
        {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            setAdmissionData(response.data.data)
        })
        .catch(error => {              
        });
    }, []);
    

    return(
        <View style={{flex:1}}>
            <StatusBar style='auto' />
            <View style={styles.headerPad}>
                <View style={styles.headpadCss}>
                    <TouchableOpacity onPress={()=>navigation.goBack()} style={{width:'20%'}}>
                        <View style={styles.headpad}>
                            <Icon name="chevron-left" size={30}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{width:'60%'}}>
                        <Text style={styles.headerText}>Admission Detail</Text>
                    </View>
                    <View style={[styles.headpad,{opacity:0,width:'20%'}]}></View>
                </View>
            </View>
            <ScrollView style={{flex:1}}>
            <View style={{padding:10}}>
                {
                    admissionData?(
                        <View>
                            <View>
                                <Image style={styles.logo} source={require('../../assets/Agent/bannar.png')} />
                                <Text style={[styles.imgtext,{left:50}]}>{admissionData.total_admission}</Text>
                                <Text style={[styles.imgtext,{alignSelf:'flex-end',right:70}]}>{admissionData.total_cancel}</Text>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'space-around',margin:5}}>
                                <TouchableOpacity style={[styles.consultantBox,{backgroundColor:'#FFAF34'}]} onPress={()=>navigation.navigate('ConsultantDetails',{
                                    orgdataid : OrgID,
                                    type : "consultant",
                                })}>
                                    <Text style={[styles.alignConsulatntcss,{padding:5,fontSize:17}]}>Consultant</Text>
                                    <View style={styles.fittotext}>
                                        <View>
                                            <Text style={styles.consultanttext}>Admitted</Text>
                                            <Text style={styles.alignConsulatntcss}>{admissionData.consulant_admission}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.consultanttext}>Cancelled</Text>
                                            <Text style={styles.alignConsulatntcss}>{admissionData.consulant_cancel}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.consultantBox,{backgroundColor:'#FFAF34'}]} onPress={()=>navigation.navigate('AgentDetails',{
                                    org_id : OrgID,
                                    type : "all agent",
                                })}>
                                    <Text style={[styles.alignConsulatntcss,{padding:5,fontSize:17}]}>Agent</Text>
                                    <View style={styles.fittotext}>
                                        <View style={{width:'50%'}}>
                                            <Text style={styles.consultanttext}>Admitted</Text>
                                            <Text style={styles.alignConsulatntcss}>{admissionData.agent_admission}</Text>
                                        </View>
                                        <View style={{width:'50%'}}>
                                            <Text style={styles.consultanttext}>Cancelled</Text>
                                            <Text style={styles.alignConsulatntcss}>{admissionData.agent_cancel}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.container}>
                                {
                                    admissionData.data_detail?(
                                        admissionData.data_detail.map((item,index)=>(
                                            <TouchableOpacity style={styles.item} key={index} onPress={()=>navigation.navigate('SingleAgent',{
                                                org_id : OrgID,
                                                type : "agent",
                                                consultant_id:item.agent_id
                                            })}> 
                                                <Text style={{color:'#fff',padding:5,fontWeight:'bold',fontSize:16}}>{item.name}</Text>
                                                <View style={styles.fittotext}>
                                                    <View style={{width:'50%'}}>
                                                        <Text style={[styles.consultanttext,{color:'#06FCE6'}]}>Admitted</Text>
                                                        <Text style={[styles.alignConsulatntcss,{color:'#fff'}]}>{item.admission}</Text>
                                                    </View>
                                                    <View style={{width:'50%'}}>
                                                        <Text style={[styles.consultanttext,{color:'#FCB301'}]}>Cancelled</Text>
                                                        <Text style={[styles.alignConsulatntcss,{color:'#fff'}]}>{item.cancel}</Text>
                                                    </View>
                                                </View>                                                            
                                            </TouchableOpacity>
                                        ))

                                    ):null
                                }
                            </View>
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
    imgtext:{
        position:'absolute',
        fontSize:20,
        color:'#fff',
        top:120
    },
    alignConsulatntcss:{
        alignSelf:'center',
        fontWeight:'bold',
        color:'#313955'
    },
    consultanttext:{
        fontWeight:'bold',
        color:'#313955',
        fontSize:12
    },
    consultantBox:{
        height:120,
        width:'48%',
        backgroundColor:'#313955',
        borderRadius:10
    },
    fittotext:{
        flexDirection:'row',
        columnGap:10,
        margin:15
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
    logo: {
        height:180,
        width:'100%',
        resizeMode:'contain'  
      },
      container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
      },
      item: {
        width: '47%', // is 50% of container width
        alignItems:'center',
        height:120,
        backgroundColor:'#313955',
        margin:5,
        borderRadius:10
      },

})