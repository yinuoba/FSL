1、FSL简介

    FSL(Fei Shang Library),FSL javascript类库。(可查看开发过程中的详细log)

2、文件结构

    core: FSL core库; 

    components: FSL UI组建库; 

    docs: FSL core库及FSL UI库文档); 

    tools:jsDoc(文档生成工具、需java环境)、minify(压缩、混淆、打包工具)、yuicompressor(YUI压缩、混淆工具)、Js.Compressor(js压缩、混淆工具、需.net 3.5环境); 

    demo: 一些例子(有些例子还没理完整，可进 http://www.fclub.cn 查看); 

3、FSL宗旨

    设计一个轻量(gzip压缩后8.3k)、接近原生javascript风格、简单、高效、易用、易维护、易扩展、所有开发人员都能看懂的javascript类库。 

4、注释规范

    方法外部注释遵循jsDoc规范，具体详见：http://code.google.com/p/jsdoc-toolkit/wiki/TagReference; 

    方法内部行内注释遵循C风格注释(//) 