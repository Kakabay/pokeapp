import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getPokemonDetails, Pokemon } from '@/api/pokeapi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [details, setDetail] = useState<Pokemon>();
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const details = await getPokemonDetails(id);
      setDetail(details);
      navigation.setOptions({
        title: details.name.charAt(0).toUpperCase() + details.name.slice(1),
      });

      const isFavorite = await AsyncStorage.getItem(`favorite-${id}`);
      setIsFavorite(isFavorite === 'true' ? true : false);
    };
    load();
  }, [id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text onPress={toggleFavorite}>
          <Ionicons name={isFavorite ? 'star' : 'star-outline'} size={24} color={'#fff'} />
        </Text>
      ),
    });
  }, [isFavorite]);

  const toggleFavorite = async () => {
    await AsyncStorage.setItem(`favorite-${id}`, !isFavorite ? 'true' : 'false');
    setIsFavorite((prev) => !prev);
  };

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      {details && (
        <>
          <View style={{ ...styles.card, alignItems: 'center' }}>
            <Image
              source={{ uri: details.sprites.front_default }}
              style={{ width: 200, height: 200 }}
            />
            <Text style={styles.name}>
              #{details.id} {details.name}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Stats</Text>
            {details.stats.map((item: any) => (
              <Text key={item.stat.name}>
                {item.stat.name}: {item.base_stat}
              </Text>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    margin: 20,
    elevation: 1,
    gap: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },

  name: { fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize' },
});

export default Page;
