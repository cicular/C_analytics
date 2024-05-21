let publicMethodsArray = [];
let privateMethodsArray = [];
let publicMemberVariableArray = [];
let privateMemberVariableArray =[];

// 拡張子なしのファイル名をクラス名とみなす
let className;

// マップを要素に持つ配列の作成
const arrayOfMethodsMaps = new Map();
// 配列
let callMethodAndMemberVariableArray = [];
// 呼び出し先メソッド一覧
let callTargetMethodArray = [];
// 参照もしくは更新してるメンバ変数一覧
let refMemberVariableArray = [];

async function analytics(){
    await readHppFile();
    await readCppFile();

    console.log('マップの内容:');
    arrayOfMethodsMaps.forEach((value, key) => {
        console.log(`${key}:`);
        value.forEach(subArray => {
            console.log(`  ${subArray.join(', ')}`);
        });
    });
}

function judge(methodName, line_value){

    for (const privateMethod of privateMethodsArray){
        // console.log(privateMethod);
        // メソッド呼び出しているか？
        if (line_value.includes(privateMethod)){
            console.log(methodName + "で" + privateMethod + "を呼び出している。")
            callTargetMethodArray.push(privateMethod);
        }
    }
    for (const publicMethod of publicMethodsArray){
        if (line_value.includes(publicMethod)){
            console.log(methodName + "で" + publicMethod + "を呼び出している。")
            callTargetMethodArray.push(publicMethod);
        }
    }
    for (const publicMemberVariable of publicMemberVariableArray) {
        if (line_value.includes(publicMemberVariable)){
            console.log(methodName + "で" + publicMemberVariable + "を参照もしくは更新している。")
            refMemberVariableArray.push(publicMemberVariable);
        }
    }
    for (const privateMemberVariable of privateMemberVariableArray) {
        if (line_value.includes(privateMemberVariable)){
            console.log(methodName + "で" + privateMemberVariable + "を参照もしくは更新している。")
            refMemberVariableArray.push(privateMemberVariable);
        }
    }
}

function readCppFile(){
    return new Promise((resolve, reject) => {
        const fileInputCpp = document.getElementById('fileInputCpp');
        const cppFile = fileInputCpp.files[0];

        if (cppFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const content = event.target.result;
                const lines = content.split('\n');  // CSVファイルの各行を配列に分割

                //メソッド名
                let methodName = "";

                // 各行読み込み
                for (let i = 0; i < lines.length; i++){
                    let line_value = lines[i];

                    // スキップ
                    if (line_value.trim().indexOf("//") === 0) {
                        continue;
                    }
                    if (line_value.trim().indexOf("/*") === 0) {
                        continue;
                    }

                    if (line_value.includes("::") && line_value.includes(className)){
                        console.log(line_value);

                        const match = line_value.match(/::(.*?)\(/);

                        if (match && match[1]) {
                            const extractedString = match[1];
                            // console.log("::と(の間の文字列(メソッド名): " + extractedString);

                            // ループ2回目以降
                            if (methodName !== ""){
                                // 二重配列として格納。
                                callMethodAndMemberVariableArray.push(callTargetMethodArray);
                                callMethodAndMemberVariableArray.push(refMemberVariableArray);
                                arrayOfMethodsMaps.set(methodName, callMethodAndMemberVariableArray);
                                console.log("追加しますた。")

                                console.log('マップの内容:');
                                arrayOfMethodsMaps.forEach((value, key) => {
                                    console.log(`${key}:`);
                                    value.forEach(subArray => {
                                        console.log(`  ${subArray.join(', ')}`);
                                    });
                                });
                            }

                            methodName = extractedString;
                            // spliceメソッドで全ての要素を削除（初期化）
                            callMethodAndMemberVariableArray.splice(0, callMethodAndMemberVariableArray.length);
                            callTargetMethodArray.splice(0, callTargetMethodArray.length);
                            refMemberVariableArray.splice(0, refMemberVariableArray.length);
                        }

                        // 次の行からチェックしていく。
                        continue;
                    }

                    judge(methodName, line_value);
                }
                resolve();
            };
            reader.onerror = function(event) {
                console.error("ファイルの読み込み中にエラーが発生しました", event);
                reject(event);
            };
            reader.readAsText(cppFile, 'UTF-8');

        } else {
            alert('ファイル2を選択してください。');
        }
    });
}

function readHppFile() {
    return new Promise((resolve, reject) => {
        const fileInputHpp = document.getElementById('fileInputHpp');
        const hppFile = fileInputHpp.files[0];

        if (hppFile) {
            const fileName = hppFile.name;
            className = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;

            const reader = new FileReader();
            reader.onload = function(event) {
                const content = event.target.result;
                const lines = content.split('\n');  // CSVファイルの各行を配列に分割
                // const output = lines.map((line, index) => `行${index + 1}: ${line}`).join('\n');
                
                let public_flg = false;
                let private_flg = false;

                for (let i = 0; i < lines.length; i++){
                    let line_value = lines[i];
                    
                    if (line_value.includes("public:")) {
                        public_flg = true;
                        private_flg = false;
                        continue;
                    }
                    if (line_value.includes("private:")) {
                        private_flg = true;
                        public_flg = false;
                        continue;
                    }
                    if(!public_flg & !private_flg){
                        continue;
                    }
                    if (line_value.includes("};")) {
                        private_flg = false;
                        public_flg = false;
                        continue;
                    }
                    if (line_value.trim().indexOf("//") === 0) {
                        private_flg = true;
                        public_flg = false;
                        continue;
                    }
                    if (line_value.trim().indexOf("/*") === 0) {
                        private_flg = true;
                        public_flg = false;
                        continue;
                    }

                    let memberPart = line_value.trim().split(' ')[1];
                    
                    if (memberPart.startsWith("m_")){
                        memberPart = memberPart.replace(";", "").trim();
                        if (public_flg){
                            publicMemberVariableArray.push(memberPart);
                        }else if (private_flg){
                            privateMemberVariableArray.push(memberPart);
                        }
                    }else{
                        // かっこの直前まで
                        const indexOfParen = memberPart.indexOf('(');
                        if (public_flg){
                            publicMethodsArray.push(memberPart.substring(0, indexOfParen));
                        }
                        if (private_flg){
                            privateMethodsArray.push(memberPart.substring(0, indexOfParen));
                        }
                    }
                }

                console.log("publicメソッド")
                publicMethodsArray.forEach(element => {
                    console.log(element);
                });
                console.log("privateメソッド")
                privateMethodsArray.forEach(element => {
                    console.log(element);
                });

                console.log("privateメンバ")
                privateMemberVariableArray.forEach(element => {
                    console.log(element);
                });

                resolve();

                // document.getElementById('fileContent').textContent = output;
            };
            reader.onerror = function(event) {
                console.error("ファイルの読み込み中にエラーが発生しました", event);
                reject(event);
            };
            reader.readAsText(hppFile, 'UTF-8');
        } else {
            alert('ファイルを選択してください。');
        }
    });
}
