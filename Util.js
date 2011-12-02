var sliders = new Array();
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

Function.prototype.curry = function() {
	if (arguments.length < 1) { return this; }
	var __method = this;
	var args = toArray(arguments);
	return function() {
		return __method.apply(this, args.concat(toArray(arguments)));
	}
}
