import React, { useState, useEffect } from 'react';
import assets from '/assets/questions.csv'
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { readRemoteFile } from 'react-papaparse';

export default function RandomSelectionGame() {
  const [results, setResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [correctItem, setCorrectItem] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('transparent');

  useEffect(() => {
    readRemoteFile(assets, {
      complete: (results) => {
        // Extract the data you need from the CSV file
        const filteredData = results.data.filter((item) => {
          return item.length === 2;
        });

        console.log(filteredData)
  
        const data = filteredData.map((item, index) => ({
          id: index + 1, // You can use a unique identifier here
          answer: item[0],
          text: item[1],
        }));

        console.log(data)
  
        setResults(data);
      },
    });
  }, []);

  useEffect(() => {
    resetQuestion()
  }, [results]);

  const handleButtonClick = (selectedItem) => {
    if (selectedItem === correctItem) {
      setBackgroundColor('green'); // Correct answer, set background color to green
      setTimeout(() => {
        setBackgroundColor('transparent'); // Reset background color after 1 second
        resetQuestion();
      }, 1000);
    } else {
      setBackgroundColor('red'); // Incorrect answer, set background color to red
      setTimeout(() => {
        setBackgroundColor('transparent'); // Reset background color after 1 second
      }, 1000);
    }
  };

  const resetQuestion = () => {
    if (results.length >= 3) {
      const randomIndices = [];
      while (randomIndices.length < 3) {
        const randomIndex = Math.floor(Math.random() * results.length);
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex);
        }
      }
  
      const newSelectedItems = randomIndices.map((index) => results[index]);
  
      setSelectedItems(newSelectedItems);
  
      const correctIndex = Math.floor(Math.random() * 3);
      setCorrectItem(newSelectedItems[correctIndex]);
    } else {
      // Handle the case where there are not enough results
      console.error("Not enough results to select from.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EMT Study</Text>
      <Text style={styles.questionText}>{correctItem ? correctItem.text : ''}</Text>
      {selectedItems.map((item) => (
        <Pressable
          key={item.id}
          style={[styles.button, { backgroundColor }]}
          onPress={() => handleButtonClick(item)}
        >
          <Text>{item.answer}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 18,
    marginVertical: 20,
    padding: 10,
  },
  button: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 5,
  },
});


