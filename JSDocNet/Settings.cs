using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

using Newtonsoft.Json;


namespace JSDocNet
{

    /// <summary>
    /// Parser and documentation generation settings
    /// </summary>
    public class Settings
    {

        /* construction */
        /// <summary>
        /// Construction
        /// </summary>
        public Settings()
        {
            OutputFolder = Path.GetFullPath(".\\" + "DocDefault");
            DeleteExistingOutput = true;
            Template = "Default";

            IncludePathList = new List<string>();

            // all .js files
            IncludePattern = @".+\.js?$";

            // all *es5.js, *min.js, *old*.js, *polyfill*.js
            ExcludePattern = @".+(?i)es5\.js|.+min\.js|.+old*.+\.js|.+polyfill.+\.js";

            DocTitle = "Default Doc Title";
            FooterText = "Documentation Footer";
            DisplayDate = true;

            TutorialsFolder = Path.GetFullPath(".\\" + "Tutorials");
            TutorialList = new List<string>();
            TutorialList.Add("TutorialId|TutorialTitle|TutorialCategory");
        }

        /* public */
        /// <summary>
        /// Clears this instance
        /// </summary>
        public void Clear()
        {
            IncludePathList.Clear();
            TutorialList.Clear();
        }
        /// <summary>
        /// Loads this instance from a json file
        /// </summary>
        public void Load(string FilePath)
        {
            if (File.Exists(FilePath))
            {
                Clear();

                string JsonText = Sys.LoadTextFromFile(FilePath);
                Sys.FromJson(JsonText, this);
            } 
        }
        /// <summary>
        /// Saves this instance to a json file
        /// </summary>
        public void Save(string FilePath)
        {
            string JsonText = Sys.ToJson(this);
            Sys.SaveTextToFile(FilePath, JsonText);
        }

        /* properties */
        /// <summary>
        /// Optional. The output folder where the generated documentation is placed. Defaults to .\DocDefault
        /// </summary>
        public string OutputFolder { get; set; }
        /// <summary>
        /// Optional. Delete existing output folder. Defaults to true.
        /// </summary>
        public bool DeleteExistingOutput { get; set; }
        /// <summary>
        /// Optional. The name of the documentation template module to use in generating documentation files. Empty or default, means the default template module.
        /// <para>External documentation template modules are loaded at the application startup, 
        /// scanning any assembly found in the application folder with a file name like dtm_XXXXXX.dll (dtm stands for Documentation Template Module). 
        /// and gathering types implementing the IDocTemplateModule interface.</para>
        /// </summary>
        public string Template { get; set; }

        /// <summary>
        /// Required. A list of folders or files. All these are included in parsing
        /// </summary>
        public List<string> IncludePathList { get; set; }
        /// <summary>
        /// Required. A regular expression. All files/folders, specified by the IncludePathList setting, that match to this setting are included in parsing. Empty means all. 
        /// </summary>
        public string IncludePattern { get; set; }
        /// <summary>
        /// Required. A regular expression. All files/folders, specified by the IncludePathList setting, that match to this setting are excluded from parsing. Empty means no excludes. 
        /// </summary>
        public string ExcludePattern { get; set; }


        /// <summary>
        /// Required. Documentation title
        /// </summary>
        public string DocTitle { get; set; }
        /// <summary>
        /// Required. Footer text
        /// </summary>
        public string FooterText { get; set; }
        /// <summary>
        /// True means display the generation date in footer
        /// </summary>
        public bool DisplayDate { get; set; }


        /// <summary>
        /// Optional. The folder where the tutorials can be found
        /// </summary>
        public string TutorialsFolder { get; set; }
        /// <summary>
        /// Optional. A string list where each entry has the format TutorialName|TutorialTitle[|TutorialCategory]. 
        /// <para>Used to create links (anchors) for the tutorials in the generated html.</para>
        /// </summary>
        public List<string> TutorialList { get; set; }

        /// <summary>
        /// Optional. The full path to an .html file to be used as content for the index.html of the generated documentation
        /// </summary>
        public string HomePagePath { get; set; }
    }
}
