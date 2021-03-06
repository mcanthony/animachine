require('./beton')
require('./rocks/debugger-tab')
require('./rocks/dom-picker')
require('./rocks/component-inspector')
require('./rocks/config')
require('./rocks/contact-layer')
require('./rocks/create-source-file')
require('./rocks/file-save')
require('./rocks/hack-open-first-possible-project')
require('./rocks/item-settings-dialog')
require('./rocks/open-project-dialog')
require('./rocks/preview-animation-synchronizer')
require('./rocks/project-manager')
require('./rocks/store')
require('./rocks/timeline-pusher')
require('./rocks/timeline-tab')
require('./rocks/toolbar')
require('./rocks/tracker')
require('./rocks/transform-tool')
require('./rocks/welcome-dialog')
require('./rocks/welcome-process')
require('./rocks/workspace')

if (!window.__ANIMACHINE_OPEN_FIRST__) {//HACK this flag is used by the demos
  BETON.require('hack-open-first-possible-project')()
}
else {
  BETON.require('welcome-process').start()
}

const animachine = {
  init() {
    //TODO start everithing on init
  }
}

export default animachine
