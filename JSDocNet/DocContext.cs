using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{

    /// <summary>
    /// A context class.
    /// It contains all the available information after parsing the javascript source files and the config file.
    /// An instance of this class is passed to the template module which then is responsible for generating the documentation.
    /// </summary>
    public class DocContext
    {
        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        internal DocContext(DocItemGlobal Global, Settings Settings, List<Tutorial> Tutorials)
        {
            this.Global = Global;
            this.Settings = Settings;
            this.Tutorials = Tutorials;
        }

        /* properties */
        /// <summary>
        /// The global namespace. It is actually the root of a tree of DocItem objects.
        /// </summary>
        public DocItemGlobal Global { get; private set; }
        /// <summary>
        /// The settings of the config file of the active template.
        /// </summary>
        public Settings Settings { get; private set; }
        /// <summary>
        /// Information about the tutorials that should be used with the documentation.
        /// </summary>
        public List<Tutorial> Tutorials { get; private set; }
    }
}
