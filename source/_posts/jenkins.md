---
title: Jenkins如何自动化部署前端项目(安装Jenkins)
cover: /img/image/6.jpg
tags:
  - 运维
  - 前端
date: 2023-08-01 11:33:00
comment: true
---

### Jenkins如何自动化部署前端项目

 首先你需要在你的云服务器上安装java环境以及maven才能继续安装Jenkins

#### 1、安装JDK
 通过yum安装的默认路径为： `usr/lib/jvm`
 
安装命令：```yum -y install java-1.8.0-openjdk*```

在 `usr/lib/jvm` 文件最后加入以下代码配置环境变量


```cmd
cat>> /etc/profile <<EOF
############################## ↓↓↓↓↓↓ set java environment ↓↓↓↓↓↓ #############################
JAVA_HOME=/usr/lib/jvm/java
CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$JAVA_HOME/jre/lib/rt.jar
PATH=$PATH:$JAVA_HOME/bin
export JAVA_HOME CLASSPATH PATH
###############################################################################################
EOF
```

 ###### 查看环境变量
 
 ```cmd
 echo $JAVA_HOME
 echo $PATH
```
 ###### 验证Java是否安装成功
 
 ```cmd
java
javac
java -version
```

 ###### 卸载Jdk
 
 ```cmd
# 查看CentOS自带JDK是否已安装:
yum list installed | grep java
# 如果存在自带的jdk，删除自带的jdk
yum -y remove java-1.8.0-openjdk*
yum -y remove tzdata-java.noarch
```

#### 2、安装maven

```cmd
# 安装yum配置工具
yum install -y yum-utils
# 使用配置工具配置第三方epel源仓库
yum-config-manager --add-repo http://repos.fedorapeople.org/repos/dchen/apache-maven/epel-apache-maven.repo
yum-config-manager --enable epel-apache-maven
# 安装maven
yum install -y apache-maven
```

###### 配置环境变量
在 `/etc/profile` 文件最后加入
```cmd
############################## ↓↓↓↓↓↓ set maven environment ↓↓↓↓↓↓ #############################
MAVEN_HOME=/home/soft/maven/apache-maven-3.8.8
PATH=$PATH:$JAVA_HOME/bin:$MAVEN_HOME/bin
export MAVEN_HOME PATH
################################################################################################
```

###### 验证   `mvn -v`


###### maven配置

在`
/home/soft/maven/apache-maven-3.8.8/conf/settings.xml
`文件中
###### 配置仓库信息如下：
```xml
<!-- /home/soft/maven/apache-maven-3.8.8/conf/settings.xml -->
<localRepository>/home/soft/maven/repository</localRepository>
```
##### 配置阿里中央仓库
```xml
<!-- /home/soft/maven/apache-maven-3.8.8/conf/settings.xml -->
<mirrors>
    <!-- 国内中央仓库的配置-阿里云中央仓库 -->
    <mirror>
        <id>nexus-aliyun</id>
        <mirrorOf>central</mirrorOf>
        <name>Nexus aliyun</name>
        <url>http://maven.aliyun.com/nexus/content/groups/public</url>
    </mirror>
</mirrors>
```
##### 以上操作完成并成功既可安装Jenkins（注意安装版本，我演示的版本为jdk8,最新版不支持jdk8）

下载旧版本Jenkins
```cmd
wget https://mirrors.tuna.tsinghua.edu.cn/jenkins/redhat-stable/jenkins-2.346.3-1.1.noarch.rpm
```
安装下载rpm包
```cmd
yum -y install jenkins-2.346.3-1.1.noarch.rpm
```
查看Jenkins状态
```cmd
systemctl status jenkins
```
如下：
![图](/img/demo.png)
