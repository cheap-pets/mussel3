import lang from '@/langs'

export const Buttons = {
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

export const MessageTypes = {
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
