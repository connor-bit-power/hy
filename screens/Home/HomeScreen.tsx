import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { getTopStoryTitles } from '../../api';

export default function HomeScreen({ navigation }) {
  const [titles, setTitles] = useState<string[]>([]);
  const scrollY = useRef(0);

  useEffect(() => {
    async function fetchTitles() {
      const topTitles = await getTopStoryTitles();
      setTitles(topTitles);
    }

    fetchTitles();
  }, []);

  const handleTitlePress = (title: string) => {
    Haptics.selectionAsync();
    navigation.navigate('Story', { title });
  };

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    if (Math.abs(currentOffset - scrollY.current) >= 60) {
      Haptics.selectionAsync();
      scrollY.current = currentOffset;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        onScroll={handleScroll}
        scrollEventThrottle={20} 
      >
        <View style={styles.header}>
          <TouchableOpacity>
            <Image source={require('../../assets/HY_logo.png')} style={styles.orb} />
          </TouchableOpacity>
        </View>
        {titles.map((title, index) => (
          <TouchableOpacity key={index} onPress={() => handleTitlePress(title)}>
            <Text style={styles.title}>{title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <BlurView intensity={50} style={styles.blurView}>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={styles.gradient}
          />
        </BlurView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Ensure the background is white
  },
  scrollContainer: {
    justifyContent: 'center',
    marginTop: 100,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  orb: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '400',
    marginVertical: 22,
    marginLeft: 18,
    textAlign: 'left',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '5%', // 5% of the screen height
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    flex: 1,
    width: '100%',
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
});