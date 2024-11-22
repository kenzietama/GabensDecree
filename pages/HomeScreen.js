import {useEffect, useState} from "react";
import {Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import axios from "axios";
import Header from "../components/Header";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {createStackNavigator} from "@react-navigation/stack";
import DetailsScreen from "../pages/DetailsScreen";

const Stack = createStackNavigator();

function HomeMainScreen({navigation}) {
    const [specials, setSpecials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortCriteria, setSortCriteria] = useState("discount_percent");

    useEffect(() => {
        async function fetchSpecials() {
            try {
                const response = await axios.get(
                    "https://store.steampowered.com/api/featuredcategories?cc=id"
                );
                setSpecials(response.data.specials.items); // Access `specials` object
                setLoading(false);
            } catch (error) {
                Alert.alert("Error", error.message);
                setLoading(false);
            }
        }

        fetchSpecials();
    }, []);

    const handleSort = () => {
        const nextCriteria = sortCriteria === "discount_percent" ? "final_price" : "discount_percent";
        setSortCriteria(nextCriteria);

        const sortedItems = [...specials].sort((a, b) => {
            if (nextCriteria === "discount_percent") {
                return b.discount_percent - a.discount_percent;
            }
            return a.final_price - b.final_price;
            });
        setSpecials(sortedItems);
    }

    const gotoDetails = (id) => {
        navigation.navigate("Detail", { id });
    }

    const expirationDate = (discount_expiration) => {
        return new Date(discount_expiration * 1000).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
    }

    const renderSpecialItem = ({ item }) => (
        <TouchableOpacity onPress={() => gotoDetails(item.id)}>
            <View style={styles.container}>
                <View style={styles.row_container}>
                    <View style={styles.col_container}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Image
                            source={{ uri: item.large_capsule_image }}
                            style={styles.image}
                        />
                        <Text style={styles.expired}>
                            {"Ends in: " + expirationDate(item.discount_expiration)}
                        </Text>
                    </View>
                    <View style={styles.col_container}>
                        <View style={styles.card}>
                            <Text style={styles.discount}>
                                {"-"}{item.discount_percent}{"%"}
                            </Text>
                            <View style={styles.col_container}>
                                <Text style={styles.original_price}>
                                        {"Rp"}{new Intl.NumberFormat('id-ID').format(item.original_price / 100)}
                                </Text>
                                <Text style={styles.final_price}>
                                    {"Rp"}{new Intl.NumberFormat('id-ID').format(item.final_price / 100)}
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
            <View style={{flexDirection: "row", marginBottom: 8, justifyContent: "space-between", alignItems: "center"}}>
                <Header
                    headerText={"Steam Specials"}
                    headerTextStyle={{
                        fontFamily: "MotivaSans-Bold"
                    }}
                />
                <TouchableOpacity onPress={handleSort} style={{marginTop: 16}}>
                    <MaterialIcons name={'sort'} size={24} color={"#e0e1e5"}/>
                </TouchableOpacity>
            </View>
            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : (
                <FlatList
                    data={specials}
                    renderItem={renderSpecialItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    head: {
        flex: 1,
        backgroundColor: "#16171a",
        padding: 16,
    },
    loadingText: {
        color: "white",
        textAlign: "center",
        marginTop: 20,
    },
    list: {
        paddingBottom: 50,
    },
    card: {
        padding: 16,
        // borderRadius: 8,
        alignItems: "center",
        flex: 1,
        // backgroundColor: "white"
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
    expired: {
        fontSize: 12,
        fontWeight: "600",
        color: "white",
        fontFamily: "MotivaSans-Regular"
    },
    final_price: {
        fontSize: 14,
        color: "lightgreen",
        marginTop: 4,
    },
    original_price: {
        fontSize: 14,
        color: "lightgray",
        marginTop: 4,
        textDecorationLine: "line-through",
    },
    discount: {
        fontSize: 14,
        color: "lightgreen",
        marginTop: 4,
        padding: 2,
        alignSelf: "flex-end",
        position: "absolute",
    }
});

export default function HomeScreen() {
    return (
        <Stack.Navigator
            initialRouteName="HomeMain"
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name="HomeMain" component={HomeMainScreen} />
            <Stack.Screen name="Detail" component={DetailsScreen} />
        </Stack.Navigator>
    );
};
