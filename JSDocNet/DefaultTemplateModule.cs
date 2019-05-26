using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.Threading.Tasks;
using System.IO;

/*  
 Namespace
    Functions
    Classes
    EventArgs
    Constants
    Fields
    Properties
    Enums
    Callbacks

Class
    Constructor
    Constants
    Fields
    Properties
    Functions
    Events
    EventArgs
    Enums

     */

namespace JSDocNet
{
    internal class DefaultTemplateModule: IDocTemplateModule
    {
        const string LinkTagStart = "{" + Tags.Link + " ";
        const string TutorialStartTag = "{" + Tags.Tutorial + " ";

        DocItemGlobal Global;
        Settings Settings;

        string OutputFolder;
        //string TutorialOutputFolder;
        string TemplateHtmlFolder;
        string IndexFilePath;

        string HeaderText;
        string FooterText;
        string DateText;

        List<DocItem> Namespaces;
        Dictionary<string, string> Templates = new Dictionary<string, string>();
        List<Tutorial> Tutorials = new List<Tutorial>();

        StringBuilder Sidebar;

        static string PrettyPrint(string HtmlText)
        {
            try
            {
                HtmlText = System.Xml.Linq.XElement.Parse(HtmlText).ToString();
            }
            catch
            {
                // isn't well-formed xml
            }

            return HtmlText;
        }
        string GetTemplatePath(string FileName)
        {
            return Path.Combine(TemplateHtmlFolder, FileName);
        }

        void PrepareFolders()
        {
            string SourceFolder = Path.Combine(Sys.AppFolder, "DefaultTemplate");
            TemplateHtmlFolder = Path.Combine(SourceFolder, "TemplateHtml");            

            OutputFolder = Path.GetFullPath(Settings.OutputFolder);

            if (Settings.DeleteExistingOutput && Directory.Exists(OutputFolder))
                Directory.Delete(OutputFolder, true);

            Sys.CopyFolder(Path.Combine(SourceFolder, "Content"), Path.Combine(OutputFolder, "Content"));
            Sys.CopyFolder(Path.Combine(SourceFolder, "Scripts"), Path.Combine(OutputFolder, "Scripts"));

            IndexFilePath = Path.Combine(OutputFolder, "Index.html");
        }
        void LoadTemplateHtmlFiles()
        {
            string[] TemplateNames = {
                "Constant",
                "Constructor",
                "DefaultValue",     // default value for function param, property 
                "Error",
                "Event",
                "Example",
                "Field",
                "FuncParam",
                
                "FuncParamOptional",
                "FuncParamRepeatable",
                "FuncReturn",
                "Function",
                "Layout",
                "List",
                "ListItem",
                "Property",
                "Sidebar_Leaf",
                "Sidebar_Node",
                "Sidebar_TreeView",
                "SubList", 
                "SubListItem",
                "TopItemHeader",
            };

            string FilePath;
            foreach (string TemplateName in TemplateNames)
            {
                FilePath = GetTemplatePath(TemplateName + ".html");
                Templates[TemplateName] = File.ReadAllText(FilePath);
            } 
        }


        void CreateTutorialPages()
        {
            // create tutorial pages
            if (Directory.Exists(Settings.TutorialsFolder))
            {
                string Content, SourcePath, TargetPath;
                foreach (Tutorial T in Tutorials)
                {
                    SourcePath = Path.Combine(Settings.TutorialsFolder, T.FileName);
                    if (File.Exists(SourcePath))
                    {
                        Content = File.ReadAllText(SourcePath);
                        TargetPath = Path.Combine(OutputFolder, T.FileName);
                        CreatePage(TargetPath, Content, T.Title);
                    }
                }
            }
        }

