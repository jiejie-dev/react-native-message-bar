import MessageBar, { MessageBarProps } from './MessageBar'
import { ComponentProps } from './utils'

var _currentMessageBarAlert: MessageBar | null = null

export const registerMessageBar = (messageBar: MessageBar) => {
  _currentMessageBarAlert = messageBar
}

export const unregisterMessageBar = () => {
  _currentMessageBarAlert = null
}

export const showAlert = (newState?: ComponentProps<typeof MessageBar>) => {
  if (_currentMessageBarAlert === null) {
    return
  }

  // Hide the current alert
  hideAlert()

  // Get the current alert's duration to hide
  var durationToHide = _currentMessageBarAlert?.state.durationToHide

  setTimeout(() => {
    // Show the new alert if there is a new state, otherwise
    if (newState != null) {
      // Clear current state
      _currentMessageBarAlert?.setNewState({} as any)

      _currentMessageBarAlert?.setNewState(newState!)

      if (_currentMessageBarAlert?.notifyAlertHiddenCallback) {
        _currentMessageBarAlert!.notifyAlertHiddenCallback = undefined
      }

      setTimeout(() => {
        _currentMessageBarAlert?.showMessageBarAlert()
      }, 100)
    }
  }, durationToHide)
}

export const hideAlert = () => {
  if (_currentMessageBarAlert !== null) {
    _currentMessageBarAlert?.hideMessageBarAlert()
  }
}

export default {
  registerMessageBar,
  unregisterMessageBar,
  showAlert,
  hideAlert,
}
