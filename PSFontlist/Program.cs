using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.Diagnostics;
using System.IO;
namespace PSFontlist
{
	class Program
	{
		static string FindPS()
		{
			string ret = "";
			string[] pstbl = new string[]
			{
				@"C:\Program Files\Adobe\Adobe Photoshop 2022\Photoshop.exe",
				@"C:\Program Files\Adobe\Adobe Photoshop 2021\Photoshop.exe",
				@"C:\Program Files\Adobe\Adobe Photoshop 2020\Photoshop.exe",
				@"C:\Program Files\Adobe\Adobe Photoshop CC 2019\Photoshop.exe",
				@"C:\Program Files\Adobe\Adobe Photoshop CC 2018\Photoshop.exe"
			};

			foreach(string s in pstbl)
			{
				if (File.Exists(s)==true)
				{
					ret = s;
					break;
				}
			}
			return ret;

		}
		static string FindRunningPS()
		{
			string ret = "";
			Process[] ps = Process.GetProcesses();
			foreach (Process p in ps)
			{
				try
				{
					if (p.ProcessName == "Photoshop")
					{
						ret = p.MainModule.FileName;
						break;
					}
				}
				catch
				{
				}
			}
			if (ret == "") ret = FindPS();
			return ret;
		}
		//***********************************************************
		/// <summary>
		/// 
		/// </summary>
		/// <returns></returns>
		static bool CallPS(string p)
		{
			bool ret = false;

			string psp = FindRunningPS();
			if (psp == "") return ret;

			string jsx = Properties.Resources.JSX;
			string jsxPath = Path.Combine(Path.GetTempPath(), "GetFontlist.jsx");
			string savePath = p;

			// C:\AAA\AA.json
			string savePathJ = savePath.Replace("\\", "/");
			// C:/AAA/AA.json
			savePathJ = "/" + savePathJ[0] + savePathJ.Substring(2);

			jsx = jsx.Replace("$JSONPATH", savePathJ);
			try
			{
				if(File.Exists(savePath)==true)
                {
					File.Delete(savePath);
                }
				File.WriteAllText(jsxPath, jsx, Encoding.GetEncoding("utf-8"));
				Process ps = new Process();
				ps.StartInfo.FileName = psp;
				ps.StartInfo.Arguments = "\"" + jsxPath + "\"";
				if(ps.Start()==false)
                {
					return ret;
                }
				int count = 0;

				while(count<30)
                {
					System.Threading.Thread.Sleep(1000);
					if(File.Exists(savePath) == true)
                    {
						ret = true;
						break;
                    }
					count++;
				}

			}
			catch
			{
				Console.WriteLine("false // eee");
				return ret;
			}
			return ret;
		}
		static void Usage(bool b)
		{
			string s = "";
			if (b == true)
			{
				s += "true\r\n";

            }
            else
            {
				s += "false\r\n";
			}

			s += "// [PSFontlist.exe]\r\n";
			s += "// Adobe Photoshopを使ってインストールされているフォントの情報一覧ををJSON形式で書き出します\r\n";
			s += "// 一般的なJSONです。toSource()で作成された物ではありません\r\n";
			s += "// {\"fonts\":[\r\n";
			s += "// \t{\r\n";
			s += "// \t\t\"name\":\"MS Gothic\",\r\n";
			s += "// \t\t\"family\":\"ＭＳ ゴシック\",\r\n";
			s += "// \t\t\"postScriptName\":\"MS-Gothic\"\r\n";
			s += "// \t}\r\n";
			s += "// \t]\r\n";
			s += "// }\r\n";
			s += "// \tusage: PSFontlist [savejsonfilepath]\r\n";

			Console.WriteLine(s);
		}
		static void Main(string[] args)
		{
			string savePath = "";
			if (args.Length > 0)
            {
				for (int i=0; i< args.Length;i++)
                {
					string pf = Path.GetDirectoryName(args[i]);
					if ((pf=="")||(Directory.Exists(pf)==true))
                    {
						savePath = args[i];
						break;
					}
                }
            }
			if (savePath == "")
            {
				Usage(false);
            }
            else
            {
				if (CallPS(savePath) == true)
				{
					Console.WriteLine("true");
				}
				else
				{
					Console.WriteLine("false");
				}
			}

		}
	}
}
