import * as dotenv from 'dotenv'  // 加载.env文件中的环境变量
import fs from 'fs'
import path from 'path'
import COS from 'cos-nodejs-sdk-v5'

dotenv.config()

const cos = new COS({
  SecretId: process.env.SECRETID, // 推荐使用环境变量获取；用户的 SecretId，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
  SecretKey: process.env.SECRETKEY, // 推荐使用环境变量获取；用户的 SecretKey，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
});

const uploadArr = []

function uploadFile (file_path,file_name) {
 const promise = cos.putObject({
    Bucket: process.env.BUCKET, /* 必须 */
    Region: process.env.REGION,    /* 必须 */
    Key: `hexo/img/image/${file_name}`,              /* 必须 */
    StorageClass: 'STANDARD',
    Body: fs.createReadStream(file_path), // 上传文件对象
    onProgress: function(progressData) {
        // console.log(JSON.stringify(progressData));
    }
   }).then(data => {
    // console.log(data);
   })
  uploadArr.push(promise)
}


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
      uploadFile(filePath,file)
    }
    // 如果是文件夹，则进行递归调用以获取其内部的文件
    else if (stats.isDirectory()) {
      getFilesInFolder(filePath);
    }
  });
}

// 调用函数并传入文件夹路径
// getFilesInFolder(path.resolve('./themes/Acrylic/source/img/image/'));

uploadArr.length &&
  console.log('上传中，请稍等...') &&
    Promise.all(uploadArr).then(() => {
      console.log('全部上传成功');
    })


cos.getObjectUrl(
  {
    Bucket: process.env.BUCKET, /* 必须 */
    Region: process.env.REGION,    /* 必须 */
    Key: `hexo/img/image/0.jpg`,              /* 必须 */
    Sign: true,
    Expires: 60,
    /* 传入的请求参数需与实际请求相同，能够防止用户篡改此 HTTP 请求的参数 */
    // Query: {
    //   'imageMogr2/thumbnail/200x/': '',
    // },
    // /* 传入的请求头部需包含在实际请求中，能够防止用户篡改签入此处的 HTTP 请求头部 */
    Headers: {
      host: 'hexo-1314120196.cos.ap-nanjing.myqcloud.com', /* 指定 host 访问，非指定的 host 访问会报错403 */
    },
  },
  function (err, data) {
    console.log(err || data.Url);
  }
)

// 执行命令   node .\themes\Acrylic\source\js\upload.mjs



