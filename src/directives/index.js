import { attach, detach } from 'mussel-scrollbar'

export function install (app) {
  app.directive('mu-scrollbar', {
    mounted: attach,
    beforeUnmount: detach
  })
}
