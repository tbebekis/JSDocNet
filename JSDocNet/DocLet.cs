using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{


    /// <summary>
    /// Represents the whole documentation comment found above a source code element.
    /// <para>The parsing operation produces DocLet instances, where a DocLet contains a Block for each block tag of the comment.</para>
    /// </summary>
    public class DocLet
    {
        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        public DocLet(string FilePath, int FirstLineIndex, string[] Lines)
        {
            this.FilePath = FilePath;
            this.FirstLineIndex = FirstLineIndex;
            this.Lines = Lines;
            Blocks = new List<Block>();
        }

        /* public */
        /// <summary>
        /// Finds and returns a block tag by name, if any, else returns null.
        /// </summary>
        public Block Find(string TagName)
        {
            return Blocks.FirstOrDefault(item => item.TagName == TagName);
        }

        /* properties */
        /// <summary>
        /// The list of blocks 
        /// </summary>
        public List<Block> Blocks { get; private set; }
        /// <summary>
        /// The path to the javascript source file
        /// </summary>
        public string FilePath { get; private set; }
        /// <summary>
        /// The index of the first line of this DocLet in the javascript source file 
        /// </summary>
        public int FirstLineIndex { get; private set; }
        /// <summary>
        /// The index of the last line of this DocLet in the javascript source file 
        /// </summary>
        public int LastLineIndex { get; set; }
        /// <summary>
        /// The text lines of the DocLet
        /// </summary>
        public string[] Lines { get; private set; }
    }
}
