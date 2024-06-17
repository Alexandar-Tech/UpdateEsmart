import React, { useState, useRef,useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Checkbox from 'expo-checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { API_SAVEENQUIERY,API_GETRELIGION,API_GETCOMMUNITIES,API_GETBOARDS,API_GETBOARDSUBJECT,API_GETPROFILE } from '../../APILIST/APILIST';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import { StatusBar } from 'expo-status-bar';

export function EnquiryForm({route,navigation}) {
    const AllData = route.params.LoginData
    const [isChecked, setChecked] = useState(false);
    const OrgId = route.params.OrgId
    const departmentId = route.params.departmentId
    const Coursename = route.params.Coursename
    const [religion,setReligion] = useState([]);
    const [community,setCommunity] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [chosenDateFrom, setChosenDateFrom] = useState(new Date());
    const [isModalVisible, setModalVisible] = useState(false); 
    const [valueCommunity, setValueCommunity] = useState(null);
    const [valueStateBoard, setValueStateBoard] = useState(1);
    const [stateBoard,setStateBoard] = useState([]);
    const [stateBoardSubject,setStateBoardSubject] = useState(null);
    const [loading,setLoading] = useState(false)
    const [hscName,setHscName] = useState(null);
    const [inputValuesHSC, setInputValuesHSC] = useState([]);
    const [isModalVisibleHSC,setisModalVisibleHSC] = useState(false)
    const [valueReligion, setValueReligion] = useState(null);
    const [errorMsg,setErrorMsg] = useState(null);
    const [valueGender, setValueGender] = useState(null);
    const [dateFormat,setDateFormat] = useState(0)
    const [firstName,setFirstName] = useState(AllData.user_detail.firstname)
    const [lastName,setLastName] = useState(AllData.user_detail.lastname)
    const [email,setEmail] = useState(AllData.email)
    const [fatherName,setFatherName] = useState(AllData.user_detail.father_name)
    const [address,setAddress] = useState(AllData.user_detail.address)
    const [totalMark,setTotalMark] = useState(null)
    const [Profile,setProfile] = useState(null);

    const Genderdata =  [
      { name: 'Male', id: '1' },
      { name: 'Female', id: '2' },
    ]

    const handleInputChangeHSC = (key, value) => {
      
      setInputValuesHSC((prevData) => {
          const newData = { ...prevData };    
          newData[key] = value;      
          return newData;
        });
  };
    const Hscdata =  [
      { name: 'HSC Academic Marks', id: '1' },
      { name: 'HSC Vocational Marks', id: '2' },
    ]

    useEffect(() => {
      axios.post(API_GETPROFILE,{
          "user_id":AllData.id
      })
      .then(response => {
          setProfile(response.data.data);
          setFirstName(response.data.data.user_detail.firstname)
          setLastName(response.data.data.user_detail.lastname)
          setEmail(response.data.data.email)
          setFatherName(response.data.data.user_detail.father_name)
          setAddress(response.data.data.user_detail.address)
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  }, [route]);

  let maths = 0
  let otherPer = 0
  if(inputValuesHSC.length !=0){
    for (const [key, value] of Object.entries(inputValuesHSC)) {
      if(key == 'Maths'){
        maths = value
      }
      else{
        otherPer = value / 2
      }    
    }
  }

  const DatePickerExample = (val) => {
    
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    const handleDateChange = (event, selectedDate) => {
      setShowDatePicker(false);
  
      if (selectedDate) {
        setChosenDateFrom(selectedDate);
        setDateFormat(1)
      }
    };
  
    const showDatepicker = () => {
      setShowDatePicker(true);
    };
  
    return (
      <TouchableOpacity onPress={showDatepicker} style={[styles.inputView,{alignItems:'center',justifyContent:'center'}]}>
            <Text style={{ fontSize: 13,fontWeight:'bold',color:'#1D2F59' }}>                
            {dateFormat?chosenDateFrom.toISOString().split('T')[0]:val.val}
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

  useEffect(() => {
    // Fetch data when the component mounts
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


    useEffect(() => {
      axios.post(API_GETBOARDS)
      .then(response => {
        setStateBoard(response.data.data);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
    }, []);

    useEffect(() => {
      axios.post(API_GETBOARDSUBJECT,{
        "institution_category_id":valueStateBoard
      })
      .then(response => {
        setStateBoardSubject(response.data.data);
        setLoading(true)        
      })
      .catch(error => {
        setLoading(false)
        setStateBoardSubject(error.response.data);           
      });
    }, [valueStateBoard]);

    const onHandleSubmit = async () =>{
      if(!isChecked){
        setErrorMsg('Please Check terms and Conditions !')
        setModalVisible(true)
        return
    }
      const resp = await fetch(API_SAVEENQUIERY,{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${AllData.token}`,
        },
        body: JSON.stringify({
          'user_id' :AllData.id,
            'org_id':OrgId,
            'department_id' : departmentId,
            'firstname':firstName,
            'lastname':lastName,
            'father_name':fatherName,
            'email':email,
            'phone_no': AllData.phone_no,
            'address':address,
            'gender':valueGender,
            'dob':chosenDateFrom.toISOString().split('T')[0],
            'religion_id':valueReligion,
            'community_id':valueCommunity,
            'hsc_all_mark':inputValuesHSC,
            "total_mark":totalMark
        })    
      })    
      const response = await resp.json();
      if(response.success == 1)
      {
        setErrorMsg(response.msg)
        setModalVisible(true)      
        setTimeout(() => {
          setModalVisible(false)   
          navigation.navigate('CollegeList')      
        }, 2000)
      }else{
        setErrorMsg(response.msg)
        setModalVisible(true)        
      }
    }


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
              setValueCommunity(item.id)
              setIsFocus(false);
            }}
          />      
        </View>
      );
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

    const DropdownComponentStateBoard = (props) => {
      
      const [isFocus, setIsFocus] = useState(false);

      return (
        <View style={styles.container}>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={stateBoard}
            search
            maxHeight={300}
            labelField= 'category_name'
            valueField= 'id'
            placeholder={!isFocus ?  'Select Board': '...'}
            searchPlaceholder="Search..."
            value={valueStateBoard}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValueStateBoard(item.id)
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

    const DropdownComponentHSC = (props) => {
      const [value, setValue] = useState(null);
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
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item.id)
              setHscName(item.name)                
              setisModalVisibleHSC(true);
              setIsFocus(false);
            }}
          />      
        </View>
      );
    };
      
    return(
        <View style={{flex:1,backgroundColor:'#F7F8FA',paddingBottom:20}}>
          <StatusBar style='auto' />
          
            <Modal 
            isVisible={isModalVisibleHSC}
            style={styles.modelcontainerhsc}
            onBackdropPress={() => setisModalVisibleHSC(false)}
            >
                <View style={styles.modelViewHsc}>  
                  <Text style={{textAlign:'center',fontSize:15,fontWeight:'bold'}}>{hscName}</Text>                  
                  
                  <ScrollView style={{flex:1}}>
                    <View style={{padding:10}}> 
                    {
                      loading?(
                        <View>
                          <View style={{flexDirection:'row',justifyContent:'space-around',margin:10}}>
                            <Text style={styles.textcss}>Subject</Text>
                            <Text style={styles.textcss}>Mark Secured</Text>
                          </View>
                          {
                            hscName == 'HSC Academic Marks'?
                            
                            stateBoardSubject.academic.map((item,index)=>(
                              
                              <View key={index}>
                                <View style={{flexDirection:'row',width:'100%',margin:5}}>
                                  <View style={styles.box}>
                                      <Text style={styles.fontcss}>{item.subject}</Text>
                                    </View>
                                    <View style={styles.box}>
                                      <TextInput
                                        style={styles.TextInput}
                                        onChangeText={(text)=>handleInputChangeHSC(item.subject,text)}                     
                                      />
                                    </View>
                                </View>
                              </View>
                            )):
                            stateBoardSubject.occasional.map((item,index)=>(
                              <View key={index}>
                                <View style={{flexDirection:'row',width:'100%',margin:5}}>
                                  <View style={styles.box}>
                                      <Text style={styles.fontcss}>{item.subject}</Text>
                                    </View>
                                    <View style={styles.box}>
                                      <TextInput
                                      style={styles.TextInput}  
                                      onChangeText={(text)=>handleInputChangeHSC(item.subject,text)}                       
                                      />
                                    </View>
                                </View>
                              </View>
                            ))
                          }                       
                          
                          <View style={{flexDirection:'row',width:'100%',margin:5}}>
                            <View style={styles.box}>
                                <Text style={styles.fontcss}>Percentage</Text>
                              </View>
                              <View style={styles.box}>
                                <Text>{Number(maths)+Number(otherPer)}</Text>
                              </View>
                          </View>                      
                        </View>

                      ):(
                        <View>
                            {
                                stateBoardSubject?(<View style={{justifyContent:'center',alignItems:'center',flex:1,backgroundColor:'#313955',padding:15,borderRadius:10,top:10}}>
                                <Text style={{fontSize:18,fontWeight:'bold',color:'#fff'}}>{stateBoardSubject.msg}</Text>
                                </View>):<ActivityIndicator size="large" color="#0000ff" />
                            }
                            
                        </View>
                      )
                    }
                     
                    </View>
                  </ScrollView>
                  {
                    loading?(
                      <TouchableOpacity style={[styles.loginBtn,{width:'50%',backgroundColor:'#FCB301'}]} onPress={() => setisModalVisibleHSC(false)}>
                        <Text style={styles.loginText}>
                          Apply
                      </Text>                    
                      </TouchableOpacity>
                    ):null
                  }
                  
                </View>                          
                    
          </Modal>
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
            <View style={{flex:1}}>
            <View style={[styles.headerPad,{backgroundColor:'#313955'}]}>
                <View style={styles.headpadCss}>
                    <TouchableOpacity onPress={()=>navigation.goBack()} style={{width:'20%'}}>
                        <View style={styles.headpad}>
                            <Icon name="chevron-left" size={30}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{width:'60%'}}>
                        <Text style={styles.headerText}>Enquiry Form</Text>
                    </View>
                    <View style={[styles.headpad,{opacity:0,width:'20%'}]}></View>
                </View>
            </View>
            <ScrollView style={{flex:1}}>
                <View style={{padding:10}}>
                  {
                    Profile?(
                      <View>
                        <View>
                    <Text style={styles.textcss}>Student FirstName</Text>
                    </View>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        onChangeText={text => setFirstName(text)}
                        value={firstName}
                        />
                    </View>
                    <View>
                    <Text style={styles.textcss}>Student LasttName</Text>
                    </View>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        onChangeText={text => setLastName(text)}
                        value={lastName}
                        />
                    </View>
                    <View style={{marginTop:20}}>
                      <Text style={styles.textcss}>Father/Guardians Name</Text>
                      <View style={[styles.inputView]}>
                          <TextInput
                            style={styles.TextInput}
                            onChangeText={text => setFatherName(text)}
                            value={fatherName}
                          />
                      </View>
                    </View>
                    <View style={{marginTop:20}}>
                      <Text style={styles.textcss}>Mobile Number</Text>
                      <View style={[styles.inputView]}>
                          <Text style={[styles.TextInput,{top:15,opacity:0.5}]}>{AllData.phone_no}</Text>
                      </View>
                    </View>

                    <View style={{marginTop:20}}>
                      <Text style={styles.textcss}>Email</Text>
                      <View style={[styles.inputView]}>
                          <TextInput
                            style={styles.TextInput}
                            onChangeText={text => setEmail(text)}
                            value={email}
                          />
                      </View>
                    </View>
                    <View style={{marginTop:20}}>
                      <Text style={styles.textcss}>Date Of Birth</Text>
                      <View>
                        <DatePickerExample val={AllData.user_detail.dob_string}/>
                      </View>
                    </View>
                    <View style={{marginTop:20}}>
                    <Text style={styles.textcss}>Address</Text>
                    <View style={[styles.inputView,{height:100}]}>
                        <TextInput
                        style={styles.TextInput}
                        multiline={true}
                        onChangeText={text => setAddress(text)}
                        value={address}
                        
                        />
                    </View>
                    </View>
                    <Text style={styles.textcss}>Gender</Text>
                    <View style={{width:'100%',margin:20,alignSelf:'center'}}>
                        <DropdownComponent name={'Gender'} dropDownData={Genderdata} />
                    </View> 
                    <Text style={styles.textcss}>Religion</Text>
                    <View style={{width:'100%',margin:20,alignSelf:'center'}} >
                    <DropdownComponentReligion name={'Religion'} dropDownData={religion}/>
                    </View> 
                    <Text style={styles.textcss}>Community</Text>
                    <View style={{width:'100%',margin:20,alignSelf:'center'}}>
                        <DropdownComponentCommunity name={'community'} dropDownData={community}/>
                    </View>

                    <Text style={styles.textcss}>Choose Board</Text>
                    <View style={{width:'100%',margin:20,alignSelf:'center'}}>
                        <DropdownComponentStateBoard />
                    </View>

                    <Text style={styles.textcss}>HSC</Text>
                    <View style={{width:'100%',margin:20,alignSelf:'center'}}>
                      <DropdownComponentHSC name={'HSC'} dropDownData={Hscdata}/>
                    </View>
                    <Text style={styles.textcss}>Total Mark</Text>
                    <View style={[styles.inputView]}>
                          <TextInput
                            style={styles.TextInput}
                            onChangeText={text => setTotalMark(text)}
                            value={totalMark}
                          />
                      </View>
                    <View style={[styles.inputView,{height:100,backgroundColor:'#313955'}]}>
                        <Text style={{color:'#fff',fontSize:16,padding:10,fontWeight:'bold'}}>Course Applied</Text>
                        <View style={[styles.inputView,{backgroundColor:'#fff',bottom:20,justifyContent:'center'}]}>
                            <Text style={{color:'#313955',fontSize:16,padding:10,fontWeight:'bold'}}>{Coursename}</Text>
                        </View>
                    </View> 
                        </View>

                    ):(
                      <View style={{marginTop:200}}>                            
                            <ActivityIndicator size="large" color="#0000ff" />
                      </View>
                    )
                  }
                                     
                </View>
            </ScrollView>
            {
              Profile?(
                <View>
                  <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? '#FCB301' : undefined}
                    />
                    <View style={{padding:20,width:250}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.fontcss}>By submitting this Enquiry you agree to the </Text>
                            <Text style={[styles.fontcss,{color:'#FCB301'}]}>Terms & Conditions</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>                     
                            <Text style={styles.fontcss}> and </Text>
                            <Text style={[styles.fontcss,{color:'#FCB301'}]}>Privacy Policy</Text> 
                            <Text style={styles.fontcss}>of Nizcrae</Text>
                        </View>
                    </View>
                    
                </View>
                <TouchableOpacity style={[styles.loginBtn,{backgroundColor:'#FCB301'}]} onPress={()=>onHandleSubmit()}>
                    <Text style={[styles.loginText,{color:'#313955'}]}>
                        Enquire
                    </Text>
                </TouchableOpacity> 
                </View>
                
              ):null
            }
            
            
                       
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
        borderRadius: 10,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FCB301',
        alignSelf:'center'
      },
      loginText:{
        fontSize:18,
        
        fontWeight:'bold'
      },
      inputView: {
        borderRadius: 7,
        height: 55,
        borderWidth:0.2,
        marginTop:20,
        marginLeft:5,
        marginRight:5
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
        borderRadius:6,
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
        fontWeight:'bold'
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
      box:{
        height:50,
        width:'45%',
        borderWidth:0.2,
        borderRadius:6,
        alignItems:'center',
        justifyContent:'center',
        margin:5,
        backgroundColor:'#fff'
      },
      modelcontainerhsc:{
        margin: 0,
        justifyContent:'flex-end'
      },
      modelViewHsc:{
        backgroundColor: 'white', 
        padding: 16,
        height:'65%',
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
      },
})