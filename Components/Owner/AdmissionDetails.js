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
import { API_OWNERDETAILS } from '../../APILIST/APILIST';


export function AdmissionDetail({route,navigation}) {   
    const AllData = route['params']['LoginData']
    const OrgID = route['params']['org_id']
    const token  = AllData['token']
    const [admissionData,setAdmissionData] = useState(null)

    useEffect(() => {
        axios.post(API_OWNERDETAILS,{
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
          console.log(error.response)    
        });
    }, []);
    

    return(
        <View style={{flex:1}}>
            <View style={styles.headerPad}>
                <View style={styles.headpadCss}>
                    <TouchableOpacity onPress={()=>navigation.goBack()} style={{width:'20%'}}>
                        <View style={styles.headpad}>
                            <Icon name="chevron-left" size={30}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{width:'60%'}}>
                        <Text style={styles.headerText}>Admission Details</Text>
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
                                <TouchableOpacity style={[styles.consultantBox,{backgroundColor:'#FFAF34'}]} onPress={()=>navigation.navigate('AdmissionOwnerDetails',{
                                    org_id : OrgID,
                                    type : "direct",
                                    token:token,
                                    consultant_id : OrgID

                                })}>
                                    <Text style={[styles.alignConsulatntcss,{padding:5,fontSize:14}]}>Direct Admission</Text>
                                    <View style={styles.fittotext}>
                                        <View>
                                            <Text style={styles.consultanttext}>Admitted</Text>
                                            <Text style={styles.alignConsulatntcss}>{admissionData.direct_admission}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.consultanttext}>Canceled</Text>
                                            <Text style={styles.alignConsulatntcss}>{admissionData.direct_cancel}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.consultantBox,{backgroundColor:'#FFAF34'}]} onPress={()=>navigation.navigate('AdmissionOwnerDetails',{
                                    org_id : OrgID,
                                    type : "all consultant",
                                    token:token,
                                    consultant_id : OrgID

                                })}>
                                    <Text style={[styles.alignConsulatntcss,{padding:5,fontSize:14}]}>Consultant Admission</Text>
                                    <View style={styles.fittotext}>
                                        <View style={{width:'50%'}}>
                                            <Text style={styles.consultanttext}>Admitted</Text>
                                            <Text style={styles.alignConsulatntcss}>{admissionData.consultant_admission}</Text>
                                        </View>
                                        <View style={{width:'50%'}}>
                                            <Text style={styles.consultanttext}>Canceled</Text>
                                            <Text style={styles.alignConsulatntcss}>{admissionData.consultant_cancel}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.container}>
                                {
                                    admissionData.data_detail?(
                                        admissionData.data_detail.map((item,index)=>(
                                            <TouchableOpacity style={styles.item} key={index} onPress={()=>navigation.navigate('AdmissionOwnerDetails',{
                                                org_id : OrgID,
                                                type : "consultant",
                                                token:token,
                                                consultant_id : item.consultant_id
            
                                            })}> 
                                                <Text style={{color:'#fff',padding:5,fontWeight:'bold',fontSize:14,top:10}}>{item.name}</Text>
                                                <View style={styles.fittotext}>
                                                    <View style={{width:'50%',top:20}}>
                                                        <Text style={[styles.consultanttext,{color:'#06FCE6'}]}>Admitted</Text>
                                                        <Text style={[styles.alignConsulatntcss,{color:'#fff'}]}>{item.admission}</Text>
                                                    </View>
                                                    <View style={{width:'50%',top:20}}>
                                                        <Text style={[styles.consultanttext,{color:'#FCB301'}]}>Canceled</Text>
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
        height:140,
        backgroundColor:'#313955',
        margin:5,
        borderRadius:10
      },

})