import { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, Alert, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import Header from "../components/Header";
import AsyncStorage from '@react-native-async-storage/async-storage';

function DetailsScreen({ route }) {
    const { id } = route.params; // Access the passed item id
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        async function fetchDetails() {
            try {
                const response = await axios.get(
                    `https://store.steampowered.com/api/appdetails?appids=${id}&cc=id`
                );
                setDetails(response.data);
                setLoading(false);
            } catch (error) {
                Alert.alert("Error", error.message);
                setLoading(false);
            }
        }

        async function checkBookmark() {
            const bookmarked = await AsyncStorage.getItem('bookmarkedApps');
            if (bookmarked) {
                const parsedBookmarked = JSON.parse(bookmarked);
                if (parsedBookmarked.includes(id)) {
                    setIsBookmarked(true);
                }
            }
        }

        fetchDetails();
        checkBookmark();
    }, [id]);

    const handleBookmark = async () => {
        try {
            const bookmarked = await AsyncStorage.getItem('bookmarkedApps');
            const bookmarkedApps = bookmarked ? JSON.parse(bookmarked) : [];

            if (isBookmarked) {
                // Remove from bookmarks
                const updatedBookmarkedApps = bookmarkedApps.filter((appId) => appId !== id);
                await AsyncStorage.setItem('bookmarkedApps', JSON.stringify(updatedBookmarkedApps));
                setIsBookmarked(false);
                Alert.alert("Removed from Bookmarks");
            } else {
                // Add to bookmarks
                bookmarkedApps.push(id);
                await AsyncStorage.setItem('bookmarkedApps', JSON.stringify(bookmarkedApps));
                setIsBookmarked(true);
                Alert.alert("Added to Bookmarks");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to bookmark the app");
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (!details || !details[id]?.success) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>No details available</Text>
            </SafeAreaView>
        );
    }

    const subs = details[id].data.package_groups[0]?.subs || []; // Safely access subs array

    const optionText = (option_text) => {
        const lastDashIndex = option_text.lastIndexOf('-');

        // If a dash exists, slice the string before it, otherwise return the whole string
        if (lastDashIndex !== -1) {
            return option_text.slice(0, lastDashIndex).trim(); // Trim spaces before and after the part before the dash
        } else {
            return option_text.trim(); // Return the whole string if no dash is found
        }
    }

    const renderSubItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.optionText}>{optionText(item.option_text)}</Text>
            <Text style={styles.price}>
                {"Price: Rp " +
                    new Intl.NumberFormat("id-ID").format(
                        item.price_in_cents_with_discount / 100
                    )}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header
                headerText={"Steam Specials"}
                headerTextStyle={{
                    fontFamily: "MotivaSans-Bold",
                }}
            />
            <Image
                source={{ uri: details[id].data.header_image }}
                style={styles.image}
            />
            <Text style={styles.title}>{details[id].data.name}</Text>
            <Text style={styles.text}>{details[id].data.short_description}</Text>

            {/* Bookmark Button */}
            <TouchableOpacity
                style={[styles.bookmarkButton, isBookmarked && styles.bookmarked]}
                onPress={handleBookmark}
            >
                <Text style={styles.bookmarkText}>
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                </Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>Available Packages:</Text>
            <FlatList
                data={subs}
                renderItem={renderSubItem}
                keyExtractor={(item) => item.packageid.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#16171a",
        paddingBottom: 48
    },
    image: {
        width: "100%",
        height: 200,
        marginBottom: 16,
        borderRadius: 8,
        resizeMode: "contain",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
        fontFamily: "MotivaSans-Regular",
    },
    text: {
        color: "white",
        fontFamily: "MotivaSans-Regular",
        textAlign: "justify",
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        color: "lightgray",
        marginBottom: 8,
    },
    card: {
        backgroundColor: "#25262a",
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
    },
    optionText: {
        color: "white",
        fontSize: 16,
        marginBottom: 4,
    },
    price: {
        color: "lightgreen",
        fontSize: 14,
    },
    listContainer: {
        paddingBottom: 16,
    },
    loadingText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
    },
    bookmarkButton: {
        backgroundColor: "#ff5a5f",
        padding: 12,
        borderRadius: 8,
        marginVertical: 16,
        alignItems: "center",
    },
    bookmarked: {
        backgroundColor: "#4caf50", // Green when bookmarked
    },
    bookmarkText: {
        color: "white",
        fontSize: 16,
    }
});

export default DetailsScreen;
