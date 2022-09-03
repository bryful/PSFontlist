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
# License

This software is released under the MIT License, see LICENSE.

# Authors

bry-ful(Hiroshi Furuhashi)
twitter:[bryful](https://twitter.com/bryful)
bryful@gmail.com

# References

