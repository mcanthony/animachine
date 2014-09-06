'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var uncalc = require('./uncalc');
var Key = require('./Key');
var amgui = require('../../amgui');

function CssParameter (opt) {

    EventEmitter.call(this);
    
    this.name = opt.name || '';

    this._lineH = opt.lineH || 21;

    this._keys = [];

    this.deOptions = this._createParameterOptions();
    this.deKeyline = amgui.createKeyline({
        timescale: am.timeline.timescale
    });

    this._onChangeInput = this._onChangeInput.bind(this);
    this._onChangeTime = this._onChangeTime.bind(this);
    this._onChangeKeyTime = this._onChangeKeyTime.bind(this);
    this._onToggleKey = this._onToggleKey.bind(this);
    this._onDeleteKey = this._onDeleteKey.bind(this);

    if (!opt.skipKeyValueInput) {

        this._input = amgui.createKeyValueInput({
            parent: this.deOptions,
            key: this.name,
            value: opt.value,
            onChange: this._onChangeInput,
            height: this._lineH
        });
        this._input.style.flex = 1;
    }

    this._btnToggleKey = amgui.createIconBtn({
        icon: 'key',
        height: 21,
        parent: this.deOptions,
        onClick: this._onToggleKey,
    });
    this._refreshBtnToggleKey();

    am.timeline.on('changeTime', this._onChangeTime);
}

inherits(CssParameter, EventEmitter);
var p = CssParameter.prototype;

p.getValue = function (time) {

    if (!_.isNumber(time)) {
        time = am.timeline.currTime;
    }

    var before, after, same;

    this._keys.forEach(function (key) {

        if (key.time === time) {
        
            same = key;
        }

        if (key.time < time && (!before || before.time < key.time)) {
        
            before = key;
        }

        if (key.time > time && (!after || after.time > key.time)) {
        
            after = key;
        }
    });

    if (same) {

        return same.value;
    }
    else {

        if (after && before) {

            var p = (time - before.time) / (after.time - before.time), 
                av = uncalc(after.value), bv = uncalc(before.value);

            return 'calc(' + bv + ' + (' + av + ' - ' + bv + ')*' + p + ')';
        }
        else if (before) {
            
            return before.value;
        }
        else if (after) {
            
            return after.value;
        }
    }
};

p.addKey = function (opt) {

    var key = this.getKey(opt.time);

    if (key) {

        if ('value' in opt) {

            key.value = opt.value;
        }
    }
    else {

        key = new Key(_.extend({deKeyline: this.deKeyline}, opt));

        key.on('changeTime', this._onChangeKeyTime);
        key.on('delete', this._onDeleteKey);

        this._keys.push(key);
    }

    this._refreshInput();
    this._refreshBtnToggleKey();

    this.emit('change');

    return key;
};

p.getKey = function (time) {

    return this._keys.find(function(key) {

        return key.time === time;
    });
};

p.getPrevKey = function (time) {

    var retKey;
    
    this._keys.forEach(function(key) {

        if (key.time < time && (!retKey || retKey.time < key.time)) {

            retKey = key;
        }
    });

    return retKey;
};

p.getNextKey = function (time) {

    var retKey;
    
    this._keys.forEach(function(key) {

        if (key.time > time && (!retKey || retKey.time > key.time)) {

            retKey = key;
        }
    });

    return retKey;
};

p.getKeyTimes = function () {

    var times = [];

    this._keys.forEach(function (key) {

        times.push(key.time);
    });

    return times;
};


Object.defineProperty(p, 'height', {

    get: function () {
        
        return this._lineH;
    }
});

p.getSave = function () {

    var save = {
        name: this.name,
        keys: [],
    }

    this._keys.forEach(function (key) {

        save.keys.push({
            value: key.value,
            time: key.time,
            ease: key.ease
        });
    });

    return save;
};

p.useSave = function(save) {

    this.name = save.name;

    save.keys.forEach(function (keyData) {

        this.addKey(keyData);
    }, this);
};

p._onChangeInput = function (e) {

    if ('key' in e.detail) {
        this.name = e.detail.key;
    }

    if ('value' in e.detail) {
        this.addKey({
            time: am.timeline.currTime,
            value: e.detail.value
        });
    }

    this.emit('change');
};

p._onChangeKeyTime = function () {

    this.emit('change');
};

p._onDeleteKey = function (key) {

    this.deleteKey(key);
};

p._onChangeTime = function () {

    this._refreshInput();
    this._refreshBtnToggleKey();
};

p._onToggleKey = function () {

    var key = this.getKey(am.timeline.currTime);

    if (key) {
        this.deleteKey(key);
    }
    else {
        this.addKey({time: am.timeline.currTime});
    }
};

p.deleteKey = function (key) {

    var idx = this._keys.indexOf(key);

    if (idx !== -1) {

        this._keys.splice(idx, 1);

        key.dispose();

        key.removeListener('changeTime', this._onChangeKeyTime);
        key.removeListener('delete', this._onDeleteKey);

        this._refreshBtnToggleKey();

        this.emit('change');
    }
};

p.isValid = function () {

    return !!(this.name && this._keys.length);
};

p._refreshInput = function () {

    this._input.setKey(this.name);
    this._input.setValue(this.getValue());
};

p._refreshBtnToggleKey = function () {

    var key = this.getKey(am.timeline.currTime);
    this._btnToggleKey.style.color = key ? amgui.color.text : amgui.color.textInactive;
};

p._createParameterOptions = function () {

    var de = document.createElement('div');
    de.style.display = 'flex';
    de.style.width = '100%';
    de.style.height = this._lineH + 'px';
    de.style.background = 'linear-gradient(to bottom, #184F12 18%,#1B4417 96%)';

    amgui.bindDropdown({
        asContextMenu: true,
        deTarget: de,
        deMenu: amgui.createDropdown({
            options: [
                {text: 'move up', onSelect: this.emit.bind(this, 'move', this, -1)},
                {text: 'move down', onSelect: this.emit.bind(this, 'move', this, 1)},
                {text: 'delete', onSelect: this.emit.bind(this, 'delete', this)},
            ]
        })
    });

    return de;
};

module.exports = CssParameter;
