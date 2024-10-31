import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { getPokemon, Pokemon } from '@/api/pokeapi';
import { Ionicons } from '@expo/vector-icons';
// import { ScrollView } from 'react-native-gesture-handler';

const index = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await getPokemon();
      setPokemon(result);
    };
    load();
  }, []);

  return (
    <ScrollView>
      {pokemon.map((pokemon, i) => (
        <Link href={`/(pokemon)/${pokemon.id}`} key={pokemon.id} asChild>
          <TouchableOpacity>
            <View style={styles.item}>
              <Image source={{ uri: pokemon.image }} style={styles.preview} />
              <Text style={styles.itemText}>{pokemon.name}</Text>
              <Ionicons name="chevron-forward" size={24} />
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderBottomColor: '#cecece',
  },
  itemText: { fontSize: 18, textTransform: 'capitalize', flex: 1 },
  preview: {
    width: 100,
    height: 100,
  },
});

export default index;
