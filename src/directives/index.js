import MusselScrollbar from './scrollbar'
import MusselSticky from './sticky'

function installDirectives (app) {
  app.directive('mussel-scrollbar', MusselScrollbar)
  app.directive('mussel-sticky', MusselSticky)
}

export {
  MusselScrollbar,
  installDirectives
}
