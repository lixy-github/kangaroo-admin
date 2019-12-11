var Public = new Object()

// 盐值
Public.salt = 'c077292f-2dc5-493e-a965-00659318c889'

// 手机号验证
Public.phone = function (tel) {
  var phone = tel.trim()
  var reg = /^1\d{10}$/
  return reg.test(phone)
}

// 密码格式
Public.pwds = function (val) {
  var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/
  return reg.test(val)
}

// 邮箱验证
Public.email = function (em) {
  var ema = /^[A-Za-z0-9\u4e00-\u9fa5_]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return ema.test(em)
}

// 验证数字
Public.Ints = function (value) {
  var reg = /^[0-9]+\.?[0-9]*$/
  return reg.test(value)
}

// md5加密5次
Public.fiveMd5 = function (val, _this) {
  return _this.$md5(_this.$md5(_this.$md5(_this.$md5(_this.$md5(val)))))
}

// 时间戳转化
Public.timestampToTime = function (timestamp) {
  // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var propTime = ''
  var date = ''
  if (String(timestamp).indexOf('-') > -1) {
    date = new Date(String(timestamp).replace(/-/g, '/'))
  } else {
    propTime = timestamp
    if (String(propTime).length < 13) {
      date = new Date(propTime * 1000)
    } else {
      date = new Date(propTime)
    }
  }

  var Y, M, D, h, m, s
  Y = date.getFullYear() + '-'
  M = (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
  h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
  m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
  s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
  return Y + M + D + h + m + s
}

// 编辑器配置
Public.UEconfig = {
  serverUrl: '',
  // 编辑器不自动被内容撑高
  autoHeightEnabled: false,
  // 初始容器高度
  initialFrameHeight: 200,
  // 初始容器宽度
  initialFrameWidth: '100%',
  // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
  UEDITOR_HOME_URL: 'static/UEditor/',
  toolbars: [
    [
      'undo', // 撤销
      'redo', // 重做
      'formatmatch', // 格式刷
      '|',
      'fontfamily', // 字体
      'fontsize', // 字号
      'forecolor', // 字体颜色
      'backcolor', // 背景色
      'bold', // 加粗
      'italic', // 斜体
      'underline', // 下划线
      'strikethrough', // 删除线
      'subscript', // 下标
      'superscript', // 上标
      'horizontal', // 分隔线
      'removeformat', // 清除格式
      '|',
      'pasteplain', // 纯文本粘贴模式
      'preview', // 预览
      '|',
      'time', // 时间
      'date', // 日期
      'inserttitle', // 插入标题
      'link', // 超链接
      'emotion', // 表情
      'spechars', // 特殊字符
      '|',
      'indent', // 首行缩进
      'justifyleft', // 居左对齐
      'justifyright', // 居右对齐
      'justifycenter', // 居中对齐
      'justifyjustify', // 两端对齐
      'paragraph', // 段落格式
      'insertorderedlist', // 有序列表
      'insertunorderedlist', // 无序列表
      'fullscreen', // 全屏
      'rowspacingtop', // 段前距
      'rowspacingbottom', // 段后距
      '|',
      'imagenone', // 默认
      'imageleft', // 左浮动
      'imageright', // 右浮动
      'attachment', // 附件
      'imagecenter', // 居中
      'wordimage', // 图片转存
      'lineheight', // 行间距
      'simpleupload',
      'insertimage',
      'edittip ' // 编辑提示
    ]
  ]
}

export default Public