        void CreateSidebar()
        {
            /*            
<ul id="tv" class="tp-TreeView">
<li>Callbacks
<ul>
    <li>Callback 1</li>
    <li>Callback 2</li>
</ul>
</li>
<li>Enums
<ul>
    <li>Enum 1</li>
    <li>Enum 2</li>
</ul>
</li>
<li>Functions
<ul>
    <li>Func 1</li>
    <li>Func 2</li>
</ul>
</li>
</ul>
*/

            Sidebar = new StringBuilder(Templates["Sidebar_TreeView"]);

            StringBuilder sbContent = new StringBuilder();

            string S = Sidebar_GetNode(GetLink("Index.html", "Home"), "", "Home");
            sbContent.AppendLine(S);

            sbContent.AppendLine(Sidebar_GetTutorials());

            S = Sidebar_GetNamespace(Global);
            sbContent.AppendLine(S);

            foreach (var Item in Namespaces)
            {
                S = Sidebar_GetNamespace(Item);
                sbContent.AppendLine(S);
            }

            Sidebar.Replace("__SIDEBAR_CONTENT__", sbContent.ToString());
 
        }
        StringBuilder Sidebar_NewNode(string Title, string NodeClass)
        {
            StringBuilder SB = new StringBuilder(Templates["Sidebar_Node"]);
            //SB.Replace("__ID__", Id);
            SB.Replace("__NODE_CLASS__", NodeClass);
            SB.Replace("__TITLE__", Title);
            return SB;
        }
        StringBuilder Sidebar_NewLeaf(string LeafClass)
        {
            StringBuilder SB = new StringBuilder(Templates["Sidebar_Leaf"]);
            //SB.Replace("__ID__", Id);
            SB.Replace("__LEAF_CLASS__", LeafClass);
            return SB;
        }
        string Sidebar_GetNode(string Title,  string Content, string NodeClass)
        {
            StringBuilder SB = Sidebar_NewNode(Title, NodeClass);
            SB.Replace("__CONTENT__", Content);
            return SB.ToString();
        }
        string Sidebar_GetLeaf(string Content, string LeafClass)
        {
            StringBuilder SB = Sidebar_NewLeaf(LeafClass);
            SB.Replace("__CONTENT__", Content);
            return SB.ToString();
        }
        string Sidebar_GetNamespace(DocItem Item)
        {
            /* 
 Namespace
    Functions
    Classes
    Constants
    Fields
    Properties
    Enums
    Callbacks            
 */

            Dictionary<string, List<DocItem>> Dic = new Dictionary<string, List<DocItem>>()
            {
                { "Functions", Item.GetFunctions() },
                { "Interfaces", Item.GetInterfaces() },
                { "Classes", Item.GetClasses() },
                { "Constants", Item.GetConstants() },
                { "Fields", Item.GetFields() },
                { "Properties", Item.GetProperties() },
                { "Enums", Item.GetEnums() },
                { "Callbacks", Item.GetCallbacks() },
            };


            string NSName = Item is DocItemGlobal ? "Global" : Item.FullName;
            string sLink = GetLink(Item.HRef, NSName);

            StringBuilder SB = Sidebar_NewNode(sLink, "Namespace");
            StringBuilder sbContent = new StringBuilder();

            foreach (var Entry in Dic)
            {
                sbContent.AppendLine(Sidebar_GetList(Item, Entry.Value, Entry.Key));
            }

            SB.Replace("__CONTENT__", sbContent.ToString());
            return SB.ToString();
        }
        string Sidebar_GetList(DocItem ParentItem, List<DocItem> List, string Title)
        {
            if (List.Count > 0)
            {
                string sLink = GetLink(ParentItem.HRef + "#" + Title, Title);
                StringBuilder sbNode = Sidebar_NewNode(sLink, Title);
                StringBuilder sbNodeContent = new StringBuilder();

                StringBuilder sbCategory, sbCategoryContent;
                string Category = string.Empty;
                List<DocItem> ItemList = List;
                string S;


                Action AddItems = () =>
                {
                    if (string.IsNullOrWhiteSpace(Category))
                    {
                        foreach (DocItem Item in ItemList)
                        {
                            sLink = GetLink(Item.HRef, Item.Name);
                            S = Sidebar_GetLeaf(sLink, "");
                            sbNodeContent.AppendLine(S);
                        }
                    }
                    else
                    {
                        sbCategory = Sidebar_NewNode(Category, "Category");
                        sbCategoryContent = new StringBuilder();

                        foreach (DocItem Item in ItemList)
                        {
                            sLink = GetLink(Item.HRef, Item.Name);
                            S = Sidebar_GetLeaf(sLink, "");
                            sbCategoryContent.AppendLine(S);
                        }

                        sbCategory.Replace("__CONTENT__", sbCategoryContent.ToString());
                        sbNodeContent.AppendLine(sbCategory.ToString());
                    }

                };

                bool CategoriesExist = List.Any(item => !string.IsNullOrWhiteSpace(item.Category));

                if (CategoriesExist)
                {
                    // IOrderedEnumerable<IGrouping<string, Tutorial>> = groups
                    var groups = from item in List
                                 group item by item.Category into g
                                 orderby g.Key
                                 select g;


                    foreach (var Group in groups)
                    {
                        Category = Group.Key;
                        ItemList = Group.ToList();
                        AddItems();
                    }
                }
                else
                {
                    AddItems();
                }
 

                sbNode.Replace("__CONTENT__", sbNodeContent.ToString());
                return sbNode.ToString();
            }

            return string.Empty;
        }
        string Sidebar_GetTutorials()
        {
            if (Tutorials.Count > 0)
            {
                string Title = "Tutorials";
                StringBuilder sbNode = Sidebar_NewNode(Title, Title);
                StringBuilder sbNodeContent = new StringBuilder();

                StringBuilder sbCategory, sbCategoryContent;
                string S;
                string HRef;
 

                string Category = string.Empty;
                List<Tutorial> ItemList = Tutorials;

                Action AddItems = () =>
                {                     
                    if (string.IsNullOrWhiteSpace(Category))
                    {
                        foreach (Tutorial Item in ItemList)
                        {
                            HRef = Item.FileName; 
                            S = GetLink(HRef, Item.Title);
                            S = Sidebar_GetLeaf(S, "Tutorial");
                            sbNodeContent.AppendLine(S);
                        }                    
                    }
                    else
                    {
                        sbCategory = Sidebar_NewNode(Category, "Category");  
                        sbCategoryContent = new StringBuilder();

                        foreach (Tutorial Item in ItemList)
                        {
                            HRef = Item.FileName;
                            S = GetLink(HRef, Item.Title);
                            S = Sidebar_GetLeaf(S, "Tutorial");
                            sbCategoryContent.AppendLine(S);
                        }


                        sbCategory.Replace("__CONTENT__", sbCategoryContent.ToString());
                        sbNodeContent.AppendLine(sbCategory.ToString());
                    }
 
                };


                bool CategoriesExist = Tutorials.Any(item => !string.IsNullOrWhiteSpace(item.Category));

                if (CategoriesExist)
                {
                    // IOrderedEnumerable<IGrouping<string, Tutorial>> = groups
                    var groups = from item in Tutorials
                                group item by item.Category into g
                                orderby g.Key
                                select g;

                    
                    foreach (var Group in groups)
                    {
                        Category = Group.Key;
                        ItemList = Group.ToList();
                        AddItems();
                    }
                }
                else
                {
                    AddItems();
                }

                sbNode.Replace("__CONTENT__", sbNodeContent.ToString());
                return sbNode.ToString();
            }

            return string.Empty;
        }

 
        StringBuilder PreparePage(string PageTitle = "", string LayoutName = "Layout")
        {
            StringBuilder SB = new StringBuilder(Templates[LayoutName]);
            SB.Replace("__PAGE_TITLE__", PageTitle);
            SB.Replace("__HEADER_TEXT__", HeaderText);
            string sSidebar = PrettyPrint(Sidebar.ToString());
            SB.Replace("__SIDEBAR__", sSidebar);
            SB.Replace("__FOOTER_TEXT__", FooterText);
            SB.Replace("__DATE_TEXT__", DateText);

            return SB;
        }
        void CreatePage(string OutputFilePath, string Content, string PageTitle = "", string LayoutName = "Layout")
        {
            StringBuilder SB = PreparePage(PageTitle, LayoutName);
            SB.Replace("__CONTENT__", Content);
            string sHtml = SB.ToString();
            File.WriteAllText(OutputFilePath, sHtml);
        }
        void CreateHomePage()
        {            
            string Content = string.Empty;

            if (File.Exists(Settings.HomePagePath))
            {
                Content = File.ReadAllText(Settings.HomePagePath);
            }

            CreatePage(IndexFilePath, Content, HeaderText); 
        }
 
