var m = require('mithril')

exports.view = function(ctrl, event) {
    return m('section', {
        'class': 'post'
    }, [
        m('header', {
            'class': 'post-header'
        }, [
            m('img', {
                'class': 'post-avatar',
                'src': event.img
            }),
            m('h2', {
                'class': 'post-title'
            }, [
                m('a', {
                    'href': event.url
                }, event.name)
            ]),
            m('p', {
                'class': 'post-meta'
            }, event.date)
        ]),
        m('div', {
            'class': 'post-description'
        }, event.description)
    ])
}
