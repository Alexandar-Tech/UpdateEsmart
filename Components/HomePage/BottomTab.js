import React, { useState,useEffect } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';


import {
    Text,
    Image,
    StyleSheet,
    View,
    TouchableOpacity
  } from 'react-native';
import IconFA from 'react-native-vector-icons/Feather';
import IconEA from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/Entypo';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import Chat from './chat';
import { MainCollege } from '../CollegeScreens/MainCollege';
import { MyProfile } from '../Student/MyProfile';
import { CollegeAgent } from '../Agent/CollegeAgent';
import { AdmissionForm } from '../Agent/AdmissionForm';
import { AgentSignUp } from '../Agent/AgentSignUp';
import { AgentAdmissionDetail } from '../Agent/AgentAdmissionDetails';
import { ConsultantDetails } from '../Agent/ConsultantDetails';
import { AgentDetails } from '../Agent/AgentDetails';
import { SingleAgent } from '../Agent/SingleAgent';
import { ViewProfile } from '../Student/ViewProfile';
import { StatusBar } from 'expo-status-bar';
import { CollegeList } from '../CollegeScreens/CollegeList';
import { EnquiryForm } from '../CollegeScreens/EnquiryForm';
import { AdmissionDetail } from '../Owner/AdmissionDetails';
import { AdmissionOwnerDetails } from '../Owner/AdmissionOwnerdetails';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



function CustomDrawerContent(props) {
  const PropsData = props.params.LoginData
  const navigation = useNavigation();

  function Logout(){
    AsyncStorage.setItem('isLoggedIn', JSON.stringify(false));
    AsyncStorage.setItem('LoginData', JSON.stringify(null));
    navigation.navigate('Login')
  }

  

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{paddingTop: 0}}>
      <StatusBar style='auto' />
      
      <View style={{backgroundColor:'#1D2F59',height:200,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
        <View style={{top:30}}>        
          <View style={{margin:10,flexDirection:'row',justifyContent:'space-between'}}>
            <Image style={{height:80,width:80}} source={require('../../assets/Profile/photo.png')} />
            <Image style={styles.logo} source={require('../../assets/Profile/ce.png')} />
          </View>
          <Text style={{fontSize:15,color:'#fff',margin:10,fontWeight:'bold'}}>{PropsData.consultancy_agency_name}</Text>
          <TouchableOpacity onPress={()=>navigation.navigate('About')}>
            <Text style={{fontSize:13,color:'#fff',fontWeight:'bold',left:10,textDecorationLine:'underline'}}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
      style={{bottom:10}}
        label="Report Issues"
      />
      <DrawerItem
      style={{bottom:20}}
        label="Rate us on store"
      />
      <DrawerItem
      style={{bottom:30}}
        label="Suggest Colleaze to your friends"
      />
      <DrawerItem
      style={{bottom:40}}
        label="Logout"
        onPress={()=>Logout()}
      />
    </DrawerContentScrollView>
  );
}

function HeaderLeft() {
  const navigation = useNavigation();
  return(
    <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
        <View style={styles.headpad}>
            <Icon name="menu" size={20}/>
        </View>
    </TouchableOpacity>
  )
}


const ProfileStack = ({route,navigation}) => { 
  
return ( 
	<Drawer.Navigator 
  screenOptions={{
    headerLeft: () => <HeaderLeft />,
  }}
  drawerContent={(props) => <CustomDrawerContent {...props}{...route} />}
  initialRouteName='About'
  > 
		<Drawer.Screen name="My Profile" component={MyProfile} initialParams={{LoginData:route['params']['LoginData']}}
    options={{
      headerStyle:{
        backgroundColor:'#313955',
        height:130,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10
      },
      headerTitleAlign:'center',
      headerTitleStyle:{
        color:'#fff'
      },       
      drawerItemStyle: { height: 0 }
    }}
    /> 

		<Drawer.Screen name="About" component={ViewProfile}
    options={{
      headerStyle:{
        backgroundColor:'#313955',
        height:130,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10
      },
      title:'Profile',
      headerTitleAlign:'center',
      headerTitleStyle:{
        color:'#fff'
      },    
      drawerItemStyle: { height: 0 }   
    }}
    initialParams={{LoginData:route['params']['LoginData']}}
    /> 
    
	</Drawer.Navigator> 
); 
}