        string GetLink(string HRef, string Title)
        {
            HtmlTagBuilder link = new HtmlTagBuilder("a");
            link.Attributes["href"] = HRef;
            link.AddText(Title);
            return link.ToString();
        }
        string GetLink(DocItem Item)
        {
            return GetLink(Item.HRef, Item.Name);
        }
        string GetTutorialUrl(string TutorialFileName)
        {
            if (!Path.HasExtension(TutorialFileName))
                TutorialFileName += ".html";
            else
                TutorialFileName = Path.ChangeExtension(TutorialFileName, ".html");

            return TutorialFileName;
        }
        string GetLink(Tutorial T)
        {
           return GetLink(GetTutorialUrl(T.FileName), T.Title);
        }

        string ProcessInlineTagLink(int Index, string Text)
        {
            int Index2 = Text.IndexOf("}", Index);
            if (Index2 != -1)
            {
                DocItem Item;
                string sLink = Text.Substring(Index, Index2 - Index + 1);
                string S = sLink.Remove(0, LinkTagStart.Length).TrimStart();
                S = S.Remove(S.Length - 1, 1).TrimEnd();

                string[] Parts = S.Split(new char[] { '|' }, StringSplitOptions.RemoveEmptyEntries);
                if (Parts != null && Parts.Length > 0)
                { 
                    if (Parts.Length == 1)
                    {
                        // {@link ParentFullName#Name}
                        string[] SubParts = Parts[0].Split(new char[] { '#' }, StringSplitOptions.RemoveEmptyEntries);                        
                        if (SubParts != null && SubParts.Length == 2)
                        {
                            Item = Global.Find(SubParts[0] + "." + SubParts[1]);
                            if (Item != null)
                            {
                                Text = Text.Replace(sLink, GetLink(Item.HRef, Item.FullName));
                            }
                        }
                        else
                        {
                            // {@link ItemFullName}
                            Item = Global.Find(Parts[0]);
                            if (Item != null)
                            {
                                Text = Text.Replace(sLink, GetLink(Item.HRef, Item.FullName));
                            }
                            // {@link URL}
                            else
                            {
                                Text = Text.Replace(sLink, GetLink(S, S));
                            }
                        }
                    }
                    // {@link URL|Title}
                    else if (Parts.Length == 2)
                    {
                        Text = Text.Replace(sLink, GetLink(Parts[0], Parts[1]));
                    }

                }

            }

            return Text;
        }
        string ProcessInlineTagTutorial(int Index, string Text)
        {
            int Index2 = Text.IndexOf("}", Index);
            if (Index2 != -1)
            {
                string sLink = Text.Substring(Index, Index2 - Index + 1);
                string S = sLink.Remove(0, TutorialStartTag.Length).TrimStart();
                S = S.Remove(S.Length - 1, 1).TrimEnd();

                Tutorial T = Tutorials.FirstOrDefault(item => item.Id.IsSameText(S));
                if (T != null)
                {
                    S = GetLink(T);
                    Text = Text.Replace(sLink, S);
                }
            }

            return Text;
        }
        string GetDescription(string Description)
        {
            string Result = string.Empty;

            if (!string.IsNullOrWhiteSpace(Description))
            {
                HtmlTagBuilder div = new HtmlTagBuilder("div");
                div.AddCssClass("Description");
                div.AddText(Description);
                Result = div.ToString();

                int LastIndex = 0;
                int Index;
 
                while (true)
                {
                    Index = Result.IndexOf(LinkTagStart, LastIndex);
                    if (Index == -1)
                        break;

                    LastIndex = Index + 1;
                    Result = ProcessInlineTagLink(Index, Result);
                }

                LastIndex = 0;
                while (true)
                {
                    Index = Result.IndexOf(TutorialStartTag, LastIndex);
                    if (Index == -1)
                        break;

                    LastIndex = Index + 1;
                    Result = ProcessInlineTagTutorial(Index, Result);
                }
            }

            return Result;
        }
        string GetDataType(string DataType)
        {
            if (string.IsNullOrWhiteSpace(DataType))
                return "Any";

            string[] Parts = DataType.Split(new char[] { '|' }, StringSplitOptions.RemoveEmptyEntries);
            DocItem dcType;
            HtmlTagBuilder link;

            for (int i = 0; i < Parts.Length; i++)
            {
                Parts[i] = Parts[i].Trim();

                dcType = Global.FlatList.FirstOrDefault((item) => {
                    return Parts[i].IsSameText(item.FullName);
                });

                if (dcType != null)
                {
                    link = new HtmlTagBuilder("a");
                    link.Attributes["href"] = dcType.HRef;
                    link.AddText(Parts[i]);
                    Parts[i] = link.ToString();
                }


            }

            return string.Join("&nbsp;|&nbsp;", Parts);

            //return string.Join("|", Parts);
        }
        string GetParamList(List<FuncParam> List)
        {
            StringBuilder SB = new StringBuilder();

            if (List != null && List.Count > 0)
            {
                StringBuilder sbItem;
                FuncParam Item;

                for (int i = 0; i < List.Count; i++)
                {
                    Item = List[i];

                    sbItem = new StringBuilder();

                    if (Item.IsOptional)
                        sbItem.Append("[");
                    if (Item.IsRepeatable)
                        sbItem.Append("...");
                    sbItem.Append(Item.Name + ":&nbsp;");
                    sbItem.Append(GetDataType(string.IsNullOrWhiteSpace(Item.Type) ? "Any" : Item.Type));
                    if (Item.IsOptional)
                        sbItem.Append("]");

                    if (i < List.Count - 1)
                    {
                        sbItem.Append(", &nbsp;");
                    }

                    SB.Append(sbItem.ToString());

                }

            }

            return SB.ToString();
        }
        string GetReturnDataType(FuncReturn Item)
        {
            if (Item != null)
            {
                return !string.IsNullOrWhiteSpace(Item.Type) ? Item.Type : "Any";
            }

            return "void";
        }
        string GetDefaultValue(string Value)
        {
            // default value
            string DefaultValue = string.Empty;
            if (!string.IsNullOrWhiteSpace(Value))
            {
                StringBuilder sb = new StringBuilder(Templates["DefaultValue"]);
                sb.Replace("__ITEM_VALUE__", Value);
                DefaultValue = sb.ToString();
            }

            return DefaultValue;
        }

