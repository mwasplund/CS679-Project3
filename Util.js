var sliders = new Array();

function directionToAngle(direction) {
	return Math.atan2(direction[0], direction[1]);
}
function makeSlider(label, slidefun, slideparams, linkedParam)
{
	if (typeof(label)=="undefined") label="nolabel";
	if (typeof(slideparams)=="undefined") slideparams={};

	if (typeof(slideparams.value)=="undefined") slideparams.value = params[linkedParam];

	var outer = $("<div />").addClass("inset").appendTo("#controls");
	$("<span \>").text(label+":").addClass("numlabel").appendTo(outer);

	var inp = $("<input \>").addClass("numinput").attr('type','number').appendTo(outer);
	var sdi = $("<div \>").addClass("slidermarg").appendTo(outer);
	sdi.slider(slideparams).bind("slide",
			function( event, ui ) {
				inp.val( ui.value );
				slidefun(ui.value)
			} );
	inp.val(slideparams.value);
	slidefun(slideparams.value);

	sliders[sliders.length] = {
		input: inp,
		slider: sdi,
		param: linkedParam,
	};
}

// convert integer to string with commas
function formatNumber(val) {
	var str = val.toString();
	if (str.length > 3)
		return addCommas(str.substr(0, str.length - 3)) + "," + str.substr(str.length - 3);
	return str;
}

// convert milliseconds to sss.m
function formatTime(tm) {
	var str = (Math.floor(tm / 1000)).toString(10);
	var d = Math.floor((tm % 1000) / 100);
	return str + "." + d;
}

function pointInCircle(point, center, radius) {
	var d = sub2(point, center);
	return d[0] * d[0] + d[1] * d[1] < radius * radius;
}

function length2(vec) {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
}

function dist2(left, right) {
	return Math.sqrt((left[0] - right[0]) * (left[0] - right[0]) + (left[1] - right[1]) * (left[1] - right[1]));
}

function manhattan2(left, right) {
    return Math.abs(left[0] - right[0]) + Math.abs(left[1] - right[1]);
}

function normalize2(vec) {
	var len = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
	return [vec[0] / len, vec[1] / len];
}

function sub2(left, right) {
    return [left[0] - right[0], left[1] - right[1]];
}

function add2(left, right) {
    return [left[0] + right[0], left[1] + right[1]];
}

function scale2(sc, vec) {
    return [sc * vec[0], sc * vec[1]];
}

function dot2(left, right) {
    return left[0] * right[0] + left[1] * right[1];
}

function normalDecompose(d, normal) {
    var negnormal = scale2(-1, normal);
    var dotn = dot2(d, negnormal);
    var ncomp = scale2(dotn, negnormal);
    var tcomp = sub2(d, ncomp);
    return [dotn, ncomp, tcomp];
}

function binarySearch(lo, hi, accept) {
	while (hi - lo > 1) {
		var mid = Math.floor(lo + (hi - lo) / 2);
		if (accept(mid)) lo = mid;
		else hi = mid;
	}
	return lo;
}

function msToTicks(ms) {
	return Math.ceil(ms / timeStep);
}

function toArray(e) {
    return Array.prototype.slice.call(e);
}

Function.prototype.curry = function() {
	if (arguments.length < 1) { return this; }
	var __method = this;
	var args = toArray(arguments);
	return function() {
		return __method.apply(this, args.concat(toArray(arguments)));
	}
}

Array.prototype.unique = function(equal) {
    equal = equal || function(left, right) {
        return left === right;
    };
    var i = 1, j = 0;

    while (true) {
        while (i < this.length && equal(this[j], this[i])) i++;
        if (i == this.length) break;
        this[++j] = this[i++];
    }

    this.length = j + 1;
}

function arrayEquals(left, right) {
    return left && right && !(left < right) && !(right < left);
}
Array.prototype.equals = function(other) {
    return arrayEquals(this, other);
}

Array.prototype.toString = function(old) {
	return function() { return "[" + old.apply(this) + "]"; };
}(Array.prototype.toString);

Array.prototype.minElement = function(compare) {
	if (this.length == 0) return null;
	if (!compare) {
		compare = function(left, right) { return left < right; };
	}

	var v = this[0];
	for (var i = 1; i < this.length; i++) {
		v = compare(this[i], v) ? this[i] : v;
	}
	return v;
}


