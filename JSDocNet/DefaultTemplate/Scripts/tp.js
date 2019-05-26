/*--------------------------------------------------------------------------------------        
                           Copyright © 2016 Theodoros Bebekis
                               teo.bebekis@gmail.com 
                                    AntyxSoft
--------------------------------------------------------------------------------------*/
"use strict";
/*jshint newcap: false */
/*global Event:false */
/*global Promise:false */
/*jslint evil: true */
/*global $:false */

//#region log
if (!window.log) {
    window.log = function (v) {
        try {
            if (console) {
                console.log(v);
            }
            if (window.Debug) {
                Debug.writeln(v);
            }
        } catch (e) {
        }
    };
}
//#endregion


var tp = (function () {
    function Class(Selector) {
        /// <summary>If Selector is a string, then it returns the first found element in document, if any, else null.
        /// <para>If Selector is already an element, returns that element.</para>
        /// <para>Else returns null.</para>
        /// </summary>
        if (tp.IsString(Selector)) {
            return document.querySelector(Selector);
        } else if (tp.IsElement(Selector)) {
            return Selector;
        }

        return null;
    }

    var _ = Class;
   
   
    //---------------------------------------------------------------------------------------
    _.Error = function (Message) {
        /// <summary>Returns an error object for the caller to throw the error</summary>
        /// <param name="Message" type="string">The error message</param>         

        // http://stackoverflow.com/questions/783818/how-do-i-create-a-custom-error-in-javascript
        var Result = Error.apply(this, arguments);
        Result.name = 'TripousError';
        return Result;
    };
    _.ExceptionText = function (e) {
        /// <summary>Returns a text of an error for display purposes</summary>
        var SB = new tp.StringBuilder();
        var S, o;
        if (e instanceof window.Error) {
            SB.AppendLine(e.name + ': ' + e.message);
            SB.AppendLine(e.stack || 'Stack not available.')
        } else if (e instanceof window.ErrorEvent) {
            o = { Message: 'Unknown error.' };
            try {
                o = {
                    Message: e.message,
                    Name: (e.error && e.error.name) ? e.error.name : '',
                    Number: (e.error && e.error.number) ? e.error.number : null,
                    File: e.filename,
                    Line: e.lineno,
                    Col: e.colno,
                    Stack: (e.error && e.error.stack) ? e.error.stack : '',
                }; 
            } catch (e) {               
            }
            for (var Prop in o) {
                if (tp.IsSimple(o[Prop])) {
                    S = tp.Format('{0}: {1}', Prop, o[Prop]);
                    SB.AppendLine(S);
                }
            }
        } else if (tp.IsString(e)) {
            SB.AppendLine(e);
        } else if ('ErrorText' in e) {
            SB.AppendLine(e.ErrorText);
        } else if (('ResponseData' in e) && ('ErrorText' in e.ResponseData)) {
            SB.AppendLine(e.ResponseData.ErrorText);
        } else {
            try {
                S = e.toString();
                SB.AppendLine(S);
            } catch (e) {
                SB.AppendLine('Unknown error.');
            }
        }
        return SB.ToString();
    };
    //---------------------------------------------------------------------------------------
    _.Select = function (Selectors, elParent) {
        /// <summary>Returns all elements (as NodeList), that match the specified selector(s)</summary>

        elParent = elParent || document;
        if (Selectors) {
            return elParent.querySelectorAll(Selectors);
        }
        return null;
    };
    _.Child = function (el, Selector) {
        /// <summary>If Selector is a string, then it returns the first found child in an element , if any, else null.
        /// <para>If Selector is already an element, returns that element.</para>
        /// <para>Else returns null.</para>
        /// </summary>
        if (_.IsString(Selector)) {
            return el.querySelector(Selector);
        } else if (_.IsElement(Selector)) {
            return Selector;
        }

        return null;
    };
    _.Children = function (el, Selectors) {
        /// <summary>Returns all children (as NodeList) in an element, that match the specified selector(s)</summary>
        if (Selectors) {
            return el.querySelectorAll(Selectors);
        }
        return null;
    };
    _.Closest = function (el, Selector) {
        /// <summary> Returns the closest ancestor of the current element (or the current element itself) 
        /// which matches the selectors given in parameter. 
        /// If there isn't such an ancestor, it returns null.</summary>
        return el.closest(Selector);
    };
    _.FindTextNode = function (el) {
        if (_.IsElement(el) && el.hasChildNodes()) {
            var List = el.childNodes;
            for (var i = 0, ln = el.length; i < ln; i++) {
                if (List[i].nodeType === Node.TEXT_NODE) {
                    return true;
                }
            }

        }

        return null;
    };
    _.tpObjects = function (Selector) {
        /// <summary>Returns an array with all tp.Element objects constructed/existing up on child DOM elements of a specified parent element or the document</summary>
        /// <param name="Selector" type="String | DOM Element">Optional. The container of controls. If null/undefined/empty the document is used</param>
        /// <returns type="Array">Returns an array with tp.Element objects constructed up on elements of a parent element</returns>
        var elParent = null;
        if (!_.IsEmpty(Selector)) {
            elParent = _(Selector);
        }
        elParent = elParent || document;
        var NodeList = elParent.querySelectorAll('.tp-Object');
        var List = [];

        if (!_.IsEmpty(NodeList)) {
            for (var i = 0, ln = NodeList.length; i < ln; i++) {
                if (NodeList[i].tpObject) {
                    List.push(NodeList[i].tpObject);
                }
            }
        }

        return List;
    };
    _.ElementContains = function (Parent, Element) {
        /// <summary>Returns true when Element is contained directly or indirectly by Parent. </summary>
        if ('contains' in Parent) {
            return Parent.contains(Element);
        } else {
            var Node = Element.parentNode;
            while (!tp.IsEmpty(Node)) {
                if (Node === Parent) {
                    return true;
                }
                Node = Node.parentNode;
            }
            return false;
        }
    };
    _.FindControlById = function (ContainerSelector, Id) {
        /// <summary>Finds and return a tp.Elemement contained by a container, by Id. If not found, then null is returned</summary>
        /// <param name="ContainerSelector" type="String | DOM Element">Optional. The container of controls. If null/undefined/empty the document is used</param>
        /// <param name="Id" type="String">The Id to match</param>
        /// <returns type="tp.Elemement | null">Returns the tp.Element or null.</returns>
        var List = _.tpObjects(ContainerSelector);
        for (var i = 0, ln = List.length; i < ln; i++) {
            if (List[i].Id === Id)
                return List[i];
        }
        return null;
    };
    _.FindControlByProp = function (ContainerSelector, PropName, PropValue) {
        /// <summary>Finds and return a tp.Elemement contained by a container, by a property. If not found, then null is returned</summary>
        /// <param name="ContainerSelector" type="String | DOM Element">Optional. The container of controls. If null/undefined/empty the document is used</param>
        /// <param name="PropName" type="String">The property to match</param>
        /// <param name="PropValue" type="Any">The value to match</param>
        /// <returns type="tp.Element | null">Returns the tp.Element or null.</returns>
        var List = _.tpObjects(ContainerSelector);
        for (var i = 0, ln = List.length; i < ln; i++) {
            if (List[i][PropName] === PropValue)
                return List[i];
        }
        return null;
    };
    _.GetContainerByClass = function (el, ElementClass) {
        /// <summary>Returns a tp.Element instance associated to a dom element, 
        /// if the tp.Element is of a specified class. Returns null if nothing is found.
        /// <para> If the initially specified dom element does not pass the condition, 
        /// the search continues down to its parent until the document.body is reached. </para>
        /// <para>NOTE: To be used from inside event handler methods 
        ///  in order to find the right tp.Element sender instance. </para>
        /// </summary>
        /// <param name="el" type="HtmlElement">The element to start the checking.</param>
        /// <param name="ElementClass" type="class">A tp.tpObject class or a descendant that should match to a container's tp.Element class.</param>
        /// <returns type="tp.Element">Returns a tp.Element or null</returns>
        while (true) {
            if (el === el.ownerDocument.body)
                return null;

            if (el && (el.tpObject) && (el.tpObject instanceof ElementClass)) {
                return el.tpObject;
            }

            el = el.parentNode;
        }

        return null;
    };
    _.ChildIndex = function (elParent, el) {
        /// <summary>Returns the index of an element in its parent's children collection</summary>

        if (_.IsElement(el) && _.IsElement(elParent)) {
            var List = elParent.children; // children is a HTMLCollection, it provides no methods at all
            for (var i = 0, ln = List.length; i < ln; i++) {
                if (List[i] === el)
                    return i;
            }
        }        

        return -1;
    };
    //---------------------------------------------------------------------------------------
    _.DocumentPosition = (function () {
        /**
         * Compares the position of the a node against another node in any other document. <br />
         * 
         * @see The <a href="https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition">Node.compareDocumentPosition() in MDN</a>.
         * @see <a href="http://ejohn.org/blog/comparing-document-position/">John Resig blog</a>
         * 
         * @param {Element} elA The element to be used as base.  
         * @param {Element} elB The element to compare against base element.
         * @return {Integer} The return value is a bitmask   
         */
        function Class(elA, elB) {
            return elA.compareDocumentPosition(elB);
        }

        var _ = Class;

        /* Returns values */
        _.Identical = 0;                // Elements are identical.
        _.Disconnected = 1;             // The nodes are in different documents (or one is outside of a document).
        _.Preceding = 2;                // B is before A (could be its ancestor too, though)
        _.Following = 4;                // A is before B (could be its ancestor too, though)
        _.Ancestor = 8;                 //
        _.Descendant = 16;              //
        _.ImplementationSpecific = 32;  // For private use by the browser.

        /* methods */
        _.Contains = function (elA, elB) {
            /** True if A contains B  */
            var Res = _(elA, elB);
            return tp.Bf.In(_.Ancestor, Res);
        };
        _.ContainedBy = function (elA, elB) {
            /** True if B contains A  */
            var Res = _(elA, elB);
            return tp.Bf.In(_.Descendant, Res);
        };
        _.IsBefore = function (elA, elB) {
            /** True if B is before A (but B could be an ancestor of A at the same time too, though)  */
            var Res = _(elA, elB);
            return tp.Bf.In(_.Preceding, Res);
        };
        _.IsAfter = function (elA, elB) {
            /** True if A is before B (but A could be an ancestor of B at the same time too, though)  */
            var Res = _(elA, elB);
            return tp.Bf.In(_.Following, Res);
        };


        return Class;
    })();
    //---------------------------------------------------------------------------------------
    _.SetBaseClass = function (Class, BaseClass) {
        /// <summary>
        /// Sets BaseClass as the base class of Class.
        /// <para> Actually is a shortcut just to avoid writing the same code lines everywhere. </para>
        /// </summary>

        // new f() 
        //      produces a new object that inherits from
        // f.prototype   

        // see: http://stackoverflow.com/questions/9959727/proto-vs-prototype-in-javascript
        Class.prototype = Object.create(BaseClass.prototype);  // the prototype to be used when creating new instances
        Class.prototype.constructor = Class;                   // the function that used as the constructor
        return BaseClass.prototype;                            // return the base prototype, it is stored in a private variable inside class closures
    };
    _.Property = function (Name, Prototype, GetFunc, SetFunc) {
        /// <summary>Defines a named or accessor property in a class prototype</summary>
        var o = {};
        if (_.IsFunction(GetFunc)) {        // it is a named accessor property
            o.get = GetFunc;
            if (_.IsFunction(SetFunc)) {    // if not present, it effectively creates a read-only property
                o.set = SetFunc;
            }
        } else {                            // it is a named property
            o.value = GetFunc;
            o.writable = true;
        }
        o.enumerable = true;
        o.configurable = true;
        Object.defineProperty(Prototype, Name, o);
    };
    _.Constant = function (Name, Prototype, Value) {
        /// <summary>Defines a constant in a class prototype</summary>
        var o = {
            value: Value,
            writable: false,
            enumerable: false,
            configurable: false,
        };

        Object.defineProperty(Prototype, Name, o);
    };
    //---------------------------------------------------------------------------------------
    _.Constant('Undefined', _, void 0); // http://stackoverflow.com/questions/7452341/what-does-void-0-mean
    //---------------------------------------------------------------------------------------
    _.GetPropertyDescriptor = function (o, PropName) {
        /// <summary>Returns the property descriptor of a specified property, if any, else null.
        /// <para> Can be used also for calling inherited property getters/setters. </para>
        /// <para> Example base getter call: return tp.GetPropertyDescriptor(base, 'Name').get.call(this);   </para>
        /// <para> Example base setter call: tp.GetPropertyDescriptor(base, 'Name').set.call(this, v); </para>
        /// <para> NOTE: In both of the above examples, base is the base prototype  </para>
        /// </summary>
        /// <param name="o" type="Object">An object (maybe a prototype object)</param>
        /// <param name="PropName" type="String">The name of the property.</param>
        /// <returns type="PropertyDescriptor">Returns the property descriptor or null.</returns>
        if (o !== null) {
            return o.hasOwnProperty(PropName) ?
                  Object.getOwnPropertyDescriptor(o, PropName) :
                  _.GetPropertyDescriptor(Object.getPrototypeOf(o), PropName);
        }

        return null;
    };
    _.GetProperty = function (o, Key) {
        var PD = _.GetPropertyDescriptor(o, Key);
        var Result = {
            Name: Key,
            Signature: Key,
            Type: '',
            Args: 0,
            HasGetter: false,
            HasSetter: false,
            IsConstructor: false,
            IsFunction: false,
            IsProperty: false,
            IsConfigurable: false,
            IsEnumerable: false,
            IsWritable: false,
            Pointer: null,
        };

        if (PD) {
            var Pointer = o[Key];
            var ParamList;

            Result.Name = Key;
            if (_.IsFunction(Pointer)) {
                Result.Type = 'f';
                Result.IsFunction = true;
                Result.Args = Pointer.length || 0;
                ParamList = Result.Args > 0 ? _.GetFunctionParams(Pointer) : [];
                Result.Signature = 'function ' + Key + '(' + ParamList.join(',') + ')';

            } else if (_.IsArray(Pointer)) {
                Result.Type = 'a';
            } else {
                Result.Type = 'o';
            }

            Result.HasGetter = Boolean(PD.get);
            Result.HasSetter = Boolean(PD.set);
            Result.IsConstructor = _.IsSameText('constructor', Key);
            Result.IsProperty = !Result.IsFunction && !Result.IsConstructor;
            Result.IsConfigurable = PD.configurable;
            Result.IsEnumerable = PD.enumerable;
            Result.IsWritable = PD.writable || PD.set;
            Result.Pointer = Pointer;
        }

        return Result;
    };
    _.GetProperties = function (o) {
        var A = [];

        if (o) {
            var P;
            for (var Prop in o) {
                P = _.GetProperty(o, Prop);
                if (P)
                    A.push(P);
            }
        }

        return A;
    };
    _.GetReflectionText = function (o) {

        var A = _.GetProperties(o);

        var S;
        var f = '{0} {1} {2} {3} {4} {5} {6} {7} {8}';
        var SB = new _.StringBuilder();

        A.forEach(function (P) {
            S = _.Format(f,
                P.Type,
                P.Args,
                P.IsConstructor ? 'c' : '_',
                P.HasGetter ? 'g' : '_',
                P.HasSetter ? 's' : '_',

                P.IsConfigurable ? 'c' : '_',
                P.IsEnumerable ? 'e' : '_',
                P.IsWritable ? 'w' : '_',
                P.Signature
                );

            SB.AppendLine(S);
        });

        S = SB.ToString();

        return S;
    };
    _.GetObjectDefText = function (o) {
        var A = _.GetProperties(o);

        var Constr = '';
        var Props = [];
        var Funcs = [];

        var i, ln;
        for (i = 0, ln = A.length; i < ln; i++) {
            if (A[i].IsFunction) {
                Funcs.push(A[i].Signature);
            } else if (A[i].IsConstructor) {
                Constr = A[i].Signature;
            } else {
                Props.push(A[i].Signature);
            }
        }

        Props.sort();
        Funcs.sort();

        var SB = new _.StringBuilder();

        if (Constr !== '') {
            SB.AppendLine('constructor ' + Constr);
        }

        if (Props.length > 0) {
            SB.AppendLine();
            SB.AppendLine('// properties');
            for (i = 0, ln = Props.length; i < ln; i++) {
                SB.AppendLine(Props[i]);
            }
        }

        if (Funcs.length > 0) {
            SB.AppendLine();
            SB.AppendLine('// methods');
            for (i = 0, ln = Funcs.length; i < ln; i++) {
                SB.AppendLine(Funcs[i]);
            }
        }

        return SB.ToString();

    };
    _.GetFunctionParams = function (func) {
        // http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
        return (func + '').replace(/\s+/g, '')
          .replace('/[/][*][^/*]*[*][/]/g', '')           // strip simple comments  
          .split('){', 1)[0].replace(/^[^(]*[(]/, '')   // extract the parameters  
          .replace('/=[^,]+/g', '')                       // strip any ES6 defaults  
          .split(',').filter(Boolean);                  // split & filter [""]  
    };
    //---------------------------------------------------------------------------------------    
    var toString = Object.prototype.toString;
    var cPrimitives = ['[object String]', '[object Number]', '[object Boolean]'];
    var cSimple = ['[object String]', '[object Number]', '[object Boolean]', '[object Date]'];

    _.IsEmpty = function (v) { return v === null || v === void 0; };           // null or undefined
    _.IsValid = function (v) { return !(v === null || v === void 0); };

    _.IsString = function (v) { return toString.call(v) === "[object String]"; };
    _.IsNumber = function (v) { return toString.call(v) === "[object Number]"; };
    _.IsBoolean = function (v) { return toString.call(v) === "[object Boolean]"; };  // || v === true || v === false 
    _.IsDate = function (v) { return toString.call(v) === "[object Date]"; };
    _.IsObject = function (v) { return toString.call(v) === "[object Object]"; };
    _.IsArray = function (v) { return (v instanceof Array) || toString.call(v) === '[object Array]'; };
    _.IsFunction = function (v) { return toString.call(v) === "[object Function]"; };
    _.IsArguments = function (v) { return toString.call(v) === "[object Arguments]"; };
    _.IsRegExp = function (v) { return toString.call(v) === "[object RegExp]"; };
    _.IsPrimitive = function (v) { return cPrimitives.indexOf(toString.call(v)) > -1 && !_.IsEmpty(v); };
    _.IsSimple = function (v) { return cSimple.indexOf(toString.call(v)) > -1 && !_.IsEmpty(v); };

    _.IsPlainObject = function (v) { return (_.IsObject(v) && !v.nodeType); };
    _.IsElement = function (v) { return !!(v && v.nodeType === Node.ELEMENT_NODE); };
    _.IsAttribute = function (v) { return !!(v && v.nodeType === Node.ATTRIBUTE_NODE); };
    _.IsText = function (v) { return !!(v && v.nodeType === Node.TEXT_NODE); };
    _.ElementIs = function (v, NodeName) { return _.IsElement(v) && _.IsSameText(v.nodeName, NodeName); };

    _.IsNaN = function (v) { return isNaN(v); };
    _.IsFinite = function (v) { return isFinite(v); };

    _.IsjQuery = function (v) { return v instanceof $; };
    //---------------------------------------------------------------------------------------
    _.Call = function (Func, Context, Arg0, Arg1, Arg2, Arg3, Arg4, Arg5) {
        ///<summarry> Calls a function, using a context if not null, passing the specified arguments </summarry> 
        if (tp.IsFunction(Func)) {
            return Func.call(Context, Arg0, Arg1, Arg2, Arg3, Arg4, Arg5);
        }

        return null;
    };

    // separators ---------------------------------------------------------------------------   
    _.DecimalSeparator = null;
    _.ThousandSeparator = null;
    _.DateSeparator = null;
    (function () {
        var n = 1.1;
        _.DecimalSeparator = n.toLocaleString().substring(1, 2);

        n = 1000;
        _.ThousandSeparator = n.toLocaleString().substring(1, 2);

        var D = new Date();
        var S = D.toLocaleDateString();
        if (S.indexOf('/') !== -1) {
            _.DateSeparator = '/';
        } else if (S.indexOf('.') !== -1) {
            _.DateSeparator = '.';
        } else {
            _.DateSeparator = '-';
        }
 
    })();
 
 
    // strings ------------------------------------------------------------------------------  
    _.IsNullOrWhitespace = function (v) {
        /// <summary>
        /// True if v is null, undefined or it just contains white space chars
        /// </summary>

        if ((v === _.Undefined) || (v === null))
            return true;

        if (!_.IsString(v)) {
            throw new _.Error('Can not check for null or whitespace a non-string value');
        }

        return v.replace(/\s/g, '').length < 1;
    };
    _.IsBlank = _.IsNullOrWhitespace;
    _.IsWhitespaceChar = function (c) {
        return ' \t\n\r\v'.indexOf(c) > -1;
    };
    _.Format = function (s, values) {
        /// <summary>Formats a string the C# way</summary>
        var i, ln, Params = [];
        for (i = 1, ln = arguments.length; i < ln; i++) {
            Params.push(arguments[i]);
        }

        if (_.IsString(s)) {
            for (i = 0; i < Params.length; i++) {
                var regEx = new RegExp("\\{" + (i) + "\\}", "gm");
                s = s.replace(regEx, Params[i]);
            }
        }

        return s;
    };
    _.FormatNumber = function (v, Decimals, DecimalSep, ThousandSep) {
        /// <summary>
        /// Formats a number into a string.
        /// <para> Decimals is the number of decimal places into string. </para>
        /// <para> If DecimalSep or ThousandSep are not defined, the corresponging tripous globals are used. </para>
        /// </summary>

        if (_.IsNaN(v) || !_.IsValid(v))
            return '';

        DecimalSep = DecimalSep || _.DecimalSeparator;
        ThousandSep = ThousandSep || _.ThousandSeparator;

        var S = v.toFixed(~~Decimals);

        var Parts = S.split('.');
        var NumPart = Parts[0];
        var DecPart = Parts[1] ? DecimalSep + Parts[1] : '';

        return NumPart.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + ThousandSep) + DecPart;
    };
    _.IsSameText = function (A, B) {
        /// <summary>
        /// True if A and B are the same text, case-insensitively always
        /// </summary>
        return _.IsValid(A) && _.IsValid(B) && (A.toUpperCase() === B.toUpperCase());
    };
    _.ContainsText = function (v, Text, CI) {
        /// <summary>
        /// True if Text is in v.
        /// <para> CI (Case-Insensitive) can be true (the default) or false  </para>
        /// </summary>
        if (_.IsEmpty(CI)) {
            CI = true;
        }

        var rx = CI ? new RegExp(Text, "i") : new RegExp(Text);
        return rx.test(v);
    };
    _.InsertText = function (v, Index, Text) {
        /// <summary>Inserts Text in v at Index</summary>
        return [v.slice(0, Index), Text, v.slice(Index)].join('');
    };
    _.Trim = function (v) {
        return _.IsBlank(v) ? "" : v.replace(/^\s+|\s+$/g, "");
    };
    _.TrimStart = function (v) {
        return _.IsBlank(v) ? "" : v.replace(/^\s+/, "");
    };
    _.TrimEnd = function (v) {
        return _.IsBlank(v) ? "" : v.replace(/\s+$/, "");
    };
    _.StartsWith = function (v, Text, CI) {
        /// <summary>
        /// True if v starts with Text.
        /// <para> CI (Case-Insensitive) can be true (the default) or false  </para>
        /// </summary>


        if (_.IsBlank(v) || _.IsBlank(Text))
            return false;

        if (_.IsEmpty(CI)) {
            CI = true;
        }

        return CI === true ? v.substring(0, Text.length).toUpperCase() === Text.toUpperCase() : v.substring(0, Text.length) === Text;
 
    };
    _.EndsWith = function (v, Text, CI) {
        /// <summary>
        /// True if v ends with Text.
        /// <para> CI (Case-Insensitive) can be true (the default) or false  </para>
        /// </summary>

        if (_.IsBlank(v) || _.IsBlank(Text))
            return false;

        if (_.IsEmpty(CI)) {
            CI = true;
        }
        
        return CI === true ? v.substring(v.length - Text.length, v.length).toUpperCase() === Text.toUpperCase() : v.substring(v.length - Text.length, v.length) === Text;
 
    };
    _.Replace = function (v, OldValue, NewValue) {
        return v.replace(OldValue, NewValue);
    };
    _.ReplaceAll = function (v, OldValue, NewValue, CI) {
        /// <summary>
        /// Replaces all occurences of OldValue found into v with NewValue and returns v.
        /// <para> CI (Case-Insensitive) can be true (the default) or false  </para>
        /// </summary>
        OldValue = _.RegExEscape(OldValue);
        var Flags = CI === true ? 'igm' : 'gm';
        return v.replace(new RegExp(OldValue, Flags), NewValue);
    };
    _.ReplaceCharAt = function (v, Index, NewChar) {
        return [v.slice(0, Index), NewChar, v.slice(Index + 1)].join('');
    };
    _.Quote = function (v, DoubleQuotes) {
        /// <summary>
        /// Places single or double quotes around v (defaults to single)
        /// </summary>
        DoubleQuotes = DoubleQuotes === true;

        if (_.IsValid(v)) {
            if (DoubleQuotes) {
                v = v.replace(/"/gm, '\\"');
                v = '"' + v + '"';
            } else {
                v = v.replace(/'/gm, "\\'");
                v = "'" + v + "'";
            }
        }

        return v;
    };
    _.Unquote = function (v) {
        /// <summary>
        /// Unquotes v if it is surrounded by single or double quotes.
        /// </summary>
        if (_.IsValid(v)) {
            if (v.charAt(0) === '"') {
                return v.replace(/(^")|("$)/g, '');
            } else if (v.charAt(0) === "'") {
                return v.replace(/(^')|('$)/g, '');
            }
        }

        return v;
    };
    _.Chunk = function (S, ChunkSize) {
        /// <summary>Splits a string into chunks according to a specified chunk size and returns an array of strings.</summary>
        var rg = new RegExp('.{1,' + ChunkSize + '}', 'g');
        var A = S.match(rg);
        return A;
    };
    _.Split2 = function (v, Delimiter) {
        /// <summary>
        /// Splits v into an array based on Delimiter. No empty entries are returned.
        /// <para> from http://stackoverflow.com/questions/10617400/javascript-splitting-a-string-by-comma-but-ignoring-commas-in-quotes  </para>
        ///</summary>

        Delimiter = Delimiter || ';';
        var Result = [];

        if (!_.IsBlank(v)) {
            var Expr = "([^\"\'DELIM]*((\'[^\']*\')*||(\"[^\"]*\")*))+";
            var Pattern = Expr.replace("DELIM", Delimiter);
            var rx = new RegExp(Pattern, "gm");

            var item;
            var matches = v.match(rx);

            if (matches) {
                for (var i = 0; i < matches.length; i++) {
                    item = _.Trim(matches[i]);
                    if (item.length) {
                        Result.push(item);
                    }
                }
            }
        }

        return Result;
    };
    _.Split = function (v, Separator, RemoveEmptyEntries) {
        /// <summary>splits a String object into an array of strings by separating the string into substrings.</summary>
        /// <param name="v" type="String">The string to operate on</param>
        /// <param name="Separator" type="String">Optional. Specifies the character(s) to use for separating the string. 
        /// <para>The separator is treated as a string or a regular expression.</para>
        /// <para>If separator is omitted, the array returned contains one element consisting of the entire string. </para>
        /// <para>If separator is an empty string, str is converted to an array of characters</para></param>
        /// <param name="RemoveEmptyEntries" type="Boolean">Defaults to true. When true, then empty entries are removed from result.</param>
        /// <returns type=""></returns>

        if (!_.IsBoolean(RemoveEmptyEntries))
            RemoveEmptyEntries = true;

        if (RemoveEmptyEntries) {
            var Parts = v.split(Separator);
            var A = [];
            for (var i = 0, ln = Parts.length; i < ln; i++) {
                if (!_.IsBlank(Parts[i]))
                    A.push(Parts[i]);
            }
            return A;
        } else {
            return v.split(Separator);
        }

    };
    _.SplitDescriptor = function (v) {
        /// <summary>v MUST have the format
        /// <para> Key0:Value0; KeyN:ValueN; </para>
        /// <para>where Value could be any value, or string (with single or double quotes) </para>
        ///</summary>
        var Result = {};

        if (_.IsString(v)) {
            var Lines = _.Split(v, ";");
            var parts;

            var Key;
            var Value;

            if (Lines) {
                for (var i = 0; i < Lines.length; i++) {
                    parts = _.Split(Lines[i], ":");
                    if (parts && (parts.length === 2)) {
                        Key = _.Unquote(_.Trim(parts[0]));
                        Value = _.Unquote(_.Trim(parts[1]));

                        if (Key.length && Value.length) {
                            Result[Key] = Value;
                        }
                    }
                }
            }
        }

        return Result;
    };
    _.Join = function (Separator, values) {
        /// <summary>
        /// Returns a united string by joining values with Separator
        /// </summary>

        Separator = Separator || '';

        var i, ln, Params = [];
        for (i = 1, ln = arguments.length; i < ln; i++) {
            Params.push(arguments[i]);
        }

        return Params.join(Separator);
    };
    _.CommaText = function (values) {
        /// <summary>
        /// Returns a united string by joining values with , character and a space
        /// </summary>

        var i, ln, Params = [];
        for (i = 0, ln = arguments.length; i < ln; i++) {
            Params.push(arguments[i]);
        }
        return Params.join(',  ');
    };
    _.ToLines = function (v) {
        /// <summary>
        /// Returns an array of strings, by splitting v, taking new line character as separator
        /// </summary>

        if (!_.IsBlank(v)) {
            var SEP = '##__##';
            v = _.ReplaceAll(v, '\r\n', SEP);
            v = _.ReplaceAll(v, '\n', SEP);
            return v.split(SEP);
        }
        return [];
    };
    _.LineBreaksToHtml = function (v) {
        if (!_.IsBlank(v)) {
            var SEP = '##__##';
            v = _.ReplaceAll(v, '\r\n', SEP);
            v = _.ReplaceAll(v, '\n', SEP);
            v = _.ReplaceAll(v, SEP, '<br />');
        }

        return v;
    };
    _.Repeat = function (v, Count) {
        /// <summary>
        /// Creates and returns a string repeating v Count times
        /// </summary>
        var Result = "";

        for (var i = 0; i < Count; i++) {
            Result += v;
        }
        return Result;
    };
    _.PadLeft = function (v, PadText, TotalLength) {
        /// <summary>
        /// Pads v from left side with PadText until TotalLength
        /// </summary>
        if (!_.IsValid(v))
            return v;

        TotalLength = ~~TotalLength;
        v = String(v);
        if (v.length < TotalLength) {
            PadText = _.Repeat(PadText, TotalLength - v.length);
            v = PadText + v;
        }

        return v;
    };
    _.PadRight = function (v, PadText, TotalLength) {
        /// <summary>
        /// Pads v from right side with PadText until TotalLength
        /// </summary>
        if (!_.IsValid(v))
            return v;

        TotalLength = ~~TotalLength;
        v = String(v);
        if (v.length < TotalLength) {
            PadText = _.Repeat(PadText, TotalLength - v.length);
            v = v + PadText;
        }

        return v;
    };
    _.SetLength = function (v, NewLength) {
        /// <summary>
        /// Truncates v to NewLength if v.length is greater than NewLength. Returns the truncated v.
        /// </summary>
        if (_.IsBlank(v))
            return "";

        v = String(v);
        NewLength = ~~NewLength;
        if (v.length > NewLength) {
            v = v.slice(0, NewLength);
        }
        return v;
    };
    _.StrToInt = function (v, Default) {
        if (_.IsBlank(v))
            return _.IsEmpty(Default) ? 0 : Default;
        var n = parseInt(v, 10);
        if (_.IsNaN(n) || !_.IsFinite(n)) {
            return _.IsEmpty(Default) ? 0 : Default;
        }
        return n;
    };
    _.StrToFloat = function (v, Default) {
        if (_.IsBlank(v))
            return 0;
        var n = parseFloat(v);
        if (_.IsNaN(n) || !_.IsFinite(n)) {
            return _.IsEmpty(Default) ? 0 : Default;
        }
        return n;
    };
    _.StrToBool = function (v, Default) {
        Default = Default === true;

        if (_.IsSameText(v, "true")) {
            return true;
        } else if (_.IsSameText(v, "false")) {
            return false;
        }

        return Default;
    };

    _.TryStrToInt = function (v) {
        v = parseInt(v, 10);
        var Info = {
            Value: v,
            Result: isNaN(v) ? false : true,
        };

        return Info;
    };
    _.TryStrToFloat = function (v) {
        v = parseFloat(v);
        var Info = {
            Value: v,
            Result: isNaN(v) || !isFinite(v) ? false : true,
        };

        return Info;
    };
    _.ToHex = function (v) {
        if (v < 0) {
            v = 0xFFFFFFFF + v + 1; // ensure not a negative number
        }

        var S = v.toString(16).toUpperCase();
        while (S.length % 2 !== 0) {
            S = '0' + S;
        }
        return S;
    };
    _.RegExEscape = function (v) {
        return v.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, "\\$1");
    };
    _.DashToCamelCase = function (v) {
        /// <summary> Converts a dashed string to camel case, i.e. background-color to backgroundColor and -webkit-user-select to webkitUserSelect </summary>
        if ((v.length > 1) && (v.charAt(0) === '-')) {
            v = v.substring(1);
        }

        v = v.replace(/-([\da-z])/gi, function (match, c) {
            return c.toUpperCase();
        });

        return v;
    };

    _.UrlCombine = function (A, B) {
        if (!_.EndsWith(A, '/') && !_.StartsWith(B, '/'))
            A += '/';
        return A + B;
    };
    _.EncodeArgs = function (v) {
        /// <summary>
        /// Encode arguments for use with GET/POST ajax operations
        /// </summary>
        var i, ln, Data = [];

        var append = function (Key, Value) {
            Value = _.IsEmpty(Value) ? "" : Value;
            Data[Data.length] = encodeURIComponent(Key) + "=" + encodeURIComponent(Value);
        };

        if (_.IsArray(v) && (v.length > 0)) {
            if (_.IsElement(v[0])) {
                for (i = 0, ln = v.length; i < ln; i++) {
                    append(v[i].name, v[i].value);
                }
            } else {
                for (i = 0, ln = v.length; i < ln; i++) {
                    append("v" + i.toString(), v);
                }
            }
        } else if (_.IsPlainObject(v)) {
            for (var Prop in v) {
                append(Prop, v[Prop]);
            }
        }

        var S = Data.join('&');
        S = S.replace(/%20/g, '+');

        return S;
    };
    _.FieldPath = function (TableName, FieldName) {
        if (!_.IsBlank(TableName) && !_.IsBlank(FieldName))
            return TableName + '.' + FieldName;

        if (!_.IsBlank(TableName))
            return TableName;

        if (!_.IsBlank(FieldName))
            return FieldName;
    };
    _.FieldAlias = function (TableName, FieldName) {
        if (!_.IsBlank(TableName) && !_.IsBlank(FieldName))
            return TableName + '__' + FieldName;

        if (!_.IsBlank(TableName))
            return TableName;

        if (!_.IsBlank(FieldName))
            return FieldName;
    };
    _.Guid = function (UseBrackets) {
        /// <summary>
        /// Returns a new guid string.
        /// </summary>
        if (typeof UseBrackets === _.Undefined) { UseBrackets = false; }
        var Result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16).toUpperCase();
        });

        return !UseBrackets ? Result : "{" + Result + "}";
    };
    _.CreateFunction = function (v) {
        /// <summary>Creates a function from a string. 
        /// <para> i.e. var func = tp.CreateFunction('function (a, b) { return a + b; }');</para>
        /// <para>FROM: http://stackoverflow.com/questions/7650071/is-there-a-way-to-create-a-function-from-a-string-with-javascript</para>
        ///</summary>
        var funcReg = /function *\(([^()]*)\)[ \n\t]*\{(.*)\}/gmi;
        var match = funcReg.exec(v.replace(/\n/g, ' '));

        if (match) {
            return new Function(match[1].split(','), match[2]);
        }

        return null;
    };

    _.ToBase64 = function (s) {
        return window.btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    };
    _.FromBase64 = window.atob;
    // arrays  ------------------------------------------------------------------------------ 

    // reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
    // compatibility: http://kangax.github.io/compat-table/es5/
    _.ListContains = function (List, v) {
        var i = List.length;
        while (i--) {
            if (List[i] === v) {
                return true;
            }
        }
        return false;
    };
    _.ListContainsText = function (List, v) {
        var S, i = List.length;
        while (i--) {
            S = !_.IsEmpty(List[i]) ? List[i].toString() : '';
            if (_.IsSameText(S, v)) {
                return true;
            }
        }
        return false;
    };
    _.ListIndexOfText = function (List, v) {
        var S;
        for (var i = 0, ln = List.length; i < ln; i++) {
            S = !_.IsEmpty(List[i])? List[i].toString(): '';
            if (_.IsSameText(S, v))
                return i;
        }
        return -1;
    };
    _.ListRemove = function (List, v) {
        /// <summary>Returns an array with the removed element</summary>
        var i = List.indexOf(v);
        if (i !== -1) {
            return List.splice(i, 1);
        }

        return [];
    };
    _.ListRemoveAt = function (List, Index) {
        /// <summary>Returns an array with the removed element</summary>
        return List.splice(Index, 1);
    };
    _.ListClear = function (List) {
        List.length = 0;
    };
    _.ListClone = function (List, Deep) {
        /// <summary>Returns an array with the removed elements</summary>

        Deep = Deep || true;

        var i, ln, item, o, Result;

        if (Deep) {
            if (List.length) {
                Result = [];
                for (i = 0, ln = List.length; i < ln; i++) {
                    item = List[i];
                    if (_.IsSimple(item)) {
                        Result.push(item);
                    } else {
                        o = _.Merge({}, item, true, true);
                        Result.push(o);
                    }
                }
                return Result;
            } else {
                return List;
            }
        } else {
            Result = [];
            for (i = 0, ln = List.length; i < ln; i++) {
                Result.push(List[i]);
            }
            return Result;
        }


    };
    _.ListInsert = function (List, Index, v) {
        List.splice(Index, 0, v);
    };

    _.ListSort = function (List, InfoList) {
        /// <summary>Sorts an array in place by multiple properties. 
        /// <para> The array could be an array of plain objects or an array of arrays of primitive values. </para>
        /// <para> Example 1: </para>  
        /// <para> var List = [ [true, 4], [false, 1], [true, 2]];</para>
        /// <para> tp.ListSort(List, [{ Prop: 1, Reverse: true }, 0]); // sorts by integer + boolean based on index</para>
        /// <para> </para>
        /// <para> Example 1: </para>  
        /// <para> var List = [{ Name: 'John', Age: 30 }, { Name: 'Jane', Age: 31 }, { Name: 'Jack', Age: 20 }, ]; </para>
        /// <para> tp.ListSort(List, [{ Prop: 'Age', Reverse: true }]); </para>
        /// <para> or </para>
        /// <para> tp.ListSort(List, ['Name']); </para>
        /// </summary>   
        /// <param name="List" type="Array">A collection of plain objects, or a collection of arrays of primitive values</param>
        /// <param name="InfoList" type="Array"> A collection of values. 
        /// <para>A value could be either a string (property name), or an integer (array index), or an object as {Prop: String | Integer, Reverse: Boolean, GetValue: function (ArrayRow, Info) } </para>
        ///</param>

        //----------------------------
        var GetInfoValue = function (Row, Info) {
            return Row[Info.Prop];
        };
        //----------------------------
        var Sort = function (A, B) {
            var i, ln, Info, a, b, Result = 0;

            for (i = 0, ln = InfoList.length; i < ln; i++) {
                Info = InfoList[i];

                // get the values
                a = Info.GetValue(A, Info);
                b = Info.GetValue(B, Info);

                // compare
                Result = (a === b) ? 0 : (Info.Reverse ? (a > b ? -1 : 1) : (a < b ? -1 : 1));

                if (Result !== 0) {
                    break;
                }
            }

            return Result;
        };
        //----------------------------

        var i, ln, Info, o;

        // prepare the info items
        for (i = 0, ln = InfoList.length; i < ln; i++) {
            o = InfoList[i];

            if (tp.IsString(o) || tp.IsNumber(o)) {
                Info = {
                    Prop: o,
                    Reverse: false,
                };

                InfoList[i] = Info;
            }

            InfoList[i].GetValue = InfoList[i].GetValue || GetInfoValue;

        }

        // sort
        List.sort(Sort);

    };
    _.ListFilter = function (List, InfoList, OrLogic) {
        /// <summary>Filters an array by multiple properties and returns the new filtered array.
        /// <para> The array could be an array of plain objects or an array of arrays of primitive values. </para>
        /// <para> Example 1: </para>  
        /// <para> var List = [ [true, 4], [false, 1], [true, 2]];</para>
        /// <para> var List = tp.ListFilter(List, [{ Prop: 1, Operator: tp.FilterOp.Equal, Value: true }], false); // filters based on index</para>
        /// <para> </para>
        /// <para> Example 1: </para>  
        /// <para> var List = [{ Name: 'John', Age: 30 }, { Name: 'Jane', Age: 31 }, { Name: 'Jack', Age: 20 }, ]; </para>
        /// <para> var List = tp.ListFilter(List, [{ Prop: 'Name', Operator: tp.FilterOp.Contains, Value: 'o', }], false); </para>
        /// </summary>
        /// <param name="List" type="Array">A collection of plain objects, or a collection of arrays of primitive values</param>
        /// <param name="InfoList" type="Array"> A collection of objects as 
        /// <para> { Prop: String | Integer, Operator: tp.FilterOp, Value: Any, FilterFunc: function (ArrayRow, Info) } </para>
        /// </param>
        /// <param name="OrLogic" type="Boolean">Defaults to false. True for OR logic, false for AND logic</param>
        /// <returns type="Array">A new array after filtering the passed input array.</returns>

        //----------------------------
        var FilterInfoFunc = function (Row, Info) {
            var Value = Row[Info.Prop];
            return _.FilterOp.Compare(Info.Operator, Value, Info.Value);
        };
        //----------------------------
        var FilterFunc = function (Value, Index, A) {
            var i, ln, Info,
                Result = OrLogic ? false : true;

            for (i = 0, ln = InfoList.length; i < ln; i++) {
                Info = InfoList[i];

                Result = Info.FilterFunc(Value, Info);
                if (!OrLogic) {
                    if (!Result) {
                        break;
                    }
                } else if (Result) {
                    break;
                }

            }


            return Result;
        };
        //----------------------------

        var i, ln, Info;


        // prepare the info items
        for (i = 0, ln = InfoList.length; i < ln; i++) {
            Info = InfoList[i];

            Info.Operator = Info.Operator || tp.FilterOp.Equal;
            if (!tp.IsFunction(Info.FilterFunc)) {
                Info.FilterFunc = FilterInfoFunc;
            }

        }

        // filter
        return List.filter(FilterFunc);

    };

    _.ForEach = function (List, Func, Context) {
        /// <summary>executes a provided function once per array element</summary>
        /// <param name="List" type="Array">The array to operate up on</param>
        /// <param name="Func" type="Function">function(value, index, array), to be called on Context for each element.</param>
        /// <param name="Context" type="Object">The context (this) to use when calling Func. Could be null.</param>
        return List.forEach(Func, Context);
    };
    _.Any = function (List, Func, Context) {
        /// <summary>returns true if callback returns true on any element.</summary>
        /// <param name="List" type="Array">The array to operate up on</param>
        /// <param name="Func" type="Function">function(value, index, array), to be called on Context for each element.</param>
        /// <param name="Context" type="Object">The context (this) to use when calling Func. Could be null.</param>

        if (_.IsFunction(List.some)) {
            return List.some(Func, Context);
        } else {
            for (var i = 0, ln = List.length; i < ln; i++) {
                if (true === Func.call(Context, List[i], i, List)) {
                    return true;
                }
            }
            return false;
        }

    };
    _.All = function (List, Func, Context) {
        /// <summary>returns true if all elements in the array pass the test implemented by the provided function.</summary>
        /// <param name="List" type="Array">The array to operate up on</param>
        /// <param name="Func" type="Function">function(value, index, array), to be called on Context for each element.</param>
        /// <param name="Context" type="Object">The context (this) to use when calling Func. Could be null.</param>
        return List.every(Func, Context);
    };
    _.Filter = function (List, Func, Context) {
        /// <summary>returns a new array with all elements that pass the test implemented by the provided function.</summary>
        /// <param name="List" type="Array">The array to operate up on</param>
        /// <param name="Func" type="Function">function(value, index, array), to be called on Context for each element.</param>
        /// <param name="Context" type="Object">The context (this) to use when calling Func. Could be null.</param>
        return List.filter(Func, Context);
    };
    _.Transform = function (List, Func, Context) {
        /// <summary>returns a new array with the results of calling a provided function on every element in this array.</summary>
        /// <param name="List" type="Array">The array to operate up on</param>
        /// <param name="Func" type="Function">function(value, index, array), to be called on Context for each element.</param>
        /// <param name="Context" type="Object">The context (this) to use when calling Func. Could be null.</param>
        return List.map(Func, Context);
    };
 
    _.Distinct = function (List, Prop) {
        /// <summary>Applicable to array of objects. 
        /// Selects all objects found in this array by having a distinct value in a specified property.</summary>
        /// <param name="Prop" type="String">The name of the property to look for distinct values.</param>
        /// <returns type="Array">A new array with objects having a distinct value in the specified property. or an empty array. </returns>
        var Unique = {};
        var Result = [];

        var o;
        for (var i = 0, ln = List.length; i < ln; i++) {
            o = List[i];
            if (!Unique[o[Prop]]) {
                Result.push(o);
                Unique[o[Prop]] = true;
            }
        }

        return Result;
    };
    _.Where = function (List, Prop, v) {
        /// <summary>Returns a new array containing any object found in this array having a specified property with a specified value.</summary>
        /// <param name="Prop" type="String">The name of the property to match</param>
        /// <param name="v" type="Any">The value the property must have
        /// <para>NOTE: If v is an object (that is NOT string, number, boolean, null, undefined) then a reference equality check takes place.</para></param>
        /// <returns type="Array">May be an empty array.</returns>

        var Result = [];

        var o;
        for (var i = 0, ln = List.length; i < ln; i++) {
            o = List[i];
            if (o[Prop] === v) {
                Result.push(o);
            }
        }

        return Result;
    };
    _.WhereAll = function (List, Props) {
        /// <summary>Returns a new array containing any object found in this array having the properties and the values of a specified object.</summary>
        /// <param name="Props" type="Object">An object with one or more properties to check for matchings</param>
        /// <returns type="Array">May be an empty array.</returns>

        var Result = [];

        var o;
        for (var i = 0, ln = List.length; i < ln; i++) {
            o = List[i];
            if (_.Equals(o, Props)) {
                Result.push(o);
            }
        }

        return Result;
    };

    _.FirstOrNull = function (List, Func, Context) {
        /// <summary>
        /// Returns the first element of the sequence that satisfies the Func condition
        /// or null if no such element is found.
        /// </summary>
        /// <param name="List" type="Array">The array to operate up on</param>
        /// <param name="Func" type="Function">function(value, index, array), to be called on Context for each element.</param>
        /// <param name="Context" type="Object">The context (this) to use when calling Func. Could be null.</param>

        Context = Context || null;
        var Result = null;

        var callback = function (ItemOrValue, IndexOrPropName, A) {
            if (Func.call(Context, ItemOrValue, IndexOrPropName, A)) {
                Result = ItemOrValue;
                return true;
            }
        };

        _.Any(List, callback, Context);

        return Result;
    };
    _.FirstOrDefault = _.FirstOrNull;
    _.Find = _.FirstOrNull;

    _.GroupBy = function (List, Props, IncludeDataLists) {
        /// <summary>Groups an array of objects based on Props.
        /// <para> Returns an object like { Key: 'key value', NodeList: [child group nodes], DataList: [rows in this group] } </para> </summary>
        /// <param name="List" type="Array">The array to operate on.</param>
        /// <param name="Props" type="Array">The property names to be used in grouping</param>
        /// <param name="IncludeDataLists" type="Boolean">Defaults to false. If true then each returned key object contains its own data-list</param>
        /// <returns type="Object">An object like { Key: 'key value', NodeList: [child group nodes], DataList: [rows in this group] }</returns>

        var _GroupBy = function (ParentNode, DataList, PropIndex) {
            var Prop = Props[PropIndex];

            var i, ln, Data, Key, Node, Groups = {};

            for (i = 0, ln = DataList.length; i < ln; i++) {
                Data = DataList[i];
                Key = Data[Prop];
                if (Key in Groups === false) {
                    Groups[Key] = [];
                }

                Groups[Key].push(Data);
            }

            var Keys = Object.keys(Groups);

            for (i = 0, ln = Keys.length; i < ln; i++) {
                Key = Keys[i];
                Node = { Key: Key };

                if (PropIndex < Props.length - 1) {
                    Node.NodeList = [];
                    if (IncludeDataLists === true) {
                        Node.DataList = Groups[Key];
                    }
                } else {
                    Node.DataList = Groups[Key];
                }

                ParentNode.NodeList.push(Node);
            }


            if (PropIndex < Props.length - 1) {
                for (i = 0, ln = ParentNode.NodeList.length; i < ln; i++) {
                    Node = ParentNode.NodeList[i];
                    _GroupBy(Node, Groups[Node.Key], PropIndex + 1);
                }
            }

        };

        var RootNode = {
            Key: '',
            NodeList: [],
        };

        if (IncludeDataLists === true) {
            RootNode.DataList = List;
        }

        _GroupBy(RootNode, List, 0);

        return RootNode;
    };

    _.InRange = function (List, Index) {
        /// <summary>Returns true if Index is a inside the length of the specified array.</summary>
        return (Index >= 0) && (Index <= List.length - 1);
    };
    _.ToArray = function (ArrayLikeObject) {
        var A = [];
        for (var i = 0, ln = ArrayLikeObject.length; i < ln; i++)
            A.push(ArrayLikeObject[i]);
        return A;
    };
    // numbers  ----------------------------------------------------------------------------- 
    _.Round = function (v, Decimals) {
        /// <summary>Rounds a float number (or a string representation of a float number) to specified decimal places (defaults to 2).</summary>
        /// <param name="v" type="Float|String">The float number or the string representation of a float number.</param>
        /// <param name="Decimals" type="Integer">Defaults to 2. The decimal places to round to.</param>
        Decimals = Decimals || 2;
        v = _.IsString(v) ? parseFloat(v) : v;

        return parseFloat(v.toFixed(Decimals));
    };
    _.Truncate = function (v) {
        /// <summary>Truncates the float number v to an integer</summary>
        return v | 0;
    };
    _.Random = function (Min, Max) {
        /// <summary>Returns a random integer</summary>
        return Math.floor(Math.random() * (Max - Min + 1)) + Min;
    };
    _.RandomFloat = function (Min, Max) {
        /// <summary>Returns a random float number</summary>
        return (Math.random() * (Max - Min + 1)) + Min;
    };
    _.RandomColor = function () {
        var S = '#';
        S += _.ToHex(_.Random(0, 0xFF));
        S += _.ToHex(_.Random(0, 0xFF));
        S += _.ToHex(_.Random(0, 0xFF));
        return S;
    };

    _.CurrencySymbol = '\u20ac'; // euro
    // dates    -----------------------------------------------------------------------------
    _.Day = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, };
    _.DayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', ];
    _.MonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // https://github.com/datejs/Datejs/tree/master/build

    _.FormatDateTime = function (v, format) {
        // adapted from: https://github.com/UziTech/js-date-format/blob/master/js-date-format.js

        format = format || 'yyyy-MM-dd';

        var Pad = function (value, length) {
            var negative = ((value < 0) ? "-" : "");
            var zeros = "0";
            for (var i = 2; i < length; i++) {
                zeros += "0";
            }
            return negative + (zeros + Math.abs(value).toString()).slice(-length);
        };

        var Parts = {
            date: v,
            yyyy: function () { return this.date.getFullYear(); },
            yy: function () { return this.date.getFullYear() % 100; },
            MM: function () { return Pad((this.date.getMonth() + 1), 2); },
            M: function () { return this.date.getMonth() + 1; },
            dd: function () { return Pad(this.date.getDate(), 2); },
            d: function () { this.date.getDate(); },
            HH: function () { return Pad(this.date.getHours(), 2); },
            H: function () { return this.date.getHours(); },
            hh: function () {
                var hour = this.date.getHours();
                if (hour > 12) {
                    hour -= 12;
                } else if (hour < 1) {
                    hour = 12;
                }
                return Pad(hour, 2);
            },
            h: function () {
                var hour = this.date.getHours();
                if (hour > 12) {
                    hour -= 12;
                } else if (hour < 1) {
                    hour = 12;
                }
                return hour;
            },
            mm: function () { return Pad(this.date.getMinutes(), 2); },
            m: function () { return this.date.getMinutes(); },
            ss: function () { return Pad(this.date.getSeconds(), 2); },
            s: function () { return this.date.getSeconds(); },
            fff: function () { return Pad(this.date.getMilliseconds(), 3); },
            ff: function () { return Pad(Math.floor(this.date.getMilliseconds() / 10), 2); },
            f: function () { return Math.floor(this.date.getMilliseconds() / 100); },
            zzzz: function () { return Pad(Math.floor(-this.date.getTimezoneOffset() / 60), 2) + ":" + Pad(-this.date.getTimezoneOffset() % 60, 2); },
            zzz: function () { return Math.floor(-this.date.getTimezoneOffset() / 60) + ":" + Pad(-this.date.getTimezoneOffset() % 60, 2); },
            zz: function () { return Pad(Math.floor(-this.date.getTimezoneOffset() / 60), 2); },
            z: function () { return Math.floor(-this.date.getTimezoneOffset() / 60); },
        };

        if (!format) {
            format = _.Format('yyyy{0}MM{0}dd', _.DateSeparator);
        } else if (format.length === 1) {
            if ((format === 'd') || (format === 'D')) {
                format = _.Format('yyyy{0}MM{0}dd', _.DateSeparator);
            }
        }

        var Result = [];
        var IsMatch = false;

        while (format.length > 0) {

            IsMatch = false;

            for (var i = format.length; i > 0; i--) {
                if (format.substring(0, i) in Parts) {
                    Result.push(Parts[format.substring(0, i)]());
                    format = format.substring(i);
                    IsMatch = true;
                    break;
                }
            }

            if (!IsMatch) {
                Result.push(format[0]);
                format = format.substring(1);
            }
        }

        return Result.join("");
    };
    _.ParseDateTime = function (v) {
        /// <summary>Parses a date, time or date-time string into a Date value. Format should be in yyyy/MM/dd HH:mm:ss
        /// <para> Using the / date separator the date is parsed to local date-time. </para>
        /// <para> Using the - date separator the date is parsed to UTC date-time. </para>
        /// <para> SEE: http://stackoverflow.com/questions/5619202/converting-string-to-date-in-js </para>
        ///</summary>
        /// <param name="v" type="String">A date string in the format yyyy/MM/dd for local dates and yyyy-MM-dd for UTC dates.</param>
        /// <returns type="Date">A date object</returns>

        return new Date(Date.parse(v));
    };
    _.TryParseDateTime = function (v) {
        var Info = {
            Value: null,
            Result: false,
        };

        try {
            var ms = Date.parse(v);
            if (!isNaN(ms)) {
                Info.Value = new Date(ms);
                Info.Result = true;
            }
        } catch (e) {
        }

        return Info;
    };

    var DateFormatLocal = 'yyyy/MM/dd';
    var DateFormatISO = 'yyyy-MM-dd';
    _.ToDateString = function (v, ToLocal) {
        /// <summary>Formats a Date value to a string using local or UTC format.</summary>
        /// <param name="v" type="Date">The Date value to format</param>
        /// <param name="ToLocal" type="Boolean">Defaults to false. When true a local date string is returned, else a Utc date string. </param>
        /// <returns type="Sring">The formatted string</returns>
        ToLocal = ToLocal === true;
        return _.FormatDateTime(v, ToLocal ? DateFormatLocal : DateFormatISO);
    };
    _.ToTimeString = function (v, Seconds) {
        /// <summary>Formats a Date value to a time string, optionally with seconds.</summary>
        /// <param name="v" type="Date">The Date value to format</param>
        /// <param name="Seconds" type="Boolean">Defaults to false. When true, then seconds are included in the returned string.</param>
        /// <returns type="Sring">The formatted string</returns>
        Seconds = Seconds === true;
        return _.FormatDateTime(v, Seconds ? 'HH:mm:ss' : 'HH:mm');
    };
    _.ToDateTimeString = function (v, ToLocal, Seconds) {
        /// <summary>Formats a Date value to a date-time string using local or UTC format, and optionally with seconds.</summary>
        /// <param name="v" type="Date">The Date value to format</param>
        /// <param name="ToLocal" type="Boolean">Defaults to false. When true a local date string is returned, else a Utc date string. </param>
        /// <param name="Seconds" type="Boolean">Defaults to false. When true, then seconds are included in the returned string.</param>
        /// <returns type="Sring">The formatted string</returns>
        ToLocal = ToLocal === true;
        Seconds = Seconds === true;

        var S = ToLocal ? DateFormatLocal : DateFormatISO;
        S = S + (Seconds ? ' HH:mm:ss' : ' HH:mm');

        return _.FormatDateTime(v, S);
    };

    

    _.Now = function () {
        /// <summary>Returns a Date value with the current date and time.</summary>
        return new Date();
    };
    _.Today = function () {
        /// <summary>Returns a Date value with the current date. Time part is zero-ed</summary>
        return _.ClearTime(new Date());
    };
    _.Time = function () {
        /// <summary>Returns a Date value with the current time. Date part is zero-ed</summary>
        return _.ClearDate(new Date());
    };
    _.DayOfWeek = function (v) {
        /// <summary>Returns a number between 0..6 representing the day of the week.</summary>
        return v.getDay();
    };
    _.DayOfMonth = function (v) {
        /// <summary>Returns  a number between 1..31 representing the day of the month.</summary>
        return v.getDate();
    };

    _.AddYears = function (v, Years) {
        /// <summary>Adds a specified number of Years to a Date value. Years could be negative. 
        /// <para> Returns the modified Date. </para>
        /// <para> CAUTION: The passed Date value is modified after this call. </para> 
        /// </summary>
        v.setFullYear(v.getFullYear() + Years);
        return v;
    };
    _.AddMonths = function (v, Months) {
        /// <summary>Adds a specified number of Months to a Date value. Months could be negative. 
        /// <para> Returns the modified Date. </para>
        /// <para> CAUTION: The passed Date value is modified after this call. </para> 
        /// </summary>
        v.setMonth(v.getMonth() + Months);
        return v;
    };
    _.AddDays = function (v, Days) {
        /// <summary>Adds a specified number of Days to a Date value. Days could be negative. 
        /// <para> Returns the modified Date. </para>
        /// <para> CAUTION: The passed Date value is modified after this call. </para> 
        /// </summary>
        v.setDate(v.getDate() + Days);
        return v;
    };

    _.AddWeeks = function (v, Weeks) {
        /// <summary>Adds a specified number of Weeks to a Date value. Weeks could be negative. 
        /// <para> Returns the modified Date. </para>
        /// <para> CAUTION: The passed Date value is modified after this call. </para> 
        /// </summary>
        return _.AddDays(v, Weeks * 7);
    };

    _.AddHours = function (v, Hours) {
        /// <summary>Adds a specified number of Hours to a Date value. Hours could be negative. 
        /// <para> Returns the modified Date. </para>
        /// <para> CAUTION: The passed Date value is modified after this call. </para> 
        /// </summary>
        v.setTime(v.getTime() + (Hours * 60 * 60 * 1000));
        return v;
    };
    _.AddMinutes = function (v, Minutes) {
        /// <summary>Adds a specified number of Minutes to a Date value. Minutes could be negative. 
        /// <para> Returns the modified Date. </para>
        /// <para> CAUTION: The passed Date value is modified after this call. </para> 
        /// </summary>
        v.setTime(v.getTime() + (Minutes * 60 * 1000));
        return v;
    };
    _.AddSeconds = function (v, Seconds) {
        /// <summary>Adds a specified number of Seconds to a Date value. Seconds could be negative. 
        /// <para> Returns the modified Date. </para>
        /// <para> CAUTION: The passed Date value is modified after this call. </para> 
        /// </summary>
        v.setTime(v.getTime() + (Seconds * 1000));
        return v;
    };

    _.ClearDate = function (v) {
        /// <summary>Sets the date part of Date value to zero</summary>
        v.setFullYear(0);
        v.setMonth(0);
        v.setDate(0);
        return v;
    };
    _.ClearTime = function (v) {
        /// <summary>Sets the time part of Date value to zero</summary>
        v.setHours(0);
        v.setMinutes(0);
        v.setSeconds(0);
        v.setMilliseconds(0);
        return v;
    };

    _.IsLeapYear = function (Year) {
        /// <summary>Returns true if a specified Year is a leap year. </summary>
        return ((Year % 4 === 0 && Year % 100 !== 0) || Year % 400 === 0);
    };
    _.DaysInMonth = function (Year, Month) {
        /// <summary>Returns the number of days in a Month of a specified Year.</summary>
        return [31, (_.IsLeapYear(Year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][Month];
    };

    _.DateCompare = function (A, B) {
        /// <summary>Compares two Date values. Returns 1 if A is greater, -1 if A is less and 0 when the values are equal.</summary>
        if (A === _.Undefined) { A = null; }
        if (B === _.Undefined) { B = null; }

        return (A > B) ? 1 : (A < B ? -1 : 0);
    };
    _.DateBetween = function (v, A, B) {
        /// <summary>Returns true if a specified Date value lies between the A and B Date values.</summary>
        if (A === _.Undefined) { A = null; }
        if (B === _.Undefined) { B = null; }

        return (v >= A) && (v <= B);
    };
    _.DateClone = function (v) {
        return new Date(v.getTime());
    };
    //---------------------------------------------------------------------------------------
    _.GetBaseUrl = function () { return window.location.protocol + "//" + window.location.host + "/"; };
    _.ParamByName = function (Name, Url) {
        /// <summary>Returns a query string parameter by name, if any, else null</summary>
        /// <param name="Name" type="String">The name of the parameter</param>
        /// <param name="Url" type="String">Optional. If not specified then the current url is used</param>
        if (!Url) Url = window.location.href;
        Name = Name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + Name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(Url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    _.GetParams = function (Url) {
        /// <summary>Returns a plain object where each property is a query string parameter.</summary>
        /// <param name="Url" type="String">Optional. If not specified then the current url is used</param>
        if (!Url) Url = window.location.href;

        var Result = {};
        var Index = Url.indexOf('?');
        if (Index !== -1) {
            var Parts,
                List = Url.slice(Index + 1).split('&');

            for (var i = 0; i < List.length; i++) {
                Parts = List[i].split('=');

                Result[Parts[0]] = decodeURIComponent(Parts[1]);
            }
        }

        return Result;
    };
    //---------------------------------------------------------------------------------------
    _.Merge = function (Dest, Sources, DeepMerge, PropsOnly) {
        /// <summary>
        /// Merges properties and functions of objects in the Sources array to the Dest object.  
        /// <para> CAUTION: No overload. All argument must have values. </para>
        /// </summary>
        /// <param name="Dest" type="Object"> The destination object. It is returned as the Result of the function. </param>
        /// <param name="Sources" type="Array or Object"> : The source object or an array of source objects (or arrays). </param>
        /// <param name="DeepMerge" type="Boolean"> When DeepMerge is true, then source properties that are objects and arrays,  
        ///  are deeply copied to Dest. If false then only their referencies are copied to Dest. </param>
        /// <param name="PropsOnly" type="Boolean"> When PropsOnly is true, source functions are not copied to Dest. </param>
        /// <returns type="Object or Array">The Dest object.</returns>
        var Flag = _.IsObject(Dest) || _.IsArray(Dest);
        if (!Flag) {
            return Dest;
        }

        if (!_.IsArray(Sources)) {
            var x = Sources;
            Sources = [];
            Sources.push(x);
        }

        var Source;
        var SourceProp;
        var DestProp;
        var Copy;

        for (var i = 0, ln = Sources.length; i < ln; i++) {
            Source = Sources[i];
            if (!_.IsEmpty(Source) && (Dest !== Source)) {
                for (var PropName in Source) {
                    SourceProp = Source[PropName];

                    if (_.IsFunction(SourceProp) && PropsOnly)
                        continue;

                    if (_.IsSimple(SourceProp)) {
                        Dest[PropName] = SourceProp;
                    } else if (SourceProp && (SourceProp !== Dest)) {
                        if (!DeepMerge) {
                            Dest[PropName] = SourceProp;
                        } else {
                            DestProp = Dest[PropName];
                            if (_.IsObject(SourceProp)) {
                                DestProp = (DestProp && _.IsPlainObject(DestProp)) ? DestProp : {};
                                Dest[PropName] = _.Merge(DestProp, [SourceProp], DeepMerge, PropsOnly);
                            } else if (_.IsArray(SourceProp)) {
                                DestProp = (DestProp && _.IsArray(DestProp)) ? DestProp : [];
                                Dest[PropName] = _.Merge(DestProp, [SourceProp], DeepMerge, PropsOnly);
                            } else {
                                if (PropName !== 'constructor') {
                                    Dest[PropName] = SourceProp;
                                }
                            }
                        }
                    }
                }
            }
        }

        return Dest;
    };
    _.MergeProps = function (Dest, Sources, DeepMerge) {
        /// <summary>
        /// Merges properties ONLY of objects in the Sources array to the Dest object.
        /// <para> CAUTION: No overload. All argument must have values. </para>
        /// </summary>
        /// <param name="Dest" type="Object"> The destination object. It is returned as the Result of the function. </param>
        /// <param name="Sources" type="Array or Object"> : The source object or an array of source objects (or arrays). </param>
        /// <param name="DeepMerge" type="Boolean"> When DeepMerge is true, then source properties that are objects and arrays,  
        ///  are deeply copied to Dest. If false then only their referencies are copied to Dest. </param>
        /// <returns type="Object or Array">The Dest object.</returns>
        return _.Merge(Dest, Sources, DeepMerge, true);
    };
    _.MergePropsDeep = function (Dest, Sources) {
        /// <summary>
        /// Merges properties ONLY of objects in the Sources array to the Dest object.
        /// <para> It does a deep merge, that is source properties that are objects and arrays, are deeply copied to Dest </para>
        /// </summary>
        /// <param name="Dest" type="Object"> The destination object. It is returned as the Result of the function. </param>
        /// <param name="Sources" type="Array or Object"> : The source object or an array of source objects (or arrays). </param>
        /// <param name="DeepMerge" type="Boolean"> When DeepMerge is true, then source properties that are objects and arrays,  
        ///  are deeply copied to Dest. If false then only their referencies are copied to Dest. </param>
        /// <returns type="Object or Array">The Dest object.</returns>
        return _.Merge(Dest, Sources, true, true);
    };
    _.MergeQuick = function (Dest, Source) {
        /// <summary> Merges OWN properties ONLY of the Source object to the Dest object. Return the Dest. </summary>
        for (var i in Source) {
            if (Source.hasOwnProperty(i) && !_.IsFunction(Source[i])) {
                Dest[i] = Source[i];
            }
        }

        return Dest;
    };
    //---------------------------------------------------------------------------------------
    _.Equals = function (A, B) {
        /// <summary> Returns true when B properties exist in A and have the same values in both</summary>
        if (A === B)
            return true;

        for (var Key in B) {
            if (B[Key] !== A[Key])
                return false;
        }

        return true;
    };
    _.Overload = function (Args, IncludeEmpty) {
        if (typeof IncludeEmpty === _.Undefined) { IncludeEmpty = false; }
        var a = arguments[0];

        var Result = [];
        for (var i = 0, ln = a.length; i < ln; i++) {
            if (_.IsString(a[i])) {
                Result.push("s");
            } else if (_.IsBoolean(a[i])) {
                Result.push("b");
            } else if (_.IsNumber(a[i])) {
                Result.push("n");
            } else if (_.IsObject(a[i])) {
                Result.push("o");
            } else if (_.IsArray(a[i])) {
                Result.push("a");
            } else if (_.IsFunction(a[i])) {
                Result.push("f");
            } else if (_.IsDate(a[i])) {
                Result.push("d");
            } else if (_.IsEmpty(a[i])) {
                if (IncludeEmpty)
                    Result.push("e");
            } else if (_.IsRegExp(a[i])) {
                Result.push("r");
            }
        }
        return Result.join();
    };
    _.CreateProxyClass = function (Template, Attach) {
        /// <summary>Returns a class that has the same set of properties as a specified template object.
        /// <para> The returned class may be used in creating a proxy object for a specified source object. </para>
        /// <para> Altering a property of such a proxy actually alters the property of the underlying source object
        ///  while at the same time it triggers a PropertyChanged event through a Notifier. </para>
        /// <para> That is each proxy is an observable object. </para>
        ///</summary>
        /// <param name="Template" type="Object">The object to borrow the set of properties for the class.</param>
        /// <param name="Attach" type="Boolean">Defaults to false. If true, then a Proxy property is attached to each source object.</param>
        var Result = (function (BaseClass) {
            function Class(Source) {
                /// <summary>
                /// Creates a proxy object for Source.
                /// Using that proxy to access Source properties ends up triggering a PropertyChanged event through the Notifier.
                /// <para>  Example:                                                    </para>
                /// <para>                                                              </para>
                /// <para>  var o  = { Name: 'teo', Age: 52 };                          </para>
                /// <para>  var o2 = { Name: 'kostas', Age: 32 };                       </para>
                /// <para>  var ProxyClass = tp.CreateProxyClass(o);                    </para>
                /// <para>  ProxyClass.Notifier.On('PropertyChanged', function (Args) { </para>
                /// <para>      var x = Args;                                           </para>
                /// <para>  });                                                         </para>
                /// <para>                                                              </para>
                /// <para>  var p = new ProxyClass(o2);                                 </para>
                /// <para>  p.Name = 'vasiliadis ' + p.Name;                            </para>
                ///</summary> 

                BaseClass.call(this);
                this.tpClass = 'tp.ObjectProxy';

                this.Source = Source;
                if (Attach === true) {
                    this.Source.Proxy = this;
                }
            }
            var base = tp.SetBaseClass(Class, BaseClass);
            var _ = Class.prototype;

            _.Source = null;

            Class.Notifier = new tp.tpObject();             // triggers PropertyChanged events

            return Class;
        })(Object);


        var CreateProperty = function (PropName) {
            tp.Property(PropName, Result.prototype, function () {
                return this.Source[PropName];
            }, function (v) {
                if (v !== this.Source[PropName]) {
                    var OldValue = this.Source[PropName];
                    this.Source[PropName] = v;

                    Result.Notifier.Trigger('PropertyChanged', {
                        Instance: this,
                        Prop: PropName,
                        OldValue: OldValue,
                        Value: v,
                    });

                }
            });
        };

        var PropInfo;
        for (var PropName in Template) {
            if (Template.hasOwnProperty(PropName)) {
                PropInfo = tp.GetProperty(Template, PropName);
                if (PropInfo.IsProperty && PropInfo.IsWritable) {
                    CreateProperty(PropName);
                }
            }
        }

        return Result;

    };
    //---------------------------------------------------------------------------------------
    _.UnitMap = {
        // list of all units and their identifying string
        // see: http://www.w3schools.com/cssref/css_units.asp
        pixel: "px",
        percent: "%",
        inch: "in",
        cm: "cm",
        mm: "mm",
        point: "pt",
        pica: "pc",
        em: "em",
        ex: "ex"
    };
    _.GetUnit = function (v) {
        /// <summary>Returns the unit suffix of a string value, i.e. px, %, em, etc.</summary>
        /// <param name="v" type="string">The value, i.e. 2px, 100%, etc.</param>
        /// <para> taken from: http://upshots.org/javascript/javascript-get-current-style-as-any-unit  </para>
        if (_.IsString(v) && !_.IsBlank(v)) {
            var unit = v.match(/\D+$/);               // get the existing unit
            unit = (unit === null) ? _.UnitMap.pixel : unit[0]; // if its not set, assume px - otherwise grab string
            return unit;
        }

        return '';
    };
    _.GetNumber = function (v) {
        /// <summary>Returns the number out of a string value</summary>
        /// <param name="v" type="string">The value, i.e. 2px, 100%, etc.</param>
        /// <para> taken from: http://stackoverflow.com/questions/3530127/convert-css-width-string-to-regular-number </para>
        if (_.IsNumber(v))
            return v;
        return !_.IsBlank(v) ? Number(v.replace(/[^\d\.\-]/g, '')) : 0;
    };
    _.IsPixel = function (v) {
        return _.UnitMap.pixel === _.GetUnit(v);
    };
    _.IsEm = function (v) {
        return _.UnitMap.em === _.GetUnit(v);
    };
    _.IsPercent = function (v) {
        return _.UnitMap.percent === _.GetUnit(v);
    };
    _.px = function (v) { return v.toString() + "px"; };
    //---------------------------------------------------------------------------------------
    _.Edge = {
        None: 0,
        N: 1,
        E: 2,
        W: 4,
        S: 8,
        NE: 0x10,
        NW: 0x20,
        SE: 0x40,
        SW: 0x80,

        get All() { return this.N | this.E | this.W | this.S | this.NE | this.NW | this.SE | this.SW; },

        get Height() { return _.Bf.Subtract(this.All, this.E | this.W); },
        get Width() { return _.Bf.Subtract(this.All, this.N | this.S); },

        get Left() { return this.NW | this.W | this.SW; },
        get Top() { return this.NW | this.N | this.NE; },
        get Right() { return this.NE | this.E | this.SE; },
        get Bottom() { return this.SW | this.S | this.SE; },

        IsHeigth: function (v) { return _.Bf.In(v, this.Height); },
        IsWidth: function (v) { return _.Bf.In(v, this.Width); },

        IsLeft: function (v) { return _.Bf.In(v, this.Left); },
        IsTop: function (v) { return _.Bf.In(v, this.Top); },
        IsRight: function (v) { return _.Bf.In(v, this.Right); },
        IsBottom: function (v) { return _.Bf.In(v, this.Bottom); },
    };
    _.EdgeToCursor = function (Edge) {
        // http://www.javascripter.net/faq/stylesc.htm

        switch (Edge) {
            case tp.Edge.NE: return tp.Cursor.ResizeNE;
            case tp.Edge.NW: return tp.Cursor.ResizeNW;
            case tp.Edge.SE: return tp.Cursor.ResizeSE;
            case tp.Edge.SW: return tp.Cursor.ResizeSW;

            case tp.Edge.N: return tp.Cursor.ResizeN;
            case tp.Edge.E: return tp.Cursor.ResizeE;
            case tp.Edge.W: return tp.Cursor.ResizeW;
            case tp.Edge.S: return tp.Cursor.ResizeS;
        }

        return tp.Cursor.Default;
    };
    _.ResizeHitTest = function (e, Element, HandleSize) {

        var R, P, X, Y, W, H, mX, mY, Mouse, i, ln;
        var Size = HandleSize || 6;

        //Mouse = _.Mouse.Offset(e);
        //P = _.Offset(Element);

        Mouse = _.Mouse.ToElement(e, Element);
        P = new _.Point(0, 0);

        mX = Mouse.X;
        mY = Mouse.Y;

        X = P.X;
        Y = P.Y;

        R = _.BoundingRect(Element);
        W = R.Width;
        H = R.Height;

        P = { X: mX, Y: mY };
        R = { X: X, Y: Y, Width: W, Height: H };

        if (_.PointInRect(P, R)) {

            var A = [
                { Type: _.Edge.NE, R: { X: X + W - Size, Y: Y, Width: Size, Height: Size } },
                { Type: _.Edge.NW, R: { X: X, Y: Y, Width: Size, Height: Size } },
                { Type: _.Edge.SE, R: { X: X + W - Size, Y: Y + H - Size, Width: Size, Height: Size } },
                { Type: _.Edge.SW, R: { X: X, Y: Y + H - Size, Width: Size, Height: Size } },

                { Type: _.Edge.N, R: { X: X, Y: Y, Width: W, Height: Size } },
                { Type: _.Edge.E, R: { X: X + W - Size, Y: Y, Width: Size, Height: H } },
                { Type: _.Edge.W, R: { X: X, Y: Y, Width: Size, Height: H } },
                { Type: _.Edge.S, R: { X: X, Y: Y + H - Size, Width: W, Height: Size } },
            ];

            for (i = 0, ln = A.length; i < ln; i++) {
                if (_.PointInRect(P, A[i].R)) {
                    return A[i].Type;
                }
            }
        }

        return _.Edge.None;
    };
    _.PointInRect = function (P, R) {
        return P.X >= R.X &&
               P.X <= R.X + R.Width &&
               P.Y >= R.Y &&
               P.Y <= R.Y + R.Height;
    };
    //---------------------------------------------------------------------------------------
    _.Alignment = {
        Near: 1,
        Mid: 2,
        Far: 4,

        get Justify() { return this.Mid; },

        get Top() { return this.Near; },
        get Center() { return this.Mid; },
        get Bottom() { return this.Far; },

        get Left() { return this.Near; },
        get Right() { return this.Far; },

        ToFlex: function (v, Reverse) {
            if (v === this.Near) {
                return Reverse === true ? 'flex-end' : 'flex-start';
            } else if (v === this.Far) {
                return Reverse === true ? 'flex-start' : 'flex-end';
            } else {
                return 'center';
            }
        },
        ToText: function (v, Reverse) {
            // to text-align css property
            if (v === this.Near) {
                return Reverse === true ? 'right' : 'left';
            } else if (v === this.Far) {
                return Reverse === true ? 'left' : 'right';
            } else {
                return 'center';
            }
        },
    };
    //---------------------------------------------------------------------------------------
    var Names = (function () {
        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }

        var _ = Class;

        _.Next = function (Prefix) {
            if (typeof Prefix === tp.Undefined) { Prefix = ''; }
            /// <summary>
            /// Constructs and returns a string based on Prefix and an auto-inc counter associated to Prefix.
            /// <para> It stores passed prefixes in order to auto-increment the associated counter. </para>
            /// <para> It Prefix is null or empty, it just returns an auto-inc number as string. </para>
            /// <para> WARNING: NOT case-sensitive. </para>
            /// </summary>
            if (!tp.IsBlank(Prefix)) {
                var ucPrefix = Prefix.toUpperCase();
                if (!(ucPrefix in _.items)) {
                    Names.items[ucPrefix] = 0;
                }
                var V = Names.items[ucPrefix]++;
                return Prefix + V.toString();
            }

            Names.counter++;
            return Names.counter.toString();
        };
        _.items = {};
        _.counter = 0;


        return Class;
    })();
    _.NextName = function (Prefix) {
        /// <summary> 
        /// Constructs and returns a string based on Prefix and an auto-inc counter associated to Prefix. 
        /// <para> It stores passed prefixes in order to auto-increment the associated counter. </para>
        /// <para> It Prefix is null or empty, it just returns an auto-inc number as string. </para>
        /// <para> WARNING: NOT case-sensitive. </para>
        /// </summary>
        return Names.Next(Prefix);
    };
    //---------------------------------------------------------------------------------------
    _.Prefix = 'tp-';
    _.SafeId = function (Prefix) {
        /// <summary>
        /// Constructs and returns an Id, based on Prefix.
        /// <para> If Prefix is null or empty, tp.Prefix is used. </para>
        /// <para> WARNING: NOT case-sensitive. </para>
        /// </summary>
        if (typeof Prefix === _.Undefined) { Prefix = ''; }
        if (_.IsBlank(Prefix))
            Prefix = _.Prefix;

        var S = _.NextName(Prefix);
        S = _.ReplaceAll(S, '.', '-');

        return S;
    };
    _.IdEndsWith = function (Id, ParentElement) {
        /// <summary>
        /// Returns an element when that element's Id ends width Id, else null.
        /// <para>ParentElement could be null. If null, document is used as parent.</para>
        /// </summary>
        ParentElement = ParentElement || document;

        var NodeList, Result = [], i, len, rgx;

        NodeList = ParentElement.getElementsByTagName('*');
        len = NodeList.length;
        rgx = new RegExp(Id + '$');
        var el;
        for (i = 0; i < len; i++) {
            if (NodeList[i] instanceof HTMLElement) {
                el = NodeList[i];
                if (rgx.test(el.id)) {
                    Result.push(el);
                }
            }
        }

        if (Result.length > 0) {
            return Result[0];
        }

        return null;
    };
    //---------------------------------------------------------------------------------------
    /** Creates an html form and submits that form to a url using a specified method (post or get).
     *  <p>It also accepts a model parameter (a plain object) whose properties become form's input elements.</p>
     * @param {String} Url The url where the form is submitted.  
     * @param {Object} Model A plain object whose properties become input elements in the submitted form.
     * @param {String} Method post or get. Defaults to post.
     */
    _.SubmitFormModel = function (Url, Model, Method) {

        var form, el, i, ln, PropName, v, Data = {};

        for (PropName in Model) {
            v = Model[PropName];
            if (!_.IsEmpty(v) && !_.IsFunction(v)) {
                if (v instanceof Date) {
                    v = v.toISOString();
                }
                Data[PropName] = v;
            }
        }

        form = document.createElement("form");
        if (!_.IsBlank(Url))
            form.action = Url;
        form.method = Method || 'post';
        for (PropName in Data) {
            v = Data[PropName];
            if (_.IsArray(v)) {
                for (i = 0, ln = v.length; i < ln; i++) {
                    el = document.createElement("input");
                    el.setAttribute("type", "hidden");
                    el.setAttribute("name", PropName + '[' + i + ']');
                    el.setAttribute("value", v[i]);
                    form.appendChild(el);
                }
            } else {
                el = document.createElement("input");
                el.setAttribute("type", "hidden");
                el.setAttribute("name", PropName);
                el.setAttribute("value", v);
                form.appendChild(el);
            }
        }

        document.body.appendChild(form);
        form.submit();

    };
    _.FormSerialize = function (ElementOrSelector) {
        var Result = '';
        var form = tp(ElementOrSelector);
        if (form.nodeName.toLowerCase() === 'form') {
            var i, ln, j, jln, NodeName, Type, el, List = [];

            for (i = 0, ln = form.elements.length; i < ln; i++) {
                el = form.elements[i];
                if (el.name) {
                    NodeName = el.nodeName.toLowerCase();
                    Type = el.type ? el.type.toLowerCase() : '';

                    switch (NodeName) {
                        case 'input':
                            switch (Type) {
                                case 'hidden':
                                case 'text':
                                case 'password':
                                case 'color':
                                case 'date':
                                case 'datetime-local':
                                case 'email':
                                case 'month':
                                case 'number':
                                case 'range':
                                case 'search':
                                case 'tel':
                                case 'time':
                                case 'url':
                                case 'week':
                                    List.push(el.name + "=" + encodeURIComponent(el.value));
                                    break;
                                case 'checkbox':
                                    List.push(el.name + "=" + encodeURIComponent(el.checked));
                                    break;
                                case 'radio':
                                    if (el.checked) {
                                        List.push(el.name + "=" + encodeURIComponent(el.value));
                                    }
                                    break;
                                case 'button':
                                case 'submit':
                                case 'reset':
                                    List.push(el.name + "=" + encodeURIComponent(el.value));
                                    break;
                                case 'file':
                                case 'image':
                                    break;
                            }
                            break;
                        case 'button':
                            switch (Type) {
                                case 'button':
                                case 'submit':
                                case 'reset':
                                    List.push(el.name + "=" + encodeURIComponent(el.value));
                                    break;
                            }
                            break;
                        case 'select':
                            switch (Type) {
                                case 'select-one':
                                    List.push(el.name + "=" + encodeURIComponent(el.value));
                                    break;
                                case 'select-multiple':
                                    for (j = 0, jln = el.options.length; j < jln; j++) {
                                        if (el.options[j].selected) {
                                            List.push(el.name + "=" + encodeURIComponent(el.options[j].value));
                                        }
                                    }
                                    break;
                            }
                            break;
                        case 'textarea':
                            List.push(el.name + "=" + encodeURIComponent(el.value));
                            break;
                    }
                }


            }

            Result = List.join("&");
        }

        return Result;

    };
    _.FormToObject = function (ElementOrSelector) {
        var Result = {};
        var form = tp(ElementOrSelector);
        if (form.nodeName.toLowerCase() === 'form') {
            var i, ln, j, jln, NodeName, Type, el;

            for (i = 0, ln = form.elements.length; i < ln; i++) {
                el = form.elements[i];
                if (el.name) {
                    NodeName = el.nodeName.toLowerCase();
                    Type = el.type ? el.type.toLowerCase() : '';

                    switch (NodeName) {
                        case 'input':
                            switch (Type) {
                                case 'hidden':
                                case 'text':
                                case 'password':
                                case 'color':
                                case 'date':
                                case 'datetime-local':
                                case 'email':
                                case 'month':
                                case 'number':
                                case 'range':
                                case 'search':
                                case 'tel':
                                case 'time':
                                case 'url':
                                case 'week':
                                    Result[el.name] = el.value;
                                    break;
                                case 'checkbox':
                                    Result[el.name] = el.checked;
                                    break;
                                case 'radio':
                                    if (el.checked) {
                                        Result[el.name] = el.value;
                                    }
                                    break;
                                case 'button':
                                case 'submit':
                                case 'reset':
                                    break;
                                case 'file':
                                case 'image':
                                    break;
                            }
                            break;
                        case 'button':
                            switch (Type) {
                                case 'button':
                                case 'submit':
                                case 'reset':
                                    break;
                            }
                            break;
                        case 'select':
                            switch (Type) {
                                case 'select-one':
                                    Result[el.name] = el.value;
                                    break;
                                case 'select-multiple':
                                    var SelectedValues = [];
                                    for (j = 0, jln = el.options.length; j < jln; j++) {
                                        if (el.options[j].selected) {
                                            SelectedValues.push(el.options[j].value);
                                        }
                                    }
                                    Result[el.name] = SelectedValues;
                                    break;
                            }
                            break;
                        case 'textarea':
                            Result[el.name] = el.value;
                            break;
                    }
                }


            }
        }

        return Result;
    };
    _.FormToJson = function (ElementOrSelector) {
        var o = _.FormToObject(ElementOrSelector);
        o = JSON.stringify(o);
        return o;
    };

    _.SerializeInput = function (ShowSpinner, ElementOrSelector, Context, OnDone, OnError) {
        /// <summary>Serializes a form, or any other container, into a javascript object and returns a Promise.
        /// It serializes inputs of type file too, as an array of { FileName:, Size:, MimeType:, Data:,} where Data is a base64 string</summary>
        /// <param name="ShowSpinner" type="Boolean">True to show the spinner while processing.</param>
        /// <param name="ElementOrSelector" type="Element or String">An html form or any other container element, that contains input, select, textarea and button elements</param>
        /// <param name="Context" type="Object">The context (this) to use when calling the provided call-back functions.</param>
        /// <param name="OnDone" type="function(o){}">A function to call when done serializing the elements. It is passed the resulting object.</param>
        /// <param name="OnError" type="function(e){}">A function to call on error. It is passed the error object.</param>
        /// <returns type="Promise">A Promise object</returns>

        var Result = Promise.resolve();

        var o = {};

        var parent = tp(ElementOrSelector);
        if (parent) {

            var P, PromiseList = [];

            // input[type='file'] elements first
            var FileElementList = tp.ToArray(tp.Children(parent, "input[type='file']"));
            FileElementList.forEach(function (el) {
                P = tp.ReadFiles(ShowSpinner, el.files, null,
                    function (List) {
                        o[el.name] = List;
                    },
                    function (e, File) {
                        throw e;
                    });
                PromiseList.push(P);
            });


            // the rest elements
            P = new Promise(function (Resolve, Reject) {
                var elements = (parent.nodeName.toLowerCase() === 'form') ? parent.elements : tp.Children(parent, 'input, select, textarea, button');

                var i, ln, j, jln, NodeName, Type, el, A;

                for (i = 0, ln = elements.length; i < ln; i++) {
                    el = elements[i];
                    if (el.name) {
                        NodeName = el.nodeName.toLowerCase();
                        Type = el.type ? el.type.toLowerCase() : '';

                        switch (NodeName) {
                            case 'input':
                                switch (Type) {
                                    case 'hidden':
                                    case 'text':
                                    case 'password':
                                    case 'color':
                                    case 'date':
                                    case 'datetime-local':
                                    case 'email':
                                    case 'month':
                                    case 'number':
                                    case 'range':
                                    case 'search':
                                    case 'tel':
                                    case 'time':
                                    case 'url':
                                    case 'week':
                                        o[el.name] = el.value;
                                        break;
                                    case 'checkbox':
                                        o[el.name] = el.checked ? true : false;
                                        break;
                                    case 'radio':
                                        if (el.checked) {
                                            o[el.name] = el.value;
                                        }
                                        break;
                                    case 'button':
                                    case 'submit':
                                    case 'reset':
                                        o[el.name] = el.value;
                                        break;
                                    case 'file':
                                        // done already above
                                        break;
                                    case 'image':
                                        break;
                                }
                                break;
                            case 'button':
                                switch (Type) {
                                    case 'button':
                                    case 'submit':
                                    case 'reset':
                                        o[el.name] = el.value;
                                        break;
                                }
                                break;
                            case 'select':
                                switch (Type) {
                                    case 'select-one':
                                        o[el.name] = el.value;
                                        break;
                                    case 'select-multiple':
                                        A = [];
                                        for (j = 0, jln = el.options.length; j < jln; j++) {
                                            if (el.options[j].selected) {
                                                A.push(el.options[j].value);
                                            }
                                        }
                                        o[el.name] = A;
                                        break;
                                }
                                break;
                            case 'textarea':
                                o[el.name] = el.value;
                                break;
                        }
                    }


                }

                Resolve();
            });
            PromiseList.push(P);


            var Spinner = function (Flag) {
                if (ShowSpinner) {
                    tp.Spinner(Flag);
                }
            };

            Spinner(true);

            Result = Promise.all(PromiseList)
              .then(function () {
                  tp.Call(OnDone, Context, o);
              }).then(function () {
                  Spinner(false);
                  return o;
              }).catch(function (e) {
                  tp.SpinnerForceHide();
                  tp.Call(OnError, Context, e);
              });


        }

        return Result;
    };

    _.ArrayBufferToHex = function (Buffer) {
        /// <summary> Converts a specified ArrayBuffer to a Hex string</summary> 
        var UA = new Uint8Array(Buffer);
        var A = new Array(UA.length);
        var i = UA.length;
        while (i--) {
            A[i] = (UA[i] < 16 ? '0' : '') + UA[i].toString(16);  // map to hex
        }

        UA = null; // free memory
        return A.join('');
    };
    //---------------------------------------------------------------------------------------
    _.Document = window.frameElement ? window.top.document : window.document;
    _.Property('ActiveElement', _, function () { return _.Document.activeElement; });
    //---------------------------------------------------------------------------------------
    _.Value = function (el, v) {
        /// <summary>Gets (if v is not defined) or sets the value of an element.</summary>
        /// <param name="el" type="Selector or Element">The element's id or the element object</param>
        /// <param name="v" type="object">The value to set to the element. If null then the function returns the element's value</param>
        /// <returns type="object"></returns>
        el = _(el);
        if (!el) return null;

        var i, ln, o;
        var NodeName = el.nodeName.toLowerCase();
        var IsInput = NodeName == 'input';
        var IsTextInput = NodeName == 'textarea' || (IsInput && _.ListContainsText(['text', 'password', 'button', 'submit', 'reset'], el.type));
        var IsCheckInput = IsInput && (_.ListContainsText(['check', 'radio'], el.type));
        var IsSelect = NodeName == 'select';

        if (_.IsEmpty(v)) {
            // get
            if (IsSelect) {
                return _.InRange(el.options, el.selectedIndex) ? el.options[el.selectedIndex].value : null;
            } else if (IsTextInput) {
                return el.value;
            } else if (IsCheckInput) {
                return el.checked;
            } else if (IsInput) {
                return el.value;
            }  
            return ('textContent' in el) ? el.textContent : el.innerHTML;
        } else {
            // set
            if (IsSelect) {
                for (i = 0, ln = el.options.length; i < ln; i++) {
                    if (el.options[i].value == v) {
                        el.selectedIndex = i;
                        return;
                    }
                }

                if (_.IsNumber(v) && _.InRange(el.options, v)) {
                    el.selectedIndex = v;
                }
            } else if (IsTextInput) {
                el.value = v;
            } else if (IsCheckInput) {
                el.checked = v;
            } else if (IsInput) {
                el.value = v;
            } else if ('textContent' in el) {
                el.textContent = v;
            } else {
                el.innerHTML = v;
            }
        }
    };
    _.val = _.Value;
    _.ClearValue = function (el) {
        el = _(el);
        if (!el) return null;

        var i, ln;
        var NodeName = el.nodeName.toLowerCase();
        var IsInput = NodeName = 'input';
        var IsTextInput = NodeName = 'textarea' || (IsInput && _.ListContainsText(['text', 'password', 'button', 'submit', 'reset'], el.type));
        var IsCheckInput = IsInput && (_.ListContainsText(['check', 'radio'], el.type));
        var IsSelect = NodeName = 'select';

        if (IsTextInput) {
            el.value = '';
        } else if (IsCheckInput) {
            el.checked = false;
        } else if (IsInput) {
            el.value = '';
        } else if (IsSelect) {
            el.selectedIndex = -1;
        } else if ('textContent' in el) {
            el.textContent = v;
        } else {
            el.innerHTML = v;
        }
    };
    _.Html = function (el, v) {
        /// <summary>Gets or sets the inner html of an element</summary>
        el = _(el);
        if (!el) return null;

        if (_.IsEmpty(v))
            return el.innerHTML;
        else
            el.innerHTML = v;
    };
    _.Append = function (el, ElementOrHtml) {
        /// <summary>Appends an element or html markup to a parent element as its last child</summary>
        /// <param name="el" type="Element | Selector">The parent element.</param>
        /// <param name="ElementOrHtml" type="Element|Html">The element or the html markup text that should be added</param>
        /// <returns type="void">nothing</returns>

        el = _(el);
        var v = ElementOrHtml;
        if (_.IsElement(v)) {
            el.appendChild(v);
        } else if (_.IsString(v) && !_.IsBlank(v)) {
            if ('insertAdjacentHTML' in el) {
                el.insertAdjacentHTML('beforeend', v);
            } else {
                el.innerHTML += v;
            }
        }
    };
    _.Prepend = function (el, ElementOrHtml) {
        /// <summary>Inserts an element or html markup to a parent element as its first child</summary>
        /// <param name="el" type="Element | Selector">The parent element.</param>
        /// <param name="ElementOrHtml" type="Element|Html">The element or the html markup text that should be added</param>
        /// <returns type="void">nothing</returns>

        el = _(el);
        var v = ElementOrHtml;
        if (_.IsElement(v)) {
            if (el.children.length === 0)
                el.appendChild(v);
            else
                el.insertBefore(v, el.children[0]);
        } else if (_.IsString(v) && !_.IsBlank(v)) {
            if ('insertAdjacentHTML' in el) {
                el.insertAdjacentHTML('afterbegin', v);
            } else {
                el.innerHTML = v + el.innerHTML;
            }
            
        }
    };
    _.AppendElement = function (el, TagName) {
        var Result = el.ownerDocument.createElement(TagName);
        el.appendChild(Result);
        return Result;
    };

    _.Attribute = function (el, o, v) {
        /// <summary> Gets or sets the value of an attribute or sets the values of multiple attributes. 
        /// <para>NOTE: For the function to act as a get, just do leave the last argument empty or null.</para>
        /// <para>NOTE: When setting multiple attributes the last argument is not used.</para>
        /// <para>Example get: Attribute(el, 'id')</para>
        /// <para>Example set: Attribute(el, 'id', 'div0'); Attribute(el, { id: 'img0', src: 'image.jpg', 'width': '100px', height: '100px' });</para>
        ///</summary>
        /// <param name="el" type="Element">The element to operate on.</param>
        /// <param name="o" type="String|Object">When string denotes the attribute name. Else it's an object with key/value pairs where key may be a string</param>
        /// <param name="v" type="Object">The value of the attribute to set.</param>

        el = _(el);
        if (!el) return null;

        var SetProp = function (Prop, Val) {
            if (Prop in el) {
                el[Prop] = Val;
            } else {
                el.setAttribute(Prop, Val);
            }
        };

        if (_.IsEmpty(v) && _.IsString(o)) {       // get
            return el.getAttribute(o);
        } else {
            if (_.IsString(o)) {                    // set  
                SetProp(o, v);
            } else if (_.IsPlainObject(o)) {
                for (var Prop in o) {
                    SetProp(Prop, o[Prop]);
                }
            }

        }
    };
    _.RemoveAttribute = function (el, Name) {
        el = _(el);

        el.removeAttribute(Name);
    };
    _.Css = function (el, o, v) {
        /// <summary> Gets or sets the value of a style property or sets the values of multiple style properties. 
        /// <para>NOTE: For the function to act as a get, just do leave the last argument empty or null.</para>
        /// <para>NOTE: When setting multiple properties the last argument is not used.</para>
        /// <para>Example get: Css(el, 'width')</para>
        /// <para>Example set: Css(el, 'width', '100px'); Css(el, {'width': '100px', height: '100px', 'background-color', 'yellow', backgroundColor: 'red' });</para>
        ///</summary>
        /// <param name="el" type="Element">The element to operate on.</param>
        /// <param name="o" type="String|Object">When string denotes the property name. Else it's an object with key/value pairs where key may be a string</param>
        /// <param name="v" type="Object">The value of the property to set.</param>

        el = _(el);
        if (!el) return null;

        var SetProp = function (Prop, Val) {
            if (Prop in el.style) {
                el.style[Prop] = Val;
            } else {
                el.style.setProperty(Prop, Val, null);
            }
        };

        if (_.IsEmpty(v) && _.IsString(o)) {  // get
            var Style = _.ComputedStyle(el);
            return Style.getPropertyValue(o);
        } else {
            if (_.IsString(o)) {                    // set  
                SetProp(o, v);
            } else if (_.IsPlainObject(o)) {
                for (var Prop in o) {
                    SetProp(Prop, o[Prop]);
                }
            }

        }
    };
    _.CssText = function (el, v) {
        /// <summary>Gets or sets the css style text of an element</summary>
        el = _(el);
        if (!el) return null;

        if (_.IsEmpty(v))
            return el.style.cssText;
        else
            el.style.cssText = v;
    };
    _.StyleProp = function (el, Name, v) {
        /// <summary>Gets or sets the value of a css style property of an element</summary>
        el = _(el);
        if (!el) return null;

        if (_.IsEmpty(v)) {
            var Style = _.ComputedStyle(el);
            return Style.getPropertyValue(Name);
        } else {
            el.style.setProperty(Name, v);
        }
    };
    _.ComputedStyle = function (el) {
        el = _(el);
        if (!el) return null;
        return el.ownerDocument.defaultView.getComputedStyle(el, '');
    };

    _.Data = function (el, o, v) {
        /// <summary> Gets or sets the value of a data-* attribute or sets the values of multiple data-* attributes. 
        /// <para>NOTE: For the function to act as a get, just do leave the last argument empty or null.</para>
        /// <para>NOTE: When setting multiple items the last argument is not used.</para>
        /// <para>Example get: Data(el, 'size')</para>
        /// <para>Example set: Data(el, 'size', '123'); Data(el, {'size': '123', count: '456', 'color', 'yellow', index: '0' });</para>
        ///</summary>
        /// <param name="el" type="Element">The element to operate on.</param>
        /// <param name="o" type="String|Object">When string denotes the item name. Else it's an object with key/value pairs where key may be a string</param>
        /// <param name="v" type="Object">The value of the item to set.</param>

        el = _(el);
        if (!el) return null;

        if (_.IsEmpty(v) && _.IsString(o)) {        // get
            return el.getAttribute('data-' + o);
        } else {
            if (_.IsString(o)) {                    // set  
                el.setAttribute('data-' + o, v);
            } else if (_.IsPlainObject(o)) {
                for (var Prop in o) {
                    el.setAttribute('data-' + Prop, o[Prop]);
                }
            }

        }
    };
    _.Role = function (el, v) {
        /// <summary> Gets or sets the value of a data-role attribute of an element  </summary>
        el = _(el);
        if (!el) return null;

        if (_.IsEmpty(v)) {                             // get
            return el.getAttribute('data-role');
        } else if (_.IsString(v)) {                     // set  
            el.setAttribute('data-role', v);
        }
    };
    _.Field = function (el, v) {
        /// <summary> Gets or sets the value of a data-field attribute of an element  </summary>
        el = _(el);
        if (!el) return null;

        if (_.IsEmpty(v)) {                             // get
            return el.getAttribute('data-field');
        } else if (_.IsString(v)) {                     // set  
            el.setAttribute('data-field', v);
        }
    };

    _.Display = function (el, v) {
        /// <summary>Gets or sets the value of the display style property or an element.</summary>
        el = _(el);
        if (!el) return null;

        if (_.IsEmpty(v)) {        // get
            return _.ComputedStyle(el).display;
        } else {                    // set
            el.style.display = v;
        }
    };
    _.Enabled = function (el, v) {
        el = _(el);
        if (!el) return false;

        if (_.IsEmpty(v)) {        // get
            return !el.disabled;
        } else {                    // set
            el.disabled = !v;
        }
    };
    _.Visibility = function (el, v) {
        el = _(el);
        if (!el) return null;

        if (_.IsEmpty(v)) {        // get
            return _.IsSameText(_.StyleProp(el, 'visibility'), 'visible');
        } else {                    // set
            el.style.visibility = v ? "visible" : "hidden";
        }
    };
    //---------------------------------------------------------------------------------------
    _.Paragraph = function (el, Text, CssClasses) {
        /// <summary>Adds a specified text as a paragraph to a parent element.</summary>
        /// <param name="el" type="Element">The parent element.</param>
        /// <param name="Text" type="String">The text of the paragraph.</param>
        /// <returns type="Element">The created dom paragraph element</returns>
        var Result = el.ownerDocument.createElement('p');
        Result.innerText = Text;
        el.appendChild(Result);
        _.AddClasses(Result, CssClasses);
        return Result;
    };
    _.Break = function (el) {
        /// <summary>Adds a text break to an element</summary>
        _.Append(el, '<br />');
    };
    _.Div = function (el, CssClasses) {
        /// <summary>Adds a div to an element and returns the created dom element</summary>
        var Result = el.ownerDocument.createElement('div');
        el.appendChild(Result);
        _.AddClasses(Result, CssClasses);
        return Result;
    };
    _.Span = function (el, CssClasses) {
        /// <summary>Adds a span to an element and returns the created dom element</summary>
        var Result = el.ownerDocument.createElement('span');
        el.appendChild(Result);
        _.AddClasses(Result, CssClasses);
        return Result;
    };

    _.el = function (TagName, Parent, CssClasses) {
        /// <summary>Creates and returns an element of type TagName or DIV if TagName is not defined. 
        // If Parent is defined appends the new element to it.</summary>
        var Doc = Parent ? Parent.ownerDocument : _.Document;
        var Result = Doc.createElement(TagName || 'div');
        if (_.IsElement(Parent)) {
            Parent.appendChild(Result);
        }
        _.AddClasses(Result, CssClasses);
        return Result;
    };
    //---------------------------------------------------------------------------------------
    _.CreateDebugDiv = function (Parent) {
        Parent = Parent || _.Document.body;
        var Result = new tp.Element(Parent);
        Result.Id = 'tp-DebugDiv';
        Result.Css({
            'position': 'fixed',
            height: 'auto',
            'min-height': '20px',
            background: 'beige',
            'font-size': '9pt',
            opacity: '0.5',
            border: '1px solid gray',
            padding: '10px',
        });

 
        Result.Bottom = 5;
        Result.Right = 5;

        tp.DebugDiv = Result;
        return Result;
    };
    //---------------------------------------------------------------------------------------
    _.ToPage = function (el) {
        /// <summary> Returns a tp.Point with the location of an element, relative to the Top/Left of the fully rendered page </summary>
        /// <returns type="tp.Point">The location of the element.</returns>

        var R = el.getBoundingClientRect();
        var po = _.PageOffset;
        var clientPoint = _.ToWindow(el);

        var X = Math.round(R.left + po.X - clientPoint.X);
        var Y = Math.round(R.top + po.Y - clientPoint.Y);

        return new _.Point(X, Y);
    };
    _.Offset = _.ToPage;
    _.ToParent = function (el) {
        /// <summary> Returns a tp.Point with the location of an element, relative to the Top/Left of its immediate parent </summary>
        /// <returns type="tp.Point">The location of the element.</returns>
        var X = Math.round(el.offsetLeft);
        var Y = Math.round(el.offsetTop);
        return new _.Point(X, Y);
    };
    _.ToWindow = function (el) {
        /// <summary> Returns a tp.Point with the location of an element, relative to the Top/Left of the browser window (viewport) </summary>
        /// <returns type="tp.Point">The location of the element.</returns>

        //var X = Math.round(el.clientLeft);
        //var Y = Math.round(el.clientTop);
        var R = el.getBoundingClientRect();
        var X = Math.round(R.left);
        var Y = Math.round(R.top);
        return new _.Point(X, Y);
    };
    _.SizeOf = function (el) {
        /// <summary> Returns a tp.Size with the size of an element. </summary>
        /// <returns type="tp.Size">The size of the element.</returns>
        var R = el.getBoundingClientRect();
        var W = Math.round(R.width);
        var H = Math.round(R.height);
        return new _.Size(W, H);
    };
    _.BoundingRect = function (el) {
        /// <summary> Returns a tp.Rectangle with the rectangle of an element in viewport, relative to the Top/Left of the viewport (uses the getBoundingClientRect). </summary>
        /// <returns type="tp.Rectangle">The area of the element.</returns>
        var R = el.getBoundingClientRect();
        var X = Math.round(R.left);
        var Y = Math.round(R.top);
        var W = Math.round(R.width);
        var H = Math.round(R.height);
        return new _.Rectangle(X, Y, W, H);
    };
    _.OffsetRect = function (el) {
        /// <summary> Returns a tp.Rectangle with the rectangle of an element relative to the Top/Left of its parent element. </summary>
        /// <returns type="tp.Rectangle">The area of the element.</returns>
        var Pos = _.ToParent(el);
        var Size = _.SizeOf(el);

        var X = Pos.X;
        var Y = Pos.Y;
        var W = Size.Width;
        var H = Size.Height;

        return new _.Rectangle(X, Y, W, H);

    };

    _.GetLineHeight = function (el, Factor) {
        /// <summary>Returns the height of a "line" or "row" based on font size 
        /// of an element and a user provider multiplication Factor</summary>
        /// <param name="el" type="Element">The element to be used for the calculation</param>
        /// <param name="Factor" type="Number">A multiplication factor (FontSize * Factor)</param>
        /// <returns type="Number">The height of a line/row</returns>

        Factor = Factor || 1.8;

        var FontSize = _.StyleProp(el, 'font-size');

        if (tp.IsEm(FontSize)) {
            var FontSize2 = tp.StyleProp(el.ownerDocument.body, 'font-size');
            if (!tp.IsPixel(FontSize2))
                throw new tp.Error('document.body font-size is NOT defined in pixels');
            FontSize2 = tp.GetNumber(FontSize2);
            FontSize = FontSize * FontSize2;
        } else {
            FontSize = tp.GetNumber(FontSize);
        }

        var Result = Math.ceil(FontSize * Factor);

        return Result > 0 ? Result : 24;
    };
    //---------------------------------------------------------------------------------------
    _.MakeCenterChildren = function (el) {
        /// <summary> Turns a block element into a flex container panel that centers its childrent both in the x and y axis </summary>
        if (_.IsElement(el)) {
            var S = "position: absolute; height:100%; width:100%; display: flex; justify-content: center; align-items: center; flex-wrap: wrap;";
            el.style.cssText = S;
        }
    };
    _.FrameRemoveBorder = function FrameRemoveBorder(el) {
        // from: http://stackoverflow.com/questions/1516803/how-to-remove-border-from-iframe-in-ie-using-javascript
        if (el.frameBorder)
            el.frameBorder = '0'; //  For other browsers.

        el.setAttribute('frameBorder', "0"); //  For other browsers (just a backup for the above).
        //el.contentWindow.document.body.style.border = "none";   //  For IE.
    };
    var fScrollbarSize = null;
    _.Property('ScrollbarSize', _, function () {
        if (!fScrollbarSize) {
            fScrollbarSize = new tp.Size();

            var outer = _.Document.createElement("div");
            outer.style.visibility = "hidden";
            outer.style.width = "100px";
            outer.style.height = "100px";
            _.Document.body.appendChild(outer);

            var widthNoScroll = outer.offsetWidth;
            var heightNoScroll = outer.offsetHeight;

            // force scrollbars
            outer.style.overflow = "scroll";

            // add innerdiv
            var inner = _.Document.createElement("div");
            inner.style.width = "100%";
            inner.style.height = "100%";
            outer.appendChild(inner);

            var widthWithScroll = inner.offsetWidth;
            var heightWithScroll = inner.offsetHeight;

            // remove divs
            outer.parentNode.removeChild(outer);

            fScrollbarSize.Width = widthNoScroll - widthWithScroll;
            fScrollbarSize.Height = heightNoScroll - heightWithScroll;
        }

        return fScrollbarSize;
    });
    //---------------------------------------------------------------------------------------
    _.CreateParams = {};    // control create params
    _.PageParams = {        // page params (e.g. Ids etc.)
        IsAuthenticated: false,
    };      
    //---------------------------------------------------------------------------------------
    _.HasClass = function (el, Name) {
        el = _(el);
        if (!el) return null;
        return _.IsBlank(Name) ? false : el.classList.contains(Name);
    };
    _.AddClass = function (el, Name) {
        el = _(el);
        if (!el) return null;
        if (!_.IsBlank(Name)) {
            if (!el.classList.contains(Name))
                el.classList.add(Name);
        }
    };
    _.RemoveClass = function (el, Name) {
        el = _(el);
        if (!el) return null;
        if (!_.IsBlank(Name)) {
            if (el.classList.contains(Name))
                el.classList.remove(Name);
        }
    };
    _.ToggleClass = function (el, Name) {
        el = _(el);
        if (!el) return null;
        el.classList.toggle(Name);
        /*  
        if (_.HasClass(el, Name)) {
            _.RemoveClass(el, Name);
        } else {
            _.AddClass(el, Name);
        }
        */
    };

    _.AddClasses = function (el, Names) {
        /// <summary>Adds Names to class of an element. Names should be a space delimited string.</summary>
        el = _(el);
        if (!el) return null;
        if (!_.IsBlank(Names)) {
            var Parts = Names.split(' ');
            for (var i = 0, ln = Parts.length; i < ln; i++) {
                if (!_.IsBlank(Parts[i]))
                    _.AddClass(el, Parts[i]);
            }
        }
    };
    _.RemoveClasses = function (el, Names) {
        el = _(el);
        if (!el) return null;
        if (!_.IsBlank(Names)) {
            var Parts = Names.split(' ');
            for (var i = 0, ln = Parts.length; i < ln; i++) {
                if (!_.IsBlank(Parts[i]))
                    _.RemoveClass(el, Parts[i]);
            }
        }
    };

    _.ClearClasses = function ClearClasses(el) {
        el = _(el);
        if (!el) return null;
        el.className = '';
    };

    _.ConcatClasses = function (Names, MoreNames) {
        /// <summary>Concatenates css class names into a single string. 
        /// <para>Can have multiple arguments.</para>
        /// <para>Each argument could be just a single class name, or more names space separated </para>
        ///</summary>
        var A = [];
        var Parts = null;
        var S, i, ln;

        for (i = 0, ln = arguments.length; i < ln; i++) {
            S = arguments[i];
            if (!_.IsBlank(S)) {
                Parts = _.Split(S, ' ', true);
                A = A.concat(Parts);
            }
        }

        return A.join(' ');
    };
    // text-box -----------------------------------------------------------------------------
    _.TextBoxSelectText = function (el, Start, End) {
        /// <summary>Sets the start and end positions of the current text selection in an input (mostly textbox) element</summary>
        /// <param name="el" type="Element">The input (textbox) element.</param>
        /// <param name="Start" type="Integer">The index of the first selected character</param>
        /// <param name="End" type="Integer">The index of the character after the last selected character</param>
 
        if (_.IsEmpty(End)) {
            End = el.value.length;
        }

        if ('setSelectionRange' in el) {
            el.setSelectionRange(Start, End);
        } else if ('createTextRange' in el) {
            var Range = el.createTextRange();
            Range.moveStart("character", Start);
            Range.moveEnd("character", -el.value.length + End);
            Range.select();
        }

        //el.focus();
    };
    _.TextBoxReplaceSelectedText = function (el, Text) {
        /// <summary>Replaces the selected text in an input (textbox) element with a specified text.</summary>
        /// <param name="el" type="Element">The input (textbox) element.</param>
        /// <param name="Text" type="String">The text to use in replacing the currently selected text in the element.</param>

        if ('setSelectionRange' in el) {
            var Start = el.selectionStart;
            el.value = el.value.substring(0, Start) + Text + el.value.substring(el.selectionEnd, el.value.length);
            el.setSelectionRange(Start + Text.length, Start + Text.length);
        } else if ('selection' in el.ownerDocument) {
            var Range = el.ownerDocument.selection.createRange();
            Range.text = Text;
            Range.collapse(true);
            Range.select();
        }
 
        //el.focus();
    };
    // text  --------------------------------------------------------------------------------  
    _.SelectText = function (el, win) {
        /// <summary>Selects the text of an element</summary>
        /// <para> from: http://stackoverflow.com/questions/985272/selecting-text-in-an-element-akin-to-highlighting-with-your-mouse </para>
        el = _(el);
        if (!el) return null;

        win = win || window;
        var doc = win.document, sel, range;
        if (win.getSelection && doc.createRange) {
            sel = win.getSelection();
            range = doc.createRange();
            range.selectNodeContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (doc.body.createTextRange) {
            range = doc.body.createTextRange();
            range.moveToElementText(el);
            range.select();
        }
    };
    // z-order ------------------------------------------------------------------------------ 
    _.ZIndex = function (el, v) {
        /* z-Index - integer 
see:    http://philipwalton.com/articles/what-no-one-told-you-about-z-index/
http://www.w3.org/TR/CSS2/zindex.html        */

        el = _(el);
        if (!el) return null;
        if (_.IsEmpty(v)) {
            var Result = _.ComputedStyle(el).zIndex;
            return _.IsNaN(Result) ? 0 : Result;
        } else {
            el.style.zIndex = v;
        }

    };
    _.MaxZIndexOf = function MaxZIndexOf(Container) {
        Container = Container || document;

        var Result, List, el, i, ln, v;

        Result = 0;

        List = Container.querySelectorAll('*');
        ln = List.length;

        for (i = 0; i < ln; i++) {
            el = List[i];
            v = el.ownerDocument.defaultView.getComputedStyle(el, '').getPropertyValue('z-index');
            if (v === 'auto') {
                v = i;
            }
            if (v && _.IsNumber(v)) {
                if (v > Result) {
                    Result = v;
                }
            }
        }

        return Result;
    };
    _.MinZIndexOf = function MinZIndexOf(Container) {
        Container = Container || document;

        var Result, List, el, i, ln, v;

        Result = 0;

        List = Container.querySelectorAll('*');
        ln = List.length;

        for (i = 0; i < ln; i++) {
            el = List[i];
            v = el.ownerDocument.defaultView.getComputedStyle(el, '').getPropertyValue('z-index');
            if (v === 'auto') {
                v = i;
            }
            if (v && _.IsNumber(v)) {
                if (v < Result) {
                    Result = v;
                }
            }
        }

        return Result;
    };
    _.BringToFront = function BringToFront(el) {
        el = _(el);
        if (!el) return null;

        var v = _.MaxZIndexOf(el.parentNode);
        v++;
        el.style.zIndex = v;
        return v;
    };
    _.SendToBack = function SendToBack(el) {
        el = _(el);
        if (!el) return null;

        var v = _.MinZIndexOf(el.parentNode);
        v--;
        el.style.zIndex = v;
        return v;
    };
    // events  ------------------------------------------------------------------------------
    _.On = function (Sender, EventName, Listener, UseCapture) {
        /// <summary> Adds Listener to Sender (target of the event) for the EventName event. </summary>
        /// <param name="Sender" type="Element">The dom element upon which the event happens</param>
        /// <param name="EventName" type="String">The 'name' of the event. Could be a dom name, i.e. 'click' or a tp.Events.XXXX constant.</param>
        /// <param name="Listener" type="Object | Function">The object to notify or the function to call, when the event happens.
        /// <para> A listener object must implement the handleEvent() function 
        /// if it is to be called with the context (this) pointing to that listener </para>
        /// <para> See: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener </para>
        /// </param>
        /// <param name="UseCapture" type="Boolean">Defaults to false. When false (default) the event propagation uses the bubble mode, else the capture mode. 
        /// <para> WARNING: Only certain events can bubble. Events that do bubble have the Event.bubbles property set to true. </para>
        /// <para> See: http://stackoverflow.com/questions/4616694/what-is-event-bubbling-and-capturing </para>
        /// <para> See: https://en.wikipedia.org/wiki/DOM_events </para>
        ///</param>


        var S = _.Events.ToDom(EventName);              // could be a tp.Events.XXXX constant
        if (!_.IsSameText(S, _.Events.Unknown)) {       // it is a dom event
            EventName = S;
        }

        Sender.addEventListener(EventName, Listener, UseCapture);
    };
    _.Off = function (Sender, EventName, Listener, UseCapture) {
        /// <summary>
        /// Removes Listener from  Sender (target of the event) for the EventName event.
        /// </summary>

        var S = _.Events.ToDom(EventName);              // could be a tp.Events.XXXX constant
        if (!_.IsSameText(S, _.Events.Unknown)) {       // it is a dom event
            EventName = S;
        }

        Sender.removeEventListener(EventName, Listener, UseCapture);
    };
    _.Trigger = function (Sender, ev) {
        return Sender.dispatchEvent(ev);
    };
    _.CancelBubble = function (e) {

        if ('stopPropagation' in e) {
            e.stopPropagation();
        }

        if ('cancelBubble' in e) {
            e.cancelBubble = true;
        }

        if ('cancel' in e) {
            e.cancel = true;
        }

        if ('returnValue' in e) {
            e.returnValue = false;
        }


        return false;
    };
    _.CreateEventObject = function (EventTypeName) {
        var Result = null;
        try {
            Result = document.createEvent(EventTypeName);
        } catch (e) {
        }
        return Result;
    };
    _.CreateCustomEvent = function (EventName, Bubbles, Cancelable, Detail) {
        if (typeof Bubbles === _.Undefined) { Bubbles = true; }
        if (typeof Cancelable === _.Undefined) { Cancelable = true; }
        if (typeof Detail === _.Undefined) { Detail = null; }
        var ev = this.CreateEventObject("CustomEvent");

        if (ev) {
            Bubbles = !Bubbles ? false : Bubbles;
            Cancelable = !Cancelable ? true : Cancelable;
            Detail = Detail || {};
            Detail.IsCustom = true;

            if (ev) {
                ev.initCustomEvent(EventName, Bubbles, Cancelable, Detail);
            }
        }

        return ev;
    };
    //---------------------------------------------------------------------------------------
    _.Property('ViewportSize', _, function () {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        return new _.Size(w, h);
    });
    _.Property('PageOffset', _, function () {
        /// <summary>
        /// Relative to the Top/Left of the fully rendered content area in the browser.
        /// </summary>
        var X = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        var Y = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
        return new _.Point(X, Y);
    });
    // screen mode --------------------------------------------------------------------------

    /*   
    // @media all and (max-width :767px)
    // @media all and (min-width :768px)
    // @media all and (min-width :992px)
    // @media all and (min-width :1200px)

 
    */
    _.ScreenMode = {
        None: 0,
        XSmall: 1,     //    0 ..  767
        Small: 2,      //  768 ..  991
        Medium: 3,     //  992 .. 1200
        Large: 4,      // 1201 .. 
    };
    _.PageMode = {
        Custom: 0,     // custom, by code
        Document: 1,   // document-like
        Desktop: 2,    // desktop-like
    };
    _.GetScreenMode = function () {
        var VS = _.ViewportSize;
        if (VS.Width <= 767) {
            return _.ScreenMode.XSmall;
        } else if (VS.Width <= 991) {
            return _.ScreenMode.Small;
        } else if (VS.Width <= 1200) {
            return _.ScreenMode.Medium;
        } else {
            return _.ScreenMode.Large;
        }
    };
    _.Property('IsXSmall', _, function () {
        return _.GetScreenMode() === _.ScreenMode.XSmall;
    });
    _.Property('IsSmall', _, function () {
        return _.GetScreenMode() === _.ScreenMode.Small;
    });
    _.Property('IsMedium', _, function () {
        return _.GetScreenMode() === _.ScreenMode.Medium;
    });
    _.Property('IsLarge', _, function () {
        return _.GetScreenMode() === _.ScreenMode.Large;
    });

    //---------------------------------------------------------------------------------------
    _.DataType = {
        None: "N",          // none
        String: "S",        // {"string", "nvarchar", "nchar", "varchar", "char"}
        Integer: "I",       // {"integer", "int", "larginteger", "largint", "smallint", "autoinc", "autoincrement", "identity", "counter"}
        Boolean: "L",       // {"boolean", "bit", "logical"}
        Float: "F",         // {"float", "double", "extended", "real", "BCD", "FBCD", "currency", "money"}
        Date: "D",          // {"date"}
        Time: "T",          // {"time"}
        DateTime: "M",      // {"moment", "datetime", "timestamp"}
        Memo: "X",          // {"memo", "text", "clob"}
        Graphic: "G",       // {"graphic", "image"}
        Blob: "B",          // {"blob", "bin", "binary"}  
    };
    _.DataTypeToJson = function (v) {
        if (v === _.DataType.String)
            return "string";
        if ((v === _.DataType.Integer) || (v === _.DataType.Float))
            return "number";
        if ((v === _.DataType.DateTime) || (v === _.DataType.Date) || (v === _.DataType.Time))
            return "date";
        if (v === _.DataType.Boolean)
            return "boolean";

        return "string";
    };
    _.DataTypeName = function (DataType) {
        for (var Prop in _.DataType) {
            if (_.DataType[Prop] === DataType)
                return Prop;
        }
        return 'None';
    };
    //---------------------------------------------------------------------------------------
    _.FilterOp = {      // filter comparison operator
        None: 0,

        GT: 1,          // greater  than
        GE: 2,          // greater or equeal
        EQ: 4,          // equal
        NE: 8,          // not equal
        LT: 0x10,       // less than
        LE: 0x20,       // less or equeal

        CO: 0x40,       // contains
        SW: 0x80,       // starts with
        EW: 0x100,      // ends width

        get Greater() { return this.GT; },
        get GreaterOrEqual() { return this.GE; },
        get Equal() { return this.EQ; },
        get NotEqual() { return this.NE; },
        get Less() { return this.LT; },
        get LessOrEqual() { return this.LE; },

        get Contains() { return this.CO; },
        get StartsWith() { return this.SW; },
        get EndsWith() { return this.EW; },

        Compare: function (Operator, A, B) {

            if (A === _.Undefined) { A = null; }
            if (B === _.Undefined) { B = null; }

            if (A instanceof Date) { A = A.valueOf(); }
            if (B instanceof Date) { B = B.valueOf(); }

            switch (Operator) {
                case this.Greater: return A > B;
                case this.GreaterOrEqual: return A >= B;
                case this.Equal: return A === B;
                case this.NotEqual: return A !== B;
                case this.Less: return A < B;
                case this.LessOrEqual: return A <= B;

                case this.Contains: return tp.ContainsText(A, B, true);
                case this.StartsWith: return tp.StartsWith(A, B, true);
                case this.EndsWith: return tp.EndsWith(A, B, true);
            }

            return false;
        },

    };
    //---------------------------------------------------------------------------------------
    _.Property('NotificationType', _, function () {
        var o = {
            Info: 1,
            Warning: 2,
            Error: 3,
            Success: 4,
        };
        return o;
    });
    _.Notify = function (Message, Type) {
        if (Type === _.NotificationType.Error) {
            if (tp.ErrorBox) {
                tp.ErrorBox(Message);
                return;
            }
        }
        alert(Message);
    };
    _.InfoNote = function (Message) {
        _.Notify(Message, _.NotificationType.Info);
    };
    _.WarningNote = function (Message) {
        _.Notify(Message, _.NotificationType.Warning);
    };
    _.ErrorNote = function (Message) {
        _.Notify(Message, _.NotificationType.Error);
    };
    _.SuccessNote = function (Message) {
        _.Notify(Message, _.NotificationType.Success);
    };
    //---------------------------------------------------------------------------------------
    _.EnumNameOf = function (EnumType, EnumValue) {
        for (var Key in EnumType) {
            if (EnumType[Key] === EnumValue)
                return Key;
        }

        return '';
    };
    _.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    _.Spinner = function (Flag) {
        /// <summary>Shows or hides a spinner</summary>
        /// <para>NOTE: This is a placeholder function</para>
    };
    _.SpinnerForceHide = function () {
        if (_.IsFunction(_.Spinner.ForceHide)) {
            _.Spinner.ForceHide();
        } else {
            _.Spinner(false);
        }
    };
    // document ready state ----------------------------------------------------------------- 
    _.IsReady = function () {
        return document.readyState === "complete";
    };
    _.Ready = function (Func) {
        _.AddReadyListener(Func);
    };
    _.AddReadyListener = function (ListenerOrHandler, Handler) {
        /// <summary>
        /// Adds a listener to the document.onreadystatechange event.
        /// <para> If ListenerOrHandler is a function then Handler is not used. </para>
        /// <para> Otherwise ListenerOrHandler must be an object and Handler an event handler function. </para>
        /// </summary>
        var L, H;
        if (arguments.length === 2) {
            L = ListenerOrHandler;
            H = Handler;
        } else {
            L = null;
            H = ListenerOrHandler;
        }

        ReadyListeners.push({ listener: L, handler: H });
    };
    //---------------------------------------------------------------------------------------
    var ReadyListeners = [];
    var CallReadyListeners = function (ev) {
        /// <summary>
        /// Calls listeners registered by a call to On().
        /// <para> NOTE: DO NOT CALL IT DIRECTLY. It is called by Tripous. </para>
        /// </summary>
        if (document.readyState === "complete") {
            var list = ReadyListeners;

            var listener, handler;
            for (var i = 0, ln = list.length; i < ln; i++) {
                listener = list[i].listener;
                handler = list[i].handler;
                if (!_.IsEmpty(listener)) {
                    handler.call(listener, ev);
                } else {
                    handler(ev);
                }
            }
        }
    };
    document.addEventListener("readystatechange", function (e) {
        if (document.readyState === "complete") {
            CallReadyListeners(e);
        }
    }, false);

    // this AddReadyListener() call is called when this whole closure executes on start-up
    _.AddReadyListener(function () {
        if (_.IsFunction(_.Main)) {
            _.Main();
        }
    });

    return Class;
})();   


(function (tp) {
 
    //#region Local
    tp.Local = (function () {
        function Class() {
            /// <summary> Data stored in localStorage has no expiration time </summary>
            throw new Error("Can NOT instantiate a static class");
        }
        var _ = Class;
 

        _.Clear = function () {
            /// <summary>Clear the storage</summary>
            if (typeof (Storage) !== tp.Undefined) {
                localStorage.clear();
            }
        };
        _.Remove = function (Key) {
            /// <summary>Remove an entry from the storage</summary>
            if (typeof (Storage) !== tp.Undefined) {
                localStorage.removeItem(Key);
            }
        };
        _.Get = function (Key, Default) {
            /// <summary>Local Storage get a value</summary>
            var Result = null;
            if (typeof (Storage) !== tp.Undefined) {
                Result = localStorage.getItem(Key);
            }
            if (tp.IsBlank(Result))
                Result = Default;
            return Result;
        };
        _.Set = function (Key, v) {
            /// <summary>Local Storage set a value</summary>
            if (typeof (Storage) !== tp.Undefined) {
                localStorage.setItem(Key, v);
            }
        };
        _.GetObject = function (Key, Default) {
            /// <summary>Local Storage get object </summary>
            var Result = _.Get(Key, null);
            if (tp.IsString(Result)) {
                Result = JSON.parse(Result);
            } else {
                Result = Default;
            }

            return Result;
        };
        _.SetObject = function (Key, v) {
            /// <summary>Local Storage set object</summary>
            if (!tp.IsEmpty(v)) {
                v = JSON.stringify(v);
                _.Set(Key, v);
            }
        };

        return Class;
    })();
    //#endregion

    //#region Session
    tp.Session = (function () {
        /// <summary>A page session lasts for as long as the browser is open and survives over page 
        /// reloads and restores. Opening a page in a new tab or window will cause a new session 
        /// to be initiated, which differs from how session cookies work </summary>
        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }
        var _ = Class;

        _.Clear = function () {
            /// <summary>Clear the storage</summary>
            if (typeof (Storage) !== tp.Undefined) {
                sessionStorage.clear();
            }
        };
        _.Remove = function (Key) {
            /// <summary>Remove an entry from the storage</summary>
            if (typeof (Storage) !== tp.Undefined) {
                sessionStorage.removeItem(Key);
            }
        };
        _.Get = function (Key, Default) {
            /// <summary>Session Storage get a value</summary>
            var Result = null;
            if (typeof (Storage) !== tp.Undefined) {
                Result = sessionStorage.getItem(Key);
            }
            if (tp.IsBlank(Result))
                Result = Default;
            return Result;
        };
        _.Set = function (Key, v) {
            /// <summary>Session Storage set a value</summary>
            if (typeof (Storage) !== tp.Undefined) {
                sessionStorage.setItem(Key, v);
            }
        };
        _.GetObject = function (Key, Default) {
            /// <summary>Local Storage get object </summary>
            var Result = _.Get(Key, null);
            if (tp.IsString(Result)) {
                Result = JSON.parse(Result);
            } else {
                Result = Default;
            }

            return Result;
        };
        _.SetObject = function (Key, v) {
            /// <summary>Session Storage set object</summary>
            if (!tp.IsEmpty(v)) {
                v = JSON.stringify(v);
                _.Set(Key, v);
            }
        };

        return Class;
    })();
    //#endregion

    //#region Urls
    tp.Urls = (function () {
        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }

        var _ = Class;

        tp.Property('Base', _, function () {
            var Result = '';
            if ('baseURI' in document) {
                Result = document.baseURI;
            } else if ('origin' in window.location) {
                Result = window.location.origin;
            } else if (document.getElementsByTagName("base") && (document.getElementsByTagName("base").length > 0)) {
                Result = document.getElementsByTagName("base")[0].href;
            } else {
                Result = window.location.protocol + "//" + window.location.host + "/";
            }

            if ((Result.length > 0) && (Result.substring(Result.length - 1, Result.length) !== '/')) {
                Result = Result + '/';
            }

            return Result;

        });

        return Class;
    })();
    //#endregion

    //#region Environment
    tp.Environment = (function () {
        //  (check also :  http://headjs.com)   
        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }

        var ua = typeof navigator !== tp.Undefined ? navigator.userAgent : '';
        var lua = ua.toLowerCase();

        var Match = function (regex) {
            var m = ua.match(regex);
            return (m && m.length > 1 && m[1]) || '';
        };

        var Name = '';
        var Version = '';
        var versionIdentifier = Match(/version\/(\d+(\.\d+)?)/i);
        var OSVersion = '';

        var IosDevice = Match(/(ipod|iphone|ipad)/i).toLowerCase();
        var AndroidLike = /like android/i.test(lua);
        var Android = !AndroidLike && /android/i.test(lua);
        var Ios = false;
        var FirefoxOs = false;
        var Sailfish = false;
        var WebOs = false;
        var Bada = false;
        var Tizen = false;

        var Tablet = /tablet/i.test(lua);
        var Mobile = !Tablet && /[^-]mobi/i.test(lua);
        var iPhone = false;
        var iPad = false;
        var iPod = false;
        var WindowsPhone = false;
        var BlackBerry = false;
        var Touchpad = false;

        var MSIE = false;
        var Firefox = false;
        var Chrome = false;
        var Opera = false;
        var Safari = false;
        var SeaMonkey = false;
        var Silk = false;
        var Phantom = false;

        var WebKit = false;
        var Gecko = false;

        var Grade = 'X';

        var Windows = /windows|win32|win64/.test(lua); // Match(/windows|Windows|win32|win64/);
        var Mac = /macintosh|mac os x/.test(lua);
        var Air = /adobeair/.test(lua);
        var Linux = /linux/.test(lua);
        var Secure = /^https/i.test(window.location.protocol);

        if (/opera|opr/i.test(lua)) {
            Name = 'Opera';
            Opera = true;
            Version = versionIdentifier || Match(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i);
        } else if (/windows phone/i.test(lua)) {
            Name = 'Windows Phone';
            WindowsPhone = true;
            MSIE = true;
            Version = Match(/iemobile\/(\d+(\.\d+)?)/i);
        } else if (/msie|trident/i.test(lua)) {
            Name = 'Internet Explorer';
            MSIE = true;
            Version = Match(/(?:msie |rv:)(\d+(\.\d+)?)/i);
        } else if (/chrome|crios|crmo/i.test(lua)) {
            Name = 'Chrome';
            Chrome = true;
            Version = Match(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i);
        } else if (IosDevice) {
            Name = IosDevice === 'iphone' ? 'iPhone' : IosDevice === 'ipad' ? 'iPad' : 'iPod';
            iPhone = Name === 'iPhone';
            iPad = Name === 'iPad';
            iPod = Name === 'iPod';

            // WTF: version is not part of user agent in web apps
            if (versionIdentifier) {
                Version = versionIdentifier;
            }
        } else if (/sailfish/i.test(lua)) {
            Name = 'Sailfish';
            Sailfish = true;
            Version = Match(/sailfish\s?browser\/(\d+(\.\d+)?)/i);
        } else if (/seamonkey\//i.test(lua)) {
            Name = 'SeaMonkey';
            SeaMonkey = true;
            Version = Match(/seamonkey\/(\d+(\.\d+)?)/i);
        } else if (/firefox|iceweasel/i.test(lua)) {
            Name = 'Firefox';
            Firefox = true;
            Version = Match(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i);

            if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(lua)) {
                FirefoxOs = true;
            }
        } else if (/silk/i.test(lua)) {
            Name = 'Amazon Silk';
            Silk = true;
            Version = Match(/silk\/(\d+(\.\d+)?)/i);
        } else if (Android) {
            Name = 'Android';
            Version = versionIdentifier;
        } else if (/phantom/i.test(lua)) {
            Name = 'PhantomJS';
            Phantom = true;
            Version = Match(/phantomjs\/(\d+(\.\d+)?)/i);
        } else if (/blackberry|\bbb\d+/i.test(lua) || /rim\stablet/i.test(lua)) {
            Name = 'BlackBerry';
            BlackBerry = true;
            Version = versionIdentifier || Match(/blackberry[\d]+\/(\d+(\.\d+)?)/i);
        } else if (/(web|hpw)os/i.test(lua)) {
            Name = 'WebOS';
            WebOs = true;
            Version = versionIdentifier || Match(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i);
            /touchpad\//i.test(lua) && (Touchpad = true);
        } else if (/bada/i.test(lua)) {
            Name = 'Bada';
            Bada = true;
            Version = Match(/dolfin\/(\d+(\.\d+)?)/i);
        } else if (/tizen/i.test(lua)) {
            Name = 'Tizen';
            Tizen = true;
            Version = Match(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier;
        } else if (/safari/i.test(lua)) {
            Name = 'Safari';
            Safari = true;
            Version = versionIdentifier;
        }

        // set webkit or gecko flag for browsers based on these engines
        if (/(apple)?webkit/i.test(lua)) {
            Name = Name || "Webkit";
            WebKit = true;
            if (!Version && versionIdentifier) {
                Version = versionIdentifier;
            }
        } else if (!Opera && /gecko\//i.test(lua)) {
            Name = name || "Gecko";
            Gecko = true;
            Version = Version || Match(/gecko\/(\d+(\.\d+)?)/i);
        }

        // set OS flags for platforms that have multiple browsers
        if (Android || Silk) {
            Android = true;
        } else if (IosDevice) {
            Ios = true;
        }

        // OS version extraction
        var osVersion = '';
        if (IosDevice) {
            osVersion = Match(/os (\d+([_\s]\d+)*) like mac os x/i);
            osVersion = osVersion.replace(/[_\s]/g, '.');
        } else if (Android) {
            osVersion = Match(/android[ \/-](\d+(\.\d+)*)/i);
        } else if (WindowsPhone) {
            osVersion = Match(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
        } else if (WebOs) {
            osVersion = Match(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
        } else if (BlackBerry) {
            osVersion = Match(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
        } else if (Bada) {
            osVersion = Match(/bada\/(\d+(\.\d+)*)/i);
        } else if (Tizen) {
            osVersion = Match(/tizen[\/\s](\d+(\.\d+)*)/i);
        }
        if (osVersion) {
            OSVersion = osVersion;
        }

        // device type extraction
        var osMajorVersion = OSVersion.split('.')[0];
        if (Tablet || IosDevice === 'ipad' || (Android && (osMajorVersion === '3' || (osMajorVersion === '4' && !Mobile))) || Silk) {
            Tablet = true;
        } else if (Mobile || IosDevice === 'iphone' || IosDevice === 'ipod' || Android || BlackBerry || WebOs || Bada) {
            Mobile = true;
        }

        // Graded Browser Support
        // http://developer.yahoo.com/yui/articles/gbs
        if ((MSIE && Version >= 10) || (Chrome && Version >= 20) || (Firefox && Version >= 20.0) || (Safari && Version >= 6) || (Opera && Version >= 10.0) || (Ios && OSVersion && OSVersion.split(".")[0] >= '6')) {
            Grade = 'A';
        } else if ((MSIE && Version < 10) || (Chrome && Version < 20) || (Firefox && Version < 20.0) || (Safari && Version < 6) || (Opera && Version < 10.0) || (Ios && OSVersion && OSVersion.split(".")[0] < '6')) {
            Grade = 'C';
        }

        var _ = Class;

        tp.Property('UserAgent', _, function () { return ua; });
        tp.Property('Name', _, function () { return Name; });
        tp.Property('Version', _, function () { return Version; });
        tp.Property('OSVersion', _, function () { return OSVersion; });
        tp.Property('IosDevice', _, function () { return IosDevice; });
        tp.Property('Android', _, function () { return Android; });
        tp.Property('AndroidLike', _, function () { return AndroidLike; });
        tp.Property('Ios', _, function () { return Ios; });
        tp.Property('FirefoxOs', _, function () { return FirefoxOs; });
        tp.Property('Sailfish', _, function () { return Sailfish; });
        tp.Property('WebOs', _, function () { return WebOs; });
        tp.Property('Bada', _, function () { return Bada; });
        tp.Property('Tizen', _, function () { return Tizen; });
        tp.Property('Tablet', _, function () { return Tablet; });
        tp.Property('Mobile', _, function () { return Mobile; });
        tp.Property('iPhone', _, function () { return iPhone; });
        tp.Property('iPad', _, function () { return iPad; });
        tp.Property('iPod', _, function () { return iPod; });
        tp.Property('WindowsPhone', _, function () { return WindowsPhone; });
        tp.Property('BlackBerry', _, function () { return BlackBerry; });
        tp.Property('Touchpad', _, function () { return Touchpad; });
        tp.Property('IE', _, function () { return MSIE; });
        tp.Property('Firefox', _, function () { return Firefox; });
        tp.Property('Chrome', _, function () { return Chrome; });
        tp.Property('Opera', _, function () { return Opera; });
        tp.Property('Safari', _, function () { return Safari; });
        tp.Property('SeaMonkey', _, function () { return SeaMonkey; });
        tp.Property('Silk', _, function () { return Silk; });
        tp.Property('Phantom', _, function () { return Phantom; });
        tp.Property('WebKit', _, function () { return WebKit; });
        tp.Property('Gecko', _, function () { return Gecko; });
        tp.Property('Grade', _, function () { return Grade; });
        tp.Property('Windows', _, function () { return Windows; });
        tp.Property('Mac', _, function () { return Mac; });
        tp.Property('AdobeAir', _, function () { return Air; });
        tp.Property('Linux', _, function () { return Linux; });
        tp.Property('Secure', _, function () { return Secure; });

        return Class;
    })();
    //#endregion

    //#region CssSheet
    tp.CssSheet = (function () {

        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }
        var _ = Class;

        _.CreateSheet = function (Id) {
            /// <summary>Creates a style sheet element under Id</summary>
            // Create the <style> tag
            var style = document.createElement("style");
            style.id = Id;

            // WebKit hack :(
            style.appendChild(document.createTextNode(""));

            // Add the <style> element to the page
            document.head.appendChild(style);

            //var sheet = style.sheet;
            var sheet = style.sheet ? style.sheet : style.styleSheet;

            return sheet;
        };
        _.SheetById = function (Id) {
            /// <summary>
            /// Returns a sheet object  by Id
            /// <para> example: CssSheetById('MySheetId') </para>
            /// <para> WARNING: No # prefix is used </para>
            /// </summary>
            var Sheets = document.styleSheets;
            var NodeId;
            for (var i = 0; i < Sheets.length; i++) {
                NodeId = Sheets[i].id || Sheets[i].ownerNode.id;
                if (NodeId === Id) {
                    return Sheets[i];
                }
            }
            return null;
        };
        _.CreateClass = function (Sheet, ClassName, ClassDef) {
            /// <summary>
            /// Creates a css Class with ClassDef in Sheet
            /// <para> WARNING: No surrounding brackets in ClassDef </para>
            ///</summary>
            if (Sheet.insertRule) {
                var S = tp.Format("{0} { {1} }", ClassName, ClassDef);
                Sheet.insertRule(S, 0);
            }
            /*
            else {  // Internet Explorer before version 9
            if (Sheet.addRule) {
            Sheet.addRule(ClassName, ClassDef);
            }
            }
            */
        };
        _.GetClassDef = function (className) {
            for (var i = 0; i < document.styleSheets.length; i++) {
                var sheet = document.styleSheets[i];
                var classes = sheet.rules || sheet.cssRules;
                for (var x = 0; x < classes.length; x++) {
                    if (classes[x].selectorText && -1 !== classes[x].selectorText.indexOf(className)) {
                        return classes[x].cssText || classes[x].style.cssText;
                    }
                }
            }
            return '';
        };
        _.IsClassDefined = function (ClassName) {
            /// <summary>
            /// Returns true if ClassName is a css class defined in any of the css sheets of the page.
            /// <para> example: IsClassDefined('.MyClass') </para>
            /// <para> WARNING: For single selector classes ONLY. </para>
            /// </summary>
            var Sheets = document.styleSheets;

            for (var i = 0; i < Sheets.length; i++) {
                var sheet = Sheets[i];
                var classes = sheet.rules || sheet.cssRules;
                for (var j = 0; j < classes.length; j++) {
                    if (classes[j].selectorText === ClassName) {
                        return true;
                    }
                }
            }
            return false;
        };

        return Class;
    })();
    //#endregion

    //#region DateRanges
    tp.DateRanges = (function () {
        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }

        var _ = Class;

        _.PrefixFrom = "FROM_DATE_RANGE_";
        _.PrefixTo = "TO_DATE_RANGE_";

        _.IsPast = function (Range) {
            var DateRange = tp.Enums.DateRange;

            switch (Range) {
                case DateRange.Today:
                case DateRange.Yesterday:

                case DateRange.PreviousWeek:
                case DateRange.PreviousTwoWeeks:
                case DateRange.PreviousMonth:
                case DateRange.PreviousTwoMonths:
                case DateRange.PreviousThreeMonths:
                case DateRange.PreviousSemester:
                case DateRange.PreviousYear:
                case DateRange.PreviousTwoYears:
                    return true;
            }

            return false;
        };

        return Class;
    })();
    //#endregion

    //#region Bf
    tp.Bf = (function () {
        // Bit-Field helper
        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }

        var _ = Class;

        _.Union = function (A, B) {
            /// <summary>
            /// Union (or). Returns the union of A and B.
            /// <para>The result is a new set containing ALL the elements of A and B.</para>
            /// <para><c>Result = A | B</c></para>
            /// </summary>
            return A | B;
        };
        _.Junction = function (A, B) {
            /// <summary>
            /// Intersection (and). Returns the intersection of A and B.
            /// <para>The result is a new set containing just the COMMON the elements of A and B.</para>
            /// <para><c>Result = A &amp; B</c></para>
            /// </summary>
            return A & B;
        };
        _.Dif = function (A, B) {
            /// <summary>
            /// Difference (xor). Returns the difference of A and B.
            /// <para>The result is a new set containing the NON COMMON the elements of A and B.</para>
            /// <para><c>Result = A ^ B</c></para>
            /// </summary>
            return A ^ B;
        };
        _.Subtract = function (A, B) {
            /// <summary>
            /// Subtraction (-). Returns the subtraction of B from A.
            /// <para>The result is a new set containing the the elements of A MINUS the elements of B.</para>
            /// <para><c>Result = A ^ (A &amp; B)</c></para>
            /// </summary>
            return A ^ (A & B);
        };
        _.Member = function (A, B) {
            /// <summary>
            /// Membership (in). Returns true if A in B. A can be a single value or a set.
            /// <para>Returns true if ALL elements of A are in B.</para>
            /// <para><c>Result = (A &amp; B) == A</c></para>
            /// </summary>
            if (0 === A)
                return false;

            return ((A & B) === A);
        };
        _.In = _.Member;
        _.IsEmpty = function (A) {
            /// <summary>
            /// Returns true if A is null or 0.
            /// </summary>
            return (A === tp.Undefined) || (A === null) || (Number(A) === 0);
        };

        _.EnumToString = function (EnumType, Value) {
            for (var Prop in EnumType) {
                if (EnumType[Prop] === Value) {
                    return Prop;
                }
            }

            return '';
        };
        _.SetToString = function (SetType, IntegerValue) {
            /// <summary>
            /// Returns a string representing the IntegerValue in SetType.
            /// </summary>
            /// <param name="SetType" type="Set type">The Set type, i.e. tp.Anchor</param>
            /// <param name="IntegerValue" type="Integer">The integer value to be converted to string, i.e 5 (returns Top, Left)</param>
            var Result = [];

            for (var Prop in SetType) {
                if (_.Member(SetType[Prop], IntegerValue)) {
                    Result.push(Prop);
                }
            }

            var S = Result.join(', ');
            return S;
        };

        return Class;
    })();
    //#endregion

    //#region EventGroup
    tp.EventGroup = {
        // Event Groups
        None: 0,
        Click: 1,               //
        Mouse: 2,               //
        Keyboard: 4,
        Focus: 8,
        Size: 0x10,
        Change: 0x20,
        Scroll: 0x40,
        Text: 0x80,
        DragSource: 0x100,
        DropTarget: 0x200,
        ContextMenu: 0x400,
        Clipboard: 0x800,
    };
    //#endregion

    //#region Events
    tp.Events = (function () {

        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }

        var _ = Class;

        _.Unknown = 'Unknown';
        _.Click = 'Click';
        _.DoubleClick = 'DoubleClick';
        _.MouseDown = 'MouseDown';
        _.MouseUp = 'MouseUp';
        _.MouseEnter = 'MouseEnter';
        _.MouseMove = 'MouseMove';
        _.MouseLeave = 'MouseLeave';
        _.KeyDown = 'KeyDown';
        _.KeyPress = 'KeyPress';
        _.KeyUp = 'KeyUp';
        _.MouseWheel = 'MouseWheel';
        _.Scroll = 'Scroll';
        _.ContextMenu = 'ContextMenu';
        _.Load = 'Load';
        _.Resize = 'Resize';
        _.Activate = 'Activate';
        _.Focus = 'Focus';
        _.LostFocus = 'LostFocus';
        _.TextChanged = 'TextChanged';
        _.TextSelected = 'TextSelected';
        _.Change = 'Change';
        _.DragStart = 'DragStart';
        _.Drag = 'Drag';
        _.DragEnd = 'DragEnd';
        _.DragEnter = 'DragEnter';
        _.DragOver = 'DragOver';
        _.DragLeave = 'DragLeave';
        _.DragDrop = 'DragDrop';
        _.Cut = 'Cut';
        _.Copy = 'Copy';
        _.Paste = 'Paste';
        _.Custom = 'Custom';

        var Map = [
            { dom: 'click', tp: _.Click },
            { dom: 'dblclick', tp: _.DoubleClick },
            { dom: 'mousedown', tp: _.MouseDown },
            { dom: 'mouseup', tp: _.MouseUp },
            { dom: 'mouseover', tp: _.MouseEnter },
            { dom: 'mousemove', tp: _.MouseMove },
            { dom: 'mouseout', tp: _.MouseLeave },
            { dom: 'keydown', tp: _.KeyDown },
            { dom: 'keypress', tp: _.KeyPress },
            { dom: 'keyup', tp: _.KeyUp },
            { dom: 'scroll', tp: _.Scroll },
            { dom: 'mousewheel', tp: _.MouseWheel },
            { dom: 'DOMMouseScroll', tp: _.MouseWheel },
            { dom: 'contextmenu', tp: _.ContextMenu },
            { dom: 'load', tp: _.Load },
            { dom: 'resize', tp: _.Resize },
            { dom: 'activate', tp: _.Activate },
            { dom: 'DOMActivate', tp: _.Activate },
            { dom: 'focus', tp: _.Focus },
            { dom: 'blur', tp: _.LostFocus },
            { dom: 'change', tp: _.Change },
            { dom: 'input', tp: _.TextChanged },
            { dom: 'select', tp: _.TextSelected },
            { dom: 'dragstart', tp: _.DragStart },
            { dom: 'drag', tp: _.Drag },
            { dom: 'dragend', tp: _.DragEnd },
            { dom: 'dragenter', tp: _.DragEnter },
            { dom: 'dragover', tp: _.DragOver },
            { dom: 'dragleave', tp: _.DragLeave },
            { dom: 'drop', tp: _.DragDrop },
            { dom: 'copy', tp: _.Copy },
            { dom: 'cut', tp: _.Cut },
            { dom: 'paste', tp: _.Paste },
        ];

        function DomIndex(EventName) {
            if (tp.IsString(EventName)) {
                for (var i = 0, ln = Map.length; i < ln; i++) {
                    if (tp.IsSameText(Map[i].dom, EventName))
                        return i;
                }
            }
            return -1;
        }
        function TripousIndex(EventName) {
            if (tp.IsString(EventName)) {
                for (var i = 0, ln = Map.length; i < ln; i++) {
                    if (tp.IsSameText(Map[i].tp, EventName))
                        return i;
                }
            }
            return -1;
        }

        _.ToDom = function (EventName) {
            var Index = TripousIndex(EventName);
            if (Index > -1) {
                return Map[Index].dom;
            }
            return _.Unknown;
        };
        _.ToTripous = function (EventName) {
            var Index = DomIndex(EventName);
            if (Index > -1) {
                return Map[Index].tp;
            }
            return _.Unknown;
        };

        return Class;
    })();
    //#endregion

    //#region Broadcaster
    tp.Broadcaster = (function () {
        /// Represents an object that sends event notifications to its subscribed listeners.
        /// A listener is an object with a function named  BroadcasterFunc(Args: tp.Args || {})
        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }
        var _ = Class;

        var listeners = [];

        _.Add = function (Listener) {
            if (!tp.ListContains(listeners, Listener))
                listeners.push(Listener);
        };
        _.Remove = function (Listener) {
            tp.ListRemove(listeners, Listener);
        };
        _.Send = function (EventName, Sender, Args) {
            if (typeof Sender === tp.Undefined) { Sender = null; }
            if (typeof Args === tp.Undefined) { Args = null; }

            Sender = Sender || _;            
            Args = (Args instanceof tp.EventArgs) ? Args : new tp.EventArgs(Args);          //Args = Args || new tp.Args();
            Args.Sender = Args.Sender || Sender;
            Args.EventName = EventName;
            Args.IsBroadcasterMessage = true;

            var Listener;
            for (var i = 0, ln = listeners.length; i < ln; i++) {
                Listener = listeners[i];
                Listener.BroadcasterFunc.call(Listener, Args);
            }
        };

        return Class;
    })();
    //#endregion

    //#region Debug
    tp.Debug = (function () {

        function Class(o) {
            _.Log(o);
        }
        var _ = Class;

        _.AsText = function (o) {
            var s = tp.IsEmpty(o) ? "..." : JSON.stringify(o, null, " ");
            return s;
        };
        _.Show = function (o) {
            if (!tp.IsEmpty(o)) {
                alert(_.AsText(o));
            }
        };
        _.Log = function (o) {
            if (!tp.IsEmpty(o)) {
                console.log(_.AsText(o));
            }
        };
        return Class;
    })();
    tp.Log = tp.Debug.Log;
    //#endregion

    //#region ErrorListener
    tp.ErrorListener = (function () {
        function Class(ListenerOrHandler, Handler) {
            /// <summary>
            /// Adds a listener to the window.onerror event.
            /// <para> If ListenerOrHandler is a function then Handler is not used. </para>
            /// <para> Otherwise ListenerOrHandler must be an object and Handler an event handler function. </para>
            /// </summary>      

            var L, H;
            if (arguments.length === 2) {
                L = ListenerOrHandler;
                H = Handler;
            } else {
                L = null;
                H = ListenerOrHandler;
            }

            Listeners.push({ listener: L, handler: H });
        }

        var _ = Class;
        var Listeners = [];

        /* fileds */
        _.DisplayErrors = true;
 
        _.Display = function (ev) {
            if (_.DisplayErrors) {
                var S = tp.ExceptionText(ev);
                tp.ErrorNote(S);
            }
        };
 
        _.CallListeners = function (ev) {
            var list = Listeners;

            var listener, handler;
            for (var i = 0, ln = list.length; i < ln; i++) {
                listener = list[i].listener;
                handler = list[i].handler;
                if (!tp.IsEmpty(listener)) {
                    handler.call(listener, ev);
                } else {
                    handler(ev);
                }
            }
        };

        window.addEventListener("error", function (ev) {
            try {
                _.CallListeners.call(_, ev);
                _.Display.call(_, ev);
            } catch (e) {
            }

            /*  
            
            var list = Listeners;

            var listener, handler;
            for (var i = 0, ln = list.length; i < ln; i++) {
                listener = list[i].listener;
                handler = list[i].handler;
                if (!tp.IsEmpty(listener)) {
                    handler.call(listener, ev);
                } else {
                    handler(ev);
                }
            }
            
            */
        }, false);

        return Class;
    })();
    //#endregion

    //#region ResizeDetector
    tp.ResizeDetector = (function () {
        // adapted from: http://stackoverflow.com/questions/6492683/how-to-detect-divs-dimension-changed
        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }

        var _ = Class;
        var Listeners = [];

        var Hook = function (Flag) {
            if (Hook) {
                // Listen to the window's size changes
                window.addEventListener('resize', OnResizeFunc);

                // Listen to changes on the elements in the page that affect layout              
                mo.observe(document.body, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });
            } else {
                window.removeEventListener('resize', OnResizeFunc);
                mo.takeRecords();
                mo.disconnect();
            }
        };
        var OnResizeFunc = function () {
            var Listener = null;
            var Func;
            var OldWidth, OldHeight;
            var i, ln, o;
            for (i = 0, ln = Listeners.length; i < ln; i++) {
                o = Listeners[i];

                if (o.Element.offsetWidth !== o.Width || o.Element.offsetHeight !== o.Height) {
                    OldWidth = o.Width;
                    OldHeight = o.Height;

                    o.Width = o.Element.offsetWidth;
                    o.Height = o.Element.offsetHeight;

                    o.Handler.call(o.Listener, { Element: o.Element, OldWidth: OldWidth, OldHeight: OldHeight });
                }
            }

        };
        var mo = new tp.MutationObserver(OnResizeFunc);

        window.addEventListener('unload', function () {
            if (Listeners.length > 0) {
                Hook(false);
            }
        });

        /* methods */
        _.On = function (Element, Listener, Handler) {
            /// <summary>Adds the Handler function as an event handler for the resize event of Element.
            /// <para>Listener is optional. It also can be ommited and pass the Handler param in place.</para>
            /// <para>When the Handler function is called, it is passed a single Args parameter.</para>
            /// <para>Example handler: function(Args) { }</para>
            /// <para>Other call variations: 1 - Element, Handler</para>
            /// <para>WARNING: Handler is always required.</para>
            ///</summary>
            /// <param name="Element" type="element">The element to watch for size changes</param>
            /// <param name="Listener" type="Object">The listener object. May be null or could be the Handler function.</param>
            /// <param name="Function" type="Handler">The event handler function.</param>

            if (tp.IsElement(Element) && (!tp.IsEmpty(Listener) || !tp.IsEmpty(Handler))) {

                var o = {
                    Element: Element,
                    Listener: null,
                    Handler: null,
                    Width: Element.offsetWidth,
                    Height: Element.offsetHeight,
                };

                if (tp.IsFunction(Listener)) {
                    o.Handler = Listener;
                } else {
                    o.Listener = Listener;
                    o.Handler = Handler;
                }

                Listeners.push(o);
            }

            if (Listeners.length === 1) {
                Hook(true);
            }
        };
        _.Off = function (Element, Listener, Handler) {
            /// <summary>
            /// Removes Listener from internal listeners list.
            /// <para> Listener's type depends on how On() is called. Could be either an object or a function. </para>
            /// </summary>
            /// <param name="Element" type="element">The element to watch for size changes</param>
            /// <param name="Listener" type="Object">The listener object. May be null or could be the Handler function.</param>
            /// <param name="Function" type="Handler">The event handler function.</param>

            var Index = -1;
            var o;
            for (var i = 0, ln = Listeners.length; i < ln; i++) {
                o = Listeners[i];
                if ((o.Element === Element) && (o.Listener === Listener) && (o.Handler === Handler)) {
                    Index = i;
                    break;
                }
            }

            if (Index !== -1) {
                Listeners.splice(Index, 1);
            }

            if (Listeners.length === 0) {
                Hook(false);
            }

        };

        return Class;
    })();
    //#endregion

    //#region SysConfig
    tp.SysConfig = {};
    tp.SysConfig.CompanyFieldName = 'CompanyId';
    tp.SysConfig.VariablesPrefix = ':@';
    //#endregion


    //#region Color
    tp.Color = (function () {

        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }
        var _ = Class;

        _.ToOptionList = function () {
            /// <summary>
            /// Returns tp.Color list as an array of objects of the form { Text: ColorName, Value: ColorValue }
            /// for use with ComboBoxes and ListBoxes
            /// </summary>
            var A = [];

            for (var Prop in tp.Color) {
                if (typeof tp.Color[Prop] !== 'function')
                    A.push({ Text: Prop, Value: tp.Color[Prop] });
            }

            return A;
        };
        _.Shade = function (Color, Percent) {
            /// <summary>
            /// Shades Color by Percent and returns the new color.
            /// </summary>
            /// <para> taken from: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors </para>
            /// <param name="Color" type="Color">A color in hex with a leading #</param>
            /// <param name="Percent" type="integer">Number from -100 to 100. Negative numbers darken the color. </param>
            var num = parseInt(Color.slice(1), 16);
            var amt = Math.round(2.55 * Percent);
            var R = (num >> 16) + amt;
            var G = (num >> 8 & 0x00FF) + amt;
            var B = (num & 0x0000FF) + amt;
            return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
        };
        _.Shade2 = function (Color, Percent) {
            /// <summary>
            /// Shades Color by Percent and returns the new color.
            /// </summary>
            /// <para> taken from: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors </para>
            /// <param name="Color" type="Color">A color in hex with a leading #</param>
            /// <param name="Percent" type="integer">Number from -100 to 100. Negative numbers darken the color. </param>
            Percent = Percent / 100;
            var f = parseInt(Color.slice(1), 16);
            var t = Percent < 0 ? 0 : 255;
            var p = Percent < 0 ? Percent * -1 : Percent;
            var R = f >> 16;
            var G = f >> 8 & 0x00FF;
            var B = f & 0x0000FF;
            return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
        };
        _.SetGradientStyle = function (Color, Handle) {
            var Colors = [];
            Colors.push(Color);

            var A = [];
            A.push(Color + ' 0%');

            var Stops = [];
            Stops = [22, 35, 42, 52];
            var C;
            var factor;
            var S;
            for (var i = 0; i < Stops.length; i++) {
                factor = (i + 1) * 3;

                C = _.Shade(Color, -factor);
                Colors.push(C);

                S = C + ' ' + Stops[i] + '%';
                A.push(S);
            }

            if (tp.Environment.IE && (tp.Environment.Version < 10)) {
                //filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0A284B', endColorstr='#135887');
                S = "progid:DXImageTransform.Microsoft.gradient(startColorstr='{0}', endColorstr='{1}')";

                //S = tp.Format(S, Colors[0], Colors[Colors.length - 1]);
                S = tp.Format(S, Colors[0], Colors[Colors.length - 1]);
            } else {
                S = A.join(', ');

                //background: #d8e0de; /* Old browsers */
                //background: -moz-linear-gradient(top,  #d8e0de 0%, #aebfbc 22%, #99afab 33%, #8ea6a2 50%, #829d98 67%, #4e5c5a 82%, #0e0e0e 100%); /* FF3.6+ */
                //background: -webkit-linear-gradient(top,  #d8e0de 0%,#aebfbc 22%,#99afab 33%,#8ea6a2 50%,#829d98 67%,#4e5c5a 82%,#0e0e0e 100%); /* Chrome10+,Safari5.1+ */
                //background: -o-linear-gradient(top,  #d8e0de 0%,#aebfbc 22%,#99afab 33%,#8ea6a2 50%,#829d98 67%,#4e5c5a 82%,#0e0e0e 100%); /* Opera 11.10+ */
                //background: -ms-linear-gradient(top,  #d8e0de 0%,#aebfbc 22%,#99afab 33%,#8ea6a2 50%,#829d98 67%,#4e5c5a 82%,#0e0e0e 100%); /* IE10+ */
                //background: linear-gradient(to bottom,  #d8e0de 0%,#aebfbc 22%,#99afab 33%,#8ea6a2 50%,#829d98 67%,#4e5c5a 82%,#0e0e0e 100%); /* W3C */
                var prefix = 'linear-gradient(to bottom,  ';
                if (tp.Environment.Firefox)
                    prefix = '-moz-linear-gradient(top,  ';
                else if (tp.Environment.WebKit)
                    prefix = '-webkit-linear-gradient(top,  ';
                else if (tp.Environment.Opera)
                    prefix = '-o-linear-gradient(top,  ';
                else if (tp.Environment.IE && (tp.Environment.Version < 11))
                    prefix = '-ms-linear-gradient(top,  ';

                S = prefix + S + ')';
            }

            if (Handle) {
                var PropName = (tp.Environment.IE && (tp.Environment.Version < 10)) ? 'filter' : 'background-image';
                Handle.style.setProperty(PropName, S);
            }

            return S;
        };
        _.AliceBlue = "#F0F8FF";
        _.AntiqueWhite = "#FAEBD7";
        _.Aqua = "#00FFFF";
        _.Aquamarine = "#7FFFD4";
        _.Azure = "#F0FFFF";
        _.Beige = "#F5F5DC";
        _.Bisque = "#FFE4C4";
        _.Black = "#000000";
        _.BlanchedAlmond = "#FFEBCD";
        _.Blue = "#0000FF";
        _.BlueViolet = "#8A2BE2";
        _.Brown = "#A52A2A";
        _.BurlyWood = "#DEB887";
        _.CadetBlue = "#5F9EA0";
        _.Chartreuse = "#7FFF00";
        _.Chocolate = "#D2691E";
        _.Coral = "#FF7F50";
        _.CornflowerBlue = "#6495ED";
        _.Cornsilk = "#FFF8DC";
        _.Crimson = "#DC143C";
        _.Cyan = "#00FFFF";
        _.DarkBlue = "#00008B";
        _.DarkCyan = "#008B8B";
        _.DarkGoldenRod = "#B8860B";
        _.DarkGray = "#A9A9A9";
        _.DarkGreen = "#006400";
        _.DarkKhaki = "#BDB76B";
        _.DarkMagenta = "#8B008B";
        _.DarkOliveGreen = "#556B2F";
        _.DarkOrange = "#FF8C00";
        _.DarkOrchid = "#9932CC";
        _.DarkRed = "#8B0000";
        _.DarkSalmon = "#E9967A";
        _.DarkSeaGreen = "#8FBC8F";
        _.DarkSlateBlue = "#483D8B";
        _.DarkSlateGray = "#2F4F4F";
        _.DarkTurquoise = "#00CED1";
        _.DarkViolet = "#9400D3";
        _.DeepPink = "#FF1493";
        _.DeepSkyBlue = "#00BFFF";
        _.DimGray = "#696969";
        _.DodgerBlue = "#1E90FF";
        _.FireBrick = "#B22222";
        _.FloralWhite = "#FFFAF0";
        _.ForestGreen = "#228B22";
        _.Fuchsia = "#FF00FF";
        _.Gainsboro = "#DCDCDC";
        _.GhostWhite = "#F8F8FF";
        _.Gold = "#FFD700";
        _.GoldenRod = "#DAA520";
        _.Gray = "#808080";
        _.Green = "#008000";
        _.GreenYellow = "#ADFF2F";
        _.HoneyDew = "#F0FFF0";
        _.HotPink = "#FF69B4";
        _.IndianRed = "#CD5C5C";
        _.Indigo = "#4B0082";
        _.Ivory = "#FFFFF0";
        _.Khaki = "#F0E68C";
        _.Lavender = "#E6E6FA";
        _.LavenderBlush = "#FFF0F5";
        _.LawnGreen = "#7CFC00";
        _.LemonChiffon = "#FFFACD";
        _.LightBlue = "#ADD8E6";
        _.LightCoral = "#F08080";
        _.LightCyan = "#E0FFFF";
        _.LightGoldenRodYellow = "#FAFAD2";
        _.LightGray = "#D3D3D3";
        _.LightGreen = "#90EE90";
        _.LightPink = "#FFB6C1";
        _.LightSalmon = "#FFA07A";
        _.LightSeaGreen = "#20B2AA";
        _.LightSkyBlue = "#87CEFA";
        _.LightSlateGray = "#778899";
        _.LightSteelBlue = "#B0C4DE";
        _.LightYellow = "#FFFFE0";
        _.Lime = "#00FF00";
        _.LimeGreen = "#32CD32";
        _.Linen = "#FAF0E6";
        _.Magenta = "#FF00FF";
        _.Maroon = "#800000";
        _.MediumAquaMarine = "#66CDAA";
        _.MediumBlue = "#0000CD";
        _.MediumOrchid = "#BA55D3";
        _.MediumPurple = "#9370DB";
        _.MediumSeaGreen = "#3CB371";
        _.MediumSlateBlue = "#7B68EE";
        _.MediumSpringGreen = "#00FA9A";
        _.MediumTurquoise = "#48D1CC";
        _.MediumVioletRed = "#C71585";
        _.MidnightBlue = "#191970";
        _.MintCream = "#F5FFFA";
        _.MistyRose = "#FFE4E1";
        _.Moccasin = "#FFE4B5";
        _.NavajoWhite = "#FFDEAD";
        _.Navy = "#000080";
        _.OldLace = "#FDF5E6";
        _.Olive = "#808000";
        _.OliveDrab = "#6B8E23";
        _.Orange = "#FFA500";
        _.OrangeRed = "#FF4500";
        _.Orchid = "#DA70D6";
        _.PaleGoldenRod = "#EEE8AA";
        _.PaleGreen = "#98FB98";
        _.PaleTurquoise = "#AFEEEE";
        _.PaleVioletRed = "#DB7093";
        _.PapayaWhip = "#FFEFD5";
        _.PeachPuff = "#FFDAB9";
        _.Peru = "#CD853F";
        _.Pink = "#FFC0CB";
        _.Plum = "#DDA0DD";
        _.PowderBlue = "#B0E0E6";
        _.Purple = "#800080";
        _.Red = "#FF0000";
        _.RosyBrown = "#BC8F8F";
        _.RoyalBlue = "#4169E1";
        _.SaddleBrown = "#8B4513";
        _.Salmon = "#FA8072";
        _.SandyBrown = "#F4A460";
        _.SeaGreen = "#2E8B57";
        _.SeaShell = "#FFF5EE";
        _.Sienna = "#A0522D";
        _.Silver = "#C0C0C0";
        _.SkyBlue = "#87CEEB";
        _.SlateBlue = "#6A5ACD";
        _.SlateGray = "#708090";
        _.Snow = "#FFFAFA";
        _.SpringGreen = "#00FF7F";
        _.SteelBlue = "#4682B4";
        _.Tan = "#D2B48C";
        _.Teal = "#008080";
        _.Thistle = "#D8BFD8";
        _.Tomato = "#FF6347";
        _.Turquoise = "#40E0D0";
        _.Violet = "#EE82EE";
        _.Wheat = "#F5DEB3";
        _.White = "#FFFFFF";
        _.WhiteSmoke = "#F5F5F5";
        _.Yellow = "#FFFF00";
        _.YellowGreen = "#9ACD32";

        return Class;
    })(); 
    //#endregion

    //#region Keys
    tp.Keys = {
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        Ctrl: 17,
        Shift: 16,
        Alt: 18,
        Enter: 13,
        Home: 36,
        End: 35,
        Left: 37,
        Right: 39,
        Up: 38,
        Down: 40,
        PageUp: 33,
        PageDown: 34,
        Escape: 27,
        Space: 32,
        Tab: 9,
        Backspace: 8,
        Delete: 46,
        Insert: 45,
        ContextMenu: 93,
        Windows: 91,
        Decimal: 110
    };

    tp.IsPrintableKey = function (e) {
        /// <summary>Returns true if the specified KeyboardEvent represents a printable character.</summary>
        /// <param name="e" type="KeyboardEvent">The KeyboardEvent event</param>

        // If the key doesn't have a printable representation, e.char is an empty string.
        // see: https://developer.mozilla.org/en-US/docs/Web/Events/keypress
        if (('char' in e) && tp.IsBlank(e.char))
            return false;

        // from: http://stackoverflow.com/questions/12467240/determine-if-javascript-e-keycode-is-a-printable-non-control-character
        var code = e.type === 'keypress' ? e.charCode : e.keyCode;

        var Result =    (code > 47 && code < 58)          // number keys
                     || (code == 32)                      // spacebar 
                     || (code > 64 && code < 91)          // letter keys
                     || (code > 95 && code < 112)         // numpad keys
                     || (code > 185 && code < 193)        // ;=,-./` (in order)
                     || (code > 218 && code < 223);       // [\]' (in order)

        return Result;

    };
    //#endregion

    //#region ModalResult DialogResult
    tp.ModalResult = {
        None: 0,
        OK: 1,
        Cancel: 2,
        Abort: 3,
        Retry: 4,
        Ignore: 5,
        Yes: 6,
        No: 7,
    };
    tp.DialogResult = tp.ModalResult;
    //#endregion

    //#region Anchor
    tp.Anchor = {
        None: 0,
        Top: 1,
        Bottom: 2,
        Left: 3,
        Right: 4,
    };
    //#endregion

    //#region Dock
    tp.Dock = {
        None: 0,
        Top: 1,
        Bottom: 2,
        Left: 3,
        Right: 4,
        Fill: 5,
    };
    //#endregion

    //#region HeightMode   
    tp.HeightMode = {
        Defined: 1,
        Computed: 2,
    };
    //#endregion

    //#region ScrollBars     
    tp.ScrollBars = {
        None: 0,
        Auto: 1,
        Horizontal: 2,
        Vertical: 3,
        Both: 4,
    };
    //#endregion

    //#region Cursor
    tp.Cursor = {            // http://www.javascripter.net/faq/stylesc.htm
        Default: "default",
        Pointer: "pointer",

        Text: "text",
        VerticalText: "vertical-text",
        Help: "help",
        Move: "move",

        Wait: "wait",
        Progress: "progress",

        CrossHair: "crosshair",

        ResizeN: "n-resize",
        ResizeE: "e-resize",
        ResizeW: "w-resize",
        ResizeS: "s-resize",

        ResizeNE: "ne-resize",
        ResizeNW: "nw-resize",
        ResizeSE: "se-resize",
        ResizeSW: "sw-resize",

        ResizeCol: "col-resize",
        ResizeRow: "row-resize",

        AllScroll: "all-scroll",
        NotAllowed: "not-allowed",
        NoDrop: "no-drop",

        Auto: "auto", // let the browser choose the cursor
        Inherit: "inherit",
    };
    //#endregion
 
    //#region Position
    tp.Position = {
        Static: "static",
        Relative: "relative",
        Absolute: "absolute",
        Fixed: "fixed",
        Inherit: "inherit",
    };
    //#endregion
 
    //#region Enums
    tp.Enums = {
        CriterionMode: {
            Simple: 1,
            EnumQuery: 2,
            EnumConst: 3,
            Locator: 8
        },
        FormFlags: {
            None: 0,
            System: 1,
            Secure: 2,
            SingleInstance: 4,
            Designable: 8,
            DesignableBrowser: 16,
            DesignableSelects: 32
        },
        ButtonDisplayStyle: {
            Text: 1,
            Image: 2,
            ImageAndText: 3
        },
        ComparisonOperator: {
            Greater: 0,
            GreaterOrEqual: 1,
            Equal: 2,
            Less: 3,
            LessOrEqual: 4
        },
        FieldFlags: {
            None: 0,
            Visible: 1,
            ReadOnly: 2,
            ReadOnlyUI: 4,
            ReadOnlyEdit: 8,
            Required: 16,
            Boolean: 32,
            Memo: 64,
            Image: 128,
            ImagePath: 256,
            Searchable: 512,
            ExtraField: 1024,
            LookUpField: 2048,
            NoInsertUpdate: 4096,
            Localizable: 8192
        },
        AggregateFunctionType: {
            None: 0,
            Count: 1,
            Avg: 2,
            Sum: 4,
            Max: 8,
            Min: 16
        },
        CommandKind: {
            Container: 0,
            Separator: 1,
            Procedure: 2,
            Browser: 4,
            Edit: 8,
            BrowserEdit: 16,
            LookUpList: 32,
            EnumList: 64
        },
        DataMode: {
            None: 0,
            Browse: 1,
            Insert: 2,
            Edit: 4,
            Delete: 8,
            Commit: 16,
            Cancel: 32,
            Criteria: 64,
            Reports: 128,
            Menu: 256,
            Backup: 512,
            Lines: 1024,
            LineItem: 2048
        },
        DatePattern: {
            MDY: 0,
            DMY: 1,
            YMD: 2
        },
        DateRange: {
            Custom: 0,
            Today: 1,
            Yesterday: 2,
            Tomorrow: 3,
            PreviousWeek: 4,
            PreviousTwoWeeks: 5,
            PreviousMonth: 6,
            PreviousTwoMonths: 7,
            PreviousThreeMonths: 8,
            PreviousSemester: 9,
            PreviousYear: 10,
            PreviousTwoYears: 11,
            NextWeek: 12,
            NextTwoWeeks: 13,
            NextMonth: 14,
            NextTwoMonths: 15,
            NextThreeMonths: 16,
            NextSemester: 17,
            NextYear: 18,
            NextTwoYears: 19
        },
        DateTimeFormatType: {
            Date: 0,
            LongDate: 1,
            Time: 2,
            LongTime: 3,
            DateTime: 4,
            DateLongTime: 5,
            Time24: 6,
            LongTime24: 7,
            DateTime24: 8,
            DateLongTime24: 9,
            IsoDate: 10,
            IsoDateTime: 11,
            IsoDateLongTime: 12,
            Custom: 13
        },
        Duplicates: {
            Accept: 0,
            Ignore: 1,
            Error: 2
        },
        MidwareType: {
            Direct: 0,
            OleDb: 1,
            Odbc: 2
        },
        ServerType: {
            Unknown: 0,
            Firebird: 1,
            MsSql: 2,
            Access: 3,
            Excel: 4,
            Dbf: 5,
            Sqlite: 6,
            Oracle: 7
        },
        SimpleType: {
            None: 0,
            String: 1,
            Integer: 2,
            Boolean: 4,
            Float: 8,
            Currency: 16,
            Date: 32,
            Time: 64,
            DateTime: 128,
            Object: 256,
            Enum: 512,
            Memo: 1024,
            Graphic: 2048,
            Blob: 4096,
            Interface: 8192,
            WideString: 16384
        },
        StdCmd: {
            None: 0,
            Browse: 1,
            Insert: 2,
            Edit: 4,
            Delete: 8,
            Commit: 16,
            Cancel: 32,
            Criteria: 64,
            Reports: 128,
            Menu: 256,
            FormSelectViews: 512,
            First: 4096,
            Prior: 8192,
            Next: 16384,
            Last: 32768,
            FormClose: 65536,
            FormOK: 131072,
            FormCancel: 262144
        },
        PlatformType: {
            None: 0,
            Bit32: 1,
            Bit64: 2,
            Windows: 4,
            Unix: 8,
            Xbox: 16,
            MacOSX: 32,
            Desktop: 64,
            Web: 128,
            Compact: 256,
            PocketPC: 512,
            Smartphone: 1024,
            WinCEGeneric: 2048,
            Phone: 4096,
            Emulator: 8192,
            TouchScreen: 16384
        },
        TargetMode: {
            Source: 0,
            Destination: 1
        },
        TriState: {
            False: 0,
            True: 1,
            Default: 2
        },
        UserLevel: {
            God: 1,
            Service: 2,
            Supervisor: 4,
            User: 8,
            Guest: 16
        },
        WhereOperator: {
            And: 0,
            Not: 1,
            Or: 2
        },
        UiMode: {
            None: 0,
            Desktop: 1,
            Web: 2
        }
    };
    //#endregion
 
    //#region Mouse
    tp.Mouse = (function () {
        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }

        var _ = Class;

        /* constants - for the mouse buttons */
        tp.Constant('NONE', _, 0);
        tp.Constant('LEFT', _, 1);
        tp.Constant('RIGHT', _, 2);
        tp.Constant('MID', _, 4);

        /* properties */
        tp.Property('Cursor', _, function () {
            // the mouse cursor
            return document.body.style.cursor;
        }, function (v) {
            document.body.style.cursor = v;
        });

        /* methods */
        _.IsLeft = function (e) {
            /// <summary>Returns true if the Left mouse button is currently pressed.</summary>
            return _.LEFT === _.Button(e);
        };
        _.IsMid = function (e) {
            /// <summary>Returns true if the Middle (wheel) mouse button is currently pressed.</summary>
            return _.MID === _.Button(e);
        };
        _.IsRight = function (e) {
            /// <summary>Returns true if the Right mouse button is currently pressed.</summary>
            return _.RIGHT === _.Button(e);
        };

        _.Button = function (e) {
            /// <summary>Returns the mouse button that is currently pressed, using the defined button constants of this class.</summary>
            if ('which' in e) {
                switch (e.which) {
                    case 1: return _.LEFT;
                    case 2: return _.MID;
                    case 3: return _.RIGHT;
                }
            } else if ('button' in e) {
                switch (e.button) {
                    case 0: return _.LEFT;
                    case 1: return _.MID;
                    case 2: return _.RIGHT;
                }
            }

            return _.NONE;
        };
        _.Buttons = function (e) {
            /// <summary>Returns a bit-field with the mouse buttons currently pressed.</summary>
            return ('buttons' in e) ? e.buttons : _.NONE;
        };

        _.ToPage = function (e) {
            /// <summary> Returns a tp.Point with mouse position relative to the Top/Left of the fully rendered page </summary>
            /// <param name="e" type="Mouse event">The event object</param>

            e = e || window.event;
            var doc = e.target.ownerDocument;

            var X = e.pageX;
            var Y = e.pageY;

            if (X === tp.Undefined) {
                X = e.clientX + doc.documentElement.scrollLeft + doc.body.scrollLeft;
                Y = e.clientY + doc.documentElement.scrollTop + doc.body.scrollTop;
            }

            return new tp.Point(Math.round(X), Math.round(Y));
        };
        _.Offset = _.ToPage;
        _.ToWindow = function (e) {
            /// <summary> Returns a tp.Point with mouse position relative to the Top/Left of the browser window (viewport) </summary>
            /// <param name="e" type="Mouse event">The event object</param>

            var X = Math.round(e.clientX);
            var Y = Math.round(e.clientY);
            return new tp.Point(X, Y);
        };
        _.ToElement = function (e, el) {
            /// <summary> Returns a tp.Point with mouse position relative to the Top/Left of an element (sender of the event) </summary>
            /// <param name="e" type="MouseEvent">The event object</param>
            /// <param name="el" type="Element">Optional. If not passed then the target (sender) of the event is used.</param>
            /// <returns type="tp.Point">The mouse position on the element</returns>

            el = el || e.target || e.srcElement;
            var R = el.getBoundingClientRect();
            var X = tp.Truncate(e.clientX - R.left);
            var Y = tp.Truncate(e.clientY - R.top);

            return new tp.Point(X, Y);
        };
        _.IsInElement = function (e, el) {
            /// <summary> Returns true if the mouse pointer is inside an element </summary>
            var P = _.ToElement(e, el);
            var R = tp.BoundingRect(el);
            R.X = 0;
            R.Y = 0;
            return R.Contains(P);
        };
        _.ElementUnderMouse = function (e) {
            /// <summary> Returns the topmost element at the specified position relative to the Top/Left of the browser window (viewport). </summary>
            /// <param name="e" type="Mouse event">The event object</param>
            return _.ElementAt(e.clientX, e.clientY);
        };
        _.ElementAt = function (X, Y) {
            /// <summary> Returns the topmost element at the specified position relative to the Top/Left of the browser window (viewport). </summary>
            /// <param name="X" type="Integer">The X coordinate relative to the Top/Left of the browser window (viewport)</param>
            /// <param name="Y" type="Integer">The Y coordinate relative to the Top/Left of the browser window (viewport)</param>
            var Result = null;
            if (document.elementFromPoint) {
                Result = document.elementFromPoint(X, Y);
                if (Result && Result.tagName === tp.Undefined) {               // in case of text nodes (Opera)
                    Result = Result.parentNode;
                }
            }
            return Result;
        };

        return Class;
    })();
    //#endregion    

    //#region TextMetrics
    tp.TextMetrics = (function () {
        function Class(Text, SourceElement) {
            /// <summary>
            /// Measures the specified Text and returns an object with two integers { Height: xx, Width: xx } 
            /// with text metrics in pixels.
            /// <para> SourceElement is a dom element node that provides css font properties affecting the size
            /// of the rendered text </para>
            /// </summary>
            var el = _.CreateRulerElement(SourceElement);
            var Result = _.SizeOf(Text, el);
            el.parentNode.removeChild(el);
            return Result;
        }

        var _ = Class;

        /* methods */
        _.CreateRulerElement = function (SourceElement) {
            /// <summary>Creates and returns a hidden copy of a source element to be used in measuring text.</summary>
            /// <param name="SourceElement" type="Element">The element to be used as source.
            /// <para> Provides css font properties affecting the size of the rendered text </para>
            ///</param>
            /// <returns type="Element">A copy of a source element to be used in measuring text.</returns>
            var div = tp.Document.createElement('div');

            div.style.position = 'absolute';
            div.style.visibility = 'hidden';
            div.style.height = 'auto';
            div.style.width = 'auto';

            tp.Document.body.appendChild(div);

            var Style = tp.ComputedStyle(SourceElement);

            if (SourceElement !== tp.Document.body) {

                div.style.marginTop = Style.marginTop;
                div.style.marginRight = Style.marginRight;
                div.style.marginBottom = Style.marginBottom;
                div.style.marginLeft = Style.marginLeft;

                div.style.borderTop = Style.borderTop;
                div.style.borderRight = Style.borderRight;
                div.style.borderBottom = Style.borderBottom;
                div.style.borderLeft = Style.borderLeft;

                div.style.paddingTop = Style.paddingTop;
                div.style.paddingRight = Style.paddingRight;
                div.style.paddingBottom = Style.paddingBottom;
                div.style.paddingLeft = Style.paddingLeft;
            }


            var v;
            var FontProps = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
            for (var i = 0, ln = FontProps.length; i < ln; i++) {
                v = Style.getPropertyValue(FontProps[i]);
                div.style.setProperty(FontProps[i], v);
            }


            return div;
        };
        _.SizeOf = function (Text, el) {
            /// <summary>Measures text in an element. Returns a { Width: xxx, Height: xxx } object.</summary>
            /// <param name="Text" type="String">The text to measure.</param>
            /// <param name="el" type="Element">The element where the text is going to be displayed.</param>
            /// <returns type="Object">A  { Width: xxx, Height: xxx }  object</returns>
            el.innerHTML = Text;

            var Result = {
                Width: el.offsetWidth,
                Height: el.offsetHeight,
            };

            return Result;

        };
        _.WidthOf = function (Text, el) {
            el.innerHTML = Text;
            return el.offsetWidth;
        };
        _.HeightOf = function (Text, el) {
            el.innerHTML = Text;
            return el.offsetHeight;
        };

        return Class;
    })();
    //#endregion

    //#region Point
    tp.Point = (function (BaseClass) {
        function Class(X, Y) {
            // A Point class.
            // NOTE: Attach an Onwer property and a ChangeEventHandler function property,
            // for getting notifications about changes in this instance.
            BaseClass.call(this);
            if (typeof X === tp.Undefined) { X = 0; }
            if (typeof Y === tp.Undefined) { Y = 0; }
            /* class id - read-only*/
            this.tpClass = "tp.Point";
            /* for getting notifications about changes in this instance  */
            this.Owner = null;
            this.ChangeEventHandler = null;
            this.x = X;
            this.y = Y;
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        /* properties */
        Object.defineProperty(_, "X", {
            get: function () {
                return this.x;
            },
            set: function (v) {
                this.Set(v || this.x, this.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_, "Y", {
            get: function () {
                return this.y;
            },
            set: function (v) {
                this.Set(this.x, v || this.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_, "IsEmpty", {
            get: function () {
                return this.Equals(0, 0);
            },
            enumerable: true,
            configurable: true
        });

        /* methods */
        _.Notify = function () {
            // owner notification about a change
            if (this.Owner && this.ChangeEventHandler) {
                this.ChangeEventHandler.call(this.Owner, this);
            }
        };
        _.Clear = function () {
            this.Set(0, 0);
        };
        _.Set = function (X, Y) {
            // The specified arguments become the value of this instance.
            X = tp.Truncate(X);
            Y = tp.Truncate(Y);

            var Flag = (this.x !== X) || (this.y !== Y);
            if (Flag) {
                this.x = X;
                this.y = Y;

                this.Notify();
            }
        };
        _.Add = function (X, Y) {
            // Adds passed arguments to this instance
            this.x += tp.Truncate(X);
            this.y += tp.Truncate(Y);

            this.Notify();
        };
        _.Subtract = function (X, Y) {
            // Subtracts passed arguments to this instance
            this.x -= tp.Truncate(X);
            this.y -= tp.Truncate(Y);

            this.Notify();
        };
        _.ApplyTo = function (el, TriggerResizeEvent) {
            // Sets its values to element's position
            if (typeof TriggerResizeEvent === tp.Undefined) { TriggerResizeEvent = false; }
            el.style.left = tp.px(this.x);
            el.style.top = tp.px(this.y);

            if (TriggerResizeEvent) {
                var ev = tp.CreateCustomEvent("resize");
                el.dispatchEvent(ev);
            }
        };
        _.Equals = function (Params) {
            if (Params instanceof tp.Point) {
                var P = Params;
                return (this.x === P.X) && (this.y === P.Y);
            }

            var X = tp.Truncate(arguments[0]);
            var Y = tp.Truncate(arguments[1]);

            return (this.x === X) && (this.y === Y);
        };
        _.IsInBetween = function (X1, Y1, X2, Y2) {
            // True if the passed arguments represent two points
            // and the point this instance represents
            // is greater from the first passed point and is lesser from the second passed point.  

            var less = (this.x >= X1) && (this.y >= Y1);
            var greater = (this.x <= X2) && (this.y <= Y2);
            return less && greater;
        };
        _.toString = function () {
            return tp.Format("x={0}, y={1}", this.x, this.y);
        };

        return Class;
    })(Object);
    //#endregion

    //#region Size
    tp.Size = (function (BaseClass) {
        function Class(Width, Height) {
            // A Size class.
            // NOTE: Attach an Onwer property and a ChangeEventHandler function property,
            // for getting notifications about changes in this instance. 
            BaseClass.call(this);
            if (typeof Width === tp.Undefined) { Width = 0; }
            if (typeof Height === tp.Undefined) { Height = 0; }
            /* class id - read-only*/
            this.tpClass = "tp.Size";
            /* for getting notifications about changes in this instance  */
            this.Owner = null;
            this.ChangeEventHandler = null;
            this.w = Width;
            this.h = Height;
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        /* properties */
        Object.defineProperty(_, "Width", {
            get: function () {
                return this.w;
            },
            set: function (v) {
                this.Set(v || this.w, this.h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_, "Height", {
            get: function () {
                return this.h;
            },
            set: function (v) {
                this.Set(this.w, v || this.h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_, "IsEmpty", {
            get: function () {
                return this.Equals(0, 0);
            },
            enumerable: true,
            configurable: true
        });

        /* methods */
        _.Notify = function () {
            // owner notification about a change
            if (this.Owner && this.ChangeEventHandler) {
                this.ChangeEventHandler.call(this.Owner, this);
            }
        };
        _.Clear = function () {
            this.Set(0, 0);
        };
        _.Set = function (Width, Height) {
            // The specified arguments become the value of this instance.
            Width = tp.Truncate(Width);
            Height = tp.Truncate(Height);
            var Flag = (this.w !== Width) || (this.h !== Height);
            if (Flag) {
                this.w = Width;
                this.h = Height;

                this.Notify();
            }
        };
        _.Add = function (Width, Height) {
            // Adds passed arguments to this instance
            this.w += tp.Truncate(Width);
            this.h += tp.Truncate(Height);

            this.Notify();
        };
        _.Subtract = function (Width, Height) {
            // Subtracts passed arguments to this instance
            this.w -= tp.Truncate(Width);
            this.h -= tp.Truncate(Height);

            this.Notify();
        };
        _.ApplyTo = function (el, TriggerResizeEvent) {
            // Sets its values to element's size
            if (typeof TriggerResizeEvent === tp.Undefined) { TriggerResizeEvent = false; }
            el.style.height = tp.px(this.h);
            el.style.width = tp.px(this.w);

            if (TriggerResizeEvent) {
                var ev = tp.CreateCustomEvent("resize");
                el.dispatchEvent(ev);
            }
        };
        _.Equals = function (Params) {
            if (Params instanceof tp.Size) {
                var S = Params;
                return (this.w === S.Width) && (this.h === S.Height);
            }

            var Width = tp.Truncate(arguments[0]);
            var Height = tp.Truncate(arguments[1]);
            return (this.w === Width) && (this.h === Height);
        };
        _.toString = function () {
            return tp.Format("w={0}, h={1}", this.w, this.h);
        };

        return Class;
    })(Object);
    //#endregion

    //#region Rectangle
    tp.Rectangle = (function (BaseClass) {

        function Class(X, Y, Width, Height) {
            // A Rectangle class.
            // NOTE: Attach an Onwer property and a ChangeEventHandler function property,
            // for getting notifications about changes in this instance./

            if (typeof X === tp.Undefined) { X = 0; }
            if (typeof Y === tp.Undefined) { Y = 0; }
            if (typeof Width === tp.Undefined) { Width = 0; }
            if (typeof Height === tp.Undefined) { Height = 0; }
            BaseClass.call(this);
            /* class id - read-only*/
            this.tpClass = "tp.Rectangle";
            /* for getting notifications about changes in this instance  */
            this.Owner = null;
            this.ChangeEventHandler = null;
            this.x = X;
            this.y = Y;
            this.w = Width;
            this.h = Height;
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        /* properties */
        Object.defineProperty(_, "X", {
            get: function () {
                return this.x;
            },
            set: function (v) {
                this.Set(v || this.x, this.y, this.w, this.h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_, "Y", {
            get: function () {
                return this.y;
            },
            set: function (v) {
                this.Set(this.x, v || this.y, this.w, this.h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_, "Width", {
            get: function () {
                return this.w;
            },
            set: function (v) {
                this.Set(this.x, this.y, v || this.w, this.h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_, "Height", {
            get: function () {
                return this.h;
            },
            set: function (v) {
                this.Set(this.x, this.y, this.w, v || this.h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_, "Right", {
            get: function () {
                return this.x + this.w;
            },
            set: function (v) {
                v = tp.Truncate(v || 0);
                var w = (v - this.x);
                this.Set(this.x, this.y, w, this.h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_, "Bottom", {
            get: function () {
                return this.y + this.h;
            },
            set: function (v) {
                v = tp.Truncate(v || 0);
                var h = (v - this.y);
                this.Set(this.x, this.y, this.w, h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_, "Left", {
            get: function () {
                return this.X;
            },
            set: function (v) {
                this.X = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_, "Top", {
            get: function () {
                return this.Y;
            },
            set: function (v) {
                this.Y = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_, "IsEmpty", {
            get: function () {
                return (this.x + this.y + this.w + this.h) === 0;
            },
            enumerable: true,
            configurable: true
        });

        /* methods */
        _.Notify = function () {
            // owner notification about a change
            if (this.Owner && this.ChangeEventHandler) {
                this.ChangeEventHandler.call(this.Owner, this);
            }
        };
        _.Clear = function () {
            this.Set(0, 0, 0, 0);
        };
        _.Set = function (Params) {
            var X, Y, Width, Height;

            if (Params instanceof tp.Rectangle) {
                var R = Params;
                X = R.X;
                Y = R.Y;
                Width = R.Width;
                Height = R.Height;
            } else {
                X = tp.Truncate(arguments[0]);
                Y = tp.Truncate(arguments[1]);
                Width = tp.Truncate(arguments[2]);
                Height = tp.Truncate(arguments[3]);
            }

            var Flag = (this.x !== X) || (this.y !== Y) || (this.w !== Width) || (this.h !== Height);

            if (Flag) {
                this.x = X;
                this.y = Y;
                this.w = Width;
                this.h = Height;

                this.Notify();
            }
        };
        _.Add = function (Params) {
            if (Params instanceof tp.Rectangle) {
                var R = Params;
                this.Set(this.x + R.X, this.y + R.Y, this.w + R.Width, this.h + R.Height);
            } else {
                this.Set(this.x + tp.Truncate(arguments[0]), this.y + tp.Truncate(arguments[1]), this.w + tp.Truncate(arguments[2]), this.h + tp.Truncate(arguments[3]));
            }
        };
        _.Contains = function (Params) {
            var X, Y;
            if (Params instanceof tp.Rectangle) {
                var R = Params;
                var Width, Height;
                X = R.X;
                Y = R.Y;
                Width = R.Width;
                Height = R.Height;

                return this.x <= X && this.y <= Y && this.w <= Width && this.h <= Height;
            } else {
                if (Params instanceof tp.Point) {
                    var P = Params;
                    X = P.X;
                    Y = P.Y;
                } else {
                    X = tp.Truncate(arguments[0]);
                    Y = tp.Truncate(arguments[1]);
                }

                return X >= this.x &&
                          X <= this.x + this.w &&
                          Y >= this.y &&
                          Y <= this.y + this.h;
            }
        };
        _.Inflate = function (Params) {
            var Width, Height;
            if (Params instanceof tp.Size) {
                var S = Params;
                Width = S.Width;
                Height = S.Height;
            } else {
                Width = tp.Truncate(arguments[0]);
                Height = tp.Truncate(arguments[1]);
            }

            this.Set(this.x - Width, this.y - Height, this.w + (2 * Width), this.h + (2 * Height));
        };
        _.IntersectsWith = function (R) {
            // True if this instance and the passed R Rectangle have at least one common point.
            return (R.X < this.x + this.w) && (this.x < (R.X + R.Width)) && (R.Y < this.y + this.h) && (this.y < R.Y + R.Height);
        };
        _.Intersect = function (R) {
            // Makes this rectangle to be the result of the intersection between this rectangle and R.
            // If there is no intersection between the two rectangles, nothing happens. 
            var X1 = Math.max(this.x, R.X);
            var X2 = Math.min(this.x + this.w, R.X + R.Width);
            var Y1 = Math.max(this.y, R.Y);
            var Y2 = Math.min(this.y + this.h, R.Y + R.Height);

            if (X2 >= X1 && Y2 >= Y1) {
                this.Set(X1, Y1, X2 - X1, Y2 - Y1);
            }
        };
        _.Offset = function (Param) {
            if (arguments.length === 2) {
                this.x = arguments[0];
                this.y = arguments[1];
            } else {
                this.x = arguments[0].X;
                this.y = arguments[0].Y;
            }

            this.Notify();
        };
        _.Union = function (R) {
            // Makes this rectangle to be the result of the union between this rectangle and R. 
            var X1 = Math.min(this.x, R.X);
            var X2 = Math.max(this.x + this.w, R.X + R.Width);
            var Y1 = Math.min(this.y, R.Y);
            var Y2 = Math.max(this.y + this.h, R.Y + R.Height);

            this.Set(X1, Y1, X2 - X1, Y2 - Y1);
        };
        _.Equals = function (Params) {
            if (Params instanceof tp.Rectangle) {
                var R = Params;
                return (this.x === R.X) && (this.y === R.Y) && (this.w === R.Width) && (this.h === R.Height);
            }

            var X = tp.Truncate(arguments[0]);
            var Y = tp.Truncate(arguments[1]);
            var Width = tp.Truncate(arguments[2]);
            var Height = tp.Truncate(arguments[3]);
            return (this.x === X) && (this.y === Y) && (this.w === Width) && (this.h === Height);
        };
        _.ApplyTo = function (el, TriggerResizeEvent) {
            // Sets its values to element's size 
            if (typeof TriggerResizeEvent === tp.Undefined) { TriggerResizeEvent = false; }
            el.style.left = tp.px(this.x);
            el.style.top = tp.px(this.y);
            el.style.height = tp.px(this.h);
            el.style.width = tp.px(this.w);

            if (TriggerResizeEvent) {
                var ev = tp.CreateCustomEvent("resize");
                el.dispatchEvent(ev);
            }
        };
        _.toString = function () {
            return tp.Format("x={0}, y={1}, width={2}, height={3}", this.x, this.y, this.w, this.h);
        };

        return Class;
    })(Object);
    //#endregion
 

    tp.EventArgsDefaults = {
        e: null,                // the DOM event if any
        EventName: '',
        Sender: null,
        Listener: null,
        Handled: false,        // true if this event is already handled 
        Cancel: false,
    };

    tp.EventArgs = (function (BaseClass) {
        function Class(SourceArgs) {
            BaseClass.call(this);
            SourceArgs = SourceArgs || tp.EventArgsDefaults;

            for (var Prop in SourceArgs) {
                this[Prop] = SourceArgs[Prop];
            }
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.e = null;                 // the DOM event if any
        _.EventName = '';
        _.Sender = null;
        _.Listener = null;
        _.Handled = false;          // true if this event is already handled 
        _.Cancel = false;

        _.Tag = null;               // a user defined value

        return Class;
    })(Object);

    //#region tpObject
    tp.tpObject = (function (BaseClass) {

        function Class() {
            /// <summary> The ultimate base class.
            /// <para>EVENTS: Any of the tp.Events and the 'AnyMessage'</para>
            /// </summary>
            BaseClass.call(this);
            this.fEvents = null;
            this.InitClass();
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype; 
 
        /* treat it as read-only class field (static) */
        _.tpClass = 'tp.tpObject';

        /* fields */
        _.fEventsDisabledCounter = 0;
        _.fEvents = null;
        _.fJsonExcludes = [];


        tp.Property('EventsDisabled', _, function () {
            //When true, calling Trigger() does NOT inform any listener
            return this.fEventsDisabledCounter > 0;
        }, function (v) {
            this.fEventsDisabledCounter = v ? this.fEventsDisabledCounter + 1 : this.fEventsDisabledCounter - 1;
            if (this.fEventsDisabledCounter < 0)
                this.fEventsDisabledCounter = 0;
        });

        /*  methods */
        _.InitClass = function () {
            /// <summary>Initializes the 'static' and 'read-only' class fields, such as tpClass etc.</summary>
            
            this.fJsonExcludes = ['tpClass', 'EventsDisabled'];
        };
        _.toJSON = function () {
            /// <summary>
            /// If an object being stringified has a property named toJSON whose value is a function,
            /// then the toJSON method customizes JSON stringification behavior: instead of the object
            /// being serialized, the value returned by the toJSON method when called will be serialized.
            /// <para> see also: http://www.ecma-international.org/ecma-262/5.1/#sec-15.12.3 </para>
            /// </summary>
            var tmp = {};

            for (var key in this) {
                if ((typeof this[key] !== 'function')
                    && (this.fJsonExcludes.indexOf(key) === -1)     
                    && (key.charAt(0) !== 'f'))
                    tmp[key] = this[key];
            }

            return tmp;
        };

        _.IsSameClass = function (o) {
            /// <summary>True if the specified object is of the same class as this instance or derives from it. </summary>
            return o instanceof this.constructor;  // this.Class
        };
        _.Assign = function (Source) {
            this.Clear();
            if (Source) {
                tp.MergePropsDeep(this, Source);
            }
        };
        _.Clone = function () {
            var Result = new this.constructor();
            Result.Assign(this);
            return Result;
        };
        _.Clear = function () {
        };

        _.IndexOfFuncBind = function (Func) {
            if (tp.IsFunction(Func) && this.Binds) {
                for (var i = 0, ln = this.Binds.length; i < ln; i++) {
                    if (this.Binds[i].Func == Func) {
                        return i;
                    }
                }
            }

            return -1;
        };
        _.FuncBind = function (Func) {
            if (tp.IsFunction(Func)) {
                var o = null;
                var Index = this.IndexOfFuncBind(Func);
                if (Index < 0) {
                    if (!this.Binds) {
                        this.Binds = [];
                    }

                    o = {
                        Func: Func,
                        Bind: Func.bind(this),
                    };

                    this.Binds.push(o);
                } else {
                    o = this.Binds[Index];
                }

                return o.Bind;
            }

            return null;

        };

        _.On = function (EventName, Listener, Handler) {
            /// <summary>
            /// Adds the Handler function as an event handler for the EventName event of this instance.
            /// <para>EventName can be any of the tp.Events constants or the string 'AnyMessage' as a catch-all.</para>
            /// <para>Listener is optional. It also can be ommited and pass the Handler param in place.</para>
            /// <para>When the Handler function is called, it is passed a single Args parameter.</para>
            /// <para>Example handler: function(Args) { }</para>
            /// <para>Other call variations: 1 - EventName, Handler</para>
            /// <para>WARNING: Handler is always required.</para>
            ///</summary>
            /// <param name="EventName" type="string">The name of the event.</param>
            /// <param name="Listener" type="Object">The listener object. May be null</param>
            /// <param name="Function" type="Handler">The event handler function.</param>

            if (!tp.IsBlank(EventName) && (!tp.IsEmpty(Listener) || !tp.IsEmpty(Handler))) {
                if (!this.fEvents)
                    this.fEvents = {};

                EventName = EventName.toUpperCase();

                if (!(EventName in this.fEvents))
                    this.fEvents[EventName] = [];

                var ev = { listener: null, handler: null };

                if (tp.IsFunction(Listener)) {
                    ev.handler = Listener;
                } else {
                    ev.listener = Listener;
                    ev.handler = Handler;
                }

                this.fEvents[EventName].push(ev);
            }
        };
        _.Off = function (EventName, Listener) {
            /// <summary>
            /// Removes listener as a listerner for the EventName event of this instance.
            /// <para> Listener's type depends on how On() is called. Could be either an object or a function. </para>
            /// <para>EventName can be any of the tp.Events constants or the string 'AnyMessage' as a catch-all.</para>
            /// </summary>
            /// <param name="EventName" type="String">The name of the event.</param>
            /// <param name="Listener" type="Object">Either the listener object or the event handler function</param>
            if (!this.fEvents)
                return;

            var self = this;
            function remove(EventName, Listener) {
                if (!tp.IsBlank(EventName) && !tp.IsEmpty(Listener)) {
                    var InvocationList = self.fEvents[EventName];
                    if (InvocationList) {
                        var Index = -1;
                        for (var i = 0; i < InvocationList.length; i++) {
                            if ((InvocationList[i].listener === Listener) || (InvocationList[i].handler === Listener)) {
                                Index = i;
                                break;
                            }
                        }
                        if (Index !== -1) {
                            InvocationList.splice(Index, 1);
                        }
                    }
                }
            }

            var Args = tp.Overload(arguments);
            switch (Args) {
                case "o":
                    for (var E in this.fEvents) {
                        remove(E, Listener);
                    }
                    break;
                case "s,o":
                case "s,f":
                    EventName = EventName.toUpperCase();
                    remove(EventName, Listener);
                    break;
            }
        };
        _.Trigger = function (EventName, Args) {
            /// <summary>
            /// Triggers EventName event passing Args. It calls all previously registered listeners.
            /// <para> NOTE: If EventsDisabled is true, nothing happens.</para>
            /// <para> EventName can be any of the tp.Events constants or the string 'AnyMessage' as a catch-all.</para>
            /// <para> The event handler function is passed a single Args parameter even when null is passed here for Args. </para>
            /// <para> Other call variations: 1 - EventName </para>
            /// </summary>
            /// <param name="EventName" type="String">The name of the event.</param>
            /// <param name="Args" type="Object">A user defined object with parameters or null.</param>
            if (!this.EventsDisabled && this.fEvents && !tp.IsBlank(EventName)) {
                EventName = EventName.toUpperCase();
                var InvocationList = this.fEvents[EventName];
                if (InvocationList) {
                    Args = (Args instanceof tp.EventArgs)? Args: new tp.EventArgs(Args);
                    Args.EventName = EventName;
                    Args.Sender = this;
                    var Listener, Func;
                    var i, ln;

                    for (i = 0, ln = InvocationList.length; i < ln; i++) {
                        Listener = InvocationList[i].listener;
                        Func = InvocationList[i].handler;
                        Args.Listener = Listener;
                        Func.call(Listener, Args);
                    }
                    /*  NO - let the exceptions thrown and the listeners intact
                    var BadListeners = [];
                    for (i = 0, ln = InvocationList.length; i < ln; i++) {
                    Listener = InvocationList[i].listener;
                    Func = InvocationList[i].handler;
                    try {
                    Args.Listener = Listener;
                    Func.call(Listener, ea);
                    } catch (e) {
                    BadListeners.push(Listener);
                    }
                    }
                    
                    for (i = 0, ln = BadListeners.length; i < ln; i++) {
                    this.Off(null, BadListeners[i]);
                    }
                    */
                }
            }
        };
        _.HasListeners = function (EventName) {
            if (this.fEvents && !tp.IsBlank(EventName)) {
                EventName = EventName.toUpperCase();
                var InvocationList = this.fEvents[EventName];
                return InvocationList && (InvocationList.length > 0);
            }

            return false;
        };

        _.handleEvent = function (e) {
            /// <summary>
            /// For handling all DOM element events.
            /// Either when this is a DOM element and the sender (target) of the event is this.Handle
            /// or when the sender (target) of the event is any other object and listener is this instance.
            /// <para> NOTE: This is an implementation of EventListener interface. </para>
            /// <para> See: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener </para>
            /// </summary>

        };

        return Class;
    })(Object);
    //#endregion
    
 
    tp.Element = (function (BaseClass) {

        var StandardNodeTypes = [
     'main',
     'aside',
     'article',
     'section',
     'header',
     'footer',
     'nav',

     'iframe',

     'div',
     'span',
     'fieldset',

     'a',
     'form',
     'table',

     'label',
     'button',
     'input',
     'select',
     'option',
     'ul',
     'ol',
     'li',
     'img',
     'textarea',
     'progress',
     'video',
        ];

        function Class(Parent, CssClasses, ElementOrSelector) {
            /// <summary> Represents a dom element. Any parameter can be null. </summary>
            /// <param name="Parent" type="Element or tp.Element">Can be null. If it is not, then the created element is added to its child nodes.</param>
            /// <param name="CssClasses" type="String">A space separated list of css classes. Used only if an element is created, NOT on existing elements</param>
            /// <param name="ElementOrSelector" type="String or Element">Can be null. A css selector or a tag type (i.e. div, span, etc) or an element.</param>

            BaseClass.call(this);   // this calls the InitClass() method

            if (!this.fDeferHandleCreation) {
                this.CreateHandle(Parent, CssClasses, ElementOrSelector);
            }

        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        /* treat them as read-only  class fields (static) */
        _.fFromMarkup = false;              // true when an already existed element is passed as this handle
        _.fChildMarkupControls = [];        // any tp.Element instances created from markup and having this instance as container (e.g. when this is an accordion item or a tab page, panel etc.)

        _.fDisplayType = '';                // by default, either the css defined or block
        _.fElementType = 'div';
        _.fElementSubType = '';
        _.fDefaultCssClasses = '';
        _.fDeferHandleCreation = false;     // when true the constructor does NOT create the handle (dom element)
        _.fAutoId = false;

        /* private */
        _.fHandle = null;                   // dom element
        _.fEnabled = true;


        /* fields */
        _.Document = tp.Document;
        _.InformSiblings = false;
        _.CreateParams = null;

        /* non-dom properties */
        tp.Property('DisplayType', _, function () {
            /// <summary>Returns a value used with the display style property, when the element is visible</summary>

            if (tp.IsBlank(this.fDisplayType)) {
                if (!this.Handle) {
                    this.fDisplayType = 'block';
                } else {
                    var S = this.ComputedStyle.display;
                    this.fDisplayType = !tp.IsSameText('none', S) ? S : 'block';
                }
            }

            return this.fDisplayType;
        });
        tp.Property('ElementType', _, function () {
            /// <summary> Returns the type of this element, i.e. the desired nodeName property value </summary>
            return this.fElementType;
        });
        tp.Property('ElementSubType', _, function () {
            /// <summary> Used when this is an input element. Returns the input type of this element, i.e. the desired type attribute value </summary>
            return this.fElementSubType;
        });

        tp.Property('Parent', _, function () {
            // returns the parent tp.Element
            var el = this.ParentHandle;
            return (el && el.tpObject) ? el.tpObject : null;
        }, function (v) {
            this.SetParent(v);
        });
        tp.Property('ParentHandle', _, function () {
            /**  a reference to the closest ancestor element
            in the DOM hierarchy from which the position of the current element is calculated. */
            return this.Handle ? this.Handle.parentNode : null;
        }, function (v) {
            this.SetParent(v);
        });        

        /* dom properties */
        tp.Property('Handle', _, function () {
            /// <summary>The actual dom element. When setting, then the value could be an Element or a Selector.</summary>
            return this.fHandle;
        }, function (v) {
            if (this.fHandle !== v) {
                if (tp.IsElement(this.fHandle)) {
                    this.fHandle.tpObject = null;
                }

                v = tp(v);

                if (tp.IsElement(v)) {
                    this.fHandle = v;
                    this.fHandle.tpObject = this;
                    this.HandleChanged();
                }
            }
        });
        tp.Property('Id', _, function () {
            return (this.Handle && this.Handle.id) ? this.Handle.id : '';
        }, function (v) {
            if (this.Handle) {
                this.Handle.id = v;
                if (this.Handle.name && tp.IsBlank(this.Handle.name))
                    this.Handle.name = v;
            }
        });
        tp.Property('Name', _, function () {
            /** name gets or sets the name propery of an DOM object, it only applies to the following elements:
            <a>, <applet>, <button>, <form>, <frame>, <iframe>, <img>, <input>, <map>, <meta>, <object>,
            <param>, <select>, and <textarea>. */
            return (this.Handle && this.Handle.name) ? this.Handle.name : '';
        }, function (v) {
            if (this.Handle)
                this.Handle.name = v;
        });
        tp.Property('NodeType', _, function () {
            /** the element tag name, i.e body, div, etc */
            return (this.Handle && this.Handle.nodeName) ? this.Handle.nodeName : '';
        });

        tp.Property('DefaultValue', _, function () {
            /* default value - string - for input elements such as text, textarea, checkbox, radio, button, */
            return this.Handle ? this.Handle.defaultValue : '';
        }, function (v) {
            this.Handle.defaultValue = v;
        });
        tp.Property('Html', _, function () {
            return this.Handle ? this.Handle.innerHTML : '';
        }, function (v) {
            if (this.Handle)
                this.Handle.innerHTML = v;
        });
        tp.Property('Text', _, function () {
            /** textContent or innerHTML */
            return this.Handle ? tp.Value(this.Handle) : '';
        }, function (v) {
            if (this.Handle) {
                tp.Value(this.Handle, v);
            }
        });
        tp.Property('Enabled', _, function () {
            return this.fEnabled;
        }, function (v) {
            if (v !== this.fEnabled) {
                tp.Enabled(this.Handle, v);
                this.fEnabled = v;
                if (this.Enabled) {
                    this.RemoveClass('tp-Disabled');
                } else {
                    this.AddClass('tp-Disabled');
                }
                this.OnEnabledChanged();
            }
            
        });
        tp.Property('ToolTip', _, function () {
            return this.Handle ? !this.Handle.title : '';
        }, function (v) {
            this.Handle.title = v;
        });
        tp.Property('ContentEditable', _, function () {
            /* content editable: boolean - controls whether the contents of the object are editable. */
            return this.Handle ? tp.IsSameText(this.Handle.contentEditable, "true") : false;
        }, function (v) {
            this.Handle.contentEditable = v ? "true" : "false";
        });
        tp.Property('Draggable', _, function () {
            if (!this.Handle)
                return false;
            var S = this.Handle.getAttribute("draggable");
            return tp.IsBlank(S) ? false : tp.IsSameText(S, "true");
        }, function (v) {
            this.Handle.setAttribute("draggable", v ? "true" : "false");
        });

        tp.Property('Position', _, function () {
            /**  position   (WARNING: Tripous uses absolute positioning)
            static   : Default. Elements are rendered in order, as they appear in the document flow.
            absolute : The element is positioned relative to its first positioned (relative, fixed or absolute) ancestor element (Parent).
            fixed    : The element is positioned relative to the browser window's client area.
            relative : The element is offset relative to its normal flow (static) position.
            inherit  : Takes the value of this property from the computed style of the parent element.  */
            return this.Handle ? this.StyleProp('position') : null;
        }, function (v) {
            if (this.Handle)
                this.StyleProp('position', v);
        });

        tp.Property('Visible', _, function () {
            /// <summary>Gets or sets the display style property
            /// The passed value could be a boolean (true or false) or a proper string value 
            /// for the display style property </summary>
 
            return this.Handle ? !tp.IsSameText('none', this.ComputedStyle.display) : false;         

        }, function (v) {
            if (this.Handle) {
                var Old;
                if (tp.IsBoolean(v)) {
                    Old = this.Visible;
                    if (!v && !tp.IsSameText('none', this.Handle.style.display)) {
                        this.fDisplayType = this.ComputedStyle.display; // save it, just in case.
                    }
                    this.Handle.style.display = v ? this.DisplayType : 'none';

                    if (Old !== v) {
                        this.OnVisibleChanged();
                    }
                } else {
                    Old = this.ComputedStyle.display;
                    v = tp.IsBlank(v) ? 'none' : v;
                    this.Handle.style.display = v;
                    if (Old !== v) {
                        this.OnDisplayTypeChanged();
                    }
                }
            }
        });
        tp.Property('Visibility', _, function () {
            // boolean
            return this.Handle ? tp.IsSameText(this.ComputedStyle.visibility, "visible") : false;
        }, function (v) {
            this.Handle.style.visibility = v ? "visible" : "hidden";
        });
        tp.Property('Opacity', _, function () {
            /*  opacity - float number from 0.0 to 1.0  */
            return this.Handle ? tp.StrToFloat(this.ComputedStyle.opacity) : 0;
        }, function (v) {
            this.Handle.style.opacity = v;
        });
        tp.Property('ZIndex', _, function () {
            /** z-Index - integer
           see:    http://philipwalton.com/articles/what-no-one-told-you-about-z-index/
           http://www.w3.org/TR/CSS2/zindex.html        */
            if (!this.Handle)
                return -1;
            var Result = this.ComputedStyle.zIndex;
            return tp.IsNaN(Result) ? 0 : Number(Result);
        }, function (v) {
            this.Handle.style.zIndex = v;
        });
        tp.Property('Cursor', _, function () {
            /* cursor - string - the mouse cursor - for valid values see tp.Cursors */
            return this.Handle ? this.ComputedStyle.cursor : '';
        }, function (v) {
            this.Handle.style.cursor = v;
        });
        tp.Property('BackColor', _, function () {
            /* background color : a color or transparent or inherit - use tp.Color */
            return this.Handle ? this.StyleProp('background-color') : null;
        }, function (v) {
            if (this.Handle)
                this.StyleProp('background-color', v);
        });
        tp.Property('TabIndex', _, function () {
            /* an element is focusable only if tablIndex > 0 */
            return this.Handle ? this.Handle.tabIndex : 0;
        }, function (v) {
            if (this.Handle)
                this.Handle.tabIndex = v;
        });

        tp.Property('ComputedStyle', _, function () {
            return this.Handle ? this.Handle.ownerDocument.defaultView.getComputedStyle(this.Handle, '') : null;
        });
        tp.Property('Style', _, function () {
            /// <summary>The dom element style property</summary>
            return this.Handle ? this.Handle.style : null;
        });
        tp.Property('CssText', _, function () {
            /// <summary>The cssText property dom element style</summary>
            return this.Style ? this.Style.cssText : '';
        }, function (v) {
            if (this.Handle)
                this.Style.cssText = v;
        });
        tp.Property('CssClasses', _, function () {
            /* css class names - string - a space-separated list of the related class names.  */
            return this.Handle ? this.Handle.className : '';
        }, function (v) {
            if (this.Handle) {
                this.Handle.className = tp.IsBlank(v) ? '' : v;
            }
        });

        tp.Property('Size', _, function () {
            return this.Handle ? tp.SizeOf(this.Handle) : new tp.Size(0, 0);
        });

        tp.Property('OffsetRect', _, function () {
            return this.Handle ? tp.OffsetRect(this.Handle) : new tp.Rectangle(0, 0, 0, 0);
        });
        tp.Property('OffsetSize', _, function () {
            /* the offset size (Width and Height) of the Element (that is an area including 
            padding, border and scroll-bar, if visible, but not the margin). */
            if (this.Handle) {
                return new tp.Size(this.Handle.offsetWidth, this.Handle.offsetHeight);
            }
            return new tp.Size(0, 0);
        });
        tp.Property('OffsetWidth', _, function () {
            // width of an element in pixels, including padding, border and scroll-bar, if visible, but not the margin.
            return this.Handle ? this.Handle.offsetWidth : 0;
        });
        tp.Property('OffsetHeight', _, function () {
            // height of an element in pixels, including padding, border and scroll-bar, if visible, but not the margin.
            return this.Handle ? this.Handle.offsetHeight : 0;
        });

        tp.Property('ScrollLeft', _, function () {
            /**  the number of pixels by which the contents of an object are scrolled to the left. */
            return this.Handle ? this.Handle.scrollLeft : 0;
        }, function (v) {
            this.Handle.scrollLeft = v;
        });
        tp.Property('ScrollTop', _, function () {
            /**  the number of pixels by which the contents of an object are scrolled upward. */
            return this.Handle ? this.Handle.scrollTop : 0;
        }, function (v) {
            this.Handle.scrollTop = v;
        });
        tp.Property('ScrollWidth', _, function () {
            /**  the total width of an element's contents, in pixels.
            The value contains the width with the padding, but does not include the scrollBar, border, and the margin. */
            return this.Handle ? this.Handle.scrollWidth : 0;
        });
        tp.Property('ScrollHeight', _, function () {
            /**  the total height of an element's contents, in pixels.
            The value contains the height with the padding, but does not include the scrollBar, border, and the margin. */
            return this.Handle ? this.Handle.scrollHeight : 0;
        });

        tp.Property('X', _, function () {
            /* if a number is passed then it is considered as pixels */
            return this.Handle ? this.StyleProp('left') : null;
        }, function (v) {
            this.Handle.style.left = tp.IsNumber(v) ? tp.px(v) : v;
        });
        tp.Property('Y', _, function () {
            /* if a number is passed then it is considered as pixels */
            return this.Handle ? this.StyleProp('top') : null;
        }, function (v) {
            this.Handle.style.top = tp.IsNumber(v) ? tp.px(v) : v;
        });
        tp.Property('Left', _, function () {
            /* if a number is passed then it is considered as pixels */
            return this.X;
        }, function (v) {
            this.X = v;
        });
        tp.Property('Top', _, function () {
            /* if a number is passed then it is considered as pixels */
            return this.Y;
        }, function (v) {
            this.Y = v;
        });
        tp.Property('Width', _, function () {
            /* if a number is passed then it is considered as pixels */
            return this.Handle ? this.StyleProp('width') : null;
        }, function (v) {
            this.Handle.style.width = tp.IsNumber(v) ? tp.px(v) : v;
        });
        tp.Property('Height', _, function () {
            /* if a number is passed then it is considered as pixels */
            return this.Handle ? this.StyleProp('height') : null;
        }, function (v) {
            this.Handle.style.height = tp.IsNumber(v) ? tp.px(v) : v;
        });
        tp.Property('Right', _, function () {
            /* if a number is passed then it is considered as pixels */
            return this.Handle ? this.StyleProp('right') : null;
        }, function (v) {
            this.Handle.style.right = tp.IsNumber(v) ? tp.px(v) : v;
        });
        tp.Property('Bottom', _, function () {
            /* if a number is passed then it is considered as pixels */
            return this.Handle ? this.StyleProp('bottom') : null;
        }, function (v) {
            this.Handle.style.bottom = tp.IsNumber(v) ? tp.px(v) : v;
        });

        tp.Property('MinWidth', _, function () {
            /* if a number is passed then it is considered as pixels */
            return this.Handle ? this.StyleProp('min-width') : null;
        }, function (v) {
            v = tp.IsNumber(v) ? tp.px(v) : v;
            this.StyleProp('min-width', v);
        });
        tp.Property('MinHeight', _, function () {
            /* if a number is passed then it is considered as pixels */
            return this.Handle ? this.StyleProp('min-height') : null;
        }, function (v) {
            v = tp.IsNumber(v) ? tp.px(v) : v;
            this.StyleProp('min-height', v);
        });

        tp.Property('MaxWidth', _, function () {
            /* if a number is passed then it is considered as pixels */
            return this.Handle ? this.StyleProp('max-width') : null;
        }, function (v) {
            v = tp.IsNumber(v) ? tp.px(v) : v;
            this.StyleProp('max-width', v);
        });
        tp.Property('MaxHeight', _, function () {
            /* if a number is passed then it is considered as pixels */
            return this.Handle ? this.StyleProp('max-height') : null;
        }, function (v) {
            v = tp.IsNumber(v) ? tp.px(v) : v;
            this.StyleProp('max-height', v);
        });

        tp.Property('FontFamily', _, function () {
            /* font family : a comma separated list of font family names - WARNING: double quote multi-word names */
            return this.Handle ? this.ComputedStyle.fontFamily : '';
        }, function (v) {
            this.Handle.style.fontFamily = v;
        });
        tp.Property('FontColor', _, function () {
            /* font color : a color or inherit */
            return this.Handle ? this.ComputedStyle.color : '';
        }, function (v) {
            this.Handle.style.color = v;
        });
        tp.Property('FontSize', _, function () {
            /** font size could be any of the following or pixel, etc. value.
                xx-small
                x-small
                small
                medium
                large
                x-large
                xx-large
                larger
                smaller
                inherit   */
            return this.Handle ? this.ComputedStyle.fontSize : '';
        }, function (v) {
            this.Handle.style.fontSize = v;
        });
        tp.Property('Bold', _, function () {
            /** bold - boolean  */
            return tp.ListContainsText(['bold', 'bolder', 'lighter'], this.BoldLevel);
        }, function (v) {
            this.BoldLevel = v ? "bold" : "normal";
        });
        tp.Property('BoldLevel', _, function () {
            /** bold level (font weight) - Use the values: normal, bold, bolder, lighter */
            return this.Handle ? this.ComputedStyle.fontWeight : '';
        }, function (v) {
            this.Handle.style.fontWeight = v;
        });
        tp.Property('Italic', _, function () {
            /** italic - boolean - controls if the font is italic or not */
            return this.Handle ? !tp.IsSameText(this.ComputedStyle.fontStyle, "italic") : false;
        }, function (v) {
            this.Handle.style.fontStyle = v ? "italic" : "normal";
        });
        tp.Property('Underline', _, function () {
            return this.Handle ? !tp.IsSameText(this.ComputedStyle.textDecoration, "underline") : false;
        }, function (v) {
            this.Handle.style.textDecoration = v ? "underline" : "none";
        });
        tp.Property('SmallCaps', _, function () {
            /** small-caps - boolean - controls if the font is normal or italic */
            return this.Handle ? !tp.IsSameText(this.ComputedStyle.fontVariant, "small-caps") : false;
        }, function (v) {
            this.Handle.style.fontStyle = v ? "small-caps" : "normal";
        });
        tp.Property('Rtl', _, function () {
            /** right to left text direction - boolean - controls the text direction */
            return this.Handle ? !tp.IsSameText(this.ComputedStyle.direction, "rtl") : false;
        }, function (v) {
            this.Handle.style.direction = v ? "rtl" : "ltr";
        });
        tp.Property('LineHeight', _, function () {
            /* text line height */
            return this.Handle ? this.ComputedStyle.lineHeight : 0;
        }, function (v) {
            this.Handle.style.lineHeight = v;
        });
        tp.Property('TextAlign', _, function () {
            /** text align - string - valid values: left, right, justify  */
            return this.Handle ? this.ComputedStyle.textAlign : '';
        }, function (v) {
            this.Handle.style.textAlign = v;
        });
        tp.Property('TextIdent', _, function () {
            /** text ident - the horizontal indent for the first line of text.*/
            return this.Handle ? this.ComputedStyle.textIndent : '';
        }, function (v) {
            this.Handle.style.textIndent = v;
        });

        /*  methods */
        _.InitClass = function () {
            /// <summary>Initializes the 'static' and 'read-only' class fields, such as tpClass etc.</summary>
            base.InitClass.call(this);
            
            this.tpClass = 'tp.Element';
            
            this.fElementType = 'div';
            this.fDisplayType = '';         // by default, either the css defined or block
            this.fDefaultCssClasses = '';
            this.fAutoId = false;
        };
        _.ConstructId = function (el) {
            el = el || this.Handle;

            if (tp.IsElement(el)) {
                var s = '';

                if (this.tpClass === 'tp.Element') {
                    s = el.nodeName;
                    s = s.toLowerCase();
                } else {
                    var Parts = tp.Split(this.tpClass, '.');
                    s = Parts[Parts.length - 1];
                }

                return tp.SafeId(s);
            }
            return '';
        };

        _.SetParent = function (v) {
            /// <summary>Sets the parent of this instance</summary>
            /// <param name="v" type="tp.Element | Element | null">The new parent of this instance. Could be null or undefined</param>
            if (this.Handle) {
                if (v instanceof Class) {
                    v = v.Handle;
                }

                if (tp.IsEmpty(v)) {
                    this.RemoveFromDom();
                } else {
                    this.AppendTo(v);
                }
            }

        };
        _.AppendTo = function (Parent) {
            /// <summary>Appends this to dom. Parent could be an element or a tp.Element</summary>
            if (this.Handle) {
                if ((Parent instanceof Class) && Parent.Handle) {
                    Parent.Handle.appendChild(this.Handle);
                    this.ParentChanged();
                } else if (tp.IsElement(Parent)) {
                    Parent.appendChild(this.Handle);
                    this.ParentChanged();
                }
            }
        };
        _.InsertTo = function (RefNode) {
            /// <summary>Inserts this to dom, before RefNode. RefNode could be an element or a tp.Element</summary>
            if (this.Handle) {
                if ((RefNode instanceof Class) && RefNode.ParentHandle) {
                    RefNode.ParentHandle.insertBefore(this.Handle, RefNode.Handle);
                    this.ParentChanged();
                } else if (tp.IsElement(RefNode) && RefNode.parentNode) {
                    RefNode.parentNode.insertBefore(this.Handle, RefNode);
                    this.ParentChanged();
                }
            }
        };
        _.InsertAt = function (Index, Parent) {
            if (this.Handle && Parent) {
                var elParent = null;
                if (Parent instanceof Class) {
                    elParent = Parent.Handle;
                } else if (tp.IsElement(Parent)) {
                    elParent = Parent;
                }

                if (elParent) {
                    var Count = elParent.children.length;

                    if (Count === 0) {
                        elParent.appendChild(this.Handle);
                    } else {
                        var RefNode = elParent.children[Index];
                        this.InsertTo(RefNode);
                    }
                }
            }
        };
        _.RemoveFromDom = function () {
            /// <summary>Removes this from dom, if it has a parent element</summary>
            if (this.Handle && this.ParentHandle) {
                this.ParentHandle.removeChild(this.Handle);
                this.ParentChanged();
            }
        };

        _.CreateHandle = function (Parent, CssClasses, ElementOrSelector) {
            /// <summary> Creates and initializes the DOM Element denoting by Handle. </summary>
            /// <param name="Parent" type="Element or tp.Element">Can be null. If it is not, then the created element is added to its child nodes.</param>
            /// <param name="CssClasses" type="String">Can be null. A space separated list of css classes to be added to the new element</param>
            /// <param name="ElementOrSelector" type="String | Element">Can be null. A dom element or a css selector or a tag type (i.e. div, span, etc). If null then the ElementType is used.</param>


            if (tp.IsEmpty(this.Handle)) {

                this.fFromMarkup = false;
                var el = null;

                // ensure we have an element
                if (tp.IsElement(ElementOrSelector)) {
                    el = ElementOrSelector;
                    this.fFromMarkup = true;
                } else if (tp.IsString(ElementOrSelector) && !tp.IsBlank(ElementOrSelector)) {
                    if (tp.ListContainsText(StandardNodeTypes, ElementOrSelector)) {
                        el = this.Document.createElement(ElementOrSelector);
                    } else {
                        el = tp(ElementOrSelector);
                        this.fFromMarkup = tp.IsElement(el);
                    }
                }


                if (!el) {
                    el = this.Document.createElement(this.ElementType);
                }

                // when it is an input element
                if (tp.IsSameText(el.nodeName, 'input') || tp.IsSameText(el.nodeName, 'button')) {
                    if (!tp.IsBlank(this.ElementSubType)) {
                        el.type = this.ElementSubType;
                    }
                }


                // css classes  
                if (!tp.IsBlank(this.fDefaultCssClasses)) {
                    CssClasses = this.fDefaultCssClasses + (tp.IsBlank(CssClasses) ? '' : ' ' + CssClasses);
                }

                if (!tp.IsBlank(CssClasses)) {
                    CssClasses = tp.IsBlank(el.className) ? CssClasses : CssClasses + ' ' + el.className;
                    el.className = '';
                    tp.AddClasses(el, CssClasses);
                }

                tp.AddClass(el, 'tp-Object');

                // id
                if (tp.IsBlank(el.id) && (this.AutoId === true)) {
                    el.id = this.ConstructId(el);
                }

                // link to tripous object
                el.tpObject = this;


                // parent
                if (tp.IsEmpty(el.parentNode)) {
                    if (tp.IsElement(Parent)) {
                        Parent.appendChild(el);
                    } else if (Parent instanceof Class) {
                        Parent.Handle.appendChild(el);
                    }
                }

                // set the property but do NOT trigger the event 
                this.fHandle = el;
                this.fHandle.tpObject = this;

                this.HandleCreated();

                // options in a data-* (data-setup) attribute           
                this.CreateParams = this.GetCreateParams();
                this.ProcessCreateParams(this.CreateParams);
 
                this.CreateParamsProcessed();
            }
        };
        _.DestroyHandle = function () {
            if (tp.IsElement(this.fHandle)) {
                var el = this.fHandle;
                this.fHandle.tpObject = null;
                this.fHandle = null;
                if (tp.IsElement(el.parentNode)) {
                    el.parentNode.removeChild(el);
                }
            }

        };
        _.HandleChanged = function () {
        };
        _.ParentChanged = function () {
        };
        _.HandleCreated = function () {
            /// <summary>Called by CreateHandle() after all processing is done, that is after handle creation but BEFORE option processing</summary>
        };

        _.GetCreateParams = function () {
            var Result = null;

            var el = this.Handle;
            if (tp.IsElement(el)) {

                var CopyProps = function (Source, Dest) {
                    if (!tp.IsEmpty(Source) && !tp.IsEmpty(Dest)) {
                        for (var Prop in Source) {
                            Dest[Prop] = Source[Prop];
                        }
                    }
                };

                var Id = null;
                var A = null;
                if ('__tpCreateParams' in el) {                             // it is already compiled
                    A = el.__tpCreateParams;
                    Id = ('Id' in A) ? A.Id : null;
                    delete el.__tpCreateParams;
                } else {
                    A = tp.Data(el, 'setup');
                    if (!tp.IsBlank(A)) {
                        A = eval("(" + A + ")");                                    // compile it
                        Id = ('Id' in A) ? A.Id : null;
                        el.removeAttribute('data-setup');
                    } else {
                        A = null;
                    }
                }

                // options placed in tp.CreateParams
                Id = Id || el.id;
                var B = null;
                if (!tp.IsBlank(Id)) {
                    if (Id in tp.CreateParams) {
                        B = tp.CreateParams[Id];
                    }
                }


                if (!tp.IsEmpty(A) || !tp.IsEmpty(B)) {
                    var CP = {};            
                    CopyProps(A, CP);
                    CopyProps(B, CP);
                    Result = CP;
                }
            }

            return Result;

        };
        _.ProcessCreateParams = function (o) {
            if (!tp.IsEmpty(o)) {
                for (var Prop in o) {
                    if (!tp.IsFunction(o[Prop]) && (Prop in this)) {
                        this[Prop] = o[Prop];
                    }
                }
                
            }
        };
        _.GetSetupOption = function (PropName, Default) {
            /// <summary>Returns a property value from this.CreateParams in a safe manner.</summary>
            Default = Default || null;
            if (!tp.IsEmpty(this.CreateParams) && (PropName in this.CreateParams)) {
                return this.CreateParams[PropName];
            }
            return Default;
        };
        _.CreateParamsProcessed = function () {
            /// <summary>Called by CreateHandle() after all processing is done, that is AFTER handle creation and AFTER option processing</summary>
        };

        _.GetControls = function () {
            return this.Handle ? tp.tpObjects(this.Handle) : [];
        };
        _.FindControlByCssClass = function (v) {
            var List = this.GetControls();
            for (var i = 0, ln = List.length; i < ln; i++) {
                if (List[i].HasClass(v))
                    return List[i];
            }
            return null;
        };
        _.FindControlById = function (v) {
            var List = this.GetControls();
            for (var i = 0, ln = List.length; i < ln; i++) {
                if (List[i].Id === v)
                    return List[i];
            }
            return null;
        };
        _.FindControlByProp = function (PropName, PropValue) {
            /// <summary>Finds and return a tp.Elemement, contained by this container, by a property. If not found, then null is returned</summary>
            /// <param name="PropName" type="String">The property to match</param>
            /// <param name="PropValue" type="Any">The value to match</param>
            /// <returns type="tp.Element | null">Returns the tp.Element or null.</returns>
            return tp.FindControlByProp(this.Handle, PropName, PropValue);
        };
        
        _.OnVisibleChanged = function () {
            this.Trigger('VisibleChanged', {});
        };
        _.OnDisplayTypeChanged = function () {
            this.Trigger('DisplayTypeChanged', {});
        };

        _.Css = function (o, v) {
            /// <summary> Gets or sets the value of a style property or sets the values of multiple style properties. 
            /// <para>NOTE: For the function to act as a get, just do leave the last argument empty or null.</para>
            /// <para>NOTE: When setting multiple properties the last argument is not used.</para>
            /// <para>Example get: Css('width')</para>
            /// <para>Example set: Css('width', '100px'); Css({'width': '100px', height: '100px', 'background-color', 'yellow', backgroundColor: 'red' });</para>
            ///</summary>
            /// <param name="o" type="String|Object">When string denotes the property name. Else it's an object with key/value pairs where key may be a string</param>
            /// <param name="v" type="Object">The value of the property to set.</param>
            return this.Handle ? tp.Css(this.Handle, o, v) : null;
        };
        _.StyleProp = function (PropName, v) {
            /// <summary>Gets or sets the value of a css style property of an element</summary>
            return this.Handle ? tp.StyleProp(this.Handle, PropName, v) : null;
        };
        _.Attribute = function (o, v) {
            /// <summary> Gets or sets the value of an attribute or sets the values of multiple attributes. 
            /// <para>NOTE: For the function to act as a get, just do leave the last argument empty or null.</para>
            /// <para>NOTE: When setting multiple attributes the last argument is not used.</para>
            /// <para>Example get: Attribute('id')</para>
            /// <para>Example set: Attribute('id', 'div0'); Attribute({ id: 'img0', src: 'image.jpg', 'width': '100px', height: '100px' });</para>
            ///</summary>
            /// <param name="o" type="String|Object">When string denotes the attribute name. Else it's an object with key/value pairs where key may be a string</param>
            /// <param name="v" type="Object">The value of the attribute to set.</param>
            return this.Handle ? tp.Attribute(this.Handle, o, v) : null;
        };
        _.Data = function (o, v) {
            /// <summary> Gets or sets the value of a data-* attribute or sets the values of multiple data-* attributes. 
            /// <para>NOTE: For the function to act as a get, just do leave the last argument empty or null.</para>
            /// <para>NOTE: When setting multiple items the last argument is not used.</para>
            /// <para>Example get: Data('size')</para>
            /// <para>Example set: Data('size', '123'); Data(el, {'size': '123', count: '456', 'color', 'yellow', index: '0' });</para>
            ///</summary>
            /// <param name="o" type="String|Object">When string denotes the item name. Else it's an object with key/value pairs where key may be a string</param>
            /// <param name="v" type="Object">The value of the item to set.</param>
            return this.Handle ? tp.Data(this.Handle, o, v) : null;
        };
        _.Role = function (v) {
            /// <summary> Gets or sets the value of a data-role attribute  </summary>
            return this.Handle ? tp.Role(this.Handle, v) : null;
        };
        _.HasClass = function (Name) {
            return this.Handle && !tp.IsBlank(Name) && this.Handle.classList.contains(Name);
        };
        _.AddClass = function (Name) {
            if (this.Handle && !tp.IsBlank(Name) && !this.Handle.classList.contains(Name)) {
                this.Handle.classList.add(Name);
            }
        };
        _.RemoveClass = function (Name) {
            if (this.HasClass(Name)) {
                this.Handle.classList.remove(Name);
            }
        };
        _.ToggleClass = function (Name) {
            if (this.Handle && !tp.IsBlank(Name)) {
                this.Handle.classList.toggle(Name);
            }
        };

        _.AddClasses = function (Names, MoreNames) {
            /// <summary>Adds any number of css class names to this className(s). 
            /// <para>Can have multiple arguments.</para>
            /// <para>Each argument could be just a single class name, or more names space separated </para>
            ///</summary>
            var A = [];
            var Parts = null;
            var S, i, ln;

            for (i = 0, ln = arguments.length; i < ln; i++) {
                S = arguments[i];
                if (!tp.IsBlank(S)) {
                    Parts = tp.Split(S, ' ', true);
                    A = A.concat(Parts);
                }
            }

            for (i = 0, ln = A.length; i < ln; i++) {
                this.AddClass(A[i]);
            }
        };
        _.RemoveClasses = function (Names, MoreNames) {
            /// <summary>Removes any number of css class names from this className(s). 
            /// <para>Can have multiple arguments.</para>
            /// <para>Each argument could be just a single class name, or more names space separated </para>
            ///</summary>
            var A = [];
            var Parts = null;
            var S, i, ln;

            for (i = 0, ln = arguments.length; i < ln; i++) {
                S = arguments[i];
                if (!tp.IsBlank(S)) {
                    Parts = tp.Split(S, ' ', true);
                    A = A.concat(Parts);
                }
            }

            for (i = 0, ln = A.length; i < ln; i++) {
                this.RemoveClass(A[i]);
            }
        };

        _.ToBody = function () {
            if (this.Handle) {
                this.Document.body.appendChild(this.Handle);
            }
        };
        _.AddChild = function (Child, CssClasses) {
            /// <summary>Adds a child tp.Element. Child could be a node-type string i.e. "div", "span" etc. or a tp.Element or a dom element.</summary>
            /// <param name="Child" type="tp.Element | Element | String">A node-type string i.e. "div", "span" etc. or a tp.Element or a dom element.</param>
            /// <returns type="tp.Element">Returns the newly added child</returns>
            if (this.Handle) {

                if (tp.IsString(Child)) {
                    var el = this.Document.createElement(Child);
                    Child = new Class(el);
                }

                if ((Child instanceof Class) && Child.Handle) {
                    this.Handle.appendChild(Child.Handle);
                }

                if (tp.IsElement(Child.Handle)) {
                    tp.AddClasses(Child.Handle, CssClasses);
                }
            }

            return Child;

        };
        _.AddDiv = function (CssClasses) {
            var o = tp.Element ? new tp.Element() : 'div';
            return this.AddChild(o, CssClasses);
        };
        _.AddSpan = function (CssClasses) {
            return this.AddChild('span', CssClasses);
        };
        _.Insert = function (Child, IndexOrNode) {
            if (this.Handle) {
                if (tp.IsString(Child)) {
                    var el = this.Document.createElement(Child);
                    Child = new Class(el);
                }

                if ((Child instanceof Class) && Child.Handle) {
                    var beforeElement = null;

                    if (tp.IsNumber(IndexOrNode) && (IndexOrNode >= 0)) {
                        if ((IndexOrNode === 0) && (this.Handle.childNodes.length === 0)) {
                            this.Handle.appendChild(Child.Handle);
                            return;
                        }

                        beforeElement = this.Handle.childNodes[IndexOrNode];
                    } else if ((IndexOrNode instanceof Class) && IndexOrNode.Handle) {
                        beforeElement = IndexOrNode.Handle;
                    }

                    if (beforeElement) {
                        this.Handle.insertBefore(Child.Handle, beforeElement);
                    }
                }
            }


        };
        _.Remove = function (Child) {
            if (this.Handle && (Child instanceof Class)) {
                try {
                    if (Child.ParentHandle === this.Handle) {
                        this.Handle.removeChild(Child.Handle);
                    }
                } catch (e) {
                }
            }
        };
        _.RemoveAll = function () {
            if (this.Handle) {
                while (this.Handle.firstChild) {
                    this.Handle.removeChild(this.Handle.firstChild);
                }
            }
        };

        /* events and messages */
        _.On = function (EventName, Listener, Handler) {
            var S = tp.Events.ToDom(EventName);         // could be a tp.Events.XXXX constant
            if (!tp.IsSameText(S, tp.Events.Unknown)) {     // it is a dom event
                this.HookMessage(S);
            }
            base.On.call(this, EventName, Listener, Handler);
        };
        _.HookMessage = function (EventName) {
            this.HookedMessages = this.HookedMessages || [];

            var S = tp.Events.ToDom(EventName);  // could be a tp.Events.XXXX constant
            EventName = (S !== tp.Events.Unknown) ? S : EventName;
            if (!tp.ListContainsText(this.HookedMessages, EventName)) {
                tp.On(this.Handle, EventName, this);
                this.HookedMessages.push(EventName);
            }

        };
        _.HookMessages = function (MessageTypes) {
            if (this.Handle) {
                var M = MessageTypes;

                if (tp.Bf.In(tp.EventGroup.Click, M)) {
                    this.HookMessage('click');
                    this.HookMessage('dblclick');
                }
                if (tp.Bf.In(tp.EventGroup.Mouse, M)) {
                    this.HookMessage('mousedown');
                    this.HookMessage('mouseup');

                    this.HookMessage('mouseover');
                    this.HookMessage('mousemove');
                    this.HookMessage('mouseout');
                }
                if (tp.Bf.In(tp.EventGroup.Keyboard, M)) {
                    this.HookMessage('keydown');
                    this.HookMessage('keypress');
                    this.HookMessage('keyup');
                }
                if (tp.Bf.In(tp.EventGroup.Text, M)) {
                    this.HookMessage('oninput'); //oninput = TextChanged
                    this.HookMessage('onselect'); //onselect  = TextSelected
                }
                if (tp.Bf.In(tp.EventGroup.Scroll, M)) {
                    this.HookMessage('scroll');
                    this.HookMessage('mousewheel');
                    this.HookMessage('DOMMouseScroll'); // mousewheel for FF
                }
                if (tp.Bf.In(tp.EventGroup.ContextMenu, M)) {
                    this.HookMessage('contextmenu');
                }
                if (tp.Bf.In(tp.EventGroup.Size, M)) {
                    this.HookMessage('resize');
                }
                if (tp.Bf.In(tp.EventGroup.Focus, M)) {
                    this.HookMessage('activate'); // IE
                    this.HookMessage('DOMActivate'); // the others
                    this.HookMessage('focus');
                    this.HookMessage('blur'); // lost focus
                }
                if (tp.Bf.In(tp.EventGroup.Change, M)) {
                    this.HookMessage('change');
                }
                if (tp.Bf.In(tp.EventGroup.DragSource, M)) {
                    this.HookMessage('dragstart');
                    this.HookMessage('drag');
                    this.HookMessage('dragend');
                }
                if (tp.Bf.In(tp.EventGroup.DropTarget, M)) {
                    this.HookMessage('dragenter');
                    this.HookMessage('dragover');
                    this.HookMessage('dragleave');
                    this.HookMessage('drop');
                }
                if (tp.Bf.In(tp.EventGroup.Clipboard, M)) {
                    this.HookMessage('copy');
                    this.HookMessage('cut');
                    this.HookMessage('paste');
                }
            }
        };

        _.handleEvent = function (e) {
            /// <summary>
            /// For handling all DOM element events.
            /// Either events where sender (target) is this.Handle
            /// or events where sender (target) is any other object and listener is this instance.
            /// <para> Implementation of EventListener interface. </para>
            /// <para> See: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener </para>
            /// </summary>
            if (e) {
                if (e.target === this.Handle) {         // it comes from this element
                    this.OnMessage(e);                  // so, handle it as "message"                
                } else {
                    this.OnEvent(e);                    // it comes from another element
                }

                this.TriggerEvent(e);                  // inform any possible listeners
            }
        };
        _.OnMessage = function (e) {
            /// <summary>
            /// Handles DOM events of this.Handle (messages).
            /// <para> NOTE: An object that subscribes to its own Handle (this.Handle)
            /// receives notifications in this handler </para>
            /// <para> Type is one of the tp.Events constants. </para>
            /// </summary>
        };
        _.OnEvent = function (e) {
            /// <summary>
            /// This method is called automatically in two cases:
            /// <para>1. When this instance is a subscribed listener to an event of another element.
            /// Use the tp.On() method or the addEventListener() dom method in order to subscribe as a listener to an element. </para>
            /// <para>2. When this instance participates in the Bubble or in the Capture phase of an event.
            /// Use the HookMessage() method in order for this instance to be a part of the Bubble/Capture phase for any element it may contain.</para>
            /// <para>NOTE: In any case this method is called because this class implements the handleEvent() dom method. </para>
            /// <para> CAUTION: Always check the sender (target) of the event. </para>
            /// </summary>
        };
        _.TriggerEvent = function (e) {
            /// <summary>Relays an event by informing any subscribed listener.  
            /// <para>The sender (target) of the event could be: </para>
            /// <para> 1. this.Handle (considered a "message")</para>
            /// <para> 2. any other dom element to which this instance is a subscribed listener </para>
            /// <para> 3. any other dom element to which this instance participates in the Bubble or in the Capture phase of an event </para>
            /// </summary>
            /// <param name="e" type="DOM Event object"></param>

            if (!this.EventsDisabled) {
                var Type = tp.Events.ToTripous(e.type);
                this.Trigger(Type, { "e": e, "Type": Type });
                this.Trigger("AnyMessage", { "e": e, "Type": Type });
            }
        };

        _.GetContainerByClass = function (el, ElementClass) {
            /// <summary>Returns a tp.Element instance associated to a dom element, 
            /// if the tp.Element is of a specified class. Returns null if nothing is found.
            /// <para> If the initially specified dom element does not pass the condition, 
            /// the search continues down to its parent until the document.body is reached. </para>
            /// <para>NOTE: To be used from inside event handler methods 
            ///  in order to find the right tp.Element sender instance. </para>
            /// </summary>
            /// <param name="el" type="HtmlElement">The element to start the checking.</param>
            /// <param name="ElementClass" type="class">A tp.tpObject class or a descendant.</param>
            /// <returns type="tp.Element">Returns a tp.Element or null</returns>

            return tp.GetContainerByClass(el, ElementClass);
        };

        _.OnEnabledChanged = function () {
            this.Trigger('EnabledChanged', {});
        };

        /* size - layout */
        _.ScreenModeChanged = function () {
            /// <summary>Called whenever the screen size mode (small, medium, large etc) is changed.</summary>
            this.UpdateSize();
            this.PerformLayout();
            this.PropagateScreenMode();
        };
        _.ScreenSizeChanged = function () {
            /// <summary>Called whenever the viewport size changes. </summary>
            this.UpdateSize();
            this.PerformLayout();
            this.PropagateScreenSize();
        };
        _.ParentSizeChanged = function () {
            /// <summary>Should be called whenever the size of the parent element changes. </summary>
            this.UpdateSize();
        };
        _.SiblingSizeChanged = function (Sender) {
            /// <summary>Should be called by a sibling when its size changes. </summary>
            this.UpdateSize();
        };
        _.UpdateSize = function () {
            /// <summary>Called whenever the screen size mode or the viewport size changes.
            /// <para> It may be called in any other case where the size should be recalculated and applied. </para>
            /// <para> Inheritors should calculate and apply their new size, according to changes </para>
            ///</summary>

            this.PropagateSize();
        };
        _.PerformLayout = function () {
            /// <summary>Called whenever the layout size mode (small, medium, large etc) is changed.</summary>
            this.Trigger('PerformLayout', {});
        };
        _.PropagateScreenMode = function () {
            if (this.Handle) {
                this.ResizeControls();
                var i, ln, o;
                var List = this.Handle.children;
                for (i = 0, ln = List.length; i < ln; i++) {
                    o = List[i];
                    if (o.tpObject instanceof Class) {
                        o.tpObject.ScreenModeChanged();
                    }
                }
            }
        };
        _.PropagateScreenSize = function () {
            if (this.Handle) {
                this.ResizeControls();
                var i, ln, o;
                var List = this.Handle.children;
                for (i = 0, ln = List.length; i < ln; i++) {
                    o = List[i];
                    if (o.tpObject instanceof Class) {
                        o.tpObject.ScreenSizeChanged();
                    }
                }
            }
        };
        _.PropagateSize = function () {
            if (this.Handle) {
                this.ResizeControls();
                var i, ln, o;
                var List = this.Handle.children;
                for (i = 0, ln = List.length; i < ln; i++) {
                    o = List[i];
                    if (o.tpObject instanceof Class) {
                        o.tpObject.ParentSizeChanged();
                    }
                }

                if (this.InformSiblings && this.ParentHandle) {
                    List = this.ParentHandle.children;

                    for (i = 0, ln = List.length; i < ln; i++) {
                        o = List[i];
                        if ((o !== this.Handle) && (o.tpObject instanceof Class)) {
                            o.tpObject.SiblingSizeChanged(this);
                        }
                    }
                }

                this.Trigger('Resized', {});
            }
        };
        _.OnResized = function (Args) {
            this.PropagateSize();
        };
        _.ResizeControls = function () {
        };

        /* z-index */
        _.BringToFront = function () {
            if (this.Handle) {
                tp.BringToFront(this.Handle);
            }
        };
        _.SendToBack = function () {
            if (this.Handle) {
                tp.SendToBack(this.Handle);
            }
        };

        /* miscs */
        _.Focus = function () {
            if (this.Handle)
                this.Handle.focus();
        };
        _.Click = function () {
            if (this.Handle)
                this.Handle.click();
        };
        _.RandomColor = function () {
            if (this.Handle) {
                this.BackColor = tp.RandomColor();
            }
        };


        /* static */
        Class.Check = function (ElementOrSelector, ElementType, ThrowError) {
            /// <summary>Checks the ElementOrSelector to be of the specified ElementType </summary>
            /// <param name="ElementOrSelector" type="element or selector">The item to check</param>
            /// <param name="ElementType" type="string">The desired element type (nodeName)</param>
            /// <param name="ThrowError" type="boolean">If true, then an error is thrown if the check fails</param>
            /// <returns type="boolean">The result of the check</returns>

            var Result = true;
            var el = ElementOrSelector;
            var S = '';

            if (tp.IsString(el)) {
                if (tp.ListContainsText(StandardNodeTypes, el)) {
                    S = el;
                } else {
                    el = tp(el);
                }
            }
            if (tp.IsElement(el)) {
                S = el.nodeName;
            }

            Result = tp.IsSameText(ElementType, S);

            if (!Result && ThrowError) {
                throw new tp.Error('Wrong element type');
            }

            return Result;
        };
        Class.Create = function (Parent, NodeType, InputType) {
            /// <summary>
            /// Creates and returns a tp.Element instance.
            /// </summary>
            /// <param name="Parent" type="A tp.Element or dom Element">The parent of the new object. Could be null.</param>
            /// <param name="NodeType" type="string">The node type, i.e. div, table, select etc.</param>
            /// <param name="InputType" type="string">Used only when the NodeType is 'input'</param>

            if (typeof NodeType === tp.Undefined) { NodeType = 'div'; }
            if (typeof InputType === tp.Undefined) { InputType = ''; }


            var el = document.createElement(NodeType);


            if (tp.IsBlank(el.id)) {
                el.id = tp.SafeId(NodeType);
            }

            if (tp.IsSameText(NodeType, 'input') && !tp.IsBlank(InputType)) {
                el.type = InputType;
            }

            //ElementOrSelector, Parent, CssClasses, Id
            var o = new Class(Parent, null, el);
            return o;
        };
        Class.CreateTextBox = function (Parent) {
            return Class.Create(Parent, 'input', 'text');
        };
        Class.CreateComboBox = function (Parent, Items, SelectedIndex) {
            /// <summary>
            /// Creates and returns a tp.Element instance of ComboBox type (select).
            /// </summary>
            /// <param name="Parent" type="A tp.Element or dom Element">The parent of the new object. Could be null.</param>
            /// <param name="Items" type="array">Null or an array where each element is an object of the form { Text: 'Text of the option', Value: 'Value of the option' }</param>
            /// <param name="SelectedIndex" type="integer">Denotes the initially selected index of the ComboBox</param>
            if (typeof Items === tp.Undefined) { Items = null; }
            if (typeof SelectedIndex === tp.Undefined) { SelectedIndex = 0; }
            var o = Class.Create(Parent, 'select');

            if (tp.IsArray(Items)) {
                tp.ForEach(Items, function (ItemOrValue, IndexOrPropName, List) {
                    var Option = Class.Create(this, 'option');
                    Option.Html = ItemOrValue.Text;
                    Option.Attribute('value', ItemOrValue.Value);
                    if (IndexOrPropName === SelectedIndex) {
                        Option.Attribute('selected', true);
                    }
                }, o);
            }

            return o;
        };
        Class.CreateFileInputBox = function (Parent) {
            return Class.Create(Parent, 'input', 'file');
        };

        return Class;
    })(tp.tpObject);
 
 


    //#region Enumerator
    tp.Enumerator = function (A) {
        var Index = -1;
        var Data = tp.IsArray(A) ? A : [];

        this.MoveNext = function () {
            if (tp.InRange(Data, Index + 1)) {
                Index++;
                return true;
            }
            return false;
        };
        this.Reset = function () {
            Index = -1;
        };
        this.GetCurrent = function () {
            if (tp.InRange(Data, Index))
                return Data[Index];
            return null;
        };
    };
    tp.Property('Current', tp.Enumerator.prototype, function () { return this.GetCurrent(); });
    //#endregion

    //#region List
    tp.List = (function (BaseClass) {
        function Class(Source) {
            BaseClass.call(this);
            this.InitClass();
            if (Source) {
                this.Assign(Source);
            }
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        /* treat it as read-only class field (static) */
        _.tpClass = 'tp.List';

        /* fields */
        _.fEventsEnabledCounter = 0;
        _.fEvents = null;
        _.fUpdating = 0;
        _.Owner = null;

        /* properties */
        tp.Property('Count', _, function () {
            return this.length;
        });
        tp.Property('Updating', _, function () {
            return this.fUpdating > 0;
        }, function (v) {
            this.fUpdating = !!v ? this.fUpdating + 1 : this.fUpdating - 1;
            if (this.fUpdating < 0) {
                this.fUpdating = 0;
            }
            this.Changed({ Action: "Update", Item: null, Index: -1 });
        });
        tp.Property('EventsEnabled', _, function () {
            //When false (the default), calling Trigger() does NOT inform any listener
            return this.fEventsEnabledCounter > 0;
        }, function (v) {
            this.fEventsEnabledCounter = v === true ? this.fEventsEnabledCounter + 1 : this.fEventsEnabledCounter - 1;
            if (this.fEventsEnabledCounter < 0)
                this.fEventsEnabledCounter = 0;
        });
        tp.Property('EventsDisabled', _, function () { return !this.EventsEnabled; }); // because we borrow event methods from tpObject

        /* protected */
        _.DoInsert = function (Index, Item) {
            if (Index >= this.length) {
                this.push(Item)
            } else {
                this.splice(Index, 0, Item);
            }
        };
        _.DoRemoveAt = function (Index) {
            this.splice(Index, 1);
        };
        _.DoClear = function () {
            this.length = 0;
        };

        /*  methods */
        _.InitClass = function () {
            /// <summary>Initializes the 'static' and 'read-only' class fields, such as tpClass etc.</summary>
        };

        _.On = tp.tpObject.prototype.On;
        _.Off = tp.tpObject.prototype.Off;
        _.Trigger = tp.tpObject.prototype.Trigger;
        _.HasListeners = tp.tpObject.prototype.HasListeners;
        _.IsSameClass = tp.tpObject.prototype.IsSameClass;

        _.handleEvent = function (e) {
            /// <summary>
            /// For handling all DOM element events.
            /// Either when this is a DOM element and the sender (target) of the event is this.Handle
            /// or when the sender (target) of the event is any other object and listener is this instance.
            /// <para> NOTE: This is an implementation of EventListener interface. </para>
            /// <para> See: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener </para>
            /// </summary>
        };

        _.Changing = function (Args) {
            if (!this.Updating) {
                this.Trigger("Changing", Args);
            }
        };
        _.Changed = function (Args) {
            if (!this.Updating) {
                this.Trigger("Changed", Args);
            }
        };

        _.Clear = function () {
            var Args = {
                Action: "Clear",
                "Index": -1,
                Cancel: false
            };

            if (this.EventsEnabled)
                this.Changing(Args);

            if (!Args.Cancel) {
                this.DoClear();
                this.Changed(Args);
            }
        };
        _.Assign = function (Source) {
            if (Source) {
                
                var Args = {
                    Action: "Assign",
                    "Source": Source,
                    Cancel: false
                };

                if (this.EventsEnabled)
                    this.Changing(Args);
                    
                if (!Args.Cancel) {

                    this.DoClear();

                    if (tp.IsArray(Source) || this.IsSameClass(Source)) {
                        for (var i = 0, ln = Source.length; i < ln; i++) {
                            this.push(Source[i]);
                        }
                    }

                    if (this.EventsEnabled)
                        this.Changed(Args);
                }

            }
        };
        _.AddRange = function (Items) {
            var Args = {
                Action: "AddRange",
                "Source": Items,
                Cancel: false
            };

            if (this.EventsEnabled)
                this.Changing(Args);

            if (!Args.Cancel) {

                for (var i = 0, ln = Items.length; i < ln; i++) {
                    this.push(Items[i]);
                }

                if (this.EventsEnabled)
                    this.Changed(Args);
            }

        };

        _.Add = function (Item) {
            this.Insert(this.length, Item);
        };
        _.Insert = function (Index, Item) {

            var Args = {
                Action: "Insert",
                "Item": Item,
                "Index": Index,
                Cancel: false
            };

            if (this.EventsEnabled)
                this.Changing(Args);

            if (!Args.Cancel) {
                this.DoInsert(Index, Item);
                this.Changed(Args);
            }


            return Item;
        };
        _.Remove = function (Item) {
            var Index = this.indexOf(Item);
            if (Index !== -1) {
                this.RemoveAt(Index);
            }
        };
        _.RemoveAt = function (Index) {
            var Args = {
                Action: "Remove",
                "Item": this[Index],
                "Index": Index,
                Cancel: false
            };

            if (this.EventsEnabled)
                this.Changing(Args);

            if (!Args.Cancel) {
                this.DoRemoveAt(Index);
                this.Changed(Args);
            }
        };

        _.Contains = function (Item) {
            return this.indexOf(Item) !== -1;
        };
        _.IndexOf = function (Item) {
            return this.indexOf(Item);
        };
        _.ToArray = function () {
            return this.slice();
        };

        // 'by' methods 
        _.FindBy = function (Prop, Value) {
            var Index = this.IndexBy(Prop, Value);
            return Index !== -1 ? this[Index] : null;
        };
        _.ContainsBy = function (Prop, Value) {
            return this.IndexBy(Prop, Value) !== -1;
        };
        _.IndexBy = function (Prop, Value) {
            for (var i = 0, ln = this.length; i < ln; i++) {
                if (this[i][Prop] === Value)
                    return i;
            }
            return -1;
        };
        _.RemoveBy = function (Prop, Value) {
            var Index = this.IndexBy(Prop, Value);
            if (Index !== -1) {
                this.RemoveAt(Index);
            }
        };

        _.GetEnumerator = function () {
            return new tp.Enumerator(this);
        };
 
        return Class;
    })(Array);
    //#endregion

    //#region Collection
    tp.Collection = (function (BaseClass) {
        function Class() {
            BaseClass.call(this);
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.ItemClass = null;

        /*  methods */
        _.InitClass = function () {
            this.tpClass = 'tp.Collection';
            this.ItemClass = null;
        };

        _.DoInsert = function (Index, Item) {
            base.DoInsert.call(this, Index, Item);
            Item.Collection = this;
        };
        _.DoRemoveAt = function (Index) {
            this[Index].Collection = null;
            base.DoRemoveAt.call(this, Index);
        };
        _.DoClear = function () {
            for (var i = 0, ln = this.length; i < ln; i++) {
                this[i].Collection = null;
            }
            base.DoClear.call(this);
        };

        _.CreateItem = function () {
            return this.ItemClass ? new this.ItemClass() : null;
        };
        _.Assign = function (Source) {
            this.DoClear();
            if (Source) {
                var A = null;
                if (tp.IsArray(Source) || this.IsSameClass(Source))
                    A = Source;

                if (A) {
                    var Item;
                    for (var i = 0, ln = A.length; i < ln; i++) {

                        if (A[i].Clone) {
                            Item = A[i].Clone();
                        } else {
                            Item = new this.ItemClass();
                            if (Item.Assign)
                                Item.Assign(A[i]);
                            else
                                tp.MergePropsDeep(Item, A[i]);
                        }

                        this.Add(Item);
                    }
                }
            }
        };

        return Class;
    })(tp.List);
    //#endregion

    //#region StringBuilder
    tp.StringBuilder = (function (BaseClass) {
        function Class(Text, LineBreak) {
            BaseClass.call(this);
            this.fData = Text || '';
            this.fLB = LineBreak || '\n';
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.fData = '';
        _.fLB = '\n'; // Line Break, should be \n or <br />

        tp.Property('Length', _, function () {
            return this.fData.length;
        });
        tp.Property('IsEmpty', _, function () {
            return this.fData.length === 0;
        });
        tp.Property('LineBreak', _, function () {
            return this.fLB;
        }, function (v) {
            this.fLB = v;
        });

        _.Clear = function (v) {
            this.fData = '';
        };
        _.Append = function (v) {
            if (tp.IsValid(v))
                this.fData += v.toString();
        };
        _.AppendLine = function (v) {
            this.Append(v);
            this.Append(this.fLB);
        };
        _.Insert = function (Index, v) {
            if (tp.IsValid(v)) {
                v = v.toString();
                this.fData = tp.InsertText(this.fData, Index, v);
            }
        };
        _.Replace = function (OldValue, NewValue) {
            this.fData = tp.ReplaceAll(this.fData, OldValue, NewValue);
        };
        _.ToString = function () {
            return this.fData;
        };

        return Class;
    })(Object);
    //#endregion

    tp.StringMap = (function (BaseClass) {
        function Class() {
            /// <summary> A map (associative array) where the Key is string and the Value could be any type.</summary>
            BaseClass.call(this);
            this.fItems = [];
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        /* fields */
        _.fItems = [];

        /* properties */
        tp.Property('Count', _, function () { return this.fItems.length; });

        /* methods */
        _.Clear = function () {
            /// <summary>Empties the internal array of items</summary>
            this.fItems = [];
        };
        _.IndexOf = function (Key) {
            /// <summary>Returns the index of a key</summary>
            for (var i = 0, ln = this.fItems.length; i < ln; i++) {
                if (tp.IsSameText(Key, this.fItems[i].Key)) {
                    return i;
                }
            }

            return -1;
        };
        _.Contains = function (Key) {
            /// <summary>Returns true if a key exists in the internal array</summary>
            return this.IndexOf(Key) !== -1;
        };

        _.Get = function (Key, Default) {
            /// <summary>Returns the value associated to a key, if any, else Default</summary>
            var Index = this.IndexOf(Key);
            if (Index !== -1) {
                return this.fItems[Index].Value;
            }

            return Default || null;
        };
        _.Set = function (Key, Value) {
            /// <summary>Sets a key to a value. Creates the entry if the specified key does not exist in the internal array</summary>
            var Index = this.IndexOf(Key);
            if (Index !== -1) {
                this.fItems[Index].Value = Value;
            } else {
                o = {
                    Key: Key,
                    Value: Value,
                };

                this.fItems.push(o);
            }
        };

        _.ByIndex = function (Index) {
            /// <summary>Returns the value of an item found in specified index in the internal array, if index is in range, else null</summary>
            if ((Index >= 0) && (Index <= this.fItems.length - 1)) {
                return this.fItems[Index].Value;
            }

            return null;
        };
        _.Remove = function (Key) {
            /// <summary>Removes an entry by key</summary>
            var Index = this.IndexOf(Key);
            if (Index !== -1) {
                tp.ListRemove(this.fItems, Index);
            }
        };
        _.Keys = function () {
            /// <summary>Returns an array containing the keys</summary>
            var Result = [];
            for (var i = 0, ln = this.fItems.length; i < ln; i++) {
                Result.push(this.fItems[i].Key);
            }
            return Result;
        };
        _.Values = function () {
            /// <summary>Returns an array containing the values</summary>
            var Result = [];
            for (var i = 0, ln = this.fItems.length; i < ln; i++) {
                Result.push(this.fItems[i].Value);
            }
            return Result;
        };

        return Class;
    })(Object);

    //#region KeyValue
    tp.KeyValue = (function (BaseClass) {
        function Class(Key, Value) {
            BaseClass.call(this);
            if (typeof Value === tp.Undefined) { Value = null; }
            this.Key = Key;
            this.Value = Value;
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;
        return Class;
    })(Object);
    //#endregion

    //#region Dictionary Args
    tp.Dictionary = (function (BaseClass) {
        function Class() {
            BaseClass.call(this);
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.Set = function (Key, Value) {
            this[Key] = Value;
        };
        _.Remove = function (Key) {
            if (this.hasOwnProperty(Key) && (typeof this[Key] !== 'function'))
                delete this[Key];
        };
        _.Keys = function () {
            var Result = [];
            for (var Key in this) {
                if (typeof this[Key] !== 'function')
                    Result.push(Key);
            }
            return Result;
        };
        _.Values = function () {
            var Result = [];
            for (var Key in this) {
                if (typeof this[Key] !== 'function')
                    Result.push(this[Key]);
            }
            return Result;
        };
        _.ContainsKey = function (Key) {
            return ((typeof this[Key] === tp.Undefined) && (typeof this[Key] !== 'function')) ? false : true;
        };
        _.ValueOf = function (Key, Default) {
            if (this.hasOwnProperty(Key) && !tp.IsEmpty(Key) && (typeof this[Key] !== 'function')) {
                return this[Key];
            }
            return Default || null;
        };
        return Class;
    })(Object);
    tp.Args = tp.Dictionary;
    //#endregion

    //#region NameValueStringList
    tp.NameValueStringList = (function (BaseClass) {
        function Class(Source) {
            BaseClass.call(this);
            this.fItems = [];

            if (tp.IsValid(Source)) {
                this.Assign(Source);
            }
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.fItems = [];

        tp.Property('Text', _, function () {
            return this.fItems.join('\n');
        }, function (v) {
            this.Clear();
            if (!tp.IsBlank(v)) {
                var Sep = tp.ContainsText(v, '\r\n') ? '\r\n' : '\n';
                var Lines = tp.Split(v, Sep, true);
                for (var i = 0, ln = Lines.length; i < ln; i++) {
                    if (!tp.IsBlank(Lines[i])) {
                        this.Add(Lines[i]);
                    }
                }
            }
        });
        tp.Property('Count', _, function () {
            return this.fItems.length;
        });
        tp.Property('CommaText', _, function () {
            return this.fItems.join(',');
        });
        tp.Property('Names', _, function () {
            var Result = [];

            var o;
            for (var i = 0, ln = this.fItems.length; i < ln; i++) {
                o = this.Split(this.fItems[i]);
                Result.push(o.Name);
            }

            return Result;
        });

        _.Clear = function () {
            this.fItems.length = 0;
        };
        _.Assign = function (Source) {
            this.Clear();

            var i, ln;

            if (tp.IsArray(Source)) {
                this.fItems = tp.ListClone(Source);
            } else if (Source instanceof Class) {
                this.fItems = tp.ListClone(Source.fItems);
            } else if (Source instanceof tp.Dictionary) {
                var Keys = Source.Keys();
                var Values = Source.Values();
                for (i = 0, ln = Keys.length; i < ln; i++) {
                    this.Add(Keys[i], Values[i]);
                }
            } else if (Source instanceof tp.DataTable) {
                for (i = 0, ln = Source.RowCount; i < ln; i++) {
                    this.Add(Source.Rows[i].Get(0), Source.Rows[i].Get(1));
                }
            } else if (tp.IsString(Source)) {
                this.Text = Source;
            }

        };
        _.Clone = function () {
            var Result = new Class();
            Result.fItems = tp.ListClone(this.fItems);
            return Result;
        };

        _.AddLine = function (Line) {
            this.InsertLine(this.fItems.length, Line);
        };
        _.InsertLine = function (Index, Line) {
            if (tp.IsBlank(Line))
                throw "Item can not be null, empty, or white space";

            var o = this.Split(Line);

            this.Insert(Index, o.Name, o.Value);
        };
        _.RemoveLine = function (Line) {
            this.RemoveAt(this.IndexOfLine(Line));
        };
        _.IndexOfLine = function (Line) {
            /// <summary>
            /// Returns the index of Item in list, if there, else -1.
            /// <para>NOTE: Case insensitive</para>
            /// </summary>
            for (var i = 0, ln = this.fItems.length; i < ln; i++) {
                if (tp.IsSameText(this.fItems[i], Line))
                    return i;
            }
            return -1;
        };
        _.ContainsLine = function (Line) {
            /// <summary>
            /// Returns true if Item exists in list.
            /// <para>NOTE: Case insensitive</para>
            /// </summary>
            return this.IndexOfLine(Line) !== -1;
        };
        _.Add = function (Name, Value) {
            this.Insert(this.fItems.length, Name, Value);
        };
        _.Insert = function (Index, Name, Value) {
            if (tp.IsBlank(Name))
                throw "Name can not be null, empty, or white space";

            if (!tp.IsBlank(Value) && this.Contains(Name))
                throw tp.Format("Name already exists in list: {0}", Name);

            tp.ListInsert(this.fItems, Index, this.Concat(Name, Value));
        };
        _.IndexOf = function (Name) {
            /// <summary>
            /// Returns the index of Name in list.
            /// <para>NOTE: Case insensitive</para>
            /// </summary>
            var o;
            for (var i = 0, ln = this.fItems.length; i < ln; i++) {
                o = this.Split(this.fItems[i]);
                if (tp.IsSameText(Name, o.Name))
                    return i;
            }

            return -1;
        };
        _.Contains = function (Name) {
            /// <summary>
            /// Returns true if Name exists in list.
            /// <para>NOTE: Case insensitive</para>
            /// </summary>
            return this.IndexOf(Name) !== -1;
        };
        _.Remove = function (Name) {
            this.RemoveAt(this.IndexOf(Name));
        };
        _.RemoveAt = function (Index) {
            if ((Index >= 0) && (Index <= this.fItems.length - 1))
                tp.ListRemoveAt(this.fItems, Index);
        };

        _.ToArray = function () {
            return tp.ListClone(this.fItems);
        };
        _.ToDictionary = function () {
            var Result = new tp.Dictionary();
            var o;
            for (var i = 0, ln = this.fItems.length; i < ln; i++) {
                o = this.Split(this.fItems[i]);
                Result.Set(o.Name, o.Value);
            }
            return Result;
        };
        _.ToTable = function () {
            var Table = new tp.DataTable('NameValue');
            Table.AddColumn('Name').Required = true;
            Table.AddColumn('Value');

            var o;
            for (var i = 0, ln = this.fItems.length; i < ln; i++) {
                o = this.Split(this.fItems[i]);
                Table.AddRow([o.Name, o.Value]);
            }

            Table.AcceptChanges();

            return Table;
        };

        _.NameAt = function (Index) {
            var o = this.Split(this.fItems[Index]);
            return o.Name;
        };
        _.ValueAt = function (Index) {
            var o = this.Split(this.fItems[Index]);
            return o.Value;
        };
        _.Value = function (Name, v) {
            var Index = this.IndexOf(Name);

            if (tp.IsEmpty(v)) {    // get
                return tp.InRange(this.fItems, Index) ? this.ValueAt(Index) : '';
            } else {                // set
                if (Index === -1) {
                    this.Add(Name, v.toString());
                } else {
                    this.fItems[Index] = this.Concat(Name, v);
                }
            }
        };

        _.Split = function (Line) {
            var Result = {
                Name: '',
                Value: ''
            };

            if (!tp.IsBlank(Line)) {
                var Parts = tp.Split(Line, '=');
                if ((Parts !== null) && (Parts.length > 0)) {
                    Result.Name = tp.Trim(Parts[0]);
                    if (Parts.length > 1)
                        Result.Value = tp.Trim(Parts[1]);
                }
            }

            return Result;
        };
        _.Concat = function (Name, Value) {
            if (!tp.IsBlank(Value)) {
                if (!tp.IsBlank(Name))
                    return tp.Format("{0}={1}", Name, Value);
                else
                    return Value;
            }

            return !tp.IsBlank(Name) ? Name : '';
        };
        _.GetEnumerator = function () {
            return new tp.Enumerator(this.fItems);
        };

        _.LocalizeValues = function () {
            if (!tp.IsValid(tp.Res))
                return;

            var self = this;
            var E = this.GetEnumerator();
            var o;

            var GS = null;
            var OnResult = null;

            GS = function () {
                if (E.MoveNext()) {
                    o = self.Split(E.Current);
                    tp.Res.GS(o.Name, OnResult, null, o.Value);
                }
            };

            OnResult = function (Value, UserTag) {
                self.Value(o.Name, Value);
                GS();
            };

            GS();


        };

        return Class;
    })(Object);
    //#endregion

    //#region NamedItem
    tp.NamedItem = (function (BaseClass) {
        function Class(Name) {
            BaseClass.call(this);
            this.tpClass = 'tp.NamedItem';

            if (tp.IsString(Name))
                this.fName = Name;
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.fName = '';

        _.get_Name = function () {
            return this.fName;
        };
        _.set_Name = function (v) {
            this.fName = v;
        };

        tp.Property('Name', _, function () {
            return this.get_Name();
        }, function (v) {
            this.set_Name(v);
        });

        _.Assign = function (Source) {
            this.Name = Source.Name;
        };

        return Class;
    })(tp.tpObject);
    //#endregion

    //#region NamedItems
    tp.NamedItems = (function (BaseClass) {
        function Class() {
            BaseClass.call(this);
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        /*  methods */
        _.InitClass = function () {
            this.tpClass = 'tp.NamedItems';
            this.ItemClass = tp.NamedItem;
        };

        _.CreateItem = function (Name) {
            var Result = base.CreateItem.call(this);
            Result.Name = Name;
            return Result;
        };
        _.Add = function (NameOrItem) {
            if (tp.IsString(NameOrItem)) {
                NameOrItem = this.CreateItem(NameOrItem);
            }
            return base.Add.call(this, NameOrItem);
        };
        _.Insert = function (Index, NameOrItem) {
            if (tp.IsString(NameOrItem)) {
                NameOrItem = this.CreateItem(NameOrItem);
            }
            return base.Insert.call(this, Index, NameOrItem);
        };
        _.Remove = function (NameOrItem) {
            var Index = this.IndexOf(NameOrItem);
            if (Index !== -1) {
                this.RemoveAt(Index);
            }
        };
        _.Contains = function (NameOrItem) {
            return this.IndexOf(NameOrItem) !== -1;
        };
        _.IndexOf = function (NameOrItem) {
            if (tp.IsString(NameOrItem)) {
                return this.IndexBy('Name', NameOrItem);
            }
            return base.IndexOf.call(this, NameOrItem);
        };
        _.Find = function (Name) {
            return this.FindBy('Name', Name);
        };

        return Class;
    })(tp.Collection);
    //#endregion

    //#region Descriptor
    tp.Descriptor = (function (BaseClass) {
        function Class(Name) {
            BaseClass.call(this, Name);
            this.tpClass = 'tp.Descriptor';
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.fAlias = '';
        _.fTitle = '';
        _.fTitleKey = '';

        _.get_Alias = function () {
            return tp.IsBlank(this.fAlias) ? this.Name : this.fAlias;
        };

        tp.Property('Alias', _, _.get_Alias, function (v) { this.fAlias = v; });
        tp.Property('Title', _, function get_Title() {
            return !tp.IsBlank(this.fTitle) ? this.fTitle : this.Name;
        }, function set_Title(v) {
            this.fTitle = v;
        });
        tp.Property('TitleKey', _, function () {
            return tp.IsBlank(this.fTitleKey) ? this.Name : this.fTitleKey;
        }, function (v) {
            this.fTitleKey = v;
        });

        _.Assign = function (Source) {
            base.Assign.call(this, Source);

            this.Title = Source.Title;
            this.TitleKey = Source.TitleKey;
            this.Alias = Source.Alias;
        };

        // static
        Class.FindByAlias = function (Alias, List) {
            for (var i = 0, ln = List.length; i < ln; i++) {
                if (tp.IsSameText(Alias, List[i].Alias))
                    return List[i];
            }
            return null;
        };

        return Class;
    })(tp.NamedItem);
    //#endregion
 

    tp.Promises = (function () {
        function Class() {
            /// <summary>Static class for handling promises</summary>
            throw new Error("Can NOT instantiate a static class");
        }

        var _ = Class;

        var Call = function (Func, Args, Context) {
            if (tp.IsFunction(Func)) {
                if (!tp.IsEmpty(Context))
                    return Func.call(Context, Args);
                else
                    return Func(Args);
            }

            return null;
        };

        _.Exec = function (Func, Info, Context) {
            /// <summary>Executes a function in a promise. Returns the promise.</summary>
            /// <param name="Func" type="function(Info)">A callback function, perhaps a bound function, to be called from inside the promise.</param>
            /// <param name="Info" type="Object">Optional. User defined object, it is passed to Func</param>
            /// <param name="Context" type="Object">Optional. The context (this) for the callback. Pass null if the callback is a bound function</param>
            /// <returns type="Promise">Returns a promise.</returns>
            var ExecutorFunc = function (Resolve, Reject) {
                try {
                    Call(Func, Info, Context);
                    Resolve(Info);
                } catch (e) {
                    Reject(e);
                }
            };

            var Result = new Promise(ExecutorFunc);
            return Result;
        };
        _.Chain = function (ShowSpinner, FuncList, Info, Context, OnDone, OnError) {
            /// <summary>Executes in chain (next is callled ONLY if the previous call is completed) a series of functions as Promises.</summary>
            /// <param name="ShowSpinner" type="Boolean">If true then a spinner overlay div is displayed.</param>
            /// <param name="FuncList" type="Array of function(Info)">The list of functions, perhaps bound functions, to call</param>
            /// <param name="Info" type="Object">Optional. User defined object, it is passed each function in FuncList</param>
            /// <param name="Context" type="Object">Optional. The context (this) for the FuncList functions and the two callbacks. Pass null if any of the callbacks is a bound function</param>
            /// <param name="OnDone" type="function(Info)">Optional. Perhaps a bound function. Called when all promises are succeeded.</param>
            /// <param name="OnError" type="function(e or Info)">Optional. Perhaps a bound function. Called when a promise fails</param>
            /// <returns type="Promise">Returns the last executed promise</returns>

            Info = Info || {};

            var Spinner = function (Flag) {
                if (ShowSpinner) {
                    tp.Spinner(Flag);
                }
            };

            if (!tp.IsArray(FuncList)) {
                FuncList = [FuncList];
            }

            Spinner(true);

            var CallBack = function (PreviousPromise, Func) {
                return PreviousPromise.then(function () {
                    return Call(Func, Info, Context);
                });
            };

            var Start = Promise.resolve();

            var Result = FuncList.reduce(CallBack, Start)
              .then(function () {
                  Call(OnDone, Info, Context);
              }).then(function () {
                  Spinner(false);
              }).catch(function (e) {
                  tp.SpinnerForceHide();
                  _.HandleError(e, null, OnError);
              });

            return Result;
        };
        _.All = function (ShowSpinner, FuncList, Info, Context, OnDone, OnError) {
            /// <summary> Executes simultaneously (NOT one after the other) a series of functions as Promises and return a Promise.</summary>
            /// <param name="ShowSpinner" type="Boolean">If true then a spinner overlay div is displayed.</param>
            /// <param name="FuncList" type="Array of function(Info)">The list of functions, perhaps bound functions, to call</param>
            /// <param name="Info" type="Object">Optional. User defined object, it is passed each function in FuncList</param>
            /// <param name="Context" type="Object">Optional. The context (this) for the FuncList functions and the two callbacks. Pass null if any of the callbacks is a bound function</param>
            /// <param name="OnDone" type="function(Info)">Optional. Perhaps a bound function. Called when all promises are succeeded.</param>
            /// <param name="OnError" type="function(e or Info)">Optional. Perhaps a bound function. Called when a promise fails</param>
            /// <returns type="Promise">Returns a Promise that resolves when all of the promises have resolved, or rejects with the reason of the first passed promise that rejects.</returns>


            Info = Info || {};

            var Spinner = function (Flag) {
                if (ShowSpinner) {
                    tp.Spinner(Flag);
                }
            };

            if (!tp.IsArray(FuncList)) {
                FuncList = [FuncList];
            }

            var A = FuncList.map(function (Func) {
                return Call(Func, Info, Context);
            });

            Spinner(true);

            var Result = Promise.all(A)
              .then(function () {
                  Call(OnDone, Info, Context);
              }).then(function () {
                  Spinner(false);
              }).catch(function (e) {
                  tp.SpinnerForceHide();
                  _.HandleError(e, null, OnError);
              });

            return Result;
        };

        _.HandleError = function (e, Context, OnError) {
            /// <summary>Used in a promise catch() function, in order to handle an error. It actually displays the error text in a dialog box.</summary>
            /// <param name="e" type="Any">The reason of the error. Could be an instance of Error, Event (error event), tp.AjaxArgs or string</param>
            /// <param name="Context" type="Object">Optional. The context (this) for the OnError() callback.</param>
            /// <param name="OnError" type="function(e)">Optional. Could be a bound function.</param>

            tp.SpinnerForceHide();
            try {
                var S = _.ErrorText(e);
                tp.ErrorNote(S);
            } catch (e) {
            }

            Call(OnError, e, Context);
        };
        _.ErrorText = function (e) {
            /// <summary>Returns the error text for display purposes</summary>
            /// <param name="e" type="Any">The reason of the error. Could be an instance of Error, Event (error event), tp.AjaxArgs or string</param>
            /// <returns type="String">Returns the text message of the error.</returns>
            if (e instanceof tp.AjaxArgs) {
                var Args = e;

                if (Args.Result === false) {
                    var S = Args.ResponseText || '';
                    S = tp.Trim(S);
                    if (tp.ContainsText(S, '</html>'))
                        return S;
                    if (!tp.IsBlank(Args.ErrorText))
                        return Args.ErrorText;
                }

                return 'Unkown error';
            }

            return tp.ExceptionText(e);
        };

        return Class;
    })();



    //#region AjaxDefaults
    tp.AjaxDefaults = {
        Method: 'POST',
        Async: true,
        Data: null,
        Timeout: 0,
        ContentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        OnSuccess: null,
        OnFailure: null,
    };
    //#endregion

    //#region AjaxArgs
    tp.AjaxArgs = (function (BaseClass) {
        function Class(SourceArgs) {
            BaseClass.call(this);
            SourceArgs = SourceArgs || tp.AjaxDefaults;
            
            for (var Prop in SourceArgs) {
               this[Prop] = SourceArgs[Prop];
            }

        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.Method = "POST";
        _.Async = true;                     
        _.Data = null;                      // the data to send
        _.Timeout = 0;
        _.ContentType = 'application/x-www-form-urlencoded; charset=UTF-8';
        _.Context = null;                   // context for calling the two callbacks
        _.OnSuccess = null;                 // function(Args: tp.AjaxArgs)
        _.OnFailure = null;                 // function(Args: tp.AjaxArgs)

        _.Url = '';
        _.XHR = null;                       // XMLHttpRequest
        _.ErrorText = '';                   // the XMLHttpRequest.statusText in case of an error
        _.ResponseText = '';                // the XMLHttpRequest.responseText in any case (could be null though in case of an error)
        _.Result = false;                   // true if ajax call succeeded

        _.ResponseData = {
            Result: false,
        },

        _.Tag = null;                       // a user defined value

        return Class;
    })(Object);
    //#endregion
     
    tp.Ajax = (function () {

        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }

        var _ = Class;

        var Succeeded = function (XHR) {
            /* from: http://help.dottoro.com/ljspgwvf.php */
            return (XHR) && (XHR.status === 0 || (XHR.status >= 200 && XHR.status < 300) || XHR.status === 304 || XHR.status === 1223);
        };
        var Exec = function (Url, Args) {
            Args = Args || {};
            var IsArgs = (Args instanceof tp.AjaxArgs);
            if (IsArgs === false)
                Args = new tp.AjaxArgs(Args);


            Url = !tp.IsBlank(Url)? Url: Args.Url;
            Args.Url = Url;

            var Method = Args.Method || tp.AjaxDefaults.Method;
            var Async = tp.IsBoolean(Args.Async) ? Args.Async : tp.AjaxDefaults.Async;
            var Timeout = !tp.IsEmpty(Args.Timeout)? Args.Timeout: tp.AjaxDefaults.Timeout;
            var ContentType = Args.ContentType || tp.AjaxDefaults.ContentType;
            var Context = Args.Context;
            var Data = Args.Data;
            var EncodeArgs = tp.IsBoolean(Args.EncodeArgs)? Args.EncodeArgs : true;
            var UserTag = Args.UserTag || -1;
            Args.OnSuccess = Args.OnSuccess || tp.AjaxDefaults.OnSuccess;
            Args.OnFailure = Args.OnFailure || tp.AjaxDefaults.OnFailure;

            var IsPost = Method.toUpperCase() === "POST";
            Url = Url.toLowerCase();
            Url = encodeURI(Url);

            if (EncodeArgs && !tp.IsEmpty(Data)) {  // see: http://stackoverflow.com/questions/18381770/does-ajax-post-data-need-to-be-uri-encoded
                Data = tp.EncodeArgs(Data);
            }

            if (!IsPost && !tp.IsEmpty(Data)) {
                Url += '?' + Data;
            }

            // create
            var XHR = new XMLHttpRequest();
            Args.XHR = XHR;

            // open
            //XHR.open(Method, Url, Async);
            //if (Async) {
            //    XHR.timeout = Timeout;
            //}

            var OnError = function (e) {
                Args.ResponseText = XHR.responseText;

                var List = ['Ajax call failed. Url: ' + Url];

                if (tp.IsEmpty(e)) {
                    List.push('Status Text: ' + XHR.statusText);
                } else if (e instanceof ProgressEvent) {
                    List.push('Ajax call failed because of a failure on the network level');
                } else {
                    List.push('Error Text: ' + tp.ExceptionText(e));                    
                }
                Args.ErrorText = List.join('\n');

                if (tp.IsFunction(Args.OnFailure)) {
                    Args.OnFailure.call(Context, Args);
                }
            };

            // set events
            XHR.onload = function () {
                if (XHR.readyState === XMLHttpRequest.DONE) {
                    Args.ResponseText = XHR.responseText;
                    if (Succeeded(XHR)) {
                        Args.Result = true;
                        if (tp.IsFunction(Args.OnSuccess)) {
                            Args.OnSuccess.call(Context, Args);
                        }
                    } else {
                        OnError();
                    }
                }
            };
            XHR.onerror = function (e) {
                OnError(e);
            };


            try {
                XHR.open(Method, Url, Async);

                if (Async) {
                    XHR.timeout = Timeout;
                }

                // headers
                XHR.setRequestHeader('Content-Type', ContentType);
                XHR.setRequestHeader("Accept", "*/*");
                XHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // invalid in cross-domain call
                if (Args.AntiForgeryToken) {
                    XHR.setRequestHeader("__RequestVerificationToken", Args.AntiForgeryToken);
                }


                Data = IsPost ? Data : null;

                // send         
                XHR.send(Data);
            } catch (e) {
                OnError(e);
            }

            return Args;
        };
 

        _.Promise = function (Url, Args) {
            /// <summary>Executes an ajax call as a Promise, that is, it is a thenable method.
            /// <para> The Args parameter may contain OnSuccess/OnFailure callbacks that are called as expected, although this function is a thenable one. </para>
            /// </summary>
            /// <param name="Url" type="String">The Url to call, e.g. /MyController/MyAction </param>
            /// <param name="Args" type="tp.AjaxArgs or Object">The ajax arguments. It may contain OnSuccess/OnFailure callbacks that are called as expected, although this function is a thenable one.</param>
            /// <returns type="Promise">Returns the Promise instance</returns>

            Args = Args || {};

            var Context = Args.Context || null;
            var OnSuccess = Args.OnSuccess || null;
            var OnFailure = Args.OnFailure || null;

            // ------------------------------------------
            var ExecutorFunc = function (Resolve, Reject) {
                Args.Context = null;
                Args.OnSuccess = function SuccessFunc(Args) {
                    if (tp.IsFunction(OnSuccess)) {
                        OnSuccess.call(Context, Args);
                    }
                    Resolve(Args);
                };
                Args.OnFailure = function FailureFunc(Args) {
                    //if (tp.IsFunction(OnFailure)) {
                    //    OnFailure.call(Context, Args);
                    //}
                    tp.Promises.HandleError(Args, Context, OnFailure);
                    Reject(Args);
                };

                Exec(Url, Args);
            };
            // ------------------------------------------
            var Result = new Promise(ExecutorFunc);
            return Result;
        };
        _.GetPromise = function (Url, Data, Context, OnSuccess, OnFailure) {
            var Args = new tp.AjaxArgs();
            Args.Url = Url;
            Args.Method = 'GET';
            Args.Data = Data;

            Args.Context = Context;
            Args.OnSuccess = OnSuccess;
            Args.OnFailure = OnFailure;

            return _.Promise(Url, Args);
        };
        _.PostPromise = function (Url, Data, Context, OnSuccess, OnFailure) {
            var Args = new tp.AjaxArgs();
            Args.Url = Url;
            Args.Method = 'POST';
            Args.Data = Data;

            Args.Context = Context;
            Args.OnSuccess = OnSuccess;
            Args.OnFailure = OnFailure;

            return _.Promise(Url, Args);
        };
        _.PostModelPromise = function (Url, Model, Context, OnSuccess, OnFailure) {
            var Args = _.ModelArgs(Url, Model, Context, OnSuccess, OnFailure);
            return _.Promise(Url, Args);
        };
        _.PostFormPromise = function (ElementOrSelector, Url, Context, OnSuccess, OnFailure) {
            if (!Url) {
                var form = tp(ElementOrSelector);
                Url = form.action;
            }

            var Args = new tp.AjaxArgs();
            Args.Url = Url;
            Args.Async = true;
            Args.Method = 'POST';
            Args.EncodeArgs = false;
            Args.ContentType = 'application/x-www-form-urlencoded; charset=UTF-8';
            Args.Data = tp.FormSerialize(ElementOrSelector);
            Args.Context = Context;
            Args.OnSuccess = OnSuccess;
            Args.OnFailure = OnFailure;

            return _.Promise(Url, Args);
        };
        _.PostContainerPromise = function (ElementOrSelector, Url, Context, OnSuccess, OnFailure) {
            var el = tp(ElementOrSelector);
            if (tp.IsBlank(Url) && el.nodeName.toLowerCase() === 'form') {
                Url = el.action;
            }

            return tp.SerializeInput(true, el, null,
                function (Model) {
                    return Model;
                },
                function (Error) {
                    throw Error;
                }).then(function (Model) {
                    return tp.Ajax.PostModelPromise(Url, Model, Context, OnSuccess, OnFailure);
                }).catch(function (e) {
                    var S = tp.ExceptionText(e);
                    tp.ErrorNote(S);
                });


        };

        _.PromiseAll = function (ShowSpinner, ArgsList, Context, OnDone, OnError) {
            /// <summary>Executes simultaneously (NOT one after the other) a series of ajax calls as Promises and return a Promise.</summary>
            /// <param name="ShowSpinner" type="Boolean">If true then a spinner overlay div is displayed.</param>
            /// <param name="ArgsList" type="Array of tp.AjaxArgs or Object">The ajax arguments list</param>
            /// <param name="Context" type="Object">Optional. The context for calling the two callbacks</param>
            /// <param name="OnDone" type="function(ArgsList: array of tp.AjaxArgs)">Optional. Called when all promises are succeeded.</param>
            /// <param name="OnError" type="function(ArgsList: array of tp.AjaxArgs)">Optional. Called when a promise fails</param>
            /// <returns type="Promise">Returns a Promise that resolves when all of the promises have resolved, or rejects with the reason of the first passed promise that rejects.</returns>

            var Spinner = function (Flag) {
                if (ShowSpinner) {
                    tp.Spinner(Flag);
                }
            };

            if (!tp.IsArray(ArgsList)) {
                ArgsList = [ArgsList];
            }

            var A = ArgsList.map(function (Args) {
                return _.Promise(Args.Url, Args);
            });

            Spinner(true);

            var Result = Promise.all(A)
              .then(function (ResultList) {
                  if (tp.IsFunction(OnDone))
                      OnDone.call(Context, ResultList);
              }).then(function () {
                  Spinner(false);
              }).catch(function (e) {
                  tp.SpinnerForceHide();
                  tp.Promises.HandleError(e, Context, OnError); // NO, we do NOT need this, since each tp.Ajax.Promise() displays the error
              });

            return Result;
        };
        _.PromiseChain = function (ShowSpinner, ArgsList, Context, OnDone, OnError) {
            /// <summary>Executes in chain (next is callled ONLY if the previous call is completed) a series of ajax calls as Promises.</summary>
            /// <param name="ShowSpinner" type="Boolean">If true then a spinner overlay div is displayed.</param>
            /// <param name="ArgsList" type="Array of tp.AjaxArgs or Object">The ajax arguments list</param>
            /// <param name="Context" type="Object">Optional. The context for calling the two callbacks</param>
            /// <param name="OnDone" type="function(ArgsList: array of tp.AjaxArgs)">Optional. Called when all promises are succeeded.</param>
            /// <param name="OnError" type="function(ArgsList: array of tp.AjaxArgs)">Optional. Called when a promise fails</param>
            /// <returns type="Promise">Returns the last executed promise</returns>

            var Spinner = function (Flag) {
                if (ShowSpinner) {
                    tp.Spinner(Flag);
                }
            };

            if (!tp.IsArray(ArgsList)) {
                ArgsList = [ArgsList];
            }

            Spinner(true);


            var Func = function (PreviousPromise, Args) {
                return PreviousPromise.then(function () {
                    var Result = _.Promise(Args.Url, Args);
                    return Result;
                });
            };

            var Start = Promise.resolve();

            var Result = ArgsList.reduce(Func, Start)
              .then(function (ResultList) {
                if (tp.IsFunction(OnDone))
                    OnDone.call(Context, ResultList);
            }).then(function () {
                Spinner(false);
            }).catch(function (e) {
                tp.SpinnerForceHide();
                tp.Promises.HandleError(e, Context, OnError); // NO, we do NOT need this, since each tp.Ajax.Promise() displays the error  
            });

            return Result;
        };

        

        _.Exec = function (Url, Args) {
            /// <summary>Executes an ajax call</summary>
            /// <param name="Url" type="String">The Url to call, e.g. /MyController/MyAction </param>
            /// <param name="Args" type="tp.AjaxArgs or Object">Optional. The ajax arguments</param>
            return Exec(Url, Args);
        };

        _.Post = function (Url, Data, Context, OnSuccess, OnFailure) {
            /// <summary>Gets data from the server using a HTTP POST request asynchronously.
            /// <para>Suitable when calling to a Controller Action with a number of parameters.</para>
            /// <para> Properties/fields of the Data object are matched, by name and type, to the Controller Action parameters in C# mvc.< </para>
            ///</summary>
            /// <param name="Url" type="String">A string containing the URL to which the request is sent, e.g. /App/Login </param>
            /// <param name="Data" type="Object or String">Optional. A plain object. Properties/fields of that object are matched by name and type to the Controller Action parameters in C# mvc.</param>
            /// <param name="Context" type="Object">Optional. The context (this) of the callback functions.</param>
            /// <param name="OnSuccess" type="function(Args: tp.AjaxArgs)">Optional. A callback function that is executed if the request succeeds.</param>
            /// <param name="OnFailure" type="function(Args: tp.AjaxArgs)">Optional. A callback function that is executed if the request fails.</param>
            var Args = new tp.AjaxArgs();
            Args.Async = true;
            Args.Method = 'POST';
            Args.Data = Data;

            Args.Context = Context;
            Args.OnSuccess = OnSuccess;
            Args.OnFailure = OnFailure;

            _.Exec(Url, Args);
        };
        _.PostArgs = function (Url, Data, Context, OnSuccess, OnFailure) {
            /// <summary>Creates and returns a tp.AjaxArgs instance.</summary>
            /// <para>That Args instance can be used with the Post() method. </para> 
            /// <param name="Url" type="String">A string containing the URL to which the request is sent, e.g. /App/Login </param>
            /// <param name="Data" type="Object or String">Optional. A plain object. Properties/fields of that object are matched by name and type to the Controller Action parameters in C# mvc.</param>
            /// <param name="Context" type="Object">Optional. The context (this) of the callback functions.</param>
            /// <param name="OnSuccess" type="function(Args: tp.AjaxArgs)">Optional. A callback function that is executed if the request succeeds.</param>
            /// <param name="OnFailure" type="function(Args: tp.AjaxArgs)">Optional. A callback function that is executed if the request fails.</param>
            var Args = new tp.AjaxArgs();
            Args.Url = Url;
            Args.Async = true;
            Args.Method = 'POST';
            Args.Data = Data;

            Args.Context = Context;
            Args.OnSuccess = OnSuccess;
            Args.OnFailure = OnFailure;

            return Args;
        };

        _.PostModel = function (Url, Model, Context, OnSuccess, OnFailure) {
            /// <summary>Gets data from the server using a HTTP POST request asynchronously.
            /// <para>Optionally it may post a model (plain object) as json text.</para> 
            ///</summary>
            /// <param name="Url" type="String">A string containing the URL to which the request is sent, e.g. /App/Login </param>
            /// <param name="Model" type="Object or String">Optional. A plain object or string that is sent to the server with the request as json text.</param>
            /// <param name="Context" type="Object">The context (this) of the callback functions.</param>
            /// <param name="OnSuccess" type="function(Args: tp.AjaxArgs)">A callback function that is executed if the request succeeds.</param>
            /// <param name="OnFailure" type="function(Args: tp.AjaxArgs)">A callback function that is executed if the request fails.</param>
            var Args = _.ModelArgs(Url, Model, Context, OnSuccess, OnFailure);
            _.Exec(Url, Args);
        };   
        _.ModelArgs = function (Url, Model, Context, OnSuccess, OnFailure) {
            /// <summary>Creates and returns a tp.AjaxArgs instance.
            /// <para>That Args instance can be used with the PostModel() method. </para> 
            /// <para>Optionally it may post a model (plain object) as json text.</para> 
            /// </summary>
            /// <param name="Url" type="String">A string containing the URL to which the request is sent, e.g. /App/Login </param>
            /// <param name="Model" type="Object or String">Optional. A plain object to be send as POCO model, or string that is sent to the server with the request as json text.</param>
            /// <param name="Context" type="Object">The context (this) of the callback functions.</param>
            /// <param name="OnSuccess" type="function(Args: tp.AjaxArgs)">A callback function that is executed if the request succeeds.</param>
            /// <param name="OnFailure" type="function(Args: tp.AjaxArgs)">A callback function that is executed if the request fails.</param>
            var Args = new tp.AjaxArgs();
            Args.Url = Url;
            Args.Async = true;
            Args.Method = 'POST';
            Args.EncodeArgs = false;
            Args.ContentType = 'application/json; charset=utf-8';

            if (!tp.IsEmpty(Model)) {
                if ('__RequestVerificationToken' in Model) {
                    Args.AntiForgeryToken = Model['__RequestVerificationToken'];
                    delete Model['__RequestVerificationToken'];
                }
                Args.Data = tp.IsString(Model) ? Model : JSON.stringify(Model);
            }            

            Args.Context = Context;
            Args.OnSuccess = OnSuccess;
            Args.OnFailure = OnFailure;

            return Args;
        };

        _.AddExtraArgs = function (Args, ExtraArgs) {
            /// <summary>Adds extra args to an ajax arguments object</summary>
            /// <param name="Args" type="Object | tp.AjaxArgs">The object that receives the extra args</param>
            /// <param name="ExtraArgs" type="Object">The source of exta args</param>
            /// <returns type="Object">Returns the merged args object</returns>
            Args = Args || {};
            if (!tp.IsEmpty(ExtraArgs)) {
                for (var Prop in ExtraArgs) {
                    Args[Prop] = ExtraArgs[Prop];
                }
            }

            return Args;
        };

 

        return Class;

    })();
 
 


    //#region OperationData
    tp.OperationData = (function (BaseClass) {
        function Class(OperationName) {
            BaseClass.call(this);

            this.Operation = (OperationName !== tp.Undefined) ? OperationName : '';
            this.Data = { UiMode: 'Web', OperationId: tp.Guid(), UserName: 'antyxsoft', Password: '' };
            this.Errors = [];
            this.Warnings = [];
            this.Infos = [];
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.Operation = '';
        _.Data = { UiMode: 'Web', OperationId: '', UserName: 'antyxsoft', Password: '' };
        _.Errors = [];
        _.Warnings = [];
        _.Infos = [];

        tp.Property('UserName', _, function () {
            return ('UserName' in this.Data) ? this.Data.UserName : '';
        }, function (v) {
            this.Data.UserName = v;
        });
        tp.Property('Password', _, function () {
            return ('Password' in this.Data) ? this.Data.Password : '';
        }, function (v) {
            this.Data.Password = v;
        });

        _.toJSON = function () {

            var o = {
                Operation: this.Operation,
                Data: this.Data,
                Errors: this.Errors,
                Warnings: this.Warnings,
                Infos: this.Infos,
            };

            return o;
        };
        _.FromJsonText = function (Text) {
            var Source = JSON.parse(Text);
            this.Assign(Source);
        };
        _.Assign = function (Source) {
            this.Operation = Source.Operation;
            this.Data = Source.Data;
            this.Errors = Source.Errors;
            this.Warning = Source.Warnings;
            this.Infos = Source.Infos;
        };


        return Class;
    })(Object);
    //#endregion

    tp.Urls.OpExec = '';

    //#region WorkUnit
    tp.WorkUnit = (function (BaseClass) {

        function Class() {
            /// <summary>Represents a unit of work. Used for chaining execution of work units. </summary>
            BaseClass.call(this);
            this.tpClass = 'tp.WorkUnit';
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.ExecutionInfo = null;
 
        // static
        Class.ExecuteChain = function (ShowSpinner, WorkUnits, Info, Context, OnDone, OnError) {
            /// <summary>Static method. Executes an array of work units, one after the other, calling the instance method Execute() of each unit. 
            /// <para>WARNING: The instance method Execute() must return a Promise</para></summary>
            /// <param name="ShowSpinner" type="boolean">When true, then it displays a spinner on start and hides it in the end of of the whole operation.</param>
            /// <param name="WorkUnits" type="object or array">A single work unit or an array of work units</param>
            /// <param name="Info" type="object"> Passed to the Execute() of the next unit as { WorkUnit: current work unit, PreviousWorkUnit: the previous unit, WorkUnitList: the array of units  }</param>
            /// <param name="Context" type="object">The context to use when calling OnDone() and OnError().</param>
            /// <param name="OnDone" type="function">Called when after all units are executed. It is passed the Info object.</param>
            /// <param name="OnError" type="function">Called on error. It is passed the Info object.</param>

            var Spinner = function (Flag) {
                if (ShowSpinner) {
                    tp.Spinner(Flag);
                }
            };

            Info = Info || {};
            var A = [];
            if (tp.IsArray(WorkUnits)) {
                A = WorkUnits;
            } else if (WorkUnits instanceof Class) {
                A.push(WorkUnits);
            }

            var Start = Promise.resolve();
            var Func = function (PreviousValue, Value, Index, a) {
                return PreviousValue.then(function () {
                    if (Value instanceof Class) {

                        Info.WorkUnit = Value;
                        Info.PreviousWorkUnit = Index > 0 ? A[Index - 1] : null;
                        Info.WorkUnitList = A;

                        Value.ExecutionInfo = Info;

                        var Result = Value.Execute(Info);
                        if (Result instanceof Promise) {
                            Result.then(function () {
                                tp.Broadcaster.Send('WorkUnitExecuted', null, { WorkUnit: Value });     
                            });
                            return Result;
                        }

                    }

                    return true;
                });
            };
 
            Spinner(true);
              
            var S;

            A.reduce(Func, Start)
              .then(function () {
                  if (tp.IsFunction(OnDone))
                      OnDone.call(Context, Info);
              }).catch(function (e) {
                  Spinner(false);
                  try {
                      S = (e instanceof Event) ? tp.ExceptionText(e) : e.toString();
                      tp.ErrorNote(S);
                  } catch (e) {
                  }
                  if (tp.IsFunction(OnError)) {
                      Info.WorkUnitError = e;
                      OnError.call(Context, Info);
                  }
              }).then(function (e) {
                  Spinner(false);
                  tp.Broadcaster.Send('WorkUnit.ExecuteChain.Done', null, { Info: Info });
              });

        };
        Class.ExecuteAtOnce = function (ShowSpinner, WorkUnits, Info, Context, OnDone, OnError) {
            /// <summary>Static method. Executes an array of work units, all at once, calling the instance method Execute() of each unit. 
            /// <para>WARNING: The instance method Execute() must return a Promise</para></summary>
            /// <param name="ShowSpinner" type="boolean">When true, then it displays a spinner on start and hides it in the end of the whole operation.</param>
            /// <param name="WorkUnits" type="object or array">A single work unit or an array of work units</param>
            /// <param name="Info" type="object"> Passed to the Execute() of the next unit as { WorkUnit: current work unit, PreviousWorkUnit: the previous unit, WorkUnitList: the array of units  }</param>
            /// <param name="Context" type="object">The context to use when calling OnDone() and OnError().</param>
            /// <param name="OnDone" type="function">Called when after all units are executed. It is passed the Info object.</param>
            /// <param name="OnError" type="function">Called on error. It is passed the Info object.</param>

            var Spinner = function (Flag) {
                if (ShowSpinner) {
                    tp.Spinner(Flag);
                }
            };

            Info = Info || {};

            var A = [];
            if (tp.IsArray(WorkUnits)) {
                A = WorkUnits;
            } else if (WorkUnits instanceof Class) {
                A.push(WorkUnits);
            }

            var Func = function (Value, Index) {
                if (Value instanceof Class) {

                    Info.WorkUnit = Value;
                    Info.PreviousWorkUnit = Index > 0 ? A[Index - 1] : null;
                    Info.WorkUnitList = A;

                    Value.ExecutionInfo = Info;

                    var Result = Value.Execute(Info);
                    if (Result instanceof Promise) {
                        Result.then(function () {
                            tp.Broadcaster.Send('WorkUnitExecuted', null, { WorkUnit: Value });
                        });
                        return Result;
                    }
                }

                return true;
            };
 
            Spinner(true);

            var S;
 
            Promise.all(A.map(Func))
                .then(function () {
                    if (tp.IsFunction(OnDone))
                        OnDone.call(Context, Info);
                }).catch(function (e) {
                    Spinner(false);
                    try {
                        S = (e instanceof Event) ? tp.ExceptionText(e) : e.toString();
                        tp.ErrorNote(S);
                    } catch (e) {
                    }
                    if (tp.IsFunction(OnError)) {
                        Info.WorkUnitError = e;
                        OnError.call(Context, Info);
                    }
                }).then(function (e) {
                    Spinner(false);
                    tp.Broadcaster.Send('WorkUnit.ExecuteAtOnce.Done', null, { Info: Info });
                });

        };

        // instance
        _.Execute = function (Info) {
            /// <summary>Executes the unit. Override this method in order to provide the execution algorithm.
            /// <para>WARNING: Must return a Promise when used with promise chaining.</para></summary>
            /// <param name="Info" type="object">{ WorkUnit: current work unit, PreviousWorkUnit: the previous unit, WorkUnitList: the array of units  }</param>

            /* the following is an example of how to use this method with an ajax call */
            var Url = tp.Urls.OpExec;
            var Op = new tp.OperationData("Test");

            var Data = {
                DataText: JSON.stringify(Op.toJSON())
            };

            //Data = tp.EncodeArgs(Data);

            var Args = { Data: Data };

            return tp.Ajax.Promise(Url, Args).then(function (ResultArgs) {
                var x = ResultArgs.ResponseText;
            }, function (ResultArgs) {
                // on rejection
                var y = ResultArgs.ErrorText;
            });
        };

        return Class;
    })(Object);
    //#endregion

    //#region OpWorkUnit
    tp.OpWorkUnit = (function (BaseClass) {
        function Class(Op, Context, Succeeded, Failed) {
            BaseClass.call(this);
            this.tpClass = 'tp.OpWorkUnit';

            this.Url = tp.Urls.OpExec;

            this.Op = Op;
            this.Context = Context;
            this.Succeeded = Succeeded;
            this.Failed = Failed;
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.Op = null;
        _.Url = '';
        _.Result = false;

        _.Context = null;       // callback context
        _.Succeeded = null;     // callback function
        _.Failed = null;        // callback function

        _.Execute = function (Info) {
            /// <summary>Executes the unit. Override this method in order to provide the execution algorithm.
            /// <para>WARNING: Must return a Promise when used with promise chaining.</para></summary>
            /// <param name="Info" type="object">{ WorkUnit: current work unit, PreviousWorkUnit: the previous unit, WorkUnitList: the array of units  }</param>

            var self = this;
            var Op = this.CreateOperationData();
            var Data = {
                DataText: JSON.stringify(Op.toJSON())
            };

            var Args = { Data: Data };

            return tp.Ajax.Promise(this.Url, Args).then(function (ResultArgs) {
                self.ParseResponse(ResultArgs.ResponseText);
            }, function (ResultArgs) {
                self.OnFailure(ResultArgs.ErrorText);
            });
        };
        _.CreateOperationData = function () {
            var Result = this.Op || new tp.OperationData('Unknown');
            return Result;
        };
        _.ParseResponse = function (ResponseText) {
            var Data = JSON.parse(ResponseText);
            var Op = this.Op || new tp.OperationData();
            Op.Assign(Data);
            this.CheckSuccess(Op);
            this.OnSuccess(Op);
        };
        _.CheckSuccess = function (Op) {
            if (tp.IsEmpty(Op.Data.Result)) {
                throw "tripous.OperationData came back from server with no Result";
            }      

            this.Result = tp.IsString(Op.Data.Result) ? tp.IsSameText('true', Op.Data.Result) : Op.Data.Result;    

            if (!this.Result) {
                if (Op.Errors && (Op.Errors.length > 0)) {
                    var Errors = "";
                    for (var i = 0; i < Op.Errors.length; i++) {
                        Errors += Op.Errors[i] + '\n';
                    }

                    throw Errors;
                }
            }
        };
        _.OnSuccess = function (Op) {
            if (tp.IsFunction(this.Succeeded)) {
                this.Succeeded.call(this.Context, Op);
            }
        };
        _.OnFailure = function (ErrorText) {
            if (tp.IsFunction(this.Failed)) {
                this.Failed.call(this.Context, ErrorText);
            } else {
                throw new tp.Error(ErrorText);
            }
        };

        return Class;
    })(tp.WorkUnit);
    //#endregion

    //#region OpGetEnums
    tp.OpGetEnums = (function (BaseClass) {
        function Class() {
            BaseClass.call(this);
            this.tpClass = 'tp.OpGetEnums';

            this.Op = new tp.OperationData('GetEnums');
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.OnSuccess = function (Op) {
            if (Op.Data.Enums) {
                tp.Enums = JSON.parse(Op.Data.Enums);
            }

            base.OnSuccess.call(this, Op);
        };

        return Class;
    })(tp.OpWorkUnit);
    //#endregion

    //#region OpExecute
    tp.OpExecute = function (ShowSpinner, Url, Op, Context, OnSuccess, OnFailure) {
        var WU = new tp.OpWorkUnit(Op, Context, OnSuccess, OnFailure);
        WU.Url = Url;
        tp.WorkUnit.ExecuteChain(ShowSpinner, WU);
    };
    //#endregion

    //#region OpExec
    tp.OpExec = function (ShowSpinner, Op, Context, OnSuccess, OnFailure) {
        tp.OpExecute(ShowSpinner, tp.Urls.OpExec, Op, Context, OnSuccess, OnFailure);
    };
    //#endregion

    //#region OpTestSync
    tp.OpTestSync = function () {
        var Url = tp.Urls.OpExec;
        var Op = new tp.OperationData("Test");

        var Data = {
            DataText: JSON.stringify(Op.toJSON())
        };

        //Data = tp.EncodeArgs(Data);

        var Args = { Data: Data };

        tp.Ajax.Promise(Url, Args).then(function (ResultArgs) {
            var x = ResultArgs.ResponseText;
        }, function (ResultArgs) {
            // on rejection
            var y = ResultArgs.ErrorText;
        });

        Args = { Data: Data };
        Args.OnSuccess = function (Text) {
            var y = Text;
        };

        tp.Ajax.Exec(Url, Args);

    };
    //#endregion
 
    //#region ResLang
    tp.ResLang = (function (BaseClass) {
        function Class(Code, Name) {
            BaseClass.call(this);
            this.tpClass = 'tp.ResLang';

            this.fCode = Code;
            this.fName = Name;
            this.fItems = new tp.Dictionary();
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.fCode = '';
        _.fName = '';
        _.fItems = null;

        tp.Property('Code', _, function () { return this.fCode; });
        tp.Property('Name', _, function () { return this.fName; });
        tp.Property('Items', _, function () { return this.fItems; });

        _.AddStringList = function (Source) {
            if (Source) {
                for (var Key in Source) {
                    this.Items.Set(Key, Source[Key]);
                }
            }
        };
        _.toString = function () {
            return tp.Format('{0} - {1}', this.Code, this.Name);
        };

        return Class;
    })(Object);
    //#endregion

    //#region Languages
    tp.Languages = (function () {
        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }
        var _ = Class;

        _.fLanguages = [new tp.ResLang('en-US', 'English'), new tp.ResLang('el-GR', 'Greek')];
        _.Current = _.fLanguages[0];

        _.En = _.fLanguages[0];
        _.Gr = _.fLanguages[1];

        _.Find = function (Code) {
            return tp.FirstOrNull(_.fLanguages, function (item) {
                return tp.IsSameText(Code, item.Code);
            });
        };
        _.Exists = function (Code) {
            return this.Find(Code) !== null;
        };
        _.Add = function (Code, Name) {
            var Result = this.Find(Code);
            if (tp.IsEmpty(Result)) {
                Result = new tp.ResLang(Code, Name);
                _.fLanguages.push(Result);
            }
            return Result;
        };

        return Class;
    })();
    //#endregion

    //#region Gr
    var Gr = tp.Languages.Gr;

    Gr.Items['Insert'] = 'Εισαγωγή';
    Gr.Items['Update'] = 'Μεταβολή';
    Gr.Items['Delete'] = 'Διαγραφή';
    Gr.Items['List'] = 'Λίστα';
    Gr.Items['Code'] = 'Κωδικός';
    Gr.Items['Name'] = 'Ονομα';
    Gr.Items['UserName'] = 'Χρήστης';
    Gr.Items['Password'] = 'Κωδικός';
    //#endregion

    //#region OpGetStrings
    tp.OpGetStrings = (function (BaseClass) {
        function Class(Keys, Language) {
            BaseClass.call(this);
            this.tpClass = 'tp.OpGetStrings';

            this.Language = Language || tp.Languages.Current;

            this.Op = new tp.OperationData('GetStrings');
            this.Op.Data.Language = this.Language.Code;
            this.Op.Data.StringKeys = Keys;
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        _.Language = tp.Languages.Current;
        _.StringList = null;

        _.OnSuccess = function (Op) {
            if (Op.Data.hasOwnProperty("StringList")) {
                try {
                    this.StringList = JSON.parse(Op.Data.StringList);
                    this.Language.AddStringList(this.StringList);
                } catch (e) {
                }
            }
            base.OnSuccess.call(this, Op);
        };

        return Class;
    })(tp.OpWorkUnit);
    //#endregion

    //#region Res
    tp.Res = (function () {

        function Class() {
            throw new Error("Can NOT instantiate a static class");
        }
        var _ = Class;

        _.GS = function (Key, OnResult, Context, Default, UserTag) {
            // GS = GetString.
            if (tp.IsString(Key) && tp.IsFunction(OnResult)) {
                UserTag = UserTag || Key;
                var Value;
                if (tp.Languages.Current.Items.ContainsKey(Key)) {
                    Value = tp.Languages.Current.Items.ValueOf(Key, Default);
                    OnResult.call(Context, Value, UserTag);
                } else {

                    var WU = new tp.OpGetStrings(Key, tp.Languages.Current);

                    var OnSuccess = function (Info) {
                        Value = tp.Languages.Current.Items.ValueOf(Key, Default);
                        OnResult.call(Context, Value, UserTag);
                    };
                    var OnFailure = function () {
                        OnResult.call(Context, Key, UserTag);
                    };

                    tp.WorkUnit.ExecuteChain(false, WU, null, null, OnSuccess, OnFailure);

                }
            }
        };
        _.GetString = _.GS;

        return Class;
    })();
    //#endregion

    //#region ReadFiles (function that loads file data from disk using a system dialog)
    tp.ReadFiles = function (ShowSpinner, FileListOrSelector, Context, OnDone, OnError, AsHex) {
        /// <summary>Loads file data from disk using a system dialog. It is passed a list of File objects to load. 
        /// Returns a Promise with a resolve(ResultFileList) where each entry in the ResultFileList is an object of { FileName:, Size:, MimeType:, Data:,} where Data is a base64 string.
        /// IMPORTANT: For increasing the allowed maximub POST size, see: http://stackoverflow.com/questions/3853767/maximum-request-length-exceeded </summary>
        /// <param name="ShowSpinner" type="Boolean">True to show the spinner while processing files.</param>
        /// <param name="FileListOrSelector" type="FileList or Selector">Either an input[type="file"] element, or a selector to such an element, or a list of File objects (see File API FileList and File classes at https://developer.mozilla.org/en-US/docs/Web/API/FileList )</param>
        /// <param name="Context" type="Object">The context (this) to use when calling the provided call-back functions.</param>
        /// <param name="OnDone" type="function(List){}">A function to call when done and all files are loaded. It is passed a list of { FileName:, Size:, MimeType:, Data:,} where Data is a base64 string.</param>
        /// <param name="OnError" type="function(e, File){}">A function to call on error. It is passed the error event and the File that caused the error.</param>
        /// <param name="AsHex" type="Boolean">If true then the Data of the file is converted to a Hex string. Else to a base64 string.</param>


        var ReadAsBase64 = function (ResultList, File, ReadNext, Resolve, Reject) {
            var Reader = new FileReader();

            Reader.onload = function () {

                var Data = Reader.result;
                var Parts = Data.split('base64,');
                if (Parts.length === 2) {
                    Data = Parts[1];
                }

                // { FileName:,Size:, MimeType:, Data:,}
                var o = {
                    FileName: File.name,
                    Size: File.size,
                    MimeType: File.type,
                    Data: Data,
                };

                ResultList.push(o);
                ReadNext();
            };
            Reader.onerror = function (e) {
                Reject(e);
                tp.Call(OnError, Context, e);
            };
            Reader.onabort = Reader.onerror;

            Reader.readAsDataURL(File);
        };
        var ReadAsHex = function (ResultList, File, ReadNext, Resolve, Reject) {
            Reader.onload = function () {

                var Data = Reader.result;

                // { FileName:,Size:, MimeType:, Data:,}
                var o = {
                    FileName: File.name,
                    Size: File.size,
                    MimeType: File.type,
                    Data: tp.ArrayBufferToHex(Data),
                };

                ResultList.push(o);
                ReadNext();
            };
            Reader.onerror = function (e) {
                Reject(e);
                tp.Call(OnError, Context, e);
            };
            Reader.onabort = Reader.onerror;

            Reader.readAsArrayBuffer(File);
        };

        return new Promise(function (Resolve, Reject) {
            var FileList = null;
            try {
                if (tp.IsString(FileListOrSelector)) {
                    FileList = tp(FileListOrSelector).files;
                } else if (tp.IsElement(FileListOrSelector)) {
                    FileList = FileListOrSelector.files;
                } else if ('length' in FileListOrSelector) {
                    FileList = FileListOrSelector;
                }
            } catch (e) {
                Reject(e);
                tp.Call(OnError, Context, e);
            }

            if (ShowSpinner) {
                tp.Spinner(true);
            }

            var Index = 0;
            var ResultList = [];

            var ReadNext = function () {
                if (Index < FileList.length) {
                    var File = FileList[Index++];

                    if (Boolean(AsHex)) {
                        ReadAsHex(ResultList, File, ReadNext, Resolve, Reject);
                    } else {
                        ReadAsBase64(ResultList, File, ReadNext, Resolve, Reject);
                    }

                } else {
                    if (ShowSpinner) {
                        tp.Spinner(false);
                    }
                    Resolve(ResultList);
                    tp.Call(OnDone, Context, ResultList);
                }
            };

            ReadNext();


        });
    };

    //#endregion
     
    //#region Dragger
    tp.Dragger = (function (BaseClass) {
        function Class(Element, MoveHandle, MoveOnly) {
            /// <summary>Represents an element resizer and mover, that is resizes and moves elements.</summary>
            /// <param name="Element" type="Element">The element to resize.</param>
            /// <param name="MoveHandle" type="Element">The element to be used as the drag (move) handle, i.e. a header in a window.</param>
            /// <param name="MoveOnly" type="Boolean">When true and a valid move handle is passed, then no resizing takes place</param>
            BaseClass.call(this);

            this.fElement = Element;
            this.fMoveHandle = MoveHandle;
            this.fMoveOnly = MoveHandle && (MoveOnly === true);

            this.fDocument = Element.ownerDocument;
            this.fOldCursor = tp.Mouse.Cursor;

            this.Active = true;
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        /* private */
        _.fActive = false;                      // when false no resizing/moving takes place
        _.fMoving = false;
        _.fResizing = false;
        _.fElement = null;                      // read-only, the element to resize
        _.fMoveHandle = null;                   // read-only, the element to be used as the drag (move) handle, i.e. a header in a window
        _.fMoveOnly = false;

        _.fDocument = document;
        _.fOldCursor = '';
        _.fResizeEdge = tp.Edge.None;
        _.fDelta = null;

        /* properties */
        tp.Property('Active', _, function () {             // when false no resizing/moving takes place
            return this.fActive;
        }, function (v) {
            if (v !== this.fActive) {
                if (v === true) {
                    this.Element.addEventListener('mousedown', this, false);
                    this.Element.addEventListener('mousemove', this, false);
                    this.Element.addEventListener('mouseout', this, false);   // leave
                } else {
                    this.Element.removeEventListener('mousedown', this, false);
                    this.Element.removeEventListener('mousemove', this, false);
                    this.Element.removeEventListener('mouseout', this, false);   // leave
                }

                this.fActive = v;
            }
        });
        tp.Property('Resizing', _, function () {
            return this.fResizing;
        });        // true while resizing
        tp.Property('Moving', _, function () {
            return this.fMoving;
        });          // true while moving
        tp.Property('Element', _, function () {
            return this.fElement;
        });         // read-only, the element to resize
        tp.Property('MoveHandle', _, function () {
            return this.fMoveHandle;
        });      // read-only, the element to be used as the drag (move) handle, i.e. a header in a window   
        tp.Property('Edges', _, tp.Edge.All);              // bit-field, the edges to be used as valid resize handlers.
        tp.Property('MinWidth', _, 20);                    // resize limit
        tp.Property('MaxWidth', _, 6000);                  // resize limit
        tp.Property('MinHeight', _, 20);                   // resize limit
        tp.Property('MaxHeight', _, 6000);                 // resize limit
        tp.Property('HandleSize', _, 8);                   // the size (width and heigth) of a resize handler

        /* private methods */
        _.IsValidWidth = function (v) { return (v >= this.MinWidth) && (v <= this.MaxWidth); };
        _.IsValidHeight = function (v) { return (v >= this.MinHeight) && (v <= this.MaxHeight); };
        _.SetCursor = function (Cursor) {
            tp.Mouse.Cursor = Cursor;            
            this.Element.style.cursor = Cursor;
        };
        _.handleEvent = function (e) {
            if (this.Active === true) {

                var Flag = false;
                var Edge = null;

                if (tp.IsSameText('mousedown', e.type)) {
                    Edge = tp.ResizeHitTest(e, this.Element, this.HandleSize);
 
                    if ((Edge === tp.Edge.None) && (e.target === this.MoveHandle)) {
                        this.fMoving = true;
                        this.SetCursor(tp.Cursor.Move);
                        
                        Flag = true;
                        this.DragStart(e);
                    } else if (!this.fMoveOnly) {
                        if (tp.Bf.In(Edge, this.Edges)) {
                            this.fResizing = true;
                            this.fResizeEdge = Edge;
                            this.SetCursor(tp.EdgeToCursor(Edge));
                            Flag = true;
                            this.DragStart(e);
                        }
                    }
                } else if (tp.IsSameText('mousemove', e.type)) {
                    if (this.fMoving || this.fResizing) {
                        Flag = true;
                        this.Drag(e);
                    } else if (!this.fMoveOnly) {
                        Edge = tp.ResizeHitTest(e, this.Element, this.HandleSize);
                        if (tp.Bf.In(Edge, this.Edges)) {
                            this.SetCursor(tp.EdgeToCursor(Edge));
                        } else {
                            this.SetCursor(this.fOldCursor);
                        }
                    }
                }
                else if (tp.IsSameText('mouseout', e.type)) {
                    if (!this.fResizing) {
                        this.SetCursor(this.fOldCursor);
                    }
                }
                else if (tp.IsSameText('mouseup', e.type)) {
                    Flag = this.fMoving || this.fResizing;
                    if (Flag) {
                        this.DragEnd(e);
                    }

                    this.fMoving = false;
                    this.fResizing = false;
                    this.fResizeEdge = tp.Edge.None;
                }


                if (Flag) {
                    return tp.CancelBubble(e);
                }

            }
        };

        _.DragStart = function (e) {
            if (this.fMoving) {
                var Mouse = tp.Mouse.ToElement(e, this.Element.parentNode);
                var P = tp.ToParent(this.Element);
                var X = Mouse.X - P.X;
                var Y = Mouse.Y - P.Y;
                this.fDelta = new tp.Point(X, Y);
            }

            this.fDocument.documentElement.addEventListener('mousemove', this, false);
            this.fDocument.documentElement.addEventListener('mouseup', this, false);

            this.OnDragStart(e);
        };
        _.Drag = function (e) {

            var L, T, Mouse;

            if (this.fMoving) {
                Mouse = tp.Mouse.ToElement(e, this.Element.parentNode);

                L = Mouse.X - this.fDelta.X;
                T = Mouse.Y - this.fDelta.Y;

                this.Element.style.left = L + 'px';
                this.Element.style.top = T + 'px';
            } else {
                Mouse = tp.Mouse.ToElement(e, this.Element);

                var Size = tp.SizeOf(this.Element);
                var Style = tp.ComputedStyle(this.Element);
                L = tp.StrToInt(Style.left);
                T = tp.StrToInt(Style.top);
                var v;

                if (tp.Bf.In(this.fResizeEdge, tp.Edge.Width)) {
                    if (tp.Edge.IsLeft(this.fResizeEdge)) {
                        v = Size.Width - Mouse.X;
                        if (this.IsValidWidth(v)) {
                            L = L + Mouse.X;
                            this.Element.style.left = L + 'px';
                            this.Element.style.width = v + 'px';
                        }
                    } else if (tp.Edge.IsRight(this.fResizeEdge)) {
                        v = Mouse.X;
                        if (this.IsValidWidth(v)) {
                            this.Element.style.width = v + 'px';
                        }
                    }
                }


                if (tp.Bf.In(this.fResizeEdge, tp.Edge.Height)) {
                    if (tp.Edge.IsTop(this.fResizeEdge)) {
                        v = Size.Height - Mouse.Y;
                        if (this.IsValidHeight(v)) {
                            T = T + Mouse.Y;
                            this.Element.style.top = T + 'px';
                            this.Element.style.height = v + 'px';
                        }
                    } else if (tp.Edge.IsBottom(this.fResizeEdge)) {
                        v = Mouse.Y;
                        if (this.IsValidHeight(v)) {
                            this.Element.style.height = v + 'px';
                        }
                    }
                }
            }

            this.OnDrag(e);
        };
        _.DragEnd = function (e) {
            this.SetCursor(this.fOldCursor);

            this.fDocument.documentElement.removeEventListener('mousemove', this, false);
            this.fDocument.documentElement.removeEventListener('mouseup', this, false);

            this.OnDragEnd(e);
        };

        /* notifications */
        _.OnDragStart = function (e) {
            this.Trigger(tp.Events.DragStart, { e: e });
        };
        _.OnDrag = function (e) {
            this.Trigger(tp.Events.Drag, { e: e });
        };
        _.OnDragEnd = function (e) {
            this.Trigger(tp.Events.DragEnd, { e: e });
        };

        return Class;
    })(tp.tpObject);
    //#endregion

    //#region DraggerExArgs
    tp.DraggerExArgs = (function () {

        function DraggerExArgs(Element, Handle) {
            this.Document = null;
            this.Element = null;
            this.Handle = null;
            this.LowerLimit = null;
            this.UpperLimit = null;
            this.MinSize = null;
 
            this.StartFunc = null;
            this.MoveFunc = null;
            this.EndFunc = null;
            this.Draggable = true;
            this.Resizable = true;
            this.Edges = {
                L: true,
                T: true,
                R: true,
                B: true,
                All: false
            };
            this.TriggerResizeEvent = true;
            this.Element = Element;
            this.Handle = Handle;
        }
 
        DraggerExArgs.prototype.Context = null;
        return DraggerExArgs;
    })();             
    //#endregion

    //#region DraggerEx
    tp.DraggerEx = (function () {

        function DraggerEx(Args) {
            this.listening = false;
            this.disposed = false;
            this.InteriorDiv = null;
            this.Handles = [];
            this.Location = null;
            this.Size = null;
            this.Selected = null;
            this.LastMousePos = null;
            this.Offset = null;
            this.Args = Args;

            this.Document = this.Args.Document || (window.frameElement ? window.top.document : window.document);

            this.LowerLimit = this.Args.LowerLimit || this.NewPoint(-9999, 1);
            this.UpperLimit = this.Args.UpperLimit || this.NewPoint(9999, 9999);
            this.MinSize = this.Args.MinSize || this.NewPoint(50, 50);

            if (typeof (this.Args.Element) === "string")
                this.Args.Element = this.Document.getElementById(this.Args.Element);

            if (this.Args.Element === null)
                return null;

            if (typeof (this.Args.Handle) === "string")
                this.Args.Handle = this.Document.getElementById(this.Args.Handle);
            if (this.Args.Handle === null)
                this.Args.Handle = this.Args.Element;

            this.Enabled = this.Args.Draggable || this.Args.Resizable;
        }
        /* events */
        DraggerEx.prototype.On = function (Sender, EventName, Listener) {
            if (typeof (Sender) === "string")
                Sender = this.Document.getElementById(Sender);
            if (Sender === null)
                return;
            if (Sender.addEventListener) {
                Sender.addEventListener(EventName, Listener, false);
            } else if (Sender.attachEvent)
                Sender.attachEvent("on" + EventName, Listener);
        };
        DraggerEx.prototype.Off = function (Sender, EventName, Listener) {
            if (typeof (Sender) === "string")
                Sender = this.Document.getElementById(Sender);
            if (Sender === null)
                return;
            if (Sender.removeEventListener)
                Sender.removeEventListener(EventName, Listener, false);
            else if (Sender.detachEvent)
                Sender.detachEvent("on" + EventName, Listener);
        };
        DraggerEx.prototype.CancelEvent = function (e) {
            e = e ? e : window.event;
            if (e.stopPropagation)
                e.stopPropagation();
            if (e.preventDefault)
                e.preventDefault();
            e.cancelBubble = true;
            e.cancel = true;
            e.returnValue = false;
            return false;
        };
        DraggerEx.prototype.GetMousePosition = function (e) {
            e = e ? e : window.event;

            return this.NewPoint(e.clientX + this.Document.documentElement.scrollLeft + this.Document.body.scrollLeft, e.clientY + this.Document.documentElement.scrollTop + this.Document.body.scrollTop);
        };

        /* resize handles */
        DraggerEx.prototype.AddHandle = function (Edge) {
            var Handle = this.Document.createElement('div');
            Handle.style.position = 'absolute';

            var el = this.Args.Element;
            var Style = document.defaultView.getComputedStyle(el, '');

            //this.Handle.style.backgroundColor = 'Red';
            //---------------------------------------------------
            var Result = {
                Handle: Handle,
                Edge: Edge,
                Layout: function () {
                    var E = 8;

                    var elL = parseInt(Style.left, 10);
                    var elT = parseInt(Style.top, 10);
                    var elW = parseInt(Style.width, 10);
                    var elH = parseInt(Style.height, 10);
                    var elR = elL + elW;
                    var elB = elT + elH;

                    var L, T, W, H, sCursor;

                    if (this.Edge === 'L') {
                        L = -(E / 2);
                        T = E / 2;
                        W = E;
                        H = elH - E;
                        sCursor = 'w-resize';
                    } else if (this.Edge === 'T') {
                        L = E / 2;
                        T = -(E / 2);
                        W = elW - E;
                        H = E;
                        sCursor = 'n-resize';
                    } else if (this.Edge === 'R') {
                        L = elW - (E / 2);
                        T = E / 2;
                        W = E;
                        H = elH - E;
                        sCursor = 'e-resize';
                    } else if (this.Edge === 'B') {
                        L = E / 2;
                        T = elH - (E / 2);
                        W = elW - E;
                        H = E;
                        sCursor = 's-resize';
                    } else if (this.Edge === 'TL') {
                        L = -(E / 2);
                        T = -(E / 2);
                        W = E;
                        H = E;
                        sCursor = 'nw-resize';
                    } else if (this.Edge === 'TR') {
                        L = elW - (E / 2);
                        T = -(E / 2);
                        W = E;
                        H = E;
                        sCursor = 'ne-resize';
                    } else if (this.Edge === 'BL') {
                        L = -(E / 2);
                        T = elH - (E / 2);
                        W = E;
                        H = E;
                        sCursor = 'sw-resize';
                    } else if (this.Edge === 'BR') {
                        L = elW - (E / 2);
                        T = elH - (E / 2);
                        W = E;
                        H = E;
                        sCursor = 'se-resize';
                    }

                    this.Handle.style.left = L + 'px';
                    this.Handle.style.top = T + 'px';
                    this.Handle.style.width = W + 'px';
                    this.Handle.style.height = H + 'px';

                    this.Handle.style.cursor = sCursor;
                }
            };

            //---------------------------------------------------
            this.On(Handle, "mousedown", this.DragStart);

            Result.Layout();
            this.Handles.push(Result);
            return Result;
        };
        DraggerEx.prototype.AddHandles = function (Flag) {
            if (!this.Args.Resizable)
                return;

            var i, ln, rh;

            for (i = 0, ln = this.Handles.length; i < ln; i++) {
                rh = this.Handles[i];
                this.Off(rh.Handle, "mousedown", this.DragStart);
                this.Args.Element.removeChild(rh.Handle);
            }

            this.Handles = [];

            // create and add handles
            if (Flag) {
                var zIndex = tp.MaxZIndexOf(this.Args.Element);
                zIndex++;

                if (this.Args.Edges.L || this.Args.Edges.All)
                    this.AddHandle('L');
                if (this.Args.Edges.T || this.Args.Edges.All)
                    this.AddHandle('T');
                if (this.Args.Edges.R || this.Args.Edges.All)
                    this.AddHandle('R');
                if (this.Args.Edges.B || this.Args.Edges.All)
                    this.AddHandle('B');

                if ((this.Args.Edges.T && this.Args.Edges.L) || this.Args.Edges.All)
                    this.AddHandle('TL');
                if ((this.Args.Edges.T && this.Args.Edges.R) || this.Args.Edges.All)
                    this.AddHandle('TR');
                if ((this.Args.Edges.B && this.Args.Edges.L) || this.Args.Edges.All)
                    this.AddHandle('BL');
                if ((this.Args.Edges.B && this.Args.Edges.R) || this.Args.Edges.All)
                    this.AddHandle('BR');

                for (i = 0, ln = this.Handles.length; i < ln; i++) {
                    rh = this.Handles[i];
                    rh.Handle.style.zIndex = zIndex;
                    this.Args.Element.appendChild(rh.Handle);
                }
            }
        };
        DraggerEx.prototype.LayoutHandles = function () {
            var i, ln;
            for (i = 0, ln = this.Handles.length; i < ln; i++) {
                this.Handles[i].Layout();
            }
        };
        DraggerEx.prototype.HandleOf = function (el) {
            if (el) {
                for (var i = 0, ln = this.Handles.length; i < ln; i++) {
                    if (el === this.Handles[i].Handle)
                        return this.Handles[i];
                }
            }

            return null;
        };
        DraggerEx.prototype.IsHandle = function (el) {
            var rh = this.HandleOf(el);
            return rh ? rh.Handle === el : false;
        };

        /* drag methods */
        DraggerEx.prototype.DragStart = function (e) {
            if (!this.listening || this.disposed)
                return;

            var el = e.target || e.srcElement;

            if ((this.IsDragging && (el === this.Args.Handle)) || (this.IsResizing && (el !== this.Args.Handle)))
                return;

            this.Selected = el;

            if (this.Args.StartFunc !== null)
                this.Args.StartFunc.call(this.Args.Context, e, this);

            this.LastMousePos = this.GetMousePosition(e);
            this.Offset = this.NewPoint(0, 0);

            var Style = document.defaultView.getComputedStyle(this.Args.Element, '');
            this.Size = this.NewPoint(parseInt(Style.width, 10), parseInt(Style.height, 10));

            //Size = new Point(Args.Element.offsetWidth, Args.Element.offsetHeight);
            this.On(this.Document, "mousemove", this.DragMove);
            this.On(this.Document, "mouseup", this.DragEnd);

            return this.CancelEvent(e);
        };
        DraggerEx.prototype.DragMove = function (e) {
            if (this.disposed || !(this.IsDragging || this.IsResizing))
                return;

            /* put an overlay div, over Args.Element, in case there is an iframe inside that element */
            if (!this.InteriorDiv) {
                this.InteriorDiv = document.createElement('div');
                this.Args.Element.appendChild(this.InteriorDiv);
                this.InteriorDiv.style.cssText = 'display:block; background:transparent; position:absolute; width:100%; height:100%; ';
                tp.BringToFront(this.InteriorDiv);
            }

            var P = this.GetMousePosition(e);

            var DiffX = P.X - this.LastMousePos.X + this.Offset.X;
            var DiffY = P.Y - this.LastMousePos.Y + this.Offset.Y;

            this.Offset.X = 0;
            this.Offset.Y = 0;

            this.LastMousePos.X = P.X;
            this.LastMousePos.Y = P.Y;

            var Style = document.defaultView.getComputedStyle(this.Args.Element, '');
            this.Location = this.NewPoint(parseInt(Style.left, 10), parseInt(Style.top, 10));

            var X = DiffX;
            var Y = DiffY;

            // resize logic -----------------------------------------------
            if (this.IsResizing) {
                var rh = this.HandleOf(this.Selected);
                var Edge = rh.Edge;

                if (Edge.indexOf('L') >= 0) {
                    if (this.Size.X - X < this.MinSize.X) {
                        DiffX = this.Size.X - this.MinSize.X;
                        this.Offset.X = X - DiffX;
                    } else if (this.Location.X + X < this.LowerLimit.X) {
                        DiffX = this.LowerLimit.X - this.Location.X;
                        this.Offset.X = X - DiffX;
                    }

                    this.Location.X += DiffX;
                    this.Size.X -= DiffX;
                }

                if (Edge.indexOf('T') >= 0) {
                    if (this.Size.Y - Y < this.MinSize.Y) {
                        DiffY = this.Size.Y - this.MinSize.Y;
                        this.Offset.Y = Y - DiffY;
                    } else if (this.Location.Y + Y < this.LowerLimit.Y) {
                        DiffY = this.LowerLimit.Y - this.Location.Y;
                        this.Offset.Y = Y - DiffY;
                    }

                    this.Location.Y += DiffY;
                    this.Size.Y -= DiffY;
                }

                if (Edge.indexOf('R') >= 0) {
                    if (this.Size.X + X < this.MinSize.X) {
                        DiffX = this.MinSize.X - this.Size.X;
                        this.Offset.X = X - DiffX;
                    } else if (this.Location.X + this.Size.X + X > this.UpperLimit.X) {
                        DiffX = this.UpperLimit.X - this.Location.X - this.Size.X;
                        this.Offset.X = X - DiffX;
                    }

                    this.Size.X += DiffX;
                }

                if (Edge.indexOf('B') >= 0) {
                    if (this.Size.Y + Y < this.MinSize.Y) {
                        DiffY = this.MinSize.Y - this.Size.Y;
                        this.Offset.Y = Y - DiffY;
                    } else if (this.Location.Y + this.Size.Y + Y > this.UpperLimit.Y) {
                        DiffY = this.UpperLimit.Y - this.Location.Y - this.Size.Y;
                        this.Offset.Y = Y - DiffY;
                    }

                    this.Size.Y += DiffY;
                }
            } else if (this.IsDragging) {
                // check left - right limit
                if (this.Location.X + X < this.LowerLimit.X) {
                    DiffX = this.LowerLimit.X - this.Location.X;
                    this.Offset.X = X - DiffX;
                } else if (this.Location.X + this.Size.X + X > this.UpperLimit.X) {
                    DiffX = this.UpperLimit.X - this.LowerLimit.X - this.Size.X;
                    this.Offset.X = X - DiffX;
                }

                // check top - bottom limit
                if (this.Location.Y + Y < this.LowerLimit.Y) {
                    DiffY = this.LowerLimit.Y - this.Location.Y;
                    this.Offset.Y = Y - DiffY;
                } else if (this.Location.Y + this.Size.Y + Y > this.UpperLimit.Y) {
                    DiffY = this.UpperLimit.Y - this.Location.Y - this.Size.Y;
                    this.Offset.Y = Y - DiffY;
                }

                this.Location.X += DiffX;
                this.Location.Y += DiffY;
            }

            this.Args.Element.style.left = this.Location.X + 'px';
            this.Args.Element.style.top = this.Location.Y + 'px';
            this.Args.Element.style.width = this.Size.X + 'px';
            this.Args.Element.style.height = this.Size.Y + 'px';

            this.LayoutHandles();

            if (this.Args.MoveFunc !== null)
                this.Args.MoveFunc.call(this.Args.Context, e, this);

            return this.CancelEvent(e);
        };
        DraggerEx.prototype.DragEnd = function (e) {
            if (this.disposed || !(this.IsDragging || this.IsResizing))
                return;

            this.LayoutHandles();

            if (this.InteriorDiv) {
                this.Args.Element.removeChild(this.InteriorDiv);
                this.InteriorDiv = null;
            }

            this.Off(this.Document, "mousemove", this.DragMove);
            this.Off(this.Document, "mouseup", this.DragEnd);

            if (this.Args.EndFunc !== null)
                this.Args.EndFunc.call(this.Args.Context, e, this);

            // trigger the resize event
            if (this.Args.TriggerResizeEvent && this.IsResizing) {
                var ev = tp.CreateCustomEvent("resize");
                this.Args.Element.dispatchEvent(ev);
            }

            this.Selected = null;

            if (e) {
                return this.CancelEvent(e);
            }
        };

        /* miscs */
        DraggerEx.prototype.NewPoint = function (X, Y) {
            return { X: X, Y: Y };
        };

        Object.defineProperty(DraggerEx.prototype, "Element", {
            /* properties */
            get: function () {
                return this.Args.Element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DraggerEx.prototype, "Enabled", {
            get: function () {
                return this.listening;
            },
            set: function (v) {
                v = !!v;

                if (this.Enabled !== v) {
                    if (v) {
                        if (this.listening || this.disposed)
                            return;
                        this.listening = true;

                        if (this.Args.Draggable) {
                            this.On(this.Args.Handle, "mousedown", this.DragStart);
                            this.On(this.Args.Element, "resize", this.LayoutHandles); // in case Args.Handle is resized outside of DraggerEx code
                        }

                        if (this.Args.Resizable) {
                            this.AddHandles(true);
                        }
                    } else {
                        if (!this.listening || this.disposed)
                            return;
                        this.Off(this.Args.Handle, "mousedown", this.DragStart);
                        this.Off(this.Args.Element, "resize", this.LayoutHandles);
                        this.listening = false;

                        this.DragEnd(null);
                        this.AddHandles(false);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DraggerEx.prototype, "IsDragging", {
            get: function () {
                return (this.Selected !== null) && (this.Selected === this.Args.Handle);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DraggerEx.prototype, "IsResizing", {
            get: function () {
                return this.IsHandle(this.Selected);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DraggerEx.prototype, "IsDisposed", {
            get: function () {
                return this.disposed;
            },
            enumerable: true,
            configurable: true
        });

        /* methods */
        DraggerEx.prototype.Dispose = function () {
            /// <summary>
            /// Sets references to null
            /// </summary>
            if (this.disposed)
                return;
            this.Enabled = false;
            this.Args.Element = null;
            this.Args.Handle = null;
            this.Args.LowerLimit = null;
            this.Args.UpperLimit = null;
            this.Args.StartFunc = null;
            this.Args.MoveFunc = null;
            this.Args.EndFunc = null;
            this.disposed = true;
        };

        return DraggerEx;
    })();
    //#endregion

    //#region VirtualScroller
    tp.VirtualScroller = (function (BaseClass) {
        function Class(Viewport, Container) {
            /// <summary>A virtual scroller. </summary>
            /// <param name="Viewport" type="Element">The view-port, i.e. the control that displays the rows</param>
            /// <param name="Container" type="Element">The container element, inside the viewport</param>
 
            BaseClass.call(this);
            this.tpClass = 'tp.VirtualScroller';

            this.Viewport = Viewport;
            this.Container = Container;
            this.RowHeight = tp.GetLineHeight(Container);  

            this.Viewport.style.float = 'left';
            this.Viewport.style.overflow = 'auto';

            this.Container.style.position = 'relative';
            this.Container.style.overflow = 'hidden';

            this.Viewport.addEventListener('scroll', this.Viewport_OnScroll.bind(this), false);
        }
        var base = tp.SetBaseClass(Class, BaseClass);
        var _ = Class.prototype;

        /* private */
        _.Viewport = null;
        _.Container = null;
        _.RowList = [];
        _.VirtualHeight = 0;
        _.LastScrollTop = 0;
        _.RowCache = {};
 
        /* properties */
        tp.Property('RowHeight', _, 0);             // The height of a row in pixels
        tp.Property('RenderRowFunc', _, null);      // function (Row, RowIndex) - callback that renders a row, returns a div
        tp.Property('ScrollFunc', _, null);         // function (Phase) - callback called on scroll, Phase 1 = before, 2 = after.
        tp.Property('Context', _, null);            // context object for the two callbacks
        tp.Property('IndexTop', _, 0);
        tp.Property('IndexBottom', _, 0);

        /* private */
        _.ClearCache = function () {
            var el, Index;
            for (Index in this.RowCache) {
                el = this.RowCache[Index];
                el.parentNode.removeChild(el);
                delete this.RowCache[Index];
            }
        };
        _.Viewport_OnScroll = function (e) {
            if (this.RowList.length > 0) {
                if (this.ScrollFunc)
                    this.ScrollFunc.call(this.Context, 1);  // before

                this.LastScrollTop = this.Viewport.scrollTop;

                // calculate the viewport elevator  
                var Y = this.Viewport.scrollTop;
                var H = this.VirtualHeight; // this.Viewport.scrollHeight;

                var Top = Math.floor((Y - H) / this.RowHeight);
                var Bottom = Math.ceil((Y + (H * 2)) / this.RowHeight);

                Top = Math.max(0, Top);
                Bottom = Math.min(this.VirtualHeight / this.RowHeight, Bottom);

                // remove rows no longer in the viewport
                var el, Index;
                for (Index in this.RowCache) {
                    if (Index < Top || Index > Bottom) {
                        el = this.RowCache[Index];
                        el.parentNode.removeChild(el);
                        delete this.RowCache[Index];
                    }
                }

                // add new rows
                var Length = this.RowList.length;
                for (Index = Top; Index <= Bottom; Index++) {
                    if ((Index >= 0) && (Index <= Length - 1) && !this.RowCache[Index]) {
                        el = this.RenderRow(Index);

                        el.style.position = 'absolute';
                        //el.style.left = '0px';
                        el.style.top = (Index * this.RowHeight) + 'px';
                        el.style.height = this.RowHeight + 'px';

                        this.Container.appendChild(el);
                        this.RowCache[Index] = el;
                    }
                }

                this.IndexTop = Top;
                this.IndexBottom = Bottom;

                this.Log();

                if (this.ScrollFunc)
                    this.ScrollFunc.call(this.Context, 2);  // before
            }
        };
        _.RenderRow = function (RowIndex) {
            var Row = this.RowList[RowIndex];
            var div = null;
            if (this.RenderRowFunc) {
                div = this.RenderRowFunc.call(this.Context, Row, RowIndex);
            }

            if (!div) {
                div = document.createElement('div');
                tp.Css(div, {
                    'border-bottom': '1px dotted blue',
                    left: '0',
                    'font-size': '9pt',
                    'height': this.RowHeight + 'px',
                });

                tp.Value(div, 'row ' + Row.Name);
            }

            return div;
        };
        _.Log = function () {
            if (tp.DebugDiv) {
                var SB = new tp.StringBuilder();
                SB.LineBreak = '<br />';
                SB.AppendLine('Scroll Top: ' + this.LastScrollTop);
                SB.Append('<hr />');
                SB.AppendLine('Rows in DOM: ' + this.Container.children.length);

                tp.DebugDiv.Html = SB.ToString();
            }

        };
 
        /* methods */
        _.SetRowList = function (RowList) {
            /// <summary>Sets the list of the rows</summary>
            /// <param name="RowList" type="Array">An array with data. </param>

            this.ClearCache();
            this.RowList = RowList || [];
            this.IndexTop = 0;
            this.IndexBottom = 0;
    
            this.VirtualHeight = this.RowList.length * this.RowHeight;
            this.Container.style.height = this.VirtualHeight + 'px';
 
            this.Viewport_OnScroll(null);
        };

 

        return Class;
    })(Object);
    //#endregion

})(window.tp);


