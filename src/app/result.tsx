import { router, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import React from 'react';
/* eslint react/no-unescaped-entities: "off" */

export default function Result() {
    const params = useLocalSearchParams();
    
    const handleReplay = () => {
        // Logique pour rejouer le quiz
        router.navigate({
            pathname: '/',
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Voici l'image qui représente {'\n'} votre état actuel {params.name}.  </Text>
            <Image
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                source={require('../../assets/trophé.png')}
                style={styles.image}
            />
            <Text style={styles.title}>Merci d'avoir pris le temps de répondre a notre questionnaire  {'\n'} {params.name}. </Text>
            {/* La ligne suivante pour afficher le score, elle doit être mise en commentaire hors des phases de test */}
            {/*<Text style={styles.resultText}>Votre résultat est de {params.score} </Text>*/}
            <Button title=" Retour a l'accueil " onPress={handleReplay} color="#8A4FBF" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    resultText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
});
