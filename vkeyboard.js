// Typing logic
var el = $("#txtArea")[0];
var evn = "touchstart mousedown";
$("#kbd").on(evn, "> *", function (ev) {
    ev.preventDefault();
    el.focus();
});


const Has = (ob, prop) => hasOwnProperty.call(ob, prop);

function isHilite() {
    return el.selectionEnd - el.selectionStart > 0;
}
function setRng(txt, from, to) {
    el.setSelectionRange(from + txt.length, to + txt.length);
}
function insVal(txt, from, to) {
    from = Math.max(0, from);
    to = to || from;
    el.value = el.value.substring(0, from) + txt + el.value.substring(to, el.value.length);
    setRng(txt, from, from);
}

var fun = {
    IN : { // INSERT
        action (key) {
            insVal(key, el.selectionStart, el.selectionEnd);
        }
    },
    CL: { // CARET LEFT
        char: '\u2190',
        action () {
            insVal('', el.selectionStart - (isHilite(el) ? 0 : 1));
        }
    },
    CR: { // CARET RIGHT
        char: '\u2192',
        action () {
            insVal('', el.selectionEnd + (isHilite(el) ? 0 : 1));
        }
    },
    DL: { // DELETE LEFT
        char: '\u232B',
        action () {
            insVal('', el.selectionStart - (isHilite(el) ? 0 : 1), el.selectionEnd);
        }
    },
    DR: { // DELETE RIGHT
        char: '\u2326',
        action () {
            insVal('', el.selectionStart, el.selectionEnd + (isHilite(el) ? 0 : 1));
        }
    },
    RETURN: {
        char: '\u21b5',
        action () {
            fun.IN.action('\u000d');
        }
    },
    SPACE: {
        char: '',
        action () {
            fun.IN.action(" ");
        }
    }
};

// Keyboard layout
const layout = {
    default: [
        "1 2 3 4 5 6 7 8 9 0 ' + DL",
        "q w e r t z u i o p š đ DR",
        "a s d f g h j k l č ć ž RETURN",
        "y x c v b n m \u03A9 CL CR NOFUNCTION",
        "SPACE"
    ],
    // Extend character functions
    fun: {
        /*OMEGA : {
            char: '\u03A9',
            action () {
                insVal(this.char, el.selectionStart, el.selectionEnd);
            }
    }*/
    }
};

// Merge action/char functions
Object.assign(fun, layout.fun);

layout.default.forEach((str, rowNum) => {
    var $html = str.split(/\s/g).map(key => {
        return $('<button/>', {
            'class': `vkeyboard-key vkeyboard-row--${rowNum}`,
            'data-vkeyboard-key': key,
            html: Has(fun, key) && Has(fun[key], 'char') ? fun[key].char : key,
            on : {
                [evn] :
                    Has(fun, key) ?
                    fun[key].action.bind(fun[key]) :
                    fun.IN.action.bind(fun[key], key)
            },
        });
    });
    $html.push($("<br>"));
    $("#kbd").append( $html );
});

/*
$(el).on('dblclick', function (e) {
    if (isHilite(this)) {
        e.preventDefault();
        var sel = window.getSelection().toString();
        console.log(sel);
    }
});*/