const HomeStack = ({route}) => {
  const LogData = route['params']['LoginData']
  let uri = "CollegeList"
  if( LogData['type'] == 'agent' ){
    uri = "CollegeAgent"
  }
  if( LogData['type'] == 'college' ){
    uri = "AgentAdmissionDetailS"
  }
    return(
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName = {uri}
      >
        <Stack.Screen name="CollegeAgent" component={CollegeAgent} options={{headerShown:false}} initialParams={{LoginData:LogData}}/>
        <Stack.Screen name="EnquiryForm" component={EnquiryForm} options={{headerShown:false}} />
        <Stack.Screen name="AgentSignUp" component={AgentSignUp} options={{headerShown:false}} />
        <Stack.Screen name="CollegeList" component={CollegeList} options={{headerShown:false}} initialParams={{LoginData:LogData}}/>
         <Stack.Screen name="MainCollege" component={MainCollege} options={{headerShown:false}} initialParams={{LoginData:LogData}}/>
        <Stack.Screen name="AdmissionForm" component={AdmissionForm} options={{headerShown:false}} initialParams={{LoginData:LogData}}/>
        <Stack.Screen name="AgentAdmissionDetailS" component={AdmissionDetail} initialParams={{LoginData:LogData}}/> 
        <Stack.Screen name="AdmissionOwnerDetails" component={AdmissionOwnerDetails} />        
        <Stack.Screen name="ConsultantDetails" component={ConsultantDetails} options={{headerShown:false}} initialParams={{LoginData:LogData}}/>
        <Stack.Screen name="AgentDetails" component={AgentDetails} options={{headerShown:false}} initialParams={{LoginData:LogData}} />
        <Stack.Screen name="AgentAdmissionDetail" component={AgentAdmissionDetail} options={{headerShown:false}}  initialParams={{LoginData:LogData}} />
        <Stack.Screen name="SingleAgent" component={SingleAgent} options={{headerShown:false}}  initialParams={{LoginData:LogData}} />
    </Stack.Navigator>
    )

}


const BottomTabStack = ({route,navigation}) => {  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [LoginData, setLoginData] = useState(null)    

    async function getData() {
      const data = await AsyncStorage.getItem('isLoggedIn');
      const dataval = await AsyncStorage.getItem('LoginData');         
      setLoginData(JSON.parse(dataval))
      setIsLoggedIn(data);
    }

    useEffect(() => {
      getData()
    }, [isLoggedIn]);

    if(isLoggedIn == false){
      return null
    }

    return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle:{
            backgroundColor:'#fff',
        },
        tabBarLabelStyle:{
          fontWeight:'bold',
          fontSize:16,
        },
        
        tabBarLabel: ({ focused }) => {
            let label;
  
            if (route.name === 'HomeStack') {
              label = focused ? 'Home' : 'Home'; // Customize label for Screen1
            } else if (route.name === 'Enquiry') {
              label = focused ? 'Enquiry' : 'Enquiry'; // Customize label for Screen2
            }else{
                label = focused?'profile': 'profile';
            }
  
            return <Text style={{ color: focused ? '#1DA69A' : 'gray' }}>{label}</Text>;
          },
        tabBarIcon: ({ focused, color, size }) => {
            let iconName = "ios-home";
            if(route.name === 'HomeStack') {
                return <Image style={styles.logo} source={require('../../assets/HomeScreen/Nizcarehome.png')} />
            }
            else if (route.name === 'Enquiry') {
                iconName = 'ios-list';
                return <IconFA name={'message-circle'} size={size} color={color} />;
            } else if (route.name === 'ProfileStack') {
                iconName = 'ios-call';
                return <IconEA name={'user'} size={40} color={color} />;
            }

            
        },               

    })} initialRouteName='HomeStack'
        
        >
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{headerShown: false}} 
          initialParams={{LoginData:LoginData}}         
        />
        <Tab.Screen
          name="Enquiry"
          component={Chat}
          options={{headerShown: false}}
          initialParams={{LoginData:LoginData}}
        />
        <Tab.Screen name="ProfileStack" 
        component={ProfileStack} 
        options={{headerShown: false}} 
        initialParams={{LoginData:LoginData}}/>
      </Tab.Navigator>
    );
  }

export default BottomTabStack


const styles = StyleSheet.create({
    logo: {
        height:20,
        width:25,
        resizeMode:'cover'       
      },
      headpad:{
        height:35,
        width:35,
        borderRadius:10,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        left:20
    },
})