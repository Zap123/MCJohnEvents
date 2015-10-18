var m = require('mithril');
var Sidebar = require('./components/sidebar');
var Content = require('./components/content');

var App = {};

App.Page = {
    day: m.prop('Today'),
    event: m.prop([]),
    total: m.prop(0),
    events: function(day) {
        return m.request({
            method: 'GET',
            url: day
        }).then(App.Page.event).then(function(e) {
            if (e) App.Page.total(e.length)
        })
    },
};


App.controller = function() {
    App.Page.events(App.Page.day())
    return {
        events: App.Page.event,
        total: App.Page.total,
        setDay: function(day) {
            App.Page.events(day);
            scroll(0, 0);
        }
    }
};


App.view = function(ctrl) {
    return [
        m.component(Sidebar, {
            total: ctrl.total(),
            setDay: ctrl.setDay
        }),
        m.component(Content, {
            total: ctrl.total(),
            events: ctrl.events()
        })
    ];
};

m.mount(document.getElementById('layout'), App);
