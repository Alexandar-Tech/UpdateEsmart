import React, { useState,useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { API_GETENQUIRYLIST } from '../../APILIST/APILIST';
import axios from 'axios';

const Chat = ({route,navigation}) => {  
    const phoneNumber = route['params']['LoginData']['phone_no']
    const [data, setData] = useState(null);
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.post(API_GETENQUIRYLIST,{
            "phone_number":phoneNumber
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
        <View style={{flex:1,backgroundColor:'#F7F8FA'}}>
            <View style={styles.headerPad}>
                <View style={styles.headpadCss}>
                    <TouchableOpacity onPress={()=>navigation.goBack()} style={{width:'20%'}}>
                        <View style={styles.headpad}>
                            <Icon name="chevron-left" size={30}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{width:'60%'}}>
                        <Text style={styles.headerText}>My Enquiry</Text>
                    </View>
                    <View style={[styles.headpad,{opacity:0,width:'20%'}]}></View>
                </View>
            </View>
            <ScrollView style={{flex:1}}>
                <View style={{padding:20}}>
                    {
                        loading?(
                            <View>
                                {
                                    data?(<View style={{alignSelf:'center',width:'90%',padding:10,backgroundColor:'#313955',borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={{fontSize:18,fontWeight:'bold',color:'#fff'}}>{data.msg}</Text>
                                        </View>):<ActivityIndicator size="large" color="#0000ff" />
                                }
                                
                            </View>):(
                                data.data.map((item,index)=>(                                
                                <View  key={index} style={{height:400,width:'100%',backgroundColor:'#fff',borderWidth:0.2,borderColor:'#313955',borderRadius:10,margin:10,alignSelf:'center'}}>
                                    <Image source={require('../../assets/College/MianCollege.png')} style={{height:130,width:'100%',borderRadius:10}}/>
                                    <Text style={[styles.textCss,{padding:10,left:10}]}>{item.organisation.name}</Text>   
                                    <View style={{flexDirection:'row',padding:10,left:10}}>
                                        <Text style={styles.textCss}>Course Enquired :</Text>
                                        <Text style={styles.textCss}>{item.course_applied}</Text>
                                    </View>
                                    <View style={{margin:10,borderWidth:0.2,borderRadius:5}}> 
                                        <View style={{height:80,width:'100%',backgroundColor:'#F7F8FA'}}>
                                            <Text style={[styles.textCss,{left:10,padding:10}]}>{item.created_date}</Text>
                                            <View style={{flexDirection:'row',justifyContent:"space-between",margin:5}}>
                                                <View style={{flexDirection:'row',left:10}}>
                                                    <Text style={styles.textCss}>Booking Id: </Text>
                                                    <Text style={styles.textCss}>{item.booking_id}</Text>
                                                </View>
                                                <Text style={[styles.textCss,{right:10}]}>{item.organisation.city.name}</Text>

                                            </View>
                                        </View>
                                        <View style={{height:50,width:'80%',backgroundColor:'#F7F8FA',margin:10,alignSelf:'center',borderRadius:5,alignItems:'center',justifyContent:'center'}}>
                                            <Icon name={''}/>
                                            <Text style={styles.textCss}>Request Call back</Text>
                                        </View> 
                                    </View>                                                                   
                                </View>
                                ))
                            )
                    }
                    
                </View>
            </ScrollView>

        </View>
        
    )

}

export default Chat


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
    textCss:{
        fontSize:14,
        fontWeight:'bold',
    }

})