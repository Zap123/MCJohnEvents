var m = require('mithril');
var Sidebar = require('./components/sidebar');
var Content = require('./components/content');

var App = {};

App.Page = {
    day: m.prop('Today'),
    total: m.prop('0'),
    events: function(day) {
        return m.request({
            method: 'GET',
            url: day
        })
    },
};


App.controller = function() {
    event = App.Page.events(App.Page.day())
    return {
        events: event,
        total: App.Page.total,
        setDay: function(day) {
            App.Page.events(day).then(event);
            scroll(0,0);
        }
    }
};


App.view = function(ctrl) {
    return [
        m.component(Sidebar, ctrl),
        m.component(Content, {
            events: ctrl.events()
        })
    ];
};

m.mount(document.getElementById('layout'), App);
