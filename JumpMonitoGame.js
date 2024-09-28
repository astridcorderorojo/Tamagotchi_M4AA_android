import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration, Animated, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [jumpCount, setJumpCount] = useState(0);
  const [accelData, setAccelData] = useState(null);
  const [isCounting, setIsCounting] = useState(false);
  const [jumpAnimation] = useState(new Animated.Value(0));
  let subscription = null;

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);

    subscription = Accelerometer.addListener(accelerometerData => {
      setAccelData(accelerometerData);

      const threshold = 2.5;
      const magnitude = Math.sqrt(
        accelerometerData.x ** 2 +
        accelerometerData.y ** 2 +
        accelerometerData.z ** 2
      );

      if (isCounting && magnitude > threshold) {
        Vibration.vibrate();
        handleJump();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isCounting]);

  const handleJump = () => {
    if (isCounting) {
      Vibration.vibrate(); // Vibrar al presionar el botón de salto
      startJumpAnimation();
      setJumpCount(prev => prev + 1);
    }
  };

  const startJumpAnimation = () => {
    jumpAnimation.setValue(0);

    const jumpHeight = -128; // Altura del salto reducida en un 20%
    const duration = 240; // Duración del salto

    // Animación de salto
    Animated.sequence([
      Animated.timing(jumpAnimation, {
        toValue: jumpHeight,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(jumpAnimation, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetCounts = () => {
    setJumpCount(0);
  };

  const toggleCounting = () => {
    setIsCounting(prev => !prev);
    if (!isCounting) {
      resetCounts(); // Reinicia los conteos al comenzar
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Salta Monito</Text>

      <ImageBackground 
        source={require('./assets/selva.png')}
        style={styles.monkeyArea}
        imageStyle={styles.backgroundImage}
      >
        <Animated.View 
          style={[
            styles.monkeyContainer, 
            { transform: [{ translateY: jumpAnimation }] }
          ]}
        >
          <Text style={styles.monkey}>🐒</Text>
        </Animated.View>
      </ImageBackground>

      <Text style={styles.countText}>Saltos: {jumpCount}</Text>
      {accelData && (
        <Text style={styles.accelText}>
          Aceleración (X, Y, Z): {accelData.x.toFixed(2)}, {accelData.y.toFixed(2)}, {accelData.z.toFixed(2)}
        </Text>
      )}

      <LinearGradient colors={['#4682b4', '#00bfff']} style={styles.button}>
        <TouchableOpacity onPress={toggleCounting} style={styles.buttonContent}>
          <Text style={styles.buttonText}>
            {isCounting ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient colors={['#ff6347', '#ff4500']} style={styles.button}>
        <TouchableOpacity onPress={resetCounts} style={styles.buttonContent}>
          <Text style={styles.buttonText}>Resetear Conteos</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Botón circular para saltar */}
      <TouchableOpacity style={styles.jumpButton} onPress={handleJump}>
        <Text style={styles.jumpButtonText}>🦘</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 32,
    marginBottom: 20,
  },
  monkeyArea: {
    height: 240,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  monkeyContainer: {
    position: 'absolute',
    bottom: 0,
  },
  monkey: {
    fontSize: 50,
  },
  countText: {
    fontSize: 24,
    marginBottom: 10,
  },
  accelText: {
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonContent: {
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  jumpButton: {
    marginTop: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#32cd32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jumpButtonText: {
    fontSize: 24,
  },
});



























