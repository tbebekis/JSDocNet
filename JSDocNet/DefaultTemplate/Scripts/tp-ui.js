tp.Classes = (function Classes() {
    function Class() {
        /// <summary>Concatenates css class names into a single string. 
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

        return A.join(' ');
    }

    var _ = Class;

    _.NoBrowserAppearance = 'tp-NoBrowserAppearance';


    /* states           ----------------------------------------------------------------- */
    _.None = 'tp-None';
    _.Focused = 'tp-focused';
    _.Selected = 'tp-Selected';
    _.Active = 'tp-Active';
    _.Inactive = 'tp-Inactive';
    _.Visible = 'tp-Visible';
    _.Expanded = 'tp-Expanded';
    _.Collapsed = 'tp-Collapsed';
    _.Grouped = 'tp-Grouped';
    _.Marked = 'tp-Marked';
    _.Disabled = 'tp-Disabled';

    _.Selectable = 'tp-Selectable';
    _.UnSelectable = 'tp-UnSelectable';

    _.Hide = 'tp-Hide';
    _.HideSmall = 'tp-Hide-s';
    _.HideMid = 'tp-Hide-m';
    _.HideLarge = 'tp-Hide-l';

    /* general          ----------------------------------------------------------------- */
    _.Item = 'tp-Item';
    _.Text = 'tp-Text';
    _.Ctrl = 'tp-Ctrl';
    _.Content = 'tp-Content';
    _.List = 'tp-List';
    _.ListItem = 'tp-ListItem';

    _.Viewport = 'tp-Viewport';

    _.Btn = 'tp-Btn';
    _.Ico = 'tp-Ico'

    _.Strip = 'tp-Strip';
    _.TabBar = 'tp-TabBar';
    _.Bar = 'tp-Bar';
    _.Zone = 'tp-Zone';
    _.Toggle = 'tp-Toggle';
    _.Handle = 'tp-Handle';

    _.Min = 'tp-Min';
    _.Max = 'tp-Max';

    _.From = 'tp-From';
    _.To = 'tp-To';

    _.Next = 'tp-Next';
    _.Prev = 'tp-Prev';

    _.First = 'tp-First';
    _.Last = 'tp-Last';

    _.Left = 'tp-Left';
    _.Right = 'tp-Right';
    _.Center = 'tp-Center';

    _.Top = 'tp-Top';
    _.Mid = 'tp-Mid';
    _.Bottom = 'tp-Bottom';

    _.Small = 'tp-Small';
    _.Medium = 'tp-Medium';
    _.Large = 'tp-Large';
    _.Normal = 'tp-Normal';

    _.Main = 'tp-Main';
    _.Site = 'tp-Site';

    _.Header = 'tp-Header';
    _.Footer = 'tp-Footer';

    _.SiteMenu = 'tp-SiteMenu';
    _.PageMenu = 'tp-PageMenu';
    _.MenuStrip = 'tp-MenuStrip';

    _.Title = 'tp-Title';
    _.Caption = 'tp-Caption';
    _.Logo = 'tp-Logo'

    _.FlexFill = 'tp-FlexFill';

    _.IcoLeft = 'tp-IcoLeft';
    _.IcoTop = 'tp-IcoTop';

    _.TextTop = 'tp-TextTop';

    
    _.NoIco = 'tp-NoIco';
    _.NoText = 'tp-NoText';

    /* etc.             ----------------------------------------------------------------- */
    _.DropDown = 'tp-dropdown';
    _.Overlay = 'tp-Overlay';
    _.CenterInParent = 'tp-CenterInParent';

    _.Shadow = 'tp-Shadow';
    _.ClickBox = 'tp-ClickBox';

    _.TextCenter = 'tp-TextCenter';
    _.TextRight = 'tp-TextRight';

    _.RightAligner = 'tp-RightAligner';
    _.RightAligned = 'tp-RightAligned';

    _.RequiredMark = 'tp-RequiredMark';


    /* spinner          ----------------------------------------------------------------- */
    _.Spinner = 'tp-Spinner-Snake';  // Snake Wheel
    _.SpinnerContainer = 'tp-SpinnerContainer';


    /* borders          ----------------------------------------------------------------- */
    _.Border = 'tp-BorderBox';
    _.BorderLeft = 'tp-BorderLeft';
    _.BorderTop = 'tp-BorderTop';
    _.BorderRight = 'tp-BorderRight';
    _.BorderBottom = 'tp-BorderBottom';

    /* flex             ----------------------------------------------------------------- */
    _.FlexWrap = 'tp-FlexWrap';
    _.FlexNoWrap = 'tp-FlexNoWrap';
    _.FlexRowReverse = 'tp-FlexRowReverse';
    _.FlexColumnReverse = 'tp-FlexColumnReverse';
    _.FlexCenterH = 'tp-FlexCenterH';
    _.FlexCenterV = 'tp-FlexCenterV';
    _.FlexCenter = 'tp-FlexCenter';

    /* layout           ----------------------------------------------------------------- */
    _.Limiter = 'tp-Limiter';
    _.Column = 'tp-Col';                       // a column; actually a parent class where child could be any s; m or l combination 
    _.Row = 'tp-Row';                          // a row 

    _.RowCenter = 'tp-RowCenter';              // children vertical alignment
    _.RowTop = 'tp-RowTop';                    // children vertical alignment

    _.Control = 'tp-Col tp-Control';
    _.ControlLabel = 'tp-Col tp-ControlLabel';

    _.CtrlRow = 'tp-CtrlRow';

    /* containers       ----------------------------------------------------------------- */
    _.Block = 'tp-Block';

    _.Page = 'tp-Page';
    _.View = 'tp-View';
    _.DataView = 'tp-DataView';

    _.Window = 'tp-Window';
    _.WindowCaption = 'tp-WindowCaption';
    _.WindowCaptionText = 'tp-WindowCaptionText';
    _.WindowCaptionButtonBar = 'tp-WindowCaptionButtonBar';
    _.WindowCaptionButton = 'tp-WindowCaptionButton';
    _.WindowContentContainer = 'tp-WindowContentContainer';
    _.WindowContent = 'tp-WindowContent';
    _.WindowFooter = 'tp-WindowFooter';

    _.Panel = 'tp-Panel';
    _.ContainerPanel = 'tp-ContainerPanel';
    _.FlexPanel = 'tp-FlexPanel';
    _.FillPanel = 'tp-FillPanel';              // the last panel in a container

    _.SplitContainer = 'tp-SplitContainer';
    _.SplitContainerBar = 'tp-SplitContainerBar';

    _.PanelList = 'tp-PanelList';
    _.PanelListItem = 'tp-PanelListItem';

    _.Frame = 'tp-Frame';

    /* accordion */
    _.Accordion = 'tp-Accordion';
    _.AccordionItem = 'tp-AccordionItem';
    _.AccordionItemText = 'tp-AccordionItemText';
    _.AccordionItemContent = 'tp-AccordionItemContent';

    /* tab control */
    _.TabControl = 'tp-TabControl';
    _.Tab = 'tp-Tab';
    _.TabText = 'tp-TabText';
    _.TabContent = 'tp-TabContent';

    _.TabListStrip = 'tp-TabListStrip';
    _.TabList = 'tp-TabList';
    _.TabListComplement = 'tp-TabListComplement';

    _.TabContentList = 'tp-TabContentList';

    _.TabListSmall = 'tp-TabList-s';
    _.TabTextSmall = 'tp-TabText-s';
    _.TabListScrollButton = 'tp-TabListScrollButton';

    _.TabScrollIconLeft = 'fa fa-chevron-circle-left';
    _.TabScrollIconRight = 'fa fa-chevron-circle-right';

    /* menus                ----------------------------------------------------------------- */
    _.Menu = 'tp-Menu';
    _.ContextMenu = 'tp-ContextMenu';
    _.MenuItem = 'tp-MenuItem';
    _.MenuSeparator = 'tp-MenuSeparator';

    _.MenuItemImage = 'tp-MenuItemImage';
    _.MenuItemText = 'tp-MenuItemText';
    _.MenuItemArrow = 'tp-MenuItemArrow';
    _.MenuItemList = 'tp-MenuItemList';
    _.MenuItemSeparator = 'tp-MenuItemSeparator';

    /* html controls        ----------------------------------------------------------------- */
    _.HtmlComboBox = 'tp-HtmlComboBox';
    _.HtmlListBox = 'tp-HtmlListBox';
    _.HtmlNumberBox = 'tp-HtmlNumberBox'
    _.HtmlProgressBar = 'tp-HtmlProgressBar';

    /* controls             ----------------------------------------------------------------- */
    _.ControlStrip = 'tp-ControlStrip';         // for combo-boxes, buttoned edit-boxes etc.
    _.ControlText = 'tp-ControlText';           // a flex container of text in a control
    _.ControlButtons = 'tp-ControlButtons';     // a bar of buttons in a control
    _.ControlButton = 'tp-ControlButton';       // for combo-boxes, buttoned edit-boxes etc.

    _.DropDownBox = 'tp-DropDownBox';
    _.DropDownBoxItem = 'tp-DropDownBoxItem';



    _.Label = 'tp-Label';
    _.Button = 'tp-Button';
    _.ToolBar = 'tp-ToolBar';
    _.ToolButton = 'tp-ToolButton';
    _.TextBox = 'tp-TextBox';
    _.AutocompleteList = 'tp-AutocompleteList';
    _.Memo = 'tp-Memo';
    _.CheckBox = 'tp-CheckBox';
    _.CheckBoxText = 'tp-CheckBoxText';


    _.ButtonStrip = 'tp-ButtonStrip';


    /* combobox */
    _.ComboBox = 'tp-ComboBox'
    _.ComboBoxItem = 'tp-ComboBoxItem';

    _.ListBox = 'tp-ListBox';
    _.NumberBox = 'tp-NumberBox';
    _.ProgressBar = 'tp-ProgressBar';

    /* value slider         ----------------------------------------------------------------- */
    _.ValueSlider = 'tp-ValueSlider';
    _.RangeLabel = 'tp-RangeLabel';


    /* calendar             ----------------------------------------------------------------- */
    _.Calendar = 'tp-Calendar';
    _.CalendarHeaderRow = 'tp-CalendarHeaderRow';
    _.CalendarDaysRow = 'tp-CalendarDaysRow';
    _.CalendarRowWeek = 'tp-CalendarWeekRow';
    _.CalendarDateCell = 'tp-CalendarDateCell';

    /* date-box             ----------------------------------------------------------------- */
    _.DateBox = 'tp-DateBox';

    /* image and slider     ----------------------------------------------------------------- */
    _.FlexImage = 'tp-FlexImage';
    _.ImageSlider = 'tp-ImageSlider';
    _.ImageSliderNext = 'tp-ImageSliderNext';
    _.ImageSliderPrev = 'tp-ImageSliderPrev';

    /* grid                 ----------------------------------------------------------------- */
    _.Grid = 'tp-Grid';
    _.BrowserGrid = 'tp-BrowserGrid';

    _.GridToolBar = 'tp-GridToolBar';
    _.GridToolButton = 'tp-GridToolButton';

    _.GridGroups = 'tp-Grid-Groups';
    _.GridColumns = 'tp-Grid-Columns';
    _.GridFilter = 'tp-Grid-Filter';
    _.GridViewport = 'tp-Grid-Viewport';
    _.GridFooter = 'tp-Grid-Footer';
    _.GridBottom = 'tp-Grid-Bottom';

    _.GridColumnsContent = 'tp-Grid-Columns-Content';
    _.GridFilterContent = 'tp-Grid-Filter-Content';
    _.GridRowsContent = 'tp-Grid-Rows-Content';
    _.GridFooterContent = 'tp-Grid-Footer-Content';
    _.GridBottomContent = 'tp-Grid-Bottom-Content';

    _.GridNode = 'tp-Grid-Node';

    _.GridColumn = 'tp-Grid-Col';
    _.GridRow = 'tp-Grid-Row';

    _.GridGroup = 'tp-Grid-Group';
    _.GridGroupText = 'tp-Grid-Group-Text';
    _.GridGroupFooter = 'tp-Grid-Group-Footer';
    _.GridGroupExpander = 'tp-Grid-Group-Expander';

    _.GridCell = 'tp-Grid-Cell';
    _.GridGroupCell = 'tp-Grid-Group-Cell';
    _.GridGroupCellLast = 'tp-Grid-Group-Cell-Last';
    _.GridGroupCellTube = 'tp-Grid-Group-Cell-Tube';

    _.GridCellSum = 'tp-Grid-Cell-Sum';
    _.GridFooterCellSum = 'tp-Grid-Footer-Cell-Sum';

    _.GridColumnSort = 'tp-Grid-Col-Sort';
    _.GridColumnText = 'tp-Grid-Col-Text';
    _.GridColumnSorter = 'tp-Grid-Col-Sorter';
    _.GridColumnResizer = 'tp-Grid-Col-Resizer';
    _.GridColumnFilter = 'tp-Grid-Col-Filter';

    _.GridColumnDragSource = 'tp-Grid-Col-Drag-Source';
    _.GridColumnDropTarget = 'tp-Grid-Col-Drop-Target';

    _.GridFilterTextBox = 'tp-Grid-Col-Filter-Text-Box';

    _.GridInplaceEditor = 'tp-Grid-Inplace-Editor';


    /* icons                ----------------------------------------------------------------- */
    _.IcoArrowDown = 'fa fa-caret-down'; // 'fa fa-caret-down'  ti ti-ArrowDown
    _.IcoCalendar = 'fa fa-calendar';
    _.IcoCheck = 'fa fa-check-square-o';
    _.IcoUnCheck = 'fa fa-square-o';

    _.IcoToolBarInsert = 'fa fa-plus-circle';
    _.IcoToolBarDelete = 'fa fa-minus-circle';
    _.IcoToolBarEdit = 'fa fa-pencil-square-o';         // fa fa-pencil
    _.IcoToolBarFind = 'fa fa-search ';                 // fa fa-filter


    return Class;
})();

