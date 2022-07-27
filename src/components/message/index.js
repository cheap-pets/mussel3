import { reactive } from 'vue'

import lang from '../../lang'
import MessageBox from './message-box.vue'
import Notifier from './notifier.vue'

import { delay } from '../../utils/timer'
import { isString } from '../../utils/type'
import { renderComponent } from '../../utils/vue'

const Buttons = {
  OK: {
    caption: lang.Button.OK
  },
  CANCEL: {
    caption: lang.Button.CANCEL,
    'button-style': 'text'
  },
  YES: {
    caption: lang.Button.YES
  },
  NO: {
    caption: lang.Button.NO,
    'button-style': 'text'
  }
}

const MessageTypes = {
  ALERT: {
    icon: 'circleAlert',
    title: lang.Message.ALERT,
    buttons: ['OK']
  },
  SUCCESS: {
    icon: 'circleCheck',
    title: lang.Message.SUCCESS,
    buttons: ['OK']
  },
  CONFIRM: {
    icon: 'circleAlert',
    title: lang.Message.CONFIRM,
    buttons: ['CANCEL', 'OK']
  },
  ERROR: {
    icon: 'circleX',
    title: lang.Message.ERROR,
    buttons: ['OK'],
    danger: true
  },
  WARN: {
    icon: 'circleAlert',
    title: lang.Message.WARN,
    buttons: ['CANCEL', 'OK'],
    danger: true
  }
}

function pluginMessageDialog (app) {
  function showMessage (options) {
    const type = (options.type || 'ALERT').toUpperCase()

    options = {
      ...MessageTypes[type],
      ...isString(options) ? { message: options } : options
    }

    return new Promise(resolve => {
      let dispose

      const buttons = (options.buttons || ['OK']).map(el => {
        const isPrimary = ['OK', 'YES'].includes(el)

        return isString(el)
          ? Object.assign(
            {
              primary: !options.danger && isPrimary ? '' : null,
              danger: options.danger && isPrimary ? '' : null
            },
            Buttons[el] || { caption: el },
            {
              raw: el
            }
          )
          : el
      })

      const callback = btn => {
        options.callback?.(btn)
        resolve(btn)

        delay(300).then(() => {
          dispose?.()
          dispose = undefined
        })
      }

      const { icon, title, message } = options

      dispose = renderComponent({
        appContext: app._context,
        container: app._container,
        component: MessageBox,
        props: { type, icon, title, message, buttons, callback }
      })
    })
  }

  function alert (message, callback) {
    return showMessage({
      type: 'alert',
      message,
      callback
    })
  }

  function confirm (message, callback) {
    return showMessage({
      type: 'confirm',
      message,
      callback
    })
  }

  function error (message, callback) {
    return showMessage({
      type: 'error',
      message,
      callback
    })
  }

  function warn (message, callback) {
    return showMessage({
      type: 'warn',
      message,
      callback
    })
  }

  return {
    showMessage,
    alert,
    confirm,
    error,
    warn
  }
}

function pluginNotifier (app) {
  const notifyMessages = reactive([])

  let counter = 0
  let exist

  function dismissNotifier (id) {
    const idx = notifyMessages.findIndex(el => el.id === id)

    if (idx !== -1) notifyMessages.splice(idx, 1)
  }

  function notify (options) {
    options = isString(options)
      ? { message: options }
      : options

    const type =
      ['alert', 'error', 'warn', 'success'].includes(options.type)
        ? options.type
        : 'alert'

    const defaultOption = MessageTypes[type.toUpperCase()]

    const {
      title = defaultOption.title,
      message,
      callback,
      detail,
      duration = 3000
    } = options

    if (!message) return

    exist = exist || !!renderComponent({
      appContext: app._context,
      container: app._container,
      component: Notifier,
      props: { messages: notifyMessages }
    })

    const id = ++counter

    notifyMessages.unshift({
      id,
      type,
      title,
      message,
      callback,
      detail,
      icon: defaultOption.icon
    })

    setTimeout(() => dismissNotifier(id), duration)
  }

  return {
    notify
  }
}

export default function install (app) {
  app.config.globalProperties.$mussel.messageBox = {
    ...pluginNotifier(app),
    ...pluginMessageDialog(app)
  }
}
