
import * as dotenv from 'dotenv'  // 加载.env文件中的环境变量
dotenv.config()


import fs from 'fs'
import path from 'path'

// 阿里云oss存储
import OSS from 'ali-oss'
 
const client = new OSS({
  // region填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'oss-cn-nanjing',
  // 阿里云账号RAM用户进行API访问或日常运维。
  accessKeyId: process.env.ACCESSKEYID,
  accessKeySecret: process.env.ACCESSKEYSECRET,
  bucket: 'wuqi-y',
})
 
const uploadArr = []

function getFilesInFolder(folderPath) {
  // 读取文件夹中的文件列表
  const files = fs.readdirSync(folderPath);

  // 遍历文件列表并处理每个文件
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    // 检查文件的状态
    const stats = fs.statSync(filePath);
    // 如果是文件，则打印文件路径
    if (stats.isFile()) {
      putStream(filePath,file)
    }
    // 如果是文件夹，则进行递归调用以获取其内部的文件
    else if (stats.isDirectory()) {
      getFilesInFolder(filePath);
    }
  });
}

// 调用函数并传入文件夹路径
// getFilesInFolder(path.resolve('./themes/Acrylic/source/img/image/'));

async function putStream (filePath,filename) {
  try {

    // let stream = fs.createReadStream(path.resolve('./themes/Acrylic/source/img/image/0.jpg'))
    const promise = client.putStream(`hexo/img/image/${filename}`,fs.createReadStream(filePath));
    uploadArr.push(promise)
  } catch (e) {
    console.log(e)
  }
}

uploadArr.length &&
  console.log('上传中，请稍等...') &&
    Promise.all(uploadArr).then(() => {
      console.log('全部上传成功');
    })

// putStream();   


// 设置防盗链
async function putBucketReferer () {
  try {
  const result = await client.putBucketReferer('wuqi-y', true, [
    '*.wuwang.love',
    '127.0.0.1:4000',
    'http://localhost:4000/',
    // 'wuqi-y.oss-cn-nanjing.aliyuncs.com'
  ]);

  console.log(result);
  } catch (e) {
    console.log(e);
  }
 }
putBucketReferer();

// let url = client.signatureUrl('hexo/img/image/0.jpg', { 
//   // 设置过期时间，默认值为1800秒。
//   expires: 600, 
  
// });
// console.log(url);



export { client }



// client.put('hexo/img/image/0.jpg',fs.createReadStream(path.resolve('./themes/Acrylic/source/img/image/0.jpg'))).then(r => console.log(r))
// console.log(fs.createReadStream(path.resolve('./themes/Acrylic/source/img/image/0.jpg')));


// 执行命令   node .\themes\Acrylic\source\js\upload-ali-oss.mjs
