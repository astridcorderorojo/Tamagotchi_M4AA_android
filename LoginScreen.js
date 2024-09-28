import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función para manejar el inicio de sesión
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico y contraseña.');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate('Profile'); // Navegar a la pantalla de perfil después del inicio de sesión exitoso
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  // Función para manejar el registro
  const handleRegister = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico y contraseña.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate('Profile'); // Navegar a la pantalla de perfil después del registro exitoso
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      {/* Imagen de portada */}
      <Image source={require('./assets/portada.png')} style={styles.coverImage} />

      <Text style={styles.header}>Iniciar sesión</Text>

      <Text style={styles.label}>Correo Electrónico:</Text>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.label}>Contraseña:</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry // Esta propiedad oculta la contraseña
        />
      </View>

      <View style={styles.buttonContainer}>
        {/* Botón para iniciar sesión */}
        <LinearGradient
          colors={['#ff7e5f', '#feb47b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.buttonContainer}>
        {/* Botón para registrarse */}
        <LinearGradient
          colors={['#feb47b', '#8e44ad']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff', // Fondo blanco
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    width: '100%',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'left', // Alinear a la izquierda
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    height: 40,
    flex: 1, // Permite que el campo de entrada ocupe el espacio disponible
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 12,
  },
  gradientButton: {
    borderRadius: 25,
    overflow: 'hidden',
    height: 50,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


