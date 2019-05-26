/**
A namespace
@namespace 
@memberof global 
*/
var tp2 = {
};


/**
  This is a description.  
  @callback FilterFunc
  @param {Array} A
  @param {Object} Options
  @memberof global
 */

/**
@class tp.Args
@eventargs
*/

/**
@constructor tp.Args
@param {String} [EventName] - Optional. The event name
*/

/**
@property EventName
@type String
@description The event name
@default ''
@memberof tp.Args
*/




/** 
@field global.AGlobalField
A global field
@type Integer
@default 1234
*/
var AGlobalField = 1234;

// @memberof   // no name, goes to last namespace or class, in this case global


/**
@class
@function
@static
@namespace
@memberof global
@description This item is 3 things, a namescpace, a static class and a function
@param {String|Element} Selector - A selector or an element
@return {Element}
@see {@link https://stackoverflow.com|StackOverflow}
@see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript|MDN}
@tutorial Tripous
@fires {tp.Args|OnUserNameChanged} Description of the event
*/
var tp = (function () {
    function Class(Selector) {
        return null;
    }

    var _ = Class;

    /** 
    @constant
    @name tp.DateDelimiter
    @type String
    @default -
    */
    _.Constant('DateDelimiter', _, '-');


    /** 
    @property Version
    @type String
    @readonly
    @default 2017.06.15.1204 
    @memberof tp
    */
    _.Property('Version', _, function () {
    });

    /** 
    @property UserName
    @type String
    */
    tp.Property('UserName', _, function () {

    }, function (v) {

    });

    /**
    @function Func
    @static
    @param {String} S - A string
    @param {Number} N - A number
    @param {Boolean} B - A boolean
    @param {Element|String} [ElementOrSelector=document] - Optional. A DOM element or a selector. Defaults to document.
    @return {Element} Returns an element or null.
    @see {@link https://stackoverflow.com|StackOverflow}
    @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript|MDN}
    @tutorial Tripous
    @category {StringFunctions|String functions}
    */
    _.Func = function (S, N, B, ElementOrSelector, Params) {
    };
})();



/**
@enum tp.Color
@bitfield
*/
tp.Color = {
    /** 
    @constant tp.Color.Red
    @default - 2
    */
    get Red() { return 2; },
    /** 
    @constant Green
    @default - 4
    */
    get Green() { return 4; },
    /** 
    @constant tp.Color.Blue
    @default - 8
    */
    get Blue() { return 8; },
}

/** This is a global function
@function GlobalFunc
@memberof global 
*/
function GlobalFunc() {
}

/**
@function global.GlobalFunc2 
*/
function GlobalFunc2() {
}



/** 
@class tp.Static
@static
This is a static class. <br />
*/
tp.Static = (function (tp) {
    function Class() {
        //throw exception if this is called
    }

    var _ = Class;

    /**
    Function description
    @function Func
    @param {string} Param - Param description 
    */
    _.Func = function (Param) {
        return null;
    };

    return Class;
})(tp);

