
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import image1 from './assets/unicornio.png'; // Imagen para cuando el Tamagotchi está despierto
import image2 from './assets/unicornio_durmiendo3.png'; // Imagen para cuando el Tamagotchi está dormido
import sunIcon from './assets/sol.png'; // Imagen del sol
import moonStarsIcon from './assets/luna.png'; // Imagen de luna con estrellas


import iconFeed1 from './assets/alimentar/icon1_alim.png';
import iconFeed2 from './assets/alimentar/icon2_alim.png';
import iconFeed3 from './assets/alimentar/icon3_alim.png';
import iconFeed4 from './assets/alimentar/icon4_alim.png';
import iconFeed5 from './assets/alimentar/icon5_alim.png';
import iconFeed6 from './assets/alimentar/icon6_alim.png';
import iconFeed7 from './assets/alimentar/icon7_alim.png';
import iconFeed8 from './assets/alimentar/icon8_alim.png';
import iconFeed9 from './assets/alimentar/icon9_alim.png';

// Importa aquí los íconos para play y clean


import iconPlay1 from './assets/jugar/icon1_jugar.png';
import iconPlay2 from './assets/jugar/icon2_jugar.png';
import iconPlay3 from './assets/jugar/icon3_jugar.png';
import iconPlay4 from './assets/jugar/icon4_jugar.png';
import iconPlay5 from './assets/jugar/icon5_jugar.png';
import iconPlay6 from './assets/jugar/icon6_jugar.png';
import iconPlay7 from './assets/jugar/icon7_jugar.png';
import iconPlay8 from './assets/jugar/icon8_jugar.png';
import iconPlay9 from './assets/jugar/icon9_jugar.png';

import iconClean1 from './assets/limpiar/icon1_limpiar.png';
import iconClean2 from './assets/limpiar/icon2_limpiar.png';
import iconClean3 from './assets/limpiar/icon3_limpiar.png';
import iconClean4 from './assets/limpiar/icon4_limpiar.png';
import iconClean5 from './assets/limpiar/icon5_limpiar.png';
import iconClean6 from './assets/limpiar/icon6_limpiar.png';
import iconClean7 from './assets/limpiar/icon7_limpiar.png';
import iconClean8 from './assets/limpiar/icon8_limpiar.png';
import iconClean9 from './assets/limpiar/icon9_limpiar.png';





