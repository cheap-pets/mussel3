/* BOX */
import Box from './box/box.vue'
import HBox from './box/h-box.vue'
import VBox from './box/v-box.vue'
import GridBox from './box/grid-box.vue'
import GridCell from './box/grid-cell.vue'

/* ICON */
import Icon from './icon/icon.vue'

/* BUTTON */
import Button from './button/button.vue'
import ButtonGroup from './button/button-group.vue'

/* LIST */
import ListItem from './list/list-item.vue'
import ListDivider from './list/list-divider.vue'

/* TREE */
import Tree from './tree/tree-view.vue'
import TreeNode from './tree/tree-node.vue'

/* FORM */
import Editor from './form/editor.vue'
import ComboBox from './form/combo-box.vue'
import ComboBoxOption from './form/option.vue'
import Check from './form/check.vue'
import Radio from './form/radio.vue'
import Switch from './form/switch.vue'
import Form from './form/form.vue'
import FormRow from './form/form-row.vue'
import FormField from './form/form-field.vue'

/* DROPDOWN */
import Dropdown from './dropdown/dropdown.vue'
import DropdownButton from './dropdown/dropdown-button.vue'
import DropdownPanel from './dropdown/dropdown-panel.vue'
import DropdownItem from './dropdown/dropdown-item.vue'
import DropdownCheckItem from './dropdown/dropdown-check-item.vue'
import DropdownRadioItem from './dropdown/dropdown-radio-item.vue'

/* TABS */
import TabButton from './tabs/tab-button.vue'
import TabBar from './tabs/tab-bar.vue'
import TabPanel from './tabs/tab-panel.vue'
import TabsButtons from './tabs/tabs-buttons.vue'
import Tabs from './tabs/tabs.vue'

/* MODAL */
import Dialog from './modal/dialog.vue'

/* MESSAGE */
import StatusBox from './message/status-box.vue'
import installMessage from './message'

export const components = {
  Box,
  HBox,
  VBox,
  GridBox,
  GridCell,
  Icon,
  Button,
  ButtonGroup,
  ListItem,
  ListDivider,
  Tree,
  TreeNode,
  Editor,
  ComboBox,
  ComboBoxOption,
  Check,
  Radio,
  Switch,
  Form,
  FormRow,
  FormField,
  Dropdown,
  DropdownButton,
  DropdownPanel,
  DropdownItem,
  DropdownCheckItem,
  DropdownRadioItem,
  TabButton,
  TabBar,
  TabPanel,
  TabsButtons,
  Tabs,
  Dialog,
  StatusBox
}

export function installComponents (app) {
  app.component('mu-box', Box)
  app.component('mu-h-box', HBox)
  app.component('mu-v-box', VBox)
  app.component('mu-grid-box', GridBox)
  app.component('mu-grid-cell', GridCell)

  app.component('mu-icon', Icon)

  app.component('mu-button', Button)
  app.component('mu-button-group', ButtonGroup)

  app.component('mu-list-item', ListItem)
  app.component('mu-list-divider', ListDivider)

  app.component('mu-tree', Tree)
  app.component('mu-tree-node', TreeNode)

  app.component('mu-editor', Editor)
  app.component('mu-combo-box', ComboBox)
  app.component('mu-option', ComboBoxOption)
  app.component('mu-check', Check)
  app.component('mu-radio', Radio)
  app.component('mu-switch', Switch)
  app.component('mu-form', Form)
  app.component('mu-form-row', FormRow)
  app.component('mu-form-field', FormField)

  app.component('mu-dropdown', Dropdown)
  app.component('mu-dropdown-button', DropdownButton)
  app.component('mu-dropdown-panel', DropdownPanel)
  app.component('mu-dropdown-item', DropdownItem)
  app.component('mu-dropdown-check-item', DropdownCheckItem)
  app.component('mu-dropdown-radio-item', DropdownRadioItem)

  app.component('mu-tab-button', TabButton)
  app.component('mu-tab-bar', TabBar)
  app.component('mu-tab-panel', TabPanel)
  app.component('mu-tabs-buttons', TabsButtons)
  app.component('mu-tabs', Tabs)

  app.component('mu-dialog', Dialog)

  app.component('mu-status-box', StatusBox)

  installMessage(app)
}
