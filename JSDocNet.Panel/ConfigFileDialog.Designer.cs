namespace JSDocNet.Panel
{
    partial class ConfigFileDialog
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
            this.panel3 = new System.Windows.Forms.Panel();
            this.btnOK = new System.Windows.Forms.Button();
            this.btnCancel = new System.Windows.Forms.Button();
            this.edtJson = new System.Windows.Forms.TextBox();
            this.panel3.SuspendLayout();
            this.SuspendLayout();
            // 
            // panel3
            // 
            this.panel3.Controls.Add(this.btnOK);
            this.panel3.Controls.Add(this.btnCancel);
            this.panel3.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.panel3.Location = new System.Drawing.Point(0, 425);
            this.panel3.Name = "panel3";
            this.panel3.Size = new System.Drawing.Size(684, 36);
            this.panel3.TabIndex = 4;
            // 
            // btnOK
            // 
            this.btnOK.Dock = System.Windows.Forms.DockStyle.Right;
            this.btnOK.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(161)));
            this.btnOK.Location = new System.Drawing.Point(484, 0);
            this.btnOK.Name = "btnOK";
            this.btnOK.Size = new System.Drawing.Size(100, 36);
            this.btnOK.TabIndex = 2;
            this.btnOK.Text = "OK";
            this.btnOK.UseVisualStyleBackColor = true;
            // 
            // btnCancel
            // 
            this.btnCancel.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.btnCancel.Dock = System.Windows.Forms.DockStyle.Right;
            this.btnCancel.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(161)));
            this.btnCancel.Location = new System.Drawing.Point(584, 0);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(100, 36);
            this.btnCancel.TabIndex = 4;
            this.btnCancel.Text = "Cancel";
            this.btnCancel.UseVisualStyleBackColor = true;
            // 
            // edtJson
            // 
            this.edtJson.Dock = System.Windows.Forms.DockStyle.Fill;
            this.edtJson.Font = new System.Drawing.Font("Courier New", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(161)));
            this.edtJson.Location = new System.Drawing.Point(0, 0);
            this.edtJson.Multiline = true;
            this.edtJson.Name = "edtJson";
            this.edtJson.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.edtJson.Size = new System.Drawing.Size(684, 425);
            this.edtJson.TabIndex = 5;
            // 
            // ConfigFileDialog
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(684, 461);
            this.Controls.Add(this.edtJson);
            this.Controls.Add(this.panel3);
            this.MinimizeBox = false;
            this.Name = "ConfigFileDialog";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Config File Editor";
            this.panel3.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Panel panel3;
        private System.Windows.Forms.Button btnOK;
        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.TextBox edtJson;
    }
}