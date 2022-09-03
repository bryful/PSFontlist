(function (me){
    // *********************************************************
   //各種プロトタイプを設定
    String.prototype.trim = function(){
        if (this=="" ) return ""
        else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
    }
    String.prototype.getParent = function(){
        var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(0,i);
        return r;
    }
    //ファイル名のみ取り出す（拡張子付き）
    String.prototype.getName = function(){
        var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
        return r;
    }
    //拡張子のみを取り出す。
    String.prototype.getExt = function(){
        var r="";var i=this.lastIndexOf(".");if (i>=0) r=this.substring(i);
        return r;
    }
    //指定した書拡張子に変更（dotを必ず入れること）空文字を入れれば拡張子の消去。
    String.prototype.changeExt=function(s){
        var i=this.lastIndexOf(".");
        if(i>=0){return this.substring(0,i)+s;}else{return this; }
    }
    //文字の置換。（全ての一致した部分を置換）
    String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}

    FootageItem.prototype.nameTrue = function(){ var b=this.name;this.name=""; var ret=this.name;this.name=b;return ret;}

    String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}
    // *********************************************************
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var exePath = File.decode($.fileName.getParent())+"/PSFontlist.exe";
	var fontlistPath = Folder.userData.fullName + "/PSFontlist.json";
    var fontdata = null;
    // *********************************************************
 	function parse(s)
	{
		var ret = null;
		if ( typeof(s) !== "string") return ret;
		//前後の空白を削除
		s = s.replace(/[\r\n]+$|^\s+|\s+$/g, "");
		s = s.split("\r").join("").split("\n").join("");
		if ( s.length<=0) return ret;

		var ss = "";
		var idx1 =0;
		var len = s.length;
		while(idx1<len)
		{
			var idx2 = -1;
			if ( s[idx1]==="\""){
				var idx2 = s.indexOf("\"",idx1+1);
				if ((idx2>idx1)&&(idx2<s.length)){
					if ( s[idx2+1] !== ":") idx2 = -1;
				}
			}
			if ( idx2 ==-1) {
				ss += s[idx1];
				idx1++;
			}else{
				ss += s.substring(idx1+1,idx2)+":";
				idx1 = idx2+2;
			}
		}
		if ( ss[0]=="{"){
			ss ="("+ss+")";
		}
		try{
			ret = eval(ss);
		}catch(e){
			ret = null;
		}
		return ret;
	}
    // *********************************************************
    var winObj = (me instanceof Panel)? me : new Window('palette{text:"PSFontlist",orientation : "column", properties : {resizeable : true} }');
    var res1 =
