import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import emptyHeart from "../assets/emptyHeart.png"
import fullHeart from "../assets/fullHeart.png"

const menuItemsToDisplay = [
    { name: 'Aerangis', image: require("../assets/picture/Aerangis_Orchids.jpg"), id: '1A', price: 10, favor: true },
    { name: 'Ascocenda', image: require("../assets/picture/Ascocenda_Orchids.jpg"), id: '2B', price: 10, favor: false },
    { name: 'Brassavola', image: require("../assets/picture/Brassavola_Orchids.jpg"), id: '3C', price: 10, favor: false },
    { name: 'Brassia', image: require("../assets/picture/Brassia_Orchids.jpg"), id: '4D', price: 10, favor: false },
    { name: 'Catasetum', image: require("../assets/picture/Catasetum_Orchid.jpg"), id: '5E', price: 10, favor: false },
    { name: 'Cattleya', image: require("../assets/picture/Cattleya_Orchid.jpg"), id: '6F', price: 10, favor: false },
    { name: 'Cymbidium', image: require("../assets/picture/Cymbidium_Orchid.jpg"), id: '7G', price: 10, favor: false },
    { name: 'Dendrobium', image: require("../assets/picture/Dendrobium_Orchids.jpg"), id: '8H', price: 10, favor: false },
    { name: 'Encyclia', image: require("../assets/picture/Encyclia_Orchids.jpg"), id: '9I', price: 10, favor: false },
    { name: 'Epidendrum', image: require("../assets/picture/Epidendrum_Orchids.jpg"), id: '10J', price: 10, favor: false },
];

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function MenuList() {
    const [list, setList] = useState(menuItemsToDisplay)
    const isFirstRender = React.useRef(true);

    useEffect(() => {
        storeListInStorage();
    }, [list]);

    useFocusEffect(
        React.useCallback(() => {
            if (isFirstRender.current) {
                isFirstRender.current = false;
            } else {
                setUpListItems();
            }
        }, [])
    );

    const setUpListItems = async () => {
        try {
            const storedItems = await AsyncStorage.getItem('favorList');

            if (storedItems !== null) {
                const parsedItems = JSON.parse(storedItems);
                setList(parsedItems);
            }
        } catch (error) {
            console.log('Error retrieving favorite items from storage:', error);
        }
    };

    const storeListInStorage = async () => {
        try {
            const storedList = list
            if (storedList !== null) {
                await AsyncStorage.setItem('favorList', JSON.stringify(storedList));
            } else {
                console.log(storedList + " is null");
            }
        } catch (error) {
            console.log('Error retrieving list from storage:', error);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <Item id={item.id} name={item.name} image={item.image} price={item.price} favor={item.favor} />
        )
    }

    const adjustFavor = (id) => {
        const updatedList = list.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    favor: !item.favor
                };
            }
            return item;
        });
        setList(updatedList);
    }

    const Item = ({ id, name, image, price, favor }) => (
        <View style={styles.innerContainer}>
            <Image
                style={styles.image}
                source={image}
            />
            <View style={styles.right}>
                <TouchableOpacity
                    onPress={() => {
                        adjustFavor(id)
                    }}
                >
                    {favor ?
                        <Image
                            style={styles.itemImage}
                            source={fullHeart}
                        />
                        :
                        <Image
                            style={styles.itemImage}
                            source={emptyHeart}
                        />
                    }
                </TouchableOpacity>
                <View style={styles.itemInfor}>
                    <Text style={styles.itemText}>{name}</Text>
                    <Text style={styles.itemPrice}>{price.toFixed(2)} $</Text>
                </View>

            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={list}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}></FlatList>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        width: WIDTH * 0.9,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 15,
        marginHorizontal: WIDTH * 0.05,
        marginVertical: 5,
        flexDirection: 'row',
        backgroundColor: "rgb(36,171,112)",
        // shadowColor: "rgb(0,0,0)",
        // shadowOffset: { width: 1, height: 1},
        elevation: 15
    },
    right: {
        width: WIDTH * 0.5,
    },
    itemInfor: {
        position: 'absolute',
        top: 65,
    },
    itemText: {
        fontSize: 30,
        fontWeight: 700,
        // width: WIDTH * 0.3,
        marginHorizontal: 10,
        color: '#fff',
    },
    itemPrice: {
        fontSize: 20,
        width: WIDTH * 0.3,
        marginHorizontal: 10,
        marginVertical: HEIGHT * 0.01,
        color: '#fff',
    },
    image: {
        width: WIDTH * 0.4,
        height: HEIGHT * 0.2,
        borderRadius: 15,
    },
    itemImage: {
        position: "absolute",
        width: WIDTH * 0.1,
        height: HEIGHT * 0.05,
        right: 25,
        top: 10,
    }
});