import lang from '../../lang'
import MessageBox from './message-box.vue'

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
    icon: 'alert',
    title: lang.Message.ALERT,
    buttons: ['OK']
  },
  CONFIRM: {
    icon: 'alert',
    title: lang.Message.CONFIRM,
    buttons: ['CANCEL', 'OK']
  },
  ERROR: {
    icon: 'warn',
    title: lang.Message.ERROR,
    buttons: ['OK'],
    danger: true
  },
  WARN: {
    icon: 'warn',
    title: lang.Message.WARN,
    buttons: ['CANCEL', 'OK'],
    danger: true
  }
}

export function showMessage (options) {
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
      appContext: this._context,
      container: this._container,
      component: MessageBox,
      props: { icon, title, message, buttons, callback }
    })
  })
}

export function alert (message, callback) {
  return showMessage.call(this, {
    type: 'alert',
    message,
    callback
  })
}

export function confirm (message, callback) {
  return showMessage.call(this, {
    type: 'confirm',
    message,
    callback
  })
}

export function error (message, callback) {
  return showMessage.call(this, {
    type: 'error',
    message,
    callback
  })
}

export function warn (message, callback) {
  return showMessage.call(this, {
    type: 'warn',
    message,
    callback
  })
}
