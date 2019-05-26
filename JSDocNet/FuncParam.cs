using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JSDocNet
{
    /// <summary>
    /// Represents the information of a @param block tag
    /// </summary>
    public class FuncParam
    {
        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        private FuncParam()
        {
        }
        /// <summary>
        /// Constructor
        /// </summary>
        public FuncParam(DocItem Parent, string Text)
        {
            //this.Parent = Parent;

            if (!string.IsNullOrWhiteSpace(Text))
            {
                //@param {String|Element} Selector - A selector or an element
                string S;


                var S2 = Sys.ExtractBracketedString(Text, out S);

                Type = S;
                if (!string.IsNullOrWhiteSpace(Type))
                {
                    if (Type.StartsWith("..."))
                    {
                        IsRepeatable = true;
                        Type = Type.Remove(0, 3);
                    }
                }


                if (!string.IsNullOrWhiteSpace(S2))
                {
                    S2 = S2.Trim();
                    int Index = S2.IndexOf(' ');
                    if (Index == -1)
                    {
                        Name = S2;
                    }
                    else
                    {
                        Name = S2.Substring(0, Index);
                        Description = S2.Substring(Index);
                        Description = Description.TrimStart(new char[] { ' ', '-' });
                    }

                    if (!string.IsNullOrWhiteSpace(Name))
                    {
                        Name = Name.Trim();
                        if (Name.StartsWith("["))
                        {
                            IsOptional = true;

                            Name = Name.Remove(0, 1).TrimStart();


                            if (Name.EndsWith("]"))
                            {
                                Name = Name.Remove(Name.Length - 1, 1);
                            }

                            string[] Parts = Name.Split(new char[] { '=' }, StringSplitOptions.RemoveEmptyEntries);
                            if (Parts.Length == 2)
                            {
                                Name = Parts[0];
                                Default = Parts[1];
                            }
                        }

                        if (Name.StartsWith("..."))
                        {
                            IsRepeatable = true;
                            Name = Name.Remove(0, 3).TrimStart();
                        }


                    }
                }
            }
        }


        /* static */
        /// <summary>
        /// Creates and returns an instance of this class
        /// </summary>
        static internal FuncParam CreateParam(DocItem Parent, string Name)
        {
            FuncParam Result = new FuncParam();
            //Result.Parent = Parent;
            Result.Name = Name;
            Result.Type = "Any";
            Result.Description = "";

            return Result;
        }

        /* properties */
        /// <summary>
        /// Name
        /// </summary>
        public string Name { get; protected set; }
        /// <summary>
        /// Type
        /// </summary>
        public string Type { get; protected set; }
        /// <summary>
        /// Description
        /// </summary>
        public string Description { get; protected set; }

        /// <summary>
        /// Flag
        /// </summary>
        public bool IsOptional { get; protected set; }
        /// <summary>
        /// Flag
        /// </summary>
        public bool IsRepeatable { get; protected set; }
        /// <summary>
        /// The default value of the parameter or null
        /// </summary>
        public string Default { get; protected set; }
    }

}
