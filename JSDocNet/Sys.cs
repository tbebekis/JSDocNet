using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Reflection;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;

namespace JSDocNet
{

    /// <summary>
    /// Helper
    /// </summary>
    static public class Sys
    {
        //static Directory d;
        //static DirectoryInfo di;

        /* construction */
        /// <summary>
        /// Constructor
        /// </summary>
        static Sys()
        {
            AppFolder = Path.GetDirectoryName(typeof(Sys).Assembly.Location);
        }

        /// <summary>
        /// Throws an Exception
        /// </summary>
        static public void Error(string Text, params object[] Args)
        {
            if ((Args != null) && (Args.Length > 0))
                Text = string.Format(Text, Args);
            throw new ApplicationException(Text);
        }

        /* string extensions */
        /// <summary>
        /// Case insensitive string equality.
        /// </summary>
        static public bool IsSameText(this string A, string B)
        {
            return (!string.IsNullOrEmpty(A) && !string.IsNullOrEmpty(B))
                && (string.Compare(A, B, StringComparison.InvariantCultureIgnoreCase) == 0);
        }
        /// <summary>
        /// Returns true if Value is contained in the Instance.
        /// Performs a case-insensitive check using the invariant culture.
        /// </summary>
        static public bool ContainsText(this string Instance, string Value)
        {
            if ((Instance != null) && !string.IsNullOrEmpty(Value))
            {
                return Instance.IndexOf(Value, StringComparison.InvariantCultureIgnoreCase) != -1;
            }

            return false;
        }

        

        /* list extensions */
        /// <summary>
        /// Returns the index of Value in List, case insensitively, if exists, else -1.
        /// </summary>
        static public int IndexOfText(this IList<string> List, string Value)
        {
            if (List != null)
            {
                for (int i = 0; i < List.Count; i++)
                    if (Value.IsSameText(List[i]))
                        return i;
            }
            return -1;
        }
        /// <summary>
        /// Returns trur if Value exists in List, case insensitively.
        /// </summary>
        static public bool ContainsText(this IList<string> List, string Value)
        {
            return IndexOfText(List, Value) != -1;
        }

        /* bit-fields */
        /// <summary>
        /// To be used with enum types marked with the FlagsAttribute.
        /// <para>Membership (in). Returns true if A in B. A can be a single value or a set. </para>
        /// <para>Returns true if ALL elements of A are in B.</para>
        /// <para><c>Result = (A &amp; B) == A</c></para>
        /// </summary>
        public static bool In(object A, object B)
        {
            if (0 == (int)A)
                return false;

            return (((int)A & (int)B) == (int)A);
        }


        /* files and folders */
        /// <summary>
        /// Returns an array containing the characters that are not allowed in file names.
        /// </summary>
        static public char[] GetInvalidFileNameChars()
        {
#if !COMPACT
            char[] InvalidFileChars = Path.GetInvalidFileNameChars();
#else
            char[] InvalidFileChars = {'\\', '/', ':','*',  '?', '\'','"', '<', '>', '|'   };
#endif
            return InvalidFileChars;
        }
        /// <summary>
        /// Returns true if FileName is a valid file name, that is it just contains
        /// characters that are allowed in file names.
        /// </summary>
        static public bool IsValidFileName(string FileName)
        {
            char[] InvalidFileChars = GetInvalidFileNameChars();
            return FileName.IndexOfAny(InvalidFileChars) == -1;
        }
        /// <summary>
        /// Replaces any invalid file name characters from Source with spaces.
        /// </summary>
        static public string StrToValidFileName(string Source)
        {
            char[] InvalidFileChars = GetInvalidFileNameChars();
            StringBuilder SB = new StringBuilder(Source);
            foreach (char C in InvalidFileChars)
                SB.Replace(C, ' ');
            return SB.ToString();

        }


