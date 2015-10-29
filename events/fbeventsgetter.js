var system = require('system'),
    fs = require('fs'),
    page = require('webpage').create(),
    city = system.args[1],
    events = 'https://www.facebook.com/search/str/' +
    'today%2Bevents%2Bnear%2B' + city + '/keywords_events?ref=top_filter',
    pwd = phantom.libraryPath,
    iteration = 200,
    last_iter = -1;
console.log(city)
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.settings.loadImages = false;
//A viewport not wide enough won't let phantomjs click the events button 
page.viewportSize = {
    width: 1280,
    height: 800
};

page.open(events, function(status) {
    console.log("Loading...")
    if (status === "success") {
        page.evaluate(function(url_events) {
            document.getElementById('email').value = 'YOUR_EMAIL';
            document.getElementById('pass').value = 'YOUR_PASSWORD';
            document.querySelector('form').submit();
            console.log("Login submitted")
        })
        waitFor(function() {
            return page.evaluate(function() {
                return document.querySelector('div._4jq5') !== null &&
                    document.readyState === "complete";
            })
        }, retryLoading);
        //            window.setInterval(screenshot, 3000);
        window.setTimeout(loop, 3000);
        //            window.setInterval(scrolling, 3000);
    } else {
        console.log("Error opening url \"" + page.reason_url + "\": " + page.reason);
    }
})


var loop = function() {
        waitFor(function() {
            return page.evaluate(function() {
                var el = document.querySelector('span._akq')
                return el !== null &&
                    el.parentNode.parentNode.className === 'hidden_elem' &&
                    document.readyState === "complete"
            })
        }, function() {
            scrolling();
            loop();
        })
    }
    //Click on Events button as it doesn't display any event otherwise
var retryLoading = function() {
    var point = page.evaluate(function() {
        var element = document.querySelectorAll('div._4jq5')[6].parentNode;
        var rect = element.getBoundingClientRect();
        return {
            x: rect.left + Math.floor(rect.width / 2),
            y: rect.top + (rect.height / 2)
        };
    });
    page.sendEvent('click', point.x, point.y);
    console.log("click");
};

function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 10000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if (!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady): onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};

var screenshot = function() {
    page.render('out.png');
};

var scrolling = function() {
    data = page.evaluate(function() {
        window.document.body.scrollTop = document.body.scrollHeight;
        var eventsList = document.querySelectorAll("._glj");
        var today = [];
        var tomorrow = [];
        var todaynr = 0;
        for (var i = 0; i < eventsList.length; i++) {
            var el = eventsList[i];
            var event = {};
            var date = el.children[1].children[0].innerText;
            var name = el.children[0].children[1].innerText || el.children[0].children[1].textContent;
            var url = el.children[0].children[1].children[0].href;
            var description = el.children[1].children[1].innerText || el.children[1].children[1].textContent;
            var img = el.parentNode.parentNode.children[0].children[0].src;

            if (/^Today/i.test(date) &&
                !today.some(function(e) {
                    //remove duplicates url
                    return e.url === url
                })) {
                todaynr++;
                event.date = date;
                event.name = name;
                event.url = url;
                event.vote = 0;
                event.description = description;
                event.img = img;
                today.push(event);

                console.log(name);
                console.log(date);
                console.log(todaynr)
            } else if (/^Tomorrow/i.test(date) &&
                !tomorrow.some(function(e) {
                    return e.url === url
                })) {
                //tomorrownr++;
                event.date = date;
                event.name = name;
                event.url = url;
                event.vote = 0;
                event.description = description;
                event.img = img;
                tomorrow.push(event);
            }

        }
        return [today, todaynr, tomorrow];
    })
    console.log("data: " + data[1] + " last_iter: " + last_iter);
    if (data[1] === last_iter) {
        iteration--;
    }
    last_iter = data[1];
    console.log("iteration: " + iteration);
    if (iteration == 0) {
        fs.write(pwd + '/today.json', JSON.stringify(data[0]));
        fs.write(pwd + '/tomorrow.json', JSON.stringify(data[2]));
        phantom.exit(0);
    }
}
