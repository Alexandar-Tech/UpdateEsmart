import React, { useState,useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { API_GETENQUIRYLIST,API_REQUESTCALLBACk,API_URL } from '../../APILIST/APILIST';
import axios from 'axios';
import Modal from "react-native-modal";
import { StatusBar } from 'expo-status-bar';

const Chat = ({route,navigation}) => {  
    const ProfileData = route['params']['LoginData']
    const [data, setData] = useState([]);  
    const [refreshing, setRefreshing] = React.useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [errorMsg,setErrorMsg] = useState(null);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 100);
      }, []);

    useEffect(() => {
        axios.post(API_GETENQUIRYLIST,{
            "user_id":ProfileData.id
        },{
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${ProfileData.token}`,
                },
            })
        .then(response => {
            setData(response.data.data)
        })
        .catch(error => {
            setData([])
        });
    }, [route]);

    const RequestData = (valId) =>{
        axios.post(API_REQUESTCALLBACk,{
            "user_id":valId
        },{
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${ProfileData.token}`,
                },
            })
        .then(response => {
            setErrorMsg(response.data.msg)
            setModalVisible(true)
        })
        .catch(error => {
            setErrorMsg(error.response.data.msg)
            setModalVisible(true)
        });
    }


    return(
        <View style={{flex:1,backgroundColor:'#F7F8FA'}}>
            <StatusBar style='auto' />
            <Modal 
                isVisible={isModalVisible}
                style={styles.modelcontainer}
                onBackdropPress={() => setModalVisible(false)}
                swipeDirection={['down']}
                onSwipeComplete={() => setModalVisible(false)}
            >
                <View style={styles.modelView}>
                    {
                    errorMsg?<Text style={{fontSize:15,fontWeight:'bold',top:20,textAlign:'center'}}>{errorMsg}</Text>:null
                    }
                    
                    <TouchableOpacity style={{top:50,height:50,width:'100%',alignSelf:'center',backgroundColor:'#313955',alignItems:'center',justifyContent:'center',borderRadius:10}} onPress={()=>setModalVisible(false)}>
                    <Text style={{color:'#fff',fontSize:18,fontWeight:'bold'}}>Ok</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <View style={[styles.headerPad,{backgroundColor:'#313955'}]}>
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
            <ScrollView style={{flex:1}}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
            >
                <View style={{padding:20}}>
                    {
                        data.length == 0?(
                            <View style={{alignItems:'center',marginTop:100}}>
                                <Image source={require('../../assets/HomeScreen/NoData.png')} style={{height:200,width:'80%',borderRadius:10}}  />
                            </View>
                        ):(
                            <View>
                                
                                {
                                    data.map((item,index)=>(                                
                                        <View  key={index} style={{width:'100%',backgroundColor:'#fff',borderWidth:0.2,borderColor:'#313955',borderRadius:10,margin:10,alignSelf:'center'}}>
                                               <Image source={require('../../assets/College/MianCollege.png')} style={{height:130,width:'100%',borderRadius:10}}/>
                                                <Text style={[styles.textCss,{padding:10,left:10,fontSize:15}]}>College Name : {item.org[0].name}</Text>
                                            <View style={{flexDirection:'row',padding:10,left:10}}>
                                                <Text style={styles.textCss}>Course Enquired :</Text>
                                                <Text style={[styles.textCss,{width:'65%'}]}>{item.department.name}</Text>
                                            </View>
                                            <View style={{margin:10,borderWidth:0.2,borderRadius:5}}> 
                                                <View style={{height:80,width:'100%',backgroundColor:'#F7F8FA'}}>
                                                    <Text style={[styles.textCss,{left:10,padding:10}]}>{item.created_date}</Text>
                                                    <View style={{flexDirection:'row',justifyContent:"space-between",margin:5}}>
                                                        <View style={{flexDirection:'row',left:10}}>
                                                            <Text style={styles.textCss}>Booking Id: </Text>
                                                            <Text style={styles.textCss}>{item.booking_id}</Text>
                                                        </View>
                                                        {
                                                            item.org?
                                                            <Text style={[styles.textCss,{right:10}]}>{item.org[0]['city']['name']}</Text>
                                                            :<Text style={[styles.textCss,{right:10}]}></Text>
                                                        }
                                                    </View>
                                                </View>
                                                <TouchableOpacity style={styles.reqbtn} onPress={()=>RequestData(item.id)}>
                                                    <Icon name={''}/>
                                                    <Text style={styles.textCss}>Request Call back</Text>
                                                </TouchableOpacity> 
                                            </View>                                                                   
                                        </View>
                                        ))
                                } 
                                </View>
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
    },
    reqbtn:{
        height:50,
        width:'80%',
        backgroundColor:'#F7F8FA',
        margin:10,
        alignSelf:'center',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },
    modelcontainer:{
        justifyContent:'center'
      },
      modelView:{
        backgroundColor: 'white', 
        padding: 16,
        borderRadius:20,
        alignItems:'center',
        minHeight:170,
        height:180
      },

})