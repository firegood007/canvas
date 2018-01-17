/**
 * Created by rorywu
 */
(function() {
    var _default = {
        width: 600,
        heights: 600,
        color: 'red',
        width: 2
    };
    var _event = {
        init: function(data) {
            var self = this;
            // 有数据就draw,  没有就绑定事件
            if (data) {
                $(this).off('mouseup.path');
                self.renderAll(data);
            } else {
                $(this).off('mouseup.path').on('mouseup.path',  function(e) {
                    self.willNewPath = true;
                    var cox = self.cX = e.offsetX;
                    var coy = self.cY = e.offsetY;
                    self.path.push({x: cox, y: coy});
                    self.render(self.cX, self.cY);
                });
            }
        },
        // 根据数据绘制
        renderAll: function(data) {
            var path = data;

            var self = this;
            self.path = path;
            var result = [];

            path.forEach(function(item, i, arra) {
                self.circle(item.x, item.y);
                if (i !== arra.length - 1) {
                    result.push([arra[i], arra[i + 1]]);
                }
            });
            result.forEach(function(item) {
                self.line(item);
            });
            
            data.length && self.autoDraw(); 
        },
        // 两个点的绘制
        render: function(x, y) {
            this.circle(x, y);
            this.line(this.path);
        },
        //绘制 圆
        circle: function(x, y) {
            var self = this;
            $(this).drawArc({
                layer: true,
                groups: ['path'],
                strokeStyle: self.color,
                strokeWidth: self.width,
                radius: 2,
                x: x,
                y: y
            });
        },
        // 绘制线
        line: function(path) {
            var self = this;
            if (path.length <= 1) return;
            var prev = path[path.length - 2];
            var last = path[path.length - 1];
            var x1 = prev.x, y1 = prev.y;
            var x2 = last.x, y2 = last.y;
            $(this).drawLine({
                layer: true,
                groups: ['path'],
                strokeStyle: self.color,
                strokeWidth: self.width,
                x1: x1, y1: y1,
                x2: x2, y2: y2
            });
        },
        // 改变颜色
        changeColor: function(color) {
            var self = this;
            self.color = color;
            $(this).setLayers({
                strokeStyle: self.color
            }).drawLayers();
        },
        // 重置
        reset: function(data) {
            this.path = [];
            //两种状态， 有数据的 重置 不能绘制
            data ? this.init(data) : this.init();
            $(this).removeLayerGroup('path').drawLayers();
        },
        // 获取路径。
        getPath: function() {
            return this.path;
        },
        // 自动的绘制
        autoDraw: function() {
            var self = this;
            if (self.path.length > 2) {
                var first = self.path[0];
                var last = self.path.slice(-1)[0];
                this.line([last, first]);
            }
            $(this).off('mouseup.path');

        },
        // 判断是否是新画的路径。
        isNewPath: function() {
            return this.willNewPath;
        }
    };
    $.fn.canvasPath = function(options) {
        $.extend(this, _event, _default, options); //合并对象
        this.path = [];
        this.willNewPath = false; //
        if (this.dataPath) {
            this.init(this.dataPath);
        } else {
            this.init();
        }
    };
}());