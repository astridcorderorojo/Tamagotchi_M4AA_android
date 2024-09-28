import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GameScreen({ navigation }) {
  const goToTamagotchi = () => {
    navigation.navigate('Tamagotchi');
  };

  const goToMemorice = () => {
    navigation.navigate('Memorice');
  };



  const goToJumpMonito = () => {
    navigation.navigate('JumpMonito');
  };


  return (
    <View style={styles.container}>
      {/* Imagen de portada */}
      <Image source={require('./assets/portada.png')} style={styles.coverImage} />

      <TouchableOpacity onPress={goToTamagotchi} style={styles.button}>
        <LinearGradient
          colors={['#ff7e5f', '#feb47b']} // Degradado de rosado a naranjo
          start={{ x: 0, y: 0 }} // De izquierda a derecha
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Jugar Tamagotchi</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToMemorice} style={styles.button}>
        <LinearGradient
          colors={['#feb47b', '#8e44ad']} // Degradado de naranjo a púrpura
          start={{ x: 0, y: 0 }} // De izquierda a derecha
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Jugar Memorice</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToJumpMonito} style={styles.button}>
        <LinearGradient
          colors={['#feb47b', '#8e44ad']} // Degradado de naranjo a púrpura
          start={{ x: 0, y: 0 }} // De izquierda a derecha
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Jugar Salta Monito</Text>
        </LinearGradient>
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Cambiar a flex-start para alinear elementos al principio
    alignItems: 'center',
    paddingTop: 20, // Ajusta este valor según lo necesites
    backgroundColor: '#fff',
  },
  coverImage: {
    width: '100%',
    height: 200, // Ajusta según necesites
    resizeMode: 'cover',
    marginBottom: 10, // Espacio entre la imagen y los botones
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    margin: 10,
    width: 250, // Ancho fijo para unificar el tamaño
    height: 60, // Altura aumentada para mayor tamaño vertical
  },
  gradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%', // Para asegurar que el gradiente cubra todo el botón
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});





