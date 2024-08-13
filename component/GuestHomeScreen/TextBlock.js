import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';


const { width } = Dimensions.get('window');

const MarqueeText = ({ text }) => {
    const translateX = useRef(new Animated.Value(width)).current;

    useEffect(() => {
        const animate = () => {
            translateX.setValue(width);
            Animated.timing(translateX, {
                toValue: -width,
                duration: 15000, // Adjust duration for desired speed
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => animate());
        };
        animate();
    }, [translateX]);

    return (
        <View style={styles.marqueeContainer}>
            <Animated.Text
                style={[
                    styles.marqueeText,
                    { transform: [{ translateX }] }
                ]}
                numberOfLines={1}
            >
                {text}
            </Animated.Text>
        </View>
    );
};

const TextBlock = () => {
    return (
        <View style={styles.container}>
            <MarqueeText text="On May 15, 2024, the draw of 1500 list will take place soon!" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
        overflow: 'hidden',
    },
    marqueeContainer: {
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#fff',
        paddingVertical: 10,
    },
    marqueeText: {
        fontSize: 20,
        color: '#000',
        fontWeight: 'bold',
        width: width * 2, // Ensuring text is wide enough to not wrap
    },
});

export default TextBlock;
