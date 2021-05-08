/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react'
import {
  Animated,
  ColorValue,
  Dimensions,
  Image,
  ImageStyle,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export type AlertType = 'success' | 'error' | 'warning' | 'info'
export type Position = 'top' | 'bottom'

export interface MessageBarProps {
  alertType?: AlertType
  position?: Position
  title?: string
  message?: string
  avatar?: any
  duration?: number
  shouldHideAfterDelay?: boolean
  shouldHideOnTap?: boolean
  onTapped?: () => void
  onShow?: () => void
  onHide?: () => void
  stylesheetInfo?: ViewStyle
  stylesheetSuccess?: ViewStyle
  stylesheetWarning?: ViewStyle
  stylesheetError?: ViewStyle
  stylesheetExtra?: ViewStyle
  durationToShow?: number
  durationToHide?: number
  viewTopOffset?:
    | string
    | number
    | Animated.Value
    | Animated.AnimatedInterpolation
    | undefined
  viewBottomOffset?:
    | string
    | number
    | Animated.Value
    | Animated.AnimatedInterpolation
    | undefined
  viewLeftOffset?:
    | string
    | number
    | Animated.Value
    | Animated.AnimatedInterpolation
    | undefined
  viewRightOffset?:
    | string
    | number
    | Animated.Value
    | Animated.AnimatedInterpolation
    | undefined
  viewTopInset?: number
  viewBottomInset?: number
  viewLeftInset?: number
  viewRightInset?: number
  titleNumberOfLines?: number
  messageNumberOfLines?: number
  titleStyle?: TextStyle
  messageStyle?: TextStyle
  avatarStyle?: ImageStyle
  animationType?: any
  backgroundColor?: ColorValue | string | undefined
  strokeColor?: ColorValue

  useNativeDriver?: boolean
}

const defaultProps = {
  // Default values, will be overridden
  backgroundColor: '#007bff', // default value : blue
  strokeColor: '#006acd', // default value : blue
  animationTypeTransform: 'SlideFromTop', // default value

  /* Cusomisation of the alert: Title, Message, Icon URL, Alert alertType (error, success, warning, info), Duration for Alert keep shown */
  title: 'title',
  message: 'message',
  avatar: null,
  alertType: 'info',
  duration: 3000,

  /* Hide setters */
  shouldHideAfterDelay: true,
  shouldHideOnTap: true,

  /* Callbacks method on Alert Tapped, on Alert Show, on Alert Hide */
  onTapped: () => {},
  onShow: () => {},
  onHide: () => {},

  /* Stylesheets */
  stylesheetInfo: {
    backgroundColor: '#007bff',
    strokeColor: '#006acd',
  }, // Default are blue colors
  stylesheetSuccess: {
    backgroundColor: 'darkgreen',
    strokeColor: '#b40000',
  }, // Default are Green colors
  stylesheetWarning: {
    backgroundColor: '#ff9c00',
    strokeColor: '#f29400',
  }, // Default are orange colors
  stylesheetError: {
    backgroundColor: '#ff3232',
    strokeColor: '#FF0000',
  }, // Default are red colors
  stylesheetExtra: {
    backgroundColor: '#007bff',
    strokeColor: '#006acd',
  }, // Default are blue colors, same as info

  /* Duration of the animation */
  durationToShow: 350,
  durationToHide: 350,

  /* Offset of the View, useful if you have a navigation bar or if you want the alert be shown below another component instead of the top of the screen */
  viewTopOffset: 0,
  viewBottomOffset: 0,
  viewLeftOffset: 0,
  viewRightOffset: 0,

  /* Inset of the view, useful if you want to apply a padding at your alert content */
  viewTopInset: 0,
  viewBottomInset: 0,
  viewLeftInset: 0,
  viewRightInset: 0,

  /* Number of Lines for Title and Message */
  titleNumberOfLines: 1,
  messageNumberOfLines: 2,

  /* Style for the text elements and the avatar */
  titleStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageStyle: { color: 'white', fontSize: 16 },
  avatarStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },

  /* Position of the alert and Animation Type the alert is shown */
  position: 'top',
  // animationType: props.animationType,
  useNativeDriver: false,
}

