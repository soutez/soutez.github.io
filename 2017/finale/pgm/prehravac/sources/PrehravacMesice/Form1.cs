using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace PrehravacMesice
{
    public partial class Form1 : Form
    {
        double currentTime = 0;
        TestCase currentCase;

        public Form1()
        {
            InitializeComponent();
        }

        private void bLoadTestCase_Click(object sender, EventArgs e)
        {
            int tcase = (int)this.nTestCase.Value;
            TestCase t = new TestCase();
            foreach (var directory in System.IO.Directory.EnumerateDirectories("cases"))
            {
                string filename = System.IO.Path.Combine(directory, tcase + ".txt");
                if (System.IO.File.Exists(filename))
                {
                    string[] lines = System.IO.File.ReadAllLines(filename);
                    User u = new User();
                    u.Id = System.IO.Path.GetFileName(directory);
                    foreach(string line in lines)
                    {
                        if (line.Trim() == "") continue;
                        //Cas: 0.00, X: 100.00, Y: 60.00, V_X: 0.00, V_Y: -5.00, P: 15.00, L: 85.00, R: 115.00, nahoru: 0, doleva: 0, doprava: 0
                        string[] parts = line.Split(',');
                        if (parts.Length < 4)
                        {
                            if (line.Trim() == "Zdar!")
                            {
                                u.Success = true;
                            }
                            continue;
                        }
                        double[] numbers = parts.Select(part => double.Parse(part.Split(':')[1].Trim())).ToArray();
                        Timepoint tp = new Timepoint()
                        {
                            Cas = numbers[0],
                            X = numbers[1],
                            Y = numbers[2],
                            VX = numbers[3],
                            VY = numbers[4],
                            Palivo = numbers[5],
                            LDeska = numbers[6],
                            PDeska = numbers[7],
                            Up = numbers[8] > 0.5,
                            Left = numbers[9] > 0.5,
                            Right = numbers[10] > 0.5

                        };
                        u.Timepoints.Add(tp);
                    }
                    t.Users.Add(u);
                }
            }
            currentCase = t;
            autoplay = false;
            SetTimeAndRefresh(0);
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            this.bLoadTestCase_Click(null, null);
        }

        private void bBack_Click(object sender, EventArgs e)
        {
            SetTimeAndRefresh(currentTime - 0.1);
        }

        private void bAdvance_Click(object sender, EventArgs e)
        {
            SetTimeAndRefresh(currentTime + 0.1);
        }

        private void SetTimeAndRefresh(double v)
        {
            currentTime = Math.Max(0, v);
            this.lblTime.Text = currentTime.ToString("#.#");
            this.pictureBox1.Refresh();
        }

        double zoom = 3;
        int width = 600;
        private void pictureBox1_Paint(object sender, PaintEventArgs e)
        {
            if (currentCase == null) return;
            if (currentCase.Users.Count == 0) return;
            e.Graphics.FillRectangle(Brushes.White, new RectangleF(0, 0, (float)zoom * 200, (float)zoom * 200));
        //    e.Graphics.DrawRectangle(Pens.Black, new Rectangle(0, 0, (int)(zoom * 200), (int)(zoom * 200)));
            e.Graphics.DrawLine(new Pen(Brushes.Black)
            {
                Width = 5
            }, new Point((int)(currentCase.Users[0].Timepoints[0].LDeska * zoom), width),
             new Point((int)(currentCase.Users[0].Timepoints[0].PDeska * zoom), width));
            e.Graphics.DrawLine(new Pen(Brushes.Red)
            {
                DashStyle = System.Drawing.Drawing2D.DashStyle.Dash
            }, 
            new PointF(0, width - (int)(zoom * 10)),
            new PointF(width, width - (int)(zoom * 10)));

            int index = 0;
            foreach (var usr in currentCase.Users)
            {
                Timepoint whereItIs = usr.DeterminePositionAt(currentTime);
                Rectangle rectTheShip = new Rectangle(
                    (int)(whereItIs.X * zoom - 10 * zoom),
                    width - (int)(whereItIs.Y * zoom + 10 * zoom),
                    (int)(20 * zoom), (int)(20 * zoom));

                PointF center = new PointF((int)(whereItIs.X * zoom), width - (int)(whereItIs.Y * zoom));
                Brush color = (usr.Success ? Brushes.Green : Brushes.Black);
                float ew = 8;

                try
                {
                    e.Graphics.DrawLine(new Pen(Brushes.Gray, 1)
                    {
                        DashStyle = System.Drawing.Drawing2D.DashStyle.Dot,
                        DashOffset = 1

                    }, center, new PointF(width - 200 + 20 + index * 23, center.Y));
                }
                catch { }
                index++;
            }
            index = 0;
            foreach (var usr in currentCase.Users)
            {
                Timepoint whereItIs = usr.DeterminePositionAt(currentTime);
                Rectangle rectTheShip = new Rectangle(
                    (int)(whereItIs.X * zoom - 10 * zoom),
                    width - (int)(whereItIs.Y * zoom + 10 * zoom),
                    (int)(20 * zoom), (int)(20 * zoom));

                PointF center = new PointF((int)(whereItIs.X * zoom), width - (int)(whereItIs.Y * zoom));
                Brush color = (usr.Success ? Brushes.Green : Brushes.Black);
                float ew = 8;
                e.Graphics.DrawString(usr.Id, usr.Success ? fB : f, color, new PointF(width - 200 + 25 + index * 23, center.Y - 5));
                index++;
            }
            foreach (var usr in currentCase.Users)
            {
                Timepoint whereItIs = usr.DeterminePositionAt(currentTime);
                Rectangle rectTheShip = new Rectangle(
                    (int)(whereItIs.X * zoom - 10 * zoom),
                    width - (int)(whereItIs.Y * zoom + 10 * zoom),
                    (int)(20 * zoom), (int)(20 * zoom));

                PointF center = new PointF((int)(whereItIs.X * zoom), width - (int)(whereItIs.Y * zoom));
                Brush color = (usr.Success ? Brushes.Green : Brushes.Black);
                float ew = 8; 
                e.Graphics.FillEllipse(color, center.X - ew, center.Y - ew, ew, ew);

                /*
                e.Graphics.DrawRectangle(Pens.Black, rectTheShip);
                e.Graphics.DrawString(usr.Id, f, (usr.Success ? Brushes.Green : Brushes.Red),
                    new Point(
                        (int)(whereItIs.X*zoom)-  20,
                        700-(int)(whereItIs.Y* zoom) - 20));*/
            }
            index = 0; 
            foreach (var usr in currentCase.Users)
            {
                Timepoint whereItIs = usr.DeterminePositionAt(currentTime);
                if (whereItIs.Cas == usr.Timepoints.Last().Cas)
                { 
                    Brush color = (usr.Success ? Brushes.Green : Brushes.Black);
                    if (!usr.Success)
                    {
                        index++;
                        continue;
                    }
                    e.Graphics.DrawString(usr.Id + ": " + usr.Timepoints.Last().Palivo.ToString(), f, color, new PointF(usr.Success ? 2 : 2, 5 + index * 15));
                }
                index++;
            }
        }
        Font f = new Font(FontFamily.GenericSansSerif, 8);
        Font fB = new Font(FontFamily.GenericSansSerif, 8, FontStyle.Bold);

        private void bReset_Click(object sender, EventArgs e)
        {
            autoplay = false;
            SetTimeAndRefresh(0);
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            if (autoplay)
            {
                currentTime += 0.02;
                SetTimeAndRefresh(currentTime);
            }
        }
        bool autoplay = false;
        private void bAutoplay_Click(object sender, EventArgs e)
        {
            autoplay = !autoplay;

        }

        private void nTestCase_ValueChanged(object sender, EventArgs e)
        {
            this.bLoadTestCase_Click(null, EventArgs.Empty);
        }

        private void button3_Click(object sender, EventArgs e)
        {
            if (this.nTestCase.Value < 15)
                this.nTestCase.Value++;
            this.bLoadTestCase_Click(null, EventArgs.Empty);
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (this.nTestCase.Value > 1)
            this.nTestCase.Value--;
            this.bLoadTestCase_Click(null, EventArgs.Empty);
        }
    }
    class TestCase
    {
        public List<User> Users = new List<User>();
    }
    class User
    {
        public string Id;
        public bool Success;
        public List<Timepoint> Timepoints = new List<Timepoint>();

        internal Timepoint DeterminePositionAt(double currentTime)
        {
            Timepoint last = Timepoints[0];
            foreach(var tim in Timepoints)
            {
                if (tim.Cas > currentTime)
                {
                    break;
                }
                last = tim;
            }
            if (last == Timepoints.Last())
            {
                return last;
            }
            double deltaSinceLastTimepoint = currentTime - last.Cas;
            Timepoint u = new Timepoint()
            {
                X = last.X + last.VX * deltaSinceLastTimepoint + 0.5 * ((last.Right ? 6 : 0) + (last.Left ? -6 : 0)) * deltaSinceLastTimepoint * deltaSinceLastTimepoint,
                Y = last.Y + last.VY * deltaSinceLastTimepoint + 0.5 * ((last.Up ? 12 : 0) -7) * deltaSinceLastTimepoint * deltaSinceLastTimepoint
            };
            return u;
        }
    }
    public class Timepoint
    {
        public double Cas;
        public double X;
        public double Y;
        public double VX;
        public double VY;
        public double Palivo;
        public double LDeska;
        public double PDeska;
        public bool Up;
        public bool Left;
        public bool Right;
    }
}
