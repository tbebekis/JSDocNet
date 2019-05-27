using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace JSDocNet.Panel
{
    public partial class ConfigFileDialog : Form
    {

        string JsonText = string.Empty;

        void AnyClick(object sender, EventArgs ea)
        {
            if (btnOK == sender)
            {
                JsonText = edtJson.Text.Trim();
                if (!string.IsNullOrWhiteSpace(JsonText))
                    this.DialogResult = DialogResult.OK; 
            }
        }

        /* private */
        void FormInitialize()
        {
            this.CancelButton = btnCancel;

            btnOK.Click += AnyClick;
            edtJson.Text = JsonText;
        }

        /* overrides */
        protected override void OnShown(EventArgs e)
        {
            base.OnShown(e);
            FormInitialize();
        }

        /* construction */
        public ConfigFileDialog()
        {
            InitializeComponent();
        }

        /* static */
        static public bool ShowModal(ref string JsonText)
        {
            using (var F = new ConfigFileDialog())
            {
                F.JsonText = JsonText;
                if (F.ShowDialog() == DialogResult.OK)
                {
                    JsonText = F.JsonText;
                    return true;
                }
            }

            return false;
        }
    }
}
