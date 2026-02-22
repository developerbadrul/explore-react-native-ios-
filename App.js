
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View, StyleSheet, Image } from 'react-native';

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const colorByType = {
    grass: '#78C850',
    fire: '#F08030',
    water: '#6890F0',
    bug: '#A8B820',
    normal: '#A8A878',
    poison: '#A040A0',
    electric: '#F8D030',
    ground: '#E0C068',
    fairy: '#EE99AC',
    fighting: '#C03028',
    psychic: '#F85888',
    rock: '#B8A038',
    ghost: '#705898',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    flying: '#A890F0',
    default: '#68A090', // Fallback color
  };

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=20`);
        const data = await response.json();

        const detailedPokemons = await Promise.allSettled(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();

            return {
              id: details.id,
              name: pokemon.name,
              image: details.sprites?.front_default,
              imageBack: details.sprites?.back_default,
              types: details.types?.[0]?.type.name
            }
          })
        )
        const successful = detailedPokemons.filter(result => result.status === "fulfilled")
          .map(result => result.value)

        // console.log(JSON.stringify(successful, null, 2));

        setPokemons(successful);
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
          <View key={pokemon.id} style={[
            styles.card,
            { backgroundColor: colorByType[pokemon.types] + 50 || colorByType.default },
          ]}>
            <Text style={styles.name}>{pokemon.name}</Text>
            <Text style={styles.type}>{pokemon.types}</Text>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={{ uri: pokemon.image }}
                style={{ width: 150, height: 150 }}
              />
              <Image
                source={{ uri: pokemon.imageBack }}
                style={{ width: 150, height: 150 }}
              />
            </View>
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
    padding: 16, // Numeric value, no quotes
  },
  card: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 16,
    // elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  name: {
    fontSize: 28,
    textTransform: 'capitalize',
    fontWeight: "bold",
    textAlign: "center"
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: 'capitalize',
    color: 'gray',
    textAlign: 'center'
  }
});