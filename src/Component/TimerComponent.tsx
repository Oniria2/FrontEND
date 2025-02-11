import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

interface TimerComponentProps {
    duration: number; // durée en secondes
}

const TimerComponent: React.FC<TimerComponentProps> = ({ duration }) => {
    const [timeLeft, setTimeLeft] = useState<number>(duration);

    useEffect(() => {
        if (timeLeft > 0) {
            const interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timeLeft]);

    const percentage = ((duration - timeLeft) / duration) * 100;

    return (
        <View style={styles.container}>
            <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 30,
        borderColor: '#000',
        borderWidth: 1,
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'blue',
    },
});

export default TimerComponent;
