/**
@namespace tp2
@memberof global
@description This is a namespace with a defined name (namespace tag) and defined parent (memberof tag) <br /><br />

JSDocNet is an API documentation generator for JavaScript, similar to {@link http://usejsdoc.org/|JSDoc}. <br />
blah blah blah blah {@tutorial Tutorial_tp} blah blah blah 

A documentation comment is called <strong>DocLet</strong> by this javascript documentation generator application.<br />
A documentation comment may contain a number of tags. A <strong>tag</strong> is a word prefixed by the at character e.g. <strong>@tag</strong>.<br />
Tags fall in two major categories: block tags and inline tags. <br />
Block tags must be placed at the start of the line. Leading space and star characters are ignored. The tag place order is insignificant.<br /><br />
 
Block tags belong to one or more categories, such as doclet tags, single-line tags, multi-line tags, flag tags.<br />

<strong>DocLet</strong> tags identify the whole documentation comment and the code item being documented. A documentation comment must contain a single DocLet tag. <br />
DocLet tags may have or may have not a value. <br />
When a DocLet tag provides a value, then that value is the name of the code item being documented. <br />
Such a name may be prefixed by its memberof, e.g. tp.Classes.MyClass is parsed as name=MyClass and memberof=tp.Classes <br /><br />

<strong>DocLet</strong> tags are the following: <br /> 
<pre>
            Tag                Short Syntax format
            -----------------------------------------------------------------------------------------------
            namespace          @tag [MemberOf]Name [Description] 
            class              @tag [MemberOf]Name [Description] 
            constructor        @tag [MemberOf] [Description]
            constant           @tag [MemberOf]Name [Description] or @tag {Type} [MemberOf]Name [Description]  
            field              @tag [MemberOf]Name [Description] or @tag {Type} [MemberOf]Name [Description]  
            property           @tag [MemberOf]Name [Description] or @tag {Type} [MemberOf]Name [Description]  
            function           @tag [MemberOf]Name [Description] 
            enum               @tag [MemberOf]Name [Description] or @tag {Type} [MemberOf]Name [Description]  
            callback           @tag [MemberOf]Name [Description]  
</pre><br /> 

The optional <strong>name</strong> tag may be used in providing the name of the code item, e.g <pre>@name MyClass</pre> <br /> 
When the name tag is ommited and the DocLet tag does not specify a name, then the parser parses the next two lines after the end of the comment and tries to come up with a name. <br /> <br /> 
 
<strong>Multi-line</strong> tags are the following: <br /> 
<pre>
            description    
            property 
            param                         
            return  
            fires  (triggers an event)    
            throws                           
            example                     
</pre><br /> 

<strong>Flag</strong> tags have no value at all. They just mark the code item giving it a special meaning. <br /> <br />
<strong>Flag</strong> tags are the following: <br /> 
<pre>
            function (when used with a namespace or enum to denote the existing of a function with the same name),        
            static,         
            private,        
            protected,      
            public,         
            readOnly,       
            bitfield,       
            eventargs,      
            deprecated
</pre><br /> 
*/
var tp2 = {
    /** @constant {String} Version - The version of the library. <br ><br >
        
        A constant or field or property can be written using the short format, as <pre>@tag {Type} Name - Description </pre>
        @default 2017.06.23.123
    */
    Version: '2017.06.23.123',

    /**
    @property Prop2
    @type String
    @default Tripous
    @description This is property 2 <br ><br >

    A constant or field or property can be written using the long format where the DocLet tag, the type tag, the name tag, and the description tag are placed in different lines
    */
    Prop2: 'Tripous',
};

 

/**
@namespace
@memberof
@name tp3
This is a namespace WITHOUT a defined parent (memberof tag) or defined description (description tag). <br /><br />

When the <strong>memberof</strong> tag is empty, or not provided at all, then the name of the last container tag is used (called the <strong>ContextName</strong> internally). <br /><br />
If ContextName is empty, then the global namespace is assumed. <br /> <br />
Setting a value to the memberof tag, assigns the internal ContextName too. <br /><br /> 

When the <strong>description</strong> tag is not provided then text lines following any single-line tag are considered the description.
*/
var tp3 = {
};


/** The description could be placed in the start of a DocLet and the tag may ommited.
@namespace 
*/
var tp4 = {

}


