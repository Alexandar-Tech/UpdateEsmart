import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView

} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Modal from "react-native-modal";
import { Dropdown } from 'react-native-element-dropdown';
import {API_CREATEAGENTAPI,API_UPDATEAGENT } from '../../APILIST/APILIST';
import Checkbox from 'expo-checkbox';



export function AgentSignUp({route,navigation}) {

  const agentFormFull = route['params']['agentForm']
  let agentid = ''
  let phNumber = ''
  let consultantid = ''
  let token = ''
  if(agentFormFull){
    agentid = route['params']['agentid']
    phNumber = route['params']['number']
    consultantid = route['params']['consultantid']
    token = route['params']['token']
  }

  
  
  
    
    const [isChecked, setIsChecked] = useState(false);
    const [isFirstName, setisFirstName] = useState(null);
    const [isPhoneNumber, setPhoneNumber] = useState(phNumber);
    const [isLastName, setisLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [agencyName, setAgencyName] = useState(null);
    const [address, setAddress] = useState(null);
    const [aadharNumber, setAadharNumber] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [valueGender, setValueGender] = useState(null);
    const [errorMsg,setErrorMsg] = useState(null);

    let API_URI = API_CREATEAGENTAPI
    if(agentFormFull){
      API_URI = API_UPDATEAGENT
    }

    let valjson = {}
    if(!agentFormFull){
      valjson = {
        "firstname" : isFirstName,
          "lastname":isLastName,
          "email":email,
          "phone_no":phNumber,
          "phone_code":'91',
          'consultancy_agency_name':agencyName,
          "type":"agent",
          "consultant_id":consultantid,
      }
    }else{
      valjson = {
        "agent_id":agentid,
        "firstname" :isFirstName,
        "lastname" : isLastName,
        "email" : email,
        "phone_no" : phNumber,
        "aadhar_number" : aadharNumber,
        "state_id" : 35,
        "city_id": 3703,
        "address" : "Dindigul"
      }
    }
    
    const Genderdata =  [
        { name: 'Male', id: '1' },
        { name: 'Female', id: '2' },
    ]

    const fetchData = async () => {
      const resp = await fetch(API_URI,{
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(valjson),
  
      })    
      const response = await resp.json();
      if (response.success == '1'){ 
        setErrorMsg(response.msg)
        setModalVisible(true)
        if(response.data.agent_status == 'inactive'){
          navigation.navigate('BottomTabStack',{
            LoginData : response.data,
            userid:response.data.parent_agent_id
        })
        } 
    }else{
        setErrorMsg(response.msg)
        setModalVisible(true)
    }
  };

    const DropdownComponent = (props) => {        
        const [isFocus, setIsFocus] = useState(false);
        let name = props.name
        let valdata = props.dropDownData
        return (
          <View style={styles.container}>
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={valdata}
              search
              maxHeight={300}
              labelField= 'name'
              valueField= 'id'
              placeholder={!isFocus ?  name: '...'}
              searchPlaceholder="Search..."
              value={valueGender}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValueGender(item.id);
                setIsFocus(false);
              }}
            />      
          </View>
        );
      };
      
    return(
        <View style={{flex:1,backgroundColor:'#F7F8FA'}}>
            <View style={{flex:1,paddingBottom:20}}>
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
                        <Text style={styles.headerText}>Add Agent</Text>
                    </View>
                    <View style={[styles.headpad,{opacity:0,width:'20%'}]}></View>
                </View>
            </View>
            <ScrollView style={{flex:1}}>
                <View style={{padding:10}}>
                    <Text style={styles.textcss}>First Name</Text>
                      <View style={[styles.inputView,{}]}>
                          <TextInput
                              style={styles.TextInput}
                              // placeholder="First Name"
                              // placeholderTextColor="#003f5c"
                              onChangeText={(text)=>setisFirstName(text)}
                          />
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'70%'}}>                                                
                            <Text style={styles.textcss}>Last Name (Optional)</Text>
                            <View style={[styles.inputView]}>
                                <TextInput
                                style={styles.TextInput}
                                // placeholder="Last Name"
                                // placeholderTextColor="#003f5c"
                                onChangeText={(text)=>setisLastName(text)}
                                />
                            </View>
                        </View>
                        <View style={{width:'30%'}}>
                            <Text style={styles.textcss}>Gender</Text>
                            <View style={{width:'100%',marginRight:20,marginLeft:20,marginTop:10,alignSelf:'center'}}>
                                <DropdownComponent name={'Select'} dropDownData={Genderdata}/>
                            </View>
                        </View>                        
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
                        {
                          agentFormFull?(
                            <View style={[styles.inputView,{width:'62%',alignItems:'center',justifyContent:'center'}]}>
                              <Text>{isPhoneNumber}</Text>
                              </View>
                          ):(
                           
                            <View style={[styles.inputView,{width:'62%',alignItems:'center',justifyContent:'center'}]}>
                              <TextInput
                                  style={styles.TextInput}
                                  // placeholder="Phone Number"
                                  // placeholderTextColor="#003f5c"
                                  onChangeText={(text)=>setPhoneNumber(text)}
                              />
                          </View>
                            
                          )
                        }
                        
                    </View>

                    <Text style={styles.textcss}>Email</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="email"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>setEmail(text)}
                        />
                    </View>
                    {
                      agentFormFull?(
                        <View>



                    <Text style={styles.textcss}>Aadhar Number</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="Aadhar Number"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>setAadharNumber(text)}
                        />
                    </View>

                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'50%'}}>                                                
                            <Text style={styles.textcss}>State</Text>
                            <View style={[styles.inputView]}>
                                <TextInput
                                style={styles.TextInput}
                                // placeholder="State"
                                // placeholderTextColor="#003f5c"
                                onChangeText={(text)=>setAgencyName(text)}
                                />
                            </View>
                        </View>
                        <View style={{width:'50%'}}>
                            <Text style={styles.textcss}>City</Text>
                            <View style={[styles.inputView]}>
                                <TextInput
                                style={styles.TextInput}
                                // placeholder="City"
                                // placeholderTextColor="#003f5c"
                                onChangeText={(text)=>setAgencyName(text)}
                                />
                            </View>
                        </View>                        
                    </View>

                    <Text style={styles.textcss}>Address</Text>
                    <View style={[styles.inputView,{height:100}]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="Address"
                        // multiline={true}
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>setAddress('address',text)}
                        />
                    </View>

                          </View>
                      ):(
                        <View>
                          <Text style={styles.textcss}>Agency name</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="Agency name"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>setAgencyName(text)}
                        />
                    </View>
                          </View>
                      )
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
                    </View>
                </View>
                
            </View>
            
            <TouchableOpacity style={styles.loginBtn} onPress={()=>fetchData()}>
                <Text style={styles.loginText}>
                    Send Invite
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
        borderRadius: 8,
        height: 50,
        borderWidth:0.4,
        marginTop:20,
        marginLeft:5,
        marginRight:5,
        bottom:5
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
      container: {
        backgroundColor: 'white',
        borderRadius:7,
        borderWidth:0.4,
        margin:5
      },
      dropdown: {
        height: 45,
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
        // fontWeight:'bold'
      },
      selectedTextStyle: {
        fontSize: 16,
        // fontWeight:'bold'
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
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
})