tp.DragContext = (function (BaseClass) {
    function Class(Element, Listener) {
        // FROM: https://stackoverflow.com/questions/30231880/setcapture-and-releasecapture-in-chrome
        BaseClass.call(this);

        var IsDragging = false;

        Element.addEventListener('mousedown', function (e) {
            IsDragging = true;
            Listener.DragStart(e);            
        });

        document.addEventListener("mouseup", function (e) {
            IsDragging = false;
            Listener.DragEnd(e);
        }, true);

        document.addEventListener("mousemove", function (e) {
            if (!IsDragging)
                return;
            Listener.DragMove(e);
        }, true);

        this.IsDragging = function () { return IsDragging; };

    }
    var base = tp.SetBaseClass(Class, BaseClass);
    var _ = Class.prototype;

    return Class;
})(Object);

tp.Splitter = (function (BaseClass) {

    function Class(Selector, SideBarSelector) {
        BaseClass.call(this);
        this.Handle = tp(Selector);
        this.SideBar = tp(SideBarSelector);

        this.DragContext = new tp.DragContext(this.Handle, this);
 
    }
    var base = tp.SetBaseClass(Class, BaseClass);
    var _ = Class.prototype;

    _.Handle = '';
    _.SideBar = null;

    var OldCursor = '';

    _.DragStart = function (e) {
        OldCursor = document.body.style.cursor;
        document.body.style.cursor = 'col-resize';
        tp.AddClass(document.body, 'tp-UnSelectable');

    };
    _.DragMove = function (e) {
        var clientX = e.clientX;

        clientX = Math.max(200, clientX);
        clientX = Math.min(500, clientX);

        this.SideBar.style.width = clientX + 'px';
    };
    _.DragEnd = function (e) {
        tp.RemoveClass(document.body, 'tp-UnSelectable');
        document.body.style.cursor = OldCursor;
    };

    return Class;
})(tp.tpObject);
  