        /* Sub-Item Lists */
        StringBuilder StarSubList(string ListClass, string ListTitle)
        {
            StringBuilder SB = new StringBuilder(Templates["SubList"]);
            SB.Replace("__LIST_CLASS__", ListClass);
            SB.Replace("__LIST_TITLE__", ListTitle);
            return SB;
        } 
        string GetParams(DocItem DocItem)
        {
            List<FuncParam> List = DocItem.Params;
            StringBuilder SB = null;

            if (List != null && List.Count > 0)
            {
                string Title = "Parameters";                

                StringBuilder sbItems = new StringBuilder();
                StringBuilder sbItem;
                StringBuilder sb;
                string Repeatable;
                string Optional;
                string DefaultValue;
                

                foreach (var Item in List)
                {
                    sbItem = new StringBuilder(Templates["FuncParam"]);
                    sbItem.Replace("__ITEM_NAME__", Item.Name);
                    sbItem.Replace("__DATA_TYPE__", GetDataType(string.IsNullOrWhiteSpace(Item.Type) ? "Any" : Item.Type));
                    sbItem.Replace("__DESCRIPTION__", GetDescription(Item.Description));

                    // repeatable
                    Repeatable = string.Empty;
                    if (Item.IsRepeatable)
                    {
                        sb = new StringBuilder(Templates["FuncParamRepeatable"]);
                        Repeatable = sb.ToString();
                    }
                    sbItem.Replace("__REPEATABLE__", Repeatable);

                    // optional
                    Optional = string.Empty;
                    if (Item.IsOptional)
                    {
                        sb = new StringBuilder(Templates["FuncParamOptional"]);
                        Optional = sb.ToString();
                    }
                    sbItem.Replace("__OPTIONAL__", Optional);

                    // default value
                    DefaultValue = string.Empty;
                    if (!string.IsNullOrWhiteSpace(Item.Default))
                    {
                        sb = new StringBuilder(Templates["DefaultValue"]);
                        sb.Replace("__ITEM_VALUE__", Item.Default);
                        DefaultValue = sb.ToString();
                    }
                    sbItem.Replace("__DEFAULT_VALUE__", DefaultValue);

                    sbItems.AppendLine(sbItem.ToString());
                }

                if (sbItems.Length > 0)
                {
                    SB = StarSubList(Title, Title);
                    SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                }
 

            }

            return SB != null ? SB.ToString() : string.Empty;
        }        
        string GetReturns(DocItem DocItem)
        {
            FuncReturn Item = DocItem.Return;
            StringBuilder SB = new StringBuilder();

            if (Item != null)
            { 
                SB = new StringBuilder(Templates["FuncReturn"]);
                SB.Replace("__DATA_TYPE__", GetDataType(string.IsNullOrWhiteSpace(Item.Type) ? "Any" : Item.Type));
                SB.Replace("__DESCRIPTION__", GetDescription(Item.Description));
            }

            return SB.ToString();
        }
        string GetErrors(DocItem DocItem)
        {
            List<Error> List = DocItem.Throws;
            StringBuilder SB = null;

            if (List != null && List.Count > 0)
            {
                string Title = "Throws";                

                StringBuilder sbItems = new StringBuilder();
                StringBuilder sbItem; 

                foreach (var Item in List)
                {
                    sbItem = new StringBuilder(Templates["Error"]);
                    sbItem.Replace("__DATA_TYPE__", GetDataType(string.IsNullOrWhiteSpace(Item.Type) ? "Any" : Item.Type));
                    sbItem.Replace("__DESCRIPTION__", GetDescription(Item.Description));
 
                    sbItems.AppendLine(sbItem.ToString());
                }

                if (sbItems.Length > 0)
                {
                    SB = StarSubList(Title, Title);
                    SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                }
 
            }

            return SB != null ? SB.ToString() : string.Empty;
        }
        string GetSeeAlso(DocItem DocItem)
        {
            List<string> List = DocItem.SeeAlso;
            StringBuilder SB = null;

            if (List != null && List.Count > 0)
            { 
                StringBuilder sbItems = new StringBuilder();
                StringBuilder sbItem;

                // @see {@link https://stackoverflow.com|StackOverflow}
                string S;
                int Index;
                int LastIndex = 0;

                for (int i = 0; i < List.Count; i++)
                {
                    LastIndex = 0;
                    S = List[i].Trim();

                    while (true)
                    {
                        Index = S.IndexOf(LinkTagStart, LastIndex);
                        if (Index == -1)
                            break;

                        LastIndex = Index + 1;
                        S = ProcessInlineTagLink(Index, S);
                    }

                    sbItem = new StringBuilder(Templates["SubListItem"]);
                    sbItem.Replace("__ITEM_CLASS__", "SeeAlso");
                    sbItem.Replace("__CONTENT__", S);
                    sbItems.AppendLine(sbItem.ToString());

                }
 
                if (sbItems.Length > 0)
                {
                    SB = StarSubList("SeeAlso", "See Also");
                    SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                }
 
            }

            return SB != null ? SB.ToString() : string.Empty;
        }
        string GetTutorials(DocItem DocItem)
        {
            List<string> List = DocItem.Tutorials;
            StringBuilder SB = null;  

            if (List != null && List.Count > 0)
            {
                StringBuilder sbItems = new StringBuilder();
                StringBuilder sbItem;

                // @tutorial Tripous
                string Name;  
                Tutorial T;
                string S;
 
                foreach (var Item in List)
                {
                    Name = Item.Trim();
                    if (!string.IsNullOrWhiteSpace(Name))
                    {
                        T = Tutorials.FirstOrDefault(item => Name.IsSameText(item.Id));
                        if (T != null)
                        { 
                            S = GetLink(T);        

                            sbItem = new StringBuilder(Templates["SubListItem"]);
                            sbItem.Replace("__ITEM_CLASS__", "Tutorial");
                            sbItem.Replace("__CONTENT__", S);
                            sbItems.AppendLine(sbItem.ToString()); 
                        }
                    }
 
                }

                if (sbItems.Length > 0)
                {
                    SB = StarSubList("Tutorials", "Tutorials");
                    SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                }
                
            }

            return SB != null? SB.ToString(): string.Empty;
        }
        string GetExamples(DocItem DocItem)
        {
            List<string> List = DocItem.Examples;
            StringBuilder SB = null;

            if (List != null && List.Count > 0)
            {
                string Title = "Examples";

                StringBuilder sbItems = new StringBuilder();
                StringBuilder sbItem;

                foreach (var Item in List)
                {
                    sbItem = new StringBuilder(Templates["Example"]);
                    sbItem.Replace("__SOURCE_CODE__", Item);

                    sbItems.AppendLine(sbItem.ToString());
                }

                if (sbItems.Length > 0)
                {
                    SB = StarSubList(Title, Title);
                    SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                }

            }

            return SB != null ? SB.ToString() : string.Empty;
   
        }
        string GetImplements(DocItem DocItem)
        {
            List<string> List = DocItem.Implements;
            StringBuilder SB = null;

            if (List != null && List.Count > 0)
            {
                StringBuilder sbItems = new StringBuilder();
                StringBuilder sbItem;

                //@implements Interface1 Interface2 InterfaceN
                string Name; 
                string S;
                DocItem dcType;  

                foreach (var Item in List)
                {
                    Name = Item.Trim();

                    dcType = Global.FlatList.FirstOrDefault((item) => {
                        return item.ItemType == DocItemType.Interface && Name.IsSameText(item.FullName);
                    });

                    if (dcType != null)
                    {
                        S = GetLink(dcType);
                    }
                    else
                    {
                        S = Name;
                    }

                    sbItem = new StringBuilder(Templates["SubListItem"]);
                    sbItem.Replace("__ITEM_CLASS__", "Implements");
                    sbItem.Replace("__CONTENT__", S);
                    sbItems.AppendLine(sbItem.ToString());

                }

                if (sbItems.Length > 0)
                {
                    SB = StarSubList("ImplementsList", "Implements");
                    SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                }

            }

            return SB != null ? SB.ToString() : string.Empty;
        }