export default function App() {
  const initialStats = {
    hunger: 100,
    happiness: 100,
    cleanliness: 100,
  };

  const [stats, setStats] = useState(initialStats);
  const [isSleeping, setIsSleeping] = useState(false);
  const [hibernating, setHibernating] = useState(false);
  const [showActivityButtons, setShowActivityButtons] = useState(false);
  const [activityButtons, setActivityButtons] = useState([]);
  const [actionTitle, setActionTitle] = useState('');

  useEffect(() => {
    if (stats.hunger === 0 && stats.happiness === 0 && stats.cleanliness === 0) {
      setIsSleeping(true);
      setHibernating(true);
    } else {
      setHibernating(false);
    }
  }, [stats]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hibernating && !isSleeping) {
        setStats(prevStats => ({
          hunger: Math.max(prevStats.hunger - 1, 0),
          happiness: Math.max(prevStats.happiness - 1, 0),
          cleanliness: Math.max(prevStats.cleanliness - 1, 0),
        }));
      } else if (!hibernating && isSleeping) {
        setStats(prevStats => ({
          hunger: prevStats.hunger,
          happiness: Math.min(prevStats.happiness + 0.25, 100),
          cleanliness: prevStats.cleanliness,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSleeping, hibernating]);

  const resetStats = () => {
    Vibration.vibrate();
    setStats({
      hunger: 100,
      happiness: 100,
      cleanliness: 100,
    });
    setIsSleeping(false);
    setHibernating(false);
    setShowActivityButtons(false);
  };

  const feed = () => {
    Vibration.vibrate();
    if (!hibernating && !isSleeping) {
      setActionTitle('Alimentar');
      setStats(prevStats => ({ ...prevStats, hunger: Math.min(prevStats.hunger + 10, 100) }));
      if (!showActivityButtons) {
        setActivityButtons(generateActivityButtons('feed'));
        setShowActivityButtons(true);
      }
    }
  };

  const play = () => {
    Vibration.vibrate();
    if (!hibernating && !isSleeping) {
      setActionTitle('Jugar');
      setStats(prevStats => ({ ...prevStats, happiness: Math.min(prevStats.happiness + 10, 100) }));
      if (!showActivityButtons) {
        setActivityButtons(generateActivityButtons('play'));
        setShowActivityButtons(true);
      }
    }
  };

  const clean = () => {
    Vibration.vibrate();
    if (!hibernating && !isSleeping) {
      setActionTitle('Limpiar');
      setStats(prevStats => ({ ...prevStats, cleanliness: Math.min(prevStats.cleanliness + 10, 100) }));
      if (!showActivityButtons) {
        setActivityButtons(generateActivityButtons('clean'));
        setShowActivityButtons(true);
      }
    }
  };

  const toggleSleep = () => {
    Vibration.vibrate();
    if (!hibernating) {
      setIsSleeping(prevIsSleeping => !prevIsSleeping);
    }
  };

  const handleActivityButtonPress = (type) => {
    Vibration.vibrate();
    if (type === 'feed') {
      setStats(prevStats => ({ ...prevStats, hunger: Math.min(prevStats.hunger + 5, 100) }));
    } else if (type === 'play') {
      setStats(prevStats => ({ ...prevStats, happiness: Math.min(prevStats.happiness + 5, 100) }));
    } else if (type === 'clean') {
      setStats(prevStats => ({ ...prevStats, cleanliness: Math.min(prevStats.cleanliness + 5, 100) }));
    }
  };

  const getImage = () => {
    if (hibernating) {
      return image2;
    }
    return isSleeping ? image2 : image1;
  };

  const generateActivityButtons = (activityType) => {
    const icons = {
      feed: [iconFeed1, iconFeed2, iconFeed3, iconFeed4, iconFeed5, iconFeed6, iconFeed7, iconFeed8, iconFeed9],
      play: [iconPlay1,iconPlay2,iconPlay3,iconPlay4,iconPlay5,iconPlay6,iconPlay7,iconPlay8,iconPlay9],
      clean: [iconClean1,iconClean2,iconClean3,iconClean4,iconClean5,iconClean6,iconClean7,iconClean8,iconClean9]
    };

    return icons[activityType].map((icon, index) => (
      <TouchableOpacity key={index} style={styles.activityButton} onPress={() => handleActivityButtonPress(activityType)}>
        <Image source={icon} style={styles.activityButtonImage} />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      {!showActivityButtons ? (
        <>
          <Svg height="60" width="300">
            <Defs>
              <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#ff0000" stopOpacity="1" />
                <Stop offset="14%" stopColor="#ff7f00" stopOpacity="1" />
                <Stop offset="28%" stopColor="#ffff00" stopOpacity="1" />
                <Stop offset="42%" stopColor="#00ff00" stopOpacity="1" />
                <Stop offset="57%" stopColor="#0000ff" stopOpacity="1" />
                <Stop offset="71%" stopColor="#4b0082" stopOpacity="1" />
                <Stop offset="85%" stopColor="#9400d3" stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <SvgText
              fill="url(#grad)"
              fontSize="32"
              fontWeight="bold"
              x="150"
              y="40"
              textAnchor="middle"
            >
              Tamagotchi
            </SvgText>
          </Svg>
          <TouchableOpacity onPress={resetStats} style={styles.resetButtonContainer}>
            <LinearGradient
              colors={['#ff7e5f', '#feb47b']}
              style={styles.resetButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.resetButtonText}>Reiniciar</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Image
            source={getImage()}
            style={styles.image}
          />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statText}>Hambre: {stats.hunger}</Text>
              <View style={styles.progressBarBackground}>
                <View style={[
                  styles.progressBar,
                  { width: `${stats.hunger}%`, backgroundColor: '#ff6f61' },
                ]} />
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statText}>Felicidad: {stats.happiness}</Text>
              <View style={styles.progressBarBackground}>
                <View style={[
                  styles.progressBar,
                  { width: `${stats.happiness}%`, backgroundColor: '#4caf50' },
                ]} />
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statText}>Limpieza: {stats.cleanliness}</Text>
              <View style={styles.progressBarBackground}>
                <View style={[
                  styles.progressBar,
                  { width: `${stats.cleanliness}%`, backgroundColor: '#2196f3' },
                ]} />
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={feed} style={[styles.button, (hibernating || isSleeping) && styles.disabledButton]} disabled={hibernating || isSleeping}>
              <LinearGradient
                colors={['#ff9a9e', '#fecfef']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Alimentar</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={play} style={[styles.button, (hibernating || isSleeping) && styles.disabledButton]} disabled={hibernating || isSleeping}>
              <LinearGradient
                colors={['#a18cd1', '#fbc2eb']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Jugar</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={clean} style={[styles.button, (hibernating || isSleeping) && styles.disabledButton]} disabled={hibernating || isSleeping}>
              <LinearGradient
                colors={['#f6d365', '#fda085']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Limpiar</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSleep} style={styles.button} disabled={hibernating}>
              <LinearGradient
                colors={hibernating ? ['#00c6ff', '#a1c4fd'] : ['#a1c4fd', '#c2e9fb']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>{hibernating ? 'Hibernando' : (isSleeping ? 'Dormido' : 'Despierto')}</Text>
                  {!hibernating && <Image
                    source={isSleeping ? moonStarsIcon : sunIcon}
                    style={styles.icon}
                  />}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.activityContainer}>
          <TouchableOpacity onPress={() => setShowActivityButtons(false)} style={styles.backButton}>
            <LinearGradient
              colors={['#ff7e5f', '#feb47b']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.activityTitle}>{actionTitle}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statText}>Hambre: {stats.hunger}</Text>
              <View style={styles.progressBarBackground}>
                <View style={[
                  styles.progressBar,
                  { width: `${stats.hunger}%`, backgroundColor: '#ff6f61' },
                ]} />
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statText}>Felicidad: {stats.happiness}</Text>
              <View style={styles.progressBarBackground}>
                <View style={[
                  styles.progressBar,
                  { width: `${stats.happiness}%`, backgroundColor: '#4caf50' },
                ]} />
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statText}>Limpieza: {stats.cleanliness}</Text>
              <View style={styles.progressBarBackground}>
                <View style={[
                  styles.progressBar,
                  { width: `${stats.cleanliness}%`, backgroundColor: '#2196f3' },
                ]} />
              </View>
            </View>
          </View>
          <View style={styles.activityButtonsContainer}>
            {activityButtons}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    marginBottom: 10,
  },
  resetButtonContainer: {
    marginBottom: 20,
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  statsContainer: {
    width: '80%',
    marginBottom: 20,
    alignItems: 'center',
  },
  statItem: {
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  statText: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
  },
  progressBarBackground: {
    height: 10,
    width: '80%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'space-around',
  },
  button: {
    marginBottom: 20,
  },
  gradientButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityContainer: {
    width: '80%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  activityButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  activityButtonImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  activityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