export default class MessageBar extends Component<
  MessageBarProps & typeof defaultProps,
  MessageBarProps
> {
  animatedValue: Animated.Value
  notifyAlertHiddenCallback?: () => void
  alertShown: boolean
  timeoutHide: null | ReturnType<typeof setTimeout>
  animationTypeTransform: Animated.AnimatedProps<ViewStyle>[]

  constructor(props: MessageBarProps & typeof defaultProps) {
    super(props)

    this.animatedValue = new Animated.Value(0)
    this.notifyAlertHiddenCallback = undefined
    this.alertShown = false
    this.timeoutHide = null
    this.animationTypeTransform = []

    this.state = this.getStateByProps(props)
  }

  componentWillReceiveProps(nextProps: MessageBarProps & typeof defaultProps) {
    this.setNewState(nextProps)
  }

  setNewState(state: MessageBarProps & typeof defaultProps) {
    // Set the new state, this is triggered when the props of this MessageBar changed
    this.setState(this.getStateByProps(state))

    // Apply the colors of the alert depending on its alertType
    this._applyAlertStylesheet(state.alertType)

    // Override the opposition style position regarding the state position in order to have the alert sticks that position
    this._changeOffsetByPosition(state.position)
  }

  getStateByProps(props: MessageBarProps) {
    return {
      // Default values, will be overridden
      backgroundColor: '#007bff', // default value : blue
      strokeColor: '#006acd', // default value : blue
      animationTypeTransform: 'SlideFromTop', // default value

      /* Cusomisation of the alert: Title, Message, Icon URL, Alert alertType (error, success, warning, info), Duration for Alert keep shown */
      title: props.title,
      message: props.message,
      avatar: props.avatar,
      alertType: props.alertType || 'info',
      duration: props.duration || 3000,

      /* Hide setters */
      shouldHideAfterDelay:
        props.shouldHideAfterDelay === undefined
          ? true
          : props.shouldHideAfterDelay,
      shouldHideOnTap:
        props.shouldHideOnTap === undefined ? true : props.shouldHideOnTap,

      /* Callbacks method on Alert Tapped, on Alert Show, on Alert Hide */
      onTapped: props.onTapped,
      onShow: props.onShow,
      onHide: props.onHide,

      /* Stylesheets */
      stylesheetInfo: props.stylesheetInfo || {
        backgroundColor: '#007bff',
        strokeColor: '#006acd',
      }, // Default are blue colors
      stylesheetSuccess: props.stylesheetSuccess || {
        backgroundColor: 'darkgreen',
        strokeColor: '#b40000',
      }, // Default are Green colors
      stylesheetWarning: props.stylesheetWarning || {
        backgroundColor: '#ff9c00',
        strokeColor: '#f29400',
      }, // Default are orange colors
      stylesheetError: props.stylesheetError || {
        backgroundColor: '#ff3232',
        strokeColor: '#FF0000',
      }, // Default are red colors
      stylesheetExtra: props.stylesheetExtra || {
        backgroundColor: '#007bff',
        strokeColor: '#006acd',
      }, // Default are blue colors, same as info

      /* Duration of the animation */
      durationToShow: props.durationToShow || 350,
      durationToHide: props.durationToHide || 350,

      /* Offset of the View, useful if you have a navigation bar or if you want the alert be shown below another component instead of the top of the screen */
      viewTopOffset: props.viewTopOffset || 0,
      viewBottomOffset: props.viewBottomOffset || 0,
      viewLeftOffset: props.viewLeftOffset || 0,
      viewRightOffset: props.viewRightOffset || 0,

      /* Inset of the view, useful if you want to apply a padding at your alert content */
      viewTopInset: props.viewTopInset || 0,
      viewBottomInset: props.viewBottomInset || 0,
      viewLeftInset: props.viewLeftInset || 0,
      viewRightInset: props.viewRightInset || 0,

      /* Number of Lines for Title and Message */
      titleNumberOfLines:
        props.titleNumberOfLines === undefined ? 1 : props.titleNumberOfLines,
      messageNumberOfLines:
        props.messageNumberOfLines === undefined
          ? 2
          : props.messageNumberOfLines,

      /* Style for the text elements and the avatar */
      titleStyle: props.titleStyle || {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      },
      messageStyle: props.messageStyle || { color: 'white', fontSize: 16 },
      avatarStyle: props.avatarStyle || {
        height: 40,
        width: 40,
        borderRadius: 20,
      },

      /* Position of the alert and Animation Type the alert is shown */
      position: props.position || 'top',
      animationType: props.animationType,
      useNativeDriver: false,
    }
  }

  /*
   * Show the alert
   */
  showMessageBarAlert() {
    // If an alert is already shonw or doesn't have a title or a message, do nothing
    if (
      this.alertShown ||
      (this.state.title == null && this.state.message == null)
    ) {
      return
    }

    // Set the data of the alert in the state
    this.alertShown = true

    // Display the alert by animating it from the top of the screen
    // Auto-Hide it after a delay set in the state
    Animated.timing(this.animatedValue, {
      useNativeDriver: this.props.useNativeDriver,
      toValue: 1,
      duration: this.state.durationToShow,
    }).start(() => this._showMessageBarAlertComplete())
  }

  /*
   * Hide the alert after a delay, typically used for auto-hidding
   */
  _showMessageBarAlertComplete() {
    // Execute onShow callback if any
    this._onShow()

    // If the duration is null, do not hide the
    if (this.state.shouldHideAfterDelay) {
      this.timeoutHide = setTimeout(() => {
        this.hideMessageBarAlert()
      }, this.state.duration)
    }
  }

  /*
   * Return true if the MessageBar is currently displayed, otherwise false
   */
  isMessageBarShown() {
    return this.alertShown
  }

  /*
   * Hide the alert, typically used when user tap the alert
   */
  hideMessageBarAlert() {
    // Hide the alert after a delay set in the state only if the alert is still visible
    if (!this.alertShown) {
      return
    }

    this.timeoutHide && clearTimeout(this.timeoutHide)

    // Animate the alert to hide it to the top of the screen
    Animated.timing(this.animatedValue, {
      useNativeDriver: this.props.useNativeDriver,
      toValue: 0,
      duration: this.state.durationToHide,
    }).start(() => this._hideMessageBarAlertComplete())
  }

  _hideMessageBarAlertComplete() {
    // The alert is not shown anymore
    this.alertShown = false

    this._notifyAlertHidden()

    // Execute onHide callback if any
    this._onHide()
  }

  /*
   * Callback executed to tell the observer the alert is hidden
   */
  _notifyAlertHidden() {
    if (this.notifyAlertHiddenCallback) {
      this.notifyAlertHiddenCallback()
    }
  }

  /*
   * Callback executed when the user tap the alert
   */
  _alertTapped() {
    // Hide the alert
    if (this.state.shouldHideOnTap) {
      this.hideMessageBarAlert()
    }

    // Execute the callback passed in parameter
    if (this.state.onTapped) {
      this.state.onTapped()
    }
  }

  /*
   * Callback executed when alert is shown
   */
  _onShow() {
    if (this.state.onShow) {
      this.state.onShow()
    }
  }

  /*
   * Callback executed when alert is hidden
   */
  _onHide() {
    if (this.state.onHide) {
      this.state.onHide()
    }
  }

  /*
   * Change the background color and the line stroke color depending on the alertType
   * If the alertType is not recognized, the 'info' one (blue colors) is selected for you
   */
  _applyAlertStylesheet(alertType: AlertType) {
    // Set the Background color and the line stroke color of the alert depending on its alertType
    // Set to blue-info if no alertType or if the alertType is not recognized

    let backgroundColor
    let strokeColor

    switch (alertType) {
      case 'success':
        backgroundColor = this.state.stylesheetSuccess?.backgroundColor
        strokeColor = (this.state.stylesheetSuccess as any).strokeColor
        break
      case 'error':
        backgroundColor = this.state.stylesheetError?.backgroundColor
        strokeColor = (this.state.stylesheetError as any).strokeColor
        break
      case 'warning':
        backgroundColor = this.state.stylesheetWarning?.backgroundColor
        strokeColor = (this.state.stylesheetWarning as any).strokeColor
        break
      case 'info':
        backgroundColor = this.state.stylesheetInfo?.backgroundColor
        strokeColor = (this.state.stylesheetInfo as any).strokeColor
        break
      default:
        backgroundColor = this.state.stylesheetExtra?.backgroundColor
        strokeColor = (this.state.stylesheetExtra as any).strokeColor
        break
    }

    this.setState({
      backgroundColor: backgroundColor,
      strokeColor: strokeColor,
    })
  }

  /*
   * Change view<Position>Offset property depending on the state position
   */
  _changeOffsetByPosition(position: Position) {
    switch (position) {
      case 'top':
        this.setState({
          viewBottomOffset: undefined,
        })
        break
      case 'bottom':
        this.setState({
          viewTopOffset: undefined,
        })
        break
      default:
        this.setState({
          viewBottomOffset: undefined,
        })
        break
    }
  }

  /*
   * Set the animation transformation depending on the chosen animationType, or depending on the state's position if animationType is not overridden
   */
  _apllyAnimationTypeTransformation() {
    let position = this.state.position
    let animationType = this.state.animationType

    if (animationType === undefined) {
      if (position === 'bottom') {
        animationType = 'SlideFromBottom'
      } else {
        // Top by default
        animationType = 'SlideFromTop'
      }
    }

    switch (animationType) {
      case 'SlideFromTop':
        var animationY = this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-windowHeight, 0],
        })
        this.animationTypeTransform = [{ translateY: animationY }]
        break
      case 'SlideFromBottom':
        var animationY = this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [windowHeight, 0],
        })
        this.animationTypeTransform = [{ translateY: animationY }]
        break
      case 'SlideFromLeft':
        var animationX = this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-windowWidth, 0],
        })
        this.animationTypeTransform = [{ translateX: animationX }]
        break
      case 'SlideFromRight':
        var animationX = this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [windowWidth, 0],
        })
        this.animationTypeTransform = [{ translateX: animationX }]
        break
      default:
        var animationY = this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-windowHeight, 0],
        })
        this.animationTypeTransform = [{ translateY: animationY }]
        break
    }
  }

  /*
   * Alert Rendering Methods
   */

  render() {
    // Set the animation transformation depending on the chosen animationType, or depending on the state's position if animationType is not overridden
    this._apllyAnimationTypeTransformation()

    return (
      <Animated.View
        style={{
          transform: this.animationTypeTransform as any,
          backgroundColor: this.state.backgroundColor,
          borderColor: this.state.strokeColor,
          borderBottomWidth: 1,
          position: 'absolute',
          top: this.state.viewTopOffset,
          bottom: this.state.viewBottomOffset,
          left: this.state.viewLeftOffset,
          right: this.state.viewRightOffset,
          paddingTop: this.state.viewTopInset,
          paddingBottom: this.state.viewBottomInset,
          paddingLeft: this.state.viewLeftInset,
          paddingRight: this.state.viewRightInset,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this._alertTapped()
          }}
          style={{ flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
              padding: 10,
            }}
          >
            {this.renderImage()}
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignSelf: 'stretch',
                justifyContent: 'center',
                marginLeft: 10,
              }}
            >
              {this.renderTitle()}
              {this.renderMessage()}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  renderImage() {
    if (this.state.avatar != null) {
      var imageSource
      let uri = this.state.avatar
      if (typeof uri === 'string' && uri.match(/^https?:/)) {
        // this is a network file
        imageSource = { uri: this.state.avatar }
      } else {
        // this is a local file : require('<path/to/my/local/image.extension>')
        imageSource = this.state.avatar
      }

      return <Image source={imageSource} style={this.state.avatarStyle} />
    }
  }

  renderTitle() {
    if (this.state.title != null) {
      return (
        <Text
          numberOfLines={this.state.titleNumberOfLines}
          style={this.state.titleStyle}
        >
          {this.state.title}
        </Text>
      )
    }
  }

  renderMessage() {
    if (this.state.message != null) {
      return (
        <Text
          numberOfLines={this.state.messageNumberOfLines}
          style={this.state.messageStyle}
        >
          {this.state.message}
        </Text>
      )
    }
  }
}

module.exports = MessageBar
