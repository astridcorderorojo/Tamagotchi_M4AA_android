import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, Alert, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { storage, firestore, auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ProfileScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [showImageSourceOptions, setShowImageSourceOptions] = useState(false);
  const [showImageConfirmation, setShowImageConfirmation] = useState(false);
  const [previewUri, setPreviewUri] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userProfileRef = doc(firestore, `profiles/${user.uid}`);
          const docSnap = await getDoc(userProfileRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || '');
            setAge(data.age || '');
            setProfileImageUrl(data.profileImageUrl || '');
          }
        } catch (error) {
          Alert.alert('Error', 'No se pudo recuperar el perfil del usuario.');
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleImagePress = () => {
    setShowImageSourceOptions(true);
  };

  const handleImageSourceOption = (source) => {
    if (source === 'device') {
      pickImage();
    } else if (source === 'camera') {
      takePhoto();
    }
    setShowImageSourceOptions(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso de galería denegado');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPreviewUri(result.assets[0].uri);
      setImageUri(result.assets[0].uri);
      setShowImageConfirmation(true);
    } else {
      Alert.alert('Error', 'No se seleccionó ninguna imagen.');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso de cámara denegado');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPreviewUri(result.assets[0].uri);
      setImageUri(result.assets[0].uri);
      setShowImageConfirmation(true);
    } else {
      Alert.alert('Error', 'No se tomó ninguna foto.');
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Selecciona una imagen primero.');
      return;
    }

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = imageUri.split('/').pop();
      const storageRef = ref(storage, `avatars/${filename}`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      const user = auth.currentUser;
      if (user) {
        const userProfileRef = doc(firestore, `profiles/${user.uid}`);
        await setDoc(userProfileRef, { profileImageUrl: downloadURL }, { merge: true });
        setProfileImageUrl(downloadURL);
      }

      Alert.alert('Imagen subida con éxito');
      setPreviewUri(null);
      setImageUri(null);
      setShowImageConfirmation(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const saveUserProfile = async () => {
    if (!name || !age) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No estás autenticado');

      const userProfileRef = doc(firestore, `profiles/${user.uid}`);

      if (imageUri) {
        await uploadImage();
      } else {
        await setDoc(userProfileRef, {
          name,
          age,
          profileImageUrl: profileImageUrl || '',
        }, { merge: true });
        Alert.alert('Perfil guardado con éxito');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate('Login');
    }).catch((error) => {
      Alert.alert('Error', error.message);
    });
  };

  const navigateToGame = () => {
    navigation.navigate('Game');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePress} style={styles.imagePressContainer}>
        <View style={styles.imageContainer}>
          {profileImageUrl || imageUri ? (
            <Image
              source={{ uri: profileImageUrl || imageUri }}
              style={styles.image}
            />
          ) : (
            <Icon name="user-circle" size={100} color="#888" />
          )}
          <TouchableOpacity onPress={handleImagePress} style={styles.cameraIconContainer}>
            <Icon name="camera" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <Text style={styles.label}>Nombre:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
        <Icon name="user" size={20} color="#888" style={styles.inputIcon} />
      </View>

      <Text style={styles.label}>Edad:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Edad"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <Icon name="calendar" size={20} color="#888" style={styles.inputIcon} />
      </View>

      {/* Botones centrados */}
      <View style={styles.buttonContainer}>
        <LinearGradient
          colors={['#ff7e5f', '#feb47b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <TouchableOpacity onPress={saveUserProfile} style={styles.button}>
            <Text style={styles.buttonText}>Guardar perfil</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.buttonContainer}>
        <LinearGradient
          colors={['#ff7e5f', '#feb47b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <TouchableOpacity onPress={handleLogout} style={styles.button}>
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.buttonContainer}>
        <LinearGradient
          colors={['#feb47b', '#8e44ad']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <TouchableOpacity onPress={navigateToGame} style={styles.button}>
            <Text style={styles.buttonText}>Ir a juegos</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Modal de opciones de fuente de imagen */}
      <Modal
        visible={showImageSourceOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageSourceOptions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Cómo deseas seleccionar la imagen?</Text>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleImageSourceOption('device')}>
              <Text style={styles.optionButtonText}>Desde el dispositivo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleImageSourceOption('camera')}>
              <Text style={styles.optionButtonText}>Usar cámara</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowImageSourceOptions(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmación de carga de imagen */}
      <Modal
        visible={showImageConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageConfirmation(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {previewUri && <Image source={{ uri: previewUri }} style={styles.previewImage} />}
            <Text style={styles.modalText}>¿Deseas subir esta imagen como tu nueva imagen de perfil?</Text>
            <TouchableOpacity onPress={uploadImage}>
              <Text>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowImageConfirmation(false)}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  label: {
    width: '100%',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    height: 40,
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 40,
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 8,
    alignItems: 'center',
  },
  gradientButton: {
    borderRadius: 25,
    overflow: 'hidden',
    width: 250,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#ff7e5f',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
});