'Group{alignment:["fill","fill"],orientation:"column",preferredSize:[400,300],\
btnGet:Button{alignment:["fill","top"],text:"獲得(PSが起動します)"},\
pnlFilter:Panel{alignment:["fill","top"],orientation:"row",text:"Filter",\
edWord1:EditText{alignment:["fill","top"]},\
st0:StaticText{maximumSize:[20,24],text:"or"},\
edWord2:EditText{alignment:["fill","top"]},\
btnFilter:Button{alignment:["fill","top"],maximumSize:[100,24],preferredSize:[100,24],text:"Filter"},\
btnFilterOFF:Button{maximumSize:[50,24],text:"Clear"}},\
edName:EditText{alignment:["fill","top"],properties:{readonly:true}},\
edPostScript:EditText{alignment:["fill","top"],properties:{readonly:true}},\
lstFont:ListBox{alignment:["fill","fill"]}\
}';
    // *********************************************************
    winObj.gr = winObj.add(res1 );
    winObj.layout.layout();
    winObj.gr.edName.graphics.font = ScriptUI.newFont("MS-Gothic",ScriptUI.FontStyle.REGULAR, 20);
    winObj.gr.edPostScript.graphics.font = ScriptUI.newFont("MS-Gothic",ScriptUI.FontStyle.REGULAR, 20);

    // *********************************************************
    winObj.onResize = function()
    {
        winObj.layout.resize();
    }
    winObj.gr.lstFont.onChange = function()
    {
        /*
        if ( (fontdata.fonts !=null)&&(fontdata.fonts != undefined)&&(fontdata.fonts.length>0) ){
            var idx = winObj.gr.lstFont.selection.index;
            winObj.gr.edName.text = fontdata.fonts[idx].family;
            winObj.gr.edPostScript.text = fontdata.fonts[idx].postScriptName;
        }
        */
        if (winObj.gr.lstFont.items.length>0)
        {
            var s = winObj.gr.lstFont.selection.toString();
            var sa = s.split(",");
            winObj.gr.edName.text = sa[0];
            winObj.gr.edPostScript.text = sa[1];
        }
    }
    // *********************************************************
    var makeListbox = function()
    {
        var f = new File(fontlistPath);
        if(f.exists==false)
        {
            alert(fontlistPath+"がありません");
            return;
        }
        fontdata = null;
        if (f.open("r")==true)
        {
            try{
                var s = f.read();
                fontdata = parse(s);
            }catch(e){
                alert("errer! read/parse");
                return;
            }finally{
                f.close();
            }
        }
        winObj.gr.lstFont.removeAll();
        if ( (fontdata.fonts !=null)&&(fontdata.fonts != undefined)&&(fontdata.fonts.length>0) ){
            for (var i=0; i<fontdata.fonts.length;i++)
            {
                var line = fontdata.fonts[i].family + "," + fontdata.fonts[i].postScriptName;
                winObj.gr.lstFont.add("item",line,99999);
            }
        }
    }
    // *********************************************************
    var filterExec = function()
    {
        if ( (fontdata.fonts !=null)&&(fontdata.fonts != undefined)&&(fontdata.fonts.length>0) ){
            var word1 = winObj.gr.pnlFilter.edWord1.text.trim();
            var word2 = winObj.gr.pnlFilter.edWord2.text.trim();

            if((word1=="")&&(word2=="")){
                return;
            }

            winObj.gr.lstFont.removeAll();
            if ( (fontdata.fonts !=null)&&(fontdata.fonts != undefined)&&(fontdata.fonts.length>0) ){
                for (var i=0; i<fontdata.fonts.length;i++)
                {
                    var b = false;
                    if (word1!="")
                    {
                        if ( fontdata.fonts[i].family.indexOf(word1)>=0)
                        {
                            b = true;
                        }
                    }
                    if ((b==false)&&(word2!=""))
                    {
                        if ( fontdata.fonts[i].family.indexOf(word2)>=0)
                        {
                            b = true;
                        }
                    }
                    if(b==true){
                        var line = fontdata.fonts[i].family + "," + fontdata.fonts[i].postScriptName;
                        winObj.gr.lstFont.add("item",line,99999);
                    }


                }
            }
        }
    }
    winObj.gr.pnlFilter.btnFilter.onClick = filterExec;
    // *********************************************************
    var psFontlist = function()
    {
        var ret = false;
        var exe = new File(exePath);
        if (exe.exists==false)
        {
            alert("["+psFontlistPath+"]がありません");
            return ret;
        }
        var sf = new File(fontlistPath);
        var cmd = "\""+exe.fsName+"\" \"" + sf.fsName + "\"";
        var r = system.callSystem(cmd);
        ret =  (r.indexOf("true")==0)
        return ret;
    }
    // *********************************************************
    var getList = function()
    {
        if (psFontlist()==false){
            alert(exePath + "の起動に失敗");
            return;
        }
        makeListbox();
    }
     winObj.gr.btnGet.onClick = getList;
    // *********************************************************
    var main = function()
    {
        var f = new File(fontlistPath);
        if(f.exists==false){
            getList();
        }else{
            makeListbox();
        }

    }
    winObj.gr.pnlFilter.btnFilterOFF.onClick = main;

    main();
    if(winObj instanceof Window ) winObj.show();
})(this);
