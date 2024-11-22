import {View, Text, Image} from "react-native";

const Card = ({dataNama}) => {
    const imageUrl = dataNama.imageUrl
        ? dataNama.imageUrl
        : "https://avatars.githubusercontent.com/u/116475964?v=4";
    return (
        <View
            style={{
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    borderWidth: 2,
                    borderRadius: 8,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: 300,
                }}
            >
                <Image
                    source={{uri: imageUrl}}
                    style={{
                        width: 100,
                        height: 100,
                        borderRightWidth: 2,
                        borderBottomLeftRadius: 6,
                        borderTopLeftRadius: 6,
                        borderColor: "black",
                    }}
                />
                <View
                    style={{
                        flexDirection: "column",
                        marginLeft: 16,
                        justifyContent: "center",
                        maxWidth: 180,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "600",
                        }}
                    >
                        {dataNama.nama}
                    </Text>
                    <Text
                        style={{
                            fontWeight: "400",
                            color: "gray",
                        }}
                    >
                        {dataNama.nim}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default Card;