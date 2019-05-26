using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{
    /// <summary>
    /// The information regarding a tutorial.
    /// </summary>
    public class Tutorial
    {
        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        public Tutorial(string Id, string Title, string Category)
        {
            this.Id = Id;
            this.Title = !string.IsNullOrWhiteSpace(Title) ? Title : Id;
            this.Category = !string.IsNullOrWhiteSpace(Category) ? Category : string.Empty;
            this.FileName = Id + ".html";
        }


        /* properties */
        /// <summary>
        /// Id
        /// </summary>
        public string Id { get; private set; }
        /// <summary>
        /// Title
        /// </summary>
        public string Title { get; private set; }
        /// <summary>
        /// Category
        /// </summary>
        public string Category { get; private set; }
        /// <summary>
        /// The .html file name of the tutorial.
        /// </summary>
        public string FileName { get; private set; }

    }

}
