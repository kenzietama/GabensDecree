import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HomeScreen from "./pages/HomeScreen";
import ProfileScreen from "./pages/ProfileScreen";
import BookmarkScreen from "./pages/BookmarkScreen";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import {useState} from "react";
import SearchScreen from "./pages/SearchScreen";

const bottomTabNavigator = createBottomTabNavigator();

const loadFonts = () => {
    return Font.loadAsync({
        "MotivaSans-Regular": require("./assets/fonts/MotivaSansRegular.woff.ttf"),
        "MotivaSans-Thin": require("./assets/fonts/MotivaSansThin.ttf"),
        "MotivaSans-Bold": require("./assets/fonts/MotivaSansBold.woff.ttf"),
        "MotivaSans-ExtraBold": require("./assets/fonts/MotivaSansExtraBold.ttf"),
        "MotivaSans-Light": require("./assets/fonts/MotivaSansLight.woff.ttf"),
        "MotivaSans-Black": require("./assets/fonts/MotivaSansBlack.woff.ttf"),
        "MotivaSans-Medium": require("./assets/fonts/MotivaSansMedium.woff.ttf"),
    })
}

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false)

    if (!fontsLoaded) {
        return (
            <AppLoading
                startAsync={loadFonts}
                onFinish={() => setFontsLoaded(true)}
                onError={console.warn}
            />
        )
    }

    return (
        <NavigationContainer>
            <bottomTabNavigator.Navigator
                initialRouteName="Home"
                screenOptions={({route}) => ({
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#25262a",
                        height: 56,
                        borderColor: "#25262a",
                    },
                    tabBarItemStyle: {
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 12
                    },
                    tabBarIcon: ({focused, color, size}) =>  {
                        let iconName;

                        if (route.name === "Home") {
                            iconName = "discount";
                            color = focused ? "#24a1f4" : "#e0e1e5";
                        } else if (route.name === "Bookmark") {
                            iconName = "bookmark";
                            color = focused ? "#24a1f4" : "#e0e1e5";
                        } else if (route.name === "Search") {
                            iconName = "search";
                            color = focused ? "#24a1f4" : "#e0e1e5";
                        } else if (route.name === "Profile") {
                            iconName = "person";
                            color = focused ? "#24a1f4" : "#e0e1e5";
                        }

                        return <MaterialIcons name={iconName} size={24} color={color} />
                    },
                    headerShown: false,
                })}
             id={1}>
                <bottomTabNavigator.Screen name="Home" component={HomeScreen}/>
                <bottomTabNavigator.Screen name="Search" component={SearchScreen}/>
                <bottomTabNavigator.Screen name="Bookmark" component={BookmarkScreen}/>
                <bottomTabNavigator.Screen name="Profile" component={ProfileScreen}/>
            </bottomTabNavigator.Navigator>
        </NavigationContainer>
    );
}





