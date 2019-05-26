using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{

    /// <summary>
    /// The text of a block tag
    /// </summary>
    public class Block
    {

        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        public Block(string TagName, string FirstLine)
        {
            this.TagName = TagName;

            Lines = new List<string>();
            Lines.Add(FirstLine);

            IsMultiLine = Tags.IsMultiLineTag(TagName);
        }

        /* public */
        /// <summary>
        /// Override
        /// </summary>
        public override string ToString()
        {
            return this.TagName;
        }

        /* properties */
        /// <summary>
        /// The tag name, e.g. namespace, class, etc.
        /// </summary>
        public string TagName { get; private set; }
        /// <summary>
        /// The text lines of the tag, could be one or more.
        /// </summary>
        public List<string> Lines { get; private set; }
        /// <summary>
        /// True when this is a multiline tag
        /// </summary>
        public bool IsMultiLine  { get; private set; }
    }
}
