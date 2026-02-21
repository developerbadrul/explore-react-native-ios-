import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaViewBase, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=20`);
        const result = await response.json();
        // FIX: Changed result.result to result.results
        setPokemons(result.results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  // console.log(pokemons)

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading Pokemon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Something went wrong: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {pokemons.map((pokemon) => (
          <View key={pokemon.name} style={styles.card}>
            <Text style={styles.name}>{pokemon.name}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContent: {
    padding: 20, // Numeric value, no quotes
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  name: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
});