        /// <summary>
        /// Returns tru if sPath exists.
        /// </summary>
        static public bool DirectoryExists(string sPath)
        {
            sPath = DenormalizePath(sPath);
            return Directory.Exists(sPath);
        }
        /// <summary>
        /// Creates folders of the sPath.
        /// <para>WARNING: sPath must contain path information ONLY. 
        /// No file name information at all. Just folders. </para>
        /// </summary>
        static public void ForceDirectories(string sPath)
        {
            sPath = DenormalizePath(sPath);
            if (!DirectoryExists(sPath))
                Directory.CreateDirectory(sPath);
        }
        /// <summary>
        /// Ensures that the sPath string is a valid path by adding a DirectorySeparatorChar to the end.
        /// </summary>
        static public string NormalizePath(string sPath)
        {
            if (string.IsNullOrEmpty(sPath))
                return @"\";

            if (!sPath.EndsWith(Path.DirectorySeparatorChar.ToString()))
                return sPath + Path.DirectorySeparatorChar;

            return sPath;
        }
        /// <summary>
        /// Removes any DirectorySeparatorChar from the end of the sPath.
        /// </summary>
        static public string DenormalizePath(string sPath)
        {
            if (string.IsNullOrEmpty(sPath))
                return "";

            if (sPath.EndsWith(Path.DirectorySeparatorChar.ToString()))
                return sPath.Remove(sPath.Length - 1, 1);

            return sPath;
        }
        /// <summary>
        /// Ensures that all the directories of the FileName exist.
        /// <para>WARNING: FileName MUST contain path and file name (with or without extension) information.
        /// The file name is ignored, but should be there. The rest of the path
        /// is created if it does not exist.</para>
        /// </summary>
        static public void EnsureDirectories(string FileName)
        {
            string sPath = Path.GetDirectoryName(FileName);
            ForceDirectories(sPath);
        }

        /// <summary>
        /// Copies Source folder and its contents to Destination folder.
        /// </summary>
        static private void CopyFolder(DirectoryInfo Source, DirectoryInfo Destination, bool Overwrite = true)
        {
            if (!Source.Exists)
                return;

            DirectoryInfo[] SourceSubFolders = Source.GetDirectories();
            FileInfo[] SourceFiles = Source.GetFiles();

            if (!Destination.Exists)
                Destination.Create();

            foreach (DirectoryInfo SourceSubFolder in SourceSubFolders)
                CopyFolder(SourceSubFolder, new DirectoryInfo(Path.Combine(Destination.FullName, SourceSubFolder.Name)), Overwrite);

            foreach (FileInfo SourceFile in SourceFiles)
                SourceFile.CopyTo(Path.Combine(Destination.FullName, SourceFile.Name), Overwrite);
        }
        /// <summary>
        /// Copies Source folder and its contents to Destination folder.
        /// </summary>
        static public void CopyFolder(string Source, string Destination, bool Overwrite = true)
        {
            DirectoryInfo SourceDI = new DirectoryInfo(Source.Trim());
            if (!SourceDI.Exists)
                return;

            DirectoryInfo DestinationDI = new DirectoryInfo(Destination.Trim());

            CopyFolder(SourceDI, DestinationDI, Overwrite);
        }


        /// <summary>
        /// Saves Text to FilePath using Encoding
        /// </summary>
        static public void SaveTextToFile(string FilePath, string Text, Encoding Encoding)
        {
            Sys.ForceDirectories(Path.GetDirectoryName(FilePath));

            using (StreamWriter SW = new StreamWriter(FilePath, false, Encoding))
            {
                SW.Write(Text);
                SW.Flush();
            }
        }
        /// <summary>
        /// Saves Text to FilePath using Encoding.UTF8
        /// </summary>
        static public void SaveTextToFile(string FilePath, string Text)
        {
            SaveTextToFile(FilePath, Text, Encoding.UTF8);
        }
        /// <summary>
        /// Loads the FilePath file, using Encoding, and returns its text.
        /// </summary>
        static public string LoadTextFromFile(string FilePath, Encoding Encoding)
        {
            if (File.Exists(FilePath))
            {
                using (StreamReader SR = new StreamReader(FilePath, Encoding))
                {
                    return SR.ReadToEnd();
                }
            }

            return string.Empty;
        }
        /// <summary>
        /// Loads the FilePath file, using Encoding.UTF8, and returns its text.
        /// </summary>
        static public string LoadTextFromFile(string FilePath)
        {
            return LoadTextFromFile(FilePath, Encoding.UTF8);
        }

