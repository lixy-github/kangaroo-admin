var Public = new Object();

// 盐值
Public.salt = 'c077292f-2dc5-493e-a965-00659318c889';

// 手机号验证
Public.phone = function (tel) {
    var phone = tel.trim();
    var reg = /^1\d{10}$/;
    return reg.test(phone);
};

// 密码格式
Public.pwds = function (val) {
    var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
    return reg.test(val)
};

// 邮箱验证
Public.email = function (em) {
    var ema = /^[A-Za-z0-9\u4e00-\u9fa5_]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    return ema.test(em)
}

// 验证数字
Public.Ints = function (value) {
    var reg = /^[0-9]+\.?[0-9]*$/;
    return reg.test(value);
}

// md5加密5次
Public.fiveMd5 = function (val, _this) {
    return _this.$md5(_this.$md5(_this.$md5(_this.$md5(_this.$md5(val)))))
}

// 时间戳转化
Public.timestampToTime = function (timestamp) {
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var propTime = "";
    var date = "";
    if (String(timestamp).indexOf("-") > -1) {
        date = new Date(String(timestamp).replace(/-/g, '/'));
    } else {
        propTime = timestamp;
        if (String(propTime).length < 13) {
            date = new Date(propTime * 1000); 
        } else {
            date = new Date(propTime); 
        }
    }
    
    var Y, M, D, h, m, s;
    Y = date.getFullYear() + '-';
    M = (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return Y + M + D + h + m + s;
};

export default Public;