        /* DocLets - TopItem Lists */
        StringBuilder StarList(string ListClass, string ListTitle, string ListId)
        {
            StringBuilder SB = new StringBuilder(Templates["List"]);
            if (!string.IsNullOrWhiteSpace(ListId))
            {
                ListId = string.Format(" id='{0}'", ListId);
            }

            SB.Replace("__ID__", ListId);
            SB.Replace("__LIST_CLASS__", ListClass);
            SB.Replace("__LIST_TITLE__", ListTitle);
            return SB;
        }
        void AddList(StringBuilder Parent, List<DocItem> List, string Title, string ListId, string ItemClass)
        {
            if (List.Count > 0)
            {
                StringBuilder SB = StarList(Title, Title, ListId);
                StringBuilder sbItems = new StringBuilder();
                StringBuilder sbItem;
 
                foreach (DocItem Item in List)
                {
                    sbItem = new StringBuilder(Templates["ListItem"]);
                    sbItem.Replace("__ITEM_CLASS__", ItemClass);
                    sbItem.Replace("__CONTENT__", GetLink(Item.HRef, Item.FullName));
 
                    sbItems.AppendLine(sbItem.ToString());
                }

                SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                Parent.AppendLine(SB.ToString());
            }
        }
        void AddConstants(StringBuilder Parent, List<DocItem> List)
        {
            if (List.Count > 0)
            {
                string Title = "Constants";
                StringBuilder SB = StarList(Title, Title, Title);

                StringBuilder sbItems = new StringBuilder();
                StringBuilder sbItem;
 
                foreach (var Item in List)
                {
                    sbItem = new StringBuilder(Templates["Constant"]);
                    sbItem.Replace("__ID__", Item.Name);
                    sbItem.Replace("__ATTRIBUTE__", Item.IsStatic ? "static" : string.Empty);
                    sbItem.Replace("__ITEM_NAME__", Item.Name);
                    sbItem.Replace("__DATA_TYPE__", GetDataType(string.IsNullOrWhiteSpace(Item.Type) ? "Any" : Item.Type));
                    sbItem.Replace("__DEFAULT_VALUE__", GetDefaultValue(Item.Default));
                    sbItem.Replace("__DESCRIPTION__", GetDescription(Item.Description));
 
                    sbItem.Replace("__EXAMPLES__", GetExamples(Item));
                    sbItem.Replace("__TUTORIALS__", GetTutorials(Item));
                    sbItem.Replace("__SEE_ALSO__", GetSeeAlso(Item));

                    sbItems.AppendLine(sbItem.ToString());
                }

                SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                Parent.AppendLine(SB.ToString());
            }
        }
        void AddFields(StringBuilder Parent, List<DocItem> List)
        {
            if (List.Count > 0)
            {
                string Title = "Fields";
                StringBuilder SB = StarList(Title, Title, Title);

                StringBuilder sbItems = new StringBuilder();
                StringBuilder sbItem;

                foreach (var Item in List)
                {
                    sbItem = new StringBuilder(Templates["Field"]);
                    sbItem.Replace("__ID__", Item.Name);
                    sbItem.Replace("__ATTRIBUTE__", Item.IsStatic ? "static" : string.Empty);
                    sbItem.Replace("__ITEM_NAME__", Item.Name);
                    sbItem.Replace("__DATA_TYPE__", GetDataType(string.IsNullOrWhiteSpace(Item.Type) ? "Any" : Item.Type));
                    sbItem.Replace("__DEFAULT_VALUE__", GetDefaultValue(Item.Default));
                    sbItem.Replace("__DESCRIPTION__", GetDescription(Item.Description));

                    sbItem.Replace("__EXAMPLES__", GetExamples(Item));
                    sbItem.Replace("__TUTORIALS__", GetTutorials(Item));
                    sbItem.Replace("__SEE_ALSO__", GetSeeAlso(Item));

                    sbItems.AppendLine(sbItem.ToString());
                }

                SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                Parent.AppendLine(SB.ToString());
            }
        }
        void AddProperties(StringBuilder Parent, List<DocItem> List)
        {
            if (List.Count > 0)
            {
                string Title = "Properties";
                StringBuilder SB = StarList(Title, Title, Title);

                StringBuilder sbItems = new StringBuilder();
                StringBuilder sbItem;
 

                foreach (var Item in List)
                {
                    sbItem = new StringBuilder(Templates["Property"]);

                    sbItem.Replace("__ID__", Item.Name);
                    sbItem.Replace("__ATTRIBUTE__", Item.IsStatic ? "static" : string.Empty);
                    sbItem.Replace("__ITEM_NAME__", Item.Name);
                    sbItem.Replace("__DATA_TYPE__", GetDataType(string.IsNullOrWhiteSpace(Item.Type) ? "Any" : Item.Type));
                    sbItem.Replace("__READ_WRITE__", Item.IsReadOnly? "read-only": "read/write");
                    
                    sbItem.Replace("__DEFAULT_VALUE__", GetDefaultValue(Item.Default));
                    sbItem.Replace("__DESCRIPTION__", GetDescription(Item.Description));

                    sbItem.Replace("__ERRORS__", GetErrors(Item));

                    sbItem.Replace("__EXAMPLES__", GetExamples(Item));
                    sbItem.Replace("__TUTORIALS__", GetTutorials(Item));
                    sbItem.Replace("__SEE_ALSO__", GetSeeAlso(Item));

                    sbItems.AppendLine(sbItem.ToString());
                }

                SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                Parent.AppendLine(SB.ToString());
            }
        }
        string GetFunction(DocItem Item)
        {
            StringBuilder sbItem = new StringBuilder(Templates["Function"]);

            sbItem.Replace("__ID__", Item.Name);
            sbItem.Replace("__ATTRIBUTE__", Item.IsStatic ? "static" : string.Empty);
            sbItem.Replace("__ITEM_NAME__", Item.Name);
            sbItem.Replace("__PARAM_LIST__", GetParamList(Item.Params));
            sbItem.Replace("__DATA_TYPE__", GetDataType(GetReturnDataType(Item.Return)));
            sbItem.Replace("__DESCRIPTION__", GetDescription(Item.Description));
            sbItem.Replace("__PARAMS__", GetParams(Item));
            sbItem.Replace("__RETURNS__", GetReturns(Item));

            sbItem.Replace("__ERRORS__", GetErrors(Item));

            sbItem.Replace("__EXAMPLES__", GetExamples(Item));
            sbItem.Replace("__TUTORIALS__", GetTutorials(Item));
            sbItem.Replace("__SEE_ALSO__", GetSeeAlso(Item));

            return sbItem.ToString();
        }
        void AddFunctions(StringBuilder Parent, List<DocItem> List)
        {
            if (List.Count > 0)
            {
                string Title = "Functions";
                StringBuilder SB = StarList(Title, Title, Title);

                StringBuilder sbItems = new StringBuilder(); 

                foreach (var Item in List)
                { 
                    sbItems.AppendLine(GetFunction(Item));
                }

                SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                Parent.AppendLine(SB.ToString());
            }
        } 
        void AddCallbacks(StringBuilder Parent, List<DocItem> List)
        {
            if (List.Count > 0)
            {
                string Title = "Callbacks";
                StringBuilder SB = StarList(Title, Title, Title);

                StringBuilder sbItems = new StringBuilder();

                foreach (var Item in List)
                {
                    sbItems.AppendLine(GetFunction(Item));
                }

                SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                Parent.AppendLine(SB.ToString());
            }
        }
        void AddEvents(StringBuilder Parent, List<Event> List)
        {
            if (List != null && List.Count > 0)
            {
                string Title = "Events";
                StringBuilder SB = StarList(Title, Title, Title);

                StringBuilder sbItems = new StringBuilder();
                StringBuilder sbItem;

                foreach (var Item in List)
                {
                    sbItem = new StringBuilder(Templates["Event"]);

                    sbItem.Replace("__ITEM_NAME__", Item.Name);
                    sbItem.Replace("__DATA_TYPE__", GetDataType(string.IsNullOrWhiteSpace(Item.Type) ? "Any" : Item.Type));
                    sbItem.Replace("__DESCRIPTION__", GetDescription(Item.Description));

                    sbItems.AppendLine(sbItem.ToString());
                }

                SB.Replace("__LIST_ITEMS__", sbItems.ToString());
                Parent.AppendLine(SB.ToString());
            } 

        }
        void AddConstructor(StringBuilder Parent, DocItem Item)
        {
            if (Item != null)
            {
                StringBuilder sbItem = new StringBuilder(Templates["Constructor"]);

                sbItem.Replace("__ID__", Item.Name);
                sbItem.Replace("__ITEM_NAME__", Item.Parent.FullName);
                sbItem.Replace("__PARAM_LIST__", GetParamList(Item.Params));
                sbItem.Replace("__DESCRIPTION__", string.Empty);
                sbItem.Replace("__PARAMS__", GetParams(Item));

                sbItem.Replace("__ERRORS__", GetErrors(Item));

                sbItem.Replace("__EXAMPLES__", GetExamples(Item));
                sbItem.Replace("__TUTORIALS__", GetTutorials(Item));
                sbItem.Replace("__SEE_ALSO__", GetSeeAlso(Item));

                Parent.AppendLine(sbItem.ToString());
            }
        }
 