tp.TreeView = (function (BaseClass) {
    function Class(Parent, CssClasses, ElementOrSelector) {
        BaseClass.call(this, Parent, CssClasses, ElementOrSelector);
    }
    var base = tp.SetBaseClass(Class, BaseClass);
    var _ = Class.prototype;

    /*
    <ul id="tv" class="tp-TreeView">
        <li>1.1
            <ul>
                <li>1.1.1
                    <ul>
                        <li>1.1.1.1</li>
                        <li>1.1.1.2</li>
                    </ul>
                </li>
                <li>1.1.2</li>
                <li>1.1.3
                    <ul>
                        <li>1.1.3.1</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>1.2</li>
        <li>1.3
            <ul>
                <li>1.3.1</li>
                <li>1.3.2
                    <ul>
                        <li>1.3.2.1</li>
                        <li>1.3.2.2</li>
                    </ul>
                </li>
                <li>1.3.3</li>
            </ul>
        </li>
    </ul>    
    */

    /* overrides */
    _.InitClass = function () {
        base.InitClass.call(this);

        this.tpClass = 'tp.TreeView';
        this.fElementType = 'div';
    };
    _.HandleCreated = function () {
        /// <summary>Called by CreateHandle() after all processing is done, that is after handle creation but BEFORE option processing</summary>

        base.HandleCreated.call(this);
        this.HookMessages(tp.EventGroup.Click);
    };
    _.CreateParamsProcessed = function () {
        base.CreateParamsProcessed.call(this);

        //document.body.tagName
        //document.body.parentElement
        //children

        this.Prepare();
        this.Collapse();

    };

    _.OnEvent = function (e) {
        base.OnEvent.call(this, e);

        var Args, i, ln, S, el, List, Type = tp.Events.ToTripous(e.type);

        if (tp.Events.Click === Type) {
            if (tp.HasClass(e.target, tp.Classes.Expanded) || tp.HasClass(e.target, tp.Classes.Collapsed)) {
                this.Toggle(e.target);
            }
        }
    };

    /* public */
    _.GetNodeListParent = function (Parent) {
        var i, ln, el;

        if (Parent.tagName.toLowerCase() === 'ul') {
            return Parent;
        }

        if (Parent.tagName.toLowerCase() === 'li') {
            for (i = 0, ln = Parent.children.length; i < ln; i++) {
                el = Parent.children[i];
                if (el.tagName.toLowerCase() === 'ul') {
                    return el;
                }
            }
        }

        return null;
    };
    _.GetChildNodes = function (Parent) {
        Parent = this.GetNodeListParent(Parent);

        if (Parent && Parent.children.length > 0)
            return Parent.children;

        return [];
    };
    _.HasChilNodes = function (Parent) {
        return this.GetChildNodes(Parent).length > 0;
    };
    _.Prepare = function () {
        var List = tp.Select('li', this.Handle);
        var i, ln, el;
        for (i = 0, ln = List.length; i < ln; i++) {
            el = List[i];
            if (this.HasChilNodes(el)) {
                tp.AddClass(el, tp.Classes.Expanded);
            } else {
                tp.AddClass(el, tp.Classes.None);
            }
        }
    };
    _.ShowChildNodeList = function (Parent, Flag) {
        var i, ln;

        Parent = this.GetNodeListParent(Parent);
        if (Parent) {
            if (Flag) {
                Parent.style.display = '';
            } else {
                Parent.style.display = 'none';
            }
        }
    };
    _.Collapse = function (Node) {
        Node = Node || this.Handle;

        var i, ln, el, List = this.GetChildNodes(Node);
        if (List.length > 0) {
            for (i = 0, ln = List.length; i < ln; i++) {
                el = List[i];
                this.Collapse(el);
            }

            if (Node !== this.Handle) {
                tp.RemoveClass(Node, tp.Classes.None);
                tp.RemoveClass(Node, tp.Classes.Expanded);
                tp.AddClass(Node, tp.Classes.Collapsed);
                this.ShowChildNodeList(Node, false);
            }

        }

    };
    _.Expand = function (Node) {
        Node = Node || this.Handle;

        if (Node.tagName.toLowerCase() === 'li' && this.HasChilNodes(Node)) {
            tp.RemoveClass(Node, tp.Classes.None);
            tp.RemoveClass(Node, tp.Classes.Collapsed);
            tp.AddClass(Node, tp.Classes.Expanded);
        }

        this.ShowChildNodeList(Node, true);

    };
    _.Toggle = function (Node) {
        if (Node && Node.tagName.toLowerCase() === 'li' && this.HasChilNodes(Node)) {
            if (this.IsExpanded(Node))
                this.Collapse(Node);
            else
                this.Expand(Node);
        }
    };
    _.IsExpanded = function (Node) {
        var Parent = this.GetNodeListParent(Node);
        if (Parent) {
            var Flag = Parent.style.display && Parent.style.display === 'none';
            return !Flag;
        }

        return false;
    };



    return Class;
})(tp.Element);

