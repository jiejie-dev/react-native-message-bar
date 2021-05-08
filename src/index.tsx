import * as React from 'react'

import MessageBarComponent from './MessageBar'
import MessageBarManager from './MessageBarManager'
import { ComponentProps } from './utils'

const MessageBar = (props: ComponentProps<typeof MessageBarManager>) => (
  <MessageBarComponent {...props} />
)

export default {
  MessageBar,
  MessageBarManager,
}
