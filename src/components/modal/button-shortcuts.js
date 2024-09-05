import lang from '@/langs'

const ButtonBindings = {
  ACCEPT: {
    caption: lang.Button.ACCEPT,
    primary: true
  },
  OK: {
    caption: lang.Button.OK,
    primary: true
  },
  CANCEL: {
    caption: lang.Button.CANCEL,
    buttonStyle: 'text'
  },
  YES: {
    caption: lang.Button.YES,
    primary: true
  },
  NO: {
    caption: lang.Button.NO,
    buttonStyle: 'text'
  },
  'OK!': {
    caption: lang.Button.OK,
    danger: true
  },
  'YES!': {
    caption: lang.Button.YES,
    danger: true
  }
}

export const ButtonShortcuts = {
  ACCEPT: { name: 'ACCEPT', bindings: ButtonBindings.ACCEPT },
  OK: { name: 'OK', bindings: ButtonBindings.OK },
  CANCEL: { name: 'CANCEL', bindings: ButtonBindings.CANCEL, action: 'close' },
  YES: { name: 'YES', bindings: ButtonBindings.YES },
  NO: { name: 'NO', bindings: ButtonBindings.NO, action: 'close' },
  'OK!': { name: 'OK', bindings: ButtonBindings['OK!'] },
  'YES!': { name: 'YES', bindings: ButtonBindings['YES!'] },
  ' ': { is: 'div', bindings: { class: 'mu-space' } },
  '-': { is: 'div', bindings: { class: 'mu-divider' } }
}
