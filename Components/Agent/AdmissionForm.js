import React, { useState,useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { API_COURSE,API_GETRELIGION,API_GETCOMMUNITIES,API_GETBOARDS,
  API_GETBOARDSUBJECT,API_CREATEAGENT,API_COURSEFEES,API_PAYMENT } from '../../APILIST/APILIST';
import Modal from "react-native-modal";
import { ButtonGroup } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import { WebView } from 'react-native-webview';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export function AdmissionForm({route,navigation}) {

  const runFirst = `window.ReactNativeWebView.postMessage("this is message from web");`;  
  const AllData = route['params']['LoginData']
  const token  = AllData['token']
  const OrgID = route['params']['org_id']
  const [chosenDateFrom, setChosenDateFrom] = useState(new Date());
    const [inputValues, setInputValues] = useState([]);
    const [inputValuesHSC, setInputValuesHSC] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [selectedIndexManagement, setSelectedIndexManagement] = useState(0);
    const [religion,setReligion] = useState([]);
    const [community,setCommunity] = useState([]);
    const [valueGender, setValueGender] = useState(null);
    const [valueCourseID, setCourseID] = useState(null);
    const [valueFirstGradute, setValueFirstGradute] = useState(0);
    const [valueCourse, setValueCourse] = useState([]);
    const [valueCourseFees, setValueCourseFees] = useState([]);
    const [valuePayment, setValuePayment] = useState([]);
    const [valueReligion, setValueReligion] = useState(null);
    const [valueCommunity, setValueCommunity] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false); 
    const [errorMsg,setErrorMsg] = useState(null);   
    const [isChecked, setChecked] = useState(false);
    const [isModalVisibleHSC,setisModalVisibleHSC] = useState(false)
    const [valueStateBoard, setValueStateBoard] = useState(1);
    const [valueGovernmentScheme, setValueGovernmentScheme] = useState(1);
    const [stateBoard,setStateBoard] = useState([]);
    const [loading,setLoading] = useState(false)
    const [hscName,setHscName] = useState(null);
    const [stateBoardSubject,setStateBoardSubject] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [handleMsg,setHandleMsg ] = useState(false);
    // const [scholarshipdata,setScholarshipdata] =  useState([])
    const [showWebView, setShowWebView] = useState(true);
    const [dateFormat,setDateFormat] = useState(0)
    const [totalMark,setTotalMark] = useState(null)

    
  const openWebView = () => {
    onHandleSubmit()
    if(handleMsg){
      if(valuePayment.length != 0){
        setShowWebView(!showWebView);     
      }      
    }
  };

    const handleInputChange = (key, value) => {
        setInputValues((prevData) => {
            const newData = { ...prevData };      
            newData[key] = value;      
            return newData;
          });
    };

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

    let scholarshipdata = [
      { name: 'FG', id: '1' },
      { name: 'PMSS', id: '2' },
    ]
    if (selectedIndex && valueCommunity!=4){
      scholarshipdata = [
        { name: 'FG', id: '1' },
      ]
    }

  let total_mark = 0
  if(inputValuesHSC.length !=0){
    for (const [key, value] of Object.entries(inputValuesHSC)) {
      total_mark = total_mark + Number(value)     
    }
  }

    if(selectedIndexManagement && valueCommunity!=4){
      scholarshipdata = [
        { name: 'PMSS', id: '2' },
      ]     
    }   

    const DatePickerExample = () => {
      
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
                  {dateFormat?chosenDateFrom.toISOString().split('T')[0]:null}
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
      });
  }, []);


      useEffect(() => {
        if(valueCourseID != null){
        axios.post(API_COURSEFEES,{
          "org_id" : OrgID,
          "department_id" : valueCourseID
        },
        {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
          setValueCourseFees(response.data.data)
          axios.post(API_PAYMENT,{
            "user_id" :2350,
            "org_id" : OrgID,
            "department_id" : valueCourseID,
            "amount":response.data.data.fees,
            "consultant_id" : AllData.id
          },
          {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              },
          })
          .then(response => {
            setValuePayment(response.data.data)
          })
          .catch(error => { 
          });
        })
        .catch(error => { 
          setValueCourseFees(null)
          setErrorMsg(error.response.data.msg) 
          setModalVisible(true)
        });
      }
    }, [valueCourseID]);

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

    const Genderdata =  [
        { name: 'Male', id: '1' },
        { name: 'Female', id: '2' },
    ]

    const firstGraduatedata =  [
      { name: 'Yes', id: 0 },
      { name: 'No', id: 1 },
  ]

  const toggleBtn = (value) =>{
    if(value){
      setSelectedIndex(1)
      setSelectedIndexManagement(0)
    }else{
      setSelectedIndex(0)
      setSelectedIndexManagement(1)

    }
    

  }

  let total_mark1 = 0
  let maths = 0
  let otherPer = 0
  if(inputValuesHSC.length !=0){
    for (const [key, value] of Object.entries(inputValuesHSC)) {
      if(key == 'Maths'){
        maths = value/2
      }
      else{
        otherPer = value / 2
        total_mark1 = total_mark1 + otherPer
      }    
    }
  }

    const onHandleSubmit = async () =>{      
      inputValues['user_id'] = AllData.id
      inputValues['org_id'] = OrgID
      inputValues['gender'] = valueGender
      inputValues['community'] = valueCommunity
      inputValues['religion'] = valueReligion
      inputValues['department_id'] =valueCourseID
      inputValues['dob'] = chosenDateFrom.toISOString().split('T')[0]
      inputValues['government_quota'] = selectedIndex
      inputValues['government_scheme'] = "test"
      inputValues['religion_id'] = valueReligion
      inputValues['community_id'] = valueCommunity
      inputValues['hsc_all_mark'] = inputValuesHSC
      inputValues['total_mark'] = totalMark
      inputValues['is_first_graduate'] = valueFirstGradute
      const resp = await fetch(API_CREATEAGENT,{
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(inputValues) })    
      const response = await resp.json();
      if(response.success == 1)
      {
        setErrorMsg(response.msg)
        setModalVisible(true)
        setTimeout(() => {
          setModalVisible(false)   
          navigation.navigate('CollegeAgent')      
        }, 2000) 
      }else{
        setErrorMsg(response.msg)
        setModalVisible(true)
      }
      
    }

    const DropdownComponentFirstGradute = (props) => {        
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
            value={valueFirstGradute}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValueFirstGradute(item.id);
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

      const DropdownComponentCourse = (props) => {        
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
              value={valueCourseID}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setCourseID(item.id);
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

      const DropdownComponentGovernment = (props) => {      
        const [isFocus, setIsFocus] = useState(false);  
        return (
          <View style={styles.container}>
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={scholarshipdata}
              search
              maxHeight={300}
              labelField= 'name'
              valueField= 'id'
              placeholder={!isFocus ?  'Select Scholarship': '...'}
              searchPlaceholder="Search..."
              value={valueGovernmentScheme}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValueGovernmentScheme(item.id)
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
                                <Text>{Number(maths)+Number(total_mark1)}</Text>
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
            <View style={styles.headerPad}>
                <View style={styles.headpadCss}>
                    <TouchableOpacity onPress={()=>navigation.goBack()} style={{width:'20%'}}>
                        <View style={styles.headpad}>
                            <Icon name="chevron-left" size={30}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{width:'60%'}}>
                        <Text style={styles.headerText}>Admission Form</Text>
                    </View>
                    <View style={[styles.headpad,{opacity:0,width:'20%'}]}></View>
                </View>
            </View>
            
            
            {!showWebView ? (                  
              <View style={{width:'98%',height:windowHeight-120,marginRight:5,marginLeft:5}}>
                <WebView
                  source={{ uri: valuePayment.payment_url }} // Replace with your URL
                  style={{ height:windowHeight }}
                  javaScriptCanOpenWindowsAutomatically
                  injectedJavaScript={runFirst}
                  scrollEnabled
                  setSupportMultipleWindows={false}
                  onLoadStart={()=>setLoading(true)}
                  onLoadEnd={()=>setLoading(false)}
                  onLoad={()=>setLoading(false)}
                  onMessage={(event)=> {
                    if(event.nativeEvent.title.split('/')[3] == 'redirectAppSuccess'){
                      navigation.goBack()
                      navigation.goBack()
                    }else if(event.nativeEvent.title.split('/')[3] == 'redirectAppFailure') {
                      navigation.goBack()
                      navigation.goBack()
                    }
                  }}
                />
              </View>
            ):(
            


            <ScrollView style={{flex:1}}>            
                <View style={{padding:10}}>                
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
                        onChangeText={(text)=>handleInputChange('father_name',text)}
                        />
                    </View>
                    <Text style={styles.textcss}>Select Course</Text>
                    <View style={{width:'100%',marginRight:20,marginLeft:20,marginTop:10,alignSelf:'center'}}>
                        <DropdownComponentCourse name={'Select Course'} dropDownData={valueCourse}/>
                    </View> 

                    <Text style={styles.textcss}>Admission Fees</Text>
                    <View style={[styles.inputView,{justifyContent:'center',alignItems:'center'}]}>
                        {
                          valueCourseFees?<Text style={[styles.fontcss,{fontWeight:'bold'}]}> {valueCourseFees.fees}</Text>:null
                        }
                    </View>

                    <View style={{paddingVertical:10,flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={[styles.textcss,{top:15}]}>Government Quota</Text>
                        <ButtonGroup
                        buttons={['Yes', 'No']}
                        selectedIndex={selectedIndex}
                        onPress={(value) => {
                          toggleBtn(value)
                        }}
                        containerStyle={{ borderRadius:10,height:40,borderRadius:30,backgroundColor:'#fff',width:'50%'}}
                        textStyle={{fontSize:16,fontWeight:'bold'}}
                        buttonStyle={{borderRadius:30}}
                        innerBorderStyle={{color:'#fff'}}
                        selectedButtonStyle = {{backgroundColor:'#313955'}}
                        />  
                    </View>

                    <View style={{paddingVertical:10,flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={[styles.textcss,{top:15}]}>Management Quota</Text>
                        <ButtonGroup
                        buttons={['Yes', 'No']}
                        selectedIndex={selectedIndexManagement}
                        // onPress={(value) => {
                        //   toggleBtn(value)
                        // }}
                        containerStyle={{ borderRadius:10,height:40,borderRadius:30,backgroundColor:'#fff',width:'50%'}}
                        textStyle={{fontSize:16,fontWeight:'bold'}}
                        buttonStyle={{borderRadius:30}}
                        innerBorderStyle={{color:'#fff'}}
                        selectedButtonStyle = {{backgroundColor:'#313955'}}
                        />  
                    </View>

                    <Text style={styles.textcss}>Are you First graduate?</Text>
                    <View style={{width:'100%',marginRight:20,marginLeft:20,marginTop:10,alignSelf:'center'}}>
                        <DropdownComponentFirstGradute name={'Are you First graduate?'} dropDownData={firstGraduatedata}/>
                    </View>

                    

                    <Text style={styles.textcss}>Student Mobile number</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="Student Mobile number"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>handleInputChange('phone_no',text)}
                        />
                    </View>

                    <Text style={styles.textcss}>Panrent Mobile number</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="Panrent Mobile number"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>handleInputChange('parent_phone',text)}
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

                    <Text style={styles.textcss}>Email</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="Email"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>handleInputChange('email',text)}
                        />
                    </View>                   
                    
                    <Text style={styles.textcss}>Gender</Text>
                    <View style={{width:'100%',marginRight:20,marginLeft:20,marginTop:10,alignSelf:'center'}}>
                        <DropdownComponent name={'Gender'} dropDownData={Genderdata}/>
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
                        // placeholder="AAdhar Number"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>handleInputChange('aadhar_number',text)}
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

                    <Text style={styles.textcss}>SSLC Marks</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        onChangeText={(text)=>handleInputChange('sslc_percentage',text)}
                        />
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
                    
                    
                    <Text style={styles.textcss}>Government scheme</Text>
                    {/* <View style={[styles.inputView]}>
                        <TextInput
                        style={styles.TextInput}
                        // placeholder="Post Metric Scholarship Scheme"
                        // placeholderTextColor="#003f5c"
                        onChangeText={(text)=>handleInputChange('caste',text)}
                        />
                    </View> */}
                    <View style={{width:'100%',margin:20,alignSelf:'center'}}>
                        <DropdownComponentGovernment />
                    </View>
                    
                    <Text style={styles.textcss}>Parent Annual Income</Text>
                    <View style={[styles.inputView]}>
                        <TextInput
                          style={styles.TextInput}
                          onChangeText={(text)=>handleInputChange('parent_annual_income',text)}
                        />
                    </View>   
                    <View style={styles.section}>
                <Checkbox
                    style={styles.checkbox}
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? '#FCB301' : undefined}
                />
                <View style={{padding:20}}>
                        <Text style={styles.fontcss}>By submitting this Admission you agree to the</Text>                        
                        <View style={{flexDirection:'row'}}>
                          <Text style={[styles.fontcss,{color:'#FCB301'}]}>Terms & Conditions</Text>
                          <Text style={styles.fontcss}> and </Text>
                          <Text style={[styles.fontcss,{color:'#FCB301'}]}>Privacy Policy</Text>
                        </View>                         
                </View>                
            </View>
            {/* <View style={{padding:10,height:100,width:'90%',alignSelf:'center',backgroundColor:'#FCB301',margin:10,borderRadius:10}}>
              <Text style={[styles.fontcss,{margin:10,fontSize:15}]}>Admission Fee</Text>
              <View style={{flexDirection:'row',padding:5,justifyContent:'space-between',marginRight:20}}> 
                <Text style={[styles.fontcss,{fontWeight:'bold',fontSize:15}]}> One time Fee</Text>
                <Text style={[styles.fontcss,{fontWeight:'bold',fontSize:15}]}>:</Text>
                {
                  valueCourseFees?<Text style={[styles.fontcss,{fontWeight:'bold'}]}> Rs {valueCourseFees.fees}</Text>:null
                }                
              </View>

            </View> */}
              <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                <TouchableOpacity style={[styles.loginBtn,{width:'90%'}]} onPress={()=>onHandleSubmit()}>
                    <Text style={[styles.loginText,{color:'#FCB301'}]} >
                      Enquire
                    </Text>
                </TouchableOpacity> 
                
                {/* <TouchableOpacity style={[styles.loginBtn,{width:'45%'}]} onPress={()=>openWebView()}>
                    <Text style={styles.loginText} >
                      Pay and Confirm
                    </Text>
                </TouchableOpacity> */}
              </View>
                              
                </View>
            </ScrollView>
            )}

                     
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
        backgroundColor: '#313955',
        alignSelf:'center'
      },
      loginText:{
        fontSize:15,
        color:'#fff',
        fontWeight:'bold'
      },
      inputView: {
        borderRadius: 5,
        height: 50,
        borderWidth:0.1,
        marginTop:20,
        marginLeft:5,
        marginRight:5,
        bottom:6
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
      modelView:{
        backgroundColor: 'white', 
        padding: 16,
        height:170,
        borderRadius:20,
        alignItems:'center'
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
      circleCss:{
        height:35,
        width:35,
        backgroundColor:'#fff',
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center'
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
      }
})