/** 
@class tp.Bf
Bit-Field (set) helper <strong>full static class</strong>. <br />
@tutorial Bf
@static
*/
tp.Bf = {
    /**
    Union (or). <br />Returns the union of A and B. <br />
    The result is a new set containing ALL the elements of A and B.  <br />
    <code>Result = A | B</code>
    @param {Integer} A 
    @param {Integer} B
    @return {Integer} 
     */
    Union: function (A, B) { return A | B; },
    /**
    Intersection (and). <br />Returns the intersection of A and B. <br />
    The result is a new set containing just the COMMON the elements of A and B. <br />
    <code>Result = A &amp; B</code> 
    @param {Integer} A 
    @param {Integer} B
    @return {Integer} 
     */
    Junction: function (A, B) { return A & B; },
    /**
    Difference (xor). <br />Returns the difference of A and B. <br />
    The result is a new set containing the NON COMMON the elements of A and B. <br />
    <code>Result = A ^ B</code>
    @param {Integer} A 
    @param {Integer} B
    @return {Integer} 
     */
    Dif: function (A, B) { return A ^ B; },
    /**
     * Subtraction (-). <br />Returns the subtraction of B from A. <br />   
    The result is a new set containing the the elements of A MINUS the elements of B. <br />
    <code>Result = A ^ (A &amp; B)</code>
    @param {Integer} A 
    @param {Integer} B
    @return {Integer} 
     */
    Subtract: function (A, B) { return A ^ (A & B); },
    /**
    Membership (in). <br />Returns true if A in B. A can be a single value or a set. <br />   
    Returns true if ALL elements of A are in B. <br />   
    <code>Result = (A &amp; B) == A</code>
    @param {Integer} A 
    @param {Integer} B
    @return {Boolean} 
     */
    Member: function (A, B) { return 0 === A ? false : ((A & B) === A); },
    /**
    Membership (in). <br />Returns true if A in B. A can be a single value or a set. <br />   
    Returns true if ALL elements of A are in B. <br />   
    <code>Result = (A &amp; B) == A</code>
    @param {Integer} A 
    @param {Integer} B
    @return {Boolean} 
     */
    In: function (A, B) { return 0 === A ? false : ((A & B) === A); },
    /**
    Returns true if A is null or 0.
    @param {Integer} A 
    @return {Boolean} 
     */
    IsEmpty: function (A) { return (A === tp.Undefined) || (A === null) || (Number(A) === 0); },
    /**
    Returns the name of an enum value <br />   
    @example
var Color = { Red: 1, Green: 2, Blue: 4 };
var S = tp.Bf.EnumToString(Color, Color.Green); // returns 'Green'
    @param {Object} EnumType 
    @param {Integer} Value
    @return {String} 
     */
    EnumToString: function (EnumType, Value) {
        for (var Prop in EnumType) {
            if (EnumType[Prop] === Value) {
                return Prop;
            }
        }

        return '';
    },
    /**
     * Returns a string representing a bit-field (set) value <br />   
    @example
var Color = { Red: 1, Green: 2, Blue: 4 };
var S = tp.Bf.EnumToString(Color, Color.Red | Color.Blue); // returns 'Red, Blue'
     * @param   {Object}   SetType The Set type, i.e. tp.Anchor
     * @param   {Integer}  Value   The integer value to be converted to string, i.e 5 (returns Top, Left)
     */
    SetToString: function (SetType, Value) {
        var Result = [];

        for (var Prop in SetType) {
            if (this.Member(SetType[Prop], Value)) {
                Result.push(Prop);
            }
        }

        var S = Result.join(', ');
        return S;
    },
};


/** 
@class tp.A
A base class
@extends Object
@fires {tp.Args|OnAnyEvent} This is the description text
*/
tp.A = (function (BaseClass) {

    /**
    @constructor tp.A
    */
    function Class() {
        BaseClass.call(this);
    }
    var base = tp.SetBaseClass(Class, BaseClass);
    var _ = Class.prototype;


    /**
    @field fName
    @type String
    @protected
    */
    _.fName = '';

    /** 
    @property Name
    @type String
    @description The event name
    @default ''
    */
    tp.Property('Name', _, function () {
        return this.fName;
    }, function (v) {
        this.fName = v;
    });

    /**  a totally useless function  
     @function Func
     
     */
    _.Func = function () { };

    return Class;
})(Object);

/**
@class tp.B
@augments tp.A
A derived class
*/
tp.B = (function (BaseClass) {

    /**
    @constructor tp.B
    @param {String} [Name=A] The name
    */
    function Class() {
        BaseClass.call(this);
    }
    var base = tp.SetBaseClass(Class, BaseClass);
    var _ = Class.prototype;


    /** 
    @property Age
    @type Integer
    @description The event name
    @default 0
    @deprecated
    */
    tp.Property('Age', _, function () {
        return this.fName;
    }, function (v) {
        this.fName = v;
    });


    /** @override Func */
    _.Func = function () { };

    return Class;
})(tp.A);


