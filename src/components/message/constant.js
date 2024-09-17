import lang from '@/langs'

export const MessageTypes = {
  ALERT: {
    icon: 'info',
    title: lang.Message.ALERT,
    buttons: ['OK']
  },
  SUCCESS: {
    icon: 'ok',
    title: lang.Message.SUCCESS,
    buttons: ['OK']
  },
  CONFIRM: {
    icon: 'question',
    title: lang.Message.CONFIRM,
    buttons: ['CANCEL', 'OK']
  },
  ERROR: {
    icon: 'x',
    title: lang.Message.ERROR,
    buttons: ['OK!'],
    danger: true
  },
  WARN: {
    icon: 'info',
    title: lang.Message.WARN,
    buttons: ['CANCEL', 'OK!'],
    danger: true
  }
}
