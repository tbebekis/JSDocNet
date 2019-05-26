using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{
    /// <summary>
    /// Line kind, used by parser
    /// </summary>
    [Flags]
    internal enum LineKind
    {
        None = 0,

        /// <summary>
        /// DockLet First line
        /// </summary>
        First = 1,
        /// <summary>
        /// DockLet Last Line
        /// </summary>
        Last = 2,
        /// <summary>
        /// Block Start Line
        /// </summary>
        Block = 4,
        /// <summary>
        /// A secondary Line of a multi-line block
        /// </summary>
        Line = 8,
    }
}
