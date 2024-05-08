import * as React from "react"; 
import { Fragment } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler"; 
import Game from './src/components/Game';
export default function App() {
  return (
    <Fragment>
      <Game/>
    </Fragment>
  );
}

