using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{

    /// <summary>
    /// The information of a @return block tag
    /// </summary>
    public class FuncReturn
    {
        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        public FuncReturn(DocItem Parent, string Text)
        {
            //this.Parent = Parent;
            //this.Text = Text;

            if (!string.IsNullOrWhiteSpace(Text))
            {
                //@return {String} The description of the return
                string S;
                Description = Sys.ExtractBracketedString(Text, out S);
                Type = S;
            }
        }



        /* properties */
        /// <summary>
        /// Type
        /// </summary>
        public string Type { get; protected set; }
        /// <summary>
        /// Description
        /// </summary>
        public string Description { get; protected set; }
    }
}
