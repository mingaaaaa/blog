最近受人所托帮忙做点前端活，然后这个项目用到了**RSA**加密，之前没有涉及到加密，正好这次学习一下。

RSA加密会用一个公钥和私钥

### jsencrypt

**jsencrypt**是一个基于rsa加解密的js库，使用如下：

1. 引入该插件

   ```javascript
   import JSEncrypt from 'jsencrypt'
   ```

   

2. 使用JSEncrypt进行加密

   ```javascript
   function encryptedData(data) {
     let encryptor = new JSEncrypt();
     encryptor.setPublicKey(publicKey);
     let cptData = encryptor.encryptLong(data);
     return cptData;
   }
   ```

   

