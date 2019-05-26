using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Reflection;
 

namespace JSDocNet
{

    /// <summary>
    /// Represents this library
    /// </summary>
    static public class Lib
    {
        static List<IDocTemplateModule> Modules = new List<IDocTemplateModule>();

        /// <summary>
        /// Returns an array of Type of A types, in a safe manner
        /// </summary>
        static internal Type[] GetTypesSafe(this Assembly A)
        {
            try
            {
                if (A != null)
                    return A.GetTypes();
            }
            catch
            {
            }

            return new Type[0];
        }
        /// <summary>
        /// Returns true if ClassType implements InterfaceType.  
        /// </summary>
        static internal bool ImplementsInterface(this Type ClassType, Type InterfaceType)
        {
            return (ClassType != null) && (Array.IndexOf(ClassType.GetInterfaces(), InterfaceType) != -1);
        }
        /// <summary>
        /// A kind of "virtual constructor" of any type of object. 
        /// Example call for a constructor with no params/arguments
        ///    Create(typeof(object), new Type[]{ },  new object[]{ });
        /// </summary>
        static internal object Create(this Type ClassType, Type[] Params, object[] Args)
        {
            if (ClassType != null)
            {
                BindingFlags BindingFlags = BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;
                ConstructorInfo Constructor = ClassType.GetConstructor(BindingFlags, null, Params, null);
                if (Constructor == null)
                    throw new ApplicationException("Constructor not found for class: " + ClassType.Name);
                return Constructor.Invoke(Args);
            }

            return null;
        }
        /// <summary>
        /// A kind of "virtual constructor" of any type of object. 
        /// Example call for a constructor with no params/arguments
        ///    Create(typeof(object));
        /// </summary>
        static internal object Create(this Type ClassType)
        {
            return Create(ClassType, new Type[] { }, new object[] { });
        }
        /// <summary>
        /// Loads and scans plugin assemblies looking for types implementing the IDocTemplateModule
        /// </summary>
        static void LoadTemplateModules()
        {

            Modules.Add(new DefaultTemplateModule());

            string Prefix = "dtm_";
            string SearchPattern = string.Format("{0}*.dll", Prefix);
            string[] FileNames = Directory.GetFiles(Sys.AppFolder, SearchPattern);

            Type InterfaceType = typeof(IDocTemplateModule);
            Assembly A = null;
            foreach (string FilePath in FileNames)
            {
                try
                {
                    A = Assembly.LoadFrom(FilePath);

                    Type[] Types = A.GetTypesSafe();

                    foreach (Type T in Types)
                    {
                        try
                        {
                            if (T.IsClass && T.ImplementsInterface(InterfaceType))
                            {
                                Modules.Add(T.Create() as IDocTemplateModule);
                            }
                        }
                        catch
                        {
                        }
                    }

                }
                catch
                {
                }
            }
        }

        /* construction */
        /// <summary>
        /// Static constructor
        /// </summary>
        static Lib()
        {
            LoadTemplateModules();
        }

        /* public */
        /// <summary>
        /// Executes the parsing and the documentation generation
        /// </summary>
        static public DocItemGlobal Execute(string ConfigFilePath)
        {
            if (!File.Exists(ConfigFilePath))
                Sys.Error("Config not found: {0}", ConfigFilePath);

            Settings Settings = new Settings();
            Settings.Load(ConfigFilePath);

            Parser Parser = Parser.Execute(ConfigFilePath);
            return Parser.Global; 
        }
        /// <summary>
        /// Finds and returns an instance of a template module by name.
        /// <para>Throws an exception if the module is not found.</para>
        /// </summary>
        static internal IDocTemplateModule GetTemplateModule(string Name)
        {
            IDocTemplateModule Result = Modules.FirstOrDefault(item => Name.IsSameText(item.Name));
            if (Result == null)
                Sys.Error("Template module not found: {0}", Name);

            return Result;
        }
    }
}
