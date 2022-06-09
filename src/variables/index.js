import { colors, setColorVariables } from './color'

const variables = {
  /* language */
  /* lang = 'zh' */

  rootFontSize: '14px',

  unitSpacingSize: '8px',
  inlineItemSpacing: '5px',
  commonItemSpacing: '8px',
  layoutItemSpacing: '16px',

  unitBorderRadius: '4px',
  doubleBorderRadius: '8px',

  badgeHeight: '14px',
  badgePaddingX: '6px',
  badgeFontSize: '12px',

  buttonHeight: '32px',
  buttonPaddingX: '12px',
  buttonBorderWidth: '1px',
  buttonLineHeight: '20px',
  buttonBorderRadius: '4px',
  buttonFocusShadowSize: '0 0 0 2px',

  editorHeight: '32px',
  editorPaddingX: '12px',
  editorBorderWidth: '1px',
  editorLineHeight: '20px',
  editorBorderRadius: '4px',
  editorFocusShadowSize: '0 0 0 2px',

  listItemHeight: '32px',
  listItemPaddingX: '12px',
  listItemPaddingY: '6px',
  listItemLineHeight: '20px',
  listItemBorderRadius: '4px',
  listDividerBorderWidth: '1px',

  dropdownMargin: '4px',
  dropdownPaddingX: '4px',
  dropdownPaddingY: '4px',
  dropdownBorderWidth: '0',
  dropdownBorderRadius: '8px',
  dropdownItemBorderRadius: '4px',

  windowPaddingX: '24px',
  windowPaddingY: '16px',
  windowBorder: '0',
  windowBorderRadius: '8px',
  windowTitleLineHeight: '24px',
  windowTitleFontSize: '14px',
  windowTitleFontWeight: '600',

  barHeight: '40px',
  barPaddingX: '12px',

  tabBarHeight: '40px',
  tabButtonBorderWidth: '0',

  notifierWidth: '320px',
  notifierMargin: '16px',
  notifierPaddingX: '8px',
  notifierPaddingY: '8px',
  notifierBorderRadius: '8px',
  notifierIconSize: '32px',

  // boxShadowLevel1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  // boxShadowLevel2: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
  // boxShadowLevel3: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  // boxShadowLevel4: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
  // boxShadowLevel5: '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)'

  boxShadowLayer: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  boxShadowPopup: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
  boxShadowFloating: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  boxShadowWindow: '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',

  ...colors
}

function paramCase (str) {
  return str
    .replace(/(\W|_)/g, '-')
    .replace(/([A-Z])/g, s => '-' + s.toLowerCase())
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function setVariables (values = {}, options = {}) {
  if (options.generateRelatedColors !== false) {
    Object.keys(values).forEach(key => setColorVariables(values, key))
  }

  const root = options.root || document.documentElement

  Object.keys(values).forEach(key => {
    root.style.setProperty(
      '--mu-' + paramCase(key),
      variables[key] = values[key]
    )
  })
}

export {
  variables,
  setVariables
}
