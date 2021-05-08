import * as React from 'react'
import { Button, StatusBar, View } from 'react-native'
import { MessageBar, MessageBarManager } from 'react-native-message-bar'

const App = () => {
  const msgBarRef = React.useRef<MessageBar | null>(null)
  React.useEffect(() => {
    setTimeout(() => {
      if (msgBarRef.current) {
        MessageBarManager.registerMessageBar(msgBarRef.current)
      }
    }, 100)

    return function () {
      MessageBarManager.unregisterMessageBar()
    }
  }, [])

  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <StatusBar
        backgroundColor='transparent'
        translucent
        barStyle='dark-content'
      />
      <Button
        title='   显示   '
        onPress={() => {
          MessageBarManager.showAlert({
            title: 'Alert triggered from child component',
            message:
              "You can show an alert which is located on its parent's page. You can then declare only one MessageBar. This is useful to fix absolute position in child component",
            avatar: null,
            alertType: 'success',
          })
        }}
      />

      <MessageBar ref={msgBarRef} />
    </View>
  )
}

export default App