tp.Accordion = (function (BaseClass) {
    function Class(Parent, CssClasses, ElementOrSelector) {
        BaseClass.call(this, Parent, CssClasses, ElementOrSelector);
    }
    var base = tp.SetBaseClass(Class, BaseClass);
    var _ = Class.prototype;

    /*

    // NOTE: those css classes are not required in order to create the control
<div id="Accordion" class="tp-Accordion" data-setup="{AllowMultiExpand: false}">
    <div>
        <div class="tp-Title">Item 1</div>
        <div>
            <p>Hi there</p>
            <p>Ola kala ki ola oraia</p>
        </div>
    </div>
    <div>
        <div class="tp-Title">Item 2</div>
        <div>
            <p>Hi there 22222</p>
            <p>Ola kala ki ola oraia  222</p>
        </div>
    </div>
</div>
    */

 

    /* private */
    _.FindClickedItem = function (e) {
        var el, elCaption, i, ln, List = this.Handle.children;
        for (var i = 0, ln = List.length; i < ln; i++) {
            el = List[i];
            elCaption = el.children.length > 0 ? el.children[0] : null;
            if (elCaption && (elCaption === e.target) || tp.ElementContains(elCaption, e.target))
                return el;

            //if (tp.ElementContains(el, e.target) && (elCaption === e.target)) {
            //    return el;
            //}
        }

        return null;
    };
    _.FindItemIndex = function (el) {
        var el, i, ln, List = this.Handle.children;
        for (var i = 0, ln = List.length; i < ln; i++) {
            if (el === List[i])
                return i;
        }

        return -1;
    };

    /* properties */
    tp.Property('AllowMultiExpand', _, false);


    /* overrides */
    _.InitClass = function () {
        base.InitClass.call(this);

        this.tpClass = 'tp.Accordion';
        this.fElementType = 'div';
    };
    _.HandleCreated = function () {
        /// <summary>Called by CreateHandle() after all processing is done, that is after handle creation but BEFORE option processing</summary>

        base.HandleCreated.call(this);

        if (this.Handle) {
            this.HookMessage(tp.Events.Click);
        }
    };

    _.OnEvent = function (e) {
        base.OnEvent.call(this, e);
        var el, i, ln, List, Type = tp.Events.ToTripous(e.type);

        if (tp.Events.Click === Type) {
            el = this.FindClickedItem(e);
            if (el) {
                i = this.FindItemIndex(el);
                var IsExpanded = tp.HasClass(el, tp.Classes.Expanded);
                this.Expand(!IsExpanded, i);

            }
        }
    };


    /* public */
    _.Expand = function (Flag, ItemIndex) {
        /// <summary>Expands or collapses on or all items
        /// <param name="Flag" type="Boolean">true expands, false collapses</param>
        /// <param name="ItemIndex" type="Integer">To expand/collapse all items pass -1, else the item index</param>
        //</summary>


        var List = this.Handle.children;

        if (ItemIndex < 0) {
            for (var i = 0, ln = List.length; i < ln; i++) {
                tp.RemoveClass(List[i], tp.Classes.Expanded);
            }

            if (Flag) {
                for (var i = 0, ln = List.length; i < ln; i++) {
                    tp.AddClass(List[i], tp.Classes.Expanded);
                }
            }
        } else {
            if (!this.AllowMultiExpand) {
                for (var i = 0, ln = List.length; i < ln; i++) {
                    tp.RemoveClass(List[i], tp.Classes.Expanded);
                }
            }

            var el = this.Handle.children[ItemIndex];
            if (Flag) {
                tp.AddClass(el, tp.Classes.Expanded);
            } else {
                tp.RemoveClass(el, tp.Classes.Expanded);
            }
        }



    }


    return Class;
})(tp.Element);