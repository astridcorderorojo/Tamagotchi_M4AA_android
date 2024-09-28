import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, ActivityIndicator, Modal } from 'react-native';
import * as KeepAwake from 'expo-keep-awake';
import { Asset } from 'expo-asset';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

const images = {
  limpiar: [
    require('./assets/limpiar/icon1.png'),
    require('./assets/limpiar/icon2.png'),
    require('./assets/limpiar/icon3.png'),
    require('./assets/limpiar/icon4.png'),
    require('./assets/limpiar/icon5.png'),
    require('./assets/limpiar/icon6.png'),
    require('./assets/limpiar/icon7.png'),
    require('./assets/limpiar/icon8.png'),
    require('./assets/limpiar/icon9.png'),
  ],
  jugar: [
    require('./assets/jugar/icon1.png'),
    require('./assets/jugar/icon2.png'),
    require('./assets/jugar/icon3.png'),
    require('./assets/jugar/icon4.png'),
    require('./assets/jugar/icon5.png'),
    require('./assets/jugar/icon6.png'),
    require('./assets/jugar/icon7.png'),
    require('./assets/jugar/icon8.png'),
    require('./assets/jugar/icon9.png'),
  ],
  alimentar: [
    require('./assets/alimentar/icon1.png'),
    require('./assets/alimentar/icon2.png'),
    require('./assets/alimentar/icon3.png'),
    require('./assets/alimentar/icon4.png'),
    require('./assets/alimentar/icon5.png'),
    require('./assets/alimentar/icon6.png'),
    require('./assets/alimentar/icon7.png'),
    require('./assets/alimentar/icon8.png'),
    require('./assets/alimentar/icon9.png'),
  ],
};

const getRandomImages = (numImages) => {
  const selectedImages = [];
  const categories = Object.keys(images);
  
  while (selectedImages.length < numImages) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const imgs = images[randomCategory];
    
    const randomImage = imgs[Math.floor(Math.random() * imgs.length)];
    
    if (!selectedImages.includes(randomImage)) {
      selectedImages.push(randomImage);
    }
  }

  return selectedImages;
};

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const preloadImages = async () => {
  const imageAssets = [];
  for (const category of Object.values(images)) {
    for (const image of category) {
      imageAssets.push(Asset.fromModule(image).downloadAsync());
    }
  }
  await Promise.all(imageAssets);
};

const App = () => {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    const startGame = async () => {
      await preloadImages();
      resetGame();
      setLoading(false);
    };

    startGame();
  }, []);

  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  useEffect(() => {
    if (showCountdown) {
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownTimer);
            setShowCountdown(false);
            setTimerActive(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [showCountdown]);

  const handleCardPress = (index) => {
    if (flippedCards.length < 2 && !flippedCards.includes(index) && !matchedCards.includes(cards[index])) {
      setFlippedCards((prev) => [...prev, index]);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;

      if (cards[firstCard] === cards[secondCard]) {
        setMatchedCards((prev) => [...prev, cards[firstCard]]);
        setScore((prevScore) => prevScore + 1);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 500);
      }
    }
  }, [flippedCards]);

  useEffect(() => {
    const maxScore = cards.length / 2;
    if (score === maxScore) {
      setIsGameOver(true);
      setTimerActive(false);
      // Aquí eliminamos el mensaje de felicitaciones
    }
  }, [score, cards, time]);

  const startGame = () => {
    resetGame();
    KeepAwake.activateKeepAwakeAsync();
    setShowCountdown(true);
  };

  const resetGame = () => {
    const randomImages = getRandomImages(6);
    setCards(shuffleArray([...randomImages, ...randomImages]));
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setTime(0);
    setIsGameOver(false);
    setGameStarted(true);
    setCountdown(3);
    setShowCountdown(true);
  };

  const exitGame = () => {
    Alert.alert("Salir", "¿Estás seguro de que quieres regresar a la pantalla de inicio?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Regresar", onPress: () => navigation.navigate('Game') },
    ]);
  };

  const renderCard = (image, index) => {
    const isFlipped = flippedCards.includes(index) || matchedCards.includes(image);
    return (
      <TouchableOpacity
        key={index}
        style={[styles.card, { backgroundColor: isFlipped ? '#fff' : '#ccc' }]}
        onPress={() => handleCardPress(index)}
      >
        {isFlipped ? (
          <ImageBackground source={image} style={styles.cardImage} />
        ) : (
          <Text style={styles.cardText}>?</Text>
        )}
      </TouchableOpacity>
    );
  };

  const formatTime = (time) => {
    const seconds = (time / 10).toFixed(1);
    return `${seconds} s`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memorice Game</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Cargando juego...</Text>
        </View>
      ) : (
        <>
          {gameStarted ? (
            <>
              <Text style={styles.score}>Puntos: {score}</Text>
              <Text style={styles.time}>Tiempo: {formatTime(time)}</Text>
              <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                <Text style={styles.resetButtonText}>Reiniciar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exitButton} onPress={exitGame}>
                <Text style={styles.exitButtonText}>Salir</Text>
              </TouchableOpacity>
              <View style={styles.grid}>
                {cards.map((image, index) => renderCard(image, index))}
              </View>
              {isGameOver && (
                <Text style={styles.gameOverText}>¡Juego Terminado!</Text>
              )}
            </>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>Iniciar Juego</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <StatusBar style="auto" />

      {/* Popup de cuenta regresiva */}
      <Modal transparent={true} visible={showCountdown} animationType="fade">
        <View style={styles.modalContainer}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Cambiar a flex-start para alinear elementos al principio
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
    marginBottom: 10,
  },
  time: {
    fontSize: 18,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '80%',
    justifyContent: 'space-between',
  },
  card: {
    width: '30%',
    height: 100,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  cardText: {
    fontSize: 30,
  },
  startButton: {
    padding: 15,
    backgroundColor: '#28A745',
    borderRadius: 5,
    marginBottom: 20,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  exitButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#DC3545',
    borderRadius: 5,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
  gameOverText: {
    fontSize: 20,
    marginTop: 20,
    color: '#ff0000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  countdownText: {
    fontSize: 48,
    color: '#fff',
  },
});

export default App;


