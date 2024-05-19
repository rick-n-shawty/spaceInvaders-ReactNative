import * as React from "react"; 
import { Fragment } from "react";
import * as fonts from "expo-font"; 
import { useFonts } from "expo-font";

import Game from './src/components/Game';


export default function App() {
  const [fontsLoaded] = useFonts({
    'pixelFontRegular': require('./assets/fonts/PixelifySans-Regular.ttf'),
    'pixelFontMedium': require('./assets/fonts/PixelifySans-Medium.ttf'),
    'pixelFontBold': require('./assets/fonts/PixelifySans-Bold.ttf')
  })
  if(fontsLoaded){
    return (
      <Fragment>
        <Game/>
      </Fragment>
    );
  }
}

