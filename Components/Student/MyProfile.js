import React, { useState,useEffect } from 'react';
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
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { API_UPDATESTUDENTPROFILE,API_GETRELIGION,API_GETCOMMUNITIES } from '../../APILIST/APILIST';
import Modal from "react-native-modal";
import DateTimePicker from '@react-native-community/datetimepicker';

export function MyProfile({route,navigation}) {
    const ProfileData = route['params']['LoginData']
    const token =ProfileData['token']
    const user_id = route['params']['LoginData']['id']
    const [inputValues, setInputValues] = useState([]);
    const [religion,setReligion] = useState([]);
    const [community,setCommunity] = useState([]);
    const [valueGender, setValueGender] = useState(null);
    const [valueReligion, setValueReligion] = useState(null);
    const [valueCommunity, setValueCommunity] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false); 
    const [errorMsg,setErrorMsg] = useState(null);  
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [chosenDateFrom, setChosenDateFrom] = useState(new Date());

    const handleInputChange = (key, value) => {
        setInputValues((prevData) => {
            const newData = { ...prevData };      
            newData[key] = value;      
            return newData;
          });
    };

    useEffect(() => {
        axios.post(API_GETRELIGION)
        .then(response => {
          setReligion(response.data.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    useEffect(() => {
      axios.post(API_GETCOMMUNITIES)
      .then(response => {
        setCommunity(response.data.data);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  }, []);

    const Genderdata =  [
        { name: 'Male', id: '1' },
        { name: 'Female', id: '2' },
    ]

    const DatePickerExample = () => {
      const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
    
        if (selectedDate) {
          setChosenDateFrom(selectedDate);
        }
      };
    
      const showDatepicker = () => {
        setShowDatePicker(true);
      };
    
      return (
        <TouchableOpacity onPress={showDatepicker} style={[styles.inputView,{alignItems:'center',justifyContent:'center'}]}>
              <Text style={{ fontSize: 13,fontWeight:'bold',color:'#1D2F59' }}>                
                  {chosenDateFrom.toISOString().split('T')[0]}
              </Text>  
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={chosenDateFrom}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}
        </TouchableOpacity>
      );
    };

    const onHandleSubmit = async () =>{      
      inputValues['user_id'] = user_id
      inputValues['gender'] = valueGender
      inputValues['community'] = valueCommunity
      inputValues['religion'] = valueReligion
      const resp = await fetch(API_UPDATESTUDENTPROFILE,{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(inputValues)    
      })    
      const response = await resp.json();
      if(response.success == 1)
      {
        setErrorMsg(response.msg)
        setModalVisible(true)
      }else{
        setErrorMsg('Can not updated!')
        setModalVisible(true)
      }
      
    }

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

      const DropdownComponentReligion = (props) => {
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
              value={valueReligion}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValueReligion(item.id);
                setIsFocus(false);
              }}
            />      
          </View>
        );
      };

      const DropdownComponentCommunity = (props) => {
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
              value={valueCommunity}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValueCommunity(item.id);
                setIsFocus(false);
              }}
            />      
          </View>
        );
      };

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
            <View style={styles.headerPad}>
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
            </View>
            <ScrollView style={{flex:1}}>
                <View style={{padding:10}}>
                    <View style={{alignSelf:'center',margin:10}}>
                        <Image source={require('../../assets/College/ProfilePic.png')} style={{height:100,width:100,resizeMode:'contain'}}  />
                    </View>
                    <Text style={styles.textcss}>First Name</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="First Name"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>handleInputChange('firstname',text)}
                        />
                    </View>
                    <Text style={styles.textcss}>Last Name</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="Last Name"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>handleInputChange('lastname',text)}
                        />
                    </View>
                    <Text style={styles.textcss}>Father/Guardians Name</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="Father/Guardians Name"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>handleInputChange('guardian_name',text)}
                        />
                    </View>
                    <Text style={styles.textcss}>Address</Text>
                    <View style={[styles.inputView,{height:100}]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="Address"
                        multiline={true}
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>handleInputChange('address',text)}
                        />
                    </View>
                    {
                      ProfileData.type == 0?(
                        <View>
                          <Text style={styles.textcss}>Student Mobile number</Text>
                          <View style={[styles.inputView]}>
                              <TextInput
                              style={styles.TextInput}
                              // placeholder="Student Mobile number"
                              // placeholderTextColor="#003f5c"
                              inputMode="numeric"
                              maxLength={10}
                              onChangeText={(text)=>handleInputChange('phone_number',text)}
                              />
                          </View>
                          <Text style={styles.textcss}>Parent Mobile number</Text>
                          <View style={[styles.inputView]}>
                              <TextInput
                              style={styles.TextInput}
                              inputMode="numeric"
                              maxLength={10}
                              // placeholder="Parent Mobile number"
                              // placeholderTextColor="#003f5c"
                              onChangeText={(text)=>handleInputChange('parent_phone_number',text)}
                              />
                          </View>
                          
                          
                          <Text style={styles.textcss}>Religion</Text>
                          <View style={{width:'100%',marginRight:20,marginLeft:20,marginTop:10,alignSelf:'center'}}>
                              <DropdownComponentReligion name={'Religion'} dropDownData={religion}/>
                          </View> 
                          <Text style={styles.textcss}>Community</Text>
                          <View style={{width:'100%',marginRight:20,marginLeft:20,marginTop:10,alignSelf:'center'}}>
                              <DropdownComponentCommunity name={'Community'} dropDownData={community}/>
                          </View>
                          <Text style={styles.textcss}>Caste</Text>
                          <View style={[styles.inputView]}>
                              <TextInput
                              style={styles.TextInput}
                              // placeholder="Caste"
                              // placeholderTextColor="#003f5c"
                              onChangeText={(text)=>handleInputChange('caste',text)}
                              />
                          </View>
                        </View>

                      ):(
                        <View>
                          <Text style={styles.textcss}>Mobile number</Text>
                          <View style={[styles.inputView]}>
                              <TextInput
                              style={styles.TextInput}
                              inputMode="numeric"
                              maxLength={10}
                              onChangeText={(text)=>handleInputChange('phone_number',text)}
                              />
                          </View>
                        </View>
                      )
                    }
                    <Text style={styles.textcss}>Gender</Text>
                    <View style={{width:'100%',marginRight:20,marginLeft:20,marginTop:10,alignSelf:'center'}}>
                        <DropdownComponent name={'Gender'} dropDownData={Genderdata}/>
                    </View> 
                    <Text style={styles.textcss}>Email</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="Email"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>handleInputChange('email',text)}
                        />
                    </View>

                    <View style={{marginTop:5}}>
                      <Text style={styles.textcss}>Date Of Birth</Text>
                      <View>
                        <DatePickerExample />
                      </View>
                    </View>                    
                    
                    <Text style={styles.textcss}>AAdhar Number</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        inputMode="numeric"
                        maxLength={12}
                        // placeholder="AAdhar Number"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>handleInputChange('aadhar_number',text)}
                        />
                    </View>
                    {
                      ProfileData.type == 0?(
                        <View>
                          <Text style={styles.textcss}>Parent Annual Income</Text>
                          <View style={[styles.inputView]}>
                              <TextInput
                                style={styles.TextInput}
                                onChangeText={(text)=>handleInputChange('aadhar_number',text)}
                              />
                          </View> 
                        </View>

                      ):null
                    }
                                        
                </View>
            </ScrollView>
            
            <TouchableOpacity style={styles.loginBtn} onPress={()=>onHandleSubmit()}>
                <Text style={styles.loginText} >
                    Save
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
        backgroundColor:'#fff'
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