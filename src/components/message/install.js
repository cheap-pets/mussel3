import { showMessage, alert, confirm, error, warn } from './message-box'

export default function install (app) {
  app.config.globalProperties.$messageBox = {
    showMessage: showMessage.bind(app),
    alert: alert.bind(app),
    confirm: confirm.bind(app),
    error: error.bind(app),
    warn: warn.bind(app)
  }
}
