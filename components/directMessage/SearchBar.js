import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import SearchSvg from '../../svg/search';

const SearchBar = ({ onSearch }) => (
  <View style={styles.container}>
    <View style={styles.inputView}>
      <TextInput
        style={styles.input}
        placeholder={'Search Message...'}
        placeholderTextColor="rgba(255, 159, 28, 0.50)"
        onChange={(e) => onSearch(e.nativeEvent.text)}
      />
      <SearchSvg style={styles.searchSvg} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  inputView: {
    borderWidth: 2,
    borderColor: "#FF9F1C",
    borderRadius: 10,
    paddingVertical: 5,
    width: "90%",
    flexDirection: 'row',
  },
  input: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: "90%",
  },
  searchSvg: {
    alignSelf: "flex-end",
    right: 5,
  },
});

export default SearchBar;
