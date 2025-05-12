import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet,Dimensions, Text, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import {Fontisto, Ionicons} from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function App() {
  const [city,setCity] = useState('Loading...');
  const [days,setDays] = useState([]);
  const [ok,setOk] = useState(true);
  const API_KEY = "e301c198587790b74cb9036ebe2b2c99";
  const getWether = async()=>{
    const permission = await Location.requestForegroundPermissionsAsync();
    if(!permission.granted){
      setOk(false);
    }
    const {coords:{latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync( {latitude,longitude}, {useGoogleMaps:false} );
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json);
  }
  useEffect(()=>{
    getWether();
  },[])
  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        { 
        days.length===0 ? 
        <View style={styles.day}> <ActivityIndicator color='white' size={'large'} style={{marginTop:10}} /> </View>
        : <View style={styles.day}>
            <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',width:'100%'}}>
              <Text style={styles.temp}>{parseFloat(days.main.temp).toFixed(1)}</Text>
              <Fontisto name='cloudy' size={68} color={'white'} />
            </View>
            <Text style={styles.discription}>{days.weather[0].main}</Text>
            <Text style={styles.tinyText}>{days.weather[0].description}</Text>
          </View>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    backgroundColor:'tomato'
  },
  city:{
    flex:1,
    // backgroundColor:'blue',
    justifyContent : 'center',
    alignItems : 'center',
  },
  cityName : {
    fontSize :68,
    fontWeight :'600',
    color:'white'
  },
  weather : {

  },
  day:{
    width:SCREEN_WIDTH,
    alignItems:'start',
    paddingLeft:'20',
    paddingRight:'20'
  },
  temp:{
    marginTop:50,
    fontSize : 100,
    color:'white'
  },
  discription:{
    marginTop:-20,
    fontSize:30,
    color:'white'
  },
  tinyText:{
    fontSize:20,
    color:'white'
  }
})