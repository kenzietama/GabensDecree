import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {createStackNavigator} from "@react-navigation/stack";
import DetailsScreen from "./DetailsScreen";
import Header from "../components/Header";

const Stack = createStackNavigator();

function SearchScreenMain({ navigation }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);

    useEffect(() => {
        handleSearch();
        setSearchTerm('')
    }, []);
    // Handle the search input
    const handleSearch = async () => {
        // setSearchTerm("Dota")
        // if (searchTerm.trim() === '') return;  // Don't search if the term is empty

        setLoading(true);
        try {
            const response = await axios.get(`https://store.steampowered.com/api/storesearch?term=${searchTerm}&cc=id`);
            const results = response.data.items;

            setSearchResults(results);
            setLoading(false);

            // Add search term to history (without duplicates)
            setSearchHistory(prevHistory => {
                const updatedHistory = [...prevHistory];
                if (!updatedHistory.includes(searchTerm)) {
                    updatedHistory.push(searchTerm);
                }
                return updatedHistory;
            });
        } catch (error) {
            Alert.alert('Error', error.message);
            setLoading(false);
        }
    };

    const initialPrice = (price) => {
        if(!price) {
            return null;
        } else {
            if(price.initial === price.final) {
                return null;
            } else {
                return "Rp" + new Intl.NumberFormat('id-ID').format(price.initial / 100);
            }
        }
    }

    const finalPrice = (price) => {
        return !price ? "Free" : "Rp" + new Intl.NumberFormat('id-ID').format(price.final / 100);
    }

    const discount_percent = (price) => {
        if(!price) {
            return null;
        } else {
            if(price.initial === price.final) {
                return null;
            } else {
                return "-" + (100 - ((price.final / price.initial).toFixed(2) * 100)) + "%"
            }
        }
    }

    const gotoDetails = (id) => {
        navigation.navigate("Detail", { id });
    }

    // Display each search result item
    const renderSearchItem = ({ item }) => (
        <TouchableOpacity onPress={() => gotoDetails(item.id)}>
            <View style={styles.container}>
                <View style={styles.row_container}>
                    <View style={styles.col_container}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Image source={{ uri: item.tiny_image }} style={styles.image} />
                    </View>
                    <View style={styles.col_container}>
                        <View style={styles.card}>
                            <Text style={styles.discount}>
                                {discount_percent(item.price)}
                            </Text>
                            <View style={styles.col_container}>
                                <Text style={styles.original_price}>
                                    {/*{!item.price ? " " : "Rp" + new Intl.NumberFormat('id-ID').format(item.price.initial / 100) }*/}
                                    {initialPrice(item.price)}
                                </Text>
                                <Text style={styles.final_price}>
                                    {/*{!item.price ? "Free" : "Rp" + new Intl.NumberFormat('id-ID').format(item.price.final / 100) }*/}
                                    {finalPrice(item.price)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.head}>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <Header
                    headerText={"Search Games"}
                    headerTextStyle={{
                        fontFamily: "MotivaSans-Bold",
                        fontSize: 18,
                        color: 'white',
                    }}
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    placeholderTextColor="#e0e1e5"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                    <MaterialIcons name="search" size={24} color="#e0e1e5" />
                </TouchableOpacity>
            </View>



            {/*/!* Display Search History *!/*/}
            {/*{searchHistory.length > 0 && (*/}
            {/*    <View style={styles.historyContainer}>*/}
            {/*        <Text style={styles.historyTitle}>Search History</Text>*/}
            {/*        <FlatList*/}
            {/*            data={searchHistory}*/}
            {/*            renderItem={({ item }) => (*/}
            {/*                <TouchableOpacity onPress={() => { setSearchTerm(item); handleSearch(); }}>*/}
            {/*                    <Text style={styles.historyItem}>{item}</Text>*/}
            {/*                </TouchableOpacity>*/}
            {/*            )}*/}
            {/*            keyExtractor={(item, index) => index.toString()}*/}
            {/*        />*/}
            {/*    </View>*/}
            {/*)}*/}

            {/* Show Results */}
            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : (
                <FlatList
                    data={searchResults}
                    renderItem={renderSearchItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    head: {
        flex: 1,
        backgroundColor: "#16171a",
        padding: 16,
    },
    searchInput: {
        backgroundColor: '#25262a',
        color: 'white',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        flex: 1,
    },
    searchButton: {
        padding: 8,
        paddingTop: 20,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    historyContainer: {
        marginTop: 16,
        backgroundColor: '#282c34',
        padding: 12,
        borderRadius: 8,
    },
    historyTitle: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    historyItem: {
        color: '#e0e1e5',
        paddingVertical: 4,
    },
    container: {
        backgroundColor: "#282c34",
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        alignItems: "center",
    },
    col_container: {
        flexDirection: "column",
        flex: 1,
    },
    row_container: {
        flexDirection: "row",
        flex: 1
    },
    image: {
        width: 200,
        height: 100,
        marginBottom: 4,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        color: "white",
        fontFamily: "MotivaSans-Regular",
        paddingBottom: 2
    },
    card: {
        padding: 16,
        alignItems: "center",
    },
    discount: {
        fontSize: 14,
        color: "lightgreen",
        marginTop: 4,
        padding: 2,
        alignSelf: "flex-end",
        position: "absolute",
    },
    original_price: {
        fontSize: 14,
        color: "lightgray",
        marginTop: 4,
        textDecorationLine: "line-through",
    },
    final_price: {
        fontSize: 14,
        color: "lightgreen",
        marginTop: 4,
    },
    loadingText: {
        color: "white",
        textAlign: "center",
        marginTop: 20,
    },
    list: {
        paddingBottom: 50,
    },
});

export default function SearchScreen() {
    return (
        <Stack.Navigator
            initialRouteName="Search"
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name="Search" component={SearchScreenMain} />
            <Stack.Screen name="Detail" component={DetailsScreen} />
        </Stack.Navigator>
    );
};
