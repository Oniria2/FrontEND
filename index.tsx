import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import MyButton from '../Component/MyButton';
import { Image } from 'react-native';


export default function Index() {

  const [text, onChangeText] = React.useState('');
  const [number, onChangeNumber] = React.useState('');

  const router = useRouter();

  const handleRedirect = () => {
    router.navigate({
      pathname: '/qcm',
      params: { name: text }

    });
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Quizz', headerStyle: { backgroundColor: "#8A4FBF" } }} />
      <SafeAreaView>
       <View style={styles.container2}>
        <Image
          source={require('../../assets/MonImage.jpeg')}
          style={styles.logo}
        />
        </View>
        <Text style = {styles.welcomeText}>Bienvenue dans notre App de QCM!!</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
        />
        <StatusBar style="auto" />

        <View style={styles.container2}>
        <MyButton handleRedirect={handleRedirect} buttonText='commencer le QCM ' />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
  container2 : {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignContent: 'center',
    justifyContent: 'center'
  },

    welcomeText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
      textAlign: 'center',
    },
  });
