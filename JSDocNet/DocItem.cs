using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{

    /// <summary>
    /// Represents a documentation item.
    /// <para>Contains an Items property which is used by items like classes or functions that contain DocItemm sub-items</para>
    /// </summary>
    public class DocItem
    {
        string fName;
        string fMemberOf;
        string fHRef;
        string fCategory;
        bool fIsStatic;

        /* private */
        List<Event> GetEvents()
        {
            // @fires {tp.Args|OnAnyEvent} Description
            List<Block> List = DocLet.Blocks.Where(item => item.TagName == Tags.Triggers).ToList();
            if (List != null && List.Count > 0)
            {
                List<Event> Events = new List<Event>();

                string BlockText;
                Event Event;
                foreach (Block B in List)
                {
                    BlockText = GetMultiLineBlockValue(B);
                    if (!string.IsNullOrWhiteSpace(BlockText))
                    {
                        Event = new Event(this, BlockText);
                        Events.Add(Event);
                    }
                }

                Events = Events.OrderBy(o => o.Name).ToList();
            }

            return null;
        }
        List<FuncParam> GetParams()
        {
            List<FuncParam> Result = null;
            //@param {String|Element} Selector - A selector or an element

            List<Block> List = DocLet.Blocks.Where(item => item.TagName == Tags.Param).ToList();
            if (List != null && List.Count > 0)
            {
                FuncParam Item;
                Result = new List<FuncParam>();
                foreach (Block B in List)
                {
                    string BlockText = GetMultiLineBlockValue(B);
                    if (!string.IsNullOrWhiteSpace(BlockText))
                    {
                        Item = new FuncParam(this, BlockText);
                        Result.Add(Item);
                    }
                }
            }

            return Result;
        }
        FuncReturn GetReturn()
        {
            FuncReturn Result = null;
            string BlockText = GetMultiLineTagValue(Tags.Return);
            if (!string.IsNullOrWhiteSpace(BlockText))
                Result = new FuncReturn(this, BlockText);
            return Result;
        }
        List<Error> GetThrows()
        {
            List<Error> Result = null;

            List<Block> List = DocLet.Blocks.Where(item => item.TagName == Tags.Throws).ToList();
            if (List != null && List.Count > 0)
            {
                Error Item;
                Result = new List<Error>();
                foreach (Block B in List)
                {
                    string BlockText = GetMultiLineBlockValue(B);
                    Item = new Error(this, BlockText);
                    Result.Add(Item);
                }

                Result = Result.OrderBy(o => o.Type).ToList();
            }

            return Result;
        }
        List<string> GetImplements()
        {
            // @implements Interface1 Interface2 InterfaceN
            string S = GetSingleLineTagValue(Tags.Implements);
            if (!string.IsNullOrWhiteSpace(S))
            {
                S = S.Trim();
                string[] Parts = S.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                if (Parts != null && Parts.Length > 0)
                    return new List<string>(Parts);
            }
 
            return null;
        }
        

        void ParseExamples()
        {
            List<Block> List = DocLet.Blocks.Where(item => item.TagName == Tags.Example).ToList();
            if (List != null && List.Count > 0)
            {
                Examples = new List<string>();
                foreach (Block B in List)
                {
                    string BlockText = GetMultiLineBlockValue(B);
                    Examples.Add(BlockText);
                }
            }
        }
        void ParseTutorials()
        {
            List<Block> List = DocLet.Blocks.Where(item => item.TagName == Tags.Tutorial).ToList();
            if (List != null && List.Count > 0)
            {
                Tutorials = new List<string>();
                foreach (Block B in List)
                {
                    string BlockText = GetSingleLineBlockValue(B);
                    Tutorials.Add(BlockText);
                }
            }
        }
        void ParseSee()
        {
            List<Block> List = DocLet.Blocks.Where(item => item.TagName == Tags.See).ToList();
            if (List != null && List.Count > 0)
            {
                SeeAlso = new List<string>();
                foreach (Block B in List)
                {
                    string BlockText = GetSingleLineBlockValue(B);
                    SeeAlso.Add(BlockText);
                }
            }
        }


        string GetSingleLineTagValue(string TagName)
        {
            Block B = DocLet.Find(TagName);
            return GetSingleLineBlockValue(B);
        }
        string GetMultiLineTagValue(string TagName)
        {
            Block B = DocLet.Find(TagName);
            return GetMultiLineBlockValue(B);
        }
        bool SingleLineTagExists(string TagName)
        {
            Block B = DocLet.Find(TagName);
            return B != null;
        }
        string GetSingleLineBlockValue(Block B)
        {
            if (B != null)
            {
                return B.Lines[0].Trim();
            }

            return string.Empty;
        }
        string GetMultiLineBlockValue(Block B)
        {
            StringBuilder SB = new StringBuilder();
            if (B != null)
            {
                string Line;
                for (int i = 0; i < B.Lines.Count; i++)
                {
                    Line = B.Lines[i];
                    //if (i > 0)
                    //    Line = Line.TrimStart(new char[] { ' ', '-', '*'});
                    SB.AppendLine(Line);
                }
            }

            return SB.ToString();
        }

        void Add(DocItem Item)
        {
            if (Items == null)
                Items = new List<DocItem>();

            Items.Add(Item);
        }

        void Parse()
        {
            string BlockText;
            string sName, S, S2;
            bool IsNameTypeTag;
            int Index;



            // parse name tags (they are all multi-line)
            foreach (string NameTag in Tags.NameTags)
            {
                BlockText = GetMultiLineTagValue(NameTag);
                if (!string.IsNullOrWhiteSpace(BlockText))
                {
                    sName = string.Empty;
                    if (NameTag == Tags.Constructor)
                    {
                        sName = BlockText.Trim();
                        if (!string.IsNullOrWhiteSpace(sName))
                        {
                            // member of + description
                            Index = sName.IndexOfAny(new char[] { '\r', '\n', ' ' });
                            if (Index == -1)
                            {
                                MemberOf = sName;
                            }
                            else
                            {
                                MemberOf = sName.Substring(0, Index);
                                S = sName.Remove(0, MemberOf.Length).Trim();

                                if (!string.IsNullOrWhiteSpace(S))
                                    Description = S.TrimStart(new char[] { ' ', '-' });
                            }
                        }

                        break;
                    }



                    IsNameTypeTag = Tags.IsNameTypeTag(NameTag);

                    // type 
                    if (IsNameTypeTag)
                    {
                        // @tag {Type} [MemberOf]Name [Description]

                        S = string.Empty;
                        S2 = Sys.ExtractBracketedString(BlockText, out S);

                        IsNameTypeTag = !string.IsNullOrWhiteSpace(S);

                        if (IsNameTypeTag)
                        {
                            if (!string.IsNullOrWhiteSpace(S))
                                Type = S;

                            if (!string.IsNullOrWhiteSpace(S2))
                            {
                                sName = S2.Trim();
                            }
                        }

                    }


                    if (!IsNameTypeTag)
                    {
                        // @tag [MemberOf]Name [Description] 
                        sName = BlockText.Trim();
                    }



                    // name + description
                    Index = sName.IndexOfAny(new char[] { '\r', '\n', ' ' });
                    if (Index == -1)
                    {
                        Name = sName;
                    }
                    else
                    {
                        Name = sName.Substring(0, Index);
                        S = sName.Remove(0, Name.Length).Trim();

                        //S = sName.Substring(Index);
                        if (!string.IsNullOrWhiteSpace(S))
                            Description = S.TrimStart(new char[] { ' ', '-' });
                    }

                    break;

                }

            }




            // description
            if (string.IsNullOrWhiteSpace(Description))
            {
                Description = GetMultiLineTagValue(Tags.Description);
            }

            if (!string.IsNullOrWhiteSpace(Description))
            {
                string[] Parts = Description.Split(new char[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                StringBuilder SB = new StringBuilder();
                foreach (string s in Parts)
                    SB.AppendLine(s.TrimStart(new char[] { ' ', '*' }));
                Description = SB.ToString();
            }

            // name
            if (string.IsNullOrWhiteSpace(Name))
                Name = GetSingleLineTagValue(Tags.Name);

            // name + memberof
            if (!string.IsNullOrWhiteSpace(Name))
            {
                Index = Name.LastIndexOf('.');
                if (Index != -1)
                {
                    S = Name;
                    Name = S.Substring(Index + 1);
                    MemberOf = S.Substring(0, Index);
                }
            }

            // memberof
            if (string.IsNullOrWhiteSpace(MemberOf))
                MemberOf = GetSingleLineTagValue(Tags.MemberOf);

            // type
            if (string.IsNullOrWhiteSpace(Type))
                Type = GetSingleLineTagValue(Tags.Type);

            // ensure memberof
            if (string.IsNullOrWhiteSpace(MemberOf))
            {
                if (ItemType == DocItemType.Namespace || ItemType == DocItemType.Callback || ItemType == DocItemType.Interface)
                    MemberOf = "global";
                else
                    MemberOf = Parser.Global.ContextName;
            }

            // default
            Default = GetSingleLineTagValue(Tags.Default);


            if (ItemType == DocItemType.Class || ItemType == DocItemType.Enum)
            {
                // extends
                foreach (string NameTag in Tags.ExtendsTags)
                {
                    if (string.IsNullOrWhiteSpace(Extends))
                        Extends = GetSingleLineTagValue(NameTag);
                }

                // events
                Events = GetEvents();

                // implements
                Implements = GetImplements();
            }

            // category
            if (ItemType == DocItemType.Class || this.ItemType == DocItemType.Function)
                Category = GetSingleLineTagValue(Tags.Category);

            // access 
            S = GetSingleLineTagValue(Tags.Access);
            if (!string.IsNullOrWhiteSpace(S))
            {
                if (S.IsSameText("private"))
                    Access = Access.Private;
                else if (S.IsSameText("protected"))
                    Access = Access.Protected;
                else if (S.IsSameText("public"))
                    Access = Access.Public;
            }

            // flags
            IsReadOnly = DocLet.Find(Tags.ReadOnly) != null;
            IsStatic = DocLet.Find(Tags.Static) != null;
            IsDeprecated = DocLet.Find(Tags.Deprecated) != null;
            IsBitField = DocLet.Find(Tags.BitField) != null;
            IsFunction = DocLet.Find(Tags.Function) != null; // when is namespace or enum and has a callable function with the same name
            IsEventArgs = DocLet.Find(Tags.EventArgs) != null;

            // is function
            IsFunction = (ItemType == DocItemType.Function || ItemType == DocItemType.Constructor || ItemType == DocItemType.Callback)
                                    || ((ItemType == DocItemType.Namespace || ItemType == DocItemType.Enum) && (DocLet.Find(Tags.Function) != null));

            // Params + Return
            if (IsFunction)
            {
                Params = GetParams();
                if (ItemType != DocItemType.Constructor)
                    Return = GetReturn();
            }

            // Throws
            if (IsFunction || ItemType == DocItemType.Property)
                Throws = GetThrows();


            ParseExamples();
            ParseTutorials();
            ParseSee();
        }
        void ParseAfter()
        {
            if (string.IsNullOrWhiteSpace(Name))
            {
                string[] StartWords = { "var", "function", "class" };
                string[] TripousProp = { "tp.Property", "tp.Constant" };
                string[] TripousFunc = { "_." };
                string Line;
                int Index, Index2;
                int Counter = 0;

                switch (ItemType)
                {
                    case DocItemType.Namespace:
                    case DocItemType.Class:
                    case DocItemType.Field:
                    case DocItemType.Constant:
                    case DocItemType.Property:
                    case DocItemType.Function:
                    case DocItemType.Enum:

                        for (int i = this.DocLet.LastLineIndex + 1; Counter < 3 && i < DocLet.Lines.Length; i++)
                        {
                            Counter++;

                            Line = DocLet.Lines[i].Trim();
                            foreach (string W in StartWords)
                            {
                                if (Line.StartsWith(W))
                                {
                                    Line = Line.Remove(0, W.Length);
                                    Line = Line.TrimStart();
                                    break;
                                }
                            }

                            if (!string.IsNullOrWhiteSpace(Line))
                            {

                                if (this.ItemType == DocItemType.Property || this.ItemType == DocItemType.Constant)
                                {
                                    // tp.Property('Name', _, function () ....
                                    // tp.Constant('DateDelimiter', _, '-')

                                    foreach (string W in TripousProp)
                                    {
                                        if (Line.StartsWith(W))
                                        {
                                            Index = Line.IndexOf('\'');
                                            if (Index != -1)
                                            {
                                                Index2 = Line.IndexOf('\'', Index + 1);
                                                if (Index2 != -1)
                                                    this.Name = Line.Substring(Index + 1, Index2 - (Index + 1));
                                            }
                                            break;
                                        }
                                    }
                                }
                                else if (this.ItemType == DocItemType.Function || this.ItemType == DocItemType.Field)
                                {
                                    foreach (string W in TripousFunc)
                                    {
                                        // _.Func = function () { };
                                        // _.fName = '';

                                        if (Line.StartsWith(W))
                                        {
                                            Line = Line.Remove(0, W.Length);

                                            Index = Line.IndexOfAny(new char[] { ' ', '=' });

                                            if (Index != -1)
                                            {
                                                this.Name = Line.Substring(0, Index);
                                            }
                                            break;
                                        }
                                    }
                                }


                                Index = Line.IndexOf(' ');

                                if (Index != -1)
                                {
                                    this.Name = Line.Substring(0, Index);
                                }


                                break;
                            }

                        }

                        break;

                }
            }

            if (IsFunction)
            {
                ParseAfter_ParamNames();
            }

        }
        void ParseAfter_ParamNames()
        {
            if (this.Params == null)
            {
                int Counter = 0;
                string Line;
                int Index2, Index;
                for (int i = this.DocLet.LastLineIndex + 1; Counter < 3 && i < this.DocLet.Lines.Length; i++)
                {
                    Counter++;

                    Line = this.DocLet.Lines[i].Trim();
                    if (!string.IsNullOrWhiteSpace(Line))
                    {
                        Index = Line.IndexOf('(');
                        if (Index != -1)
                        {
                            Index2 = Line.IndexOf(')', Index + 1);
                            if (Index2 != -1)
                            {
                                string S = Line.Substring(Index + 1, Index2 - (Index + 1));
                                if (!string.IsNullOrWhiteSpace(S))
                                {
                                    string[] Parts = S.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                                    if (Parts.Length > 0)
                                    {
                                        FuncParam Param;
                                        this.Params = new List<FuncParam>();
                                        foreach (var ParamName in Parts)
                                        {
                                            S = ParamName.Trim();
                                            Param = FuncParam.CreateParam(this, S);
                                            this.Params.Add(Param);
                                        }
                                    }
                                }
                            }

                            return;

                        }
                    }

                }
            }


        }

        /* protected */
        internal void FindParent()
        {
            this.Parent = this.MemberOf == "global" ? Parser.Global : Parser.Global.FlatList.FirstOrDefault(item => item.FullName == this.MemberOf);

            if (this.Parent != null)
                this.Parent.Add(this);
        }
        internal void Sort()
        {
            if (this.Items != null)
            {
                this.Items = this.Items.OrderBy(o => o.FullName).ToList();
                foreach (var Item in this.Items)
                    Item.Sort();
            }
        }


        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        internal DocItem(Parser Parser, DocLet DocLet, DocItemType ItemType)
        {
            this.Parser = Parser;
            this.DocLet = DocLet;
            this.ItemType = ItemType;

            if (DocLet != null)
            {
                this.FilePath = DocLet.FilePath;
                this.FirstLineIndex = DocLet.FirstLineIndex;
                this.LastLineIndex = DocLet.LastLineIndex;

                Parse();
                ParseAfter();
            }

            this.DocLet = null;
        }

        /* public */
        /// <summary>
        /// Override
        /// </summary>
        public override string ToString()
        {
            return string.Format("[{0}]: {1}", ItemType, FullName);
        }

        /* public */
        /// <summary>
        /// Finds and returns a DocItem by its full-name, i.e. MemberOf.Name, if any, else null.
        /// </summary>
        public DocItem Find(string FullName)
        {
            return Items == null ? null : Items.FirstOrDefault(item => item.FullName == FullName);
        }
        /// <summary>
        /// Returns a list of DocItem items of a certain type
        /// </summary>
        public List<DocItem> GetByType(DocItemType ItemType)
        {
            List<DocItem> Result = new List<DocItem>();
            if (Items != null)
            {
                Result.AddRange(Items.Where(item => item.ItemType == ItemType));
            }
            return Result;
        }

        /// <summary>
        /// Returns a list of DocItem items of a certain type
        /// </summary>
        public List<DocItem> GetInterfaces()
        {
            return GetByType(DocItemType.Interface);
        }
        /// <summary>
        /// Returns a list of DocItem items of a certain type
        /// </summary>
        public List<DocItem> GetClasses()
        {
            return GetByType(DocItemType.Class);
        }
        /// <summary>
        /// Returns a list of DocItem items of a certain type
        /// </summary>
        public List<DocItem> GetEnums()
        {
            return GetByType(DocItemType.Enum);
        }
        /// <summary>
        /// Returns a list of DocItem items of a certain type
        /// </summary>
        public List<DocItem> GetConstants()
        {
            return GetByType(DocItemType.Constant);
        }
        /// <summary>
        /// Returns a list of DocItem items of a certain type
        /// </summary>
        public List<DocItem> GetFields()
        {
            return GetByType(DocItemType.Field);
        }
        /// <summary>
        /// Returns a list of DocItem items of a certain type
        /// </summary>
        public List<DocItem> GetProperties()
        {
            return GetByType(DocItemType.Property);
        }
        /// <summary>
        /// Returns a list of DocItem items of a certain type
        /// </summary>
        public List<DocItem> GetFunctions()
        {
            return GetByType(DocItemType.Function);
        }
        /// <summary>
        /// Returns a list of DocItem items of a certain type
        /// </summary>
        public List<DocItem> GetCallbacks()
        {
            return GetByType(DocItemType.Callback);
        }
        /// <summary>
        /// Returns the constructor DocItem of this item, if any, else null.
        /// </summary>
        public DocItem GetConstructor()
        {
            return Items == null ? null : Items.FirstOrDefault(item => item.ItemType == DocItemType.Constructor);
        }

        /* properties */
        /// <summary>
        /// DocItem type
        /// </summary>
        public DocItemType ItemType { get; private set; }
        /// <summary>
        /// The parent DocItem if any, else null.
        /// </summary>
        public DocItem Parent { get; private set; }
        /// <summary>
        /// The DocLet of this item.
        /// </summary>
        internal DocLet DocLet { get; private set; }
        /// <summary>
        /// The parser
        /// </summary>
        internal Parser Parser { get; private set; }


        /// <summary>
        /// The memberof
        /// </summary>
        public string MemberOf
        {
            get
            {
                if (ItemType == DocItemType.Callback || ItemType == DocItemType.Interface)
                    return "global";

                if (ItemType == DocItemType.Global)
                    return "";

                return fMemberOf;
            }
            set { fMemberOf = value; }
        }
        /// <summary>
        /// The name as it is specified in any of the name block tags.
        /// </summary>
        public string Name
        {
            get
            {
                if (ItemType == DocItemType.Global)
                    return "";

                if (ItemType == DocItemType.Constructor)
                    return "Constructor";


                return fName;
            }
            set { fName = value; }

        }
        /// <summary>
        /// The full-name, i.e. MemberOf.Name
        /// </summary>
        public string FullName
        {
            get
            {
                if (ItemType == DocItemType.Global)
                    return "global";

                if (ItemType == DocItemType.Constructor)
                    return MemberOf + ".Constructor";

                if (!string.IsNullOrWhiteSpace(MemberOf) && (MemberOf != "global"))
                    return string.Format("{0}.{1}", MemberOf, Name);

                return Name;
            }
        }
        /// <summary>
        /// A default href (page url) for this item.
        /// <para>Denotes the url of the static page of this item.</para>
        /// </summary>
        public string HRef
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(fHRef))
                    return fHRef;

                bool IsOwnPageItem = Parser.Global.IsTopItem(ItemType) ||  ItemType == DocItemType.Global;

                string Result = IsOwnPageItem ? this.FullName + ".html" : this.Parent.FullName + ".html#" + this.Name;
                return Result;
            }
            set { fHRef = value; }

        }
        /// <summary>
        /// The description as it is specified in a @description tag or in any of the name tags.
        /// </summary>
        public string Description { get; private set; }
        /// <summary>
        /// The type of the item.
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public string Type { get; private set; }
        /// <summary>
        /// The default value of the item.
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public string Default { get; private set; }
        /// <summary>
        /// The @extends tag value
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public string Extends { get; private set; }
        /// <summary>
        /// The implements list, denotes the interfaces implement by a class.
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public List<string> Implements { get; private set; }
        /// <summary>
        /// The value of the @category tag
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public string Category
        {
            get
            {
                bool Flag = ItemType == DocItemType.Class || this.ItemType == DocItemType.Function;
                return Flag ? this.fCategory : string.Empty;
            }
            private set { this.fCategory = value; }
        }

        /// <summary>
        /// Flag
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public bool IsReadOnly { get; private set; }
        /// <summary>
        /// Flag
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public bool IsStatic
        {
            get
            {
                bool IsMember = ItemType == DocItemType.Constant || ItemType == DocItemType.Field || ItemType == DocItemType.Property || ItemType == DocItemType.Function;

                bool Flag = (ItemType == DocItemType.Enum)
                            || ((ItemType == DocItemType.Class) && fIsStatic)
                            || (IsMember && fIsStatic)
                            || (IsMember && (this.Parent is DocItem) && ((this.Parent as DocItem).IsStatic))
                            || (IsMember && (this.Parent is DocItem) && ((this.Parent as DocItem).ItemType == DocItemType.Namespace || (this.Parent as DocItem).ItemType == DocItemType.Global))
                             ;

                return Flag;

            }
            private set { fIsStatic = value; }
        }
        /// <summary>
        /// Flag
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public bool IsDeprecated { get; private set; }
        /// <summary>
        /// Flag
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public bool IsBitField { get; private set; }
        /// <summary>
        /// Flag
        /// <para>Exists only when this item requires that information</para>
        /// <para>NOTE: Used when is namespace or enum and has a callable function with the same name</para>
        /// </summary>
        public bool IsFunction { get; private set; } // when is namespace or enum and has a callable function with the same name
        /// <summary>
        /// Flag
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public bool IsEventArgs { get; private set; }


        /// <summary>
        /// The @access tag value
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public Access Access { get; private set; }
        /// <summary>
        /// A list with the values of all @fires tags
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public List<Event> Events { get; private set; }

        /// <summary>
        /// A list of function parameters
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public List<FuncParam> Params { get; set; }
        /// <summary>
        /// The @returns tag
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public FuncReturn Return { get; set; }
        /// <summary>
        /// A list with the values of all @throws tags
        /// <para>Exists only when this item requires that information</para>
        /// </summary>
        public List<Error> Throws { get; set; }

        /// <summary>
        /// The list with the examples. May by null.
        /// </summary>
        public List<string> Examples { get; private set; }
        /// <summary>
        /// The list with the See Also. May by null.
        /// </summary>
        public List<string> SeeAlso { get; private set; }
        /// <summary>
        /// The list with the tutorials. May by null.
        /// </summary>
        public List<string> Tutorials { get; private set; }
        /// <summary>
        /// The list with the child items. May by null.
        /// </summary>
        public List<DocItem> Items { get; private set; }

 
        /// <summary>
        /// The path to the javascript source file
        /// </summary>
        public string FilePath { get; private set; }
        /// <summary>
        /// The index of the first line of this item in the javascript source file 
        /// </summary>
        public int FirstLineIndex { get; private set; }
        /// <summary>
        /// The index of the last line of this item in the javascript source file 
        /// </summary>
        public int LastLineIndex { get; set; }

    }










}
