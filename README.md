# 智慧庭审 前端程序

## 开发环境

1. 测试案件：

   > (2019)鲁 16 民初 15 号案件是(2019)鲁 16 民初 17 号的原审

   - (2019)鲁 16 民初 17 号 caseSn = 195400000249076
     卷宗维护：http://129.1.5.86:7766/escloud_dzjz/jzgl/mainpage.html?param=dXNlcmlkPTBGQzAwMDAxJmNhc2Vfc249MTk1NDAwMDAwMjQ5MDc2JnJlYWRvbmx5PWZhbHNlJmNhblZpZXdGaj10cnVlJmVhc3lfc3R5bGU9ZGVmYXVsdCZqemJsPWZhbHNlJmp6ank9bnVsbCZibWp5PW51bGwmZHpqenBjPW51bGwmZHpqemJsQ2hlY2s9bnVsbCZqenBiPWZhc2xlJmNvdXJ0bm89MEZDJmRhYmw9ZmFsc2UmY2FuVmlld1dqPXRydWUmanpweD0mc2FzY1JlYWRvbmx5PWZhbHNl
   - (2019)鲁 16 民初 15 号 caseSn = 195400000249051
     卷宗维护：http://129.1.5.86:7766/escloud_dzjz/jzgl/mainpage.html?param=dXNlcmlkPTBGQzAwMDAxJmNhc2Vfc249MTk1NDAwMDAwMjQ5MDUxJnJlYWRvbmx5PWZhbHNlJmNhblZpZXdGaj10cnVlJmVhc3lfc3R5bGU9ZGVmYXVsdCZqemJsPWZhbHNlJmp6ank9bnVsbCZibWp5PW51bGwmZHpqenBjPW51bGwmZHpqemJsQ2hlY2s9bnVsbCZqenBiPWZhc2xlJmNvdXJ0bm89MEZDJmRhYmw9ZmFsc2UmY2FuVmlld1dqPXRydWUmanpweD0mc2FzY1JlYWRvbmx5PWZhbHNl

2. 测试用户
   - 法官：admin 1
   - 当事人：370203199909099999

# 人脸登录chrome获取摄像头权限
通过传递相应参数来启动 Chrome Insecure origins treated as secure flag 并填入相应白名单。

1. 打开 chrome://flags/#unsafely-treat-insecure-origin-as-secure
2. 将该 flag 切换成 enable 状态
3. 输入框中填写需要开启的域名，譬如 http://example.com"，多个以逗号分隔。
重启后生效。