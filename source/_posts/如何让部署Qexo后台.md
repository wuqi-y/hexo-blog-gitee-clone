---
abbrlink: ''
categories:
- - 运维
cover: /img/image/6.jpg
date: '2023-11-13T14:54:40.051833+08:00'
tags:
- hexo
- qexo
title: 如何让部署Qexo后台
updated: 2023-11-13T14:54:40.623+8:0
---
#### 首先查看Python和pip3的版本，如果不对应最好安装如图中的版本不容易出错

![python和pip3版本](/img/a/py_v.png)

### 编辑配置

以使用 Mysql 为例, 确认好安装相关依赖后在`manage.py`的同级目录下创建并修改 `configs.py`

```python
import pymysql
pymysql.install_as_MySQLdb()
DOMAINS = ["127.0.0.1", "yoursite.com"]
DATABASES = {
    'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'qexo',
            'USER': 'root',
            'PASSWORD': 'password',
            'HOST': '127.0.0.1',
            'PORT': '3306',
            'OPTIONS': {
                "init_command": "SET sql_mode='STRICT_TRANS_TABLES'"
            }
    }
}

```

然后在项目根目录执行如下

```cmd
pip3 install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000 --noreload
```


##### 如果`pip3 install -r requirements.txt` 时报错了，查看此文件夹，替换如下requirements.txt

```cmd
Django==3.2.18
PyMySQL
boto3
requests
PyGithub
python-gitlab
html2text
PyYAML
urllib3
Markdown
djongo
django-cors-headers
pymongo
dnspython
sqlparse
psycopg2-binary
cryptography
pyopenssl
oss2
beautifulsoup4
```

最后在ip下加8000端口查看能否进入项目

#### 常驻项目进程

`nohup python3 manage.py runserver 0.0.0.0:8000 --noreload`