        string GetSynonymousFunction(DocItem Item)
        {
            StringBuilder sbItem = new StringBuilder();

            if (Item.IsFunction)
            { 
                sbItem.Append(Templates["Function"]);

                sbItem.Replace("__ID__", Item.Name + "Function");
                sbItem.Replace("__ATTRIBUTE__", "static");
                sbItem.Replace("__ITEM_NAME__", Item.FullName);
                sbItem.Replace("__PARAM_LIST__", GetParamList(Item.Params));
                sbItem.Replace("__DATA_TYPE__", GetDataType(GetReturnDataType(Item.Return)));
                sbItem.Replace("__DESCRIPTION__", string.Empty);
                sbItem.Replace("__PARAMS__", GetParams(Item));
                sbItem.Replace("__RETURNS__", GetReturns(Item));

                sbItem.Replace("__ERRORS__", string.Empty);

                sbItem.Replace("__EXAMPLES__", string.Empty);
                sbItem.Replace("__TUTORIALS__", string.Empty); ;
                sbItem.Replace("__SEE_ALSO__", string.Empty);
            }

            string Result = sbItem.ToString();
            return Result;
        } 
        void AddTopItemHeader(StringBuilder Parent, DocItem Item)
        {
            string sItemClass = "Class";
            string sItemType = "class";
            
            if ((Item.ItemType == DocItemType.Namespace) || (Item.ItemType == DocItemType.Global))
            {
                sItemClass = "Namespace";
                sItemType = "namespace";
            }
            else if (Item.ItemType == DocItemType.Interface)
            {
                sItemClass = "Interface";
                sItemType = "interface";
            }
            else if (Item.ItemType == DocItemType.Enum)
            {
                sItemClass = "Enum";
                sItemType = "enum";
            }
            
            StringBuilder sbItem = new StringBuilder(Templates["TopItemHeader"]);

            sbItem.Replace("__ID__", Item.FullName);
            sbItem.Replace("__ATTRIBUTE__", Item.IsStatic && Item.ItemType == DocItemType.Class ? "static" : string.Empty);
            sbItem.Replace("__TOP_ITEM_CLASS__", sItemClass);
            sbItem.Replace("__ITEM_TYPE__", sItemType);
            sbItem.Replace("__ITEM_NAME__", Item.FullName);
            sbItem.Replace("__DESCRIPTION__", GetDescription(Item.Description));
            sbItem.Replace("__SAME_NAME_FUNCTION__", GetSynonymousFunction(Item));

            sbItem.Replace("__IMPLEMENTS__", GetImplements(Item));
 
            sbItem.Replace("__ERRORS__", GetErrors(Item));

            sbItem.Replace("__EXAMPLES__", GetExamples(Item));
            sbItem.Replace("__TUTORIALS__", GetTutorials(Item));
            sbItem.Replace("__SEE_ALSO__", GetSeeAlso(Item));

            Parent.AppendLine(sbItem.ToString());
        }
        void CreateNamespacePage(DocItem Item)
        {
            StringBuilder Content = new StringBuilder();
            AddTopItemHeader(Content, Item);

            List<DocItem> Interfaces = Item.GetInterfaces();
            List<DocItem> Classes = Item.GetClasses();
            List<DocItem> Enums = Item.GetEnums();
            List<DocItem> Constants = Item.GetConstants();
            List<DocItem> Fields = Item.GetFields();
            List<DocItem> Properties = Item.GetProperties();
            List<DocItem> Functions = Item.GetFunctions();            
            List<DocItem> Callbacks = Item.GetCallbacks();

            /*   
        Namespace
            Constants
            Fields
            Properties
            Interfaces (a list of names/links only)
            Classes (a list of names/links only)
            Enums (a list of names/links only)   
            Functions            
            Callbacks           
             */

            AddConstants(Content, Constants);
            AddFields(Content, Fields);
            AddProperties(Content, Properties);
            AddList(Content, Interfaces, "Interfaces", "Interfaces", "Interface");
            AddList(Content, Classes, "Classes", "Classes", "Class");
            AddList(Content, Enums, "Enums", "Enums", "Enum");
            AddFunctions(Content, Functions);            
            AddCallbacks(Content, Callbacks);

            StringBuilder SB = PreparePage(Item.FullName);

            string sContent = PrettyPrint(Content.ToString());
            SB.Replace("__CONTENT__", sContent);

            string sHtml = SB.ToString();

            string PageFileName = Item is DocItemGlobal ? "Global.html" : Item.HRef;
            string FilePath = Path.Combine(OutputFolder, PageFileName);
            File.WriteAllText(FilePath, sHtml);
        }
        void CreateClassPage(DocItem Item)
        {
            StringBuilder Content = new StringBuilder();
            AddTopItemHeader(Content, Item); 

            DocItem Constructor = Item.GetConstructor();
            List<DocItem> Constants = Item.GetConstants();
            List<DocItem> Fields = Item.GetFields();
            List<DocItem> Properties = Item.GetProperties();
            List<DocItem> Functions = Item.GetFunctions();
            //List<DocItem> Classes = Item.GetClasses().Cast<DocItem>().ToList();
            //List<DocItem> EventArgs = Item.GetEventArgs().Cast<DocItem>().ToList();
            //List<DocItem> Enums = Item.GetEnums().Cast<DocItem>().ToList();

            /*               
            Class
                Constructor
                Constants
                Fields
                Properties                
                Functions
                Events
  
                 */

            if (!Item.IsStatic)
                AddConstructor(Content, Constructor);
            AddConstants(Content, Constants);
            AddFields(Content, Fields);
            AddProperties(Content, Properties);
            AddFunctions(Content, Functions);
            AddEvents(Content, Item.Events);
 
            
            StringBuilder SB = PreparePage(Item.FullName);

            string sContent = PrettyPrint(Content.ToString());
            SB.Replace("__CONTENT__", sContent);

            string sHtml = SB.ToString();

            string PageFileName = Item.FullName + ".html";
            string FilePath = Path.Combine(OutputFolder, PageFileName);
            File.WriteAllText(FilePath, sHtml);

        }

