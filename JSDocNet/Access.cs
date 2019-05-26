using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{

    /// <summary>
    /// Indicates the visibility of a source code element
    /// </summary>
    [Flags]
    public enum Access
    {
        /// <summary>
        /// None
        /// </summary>
        None = 0,
        /// <summary>
        /// Private
        /// </summary>
        Private = 1,
        /// <summary>
        /// Protected
        /// </summary>
        Protected = 2,
        /// <summary>
        /// Public
        /// </summary>
        Public = 4,
    }
}
