import { router, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import React from 'react';

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
            <Image
                source={require('../../assets/trophé.png')}
                style={styles.image}
            />
            <Text style={styles.title}>Félicitations {params.name}!</Text>
            <Text style={styles.resultText}>Votre résultat est de {params.score} points !!!</Text>
            <Button title="Rejouer le Quiz" onPress={handleReplay} color="#8A4FBF" />
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
