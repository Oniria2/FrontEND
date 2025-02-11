import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

const MyButton = ({ handleRedirect, buttonText }: { handleRedirect: () => void; buttonText: string }) => {
    return (
        <View style={styles.btn}>
        <Button mode="elevated" onPress={handleRedirect}>
            {buttonText}
        </Button>
        </View>
    );
};

const styles = {    
    btn: {
        width: 250,
    },
};

export default MyButton;
