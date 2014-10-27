node-weixin-enterprise
======================

A super simple project that is used to connect to a weixin/wechat enterprise social account

Please just fork this project into your local, add 4 keys which is crucial when setting up an enterprise robot 

1. Your token
2. Your Corporation Id
3. Your Encoding AES Key
4. Your Agent Id

Then set it up on your http server or any other host provider such as Bluemix, Heroku or Openshift etc

The robot shows the basics of the workflow of the enterprise account

If you type 'help':
It suggest you a list of command in the reply

If you type 'news':
It gives you a simple advertisement, with image for illustration and simple description etc

If you type 'music'
It will give you a pop song, the enterprise account do not provide music, so maybe it is a deprecated function

If you upload an image
It will notify that your image has been uploaded successfully, and tell you to type 'image' for a check up

If you type 'image'
The image uploaded to wechat server shall be loaded to your device

If you upload a voice
It will notify that your voice has been uploaded successfully, and tell you to type 'voice' for a check up

If you type 'voice'
The voice uploaded to wechat server shall be loaded to your device

If you upload a video
It will notify that your video has been uploaded successfully, and tell you to type 'video' for a check up

If you type 'video'
The video uploaded to wechat server shall be loaded to your device

Anyway it is just a sample, further mocking is expected based on these prototypes





