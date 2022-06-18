/* ICON */
import Icon from './icon/icon.vue'

/* BUTTON */
import Button from './button/button.vue'
import ButtonGroup from './button/button-group.vue'

/* LIST */
import ListItem from './list/list-item.vue'
import ListDivider from './list/list-divider.vue'

/* FORM */
import Editor from './form/editor.vue'
import ComboBox from './form/combo-box.vue'
import ComboBoxOption from './form/option.vue'
import Check from './form/check.vue'
import Radio from './form/radio.vue'
import Switch from './form/switch.vue'

/* DROPDOWN */
import Dropdown from './dropdown/dropdown.vue'
import DropdownItem from './dropdown/dropdown-item.vue'
import DropdownPanel from './dropdown/dropdown-panel.vue'
import DropdownButton from './dropdown/dropdown-button.vue'

/* TABS */
import TabButton from './tabs/tab-button.vue'
import TabBar from './tabs/tab-bar.vue'
import TabPanel from './tabs/tab-panel.vue'
import TabsButtons from './tabs/tabs-buttons.vue'
import Tabs from './tabs/tabs.vue'

/* MODAL */
import Dialog from './modal/dialog.vue'

/* MESSAGE */
import installMessage from './message'

export function installComponents (app) {
  app.component('mu-icon', Icon)

  app.component('mu-button', Button)
  app.component('mu-button-group', ButtonGroup)

  app.component('mu-list-item', ListItem)
  app.component('mu-list-divider', ListDivider)

  app.component('mu-editor', Editor)
  app.component('mu-combo-box', ComboBox)
  app.component('mu-option', ComboBoxOption)
  app.component('mu-check', Check)
  app.component('mu-radio', Radio)
  app.component('mu-switch', Switch)

  app.component('mu-dropdown', Dropdown)
  app.component('mu-dropdown-item', DropdownItem)
  app.component('mu-dropdown-panel', DropdownPanel)
  app.component('mu-dropdown-button', DropdownButton)

  app.component('mu-tab-button', TabButton)
  app.component('mu-tab-bar', TabBar)
  app.component('mu-tab-panel', TabPanel)
  app.component('mu-tabs-buttons', TabsButtons)
  app.component('mu-tabs', Tabs)

  app.component('mu-dialog', Dialog)

  installMessage(app)
}
