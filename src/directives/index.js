import MusselScrollbar from './scrollbar'

function installDirectives (app) {
  app.directive('mu-scrollbar', MusselScrollbar)
}

export {
  installDirectives
}
