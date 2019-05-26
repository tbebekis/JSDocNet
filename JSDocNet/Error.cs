using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{

    /// <summary>
    /// Represents the information of a @throws block tag
    /// </summary>
    public class Error
    {

        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        public Error(DocItem Parent, string Text)
        {
            //this.Parent = Parent;
 

            string S;

            // @throws {Type} Description
            Description = Sys.ExtractBracketedString(Text, out S);
            Type = S;
        }

        /* properties */
        /// <summary>
        /// The type of the error
        /// </summary>
        public string Type { get; private set; }
        /// <summary>
        /// Description
        /// </summary>
        public string Description { get; private set; }
    }
}
