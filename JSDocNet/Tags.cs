using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{

    /// <summary>
    /// Helper
    /// </summary>
    static public class Tags
    {
        /* top - (doclet tags) */
        public const string Namespace = "@namespace";
        public const string Class = "@class";
        public const string Constructor = "@constructor";
        public const string Field = "@field";
        public const string Constant = "@constant";
        public const string Property = "@property";
        public const string Function = "@function";
        public const string Enum = "@enum";
        public const string Callback = "@callback";
        
        public const string Interface = "@interface";

        public const string Category = "@category";
 
        public const string Static = "@static";         
        public const string Extends = "@extends";
        public const string Augments = "@augments";

        public const string Access = "@access";

        public const string MemberOf = "@memberof";
        public const string Name = "@name";
        public const string Type = "@type";
        public const string Implements = "@implements";

        public const string Description = "@description";
        public const string Example = "@example";
        public const string Param = "@param";
        public const string Return = "@return";
        
        public const string See = "@see";
        public const string Tutorial = "@tutorial";
        public const string Link = "@link";

        public const string ReadOnly = "@readonly";
        public const string Default = "@default";
        public const string Throws = "@throws";
        public const string Triggers = "@fires";
        public const string BitField = "@bitfield";
        public const string EventArgs = "@eventargs";
        public const string Deprecated = "@deprecated";

        /// <summary>
        /// Block tag names. Tags that start a line
        /// </summary>
        static public readonly string[] BlockTags = {
            Namespace,
            Class,
            Constructor,
            Field,
            Constant,
            Property,
            Function,
            Callback,
            Enum,
            Interface,
            

            Category,

            Static, 
            Extends,
            Augments,
            Implements,

            Access,

            MemberOf,
            Name,           // @name [MemberOf]Name
            Type,

            Description,
            Example,
            Param,
            Return,

            See,
            Tutorial,
            ReadOnly,
            Default,
            Throws,
            Triggers,
            BitField,
            EventArgs,
            Deprecated,
        };

        /// <summary>
        /// Bock tags that span multiple lines of text
        /// </summary>
        static public readonly string[] MultiLineTags = {
            // name tags
            Namespace,
            Class,
            Function,
            Callback,
            Interface,

            // name + type tags
            Enum,
            Field,
            Constant,
            Property,

            Description,  
            Param,
            Return,
            Triggers,
            Throws,
            Example,
        };

        /// <summary>
        /// Block tags that may contain the name of the DocLet (called DocLet tags)
        /// </summary>
        static public readonly string[] NameTags = {
            // @tag [MemberOf]Name [Description] 
            Namespace,
            Class,
            Enum,
            Interface,
            Field,
            Constant,
            Property,
            Function,  
            Constructor,   // @tag [MemberOf] [Description]
            Callback, 
        };

        /// <summary>
        /// DocLet block tags that may contain the name and the type of the DocLet 
        /// </summary>
        static public readonly string[] NameTypeTags = { 
            // @tag {Type} [MemberOf]Name [Description]
            Enum,
            Field,
            Constant,
            Property, 
        };


        /// <summary>
        /// Block tags that act as flags (true if exists, false else)
        /// </summary>
        static public readonly string[] FlagTags = {
            Function,

            Static, 

            ReadOnly, 
            BitField,
            EventArgs,
            Deprecated,
        };

        /// <summary>
        /// Block tags denoting class inheritance
        /// </summary>
        static public readonly string[] ExtendsTags = {
            Extends,
            Augments,
        };


        /* public */
        /// <summary>
        /// True if a tag is block tag
        /// </summary>
        static public bool IsBlockTag(string Tag)
        {
            return BlockTags.FirstOrDefault(item => Tag == item) != null;
        }
        /// <summary>
        /// Finds and returns the block tag of a line, if any, else string.Empty
        /// </summary>
        static public string FindBlockTag(string Line)
        {
            foreach (string Tag in BlockTags)
            {
                if (Line.StartsWith(Tag))
                    return Tag;
            }

            return string.Empty;
        }
        /// <summary>
        /// True if a tag is a multiline tag
        /// </summary>
        static public bool IsMultiLineTag(string Tag)
        {
            return MultiLineTags.FirstOrDefault(item => Tag == item) != null;
        }
        /// <summary>
        /// True if a tag belongs to the name-type tags.
        /// <para>A name-type tag is a block tag that may contain the name and the type of the DocLet </para>
        /// </summary>
        /// <param name="Tag"></param>
        /// <returns></returns>
        static public bool IsNameTypeTag(string Tag)
        {
            return NameTypeTags.FirstOrDefault(item => Tag == item) != null;
        }
    }
}
 
