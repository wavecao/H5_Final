(function (window, undefined) {

    var Carousel = function (ele, obj) {

        this.ele = ele;//ul容器
        this.cardsList = this.ele.children();//卡片
        this.cardsNum = this.cardsList.length;//卡片数量 

        this.direction = obj.direction ? obj.direction : 'horizontal';//方向判断
        this.scale = obj.scale;//比例
        this.transition = obj.transition || '500ms';//过渡
        this.transformOrigin = obj.transformOrigin;//变形原点
        this.opacity = obj.opacity;//透明度
        this.offsetDistance = obj.offsetDistance;//间距偏移值

        this.switchBtn = obj.switchBtn;//切换按钮
        this.isClickCard = obj.isClickCard || false;//是否点击卡片切换
        this.isAuto = obj.isAuto || false;//是否自动轮播
        this.interval = obj.interval || 5000;

        this.n = 0;
        this.mediant = Math.floor(this.cardsNum / 2);//中间数
        this.cardsListArr = [].slice.call(this.cardsList);//将卡片对象存到数组中
        this.timer = null;//定时器
        this.cssObj = {};//样式存储对象

        this.certainStyle();
        this.switchEffect();
        this.cardsClick();
        this.switchBtnClick();
        this.autoMove();
        this.switchTimer();

    };

    Carousel.prototype = {

        constructor: Carousel,

        switchTimer: function () {
            var carousel = this;
            if (this.isAuto) {
                this.cardsList.on('mouseover', function () {
                    clearInterval(carousel.timer);
                });
                this.cardsList.on('mouseout', function () {
                    carousel.autoMove();
                });
            };
        },

        //确定的样式
        certainStyle: function () {
            this.cssObj.position = 'absolute';
            if (this.scale) {
                this.scale.length == 1 && this.scale.push(this.scale[0]);
            };
            if(this.direction == 'horizontal'){
                this.cssObj.left = '50%';
                this.availSize = this.ele.outerWidth();
                this.cardSize = this.cardsList.eq(0).outerWidth();
            }else if(this.direction == 'vertical'){
                this.cssObj.top = '50%';
                this.availSize = this.ele.outerHeight();
                this.cardSize = this.cardsList.eq(0).outerHeight();
            };
            this.offsetDistance = this.offsetDistance/2 || this.availSize/2 / (this.cardsNum - 1);
            this.transformOrigin && (this.cssObj.transformOrigin = this.transformOrigin);
            this.cssObj.transition = this.transition;
        },

        //动态样式
        dynamicStyle: function (offsetIndex, offsetIndexAbs, reset) {
            //根据方向确定margin的left或者top值
            if(this.direction == 'horizontal'){
                this.cssObj.marginLeft = - this.cardSize / 2 + this.offsetDistance * offsetIndex / 2 + 'px';
            }else if(this.direction == 'vertical'){
                this.cssObj.marginTop = - this.cardSize / 2 + this.offsetDistance * offsetIndex / 2 + 'px';
            };
            //设置z-index
            this.cssObj.zIndex = reset;
            //设置透明度
            this.opacity && (this.cssObj.opacity = Math.pow(this.opacity, offsetIndexAbs));
            //设置缩放比例
            this.scale && (this.cssObj.transform = 'scale(' + Math.pow(this.scale[0], offsetIndexAbs) + ',' + Math.pow(this.scale[1], offsetIndexAbs) + ')');
        },

        switchEffect: function () {
            var carousel = this;
            var offsetNum = Math.abs(carousel.n - carousel.mediant);
            if (carousel.n == carousel.mediant) {
                return;
            } else if (carousel.n > carousel.mediant) {
                carousel.cardsListArr = carousel.cardsListArr.concat(carousel.cardsListArr.splice(0, offsetNum));
            } else {
                carousel.cardsListArr = carousel.cardsListArr.splice(carousel.cardsNum - offsetNum).concat(carousel.cardsListArr);
            };
            $(carousel.cardsListArr).each(function (i, e) {
                var offsetIndex = i - carousel.mediant,
                    offsetIndexAbs = Math.abs(offsetIndex),
                    reset = carousel.mediant - offsetIndexAbs;
                //设置动态样式
                carousel.dynamicStyle(offsetIndex, offsetIndexAbs, reset);
                $(e).css(carousel.cssObj);
                $(e).attr('n', i);
            });
        },

        cardsClick: function () {
            if (this.isClickCard) {
                var carousel = this;
                $(carousel.cardsListArr).on('click', function () {
                    carousel.n = $(this).attr('n');
                    carousel.switchEffect();
                });
            };
        },

        prev: function () {
            var carousel = this;
            carousel.n = carousel.mediant - 1;
            carousel.n < 0 && (carousel.n = carousel.cardsNum - 1);
            carousel.switchEffect();
        },

        next: function () {
            var carousel = this;
            carousel.n = carousel.mediant + 1;
            carousel.n > carousel.cardsNum - 1 && (carousel.n = 0);
            carousel.switchEffect();
        },

        switchBtnClick: function () {
            var carousel = this;
            if (carousel.switchBtn) {
                carousel.switchBtn.eq(0).on('click', function () {
                    carousel.prev();
                    if (carousel.isAuto) {
                        clearInterval(carousel.timer);
                        carousel.cardsList.eq(carousel.n).one('transitionend', function () {
                            carousel.autoMove();
                        });
                    };
                });
                carousel.switchBtn.eq(1).on('click', function () {
                    carousel.next();
                    if (carousel.isAuto) {
                        clearInterval(carousel.timer);
                        carousel.cardsList.eq(carousel.n).one('transitionend', function () {
                            carousel.autoMove();
                        });
                    };
                });
            };
        },

        autoMove: function () {
            var carousel = this;
            if (carousel.isAuto) {
                clearInterval(carousel.timer);
                carousel.timer = setInterval(function () {
                    carousel.next();
                }, carousel.interval);
            };

        },

    };

    window.Carousel = Carousel;

}(window));