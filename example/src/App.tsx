import React, { useEffect } from 'react'
import RNMessageBarModule, { Counter } from 'react-native-message-bar'

const App = () => {
  useEffect(() => {
    console.log(RNMessageBarModule)
  })

  return <Counter />
}

export default App