/** 
@namespace global.tp  
@function 
@description This item is 3 things, a namescpace, a static class and a function <br /><br />

A namespace may provide a function with the same name. This is done by using the function tag along with the namespace tag, 
and providing documentation for the function. <br /><br />

Here is the function
@param {String|Element|tp.A} Selector - A selector or an element
@return {Element}
@see {@link https://stackoverflow.com|StackOverflow} for mor information
@see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript|MDN}
@tutorial Tutorial_tp
*/
var tp = (function () {
    function Class(Selector) {
        return null;
    }

    var _ = Class; 


    /** 
    @field 
    @type String
    @access private 
    This is a private field. <br /><br />
    No name is provided here. The parser will parse the next lines and will determine the name.
    @default '' 
    */
    _.fUserName = '';


    /** 
    @constant {String} tp.DateDelimiter - This is the DateDelimiter description. Here the short syntax is used.
    @default -  
    */
    Object.defineProperty(_, 'DateDelimiter', {
        value: '-',
        writable: false,
        enumerable: false,
        configurable: false,
    });


    /** This is the Version property description. Here the long syntax is used.
    @property tp.Version
    @type String
    @readonly
    @default 2017.06.15.1204 
    */
    Object.defineProperty(_, 'Version',   {
        get: function() { return '2017.06.15.1204 '; },
        enumerable: false,
        configurable: false,
    });

    /** 
    @property UserName
    @type String
    */
    Object.defineProperty(_, 'UserName', {
        get: function () { return _.fUserName; },
        set: function (v) { _.fUserName = v;},
        enumerable: false,
        configurable: false,
    });
 

    /**
    @function Func
    @static
    @description this is the Func description
    @param {String} S - A string
    @param {Number} N - A number
    @param {Boolean} B - A boolean
    @param {Element|String} [ElementOrSelector=document] - Optional. A DOM element or a selector. Defaults to document.
    @return {Element} Returns an element or null.
    @throws {Error} Throws an Error error when something bad happens.
    @throws {MyErrorObject} Throws a MyErrorObject error when something very bad happens.
    @throws {JustAnError}
    @see {@link https://stackoverflow.com|StackOverflow}
    @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript|MDN}
    @tutorial Tutorial_tp
    @category Strings
    @example 
 var List = [[true, 4], [false, 1], [true, 2]];
 
 // filters based on index
 List = tp.ListFilter(List, [{ Prop: 0, Operator: tp.FilterOp.Equal, Value: true }], false); // results in [[true, 4], [true, 2]]
      
    @example 
 var List = [{ Name: 'John', Age: 30 }, { Name: 'Jane', Age: 31 }, { Name: 'Jack', Age: 20 }, ];
 
 List = tp.ListFilter(List, [{ Prop: 'Name', Operator: tp.FilterOp.Contains, Value: 'o', }], false); // results in [{ Name: 'John', Age: 30 }]
    */
    _.Func = function (S, N, B, ElementOrSelector, Params) {
    };

    /** 
    @function Func1 This is a function description
    @category Date
    */
    _.Func1 = function () { };
    /** 
    @function Func2 This is a function description
    @category DOM handling
    */
    _.Func2 = function () { };
    /** 
    @function Func3 This is a function description
    @category
    */
    _.Func3 = function () { };
    /** 
    @function Func4 This is a function description
    @category Date
    */
    _.Func4 = function () { };
    /** 
    @function Func5 This is a function description
    @category Strings
    */
    _.Func5 = function () { };
    /** 
    @function Func6 This is a function description
    @category
    */
    _.Func6 = function () { };
})();


/**
  @callback FilterFunc
  @param {Array} A - The array to operate on.
  @param {Object} Item - The array element to inspect.
  @return {Boolean} Returning true means that the passed object passes the filter condition.
  @memberof global
  @description <p>Applies a filter condition to an array element and returns true if the element passes the condition. </p>
  
  <p>Callback functions, normally, have no associated code item.  </p>
  <p>The presence of a DocLet always generates a documentation item. The actual code item is not required. </p>
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
@property {String} EventName - The event name
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


/**
@enum {Integer} tp.Color - An enumeration type
@bitfield
*/
tp.Color = {
    /** 
    @constant tp.Color.Red
    @default 2
    */
    get Red() { return 2; },
    /** 
    @constant Green
    @default 4
    */
    get Green() { return 4; },
    /** 
    @constant tp.Color.Blue
    @default 8
    */
    get Blue() { return 8; },
};


