/**********
 file control
 *********/

let handleFileSelect = (e) => {
    // ブラウザ上でファイルを開かないようにしておく
    e.stopPropagation();
    e.preventDefault();
    for (let file of e.dataTransfer.files) {
        appendElement(e, file);
    }
}

//ここでデータを追加する
let appendElement = (e, file) => {
    let name = file.name
    const reader = new FileReader();
	reader.onload = (e) => {
        let el = $('<li>').text(name)
        el.attr('class', 'menu')
        el.attr('data-path', e.target.result)
        el.attr('onclick', 'clickAction("' + e.target.result + '")')
        $('#readFileList').append(el);
	}
	reader.readAsDataURL(file);
}

let handleDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

/**********
 pageLoad
 *********/

$(() => {
    document.querySelector('#navigation').addEventListener('dragover', handleDragOver, false);
    document.querySelector('#navigation').addEventListener('drop', handleFileSelect, false);
});

/**********
 li click action
*********/
let clickAction = (param) => {
    console.log(param)
    let el = '<webview id="target" src="' + param + '" plugins></webview>'
    $('#target').remove()
    $('.content').append(el)
}

let switchToPage = (mode) => {
    let before = after = null
    switch(mode) {
        case 'app':
            before = '#help_page'
            after = '#app_page'
            break;
        case 'help':
            before = '#app_page'
            after = '#help_page'
            break;
    }

    $(before).hide()
    $(after).show()
}

/********
 save as
********/
let writeToLocal = (filename, content) => {
    let errorCallback = e => alert("Error: " + e.name)

    let fsCallback = fs => {
        fs.root.getFile(filename, {create: true}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {

                fileWriter.onwriteend = e => alert("Success! : " + fileEntry.fullPath)
                fileWriter.onerror =　e => alert("Failed: " + e)

                let output = new Blob([content], {type: "application/pdf"});
                fileWriter.write(output);
            }, errorCallback);
        }, errorCallback);
    }
    // クオータを要求する。PERSISTENTでなくTEMPORARYの場合は
    // 直接 webkitRequestFileSystem を呼んでよい
    webkitStorageInfo.requestQuota(PERSISTENT, 1024,
        webkitRequestFileSystem(PERSISTENT, 1024, fsCallback, errorCallback),
        errorCallback);
}
// writeToLocal("hoge.txt", "foo\n");




function _save(base64) {
    let blob = toBlob(base64, 'application/pdf')
    writeToLocal(filename, blob)
}

function toBlob(base64, mime_ctype) {
    // 日本語の文字化けに対処するためBOMを作成する。
    let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);

    let bin = atob(base64.replace(/^.*,/, ''));
    let buffer = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    // Blobを作成
    try {
        var blob = new Blob([bom, buffer.buffer], {
            type: mime_ctype,
        });
    } catch (e) {
        return false;
    }
    return blob;
}