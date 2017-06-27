namespace PrehravacMesice
{
    partial class Form1
    {
        /// <summary>
        /// Vyžaduje se proměnná návrháře.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Uvolněte všechny používané prostředky.
        /// </summary>
        /// <param name="disposing">hodnota true, když by se měl spravovaný prostředek odstranit; jinak false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Kód generovaný Návrhářem Windows Form

        /// <summary>
        /// Metoda vyžadovaná pro podporu Návrháře - neupravovat
        /// obsah této metody v editoru kódu.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.bLoadTestCase = new System.Windows.Forms.Button();
            this.bBack = new System.Windows.Forms.Button();
            this.bAdvance = new System.Windows.Forms.Button();
            this.lblTime = new System.Windows.Forms.Label();
            this.bReset = new System.Windows.Forms.Button();
            this.bAutoplay = new System.Windows.Forms.Button();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.nTestCase = new System.Windows.Forms.NumericUpDown();
            this.button1 = new System.Windows.Forms.Button();
            this.button3 = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nTestCase)).BeginInit();
            this.SuspendLayout();
            // 
            // pictureBox1
            // 
            this.pictureBox1.Location = new System.Drawing.Point(12, 7);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(1384, 900);
            this.pictureBox1.TabIndex = 1;
            this.pictureBox1.TabStop = false;
            this.pictureBox1.Paint += new System.Windows.Forms.PaintEventHandler(this.pictureBox1_Paint);
            // 
            // bLoadTestCase
            // 
            this.bLoadTestCase.Location = new System.Drawing.Point(147, 609);
            this.bLoadTestCase.Name = "bLoadTestCase";
            this.bLoadTestCase.Size = new System.Drawing.Size(133, 23);
            this.bLoadTestCase.TabIndex = 2;
            this.bLoadTestCase.Text = "Načíst případ";
            this.bLoadTestCase.UseVisualStyleBackColor = true;
            this.bLoadTestCase.Click += new System.EventHandler(this.bLoadTestCase_Click);
            // 
            // bBack
            // 
            this.bBack.Location = new System.Drawing.Point(106, 696);
            this.bBack.Name = "bBack";
            this.bBack.Size = new System.Drawing.Size(75, 23);
            this.bBack.TabIndex = 3;
            this.bBack.Text = "-100ms";
            this.bBack.UseVisualStyleBackColor = true;
            this.bBack.Click += new System.EventHandler(this.bBack_Click);
            // 
            // bAdvance
            // 
            this.bAdvance.Location = new System.Drawing.Point(187, 696);
            this.bAdvance.Name = "bAdvance";
            this.bAdvance.Size = new System.Drawing.Size(75, 23);
            this.bAdvance.TabIndex = 4;
            this.bAdvance.Text = "+100ms";
            this.bAdvance.UseVisualStyleBackColor = true;
            this.bAdvance.Click += new System.EventHandler(this.bAdvance_Click);
            // 
            // lblTime
            // 
            this.lblTime.AutoSize = true;
            this.lblTime.Font = new System.Drawing.Font("Microsoft Sans Serif", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblTime.Location = new System.Drawing.Point(154, 660);
            this.lblTime.Name = "lblTime";
            this.lblTime.Size = new System.Drawing.Size(45, 24);
            this.lblTime.TabIndex = 5;
            this.lblTime.Text = "0.00";
            // 
            // bReset
            // 
            this.bReset.Location = new System.Drawing.Point(25, 696);
            this.bReset.Name = "bReset";
            this.bReset.Size = new System.Drawing.Size(75, 23);
            this.bReset.TabIndex = 6;
            this.bReset.Text = "Reset";
            this.bReset.UseVisualStyleBackColor = true;
            this.bReset.Click += new System.EventHandler(this.bReset_Click);
            // 
            // bAutoplay
            // 
            this.bAutoplay.Location = new System.Drawing.Point(268, 696);
            this.bAutoplay.Name = "bAutoplay";
            this.bAutoplay.Size = new System.Drawing.Size(75, 23);
            this.bAutoplay.TabIndex = 7;
            this.bAutoplay.Text = "Autoplay";
            this.bAutoplay.UseVisualStyleBackColor = true;
            this.bAutoplay.Click += new System.EventHandler(this.bAutoplay_Click);
            // 
            // timer1
            // 
            this.timer1.Enabled = true;
            this.timer1.Interval = 1;
            this.timer1.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // nTestCase
            // 
            this.nTestCase.Location = new System.Drawing.Point(41, 612);
            this.nTestCase.Maximum = new decimal(new int[] {
            15,
            0,
            0,
            0});
            this.nTestCase.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.nTestCase.Name = "nTestCase";
            this.nTestCase.Size = new System.Drawing.Size(100, 20);
            this.nTestCase.TabIndex = 8;
            this.nTestCase.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.nTestCase.ValueChanged += new System.EventHandler(this.nTestCase_ValueChanged);
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(41, 638);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(44, 23);
            this.button1.TabIndex = 9;
            this.button1.Text = "-";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // button3
            // 
            this.button3.Location = new System.Drawing.Point(91, 638);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(44, 23);
            this.button3.TabIndex = 11;
            this.button3.Text = "+";
            this.button3.UseVisualStyleBackColor = true;
            this.button3.Click += new System.EventHandler(this.button3_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1020, 741);
            this.Controls.Add(this.button3);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.nTestCase);
            this.Controls.Add(this.bAutoplay);
            this.Controls.Add(this.bReset);
            this.Controls.Add(this.lblTime);
            this.Controls.Add(this.bAdvance);
            this.Controls.Add(this.bBack);
            this.Controls.Add(this.bLoadTestCase);
            this.Controls.Add(this.pictureBox1);
            this.Name = "Form1";
            this.Text = "Přehrávání záznamů přistání";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nTestCase)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.Button bLoadTestCase;
        private System.Windows.Forms.Button bBack;
        private System.Windows.Forms.Button bAdvance;
        private System.Windows.Forms.Label lblTime;
        private System.Windows.Forms.Button bReset;
        private System.Windows.Forms.Button bAutoplay;
        private System.Windows.Forms.Timer timer1;
        private System.Windows.Forms.NumericUpDown nTestCase;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Button button3;
    }
}

