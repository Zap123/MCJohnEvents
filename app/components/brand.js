var m = require('mithril')

exports.view = function(ctrl, options) {
    return m('div', [
        m('img', {
            'src': 'img/logo.png'
        }),
        m('h1', {
            'class': 'brand-title'
        }, 'MCJohn'),
        m('h2', {
            'class': 'brand-tagline'
        }, 'Events for the MCJohn people')
    ])
}
