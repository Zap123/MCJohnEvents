var m = require('mithril')

exports.ctrl = function() {

}

exports.view = function(ctrl, options) {
    return m('nav', {
        'class': 'nav'
    }, [
        m('ul', {
            'class': 'nav-list'
        }, [
            m('li', {
                'class': 'nav-item'
            }, [
                m('a', {
                    'class': 'pure-button',
                    'onclick': m.withAttr("text", options.setDay)
                }, 'Today'),
            ]),
            m('li', {
                'class': 'nav-item'
            }, [
                m('a', {
                    'class': 'pure-button',
                    'onclick': m.withAttr("text", options.setDay)
                }, 'Tomorrow'),
            ]),
        ]),
    ])
}
