namespace JSDocNet.Panel
{
    partial class MainForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.panel1 = new System.Windows.Forms.Panel();
            this.pnlButtons = new System.Windows.Forms.Panel();
            this.pnlRed = new System.Windows.Forms.Panel();
            this.btnExecute = new System.Windows.Forms.Button();
            this.btnLoad = new System.Windows.Forms.Button();
            this.btnEdit = new System.Windows.Forms.Button();
            this.btnInsert = new System.Windows.Forms.Button();
            this.btnDelete = new System.Windows.Forms.Button();
            this.cboConfigFiles = new System.Windows.Forms.ComboBox();
            this.panel2 = new System.Windows.Forms.Panel();
            this.edtLog = new System.Windows.Forms.TextBox();
            this.panel1.SuspendLayout();
            this.pnlButtons.SuspendLayout();
            this.panel2.SuspendLayout();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.pnlButtons);
            this.panel1.Controls.Add(this.cboConfigFiles);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(684, 85);
            this.panel1.TabIndex = 3;
            // 
            // pnlButtons
            // 
            this.pnlButtons.Controls.Add(this.pnlRed);
            this.pnlButtons.Controls.Add(this.btnExecute);
            this.pnlButtons.Controls.Add(this.btnLoad);
            this.pnlButtons.Controls.Add(this.btnEdit);
            this.pnlButtons.Controls.Add(this.btnInsert);
            this.pnlButtons.Controls.Add(this.btnDelete);
            this.pnlButtons.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlButtons.Location = new System.Drawing.Point(0, 23);
            this.pnlButtons.Name = "pnlButtons";
            this.pnlButtons.Size = new System.Drawing.Size(684, 62);
            this.pnlButtons.TabIndex = 3;
            // 
            // pnlRed
            // 
            this.pnlRed.BackColor = System.Drawing.Color.Red;
            this.pnlRed.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlRed.Location = new System.Drawing.Point(100, 0);
            this.pnlRed.Name = "pnlRed";
            this.pnlRed.Size = new System.Drawing.Size(184, 62);
            this.pnlRed.TabIndex = 5;
            this.pnlRed.Visible = false;
            // 
            // btnExecute
            // 
            this.btnExecute.Dock = System.Windows.Forms.DockStyle.Left;
            this.btnExecute.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(161)));
            this.btnExecute.Location = new System.Drawing.Point(0, 0);
            this.btnExecute.Name = "btnExecute";
            this.btnExecute.Size = new System.Drawing.Size(100, 62);
            this.btnExecute.TabIndex = 0;
            this.btnExecute.Text = "Execute";
            this.btnExecute.UseVisualStyleBackColor = true;
            // 
            // btnLoad
            // 
            this.btnLoad.Dock = System.Windows.Forms.DockStyle.Right;
            this.btnLoad.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(161)));
            this.btnLoad.Location = new System.Drawing.Point(284, 0);
            this.btnLoad.Name = "btnLoad";
            this.btnLoad.Size = new System.Drawing.Size(100, 62);
            this.btnLoad.TabIndex = 1;
            this.btnLoad.Text = "Load";
            this.btnLoad.UseVisualStyleBackColor = true;
            // 
            // btnEdit
            // 
            this.btnEdit.Dock = System.Windows.Forms.DockStyle.Right;
            this.btnEdit.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(161)));
            this.btnEdit.Location = new System.Drawing.Point(384, 0);
            this.btnEdit.Name = "btnEdit";
            this.btnEdit.Size = new System.Drawing.Size(100, 62);
            this.btnEdit.TabIndex = 3;
            this.btnEdit.Text = "Edit";
            this.btnEdit.UseVisualStyleBackColor = true;
            // 
            // btnInsert
            // 
            this.btnInsert.Dock = System.Windows.Forms.DockStyle.Right;
            this.btnInsert.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(161)));
            this.btnInsert.Location = new System.Drawing.Point(484, 0);
            this.btnInsert.Name = "btnInsert";
            this.btnInsert.Size = new System.Drawing.Size(100, 62);
            this.btnInsert.TabIndex = 2;
            this.btnInsert.Text = "Insert";
            this.btnInsert.UseVisualStyleBackColor = true;
            // 
            // btnDelete
            // 
            this.btnDelete.Dock = System.Windows.Forms.DockStyle.Right;
            this.btnDelete.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(161)));
            this.btnDelete.Location = new System.Drawing.Point(584, 0);
            this.btnDelete.Name = "btnDelete";
            this.btnDelete.Size = new System.Drawing.Size(100, 62);
            this.btnDelete.TabIndex = 4;
            this.btnDelete.Text = "Delete";
            this.btnDelete.UseVisualStyleBackColor = true;
            // 
            // cboConfigFiles
            // 
            this.cboConfigFiles.Dock = System.Windows.Forms.DockStyle.Top;
            this.cboConfigFiles.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboConfigFiles.Font = new System.Drawing.Font("Courier New", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(161)));
            this.cboConfigFiles.FormattingEnabled = true;
            this.cboConfigFiles.Location = new System.Drawing.Point(0, 0);
            this.cboConfigFiles.Name = "cboConfigFiles";
            this.cboConfigFiles.Size = new System.Drawing.Size(684, 23);
            this.cboConfigFiles.TabIndex = 2;
            // 
            // panel2
            // 
            this.panel2.Controls.Add(this.edtLog);
            this.panel2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel2.Location = new System.Drawing.Point(0, 85);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(684, 376);
            this.panel2.TabIndex = 4;
            // 
            // edtLog
            // 
            this.edtLog.Dock = System.Windows.Forms.DockStyle.Fill;
            this.edtLog.Font = new System.Drawing.Font("Courier New", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(161)));
            this.edtLog.Location = new System.Drawing.Point(0, 0);
            this.edtLog.Multiline = true;
            this.edtLog.Name = "edtLog";
            this.edtLog.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.edtLog.Size = new System.Drawing.Size(684, 376);
            this.edtLog.TabIndex = 0;
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(684, 461);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.panel1);
            this.Name = "MainForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "JDDocNet: a javascript documentation generator";
            this.panel1.ResumeLayout(false);
            this.pnlButtons.ResumeLayout(false);
            this.panel2.ResumeLayout(false);
            this.panel2.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Panel pnlButtons;
        private System.Windows.Forms.Panel pnlRed;
        private System.Windows.Forms.Button btnExecute;
        private System.Windows.Forms.Button btnLoad;
        private System.Windows.Forms.Button btnEdit;
        private System.Windows.Forms.Button btnInsert;
        private System.Windows.Forms.Button btnDelete;
        private System.Windows.Forms.ComboBox cboConfigFiles;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.TextBox edtLog;
    }
}

