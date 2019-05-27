using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

using JSDocNet;

namespace JSDocNet.Panel
{
    public class ConfigFiles
    {
        string FilePath = Path.GetFullPath(".\\" + "ConfigFiles.json");

        /* construction */
        public ConfigFiles()
        {
            PathList = new List<string>();
        }

        /* public */
        public void Load()
        {
            if (File.Exists(FilePath))
            {
                PathList.Clear();
                Sys.Load(this, FilePath);
            }
            
        }
        public void Save()
        {
            Sys.Save(this, FilePath);
        }

        /* properties */
        public List<string> PathList { get; set; }
    }
}