        /* load/save instance into a file */
        /// <summary>
        /// Returns the full file path of an instance file.
        /// <para>Instance file, is the file where an instance, such as a settings instance,
        /// could be load from or save to.</para>
        /// </summary>
        static public string InstanceFilePath(string FileName)
        {
            string FilePath = Path.Combine(AppFolder, FileName);
            return FilePath;
        }
        /// <summary>
        /// Returns true if an instance file exists.
        /// <para>Instance file, is the file where an instance, such as a settings instance,
        /// could be load from or save to.</para>
        /// </summary>
        static public bool InstanceFileExists(string FileName)
        {
            return File.Exists(InstanceFilePath(FileName));
        }
        /// <summary>
        /// Saves Instance to Sys.AppDataFolder + FileName
        /// </summary>
        static public void Save(object Instance, string FileName)
        {
            string FilePath = InstanceFilePath(FileName);
            string JsonText = ToJson(Instance);
            SaveTextToFile(FilePath, JsonText);
        }
        /// <summary>
        /// Loads Instance from Sys.AppDataFolder + FileName
        /// </summary>
        static public void Load(object Instance, string FileName)
        {
            string FilePath = InstanceFilePath(FileName);
            string JsonText = LoadTextFromFile(FilePath);
            FromJson(JsonText, Instance);
        }

        /* json */
        /// <summary>
        /// Converts an object to json text.
        /// <para> ExcludeProperties, if not null, may contain property names to be ignored</para>
        /// </summary>
        static public string ToJson(object Instance, string[] ExcludeProperties = null)
        {
            string Result = string.Empty;
            if (Instance != null)
            {
                if (ExcludeProperties != null)
                    Result = JsonConvert.SerializeObject(Instance, Formatting.Indented, new JsonSerializerSettings { ContractResolver = new JsonNetContractResolver(ExcludeProperties) });
                else
                    Result = JsonConvert.SerializeObject(Instance, Formatting.Indented);
            }
            return Result;
        }
        /// <summary>
        /// Converts an object to JObject
        /// </summary>
        static public JObject ToJObject(object Instance)
        {
            string JsonText = ToJson(Instance);
            return JObject.Parse(JsonText);
        }
        /// <summary>
        /// Converts json text to an object
        /// </summary>
        static public T FromJson<T>(string JsonText)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(JsonText);
        }
        /// <summary>
        /// Loads an object's properties from json text
        /// </summary>
        static public void FromJson(string JsonText, object Instance)
        {
            if (!string.IsNullOrWhiteSpace(JsonText))
                Newtonsoft.Json.JsonConvert.PopulateObject(JsonText, Instance);
        }

        /* parsing */
        /// <summary>
        /// Extracts a sub-string surounded by { } found in the start of the main string, removes that sub-string from the main string and returns the rest.
        /// <para>The content of the bracketed sub-string is returned as an out parameter. </para>
        /// </summary>
        static public string ExtractBracketedString(string Text, out string BracketedText)
        {
            string Result = Text;
            BracketedText = string.Empty;
            if (!string.IsNullOrWhiteSpace(Text))
            {
                // {BracketedText} The rest of the text
                string S = Text.Trim();
                int Index = S.IndexOf('}');
                if (Index > 0)
                {
                    BracketedText = S.Substring(0, Index + 1);
                    Result = S.Replace(BracketedText, string.Empty).Trim();

                    BracketedText = BracketedText.Remove(0, 1);
                    BracketedText = BracketedText.Remove(BracketedText.Length - 1, 1);
                }

            }

            return Result;
        }

        /* properties */
        /// <summary>
        /// The folder of this
        /// </summary>
        static public string AppFolder { get; private set; }
    }
}
