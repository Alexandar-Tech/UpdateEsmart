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
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { API_GETRELIGION,API_GETCOMMUNITIES,API_SAVEPROFILE,API_GETCASTE } from '../../APILIST/APILIST';
import Modal from "react-native-modal";
import DateTimePicker from '@react-native-community/datetimepicker';

export function MyProfile({route,navigation}) {
    const ProfileData = route['params']['ProfileVal']
    const token =route['params']['token']
    const user_id = route['params']['LoginData']['id']
    const [inputValues, setInputValues] = useState([]);
    const [religion,setReligion] = useState([]);
    const [community,setCommunity] = useState([]);
    const [valueGender, setValueGender] = useState();
    const [valueReligion, setValueReligion] = useState(ProfileData.user_detail.religion_id);
    const [valueCaste, setValueCaste] = useState(ProfileData.user_detail.cast_id);
    const [valueCommunity, setValueCommunity] = useState(ProfileData.user_detail.community_id);
    const [isModalVisible, setModalVisible] = useState(false); 
    const [errorMsg,setErrorMsg] = useState(null);  
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [chosenDateFrom, setChosenDateFrom] = useState(new Date());
    const [firstName,setFirstName] = useState(ProfileData.user_detail.firstname)
    const [lastName,setLastName] = useState(ProfileData.user_detail.lastname)
    const [email,setEmail] = useState(ProfileData.email)
    const [fatherName,setFatherName] = useState(ProfileData.user_detail.father_name)
    const [address,setAddress] = useState(ProfileData.user_detail.address)
    const [aadharNumber,setAadharNumber] = useState(ProfileData.user_detail.aadhar_number)
    const [caste,setCaste] = useState([])
    const [parentNumber,setParentNumber] = useState(ProfileData.user_detail.parent_phone)
    const [parentAnnualIncome,setParentAnnualIncome] = useState(ProfileData.user_detail.parent_income)



    useEffect(() => {
      if(valueCommunity){
        axios.post(API_GETCASTE,{
          "community_id" : valueCommunity
        })
        .then(response => {
          setCaste(response.data.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
      }
        
    }, [valueCommunity]);


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
      // console.log(JSON.stringify({
      //   "aadhar_number": aadharNumber,
      //     "address": address,
      //     "community_id": valueCommunity,
      //     "dob": chosenDateFrom.toISOString().split('T')[0],
      //     "email":email,
      //     "father_name": fatherName,
      //     "firstname": firstName,
      //     "gender": valueGender,
      //     "lastname": lastName,
      //     "phone_no": ProfileData.phone_no,
      //     "religion_id": valueReligion,
      //     "user_id": user_id,
      //     "cast_id":valueCaste,
      //     "parent_phone":parentNumber,
      //     "parent_income":parentAnnualIncome

      // })       
      // )     
      const resp = await fetch(API_SAVEPROFILE,{
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          "aadhar_number": aadharNumber,
          "address": address,
          "community_id": valueCommunity,
          "dob": chosenDateFrom.toISOString().split('T')[0],
          "email":email,
          "father_name": fatherName,
          "firstname": firstName,
          "gender": valueGender,
          "lastname": lastName,
          "phone_no": ProfileData.phone_no,
          "religion_id": valueReligion,
          "user_id": user_id,
          "cast_id":valueCaste,
          "parent_phone":parentNumber,
          "parent_income":parentAnnualIncome
        })    
      })    
      const response = await resp.json();
      if(response.success == 1)
      {
        setErrorMsg(response.msg)
        setModalVisible(true)
        setTimeout(() => {
          setModalVisible(false)   
          navigation.navigate('About')      
        }, 2000)      
      }else{
        setErrorMsg(response.msg)
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


      const DropdownComponentCatse = (props) => {        
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
              value={valueCaste}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValueCaste(item.id);
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
            <ScrollView style={{flex:1}}>
                <View style={{padding:10}}>
                    <Text style={styles.textcss}>First Name</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        onChangeText={text => setFirstName(text)}
                        value={firstName}
                        />
                    </View>
                    <Text style={styles.textcss}>Last Name</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        onChangeText={text => setLastName(text)}
                        value={lastName}
                        />
                    </View>
                    <Text style={styles.textcss}>Father/Guardians Name</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        onChangeText={text => setFatherName(text)}
                        value={fatherName}
                        />
                    </View>
                    <Text style={styles.textcss}>Address</Text>
                    <View style={[styles.inputView,{height:100}]}>
                        <TextInput
                        style={styles.TextInput}
                        multiline={true}
                        onChangeText={text => setAddress(text)}
                        value={address}
                        />
                    </View>
                    {
                      ProfileData.type == null?(
                        <View>
                          <Text style={styles.textcss}>Student Mobile number</Text>
                          <View style={[styles.inputView]}>
                          <Text style={[styles.TextInput,{top:15}]}>{ProfileData.phone_no}</Text>
                          </View>
                          <Text style={styles.textcss}>Parent Mobile number</Text>
                          <View style={[styles.inputView]}>
                              <TextInput
                              style={styles.TextInput}
                              inputMode="numeric"
                              maxLength={10}
                              onChangeText={(text)=>setParentNumber(text)}
                              value = {parentNumber}
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
                          <View style={{width:'100%',marginRight:20,marginLeft:20,marginTop:10,alignSelf:'center'}}>
                              <DropdownComponentCatse name={'caste'} dropDownData={caste}/>
                          </View>
                        </View>

                      ):(
                        <View>
                          <Text style={styles.textcss}>Mobile number</Text>
                          <View style={[styles.inputView]}>
                          <Text style={[styles.TextInput,{top:15}]}>{ProfileData.phone_no}</Text>
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
                          value={ProfileData.email}
                          onChangeText={(text)=>setEmail(text)}
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
                        value={ProfileData.user_detail.aadhar_number}
                        onChangeText={(text)=>setAadharNumber(text)}
                        />
                    </View>
                    {
                      ProfileData.type == null?(
                        <View>
                          <Text style={styles.textcss}>Parent Annual Income</Text>
                          <View style={[styles.inputView]}>
                              <TextInput
                                style={styles.TextInput}
                                onChangeText={(text)=>setParentAnnualIncome(text)}
                                value = {parentAnnualIncome}
                              />
                          </View> 
                        </View>

                      ):null
                    }
                                        
                </View>
            </ScrollView>
            
            <TouchableOpacity style={[styles.loginBtn,{backgroundColor:'#313955'}]} onPress={()=>onHandleSubmit()}>
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
        height:200,
        borderRadius:20,
        alignItems:'center'
      },
})