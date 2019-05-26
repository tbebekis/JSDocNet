using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace JSDocNet
{

    /// <summary>
    /// A class similar to System.Web.Mvc.TagBuilder
    /// </summary>
    public class HtmlTagBuilder
    {
        readonly string[] SelfClosingTags = { "br", "hr" };

        List<object> Items;
        IDictionary<string, string> fAttributes;

        /* private */
        string GetAttribute(string Key)
        {
            string Result = string.Empty;
            if (Attributes.TryGetValue(Key, out Result))
            {
                return Result;
            }

            return string.Empty;
        }
        string GetAttributesHtml()
        {
            StringBuilder SB = new StringBuilder();
            string Key, Value;

            foreach (var A in Attributes)
            {
                Key = A.Key.ToLowerInvariant();
                Value = A.Value;

                if ((Key == "id" || Key == "name") && string.IsNullOrEmpty(Value))
                {
                    continue;
                }

                SB.Append(' ');
                SB.Append(Key);
                SB.Append("=\"");
                SB.Append(Value);
                SB.Append('"');
            }

            return SB.ToString();
        }
 

        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        public HtmlTagBuilder(string TagName)
        {
            if (string.IsNullOrWhiteSpace(TagName))
                Sys.Error("Can NOT create Tag. TagName is null or empty");

            this.TagName = TagName;
        }

        /* public */
        /// <summary>
        /// Returns the whole html markup of this tag
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            foreach (string SCT in SelfClosingTags)
            {
                if (this.TagName.ToLowerInvariant() == SCT)
                    return string.Format("<{0} />", SCT);
            }

            string S;
            StringBuilder SB = new StringBuilder();

            //SB.AppendLine(string.Format("", TagName));
            SB.Append("<");
            SB.Append(TagName);
            SB.Append(GetAttributesHtml());
            SB.AppendLine(">");

            if (this.Items != null)
            {
                foreach (var Node in this.Items)
                {
                    S = Node.ToString();
                    SB.AppendLine(S);
                }
            }
  
            SB.Append(string.Format("</{0}>", TagName));
 

            return SB.ToString();
        }

        /// <summary>
        /// Adds and returns a child tag
        /// </summary>
        public HtmlTagBuilder AddTag(string TagName)
        {
            if (string.IsNullOrWhiteSpace(TagName))
                Sys.Error("Can NOT add Tag. TagName is null or empty");

            HtmlTagBuilder Result = new HtmlTagBuilder(TagName);
            AddTag(Result);
            return Result;
        }
        /// <summary>
        /// Adds a tag as a child
        /// </summary>
        public void AddTag(HtmlTagBuilder Tag)
        {
            if (Tag == null)
                Sys.Error("Can NOT add Tag. Tag is null");

            if (Items == null)
                Items = new List<object>();

            if (Items.Contains(Tag))
                Sys.Error("Can NOT add Tag. Tag is already added. TagName: {0}", Tag.TagName);

            Items.Add(Tag);
        }
        /// <summary>
        /// Adds text in the tag. Could be html text or plain text.
        /// </summary>
        public void AddText(string Text)
        {
            if (!string.IsNullOrEmpty(Text))
            {
                if (Items == null)
                    Items = new List<object>();

                Items.Add(Text);
            }
        }

        /// <summary>
        /// Adds a css class
        /// </summary>
        public void AddCssClass(string Value)
        {
            if (string.IsNullOrWhiteSpace(Value))
                Sys.Error("Can NOT add a css class. Css class name is null or empty");

            var Classes = GetAttribute("class");
            if (string.IsNullOrWhiteSpace(Classes))
            {
                Attributes["class"] = Value;
            }
            else
            {
                string[] Parts = Classes.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                if (Parts != null && Parts.Length > 0)
                {
                    List<string> ClassList = new List<string>(Parts);
                    ClassList.Add(Value);
                    Attributes["class"] = string.Join(" ", ClassList.ToArray());
                }
            }
        }

        /* properties */
        /// <summary>
        /// The tag name, e.g. div, span, etc.
        /// </summary>
        public string TagName { get; private set; }
        /// <summary>
        /// The value of the id attribute of this tag
        /// </summary>
        public string Id { get { return GetAttribute("id"); } set { Attributes["id"] = value; } }
        /// <summary>
        /// The value of the name attribute of this tag
        /// </summary>
        public string Name { get { return GetAttribute("name"); } set { Attributes["name"] = value; } }
        /// <summary>
        /// The attributes of this tag as a dictionary
        /// </summary>
        public IDictionary<string, string> Attributes
        {
            get
            {
                if (fAttributes == null)
                    fAttributes = new SortedDictionary<string, string>(StringComparer.Ordinal);
                return fAttributes;
            }
            set { fAttributes = value; }
        }
 
    }
}
