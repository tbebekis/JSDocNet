using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.IO;
using System.Text.RegularExpressions;

namespace JSDocNet
{
 

    /// <summary>
    /// Parses javascript files for documentation comments
    /// </summary>
    internal class Parser
    {
        /* private */
        string[] FilePaths;


        List<Tutorial> PrepareTutorials()
        {
            List<Tutorial> Result = new List<Tutorial>();

            if (Settings.TutorialList != null)
            {

                string S, Name, Title, Category;
                string[] Parts;
                Tutorial T;

                for (int i = 0; i < Settings.TutorialList.Count; i++)
                {
                    S = Settings.TutorialList[i].Trim();
                    Parts = S.Split(new char[] { '|' }, StringSplitOptions.RemoveEmptyEntries);
                    if (Parts.Length > 0)
                    {
                        Name = Parts[0];
                        Title = Parts.Length > 1 ? Parts[1] : string.Empty;
                        Category = Parts.Length > 2 ? Parts[2] : string.Empty;

                        T = new Tutorial(Name, Title, Category);
                        Result.Add(T);
                    }

                }
            }

            return Result;
        }
 

        bool IsMatch(string Pattern, string Text)
        {
            Regex regex = new Regex(Pattern);
            Match match = regex.Match(Text);
            return match.Success;
        }
        bool IsIncludeMatch(string FilePath)
        {
            if (string.IsNullOrWhiteSpace(Settings.IncludePattern))
                return true;

            bool Result = IsMatch(Settings.IncludePattern, FilePath);
            return Result;
        }
        bool IsExcludeMatch(string FilePath)
        {
            if (string.IsNullOrWhiteSpace(Settings.ExcludePattern))
                return false;

            bool Result = IsMatch(Settings.ExcludePattern, FilePath);
            return Result;
        }
 
