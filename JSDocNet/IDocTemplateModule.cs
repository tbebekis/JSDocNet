using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{

    /// <summary>
    /// Represents an object that generates the actual documentation
    /// </summary>
    public interface IDocTemplateModule
    {
        /* methods */
        /// <summary>
        /// It is passed the parser results in order to generate the actual documentation
        /// </summary>
        void Execute(DocContext Context);


        /* properties */
        /// <summary>
        /// The name fo this template module, e.g. Default
        /// </summary>
        string Name { get; }
    }
}
