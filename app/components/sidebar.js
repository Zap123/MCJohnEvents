var m = require('mithril'),
    Brand = require('./brand'),
    Nav = require('./nav');

exports.view = function(ctrl, options) {
    return m('div', {
        'class': 'sidebar pure-u-1 pure-u-md-1-4'
    }, [
        m('div', {
            'class': 'header'
        }, [
            m('center', [
                m.component(Brand),
                m.component(Nav, options),
                m('em', options.total + " events"),
                m('div', new Date().toDateString())
            ])
        ])
    ])
}
