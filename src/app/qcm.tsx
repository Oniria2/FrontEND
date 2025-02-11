import { Link, Redirect, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import MyButton from '../Component/MyButton';
import { Stack } from 'expo-router';
import TimerComponent from "../Component/TimerComponent";

export default function Index() {

  const params = useLocalSearchParams();
  const [question, setQuestion] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<number>(1);
  const [responses, setResponses] = useState<{ title: string; correct: boolean }[]>([]);
  const [score, setScore] = useState<number>(0);

  const fetchQuestionById = async (id: number) => {
    try {
      const response = await axios.get(`https://qcm-api-a108ec633b51.herokuapp.com/questions/${id}`);
      return response.data.rows[0].intitule;
    } catch (error) {
      console.error('Error fetching question:', error);
      return null;
    }
  };

  const fetchResponsesByQuestionId = async (id: number) => {
    try {
      const response = await axios.get(`https://qcm-api-a108ec633b51.herokuapp.com/reponse/${id}`);
      return response.data.rows.map((row: any) => ({ title: row.titre, correct: row.correct }));
    } catch (error) {
      console.error('Error fetching responses:', error);
      return [];
    }
  };

  const checkAnswer = (selectedAnswer: string) => {
    const correctAnswer = responses.find(response => response.title === selectedAnswer);
    console.log('Correct answer:', correctAnswer);
    if (correctAnswer && correctAnswer.correct) {
      // Utilise une fonction pour accéder à l'état actuel et mettre à jour correctement
      setScore(prevScore => {
        const updatedScore = prevScore + 1;
        goToNextQuestion(updatedScore); // On passe le score mis à jour à goToNextQuestion
        return updatedScore;
      });
    } else {
      // Si la réponse est incorrecte, on passe quand même à la prochaine question sans incrémenter le score
      goToNextQuestion(score);
    }
  };

  const goToNextQuestion = async (updatedScore: number) => {
    const nextQuestionId = questionId + 1;
    if (nextQuestionId > 4) {
      // Navigue vers la page de résultat avec le score mis à jour
      router.navigate({
        pathname: '/result',
        params: { score: updatedScore, name: params.name },
      });
      return;
    }
    const result = await fetchQuestionById(nextQuestionId);
    const responses = await fetchResponsesByQuestionId(nextQuestionId);
    setQuestionId(nextQuestionId);
    setQuestion(result);
    setResponses(responses);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchQuestionById(1);
      const responses = await fetchResponsesByQuestionId(1);
      setQuestion(result);
      setResponses(responses);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <Stack.Screen options={{ title: 'Quizz', headerStyle: { backgroundColor: 'white' } }} />
      <Text style={styles.size}>Bonjour {params.name}!!</Text>
      <TimerComponent duration={10} />
      <Text style={styles.size}>{question}</Text>
      {responses.map((response, index) => (
        <View style={styles.pad} key={index}>
          <MyButton handleRedirect={() => checkAnswer(response.title)} buttonText={response.title} />
        </View>
      ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A4FBF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  size: {
    fontSize: 30,
    textDecorationColor: 'red',
    color: 'white',
    justifyContent: 'center',
    padding: 10,
  },
  pad: {
    padding: 10,
  },
  score: {
    fontSize: 20,
    color: 'white',
  },
});
