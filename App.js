import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, View, SafeAreaView, Image, Linking, StatusBar, TextInput, TouchableOpacity, InteractionManager, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from "expo-constants";
import * as SplashScreen from 'expo-splash-screen'
import Dropdown from './components/Dropdown';
import * as SQLite from "expo-sqlite";


const App = () => {

  const data = [
    { label: 'Standard Room', value: '1' },
    { label: 'Deluxe Room', value: '2' },
    { label: 'Adjoining Room', value: '3' },
    { label: 'Connecting Room', value: '4' },
    { label: 'Suite', value: '5' },
  ];
   
  const [selected, setSelected] = useState(undefined);
  const [nightCount, setNightCount] = useState(null);
  const [Price, setPrice] = useState(0);
  const [CurrentEst, setCurrentEst] = useState("");
  const [err1, setErr1] = useState(true);
  const [err2, setErr2] = useState(true);
  const [err1Text, setErr1Text] = useState("");
  const [err2Text, setErr2Text] = useState("");
  
  const firstRender = useFirstRender();
  function useFirstRender() {
    const firstRender = useRef(true);
  
    useEffect(() => {
      firstRender.current = false;
    }, []);
  
    return firstRender.current;
  }
  

  useEffect(() => {
  },[Price]);

  useEffect(() => {
    console.log("Err1: " + err1)
  },[err1]);

  useEffect(() => {
    console.log("Err2: " +err2)
  },[err2]);

  useEffect(() => {
    setErr1Text(err1Text)
  },[err1Text]);

  useEffect(() => {
    if (selected !== undefined){
      setErr1(false)
    }
    console.log("Selected: " +selected)
  },[selected])


  useEffect(() => {
    if (firstRender){
    } else {
      if(nightCount !== 0 || nightCount != undefined || nightCount !== null || nightCount !== "" || !nightCount){
        if(!isNaN(nightCount)){
          setErr2(false)
        } else {
          setErr2(true)
          setErr2Text("Nights must be a number.")
        }
      } else {
        setErr2(true)
        setErr2Text("Please enter number of nights.")
      }
      console.log("Night Count: " +nightCount)
    }
  },[nightCount])

  useEffect(() => {
  },[CurrentEst])

  useEffect(() => {
  },[err2Text]);

  const logo = require('./assets/bwlogo.jpg');
  
  function HomeScreen({ navigation }) {
    return (
      <SafeAreaView style={styles.infoContainer}>
        <StatusBar
        backgroundColor="#121212"
        />      
        <Text style={styles.title}>Best Western{"\n"}Estimate Tool™</Text>
        <ScrollView>
        <Text style={styles.homeText}>Room Type</Text>
          <Dropdown label={selected ?  selected.label : "Select Item"}  data={data} onSelect={setSelected}/>
          {
            err1 ? <Text style={styles.warning}>{err1Text}</Text> : <Text style={styles.warning}></Text>
          }
          <Text style={styles.dropdown}>Nights Staying</Text>
          <TextInput
                onChangeText={setNightCount}
                style={styles.input}
                value={nightCount}
                placeholder="Number of nights staying"
          />
          {
            err2 ? <Text style={styles.warning}>{err2Text}</Text> : <Text style={styles.warning}></Text>
          }
         <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            handleCalcButtonPress()
            if (err1 == false && err2 == false){
              navigation.navigate('Estimates');
            }
          }}>
            <Text style={styles.calculateText}>CALCULATE</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  function handleCalcButtonPress(){
    const tax = 1.07;
    let DisplayPrice = 0;
  
    if (selected === undefined){
      setErr1(true)
      setErr1Text("Please select a room type.")
    } else {
      setErr1(false)
    }


    if (err1 === false && err2 === false) {
      if (selected.value == 1) {
        setPrice((nightCount * 99.99 * tax).toFixed(2))
        DisplayPrice = (nightCount * 99.99 * tax).toFixed(2);
      } else if (selected.value == 2) {
        setPrice((nightCount * 145.99 * tax).toFixed(2))
        DisplayPrice = (nightCount * 145.99 * tax).toFixed(2);
      } else if (selected.value == 3) {
        setPrice((nightCount * 109.99 * tax).toFixed(2))
        DisplayPrice = (nightCount * 109.99 * tax).toFixed(2);
      } else if (selected.value == 4) {
        setPrice((nightCount * 199.99 * tax).toFixed(2))
        DisplayPrice = (nightCount * 199.99 * tax).toFixed(2);
      } else if (selected.value == 5) {
        setPrice((nightCount * 175.99 * tax).toFixed(2))
        DisplayPrice = (nightCount * 175.99 * tax).toFixed(2);
      }
      if (nightCount == 1){
        setCurrentEst(selected.label +" (" + nightCount + " Night)" +": $" + DisplayPrice)
        console.log(CurrentEst)

      } else {
        setCurrentEst(selected.label +" (" + nightCount + " Nights)" +": $" + DisplayPrice)
        console.log(CurrentEst)
      }
    }
  }

  function CalculateScreen() {
    return (
      <SafeAreaView style={styles.infoContainer}>
        <StatusBar
        backgroundColor="#121212"
        />      
        <Text style={styles.title}>Current Estimate</Text>
        <ScrollView>
        <TextInput
                style={styles.inputCalc}
                value={CurrentEst}
                placeholder="Current Estimate"
                selectTextOnFocus={false}
                editable={false}
          />
        <Text style={styles.estitext}>Previous Estimates</Text>
        </ScrollView>
        <ScrollView style={styles.listArea}>
            
          </ScrollView>
      </SafeAreaView>
    );
  }
  
  function InfoScreen() {
    return (
      <SafeAreaView style={styles.infoContainer}>
        <StatusBar
        backgroundColor="#121212"
        />
        <ScrollView>
          <Image style={styles.image} source={logo}></Image>      
          <Text style={styles.info}>Best Western® Hotels & Resorts offers a global network of hotels in nearly 100+ countries and territories worldwide.</Text>
          <Text style={styles.info}>At Best Western Hotels & Resorts, we are committed to making our services and experiences accessible to everyone, including those with disabilities. If you are having difficulty accessing or using any web page, please complete the Web Accessibility Form. If you need assistance making a reservation at a Best Western branded hotel please call us at <TouchableOpacity onPress={handleTelPress}><Text style={styles.infoTel}>1-800-780-7234</Text></TouchableOpacity>, and we will make every effort to provide you with the same services available on the website.</Text>
          <Text style={styles.infoBottom}>Best Western is dedicated to providing you with the best possible travel experience. We operate in an industry built on trust and guest satisfaction. This can only be achieved through communication and experienced support.</Text>
          <TouchableOpacity 
          style={styles.button}
          onPress={handleButtonPress}>
            <Text style={styles.infoLink}>Find more information here!</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  function handleTelPress() {
    Linking.openURL('tel:+18007807234')
  }
  
  function handleButtonPress() {
    Linking.openURL('https://www.bestwestern.com/en_US/customer-service.html');
  }
  
  const Tab = createBottomTabNavigator();

  SplashScreen.preventAutoHideAsync();
  setTimeout(SplashScreen.hideAsync, 2000)

    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Estimates') {
                iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              } else if (route.name === 'Info') {
                iconName = focused ? 'help-circle' : 'help-circle-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#25A6D9',
            tabBarStyle: {
              backgroundColor: '#0F528C',
            },
            headerStyle: { backgroundColor: "#0F528C" },
            headerTintColor: "#0F528C",
            headerStatusBarHeight: -0
            })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Estimates" component={CalculateScreen} />
          <Tab.Screen name="Info" component={InfoScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignContent: 'center'
  },
  listArea: {
    backgroundColor: "#f0f0f0",
    flex: 1,
  },
  image: {
    height: 130,
    width: 320,
    marginBottom: 30
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold',
    color: '#0F528C',
    fontFamily: 'sans-serif'
  },
  homeText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 25
  },
  dropdown: {
    flex: 1,
    textAlign: 'center',
    fontSize: 25,
    marginTop: 30
  },
  warning: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: 'red'
  },
  info: {
    flex: 1,
    marginBottom: 20,
    width: 300,
    marginLeft: 10,
    textAlign: 'center',
  },
  infoTel: {
    textAlign: 'center',
    flex: 1,
    color: 'blue'
  },
  infoBottom: {
    flex: 1,
    width: 300,
    marginLeft: 10,
    textAlign: 'center',
  },
  estitext: {
    flex: 1,
    textAlign: 'center',
    fontSize: 25,
    marginTop: 23
  },
  infoLink: {
    color: 'white',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  calculateText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  button: {
    marginTop: 20,
    margin: 10,
    backgroundColor: '#0F528C',
    borderRadius: 3,
    padding: 10,
    paddingRight: 30,
    paddingLeft: 30,
  },
  input: {
    backgroundColor: '#ecf0f1',
    textAlign: 'center',
    borderRadius: 3,
    height: 45,
    padding: 5,
    marginBottom: 10,
    fontSize: 24
  },
  inputCalc: {
    backgroundColor: '#ecf0f1',
    textAlign: 'center',
    borderRadius: 3,
    height: 45,
    padding: 5,
    marginBottom: 10,
    fontSize: 16
  },
});

export default App;
