import * as SvgComponents from './svg'
import * as IconComponents from './icon'
import * as LayoutComponents from './layout'
import * as ButtonComponents from './button'
import * as ListComponents from './list'
import * as TreeComponents from './tree'
import * as TabsComponents from './tabs'
import * as BarComponents from './bar'
import * as FormComponents from './form'
import * as InputComponents from './input'
import * as PopupComponents from './popup'
import * as DropdownComponents from './dropdown'
import * as MessageComponents from './message'

import MuBadge from './badge/badge.vue'
import MuScrollBox from './scrollbar/scroll-box.vue'

import { kebabCase } from '@/utils/case'

export function install (app, options) {
  function installComponents (components) {
    Object.keys(components).forEach(key =>
      key.startsWith('Mu') &&
      app.component(kebabCase(key), components[key])
    )

    components.install?.(app, options)
  }

  installComponents(SvgComponents)
  installComponents(IconComponents)
  installComponents(LayoutComponents)
  installComponents(ButtonComponents)
  installComponents(ListComponents)
  installComponents(TreeComponents)
  installComponents(TabsComponents)
  installComponents(BarComponents)
  installComponents(FormComponents)
  installComponents(InputComponents)
  installComponents(PopupComponents)
  installComponents(DropdownComponents)
  installComponents(MessageComponents)

  installComponents({
    MuBadge,
    MuScrollBox
  })
}
