using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{

    /// <summary>
    /// Represents the information of a @fires block tag
    /// </summary>
    public class Event
    {

        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        public Event(DocItem Parent, string Text)
        {
            // @fires {Type|Name} Description
            //this.Parent = Parent;
            //this.Text = Text;

            string S;

            Description = Sys.ExtractBracketedString(Text, out S);

            string[] Parts = S.Split('|');
            if (Parts.Length > 0)
                Type = Parts[0];

            if (Parts.Length > 1)
                Name = Parts[1];

        }

        /* properties */
        /// <summary>
        /// Name
        /// </summary>  
        public string Name { get; private set; }
        /// <summary>
        /// Type
        /// </summary>
        public string Type { get; private set; }
        /// <summary>
        /// Description
        /// </summary>
        public string Description { get; private set; }
    }
}
