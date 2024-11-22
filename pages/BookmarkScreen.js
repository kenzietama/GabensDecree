import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';  // Import useFocusEffect
import DetailsScreen from './DetailsScreen';
import Header from "../components/Header";

const Stack = createStackNavigator();

function BookmarkScreenMain({ navigation }) {
    const [bookmarkedApps, setBookmarkedApps] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch the list of bookmarked app IDs from AsyncStorage
    const fetchBookmarkedApps = async () => {
        try {
            const bookmarked = await AsyncStorage.getItem('bookmarkedApps');
            const bookmarkedAppsList = bookmarked ? JSON.parse(bookmarked) : [];

            if (bookmarkedAppsList.length > 0) {
                setLoading(true);
                const appDetails = await Promise.all(
                    bookmarkedAppsList.map(async (id) => {
                        const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${id}&cc=id`);
                        return { id, details: response.data[id]?.data };
                    })
                );
                setBookmarkedApps(appDetails);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load bookmarked apps.');
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            // Fetch bookmarked apps when the screen comes into focus
            fetchBookmarkedApps();
        }, [])
    );

    const initialPrice = (price_overview) => {
        if (!price_overview) {
            return null;
        } else {
            if (price_overview.initial === price_overview.final) {
                return null;
            } else {
                return "Rp" + new Intl.NumberFormat('id-ID').format(price_overview.initial / 100);
            }
        }
    };

    const finalPrice = (price_overview) => {
        return !price_overview ? "Free" : "Rp" + new Intl.NumberFormat('id-ID').format(price_overview.final / 100);
    };

    const discount_percent = (price_overview) => {
        if (!price_overview) {
            return null;
        } else {
            if (price_overview.initial === price_overview.final) {
                return null;
            } else {
                return "-" + (100 - ((price_overview.final / price_overview.initial).toFixed(2) * 100)) + "%";
            }
        }
    };

    const gotoDetails = (id) => {
        navigation.navigate("Detail", { id });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => gotoDetails(item.id)}>
            <View style={styles.container}>
                <View style={styles.row_container}>
                    <View style={styles.col_container}>
                        <Text style={styles.title}>{item.details?.name}</Text>
                        <Image source={{ uri: item.details?.header_image }} style={styles.image} />
                    </View>
                    <View style={styles.col_container}>
                        <View style={styles.card}>
                            <Text style={styles.discount}>
                                {discount_percent(item.details?.price_overview)}
                            </Text>
                            <View style={styles.col_container}>
                                <Text style={styles.original_price}>
                                    {initialPrice(item.details?.price_overview)}
                                </Text>
                                <Text style={styles.final_price}>
                                    {finalPrice(item.details?.price_overview)}
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
                    headerText={"Bookmarked Games"}
                    headerTextStyle={{
                        fontFamily: "MotivaSans-Bold",
                        fontSize: 18,
                        color: 'white',
                    }}
                />
            </View>
            {/*<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>*/}
            {/*    <TextInput*/}
            {/*        style={styles.searchInput}*/}
            {/*        placeholder="Search..."*/}
            {/*        placeholderTextColor="#e0e1e5"*/}
            {/*        value={searchTerm}*/}
            {/*        onChangeText={setSearchTerm}*/}
            {/*        onSubmitEditing={handleSearch}*/}
            {/*    />*/}
            {/*    <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>*/}
            {/*        <MaterialIcons name="search" size={24} color="#e0e1e5" />*/}
            {/*    </TouchableOpacity>*/}
            {/*</View>*/}

            {/* Show Loading or List of Bookmarked Apps */}
            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : (
                <FlatList
                    data={bookmarkedApps}
                    renderItem={renderItem}
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
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
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

export default function BookmarkScreen() {
    return (
        <Stack.Navigator
            initialRouteName="Bookmarks"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Bookmarks" component={BookmarkScreenMain} />
            <Stack.Screen name="Detail" component={DetailsScreen} />
        </Stack.Navigator>
    );
};
