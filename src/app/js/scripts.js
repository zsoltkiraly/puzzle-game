/*
Puzzle game - Code by Zsolt Király
v1.0.4 - 2018-01-28
*/

var forEach = function(array, callback, scope) {

    var i = 0;
    len = array.length;
    if (len > 0) {
        for (; i < len; i++) {
            callback.call(scope, i, array[i]);
        }
    }
};

var config = {
    expirationDate: 60,
}

function setCookie(value, name, config) {
    var date, expires;
    if (config.expirationDate) {
        date = new Date();
        date.setTime(date.getTime() + (config.expirationDate * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toGMTString();
    } else {
        expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

function getCookie(cname) {
    var name = cname + '=',
        ca = document.cookie.split(';'),
        i = 0,
        len = ca.length;
    for (; i < len; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

var puzzleGame = function() {

    function detectButton(event) {
        event = event || window.event;
        if ("buttons" in event) {
            return event.buttons;
        }
    }

    function select() {
        var select = document.querySelector('.select'),
            selectBackground = document.querySelector('.select-background'),
            selectGame = document.querySelector('.select-game');

        if(select) {

            var startY = 0;
            var dist = 0;

            var bear = 'bear-game-area',
                shark = 'shark-game-area',
                elephant = 'elephant-game-area';

            var restart = document.querySelector('.restart');

            if(getCookie(bear) === 'true') {
                selectGame.classList.add('finish');
                selectGame.innerHTML = '<span data-animal="' + bear +'">Finish</span>';

            }

            if(getCookie(bear) === 'true' && getCookie(shark) === 'true' && getCookie(elephant) === 'true') {

                restart.classList.add('show');

                restart.addEventListener('click', function() {

                    restart.classList.remove('show');
                    setCookie(false, bear, config);
                    setCookie(false, shark, config);
                    setCookie(false, elephant, config);
                    location.reload();

                }, false);
            }

            select.addEventListener('mousedown', function(event) {
                event.preventDefault();

                select.classList.add('catch');

                startY = event.clientY;

            }, false);

            select.addEventListener('mousemove', function(event) {
                event.preventDefault();

                if(select.classList.contains('catch')) {
                    dist = startY - event.clientY;
                }

            }, false);

            select.addEventListener('mouseup', function(event) {
                event.preventDefault();

                select.classList.remove('catch');

                var getRotate = parseFloat(select.getAttribute('rotate-id'));

                var setRotatePlus = getRotate + 1;
                var setRotateMinus = getRotate - 1;

                function getCookieAnimals(el) {
                    if(getCookie(el) === 'true') {
                        selectGame.classList.add('finish');
                        selectGame.innerHTML = '<span data-animal="' + el +'">Finish</span>';
                    }
                }

                if(dist > 50) {
                    selectGame.classList.remove('finish');
                    selectGame.innerHTML = '<span>Select puzzle</span>';

                    if(getRotate < 3) {
                        select.setAttribute('rotate-id', setRotatePlus);
                        select.classList.remove('rotate' + getRotate);
                        select.classList.add('rotate' + setRotatePlus);
                        select.classList.remove('plus');
                    }

                    if(getRotate == 3) {
                        select.setAttribute('rotate-id', setRotatePlus);
                        select.classList.remove('rotate' + getRotate);
                        select.classList.add('rotate' + setRotatePlus);
                        select.classList.add('plus');

                        setTimeout(function() {
                            select.setAttribute('rotate-id', 1);
                            select.classList.remove('rotate4');
                            select.classList.add('rotate1');
                        }, 300);

                        setTimeout(function() {
                            select.classList.remove('plus');
                        }, 350);
                    }

                    if(getRotate == 1) {
                        selectBackground.style.backgroundImage = "url('images/savannah.jpg')";
                        selectGame.setAttribute('data-class', 'elephant-game-area');

                        getCookieAnimals(elephant);

                    } else if(getRotate == 2) {
                        selectBackground.style.backgroundImage = "url('images/under_the_sea.jpg')";
                        selectGame.setAttribute('data-class', 'shark-game-area');

                        getCookieAnimals(shark);

                    } else if(getRotate == 3) {
                        selectBackground.style.backgroundImage = "url('images/forest.jpg')";
                        selectGame.setAttribute('data-class', 'bear-game-area');

                        getCookieAnimals(bear);
                    }
                }

                if(dist < -50) {
                    selectGame.classList.remove('finish');
                    selectGame.innerHTML = '<span>Select puzzle</span>';

                    if(getRotate > 1) {
                        select.setAttribute('rotate-id', setRotateMinus);
                        select.classList.remove('rotate' + getRotate);
                        select.classList.add('rotate' + setRotateMinus);
                        select.classList.remove('minus');
                    }

                    if(getRotate == 1) {

                        select.classList.add('minus');
                        select.setAttribute('rotate-id', 4);
                        select.classList.remove('rotate1');
                        select.classList.add('rotate4');

                        setTimeout(function() {
                            select.classList.remove('rotate4');
                            select.classList.add('rotate3');
                            select.setAttribute('rotate-id', 3);
                            select.classList.remove('minus');
                        }, 50);
                    }

                    if(getRotate == 2) {
                        selectBackground.style.backgroundImage = "url('images/forest.jpg')";
                        selectGame.setAttribute('data-class', 'bear-game-area');

                        getCookieAnimals(bear);

                    } else if(getRotate == 3) {
                        selectBackground.style.backgroundImage = "url('images/savannah.jpg')";
                        selectGame.setAttribute('data-class', 'elephant-game-area');

                        getCookieAnimals(elephant);

                    } else if(getRotate == 1 || getRotate == 4) {
                        selectBackground.style.backgroundImage = "url('images/under_the_sea.jpg')";
                        selectGame.setAttribute('data-class', 'shark-game-area');

                        getCookieAnimals(shark);

                    }
                }

            }, false);
        }
    }

    function back() {
        var back = document.querySelectorAll('.back');

        forEach(back, function(index, b) {

            b.addEventListener('click', function() {
                location.reload();
            }, false);
        });
    }

    function load() {
        var select = document.querySelector('.select-game-area');

        setTimeout(function() {
            select.classList.remove('loading');
        }, 1000);

        setTimeout(function() {
            select.classList.add('load');
        }, 2000);
    }

    function puzzle(bg, sA) {

        var puzzleElement = bg.querySelectorAll('.puzzle-element');

        window.addEventListener('keydown', function(event) {

            var dragElement = bg.querySelector('.puzzle-element.catch');

            if(dragElement) {
                if(event.keyCode == 32) {
                    
                    var getRotate = parseFloat(dragElement.getAttribute('rotate-id'));

                    var setRotate = getRotate + 1;

                    if(getRotate < 4) {
                        dragElement.setAttribute('rotate-id', setRotate);
                        dragElement.classList.remove('rotate' + getRotate);
                        dragElement.classList.add('rotate' + setRotate);
                    }

                    if(getRotate == 4) {
                        dragElement.setAttribute('rotate-id', setRotate);
                        dragElement.classList.remove('rotate' + getRotate);
                        dragElement.classList.add('rotate' + setRotate);

                        setTimeout(function() {
                            dragElement.setAttribute('rotate-id', 1);
                            dragElement.classList.remove('rotate5');
                            dragElement.classList.add('rotate1');
                        }, 300);
                    }
                }
            }

        }, false);

        forEach(puzzleElement, function(index, pE) {

            setTimeout(function() {
                bg.classList.remove('disabled');
                pE.classList.remove('start');
            }, 2000);

            setTimeout(function() {
                pE.classList.remove('transition');
                pE.setAttribute('data-x', pE.getBoundingClientRect().left);
                pE.setAttribute('data-y', pE.getBoundingClientRect().top);
            }, 2500);

            var diffX = 0,
                diffY = 0;

            function start(event, o) {
                event.preventDefault();

                if(!o.classList.contains('active')) {

                    diffX = event.clientX - o.getBoundingClientRect().left;
                    diffY = event.clientY - o.getBoundingClientRect().top;

                    o.classList.add('catch');

                    function move(event) {
                        event.preventDefault();

                        var dragElement = bg.querySelector('.puzzle-element.catch');

                        if(dragElement) {
                            var x = event.clientX;
                            var y = event.clientY;

                            dragElement.style.top = (y - diffY) + 'px';
                            dragElement.style.left = (x - diffX) + 'px';
                        }
                    }

                    window.addEventListener('mousemove', function(event) {
                        move(event);
                    }, false);

                } else {
                    event.preventDefault();
                }
            }

            pE.addEventListener('mousedown', function(event) {
                var obj = this;

                if(detectButton(event) === 1) {
                    start(event, obj);

                    var points = sA.querySelector('.points');

                    if(points) {
                        var getPoint = parseFloat(points.innerHTML);
                        points.innerHTML = getPoint + 1;
                    }

                }
            }, false);

            function finish(event) {
                event.preventDefault();

                var pA = bg.querySelectorAll('.puzzle-area'),
                    dragElement = bg.querySelector('.puzzle-element.catch');

                if(dragElement) {

                    forEach(pA, function(index, puzzleArea) {

                        var areaId = parseFloat(puzzleArea.getAttribute('area-id'));

                        var pAWidth = puzzleArea.offsetWidth;
                        var pAHeight = puzzleArea.offsetHeight;

                        var objY = dragElement.getBoundingClientRect().top;
                        var objX = dragElement.getBoundingClientRect().left;

                        var pAreaY = puzzleArea.getBoundingClientRect().top;
                        var pAreaX = puzzleArea.getBoundingClientRect().left;

                        function reset() {
                            var startX = parseInt(dragElement.getAttribute('data-x'));
                            var startY = parseInt(dragElement.getAttribute('data-y'));

                            dragElement.style.top = startY + 'px';
                            dragElement.style.left = startX + 'px';

                            dragElement.classList.add('return');

                            setTimeout(function() {
                                dragElement.classList.remove('return');
                            }, 200);
                        }

                        if(parseFloat(dragElement.getAttribute('rotate-id')) == 1) {
                            //30 px gap
                            if((pAreaY - 30) <= objY && (pAreaX - 30) <= objX && (pAreaY + 30) >= objY && (pAreaX + 30) >= objX) {
                                if(areaId == parseFloat(dragElement.getAttribute('puzzle-id'))) {
                                    dragElement.style.top = pAreaY + 'px';
                                    dragElement.style.left = pAreaX + 'px';
                                    dragElement.classList.add('active', 'stars');

                                    setTimeout(function() {
                                        dragElement.classList.remove('stars');
                                    }, 500);

                                    var activePuzzleElement = bg.querySelectorAll('.puzzle-element.active');

                                    if(activePuzzleElement.length == puzzleElement.length) {
                                        setCookie(true, sA.className, config);
                                    }
                                }
                            } else {
                                if(areaId == parseInt(dragElement.getAttribute('puzzle-id'))) {
                                    reset();
                                }
                            }
                        } else {
                            reset();
                        }
                    });
                }

                pE.classList.remove('catch');
            }

            window.addEventListener('mouseup', function(event) {
                finish(event);
            }, false);

        });
    }

    return {
        puzzle: puzzle,
        select: select,
        back: back,
        load: load
    }

}();


window.addEventListener('load', function() {
    puzzleGame.load()
    puzzleGame.select();
    puzzleGame.back();
}, false);