/** This is a global function
@function GlobalFunc
@param {Object} ...Values - A function with a repeatable parameter
@memberof global 
*/
function GlobalFunc(Values) {
}

/**
@function global.GlobalFunc2 
@param {Object} [...Values] - A function with an optional and repeatable parameter
*/
function GlobalFunc2(Values) {
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
    @param {String} Param - Param description 
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
    @function Union
    Union (or). <br />Returns the union of A and B. <br />
    The result is a new set containing ALL the elements of A and B.  <br />
    <code>Result = A | B</code>
    @param {Integer} A 
    @param {Integer} B
    @return {Integer} 
     */
    Union: function (A, B) { return A | B; },
    /**
     @function Junction
    Intersection (and). <br />Returns the intersection of A and B. <br />
    The result is a new set containing just the COMMON the elements of A and B. <br />
    <code>Result = A &amp; B</code> 
    @param {Integer} A 
    @param {Integer} B
    @return {Integer} 
     */
    Junction: function (A, B) { return A & B; },
    /**
    @function Dif
    Difference (xor). <br />Returns the difference of A and B. <br />
    The result is a new set containing the NON COMMON the elements of A and B. <br />
    <code>Result = A ^ B</code>
    @param {Integer} A 
    @param {Integer} B
    @return {Integer} 
     */
    Dif: function (A, B) { return A ^ B; },
    /**
    @function Subtract
     * Subtraction (-). <br />Returns the subtraction of B from A. <br />   
    * The result is a new set containing the the elements of A MINUS the elements of B. <br />
    <code>Result = A ^ (A &amp; B)</code>
    @param {Integer} A 
    @param {Integer} B
    @return {Integer} 
     */
    Subtract: function (A, B) { return A ^ (A & B); },
    /**
    @function Member
    Membership (in). <br />Returns true if A in B. A can be a single value or a set. <br />   
    Returns true if ALL elements of A are in B. <br />   
    <code>Result = (A &amp; B) == A</code>
    @param {Integer} A 
    @param {Integer} B
    @return {Boolean} 
     */
    Member: function (A, B) { return 0 === A ? false : ((A & B) === A); },
    /**
    @function In
    Membership (in). <br />Returns true if A in B. A can be a single value or a set. <br />   
    Returns true if ALL elements of A are in B. <br />   
    <code>Result = (A &amp; B) == A</code>
    @param {Integer} A 
    @param {Integer} B
    @return {Boolean} 
     */
    In: function (A, B) { return 0 === A ? false : ((A & B) === A); },
    /**
    @function IsEmpty
    Returns true if A is null or 0.
    @param {Integer} A 
    @return {Boolean} 
     */
    IsEmpty: function (A) { return (A === tp.Undefined) || (A === null) || (Number(A) === 0); },
    /**
     @function EnumToString
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
    @function SetToString
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
@interface IListener
Represents an object that listens for notifications from a notifier
*/
 

/**
  @function OnNote Called by the notifier when sends a note.
  @param {tp.Args} Note - The note  send by the notifier.
  @return {Boolean} Returning true means the note is handled.
  @memberof IListener 
 */




/** 
@class tp.A A base class
@extends Object
@fires {tp.Args|OnAnyEvent} This is the description text
@fires {tp.Args|OnUserNameChanged} Description of the event
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
    This is a field
    */
    _.fName = '';

    /** 
    @property {string} Name 
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
    _.Func = function (x, z, y) { };

    return Class;
})(Object);

/**
@class tp.B
@augments tp.A
A derived class
@implements IListener
*/
tp.B = function Class(Name) {
        BaseClass.call(this);
}; 

(function (BaseClass) { 
    var Class = tp.B;
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

    /**
  @function OnNote Called by the notifier when sends a note.
  @param {tp.Args} Note - The note  send by the notifier.
  @return {Boolean} Returning true means the note is handled.
 */
    _.OnNote = function (Args) {

    };

    return Class;
})(tp.A);








 
 
 