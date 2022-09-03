# PSFileList
Adobe Photoshopを使ってインストールされているフォントの情報一覧を出力するDOSコマンドです。<br>

# Usage
PSFontlist [書き出すファイルのパス]<enter><br>
<br>
書き出すファイルは一般的なJSONファイルです。<br>
```
{"fonts\":[
   {
        "name\":\"MS Gothic\",
        "family\":\"ＭＳ ゴシック\",
        "postScriptName\":\"MS-Gothic\"
    }
   ]
}
```
json2.jsでparseしてデータをオブジェクトとして扱えます。

# CAUTION 注意

* Photoshopを起動させます！
* その時確認ダイアログが出ますので「はい(y)」を選んでください。
* ノートン等のセキュリティソフトが実行を停止させる時があるので注意してください。

# License

This software is released under the MIT License, see LICENSE.

# Authors

bry-ful(Hiroshi Furuhashi)
twitter:[bryful](https://twitter.com/bryful)
bryful@gmail.com

# References

