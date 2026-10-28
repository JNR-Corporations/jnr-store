import assert from 'node:assert/strict';import {resolveDownloadURL,downloadFilename,isHTML} from '../js/services/download-url.js';
const base='https://store.test/sub/';
assert.equal(resolveDownloadURL('downloads/my app.apk',base),'https://store.test/sub/downloads/my%20app.apk');
assert.equal(resolveDownloadURL('/downloads/a.apk',base),'https://store.test/downloads/a.apk');
assert.equal(resolveDownloadURL('https://publisher.test/release.apk?token=a%2Bb',base),'https://publisher.test/release.apk?token=a%2Bb');
assert.equal(resolveDownloadURL('app.apk','http://localhost:8080/sub/'),'http://localhost:8080/sub/app.apk');
for(const bad of ['javascript:alert(1)','data:text/plain,no','file:///a.apk','//evil.test/a','#/app/a','https://user:pass@host.test/a.apk','http://outside.test/a','bad\\file.apk'])assert.equal(resolveDownloadURL(bad,base),null,bad);
assert.equal(downloadFilename({id:'one'},'https://host.test/My%20App.apk'),'My App.apk');assert(isHTML({headers:new Headers({'content-type':'text/html; charset=utf-8'})}));assert(!isHTML({headers:new Headers({'content-type':'application/vnd.android.package-archive'})}));
console.log('PASS: APK paths at root/subdirectory, HTTPS URLs and signed queries preserved; unsafe schemes rejected; filenames and HTML detection.');

assert.equal(downloadFilename({id:'a'},'https://host.test/download','attachment; filename="MyApp.apk"'),'MyApp.apk');
assert.equal(downloadFilename({id:'a'},'https://host.test/download',"attachment; filename*=UTF-8''My%20App.apk"),'My App.apk');
assert.equal(downloadFilename({id:'a'},'https://host.test/download','','application/vnd.android.package-archive'),'download.apk');
assert.equal(downloadFilename({id:'a'},'https://host.test/bad%ZZ.apk'),'bad%ZZ.apk');
