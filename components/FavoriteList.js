import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, Button, TouchableOpacity, StyleSheet, FlatList, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import remove from "../assets/bin.png";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function FavoriteList() {
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    storeListInStorage();
  }, [favoriteItems]);

  useFocusEffect(
    React.useCallback(() => {
      retrieveFavoriteItems();
    }, [])
  );

  const retrieveFavoriteItems = async () => {
    try {
      let storedItems
      if (favoriteItems.length === 0) {
        storedItems = await AsyncStorage.getItem('favorList');
      }

      if (storedItems !== null && storedItems !== undefined) {
        let parsedItems;
        try {
          parsedItems = JSON.parse(storedItems);
        } catch (error) {
          console.log('Error parsing favorite items:', error);
          return;
        }
        setFavoriteItems(parsedItems);
      }
    } catch (error) {
      console.log('Error retrieving favorite items from storage:', error);
    }
  };

  const storeListInStorage = async () => {
    try {
      let storedList
      if (favoriteItems.length !== 0) {
        // console.log(favoriteItems !== null);
        storedList = favoriteItems
      }
      if (storedList !== null && storedList !== undefined) {
        await AsyncStorage.setItem('favorList', JSON.stringify(storedList));
      } else {
        console.log(storedList);
      }
    } catch (error) {
      console.log('Error retrieving list from storage:', error);
    }
  };


  const renderItem = ({ item }) => {
    if (!item.favor) {
      return null;
    }

    return (
      <Item id={item.id} name={item.name} image={item.image} price={item.price} favor={item.favor} />
    )
  }

  const removeItem = (id, name) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            const updatedList = favoriteItems.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  favor: !item.favor,
                };
              }
              return item;
            });
            setFavoriteItems(updatedList);
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const removeAll = () => {
    Alert.alert(
      'Remove All',
      'Are you sure you want to remove all items?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            const updatedList = favoriteItems.map((item) => ({
              ...item,
              favor: false
            }));
            setFavoriteItems(updatedList);
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  }

  const checkHaveFavor = () => {
    let check = true
    favoriteItems.map((item, key) => {
      if (item.favor) {
        check = false
      }
    })
    return check
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
            removeItem(id, name)
          }}
        >
          <Image
            style={styles.itemImage}
            source={remove}
          />
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
        data={favoriteItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}></FlatList>
        {console.log(checkHaveFavor())}
      {checkHaveFavor() ?
        <Button
          style={styles.button}
          title='Remove all'
          onPress={() => {
            removeAll()
          }}
        >
        </Button> : ""
      }

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
    width: WIDTH * 0.06,
    height: HEIGHT * 0.03,
    right: 35,
    top: 10,
  },
  button: {
    backgroundColor: "rgb(36,171,112)"
  }
});
