import {View, Text, Image, FlatList, StyleSheet, SafeAreaView} from "react-native";
import { data } from "../data/data";
import Card from "../components/Card";
import Header from "../components/Header";
import React from "react";

function ProfileScreen() {
    return (
        <SafeAreaView style={styles.head}>
            <Header
                headerText={"Gaben's Decree"}
                headerTextStyle={{
                    fontFamily: "MotivaSans-Bold",
                    fontSize: 18,
                    color: 'white',
                }}
            />
            <Image
                source={require('../images/gabe_newell_portrait_by_freddre_d4rnffi.png')}
                style={styles.image}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25262a",
        padding: 16,
    },
    loadingText: {
        color: "white",
        textAlign: "center",
        marginTop: 20,
    },
    head: {
        flex: 1,
        backgroundColor: "#16171a",
        padding: 16,
    },
    image: {
        width: "100%",
        height: undefined,
        aspectRatio: 1,
        resizeMode: "contain",
    }
});

export default ProfileScreen;