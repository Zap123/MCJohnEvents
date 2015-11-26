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
            m('span', {
                'class': 'post-meta post-category post-category-design'
            }, event.date),
            m('span', {
                'class': 'post-meta post-category post-category-js'
            }, event.venue)
        ]),
        m('div', {
            'class': 'post-description'
        }, m('p', event.description))
    ])
}
