import { attach, detach } from '../components/scrollbar'

const ScrollbarDirective = {
  mounted: attach,
  beforeUnmount: detach
}

function installDirectives (app) {
  app.directive('mu-scrollbar', ScrollbarDirective)
}

export {
  installDirectives
}
