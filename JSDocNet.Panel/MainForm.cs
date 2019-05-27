using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

using JSDocNet;

namespace JSDocNet.Panel
{
    public partial class MainForm : Form
    {
        /* private */
        ConfigFiles ConfigFiles = new ConfigFiles();
        bool IsExecuting = false;

        /* event handlers */
        void AnyClick(object sender, EventArgs ea)
        {
            if (btnExecute == sender)
            {
                Execute();
            }
            else if (btnLoad == sender)
            {
                ConfigFileLoad();
            }
            else if (btnEdit == sender)
            {
                Edit();
            }
            else if (btnInsert == sender)
            {
                Insert();
            }
            else if (btnDelete == sender)
            {
                Delete();
            }

        }

        /* private */
        void FormInitialize()
        {
            LoadConfigFiles();

            btnExecute.Click += AnyClick;
            btnLoad.Click += AnyClick;
            btnEdit.Click += AnyClick;
            btnInsert.Click += AnyClick;
            btnDelete.Click += AnyClick;
        }
        void SaveTemplateConfig()
        {
            string FilePath = Path.GetFullPath(".\\" + "DocConfig.json");

            JSDocNet.Settings Settings = new JSDocNet.Settings();
            Settings.Save(FilePath);
        }

        void LoadConfigFiles()
        {
            ConfigFiles.Load();
            if (ConfigFiles.PathList.Count == 0)
            {
                string FilePath = Path.GetFullPath(".\\" + "DefaultTemplateConfig.json");
                if (File.Exists(FilePath))
                {
                    ConfigFiles.PathList.Add(FilePath);
                    ConfigFiles.Save();
                }
            }

            if (ConfigFiles.PathList.Count > 0)
            {
                cboConfigFiles.Items.AddRange(ConfigFiles.PathList.ToArray());
                cboConfigFiles.SelectedIndex = 0;
            }
        }
        void Execute()
        {
            if (!IsExecuting)
            {
                pnlRed.Visible = true;
                IsExecuting = true;
                try
                {
                    edtLog.Text = string.Empty;

                    string FilePath = cboConfigFiles.Text;
                    if (!string.IsNullOrWhiteSpace(FilePath))
                    {
                        try
                        {
                            JSDocNet.Lib.Execute(FilePath);
                            edtLog.Text = "OK";
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show(ex.ToString());

                            edtLog.Text = ex.ToString() + Environment.NewLine + edtLog.Text;
                        }
                    }
                }
                finally
                {
                    IsExecuting = false;
                    pnlRed.Visible = false;
                }
            }

        }
        void ConfigFileLoad()
        {
            if (IsExecuting)
                return;

            using (OpenFileDialog F = new OpenFileDialog())
            {
                if (F.ShowDialog() == DialogResult.OK)
                {
                    string FilePath = F.FileName;
                    if (File.Exists(FilePath) && cboConfigFiles.Items.IndexOf(FilePath) == -1)
                    {
                        ConfigFiles.PathList.Add(FilePath);
                        ConfigFiles.Save();

                        cboConfigFiles.Items.Add(FilePath);
                        cboConfigFiles.SelectedIndex = cboConfigFiles.Items.IndexOf(FilePath);
                    }
                }
            }
        }
        void Edit()
        {
            if (IsExecuting)
                return;

            string FilePath = cboConfigFiles.Text;
            if (!string.IsNullOrWhiteSpace(FilePath))
            {
                if (!File.Exists(FilePath))
                {
                    MessageBox.Show("File not found");
                    return;
                }

                string JsonText = File.ReadAllText(FilePath);

                if (ConfigFileDialog.ShowModal(ref JsonText))
                {
                    File.WriteAllText(FilePath, JsonText);
                }

            }
        }
        void Insert()
        {
            if (IsExecuting)
                return;

            string JsonText = string.Empty;
            if (ConfigFileDialog.ShowModal(ref JsonText))
            {
                using (SaveFileDialog F = new SaveFileDialog())
                {
                    if (F.ShowDialog() == DialogResult.OK)
                    {
                        string FilePath = F.FileName;
                        File.WriteAllText(FilePath, JsonText);
                        ConfigFiles.PathList.Add(FilePath);
                        ConfigFiles.Save();

                        cboConfigFiles.Items.Add(FilePath);
                        cboConfigFiles.SelectedIndex = cboConfigFiles.Items.IndexOf(FilePath);
                    }
                }
            }
        }
        void Delete()
        {
            if (IsExecuting)
                return;

            if (!string.IsNullOrWhiteSpace(cboConfigFiles.Text))
            {
                //string text, string caption, MessageBoxButtons buttons
                if (MessageBox.Show("Delete confing entry?", "Question", MessageBoxButtons.OKCancel) == DialogResult.OK)
                {
                    cboConfigFiles.Items.RemoveAt(cboConfigFiles.SelectedIndex);

                    ConfigFiles.PathList.Clear();
                    ConfigFiles.PathList.AddRange(cboConfigFiles.Items.OfType<string>());
                    ConfigFiles.Save();
                }
            }
        }

        /* overrides */
        protected override void OnShown(EventArgs e)
        {
            base.OnShown(e);
            FormInitialize();
        }
        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            e.Cancel = IsExecuting;
            base.OnFormClosing(e);
        }


        /* construction */
        public MainForm()
        {
            InitializeComponent();
        }
    }
}
