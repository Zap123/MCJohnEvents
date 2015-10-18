var m = require('mithril'),
    post = require('./post')

exports.view = function(ctrl, options) {
    return m('div', {
        'class': 'content pure-u-1 pure-u-md-3-4'
    }, [
        m('div', {
            'class': 'posts'
        }, [
            (!options.total) ? "Nothing to see here" : options.events.map(function(el) {
                return m.component(post, el)
            })
        ])
    ])
}