        /* construction */
        public DefaultTemplateModule()
        {
        }

        /* public */
        public void Execute(DocContext Context)
        {
            this.Global = Context.Global;
            this.Settings = Context.Settings;
            this.Tutorials = Context.Tutorials;


            HeaderText = !string.IsNullOrWhiteSpace(Settings.DocTitle) ? Settings.DocTitle : string.Empty;
            FooterText = !string.IsNullOrWhiteSpace(Settings.FooterText) ? Settings.FooterText : string.Empty;
            DateText = Settings.DisplayDate ? DateTime.Now.ToString("yyyy-MM-dd") : string.Empty;



            PrepareFolders();
            LoadTemplateHtmlFiles();
            //PrepareTutorials();

            Namespaces = Global.GetAllNamespaces();          

            CreateSidebar();

            CreateTutorialPages();
            CreateHomePage();

            CreateNamespacePage(Global);
            foreach (var Item in Namespaces)
            {
                CreateNamespacePage(Item);
            }


            List<DocItem> Items = Global.GetAllClasses();
            Items.AddRange(Global.GetInterfaces());
            Items.AddRange(Global.GetAllEnums());

            foreach (var Item in Items)
            {
                CreateClassPage(Item);
            }

 
        }

        /* propertie */
        public string Name { get { return "Default"; } }
    }
}