        void Execute()
        {
            List<Tutorial> Tutorials = PrepareTutorials();

            string TemplateName = !string.IsNullOrWhiteSpace(Settings.Template)? Settings.Template: "Default";      
            IDocTemplateModule Template = Lib.GetTemplateModule(TemplateName);

            PrepareParseFileList();            
            Parse();
            Global.Fixup();

            DocContext Context = new DocContext(Global, Settings, Tutorials);
 
            Template.Execute(Context);
        }
        void PrepareParseFileList()
        {
            List<string> ParseFileList = new List<string>();
            List<string> TempList = new List<string>();

            foreach (string F in Settings.IncludePathList)
            {
                if (File.Exists(F))
                {
                    TempList.Add(F);
                }
                else if (Directory.Exists(F))
                {
                    TempList.AddRange(Directory.GetFiles(F));
                }
            }

            foreach (string FilePath in TempList)
            {
                if (ParseFileList.FirstOrDefault(item => item.IsSameText(FilePath)) == null)
                {
                    if (IsIncludeMatch(FilePath) && !IsExcludeMatch(FilePath))
                    {
                        ParseFileList.Add(FilePath);
                    }
                }
            }

            if (ParseFileList.Count == 0)
                Sys.Error("No files to parse");

            FilePaths = ParseFileList.ToArray();
        }
        void Parse()
        {
            string[] Lines;
            string Line;
            string L; // trimmed line

            DocLet DocLet = null;
            Block Block = null;
            LineKind Kind = LineKind.None;
            string S;
            string TagName = string.Empty;



            foreach (string FilePath in FilePaths)
            {

                Lines = File.ReadAllLines(FilePath);

                for (int i = 0; i < Lines.Length; i++)
                {
                    Line = Lines[i];

                    if (DocLet == null && Line.Trim().Length == 0 && (Block == null))
                        continue;


                    L = Line.Trim(' ', '\n', '\r', '\t');


                    // line kind detection
                    // ------------------------------------------------------------------------
                    Kind = LineKind.None;
                    TagName = string.Empty;

                    if (DocLet == null && L.StartsWith("/**"))
                    {
                        Kind |= LineKind.First;
                        L = L.Remove(0, 3).TrimStart();
                        Line = L;

                        DocLet = new DocLet(FilePath, i, Lines);
                    }


                    if (DocLet != null)
                    {
                        if (L.EndsWith("*/"))
                        {
                            Kind |= LineKind.Last;
                            L = L.Remove(L.Length - 2, 2);
                            L = L.TrimEnd();

                            Line = Line.TrimEnd();
                            Line = Line.Remove(Line.Length - 2, 2);
                        }

                        if (L.TrimStart(' ', '*').StartsWith("@"))
                        {
 
                            L = L.TrimStart(' ', '*');
                            S = Tags.FindBlockTag(L);

                            if (S != string.Empty)
                            {
                                Kind |= LineKind.Block;
                                TagName = S;

                                L = L.Remove(0, TagName.Length).TrimStart();
                                Line = L;

                                Block = new Block(TagName, L);
                                DocLet.Blocks.Add(Block);
                                L = "";

                                if (!Block.IsMultiLine)
                                {
                                    Block = null;
                                }

                                if (!Sys.In(LineKind.Last, Kind))
                                    continue;

                            }
                        }

                        if (!string.IsNullOrWhiteSpace(L))
                        {
                            if (Block == null)
                            {
                                Kind |= LineKind.Block;
                                TagName = Tags.Description;

                                Block = new Block(TagName, L);
                                DocLet.Blocks.Add(Block);
                            }
                            else if (Block.IsMultiLine)
                            {
                                Kind |= LineKind.Line;
                                Block.Lines.Add(Line);
                            }
                        }
                        else if (Block != null && !Sys.In(LineKind.Last, Kind))
                        {
                            Block.Lines.Add(Line);
                        }


                        // doclet or block creation and line addition
                        // ------------------------------------------------------------------------

                        if (Sys.In(LineKind.Last, Kind))
                        {
                            DocLet.LastLineIndex = i;
                            if (DocLet.Blocks.Count > 0)
                                ParseDocLet(DocLet);

                            DocLet = null;
                            Block = null;
                        }

                    }





                }
            }
        }
        void ParseDocLet(DocLet DocLet)
        {
            DocItem Item = null;
 
            if (DocLet.Find(Tags.Namespace) != null)
            {
                Item = new DocItem(this, DocLet, DocItemType.Namespace);
            } 
            else if (DocLet.Find(Tags.Class) != null)
            {
                Item = new DocItem(this, DocLet, DocItemType.Class);
            }
            else if (DocLet.Find(Tags.Interface) != null)
            {
                Item = new DocItem(this, DocLet, DocItemType.Interface);
            }
            else if (DocLet.Find(Tags.Enum) != null)
            {
                Item = new DocItem(this, DocLet, DocItemType.Enum);
            }
            else if (DocLet.Find(Tags.Constructor) != null)
            {
                Item = new DocItem(this, DocLet, DocItemType.Constructor);
            }
            else if (DocLet.Find(Tags.Field) != null)
            {
                Item = new DocItem(this, DocLet, DocItemType.Field);
            }
            else if (DocLet.Find(Tags.Constant) != null)
            {
                Item = new DocItem(this, DocLet, DocItemType.Constant);
            }
            else if (DocLet.Find(Tags.Property) != null)
            {
                Item = new DocItem(this, DocLet, DocItemType.Property);
            }
            else if (DocLet.Find(Tags.Function) != null)
            {
                if (DocLet.Find(Tags.Namespace) == null && DocLet.Find(Tags.Enum) == null)
                    Item = new DocItem(this, DocLet, DocItemType.Function);
            }
            else if (DocLet.Find(Tags.Callback) != null)
            {
                Item = new DocItem(this, DocLet, DocItemType.Callback);
            }
 

            if (Item != null)
            {
                string Name = Item.Name;
                Global.AddToFlatList(Item);
            }

        }


        /* construction */
        private Parser(Settings Settings)
        {
            this.Settings = Settings;
            this.Global = new DocItemGlobal(this);
        }


        /* internal */
        static internal Parser Execute(string ConfigFilePath)
        {
            if (!File.Exists(ConfigFilePath))
                Sys.Error("Config not found: {0}", ConfigFilePath);

            Settings Settings = new Settings();
            Settings.Load(ConfigFilePath);

            return Execute(Settings);
        }
        static internal Parser Execute(Settings Settings)
        {
            Parser Parser = new Parser(Settings);
            Parser.Execute();
            return Parser;
        } 
 

        /* properties */
        public DocItemGlobal Global { get; private set; }
        internal Settings Settings { get; private set; }
    }
}
