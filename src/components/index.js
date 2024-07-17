import * as SvgComponents from './svg'
import * as LayoutComponents from './layout'
import * as ButtonComponents from './button'
import * as ListComponents from './list'
import * as TreeComponents from './tree'
import * as TabsComponents from './tabs'
import * as BarComponents from './bar'
import * as FormComponents from './form'
import * as InputComponents from './input'
import * as PopupComponents from './popup'
import * as MessageComponents from './message'

import MuIcon from './icon/icon.vue'
import MuBadge from './badge/badge.vue'
import MuScrollBox from './scrollbar/scroll-box.vue'

import { paramCase } from '@/utils/case'

export function install (app) {
  function installComponents (components) {
    Object.keys(components).forEach(key =>
      key.startsWith('Mu') &&
      app.component(paramCase(key), components[key])
    )

    components.install?.(app)
  }

  installComponents(SvgComponents)
  installComponents(LayoutComponents)
  installComponents(ButtonComponents)
  installComponents(ListComponents)
  installComponents(TreeComponents)
  installComponents(TabsComponents)
  installComponents(BarComponents)
  installComponents(FormComponents)
  installComponents(InputComponents)
  installComponents(PopupComponents)
  installComponents(MessageComponents)

  installComponents({
    MuIcon,
    MuBadge,
    MuScrollBox
  })
}
