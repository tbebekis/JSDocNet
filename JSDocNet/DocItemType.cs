using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{
    /// <summary>
    /// The type of a documented code element
    /// </summary>
    [Flags]
    public enum DocItemType
    {
        /// <summary>
        /// Global
        /// </summary>
        Global = 1,
        /// <summary>
        /// Namespace
        /// </summary>
        Namespace = 2,
        /// <summary>
        /// Class
        /// </summary>
        Class = 4,
        /// <summary>
        /// Constructor
        /// </summary>
        Constructor = 8,
        /// <summary>
        /// Constant
        /// </summary>
        Constant = 0x10,
        /// <summary>
        /// Field
        /// </summary>
        Field = 0x20,
        /// <summary>
        /// Property
        /// </summary>
        Property = 0x40,
        /// <summary>
        /// Function
        /// </summary>
        Function = 0x80,
        /// <summary>
        /// Enum
        /// </summary>
        Enum = 0x100,
        /// <summary>
        /// Interface
        /// </summary>
        Interface = 0x200,
        /// <summary>
        /// Callback
        /// </summary>
        Callback = 0x400,
    }
}
